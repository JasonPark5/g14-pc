<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="일상점검 Sheet 결과 목록"
            tableId="facilitySelfCheck"
            :merge="grid.merge"
            gridHeight="750px"
            :columns="grid.columns"
            :data="grid.data"
            :editable="!disabled"
            :columnSetting="false"
            :usePaging="false"
            @headerDataChange="headerDataChange"
          >
            <template v-slot:table-header-append>
              <span
                v-if="!popupParam.dailyCheck.lineId && !popupParam.dailyCheck.checkDate"
                color="#C10015"
              >
                {{ $language('※ 라인과 점검년월을 선택하세요.') }}
              </span>
              <span
                style="font-size: 0.8em; font-weight: 500; margin-right: 20px"
                class="text-grey-9"
              >
                <q-icon name="radio_button_unchecked" class="ml-10" /> : {{ $language('정상') }}
                <q-icon name="close" class="ml-10" /> : {{ $language('이상') }}
                <span class="ml-10">● : {{ $language('청소') }}</span>
                <q-icon name="check" size="xs" class="ml-10" /> :
                {{ $language('교환') }}
                <q-icon name="check_box_outline_blank" class="ml-10" /> :
                {{ $language('마모') }}
                <q-icon name="change_history" class="ml-10" /> : {{ $language('Oil 누유') }}
                <span class="ml-10">▲ : {{ $language('점검필요') }} </span>
                <q-icon name="radio_button_checked" class="ml-10" /> :
                {{ $language('비가동') }}
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
                  :requestContentsCols="['equipmentName', 'checkItemPartName', 'checkItemName']"
                  :tableKeys="['dailyCheckResultId', 'colkey']"
                  ibmTaskTypeCd="ITT0000070"
                  ibmTaskUnderTypeCd="ITTU000123"
                  @imprChange="imprChange"
                />
              </template>
              <template
                v-else-if="col.name === 'cycle1' || col.name === 'cycle2' || col.name === 'cycle3'"
              >
                <span v-if="props.row[col.name] === 'Y'">
                  {{ '●' }}
                </span>
              </template>
              <template v-else-if="col.name === 'remark'">
                <c-text-column
                  :editable="editable"
                  :props="props"
                  :col="col"
                  :disabled="disabled"
                  v-model:value="props.row[col.name]"
                  @datachange="datachange(props, 1)"
                />
              </template>
              <template v-else>
                <c-select
                  class="no-label-control"
                  :editable="editable"
                  :comboItems="checkboxItems"
                  itemText="codeName"
                  itemValue="code"
                  type="edit"
                  label=""
                  name="checkItems"
                  v-model:value="props.row[col.name]"
                  @update:value="datachange(props, 2)"
                />
              </template>
            </template>
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="grid.data"
                  mappingType="POST"
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
      <c-dialog :param="popupOptions">></c-dialog>
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
  name: 'equipmentDailyChecking'
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
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: any
  returnData: returnDataType
}
interface returnDataType {
  col1: any
  col2: any
  col3: any
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: any
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
  popupParam: () => {
    return {
      col: {},
      equipmentList: [],
      dailyCheck: {
        dailyCheckId: '', // 열화점검 일련 번호
        plantCd: '', // 사업장 코드
        checkStatusCd: '', // 계획수립/점검중/점검완료
        lineId: '', // 라인일련번호
        checkDeptCd: '', // 점검부서
        checkUserId: '', // 점검자 ID
        checkDate: '', // 점검월
        deteriorName: '', // 점검명
        dailyResultModelList: [] // sheet
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'equipmentCd' }],
  columns: [],
  data: [],
  height: 'auto'
})
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const table = ref<any>(null)
const checkboxItems = ref<codeMasterType>([
  { code: 'CHK001', codeName: 'o' },
  { code: 'CHK002', codeName: 'X' },
  { code: 'CHK003', codeName: '●' },
  { code: 'CHK004', codeName: 'V' },
  { code: 'CHK005', codeName: '□' },
  { code: 'CHK006', codeName: '△' },
  { code: 'CHK007', codeName: '▲' },
  { code: 'CHK008', codeName: '⊙' }
])
const editForm = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return (
    props.popupParam.dailyCheck.checkStatusCd === 'MCSC000015' ||
    Boolean(props.popupParam.dailyCheck.sysApprovalRequestId)
  )
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
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
  saveUrl.value = transactionConfig.sop.min.equipment.result.daily.newItem.url
  // code setting
  // list setting
  setHeader()
}
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function setHeader() {
  if (props.popupParam.equipmentList) {
    _.forEach(props.popupParam.equipmentList, (_item) => {
      _item.colkey = props.popupParam.col.key
      if (
        _item[props.popupParam.col.key] &&
        _.findIndex(checkboxItems.value, { code: _item[props.popupParam.col.key] }) === -1
      ) {
        _item.remark = _item[props.popupParam.col.key]
      }
    })
    grid.value.data = _.clone(props.popupParam.equipmentList)
  }

  const _columns: any = [
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'center',
      style: 'width:180px',
      type: 'html',
      sortable: false
    },
    {
      name: 'checkItemPartName',
      field: 'checkItemPartName',
      label: '부품명',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'checkItemMethod',
      field: 'checkItemMethod',
      label: '점검방법',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'checkStandard',
      field: 'checkStandard',
      label: '점검기준',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      label: '주기',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'cycle1',
          field: 'cycle1',
          label: '일',
          style: 'width:30px',
          align: 'center',
          type: 'custom',
          sortable: false
        },
        {
          name: 'cycle2',
          field: 'cycle2',
          label: '주',
          style: 'width:30px',
          align: 'center',
          type: 'custom',
          sortable: false
        },
        {
          name: 'cycle3',
          field: 'cycle3',
          label: '월',
          style: 'width:30px',
          align: 'center',
          type: 'custom',
          sortable: false
        }
      ]
    }
  ]
  const days = []
  days.push(
    {
      name: props.popupParam.col.key,
      field: props.popupParam.col.key,
      label: props.popupParam.col.label + $language('일'),
      align: 'center',
      setHeader: true,
      comboItems: checkboxItems.value,
      style: 'width:200px',
      type: 'custom',
      headType: 'select',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: props.popupParam.col.label + $language('일(수치입력)'),
      headType: 'text',
      align: 'left',
      setHeader: true,
      style: 'width:200px',
      type: 'custom',
      sortable: false
    }
  )
  grid.value.columns = _.concat(
    _columns,
    {
      name: 'year',
      field: 'year',
      label: '측정값',
      child: days
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선번호/개선진행상태',
      align: 'center',
      style: 'width:350px',
      type: 'custom',
      sortable: false
    }
  )
}
function saveData() {
  mappingType.value = props.popupParam.dailyCheck.dailyCheckId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.popupParam.dailyCheck.regUserId = user.value.userId
          props.popupParam.dailyCheck.chgUserId = user.value.userId

          props.popupParam.dailyCheck.utilityFlag = 'N'
          _.forEach(grid.value.data, (_item) => {
            _item.regUserId = user.value.userId
            _item.chgUserId = user.value.userId
            if (!_item[props.popupParam.col.key]) {
              _item[props.popupParam.col.key] = _item.remark
            }
          })

          if (mappingType.value === 'POST') {
            _.forEach(grid.value.data, (_item) => {
              _.forEach(props.popupParam.dailyCheck.dailyResultModelList, (__item: any) => {
                if (__item.dailyCheckResultId === _item.dailyCheckResultId) {
                  __item = _item
                }
              })
            })
          } else if (mappingType.value === 'PUT') {
            props.popupParam.dailyCheck.dailyResultModelList = _.clone(grid.value.data)
          }
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()

  if (mappingType.value === 'POST') {
    props.popupParam.dailyCheck.dailyCheckId = result.data
    props.returnData.col1 = result.data
    _.forEach(grid.value.data, (_item) => {
      _item.deteriorCheckId = result.data
      _item.editFlag = 'U'
    })
  }
}
function datachange(_props: any, num?: numberNull) {
  if (num === 1) _props.row[props.popupParam.col.key] = null
  if (num === 2) _props.row['remark'] = null
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
}
function headerDataChange(_props: any, col: any) {
  if (col.name === props.popupParam.col.key) {
    _.forEach(grid.value.data, (_item) => {
      _item.remark = ''
    })
  } else if (col.name === 'remark') {
    _.forEach(grid.value.data, (_item) => {
      _item[props.popupParam.col.key] = null
    })
  }
}
// 개선창 닫기 후
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
