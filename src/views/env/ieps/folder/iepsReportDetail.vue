<template>
  <q-form ref="editForm">
    <div class="col-md-12 col-lg-12">
      <c-card
        title="개정"
        class="cardClassDetailForm revisionLayout"
        topClass="topcolor-orange"
        v-if="popupParam.iepsFolderDetailId"
      >
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div class="row">
              <div class="col-3">
                <c-text
                  :required="editable && isRevision"
                  :editable="editable && isRevision"
                  label="개정번호"
                  name="revisionNum"
                  v-model:value="folderDetail.revisionNum"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="false"
                  label="개정일시"
                  name="regDtStr"
                  v-model:value="folderDetail.regDtStr"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="false"
                  label="개정자"
                  name="regUserName"
                  v-model:value="folderDetail.regUserName"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="editable && isRevision"
                  :editable="editable && isRevision"
                  label="개정사유"
                  name="revisionContent"
                  v-model:value="folderDetail.revisionContent"
                />
              </div>
            </div>
          </div>
        </template>
      </c-card>
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-select>
          <c-select
            v-if="popupParam.iepsFolderDetailId"
            :editable="!isRevision"
            :comboItems="gridrev.data"
            type="custom"
            typetext="개정이력"
            itemText="revisionNum"
            itemValue="iepsFolderDetailId"
            name="selectediepsFolderDetailId"
            label=""
            v-model:value="selectediepsFolderDetailId"
            @update:value="rowClickRev"
          />
        </template>
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable && popupParam.iepsFolderDetailId && !isRevision"
              label="개정"
              icon="restart_alt"
              @btnClicked="setRevision"
            />
            <c-btn
              v-show="editable && popupParam.iepsFolderDetailId && isRevision"
              label="개정취소"
              icon="restart_alt"
              @btnClicked="cancelRevision"
            />
            <c-btn
              v-if="editable && popupParam.iepsFolderDetailId"
              label="삭제"
              icon="remove"
              @btnClicked="deleteData"
            />
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="folderDetail"
              :mappingType="saveType"
              label="저장"
              icon="save"
              @beforeAction="saveFolderDetail"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-6">
            <c-text
              required
              :disabled="isRevision"
              :editable="editable"
              label="제목"
              name="folderDetailName"
              v-model:value="folderDetail.folderDetailName"
            />
          </div>
          <div class="col-3">
            <c-datepicker
              label="기준일"
              :disabled="isRevision"
              :editable="editable"
              name="standardDate"
              v-model:value="folderDetail.standardDate"
            />
          </div>
          <!-- <div class="col-3">
              <c-plant
                :required="true"
                :disabled="isRevision"
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="folderDetail.plantCd"
              />
            </div> -->
        </template>
      </c-card>
      <div class="col-12">
        <c-upload ref="uploader" :attachInfo="attachInfo" :editable="editable" label="관련파일" />
      </div>
    </div>
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { folderDetailType } from './guideBook'

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
  name: 'iepsReportDetail'
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
    iepsFolderId?: stringNull
    iepsFolderDetailId?: stringNull
    folderType?: stringNull // A: 통합환경관리계획서, B: 설치 운영 허가 검토 결과서, C: 변경 사후관리
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: tableMergeType
  columns: tableColumnType
  data: Array<any>
  height?: stringNull
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
      iepsFolderId: '',
      iepsFolderDetailId: '',
      folderType: '' // A: 통합환경관리계획서, B: 설치 운영 허가 검토 결과서, C: 변경 사후관리
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
  taskClassCd: 'IEPS_REPORT',
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
const folderDetail = ref<folderDetailType>({
  iepsFolderDetailId: '',
  iepsFolderId: '',
  folderDetailName: '',
  groupId: '',
  revNo: 1,
  revisionNum: '',
  revisionContent: '제정',
  plantCd: '',
  standardDate: getToday(),
  sortOrder: '',
  deleteFlag: '',
  useFlag: '',
  regUserId: '',
  chgUserId: ''
})
const editable = ref(true)
const isSave = ref(false)
const isRevision = ref(false)
const selectediepsFolderDetailId = ref<stringNull>('')
const getUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const revlistUrl = ref('')
const saveCallData = ref('')
const saveType = ref('POST')
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
// const setTitle = computed(() => {
//   if (props.popupParam.folderType === 'A') return '통합환경관리계획서'
//   else if (props.popupParam.folderType === 'B') return '설치운영허가검토 결과서'
//   else if (props.popupParam.folderType === 'C') return '변경 사후관리'
//   else return ''
// })

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
  getUrl.value = selectConfig.env.ieps.folderDetail.get.url
  deleteUrl.value = transactionConfig.env.ieps.folderDetail.delete.url
  revlistUrl.value = selectConfig.env.ieps.folderDetail.rev.url
  saveUrl.value = transactionConfig.env.ieps.folderDetail.insert.url
  // code setting
  if (props.popupParam.iepsFolderId) folderDetail.value.iepsFolderId = props.popupParam.iepsFolderId
  // list setting
  getData()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.iepsFolderDetailId) {
    attachInfo.value.taskKey = props.popupParam.iepsFolderDetailId
    getDetail(props.popupParam.iepsFolderDetailId, true)
    selectediepsFolderDetailId.value = props.popupParam.iepsFolderDetailId
  }
}
function getDetail(_iepsFolderDetailId?: stringNull, _check?: boolean) {
  $http({
    url: $format(getUrl.value, _iepsFolderDetailId),
    method: 'GET'
  }).then((_result: any) => {
    folderDetail.value = _result.data
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.iepsFolderDetailId === props.popupParam.iepsFolderDetailId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveFolderDetail() {
  if (props.popupParam.iepsFolderDetailId) {
    folderDetail.value.chgUserId = user.value.userId
    saveType.value = 'PUT'
  } else {
    folderDetail.value.regUserId = user.value.userId
    saveType.value = 'POST'
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
          // 개정시
          if (isRevision.value) {
            saveType.value = 'POST'
            folderDetail.value.revNo = parseInt(folderDetail.value.revNo) + 1
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
  props.popupParam.iepsFolderDetailId = result.data
  saveCallData.value = uid()
  // 첨부파일 셋팅
  attachInfo.value.taskKey = result.data
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
        url: $format(deleteUrl.value, props.popupParam.iepsFolderDetailId),
        method: 'DELETE'
      }).then(() => {
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
    params: { revisionNum: folderDetail.value.revisionNum }
  }).then((_result: any) => {
    folderDetail.value.revisionNum = _result.data
    folderDetail.value.revisionContent = ''
    folderDetail.value.regDtStr = ''
    folderDetail.value.regUserName = ''
    isRevision.value = true
    // 첨부파일 셋팅
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.popupParam.iepsFolderDetailId
    attachInfo.value.isRev = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  attachInfo.value.taskKey = props.popupParam.iepsFolderDetailId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getData()
}
/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row && row !== folderDetail.value.iepsFolderDetailId) {
    selectediepsFolderDetailId.value = row
    getDetail(selectediepsFolderDetailId.value, false)
    attachInfo.value.taskKey = selectediepsFolderDetailId.value
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
