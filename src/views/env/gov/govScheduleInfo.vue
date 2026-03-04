<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
          <c-card title="대관업무 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="govSchedule"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-6">
                <c-plant
                  :required="true"
                  :editable="editable && !param.govScheduleMstId"
                  type="edit"
                  name="plantCd"
                  v-model:value="govSchedule.plantCd"
                />
              </div> -->
              <div class="col-6">
                <c-select
                  :required="true"
                  :editable="editable"
                  codeGroupCd="GOV_SCHEDULE_TYPE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="govScheduleTypeCd"
                  label="대관업무 구분"
                  v-model:value="govSchedule.govScheduleTypeCd"
                />
              </div>
              <div class="col-12">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="대관업무명"
                  name="govScheduleName"
                  v-model:value="govSchedule.govScheduleName"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="실시 주기"
                  name="govScheduleCycleTerm"
                  v-model:value="govSchedule.govScheduleCycleTerm"
                />
              </div>
              <div class="col-3">
                <c-select
                  :required="true"
                  :editable="editable"
                  :comboItems="cycleItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="govScheduleCycleCd"
                  label="실시 주기(단위)"
                  v-model:value="govSchedule.govScheduleCycleCd"
                />
              </div>
              <div class="col-3">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="govSchedule.useFlag"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  label="업무내용"
                  name="remarks"
                  autogrow
                  v-model:value="govSchedule.remarks"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <c-table
            ref="table"
            title="대관업무 담당자"
            :columns="grid.columns"
            :data="govSchedule.users"
            :isFullScreen="false"
            :columnSetting="false"
            :editable="editable"
            :filtering="false"
            gridHeight="328px"
            selection="multiple"
            rowKey="mngUserId"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn label="추가" v-if="editable" icon="add" @btnClicked="addrow" />
                <c-btn
                  label="제외"
                  v-if="editable && govSchedule.users!.length > 0"
                  icon="remove"
                  @btnClicked="removeRow"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="검사관련 정보" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="INSP_TYPE"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="inspType"
                  label="검사종류"
                  v-model:value="govSchedule.inspType"
                />
              </div>
              <div class="col-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="RELATED_LAWS_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="relatedLawsCd"
                  label="관련법규"
                  v-model:value="govSchedule.relatedLawsCd"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable"
                  label="대상시설"
                  name="inspTarget"
                  v-model:value="govSchedule.inspTarget"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="계약서관련 정보" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="CONT_TYPE"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="contType"
                  label="계약구분"
                  v-model:value="govSchedule.contType"
                />
              </div>
              <div class="col-4">
                <c-select
                  :editable="editable"
                  codeGroupCd="CONT_STATUS"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="contStatus"
                  label="계약상태"
                  v-model:value="govSchedule.contStatus"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable"
                  label="계약업체"
                  name="contVendor"
                  v-model:value="govSchedule.contVendor"
                />
              </div>
            </template>
          </c-card>
        </div>
        <c-card title="대관업무 관련 파일" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-12">
              <c-upload
                :attachInfo="attachInfo"
                :editable="editable"
                label="대관업무 관련 파일 첨부파일"
              />
            </div>
          </template>
        </c-card>
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
import { govScheduleType } from './schedule'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'govScheduleInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    govScheduleMstId?: stringNull
  }
  contentHeight?: stringNull
  govSchedule: govScheduleType
  attachInfo: attachSettingType
}
interface gridType {
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
  data?: Array<any>
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
  contentHeight: null,
  param: () => {
    return {
      govScheduleMstId: ''
    }
  },
  govSchedule: () => {
    return {
      govScheduleMstId: '', // 대관업무 마스터 일련번호
      govScheduleTypeCd: null, // 대관업무구분
      plantCd: null, // 사업장코드
      govScheduleName: '', // 대관업무명
      govScheduleCycleCd: null, // 법정 주기
      govScheduleCycleTerm: null,
      remarks: '', // 내용
      useFlag: 'Y', // 사용여부
      inspType: null, // 검사-종류
      relatedLawsCd: null, // 검사-관련법규
      inspTarget: '', // 검사-대상 시설
      contStatus: null, // 계약-상태
      contType: null, // 계약-구분
      contVendor: '', // 계약-업체
      users: [],
      deleteUsers: []
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'GOV_SCHEDULE_MST',
      taskKey: ''
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
const cycleItems = ref<Array<codeMasterType>>([])
const saveUrl = ref('')
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const editForm = ref<any>(null)
const table = ref<any>(null)
const grid = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false
    },
    {
      name: 'mngUserName',
      field: 'mngUserName',
      label: '담당자',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

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
  saveUrl.value = transactionConfig.env.gov.mst.insert.url
  // code setting
  cycleItems.value = [
    { code: 'Y', codeName: $language('년') },
    { code: 'M', codeName: $language('개월') },
    { code: 'D', codeName: $language('일') }
  ]
  // list setting
}
/******************************
 * TODO (목적): 유저 추가
 *******************************/
function addrow() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUser, {
    type: 'multiple'
  })
}
function closeUser(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    if (!props.govSchedule.users) props.govSchedule.users = []
    _.forEach(_data, (item) => {
      if (_.findIndex(props.govSchedule.users, { mngUserId: item.userId }) === -1) {
        props.govSchedule.users!.push({
          editFlag: 'C',
          govScheduleMstId: props.param.govScheduleMstId,
          mngUserId: item.userId,
          mngUserName: item.userName,
          deptName: item.deptName
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 유저 선택 삭제
 *******************************/
function removeRow() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '제외하시겠습니까?',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: transactionConfig.env.gov.user.delete.url,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (item) => {
            props.govSchedule.users = _.reject(props.govSchedule.users, item)
            table.value.compoTable.clearSelection()
            message.requestSuccess()
          })
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.param.govScheduleMstId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.govSchedule.regUserId = user.value.userId
          props.govSchedule.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  props.param.govScheduleMstId = result.data.govScheduleMstId
  message.requestSuccess()
  if (mappingType.value === 'POST') {
    props.attachInfo.taskKey = result.data.govScheduleMstId
    props.attachInfo.isSubmit = uid()
  }
  emits('getDetail')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
