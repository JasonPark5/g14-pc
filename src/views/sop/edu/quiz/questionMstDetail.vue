<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="교육 문제풀이 SET 정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- <c-btn v-if="editable && popupParam.eduQuestionMstId" label="삭제" icon="delete_forever" @btnClicked="removeData" /> -->
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="question"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  required
                  :editable="editable"
                  label="교육 문제풀이 SET명"
                  name="eduQuestionMstName"
                  v-model:value="question.eduQuestionMstName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  required
                  :editable="editable"
                  type="edit"
                  codeGroupCd="EDU_KIND_FST_CD"
                  itemText="codeName"
                  itemValue="code"
                  name="educationKindCdLarge"
                  label="교육종류"
                  v-model:value="question.educationKindCdLarge"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="question.useFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-table
                  ref="questionTable"
                  title="문제"
                  :columnSetting="false"
                  :isFullScreen="false"
                  :usePaging="false"
                  :filtering="false"
                  :columns="questionGrid.columns"
                  :isExcelDown="false"
                  :data="question.questions"
                  gridHeight="600px"
                  selection="multiple"
                  rowKey="eduQuestionId"
                  :editable="editable"
                >
                  <!-- 버튼 영역 -->
                  <template v-slot:table-button>
                    <q-btn-group outline>
                      <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addQuestion" />
                      <c-btn
                        v-if="editable && question.questions!.length > 0"
                        label="삭제"
                        icon="remove"
                        @btnClicked="removeQuestion"
                      />
                    </q-btn-group>
                  </template>
                  <template v-slot:customArea="{ props, col }">
                    <template v-if="col.name === 'custom'">
                      <q-chip
                        color="grey-8"
                        style="font-size: 11px"
                        clickable
                        outline
                        square
                        @click="getAnswerList(props.row)"
                      >
                        {{ '보기' }}
                      </q-chip>
                    </template>
                  </template>
                </c-table>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-table
                  ref="answerTable"
                  title="답변"
                  tableId="answerGrid"
                  :columnSetting="false"
                  :isFullScreen="false"
                  :usePaging="false"
                  :filtering="false"
                  :columns="answerGrid.columns"
                  :isExcelDown="false"
                  :data="row.answers"
                  gridHeight="600px"
                  selection="multiple"
                  rowKey="eduAnswerId"
                  :editable="editable"
                >
                  <template v-slot:table-chip>
                    <q-chip v-if="selectedQuestionName" outline square color="primary">
                      {{ selectedQuestionName }}
                    </q-chip>
                  </template>
                  <!-- 버튼 영역 -->
                  <template v-slot:table-button>
                    <q-btn-group outline>
                      <c-btn
                        v-if="editable && selectedQuestionId"
                        label="추가"
                        icon="add"
                        @btnClicked="addAnswer"
                      />
                      <c-btn
                        v-if="editable && selectedQuestionId && row.answers.length > 0"
                        label="삭제"
                        icon="remove"
                        @btnClicked="removeAnswer"
                      />
                    </q-btn-group>
                  </template>
                </c-table>
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { questionMstType, questionType } from './question'

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
  name: 'questionMstDetail'
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
const emits = defineEmits(['setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: questionPopupParamType
}
interface questionPopupParamType {
  eduQuestionMstId: stringNull
  disableEdit: boolean
}
interface gridType {
  columns: tableColumnType
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const detailProps = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      eduQuestionMstId: '',
      disableEdit: true
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
const saveUrl = ref('')
const detailUrl = ref('')
const mappingType = ref('POST')
const question = ref<questionMstType>({
  eduQuestionMstId: '', // 교육 문제풀이 마스터 일련번호
  eduQuestionMstName: '', // 교육 문제풀이 SET명
  educationKindCdLarge: null, // 교육종류(대)
  eduQuestionPassScore: '', // 물제풀이 통과 기준점수
  useFlag: 'Y', // 사용여부
  delFlag: 'N', // 삭제여부
  questions: [],
  delQuestions: []
})
const row = ref<any>({})
const selectedQuestionId = ref('')
const selectedQuestionName = ref('')
const questionGrid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'questionSortOrder',
      field: 'questionSortOrder',
      label: '순번',
      align: 'center',
      style: 'width:70px',
      type: 'number',
      sortable: false
    },
    {
      required: true,
      name: 'questionContent',
      field: 'questionContent',
      label: '문제 내용',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      name: 'questionPoint',
      field: 'questionPoint',
      label: '배점',
      type: 'number',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'custom',
      field: 'custom',
      label: '답변',
      align: 'center',
      style: 'width:60px',
      type: 'custom',
      sortable: false
    }
  ]
})
const answerGrid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'answerSortOrder',
      field: 'answerSortOrder',
      label: '순번',
      align: 'center',
      style: 'width:70px',
      type: 'number',
      sortable: false
    },
    {
      required: true,
      name: 'answerContent',
      field: 'answerContent',
      label: '답변 내용',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'answerFlag',
      field: 'answerFlag',
      label: '정답여부',
      align: 'center',
      style: 'width:80px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    }
  ]
})
const questionTable = ref<any>(null)
const answerTable = ref<any>(null)
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
  detailUrl.value = selectConfig.sop.edu.quiz.mst.get.url
  saveUrl.value = transactionConfig.sop.edu.quiz.mst.update.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (detailProps.popupParam.eduQuestionMstId) {
    $http({
      url: $format(detailUrl.value, detailProps.popupParam.eduQuestionMstId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(question.value, _result.data)
      emits('setRegInfo', _result.data)
    })
  }
}
/******************************
 * TODO (목적): 질문 추가
 *******************************/
function addQuestion() {
  if (!question.value.questions) question.value.questions = [] // 초기화
  question.value.questions.splice(0, 0, {
    eduQuestionMstId: detailProps.popupParam.eduQuestionMstId, // 교육 문제풀이 마스터 일련번호
    eduQuestionId: uid(), // 교육 문제풀이 문제 일련번호
    questionSortOrder: question.value.questions.length + 1, // 문제 순번
    questionContent: '', // 문제내용
    questionPoint: '', // 문제 배점
    delFlag: 'N', // 삭제여부
    editFlag: 'C',
    regUserId: user.value.userId,
    answers: [],
    delAnswers: []
  })
}
/******************************
 * TODO (목적): 질문 삭제
 *******************************/
function removeQuestion() {
  const selectData = questionTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!question.value.delQuestions) {
      question.value.delQuestions = []
    }
    if (!row.value.delAnswers) {
      row.value.delAnswers = []
    }
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(question.value.delQuestions, { eduQuestionId: item.eduQuestionId }) === -1 &&
        item.editFlag !== 'C'
      ) {
        question.value.delQuestions!.push(item)
      }
      question.value.questions = _.reject(question.value.questions, item)
    })
    questionTable.value.compoTable.clearSelection()

    row.value = {}
    selectedQuestionId.value = ''
    selectedQuestionName.value = ''
  }
}
/******************************
 * TODO (목적): 질문별 답변 조회
 *******************************/
function getAnswerList(_row: questionType) {
  row.value = _row
  selectedQuestionId.value = _row.eduQuestionId
  selectedQuestionName.value = _row.questionContent
}
/******************************
 * TODO (목적): 답변 추가
 *******************************/
function addAnswer() {
  row.value.answers.push({
    eduQuestionId: selectedQuestionId.value, // 교육 문제풀이 문제 일련번호
    eduAnswerId: uid(), // 교육 문제풀이 답변 일련번호
    answerSortOrder: row.value.answers.length + 1, // 정답 순번
    answerContent: '', // 정답내용
    answerFlag: 'N', // 정답여부
    delFlag: 'N', // 삭제여부
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): 답변 삭제
 *******************************/
function removeAnswer() {
  const selectData = answerTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!row.value.delAnswers) {
        row.value.delAnswers = []
      }
      if (
        _.findIndex(row.value.delAnswers, { eduAnswerId: item.eduAnswerId }) === -1 &&
        item.editFlag !== 'C'
      ) {
        row.value.delAnswers.push(item)
      }
      row.value.answers = _.reject(row.value.answers, item)
    })
    answerTable.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 답변 저장
 *******************************/
function saveData() {
  mappingType.value = detailProps.popupParam.eduQuestionMstId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          question.value.regUserId = user.value.userId
          question.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  detailProps.popupParam.eduQuestionMstId = result.data
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
