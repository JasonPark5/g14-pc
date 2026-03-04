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
      title="배출형태별 조회"
      :columns="grid.columns"
      :merge="grid.merge"
      :data="grid.data"
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
  name: 'emissionsAmount01'
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
  listUrl.value = selectConfig.env.ghg.status.type.list.url
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
      },
      {
        name: 'sum_ratio',
        field: 'sum_ratio',
        label: '비율',
        align: 'center',
        sortable: false,
        style: 'width: 60px'
      },
      {
        name: 'sum_all',
        field: 'sum_all',
        label: '총배출량',
        align: 'right',
        type: 'cost',
        sortable: false,
        style: 'width: 80px'
      }
    ]
    const gasColumns: any = []

    _.forEach(ghgMasterItems.value, (_item) => {
      gasColumns.push({
        name: _item.envGhgMstName.toLowerCase() + '_sum',
        field: _item.envGhgMstName + '_sum',
        label: _item.envGhgMstName,
        align: 'right',
        sortable: false,
        style: 'width: 80px',
        type: 'cost'
      })
    })
    grid.value.columns = _.concat(grid.value.columns, gasColumns)

    getList()
  })
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
      co2_sum: 0,
      ch4_sum: 0,
      n20_sum: 0,
      sum_all: 0,
      sum_ratio: 0
    }
    const directSums = {
      co2_sum: 0,
      ch4_sum: 0,
      n20_sum: 0,
      sum_all: 0,
      sum_ratio: 0
    }
    const indirectSums = {
      co2_sum: 0,
      ch4_sum: 0,
      n20_sum: 0,
      sum_all: 0,
      sum_ratio: 0
    }

    const directList: any[] = []
    const indirectList: any[] = []

    _.forEach(rawData, (_item) => {
      const co2 = _item.co2_sum || 0
      const ch4 = _item.ch4_sum || 0
      const n20 = _item.n20_sum || 0
      const sum = _item.sum_all || 0
      const ratio = _item.sum_ratio || 0

      totalSums.co2_sum += co2
      totalSums.ch4_sum += ch4
      totalSums.n20_sum += n20
      totalSums.sum_all += sum
      totalSums.sum_ratio += ratio

      if (_item.facility_type_cd === 'EGMD004') {
        _item.up_facility_type_name = '간접배출'
        indirectSums.co2_sum += co2
        indirectSums.ch4_sum += ch4
        indirectSums.n20_sum += n20
        indirectSums.sum_all += sum
        indirectSums.sum_ratio += ratio
        indirectList.push(_item)
      } else {
        _item.up_facility_type_name = '직접배출'
        directSums.co2_sum += co2
        directSums.ch4_sum += ch4
        directSums.n20_sum += n20
        directSums.sum_all += sum
        directSums.sum_ratio += ratio
        directList.push(_item)
      }
    })

    // 중간 소계 항목 삽입
    directList.push({
      target_year: searchParam.value.targetYear,
      up_facility_type_name: '직접배출',
      facility_type_name: '소계',
      co2_sum: _.round(directSums.co2_sum, 2),
      ch4_sum: _.round(directSums.ch4_sum, 2),
      n20_sum: _.round(directSums.n20_sum, 2),
      sum_all: _.round(directSums.sum_all, 2),
      sum_ratio: directSums.sum_ratio,
      isSummary: true
    })

    indirectList.push({
      target_year: searchParam.value.targetYear,
      up_facility_type_name: '간접배출',
      facility_type_name: '소계',
      co2_sum: _.round(indirectSums.co2_sum, 2),
      ch4_sum: _.round(indirectSums.ch4_sum, 2),
      n20_sum: _.round(indirectSums.n20_sum, 2),
      sum_all: _.round(indirectSums.sum_all, 2),
      sum_ratio: indirectSums.sum_ratio,
      isSummary: true
    })

    // 전체 합계
    const finalList = [...directList, ...indirectList]
    finalList.push({
      target_year: searchParam.value.targetYear,
      facility_type_name: '총계',
      co2_sum: _.round(totalSums.co2_sum, 2),
      ch4_sum: _.round(totalSums.ch4_sum, 2),
      n20_sum: _.round(totalSums.n20_sum, 2),
      sum_all: _.round(totalSums.sum_all, 2),
      sum_ratio: _.round(totalSums.sum_ratio, 2),
      isMainSummary: true
    })

    // 적용
    grid.value.data = finalList
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
