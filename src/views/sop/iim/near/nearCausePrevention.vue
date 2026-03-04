<template>
  <q-form ref="editForm">
    <c-card title="아차사고 기본정보" class="cardClassDetailInfo">
      <template v-slot:card-detail>
        <div class="col-3">
          <c-label-text title="아차사고번호" :value="nearAccidentInfo.iimNearAccidentNo" />
        </div>
        <div class="col-3">
          <c-label-text title="아차사고명" :value="nearAccidentInfo.iimNearAccidentName" />
        </div>
        <div class="col-3">
          <c-label-text title="아차사고종류" :value="nearAccidentInfo.iimNearKindName" />
        </div>
        <div class="col-3">
          <c-label-text title="발생일시" :value="nearAccidentInfo.occurrenceDt" />
        </div>
      </template>
    </c-card>
    <c-card title="계획 및 담당자의견" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            :editable="editable"
            v-if="!disabled"
            :url="updateOpinionUrl"
            :isSubmit="isSaveOpin"
            :param="nearAccidentInfo"
            mappingType="PUT"
            label="계획/의견저장"
            icon="save"
            @beforeAction="saveNearAccident"
            @btnCallback="saveNearAccidentCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            :rows="5"
            label="단기계획"
            name="shortPlan"
            v-model:value="nearAccidentInfo.shortPlan"
          />
        </div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            :rows="5"
            label="중장기 계획"
            name="longPlan"
            v-model:value="nearAccidentInfo.longPlan"
          />
        </div>
        <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            :rows="5"
            label="담당자 의견"
            name="managerOpinion"
            v-model:value="nearAccidentInfo.managerOpinion"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="tableImpr"
      title="원인 및 재발방지 목록"
      :columns="gridImpr.columns"
      :data="nearAccidentInfo.nearAccidentPreventionModels"
      selection="multiple"
      rowKey="iimNearCausesId"
      :usePaging="false"
      :isExcelDown="false"
      :autoFullHeight="true"
      :filtering="false"
      :columnSetting="false"
      :editable="editable && !disabled"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            label="추가"
            :showLoading="false"
            icon="add"
            @btnClicked="add"
          />
          <c-btn
            v-show="
              editable && !disabled && nearAccidentInfo.nearAccidentPreventionModels!.length > 0
            "
            :url="updateCauseUrl"
            :isSubmit="isSaveCause"
            :param="nearAccidentInfo.nearAccidentPreventionModels"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveNearImpr"
            @btnCallback="saveNearImprCallback"
          />
          <c-btn
            v-if="
              editable && !disabled && nearAccidentInfo.nearAccidentPreventionModels!.length > 0
            "
            label="삭제"
            :showLoading="false"
            icon="remove"
            @btnClicked="removeImpr"
          />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="editable && !disabled"
            :isImmShow="true"
            :requestContentsCols="requestContentsCols"
            tableKey="iimNearCausesId"
            ibmTaskTypeCd="ITT0000045"
            ibmTaskUnderTypeCd="ITTU000070"
            @imprChange="imprChange"
          />
        </template>
      </template>
    </c-table>
  </q-form>
</template>
<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import {
  nearAccidentPopupParamType,
  nearAccidentPreventionType,
  nearAccidentType
} from './nearAccident'

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
  name: 'nearCausePrevention'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
  popupParam: nearAccidentPopupParamType
}
interface gridType {
  columns: tableColumnType
  data: Array<nearAccidentPreventionType>
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
      iimNearAccidentId: '',
      iimStatusNearCd: '',
      approvalStatusCd: ''
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
const editable = ref(true)
const nearAccidentInfo = ref<nearAccidentType>({
  iimNearAccidentId: '',
  iimNearAccidentName: '',
  iimNearKindName: '',
  occurrenceDt: '',
  shortPlan: '',
  longPlan: '',
  managerOpinion: '',
  nearAccidentPreventionModels: []
})
const gridImpr = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'iimNearCauseTypeCd',
      field: 'iimNearCauseTypeCd',
      label: '원인구분',
      align: 'center',
      style: 'width:100px',
      type: 'select',
      codeGroupCd: 'IIM_NEAR_CAUSE_DIVISION_CD', //IIM_CAUSE_DIVISION_CD
      sortable: false
    },
    {
      required: true,
      name: 'iimNearAccidentCause',
      field: 'iimNearAccidentCause',
      label: '사고원인',
      align: 'left',
      type: 'text',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'impr',
      field: 'impr',
      label: '원인 및 재발방지 진행',
      align: 'center',
      child: [
        {
          name: 'customCol',
          field: 'customCol',
          label: '개선번호/개선진행상태',
          align: 'center',
          style: 'width:200px',
          type: 'custom',
          sortable: false
        },
        {
          name: 'iimPreventionMeasures',
          field: 'iimPreventionMeasures',
          label: '원인 및 재발방지 대책',
          align: 'left',
          style: 'width:400px',
          type: 'text',
          sortable: false
        }
      ]
    }
  ],
  data: []
})
const isSaveOpin = ref(false)
const isSaveCause = ref(false)
const updateOpinionUrl = ref('')
const updateCauseUrl = ref('')
const detailInfoUrl = ref('')
const deleteCauseUrl = ref('')
const tableImpr = ref<any>(null)
const editForm = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    (editable.value &&
      Boolean(props.popupParam.iimStatusNearCd) &&
      props.popupParam.iimStatusNearCd === 'ISNC000002') ||
    props.popupParam.approvalStatusCd === 'ASC9999999'
)
const requestContentsCols = computed(() => ['iimNearCauseTypeName'])
const imprComponent = computed(() => {
  const components = defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
  return components
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
  detailInfoUrl.value = selectConfig.sop.iim.accident.near.get.url
  updateOpinionUrl.value = transactionConfig.sop.iim.accident.near.update.url
  updateCauseUrl.value = transactionConfig.sop.iim.accident.near.prevention.update.cause.url
  deleteCauseUrl.value = transactionConfig.sop.iim.accident.near.prevention.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 개선관리 조회
 *******************************/
function getDetail() {
  // 아차사고 기본정보, 의견, 개선 목록 받아오는 부분
  if (props.popupParam.iimNearAccidentId) {
    $http({
      url: $format(detailInfoUrl.value, props.popupParam.iimNearAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      nearAccidentInfo.value = _result.data
    })
  }
}
function imprChange() {
  tableImpr.value.compoTable.clearSelection()
}
/******************************
 * TODO (목적): 기본정보 저장
 *******************************/
function saveNearAccident() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          nearAccidentInfo.value.regUserId = user.value.userId
          nearAccidentInfo.value.chgUserId = user.value.userId
          isSaveOpin.value = !isSaveOpin.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveNearAccidentCallback() {
  message.requestSuccess()
}
/******************************
 * TODO (목적): 개선목록 저장
 *******************************/
function saveNearImpr() {
  if (validTable(gridImpr.value.columns, nearAccidentInfo.value.nearAccidentPreventionModels!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSaveCause.value = !isSaveCause.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveNearImprCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 개선 목록 추가
 *******************************/
function add() {
  nearAccidentInfo.value.nearAccidentPreventionModels!.splice(0, 0, {
    iimNearAccidentId: props.popupParam.iimNearAccidentId,
    iimNearCausesId: uid(), // uuid와 동일한것
    iimNearCauseTypeCd: null,
    iimNearCauseTypeName: '',
    iimImprovingMeasures: '',
    sopImprovementIds: '',
    ibmStepNames: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 개선 목록 삭제
 *******************************/
function removeImpr() {
  const selectData = tableImpr.value.getSelected()
  if (!selectData || selectData.length === 0) {
    //삭제하려고 선택한 값이 하나도 없을 경우
    message.alert({
      title: '안내',
      message: '하나 이상 선택하세요.', // 하나 이상 선택하세요.
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
          url: deleteCauseUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            // 내가 선택한 제외 목록이 실제로 없애야 함으로
            nearAccidentInfo.value.nearAccidentPreventionModels = _.reject(
              nearAccidentInfo.value.nearAccidentPreventionModels,
              item
            )
          })
          tableImpr.value.compoTable.clearSelection()
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
