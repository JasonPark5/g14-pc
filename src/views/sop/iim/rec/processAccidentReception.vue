<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-card title="공정사고 기본정보" class="cardClassDetailInfo">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-show="
                accidentInfo.investigationFlag === 'Y' &&
                (accidentInfo.accidentStatusCd === 'ISPC000003' ||
                  accidentInfo.accidentStatusCd === 'ISPC000002') &&
                !disabled
              "
              :isSubmit="isComplete1"
              :url="completeUrl"
              :param="accidentInfo"
              mappingType="PUT"
              label="조사완료"
              icon="check"
              @beforeAction="completeAccident('ING')"
              @btnCallback="completeCallback"
            />
            <span
              v-if="
                isInvest &&
                accidentInfo.accidentStatusCd === 'ISPC000002' &&
                (standardInfo.reportTypeCd === 'IRC0000005' ||
                  standardInfo.reportTypeCd === 'IRC0000001')
              "
              color="#C10015"
            >
              {{
                $language(
                  '※ 종결처리시 상단탭에서 중간, 최종보고를 선택하여 추가를 할 수 있습니다.'
                )
              }}
            </span>
            <c-btn
              v-show="isInvest && !disabled && accidentInfo.accidentStatusCd === 'ISPC000002'"
              :isSubmit="isComplete2"
              :url="completeUrl"
              :param="accidentInfo"
              mappingType="PUT"
              label="종결처리"
              icon="check"
              @beforeAction="completeAccident('END')"
              @btnCallback="completeCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-3">
            <c-label-text title="사고번호" :value="standardInfo.accidentNo" />
          </div>
          <div class="col-3">
            <c-label-text title="사고명" :value="standardInfo.accidentName" />
          </div>
          <div class="col-3">
            <c-label-text title="사고종류" :value="standardInfo.accidentKindName" />
          </div>
          <div class="col-3">
            <c-label-text title="사고등급" :value="standardInfo.accidentGradeName" />
          </div>
          <div class="col-3">
            <c-label-text title="발생일시" :value="standardInfo.occurrenceDate" />
          </div>
          <div class="col-3">
            <c-label-text title="발생부서" :value="standardInfo.occurrenceDeptName" />
          </div>
          <div class="col-3">
            <c-label-text title="발생형태 대분류" :value="standardInfo.occurrenceModeLargeName" />
          </div>
          <div class="col-3">
            <c-label-text title="발생형태 중분류" :value="standardInfo.occurrenceModeSmallName" />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
        <template v-slot:default="tab">
          <component
            :is="tab.component"
            :key="tab.key"
            :popupParam="param"
            :accidentInfo="accidentInfo"
            @currentStep="currentStep"
            @getDetail="getDetail"
          />
        </template>
      </c-tab>
    </div>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import {
  processAccidentInvestiationType,
  processAccidentPopupParamType,
  processAccidentType
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
  name: 'processAccidentReception'
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
const standardInfo = ref<processAccidentType>({
  iimAccidentId: '',
  accidentNo: '',
  accidentName: '',
  accidentKindName: '',
  accidentGradeName: '',
  occurrenceDate: '',
  occurrenceDeptName: '',
  occurrenceModeLargeName: '',
  occurrenceModeSmallName: '',
  accidentStatusCd: '',

  reportTypeCd: null
})
const accidentInfo = ref<processAccidentInvestiationType>({
  iimAccidentId: '',
  investigationFlag: '',
  investigationDate: '',
  investigationPlan: '',
  reportDate: '',
  occurrenceCause: '',
  accidentDamageHistory: '',
  emergencyMeasures: '',
  materialLossHistory: '',
  materialLossAmount: '',
  enviromentLeakInformation: '',
  enviromentImpactHistory: '',
  accidentStatusCd: '',

  accidentInvestigationTeamModelList: [],
  deleteAccidentInvestigationTeamModelList: [],
  accidentVictimModelList: [],
  deleteAccidentVictimModelList: []
})
const tab = ref('processAccidentReceptionPlan')
const completeUrl = ref('')
const getStdUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const getUrl = ref('')
const isInvest = ref(false)
const isComplete1 = ref(false)
const isComplete2 = ref(false)
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  const numHeight = props.height ? Number(_.replace(props.height, 'px', '')) : 600
  return numHeight - 212 + 'px'
})
const disabled = computed(() => props.param.stepCd === 'ISPC000005')
const tabItems = computed(() => [
  {
    key: uid(),
    name: 'processAccidentReceptionPlan',
    icon: 'person_outline',
    label: '조사계획',
    component: defineAsyncComponent(() => import(`./processAccidentReceptionPlan.vue`))
  },
  {
    key: uid(),
    name: 'processAccidentReceptionResult',
    icon: 'report',
    label: '조사결과',
    component: defineAsyncComponent(() => import(`./processAccidentReceptionResult.vue`))
  }
])
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.count,
  () => {
    getStdInfo()
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
  getStdUrl.value = selectConfig.sop.iim.accident.process.get.url
  getUrl.value = selectConfig.sop.iim.accident.process.investigation.get.url
  deleteUrl.value = transactionConfig.sop.iim.accident.process.delete.url
  insertUrl.value = transactionConfig.sop.iim.accident.process.investigation.insert.url
  completeUrl.value = transactionConfig.sop.iim.accident.process.investigation.complete.url
  // code setting
  // list setting
  getStdInfo()
  getDetail()
}
/******************************
 * TODO (목적): 기본정보 조회
 *******************************/
function getStdInfo() {
  if (props.param.iimAccidentId) {
    $http({
      url: $format(getStdUrl.value, props.param.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      _.forEach(_result.data, (_item) => {
        standardInfo.value = _result.data
      })
    })
  }
}
/******************************
 * TODO (목적): 사고 조사 정보
 *******************************/
function getDetail() {
  if (props.param.iimAccidentId) {
    $http({
      url: $format(getUrl.value, props.param.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      accidentInfo.value = _result.data
      if (_result.data.investigationDate) {
        accidentInfo.value.investigationDate = _result.data.investigationDate.split(',')
      }
      _.forEach(accidentInfo.value.accidentVictimModelList, (_item) => {
        if (_item.expectTreatmentDate) {
          _item.expectTreatmentDate = _item.expectTreatmentDate.split(',')
        }
      })
    })
  }
}
/******************************
 * TODO (목적): 조사완료/종결처리 완료
 *******************************/
function completeAccident(type: string) {
  let _message = ''
  if (type === 'ING') {
    _message = '조사완료'
  } else {
    _message = '종결처리'
  }
  message.confirm({
    title: '확인',
    message: _message + ' 하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      if (accidentInfo.value.investigationDate) {
        accidentInfo.value.investigationDate = accidentInfo.value.investigationDate.join()
      }
      if (accidentInfo.value.accidentVictimModelList) {
        _.forEach(accidentInfo.value.accidentVictimModelList, (_item) => {
          if (_item.expectTreatmentDate)
            _item.expectTreatmentDate = _item.expectTreatmentDate.join()
        })
      }
      if (type === 'ING') {
        accidentInfo.value.accidentStatusCd = 'ISPC000004'
      } else {
        accidentInfo.value.accidentStatusCd = 'ISPC000005'
      }
      accidentInfo.value.regUserId = user.value.userId
      accidentInfo.value.chgUserId = user.value.userId
      if (type === 'ING') {
        isComplete1.value = !isComplete1.value
      } else {
        isComplete2.value = !isComplete2.value
      }
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 조사완료/종결처리 완료 콜백
 *******************************/
function completeCallback() {
  message.requestSuccess()
  if (accidentInfo.value.investigationDate) {
    accidentInfo.value.investigationDate = accidentInfo.value.investigationDate.split(',')
  }
  if (accidentInfo.value.accidentVictimModelList) {
    _.forEach(accidentInfo.value.accidentVictimModelList, (_item) => {
      if (_item.expectTreatmentDate) {
        _item.expectTreatmentDate = _item.expectTreatmentDate.split(',')
      }
    })
  }
  if (accidentInfo.value.accidentStatusCd) {
    emits('emitStep', {
      name: 'currentStep',
      param: accidentInfo.value.accidentStatusCd
    })
    emits('emitStep', {
      name: 'setReportTab',
      param: {
        stepCd: accidentInfo.value.accidentStatusCd,
        iimAccidnetId: props.param.iimAccidentId
      }
    })
  }
}
/******************************
 * TODO (목적): 스텝 업데이트
 *******************************/
function currentStep() {
  if (accidentInfo.value.accidentStatusCd) {
    emits('emitStep', {
      name: 'currentStep',
      param: accidentInfo.value.accidentStatusCd
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
