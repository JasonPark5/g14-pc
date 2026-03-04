<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline v-if="editable && !disabled">
              <c-btn
                v-show="isOld"
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
                label="저장"
                icon="save"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="supervisor"
                :mappingType="saveType"
                @beforeAction="savePlan"
                @btnCallback="saveCallback"
              />
              <c-btn v-if="isOld" label="삭제" icon="delete_forever" @btnClicked="remove" />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-12">
              <c-text
                :editable="false"
                label="평가방법"
                name="checkTitle"
                value="소속 본부 관리감독자 평가 결과에 따른 성과 평가"
              />
            </div>
            <div class="col-12">
              <c-text
                :editable="editable && !disabled"
                label="평가명"
                name="checkName"
                v-model:value="supervisor.checkName"
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
            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
              <c-task-target
                :editable="editable && !disabled"
                :customPopupParam="{ targetKey: 'evaluatee' }"
                :multiple="true"
                label="평가대상자 (최대 3명)"
                name="evaluateeId"
                v-model:value="supervisor.evaluateeId"
                @dataChange="dataChange"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <!-- <c-task-target
                :editable="editable && !disabled"
                :customPopupParam="{ targetKey: 'user' }"
                label="평가자"
                name="evaluator1"
                v-model:value="supervisor.evaluator1"
              /> -->
              <c-field
                :editable="editable"
                type="user"
                isSignature
                label="1차 평가자"
                name="evaluator1"
                v-model:value="supervisor.evaluator1"
                @signReExamine="(val: any) => (electronSignature = val.electronSignature)"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-plant
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
          class="ceo"
          title="평가 기준"
          :editable="editable && !disabled"
          :columns="gridStd.columns"
          :data="gridStd.data"
          gridHeight="325px"
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
          class="ceo"
          ref="table"
          title="관리감독자(임원) 안전보건 업무 수행 지원 평가표"
          :editable="editable && supervisor.evaluator1 === user.userId"
          :columns="grid.columns"
          :data="supervisor.results"
          :gridHeight="gridHeight"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :isExcelDown="false"
          :filtering="false"
          @table-data-change="tableDataChange"
        />
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
  name: 'supervisorInspectionCeoInfo'
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
  // 메인페이지(부모)가 넘긴 param변수 받기
  popupParam: () => {
    return {
      saiSuperEvaluationId: '',
      type: ''
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
  evaluateeId: '',
  evaluateeName: '',
  evaluator1: '',
  evaluator2: '',
  checkSemiAnnualCd: null,
  completeFlag: '',
  type: 'B',
  results: []
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
      col2: '법령에 따른 업무를 수행함으로써 수립된 안전보건 목표를 달성하고 재해예방에 기여함.'
    },
    {
      col1: '보통',
      col2: '법령에 따른 업무를 적정하게 수행함.'
    },
    {
      col1: '미흡',
      col2: '법령에 따른 업무를 일부 수행하지 않음.'
    }
  ]
})
const grid = ref<any>({
  columns: [],
  data: []
})
const baseColumns = ref([
  {
    name: 'details',
    field: 'details',
    label: '평가항목',
    align: 'left',
    style: 'width:300px'
  }
  // {
  //   name: 'score',
  //   field: 'score',
  //   label: '배점',
  //   align: 'center',
  //   style: 'width:40px'
  // }
])
const editForm = ref<HTMLFormElement | null>(null)
const saveType = ref('POST')
const saveUrl = ref('')
const deleteUrl = ref('')
const detailUrl = ref('')
const resultItemUrl = ref('')
const isSave = ref(false)
const isComplete = ref(false)
const table = ref<any>(null)
const electronSignature = ref<stringNull>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.saiSuperEvaluationId))
const disabled = computed(() => supervisor.value.completeFlag === 'Y')
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(Number(props.contentHeight.replace('px', '')))
      ? Number(props.contentHeight.replace('px', '')) - 330
      : 200
  if (height < 200) height = 200
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
      const userColumns = supervisor.value.evaluateeName
        .split(',')
        .map((item: any, idx: number) => ({
          name: item,
          field: item,
          label: `${item} 본부장`,
          child: [
            {
              name: `check${idx + 1}1`,
              field: `check${idx + 1}1`,
              label: '양호',
              type: 'check',
              true: 'Y',
              false: 'N',
              align: 'center',
              style: 'width:40px',
              sortable: false
            },
            {
              name: `check${idx + 1}2`,
              field: `check${idx + 1}2`,
              label: '보통',
              type: 'check',
              true: 'Y',
              false: 'N',
              align: 'center',
              style: 'width:40px',
              sortable: false
            },
            {
              name: `check${idx + 1}3`,
              field: `check${idx + 1}3`,
              label: '미흡',
              type: 'check',
              true: 'Y',
              false: 'N',
              align: 'center',
              style: 'width:40px',
              sortable: false
            }
          ]
        }))
      grid.value.columns = [...baseColumns.value, ...userColumns]
    })
  } else {
    supervisor.value.checkDate = getToday()
    supervisor.value.regUserId = user.value.userId
    grid.value.columns = baseColumns.value
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
          check11: 'N',
          check12: 'N',
          check13: 'N',
          check21: 'N',
          check22: 'N',
          check23: 'N',
          check31: 'N',
          check32: 'N',
          check33: 'N',
          regUserId: user.value.userId,
          editFlag: 'C',
          details: _item.details,
          score: _item.score
        })
      })
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function savePlan() {
  if (isOld.value) saveType.value = 'PUT'
  else {
    saveType.value = 'POST'
    supervisor.value.type = props.popupParam.type
  }
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
  editForm.value?.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, supervisor.value.results)) {
      const checkFields = [
        'check11',
        'check12',
        'check13',
        'check21',
        'check22',
        'check23',
        'check31',
        'check32',
        'check33'
      ]
      const ycnt = supervisor.value.results?.reduce((sum: number, row: any) => {
        return sum + checkFields.filter((field) => row[field] === 'Y').length
      }, 0)
      if (supervisor.value.evaluateeName.split(',').length * 6 !== ycnt) {
        message.alert({
          title: '안내',
          message: '모든 항목에 대하여 평가해주세요.',
          type: 'warning'
        })
        return
      }
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
function dataChange(data1: any, data2: any, _data: any) {
  if (_data && _data.length > 3) {
    message.alert({
      title: '안내',
      message: '평가대상자는 최대 3명까지만 선택할 수 있습니다.',
      type: 'warning' // success / info / warning / error
    })
    supervisor.value.evaluateeId = ''
    return
  }
  if (_data && _data.length > 0 && _data.length < 4) {
    // supervisor.value.evaluateeId = _data.map((item: any) => item.userId).join(',')
    const userColumns = _data.map((item: any, idx: number) => ({
      name: item.evaluateeId,
      field: item.evaluateeId,
      label: `${item.evaluateeName.split(' / ')[2]} 본부장`,
      child: [
        {
          name: `check${idx + 1}1`,
          field: `check${idx + 1}1`,
          label: '양호',
          type: 'check',
          true: 'Y',
          false: 'N',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: `check${idx + 1}2`,
          field: `check${idx + 1}2`,
          label: '보통',
          type: 'check',
          true: 'Y',
          false: 'N',
          align: 'center',
          style: 'width:40px',
          sortable: false
        },
        {
          name: `check${idx + 1}3`,
          field: `check${idx + 1}3`,
          label: '미흡',
          type: 'check',
          true: 'Y',
          false: 'N',
          align: 'center',
          style: 'width:40px',
          sortable: false
        }
      ]
    }))
    grid.value.columns = [...baseColumns.value, ...userColumns]
  } else {
    supervisor.value.evaluateeId = ''
    grid.value.columns = baseColumns.value
  }
}
/******************************
 * TODO (목적): 체크박스 제한
 *******************************/
function tableDataChange(_props: any, col: any) {
  if (col.name.includes('check')) {
    const group = col.name.charAt(5)
    const groupCols = [`check${group}1`, `check${group}2`, `check${group}3`]
    groupCols.forEach((c) => {
      if (c !== col.name) _props.row[c] = 'N' // 현재 변경된 값이 아니면 무조건 'N'
    })
  }
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
      padding: 10px 10px !important
</style>
