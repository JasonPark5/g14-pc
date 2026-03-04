<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable && isOld && !disabled"
              :url="completeUrl"
              :isSubmit="isComplete"
              :param="traningEduYear"
              mappingType="PUT"
              label="완료"
              icon="check"
              @beforeAction="completeInfo"
              @btnCallback="completeCallback"
            />
            <c-btn
              v-show="editable && !disabled"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="traningEduYear"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-show="editable && isOld && !disabled"
              label="삭제"
              icon="delete_forever"
              @btnClicked="deleteInfo"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
            <c-datepicker
              required
              :editable="editable"
              :disabled="disabled"
              default="today"
              type="year"
              name="planYear"
              label="년도"
              v-model:value="traningEduYear.planYear"
            />
          </div>
          <!-- <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
            <c-plant
              required
              :editable="editable"
              :disabled="disabled"
              type="edit"
              name="plantCd"
              v-model:value="traningEduYear.plantCd"
            />
          </div> -->
        </template>
      </c-card>
      <c-card title="대상자" class="cardClassDetailForm q-mt-sm">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div class="row">
              <div class="col-8">
                <c-checkbox
                  :editable="editable"
                  :disabled="disabled"
                  :isFlag="true"
                  trueLabel="근무자"
                  falseLabel="근무자"
                  trueValue="Y"
                  falseValue="N"
                  label=""
                  name="workerFlag"
                  v-model:value="traningEduYear.workerFlag"
                  @datachange="changeAction"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable"
                  :disabled="disabled || traningEduYear.workerFlag === 'N'"
                  type="number"
                  label="인원수"
                  name="workerCount"
                  v-model:value="traningEduYear.workerCount"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div class="row">
              <div class="col-8">
                <c-checkbox
                  :editable="editable"
                  :disabled="disabled"
                  :isFlag="true"
                  trueLabel="자위소방대 및 초기대응체계"
                  falseLabel="자위소방대 및 초기대응체계"
                  trueValue="Y"
                  falseValue="N"
                  label=""
                  name="selfFlag"
                  v-model:value="traningEduYear.selfFlag"
                  @datachange="changeAction"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable"
                  :disabled="disabled || traningEduYear.selfFlag === 'N'"
                  type="number"
                  label="인원수"
                  name="selfCount"
                  v-model:value="traningEduYear.selfCount"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <div class="row">
              <div class="col-8">
                <c-checkbox
                  :editable="editable"
                  :disabled="disabled"
                  :isFlag="true"
                  trueLabel="거주자"
                  falseLabel="거주자"
                  trueValue="Y"
                  falseValue="N"
                  label=""
                  name="residentFlag"
                  v-model:value="traningEduYear.residentFlag"
                  @datachange="changeAction"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable"
                  :disabled="disabled || traningEduYear.residentFlag === 'N'"
                  type="number"
                  label="인원수"
                  name="residentCount"
                  v-model:value="traningEduYear.residentCount"
                />
              </div>
            </div>
          </div>
        </template>
      </c-card>
      <c-table
        class="q-mt-sm"
        title="월간일정"
        :columns="gridColumns"
        gridHeight="400px"
        :data="traningEduYear.months"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :isDescriptionFrontTr="true"
        hideBottom
        :editable="editable && !disabled"
        checkDisableColumn="disabledRow"
      >
        <template v-slot:description-front-tr="props">
          <template
            v-if="
              gubunIndex.findIndex((item: any) => item.index === props.rowIndex) > -1 &&
              traningEduYear.months!.length > 0
            "
          >
            <q-tr :props="props" :key="`e_front_${props.rowIndex}`">
              <q-td
                :colspan="13"
                class="q-virtual-scroll--with-prev bg-blue-grey fire-fighting-traning-edu-year-gubun-tr"
              >
                {{
                  gubunIndex.find((item: any) => item.index === props.rowIndex)!
                    .sopFireFightingTraningEduYearClassGubunName
                }}
              </q-td>
            </q-tr>
          </template>
        </template>
      </c-table>
    </q-form>
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
import { eduYearType } from '../fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingPerformanceResultDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopFireFightingTraningEduYearId?: stringNull
  }
  contentHeight?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const _props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      sopFireFightingTraningEduYearId: ''
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const traningEduYear = ref<eduYearType>({
  sopFireFightingTraningEduYearId: '', // 소방 연간 훈련·교육 계획 일련번호
  plantCd: null, // 사업장코드
  planYear: '', // 년도
  sopFireFightingTraningEduYearStepCd: '', // 진행상태
  workerFlag: 'N', // 근무자 여부
  workerCount: null, // 근무자 수(명)
  selfFlag: 'N', // 자위소방대 및 초기대응체계 여부
  selfCount: null, // 자위소방대 및 초기대응체계 수(명)
  residentFlag: 'N', // 거주자 여부
  residentCount: null, // 거주자 수(명)
  regUserId: '', // 등록자
  chgUserId: '', // 수정자
  months: []
})
const editable = ref(true)
const isSave = ref(false)
const isComplete = ref(false)
const mappingType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(_props.popupParam.sopFireFightingTraningEduYearId))
const disabled = computed(
  () => traningEduYear.value.sopFireFightingTraningEduYearStepCd === 'FFTEY00005'
)
const gridColumns = computed(() => {
  const cols = [
    {
      name: 'sopFireFightingTraningEduYearClassName',
      field: 'sopFireFightingTraningEduYearClassName',
      label: '구분',
      align: 'center',
      sortable: true,
      style: 'width: 180px'
    }
  ] as tableColumnType[]
  const monthCols = []
  for (let idx = 1; idx <= 12; idx++) {
    monthCols.push({
      name: `month${idx}Flag`,
      field: `month${idx}Flag`,
      label: `${idx}`,
      align: 'center',
      sortable: true,
      style: 'width: 60px',
      type: 'check',
      true: 'Y',
      false: 'N'
    })
  }
  cols.push({
    name: 'month',
    field: 'month',
    label: '연간계획(월)',
    child: monthCols
  })
  return cols
})
const gubunIndex = computed(() => {
  const indexArray = []
  if (traningEduYear.value.months!.length > 0) {
    indexArray.push({
      index: 0,
      sopFireFightingTraningEduYearClassGubun:
        traningEduYear.value.months![0].sopFireFightingTraningEduYearClassGubun,
      sopFireFightingTraningEduYearClassGubunName:
        traningEduYear.value.months![0].sopFireFightingTraningEduYearClassGubun === 'EDU'
          ? '교육'
          : '훈련'
    })
    const _length = _.filter(traningEduYear.value.months, {
      sopFireFightingTraningEduYearClassGubun:
        traningEduYear.value.months![0].sopFireFightingTraningEduYearClassGubun
    }).length
    const rejectOthers = _.reject(traningEduYear.value.months, {
      sopFireFightingTraningEduYearClassGubun:
        traningEduYear.value.months![0].sopFireFightingTraningEduYearClassGubun
    })

    indexArray.push({
      index: _length,
      sopFireFightingTraningEduYearClassGubun:
        rejectOthers[0].sopFireFightingTraningEduYearClassGubun,
      sopFireFightingTraningEduYearClassGubunName:
        rejectOthers[0].sopFireFightingTraningEduYearClassGubun === 'EDU' ? '교육' : '훈련'
    })
  }
  return indexArray
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
  detailUrl.value = selectConfig.fft.fireFightingTraningEduYear.get.url
  saveUrl.value = transactionConfig.fft.fireFightingTraningEduYear.update.url
  deleteUrl.value = transactionConfig.fft.fireFightingTraningEduYear.delete.url
  completeUrl.value = transactionConfig.fft.fireFightingTraningEduYear.complete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, _props.popupParam.sopFireFightingTraningEduYearId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(traningEduYear.value, _result.data)
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  } else {
    // 월간 데이터 생성
    getComboItems('SOP_FIRE_FIGHTING_TRANING_EDU_YEAR_CLASS_CD').then((_result: any) => {
      traningEduYear.value.months = _.map(_result, (item) => {
        return _.extend(item, {
          sopFireFightingTraningEduYearMonthId: '', // 소방 연간 훈련·교육 월간일정 일련번호
          sopFireFightingTraningEduYearId: '', // 소방 연간 훈련·교육 계획 일련번호
          sopFireFightingTraningEduYearClassCd: item.code, // 소방 연간 훈련·교육 구분 코드
          sopFireFightingTraningEduYearClassName: item.codeName, // 소방 연간 훈련·교육 구분 코드
          sopFireFightingTraningEduYearClassGubun: item.attrVal1, // 소방 연간 훈련·교육 구분 코드
          sopFireFightingTraningEduYearClassFlag: item.attrVal2, // 소방 연간 훈련·교육 구분 코드
          month1Flag: 'N', // 1월 여부
          month2Flag: 'N', // 2월 여부
          month3Flag: 'N', // 3월 여부
          month4Flag: 'N', // 4월 여부
          month5Flag: 'N', // 5월 여부
          month6Flag: 'N', // 6월 여부
          month7Flag: 'N', // 7월 여부
          month8Flag: 'N', // 8월 여부
          month9Flag: 'N', // 9월 여부
          month10Flag: 'N', // 10월 여부
          month11Flag: 'N', // 11월 여부
          month12Flag: 'N', // 12월 여부
          regUserId: user.value.userId, // 등록자
          editFlag: 'C',
          disabledRow: true
        })
      })
    })
  }
}
/******************************
 * TODO (목적): 체크박스 선택 변경시
 *******************************/
function changeAction() {
  if (traningEduYear.value.workerFlag === 'N') traningEduYear.value.workerCount = null
  if (traningEduYear.value.selfFlag === 'N') traningEduYear.value.selfCount = null
  if (traningEduYear.value.residentFlag === 'N') traningEduYear.value.residentCount = null
  if (traningEduYear.value.workerFlag === 'Y' || traningEduYear.value.residentFlag === 'Y') {
    // 근무자, 거주자
    _.forEach(traningEduYear.value.months, (month) => {
      if (month.sopFireFightingTraningEduYearClassFlag === 'WR') month.disabledRow = false
    })
  } else {
    _.forEach(traningEduYear.value.months, (month) => {
      if (month.sopFireFightingTraningEduYearClassFlag === 'WR') {
        month.disabledRow = true
        month.month1Flag = 'N'
        month.month2Flag = 'N'
        month.month3Flag = 'N'
        month.month4Flag = 'N'
        month.month5Flag = 'N'
        month.month6Flag = 'N'
        month.month7Flag = 'N'
        month.month8Flag = 'N'
        month.month9Flag = 'N'
        month.month10Flag = 'N'
        month.month11Flag = 'N'
        month.month12Flag = 'N'
      }
    })
  }
  if (traningEduYear.value.selfFlag === 'Y') {
    // 자위소방대 및 초기대응체계
    _.forEach(traningEduYear.value.months, (month) => {
      if (month.sopFireFightingTraningEduYearClassFlag === 'S') {
        month.disabledRow = false
      }
    })
  } else {
    _.forEach(traningEduYear.value.months, (month) => {
      if (month.sopFireFightingTraningEduYearClassFlag === 'S') {
        month.disabledRow = true
        month.month1Flag = 'N'
        month.month2Flag = 'N'
        month.month3Flag = 'N'
        month.month4Flag = 'N'
        month.month5Flag = 'N'
        month.month6Flag = 'N'
        month.month7Flag = 'N'
        month.month8Flag = 'N'
        month.month9Flag = 'N'
        month.month10Flag = 'N'
        month.month11Flag = 'N'
        month.month12Flag = 'N'
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = isOld.value ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          traningEduYear.value.regUserId = user.value.userId
          traningEduYear.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  _props.popupParam.sopFireFightingTraningEduYearId = result.data
  getDetail()
}
/******************************
 * TODO (목적): 완료
 *******************************/
function completeInfo() {
  // 1. 근무자, 자위소방대 및 초기대응체계, 거주자 중 하나 이상 체크 > 2. 일정 수립
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          traningEduYear.value.chgUserId = user.value.userId
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function completeCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteInfo() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, _props.popupParam.sopFireFightingTraningEduYearId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
