<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            v-if="popupParam.userManualId"
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
          >
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div class="row">
                  <div class="col-2">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정번호"
                      name="revisionNum"
                      v-model:value="userManual.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="userManual.regDtStr"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="userManual.regUserName"
                    />
                  </div>
                  <div class="col-6">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="userManual.revisionContent"
                    />
                  </div>
                </div>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card :title="$language('사용자매뉴얼 기본정보')" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                v-if="popupParam.userManualId"
                :editable="!isRevision"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="userManualId"
                name="selectedUserManualId"
                label=""
                v-model:value="selectedUserManualId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && popupParam.userManualId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.userManualId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.userManualId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="userManual"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-2">
                <c-text
                  :editable="false"
                  label="문서일련번호"
                  name="userManualId"
                  v-model:value="userManual.userManualId"
                />
              </div>
              <div class="col-1">
                <c-text
                  :editable="editable"
                  type="number"
                  label="순번"
                  name="sortOrder"
                  v-model:value="userManual.sortOrder"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="업무명"
                  name="taskName"
                  v-model:value="userManual.taskName"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  label="업무개요"
                  name="taskSummary"
                  autogrow
                  v-model:value="userManual.taskSummary"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-upload
            :attachInfo="attachInfo"
            :editable="editable"
            :label="$language('사용자매뉴얼 첨부파일')"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { userManualType } from './userManualType'

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
  name: 'userManualDetail'
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
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    userManualId?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: tableMergeType
  columns: Array<tableColumnType>
  data: Array<any>
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
      userManualId: ''
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
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'USER_MANUAL',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
const gridrev = ref<gridType>({
  columns: [
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: '개정번호',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    },
    {
      name: 'revisionContent',
      field: 'revisionContent',
      label: '개정사유',
      align: 'left',
      sortable: true
    },
    {
      name: 'regDtStr',
      field: 'regDtStr',
      label: '개정일시',
      style: 'width: 150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '개정자',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    }
  ],
  data: []
})
const userManual = ref<userManualType>({
  userManualId: '', // 사용자매뉴얼 일련번호
  taskName: '', // 업무명
  taskSummary: '', // 업무개요
  deleteFlag: 'N', // 삭제여부
  revisionNum: '',
  groupId: '',
  sysRevision: 1,
  revisionContent: '제정',
  regDtStr: '',
  regUserName: '',
  sortOrder: 0
})
const editable = ref(true)
const isSave = ref(false)
const isdelete = ref(false)
const isRevision = ref(false)
const selectedUserManualId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const revlistUrl = ref('')
const saveCallData = ref('')
const mappingType = ref('POST')
const editForm = ref<any>(null)

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
  detailUrl.value = selectConfig.um.userManual.get.url
  deleteUrl.value = transactionConfig.um.userManual.delete.url
  saveUrl.value = transactionConfig.um.userManual.save.url
  revlistUrl.value = selectConfig.um.userManual.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 사용자매뉴얼 상세조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.userManualId) {
    attachInfo.value.taskKey = props.popupParam.userManualId
    getDetail(props.popupParam.userManualId, true)
    selectedUserManualId.value = props.popupParam.userManualId
  }
}
function getDetail(_userManualId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _userManualId),
    method: 'GET'
  }).then((_result: any) => {
    userManual.value = _result.data
    userManual.value.regDtStr = userManual.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.userManualId === props.popupParam.userManualId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.userManualId) {
    userManual.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    userManual.value.regUserId = user.value.userId
    mappingType.value = 'POST'
  }
  let saveMsg = '저장하시겠습니까?'
  if (isRevision.value) saveMsg = '현재버전을 개정하여 저장하시겠습니까?'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: saveMsg,
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          userManual.value.deleteFlag = 'N'
          userManual.value.regUserId = user.value.userId
          // 개정시
          if (isRevision.value) {
            mappingType.value = 'POST'
            userManual.value.sysRevision = parseInt(userManual.value.sysRevision) + 1
          }
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.userManualId = result.data.userManualId
  saveCallData.value = uid()
  // 첨부파일 셋팅
  attachInfo.value.taskKey = result.data.userManualId
  attachInfo.value.isSubmit = uid()
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getData()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.userManualId),
        method: 'DELETE'
      }).then(() => {
        isdelete.value = !isdelete.value
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 개정 버전 조회
 *******************************/
function getRevList(_groupId?: string) {
  $http({
    url: revlistUrl.value,
    method: 'GET',
    params: { groupId: _groupId }
  }).then((_result: any) => {
    gridrev.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 개정 버전 추가
 *******************************/
function setRevision() {
  $http({
    url: selectConfig.com.revision.getversion,
    method: 'GET',
    params: { revisionNum: userManual.value.revisionNum }
  }).then((_result: any) => {
    userManual.value.revisionNum = _result.data
    userManual.value.revisionContent = ''
    userManual.value.regDtStr = ''
    userManual.value.regUserName = ''
    isRevision.value = true
    // 첨부파일 셋팅
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.popupParam.userManualId
    attachInfo.value.isRev = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  attachInfo.value.taskKey = props.popupParam.userManualId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getData()
}
/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row && row !== userManual.value.userManualId) {
    selectedUserManualId.value = row
    getDetail(selectedUserManualId.value, false)
    attachInfo.value.taskKey = selectedUserManualId.value
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
