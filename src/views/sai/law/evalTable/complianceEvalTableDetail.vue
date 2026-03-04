<template>
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
        :evalTable="evalTable"
        :imprTabInfo="imprTabInfo"
        :isOld="isOld"
        :disabled="disabled"
        :inputEditable="inputEditable"
        :inputEditable2="inputEditable2"
        :research="research"
        :contentHeight="contentHeight"
        @closePopup="closePopup"
        @getDetail="getDetail"
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
import {
  complianceEvalTablePopupType,
  complianceEvalTableResearchType,
  complianceEvalTableType
} from './complianceEvalTable'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'complianceEvalTableDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: complianceEvalTablePopupType
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
  popupParam: () => {
    return {
      saiComplianceEvalTableId: '',
      lawRegisterItemTypeCd: ''
    }
  },
  contentHeight: null
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
const evalTable = ref<complianceEvalTableType>({
  saiComplianceEvalTableId: '', // 법규등록부 및 준수평가표 일련번호
  requirementName: '', // 법규/기타 요건명
  complianceEvalTypeCd: null, // 평가구분
  lawRegisterItemTypeCd: null, // 환경안전기타구분 업무구분
  lawRegisterItemTypeName: '',
  quarterCd: null, // 분기
  quarterName: '',
  remark: '', // 비고
  evalYear: '', // 평가년도
  reviewUserId: '', // 검토자ID
  approvalUserId: '', // 승인자ID
  plantCd: '', // 사업장
  targetDeptCd: '', // 평가부서
  targetDeptName: '', // 평가부서
  saiComplianceEvalTableStepCd: '', // 진행상태(작성중)
  startDt: '', // 평가일자
  endDt: '', // 평가종료일
  compliances: [],
  deleteCompliances: [],
  compliancesTypes: []
})
const research = ref<complianceEvalTableResearchType>({
  impr: '',
  item: ''
})
const detailUrl = ref('')
const quarterItems = ref<Array<codeMasterType>>([])

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'base',
      icon: 'foundation',
      label: '준수평가 정보',
      component: defineAsyncComponent(() => import(`./complianceEvalTableInfo.vue`))
    }
  ]
  if (props.popupParam.saiComplianceEvalTableId) {
    _items.push({
      name: 'impr',
      icon: 'account_tree',
      label: '감소대책 계획 및 실행',
      component: defineAsyncComponent(() => import(`@views/common/ibm/imprTab.vue`))
    })
  }
  return _items
})
const tabHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight) ? Number(props.contentHeight) : 600
  if (height < 600) {
    height = 600
  }
  return String(height) + 'px'
})
const disabled = computed(
  () =>
    evalTable.value.saiComplianceEvalTableStepCd === 'CETS000005' ||
    evalTable.value.approvalStatusCd === 'ASC0000001' // 결재중인 경우 비활성화
)
const isOld = computed(() => Boolean(props.popupParam.saiComplianceEvalTableId))
const inputEditable = computed(() => editable.value && !disabled.value)
const inputEditable2 = computed(() => editable.value && !disabled.value && isOld.value)
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.saiComplianceEvalTableId,
    ibmTaskTypeCd: 'ITT0000160',
    ibmTaskUnderTypeCd: 'ITTU000165',
    requestContents: `${evalTable.value.evalYear}년 ${evalTable.value.quarterName} ${evalTable.value.targetDeptName} (${evalTable.value.lawRegisterItemTypeName}) 법규준수평가`,
    disabled: !inputEditable.value || props.popupParam.isApprContent,
    isOld: isOld.value,
    gridItem: {
      listUrl: selectConfig.sai.evalTable.complianceEvalTable.results.url,
      param: {
        saiComplianceEvalTableId: props.popupParam.saiComplianceEvalTableId,
        imprFlag: true
      },
      title: '준수평가 별 개선사항 목록',
      merge: [
        { index: 0, colName: 'lawId' },
        { index: 1, colName: 'saiLawRegisterMasterId' }
      ],
      columns: [
        {
          name: 'lawName',
          field: 'lawName',
          label: '법령명',
          align: 'center',
          style: 'width:90px',
          sortable: false,
          fix: true
        },
        {
          name: 'gubunName',
          field: 'gubunName',
          label: '구분',
          align: 'left',
          style: 'width:100px',
          sortable: false,
          fix: true
        },
        {
          name: 'itemName',
          field: 'itemName',
          label: '항목',
          align: 'left',
          style: 'width:120px',
          sortable: false,
          fix: true
        },
        {
          name: 'relevantClause',
          field: 'relevantClause',
          label: '관련조항',
          align: 'left',
          style: 'width:90px',
          sortable: false,
          fix: true
        },
        {
          name: 'requirements',
          field: 'requirements',
          label: '요구사항',
          align: 'left',
          style: 'width:350px',
          sortable: false,
          type: 'html'
        },
        {
          name: 'applyConstruction',
          field: 'applyConstruction',
          label: '적용사항',
          align: 'left',
          style: 'width:200px',
          sortable: false,
          type: 'html'
        },
        {
          name: 'target',
          field: 'target',
          label: '적용대상',
          align: 'left',
          style: 'width:80px',
          sortable: false,
          type: 'html'
        },
        {
          name: 'relatedDocument',
          field: 'relatedDocument',
          label: '관련문서(기록)',
          align: 'left',
          style: 'width:80px',
          sortable: false,
          type: 'html'
        },
        {
          name: 'saiComplianceResultName',
          field: 'saiComplianceResultName',
          label: '준수평가결과',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'remark',
          field: 'remark',
          label: '비고',
          align: 'left',
          style: 'width:150px',
          sortable: false
        }
      ],
      research: research.value
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
async function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  detailUrl.value = selectConfig.sai.evalTable.complianceEvalTable.get.url
  // code setting
  // list setting
  const _result = await getComboItems('QUARTER_CD')
  quarterItems.value = _result
  getDetail()
}
function getDetail() {
  if (props.popupParam.saiComplianceEvalTableId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiComplianceEvalTableId),
      method: 'GET'
    }).then((_result: any) => {
      evalTable.value = _result.data
      emits('setRegInfo', _result.data)
    })
  } else {
    evalTable.value.startDt = getToday()
    // evalTable.value.evalYear = getThisYear()
    evalTable.value.quarterCd = getQuarter(getToday(), 'cd')
    // evalTable.value.quarterName = getQuarter(getToday(), 'name')
    evalTable.value.reviewUserId = user.value.userId
    evalTable.value.complianceEvalTypeCd = 'CETC000001'
  }
}
function getQuarter(_data: string, key: 'cd' | 'name') {
  if (!quarterItems.value || quarterItems.value.length === 0) return ''
  const month = Number(_data.split('-')[1])
  let index = 0
  if (month < 4) index = 0
  else if (month < 7) index = 1
  else if (month < 10) index = 2
  else index = 3
  return key === 'cd' ? quarterItems.value[index]?.code : quarterItems.value[index]?.codeName
}
/******************************
 * TODO (목적): 팝업 닫기
 *******************************/
function closePopup(data: any) {
  emits('closePopup', data)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
