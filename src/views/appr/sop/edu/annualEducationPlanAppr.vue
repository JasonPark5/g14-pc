<template>
  <div>
    <c-table
      ref="table"
      title="연간 교육 계획 목록"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      gridHeight="550px"
      :checkClickFlag="false"
      :isExcelDown="true"
      @linkClick="linkClick"
    />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'annualEducationPlanAppr'
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
interface propType {
  popupParam: eduApprPopupParamType
}
interface eduApprPopupParamType {
  eduEducationYearPlanId: stringNull
}
interface searchParamType {
  plantCd: stringNull
  educationYear: stringNull
  educationKindCdSmall: stringNull
  educationKindCdLarge: stringNull
  educationTypeCd: stringNull
  legalEduYn: stringNull
  eduEducationYearPlanId: stringNull
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
      eduEducationYearPlanId: ''
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  educationYear: '',
  educationKindCdSmall: null,
  educationKindCdLarge: null,
  educationTypeCd: null,
  legalEduYn: null,
  eduEducationYearPlanId: ''
})
const searchYear = ref('')
const listUrl = ref('')
const grid = ref<gridType>({
  columns: [],
  data: []
})
const table = ref<any>(null)
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
  listUrl.value = selectConfig.sop.edu.annual.list.url
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
  const yearLabel =
    `${$language('연간교육일정')} <span style="font-size:0.9em;font-weight:500;color:red">` +
    `(✅${$language('연간교육일정으로 세운 교육계획정보가 카운트됩니다.')} )</span>`
  grid.value.columns = [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationCourseName',
      field: 'educationCourseName',
      label: '교육과정',
      align: 'left',
      style: 'width:200px',
      sortable: true,
      type: 'link'
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
  if (props.popupParam.eduEducationYearPlanId) {
    searchParam.value.eduEducationYearPlanId = props.popupParam.eduEducationYearPlanId
  }
  // list setting
  getList()
}
/******************************
 * TODO (목적): 연간교육계획 목록 조회
 *******************************/
function getList() {
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
 * TODO (목적): 상세 클릭
 *******************************/
/* eslint-disable no-unused-vars */
function linkClick(row: any, col: any) {
  annualPopup(row, col, true)
}
function annualPopup(result: any, col: any, flag: boolean) {
  const selectData = table.value.getSelected()

  let title = ''
  let param = null

  if (!col) {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/edu/annual/annualEducationPlanDetail.vue`))
    )
    param = {
      selectData: selectData ? selectData : [],
      disabled: false,
      eduEducationId: '',
      eduCourseId: ''
    }
    popupOptions.value.isFull = false
    title = '연간교육계획 상세'
  } else if (col.name === 'educationCourseName') {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/edu/cc/educationCourseDetail.vue`))
    )
    param = {
      eduCourseId: result.eduCourseId ? result.eduCourseId : ''
    }
    popupOptions.value.isFull = true
    title = '교육과정 마스터 상세'
  } else {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/edu/annual/annualEducationPlanDetail.vue`))
    )
    param = {
      eduEducationId: result.eduEducationId ? result.eduEducationId : '',
      eduCourseId: result.eduCourseId ? result.eduCourseId : '',
      educationMonth: flag ? col.name.substring(col.name.length - 2) : '',
      educationYear: flag ? result.educationYear : '',
      plantCd: flag ? result.plantCd : '',
      disabled: true,
      /**
       * 2022-05-12 kdh
       * 교육, 결과/완료 구분자 param
       */
      stepFlag: col.name.indexOf('plan') > -1 ? 'N' : 'Y'
    }
    popupOptions.value.isFull = false
    title =
      result.educationCourseName +
      '의 ' +
      searchYear.value +
      '년 ' +
      col.label +
      ' 연간교육계획 상세'
  }
  popupOptions.value.title = title
  popupOptions.value.param = param
  popupOptions.value.width = '95%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup(type: any) {
  table.value.selected = []
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (type === 'COMPLETE' || type === 'SAVE') {
    message.requestSuccess()
  }
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
