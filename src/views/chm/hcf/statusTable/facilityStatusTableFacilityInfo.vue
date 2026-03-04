<template>
  <div>
    <c-table
      ref="table"
      :title="hcfFacilityType.hcfFacilityTypeName + ' ' + $language('시설현황')"
      :columns="facilityColumns"
      :data="facilityData"
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
import { hazardFacilityType } from '../hazardFacility'
import { facilityStatusTableType } from './facilityStatusTable'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'facilityStatusTableFacilityInfo'
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
  hcfFacilityType: {
    hcfFacilityTypeCd: string
    hcfFacilityTypeName: string
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
  hcfFacilityType: () => {
    return {
      hcfFacilityTypeCd: '',
      hcfFacilityTypeName: ''
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
  width: '95%',
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
const facilityData = computed(() => {
  let _data: Array<hazardFacilityType> = []
  if (props.facilityStatusTable.facilities && props.facilityStatusTable.facilities.length > 0) {
    _data = _.filter(props.facilityStatusTable.facilities, {
      hcfFacilityTypeCd: props.hcfFacilityType.hcfFacilityTypeCd
    })
  }
  return _data
})
const facilityColumns = computed(() => {
  let _cols
  if (props.hcfFacilityType.hcfFacilityTypeCd === 'HFT0000001') {
    _cols = [
      {
        name: 'processName',
        field: 'processName',
        label: '단위공정',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'facilityName',
        field: 'facilityName',
        label: '시설명',
        align: 'left',
        style: 'width:100px',
        sortable: true,
        type: 'link'
      },
      {
        name: 'installationPlace',
        field: 'installationPlace',
        label: '설치장소(실내/실외)',
        align: 'left',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'annualHandling',
        field: 'annualHandling',
        label: '연간취급량 (톤/년)<br/>(허가증상)',
        align: 'right',
        style: 'width:100px',
        sortable: true,
        type: 'cost'
      },
      {
        name: 'installationDate',
        field: 'installationDate',
        label: '설치일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'col1',
        field: 'col1',
        label: '최종보수일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'disasterPreventionEquipment',
        field: 'disasterPreventionEquipment',
        label: '방재설비',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'remarks',
        field: 'remarks',
        label: '비고',
        align: 'left',
        style: 'width:200px',
        sortable: true
      }
    ]
  } else if (
    props.hcfFacilityType.hcfFacilityTypeCd === 'HFT0000005' || // 실내 저장
    props.hcfFacilityType.hcfFacilityTypeCd === 'HFT0000015' || // 실외 저장
    props.hcfFacilityType.hcfFacilityTypeCd === 'HFT0000025'
  ) {
    // 지하 저장
    _cols = [
      {
        name: 'processName',
        field: 'processName',
        label: '단위공정',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'facilityName',
        field: 'facilityName',
        label: '시설명',
        align: 'left',
        style: 'width:100px',
        sortable: true,
        type: 'link'
      },
      {
        name: 'installationPlace',
        field: 'installationPlace',
        label: '설치장소(실내/실외)',
        align: 'left',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'annualHandling',
        field: 'annualHandling',
        label: '시설용량(㎥)',
        align: 'right',
        style: 'width:100px',
        sortable: true,
        type: 'cost'
      },
      {
        name: 'installationDate',
        field: 'installationDate',
        label: '설치일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'col1',
        field: 'col1',
        label: '최종보수일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'disasterPreventionEquipment',
        field: 'disasterPreventionEquipment',
        label: '방재설비',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'remarks',
        field: 'remarks',
        label: '비고',
        align: 'left',
        style: 'width:200px',
        sortable: true
      }
    ]
  } else if (
    props.hcfFacilityType.hcfFacilityTypeCd === 'HFT0000010' || // 실내 보관
    props.hcfFacilityType.hcfFacilityTypeCd === 'HFT0000020'
  ) {
    // 실외 보관
    _cols = [
      {
        name: 'processName',
        field: 'processName',
        label: '단위공정',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'facilityName',
        field: 'facilityName',
        label: '시설명',
        align: 'left',
        style: 'width:100px',
        sortable: true,
        type: 'link'
      },
      {
        name: 'installationPlace',
        field: 'installationPlace',
        label: '설치장소(실내/실외)',
        align: 'left',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'annualHandling',
        field: 'annualHandling',
        label: '시설용량(㎥)',
        align: 'right',
        style: 'width:100px',
        sortable: true,
        type: 'cost'
      },
      {
        name: 'installationDate',
        field: 'installationDate',
        label: '설치일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'col1',
        field: 'col1',
        label: '최종보수일',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'disasterPreventionEquipment',
        field: 'disasterPreventionEquipment',
        label: '방재설비',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'remarks',
        field: 'remarks',
        label: '비고',
        align: 'left',
        style: 'width:200px',
        sortable: true
      }
    ]
  } else if (props.hcfFacilityType.hcfFacilityTypeCd === 'HFT0000030') {
    // 차량 운송
    _cols = [
      {
        name: 'facilityName',
        field: 'facilityName',
        label: '차량번호',
        align: 'center',
        style: 'width:100px',
        sortable: true,
        type: 'link'
      },
      {
        name: 'col1',
        field: 'col1',
        label: '운송물질',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'modeOfTransport',
        field: 'modeOfTransport',
        label: '운송방식(탱크로리 등)',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'tankSpecifications',
        field: 'tankSpecifications',
        label: '탱크사양 (재질 및 용량(㎥, ton) 등)',
        align: 'left',
        style: 'width:200px',
        sortable: true
      }
    ]
  } else if (props.hcfFacilityType.hcfFacilityTypeCd === 'HFT0000035') {
    // 차량 운반
    _cols = [
      {
        name: 'facilityName',
        field: 'facilityName',
        label: '차량번호',
        align: 'center',
        style: 'width:100px',
        sortable: true,
        type: 'link'
      },
      {
        name: 'col1',
        field: 'col1',
        label: '운반물질',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'transportMethod',
        field: 'transportMethod',
        label: '운반방식 (화물 등)',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'carryingCapacity',
        field: 'carryingCapacity',
        label: '운반용량(㎥, ton)',
        align: 'left',
        style: 'width:200px',
        sortable: true
      }
    ]
  } else if (props.hcfFacilityType.hcfFacilityTypeCd === 'HFT0000040') {
    // 배관이송
    _cols = [
      {
        name: 'facilityName',
        field: 'facilityName',
        label: '시설명',
        align: 'left',
        style: 'width:100px',
        sortable: true,
        type: 'link'
      },
      {
        name: 'distance',
        field: 'distance',
        label: '거리(km)',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'col1',
        field: 'col1',
        label: '배관내 이송물질',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'pipeMaterial',
        field: 'pipeMaterial',
        label: '배관재질',
        align: 'left',
        style: 'width:200px',
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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function linkClick(row: hazardFacilityType) {
  popupOptions.value.title = '시설 상세'
  popupOptions.value.param = {
    facilityCd: row ? row.facilityCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/chm/hcf/hazardFacilityDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
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
