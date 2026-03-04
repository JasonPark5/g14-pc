<template>
  <div>
    <c-table
      ref="table"
      title="유해위험요인 파악현황"
      :columns="grid.columns"
      :filtering="false"
      :usePaging="false"
      :data="grid.data"
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
      <template v-slot:table-chip>
        <q-chip outline square icon="info" color="primary" size="0.9em" style="font-weight: 500"
          >{{ '유해위험요인 조회' }}
          <q-menu style="padding: 10px; overflow-y: auto; max-height: 90vh">
            <div class="menu-grid">
              <div v-for="(item, index) in riskHazardList" :key="index" class="menu-item">
                <span class="menu-number">{{ item.riskHazardNumber }}</span>

                <span class="menu-name">{{ item.riskHazardName }}</span>
              </div>
            </div>
          </q-menu>
        </q-chip>
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
import { assessPlanType } from '../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskHazardStatus'
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
  assessPlan: assessPlanType
  statusFlag: {
    value: stringNull
  }
  vendorFlag: boolean
  disabled: boolean
  disabled2: boolean
}

interface gridType {
  columns: tableColumnType
  data: Array<any>
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  assessPlan: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      plantCd: '', // 사업장 코드
      ramTechniqueCd: '', // 평가기법 코드_HAZOP/KRAS/JSA/CHECKLIST
      ramAssessTypeCd: '', // 평가구분_최초/정기/수시
      assessmentName: '', // 평가명
      assessmentStartDate: '', // 평가시작일
      assessmentEndDate: '', // 평가종료일
      assessmentPeriod: [],
      assessmentYear: '', // 평가년도
      ramStepCd: '', // 평가 진행단계 코드
      assessmentManageDeptCd: '', // 평가주관 부서 코드
      assessmentManageUserId: '', // 평가주관 담당자 ID
      ramMatrixId: null, // 위험메트릭스 번호
      sopMocId: '', // MOC 일련번호
      remark: '', // 상세내용
      workArea: '', // 작업지역
      regDtStr: '',
      regUserId: '', // 작성자 ID
      regUserName: '', // 작성자 ID
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
    }
  },
  statusFlag: () => {
    return {
      value: ''
    }
  },
  vendorFlag: false,
  disabled: false,
  disabled2: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref<gridType>({
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
const listUrl = ref('')
const jobListUrl = ref('')
const riskHazardListUrl = ref('')
const riskHazardList = ref<any>([])
// const hazardScenarioList = ref<any>([])

const ramRiskHazardTechniqueCd = ref<string>('')

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.statusFlag.value,
  () => {
    getList()
  },
  { deep: true }
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
  riskHazardListUrl.value = selectConfig.ram.riskHazard.list.url
  jobListUrl.value = selectConfig.ram.assessJob.list.url

  if (props.assessPlan.ramTechniqueCd === 'RT00000020')
    // KRAS
    listUrl.value = selectConfig.ram.kras.riskHazardStatus.url
  else if (props.assessPlan.ramTechniqueCd === 'RT00000025')
    // 4M
    listUrl.value = selectConfig.ram.fm.riskHazardStatus.url
  // code setting
  // list setting
  getRiskHazardList()
  // getHazardScenarioList()
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
      ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId,
      ramRiskHazardTechniqueCd: ramRiskHazardTechniqueCd.value
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function getRiskHazardList() {
  if (props.assessPlan.ramTechniqueCd === 'RT00000025')
    ramRiskHazardTechniqueCd.value = 'RTH0000001'
  else if (props.assessPlan.ramTechniqueCd === 'RT00000020')
    ramRiskHazardTechniqueCd.value = 'RTH0000005'

  $http({
    url: riskHazardListUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y',
      ramRiskHazardTechniqueCd: ramRiskHazardTechniqueCd.value
    }
  }).then((_result: any) => {
    riskHazardList.value = _result.data
  })
}

function isCircled(_props: any, _item: any) {
  if (props.assessPlan.ramTechniqueCd === 'RT00000025')
    // 4M
    return _.findIndex(_props.row.fmScenarios, { ramRiskHazardId: _item.ramRiskHazardId }) > -1
      ? true
      : false
  else if (props.assessPlan.ramTechniqueCd === 'RT00000020')
    // KRAS
    return _.findIndex(_props.row.krasScenarios, { ramRiskHazardId: _item.ramRiskHazardId }) > -1
      ? true
      : false
}
/******************************
 * TODO (목적): 조회
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
// function getHazardScenarioList() {
//   $http({
//     url: listUrl.value,
//     method: 'GET',
//     params: {
//       ramRiskAssessmentPlanId: props.assessPlan.ramRiskAssessmentPlanId
//     }
//   }).then((_result: any) => {
//     hazardScenarioList.value = _result.data
//   })
// }
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

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.menu-item {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px 4px;
  text-align: center;
  font-size: 0.75rem;
  background-color: #f9f9f9;
}

.menu-number {
  font-weight: bold;
  font-size: 0.8rem;
  padding-left: 5px;
  float: left;
}

.menu-name {
  font-size: 0.7rem;
  padding-left: 10px;
  float: left;
  color: #555;
  margin-top: 2px;
  word-break: keep-all;
}
</style>
