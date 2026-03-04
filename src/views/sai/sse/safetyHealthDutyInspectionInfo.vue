<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="안전·보건 확보 의무 이행상태 점검 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="isOld && !disabled && editable"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="remove"
                />
                <c-btn
                  v-show="editable && !disabled && isOld"
                  label="완료"
                  icon="check"
                  color="grey-8"
                  :url="saveUrl"
                  :param="inspection"
                  :isSubmit="isComplete"
                  mappingType="PUT"
                  @beforeAction="complete"
                  @btnCallback="saveCallback"
                />
                <c-btn
                  v-show="!disabled && editable"
                  label="저장"
                  icon="save"
                  :url="saveUrl"
                  :param="inspection"
                  :isSubmit="isSave"
                  :mappingType="saveType"
                  @beforeAction="saveButton"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  type="edit"
                  name="plantCd"
                  label="사업장"
                  :disabled="disabled"
                  :editable="editable && !isOld"
                  v-model:value="inspection.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  :editable="false"
                  label="점검년도"
                  type="year"
                  name="checkYear"
                  v-model:value="inspection.checkYear"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  :editable="false"
                  codeGroupCd="HALF_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="상/하반기"
                  name="checkSemiAnnualCd"
                  v-model:value="inspection.checkSemiAnnualCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :range="false"
                  label="점검일시"
                  type="datetime"
                  name="checkDate"
                  :minuteStep="30"
                  :editable="editable && !disabled"
                  v-model:value="inspection.checkDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  :editable="editable"
                  label="부서"
                  name="deptCd"
                  v-model:value="inspection.deptCd"
                  @setDeptName="(val: any) => (inspection.deptName = val)"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-field
                  :required="true"
                  :editable="editable && !disabled"
                  type="dept_user"
                  label="점검자"
                  name="checkUserId"
                  v-model:value="inspection.checkUserId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable && !disabled"
                  label="점검명"
                  name="checkTitle"
                  v-model:value="inspection.checkTitle"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="editable && !disabled"
                  label="점검방법"
                  name="checkMethod"
                  v-model:value="inspection.checkMethod"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="itemTable"
          title="평가항목"
          :columns="itemgrid.columns"
          :data="inspection.subResults"
          :usePaging="false"
          :columnSetting="false"
          :gridHeight="gridHeight"
          :customTrClass="customTrClass"
        >
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'customCol'">
              <component
                :is="imprComponent"
                :col="col"
                :props="props"
                :inputEditable="
                  editable &&
                  !disabled &&
                  Boolean(props.row.sdpSemiCheckResultId) &&
                  props.row.level === 2
                "
                :isImmShow="true"
                :requestContentsCols="['checkContent']"
                tableKey="sdpSemiCheckResultId"
                ibmTaskTypeCd="ITT0000250"
                ibmTaskUnderTypeCd="ITT0000285"
                @imprChange="imprChange"
              />
            </template>
            <template v-else-if="col.name === 'checkContent' || col.name === 'remark'">
              <c-textarea-column
                v-if="props.row.level === 2"
                :editable="editable && !disabled"
                :props="props"
                :col="col"
                v-model:value="props.row[col.name]"
                @datachange="datachange(props)"
              />
              <span v-else class="q-ml-md">{{ props.row[col.name] }}</span>
            </template>
            <template v-else-if="col.name === 'checkResultCd' && props.row.level === 2">
              <c-select
                isChip
                class="no-label-control"
                :editable="editable && !disabled"
                codeGroupCd="CHECK_RESULT_CD"
                itemText="codeName"
                itemValue="code"
                v-model:value="props.row[col.name]"
                @datachange="datachange(props)"
              />
            </template>
          </template>
        </c-table>
      </div>
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
import { inspectionType } from './selfEvaluation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'patrosafetyHealthDutyInspectionInfo'
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
const emits = defineEmits(['getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sdpSemiCheckId: stringNull
  }
  inspection: inspectionType
  isOld: boolean
  disabled: boolean
  contentHeight?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

const props = withDefaults(defineProps<propType>(), {
  // 메인페이지(부모)가 넘긴 param변수 받기
  popupParam: () => {
    return {
      sdpSemiCheckId: ''
    }
  },
  inspection: () => {
    return {
      sdpSemiCheckId: '', // 반기점검 번호
      // plantCd: '', // 사업장
      deptCd: '', // 점검부서
      deptName: '',
      checkTitle: '', // 점검명
      checkYear: '',
      checkSemiAnnualCd: '', // 상반기/하반기
      checkDate: '', // 점검일시
      checkUserId: '', // 점검자
      checkMethod: '', // 점검방법
      checkFinishFlag: '', // 작성종료여부
      parentResults: [],
      subResults: [],
      delSubResults: []
    }
  },
  isOld: false,
  disabled: false,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const itemgrid = ref<any>({
  columns: [
    {
      name: 'checkContent',
      field: 'checkContent',
      label: '점검내용',
      align: 'left',
      type: 'custom',
      sortable: false
    },
    {
      name: 'checkResultCd',
      field: 'checkResultCd',
      label: '점검결과',
      align: 'center',
      sortable: false,
      style: 'width: 8%',
      type: 'custom'
      // codeGroupCd: 'CHECK_RESULT_CD',
    },

    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      type: 'custom',
      align: 'left',
      style: 'width:12%',
      sortable: true
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '개선/진행상태',
      align: 'center',
      style: 'width:20%',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const editForm = ref<HTMLFormElement | null>(null)
const saveType = ref('POST')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const isComplete = ref(false)
const itemTable = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const imprComponent = computed(() => {
  return defineAsyncComponent(() => import(`@views/common/ibm/tableImpr.vue`))
})
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(Number(props.contentHeight.replace('px', '')))
      ? Number(props.contentHeight.replace('px', '')) - 250
      : 400
  if (height < 400) height = 400
  return height + 'px'
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.inspection.checkDate,
  () => {
    if (Number(props.inspection.checkDate.split('-')[1]) < 7)
      props.inspection.checkSemiAnnualCd = 'CSAC00001'
    else props.inspection.checkSemiAnnualCd = 'CSAC00002'
    props.inspection.checkYear = props.inspection.checkDate.split('-')[0]
  }
)
watch(
  () => [props.inspection.checkDate, props.inspection.deptCd, props.inspection.deptName],
  () => {
    if (!props.inspection.deptName) return
    props.inspection.checkTitle =
      props.inspection.checkYear +
      '년 ' +
      (props.inspection.checkSemiAnnualCd === 'CSAC00001' ? '상반기' : '하반기') +
      ' 안전·보건 확보 의무 이행상태 점검 - ' +
      (props.inspection.deptName || '')
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
  saveUrl.value = transactionConfig.sai.sse.shd.insert.url
  deleteUrl.value = transactionConfig.sai.sse.shd.delete.url
  // code setting
  // list setting
  if (!props.inspection.checkDate) props.inspection.checkDate = getTodayDateTiemMin()
  if (!props.inspection.checkUserId) props.inspection.checkUserId = user.value.userId
}
/******************************
 * TODO (목적): 저장했을 때
 *******************************/
function saveButton() {
  if (props.isOld) saveType.value = 'PUT'
  else saveType.value = 'POST'
  editForm.value?.validate().then((_result: boolean) => {
    if (_result && validTable(itemgrid.value.columns, props.inspection.subResults)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.inspection.regUserId = user.value.userId
          props.inspection.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  if (!props.isOld) props.popupParam.sdpSemiCheckId = _result?.data
  emits('getDetail')
}
/******************************
 * TODO (목적): 완료처리
 *******************************/
function complete() {
  editForm.value?.validate().then((_result: boolean) => {
    if (_result && validTable(itemgrid.value.columns, props.inspection.subResults)) {
      message.confirm({
        title: '확인',
        message: '완료 처리하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.inspection.checkFinishFlag = 'Y'
          props.inspection.chgUserId = user.value.userId
          isComplete.value = !isComplete.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.sdpSemiCheckId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
function imprChange() {
  itemTable.value.compoTable.resetVirtualScroll()
}
function customTrClass(_props: any) {
  return _props.row.level === 1 ? 'bg-grey-4 text-bold' : ''
}
function datachange(_props: any) {
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
    _props.row.chgUserId = user.value.userId
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
