<template>
  <q-form ref="editForm">
    <c-card title="점검설비 상세" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editInfo && preStartupCheck.sopPrestartupCheckId && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="preStartupEquipment"
            :mappingType="mappingType"
            label="저장"
            icon="check"
            @beforeAction="savePreStartupEquipment"
            @btnCallback="saveCallback"
          />
          <c-btn
            v-show="editInfo && preStartupCheck.sopPrestartupCheckId && !disabled"
            :isSubmit="isComplete"
            :url="completeUrl"
            :param="preStartupEquipment"
            mappingType="PUT"
            label="완료"
            icon="check"
            @beforeAction="completePreStartupEquipment"
            @btnCallback="completeCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2">
          <c-text
            :editable="editInfo"
            :disabled="true"
            label="설비유형"
            name="equipmentTypeName"
            v-model:value="preStartupEquipment.equipmentTypeName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-multi-select
            :editable="editInfo"
            :disabled="disabled"
            :isObject="true"
            :disabledItems="disabledItems"
            codeGroupCd="PSR_CHECK_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            valueText="psrCheckTypeName"
            valueKey="psrCheckTypeCd"
            label="점검유형"
            name="checkTypes"
            v-model:value="preStartupEquipment.checkTypes"
            @datachange="changeCheckType"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2">
          <c-field
            :editable="editInfo"
            :disabled="disabled"
            type="user"
            label="설비점검책임자"
            name="checkUserId"
            v-model:value="preStartupEquipment.checkUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2">
          <c-datepicker
            :editable="editInfo"
            :disabled="disabled"
            label="점검예정일"
            name="checkScheduleDate"
            v-model:value="preStartupEquipment.checkScheduleDate"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2">
          <c-datepicker
            :editable="editInfo"
            :disabled="disabled"
            label="점검일"
            name="checkDate"
            v-model:value="preStartupEquipment.checkDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-textarea
            :editable="editInfo"
            :disabled="disabled"
            label="점검결과종합"
            name="checkResultTotal"
            v-model:value="preStartupEquipment.checkResultTotal"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="table"
      title="점검결과 목록"
      :columns="grid.columns"
      gridHeightAuto
      :data="preStartupEquipment.checkItems"
      :merge="grid.merge"
      :filtering="false"
      :columnSetting="false"
      :editable="editInfo && !disabled"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="editInfo && !disabled"
            :isImmShow="true"
            :requestContentsCols="['equipmentName', 'psrCheckTypeName', 'level1', 'level2']"
            tableKey="sopPrestartupEquipmentHasCheckItemId"
            ibmTaskTypeCd="ITT0000030"
            ibmTaskUnderTypeCd="ITTU000050"
            @imprChange="imprChange"
          />
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </q-form>
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
import { preStartupCheckType, equipmentsType } from './preStartupReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'preStartupFacility'
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
  param: {
    sopPrestartupCheckId: stringNull
    psrCheckStatusCd: stringNull
    isSearch: boolean
  }
  research: {
    impr: stringNull
    item: stringNull
  }
  preStartupCheck: preStartupCheckType
  equipmentCd: stringNull
  contentHeight: stringNull
}
interface gridType {
  merge: tableMergeType
  columns: tableColumnType
  data: Array<preStartupCheckType>
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
  param: () => {
    return {
      sopPrestartupCheckId: '',
      psrCheckStatusCd: '',
      isSearch: false
    }
  },
  research: () => {
    return {
      impr: '',
      item: ''
    }
  },
  preStartupCheck: () => {
    return {
      plantCd: null,
      sopPrestartupCheckId: '',
      equipments: [],
      deleteEquipments: []
    }
  },
  equipmentCd: '',
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
const table = ref<any>(null)
const editForm = ref<any>(null)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const preStartupEquipment = ref<equipmentsType>({
  sopPrestartupCheckId: '', // 가동전점검 일련 번호
  equipmentCd: '', // 설비코드
  equipmentName: '', // 설비명
  equipmentTypeCd: '', // 설비 분류(상하위구조)
  equipmentTypeName: '', // 설비 분류명(상하위구조)
  checkUserId: '', // 점검 책임자
  checkScheduleDate: '', // 점검 예정일
  checkDate: '', // 점검일
  checkResultTotal: '', // 점검 결과 종합
  checkCompleteFlag: 'N', // 점검 완료 여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  checkTypes: [], // 점검유형
  checkItems: [], // 점검항목
  deleteCheckItems: []
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'psrCheckTypeName' },
    { index: 1, colName: 'level1' },
    { index: 2, colName: 'level2' }
  ],
  columns: [
    {
      name: 'psrCheckTypeName',
      field: 'psrCheckTypeName',
      label: '점검유형',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목',
      sortable: false,
      child: [
        {
          name: 'level1',
          field: 'level1',
          label: '대분류',
          align: 'left',
          style: 'width:140px',
          sortable: false
        },
        {
          name: 'level2',
          field: 'level2',
          label: '중분류',
          align: 'left',
          style: 'width:600px',
          sortable: false
        }
        // {
        //   name: 'level3',
        //   field: 'level3',
        //   label: '소분류',
        //   align: 'left',
        //   style: 'width:200px',
        //   sortable: false
        // }
      ]
    },
    {
      name: 'judgmentResultFlag',
      field: 'judgmentResultFlag',
      label: '적합여부',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      type: 'select',
      comboItems: [
        { code: 'Y', codeName: $language('적합') },
        { code: 'N', codeName: $language('부적합') },
        { code: 'D', codeName: '해당없음' }
      ],
      setHeader: true
    },
    {
      name: 'checkResult',
      field: 'checkResult',
      label: '점검결과',
      align: 'left',
      style: 'width:180px',
      sortable: false,
      type: 'text'
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선번호 / 진행상태',
      align: 'center',
      style: 'width:220px',
      type: 'custom',
      sortable: false
    }
  ],
  data: [],
  height: '450px'
})
const listUrl = ref('')
const completeUrl = ref('')
const isSave = ref(false)
const isComplete = ref(false)
const mappingType = ref('POST')
const saveUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const editInfo = computed(() => {
  return editable.value && !props.param.isSearch
})
const disabled = computed(() => {
  // 점검완료인 경우 비활성화
  return (
    preStartupEquipment.value.checkCompleteFlag === 'Y' ||
    props.preStartupCheck.psrCheckStatusCd === 'PCSC000005'
  )
})
const disabledItems = computed(() => {
  const result = [] as any
  const disabledSteps = ['IS00000005', 'IS00000010', 'IS00000015', 'IS00000020']
  if (
    preStartupEquipment.value &&
    preStartupEquipment.value.checkItems &&
    preStartupEquipment.value.checkItems.length > 0
  ) {
    _.forEach(preStartupEquipment.value.checkItems, (checkItem) => {
      if (checkItem.improves && checkItem.improves.length > 0) {
        _.forEach(checkItem.improves, (improve) => {
          if (_.indexOf(disabledSteps, improve.ibmStepCd) > -1) {
            result.push(checkItem.psrCheckTypeCd)
            return false
          }
        })
      }
    })
  }
  return result
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.preStartupCheck,
  () => {
    preStartupEquipment.value = _.find(props.preStartupCheck.equipments, {
      equipmentCd: props.equipmentCd
    }) as equipmentsType
    table.value.compoTable.resetVirtualScroll()
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
  listUrl.value = selectConfig.sop.psr.check.checkTypeItemList.url
  saveUrl.value = transactionConfig.sop.psr.check.equipment.update.url
  completeUrl.value = transactionConfig.sop.psr.check.equipment.complete.url
  // code setting
  // list setting
  preStartupEquipment.value = _.find(props.preStartupCheck.equipments, {
    equipmentCd: props.equipmentCd
  }) as equipmentsType
}
function changeCheckType(val: any) {
  if (!val || val.length === 0) {
    _.forEach(preStartupEquipment.value.checkItems, (deleteItem: any) => {
      if (
        _.findIndex(preStartupEquipment.value.deleteCheckItems, {
          sopPrestartupCheckItemId: deleteItem.sopPrestartupCheckItemId
        }) === -1 &&
        deleteItem.editFlag !== 'C'
      ) {
        preStartupEquipment.value.deleteCheckItems.push(deleteItem)
      }
    })
    preStartupEquipment.value.checkItems = []
  } else {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        plantCd: props.preStartupCheck.plantCd,
        checkTypes: _.map(val, 'value')
      }
    }).then((_result: any) => {
      if (_result.data && _result.data.length > 0) {
        if (
          preStartupEquipment.value.checkItems &&
          preStartupEquipment.value.checkItems.length > 0
        ) {
          _.forEach(_result.data, (item: any) => {
            if (
              _.findIndex(preStartupEquipment.value.checkItems, {
                sopPrestartupCheckItemId: item.sopPrestartupCheckItemId
              }) === -1
            ) {
              item.editFlag = 'C'
              preStartupEquipment.value.checkItems.push(item)
            }
          })

          const deleteItems = [] as any
          _.forEach(preStartupEquipment.value.checkItems, (item: any) => {
            if (
              _.findIndex(_result.data, {
                sopPrestartupCheckItemId: item.sopPrestartupCheckItemId
              }) === -1
            ) {
              deleteItems.push(item)
            }
          })
          if (deleteItems && deleteItems.length > 0) {
            if (!preStartupEquipment.value.deleteCheckItems)
              preStartupEquipment.value.deleteCheckItems = []
            _.forEach(deleteItems, (deleteItem: any) => {
              preStartupEquipment.value.checkItems = _.reject(
                preStartupEquipment.value.checkItems,
                { sopPrestartupCheckItemId: deleteItem.sopPrestartupCheckItemId }
              )

              if (
                _.findIndex(preStartupEquipment.value.deleteCheckItems, {
                  sopPrestartupCheckItemId: deleteItem.sopPrestartupCheckItemId
                }) === -1 &&
                deleteItem.editFlag !== 'C'
              ) {
                preStartupEquipment.value.deleteCheckItems.push(deleteItem)
              }
            })
          }
        } else {
          _.forEach(_result.data, (item: any) => {
            item.editFlag = 'C'
          })
          preStartupEquipment.value.checkItems = _result.data
        }
      } else {
        preStartupEquipment.value.checkItems = []
      }
    })
  }
}
function completePreStartupEquipment() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (preStartupEquipment.value.checkItems.length > 0) {
        message.confirm({
          title: '확인',
          message: '완료하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            preStartupEquipment.value.chgUserId = user.value.userId
            isComplete.value = !isComplete.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else {
        message.alert({
          title: '안내',
          message: '점검결과 항목이 없습니다.',
          type: 'warning' // success / info / warning / error
        })
      }
    } else {
      message.validError()
    }
  })
}
function completeCallback() {
  preStartupEquipment.value.checkCompleteFlag = 'Y'
  message.requestSuccess()
}
function savePreStartupEquipment() {
  if (preStartupEquipment.value.sopPrestartupCheckId) mappingType.value = 'PUT'
  else {
    mappingType.value = 'POST'
    preStartupEquipment.value.sopPrestartupCheckId = props.param.sopPrestartupCheckId
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          preStartupEquipment.value.regUserId = user.value.userId
          preStartupEquipment.value.chgUserId = user.value.userId
          // if (props.preStartupCheck.equipments && props.preStartupCheck.equipments.length > 0) {
          //   props.preStartupCheck.equipments = _.filter(props.preStartupCheck.equipments, null)
          // }
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback() {
  message.requestSuccess()
}
// 개선창 닫기 후
function imprChange() {
  props.research.impr = uid()
  table.value.compoTable.resetVirtualScroll()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
