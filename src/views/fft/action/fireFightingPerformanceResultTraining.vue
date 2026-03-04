<template>
  <q-form ref="editForm">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 q-mb-sm">
      <c-card title="소방훈련 결과" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              :editable="editable"
              label="훈련일자"
              name="trainingDate"
              v-model:value="performanceResultRecord.trainingDate"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              :editable="editable"
              type="time"
              :range="true"
              :minuteStep="10"
              label="훈련시간"
              name="trainingTime"
              v-model:value="performanceResultRecord.trainingTime"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              label="훈련장소"
              name="trainingLocation"
              v-model:value="performanceResultRecord.trainingLocation"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-radio
              :editable="editable"
              codeGroupCd="SOP_FIRE_FIGHTING_TRANING_EDU_FORM_CD"
              label="훈련유형"
              name="trainingTypeCd"
              v-model:value="performanceResultRecord.trainingTypeCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              label="훈련교관"
              name="trainingInstructor"
              v-model:value="performanceResultRecord.trainingInstructor"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              type="number"
              label="참석대상(명)"
              name="trainingTargetCount"
              v-model:value="performanceResultRecord.trainingTargetCount"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              type="number"
              label="참석(명)"
              name="trainingAttendanceCount"
              v-model:value="performanceResultRecord.trainingAttendanceCount"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              type="number"
              label="미참석(명)"
              name="trainingAbsenceCount"
              v-model:value="performanceResultRecord.trainingAbsenceCount"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-text
              :editable="editable"
              label="훈련보조재료"
              name="trainingMaterials"
              v-model:value="performanceResultRecord.trainingMaterials"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :rows="2"
              :editable="editable"
              label="소화훈련내용"
              name="fireDrillContent"
              v-model:value="performanceResultRecord.fireDrillContent"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :rows="2"
              :editable="editable"
              label="통보훈련내용"
              name="notificationContent"
              v-model:value="performanceResultRecord.notificationContent"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :rows="2"
              :editable="editable"
              label="피난훈련내용"
              name="evacuationContent"
              v-model:value="performanceResultRecord.evacuationContent"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :rows="2"
              :editable="editable"
              label="훈련성과"
              name="trainingResult"
              v-model:value="performanceResultRecord.trainingResult"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :rows="2"
              :editable="editable"
              label="문제점"
              name="trainingIssue"
              v-model:value="performanceResultRecord.trainingIssue"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :rows="2"
              :editable="editable"
              label="개선계획"
              name="trainingImprovementPlan"
              v-model:value="performanceResultRecord.trainingImprovementPlan"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-upload
              :editable="editable"
              :attachInfo="trainingAttachInfo"
              label="소방훈련 관련사진"
            />
          </div>
        </template>
      </c-card>
    </div>
  </q-form>
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
import { recordType } from '../fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingPerformanceResultTraining'
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
  contentHeight?: stringNull
  performanceResultRecord: recordType
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  performanceResultRecord: () => {
    return {
      sopFireFightingPerformanceResultRecordId: '', // 소방 교육·훈련 실기결과기록부 일련번호
      recordName: '', // 실시결과기록부명
      targetName: '', // 소방대상물 - 대상명
      usage: '', // 소방대상물 - 용도
      ownerId: '', // 소방대상물 - 대표자ID
      location: '', // 소방대상물 - 주소
      sopFireManagementLevelCd: '', // 소방대상물 - 등급
      relatedUserName: '', // 관계인 - 성명(기관 또는 법인명)
      address: '', // 관계인 - 주소
      trainingDate: '', // 훈련일자
      trainingStartTime: '', // 훈련시작시간
      trainingEndTime: '', // 훈련종료시간
      trainingTime: [],
      trainingLocation: '', // 훈련장소
      trainingTypeCd: '', // 훈련유형(자체/합동)
      trainingInstructor: '', // 훈련교관
      trainingTargetCount: null, // 참석대상(명)
      trainingAttendanceCount: null, // 참석(명)
      trainingAbsenceCount: null, // 미참석(명)
      trainingMaterials: '', // 훈련보조재료
      fireDrillContent: '', // 소화훈련내용
      notificationContent: '', // 통보훈련내용
      evacuationContent: '', // 피난훈련내용
      trainingResult: '', // 훈련성과
      trainingIssue: '', // 훈련 문제점
      trainingImprovementPlan: '', // 개선계획
      educationDate: '', // 교육일자
      educationStartTime: '', // 교육시작시간
      educationEndTime: '', // 교육종료시간
      educationTime: [],
      educationLocation: '', // 교육장소
      educationInstructor: '', // 교육강사
      eduTargetCount: null, // 참석대상(명)
      eduAttendanceCount: null, // 참석(명)
      eduAbsenceCount: null, // 미참석(명)
      educationContent: '', // 교육내용
      educationResult: '', // 교육성과
      educationIssue: '', // 교육 문제점
      eduImprovementPlan: '', // 개선계획
      plantCd: '', // 사업장 코드
      managers: [], // 소방안전관리자
      deleteManagers: []
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
const trainingAttachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'FIRE_FIGHTING_TRAINING_PICTURE',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
const editable = ref(true)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

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
  // code setting
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
