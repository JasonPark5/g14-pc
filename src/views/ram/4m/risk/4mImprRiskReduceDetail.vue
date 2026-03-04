<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-5">
      <q-form ref="editForm1">
        <c-card title="조치내용 상세" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-show="imprEditable"
                :isSubmit="isDelete"
                :url="deleteUrl"
                :param="impr"
                mappingType="DELETE"
                label="삭제"
                icon="remove"
                @beforeAction="removeImpr"
                @btnCallback="removeCallback"
              />
              <c-btn
                v-show="imprEditable"
                :isSubmit="isSave"
                :url="saveUrl"
                :param="impr"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveImpr"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-show="imprEditable"
                :isSubmit="isComplete"
                :url="completeUrl"
                :param="impr"
                mappingType="PUT"
                label="완료"
                icon="check"
                @beforeAction="completeImpr"
                @btnCallback="completeCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <c-text
                :editable="imprEditable"
                :required="true"
                label="제목"
                name="ibmTitle"
                v-model:value="impr.ibmTitle"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <c-textarea
                :editable="imprEditable"
                :required="true"
                label="조치내용"
                name="actionContents"
                v-model:value="impr.actionContents"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <c-datepicker
                :editable="imprEditable"
                label="조치완료일"
                name="actionCompleteDate"
                v-model:value="impr.actionCompleteDate"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-7">
      <q-form ref="editForm2" :disabled="!imprEditable">
        <c-card title="조치 사진" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-12">
              <c-upload
                ref="fileUpload1"
                :editable="imprEditable"
                :attachInfo="attachBeforeInfo"
                label="개선 전 사진"
              />
            </div>
            <div class="col-12">
              <c-upload
                ref="fileUpload2"
                :attachInfo="attachAfterInfo"
                :editable="imprEditable"
                label="개선 후 사진"
              />
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
  name: '4mImprRiskReduceDetail'
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
  popupParam: {
    isSearch: boolean
    ram4mAssessImprId: stringNull
  }
  returnData: {
    col1: any | null
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
      isSearch: false,
      ram4mAssessImprId: ''
    }
  },
  returnData: () => {
    return {
      col1: null
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
const detailUrl = ref('')
const saveUrl = ref('')
const completeUrl = ref('')
const isSave = ref(false)
const isDelete = ref(false)
const isComplete = ref(false)
const editForm1 = ref<any>(null)
const fileUpload1 = ref<any>(null)
const fileUpload2 = ref<any>(null)
const impr = ref<any>({
  ram4mAssessImprId: '', // 시나리오별 Punch-list 번호
  ram4mAssessScenarioId: '', // 시나리오 일련번호_시나리오의 한 라인(원일별)
  ibmTitle: '', // 제목
  stepFlag: '', // 완료여부
  actionCompleteDate: '', // 조치완료일
  actionContents: '', // 조치내용
  regUserId: '', // 등록자 ID
  regDt: '',
  chgUserId: '' // 수정자 ID
})
const attachBeforeInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: '4M_IMPR_BEFORE',
  taskKey: ''
})
const attachAfterInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: '4M_IMPR_AFTER',
  taskKey: ''
})

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return props.popupParam.isSearch || impr.value.stepFlag === 'Y'
})
const imprEditable = computed(() => {
  return editable.value && !disabled.value
})
const deleteUrl = computed(() => {
  return $format(transactionConfig.ram.fm.impr.delete.url, props.popupParam.ram4mAssessImprId)
})

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
  detailUrl.value = selectConfig.ram.fm.impr.get.url
  saveUrl.value = transactionConfig.ram.fm.impr.update.url
  completeUrl.value = transactionConfig.ram.fm.impr.complete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getDetail() {
  if (props.popupParam.ram4mAssessImprId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.ram4mAssessImprId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(impr.value, _result.data)

      attachBeforeInfo.taskKey = _.clone(impr.value.ram4mAssessImprId)
      attachAfterInfo.taskKey = _.clone(impr.value.ram4mAssessImprId)

      props.returnData.col1 = impr.value
    })
  }
}
/******************************
 * TODO (목적): 요청&접수 상세 저장
 *******************************/
function saveImpr() {
  editForm1.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId

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
 * TODO (목적): 요청&접수 상세 저장 callback
 *******************************/
function saveCallback(_result: any) {
  props.popupParam.ram4mAssessImprId = _result.data
  attachBeforeInfo.value.isSubmit = uid()
  attachAfterInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 완료 저장
 *******************************/
function completeImpr() {
  editForm1.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId

          isComplete.value = !isComplete.value
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
 * TODO (목적): 완료 저장 callback
 *******************************/
function completeCallback(_result: any) {
  props.popupParam.ram4mAssessImprId = _result.data
  attachBeforeInfo.value.isSubmit = uid()
  attachAfterInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function removeImpr() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      isDelete.value = !isDelete.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 삭제 callback
 *******************************/
function removeCallback() {
  message.requestSuccess()
  emits('closePopup', props.returnData, 'delete')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
