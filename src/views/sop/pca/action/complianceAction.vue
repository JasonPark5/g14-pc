<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="imprTable1"
        title="평가항목별 개선목록"
        :columnSetting="false"
        :usePaging="false"
        :filtering="false"
        :columns="gridImpr.columns"
        :data="gridImpr.data"
        :merge="gridImpr.merge"
        :gridHeight="gridheight2"
      >
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'customCol'">
            <component
              :is="imprComponent"
              :col="col"
              :props="props"
              :inputEditable="false"
              :isImmShow="true"
              ibmTaskTypeCd="ITT0000035"
              ibmTaskUnderTypeCd="ITTU000060"
              @imprChange="getList"
            />
          </template>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="imprTable2"
        title="항목외 개선 목록"
        :columns="gridImpr2.columns"
        :data="gridImpr2.data"
        :gridHeight="gridheight2"
        :usePaging="false"
        :filtering="false"
        :columnSetting="false"
        @linkClick="linkClick"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled && param.selfInspectionResultId"
              label="개선요청"
              :showLoading="false"
              icon="add"
              @btnClicked="addImpr(1)"
            />
            <c-btn
              v-if="editable && !disabled && param.selfInspectionResultId"
              label="즉시조치"
              :showLoading="false"
              icon="add"
              @btnClicked="addImpr(2)"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { auditType } from '../audit'

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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'complianceAction'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      selfInspectionResultId: '',
      selfInspectionStatusCd: '',
      sysRevision: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const gridImpr = ref<gridType>({
  merge: [
    { index: 0, colName: 'itemMstName' },
    { index: 1, colName: 'itemTypeName' }
  ],
  columns: [
    {
      name: 'itemMstName',
      field: 'itemMstName',
      label: '평가항목',
      align: 'left',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'itemTypeName',
      field: 'itemTypeName',
      label: '구분',
      align: 'left',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: 'No.',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'itemName',
      field: 'itemName',
      label: '세부항목',
      align: 'left',
      type: 'html',
      sortable: false
    },
    {
      name: 'selfInspectionResultName',
      field: 'selfInspectionResultName',
      label: '평가',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      style: 'width:300px',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const gridImpr2 = ref<gridType>({
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const audit = ref<auditType>({
  selfInspectionResultId: '', // 자체감사 계획 일련번호
  selfInspectionTitle: '', // 감사명
  selfInspectionYear: '', // 감사년도
  selfInspectionTypeCd: null, // 감사종류
  plantCd: null, // 해당사업장
  remark: '', // 감사대상 개요
  selfInspectionStartDt: '', // 감사기간-시작일
  selfInspectionEndDt: '', // 감사기간-종료일
  selfInspectionStatusCd: '', // 감사진행상태-계획중,계획완료,감사완료
  selfInspectionResultOpinion: '', // 감사원소견
  selfInspectionResultTotalOpinion: '', // 감사 결과 종합의견
  selfInspectionResultCorrect: '', // 시정 및 권고 요약
  selfInspectionDt: [],
  sysRevision: '', // 평가항목 개정번호
  chgUserId: '',
  sysApprovalRequestId: '',
  approvalTypeCd: '',
  approvalStatusCd: '',
  approvalStatusName: '',
  isSave: false
})
const editable = ref(true)
const imprData = ref(null)
const requestImprRow = ref(null)
const gridheight2 = ref('')
const infoUrl = ref('')
const list1Url = ref('')
const impListUrl = ref('')
const imprTable1 = ref<any>(null)
const imprTable2 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    audit.value.selfInspectionStatusCd != 'SISC000001' &&
    audit.value.selfInspectionStatusCd != 'SISC000002'
)
// 개선요청 Component
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})

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
  infoUrl.value = selectConfig.sop.pca.result.info.get.url
  list1Url.value = selectConfig.sop.pca.item.revs.all
  impListUrl.value = selectConfig.sop.ibm.improve.others.url
  // code setting
  gridheight2.value = window.innerHeight - 568 + 'px'
  // list setting
  getInfo()
  getList()
  getImpList()
}
/******************************
 * TODO (목적): 기본정보 조회
 *******************************/
function getInfo() {
  $http({
    url: infoUrl.value,
    method: 'GET',
    params: { selfInspectionResultId: props.param.selfInspectionResultId }
  }).then((_result: any) => {
    audit.value = _result.data
  })
}
/******************************
 * TODO (목적): 개선목록 조회
 *******************************/
function getList() {
  $http({
    url: list1Url.value + '/impr',
    method: 'GET',
    params: {
      sysRevision: props.param.sysRevision,
      selfInspectionResultId: props.param.selfInspectionResultId
    }
  }).then((_result: any) => {
    gridImpr.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 항목외 개선목록 조회
 *******************************/
function getImpList() {
  if (props.param.selfInspectionResultId) {
    $http({
      url: impListUrl.value,
      method: 'GET',
      params: {
        ibmTaskTypeCd: 'ITT0000035',
        ibmTaskUnderTypeCd: 'ITTU000055',
        relationTableKey: props.param.selfInspectionResultId
      }
    }).then((_result: any) => {
      gridImpr2.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  requestImprRow.value = row
  imprData.value = row
  popupOptions.value.param = { sopImprovementId: row.sopImprovementId }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
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
}
function closeImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
  getImpList()
}
/******************************
 * TODO (목적): 개선요청 or 즉시조치 요청
 *******************************/
function addImpr(num?: numberNull) {
  popupOptions.value.title = num === 1 ? '개선요청' : '즉시조치'
  popupOptions.value.target =
    num === 1
      ? shallowRef(defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`)))
      : shallowRef(defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`)))
  popupOptions.value.param = {
    requestContents: audit.value.selfInspectionTitle,
    relationTableKey: audit.value.selfInspectionResultId,
    ibmTaskTypeCd: 'ITT0000035',
    ibmTaskUnderTypeCd: 'ITTU000055'
  }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
