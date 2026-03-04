<template>
  <div>
    <q-form ref="editForm">
      <c-card class="cardClassDetailForm" title="상세">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && isOld"
              label="삭제"
              icon="delete"
              @btnClicked="deleteContruction"
            />
            <c-btn
              v-if="editable"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="construction"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveConstruction"
              @btnCallback="saveConstructionCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :required="true"
              :editable="editable"
              label="공사명"
              name="constructionName"
              v-model:value="construction.constructionName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              :required="true"
              :editable="editable"
              :range="true"
              label="공사기간"
              name="period"
              v-model:value="construction.period"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-task-target
              :editable="editable"
              :required="true"
              label="주 공사업체"
              :customPopupParam="{ targetKey: 'vendor' }"
              name="vendorCd"
              v-model:value="construction.vendorCd"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-moc
              :editable="editable"
              :isSubmit="saveCallData"
              :document="construction"
              :documentId="construction.sopConstructionId"
              documentTitle="constructionName"
              mocRelatedTaskCd="RT00000035"
              label="MOC번호"
              name="sopMocId"
              v-model:value="construction.sopMocId"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              type="number"
              label="안전보건관리비"
              name="safetyHealthManageCost"
              v-model:value="construction.safetyHealthManageCost"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="현장 총괄"
              name="onSiteManager"
              v-model:value="construction.onSiteManager"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="안전책임자"
              name="safetyManager"
              v-model:value="construction.safetyManager"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-checkbox
              :editable="editable"
              :isFlag="true"
              label="공사종료여부"
              name="constructionFinishFlag"
              v-model:value="construction.constructionFinishFlag"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-textarea
              :editable="editable"
              :rows="3"
              label="공사내역"
              name="constructionDetails"
              v-model:value="construction.constructionDetails"
            />
          </div>
        </template>
      </c-card>
    </q-form>
    <c-table
      ref="vendortable"
      title="공사 참여업체 목록"
      :columns="gridVendor.columns"
      :data="construction.vendors"
      :gridHeight="gridVendor.height"
      :editable="editable"
      :hideBottom="true"
      :isExcelDown="false"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="vendorCd"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && construction.vendors!.length > 0"
            label="제외"
            icon="remove"
            @btnClicked="deleteVendor"
          />
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addVendor" />
        </q-btn-group>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { constructionPopupParamType, constructionType } from './construction'

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
  name: 'constructionInfo'
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
const emits = defineEmits(['closePopup', 'getDetail', 'changeStatus'])

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
  popupParam: constructionPopupParamType
  construction: constructionType
  isOld: boolean
  contentHeight: stringNull
}
interface gridType {
  columns: tableColumnType
  height: stringNull
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
      sopConstructionId: ''
    }
  },
  construction: () => {
    return {
      sopConstructionId: '', // 공사 일련번호
      constructionName: '', // 공사명
      constructionDetails: '', // 공사내역
      constructionStartDate: '', // 공사 시작일
      constructionEndDate: '', // 공사 종료일
      period: [],
      constructionFinishFlag: 'N', // 공사 종료 여부
      safetyHealthManageCost: 0, // 안전보건관리비(총 액)
      costCenter: '', // 코스트센터
      onSiteManager: '', // 현장 총괄
      safetyManager: '', // 안전책임자
      vendorCd: '', // 주 공사업체
      sopMocId: '', // MOC 일련번호
      allConstructionCost: '',
      deptCd: '',
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      vendors: [], // 참영업체
      deleteVendors: [], // 참영업체 [삭제]
      entryVendors: [], // 업체출입 명단
      deleteEntryVendors: [], // 업체출입 명단 [삭제]
      entryUsers: [], // 출입자 명단
      deleteEntryUsers: [], // 출입자 명단 [삭제]
      equipments: [], // 장비 명세표
      deleteEquipments: [] // 장비 명세표 [삭제]
    }
  },
  isOld: false,
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
const gridVendor = ref<gridType>({
  columns: [
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '참여업체',
      align: 'center',
      style: 'width:120px',
      sortable: false,
      fix: true
    },
    {
      name: 'constructionDetails',
      field: 'constructionDetails',
      label: '공사내역',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'textarea',
      fix: true
    },
    {
      name: 'period',
      field: 'period',
      label: '참여기간',
      align: 'center',
      style: 'width:200px',
      sortable: false,
      type: 'date',
      range: true,
      fix: true
    },
    {
      name: 'attach1',
      field: 'attach1',
      label: '안전관리계획서',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_SAFETY_MANAGE_PLAN',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach2',
      field: 'attach2',
      label: '공사(작업)위험성평가',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_RISK_ASSESS',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach3',
      field: 'attach3',
      label: '작업계획서',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_WORK_PLAN',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach4',
      field: 'attach4',
      label: '교육결과',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_EDU_CERTI',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach5',
      field: 'attach5',
      label: '산업안전보건관리비 계획',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_MANAGE_COST_PLAN',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach6',
      field: 'attach6',
      label: '보험 증명원',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_INSURANCE_CERTI',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach7',
      field: 'attach7',
      label: '검진결과',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_HEA_CHECK',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach8',
      field: 'attach8',
      label: '안전검사증',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_SAFETY_INSP_CERTI',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach9',
      field: 'attach9',
      label: '설비제원표',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_EQUIP_SPEC_TABLE',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach10',
      field: 'attach10',
      label: '자격증명서<br/>(지게차, 크레인 등)',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_CREDENTIALS',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    },
    {
      name: 'attach11',
      field: 'attach11',
      label: '기타',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'SCM_CONSTRUNCTION_ETC',
      keyText: 'sopConstructionRelationVendorId',
      sortable: false
    }
  ],
  height: '440px'
})
const mappingType = ref('PUT')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const vendortable = ref<any>(null)
const editForm = ref<any>(null)
const saveCallData = ref('')

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
  saveUrl.value = transactionConfig.sop.scm.construction.insert.url
  deleteUrl.value = transactionConfig.sop.scm.construction.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 공사 업체 추가
 *******************************/
function addVendor() {
  popupOptions.value = getPopupOptions('vendor', popupOptions.value, closeVendorPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 공사 업체 선택 팝업 닫기 콜백
 *******************************/
function closeVendorPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item: any) => {
      if (_.findIndex(props.construction.vendors, { vendorCd: item.vendorCd }) === -1) {
        props.construction.vendors!.push({
          sopConstructionRelationVendorId: '', // 공사 참여업체 일련번호
          sopConstructionId: props.popupParam.sopConstructionId, // 공사 일련번호
          vendorCd: item.vendorCd, // 참여업체 코드
          vendorName: item.vendorName, // 참여업체 명
          constructionDetails: '', // 공사내역
          participationStartDate: '', // 참여 시작일
          participationEndDate: '', // 참여 종료일
          period: [],
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 공사 업체 삭제
 *******************************/
function deleteVendor() {
  const selectData = vendortable.value.getSelected()
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
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(selectData, (item: any) => {
          if (!props.construction.deleteVendors) {
            props.construction.deleteVendors = []
          }
          if (
            item.editFlag !== 'C' &&
            _.findIndex(props.construction.deleteVendors, { vendorCd: item.vendorCd }) === -1
          ) {
            props.construction.deleteVendors.push(item)
          }
          props.construction.vendors = _.reject(props.construction.vendors, item)
        })
        vendortable.value.compoTable.clearSelection()
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}

/******************************
 * TODO (목적): 공사 삭제
 *******************************/
function deleteContruction() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.sopConstructionId),
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
/******************************
 * TODO (목적): 공사 저장
 *******************************/
function saveConstruction() {
  if (props.isOld) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.sop.scm.construction.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.sop.scm.construction.insert.url
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.construction.regUserId = user.value.userId
          props.construction.chgUserId = user.value.userId
          props.construction.constructionStartDate = props.construction.period[0]
          props.construction.constructionEndDate = props.construction.period[1]

          if (props.construction.vendors && props.construction.vendors.length > 0) {
            _.forEach(props.construction.vendors, (vendor: any) => {
              if (vendor.period && vendor.period.length === 2 && vendor.period[0]) {
                vendor.participationStartDate = vendor.period[0]
                vendor.participationEndDate = vendor.period[1]
              } else {
                vendor.participationStartDate = null
                vendor.participationEndDate = null
              }
            })
          }
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * TODO (목적): 공사 저장 콜백
 *******************************/
function saveConstructionCallback(_result: any) {
  message.requestSuccess()
  saveCallData.value = uid()
  if (mappingType.value === 'POST') {
    props.popupParam.sopConstructionId = _result.data
    emits('changeStatus', _result.data)
  } else {
    emits('getDetail')
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
