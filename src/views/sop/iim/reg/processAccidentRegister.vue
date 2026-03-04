<template>
  <div>
    <div class="col float-right">
      <q-btn-group outline>
        <c-btn
          v-show="accidentInfo.accidentStatusCd === 'ISPC000001' && !disabled"
          :isSubmit="isComplete"
          :url="completeUrl"
          :param="accidentInfo"
          mappingType="PUT"
          label="완료"
          icon="check"
          @beforeAction="completeAccident"
          @btnCallback="completeCallback"
        />
      </q-btn-group>
    </div>
    <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="param"
          :accidentInfo="accidentInfo"
          :height="tabHeight"
          @getDetail="getDetail"
          @setReportTab="setReportTab"
        />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import {
  processAccidentPopupParamType,
  processAccidentType,
  processAccidentVictimType
} from '../processAccident'

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
  name: 'processAccidentRegister'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: processAccidentPopupParamType
  height: stringNull
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
      iimAccidentId: '',
      stepCd: '',
      count: 0
    }
  },
  height: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const completeUrl = ref('')
const isComplete = ref(false)
const insertUrl = ref('')
const deleteUrl = ref('')
const updateUrl = ref('')
const getUrl = ref('')
const tab = ref('processAccidentRegisterInfo')
const accidentInfo = ref<processAccidentType>({
  iimAccidentId: '',
  accidentTypeCd: '',
  plantCd: '',
  processCd: '',
  processName: '',
  accidentNo: '',
  accidentName: '',
  accidentStatusCd: '',
  reportUserId: '',
  reportDate: '',
  accidentKindCd: '',
  accidentGradeCd: null,
  occurrenceDate: '',
  occurrenceDeptCd: '',
  occurrenceLocation: '',
  weather: '',
  emergencyMeasures: '',
  overviewAccidentSituation: '',
  occurrenceModeLargeCd: null,
  occurrenceModeSmallCd: null,
  humanDamage: '',
  directCause: '',
  indirectCause: '',
  openning: '',
  injurious: '',
  materialDamageHistory: '',
  humanDamageHistory: '',
  toxicFlag: 'N',
  accidentVictimModelList: [], // 관련 사고자
  deleteAccidentVictimModelList: [], // 사고자 삭제 모델
  accidentMaterialModelList: [], // 관련설비 및 물질
  emergencyList: [], // 비상조치계획서
  damageClassCd: null,
  woundCd: null
})
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  props.height ? Number(_.replace(props.height, 'px', '')) - 20 + 'px' : '680px'
)
const disabled = computed(
  () =>
    Boolean(!accidentInfo.value.accidentStatusCd) ||
    accidentInfo.value.accidentStatusCd === 'ISPC000005'
)
const tabItems = computed(() => [
  {
    key: uid(),
    disabled: false,
    name: 'processAccidentRegisterInfo',
    icon: 'edit',
    label: '사고정보',
    component: defineAsyncComponent(() => import(`./processAccidentRegisterInfo.vue`))
  },
  {
    key: uid(),
    disabled: false,
    name: 'processDegreeDamage',
    icon: 'how_to_reg',
    label: '피해정도',
    component: defineAsyncComponent(() => import(`./processDegreeDamage.vue`))
  },
  {
    key: uid(),
    disabled: false,
    name: 'processRelationPicture',
    icon: 'camera_enhance',
    label: '사고관련 사진',
    component: defineAsyncComponent(() => import(`./processRelationPicture.vue`))
  },
  {
    key: uid(),
    disabled: false,
    name: 'processAccidentEquipment',
    icon: 'checklist',
    label: '사고설비 <br/>및 물질',
    component: defineAsyncComponent(() => import(`./processAccidentEquipment.vue`))
  },
  {
    key: uid(),
    disabled: false,
    name: 'processAcidentEmergencyPlan',
    icon: 'manage_search',
    label: '관련 비상조치계획서',
    component: defineAsyncComponent(() => import(`./processAcidentEmergencyPlan.vue`))
  },
  {
    key: uid(),
    disabled: false,
    name: 'processAccidentRisk',
    icon: 'manage_search',
    label: '위험성 평가',
    component: defineAsyncComponent(() => import(`./processAccidentRisk.vue`))
  }
])
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
  getUrl.value = selectConfig.sop.iim.accident.process.get.url
  insertUrl.value = transactionConfig.sop.iim.accident.process.insert.url
  updateUrl.value = transactionConfig.sop.iim.accident.process.update.url
  deleteUrl.value = transactionConfig.sop.iim.accident.process.delete.url
  completeUrl.value = transactionConfig.sop.iim.accident.process.complete.url
  // code setting
  if (!props.param.iimAccidentId) {
    tabItems.value[1].disabled = true
    tabItems.value[2].disabled = true
    tabItems.value[3].disabled = true
    tabItems.value[4].disabled = true
    tabItems.value[5].disabled = true
  }
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 사고 조회 등록 완료
 *******************************/
function getDetail() {
  if (props.param.iimAccidentId) {
    $http({
      url: $format(getUrl.value, props.param.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      accidentInfo.value = _result.data
      _.forEach(accidentInfo.value.accidentVictimModelList, (_item: processAccidentVictimType) => {
        if (_item.expectTreatmentDate) {
          _item.expectTreatmentDate = _item.expectTreatmentDate.split(',')
        }
      })
      tabItems.value[1].disabled = false
      tabItems.value[2].disabled = false
      tabItems.value[3].disabled = false
      tabItems.value[4].disabled = false
      tabItems.value[5].disabled = false
    })
  }
}
/******************************
 * TODO (목적): 사고보고서 등록 완료
 *******************************/
function completeAccident() {
  message.confirm({
    title: '확인',
    message: '사고등록 하시겠습니까? (저장과 함께 등록됩니다.)',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      accidentInfo.value.accidentStatusCd = 'ISPC000002'
      _.forEach(accidentInfo.value.accidentVictimModelList, (_item: any) => {
        if (_item.expectTreatmentDate) _item.expectTreatmentDate = _item.expectTreatmentDate.join()
      })
      accidentInfo.value.regUserId = user.value.userId
      accidentInfo.value.chgUserId = user.value.userId

      isComplete.value = !isComplete.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 사고보고서 등록 완료 콜백
 *******************************/
function completeCallback() {
  message.requestSuccess()
  _.forEach(accidentInfo.value.accidentVictimModelList, (_item: any) => {
    if (_item.expectTreatmentDate) {
      _item.expectTreatmentDate = _item.expectTreatmentDate.split(',')
    }
  })
  if (accidentInfo.value.accidentStatusCd) {
    emits('emitStep', {
      name: 'currentStep',
      param: accidentInfo.value.accidentStatusCd
    })
    emits('emitStep', {
      name: 'setReportTab',
      param: { stepCd: accidentInfo.value.accidentStatusCd }
    })
  }
}
/******************************
 * TODO (목적): 사고보고서 이름 변경
 *******************************/
function setReportTab(groupId: string) {
  emits('emitStep', {
    name: 'setReportTab',
    param: { groupId: groupId, stepCd: 'ISPC000001' }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
