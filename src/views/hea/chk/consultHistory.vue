<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            type="search"
            :isFirstValue="false"
            label="부서"
            name="deptCd"
            v-model:value="searchParam.deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-field label="대상자" name="userId" v-model:value="searchParam.userId" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
          <c-datepicker :range="true" label="상담기간" name="period" v-model:value="period" />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="상담 목록"
      tableId="table"
      :columns="grid.columns"
      :merge="grid.merge"
      :data="grid.data"
      @linkClick="linkClick"
      :columnSetting="false"
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
import { consultHistoryType } from './consultType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'consultHistory'
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
  data: Array<consultHistoryType>
  merge: Array<tableMergeType>
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
const searchParam = ref({
  plantCd: '',
  deptCd: '',
  startYmd: '',
  endYmd: '',
  userId: ''
})
const period = ref([])
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      style: 'width: 100px',
      label: '사업장',
      align: 'center',
      sortable: true
    },
    {
      name: 'userInfo',
      field: 'userInfo',
      style: 'width: 300px',
      label: '부서/사번/성함',
      align: 'left',
      sortable: true
    },
    {
      name: 'consultDate',
      field: 'consultDate',
      label: '상담일',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'consultTypeName',
      field: 'consultTypeName',
      label: '상담구분',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'diseaseCurrent',
      field: 'diseaseCurrent',
      label: '상담내용',
      align: 'left',
      type: 'link',
      style: 'width: 220px',
      sortable: false
    }
  ],
  data: [],
  merge: [
    { index: 0, colName: 'userId' },
    { index: 1, colName: 'userId' }
  ]
})
const consultUrl = ref('')

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
  consultUrl.value = selectConfig.hea.checkup.suspect.history.consult.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 상담 목록 조회
 *******************************/
const getList = () => {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }

  $http({
    url: consultUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 목록 상세 조회(상담내용 클릭) 또는 등록 버튼 클릭
 *******************************/
const linkClick = (row: object | any) => {
  detailPopup(row)
}

const detailPopup = (result: object | any) => {
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./consultDetail.vue`)))
  popupOptions.value.title = '건강상담 상세'
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
  popupOptions.value.param = {
    suspectConsultId: result ? result.suspectConsultId : '',
    suspectId: result ? result.suspectId : ''
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}

/******************************
 * TODO (목적): 팝업 닫기
 *******************************/
const closePopup = () => {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
