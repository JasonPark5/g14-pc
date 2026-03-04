<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="edit"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="getCourse"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="courseItems"
            type="search"
            itemText="educationCourseName"
            itemValue="eduCourseId"
            name="eduCourseId"
            label="교육과정"
            v-model:value="searchParam.eduCourseId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="EDU_STATUS_CD"
            itemText="codeName"
            itemValue="code"
            name="documentStatusCd"
            label="진행상태"
            v-model:value="searchParam.documentStatusCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            name="educationPeriod"
            label="교육기간"
            v-model:value="searchParam.educationPeriod"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            type="search"
            codeGroupCd="EDU_KIND_FST_CD"
            itemText="codeName"
            itemValue="code"
            name="educationKindCdLarge"
            label="교육종류1"
            v-model:value="searchParam.educationKindCdLarge"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            type="search"
            codeGroupCd="EDU_KIND_SEC_CD"
            itemText="codeName"
            itemValue="code"
            name="educationKindCdSmall"
            label="교육종류2"
            v-model:value="searchParam.educationKindCdSmall"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="EDU_CLASS_CD"
            itemText="codeName"
            itemValue="code"
            name="educationTypeCd"
            label="교육구분"
            v-model:value="searchParam.educationTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept type="search" label="주관부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="교육계획 및 결과 목록"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      checkDisableColumn="disable"
      :checkClickFlag="false"
      rowKey="eduEducationId"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn label="등록" v-if="editable" icon="add" @btnClicked="linkClick" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { eduCourseType } from '../cc/eduCourse'
import { eduResultType } from './eduResult'

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
  name: 'educationResult'
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
interface searchParamType {
  plantCd: stringNull
  documentStatusCd: stringNull
  startYmd: stringNull
  endYmd: stringNull
  educationPeriod: arrayString
  eduCourseId: stringNull
  educationKindCdSmall: stringNull
  educationKindCdLarge: stringNull
  educationTypeCd: stringNull
  deptCd: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<eduResultType>
}

/******************************
 * @inject_선언
 *******************************/

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
const searchParam = ref<searchParamType>({
  plantCd: null,
  documentStatusCd: null,
  startYmd: '',
  endYmd: '',
  educationPeriod: [],
  eduCourseId: '',
  educationKindCdSmall: null,
  educationKindCdLarge: null,
  educationTypeCd: null,
  deptCd: ''
})
const listUrl = ref('')
const deleteUrl = ref('')
const courseUrl = ref('')
const courseItems = ref<Array<eduCourseType>>([])
const grid = ref<gridType>({
  columns: [
    {
      fix: true,
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      fix: true,
      name: 'educationName',
      field: 'educationName',
      label: '교육명',
      style: 'width:180px',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      fix: true,
      name: 'educationCourseName',
      field: 'educationCourseName',
      label: '교육과정',
      style: 'width:160px',
      align: 'left',
      sortable: true
    },
    {
      fix: true,
      name: 'educationDate',
      field: 'educationDate',
      label: '교육일',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'eduPlanTime',
      field: 'eduPlanTime',
      label: '교육시간',
      style: 'width:100px',
      align: 'center',
      sortable: true
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
      name: 'departmentDeptName',
      field: 'departmentDeptName',
      label: '주관부서',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'documentStatusName',
      field: 'documentStatusName',
      label: '진행상태',
      style: 'width:90px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationMethodName',
      field: 'educationMethodName',
      style: 'width:90px',
      label: '교육방법',
      align: 'center',
      sortable: true
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      style: 'width:180px',
      label: '관련법규',
      align: 'left',
      sortable: true
    },
    {
      name: 'eduQuestionFlag',
      field: 'eduQuestionFlag',
      label: '문제풀이',
      style: 'width:50px',
      align: 'center',
      sortable: true
    }
  ],
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
  courseUrl.value = selectConfig.sop.edu.course.list.url
  listUrl.value = selectConfig.sop.edu.result.list.url
  deleteUrl.value = transactionConfig.sop.edu.annual.delete.url
  // code setting
  // list setting
  getCourse()
  getList()
}
/******************************
 * TODO (목적): 교육과정 목록 조회
 *******************************/
function getCourse() {
  if (searchParam.value.plantCd) {
    $http({
      url: courseUrl.value,
      method: 'GET',
      params: { plantCd: searchParam.value.plantCd, useFlag: 'Y' }
    }).then((_result: any) => {
      courseItems.value = _result.data
      searchParam.value.eduCourseId = null
    })
  } else {
    courseItems.value = []
  }
}
/******************************
 * TODO (목적): 교육계획 및 결과 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/* eslint-disable no-unused-vars */
/******************************
 * TODO (목적): 교육계획 및 결과 상세 조회
 *******************************/
function linkClick(row: eduResultType) {
  popupOptions.value.title = '교육계획 상세'
  popupOptions.value.param = {
    plantCd: row ? row.plantCd : searchParam.value.plantCd,
    eduEducationId: row ? row.eduEducationId : '',
    stepCd: row
      ? row.documentStatusCd === 'ESC000001'
        ? 'ESC0000005'
        : 'ESC0000010'
      : 'ESC0000005'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./educationResultDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
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
