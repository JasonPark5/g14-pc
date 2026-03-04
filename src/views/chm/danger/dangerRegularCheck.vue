<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            codeGroupCd="CHM_DANGER_TYPE_CD"
            label="구분"
            itemText="codeName"
            itemValue="code"
            name="chmDangerTypeCd"
            type="search"
            v-model:value="searchParam.chmDangerTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            name="period"
            label="점검기간"
            defaultStart="-6M"
            defaultEnd="6M"
            v-model:value="period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            stepperGrpCd="CHM_STATUS_DANGER_REGULAR_CHECK_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            label="진행상태"
            name="chmStatusDangerRegularCheckCd"
            v-model:value="searchParam.chmStatusDangerRegularCheckCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="위험물 정기점검 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="등록" v-if="editable" icon="add" @btnClicked="linkClick" />
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
  name: 'dangerRegularCheck'
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  chmDangerTypeCd: null,
  plantCd: null,
  startYmd: '',
  endYmd: '',
  chmStatusDangerRegularCheckCd: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:60px',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerTypeName',
      field: 'chmDangerTypeName',
      label: '구분',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerArea',
      field: 'chmDangerArea',
      label: '위험물저장소',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerDate',
      field: 'chmDangerDate',
      style: 'width:100px',
      label: '점검기간',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerCheckName',
      field: 'chmDangerCheckName',
      label: '점검명',
      style: 'width:200px',
      align: 'left',
      type: 'link',
      sortable: true
    },
    {
      name: 'chmStatusDangerRegularCheckName',
      field: 'chmStatusDangerRegularCheckName',
      label: '진행상태',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    // {
    //   name: 'checkResultNumber',
    //   field: 'checkResultNumber',
    //   label: '점검결과 (부적합/전체)',
    //   align: 'center',
    //   sortable: true,
    //   style: 'width:80px'
    // },
    {
      name: 'chmDangerInspectorUserName',
      field: 'chmDangerInspectorUserName',
      style: 'width:150px',
      label: '점검자',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const period = ref<Array<stringNull>>([])

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
  listUrl.value = selectConfig.chm.danger.regularChecks.list.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '위험물정기점검 상세'
  popupOptions.value.param = {
    chmDangerRegularCheckId: row ? row.chmDangerRegularCheckId : '',
    chmStatusDangerRegularCheckCd: row ? row.chmStatusDangerRegularCheckCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./dangerRegularCheckDetail.vue`))
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
