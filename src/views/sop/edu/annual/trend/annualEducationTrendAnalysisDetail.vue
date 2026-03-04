<template>
  <div class="row">
    <div class="col-12">
      <c-card title="상세" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <!-- <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2 col-xl-2">
            <c-plant :disabled="true" type="edit" name="plantCd" v-model:value="eduInfo.plantCd" />
          </div> -->
          <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              :disabled="true"
              label="교육년도"
              type="year"
              name="educationYear"
              v-model:value="eduInfo.educationYear"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :disabled="true"
              label="교육과정"
              name="educationCourseName"
              v-model:value="eduInfo.educationCourseName"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :disabled="true"
              label="교육종류1"
              name="educationKindCdLargeName"
              v-model:value="eduInfo.educationKindCdLargeName"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :disabled="true"
              label="교육종류2"
              name="educationKindCdSmallName"
              v-model:value="eduInfo.educationKindCdSmallName"
            />
          </div>
        </template>
      </c-card>
      <c-card
        title="계획 대비 결과 추이 종합정보"
        class="cardClassDetailForm annual-education-trend-card"
      >
        <template v-slot:card-detail>
          <div class="col-12">
            <span v-html="convertEnter(infoMessage)" style="color: #3c3c3c" />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-12">
      <c-table
        ref="table"
        title="연간 교육 계획에 포함된 교육일정"
        tableId="table"
        :columns="grid.columns"
        :data="eduTrend.planResults"
        gridHeight="300px"
        :filtering="false"
        :checkClickFlag="false"
        :isExcelDown="true"
        @linkClick="linkClick"
      />
    </div>
    <div class="col-12" style="margin-bottom: 60px !important">
      <c-table
        ref="table"
        title="연간 교육 계획에 포함되지 않은 교육일정"
        tableId="table"
        :columns="grid.columns"
        :data="eduTrend.nonPlanResults"
        gridHeight="300px"
        :filtering="false"
        :checkClickFlag="false"
        :isExcelDown="true"
        @linkClick="linkClick"
      />
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
import { annualEduTrendType } from '../../annual/annualEduPlan'
import { eduResultType } from '../../result/eduResult'
import { convertEnter } from '@utils/common'
/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'annualEducationTrendAnalysisDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  popupParam: annualEduTrendDetailPopupParamType
}
interface annualEduTrendDetailPopupParamType {
  eduEducationId: stringNull
  disabled: boolean
  educationYear: stringNull
  eduCourseId: stringNull
  educationMonth: stringNull
  plantCd: stringNull
  educationCourseName: stringNull
  educationKindCdLargeName: stringNull
  educationKindCdSmallName: stringNull
}
interface eduInfoType {
  plantCd: stringNull
  educationYear: stringNull
  educationCourseName: stringNull
  educationKindCdLargeName: stringNull
  educationKindCdSmallName: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
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
      eduEducationId: '',
      disabled: false,
      educationYear: '',
      eduCourseId: '',
      educationMonth: '',
      plantCd: '',
      educationCourseName: '',
      educationKindCdLargeName: '',
      educationKindCdSmallName: ''
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'educationCourseName',
      field: 'educationCourseName',
      label: '교육과정',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'educationName',
      field: 'educationName',
      label: '교육명',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'educationTypeName',
      field: 'educationTypeName',
      label: '교육구분',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'mainTargetAudience',
      field: 'mainTargetAudience',
      label: '주요 대상자',
      style: 'width:150px',
      align: 'left',
      sortable: false
    },
    {
      name: 'educationDate',
      field: 'educationDate',
      label: '교육기간',
      style: 'width:150px',
      align: 'center',
      sortable: false
    },
    {
      name: 'educationMethodName',
      field: 'educationMethodName',
      label: '교육방법',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'educationLocation',
      field: 'educationLocation',
      label: '교육장소',
      style: 'width:100px',
      align: 'left',
      sortable: false
    },
    {
      name: 'estimatedEducationExpenses',
      field: 'estimatedEducationExpenses',
      label: '예산',
      style: 'width:100px',
      align: 'right',
      sortable: false,
      type: 'cost'
    },
    {
      name: 'attendee',
      field: 'attendee',
      label: '교육인원',
      child: [
        {
          name: 'totalEduAttendeeCnt',
          field: 'totalEduAttendeeCnt',
          label: '총원',
          style: 'width:80px',
          align: 'right',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'graduates',
          field: 'graduates',
          label: '이수',
          child: [
            {
              name: 'insideEduGraduatesCnt',
              field: 'insideEduGraduatesCnt',
              label: '내부',
              style: 'width:80px',
              align: 'right',
              sortable: false,
              type: 'cost'
            },
            {
              name: 'outsideEduGraduatesCnt',
              field: 'outsideEduGraduatesCnt',
              label: '외부',
              style: 'width:80px',
              align: 'right',
              sortable: false,
              type: 'cost'
            },
            {
              name: 'totalEduGraduatesCnt',
              field: 'totalEduGraduatesCnt',
              label: '총원',
              style: 'width:80px',
              align: 'right',
              sortable: false,
              type: 'cost'
            }
          ]
        },
        {
          name: 'fail',
          field: 'fail',
          label: '미이수',
          child: [
            {
              name: 'insideEduFailCnt',
              field: 'insideEduFailCnt',
              label: '내부',
              style: 'width:80px',
              align: 'right',
              sortable: false,
              type: 'cost'
            },
            {
              name: 'outsideEduFailCnt',
              field: 'outsideEduFailCnt',
              label: '외부',
              style: 'width:80px',
              align: 'right',
              sortable: false,
              type: 'cost'
            },
            {
              name: 'totalEduFailCnt',
              field: 'totalEduFailCnt',
              label: '총원',
              style: 'width:80px',
              align: 'right',
              sortable: false,
              type: 'cost'
            }
          ]
        }
      ]
    }
  ],
  data: []
})
const eduTrend = ref<annualEduTrendType>({
  sumEstimatedEducationExpenses: 0,
  totalEduAttendeeCnt: 0,
  insideEduGraduatesCnt: 0,
  outsideEduGraduatesCnt: 0,
  totalEduGraduatesCnt: 0,
  insideEduFailCnt: 0,
  outsideEduFailCnt: 0,
  totalEduFailCnt: 0,
  planResults: [],
  nonPlanResults: []
})
const eduInfo = ref<eduInfoType>({
  plantCd: null,
  educationYear: '',
  educationCourseName: '',
  educationKindCdLargeName: '',
  educationKindCdSmallName: ''
})
const getUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const infoMessage = computed(() => {
  let returnText = ``
  if (eduTrend.value) {
    if (eduTrend.value.sumEstimatedEducationExpenses > 0) {
      returnText =
        `✔ ${$language('예산계획금액이 증가하였습니다.')}` +
        ` ▶️ <span style="font-weight:800; color:tomato">${toThousandFilter(eduTrend.value.sumEstimatedEducationExpenses)} </span> 원<br/>`
    } else returnText = `✔ ${$language('예산계획금액 변동없습니다.')}<br/>`
    if (eduTrend.value.totalEduAttendeeCnt > 0) {
      returnText +=
        `✔ ${$language('교육인원이 증가하였습니다.')}` +
        ` ▶️ <span style="font-weight:800; color:tomato">${eduTrend.value.totalEduAttendeeCnt} </span> 명<br/>` +
        `✔ ${$language('교육 이수한 인원은 (내부/외부/총원) 증가하였습니다.')}` +
        ` ▶️ <span class="text-teal" style="font-weight:800;">${eduTrend.value.insideEduGraduatesCnt} / ${eduTrend.value.outsideEduGraduatesCnt} / ${eduTrend.value.totalEduGraduatesCnt}</span> 명<br/>` +
        `✔ ${$language('교육 이수하지 못 한 인원은 (내부/외부/총원) 증가하였습니다.')}` +
        ` ▶️ <span style="font-weight:800; color:tomato">${eduTrend.value.insideEduFailCnt} / ${eduTrend.value.outsideEduFailCnt} / ${eduTrend.value.totalEduFailCnt}</span> 명<br/>`
    } else returnText += `✔ ${$language('교육인원 변동없습니다.')}`
    return returnText
  }
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
  getUrl.value = selectConfig.sop.edu.annual.trend.get.url
  // code setting
  if (props.popupParam.eduCourseId) {
    eduInfo.value.plantCd = props.popupParam.plantCd
    eduInfo.value.educationYear = props.popupParam.educationYear
    eduInfo.value.educationCourseName = props.popupParam.educationCourseName
    eduInfo.value.educationKindCdLargeName = props.popupParam.educationKindCdLargeName
    eduInfo.value.educationKindCdSmallName = props.popupParam.educationKindCdSmallName
  }
  // list setting
  getList()
}
/******************************
 * TODO (목적): 전체 조회
 *******************************/
function getList() {
  if (eduInfo.value.plantCd && eduInfo.value.educationYear) {
    $http({
      url: getUrl.value,
      method: 'GET',
      params: {
        plantCd: eduInfo.value.plantCd,
        educationYear: eduInfo.value.educationYear,
        eduCourseId: props.popupParam.eduCourseId,
        educationMonth: props.popupParam.educationMonth
      }
    }).then((_result: any) => {
      _.extend(eduTrend.value, _result.data)
    })
  } else {
    eduTrend.value = {
      sumEstimatedEducationExpenses: 0,
      totalEduAttendeeCnt: 0,
      insideEduGraduatesCnt: 0,
      outsideEduGraduatesCnt: 0,
      totalEduGraduatesCnt: 0,
      insideEduFailCnt: 0,
      outsideEduFailCnt: 0,
      totalEduFailCnt: 0,
      planResults: [],
      nonPlanResults: []
    }
  }
}
/******************************
 * TODO (목적): 교육계획 및 결과 상세 조회
 *******************************/
function linkClick(row: eduResultType) {
  popupOptions.value.title = '교육계획 및 결과 상세'
  popupOptions.value.param = {
    eduEducationId: row.eduEducationId ? row.eduEducationId : '',
    documentStatusCd: row.documentStatusCd === 'ESC000001' ? 'ESC0000005' : 'ESC0000010'
  }

  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`../../result/educationResultDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.annual-education-trend-card
  .customCardbody
    padding-top: 0px !important
</style>
