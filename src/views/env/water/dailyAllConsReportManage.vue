<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="getHeader(false)"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept type="search" label="등록부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            defaultStart="-2M"
            defaultEnd="0M"
            label="작성기간"
            name="dailyResultDts"
            v-model:value="searchParam.dailyResultDts"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="폐수배출시설 운영일지"
      tableId="grid"
      :columns="grid.columns"
      :gridHeight="grid.height"
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
  name: 'dailyAllConsReportManage'
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
interface searchParamType {
  dailyResultDts: Array<any>
  plantCd: stringNull
  deptCd: stringNull
  envWaterMstAdditiveIds: Array<any>
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
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
const searchParam = ref<searchParamType>({
  dailyResultDts: [],
  plantCd: null,
  deptCd: '',
  envWaterMstAdditiveIds: []
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '95%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const headerUrl = ref('')
const originalCol = ref<any>([
  {
    name: 'plantName',
    field: 'plantName',
    label: '사업장',
    align: 'center',
    sortable: true,
    style: 'width:120px',
    fix: true
  },
  {
    name: 'dailyResultDt',
    field: 'dailyResultDt',
    label: '년월일',
    align: 'center',
    sortable: true,
    type: 'link',
    style: 'width:120px',
    fix: true
  },
  {
    name: 'approvalStatusName',
    field: 'approvalStatusName',
    label: '상태',
    align: 'center',
    sortable: true,
    style: 'width:100px'
  },
  {
    label: '결재',
    align: 'center',
    child: [
      {
        name: 'approveName1',
        field: 'approveName1',
        label: '대표자',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'approveName2',
        field: 'approveName2',
        label: '환경기술인',
        align: 'center',
        style: 'width:120px',
        sortable: false
      }
    ]
  },
  {
    name: 'oprDtStr',
    field: 'oprDtStr',
    label: '가동시간',
    align: 'center',
    sortable: false,
    style: 'width:160px'
  },
  {
    name: 'useAmount',
    field: 'useAmount',
    label: '용수사용량(L)',
    align: 'right',
    sortable: false,
    style: 'width:120px'
  },
  {
    name: 'wasteAmount',
    field: 'wasteAmount',
    label: '폐수발생량(L)',
    align: 'right',
    sortable: false,
    style: 'width:120px'
  },
  {
    label: '폐수 위탁처리',
    align: 'center',
    child: [
      {
        name: 'entrustAmount',
        field: 'entrustAmount',
        label: '위탁량(L)',
        align: 'right',
        sortable: false,
        style: 'width:120px'
      },
      {
        name: 'entrustNo',
        field: 'entrustNo',
        label: '위탁ㆍ수탁 확인서<br>일련번호',
        align: 'center',
        sortable: false,
        style: 'width:160px'
      },
      {
        name: 'entrustVendorName',
        field: 'entrustVendorName',
        label: '처리업소명',
        align: 'center',
        sortable: false,
        style: 'width:150px'
      }
    ]
  },
  {
    name: 'stoAmount',
    field: 'stoAmount',
    label: '보관폐수량(L)',
    align: 'center',
    sortable: false,
    style: 'width:120px'
  },
  {
    name: 'remark',
    field: 'remark',
    label: '기타 중요사항',
    align: 'center',
    sortable: false,
    style: 'width:200px'
  }
])

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
  listUrl.value = selectConfig.env.water.entrust.result.list.url
  headerUrl.value = selectConfig.env.water.mst.additive.list.url
  // code setting
  // list setting
  getHeader(false)
}
function getHeader(_ischange: any) {
  grid.value.columns = []
  grid.value.data = []
  _.extend(grid.value.columns, originalCol.value)

  $http({
    url: headerUrl.value,
    method: 'GET',
    params: { plantCd: searchParam.value.plantCd, useFlag: 'Y' }
  }).then((_result: any) => {
    const _child = [] as any
    searchParam.value.envWaterMstAdditiveIds = []
    if (_result.data.length > 0) {
      _.forEach(_result.data, (item) => {
        searchParam.value.envWaterMstAdditiveIds.push(item.envWaterMstAdditiveId)
        _child.push({
          name: item.envWaterMstAdditiveId,
          field: item.envWaterMstAdditiveId,
          label: item.envWaterMstAdditiveName,
          type: 'cost',
          style: 'width: 90px',
          sortable: false
        })
      })
      grid.value.columns.splice(5, 0, {
        label: '원료사용량',
        align: 'center',
        child: _child
      })
      if (!_ischange) {
        getList()
      }
    } else {
      message.alert({
        title: '안내',
        message: '수질 기준정보에서 해당사업장에 원료/첨가제정보가 없습니다.',
        type: 'warning' // success / info / warning / error
      })
    }
  })
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function linkClick(row: any) {
  detailPopup(row)
}
function detailPopup(result: any) {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./dailyAllConsReportManageDetail.vue`))
  )

  popupOptions.value.title = '폐수 전량위탁 운영일지 상세'
  popupOptions.value.param = {
    envWaterEntrustResultId: result ? result.envWaterEntrustResultId : '',
    plantCd: result ? result.plantCd : '',
    approvalStatusCd: result ? result.approvalStatusCd : null
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
