<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            codeGroupCd="CHECK_UP_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="checkupTypeCd"
            label="건강진단 종류"
            v-model:value="searchParam.checkupTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker :range="true" label="검진기간" name="period" v-model:value="period" />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="건강진단 목록"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
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
  name: 'checkUpManage'
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
const searchParam = ref({
  plantCd: null,
  deptCd: null,
  checkupTypeCd: null,
  startYmd: '',
  endYmd: ''
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'checkupTypeName',
      field: 'checkupTypeName',
      label: '건강진단 종류',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkupName',
      field: 'checkupName',
      label: '제목',
      style: 'width:400px',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'hospitalName',
      field: 'hospitalName',
      label: '병원',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkupDate',
      field: 'checkupDate',
      label: '검진기간',
      style: 'width:200px',
      align: 'center',
      sortable: true
    },
    {
      name: 'resultCnt',
      field: 'resultCnt',
      label: '대상자수',
      style: 'width:80px',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const period = ref([])

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
  editable.value = Boolean(route.meta.editable)
  listUrl.value = selectConfig.hea.checkup.plan.list.url
  getList()
}

/******************************
 * TODO (목적): 검진목록 조회
 *******************************/
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
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

/******************************
 * TODO (목적): 상세 팝업창 표시
 *******************************/
function linkClick(row: any) {
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./checkUpResult.vue`)))
  popupOptions.value.title = '건강진단 결과 상세'
  popupOptions.value.param = {
    heaCheckupPlanId: row ? row.heaCheckupPlanId : ''
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
</script>
