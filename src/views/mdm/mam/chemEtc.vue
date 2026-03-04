<template>
  <div>
    <c-card class="cardClassDetailInfo" :noHeader="true">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-label-text title="화학자재명(국문)" :value="chemData.mdmChemMaterialName" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-label-text title="CAS No." :value="chemData.casNo" />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-label-text title="화학자재 일련번호" :value="chemData.mdmChemMaterialId" />
        </div> -->
      </template>
    </c-card>
    <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :chemData="chemData"
          :isSearch="isSearch"
          :contentHeight="contentHeight"
          @getDetail="getDetail"
        />
      </template>
    </c-tab>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemEtc'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  isSearch: stringNull
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
  contentHeight: null,
  isSearch: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const tab = ref('chemLaw')
const tabItems = ref([
  {
    name: 'chemLaw',
    icon: 'gavel',
    label: '규제사항',
    component: shallowRef(defineAsyncComponent(() => import(`./chemLaw.vue`)))
  },
  // {
  //   name: 'chemMsdsFile',
  //   icon: 'drive_folder_upload',
  //   label: 'MSDS',
  //   component: shallowRef(defineAsyncComponent(() => import(`./chemMsdsFile.vue`)))
  // },
  // {
  //   name: 'chemSummary',
  //   icon: 'warning',
  //   label: 'MSDS요약본',
  //   component: shallowRef(defineAsyncComponent(() => import(`./chemSummary.vue`)))
  // },
  // {
  //   name: 'chemAppraiseFile',
  //   icon: 'drive_folder_upload',
  //   label: '유/위해성<br>평가 결과',
  //   component: shallowRef(defineAsyncComponent(() => import(`./chemAppraiseFile.vue`)))
  // },
  // {
  //   name: 'chemQuantity',
  //   icon: 'tag',
  //   label: '정량값',
  //   component: shallowRef(defineAsyncComponent(() => import(`./chemQuantity.vue`)))
  // },
  {
    name: 'chemProcess',
    icon: 'gavel',
    label: '취급공정',
    component: shallowRef(defineAsyncComponent(() => import(`./chemProcess.vue`)))
  },
  {
    name: 'chemLicense',
    icon: 'assignment_turned_in',
    label: '관련 인허가',
    component: shallowRef(defineAsyncComponent(() => import(`./chemLicense.vue`)))
  },
  {
    name: 'chemAttach',
    icon: 'attach_file',
    label: '첨부파일',
    component: shallowRef(defineAsyncComponent(() => import(`./chemPhoto.vue`)))
  }
  // { name: 'chemDanger', icon: 'warning', label: '위험물 및<br/>지정수량', component: () => import(`${'./chemDanger.vue'}`) },
])
const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 500
    ? Number(props.contentHeight) - 128 + 'px'
    : '500px'
)

/******************************
 * @Computed_선언
 *******************************/

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
  // code setting
  if (props.popupParam.mdmChemMaterialId) {
    if (props.popupParam.subtabName) {
      tab.value = props.popupParam.subtabName
    }
  }
  // list setting
}
/******************************
 * TODO (목적): 화학자재 상세 조회 호출
 *******************************/
function getDetail() {
  emits('getDetail')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
