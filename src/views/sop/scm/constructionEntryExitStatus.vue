<template>
  <div>
    <q-form ref="editForm">
      <c-card class="cardClassDetailForm" title="출입 정보">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="construction"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveConstruction"
              @btnCallback="saveConstructionCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
            <c-table
              ref="entryVendorsTable"
              title="일자별 업체 출입현황"
              :columns="gridEntryVendor.columns"
              :data="construction.entryVendors"
              :gridHeight="gridEntryVendor.height"
              :editable="editable"
              :hideBottom="true"
              :isExcelDown="false"
              :filtering="false"
              :isFullScreen="false"
              :columnSetting="false"
              selection="multiple"
              rowKey="sopConstructionEntryVendorsId"
            >
              <!-- 버튼 영역 -->
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable && construction.entryVendors!.length > 0"
                    label="제외"
                    icon="remove"
                    @btnClicked="deleteVendor"
                  />
                  <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addVendor" />
                </q-btn-group>
              </template>
            </c-table>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
            <c-table
              ref="equipmentsTable"
              title="장비 명세표"
              :columns="gridEquipment.columns"
              :data="construction.equipments"
              :gridHeight="gridEquipment.height"
              :editable="editable"
              :hideBottom="true"
              :isExcelDown="false"
              :filtering="false"
              :isFullScreen="false"
              :columnSetting="false"
              selection="multiple"
              rowKey="sopConstructionEquipmentId"
            >
              <!-- 버튼 영역 -->
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable && construction.equipments!.length > 0"
                    label="제외"
                    icon="remove"
                    @btnClicked="deleteEquipment"
                  />
                  <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addEquipment" />
                </q-btn-group>
              </template>
            </c-table>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-table
              ref="entryUsersTable"
              title="출입자 명단"
              :columns="gridEntryUser.columns"
              :data="construction.entryUsers"
              :gridHeight="gridEntryUser.height"
              :editable="editable"
              :hideBottom="true"
              :isExcelDown="false"
              :filtering="false"
              :isFullScreen="false"
              :columnSetting="false"
              selection="multiple"
              rowKey="sopConstructionEntryUsersId"
            >
              <!-- 버튼 영역 -->
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable && construction.entryUsers!.length > 0"
                    label="제외"
                    icon="remove"
                    @btnClicked="deleteUser"
                  />
                  <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addUser" />
                </q-btn-group>
              </template>
            </c-table>
          </div>
        </template>
      </c-card>
    </q-form>

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
const gridEntryVendor = ref<gridType>({
  columns: [
    {
      name: 'jobDate',
      field: 'jobDate',
      label: '작업일자',
      align: 'center',
      style: 'width: 150px',
      type: 'date',
      sortable: false
    },
    {
      name: 'vendorCd',
      field: 'vendorCd',
      label: 'seq',
      style: 'width: 100px',
      align: 'center'
    },
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '업체명',
      style: 'width: 150px',
      align: 'center'
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '작업명',
      align: 'left',
      style: 'width: 250px',
      type: 'text',
      sortable: false
    },
    {
      name: 'jobPlace',
      field: 'jobPlace',
      label: '작업장소',
      align: 'left',
      style: 'width: 150px',
      type: 'text',
      sortable: false
    },
    {
      name: 'personnel',
      field: 'personnel',
      label: '인원',
      align: 'right',
      style: 'width: 100px',
      type: 'number',
      sortable: false
    },
    {
      name: 'status',
      field: 'status',
      label: '상태',
      align: 'left',
      style: 'width: 100px',
      type: 'text',
      sortable: false
    }
  ],
  height: '400px'
})
const gridEntryUser = ref<gridType>({
  columns: [
    {
      name: 'jobName',
      field: 'jobName',
      label: '직책',
      style: 'width: 100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'userName',
      field: 'userName',
      label: '이름',
      style: 'width: 100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      label: '생년월일',
      style: 'width: 100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'address',
      field: 'address',
      label: '주소',
      style: 'width: 200px',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'sex',
      field: 'sex',
      label: '성별',
      style: 'width: 80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'eduDate',
      field: 'eduDate',
      label: '교육만기일',
      align: 'center',
      style: 'width: 100px',
      type: 'date',
      sortable: false
    },
    {
      name: 'resident',
      field: 'resident',
      label: '상주',
      align: 'left',
      style: 'width: 130px',
      type: 'text',
      sortable: false
    }
  ],
  height: '400px'
})
const gridEquipment = ref<gridType>({
  columns: [
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'left',
      type: 'text',
      style: 'width: 250px',
      sortable: false
    },
    {
      name: 'carNo',
      field: 'carNo',
      label: '차량번호',
      align: 'left',
      type: 'text',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'standard',
      field: 'standard',
      label: '규격',
      align: 'left',
      type: 'text',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'equipmentCount',
      field: 'equipmentCount',
      label: '수량',
      align: 'right',
      type: 'number',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'safeFlag',
      field: 'safeFlag',
      label: '안전장치 부착여부',
      align: 'center',
      type: 'check',
      true: 'Y',
      false: 'N',
      style: 'width: 100px',
      sortable: false
    }
  ],
  height: '400px'
})
const saveUrl = ref('')
const isSave = ref(false)
const entryVendorsTable = ref<any>(null)
const entryUsersTable = ref<any>(null)
const equipmentsTable = ref<any>(null)
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
  saveUrl.value = transactionConfig.sop.scm.construction.entry.save.url
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
      // if (_.findIndex(props.construction.entryVendors, { vendorCd: item.vendorCd }) === -1) {
      props.construction.entryVendors!.push({
        sopConstructionEntryVendorsId: uid(),
        sopConstructionId: props.construction.sopConstructionId,
        vendorCd: item.vendorCd,
        vendorName: item.vendorName,
        jobName: '',
        jobDate: '',
        jobPlace: '',
        personnel: '',
        status: '',
        regUserId: user.value.userId,
        editFlag: 'C'
      })
      // }
    })
  }
}
/******************************
 * TODO (목적): 공사 업체 삭제
 *******************************/
function deleteVendor() {
  const selectData = entryVendorsTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!props.construction.deleteEntryVendors) {
        props.construction.deleteEntryVendors = []
      }
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.construction.deleteEntryVendors, { vendorCd: item.vendorCd }) === -1
      ) {
        props.construction.deleteEntryVendors.push(item)
      }
      props.construction.entryVendors = _.reject(props.construction.entryVendors, item)
    })
    entryVendorsTable.value.compoTable.clearSelection()
  }
}

/******************************
 * TODO (목적): 공사 업체 추가
 *******************************/
function addUser() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
  // props.construction.entryUsers!.push({
  //   sopConstructionEntryUsersId: uid(),
  //   sopConstructionId: props.construction.sopConstructionId,
  //   jobName: '',
  //   userId: '',
  //   userName: '',
  //   birthDate: '',
  //   address: '',
  //   sex: '',
  //   eduDate: '',
  //   resident: '',
  //   regUserId: user.value.userId,
  //   editFlag: 'C'
  // })
}
/******************************
 * TODO (목적): 공사 출입자 선택 팝업 닫기 콜백
 *******************************/
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item: any) => {
      if (_.findIndex(props.construction.entryUsers, { userId: item.userId }) === -1) {
        props.construction.entryUsers!.push({
          sopConstructionEntryUsersId: uid(),
          sopConstructionId: props.construction.sopConstructionId,
          jobName: item.jobName,
          userId: item.userId,
          userName: item.userName,
          birthDate: item.birthDate,
          address: item.address,
          sex: item.sexName,
          eduDate: '',
          resident: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 공사 출입자 삭제
 *******************************/
function deleteUser() {
  const selectData = entryUsersTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!props.construction.deleteEntryUsers) {
        props.construction.deleteEntryUsers = []
      }
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.construction.deleteEntryUsers, { userId: item.userId }) === -1
      ) {
        props.construction.deleteEntryUsers!.push(item)
      }
      props.construction.entryUsers = _.reject(props.construction.entryUsers, item)
    })
    entryUsersTable.value.compoTable.clearSelection()
  }
}

/******************************
 * TODO (목적): 공사 업체 추가
 *******************************/
function addEquipment() {
  props.construction.equipments!.push({
    sopConstructionEquipmentId: uid(),
    sopConstructionId: props.construction.sopConstructionId,
    equipmentName: '', // 설비명
    carNo: '', // 차량번호
    standard: '', // 규격
    equipmentCount: '', // 수량
    safeFlag: 'N', // 안전장치 부착여부
    remark: '', // 비고
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 공사 출입자 삭제
 *******************************/
function deleteEquipment() {
  const selectData = equipmentsTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!props.construction.deleteEquipments) {
        props.construction.deleteEquipments = []
      }
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.construction.deleteEquipments, {
          sopConstructionEquipmentId: item.sopConstructionEquipmentId
        }) === -1
      ) {
        props.construction.deleteEquipments.push(item)
      }
      props.construction.equipments = _.reject(props.construction.equipments, item)
    })
    equipmentsTable.value.compoTable.clearSelection()
  }
}

/******************************
 * TODO (목적): 공사 저장
 *******************************/
function saveConstruction() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
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
  emits('getDetail')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
