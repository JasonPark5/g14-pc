<template>
  <q-form ref="editForm">
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="!disabled && isOld && editable"
            :isSubmit="isComplete"
            :url="completeUrl"
            :param="cto"
            mappingType="PUT"
            label="완료"
            icon="check"
            @beforeAction="completeCto"
            @btnCallback="completeCallback"
          />
          <c-btn
            v-show="!disabled && isOld && editable"
            label="삭제"
            icon="delete_forever"
            @btnClicked="remove"
          />
          <c-btn
            v-show="!disabled && editable"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="cto"
            :mappingType="saveType"
            label="저장"
            icon="save"
            @beforeAction="saveCto"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            required
            :readonly="true"
            :editable="editable"
            :afterIcon="
              editable && !disabled
                ? [
                    { name: 'search', click: true, callbackName: 'searchSop', color: 'teal' },
                    { name: 'close', click: true, callbackName: 'removeSop', color: 'red' }
                  ]
                : null
            "
            label="관찰작업 / 공정"
            name="sopProcessName"
            v-model:value="sopProcessName"
            @searchSop="openSop"
            @removeSop="removeSop"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            :editable="editable"
            :disabled="disabled"
            type="date"
            label="관찰일"
            name="ctoDate"
            v-model:value="cto.ctoDate"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            :editable="editable"
            :disabled="disabled"
            type="time"
            :minuteStep="10"
            label="소요시간"
            name="ctoTime"
            v-model:value="cto.ctoTime"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-text
            required
            :editable="editable"
            :disabled="disabled"
            suffix="명"
            type="number"
            label="관찰인원"
            name="observeCount"
            v-model:value="cto.observeCount"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-multi-field
            required
            :editable="editable"
            :disabled="disabled"
            :data="cto"
            label="관찰자"
            type="dept_user"
            name="observeUserId"
            v-model:value="cto.observeUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            :disabled="disabled"
            label="작업구역"
            name="workArea"
            v-model:value="cto.workArea"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            required
            :disabled="disabled || isOld"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="cto.plantCd"
          />
        </div> -->
      </template>
    </c-card>
    <c-card title="총평" class="cardClassDetailForm">
      <template v-slot:card-detail
        ><div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <c-multi-select
            :editable="editable"
            :disabled="disabled"
            :isArray="false"
            codeGroupCd="CTO_WORK_CHARACTER_CD"
            itemText="codeName"
            itemValue="code"
            maxValues="3"
            name="workCharacteristics"
            label="작업특성"
            v-model:value="cto.workCharacteristics"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <c-multi-select
            :editable="editable"
            :disabled="disabled"
            :isArray="false"
            codeGroupCd="CTO_HUMAN_FACTOR_CD"
            itemText="codeName"
            itemValue="code"
            maxValues="3"
            name="humanFactors"
            label="인적요소"
            v-model:value="cto.humanFactors"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <c-multi-select
            :editable="editable"
            :disabled="disabled"
            :isArray="false"
            codeGroupCd="CTO_CORE_ACTION_ITEMS_CD"
            itemText="codeName"
            itemValue="code"
            maxValues="3"
            name="coreActionItems"
            label="핵심행동항목"
            v-model:value="cto.coreActionItems"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            label="우선사항"
            :rows="2"
            name="priorityContents"
            v-model:value="cto.priorityContents"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            label="개선사항"
            :rows="2"
            name="improveContents"
            v-model:value="cto.improveContents"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="activityTable"
      title="핵심행동 목록"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="cto.activityModels"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      noDataLabel="핵심행동을 추가하세요."
      :hideBottom="true"
      :editable="editable && !disabled"
      rowKey="sopCtoActivityId"
      selection="multiple"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addActivity"
          />
          <c-btn
            v-if="editable && !disabled && cto.activityModels.length > 0"
            :showLoading="false"
            label="제외"
            icon="remove"
            @btnClicked="removeActivity"
          />
        </q-btn-group>
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
import { ctoType } from './cto'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'ctoInfo'
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
const emits = defineEmits(['getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopCtoId: stringNull
  }
  cto: ctoType
  isOld: boolean
  disabled: boolean
}
interface gridType {
  columns: tableColumnType
  height: string
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
      sopCtoId: ''
    }
  },
  cto: () => {
    return {
      sopCtoId: '',
      plantCd: '',
      ctoDate: '',
      ctoTime: '',
      observeUserId: '',
      observeCount: '',
      mdmSopId: '',
      workArea: '',
      ctoCompleteFlag: 'N',
      improveContents: '',
      priorityContents: '',
      managerUserId: '',
      sopName: '',
      processName: '',
      regUserId: '',
      chgUserId: '',
      workCharacteristics: '',
      humanFactors: '',
      coreActionItems: '',
      activityModels: [],
      deleteActivityModels: [],
      ctoChecklistModels: [],
      ctoImproveModels: []
    }
  },
  isOld: false,
  disabled: false
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
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'mainActivity',
      field: 'mainActivity',
      label: '핵심행동',
      align: 'left',
      style: 'width:50%',
      type: 'text',
      sortable: false
    },
    {
      name: 'goodBadCd',
      field: 'goodBadCd',
      label: '양호/불량/해당없음',
      type: 'select',
      setHeader: true,
      style: 'width:20%',
      align: 'center',
      codeGroupCd: 'CTO_GOOD_BAD_CD',
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      type: 'textarea',
      style: 'width:30%',
      align: 'center',
      sortable: false
    }
  ],
  height: '320px'
})
const editForm = ref<any>(null)
const saveType = ref('POST')
const completeUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const isComplete = ref(false)
const activityTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const sopProcessName = computed(() => {
  let name = ''
  if (props.cto.mdmSopId) {
    name = `${props.cto.sopName} / ${props.cto.processName}`
  }
  return name
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
  saveUrl.value = transactionConfig.sop.cto.insert.url
  deleteUrl.value = transactionConfig.sop.cto.delete.url
  completeUrl.value = transactionConfig.sop.cto.complete.url
  // code setting
  // list setting
}
function addActivity() {
  props.cto.activityModels.splice(0, 0, {
    sopCtoId: props.popupParam.sopCtoId,
    sopCtoActivityId: uid(),
    goodBadCd: 'CGB0000003',
    mainActivity: '',
    remarks: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
function removeActivity() {
  const selectData = activityTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.cto.deleteActivityModels) props.cto.deleteActivityModels = []
      if (
        _.findIndex(props.cto.deleteActivityModels, {
          sopCtoActivityId: item.sopCtoActivityId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.cto.deleteActivityModels.push(item)
      }
      props.cto.activityModels = _.reject(props.cto.activityModels, item)
    })
  }
}
function openSop() {
  popupOptions.value = getPopupOptions('sop1', popupOptions.value, closeSopPopup, {
    /** 원하는 parameter 정의 */
    type: 'single',
    searchType: '1'
  })
}
function closeSopPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    props.cto.mdmSopId = data[0].mdmSopId
    props.cto.sopName = data[0].sopName
    props.cto.processName = data[0].processName
  }
}
function removeSop() {
  props.cto.mdmSopId = ''
  props.cto.sopName = ''
  props.cto.processName = ''
}
function saveCto() {
  if (props.isOld) {
    saveUrl.value = transactionConfig.sop.cto.update.url
    saveType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.cto.insert.url
    saveType.value = 'POST'
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.cto.regUserId = user.value.userId
          props.cto.chgUserId = user.value.userId

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
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.sopCtoId = result.data
  emits('getDetail')
}
function completeCto() {
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.cto.regUserId = user.value.userId
          props.cto.chgUserId = user.value.userId

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
function completeCallback() {
  message.requestSuccess()
  emits('getDetail')
}
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.sopCtoId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup', 'REMOVE')
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
