<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            label="대상년월"
            name="targetMonth"
            type="month"
            default="today"
            v-model:value="searchParam.targetMonth"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            :editable="editable"
            codeGroupCd="ENV_GAS_MST_DISCHARGE_CD"
            itemText="codeName"
            itemValue="code"
            label="배출형태"
            name="facilityTypeCd"
            v-model:value="searchParam.facilityTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            label="공장"
            :editable="editable"
            codeGroupCd="ENV_GAS_PLANT_CD"
            itemText="codeName"
            itemValue="code"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            type="search"
            :customPopupParam="{ targetKey: 'ghgFacility' }"
            label="시설"
            :editable="editable"
            name="envGhgFacilityId"
            v-model:value="searchParam.envGhgFacilityId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            type="search"
            :customPopupParam="{ targetKey: 'ghgFacilityEquipment' }"
            label="설비"
            :editable="editable"
            name="envGhgFacilityFuelId"
            v-model:value="searchParam.envGhgFacilityFuelId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="배출량 계산"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:table-chip>
        <span style="color: tomato" class="q-ml-md">
          {{
            $language(
              '※ 각 온실가스의 배출량 계산식 ▶️ [사용량] * [년도별 배출계수(배출 * 산화 * 발열)] / [배출형태]'
            )
          }}
        </span>
      </template>
    </c-table>
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
  name: 'useFuel02'
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
const searchParam = ref({
  plantCd: null,
  rawFuelDivisionCd: null,
  activityCd: null,
  targetMonth: '2025-07',
  facilityTypeCd: null,
  deptCd: null,
  processCd: null,
  envGhgFacilityId: null,
  envGhgFacilityFuelId: null
})
const grid = ref<gridType>({
  columns: [],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const ghgListUrl = ref('')
const ghgMasterItems = ref<any>([])

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
  listUrl.value = selectConfig.env.ghg.calculation.list.url
  ghgListUrl.value = selectConfig.env.ghg.master.list.url
  // code setting
  // list setting
  getGhgMasterItems()
}
function getGhgMasterItems() {
  $http({
    url: ghgListUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    ghgMasterItems.value = _result.data

    grid.value.columns = [
      {
        name: 'target_month',
        field: 'target_month',
        label: '대상년월',
        align: 'center',
        sortable: false,
        style: 'width: 70px'
      },
      // {
      //   required: true,
      //   name: 'rawFuelDivisionCd',
      //   field: 'rawFuelDivisionCd',
      //   label: '구분',
      //   align: 'center',
      //   type: 'select',
      //   style: 'width: 120px',
      //   codeGroupCd: 'ENV_GAS_MST_DIVISION_CD',
      //   sortable: false
      // },
      {
        name: 'facility_type_name',
        field: 'facility_type_name',
        label: '배출형태',
        align: 'center',
        sortable: false,
        style: 'width: 80px'
      },
      {
        name: 'process_name',
        field: 'process_name',
        label: '공장명',
        align: 'center',
        sortable: false,
        style: 'width: 100px'
      },
      {
        name: 'raw_fuel_name',
        field: 'raw_fuel_name',
        label: '배출원(연료)',
        align: 'center',
        style: 'width: 80px',
        sortable: false
      },
      {
        name: 'facility_name',
        field: 'facility_name',
        label: '시설명',
        align: 'left',
        sortable: false,
        style: 'width: 150px'
      },
      {
        name: 'equipment_name',
        field: 'equipment_name',
        label: '설비명',
        align: 'left',
        sortable: false,
        style: 'width: 180px'
      },
      {
        name: 'use_amount',
        field: 'use_amount',
        label: '사용량',
        align: 'right',
        type: 'cost',
        sortable: false,
        style: 'width: 100px'
      }
      // {
      //   name: 'calorificValue',
      //   field: 'calorificValue',
      //   label: '단위',
      //   align: 'center',
      //   sortable: false,
      //   style: 'width: 120px',
      //   type: 'text'
    ]
    const gasColumns: any = []

    _.forEach(ghgMasterItems.value, (_item) => {
      gasColumns.push({
        name: _item.envGhgMstId,
        field: _item.envGhgMstId,
        label: _item.envGhgMstName,
        align: 'right',
        sortable: false,
        style: 'width: 80px',
        type: 'cost'
      })
    })
    gasColumns.push({
      name: 'co2All',
      field: 'co2All',
      label: '최종CO2',
      helpcomment:
        '최종CO2 계산식<br> [CO2 배출량 * CO2 GWP] + [CH4 배출량 * CH4 GWP] + [N20 배출량 * N20 GWP]',
      currentDay: true,
      align: 'right',
      sortable: false,
      style: 'width: 80px',
      type: 'cost'
    })
    grid.value.columns = _.concat(grid.value.columns, gasColumns)

    getList()
  })
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (!searchParam.value.targetMonth) {
    message.alert({
      title: '안내',
      message: '대상년월을 선택하세요.',
      type: 'error'
    })
    return
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data

    _.forEach(grid.value.data, (_item) => {
      getEmissionCalculate(_item)
    })
  })
}

function getEmissionCalculate(_item: any) {
  // 각각 계산식 => [사용량] * [월별 배출계수(배출 * 산화 * 발열)] / [배출형태]
  // 마지막 소수점 두자리 변환

  // CO2
  _item['EGM0000002'] = _.round(
    (_item.use_amount * _item.co2_out * _item.co2_oxi * _item.co2_heat) / Number(_item.co2_div),
    2
  )

  // CH4
  _item['EGM0000003'] = _.round(
    (_item.use_amount * _item.ch4_out * _item.ch4_oxi * _item.ch4_heat) / Number(_item.ch4_div),
    2
  )

  // N20
  _item['EGM0000004'] = _.round(
    (_item.use_amount * _item.n20_out * _item.n20_oxi * _item.n20_heat) / Number(_item.n20_div),
    2
  )

  if (!_item['EGM0000002']) _item['EGM0000002'] = 0
  if (!_item['EGM0000003']) _item['EGM0000003'] = 0
  if (!_item['EGM0000004']) _item['EGM0000004'] = 0

  // co2 최종 -> 각각의 [배출량 * gwp] + [배출량 * gwp] + [배출량 * gwp]
  _item['co2All'] = _.round(
    _item['EGM0000002'] * _item.co2_gwp +
      _item['EGM0000003'] * _item.ch4_gwp +
      _item['EGM0000004'] * _item.n20_gwp,
    1
  )
  if (!_item['co2All']) _item['co2All'] = 0
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
