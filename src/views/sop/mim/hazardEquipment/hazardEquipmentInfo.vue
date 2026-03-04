<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-select
                required
                type="edit"
                codeGroupCd="HHM_TYPE_CD"
                itemText="codeName"
                itemValue="code"
                name="machineryClassification"
                label="기계분류"
                v-model:value="equipInfo.machineryClassification"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                required
                :editable="editable"
                label="기계명"
                name="machineryName"
                v-model:value="equipInfo.machineryName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-task-target
                :editable="editable"
                :isObject="true"
                name="equipmentCd"
                label="기계관리번호"
                :customPopupParam="{ targetKey: 'equip' }"
                v-model:value="equipInfo.equipmentCd"
                @update:value="dataChange"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable"
                :disabled="true"
                label="item No"
                name="itemNo"
                v-model:value="equipInfo.itemNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-task-target
                :editable="editable"
                :customPopupParam="{ targetKey: 'process' }"
                label="단위공정"
                :multiple="true"
                name="subProcessCd"
                v-model:value="equipInfo.subProcessCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-dept-multi
                type="edit"
                required
                label="담당부서"
                name="departmentDeptCd"
                v-model:value="equipInfo.departmentDeptCd"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-plant
                required
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="equipInfo.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :editable="editable"
                label="신청인"
                type="user"
                name="departmentUserId"
                v-model:value="equipInfo.departmentUserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-checkbox
                :editable="editable"
                :isFlag="true"
                label="사용여부"
                name="useFlag"
                v-model:value="equipInfo.useFlag"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="설치상태 정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="equipInfo"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="saveInfo"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                type="date"
                :editable="editable"
                label="설치일"
                name="emplacementMonth"
                v-model:value="equipInfo.emplacementMonth"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :editable="editable"
                type="date"
                label="철거일"
                name="demolitionMonth"
                v-model:value="equipInfo.demolitionMonth"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="제조사"
                name="manufacturer"
                v-model:value="equipInfo.manufacturer"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :editable="editable"
                type="date"
                label="제조일"
                name="manufactDate"
                v-model:value="equipInfo.manufactDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                suffix="ton"
                type="number"
                :editable="editable"
                label="용량"
                name="volume"
                v-model:value="equipInfo.volume"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="설치장소"
                name="emplacementPlace"
                v-model:value="equipInfo.emplacementPlace"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="EWR NO."
                name="ewrNo"
                v-model:value="equipInfo.ewrNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3" />
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable"
                label="발생가능재해형태"
                name="possibleDisaster"
                v-model:value="equipInfo.possibleDisaster"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable"
                label="방호장치"
                name="protectDevice"
                v-model:value="equipInfo.protectDevice"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-text
                :editable="editable"
                label="비고"
                name="remark"
                v-model:value="equipInfo.remark"
              />
            </div>
          </template>
        </c-card>
      </div>
    </div>
    <c-card class="cardClassDetailForm" title="안전검사정보">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="edit"
            codeGroupCd="HAZARD_GRADE_CD"
            itemText="codeName"
            itemValue="code"
            name="gradeCd"
            label="등급"
            v-model:value="equipInfo.gradeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            required
            :comboItems="targetCdItems"
            type="edit"
            itemText="codeName"
            itemValue="code"
            :editable="editable"
            label="검사상태 여부"
            name="inspectionSubjectFlag"
            v-model:value="equipInfo.inspectionSubjectFlag"
            @datachange="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="edit"
            :disabled="!(equipInfo.inspectionSubjectFlag === 'Y')"
            codeGroupCd="MDM_CHECK_KIND_CD"
            itemText="codeName"
            itemValue="code"
            :editable="editable"
            label="검사종류"
            name="inspectionKindCd"
            v-model:value="equipInfo.inspectionKindCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            :disabled="!(equipInfo.inspectionSubjectFlag === 'Y')"
            type="edit"
            codeGroupCd="MDM_EQUIP_CYCLE_CD"
            itemText="codeName"
            itemValue="code"
            label="검사주기"
            name="inspectionCycle"
            v-model:value="equipInfo.inspectionCycle"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :editable="editable"
            label="검사증교부일"
            name="inspCertificateIssuanceDate"
            v-model:value="equipInfo.inspCertificateIssuanceDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :editable="editable"
            :range="true"
            label="유효기간"
            name="validPeriod"
            v-model:value="validPeriod"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            :editable="editable"
            label="합격번호"
            name="passNumber"
            v-model:value="equipInfo.passNumber"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-multi-select
            :editable="editable"
            :isArray="false"
            codeGroupCd="RELATED_LAWS_CD"
            itemText="codeName"
            itemValue="code"
            label="관련 법규"
            name="relatedLaws"
            maxValues="3"
            v-model:value="equipInfo.relatedLaws"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            :editable="editable"
            label="설계근거(정격하중)"
            name="esignBasisRatedLoad"
            v-model:value="equipInfo.esignBasisRatedLoad"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            :editable="editable"
            label="설계근거(종류)"
            name="esignBasisKind"
            v-model:value="equipInfo.esignBasisKind"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-textarea
            :editable="editable"
            label="검사면제사유"
            :rows="3"
            name="reasonExemptionInspection"
            v-model:value="equipInfo.reasonExemptionInspection"
          />
        </div>
      </template>
    </c-card>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-upload :attachInfo="attachInfo" :editable="editable" label="유해위험기계기구 인증서" />
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
import { equipInfoType } from './hazardEquipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardEquipmentInfo'
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
const emits = defineEmits(['getDetail', 'closePopup', 'changeStatus', 'saveCallback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    hhmHazardousMachineryId: stringNull
  }
  attachInfo: attachSettingType
  equipInfo: equipInfoType
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
  popupParam: () => {
    return {
      hhmHazardousMachineryId: ''
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'HAZARD_EQUIPMENT_INFO',
      taskKey: ''
    }
  },
  equipInfo: () => {
    return {
      hhmHazardousMachineryId: '',
      equipmentTypeCd: '',
      equipmentCd: '',
      equipmentNo: '',
      equipmentTypeName: '',
      equipmentName: '',
      plantCd: null,
      plantName: '',
      machineryClassification: null,
      machineryClassificationName: '',
      itemNo: '',
      inspectionKindCd: null,
      manufacturer: '',
      manufactDate: '',
      emplacementPlace: '',
      emplacementMonth: '',
      demolitionMonth: '',
      passNumber: '',
      ewrNo: '',
      amount: '',
      esignBasisRatedLoad: '',
      esignBasisKind: '',
      inspCertificateIssuanceDate: '',
      lastInspectionDate: '',
      inspectionSubjectFlag: null,
      inspectionCycle: null,
      nextInspectionDate: '',
      reasonExemptionInspection: '',
      machineryName: '',
      gradeCd: null,
      departmentDeptCd: '',
      departmentUserId: '',
      relatedLaws: '',
      remark: '',
      regUserId: '',
      chgUserId: '',
      subProcessCd: '',
      useFlag: 'Y',
      protectDevice: '',
      volume: '',
      validStartDate: '',
      validEndDate: '',
      possibleDisaster: '',
      hazardEquipmentHistoryModels: [],
      equipmentImproveModels: []
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
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const useFlagItems = ref<Array<codeMasterType>>([])
const targetCdItems = ref<Array<codeMasterType>>([])
const editForm = ref<any>(null)
const saveType = ref('POST')
const checkUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const updateUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const validPeriod = ref<any>([])

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
  saveUrl.value = transactionConfig.sop.hhm.hazard.check.insert.url
  checkUrl.value = selectConfig.sop.hhm.hazard.check.check.url
  insertUrl.value = transactionConfig.sop.hhm.hazard.check.insert.url
  updateUrl.value = transactionConfig.sop.hhm.hazard.check.update.url
  deleteUrl.value = transactionConfig.sop.hhm.hazard.check.delete.url
  // code setting
  targetCdItems.value = [
    { code: 'Y', codeName: $language('대상') },
    { code: 'N', codeName: $language('비대상') }
  ]
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
}
function saveInfo() {
  if (props.popupParam.hhmHazardousMachineryId) {
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: checkUrl.value,
        method: 'GET',
        params: props.equipInfo
      }).then((_result: any) => {
        if (_result.data > 0) {
          message.alert({
            title: '안내',
            message: '사업장 내 이미 존재하는 기계관리번호입니다.', // 사업장 내 이미 존재하는 기계관리번호입니다.
            type: 'warning' // success / info / warning / error
          })
          return
        } else {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              if (validPeriod.value && validPeriod.value.length > 0) {
                props.equipInfo.validStartDate = validPeriod.value[0]
                props.equipInfo.validEndDate = validPeriod.value[1]
              }
              props.equipInfo.regUserId = user.value.userId
              props.equipInfo.chgUserId = user.value.userId
              isSave.value = !isSave.value
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        }
      })
    } else {
      message.validError()
    }
  })
}
function dataChange(data: any) {
  props.equipInfo.equipmentCd = data.equipmentCd
  props.equipInfo.equipmentNo = data.equipmentNo
  props.equipInfo.machineryName = data.equipmentName
  props.equipInfo.amount = data.amount
  props.equipInfo.subProcessCd = data.subProcessCd
  props.equipInfo.departmentDeptCd = data.managementDepts
  props.equipInfo.relatedLaws = data.relatedLaws
}
function saveCallback(equipInfo: any) {
  message.requestSuccess()
  if (!props.popupParam.hhmHazardousMachineryId) {
    emits('changeStatus')
  }
  emits('saveCallback', equipInfo.data)
  props.attachInfo.taskKey = equipInfo.data
  props.attachInfo.isSubmit = uid()
}
function datachange() {
  if (!props.equipInfo.inspectionSubjectFlag || props.equipInfo.inspectionSubjectFlag === 'N') {
    props.equipInfo.inspectionKindCd = null
    props.equipInfo.inspectionCycle = null
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
