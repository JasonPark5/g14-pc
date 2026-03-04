<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="산업안전보건위원회 회의록 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="popupParam.proceedingsId && editable"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="removeData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="proceeding"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  required
                  :editable="editable"
                  label="회의제목"
                  name="proceedingsTitle"
                  v-model:value="proceeding.proceedingsTitle"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-datepicker
                  required
                  :editable="editable"
                  label="회의일"
                  name="proceedingsDate"
                  v-model:value="proceeding.proceedingsDate"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  required
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="proceeding.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  :editable="editable"
                  :rows="4"
                  label="회의내용"
                  name="proceedingsContents"
                  v-model:value="proceeding.proceedingsContents"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-table
              ref="inTable"
              title="내부참석자 목록"
              :columns="inGrid.columns"
              gridHeight="250px"
              :data="proceeding.attendeeInModels"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              noDataLabel="내부참석자를 추가하세요."
              :hideBottom="true"
              :editable="editable"
              :checkClickFlag="false"
              :isExcelDown="false"
              rowKey="proceedingsAttendeeId"
              selection="multiple"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable"
                    :showLoading="false"
                    label="추가"
                    icon="add"
                    @btnClicked="addInAttendee"
                  />
                  <c-btn
                    v-if="editable && proceeding.attendeeInModels.length > 0"
                    :showLoading="false"
                    label="삭제"
                    icon="remove"
                    @btnClicked="removeInAttendee"
                  />
                </q-btn-group>
              </template>
            </c-table>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-table
              ref="outTable"
              title="외부참석자 목록"
              :columns="outGrid.columns"
              gridHeight="250px"
              :data="proceeding.attendeeOutModels"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              noDataLabel="외부참석자를 추가하세요."
              :hideBottom="true"
              :checkClickFlag="false"
              :isExcelDown="false"
              :editable="editable"
              rowKey="proceedingsAttendeeId"
              selection="multiple"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable"
                    :showLoading="false"
                    label="추가"
                    icon="add"
                    @btnClicked="addOutAttendee"
                  />
                  <c-btn
                    v-if="editable && proceeding.attendeeOutModels.length > 0"
                    :showLoading="false"
                    label="삭제"
                    icon="remove"
                    @btnClicked="removeOutAttendee"
                  />
                </q-btn-group>
              </template>
            </c-table>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="관련 회의록" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-sm-12 col-md-12 col-lg-12" style="height: 460px">
                <c-upload :attachInfo="attachInfo" :editable="editable" label="관련 회의록" />
              </div>
            </template>
          </c-card>
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
import { proceedingsAttendeeType, proceedingsType } from './proceedings'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'proceedingsInfo'
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
    proceedingsId: stringNull
  }
  proceeding: proceedingsType
  attachInfo: attachSettingType
  isOld: boolean
}
interface gridType {
  columns: tableColumnType
  data: Array<proceedingsAttendeeType>
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
      proceedingsId: ''
    }
  },
  proceeding: () => {
    return {
      proceedingsId: '',
      plantCd: '',
      proceedingsDate: '',
      proceedingsContents: '',
      proceedingsTitle: '',
      regUserId: '',
      chgUserId: '',
      attendeeInModels: [],
      attendeeOutModels: [],
      deleteAttendeeInModels: [],
      deleteAttendeeOutModels: [],
      imprs: [],
      imprImms: []
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'OSH_PROCEEDINGS',
      taskKey: ''
    }
  },
  isOld: false
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
const inGrid = ref<gridType>({
  columns: [
    {
      name: 'attendeeDeptName',
      field: 'attendeeDeptName',
      label: '부서',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    },
    {
      name: 'attendeeUserName',
      field: 'attendeeUserName',
      label: '이름',
      style: 'width: 80px',
      align: 'center'
    },
    {
      name: 'attendeeJobName',
      field: 'attendeeJobName',
      label: '직책',
      style: 'width: 80px',
      align: 'center'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      type: 'textarea',
      align: 'center',
      style: 'width: 200px'
    }
  ],
  data: []
})
const outGrid = ref<gridType>({
  columns: [
    {
      name: 'attendeeBelong',
      field: 'attendeeBelong',
      label: '소속',
      type: 'text',
      align: 'center',
      style: 'width: 80px',
      required: true
    },
    {
      name: 'attendeeUserName',
      field: 'attendeeUserName',
      label: '이름',
      style: 'width: 80px',
      type: 'text',
      required: true,
      align: 'center'
    },
    {
      name: 'attendeeJobName',
      field: 'attendeeJobName',
      label: '직책',
      type: 'text',
      style: 'width: 80px',
      align: 'center'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      type: 'textarea',
      align: 'center',
      style: 'width: 200px'
    }
  ],
  data: []
})
const mappingType = ref('POST')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const editForm = ref<any>(null)
const inTable = ref<any>(null)
const outTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

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
  saveUrl.value = transactionConfig.sai.osh.proceedings.insert.url
  deleteUrl.value = transactionConfig.sai.osh.proceedings.delete.url
  // code setting
  // list setting
}
function addInAttendee() {
  popupOptions.value.title = '내부참석자 검색'
  popupOptions.value.width = '60%'
  popupOptions.value.isFull = false
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    type: 'multiple'
  })
}
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      if (
        _.findIndex(props.proceeding.attendeeInModels, {
          attendeeUserId: _item.userId
        }) === -1
      ) {
        props.proceeding.attendeeInModels.splice(0, 0, {
          proceedingsId: props.popupParam.proceedingsId,
          proceedingsAttendeeId: uid(),
          attendeeType: '1',
          attendeeUserId: _item.userId,
          attendeeUserName: _item.userName,
          attendeeDeptName: _item.deptName,
          attendeeJobName: _item.jobName,
          remark: '',
          chgUserId: user.value.userId,
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
function removeInAttendee() {
  const selectData = inTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.proceeding.deleteAttendeeInModels) {
        props.proceeding.deleteAttendeeInModels = []
      }
      if (
        _.findIndex(props.proceeding.deleteAttendeeInModels, {
          proceedingsAttendeeId: item.proceedingsAttendeeId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.proceeding.deleteAttendeeInModels.push(item)
      }
      props.proceeding.attendeeInModels = _.reject(props.proceeding.attendeeInModels, item)
    })
  }
}
function addOutAttendee() {
  props.proceeding.attendeeOutModels.splice(0, 0, {
    proceedingsId: props.popupParam.proceedingsId,
    proceedingsAttendeeId: uid(),
    attendeeType: '2',
    attendeeUserId: '',
    attendeeUserName: '',
    attendeeJobName: '',
    remark: '',
    attendeeBelong: '',
    chgUserId: user.value.userId,
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
function removeOutAttendee() {
  const selectData = outTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.proceeding.deleteAttendeeOutModels) {
        props.proceeding.deleteAttendeeOutModels = []
      }
      if (
        _.findIndex(props.proceeding.deleteAttendeeOutModels, {
          proceedingsAttendeeId: item.proceedingsAttendeeId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.proceeding.deleteAttendeeOutModels.push(item)
      }
      props.proceeding.attendeeOutModels = _.reject(props.proceeding.attendeeOutModels, item)
    })
  }
}
function saveData() {
  if (props.isOld) {
    saveUrl.value = transactionConfig.sai.osh.proceedings.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sai.osh.proceedings.insert.url
    mappingType.value = 'POST'
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (
      _result &&
      validTable(outGrid.value.columns, props.proceeding.attendeeOutModels, '', true)
    ) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.proceeding.regUserId = user.value.userId
          props.proceeding.chgUserId = user.value.userId

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
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.proceedingsId),
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
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.proceedingsId = result.data.proceedingsId
  props.attachInfo.taskKey = props.popupParam.proceedingsId
  props.attachInfo.isSubmit = uid()
  emits('getDetail')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
