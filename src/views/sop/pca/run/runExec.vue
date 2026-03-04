<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-table
          ref="table1"
          title="평가항목"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :isExcelDown="false"
          :columns="grid1.columns"
          :data="grid1.data"
          :gridHeight="gridheight"
          @rowClick="rowClick"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
        <c-table
          ref="table3"
          :editable="editable && !disabled"
          :title="selectedRow.itemMstName"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :isExcelDown="false"
          :columns="grid3.columns"
          :data="grid3.data"
          :merge="grid3.merge"
          :gridHeight="gridheight"
        >
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'customCol'">
              <component
                :is="imprComponent"
                :col="col"
                :props="props"
                :inputEditable="
                  editable && Boolean(props.row.selfInspectionResultItemId) && !disabled
                "
                :isImmShow="true"
                :requestContentsCols="['itemMstName', 'itemTypeName', 'itemName']"
                tableKey="selfInspectionResultItemId"
                ibmTaskTypeCd="ITT0000035"
                ibmTaskUnderTypeCd="ITTU000060"
                @imprChange="imprChange"
              />
            </template>
            <template v-else-if="col.name === 'answerUserId'">
              <c-task-target
                :editable="editable && !disabled"
                :customPopupParam="{ targetKey: 'user' }"
                name="answerUserId"
                v-model:value="props.row[col.name]"
                @dataChange="(data1: any, data2: any, data3: any) => dataChange(data3, props)"
              />
            </template>
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="저장" icon="save" @btnClicked="saverow" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { auditType } from '../audit'

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
  name: 'runExec'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull
  }
  research: {
    impr: stringNull
    item: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
  height?: stringNull
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
      selfInspectionResultId: '',
      selfInspectionStatusCd: '',
      sysRevision: ''
    }
  },
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'itemMstName',
      field: 'itemMstName',
      label: '평가항목',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid3 = ref<gridType>({
  merge: [{ index: 0, colName: 'selfInspectionItemTypeId' }],
  columns: [
    {
      name: 'itemTypeName',
      field: 'itemTypeName',
      label: '구분',
      align: 'left',
      style: 'width: 160px',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: 'No.',
      align: 'center',
      style: 'width: 50px',
      sortable: false
    },
    {
      name: 'itemName',
      field: 'itemName',
      label: '세부항목',
      align: 'left',
      type: 'html',
      sortable: false
    },
    {
      name: 'selfInspectionResultCd',
      field: 'selfInspectionResultCd',
      label: '평가',
      align: 'center',
      setHeader: true,
      type: 'select',
      codeGroupCd: 'SELF_INSPECTION_RESULT_CD',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'selfInspectionRemark',
      field: 'selfInspectionRemark',
      label: '평가 근거',
      align: 'left',
      type: 'textarea',
      style: 'width: 150px',
      sortable: false
    },
    {
      name: 'answerUserName',
      field: 'answerUserName',
      label: '답변자',
      align: 'center',
      sortable: false,
      type: 'user',
      userId: 'answerUserId',
      value: '',
      setHeader: true,
      style: 'width:100px'
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      style: 'width:200px',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const audit = ref<auditType>({
  selfInspectionResultId: '', // 자체감사 계획 일련번호
  selfInspectionTitle: '', // 감사명
  selfInspectionYear: '', // 감사년도
  selfInspectionTypeCd: null, // 감사종류
  plantCd: null, // 해당사업장
  remark: '', // 감사대상 개요
  selfInspectionStartDt: '', // 감사기간-시작일
  selfInspectionEndDt: '', // 감사기간-종료일
  selfInspectionStatusCd: '', // 감사진행상태-계획중,계획완료,감사완료
  selfInspectionResultOpinion: '', // 감사원소견
  selfInspectionResultTotalOpinion: '', // 감사 결과 종합의견
  selfInspectionResultCorrect: '', // 시정 및 권고 요약
  selfInspectionDt: [],
  sysRevision: '', // 평가항목 개정번호
  chgUserId: '',
  sysApprovalRequestId: '',
  approvalTypeCd: '',
  approvalStatusCd: '',
  approvalStatusName: ''
})
const gridheight = ref(window.innerHeight - 220 + 'px')
const editable = ref(true)
const list1Url = ref('')
const list3Url = ref('')
const updateUrl = ref('')
const infoUrl = ref('')
const selectedRow = ref<any>({})
const table1 = ref<any>(null)
const table3 = ref<any>(null)

/******************************
 * @Computed_선언 : 개선요청 Component
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const disabled = computed(() => false)

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
  infoUrl.value = selectConfig.sop.pca.result.info.get.url
  list1Url.value = selectConfig.sop.pca.item.revs.url
  list3Url.value = selectConfig.sop.pca.itemsresult.mst.url
  updateUrl.value = transactionConfig.sop.pca.result.item.save.url
  // code setting
  // list setting
  getInfo()
  getList()
}
/******************************
 * TODO (목적): 기본정보 조회
 *******************************/
function getInfo() {
  $http({
    url: infoUrl.value,
    method: 'GET',
    params: { selfInspectionResultId: props.popupParam.selfInspectionResultId }
  }).then((_result: any) => {
    audit.value = _result.data
  })
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: list1Url.value,
    method: 'GET',
    params: { sysRevision: props.popupParam.sysRevision }
  }).then((_result: any) => {
    grid1.value.data = _result.data
    rowClick(grid1.value.data[0])
  })
}
/******************************
 * TODO (목적): 행 클릭시
 *******************************/
function rowClick(row: any) {
  selectedRow.value = row
  $http({
    url: list3Url.value,
    method: 'GET',
    params: {
      selfInspectionItemMstId: row.selfInspectionItemMstId,
      selfInspectionResultId: props.popupParam.selfInspectionResultId
    }
  }).then((_result: any) => {
    console.log(_result.data)
    grid3.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 행 저장
 *******************************/
function saverow() {
  const saveData = grid3.value.data.filter((x) => {
    return x.editFlag == 'U'
  })
  _.forEach(saveData, (item) => {
    item.selfInspectionResultId = props.popupParam.selfInspectionResultId
    item.regUserId = user.value.userId
    item.chgUserId = user.value.userId
  })
  if (saveData.length > 0) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      confirmCallback: () => {
        $http({
          url: updateUrl.value,
          method: 'POST',
          data: saveData
        }).then(() => {
          message.requestSuccess()
          rowClick(selectedRow.value)
        })
      },
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
 * TODO (목적): 개선창 닫기 후
 *******************************/
function imprChange() {
  props.research.impr = uid()
  table3.value.compoTable.resetVirtualScroll()
}
/******************************
 * TODO (목적): 동일한 selfInspectionItemTypeId 를 가진 다른 row 들의 answerUserId 값도 변경
 *******************************/
function dataChange(_data: any, _props: any) {
  for (const row of grid3.value.data) {
    if (row.selfInspectionItemTypeId === _props.row.selfInspectionItemTypeId) {
      row.answerUserId = _data.userId
      if (row.editFlag !== 'C') {
        row.editFlag = 'U'
        row.chgUserId = user.value.userId
      }
    }
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
