<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-md-12 col-lg-12">
        <c-card title="설비 기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <!-- <c-btn v-if="editable" label="QR코드 출력" icon="save_alt" @btnClicked="btnQrCode" /> -->
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="equipData"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveInfo"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-text
                :required="true"
                :editable="editable"
                label="설비관리번호"
                name="equipmentNo"
                v-model:value="equipData.equipmentNo"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-text
                :required="true"
                :editable="editable"
                label="설비명"
                name="equipmentName"
                v-model:value="equipData.equipmentName"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-task-target-tree
                :required="true"
                :editable="editable"
                :plantCd="equipData.plantCd"
                targetKey="equipClass"
                label="설비유형"
                name="equipmentTypeCd"
                v-model:value="equipData.equipmentTypeCd"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-plant
                :required="true"
                :disabled="isOld"
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="equipData.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <c-dept-multi
                :required="false"
                :editable="editable"
                :parentCheckDepts="equipData.managementDepts"
                :plantCd="equipData.plantCd"
                label="관리부서"
                name="managementDepts"
                v-model:value="equipData.managementDepts"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
              <c-task-target
                :multiple="true"
                :required="true"
                :editable="editable"
                :customPopupParam="{ targetKey: 'process' }"
                label="단위공정"
                name="subProcessCd"
                v-model:value="equipData.subProcessCd"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-1 col-lg-1">
              <c-text
                :required="true"
                :editable="editable"
                label="수량"
                name="amount"
                type="number"
                v-model:value="equipData.amount"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <c-card title="설치관련 정보" class="cardClassDetailForm" topClass="topcolor-blue">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <c-text
                :editable="editable"
                label="설비위치"
                name="equipmentLocation"
                v-model:value="equipData.equipmentLocation"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <c-datepicker
                :editable="editable"
                label="설치일"
                name="installDate"
                v-model:value="equipData.installDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <c-text
                :editable="editable"
                label="설치업체"
                name="installVendor"
                v-model:value="equipData.installVendor"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <c-datepicker
                :editable="editable"
                label="가동일"
                name="opertationDate"
                v-model:value="equipData.opertationDate"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <c-card title="설치상태 정보" class="cardClassDetailForm" topClass="topcolor-blue">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <c-text
                :editable="editable"
                label="검사합격번호"
                name="checkPassNo"
                v-model:value="equipData.checkPassNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <c-datepicker
                :editable="editable"
                label="합격일"
                name="checkPassDate"
                v-model:value="equipData.checkPassDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="폐기여부"
                name="discardFlag"
                v-model:value="equipData.discardFlag"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <c-datepicker
                :disabled="equipData.discardFlag !== 'Y'"
                :editable="editable"
                label="폐기일"
                name="discardDate"
                v-model:value="equipData.discardDate"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <c-card title="점검관련 정보" class="cardClassDetailForm" topClass="topcolor-blue">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="법정설비여부"
                name="lawEquipmentFlag"
                v-model:value="equipData.lawEquipmentFlag"
                @datachange="datachange"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-select
                :required="equipData.lawEquipmentFlag == 'Y'"
                :editable="editable"
                codeGroupCd="MDM_EQUIP_CYCLE_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="inspectionCycleCd"
                label="법정점검주기"
                v-model:value="equipData.inspectionCycleCd"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-select
                :editable="editable"
                codeGroupCd="MDM_EQUIP_CYCLE_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="selfCycleCd"
                label="자체점검주기"
                v-model:value="equipData.selfCycleCd"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-select
                :editable="false"
                codeGroupCd="MDM_EQUIP_GRADE_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="equipGradeCd"
                label="설비등급"
                v-model:value="equipData.equipGradeCd"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="예방정비여부"
                name="pmFlag"
                v-model:value="equipData.pmFlag"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-select
                :editable="editable"
                codeGroupCd="MDM_EQUIP_CYCLE_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="pmCycleCd"
                label="예방정비주기"
                v-model:value="equipData.pmCycleCd"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="운전정비여부"
                name="operFlag"
                v-model:value="equipData.operFlag"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="예측정비여부"
                name="predictiveFlag"
                v-model:value="equipData.predictiveFlag"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="고장정비여부"
                name="cmFlag"
                v-model:value="equipData.cmFlag"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
        <c-card title="법규관련 정보" class="cardClassDetailForm" topClass="topcolor-blue">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <c-multi-select
                :editable="editable"
                :isArray="false"
                codeGroupCd="RELATED_LAWS_CD"
                itemText="codeName"
                itemValue="code"
                label="관련 법규"
                name="relatedLaws"
                maxValues="3"
                v-model:value="equipData.relatedLaws"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="유해위험설비 여부"
                name="psmFlag"
                v-model:value="equipData.psmFlag"
              />
            </div>
            <div v-if="equipData.psmFlag == 'Y'" class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-select
                :required="equipData.psmFlag == 'Y'"
                :editable="editable"
                codeGroupCd="MDM_PSM_TYPE_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="psmTypeCd"
                label="유해위험설비 구분"
                v-model:value="equipData.psmTypeCd"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="유해위험기계기구 여부"
                name="hazardousFlag"
                v-model:value="equipData.hazardousFlag"
              />
            </div>
          </template>
        </c-card>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
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
import { equipPopupParamType, equipType } from './equipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: equipPopupParamType
  equipData: equipType
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
      equipmentCd: '',
      plantCd: '',
      psmFlag: ''
    }
  },
  equipData: () => {
    return {
      plantCd: null, // 사업장코드
      plantName: '', // 사업장
      equipmentTypeCd: null, // 설비유형 코드
      equipmentTypeName: '', // 설비유형명
      equipmentCd: '', // 설비코드
      equipmentNo: '', // 설비코드
      equipmentName: '', // 설비명
      mainProcessCd: '', // 주공정
      subProcessCd: '', // 부공정
      managementDepts: '', // 관리부서
      equipmentLocation: '', // 설비위치
      installDate: '', // 설치일자
      installVendor: '', // 설치업체
      opertationDate: '', // 가동일자
      checkPassNo: '', // 검사합격번호
      checkPassDate: '', // 합격일자
      discardFlag: 'N',
      discardDate: '', // 폐기일자
      psmFlag: 'N', // PSM 대상 여부
      psmTypeCd: null,
      amount: '', // 수량
      lawEquipmentFlag: 'N', // 법정설비 여부
      inspectionCycleCd: null, // 법정점검 주기
      selfCycleCd: null, // 자체점검 주기
      pmCycleCd: null, // 자체점검 주기
      pmFlag: 'N', // 예방정비 여부
      cmFlag: 'N', // 고장정비 여부
      predictiveFlag: 'N', // 예지정비 여부
      operFlag: 'N', // 운전정비 여부
      relatedLaws: '', // 관련법규
      recentInspectionDate: '', // 최근 점검일자
      outsourcingVendor: '', // 유지보수업체
      hazardousFlag: 'N',
      equipGradeCd: null,
      regUserId: '',
      chgUserId: ''
    }
  },
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
const popupOptions = ref<popupParamType>({
  width: '70%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const isSave = ref(false)
const mappingType = ref('POST')
const saveUrl = ref('')
const checkUrl = ref('')
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
  saveUrl.value = transactionConfig.mdm.equipment.info.insert.url
  checkUrl.value = selectConfig.mdm.equipment.check.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 저장 전 처리
 *******************************/
function saveInfo() {
  if (props.popupParam.equipmentCd) {
    saveUrl.value = transactionConfig.mdm.equipment.info.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.mdm.equipment.info.insert.url
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: $format(checkUrl.value, props.equipData.equipmentNo),
        method: 'GET'
      }).then((__result: any) => {
        if (props.equipData.equipmentCd || __result.data === 0) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              orderedPromise([{ func: setSaveValue }, { func: saveValue }])
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 시퀀스 아이디가 존재합니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 저장 전 저장값 셋팅
 *******************************/
function setSaveValue() {
  return new Promise((resolve) => {
    props.equipData.regUserId = user.value.userId
    props.equipData.chgUserId = user.value.userId
    props.equipData.psmTypeCd = props.equipData.psmFlag == 'N' ? null : props.equipData.psmTypeCd

    resolve(true)
  })
}
/******************************
 * TODO (목적): 저장 emit 처리
 *******************************/
function saveValue() {
  return new Promise((resolve) => {
    isSave.value = !isSave.value
    resolve(true)
  })
}
/******************************
 * TODO (목적): 저장 후 처리
 * @param (1): api 서버에서 회신하는 정보 (설비 정보)
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.psmFlag = props.equipData.psmFlag
  if (mappingType.value == 'POST') {
    props.popupParam.equipmentCd = result.data.equipmentCd
    emits('getDetail')
  } else {
    emits('getDetail')
  }
}
/******************************
 * TODO (목적): 법정설비 변경 후 처리
 *******************************/
function datachange() {
  if (props.equipData.lawEquipmentFlag === 'N') {
    props.equipData.inspectionCycleCd = null
  }
}
/******************************
 * TODO (목적): QR코드 팝업 표시
 *******************************/
// function btnQrCode() {
//   popupOptions.value.title = '설비 QR코드'
//   popupOptions.value.param = {
//     selectData: [props.equipData]
//   }
//   popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./equipmentQr.vue`)))
//   popupOptions.value.visible = true
//   popupOptions.value.closeCallback = closePopup
// }
// /******************************
//  * TODO (목적): QR코드 팝업 닫기
//  *******************************/
// function closePopup() {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
