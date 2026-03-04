<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            required
            label="운전년월"
            name="operationMonth"
            type="month"
            v-model:value="searchParam.operationMonth"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="방지시설"
            name="envWaterMstPreventiveId"
            :customPopupParam="{ targetKey: 'airPreventive' }"
            v-model:value="searchParam.envWaterMstPreventiveId"
          />
        </div> -->
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="폐수 방지시설 운영현황 목록"
      :columns="grid.columns"
      :data="grid.data"
      :usePaging="false"
      :columnSetting="false"
      :filtering="true"
      :isExcelDown="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="IEPS 다운로드"
            icon="download"
            @btnClicked="excelDownLoad"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'iepsWaterPreventiveOperation'
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
  data: Array<any>
  height?: stringNull
}
interface searchParamType {
  plantCd: stringNull
  operationMonth: stringNull
  envAirMstPreventiveId: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  operationMonth: '',
  envAirMstPreventiveId: ''
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  // merge: [{ index: 0, colName: 'operationDate' }],
  columns: [
    {
      name: 'dailyResultDt',
      field: 'dailyResultDt',
      label: '운영일자',
      style: 'width:100px',
      align: 'center',
      sortable: false,
      fix: true
    },
    {
      name: 'child1',
      field: 'child1',
      label: '배출구 정보',
      child: [
        {
          name: 'processNo',
          field: 'processNo',
          label: '공정번호',
          style: 'width:80px',
          align: 'center',
          sortable: false
        },
        {
          name: 'processName',
          field: 'processName',
          label: '공정명',
          style: 'width:150px',
          align: 'center',
          sortable: false
        },
        {
          name: 'outletIepsNo',
          field: 'outletIepsNo',
          label: '방류구번호<br>(방지시설번호)',
          style: 'width:90px',
          align: 'center',
          sortable: false
        },
        {
          name: 'outletIepsPlantMgtNo',
          field: 'outletIepsPlantMgtNo',
          label: '사업장관리번호',
          style: 'width:150px',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      name: 'child2',
      field: 'child2',
      label: '용수 공급원별 사용량(㎥/일)',
      child: [
        {
          name: 'supwaterUsage1',
          field: 'supwaterUsage1',
          label: '상수도',
          style: 'width:55px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'supwaterUsage2',
          field: 'supwaterUsage2',
          label: '공업용수',
          style: 'width:55px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'supwaterUsage3',
          field: 'supwaterUsage3',
          label: '지하수',
          style: 'width:55px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'supwaterUsage4',
          field: 'supwaterUsage4',
          label: '하천수',
          style: 'width:55px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'supwaterUsage5',
          field: 'supwaterUsage5',
          label: '재이용수',
          style: 'width:55px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'supwaterUsage6',
          field: 'supwaterUsage6',
          label: '호수수',
          style: 'width:55px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'supwaterUsage7',
          field: 'supwaterUsage7',
          label: '해수 등<br>기타',
          style: 'width:55px',
          type: 'cost',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      name: 'child3',
      field: 'child3',
      label: '폐수방류시설(㎥/일)',
      child: [
        {
          name: 'diswaterUsage1',
          field: 'diswaterUsage1',
          label: '폐수<br>유입량',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'diswaterUsage2',
          field: 'diswaterUsage2',
          label: '폐수<br>방류량',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'diswaterUsage3',
          field: 'diswaterUsage3',
          label: '냉각수량',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'diswaterUsage4',
          field: 'diswaterUsage4',
          label: '소모<br>(증발량)',
          style: 'width:70px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'diswaterUsage5',
          field: 'diswaterUsage5',
          label: '재사용량',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'diswaterUsage6',
          field: 'diswaterUsage6',
          label: '생활<br>용수량',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      name: 'child4',
      field: 'child4',
      label: '슬러지(지정폐기물 포함) 등 발생량 및 처리량',
      child: [
        {
          name: 'genAmount',
          field: 'genAmount',
          label: '발생량<br>(㎥)',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'proAmount',
          field: 'proAmount',
          label: '처리량<br>(㎥)',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'stoAmount',
          field: 'stoAmount',
          label: '보관량<br>(㎥)',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'stoPercent',
          field: 'stoPercent',
          label: '함수율<br>(%)',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'stoLocation',
          field: 'stoLocation',
          label: '보관장소',
          style: 'width:60px',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      name: 'child5',
      field: 'child5',
      label: '전력 사용량',
      child: [
        {
          name: 'wattmeterNo',
          field: 'wattmeterNo',
          label: '전력계번호',
          style: 'width:60px',
          align: 'center',
          sortable: false
        },
        {
          name: 'powerUsage',
          field: 'powerUsage',
          label: '금일사용량<br>(kWh)',
          style: 'width:60px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'powerIndicator',
          field: 'powerIndicator',
          label: '적산전력계<br>지침',
          style: 'width:100px',
          type: 'cost',
          align: 'center',
          sortable: false
        },
        {
          name: 'readingTime',
          field: 'readingTime',
          label: '검침시간',
          style: 'width:60px',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      name: 'child6',
      field: 'child6',
      label: '약품 사용량',
      child: [
        {
          name: 'subchild1',
          field: 'subchild1',
          label: '약품_1',
          child: [
            {
              name: 'waterDrugTypeCd1',
              field: 'waterDrugTypeCd1',
              label: '구분',
              style: 'width:80px',
              align: 'center',
              sortable: false
            },
            {
              name: 'envWaterMstDrugName1',
              field: 'envWaterMstDrugName1',
              label: '약품명',
              style: 'width:120px',
              align: 'center',
              sortable: false
            },
            {
              name: 'useAmount1',
              field: 'useAmount1',
              label: '투입량(kg/일 또는 L/일)',
              style: 'width:80px',
              align: 'center',
              sortable: false
            }
          ]
        },
        {
          name: 'subchild2',
          field: 'subchild2',
          label: '약품_2',
          child: [
            {
              name: 'waterDrugTypeCd2',
              field: 'waterDrugTypeCd2',
              label: '구분',
              style: 'width:80px',
              align: 'center',
              sortable: false
            },
            {
              name: 'envWaterMstDrugName2',
              field: 'envWaterMstDrugName2',
              label: '약품명',
              style: 'width:120px',
              align: 'center',
              sortable: false
            },
            {
              name: 'useAmount2',
              field: 'useAmount2',
              label: '투입량(kg/일 또는 L/일)',
              style: 'width:80px',
              align: 'center',
              sortable: false
            }
          ]
        },
        {
          name: 'subchild3',
          field: 'subchild3',
          label: '약품_3',
          child: [
            {
              name: 'waterDrugTypeCd3',
              field: 'waterDrugTypeCd3',
              label: '구분',
              style: 'width:80px',
              align: 'center',
              sortable: false
            },
            {
              name: 'envWaterMstDrugName3',
              field: 'envWaterMstDrugName3',
              label: '약품명',
              style: 'width:120px',
              align: 'center',
              sortable: false
            },
            {
              name: 'useAmount3',
              field: 'useAmount3',
              label: '투입량(kg/일 또는 L/일)',
              style: 'width:80px',
              align: 'center',
              sortable: false
            }
          ]
        },
        {
          name: 'subchild4',
          field: 'subchild4',
          label: '약품_4',
          child: [
            {
              name: 'waterDrugTypeCd4',
              field: 'waterDrugTypeCd4',
              label: '구분',
              style: 'width:80px',
              align: 'center',
              sortable: false
            },
            {
              name: 'envWaterMstDrugName4',
              field: 'envWaterMstDrugName4',
              label: '약품명',
              style: 'width:120px',
              align: 'center',
              sortable: false
            },
            {
              name: 'useAmount4',
              field: 'useAmount4',
              label: '투입량(kg/일 또는 L/일)',
              style: 'width:80px',
              align: 'center',
              sortable: false
            }
          ]
        },
        {
          name: 'subchild5',
          field: 'subchild5',
          label: '약품_5',
          child: [
            {
              name: 'waterDrugTypeCd5',
              field: 'waterDrugTypeCd5',
              label: '구분',
              style: 'width:80px',
              align: 'center',
              sortable: false
            },
            {
              name: 'envWaterMstDrugName5',
              field: 'envWaterMstDrugName5',
              label: '약품명',
              style: 'width:120px',
              align: 'center',
              sortable: false
            },
            {
              name: 'useAmount5',
              field: 'useAmount5',
              label: '투입량(kg/일 또는 L/일)',
              style: 'width:80px',
              align: 'center',
              sortable: false
            }
          ]
        }
      ]
    },
    {
      name: 'powerRemark',
      field: 'powerRemark',
      label: '비고',
      align: 'left',
      style: 'width:200px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)

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
  listUrl.value = selectConfig.env.ieps.water.preventive.list.url
  deleteUrl.value = transactionConfig.env.air.sems.preventiveOperation.delete.url
  // code setting
  searchParam.value.operationMonth = getThisMonth()
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
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
function excelDownLoad() {
  $http({
    url: listUrl.value + '/excel',
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = 'IEPS 폐수처리시설(수질방지시설) 운영현황.xlsx'
    link.click()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
