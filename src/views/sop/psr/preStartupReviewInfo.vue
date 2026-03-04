<template>
  <q-form ref="editForm">
    <c-card title="가동전점검 상세" class="cardClassDetailForm no-margin">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editInfo && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="preStartupCheck"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="savePreStartupCheck"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
          <c-text
            :required="true"
            :editable="editInfo"
            :disabled="disabled"
            label="점검명"
            name="checkName"
            v-model:value="preStartupCheck.checkName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2">
          <c-select
            :required="true"
            :editable="editInfo"
            :disabled="disabled"
            codeGroupCd="PSR_EQUIPMENT_STATUS_CD"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="psrEquipmentStatusCd"
            label="설비상태"
            v-model:value="preStartupCheck.psrEquipmentStatusCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2">
          <c-select
            :required="true"
            codeGroupCd="PSR_CHECK_PERIOD_CD"
            :disabled="disabled"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="psrCheckPeriodCd"
            label="점검시기"
            v-model:value="preStartupCheck.psrCheckPeriodCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2">
          <c-datepicker
            required
            :range="true"
            :editable="editInfo"
            :disabled="disabled"
            label="기간"
            name="prestartupPeriod"
            v-model:value="preStartupCheck.prestartupPeriod"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-moc
            :editable="editInfo"
            :disabled="disabled"
            :isSubmit="saveCallData"
            :document="preStartupCheck"
            :documentId="param.sopPrestartupCheckId"
            documentTitle="checkName"
            mocRelatedTaskCd="RT00000015"
            label="MOC번호"
            name="sopMocId"
            v-model:value="preStartupCheck.sopMocId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2">
          <c-field
            :required="true"
            :editable="editInfo"
            :disabled="disabled"
            :plantCd="preStartupCheck.plantCd"
            type="user"
            label="점검총책임자"
            name="checkCancarrierId"
            v-model:value="preStartupCheck.checkCancarrierId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2">
          <c-dept
            :required="true"
            :editable="editInfo"
            :disabled="disabled"
            type="edit"
            label="점검부서"
            name="checkDeptCd"
            v-model:value="preStartupCheck.checkDeptCd"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-2">
          <c-plant
            :required="true"
            :disabled="disabled"
            :editable="editInfo"
            type="edit"
            name="plantCd"
            v-model:value="preStartupCheck.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
          <c-textarea
            :editable="editInfo"
            :disabled="disabled"
            :rows="5"
            label="점검목적"
            name="checkPurpose"
            v-model:value="preStartupCheck.checkPurpose"
          />
        </div>
        <div class="col-6">
          <c-textarea
            :editable="editInfo"
            :disabled="disabled"
            :rows="5"
            label="점검결과종합"
            name="checkResultTotal"
            v-model:value="preStartupCheck.checkResultTotal"
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
import { preStartupCheckType } from './preStartupReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'preStartupReviewInfo'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    sopPrestartupCheckId: stringNull
    psrCheckStatusCd: stringNull
    isSearch: boolean
  }
  research: {
    impr: stringNull
    item: stringNull
  }
  preStartupCheck: preStartupCheckType
  editInfo: boolean
  disabled: boolean
  contentHeight: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      sopPrestartupCheckId: '',
      psrCheckStatusCd: '',
      isSearch: false
    }
  },
  research: () => {
    return {
      impr: '',
      item: ''
    }
  },
  preStartupCheck: () => {
    return {
      sopPrestartupCheckId: '', // 가동전점검 일련 번호
      plantCd: null, // 사업장코드
      checkName: '', // 점검명
      prestartupPeriod: [], // 기간
      prestartupStartDate: '', // 계획 시작일
      prestartupEndDate: '', // 계획 종료일
      checkPurpose: '', // 점검 목적
      psrEquipmentStatusCd: null, // 설비 상태
      checkDeptCd: null, // 점검부서
      sopMocId: '', // MOC 일련번호
      checkCancarrierId: '', // 점검 책임자
      checkResultTotal: '', // 점검결과 종합
      psrCheckStatusCd: '', // 진행 단계
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      equipments: [],
      deleteEquipments: []
    }
  },
  editInfo: false,
  disabled: false,
  contentHeight: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const saveCallData = ref('')
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
  saveUrl.value = transactionConfig.sop.psr.check.insert.url
  deleteUrl.value = transactionConfig.sop.psr.check.delete.url
  // code setting
  if (!props.preStartupCheck.checkCancarrierId)
    props.preStartupCheck.checkCancarrierId = user.value.userId
  // list setting
}
function savePreStartupCheck() {
  if (props.param.sopPrestartupCheckId) {
    saveUrl.value = transactionConfig.sop.psr.check.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.psr.check.insert.url
    mappingType.value = 'POST'
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.preStartupCheck.regUserId = user.value.userId
          props.preStartupCheck.chgUserId = user.value.userId

          props.preStartupCheck.prestartupStartDate = props.preStartupCheck.prestartupPeriod![0]
          props.preStartupCheck.prestartupEndDate = props.preStartupCheck.prestartupPeriod![1]

          // if (props.preStartupCheck.equipments && props.preStartupCheck.equipments.length > 0) {
          //   props.preStartupCheck.equipments = _.filter<Array<equipmentsType>>(
          //     props.preStartupCheck.equipments,
          //     {  }
          //   )
          // }
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
  props.param.sopPrestartupCheckId = _result.data
  saveCallData.value = uid()
  message.requestSuccess()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
