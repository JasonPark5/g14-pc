<template>
  <div>
    <c-table
      ref="processTable"
      title="취급공정 목록"
      :columns="gridProcess.columns"
      :data="gridProcess.data"
      gridHeight="660px"
      :columnSetting="false"
      :filtering="false"
      :usePaging="false"
      selection="multiple"
      rowKey="chemMaterialProcessId"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRowProcess" />
          <c-btn
            v-if="editable && gridProcess.data.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="removeRowProcess"
          />
          <c-btn
            v-if="editable && gridProcess.data.length > 0"
            label="저장"
            icon="save"
            @btnClicked="saveProcess"
          />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'chemProcess'
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
interface propType {
  popupParam: {
    mdmChemMaterialId: string
    tabName: stringNull
    subtabName: stringNull
    plantCd: stringNull
  }
}
interface gridType {
  columns: Array<tableColumnType>
  data: Array<any>
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
      mdmChemMaterialId: '',
      tabName: '',
      subtabName: '',
      plantCd: null
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
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const gridProcess = ref<gridType>({
  columns: [],
  data: []
})
const processListUrl = ref('')
const processDeleteUrl = ref('')
const processSaveUrl = ref('')
const processTable = ref<any>(null)

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
  processListUrl.value = selectConfig.mdm.mam.chem.process.url
  processDeleteUrl.value = transactionConfig.mdm.mam.chem.process.delete.url
  processSaveUrl.value = transactionConfig.mdm.mam.chem.process.insert.url
  // code setting
  getComboItems('VOLUME_UNIT').then((_result) => {
    gridProcess.value.columns = [
      {
        name: 'upProcessName',
        field: 'upProcessName',
        label: '상위공정',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'processName',
        field: 'processName',
        label: '단위공정',
        align: 'center',
        style: 'width:200px',
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
    getProcessList()
  })
  // list setting
}
/******************************
 * TODO (목적): 화학자재 관련 공정 조회
 *******************************/
function getProcessList() {
  $http({
    url: processListUrl.value,
    method: 'GET',
    params: {
      mdmChemMaterialId: props.popupParam.mdmChemMaterialId
    }
  }).then((_result: any) => {
    gridProcess.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 화학자재 관련 공정 추가 팝업 표시
 *******************************/
function addRowProcess() {
  popupOptions.value = getPopupOptions('process', popupOptions.value, closeProcess, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    processLevelCd: '20'
  })
}
/******************************
 * TODO (목적): 화학자재 관련 공정 추가 팝업 닫기
 * @param (1): 선택한 공정 정보
 *******************************/
function closeProcess(data: Array<processType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(gridProcess.value.data, { processCd: item.processCd }) === -1) {
        gridProcess.value.data.push({
          chemMaterialProcessId: uid(),
          mdmChemMaterialId: props.popupParam.mdmChemMaterialId,
          processCd: item.processCd,
          processName: item.processName,
          upProcessName: item.upProcessName,
          useFlag: 'N',
          usePurpose: '',
          dailyVolume: '',
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 화학자재 관련 공정 전 처리
 *******************************/
function saveProcess() {
  const saveData = gridProcess.value.data.filter((x) => {
    return x.editFlag == 'C' || x.editFlag == 'U'
  })
  if (saveData.length > 0) {
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
        }).then((_result: any) => {
          getProcessList()
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.alert({
      title: '안내',
      message: '변경된 데이터가 없습니다.',
      type: 'info' // success / info / warning / error
    })
  }
}
/******************************
 * TODO (목적): 화학자재 관련 공정 후 처리
 *******************************/
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
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridProcess.value.data = _.reject(gridProcess.value.data, item)
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
