<template>
  <div class="row manual-detail manual-page-layout">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-card title="개정 전" class="cardClassDetailForm" height="400px">
        <template v-slot:card-select>
          <c-select
            :comboItems="gridrev.data"
            type="custom"
            typetext="개정이력"
            itemText="revisionNum"
            itemValue="opmGuidebookId"
            name="selectedopmGuidebookId"
            label=""
            v-model:value="selectedopmGuidebookId"
            @update:value="rowClickRev"
          />
        </template>
        <template v-slot:card-detail>
          <div class="col-12">
            <div v-html="revRemark" />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-card title="개정 후" class="cardClassDetailForm" height="400px">
        <template v-slot:card-detail>
          <div class="col-12">
            <div v-html="popupParam.remark" />
          </div>
        </template>
      </c-card>
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
  name: 'safetyOperGuideBookEditor'
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
  popupParam: {
    groupId?: stringNull
    remark?: stringNull
    opmGuidebookId?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
      groupId: '',
      remark: '',
      opmGuidebookId: ''
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
const gridrev = ref<gridType>({
  columns: [],
  data: []
})
const selectedopmGuidebookId = ref(null)
const revRemark = ref('')
const detailUrl = ref('')
const revlistUrl = ref('')

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
  // url setting
  detailUrl.value = selectConfig.sop.opm.guidebook.get.url
  revlistUrl.value = selectConfig.sop.opm.guidebook.rev.url
  // code setting
  // list setting
  getRevList()
}
/******************************
 * TODO (목적): 버전 조회
 *******************************/
function getRevList() {
  $http({
    url: revlistUrl.value,
    method: 'GET',
    params: { groupId: props.popupParam.groupId }
  }).then((_result: any) => {
    gridrev.value.data = _.reject(_result.data, { opmGuidebookId: props.popupParam.opmGuidebookId })
    if (gridrev.value.data && gridrev.value.data.length > 0) {
      selectedopmGuidebookId.value = gridrev.value.data[0].opmGuidebookId
      getDetail()
    }
  })
}
/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  $http({
    url: $format(detailUrl.value, selectedopmGuidebookId.value),
    method: 'GET'
  }).then((_result: any) => {
    revRemark.value = _result.data.remark
  })
}
/******************************
 * TODO (목적): 개정버전번호 선택시 실행
 *******************************/
function rowClickRev(row: any) {
  if (row && row != props.popupParam.opmGuidebookId) {
    selectedopmGuidebookId.value = row
    getDetail()
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
