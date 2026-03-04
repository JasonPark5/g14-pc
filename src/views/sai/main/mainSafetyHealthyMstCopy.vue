<template>
  <div>
    <c-search-box>
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
          <c-datepicker
            :editable="editable"
            type="year"
            label="목표년도"
            name="targetYear"
            v-model:value="searchParam.targetYear"
          />
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"
          style="padding-top: 28px !important"
        >
          <c-btn label="복사" icon="check" @btnClicked="select" />
        </div>
      </template>
    </c-search-box>
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
  name: 'mainSafetyHealthyMstCopy'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

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
const editable = ref(true)
const searchParam = ref<any>({
  plantCd: null,
  targetYear: '',
  useFlag: 'Y',
  deptCd: ''
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
  // list setting
}

function select() {
  const selectData = searchParam.value.targetYear
  if (!selectData) {
    message.alert({
      title: '안내',
      message: '복사대상 년도를 선택하세요.', // 년도별 목표를 선택하세요.
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', { year: selectData })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
