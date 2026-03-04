<template>
  <div>
    <c-table
      ref="table"
      title="설비별 점검항목"
      :columns="grid2.columns"
      :gridHeight="grid2.height"
      :editable="editable && result.checkStatusCd !== 'MCSC000015'"
      :data="result.equipmentResultList"
      :merge="grid2.merge"
      :filtering="false"
      :columnSetting="false"
      :isExcelDown="false"
      :usePaging="false"
      :noDataLabel="$language('설비에 대한 점검항목이 없습니다.')"
      rowKey="minEquipmentTypeCheckItemId"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="editable && result.checkStatusCd !== 'MCSC000015'"
            :isImmShow="true"
            :requestContentsCols="['checkItemName']"
            tableKey="minEquipmentTypeCheckItemId"
            ibmTaskTypeCd="ITT0000055"
            ibmTaskUnderTypeCd="ITTU000085"
            @imprChange="imprChange"
          />
        </template>
      </template>
      <template v-if="isMultiple" v-slot:table-chip>
        <q-chip outline square class="text-grey-7" style="font-weight: 700">
          <q-icon name="push_pin" color="primary" size="xs" style="margin-right: 5px" />
          {{ $language('설비명 (관리번호)') + ' : ' }}
          <b style="margin: auto 5px" class="text-primary">{{ result.equipmentName }}</b> ({{
            result.equipmentCd
          }})
        </q-chip>
      </template>
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="출력" icon="print" @btnClicked="printBtn" />
          <c-btn
            v-if="isMultiple && editable"
            :url="updateItemUrl"
            :isSubmit="isSave2"
            :param="result.equipmentResultList"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveItemInspection"
            @btnCallback="saveCallback"
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

import { equipResultType } from './equipmentPlan'

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
  name: 'equipmentResultItemTab'
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
  result?: resultType
  isMultiple?: boolean
  research?: researchType
}
interface resultType {
  equipmentCd: stringNull
  equipmentName: stringNull
  checkStatusCd: stringNull
  checkDeptName: stringNull
  checkUserName: stringNull
  plantName: stringNull
  minEquipmentCheckId: stringNull
  equipmentResultList: Array<equipResultType> | null
  checkDate: stringNull
}
interface researchType {
  impr: ''
  item: ''
}

interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<equipResultType>
  height?: stringNull
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
  result: () => {
    return {
      equipmentCd: '',
      equipmentName: '',
      checkStatusCd: '',
      checkDeptName: '',
      checkUserName: '',
      plantName: '',
      minEquipmentCheckId: '',
      equipmentResultList: [],
      checkDate: ''
    }
  },
  isMultiple: false,
  research: () => {
    return {
      impr: '',
      item: ''
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
const grid2 = ref<gridType>({
  merge: [{ index: 0, colName: 'checkItemName' }],
  columns: [
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목',
      style: 'width:200px',
      align: 'left',
      sortable: true
    },
    {
      name: 'checkWayName',
      field: 'checkWayName',
      label: '검사방법',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'decisionBasis',
      field: 'decisionBasis',
      label: '판정기준',
      style: 'width:200px',
      align: 'left',
      sortable: true
    },
    {
      name: 'checkCaution',
      field: 'checkCaution',
      label: '점검시 안전사항',
      style: 'width:200px',
      align: 'left',
      sortable: true
    },
    {
      name: 'checkResult',
      field: 'checkResult',
      label: '점검결과',
      align: 'left',
      style: 'width:200px',
      type: 'textarea',
      sortable: true
    },
    {
      name: 'judgmentResultTypeCd',
      field: 'judgmentResultTypeCd',
      label: '적합/부적합',
      align: 'center',
      style: 'width:130px',
      type: 'select',
      setHeader: true,
      comboItems: [
        { code: 'MCRC000005', codeName: $language('적합') },
        { code: 'MCRC000010', codeName: $language('부적합') },
        { code: 'MCRC000015', codeName: $language('대상외') }
      ],
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      style: 'width:150px',
      type: 'custom',
      sortable: false
    }
  ],
  data: [],
  height: '500px'
})
const updateItemUrl = ref('')
const isSave2 = ref(false)
const printUrl = ref('')
const table = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() =>
  defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
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
  updateItemUrl.value = transactionConfig.sop.min.equipment.result.updateItem.url
  printUrl.value = selectConfig.sop.min.equipment.maintain.print2.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 점검결과 저장
 *******************************/
function saveItemInspection() {
  if (validTable(grid2.value.columns, props.result.equipmentResultList!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(props.result.equipmentResultList, (_item) => {
          _item.minEquipmentCheckId = props.result.minEquipmentCheckId
        })
        isSave2.value = !isSave2.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 점검결과 저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
}
/******************************
 * TODO (목적): 점검결과 출력
 *******************************/
function printBtn() {
  $http({
    url: printUrl.value,
    method: 'GET',
    params: {
      checkDate: props.result.checkDate,
      checkDeptName: props.result.checkDeptName,
      checkUserName: props.result.checkUserName,
      plantName: props.result.plantName,
      equipmentCd: props.result.equipmentCd,
      minEquipmentCheckId: props.result.minEquipmentCheckId
    }
  }).then((_result: any) => {
    const windowObj = window.navigator as any
    const fileOrgNm = props.result.equipmentName + '(' + props.result.checkDate + ')' + '.xlsx'
    const blob = base64ToBlob(_result.data)
    if (windowObj && windowObj.msSaveOrOpenBlob) {
      windowObj.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
// 개선창 닫기 후
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
