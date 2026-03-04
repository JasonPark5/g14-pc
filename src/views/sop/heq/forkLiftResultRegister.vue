<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="HEQ_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="facilityTypeCd"
            label="중장비 분류"
            v-model:value="searchParam.facilityTypeCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="hisTable"
      title="중장비 점검"
      tableId="forkLiftHis"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      @linkClick="linkClick"
      rowkey="heqForkLiftHistoryId"
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
  name: 'forkLiftResultRegister'
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
  plantCd: null,
  startYmd: '',
  endYmd: '',
  period: [],
  facilityTypeCd: '',
  facilityTypeName: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      style: 'width:150px',
      label: '사업장',
      align: 'center'
    },
    {
      name: 'selfCheckName',
      field: 'selfCheckName',
      label: '점검명',
      style: 'width:350px',
      align: 'left',
      type: 'link',
      sortable: false
    },
    {
      name: 'facilityTypeName',
      field: 'facilityTypeName',
      label: '중장비 유형',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'deviceNo',
      field: 'deviceNo',
      label: '기기번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'facilityName',
      field: 'facilityName',
      label: '중장비명',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'inspectionDate',
      field: 'inspectionDate',
      label: '점검일',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'inspectionUserName',
      field: 'inspectionUserName',
      label: '점검자',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '업체명',
      style: 'width:120px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const stepItems = ref<Array<codeMasterType>>([])
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
  listUrl.value = selectConfig.sop.heq.forkLift.forkchecks.url
  // code setting
  stepItems.value = [
    { code: 'N', codeName: $language('작성중') },
    { code: 'Y', codeName: $language('완료') }
  ]
  // list setting
  getList()
}

/******************************
 * TODO (목적): 중장비 점검 조회
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
 * TODO (목적): 중장비 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '중장비 점검 상세'
  popupOptions.value.param = {
    heqForkLiftId: row ? row.heqForkLiftId : '',
    heqForkLiftHistoryResultId: row ? row.heqForkLiftHistoryResultId : '',
    heqForkLiftHistoryId: row ? row.heqForkLiftHistoryId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./forkLiftHistoryResult.vue`))
  )
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
