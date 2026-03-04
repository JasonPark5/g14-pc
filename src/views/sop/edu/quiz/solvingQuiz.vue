<template>
  <div>
    <c-card title="문제 풀이" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable"
            :url="insertUrl"
            :isSubmit="isSave"
            :param="saveData"
            mappingType="POST"
            label="정답제출"
            icon="save"
            @beforeAction="saveInfo"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-12 divquizsolve" v-for="(item, idx) in questionItems" :key="idx">
          <div class="groupTitle">
            {{ item.questionContent2 }}
            <span style="color: red !important">{{ item.questionResult }}</span>
          </div>
          <q-checkbox
            v-for="(answer, _idx) in item.answers"
            :key="_idx"
            class="customqcbox"
            dense
            color="orange-custom"
            true-value="Y"
            :name="answer.eduAnswerId"
            false-value="N"
            :label="answer.answerContent2"
            v-model="answer.val"
            @input="checkAnswer(idx, answer.eduAnswerId)"
          />
        </div>
        <br /><br />
        <br /><br />
        <br /><br />
      </template>
    </c-card>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'solvingQuiz'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: solvingQuizPopupParamType
}
interface solvingQuizPopupParamType {
  eduEducationId: stringNull
  eduQuestionMstId: stringNull
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
      eduQuestionMstId: ''
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
const isSave = ref(false)
const totalScore = ref(0)
const questionItems = ref<any>([])
const listUrl = ref<any>('')
const insertUrl = ref<any>('')
const eduQuestionPassScore = ref(0)
const saveData = ref<any>({
  eduEducationId: '',
  userId: '',
  score: 0
})

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
  listUrl.value = selectConfig.sop.edu.quiz.sets.get.url
  insertUrl.value = transactionConfig.sop.edu.quiz.result.insert.url
  // code setting
  // list setting
  getQuestions()
}
function getQuestions() {
  if (props.popupParam.eduQuestionMstId) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        eduQuestionMstId: props.popupParam.eduQuestionMstId,
        eduEducationId: props.popupParam.eduEducationId
      }
    }).then((_result: any) => {
      if (_result.data.questions && _result.data.questions.length > 0) {
        questionItems.value = _result.data.questions
        eduQuestionPassScore.value = parseInt(_result.data.eduQuestionPassScore)
      } else {
        questionItems.value = []
      }
    })
  }
}
function checkAnswer(_idx: number, _aid: string) {
  _.forEach(questionItems.value[_idx].answers, (_answer) => {
    if (_answer.eduAnswerId !== _aid) {
      _answer.val = 'N'
    }
  })
}
function saveInfo() {
  let isCheck = false
  _.forEach(questionItems.value, (_question) => {
    let _anscnt = 0
    _.forEach(_question.answers, (_answers) => {
      if (_answers.val === 'Y') {
        _anscnt++
      }
    })
    if (_anscnt < 1) {
      isCheck = true
      return
    }
  })
  if (isCheck) {
    message.alert({
      title: '안내',
      message: '정답을 체크 하지 않은 문제가 있습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '정답을 제출하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        totalScore.value = 0
        _.forEach(questionItems.value, (_question) => {
          _question.questionResult = ' (X)'
          _.forEach(_question.answers, (_answers) => {
            if (_answers.answerFlag == 'Y' && _answers.val == 'Y') {
              totalScore.value += parseInt(_question.questionPoint)
              _question.questionResult = ' (O)'
            }
          })
        })

        if (totalScore.value >= eduQuestionPassScore.value) {
          saveData.value.eduEducationId = props.popupParam.eduEducationId
          saveData.value.userId = user.value.userId
          saveData.value.score = totalScore.value
          isSave.value = !isSave.value
        } else {
          message.alert({
            title: '안내',
            message:
              $language('문제풀이 통과 기준점수이상의 점수를 획득해야 합니다.') +
              '\r\n' +
              $language('통과 기준점수 : ') +
              eduQuestionPassScore.value +
              '\r\n' +
              $language('문제풀이 획득점수 : ') +
              totalScore.value +
              '\r\n' +
              $language('문제를 다시 풀어 주시기 바랍니다.'),
            type: 'warning' // success / info / warning / error
          })

          _.forEach(questionItems.value, (_question) => {
            _.forEach(_question.answers, (_answers) => {
              _answers.val = 'N'
            })
          })
        }
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.confirm({
    title: '문제풀이 통과',
    message:
      $language('문제풀이 통과 기준점수이상의 점수를 획득하셨습니다.') +
      '\r\n' +
      $language('통과 기준점수 : ') +
      eduQuestionPassScore.value +
      '\r\n' +
      $language('문제풀이 획득점수 : ') +
      totalScore.value +
      '\r\n' +
      $language('문제풀이 완료 후 교육이수 처리를 하시겠습니까?'),

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      emits('closePopup', 'SUCCESS')
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
