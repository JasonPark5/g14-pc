<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && isOld"
                  label="삭제"
                  icon="delete"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-show="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="budgetResult"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  :disabled="isOld"
                  :editable="editable"
                  name="plantCd"
                  v-model:value="budgetResult.plantCd"
                  @datachange="setSumAmtList(false)"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :disabled="isOld"
                  label="집행년월"
                  name="year"
                  type="month"
                  v-model:value="budgetResult.budgetMonth"
                  @datachange="setSumAmtList(false)"
                />
              </div>
              <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  required
                  :editable="editable"
                  label="부서"
                  name="budgetDeptCd"
                  v-model:value="budgetResult.budgetDeptCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-12">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>
              {{ $language('항목별 집행금액 누적집행액 / 편성 (원)') }}
            </q-toolbar-title>
          </q-toolbar>
          <q-list bordered padding class="row">
            <div
              v-for="(item, idx) in planItems"
              :key="idx"
              class="col-xs-12 col-sm-3 col-md-3 col-lg-3"
            >
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <b class="text-grey-8">{{ $language(item.budgetItemName) }}</b>
                  </q-item-label>
                  <q-item-label caption class="text-red text-weight-medium">
                    {{ toThousandFilter(item.stackAmount) }} /
                    {{ toThousandFilter(item.budgetPlanAmt) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
            </div>
          </q-list>
        </div>
        <div class="col-12 q-mb-md">
          <c-table
            ref="table"
            title="예산집행 목록"
            :columns="grid.columns"
            :data="budgetResult.resultItems"
            gridHeight="860px"
            :editable="editable"
            :columnSetting="false"
            :expandAll="false"
            :isFullScreen="false"
            :filtering="false"
            rowKey="budgetResultItemId"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addItem" />
                <c-btn
                  v-if="editable && budgetResult.resultItems.length > 0"
                  label="제외"
                  icon="remove"
                  @btnClicked="deleteItem"
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
import { toThousandFilter } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'budgetResultDetail'
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
    budgetResultId: stringNull
  }
  contentHeight: stringNull | numberNull
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
      budgetResultId: ''
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
const editable = ref(true)
const budgetResult = ref<any>({
  plantCd: null,
  budgetMonth: '',
  budgetDeptCd: '',
  budgetAllAmt: 0,
  resultItems: []
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const saveUrl = ref('')
const mappingType = ref('POST')
const yearListUrl = ref('')
const detailUrl = ref('')
const deleteUrl = ref('')
const checkUrl = ref('')
const deleteDeptUrl = ref('')
const isSave = ref(false)
const editForm = ref<any>(null)
const table = ref<any>(null)
const grid = ref({
  columns: [] as any
})
const planItems = ref<any>([])
const endDate = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.popupParam.budgetResultId)
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
  detailUrl.value = selectConfig.sai.budget.result.get.url
  yearListUrl.value = selectConfig.sai.budget.year.plant.url
  checkUrl.value = selectConfig.sai.budget.result.check.url
  saveUrl.value = transactionConfig.sai.budget.result.insert.url
  deleteUrl.value = transactionConfig.sai.budget.result.delete.url
  deleteDeptUrl.value = transactionConfig.sai.budget.result.delete.url
  // code setting
  budgetResult.value.budgetMonth = getThisMonth()
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.budgetResultId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.budgetResultId),
      method: 'GET'
    }).then((_result: any) => {
      budgetResult.value = _result.data
      setSumAmtList(false)
      emits('setRegInfo', _result.data)
    })
  } else {
    setSumAmtList(true)
  }
}
function setSumAmtList(isNew: any) {
  $http({
    url: yearListUrl.value,
    method: 'GET',
    params: {
      plantCd: user.value.plantCd,
      budgetMonth: budgetResult.value.budgetMonth
    }
  }).then((_result: any) => {
    if (isNew) {
      budgetResult.value.plantCd = _result.data.plantCd
    }
    if (budgetResult.value.budgetMonth) {
      const year = budgetResult.value.budgetMonth.substring(0, 4)
      const month = budgetResult.value.budgetMonth.substring(5)
      const day = new Date(year, month, 0).getDate()

      endDate.value = year + '-' + month + '-' + day
    }
    planItems.value = _result.data.planItems
    setHeader()
  })
}
function setHeader() {
  const comboItems = [] as any
  _.forEach(planItems.value, (_item) => {
    comboItems.push({
      code: _item.budgetYearPlanItemId,
      codeName: $language(_item.budgetItemName)
    })
  })
  grid.value.columns = [
    {
      setHeader: true,
      required: true,
      name: 'budgetYearPlanItemId',
      field: 'budgetYearPlanItemId',
      label: '항목',
      align: 'left',
      style: 'width: 250px',
      sortable: false,
      type: 'select',
      comboItems: comboItems
    },
    {
      setHeader: true,
      required: true,
      name: 'budgetDate',
      field: 'budgetDate',
      label: '집행일',
      align: 'center',
      type: 'date',
      start: budgetResult.value.budgetMonth + '-01',
      end: endDate.value,
      style: 'width:150px',
      sortable: true
    },
    {
      setHeader: true,
      required: true,
      name: 'budgetResultAmt',
      field: 'budgetResultAmt',
      label: '예산 집행금액(원)',
      align: 'right',
      style: 'width: 150px',
      sortable: false,
      type: 'number'
    },
    {
      name: 'budgetContent',
      field: 'budgetContent',
      label: '집행내용',
      style: 'width: 350px',
      align: 'left',
      sortable: false,
      type: 'textarea'
    },
    {
      name: 'attach',
      field: 'attach',
      label: '항목별 첨부',
      align: 'center',
      style: 'width: 250px',
      type: 'attach',
      taskClassCd: 'SAI_BUDGET_RESULT_ITEM',
      keyText: 'budgetResultItemId',
      sortable: false
    }
  ]
}
function saveData() {
  if (props.popupParam.budgetResultId) {
    saveUrl.value = transactionConfig.sai.budget.result.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sai.budget.result.insert.url
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      if (validTable(grid.value.columns, budgetResult.value.resultItems)) {
        $http({
          url: checkUrl.value,
          method: 'GET',
          params: {
            plantCd: budgetResult.value.plantCd,
            budgetMonth: budgetResult.value.budgetMonth,
            budgetDeptCd: budgetResult.value.budgetDeptCd,
            budgetResultId: props.popupParam.budgetResultId
          }
        }).then((_result: any) => {
          if (_result.data > 0 && mappingType.value === 'POST') {
            message.alert({
              title: '안내',
              message: '동일한 년월의 부서별 예산집행내역이 있습니다.',
              type: 'warning' // success / info / warning / error
            })
          } else {
            message.confirm({
              title: '확인',
              message: '저장하시겠습니까?',
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                budgetResult.value.regUserId = user.value.userId
                budgetResult.value.chgUserId = user.value.userId
                isSave.value = !isSave.value
              },
              // 취소 callback 함수
              cancelCallback: () => {}
            })
          }
        })
      }
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.budgetResultId = result.data
  getDetail()
}
function addItem() {
  if (!budgetResult.value.resultItems) budgetResult.value.resultItems = []
  budgetResult.value.resultItems.push({
    budgetResultId: props.popupParam.budgetResultId,
    budgetResultItemId: uid(),
    budgetDate: '',
    budgetResultAmt: 0,
    budgetContent: '',
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
function deleteItem() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!budgetResult.value.deleteResultItems) budgetResult.value.deleteResultItems = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(budgetResult.value.deleteResultItems, {
          budgetYearPlanItemId: item.budgetYearPlanItemId
        })
      ) {
        budgetResult.value.deleteResultItems.push(item)
      }
      budgetResult.value.resultItems = _.reject(budgetResult.value.resultItems, item)
    })
    table.value.compoTable.clearSelection()
  }
}
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.budgetResultId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
