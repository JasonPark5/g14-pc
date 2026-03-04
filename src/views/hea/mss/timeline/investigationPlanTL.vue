<template>
  <div class="row">
    <c-card class="cardClassDetailForm" title="상세">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-text
            :disabled="disabled"
            :editable="editable"
            label="조사계획명"
            name="investigationPlanName"
            v-model:value="investigation.investigationPlanName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-datepicker
            :disabled="disabled"
            :editable="editable"
            type="year"
            default="today"
            label="년도"
            name="year"
            v-model:value="investigation.year"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-datepicker
            :disabled="disabled"
            :editable="editable"
            :range="true"
            label="조사기간"
            name="period"
            v-model:value="investigation.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-field
            :disabled="disabled"
            :editable="editable"
            :data="investigation"
            deptValue="deptCd"
            type="dept_user"
            label="담당자"
            name="userId"
            v-model:value="investigation.userId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-dept-multi
            :disabled="disabled"
            :editable="editable"
            :parentCheckDepts="investigation.investigationDeptCd"
            label="조사부서"
            name="investigationDeptCd"
            v-model:value="investigation.investigationDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :disabled="disabled"
            :editable="editable"
            label="조사기관"
            name="agency"
            v-model:value="investigation.agency"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-plant
            :disabled="disabled"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="investigation.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            autogrow
            label="비고"
            name="remark"
            v-model:value="investigation.remark"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-upload
            ref="fileUpload"
            :attachInfo="attachInfo"
            :editable="editable && !disabled"
            label="첨부파일"
          />
        </div>
      </template>
    </c-card>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <c-table
        title="부담작업 평가결과 목록"
        :merge="grid.merge"
        :columns="grid.columns"
        :data="grid.data"
        :usePaging="false"
        :gridHeightAuto="true"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <component
        :is="worksheetComponent"
        :popupParam="props.param"
        :investigation="investigation"
        :disabled="true"
        :heavyWorks="heavyWorks"
        :isOld="true"
        :contentHeight="props.height"
      />
    </div>
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
import { investigationType } from '../investigation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'investigationPlanInfo'
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

/******************************
 * @Computed_선언
 *******************************/
const worksheetComponent = computed(() => {
  return markRaw(defineAsyncComponent(() => import(`@views/hea/mss/worksheet.vue`)))
})

/******************************
 * @inject_선언
 *******************************/
interface propType {
  height: stringNull
  param: {
    heaInvestigationPlanId: stringNull
    stepCd: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  height: '',
  param: () => {
    return {
      heaInvestigationPlanId: '',
      stepCd: ''
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
const investigation = ref<investigationType>({
  heaInvestigationPlanId: '',
  plantCd: '',
  investigationPlanName: '',
  year: '',
  heaInvestigationStepCd: '',
  investigationStartDate: '',
  investigationEndDate: '',
  period: [],
  deptCd: '',
  userId: '',
  investigationDeptCd: '',
  agency: '',
  remark: '',
  regUserId: '',
  chgUserId: '',
  sops: [],
  sopTable: []
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'HEA_INVESTIGATION_PLAN',
  taskKey: ''
})
const heavyWorks = ref([])
const detailUrl = ref('')
const fileUpload = ref<any>(null)
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'heaMuscleSopId' },
    { index: 1, colName: 'heaMuscleSopId' }
  ],
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'sopName',
      field: 'sopName',
      label: '단위작업',
      align: 'left',
      sortable: false,
      style: 'width:120px'
    },
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
      style: 'width:200px'
    },
    {
      name: 'workTime',
      field: 'workTime',
      label: '작업시간',
      align: 'center',
      sortable: false,
      style: 'width:70px'
    },
    {
      name: 'workCnt',
      field: 'workCnt',
      label: '횟수',
      align: 'center',
      sortable: false,
      style: 'width:70px'
    },
    {
      name: 'result',
      field: 'result',
      label: '결과',
      child: [
        {
          name: 'workTotal',
          field: 'workTotal',
          label: '총점수',
          align: 'center',
          sortable: false,
          style: 'width:70px'
        },
        {
          name: 'assessResult',
          field: 'assessResult',
          label: '평가결과',
          align: 'center',
          sortable: false,
          style: 'width:70px'
        }
      ]
    }
  ],
  data: []
})
const heavyWorkUrl = ref('')
const hazardUrl = ref('')
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => true)

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
  detailUrl.value = selectConfig.hea.muscleSystem.investigationPlan.get.url
  heavyWorkUrl.value = selectConfig.hea.heavyWork.list.url
  hazardUrl.value = selectConfig.hea.muscleSystem.muscleSop.invest.list.url

  // code setting
  // list setting
  getDetail()
  getHazardDetail()
  getHeavyWorks()
}
/******************************
 * TODO (목적): 근골격계 부담작업 조회
 *******************************/
function getHeavyWorks() {
  $http({
    url: heavyWorkUrl.value,
    method: 'GET',
    params: {
      plantCd: investigation.value.plantCd ? investigation.value.plantCd : user.value.plantCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    heavyWorks.value = _result.data
  })
}
function getHazardDetail() {
  $http({
    url: hazardUrl.value,
    method: 'GET',
    params: {
      heaInvestigationPlanId: props.param.heaInvestigationPlanId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 근골격계 조사계획 상세조회
 *******************************/
function getDetail() {
  $http({
    url: $format(detailUrl.value, props.param.heaInvestigationPlanId),
    method: 'GET'
  }).then((_result: any) => {
    _.extend(investigation.value, _result.data)
    investigation.value.period = [
      investigation.value.investigationStartDate,
      investigation.value.investigationEndDate
    ]
    attachInfo.value.taskKey = props.param.heaInvestigationPlanId
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
