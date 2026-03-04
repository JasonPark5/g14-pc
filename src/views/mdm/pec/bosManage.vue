<template>
  <div>
    <c-search-box @enter="getDeptList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            type="search"
            label="부서"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model:value="searchParam.deptCd"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-tree-table
          title="부서목록"
          parentProperty="upDeptCd"
          customID="deptCd"
          :columns="gridDept.columns"
          :data="gridDept.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          :filtering="false"
          @rowClick="rowClickDept"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getDeptList" />
            </q-btn-group>
          </template>
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
        <c-card class="cardClassDetailInfo" :noHeader="true">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
              <c-table
                ref="processTable"
                title="부서별 공정 목록"
                :columns="gridProcess.columns"
                :data="gridProcess.data"
                :columnSetting="false"
                :isFullScreen="false"
                :usePaging="false"
                :expandAll="true"
                gridHeight="350px"
                @linkClick="rowClickProcess"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
              <c-table
                ref="gridTable"
                title="부서별 설비 목록"
                tableId="gridEquip"
                :columns="gridEquip.columns"
                :data="gridEquip.data"
                :columnSetting="false"
                :isFullScreen="false"
                :usePaging="false"
                :expandAll="true"
                gridHeight="350px"
                @linkClick="linkEquipClick"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-table
                ref="chemTable"
                title="부서별 화학자재 목록"
                tableId="gridChem"
                :columns="gridChem.columns"
                :data="gridChem.data"
                :columnSetting="false"
                :isFullScreen="false"
                :usePaging="false"
                :expandAll="true"
                gridHeight="350px"
                @linkClick="linkChemClick"
              />
            </div>
            <c-dialog :param="popupOptions" />
          </template>
        </c-card>
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
  name: 'bosManage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  deptCd: stringNull
  useFlag: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
}

/******************************
 * @inject_선언
 *******************************/

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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<searchParamType>({
  plantCd: null,
  deptCd: '',
  useFlag: 'Y'
})
const editable = ref(true)
const listDeptUrl = ref('')
const listProcessUrl = ref('')
const listEquipUrl = ref('')
const listChemUrl = ref('')
const gridDept = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const gridProcess = ref<gridType>({
  columns: [
    {
      name: 'upProcessName',
      field: 'upProcessName',
      label: '상위공정',
      align: 'left',
      type: 'link',
      sortable: true
    },
    {
      name: 'processName',
      field: 'processName',
      label: '단위공정',
      type: 'link',
      align: 'left',
      sortable: true
    },
    {
      name: 'processCd',
      field: 'processCd',
      label: '공정코드',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const gridEquip = ref<gridType>({
  columns: [
    {
      name: 'equipmentCd',
      field: 'equipmentCd',
      label: '설비코드',
      align: 'center',
      sortable: true
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      align: 'center',
      sortable: true
    },
    {
      name: 'processName',
      field: 'processName',
      label: '단위공정',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const gridChem = ref<gridType>({
  columns: [
    {
      name: 'mdmChemMaterialId',
      field: 'mdmChemMaterialId',
      label: '화학자재 번호',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'materialName',
      field: 'materialName',
      label: '화학자재명',
      align: 'left',
      type: 'link',
      style: 'width:250px',
      sortable: true
    },
    {
      name: 'propertiesStateName',
      field: 'propertiesStateName',
      label: '성상',
      align: 'center',
      style: 'width:60px',
      sortable: true
    },
    {
      name: 'mixFlagName',
      field: 'mixFlagName',
      label: '물질구성',
      align: 'center',
      style: 'width:45px',
      sortable: true
    },
    {
      name: 'equipment_names',
      field: 'equipment_names',
      label: '관련설비',
      align: 'left',
      sortable: true
    },
    {
      name: 'existRegulation',
      field: 'existRegulation',
      label: '규제포함',
      align: 'center',
      type: 'color',
      style: 'width:70px',
      sortable: true
    }
  ],
  data: []
})
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
  listDeptUrl.value = selectConfig.mdm.dept.list.url
  listProcessUrl.value = selectConfig.mdm.process.list.url
  listEquipUrl.value = selectConfig.mdm.equipment.list.url
  listChemUrl.value = selectConfig.mdm.mam.chem.listreg.url + '/equip'
  // code setting
  // list setting
  getDeptList()
}
/******************************
 * TODO (목적): 선택한 항목 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
/******************************
 * TODO (목적): 공정 상세 팝업
 *******************************/
function rowClickProcess(row: any, col: any) {
  if (col && col.name === 'upProcessName') {
    popupOptions.value.title = '상위공정 정보'
    popupOptions.value.param = {
      processType: 'P', // P: 상위공정, C: 단위공정
      processCd: row.upProcessCd // 공정코드
    }
  } else if (col && col.name === 'processName') {
    popupOptions.value.title = '단위공정 정보'
    popupOptions.value.param = {
      processType: 'C', // P: 상위공정, C: 단위공정
      processCd: row.processCd // 공정코드
    }
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/common/process/processInfoPop.vue'))
  )
  popupOptions.value.width = '60%'
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.closeCallback = closeProcessPopup
}
/******************************
 * TODO (목적): 공정 상세 팝업 닫기 후 콜백
 *******************************/
function closeProcessPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

function getDeptList() {
  getListDept()
  reset()
}

/******************************
 * TODO (목적): 부서 조회
 *******************************/
function getListDept() {
  $http({
    url: listDeptUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridDept.value.data = _result.data
  })
}

function rowClickDept(row: any) {
  getProcessList(row.deptCd)
  getEquipList(row.deptCd)
  getChemList(row.deptCd)
}
/******************************
 * TODO (목적): 부서별 공정 조회
 *******************************/
function getProcessList(_deptCd: string) {
  $http({
    url: listProcessUrl.value,
    method: 'GET',
    params: {
      deptCd: _deptCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    gridProcess.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 부서별 설비 조회
 *******************************/
function getEquipList(_deptCd: string) {
  $http({
    url: listEquipUrl.value,
    method: 'GET',
    params: {
      deptCd: _deptCd,
      discardFlag: 'N'
    }
  }).then((_result: any) => {
    gridEquip.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 부서별 화학자재 조회
 *******************************/
function getChemList(_deptCd: string) {
  $http({
    url: listChemUrl.value,
    method: 'GET',
    params: {
      deptCd: _deptCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    gridChem.value.data = _result.data
  })
}

function linkEquipClick(row: any) {
  popupOptions.value.title = '설비 상세'
  popupOptions.value.param = {
    equipmentCd: row ? row.equipmentCd : '',
    psmFlag: row ? row.psmFlag : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('../fim/equipmentDetail.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function linkChemClick(row: any) {
  popupOptions.value.title = '화학자재 상세'
  popupOptions.value.param = {
    mdmChemMaterialId: row.mdmChemMaterialId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('../mam/chemDetail.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
function reset() {
  rowRemoveSelect()
  gridProcess.value.data = []
  gridEquip.value.data = []
  gridChem.value.data = []
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
