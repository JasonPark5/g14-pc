<template>
  <div style="padding-bottom: 20px !important">
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :required="true"
            type="year"
            default="today"
            label="기준년도"
            name="wasteYear"
            v-model:value="searchParam.wasteYear"
          />
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9"
          style="position: relative; top: 24px; text-align: right"
        >
          <q-btn-group outline>
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table1"
      title="폐기물 발생량"
      :columns="grid.columns"
      gridHeightAuto
      :data="grid.data"
      :merge="grid.merge"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :filtering="false"
      :expandAll="true"
    />
    <c-table
      ref="table2"
      title="월별 생산량"
      :columns="grid2.columns"
      gridHeightAuto
      :data="grid2.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :filtering="false"
      :expandAll="true"
      topBorderClass="topcolor-blue"
    />
    <c-table
      ref="table3"
      title="폐기물 원단위 분석 (생산량/폐기물 발생량)"
      :columns="grid3.columns"
      gridHeightAuto
      :data="grid3.data"
      :merge="grid3.merge"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :filtering="false"
      :expandAll="true"
      topBorderClass="topcolor-blue"
    />
    <c-table
      ref="table4"
      title="월별 처리비용"
      :columns="grid4.columns"
      gridHeightAuto
      :data="grid4.data"
      :merge="grid4.merge"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :filtering="false"
      :expandAll="true"
      topBorderClass="topcolor-orange"
    />
    <c-table
      ref="table5"
      title="폐기물 원단위 분석 (처리비용/폐기물 발생량)"
      :columns="grid5.columns"
      gridHeightAuto
      :data="grid5.data"
      :merge="grid5.merge"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :filtering="false"
      :expandAll="true"
      topBorderClass="topcolor-orange"
    />
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
  name: 'wasteUCManage'
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
const searchParam = ref({
  plantCd: null as stringNull,
  wasteYear: ''
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'envWasteKindName' }],
  columns: [
    {
      name: 'envWasteKindName',
      field: 'envWasteKindName',
      label: '폐기물종류',
      style: 'width: 120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envWasteName',
      field: 'envWasteName',
      label: '폐기물명',
      style: 'width: 150px',
      align: 'center',
      sortable: false
    },
    {
      name: 'tvUnit',
      field: 'tvUnit',
      label: '단위',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'tv01',
      field: 'tv01',
      label: '1월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv02',
      field: 'tv02',
      label: '2월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv03',
      field: 'tv03',
      label: '3월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv04',
      field: 'tv04',
      label: '4월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv05',
      field: 'tv05',
      label: '5월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv06',
      field: 'tv06',
      label: '6월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv07',
      field: 'tv07',
      label: '7월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv08',
      field: 'tv08',
      label: '8월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv09',
      field: 'tv09',
      label: '9월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv10',
      field: 'tv10',
      label: '10월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv11',
      field: 'tv11',
      label: '11월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv12',
      field: 'tv12',
      label: '12월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tvtotal',
      field: 'tvtotal',
      label: 'Total',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'tvUnit',
      field: 'tvUnit',
      label: '단위',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'tv01',
      field: 'tv01',
      label: '1월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv02',
      field: 'tv02',
      label: '2월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv03',
      field: 'tv03',
      label: '3월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv04',
      field: 'tv04',
      label: '4월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv05',
      field: 'tv05',
      label: '5월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv06',
      field: 'tv06',
      label: '6월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv07',
      field: 'tv07',
      label: '7월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv08',
      field: 'tv08',
      label: '8월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv09',
      field: 'tv09',
      label: '9월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv10',
      field: 'tv10',
      label: '10월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv11',
      field: 'tv11',
      label: '11월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv12',
      field: 'tv12',
      label: '12월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tvtotal',
      field: 'tvtotal',
      label: 'Total',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    }
  ],
  data: []
})
const grid3 = ref<gridType>({
  merge: [{ index: 0, colName: 'envWasteKindName' }],
  columns: [
    // {
    //   name: 'plantName',
    //   field: 'plantName',
    //   label: '사업장',
    //   align: 'center',
    //   style: 'width: 120px',
    //   sortable: false
    // },
    {
      name: 'envWasteKindName',
      field: 'envWasteKindName',
      label: '폐기물종류',
      style: 'width: 120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envWasteName',
      field: 'envWasteName',
      label: '폐기물명',
      style: 'width: 210px',
      align: 'center',
      sortable: false
    },
    // {
    //   name: 'tvUnit',
    //   field: 'tvUnit',
    //   label: '단위',
    //   align: 'center',
    //   style: 'width: 60px',
    //   sortable: false,
    // },
    {
      name: 'tv01',
      field: 'tv01',
      label: '1월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv02',
      field: 'tv02',
      label: '2월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv03',
      field: 'tv03',
      label: '3월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv04',
      field: 'tv04',
      label: '4월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv05',
      field: 'tv05',
      label: '5월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv06',
      field: 'tv06',
      label: '6월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv07',
      field: 'tv07',
      label: '7월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv08',
      field: 'tv08',
      label: '8월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv09',
      field: 'tv09',
      label: '9월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv10',
      field: 'tv10',
      label: '10월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv11',
      field: 'tv11',
      label: '11월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv12',
      field: 'tv12',
      label: '12월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tvtotal',
      field: 'tvtotal',
      label: 'Total',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    }
  ],
  data: []
})
const grid4 = ref<gridType>({
  merge: [{ index: 0, colName: 'envWasteKindName' }],
  columns: [
    {
      name: 'envWasteKindName',
      field: 'envWasteKindName',
      label: '폐기물종류',
      style: 'width: 120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envWasteName',
      field: 'envWasteName',
      label: '폐기물명',
      style: 'width: 210px',
      align: 'center',
      sortable: false
    },
    {
      name: 'tvUnit',
      field: 'tvUnit',
      label: '단위',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'tv01',
      field: 'tv01',
      label: '1월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv02',
      field: 'tv02',
      label: '2월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv03',
      field: 'tv03',
      label: '3월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv04',
      field: 'tv04',
      label: '4월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv05',
      field: 'tv05',
      label: '5월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv06',
      field: 'tv06',
      label: '6월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv07',
      field: 'tv07',
      label: '7월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv08',
      field: 'tv08',
      label: '8월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv09',
      field: 'tv09',
      label: '9월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv10',
      field: 'tv10',
      label: '10월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv11',
      field: 'tv11',
      label: '11월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv12',
      field: 'tv12',
      label: '12월',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tvtotal',
      field: 'tvtotal',
      label: 'Total',
      type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    }
  ],
  data: []
})
const grid5 = ref<gridType>({
  merge: [{ index: 0, colName: 'envWasteKindName' }],
  columns: [
    // {
    //   name: 'plantName',
    //   field: 'plantName',
    //   label: '사업장',
    //   align: 'center',
    //   style: 'width: 120px',
    //   sortable: false
    // },
    {
      name: 'envWasteKindName',
      field: 'envWasteKindName',
      label: '폐기물종류',
      style: 'width: 120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'envWasteName',
      field: 'envWasteName',
      label: '폐기물명',
      style: 'width: 210px',
      align: 'center',
      sortable: false
    },

    // {
    //   name: 'tvUnit',
    //   field: 'tvUnit',
    //   label: '단위',
    //   align: 'center',
    //   style: 'width: 60px',
    //   sortable: false,
    // },
    {
      name: 'tv01',
      field: 'tv01',
      label: '1월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv02',
      field: 'tv02',
      label: '2월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv03',
      field: 'tv03',
      label: '3월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv04',
      field: 'tv04',
      label: '4월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv05',
      field: 'tv05',
      label: '5월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv06',
      field: 'tv06',
      label: '6월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv07',
      field: 'tv07',
      label: '7월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv08',
      field: 'tv08',
      label: '8월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv09',
      field: 'tv09',
      label: '9월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv10',
      field: 'tv10',
      label: '10월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv11',
      field: 'tv11',
      label: '11월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tv12',
      field: 'tv12',
      label: '12월',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
    },
    {
      name: 'tvtotal',
      field: 'tvtotal',
      label: 'Total',
      // type: 'cost',
      align: 'right',
      style: 'width: 90px',
      sortable: false
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
  listUrl.value = selectConfig.env.waste.volume.uc.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  const isAllSearch = false
  // if (searchParam.value.plantCd.split(',').length > 1) isAllSearch = true
  if (searchParam.value.wasteYear) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      if (isAllSearch) {
        grid.value.data = _.filter(_result.data, { tvTypeCdTop: 'A' })
        grid2.value.data = _.filter(_result.data, { tvTypeCdTop: 'F' })
        grid3.value.data = _.filter(_result.data, { tvTypeCdTop: 'O' })
        grid4.value.data = _.filter(_result.data, { tvTypeCdTop: 'J' })
        grid5.value.data = _.filter(_result.data, { tvTypeCdTop: 'Q' })
      } else {
        grid.value.data = _.filter(_result.data, { tvTypeCdTop: 'A', totalFlag: 'X' })
        grid2.value.data = _.filter(_result.data, { tvTypeCdTop: 'F', totalFlag: 'X' })
        grid3.value.data = _.filter(_result.data, { tvTypeCdTop: 'O', totalFlag: 'X' })
        grid4.value.data = _.filter(_result.data, { tvTypeCdTop: 'J', totalFlag: 'X' })
        grid5.value.data = _.filter(_result.data, { tvTypeCdTop: 'Q', totalFlag: 'X' })
      }
    })
  } else {
    message.alert({
      title: '안내',
      message: '기준년도를 선택하세요',
      type: 'warning' // success / info / warning / error
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
