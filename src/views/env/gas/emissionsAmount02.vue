<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            label="대상년도"
            name="targetYear"
            type="year"
            default="today"
            v-model:value="searchParam.targetYear"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="공장별 조회"
      :columns="grid.columns"
      :merge="grid.merge"
      :data="grid.data"
      class="status"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :customTrClass="setTrClass"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
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
  name: 'emissionsAmount02'
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
  targetYear: '2025',
  facilityTypeCd: null,
  deptCd: null,
  processCd: null,
  envGhgFacilityId: null,
  envGhgFacilityFuelId: null
})
const grid = ref<gridType>({
  merge: [{ index: 1, colName: 'up_facility_type_name' }],
  columns: [],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const ghgListUrl = ref('')
const assignListUrl = ref('')
const typeItems = ref<any>([])
const summaryRow = ref<any>(null)

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
  listUrl.value = selectConfig.env.ghg.status.plant.list.url
  ghgListUrl.value = selectConfig.env.ghg.master.list.url
  assignListUrl.value = selectConfig.env.ghg.quota.list.url
  // code setting
  getComboItems('ENV_GAS_PLANT_CD').then((_result: any) => {
    typeItems.value = _result
    getAssignList()
  })
  // list setting
}
function getAssignList() {
  if (!searchParam.value.targetYear) {
    message.alert({
      title: '안내',
      message: '대상년도를 선택하세요.',
      type: 'error'
    })
    return
  }

  $http({
    url: assignListUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((res: any) => {
    const resultList = res.data
    const monthlyMap: Record<number, any> = {}

    for (let month = 1; month <= 12; month++) {
      monthlyMap[month] = {
        month: `${month}월`,
        monthType: month,
        targetYear: searchParam.value.targetYear,
        summary: 0
      }

      for (const type of typeItems.value) {
        const code = type.code
        monthlyMap[month][code] = 0
        monthlyMap[month][`${code}_envGhgAnnualQuotaId`] = null
        monthlyMap[month][`${code}_editFlag`] = 'I'
      }
    }

    for (const item of resultList) {
      const month = parseInt(item.targetMonth, 10)
      const code = item.processCd
      const value = item.annualQuotaValue || 0
      const id = item.envGhgAnnualQuotaId

      if (monthlyMap[month]) {
        monthlyMap[month][code] = value
        monthlyMap[month].summary += value

        if (id) {
          monthlyMap[month][`${code}_envGhgAnnualQuotaId`] = id
          monthlyMap[month][`${code}_editFlag`] = 'U'
        }
      }
    }
    summaryRow.value = {
      month: '합계',
      monthType: '합계',
      targetYear: searchParam.value.targetYear,
      summary: 0
    }

    for (const type of typeItems.value) {
      const code = type.code
      let total = 0

      for (let i = 1; i <= 12; i++) {
        total += Number(monthlyMap[i][code]) || 0
      }

      summaryRow.value[code] = total
      summaryRow.value[`${code}_envGhgAnnualQuotaId`] = null
      summaryRow.value[`${code}_editFlag`] = null

      summaryRow.value.summary += total
    }
    setHeader()
  })
}
function setHeader() {
  grid.value.columns = [
    {
      name: 'target_year',
      field: 'target_year',
      label: '대상년도',
      align: 'center',
      sortable: false,
      style: 'width: 70px'
    },
    {
      name: 'type',
      field: 'type',
      label: '구분',
      child: [
        {
          name: 'up_facility_type_name',
          field: 'up_facility_type_name',
          label: '상위구분',
          align: 'center',
          sortable: false,
          style: 'width: 80px'
        },
        {
          name: 'facility_type_name',
          field: 'facility_type_name',
          label: '배출형태',
          align: 'center',
          sortable: false,
          style: 'width: 80px'
        }
      ]
    }
  ]
  const plantColumns: any = []

  _.forEach(typeItems.value, (_type) => {
    plantColumns.push({
      name: _type.code,
      field: _type.code,
      label: _type.codeName,
      align: 'right',
      sortable: false,
      style: 'width: 100px',
      type: 'cost'
    })
  })
  plantColumns.push({
    name: 'sum_all',
    field: 'sum_all',
    label: '합계',
    align: 'right',
    type: 'cost',
    style: 'width: 100px',
    sortable: false
  })
  grid.value.columns = _.concat(grid.value.columns, plantColumns)

  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (!searchParam.value.targetYear) {
    message.alert({
      title: '안내',
      message: '대상년도를 선택하세요.',
      type: 'error'
    })
    return
  }

  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const rawData = _result.data

    const totalSums = {
      EGP0000001: 0,
      EGP0000005: 0,
      EGP0000010: 0,
      EGP0000015: 0,
      EGP0000020: 0,
      EGP0000025: 0,
      sum_all: 0
    }
    const directSums = {
      EGP0000001: 0,
      EGP0000005: 0,
      EGP0000010: 0,
      EGP0000015: 0,
      EGP0000020: 0,
      EGP0000025: 0,
      sum_all: 0
    }
    const indirectSums = {
      EGP0000001: 0,
      EGP0000005: 0,
      EGP0000010: 0,
      EGP0000015: 0,
      EGP0000020: 0,
      EGP0000025: 0,
      sum_all: 0
    }

    const directList: any[] = []
    const indirectList: any[] = []

    _.forEach(rawData, (_item) => {
      const EGP0000001 = _item.EGP0000001 || 0
      const EGP0000005 = _item.EGP0000005 || 0
      const EGP0000010 = _item.EGP0000010 || 0
      const EGP0000015 = _item.EGP0000015 || 0
      const EGP0000020 = _item.EGP0000020 || 0
      const EGP0000025 = _item.EGP0000025 || 0
      const sum_all = _item.sum_all || 0

      totalSums.EGP0000001 += EGP0000001
      totalSums.EGP0000005 += EGP0000005
      totalSums.EGP0000010 += EGP0000010
      totalSums.EGP0000015 += EGP0000015
      totalSums.EGP0000020 += EGP0000020
      totalSums.EGP0000025 += EGP0000025
      totalSums.sum_all += sum_all

      if (_item.facility_type_cd === 'EGMD004') {
        _item.up_facility_type_name = '간접배출'
        indirectSums.EGP0000001 += EGP0000001
        indirectSums.EGP0000005 += EGP0000005
        indirectSums.EGP0000010 += EGP0000010
        indirectSums.EGP0000015 += EGP0000015
        indirectSums.EGP0000020 += EGP0000020
        indirectSums.EGP0000025 += EGP0000025
        indirectSums.sum_all += sum_all
        indirectList.push(_item)
      } else {
        _item.up_facility_type_name = '직접배출'
        directSums.EGP0000001 += EGP0000001
        directSums.EGP0000005 += EGP0000005
        directSums.EGP0000010 += EGP0000010
        directSums.EGP0000015 += EGP0000015
        directSums.EGP0000020 += EGP0000020
        directSums.EGP0000025 += EGP0000025
        directSums.sum_all += sum_all
        directList.push(_item)
      }
    })

    // 중간 소계 항목 삽입
    directList.push({
      target_year: searchParam.value.targetYear,
      up_facility_type_name: '직접배출',
      facility_type_name: '소계',
      EGP0000001: _.round(directSums.EGP0000001, 2),
      EGP0000005: _.round(directSums.EGP0000005, 2),
      EGP0000010: _.round(directSums.EGP0000010, 2),
      EGP0000015: _.round(directSums.EGP0000015, 2),
      EGP0000020: _.round(directSums.EGP0000020, 2),
      EGP0000025: _.round(directSums.EGP0000025, 2),
      sum_all: _.round(directSums.sum_all, 2),
      isSummary: true
    })

    indirectList.push({
      target_year: searchParam.value.targetYear,
      up_facility_type_name: '간접배출',
      facility_type_name: '소계',
      EGP0000001: _.round(indirectSums.EGP0000001, 2),
      EGP0000005: _.round(indirectSums.EGP0000005, 2),
      EGP0000010: _.round(indirectSums.EGP0000010, 2),
      EGP0000015: _.round(indirectSums.EGP0000015, 2),
      EGP0000020: _.round(indirectSums.EGP0000020, 2),
      EGP0000025: _.round(indirectSums.EGP0000025, 2),
      sum_all: _.round(indirectSums.sum_all, 2),
      isSummary: true
    })

    // 전체 합계
    const finalList = [...directList, ...indirectList]
    finalList.push({
      target_year: searchParam.value.targetYear,
      facility_type_name: '총계',
      EGP0000001: _.round(totalSums.EGP0000001, 2),
      EGP0000005: _.round(totalSums.EGP0000005, 2),
      EGP0000010: _.round(totalSums.EGP0000010, 2),
      EGP0000015: _.round(totalSums.EGP0000015, 2),
      EGP0000020: _.round(totalSums.EGP0000020, 2),
      EGP0000025: _.round(totalSums.EGP0000025, 2),
      sum_all: _.round(totalSums.sum_all, 2),
      isMainSummary: true
    })

    // 적용
    grid.value.data = finalList

    grid.value.data.push({
      target_year: searchParam.value.targetYear,
      up_facility_type_name: '-',
      facility_type_name: '할당량',
      EGP0000001: summaryRow.value.EGP0000001,
      EGP0000005: summaryRow.value.EGP0000005,
      EGP0000010: summaryRow.value.EGP0000010,
      EGP0000015: summaryRow.value.EGP0000015,
      EGP0000020: summaryRow.value.EGP0000020,
      EGP0000025: summaryRow.value.EGP0000025,
      sum_all: summaryRow.value.summary,
      isSummary: true
    })
  })
}
function setTrClass(_props: any) {
  return _props.row.isSummary
    ? 'bg-blue-1 text-bold'
    : _props.row.isMainSummary
      ? 'bg-orange-1 text-bold'
      : ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
