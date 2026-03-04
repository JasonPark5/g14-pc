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
            :comboItems="[
              { code: 'Y', codeName: $language('검토') },
              { code: 'N', codeName: $language('미검토') }
            ]"
            type="search"
            itemText="codeName"
            itemValue="code"
            label="법령검토여부"
            name="lawCheck"
            v-model:value="searchParam.lawCheck"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      title="법령 목록"
      :columns="grid.columns"
      :data="grid.data"
      :customTrClass="setTrClass"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
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
          @click.stop="linkClick(props, col)"
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyControlDangerous'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
const searchParam = ref({
  promulgationPeriod: [],
  period: ['', ''],
  startYmd: '',
  endYmd: '',
  lawId: '',
  lawCheck: ''
})
const grid = ref({
  columns: [
    {
      name: 'lawId',
      field: 'lawId',
      label: '법령번호',
      align: 'center',
      sortable: false,
      style: 'width:40px'
    },
    {
      name: 'curHistroyCode',
      field: 'curHistroyCode',
      label: '현행연혁',
      align: 'center',
      sortable: false,
      style: 'width:40px'
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
      align: 'left',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'regDt',
      field: 'regDt',
      label: '등록일',
      align: 'center',
      sortable: false,
      style: 'width:60px'
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
      name: 'revisiontypename',
      field: 'revisiontypename',
      label: '제개정구분명',
      align: 'center',
      sortable: false,
      style: 'width:60px'
    },
    {
      name: 'competentMinistriesName',
      field: 'competentMinistriesName',
      label: '소관부처명',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'lawClassName',
      field: 'lawClassName',
      label: '법령구분명',
      align: 'center',
      sortable: false,
      style: 'width:80px'
    },
    {
      name: 'enforcementDate',
      field: 'enforcementDate',
      label: '시행일자',
      align: 'center',
      sortable: false,
      style: 'width:60px'
    },
    // {
    //   name: 'lawTypeFlag',
    //   field: 'lawTypeFlag',
    //   label: '자법타법여부',
    //   align: 'center',
    //   sortable: false,
    //   style: 'width:60px'
    // },
    {
      name: 'oldAndNew',
      field: 'oldAndNew',
      label: '신구법비교',
      align: 'center',
      sortable: false,
      style: 'width:40px',
      type: 'custom'
    },
    {
      name: 'custom',
      field: 'custom',
      label: '법령상세',
      align: 'center',
      sortable: false,
      style: 'width:40px',
      type: 'custom'
    }
  ],
  data: []
})
const listUrl = ref('')
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
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
  listUrl.value = selectConfig.mdm.law.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 법령정보 조회
 *******************************/
function getList() {
  if (searchParam.value.period && searchParam.value.period.length === 2) {
    ;[searchParam.value.startYmd, searchParam.value.endYmd] = searchParam.value.period
  } else [searchParam.value.startYmd, searchParam.value.endYmd] = ['', '']
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): (법제처)법령 정보 팝업 표시
 * @param (1): 행 전체 정보
 *******************************/
function linkClick(_props: any, _col: tableColumnType) {
  if (_col.name === 'custom') {
    window.open('http://www.law.go.kr' + _props.row.lawLink, '법규', 'width=1200, height=800')
  } else if (_col.name === 'oldAndNew') {
    window.open(
      'http://www.law.go.kr' + _props.row.lawLink.replace('eflaw', _col.name),
      // `http://www.law.go.kr/DRF/lawService.do?OC=dhkim&target=oldAndNew&MST=${_props.row.lawSerialNum}&type=HTML`,
      '신구법 비교',
      'width=1200,height=800'
    )
  }
}

function setTrClass(_props: any) {
  return _props.row.regDt === getToday() && _props.row.managers?.includes(user.value.userId)
    ? 'bg-orange-1'
    : ''
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
