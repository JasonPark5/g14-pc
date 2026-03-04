<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            type="year"
            label="점검년도"
            default="today"
            name="year"
            v-model:value="searchParam.year"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="HALF_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            label="상/하반기"
            name="checkSemiAnnualCd"
            v-model:value="searchParam.checkSemiAnnualCd"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            label="점검기간"
            defaultStart="-12M"
            defaultEnd="0M"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept type="search" label="부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            label="점검자"
            type="dept_user"
            name="checkUserId"
            v-model:value="searchParam.checkUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="comboItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="completeFlag"
            label="진행상태"
            v-model:value="searchParam.completeFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="EHS팀 반기 점검 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
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
  name: 'esteamInspection'
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
interface gridType {
  columns: tableColumnType
  data: any[]
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
const searchParam = ref({
  plantCd: '1000',
  deptCd: 'D10031',
  startYmd: '',
  endYmd: '',
  completeFlag: null,
  checkUserId: '',
  period: [],
  year: '',
  checkSemiAnnualCd: null
})
const grid = ref<gridType>({
  columns: [
    // {
    //   name: 'plantName',
    //   field: 'plantName',
    //   label: '사업장',
    //   align: 'center',
    //   sortable: true
    // },
    // {
    //   name: 'deptName',
    //   field: 'deptName',
    //   label: '부서',
    //   align: 'center',
    //   sortable: true,
    //   style: 'width:15%'
    // },
    {
      name: 'checkTitle',
      field: 'checkTitle',
      label: '점검명',
      align: 'center',
      type: 'link',
      sortable: true
    },
    {
      name: 'checkDate',
      field: 'checkDate',
      label: '점검일시',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkSemiAnnualNm',
      field: 'checkSemiAnnualNm',
      label: '상/하반기',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'checkUserName',
      field: 'checkUserName',
      label: '점검자',
      align: 'center',
      sortable: true,
      style: 'width:15%'
    },
    {
      name: 'completeFlag',
      field: 'completeFlag',
      label: '진행상태',
      align: 'center',
      sortable: true,
      style: 'width:15%'
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재상태',
      align: 'center',
      sortable: true,
      style: 'width:15%'
    }
  ],
  data: []
})
const listUrl = ref('')
const comboItems = ref<Array<codeMasterType>>([
  { code: 'N', codeName: $language('작성중') },
  { code: 'Y', codeName: $language('완료') }
])
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
  listUrl.value = selectConfig.sai.sse.es.list.url
  // code setting
  // list setting
  getList()
  // code setting
}
function getList() {
  if (searchParam.value.period && searchParam.value.period.length === 2) {
    searchParam.value.startYmd = searchParam.value.period[0]
    searchParam.value.endYmd = searchParam.value.period[1]
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
function linkClick(row: any) {
  popupOptions.value.title = 'EHS팀 반기점검 상세'
  popupOptions.value.param = { saiSapaEsCheckId: row ? row.saiSapaEsCheckId : '' }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./esteamInspectionDetail.vue`))
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
