<template>
  <c-tab
    type="horizon"
    :dense="true"
    :tabItems="tabItems"
    :inlineLabel="true"
    :height="tabHeight"
    v-model:value="tab"
  >
    <template v-slot:default="tab">
      <component
        :is="tab.component"
        :popupParam="popupParam"
        :equipData="equipData"
        :isOld="isOld"
        :contentHeight="contentHeight"
        @getDetail="getDetail"
        @closePopup="closePopup"
      />
    </template>
  </c-tab>
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
import { equipPopupParamType, equipType } from './equipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: equipPopupParamType
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
  popupParam: () => {
    return {
      equipmentCd: '',
      plantCd: '',
      psmFlag: ''
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
const tab = ref('equipmentInfo')
const equipData = ref<equipType>({
  plantCd: null, // 사업장코드
  plantName: '', // 사업장
  equipmentTypeCd: null, // 설비유형 코드
  equipmentTypeName: '', // 설비유형명
  equipmentCd: '', // 설비코드
  equipmentNo: '', // 설비코드
  equipmentName: '', // 설비명
  mainProcessCd: '', // 주공정
  subProcessCd: '', // 부공정
  managementDepts: '', // 관리부서
  equipmentLocation: '', // 설비위치
  installDate: '', // 설치일자
  installVendor: '', // 설치업체
  opertationDate: '', // 가동일자
  checkPassNo: '', // 검사합격번호
  checkPassDate: '', // 합격일자
  discardFlag: 'N',
  discardDate: '', // 폐기일자
  psmFlag: 'N', // PSM 대상 여부
  psmTypeCd: null,
  amount: '', // 수량
  lawEquipmentFlag: 'N', // 법정설비 여부
  inspectionCycleCd: null, // 법정점검 주기
  selfCycleCd: null, // 자체점검 주기
  pmCycleCd: null, // 자체점검 주기
  pmFlag: 'N', // 예방정비 여부
  cmFlag: 'N', // 고장정비 여부
  predictiveFlag: 'N', // 예지정비 여부
  operFlag: 'N', // 운전정비 여부
  relatedLaws: '', // 관련법규
  recentInspectionDate: '', // 최근 점검일자
  outsourcingVendor: '', // 유지보수업체
  hazardousFlag: 'N',
  equipGradeCd: null,
  regUserId: '',
  chgUserId: '',
  checks: [],
  maintenances: [],
  specs: [],
  ranks: [],
  materials: [],
  mocs: [],
  licenses: [],
  processCds: []
})
const editable = ref(true)
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.equipmentCd))
const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 400
    ? props.contentHeight + 'px'
    : '800px'
)
const tabItems = computed(() => {
  let _items: Array<tabItemsType> = [
    {
      name: 'equipmentInfo',
      icon: 'info',
      label: '설비 기본정보',
      component: defineAsyncComponent(() => import(`@views/mdm/fim/equipmentInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items = _.concat(_items, [
      {
        name: 'equipmentInspect',
        icon: 'construction',
        label: '점검/정비이력',
        component: defineAsyncComponent(() => import(`@views/mdm/fim/equipmentInspect.vue`))
      },
      {
        name: 'equipmentSpec',
        icon: 'account_tree',
        label: '설비 사양',
        component: defineAsyncComponent(() => import(`@views/mdm/fim/equipmentSpec.vue`))
      },
      {
        name: 'equipmentEtc',
        icon: 'note_alt',
        label: '관련정보',
        component: defineAsyncComponent(() => import(`@views/mdm/fim/equipmentEtc.vue`))
      }
    ])
    if (props.popupParam.psmFlag == 'Y') {
      _items.splice(3, 0, {
        name: 'equipmentPsm',
        icon: 'warning_amber',
        label: 'PSM 정보',
        component: defineAsyncComponent(() => import(`@views/mdm/fim/equipmentPsm.vue`))
      })
    }
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
  detailUrl.value = selectConfig.mdm.equipment.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 설비 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.equipmentCd) {
    $http({
      url: $format(detailUrl.value, props.popupParam.equipmentCd),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(equipData.value, _result.data)
      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
    })
  }
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
