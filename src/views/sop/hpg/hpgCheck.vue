<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
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
          <c-select
            type="search"
            :comboItems="checkTypeItems"
            itemText="codeName"
            itemValue="code"
            label="점검종류"
            name="checkTypeCd"
            v-model:value="searchParam.checkTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            type="user"
            label="점검자"
            name="checkerId"
            v-model:value="searchParam.checkerId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            :comboItems="[
              { code: 'N', codeName: $language('작성중') },
              { code: 'Y', codeName: $language('완료') }
            ]"
            itemText="codeName"
            itemValue="code"
            label="상태"
            name="completeFlag"
            v-model:value="searchParam.completeFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      title="고압가스 저장소 시설점검 목록"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            label="등록"
            :showLoading="false"
            icon="add"
            @btnClicked="linkClick"
          />
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
  name: 'hpgCheck'
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
  columns: Array<tableColumnType>
  data: Array<any>
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
  startYmd: '',
  endYmd: '',
  period: [],
  checkTypeCd: null,
  checkerId: '',
  completeFlag: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'checkName',
      field: 'checkName',
      label: '점검명',
      style: 'width:300px',
      align: 'left',
      type: 'link',
      sortable: false
    },
    {
      name: 'checkTypeName',
      field: 'checkTypeName',
      label: '점검종류',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    // {
    //   name: 'hpgName',
    //   field: 'hpgName',
    //   label: '고압가스 저장소명',
    //   style: 'width:100px',
    //   align: 'center',
    //   sortable: false
    // },
    {
      name: 'checkDate',
      field: 'checkDate',
      label: '점검일',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkerName',
      field: 'checkerName',
      label: '점검자',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'targetDeptName',
      field: 'targetDeptName',
      label: '점검대상부서',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'targetNames',
      field: 'targetNames',
      label: '점검대상자',
      style: 'width:180px',
      align: 'center',
      sortable: false
    },
    {
      name: 'completeFlagName',
      field: 'completeFlagName',
      label: '상태',
      style: 'width:60px',
      align: 'center',
      sortable: false
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재상태',
      align: 'center',
      style: 'width:60px',
      sortable: true
    }
  ],
  data: []
})
const checkTypeItems = ref<Array<codeMasterType>>([])
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
  listUrl.value = selectConfig.sop.heq.hpg.check.list.url
  // code setting
  // list setting
  getComboItems('CHECK_CYCLE_CD').then((_result: any) => {
    checkTypeItems.value = _.filter(_result, (row: any) => row.attrVal3 === 'Y')
  })
  getList()
}

/******************************
 * TODO (목적): 중장비 점검 조회
 *******************************/
function getList() {
  if (searchParam.value.period && searchParam.value.period!.length === 2) {
    ;[searchParam.value.startYmd, searchParam.value.endYmd] = searchParam.value.period
  } else {
    ;[searchParam.value.startYmd, searchParam.value.endYmd] = ['', '']
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
 * TODO (목적): 중장비 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '고압가스 저장소 시설점검 상세'
  popupOptions.value.param = {
    hpgCheckId: row ? row.hpgCheckId : ''
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./hpgCheckDetail.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}

/******************************
 * TODO (목적): 중장비 팝업 닫기
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
