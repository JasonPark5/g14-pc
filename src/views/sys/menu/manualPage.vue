<template>
  <div class="manual-detail manual-page-layout">
    <c-card :title="title" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div class="col-12" v-if="manualData.pdfUseFlag === 'N'">
          <div v-html="manualData.content" />
        </div>
        <div class="col-12" v-if="manualData.pdfUseFlag === 'Y'">
          <embed :src="manualData.pdfUrl" type="application/pdf" width="100%" height="670px" />
        </div>
      </template>
    </c-card>
    <!-- <c-card
      title="첨부파일"
      class="cardClassDetailForm"
      style="margin-top: 10px; padding-bottom: 20px"
    >
      <template v-slot:card-detail>
        <div class="col-12">
          <c-upload :attachInfo="attachInfo" :editable="false" label="첨부파일" />
        </div>
      </template>
    </c-card> -->
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
import { menuType } from './menu'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'manualPage'
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

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const detailUrl = ref('')
const manualData = ref<menuType>({
  sysMenuId: '', // 메뉴 SEQ
  menuNm: '', // 메뉴 SEQ
  content: '', // 매뉴얼 내용
  useFlag: 'Y',
  pdfUseFlag: 'N',
  pdfUrl: '' // PDF 파일 경로
})
const title = ref('')
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'MANUAL_FILE',
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
 * TODO function 주석 작성 (asdffunctionannotation 사용)\
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  // url setting
  detailUrl.value = selectConfig.sys.manual.get.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: $format(detailUrl.value, route.query.sysMenuId),
    method: 'GET'
  }).then((_result: any) => {
    manualData.value = _result.data
    // TODO: 고객사 파일저장소 위치에 따라 pdfUrl 설정
    if (_result.data.pdfUseFlag == 'Y') {
      manualData.value.pdfUrl = 'https://s3.andami.kr/shmsbucket/' + _result.data.pdfDownPath
    }
    title.value = '[SHMS 매뉴얼] ' + manualData.value.menuNm
    document.title = title.value
    attachInfo.value.taskKey = _result.data.sysMenuId
  })
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
