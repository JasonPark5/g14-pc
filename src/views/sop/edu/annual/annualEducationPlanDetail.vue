<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group v-show="!resultFlag && !apprFlag" outline>
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="grid.data"
              mappingType="POST"
              label="저장"
              icon="save"
              @beforeAction="saveEducation"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-plant
              :required="true"
              :disabled="popupParam.disabled || resultFlag"
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="eduInfo.plantCd"
              @datachange="yearChange"
            />
          </div> -->
          <div class="col-xs-4 col-sm-4 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              :required="true"
              :editable="editable"
              :disabled="popupParam.disabled || resultFlag"
              label="교육년도"
              type="year"
              name="educationYear"
              v-model:value="eduInfo.educationYear"
              @datachange="yearChange"
            />
          </div>
          <div
            v-if="popupParam.educationMonth"
            class="col-xs-4 col-sm-4 col-md-3 col-lg-3 col-xl-3"
          >
            <c-text
              :editable="editable"
              :disabled="true"
              label="조회월"
              name="educationMonth"
              v-model:value="popupParam.educationMonth"
            />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="연간교육계획 목록"
        :columns="grid.columns"
        :gridHeight="gridHeight"
        :data="grid.data"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :hideBottom="true"
        :isExcelDown="false"
        :editable="editable && !resultFlag && !apprFlag"
        :noDataLabel="$language('연간교육계획을 할 교육과정을 추가하세요.')"
        selection="multiple"
        cardClass="topcolor-orange"
        rowKey="eduEducationId"
        @innerBtnClicked="innerBtnClicked"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !popupParam.disabled && !resultFlag && !apprFlag"
              :showLoading="false"
              label="교육과정추가"
              icon="add"
              @btnClicked="addSelect"
            />
            <c-btn
              v-if="editable && popupParam.disabled && !resultFlag && !apprFlag"
              :showLoading="false"
              label="추가"
              icon="add"
              @btnClicked="addRow"
            />
            <c-btn
              v-if="editable && grid.data.length > 0 && !resultFlag && !apprFlag"
              :showLoading="false"
              label="삭제"
              icon="remove"
              @btnClicked="removeRow"
            />
          </q-btn-group>
        </template>
        <template v-slot:suffixTitle>
          <span
            v-if="yearEdu.sysApprovalRequestId"
            class="text-negative"
            style="font-size: 0.8em; font-weight: 300"
          >
            <!-- {{eduInfo.educationYear}}년 {{yearEdu.plantName}} 연간교육계획은 현재 <b>{{yearEdu.approvalStatusName}}</b> 상태입니다. -->
            {{ suffixLabel }}
          </span>
        </template>
      </c-table>
    </div>
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
import { annualEduPlanType } from './annualEduPlan'
import { eduResultType } from '../result/eduResult'
import { eduCourseType } from '../cc/eduCourse'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'annualEducationPlanDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  popupParam: annualEduDetailPopupParamType
  contentHeight: stringNull | numberNull
}
interface annualEduDetailPopupParamType {
  eduEducationId: stringNull
  disabled: boolean
  educationYear: stringNull
  eduCourseId: stringNull
  educationMonth: stringNull
  plantCd: stringNull
  stepFlag: stringNull
  approvalStatusCd: stringNull
}
interface eduInfoType {
  plantCd: stringNull
  educationYear: stringNull
}
interface standardInfoType {
  eduCourseId: stringNull // 교육과정 key
  educationCourseName?: stringNull // 교육과정명
  educationTypeCd?: stringNull // 교육구분
  eduEducationId?: stringNull
  educationMonth?: stringNull
  educationLocation?: stringNull
  educationMethodCd?: stringNull
  educationName?: stringNull

  // 교육과정 마스터 데이터
  educationCycle?: stringNull // 교육주기
  educationKindCdLarge?: stringNull // 교육종류 대
  educationKindCdSmall?: stringNull // 교육종류 소
  educationPurpose?: stringNull // 학습목적
  legalEducationFlag?: stringNull // 법정여부
  mainTargetAudience?: stringNull // 주요대상자
  relationLaws?: stringNull // 관련법규
  sumEducationTime?: stringNull // 교육시간
  estimatedEducationExpenses?: stringNull
  editFlag?: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<eduResultType>
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
  popupParam: () => {
    return {
      eduEducationId: '',
      disabled: false,
      educationYear: '',
      eduCourseId: '',
      educationMonth: '',
      plantCd: '',
      stepFlag: '',
      approvalStatusCd: ''
    }
  },
  contentHeight: ''
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
const eduInfo = ref<eduInfoType>({
  plantCd: null,
  educationYear: ''
})
const standardInfo = ref<standardInfoType>({
  eduCourseId: '', // 교육과정 key
  educationCourseName: '', // 교육과정명
  educationTypeCd: '', // 교육구분
  eduEducationId: '',
  educationMonth: '',
  educationLocation: '',
  educationMethodCd: '',
  educationName: '',

  // 교육과정 마스터 데이터
  educationCycle: '', // 교육주기
  educationKindCdLarge: '', // 교육종류 대
  educationKindCdSmall: '', // 교육종류 소
  educationPurpose: '', // 학습목적
  legalEducationFlag: '', // 법정여부
  mainTargetAudience: '', // 주요대상자
  relationLaws: '', // 관련법규
  sumEducationTime: '', // 교육시간
  estimatedEducationExpenses: ''
})
const yearEdu = ref<annualEduPlanType>({
  eduEducationYearPlanId: '', // 연간교육 일련번호
  plantCd: '', // 사업장 코드
  plantName: '', // 사업장
  educationYear: '', // 교육년도
  sysApprovalRequestId: '', // 결재요청번호
  approvalStatusCd: '', // 결재관련 결재상태
  approvalStatusName: ''
})
const grid = ref<gridType>({
  columns: [],
  data: []
})
const yearEduDetailUrl = ref('')
const yearListUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const suffixLabel = ref('')
const table = ref<any>('')

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => String(Number(window.innerHeight) - 300) + 'px')
const resultFlag = computed(() => props.popupParam.stepFlag === 'Y')
const apprFlag = computed(
  () =>
    props.popupParam.approvalStatusCd === 'ASC0000001' ||
    yearEdu.value.approvalStatusCd === 'ASC0000001'
)

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
  saveUrl.value = transactionConfig.sop.edu.annual.save.url
  deleteUrl.value = transactionConfig.sop.edu.annual.delete.url
  yearEduDetailUrl.value = selectConfig.sop.edu.yearEdu.get.url
  yearListUrl.value = selectConfig.sop.edu.annual.get.url
  // code setting
  if (props.popupParam.eduCourseId) {
    eduInfo.value.plantCd = props.popupParam.plantCd
    eduInfo.value.educationYear = props.popupParam.educationYear
  }
  // list setting
  getList()
  setHeader()
}

/******************************
 * TODO (목적): 테이블 컬럼 헤더 세팅
 *******************************/
function setHeader() {
  getComboItems('EDU_CLASS_CD').then((_classResult) => {
    getComboItems('EDU_METHOD_CD').then((_classMethod) => {
      grid.value.columns = [
        {
          name: 'educationCourseName',
          field: 'educationCourseName',
          required: true,
          innerBtn: true,
          btns: [{ label: '', icon: 'add', color: 'orange', tooltip: '교육계획 추가' }],
          label: '교육과정',
          align: 'center',
          style: 'width:120px',
          sortable: false
          // rowspan: 5,
        },
        {
          name: 'educationName',
          field: 'educationName',
          required: true,
          label: '교육명',
          align: 'left',
          type: 'text',
          style: 'width:200px',
          sortable: false
          // rowspan: 5,
        },
        {
          name: 'educationTypeCd',
          field: 'educationTypeCd',
          setHeader: true,
          required: true,
          label: '교육구분',
          align: 'center',
          style: 'width:100px',
          type: 'select',
          comboItems: _classResult,
          sortable: false
        },
        {
          name: 'mainTargetAudience',
          field: 'mainTargetAudience',
          label: '주요 대상자',
          type: 'text',
          style: 'width:150px',
          align: 'left',
          sortable: false
        },
        {
          name: 'educationDate',
          field: 'educationDate',
          required: true,
          label: '교육기간',
          range: true,
          minuteStep: 10,
          type: 'date',
          style: 'width:150px',
          align: 'left',
          sortable: false
        },
        {
          name: 'educationMethodCd',
          field: 'educationMethodCd',
          setHeader: true,
          required: true,
          label: '교육방법',
          align: 'center',
          style: 'width:100px',
          type: 'select',
          comboItems: _classMethod,
          sortable: false
        },
        {
          name: 'educationLocation',
          field: 'educationLocation',
          required: true,
          label: '교육장소',
          type: 'text',
          style: 'width:100px',
          align: 'left',
          sortable: false
        }
      ]
    })
  })
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getList() {
  if (eduInfo.value.plantCd && eduInfo.value.educationYear) {
    getYearEdu()
    $http({
      url: yearListUrl.value,
      method: 'GET',
      params: {
        plantCd: eduInfo.value.plantCd,
        eduCourseId: props.popupParam.eduCourseId,
        educationMonth: props.popupParam.educationMonth,
        stepFlag: props.popupParam.stepFlag,
        educationYear: eduInfo.value.educationYear
      }
    }).then((_result: any) => {
      grid.value.data = _result.data
      _.forEach(grid.value.data, (_item) => {
        _item.educationDate = [_item.educationStartDate, _item.educationEndDate]
      })
    })
  } else {
    grid.value.data = []
    yearEdu.value = {
      eduEducationYearPlanId: '', // 연간교육 일련번호
      plantCd: '', // 사업장 코드
      plantName: '', // 사업장
      educationYear: '', // 교육년도
      sysApprovalRequestId: '', // 결재요청번호
      approvalStatusCd: '', // 결재관련 결재상태
      approvalStatusName: ''
    }
  }
  if (props.popupParam.eduCourseId) {
    $http({
      url: $format(selectConfig.sop.edu.course.get.url, props.popupParam.eduCourseId),
      method: 'GET'
    }).then((_result: any) => {
      standardInfo.value = _.clone(_result.data)
    })
  } else {
    standardInfo.value = {
      eduCourseId: ''
    }
  }
}
/******************************
 * TODO (목적): 연간교육계획 결재 조회
 *******************************/
function getYearEdu() {
  // 전체조회
  $http({
    url: $format(yearEduDetailUrl.value, eduInfo.value.plantCd, eduInfo.value.educationYear),
    method: 'GET'
  }).then((_result: any) => {
    yearEdu.value = _result.data
    // -- {{eduInfo.educationYear}}년 {{yearEdu.plantName}} 연간교육계획은 현재 <b>{{yearEdu.approvalStatusName}}</b> 상태입니다.
    suffixLabel.value =
      $language('연간교육계획은 결재진행상태입니다.') + '[' + yearEdu.value.approvalStatusName + ']'
  })
}
/******************************
 * TODO (목적): 년도 emit
 *******************************/
function yearChange() {
  /**
   * 2022-05-12 kdh
   * 연간 교육계획 결재를 진행함으로 인해 계속적으로 교육 데이터가 들어가지 않도록 조치
   *
   *  1. props.popupParam.educationMonth, props.popupParam.stepFlag의 값을 null처리
   *  2. 교육 데이터 조회
   *  3. 연간 교육계획 데이터 조회
   */
  props.popupParam.educationMonth = null
  props.popupParam.stepFlag = ''
  getList()
}
/******************************
 * TODO (목적): 교육과정 추가
 *******************************/
function addSelect() {
  popupOptions.value.width = '80%'
  popupOptions.value = getPopupOptions('eduCourse', popupOptions.value, closeEduCoursePopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 교육과정 팝업 콜백
 *******************************/
function closeEduCoursePopup(data: Array<eduCourseType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(grid.value.data, {
        eduCourseId: _item.eduCourseId
      })
      if (index === -1) {
        $http({
          url: $format(selectConfig.sop.edu.course.get.url, _item.eduCourseId),
          method: 'GET'
        }).then((_result: any) => {
          const selectData = _result.data
          selectData.regUserId = user.value.userId
          selectData.editFlag = 'C'
          selectData.eduEducationId = uid()
          selectData.executionBudget = _result.data.estimatedEducationExpenses
          selectData.eduSubjectList = _result.data.eduCourseSubjectList
          selectData.eduAttendeeList = _result.data.totalUserList

          _.forEach(selectData.eduAttendeeList, (_item) => {
            _item.attendeesNo = uid()
            _item.attendeesId = _item.userId
            _item.attendeesTypeCd = 'EATC00003'
            _item.inExTypeCd = 'COURSE'
            _item.attendeesPositionName = _item.jobName
            _item.attendanceTime = _item.sumEducationTime
            _item.attendeesDeptName = _item.deptName
            _item.attendeesName = _item.userName
            _item.editFlag = 'C'
          })
          grid.value.data.splice(0, 0, selectData)
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 교육계획 추가
 *******************************/
function addRow() {
  // let checkCourse = Boolean(standardInfo.value.educationTypeCd)
  grid.value.data.push({
    educationCourseName: standardInfo.value.educationCourseName, // 교육과정명
    educationTypeCd: standardInfo.value.educationTypeCd, // 교육구분
    eduEducationId: uid(),
    educationMonth: null,
    educationLocation: '',
    educationMethodCd: null,
    educationName: '',
    editFlag: 'C',

    // 교육과정 마스터 데이터
    eduCourseId: standardInfo.value.eduCourseId, // 교육과정 key
    educationCycle: standardInfo.value.educationCycle, // 교육주기
    educationKindCdLarge: standardInfo.value.educationKindCdLarge, // 교육종류 대
    educationKindCdSmall: standardInfo.value.educationKindCdSmall, // 교육종류 소
    educationPurpose: standardInfo.value.educationPurpose, // 학습목적
    legalEducationFlag: standardInfo.value.legalEducationFlag, // 법정여부
    mainTargetAudience: standardInfo.value.mainTargetAudience, // 주요대상자
    relationLaws: standardInfo.value.relationLaws, // 관련법규
    sumEducationTime: standardInfo.value.sumEducationTime, // 교육시간
    estimatedEducationExpenses: standardInfo.value.estimatedEducationExpenses // 교육예산
  })
}
/******************************
 * TODO (목적): 교육계획 저장
 *******************************/
function saveEducation() {
  if (!eduInfo.value.plantCd) {
    message.alert({
      title: '안내',
      message: '사업장을 선택하세요',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      // TODO : 필요시 추가하세요.
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(grid.value.data, (_item) => {
          ;(_item.eduEducationYearPlanId = yearEdu.value.eduEducationYearPlanId),
            (_item.plantCd = eduInfo.value.plantCd),
            (_item.educationYear = eduInfo.value.educationYear),
            (_item.educationStartDate = _item.educationDate[0]),
            (_item.educationEndDate = _item.educationDate[1]),
            (_item.regUserId = user.value.userId)
          _item.chgUserId = user.value.userId
        })
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * TODO (목적): 교육계획 삭제
 *******************************/
function removeRow() {
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
      // TODO : 필요시 추가하세요.
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, {
              eduEducationId: item.eduEducationId
            })
          })
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 교육과정별 교육계획 추가
 *******************************/
function innerBtnClicked(col: any, _props: any) {
  grid.value.data.splice(_props.rowIndex, 0, {
    eduEducationId: uid(),
    key: _props.row.key,
    educationCourseName: _props.row.educationCourseName,
    educationTypeCd: _props.row.educationTypeCd,
    educationMonth: null,
    educationLocation: _props.row.educationLocation,
    educationMethodCd: _props.row.educationMethodCd,
    editFlag: 'C',
    eduCourseId: _props.row.eduCourseId, // 교육과정 key
    educationCycle: _props.row.educationCycle, // 교육주기
    educationKindCdLarge: _props.row.educationKindCdLarge, // 교육종류 대
    educationKindCdSmall: _props.row.educationKindCdSmall, // 교육종류 소
    educationPurpose: _props.row.educationPurpose, // 학습목적
    legalEducationFlag: _props.row.legalEducationFlag, // 법정여부
    mainTargetAudience: _props.row.mainTargetAudience, // 주요대상자
    relationLaws: _props.row.relationLaws, // 관련법규
    sumEducationTime: _props.row.sumEducationTime, // 교육시간
    executionBudget: _props.row.estimatedEducationExpenses // 교육예산
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
