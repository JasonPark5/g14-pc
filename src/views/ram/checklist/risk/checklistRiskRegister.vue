<template>
  <div>
    <c-table
      ref="table"
      title="위험등록부 목록"
      tableId="riskRegister"
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
        <template v-if="col.name === 'customCol'">
          <component
            :is="imprComponent"
            :col="col"
            :props="props"
            :inputEditable="false"
            :requestContentsCols="requestContentsCols"
            tableKey="ramChecklistAssessScenarioId"
            ibmTaskTypeCd="ITT0000010"
            ibmTaskUnderTypeCd="ITTU000010"
            @imprChange="imprChange"
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
        <template v-else-if="col.name === 'checkItemName'">
          <template v-if="props.row.checkItemId && props.row.ramCheckItemClassCd !== 'RCIC000015'">
            <!-- 작업, 기계·기구, 유해인자 & link 걸린 대상 -->
            <q-btn
              flat
              class="tableinnerBtn"
              align="left"
              color="blue-6"
              :label="props.row[col.name]"
              @click.stop="openItem(props.row)"
            />
          </template>
          <template v-else>
            <!-- 기타 & link 걸리지 않은 대상 -->
            {{ props.row[col.name] }}
          </template>
        </template>
        <template v-else-if="col.name === 'ramInspectResultName'">
          <q-chip
            :style="{
              color:
                props.row[col.name] === '보완'
                  ? 'red'
                  : props.row[col.name] === '적정'
                    ? 'green'
                    : 'grey'
            }"
            outline
            square
          >
            {{ props.row[col.name] }}
          </q-chip>
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
  name: 'checklistRiskRegister'
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
  isFull: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const gridRisk = ref<gridType>({
  merge: [
    { index: 0, colName: 'processCd' },
    { index: 1, colName: 'checkClassGroup' },
    { index: 2, colName: 'checkItemGroup' }
  ],
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'left',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'ramCheckItemClassName',
      field: 'ramCheckItemClassName',
      label: '분류',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '평가대상',
      align: 'center',
      style: 'width:150px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'checklistQuestion',
      field: 'checklistQuestion',
      label: '체크리스트 문항',
      align: 'left',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'relationLaw',
      field: 'relationLaw',
      label: '관련법규',
      align: 'left',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'currentSafetyMeasures',
      field: 'currentSafetyMeasures',
      label: '현재안전조치',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'ramInspectResultName',
      field: 'ramInspectResultName',
      label: '결과',
      align: 'center',
      style: 'width:90px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'picture',
      field: 'picture',
      label: '개선 전/후 사진',
      align: 'center',
      type: 'custom',
      style: 'width:50px',
      sortable: false
    },
    {
      name: 'improvementMeasures',
      field: 'improvementMeasures',
      label: '추가 리스크관리 계획',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선번호/개선진행상태',
      align: 'center',
      style: 'width:130px',
      type: 'custom',
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
  return ['ramCheckItemClassName', 'checkItemName']
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
  deleteUrl.value = $format(transactionConfig.ram.riskRegister.delete.url, 'ITT0000010')
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
            scenarioId: item.ramChecklistAssessScenarioId
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
function openItem(row: any) {
  if (row.ramCheckItemClassCd === 'RCIC000001') {
    popupOptions.value.title = '안전작업표준 상세'
    popupOptions.value.param = {
      mdmSopId: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/mdm/pim/sopDetail.vue`))
    )
    popupOptions.value.width = '80%'
    popupOptions.value.isFull = false
  } else if (row.ramCheckItemClassCd === 'RCIC000005') {
    popupOptions.value.title = '유해위험기계기구 상세'
    popupOptions.value.param = {
      hhmHazardousMachineryId: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(
        () => import(`@views/sop/mim/hazardEquipment/hazardEquipmentClassDetail.vue`)
      )
    )
    popupOptions.value.isFull = true
  } else {
    popupOptions.value.title = '유해인자 상세'
    popupOptions.value.param = {
      hazardCd: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sai/wmr/harmfulFactorsDetail.vue`))
    )
    popupOptions.value.isFull = false
    popupOptions.value.width = '80%'
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 개선사진 오픈
 *******************************/
function openImprPicture(_props: any) {
  popupOptions.value.title = '개선 전/후 사진'
  popupOptions.value.param = {
    ramChecklistAssessScenarioId: _props.row.ramChecklistAssessScenarioId,
    sopImprovementIds: _props.row.sopImprovementIds,
    disabled: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(
      () => import('@views/ram/checklist/action/checklistScenarioImprPicture.vue')
    )
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '60%'
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
