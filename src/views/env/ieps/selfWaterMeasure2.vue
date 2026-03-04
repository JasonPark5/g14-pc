<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="자가측정 기간"
            defaultStart="-12M"
            defaultEnd="0M"
            name="period"
            v-model:value="period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :customPopupParam="{ targetKey: 'waterOutlet' }"
            label="수질 배출구"
            name="envWaterMstOutletId"
            v-model:value="searchParam.envWaterMstOutletId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="IEPS 수질 자가측정 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data!.length > 0"
            label="IEPS 다운로드"
            icon="download"
            @btnClicked="downLoadSems"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'exceedFlag'">
          <span
            v-if="
              props.row.legalStandard > 0 &&
              props.row.outflowCon !== 'ND' &&
              Number(props.row.outflowCon) > props.row.legalStandard
            "
            style="color: tomato"
          >
            {{ $language('초과') }}</span
          >
          <span v-else-if="props.row.outflowCon && props.row.legalStandard" class="text-grey-5">{{
            $language('이하')
          }}</span>
        </template>
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
  name: 'selfWaterMeasure2'
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
  startYmd: '',
  endYmd: '',
  plantCd: null,
  envWaterMstOutletId: null
})
const grid = ref<gridType>({
  columns: [
    {
      label: '측정정보',
      child: [
        {
          name: 'measureDt',
          field: 'measureDt',
          label: '측정일시',
          align: 'center',
          style: 'width: 120px',
          fix: true
        },
        {
          name: 'outletIepsNo',
          field: 'outletIepsNo',
          label: 'IEPS배출구번호',
          align: 'center',
          style: 'width: 100px',
          sortable: false,
          fix: true
        },
        {
          name: 'outletIepsPlantMgtNo',
          field: 'outletIepsPlantMgtNo',
          label: '사업장관리번호',
          align: 'center',
          style: 'width: 100px',
          sortable: false,
          fix: true
        }
      ]
    },
    {
      label: '측정항목',
      child: [
        {
          name: 'inspectItemIepsCd',
          field: 'inspectItemIepsCd',
          label: 'IEPS오염물질코드',
          align: 'center',
          style: 'width: 110px',
          sortable: false
        },
        {
          name: 'envWaterMstInspectItemName',
          field: 'envWaterMstInspectItemName',
          label: '오염물질명',
          align: 'left',
          style: 'width: 220px',
          sortable: false,
          currentDay: true
        },
        {
          name: 'inflowExemptionName',
          field: 'inflowExemptionName',
          label: '유입수측정 면제구분',
          align: 'center',
          style: 'width: 120px',
          sortable: false
        },
        {
          name: 'inflowNo',
          field: 'inflowNo',
          label: '유입시설번호',
          align: 'center',
          style: 'width: 80px',
          sortable: false
        },
        {
          name: 'inflowCon',
          field: 'inflowCon',
          label: '유입수 농도(mg/l)',
          align: 'center',
          style: 'width: 110px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'outflowCon',
          field: 'outflowCon',
          label: '방류수 농도(mg/l)',
          align: 'center',
          style: 'width: 120px',
          type: 'cost',
          sortable: false,
          currentDay: true
        },
        {
          name: 'outflowValue',
          field: 'outflowValue',
          label: '방류량(㎥/일)',
          align: 'center',
          style: 'width: 80px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'legalStandard',
          field: 'legalStandard',
          label: '허가배출기준',
          align: 'center',
          style: 'width: 80px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'waterInspectUnitName',
          field: 'waterInspectUnitName',
          label: '단위',
          align: 'center',
          style: 'width: 60px',
          sortable: false
        },
        {
          name: 'exceedFlag',
          field: 'exceedFlag',
          label: '초과여부',
          align: 'center',
          style: 'width: 60px',
          type: 'custom',
          sortable: false
        },
        {
          name: 'method',
          field: 'method',
          label: '검사방법(기기명)',
          align: 'left',
          style: 'width: 300px',
          sortable: false
        }
      ]
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width: 100px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const period = ref([])

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
  listUrl.value = selectConfig.env.ieps.water.self.measure.sublist.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 엑셀 다운로드
 *******************************/
function downLoadSems() {
  $http({
    url: listUrl.value + '/excel',
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = 'IEPS 수질 자가측정.xlsx'
    link.click()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
