<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="합동점검 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="removeData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="checkData"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  required
                  :editable="editable"
                  label="합동점검명"
                  name="jointInspectionName"
                  v-model:value="checkData.jointInspectionName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="editable"
                  range
                  label="점검기간"
                  name="jointDts"
                  v-model:value="checkData.jointDts"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="checkData.plantCd"
                  @datachange="datachange"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-textarea
                  :editable="editable"
                  :rows="1"
                  label="내용"
                  name="remark"
                  v-model:value="checkData.remark"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-table
            ref="inTable"
            title="내부참석자 목록"
            :editable="editable"
            :columns="inGrid.columns"
            :gridHeight="gridHeight"
            :data="checkData.innerList"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            rowKey="userId"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addInner"
                />
                <c-btn
                  v-if="editable"
                  :showLoading="false"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeInner"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-table
            ref="vendorTable"
            title="참가 협력업체"
            :editable="editable"
            :columns="vendorGrid.columns"
            :gridHeight="gridHeight"
            :data="checkData.vendorList"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
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
                  v-if="editable"
                  :showLoading="false"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeVendor"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-table
            ref="outTable"
            title="외부참석자 목록"
            :editable="editable"
            :columns="outGrid.columns"
            :gridHeight="gridHeight"
            :data="checkData.outerList"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            rowKey="saiJointOuterUserId"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addOuter"
                />
                <c-btn
                  v-if="editable"
                  :showLoading="false"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeOuter"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="itemTable"
            title="점검항목"
            :editable="editable"
            :columns="itemGrid.columns"
            :gridHeight="itemGridHeight"
            :data="checkData.itemResultList"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            rowKey="jointInspectionResultId"
            selection="multiple"
          >
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'customCol'">
                <component
                  :is="imprComponent"
                  :col="col"
                  :props="props"
                  :inputEditable="editable"
                  :isImmShow="true"
                  :requestContentsCols="requestContentsCols"
                  tableKey="jointInspectionResultId"
                  ibmTaskTypeCd="ITT0000165"
                  ibmTaskUnderTypeCd="ITTU000180"
                  @imprChange="imprChange"
                />
              </template>
            </template>
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addResult"
                />
                <c-btn
                  v-if="editable"
                  :showLoading="false"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeResult"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-mt-md">
          <c-upload :attachInfo="attachInfo" :editable="editable" label="합동점검 관련 첨부파일" />
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
import {
  consolidationCheckPopupParamType,
  consolidationCheckType,
  consolidationCheckResultType
} from './consolidationCheck'
import { uid } from 'quasar'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'consolidationCheckInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: consolidationCheckPopupParamType
  isOld: boolean
  renewal: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<consolidationCheckResultType>
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
      saiJointInspectionId: ''
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const gridHeight = ref('250px')
const itemGridHeight = ref('350px')
const inGrid = ref({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width: 80px'
    },
    {
      name: 'userName',
      field: 'userName',
      label: '이름',
      style: 'width: 80px',
      align: 'center'
    },
    {
      name: 'jobName',
      field: 'jobName',
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
const outGrid = ref({
  columns: [
    {
      name: 'company',
      field: 'company',
      label: '소속',
      type: 'text',
      align: 'center',
      style: 'width: 80px',
      required: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '이름',
      style: 'width: 80px',
      type: 'text',
      required: true,
      align: 'center'
    },
    {
      name: 'jobName',
      field: 'jobName',
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
const vendorGrid = ref({
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
const itemGrid = ref<gridType>({
  columns: [],
  data: []
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'SOP_CONSOLIDATION_CHECK',
  taskKey: ''
})
const isSave = ref(false)
const detailUrl = ref('')
const itemListUrl = ref('')
const saveUrl = ref('')
const mappingType = ref('POST')
const deleteUrl = ref('')
const deleteInUrl = ref('')
const deleteOutUrl = ref('')
const deleteVendorUrl = ref('')
const deleteResultUrl = ref('')
const editForm = ref<any>('')
const inTable = ref<any>('')
const outTable = ref<any>('')
const itemTable = ref<any>('')
const vendorTable = ref<any>('')
const checkData = ref<consolidationCheckType>({
  saiJointInspectionId: '', // 합동점검 일련번호
  plantCd: '', // 사업장 코드
  jointInspectionName: '', // 합동점검명
  jointStartDt: '', // 점검시작일
  jointEndDt: '', // 점검종료일
  jointDts: [],
  remark: '', // 내용
  jointCompleteFlag: '', // 완료여부
  innerList: [],
  outerList: [],
  vendorList: [],
  itemResultList: []
})

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => (props.popupParam.saiJointInspectionId ? false : true))
const requestContentsCols = computed(() => ['jointItemName'])
const imprComponent = computed(() => {
  const components = defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
  return components
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.renewal,
  () => {
    getDetail()
  }
)

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
  detailUrl.value = selectConfig.sai.joint.get.url
  saveUrl.value = transactionConfig.sai.joint.insert.url
  deleteUrl.value = transactionConfig.sai.joint.delete.url
  deleteInUrl.value = transactionConfig.sai.joint.delete.inner
  deleteOutUrl.value = transactionConfig.sai.joint.delete.outer
  deleteVendorUrl.value = transactionConfig.sai.joint.delete.vendor
  deleteResultUrl.value = transactionConfig.sai.joint.delete.result
  itemListUrl.value = selectConfig.sai.joint.items.url
  // code setting
  // list setting
  setHeader()
  getDetail()
}
/******************************
 * TODO (목적): 테이블 헤더 정의
 *******************************/
function setHeader() {
  getComboItems('JOINT_RESULT_CD').then((_result: any) => {
    itemGrid.value.columns = [
      {
        name: 'jointItemName',
        field: 'jointItemName',
        label: '점검항목',
        align: 'left',
        type: 'textarea',
        style: 'width:30%',
        sortable: false
      },
      {
        required: true,
        name: 'jointResultCd',
        field: 'jointResultCd',
        label: '점검결과',
        setHeader: true,
        align: 'center',
        style: 'width:10%',
        type: 'select',
        comboItems: _result,
        sortable: false
      },
      {
        setHeader: true,
        name: 'jointContents',
        field: 'jointContents',
        label: '비고',
        align: 'left',
        type: 'textarea',
        style: 'width:30%',
        sortable: false
      },
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선/진행상태',
        align: 'center',
        type: 'custom',
        sortable: false
      }
    ]
  })
}
/******************************
 * TODO (목적): 합동점검 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.saiJointInspectionId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        saiJointInspectionId: props.popupParam.saiJointInspectionId
      }
    }).then((_result: any) => {
      checkData.value = _result.data

      attachInfo.value.taskKey = props.popupParam.saiJointInspectionId
    })
  } else {
    getOriItemList()
  }
}
/******************************
 * TODO (목적): 합동점검 항목 조회(NEW)
 *******************************/
function getOriItemList() {
  checkData.value.itemResultList = []
  $http({
    url: selectConfig.sai.joint.items.url,
    method: 'GET',
    params: {
      plantCd: checkData.value.plantCd,
      plantCdList: [checkData.value.plantCd],
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    _.forEach(_result.data, (_item) => {
      checkData.value.itemResultList!.push({
        saiJointInspectionId: props.popupParam.saiJointInspectionId,
        jointInspectionResultId: uid(),
        jointItemName: _item.jointItemName,
        jointResultCd: 'JRC0000001',
        jointContents: '',
        regUserId: user.value.userId,
        editFlag: 'C'
      })
    })
  })
}
// /******************************
//  * TODO (목적): 사업장 변경 emit
//  *******************************/
// function datachange(data: any) {
//   if (!data.value) {
//     return
//   } else {
//     getOriItemList()
//   }
// }
/******************************
 * TODO (목적): 내부 참석자 추가
 *******************************/
function addInner() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 내부 참석자 추가
 *******************************/
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (!checkData.value.innerList) checkData.value.innerList = []
    _.forEach(data, (_item) => {
      if (_.findIndex(data.attends, { userId: _item.userId }) === -1) {
        checkData.value.innerList!.push({
          saiJointInspectionId: props.popupParam.saiJointInspectionId, // 합동점검 일련번호
          userId: _item.userId, // 사용자 아이디
          userName: _item.userName,
          deptName: _item.deptName,
          jobName: _item.jobName,
          remark: '', // 비고
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}

/******************************
 * TODO (목적): 내부 참석자 삭제
 *******************************/
function removeInner() {
  const selectData = inTable.value.getSelected()
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
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteInUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            checkData.value.innerList = _.reject(checkData.value.innerList, item)
          })
          inTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 외부 참석자 추가
 *******************************/
function addOuter() {
  if (!checkData.value.outerList) checkData.value.outerList = []
  checkData.value.outerList.push({
    saiJointInspectionId: props.popupParam.saiJointInspectionId, // 합동점검 일련번호
    saiJointOuterUserId: uid(), // 합동점검 외부참석자 일련번호
    company: '', // 소속
    userName: '', // 이름
    jobName: '', // 직책
    remark: '', // 비고
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 외부 참석자 삭제
 *******************************/
function removeOuter() {
  const selectData = outTable.value.getSelected()
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
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteOutUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            checkData.value.outerList = _.reject(checkData.value.outerList, item)
          })
          outTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 협력업체 추가
 *******************************/
function addVendor() {
  popupOptions.value = getPopupOptions('vendor', popupOptions.value, closeVendorPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 협력업체 팝업 닫기 콜백
 *******************************/
function closeVendorPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      if (_.findIndex(checkData.value.vendorList, { vendorCd: _item.vendorCd }) === -1) {
        checkData.value.vendorList!.push({
          saiJointInspectionId: props.popupParam.saiJointInspectionId,
          vendorCd: _item.vendorCd,
          vendorName: _item.vendorName,
          remark: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 협력업체 삭제
 *******************************/
function removeVendor() {
  const selectData = vendorTable.value.getSelected()
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
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteVendorUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            checkData.value.vendorList = _.reject(checkData.value.vendorList, item)
          })
          vendorTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.saiJointInspectionId) {
    saveUrl.value = transactionConfig.sai.joint.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sai.joint.insert.url
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          checkData.value.regUserId = user.value.userId
          checkData.value.chgUserId = user.value.userId

          checkData.value.innerList = checkData.value.innerList!.filter((x: any) => {
            return x.editFlag == 'C' || x.editFlag == 'U'
          })
          checkData.value.outerList = checkData.value.outerList!.filter((x: any) => {
            return x.editFlag == 'C' || x.editFlag == 'U'
          })
          checkData.value.vendorList = checkData.value.vendorList!.filter((x: any) => {
            return x.editFlag == 'C' || x.editFlag == 'U'
          })
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
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.saiJointInspectionId = _result.data
  attachInfo.value.taskKey = props.popupParam.saiJointInspectionId
  attachInfo.value.isSubmit = uid()
  getDetail()
}
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiJointInspectionId),
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
function addResult() {
  checkData.value.itemResultList!.push({
    saiJointInspectionId: props.popupParam.saiJointInspectionId,
    jointInspectionResultId: uid(),
    jointItemName: '',
    jointResultCd: 'JRC0000001',
    jointContents: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
function removeResult() {
  const selectData = itemTable.value.getSelected()
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
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteResultUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            checkData.value.itemResultList = _.reject(checkData.value.itemResultList, item)
          })
          itemTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
// 개선창 닫기 후
function imprChange() {
  itemTable.value.compoTable.resetVirtualScroll()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
