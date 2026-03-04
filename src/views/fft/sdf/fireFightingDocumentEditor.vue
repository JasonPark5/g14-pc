<template>
  <div>
    <q-form ref="editForm">
      <c-card :title="`${label} 상세`" class="cardClassDetailForm brigade">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="docu"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveDocument"
              @btnCallback="saveDocumentCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <c-textarea
              :required="true"
              :editable="editable"
              :editheight="innerTab ? 38 : 42"
              :maxHeight="innerTab ? 38 : 42 + 'rem'"
              type="editor"
              :label="`${label} 작성`"
              name="contents"
              v-model:value="docu.contents"
            />
          </div>
        </template>
      </c-card>
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
import { docType } from '../fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingDocumentEditor'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
  sopFireFightingDocumentClassCd?: stringNull
  label?: stringNull
  innerTab?: boolean
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  sopFireFightingDocumentClassCd: '',
  label: '',
  innerTabl: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const searchParam = ref({
  plantCd: null as stringNull,
  sopFireFightingDocumentClassCd: ''
})
const docu = ref<docType>({
  sopFireFightingDocumentId: '', // 소방 문서 일련번호
  plantCd: null, // 사업장코드
  sopFireFightingDocumentClassCd: '', // 문서 구분 코드
  contents: '', // 내용
  regUserId: '', // 등록자
  chgUserId: '' // 수정자
})
const editable = ref(false)
const isSave = ref(false)
const detailUrl = ref('')
const saveUrl = ref('')
const mappingType = ref('POST')
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
 * TODO function 주석 작성 (asdffunctionannotation 사용)\
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  detailUrl.value = selectConfig.fft.fireFightingDocument.get.url
  saveUrl.value = transactionConfig.fft.fireFightingDocument.insert.url
  // code setting
  searchParam.value.plantCd = user.value.plantCd
  searchParam.value.sopFireFightingDocumentClassCd = props.sopFireFightingDocumentClassCd
  if (!docu.value.sopFireFightingDocumentClassCd)
    docu.value.sopFireFightingDocumentClassCd = props.sopFireFightingDocumentClassCd
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  $http({
    url: detailUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    _.extend(docu.value, _result.data)
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveDocument() {
  if (docu.value.sopFireFightingDocumentId) {
    mappingType.value = 'PUT'
  } else {
    mappingType.value = 'POST'
    docu.value.plantCd = user.value.plantCd
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          docu.value.regUserId = user.value.userId
          docu.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveDocumentCallback(result?: any) {
  docu.value.sopFireFightingDocumentId = result.data
  message.requestSuccess()
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.brigade
  .customCardbody
    padding-top: 10px !important
</style>
