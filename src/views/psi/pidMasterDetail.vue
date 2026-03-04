<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.psiDiagramId"
          >
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div class="row">
                  <div class="col-1">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정번호"
                      name="revisionNum"
                      v-model:value="dwg.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="dwg.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="dwg.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable && isRevision"
                      :isSubmit="saveCallData"
                      :document="dwg"
                      :documentId="popupParam.psiDiagramId"
                      documentTitle="diagramTitle"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="dwg.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="dwg.revisionContent"
                    />
                  </div>
                </div>
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" style="margin-top: -18px !important;" id="revdiv">
                <c-table
                  ref="revision"
                  title="개정이력"
                  tableId="revision"
                  topBorderClass="topcolor-orange"
                  :columns="gridrev.columns"
                  :data="gridrev.data"
                  gridHeight="150px"
                  :columnSetting="false"
                  :expandAll="false"
                  :isFullScreen="false"
                  :usePaging="false"
                  :hideBottom="true"
                  :filtering="false"
                  @rowClick="rowClickRev"
                >
                </c-table>
              </div> -->
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card :title="popupParam.title + $language('기본정보')" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                :editable="!isRevision"
                v-if="popupParam.psiDiagramId"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="psiDiagramId"
                name="selectedpsiDiagramId"
                label=""
                v-model:value="selectedpsiDiagramId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && popupParam.psiDiagramId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.psiDiagramId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.psiDiagramId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="dwg"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-4">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="도면번호"
                  name="diagramNo"
                  v-model:value="dwg.diagramNo"
                />
              </div>
              <div class="col-4">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="도면명"
                  name="diagramTitle"
                  v-model:value="dwg.diagramTitle"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  label="도면내용"
                  name="diagramContents"
                  autogrow
                  v-model:value="dwg.diagramContents"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="dwg.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="dwg.plantCd"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="dwg.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="dwg.deptCd"
                />
              </div>
              <div class="col-3">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="dwg.useFlag"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-upload
            :attachInfo="attachInfo"
            :editable="editable"
            :label="popupParam.title + ' ' + $language('첨부파일')"
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
import { dwgType } from './processSafetyInfo'

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
  name: 'pidMasterDetail'
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
    title?: stringNull
    psiDiagramId?: stringNull
    diagramClassCd?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
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
      title: '',
      psiDiagramId: '',
      diagramClassCd: ''
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
  taskClassCd: 'PSI_PID',
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
const dwg = ref<dwgType>({
  diagramClassCd: '', // 도면분류 일련번호
  psiDiagramId: '', // 도면 일련번호
  diagramNo: '', // 도면번호
  plantCd: '', // 사업장코드
  deptCd: '', // 관리부서
  processCd: '', // 공정코드
  diagramTitle: '', // 도면명
  diagramContents: '', // 도면내용
  useFlag: 'Y', // 사용여부
  deleteFlag: 'N', // 삭제여부
  revisionNum: '',
  groupId: '',
  sysRevision: 1,
  revisionContent: '제정',
  regDtStr: '',
  regUserName: '',
  sopMocId: ''
})
const editable = ref(true)
const isSave = ref(false)
const isdelete = ref(false)
const isRevision = ref(false)
const selectedpsiDiagramId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.diagram.insert.url)
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
  detailUrl.value = selectConfig.psi.diagram.get.url
  deleteUrl.value = transactionConfig.psi.diagram.delete.url
  revlistUrl.value = selectConfig.psi.diagram.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 동력기계 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.psiDiagramId) {
    attachInfo.value.taskKey = props.popupParam.psiDiagramId
    getDetail(props.popupParam.psiDiagramId, true)
    selectedpsiDiagramId.value = props.popupParam.psiDiagramId
  }
}
function getDetail(_psiDiagramId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _psiDiagramId),
    method: 'GET'
  }).then((_result: any) => {
    dwg.value = _result.data
    dwg.value.regDtStr = dwg.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.psiDiagramId === props.popupParam.psiDiagramId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.psiDiagramId) {
    dwg.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    dwg.value.regUserId = user.value.userId
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
          dwg.value.diagramClassCd = props.popupParam.diagramClassCd
          dwg.value.deleteFlag = 'N'
          // 개정시
          if (isRevision.value) {
            mappingType.value = 'POST'
            dwg.value.sysRevision = parseInt(dwg.value.sysRevision) + 1
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
  props.popupParam.psiDiagramId = result.data.psiDiagramId
  // saveCallData.value = uid()
  // 첨부파일 셋팅
  attachInfo.value.taskKey = result.data.psiDiagramId
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
        url: $format(deleteUrl.value, props.popupParam.psiDiagramId),
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
    params: { revisionNum: dwg.value.revisionNum }
  }).then((_result: any) => {
    dwg.value.revisionNum = _result.data
    dwg.value.revisionContent = ''
    dwg.value.regDtStr = ''
    dwg.value.regUserName = ''
    dwg.value.sopMocId = ''
    isRevision.value = true
    // 첨부파일 셋팅
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.popupParam.psiDiagramId
    attachInfo.value.isRev = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  attachInfo.value.taskKey = props.popupParam.psiDiagramId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getData()
}
/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row && row !== dwg.value.psiDiagramId) {
    selectedpsiDiagramId.value = row
    getDetail(selectedpsiDiagramId.value, false)
    attachInfo.value.taskKey = selectedpsiDiagramId.value
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
