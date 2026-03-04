<template>
  <q-form ref="editForm">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-card title="공정사고 기본정보" class="cardClassDetailInfo">
        <template v-slot:card-button>
          <q-btn-group outline>
            <!-- <c-btn v-if="!disabled" label="삭제" :editable="editable" icon="delete_forever" @btnClicked="remove" /> -->
            <span
              v-if="
                standardInfo.reportTypeCd === 'IRC0000005' ||
                standardInfo.reportTypeCd === 'IRC0000001'
              "
              class="text-grey-9"
              style="margin-right: 10px; line-height: 26px"
            >
              {{
                $language(
                  '※ 종결처리시 상단탭에서 중간, 최종보고를 선택하여 추가를 할 수 있습니다.'
                )
              }}
            </span>
            <!-- 종결처리 -->
            <c-btn
              v-show="!disabled"
              :isSubmit="isComplete"
              :url="updateUrl"
              :param="accidentInfo"
              mappingType="PUT"
              label="종결처리"
              icon="check"
              @beforeAction="completeAccident"
              @btnCallback="completeCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-3">
            <c-label-text title="사고번호" :value="standardInfo.accidentNo" />
          </div>
          <div class="col-3">
            <c-label-text title="사고명" :value="standardInfo.accidentName" />
          </div>
          <div class="col-3">
            <c-label-text title="사고종류" :value="standardInfo.accidentKindName" />
          </div>
          <div class="col-3">
            <c-label-text title="사고등급" :value="standardInfo.accidentGradeName" />
          </div>
          <div class="col-3">
            <c-label-text title="발생일시" :value="standardInfo.occurrenceDate" />
          </div>
          <div class="col-3">
            <c-label-text title="발생부서" :value="standardInfo.occurrenceDeptName" />
          </div>
          <div class="col-3">
            <c-label-text title="발생형태 대분류" :value="standardInfo.occurrenceModeLargeName" />
          </div>
          <div class="col-3">
            <c-label-text title="발생형태 중분류" :value="standardInfo.occurrenceModeSmallName" />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-card title="계획 및 담당자의견" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="!disabled"
              :url="updateUrl"
              :isSubmit="isSave"
              :param="accidentInfo"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveAccident"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-9 col-sm-9 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              :rows="3"
              label="단기계획"
              name="shortPlan"
              v-model:value="accidentInfo.shortPlan"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              :rows="3"
              label="중장기 계획"
              name="longPlan"
              v-model:value="accidentInfo.longPlan"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              :rows="3"
              label="담당자 의견"
              name="managerOpinion"
              v-model:value="accidentInfo.managerOpinion"
            />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="tableImpr"
        title="개선 목록"
        :columns="gridImpr.columns"
        :data="accidentInfo.accidentImproveModelList"
        :gridHeight="gridImpr.height"
        selection="multiple"
        rowKey="causesNo"
        :usePaging="false"
        :isExcelDown="false"
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
              v-if="editable && !disabled && accidentInfo.accidentImproveModelList!.length > 0"
              :url="updateCauseUrl"
              :isSubmit="isSave2"
              :param="accidentInfo.accidentImproveModelList"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveAccident2"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-if="editable && !disabled && accidentInfo.accidentImproveModelList!.length > 0"
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
              tableKey="causesNo"
              ibmTaskTypeCd="ITT0000040"
              ibmTaskUnderTypeCd="ITTU000065"
              @imprChange="imprChange"
            />
          </template>
        </template>
      </c-table>
    </div>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import {
  processAccidentCauseType,
  processAccidentPopupParamType,
  processAccidentType
} from './processAccident'

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
  name: 'accidentCausePrevention'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: processAccidentPopupParamType
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      iimAccidentId: '',
      stepCd: '',
      reportName: '',
      count: 0
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const standardInfo = ref<processAccidentType>({
  iimAccidentId: '',
  accidentNo: '',
  accidentName: '',
  accidentKindName: '',
  accidentGradeName: '',
  occurrenceDate: '',
  occurrenceDeptName: '',
  occurrenceModeLargeName: '',
  occurrenceModeSmallName: '',
  accidentStatusCd: ''
})
const accidentInfo = ref<processAccidentCauseType>({
  iimAccidentId: '',
  shortPlan: '',
  longPlan: '',
  managerOpinion: '',
  accidentStautsCd: '',

  accidentImproveModelList: []
})
const gridImpr = ref({
  columns: [
    {
      required: true,
      name: 'causeTypeCd',
      field: 'causeTypeCd',
      label: '원인구분',
      align: 'center',
      style: 'width:10%',
      type: 'select',
      comboItems: [
        { code: 'ICDC000001', codeName: '기술적' },
        { code: 'ICDC000002', codeName: '교육적' },
        { code: 'ICDC000003', codeName: '관리적' }
      ],
      sortable: false
    },
    {
      required: true,
      name: 'accidentCause',
      field: 'accidentCause',
      label: '사고원인',
      align: 'left',
      type: 'text',
      style: 'width:50%',
      sortable: false
    },
    {
      name: 'improvingMeasures',
      field: 'improvingMeasures',
      label: '개선대책',
      align: 'left',
      style: 'width:20%',
      type: 'text',
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
  ],

  data: [],
  height: '315px'
})
const updateUrl = ref('')
const updateCauseUrl = ref('')
const deleteUrl = ref('')
const getUrl = ref('')
const getInfoUrl = ref('')
const isComplete = ref(false)
const isSave = ref(false)
const isSave2 = ref(false)
const tableImpr = ref<any>(null)
const editForm = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => props.param.stepCd === 'ISPC000005')
const requestContentsCols = computed(() => {
  return ['accidentCause']
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.count,
  () => {
    getStdInfo()
    getDetail()
  }
)
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
  getUrl.value = selectConfig.sop.iim.accident.process.get.url
  getInfoUrl.value = selectConfig.sop.iim.accident.process.prevention.get.url
  updateUrl.value = transactionConfig.sop.iim.accident.process.prevention.update.url
  updateCauseUrl.value = transactionConfig.sop.iim.accident.process.prevention.update.cause.url
  deleteUrl.value = transactionConfig.sop.iim.accident.process.prevention.delete.url

  // code setting
  // list setting
  getStdInfo()
  getDetail()
}
/******************************
 * TODO (목적): 기본정보 조회
 *******************************/
function getStdInfo() {
  if (props.param.iimAccidentId) {
    $http({
      url: $format(getUrl.value, props.param.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      standardInfo.value = _result.data
    })
  }
}
/******************************
 * TODO (목적): 계획/원인 정보
 *******************************/
function getDetail() {
  if (props.param.iimAccidentId) {
    $http({
      url: $format(getInfoUrl.value, props.param.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      accidentInfo.value = _result.data
      standardInfo.value = _result.data
    })
  }
}

/******************************
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  tableImpr.value.$refs['compo-table'].resetVirtualScroll()
}
function saveAccident() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          accidentInfo.value.regUserId = user.value.userId
          accidentInfo.value.chgUserId = user.value.userId

          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}

/******************************
 * TODO (목적): 개선 목록 저장
 *******************************/
function saveAccident2() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (validTable(accidentInfo.value.accidentImproveModelList!, gridImpr.value.columns)) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',

          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            accidentInfo.value.regUserId = user.value.userId
            accidentInfo.value.chgUserId = user.value.userId
            isSave2.value = !isSave2.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}
function saveCallback() {
  message.requestSuccess()
  getDetail()
}

/******************************
 * TODO (목적): 개선목록 추가
 *******************************/
function add() {
  accidentInfo.value.accidentImproveModelList!.splice(0, 0, {
    iimAccidentId: props.param.iimAccidentId,
    causesNo: uid(),
    causeTypeCd: null,
    accidentCause: '',
    improvingMeasures: '',
    sopImprovementIds: '',
    ibmStepNames: '',
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 개선목록 삭제
 *******************************/
function removeImpr() {
  const selectData = tableImpr.value.getSelected()
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
        }).then((_result: any) => {
          message.requestSuccess()
          tableImpr.value.$refs['compo-table'].clearSelection()
          getDetail()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 종결처리
 *******************************/
function completeAccident() {
  message.confirm({
    title: '확인',
    message: '종결처리 하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      accidentInfo.value.accidentStatusCd = 'ISPC000005'
      accidentInfo.value.regUserId = user.value.userId
      accidentInfo.value.chgUserId = user.value.userId

      isComplete.value = !isComplete.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function completeCallback() {
  message.requestSuccess()
  if (accidentInfo.value.accidentStatusCd) {
    emits('emitStep', {
      name: 'currentStep',
      param: accidentInfo.value.accidentStatusCd
    })
    emits('emitStep', {
      name: 'setReportTab',
      param: {
        stepCd: accidentInfo.value.accidentStatusCd,
        iimAccidnetId: props.param.iimAccidentId
      }
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
