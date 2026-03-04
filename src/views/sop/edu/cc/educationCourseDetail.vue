<template>
  <c-tab
    type="horizon"
    :dense="true"
    :tabItems="tabItems"
    :inlineLabel="true"
    :height="tabHeight"
    v-model:value="tab"
  >
    <template v-slot:default="tab">
      <component
        :popupParam="popupParam"
        :educationInfo="educationInfo"
        :attachInfo="attachInfo"
        :is="tab.component"
        @closePopup="closePopup"
        @getDetail="getDetail"
      />
    </template>
  </c-tab>
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
import { eduCourseType, eduCoursePopupParamType } from './eduCourse'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'educationCourseDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  popupParam: eduCoursePopupParamType
  contentHeight: string
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
  contentHeight: 'auto'
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const getUrl = ref('')
const tab = ref('educationCourseInfo')
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'EDU_CURRICULUM',
  taskKey: ''
})
const educationInfo = ref<eduCourseType>({
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
})

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => {
  let _items: Array<tabItemsType> = [
    {
      name: 'educationCourseInfo',
      icon: 'info',
      label: '교육과정 기본정보',
      component: defineAsyncComponent(() => import(`./educationCourseInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items = _.concat(_items, [
      {
        name: 'educationCourseUser',
        icon: 'face',
        label: '기본 교육대상자',
        component: defineAsyncComponent(() => import(`./educationCourseUser.vue`))
      },
      // { name: 'educationCourseTextBook', icon: 'file_copy', label: '교육교재', component: () => import(`${'./educationCourseTextBook.vue'}`) },
      {
        name: 'educationCourseHistory',
        icon: 'history',
        label: '교육과정별 교육계획 및 결과',
        component: defineAsyncComponent(() => import(`./educationCourseHistory.vue`))
      }
    ])
  }
  return _items
})
const tabHeight = computed(() => String(Number(props.contentHeight) - 5) + 'px')
const isOld = computed(() => Boolean(props.popupParam.eduCourseId))
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
  getUrl.value = selectConfig.sop.edu.course.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 교육과정 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.eduCourseId) {
    $http({
      url: $format(getUrl.value, props.popupParam.eduCourseId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(educationInfo.value, _result.data)
      attachInfo.value.taskKey = props.popupParam.eduCourseId
    })
  }
}
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
