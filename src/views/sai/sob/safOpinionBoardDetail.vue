<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="제안의견" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && popupParam.boardId && deletable && isOwner"
                label="삭제"
                icon="delete_forever"
                @btnClicked="removeData"
              />
              <c-btn
                v-if="
                  (editable && popupParam.boardId && isOwner) || (editable && !popupParam.boardId)
                "
                :url="saveUrl"
                :isSubmit="isSave"
                :param="opinionData"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveData"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                required
                :editable="editable"
                label="제목"
                name="boardTitle"
                v-model:value="opinionData.boardTitle"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                required
                :editable="editable"
                label="의견게시일"
                name="boardDate"
                v-model:value="opinionData.boardDate"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-plant
                required
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="opinionData.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-field
                v-if="opinionData.regFlag === 'user'"
                :editable="false"
                type="dept_user"
                label="작성자"
                name="regUserId"
                v-model:value="opinionData.regUserId"
              />
              <c-text
                v-else
                :editable="false"
                label="작성자"
                name="regUserName"
                v-model:value="opinionData.regUserName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                required
                :editable="editable"
                :rows="7"
                label="의견"
                name="boardContents"
                v-model:value="opinionData.boardContents"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-upload
                :attachInfo="attachInfoRequest"
                :editable="editable"
                label="제안의견 첨부파일"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" v-show="opinionData.resultCd">
        <c-card title="의견 결과" class="cardClassDetailForm" bgClass="orange-2">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-select
                :editable="false"
                codeGroupCd="SOP_BOARD_RESULT_CD"
                itemText="codeName"
                itemValue="code"
                type="edit"
                name="resultCd"
                label="처리결과"
                v-model:value="opinionData.resultCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10" />
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :editable="false"
                :rows="8"
                label="의견 처리 결과"
                name="boardResultContent"
                v-model:value="opinionData.boardResultContent"
              />
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6">
              <c-upload :attachInfo="attachInfo" :editable="false" label="의견결과 첨부파일" />
            </div>
          </template>
        </c-card>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
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
import { dataBaseType } from '@/types/dataBase'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safOpinionBoardDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    boardId: stringNull
  }
}
interface opinionType extends dataBaseType {
  boardId: stringNull
  plantCd: stringNull
  boardDate: stringNull
  boardContents: stringNull
  boardTitle: stringNull
  boardTypeCd: stringNull
  boardProblem: stringNull
  boardResultContent: stringNull
  boardImprove: stringNull
  boardBenefit: stringNull
  boardLocation: stringNull
  policyCommentModelList: object[]
  regUserId: stringNull
  regFlag: stringNull
  resultCd: stringNull
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
      boardId: ''
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
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'SOB_BOARD',
  taskKey: ''
})
const attachInfoRequest = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'SOB_BOARD_REQUEST',
  taskKey: ''
})
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const opinionData = ref<opinionType>({
  boardId: '',
  plantCd: '',
  boardDate: '',
  boardContents: '',
  boardTitle: '',
  boardTypeCd: null,
  boardProblem: '',
  boardResultContent: '',
  boardImprove: '',
  boardBenefit: '',
  boardLocation: '',
  policyCommentModelList: [],
  regFlag: '',
  regUserId: '',
  resultCd: ''
})
const editable = ref(true)
const deletable = ref(false)
const isSave = ref(false)
const isdelete = ref(false)
const isOwner = ref(false)
const mappingType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.sai.sob.board.insert.url)
const deleteUrl = ref('')
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
  editable.value = Boolean(route.meta.editable)
  opinionData.value.boardDate = getToday()
  opinionData.value.regUserId = user.value.userId

  detailUrl.value = selectConfig.sai.sob.board.get.url
  deleteUrl.value = transactionConfig.sai.sob.board.delete.url
  getDetail()
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.boardId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.boardId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(opinionData.value, _result.data)
      if (opinionData.value.regUserId === user.value.userId) {
        isOwner.value = true
        deletable.value = true
      } else {
        isOwner.value = false
        deletable.value = false
      }
      if (opinionData.value.resultCd !== '') {
        editable.value = false
      }
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
      attachInfo.value.taskKey = props.popupParam.boardId
      attachInfoRequest.value.taskKey = props.popupParam.boardId
    })
  } else {
    opinionData.value.regUserId = user.value.userId
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  mappingType.value = props.popupParam.boardId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          opinionData.value.regUserId = user.value.userId
          opinionData.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  if (mappingType.value === 'POST') {
    props.popupParam.boardId = result.data
    attachInfo.value.taskKey = props.popupParam.boardId
    attachInfo.value.isSubmit = uid()
    attachInfoRequest.value.taskKey = props.popupParam.boardId
    attachInfoRequest.value.isSubmit = uid()
  }
  getDetail()
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.boardId),
        method: 'DELETE'
      }).then(() => {
        isdelete.value = !isdelete
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
</script>
