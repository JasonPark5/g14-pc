<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="방지시설"
            name="envAirMstPreventiveId"
            :customPopupParam="{ targetKey: 'airPreventive' }"
            v-model:value="searchParam.envAirMstPreventiveId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="방지시설별 부품현황"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      gridHeight="840px"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        {{ props.row[col.name] }}
        <template
          v-if="col.name === 'cleanNextDt' && props.row.cleanDiff >= 1 && props.row.cleanDiff <= 7"
        >
          <q-badge push color="red"> D-{{ props.row.cleanDiff }} </q-badge>
        </template>
        <template
          v-else-if="
            col.name === 'changeNextDt' && props.row.changeDiff >= 1 && props.row.changeDiff <= 7
          "
        >
          <q-badge push color="red"> D-{{ props.row.changeDiff }} </q-badge>
        </template>
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
  name: 'airPreventivePartStatus'
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
  envAirMstPreventiveId: ''
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'plantCd' },
    { index: 1, colName: 'envAirMstOutletId' },
    { index: 2, colName: 'envAirMstOutletPartType' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width: 150px',
      sortable: true
    },
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      align: 'center',
      type: 'link',
      sortable: true
    },
    {
      name: 'envAirMstPreventivePartTypeName',
      field: 'envAirMstPreventivePartTypeName',
      label: '부품타입',
      align: 'center',
      sortable: true
    },
    {
      name: 'envAirMstPreventivePartName',
      field: 'envAirMstPreventivePartName',
      label: '부품명',
      align: 'center',
      type: 'link',
      sortable: true
    },
    {
      label: '청소',
      align: 'center',
      child: [
        {
          name: 'cleanCycle',
          field: 'cleanCycle',
          label: '청소주기',
          align: 'center',
          sortable: true
        },
        {
          name: 'cleanDt',
          field: 'cleanDt',
          label: '최근청소일',
          align: 'center',
          sortable: true
        },
        {
          name: 'cleanNextDt',
          field: 'cleanNextDt',
          label: '다음청소예정일',
          align: 'center',
          sortable: true,
          type: 'custom'
        }
      ]
    },
    {
      label: '교체',
      align: 'center',
      child: [
        {
          name: 'changeCycle',
          field: 'changeCycle',
          label: '교체주기',
          align: 'center',
          sortable: true
        },
        {
          name: 'changeDt',
          field: 'changeDt',
          label: '최근교체일',
          align: 'center',
          sortable: true
        },
        {
          name: 'changeNextDt',
          field: 'changeNextDt',
          label: '다음교체예정일',
          align: 'center',
          sortable: true,
          type: 'custom'
        }
      ]
    },
    {
      name: 'sizeName',
      field: 'sizeName',
      label: '사이즈',
      align: 'center',
      sortable: true
    },
    {
      name: 'amount',
      field: 'amount',
      label: '수량',
      align: 'center',
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
  listUrl.value = selectConfig.env.air.mst.preventive.part.status
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
function linkClick(row: any, col: any) {
  let tabname = ''
  if (col.name === 'preventiveName') tabname = 'govScheduleInfo'
  else if (col.name === 'envAirMstPreventivePartName') tabname = 'govScheduleHistory'
  popupOptions.value.title = '대기 방지시설 상세'
  popupOptions.value.param = {
    envAirMstPreventiveId: row.envAirMstPreventiveId,
    tabName: tabname
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./airPreventiveDetail.vue`))
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
