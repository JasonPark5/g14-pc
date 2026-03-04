<template>
  <div>
    <c-tab
      type="horizon"
      :tabItems="tabItems"
      :inlineLabel="true"
      v-model:value="tab"
      :dense="true"
      :height="tabHeight"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :outernal="outernal"
          :attachInfo="attachInfo"
          :disabled="disabled"
          :contentHeight="contentHeight"
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
  name: 'outernalDetail'
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
  popupParam: {
    saiOuternalResultId: stringNull
  }
  contentHeight: numberNull | stringNull
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
      saiOuternalResultId: ''
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
const editable = ref(true)
const tab = ref('info')
const outernal = ref<any>({
  saiOuternalResultId: '', // 외부심사결과 일련번호
  plantCd: '', // 사업장코드
  outernalResultName: '', // 외부심사명
  auditStartDate: '', // 심사시작일
  auditEndDate: '', // 심사종료일
  period: [],
  year: '',
  auditTargetDeptCd: '', // 심사대상부서
  auditDeptCd: '', // 심사주관부서
  saiOuternalAuditAgency: null, // 주관심사기관
  auditPurpose: '', // 심사목적
  imprDerivedItems: '', // 개선도출항목
  auditResult: null, // 심사결과
  auditResultSummary: '', // 심사결과요약
  auditTargetDeptReviewOpinion: '', // 심사대상부서검토의견
  regUserId: '',
  chgUserId: '',
  auditTeams: [], // 심사팀
  deleteAuditTeams: [], // 심사팀 [삭제]
  imprs: [] // 개선
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'OUTER_AUDIT_ATTACH',
  taskKey: ''
})
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  return String(props.contentHeight - 36) + 'px'
})
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'info',
      label: '외부심사 정보',
      component: defineAsyncComponent(() => import(`./outernalInfo.vue`))
    }
  ]
  if (props.popupParam.saiOuternalResultId) {
    _items.push({
      name: 'impr',
      icon: 'construction',
      label: '개선사항',
      component: defineAsyncComponent(() => import(`./outernalImpr.vue`))
    })
  }
  return _items
})
const disabled = computed(() => {
  return false
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
  detailUrl.value = selectConfig.sai.outernal.result.get.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.saiOuternalResultId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiOuternalResultId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(outernal.value, _result.data)
      emits('setRegInfo', _result.data)
      outernal.value.period = [outernal.value.auditStartDate, outernal.value.auditEndDate]
      attachInfo.value.taskKey = props.popupParam.saiOuternalResultId
    })
  }
}
function closePopup() {
  emits('closePopup')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
