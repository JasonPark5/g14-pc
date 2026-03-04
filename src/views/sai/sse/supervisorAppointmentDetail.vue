<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline v-if="editable">
            <!-- <c-btn
              v-if="Boolean(popupParam.sseSupervisorAppointmentId)"
              label="출력"
              icon="print"
              @btnClicked="printAppoint"
            /> -->
            <c-btn
              :url="saveUrl"
              :isSubmit="isSave"
              :param="supervisor"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveApply"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-if="Boolean(popupParam.sseSupervisorAppointmentId)"
              label="삭제"
              icon="remove"
              @btnClicked="removeApply"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-dept type="search" label="부서" name="vendorCd" v-model:value="supervisor.deptCd" />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              required
              :editable="editable"
              label="임명일"
              type="date"
              name="checkDate"
              v-model:value="supervisor.checkDate"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-task-target
              required
              name="checkUserId"
              label="관리 감독자"
              :customPopupParam="{ targetKey: 'evaluatee' }"
              v-model:value="supervisor.checkUserId"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-text
              :editable="editable"
              label="비고"
              name="remark"
              v-model:value="supervisor.remark"
            />
          </div>
        </template>
      </c-card>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-upload :attachInfo="attachInfo" :editable="editable" label="임명장 관리 " />
      </div>
    </q-form>
    <c-dialog :param="popupOptions" />
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
  name: 'applyDetail'
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
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sseSupervisorAppointmentId: string
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
      sseSupervisorAppointmentId: ''
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
const editable = ref(false)
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'APPOINTMENT_SUPERVISOR', // 첨부파일 설정 완료
  taskKey: ''
})
const editForm = ref<HTMLFormElement | null>(null)
const supervisor = ref<any>({
  sseSupervisorAppointmentId: '',
  deptCd: null,
  checkUserId: '',
  checkUserName: '',
  checkDate: ''
  //completeFlag: null
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
//const comboItems = ref<codeMasterType>([])
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')

/******************************
 * @Computed_선언
 *******************************/
// const isWriter = computed(() => supervisor.value.applicant === user.value.userId)

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
  detailUrl.value = selectConfig.sai.sse.supervisor.get.url
  saveUrl.value = transactionConfig.sai.sse.supervisor.save.url
  deleteUrl.value = transactionConfig.sai.sse.supervisor.delete.url
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.sseSupervisorAppointmentId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sseSupervisorAppointmentId),
      method: 'GET'
    }).then((_result: any) => {
      supervisor.value = _.clone(_result.data)
      attachInfo.value.taskKey = props.popupParam.sseSupervisorAppointmentId
      emits('setRegInfo', _result.data)
    })
  }
}
/******************************
 * TODO (목적): 입력 값 저장
 *******************************/
function saveApply() {
  mappingType.value = props.popupParam.sseSupervisorAppointmentId ? 'PUT' : 'POST'
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          supervisor.value.regUserId = user.value.userId
          supervisor.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * TODO (목적): 입력 값 저장 완료 후 동작
 * @param (1): 저장 완료 결과 값
 *******************************/
function saveCallback(result: object | any) {
  message.requestSuccess()
  props.popupParam.sseSupervisorAppointmentId = result.data
  attachInfo.value.taskKey = props.popupParam.sseSupervisorAppointmentId
  attachInfo.value.isSubmit = props.popupParam.sseSupervisorAppointmentId
  getDetail()
}
/******************************
 * TODO (목적): 정보 삭제
 *******************************/
function removeApply() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.sseSupervisorAppointmentId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
// /******************************
//  * TODO (목적): 임명장 출력
//  *******************************/
// function printAppoint() {
//   $http({
//     url: $format(
//       selectConfig.sai.sse.supervisor.print.url,
//       props.popupParam.sseSupervisorAppointmentId
//     ),
//     method: 'GET'
//   }).then((_result: any) => {
//     const fileOrgNm = `${supervisor.value.checkUserName} 관리감독자 임명장_${supervisor.value.checkDate}.xlsx`
//     const link = document.createElement('a')
//     link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
//     link.download = fileOrgNm
//     link.click()
//   })
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
