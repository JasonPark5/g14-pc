<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            type="user"
            label="안전관리자"
            name="chmDangerManageUserId"
            v-model:value="searchParam.chmDangerManageUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            type="user"
            label="담당자"
            name="chmDangerUserId"
            v-model:value="searchParam.chmDangerUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            type="user"
            label="안전대리자"
            name="chmDangerSafetyUserId"
            v-model:value="searchParam.chmDangerSafetyUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
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
      title="위험물 저장소 목록"
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
  name: 'dangerMaster'
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y',
  chmDangerManageUserId: '',
  chmDangerUserId: '',
  chmDangerSafetyUserId: ''
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
      name: 'chmDangerTypeName',
      field: 'chmDangerTypeName',
      label: '구분',
      style: 'width:160px',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerArea',
      field: 'chmDangerArea',
      label: '위험물저장소명',
      style: 'width:160px',
      align: 'center',
      type: 'link',
      sortable: true
    },
    {
      name: 'chmDangerMstName',
      field: 'chmDangerMstName',
      label: '품명 표기',
      align: 'left',
      sortable: true
    },
    {
      name: 'chmDangerManageUserName',
      field: 'chmDangerManageUserName',
      label: '안전관리자',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerUserName',
      field: 'chmDangerUserName',
      style: 'width:100px',
      label: '담당자',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerSafetyUserName',
      field: 'chmDangerSafetyUserName',
      style: 'width:100px',
      label: '안전대리자',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerCount',
      field: 'chmDangerCount',
      label: '지정수량 표기',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerMainUse',
      field: 'chmDangerMainUse',
      style: 'width:150px',
      label: '주용도',
      align: 'center',
      sortable: true
    },
    {
      name: 'useFlagName',
      field: 'useFlagName',
      style: 'width:80px',
      label: '사용여부',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const useFlagItems = ref<Array<codeMasterType>>([])

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
  listUrl.value = selectConfig.chm.danger.master.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
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
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '위험물저장소 상세'
  popupOptions.value.param = {
    chmDangerMstId: row ? row.chmDangerMstId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./dangerMasterDetail.vue`))
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
