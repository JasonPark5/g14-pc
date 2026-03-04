<template>
  <div>
    <c-card title="상세" class="cardClassDetailForm fm">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-md-4 col-lg-2">
          <c-label-text title="작성부서/이름/일자" :value="request" />
        </div>
        <div class="col-xs-12 col-md-4 col-lg-2">
          <c-label-text title="사업장" :value="assessPlan.plantName" />
        </div>
        <div class="col-xs-12 col-md-4 col-lg-2">
          <c-label-text
            title="평가기간"
            :value="assessPlan.assessmentStartDate + '~' + assessPlan.assessmentEndDate"
          />
        </div>
        <div class="col-xs-12 col-md-4 col-lg-2">
          <c-label-text title="평가년도" :value="assessPlan.assessmentYear" />
        </div>
        <div class="col-xs-12 col-md-4 col-lg-2">
          <c-label-text title="정기/수시" :value="assessPlan.ramAssessTypeName" />
        </div>
        <div class="col-xs-12 col-md-4 col-lg-2">
          <c-label-text title="Matrix" :value="assessPlan.matrixName" />
        </div>
        <div class="col-xs-12 col-md-4 col-lg-4">
          <c-label-text title="평가명" :value="assessPlan.assessmentName" />
        </div>
        <div class="col-xs-12 col-md-12 col-lg-4">
          <c-label-text title="상세내용" :value="assessPlan.remark" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 fmInfo">
          <c-upload
            :editable="false"
            :attachInfo="{
              isSubmit: true,
              taskClassCd: 'RISK_PLAN',
              taskKey: assessPlan.ramRiskAssessmentPlanId
            }"
          />
        </div>
      </template>
    </c-card>
    <c-card title="평가팀" class="q-mt-sm" :noMarginPadding="true">
      <template v-slot:card-detail>
        <div class="col-12 q-mt-xs">
          <q-chip
            v-for="(item, idx) in assessPlan.teams"
            outline
            square
            :key="idx"
            color="primary"
            text-color="white"
            icon="person_outline"
            :label="setTeamLabel(item)"
            :title="setTeamLabel(item)"
          />
        </div>
        <div class="col-12">
          <c-table
            class="q-mt-sm"
            ref="table3"
            title="관련자료"
            :columns="grid3.columns"
            :gridHeight="grid3.height"
            :data="assessPlan.relatedDocuments"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :editable="false"
          />
        </div>
      </template>
    </c-card>
    <c-table
      class="q-mt-sm"
      ref="table2"
      title="회의 목록"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="assessPlan.conferences"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="false"
    />
    <c-table
      ref="table"
      title="유해위험요인 파악현황"
      :columns="grid4.columns"
      :gridHeight="grid.height"
      :filtering="false"
      :usePaging="false"
      :data="grid4.data"
    >
      <template v-slot:customArea="{ props: bodyProps, col }">
        <template v-if="col.name === 'riskHazardNames'">
          <div class="grid-box">
            <span
              v-for="(item, index) in riskHazardList"
              :key="index"
              class="grid-cell"
              :class="{ circled: isCircled(bodyProps, item) }"
            >
              {{ item.riskHazardNumber }}
            </span>
          </div>
        </template>
      </template>
    </c-table>
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
import { assessPlanType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: '4mPlanTL'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setAssessmentName'])

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
    ramTechniqueCd: stringNull
  }
  height?: stringNull
}
interface gridType {
  columns: tableColumnType
  data?: Array<any>
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
  param: () => {
    return {
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      ramTechniqueCd: ''
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
const detailUrl = ref('')
const jobListUrl = ref('')
const riskHazardListUrl = ref('')
const assessPlan = ref<assessPlanType>({
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  plantCd: '', // 사업장 코드
  ramTechniqueCd: null, // 평가기법 코드_HAZOP/4m/JSA/CHECKLIST
  ramAssessTypeCd: null, // 평가구분_최초/정기/수시
  assessmentName: '', // 평가명
  assessmentStartDate: '', // 평가시작일
  assessmentEndDate: '', // 평가종료일
  assessmentPeriod: [],
  assessmentYear: '', // 평가년도
  ramStepCd: '', // 평가 진행단계 코드
  assessmentManageDeptCd: '', // 평가주관 부서 코드
  assessmentManageUserId: '', // 평가주관 담당자 ID
  ramMatrixId: null, // 위험메트릭스 번호
  matrixName: '',
  sopMocId: '', // MOC 일련번호
  remark: '', // 상세내용
  workArea: '', // 작업지역
  regUserId: '', // 작성자 ID
  regUserName: '', // 작성자 ID
  regDtStr: '',
  regUserDeptName: '',
  regDt: '',
  reviewUserId: '', // 검토자 ID
  reviewDate: '', // 검토일
  approvalUserId: '', // 승인자 ID
  approvalDate: '', // 승인일
  vendorCd: '',
  sopConstructionId: '',
  chgUserId: '', // 수정자 ID
  teams: [], // 평가팀 목록
  delTeams: [],
  occasions: [], // 수시 변경/추가 내역 목록
  conferences: [], // 회의 목록
  relatedDocuments: [], // 관련자료 목록
  processes: [] // 대상공정 목록
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'conferenceName',
      field: 'conferenceName',
      label: '회의명',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'conferenceDate',
      field: 'conferenceDate',
      label: '회의일',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'conferenceContents',
      field: 'conferenceContents',
      label: '회의내용',
      align: 'left',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'attendees',
      field: 'attendees',
      label: '참석자',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'col5',
      field: 'col5',
      label: '첨부파일',
      align: 'center',
      style: 'width:100px',
      type: 'attach',
      taskClassCd: 'RSA_CONFERENCE',
      keyText: 'ramAssessmentConferenceId',
      sortable: false
    }
  ],
  data: [],
  height: 'auto' //'300px'
})
const grid3 = ref<gridType>({
  columns: [
    {
      name: 'ramDocumentTypeName',
      field: 'ramDocumentTypeName',
      // 분류
      label: '분류',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'documentTitle',
      field: 'documentTitle',
      description: 'documentSubTitle',
      // 제목
      label: '제목',
      align: 'left',
      style: 'width:250px',
      sortable: false
    },
    {
      name: 'materialName',
      field: 'materialName',
      // 자료명
      label: '자료명',
      align: 'left',
      style: 'width:250px',
      sortable: false
    },
    {
      name: 'col5',
      field: 'col5',
      // 첨부파일
      label: '첨부파일',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'RSA_RELATE_INFO',
      keyText: 'ramRelatedDocumentId',
      sortable: false
    }
  ],
  height: 'auto' //'300px'
})

const grid4 = ref<gridType>({
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      style: 'width:10%',
      sortable: true
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '작업',
      align: 'left',
      style: 'width:20%',
      sortable: true
    },
    {
      name: 'riskHazardNames',
      field: 'riskHazardNames',
      label: '유해위험요인',
      align: 'center',
      type: 'custom',
      style: 'width:50%',
      sortable: true
    },
    {
      name: 'etc',
      field: 'etc',
      label: '기타정보',
      child: [
        {
          name: 'equipments',
          field: 'equipments',
          label: '설비',
          align: 'center',
          style: 'width:100px',
          maxWidth: '150px',
          isEllipsis: true,
          sortable: true
        },
        {
          name: 'chems',
          field: 'chems',
          label: '화학물질',
          align: 'center',
          style: 'width:100px',
          maxWidth: '150px',
          isEllipsis: true,
          sortable: true
        }
      ]
    }
  ],
  data: []
})
const riskHazardList = ref<any>([])
const listUrl = ref('')
/******************************
 * @Computed_선언
 *******************************/
const request = computed(() => {
  return assessPlan.value.regUserDeptName
    ? assessPlan.value.regUserDeptName + ' / '
    : '' + assessPlan.value.regUserName + ' / ' + assessPlan.value.regDt.slice(0, 10)
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
  detailUrl.value = selectConfig.ram.assessPlan.get.url
  riskHazardListUrl.value = selectConfig.ram.riskHazard.list.url
  jobListUrl.value = selectConfig.ram.assessJob.list.url
  listUrl.value = selectConfig.ram.fm.riskHazardStatus.url
  // code setting
  // list setting
  getDetail()
  getRiskHazardList()
  getList()
}
/******************************
 * TODO (목적): 유해위험요인 마스터 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    grid4.value.data = _result.data
  })
}
function getRiskHazardList() {
  $http({
    url: riskHazardListUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y',
      ramRiskHazardTechniqueCd: 'RTH0000001'
    }
  }).then((_result: any) => {
    riskHazardList.value = _result.data
  })
}

function isCircled(_props: any, _item: any) {
  return _.findIndex(_props.row.fmScenarios, { ramRiskHazardId: _item.ramRiskHazardId }) > -1
    ? true
    : false
}
function getDetail() {
  $http({
    url: $format(detailUrl.value, props.param.ramRiskAssessmentPlanId),
    method: 'GET'
  }).then((_result: any) => {
    assessPlan.value = _result.data
    assessPlan.value.assessmentPeriod =
      assessPlan.value.assessmentStartDate && assessPlan.value.assessmentEndDate
        ? [assessPlan.value.assessmentStartDate, assessPlan.value.assessmentEndDate]
        : []

    emits('setAssessmentName', assessPlan.value.assessmentName)
  })
}
function setTeamLabel(item: any) {
  const role =
    item.ramRoleTypeCd !== 'RRT0000010'
      ? item.ramRoleTypeName
      : item.ramRoleTypeName + '(' + item.etcRole + ')'
  return (
    role +
    ' / ' +
    item.ramInsideOutsideName +
    ' / ' +
    item.userName +
    (item.deptName ? ' / ' + item.deptName : '')
  )
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<style scoped>
.grid-box {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  gap: 4px;
  justify-items: center;
  align-items: center;
  padding: 2px;
}

.grid-cell {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.grid-cell.circled {
  border: 3px solid black;
  border-radius: 50%;
  font-weight: bold;
}
</style>
