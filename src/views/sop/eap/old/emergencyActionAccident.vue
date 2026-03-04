<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-table
        ref="accidentTable"
        title="관련 사고보고서 목록"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="emerActPlanDocu.processAccidents"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :isExcelDown="false"
        :hideBottom="true"
        :editable="editable"
        rowKey="iimAccidentId"
        selection="multiple"
        @linkClick="linkClick"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              :showLoading="false"
              label="추가"
              icon="add"
              @btnClicked="searchProcessAccident"
            />
            <c-btn
              v-if="editable && !disabled && emerActPlanDocu.processAccidents.length > 0"
              :showLoading="false"
              label="삭제"
              icon="remove"
              @btnClicked="removeProcessAccident"
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
  name: 'emergencyActionAccident'
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
  emerActPlanDocu: {
    plantCd: stringNull
    sopEmergencyPlanId: stringNull
    processAccidents: Array<any>
  }
  disabled?: boolean
}

interface gridType {
  columns: tableColumnType
  height: stringNull
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
  emerActPlanDocu: () => {
    return {
      plantCd: '',
      sopEmergencyPlanId: '',
      processAccidents: []
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
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'accidentNo',
      field: 'accidentNo',
      label: '사고번호',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'accidentName',
      field: 'accidentName',
      label: '사고명',
      style: 'width:200px',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'accidentKindName',
      field: 'accidentKindName',
      style: 'width:150px',
      label: '사고종류',
      align: 'center',
      sortable: true
    },
    {
      name: 'accidentGradeName',
      field: 'accidentGradeName',
      label: '사고등급',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'occurrenceDate',
      field: 'occurrenceDate',
      style: 'width:100px',
      label: '발생일시',
      align: 'center',
      sortable: true
    },
    {
      name: 'occurrenceDeptName',
      field: 'occurrenceDeptName',
      label: '발생부서',
      style: 'width:100px',
      align: 'center',
      sortable: true
    }
  ],
  data: [],
  height: '760px'
})
const accidentTable = ref<any>(null)

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
  // code setting
  // list setting
}
function searchProcessAccident() {
  popupOptions.value.title = '관련 공정사고 검색' // 관련 공정사고 검색
  popupOptions.value = getPopupOptions('accident', popupOptions.value, closeAccidentPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: { accidentStatusCd: 'ISPC000005' }
  })
}
function closeAccidentPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveProcesses = [] as any
    _.forEach(data, (item) => {
      if (
        _.findIndex(props.emerActPlanDocu.processAccidents, {
          iimAccidentId: item.iimAccidentId
        }) === -1
      ) {
        props.emerActPlanDocu.processAccidents.push({
          iimAccidentId: item.iimAccidentId,
          accidentNo: item.accidentNo,
          accidentName: item.accidentName,
          processName: item.processName,
          accidentKindName: item.accidentKindName,
          accidentGradeName: item.accidentGradeName,
          occurrenceDate: item.occurrenceDate,
          occurrenceDeptName: item.occurrenceDeptName,
          sopEmergencyPlanId: props.emerActPlanDocu.sopEmergencyPlanId,
          editFlag: 'C'
        })
        saveProcesses.push({
          iimAccidentId: item.iimAccidentId,
          accidentName: item.accidentName,
          sopEmergencyPlanId: props.emerActPlanDocu.sopEmergencyPlanId,
          editFlag: 'C'
        })
      }
    })
    $http({
      url: transactionConfig.sop.eap.relateAccident.insert.url,
      method: 'POST',
      data: saveProcesses
    }).then((_result: any) => {
      message.requestSuccess()
    })
  }
}
function removeProcessAccident() {
  const selectData = accidentTable.value.getSelected()
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
          url: transactionConfig.sop.eap.relateAccident.delete.url,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (_item: any) => {
            props.emerActPlanDocu.processAccidents = _.reject(
              props.emerActPlanDocu.processAccidents,
              _item
            )
          })
          accidentTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function linkClick(tag: any) {
  popupOptions.value.title = '관련 공정사고 상세' // 관련 공정사고 상세
  popupOptions.value.param = popupOptions.value.param = {
    iimAccidentId: tag ? tag.iimAccidentId : '',
    stepCd: tag ? tag.accidentStatusCd : '',
    count: 0
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/sop/iim/processAccidentDetail.vue`))
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
