<template>
  <div>
    <c-search-box @enter="getEquipClassList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="hazardMachineItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="hazardMachineFlag"
            label="유해위험기계기구 여부"
            v-model:value="searchParam.hazardMachineFlag"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-tree-table
          title="설비유형 목록"
          parentProperty="upEquipmentTypeCd"
          customID="equipmentTypeCd"
          :columns="gridClass.columns"
          :data="gridClass.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getEquipClassList" />
            </q-btn-group>
          </template>
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="itemTable"
          title="설비유형별 세부항목"
          tableId="insItemgrid"
          :columns="insItemgrid.columns"
          :data="insItemgrid.data"
          selection="multiple"
          :editable="editable"
          :usePaging="false"
          :expandAll="true"
          :filtering="false"
          :columnSetting="false"
          :isExcelDown="true"
          rowKey="sortOrder"
        >
          <template v-slot:table-chip>
            <q-chip outline square icon="push_pin" color="blue">
              {{ $language('설비유형') + ' : ' + rowTypeName }}
            </q-chip>
          </template>
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                label="추가"
                icon="add"
                :showLoading="false"
                @btnClicked="addrow"
              />
              <c-btn
                v-if="editable && insItemgrid.data.length > 0"
                :showLoading="false"
                label="삭제"
                icon="remove"
                @btnClicked="remove"
              />
              <c-btn
                v-if="editable && insItemgrid.data.length > 0"
                :url="insertUrl"
                :isSubmit="isSave"
                :param="insItemgrid.data"
                mappingType="POST"
                label="저장"
                icon="save"
                @beforeAction="saveClass"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
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
  name: 'equipmentClassItem'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface searchParamType {
  plantCd: stringNull
  hazardMachineFlag: stringNull
  useFlag: stringNull
}
/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction
/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const searchParam = ref<searchParamType>({
  plantCd: null,
  hazardMachineFlag: null,
  useFlag: 'Y'
})
const gridClass = ref<any>({
  columns: [
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      align: 'left',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'hazardMachineFlagNm',
      field: 'hazardMachineFlagNm',
      label: '유해위험기계기구 여부',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ],
  data: [],
  height: '720px'
})
const insItemgrid = ref<any>({
  columns: [
    {
      name: 'item',
      field: 'item',
      required: true,
      label: '항목',
      type: 'text',
      style: 'width:100px',
      align: 'left',
      sortable: false
    },
    {
      name: 'itemDesc',
      field: 'itemDesc',
      label: '항목설명',
      type: 'text',
      style: 'width:200px',
      align: 'left',
      sortable: false
    },
    {
      name: 'itemValue',
      field: 'itemValue',
      label: '값',
      type: 'text',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'itemUnit',
      field: 'itemUnit',
      label: '단위',
      type: 'text',
      align: 'center',
      style: 'width:80px',
      sortable: false
    }
  ],
  data: [],
  height: '720px'
})
const isSave = ref(false)
const rowTypeName = ref('')
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const itemDetailUrl = ref('')
const useFlagItems = ref<codeMasterType>([])
const hazardMachineItems = ref<codeMasterType>([])
const key = ref<any>({
  equipmentTypeCd: '',
  plantCd: ''
})
const itemTable = ref<any>(null)
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
  listUrl.value = selectConfig.mdm.equipment.class.list.url
  insertUrl.value = transactionConfig.mdm.equipment.class.item.insert.url
  itemDetailUrl.value = selectConfig.mdm.equipment.class.item.detail.list.url
  deleteUrl.value = transactionConfig.mdm.equipment.class.item.delete.url
  // code setting
  hazardMachineItems.value = [
    { code: 'Y', codeName: $language('유해위험기계기구') },
    { code: 'N', codeName: $language('일반') }
  ]
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getEquipClassList()
}
function getEquipClassList() {
  // 전체조회
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridClass.value.data = _result.data
  })
}
function rowClick(row: any) {
  key.value.equipmentTypeCd = _.clone(row.equipmentTypeCd)
  key.value.plantCd = _.clone(row.plantCd)
  rowTypeName.value = _.clone(row.equipmentTypeName)
  // 설비유형별 점검항목 조회
  $http({
    url: $format(itemDetailUrl.value, row.equipmentTypeCd, row.plantCd),
    method: 'GET'
  }).then((_result: any) => {
    insItemgrid.value.data = _result.data
  })
}
function addrow() {
  if (!key.value.equipmentTypeCd) {
    message.alert({
      title: '안내',
      message: '설비유형을 선택하세요.', // 설비유형을 선택하세요.
      type: 'warning' // success / info / warning / error
    })
    return
  }
  // 초기에는 userId에 tempId를 부여
  insItemgrid.value.data.splice(0, 0, {
    plantCd: key.value.plantCd,
    equipmentTypeCd: key.value.equipmentTypeCd,
    sortOrder: uid(),
    item: '',
    itemDesc: '',
    itemValue: '',
    itemUnit: '',
    editFlag: 'C'
  })
}
function saveClass() {
  if (validTable(insItemgrid.value.columns, insItemgrid.value.data)) {
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
function saveCallback(result: any) {
  message.requestSuccess()
  rowClick({ plantCd: result.data.plantCd, equipmentTypeCd: result.data.equipmentTypeCd })
}
function remove() {
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
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            insItemgrid.value.data = _.reject(insItemgrid.value.data, {
              sortOrder: item.sortOrder
            })
          })
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
