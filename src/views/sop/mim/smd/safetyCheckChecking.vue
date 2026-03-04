<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="일별 안전점검 결과 목록"
            ggridHeightAuto
            :columns="grid.columns"
            :data="grid.data"
            :editable="editable && !disabled"
            :columnSetting="false"
            :filtering="false"
            :usePaging="false"
          >
            <template v-slot:suffixTitle>
              <span v-if="!popupParam.safetyCheck.checkDate" class="text-electric">
                {{ $language('※ 점검년월을 선택하세요.') }}
              </span>
            </template>
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'customCol'">
                <component
                  :is="imprComponent"
                  :col="col"
                  :props="props"
                  :inputEditable="editable && !disabled"
                  :isImmShow="true"
                  :requestContentsCols="requestContentsCols"
                  :tableKeys="tableKeys"
                  ibmTaskTypeCd="ITT0000075"
                  ibmTaskUnderTypeCd="ITTU000130"
                  @imprChange="imprChange"
                />
              </template>
            </template>
            <template v-slot:table-header-append>
              <div style="padding: 3px 10px 0 0; font-weight: 600">
                {{ $language('점검자') }}
              </div>
              <c-task-target
                required
                :editable="editable && !disabled"
                style="width: 300px"
                :customPopupParam="{ targetKey: 'seniorStatus' }"
                :placeholder="$language('선택하세요.')"
                name="checkUserId"
                v-model:value="checkUserId"
              />
            </template>
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="
                    popupParam.safetyCheck.safetyCheckId
                      ? {
                          safetyCheckResultModelList:
                            popupParam.safetyCheck.safetyCheckResultModelList,
                          safetyCheckUserModel: {
                            dayId: props.popupParam.col.key,
                            safetyCheckId: props.popupParam.safetyCheck.safetyCheckId,
                            checkUserId: checkUserId,
                            regUserId: user.userId,
                            chgUserId: user.userId
                          }
                        }
                      : props.popupParam.safetyCheck
                  "
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </div>
      <c-dialog :param="popupOptions" />
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
  name: 'safetyCheckChecking'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
    col: any
    safetyCheck: {
      safetyCheckId: stringNull // 열화점검 일련 번호
      plantCd: stringNull // 사업장 코드
      checkStatusCd: stringNull // 계획수립/점검중/점검완료
      lineId: stringNull // 라인일련번호
      checkDeptCd: stringNull // 점검부서
      checkUserId: stringNull // 점검자 ID
      checkDate: stringNull // 점검월
      deteriorName: stringNull // 점검명
      approvalStatusCd: stringNull
      safetyCheckResultModelList: Array<any> // sheet
      safetyCheckUserModelList: Array<any>
      regUserId: stringNull // 점검명
      chgUserId: stringNull
    }
  }
  returnData: {
    col1: stringNull
    col2: stringNull
    col3: stringNull
  }
}
interface gridType {
  columns: tableColumnType[]
  data: Array<any>
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
      col: {},
      safetyCheck: {
        safetyCheckId: '', // 열화점검 일련 번호
        plantCd: '', // 사업장 코드
        checkStatusCd: '', // 계획수립/점검중/점검완료
        lineId: '', // 라인일련번호
        checkDeptCd: '', // 점검부서
        checkUserId: '', // 점검자 ID
        checkDate: '', // 점검월
        deteriorName: '', // 점검명
        approvalStatusCd: '', // 점검명
        safetyCheckResultModelList: [], // sheet
        safetyCheckUserModelList: [],
        regUserId: '',
        chgUserId: ''
      }
    }
  },
  returnData: () => {
    return {
      col1: null,
      col2: null,
      col3: null
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
const editable = ref(true)
const grid = ref<gridType>({
  columns: [],
  data: []
})
const detailUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const checkUserId = ref('')
const table = ref<any>(null)
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})

/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/sop/mim/inspection/inpsectionTableImpr.vue`))
})
const disabled = computed(() => props.popupParam.safetyCheck.checkStatusCd === 'MCSC000015')
const tableKeys = computed(() => {
  return ['safetyCheckResultId', 'colkey']
})
const requestContentsCols = computed(() => {
  // return ['dateTeam', 'checkItemName', props.popupParam.col.key + 'Name']
  return ['checkItemName']
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
  detailUrl.value = selectConfig.sop.safetycheck.plan.get.url
  saveUrl.value = transactionConfig.sop.safetycheck.plan.insert.url
  // code setting
  // list setting
  setHeader()
}
function setHeader() {
  const idx = _.findIndex(props.popupParam.safetyCheck.safetyCheckUserModelList, {
    dayId: props.popupParam.col.key
  })
  if (idx !== -1) {
    checkUserId.value = props.popupParam.safetyCheck.safetyCheckUserModelList[idx].checkUserId
  } else checkUserId.value = user.value.userId
  _.forEach(props.popupParam.safetyCheck.safetyCheckResultModelList, (_item) => {
    _item.colkey = props.popupParam.col.key
    grid.value.data.push(_item)
  })
  const _columns = [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'right',
      style: 'width:40px',
      sortable: true
    },
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목',
      align: 'left',
      style: 'width:540px',
      sortable: false
    },
    {
      name: 'checkItemCycleName',
      field: 'checkItemCycleName',
      label: '주기',
      align: 'center',
      style: 'width:100px',
      sortable: false
    }
  ]
  const days = [] as any
  days.push({
    name: props.popupParam.col.key,
    field: props.popupParam.col.key,
    label:
      props.popupParam.safetyCheck.checkDate +
      '-' +
      props.popupParam.col.day.toString().padStart(2, '0') +
      ' (' +
      props.popupParam.col.label +
      ')',
    align: 'center',
    type: 'select',
    codeGroupCd: 'MIN_SAFETY_RESULT_CD',
    setHeader: true,
    style: 'width:80px',
    sortable: false
  })
  grid.value.columns = _.concat(_columns, days, {
    name: 'customCol',
    field: 'customCol',
    label: '개선번호/개선진행상태',
    align: 'center',
    style: 'width:200px',
    type: 'custom',
    sortable: false
  })
}
function research() {
  $http({
    url: $format(detailUrl.value, props.popupParam.safetyCheck.safetyCheckId),
    method: 'GET'
  }).then((_result: any) => {
    grid.value.data = []
    _.forEach(_result.data.safetyCheckResultModelList, (_item) => {
      _item.colkey = props.popupParam.col.key
      grid.value.data.push(_item)
    })
  })
}
function saveData() {
  if (!validTable(grid.value.columns, grid.value.data)) {
    message.validError()
    return
  }
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      if (props.popupParam.safetyCheck.safetyCheckId) {
        saveUrl.value = transactionConfig.sop.safetycheck.result.newItem.url
        mappingType.value = 'PUT'
      } else {
        saveUrl.value = transactionConfig.sop.safetycheck.plan.insert.url
        mappingType.value = 'POST'
      }
      props.popupParam.safetyCheck.regUserId = user.value.userId
      props.popupParam.safetyCheck.chgUserId = user.value.userId

      props.popupParam.safetyCheck.safetyCheckResultModelList = _.cloneDeep(grid.value.data)

      if (mappingType.value === 'POST') {
        if (!props.popupParam.safetyCheck.safetyCheckUserModelList)
          props.popupParam.safetyCheck.safetyCheckUserModelList = []
        props.popupParam.safetyCheck.safetyCheckUserModelList.push({
          dayId: props.popupParam.col.key,
          safetyCheckId: props.popupParam.safetyCheck.safetyCheckId,
          checkUserId: checkUserId.value,
          editFlag: 'C'
        })
      }
      isSave.value = !isSave.value
    },
    cancelCallback: () => {}
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  if (mappingType.value === 'POST') {
    props.popupParam.safetyCheck.safetyCheckId = result.data
    props.returnData.col1 = result.data
    research()
  }
}
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
