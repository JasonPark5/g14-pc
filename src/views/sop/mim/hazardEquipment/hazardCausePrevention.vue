<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-card title="유해위험기계기구 기본정보" :collapsed="true" class="cardClassDetailInfo">
        <template v-slot:card-detail>
          <div v-if="editable && equipInfo.plantName" class="col-3">
            <c-label-text title="사업장" :value="equipInfo.plantName" />
          </div>
          <div v-if="editable && equipInfo.machineryClassificationName" class="col-3">
            <c-label-text title="기계분류" :value="equipInfo.machineryClassificationName" />
          </div>
          <div v-if="editable && equipInfo.machineryName" class="col-3">
            <c-label-text title="기계명" :value="equipInfo.machineryName" />
          </div>
          <div v-if="editable && equipInfo.itemNo" class="col-3">
            <c-label-text title="item No" :value="equipInfo.itemNo" />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="tableImpr"
        title="개선 목록"
        :columns="gridImpr.columns"
        :data="equipInfo.equipmentImproveModels"
        :gridHeight="gridImpr.height"
        selection="multiple"
        rowKey="equipImproveId"
        :usePaging="false"
        :filtering="false"
        :columnSetting="false"
        :editable="editable"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              label="추가"
              :showLoading="false"
              icon="add"
              @btnClicked="addItem"
            />
            <c-btn
              v-if="editable && equipInfo.equipmentImproveModels.length > 0"
              label="삭제"
              :showLoading="false"
              icon="remove"
              @btnClicked="removeItem"
            />
            <c-btn
              v-if="editable && equipInfo.equipmentImproveModels.length > 0"
              :url="insertUrl"
              :isSubmit="isSave"
              :param="equipInfo.equipmentImproveModels"
              mappingType="POST"
              label="저장"
              icon="save"
              @beforeAction="saveImprove"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'customCol'">
            <component
              :is="imprComponent"
              :col="col"
              :props="props"
              :inputEditable="editable"
              :isImmShow="true"
              :requestContentsCols="requestContentsCols"
              tableKey="equipImproveId"
              :ibmTaskTypeCd="props.row.equipTypeCd === '1' ? 'ITT0000055' : 'ITT0000050'"
              :ibmTaskUnderTypeCd="props.row.equipTypeCd === '1' ? 'ITTU000085' : 'ITTU000075'"
              @imprChange="imprChange"
            />
          </template>
        </template>
      </c-table>
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
import { equipInfoType } from './hazardEquipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardCausePrevention'
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
const emits = defineEmits(['saveCallback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    hhmHazardousMachineryId: stringNull
  }
  attachInfo: attachSettingType
  equipInfo: equipInfoType
  contentHeight: numberNull | stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  equipInfo: () => {
    return {
      hhmHazardousMachineryId: '',
      equipmentTypeCd: '',
      equipmentCd: '',
      equipmentNo: '',
      equipmentTypeName: '',
      equipmentName: '',
      plantCd: null,
      plantName: '',
      machineryClassification: null,
      machineryClassificationName: '',
      itemNo: '',
      inspectionKindCd: null,
      manufacturer: '',
      manufactDate: '',
      emplacementPlace: '',
      emplacementMonth: '',
      demolitionMonth: '',
      passNumber: '',
      ewrNo: '',
      amount: '',
      esignBasisRatedLoad: '',
      esignBasisKind: '',
      inspCertificateIssuanceDate: '',
      lastInspectionDate: '',
      inspectionSubjectFlag: null,
      inspectionCycle: null,
      nextInspectionDate: '',
      reasonExemptionInspection: '',
      machineryName: '',
      gradeCd: null,
      departmentDeptCd: '',
      departmentUserId: '',
      relatedLaws: '',
      remark: '',
      regUserId: '',
      chgUserId: '',
      subProcessCd: '',
      useFlag: 'Y',
      protectDevice: '',
      volume: '',
      validStartDate: '',
      validEndDate: '',
      possibleDisaster: '',
      hazardEquipmentHistoryModels: [],
      equipmentImproveModels: []
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
const gridImpr = ref({
  columns: [
    {
      required: true,
      name: 'locationDetail',
      field: 'locationDetail',
      label: '세부위치',
      align: 'left',
      type: 'text',
      style: 'width:25%',
      sortable: false
    },
    {
      required: true,
      name: 'findings',
      field: 'findings',
      label: '발견사항',
      align: 'left',
      type: 'text',
      style: 'width:25%',
      sortable: false
    },
    {
      name: 'impr',
      field: 'impr',
      label: '개선진행',
      align: 'center',
      child: [
        {
          name: 'customCol',
          field: 'customCol',
          label: '개선번호/개선진행상태',
          align: 'center',
          style: 'width:20%',
          type: 'custom',
          sortable: false
        },
        {
          name: 'improveMeasures',
          field: 'improveMeasures',
          label: '개선대책',
          align: 'left',
          style: 'width:20%',
          type: 'text',
          sortable: false
        }
      ]
    },
    {
      name: 'equipTypeName',
      field: 'equipTypeName',
      label: '구분',
      align: 'center',
      style: 'width:10%',
      sortable: false
    }
  ],

  data: [],
  height: '620px'
})
const insertUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const tableImpr = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const requestContentsCols = computed(() => {
  return ['locationDetail', 'findings']
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
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
  insertUrl.value = transactionConfig.sop.hhm.hazard.hazardImprove.insert.url
  deleteUrl.value = transactionConfig.sop.hhm.hazard.hazardImprove.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  emits('saveCallback', props.equipInfo.hhmHazardousMachineryId)
  tableImpr.value.compoTable.resetVirtualScroll()
}
function addItem() {
  props.equipInfo.equipmentImproveModels.splice(0, 0, {
    hhmHazardousMachineryId: props.equipInfo.hhmHazardousMachineryId,
    equipImproveId: uid(),
    locationDetail: '',
    equipTypeCd: '2',
    improvingMeasures: '',
    sopImprovementIds: '',
    ibmStepNames: '',
    improveMeasures: '',
    findings: '',
    editFlag: 'C',
    fileNm: ''
  })
}
function removeItem() {
  const selectData = tableImpr.value.getSelected()
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
        }).then(() => {
          message.requestSuccess()
          emits('saveCallback', props.equipInfo.hhmHazardousMachineryId)
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveImprove() {
  if (validTable(gridImpr.value.columns, props.equipInfo.equipmentImproveModels)) {
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
function saveCallback() {
  message.requestSuccess()
  emits('saveCallback', props.equipInfo.hhmHazardousMachineryId)
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
