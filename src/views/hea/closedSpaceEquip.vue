<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            name="requestPeriod"
            label="신청기간"
            v-model:value="searchParam.requestPeriod"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            :plantCd="searchParam.plantCd"
            label="신청부서"
            name="deptCd"
            v-model:value="searchParam.deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            name="givePeriod"
            label="대여기간"
            v-model:value="searchParam.givePeriod"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="밀폐공간 작업장비 대여 목록"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
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
  name: 'closedSpaceEquip'
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

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  requestStartYmd: '',
  requestEndYmd: '',
  giveStartYmd: '',
  giveEndYmd: '',
  deptCd: '',
  requestPeriod: [],
  givePeriod: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:120px',
      align: 'center'
    },
    {
      name: 'spaceNameName',
      field: 'spaceNameName',
      label: '밀폐공간 명',
      style: 'width:200px',
      type: 'link',
      align: 'left'
    },
    {
      name: 'giveStatusName',
      field: 'giveStatusName',
      label: '진행단계',
      style: 'width:90px',
      align: 'center'
    },
    {
      label: '대여 신청',
      align: 'center',
      child: [
        {
          name: 'equipName',
          field: 'equipName',
          label: '신청품목',
          style: 'width:250px',
          align: 'left',
          sortable: true
        },
        {
          name: 'requestUserName',
          field: 'requestUserName',
          label: '신청자',
          style: 'width:130px',
          align: 'center'
        },
        {
          name: 'requestDate',
          field: 'requestDate',
          label: '신청일',
          style: 'width:100px',
          align: 'center'
        }
      ]
    },
    {
      label: '대여 및 반납',
      align: 'center',
      child: [
        {
          name: 'givePeriod',
          field: 'givePeriod',
          label: '대여기간',
          style: 'width:120px',
          align: 'center'
        },
        {
          name: 'returnDate',
          field: 'returnDate',
          label: '반납완료일',
          style: 'width:100px',
          align: 'center'
        }
      ]
    }
  ],
  data: []
})
const editable = ref(true)
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
  listUrl.value = selectConfig.hea.cse.gives.list.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (searchParam.value.requestPeriod) {
    searchParam.value.requestStartYmd = searchParam.value.requestPeriod[0]
    searchParam.value.requestEndYmd = searchParam.value.requestPeriod[1]
  } else {
    searchParam.value.requestStartYmd = ''
    searchParam.value.requestEndYmd = ''
  }
  if (searchParam.value.givePeriod) {
    searchParam.value.giveStartYmd = searchParam.value.givePeriod[0]
    searchParam.value.giveEndYmd = searchParam.value.givePeriod[1]
  } else {
    searchParam.value.giveStartYmd = ''
    searchParam.value.giveEndYmd = ''
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
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '밀폐공간 작업장비 대여 상세'
  popupOptions.value.param = {
    heaClosedSpaceEquipmentGiveId: row ? row.heaClosedSpaceEquipmentGiveId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./closedSpaceEquipDetail.vue`))
  )
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
