<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-show="editable && !disabled && isOld"
                mappingType="PUT"
                label="완료"
                icon="check"
                color="grey-8"
                :url="saveUrl"
                :param="supervisor"
                :isSubmit="isComplete"
                @beforeAction="complete"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-show="!disabled && editable"
                label="저장"
                icon="save"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="supervisor"
                :mappingType="saveType"
                @beforeAction="savePlan"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-if="editable && !disabled && isOld"
                label="삭제"
                icon="delete_forever"
                @btnClicked="remove"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable && !disabled"
                label="평가명"
                name="checkTitle"
                v-model:value="supervisor.checkName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable && !disabled"
                label="비고"
                name="remark"
                v-model:value="supervisor.remark"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-datepicker
                required
                :editable="editable && !disabled"
                label="평가년도"
                type="year"
                name="checkYear"
                v-model:value="supervisor.checkYear"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                required
                :editable="editable && !disabled && !isOld"
                codeGroupCd="HALF_CD"
                itemText="codeName"
                itemValue="code"
                label="상/하반기"
                name="checkSemiAnnualCd"
                v-model:value="supervisor.checkSemiAnnualCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-datepicker
                required
                :editable="editable && !disabled"
                label="평가일"
                name="checkDate"
                v-model:value="supervisor.checkDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-task-target
                required
                :editable="editable && !disabled"
                label="평가대상자"
                :customPopupParam="{ targetKey: 'evaluatee' }"
                name="evaluateeId"
                v-model:value="supervisor.evaluateeId"
                @dataChange="dataChange"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-field
                :editable="false"
                type="user"
                isSignature
                label="1차 평가자"
                name="evaluator1"
                v-model:value="supervisor.evaluator1"
                @signReExamine="(val: any) => signReExamine(val, 1)"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-field
                :editable="false"
                type="user"
                isSignature
                label="2차 평가자"
                name="evaluator2"
                v-model:value="supervisor.evaluator2"
                @signReExamine="(val: any) => signReExamine(val, 2)"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-plant
                required
                type="edit"
                name="plantCd"
                label="사업장"
                :disabled="disabled"
                :editable="editable && !isOld"
                v-model:value="supervisor.plantCd"
              />
            </div> -->
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table1"
          class="super"
          title="평가 기준"
          :columns="gridStd.columns"
          :data="gridStd.data"
          gridHeight="258px"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :isExcelDown="false"
          :filtering="false"
          :hideBottom="true"
        />
      </div>
      <div class="col-12">
        <c-table
          ref="table"
          class="ceo"
          title="평가항목"
          :editable="editable && !disabled"
          :columns="grid.columns"
          :data="supervisor.results"
          :gridHeight="gridHeight"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :isExcelDown="false"
          :filtering="false"
          :customTrClass="customTrClass"
        >
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'base'">
              <c-textarea-column
                v-if="props.row.saiSuperEvaluationMstId"
                :editable="editable && !disabled"
                :props="props"
                :col="col"
                v-model:value="props.row[col.name]"
                @datachange="datachange(props, col)"
              />
              <span v-else>{{ props.row[col.name] }}</span>
            </template>
            <template v-else-if="col.name === 'rating1'">
              <c-number-column
                v-if="props.row.saiSuperEvaluationMstId && supervisor.evaluator1 === user.userId"
                :editable="editable && !disabled"
                :col="col"
                :props="props"
                v-model:value="props.row[col.name]"
                @datachange="datachange(props, col)"
              />
              <span v-else>{{ props.row[col.name] }}</span>
            </template>
            <template v-else-if="col.name === 'rating2'">
              <c-number-column
                v-if="props.row.saiSuperEvaluationMstId && supervisor.evaluator2 === user.userId"
                :editable="editable && !disabled"
                :col="col"
                :props="props"
                v-model:value="props.row[col.name]"
                @datachange="datachange(props, col)"
              />
              <span v-else>{{ props.row[col.name] }}</span>
            </template>
          </template>
        </c-table>
      </div>
    </div>
  </q-form>
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
import { supervisorInspectionType } from './selfEvaluation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'supervisorInspectionLeaderInfo'
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
    saiSuperEvaluationId: stringNull
    type: stringNull
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
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      saiSuperEvaluationId: '',
      type: 'B'
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
const editable = ref(true)
const supervisor = ref<supervisorInspectionType>({
  saiSuperEvaluationId: '',
  checkName: '',
  checkYear: getThisYear(),
  checkDate: '',
  evaluatorId: '',
  evaluateeId: '',
  evaluator1: '',
  evaluator2: '',
  checkSemiAnnualCd: null,
  completeFlag: '',
  type: 'B',
  remark: '',
  results: [],
  deleteResults: []
})
const gridStd = ref<any>({
  columns: [
    {
      name: 'col1',
      field: 'col1',
      label: '구분',
      align: 'center',
      style: 'width:100px'
    },

    {
      name: 'col2',
      field: 'col2',
      label: '평가 기준 설명',
      align: 'left',
      style: 'width:600px',
      type: 'html'
    }
  ],
  data: [
    {
      col1: '양호',
      col2: '법령에 따른 업무를 수행함으로써 수립된 안전보건 목표를 달성하고 재해예방에 기여함.<br/>배점 20점 항목(17~20), 배점 10점 항목 (8~10)'
    },
    {
      col1: '보통',
      col2: '법령에 따른 업무를 적정하게 수행함. <br/>배점 20점 항목(12~16), 배점 10점 항목 (6~7)'
    },
    {
      col1: '미흡',
      col2: '법령에 따른 업무를 일부 수행하지 않음 <br/>배점 20점 항목(12점 미만), 배점 10점 항목 (6점미만)'
    }
  ]
})
const grid = ref<any>({
  columns: [
    {
      name: 'details',
      field: 'details',
      label: '평가항목',
      align: 'left'
      // style: 'width:200px'
    },
    {
      name: 'score',
      field: 'score',
      label: '배점',
      align: 'right',
      style: 'width:200px'
    },
    {
      name: 'eval',
      field: 'eval',
      label: '평가결과',
      child: [
        {
          name: 'rating1',
          field: 'rating1',
          label: '1차',
          align: 'right',
          style: 'width:200px',
          type: 'custom',
          // disableTarget: 'editYn',
          // disableCon: 'Y',
          sortable: false
        },
        {
          name: 'rating2',
          field: 'rating2',
          label: '2차',
          align: 'right',
          style: 'width:200px',
          type: 'custom',
          // disableTarget: 'editYn',
          // disableCon: 'Y',
          sortable: false
        },
        {
          name: 'rating3',
          field: 'rating3',
          label: '종합',
          align: 'right',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'base',
          field: 'base',
          label: '비고',
          align: 'left',
          style: 'width:300px',
          type: 'custom',
          sortable: false
        }
      ]
    }
  ],
  data: []
})
const editForm = ref<HTMLFormElement | null>(null)
const saveType = ref('POST')
const saveUrl = ref('')
const deleteUrl = ref('')
const detailUrl = ref('')
const resultItemUrl = ref('')
const isSave = ref(false)
const isComplete = ref(false)
const table = ref<any>(null)
const electronSignature1 = ref<stringNull>(null)
const electronSignature2 = ref<stringNull>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.saiSuperEvaluationId))
const disabled = computed(() => supervisor.value.completeFlag === 'Y')
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(Number(props.contentHeight.replace('px', '')))
      ? Number(props.contentHeight.replace('px', '')) - 265
      : 400
  if (height < 400) height = 400
  return height + 'px'
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => supervisor.value.checkDate,
  () => {
    if (Number(supervisor.value.checkDate.split('-')[1]) < 7)
      supervisor.value.checkSemiAnnualCd = 'CSAC00001'
    else supervisor.value.checkSemiAnnualCd = 'CSAC00002'
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
  detailUrl.value = selectConfig.sai.sse.superInspection.get.url
  resultItemUrl.value = selectConfig.sai.sse.supervisor.mst.item.url
  saveUrl.value = transactionConfig.sai.sse.superInspection.insert.url
  deleteUrl.value = transactionConfig.sai.sse.superInspection.delete.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiSuperEvaluationId),
      method: 'GET'
    }).then((_result: any) => {
      supervisor.value = _result.data
      if (!supervisor.value.checkYear) supervisor.value.checkYear = getThisYear()
      emits('setRegInfo', _result.data)
      // 합계 계산 (합계 행 제외)
      const sums = supervisor.value.results?.reduce(
        (acc: any, item: any) => {
          if (item.saiSuperEvaluationMstId) {
            // 실제 평가행만 집계
            acc.score += Number(item.score) || 0
            acc.rating1 += Number(item.rating1) || 0
            acc.rating2 += Number(item.rating2) || 0
            acc.rating3 += Number(item.rating3) || 0
          }
          return acc
        },
        { score: 0, rating1: 0, rating2: 0, rating3: 0 }
      )
      // 합계 행 push
      supervisor.value.results?.push({
        saiSuperEvaluationId: null,
        saiSuperEvaluationResultId: null,
        saiSuperEvaluationMstId: null,
        rating1: sums?.rating1 || 0,
        rating2: sums?.rating2 || 0,
        rating3: sums?.rating3 || 0,
        details: '합계',
        evaluationStandard: '',
        score: sums?.score || 0,
        editYn: 'N'
      })
    })
  } else {
    supervisor.value.checkDate = getToday()
    supervisor.value.regUserId = user.value.userId
    $http({
      url: resultItemUrl.value,
      method: 'GET',
      params: { useFlag: 'Y', type: 'B' }
    }).then((_result: any) => {
      _.forEach(_result.data, (_item) => {
        supervisor.value.results?.push({
          saiSuperEvaluationId: '',
          saiSuperEvaluationResultId: '',
          saiSuperEvaluationMstId: _item.saiSuperEvaluationMstId || '',
          rating1: '',
          rating2: '',
          rating3: '',
          regUserId: user.value.userId,
          editFlag: 'C',
          details: _item.details,
          evaluationStandard: _item.evaluationStandard,
          score: _item.score,
          editYn: 'Y'
        })
      })
      supervisor.value.results?.push({
        saiSuperEvaluationId: null,
        saiSuperEvaluationResultId: null,
        saiSuperEvaluationMstId: null,
        rating1: 0,
        rating2: 0,
        rating3: 0,
        details: '합계',
        evaluationStandard: '',
        score: 100,
        editYn: 'N'
      })
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function savePlan() {
  if (isOld.value) saveType.value = 'PUT'
  else saveType.value = 'POST'
  supervisor.value.type = props.popupParam.type
  editForm.value?.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, supervisor.value.results)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          supervisor.value.regUserId = user.value.userId
          supervisor.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  if (!props.popupParam.saiSuperEvaluationId) props.popupParam.saiSuperEvaluationId = _result?.data
  getDetail()
}
/******************************
 * TODO (목적): 완료처리
 *******************************/
function complete() {
  if (
    supervisor.value.results?.[supervisor.value.results.length - 1].rating1 === 0 ||
    supervisor.value.results?.[supervisor.value.results.length - 1].rating2 === 0 ||
    !electronSignature1.value ||
    !electronSignature2.value
  ) {
    message.alert({
      title: '안내',
      message: '1/2차 평가점수 및 1/2차 평가자의 서명을 모두 입력하세요.',
      type: 'info' // success / info / warning / error
    })
    return
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, supervisor.value.results)) {
      message.confirm({
        title: '확인',
        message: '완료 처리하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          supervisor.value.completeFlag = 'Y'
          supervisor.value.chgUserId = user.value.userId
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
        url: $format(deleteUrl.value, props.popupParam.saiSuperEvaluationId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 합계 계산
 *******************************/
function datachange(_props: any, col: any) {
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
    _props.row.chgUserId = user.value.userId
  }
  if (col.name === 'rating1' || col.name === 'rating2') {
    if (_props.row[col.name] > _props.row.score) {
      message.alert({
        title: '안내',
        message: '배점 이하의 점수를 입력하세요.',
        type: 'warning' // success / info / warning / error
      })
      _props.row[col.name] = 0
    }
    _props.row.rating3 = (Number(_props.row.rating1) + Number(_props.row.rating2)) / 2
    let [sumScore, sum1, sum2, sum3] = [0, 0, 0, 0]
    supervisor.value.results?.forEach((item: any) => {
      if (item.editYn === 'Y') {
        sumScore += Number(item.score) || 0
        sum1 += Number(item.rating1) || 0
        sum2 += Number(item.rating2) || 0
        sum3 += Number(item.rating3) || 0
      }
    })
    // 무조건 마지막 행을 찾아서 업데이트
    const lastRow = supervisor.value.results?.[supervisor.value.results.length - 1]
    if (lastRow) {
      lastRow.score = sumScore
      lastRow.rating1 = sum1
      lastRow.rating2 = sum2
      lastRow.rating3 = sum3
    }
  }
}
function customTrClass(_props: any) {
  return _props.row.editYn === 'Y' ? '' : 'bg-blue-1 text-bold'
}
function dataChange(data1: any, data2: any, data3: any) {
  supervisor.value.evaluateeId = data3.evaluateeId
  supervisor.value.evaluator1 = data3.evaluator1
  supervisor.value.evaluator2 = data3.evaluator2
}
function signReExamine(_data: any, num: number) {
  if (num === 1) electronSignature1.value = _data.electronSignature
  else if (num === 2) electronSignature2.value = _data.electronSignature
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.ceo
  .q-table
    tbody.q-virtual-scroll__content td
      padding: 10px !important
</style>
