<template>
  <div>
    <c-table
      ref="resultTable"
      :title="`단위작업 : ${hazard.sopName}`"
      :columns="grid.columns"
      :data="hazard.results"
      :gridHeight="gridHeight"
      :editable="editable && !disabled"
      :hideBottom="true"
      :isExcelDown="false"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="heaMuscleSopResultId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-show="editable && !disabled" label="추가" icon="add" @btnClicked="addResult" />
          <c-btn
            v-show="editable && !disabled && hazard.results && hazard.results.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteResult"
          />
          <c-btn
            v-show="editable && !disabled && hazard.results && hazard.results.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="hazard.results"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveResult"
            @btnCallback="saveResultCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="!disabled"
            :isImmShow="true"
            :requestContentsCols="['resultName']"
            tableKey="heaMuscleSopResultId"
            ibmTaskTypeCd="ITT0000170"
            ibmTaskUnderTypeCd="ITTU000190"
            @imprChange="imprChange"
            @getImprList="getImprList"
          />
        </template>
      </template>
    </c-table>
    <c-card class="cardClassDetailForm" title="" noHeader>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-upload :attachInfo="attachResultInfo" :editable="editable" label="작업사진" />
        </div>
      </template>
    </c-card>
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
import { sopType } from './investigation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'muscleJobResult'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail'])

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
  attachResultInfo: attachSettingType
  disabled: boolean
  contentHeight: stringNull
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
  attachResultInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'HEA_MUSCLE_HAZARD_RESULT',
      taskKey: ''
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
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'heaAssessmentToolCd',
      field: 'heaAssessmentToolCd',
      label: '작업분석․평가도구',
      align: 'center',
      style: 'width:25%',
      type: 'select',
      innerBtn: true,
      codeGroupCd: 'HEA_ASSESSMENT_TOOL_CD',
      sortable: false
    },
    {
      required: true,
      name: 'resultName',
      field: 'resultName',
      label: '평가결과',
      align: 'left',
      style: 'width:25%',
      type: 'textarea',
      sortable: false
    },
    {
      required: true,
      name: 'judgment',
      field: 'judgment',
      label: '판정',
      align: 'left',
      style: 'width:20%',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'workerOpinion',
      field: 'workerOpinion',
      label: '근로자의견',
      align: 'left',
      style: 'width:10%',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선번호/개선진행상태',
      align: 'center',
      style: 'width:20%',
      type: 'custom',
      sortable: false
    }
  ]
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const isSave = ref(true)
const saveUrl = ref('')
const listUrl = ref('')
const listImprUrl = ref('')
const deleteUrl = ref('')
const resultTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
// 개선요청 Component
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 310 + 'px' : '500px'
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
  listUrl.value = selectConfig.hea.muscleSystem.muscleSopResult.list.url
  listImprUrl.value = selectConfig.hea.muscleSystem.muscleSopResultImpr.list.url
  saveUrl.value = transactionConfig.hea.muscleSystem.muscleSopResult.save.url
  deleteUrl.value = transactionConfig.hea.muscleSystem.muscleSopResult.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 결과/개선 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { heaMuscleSopId: props.popupParam.heaMuscleSopId }
  }).then((_result: any) => {
    props.hazard.results = _result.data
  })
}
function getImprList() {
  $http({
    url: listImprUrl.value,
    method: 'GET',
    params: { heaMuscleSopId: props.popupParam.heaMuscleSopId }
  }).then((_result: any) => {
    props.hazard.imprs = _result.data
  })
}
/******************************
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  resultTable.value.compoTable.resetVirtualScroll()
  emits('getDetail', 'impr')
}
/******************************
 * TODO (목적): 결과 추가
 *******************************/
function addResult() {
  props.hazard.results?.splice(0, 0, {
    heaMuscleSopResultId: uid(), // 근골격계 단위작업 결과표 일련번호
    heaMuscleSopId: props.popupParam.heaMuscleSopId, // 근골격계 단위작업 일련번호
    heaInvestigationPlanId: props.hazard.heaInvestigationPlanId, // 근골격계 조사계획 일련번호
    heaAssessmentToolCd: null, // 작업분석 평가도구 코드
    resultName: '', // 평가결과
    judgment: '', // 유해요인의 발생원인 또는 노출특징
    workerOpinion: '', // 비고
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteResult() {
  const selectData = resultTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            props.hazard.results = _.reject(props.hazard.results, item)
          })
          resultTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveResult() {
  if (props.hazard.results && validTable(grid.value.columns, props.hazard.results)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveResultCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
