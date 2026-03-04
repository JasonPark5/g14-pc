<template>
  <div>
    <c-table
      title="기본정보"
      class="table-inner-custom survey"
      :columns="grid.columns"
      :data="grid.data"
      customDataTr
      gridHeightAuto
      hideHeader
      hideBottom
      :columnSetting="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :filtering="false"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="survey"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveSurvey"
            @btnCallback="saveSurveyCallback"
          />
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isComplete"
            :url="completeUrl"
            :param="survey"
            mappingType="PUT"
            label="설문완료"
            icon="check"
            @beforeAction="completeSurvey"
            @btnCallback="completeSurveyCallback"
          />
          <c-btn
            v-show="cancelBtnEditable"
            :isSubmit="isCancel"
            :url="cancelUrl"
            :param="survey"
            mappingType="PUT"
            label="다시작성"
            icon="keyboard_return"
            @beforeAction="cancelSurvey"
            @btnCallback="cancelSurveyCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:customDataTr="props">
        <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
          <q-td class="text-center th-td-style th-style th-style-1" :rowspan="1">
            {{ $language('이름') }}
          </q-td>
          <q-td class="text-center th-td-style td-style-1" :rowspan="1">
            {{ survey.userName }}
          </q-td>
          <q-td class="text-center th-td-style th-style th-style-1" :rowspan="1">
            {{ $language('연령') }}
          </q-td>
          <q-td class="text-center th-td-style td-style-1" :rowspan="1">
            <c-text
              :disabled="disabled"
              :editable="editable"
              type="number"
              label=""
              name="age"
              v-model:value="survey.age"
            />
          </q-td>
          <q-td class="text-center th-td-style th-style th-style-1" :rowspan="1">
            {{ $language('성별') }}
          </q-td>
          <q-td class="text-center th-td-style td-style-1" :rowspan="1">
            <c-radio
              :disabled="disabled"
              :editable="editable"
              codeGroupCd="SEX_CD"
              label=""
              name="sexCd"
              v-model:value="survey.sexCd"
            />
          </q-td>
          <q-td class="text-center th-td-style th-style th-style-1" :rowspan="1">
            {{ $language('현직장경력') }}
          </q-td>
          <q-td class="text-center th-td-style td-style-1" :rowspan="1">
            <c-text
              :disabled="disabled"
              :editable="editable"
              label=""
              name="career"
              v-model:value="survey.career"
            />
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
          <q-td class="text-center th-td-style th-style th-style-1" :rowspan="1">
            {{ $language('작업부서') }}
          </q-td>
          <q-td class="th-td-style td-style-2" :rowspan="1" :colspan="5">
            <span class="custom-text-before-parent">
              <c-text
                :disabled="true"
                :editable="editable"
                beforeText="부서"
                label=""
                name="deptName"
                v-model:value="survey.deptName"
              />
              <c-text
                :disabled="disabled"
                :editable="editable"
                beforeText="라인"
                label=""
                name="deptLine"
                v-model:value="survey.deptLine"
              />
              <c-text
                :disabled="disabled"
                :editable="editable"
                beforeText="수행작업"
                label=""
                name="deptWork"
                v-model:value="survey.deptWork"
              />
            </span>
          </q-td>
          <q-td class="text-center th-td-style th-style th-style-1" :rowspan="1">
            {{ $language('결혼여부') }}
          </q-td>
          <q-td class="text-center th-td-style td-style-1" :rowspan="1">
            <c-radio
              :disabled="disabled"
              :editable="editable"
              codeGroupCd="MARRIAGE_CD"
              label=""
              name="marriageFlag"
              v-model:value="survey.marriageFlag"
            />
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 2" no-hover>
          <q-td class="text-center th-td-style th-style th-style-1" :rowspan="1">
            {{ $language('현재작업 (구체적으로)') }}
          </q-td>
          <q-td class="th-td-style td-style-3" :rowspan="1" :colspan="7">
            <span class="custom-text-before-parent">
              <c-text
                :disabled="disabled"
                :editable="editable"
                beforeText="작업내용"
                label=""
                name="curWorkContents"
                v-model:value="survey.curWorkContents"
              />
              <c-text
                :disabled="disabled"
                :editable="editable"
                beforeText="작업기간"
                label=""
                name="curWorkRange"
                v-model:value="survey.curWorkRange"
              />
            </span>
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 3" no-hover>
          <q-td class="text-center th-td-style th-style th-style-1" :rowspan="1">
            {{ $language('1일 근무시간') }}
          </q-td>
          <q-td class="th-td-style td-style-3" :rowspan="1" :colspan="7">
            <span class="custom-text-before-parent">
              <c-text
                style="width: 20% !important; float: left"
                :disabled="disabled"
                :editable="editable"
                type="number"
                beforeText="시간"
                label=""
                name="onedayWorkTimeHour"
                v-model:value="survey.onedayWorkTimeHour"
              />
              <span
                style="float: left; margin: 8px 10px 0 20px !important; font-size: 0.95em"
                class="text-bold text-blue"
              >
                {{ $language('휴식시간(식사시간 제외)[분]') }}
              </span>
              <c-text
                style="width: 20% !important; float: left"
                class="q-mt-xs q-mr-lg"
                :disabled="disabled"
                :editable="editable"
                type="number"
                label=""
                name="onedayWorkTimeRestMin"
                v-model:value="survey.onedayWorkTimeRestMin"
              />
              <c-text
                style="width: 20% !important; float: left"
                :disabled="disabled"
                :editable="editable"
                type="number"
                beforeText="휴식 횟수"
                label=""
                name="onedayWorkTimeRestCnt"
                v-model:value="survey.onedayWorkTimeRestCnt"
              />
            </span>
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 4" no-hover>
          <q-td class="text-center th-td-style th-style th-style-1" :rowspan="1">
            {{ $language('현작업 전에 했던 작업') }}
          </q-td>
          <q-td class="th-td-style td-style-3" :rowspan="1" :colspan="7">
            <span class="custom-text-before-parent">
              <c-text
                :disabled="disabled"
                :editable="editable"
                beforeText="작업내용"
                label=""
                name="pastWorkContents"
                v-model:value="survey.pastWorkContents"
              />
              <c-text
                :disabled="disabled"
                :editable="editable"
                beforeText="작업기간"
                label=""
                name="pastWorkRange"
                v-model:value="survey.pastWorkRange"
              />
            </span>
          </q-td>
        </q-tr>
      </template>
    </c-table>
    <q-form ref="editForm">
      <c-card
        v-if="checkboxItems && checkboxItems.length > 0"
        class="cardClassDetailForm table-inner-custom survey"
        title="체크리스트"
      >
        <template v-slot:card-detail>
          <div class="col-12" v-for="(data, idx) in checkboxItems" :key="idx">
            <c-checkbox
              :disabled="disabled"
              :editable="editable"
              :isArray="false"
              :comboItems="data.inquiries"
              itemText="inquiryName"
              itemValue="heaMuscleWorkerSurveyInquiryId"
              valueText="inquiryName"
              valueKey="heaMuscleWorkerSurveyInquiryId"
              :label="data.checklistName"
              :name="`value${idx}`"
              v-model:value="data.value"
            />
          </div>
        </template>
      </c-card>
    </q-form>
    <c-table
      class="table-inner-custom survey"
      :editable="editable && !disabled"
      :columns="gridLast.columns"
      :data="gridLast.data"
      gridHeightAuto
      hideBottom
      :isTitle="true"
      :columnSetting="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :filtering="false"
      @headerCheckboxChange="headerCheckboxChange"
    >
      <template v-slot:suffixTitle>
        <c-radio
          :disabled="disabled"
          :editable="editable"
          :comboItems="[
            { code: 'N', codeName: $language('아니오 (수고하셨습니다. 설문을 다 마치셨습니다.)') },
            {
              code: 'Y',
              codeName: $language(
                '예 (“예”라고 답하신 분은 아래 표의 통증부위에 체크(∨)하고, 해당 통증부위의 세로줄로 내려가며 해당사항에 체크(∨)해 주십시오)'
              )
            }
          ]"
          valueText="codeName"
          valueKey="code"
          class="q-ml-sm lastQue"
          label="귀하의 작업과 관련하여 목, 어깨, 팔/팔꿈치, 손/손가락/손목, 허리, 다리/발 중 어느 한 부위에서라도 통증, 쑤심, 찌릿찌릿함, 뻣뻣함, 화끈거림, 무감각 등을 느끼신 적이 있습니까 ?"
          name="lastQue"
          v-model:value="survey.lastQue"
        />
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name != 'painArea'">
          <c-radio
            v-if="props.row[`${col.name}Flag`] === 'Y'"
            :disabled="
              disabled ||
              (survey[col.name as musculoskleltalSystemTargetLiteralType] === 'Y' ? false : true)
            "
            :editable="editable"
            :comboItems="props.row.comboItems"
            label=""
            :name="`value${props.rowIndex}${col.name}`"
            v-model:value="props.row[col.name]"
          />
          <template v-if="props.rowIndex === 5">
            <span class="custom-text-before-parent">
              <c-text
                :disabled="
                  disabled ||
                  (survey[col.name as musculoskleltalSystemTargetLiteralType] === 'Y'
                    ? false
                    : true) ||
                  !(props.row[col.name] === 'etc')
                "
                :editable="editable"
                beforeText="기타 작성"
                label=""
                :name="`etc${props.rowIndex}${col.name}`"
                v-model:value="props.row[`${col.name}etc`]"
              />
            </span>
          </template>
        </template>
        <template v-else>
          {{ props.row['painArea'] }}
          <q-icon
            v-if="props.rowIndex === 2"
            name="info"
            class="text-primary"
            style="font-size: 20px"
          >
            <q-tooltip
              anchor="center right"
              self="center left"
              :offset="[0, 0]"
              content-class="bg-dark"
              style="line-height: 1.6em; padding: 10px; font-size: 1em"
            >
              약한 통증 : 약간 불편한 정도이나 작업에 열중할 때는 못 느낀다.<br />
              중간 통증 : 작업 중 통증이 있으나 귀가 후 휴식을 취하면 괜찮다.<br />
              심한 통증 : 작업 중 통증이 비교적 심하고 귀가 후에도 통증이 계속된다.<br />
              매우 심한 통증 : 통증 때문에 작업은 물론 일상생활을 하기가 어렵다.<br />
            </q-tooltip>
          </q-icon>
        </template>
      </template>
    </c-table>
    <br />
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
import { answerType, musculoskleltalSystemTargetLiteralType, surveyType } from './investigation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'symptomSurveyDetail'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    heaMuscleWorkerSurveyId: stringNull
    surveies: Array<surveyType>
    readOnly: boolean
  }
  contentHeight: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
      heaMuscleWorkerSurveyId: '',
      surveies: [],
      readOnly: false
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const survey = ref<surveyType>({
  plantCd: '',
  heaMuscleWorkerSurveyId: '', // 근골격계 단위작업 작업자 설문 일련번호
  heaInvestigationPlanId: '', // 근골격계 조사계획 일련번호
  heaMuscleSurveyStepCd: '', // 설문현황
  userId: '', // 유저 시퀀스
  userName: '', // 사용자명
  deptName: '', // 부서명
  age: null, // 연령
  career: '',
  sexCd: '', // 성별
  deptLine: '', // 작업부서 라인
  deptWork: '', // 작업부서 수행작업
  marriageFlag: '', // 결혼여부
  curWorkContents: '', // 현재작업 - 작업내용
  curWorkRange: '', // 현재작업 - 작업기간
  onedayWorkTimeHour: '', // 1일 근무시간 - 시간
  onedayWorkTimeRestMin: '', // 1일 근무시간 - 휴식 - 분
  onedayWorkTimeRestCnt: '', // 1일 근무시간 - 휴식 - 횟수
  pastWorkContents: '', // 현작업 전에 했던 작업 - 작업내용
  pastWorkRange: '', // 현작업 전에 했던 작업 - 작업기간
  checklsit1: '', // 체크리스트 1
  checklsit2: '', // 체크리스트 2
  checklsit3: '', // 체크리스트 3
  checklsit4: '', // 체크리스트 4
  checklsit5: '', // 체크리스트 5
  lastQue: '', // 통증부위 설문여부
  neck: '', // 목
  neck1: '', // 목 - 1
  neck2: '', // 목 - 2
  neck3: '', // 목 - 3
  neck4: '', // 목 - 4
  neck5: '', // 목 - 5
  neck6: '', // 목 - 6
  neck6etc: '', // 목 - 6기타
  shoulder: '', // 어깨
  shoulder1: '', // 어깨 - 1
  shoulder2: '', // 어깨 - 2
  shoulder3: '', // 어깨 - 3
  shoulder4: '', // 어깨 - 4
  shoulder5: '', // 어깨 - 5
  shoulder6: '', // 어깨 - 6
  shoulder6etc: '', // 어깨 - 6기타
  arm: '', // 팔/팔꿈치
  arm1: '', // 팔/팔꿈치 - 1
  arm2: '', // 팔/팔꿈치 - 2
  arm3: '', // 팔/팔꿈치 - 3
  arm4: '', // 팔/팔꿈치 - 4
  arm5: '', // 팔/팔꿈치 - 5
  arm6: '', // 팔/팔꿈치 - 6
  arm6etc: '', // 팔/팔꿈치 - 6기타
  hand: '', // 손/손목/손가락
  hand1: '', // 손/손목/손가락 - 1
  hand2: '', // 손/손목/손가락 - 2
  hand3: '', // 손/손목/손가락 - 3
  hand4: '', // 손/손목/손가락 - 4
  hand5: '', // 손/손목/손가락 - 5
  hand6: '', // 손/손목/손가락 - 6
  hand6etc: '', // 손/손목/손가락 - 6기타
  waist: '', // 허리
  waist2: '', // 허리 - 2
  waist3: '', // 허리 - 3
  waist4: '', // 허리 - 4
  waist5: '', // 허리 - 5
  waist6: '', // 허리 - 6
  waist6etc: '', // 허리 - 6기타
  leg: '', // 다리/발
  leg1: '', // 다리/발 - 1
  leg2: '', // 다리/발 - 2
  leg3: '', // 다리/발 - 3
  leg4: '', // 다리/발 - 4
  leg5: '', // 다리/발 - 5
  leg6: '', // 다리/발 - 6
  leg6etc: '', // 다리/발 - 6기타
  regUserId: '', // 등록자 ID
  chgUserId: '' // 수정자 ID
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'header1',
      field: 'header1',
      label: 'header1',
      align: 'center',
      sortable: false,
      style: 'width:25%'
    },
    {
      name: 'data1',
      field: 'data1',
      label: 'data1',
      align: 'center',
      sortable: false,
      style: 'width:25%'
    },
    {
      name: 'header2',
      field: 'header2',
      label: 'header2',
      align: 'center',
      sortable: false,
      style: 'width:25%'
    },
    {
      name: 'data2',
      field: 'data2',
      label: 'data2',
      align: 'center',
      sortable: false,
      style: 'width:25%'
    },
    {
      name: 'header3',
      field: 'header3',
      label: 'header3',
      align: 'center',
      sortable: false,
      style: 'width:25%'
    },
    {
      name: 'data3',
      field: 'data3',
      label: 'data3',
      align: 'center',
      sortable: false,
      style: 'width:25%'
    },
    {
      name: 'header4',
      field: 'header4',
      label: 'header4',
      align: 'center',
      sortable: false,
      style: 'width:25%'
    },
    {
      name: 'data4',
      field: 'data4',
      label: 'data4',
      align: 'center',
      sortable: false,
      style: 'width:25%'
    }
  ],
  data: [{}, {}, {}, {}, {}]
})
const gridLast = ref<gridType>({
  columns: [],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const isComplete = ref(false)
const isCancel = ref(false)
const checkboxItems = ref<Array<answerType>>([])
const detailUrl = ref('')
const checklistUrl = ref('')
const painAreaUrl = ref('')
const saveUrl = ref('')
const completeUrl = ref('')
const cancelUrl = ref('')
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return survey.value.heaMuscleSurveyStepCd === 'MS00000005' || _props.popupParam.readOnly
})
const cancelBtnEditable = computed(() => false)

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
  detailUrl.value = selectConfig.hea.muscleSystem.muscleSurvey.get.url
  checklistUrl.value = selectConfig.hea.muscleSystem.surveyChecklist.list.url
  painAreaUrl.value = selectConfig.hea.muscleSystem.painArea.list.url
  saveUrl.value = transactionConfig.hea.muscleSystem.muscleSurvey.update.url
  completeUrl.value = transactionConfig.hea.muscleSystem.muscleSurvey.complete.url
  cancelUrl.value = transactionConfig.hea.muscleSystem.muscleSurvey.cancel.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  $http({
    url: $format(detailUrl.value, _props.popupParam.heaMuscleWorkerSurveyId),
    method: 'GET'
  }).then((_result: any) => {
    _.extend(survey.value, _result.data)
    // 체크리스트
    getChecklist()
    // 통증부위
    setGridLastColumns()
  })
}
/******************************
 * TODO (목적): 체크리스트 항목 조회
 *******************************/
function getChecklist() {
  $http({
    url: checklistUrl.value,
    method: 'GET',
    params: {
      plantCd: survey.value.plantCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    // 체크리스트 처리 : checkbox형태로 for문으로 형태가 그려짐에 따라 v-model선정처리가 필요
    if (_result.data && _result.data.length > 0) {
      _.forEach(_result.data, (item: answerType, _idx) => {
        item.value = survey.value[`checklsit${_idx + 1}` as musculoskleltalSystemTargetLiteralType]
      })
      checkboxItems.value = _result.data.map((item: answerType) => ({
        ...item,
        checklistName: item.checklistName.replace(/(?:\r\n|\r|\n|\\n)/g, '<br/>')
      }))
    } else checkboxItems.value = []
  })
}
/******************************
 * TODO (목적): 통증부위 테이블의 컬럼헤더 조회
 *******************************/
function setGridLastColumns() {
  let _neck = 'N'
  let _shoulder = 'N'
  let _arm = 'N'
  let _hand = 'N'
  let _waist = 'N'
  let _leg = 'N'
  if (survey.value) {
    _neck = survey.value.neck === 'Y' ? 'Y' : 'N'
    _shoulder = survey.value.shoulder === 'Y' ? 'Y' : 'N'
    _arm = survey.value.arm === 'Y' ? 'Y' : 'N'
    _hand = survey.value.hand === 'Y' ? 'Y' : 'N'
    _waist = survey.value.waist === 'Y' ? 'Y' : 'N'
    _leg = survey.value.leg === 'Y' ? 'Y' : 'N'
  }
  gridLast.value.columns = [
    {
      name: 'painArea',
      field: 'painArea',
      label: '통증부위',
      align: 'left',
      sortable: false,
      style: 'width:10%',
      type: 'custom'
    },
    {
      name: 'neck',
      field: 'neck',
      label: '목',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _neck,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'shoulder',
      field: 'shoulder',
      label: '어깨',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _shoulder,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'arm',
      field: 'arm',
      label: '팔/팔꿈치',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _arm,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'hand',
      field: 'hand',
      label: '손/손목/손가락',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _hand,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'waist',
      field: 'waist',
      label: '허리',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _waist,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'leg',
      field: 'leg',
      label: '다리/발',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _leg,
      setHeader: true,
      type: 'custom'
    }
  ]
  $http({
    url: painAreaUrl.value,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      let _idx = 1
      _.forEach(_result.data, (item: surveyType) => {
        item.neck = survey.value[`neck${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.shoulder = survey.value[`shoulder${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.arm = survey.value[`arm${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.hand = survey.value[`hand${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.waist = survey.value[`waist${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.leg = survey.value[`leg${_idx}` as musculoskleltalSystemTargetLiteralType]

        if (_idx === 6) {
          item.necketc = survey.value[`neck${_idx}etc`]
          item.shoulderetc = survey.value[`shoulder${_idx}etc`]
          item.armetc = survey.value[`arm${_idx}etc`]
          item.handetc = survey.value[`hand${_idx}etc`]
          item.waistetc = survey.value[`waist${_idx}etc`]
          item.legetc = survey.value[`leg${_idx}etc`]
        }
        _idx++
      })
      gridLast.value.data = _result.data
    } else {
      gridLast.value.data = _result.data
    }
  })
}
/******************************
 * TODO (목적): 헤더의 체크박스 체크시 실행
 *******************************/
function headerCheckboxChange(_props: any, col: tableColumnType, val: stringNull) {
  survey.value[col.name as musculoskleltalSystemTargetLiteralType] = val
}

/******************************
 * TODO (목적): 저장전 설문조사 값 세팅
 *******************************/
function setSaveValue() {
  return new Promise((resolve) => {
    survey.value.regUserId = user.value.userId
    survey.value.chgUserId = user.value.userId
    // 체크리스트
    if (checkboxItems.value && checkboxItems.value.length > 0) {
      let _idx = 1
      _.forEach(checkboxItems.value, (item: answerType) => {
        survey.value[`checklsit${_idx}` as musculoskleltalSystemTargetLiteralType] = item.value
        _idx++
      })
    } else {
      survey.value[`checklsit1`] = ''
      survey.value[`checklsit2`] = ''
      survey.value[`checklsit3`] = ''
      survey.value[`checklsit4`] = ''
      survey.value[`checklsit5`] = ''
    }
    // 통증부위
    if (gridLast.value.data && gridLast.value.data.length > 0) {
      let _idx = 1
      _.forEach(gridLast.value.data, (item) => {
        survey.value[`neck${_idx}` as musculoskleltalSystemTargetLiteralType] = item.neck
        survey.value[`shoulder${_idx}` as musculoskleltalSystemTargetLiteralType] = item.shoulder
        survey.value[`arm${_idx}` as musculoskleltalSystemTargetLiteralType] = item.arm
        survey.value[`hand${_idx}` as musculoskleltalSystemTargetLiteralType] = item.hand
        survey.value[`waist${_idx}` as musculoskleltalSystemTargetLiteralType] = item.waist
        survey.value[`leg${_idx}` as musculoskleltalSystemTargetLiteralType] = item.leg

        if (_idx === 6) {
          survey.value[`neck${_idx}etc`] = item.necketc
          survey.value[`shoulder${_idx}etc`] = item.shoulderetc
          survey.value[`arm${_idx}etc`] = item.armetc
          survey.value[`hand${_idx}etc`] = item.handetc
          survey.value[`waist${_idx}etc`] = item.waistetc
          survey.value[`leg${_idx}etc`] = item.legetc
        }
        _idx++
      })
    }
    resolve(true)
  })
}
function saveValue() {
  return new Promise((resolve) => {
    isSave.value = !isSave.value
    resolve(true)
  })
}
function completeValue() {
  return new Promise((resolve) => {
    isComplete.value = !isComplete.value
    resolve(true)
  })
}
function cancelValue() {
  return new Promise((resolve) => {
    isCancel.value = !isCancel.value
    resolve(true)
  })
}
function saveSurvey() {
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          const promises = [{ func: setSaveValue }, { func: saveValue }]
          orderedPromise(promises)
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveSurveyCallback() {
  message.requestSuccess()
  getDetail()
}
function completeSurvey() {
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '설문완료 하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          const promises = [{ func: setSaveValue }, { func: completeValue }]
          orderedPromise(promises)
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function completeSurveyCallback() {
  message.requestSuccess()
  getDetail()
}
function cancelSurvey() {
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '다시작성 하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          const promises = [{ func: setSaveValue }, { func: cancelValue }]
          orderedPromise(promises)
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function cancelSurveyCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.survey
  .default-table
    padding: 0 10px 10px 10px !important
  .lastQue
    margin: -20px auto 30px 20px !important
    .q-field__control-container
      padding-top: 20px !important
  .q-td, .CoptionGroupRadio, .CoptionGroupCheck
    font-size: 0.98em !important
.custom-text-before-parent
  .q-field__before
    div
      width: 80px !important
</style>
