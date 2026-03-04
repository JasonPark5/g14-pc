<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
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
      title="년간 할당량 목록"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="grid.data"
      :columnSetting="false"
      :usePaging="false"
      :customTrClass="setTrClass"
      @table-data-change="tableDataChange"
    >
      <template v-slot:customArea="{ props: bodyProps, col }">
        <template v-if="col.name === 'summary'">
          <!-- <span style="font-style: italic; font-size: 1.1em; transform: skew(-5deg)"> -->
          <span>
            {{ toThousandFilter(bodyProps.row[col.name]) }}
          </span>
        </template>

        <template v-else>
          <template v-if="bodyProps.row['month'] !== '연간 할당량'">
            <c-number-column
              :editable="editable"
              :maxlength="col.maxlength > 0 ? col.maxlength : void 0"
              :col="col"
              :props="bodyProps"
              v-model:value="bodyProps.row[col.name]"
              @datachange="tableDataChange(bodyProps, col)"
            />
          </template>
          <template v-else>
            <!-- <span style="font-style: italic; font-size: 1.1em; transform: skew(-5deg)"> -->
            <span>
              {{ toThousandFilter(bodyProps.row[col.name]) }}
            </span>
          </template>
        </template>
      </template>
      <template v-slot:table-chip>
        <span style="font-size: 0.8em; font-weight: 500; color: tomato; margin-left: 10px">
          {{ '※ 단위는 ton-CO2입니다.' }}
        </span>
      </template>
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data!.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="saveList"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveData"
            @btnCallback="saveCallback"
          />
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
import { getComboItems, toThousandFilter } from '@utils/common'

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
  name: 'emissionsAssign'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()

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
  targetYear: '2025'
})
const grid = ref<gridType>({
  columns: [],
  data: [] as any
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref()
const typeItems = ref<any>([])
const saveList = ref<any>([])

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
  saveUrl.value = transactionConfig.env.ghg.quota.save.url
  listUrl.value = selectConfig.env.ghg.quota.list.url
  // code setting
  getComboItems('ENV_GAS_PLANT_CD').then((_result: any) => {
    typeItems.value = _result
    setHeader()
  })
}
function setHeader() {
  grid.value.columns = [
    // {
    //   name: 'plantName',
    //   field: 'plantName',
    //   label: '사업장',
    //   align: 'center',
    //   sortable: false,
    //   style: 'width: 120px'
    // },
    {
      name: 'targetYear',
      field: 'targetYear',
      label: '대상년도',
      align: 'center',
      sortable: false,
      style: 'width: 60px'
    },
    {
      name: 'month',
      field: 'month',
      label: '구분',
      align: 'center',
      sortable: false,
      style: 'width: 60px'
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
      type: 'custom'
    })
  })
  plantColumns.push({
    name: 'summary',
    field: 'summary',
    label: '합계',
    align: 'right',
    type: 'custom',
    style: 'width: 90px',
    currentDay: true,
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
    const summaryRow: any = {
      month: '연간 할당량',
      monthType: '연간 할당량',
      targetYear: searchParam.value.targetYear,
      summary: 0
    }

    for (const type of typeItems.value) {
      const code = type.code
      let total = 0

      for (let i = 1; i <= 12; i++) {
        total += Number(monthlyMap[i][code]) || 0
      }

      summaryRow[code] = total
      summaryRow[`${code}_envGhgAnnualQuotaId`] = null
      summaryRow[`${code}_editFlag`] = null

      summaryRow.summary += total
      summaryRow.isSummary = true
    }

    grid.value.data = [summaryRow, ...Object.values(monthlyMap)]
  })
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (!searchParam.value.targetYear) {
    message.alert({
      title: '안내',
      message: '대상년도를 선택하세요.',
      type: 'error'
    })
    return
  }
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      confirmCallback: () => {
        const list: any[] = []
        const befSaveList = _.reject(grid.value.data, { month: '연간 할당량' })
        _.forEach(befSaveList, (_item) => {
          const targetMonth = _item.monthType

          _.forEach(typeItems.value, (_type: any) => {
            const processCd = _type.code
            const value = _item[processCd]

            const quotaIdKey = `${processCd}_envGhgAnnualQuotaId`
            const quotaId = _item[quotaIdKey]

            const editFlag = quotaId ? 'U' : 'C'

            // if (value != null && value !== '') {
            list.push({
              envGhgAnnualQuotaId: quotaId || undefined,
              processCd,
              targetYear: searchParam.value.targetYear,
              targetMonth: targetMonth.toString(),
              annualQuotaValue: Number(value),
              editFlag
            })
            // }
          })
        })

        saveList.value = list
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getList()
}

function tableDataChange(_props: any, _col: any) {
  let sum = 0

  for (const type of typeItems.value) {
    const code = type.code
    const value = Number(_props.row[code]) || 0
    sum += value
  }
  _props.row.summary = sum

  let tempSummary: any = 0
  if (grid.value.data && grid.value.data.length > 0) {
    _.forEach(grid.value.data, (_item) => {
      if (_item.monthType !== '연간 할당량') {
        tempSummary += Number(_item[_col.name]) || 0
      }
    })
    grid.value.data[0][_col.name] = tempSummary
  }
}
function setTrClass(_props: any) {
  return _props.row.isSummary ? 'bg-blue-1' : ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
