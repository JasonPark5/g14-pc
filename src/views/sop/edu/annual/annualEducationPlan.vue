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
            default="today"
            type="year"
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
      title="연간교육계획 목록"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :checkClickFlag="false"
      :isExcelDown="true"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-appr-btn
            ref="appr-btn"
            name="work-permit-appr-btn"
            :editable="editable"
            :approvalInfo="approvalInfo"
            @requestAfterAction="getList"
          />
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:suffixTitle>
        <span
          v-if="yearEdu.sysApprovalRequestId"
          class="text-red ml-10"
          style="font-size: 0.8em; font-weight: 500"
        >
          <!-- {{searchYear}}년 {{yearEdu.plantName}} 연간교육계획은 현재 <b>{{yearEdu.approvalStatusName}}</b> 상태입니다. -->
          {{ suffixLabel }}
        </span>
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
import { annualEduPlanType, annualCommonSearchParamType } from './annualEduPlan'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'annualEducationPlan'
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
  educationYear: null,
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
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'eduCourseId' },
    { index: 1, colName: 'eduCourseId' }
  ],
  columns: [],
  data: []
})
const listUrl = ref('')
const yearEduDetailUrl = ref('')
const suffixLabel = ref('')
const searchYear = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: yearEdu.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: yearEdu.value.approvalStatusCd,
    apprEditable:
      Boolean(!yearEdu.value.sysApprovalRequestId) && Boolean(yearEdu.value.eduEducationYearPlanId), // 결재버튼 활성화 기준
    param: yearEdu.value, // 결재 param
    approvalUrl: null, // 결재 url
    isApproval: null, // 결재 submit
    approvalTypeCd: 'APTC000005', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      eduEducationYearPlanId: yearEdu.value.eduEducationYearPlanId,
      isApprContent: true
    },
    approvalRequestName:
      searchParam.value.educationYear + '년 ' + yearEdu.value.plantName + ' 연간교육계획 결재', // 결재요청명 (문서 title)
    approvalConnId: yearEdu.value.eduEducationYearPlanId // 결재연결용 업무일련번호 (문서 key)
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
  listUrl.value = selectConfig.sop.edu.annual.list.url
  yearEduDetailUrl.value = selectConfig.sop.edu.yearEdu.get.url
  // code setting
  const yearmonth = []
  for (let i = 1; i <= 12; i++) {
    const month = _.padStart(String(i), 2, '0')
    yearmonth.push({
      name: 'mon' + month,
      field: 'mon' + month,
      label: $language(i + '월'),
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'monplan' + month,
          field: 'monplan' + month,
          label: '계획',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          type: 'link'
        },
        {
          name: 'monresult' + month,
          field: 'monresult' + month,
          label: '결과',
          align: 'center',
          style: 'width:40px',
          sortable: false,
          type: 'link'
        }
      ]
    })
  }
  const yearLabel = `${$language('연간교육일정')} <span style="font-size:0.9em;font-weight:500;color:tomato">✅${$language('연간교육일정으로 세운 교육계획정보가 카운트됩니다.')} </span>`
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
      style: 'width:120px',
      align: 'left',
      sortable: true
    }
  ]
  searchParam.value.educationYear = '2021'
  // list setting
  getList()
}
/******************************
 * TODO (목적): 연간교육계획 목록 조회
 *******************************/
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

    _.forEach(grid.value.data, (_item) => {
      _item.eduKey = uid()
    })
  })
}
/******************************
 * TODO (목적): 연간교육계획 결재 조회
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
    if (_result.data) {
      yearEdu.value = _result.data
    } else {
      yearEdu.value = {
        eduEducationYearPlanId: '', // 연간교육 일련번호
        plantCd: '', // 사업장 코드
        plantName: '', // 사업장
        educationYear: '', // 교육년도
        sysApprovalRequestId: '', // 결재요청번호
        approvalStatusCd: '', // 결재관련 결재상태
        approvalStatusName: ''
      }
    }
    suffixLabel.value =
      $language('연간교육계획은 결재진행상태입니다.') +
      ' [' +
      yearEdu.value.approvalStatusName +
      ']'
  })
}
/******************************
 * TODO (목적): 연간교육계획 상세 조회
 *******************************/
function linkClick(row: any, col: any) {
  let title = ''
  let param = null
  if (!col) {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./annualEducationPlanDetail.vue`))
    )
    param = {
      disabled: false,
      eduEducationId: '',
      eduCourseId: ''
    }
    popupOptions.value.isFull = false
    title = '연간교육계획 상세'
  } else if (col.name === 'educationCourseName') {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`../cc/educationCourseDetail.vue`))
    )
    param = {
      eduCourseId: row.eduCourseId ? row.eduCourseId : ''
    }
    popupOptions.value.isFull = true
    title = '교육과정 마스터 상세'
  } else {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./annualEducationPlanDetail.vue`))
    )
    param = {
      eduEducationId: row.eduEducationId ? row.eduEducationId : '',
      eduCourseId: row.eduCourseId ? row.eduCourseId : '',
      educationMonth: row ? col.name.substring(col.name.length - 2) : '',
      educationYear: row ? row.educationYear : '',
      plantCd: row ? row.plantCd : '',
      disabled: true,
      // 2022-05-12 kdh | 교육, 결과/완료 구분자 param
      stepFlag: col.name.indexOf('plan') > -1 ? 'N' : 'Y',
      approvalStatusCd: yearEdu.value.approvalStatusCd
    }
    popupOptions.value.isFull = false
    // result.educationCourseName + '의 ' + this.searchYear + '년 ' +
    // col.label + ' 연간교육계획 상세'
    title =
      $language(col.name.indexOf('plan') > -1 ? '연간교육계획' : '연간교육결과') +
      ' [' +
      row.educationCourseName +
      ' | ' +
      searchYear.value +
      ']'
  }
  popupOptions.value.title = title
  popupOptions.value.param = param
  popupOptions.value.width = '95%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  table.value.selected = []
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
