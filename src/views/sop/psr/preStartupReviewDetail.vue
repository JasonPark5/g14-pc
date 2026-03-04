<template>
  <div>
    <c-tab
      type="horizon"
      :dense="true"
      :inlineLabel="true"
      :tabItems="tabItems"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :param="popupParam"
          :preStartupCheck="preStartupCheck"
          :imprTabInfo="imprTabInfo"
          :research="research"
          :contentHeight="contentHeight"
          @closePopup="closePopup"
          @setRegInfo="setRegInfo"
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
import { preStartupCheckType } from './preStartupReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'preStartupReviewDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopPrestartupCheckId: stringNull
    psrCheckStatusCd: stringNull
    isSearch: boolean
  }
  contentHeight: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      sopPrestartupCheckId: '',
      psrCheckStatusCd: '',
      isSearch: false
    }
  },
  contentHeight: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const tab = ref('base')
const preStartupCheck = ref<preStartupCheckType>({
  sopPrestartupCheckId: '', // 가동전점검 일련 번호
  plantCd: null, // 사업장코드
  checkName: '', // 점검명
  prestartupPeriod: [], // 기간
  prestartupStartDate: '', // 계획 시작일
  prestartupEndDate: '', // 계획 종료일
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
})
const research = ref<any>({
  impr: '',
  item: ''
})

const tabItems = ref([
  {
    name: 'base',
    icon: 'foundation',
    label: '가동전 점검 계획/결과 정보',
    component: shallowRef(defineAsyncComponent(() => import(`./preStartupTab.vue`)))
  },
  {
    name: 'traningScenario',
    icon: 'account_tree',
    label: '설비 Punch list',
    component: shallowRef(defineAsyncComponent(() => import(`@views/common/ibm/imprTab.vue`)))
  }
])
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) && props.contentHeight > 400 ? props.contentHeight + 'px' : '800px'
)
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.sopPrestartupCheckId, //
    ibmTaskTypeCd: 'ITT0000030',
    ibmTaskUnderTypeCd: 'ITTU000045',
    requestContents: preStartupCheck.value.checkName,
    disabled: preStartupCheck.value.psrCheckStatusCd === 'PCSC000005',
    isOld: Boolean(props.popupParam.sopPrestartupCheckId),
    gridItem: {
      listUrl: selectConfig.sop.psr.checkItemImprove.list.url,
      param: {
        sopPrestartupCheckId: props.popupParam.sopPrestartupCheckId
      },
      title: $language('점검결과별 개선사항 목록'),
      merge: [
        { index: 0, colName: 'equipmentName' },
        { index: 1, colName: 'mergeCheck1' },
        { index: 2, colName: 'mergeCheck1' }
      ],
      columns: [
        {
          name: 'equipmentName',
          field: 'equipmentName',
          label: '설비',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'psrCheckTypeName',
          field: 'psrCheckTypeName',
          label: '점검유형',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'psrCheckPeriodName',
          field: 'psrCheckPeriodName',
          label: '점검시기',
          align: 'center',
          style: 'width:80px',
          sortable: false
        },
        {
          name: 'level',
          field: 'level',
          label: '점검항목 (대분류/중분류/소분류)',
          align: 'left',
          style: 'width:400px',
          sortable: false
        },
        {
          name: 'judgmentResultFlagName',
          field: 'judgmentResultFlagName',
          label: '적합여부',
          align: 'center',
          style: 'width:45px',
          sortable: false
        },
        {
          name: 'checkResult',
          field: 'checkResult',
          label: '점검결과',
          align: 'left',
          style: 'width:120px',
          sortable: false
        }
      ],
      research: research.value
    },
    gridOther: {
      title: $language('항목외 개선 목록')
    }
  }
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
  // url setting
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 창닫기
 *******************************/
function closePopup() {
  emits('closePopup')
}
/******************************
 * TODO (목적): 등록/수정자
 *******************************/
function setRegInfo(_data: any) {
  emits('setRegInfo', _data)
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
