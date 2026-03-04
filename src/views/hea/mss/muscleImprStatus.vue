<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="imprTable1"
        title="개선 목록"
        :editable="editable && !disabled2"
        :columns="gridImpr.columns"
        :data="hazard.imprs"
        :merge="gridImpr.merge"
        gridHeight="380px"
        @linkClick="linkClick"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="imprTable2"
        title="항목외 개선 목록"
        :editable="editable && !disabled2"
        :columns="gridImpr2.columns"
        :data="gridImpr2.data"
        gridHeight="380px"
        :usePaging="false"
        :filtering="false"
        :columnSetting="false"
        @linkClick="linkClick2"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled2 && popupParam.heaMuscleSopId"
              label="개선요청"
              :showLoading="false"
              icon="add"
              @btnClicked="addImpr(1)"
            />
            <c-btn
              v-if="editable && !disabled2 && popupParam.heaMuscleSopId"
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

import { sopType } from './investigation'

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
  name: 'muscleImprStatus'
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
  popupParam: {
    heaMuscleSopId: stringNull
  }
  disabled: boolean
  contentHeight: string
  hazard: sopType
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
  popupParam: () => {
    return {
      heaMuscleSopId: ''
    }
  },
  hazard: () => {
    return {
      heaMuscleSopId: '', // 근골격계 단위작업 일련번호
      heaInvestigationPlanId: '', // 근골격계 조사계획 일련번호
      heaMuscleSopStepCd: '', // 진행상태
      processCd: '', // 공정코드
      processName: '', // 공정명
      mdmSopId: '', // 안전작업 표준 일련번호
      sopName: '', // 세부공정(작업) 명
      heaInvestigationTypeCd: '', // 조사구분
      investigationDate: '', // 조사일시
      deptCd: '', // 조사자 부서
      userId: '', // 조사자 id
      remark: '', // 비고
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      heavyWorks: [], // 부담작업
      heavyWorkIncludes: [], // 부담작업 결과 O
      heavyWorkHazards: [], // 유해요인
      workers: [], // 작업자
      situations: [], // 상황조사
      results: [], // 결과표
      imprs: [] // 개선
    }
  },
  disabled: false,
  contentHeight: 'auto'
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
    { index: 0, colName: 'heaMuscleSopResultId' },
    { index: 1, colName: 'heaMuscleSopResultId' },
    { index: 2, colName: 'heaMuscleSopResultId' },
    { index: 3, colName: 'heaMuscleSopResultId' }
  ],
  columns: [
    {
      name: 'heaAssessmentToolName',
      field: 'heaAssessmentToolName',
      label: '작업분석․평가도구',
      align: 'center',
      // type: 'seSlect',
      // codeGroupCd: 'HEA_ASSESSMENT_TOOL_CD',
      sortable: false
    },
    {
      name: 'resultName',
      field: 'resultName',
      label: '평가결과',
      align: 'left',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'judgment',
      field: 'judgment',
      label: '판정',
      align: 'left',
      style: 'width:160px',
      sortable: false
    },
    {
      name: 'workerOpinion',
      field: 'workerOpinion',
      label: '근로자의견',
      align: 'left',
      style: 'width:160px',
      sortable: false
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      type: 'link',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'ibmStepName',
      field: 'ibmStepName',
      label: '진행상태',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'improveRequest',
      field: 'improveRequest',
      label: '요청부서정보',
      align: 'center',
      style: 'width:250px',
      sortable: true
    },
    {
      name: 'actionCompleteRequestDate',
      field: 'actionCompleteRequestDate',
      label: '조치완료요청일',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:100px',
      sortable: true
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
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const imprData = ref(null)
const requestImprRow = ref(null)
const impListUrl = ref('')
const listUrl = ref('')
const imprTable1 = ref<any>(null)
const imprTable2 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled2 = computed(() => props.hazard.heaMuscleSopStepCd === 'HMS000010')

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
  listUrl.value = selectConfig.hea.muscleSystem.muscleSopResult.list.url
  impListUrl.value = selectConfig.sop.ibm.improve.others.url
  // code setting
  // list setting
  getImpList()
}

/******************************
 * TODO (목적): 개선목록 조회
 *******************************/
function getImpList() {
  if (props.popupParam.heaMuscleSopId) {
    $http({
      url: impListUrl.value,
      method: 'GET',
      params: {
        ibmTaskTypeCd: 'ITT0000170',
        ibmTaskUnderTypeCd: 'ITTU000185',
        relationTableKey: props.popupParam.heaMuscleSopId
      }
    }).then((_result: any) => {
      gridImpr2.value.data = _result.data
    })
  }
}

/******************************
 * TODO (목적): 결과 조회
 *******************************/
function research() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { heaMuscleSopId: props.popupParam.heaMuscleSopId }
  }).then((_result: any) => {
    props.hazard.results = _result.data
  })
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(_data: any, row: any, num?: string) {
  requestImprRow.value = row
  imprData.value = _data
  popupOptions.value.param = { sopImprovementId: _data.sopImprovementId }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  if (row.ibmClassCd === 'IC00000001') {
    popupOptions.value.title = '개선'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`))
    )
    popupOptions.value.closeCallback = num === '2' ? closeImprPopup : closeImprPopup2
  } else {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`))
    )
    popupOptions.value.closeCallback = num === '2' ? closeImprPopup : closeImprPopup2
  }
}
function linkClick2(row: any) {
  linkClick(row, row, '2')
}
function closeImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImpList()
}
function closeImprPopup2(result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.col1) {
    _.extend(imprData.value, result.col1)
    imprTable1.value.compoTable.resetVirtualScroll()
    research()
  }
}

/******************************
 * TODO (목적): 개선요청 or 즉시조치 요청
 *******************************/
function addImpr(num: numberNull) {
  popupOptions.value.title = num === 1 ? '개선요청' : '즉시조치'
  popupOptions.value.target =
    num === 1
      ? shallowRef(defineAsyncComponent(() => import(`@/views/sop/ibm/imprDetail.vue`)))
      : shallowRef(defineAsyncComponent(() => import(`@/views/sop/ibm/imprImmDetail.vue`)))
  popupOptions.value.param = {
    requestContents: '[근골결계조사계획]' + props.hazard.sopName,
    relationTableKey: props.popupParam.heaMuscleSopId,
    ibmTaskTypeCd: 'ITT0000170',
    ibmTaskUnderTypeCd: 'ITTU000185'
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
