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
            label="작성기간"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="소방 훈련·교육 실시결과기록부 목록"
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
  name: 'fireFightingPerformanceResult'
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
  period: [],
  seniorUserId: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'recordName',
      field: 'recordName',
      label: '실시결과기록부명',
      style: 'width:150px',
      align: 'left',
      type: 'link',
      sortable: true
    },
    {
      name: 'regDtStr',
      field: 'regDtStr',
      label: '작성일',
      style: 'width:60px',
      align: 'center',
      sortable: true
    },
    {
      name: 'education',
      field: 'education',
      label: '교육',
      child: [
        {
          name: 'educationPeriod',
          field: 'educationPeriod',
          label: '교육일시',
          style: 'width:80px',
          align: 'center',
          sortable: true
        },
        {
          name: 'educationLocation',
          field: 'educationLocation',
          label: '교육장소',
          style: 'width:100px',
          align: 'center',
          sortable: true
        }
      ]
    },
    {
      name: 'training',
      field: 'training',
      label: '훈련',
      child: [
        {
          name: 'trainingTypeName',
          field: 'trainingTypeName',
          label: '훈련구분',
          style: 'width:60px',
          align: 'center',
          sortable: true
        },
        {
          name: 'trainingPeriod',
          field: 'trainingPeriod',
          label: '훈련일시',
          style: 'width:80px',
          align: 'center',
          sortable: true
        },
        {
          name: 'trainingLocation',
          field: 'trainingLocation',
          label: '훈련장소',
          style: 'width:100px',
          align: 'center',
          sortable: true
        }
      ]
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
  listUrl.value = selectConfig.fft.fireFightingPerformanceResult.list.url
  // code setting
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
function linkClick(row?: any) {
  popupOptions.value.title = '소방 훈련·교육 실시결과기록부 상세'
  popupOptions.value.param = {
    sopFireFightingPerformanceResultRecordId: row
      ? row.sopFireFightingPerformanceResultRecordId
      : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./fireFightingPerformanceResultDetail.vue`))
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
