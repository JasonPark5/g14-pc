<template>
  <div>
    <c-table
      ref="table"
      title="관련 가동전점검 개선사항 목록"
      :columns="grid.columns"
      :gridHeight="gridHeight"
      :data="moc.prestartupImproves"
      :merge="grid.merge"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
      @linkClick="linkClick"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="false"
            :isImmShow="true"
            ibmTaskTypeCd="ITT0000030"
            ibmTaskUnderTypeCd="ITTU000050"
            @imprChange="imprChange"
          />
        </template>
      </template>
    </c-table>
    <c-table
      ref="tableImpr"
      title="항목외 개선 목록"
      :columns="gridImpr.columns"
      :data="gridImpr.data"
      :gridHeight="gridHeight"
      :usePaging="false"
      :filtering="false"
      :columnSetting="false"
      @linkClick="(row: imprType, col: tableColumnType) => linkClick(row, col, 'IMM')"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- 개선요청 -->
          <c-btn
            v-if="editable && !disabled && moc.sopMocId"
            :showLoading="false"
            label="개선요청"
            icon="add"
            @btnClicked="addImpr"
          />
          <!-- 즉시조치 -->
          <c-btn
            v-if="editable && !disabled && moc.sopMocId"
            :showLoading="false"
            label="즉시조치"
            icon="add"
            @btnClicked="addIimImpr"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

/******************************
 * @import_선언
 * TODO 아래 순서에 맞추어 import (각 순서 마다 띄우기)
 *  * 1. Dependency
 *  * 2. Utils
 *  * 3. Types
 *  * 4. Stores
 *  * 5. Vue
 *  * 6. Etc (생길 시 얘기.)
 *******************************/
import { imprType } from '../ibm/impr'
import { mocType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'mocPreStartupImpr'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['saveCallback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  moc: mocType
  param?: {
    sopMocId: string
  }
  disabled: boolean
  height: string
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  moc: () => {
    return {
      sopMocId: '', // MOC 일련번호
      mocNo: '', // moc 관리번호
      plantCd: '', // 사업장 코드
      processCd: '', // 공정
      judgmentUserId: '', // 판정자 ID
      judgmentUserName: '', // 판정자 명
      initiativeUserId: '', // 발의자 ID
      initiativeUserName: '', // 발의자 명
      initiativeDeptCd: '', // 발의 부서 코드
      initiativeDeptName: '', // 발의 부서명
      mocTitle: '', // 변경관리 제목
      mocSummary: '', // 변경 개요
      mocTypeCd: 'MT00000001', // 변경구분_공통코드(정상/비상/임시)
      mocWriteLevelCd: null, // 변경등급_작성
      mocConfirmLevelCd: null, // 변경등급_검토
      processSatefySecureMeasures: '', // 공정안전 확보 대책
      technicalBasisProcessDesign: '', // 변경계획에 대한 공정 및 설계의 기술근거
      safetyReliabilityImprovementEffect: '', // 안전성에 필요한 사항 및 신뢰성 향상 효과
      leaderOpinion: '', // 팀장의견
      relatedLaws: '', // 관련 볍령_텍스트
      processRiskAssessFlag: '', // 공정위험성 평가 여부
      jobRiskAssessFlag: '', // 작업위헝성 평가 여부
      mocPeriod: [],
      mocStartDate: '', // 변경 시작일
      mocEndDate: '', // 변경 종료일
      mocStepCd: '', // 변경관리 단계
      mocActionDeptCd: '', // 변경실행 부서코드
      mocActionResponsibilityUserId: '', // 변경실행 책임자 ID
      mocCompleteCheckUserId: '', // 변경완료 확인자 ID
      mocCompleteCheckDeptCd: '', // 변경완료 확인 부서 코드
      mocCompleteOpinion: '', // 변경완료 의견
      mocBenefitCds: '', // 변경관리 기대효과_복수
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      checklists: [],
      checklistEquips: [],
      checklistDrives: [],
      equipments: [],
      reviews: [],
      committees: [],
      committeeReviewItems: [],
      committeeHold: {
        sopMocId: '', // MOC 일련번호
        firstHoldDate: '', // (최초) 개최일
        firstHoldArea: '', // (최초) 개최장소
        firstReviewContents: '', // (최초) 검토내용
        firstReviewResult: '', // (최초) 검토결과
        professionalHoldDate: '', // (전문가) 개최일
        professionalHoldArea: '', // (전문가) 개최장소
        professionalReviewContents: '', // (전문가) 검토내용
        professionalReviewResult: '', // (전문가) 검토결과
        finalHoldDate: '', // (최종) 개최일
        finalHoldArea: '', // (최종) 개최장소
        finalReviewContents: '', // (최종) 검토내용
        finalReviewResult: '', // (최종) 검토결과
        changeApprovalFlag: '', // 변경 승인 여부
        changeApprovalReason: '', // 변경 승인 사유
        changeApprovalDate: '', // 승인일
        changeKeepFlag: '', // 변경유지 여부
        changeKeepReason: '', // 변경유지 사유
        regUserId: '', // 등록자 ID
        chgUserId: '' // 수정자 ID
      },
      relatedWorks: [],
      prestartupImproves: [],
      isPrestartupImproves: 0,
      improves: [],
      imprImmData: [],
      imprData: []
    }
  },
  param: () => {
    return {
      sopMocId: '' // MOC 일련번호
    }
  },
  disabled: false,
  height: '700px'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  merge: [
    { index: 0, colName: 'checkName' },
    { index: 1, colName: 'equipmentName' },
    { index: 2, colName: 'mergeCheck1' },
    { index: 3, colName: 'mergeCheck2' },
    { index: 4, colName: 'mergeCheck2' },
    { index: 5, colName: 'mergeCheck2' }
  ],
  columns: [
    {
      name: 'checkName',
      field: 'checkName',
      label: '가동전점검명',
      align: 'center',
      style: 'width:200px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비',
      align: 'center',
      style: 'width:120px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'psrCheckTypeName',
      field: 'psrCheckTypeName',
      label: '점검유형',
      align: 'center',
      style: 'width:130px',
      sortable: false
    },
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목',
      sortable: false,
      child: [
        {
          name: 'level',
          field: 'level',
          label: '대분류/중분류/소분류',
          align: 'left',
          // style: 'width:850px',
          sortable: false
        }
      ]
    },
    {
      name: 'psrCheckPeriodName',
      field: 'psrCheckPeriodName',
      label: '점검시기',
      align: 'center',
      style: 'width:180px',
      sortable: false
    },
    {
      name: 'judgmentResultFlagName',
      field: 'judgmentResultFlagName',
      label: '적합여부',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      type: 'custom',
      style: 'width:200px',
      sortable: false
    }
  ],
  data: []
  // height: '475px'
})
const gridImpr = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'ibmClassName',
      field: 'ibmClassName',
      label: '구분',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'actionContents',
      field: 'actionContents',
      label: '조치내용',
      align: 'left',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'actionCompleteDate',
      field: 'actionCompleteDate',
      label: '조치완료일',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ],
  data: []
})
const impListUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let numHeight = props.height ? Number(_.replace(props.height, 'px', '')) / 2 - 25 : 400
  if (numHeight < 300) numHeight = 300
  return String(numHeight) + 'px'
})
const imprComponent = computed(() =>
  markRaw(defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`)))
)

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  init()
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  impListUrl.value = selectConfig.sop.ibm.improve.others.url
  // code setting
  // list setting
  getImpList()
}
/******************************
 * TODO (목적): 항목 외 개선 정보 조회
 *******************************/
function getImpList() {
  if (props.param.sopMocId) {
    $http({
      url: impListUrl.value,
      method: 'GET',
      params: {
        ibmTaskTypeCd: 'ITT0000025',
        ibmTaskUnderTypeCd: 'ITTU000040',
        relationTableKey: props.param.sopMocId
      }
    }).then((_result: any) => {
      gridImpr.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 개선 정보 변경
 *******************************/
function imprChange() {
  // emits('imprChange')
}
/******************************
 * TODO (목적): 개선 상세 팝업 표시
 * @param (1): 행 정보
 * @param (2): 컬럼 정보
 * @param (3): 링크 구분
 *******************************/
function linkClick(row: any, col: tableColumnType, flag?: string) {
  if (col.name === 'customCol' || col.name === 'ibmTitle') {
    if (row.ibmClassCd === 'IC00000001') {
      popupOptions.value.title = '개선'
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
      )
    } else {
      popupOptions.value.title = '즉시조치'
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`))
      )
    }
    popupOptions.value.param = {
      sopImprovementId: row.sopImprovementId
    }
    popupOptions.value.width = '80%'
    popupOptions.value.visible = true
    if (flag === 'IMM') {
      popupOptions.value.closeCallback = closeImmImprPopup
    } else {
      popupOptions.value.closeCallback = closeImprPopup
    }
  } else if (col.name === 'equipmentName') {
    popupOptions.value.title = '설비 상세'
    popupOptions.value.param = row
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/mdm/fim/equipmentDetail.vue`))
    )
    popupOptions.value.width = '90%'
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closeOthersPopup
  } else {
    popupOptions.value.title = '가동전점검 상세'
    popupOptions.value.param = {
      sopPrestartupCheckId: row ? row.sopPrestartupCheckId : ''
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/psr/preStartupReviewDetail.vue`))
    )
    popupOptions.value.width = '90%'
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closeOthersPopup
  }
}
/******************************
 * TODO (목적): 설비, 가동전점검 팝업 닫기
 *******************************/
function closeOthersPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 개선 팝업 닫기
 *******************************/
function closeImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  emits('saveCallback', props.moc.sopMocId)
}
/******************************
 * TODO (목적): 즉시조치 팝업 닫기
 *******************************/
function closeImmImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImpList()
}
/******************************
 * TODO (목적): 개선 요청 팝업 표시
 *******************************/
function addImpr() {
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: props.moc.mocTitle,
    relationTableKey: props.moc.sopMocId,
    ibmTaskTypeCd: 'ITT0000025',
    ibmTaskUnderTypeCd: 'ITTU000040'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
/******************************
 * TODO (목적): 즉시조치 팝업 표시
 *******************************/
function addIimImpr() {
  popupOptions.value.title = '즉시조치'
  popupOptions.value.param = {
    requestContents: props.moc.mocTitle,
    relationTableKey: props.moc.sopMocId,
    ibmTaskTypeCd: 'ITT0000025',
    ibmTaskUnderTypeCd: 'ITTU000040'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprImmDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
/******************************
 * TODO (목적): 개선요청/즉시조치 팝업 닫기
 *******************************/
function closeAddImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImpList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
