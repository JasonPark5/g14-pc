<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-table
        ref="equipTable"
        title="관련 설비 목록"
        :columns="gridEquip.columns"
        :gridHeight="gridEquip.height"
        :data="gridEquip.data"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :isExcelDown="false"
        :hideBottom="true"
        :editable="editable"
        rowKey="equipmentCd"
        selection="multiple"
        @linkClick="linkClick1"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              :showLoading="false"
              label="추가"
              icon="add"
              @btnClicked="addEquipment"
            />
            <c-btn
              v-if="editable && !disabled && gridEquip.data.length > 0"
              :showLoading="false"
              label="삭제"
              icon="remove"
              @btnClicked="removeEquipment"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" topClass="topcolor-orange">
      <c-table
        ref="chemTable"
        title="관련 화학자재 목록"
        :columns="gridChem.columns"
        :gridHeight="gridChem.height"
        :data="gridChem.data"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :hideBottom="true"
        :isExcelDown="false"
        :editable="editable && !disabled"
        rowKey="mdmChemMaterialId"
        selection="multiple"
        @linkClick="linkClick2"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              label="추가"
              :showLoading="false"
              icon="add"
              @btnClicked="addChem"
            />
            <c-btn
              v-if="editable && !disabled && gridChem.data.length > 0"
              label="삭제"
              :showLoading="false"
              icon="remove"
              @btnClicked="removeChem"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'emergencyActionRelation'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  emerActPlanDocu: {
    plantCd: stringNull
    sopEmergencyPlanId: stringNull
    emergencyMaterialModels: Array<any>
  }
  disabled?: boolean
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
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
  emerActPlanDocu: () => {
    return {
      plantCd: '',
      sopEmergencyPlanId: '',
      emergencyMaterialModels: []
    }
  },
  disabled: false
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
const chemTable = ref<any>(null)
const equipTable = ref<any>(null)
const gridEquip = ref<gridType>({
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
      type: 'link',
      sortable: false
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      style: 'width:200px',
      align: 'left',
      sortable: false
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      align: 'left',
      style: 'width:300px',
      sortable: false
    }
  ],
  data: [],
  height: '360px'
})
const gridChem = ref<gridType>({
  columns: [
    {
      name: 'materialName',
      field: 'materialName',
      label: '화학자재',
      type: 'link',
      align: 'center',
      sortable: true
    },
    {
      name: 'materialCd',
      field: 'materialCd',
      label: '화학자재코드',
      align: 'center',
      sortable: true
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'casNo',
      align: 'center',
      sortable: true
    }
  ],
  data: [],
  height: '360px'
})
/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => gridEquip.value.data,
  () => {
    props.emerActPlanDocu.emergencyMaterialModels = _.concat(
      gridEquip.value.data,
      gridChem.value.data
    )
  }
)
watch(
  () => gridChem.value.data,
  () => {
    props.emerActPlanDocu.emergencyMaterialModels = _.concat(
      gridEquip.value.data,
      gridChem.value.data
    )
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
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  _.forEach(props.emerActPlanDocu.emergencyMaterialModels, (_item) => {
    if (_item.equipmentMaterialTypeCd === 'EQUIP') {
      gridEquip.value.data.push(_item) // 설비
    } else {
      gridChem.value.data.push(_item) // 화학자재
    }
  })
}
function addEquipment() {
  popupOptions.value.title = '관련설비 검색' // 관련설비 검색
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeEquipmentPopup, {
    type: 'multiple'
  })
}
function closeEquipmentPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveItems = [] as any
    _.forEach(data, (_item: any) => {
      const index = _.findIndex(gridEquip.value.data, {
        equipmentCd: _item.equipmentCd
      })
      if (index === -1) {
        gridEquip.value.data.splice(0, 0, {
          sopEmergencyPlanId: props.emerActPlanDocu.sopEmergencyPlanId,
          equipmentMaterialTypeCd: 'EQUIP',
          equipmentNo: _item.equipmentNo,
          managementDepts: _item.managementDepts,
          equipmentTypeName: _item.equipmentTypeName,
          checkDeptCd: _item.managementDepts,
          equipmentName: _item.equipmentName,
          equipmentCd: _item.equipmentCd,
          relatedLawsName: _item.relatedLawsName,
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
        saveItems.splice(0, 0, {
          sopEmergencyPlanId: props.emerActPlanDocu.sopEmergencyPlanId,
          equipmentMaterialTypeCd: 'EQUIP',
          managementDepts: _item.managementDepts,
          equipmentTypeName: _item.equipmentTypeName,
          checkDeptCd: _item.managementDepts,
          equipmentName: _item.equipmentName,
          equipmentCd: _item.equipmentCd,
          relatedLawsName: _item.relatedLawsName,
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
      }
    })
    $http({
      url: transactionConfig.sop.eap.relateMaterial.insert.url,
      method: 'POST',
      data: saveItems
    }).then(() => {
      message.requestSuccess()
    })
  }
}
function removeEquipment() {
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
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: transactionConfig.sop.eap.relateMaterial.delete.url,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridEquip.value.data = _.reject(gridEquip.value.data, {
              equipmentCd: item.equipmentCd
            })
          })
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function addChem() {
  popupOptions.value.title = '관련 화학자재 검색'
  popupOptions.value.width = '60%'
  popupOptions.value.isFull = false
  popupOptions.value = getPopupOptions('chemMaterial', popupOptions.value, closeChemPopup, {
    type: 'multiple'
  })
}
function closeChemPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveItems = [] as any
    _.forEach(data, (_item) => {
      const index = _.findIndex(gridChem.value.data, {
        mdmChemMaterialId: _item.mdmChemMaterialId
      })
      if (index === -1) {
        gridChem.value.data.splice(0, 0, {
          sopEmergencyPlanId: props.emerActPlanDocu.sopEmergencyPlanId,
          equipmentMaterialTypeCd: 'CHEM',
          materialCd: _item.mdmChemMaterialCd,
          mdmChemMaterialId: _item.mdmChemMaterialId,
          casNo: _item.casNo,
          materialName: _item.materialName,
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
        saveItems.splice(0, 0, {
          sopEmergencyPlanId: props.emerActPlanDocu.sopEmergencyPlanId,
          equipmentMaterialTypeCd: 'CHEM',
          materialCd: _item.mdmChemMaterialCd,
          mdmChemMaterialId: _item.mdmChemMaterialId,
          casNo: _item.casNo,
          materialName: _item.materialName,
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
      }
    })
    $http({
      url: transactionConfig.sop.eap.relateMaterial.insert.url,
      method: 'POST',
      data: saveItems
    }).then((_result: any) => {
      message.requestSuccess()
    })
  }
}
function removeChem() {
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
          url: transactionConfig.sop.eap.relateMaterial.delete.url,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridChem.value.data = _.reject(gridChem.value.data, item)
          })
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function linkClick1(data: any) {
  popupOptions.value.title = '관련 설비 상세' // 관련 설비 상세
  popupOptions.value.param = popupOptions.value.param = {
    equipmentCd: data ? data.equipmentCd : '',
    psmFlag: data ? data.psmFlag : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/mdm/fim/equipmentDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function linkClick2(data: any) {
  popupOptions.value.title = '관련 화학물질 상세' // 관련 화학물질 상세
  popupOptions.value.param = popupOptions.value.param = {
    mdmChemMaterialId: data ? data.mdmChemMaterialId : '',
    plantCd: data ? props.emerActPlanDocu.plantCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/mdm/mam/chemDetail.vue`))
  )
  popupOptions.value.isFull = true
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
