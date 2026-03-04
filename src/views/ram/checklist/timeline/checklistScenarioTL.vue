<template>
  <div>
    <c-table
      ref="table"
      title="시나리오 목록"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="grid.data"
      :merge="grid.merge"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="false"
    >
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
  name: '4mScenarioTL'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
  }
  height?: stringNull
}
interface gridType {
  columns: tableColumnType
  data?: Array<any>
  height?: stringNull
  merge?: tableMergeType
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: ''
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
const listUrl = ref('')
const popupOptions = ref<popupParamType>({
  width: '90%',
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
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
      style: 'width:60px',
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
  height: 'auto' //'600px'
})
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
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
  listUrl.value = selectConfig.ram.checklist.scenario.list.url
  // code setting
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function imprChange() {
  table.value.compoTable.resetVirtualScroll()
}
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
function closeScenarioImprPicturePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
