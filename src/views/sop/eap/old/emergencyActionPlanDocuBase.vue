<template>
  <div>
    <q-form ref="editForm">
      <c-card title="비상조치계획 상세" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="!disabled && editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="emerActPlanDocu"
              :mappingType="saveType"
              label="저장"
              icon="save"
              @beforeAction="savePlan"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-sm-12 col-md-6 col-lg-6">
            <c-text
              :required="true"
              :editable="editable"
              :disabled="disabled"
              label="계획서명"
              name="emergencyPlanName"
              v-model:value="emerActPlanDocu.emergencyPlanName"
            />
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              :disabled="disabled"
              label="문서번호"
              name="documentNo"
              v-model:value="emerActPlanDocu.documentNo"
            />
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3">
            <c-select
              required
              :editable="editable"
              :disabled="disabled"
              type="edit"
              codeGroupCd="EAP_TYPE_CD"
              itemText="codeName"
              itemValue="code"
              name="emergencyTypeCd"
              label="비상사태구분"
              v-model:value="emerActPlanDocu.emergencyTypeCd"
            />
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3">
            <c-text
              :required="true"
              :editable="editable"
              :disabled="disabled"
              label="비상사태유형"
              name="emergencyClassCd"
              v-model:value="emerActPlanDocu.emergencyClassCd"
            />
          </div>
          <div class="col-sm-6 col-md-3 col-lg-3">
            <c-text
              :suffix="$language('명')"
              :editable="editable"
              :disabled="disabled"
              type="number"
              label="피해예상인원"
              name="damageTypeExpectPeopleNumber"
              v-model:value="emerActPlanDocu.damageTypeExpectPeopleNumber"
            />
          </div>
          <!-- <div class="col-sm-6 col-md-3 col-lg-3">
            <c-plant
              :required="true"
              :disabled="disabled"
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="emerActPlanDocu.plantCd"
              @datachange="plantChange"
            />
          </div> -->
          <div class="col-sm-6 col-md-3 col-lg-3">
            <c-radio
              :editable="editable"
              :disabled="disabled"
              :comboItems="useFlagItems"
              label="사용여부"
              name="useFlag"
              v-model:value="emerActPlanDocu.useFlag"
            />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6">
            <c-field
              :editable="editable"
              :disabled="disabled"
              type="dept_spot_user"
              label="비상연락망"
              name="managerId"
              v-model:value="emerActPlanDocu.managerId"
              @userInfo="userInfo"
            />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6">
            <c-text
              :disabled="true"
              label=""
              name="managerId"
              v-model:value="emerActPlanDocu.mobileNo"
            />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              label="예상피해사항 및 범위"
              :rows="5"
              name="expectDamageRange"
              v-model:value="emerActPlanDocu.expectDamageRange"
            />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              label="예상원인"
              :rows="5"
              name="expectCause"
              v-model:value="emerActPlanDocu.expectCause"
            />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              label="공정조치사항"
              :rows="5"
              name="processActionMatter"
              v-model:value="emerActPlanDocu.processActionMatter"
            />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              label="비상사태 대응시 유의사항"
              :rows="5"
              :maxlength="800"
              name="emergencyReactNotice"
              v-model:value="emerActPlanDocu.emergencyReactNotice"
            />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              label="대피절차"
              :rows="5"
              name="evacuationProcedures"
              v-model:value="emerActPlanDocu.evacuationProcedures"
            />
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              label="비상대피 후 취해야할 업무"
              :rows="5"
              name="evacuationAfterAction"
              v-model:value="emerActPlanDocu.evacuationAfterAction"
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'emergencyActionPlanDocuBase'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['transInfo', 'changeStatus'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  emerActPlanDocu: {
    sopEmergencyPlanId: stringNull
    plantCd: stringNull
    documentNo: stringNull
    emergencyPlanName: stringNull
    emergencyTypeCd: stringNull
    emergencyClassCd: stringNull
    damageTypeExpectPeopleNumber: stringNull
    expectDamageRange: stringNull
    expectCause: stringNull
    processActionMatter: stringNull
    emergencyReactNotice: stringNull
    evacuationProcedures: stringNull
    evacuationAfterAction: stringNull
    managerId?: stringNull
    mobileNo?: stringNull
    useFlag: stringNull
    regUserId: stringNull
    chgUserId: stringNull
  }
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
  emerActPlanDocu: () => {
    return {
      sopEmergencyPlanId: '',
      plantCd: '',
      documentNo: '',
      emergencyPlanName: '',
      emergencyTypeCd: null,
      emergencyClassCd: '',
      damageTypeExpectPeopleNumber: '',
      expectDamageRange: '',
      expectCause: '',
      processActionMatter: '',
      emergencyReactNotice: '',
      evacuationProcedures: '',
      evacuationAfterAction: '',
      managerId: '',
      mobileNo: '',
      useFlag: 'Y',
      regUserId: '',
      chgUserId: ''
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
const useFlagItems = ref<Array<codeMasterType>>([])
const saveUrl = ref('')
const saveType = ref('POST')
const getUrl = ref('')
const isSave = ref(false)
const disabled = ref(false)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.emerActPlanDocu.mobileNo,
  () => {
    props.emerActPlanDocu.mobileNo = props.emerActPlanDocu.mobileNo
      ? toMobileNum(props.emerActPlanDocu.mobileNo)
      : ''
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
  getUrl.value = selectConfig.sop.eap.planDocu.get.url
  saveUrl.value = transactionConfig.sop.eap.planDocu.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
}
// function plantChange() {
//   emits('transInfo', {
//     plantCd: props.emerActPlanDocu.plantCd,
//     sopEmergencyPlanId: props.emerActPlanDocu.sopEmergencyPlanId
//   })
// }
function savePlan() {
  if (props.emerActPlanDocu.sopEmergencyPlanId) {
    saveUrl.value = transactionConfig.sop.eap.planDocu.update.url
    saveType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.eap.planDocu.insert.url
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.emerActPlanDocu.regUserId = user.value.userId
          props.emerActPlanDocu.chgUserId = user.value.userId
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
function saveCallback(_result: any) {
  message.requestSuccess()
  if (!props.emerActPlanDocu.sopEmergencyPlanId) {
    props.emerActPlanDocu.sopEmergencyPlanId = _result.data
    emits('changeStatus', props.emerActPlanDocu.sopEmergencyPlanId)
  }
}
function userInfo(_data: any) {
  if (_data) props.emerActPlanDocu.mobileNo = _data.mobileNo
  else props.emerActPlanDocu.mobileNo = ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
