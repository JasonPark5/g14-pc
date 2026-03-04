<template>
  <div>
    <c-table
      ref="table"
      title="위험등록부 목록"
      tableId="riskRegister01"
      :columns="gridRisk.columns"
      :data="riskReduce.riskbooks"
      :merge="gridRisk.merge"
      :gridHeight="setheight"
      :editable="editable && !disabled"
      selection="multiple"
      rowKey="ramSignificantRiskRegisterId"
      checkDisableColumn="riskRegisterFlag"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable && !disabled" label="삭제" icon="remove" @btnClicked="removeRisk" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'riskHazardPicture'">
          <q-icon
            style="font-size: 30px; cursor: pointer"
            class="text-success"
            name="image"
            @click.stop="openHazardPicture(props)"
          />
        </template>
        <template v-else-if="col.name === 'picture'">
          <q-icon
            style="font-size: 30px; cursor: pointer"
            class="text-primary"
            name="image"
            @click.stop="openImprPicture(props)"
          />
        </template>
        <template v-else-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="false"
            :requestContentsCols="requestContentsCols"
            tableKey="ramJsaAssessScenarioId"
            ibmTaskTypeCd="ITT0000015"
            ibmTaskUnderTypeCd="ITTU000020"
            @imprChange="imprChange"
          />
        </template>
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
  name: 'jsaRiskRegister'
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
const emits = defineEmits(['research'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  riskReduce: {
    imprs: Array<any>
    riskbooks: Array<any>
  }
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
  }
  height: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
  height: string
  merge: tableMergeType
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  riskReduce: () => {
    return {
      imprs: [],
      riskbooks: []
    }
  },
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: ''
    }
  },
  height: ''
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
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const gridRisk = ref<gridType>({
  merge: [
    { index: 0, colName: 'processName' },
    { index: 1, colName: 'processJob' },
    { index: 2, colName: 'processJobStep' },
    { index: 3, colName: 'processJobStepHazard' },
    { index: 4, colName: 'processJobStepHazard' }
  ],
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '작업',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'jobStepName',
      field: 'jobStepName',
      description: 'jobStepDesc',
      label: '작업단계',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'riskHazardPicture',
      field: 'riskHazardPicture',
      label: '사진',
      align: 'center',
      style: 'width:40px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'riskHazardName',
      field: 'riskHazardName',
      label: '분류-유해위험요인',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'relationLaw',
      field: 'relationLaw',
      label: '관련법규',
      align: 'left',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'riskOccurrenceCause',
      field: 'riskOccurrenceCause',
      label: '원인',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'riskOccurrenceResult',
      field: 'riskOccurrenceResult',
      label: '결과',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'currentSafetyMeasures',
      field: 'currentSafetyMeasures',
      label: '현재안전조치',
      align: 'left',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'before',
      field: 'before',
      label: '개선전',
      align: 'center',
      child: [
        {
          name: 'beforeFrequency',
          field: 'beforeFrequency',
          label: '빈도',
          align: 'center',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'beforeStrength',
          field: 'beforeStrength',
          label: '강도',
          align: 'center',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'beforeRisk',
          field: 'beforeRisk',
          label: '위험도',
          align: 'center',
          style: 'width:50px',
          sortable: false
        }
      ]
    },
    {
      name: 'picture',
      field: 'picture',
      label: '개선 전/후 사진',
      align: 'center',
      type: 'custom',
      style: 'width:70px',
      sortable: false
    },
    {
      name: 'improvementMeasures',
      field: 'improvementMeasures',
      label: '개선대책',
      align: 'left',
      style: 'width:150px',
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
          style: 'width:150px',
          type: 'custom',
          sortable: false
        }
      ]
    },
    {
      name: 'after',
      field: 'after',
      label: '개선후',
      align: 'center',
      child: [
        {
          name: 'afterFrequency',
          field: 'afterFrequency',
          label: '빈도',
          align: 'center',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'afterStrength',
          field: 'afterStrength',
          label: '강도',
          align: 'center',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'afterRisk',
          field: 'afterRisk',
          label: '위험도',
          align: 'center',
          style: 'width:50px',
          sortable: false
        }
      ]
    },
    {
      name: 'assessDate',
      field: 'assessDate',
      label: '평가일',
      align: 'center',
      style: 'width:90px',
      sortable: false
    },
    {
      name: 'assessUserName',
      field: 'assessUserName',
      label: '평가자',
      align: 'center',
      userId: 'assessUserId',
      style: 'width:80px',
      sortable: false
    }
  ],
  data: [],
  height: '500px'
})
const deleteUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const setheight = computed(() => {
  const pxRemove = props.height.replace('px', '')
  return props.height && props.height.indexOf('px') > -1 && !isNaN(pxRemove)
    ? Number(pxRemove) - 50 + 'px'
    : '500px'
})
const disabled = computed(() => {
  return props.param.ramStepCd === 'RRS0000015'
})
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const requestContentsCols = computed(() => {
  return ['jobStepName', 'riskHazardNameClass', 'riskOccurrenceCause']
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
  deleteUrl.value = $format(transactionConfig.ram.riskRegister.delete.url, 'ITT0000015')
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 재조회
 *******************************/
function research() {
  emits('research')
}
/******************************
 * TODO (목적): 개선 수정
 *******************************/
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
}
/******************************
 * TODO (목적): 유해위험요인 삭제
 *******************************/
function removeRisk() {
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
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        const deleteData = [] as any
        _.forEach(selectData, (item: any) => {
          deleteData.push({
            ramSignificantRiskRegisterId: item.ramSignificantRiskRegisterId,
            ramRiskAssessmentPlanId: item.ramRiskAssessmentPlanId,
            processCd: item.processCd,
            scenarioId: item.ramJsaAssessScenarioId
          })
        })

        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(deleteData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (_item: any) => {
            props.riskReduce.riskbooks.splice(
              _.findIndex(props.riskReduce.riskbooks, {
                ramSignificantRiskRegisterId: _item.ramSignificantRiskRegisterId
              }),
              1
            )
          })
          table.value.compoTable.clearSelection()
          research()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 유해위험요인 사진 오픈
 *******************************/
function openHazardPicture(_props: any) {
  popupOptions.value.title = '유해위험요인 사진'
  popupOptions.value.param = {
    ramRiskHazardId: _props.row.ramRiskHazardId,
    disabled: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/base/riskHazardPicture.vue'))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '50%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeHazardPicturePopup
}
/******************************
 * TODO (목적): 유해위험요인 사진팝업 callback
 *******************************/
function closeHazardPicturePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 개선사진 오픈
 *******************************/
function openImprPicture(_props: any) {
  popupOptions.value.title = '개선 전/후 사진'
  popupOptions.value.param = {
    ramJsaAssessScenarioId: _props.row.ramJsaAssessScenarioId,
    sopImprovementIds: _props.row.sopImprovementIds,
    disabled: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/jsa/action/jsaScenarioImprPicture.vue'))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '70%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeScenarioImprPicturePopup
}
/******************************
 * TODO (목적): 개선사진 오픈 callback
 *******************************/
function closeScenarioImprPicturePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
