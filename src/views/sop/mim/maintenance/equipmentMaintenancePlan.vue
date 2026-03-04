<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12">
        <c-table
          ref="table"
          title="설비 목록"
          :columns="grid.columns"
          :gridHeight="grid.height"
          :data="grid.data"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :isExcelDown="false"
          :editable="editable"
          :noDataLabel="
            $language('정비계획할 설비를 추가하세요. 저장할 시 정비결과를 등록 할 수 있습니다.')
          "
          selection="multiple"
          cardClass="topcolor-orange"
          rowKey="minEquipmentMaintenanceId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :showLoading="false"
                label="추가"
                icon="add"
                @btnClicked="add"
              />
              <c-btn
                v-if="editable && grid.data.length > 0"
                :showLoading="false"
                label="삭제"
                icon="remove"
                @btnClicked="remove"
              />
              <c-btn
                v-if="editable && grid.data.length > 0"
                :url="insertUrl"
                :isSubmit="isSave"
                :param="grid.data"
                mappingType="POST"
                label="저장"
                icon="save"
                @beforeAction="saveInspection"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props }">
            <q-btn
              class="tableinnerBtn tableinnerUserSearch"
              :class="{ 'tableinnerUserSearch-left': true, 'tableinnerUserSearch-right': true }"
              flat
              color="blue-6"
              :disable="props.row.disable"
              :label="props.row.sopMocName"
              icon="search"
              @click.stop="linkClick(props.row)"
            />
          </template>
        </c-table>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import {
  equipmentMaintenancePopupParamType,
  equipmentMaintenanceType
} from './equipmentMaintenance'

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
  name: 'equipmentMaintenancePlan'
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
const emits = defineEmits(['closePopup'])

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
  popupParam: equipmentMaintenancePopupParamType
  contentHeight: string
}
interface gridType {
  columns: tableColumnType
  data: Array<equipmentMaintenanceType>
  height: stringNull
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
      disabled: false,
      minEquipmentMaintenanceId: '',
      checkDate: '',
      selectData: []
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'equipmentNo',
      field: 'equipmentNo',
      label: '설비관리번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      style: 'width:120px',
      align: 'left',
      sortable: false
    },
    {
      name: 'sopMocName',
      field: 'sopMocName',
      label: 'MOC번호',
      align: 'center',
      style: 'width:180px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'equipmentCheckTypeCd',
      field: 'equipmentCheckTypeCd',
      label: '정비유형',
      required: true,
      align: 'center',
      style: 'width:130px',
      type: 'select',
      setHeader: true,
      comboItems: [
        { code: 'MMKC00005', codeName: '예방정비' },
        { code: 'MMKC00010', codeName: '예측정비' },
        { code: 'MMKC00015', codeName: '고장정비' },
        { code: 'MMKC00020', codeName: '운전정비' }
      ],
      sortable: false
    },
    {
      name: 'maintenanceDueUserName',
      field: 'maintenanceDueUserName',
      label: '정비예정자',
      required: true,
      align: 'center',
      style: 'width:120px',
      setHeader: true,
      type: 'user',
      userId: 'maintenanceDueUserId',
      sortable: false
    },
    {
      name: 'maintenanceDueDate',
      field: 'maintenanceDueDate',
      label: '정비예정일',
      required: true,
      setHeader: true,
      align: 'center',
      style: 'width:150px',
      type: 'date',
      sortable: false
    },
    {
      name: 'memDeptEntrantUserName',
      field: 'memDeptEntrantUserName',
      label: '정비부서 입회자',
      align: 'center',
      style: 'width:120px',
      setHeader: true,
      type: 'user',
      userId: 'memDeptEntrantUserId',
      sortable: false
    },
    {
      name: 'pmCycleName',
      field: 'pmCycleName',
      label: '예방정비주기',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'recentMaintainDate',
      field: 'recentMaintainDate',
      label: '최근정비일',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      align: 'left',
      style: 'width:200px',
      sortable: false
    }
  ],
  data: [],
  height: '700px'
})
const title = ref('')
const insertUrl = ref('')
const listUrl = ref('')
const completeUrl = ref('')
const deleteUrl = ref('')
const getUrl = ref('')
const isSave = ref(false)
const table = ref<any>(null)
const row = ref<any>(null)

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
  listUrl.value = selectConfig.sop.min.equipment.plan.list.url
  insertUrl.value = transactionConfig.sop.min.maintenance.plan.insert.url
  deleteUrl.value = transactionConfig.sop.min.maintenance.plan.delete.url
  completeUrl.value = transactionConfig.sop.min.maintenance.plan.complete.url
  getUrl.value = selectConfig.sop.min.equipment.annual.get.url
  // code setting
  if (props.popupParam.selectData.length > 0) {
    _.forEach(props.popupParam.selectData, (_item) => {
      grid.value.data.splice(0, 0, {
        minEquipmentMaintenanceId: uid(),
        plantCd: _item.plantCd,
        plantName: _item.plantName,
        memDeptEntrantUserId: '',
        memDeptEntrantUserName: '',
        sopMocId: '',
        sopMocName: '',
        equipmentCheckTypeCd: null,
        maintenanceStatusCd: 'MCSC000005',
        maintenanceDueUserName: '',
        maintenanceDueUserId: '',
        maintenanceDueDate: '',
        equipmentTypeCd: _item.equipmentTypeCd,
        equipmentTypeName: _item.equipmentTypeName,
        equipmentNo: _item.equipmentNo,
        equipmentCd: _item.equipmentCd,
        equipmentName: _item.equipmentName,
        pmCycleName: _item.pmCycleName,
        pmCycleCd: _item.pmCycleCd,
        recentMaintainDate: _item.recentMaintainDate,
        noPlanResultEnrollFlag: 'N',
        relatedLaws: _item.relatedLaws,
        relatedLawsName: _item.relatedLawsName,
        nextMonth: _item.nextMonth,
        regUserId: user.value.userId,
        chgUserId: user.value.userId,
        editFlag: 'C'
      })
    })
  }
  title.value = props.popupParam.title
  // list sett
}
/******************************
 * TODO (목적): 설비 추가
 *******************************/
function add() {
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeEquipmentPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    title: '정비'
  })
}
/******************************
 * TODO (목적): 설비 팝업 닫기 콜백
 *******************************/
function closeEquipmentPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      grid.value.data.splice(0, 0, {
        minEquipmentMaintenanceId: uid(),
        plantCd: _item.plantCd,
        plantName: _item.plantName,
        memDeptEntrantUserId: '',
        memDeptEntrantUserName: '',
        sopMocId: '',
        sopMocName: '',
        equipmentCheckTypeCd: null,
        maintenanceStatusCd: 'MCSC000005',
        maintenanceDueUserName: '',
        maintenanceDueUserId: '',
        maintenanceDueDate: '',
        equipmentTypeCd: _item.equipmentTypeCd,
        equipmentTypeName: _item.equipmentTypeName,
        equipmentNo: _item.equipmentNo,
        equipmentCd: _item.equipmentCd,
        equipmentName: _item.equipmentName,
        pmCycleName: _item.pmCycleName,
        pmCycleCd: _item.pmCycleCd,
        recentMaintainDate: _item.recentMaintainDate,
        noPlanResultEnrollFlag: 'N',
        relatedLaws: _item.relatedLaws,
        relatedLawsName: _item.relatedLawsName,
        nextMonth: _item.nextMonth,
        regUserId: user.value.userId,
        chgUserId: user.value.userId,
        editFlag: 'C'
      })
    })
  }
}
/******************************
 * TODO (목적): 설비 삭제
 *******************************/
function remove() {
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
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, {
              minEquipmentMaintenanceId: item.minEquipmentMaintenanceId
            })
          })
          message.requestSuccess()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 설비 저장
 *******************************/
function saveInspection() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  emit('SAVE')
}
/******************************
 * TODO (목적): 닫기 콜백
 *******************************/
function emit(result: string) {
  if (result === 'COMPLETE') emits('closePopup', result)
  else if (result === 'SAVE') emits('closePopup', result)
}
/******************************
 * TODO (목적): MOC 링크 클릭
 *******************************/
function linkClick(_row: any) {
  popupOptions.value = getPopupOptions('moc', popupOptions.value, closeMocPopup, {
    /** 원하는 parameter 정의 */
    type: 'single'
  })
  row.value = _row
}
/******************************
 * TODO (목적): MOC 팝업 닫기 콜백
 *******************************/
function closeMocPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    row.value.sopMocName = data[0].mocTypeName + ' / ' + data[0].mocNo
    row.value.sopMocId = data[0].sopMocId
    if (row.value.editFlag !== 'C') {
      row.value.editFlag = 'U'
      row.value.chgUserId = user.value.userId
    }
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
