<template>
  <div class="row">
    <div class="col-12">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="설비 점검 목록"
          :columns="grid.columns"
          gridHeight="240px"
          :selection="isMultiple ? 'multiple' : 'none'"
          :data="grid.data"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :checkClickFlag="false"
          :hideBottom="true"
          :isExcelDown="false"
          rowKey="minEquipmentCheckId"
          checkDisableColumn="disable"
          @rowClick="rowClick"
        >
          <!-- @rowClick="rowClick" -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <q-icon
                v-if="editable && !disabled && isMultiple"
                name="help"
                style="font-size: 20px; margin-right: 8px; position: relative; top: 3px"
                color="primary"
              >
                <q-tooltip
                  anchor="bottom left"
                  self="top left"
                  :offset="[0, 0]"
                  style="font-size: 0.85em; padding: 10px"
                >
                  <div class="tooltipCustomTop">{{ $language('버튼설명') }}</div>
                  <div class="tooltipCustom">
                    {{ $language('▫️ 선택완료 : 체크박스를 선택하여 점검완료 하는 버튼입니다.') }}
                    <br />
                    {{
                      $language(
                        '▫️ 일괄저장 : 설비목록과 설비별 점검항목, 개선관리를 일괄적으로 저장하는 버튼입니다.'
                      )
                    }}
                  </div>
                </q-tooltip>
              </q-icon>
              <c-btn
                v-if="editable && !disabled && isMultiple"
                label="선택완료"
                icon="task_alt"
                color="blue"
                @btnClicked="resultComplete"
              />
              <c-btn
                v-if="editable && !disabled && !isMultiple"
                label="완료"
                icon="check"
                color="blue"
                @btnClicked="resultComplete2"
              />
              <c-btn
                v-if="editable && !disabled"
                :url="updateUrl"
                :isSubmit="isSave"
                :param="grid.data"
                mappingType="PUT"
                :label="isMultiple ? '일괄저장' : '저장'"
                icon="save"
                @beforeAction="saveInspection"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'sopMocName'">
              <q-btn
                class="tableinnerBtn tableinnerUserSearch"
                :class="{ 'tableinnerUserSearch-left': true, 'tableinnerUserSearch-right': true }"
                flat
                color="blue-6"
                :disable="props.row.disable"
                :label="props.row.sopMocName"
                icon="search"
                @click.stop="linkClick(props.row)"
              />
            </template>
            <template v-if="col.name === 'complete' && isMultiple">
              <q-icon
                size="sm"
                :editable="editable"
                :disable="props.row.disable"
                name="task_alt"
                class="cursor-pointer text-primary"
                @click.stop="resultComplete3(props.row)"
              />
            </template>
          </template>
        </c-table>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-tab
        type="tabcard"
        :tabItems="tabItems"
        :inlineLabel="true"
        v-model:value="tab"
        :height="tabHeight"
        align="left"
        @tabClick="tabClick"
      >
        <template v-slot:default="tab">
          <component
            :is="tab.component"
            :result="result"
            :imprTabInfo="imprTabInfo"
            :research="research"
            :isMultiple="isMultiple"
          />
        </template>
      </c-tab>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { equipPlanType } from './equipmentPlan'

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
  name: 'equipmentResultDetail'
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
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: equipPlanPopupParamType
  contentHeight: stringNull
}
interface equipPlanPopupParamType {
  title: stringNull
  noPlan: stringNull
  selectData: arrayString | null
  equipmentCd: stringNull
  minEquipmentCheckId: stringNull
  checkDate: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<equipPlanType>
  height: stringNull
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
      title: '',
      noPlan: 'N',
      selectData: [],
      equipmentCd: '',
      minEquipmentCheckId: '',
      checkDate: ''
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const result = ref<equipPlanType>({
  minEquipmentCheckId: '',
  plantCd: '',
  plantName: '',
  checkDeptCd: '',
  checkDeptName: '',
  checkUserId: '',
  checkUserName: '',
  sopMocId: '',
  sopMocName: '',
  equipmentCheckKindCd: null,
  equipmentCheckKindNm: '',
  checkStatusCd: '',
  checkScheduleUserName: '',
  checkScheduleUserId: '',
  checkScheduleDate: '',
  equipmentTypeCd: '',
  equipmentCd: '',
  equipmentName: '',
  inspectionCycleName: '',
  inspectionCycleCd: '',
  recentInspectionDate: '',
  relatedLaws: '',
  regUserId: '',
  chgUserId: '',
  noPlanResultEnrollFlag: 'N',
  checkResultCd: null,
  checkCompleteFlag: null,
  checkDate: ''
})
const tab = ref('resultItemTab')
const tabItems = ref<Array<tabItemsType>>([
  {
    name: 'resultItemTab',
    icon: 'list',
    label: '설비별 점검항목',
    component: shallowRef(defineAsyncComponent(() => import(`./equipmentResultItemTab.vue`)))
  },
  {
    name: 'imprTab',
    icon: 'construction',
    label: '개선관리',
    component: shallowRef(defineAsyncComponent(() => import(`@views/common/ibm/imprTab.vue`)))
  }
])
const grid = ref<gridType>({
  columns: [],
  data: [],
  height: '120px'
})
const chkResultItems = ref<codeMasterType>([])
const title = ref('')
const updateUrl = ref('')
const updateItemUrl = ref('')
const getUrl = ref('')
const completeUrl = ref('')
const isSave = ref(false)
const research = ref({
  impr: '',
  item: ''
})
const table = ref<any>(null)
const row = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

const tabHeight = computed(() =>
  !isNaN(props.contentHeight) && props.contentHeight > 400
    ? props.contentHeight - 260 + 'px'
    : '400px'
)
const disabled = computed(() => {
  let count = 0
  _.forEach(grid.value.data, (_item: any) => {
    if (_item.disable) count++
  })
  return count === grid.value.data.length
})
const isOld = computed(() => {
  return Boolean(props.popupParam.minEquipmentCheckId)
})
const isMultiple = computed(() => {
  return props.popupParam.selectData.length > 0
})

const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.minEquipmentCheckId, //
    ibmTaskTypeCd: 'ITT0000055',
    ibmTaskUnderTypeCd: 'ITTU000080',
    requestContents: result.value.equipmentName,
    disabled: disabled.value,
    isOld: isOld.value,
    gridItem: {
      listUrl: selectConfig.sop.min.equipment.result.list.url,
      param: {
        minEquipmentCheckId: props.popupParam.minEquipmentCheckId
      },
      title: $language('점검결과별 개선사항 목록'),
      merge: [{ index: 0, colName: 'checkItemName' }],
      columns: [
        {
          name: 'checkItemName',
          field: 'checkItemName',
          label: '점검항목',
          align: 'center',
          style: 'width:180px',
          sortable: false,
          fix: true
        },
        {
          name: 'checkWayName',
          field: 'checkWayName',
          label: '검사방법',
          align: 'center',
          style: 'width:120px'
        },
        {
          name: 'decisionBasis',
          field: 'decisionBasis',
          label: '판정기준',
          align: 'left',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'checkCaution',
          field: 'checkCaution',
          label: '점검시 안전사항',
          align: 'left',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'checkResult',
          field: 'checkResult',
          label: '점검결과',
          align: 'left',
          style: 'width:180px',
          sortable: false
        },
        {
          name: 'judgmentResultTypeName',
          field: 'judgmentResultTypeName',
          label: '적합/부적합',
          align: 'center',
          style: 'width:80px',
          sortable: false,
          fix: true
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
watch(
  () => research.value.item,
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
  getUrl.value = selectConfig.sop.min.equipment.plan.get.url
  updateUrl.value = transactionConfig.sop.min.equipment.result.updates.url
  updateItemUrl.value = transactionConfig.sop.min.equipment.result.updateItem.url
  completeUrl.value = transactionConfig.sop.min.equipment.result.completes.url
  // code setting
  title.value = props.popupParam.title
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 설비 법정점검 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.selectData.length > 0) {
    grid.value.data = []
    // props.popupParam.selectData.sort(function (a: any, b: any) {
    //   return (
    //     Number(a.equipmentTypeCd.match(/(\d+)/g)[0]) - Number(b.equipmentTypeCd.match(/(\d+)/g)[0])
    //   )
    // })
    _.forEach(props.popupParam.selectData, (_item: any) => {
      $http({
        url: $format(getUrl.value, _item.minEquipmentCheckId),
        method: 'GET'
      }).then((_result: any) => {
        grid.value.data.push(_result.data)
        setHeader()
        rowClick(grid.value.data[0], 'temp')
      })
    })
  } else {
    if (props.popupParam.minEquipmentCheckId) {
      grid.value.data = []
      $http({
        url: $format(getUrl.value, props.popupParam.minEquipmentCheckId),
        method: 'GET'
      }).then((_result: any) => {
        grid.value.data.push(_result.data)
        setHeader()
        rowClick(grid.value.data[0], 'temp')
      })
    }
  }
}
/******************************
 * TODO (목적): 설비 법정점검 테이블 헤더
 *******************************/
function setHeader() {
  if (props.popupParam.selectData.length > 0) {
    getComboItems('MIM_CHECK_RESULT_CD').then((_result) => {
      chkResultItems.value = _result
      grid.value.columns = [
        {
          name: 'equipmentTypeName',
          field: 'equipmentTypeName',
          label: '설비유형',
          style: 'width:100px',
          align: 'center',
          sortable: false
        },
        {
          name: 'equipmentCd',
          field: 'equipmentCd',
          label: '설비코드',
          style: 'width:100px',
          align: 'center',
          sortable: false
        },
        {
          name: 'equipmentName',
          field: 'equipmentName',
          label: '설비명',
          style: 'width:120px',
          align: 'center',
          sortable: false
        },
        {
          name: 'equipmentCheckKindNm',
          field: 'equipmentCheckKindNm',
          label: '점검유형',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'sopMocName',
          field: 'sopMocName',
          label: 'MOC번호',
          align: 'center',
          style: 'width:180px',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'checkScheduleUserName',
          field: 'checkScheduleUserName',
          label: '점검예정자',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'checkScheduleDate',
          field: 'checkScheduleDate',
          label: '점검예정일',
          style: 'width:100px',
          align: 'center',
          sortable: false
        },
        {
          name: 'checkUserName',
          field: 'checkUserName',
          label: '실제점검자',
          align: 'center',
          style: 'width:100px',
          setHeader: true,
          required: true,
          type: 'user',
          userId: 'checkUserId',
          sortable: false
        },
        {
          name: 'checkDate',
          field: 'checkDate',
          required: true,
          setHeader: true,
          label: '실제점검일',
          style: 'width:100px',
          type: 'date',
          align: 'center',
          sortable: false
        },
        {
          name: 'checkResultCd',
          field: 'checkResultCd',
          label: '점검결과',
          required: true,
          align: 'center',
          style: 'width:80px',
          type: 'select',
          setHeader: true,
          comboItems: _result,
          sortable: false
        },
        {
          name: 'checkResultSummary',
          field: 'checkResultSummary',
          label: '점검결과 요약',
          style: 'width:180px',
          type: 'textarea',
          align: 'left',
          sortable: true
        },
        {
          name: 'complete',
          field: 'complete',
          label: '점검완료',
          align: 'center',
          style: 'width:50px',
          sortable: false,
          type: 'custom'
        }
      ]
    })
    grid.value.height = '400px'
  } else {
    getComboItems('MIM_CHECK_RESULT_CD').then((_result) => {
      chkResultItems.value = _result
      grid.value.columns = [
        {
          name: 'equipmentTypeName',
          field: 'equipmentTypeName',
          label: '설비유형',
          style: 'width:100px',
          align: 'center',
          sortable: false
        },
        {
          name: 'equipmentCd',
          field: 'equipmentCd',
          label: '설비코드',
          style: 'width:100px',
          align: 'center',
          sortable: false
        },
        {
          name: 'equipmentName',
          field: 'equipmentName',
          label: '설비명',
          style: 'width:120px',
          align: 'center',
          sortable: false
        },
        {
          name: 'equipmentCheckKindNm',
          field: 'equipmentCheckKindNm',
          label: '점검유형',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'sopMocName',
          field: 'sopMocName',
          label: 'MOC',
          align: 'center',
          style: 'width:180px',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'checkScheduleUserName',
          field: 'checkScheduleUserName',
          label: '점검예정자',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'checkScheduleDate',
          field: 'checkScheduleDate',
          label: '점검예정일',
          style: 'width:100px',
          align: 'center',
          sortable: false
        },
        {
          name: 'checkUserName',
          field: 'checkUserName',
          label: '실제점검자',
          align: 'center',
          style: 'width:100px',
          required: true,
          setHeader: true,
          type: 'user',
          userId: 'checkUserId',
          sortable: false
        },
        {
          name: 'checkDate',
          field: 'checkDate',
          required: true,
          label: '실제점검일',
          style: 'width:100px',
          type: 'date',
          align: 'center',
          sortable: false
        },
        {
          name: 'checkResultCd',
          field: 'checkResultCd',
          label: '점검결과',
          required: true,
          align: 'center',
          style: 'width:80px',
          type: 'select',
          setHeader: true,
          comboItems: _result,
          sortable: false
        },
        {
          name: 'checkResultSummary',
          field: 'checkResultSummary',
          label: '점검결과 요약',
          style: 'width:180px',
          type: 'textarea',
          align: 'left',
          sortable: true
        }
      ]
    })
    grid.value.height = '200px'
  }
}
/******************************
 * TODO (목적): 설비 법정점검 클릭
 *******************************/
function rowClick(row: any, col: any) {
  if (col.name === 'sopMocName') linkClick(row)
  else result.value = row
}
/******************************
 * TODO (목적): 설비 법정점검 moc 조회
 *******************************/
function linkClick(_row: any) {
  row.value = _row
  popupOptions.value = getPopupOptions('moc', popupOptions.value, closeMocPopup, {
    /** 원하는 parameter 정의 */
    type: 'single'
  })
}
/******************************
 * TODO (목적): 설비 법정점검 MOC 팝업 닫기 콜백
 *******************************/
function closeMocPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    row.value.sopMocName = data[0].mocTypeName + ' / ' + data[0].mocNo
    row.value.sopMocId = data[0].sopMocId
    if (row.value.editFlag !== 'C') {
      row.value.editFlag = 'U'
      row.value.chgUserId = user.value.userId
    }
  }
}
/******************************
 * TODO (목적): 설비 법정점검 저장
 *******************************/
function saveInspection() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 설비 법정점검 저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
  _.forEach(result.value.equipmentResultList, (_item) => {
    _item.editFlag = 'U'
  })
}
/******************************
 * TODO (목적): 설비 법정점검 선택완료
 *******************************/
function resultComplete() {
  const selectData = table.value.getSelected()
  if (selectData && selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning'
    })
    return
  }
  if (validTable(grid.value.columns, selectData)) {
    message.confirm({
      title: '확인',
      message: '점검완료 하시겠습니까?(저장과 함께 완료처리가 됩니다.)',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(selectData, (_item) => {
          _item.checkCompleteFlag = 'Y'
        })
        $http({
          url: completeUrl.value,
          method: 'PUT',
          data: selectData
        }).then(() => {
          _.forEach(selectData, (_item) => {
            _item.checkStatusCd = 'MCSC000015'
            _item.disable = true
          })
          table.value.setSelected([])
          message.requestSuccess()
          grid.value.data = []
          getDetail()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 설비 법정점검 일괄완료
 *******************************/
function resultComplete2() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '점검완료 하시겠습니까? (저장과 함께 완료처리가 됩니다.)',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (_item) => {
          _item.checkCompleteFlag = 'Y'
        })
        $http({
          url: completeUrl.value,
          method: 'PUT',
          data: grid.value.data
        }).then(() => {
          message.requestSuccess()
          grid.value.data = []
          getDetail()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 설비 법정점검 단일 완료
 *******************************/
function resultComplete3(_data: any) {
  rowClick(_data, 'temp')
  if (!_data.checkUserId || !_data.checkResultCd || !_data.checkDate) {
    message.alert({
      title: '안내',
      message: '필수 입력값을 입력해 주세요. [실제점검자, 실제점검일, 점검결과]',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  message.confirm({
    title: '확인',
    message: '점검완료 하시겠습니까? (저장과 함께 완료처리가 됩니다.)',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      _data.checkCompleteFlag = 'Y'
      $http({
        url: transactionConfig.sop.min.equipment.result.complete.url,
        method: 'PUT',
        data: _data
      }).then(() => {
        _data.disable = true
        _data.checkStatusCd = 'MCSC000015'
        table.value.setSelected([])
        message.requestSuccess()
      })
    },
    cancelCallback: () => {}
  })
}
function tabClick() {
  research.value.impr = uid()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
