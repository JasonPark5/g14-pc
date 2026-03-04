<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-table
        ref="table"
        title="관련 비상조치계획서 목록"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="accidentInfo.emergencyList"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :isExcelDown="false"
        :hideBottom="true"
        :editable="editable"
        rowKey="sopEmergencyPlanId"
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
              @btnClicked="searchEmergency"
            />
            <c-btn
              v-if="editable && !disabled && accidentInfo.emergencyList!.length > 0"
              :showLoading="false"
              label="삭제"
              icon="remove"
              @btnClicked="removeEmergency"
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
  name: 'processAcidentEmergencyPlan'
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
  accidentInfo: processAccidentType
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  accidentInfo: () => {
    return {
      plantCd: '',
      iimAccidentId: '',
      emergencyList: [],
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
const grid = ref<any>({
  columns: [
    {
      name: 'emergencyPlanName',
      field: 'emergencyPlanName',
      label: '계획서명',
      align: 'center',
      sortable: true,
      style: 'width:150px',
      type: 'link'
    },
    {
      name: 'emergencyTypeName',
      field: 'emergencyTypeName',
      label: '비상사태구분',
      align: 'center',
      sortable: true,
      style: 'width:150px'
    },
    {
      name: 'emergencyClassCd',
      field: 'emergencyClassCd',
      label: '비상사태유형',
      align: 'center',
      sortable: true,
      style: 'width:150px'
    }
  ],
  data: [],
  height: '680px'
})
const getUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)
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
  getUrl.value = selectConfig.sop.iim.accident.process.get.url
  saveUrl.value = transactionConfig.sop.eap.relateAccident.insert.url
  deleteUrl.value = transactionConfig.sop.eap.relateAccident.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.accidentInfo.iimAccidentId) {
    $http({
      url: $format(getUrl.value, props.accidentInfo.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      props.accidentInfo.emergencyList = _.clone(_result.data.emergencyList)
    })
  }
}
/******************************
 * TODO (목적): 비상조치계획 검색
 *******************************/
function searchEmergency() {
  popupOptions.value = getPopupOptions(
    'emergencyActionPlan',
    popupOptions.value,
    closeEmergencyPopup,
    {
      /** 원하는 parameter 정의 */
      type: 'multiple'
    }
  )
}
/* eslint-disable no-unused-vars */
function closeEmergencyPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveEmergencies: any = []
    _.forEach(data, (item) => {
      if (
        _.findIndex(props.accidentInfo.emergencyList, {
          sopEmergencyPlanId: item.sopEmergencyPlanId
        }) === -1
      ) {
        saveEmergencies.push({
          iimAccidentId: props.accidentInfo.iimAccidentId,
          emergencyPlanName: item.emergencyPlanName,
          sopEmergencyPlanId: item.sopEmergencyPlanId,
          editFlag: 'C'
        })
      }
    })
    $http({
      url: saveUrl.value,
      method: 'POST',
      data: saveEmergencies
    }).then(() => {
      message.requestSuccess()
      getDetail()
    })
  }
}
function removeEmergency() {
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
          url: saveUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (_item) => {
            props.accidentInfo.emergencyList = _.reject(props.accidentInfo.emergencyList, _item)
          })
          table.value.selected = []
          message.requestSuccess()
        })
      },
      cancelCallback: () => {}
    })
  }
}
function linkClick(row: any) {
  popupOptions.value.title = '사고관련 비상조치계획서 상세'
  popupOptions.value.param = {
    sopEmergencyPlanId: row ? row.sopEmergencyPlanId : '',
    plantCd: row ? row.plantCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/eap/old/emergencyActionPlanDocuDetail.vue`))
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
