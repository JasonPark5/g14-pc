<template>
  <q-form ref="editForm">
    <c-card title="기준정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="facility"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :disabled="disabled"
            :editable="editable"
            :required="true"
            label="시설명(차량번호)"
            name="facilityName"
            v-model:value="facility.facilityName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-radio
            :disabled="disabled"
            :editable="editable"
            :comboItems="useFlagItems"
            label="사용여부"
            name="useFlag"
            v-model:value="facility.useFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :disabled="disabled"
            :editable="editable"
            :required="true"
            label="시설관리번호"
            name="facilityNo"
            v-model:value="facility.facilityNo"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :disabled="disabled"
            :editable="editable"
            codeGroupCd="HCF_FACILITY_TYPE_CD"
            :required="true"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="hcfFacilityTypeCd"
            label="시설유형"
            v-model:value="facility.hcfFacilityTypeCd"
            @datachange="facilityTypeChange"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-task-target
            :editable="editable && !disabled"
            :customPopupParam="{ targetKey: 'process' }"
            multiple="multiple"
            label="단위공정"
            name="processCd"
            v-model:value="facility.processCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :disabled="disabled"
            :editable="editable"
            codeGroupCd="HCF_INSPECTION_CYCLE_CD"
            :required="true"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="hcfInspectionCycleCd"
            label="정기검사주기"
            v-model:value="facility.hcfInspectionCycleCd"
            @datachange="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :disabled="disabled"
            :editable="editable"
            label="최종검사일"
            name="lastRemunerationDate"
            v-model:value="facility.lastRemunerationDate"
            @datachange="datachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :disabled="true"
            :editable="editable"
            label="차기검사일"
            name="nextInspectionDate"
            v-model:value="facility.nextInspectionDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            :disabled="true"
            label="자체점검주기"
            name="selfCheckCycle"
            value="1주"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :disabled="true"
            :editable="editable"
            label="최종자체점검일"
            name="lastSelfCheckDate"
            v-model:value="facility.lastSelfCheckDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :disabled="true"
            :editable="editable"
            label="차기자체점검일"
            name="nextSelfCheckDate"
            v-model:value="facility.nextSelfCheckDate"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            :disabled="disabled"
            :required="true"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="facility.plantCd"
          />
        </div> -->
      </template>
    </c-card>

    <c-card title="유형별 상세" class="cardClassDetailForm">
      <template v-slot:card-description>
        <span style="font-size: 0.9em; color: tomato; margin-left: 10px">
          ※ {{ $language('시설유형에 따라 시설 상세정보를 입력하는 영역입니다.') }}
        </span>
      </template>
      <template v-slot:card-detail>
        <template v-if="facilityType1">
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :disabled="disabled"
              :editable="editable"
              :required="true"
              label="설치장소"
              name="installationPlace"
              v-model:value="facility.installationPlace"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              v-if="facilityType1_1"
              :disabled="disabled"
              :editable="editable"
              type="number"
              label="연간취급량(톤/년)"
              name="annualHandling"
              v-model:value="facility.annualHandling"
            />
            <c-text
              v-if="facilityType1_2"
              :disabled="disabled"
              :editable="editable"
              type="number"
              label="시설용량(㎥)"
              name="facilityCapacity"
              v-model:value="facility.facilityCapacity"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              :disabled="disabled"
              :editable="editable"
              label="설치일"
              name="installationDate"
              v-model:value="facility.installationDate"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :disabled="disabled"
              :editable="editable"
              label="방재설비"
              name="disasterPreventionEquipment"
              v-model:value="facility.disasterPreventionEquipment"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :disabled="disabled"
              :editable="editable"
              label="비고"
              name="remarks"
              v-model:value="facility.remarks"
            />
          </div>
        </template>
        <template v-if="facilityType2">
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              v-if="facilityType2_1"
              :disabled="disabled"
              :editable="editable"
              :required="true"
              label="운송방식"
              name="modeOfTransport"
              v-model:value="facility.modeOfTransport"
            />
            <c-text
              v-if="facilityType2_2"
              :disabled="disabled"
              :editable="editable"
              :required="true"
              label="운반방식"
              name="transportMethod"
              v-model:value="facility.transportMethod"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              v-if="facilityType2_1"
              :disabled="disabled"
              :editable="editable"
              type="number"
              label="탱크사양 (재질 및 용량(㎥, ton) 등)"
              name="tankSpecifications"
              v-model:value="facility.tankSpecifications"
            />
            <c-text
              v-if="facilityType2_2"
              :disabled="disabled"
              :editable="editable"
              type="number"
              label="운반용량(㎥, ton)"
              name="carryingCapacity"
              v-model:value="facility.carryingCapacity"
            />
          </div>
        </template>
        <template v-if="facilityType3">
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :disabled="disabled"
              :editable="editable"
              type="number"
              label="거리(km)"
              name="distance"
              v-model:value="facility.distance"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :disabled="disabled"
              :editable="editable"
              label="배관재질"
              name="pipeMaterial"
              v-model:value="facility.pipeMaterial"
            />
          </div>
        </template>
      </template>
    </c-card>
    <c-table
      ref="table"
      class="q-mt-sm"
      title="취급 유해화학물질 목록"
      :editable="editable && !disabled"
      :columns="grid.columns"
      :data="facility.hazardChems"
      :gridHeight="gridHeight"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      selection="multiple"
      rowKey="mdmChemMaterialName"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !disabled"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addHazardChem"
          />
          <c-btn
            v-if="editable && !disabled && facility.hazardChems?.length > 0"
            :disabled="!facility.hazardChems || facility.hazardChems.length === 0"
            label="제외"
            icon="remove"
            @btnClicked="deleteHazardChem"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { hazardFacilityType } from './hazardFacility'

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
  name: 'hazardFacilityInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
  param: {
    facilityCd: stringNull
    search: boolean
    isApprContent: boolean
  }
  isOld: boolean
  disabled: boolean
  facility: hazardFacilityType
  height?: stringNull
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
  param: () => {
    return {
      facilityCd: '',
      search: false,
      isApprContent: false
    }
  },
  facility: () => {
    return {
      plantCd: '', // 사업장코드
      facilityCd: '', // 시설 코드
      facilityNo: '', // 시설 관리번호
      facilityName: '', // 시설명
      processCd: '', // 공정코드
      hcfFacilityTypeCd: null, // 시설유형 코드
      hcfInspectionCycleCd: null, // 정기검사주기 코드
      lastRemunerationDate: '', // 최종보수일
      nextInspectionDate: '', // 차기검사일
      lastSelfCheckDate: '', // 최종자체점검일
      nextSelfCheckDate: '', // 차기자체점검일

      installationPlace: '', // 설치장소
      annualHandling: null, // 연간취급량(톤/년)
      facilityCapacity: null, // 시설용량(㎥)
      installationDate: '', // 설치일
      disasterPreventionEquipment: '', // 방재설비
      remarks: '', // 비고
      modeOfTransport: '', // 운송방식
      transportMethod: '', // 운반방식
      tankSpecifications: null, // 탱크 사양(재질 및 용량(㎥, ton)등)
      carryingCapacity: null, // 운반용량(㎥, ton)
      distance: null, // 거리(km)
      pipeMaterial: '', // 배관재질

      useFlag: 'Y', // 사용여부
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      hazardChems: [], // 빈도
      deleteHazardChems: [], // [삭제] 빈도
      selfCheckHistory: []
    }
  },
  disabled: false,
  isOld: true,
  height: 'auto'
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
  width: '75%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const useFlagItems = ref<Array<codeMasterType>>([])
const grid = ref({
  columns: [
    {
      required: true,
      name: 'mdmChemMaterialName',
      field: 'mdmChemMaterialName',
      label: '화학자재명',
      align: 'left',
      style: 'width:200px',
      type: 'text',
      sortable: true,
      fix: true
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      style: 'width:100px',
      type: 'text',
      sortable: true
    },
    {
      name: 'propertiesStateCd',
      field: 'propertiesStateCd',
      label: '성상',
      align: 'center',
      style: 'width:100px',
      type: 'select',
      codeGroupCd: 'PROPERTIES_STATE_CD',
      sortable: true
    },
    {
      name: 'usageName',
      field: 'usageName',
      label: '용도',
      align: 'center',
      style: 'width:100px',
      type: 'text',
      sortable: true
    },
    {
      required: true,
      name: 'substanceNames',
      field: 'substanceNames',
      label: '구성물질',
      type: 'textarea',
      align: 'left',
      style: 'width:300px',
      sortable: true
    },
    {
      name: 'toxic',
      field: 'toxic',
      label: '화학물질관리법',
      type: 'text',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'freezingPoint',
      field: 'freezingPoint',
      label: '어는점(℃)',
      type: 'number',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'meltingPoint',
      field: 'meltingPoint',
      label: '녹는점(℃)',
      type: 'number',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'boilPoint',
      field: 'boilPoint',
      label: '끓는점(℃)',
      type: 'number',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'firePoint',
      field: 'firePoint',
      label: '발화점(℃)',
      type: 'number',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'flashPoint',
      field: 'flashPoint',
      label: '인화점(℃)',
      type: 'number',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'fugacity',
      field: 'fugacity',
      label: '비산성(고체)',
      type: 'number',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'maxKeepAmount',
      field: 'maxKeepAmount',
      label: '최대보관량(t)',
      type: 'number',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'maxStorageAmount',
      field: 'maxStorageAmount',
      label: '최대저장량(t)',
      type: 'number',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'moleWeight',
      field: 'moleWeight',
      label: '분자량',
      type: 'number',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'specificGravity',
      field: 'specificGravity',
      label: '비중',
      type: 'number',
      style: 'width:80px',
      sortable: true
    }
  ],
  data: []
})
const detailUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const table = ref<any>(null)
const editForm = ref<any>(null)
// const apprBtn = ref<any>(null)
// const isApproval = ref(false)

/******************************
 * @Computed_선언
 *******************************/
// 제조.사용시설, 유해화학물질 저장시설, 유해화학물질 보관시설
const facilityType1 = computed(
  () =>
    ['HFT0000001', 'HFT0000005', 'HFT0000010', 'HFT0000015', 'HFT0000020', 'HFT0000025'].indexOf(
      props.facility.hcfFacilityTypeCd
    ) > -1
)
// 제조.사용시설
const facilityType1_1 = computed(
  () => ['HFT0000001'].indexOf(props.facility.hcfFacilityTypeCd) > -1
)
// 제조.사용시설, 유해화학물질 저장시설, 유해화학물질 보관시설
const facilityType1_2 = computed(
  () =>
    ['HFT0000005', 'HFT0000010', 'HFT0000015', 'HFT0000020', 'HFT0000025'].indexOf(
      props.facility.hcfFacilityTypeCd
    ) > -1
)
// 차량 운송시설 및 설비, 차량 운반시설 및 설비
const facilityType2 = computed(
  () => ['HFT0000030', 'HFT0000035'].indexOf(props.facility.hcfFacilityTypeCd) > -1
)
// 차량 운송시설 및 설비
const facilityType2_1 = computed(
  () => ['HFT0000030'].indexOf(props.facility.hcfFacilityTypeCd) > -1
)
// 차량 운반시설 및 설비
const facilityType2_2 = computed(
  () => ['HFT0000035'].indexOf(props.facility.hcfFacilityTypeCd) > -1
)
// 차량 운반시설 및 설비
const facilityType3 = computed(() => ['HFT0000040'].indexOf(props.facility.hcfFacilityTypeCd) > -1)
const disabled = computed(() => props.param.search)

// const approvalInfo = computed(() => {
//   return {
//     sysApprovalRequestId: props.facility.sysApprovalRequestId, // 결재요청번호
//     /**
//      * 결재상태코드
//      * ASC0000001	결재중
//      * ASC0000002	반려
//      * ASC9999999	결재완료
//      */
//     approvalStatusCd: props.facility.approvalStatusCd,
//     apprEditable: editable && props.isOld && !props.disabled, // 결재버튼 활성화 기준
//     param: props.facility, // 결재 param
//     approvalUrl: saveUrl.value, // 결재 url
//     isApproval: isApproval.value, // 결재 submit
//     approvalTypeCd: 'APTC001039', // 결재유형코드
//     approvalParamValue: {
//       // 결재상세화면 파라미터
//       facilityCd: props.facility.facilityCd,
//       isApprContent: true
//     },
//     approvalRequestName: props.facility.facilityName, // 결재요청명 (문서 title)
//     approvalConnId: props.facility.facilityCd // 결재연결용 업무일련번호 (문서 key)
//   }
// })
const gridHeight = computed(() => {
  let height =
    props.height && !Number.isNaN(Number(props.height.replace('px', '')))
      ? Number(props.height.replace('px', '')) - 390
      : 200
  if (height < 200) height = 200
  return height + 'px'
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
  detailUrl.value = selectConfig.env.facility.get.url
  saveUrl.value = transactionConfig.env.facility.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
}

/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function facilityTypeChange() {
  /**
   * 유형에 따라 입력해야하는 값이 변함으로
   * 유형이 변경될때 값을 리셋하는 작업이 필요
   */
  const resetData = {
    installationPlace: '', // 설치장소
    annualHandling: null, // 연간취급량(톤/년)
    facilityCapacity: null, // 시설용량(㎥)
    installationDate: '', // 설치일
    // lastRemunerationDate: '',  // 최종보수일
    disasterPreventionEquipment: '', // 방재설비
    remarks: '', // 비고
    modeOfTransport: '', // 운송방식
    transportMethod: '', // 운반방식
    tankSpecifications: null, // 탱크 사양(재질 및 용량(㎥, ton)등)
    carryingCapacity: null, // 운반용량(㎥, ton)
    distance: null, // 거리(km)
    pipeMaterial: '' // 배관재질
  }
  _.extend(props.facility, resetData)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function addHazardChem() {
  props.facility.hazardChems.splice(0, 0, {
    // mdmChemMaterialId: uid(),
    mdmChemMaterialName: '',
    casNo: '',
    propertiesStateName: '',
    usageName: '',
    substanceNames: '',
    toxic: '',
    freezingPoint: null,
    meltingPoint: null,
    boilPoint: null,
    firePoint: null,
    flashPoint: null,
    fugacity: null,
    maxKeepAmount: null,
    maxStorageAmount: null,
    moleWeight: null,
    specificGravity: null,
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function deleteHazardChem() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.facility.deleteHazardChems) props.facility.deleteHazardChems = []
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(props.facility.deleteHazardChems, {
          mdmChemMaterialName: item.mdmChemMaterialName
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.facility.deleteHazardChems.push(item)
      }
      props.facility.hazardChems = _.reject(props.facility.hazardChems, item)
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function save() {
  if (props.param.facilityCd) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.env.facility.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.env.facility.insert.url
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, props.facility.hazardChems)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.facility.regUserId = user.value.userId
          props.facility.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  if (!props.isOld) props.param.facilityCd = result.data.facilityCd
  message.requestSuccess()
  emits('getDetail')
}
// /******************************
//  * TODO (목적): 결재 관리
//  *******************************/
// function approvalFacility() {
//   editForm.value?.validate().then((_result: boolean) => {
//     if (_result && validTable(grid.value.columns, props.facility.hazardChems)) {
//       message.confirm({
//         title: '확인',
//         message: '결재요청 하기 전 입력된 값을 저장합니다.<br> 진행하시겠습니까?',
//         type: 'info', // success / info / warning / error
//         confirmCallback: () => {
//           props.facility.regUserId = user.value.userId
//           props.facility.chgUserId = user.value.userId
//           isApproval.value = !isApproval.value
//         },
//         cancelCallback: () => {}
//       })
//     } else message.validError()
//   })
// }
// function approvalFacilityCallback() {
//   apprBtn.value.apprRequestPop()
// }
// function getDetail() {
//   emits('getDetail')
// }
function datachange() {
  if (props.facility.lastRemunerationDate && props.facility.hcfInspectionCycleCd) {
    props.facility.nextInspectionDate = getAddYear(
      props.facility.lastRemunerationDate,
      props.facility.hcfInspectionCycleCd === 'HIC0000001' ? 1 : 2
    )
  } else props.facility.nextInspectionDate = null
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
