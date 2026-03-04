<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="none" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            name="search"
            type="year"
            default="today"
            label="교육년도"
            v-model:value="searchParam.educationYear"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="EDU_KIND_FST_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="educationKindCdLarge"
            label="교육종류1"
            v-model:value="searchParam.educationKindCdLarge"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="EDU_KIND_SEC_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="educationKindCdSmall"
            label="교육종류2"
            v-model:value="searchParam.educationKindCdSmall"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="EDU_CLASS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="educationTypeCd"
            label="교육구분"
            v-model:value="searchParam.educationTypeCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="연간 교육 추이 분석 목록"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :filtering="false"
      :checkClickFlag="false"
      :isExcelDown="true"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <q-btn
          class="tableinnerBtn"
          flat
          align="center"
          color="blue-6"
          label=""
          @click.stop="linkClick(props.row, col)"
        >
          <template v-slot:default>
            <span v-html="trendMonth(props, col)" />
          </template>
        </q-btn>
      </template>
    </c-table>
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
import { annualCommonSearchParamType, annualEduPlanType } from '../annualEduPlan'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'annualEducationTrendAnalysis.vue'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface gridType {
  merge: objectStringNumber
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
const searchParam = ref<annualCommonSearchParamType>({
  plantCd: null,
  // educationYear: '2022',
  educationKindCdSmall: null,
  educationKindCdLarge: null,
  educationTypeCd: null,
  legalEduYn: null
})
const yearEdu = ref<annualEduPlanType>({
  eduEducationYearPlanId: '', // 연간교육 일련번호
  plantCd: '', // 사업장 코드
  plantName: '', // 사업장
  educationYear: '', // 교육년도
  sysApprovalRequestId: '', // 결재요청번호
  approvalStatusCd: '', // 결재관련 결재상태
  approvalStatusName: ''
})
const searchYear = ref('')
const yearEduDetailUrl = ref('')
const listUrl = ref('')
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'eduCourseId' },
    { index: 1, colName: 'eduCourseId' }
  ],
  columns: [],
  data: []
})

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
  listUrl.value = selectConfig.sop.edu.annual.trend.list.url
  yearEduDetailUrl.value = selectConfig.sop.edu.yearEdu.get.url
  // code setting
  const yearmonth = []
  for (let i = 1; i <= 12; i++) {
    const month = _.padStart(String(i), 2, '0')
    yearmonth.push({
      name: 'monTrend' + month,
      field: 'monTrend' + month,
      label: i + '월',
      align: 'center',
      sortable: false,
      style: 'width:65px',
      type: 'custom'
    })
  }
  const yearLabel = `${$language('연간교육일정')} <span style="font-size:0.9em;font-weight:500;color:tomato">✅ ${$language('연간교육일정에서의 변동사항이 표시됩니다.')}</span>`
  grid.value.columns = [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: true,
      fix: true
    },
    {
      name: 'educationCourseName',
      field: 'educationCourseName',
      label: '교육과정',
      align: 'left',
      style: 'width:200px',
      sortable: true,
      type: 'link',
      fix: true
    },
    {
      name: 'educationKindCdLargeName',
      field: 'educationKindCdLargeName',
      label: '교육종류1',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationKindCdSmallName',
      field: 'educationKindCdSmallName',
      label: '교육종류2',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationTypeName',
      field: 'educationTypeName',
      label: '교육구분',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      label: yearLabel,
      align: 'center',
      sortable: false,
      child: yearmonth
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      style: 'width:200px',
      align: 'left',
      sortable: true
    },
    {
      name: 'departmentDeptName',
      field: 'departmentDeptName',
      label: '주관부서',
      style: 'width:100px',
      align: 'center',
      sortable: true
    }
  ]
  searchParam.value.educationYear = '2021'
  // list setting
  getList()
}
function getList() {
  if (!searchParam.value.educationYear) {
    message.alert({
      title: '안내',
      message: '교육년도를 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  // 전체조회
  getYearEdu()
  searchYear.value = _.clone(searchParam.value.educationYear)
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 년도별 조회
 *******************************/
function getYearEdu() {
  $http({
    url: $format(
      yearEduDetailUrl.value,
      searchParam.value.plantCd,
      searchParam.value.educationYear
    ),
    method: 'GET'
  }).then((_result: any) => {
    yearEdu.value = _result.data
  })
}
/******************************
 * TODO (목적): 월별 트렌드 분석
 *******************************/
/* eslint-disable no-unused-vars */
function trendMonth(_props: any, col: any) {
  const plan = 'monplan'
  const result = 'monresult'
  let returnText = ``
  const month = col.name.slice(-2)

  if (_props.row[plan + month] === _props.row[result + month]) {
    returnText = _props.row[plan + month]
  } else {
    returnText = `<span style="font-weight:800; color:tomato">
      ${_props.row[plan + month]} → ${_props.row[result + month]}</span>`
  }
  return returnText
}
/******************************
 * TODO (목적): 상세 클릭
 *******************************/
function linkClick(result: any, col: any) {
  let title = ''
  let param = null

  if (col.name === 'educationCourseName') {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`../../cc/educationCourseDetail.vue`))
    )
    param = {
      eduCourseId: result.eduCourseId ? result.eduCourseId : ''
    }
    popupOptions.value.isFull = true
    title = '교육과정 마스터 상세'
  } else {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./annualEducationTrendAnalysisDetail.vue`))
    )
    param = {
      eduEducationId: result.eduEducationId ? result.eduEducationId : '',
      eduCourseId: result.eduCourseId ? result.eduCourseId : '',
      educationMonth: col.name.substring(col.name.length - 2),
      educationYear: result.educationYear,
      plantCd: result.plantCd,
      educationCourseName: result.educationCourseName,
      educationKindCdLargeName: result.educationKindCdLargeName,
      educationKindCdSmallName: result.educationKindCdSmallName
    }
    popupOptions.value.isFull = false
    title = $language('연간교육계획 상세') + ' [' + $language(col.label) + ']'
  }
  popupOptions.value.title = title
  popupOptions.value.param = param
  popupOptions.value.width = '95%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
