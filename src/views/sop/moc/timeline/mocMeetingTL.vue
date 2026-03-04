<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-md-6 col-lg-6">
        <!-- 검토 상세 -->
        <c-card title="검토 상세">
          <template v-slot:card-detail>
            <div class="col-12">
              <!-- 위원회 -->
              <c-tag
                :editable="editable"
                :disabled="disabled"
                itemText="label"
                itemValue="check"
                label="위원회"
                name="committees"
                v-model:value="moc.committees"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <template v-if="!emergencyCheck">
                <!-- 승인여부 -->
                <c-radio
                  :disabled="disabled"
                  :editable="editable"
                  :comboItems="approvItems"
                  label="승인여부"
                  name="changeApprovalFlag"
                  v-model:value="moc.committeeHold!.changeApprovalFlag"
                />
              </template>
              <template v-else>
                <!-- 유지여부 -->
                <c-radio
                  :disabled="disabled"
                  :editable="editable"
                  :comboItems="keepItems"
                  label="유지여부"
                  name="changeKeepFlag"
                  v-model:value="moc.committeeHold!.changeKeepFlag"
                />
              </template>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <!-- 승인/불승인 처리일 -->
              <!-- 유지/원복 결정일 -->
              <c-datepicker
                :disabled="disabled"
                :editable="editable"
                :label="!emergencyCheck ? '승인/불승인 처리일' : '유지/원복 결정일'"
                name="changeApprovalDate"
                v-model:value="moc.committeeHold!.changeApprovalDate"
              />
            </div>
            <div class="col-12">
              <template v-if="!emergencyCheck">
                <!-- 승인/불승인 사유 -->
                <c-textarea
                  :disabled="disabled"
                  :editable="editable"
                  :rows="3"
                  label="승인/불승인 사유"
                  name="changeApprovalReason"
                  v-model:value="moc.committeeHold!.changeApprovalReason"
                />
              </template>
              <template v-else>
                <!-- 변경유지/원복 사유 -->
                <c-textarea
                  :disabled="disabled"
                  :editable="editable"
                  :rows="3"
                  label="변경유지/원복 사유"
                  name="changeKeepReason"
                  v-model:value="moc.committeeHold!.changeKeepReason"
                />
              </template>
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-6">
        <!-- 개최정보 -->
        <c-table
          title="개최정보"
          :columns="gridComitteeHold.columns"
          :gridHeight="gridComitteeHold.height"
          :data="gridComitteeHold.data"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :editable="false"
        />
      </div>
    </div>
    <!-- 검토필요항목 및 결과 -->
    <c-table
      class="q-mt-sm"
      title="검토필요항목 및 결과"
      :columns="grid2.columns"
      :gridHeight="grid2.height"
      :data="moc.committeeReviewItems"
      :filtering="false"
      :usePaging="false"
      :columnSetting="false"
      :editable="false"
    />
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
import { mocType } from '../moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'mocMeetingTL'
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
    sopMocId: stringNull
    mocTypeCd: stringNull
    mocStepCd: stringNull
    committeeHold: {
      sopMocId: stringNull // MOC 일련번호
      changeApprovalFlag: stringNull // 변경 승인 여부
      changeApprovalReason: stringNull // 변경 승인 사유
      changeApprovalDate: stringNull // 승인일
    }
  }
  disabled: boolean
}
interface gridComitteeHoldType {
  columns: Array<tableColumnType>
  height: string
  data: Array<any>
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
  param: () => {
    return {
      sopMocId: '',
      mocTypeCd: '',
      mocStepCd: '',
      committeeHold: {
        sopMocId: '', // MOC 일련번호
        changeApprovalFlag: '', // 변경 승인 여부
        changeApprovalReason: '', // 변경 승인 사유
        changeApprovalDate: '' // 승인일
      }
    }
  },
  disabled: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const moc = ref<mocType>({
  sopMocId: '', // MOC 일련번호
  mocNo: '', // moc 관리번호
  plantCd: '', // 사업장 코드
  processCd: '', // 공정
  judgmentUserId: '', // 판정자 ID
  judgmentUserName: '', // 판정자 명
  initiativeUserId: '', // 발의자 ID
  initiativeUserName: '', // 발의자 명
  initiativeDeptCd: '', // 발의 부서 코드
  initiativeDeptName: '', // 발의 부서명
  mocTitle: '', // 변경관리 제목
  mocSummary: '', // 변경 개요
  mocTypeCd: 'MT00000001', // 변경구분_공통코드(정상/비상/임시)
  mocWriteLevelCd: null, // 변경등급_작성
  mocConfirmLevelCd: null, // 변경등급_검토
  processSatefySecureMeasures: '', // 공정안전 확보 대책
  technicalBasisProcessDesign: '', // 변경계획에 대한 공정 및 설계의 기술근거
  safetyReliabilityImprovementEffect: '', // 안전성에 필요한 사항 및 신뢰성 향상 효과
  leaderOpinion: '', // 팀장의견
  relatedLaws: '', // 관련 볍령_텍스트
  processRiskAssessFlag: '', // 공정위험성 평가 여부
  jobRiskAssessFlag: '', // 작업위헝성 평가 여부
  mocPeriod: [],
  mocStartDate: '', // 변경 시작일
  mocEndDate: '', // 변경 종료일
  mocStepCd: '', // 변경관리 단계
  mocActionDeptCd: '', // 변경실행 부서코드
  mocActionResponsibilityUserId: '', // 변경실행 책임자 ID
  mocCompleteCheckUserId: '', // 변경완료 확인자 ID
  mocCompleteCheckDeptCd: '', // 변경완료 확인 부서 코드
  mocCompleteOpinion: '', // 변경완료 의견
  mocBenefitCds: '', // 변경관리 기대효과_복수
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  checklists: [],
  checklistEquips: [],
  checklistDrives: [],
  equipments: [],
  reviews: [],
  committees: [],
  committeeReviewItems: [],
  committeeHold: {
    sopMocId: '', // MOC 일련번호
    firstHoldDate: '', // (최초) 개최일
    firstHoldArea: '', // (최초) 개최장소
    firstReviewContents: '', // (최초) 검토내용
    firstReviewResult: '', // (최초) 검토결과
    professionalHoldDate: '', // (전문가) 개최일
    professionalHoldArea: '', // (전문가) 개최장소
    professionalReviewContents: '', // (전문가) 검토내용
    professionalReviewResult: '', // (전문가) 검토결과
    finalHoldDate: '', // (최종) 개최일
    finalHoldArea: '', // (최종) 개최장소
    finalReviewContents: '', // (최종) 검토내용
    finalReviewResult: '', // (최종) 검토결과
    changeApprovalFlag: '', // 변경 승인 여부
    changeApprovalReason: '', // 변경 승인 사유
    changeApprovalDate: '', // 승인일
    changeKeepFlag: '', // 변경유지 여부
    changeKeepReason: '', // 변경유지 사유
    regUserId: '', // 등록자 ID
    chgUserId: '' // 수정자 ID
  },
  relatedWorks: [],
  prestartupImproves: []
})
const gridComitteeHold = ref<gridComitteeHoldType>({
  columns: [
    {
      name: 'gubun',
      field: 'gubun',
      // 구분
      label: '구분',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'holdDate',
      field: 'holdDate',
      // 개최일
      label: '개최일',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'holdArea',
      field: 'holdArea',
      // 개최장소
      label: '개최장소',
      align: 'left',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'reviewContents',
      field: 'reviewContents',
      // 검토내용
      label: '검토내용',
      align: 'left',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'reviewResult',
      field: 'reviewResult',
      // 검토결과
      label: '검토결과',
      align: 'left',
      style: 'width:150px',
      sortable: true
    }
  ],
  data: [],
  height: '333px'
})
const grid2 = ref({
  columns: [
    {
      name: 'reviewItemName',
      field: 'reviewItemName',
      // 검토항목
      label: '검토항목',
      align: 'left',
      style: 'width:250px',
      sortable: true
    },
    {
      name: 'confirmUserName',
      field: 'confirmUserName',
      // 확인자
      label: '확인자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'reviewCompleteRequestDate',
      field: 'reviewCompleteRequestDate',
      // 검토완료요구일
      label: '검토완료요구일',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'reviewUserName',
      field: 'reviewUserName',
      // 검토자
      label: '검토자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'reviewContents',
      field: 'reviewContents',
      // 검토내용
      label: '검토내용',
      align: 'left',
      style: 'width:400px',
      sortable: true
    },
    {
      name: 'reviewCompleteDate',
      field: 'reviewCompleteDate',
      // 검토완료일
      label: '검토완료일',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'col5',
      field: 'col5',
      // 첨부파일
      label: '첨부파일',
      align: 'center',
      style: 'width:150px',
      sortable: false
    }
  ],
  height: '400px'
})
const approvItems = ref([
  { code: 'Y', codeName: '승인' },
  { code: 'N', codeName: '불승인' }
])
const keepItems = ref([
  { code: 'Y', codeName: '유지' },
  { code: 'N', codeName: '원복' }
])
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const emergencyCheck = computed(() => props.param.mocTypeCd === 'MT00000010')

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
  detailUrl.value = selectConfig.sop.moc.change.review.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): MOC 검토 조회
 *******************************/
function getDetail() {
  if (props.param.sopMocId) {
    $http({
      url: $format(detailUrl.value, props.param.sopMocId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(moc.value, _result.data)
      if (!moc.value.committeeHold) {
        moc.value.committeeHold = {
          sopMocId: '', // MOC 일련번호
          firstHoldDate: '', // (최초) 개최일
          firstHoldArea: '', // (최초) 개최장소
          firstReviewContents: '', // (최초) 검토내용
          firstReviewResult: '', // (최초) 검토결과
          professionalHoldDate: '', // (전문가) 개최일
          professionalHoldArea: '', // (전문가) 개최장소
          professionalReviewContents: '', // (전문가) 검토내용
          professionalReviewResult: '', // (전문가) 검토결과
          finalHoldDate: '', // (최종) 개최일
          finalHoldArea: '', // (최종) 개최장소
          finalReviewContents: '', // (최종) 검토내용
          finalReviewResult: '', // (최종) 검토결과
          changeApprovalFlag: '', // 변경 승인 여부
          changeApprovalReason: '', // 변경 승인 사유
          changeApprovalDate: '', // 승인일
          changeKeepFlag: '', // 변경유지 여부
          changeKeepReason: '', // 변경유지 사유
          regUserId: '', // 등록자 ID
          chgUserId: '' // 수정자 ID
        }
      }
      if (moc.value.committees && moc.value.committees.length > 0) {
        _.forEach(moc.value.committees, (committee) => {
          committee.label =
            committee.mocRoleName +
            '/' +
            committee.userName +
            (committee.deptName ? '/' + committee.deptName : '')
          committee.check = true
        })
      }
      gridComitteeHold.value.data.push({
        gubun: $language('최초'), // 최초
        holdDate: moc.value.committeeHold.firstHoldDate,
        holdArea: moc.value.committeeHold.firstHoldArea,
        reviewContents: moc.value.committeeHold.firstReviewContents,
        reviewResult: moc.value.committeeHold.firstReviewResult
      })
      gridComitteeHold.value.data.push({
        gubun: $language('전문가'), // 전문가
        holdDate: moc.value.committeeHold.professionalHoldDate,
        holdArea: moc.value.committeeHold.professionalHoldArea,
        reviewContents: moc.value.committeeHold.professionalReviewContents,
        reviewResult: moc.value.committeeHold.professionalReviewResult
      })
      gridComitteeHold.value.data.push({
        gubun: $language('최종'), // 최종'
        holdDate: moc.value.committeeHold.finalHoldDate,
        holdArea: moc.value.committeeHold.finalHoldArea,
        reviewContents: moc.value.committeeHold.finalReviewContents,
        reviewResult: moc.value.committeeHold.finalReviewResult
      })
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
