<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            label="측정년월"
            name="measureDate"
            type="month"
            default="today"
            v-model:value="searchParam.measureDate"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="그 외 항목 자가측정"
      tableId="grid"
      :columns="grid.columns"
      :data="grid.data"
      :usePaging="true"
      :columnSetting="true"
      :filtering="true"
      :isExcelDown="false"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="IEPS 다운로드"
            icon="download"
            @btnClicked="downLoadSems"
          />
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
          <!-- <c-btn
            v-if="editable && grid.data.length > 0"
            label="삭제"
            icon="delete_forever"
            @btnClicked="deleteFuelUsage"
          /> -->
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
  name: 'soilPollutionMeasureResult'
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
  isFull: true,
  width: '',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  measureDate: ''
})

// 테이블 형태로 보여줄 데이터
const grid = ref<gridType>({
  columns: [
    {
      name: 'bno',
      field: 'bno',
      label: '일련번호',
      align: 'center',
      type: 'link',
      fix: true,
      style: 'width:60px',
      sortable: false
    },
    {
      label: '복합악취',
      child: [
        {
          name: 'envOdorMeasureDt',
          field: 'envOdorMeasureDt',
          label: '측정일시',
          datetimeType: 'datetime',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envOdorLocationName',
          field: 'envOdorLocationName',
          label: '측정지점',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envOdorResult',
          field: 'envOdorResult',
          label: '측정결과(배)',
          align: 'right',
          style: 'width:80px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'envOdorResultEmissionStandard',
          field: 'envOdorResultEmissionStandard',
          label: '허가배출기준',
          align: 'right',
          style: 'width:80px',
          type: 'cost',
          sortable: false
        }
      ]
    },
    {
      label: '지정악취',
      child: [
        {
          name: 'envOdorPollutantMeasureDt',
          field: 'envOdorPollutantMeasureDt',
          label: '측정일시',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envOdorPollutantLocation',
          field: 'envOdorPollutantLocation',
          label: '측정지점',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envOdorPollutantMstNo',
          field: 'envOdorPollutantMstNo',
          label: '측정물질코드',
          align: 'center',
          style: 'width:80px',
          sortable: false
        },
        {
          name: 'envOdorPollutantMstId',
          field: 'envOdorPollutantMstId',
          label: '측정물질명',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envOdorPollutantConcentration',
          field: 'envOdorPollutantConcentration',
          label: '측정물질 농도(ppm)',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'envOdorEmissionStandard',
          field: 'envOdorEmissionStandard',
          label: '허가배출기준',
          style: 'width:80px',
          sortable: false
        }
      ]
    },
    {
      label: '소음진동',
      child: [
        {
          name: 'envNoiseMeasureDt',
          field: 'envNoiseMeasureDt',
          label: '측정일시',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envNoiseLocationName',
          field: 'envNoiseLocationName',
          label: '측정지점',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envNoiseDeviceName',
          field: 'envNoiseDeviceName',
          label: '측정기기',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envNoiseTimeSlotName',
          field: 'envNoiseTimeSlotName',
          label: '측정시간대',
          align: 'center',
          style: 'width:70px',
          sortable: false
        },
        {
          name: 'envNoiseVibration',
          field: 'envNoiseVibration',
          label: '측정진동(dB(V))',
          align: 'right',
          style: 'width:70px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'envNoiseBackground',
          field: 'envNoiseBackground',
          label: '배경소음(dB(A))',
          align: 'right',
          style: 'width:70px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'envNoiseMeasured',
          field: 'envNoiseMeasured',
          label: '측정소음(dB(A))',
          align: 'right',
          style: 'width:70px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'envNoiseStandard',
          field: 'envNoiseStandard',
          label: '허용기준',
          align: 'right',
          style: 'width:70px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'envNoiseComplianceYnName',
          field: 'envNoiseComplianceYnName',
          label: '기준준수여부 (Y/N)',
          align: 'center',
          style: 'width:120px',
          sortable: false
        }
      ]
    },
    {
      label: '특정토양오염',
      child: [
        {
          name: 'envSoilMeasureDt',
          field: 'envSoilMeasureDt',
          label: '측정일시',
          style: 'width:120px',
          align: 'center',
          sortable: false
        },
        {
          name: 'envSoilMeasureLocationName',
          field: 'envSoilMeasureLocationName',
          label: '측정지점',
          style: 'width:120px',
          align: 'center',
          sortable: false
        },
        {
          name: 'envSoilPollutantMstNo',
          field: 'envSoilPollutantMstNo',
          label: '측정물질코드',
          style: 'width:80px',
          align: 'center',
          sortable: false
        },

        {
          name: 'envSoilPollutantMstName',
          field: 'envSoilPollutantMstName',
          label: '측정물질명',
          style: 'width:120px',
          align: 'center',
          sortable: false
        },

        {
          name: 'envSoilPollutantConcentration',
          field: 'envSoilPollutantConcentration',
          label: '측정물질농도 (mg/kg)',
          align: 'right',
          style: 'width:90px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'soilPollutantUnitName',
          field: 'soilPollutantUnitName',
          label: '단위',
          style: 'width:50px',
          align: 'center',
          sortable: false
        },
        {
          name: 'envSoilEmissionStandard',
          field: 'envSoilEmissionStandard',
          label: '허가배출기준',
          style: 'width:80px',
          type: 'cost',
          align: 'right',
          sortable: false
        }
      ]
    },
    {
      label: '비점오염',
      child: [
        {
          name: 'envNonpointMeasureDt',
          field: 'envNonpointMeasureDt',
          label: '측정일시',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envNonpointLocation',
          field: 'envNonpointLocation',
          label: '측정지점',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envNonpointPollutantMstNo',
          field: 'envNonpointPollutantMstNo',
          label: '측정물질코드',
          align: 'center',
          style: 'width:80px',
          sortable: false
        },
        {
          name: 'envNonpointPollutantMstId',
          field: 'envNonpointPollutantMstId',
          label: '측정물질명',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envNonpointConcentration',
          field: 'envNonpointConcentration',
          label: '측정물질 농도',
          align: 'center',
          style: 'width:80px',
          sortable: false
        },
        {
          name: 'envNonpointEmissionStandard',
          field: 'envNonpointEmissionStandard',
          label: '허가배출기준',
          align: 'center',
          style: 'width:80px',
          sortable: false
        }
      ]
    },
    {
      label: '기타',
      child: [
        {
          name: 'envEtcMeasureDt',
          field: 'envEtcMeasureDt',
          label: '측정일시',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envEtcMediumTypeName',
          field: 'envEtcMediumTypeName',
          label: '매체구분',
          align: 'center',
          style: 'width:70px',
          sortable: false
        },
        {
          name: 'envEtcLocationName',
          field: 'envEtcLocationName',
          label: '측정지점',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envEtcPollutantName',
          field: 'envEtcPollutantName',
          label: '측정물질명',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'envEtcEmissionOrFlowRate',
          field: 'envEtcEmissionOrFlowRate',
          label: '배출가스량(S㎥/min) 또는 유량(㎥/일)',
          align: 'right',
          style: 'width:120px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'envEtcConcentration',
          field: 'envEtcConcentration',
          label: '측정물질 농도',
          align: 'right',
          style: 'width:80px',
          type: 'cost',
          sortable: false
        },
        {
          name: 'envEtcEmissionStandard',
          field: 'envEtcEmissionStandard',
          label: '허가배출기준',
          align: 'right',
          type: 'cost',
          style: 'width:80px',
          sortable: false
        }
      ]
    },
    {
      name: 'envNote',
      field: 'envNote',
      label: '비고',
      align: 'left',
      style: 'width:300px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const table = ref<any>(null)
const listUrl = ref('')

const deleteUrl = ref('')

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
// 백엔드 연동하면 추가하기
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)

  // url setting
  // 1. 목록 조회
  listUrl.value = selectConfig.env.soil.list.url
  // 4. 삭제 API
  deleteUrl.value = transactionConfig.env.soil.deletes.url

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
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '그 외 항목 자가측정 상세'
  popupOptions.value.param = {
    envSoilPollutantMeasureResultId: row ? row.envSoilPollutantMeasureResultId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./soilPollutionMeasureResultDetail.vue`))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '90%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 엑셀
 *******************************/
function downLoadSems() {
  $http({
    url: listUrl.value + '/excel',
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = 'IEPS 그 외 항목자가측정기록부.xlsx'
    link.click()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

// 수정 1
