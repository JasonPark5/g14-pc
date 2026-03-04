<template>
  <div>
    <q-form ref="editForm">
      <c-card title="교육과정 정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <template v-if="!checkAppr">
              <span
                class="text-negative"
                style="font-size: 0.9em; font-weight: 500; margin-right: 10px"
              >
                {{
                  $language(
                    '※ 연간교육계획에 수립된 교육입니다. 연간교육계획 결재가 승인 된 후 계획완료 기능을 이용하실 수 있습니다.'
                  )
                }}
              </span>
            </template>
            <c-btn
              v-show="editable && param.eduEducationId && !disabled2"
              label="삭제"
              :editable="editable"
              icon="delete_forever"
              @btnClicked="remove"
            />
            <c-btn
              v-if="editable && !disabled"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="educationInfo"
              :mappingType="saveType"
              label="저장"
              icon="save"
              @beforeAction="saveEducation"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-show="editable && param.eduEducationId && !disabled2"
              :showLoading="false"
              icon="check"
              label="완료"
              @btnClicked="planComplete('COMPLETE')"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-4-3">
            <c-task-target
              :required="true"
              label="교육 과정"
              :customPopupParam="{ targetKey: 'eduCourse' }"
              name="eduCourseId"
              v-model:value="educationInfo.eduCourseId"
              @dataChange="eduCourseDataChange"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              :editable="editable"
              :disabled="true"
              type="edit"
              codeGroupCd="EDU_KIND_FST_CD"
              itemText="codeName"
              itemValue="code"
              name="educationKindCdLarge"
              label="교육종류1"
              v-model:value="educationInfo.educationKindCdLarge"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              :disabled="true"
              :editable="editable"
              type="edit"
              codeGroupCd="EDU_KIND_SEC_CD"
              itemText="codeName"
              itemValue="code"
              name="educationKindCdSmall"
              label="교육종류2"
              v-model:value="educationInfo.educationKindCdSmall"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              :disabled="true"
              :editable="editable"
              type="edit"
              codeGroupCd="EDU_CLASS_CD"
              itemText="codeName"
              itemValue="code"
              name="educationTypeCd"
              label="교육구분"
              v-model:value="educationInfo.educationTypeCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
            <c-checkbox
              :disabled="true"
              :isFlag="true"
              :editable="editable"
              type="edit"
              label="법정교육여부"
              name="legalEducationFlag"
              v-model:value="educationInfo.legalEducationFlag"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
            <c-select
              :editable="false"
              type="edit"
              codeGroupCd="EDU_CYCLE_CD"
              itemText="codeName"
              itemValue="code"
              name="educationCycle"
              label="법정교육주기"
              v-model:value="educationInfo.educationCycle"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-multi-select
              :disabled="true"
              :editable="editable"
              :isArray="false"
              codeGroupCd="RELATED_LAWS_CD"
              itemText="codeName"
              itemValue="code"
              label="관련법규"
              name="relationLaws"
              maxValues="3"
              v-model:value="educationInfo.relationLaws"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :disabled="true"
              :editable="editable"
              label="주요 대상자"
              name="mainTargetAudience"
              v-model:value="educationInfo.mainTargetAudience"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
            <c-textarea
              :disabled="true"
              :editable="editable"
              :rows="1"
              label="학습목적"
              name="educationPurpose"
              v-model:value="educationInfo.educationPurpose"
            />
          </div>
        </template>
      </c-card>
      <c-card title="교육계획 기본정보" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              required
              :disabled="disabled"
              :editable="editable"
              label="교육명"
              name="educationName"
              v-model:value="educationInfo.educationName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-dept
              :editable="editable"
              :required="true"
              :disabled="disabled"
              :data="educationInfo"
              label="주관부서"
              name="departmentDeptCd"
              v-model:value="educationInfo.departmentDeptCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
            <!-- true: 기간, false: 일 -->
            <c-checkbox
              :disabled="disabled"
              :editable="editable"
              :isFlag="true"
              label="기간/일"
              :trueLabel="$language('기간')"
              :falseLabel="$language('일')"
              name="educationRangeFlag"
              v-model:value="educationInfo.educationRangeFlag"
              @datachange="datachange"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <!-- 연간교육계획이 결재중인 경우 교육일시 수정 불가 / 교육기간 -->
            <c-datepicker
              v-show="isDate"
              :required="isDate"
              :disabled="disabled || yearEduAppr"
              :editable="editable"
              label="교육기간"
              :range="true"
              type="date"
              name="educationPeriod"
              v-model:value="educationInfo.educationPeriod"
              @datachange="updateEduNamePeriod"
            />
            <c-datepicker
              v-show="!isDate"
              :required="!isDate"
              :disabled="disabled || yearEduAppr"
              :editable="editable"
              label="교육일"
              type="date"
              name="educationDate"
              v-model:value="educationInfo.educationStartDate"
              @datachange="updateEduNameDate"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              required
              :disabled="disabled"
              :editable="editable"
              label="교육시간"
              type="time"
              :range="true"
              :minuteStep="10"
              name="educationTimes"
              v-model:value="educationInfo.educationTimes"
              @datachange="updateTime"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-plant
              :required="true"
              :editable="editable"
              :disabled="disabled"
              type="edit"
              name="plantCd"
              v-model:value="educationInfo.plantCd"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :disabled="disabled"
              :editable="editable"
              label="교육장소"
              name="educationLocation"
              v-model:value="educationInfo.educationLocation"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :suffix="$language('(단위: 원)')"
              type="number"
              :editable="editable"
              :disabled="disabled"
              label="예상교육비"
              name="executionBudget"
              v-model:value="educationInfo.executionBudget"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-task-target
              label="관련 위험성평가"
              :customPopupParam="{ targetKey: 'riskAssessment' }"
              name="ramRiskAssessmentPlanId"
              v-model:value="educationInfo.ramRiskAssessmentPlanId"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              :disabled="disabled"
              :editable="editable"
              type="edit"
              :comboItems="comboItems"
              itemText="codeName"
              itemValue="code"
              itemDisable="disable"
              name="educationMethodCd"
              label="교육방법"
              v-model:value="educationInfo.educationMethodCd"
              @datachange="educationMethodChange"
            >
              <template v-slot:suffixLabel>
                <q-icon name="info" color="orange" style="font-size: 1.4em; margin-left: 10px">
                  <q-tooltip
                    anchor="center right"
                    self="center left"
                    :offset="[10, 10]"
                    content-style="font-size: 0.9em"
                  >
                    {{ $language('동영상 파일 첨부시 동영상 선택 가능') }}
                  </q-tooltip>
                </q-icon>
              </template>
            </c-select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-select
              :disabled="educationInfo.educationMethodCd !== 'EMC999999' || disabled"
              :editable="editable"
              :comboItems="educationVodItems"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="vod"
              label="교육용 동영상"
              v-model:value="educationInfo.vod"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-moc 
            :editable="editable"
            :disabled="disabled"
            :isSubmit="saveCall.saveCallData"
            :document.sync="educationInfo"
            :documentId="param.eduEducationId"
            documentTitle="educationName"
            mocRelatedTaskCd="RT00000010"
            label="MOC번호"
            name="sopMocId"
            v-model:value="educationInfo.sopMocId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :afterIcon="disabled ? null :[
              { name: 'search', click: true, callbackName: 'searchCompliance'},
              { name: 'close', click: true, callbackName: 'removeCompliance' }
            ]"
            :close="false"
            :readonly="true"
            :editable="editable"
            :detail="true"
            label="자체감사"
            name="selfInspectionTitle"
            @searchCompliance="searchCompliance"
            @detailPop="detailCompliance"
            @removeCompliance="removeCompliance"
            v-model:value="educationInfo.selfInspectionTitle">
          </c-text>
        </div> -->
          <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
            <c-checkbox
              :disabled="true"
              :editable="editable"
              :isFlag="true"
              label="문제풀이여부"
              name="eduQuestionFlag"
              v-model:value="educationInfo.eduQuestionFlag"
              @datachange="input"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-task-target
              :disabled="true"
              :required="isQuestion"
              label="문제풀이SET"
              :customPopupParam="{ targetKey: 'eduQuiz' }"
              name="eduQuestionMstId"
              v-model:value="educationInfo.eduQuestionMstId"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
            <c-text
              :disabled="disabled || !isQuestion"
              :required="isQuestion"
              :editable="editable"
              type="number"
              label="통과기준점수"
              name="eduQuestionPassScore"
              v-model:value="educationInfo.eduQuestionPassScore"
            />
          </div>
        </template>
      </c-card>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 attachs">
          <c-upload
            :attachInfo="attachEduPlanInfo"
            :editable="editable && !disabled"
            label="교육계획 관련 파일"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 attachs">
          <c-upload
            :attachInfo="attachEduCourseInfo"
            :editable="false"
            label="교육과정 관련 파일"
            @files="files"
          />
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="table"
            title="교육내용"
            :columns="grid.columns"
            :gridHeight="userGrid.height"
            :data="educationInfo.eduSubjectList"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :hideBottom="true"
            :isFullScreen="false"
            :isExcelDown="false"
            noDataLabel="교육내용이 없습니다."
            :editable="editable && !disabled"
            rowKey="subjectNo"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  label="추가"
                  :showLoading="false"
                  icon="add"
                  @btnClicked="addSubject"
                />
                <c-btn
                  v-if="editable && !disabled && educationInfo.eduSubjectList!.length > 0"
                  label="제외"
                  :showLoading="false"
                  icon="remove"
                  @btnClicked="removeSubject"
                />
              </q-btn-group>
            </template>
            <template
              v-if="educationInfo.eduSubjectList && educationInfo.eduSubjectList.length > 0"
              v-slot:suffixTitle
            >
              <span class="text-negative" style="font-size: 0.8em; font-weight: 300">
                {{ $language('※ 총 교육소요시간 : ') }}
              </span>
              <q-chip
                outline
                square
                color="primary"
                text-color="white"
                class="q-ma-none customchipdept"
              >
                {{ formattedEducationTime }}
              </q-chip>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="userTable"
            title="교육대상자 목록"
            :columns="userGrid.columns"
            :gridHeight="userGrid.height"
            :data="educationInfo.eduAttendeeList"
            :filtering="false"
            :isFullScreen="false"
            :columnSetting="false"
            :usePaging="false"
            :isExcelDown="false"
            :hideBottom="true"
            :editable="editable && !disabled"
            noDataLabel="교육 대상자가 없습니다."
            rowKey="attendeesNo"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  label="현업 추가"
                  icon="add"
                  v-if="editable && !disabled"
                  :showLoading="false"
                  @btnClicked="addInUser"
                />
                <c-btn
                  label="직접 추가"
                  icon="add"
                  v-if="editable && !disabled"
                  :showLoading="false"
                  @btnClicked="addExUser"
                />
                <c-btn
                  v-if="editable && !disabled && educationInfo.eduAttendeeList!.length > 0"
                  label="제외"
                  :showLoading="false"
                  icon="remove"
                  @btnClicked="removeUser"
                />
              </q-btn-group>
            </template>
            <template v-slot:suffixTitle>
              <span class="text-negative" style="font-size: 0.8em; font-weight: 300">
                {{ $language('※ 교육대상자 등록은 필수입니다.') }}
              </span>
            </template>

            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'attendeesDeptName'">
                <c-text-column
                  v-if="props.row['inExTypeCd'] === 'EX'"
                  :editable="editable"
                  :props="props"
                  :col="col"
                  :disabled="disabled"
                  v-model:value="props.row['attendeesDeptName']"
                  @datachange="attendeeDatachange(props.row)"
                />
                <span v-else>
                  {{ props.row['attendeesDeptName'] }}
                </span>
              </template>
              <template v-if="col.name === 'attendeesPositionName'">
                <c-text-column
                  v-if="props.row['inExTypeCd'] === 'EX'"
                  :editable="editable"
                  :props="props"
                  :col="col"
                  :disabled="disabled"
                  v-model:value="props.row['attendeesPositionName']"
                  @datachange="attendeeDatachange(props.row)"
                />
                <span v-else>
                  {{ props.row['attendeesPositionName'] }}
                </span>
              </template>
              <template v-if="col.name === 'attendeesName'">
                <c-text-column
                  v-if="props.row['inExTypeCd'] === 'EX'"
                  :editable="editable"
                  :props="props"
                  :col="col"
                  :disabled="disabled"
                  v-model:value="props.row['attendeesName']"
                  @datachange="attendeeDatachange(props.row)"
                />
                <span v-else>
                  {{ props.row['attendeesName'] }}
                </span>
              </template>
            </template>
          </c-table>
        </div>
      </div>
      <c-dialog :param="popupOptions" />
    </q-form>
  </div>
</template>
<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { eduResultType, eduSaveCallType } from './eduResult'

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
  name: 'educationPlanInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user, auths } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setData', 'emitStep', 'setData'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: eduPlanPopupParamType
  educationInfo: eduResultType
  saveCall: eduSaveCallType
}
interface eduPlanPopupParamType {
  eduEducationId: stringNull
  planUpdateBtnData: planUpdateBtnDataType
}
interface planUpdateBtnDataType {
  title: stringNull
  flag: boolean
  research: stringNull
  planResearch: stringNull
}
interface gridEduContentType {
  columns: tableColumnType
  height: stringNull
}
interface gridEduAttendeeType {
  columns: tableColumnType
  height: stringNull
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
      eduEducationId: '',
      eduPlanTime: [],
      planUpdateBtnData: {
        title: '계획',
        flag: false,
        research: '',
        planResearch: ''
      }
    }
  },
  educationInfo: () => {
    return {
      eduEducationId: '',
      eduEducationYearPlanId: '',
      educationName: '',
      eduCourseId: '',
      plantCd: '',
      educationYear: '',
      educationCourseName: '',
      educationKindCdLarge: null,
      educationKindCdSmall: null,
      educationTypeCd: null,
      departmentDeptCd: '',
      legalEducationFlag: null,
      sumEducationTime: '',
      educationCycle: null,
      educationPurpose: '',
      relationLaws: '',
      mainTargetAudience: '',
      educationMonth: null,
      educationLocation: '',
      estimatedEducationExpenses: '',
      executionBudget: '',
      educationStartDate: '',
      educationEndDate: '',
      educationStartTime: '',
      educationEndTime: '',
      instructorInformation: '',
      sopMocId: '',
      educationMethodCd: null,
      educationOverview: '',
      evaluationEvalCd: '',
      documentStatusCd: '',
      qrCodeRoute: '',
      checkAppr: '',
      // 위험성평가 결과 항목 추가
      ramRiskAssessmentPlanId: '',
      assessmentName: '',
      ramTechniqueCd: null,
      ramStepCd: '',

      // 자체감사 항목 추가
      selfInspectionResultId: '',
      selfInspectionStatusCd: '',
      sysRevision: '',
      selfInspectionTitle: '',

      eduQuestionFlag: 'N',
      eduQuestionMstId: '',
      eduQuestionPassScore: null,
      regUserId: '',
      chgUserId: '',
      vod: null,
      educationPeriod: [],
      eduSubjectList: [], // 과정별 교육과목
      delEduSubjectList: [],
      eduAttendeeList: [], // 대상자
      delEduAttendeeList: [],

      eduPlanTime: []
    }
  },
  saveCall: () => {
    return {
      saveCallData: ''
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridEduContentType>({
  columns: [
    {
      name: 'subjectName',
      field: 'subjectName',
      label: '과목 및 세부내용',
      align: 'left',
      // style: 'width:50%',
      type: 'text',
      sortable: false
    },
    // {
    //   name: 'subjectDetailName',
    //   field: 'subjectDetailName',
    //   label: '세부내용',
    //   style: 'width:100px',
    //   align: 'left',
    //   type: 'text',
    //   sortable: false,
    // },
    {
      name: 'educationTime',
      field: 'educationTime',
      label: '교육시간',
      type: 'datetime',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'instructorName',
      field: 'instructorName',
      type: 'text',
      label: '강사명',
      style: 'width:120px',
      align: 'left',
      sortable: false
    }
  ],
  height: '200px'
})
const userGrid = ref<gridEduAttendeeType>({
  columns: [
    {
      required: true,
      name: 'attendeesName',
      field: 'attendeesName',
      label: '대상자',
      // style: 'width:25%',
      align: 'center',
      sortable: false,
      type: 'custom'
    },
    {
      required: true,
      name: 'attendeesDeptName',
      field: 'attendeesDeptName',
      style: 'width:25%',
      label: '소속/부서',
      align: 'center',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'attendeesPositionName',
      field: 'attendeesPositionName',
      style: 'width:25%',
      label: '직책',
      align: 'center',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'seniorityName',
      field: 'seniorityName',
      style: 'width:25%',
      label: '선임명',
      align: 'center',
      sortable: false
    }
  ],
  height: '400px'
})
const educationVodItems = ref<any>([])
const saveUrl = ref('')
const saveType = ref('POST')
const isSave = ref(false)
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const eduCourseUrl = ref('')
const attachEduPlanInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'EDU_PLAN',
  taskKey: ''
})
const attachEduCourseInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'EDU_CURRICULUM',
  taskKey: ''
})
// const eduPlanTime = ref<arrayString>([])
const comboItems = ref<codeMasterType>([])
const editForm = ref<any>(null)
const table = ref<any>(null)
const userTable = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const checkAppr = computed(() =>
  props.educationInfo.eduEducationYearPlanId ? props.educationInfo.checkAppr === 'ASC9999999' : true
)
// const flagCondition = computed(() => props.educationInfo.documentStatusCd === 'ESC000001')
// const btnEditable = computed(
//   () =>
//     editable.value &&
//     props.educationInfo.documentStatusCd === 'ESC000005' &&
//     Boolean(props.educationInfo.eduEducationId)
// )
const disabled = computed(() => {
  if (isEnvSafDept.value) {
    return false
  } else {
    return disabled2.value
  }
})
const disabled2 = computed(
  () =>
    Boolean(props.educationInfo.documentStatusCd) &&
    props.educationInfo.documentStatusCd !== 'ESC000001' &&
    !props.param.planUpdateBtnData.flag
)
const isEnvSafDept = computed(
  () => _.indexOf(auths.value, 'SAGI000021') > -1 || user.value.empNo === 'admin'
)
const yearEduAppr = computed(() => props.educationInfo.checkAppr === 'ASC0000001')
const isDate = computed(() => props.educationInfo.educationRangeFlag === 'Y')
const isQuestion = computed(() => props.educationInfo.eduQuestionFlag === 'Y')
const formattedEducationTime = computed(() => {
  let totalMinutes = 0
  props.educationInfo.eduSubjectList!.forEach((item) => {
    if (item.educationTime) {
      const [hours, minutes] = item.educationTime.split(':').map((part: any) => parseInt(part, 10))
      totalMinutes += hours * 60 + minutes
    }
  })
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60
  // 계산된 총 시간을 표시, 앞에 '0'을 붙여 두 자리 숫자로 표시
  const formattedHours = totalHours.toString().padStart(2, '0')
  const formattedMinutes = remainingMinutes.toString().padStart(2, '0')
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  props.educationInfo.sumEducationTime = `${formattedHours}:${formattedMinutes}`
  return props.educationInfo.sumEducationTime // 계산된 총 시간을 반환
})
// const isOld = computed(() => Boolean(props.param.eduEducationId))

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.eduEducationId,
  () => {
    setTaskKey()
  }
)
watch(
  () => props.educationInfo.eduCourseId,
  () => {
    setTaskKey2()
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
  saveUrl.value = transactionConfig.sop.edu.plan.insert.url
  insertUrl.value = transactionConfig.sop.edu.plan.insert.url
  updateUrl.value = transactionConfig.sop.edu.plan.update.url
  deleteUrl.value = transactionConfig.sop.edu.plan.delete.url
  completeUrl.value = transactionConfig.sop.edu.annual.complete.url
  eduCourseUrl.value = selectConfig.sop.edu.course.get.url
  // code setting
  getComboItems('EDU_METHOD_CD').then((_result: any) => {
    _.forEach(_result, (_item: codeMasterType) => {
      if (_item.attrVal1 == 'Y') _item.disable = true
      else _item.disable = false
    })
    comboItems.value = _result
  })
  // list setting
  setTaskKey()
  setTaskKey2()
}
/******************************
 * TODO (목적): 교육일 세팅
 *******************************/
function updateEduNameDate() {
  props.educationInfo.educationName =
    props.educationInfo.educationName.split(' | ')[0] +
    ' | ' +
    props.educationInfo.educationStartDate

  props.educationInfo.educationEndDate = props.educationInfo.educationStartDate
}
/******************************
 * TODO (목적): 교육기간 세팅
 *******************************/
function updateEduNamePeriod() {
  props.educationInfo.educationName =
    props.educationInfo.educationName.split(' | ')[0] +
    ' | ' +
    props.educationInfo.educationPeriod[0]
  if (props.educationInfo.educationPeriod && props.educationInfo.educationPeriod.length > 0) {
    props.educationInfo.educationStartDate = props.educationInfo.educationPeriod[0]
    props.educationInfo.educationEndDate = props.educationInfo.educationPeriod[1]
  } else {
    props.educationInfo.educationStartDate = null
    props.educationInfo.educationEndDate = null
  }
}
/******************************
 * TODO (목적): 교육시간 세팅
 *******************************/
function updateTime() {
  if (props.educationInfo.educationTimes && props.educationInfo.educationTimes.length > 0) {
    props.educationInfo.educationStartTime = props.educationInfo.educationTimes[0]
    props.educationInfo.educationEndTime = props.educationInfo.educationTimes[1]
  } else {
    props.educationInfo.educationStartTime = null
    props.educationInfo.educationEndTime = null
  }
}
/******************************
 * TODO (목적): 교육방법 datachange
 *******************************/
function educationMethodChange() {
  if (props.educationInfo.educationMethodCd !== 'EMC999999') {
    props.educationInfo.vod = null
  }
}
/******************************
 * TODO (목적): 교육과정 관련 파일 조회
 *******************************/
function files(fileList: any) {
  educationVodItems.value = []
  let hasMP4 = false // MP4 파일이 존재하는지 여부를 나타내는 플래그

  _.forEach(fileList, (_item) => {
    if (_item.contentType === 'video/mp4') {
      educationVodItems.value.push({
        code: _item.sysAttachFileId,
        codeName: _item.oriFileNm
      })
      hasMP4 = true // MP4 파일이 있으면 플래그를 true로 설정
    }
  })

  if (hasMP4) {
    // MP4 파일이 있는 경우 모든 comboItems를 활성화
    _.forEach(comboItems.value, (_item) => {
      _item.disable = false
    })
  } else {
    // MP4 파일이 없는 경우 특정 조건에 따라 comboItems 활성화/비활성화
    _.forEach(comboItems.value, (_item) => {
      _item.disable = _item.attrVal1 === 'Y'
    })
  }
}
/******************************
 * TODO (목적): 교육 저장
 *******************************/
function saveEducation() {
  if (props.param.eduEducationId) {
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(userGrid.value.columns, props.educationInfo.eduAttendeeList!)) {
      let validPass = true
      if (props.educationInfo.eduSubjectList && props.educationInfo.eduSubjectList.length > 0) {
        validPass = validTable(grid.value.columns, props.educationInfo.eduSubjectList)
      }
      if (validPass) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            if (props.param.eduEducationId) {
              props.educationInfo.chgUserId = user.value.userId
            } else {
              props.educationInfo.regUserId = user.value.userId
            }

            _.forEach(props.educationInfo.eduSubjectList, (_item) => {
              if (props.param.eduEducationId) _item.chgUserId = user.value.userId
              else _item.regUserId = user.value.userId
            })
            _.forEach(props.educationInfo.eduAttendeeList, (_item) => {
              if (props.param.eduEducationId) _item.chgUserId = user.value.userId
              else _item.regUserId = user.value.userId
            })
            isSave.value = !isSave.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 교육 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.param.eduEducationId = result.data
  props.saveCall.saveCallData = uid()
  emits('setData', result.data)
}
/******************************
 * TODO (목적): 교육 과목 추가
 *******************************/
function addSubject() {
  props.educationInfo.eduSubjectList!.splice(0, 0, {
    eduEducationId: props.param.eduEducationId,
    subjectNo: uid(),
    subjectName: '', // 교육명
    // subjectDetailName: '', // 세부내용
    educationTime: '01:00', // 교육시간
    instructorName: '', // 강사명
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 교육 과목 삭제
 *******************************/
function removeSubject() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.educationInfo.delEduSubjectList) {
      props.educationInfo.delEduSubjectList = []
    }
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(props.educationInfo.delEduSubjectList, { subjectNo: item.subjectNo }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.educationInfo.delEduSubjectList!.push(item)
      }
      props.educationInfo.eduSubjectList = _.reject(props.educationInfo.eduSubjectList, item)
    })
  }
}
/******************************
 * TODO (목적): 교육 과정 datachange
 *******************************/
function eduCourseDataChange(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data) {
    $http({
      url: $format(eduCourseUrl.value, data),
      method: 'GET'
    }).then((_result: any) => {
      _.forEach(props.educationInfo.eduSubjectList, (item) => {
        if (!props.educationInfo.delEduSubjectList) {
          props.educationInfo.delEduSubjectList = []
        }
        if (
          _.findIndex(props.educationInfo.delEduSubjectList!, {
            subjectNo: item.subjectNo
          }) === -1 &&
          item.editFlag !== 'C'
        ) {
          props.educationInfo.delEduSubjectList!.push(item)
        }
        props.educationInfo.eduSubjectList = _.reject(props.educationInfo.eduSubjectList, item)
      })
      // 빈값들 filter
      ;(props.educationInfo.educationCourseName = _result.data.educationCourseName), // 교육과정명
        // 교육과정 마스터 데이터
        (props.educationInfo.eduCourseId = _result.data.eduCourseId), // 교육과정 key
        (props.educationInfo.educationCycle = _result.data.educationCycle), // 교육주기
        (props.educationInfo.educationKindCdLarge = _result.data.educationKindCdLarge), // 교육종류 대
        (props.educationInfo.educationKindCdSmall = _result.data.educationKindCdSmall), // 교육종류 소
        (props.educationInfo.educationTypeCd = _result.data.educationTypeCd) // 교육구분
      ;(props.educationInfo.educationPurpose = _result.data.educationPurpose), // 학습목적
        (props.educationInfo.legalEducationFlag = _result.data.legalEducationFlag), // 법정여부
        (props.educationInfo.mainTargetAudience = _result.data.mainTargetAudience), // 주요대상자
        (props.educationInfo.relationLaws = _result.data.relationLaws), // 관련법규
        (props.educationInfo.executionBudget = _result.data.estimatedEducationExpenses) // 예산
      props.educationInfo.eduQuestionFlag = _result.data.eduQuestionFlag
      props.educationInfo.eduQuestionMstId = _result.data.eduQuestionMstId
      props.educationInfo.eduQuestionPassScore = _result.data.eduQuestionPassScore
      props.educationInfo.educationLocation = _result.data.educationLocation
      props.educationInfo.educationMethodCd = _result.data.educationMethodCd
      props.educationInfo.vod = _result.data.vod
      props.educationInfo.sumEducationTime = _result.data.sumEducationTime // 교육시간
      props.educationInfo.educationName = _result.data.educationCourseName

      if (!props.educationInfo.delEduSubjectList) {
        props.educationInfo.delEduSubjectList = []
      }
      _.forEach(props.educationInfo.eduSubjectList, (item) => {
        if (
          _.findIndex(props.educationInfo.delEduSubjectList, {
            subjectNo: item.subjectNo
          }) === -1 &&
          item.editFlag !== 'C'
        ) {
          props.educationInfo.delEduSubjectList!.push(item)
        }
        props.educationInfo.eduSubjectList = _.reject(props.educationInfo.eduSubjectList, item)
      })
      props.educationInfo.eduSubjectList = []
      if (_result.data.eduCourseSubjectList && _result.data.eduCourseSubjectList.length > 0) {
        _.forEach(_result.data.eduCourseSubjectList, (_item) => {
          const index = _.findIndex(props.educationInfo.eduSubjectList, {
            subjectNo: _item.subjectNo
          })
          if (index === -1) {
            props.educationInfo.eduSubjectList!.push({
              eduEducationId: props.educationInfo.eduEducationId,
              subjectNo: _item.subjecNo,
              subjectName: _item.subjectName, // 교육명
              educationTime: _item.educationTime, // 교육시간
              instructorName: _item.instructorName,
              regUserId: user.value.userId,
              editFlag: 'C'
            })
          }
        })
      }

      if (!props.educationInfo.delEduAttendeeList) {
        props.educationInfo.delEduAttendeeList = []
      }
      _.forEach(props.educationInfo.eduAttendeeList, (item) => {
        if (
          _.findIndex(props.educationInfo.delEduAttendeeList, {
            attendeesId: item.attendeesId
          }) === -1 &&
          item.editFlag !== 'C'
        ) {
          props.educationInfo.delEduAttendeeList!.push(item)
        }
        props.educationInfo.eduAttendeeList = _.reject(props.educationInfo.eduAttendeeList, item)
      })
      props.educationInfo.eduAttendeeList = []
      if (_result.data.totalUserList && _result.data.totalUserList.length > 0) {
        _.forEach(_result.data.totalUserList, (_item) => {
          const index = _.findIndex(props.educationInfo.eduAttendeeList, {
            attendeesId: _item.userId
          })
          if (index === -1) {
            props.educationInfo.eduAttendeeList!.push({
              eduEducationId: props.educationInfo.eduEducationId,
              attendeesNo: uid(),
              attendeesId: _item.userId,
              attendeesTypeCd: 'EATC00003',
              inExTypeCd: 'COURSE',
              attendeesPositionName: _item.jobName,
              attendanceTime: props.educationInfo.sumEducationTime,
              attendeesDeptName: _item.deptName,
              seniorityName: _item.seniorityName,
              enterDate: _item.enterDate,
              attendeesName: _item.userName,
              regUserId: user.value.userId,
              editFlag: 'C'
            })
          }
        })
      }
    })
  } else {
    ;(props.educationInfo.eduCourseId = ''),
      (props.educationInfo.educationCourseName = ''),
      (props.educationInfo.educationName = ''),
      (props.educationInfo.educationKindCdLarge = null),
      (props.educationInfo.educationKindCdSmall = null),
      (props.educationInfo.educationTypeCd = null),
      (props.educationInfo.educationPurpose = null),
      (props.educationInfo.legalEducationFlag = null),
      (props.educationInfo.relationLaws = null),
      (props.educationInfo.mainTargetAudience = ''),
      (props.educationInfo.executionBudget = ''),
      (props.educationInfo.educationMethodCd = null),
      (props.educationInfo.selfInspectionTitle = ''),
      (props.educationInfo.eduQuestionFlag = 'N'),
      (props.educationInfo.eduQuestionMstId = ''),
      (props.educationInfo.eduQuestionPassScore = null),
      (props.educationInfo.regUserId = ''),
      (props.educationInfo.chgUserId = ''),
      (props.educationInfo.vod = null),
      (props.educationInfo.eduSubjectList = []), // 과정별 교육과목
      (props.educationInfo.delEduSubjectList = []),
      (props.educationInfo.eduAttendeeList = []), // 대상자
      (props.educationInfo.delEduAttendeeList = [])
  }
}
// function searchCompliance() {
//   // popupOptions.value.width = '90%'
//   // popupOptions.value.isFull = false
//   popupOptions.value = getPopupOptions('compliance', popupOptions.value, closeCompliancePopup, {
//     type: 'single'
//   })
// }
// function closeCompliancePopup(data: any) {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   if (data && data.length > 0) {
//     props.educationInfo.selfInspectionResultId = data[0].selfInspectionResultId
//     props.educationInfo.selfInspectionTitle = data[0].selfInspectionTitle
//     props.educationInfo.selfInspectionStatusCd = data[0].selfInspectionStatusCd
//     props.educationInfo.sysRevision = data[0].sysRevision
//   }
// }
// function detailCompliance() {
//   if (!props.educationInfo.selfInspectionResultId) return

//   popupOptions.value.title = '자체감사 상세'
//   popupOptions.value.target = () => import(`${'@views/sop/pca/complianceDetail.vue'}`)
//   popupOptions.value.param = {
//     selfInspectionResultId: props.educationInfo.selfInspectionResultId,
//     selfInspectionStatusCd: props.educationInfo.selfInspectionStatusCd,
//     sysRevision: props.educationInfo.sysRevision
//   }
//   popupOptions.value.width = '90%'
//   popupOptions.value.isFull = true
//   popupOptions.value.visible = true
//   popupOptions.value.closeCallback = closeLinkPopup
// }
// function removeCompliance() {
//   props.educationInfo.selfInspectionResultId = ''
//   props.educationInfo.selfInspectionTitle = ''
//   props.educationInfo.selfInspectionStatusCd = ''
//   props.educationInfo.sysRevision = ''
// }
/******************************
 * TODO (목적): 교육 기간 datachange
 *******************************/
function datachange() {
  props.educationInfo.educationStartDate = ''
  props.educationInfo.educationEndDate = ''
}
/******************************
 * TODO (목적): 교육 내부 사용자 추가
 *******************************/
function addInUser() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeInUser, {
    type: 'multiple',
    plantCd: props.educationInfo.plantCd
  })
}
function closeInUser(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(props.educationInfo.eduAttendeeList, {
        attendeesName: _item.userName
      })
      if (index === -1) {
        props.educationInfo.eduAttendeeList!.push({
          eduEducationId: props.param.eduEducationId,
          attendeesId: _item.userId,
          attendeesNo: uid(),
          attendeesTypeCd: 'EATC00003',
          attendeesDeptName: _item.deptName,
          attendeesPositionName: _item.jobName,
          attendeesName: _item.userName,
          inExTypeCd: 'IN',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 교육 대상자 삭제
 *******************************/
function removeUser() {
  const selectData = userTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.', //
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.educationInfo.delEduAttendeeList) props.educationInfo.delEduAttendeeList = []
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(props.educationInfo.delEduAttendeeList, {
          attendeesName: item.attendeesName
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.educationInfo.delEduAttendeeList!.push(item)
      }
      props.educationInfo.eduAttendeeList = _.reject(props.educationInfo.eduAttendeeList, item)
    })
  }
}
/******************************
 * TODO (목적): 교육 외부 대상자 추가
 *******************************/
function addExUser() {
  // 참석자 직접추가
  props.educationInfo.eduAttendeeList!.splice(0, 0, {
    eduEducationId: props.educationInfo.eduEducationId,
    attendeesNo: uid(),
    attendeesDeptName: '',
    attendeesPositionName: '',
    attendeesName: '',
    inExTypeCd: 'EX',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 교육 풀이 점수
 *******************************/
function input(value: string) {
  if (value === 'Y') props.educationInfo.eduQuestionPassScore = 80
  else props.educationInfo.eduQuestionPassScore = null
}
/******************************
 * TODO (목적): 교육 계획 완료
 *******************************/
function planComplete(type: string) {
  let content = ''
  if (type === 'COMPLETE') content = '계획완료하시겠습니까? (저장과 함께 처리됩니다.)'
  else content = '결재하시겠습니까? (저장과 함께 처리됩니다.)'
  const flag = false
  if (!flag) {
    message.confirm({
      title: '확인',
      message: content,
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        props.educationInfo.regUserId = user.value.userId
        props.educationInfo.chgUserId = user.value.userId
        props.educationInfo.documentStatusCd = 'ESC000005'
        $http({
          url: completeUrl.value,
          method: 'PUT',
          data: props.educationInfo
        }).then(() => {
          message.requestSuccess()

          if (props.educationInfo.documentStatusCd === 'ESC000005') {
            emits('emitStep', {
              name: 'currentStep',
              param: {
                step: 'ESC0000010', // 교육결과로 이동
                key: props.param.eduEducationId // key
              }
            })
          }
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 교육 계획 삭제
 *******************************/
/* eslint-disable no-unused-vars */
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.eduEducationId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('emitStep', {
          name: 'closePopup',
          param: {}
        })
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 교육 계획 관련 파일 key 변경
 *******************************/
function setTaskKey() {
  const taskKey = props.param.eduEducationId ? props.param.eduEducationId : ''
  attachEduPlanInfo.value.valuetaskKey = taskKey
}
/******************************
 * TODO (목적): 교육 과정 관련 파일 key 변경
 *******************************/
function setTaskKey2() {
  const taskKey = props.educationInfo.eduCourseId ? props.educationInfo.eduCourseId : ''
  attachEduCourseInfo.value.taskKey = taskKey
}
/******************************
 * TODO (목적): 교육 대상자 datachange
 *******************************/
function attendeeDatachange(row: any) {
  if (row.editFlag !== 'C') {
    row.editFlag === 'U'
    row.chgUserId = user.value.userId
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style>
.canvas {
  width: 100%;
  height: 100%;
  margin: 3 auto;
  display: inline;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  height: 400px;
  box-sizing: border-box;
  border-color: #aaa;
}
.facilityStyle {
  height: 200px;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.abc {
  width: 100%;
  height: 20px;
  display: inline;
}
</style>
<style lang="sass">
.attachs
  .upload-cover
    margin-top: -5px !important
    .custom-upload, .uploaded-file-list
      min-height: 200px !important
      max-height: 200px !important
      .fileuploadItem
        height: auto !important
</style>
