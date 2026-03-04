<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            v-if="popupParam.opmGuidebookId"
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
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
                      v-model:value="guidBook.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="guidBook.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="guidBook.regUserName"
                    />
                  </div>
                  <div class="col-5">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="guidBook.revisionContent"
                    />
                  </div>
                  <div class="col-3">
                    <c-moc
                      :editable="editable && isRevision"
                      :isSubmit="saveCallData"
                      :document="guidBook"
                      :documentId="guidBook.opmGuidebookId"
                      documentTitle="guidebookName"
                      mocRelatedTaskCd="RT00000050"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="guidBook.sopMocId"
                    />
                  </div>
                </div>
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style="margin-top: -18px !important;" id="revdiv">
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
          <c-card title="안전환경보건 규정 기본정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                v-if="popupParam.opmGuidebookId"
                :editable="!isRevision"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="opmGuidebookId"
                name="selectedopmGuidebookId"
                label=""
                v-model:value="selectedopmGuidebookId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && isOld"
                  label=""
                  icon="manage_search"
                  @btnClicked="editorPop"
                />
                <c-btn
                  v-show="editable && popupParam.opmGuidebookId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.opmGuidebookId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="guidBook"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  required
                  :editable="editable"
                  label="제목"
                  name="guidebookName"
                  v-model:value="guidBook.guidebookName"
                />
              </div>
              <div class="col-1">
                <c-text
                  required
                  :editable="editable"
                  label="분류번호"
                  name="guidebookNo"
                  v-model:value="guidBook.guidebookNo"
                />
              </div>
              <div class="col-1">
                <c-field
                  type="user"
                  :editable="editable"
                  label="승인자"
                  name="approvalUserId"
                  v-model:value="guidBook.approvalUserId"
                />
              </div>
              <div class="col-1">
                <c-field
                  type="user"
                  :editable="editable"
                  label="검토자"
                  name="examineUserId"
                  v-model:value="guidBook.examineUserId"
                />
              </div>
              <!-- <div class="col-1">
                <c-plant
                  required
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="guidBook.plantCd"
                />
              </div> -->
              <div class="col-2">
                <c-radio
                  :editable="editable"
                  :comboItems="useFlagItems"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="guidBook.useFlag"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  type="editor"
                  :editable="editable"
                  label="규정내용"
                  name="remark"
                  v-model:value="guidBook.remark"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-12" style="margin-top: 20px">
          <c-upload :attachInfo="attachInfo" :editable="editable" label="관련 지침서" />
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
import { guideBookType } from './guideBook'

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
  name: 'safetyOperGuideBookDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    opmGuidebookId: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
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
  popupParam: () => {
    return {
      opmGuidebookId: ''
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
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'SAF_OPER_GUIDE_BOOK',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const guidBook = ref<guideBookType>({
  opmGuidebookId: '',
  plantCd: '',
  guidebookNo: '',
  guidebookName: '',
  approvalUserId: '',
  examineUserId: '',
  regUserId: '',
  chgUserId: '',
  useFlag: 'Y',
  remark: '',
  revisionNum: '',
  groupId: '',
  sysRevision: 1,
  revisionContent: '제정',
  regDtStr: '',
  regUserName: '',
  sopMocId: ''
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
const editable = ref(true)
const selectedopmGuidebookId = ref(null)
const realKey = ref('')
const useFlagItems = ref<Array<codeMasterType>>([])
const saveUrl = ref(transactionConfig.sop.opm.guidebook.insert.url)
const revlistUrl = ref('')
const detailUrl = ref('')
const getRevUrl = ref('')
const mappingType = ref('POST')
const isSave = ref(false)
const attachable = ref(false)
const isRevision = ref(false)
const editForm = ref<any>(null)
const saveCallData = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  Boolean(props.popupParam.opmGuidebookId)
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
  detailUrl.value = selectConfig.sop.opm.guidebook.get.url
  revlistUrl.value = selectConfig.sop.opm.guidebook.rev.url
  getRevUrl.value = selectConfig.sop.opm.guidebook.rev.get.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getDetail(true)
}

/******************************
 * TODO (목적): 상세정보 조회_
 *******************************/
function getDetail(_check?: boolean) {
  if (_check) {
    isRevision.value = false
    editable.value = Boolean(route.meta.editable)
    if (props.popupParam.opmGuidebookId) {
      $http({
        url: $format(detailUrl.value, props.popupParam.opmGuidebookId),
        method: 'GET'
      }).then((_result: any) => {
        guidBook.value = _result.data
        guidBook.value.regDtStr = guidBook.value.regDtStr.slice(0, -5)
        // 상세팝업 최초작성/최근수정 정보 노출
        emits('setRegInfo', _result.data)
        realKey.value = _.cloneDeep(_result.data.opmGuidebookId)
        attachable.value = true
        attachInfo.value.taskKey = props.popupParam.opmGuidebookId
        getRevList(_result.data.groupId)
      })
    }
  } else {
    $http({
      url: $format(getRevUrl.value, props.popupParam.opmGuidebookId),
      method: 'GET'
    }).then((_result: any) => {
      if (_result.data) {
        guidBook.value = _result.data
        if (_result.data.opmGuidebookId === realKey.value) {
          editable.value = Boolean(route.meta.editable)
          attachable.value = true
          attachInfo.value.taskKey = props.popupParam.opmGuidebookId
        } else {
          editable.value = false
          attachable.value = false
          attachInfo.value.taskKe = _result.data.opmGuidebookId
        }
      }
    })
  }
  selectedopmGuidebookId.value = props.popupParam.opmGuidebookId
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  mappingType.value = props.popupParam.opmGuidebookId ? 'PUT' : 'POST'
  const saveMsg = isRevision.value ? '현재버전을 개정하여 저장하시겠습니까?' : '저장하시겠습니까?'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: saveMsg,
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          guidBook.value.regUserId = user.value.userId
          guidBook.value.chgUserId = user.value.userId
          // 개정시
          if (isRevision.value) {
            mappingType.value = 'POST'
            guidBook.value.sysRevision = parseInt(guidBook.value.sysRevision) + 1
          }
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
  props.popupParam.opmGuidebookId = result.data
  // 첨부파일 셋팅
  attachInfo.value.taskKey = result.data
  attachInfo.value.isSubmit = uid()
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  saveCallData.value = uid()
  getDetail(true)
}
/******************************
 * TODO (목적): 삭제
 *******************************/
// function deleteData() {
//   message.confirm({
//     title: '확인',
//     message: '삭제하시겠습니까?',
//     type: 'info', // success / info / warning / error
//     // 확인 callback 함수
//     confirmCallback: () => {
//       $http({
//         url: $format(deleteUrl.value, props.popupParam.opmGuidebookId),
//         method: 'DELETE'
//       }).then(() => {
//         isdelete.value = !isdelete.value
//         message.requestSuccess()
//         emits('closePopup')
//       })
//     },
//     // 취소 callback 함수
//     cancelCallback: () => {}
//   })
// }
/******************************
 * TODO (목적): 버전 조회
 *******************************/
function getRevList(_groupId: stringNull) {
  $http({
    url: revlistUrl.value,
    method: 'GET',
    params: { groupId: _groupId }
  }).then((_result: any) => {
    gridrev.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 개정 버전 설정
 *******************************/
function setRevision() {
  $http({
    url: selectConfig.com.revision.getversion,
    method: 'GET',
    params: { revisionNum: guidBook.value.revisionNum }
  }).then((_result: any) => {
    guidBook.value.revisionNum = _result.data
    guidBook.value.revisionContent = ''
    guidBook.value.regDtStr = ''
    guidBook.value.regUserName = ''
    isRevision.value = true
    // 첨부파일 셋팅
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.popupParam.opmGuidebookId
    attachInfo.value.isRev = true
  })
}

/******************************
 * TODO (목적): 개정 버전 설정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  // 첨부파일 셋팅
  attachInfo.value.taskKey = props.popupParam.opmGuidebookId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getDetail(true)
}

/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row && row !== props.popupParam.opmGuidebookId) {
    selectedopmGuidebookId.value = row
    props.popupParam.opmGuidebookId = selectedopmGuidebookId.value
    getDetail(false)
    attachInfo.value.taskKey = selectedopmGuidebookId.value
  }
}

/******************************
 * TODO (목적): 규정비교 팝업
 *******************************/
function editorPop() {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safetyOperGuideBookEditor.vue`))
  )
  popupOptions.value.title = '규정 비교'
  popupOptions.value.param = {
    groupId: guidBook.value.groupId || '',
    remark: guidBook.value.remark || '',
    opmGuidebookId: props.popupParam.opmGuidebookId || ''
  }
  popupOptions.value.width = '60%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
