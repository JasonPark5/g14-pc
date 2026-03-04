<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="활동월"
            name="actMonth"
            type="month"
            :range="true"
            default="today"
            v-model:value="searchParam.actMonths"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="배출량 실적관리"
          tableId="processManual"
          :columns="grid.columns"
          :gridHeight="grid.height"
          :data="grid.data"
          :columnSetting="false"
          :isFullScreen="true"
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
      </div>
    </div>
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
  name: 'emissions'
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
  columns?: Array<tableColumnType>
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
  isFull: false,
  width: '100%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  actMonths: [],
  actStartMonth: null,
  actEndMonth: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true
    },
    {
      name: 'actMonth',
      field: 'actMonth',
      label: '활동월',
      align: 'center',
      sortable: true
    },
    {
      name: 'activity',
      field: 'activity',
      label: '배출활동',
      align: 'center',
      sortable: true
    },
    {
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설',
      align: 'center',
      type: 'link',
      sortable: true
    },
    {
      name: 'col0',
      field: 'col0',
      label: '연료별 목표배출량(Ton)',
      align: 'center',
      child: [
        {
          name: 'fuel',
          field: 'fuel',
          label: '연료명',
          align: 'center',
          sortable: true
        },
        {
          name: 'co2',
          field: 'co2',
          label: 'CO2',
          align: 'center',
          type: 'number',
          sortable: true
        },
        {
          name: 'ch4',
          field: 'ch4',
          label: 'CH4',
          align: 'center',
          type: 'number',
          sortable: true
        },
        {
          name: 'n2o',
          field: 'n2o',
          label: 'N2O',
          align: 'center',
          type: 'number',
          sortable: true
        }
      ]
    },
    {
      name: 'col25',
      field: 'col25',
      label: '연료별 배출계수(MWh)',
      helpcomment:
        'MWh 배출계수는 이산화탄소 배출량을 전기발전량으로 나눈 값으로, 온실가스 배출계수라고도 한다. <br/>TJ는 에너지 사용량을 나타내는 단위로, 전력사용량을 MWh에서 TJ로 환산할 때는 9 × 10-3을 곱한다.',
      child: [
        {
          name: 'mco2',
          field: 'mco2',
          label: 'TCO2/TJ',
          type: 'cost',
          sortable: true,
          style: 'width: 120px'
        },
        {
          name: 'mch4',
          field: 'mch4',
          label: 'kgCH4/TJ',
          type: 'cost',
          sortable: true,
          style: 'width: 120px'
        },
        {
          name: 'mn2o',
          field: 'mn2o',
          label: 'kgN2O/TJ',
          type: 'cost',
          sortable: true,
          style: 'width: 120px'
        }
      ]
    }
  ],
  data: [
    {
      plantName: '사업장1',
      actMonth: '2022-11',
      activity: '기체연료연소',
      dischargeName: '공정연소시설 #021',
      fuel: '나프타',
      co2: '123',
      ch4: '0.8',
      n2o: '0.12',
      mco2: '0.0021',
      mch4: '0.0009',
      mn2o: '0.0150'
    },
    {
      plantName: '사업장1',
      actMonth: '2022-11',
      activity: '기체연료연소',
      dischargeName: '공정연소시설 #021',
      fuel: '중류',
      co2: '21',
      ch4: '0.9',
      n2o: '0.11',
      mco2: '0.0094',
      mch4: '0.0071',
      mn2o: '0.0050'
    },
    {
      plantName: '사업장1',
      actMonth: '2022-11',
      activity: '기체연료연소',
      dischargeName: '공정연소시설 #033',
      fuel: 'LNG',
      co2: '120',
      ch4: '0.35',
      n2o: '0.7',
      mco2: '0.0042',
      mch4: '0.0017',
      mn2o: '0.0190'
    }
  ]
})
const editable = ref(true)
// const listUrl = ref('')

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
  // code setting
  if (searchParam.value.actMonths) {
    searchParam.value.actStartMonth = searchParam.value.actMonths[0]
    searchParam.value.actEndMonth = searchParam.value.actMonths[1]
  }
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  //   $http({
  //     url: listUrl.value,
  //     method: 'GET',
  //     params: searchParam.value
  //   }).then((_result: any) => {
  //     grid.value.data = _result.data
  //   })
  console.log(grid.value.data)
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick() {
  popupOptions.value.title = '배출활동/배출시설별 배출량 상세'
  popupOptions.value.param = {}
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./emissionsDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  // getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
