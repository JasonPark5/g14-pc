<template>
  <div class="manual-detail manual-page-layout">
    <embed :src="userManualData.pdfUrl" type="application/pdf" width="100%" :height="pdfHeight" />
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
  name: 'userManualPage'
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

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam?: {
    userManualId?: boolean
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
      userManualId: false
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
const detailUrl = ref('')
const userManualData = ref<any>({
  userManualId: '',
  taskName: '',
  pdfUrl: '' // PDF 파일 경로
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'USER_MANUAL',
  taskKey: ''
})
const pdfHeight = ref('600px')
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

onBeforeUnmount(() => {
  window.removeEventListener('resize', setPdfHeight)
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)\
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  // url setting
  detailUrl.value = selectConfig.um.userManualPdf.get.url
  // code setting
  setPdfHeight()
  window.addEventListener('resize', setPdfHeight)
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: $format(detailUrl.value, props.popupParam.userManualId),
    method: 'GET'
  }).then((_result: any) => {
    userManualData.value = _result.data
    // 고객사 파일저장소 위치에 따라 pdfUrl 설정
    if (import.meta.env.VITE_UPLOAD_TYPE === 'AWS') {
      userManualData.value.pdfUrl = 'https://s3.andami.kr/shmsbucket/' + _result.data.pdfDownPath
    } else {
      userManualData.value.pdfUrl = 'https://ehs.kr.group14.local/files/' + _result.data.pdfDownPath
    }
    // title.value = '[사용자 매뉴얼] ' + userManualData.value.taskName
    // document.title = title.value
    attachInfo.value.taskKey = _result.data.userManualId
  })
}

/******************************
 * TODO (목적): 높이 설정
 *******************************/
function setPdfHeight() {
  const offset = 105 // 필요에 따라 조정
  pdfHeight.value = window.innerHeight - offset + 'px'
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<style lang="scss">
.manual-detail {
  padding: 10px;
}
.manual-page-layout img {
  width: 100%;
  height: auto;
}
</style>
