<template>
  <div>
    <c-card class="cardClassDetailInfo" :noHeader="true">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-label-text title="화학자재명" :value="review.materialName" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-label-text title="CAS No." :value="review.casNo" />
        </div>
      </template>
    </c-card>
    <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :review="review"
          :disabled="disabled"
          :fileLength="fileLength"
          @getDetailInfo="getDetailInfo"
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
import { chemReviewType } from './chemReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemReviewEtc'
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
    mdmChemReviewId: stringNull
  }
  review: chemReviewType
  disabled: boolean
  btnEditable: boolean
  fileLength: {
    msds: numberNull
    ingrdient: numberNull
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
  fileLength: () => {
    return {
      msds: 0,
      ingrdient: 0
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
const tab = ref('chemLaw')
const tabItems = ref([
  {
    name: 'chemLaw',
    icon: 'gavel',
    label: '규제사항',
    component: shallowRef(defineAsyncComponent(() => import(`./chemReviewLaw.vue`)))
  },
  {
    name: 'chemAttachFile',
    icon: 'drive_folder_upload',
    label: '첨부파일',
    component: shallowRef(defineAsyncComponent(() => import(`./chemAttachFile.vue`)))
  }
  // {
  //   name: 'chemQuantity',
  //   icon: 'tag',
  //   label: '정량값',
  //   component: shallowRef(defineAsyncComponent(() => import(`./chemReviewQuantity.vue`)))
  // }
])

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  let margin = 130
  if (props.btnEditable) {
    margin += 10
  }
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - margin
      : 600
  if (height < 600) {
    height = 600
  }
  return `${String(height)}px`
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
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 상세조회 emit
 *******************************/
function getDetailInfo() {
  emits('getDetail')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
