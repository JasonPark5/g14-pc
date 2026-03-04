<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="editForm">
        <c-card title="신규년도 무재해 부서추가" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="uninjury"
                :mappingType="mappingType"
                label="생성"
                icon="save"
                @beforeAction="saveData"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <!-- <div class="col-3">
              <c-plant
                type="edit"
                :required="true"
                :editable="editable"
                v-model:value="uninjury.plantCd"
              />
            </div> -->
            <div class="col-3">
              <c-datepicker
                :editable="editable"
                :required="true"
                type="year"
                label="대상년도"
                name="uninjuryYear"
                v-model:value="uninjury.uninjuryYear"
              />
            </div>
            <div class="col-6">
              <c-datepicker
                :editable="editable"
                :required="true"
                label="인원기준일"
                name="standardDate"
                v-model:value="uninjury.standardDate"
              />
            </div>
            <div class="col-12 standard-msg">
              {{
                $language(
                  '※ 부서 마스터 화면에서 부서정보 중 [무재해 대상부서]만 자동으로 생성됩니다.'
                )
              }}
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { uninjuryType } from './uninjury'

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
  name: 'uninjuryStandard'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const saveUrl = ref('')
const editable = ref(true)
const isSave = ref(false)
const mappingType = ref('POST')
const uninjury = ref<uninjuryType>({
  plantCd: null, // 사업장코드
  uninjuryYear: '', // 무사고 년도
  standardDate: '', // 인원기준일
  avgCnt: null // 기준일기준 부서평균인원(가중인원대상부서)
})
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
  saveUrl.value = transactionConfig.sai.uninjury.insert.url
  // code setting
  // list setting
}

/******************************
 * TODO (목적): 설문조사 결과 상세조회
 *******************************/
function saveData() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message:
          $language('해당년도의 무재해 부서를 추가하시겠습니까?') +
          ' [' +
          uninjury.value.uninjuryYear +
          ']',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          uninjury.value.regUserId = user.value.userId
          uninjury.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  if (result.data == 'X') {
    message.alert({
      title: '안내',
      message: '생성된 대상년도가 있습니다. 생성되지 않은 년도로 생성할 수 있습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.requestSuccess()
    emits('closePopup', {
      plantCd: uninjury.value.plantCd,
      uninjuryYear: uninjury.value.uninjuryYear
    })
  }
}
</script>
<style scoped>
.standard-msg {
  color: red;
  font-size: 1em;
  padding-bottom: 20px !important;
}
</style>
