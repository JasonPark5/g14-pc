<template>
  <div>
    <c-table
      title="근골격계질환 증상조사 설문요청 목록"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="gridHeight"
      :isExcelDown="false"
      :columnSetting="false"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-show="completeBtnEditable"
            :isSubmit="isComplete"
            :url="completeUrl"
            :param="{
              heaInvestigationPlanId: props.param.heaInvestigationPlanId,
              heaInvestigationStepCd: props.param.stepCd
            }"
            mappingType="PUT"
            label="조사완료"
            icon="check"
            @beforeAction="completeInvestigation"
            @btnCallback="completeInvestigationCallback"
          />
        </q-btn-group>
      </template>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardInvestigationDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  height?: stringNull
  param: {
    heaInvestigationPlanId: stringNull
    searchProcess: any | null | undefined
    stepCd: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}

const grid = ref<gridType>({
  columns: [
    {
      name: 'worker',
      field: 'worker',
      label: '작업자',
      child: [
        {
          name: 'userName',
          field: 'userName',
          label: '이름',
          align: 'center',
          sortable: false,
          style: 'width:80px',
          type: 'link'
        },
        {
          name: 'deptName',
          field: 'deptName',
          label: '부서',
          align: 'center',
          sortable: false,
          style: 'width:80px'
        },
        {
          name: 'heaMuscleSurveyStepName',
          field: 'heaMuscleSurveyStepName',
          label: '설문지 작성현황',
          align: 'center',
          sortable: false,
          style: 'width:80px'
        }
      ]
    },
    {
      name: 'processSopNames',
      field: 'processSopNames',
      label: '관련 공정/단위작업',
      align: 'left',
      sortable: false,
      style: 'width:400px'
    }
  ],
  data: []
})
/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  height: null,
  param: () => {
    return {
      heaInvestigationPlanId: '',
      stepCd: '',
      searchProcess: {
        flag: '',
        isSearch: false
      }
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const listUrl = ref('')
const editable = ref(true)
const isComplete = ref(true)
const completeUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.param.heaInvestigationPlanId))
const completeDisabled = computed(() => props.param.stepCd !== 'HI00000007')
const completeBtnEditable = computed(() => editable.value && !completeDisabled.value && isOld.value)

const gridHeight = computed(() =>
  props.height ? _.replace(props.height, 'px', '') + 'px' : '680px'
)
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.searchProcess.flag,
  () => {
    getDetail()
  }
)

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
  listUrl.value = selectConfig.hea.muscleSystem.muscleSurvey.list.url
  completeUrl.value = transactionConfig.hea.muscleSystem.investigationPlan.complete.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 설문조사 결과 상세조회
 *******************************/
function getDetail() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      heaInvestigationPlanId: props.param.heaInvestigationPlanId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 조사 완료 처리
 *******************************/
function completeInvestigation() {
  message.confirm({
    title: '확인',
    message: '조사완료하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      isComplete.value = !isComplete.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function completeInvestigationCallback() {
  message.requestSuccess()
  emits('emitStep', {
    name: 'currentStep',
    param: {
      stepCd: 'HI00000010',
      heaInvestigationPlanId: props.param.heaInvestigationPlanId
    }
  })
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = $language('근골격계질환 증상조사') + ' : ' + row.investigationPlanName
  popupOptions.value.param = { heaMuscleWorkerSurveyId: row.heaMuscleWorkerSurveyId }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./symptomSurveyDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getDetail()
}
</script>
