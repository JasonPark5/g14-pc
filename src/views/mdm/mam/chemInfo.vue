<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !isOld"
                  label="구매전 검토 불러오기"
                  icon="system_update_alt"
                  @btnClicked="openReview"
                />
                <c-btn
                  v-if="editable && isOld"
                  label="경고표지(6 x 4)"
                  icon="print"
                  @btnClicked="printWarning('s')"
                />
                <c-btn
                  v-if="editable && isOld"
                  label="경고표지(11 x 9)"
                  icon="print"
                  @btnClicked="printWarning('m')"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="chemData"
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
                  label="화학자재번호"
                  name="mdmChemMaterialCd"
                  v-model:value="chemData.mdmChemMaterialCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="화학자재명"
                  name="mdmChemMaterialName"
                  v-model:value="chemData.mdmChemMaterialName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="CAS No."
                  name="casNo"
                  v-model:value="chemData.casNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="MSDS No."
                  name="msdsNo"
                  v-model:value="chemData.msdsNo"
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
                  v-model:value="chemData.chemIngredientsCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="" :noHeaderCard="true" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="고유번호"
                  name="serialNo"
                  v-model:value="chemData.serialNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="KE번호"
                  name="keNo"
                  v-model:value="chemData.keNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="HS번호"
                  name="hsNo"
                  v-model:value="chemData.hsNo"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="" :noHeaderCard="true" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="chemData.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-dept
                  :editable="editable"
                  label="사용부서"
                  name="depts"
                  v-model:value="chemData.depts"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="chemData.useFlag"
                />
              </div>
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
                  v-model:value="chemData.deliveryVendorCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-task-target
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'vendor' }"
                  label="제조사"
                  name="mfgVendorCd"
                  v-model:value="chemData.mfgVendorCd"
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
                  v-model:value="chemData.mixFlag"
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
                  v-model:value="chemData.propertiesStateCd"
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
                  v-model:value="chemData.usageCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable && chemData.usageCd == 'UC99999999'"
                  label="용도(기타)"
                  name="usageEtc"
                  v-model:value="chemData.usageEtc"
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
                  v-model:value="chemData.productManufClassCd"
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
                  v-model:value="chemData.productCategoryCd"
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
                  v-model="chemData.makeFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('수입')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="chemData.impFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('구매')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="chemData.buyFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('사용')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="chemData.usingFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('수출')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="chemData.expFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('판매')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="chemData.salesFlag"
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
                  v-model="chemData.nanoManufacturingFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('수입')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="chemData.nanoIncomeFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('해당없음')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="chemData.nanoNoneApplicableFlag"
                />
                <q-checkbox
                  :disable="!editable"
                  :label="$language('모름')"
                  dense
                  color="orange-custom"
                  true-value="Y"
                  false-value="N"
                  class="customqcbox"
                  v-model="chemData.nanoUnknownFlag"
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
                  v-model:value="chemData.keepFacilityFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-text
                  :disabled="chemData.keepFacilityFlag === 'N'"
                  :editable="editable"
                  type="number"
                  label="최대보관량(톤)"
                  name="maxKeepAmount"
                  v-model:value="chemData.maxKeepAmount"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="저장시설(탱크) 유무"
                  name="storageFacilityFlag"
                  v-model:value="chemData.storageFacilityFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-text
                  :disabled="chemData.storageFacilityFlag === 'N'"
                  :editable="editable"
                  type="number"
                  label="최대저장량(톤)"
                  name="maxStorageAmount"
                  v-model:value="chemData.maxStorageAmount"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="제조·사용시설 여부"
                  name="manufacturingFacilitiesFlag"
                  v-model:value="chemData.manufacturingFacilitiesFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="유해화학물질(PSM) 여부"
                  name="psmFlag"
                  v-model:value="chemData.psmFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="인허가대상 물질 여부"
                  name="licensingFlag"
                  v-model:value="chemData.licensingFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="위험물 여부"
                  name="dangerFlag"
                  v-model:value="chemData.dangerFlag"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <component :is="componentId" :popupParam="popupParam" :chemData="chemData" />
        </div>
      </div>
    </q-form>
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
import { chemMaterialType } from './chemMaterial'
// import { chemReviewType } from './review/chemReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** user 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
    mdmChemMaterialId: string
    tabName: stringNull
    subtabName: stringNull
    plantCd: stringNull
  }
  chemData: chemMaterialType
  contentHeight: stringNull
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
      mdmChemMaterialId: '',
      tabName: '',
      subtabName: '',
      plantCd: null
    }
  },
  chemData: () => {
    return {
      plantCd: null, // 사업장코드
      plantName: '', // 사업장
      mdmChemMaterialId: '', // 화학자재 일련번호
      mdmChemMaterialCd: '', // 화학자재번호
      mdmChemMaterialName: '', // 화학자재 품명
      mdmChemMaterialNameEn: '', // 화학자재 품명(영문)
      mdmChemReviewId: '', // 사전검토 일련번호
      deliveryVendorCd: '', // 납품업체 코드
      mfgVendorCd: '', // 제조업체 코드
      psmFlag: 'N', // PSM 대상 여부
      usageCd: null, // 용도-회사별 공통코드
      usageEtc: '', // 용도 기타
      msdsNo: '', // MSDS번호
      casNo: '', // MSDS번호
      inUnitCd: null, // 입고단위
      inConversonFactor: '', // 입고 환산계수
      inConversonUnitCd: null, // 입고 환산단위
      specificGravity: '', // 비중
      propertiesStateCd: null, // 성상
      freezingPoint: '', // 어는점
      boilPoint: '', // 끓는점
      flashPoint: '', // 인화점
      firePoint: '', // 발화점
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
      useFlag: 'Y', // 사용여부
      unusedReason: '', // 미사용사유
      preMdmChemMaterialId: '', // 이전화학자재 일련번호
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      depts: '', // 사용반
      revisionNum: '',
      groupId: '',
      sysRevision: 1,
      revisionContent: '제정',
      productCategoryCd: null, // 제품구분
      keepFacilityFlag: 'N', // 보관시설 유무
      maxKeepAmount: '', // 최대보관량
      storageFacilityFlag: 'N', // 저장시설 유무
      maxStorageAmount: '', // 최대저장량
      manufacturingFacilitiesFlag: 'N', // 제조 사용시설 여부
      nanoManufacturingFlag: 'N', // 나노물질 제조 여부
      nanoIncomeFlag: 'N', // 나노물질 수입 여부
      nanoNoneApplicableFlag: 'N', // 나노물질 해당없음 여부
      nanoUnknownFlag: 'N', // 나노물질 모름 여부
      inputDissolutionTank: '', // 투입 용해조
      productManufClassCd: null, // 제품제조구분 코드
      chemIngredientsCd: null, // 구성성분 작성근거
      mixFlag: 'N', // 물질구성(단일 N/혼합 Y)
      serialNo: '', // 고유번호(유독물번호or고시번호)
      fugacity: '', // 비산성(고체)
      keNo: '', // KE 번호
      hsNo: '', // HS번호
      meltingPoint: '', // 녹는점
      moleWeight: '', // 분자량
      mdmChemMaterialMsdsId: '', // MSDS key
      msdsRegDtStr: '', // MSDS 개정일시
      msdsRegUserName: '' // MSDS 개정자
    }
  },
  contentHeight: null
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
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
// const isUpdate = ref(true)
const saveUrl = ref('')
const mappingType = ref('POST')
const printUrl = ref('')
const checkUrl = ref('')
const isSave = ref(false)
const mixFlagItems = ref([
  { code: 'Y', codeName: '혼합' },
  { code: 'N', codeName: '단일' }
])
const editForm = ref<any>(null)
const componentId = computed(() =>
  markRaw(defineAsyncComponent(() => import(`./chemMsdsFile.vue`)))
)
/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.mdmChemMaterialId))

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
  saveUrl.value = transactionConfig.mdm.mam.chem.insert.url
  printUrl.value = selectConfig.mdm.mam.chem.print.url
  checkUrl.value = selectConfig.mdm.mam.chem.check.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 사전검토 완료 정보 팝업 표시
 *******************************/
function openReview() {
  popupOptions.value = getPopupOptions('chemReview', popupOptions.value, closeReviewPopup, {
    /** 원하는 parameter 정의 */
    type: 'single'
  })
}
/******************************
 * TODO (목적): 사전검토 완료 정보 팝업 닫기
 * @param (1): 선택한 사전검토 정보
 *******************************/
function closeReviewPopup(data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    props.chemData.mdmChemMaterialName = data[0].materialName
    props.chemData.mdmChemMaterialNameEn = data[0].materialNameEn
    _.extend(props.chemData, data[0])
  }
}
/******************************
 * TODO (목적): 화학자재 저장 전 처리
 *******************************/
function saveInfo() {
  if (props.popupParam.mdmChemMaterialId) {
    saveUrl.value = transactionConfig.mdm.mam.chem.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.mdm.mam.chem.insert.url
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.chemData.regUserId = user.value.userId
          props.chemData.chgUserId = user.value.userId
          if (props.chemData.useFlag == 'Y') props.chemData.unusedReason = ''
          if (props.chemData.usageCd != 'UC99999999') props.chemData.usageEtc = ''
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * TODO (목적): 화학자재 저장 후 처리
 * @param (1): API 서버에서 반환하는 값 (화학자재 key값)
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (mappingType.value == 'POST') {
    props.popupParam.mdmChemMaterialId = result.data.mdmChemMaterialId
    props.popupParam.plantCd = result.data.plantCd
  }
  emits('getDetail')
}
/******************************
 * TODO (목적): 경고표지 출력물 다운로드
 * @param (1): 경고표지 사이즈
 *******************************/
function printWarning(size: string) {
  $http({
    url: $format(printUrl.value, props.popupParam.mdmChemMaterialId),
    method: 'GET',
    params: { size: size }
  }).then((_result: any) => {
    const sizeTitle = size === 's' ? '6 x 4' : '11 x 9'
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = props.chemData.mdmChemMaterialName + '_' + sizeTitle + '.xlsx'
    link.click()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
