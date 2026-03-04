<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-dept
          :isFirstValue="false"
          type="search"
          label="부서"
          name="seniorDeptCd"
          v-model:value="searchParam.seniorDeptCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-field
          type="user"
          label="선임자"
          name="seniorUserId"
          v-model:value="searchParam.seniorUserId"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-select
          :comboItems="dismissalFlagItems"
          type="search"
          label="선/해임 구분"
          itemText="codeName"
          itemValue="code"
          name="dismissalFlag"
          v-model:value="searchParam.dismissalFlag"
        />
      </div>
    </template>
  </c-search-box>
  <c-table
    ref="seniorDismissal"
    title="선해임 현황 목록"
    :columns="grid.columns"
    :data="grid.data"
    :columnSetting="false"
    :expandAll="true"
    @linkClick="linkClick"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
        <c-btn label="검색" icon="search" @btnClicked="getList" />
      </q-btn-group>
    </template>
  </c-table>
  <c-dialog :param="popupOptions" />
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
  name: 'seniorDismissalStatus'
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
interface searchParamType {
  plantCd: stringNull
  seniorDeptCd: stringNull
  seniorUserId: stringNull
  dismissalFlag: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: '',
  seniorDeptCd: '',
  seniorUserId: '',
  dismissalFlag: 'N'
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      align: 'left',
      style: 'width:250px',
      sortable: true
    },
    {
      name: 'seniorName',
      field: 'seniorName',
      label: '선임명',
      align: 'left',
      style: 'width:200px',
      type: 'link',
      sortable: true
    },
    // {
    //   name: 'seniorDeptName',
    //   field: 'seniorDeptName',
    //   label: '부서',
    //   align: 'center',
    //   style: 'width:100px',
    //   sortable: true
    // },
    {
      name: 'seniorUserTotal',
      field: 'seniorUserTotal',
      label: '선임자',
      align: 'center',
      style: 'width:140px',
      sortable: true
    },
    {
      name: 'seniorDate',
      field: 'seniorDate',
      label: '선임일',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'dismissalFlagName',
      field: 'dismissalFlagName',
      label: '선/해임',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'dismissalDate',
      field: 'dismissalDate',
      label: '해임일',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const dismissalFlagItems = ref<object[]>([])

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
  dismissalFlagItems.value = [
    { code: 'N', codeName: $language('선임') },
    { code: 'Y', codeName: $language('해임') }
  ]
  editable.value = Boolean(route.meta.editable)
  listUrl.value = selectConfig.mdm.senior.status.list.url
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
 * TODO (목적): 상세 팝업창 표시
 * @param (1): 행 전체 정보 (신규등록인 경우 null)
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '선임 현황 상세'
  popupOptions.value.param = {
    seniorStatusId: row ? row.seniorStatusId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./seniorDismissalStatusDetail.vue`))
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
</script>
