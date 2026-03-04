<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="ENV_POPS_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="envPopsTypeCd"
            label="종류"
            v-model:value="searchParam.envPopsTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="ENV_POPS_COMPANY_CD"
            itemText="codeName"
            itemValue="code"
            name="envPopsCopmpanyCd"
            label="제조사"
            v-model:value="searchParam.envPopsCopmpanyCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :comboItems="disposalItems"
            label="폐기매매여부"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            type="search"
            v-model:value="searchParam.disposalYn"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="잔류성유기오염물질 관리대상기기 목록"
      :columns="grid.columns"
      :data="grid.data"
      :checkClickFlag="false"
      rowKey="envWastePopsId"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="onItemClick" />
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
  name: 'wastePopsManage'
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
  envPopsTypeCd: stringNull
  envPopsCopmpanyCd: stringNull
  disposalYn: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  envPopsTypeCd: '',
  envPopsCopmpanyCd: '',
  disposalYn: ''
})
const grid = ref<any>({
  columns: [
    {
      name: 'administrationNo',
      field: 'administrationNo',
      style: 'width:100px',
      label: '행정번호',
      align: 'center',
      sortable: true
    },
    {
      name: 'lotNo',
      field: 'lotNo',
      style: 'width:150px',
      label: '제조번호',
      align: 'center',
      sortable: true
    },
    {
      name: 'envPopsTypeCd',
      field: 'envPopsTypeCd',
      label: '종류',
      align: 'left',
      style: 'width:150px',
      type: 'link',
      sortable: true
    },
    {
      name: 'envPopsCopmpanyCd',
      field: 'envPopsCopmpanyCd',
      label: '제조사',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'lotDt',
      field: 'lotDt',
      label: '제조년월일',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'envPopsVolumne',
      field: 'envPopsVolumne',
      style: 'width:150px',
      label: '용량(kVA)',
      align: 'center',
      sortable: true
    },
    {
      name: 'envPopsGrossWeight',
      field: 'envPopsGrossWeight',
      label: '종중량(ton)',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'envPopsInsulationFlow',
      field: 'envPopsInsulationFlow',
      label: '절연유량(kℓ)',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'disposalSaleDt',
      field: 'disposalSaleDt',
      label: '폐기매매년월일',
      style: 'width:120px',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const listUrl = ref('')
const disposalItems = ref<Array<codeMasterType>>([])

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
  listUrl.value = selectConfig.env.waste.pops.list.url
  // code setting
  disposalItems.value = [
    { code: 'Y', codeName: $language('Y') },
    { code: 'N', codeName: $language('N') }
  ]
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
 * TODO (목적): 링크 클릭
 *******************************/
/* eslint-disable no-unused-vars */
function linkClick(row: any) {
  popupOptions.value.title = '잔류성유기오염물질 관리대상기기 상세'
  popupOptions.value.param = {
    envWastePopsId: row ? row.envWastePopsId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./wastePopsManageDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.height = '300px'
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 등록 버튼 클릭
 *******************************/
function onItemClick() {
  linkClick(null)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
