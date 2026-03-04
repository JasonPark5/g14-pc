<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card class="cardClassDetailForm" title="기본정보">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-show="editable && !isOld"
                label="타 목표 불러오기"
                icon="save_alt"
                @btnClicked="copyTarget"
              />
              <c-btn
                v-if="editable && isOld"
                label="삭제"
                icon="delete"
                @btnClicked="deleteTarget"
              />
              <c-btn
                v-if="editable"
                :isSubmit="isSave"
                :url="saveUrl"
                :param="target"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveTarget"
                @btnCallback="saveTargetCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-plant
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model:value="target.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :required="true"
                :editable="editable"
                label="추진부서"
                name="propelDeptName"
                v-model:value="target.propelDeptName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                :required="true"
                :editable="editable"
                type="year"
                default="today"
                label="대상년도"
                name="targetYear"
                v-model:value="target.targetYear"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-dept
                :required="true"
                :editable="editable"
                type="edit"
                label="작성부서"
                name="writeDeptCd"
                v-model:value="target.writeDeptCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                :required="true"
                default="today"
                label="작성일"
                name="writeDt"
                v-model:value="target.writeDt"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="안전보건 목표 및 추진계획/실적"
          :merge="grid.merge"
          :columns="grid.columns"
          :data="target.plans"
          :gridHeight="gridHeight"
          :editable="editable"
          :usePaging="false"
          :isExcelDown="true"
          :filtering="false"
          :isFullScreen="true"
          :columnSetting="false"
          selection="multiple"
          rowKey="saiSafetyHealthyTargetPlanId"
          @table-data-change="tableDataChange"
        >
          <template v-slot:table-chip>
            <q-checkbox
              dense
              class="tableCheckBox"
              v-model="trueCheck"
              disable
              :label="$language('계획')"
            />&nbsp;&nbsp;
            <q-checkbox
              dense
              class="tableCheckBox"
              v-model="trueCheck"
              disable
              color="red"
              :label="$language('실적')"
            />
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addTargetPlan" />
              <c-btn
                v-if="editable && target.plans.length > 0"
                label="제외"
                icon="remove"
                @btnClicked="deleteTargetPlan"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'custom' && props.row.editFlag !== 'C'">
              <!-- 
                1. 실적이 들어가지 않은경우
                - 입력하기
                2. 실적이 들어간 경우
                - ㅁ건 
              -->
              <template v-if="props.row.results && props.row.results.length > 0">
                <q-btn
                  dense
                  outline
                  color="blue-9"
                  style="font-weight: 700"
                  :label="`${props.row.results.length} ${$language('건')}`"
                  @click="openResult(props.row)"
                />
              </template>
              <template v-else>
                <q-btn
                  dense
                  outline
                  color="green-9"
                  style="font-weight: 700"
                  :label="$language('입력하기')"
                  @click="openResult(props.row)"
                />
              </template>
            </template>
            <template v-else>
              <q-checkbox
                dense
                class="tableCheckBox"
                :editable="editable"
                :isFlag="true"
                true-value="Y"
                false-value="N"
                :name="col.name"
                v-model="props.row[col.name]"
                @update:model-value="() => datachange(props, col)"
              />
              <br />
              <q-checkbox
                v-if="checkTrues(props, col)"
                dense
                class="tableCheckBox tableCheckBox-true"
                :isFlag="true"
                color="red"
                v-model="trueCheck"
                disable
              />
              <q-checkbox
                v-else
                dense
                class="tableCheckBox tableCheckBox-false"
                :isFlag="true"
                v-model="falseCheck"
                disable
              />
            </template>
          </template>
        </c-table>
      </div>
      <c-dialog :param="popupOptions" />
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
import { safetyHealthyTargetDetailType } from './safetyHealthyMst'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyHealthyTargetDetail'
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
  popupParam: {
    equipmentCd: stringNull
    plantCd: stringNull
    psmFlag: stringNull
    saiSafetyHealthyTargetId: stringNull
  }
}
interface gridType {
  columns: Array<tableColumnType>
  data: Array<safetyHealthyTargetDetailType>
  merge: Array<tableMergeType>
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
  popupParam: () => {
    return {
      equipmentCd: '',
      plantCd: '',
      psmFlag: '',
      saiSafetyHealthyTargetId: ''
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
const trueCheck = ref(true)
const falseCheck = ref(false)
const table = ref<any>(null)
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'saiSafetyHealthyId' }],
  columns: [
    {
      name: 'targetName',
      field: 'targetName',
      label: '목표',
      align: 'center',
      style: 'width: 120px',
      sortable: false,
      fix: true
    },
    {
      name: 'detailName',
      field: 'detailName',
      label: '세부추진사항',
      align: 'left',
      style: 'width: 200px',
      sortable: false,
      fix: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '해당부서',
      align: 'center',
      style: 'width: 120px',
      sortable: false,
      fix: true
    },
    {
      name: 'kpi',
      field: 'kpi',
      label: 'KPI성과지표',
      align: 'center',
      style: 'width: 120px',
      sortable: false,
      fix: true
    },
    {
      name: 'kpiAttrName',
      field: 'kpiAttrCd',
      label: '지표속성',
      align: 'center',
      style: 'width: 60px',
      sortable: false,
      fix: true
    },
    {
      name: 'kpiDirectionName',
      field: 'kpiDirectionCd',
      label: '지표방향',
      align: 'center',
      style: 'width: 60px',
      sortable: false,
      fix: true
    },
    {
      name: 'kpiUnit',
      field: 'kpiUnit',
      label: '지표단위',
      align: 'center',
      style: 'width: 60px',
      sortable: false,
      fix: true
    },
    {
      name: 'performanceGoal',
      field: 'performanceGoal',
      label: '성과목표',
      align: 'center',
      style: 'width: 120px',
      type: 'text',
      sortable: false,
      fix: true
    },
    {
      name: 'schedule',
      field: 'schedule',
      label: '추진일정',
      child: [
        {
          name: 'month1',
          field: 'month1',
          label: '1월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '1',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month2',
          field: 'month2',
          label: '2월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '2',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month3',
          field: 'month3',
          label: '3월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '3',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month4',
          field: 'month4',
          label: '4월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '4',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month5',
          field: 'month5',
          label: '5월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '5',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month6',
          field: 'month6',
          label: '6월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '6',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month7',
          field: 'month7',
          label: '7월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '7',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month8',
          field: 'month8',
          label: '8월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '8',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month9',
          field: 'month9',
          label: '9월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '9',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month10',
          field: 'month10',
          label: '10월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '10',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month11',
          field: 'month11',
          label: '11월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '11',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        },
        {
          name: 'month12',
          field: 'month12',
          label: '12월',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          resultKey: '12',
          type: 'custom',
          true: 'Y',
          false: 'N',
          color: 'blue'
        }
      ]
    },
    {
      name: 'result',
      field: 'result',
      label: '성과',
      child: [
        {
          name: 'status',
          field: 'status',
          label: '실적',
          align: 'center',
          style: 'width: 80px',
          sortable: false,
          type: 'text'
        },
        {
          name: 'achievementRate',
          field: 'achievementRate',
          label: '달성률(%)',
          align: 'center',
          style: 'width: 80px',
          sortable: false,
          type: 'number'
        }
      ]
    },
    {
      name: 'budget',
      field: 'budget',
      label: '예산(만원)',
      align: 'center',
      style: 'width: 120px',
      sortable: false,
      type: 'number'
    },
    {
      name: 'performanceDetails',
      field: 'performanceDetails',
      label: '실적내용',
      align: 'left',
      style: 'width: 200px',
      sortable: false,
      type: 'textarea'
    },
    {
      name: 'custom',
      field: 'custom',
      label: '상세실적',
      align: 'center',
      style: 'width: 80px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width: 200px',
      sortable: false,
      type: 'textarea'
    }
  ],
  data: []
})
const target = ref<any>({
  saiSafetyHealthyTargetId: '', // 안전보건목표 일련번호
  plantCd: null, // 사업장
  propelDeptName: '', // 추진부서
  targetYear: '', // 대상년도
  writeDeptCd: '', // 작성부서
  writeDt: '', // 작성일
  regUserId: '', // 등록자
  chgUserId: '', // 수정자
  plans: [],
  deletePlans: []
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const editForm = ref<HTMLFormElement | null>(null)
const planRow = ref(null) as any
const isSave = ref(false)
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const mappingType = ref('PUT')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.popupParam.saiSafetyHealthyTargetId)
})
const gridHeight = computed(() => {
  return String(window.innerHeight - 260) + 'px'
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
  detailUrl.value = selectConfig.sai.safetyHealthy.get.url
  saveUrl.value = transactionConfig.sai.safetyHealthy.insert.url
  deleteUrl.value = transactionConfig.sai.safetyHealthy.delete.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiSafetyHealthyTargetId),
      method: 'GET'
    }).then((_result: any) => {
      emits('setRegInfo', _result.data)
      _.extend(target.value, _result.data)
    })
  } else {
    // 신규등록
    target.value.writeDeptCd = user.value.deptCd
    target.value.writeDt = getToday()
  }
}

/******************************
 * TODO (목적): 데이터 변경 시 달성률 계산
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tableDataChange(_props: any, _col: tableColumnType) {
  if (
    _props.row['kpiAttrCd'] === 'KAC0000001' &&
    (_col.name === 'performanceGoal' || _col.name === 'status')
  ) {
    const performanceGoal = parseFloat(_props.row['performanceGoal'])
    const status = parseFloat(_props.row['status'])

    if (_col.name === 'performanceGoal' && isNaN(performanceGoal)) {
      message.alert({
        title: '경고',
        message: '지표속성이 정량인 경우 성과목표는 숫자로 입력해야 합니다.',
        type: 'warning'
      })
      _props.row['performanceGoal'] = ''
    }
    if (_col.name === 'status' && isNaN(status)) {
      message.alert({
        title: '경고',
        message: '지표속성이 정량인 경우 성과현황은 숫자로 입력해야 합니다.',
        type: 'warning'
      })
      _props.row['status'] = ''
    }

    if (!isNaN(performanceGoal) && !isNaN(status)) {
      if (_props.row['kpiAttrCd'] === 'KAC0000001') {
        if (_props.row['kpiDirectionCd'] === 'KDC0000001') {
          // 상향
          _props.row['achievementRate'] = Math.round((status / performanceGoal) * 100)
        } else if (_props.row['kpiDirectionCd'] === 'KDC0000002') {
          // 하향
          _props.row['achievementRate'] = Math.round(
            (1 - (status - performanceGoal) / performanceGoal) * 100
          )
        }
      }
    } else {
      _props.row['achievementRate'] = 0
    }
  }
}

/******************************
 * TODO (목적): 안전보건목표 팝업
 *******************************/
function addTargetPlan() {
  popupOptions.value.title = '안전보건 목표 및 세부추진사항 목록'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sai/sht/safetyHealthyMstPopup.vue`))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeTargetPopup
}

/******************************
 * TODO (목적): 안전보건목표 팝업 닫기 callback
 *******************************/
function closeTargetPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      let _idx = _.findIndex(target.value.plans, {
        saiSafetyHealthyDetailId: item.saiSafetyHealthyDetailId
      })
      _idx = _idx > -1 ? _idx : 0
      target.value.plans.splice(_idx, 0, {
        saiSafetyHealthyTargetPlanId: uid(), // 안전보건목표 계획 일련번호
        saiSafetyHealthyTargetId: props.popupParam.saiSafetyHealthyTargetId, // 안전보건목표 일련번호
        saiSafetyHealthyDetailId: item.saiSafetyHealthyDetailId, // 안전보건목표 세부추진사항 일련번호
        saiSafetyHealthyId: item.saiSafetyHealthyId, // 안전보건목표 마스터 일련번호
        targetName: item.targetName, // 안전보건목표
        detailName: item.detailName, // 세부추진사항
        deptName: item.deptName, // 해당부서
        kpi: item.kpi, // kpi 성과지표
        KpiAttrCd: item.kpiAttrCd, // 지표속성
        kpiAttrName: item.kpiAttrName, // 지표속성
        KpiDirectionCd: item.kpiDirectionCd, // 지표방향
        kpiDirectionName: item.kpiDirectionName, // 지표방향
        kpiUnit: item.kpiUnit, // 지표단위
        performanceGoal: '', // 성과목표
        status: '', // 현황
        achievementRate: 0, // 달성율
        budget: 0, // 예산
        performanceDetails: '', // 실적내용
        remark: '', // 비고
        month1: 'N', // 1월 계획
        month2: 'N', // 2월 계획
        month3: 'N', // 3월 계획
        month4: 'N', // 4월 계획
        month5: 'N', // 5월 계획
        month6: 'N', // 6월 계획
        month7: 'N', // 7월 계획
        month8: 'N', // 8월 계획
        month9: 'N', // 9월 계획
        month10: 'N', // 10월 계획
        month11: 'N', // 11월 계획
        month12: 'N', // 12월 계획
        regUserId: user.value.userId, // 등록자
        editFlag: 'C'
      })
    })
  }
}
/******************************
 * TODO (목적): 안전보건목표 행 제외
 *******************************/
function deleteTargetPlan() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '제외하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        if (!target.value.deletePlans) target.value.deletePlans = []
        _.forEach(selectData, (item) => {
          if (
            item.editFlag !== 'C' &&
            _.findIndex(target.value.deletePlans, {
              saiSafetyHealthyTargetPlanId: item.saiSafetyHealthyTargetPlanId
            })
          ) {
            target.value.deletePlans.push(item)
          }
          target.value.plans = _.reject(target.value.plans, item)
        })
        table.value.compoTable.clearSelection()
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 결과 팝업(세부추진사항)
 *******************************/
function openResult(row: any) {
  if (!row) return
  planRow.value = row
  popupOptions.value.title = $language('세부추진사항') + ' [' + row.detailName + ']'
  popupOptions.value.param = {
    saiSafetyHealthyTargetId: row.saiSafetyHealthyTargetId,
    saiSafetyHealthyTargetPlanId: row.saiSafetyHealthyTargetPlanId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sai/sht/safetyHealthyTargetDetailPopup.vue`))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '60%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeResultPopup
}
/******************************
 * TODO (목적): 결과 팝업(세부추진사항) callback
 *******************************/
function closeResultPopup(result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (result && result.col1) {
    planRow.value.results = result.col1
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveTarget() {
  if (isOld.value) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.sai.safetyHealthy.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.sai.safetyHealthy.insert.url
  }
  editForm.value?.validate().then((_result: any) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          target.value.chgUserId = user.value.userId
          target.value.regUserId = user.value.userId
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
 * TODO (목적): 저장 후 callback
 *******************************/
function saveTargetCallback(result: any) {
  message.requestSuccess()
  props.popupParam.saiSafetyHealthyTargetId = result.data
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteTarget() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiSafetyHealthyTargetId),
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
 * TODO (목적): 타 안전보건 목표 및 추진계획 팝업
 *******************************/
function copyTarget() {
  popupOptions.value.title = '타 안전보건 목표 및 추진계획 검색'
  popupOptions.value.param = {
    type: 'single'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sai/sht/safetyHealthyTargetPopup.vue`))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '70%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeCopyTargetPopup
}
/******************************
 * TODO (목적): 타 안전보건 목표 및 추진계획 팝업 callback
 *******************************/
function closeCopyTargetPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    $http({
      url: $format(detailUrl.value, data[0].saiSafetyHealthyTargetId),
      method: 'GET'
    }).then((_result: any) => {
      target.value.plantCd = _result.data.plantCd
      target.value.targetYear = getThisYear()
      target.value.writeDeptCd = _result.data.writeDeptCd
      target.value.writeDt = getToday()
      target.value.regUserId = user.value.userId

      _.forEach(_result.data.plans, (item) => {
        let _idx = _.findIndex(target.value.plans, {
          saiSafetyHealthyId: item.saiSafetyHealthyId
        })
        _idx = _idx > -1 ? _idx : 0
        target.value.plans.splice(_idx, 0, {
          saiSafetyHealthyTargetPlanId: uid(), // 안전보건목표 계획 일련번호
          saiSafetyHealthyTargetId: props.popupParam.saiSafetyHealthyTargetId, // 안전보건목표 일련번호
          saiSafetyHealthyDetailId: item.saiSafetyHealthyDetailId, // 안전보건목표 마스터 일련번호
          saiSafetyHealthyId: item.saiSafetyHealthyId, // 안전보건목표 마스터 일련번호
          targetName: item.targetName, // 안전보건목표
          detailName: item.detailName, // 세부추진사항
          deptName: item.deptName, // 해당부서
          kpi: item.kpi, // kpi 성과지표
          KpiAttrCd: item.kpiAttrCd, // 지표속성
          kpiAttrName: item.kpiAttrName, // 지표속성
          KpiDirectionCd: item.kpiDirectionCd, // 지표방향
          kpiDirectionName: item.kpiDirectionName, // 지표방향
          kpiUnit: item.kpiUnit, // 지표단위
          performanceGoal: item.performanceGoal, // 성과목표
          status: null, // 현황
          achievementRate: 0, // 달성율
          budget: 0, // 예산
          performanceDetails: '', // 실적내용
          remark: '', // 비고
          month1: 'N', // 1월 계획
          month2: 'N', // 2월 계획
          month3: 'N', // 3월 계획
          month4: 'N', // 4월 계획
          month5: 'N', // 5월 계획
          month6: 'N', // 6월 계획
          month7: 'N', // 7월 계획
          month8: 'N', // 8월 계획
          month9: 'N', // 9월 계획
          month10: 'N', // 10월 계획
          month11: 'N', // 11월 계획
          month12: 'N', // 12월 계획
          regUserId: user.value.userId, // 등록자
          editFlag: 'C'
        })
      })
    })
  }
}
/******************************
 * TODO (목적): 데이터 변경 시 수정자 정보 셋팅
 * @param (1): 행 전체 정보
 *******************************/
function datachange(_props: any, _col: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // table.value.acceptData(_props.row, _col.name, _props.row[_col.name])
}

/******************************
 * TODO (목적): 실적 checkbox 보이기
 *******************************/
function checkTrues(_props: any, _col: any) {
  return _.findIndex(_props.row.results, { month: _col.resultKey }) > -1
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
