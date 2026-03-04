<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-5">
      <q-form ref="editForm1">
        <c-card title="조치내용 상세" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <component
                :is="relationTableInfo.component"
                :key="relationTableInfo.key"
                :taskParam="relationTableInfo.taskParam"
                :disabled="!Boolean(popupParam.sopImprovementId)"
              />
              <c-btn
                v-show="imprEditable && Boolean(popupParam.sopImprovementId)"
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
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveImpr"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <c-select
                :disabled="true"
                :editable="imprEditable"
                codeGroupCd="IBM_TASK_TYPE_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                label="업무"
                name="ibmTaskTypeCd"
                v-model:value="impr.ibmTaskTypeCd"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <c-plant
                :editable="imprEditable"
                :required="true"
                type="edit"
                name="plantCd"
                v-model:value="impr.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <c-text
                :editable="imprEditable"
                :disabled="true"
                label="요청부서/이름/요청일"
                name="request"
                v-model:value="request"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <c-checkbox
                :editable="imprEditable"
                :isFlag="true"
                :trueLabel="$language('업체')"
                :falseLabel="$language('부서')"
                trueValue="V"
                falseValue="D"
                label="조치주체"
                name="actionFlag"
                v-model:value="impr.actionFlag"
                @datachange="changeAction"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <c-dept
                v-if="impr.actionFlag === 'D'"
                :required="impr.actionFlag === 'D'"
                :editable="imprEditable"
                type="edit"
                label="조치부서"
                name="actionDeptCd"
                v-model:value="impr.actionDeptCd"
              />
              <c-task-target
                v-else-if="impr.actionFlag === 'V'"
                :editable="imprEditable"
                :required="impr.actionFlag === 'V'"
                :customPopupParam="{ targetKey: 'vendor' }"
                label="조치업체"
                name="actionVendorCd"
                v-model:value="impr.actionVendorCd"
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
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <c-text
                :editable="imprEditable"
                label="관련공사"
                name="sopConstructionId"
                v-model:value="impr.sopConstructionId"
              />
            </div>
            <div class="col-12">
              <c-textarea
                :editable="imprEditable"
                :required="true"
                autogrow
                label="제목"
                name="ibmTitle"
                v-model:value="impr.ibmTitle"
              />
            </div>
            <div class="col-12">
              <c-textarea
                :editable="imprEditable"
                :required="true"
                autogrow
                label="조치내용"
                name="actionContents"
                v-model:value="impr.actionContents"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-7">
      <q-form ref="editForm2">
        <c-card title="조치 사진" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-12">
              <c-upload
                :isPhoto="true"
                :editable="imprEditable"
                :attachInfo="attachBeforeInfo"
                label="개선 전 사진"
              />
            </div>
            <div class="col-12">
              <c-upload
                :isPhoto="true"
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
import { uid } from 'quasar'
import { imprImmPopupType, imprImmType } from './impr'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'imprImmDetail'
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
const emits = defineEmits(['closePopup', 'getImpList'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: imprImmPopupType
  returnData: returnDataType
}
interface returnDataType {
  col1: stringNull
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
      sopImprovementId: '',
      ibmTaskTypeCd: '',
      ibmTaskUnderTypeCd: '',
      requestContents: '',
      relationTableKey: '',
      vendorCd: ''
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
const impr = ref<imprImmType>({
  sopImprovementId: '', // 개선 일련번호
  plantCd: '', // 사업장 코드
  ibmClassCd: '',
  ibmTaskTypeCd: '', // 업무분류코드
  ibmTaskUnderTypeCd: '',
  ibmTitle: '', // 제목
  request: '',
  actionFlag: 'D',
  sopConstructionId: '',
  improveRequestDeptCd: '', // 개선요청부서
  improveRequestDeptName: '', // 개선요청부서명
  improveRequestUserId: '', // 개선요청자
  improveRequestUserName: '', // 개선요청자명
  improveRequestContents: '', // 개선요청내용
  ibmStepCd: '', // 개선진행단계
  relationTableKey: '', // 관련테이블 키
  relationVendor: '', // 관련업체_기술
  actionScheduleDate: '', // 조치예정일
  actionCompleteRequestDate: '', // 조치완료 요청일
  reviewCompleteRequestDate: '', // 검토완료 요청일
  actionCompleteDate: '', // 조치완료일
  actionDeptCd: '', // 조치부서
  actionVendorCd: '', // 조치업체
  actionContents: '', // 조치내용_조치부서에서
  reviewContents: '', // 요청부서 조치결과 검토_요청부서에서
  actionCompleteCheckUserId: '', // 조치완료 확인자_부서장 또는 공장장
  actionCompleteCheckFlag: '', // 조치완료 확인자 확인 여부
  requestRejectReason: '', // 요청취소사유
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  regDt: ''
})
const attachBeforeInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'IBM_BEFORE',
  taskKey: ''
})
const attachAfterInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'IBM_AFTER',
  taskKey: ''
})
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const isDelete = ref(false)
const mappingType = ref('POST')
const editForm1 = ref<any>(null)
const editForm2 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const request = computed(() => {
  return (
    impr.value.improveRequestDeptName +
    ' / ' +
    impr.value.improveRequestUserName +
    ' / ' +
    impr.value.regDt
  )
})
const disabled = computed(() => props.popupParam.isSearch)
const imprEditable = computed(() => editable.value && !disabled.value)
const relationTableInfo = computed(() => {
  return {
    component: defineAsyncComponent(() => import(`./imprRelationTag.vue`)),
    key: uid(),
    taskParam: impr.value
  }
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
  detailUrl.value = selectConfig.sop.ibm.improve.get.url
  saveUrl.value = transactionConfig.sop.ibm.improve.update.url
  deleteUrl.value = transactionConfig.sop.ibm.improve.delete.url
  // code setting
  if (props.popupParam.vendorCd) {
    impr.value.actionFlag = 'V'
    impr.value.actionVendorCd = props.popupParam.vendorCd
    impr.value.actionDeptCd = null
  }
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 개선 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.sopImprovementId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopImprovementId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(impr.value, _result.data)
      attachBeforeInfo.value.taskKey = _.clone(impr.value.sopImprovementId)
      attachAfterInfo.value.taskKey = _.clone(impr.value.sopImprovementId)
      props.returnData.col1 = impr.value
    })
    saveUrl.value = transactionConfig.sop.ibm.improve.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.ibm.improve.insert.url
    mappingType.value = 'POST'

    impr.value.plantCd = user.value.plantCd
    impr.value.actionDeptCd = user.value.deptCd
    impr.value.actionCompleteDate = getToday()
    impr.value.ibmClassCd = 'IC00000005'
    impr.value.ibmStepCd = 'IS00000020'
    impr.value.ibmTaskTypeCd = props.popupParam.ibmTaskTypeCd
    impr.value.ibmTaskUnderTypeCd = props.popupParam.ibmTaskUnderTypeCd
    impr.value.improveRequestDeptCd = user.value.deptCd
    impr.value.improveRequestDeptName = user.value.deptName
    impr.value.improveRequestUserId = user.value.userId
    impr.value.improveRequestUserName = user.value.userName
    impr.value.regDt = getToday()
    impr.value.regUserId = user.value.userId
    impr.value.relationTableKey = props.popupParam.relationTableKey
    if (props.popupParam.requestContents) {
      impr.value.ibmTitle =
        props.popupParam.requestContents.replace(/^[\s\uFEFF\xA0]+/gi, '') + '_' + getToday()
    }
  }
}
// 요청&접수 상세 저장
function saveImpr() {
  editForm1.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          impr.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  props.popupParam.sopImprovementId = result.data
  attachBeforeInfo.value.isSubmit = uid()
  attachAfterInfo.value.isSubmit = uid()
  message.requestSuccess()
  getDetail()
}
// 삭제
function removeImpr() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      deleteUrl.value = $format(
        transactionConfig.sop.ibm.improve.delete.url,
        props.popupParam.sopImprovementId
      )
      isDelete.value = !isDelete.value
    },
    cancelCallback: () => {}
  })
}
function removeCallback() {
  message.requestSuccess()
  emits('closePopup', props.returnData, 'delete')
}
function changeAction(value: any) {
  if (value === 'D') impr.value.actionVendorCd = null
  else if (value === 'V') impr.value.actionDeptCd = null
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
