<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-field type="user" label="근로자" name="userId" v-model:value="searchParam.userId" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            type="year"
            label="조사년도"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            stepperGrpCd="HEA_BRAIN_CARDIOVASCULAR_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="heaBrainCardiovascularStepCd"
            label="진행단계"
            v-model:value="searchParam.heaBrainCardiovascularStepCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept type="search" label="작성부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div>
      </template>
    </c-search-box>
    <c-table
      title="뇌심혈관계 종합조사 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'brainCardiovascular'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const searchParam = ref({
  period: [],
  userId: '',
  heaBrainCardiovascularStepCd: null,
  deptCd: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false,
      style: 'width:150px'
    },
    {
      name: 'userName',
      field: 'userName',
      label: '근로자',
      align: 'center',
      sortable: false,
      style: 'width:120px',
      type: 'link'
    },
    {
      name: 'sexName',
      field: 'sexName',
      label: '성별',
      align: 'center',
      sortable: false,
      style: 'width:80px'
    },
    {
      name: 'age',
      field: 'age',
      label: '나이(조사시점)',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'surveyDate',
      field: 'surveyDate',
      label: '조사일',
      align: 'center',
      sortable: false,
      style: 'width:120px'
    },
    {
      name: 'heaBrainCardiovascularStepName',
      field: 'heaBrainCardiovascularStepName',
      label: '진행상태',
      align: 'center',
      sortable: false,
      style: 'width:150px'
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const listUrl = ref('')

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
  listUrl.value = selectConfig.hea.bcs.survey.list.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
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
/******************************
 * TODO (목적): 링크 클릭시 팝업
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '뇌심혈관계 조사 상세'
  popupOptions.value.param = {
    heaBrainCardiovascularSurveyId: row ? row.heaBrainCardiovascularSurveyId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./brainCardiovascularDetail.vue`))
  )
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
