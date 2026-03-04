<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.psiProtectionEpuipmentId"
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
                      v-model:value="protector.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="protector.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="protector.regUserName"
                    />
                  </div>
                  <div class="col-4">
                    <c-moc
                      :editable="editable"
                      :isSubmit="saveCallData"
                      :document="protector"
                      :documentId="protector.psiProtectionEpuipmentId"
                      documentTitle="areaName"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="protector.sopMocId"
                    />
                  </div>
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="protector.revisionContent"
                    />
                  </div>
                </div>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <c-card title="안전보호장구/비상방재물품 상세정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                :editable="!isRevision"
                v-if="popupParam.psiProtectionEpuipmentId"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="psiProtectionEpuipmentId"
                name="selectedpsiProtectionEpuipmentId"
                label=""
                v-model:value="selectedpsiProtectionEpuipmentId"
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
                    {{ $language('① 개인휴대용은 제외할 수 있다.') }}<br />
                    {{ $language('② 점검주기는 화학물질관리법에서 주1회로 요구된다.') }}
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-show="editable && popupParam.psiProtectionEpuipmentId && !isRevision"
                  label="개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.psiProtectionEpuipmentId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="protector"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
                <c-btn
                  v-if="editable && popupParam.psiProtectionEpuipmentId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-4">
                <c-select
                  :required="true"
                  :editable="editable"
                  codeGroupCd="SAFETY_EQUIP_TYPE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="safetyEquipTypeCd"
                  label="구분"
                  v-model:value="protector.safetyEquipTypeCd"
                />
              </div>
              <div class="col-4">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="관리번호"
                  name="manageNo"
                  v-model:value="protector.manageNo"
                />
              </div>
              <!-- <div class="col-4">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="protector.plantCd"
                />
              </div> -->
              <div class="col-6">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="지역(공정)"
                  name="areaName"
                  v-model:value="protector.areaName"
                />
              </div>
              <div class="col-6">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="품목"
                  name="itemName"
                  v-model:value="protector.itemName"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="설치장소"
                  name="location"
                  v-model:value="protector.location"
                />
              </div>
              <div class="col-6">
                <c-text
                  :editable="editable"
                  label="점검주기"
                  name="checkCycle"
                  v-model:value="protector.checkCycle"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="비고"
                  name="remarks"
                  v-model:value="protector.remarks"
                />
              </div>
              <div class="col-6">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="protector.plantCd"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="protector.processCd"
                />
              </div>
              <div class="col-6">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="protector.deptCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <c-table
            ref="table"
            title="세부품목"
            :columns="grid.columns"
            :data="grid.data"
            selection="multiple"
            rowKey="psiProtectionEpuipmentDetailId"
            :isFullScreen="false"
            :columnSetting="false"
            :filtering="false"
            :isExcelDown="false"
            gridHeight="450px"
          >
            <!-- 버튼 영역 -->
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && popupParam.psiProtectionEpuipmentId"
                  label="추가"
                  icon="add"
                  @btnClicked="addrow"
                />
                <c-btn
                  v-if="editable && popupParam.psiProtectionEpuipmentId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteItem"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { protectorType } from '@/views/psi/processSafetyInfo'

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
  name: 'washingFacilityPlanSafetyDetail'
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
    psiProtectionEpuipmentId?: stringNull
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

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      psiProtectionEpuipmentId: ''
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'detailItemName',
      field: 'detailItemName',
      label: '세부품목',
      align: 'center',
      type: 'text',
      sortable: false
    },
    {
      name: 'performanceStandard',
      field: 'performanceStandard',
      label: '성능 및 규격',
      align: 'center',
      type: 'text',
      sortable: false
    },
    {
      name: 'equipAmount',
      field: 'equipAmount',
      label: '비치수량',
      align: 'center',
      type: 'text',
      style: 'width:100px',
      sortable: false
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
const protector = ref<protectorType>({
  psiProtectionEpuipmentId: '', // 안전보호장구_비상방재물품_일련번호
  plantCd: '', // 사업장코드
  safetyEquipTypeCd: null, // 안전보호장구_비상방재물품 구분
  manageNo: '', // 관리번호
  areaName: '', // 지역(공정)
  itemName: '', // 품목
  location: '', // 비치장소
  checkCycle: '', // 점검주기
  processCd: '',
  deptCd: '',
  revisionNum: '',
  groupId: '',
  sysRevision: 1,
  revisionContent: '제정',
  regDtStr: '',
  regUserName: '',
  sopMocId: '',
  remarks: ''
})
const editable = ref(true)
const isSave = ref(false)
const isdelete = ref(false)
const isRevision = ref(false)
const selectedpsiProtectionEpuipmentId = ref<stringNull>(null)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.psi.lbe.protect.insert.url)
const deleteUrl = ref('')
const revlistUrl = ref('')
const saveCallData = ref('')
const itemlistUrl = ref('')
const itemsaveUrl = ref('')
const itemdeleteUrl = ref('')
const mappingType = ref('POST')
const editForm = ref<any>(null)
const table = ref<any>(null)

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
  detailUrl.value = selectConfig.psi.lbe.protect.get.url
  deleteUrl.value = transactionConfig.psi.lbe.protect.delete.url
  itemlistUrl.value = selectConfig.psi.lbe.protect.item.list.url
  itemsaveUrl.value = transactionConfig.psi.lbe.protect.item.save.url
  itemdeleteUrl.value = transactionConfig.psi.lbe.protect.item.delete.url
  revlistUrl.value = selectConfig.psi.lbe.protect.list.url + '/revs'
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.psiProtectionEpuipmentId) {
    getDetail(props.popupParam.psiProtectionEpuipmentId, true)
    selectedpsiProtectionEpuipmentId.value = props.popupParam.psiProtectionEpuipmentId
  }
}
function getDetail(_psiProtectionEpuipmentId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _psiProtectionEpuipmentId),
    method: 'GET'
  }).then((_result: any) => {
    protector.value = _result.data
    protector.value.regDtStr = protector.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    getList(_result.data.psiProtectionEpuipmentId)
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.psiProtectionEpuipmentId === props.popupParam.psiProtectionEpuipmentId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
  })
}
/******************************
 * TODO (목적): 세부항목 조회
 *******************************/
function getList(_psiProtectionEpuipmentId?: stringNull) {
  $http({
    url: $format(itemlistUrl.value, _psiProtectionEpuipmentId),
    method: 'GET'
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.psiProtectionEpuipmentId) {
    protector.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    protector.value.regUserId = user.value.userId
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
            protector.value.sysRevision = parseInt(protector.value.sysRevision) + 1
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
  props.popupParam.psiProtectionEpuipmentId = result.data.psiProtectionEpuipmentId
  saveCallData.value = uid()
  saveItem()
}
/******************************
 * TODO (목적): 세부항목 저장
 *******************************/
function saveItem() {
  const checkItem = ['detailItemName']
  let isConti = true
  _.forEach(grid.value.data, (item) => {
    _.forEach(checkItem, (check) => {
      if (!item[check]) {
        isConti = false
        return false
      }
    })
  })
  if (!isConti) {
    message.alert({
      title: '안내',
      message: '필수 입력값을 입력해 주세요. [세부품목]',
      type: 'warning' // success / info / warning / error
    })
  } else {
    let saveData = []
    if (isRevision.value) {
      saveData = grid.value.data
      _.forEach(saveData, (item) => {
        item.editFlag = 'C'
        item.regUserId = user.value.userId
        item.chgUserId = user.value.userId
        item.psiProtectionEpuipmentId = props.popupParam.psiProtectionEpuipmentId
      })
    } else {
      saveData = grid.value.data.filter((x) => x.editFlag == 'C' || x.editFlag == 'U')
      _.forEach(saveData, (item) => {
        item.regUserId = user.value.userId
        item.chgUserId = user.value.userId
        item.psiProtectionEpuipmentId = props.popupParam.psiProtectionEpuipmentId
      })
    }
    if (saveData.length > 0) {
      $http({
        url: itemsaveUrl.value,
        method: 'POST',
        data: saveData
      }).then(() => {
        message.requestSuccess()
        getData()
      })
    } else {
      getData()
      message.requestSuccess()
    }
  }
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
        url: $format(deleteUrl.value, props.popupParam.psiProtectionEpuipmentId),
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
 * TODO (목적): 세부항목 추가
 *******************************/
function addrow() {
  grid.value.data.push({
    editFlag: 'C',
    psiProtectionEpuipmentId: props.popupParam.psiProtectionEpuipmentId, // 안전보호장구_비상방재물품_일련번호
    psiProtectionEpuipmentDetailId: '', // 안전보호장구_비상방재물품_세부품목_일련번호
    detailItemName: '', // 세부품목
    performanceStandard: '', // 성능 및 규격
    equipAmount: '' // 비치수량
  })
}
/******************************
 * TODO (목적): 세부항목 삭제
 *******************************/
function deleteItem() {
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
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: itemdeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          table.value.compoTable.clearSelection()
        })
      },
      cancelCallback: () => {}
    })
  }
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
    params: { revisionNum: protector.value.revisionNum }
  }).then((_result: any) => {
    protector.value.revisionNum = _result.data
    protector.value.revisionContent = ''
    protector.value.regDtStr = ''
    protector.value.regUserName = ''
    protector.value.sopMocId = ''
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
    selectedpsiProtectionEpuipmentId.value = row
    if (selectedpsiProtectionEpuipmentId.value !== protector.value.psiProtectionEpuipmentId)
      getDetail(selectedpsiProtectionEpuipmentId.value, false)
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
