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
            $language('점검계획할 설비를 추가하세요. 저장할 시 점검결과를 등록 할 수 있습니다.')
          "
          selection="multiple"
          :checkClickFlag="false"
          cardClass="topcolor-orange"
          @linkClick="linkClick"
          rowKey="minEquipmentCheckId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:suffixTitle>
            <span style="color: tomato">
              {{ $language('※ 법정설비가 아닌 경우 점검유형은 자체(일상)로 고정됩니다.') }}
            </span>
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="popupParam.equipmentCd && editable"
                :showLoading="false"
                label="추가"
                icon="add"
                @btnClicked="addRow"
              />
              <c-btn
                v-if="!popupParam.equipmentCd && editable"
                :showLoading="false"
                label="설비선택"
                icon="add"
                @btnClicked="add"
              />
              <c-btn
                v-if="editable && grid.data!.length > 0"
                :showLoading="false"
                label="삭제"
                icon="remove"
                @btnClicked="remove"
              />
              <c-btn
                v-if="editable && grid.data!.length > 0"
                :url="insertUrl"
                :isSubmit="isSave"
                :param="saveList"
                mappingType="POST"
                label="저장"
                icon="save"
                @beforeAction="saveInspection"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props: bodyProps, col }">
            <template v-if="col.name === 'sopMocName'">
              <q-btn
                class="tableinnerBtn tableinnerUserSearch"
                :class="{ 'tableinnerUserSearch-left': true, 'tableinnerUserSearch-right': true }"
                flat
                color="blue-6"
                :disable="bodyProps.row.disable"
                :label="bodyProps.row.sopMocName"
                icon="search"
                @click.stop="linkClick(bodyProps.row)"
              />
            </template>
            <template v-if="col.name === 'statusCd'">
              <q-chip
                outline
                square
                :color="setTagColor(bodyProps.row.statusCd)"
                :class="bodyProps.row.statusCd === 'MCSC000020' ? 'blinking' : null"
              >
                <q-icon
                  v-if="bodyProps.row.statusCd === 'MCSC000020'"
                  name="alarm"
                  style="margin-right: 5px"
                />
                {{ setTagName(bodyProps.row.statusCd) }}
              </q-chip>
            </template>
            <template v-if="col.name === 'equipmentCheckKindCd'">
              <c-select
                v-if="bodyProps.row.lawEquipmentFlag === 'Y'"
                class="no-label-control"
                :disabled="bodyProps.row.disable"
                codeGroupCd="MDM_CHECK_KIND_CD"
                :editable="editable"
                type="edit"
                itemValue="code"
                itemText="codeName"
                v-model:value="bodyProps.row['equipmentCheckKindCd']"
                @datachange="datachange(bodyProps)"
              />
              <c-select
                v-else
                class="no-label-control"
                :disabled="true"
                :editable="editable"
                type="edit"
                itemValue="code"
                itemText="codeName"
                :comboItems="[{ code: 'MCKC000005', codeName: $language('자체(일상)') }]"
                v-model:value="bodyProps.row['equipmentCheckKindCd']"
                @datachange="datachange(bodyProps)"
              />
            </template>
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

import { equipPlanPopupParamType, equipPlanType } from './equipmentPlan'

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
  name: 'equipmentPlan'
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
  popupParam: equipPlanPopupParamType
  contentHeight: string
}
interface gridType {
  columns: tableColumnType
  data: Array<equipPlanType>
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
      equipmentCd: '',
      plantCd: '',
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
const title = ref('')
const getUrl = ref('')
const insertUrl = ref('')
const completeUrl = ref('')
const deleteUrl = ref('')
const data = ref<any>({
  equipmentCd: ''
})
const isSave = ref(false)
const updateMode = ref(false)
const saveList = ref<any>([])
const colorItems = ref<stepMasterType>([])
const row = ref<any>(null)
const grid = ref<gridType>({
  columns: [],
  data: [],
  height: '800px'
})
const table = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => grid.value.data,
  () => {
    saveList.value = _.filter(grid.value.data, { checkStatusCd: 'MCSC000005' })
  },
  { deep: true }
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
  insertUrl.value = transactionConfig.sop.min.equipment.plan.insert.url
  deleteUrl.value = transactionConfig.sop.min.equipment.plan.delete.url
  completeUrl.value = transactionConfig.sop.min.equipment.plan.complete.url
  getUrl.value = selectConfig.sop.min.equipment.annual.get.url
  // code setting
  title.value = props.popupParam.title
  colorItems.value = [
    { stepperMstCd: '', stepperMstNm: $language('작성중'), colorClass: 'gray-6' },
    { stepperMstCd: 'MCSC000005', stepperMstNm: $language('계획수립'), colorClass: 'blue' },
    { stepperMstCd: 'MCSC000010', stepperMstNm: $language('점검중'), colorClass: 'orange' },
    { stepperMstCd: 'MCSC000015', stepperMstNm: $language('점검완료'), colorClass: 'green' },
    { stepperMstCd: 'MCSC000020', stepperMstNm: $language('지연'), colorClass: 'red' }
  ]
  // list setting
  getList()
  setHeader()
}
/******************************
 * TODO (목적): 테이블 헤더 세팅
 *******************************/
function setHeader() {
  grid.value.columns = [
    {
      name: 'statusCd',
      field: 'statusCd',
      label: '진행상태',
      style: 'width:100px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      required: true,
      setHeader: true,
      name: 'checkDeptName',
      field: 'checkDeptName',
      label: '점검부서',
      style: 'width:140px',
      type: 'dept',
      align: 'center',
      sortable: false,
      deptCd: 'checkDeptCd'
    },
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      style: 'width:120px',
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
      style: 'width:100px',
      align: 'left',
      sortable: false
    },
    {
      name: 'sopMocName',
      field: 'sopMocName',
      label: 'MOC번호',
      align: 'center',
      style: 'width:160px',
      sortable: false,
      type: 'custom'
    },
    {
      required: true,
      name: 'equipmentCheckKindCd',
      field: 'equipmentCheckKindCd',
      label: '점검유형',
      style: 'width:140px',
      type: 'custom',
      headType: 'select',
      align: 'center',
      setHeader: true,
      comboItems: [
        { code: 'MCKC000005', codeName: $language('자체(일상)') },
        { code: 'MCKC000010', codeName: $language('법정(정기)') }
      ],
      sortable: false
    },
    {
      name: 'checkScheduleUserName',
      field: 'checkScheduleUserName',
      label: '점검예정자',
      required: true,
      align: 'center',
      style: 'width:120px',
      setHeader: true,
      type: 'user',
      userId: 'checkScheduleUserId',
      sortable: false
    },
    {
      setHeader: true,
      name: 'checkScheduleDate',
      field: 'checkScheduleDate',
      label: '점검예정일',
      required: true,
      align: 'center',
      style: 'width:110px',
      type: 'date',
      sortable: false
    },
    {
      name: 'inspectionCycleName',
      field: 'inspectionCycleName',
      label: '법정주기',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'selfCycleName',
      field: 'selfCycleName',
      label: '자체주기',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'recentInspectionDate',
      field: 'recentInspectionDate',
      label: '최근법정점검일',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'recentSelfDate',
      field: 'recentSelfDate',
      label: '최근자체점검일',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      align: 'left',
      style: 'width:250px',
      sortable: false
    }
  ]
}
/******************************
 * TODO (목적): 설비계획 월별 조회
 *******************************/
function getList() {
  if (props.popupParam.equipmentCd) {
    $http({
      url: $format(getUrl.value, props.popupParam.equipmentCd, props.popupParam.checkDate),
      method: 'GET'
    }).then((_result: any) => {
      grid.value.data = _result.data
      updateMode.value = true
    })

    $http({
      url: selectConfig.mdm.equipment.list.url,
      method: 'GET',
      params: {
        equipmentCd: props.popupParam.equipmentCd,
        plantCd: props.popupParam.plantCd
      }
    }).then((_result: any) => {
      if (_result.data) {
        data.value = _result.data[0]
      }
    })
  }
}
/******************************
 * TODO (목적): 설비 추가
 *******************************/
function add() {
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeEquipmentPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    title: '점검'
  })
}
/******************************
 * TODO (목적): 직접추가
 *******************************/
function addRow() {
  grid.value.data.splice(0, 0, {
    minEquipmentCheckId: uid(),
    plantCd: data.value.plantCd,
    plantName: data.value.plantName,
    checkDeptCd: '',
    checkDeptName: '',
    sopMocId: '',
    sopMocName: '',
    equipmentCheckKindCd: data.value.lawEquipmentFlag === 'N' ? 'MCKC000005' : null,
    statusCd: '',
    checkStatusCd: 'MCSC000005',
    checkScheduleUserName: '',
    checkScheduleUserId: '',
    checkScheduleDate: '',
    equipmentTypeCd: data.value.equipmentTypeCd,
    equipmentTypeName: data.value.equipmentTypeName,
    equipmentNo: data.value.equipmentNo,
    equipmentCd: data.value.equipmentCd,
    equipmentName: data.value.equipmentName,
    inspectionCycleName: data.value.inspectionCycleName,
    inspectionCycleCd: data.value.inspectionCycleCd,
    lawEquipmentFlag: data.value.lawEquipmentFlag,
    selfCycleName: data.value.selfCycleName,
    selfCycleCd: data.value.selfCycleCd,
    recentInspectionDate: data.value.recentInspectionDate,
    recentSelfDate: data.value.recentSelfDate,
    relatedLawsName: data.value.relatedLawsName,
    relatedLaws: data.value.relatedLaws,
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    noPlanResultEnrollFlag: 'N',
    editFlag: 'C'
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
        minEquipmentCheckId: uid(),
        plantCd: _item.plantCd,
        plantName: _item.plantName,
        checkDeptCd: '',
        checkDeptName: '',
        sopMocId: '',
        sopMocName: '',
        equipmentCheckKindCd: _item.lawEquipmentFlag === 'N' ? 'MCKC000005' : null,
        statusCd: '',
        checkStatusCd: 'MCSC000005',
        checkScheduleUserName: '',
        checkScheduleUserId: '',
        checkScheduleDate: '',
        equipmentTypeCd: _item.equipmentTypeCd,
        equipmentTypeName: _item.equipmentTypeName,
        equipmentNo: _item.equipmentNo,
        equipmentCd: _item.equipmentCd,
        equipmentName: _item.equipmentName,
        inspectionCycleName: _item.inspectionCycleName,
        lawEquipmentFlag: _item.lawEquipmentFlag,
        inspectionCycleCd: _item.inspectionCycleCd,
        selfCycleName: _item.selfCycleName,
        selfCycleCd: _item.selfCycleCd,
        recentInspectionDate: _item.recentInspectionDate,
        recentSelfDate: _item.recentSelfDate,
        relatedLawsName: _item.relatedLawsName,
        relatedLaws: _item.relatedLaws,
        regUserId: user.value.userId,
        chgUserId: user.value.userId,
        noPlanResultEnrollFlag: 'N',
        editFlag: 'C'
      })
      // }
    })
  }
}
/******************************
 * TODO (목적): 점검 저장
 *******************************/
function saveInspection() {
  if (grid.value.data.length === 0) {
    message.alert({
      title: '안내',
      message: '설비를 추가하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback() {
  emit('SAVE')
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
              minEquipmentCheckId: item.minEquipmentCheckId
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
 * TODO (목적): 닫기 콜백
 *******************************/
function emit(result: string) {
  if (result === 'COMPLETE') {
    emits('closePopup', result)
  } else if (result === 'SAVE') {
    emits('closePopup', result)
  }
}
/******************************
 * TODO (목적): Tag 색 지정
 *******************************/
function setTagColor(data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { stepperMstCd: data })
    return color ? color.attrVal1 || color.colorClass : ''
  } else {
    return ''
  }
}
/******************************
 * TODO (목적): Tag 이름 지정
 *******************************/
function setTagName(data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { stepperMstCd: data })
    return color ? color.codeName || color.stepperMstNm : ''
  } else {
    return ''
  }
}
/******************************
 * TODO (목적): 테이블 custom datachange
 *******************************/
function datachange(_props?: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // table.value.acceptData(_props.row, col.name, _props.row[col.name])
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
