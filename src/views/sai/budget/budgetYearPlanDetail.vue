<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled && isOld"
                  label="삭제"
                  icon="delete"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-show="editable && !disabled && isOld"
                  :url="completeUrl"
                  :isSubmit="isComplete"
                  :param="budgetPlan"
                  mappingType="PUT"
                  label="완료"
                  icon="check"
                  @beforeAction="completeData"
                  @btnCallback="completeCallback"
                />
                <c-btn
                  v-show="editable && !disabled"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="budgetPlan"
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
                  :editable="editable"
                  :disabled="disabled"
                  name="plantCd"
                  v-model:value="budgetPlan.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="editable"
                  :disabled="disabled"
                  label="예산년도"
                  name="budgetYear"
                  type="year"
                  default="today"
                  v-model:value="budgetPlan.budgetYear"
                />
              </div>
              <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :disabled="true"
                  :suffix="$language('원')"
                  :editable="editable"
                  type="number"
                  label="총 예산금액"
                  name="budgetAllAmt"
                  v-model:value="budgetPlan.budgetAllAmt"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-12">
          <c-table
            ref="table"
            title="항목별 예산편성"
            :columns="grid.columns"
            :data="budgetPlan.planItems"
            gridHeight="500px"
            :editable="editable && !disabled"
            :columnSetting="false"
            :expandAll="false"
            :isFullScreen="false"
            :usePaging="false"
            :hideBottom="true"
            :filtering="false"
            @table-data-change="tableDataChange"
            rowKey="budgetYearPlanItemId"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addItem" />
                <c-btn
                  v-if="editable && !disabled && budgetPlan.planItems.length > 0"
                  label="제외"
                  icon="remove"
                  @btnClicked="deleteItem"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </div>
    </q-form>
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
  name: 'budgetYearPlanDetail'
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
    budgetYearPlanId: stringNull
    plantCd: stringNull
  }
  contentHeight: stringNull | numberNull
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
      budgetYearPlanId: '',
      plantCd: ''
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
const budgetPlan = ref<any>({
  budgetYearPlanId: '',
  budgetAllAmt: 0,
  plantCd: '',
  budgetYear: '',
  budgetStatusCd: '',
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  planItems: [],
  deletePlanItems: []
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
const insertUrl = ref('')
const detailUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const checkUrl = ref('')
const completeUrl = ref('')
const listItemUrl = ref('')
const isSave = ref(false)
const isComplete = ref(false)
const editForm = ref<any>(null)
const table = ref<any>(null)
const grid = ref({
  columns: [
    {
      name: 'budgetTypeName',
      field: 'budgetTypeName',
      label: '항목',
      align: 'left',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'budgetItemName',
      field: 'budgetItemName',
      label: '항목',
      align: 'left',
      style: 'width: 200px',
      sortable: false
    },
    {
      required: true,
      name: 'budgetPlanAmt',
      field: 'budgetPlanAmt',
      label: '예산 사용금액(원)',
      align: 'right',
      style: 'width: 150px',
      sortable: false,
      type: 'number'
    },
    {
      name: 'budgetDetails',
      field: 'budgetDetails',
      label: '비고',
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
      taskClassCd: 'SAI_BUDGET_ITEM',
      keyText: 'budgetYearPlanItemId',
      sortable: false
    }
  ]
})

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.popupParam.budgetYearPlanId)
})
const disabled = computed(() => {
  return isOld.value && budgetPlan.value.budgetStatusCd === 'BS00000005'
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
  saveUrl.value = transactionConfig.sai.budget.year.insert.url
  listItemUrl.value = selectConfig.sai.budget.item.list.url
  checkUrl.value = selectConfig.sai.budget.year.check.url
  detailUrl.value = selectConfig.sai.budget.year.get.url
  insertUrl.value = transactionConfig.sai.budget.year.insert.url
  updateUrl.value = transactionConfig.sai.budget.year.update.url
  deleteUrl.value = transactionConfig.sai.budget.year.delete.url
  completeUrl.value = transactionConfig.sai.budget.year.complete.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.budgetYearPlanId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.budgetYearPlanId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(budgetPlan.value, _result.data)
      emits('setRegInfo', _result.data)
    })
  } else {
    getItems()
  }
}
function getItems() {
  if (!budgetPlan.value.plantCd) {
    budgetPlan.value.planItems = []
    message.alert({
      title: '안내',
      message: '사업장을 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    $http({
      url: listItemUrl.value,
      method: 'GET',
      params: {
        plantCd: budgetPlan.value.plantCd
      }
    }).then((_result: any) => {
      _.forEach(_result.data, (_item) => {
        budgetPlan.value.planItems.push({
          budgetYearPlanId: props.popupParam.budgetYearPlanId,
          budgetYearPlanItemId: uid(),
          saiBudgetItemId: _item.saiBudgetItemId,
          budgetItemName: _item.budgetItemName,
          budgetContent: _item.budgetContent,
          budgetTypeName: _item.budgetTypeName,
          budgetPlanAmt: 0,
          budgetDetails: '',
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C'
        })
      })
    })
  }
}
function tableDataChange(props: any, col: any) {
  budgetPlan.value.budgetAllAmt = 0
  if (col.name === 'budgetPlanAmt') {
    if (props.row['budgetPlanAmt'] && props.row['budgetPlanAmt'] > 0) {
      _.forEach(budgetPlan.value.planItems, (_item) => {
        if (_item.budgetPlanAmt && _item.budgetPlanAmt > 0) {
          budgetPlan.value.budgetAllAmt =
            Number(budgetPlan.value.budgetAllAmt) + Number(_item.budgetPlanAmt)
        } else {
          _item.budgetPlanAmt = 0
        }
      })
    } else {
      props.row['budgetPlanAmt'] = 0
    }
  }
}
function saveData() {
  if (props.popupParam.budgetYearPlanId) {
    saveUrl.value = transactionConfig.sai.budget.year.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sai.budget.year.insert.url
    mappingType.value = 'POST'
    budgetPlan.value.budgetStatusCd = 'BS00000001'
  }
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      if (validTable(grid.value.columns, budgetPlan.value.planItems)) {
        $http({
          url: checkUrl.value,
          method: 'GET',
          params: {
            plantCd: budgetPlan.value.plantCd,
            budgetYear: budgetPlan.value.budgetYear,
            budgetYearPlanId: props.popupParam.budgetYearPlanId
          }
        }).then((_result: any) => {
          if (_result.data > 0) {
            message.alert({
              title: '안내',
              message: '동일한 년도의 예산편성이 있습니다.',
              type: 'warning' // success / info / warning / error
            })
          } else {
            message.confirm({
              title: '확인',
              message: '저장하시겠습니까?',
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                budgetPlan.value.regUserId = user.value.userId
                budgetPlan.value.chgUserId = user.value.userId
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
  props.popupParam.budgetYearPlanId = result.data
  getDetail()
}
function completeData() {
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          budgetPlan.value.chgUserId = user.value.userId
          budgetPlan.value.budgetStatusCd = 'BS00000005'
          isComplete.value = !isComplete.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function completeCallback(result: any) {
  message.requestSuccess()
  props.popupParam.budgetYearPlanId = result.data
  getDetail()
}
function addItem() {
  popupOptions.value.title = '예산편성 항목 검색'
  popupOptions.value.param = {
    type: 'multiple',
    plantCd: budgetPlan.value.plantCd
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./budgetItemPop.vue`)))
  popupOptions.value.width = '70%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopMst
}
function closePopMst(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      if (
        _.findIndex(budgetPlan.value.planItems, {
          saiBudgetItemId: _item.saiBudgetItemId
        }) === -1
      ) {
        budgetPlan.value.planItems.push({
          budgetYearPlanId: props.popupParam.budgetYearPlanId,
          budgetYearPlanItemId: uid(),
          saiBudgetItemId: _item.saiBudgetItemId,
          budgetItemName: _item.budgetItemName,
          budgetContent: _item.budgetContent,
          budgetTypeName: _item.budgetTypeName,
          budgetPlanAmt: 0,
          budgetDetails: '',
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C'
        })
      }
    })
  }
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
    if (!budgetPlan.value.deletePlanItems) budgetPlan.value.deletePlanItems = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(budgetPlan.value.deletePlanItems, {
          budgetYearPlanItemId: item.budgetYearPlanItemId
        })
      ) {
        budgetPlan.value.deletePlanItems.push(item)
      }
      budgetPlan.value.planItems = _.reject(budgetPlan.value.planItems, item)
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
        url: $format(deleteUrl.value, props.popupParam.budgetYearPlanId),
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
