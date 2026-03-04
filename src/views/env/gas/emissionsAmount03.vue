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
      title="월별 조회"
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
const summaryRow = ref<any>({})
const monthlyMap = ref<Record<number, any>>({})
const typeItems = ref<any>([])

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
  listUrl.value = selectConfig.env.ghg.status.month.list.url
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

    for (let month = 1; month <= 12; month++) {
      monthlyMap.value[month] = {
        month: `${month}월`,
        monthType: month,
        targetYear: searchParam.value.targetYear,
        summary: 0
      }

      for (const type of typeItems.value) {
        const code = type.code
        monthlyMap.value[month][code] = 0
        monthlyMap.value[month][`${code}_envGhgAnnualQuotaId`] = null
        monthlyMap.value[month][`${code}_editFlag`] = 'I'
      }
    }

    for (const item of resultList) {
      const month = parseInt(item.targetMonth, 10)
      const code = item.processCd
      const value = item.annualQuotaValue || 0
      const id = item.envGhgAnnualQuotaId

      if (monthlyMap.value[month]) {
        monthlyMap.value[month][code] = value
        monthlyMap.value[month].summary += value

        if (id) {
          monthlyMap.value[month][`${code}_envGhgAnnualQuotaId`] = id
          monthlyMap.value[month][`${code}_editFlag`] = 'U'
        }
      }
    }

    summaryRow.value.summary = 0
    for (const type of typeItems.value) {
      const code = type.code
      let total = 0
      for (let i = 1; i <= 12; i++) {
        total += Number(monthlyMap.value[i][code]) || 0
      }
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
  const monthColumns: any = []

  for (let i = 1; i <= 12; i++) {
    monthColumns.push({
      name: 'month' + i,
      field: 'month' + i,
      label: i + '월',
      align: 'right',
      sortable: false,
      style: 'width: 100px',
      type: 'cost'
    })
  }
  monthColumns.push({
    name: 'sum_all',
    field: 'sum_all',
    label: '합계',
    align: 'right',
    type: 'cost',
    style: 'width: 100px',
    sortable: false
  })
  grid.value.columns = _.concat(grid.value.columns, monthColumns)

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
      month1: 0,
      month2: 0,
      month3: 0,
      month4: 0,
      month5: 0,
      month6: 0,
      month7: 0,
      month8: 0,
      month9: 0,
      month10: 0,
      month11: 0,
      month12: 0,
      sum_all: 0
    }
    const directSums = {
      month1: 0,
      month2: 0,
      month3: 0,
      month4: 0,
      month5: 0,
      month6: 0,
      month7: 0,
      month8: 0,
      month9: 0,
      month10: 0,
      month11: 0,
      month12: 0,
      sum_all: 0
    }
    const indirectSums = {
      month1: 0,
      month2: 0,
      month3: 0,
      month4: 0,
      month5: 0,
      month6: 0,
      month7: 0,
      month8: 0,
      month9: 0,
      month10: 0,
      month11: 0,
      month12: 0,
      sum_all: 0
    }

    const directList: any[] = []
    const indirectList: any[] = []

    _.forEach(rawData, (_item) => {
      const month1 = Number(_item.month1 || 0)
      const month2 = Number(_item.month2 || 0)
      const month3 = Number(_item.month3 || 0)
      const month4 = Number(_item.month4 || 0)
      const month5 = Number(_item.month5 || 0)
      const month6 = Number(_item.month6 || 0)
      const month7 = Number(_item.month7 || 0)
      const month8 = Number(_item.month8 || 0)
      const month9 = Number(_item.month9 || 0)
      const month10 = Number(_item.month10 || 0)
      const month11 = Number(_item.month11 || 0)
      const month12 = Number(_item.month12 || 0)
      const sum_all = Number(_item.sum_all || 0)

      totalSums.month1 += month1
      totalSums.month2 += month2
      totalSums.month3 += month3
      totalSums.month4 += month4
      totalSums.month5 += month5
      totalSums.month6 += month6
      totalSums.month7 += month7
      totalSums.month8 += month8
      totalSums.month9 += month9
      totalSums.month10 += month10
      totalSums.month11 += month11
      totalSums.month12 += month12
      totalSums.sum_all += sum_all

      if (_item.facility_type_cd === 'EGMD004') {
        _item.up_facility_type_name = '간접배출'
        indirectSums.month1 += month1
        indirectSums.month2 += month2
        indirectSums.month3 += month3
        indirectSums.month4 += month4
        indirectSums.month5 += month5
        indirectSums.month6 += month6
        indirectSums.month7 += month7
        indirectSums.month8 += month8
        indirectSums.month9 += month9
        indirectSums.month10 += month10
        indirectSums.month11 += month11
        indirectSums.month12 += month12
        indirectSums.sum_all += sum_all
        indirectList.push(_item)
      } else {
        _item.up_facility_type_name = '직접배출'
        directSums.month1 += month1
        directSums.month2 += month2
        directSums.month3 += month3
        directSums.month4 += month4
        directSums.month5 += month5
        directSums.month6 += month6
        directSums.month7 += month7
        directSums.month8 += month8
        directSums.month9 += month9
        directSums.month10 += month10
        directSums.month11 += month11
        directSums.month12 += month12
        directSums.sum_all += sum_all
        directList.push(_item)
      }
    })

    // 중간 소계 항목 삽입
    directList.push({
      target_year: searchParam.value.targetYear,
      up_facility_type_name: '직접배출',
      facility_type_name: '소계',
      month1: _.round(directSums.month1, 2),
      month2: _.round(directSums.month2, 2),
      month3: _.round(directSums.month3, 2),
      month4: _.round(directSums.month4, 2),
      month5: _.round(directSums.month5, 2),
      month6: _.round(directSums.month6, 2),
      month7: _.round(directSums.month7, 2),
      month8: _.round(directSums.month8, 2),
      month9: _.round(directSums.month9, 2),
      month10: _.round(directSums.month10, 2),
      month11: _.round(directSums.month11, 2),
      month12: _.round(directSums.month12, 2),
      sum_all: _.round(directSums.sum_all, 2),
      isSummary: true
    })

    indirectList.push({
      target_year: searchParam.value.targetYear,
      up_facility_type_name: '간접배출',
      facility_type_name: '소계',
      month1: _.round(indirectSums.month1, 2),
      month2: _.round(indirectSums.month2, 2),
      month3: _.round(indirectSums.month3, 2),
      month4: _.round(indirectSums.month4, 2),
      month5: _.round(indirectSums.month5, 2),
      month6: _.round(indirectSums.month6, 2),
      month7: _.round(indirectSums.month7, 2),
      month8: _.round(indirectSums.month8, 2),
      month9: _.round(indirectSums.month9, 2),
      month10: _.round(indirectSums.month10, 2),
      month11: _.round(indirectSums.month11, 2),
      month12: _.round(indirectSums.month12, 2),
      sum_all: _.round(indirectSums.sum_all, 2),
      isSummary: true
    })

    // 전체 합계
    const finalList = [...directList, ...indirectList]
    finalList.push({
      target_year: searchParam.value.targetYear,
      facility_type_name: '총계',
      month1: _.round(totalSums.month1, 2),
      month2: _.round(totalSums.month2, 2),
      month3: _.round(totalSums.month3, 2),
      month4: _.round(totalSums.month4, 2),
      month5: _.round(totalSums.month5, 2),
      month6: _.round(totalSums.month6, 2),
      month7: _.round(totalSums.month7, 2),
      month8: _.round(totalSums.month8, 2),
      month9: _.round(totalSums.month9, 2),
      month10: _.round(totalSums.month10, 2),
      month11: _.round(totalSums.month11, 2),
      month12: _.round(totalSums.month12, 2),
      sum_all: _.round(totalSums.sum_all, 2),
      isMainSummary: true
    })

    // 적용
    grid.value.data = finalList
    grid.value.data.push({
      target_year: searchParam.value.targetYear,
      up_facility_type_name: '-',
      facility_type_name: '할당량',
      month1: monthlyMap.value[1].summary,
      month2: monthlyMap.value[2].summary,
      month3: monthlyMap.value[3].summary,
      month4: monthlyMap.value[4].summary,
      month5: monthlyMap.value[5].summary,
      month6: monthlyMap.value[6].summary,
      month7: monthlyMap.value[7].summary,
      month8: monthlyMap.value[8].summary,
      month9: monthlyMap.value[9].summary,
      month10: monthlyMap.value[10].summary,
      month11: monthlyMap.value[11].summary,
      month12: monthlyMap.value[12].summary,
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
