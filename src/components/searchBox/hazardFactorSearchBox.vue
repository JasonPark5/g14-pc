<template>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      codeGroupCd="HAZARD_CLASS_FST_CD"
      type="search"
      :disabled="true"
      itemText="codeName"
      itemValue="code"
      name="hazardClassFstCd"
      label="유해인자 대분류"
      v-model:value="searchParam.hazardClassFstCd"
    />
  </div>
  <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
    <c-select
      :comboItems="occSecItems"
      type="search"
      itemText="codeName"
      itemValue="code"
      name="hazardClassSecCd"
      label="유해인자 중분류"
      v-model:value="searchParam.hazardClassSecCd"
    />
  </div>
</template>

<script setup lang="ts">
/**
 *  1. defineOptions 수정
 *  2. props.propsSearchParam 수정
 *  3. init 커스텀
 *  4. defineExpose 지우면 안됨.
 */

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
  name: 'hazardFactorSearchBox'
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
  propsSearchParam: {
    hazardClassFstCd: stringNull
    workEnvFlag: stringNull
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
  propsSearchParam: () => {
    return {
      hazardClassFstCd: '',
      workEnvFlag: 'Y'
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
const searchParam = ref({
  hazardClassFstCd: null,
  hazardClassSecCd: null,
  useFlag: 'Y',
  workEnvFlag: null
})
const occSecItems = ref<Array<codeMasterType>>([])

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
 * TODO (목적): 초기세팅
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function init() {
  // role setting
  // url setting
  // code setting
  if (props.propsSearchParam.hazardClassFstCd) {
    searchParam.value.hazardClassFstCd = props.propsSearchParam.hazardClassFstCd
    getHazardClassSecCd(props.propsSearchParam.hazardClassFstCd)
  }
  if (props.propsSearchParam.workEnvFlag) {
    searchParam.value.workEnvFlag = props.propsSearchParam.workEnvFlag
  }
}
/******************************
 * TODO (목적): 두번쩨 selct 요소의 아이템 가져옴
 * @param (1): 첫번쪠 유해요인 분류코드
 * @param (2):
 * @return (반환):
 *******************************/
function getHazardClassSecCd(hazardClassFstCd: stringNull) {
  $http({
    url: $format(selectConfig.sys.code.mst.list.attr.url, 'HAZARD_CLASS_SEC_CD', hazardClassFstCd),
    method: 'GET'
  }).then((_result: any) => {
    occSecItems.value = []
    searchParam.value.hazardClassSecCd = null
    _.forEach(_result.data, (_item) => {
      occSecItems.value.push({
        code: _item.code,
        codeName: _item.codeName
      })
    })
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ searchParam })
</script>
