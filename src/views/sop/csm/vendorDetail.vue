<template>
  <div>
    <q-form ref="editForm">
      <c-card title="협력업체 상세" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <!-- <c-btn
              v-if="editable && parentVendorCd"
              label="접속ID 변경"
              icon="verified_user"
              @btnClicked="changePortalId"
            />
            <c-btn
              v-if="editable && parentVendorCd"
              :url="resetUrl"
              :isSubmit="isReset"
              :param="vendorData"
              mappingType="PUT"
              label="비밀번호초기화"
              icon="password"
              @beforeAction="resetPwd"
              @btnCallback="resetPwdCallback"
            /> -->
            <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addVendor" />
            <c-btn
              v-if="editable"
              :disabled="!saveable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="vendorData"
              :mappingType="saveType"
              label="저장"
              icon="save"
              @beforeAction="saveData"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-4">
            <c-text
              :required="true"
              :editable="editable && dataeditable"
              label="업체명"
              name="vendorName"
              v-model:value="vendorData.vendorName"
            />
          </div>
          <div class="col-4">
            <c-text
              :editable="false"
              label="업체코드"
              name="vendorCd"
              v-model:value="vendorData.vendorCd"
            />
          </div>
          <div class="col-4">
            <c-text
              :editable="editable && dataeditable"
              label="사업자번호"
              name="bizNo"
              mask="###-##-#####"
              v-model:value="vendorData.bizNo"
              @dataChange="(val: any) => (vendorData.portalId = val.replace(/-/g, ''))"
            />
          </div>
          <div class="col-4">
            <c-select
              codeGroupCd="VENDOR_CLASS_CD"
              :editable="editable && dataeditable"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="vendorClassCd"
              label="업체분류"
              v-model:value="vendorData.vendorClassCd"
            />
          </div>
          <div class="col-4">
            <c-select
              codeGroupCd="VENDOR_TYPE_CD"
              :editable="editable && dataeditable"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="vendorTypeCd"
              label="업체유형"
              v-model:value="vendorData.vendorTypeCd"
            />
          </div>
          <div class="col-4">
            <c-text
              :editable="editable && dataeditable"
              label="대표자명"
              name="representName"
              v-model:value="vendorData.representName"
            />
          </div>
          <div class="col-4">
            <c-text
              :editable="editable && dataeditable"
              label="대표전화번호"
              name="phoneNo"
              v-model:value="vendorData.phoneNo"
            />
          </div>
          <div class="col-4">
            <c-text
              :editable="editable && dataeditable"
              label="대표이메일"
              name="email"
              v-model:value="vendorData.email"
            />
          </div>
          <div class="col-4">
            <c-text
              :editable="editable && dataeditable"
              label="담당자명"
              name="chargeName"
              v-model:value="vendorData.chargeName"
            />
          </div>
          <div class="col-8">
            <c-text
              :editable="editable && dataeditable"
              label="본사주소"
              name="address"
              v-model:value="vendorData.address"
            />
          </div>
          <div class="col-4">
            <c-checkbox
              :editable="editable && dataeditable"
              :isFlag="true"
              label="사용여부"
              name="useFlag"
              v-model:value="vendorData.useFlag"
            />
          </div>
          <!-- <div class="col-12">
            <c-multi-select
              :required="true"
              :editable="editable && dataeditable"
              :isArray="false"
              codeGroupCd="PLANT_CD"
              itemText="codeName"
              itemValue="code"
              label="관련사업장"
              name="plantCds"
              v-model:value="vendorData.plantCds"
            />
          </div> -->
        </template>
      </c-card>
      <!-- <c-card title="협력업체 포털 접속여부" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-6">
            <c-checkbox
              :editable="editable"
              :isFlag="true"
              label="협력업체 포털 접속여부"
              name="portalConnFlag"
              v-model:value="vendorData.portalConnFlag"
            />
          </div>
          <div class="col-6">
            <c-text
              readonly
              :editable="editable"
              label="접속 ID"
              name="portalId"
              v-model:value="vendorData.portalId"
            />
          </div>
        </template>
      </c-card> -->
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
import { vendorType } from '@/types/vendor'
// import { portalIdType } from './portalIdChange'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'vendorDetail'
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
const emits = defineEmits(['isNew', 'searchDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  parentVendorCd?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  parentVendorCd: ''
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
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const vendorData = ref<vendorType>({
  vendorCd: '', // 업체코드
  vendorName: '', // 업체명
  vendorClassCd: null, // 업체분류 코드
  vendorTypeCd: null, // 업체유형 코드
  address: '', // 본사주소
  bizNo: '', // 사업자번호
  chargeDeptCd: '', // 담당부서 코드
  phoneNo: '', // 대표 전화번호
  email: '', // 대표 이메일
  chargeName: '', // 담당자명
  representName: '', // 대표자명
  portalConnFlag: 'Y', // 협력업체포탈 접속 여부
  portalId: '', // 포탈 ID
  plantCds: '', // 관련사업장
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  portalPw: '',
  portalOriginalPw: '',
  plantNames: undefined
})
const editForm = ref<any>('')
const resetUrl = ref('')
const checkUrl = ref('')
const detailUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const saveable = ref(false)
const deleteable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
// const isReset = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const selectedVendorCd = ref('')

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.parentVendorCd,
  () => {
    if (props.parentVendorCd) {
      rowClick({ vendorCd: props.parentVendorCd })
    } else {
      addVendor()
    }
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
  detailUrl.value = selectConfig.mdm.cim.vendor.get.url
  checkUrl.value = selectConfig.mdm.cim.vendor.check.url
  insertUrl.value = transactionConfig.mdm.cim.vendor.insert.url
  updateUrl.value = transactionConfig.mdm.cim.vendor.update.url
  deleteUrl.value = transactionConfig.mdm.cim.vendor.delete.url
  resetUrl.value = transactionConfig.mdm.cim.vendor.reset.url
  // code setting
  dataeditable.value = false
  // list setting
}
function rowClick(row: any) {
  saveable.value = true
  deleteable.value = true
  updateMode.value = true
  selectedVendorCd.value = row.vendorCd
  $http({
    url: $format(detailUrl.value, selectedVendorCd.value),
    method: 'GET'
  }).then((_result: any) => {
    vendorData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
  })
}
function addVendor() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  vendorData.value = {
    vendorCd: '', // 업체코드
    vendorName: '', // 업체명
    vendorClassCd: null, // 업체분류 코드
    vendorTypeCd: null, // 업체유형 코드
    address: '', // 본사주소
    bizNo: '', // 사업자번호
    chargeDeptCd: '', // 담당부서 코드
    phoneNo: '', // 대표 전화번호
    email: '', // 대표 이메일
    chargeName: '', // 담당자명
    representName: '', // 대표자명
    portalConnFlag: 'Y', // 협력업체포탈 접속 여부
    portalId: '', // 포탈 ID
    plantCds: '', // 관련사업장
    useFlag: 'Y', // 사용여부
    vendorClassName: '',
    vendorTypeName: '',
    portalPw: '',
    portalOriginalPw: '',
    plantNames: ''
  }
  emits('isNew')
}
function reset() {
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  vendorData.value = {
    vendorCd: '', // 업체코드
    vendorName: '', // 업체명
    vendorClassCd: null, // 업체분류 코드
    vendorTypeCd: null, // 업체유형 코드
    address: '', // 본사주소
    bizNo: '', // 사업자번호
    chargeDeptCd: '', // 담당부서 코드
    phoneNo: '', // 대표 전화번호
    email: '', // 대표 이메일
    chargeName: '', // 담당자명
    representName: '', // 대표자명
    portalConnFlag: 'Y', // 협력업체포탈 접속 여부
    portalId: '', // 포탈 ID
    plantCds: '', // 관련사업장
    useFlag: 'Y', // 사용여부
    vendorClassName: '',
    vendorTypeName: '',
    portalPw: '',
    portalOriginalPw: '',
    plantNames: ''
  }
  emits('isNew')
}
function saveData() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          vendorData.value.regUserId = user.value.userId
          vendorData.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback() {
  message.requestSuccess()
  emits('searchDetail')
  if (saveType.value == 'POST') {
    reset()
    selectedVendorCd.value = ''
  }
}
// function resetPwd() {
//   message.confirm({
//     title: '확인',
//     message: '비밀번호를 초기화 하시겠습니까?',
//     type: 'info', // success / info / warning / error
//     // 확인 callback 함수
//     confirmCallback: () => {
//       vendorData.value.chgUserId = user.value.userId
//       isReset.value = !isReset.value
//     },
//     // 취소 callback 함수
//     cancelCallback: () => {}
//   })
// }
// function resetPwdCallback() {
//   message.alert({
//     title: '안내',
//     message: '초기비밀번호(환경설정값)로 초기화 되었습니다.',
//     type: 'success' // success / info / warning / error
//   })
// }
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
