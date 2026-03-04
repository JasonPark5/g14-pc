<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="공정"
            type="search"
            name="processCd"
            :customPopupParam="{ targetKey: 'process' }"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="점검년월"
            name="month"
            type="month"
            default="today"
            v-model:value="searchParam.month"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            stepperGrpCd="MIM_DAILY_STATUS_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="checkStatusCd"
            label="진행상태"
            v-model:value="searchParam.checkStatusCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="일상점검 목록"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :checkClickFlag="false"
      rowKey="minEquipmentCheckId"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn label="등록" v-if="editable" icon="add" @btnClicked="onItemClick()" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
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
  name: 'equipmentDailyInspection'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface searchParamType {
  plantCd: stringNull
  month: stringNull
  processCd: stringNull
  utilityFlag: stringNull
  checkStatusCd: stringNull
}

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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<searchParamType>({
  plantCd: null,
  month: '',
  processCd: '',
  utilityFlag: 'N',
  checkStatusCd: null
})
const grid = ref<any>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      style: 'width:100px',
      label: '사업장',
      align: 'center',
      sortable: false
    },
    {
      name: 'processName',
      field: 'processName',
      style: 'width:80px',
      label: '공정',
      align: 'center',
      sortable: false
    },
    {
      name: 'dailyName',
      field: 'dailyName',
      style: 'width:200px',
      label: '점검명',
      align: 'left',
      type: 'link',
      sortable: false
    },
    {
      name: 'checkStatusName',
      field: 'checkStatusName',
      label: '진행단계',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재진행단계',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'checkDate',
      field: 'checkDate',
      style: 'width:100px',
      label: '점검월',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkUserName',
      field: 'checkUserName',
      style: 'width:100px',
      label: '점검자',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const listUrl = ref('')
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
  listUrl.value = selectConfig.sop.min.equipment.plan.daily.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 일상점검 조회
 *******************************/
function getList() {
  // 전체조회
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/* eslint-disable no-unused-vars */
/******************************
 * TODO (목적): 일상점검 상세 조회
 *******************************/
function linkClick(row: any) {
  popupOptions.value.param = {
    dailyCheckId: row ? row.dailyCheckId : ''
  }
  popupOptions.value.title = '일상점검 상세'

  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./equipmentDailyDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 일상점검 등록
 *******************************/
function onItemClick() {
  linkClick(null)
}
/******************************
 * TODO (목적): 일상점검 상세 팝업 닫기 콜백
 *******************************/
function closePopup(type: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (type === 'COMPLETE' || type === 'SAVE') {
    message.requestSuccess()
  }
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style>
.blinking {
  -webkit-animation: blink 3s ease-in-out infinite alternate;
  -moz-animation: blink 3s ease-in-out infinite alternate;
  animation: blink 3s ease-in-out infinite alternate;
}
@-webkit-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
