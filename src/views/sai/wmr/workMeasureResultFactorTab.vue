<template>
  <div>
    <c-table
      ref="table"
      :title="title + ' 관련 유해인자별 결과 목록'"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :gridHeight="gridHeight"
      :columnSetting="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'exposureFlag'">
          <span
            v-if="props.row[col.name]"
            :class="props.row[col.name] === '초과' ? 'text-red' : 'text-green'"
            >{{ props.row[col.name] }}</span
          >
          <template v-else>
            <span
              v-if="
                parseFloat(props.row.measValue) >= 0 &&
                parseFloat(props.row.exposureStandard) > 0 &&
                parseFloat(props.row.measValue) > parseFloat(props.row.exposureStandard)
              "
              class="text-red"
              >{{ $language('초과') }}</span
            >
            <span
              v-else-if="
                (parseFloat(props.row.measValue) >= 0 &&
                  parseFloat(props.row.exposureStandard) > 0 &&
                  parseFloat(props.row.measValue) <= parseFloat(props.row.exposureStandard)) ||
                props.row.measValue === '불검출' ||
                props.row.measValue === '검출한계'
              "
              class="text-green"
            >
              {{ $language('미만') }}</span
            >
          </template>
        </template>
        <template v-else-if="col.name === 'measValue'">
          <span>{{ props.row[col.name] }}</span>
          <span
            v-if="
              props.row.measRecent && parseInt(props.row.measRecent) > parseInt(props.row.measValue)
            "
            class="text-red q-ml-xs"
          >
            {{ '(+ ' + (parseInt(props.row.measRecent) - parseInt(props.row.measValue)) + ')' }}
          </span>
          <span
            v-else-if="
              props.row.measRecent && parseInt(props.row.measRecent) < parseInt(props.row.measValue)
            "
            class="text-green q-ml-xs"
          >
            {{ '(- ' + (parseInt(props.row.measValue) - parseInt(props.row.measRecent)) + ')' }}
          </span>
          <span
            v-else-if="
              props.row.measRecent &&
              parseInt(props.row.measRecent) === parseInt(props.row.measValue)
            "
            class="text-orange q-ml-xs"
          >
            (동일)
          </span>
        </template>
      </template>
    </c-table>
  </div>
  <c-dialog :param="popupOptions" />
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
  name: 'workMeasureResultFactorTab'
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
interface propType {
  searchParam: {
    measQuarter: stringNull
    measYear: stringNull
    startYmd: stringNull
    endYmd: stringNull
    exposureFlag: stringNull
    workAreaGradeCd: stringNull
    hazardNames: stringNull
    year: Array<string>
  }
  title: stringNull
  workAreaGradeCd: stringNull
  unit: stringNull
  height?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
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
const props = withDefaults(defineProps<propType>(), {
  searchParam: () => {
    return {
      measQuarter: null,
      measYear: '',
      startYmd: '',
      endYmd: '',
      exposureFlag: null,
      workAreaGradeCd: '',
      hazardNames: '',
      year: ['', '']
    }
  },
  title: '',
  workAreaGradeCd: '',
  unit: '',
  height: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'hazardCd' }],
  columns: [
    {
      name: 'hazardCd',
      field: 'hazardCd',
      label: '유해인자',
      align: 'center',
      style: 'width:120px',
      sortable: false,
      fix: true
    },
    {
      name: 'measYear',
      field: 'measYear',
      label: '측정년도',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'measQuarterName',
      field: 'measQuarterName',
      label: '상/하반기',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'processCd',
      field: 'processCd',
      label: '단위사업체명',
      align: 'center',
      style: 'width:90px',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서및업체',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'workPlace',
      field: 'workPlace',
      label: '단위작업장소',
      align: 'left',
      style: 'width:180px',
      sortable: false
    },
    {
      name: 'workCount',
      field: 'workCount',
      label: '근로자수',
      align: 'center',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'shiftType',
      field: 'shiftType',
      label: '근로형태 및 시간',
      align: 'left',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'occurTime',
      field: 'occurTime',
      label: '발생시간(분)',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'measPositionName',
      field: 'measPositionName',
      label: '측정위치(근로자명)',
      align: 'left',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'measStartTime',
      field: 'measStartTime',
      label: '측정시간',
      align: 'center',
      style: 'width:110px',
      sortable: false
    },
    {
      name: 'measCount',
      field: 'measCount',
      label: '측정횟수',
      align: 'center',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'measValue',
      field: 'measValue',
      label: '측정치 [' + props.unit + ']<br/>(전회대비)',
      align: 'center',
      style: 'width:100px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'exposureStandard',
      field: 'exposureStandard',
      label: '노출기준 [' + props.unit + ']',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'exposureFlag',
      field: 'exposureFlag',
      label: '기준초과여부',
      align: 'center',
      style: 'width:80px',
      type: 'custom',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.height && !Number.isNaN(Number(props.height.replace('px', '')))
      ? Number(props.height.replace('px', '')) - 20
      : 200
  if (height < 200) height = 200
  return height + 'px'
})

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
  listUrl.value = selectConfig.sai.workmeas.result.factor.url
  // code setting
  props.searchParam.workAreaGradeCd = props.workAreaGradeCd
  if (props.searchParam.year && props.searchParam.year.length === 2) {
    ;[props.searchParam.startYmd, props.searchParam.endYmd] = props.searchParam.year
  }
  // list setting
  if (props.workAreaGradeCd === '1') {
    grid.value.columns.splice(6, 0, {
      name: 'workContents',
      field: 'workContents',
      label: '작업내용',
      align: 'left',
      style: 'width:220px',
      sortable: false
    })
  }
  getList()
}

/******************************
 * TODO (목적): 작업환경측정결과 분야별 상세조회
 *******************************/
function getList() {
  const params = {
    ...props.searchParam,
    workAreaGradeCd: props.workAreaGradeCd
  }
  if (params.year && params.year.length === 2) [params.startYmd, params.endYmd] = params.year
  $http({
    url: listUrl.value,
    method: 'GET',
    params: params
  }).then((_result: any) => {
    grid.value.data = _result.data
    _.forEach(grid.value.data, (item) => {
      if (item.measStartTime && typeof item.measStartTime === 'string') {
        item.measStartTime = item.measStartTime.replace(',', ' ~ ')
      }
    })
  })
}
</script>
