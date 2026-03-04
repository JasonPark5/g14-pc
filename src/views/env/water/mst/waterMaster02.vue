<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            :editable="editable"
            label="관리부서"
            :isFirstValue="false"
            name="deptCd"
            type="search"
            v-model:value="searchParam.deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <c-select
            :comboItems="useFlagItems"
            label="사용여부"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            type="search"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="grid"
      title="배출시설 목록"
      tableId="grid"
      :columns="disposeTable.columns"
      :data="disposeTable.data"
      :columnSetting="false"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="detailPopup" />
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
import { waterDisChargeType } from './waterMasterType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'waterMaster02'
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
  data: Array<waterDisChargeType>
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
const useFlagItems = ref<Array<codeMasterType>>([])
const listUrl = ref('')
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '80%',
  target: null,
  title: '',
  top: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  deptCd: '',
  useFlag: 'Y'
})
const disposeTable = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width: 100px',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '관리부서',
      style: 'width: 80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'envWaterMstDischargeName',
      field: 'envWaterMstDischargeName',
      label: '배출시설명',
      align: 'left',
      style: 'width: 300px',
      type: 'link',
      sortable: true
    },
    {
      name: 'dischargeIepsNo',
      field: 'dischargeIepsNo',
      label: '배출시설관리번호(IEPS)',
      style: 'width: 100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'dischargeIepsPlantMgtNo',
      field: 'dischargeIepsPlantMgtNo',
      label: '사업장관리번호(IEPS)',
      align: 'center',
      style: 'width: 100px',
      sortable: true
    },
    {
      name: 'processNo',
      field: 'processNo',
      label: '공정번호',
      align: 'center',
      style: 'width: 100px',
      sortable: true
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정명',
      align: 'center',
      style: 'width: 120px',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width: 100px',
      sortable: true
    }
  ],
  data: []
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
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // url setting
  listUrl.value = selectConfig.env.water.mst.discharge.list.url
  // list setting
  getList()
}
/******************************
 * TODO (목적): 배출시설 목록조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    disposeTable.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: waterDisChargeType) {
  detailPopup(row)
}
function detailPopup(result?: waterDisChargeType) {
  popupOptions.value.title = '수질 배출시설 상세'
  popupOptions.value.param = {
    envWaterMstDischargeId: result ? result.envWaterMstDischargeId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./waterMaster02Detail.vue`))
  )
  popupOptions.value.isFull = false
  popupOptions.value.width = '70%'
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
