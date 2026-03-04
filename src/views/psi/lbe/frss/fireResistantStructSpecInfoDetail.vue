<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.psiFireproofStructureId"
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
                      v-model:value="frs.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="frs.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="frs.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable"
                      :isSubmit="saveCallData"
                      :document="frs"
                      :documentId="frs.psiFireproofStructureId"
                      documentTitle="fireproofStructureName"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="frs.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="frs.revisionContent"
                    />
                  </div>
                </div>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="내화구조 명세 상세정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                :editable="!isRevision"
                v-if="popupParam.psiFireproofStructureId"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="psiFireproofStructureId"
                name="selectedpsiFireproofStructureId"
                label=""
                v-model:value="selectedpsiFireproofStructureId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <q-icon name="help" style="font-size: 20px; margin-right: 8px" class="text-primary">
                  <q-tooltip
                    anchor="bottom left"
                    self="top right"
                    :offset="[0, 0]"
                    style="font-size: 0.9em; padding: 10px"
                  >
                    {{
                      $language('① 내화설비 또는 지역은 건축물명, 배관지지대명, 설비명 등을 기재')
                    }}
                    <br />
                    {{ $language('② 내화부위는 내화의 범위(예: 배관지지대 등)를 기재') }}
                    <br />
                    {{
                      $language(
                        '③ 내화시험기준 및 시간은 한국산업규격에 따른 내화시험방법에 의하여 기재'
                      )
                    }}
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-show="editable && popupParam.psiFireproofStructureId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.psiFireproofStructureId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.psiFireproofStructureId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="frs"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="내화구조설비 및 지역명"
                  name="fireproofStructureName"
                  v-model:value="frs.fireproofStructureName"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="frs.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="frs.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="frs.deptCd"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="내화부위"
                  name="fireproofProofPart"
                  v-model:value="frs.fireproofProofPart"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="시험기준및시간"
                  name="testStndardTime"
                  v-model:value="frs.testStndardTime"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="비고"
                  name="remark"
                  v-model:value="frs.remark"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { frsType } from '@/views/psi/processSafetyInfo'

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
  name: 'fireResistantStructSpecInfoDetail'
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
    psiFireproofStructureId?: stringNull
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
      psiFireproofStructureId: ''
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
const frs = ref<frsType>({
  psiFireproofStructureId: '', // 내화구조명세 일련번호
  plantCd: '', // 사업장코드
  fireproofStructureName: '', // 내화구조설비및지역명
  fireproofProofPart: '', // 내화부위
  testStndardTime: '', // 시험기준및시간
  remark: '', // 비고
  processCd: '',
  deptCd: '',
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
const selectedpsiFireproofStructureId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.lbe.fireproof.insert.url)
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
  detailUrl.value = selectConfig.psi.lbe.fireproof.get.url
  deleteUrl.value = transactionConfig.psi.lbe.fireproof.delete.url
  revlistUrl.value = selectConfig.psi.lbe.fireproof.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 내화구조설비 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.psiFireproofStructureId) {
    getDetail(props.popupParam.psiFireproofStructureId, true)
    selectedpsiFireproofStructureId.value = props.popupParam.psiFireproofStructureId
  }
}
function getDetail(_psiFireproofStructureId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _psiFireproofStructureId),
    method: 'GET'
  }).then((_result: any) => {
    frs.value = _result.data
    frs.value.regDtStr = frs.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.psiFireproofStructureId === props.popupParam.psiFireproofStructureId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.psiFireproofStructureId) {
    frs.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    frs.value.regUserId = user.value.userId
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
          // 개정시
          if (isRevision.value) {
            mappingType.value = 'POST'
            frs.value.sysRevision = parseInt(frs.value.sysRevision) + 1
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
  props.popupParam.psiFireproofStructureId = result.data.psiFireproofStructureId
  saveCallData.value = uid()
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
        url: $format(deleteUrl.value, props.popupParam.psiFireproofStructureId),
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
    params: { revisionNum: frs.value.revisionNum }
  }).then((_result: any) => {
    frs.value.revisionNum = _result.data
    frs.value.revisionContent = ''
    frs.value.regDtStr = ''
    frs.value.regUserName = ''
    frs.value.sopMocId = ''
    isRevision.value = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  getData()
}
/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row) {
    selectedpsiFireproofStructureId.value = row
    if (selectedpsiFireproofStructureId.value !== frs.value.psiFireproofStructureId) {
      getDetail(selectedpsiFireproofStructureId.value, false)
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
