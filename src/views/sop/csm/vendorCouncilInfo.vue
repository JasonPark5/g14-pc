<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="협력사 협의체 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="tabParam.councilId && editable"
                  label="삭제"
                  :editable="editable"
                  icon="delete_forever"
                  @btnClicked="removeData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="tabParam"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  required
                  :editable="editable"
                  label="제목"
                  name="councilTitle"
                  v-model:value="tabParam.councilTitle"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-datepicker
                  required
                  :editable="editable"
                  label="일자"
                  name="councilDate"
                  v-model:value="tabParam.councilDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  required
                  type="edit"
                  codeGroupCd="COUNCIL_TYPE_CD"
                  itemText="codeName"
                  itemValue="code"
                  name="councilTypeCd"
                  label="구분"
                  v-model:value="tabParam.councilTypeCd"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  required
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="tabParam.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="내용"
                  name="councilContents"
                  v-model:value="tabParam.councilContents"
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
              :data="tabParam.attendeeInModels"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              :hideBottom="true"
              :editable="editable"
              :checkClickFlag="false"
              :isExcelDown="false"
              rowKey="councilAttendeeId"
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
                    v-if="editable && tabParam.attendeeInModels!.length > 0"
                    :showLoading="false"
                    label="제외"
                    icon="remove"
                    @btnClicked="removeInAttendee"
                  />
                </q-btn-group>
              </template>
            </c-table>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-card title="협의체 관련 첨부파일" class="cardClassDetailForm">
              <template v-slot:card-detail>
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <c-upload
                    :attachInfo="attachInfo"
                    :editable="editable"
                    label="협의체 관련 첨부파일"
                  />
                </div>
              </template>
            </c-card>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-table
              ref="vendorTable"
              title="대상 협력업체"
              :columns="outVendorGrid.columns"
              gridHeight="250px"
              :data="tabParam.coucilVendorModels"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              :hideBottom="true"
              :checkClickFlag="false"
              :isExcelDown="false"
              :editable="editable"
              rowKey="vendorCd"
              selection="multiple"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable"
                    :showLoading="false"
                    label="추가"
                    icon="add"
                    @btnClicked="addVendor"
                  />
                  <c-btn
                    v-if="editable && tabParam.coucilVendorModels!.length > 0"
                    :showLoading="false"
                    label="제외"
                    icon="remove"
                    @btnClicked="removeVendor"
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
              :data="tabParam.attendeeOutModels"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              :hideBottom="true"
              :checkClickFlag="false"
              :isExcelDown="false"
              :editable="editable"
              rowKey="councilAttendeeId"
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
                    v-if="editable && tabParam.attendeeOutModels!.length > 0"
                    :showLoading="false"
                    label="제외"
                    icon="remove"
                    @btnClicked="removeOutAttendee"
                  />
                </q-btn-group>
              </template>
            </c-table>
          </div>
        </div>
      </div>
      <c-dialog :param="popupOptions" />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { vendorCoucilType } from './vendorCoucil'

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
  name: 'vendorCouncilInfo'
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
const emits = defineEmits(['closePopup', 'changeStatus'])

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
  tabParam: vendorCoucilType
  attachInfo: attachSettingType
  contentHeight: stringNull
}
/******************************
 * @inject_선언
 *******************************/
/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  tabParam: () => {
    return {
      councilId: '',
      plantCd: '',
      councilDate: '',
      councilContents: '',
      councilTypeCd: null,
      councilTitle: '',
      regUserId: '',
      chgUserId: '',

      attendeeInModels: [],
      attendeeOutModels: [],
      coucilVendorModels: [],
      deletecoucilVendorModels: [],
      deleteAttendeeInModels: [],
      deleteAttendeeOutModels: [],
      improveList: [],

      imprImmData: '',
      imprData: ''
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'SOP_COUNCIL',
      taskKey: ''
    }
  },
  contentHeight: null
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
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const saveUrl = ref('')
const mappingType = ref('POST')
const isSave = ref(false)
const isdelete = ref(false)
const inGrid = ref<any>({
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
      align: 'left',
      style: 'width: 200px'
    }
  ],
  data: []
})
const outVendorGrid = ref<any>({
  columns: [
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '협력업체',
      align: 'center'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      type: 'textarea',
      align: 'left',
      style: 'width: 60%'
    }
  ],
  data: []
})
const outGrid = ref<any>({
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
      align: 'left',
      style: 'width: 200px'
    }
  ],
  data: []
})
const saveCallData = ref('')
const editForm = ref<any>(null)
const inTable = ref<any>(null)
const outTable = ref<any>(null)
const vendorTable = ref<any>(null)
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
  insertUrl.value = transactionConfig.mdm.cim.vendor.council.insert.url
  saveUrl.value = transactionConfig.mdm.cim.vendor.council.insert.url
  updateUrl.value = transactionConfig.mdm.cim.vendor.council.update.url
  deleteUrl.value = transactionConfig.mdm.cim.vendor.council.delete.url
  // code setting
  // list setting
}
function saveData() {
  if (props.tabParam.councilId) {
    saveUrl.value = updateUrl.value
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (validTable(outGrid.value.columns, props.tabParam.attendeeOutModels)) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',

          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            props.tabParam.regUserId = user.value.userId
            props.tabParam.chgUserId = user.value.userId

            isSave.value = !isSave.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
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
        url: $format(deleteUrl.value, props.tabParam.councilId),
        method: 'DELETE'
      }).then((_result: any) => {
        isdelete.value = !isdelete.value
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
  props.tabParam.councilId = result.data
  props.attachInfo.value.taskKey = props.tabParam.councilId
  props.attachInfo.value.isSubmit = uid()
  saveCallData.value = uid()
  emits('changeStatus', result.data)
}
function addInAttendee() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(props.tabParam.attendeeInModels, {
        attendeeUserId: _item.userId
      })
      if (index === -1) {
        props.tabParam.attendeeInModels!.splice(0, 0, {
          councilId: props.tabParam.councilId,
          councilAttendeeId: uid(),
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
      if (!props.tabParam.deleteAttendeeInModels) {
        props.tabParam.deleteAttendeeInModels = []
      }
      if (
        _.findIndex(props.tabParam.deleteAttendeeInModels, {
          councilAttendeeId: item.councilAttendeeId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.tabParam.deleteAttendeeInModels.push(item)
      }
      props.tabParam.attendeeInModels = _.reject(props.tabParam.attendeeInModels, item)
    })
  }
}
function addOutAttendee() {
  props.tabParam.attendeeOutModels!.splice(0, 0, {
    councilId: props.tabParam.councilId,
    councilAttendeeId: uid(),
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
      if (!props.tabParam.deleteAttendeeOutModels) {
        props.tabParam.deleteAttendeeOutModels = []
      }
      if (
        _.findIndex(props.tabParam.deleteAttendeeOutModels, {
          councilAttendeeId: item.councilAttendeeId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.tabParam.deleteAttendeeOutModels.push(item)
      }
      props.tabParam.attendeeOutModels = _.reject(props.tabParam.attendeeOutModels, item)
    })
  }
}
function addVendor() {
  popupOptions.value = getPopupOptions('vendor', popupOptions.value, closeVendorPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeVendorPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(props.tabParam.coucilVendorModels, {
        vendorCd: _item.vendorCd
      })
      if (index === -1) {
        props.tabParam.coucilVendorModels!.push({
          councilId: props.tabParam.councilId ? props.tabParam.councilId : uid(),
          vendorCd: _item.vendorCd,
          vendorName: _item.vendorName,
          remark: '',
          chgUserId: user.value.userId,
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
function removeVendor() {
  const selectData = vendorTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.tabParam.deletecoucilVendorModels) {
        props.tabParam.deletecoucilVendorModels = []
      }
      if (
        _.findIndex(props.tabParam.deletecoucilVendorModels, { vendorCd: item.vendorCd }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.tabParam.deletecoucilVendorModels.push(item)
      }
      props.tabParam.coucilVendorModels = _.reject(props.tabParam.coucilVendorModels, item)
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
