<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="updateMode && !disabled && editable"
                  label="작업환경측정결과 업로드"
                  icon="assignment"
                  @btnClicked="openExcelUploader"
                />
                <c-btn
                  v-if="popupParam.workMeasurementPlanId && !disabled && editable"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable && popupParam.workMeasurementPlanId"
                  :url="completeUrl"
                  :isSubmit="isComplete"
                  :param="workMeasure"
                  mappingType="PUT"
                  :label="disabled ? '완료취소' : '완료'"
                  icon="check"
                  @beforeAction="disabled ? completeData(2) : completeData(1)"
                  @btnCallback="completeCallback"
                />
                <c-btn
                  v-if="!disabled && editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="workMeasure"
                  :mappingType="mappingType"
                  label="기본정보 저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  required
                  :editable="editable && !disabled"
                  label="측정기관"
                  name="measPlaceName"
                  v-model:value="workMeasure.measPlaceName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-datepicker
                  :editable="false"
                  type="year"
                  label="측정년도"
                  name="measYear"
                  v-model:value="workMeasure.measYear"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-select
                  type="edit"
                  :editable="false"
                  codeGroupCd="WORK_MEAS_QUARTER_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="상/하반기"
                  name="measQuarter"
                  v-model:value="workMeasure.measQuarter"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  :editable="editable && !disabled"
                  type="date"
                  label="측정기간"
                  :range="true"
                  name="measPeriod"
                  v-model:value="measPeriod"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  :editable="editable"
                  :disabled="disabled"
                  type="edit"
                  name="plantCd"
                  v-model:value="workMeasure.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  required
                  :editable="editable && !disabled"
                  label="측정계획명"
                  name="measPlanContent"
                  v-model:value="workMeasure.measPlanContent"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  suffix="℃"
                  :editable="editable && !disabled"
                  label="작업장기온"
                  name="measTemperature"
                  v-model:value="workMeasure.measTemperature"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  suffix="%"
                  :editable="editable && !disabled"
                  label="작업장습도"
                  name="measHumidity"
                  v-model:value="workMeasure.measHumidity"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-task-target
                  :editable="editable"
                  :disabled="disabled"
                  :customPopupParam="{ targetKey: 'checkup' }"
                  label="관련 건강검진"
                  name="heaCheckupPlanId"
                  v-model:value="workMeasure.heaCheckupPlanId"
                />
              </div> -->
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
    <c-tab
      type="tabcard"
      align="left"
      :tabItems="tabItems"
      :inlineLabel="true"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :workMeasure="workMeasure"
          :workAreaGradeCd="tab.workAreaGradeCd"
          :title="tab.label"
          :unit="tab.unit"
          :disabled="disabled"
          :updateMode="updateMode"
          :height="tabHeight"
          @getDetail="getDetail"
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
import { workMeasureType } from './workMeasure'

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
  name: 'workMeasurePlanDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()
const systemInfo = useSystemInfoStore()
const { depts, vendors } = storeToRefs(systemInfo)

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
  contentHeight?: stringNull
  popupParam: {
    workMeasurementPlanId: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  popupParam: () => {
    return {
      workMeasurementPlanId: ''
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
const workMeasure = ref<workMeasureType>({
  workMeasurementPlanId: '',
  plantCd: '',
  measPlaceName: '',
  measPlanContent: '',
  measQuarter: null,
  measYear: '',
  measStartDate: '',
  measEndDate: '',
  measStartDate2: '',
  measEndDate2: '',
  measCompleteFlag: 'N',
  measTemperature: '',
  measHumidity: '',
  heaCheckupPlanId: '',
  regUserId: '',
  chgUserId: '',
  workMeasurementResultModelList: [],
  updateFlag: ''
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const mappingType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
const completeUrl = ref('')
const deleteUrl = ref('')
const checkUrl = ref('')
const editable = ref(true)
const isSave = ref(false)
const isdelete = ref(false)
const isComplete = ref(false)
const updateMode = ref(false)
const measPeriod = ref(['', ''])
const tab = ref('resultInfo1')
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => workMeasure.value.measCompleteFlag === 'Y')
const tabItems = computed(() => [
  {
    name: 'resultInfo1',
    icon: 'groups',
    label: '소음',
    unit: 'dB(A)',
    workAreaGradeCd: '1',
    component: defineAsyncComponent(() => import(`./workMeasureResultInfo.vue`))
  },
  {
    name: 'resultInfo5',
    icon: 'groups',
    label: '고열',
    unit: '℃',
    workAreaGradeCd: '5',
    component: defineAsyncComponent(() => import(`./workMeasureResultInfo.vue`))
  },
  {
    name: 'resultInfo2',
    icon: 'groups',
    label: '분진',
    unit: 'mg/m3',
    workAreaGradeCd: '2',
    component: defineAsyncComponent(() => import(`./workMeasureResultInfo.vue`))
  },
  {
    name: 'resultInfo4',
    icon: 'groups',
    label: '금속류',
    unit: 'mg/m3',
    workAreaGradeCd: '4',
    component: defineAsyncComponent(() => import(`./workMeasureResultInfo.vue`))
  },
  {
    name: 'resultInfo6',
    icon: 'groups',
    label: '가스상물질류',
    unit: 'ppm',
    workAreaGradeCd: '6',
    component: defineAsyncComponent(() => import(`./workMeasureResultInfo.vue`))
  },
  {
    name: 'resultInfo3',
    icon: 'groups',
    label: '기타',
    unit: '',
    workAreaGradeCd: '3',
    component: defineAsyncComponent(() => import(`./workMeasureResultInfo.vue`))
  },
  {
    name: 'resultImpr',
    icon: 'health_and_safety',
    label: '개선목록',
    component: defineAsyncComponent(() => import(`./workMeasureResultImpr.vue`))
  }
])
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 160 + 'px' : '400px'
)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => measPeriod.value,
  () => {
    const [year, month] = measPeriod.value[0].split('-')
    workMeasure.value.measQuarter = Number(month) < 7 ? 'WMQ0000001' : 'WMQ0000002'
    workMeasure.value.measYear = year
    if (!props.popupParam.workMeasurementPlanId)
      workMeasure.value.measPlanContent = `${year}년 ${Number(month) < 7 ? '상반기' : '하반기'} 작업환경측정`
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
  detailUrl.value = selectConfig.sai.workmeas.plan.get.url
  checkUrl.value = selectConfig.sai.workmeas.plan.check.url
  deleteUrl.value = transactionConfig.sai.workmeas.plan.delete.url
  saveUrl.value = transactionConfig.sai.workmeas.plan.insert.url
  completeUrl.value = transactionConfig.sai.workmeas.plan.complete.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 작업환경측정결과 상세조회
 *******************************/
function getDetail(_id?: stringNull) {
  if (props.popupParam.workMeasurementPlanId || _id) {
    $http({
      url: $format(detailUrl.value, props.popupParam.workMeasurementPlanId || _id),
      method: 'GET'
    }).then((_result: any) => {
      workMeasure.value = _result.data
      updateMode.value = true
      if (_result.data.measStartDate && _result.data.measEndDate) {
        measPeriod.value = [workMeasure.value.measStartDate, workMeasure.value.measEndDate]
      }
      workMeasure.value.updateFlag = uid()
    })
  } else {
    workMeasure.value.measYear = getThisYear()
    if (parseInt(getThisMonth().substring(5, 8)) < 7) {
      workMeasure.value.measQuarter = 'WMQ0000001' // 상반기
    } else workMeasure.value.measQuarter = 'WMQ0000002' // 하반기
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  mappingType.value = props.popupParam.workMeasurementPlanId ? 'PUT' : 'POST'
  editForm.value.validate().then((result: boolean) => {
    if (result) {
      $http({
        url: $format(checkUrl.value, workMeasure.value.measYear, workMeasure.value.measQuarter),
        method: 'GET'
      }).then((_result: any) => {
        if (updateMode.value || _result.data === 0) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            confirmCallback: () => {
              workMeasure.value.regUserId = user.value.userId
              workMeasure.value.chgUserId = user.value.userId
              if (measPeriod.value) {
                workMeasure.value.measStartDate = measPeriod.value[0]
                workMeasure.value.measEndDate = measPeriod.value[1]
              }
              isSave.value = !isSave.value
            },
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 년도 및 상/하반기 값을 가진 작업환경측정 결과가 존재합니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.workMeasurementPlanId = result.data
  getDetail()
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.workMeasurementPlanId),
        method: 'DELETE'
      }).then((_result: any) => {
        isdelete.value = !isdelete.value
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}

/******************************
 * TODO (목적): 완료
 *******************************/
function completeData(num: number) {
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: num === 1 ? '완료하시겠습니까?' : '완료취소 하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          workMeasure.value.measCompleteFlag = num === 1 ? 'Y' : 'N'
          workMeasure.value.chgUserId = user.value.userId
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function completeCallback() {
  message.requestSuccess()
  // props.popupParam.workMeasurementPlanId = result.data
  getDetail()
}

/******************************
 * TODO (목적): 엑셀업로드 팝업오픈
 *******************************/
function openExcelUploader() {
  // message.alert({
  //   title: '안내',
  //   message: '개발 중입니다.(양식 받으면 가능)',
  //   type: 'warning' // success / info / warning / error
  // })
  // return
  popupOptions.value.title = '작업환경측정결과 업로드'
  popupOptions.value.param = { workMeasurementPlanId: props.popupParam.workMeasurementPlanId }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./workMeasureResultExcelUpload.vue`))
  )
  popupOptions.value.width = '90%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item) => !item.error_messag)
    const finalData: any[] = []
    const excludedItems: string[] = []
    _.forEach(s_data, (item) => {
      switch (item.typeName) {
        case '소음':
          item.workAreaGradeCd = '1'
          break
        case '고열':
          item.workAreaGradeCd = '5'
          break
        case '분진':
          item.workAreaGradeCd = '2'
          break
        case '금속류':
          item.workAreaGradeCd = '4'
          break
        case '가스상물질류':
          item.workAreaGradeCd = '6'
          break
        case '기타':
          item.workAreaGradeCd = '3'
          break
        default:
          item.workAreaGradeCd = '' // 매핑 안되는 경우 기본값
      }
      switch (item.processCd) {
        case '그룹포틴':
          item.dvFlag = 'D'
          item.deptCd = getDeptCd(item.dvFlag, item.deptName)
          break
        case 'CS&D팀':
          item.dvFlag = 'D'
          item.deptCd = getDeptCd(item.dvFlag, item.processCd)
          item.processCd = '그룹포틴'
          break
        case '수급사':
          item.dvFlag = 'V'
          item.deptCd = getDeptCd(item.dvFlag, item.deptName)
          break
        default:
          item.dvFlag = null
          item.deptCd = null
      }
      if (item.deptCd === null || item.deptCd === undefined || item.deptCd === '') {
        excludedItems.push(item.deptName || item.processCd)
        return
      }
      item.workMeasurementPlanId = workMeasure.value.workMeasurementPlanId
      item.workMeasurementResultId = uid() // 일련번호
      item.regUserId = user.value.userId // 등록자 ID
      item.editFlag = 'C'
      item.measStartTime = item.measStartTime.replace('~', ',')
      item.measCount = Number(item.measCount)
      item.workCount = Number(item.workCount)
      if (item.exposureStandard) {
        const parts = item.exposureStandard.trim().split(' ')
        item.exposureStandard = parts[0] || ''
        item.unit = parts[1] || ''
      }
      finalData.push(item)
    })
    console.log('finalData', finalData)
    if (excludedItems.length > 0) {
      message.confirm({
        title: '데이터 제외 안내',
        message: `다음 항목은 부서/협력사 매핑에 실패하여 제외하고 저장합니다. [${_.uniq(excludedItems).join(', ')}]`,
        type: 'warning'
      })
    }
    if (finalData.length > 0) {
      $http({
        url: transactionConfig.sai.workmeas.results.insert.url,
        method: 'POST',
        data: finalData
      }).then((_result: any) => {
        message.requestSuccess()
        getDetail()
      })
    } else {
      message.alert({
        title: '알림',
        message: '업로드할 유효한 데이터가 없습니다.',
        type: 'error'
      })
    }
  }
}
function getDeptCd(_flag: string, _nm: string) {
  if (_flag === 'D') return _.find(depts.value, (item) => item.deptName.includes(_nm))?.deptCd
  else {
    const target: vendorType = _.find(vendors.value, (item: any) => item.vendorName.includes(_nm))
    return target?.vendorCd
  }
}
</script>
