<template>
  <q-form ref="editForm">
    <c-card class="cardClassDetailForm" title="상세">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <c-datepicker
            :disabled="disabled"
            :editable="editable"
            default="today"
            label="조사일자"
            name="investigationDate"
            v-model:value="hazard.investigationDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <c-field
            :required="true"
            :disabled="disabled"
            :editable="editable"
            :data="hazard"
            deptValue="deptCd"
            type="dept_user"
            label="조사자"
            name="userId"
            v-model:value="hazard.userId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <c-text
            :disabled="true"
            :editable="editable"
            label="공정"
            name="processName"
            v-model:value="hazard.processName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <c-text
            :disabled="true"
            :editable="editable"
            label="단위작업"
            name="sopName"
            v-model:value="hazard.sopName"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <c-radio
                :editable="editable"
                codeGroupCd="HEA_MUSCLE_HAZARD_RESEARCH_CD"
                label="조사구분"
                name="heaInvestigationTypeCd"
                v-model:value="hazard.heaInvestigationTypeCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <c-textarea
                :editable="editable"
                :disabled="disabled"
                :rows="4"
                label="비고"
                name="remark"
                v-model:value="hazard.remark"
              />
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-upload :attachInfo="attachInfo" :editable="editable && !disabled" label="첨부파일" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-table
            title="작업장 상황"
            :columns="grid1.columns"
            :data="hazard.situations"
            :editable="editable && !disabled"
            :gridHeight="gridHeight"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
            :usePaging="false"
            :hideBottom="true"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-table
            title="작업부하 및 작업빈도"
            :columns="grid2.columns"
            :data="hazard.heavyWorkIncludes"
            :gridHeight="gridHeight"
            :editable="editable && !disabled"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
            :usePaging="false"
            @callbackProxy="callbackProxy"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="hazardTable"
      :title="`단위작업: ${hazard.sopName}`"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="hazard.heavyWorkHazards"
      gridHeightAuto
      :editable="editable && !disabled"
      :isExcelDown="false"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="heaMuscleSopHazardId"
    />
    <c-table
      ref="resultTable"
      :title="`단위작업 : ${hazard.sopName}`"
      :columns="grid4.columns"
      :data="hazard.results"
      gridHeightAuto
      :editable="editable && !disabled"
      :hideBottom="true"
      :isExcelDown="false"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="heaMuscleSopResultId"
    />
    <c-card class="cardClassDetailForm" title="" noHeader>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-upload :attachInfo="attachResultInfo" :editable="false" label="작업사진" />
        </div>
      </template>
    </c-card>
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
import { sopType } from '../investigation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'investiWork'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
    heaMuscleSopId: stringNull
  }
  contentHeight: string
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
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
      heaMuscleSopId: ''
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
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'heaMuscleHeavyWorkId' },
    { index: 1, colName: 'heaMuscleHeavyWorkId' }
  ],
  columns: [
    {
      name: 'heavyWorkName',
      field: 'heavyWorkName',
      label: '부담작업No',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'detailJobContents',
      field: 'detailJobContents',
      label: '작업내용',
      align: 'left',
      style: 'width:120px',
      innerBtn: true,
      btns: [{ label: '', icon: 'add', color: 'light-blue', tooltip: '유해요인 추가' }],
      sortable: false
    },
    {
      required: true,
      name: 'hazardName',
      field: 'hazardName',
      label: '유해요인',
      align: 'left',
      style: 'width:200px',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'hazardCause',
      field: 'hazardCause',
      label: '유해요인의 발생원인 또는 노출특징',
      align: 'left',
      style: 'width:400px',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width:200px',
      type: 'textarea',
      sortable: false
    }
  ]
})
const grid4 = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'heaAssessmentToolCd',
      field: 'heaAssessmentToolCd',
      label: '작업분석․평가도구',
      align: 'center',
      style: 'width:25%',
      type: 'select',
      innerBtn: true,
      codeGroupCd: 'HEA_ASSESSMENT_TOOL_CD',
      sortable: false
    },
    {
      required: true,
      name: 'resultName',
      field: 'resultName',
      label: '평가결과',
      align: 'left',
      style: 'width:25%',
      type: 'textarea',
      sortable: false
    },
    {
      required: true,
      name: 'judgment',
      field: 'judgment',
      label: '판정',
      align: 'left',
      style: 'width:20%',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'workerOpinion',
      field: 'workerOpinion',
      label: '근로자의견',
      align: 'left',
      style: 'width:10%',
      type: 'textarea',
      sortable: false
    }
  ]
})
const hazard = ref<sopType>({
  heaMuscleSopId: '', // 근골격계 단위작업 일련번호
  heaInvestigationPlanId: '', // 근골격계 조사계획 일련번호
  heaMuscleSopStepCd: '', // 진행상태
  processCd: '', // 공정코드
  processName: '', // 공정명
  mdmSopId: '', // 안전작업 표준 일련번호
  sopName: '', // 세부공정(작업) 명
  heaInvestigationTypeCd: '', // 조사구분
  investigationDate: '', // 조사일시
  deptCd: '', // 조사자 부서
  userId: '', // 조사자 id
  remark: '', // 비고
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  heavyWorks: [], // 부담작업
  heavyWorkIncludes: [], // 부담작업 결과 O
  heavyWorkHazards: [], // 유해요인
  workers: [], // 작업자
  situations: [], // 상황조사
  results: [], // 결과표
  imprs: [] // 개선
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'HEA_MUSCLE_HAZARD',
  taskKey: ''
})
const attachResultInfo = ref({
  isSubmit: '',
  taskClassCd: 'HEA_MUSCLE_HAZARD_RESULT',
  taskKey: ''
})
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'heaMuscleSopSituationGubunName',
      field: 'heaMuscleSopSituationGubunName',
      label: '구분',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'changeFlag',
      field: 'changeFlag',
      label: '변화유무',
      align: 'center',
      sortable: false,
      style: 'width:80px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '내용요약',
      align: 'left',
      sortable: false,
      type: 'text'
    }
  ]
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'heavyWorkName',
      field: 'heavyWorkName',
      label: '부담작업No',
      align: 'center',
      sortable: false,
      style: 'width:90px'
    },
    {
      name: 'detailJobContents',
      field: 'detailJobContents',
      label: '작업내용',
      align: 'left',
      sortable: false,
      style: 'width:180px'
    },
    {
      name: 'workload',
      field: 'workload',
      label: '작업부하(A)',
      align: 'center',
      style: 'width:40px',
      sortable: false
    },
    {
      name: 'workFrequency',
      field: 'workFrequency',
      label: '작업빈도(B)',
      align: 'center',
      style: 'width:40px',
      sortable: false
    },
    {
      name: 'totalScore',
      field: 'totalScore',
      label: '총점수(AxB)',
      align: 'center',
      style: 'width:70px',
      sortable: false,
      color: 'red'
      // required: true,
      // type: 'proxy'
      // component: shallowRef(defineAsyncComponent(() => import(`../jobRiskPop.vue`)))
    }
  ]
})
const editable = ref(true)
const disabled = ref(true)
const editForm = ref<any>(null)
const detailUrl = ref('')
/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => '260px')
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
  detailUrl.value = selectConfig.hea.muscleSystem.muscleSop.get.url
  // code setting

  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 테이블 특정 row, column 에서 프록시 호출
 *******************************/
function callbackProxy(_data: any, _props: any, col: any) {
  if (hazard.value.heavyWorkIncludes) {
    if (col.name === 'totalScore') {
      hazard.value.heavyWorkIncludes[_props.rowIndex].workFrequency = _data.frequency
      hazard.value.heavyWorkIncludes[_props.rowIndex].workload = _data.strength
      hazard.value.heavyWorkIncludes[_props.rowIndex].totalScore = _data.total
    }
    if (hazard.value.heavyWorkIncludes[_props.rowIndex].editFlag !== 'C') {
      hazard.value.heavyWorkIncludes[_props.rowIndex].editFlag = 'U'
    }
  }
}

/******************************
 * TODO (목적): 설문조사 결과 상세조회
 *******************************/
function getDetail() {
  $http({
    url: $format(detailUrl.value, props.popupParam.heaMuscleSopId),
    method: 'GET'
  }).then((_result: any) => {
    _.extend(hazard.value, _result.data)
    attachInfo.value.taskKey = props.popupParam.heaMuscleSopId
    attachResultInfo.value.taskKey = props.popupParam.heaMuscleSopId
    // 처음으로 유해요인 조사하러 온 케이스 체크
    if (!hazard.value.situations || hazard.value.situations.length === 0) {
      getComboItems('HEA_MUSCLE_SOP_SITUATION_GUBUN_CD').then((_result: any) => {
        hazard.value.situations = []
        _.forEach(_result, (item) => {
          hazard.value.situations?.push({
            heaMuscleSopSituationId: '', // 근골격계 단위작업 상황조사 일련번호
            heaMuscleSopId: props.popupParam.heaMuscleSopId, // 근골격계 단위작업 일련번호
            heaInvestigationPlanId: hazard.value.heaInvestigationPlanId, // 근골격계 조사계획 일련번호
            heaMuscleSopSituationGubunCd: item.code, // 작업장 상황 조사 구분 코드
            heaMuscleSopSituationGubunName: item.codeName, // 작업장 상황 조사 구분 코드
            changeFlag: 'N', // 변화유무
            remark: '', // 내용요약
            regUserId: user.value.userId, // 등록자 id
            editFlag: 'C'
          })
        })
      })
      hazard.value.userId = user.value.userId
      hazard.value.deptCd = user.value.deptCd
    }
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
