<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="ISO 45001/14001 경영검토 보고서 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="isoReview"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  required
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="isoReview.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  required
                  :editable="editable && !disabled"
                  label="제목"
                  name="reportTitle"
                  v-model:value="isoReview.reportTitle"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-datepicker
                  required
                  :editable="editable && !disabled"
                  label="작성일"
                  name="reportDate"
                  v-model:value="isoReview.reportDate"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable && !disabled"
                  type="editor"
                  label="보고서 내용"
                  name="reportContents"
                  :editheight="27"
                  v-model:value="isoReview.reportContents"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-upload
            :attachInfo="attachInfo"
            :editable="editable && !disabled"
            label="보고서 첨부파일"
          />
        </div>
      </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'isoReviewReportDetail'
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
    reviewReportId: stringNull
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
      reviewReportId: ''
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
const isoReview = ref<any>({
  reviewReportId: '',
  plantCd: '',
  reportDate: getToday(),
  reportContents: '',
  reportTitle: '',
  regUserId: '',
  completeFlag: ''
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'ISO_REVIEW_REPORT',
  taskKey: ''
})
const mappingType = ref('POST')
const saveUrl = ref('')
const detailUrl = ref('')
const isSave = ref(false)
const editForm = ref<HTMLFormElement | null>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () => isoReview.value.completeFlag === 'Y' || Boolean(isoReview.value.sysApprovalRequestId)
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
  saveUrl.value = transactionConfig.sai.iso.report.insert.url
  detailUrl.value = selectConfig.sai.iso.report.get.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.reviewReportId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { reviewReportId: props.popupParam.reviewReportId }
    }).then((_result: any) => {
      _.extend(isoReview.value, _result.data)
      attachInfo.value.taskKey = props.popupParam.reviewReportId
      emits('setRegInfo', _result.data)
    })
  }
}
function saveData() {
  mappingType.value = props.popupParam.reviewReportId ? 'PUT' : 'POST'
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          isoReview.value.regUserId = user.value.userId
          isoReview.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.reviewReportId = result.data.reviewReportId
  attachInfo.value.taskKey = props.popupParam.reviewReportId
  attachInfo.value.isSubmit = uid()
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
