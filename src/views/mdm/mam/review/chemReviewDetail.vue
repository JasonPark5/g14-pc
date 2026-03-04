<template>
  <div>
    <div v-show="btnEditable" class="chemReviewDiv">
      <q-btn-group outline>
        <c-btn
          v-show="review.returnFlag === 'Y'"
          label="반려사유"
          icon="info"
          @btnClicked="returnDialogOpen"
        />
        <c-btn
          v-show="requestEditable"
          :isSubmit="isRequest"
          :url="requestUrl"
          :param="review"
          mappingType="PUT"
          label="검토요청"
          icon="check"
          @beforeAction="requestReview"
          @btnCallback="requestReviewCallback"
        />
        <c-btn
          v-show="completeEditable"
          :isSubmit="isComplete"
          :url="completeUrl"
          :param="review"
          mappingType="PUT"
          label="검토완료"
          icon="check"
          @beforeAction="completeReview"
          @btnCallback="completeReviewCallback"
        />
        <c-btn
          v-show="returnEditable"
          label="검토요청반려"
          icon="check"
          @btnClicked="returnDialogOpen"
        />
        <!-- <c-btn 
          v-show="returnEditable"
          :isSubmit="isReturn"
          :url="returnUrl"
          :param="review"
          mappingType="PUT"
          label="검토요청반려" 
          icon="check"
          @beforeAction="returnReview"
          @btnCallback="returnReviewCallback" /> -->
      </q-btn-group>
    </div>
    <c-tab
      type="horizon"
      :tabItems="tabItems"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :review="review"
          :isOld="isOld"
          :disabled="disabled"
          :btnEditable="btnEditable"
          :contentHeight="contentHeight"
          :fileLength="fileLength"
          @getDetail="getDetail"
          @closePopup="closePopup"
        />
      </template>
    </c-tab>
    <q-dialog v-model="returnDialog.show" persistent>
      <q-card style="min-width: 450px">
        <q-form ref="editForm2">
          <c-card title="반려 내용" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="returnEditable"
                  :isSubmit="isReturn"
                  :url="returnUrl"
                  :param="review"
                  mappingType="PUT"
                  label="반려"
                  icon="check"
                  @beforeAction="returnReview"
                  @btnCallback="returnReviewCallback"
                />
                <c-btn label="닫기" icon="cancel" @btnClicked="closeReturnDialog" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-12">
                <c-textarea
                  :editable="returnEditable"
                  :rows="5"
                  label=""
                  name="returnRemark"
                  v-model:value="review.returnRemark"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </q-card>
    </q-dialog>
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
import { chemReviewType } from './chemReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemReviewDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    mdmChemReviewId: stringNull
  }
  contentHeight: string
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
      mdmChemReviewId: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const tab = ref('info')
const review = ref<chemReviewType>({
  mdmChemReviewId: '', // 사전검토 일련번호
  reviewRequestDate: '', // 검토요청일
  plantCds: '', // 사업장코드
  materialCd: '', // 화학자재번호
  materialName: '', // 자재명(KOR)
  materialNameEn: '', // 자재명(ENG)
  deliveryVendorCd: null, // 납품업체 코드
  deliveryVendorName: '', // 납품업체명
  mfgVendorCd: null, // 제조업체 코드
  mfgVendorName: '', // 제조업체명
  mdmChemReviewStepCd: null, // 사전검토 진행상태
  propertiesStateCd: null, // 성상-공통코드
  fugacity: '', // 비산성(고체)
  boilPoint: '', // 끊는점(액체,기체)
  meltingPoint: '', // 녹는점
  moleWeight: '', // 분자량
  usageCd: null, // 용도-회사별 공통코드
  usageEtc: '', // 용도 기타
  hsNo: '', // HS번호
  specificGravity: '', // 비중
  casNo: '', // CAS No.
  serialNo: '', // 고유번호(유독물번호or고시번호)
  keNo: '', // KE 번호
  psmFlag: 'N', // PSM 대상 여부
  mixFlag: 'N', // 물질구성(단일 N/혼합 Y)
  licensingFlag: 'N', // 인허가대상 물질 여부 Y/N
  dangerFlag: 'N', // 위험물 여부Y/N
  makeFlag: 'N', // 제품분류(제조)
  impFlag: 'N', // 제품분류(수입)
  buyFlag: 'N', // 제품분류(구매)
  usingFlag: 'N', // 제품분류(사용)
  expFlag: 'N', // 제품분류(수출)
  salesFlag: 'N', // 제품분류(판매)
  toxicPoisonFlag: 'N', // 유해화학물질포함여부(유독물질)
  toxicPermitFlag: 'N', // 유해화학물질포함여부(허가물질)
  toxicLimitFlag: 'N', // 유해화학물질포함여부(제한물질)
  toxicProhibitFlag: 'N', // 유해화학물질포함여부(금지물질)
  remarks: '', // 비고
  returnRemark: '', // 반려사유
  returnFlag: '', // 반려여부
  chemSubsControlFlag: '', // 화평법 등록여부
  chemAuthFlag: '', // 화학물질확인증명 여부
  chemLicenseFlag: '', // 유해화학물질 인허가 여부
  chemReportFlag: '', // 유해화학물질 신고여부
  msdsFlag: '', // MSDS제출/비공개 승인여부
  msdsNo: '', // MSDS번호
  materialCount: '',
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  subs: [],
  subsRegul: [],
  prodReguls: [],
  bills: [],
  checks: []
})
const fileLength = ref({
  msds: 0,
  ingrdient: 0
})
const returnDialog = ref({
  show: false
})
const isRequest = ref(false)
const isComplete = ref(false)
const isReturn = ref(false)
const detailUrl = ref('')
const uploadedFilesUrl = ref('')
const requestUrl = ref('')
const completeUrl = ref('')
const returnUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 30
      : 600
  if (height < 600) height = 600
  return height + 'px'
})
const isOld = computed(() => Boolean(props.popupParam.mdmChemReviewId))
const disabled = computed(() => review.value.mdmChemReviewStepCd === 'MCR0000010')
const requestEditable = computed(
  () =>
    editable.value &&
    !disabled.value &&
    isOld.value &&
    review.value.mdmChemReviewStepCd === 'MCR0000001'
)
const completeEditable = computed(
  () =>
    editable.value &&
    !disabled.value &&
    isOld.value &&
    review.value.mdmChemReviewStepCd === 'MCR0000005' &&
    review.value.checks!.length ===
      _.filter(review.value.checks, {
        mdmChemReviewCheckStepCd: 'CRC0000010',
        mdmChemReviewResultCd: 'MCRR000005'
      }).length
)
const returnEditable = computed(
  () =>
    editable.value &&
    !disabled.value &&
    isOld.value &&
    review.value.mdmChemReviewStepCd === 'MCR0000005' &&
    review.value.checks!.length ===
      _.filter(review.value.checks, (item) => {
        return Boolean(item.reviewDt)
      }).length &&
    review.value.checks!.length !==
      _.filter(review.value.checks, {
        mdmChemReviewCheckStepCd: 'CRC0000010',
        mdmChemReviewResultCd: 'MCRR000005'
      }).length
)
const btnEditable = computed(
  () =>
    requestEditable.value ||
    completeEditable.value ||
    returnEditable.value ||
    review.value.returnFlag === 'Y'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'info',
      label: '기본정보',
      component: defineAsyncComponent(() => import(`./chemReviewInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items.push({
      name: 'regul',
      icon: 'info',
      label: '구성물질 정보/규제',
      component: defineAsyncComponent(() => import(`./chemReviewComponents.vue`))
    })
    _items.push({
      name: 'etc',
      icon: 'settings_applications',
      label: '화학자재 규제정보',
      component: defineAsyncComponent(() => import(`./chemReviewEtc.vue`))
    })
  }
  return _items
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
  detailUrl.value = selectConfig.mdm.mam.review.get.url
  uploadedFilesUrl.value = selectConfig.com.upload.fileList.url
  requestUrl.value = transactionConfig.mdm.mam.review.request.url
  completeUrl.value = transactionConfig.mdm.mam.review.complete.url
  returnUrl.value = transactionConfig.mdm.mam.review.return.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 사전검토 상세 조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.mdmChemReviewId),
      method: 'GET'
    }).then((_result: any) => {
      review.value = _result.data
      getFileList('CHEM_REVIEW_MSDS')
      getFileList('CHEM_REVIEW_INGREDIENT_STATEMENT')

      review.value.bills = []
      if (review.value.prodReguls && review.value.prodReguls.length > 0) {
        review.value.bills = _.map(review.value.prodReguls, (value) => {
          return {
            regulationBillCd: value['regulationBillCd'],
            regulationBillName: value['regulationBillName'],
            reguls: []
          }
        })
        review.value.bills = _.uniqBy(review.value.bills, (item) => {
          return item.regulationBillCd
        })
        _.forEach(review.value.bills, (bill) => {
          bill.reguls = _.filter(review.value.prodReguls, {
            regulationBillCd: bill.regulationBillCd
          })
        })
      }

      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
    })
  } else {
    // 신규등록인 경우
    review.value.reviewRequestDate = getToday()
    review.value.plantCds = user.value.plantCd
    review.value.mdmChemReviewStepCd = 'MCR0000001' // 직성중

    /**
     * 검토자 목록 : default X, 사용자가 직접 입력하게 처리
     *
     * 안전/보건/환경 관리자(권한)
     */
  }
}
/******************************
 * TODO (목적): 첨부된 파일 갯수 파악
 * @param (1): 첨부 업무 코드
 *******************************/
function getFileList(taskClassCd: string) {
  $http({
    url: uploadedFilesUrl.value,
    method: 'GET',
    params: {
      taskClassCd: taskClassCd,
      taskKey: props.popupParam.mdmChemReviewId
    }
  }).then((_result: any) => {
    if (_result.data) {
      const prop = taskClassCd === 'CHEM_REVIEW_MSDS' ? 'msds' : 'ingrdient'
      fileLength.value[prop] = _result.data.length
    }
  })
}
/******************************
 * TODO (목적): 반려 팝업 표시
 *******************************/
function returnDialogOpen() {
  // 반려사유 팝업 열기
  returnDialog.value.show = true
}
/******************************
 * TODO (목적): 반려 팝업 닫기
 *******************************/
function closeReturnDialog() {
  returnDialog.value.show = false
}
/******************************
 * TODO (목적): 검토자 유효성 체크
 *******************************/
function validChecker() {
  return new Promise((resolve) => {
    if (review.value.checks && review.value.checks.length > 0) {
      resolve(true)
    } else {
      message.alert({
        title: '안내',
        message: '검토자가 지정되지 않았습니다.',
        type: 'warning' // success / info / warning / error
      })
      resolve(false)
    }
  })
}
/******************************
 * TODO (목적): 필수 입력값 유효성체크
 *******************************/
function validBaseInfo() {
  return new Promise((resolve) => {
    if (review.value.reviewRequestDate && review.value.plantCds) {
      resolve(true)
    } else {
      message.alert({
        title: '안내',
        message: '기본정보 [자재, 검토요청일, 관련사업장] 정보는 필수값입니다.',
        type: 'warning' // success / info / warning / error
      })
      resolve(false)
    }
  })
}
/******************************
 * TODO (목적): 구성물질 유효성체크
 *******************************/
function validSubs() {
  return new Promise((resolve) => {
    if (review.value.subs && review.value.subs.length > 0) {
      resolve(true)
    } else {
      message.alert({
        title: '안내',
        message: '구성물질을 하나 이상 등록하시기 바랍니다.',
        type: 'warning' // success / info / warning / error
      })
      resolve(false)
    }
  })
}
/******************************
 * TODO (목적): 구성물질 함유량에 따른 성분내역서 유효성체크
 *******************************/
function validIngrdientStatemen() {
  return new Promise((resolve) => {
    let limitRepvalSum = 0
    _.forEach(review.value.subs, (sub) => {
      limitRepvalSum += sub.limitRepval && !isNaN(sub.limitRepval) ? Number(sub.limitRepval) : 0
    })
    if (limitRepvalSum === 100) {
      resolve(true)
    } else {
      if (fileLength.value.ingrdient > 0) {
        resolve(true)
      } else {
        message.alert({
          title: '안내',
          message: '구성물질의 함유량 합이 100%가 안될 경우 성분내역서가 첨부되어야 합니다.',
          type: 'warning' // success / info / warning / error
        })
        resolve(false)
      }
    }
  })
}
/******************************
 * TODO (목적): MSDS 첨부파일 유효성 체크
 *******************************/
function validMsds() {
  return new Promise((resolve) => {
    if (fileLength.value.msds > 0) {
      resolve(true)
    } else {
      message.alert({
        title: '안내',
        message: 'MSDS 첨부하시기 바랍니다.',
        type: 'warning' // success / info / warning / error
      })
      resolve(false)
    }
  })
}
/******************************
 * TODO (목적): 검토요청 컨펌
 *******************************/
function confirmRequest() {
  return new Promise((resolve) => {
    message.confirm({
      title: '확인',
      message: '검토자에게 검토요청하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        resolve(true)
      },
      // 취소 callback 함수
      cancelCallback: () => {
        resolve(false)
      }
    })
  })
}
/******************************
 * TODO (목적): 검토요청 진행
 *******************************/
function requestValue() {
  return new Promise((resolve) => {
    isRequest.value = !isRequest.value
    resolve(true)
  })
}
/******************************
 * TODO (목적): 검토 요청 전 처리
 *******************************/
function requestReview() {
  /**
   * 1. 검토자가 지정되었는지?
   * 2. 기본정보 : 자재, 검토요청일, 관련사업장
   * 3. 구성물질이 하나 이상 들어가 있는지?
   * 4. 구성물질의 함유량의 합이 100%가 안될시 성분내역서 필수
   * 5. MSDS 첨부
   */
  const promises = [
    {
      func: validChecker
    },
    {
      func: validBaseInfo
    },
    {
      func: validSubs
    },
    {
      func: validIngrdientStatemen
    },
    {
      func: validMsds
    },
    {
      func: confirmRequest
    },
    {
      func: requestValue
    }
  ]
  orderedPromise(promises)
}
/******************************
 * TODO (목적): 검토 요청 후 처리
 *******************************/
function requestReviewCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 완료 전 처리
 *******************************/
function completeReview() {
  /**
   * 현재는 유효성 넣지 않음
   */
  message.confirm({
    title: '확인',
    message: '완료하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      review.value.chgUserId = user.value.userId

      isComplete.value = !isComplete.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 완료 후 처리
 *******************************/
function completeReviewCallback() {
  message.requestSuccess()
  // 계획 상세 조회
  getDetail()
}
/******************************
 * TODO (목적): 반려 전 처리
 *******************************/
function returnReview() {
  if (!review.value.returnRemark) {
    message.alert({
      title: '안내',
      message: '반려사유를 입력하십시오.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  message.confirm({
    title: '확인',
    message: '검토요청 반려하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      review.value.chgUserId = user.value.userId

      isReturn.value = !isReturn.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 반려 후 처리
 *******************************/
function returnReviewCallback() {
  message.requestSuccess()
  returnDialog.value.show = false
  // 계획 상세 조회
  getDetail()
}
/******************************
 * TODO (목적): 팝업닫기
 *******************************/
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
