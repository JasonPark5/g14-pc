<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            type="year"
            default="today"
            label="대상년도"
            name="year"
            v-model:value="searchParam.year"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="MAIN_SAFETY_HEALTHY_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="safetyHealthyTypeCd"
            label="구분"
            v-model:value="searchParam.safetyHealthyTypeCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="관계법령 의무사항 이행 계획/실적"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="openPop" />
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
  name: 'mainSafetyHealthyTarget'
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
  columns: tableColumnType
  data: Array<any>
}
interface searchParamType {
  plantCd: stringNull
  year: stringNull
  safetyHealthyTypeCd: stringNull
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
  top: '',
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<searchParamType>({
  plantCd: null,
  year: '',
  safetyHealthyTypeCd: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'targetYear',
      field: 'targetYear',
      label: '대상년도',
      align: 'center',
      sortable: true,
      style: 'width:120px'
    },
    {
      name: 'safetyHealthyTypeName',
      field: 'safetyHealthyTypeName',
      label: '구분',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'targetTitle',
      field: 'targetTitle',
      label: '제목',
      align: 'left',
      sortable: true,
      style: 'width:200px',
      type: 'link'
    },
    {
      name: 'writeDeptName',
      field: 'writeDeptName',
      label: '작성부서',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'writeDt',
      field: 'writeDt',
      label: '작성일',
      align: 'center',
      style: 'width:200px',
      sortable: true
    }
  ],
  data: []
})
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
  listUrl.value = selectConfig.sai.mainsafetyHealthy.list.url
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
 * TODO (목적): 목록 클릭하여 상세 조회 팝업 호출
 *******************************/
function linkClick(row: any) {
  openPop(row)
}
/******************************
 * TODO (목적): 목록 클릭하여 상세 조회 팝업 호출
 *******************************/
const openPop = (row: any) => {
  popupOptions.value.title = '관계법령 의무사항 이행 계획/실적 상세'
  popupOptions.value.param = {
    mainSafetyHealthyTargetId: row ? row.mainSafetyHealthyTargetId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./mainSafetyHealthyTargetDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}

/******************************
 * TODO (목적): 팝업 닫기
 *******************************/
const closePopup = () => {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
