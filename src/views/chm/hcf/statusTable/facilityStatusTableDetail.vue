<template>
  <div>
    <c-tab
      type="horizon"
      :tabItems="tabItems"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :facilityStatusTable="facilityStatusTable"
          :hcfFacilityTypeItems="hcfFacilityTypeItems"
          :contentHeight="contentHeight"
          @getDetail="getDetail"
          @plantChange="plantChange"
          @closePopup="closePopup"
        />
      </template>
    </c-tab>
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
  name: 'facilityStatusTableDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

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
const tab = ref('base')
const facilityStatusTable = ref<facilityStatusTableType>({
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
})
const hcfFacilityTypeItems = ref<Array<codeMasterType>>([])
const detailUrl = ref('')
const baseUrl = ref('')
const managerListUrl = ref('')
const facilityListUrl = ref('')
const powerMachineListUrl = ref('')
const deviceListUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  let height = !Number.isNaN(props.contentHeight) ? Number(props.contentHeight) : 600
  if (height < 500) {
    height = 500
  }
  return String(height)
})
const tabItems = computed(() => {
  let _items: Array<tabItemsType> = [
    {
      name: 'base',
      icon: 'info',
      label: '기본정보',
      component: defineAsyncComponent(() => import(`./facilityStatusTableBaseInfo.vue`))
    }
  ]
  if (props.popupParam.chmFacilityStatusTableId) {
    _items = _.concat(_items, [
      {
        name: 'hazardChem',
        icon: 'science',
        label: '유해화학물질',
        component: defineAsyncComponent(() => import(`./facilityStatusTableHazardChem.vue`))
      },
      {
        name: 'facility',
        icon: 'home_filled',
        label: '시설',
        component: defineAsyncComponent(() => import(`./facilityStatusTableFacility.vue`))
      }
      // {
      //   name: 'equip',
      //   icon: 'precision_manufacturing',
      //   label: '설비',
      //   component: defineAsyncComponent(() => import(`./facilityStatusTableEquip.vue`))
      // }
    ])
  }
  return _items
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
  detailUrl.value = selectConfig.chm.facilityStatusTable.get.url
  baseUrl.value = selectConfig.chm.facilityStatusTable.base.url
  managerListUrl.value = selectConfig.mdm.senior.status.list.url
  facilityListUrl.value = selectConfig.env.facility.list.url
  powerMachineListUrl.value = selectConfig.psi.pfi.power.list.url
  deviceListUrl.value = selectConfig.psi.pfi.device.list.url
  // code setting
  getComboItems('HCF_FACILITY_TYPE_CD').then((_result) => {
    hcfFacilityTypeItems.value = _result
  })
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 시설현황표 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.chmFacilityStatusTableId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.chmFacilityStatusTableId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(facilityStatusTable.value, _result.data)
      getSubInfo()
    })
  } else {
    getBase(true)
  }
}
/******************************
 * TODO (목적): 사업장 변경에 따른 정보 조회
 *******************************/
function plantChange() {
  getBase(false)
  getSubInfo()
}
/******************************
 * TODO (목적): 시설 기본 정보 조회
 * @param (1): 처음 조회 여부
 *******************************/
function getBase(flag: boolean) {
  const _plantCd = flag ? user.value.plantCd : facilityStatusTable.value.plantCd
  if (_plantCd) {
    $http({
      url: baseUrl.value,
      method: 'GET',
      params: {
        plantCd: _plantCd
      }
    }).then((_result: any) => {
      _.extend(facilityStatusTable.value, _result.data)
    })
  }
}
/******************************
 * TODO (목적): 시설 관련 정보 조회
 *******************************/
function getSubInfo() {
  if (facilityStatusTable.value.plantCd && props.popupParam.chmFacilityStatusTableId) {
    // 유해화학물질 관리자
    getSenior()
    // 시설
    getFacility()
    // 설비 동력기계
    getPowerMachine()
    // 설비 장치기계
    getDevice()
  }
}
/******************************
 * TODO (목적): 유해화학물질 관리자 조회
 *******************************/
function getSenior() {
  $http({
    url: managerListUrl.value,
    method: 'GET',
    params: {
      plantCd: facilityStatusTable.value.plantCd
    }
  }).then((_result: any) => {
    facilityStatusTable.value.managers = _.filter(_result.data, { seniorId: 'MSI0000007' })
  })
}
/******************************
 * TODO (목적): 시설 조회
 *******************************/
function getFacility() {
  $http({
    url: facilityListUrl.value,
    method: 'GET',
    params: {
      plantCd: facilityStatusTable.value.plantCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    facilityStatusTable.value.facilities = _result.data
  })
}
/******************************
 * TODO (목적): 설비 동력기계 조회
 *******************************/
function getPowerMachine() {
  $http({
    url: powerMachineListUrl.value,
    method: 'GET',
    params: {
      plantCd: facilityStatusTable.value.plantCd
    }
  }).then((_result: any) => {
    facilityStatusTable.value.equipPowers = _result.data
  })
}
/******************************
 * TODO (목적): 설비 장치기계 조회
 *******************************/
function getDevice() {
  $http({
    url: deviceListUrl.value,
    method: 'GET',
    params: {
      plantCd: facilityStatusTable.value.plantCd
    }
  }).then((_result: any) => {
    facilityStatusTable.value.equipDevices = _result.data
  })
}
/******************************
 * TODO (목적): 팝업 닫기
 *******************************/
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
