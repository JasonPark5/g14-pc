<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="editForm">
        <c-card class="cardClassDetailForm" title="인허가 검토정보">
          <template v-slot:card-button>
            <q-btn-group outline>
              <!-- <c-btn
              v-show="editable && !disabled && receiptEditable"
              :url="receiptUrl"
              :isSubmit="isRequest"
              :param="licenseRequest"
              mappingType="PUT"
              label="요청접수"
              icon="save"
              @beforeAction="receiptData"
              @btnCallback="receiptCallback"
            /> -->
              <c-btn
                v-show="editable && !disabled && completeEditable"
                :url="completeUrl"
                :isSubmit="isComplete"
                :param="licenseRequest"
                mappingType="PUT"
                label="검토완료"
                icon="check"
                @beforeAction="completeData"
                @btnCallback="completeCallback"
              />
              <c-btn
                v-show="editable && !disabled && completeEditable"
                :url="rejectUrl"
                :isSubmit="isReject"
                :param="licenseRequest"
                mappingType="PUT"
                label="기각"
                icon="delete"
                @beforeAction="rejectData"
                @btnCallback="rejectCallback"
              />
              <c-btn
                v-show="editable && !disabled"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="licenseRequest"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveData"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                :disabled="true"
                :editable="editable"
                codeGroupCd="LICENSE_REQUEST_STEP_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="requestStepCd"
                label="진행단계"
                v-model:value="licenseRequest.requestStepCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
              <c-text
                :disabled="disabled"
                :editable="editable"
                label="기각사유"
                name="dismissReason"
                v-model:value="licenseRequest.dismissReason"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        class="q-mt-sm"
        title="인허가 검토 목록"
        :columns="grid.columns"
        :data="licenseRequest.reviews"
        gridHeight="620px"
        :columnSetting="false"
        :usePaging="false"
        :isFullScreen="false"
        :isExcelDown="false"
        :editable="editable && !disabled"
      />
    </div>
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
import { licenseRequestType } from './license'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'licenseRequestStatus'
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
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    limLicenseRequestId: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  height?: stringNull
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
      limLicenseRequestId: ''
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
const popupOptions = ref<popupParamType>({
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

const licenseRequest = ref<licenseRequestType>({
  limLicenseRequestId: '',
  plantCd: '',
  licenseRequestName: '',
  requestDeptCd: '',
  requestUserId: '',
  completeRequestDate: '',
  requestContent: '',
  sopMocId: '',
  requestStepCd: 'RSC0000001',
  dismissReason: '',
  reviewOpinion: '',
  reviewUserId: '',
  reviewDeptCd: '',
  regUserId: '',
  chgUserId: '',
  reviews: [],
  deleteReviews: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      align: 'center',
      style: 'widht: 150px',
      sortable: false
    },
    {
      name: 'limLicenseKindName',
      field: 'limLicenseKindName',
      label: '인허가종류',
      align: 'center',
      style: 'widht: 150px',
      sortable: false
    },
    {
      name: 'review',
      field: 'review',
      label: '검토',
      sortable: false,
      child: [
        {
          name: 'reviewDeptName',
          field: 'reviewDeptName',
          label: '부서',
          align: 'center',
          style: 'widht: 120px',
          sortable: false
        },
        {
          name: 'reviewUserName',
          field: 'reviewUserName',
          label: '검토자',
          align: 'center',
          style: 'widht: 100px',
          sortable: false
        }
      ]
    },
    {
      name: 'limLicenseKindStatusCd',
      field: 'limLicenseKindStatusCd',
      label: '검토상태',
      align: 'center',
      style: 'widht: 120px',
      type: 'select',
      codeGroupCd: 'LIM_LICENSE_KIND_STAUS_CD',
      sortable: false
    },
    {
      name: 'renewalFlag',
      field: 'renewalFlag',
      label: '갱신여부',
      align: 'center',
      style: 'widht: 80px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false,
      disableTarget: 'dis',
      disableCon: 'X'
    },
    {
      name: 'asLicenseSeqName',
      field: 'asLicenseSeqName',
      label: '갱신대상 인허가',
      align: 'center',
      style: 'widht: 180px',
      sortable: false
    },
    {
      name: 'reviewOpinion',
      field: 'reviewOpinion',
      label: '검토 의견',
      align: 'left',
      style: 'widht: 250px',
      type: 'textarea',
      sortable: false
    }
  ]
})
const editable = ref(true)
const isSave = ref(false)
// const isReceipt = ref(false)
const isComplete = ref(false)
const isReject = ref(false)
const detailUrl = ref('')
const saveUrl = ref('')
// const receiptUrl = ref('')
const completeUrl = ref('')
const rejectUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isReviewUser = computed(() => {
  return (
    licenseRequest.value.reviewUserId === user.value.userId ||
    licenseRequest.value.reviewDeptCd === user.value.deptCd
  )
})
// const receiptEditable = computed(() => {
//   return licenseRequest.value.requestStepCd === 'RSC0000002' && isReviewUser.value
// })
const completeEditable = computed(() => {
  return licenseRequest.value.requestStepCd === 'RSC0000003' && isReviewUser.value
})
const disabled = computed(() => {
  return (
    licenseRequest.value.requestStepCd === 'RSC0999999' ||
    licenseRequest.value.requestStepCd === 'RSC1000000'
  )
})

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  window.addEventListener('resize', setSize)
})
onMounted(() => {
  init()
})
onDeactivated(() => {
  window.removeEventListener('resize', setSize)
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
  editable.value = Boolean(route.meta.editable)
  detailUrl.value = selectConfig.sop.lim.lincense.request.get.url
  saveUrl.value = transactionConfig.sop.lim.lincense.request.update.url
  // receiptUrl.value = transactionConfig.sop.lim.lincense.request.reviewRecepit.url
  completeUrl.value = transactionConfig.sop.lim.lincense.request.reviewComplete.url
  rejectUrl.value = transactionConfig.sop.lim.lincense.request.reviewReject.url
  setSize()
  getDetail()
}

/******************************
 * TODO (목적): 화면크기에 맞춰 테이블 높이 동적 설정
 *******************************/
function setSize(): void {
  let height = window.innerHeight - 300
  if (height < 450) height = 450
  grid.value.height = String(height) + 'px'
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.param.limLicenseRequestId) {
    $http({
      url: $format(detailUrl.value, props.param.limLicenseRequestId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(licenseRequest.value, _result.data)
    })
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (validTable(grid.value.columns, licenseRequest.value.reviews, $language('인허가 검토'))) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        licenseRequest.value.chgUserId = user.value.userId
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getDetail()
}

/******************************
 * TODO (목적): 인허가 요청 접수
 *******************************/
// function receiptData() {
//   if (validTable(grid.value.columns, licenseRequest.value.reviews, $language('인허가 검토'))) {
//     message.confirm({
//       title: '확인',
//       message: '요청에 대하여 [접수처리] 하시겠습니까?',
//       type: 'info', // success / info / warning / error
//       confirmCallback: () => {
//         licenseRequest.value.chgUserId = user.value.userId;
//         isReceipt.value = !isReceipt.value
//       },
//       cancelCallback: () => {}
//     })
//   }
// }
// function receiptCallback(result: any) {
//   message.requestSuccess()
//   getDetail()
//   emits('emitStep', {
//     name: 'currentStep',
//     param: result.data.requestStepCd
//   })
// }

/******************************
 * TODO (목적): 인허가 요청 완료 처리
 *******************************/
function completeData() {
  if (validTable(grid.value.columns, licenseRequest.value.reviews, $language('인허가 검토'))) {
    message.confirm({
      title: '확인',
      message: '인허가종류별 검토가 모두 완료처리됩니다. 검토완료 하시겠습니까?',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        licenseRequest.value.chgUserId = user.value.userId
        isComplete.value = !isComplete.value
      },
      cancelCallback: () => {}
    })
  }
}
function completeCallback(result: any) {
  message.requestSuccess()
  getDetail()
  emits('emitStep', {
    name: 'currentStep',
    param: result.data.requestStepCd
  })
}

/******************************
 * TODO (목적): 기각 처리
 *******************************/
function rejectData() {
  if (!licenseRequest.value.dismissReason) {
    message.alert({
      title: '안내',
      message: '기각사유를 입력하십시요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  if (validTable(grid.value.columns, licenseRequest.value.reviews, $language('인허가 검토'))) {
    message.confirm({
      title: '확인',
      message: '요청에 대하여 [기각처리] 하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        licenseRequest.value.chgUserId = user.value.userId
        isReject.value = !isReject.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function rejectCallback(result: any) {
  message.requestSuccess()
  getDetail()
  emits('emitStep', {
    name: 'currentStep',
    param: result.data.requestStepCd
  })
}
</script>
