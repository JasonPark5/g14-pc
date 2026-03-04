<template>
  <div>
    <c-tab
      type="tabcard"
      align="left"
      :height="contentHeight - 118 + 'px'"
      :editable="editInfo"
      :tabItems="preStartupCheck.equipments"
      :inlineLabel="true"
      :addTab="editInfo && !disabled"
      :removeTab="editInfo && !disabled"
      removeConditionCol="checkCompleteFlag"
      removeConditionVal="Y"
      v-model:value="tabs"
      @addTab="addTab"
      @removeTab="removeTab"
      @tabClick="tabClick"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :param="param"
          :preStartupCheck="preStartupCheck"
          :equipmentCd="tab.equipmentCd"
          :contentHeight="contentHeight"
          :research="research"
        />
      </template>
    </c-tab>
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
import { preStartupCheckType } from './preStartupReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'preStartupReviewCheckList'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
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
interface propType {
  param: {
    sopPrestartupCheckId: stringNull
    psrCheckStatusCd: stringNull
    isSearch: boolean
  }
  preStartupCheck: preStartupCheckType
  equipTab: stringNull | undefined
  editInfo: boolean
  research: {
    impr: stringNull
    item: stringNull
  }
  disabled: boolean
  contentHeight: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      sopPrestartupCheckId: '',
      psrCheckStatusCd: '',
      isSearch: false
    }
  },
  research: () => {
    return {
      impr: '',
      item: ''
    }
  },
  preStartupCheck: () => {
    return {
      sopPrestartupCheckId: '', // 가동전점검 일련 번호
      plantCd: null, // 사업장코드
      checkName: '', // 점검명
      checkPurpose: '', // 점검 목적
      psrEquipmentStatusCd: null, // 설비 상태
      checkDeptCd: null, // 점검부서
      sopMocId: '', // MOC 일련번호
      checkCancarrierId: '', // 점검 책임자
      checkResultTotal: '', // 점검결과 종합
      psrCheckStatusCd: '', // 진행 단계
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      equipments: [],
      deleteEquipments: []
    }
  },
  equipTab: '',
  editInfo: false,
  disabled: false,
  contentHeight: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const tabs = ref('')
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const deleteEquipUrl = ref('')

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
  tabs.value = props.equipTab
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
  deleteEquipUrl.value = transactionConfig.sop.psr.check.equipment.delete.url
  // code setting
  // list setting
}
function addTab() {
  popupOptions.value.width = '50%'
  popupOptions.value.isFull = false
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeFacilityPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeFacilityPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    data = _.orderBy(data, 'equipmentCd', 'asc')
    if (!props.preStartupCheck.equipments || props.preStartupCheck.equipments.length === 0) {
      tabs.value = data[0].equipmentCd
    }
    if (!props.preStartupCheck.equipments) props.preStartupCheck.equipments = []
    _.forEach(data, (item) => {
      if (_.findIndex(props.preStartupCheck.equipments, { name: item.equipmentCd }) === -1) {
        props.preStartupCheck.equipments!.push({
          name: item.equipmentCd,
          label: item.equipmentName,
          icon: 'precision_manufacturing',
          component: shallowRef(defineAsyncComponent(() => import(`./preStartupFacility.vue`))),
          sopPrestartupCheckId: '', // 가동전점검 일련 번호
          equipmentCd: item.equipmentCd, // 설비코드
          equipmentName: item.equipmentName, // 설비명
          equipmentTypeCd: item.equipmentTypeCd, // 설비 분류(상하위구조)
          equipmentTypeName: item.equipmentTypeName, // 설비 분류명(상하위구조)
          checkUserId: '', // 점검 책임자
          checkScheduleDate: '', // 점검 예정일
          checkDate: '', // 점검일
          checkResultTotal: '', // 점검 결과 종합
          checkCompleteFlag: 'N', // 점검 완료 여부
          regUserId: '', // 등록자 ID
          chgUserId: '', // 수정자 ID
          checkTypes: [], // 점검유형
          checkItems: [], // 점검항목
          deleteCheckItems: [],
          editFlag: 'C'
        })
      }
    })
  }
}
function removeTab(_tab: any) {
  message.confirm({
    title: '확인',
    message:
      '삭제하실 경우 해당 공정에 해당하는 점검정보 및 결과목록도 변경됩니다. 진행하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      if (!props.preStartupCheck.deleteEquipments) {
        props.preStartupCheck.deleteEquipments = []
      }
      if (
        _.findIndex(props.preStartupCheck.deleteEquipments, _tab) === -1 &&
        _tab.editFlag !== 'C'
      ) {
        props.preStartupCheck.deleteEquipments.push(_tab)
      }
      $http({
        url: deleteEquipUrl.value,
        method: 'DELETE',
        data: Object.values(props.preStartupCheck.deleteEquipments)
      }).then((_result: any) => {
        message.requestSuccess()
        props.preStartupCheck.equipments!.splice(
          _.findIndex(props.preStartupCheck.equipments, _tab),
          1
        )
        if (props.preStartupCheck.equipments && props.preStartupCheck.equipments.length > 0) {
          tabs.value = props.preStartupCheck.equipments[0].name
        }
        props.preStartupCheck.deleteEquipments = []
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function tabClick(_tab: any) {
  tabs.value = _tab.name
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
