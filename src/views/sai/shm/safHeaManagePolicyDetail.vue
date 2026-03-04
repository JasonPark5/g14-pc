<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="안전보건 경영방침 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && popupParam.policyId"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="removeData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="safHealthData"
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
                  v-model:value="safHealthData.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  type="year"
                  :editable="false"
                  label="게시년도"
                  name="policyYear"
                  v-model:value="safHealthData.policyYear"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="editable"
                  label="게시일"
                  name="policyDate"
                  v-model:value="safHealthData.policyDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                <c-text
                  required
                  :editable="editable"
                  label="제목"
                  name="policyTitle"
                  v-model:value="safHealthData.policyTitle"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  :editable="editable"
                  type="editor"
                  label="안전보건 경영방침"
                  name="policyContents"
                  :editheight="36"
                  :maxHeight="36 + 'rem'"
                  v-model:value="safHealthData.policyContents"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-upload
                  :fullWidth="false"
                  :attachInfo="attachInfo"
                  :editable="editable"
                  label="관련자료"
                />
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
  name: 'safHeaManagePolicyDetail'
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
    policyId: stringNull
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
      policyId: ''
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
const safHealthData = ref<any>({
  policyId: '',
  plantCd: '',
  policyDate: getToday(),
  policyYear: getToday().split('-')[0],
  policyContents: '',
  policyTitle: '',
  policyLogModelList: [],
  itemList: [],
  regUserId: ''
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'SHM_POLICY',
  taskKey: ''
})
const saveUrl = ref('')
const mappingType = ref('POST')
const insertUrl = ref('')
const detailUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const insertLogUrl = ref('')
const isSave = ref(false)
const isdelete = ref(false)
const editForm = ref<HTMLFormElement | null>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => safHealthData.value.policyDate,
  () => {
    safHealthData.value.policyYear = safHealthData.value.policyDate.split('-')[0]
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
  detailUrl.value = selectConfig.sai.shm.policy.get.url
  saveUrl.value = transactionConfig.sai.shm.policy.insert.url
  insertUrl.value = transactionConfig.sai.shm.policy.insert.url
  updateUrl.value = transactionConfig.sai.shm.policy.update.url
  deleteUrl.value = transactionConfig.sai.shm.policy.delete.url
  insertLogUrl.value = transactionConfig.sai.shm.policy.insertlog.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.policyId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.policyId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(safHealthData.value, _result.data)
      attachInfo.value.taskKey = props.popupParam.policyId
      emits('setRegInfo', _result.data)

      $http({
        url: insertLogUrl.value,
        method: 'POST',
        data: {
          regUserId: user.value.userId,
          policyLogId: '',
          policyId: props.popupParam.policyId
        }
      }).then((_result: any) => {})
    })
  }
}
function saveData() {
  if (props.popupParam.policyId) {
    saveUrl.value = updateUrl.value
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    mappingType.value = 'POST'
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          safHealthData.value.regUserId = user.value.userId
          safHealthData.value.chgUserId = user.value.userId
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
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.policyId),
        method: 'DELETE'
      }).then((_result: any) => {
        isdelete.value = !isdelete.value
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.policyId = result.data
  attachInfo.value.taskKey = props.popupParam.policyId
  attachInfo.value.isSubmit = uid()
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
