<template>
  <q-form ref="editForm">
    <c-card class="cardClassDetailForm" title="상세">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="investigation"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="saveInvestigation"
            @btnCallback="saveInvestigationCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-text
            :required="true"
            :disabled="disabled"
            :editable="editable"
            label="조사계획명"
            name="investigationPlanName"
            v-model:value="investigation.investigationPlanName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-datepicker
            :required="true"
            :disabled="disabled"
            :editable="editable"
            type="year"
            default="today"
            label="년도"
            name="year"
            v-model:value="investigation.year"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-datepicker
            :required="true"
            :disabled="disabled"
            :editable="editable"
            :range="true"
            label="조사기간"
            name="period"
            v-model:value="investigation.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-field
            :required="true"
            :disabled="disabled"
            :editable="editable"
            :data="investigation"
            deptValue="deptCd"
            type="dept_user"
            label="담당자"
            name="userId"
            v-model:value="investigation.userId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-dept-multi
            :required="true"
            :disabled="disabled"
            :editable="editable"
            :parentCheckDepts="investigation.investigationDeptCd"
            label="조사부서"
            name="investigationDeptCd"
            v-model:value="investigation.investigationDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :disabled="disabled"
            :editable="editable"
            label="조사기관"
            name="agency"
            v-model:value="investigation.agency"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-plant
            :required="true"
            :disabled="isOld"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="investigation.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            autogrow
            label="비고"
            name="remark"
            v-model:value="investigation.remark"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-upload
            ref="fileUpload"
            :attachInfo="attachInfo"
            :editable="editable && !disabled"
            label="첨부파일"
          />
        </div>
      </template>
    </c-card>
  </q-form>
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
import { investigationType } from './investigation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'investigationPlanInfo'
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
const emits = defineEmits(['closePopup', 'keySetting'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    heaInvestigationPlanId: stringNull
    stepCd: stringNull
    searchProcess: any | null | undefined
  }
  investigation: investigationType
  attachInfo: attachSettingType
  disabled: boolean
  isOld: boolean
  contentHeight: string
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
      heaInvestigationPlanId: '',
      stepCd: '',
      searchProcess: {
        flag: '',
        isSearch: false
      }
    }
  },
  investigation: () => {
    return {
      heaInvestigationPlanId: '', // 근골격계 조사계획 일련번호
      plantCd: '', // 사업장코드
      investigationPlanName: '', // 조사계획명
      year: '', // 심사년도
      heaInvestigationStepCd: '', // 진행상태
      investigationStartDate: '', // 조사시작일
      investigationEndDate: '', // 조사종료일
      period: [],
      deptCd: '', // 담당자 부서
      userId: '', // 담당자 id
      investigationDeptCd: '', // 조사부서
      agency: '', // 조사기관
      remark: '', // 비고
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      sops: [], // 단위작업
      sopTable: []
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'HEA_INVESTIGATION_PLAN',
      taskKey: ''
    }
  },
  disabled: false,
  isOld: false,
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const isSave = ref(true)
const mappingType = ref('PUT')
const saveUrl = ref('')
const editForm = ref<any>(null)
const fileUpload = ref<any>(null)

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
  saveUrl.value = transactionConfig.hea.muscleSystem.investigationPlan.insert.url

  // code setting
  // list setting
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInvestigation() {
  if (props.isOld) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.hea.muscleSystem.investigationPlan.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.hea.muscleSystem.investigationPlan.insert.url
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.investigation.regUserId = user.value.userId
          props.investigation.chgUserId = user.value.userId
          props.investigation.investigationStartDate = props.investigation.period![0]
          props.investigation.investigationEndDate = props.investigation.period![1]
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
function saveInvestigationCallback(_result: any) {
  message.requestSuccess()
  props.attachInfo.taskKey = _result.data
  fileUpload.value.submitFile().finally(() => {
    emits('keySetting', _result.data)
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
