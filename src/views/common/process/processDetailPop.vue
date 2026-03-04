<template>
  <div>
    <q-form ref="editForm">
      <c-card title="공정상세" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              :required="true"
              label="공정명"
              name="processName"
              v-model:value="data.processName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              label="공정코드"
              name="processCd"
              v-model:value="data.processCd"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-plant
              :editable="editable"
              label="사업장"
              name="plantCd"
              v-model:value="data.plantCd"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-radio
              :editable="editable"
              :comboItems="psmYnItems"
              label="PSM대상"
              name="psmFlag"
              v-model:value="data.psmFlag"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-radio
              :editable="editable"
              :comboItems="useFlagItems"
              label="사용여부"
              name="useFlag"
              v-model:value="data.useFlag"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
            <c-text
              :editable="editable"
              label="주재료"
              name="mainMaterial"
              v-model:value="data.mainMaterial"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
            <c-text
              :editable="editable"
              label="생산품"
              name="productName"
              v-model:value="data.productName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              label="근로자수"
              name="workerCnt"
              suffix="명"
              type="number"
              v-model:value="data.workerCnt"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-textarea
              :editable="editable"
              label="공정설명"
              name="processDesc"
              :rows="2"
              v-model:value="data.processDesc"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-upload :attachInfo="attachInfoUp" :editable="editable" label="공정 사진" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-upload :attachInfo="attachInfo3" :editable="editable" label="그 밖의 유해위험정보" />
          </div>
        </template>
      </c-card>
    </q-form>
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
  name: 'processDetailPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  processCd?: stringNull
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
  processCd: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const attachInfoUp = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'PROCESS_UP',
  taskKey: ''
})
const attachInfo3 = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'PROCESS_UNIT_HAZARD',
  taskKey: ''
})
const useFlagItems = ref<codeMasterType>([])
const psmYnItems = ref<codeMasterType>([])
const data = ref<processType>({
  plantCd: null,
  processCd: '',
  processName: '',
  upProcessCd: '',
  processLevelCd: '',
  processDesc: '',
  managementDepts: '',
  orderNo: '',
  useFlag: 'Y',
  psmFlag: 'Y',
  workCycleCd: null,
  workingTime: null,
  col1: []
})
const detailUrl = ref('')

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
  detailUrl.value = selectConfig.mdm.process.get.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  psmYnItems.value = [
    { code: 'Y', codeName: $language('대상') },
    { code: 'N', codeName: $language('해당없음') }
  ]
  // list setting
  getData()
}
function getData() {
  $http({
    url: $format(detailUrl.value, props.processCd),
    method: 'GET'
  }).then((_result: any) => {
    data.value = _result.data
    attachInfoUp.value.taskKey = props.processCd
    attachInfo3.value.taskKey = props.processCd
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
