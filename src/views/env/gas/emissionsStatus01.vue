<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="년도"
            name="year"
            type="year"
            default="today"
            v-model:value="searchParam.year"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="배출량 현황"
          :columns="grid.columns"
          gridHeight="710px"
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
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  year: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width: 100px',
      sortable: true
    },
    {
      name: 'activity',
      field: 'activity',
      label: '배출활동',
      align: 'center',
      style: 'width: 100px',
      fix: true,
      sortable: true
    },
    {
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설',
      align: 'left',
      style: 'width: 180px',
      type: 'link',
      fix: true,
      sortable: true
    },
    {
      name: 'fuel',
      field: 'fuel',
      label: '연료명',
      align: 'center',
      style: 'width: 100px',
      fix: true,
      sortable: true
    },
    {
      name: 'col20',
      field: 'col20',
      label: '매개변수',
      align: 'center',
      child: [
        {
          name: 'tier',
          field: 'tier',
          label: '적용Tier',
          align: 'center',
          sortable: true,
          style: 'width: 80px'
        },
        {
          name: 'usage',
          field: 'usage',
          label: '연간사용량(Ton)',
          align: 'center',
          sortable: true,
          style: 'width: 80px'
        },
        {
          name: 'tj',
          field: 'tj',
          label: 'TJ',
          type: 'cost',
          helpcomment: `TJ는 에너지 사용량을 나타내는 단위로, 전력사용량을 MWh에서 TJ로 환산할 때는 9 × 10-3을 곱한다.`,
          sortable: true,
          style: 'width: 80px'
        },
        {
          name: 'toe',
          field: 'toe',
          label: 'TOE',
          type: 'cost',
          helpcomment: `TOE는 석유환산톤(Ton of Oil Equivalent)으로 원유 1톤(t)이 갖는 열량을 말한다.`,
          sortable: true,
          style: 'width: 80px'
        }
      ]
    },
    {
      name: 'col25',
      field: 'col25',
      label: '배출계수(MWh)',
      helpcomment:
        'MWh 배출계수는 이산화탄소 배출량을 전기발전량으로 나눈 값으로, 온실가스 배출계수라고도 한다. <br/>TJ는 에너지 사용량을 나타내는 단위로, 전력사용량을 MWh에서 TJ로 환산할 때는 9 × 10-3을 곱한다.',
      child: [
        {
          name: 'mco2',
          field: 'mco2',
          label: 'TCO2/TJ',
          type: 'cost',
          sortable: true,
          style: 'width: 80px'
        },
        {
          name: 'mch4',
          field: 'mch4',
          label: 'kgCH4/TJ',
          type: 'cost',
          sortable: true,
          style: 'width: 80px'
        },
        {
          name: 'mn2o',
          field: 'mn2o',
          label: 'kgN2O/TJ',
          type: 'cost',
          sortable: true,
          style: 'width: 80px'
        }
      ]
    },
    {
      name: 'col30',
      field: 'col30',
      label: '순발열량<br/>(GJ/단위)',
      helpcomment:
        '[총발열량] 이란 연료의 연소과정에서 발생하는 수증기의 잠열을 포함한 발열량을 말한다. <br/>[순발열량] 이란 연료의 연소과정에서 발생하는 수증기의 잠열을 제외한 발열량을 말한다.',
      type: 'cost',
      sortable: true,
      style: 'width: 80px'
    },
    {
      name: 'col31',
      field: 'col31',
      label: '산화율(%)',
      helpcomment:
        '✅ 의미:<br/>- 연료 연소 시, 연료의 탄소 성분이 CO₂로 변환되는 비율<br/>- 일반적으로 완전 연소 시 100% (1.0) 로 가정하지만, 연소 효율에 따라 일부는 일산화탄소(CO)나 탄화수소(CH₄) 등으로 배출될 수도 있음<br/>- 대부분의 배출량 산정에서는 산화율을 고려하여 CO₂ 배출량을 계산<br/> ✅ 예시:<br/>- 천연가스의 산화율: 약 99.5%<br/>- 석탄의 산화율: 약 98%<br/>- 디젤의 산화율: 약 99%',
      type: 'cost',
      sortable: true,
      style: 'width: 80px'
    },
    {
      name: 'col32',
      field: 'col32',
      label: 'GWP',
      helpcomment:
        '지구온난화지수(Global Warming Potential)로, 온실가스 배출량에 곱하여 이산화탄소 환산량(CO2e)을 계산하는 데 사용된다. <br/>이산화탄소를 제외한 다른 온실가스를 이산화탄소 기준으로 환산해 비교하는 데 사용된다.',
      child: [
        {
          name: 'co2',
          field: 'co2',
          label: 'CO2',
          type: 'cost',
          sortable: true,
          style: 'width: 80px'
        },
        {
          name: 'ch4',
          field: 'ch4',
          label: 'CH4',
          type: 'cost',
          sortable: true,
          style: 'width: 80px'
        },
        {
          name: 'n2o',
          field: 'n2o',
          label: 'N2O',
          type: 'cost',
          sortable: true,
          style: 'width: 80px'
        }
      ]
    },
    {
      name: 'col40',
      field: 'col40',
      label: '배출량(Ton)',
      child: [
        {
          name: 'col41',
          field: 'col41',
          label: '1Q',
          child: [
            {
              name: 'mon1',
              field: 'mon1',
              label: '1월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'mon2',
              field: 'mon2',
              label: '2월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'mon3',
              field: 'mon3',
              label: '3월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'subtotal1',
              field: 'subtotal1',
              label: '소계',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            }
          ]
        },
        {
          name: 'col141',
          field: 'col141',
          label: '2Q',
          child: [
            {
              name: 'mon4',
              field: 'mon4',
              label: '4월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'mon5',
              field: 'mon5',
              label: '5월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'mon6',
              field: 'mon6',
              label: '6월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'subtotal2',
              field: 'subtotal2',
              label: '소계',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            }
          ]
        },
        {
          name: 'col341',
          field: 'col341',
          label: '3Q',
          child: [
            {
              name: 'mon7',
              field: 'mon7',
              label: '7월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'mon8',
              field: 'mon8',
              label: '8월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'mon9',
              field: 'mon9',
              label: '9월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'subtotal3',
              field: 'subtotal3',
              label: '소계',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            }
          ]
        },
        {
          name: 'col441',
          field: 'col441',
          label: '4Q',
          child: [
            {
              name: 'mon10',
              field: 'mon10',
              label: '10월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'mon11',
              field: 'mon11',
              label: '11월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'mon12',
              field: 'mon12',
              label: '12월',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            },
            {
              name: 'subtotal4',
              field: 'subtotal4',
              label: '소계',
              type: 'cost',
              sortable: true,
              style: 'width: 80px'
            }
          ]
        },
        {
          name: 'total',
          field: 'total',
          label: '합계',
          type: 'cost',
          sortable: true,
          style: 'width: 80px'
        }
      ]
    }
  ],
  data: [
    {
      plantName: '사업장1',
      deptName: '설비팀',
      processName: '건조공정',
      activity: '액체연료연소',
      dischargeName: '공정연소시설 #021',
      fuel: 'LNG',
      col8: '보조연료',
      col9: 'km3',
      col10: '2.123',
      tier: '1',
      usage: '231.12',
      tj: '2.122',
      toe: '1.015',
      mco2: '2.1',
      mch4: '2.5',
      mn2o: '3.1',
      col29: '3.4',
      col30: '21',
      col31: '35',
      co2: '1',
      ch4: '21',
      n2o: '310',
      mon1: '5',
      mon2: '2.01',
      mon3: '1.2',
      subtotal1: '8.21',
      mon4: '7',
      mon5: '1.3',
      mon6: '4.27',
      subtotal2: '12.57',
      mon7: '1.2',
      mon8: '3.05',
      mon9: '8',
      subtotal3: '12.25',
      mon10: '3.15',
      mon11: '2.3',
      mon12: '9',
      subtotal4: '14.45',
      total: '47.48'
    },
    {
      plantName: '사업장1',
      deptName: '설비팀',
      processName: '건조공정',
      activity: '액체연료연소',
      dischargeName: '공정연소시설 #045',
      fuel: 'LNG',
      col8: '보조연료',
      col9: 'km3',
      col10: '3.23',
      tier: '2',
      usage: '154.4',
      tj: '3.216',
      toe: '1.02',
      mco2: '5.1',
      mch4: '2.5',
      mn2o: '3.1',
      col29: '3.4',
      col30: '21',
      col31: '35',
      co2: '1',
      ch4: '21',
      n2o: '310',
      mon1: '5',
      mon2: '2.01',
      mon3: '1.2',
      subtotal1: '8.21',
      mon4: '3.01',
      mon5: '2.2',
      mon6: '6',
      subtotal2: '11.21',
      mon7: '2.1',
      mon8: '3.02',
      mon9: '4',
      subtotal3: '9.12',
      mon10: '7',
      mon11: '3.2',
      mon12: '5.05',
      subtotal4: '15.25',
      total: '43.79'
    },
    {
      plantName: '사업장1',
      deptName: '설비팀',
      processName: '건조공정',
      activity: '액체연료연소',
      dischargeName: '공정연소시설 #015',
      fuel: 'LNG',
      col8: '보조연료',
      col9: 'km3',
      col10: '5.91',
      tier: '1',
      usage: '145.12',
      tj: '3.12',
      toe: '2.03',
      mco2: '3.1',
      mch4: '2.5',
      mn2o: '3.1',
      col29: '3.4',
      col30: '21',
      col31: '35',
      co2: '1',
      ch4: '21',
      n2o: '310',
      mon1: '5',
      mon2: '2.1',
      mon3: '1.12',
      subtotal1: '8.22',
      mon4: '7',
      mon5: '1.37',
      mon6: '4.2',
      subtotal2: '12.57',
      mon7: '1.23',
      mon8: '3.02',
      mon9: '8',
      subtotal3: '12.25',
      mon10: '3.1',
      mon11: '2.1',
      mon12: '9',
      subtotal4: '14.2',
      total: '47.54'
    },
    {
      plantName: '사업장1',
      deptName: '설비팀',
      processName: '건조공정',
      activity: '액체연료연소',
      dischargeName: '공정연소시설 #067',
      fuel: 'LNG',
      col8: '보조연료',
      col9: 'km3',
      col10: '6.8',
      tier: '1',
      usage: '141.3',
      tj: '4.124',
      toe: '2.055',
      mco2: '3.1',
      mch4: '2.5',
      mn2o: '3.1',
      col29: '3.4',
      col30: '21',
      col31: '35',
      co2: '1',
      ch4: '21',
      n2o: '310',
      mon1: '5',
      mon2: '2',
      mon3: '1',
      subtotal1: '8',
      mon4: '7',
      mon5: '1.2',
      mon6: '4.37',
      subtotal2: '12.57',
      mon7: '1.15',
      mon8: '3',
      mon9: '7.1',
      subtotal3: '11.25',
      mon10: '3.1',
      mon11: '2.12',
      mon12: '9',
      subtotal4: '14.22',
      total: '46.04'
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
  // list setting
  // getList()
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
  popupOptions.value.title = '온실가스 배출시설 상세'
  popupOptions.value.param = {}
  // popupOptions.value.target = shallowRef(
  //   defineAsyncComponent(() => import(`./baseinfo/dischargeFacDetail.vue`))
  // )
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
