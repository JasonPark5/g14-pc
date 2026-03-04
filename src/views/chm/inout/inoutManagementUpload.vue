<!--
 유해화학자재에 대한 입출고 관리하는 화면
  1. 유해화학자재란 화학자재 중 PSM 여부가 'Yes'인 경우
    ** 화관법에 따르면 유독물질, 허가물질, 제한물질 또는 금지물질, 사고대비물질, 그 밖에 유해성 또는 위해성이 있거나 그러할 우려가 있는 화학물질을 의미
  2. SAP에서 자재정보 및 입출고 관리를 하고 있지 않음으로 해당 화면에서 입출고를 관리함.(LNF)
    ** 기본적으로는 SAP과 I/F를 통하여 정보를 받음
    ** 그로인해 훗날 해당 화면이 아닌 SAP에서 받게 처리가 되어야 할 수도 있음(현재 scope 아님)
  3. 이전에는 유해화학물질이였음에도 목록에 표시될 수 있음
     구성물질등이 바뀜으로 자재의 규제사항이 달라질 수 있음으로
  4. 목록에는 다음 물질을 표시
   - 유해화학자재
   - 이전에 유해화학자재로 입출고 정보가 있는 자재
-->
<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            type="year"
            defaultStart="-2y"
            defaultEnd="0y"
            label="(기간)년도"
            name="f_years"
            v-model:value="searchParam.f_years"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="관리대장(제조/수입/사용/판매) 년도별 현황 (단위 : t)"
      :columns="gridColumns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="add" />
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
import { inoutManagementUploadType } from './inoutManagementUpload'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'inoutManagementUpload'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
  defaultColumns: tableColumnType
  data: Array<any>
}

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
  plantCd: null,
  f_years: [] as Array<string>,
  years: [] as Array<string>
})
const grid = ref<gridType>({
  defaultColumns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'year',
      field: 'year',
      label: '년도',
      align: 'center',
      style: 'width:80px',
      sortable: true,
      type: 'link'
    }
  ],
  data: []
})
const listUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const gridColumns = computed(() => {
  const detault = _.clone(grid.value.defaultColumns)
  for (let month = 1; month <= 12; month++) {
    detault.push({
      name: `month${month}`,
      field: `month${month}`,
      label: `${month}월`,
      child: [
        {
          name: `in${month}`,
          field: `in${month}`,
          label: '입고',
          align: 'right',
          style: 'width:60px',
          sortable: true,
          type: 'cost'
        },
        {
          name: `out${month}`,
          field: `out${month}`,
          label: '출고',
          align: 'right',
          style: 'width:60px',
          sortable: true,
          type: 'cost'
        },
        {
          name: `inventory${month}`,
          field: `inventory${month}`,
          label: '재고',
          align: 'right',
          style: 'width:60px',
          sortable: true,
          type: 'cost'
        }
      ]
    })
  }
  return detault
})

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
  listUrl.value = selectConfig.chm.inout.inoutstatus.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 관리대장 년도별 현황 조회
 *******************************/
function getList() {
  if (
    searchParam.value.f_years &&
    searchParam.value.f_years.length > 0 &&
    searchParam.value.f_years[0]
  ) {
    const from = _.parseInt(searchParam.value.f_years[0])
    const to = _.parseInt(searchParam.value.f_years[1])
    const years = [] as Array<string>
    for (let i = from; i <= to; i++) {
      years.push(String(i))
    }
    searchParam.value.years = years
  } else {
    searchParam.value.years = []
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
 * TODO (목적): 관리대장 추가버튼 클릭
 *******************************/
function add() {
  linkClick()
}
/******************************
 * TODO (목적): 관리대장 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row?: inoutManagementUploadType) {
  popupOptions.value.title = '관리대장(제조/수입/사용/판매) 엑셀업로드'
  popupOptions.value.param = {
    plantCd: row ? row.plantCd : user.value.plantCd,
    year: row ? row.year : '',
    isOld: row ? true : false
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./inoutManagementUploadDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 관리대장 팝업 닫기
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
