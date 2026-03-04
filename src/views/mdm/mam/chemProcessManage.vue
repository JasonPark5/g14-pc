<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-table
          ref="table"
          title="공정 목록"
          tableId="table"
          :columns="grid.columns"
          :data="grid.data"
          gridHeight="770px"
          :isExcelDown="false"
          :columnSetting="false"
          @rowClick="rowClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <c-table
          ref="processTable"
          title="공정별 화학자재 취급량"
          :columns="gridprocess.columns"
          :data="gridprocess.data"
          gridHeight="770px"
          :columnSetting="false"
          selection="multiple"
          rowKey="chemMaterialProcessId"
          :usePaging="false"
          :isExcelDown="false"
          :editable="editable"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                label="추가"
                v-if="editable && selectedProcessCd"
                icon="add"
                @btnClicked="addrowProcess"
              />
              <c-btn
                label="삭제"
                v-if="editable && selectedProcessCd"
                icon="remove"
                @btnClicked="removeRowProcess"
              />
              <c-btn
                label="저장"
                v-if="editable && selectedProcessCd"
                icon="save"
                @btnClicked="saveProcess"
              />
            </q-btn-group>
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
  name: 'chemProcessManage'
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
interface gridType {
  columns: tableColumnType
  data: any
  height?: stringNull
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
const searchParam = ref({
  // plantCd: null,
  processLevelCd: ''
})
const editable = ref(true)
const listUrl = ref('')
const detailUrl = ref('')
const processListUrl = ref('')
const processDeleteUrl = ref('')
const processSaveUrl = ref('')
const selectedProcessCd = ref('')
const popupOptions = ref<popupParamType>({
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

const table = ref<any>(null)
const processTable = ref<any>(null)

const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true
    },
    {
      name: 'upProcessName',
      field: 'upProcessName',
      label: '상위공정',
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
  data: [],
  height: '100%'
})
const gridprocess = ref<gridType>({
  columns: [],
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
  listUrl.value = selectConfig.mdm.process.list.url
  detailUrl.value = selectConfig.mdm.mam.chem.byprocess.url
  processListUrl.value = selectConfig.mdm.mam.chem.process.url
  processDeleteUrl.value = transactionConfig.mdm.mam.chem.process.delete.url
  processSaveUrl.value = transactionConfig.mdm.mam.chem.process.insert.url
  // code setting
  getComboItems('VOLUME_UNIT').then((_result) => {
    gridprocess.value.columns = [
      {
        name: 'mdmChemMaterialName',
        field: 'mdmChemMaterialName',
        label: '화학자재명',
        align: 'left',
        style: 'width:250px',
        sortable: false
      },
      {
        name: 'useFlag',
        field: 'useFlag',
        label: '제조 또는 사용여부',
        align: 'center',
        style: 'width:150px',
        sortable: false,
        type: 'check',
        true: 'Y',
        false: 'N'
      },
      {
        name: 'usePurpose',
        field: 'usePurpose',
        label: '사용용도',
        align: 'left',
        type: 'text',
        sortable: false
      },
      {
        name: 'dailyVolume',
        field: 'dailyVolume',
        label: '일 취급량',
        align: 'center',
        type: 'number',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'volumeUnit',
        field: 'volumeUnit',
        setHeader: true,
        required: false,
        label: '취급량 단위',
        align: 'center',
        style: 'width:100px',
        type: 'select',
        comboItems: _result,
        sortable: false
      }
    ]
  })
  // list setting
  getList()
}
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')
  if (_table.length > 0) {
    for (let c = 0; c <= _table.length; c++) {
      _table[c].classList.remove('bg-light-blue-1')
    }
  }
}
function getList() {
  rowRemoveSelect()
  gridprocess.value.data = []
  searchParam.value.processLevelCd = '20'
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function rowClick(row: any) {
  gridprocess.value.data = []
  selectedProcessCd.value = row.processCd
  $http({
    url: detailUrl.value,
    method: 'GET',
    params: { processCd: selectedProcessCd.value }
  }).then((_result: any) => {
    gridprocess.value.data = _result.data
  })
}
function addrowProcess() {
  popupOptions.value = getPopupOptions('chemMaterial', popupOptions.value, closeProcess, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: { processLevelCd: '20' }
  })
}
function closeProcess(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (
        _.findIndex(gridprocess.value.data, { mdmChemMaterialId: item.mdmChemMaterialId }) === -1
      ) {
        gridprocess.value.data.push({
          chemMaterialProcessId: uid(),
          mdmChemMaterialId: item.mdmChemMaterialId,
          mdmChemMaterialName: item.mdmChemMaterialName,
          processCd: selectedProcessCd.value,
          processName: '',
          useFlag: 'N',
          usePurpose: '',
          dailyVolume: '',
          editFlag: 'C',
          volumeUnit: ''
        })
      }
    })
  }
}
function saveProcess() {
  const saveData = gridprocess.value.data.filter((x: any) => {
    return x.editFlag == 'C' || x.editFlag == 'U'
  })
  if (saveData.length > 0) {
    let boolVolume = false
    _.forEach(saveData, (item) => {
      if (item.volumeUnit == '1' || item.volumeUnit == '2') {
        if (item.dailyVolume.length > 3) {
          boolVolume = true
          return false
        }
      }
    })
    if (boolVolume) {
      message.alert({
        title: '안내',
        message:
          '취급량 단위가 [㎏, ℓ],[g, ㎖] 일 경우에는 일 취급량이 1000단위가 넘을 수가 없습니다. 취급량 단위를 변경하세요.',
        type: 'warning' // success / info / warning / error
      })
    } else {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          $http({
            url: processSaveUrl.value,
            method: 'POST',
            data: saveData
          }).then(
            () => {
              rowClick({ processCd: selectedProcessCd.value })
              message.requestSuccess()
            },
            () => message.validError()
          )
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    }
  } else {
    message.alert({
      title: '안내',
      message: '변경된 데이터가 없습니다.',
      type: 'info' // success / info / warning / error
    })
  }
}
function removeRowProcess() {
  const selectData = processTable.value.getSelected()
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
          url: processDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridprocess.value.data = _.reject(gridprocess.value.data, item)
          })
          processTable.value.compoTable.clearSelection()
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
