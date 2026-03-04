<template>
  <div class="row">
    <div class="col-md-12 col-lg-12">
      <q-form ref="editForm">
        <c-card title="중장비 기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <q-btn
                v-if="editable"
                icon="help"
                color="deep-purple-6"
                text-color="white"
                class="custom-btn"
                align="center"
                round
              >
                <q-tooltip anchor="bottom left" self="top left">
                  <div class="tooltipCustomTop">설명</div>
                  <div class="tooltipCustom">
                    o 관리번호는 자동생성됩니다.<br />
                    o 안전검사일은 유효검사기간에 맞춰 설정됩니다.<br />
                  </div>
                </q-tooltip>
              </q-btn>
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="forkLiftData"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="saveInfo"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-if="forkLiftData.heqForkLiftId"
                label="삭제"
                :editable="editable"
                icon="delete_forever"
                @btnClicked="remove"
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
                v-model:value="forkLiftData.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :editable="editable"
                :disabled="true"
                label="관리번호"
                name="managerNo"
                v-model:value="forkLiftData.managerNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-select
                required
                :disabled="disabled"
                :editable="editable"
                type="edit"
                codeGroupCd="HEQ_TYPE_CD"
                itemText="codeName"
                itemValue="code"
                name="facilityTypeCd"
                label="중장비 분류"
                v-model:value="forkLiftData.facilityTypeCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-task-target
                required
                :disabled="disabled"
                :editable="editable"
                label="공정"
                name="processCd"
                :multiple="true"
                :customPopupParam="{ targetKey: 'process' }"
                v-model:value="forkLiftData.processCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-task-target
                required
                :disabled="disabled"
                :editable="editable"
                label="업체"
                name="vendorCd"
                :customPopupParam="{ targetKey: 'vendor' }"
                v-model:value="forkLiftData.vendorCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                required
                :editable="editable"
                label="기기번호"
                name="deviceNo"
                v-model:value="forkLiftData.deviceNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                required
                :disabled="disabled"
                :editable="editable"
                label="기계명"
                name="facilityName"
                v-model:value="forkLiftData.facilityName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                required
                type="date"
                :editable="editable"
                label="반입일"
                name="carryinDate"
                v-model:value="forkLiftData.carryinDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-datepicker
                :editable="editable"
                type="date"
                :range="true"
                label="사용기간"
                name="useDate"
                v-model:value="useDate"
              />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-field
                :editable="editable"
                label="운전자"
                :disabled="disabled"
                :plantCd="forkLiftData.plantCd"
                :isVendorOrg="true"
                userName="managerUserName"
                name="managerUserId"
                v-model:value="forkLiftData.managerUserId"
              />
            </div>
            <div class="col-col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :editable="editable"
                suffix="년"
                type="number"
                label="안전검사유효기간"
                name="checkValidPeriod"
                v-model:value="forkLiftData.checkValidPeriod"
              />
            </div>

            <div class="col-col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                :editable="editable"
                type="date"
                label="안전검사일"
                :start="start"
                :end="end"
                name="safetyDate"
                v-model:value="forkLiftData.safetyDate"
              />
            </div>
            <div class="col-col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                :editable="editable"
                disabled
                type="date"
                label="차기검사예정일"
                v-model:value="forkLiftData.validFlagName"
              />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :editable="editable"
                label="면허 일련번호"
                name="installLocation"
                v-model:value="forkLiftData.installLocation"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                :editable="editable"
                label="교육 이수일"
                name="specifications"
                v-model:value="forkLiftData.specifications"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :editable="editable"
                label="비고"
                name="checkAction"
                v-model:value="forkLiftData.checkAction"
              />
            </div>
          </template>
        </c-card>

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
            <c-table
              ref="measTable"
              title="안전대책 목록"
              :columns="grid.columns"
              :gridHeight="grid.height"
              :data="forkLiftData.forkLiftSafetyMeasureList"
              :filtering="false"
              :columnSetting="false"
              :isExcelDown="false"
              :usePaging="false"
              :editable="editable"
              selection="multiple"
              rowKey="heqForkLiftMeasureId"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable && !disabled"
                    :showLoading="false"
                    label="추가"
                    icon="add"
                    @btnClicked="addRisk"
                  />
                  <c-btn
                    v-if="
                      editable && !disabled && forkLiftData.forkLiftSafetyMeasureList!.length > 0
                    "
                    :showLoading="false"
                    label="제외"
                    icon="remove"
                    @btnClicked="removeRisk"
                  />
                </q-btn-group>
              </template>
            </c-table>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
            <c-upload :attachInfo="attachInfo" :editable="editable" label="면허증/작업계획서" />
          </div>
        </div>
      </q-form>
    </div>
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
import { forkLiftType } from './forkLift'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'forkLiftManageDetail'
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
const emits = defineEmits(['closePopup', 'getDetail', 'datachange'])

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
  popupParam: {
    heqForkLiftId: stringNull
  }
  forkLiftData: forkLiftType
  contentHeight: stringNull
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
      heqForkLiftId: ''
    }
  },
  forkLiftData: () => {
    return {
      heqForkLiftId: '',
      plantCd: '',
      processCd: '',
      vendorCd: '',
      facilityTypeId: '',
      facilityTypeCd: '',
      facilityTypeName: '',
      facilityName: '',
      deviceNo: '',
      installLocation: '',
      carryinDate: '',
      useStartYmd: '',
      useEndYmd: '',
      safetyDate: '',
      safetyResultFlag: 'Y',
      checkAction: '',
      managerNo: '',
      managerUserId: '',
      managerUserName: '',
      regUserId: '',
      chgUserId: '',
      validFlagName: '',
      specifications: '',
      operationAtor: '',
      checkValidPeriod: '',

      forkLiftSafetyMeasureList: [],
      deleteForkLiftSafetyMeasureList: [],
      forkLiftHistoryList: [],
      deleteForkLiftHistoryList: []
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
const useDate = ref<any>([])
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'FORKLIFT_INFO',
  taskKey: ''
})
const saveUrl = ref('')
const saveType = ref('POST')
const isSave = ref(false)
const checkUrl = ref('')
const insertUrl = ref('')
const disabled = ref(false)

const grid = ref<any>({
  columns: [
    {
      name: 'riskFactors',
      field: 'riskFactors',
      label: '위험요인',
      align: 'left',
      type: 'text',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'safetyMeasure',
      field: 'safetyMeasure',
      label: '개선대책',
      align: 'left',
      type: 'text',
      style: 'width:70%',
      sortable: false
    }
  ],
  data: [],
  height: '220px'
})
const deleteUrl = ref('')
const updateUrl = ref('')
const start = ref<any>('')
const end = ref<any>('')
const editForm = ref<any>(null)
const measTable = ref<any>(null)

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
  checkUrl.value = selectConfig.sop.heq.forkLift.check.url
  saveUrl.value = transactionConfig.sop.heq.forkLift.insert.url
  insertUrl.value = transactionConfig.sop.heq.forkLift.insert.url
  updateUrl.value = transactionConfig.sop.heq.forkLift.update.url
  deleteUrl.value = transactionConfig.sop.heq.forkLift.delete.url

  // code setting
  // list setting
}

/******************************
 * TODO (목적): 중장비 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.heqForkLiftId) {
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
        params: props.forkLiftData
      }).then((_result: any) => {
        if (_result.data.deviceNo > 0) {
          message.alert({
            title: '안내',
            message: '사업장 내 이미 존재하는 기기번호입니다.', // 사업장 내 이미 존재하는 기기번호입니다
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
              props.forkLiftData.regUserId = user.value.userId
              props.forkLiftData.chgUserId = user.value.userId
              if (useDate.value) {
                props.forkLiftData.useStartYmd = useDate.value[0]
                props.forkLiftData.useEndYmd = useDate.value[1]
              }
              isSave.value = !isSave.value
              emits('getDetail')
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
/******************************
 * TODO (목적): 중장비 저장 콜백
 *******************************/
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.heqForkLiftId = _result.data
  attachInfo.value.taskKey = _result.data
  attachInfo.value.isSubmit = uid()
}
/******************************
 * TODO (목적): 중장비 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.forkLiftData.heqForkLiftId),
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
/******************************
 * TODO (목적): 안전대책 추가
 *******************************/
function addRisk() {
  props.forkLiftData.forkLiftSafetyMeasureList!.unshift({
    heqForkLiftId: props.forkLiftData.heqForkLiftId,
    heqForkLiftMeasureId: uid(),
    riskFactors: '',
    safetyMeasure: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 안전대책 삭제
 *******************************/
function removeRisk() {
  const selectData = measTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.forkLiftData.deleteForkLiftSafetyMeasureList) {
        props.forkLiftData.deleteForkLiftSafetyMeasureList = []
      }
      if (
        _.findIndex(props.forkLiftData.deleteForkLiftSafetyMeasureList, {
          heqForkLiftMeasureId: item.heqForkLiftMeasureId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.forkLiftData.deleteForkLiftSafetyMeasureList.push(item)
      }
      props.forkLiftData.forkLiftSafetyMeasureList = _.reject(
        props.forkLiftData.forkLiftSafetyMeasureList,
        item
      )
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<style>
.canvas {
  width: 100%;
  height: 100%;
  margin: 3 auto;
  display: inline;
}
.wrap {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  height: 400px;
  box-sizing: border-box;
  border-color: #aaa;
}
.facilityStyle {
  height: 200px;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.abc {
  width: 100%;
  height: 20px;
  display: inline;
}
.blinking {
  -webkit-animation: blink 3s ease-in-out infinite alternate;
  -moz-animation: blink 3s ease-in-out infinite alternate;
  animation: blink 3s ease-in-out infinite alternate;
}
@-webkit-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
