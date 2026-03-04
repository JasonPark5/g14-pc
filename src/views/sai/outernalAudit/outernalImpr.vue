<template>
  <div>
    <c-table
      ref="table2"
      class="q-mt-md"
      title="개선요청"
      :columns="grid2.columns"
      :gridHeight="gridHeight"
      :data="imprs"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
      @linkClick="imprlinkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            label="추가"
            :showLoading="false"
            icon="add"
            @btnClicked="addImpr"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-table
      ref="table1"
      title="즉시조치"
      :columns="grid.columns"
      :gridHeight="gridHeight"
      :data="imprImms"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
      @linkClick="immlinkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            label="추가"
            :showLoading="false"
            icon="add"
            @btnClicked="addImprImm"
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
  name: 'outernalImpr'
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
  popupParam: {
    saiOuternalResultId: stringNull
  }
  outernal: any
  disabled: boolean
  contentHeight: stringNull
}
interface gridType {
  columns: tableColumnType
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
      saiOuternalResultId: ''
    }
  },
  outernal: () => {
    return {
      saiOuternalResultId: '', // 외부심사결과 일련번호
      plantCd: '', // 사업장코드
      outernalResultName: '', // 외부심사명
      auditStartDate: '', // 심사시작일
      auditEndDate: '', // 심사종료일
      period: [],
      year: '',
      auditTargetDeptCd: '', // 심사대상부서
      auditDeptCd: '', // 심사주관부서
      saiOuternalAuditAgency: null, // 주관심사기관
      auditPurpose: '', // 심사목적
      imprDerivedItems: '', // 개선도출항목
      auditResult: null, // 심사결과
      auditResultSummary: '', // 심사결과요약
      auditTargetDeptReviewOpinion: '', // 심사대상부서검토의견
      regUserId: '',
      chgUserId: '',
      auditTeams: [], // 심사팀
      deleteAuditTeams: [], // 심사팀 [삭제]
      imprs: [] // 개선
    }
  },
  disabled: false,
  contentHeight: null
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
const imprData = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'actionContents',
      field: 'actionContents',
      label: '조치내용',
      align: 'left',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'actionCompleteDate',
      field: 'actionCompleteDate',
      label: '조치완료일',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ]
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'improveRequestContents',
      field: 'improveRequestContents',
      label: '요청내용',
      align: 'left',
      sortable: false
    },
    {
      name: 'ibmStepName',
      field: 'ibmStepName',
      label: '진행상태',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'actionCompleteRequestDate',
      field: 'actionCompleteRequestDate',
      label: '조치완료 요청일',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ]
})
/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let _height = props.contentHeight - 500
  if (_height <= 300) {
    _height = 300
  }
  return String(_height) + 'px'
})
const imprs = computed(() => {
  return _.filter(props.outernal.imprs, { ibmClassCd: 'IC00000001' })
})
const imprImms = computed(() => {
  return _.filter(props.outernal.imprs, { ibmClassCd: 'IC00000005' })
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
  listUrl.value = selectConfig.sai.outernal.result.impr.url
  // code setting
  // list setting
}
function getImprs() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      saiOuternalResultId: props.outernal.saiOuternalResultId
    }
  }).then((_result: any) => {
    _.extend(props.outernal.imprs, _result.data)
  })
}
function addImprImm() {
  popupOptions.value.title = '즉시조치'
  popupOptions.value.param = {
    requestContents: props.outernal.outernalResultName,
    relationTableKey: props.outernal.saiOuternalResultId,
    ibmTaskTypeCd: 'ITT0000155',
    ibmTaskUnderTypeCd: 'ITTU000160'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprImmDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
function addImpr() {
  popupOptions.value.title = '개선요청'
  popupOptions.value.param = {
    requestContents: props.outernal.outernalResultName,
    relationTableKey: props.outernal.saiOuternalResultId,
    ibmTaskTypeCd: 'ITT0000155',
    ibmTaskUnderTypeCd: 'ITTU000160'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprPopup
}
function closeImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImprs()
}
function immlinkClick(row: any) {
  imprData.value = row
  popupOptions.value.title = '즉시조치 상세'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprImmDetail.vue`))
  )
  popupOptions.value.param = {
    sopImprovementId: row.sopImprovementId
  }
  popupOptions.value.width = '70%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImmDetailPopup
}
function closeImmDetailPopup(result: any, flag: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.col1) {
    if (flag !== 'delete') {
      _.extend(imprData.value, result.col1)
    } else {
      props.outernal.imprs = _.reject(props.outernal.imprs, {
        sopImprovementId: result.col1.sopImprovementId
      })
    }
  }
}
function imprlinkClick(row: any) {
  imprData.value = row
  popupOptions.value.title = '개선'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
  )
  popupOptions.value.param = {
    sopImprovementId: row.sopImprovementId
  }
  popupOptions.value.width = '80%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeImprDetailPopup
}
function closeImprDetailPopup(result: any, flag: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.col1) {
    if (flag !== 'delete') {
      _.extend(imprData.value, result.col1)
    } else {
      props.outernal.imprs = _.reject(props.outernal.imprs, {
        sopImprovementId: result.col1.sopImprovementId
      })
    }
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
