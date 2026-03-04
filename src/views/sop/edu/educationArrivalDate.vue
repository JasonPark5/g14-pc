<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="getCourse"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            :isFirstValue="false"
            name="deptCd"
            v-model:value="searchParam.deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
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
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="EDU_KIND_FST_CD"
            itemText="codeName"
            itemValue="code"
            name="educationKindCdLarge"
            label="교육종류1"
            v-model:value="searchParam.educationKindCdLarge"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            :comboItems="lawCheckItems"
            itemText="codeName"
            itemValue="code"
            name="legalEducationFlag"
            label="법정교육여부"
            v-model:value="searchParam.legalEducationFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="법정교육대상자 도래일 목록"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :checkClickFlag="false"
      rowKey="eduEducationId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'customDate'">
          <span>
            {{ props.row.nextDate }}
            <q-badge
              v-if="props.row.arrivalFlag === 'Y'"
              color="negative"
              :label="props.row.diffDay + '일전'"
              class="blinking"
            />
          </span>
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { eduCourseType } from './cc/eduCourse'

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
  name: 'educationArrivalDate'
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
  deptCd: stringNull
  eduCourseId: stringNull
  educationKindCdLarge: stringNull
  legalEducationFlag: stringNull
}
interface gridType {
  merge: objectStringNumber
  columns: tableColumnType
  data: Array<any>
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
  deptCd: '',
  eduCourseId: null,
  educationKindCdLarge: null,
  legalEducationFlag: null
})
const lawCheckItems = ref<codeMasterType>([
  { code: 'Y', codeName: 'O' },
  { code: 'N', codeName: 'X' }
])
const courseItems = ref<Array<eduCourseType>>([])
const listUrl = ref('')
const courseUrl = ref('')

const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'userId' },
    { index: 1, colName: 'userId' },
    { index: 2, colName: 'userId' },
    { index: 3, colName: 'userId' },
    { index: 4, colName: 'userId' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '대상자',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '직책',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'spotName',
      field: 'spotName',
      label: '직위',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'educationCourseName',
      field: 'educationCourseName',
      label: '교육과정',
      style: 'width:400px',
      align: 'left',
      sortable: true
    },
    {
      name: 'educationKindName',
      field: 'educationKindName',
      label: '교육종류1',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationEndDate',
      field: 'educationEndDate',
      label: '최근교육 이수일',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationCycleName',
      field: 'educationCycleName',
      label: '법정교육주기',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'customDate',
      field: 'customDate',
      label: '다음예정 교육일',
      style: 'width:100px',
      type: 'custom',
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
  listUrl.value = selectConfig.sop.edu.arrivaldate.list.url
  // code setting
  // list setting
  getCourse()
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function getCourse() {
  searchParam.value.eduCourseId = null
  if (searchParam.value.plantCd) {
    $http({
      url: courseUrl.value,
      method: 'GET',
      params: { plantCd: searchParam.value.plantCd, useFlag: 'Y' }
    }).then((_result: any) => {
      courseItems.value = _result.data
    })
  } else {
    courseItems.value = []
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
