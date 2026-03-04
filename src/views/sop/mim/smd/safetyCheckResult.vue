<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="관리감독자 점검일지 결과 목록"
            :columns="grid.columns"
            :data="safetyCheck.safetyCheckResultModelList"
            :gridHeight="gridHeight"
            rowKey="safetyCheckResultId"
            :editable="!disabled"
            :columnSetting="false"
            :filtering="false"
            :usePaging="false"
            :isFullScreen="false"
            @headLinkClick="headLinkClick"
          >
            <template v-slot:table-chip>
              <b v-if="!safetyCheck.checkDate" class="text-electric">
                {{ $language('※ 점검년월을 선택하세요.') }}
              </b>
            </template>
            <template v-slot:customArea="{ props, col }">
              <template v-if="props.row[col.key] === 'MSR0000001'">
                <q-icon name="radio_button_unchecked" :color="customColor(col, props.row)" />
              </template>
              <template v-else-if="props.row[col.key] === 'MSR0000002'">
                <q-icon name="close" :color="customColor(col, props.row)" />
              </template>
            </template>
          </c-table>
        </div>
      </div>
      <c-dialog :param="popupOptions" :returnData="{ col1: safetyCheck.safetyCheckId }" />
    </q-form>
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
  name: 'safetyCheckResult'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setKey', 'getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  safetyCheck: {
    safetyCheckId: stringNull // 열화점검 일련 번호
    plantCd: stringNull // 사업장 코드
    checkStatusCd: stringNull // 계획수립/점검중/점검완료
    checkDeptCd: stringNull // 점검부서
    checkUserId: stringNull // 점검자 ID
    checkDate: stringNull // 점검월
    safetyCheckName: stringNull // 점검명
    approvalStatusCd: stringNull // 결재관련 결재상태
    sysApprovalRequestId: stringNull // 결재관련 결재요청코드
    safetyCheckResultModelList: Array<any> // sheet
  }
  grid: {
    columns: tableColumnType
    height: stringNull
  }
  disabled: boolean
  height?: stringNull
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
  safetyCheck: () => {
    return {
      safetyCheckId: '', // 열화점검 일련 번호
      plantCd: '', // 사업장 코드
      checkStatusCd: '', // 계획수립/점검중/점검완료
      checkDeptCd: '', // 점검부서
      checkUserId: '', // 점검자 ID
      checkDate: '', // 점검월
      safetyCheckName: '', // 점검명
      approvalStatusCd: '', // 결재관련 결재상태
      sysApprovalRequestId: '', // 결재관련 결재요청코드
      safetyCheckResultModelList: [] // sheet
    }
  },
  grid: () => {
    return {
      height: 'auto',
      columns: []
    }
  },
  disabled: false,
  height: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const currentMonth = ref('')
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.height && !Number.isNaN(Number(props.height.replace('px', '')))
      ? Number(props.height.replace('px', '')) - 16
      : 200
  if (height < 200) height = 200
  return height + 'px'
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
  currentMonth.value = getToday().slice(-5, getToday().length - 3)
  // list setting
}
function headLinkClick(_props: any, col: any) {
  const day = String(col.day).length === 1 ? '0' + col.day : col.day
  popupOptions.value.title =
    currentMonth.value +
    '-' +
    day +
    '(' +
    col.label +
    ') ' +
    $language('관리감독자 점검일지 결과 상세')
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safetyCheckChecking.vue`))
  )
  popupOptions.value.param = {
    col: col,
    safetyCheck: props.safetyCheck
  }
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '70%'
  popupOptions.value.closeCallback = closeResultPopup
}
function closeResultPopup(returnData: any) {
  table.value.setSelected([])
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (returnData.col1) {
    props.safetyCheck.safetyCheckId = returnData.col1
    emits('setKey', returnData.col1)
  } else {
    emits('getDetail')
  }
}
function customColor(col: any, row: any) {
  const tableKey = _.split(row['tableKeys'], ',')
  let color = 'green'
  if (tableKey && tableKey.length > 0) {
    _.forEach(tableKey, (item) => {
      if (item === col.key) {
        color = 'red'
      }
    })
  }
  return color
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
