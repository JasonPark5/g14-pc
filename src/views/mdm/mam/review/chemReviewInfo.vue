<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="deleteEditable"
                  :url="deleteUrl"
                  :isSubmit="isDelete"
                  mappingType="DELETE"
                  label="삭제"
                  icon="remove"
                  @beforeAction="removeReview"
                  @btnCallback="removeReviewCallback"
                />
                <c-btn
                  v-if="editable && !disabled"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="review"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="화학자재명"
                  name="materialName"
                  v-model:value="review.materialName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-datepicker
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  label="검토요청일"
                  name="reviewRequestDate"
                  v-model:value="review.reviewRequestDate"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  :disabled="disabled || isOld"
                  label="화학자재명(EN)"
                  name="materialNameEn"
                  v-model:value="review.materialNameEn"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="CAS No."
                  name="casNo"
                  v-model:value="review.casNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="MSDS No."
                  name="msdsNo"
                  v-model:value="review.msdsNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  :editable="editable"
                  codeGroupCd="CHEM_INGREDIENTS_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  label="구성성분 작성근거"
                  name="chemIngredientsCd"
                  v-model:value="review.chemIngredientsCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="" :noHeaderCard="true" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="고유번호"
                  name="serialNo"
                  v-model:value="review.serialNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="KE번호"
                  name="keNo"
                  v-model:value="review.keNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="HS번호"
                  name="hsNo"
                  v-model:value="review.hsNo"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCds"
                  v-model:value="review.plantCds"
                />
              </div> -->
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="" :noHeaderCard="true" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-task-target
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'vendor' }"
                  label="공급사"
                  name="deliveryVendorCd"
                  v-model:value="review.deliveryVendorCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-task-target
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'vendor' }"
                  label="제조사"
                  name="mfgVendorCd"
                  v-model:value="review.mfgVendorCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  :comboItems="mixFlagItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="mixFlag"
                  label="물질구성"
                  v-model:value="review.mixFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="PROPERTIES_STATE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="propertiesStateCd"
                  label="성상"
                  v-model:value="review.propertiesStateCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="USAGE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="usageCd"
                  label="용도"
                  v-model:value="review.usageCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable && review.usageCd == 'UC99999999'"
                  label="용도(기타)"
                  name="usageEtc"
                  v-model:value="review.usageEtc"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="PRODUCT_MANUF_CLASS_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  label="제품제조구분"
                  name="productManufClassCd"
                  v-model:value="review.productManufClassCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="PRODUCT_CATEGORY_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  label="제품구분"
                  name="productCategoryCd"
                  v-model:value="review.productCategoryCd"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="formLabelTitle txtlabelcheck">{{ $language('제품 분류') }} </span>
                <q-checkbox
                  :disable="!editable"
                  :label="$language('제조')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.makeFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('수입')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.impFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('구매')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.buyFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('사용')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.usingFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('수출')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.expFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('판매')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.salesFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <span class="formLabelTitle txtlabelcheck">{{ $language('나노물질') }}</span>
                <q-checkbox
                  :disable="!editable"
                  :label="$language('제조')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.nanoManufacturingFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('수입')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.nanoIncomeFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('해당없음')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.nanoNoneApplicableFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('모름')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="review.nanoUnknownFlag"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card
            title=""
            :noHeaderCard="true"
            class="cardClassDetailForm"
            style="min-height: 266px !important; height: auto"
          >
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="보관시설(창고) 유무"
                  name="keepFacilityFlag"
                  v-model:value="review.keepFacilityFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-text
                  :disabled="review.keepFacilityFlag === 'N'"
                  :editable="editable"
                  type="number"
                  label="최대보관량(톤)"
                  name="maxKeepAmount"
                  v-model:value="review.maxKeepAmount"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="저장시설(탱크) 유무"
                  name="storageFacilityFlag"
                  v-model:value="review.storageFacilityFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-text
                  :disabled="review.storageFacilityFlag === 'N'"
                  :editable="editable"
                  type="number"
                  label="최대저장량(톤)"
                  name="maxStorageAmount"
                  v-model:value="review.maxStorageAmount"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="제조·사용시설 여부"
                  name="manufacturingFacilitiesFlag"
                  v-model:value="review.manufacturingFacilitiesFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="유해화학물질(PSM) 여부"
                  name="psmFlag"
                  v-model:value="review.psmFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="인허가대상 물질 여부"
                  name="licensingFlag"
                  v-model:value="review.licensingFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="위험물 여부"
                  name="dangerFlag"
                  v-model:value="review.dangerFlag"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
    <c-table
      ref="checkTable"
      :title="review.mdmChemReviewStepCd === 'MCR0000005' ? '검토자 목록' : '검토 결과 목록'"
      :columns="gridColumns"
      :data="review.checks"
      gridHeight="300px"
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
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled && props.row.mdmChemReviewCheckStepCd === 'CRC0000005'"
              label="검토완료"
              icon="check"
              @btnClicked="checkComplete(props)"
            />
            <span v-if="props.row.reviewDt && props.row.mdmChemReviewCheckStepCd === 'CRC0000010'">
              {{ $language('검토일시') }} :
              <b class="text-primary">{{ props.row.reviewDt.slice(0, 16) }}</b>
              <q-chip
                v-if="props.row.userId === user.userId || review.regUserId === user.userId"
                class="q-ml-sm"
                color="grey-6"
                outline
                square
                dense
                clickable
                @click="checkCancel(props)"
              >
                <q-icon name="close" size="1.2em" /><b>{{ $language('검토취소') }}</b>
              </q-chip>
            </span>
          </q-btn-group>
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
// import checkComponent from './chemReviewCheck.vue'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemReviewInfo'
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
const emits = defineEmits(['getDetail', 'closePopup'])

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
  isOld: boolean
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
      materialCd: '', // 자재코드
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
  isOld: false,
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
const mappingType = ref('POST')
const validUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const isDelete = ref(false)
const mixFlagItems = ref<Array<codeMasterType>>([])
const msdsFlagItems = ref<Array<codeMasterType>>([])
const editForm = ref<any>(null)
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const checkCompleteUrl = ref(transactionConfig.mdm.mam.review.check.complete.url)
const checkCancelUrl = ref(transactionConfig.mdm.mam.review.check.cancel.url)
const checkTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const deleteEditable = computed(
  () =>
    editable.value &&
    !props.disabled &&
    props.isOld &&
    props.review.mdmChemReviewStepCd === 'MCR0000001'
)
const gridColumns = computed(() => {
  // 작성중인 단계에서 분야 col은 disableTarget에 값을 주지 않게 처리
  let _col: Array<tableColumnType> = [
    {
      name: 'userName',
      field: 'userName',
      label: '검토자',
      align: 'center',
      style: 'width:10%',
      sortable: false
    }
  ]
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
        style: 'width:15%',
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
        style: 'width:18%',
        sortable: false,
        type: 'custom'
      }
    ])
  }
  return _col
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
  validUrl.value = selectConfig.mdm.mam.review.valid.url
  saveUrl.value = transactionConfig.mdm.mam.review.insert.url
  deleteUrl.value = transactionConfig.mdm.mam.review.delete.url
  // code setting
  mixFlagItems.value = [
    { code: 'Y', codeName: $language('혼합') },
    { code: 'N', codeName: $language('단일') }
  ]
  msdsFlagItems.value = [
    { code: 'Y', codeName: $language('MSDS 제출') },
    { code: 'N', codeName: $language('MSDS 비공개 승인대상') }
  ]
  // list setting
}
/******************************
 * TODO (목적): 사전 검토 저장 전 처리
 *******************************/
function saveInfo() {
  // 기본정보 및 검토자/결과 정보 저장
  if (props.popupParam.mdmChemReviewId) {
    saveUrl.value = transactionConfig.mdm.mam.review.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.mdm.mam.review.insert.url
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (
        validTable(
          [
            {
              required: true,
              name: 'mdmChemReviewClassName',
              label: $language('분야')
            }
          ],
          props.review.checks!,
          $language('검토 결과 목록')
        )
      ) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            props.review.regUserId = user.value.userId
            props.review.chgUserId = user.value.userId
            isSave.value = !isSave.value
          },
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 사전 검토 저장 후 처리
 * @param (1): API 서버 반환값
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.mdmChemReviewId = result.data
  emits('getDetail')
}
/******************************
 * TODO (목적): 사전검토 삭제 전 처리
 *******************************/
function removeReview() {
  deleteUrl.value = $format(
    transactionConfig.mdm.mam.review.delete.url,
    props.popupParam.mdmChemReviewId
  )
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      isDelete.value = true
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 사전검토 삭제 후 처리
 *******************************/
function removeReviewCallback() {
  message.requestSuccess()
  emits('closePopup')
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
          mdmChemReviewCheckStepCd:
            editable.value && props.review.mdmChemReviewStepCd === 'MCR0000005'
              ? 'CRC0000005'
              : 'CRC0000001', // 준비중
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
    cancelCallback: () => {}
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
