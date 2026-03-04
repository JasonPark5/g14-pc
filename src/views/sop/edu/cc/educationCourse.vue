<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            :isEnterprise="true"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
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
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
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
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            itemText="codeName"
            codeGroupCd="EDU_CLASS_CD"
            itemValue="code"
            name="educationTypeCd"
            label="교육구분"
            v-model:value="searchParam.educationTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            label="법정교육여부"
            itemText="codeName"
            itemValue="code"
            type="search"
            :comboItems="flagItems"
            name="legalEducationFlag"
            v-model:value="searchParam.legalEducationFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            type="search"
            :comboItems="useFlagItems"
            itemText="codeName"
            itemValue="code"
            label="사용여부"
            name="useFlag"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="교육과정 목록"
      :columns="grid.columns"
      :data="grid.data"
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
import { eduCourseType } from './eduCourse'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'educationCourse'
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
  educationKindCdSmall: stringNull
  educationKindCdLarge: stringNull
  educationTypeCd: stringNull
  useFlag: stringNull
  legalEducationFlag: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<eduCourseType>
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
const listUrl = ref('')
const useFlagItems = ref<Array<any>>([])
const flagItems = ref<Array<any>>([])
const searchParam = ref<searchParamType>({
  plantCd: null,
  educationKindCdSmall: null,
  educationKindCdLarge: null,
  educationTypeCd: null,
  useFlag: 'Y',
  legalEducationFlag: null
})
const grid = ref<gridType>({
  columns: [
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
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationKindCdSmallName',
      field: 'educationKindCdSmallName',
      label: '교육종류2',
      style: 'width:120px',
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
      name: 'legalEducationFlagName',
      field: 'legalEducationFlagName',
      label: '법정교육여부',
      style: 'width:90px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationCycleName',
      field: 'educationCycleName',
      label: '법정교육주기',
      style: 'width:90px',
      align: 'center',
      sortable: true
    },
    {
      name: 'estimatedEducationExpenses',
      field: 'estimatedEducationExpenses',
      label: '예상교육비',
      style: 'width:100px',
      align: 'center',
      type: 'cost',
      suffix: '원',
      sortable: true
    },
    {
      name: 'educationPurpose',
      field: 'educationPurpose',
      label: '학습목적',
      style: 'width:200px',
      align: 'left',
      sortable: true
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      style: 'width:250px',
      align: 'left',
      sortable: true
    },
    {
      name: 'eduQuestionFlag',
      field: 'eduQuestionFlag',
      label: '문제풀이',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'useFlagName',
      field: 'useFlagName',
      label: '사용여부',
      style: 'width:80px',
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
  listUrl.value = selectConfig.sop.edu.course.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  flagItems.value = [
    { code: 'Y', codeName: $language('해당') },
    { code: 'N', codeName: $language('해당없음') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 교육과정 목록 조회
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
 * TODO (목적): 교육과정 상세
 *******************************/
function linkClick(row: eduCourseType) {
  popupOptions.value.title = '교육과정 상세'
  popupOptions.value.param = {
    eduCourseId: row ? row.eduCourseId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./educationCourseDetail.vue`))
  )
  popupOptions.value.isFull = true
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
