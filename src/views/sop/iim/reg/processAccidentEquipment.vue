<template>
  <div class="row">
    <c-card title="독성여부 체크" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="!disabled"
            :url="updateUrl"
            :isSubmit="isSave"
            :param="save"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveAccident"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-radio
            :editable="editable"
            :disabled="disabled"
            :comboItems="toxicFlagItems"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="toxicFlag"
            label="독성여부"
            v-model:value="accidentInfo.toxicFlag"
          />
        </div>
      </template>
    </c-card>
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-table
        ref="equipTable"
        title="사고관련 설비 목록"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="grid.data"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :isExcelDown="false"
        :noDataLabel="$language('설비를 추가하세요.')"
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
              v-if="editable && !disabled && grid.data.length > 0"
              :showLoading="false"
              label="제외"
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
        title="사고관련 화학물질 목록"
        :columns="grid2.columns"
        :gridHeight="grid2.height"
        :data="grid2.data"
        :filtering="false"
        :isExcelDown="false"
        :columnSetting="false"
        :usePaging="false"
        :hideBottom="true"
        :noDataLabel="$language('화학물질을 추가하세요.')"
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
              v-if="editable && !disabled && grid2.data.length > 0"
              label="제외"
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

import { processAccidentType } from '../processAccident'

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
  name: 'processAccidentEquipment'
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
  accidentInfo: processAccidentType
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
  accidentInfo: () => {
    return {
      plantCd: '',
      iimAccidentId: '',
      toxicFlag: 'N',
      accidentMaterialModelList: [],
      accidentStatusCd: ''
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
const grid = ref({
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
      style: 'width:200px',
      align: 'left',
      type: 'link',
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
  data: [] as any,
  height: '250px'
})
const grid2 = ref({
  columns: [
    {
      name: 'materialName',
      field: 'materialName',
      label: '화학자재',
      type: 'link',
      align: 'center',
      sortable: false
    },
    {
      name: 'materialCd',
      field: 'materialCd',
      label: '화학자재번호',
      align: 'center',
      sortable: false
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'casNo',
      align: 'center',
      sortable: false
    }
  ],
  data: [] as any,
  height: '250px'
})
const toxicFlagItems = ref<codeMasterType>([
  { code: 'Y', codeName: 'YES' },
  { code: 'N', codeName: 'NO' }
])
const save = ref<any>({
  plantCd: '',
  iimAccidentId: '',
  toxicFlag: 'N',
  accidentMaterialModelList: [],
  accidentStatusCd: ''
})
const updateUrl = ref('')
const isSave = ref(false)
const equipTable = ref<any>(null)
const chemTable = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    editable.value &&
    Boolean(props.accidentInfo.accidentStatusCd) &&
    props.accidentInfo.accidentStatusCd === 'ISPC000005'
)
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => grid.value.data,
  () => {
    props.accidentInfo.accidentMaterialModelList = _.concat(grid.value.data, grid2.value.data)
  }
)
watch(
  () => grid2.value.data,
  () => {
    props.accidentInfo.accidentMaterialModelList = _.concat(grid.value.data, grid2.value.data)
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
  updateUrl.value = transactionConfig.sop.iim.accident.process.update.relate.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 설비/화학자재 리스트 분할
 *******************************/
function getDetail() {
  _.forEach(props.accidentInfo.accidentMaterialModelList, (_item: any) => {
    if (_item.equipmentMaterialTypeCd === 'EQUIP') {
      grid.value.data.push(_item) // 설비
    } else {
      grid2.value.data.push(_item) // 화학자재
    }
  })
}
/******************************
 * TODO (목적): 설비 검색
 *******************************/
/* eslint-disable no-unused-vars */
function addEquipment() {
  // 초기에는 userId에 tempId를 부여
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeEquipmentPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 설비 검색 팝업 닫기 콜백
 *******************************/
function closeEquipmentPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(grid.value.data, {
        equipmentCd: _item.equipmentCd
      })
      if (index === -1) {
        grid.value.data!.splice(0, 0, {
          iimAccidentId: props.accidentInfo.iimAccidentId,
          equipmentMaterialTypeCd: 'EQUIP',
          managementDepts: _item.managementDepts,
          equipmentTypeName: _item.equipmentTypeName,
          checkDeptCd: _item.managementDepts,
          equipmentName: _item.equipmentName,
          equipmentNo: _item.equipmentNo,
          equipmentCd: _item.equipmentCd,
          relatedLawsName: _item.relatedLawsName,
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 설비 삭제
 *******************************/
function removeEquipment() {
  const selectData = equipTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      grid.value.data = _.reject(grid.value.data, { equipmentCd: item.equipmentCd })
    })
  }
}
/******************************
 * TODO (목적): 화학자재 검색
 *******************************/
function addChem() {
  popupOptions.value = getPopupOptions('chemMaterial', popupOptions.value, closeChemPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 화학자재 검색 닫기 콜백
 *******************************/
function closeChemPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(grid2.value.data, {
        mdmChemMaterialId: _item.mdmChemMaterialId
      })
      if (index === -1) {
        grid2.value.data.splice(0, 0, {
          iimAccidentId: props.accidentInfo.iimAccidentId,
          equipmentMaterialTypeCd: 'CHEM',
          materialCd: _item.mdmChemMaterialCd,
          mdmChemMaterialId: _item.mdmChemMaterialId,
          casNo: _item.casNo,
          materialName: _item.mdmChemMaterialName,
          regUserId: user.value.userId,
          chgUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 화학자재 삭제
 *******************************/
function removeChem() {
  const selectData = chemTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      grid2.value.data = _.reject(grid2.value.data, item)
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveAccident() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      props.accidentInfo.accidentMaterialModelList = _.concat(grid.value.data, grid2.value.data)

      if (props.accidentInfo.iimAccidentId) {
        save.value.iimAccidentId = props.accidentInfo.iimAccidentId
        save.value.plantCd = props.accidentInfo.plantCd
        save.value.toxicFlag = props.accidentInfo.toxicFlag
        save.value.accidentMaterialModelList = props.accidentInfo.accidentMaterialModelList
        save.value.accidentStatusCd = props.accidentInfo.accidentStatusCd
      }

      props.accidentInfo.regUserId = user.value.userId
      props.accidentInfo.chgUserId = user.value.userId
      isSave.value = !isSave.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
}
/******************************
 * TODO (목적): 설비 상세
 *******************************/
function linkClick1(row: any) {
  popupOptions.value.title = '관련 설비 상세'
  popupOptions.value.param = {
    equipmentCd: row ? row.equipmentCd : '',
    psmFlag: row ? row.psmFlag : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/mdm/fim/equipmentDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 화학자재 상세
 *******************************/
function linkClick2(row: any) {
  popupOptions.value.title = '관련 화학물질 상세'
  popupOptions.value.param = {
    mdmChemMaterialId: row ? row.mdmChemMaterialId : '',
    plantCd: props.accidentInfo.plantCd || ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/mdm/mam/chemDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 상세 닫기 콜백
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
