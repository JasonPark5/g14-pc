<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-select
            codeGroupCd="LAW_ID"
            type="search"
            itemText="codeName"
            itemValue="code"
            label="법령"
            name="lawId"
            v-model:value="searchParam.lawId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            defaultStart="-2y"
            defaultEnd="2M"
            label="공포기간"
            name="promulgationPeriod"
            v-model:value="searchParam.promulgationPeriod"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            defaultStart="startOfYear"
            defaultEnd="today"
            label="등록기간"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            stepperGrpCd="MDM_LAW_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="mdmLawStepCd"
            label="진행단계"
            v-model:value="searchParam.mdmLawStepCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field label="검토자" name="checkUserId" v-model:value="searchParam.checkUserId" />
        </div>
      </template>
    </c-search-box>
    <c-table
      title="안전보건법규 검토 목록"
      tableId="lawMakingCheck"
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
      <template v-slot:customArea="{ props, col }">
        <q-btn
          v-if="(col.name === 'oldAndNew' || col.name === 'custom') && props.row.lawLink"
          class="tableinnerBtn"
          flat
          icon="launch"
          align="center"
          color="blue-6"
          @click.stop="lawOpen(props.row, col)"
        />
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
import { lawCheckType } from './lawReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'lawReview'
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
const searchParam = ref({
  promulgationPeriod: [],
  mdmLawStepCd: null,
  checkUserId: '',
  period: ['', ''],
  startYmd: '',
  endYmd: '',
  lawId: ''
})
const grid = ref({
  columns: [
    {
      name: 'mdmLawStepName',
      field: 'mdmLawStepName',
      label: '진행단계',
      align: 'center',
      sortable: false,
      style: 'width:60px',
      type: 'link'
    },
    {
      name: 'acceptDeptNames',
      field: 'acceptDeptNames',
      label: '적용부서',
      align: 'left',
      sortable: false,
      style: 'width:130px'
    },
    {
      name: 'checkUserNames',
      field: 'checkUserNames',
      label: '검토자',
      align: 'left',
      sortable: false,
      style: 'width:130px'
    },
    {
      name: 'lawNameKor',
      field: 'lawNameKor',
      label: '법령명한글',
      align: 'left',
      sortable: false,
      style: 'width:160px'
    },
    {
      name: 'lawNameAbb',
      field: 'lawNameAbb',
      label: '법령약칭명',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'promulgationDate',
      field: 'promulgationDate',
      label: '공포일자',
      align: 'center',
      sortable: false,
      style: 'width:60px'
    },
    {
      name: 'enforcementDate',
      field: 'enforcementDate',
      label: '시행일자',
      align: 'center',
      sortable: false,
      style: 'width:60px'
    },
    {
      name: 'revisiontypename',
      field: 'revisiontypename',
      label: '제개정',
      align: 'center',
      sortable: false,
      style: 'width:60px'
    },
    {
      name: 'competentMinistriesName',
      field: 'competentMinistriesName',
      label: '소관부처',
      align: 'center',
      sortable: false,
      style: 'width:90px'
    },
    {
      name: 'lawClassName',
      field: 'lawClassName',
      label: '법령구분',
      align: 'center',
      sortable: false,
      style: 'width:80px'
    },
    // {
    //   name: 'lawTypeFlag',
    //   field: 'lawTypeFlag',
    //   label: '자법타법여부',
    //   align: 'center',
    //   sortable: false,
    //   style: 'width:80px',
    // },
    {
      name: 'oldAndNew',
      field: 'oldAndNew',
      label: '신구법비교',
      align: 'center',
      sortable: false,
      style: 'width:50px',
      type: 'custom'
    },
    {
      name: 'custom',
      field: 'custom',
      label: '법령상세',
      align: 'center',
      sortable: false,
      style: 'width:50px',
      type: 'custom'
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
  listUrl.value = selectConfig.sai.lawCheck.check.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 법령 검토 조회
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
 * TODO (목적): 링크 클릭에 따른 상세 팝업 표시
 * @param (1): 행 정보
 * @param (2): 컬럼 정보
 *******************************/
function lawOpen(row: lawCheckType, _col: tableColumnType) {
  if (_col.name === 'custom') {
    window.open('http://www.law.go.kr' + row.lawLink, '법규', 'width=1200, height=800')
  } else if (_col.name === 'oldAndNew') {
    window.open(
      'http://www.law.go.kr' + row.lawLink.replace('eflaw', _col.name),
      '신구법 비교',
      'width=1200,height=800'
    )
  }
}
/******************************
 * TODO (목적): 안전보건법규 검토 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: lawCheckType) {
  popupOptions.value.title = '안전보건법규 검토'
  popupOptions.value.param = {
    mdmLawCheckId: row ? row.mdmLawCheckId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./lawReviewDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
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
