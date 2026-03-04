<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && popupParam.koraDocumentId"
              label="삭제"
              icon="delete_forever"
              @btnClicked="removeData"
            />
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="koraDocument"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveData"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-plant
              required
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="koraDocument.plantCd"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              required
              :editable="editable"
              label="제목"
              name="documentTitle"
              v-model:value="koraDocument.documentTitle"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              required
              :editable="editable"
              type="edit"
              codeGroupCd="KORA_SUBMIT_TYPE_CD"
              itemText="codeName"
              itemValue="code"
              name="koraSubmitTypeCd"
              label="제출구분"
              v-model:value="koraDocument.koraSubmitTypeCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              required
              :editable="editable"
              type="edit"
              codeGroupCd="KORA_SUBMIT_LEVEL_CD"
              itemText="codeName"
              itemValue="code"
              name="koraSubmitLevelCd"
              label="작성수준"
              v-model:value="koraDocument.koraSubmitLevelCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              required
              :editable="editable"
              default="today"
              label="제출일"
              name="documentDate"
              v-model:value="koraDocument.documentDate"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-textarea
              :editable="editable"
              :editheight="20"
              type="editor"
              label="내용"
              name="documentContents"
              v-model:value="koraDocument.documentContents"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-upload :attachInfo="attachInfo" :editable="editable" label="첨부파일" />
          </div>
        </template>
      </c-card>
      <c-dialog :param="popupOptions" />
    </q-form>
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
import { koraDocumentType } from './koraDocument'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'koraDocumentDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
    koraDocumentId: stringNull
  }
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
      koraDocumentId: ''
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
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const koraDocument = ref<koraDocumentType>({
  koraDocumentId: '', // 화학사고예방관리계획서 일련번호
  plantCd: null, // 사업장코드
  koraSubmitTypeCd: null, // 화학사고예방관리계획서 제출 구분코드
  koraSubmitLevelCd: null, // 화학사고예방관리계획서 작성수준 코드
  documentDate: '', // 화학사고예방관리계획서 제출 일자
  documentTitle: '', // 화학사고예방관리계획서 제목
  documentContents: '', // 화학사고예방관리계획서 내용
  regUserId: '',
  chgUserId: ''
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'KORA_DOCUMENT',
  taskKey: ''
})
const mappingType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
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
  detailUrl.value = selectConfig.mdm.kora.document.get.url
  saveUrl.value = transactionConfig.mdm.kora.document.insert.url
  deleteUrl.value = transactionConfig.mdm.kora.document.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 화학사고 예방관리계획서 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.koraDocumentId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        koraDocumentId: props.popupParam.koraDocumentId
      }
    }).then((_result: any) => {
      koraDocument.value = _result.data
      attachInfo.value.taskKey = props.popupParam.koraDocumentId

      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
    })
  }
}
/******************************
 * TODO (목적): 화학사고 예방관리계획서 저장 전 처리
 *******************************/
function saveData() {
  if (props.popupParam.koraDocumentId) {
    saveUrl.value = transactionConfig.mdm.kora.document.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.mdm.kora.document.insert.url
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          koraDocument.value.regUserId = user.value.userId
          koraDocument.value.chgUserId = user.value.userId

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
/******************************
 * TODO (목적): 화학사고 예방관리계획서 저장 후 처리
 * @param (1): API 서버 반환 값
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (!props.popupParam.koraDocumentId) {
    props.popupParam.koraDocumentId = result.data.koraDocumentId
    attachInfo.value.taskKey = props.popupParam.koraDocumentId
    attachInfo.value.isSubmit = uid()
  }
  getDetail()
}
/******************************
 * TODO (목적): 화학사고 예방관리계획서 삭제
 *******************************/
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',

    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.koraDocumentId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
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
