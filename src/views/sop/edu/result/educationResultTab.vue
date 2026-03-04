<template>
  <div>
    <div class="col float-right">
      <q-btn-group outline>
        <c-qr-btn
          v-if="
            editable &&
            educationInfo.documentStatusCd &&
            educationInfo.documentStatusCd !== 'ESC000001'
          "
          :mobileUrl="'/sop/edu/result/educationResult?eduEducationId=' + param.eduEducationId"
          text-color="white"
        />
        <c-btn
          v-show="editable && !disabled"
          :showLoading="false"
          label="완료"
          icon="check"
          @btnClicked="resultComplete"
        />
        <!-- <c-btn v-show="editable&&disabled" label="교육결과서" icon="print" @btnClicked="btnResultReport" /> -->
        <c-btn
          v-show="editable && disabled"
          label="대상자 연명부"
          icon="print"
          @btnClicked="btnResultUsers"
        />
      </q-btn-group>
    </div>
    <c-tab type="vertical" :height="tabHeight" :tabItems="tabItems" v-model:value="tab">
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :param="param"
          :planUpdateBtnData="param.planUpdateBtnData"
          :educationInfo="educationInfo"
          @setData="setData"
        />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { eduResultType } from './eduResult'

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
  name: 'educationResultTab'
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
  param: eduResultPopupParamType
  height: stringNull
}
interface eduResultPopupParamType {
  eduEducationId: stringNull
  searchResult: searchResultType
  planUpdateBtnData: planUpdateBtnDataType
}
interface searchResultType {
  flag: stringNull
  isSearch: boolean
}
interface planUpdateBtnDataType {
  title: stringNull
  flag: boolean
  research: stringNull
  planResearch: stringNull
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
      eduEducationId: '',
      searchResult: {
        flag: '',
        isSearch: false
      },
      planUpdateBtnData: {
        title: '계획',
        flag: false,
        research: '',
        planResearch: ''
      }
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

const educationInfo = ref<eduResultType>({
  eduEducationId: '',
  educationName: '',
  eduCourseId: '',
  plantCd: '',
  educationCourseName: '',
  educationKindCdLarge: null,
  educationKindCdSmall: null,
  educationTypeCd: null,
  departmentDeptCd: '',
  departmentDeptName: '',
  executionBudget: '',
  estimatedEducationExpenses: '',
  educationMethodName: '',
  educationMethodCd: null,
  educationOverview: '',
  evaluationEvalCd: null,
  documentStatusCd: '',
  qrCodeRoute: '',

  regUserId: '',
  chgUserId: '',
  eduSubjectList: [], // 과정별 교육과목
  delEduSubjectList: [],
  eduAttendeeList: [],
  delEduAttendeeList: [],
  eduEvalUserList: [],
  deleteEduEvalUserList: [],

  eduQuestionFlag: 'N',
  eduQuestionMstId: '',
  eduQuestionPassScore: 0
})
const completeUrl = ref('')
const tab = ref('educationResultInfo')
const printResultUrl = ref('')
const printResultUserUrl = ref('')
const getUrl = ref('')
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  let numHeight = props.height ? Number(_.replace(props.height, 'px', '')) : 600
  numHeight = numHeight - 26
  return numHeight + 'px'
})
const disabled = computed(() => educationInfo.value.documentStatusCd === 'ESC000010')
const tabItems = ref([
  {
    name: 'educationResultInfo',
    icon: 'edit',
    label: '교육평가',
    component: shallowRef(defineAsyncComponent(() => import(`./educationResultInfo.vue`)))
  },
  {
    name: 'educationComplete',
    icon: 'how_to_reg',
    label: '교육이수',
    component: shallowRef(defineAsyncComponent(() => import(`./educationComplete.vue`)))
  }
])
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.planUpdateBtnData.research,
  () => {
    getDetail()
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
  getUrl.value = selectConfig.sop.edu.result.get.url
  completeUrl.value = transactionConfig.sop.edu.result.complete.url
  printResultUrl.value = selectConfig.sop.edu.result.print.result.url
  printResultUserUrl.value = selectConfig.sop.edu.result.print.targetUser.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 교육 결과 상세 조회
 *******************************/
function getDetail() {
  if (props.param.eduEducationId) {
    $http({
      url: $format(getUrl.value, props.param.eduEducationId),
      method: 'GET'
    }).then((_result: any) => {
      educationInfo.value = _result.data
    })
  }
}
/******************************
 * TODO (목적): 교육 결과 key 세팅
 *******************************/
function setData(data: string) {
  props.param.eduEducationId = data
  getDetail()
}
/******************************
 * TODO (목적): 교육 결과 완료
 *******************************/
function resultComplete() {
  const flag = false
  if (!flag) {
    message.confirm({
      title: '확인',
      message: '결과완료하시겠습니까?(저장과 함께 처리됩니다.)',
      // TODO : 점검완료 하시겠습니까?
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        educationInfo.value.documentStatusCd = 'ESC000010'
        educationInfo.value.regUserId = user.value.userId
        educationInfo.value.chgUserId = user.value.userId

        $http({
          url: completeUrl.value,
          method: 'PUT',
          params: educationInfo.value
        }).then((_result: any) => {
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 교육 결과서 출력
 *******************************/
// function btnResultReport() {
//   let thisVue = this
//   this.$http.url = this.printResultUrl
//   this.$http.type = 'GET'
//   this.$http.param = {
//     eduEducationId: props.param.eduEducationId
//   }
//   this.$http.request(
//     (_result) => {
//       let fileOrgNm = educationInfo.value.educationName + ' ' + this.$language('결과서') + '.xlsx'
//       let blob = thisVue.$comm.base64ToBlob(_result.data)
//       if (window.navigator && window.navigator.msSaveOrOpenBlob) {
//         window.navigator.msSaveOrOpenBlob(blob, fileOrgNm)
//       } else {
//         let link = document.createElement('a')
//         link.href = window.URL.createObjectURL(blob)
//         link.download = fileOrgNm
//         link.click()
//       }
//     },
//     () => {}
//   )
// }
/******************************
 * TODO (목적): 교육 대상자 연명부 출력
 *******************************/
function btnResultUsers() {
  $http({
    url: printResultUserUrl.value,
    method: 'GET',
    params: {
      eduEducationId: props.param.eduEducationId
    }
  }).then((_result: any) => {
    const windowObj = window.navigator as any
    const fileOrgNm = educationInfo.value.educationName + ' ' + $language('연명부') + '.xlsx'
    const blob = base64ToBlob(_result.data)
    if (windowObj && windowObj.msSaveOrOpenBlob) {
      windowObj.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
