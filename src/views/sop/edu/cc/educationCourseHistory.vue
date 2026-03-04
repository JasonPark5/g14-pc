<template>
  <div>
    <c-search-box>
      <template v-slot:search>
        <div v-if="educationInfo.plantName" class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-label-text title="사업장" :value="educationInfo.plantName" />
        </div>
        <div
          v-if="educationInfo.educationCourseName"
          class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
        >
          <c-label-text title="교육과정" :value="educationInfo.educationCourseName" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            name="educationPeriod"
            defaultStart="-6M"
            defaultEnd="0M"
            label="교육기간"
            v-model:value="educationPeriod"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="교육과정별 교육계획 및 결과"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="gridHeight"
      :editable="editable"
      rowKey="eduEducationId"
      checkDisableColumn="disable"
      :checkClickFlag="false"
      :isFullScreen="false"
      :filtering="false"
      :isExcelDown="false"
      :columnSetting="false"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn label="검색" icon="search" @btnClicked="getHistoryList" />
          </q-btn-group>
        </div>
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
import { eduResultType } from '../result/eduResult'
import { eduCourseType, eduCoursePopupParamType } from './eduCourse'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'educationCourseHistory'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  popupParam: eduCoursePopupParamType
  educationInfo: eduCourseType
}
interface gridType {
  columns: tableColumnType
  data: Array<eduResultType>
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
      eduCourseId: ''
    }
  },
  educationInfo: () => {
    return {
      plantName: null,
      eduCourseId: '', // 교육과정 일련번호
      plantCd: '', // 사업장 코드
      educationCourseName: '', // 교육과정명
      educationKindCdLarge: null, // 교육종류1
      educationKindCdSmall: null, // 교육종류2
      educationTypeCd: null, // 전사자체/부서자체/사내위탁/사외교육/연수/기타
      legalEducationFlag: 'Y', // 법정교육 여부
      sumEducationTime: '', // 교육시간
      educationCycle: null, // 주기
      educationPurpose: '', // 학습목적
      mainTargetAudience: '', // 기술
      estimatedEducationExpenses: '', // 예상 교육비
      relationLaws: '', // 관련 법규
      useFlag: 'Y',
      eduQuestionFlag: 'N',
      eduQuestionMstId: '',
      eduQuestionPassScore: 0,
      educationLocation: '', // 교육장소
      ramRiskAssessmentPlanId: '', //3단계판단법 일련번호
      educationMethodCd: null, //교육방법
      vod: null, // 동영상교육소스

      eduCourseSubjectList: [], // 과정별 교육과목
      deleteEduCourseSubjectList: [], // 제외과목
      eduCourseUserList: [], // 대상자
      deleteEduCourseUserList: [], // 제외 대상자
      eduCourseDeptList: [], // 대상부서
      deleteEduCourseDeptList: [], // 제외 대상부서
      eduCourseSeniorList: [], // 대상 선임
      deleteEduCourseSeniorList: [], // 제외 대상 선임

      regUserId: '',
      chgUserId: ''
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
const educationPeriod = ref<Array<any>>([])
const excelUrl = ref('')
const listUrl = ref('')

const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationName',
      field: 'educationName',
      label: '교육명',
      style: 'width:250px',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'educationDate',
      field: 'educationDate',
      label: '교육기간',
      style: 'width:140px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationLocation',
      field: 'educationLocation',
      label: '교육장소',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'educationMethodName',
      field: 'educationMethodName',
      style: 'width:90px',
      label: '교육방법',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationPurpose',
      field: 'educationPurpose',
      style: 'width:300px',
      label: '학습목적',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => String(Number(window.innerHeight) - 300) + 'px')

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
  excelUrl.value = transactionConfig.sop.edu.plan.insert.exceltargetUsers.url
  listUrl.value = selectConfig.sop.edu.result.list.url
  // code setting
  // list setting
  getHistoryList()
}
/******************************
 * TODO (목적): 교육과정과 관련된 교육 계획 및 결과 조회
 *******************************/
function getHistoryList() {
  if (props.popupParam.eduCourseId) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        plantCd: props.educationInfo.plantCd,
        eduCourseId: props.popupParam.eduCourseId,
        educationPeriod: educationPeriod.value,
        exceptDocumentStatusCd: 'ESC000001'
      }
    }).then((_result: any) => {
      grid.value.data = _result.data
    })
  }
}
/* eslint-disable no-unused-vars */
function linkClick(row: eduResultType) {
  popupOptions.value.title = '교육계획 및 결과 상세'
  popupOptions.value.param = {
    eduEducationId: row ? row.eduEducationId : '',
    eduCourseId: props.educationInfo.eduCourseId,
    stepCd:
      !row || row.documentStatusCd === 'ESC000001' || row.documentStatusCd === 'ESC000005'
        ? 'ESC0000005'
        : 'ESC0000010'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/edu/result/educationResultDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getHistoryList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
