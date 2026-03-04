<template>
  <div>
    <c-tab
      ref="hazopActionTab"
      type="vertical"
      :tabItems="tabItems"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :equipType="tab.equipType"
          :popupParam="popupParam"
          :facilityStatusTable="facilityStatusTable"
          :contentHeight="contentHeight"
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
  name: 'facilityStatusTableEquip'
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
const tab = ref('device')
const tabItems = ref([
  {
    name: 'device',
    label: '장치ㆍ설비<br/>목록 및 명세',
    equipType: { code: 'device', name: '장치ㆍ설비' },
    component: shallowRef(defineAsyncComponent(() => import(`./facilityStatusTableEquipInfo.vue`)))
  },
  {
    name: 'power',
    label: '동력기계<br/>목록 및 명세',
    equipType: { code: 'power', name: '동력기계' },
    component: shallowRef(defineAsyncComponent(() => import(`./facilityStatusTableEquipInfo.vue`)))
  }
])

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  let height = !Number.isNaN(props.contentHeight) ? Number(props.contentHeight) - 30 : 700
  if (height < 500) {
    height = 500
  }
  return String(height) + 'px'
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
