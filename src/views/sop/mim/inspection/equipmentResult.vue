<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
      <c-card title="설비 기본정보" :collapsed="true" class="cardClassDetailInfo">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && popupParam.noPlan === 'Y' && !updateMode && !disabled"
              label="선택"
              icon="add"
              @btnClicked="add"
            />
            <c-btn
              v-if="editable && updateMode && !disabled"
              :showLoading="false"
              label="완료"
              icon="save"
              color="blue"
              @btnClicked="resultComplete"
            />
            <c-btn
              v-if="editable && !disabled"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="result"
              :mappingType="saveType"
              label="저장"
              icon="save"
              @beforeAction="saveInspection"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <!-- <div v-if="editable && !result.equipmentCd" class="col-12">
            <c-label-text title="설비를 선택하세요." />
          </div> -->
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="사업장" :value="result.plantName" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="설비유형" :value="result.equipmentTypeName" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="설비코드" :value="result.equipmentCd" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="설비명" :value="result.equipmentName" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="이전점검일" :value="result.recentInspectionDate" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="점검주기" :value="result.inspectionCycleName" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="차기법정예정월" :value="result.nextMonth" />
          </div>
          <div v-if="editable" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <c-label-text title="관련법규" :value="result.relatedLawsName" />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
      <q-form ref="editForm">
        <c-card class="cardClassDetailForm" title="설비 점검결과" bgClass="">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                label="점검유형"
                :disabled="disabled"
                required
                codeGroupCd="MDM_CHECK_KIND_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="equipmentCheckKindCd"
                v-model:value="result.equipmentCheckKindCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-dept
                label="점검부서"
                :required="true"
                :disabled="disabled"
                v-model:value="result.checkDeptCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :required="true"
                :disabled="disabled"
                label="실제점검자"
                name="checkUserId"
                type="user"
                v-model:value="result.checkUserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                required
                :disabled="disabled"
                :editable="editable"
                label="실제점검일"
                name="checkDate"
                v-model:value="result.checkDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-task-target
                :disabled="disabled"
                :editable="editable"
                label="MOC번호"
                :customPopupParam="{ targetKey: 'moc' }"
                name="sopMocId"
                v-model:value="result.sopMocId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                codeGroupCd="MIM_CHECK_RESULT_CD"
                :editable="editable"
                :disabled="disabled"
                required
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="checkResultCd"
                label="점검결과"
                v-model:value="result.checkResultCd"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-plant :disabled="disabled" v-model:value="result.plantCd" />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-textarea
                :editable="editable"
                :disabled="disabled"
                label="점검결과 요약"
                name="checkResultSummary"
                v-model:value="result.checkResultSummary"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-tab
        type="tabcard"
        :height="tabHeight"
        :tabItems="tabItems"
        :inlineLabel="true"
        v-model:value="tab"
        align="left"
      >
        <template v-slot:default="tab">
          <component
            :is="tab.component"
            :result="result"
            :imprTabInfo="imprTabInfo"
            :research="research"
          />
        </template>
      </c-tab>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { equipPlanType } from './equipmentPlan'

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
  name: 'equipmentResult'
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
  popupParam: equipPlanPopupParamType
  contentHeight: stringNull
}
interface equipPlanPopupParamType {
  title: stringNull
  noPlan: stringNull
  multiple: boolean
  equipmentCd: stringNull
  minEquipmentCheckId: stringNull
}
const tab = ref('resultItemTab')
const tabItems = ref<Array<tabItemsType>>([
  {
    name: 'resultItemTab',
    icon: 'list',
    label: '설비별 점검항목',
    component: shallowRef(defineAsyncComponent(() => import(`./equipmentResultItemTab.vue`)))
  },
  {
    name: 'imprTab',
    icon: 'construction',
    label: '개선관리',
    component: shallowRef(defineAsyncComponent(() => import(`@views/common/ibm/imprTab.vue`)))
  }
])
const saveUrl = ref('')
const saveType = ref('POST')
const isSave = ref(false)
const insertUrl = ref('')
const updateUrl = ref('')
const getUrl = ref('')
const getResultItemUrl = ref('')
const title = ref('')
const completeUrl = ref('')
const updateMode = ref(false)
const editForm = ref<any>(null)
const research = ref({
  impr: '',
  item: ''
})

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
      title: '',
      noPlan: 'N',
      multiple: false,
      equipmentCd: '',
      minEquipmentCheckId: ''
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const result = ref<equipPlanType>({
  minEquipmentCheckId: '',
  plantCd: '',
  plantName: '',
  checkDeptCd: '',
  checkDeptName: '',
  checkUserId: '',
  checkUserName: '',
  sopMocId: '',
  sopMocName: '',
  equipmentCheckKindCd: null,
  equipmentCheckKindNm: '',
  checkStatusCd: '',
  checkScheduleUserName: '',
  checkScheduleUserId: '',
  checkScheduleDate: '',
  equipmentTypeCd: '',
  equipmentCd: '',
  equipmentName: '',
  inspectionCycleName: '',
  inspectionCycleCd: '',
  recentInspectionDate: '',
  relatedLaws: '',
  regUserId: '',
  chgUserId: '',
  noPlanResultEnrollFlag: 'N',
  checkResultCd: null,
  checkCompleteFlag: null,
  checkDate: ''
})
/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.popupParam.minEquipmentCheckId)
})
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.minEquipmentCheckId, //
    ibmTaskTypeCd: 'ITT0000055',
    ibmTaskUnderTypeCd: 'ITTU000080',
    requestContents: result.value.equipmentName,
    disabled: disabled.value,
    isOld: isOld.value,
    gridItem: {
      listUrl: selectConfig.sop.min.equipment.result.list.url,
      param: {
        minEquipmentCheckId: props.popupParam.minEquipmentCheckId
      },
      title: $language('점검결과별 개선사항 목록'),
      merge: [{ index: 0, colName: 'checkItemName' }],
      columns: [
        {
          name: 'checkItemName',
          field: 'checkItemName',
          label: '점검항목',
          align: 'center',
          style: 'width:180px',
          sortable: false,
          fix: true
        },
        {
          name: 'checkWayName',
          field: 'checkWayName',
          label: '검사방법',
          align: 'center',
          style: 'width:120px'
        },
        {
          name: 'decisionBasis',
          field: 'decisionBasis',
          label: '판정기준',
          align: 'left',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'checkCaution',
          field: 'checkCaution',
          label: '점검시 안전사항',
          align: 'left',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'checkResult',
          field: 'checkResult',
          label: '점검결과',
          align: 'left',
          style: 'width:180px',
          sortable: false
        },
        {
          name: 'judgmentResultTypeName',
          field: 'judgmentResultTypeName',
          label: '적합/부적합',
          align: 'center',
          style: 'width:80px',
          sortable: false,
          fix: true
        }
      ],
      research: research.value
    },
    gridOther: {
      title: $language('항목외 개선 목록')
    }
  }
})
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) && props.contentHeight > 400
    ? props.contentHeight - 260 + 'px'
    : '400px'
)
const disabled = computed(() => {
  return result.value.checkStatusCd === 'MCSC000015'
})
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => result.value.equipmentCheckKindCd,
  () => {
    if (!result.value.equipmentCheckKindCd || !result.value.equipmentTypeCd) {
      result.value.equipmentResultList = []
      return
    }
    $http({
      url: $format(
        getResultItemUrl.value,
        result.value.equipmentTypeCd,
        result.value.equipmentCheckKindCd
      ),
      method: 'GET'
    }).then((_result: any) => {
      result.value.equipmentResultList = _.clone(_result.data)
    })
  }
)
watch(
  () => result.value.equipmentCd,
  () => {
    if (!result.value.equipmentCheckKindCd || !result.value.equipmentTypeCd) {
      result.value.equipmentResultList = []
      return
    }
    $http({
      url: $format(
        getResultItemUrl.value,
        result.value.equipmentTypeCd,
        result.value.equipmentCheckKindCd
      ),
      method: 'GET'
    }).then((_result: any) => {
      result.value.equipmentResultList = _.clone(_result.data)
    })
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
  saveUrl.value = transactionConfig.sop.min.equipment.result.insert.url
  getUrl.value = selectConfig.sop.min.equipment.plan.get.url
  getResultItemUrl.value = selectConfig.sop.min.equipment.result.item.get.url
  insertUrl.value = transactionConfig.sop.min.equipment.result.insert.url
  updateUrl.value = transactionConfig.sop.min.equipment.result.update.url
  completeUrl.value = transactionConfig.sop.min.equipment.result.complete.url
  // code setting
  title.value = props.popupParam.title
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.minEquipmentCheckId) {
    $http({
      url: $format(getUrl.value, props.popupParam.minEquipmentCheckId),
      method: 'GET'
    }).then((_result: any) => {
      result.value = _result.data
      updateMode.value = true
    })
  }
}
function add() {
  // 초기에는 userId에 tempId를 부여
  popupOptions.value = getPopupOptions('equip', popupOptions.value, closeEquipmentPopup, {
    /** 원하는 parameter 정의 */
    type: 'single'
  })
}
function closeEquipmentPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    result.value.minEquipmentCheckId = ''
    result.value.plantCd = data[0].plantCd
    result.value.plantName = data[0].plantName
    ;(result.value.checkDeptCd = data[0].managementDepts),
      (result.value.checkDeptName = data[0].managementDeptName)
    result.value.checkStatusCd = 'MCSC000005'
    result.value.checkScheduleUserName = ''
    result.value.checkScheduleUserId = ''
    result.value.checkScheduleDate = ''
    result.value.equipmentTypeCd = data[0].equipmentTypeCd
    result.value.equipmentTypeName = data[0].equipmentTypeName
    result.value.equipmentCd = data[0].equipmentCd
    result.value.equipmentName = data[0].equipmentName
    result.value.inspectionCycleName = data[0].inspectionCycleName
    result.value.inspectionCycleCd = data[0].inspectionCycleCd
    result.value.recentInspectionDate = data[0].recentInspectionDate
    result.value.relatedLaws = data[0].relatedLaws
    result.value.regUserId = user.value.userId
    result.value.chgUserId = user.value.userId
    result.value.relatedLawsName = data[0].relatedLawsName
  }
}
function saveInspection() {
  saveType.value = props.popupParam.minEquipmentCheckId ? 'PUT' : 'POST'
  if (props.popupParam.noPlan === 'Y') result.value.noPlanResultEnrollFlag = 'Y'
  if (!result.value.equipmentCd) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.minEquipmentCheckId = result.data
  result.value.equipmentResultList = []
  getDetail()
}
function resultComplete() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '점검완료 하시겠습니까? (저장과 함께 완료처리가 됩니다.)',
        type: 'warning', // success / info / warning / error
        confirmCallback: () => {
          result.value.checkCompleteFlag = 'Y'
          $http({
            url: completeUrl.value,
            method: 'PUT',
            data: result.value
          }).then((_result: any) => {
            message.requestSuccess()
            getDetail()
          })
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
