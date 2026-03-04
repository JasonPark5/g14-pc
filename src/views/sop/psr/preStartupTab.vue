<template>
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 tabvertical">
    <div class="float-right">
      <q-btn-group outline>
        <q-chip
          v-if="
            (!preStartupCheck.equipments || preStartupCheck.equipments.length === 0) &&
            Boolean(param.sopPrestartupCheckId)
          "
          class="no-border"
          style="margin-right: 5px !important"
          square
          outline
          color="red"
          icon="report"
          size="12px"
        >
          {{
            $language(
              '가동전점검표, 보고서는 하나 이상의 설비 점검표가 만들어져야 이용 가능합니다.'
            )
          }}
        </q-chip>
        <c-btn
          v-show="Boolean(param.sopPrestartupCheckId)"
          :disabled="!preStartupCheck.equipments || preStartupCheck.equipments.length === 0"
          label="가동전점검표"
          icon="print"
          @btnClicked="checklistPrint"
        />
        <c-btn
          v-show="Boolean(param.sopPrestartupCheckId)"
          :disabled="!preStartupCheck.equipments || preStartupCheck.equipments.length === 0"
          label="가동전안전점검보고서"
          icon="print"
          @btnClicked="checklistReportPrint"
        />
        <c-btn
          v-show="editInfo && !disabled && Boolean(param.sopPrestartupCheckId)"
          label="삭제"
          icon="remove"
          @btnClicked="removePreStartupCheck"
        />
        <c-btn
          v-show="editInfo && !disabled && Boolean(param.sopPrestartupCheckId)"
          :isSubmit="isComplete"
          :url="saveUrl"
          :param="preStartupCheck"
          mappingType="PUT"
          label="완료"
          icon="check"
          @beforeAction="completePreStartupCheck"
          @btnCallback="completeCallback"
        />
      </q-btn-group>
    </div>
    <c-tab type="vertical" :tabItems="tabItems" :height="tabHeight" v-model:value="tab">
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :key="tab.key"
          :param="param"
          :preStartupCheck="preStartupCheck"
          :research="research"
          :equipTab="equipTab"
          :editInfo="editInfo"
          :disabled="disabled"
          :contentHeight="contentHeight"
          @closePopup="closePopup"
          @setRegInfo="setRegInfo"
        />
      </template>
    </c-tab>
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
import { preStartupCheckType } from './preStartupReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'preStartupTab'
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
const emits = defineEmits(['closePopup', 'setRegInfo'])

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
  contentHeight: stringNull
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
const tab = ref('baseInfo')
const isComplete = ref(false)
const saveUrl = ref('')
const equipTab = ref('')
const detailUrl = ref('')
const checklistPrintUrl = ref('')
const checklistReportPrintUrl = ref('')
const deleteEquipUrl = ref('')
const deleteUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const editInfo = computed(() => {
  return editable.value && !props.param.isSearch
})
const isOld = computed(() => {
  return Boolean(props.param.sopPrestartupCheckId)
})
const disabled = computed(() => {
  // 점검완료인 경우 비활성화
  return props.preStartupCheck.psrCheckStatusCd === 'PCSC000005'
})
const tabItems = computed(() => {
  if (isOld.value) {
    return [
      {
        name: 'baseInfo',
        icon: 'edit',
        label: '기본정보',
        component: defineAsyncComponent(() => import(`./preStartupReviewInfo.vue`))
      },
      {
        name: 'ctoChecklist',
        icon: 'how_to_reg',
        label: '설비별 점검',
        component: defineAsyncComponent(() => import(`./preStartupReviewCheckList.vue`))
      }
    ]
  } else {
    return [
      {
        name: 'baseInfo',
        icon: 'edit',
        label: '기본정보',
        component: defineAsyncComponent(() => import(`./preStartupReviewInfo.vue`))
      }
    ]
  }
})
const retcomponent = computed(() => {
  return defineAsyncComponent(() => import(`./preStartupFacility.vue`))
})
const tabHeight = computed(() =>
  !isNaN(Number(props.contentHeight)) && Number(props.contentHeight) > 500
    ? Number(props.contentHeight) - 56 + 'px'
    : '500px'
)

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
  detailUrl.value = selectConfig.sop.psr.check.get.url
  checklistPrintUrl.value = selectConfig.sop.psr.check.checklistPrint.url
  checklistReportPrintUrl.value = selectConfig.sop.psr.check.checklistReportPrint.url
  deleteEquipUrl.value = transactionConfig.sop.psr.check.equipment.delete.url
  saveUrl.value = transactionConfig.sop.psr.check.update.url
  deleteUrl.value = transactionConfig.sop.psr.check.delete.url
  // code setting
  // list setting
  getPreStartupCheck()
}
function getPreStartupCheck() {
  if (props.param.sopPrestartupCheckId) {
    $http({
      url: $format(detailUrl.value, props.param.sopPrestartupCheckId),
      method: 'GET'
    }).then((_result: any) => {
      if (_result.data.prestartupStartDate && _result.data.prestartupEndDate) {
        _result.data.prestartupPeriod = [
          _result.data.prestartupStartDate,
          _result.data.prestartupEndDate
        ]
      }
      console.log(_result.data)
      _.extend(props.preStartupCheck, _result.data)
      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
      props.param.psrCheckStatusCd = _.clone(props.preStartupCheck.psrCheckStatusCd)
      if (props.preStartupCheck.equipments && props.preStartupCheck.equipments.length > 0) {
        equipTab.value = props.preStartupCheck.equipments[0].equipmentCd
        _.forEach(props.preStartupCheck.equipments, (item: any) => {
          item.name = item.equipmentCd
          item.label = item.equipmentName
          item.icon = 'precision_manufacturing'
          item.component = retcomponent
          item.key = uid()
        })
      }
    })
  }
}
function closePopup() {
  emits('closePopup')
}
function setRegInfo(_data: any) {
  emits('setRegInfo', _data)
}
function completePreStartupCheck() {
  if (!props.preStartupCheck.checkResultTotal) {
    message.alert({
      title: '안내',
      message: '점검결과종합이 입력되지 않았습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else if (!props.preStartupCheck.equipments || props.preStartupCheck.equipments.length === 0) {
    message.alert({
      title: '안내',
      message: '하나 이상의 점검표가 만들어져야 합니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    let isEquipComplete = true
    let isImprComplete = true
    let _message = '점검완료하시겠습니까?'
    _.forEach(props.preStartupCheck.equipments, (equip: any) => {
      if (equip.checkCompleteFlag !== 'Y') {
        isEquipComplete = false
        return false
      }

      _.forEach(equip.checkItems, (checkItem: any) => {
        if (
          _.findIndex(checkItem.improves, (impr: any) => {
            return impr.ibmStepCd !== 'IS00000020'
          }) > -1
        ) {
          isImprComplete = false
          return false
        }
      })
      if (!isImprComplete) {
        return false
      }
    })

    if (!isEquipComplete) {
      message.alert({
        title: '안내',
        message: '점검이 완료되지 않은 설비가 있습니다.',
        type: 'warning' // success / info / warning / error
      })
      return
    }
    if (!isImprComplete) {
      _message = '개선 진행중인 항목이 존재합니다. 점검완료하시겠습니까?'
    }
    message.confirm({
      title: '확인',
      message: _message,
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        props.preStartupCheck.chgUserId = user.value.userId
        props.preStartupCheck.psrCheckStatusCd = 'PCSC000005'

        props.preStartupCheck.prestartupStartDate = props.preStartupCheck.prestartupPeriod![0]
        props.preStartupCheck.prestartupEndDate = props.preStartupCheck.prestartupPeriod![1]

        if (props.preStartupCheck.equipments && props.preStartupCheck.equipments.length > 0) {
          props.preStartupCheck.equipments = _.filter(props.preStartupCheck.equipments, '')
        }
        isComplete.value = !isComplete.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function completeCallback(_result: any) {
  props.param.sopPrestartupCheckId = _result.data
  message.requestSuccess()
  getPreStartupCheck()
}
function removePreStartupCheck() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.sopPrestartupCheckId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function checklistPrint() {
  $http({
    url: $format(checklistPrintUrl.value, props.param.sopPrestartupCheckId),
    method: 'GET'
  }).then((_result: any) => {
    const windowObj = window.navigator as any
    const fileOrgNm =
      $language('가동전점검표') + '_' + props.preStartupCheck.checkName + '_' + getToday() + '.xlsx'
    const blob = base64ToBlob(_result.data)
    if (windowObj && windowObj.msSaveOrOpenBlob) {
      windowObj.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
function checklistReportPrint() {
  $http({
    url: $format(checklistReportPrintUrl.value, props.param.sopPrestartupCheckId),
    method: 'GET'
  }).then((_result: any) => {
    const windowObj = window.navigator as any
    const fileOrgNm =
      $language('가동전 안전점검 보고서') +
      '_' +
      props.preStartupCheck.checkName +
      '_' +
      getToday() +
      '.xlsx'
    const blob = base64ToBlob(_result.data)
    if (windowObj && windowObj.msSaveOrOpenBlob) {
      windowObj.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
