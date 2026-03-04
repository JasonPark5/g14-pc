<template>
  <div>
    <c-search-box ref="searchbox" @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="MSDS_SEARCH_CND"
            label="검색구분"
            itemText="codeName"
            itemValue="code"
            name="searchCnd"
            type="none"
            v-model:value="searchParam.searchCnd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            required
            label="검색어"
            validMessage="검색어"
            name="searchNm"
            v-model:value="searchParam.searchNm"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="MSDS 화학물질 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'msdslink'">
          <q-chip
            v-if="col.name === 'msdslink' && props.row.chemId != ''"
            outline
            square
            color="blue"
            text-color="white"
            :clickable="true"
            @click.stop="() => msdslink(props.row)"
          >
            MSDS
          </q-chip>
        </template>
      </template>
    </c-table>
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
  name: 'koshamsds'
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
const searchParam = ref({
  searchCnd: '0',
  searchNm: ''
})
const grid = ref({
  columns: [
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'msdslink',
      field: 'msdslink',
      label: 'MSDS',
      type: 'custom',
      align: 'center',
      sortable: false,
      style: 'width:100px',
      helpcomment: '안전보건공단에서 제공하는 MSDS정보'
    },
    {
      name: 'chemNameKor',
      field: 'chemNameKor',
      label: '화학물질명',
      align: 'left',
      sortable: true
    },
    {
      name: 'enNo',
      field: 'enNo',
      label: 'EU No.',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'keNo',
      field: 'keNo',
      style: 'width:150px',
      label: 'KE No.',
      align: 'center',
      sortable: true
    },
    {
      name: 'unNo',
      field: 'unNo',
      style: 'width:150px',
      label: 'UN No.',
      align: 'center',
      sortable: true
    },
    {
      name: 'lastDate',
      field: 'lastDate',
      style: 'width:150px',
      label: '최종갱신일',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const listUrl = ref('')
const msdsDetailUrl = ref('')
const charmDetailUrl = ref('')
const searchbox = ref<any>(null)

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
  listUrl.value = selectConfig.openApi.kosha.list.url
  msdsDetailUrl.value = selectConfig.openApi.kosha.get.url
  charmDetailUrl.value = selectConfig.openApi.kosha.charm.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 안전공단 MSDS open api 조회
 *******************************/
function getList() {
  searchbox.value.validation().then((result: boolean) => {
    if (result) {
      $http({
        url: listUrl.value,
        method: 'GET',
        params: searchParam.value,
        timeout: 60000
      }).then((_result: any) => {
        grid.value.data = _result.data.item
      })
    } else {
      grid.value.data = []
    }
  })
}
/******************************
 * TODO (목적): 안전공단 MSDS 상세 팝업 표시
 * @param (1): 행 정보
 *******************************/
function msdslink(row: any) {
  window.open(
    'https://msds.kosha.or.kr/MSDSInfo/kcic/msdsdetail.do?chem_id=' + row.chemId + '&viewType=msds',
    'msdspop',
    'width=1280, height=768, menubar=no, status=no, toolbar=no'
  )
}
/******************************
 * TODO (목적): 화학물질 링크 클릭
 * @param (1): 행 정보
 * @param (2): 컬럼 정보
 *******************************/
function linkClick(row: any, col: tableColumnType) {
  if (col.name === 'chemNameKor') {
    $http({
      url: msdsDetailUrl.value,
      method: 'PUT',
      data: {
        chemId: row.chemId
      }
    }).then((_result: any) => {
      console.log('# msds: ', _result.data)
    })
    $http({
      url: charmDetailUrl.value,
      method: 'PUT',
      data: {
        chemId: row.chemId
      }
    }).then((_result: any) => {
      console.log('# charm: ', _result.data)
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
