<template>
  <div>
    <c-table
      ref="checkTable"
      :title="title"
      :columns="gridColumns"
      :data="review.checks"
      :gridHeight="gridHeight"
      selection="multiple"
      rowKey="mdmChemReviewCheckId"
      :columnSetting="false"
      :filtering="false"
      :usePaging="false"
      :hideBottom="true"
      :editable="editable && !disabled"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled && review.checks && review.checks.length > 0"
            label="제외"
            icon="remove"
            @btnClicked="addRemove"
          />
          <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addCheck" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'process'">
          <q-btn-group
            v-if="
              editable &&
              !disabled &&
              (props.row.mdmChemReviewCheckStepCd === 'CRC0000005' ||
                props.row.mdmChemReviewCheckStepCd === 'CRC0000010')
            "
            outline
          >
            <template>
              <c-btn
                v-if="editable && !disabled && props.row.mdmChemReviewCheckStepCd === 'CRC0000005'"
                label="검토완료"
                icon="check"
                @btnClicked="checkComplete(props)"
              />
              <c-btn
                v-else-if="
                  editable && !disabled && props.row.mdmChemReviewCheckStepCd === 'CRC0000010'
                "
                label="검토취소"
                icon="cancel"
                @btnClicked="checkCancel(props)"
              />
            </template>
          </q-btn-group>
          <template v-if="props.row.reviewDt">
            <div>
              {{ $language('검토일시') }} :
              <span class="text-primary" style="font-size: 1.1em; font-weight: 800">
                {{ props.row.reviewDt.slice(0, -5) }}
              </span>
            </div>
          </template>
        </template>
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
import { chemReviewType } from './chemReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemReviewCheck'
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
  review: chemReviewType
  disabled: boolean
  btnEditable: boolean
  contentHeight: string
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
  popupParam: () => {
    return {
      mdmChemReviewId: ''
    }
  },
  review: () => {
    return {
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
    }
  },
  disabled: false,
  btnEditable: false,
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  defaultColumns: [
    {
      name: 'userName',
      field: 'userName',
      label: '검토자',
      align: 'center',
      style: 'width:10%',
      sortable: false
    }
  ],
  data: []
})
const checkCompleteUrl = ref('')
const checkCancelUrl = ref('')
const checkTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const title = computed(() => {
  let _text = $language('검토 결과 목록')
  if (props.review.mdmChemReviewStepCd === 'MCR0000005') {
    _text = $language('검토자 목록')
  }
  return _text
})
const gridHeight = computed(() => {
  let margin = 500
  if (props.btnEditable) {
    margin += 50
  }
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - margin
      : 300
  if (height < 300) {
    height = 300
  }
  return `${String(height)}px`
})
const gridColumns = computed(() => {
  /**
   * 작성중인 단계에서 분야 col은 disableTarget에 값을 주지 않게 처리
   */
  let _col: Array<tableColumnType> = _.cloneDeep(grid.value.defaultColumns)
  if (props.review.mdmChemReviewStepCd === 'MCR0000001') {
    _col = _.concat(_col, [
      {
        name: 'mdmChemReviewClassName',
        field: 'mdmChemReviewClassName',
        label: '분야',
        align: 'left',
        sortable: false,
        type: 'text',
        required: true
      }
    ])
  } else {
    _col = _.concat(_col, [
      {
        name: 'mdmChemReviewClassName',
        field: 'mdmChemReviewClassName',
        label: '분야',
        align: 'left',
        sortable: false,
        type: 'text',
        required: true
        // disableTarget: 'mdmChemReviewCheckStepCd',
        // disableCon: 'CRC0000005',
      },
      {
        name: 'mdmChemReviewResultCd',
        field: 'mdmChemReviewResultCd',
        label: '검토결과',
        align: 'center',
        style: 'width:15%',
        sortable: false,
        type: 'radio',
        codeGroupCd: 'MDM_CHEM_REVIEW_RESULT_CD'
        // disableTarget: 'mdmChemReviewCheckStepCd',
        // disableCon: 'CRC0000005',
      },
      {
        name: 'remarks',
        field: 'remarks',
        label: '비고',
        align: 'left',
        style: 'width:20%',
        sortable: false,
        type: 'textarea'
        // disableTarget: 'mdmChemReviewCheckStepCd',
        // disableCon: 'CRC0000005',
      },
      {
        name: 'process',
        field: 'process',
        label: '처리',
        align: 'center',
        style: 'width:15%',
        sortable: false,
        type: 'custom'
      }
    ])
  }
  return _col
})
const checkEditable = computed(
  () => editable.value && props.review.mdmChemReviewStepCd === 'MCR0000005'
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
  checkCompleteUrl.value = transactionConfig.mdm.mam.review.check.complete.url
  checkCancelUrl.value = transactionConfig.mdm.mam.review.check.cancel.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 검토자 추가를 위한 사용자 팝업 표시
 *******************************/
function addCheck() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 사용자 팝업 닫기
 * @param (1): 선택한 사용자 정보
 *******************************/
function closeUserPopup(data: Array<userType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (!props.review.checks) props.review.checks = []
    _.forEach(data, (item) => {
      if (_.findIndex(props.review.checks, { userId: item.userId }) === -1) {
        props.review.checks!.splice(0, 0, {
          mdmChemReviewId: props.popupParam.mdmChemReviewId,
          mdmChemReviewCheckId: uid(),
          mdmChemReviewClassName: '',
          userId: item.userId,
          userName: item.userName,
          mdmChemReviewResultCd: 'MCRR000005', // 적합
          mdmChemReviewCheckStepCd: checkEditable.value ? 'CRC0000005' : 'CRC0000001', // 준비중
          remarks: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 검토자 제외
 *******************************/
function addRemove() {
  const selectData = checkTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '제외하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(selectData, (item) => {
          if (!props.review.deleteChecks) props.review.deleteChecks = []
          if (
            item.editFlag !== 'C' &&
            _.findIndex(props.review.deleteChecks, {
              mdmChemReviewCheckId: item.mdmChemReviewCheckId
            })
          ) {
            props.review.deleteChecks.push(item)
          }
          props.review.checks = _.reject(props.review.checks, item)
        })
        checkTable.value.compoTable.clearSelection()
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 검토완료 처리
 * @param (1): 행 전체 정보
 *******************************/
function checkComplete(data: any) {
  message.confirm({
    title: '확인',
    message: '검토완료하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      data.row.chgUserId = user.value.userId

      $http({
        url: checkCompleteUrl.value,
        method: 'PUT',
        data: data.row
      }).then((_result: any) => {
        message.requestSuccess()
        props.review.checks![data.rowIndex] = _result.data
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 검토취소 처리
 * @param (1): 행 전체 정보
 *******************************/
function checkCancel(data: any) {
  message.confirm({
    title: '확인',
    message: '검토취소하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      data.row.chgUserId = user.value.userId

      $http({
        url: checkCancelUrl.value,
        method: 'PUT',
        data: data.row
      }).then((_result: any) => {
        message.requestSuccess()
        props.review.checks![data.rowIndex] = _result.data
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
