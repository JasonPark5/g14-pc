<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            label="설치지역"
            name="installLocation"
            v-model:value="searchParam.installLocation">
          </c-text>
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            label="관련공정"
            name="processCd"
            :customPopupParam="{ targetKey: 'process' }"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept type="search" label="관리부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="interlock"
          title="소화설비 설치계획 목록"
          :columns="grid.columns"
          :data="grid.data"
          rowKey="fireEquipmentId"
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
      </div>
    </div>
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
  name: 'firefightingEquipmentInfo'
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
  data: Array<any>
  height?: stringNull
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: '',
  installLocation: '',
  processCd: '',
  deptCd: ''
})
const grid = ref<gridType>({
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
      name: 'revisionNum',
      field: 'revisionNum',
      label: 'Rev.',
      align: 'center',
      style: 'width:50px',
      sortable: true
    },
    {
      name: 'installLocation',
      field: 'installLocation',
      label: '설치지역',
      align: 'center',
      style: 'width:150px',
      type: 'link',
      sortable: true
    },
    {
      name: 'fireExtinguisher',
      field: 'fireExtinguisher',
      label: '소화기',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'autoSpreadFire',
      field: 'autoSpreadFire',
      label: '자동확산소화기',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'autoFire',
      field: 'autoFire',
      label: '자동소화장치',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'standPipe',
      field: 'standPipe',
      label: '옥내소화전',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'sprinkler',
      field: 'sprinkler',
      label: '스프링쿨러',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'waterSpray',
      field: 'waterSpray',
      label: '물분부소화설비',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'poSpray',
      field: 'poSpray',
      label: '포소화설비',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'co2Spray',
      field: 'co2Spray',
      label: 'CO2소화설비',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'halogenSpray',
      field: 'halogenSpray',
      label: '할로겐화합물소화설비',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'cleanSpray',
      field: 'cleanSpray',
      label: '청정소화약제소화설비',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'outdoorPipe',
      field: 'outdoorPipe',
      label: '옥외소화전',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
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
  listUrl.value = selectConfig.psi.lbe.fireequip.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 동력기계 조회
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
 * TODO (목적): 링크 클릭 시 팝업 표시
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '소화설비설치계획 상세'
  popupOptions.value.param = {
    fireEquipmentId: row ? row.fireEquipmentId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./firefightingEquipmentInfoDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
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
