<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="목표년도"
            name="targetYear"
            type="year"
            default="today"
            v-model:value="searchParam.targetYear"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="ENV_GAS_ACTIVITY_CD"
            itemText="codeName"
            itemValue="code"
            label="배출활동"
            name="activityCd"
            v-model:value="searchParam.activityCd"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="배출량 목표"
          tableId="processManual"
          :columns="grid.columns"
          :gridHeight="grid.height"
          :data="grid.data"
          :merge="grid.merge"
          :columnSetting="false"
          :isFullScreen="true"
          :usePaging="false"
          :expandAll="true"
          @linkClick="linkClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <!-- <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" /> -->
              <!-- <c-btn v-if="editable" label="저장" icon="save" @btnClicked="saveTarget" /> -->
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
  name: 'activeData'
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
  columns?: Array<tableColumnType>
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
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  targetYear: '2025',
  activityCd: null
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'activityName' },
    { index: 1, colName: 'activityName' },
    { index: 2, colName: 'activityName' },
    { index: 3, colName: 'dischargeName' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true
    },
    {
      name: 'targetYear',
      field: 'targetYear',
      label: '목표년도',
      align: 'center',
      sortable: true
    },
    {
      name: 'activityName',
      field: 'activityName',
      label: '배출활동',
      align: 'center',
      sortable: true
    },
    {
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설',
      align: 'center',
      sortable: true
    },
    {
      name: 'col0',
      field: 'col0',
      label: '연료별 목표배출량(Ton)',
      align: 'center',
      child: [
        {
          name: 'fuel',
          field: 'fuel',
          label: '연료명',
          align: 'center',
          sortable: true
        },
        {
          name: 'co2',
          field: 'co2',
          label: 'CO2',
          align: 'center',
          type: 'number',
          sortable: true
        },
        {
          name: 'ch4',
          field: 'ch4',
          label: 'CH4',
          align: 'center',
          type: 'number',
          sortable: true
        },
        {
          name: 'n2o',
          field: 'n2o',
          label: 'N2O',
          align: 'center',
          type: 'number',
          sortable: true
        }
      ]
    }
  ],
  data: [
    {
      plantName: '사업장1',
      targetYear: '2022',
      activityName: '기체연료연소',
      dischargeName: '공정연소시설 #021',
      fuel: '나프타',
      co2: '123',
      ch4: '0.8',
      n2o: '0.12'
    },
    {
      plantName: '사업장1',
      targetYear: '2022',
      activityName: '기체연료연소',
      dischargeName: '공정연소시설 #021',
      fuel: '중류',
      co2: '21',
      ch4: '0.9',
      n2o: '0.11'
    },
    {
      plantName: '사업장1',
      targetYear: '2022',
      activityName: '기체연료연소',
      dischargeName: '공정연소시설 #033',
      fuel: 'LNG',
      co2: '120',
      ch4: '0.35',
      n2o: '0.7'
    }
  ]
})
const editable = ref(true)
// const listUrl = ref('')

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
  // code setting
  // list setting
  // getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  // $http({
  //   url: listUrl.value,
  //   method: 'GET',
  //   params: searchParam.value
  // }).then((_result: any) => {
  //   grid.value.data = _result.data
  // })
}
// /******************************
//  * TODO (목적): 상세보기 팝업
//  *******************************/
function linkClick(row: any) {
  //   popupOptions.value.title = '배출시설 상세'
  //   popupOptions.value.param = {
  //     envGasMstDischargeId: row ? row.envGasMstDischargeId : '',
  //     plantCd: row ? row.plantCd : ''
  //   }
  //   popupOptions.value.target = shallowRef(
  //     defineAsyncComponent(() => import(`@/views/env/gas/baseinfo/discharFacDetail.vue`))
  //   )
  //   popupOptions.value.visible = true
  //   popupOptions.value.closeCallback = closePopup
  // }
  // function closePopup() {
  //   popupOptions.value.target = null
  //   popupOptions.value.visible = false
  //   getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
