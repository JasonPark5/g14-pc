<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table5"
        title="방지시설 약품사용량"
        :columns="grid.columns"
        :gridHeight="gridHeight"
        :data="dailyReportData.drugUsages"
        :usePaging="false"
        :columnSetting="false"
        :filtering="false"
        :editable="editable && !param.isFullScreen"
      >
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'usageVolume1'">
            <c-number-column
              name="usageVolume2"
              :editable="editable"
              :disabled="props.row.drugName1 === '' || props.row.drugName1 === null"
              :col="col"
              :props="props"
              v-model:value="props.row[col.name]"
              @datachange="datachange(props)"
            />
          </template>
          <template v-if="col.name === 'drugName2'">
            <c-select
              class="no-label-control"
              name="drugName2"
              :editable="editable"
              :disabled="props.row.drugName1 === '' || props.row.drugName1 === null"
              type="edit"
              :comboItems="drugItems"
              itemText="codeName"
              itemValue="code"
              :col="col"
              :props="props"
              v-model:value="props.row[col.name]"
              @datachange="datachange(props)"
            />
          </template>
          <template v-if="col.name === 'usageVolume2'">
            <c-number-column
              name="usageVolume2"
              :editable="editable"
              :disabled="props.row.drugName2 === '' || props.row.drugName2 === null"
              :col="col"
              :props="props"
              v-model:value="props.row[col.name]"
              @datachange="datachange(props)"
            />
          </template>
          <template v-if="col.name === 'drugName3'">
            <c-select
              class="no-label-control"
              name="drugName3"
              :editable="editable"
              :disabled="props.row.drugName2 === '' || props.row.drugName2 === null"
              type="edit"
              :comboItems="drugItems"
              itemText="codeName"
              itemValue="code"
              :col="col"
              :props="props"
              v-model:value="props.row[col.name]"
              @datachange="datachange(props)"
            />
          </template>
          <template v-if="col.name === 'usageVolume3'">
            <c-number-column
              name="usageVolume2"
              :editable="editable"
              :disabled="props.row.drugName3 === '' || props.row.drugName3 === null"
              :col="col"
              :props="props"
              v-model:value="props.row[col.name]"
              @datachange="datachange(props)"
            />
          </template>
        </template>
      </c-table>
    </div>
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
  name: 'dailyAirReport06'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const userStroe = useUserStore()
// const { user } = storeToRefs(userStroe)
// const message = useMessageStore()

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
interface propType {
  param: {
    plantCd?: stringNull
    envAirDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
  }
  disFlag?: boolean
  dailyReportData?: any
  contentHeight?: stringNull
}
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
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      plantCd: null,
      envAirDailyResultId: '',
      isFullScreen: false,
      dailyResultDt: ''
    }
  },
  disFlag: false,
  dailyReportData: null,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const drugItems = ref<any>([])
const grid = ref<gridType>({
  columns: [
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설',
      style: 'width:110px',
      align: 'left',
      sortable: false
    },
    {
      name: 'pressureDiff',
      field: 'pressureDiff',
      label: '입출구압력차(△P)',
      style: 'width:60px',
      align: 'center',
      type: 'number',
      disableTarget: 'pressureDiffFlag',
      disableCon: 'Y',
      sortable: false
    },
    {
      name: 'pressureDiffUnitCd',
      field: 'pressureDiffUnitCd',
      label: '압력차단위',
      style: 'width:60px',
      align: 'center',
      type: 'select',
      disableTarget: 'pressureDiffFlag',
      disableCon: 'Y',
      codeGroupCd: 'IEPS_PRESSURE_UNIT_CD',
      sortable: false
    },
    {
      name: 'pressureDiffUnitName',
      field: 'pressureDiffUnitName',
      label: '압력차단위(직접입력)',
      style: 'width:60px',
      align: 'center',
      type: 'text',
      disableTarget: 'pressureDiffUnitCd',
      disableCon: '9',
      sortable: false
    },
    {
      name: 'temperature',
      field: 'temperature',
      label: '온도',
      style: 'width:60px',
      align: 'center',
      type: 'number',
      disableTarget: 'temperatureFlag',
      disableCon: 'Y',
      sortable: false
    },
    {
      name: 'ph',
      field: 'ph',
      label: 'PH',
      style: 'width:60px',
      align: 'center',
      type: 'text',
      disableTarget: 'phFlag',
      disableCon: 'Y',
      sortable: false
    },
    {
      name: 'drugName1',
      field: 'drugName1',
      label: '사용약품명-1',
      style: 'width:60px',
      type: 'select',
      comboItems: drugItems.value,
      align: 'center',
      sortable: false
    },
    {
      name: 'usageVolume1',
      field: 'usageVolume1',
      label: '사용약품량-1<br/>(kg or L)',
      type: 'custom',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugName2',
      field: 'drugName2',
      label: '사용약품명-2',
      type: 'custom',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'usageVolume2',
      field: 'usageVolume2',
      label: '사용약품량-2<br/>(kg or L)',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'drugName3',
      field: 'drugName3',
      label: '사용약품명-3',
      type: 'custom',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'usageVolume3',
      field: 'usageVolume3',
      label: '사용약품량-3<br/>(kg or L)',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false
    }
  ],
  data: [],
  height: '560px'
})
const drugListUrl = ref('')
const table5 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const editable = computed(() => {
  if (props.disFlag) return false
  else return Boolean(route.meta.editable)
})
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 170 + 'px' : '560px'
)

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
  // url setting
  drugListUrl.value = selectConfig.env.air.mst.drug.list.url
  // code setting
  // list setting
  // getList()
  getDrugList()
}

/******************************
 * TODO (목적): 약품 목록 조회
 *******************************/
function getDrugList() {
  $http({
    url: drugListUrl.value,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    _.forEach(_result.data, (item) => {
      drugItems.value.push({
        code: item.envAirMstDrugId,
        codeName: item.envAirMstDrugName
      })
    })
  })
}

/******************************
 * TODO (목적): 테이블 셀 값 변경시 로직
 *******************************/
function datachange(_props: any) {
  _props.row.editFlag = 'U'
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
