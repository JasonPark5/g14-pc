<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="안전보건관리계획서 개요" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="popupParam.saiVendorSafetyPlanId && editable"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="removePlan"
                />
                <c-btn
                  v-show="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="planData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="savePlan"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="planData.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-task-target
                  required
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'vendor', selfFlag: false }"
                  label="협력업체"
                  name="vendorCd"
                  v-model:value="planData.vendorCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-task-target
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'construction' }"
                  label="공사"
                  name="sopConstructionId"
                  v-model:value="planData.sopConstructionId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="작업목표 및 방침"
                  name="workGoals"
                  v-model:value="planData.workGoals"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="업무분장"
                  name="workDivision"
                  v-model:value="planData.workDivision"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="안전관리계획" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="작업내용"
                  name="workContents"
                  v-model:value="planData.workContents"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="위험성평가"
                  name="workRisk"
                  v-model:value="planData.workRisk"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="점검 및 모니터링"
                  name="workMonitoring"
                  v-model:value="planData.workMonitoring"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="안전교육"
                  name="workEdu"
                  v-model:value="planData.workEdu"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="작업허가"
                  name="workPermit"
                  v-model:value="planData.workPermit"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="운영계획" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="신호및 연락체계"
                  name="workContact"
                  v-model:value="planData.workContact"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="위험물질 및 설비"
                  name="workMaterial"
                  v-model:value="planData.workMaterial"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  :editable="editable"
                  :rows="3"
                  label="비상대책"
                  name="workEmergency"
                  v-model:value="planData.workEmergency"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="table"
            title="재해발생 수준"
            :columns="grid.columns"
            :gridHeight="grid.height"
            :data="planData.calamitys"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :isExcelDown="false"
            :isFullScreen="false"
            :hideBottom="true"
            :editable="editable"
            @table-data-change="tableDataChange"
          >
            <template v-slot:suffixTitle>
              <template>
                <span class="text-negative" style="font-size: 0.8em; font-weight: 300">
                  ※ 최근 3년간 발생한 산업재해 현황
                </span>
              </template>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="관련파일" class="cardClassDetailForm" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-upload :attachInfo="attachInfo" :editable="editable" />
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { safetyPlanPopupParamType, safetyPlanType } from './safetyPlan'

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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyPlanDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const message = useMessageStore()
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: safetyPlanPopupParamType
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
      saiVendorSafetyPlanId: '',
      copyFlag: false
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
const planData = ref<safetyPlanType>({
  saiVendorSafetyPlanId: '', // 수급업체 안전보건관리계획서 일련번호
  plantCd: '', // 사업장 코드
  vendorCd: '', // 수급업체
  workGoals: '', // 작업목표 및 방침
  workDivision: '', // 업무분장
  workContents: '', // 작업내용
  workRisk: '', // 위험성평가
  workMonitoring: '', // 점검 및 모니터링
  workEdu: '', // 작업교육
  workPermit: '', // 작업허가
  workContact: '', // 신호및 연락체계
  workMaterial: '', // 위험물질 및 설비
  workEmergency: '', // 비상대책
  sopConstructionId: '', // 공사 일련번호
  calamitys: []
})
const detailUrl = ref('')
const saveUrl = ref('')
const saveType = ref('POST')
const isSave = ref(false)
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const deleteYearUrl = ref('')
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'VENDOR_SAFETY_PLAN',
  taskKey: ''
})
const grid = ref<any>({
  columns: [
    {
      name: 'year',
      field: 'year',
      label: '연도',
      align: 'center',
      style: 'width:20%',
      sortable: false
    },
    {
      label: '부상자수',
      align: 'center',
      child: [
        {
          name: 'accidentCnt',
          field: 'accidentCnt',
          type: 'number',
          label: '사고성 재해',
          align: 'center',
          style: 'width:20%',
          sortable: false,
          disableTarget: 'editYn',
          disableCon: 'Y'
        },
        {
          name: 'diseaseCnt',
          field: 'diseaseCnt',
          type: 'number',
          label: '직업병',
          align: 'center',
          style: 'width:20%',
          sortable: false,
          disableTarget: 'editYn',
          disableCon: 'Y'
        }
      ]
    },
    {
      name: 'deadCnt',
      field: 'deadCnt',
      label: '사망자수',
      align: 'center',
      type: 'number',
      style: 'width:20%',
      sortable: false,
      disableTarget: 'editYn',
      disableCon: 'Y'
    },
    {
      name: 'totalCnt',
      field: 'totalCnt',
      label: '연도별 합계',
      align: 'right',
      type: 'cost',
      style: 'width:20%',
      sortable: false
    }
  ],
  height: '265px',
  data: []
})
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
  detailUrl.value = selectConfig.sai.vendor.safety.plan.get.url
  insertUrl.value = transactionConfig.sai.vendor.safety.plan.insert.url
  updateUrl.value = transactionConfig.sai.vendor.safety.plan.update.url
  deleteUrl.value = transactionConfig.sai.vendor.safety.plan.delete.url
  deleteYearUrl.value = transactionConfig.sai.vendor.safety.plan.calamit.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 안전보건관리 계획 목록 조회
 *******************************/
function getDetail() {
  if (props.popupParam.saiVendorSafetyPlanId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiVendorSafetyPlanId),
      method: 'GET'
    }).then((_result: any) => {
      planData.value = _result.data
      if (!props.popupParam.copyFlag) {
        emits('setRegInfo', _result.data)
        attachInfo.value.taskKey = _result.data.saiVendorSafetyPlanId

        let _accidentCnt = 0
        let _diseaseCnt = 0
        let _deadCnt = 0
        let _totalCnt = 0
        _.forEach(planData.value.calamitys, (_item: any) => {
          if (_item.editYn == 'Y') {
            _accidentCnt += parseInt(_item.accidentCnt)
            _diseaseCnt += parseInt(_item.diseaseCnt)
            _deadCnt += parseInt(_item.deadCnt)
            _totalCnt += parseInt(_item.totalCnt)
          }
        })
        planData.value.calamitys!.push({
          saiVendorSafetyPlanId: '',
          year: '합계',
          accidentCnt: _accidentCnt,
          diseaseCnt: _diseaseCnt,
          deadCnt: _deadCnt,
          totalCnt: _totalCnt,
          editFlag: '',
          editYn: 'N'
        })
      } else {
        planData.value.saiVendorSafetyPlanId = null
        props.popupParam.saiVendorSafetyPlanId = null
        planData.value.calamitys = []
        initPlanYear()
      }
    })
  } else {
    initPlanYear()
  }
}
/******************************
 * TODO (목적): 재해발생 총 합계 계산
 *******************************/
function initPlanYear() {
  const years: any = [
    Number(getThisYear()) - 3,
    Number(getThisYear()) - 2,
    Number(getThisYear()) - 1
  ]
  _.forEach(years, (_item) => {
    planData.value.calamitys!.push({
      saiVendorSafetyPlanId: uid(),
      year: _item,
      accidentCnt: 0,
      diseaseCnt: 0,
      deadCnt: 0,
      totalCnt: 0,
      editFlag: 'C',
      editYn: 'Y'
    })
  })
  planData.value.calamitys!.push({
    saiVendorSafetyPlanId: '',
    year: '합계',
    accidentCnt: 0,
    diseaseCnt: 0,
    deadCnt: 0,
    totalCnt: 0,
    editFlag: '',
    editYn: 'N'
  })
}
/******************************
 * TODO (목적): 안전보건관리 계획 저장
 *******************************/
function savePlan() {
  if (props.popupParam.saiVendorSafetyPlanId) {
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          planData.value.regUserId = user.value.userId
          planData.value.chgUserId = user.value.userId

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
/******************************
 * TODO (목적): 안전보건관리 계획 저장 콜백
 *******************************/
function saveCallback(_result: any) {
  message.requestSuccess()
  attachInfo.value.taskKey = _result.data
  attachInfo.value.isSubmit = uid()
  if (!props.popupParam.saiVendorSafetyPlanId) {
    props.popupParam.saiVendorSafetyPlanId = _result.data
  }
  props.popupParam.copyFlag = false
  getDetail()
}
/******************************
 * TODO (목적): 안전보건관리 계획 삭제
 *******************************/
function removePlan() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiVendorSafetyPlanId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 재해발생 연도별 합계 계산
 *******************************/
function tableDataChange(_props: any) {
  _props.row.totalCnt =
    parseInt(_props.row['accidentCnt']) +
    parseInt(_props.row['diseaseCnt']) +
    parseInt(_props.row['deadCnt'])
  let _accidentCnt = 0
  let _diseaseCnt = 0
  let _deadCnt = 0
  let _totalCnt = 0
  _.forEach(planData.value.calamitys, (_item) => {
    if (_item.editYn == 'Y') {
      _accidentCnt += parseInt(_item.accidentCnt)
      _diseaseCnt += parseInt(_item.diseaseCnt)
      _deadCnt += parseInt(_item.deadCnt)
      _totalCnt += parseInt(_item.totalCnt)
    }
  })
  planData.value.calamitys![3].accidentCnt = _accidentCnt
  planData.value.calamitys![3].diseaseCnt = _diseaseCnt
  planData.value.calamitys![3].deadCnt = _deadCnt
  planData.value.calamitys![3].totalCnt = _totalCnt
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
