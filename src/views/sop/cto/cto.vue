<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="관찰작업"
            name="mdmSopId"
            :customPopupParam="{ targetKey: 'sop1' }"
            v-model:value="searchParam.mdmSopId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="관찰기간"
            defaultStart="-6M"
            defaultEnd="6M"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="행동관찰 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
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
  name: 'cto'
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
interface gridType {
  columns: tableColumnType
  data: Array<any>
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
const searchParam = ref<any>({
  plantCd: null,
  startYmd: '',
  endYmd: '',
  mdmSopId: '',
  sopName: '',
  period: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'ctoCompleteFlagName',
      field: 'ctoCompleteFlagName',
      label: '진행상태',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    {
      name: 'ctoDate',
      field: 'ctoDate',
      label: '관찰일',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'sopName',
      field: 'sopName',
      label: '관찰작업',
      align: 'left',
      sortable: true,
      style: 'width:200px',
      type: 'link'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '작업공정',
      align: 'center',
      sortable: true,
      style: 'width:200px'
    },
    {
      name: 'observeUserName',
      field: 'observeUserName',
      label: '관찰자',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'workArea',
      field: 'workArea',
      label: '작업구역',
      align: 'left',
      sortable: true,
      style: 'width:100px'
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
  listUrl.value = selectConfig.sop.cto.list.url
  // code setting
  // list setting
  getList()
}
function getList() {
  if (searchParam.value.period) {
    searchParam.value.startYmd = searchParam.value.period[0]
    searchParam.value.endYmd = searchParam.value.period[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }

  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function linkClick(row?: any) {
  popupOptions.value.title = '행동관찰 상세'
  popupOptions.value.param = {
    sopCtoId: row ? row.sopCtoId : ''
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./ctoDetail.vue`)))
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
