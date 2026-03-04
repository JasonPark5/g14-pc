<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            defaultStart="-2y"
            defaultEnd="0y"
            type="year"
            label="년도"
            name="years"
            v-model:value="searchParam.years"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="발급부서"
            name="issuedDeptCd"
            v-model:value="searchParam.issuedDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :plantCd="searchParam.plantCd"
            :customPopupParam="{ targetKey: 'process' }"
            label="단위공정"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            stepperGrpCd="SWP_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="swpStepCd"
            label="진행단계"
            v-model:value="searchParam.swpStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table title="작업허가서 년도별 통계" :columns="grid.columns" :data="grid.data">
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <q-btn
          v-if="props.row[col.name]"
          flat
          class="tableinnerBtn"
          :class="{
            'tableinnerBtn-left': col.align === 'left' ? true : false,
            'tableinnerBtn-right': col.align === 'right' ? true : false
          }"
          :align="col.align"
          color="blue-6"
          @click.stop="linkClick(props.row, col)"
        >
          <template v-slot>
            {{ toThousandFilter(props.row[col.name]) }}
          </template>
        </q-btn>
        <template v-else>0</template>
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
import { toThousandFilter } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safeWorkPermitState'
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
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  years: [],
  issuedDeptCd: null,
  processCd: null,
  swpStepCd: null
})
const searchedParam = ref({
  plantCd: null,
  years: [],
  issuedDeptCd: null,
  processCd: null,
  swpStepCd: null
})
const grid = ref({
  columns: [
    {
      name: 'workYear',
      field: 'workYear',
      label: '구분',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    {
      name: 'fire',
      field: 'fire',
      label: '화기',
      align: 'right',
      sortable: true,
      type: 'custom',
      style: 'width:100px'
    },
    {
      name: 'normal',
      field: 'normal',
      label: '일반',
      align: 'right',
      sortable: true,
      type: 'custom',
      style: 'width:100px'
    },
    {
      name: 'sub',
      field: 'sub',
      label: '보충작업',
      child: [
        {
          name: 'subSum',
          field: 'subSum',
          label: '소계',
          align: 'right',
          sortable: true,
          type: 'custom',
          style: 'width:100px'
        },
        {
          name: 'confinedSpace',
          field: 'confinedSpace',
          label: '밀폐',
          align: 'right',
          sortable: true,
          type: 'custom',
          style: 'width:100px'
        },
        {
          name: 'blackout',
          field: 'blackout',
          label: '정전',
          align: 'right',
          sortable: true,
          type: 'custom',
          style: 'width:100px'
        },
        {
          name: 'radiation',
          field: 'radiation',
          label: '방사선',
          align: 'right',
          sortable: true,
          type: 'custom',
          style: 'width:100px'
        },
        {
          name: 'excavation',
          field: 'excavation',
          label: '굴착',
          align: 'right',
          sortable: true,
          type: 'custom',
          style: 'width:100px'
        },
        {
          name: 'highPlace',
          field: 'highPlace',
          label: '고소',
          align: 'right',
          sortable: true,
          type: 'custom',
          style: 'width:100px'
        },
        {
          name: 'heavyEquipment',
          field: 'heavyEquipment',
          label: '중장비',
          align: 'right',
          sortable: true,
          type: 'custom',
          style: 'width:100px'
        }
      ]
    },
    {
      name: 'totalSum',
      field: 'totalSum',
      label: '총계',
      align: 'right',
      sortable: true,
      type: 'custom',
      style: 'width:100px'
    }
  ],
  data: []
})
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
  listUrl.value = selectConfig.sop.swp.workPermit.state.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 작업허가서 통계 조회
 *******************************/
function getList() {
  if (
    searchParam.value.years &&
    searchParam.value.years.length > 0 &&
    !searchParam.value.years[0]
  ) {
    searchParam.value.years = []
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
    _.extend(searchedParam.value, searchParam.value)
  })
}
/******************************
 * TODO (목적): 작업허가서 통계 팝업 표시
 * @param (1): 행 정보
 * @param (2): 컬럼 정보
 *******************************/
function linkClick(row: any, col: tableColumnType) {
  // SPT0000001	일반
  // SPT0000005	화기
  let permitTypeCd = ''
  let supplementWorkTypeCd = ''
  switch (col.name) {
    case 'fire': // 화기
      permitTypeCd = 'SPT0000005'
      break
    case 'normal': // 일반
      permitTypeCd = 'SPT0000001'
      break
    case 'confinedSpace': // 밀폐
      supplementWorkTypeCd = 'SSWT000001'
      break
    case 'blackout': // 정전
      supplementWorkTypeCd = 'SSWT000005'
      break
    case 'radiation': // 방사선
      supplementWorkTypeCd = 'SSWT000010'
      break
    case 'excavation': // 굴착
      supplementWorkTypeCd = 'SSWT000015'
      break
    case 'highPlace': // 고소
      supplementWorkTypeCd = 'SSWT000020'
      break
    case 'heavyEquipment': // 중장비
      supplementWorkTypeCd = 'SSWT000025'
      break
    default:
      permitTypeCd = ''
      supplementWorkTypeCd = ''
      break
  }
  popupOptions.value.title = '작업허가서 통계 상세'
  popupOptions.value.param = {
    permitYear: row.workYear,
    plantCd: searchedParam.value.plantCd,
    issuedDeptCd: searchedParam.value.issuedDeptCd,
    processCd: searchedParam.value.processCd,
    swpStepCd: searchedParam.value.swpStepCd,
    permitTypeCd: permitTypeCd,
    supplementWorkTypeCd: supplementWorkTypeCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safeWorkPermitStateDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 작업허가서 통계 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
