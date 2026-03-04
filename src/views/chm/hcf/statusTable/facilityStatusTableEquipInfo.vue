<template>
  <div>
    <c-table
      ref="table"
      :title="equipType.name + ' ' + $language('목록')"
      :columns="equipColumns"
      :data="equipData"
      :merge="equipMerge"
      :gridHeight="gridHeight"
      :editable="editable"
      :isExcelDown="false"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <!-- <template slot="table-button">
        <q-btn-group outline >
          <c-btn v-if="editable" label="삭제" icon="remove" @btnClicked="deleteHazardChem" />
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addHazardChem" />
          <c-btn v-if="editable" label="저장" icon="save" @btnClicked="saveHazardChem" />
        </q-btn-group>
      </template> -->
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
import { facilityStatusTableType } from './facilityStatusTable'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'facilityStatusTableEquipInfo'
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
  popupParam: {
    chmFacilityStatusTableId: stringNull
  }
  facilityStatusTable: facilityStatusTableType
  equipType: {
    code: string
    name: string
  }
  contentHeight: string
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  chmFacilityStatusTableId: () => {
    return {
      chmFacilityStatusTableId: ''
    }
  },
  facilityStatusTable: () => {
    return {
      chmFacilityStatusTableId: '', // 취급시설 현황표 일련번호
      facilityStatusTableName: '', // 현황표명
      plantCd: '', // 사업장코드
      year: '',
      permitDate: '', // 허가일
      companyName: '', // 회사명
      managerName: '', // 대표자
      managerEmail: '', // 대표자 E-MAIL
      phoneNo: '', // 전화번호
      bizNo: '', // 사업자번호
      remarks: '', // 비고
      attrVal1: '', // 회사id
      attrVal2: '', // 소재지
      attrVal3: '', // 시설구분
      regDtStr: '',
      regUserName: '',
      managers: [], // 유해화학물질관리자
      facilities: [], // 시설
      hazardChems: [], // 유해화학물질 취급현황
      equipDevices: [], // 설비 장치
      equipPowers: [] // 설비 동력기계
    }
  },
  equipType: () => {
    return {
      code: '',
      name: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height = !Number.isNaN(props.contentHeight) ? Number(props.contentHeight) - 72 : 700
  if (height < 500) {
    height = 500
  }
  return String(height) + 'px'
})
const equipData = computed(() =>
  props.equipType.code === 'device'
    ? props.facilityStatusTable.equipDevices
    : props.facilityStatusTable.equipPowers
)
const equipMerge = computed(() => {
  let _merge: Array<tableMergeType> = []
  if (props.equipType.code === 'device') {
    _merge = [
      { index: 0, colName: 'equipmentNo' },
      { index: 1, colName: 'equipmentNo' },
      { index: 2, colName: 'equipmentNo' }
    ]
  }
  return _merge
})
const equipColumns = computed(() => {
  let _cols
  if (props.equipType.code === 'device') {
    _cols = [
      {
        name: 'equipmentNo',
        field: 'equipmentNo',
        label: '장치번호',
        align: 'center',
        style: 'width:100px',
        sortable: true,
        fix: true
      },
      {
        name: 'deviceName',
        field: 'deviceName',
        label: '장치명',
        align: 'left',
        style: 'width:180px',
        type: 'link',
        sortable: true,
        fix: true
      },
      {
        name: 'chems',
        field: 'chems',
        label: '취급물질(상태)',
        align: 'left',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'devicePartName',
        field: 'devicePartName',
        label: '장치구분',
        align: 'center',
        style: 'width:80px',
        sortable: true
      },
      {
        name: 'conectorStatus',
        field: 'conectorStatus',
        label: '연결구상태',
        align: 'left',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'volume',
        field: 'volume',
        label: '용량',
        align: 'center',
        style: 'width:100px',
        type: 'html',
        sortable: true
      },
      {
        label: '압력(MPa)',
        align: 'center',
        child: [
          {
            name: 'pressOperation',
            field: 'pressOperation',
            label: '운전',
            align: 'center',
            style: 'width:60px',
            sortable: true
          },
          {
            name: 'pressDesign',
            field: 'pressDesign',
            label: '설계',
            align: 'center',
            style: 'width:60px',
            sortable: true
          }
        ]
      },
      {
        label: '온도(℃)',
        align: 'center',
        child: [
          {
            name: 'tempOperation',
            field: 'tempOperation',
            label: '운전',
            align: 'center',
            style: 'width:60px',
            sortable: true
          },
          {
            name: 'tempDesign',
            field: 'tempDesign',
            label: '설계',
            align: 'center',
            style: 'width:60px',
            sortable: true
          }
        ]
      },
      {
        label: '사용재질',
        align: 'center',
        child: [
          {
            name: 'materialMain',
            field: 'materialMain',
            label: '본체',
            align: 'center',
            style: 'width:120px',
            sortable: true
          },
          {
            name: 'materialSubPart',
            field: 'materialSubPart',
            label: '부속품',
            align: 'center',
            style: 'width:120px',
            sortable: true
          },
          {
            name: 'materialGasket',
            field: 'materialGasket',
            label: '개스킷',
            align: 'center',
            style: 'width:120px',
            sortable: true
          }
        ]
      },
      {
        name: 'designStandards',
        field: 'designStandards',
        label: '설계표준',
        align: 'left',
        style: 'width:120px',
        sortable: true
      },
      {
        name: 'afterHeatTreatYn',
        field: 'afterHeatTreatYn',
        label: '후열처리여부',
        align: 'center',
        style: 'width:60px',
        sortable: true
      },
      {
        name: 'nondestructPercent',
        field: 'nondestructPercent',
        label: '비파괴검사율(%)',
        align: 'center',
        style: 'width:60px',
        sortable: true
      }
    ]
  } else {
    _cols = [
      {
        name: 'psiPowerEquipmentNo',
        field: 'psiPowerEquipmentNo',
        label: '동력기계번호',
        align: 'center',
        style: 'width:120px',
        sortable: true
      },
      {
        name: 'powerMachineName',
        field: 'powerMachineName',
        label: '동력기계명',
        align: 'left',
        style: 'width:200px',
        type: 'link',
        sortable: true
      },
      {
        name: 'connect',
        field: 'connect',
        label: '연결설비',
        child: [
          {
            name: 'inFacility',
            field: 'inFacility',
            label: '인입측',
            align: 'center',
            style: 'width:100px',
            sortable: true
          },
          {
            name: 'outFacility',
            field: 'outFacility',
            label: '토출측',
            align: 'center',
            style: 'width:100px',
            sortable: true
          }
        ]
      },
      {
        name: 'chems',
        field: 'chems',
        label: '취급물질',
        align: 'left',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'specInfo',
        field: 'specInfo',
        label: '명세',
        align: 'center',
        style: 'width:250px',
        sortable: true
      },
      {
        name: 'motorVol',
        field: 'motorVol',
        label: '전동기용량(kW)',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'matQuality',
        field: 'matQuality',
        label: '주요재질',
        align: 'center',
        style: 'width:250px',
        sortable: true
      },
      {
        name: 'remarks',
        field: 'remarks',
        label: '비고',
        align: 'left',
        style: 'width:250px',
        sortable: true
      }
    ]
  }
  return _cols
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
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 장치 또는 동력기계 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: any) {
  if (props.equipType.code === 'device') {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/psi/pfi/deviceEquipmentDetail.vue`))
    )
    popupOptions.value.title = '장치 및 설비 상세'
    popupOptions.value.param = {
      psiDeviceEquipmentId: row.psiDeviceEquipmentId
    }
  } else {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/psi/pfi/powerMachineDetail.vue`))
    )
    popupOptions.value.title = '동력기계 상세'
    popupOptions.value.param = {
      psiPowerEquipmentId: row.psiPowerEquipmentId
    }
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 장치 또는 동력기계 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
