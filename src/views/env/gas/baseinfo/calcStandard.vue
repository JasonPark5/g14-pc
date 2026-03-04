<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template slot="search">
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            :comboItems="col1Items"
            itemText="codeName"
            itemValue="code"
            label="배출구분"
            name="col1"
            v-model:value="searchParam.col1">
          </c-select>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            :comboItems="col2Items"
            itemText="codeName"
            itemValue="code"
            label="배출시설 종류"
            name="col2"
            v-model:value="searchParam.col2">
          </c-select>
        </div> 
      </template>
    </c-search-box> -->
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="시설등급별 배출기준량"
          :columns="grid.columns"
          :gridHeight="grid.height"
          :data="grid.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          selection="multiple"
          rowKey="col0"
          @linkClick="linkClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="추가" icon="add" />
              <c-btn label="삭제" icon="remove" />
              <c-btn label="저장" icon="save" />
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
  name: 'calcStandard'
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'col1',
      field: 'col1',
      label: '산정등급',
      align: 'center',
      type: 'select',
      comboItems: [
        { code: '1', codeName: 'Tier 1' },
        { code: '2', codeName: 'Tier 2' },
        { code: '3', codeName: 'Tier 3' },
        { code: '4', codeName: 'Tier 4' }
      ],
      sortable: true
    },
    // {
    //   name: 'col2',
    //   field: 'col2',
    //   label: '배출시설 종류',
    //   align: 'center',
    //   type: 'select',
    //   comboItems: this.col2Items,
    //   sortable: true,
    // },
    {
      name: 'col3',
      field: 'col3',
      label: 'CO2/Ton',
      type: 'number',
      suffix: 'Ton',
      sortable: true
    },
    {
      name: 'col4',
      field: 'col4',
      label: 'CH4/kg',
      type: 'number',
      suffix: 'kg',
      sortable: true
    },
    {
      name: 'col5',
      field: 'col5',
      label: 'N20/kg',
      type: 'number',
      suffix: 'kg',
      sortable: true
    },
    {
      name: 'col6',
      field: 'col6',
      label: 'CO2eq/Ton',
      type: 'number',
      suffix: 'Ton',
      sortable: true
    }
  ],
  data: [
    {
      col0: uid(),
      col1: '1',
      col3: '1200',
      col4: '300',
      col5: '500',
      col6: '800'
    },
    {
      col0: uid(),
      col1: '2',
      col3: '500',
      col4: '1300',
      col5: '5100',
      col6: '6400'
    },
    {
      col0: uid(),
      col1: '3',
      col3: '1100',
      col4: '600',
      col5: '800',
      col6: '1400'
    },
    {
      col0: uid(),
      col1: '4',
      col3: '900',
      col4: '200',
      col5: '100',
      col6: '300'
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
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
