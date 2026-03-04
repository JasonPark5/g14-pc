<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            v-if="popupParam.limLicenseId"
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
                      v-model:value="licenseData.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="licenseData.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="licenseData.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable"
                      :isSubmit="saveCallData"
                      :document="licenseData"
                      :documentId="licenseData.limLicenseId"
                      documentTitle="limLicenseKindName"
                      mocRelatedTaskCd="RT00000030"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="licenseData.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="licenseData.revisionContent"
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
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card class="cardClassDetailForm" title="인허가 정보">
            <template v-slot:card-select>
              <c-select
                :editable="!isRevision"
                v-if="popupParam.limLicenseId"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="limLicenseId"
                name="selectedlimLicenseId"
                label=""
                v-model:value="selectedlimLicenseId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && popupParam.limLicenseId && !isRevision && isSaveable"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.limLicenseId && isRevision && isSaveable"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.limLicenseId && isDeletable"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable && isSaveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="licenseData"
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
                <c-task-target
                  :required="true"
                  :editable="editable"
                  :disabled="isOld"
                  :customPopupParam="{ targetKey: 'licenseKind' }"
                  label="인허가종류"
                  name="licenseKind"
                  v-model:value="licenseData.limLicenseKindId"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="인허가번호"
                  name="licenseNo"
                  v-model:value="licenseData.licenseNo"
                />
              </div>
              <div class="col-3">
                <c-text
                  :required="true"
                  :editable="false"
                  label="관련법규"
                  name="relatedLawsName"
                  v-model:value="licenseData.relatedLawsName"
                />
              </div>
              <div class="col-3">
                <c-datepicker
                  :editable="editable"
                  label="인허가시작일"
                  name="licenseStartDate"
                  v-model:value="licenseData.licenseStartDate"
                />
              </div>
              <div class="col-3">
                <c-datepicker
                  :editable="editable"
                  label="인허가종료일"
                  name="licenseEndDate"
                  v-model:value="licenseData.licenseEndDate"
                />
              </div>
              <!-- <div class="col-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  type="edit"
                  name="plantCd"
                  v-model:value="licenseData.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관련부서"
                  name="relatedDeptCd"
                  v-model:value="licenseData.relatedDeptCd"
                />
              </div>
              <div class="col-3">
                <c-field
                  :editable="editable"
                  :data="licenseData"
                  type="user"
                  label="인허가담당자"
                  name="chargeUserId"
                  v-model:value="licenseData.chargeUserId"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  autogrow
                  label="비고"
                  name="remark"
                  v-model:value="licenseData.remark"
                />
              </div>
              <div class="col-3">
                <c-select
                  :disabled="true"
                  codeGroupCd="LICENSE_CREATE_TYPE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="licenseCreateTypeCd"
                  label="인허가 등록 구분"
                  v-model:value="licenseData.licenseCreateTypeCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-table
            ref="equipTable"
            title="인허가관련 설비"
            tableId="equipTable"
            :columns="gridEquipment.columns"
            :data="gridEquipment.data"
            :columnSetting="false"
            selection="multiple"
            rowKey="equipmentCd"
            :filtering="false"
            :usePaging="false"
            :hideBottom="true"
            :isFullScreen="false"
            :isExcelDown="false"
            gridHeight="290px"
          >
            <!-- 버튼 영역 -->
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && popupParam.limLicenseId"
                  label="추가"
                  icon="add"
                  @btnClicked="addRowEquipment"
                />
                <c-btn
                  v-if="editable && popupParam.limLicenseId && gridEquipment.data.length > 0"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeRowEquipment"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-table
            ref="chemTable"
            title="인허가관련 화학자재"
            tableId="chemTable"
            :columns="gridChem.columns"
            :data="gridChem.data"
            :columnSetting="false"
            selection="multiple"
            rowKey="mdmChemMaterialId"
            :filtering="false"
            :usePaging="false"
            :hideBottom="true"
            :isFullScreen="false"
            :isExcelDown="false"
            gridHeight="290px"
          >
            <!-- 버튼 영역 -->
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  label="추가"
                  v-if="editable && popupParam.limLicenseId"
                  icon="add"
                  @btnClicked="addRowMaterial"
                />
                <c-btn
                  v-if="editable && popupParam.limLicenseId && gridChem.data.length > 0"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeRowMaterial"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-upload
            :attachInfo="attachInfoRel"
            :editable="editable && attachable && Boolean(popupParam.limLicenseId)"
            label="인허가 관련서류"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-upload
            :attachInfo="attachInfo"
            :editable="editable && attachable && Boolean(popupParam.limLicenseId)"
            label="인허가증 파일"
          />
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
import { licenseType } from './license'
import { equipLicenseType } from '@/views/mdm/fim/equipment'
import { chemLicenseType } from '@/views/mdm/mam/chemMaterial'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'licenseStatusDetail'
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
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    limLicenseId: stringNull
  }
  contentHeight: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<object>
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
      limLicenseId: ''
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
  taskClassCd: 'LICENSE_FILE',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
const attachInfoRel = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'LICENSE_FILE_REL',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
const popupOptions = ref<popupParamType>({
  width: '60%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const licenseData = ref<licenseType>({
  limLicenseId: '', // 인허가 일련번호
  plantCd: '', // 사업장
  licenseNo: '', // 인허가증 번호
  relatedLawsCd: '', // 관련법규
  relatedLawsName: '', // 관련법규
  limLicenseKindId: '', // 인허가종류 알련번호
  limLicenseKindName: '', // 인허가종류 알련번호
  licenseStartDate: '', // 인허가시작일
  licenseEndDate: '', // 인허가종료일
  relatedDeptCd: '', // 관련부서
  chargeUserId: '', // 인허가담당자
  remark: '', // 비고
  licenseCreateTypeCd: '', // 인허가 등록 구분코드
  relLimLicenseReviewId: '', // 검토후등록-인허가 검토 일련번호
  sysRevision: '1', // 시스템 개정번호
  groupId: '', // 일련번호 키
  revisionNum: '', // 개정번호
  revisionContent: '제정', // 개정사유
  regDtStr: '',
  regUserName: '',
  sopMocId: '' // 관련MOC일련번호
})
const gridEquipment = ref<gridType>({
  columns: [
    {
      name: 'equipmentCd',
      field: 'equipmentCd',
      label: '설비관리번호',
      align: 'center',
      sortable: true
    },
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      align: 'center',
      sortable: true
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
const gridChem = ref<gridType>({
  columns: [
    {
      name: 'materialCd',
      field: 'materialCd',
      label: '화학자재번호',
      align: 'center',
      sortable: true
    },
    {
      name: 'materialName',
      field: 'materialName',
      label: '화학자재명',
      align: 'left',
      sortable: true
    }
  ],
  data: []
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
const isSave = ref(false)
const isdelete = ref(false)
const isRevision = ref(false)
const disabled = ref(false)
const isSaveable = ref(true)
const isDeletable = ref(false)
const saveCallData = ref('')
const selectedlimLicenseId = ref(null)
const attachable = ref(false)
const mappingType = ref('POST')
const saveUrl = ref(transactionConfig.sop.lim.lincense.card.insert.url)
const insertUrl = ref('')
const updateUrl = ref('')
const detailUrl = ref('')
const deleteUrl = ref('')
const revlistUrl = ref('')
const listEUrl = ref('')
const saveEUrl = ref('')
const deleteEUrl = ref('')
const listMUrl = ref('')
const saveMUrl = ref('')
const deleteMUrl = ref('')
const editForm = ref<any>(null)
const equipTable = ref<any>(null)
const chemTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.limLicenseId))

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
  detailUrl.value = selectConfig.sop.lim.lincense.card.get.url
  insertUrl.value = transactionConfig.sop.lim.lincense.card.insert.url
  updateUrl.value = transactionConfig.sop.lim.lincense.card.update.url
  deleteUrl.value = transactionConfig.sop.lim.lincense.card.delete.url
  revlistUrl.value = selectConfig.sop.lim.lincense.card.list.url + '/revs'

  listEUrl.value = selectConfig.sop.lim.lincense.equipment.list.url
  saveEUrl.value = transactionConfig.sop.lim.lincense.equipment.insert.url
  deleteEUrl.value = transactionConfig.sop.lim.lincense.equipment.delete.url
  listMUrl.value = selectConfig.sop.lim.lincense.material.list.url
  saveMUrl.value = transactionConfig.sop.lim.lincense.material.insert.url
  deleteMUrl.value = transactionConfig.sop.lim.lincense.material.delete.url
  // code setting
  // list setting
  getData()
  getEquipments(props.popupParam.limLicenseId)
  getChems(props.popupParam.limLicenseId)
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.limLicenseId) {
    selectedlimLicenseId.value = props.popupParam.limLicenseId
    getDetail(props.popupParam.limLicenseId, true)
    disabled.value = true
  } else {
    licenseData.value.licenseCreateTypeCd = 'LCTC000001' //직접등록
    disabled.value = false
    attachable.value = true
  }
}

function getDetail(_limLicenseId: stringNull, _check: boolean) {
  $http({
    url: $format(detailUrl.value, _limLicenseId),
    method: 'GET'
  }).then((_result: any) => {
    licenseData.value = _result.data
    licenseData.value.regDtStr = licenseData.value.regDtStr.slice(0, 19)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    isRevision.value = false
    attachInfo.value.taskKey = _limLicenseId
    attachInfoRel.value.taskKey = _limLicenseId
    attachable.value = true
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.limLicenseId === props.popupParam.limLicenseId)
      editable.value = Boolean(route.meta.editable)
    else editable.value = false

    // 작성자/인허가담당자/관련부서원만 수정가능
    if (
      _result.data.chargeUserId === user.value.userId ||
      _result.data.relatedDeptCd === user.value.deptCd ||
      _result.data.regUserId === user.value.userId
    )
      isSaveable.value = true
    else isSaveable.value = false
    // 작성자만 삭제가능
    if (_result.data.regUserId === user.value.userId) isDeletable.value = true
    else isDeletable.value = false
  })
}
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
 * TODO (목적): 설비 및 자재 조회
 *******************************/
function getEquipments(_limLicenseId: stringNull) {
  if (_limLicenseId) {
    $http({
      url: $format(listEUrl.value, _limLicenseId),
      method: 'GET'
    }).then((_result: any) => {
      gridEquipment.value.data = _result.data
    })
  }
}
function getChems(_limLicenseId: stringNull) {
  if (_limLicenseId) {
    $http({
      url: $format(listMUrl.value, _limLicenseId),
      method: 'GET'
    }).then((_result: any) => {
      gridChem.value.data = _result.data
    })
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  mappingType.value = props.popupParam.limLicenseId ? 'PUT' : 'POST'
  const saveMsg = isRevision.value ? '현재버전을 개정하여 저장하시겠습니까?' : '저장하시겠습니까?'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: saveMsg,
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          licenseData.value.regUserId = user.value.userId
          licenseData.value.chgUserId = user.value.userId
          // 개정시
          if (isRevision.value) {
            mappingType.value = 'POST'
            licenseData.value.sysRevision = parseInt(licenseData.value.sysRevision) + 1
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
  props.popupParam.limLicenseId = result.data.limLicenseId
  if (isRevision.value) {
    saveEquip()
    saveChem()
  }
  attachInfo.value.taskKey = result.data.limLicenseId
  attachInfo.value.isSubmit = uid()
  attachInfoRel.value.taskKey = result.data.limLicenseId
  attachInfoRel.value.isSubmit = uid()

  // 첨부파일 셋팅
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  attachInfoRel.value.beforeTaskKey = ''
  attachInfoRel.value.isRev = false

  saveCallData.value = uid()
  getData()
}

/******************************
 * TODO (목적): 설비 및 자재 저장
 *******************************/
function saveEquip() {
  const saveData = gridEquipment.value.data
  _.forEach(saveData, (item: any) => {
    item.limLicenseId = props.popupParam.limLicenseId
  })
  $http({
    url: saveEUrl.value,
    method: 'POST',
    data: saveData
  }).then(() => {
    getEquipments(props.popupParam.limLicenseId)
  })
}

function saveChem() {
  const saveData = gridChem.value.data
  _.forEach(saveData, (item: any) => {
    item.limLicenseId = props.popupParam.limLicenseId
  })
  $http({
    url: saveMUrl.value,
    method: 'POST',
    data: saveData
  }).then(() => {
    getChems(props.popupParam.limLicenseId)
  })
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.limLicenseId),
        method: 'DELETE'
      }).then(() => {
        isdelete.value = !isdelete.value
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}

/******************************
 * TODO (목적): 개정 버전 설정
 *******************************/
function setRevision() {
  $http({
    url: selectConfig.com.revision.getversion,
    method: 'GET',
    params: { revisionNum: licenseData.value.revisionNum }
  }).then((_result: any) => {
    licenseData.value.revisionNum = _result.data
    licenseData.value.revisionContent = ''
    licenseData.value.regDtStr = ''
    licenseData.value.regUserName = ''
    licenseData.value.sopMocId = ''
    isRevision.value = true

    // 첨부파일 셋팅
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.popupParam.limLicenseId
    attachInfo.value.isRev = true
    attachInfoRel.value.taskKey = ''
    attachInfoRel.value.beforeTaskKey = props.popupParam.limLicenseId
    attachInfoRel.value.isRev = true
  })
}

/******************************
 * TODO (목적): 개정 버전 설정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  // 첨부파일 셋팅
  attachInfo.value.taskKey = props.popupParam.limLicenseId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  attachInfoRel.value.taskKey = props.popupParam.limLicenseId
  attachInfoRel.value.beforeTaskKey = ''
  attachInfoRel.value.isRev = false
  getData()
}

/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row: any) {
  if (row && row !== licenseData.value.limLicenseId) {
    getDetail(row, false)
    getEquipments(row)
    getChems(row)
  }
}

/******************************
 * TODO (목적): 인허가관련 설비 추가
 *******************************/
function addRowEquipment() {
  popupOptions.value.width = '80%'
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeLicenseKind, {
    type: 'multiple'
  })
}

function closeLicenseKind(_data: Array<equipLicenseType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData: Array<equipLicenseType> = []
    _.forEach(_data, (item) => {
      if (_.findIndex(gridEquipment.value.data, { equipmentCd: item.equipmentCd }) === -1) {
        saveData.push({
          limLicenseId: props.popupParam.limLicenseId,
          equipmentCd: item.equipmentCd,
          equipmentName: item.equipmentName,
          equipmentTypeName: item.equipmentTypeName
        })
      }
    })
    $http({
      url: saveEUrl.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      message.requestSuccess()
      getEquipments(props.popupParam.limLicenseId)
    })
  }
}

/******************************
 * TODO (목적): 인허가관련 설비 삭제
 *******************************/
function removeRowEquipment() {
  const selectData = equipTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteEUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridEquipment.value.data = _.reject(gridEquipment.value.data, item)
          })
          equipTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}

/******************************
 * TODO (목적): 인허가관련 자재 추가
 *******************************/
function addRowMaterial() {
  popupOptions.value.width = '60%'
  popupOptions.value = getPopupOptions('chemMaterial', popupOptions.value, closeChem, {
    type: 'multiple'
  })
}

function closeChem(_data: Array<chemLicenseType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData: Array<chemLicenseType> = []
    _.forEach(_data, (item) => {
      if (_.findIndex(gridChem.value.data, { mdmChemMaterialId: item.mdmChemMaterialId }) === -1) {
        saveData.push({
          limLicenseId: props.popupParam.limLicenseId,
          materialCd: item.materialCd,
          materialName: item.materialName,
          mdmChemMaterialId: item.mdmChemMaterialId
        })
      }
    })
    $http({
      url: saveMUrl.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      message.requestSuccess()
      getChems(props.popupParam.limLicenseId)
    })
  }
}

/******************************
 * TODO (목적): 인허가관련 자재 삭제
 *******************************/
function removeRowMaterial() {
  const selectData = chemTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteMUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridChem.value.data = _.reject(gridChem.value.data, item)
          })
          chemTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 팝업에서 가져온 데이터 사용용
 *******************************/
function dataChange(data1?: any, data2?: any, data3?: any) {
  licenseData.value.relatedLawsName = data3.relatedLawsName
  licenseData.value.relatedLawsCd = data3.relatedLawsCd
}
</script>
<style lang="sass">
.customSelect2
  .q-field__control
    min-height: 28px !important
    .q-field__control-container
      padding: 0 0 0 5px !important
    .q-field__append
      top: -15px !important
</style>
