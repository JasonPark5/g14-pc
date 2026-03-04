<template>
  <div>
    <q-form ref="editForm">
      <c-card
        title="SOP 부가정보 (작업정보에서 저장하시면 부가정보도 저장됩니다)"
        class="cardClassDetailForm"
      >
        <template v-slot:card-detail>
          <div class="col-xs-6 col-sm-12 col-md-3 col-lg-3">
            <c-select
              codeGroupCd="HAZARD_GRADE_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="hazardGradeCd"
              label="위험등급"
              v-model:value="sop.hazardGradeCd"
            />
          </div>
          <div class="col-xs-6 col-sm-12 col-md-3 col-lg-3">
            <c-field
              :editable="editable"
              label="작업자"
              name="workerName"
              v-model:value="sop.workerName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-text
              :editable="editable"
              label="안전보호구"
              name="saftyShied"
              v-model:value="sop.saftyShied"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-textarea
              :editable="editable"
              :rows="3"
              label="적용범위"
              name="applyRange"
              v-model:value="sop.applyRange"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-textarea
              :editable="editable"
              :rows="3"
              label="목적"
              name="purpose"
              v-model:value="sop.purpose"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <c-textarea
              :counter="true"
              :maxlength="200"
              :editable="editable"
              :rows="3"
              label="작업시 안전주의사항"
              name="saftyCaution"
              v-model:value="sop.saftyCaution"
            />
          </div>
        </template>
      </c-card>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 margincard-0">
          <c-table
            ref="mmEquipTable"
            title="관련 설비"
            :columns="gridMmEquip.columns"
            :data="sop.mmEquips"
            gridHeight="284px"
            selection="multiple"
            rowKey="mdmSopMmCd"
            :isFullScreen="false"
            :columnSetting="false"
            :filtering="false"
            :usePaging="false"
            :isExcelDown="false"
            :hideBottom="true"
            topBorderClass="topcolor-blue"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && isOld"
                  label="추가"
                  icon="add"
                  @btnClicked="addRowMmEquip"
                />
                <c-btn
                  v-if="editable && isOld && sop.mmEquips!.length > 0"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeRowMmEquip"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 margincard-0">
          <c-table
            ref="mmMachineTable"
            title="관련 유해위험기계기구"
            :columns="gridMmMacine.columns"
            :data="sop.mmMachines"
            gridHeight="284px"
            selection="multiple"
            rowKey="mdmSopMmCd"
            :isFullScreen="false"
            :columnSetting="false"
            :filtering="false"
            :usePaging="false"
            :isExcelDown="false"
            :hideBottom="true"
            topBorderClass="topcolor-blue"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && isOld"
                  label="추가"
                  icon="add"
                  @btnClicked="addRowMmMachine"
                />
                <c-btn
                  v-if="editable && isOld && sop.mmMachines!.length > 0"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeRowMmMachine"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 margincard-0">
          <c-table
            ref="chemTable"
            title="관련 화학물질"
            tableId="chemTable"
            :columns="gridChem.columns"
            :data="sop.chems"
            gridHeight="284px"
            selection="multiple"
            rowKey="mdmSopChemCd"
            :isFullScreen="false"
            :columnSetting="false"
            :filtering="false"
            :usePaging="false"
            :isExcelDown="false"
            :hideBottom="true"
            topBorderClass="topcolor-blue"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn v-if="editable && isOld" label="추가" icon="add" @btnClicked="addrowChem" />
                <c-btn
                  v-if="editable && isOld && sop.chems!.length > 0"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removeRowChem"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </div>
    </q-form>
    <c-dialog :param="popupOptions" />
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
import { sopType } from './sopInfo'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'sopAdditionalInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    mdmSopId: stringNull
  }
  sop: sopType
  isOld: boolean
}
interface gridType {
  columns: tableColumnType
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
      mdmSopId: ''
    }
  },
  sop: () => {
    return {
      mdmSopId: '', // 안전작업 표준 일련번호
      plantCd: null, // 사업장코드
      subProcessCd: '', // 단위공정 코드
      sopNo: '', // 안전작업 표준 번호
      sopName: '', // 세부공정(작업) 명
      revNo: '', // 개정번호
      revReason: '', // 개정사유
      applyRange: '', // 적용범위
      purpose: '', // 목적
      hazardGradeCd: null, // 위험등급 1 ~ 5등급
      workTypeCd: null, // 작업유형 : 특별안전, 일반안전, 단순일상
      workKindCd: null, // 작업형태 : Gas, 고소, 굴착/매설, 방사선, 전기, 지게차, 기타
      workClassCd: null, // 작업구분 : Set-up, PM, BM, Part교체, 기타
      workerName: '', // 작업자
      managementDepts: '', // 관리부서 복수
      managementDepts2: '', // 관리부서 복수
      saftyShied: '', // 안전보호구
      saftyCaution: '', // 안전주의사항
      sopMocId: '',
      useFlag: 'Y', // 사용여부
      revisionNum: '',
      groupId: '',
      sysRevision: 1,
      revisionContent: '제정',
      regDtStr: '',
      regUserName: '',
      regUserId: '',
      chgUserId: '',
      revSelectValue: null,
      sopSteps: [], // 작업단계 목록
      revs: [], // 개정 목록
      mmEquips: [], // 설비 목록
      mmMachines: [], // 기계기구 목록
      chems: [], // 화학자재 목록
      sopSummary: [] // 요약정보
    }
  },
  isOld: false
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
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const gridMmMacine = ref<gridType>({
  columns: [
    {
      name: 'equipMachineCd',
      field: 'equipMachineCd',
      label: '기계기구 번호',
      align: 'center',
      sortable: true
    },
    {
      name: 'equipMachineName',
      field: 'equipMachineName',
      label: '기계기구명',
      align: 'center',
      sortable: true
    }
  ]
})
const gridMmEquip = ref<gridType>({
  columns: [
    {
      name: 'equipmentNo',
      field: 'equipmentNo',
      label: '설비관리번호',
      align: 'center',
      sortable: true
    },
    {
      name: 'equipMachineName',
      field: 'equipMachineName',
      label: '설비명',
      align: 'center',
      sortable: true
    }
  ]
})
const gridChem = ref<gridType>({
  columns: [
    {
      name: 'mdmChemMaterialCd',
      field: 'mdmChemMaterialCd',
      label: '화학자재번호',
      align: 'center',
      sortable: true
    },
    {
      name: 'mdmChemMaterialName',
      field: 'mdmChemMaterialName',
      label: '화학자재명',
      align: 'center',
      sortable: true
    }
  ]
})
const editForm = ref<HTMLFormElement | null>(null)
const mmEquipTable = ref<any>(null)
const mmMachineTable = ref<any>(null)
const chemTable = ref<any>(null)
const saveUrl = ref('')
const listMmUrl = ref('')
const insertMmUrl = ref('')
const deleteMmUrl = ref('')
const listChemUrl = ref('')
const insertChemUrl = ref('')
const deleteChemUrl = ref('')
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
  saveUrl.value = transactionConfig.mdm.sop.job.update.url
  listMmUrl.value = selectConfig.mdm.sop.mm.list.url
  insertMmUrl.value = transactionConfig.mdm.sop.mm.insert.url
  deleteMmUrl.value = transactionConfig.mdm.sop.mm.delete.url
  listChemUrl.value = selectConfig.mdm.sop.chems.list.url
  insertChemUrl.value = transactionConfig.mdm.sop.chem.insert.url
  deleteChemUrl.value = transactionConfig.mdm.sop.chem.delete.url
  // code setting
  // list setting
}
function getMmMachines() {
  if (props.isOld) {
    $http({
      url: listMmUrl.value,
      method: 'GET',
      params: {
        mdmSopId: props.popupParam.mdmSopId,
        equipMachineTypeCd: 'EMT0000002'
      }
    }).then((_result: any) => {
      props.sop.mmMachines = _result.data
    })
  }
}
function addRowMmMachine() {
  popupOptions.value = getPopupOptions('hazardequip', popupOptions.value, closePopMmMachine, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: { plantCd: props.sop.plantCd }
  })
}
function closePopMmMachine(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData = [] as any
    _.forEach(data, (item) => {
      if (
        _.findIndex(props.sop.mmMachines, {
          equipMachineCd: item.hhmHazardousMachineryId
        }) === -1
      ) {
        saveData.push({
          mdmSopMmCd: '',
          mdmSopId: props.popupParam.mdmSopId,
          equipMachineCd: item.hhmHazardousMachineryId,
          equipMachineTypeCd: 'EMT0000002',
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })

    $http({
      url: insertMmUrl.value,
      method: 'POST',
      data: saveData
    }).then(
      () => {
        getMmMachines()
        message.requestSuccess()
      },
      () => message.validError()
    )
  }
}
function removeRowMmMachine() {
  const selectData = mmMachineTable.value.getSelected()
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
          url: deleteMmUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          getMmMachines()
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function getMmEquips() {
  if (props.isOld) {
    $http({
      url: listMmUrl.value,
      method: 'GET',
      params: {
        mdmSopId: props.popupParam.mdmSopId,
        equipMachineTypeCd: 'EMT0000001'
      }
    }).then((_result: any) => {
      props.sop.mmEquips = _result.data
    })
  }
}
function addRowMmEquip() {
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closePopMmEquip, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: { plantCd: props.sop.plantCd }
  })
}
function closePopMmEquip(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData = [] as any
    _.forEach(data, (item) => {
      if (_.findIndex(props.sop.mmEquips, { equipMachineCd: item.equipmentCd }) === -1) {
        saveData.push({
          mdmSopMmCd: '',
          mdmSopId: props.popupParam.mdmSopId,
          equipMachineCd: item.equipmentCd,
          equipMachineTypeCd: 'EMT0000001',
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })

    $http({
      url: insertMmUrl.value,
      method: 'POST',
      data: saveData
    }).then(
      () => {
        getMmEquips()
        message.requestSuccess()
      },
      () => message.validError()
    )
  }
}
function removeRowMmEquip() {
  const selectData = mmEquipTable.value.getSelected()
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
          url: deleteMmUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          getMmEquips()
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function getChems() {
  if (props.isOld) {
    $http({
      url: listChemUrl.value,
      method: 'GET',
      params: {
        mdmSopId: props.popupParam.mdmSopId
      }
    }).then((_result: any) => {
      props.sop.chems = _result.data
    })
  }
}
function addrowChem() {
  popupOptions.value = getPopupOptions('chemMaterial', popupOptions.value, closePopChem, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: { plantCd: props.sop.plantCd }
  })
}
function closePopChem(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData = [] as any
    _.forEach(data, (item) => {
      if (_.findIndex(props.sop.chems, { mdmChemMaterialId: item.mdmChemMaterialId }) === -1) {
        saveData.push({
          mdmSopChemCd: '',
          mdmSopId: props.popupParam.mdmSopId,
          mdmChemMaterialId: item.mdmChemMaterialId,
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })

    $http({
      url: insertChemUrl.value,
      method: 'POST',
      data: saveData
    }).then(
      () => {
        getChems()
        message.requestSuccess()
      },
      () => message.validError()
    )
  }
}
function removeRowChem() {
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
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteChemUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          getChems()
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
