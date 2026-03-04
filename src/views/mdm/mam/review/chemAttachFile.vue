<template>
  <div>
    <c-card class="cardClassDetailForm" :noHeader="true">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-upload
            :attachInfo="attachInfoMsds"
            :editable="editable && !disabled"
            label="MSDS"
            @files="(fileList: Array<any>) => files(fileList, 'MSDS')"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-upload
            :attachInfo="attachInfoIngredientStatement"
            :editable="editable && !disabled"
            label="화학물질 성분내역서"
            @files="(fileList: Array<any>) => files(fileList, 'INGRDIENT')"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-upload
            :attachInfo="attachInfoConfirmationStatement"
            :editable="editable && !disabled"
            label="화학물질 확인명세서"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-upload
            :attachInfo="attachInfoReport"
            :editable="editable && !disabled"
            label="성적서"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-upload
            :attachInfo="attachInfoLicense"
            :editable="editable && !disabled"
            label="유해화학물질 신고/인허가"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-upload :attachInfo="attachInfoEtc" :editable="editable && !disabled" label="기타" />
        </div>
      </template>
    </c-card>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemAttachFile'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  disabled: boolean
  fileLength: {
    msds: numberNull
    ingrdient: numberNull
  }
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
  disabled: false,
  fileLength: () => {
    return {
      msds: 0,
      ingrdient: 0
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
const attachInfoMsds = ref({
  isSubmit: '',
  taskClassCd: 'CHEM_REVIEW_MSDS',
  taskKey: ''
})
const attachInfoIngredientStatement = ref({
  isSubmit: '',
  taskClassCd: 'CHEM_REVIEW_INGREDIENT_STATEMENT',
  taskKey: ''
})
const attachInfoConfirmationStatement = ref({
  isSubmit: '',
  taskClassCd: 'CHEM_REVIEW_CONFIRMATION_STATEMENT',
  taskKey: ''
})
const attachInfoReport = ref({
  isSubmit: '',
  taskClassCd: 'CHEM_REVIEW_REPORT',
  taskKey: ''
})
const attachInfoLicense = ref({
  isSubmit: '',
  taskClassCd: 'CHEM_REVIEW_LICENSE',
  taskKey: ''
})
const attachInfoEtc = ref({
  isSubmit: '',
  taskClassCd: 'CHEM_REVIEW_ETC',
  taskKey: ''
})

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
  attachInfoMsds.value.taskKey = props.popupParam.mdmChemReviewId
  attachInfoIngredientStatement.value.taskKey = props.popupParam.mdmChemReviewId
  attachInfoConfirmationStatement.value.taskKey = props.popupParam.mdmChemReviewId
  attachInfoReport.value.taskKey = props.popupParam.mdmChemReviewId
  attachInfoLicense.value.taskKey = props.popupParam.mdmChemReviewId
  attachInfoEtc.value.taskKey = props.popupParam.mdmChemReviewId
  // list setting
}
/******************************
 * TODO (목적): MSDS, 성분내역서 파일 업로드 개수 파악
 * @param (1): 업로드 된 파일
 * @param (2): MSDS, 성분내역서 구분
 *******************************/
function files(fileList: Array<any>, type: string) {
  if (type === 'MSDS') {
    props.fileLength.msds = fileList.length
  } else {
    props.fileLength.ingrdient = fileList.length
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
