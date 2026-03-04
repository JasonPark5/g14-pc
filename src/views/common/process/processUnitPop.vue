<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="processTable2"
          title="단위공정 목록"
          :columns="grid.columns"
          :data="grid.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          :filtering="false"
          @rowClick="rowClick"
          gridHeight="540px"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <q-form ref="editForm">
          <c-card title="단위공정 상세" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="단위공정명"
                  name="processName"
                  v-model:value="data.processName"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  label="단위공정코드"
                  name="processCd"
                  v-model:value="data.processCd"
                />
              </div>
              <div class="col-3">
                <c-radio
                  :editable="editable"
                  :comboItems="useFlagItems"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="data.useFlag"
                />
              </div>
              <div class="col-12">
                <c-dept-multi
                  label="관리부서"
                  :disabled="true"
                  name="managementDepts"
                  v-model:value="data.managementDepts"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  label="단위공정 설명"
                  name="processDesc"
                  :rows="2"
                  v-model:value="data.processDesc"
                />
              </div>
              <div class="col-3">
                <c-select
                  :editable="editable"
                  codeGroupCd="WORK_CYCLE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="workCycleCd"
                  label="작업발생 주기"
                  v-model:value="data.workCycleCd"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="editable"
                  type="number"
                  label="작업시간(1회)"
                  name="workingTime"
                  v-model:value="data.workingTime"
                />
              </div>
              <div class="col-12">
                <c-upload :attachInfo="attachInfo1" :editable="editable" label="단위공정 사진" />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>
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
  name: 'processUnitPop'
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
const attachInfo1 = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'PROCESS_UNIT_PHOTO',
  taskKey: ''
})
const useFlagItems = ref<codeMasterType>([])
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
const listUrl = ref('')
const detailUrl = ref('')
const grid = ref<any>({
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '단위공정명',
      align: 'left',
      sortable: true
    }
  ],
  data: []
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
  listUrl.value = selectConfig.mdm.process.list.url
  detailUrl.value = selectConfig.mdm.process.get.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList({ processCd: props.processCd })
}
/******************************
 * TODO (목적): 공정 조회
 *******************************/
function getList(row: any) {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      processLevelCd: '20',
      upProcessCd: row.processCd
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function rowClick(row: any) {
  $http({
    url: $format(detailUrl.value, row.processCd),
    method: 'GET'
  }).then((_result: any) => {
    data.value = _result.data
    attachInfo1.value.taskKey = row.processCd
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
