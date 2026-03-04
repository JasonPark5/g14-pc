<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="DEVICE_CD"
            type="none"
            itemText="codeName"
            itemValue="code"
            name="deviceType"
            label="시스템 구분"
            v-model:value="searchParam.deviceType"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            :isFirstValue="false"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="기간"
            defaultStart="-2M"
            defaultEnd="0M"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-field
            type="user"
            label="사용자"
            beforeText=""
            name="userId"
            v-model:value="searchParam.userId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      title="메뉴 로그 목록"
      tableId="menuLog"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="gridHeight"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'menuLog001'
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
  period: Array<any>
  userId: stringNull
  deviceType: stringNull
  plantCd: stringNull
}
interface propType {
  height: string
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  height: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const searchParam = ref<searchParamType>({
  period: [],
  userId: '',
  deviceType: 'P',
  plantCd: null
})
const grid = ref({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false,
      style: 'width:160px'
    },
    {
      name: 'userName',
      field: 'userName',
      label: '사용자',
      align: 'center',
      sortable: false,
      style: 'width:120px'
    },
    {
      name: 'menuNm',
      field: 'menuNm',
      label: '메뉴명',
      align: 'left',
      sortable: false,
      style: 'width:200px'
    },
    {
      name: 'menuPath',
      field: 'menuPath',
      label: '메뉴 경로',
      align: 'left',
      sortable: false,
      style: 'width:360px'
    },
    {
      name: 'url',
      field: 'url',
      label: 'URL',
      align: 'left',
      sortable: false
    },
    {
      name: 'regDtStr',
      field: 'regDtStr',
      label: '접속일시',
      align: 'center',
      sortable: false,
      style: 'width:150px'
    }
  ],
  data: []
})
const listUrl = ref('')
/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.height && !Number.isNaN(Number(props.height.replace('px', '')))
      ? Number(props.height.replace('px', '')) - 127
      : 200
  if (height < 200) height = 200
  return height + 'px'
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
  listUrl.value = selectConfig.sys.log.menulog.list.url
  // code setting
  searchParam.value.period = [getPrevMonth(1) + '-01', getToday()]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
