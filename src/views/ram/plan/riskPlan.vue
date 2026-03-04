<template>
  <div>
    <div class="col float-right">
      <q-btn-group outline>
        <c-btn
          v-show="editable && !deleteDisabled && isOld"
          label="삭제"
          icon="remove"
          @btnClicked="removePlan"
        />
        <c-btn
          v-show="editable && isOld && !disabled"
          label="지난 위험성평가 재검토"
          icon="history"
          @btnClicked="reCheckRisk"
        />
        <c-btn
          v-show="editable && !disabled2"
          :isSubmit="isComplete"
          :url="completeUrl"
          :param="assessPlan"
          mappingType="PUT"
          label="완료"
          icon="check"
          @beforeAction="completePlan"
          @btnCallback="completePlanCallback"
        />
      </q-btn-group>
    </div>
    <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :key="tab.key"
          :assessPlan="assessPlan"
          :attachInfo="attachInfo"
          :searchFlag="searchFlag"
          :statusFlag="statusFlag"
          :vendorFlag="param.vendorFlag"
          :isNew="param.isNew"
          :disabled="disabled"
          :disabled2="disabled2"
          @loadAssess="loadAssess"
          @saveCallback="saveCallback"
          @research="research"
        />
      </template>
    </c-tab>
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
import { assessPlanType } from '../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskPlan'
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
const emits = defineEmits(['emitStep', 'research'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
    vendorFlag: boolean
    ramTechniqueCd: stringNull
    isNew: stringNull
    teams: Array<any>
    delTeams: Array<any>
    planUpdateBtnData: any | null | undefined
  }
  height: stringNull
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
      ramRiskAssessmentPlanId: '',
      ramStepCd: '',
      vendorFlag: false,
      isNew: null,
      ramTechniqueCd: '',
      teams: [], // 평가팀 목록
      delTeams: [],
      planUpdateBtnData: {
        title: '계획',
        flag: false,
        research: '',
        planResearch: ''
      }
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
const tab = ref('planInfo')
const assessPlan = ref<assessPlanType>({
  ramRiskAssessmentPlanId: '', // 평가 일련번호
  plantCd: '', // 사업장 코드
  ramTechniqueCd: null, // 평가기법 코드_HAZOP/4m/JSA/CHECKLIST
  ramAssessTypeCd: null, // 평가구분_최초/정기/수시
  assessmentName: '', // 평가명
  assessmentStartDate: '', // 평가시작일
  assessmentEndDate: '', // 평가종료일
  assessmentPeriod: [],
  assessmentYear: '', // 평가년도
  ramStepCd: '', // 평가 진행단계 코드
  assessmentManageDeptCd: '', // 평가주관 부서 코드
  assessmentManageUserId: '', // 평가주관 담당자 ID
  ramMatrixId: null, // 위험메트릭스 번호
  sopMocId: '', // MOC 일련번호
  remark: '', // 상세내용
  workArea: '', // 작업지역
  regUserId: '', // 작성자 ID
  regUserName: '', // 작성자 ID
  regDtStr: '',
  reviewUserId: '', // 검토자 ID
  reviewDate: '', // 검토일
  approvalUserId: '', // 승인자 ID
  approvalDate: '', // 승인일
  vendorCd: '',
  sopConstructionId: '',
  chgUserId: '', // 수정자 ID
  teams: [], // 평가팀 목록
  delTeams: [],
  occasions: [], // 수시 변경/추가 내역 목록
  conferences: [], // 회의 목록
  relatedDocuments: [], // 관련자료 목록
  processes: [] // 대상공정 목록
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'RISK_PLAN',
  taskKey: ''
})
const searchFlag = ref({
  value: ''
}) as any
const statusFlag = ref({
  value: ''
}) as any
const detailUrl = ref('')
const completeUrl = ref('')
const deleteUrl = ref('')
const loadUrl = ref('')
const recheckSaveUrl = ref('')
const isComplete = ref(false)
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  let numHeight = props.height ? Number(_.replace(props.height, 'px', '')) : 600
  if ((editable.value && !disabled.value) || btnEditable.value) {
    numHeight = numHeight - 26
  }
  return numHeight + 'px'
})
const tabItems = computed(() => {
  if (
    (props.param.ramTechniqueCd === 'RT00000020' || props.param.ramTechniqueCd === 'RT00000025') &&
    props.param.isNew === 'Y'
  ) {
    return [
      {
        key: uid(),
        name: 'planInfo',
        icon: 'edit',
        label: '평가계획',
        disabled: false,
        component: defineAsyncComponent(() => import(`./riskPlanInfo.vue`))
      },
      {
        key: uid(),
        name: 'targetProcess',
        icon: 'category',
        label: !props.param.vendorFlag ? '대상공정' : '대상작업',
        component: defineAsyncComponent(() => import(`./riskTargetProcess.vue`)),
        disabled: props.param.ramRiskAssessmentPlanId ? false : true
      },
      {
        key: uid(),
        name: 'riskHazardStatus',
        icon: 'view_list',
        label: '유해위험요인<br>파악현황',
        component: defineAsyncComponent(() => import(`./riskHazardStatus.vue`)),
        disabled: props.param.ramRiskAssessmentPlanId ? false : true,
        ramTechniqueCd: props.param.ramTechniqueCd
      },
      {
        key: uid(),
        name: 'team',
        icon: 'checklist',
        label: '회의 및<br/>관련자료',
        component: defineAsyncComponent(() => import(`./riskAnalysisTeam.vue`)),
        disabled: props.param.ramRiskAssessmentPlanId ? false : true
      }
    ]
  } else {
    return [
      {
        key: uid(),
        name: 'planInfo',
        icon: 'edit',
        label: '평가계획',
        disabled: false,
        component: defineAsyncComponent(() => import(`./riskPlanInfo.vue`))
      },
      {
        key: uid(),
        name: 'targetProcess',
        icon: 'category',
        label: !props.param.vendorFlag ? '대상공정' : '대상작업',
        component: defineAsyncComponent(() => import(`./riskTargetProcess.vue`)),
        disabled: props.param.ramRiskAssessmentPlanId ? false : true
      },
      {
        key: uid(),
        name: 'team',
        icon: 'checklist',
        label: '회의 및<br/>관련자료',
        component: defineAsyncComponent(() => import(`./riskAnalysisTeam.vue`)),
        disabled: props.param.ramRiskAssessmentPlanId ? false : true
      }
    ]
  }
})
const isOld = computed(() => {
  return Boolean(assessPlan.value.ramRiskAssessmentPlanId)
})
const deleteDisabled = computed(() => {
  return assessPlan.value.ramStepCd === 'RRS0000015'
})
const disabled = computed(() => {
  return assessPlan.value.ramStepCd === 'RRS0000015'
})
const disabled2 = computed(() => {
  return assessPlan.value.ramStepCd !== 'RRS0000001' || !assessPlan.value.ramRiskAssessmentPlanId
})
// const isEnvSafDept = computed(() => {
//   return _.indexOf(auths.value, 'SAGI000021') > -1 || user.value.empNo === 'admin'
// })
const btnEditable = computed(() => {
  return (
    editable.value &&
    assessPlan.value.ramStepCd === 'RRS0000010' &&
    Boolean(assessPlan.value.ramRiskAssessmentPlanId)
  )
})
const techCheck = computed(() => {
  return false
  // HAZOP, CHARM만 기능 비활성화
  // return assessPlan.value.ramTechniqueCd === 'RT00000001'
  //   || assessPlan.value.ramTechniqueCd === 'RT00000030'
})
const riskValid = computed(() => {
  let _riskValid = {}
  if (props.param.ramTechniqueCd === 'RT00000001') {
    // HAZOP
    _riskValid = {
      list: 'drawNodes',
      cols: ['nodeNo'],
      nolist: $language('대상공정에 도면&노드가 입력되지 않았습니다.'),
      riskTarget: $language('도면&노드')
    }
  } else if (props.param.ramTechniqueCd === 'RT00000005') {
    // K-PSR
    _riskValid = {
      list: 'drawNodes',
      cols: ['nodeNo'],
      nolist: $language('대상공정에 도면&노드가 입력되지 않았습니다.'),
      riskTarget: $language('도면&노드')
    }
  } else if (props.param.ramTechniqueCd === 'RT00000010') {
    // Check-list
    _riskValid = {
      list: 'targets',
      cols: ['checkItemName'],
      nolist: $language('대상공정에 평가대상이 입력되지 않았습니다.'),
      riskTarget: $language('평가대상')
    }
  }
  // else if (props.param.ramTechniqueCd === 'RT00000015') {
  //   // JRA
  //   _riskValid = {
  //     list: 'sops',
  //     cols: ['jobName', 'jobStepName', 'riskHazardName'],
  //     nolist: $language('대상공정에 SOP가 입력되지 않았습니다.'),
  //     riskTarget: $language('SOP')
  //   }
  // } else if (props.param.ramTechniqueCd === 'RT00000020') {
  //   // KRAS
  //   _riskValid = {
  //     list: 'scenarios',
  //     cols: ['riskHazardName'],
  //     nolist: $language('대상공정에 SOP가 입력되지 않았습니다.'),
  //     riskTarget: $language('SOP')
  //   }
  // }
  // else if (props.param.ramTechniqueCd === 'RT00000025') {
  //   // 4M
  //   _riskValid = {
  //     list: 'fmScenarios',
  //     cols: ['riskHazardName', 'ram4mRiskHazardClassName'],
  //     nolist: $language('대상공정에 유해위험요인이 입력되지 않았습니다.'),
  //     riskTarget: $language('유해위험요인')
  //   }
  // }
  else if (props.param.ramTechniqueCd === 'RT00000030') {
    // CHARM
    _riskValid = {
      list: 'charmResultScenarios',
      cols: [],
      nolist: $language('대상공정에 화학자재 파악이 되지 않았습니다.'),
      riskTarget: $language('화학자재')
    }
  } else if (props.param.ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법
    _riskValid = {
      list: 'thirdScenarios',
      cols: ['riskHazardQuestionName'],
      nolist: $language('대상공정에 평가대상 파악이 되지 않았습니다.'),
      riskTarget: $language('평가대상')
    }
  }
  return _riskValid as any
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.param.planUpdateBtnData.planResearch,
  () => {
    getDetail()
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
  detailUrl.value = selectConfig.ram.assessPlan.get.url
  completeUrl.value = transactionConfig.ram.assessPlan.complete.url
  deleteUrl.value = transactionConfig.ram.assessPlan.delete.url
  loadUrl.value = transactionConfig.ram.assessPlan.load.url
  recheckSaveUrl.value = transactionConfig.ram.assessPlan.recheck.url
  // code setting
  // list setting
  getDetail()
}
function research() {
  statusFlag.value.value = uid()
  emits('emitStep', {
    name: 'research',
    param: {
      place: 'plan'
    }
  })
}
/******************************
 * TODO (목적): 상세내용 조회
 *******************************/
function getDetail() {
  if (props.param.ramRiskAssessmentPlanId) {
    $http({
      url: $format(detailUrl.value, props.param.ramRiskAssessmentPlanId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(assessPlan.value, _result.data)
      assessPlan.value.assessmentPeriod =
        assessPlan.value.assessmentStartDate && assessPlan.value.assessmentEndDate
          ? [assessPlan.value.assessmentStartDate, assessPlan.value.assessmentEndDate]
          : []
      attachInfo.value.taskKey = assessPlan.value.ramRiskAssessmentPlanId
      searchFlag.value.value = uid()
    })
  } else {
    assessPlan.value.assessmentYear = getThisYear()
    assessPlan.value.assessmentManageUserId = user.value.userId
    assessPlan.value.assessmentManageDeptCd = user.value.deptCd
    assessPlan.value.regUserId = user.value.userId
    assessPlan.value.regUserName = user.value.userName
    assessPlan.value.regDtStr = getTodayDateTime()
  }
  assessPlan.value.ramTechniqueCd = props.param.ramTechniqueCd
}
/******************************
 * TODO (목적): 재검토 팝업 오픈
 *******************************/
function reCheckRisk() {
  /**
   * 재검토
   *
   *  - 지난 위험성평가에서 진행한 유해위험요인에 대해서 재검토 진행
   *  - 위험성평가 한 개 이상 선택
   *  - 대상 공정 포함 아래 정보 summary되어 추가
   */
  popupOptions.value.title = '위험성평가 재검토 검색'
  popupOptions.value.param = {
    ramRiskAssessmentPlanId: assessPlan.value.ramRiskAssessmentPlanId,
    ramTechniqueCd: assessPlan.value.ramTechniqueCd,
    vendorFlag: props.param.vendorFlag,
    actionFlag: false
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/reCheckAssessmentPop.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '90%'
  popupOptions.value.closeCallback = closeRecheckPopup
}
/******************************
 * TODO (목적): 재검토 팝업 닫기 Callback
 *******************************/
function closeRecheckPopup(_data: any, _summaryData: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const filteredArr = _data.reduce((acc: any, current: any) => {
      const x = acc.find(
        (item: any) =>
          item.ramRiskAssessmentPlanId === current.ramRiskAssessmentPlanId &&
          item.processCd === current.processCd
      )
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])
    const _recheckData = [] as any
    _.forEach(_summaryData, (_item1) => {
      _.forEach(filteredArr, (_item2) => {
        if (
          _item1.ramRiskAssessmentPlanId === _item2.ramRiskAssessmentPlanId &&
          _item1.processCd === _item2.processCd
        ) {
          _recheckData.push(_item1)
        }
      })
    })

    const _ramRiskAssessmentItems = [] as any
    _.forEach(filteredArr, (item) => {
      _ramRiskAssessmentItems.push({
        ramRiskAssessmentPlanId: item.ramRiskAssessmentPlanId,
        processCd: item.processCd
      })
    })

    $http({
      url: recheckSaveUrl.value,
      method: 'POST',
      data: {
        ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId,
        ramTechniqueCd: props.param.ramTechniqueCd,
        regUserId: user.value.userId,
        recheckData: _recheckData,
        ramRiskAssessmentPlanIds: _.map(filteredArr, 'ramRiskAssessmentPlanId'),
        ramRiskAssessmentItems: _ramRiskAssessmentItems
      }
    }).then(
      () => {
        message.requestSuccess()
        getDetail()
      },
      () => message.validError()
    )
  }
}
/******************************
 * TODO (목적): 위험성평가 내용 load 이벤트
 *******************************/
function loadAssess(_ramRiskAssessmentPlanId: any) {
  $http({
    url: loadUrl.value,
    method: 'POST',
    data: {
      ramRiskAssessmentPlanId: _ramRiskAssessmentPlanId,
      ramTechniqueCd: props.param.ramTechniqueCd
    }
  }).then(
    (_result: any) => {
      message.requestSuccess()
      saveCallback(_result.data)
    },
    () => message.validError()
  )
}
/******************************
 * TODO (목적): 저장 후 callback 이벤트
 *******************************/
function saveCallback(_data: any) {
  props.param.ramRiskAssessmentPlanId = _data
  emits('emitStep', {
    name: 'keySetting',
    param: _data
  })
  tabItems.value[1].disabled = false
  tabItems.value[2].disabled = false
  getDetail()
}
/******************************
 * TODO (목적): 계획 완료
 *******************************/
function completePlan() {
  // 평가팀이 구성되었는지?
  // 회의를 진행했는지?
  // 대상공정을 지정했는지?
  // 대상공정별 도면/노드가 하나 이상 지정되었는지?
  let isProgress = true
  // if (!assessPlan.value.teams || assessPlan.value.teams.length === 0) {
  //   isProgress = false
  //   message.alert({
  //     title: '안내',
  //     message: '평가팀이 구성되지 않았습니다.',
  //     type: 'warning' // success / info / warning / error
  //   })
  // }
  if (!assessPlan.value.processes || assessPlan.value.processes.length === 0) {
    isProgress = false
    message.alert({
      title: '안내',
      message: '지정된 대상공정이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(assessPlan.value.processes, (_process: any) => {
      if (!_process.assessUserId) {
        isProgress = false
        message.alert({
          title: '안내',
          message:
            $language('대상공정에 상세정보가 입력되지 않았습니다.') +
            '[' +
            _process.processName +
            ']',
          type: 'warning' // success / info / warning / error
        })
        return false
      }
      if (props.param.ramTechniqueCd !== 'RT00000025') {
        if (!_process[riskValid.value.list] || _process[riskValid.value.list].length === 0) {
          isProgress = false
          message.alert({
            title: '안내',
            message: riskValid.value.nolist + '[' + _process.processName + ']',
            type: 'warning' // success / info / warning / error
          })
          return false
        } else {
          _.forEach(_process[riskValid.value.list], (_risk: any) => {
            if (_risk.editFlag === 'C' || _risk.editFlag === 'U') {
              isProgress = false
              message.alert({
                title: '안내',
                message:
                  $language(
                    '아직 입력 중인 정보가 있습니다. 입력을 마무리 한 후 저장하신 다음 이용하시기 바랍니다.'
                  ) +
                  '[' +
                  riskValid.value.riskTarget +
                  ']',
                type: 'warning' // success / info / warning / error
              })
              return false
            } else if (riskValid.value.cols && riskValid.value.cols.length > 0) {
              _.forEach(riskValid.value.cols, (_col: any) => {
                if (!_risk[_col]) {
                  isProgress = false
                  message.alert({
                    title: '안내',
                    message:
                      $language('정보가 입력되지 않은 행이 있습니다.') +
                      '[' +
                      riskValid.value.riskTarget +
                      ']',
                    type: 'warning' // success / info / warning / error
                  })
                  return false
                }
              })
            }
            if (!isProgress) {
              return false
            }
          })
          if (!isProgress) {
            return false
          }
        }
      }
    })

    if (isProgress) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          assessPlan.value.chgUserId = user.value.userId
          assessPlan.value.ramStepCd = 'RRS0000010'

          isComplete.value = !isComplete.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    }
  }
}

/******************************
 * TODO (목적): 계획 완료 callback
 *******************************/
function completePlanCallback() {
  message.requestSuccess()
  getDetail()
  // stepper 이동
  emits('emitStep', {
    name: 'stepBystep',
    param: assessPlan.value.ramStepCd
  })
}

/******************************
 * TODO (목적): 계획 삭제
 *******************************/
function removePlan() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    // TODO : 필요시 추가하세요.
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, assessPlan.value.ramRiskAssessmentPlanId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('emitStep', {
          name: 'closePopup'
        })
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
