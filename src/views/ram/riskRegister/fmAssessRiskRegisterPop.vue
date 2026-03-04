<template>
  <div>
    <c-search-box ref="searchbox" @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="none"
            name="plantCd"
            :disabled="plantDisabled"
            v-model:value="searchParam.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :customPopupParam="{ targetKey: 'process' }"
            label="공정"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            stepperGrpCd="IBM_STEP_CD"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="ibmStepCd"
            label="개선진행단계"
            v-model:value="searchParam.ibmStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="위험등록부 목록"
      tableId="riskRegister01"
      :columns="gridRisk.columns"
      :data="gridRisk.data"
      :gridHeight="gridRisk.height"
      :merge="gridRisk.merge"
      :editable="editable"
      @rowDblclick="rowDblclick"
      :selection="popupParam.type"
      rowKey="ramSignificantRiskRegisterId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
          <c-btn label="선택" icon="check" @btnClicked="select" />
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
  name: 'fmAssessRiskRegisterPop'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: ramPopupParamType
  contentHeight: stringNull
}
interface ramPopupParamType {
  type: stringNull
  plantCd: stringNull
  processCd: stringNull
  mdmSopId: stringNull
}
interface searchParamType {
  plantCd: stringNull
  ramTechniqueCd: stringNull
  processCd: stringNull
  ibmStepCd: stringNull
  mdmSopId: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {})

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
const searchParam = ref<searchParamType>({
  plantCd: null,
  ramTechniqueCd: 'RT00000025',
  processCd: null,
  ibmStepCd: null,
  mdmSopId: null
})
const gridRisk = ref<any>({
  merge: [
    { index: 0, colName: 'assessmentName' },
    { index: 1, colName: 'processName' },
    { index: 2, colName: 'jobName' }
  ],
  height: '',
  data: [],
  columns: [
    {
      name: 'assessmentName',
      field: 'assessmentName',
      label: '평가명',
      align: 'left',
      style: 'width:200px',
      sortable: false,
      fix: true
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'left',
      style: 'width:100px',
      sortable: false,
      fix: true
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '작업',
      align: 'left',
      style: 'width:150px',
      sortable: false,
      fix: true
    },
    {
      name: 'ram4mRiskHazardClassName',
      field: 'ram4mRiskHazardClassName',
      label: '평가구분(4M)',
      align: 'center',
      style: 'width:90px',
      sortable: false,
      fix: true
    },
    {
      name: 'riskHazardName',
      field: 'riskHazardName',
      label: '유해위험요인',
      align: 'left',
      style: 'width:170px',
      sortable: false,
      fix: true
    },
    {
      name: 'damageTargetName',
      field: 'damageTargetName',
      label: '피해대상',
      align: 'left',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'damageTypeName',
      field: 'damageTypeName',
      label: '재해형태',
      align: 'left',
      style: 'width:90px',
      sortable: false
    },
    // {
    //   name: 'existingRiskManagementActivities',
    //   field: 'existingRiskManagementActivities',
    //   label: '기존 리스크관리 활동',
    //   align: 'left',
    //   style: 'width:180px',
    //   sortable: false
    // },
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
          style: 'width:70px',
          color: 'red',
          sortable: false
        }
      ]
    },
    // {
    //   name: 'addingRiskManagementActivities',
    //   field: 'addingRiskManagementActivities',
    //   label: '추가 리스크관리 계획',
    //   align: 'left',
    //   style: 'width:180px',
    //   sortable: false
    // },
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
          style: 'width:70px',
          color: 'red',
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
  ]
})
const listUrl = ref('')
const table = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
// const plantDisabled = computed(() => {
//   return Boolean(props.popupParam.plantCd)
// })
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.contentHeight,
  () => {
    let height = props.contentHeight - 70
    if (height < 400) {
      height = 300
    }
    gridRisk.value.height = height + 'px'
  }
)
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
  listUrl.value = selectConfig.ram.fm.riskRegister.list.url
  // code setting
  if (props.popupParam.plantCd) {
    searchParam.value.plantCd = _.clone(props.popupParam.plantCd)
  }
  if (props.popupParam.processCd) {
    searchParam.value.processCd = _.clone(props.popupParam.processCd)
  }
  if (props.popupParam.mdmSopId) {
    searchParam.value.mdmSopId = _.clone(props.popupParam.mdmSopId)
  }
  // list setting
  getList()
}
/******************************
 * TODO (목적): 4m 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridRisk.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 4m 선택
 *******************************/
function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', selectData)
  }
}
/******************************
 * TODO (목적): Row 더블클릭
 *******************************/
function rowDblclick(row: any) {
  if (props.popupParam.type === 'single') {
    emits('closePopup', [row])
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
