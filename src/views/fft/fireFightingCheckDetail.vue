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
          :popupParam="popupParam"
          :check="check"
          :select="select"
          :isOld="isOld"
          :disabled="disabled"
          :contentHeight="contentHeight"
          :imprTabInfo="imprTabInfo"
          @getDetail="getDetail"
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
import { checkType } from './fireFighting'

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
  name: 'fireFightingCheckDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  contentHeight?: stringNull
  popupParam: {
    sopFireFightingCheckId?: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  popupParam: () => {
    return {
      sopFireFightingCheckId: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const tab = ref('info')
const editable = ref(true)
const detailUrl = ref('')
const check = ref<checkType>({
  sopFireFightingCheckId: '', // 소방설비 점검 일련번호
  plantCd: '', // 사업장
  sopFireFightingCheckTypeCd: null, // 점검유형
  checkName: '', // 점검명
  sopFireFightingCheckStepCd: '', // 점검진행상태
  checkStartDate: '', // 점검시작일
  checkEndDate: '', // 점검종료일
  period: [],
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  targets: [],
  deleteTargets: [],
  imprs: []
})
const select = ref({
  sopFireFightingId: '',
  sopFireFightingKindCd: '',
  fireFightingName: '',
  editFlag: '',
  results: []
})

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.sopFireFightingCheckId))
const disabled = computed(() => check.value.sopFireFightingCheckStepCd === 'FFC0000005')
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 6 + 'px' : '530px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'info',
      label: '점검상세',
      component: defineAsyncComponent(() => import(`./fireFightingCheckInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items.push({
      name: 'impr',
      icon: 'construction',
      label: '개선관리',
      component: defineAsyncComponent(() => import(`@/views/common/ibm/imprTab.vue`))
    })
  }
  return _items
})
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.sopFireFightingCheckId,
    ibmTaskTypeCd: 'ITT0000180',
    ibmTaskUnderTypeCd: 'ITTU000205',
    requestContents: check.value.checkName,
    disabled: disabled.value,
    isOld: true,
    isTable: true,
    gridItem: {
      listUrl: '',
      param: null,
      title: '점검항목별 개선목록',
      merge: [
        { index: 0, colName: 'sopFireFightingKindName' },
        { index: 1, colName: 'sopFireFightingCheckTargetResultId' },
        { index: 2, colName: 'sopFireFightingCheckTargetResultId' },
        { index: 3, colName: 'sopFireFightingCheckTargetResultId' }
      ],
      data: check.value.imprs,
      columns: [
        {
          name: 'sopFireFightingKindName',
          field: 'sopFireFightingKindName',
          label: '소방설비',
          align: 'center',
          style: 'width: 150px',
          sortable: false
        },
        {
          name: 'itemName',
          field: 'itemName',
          label: '점검항목',
          align: 'left',
          style: 'width: 400px',
          sortable: false
        },
        {
          name: 'sopFireFightingCheckResultName',
          field: 'sopFireFightingCheckResultName',
          label: '점검결과',
          align: 'center',
          style: 'width: 100px',
          sortable: false
        },
        {
          name: 'remark',
          field: 'remark',
          label: '비고',
          align: 'center',
          style: 'width: 150px',
          sortable: false
        }
      ],
      research: {}
    },
    gridOther: {
      title: '항목외 개선 목록'
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  detailUrl.value = selectConfig.fft.fireFightingCheck.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopFireFightingCheckId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(check.value, _result.data)
      check.value.period = [check.value.checkStartDate, check.value.checkEndDate]
      if (check.value.targets!.length > 0 && !select.value.sopFireFightingId) {
        select.value = {
          sopFireFightingId: check.value.targets![0].sopFireFightingId,
          sopFireFightingKindCd: check.value.targets![0].sopFireFightingKindCd,
          fireFightingName: check.value.targets![0].fireFightingName,
          editFlag: '',
          results: check.value.targets![0].results
        }
      }
    })
  } else check.value.sopFireFightingCheckStepCd = 'FFC0000001'
}
/******************************
 * TODO (목적): emit
 *******************************/
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
