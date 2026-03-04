<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="삭제" icon="remove" />
                <c-btn v-if="editable" label="저장" icon="save" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  label="활동월"
                  name="col000"
                  type="month"
                  default="today"
                  v-model:value="data.actMonth"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  type="edit"
                  :required="true"
                  codeGroupCd="ENV_GAS_ACTIVITY_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="배출활동"
                  name="activityCd"
                  v-model:value="data.activityCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  type="edit"
                  :required="true"
                  codeGroupCd="ENV_GAS_MST_DISCHARGE_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="배출시설코드"
                  name="dischargeCd"
                  v-model:value="data.dischargeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="배출시설 명"
                  name="dischargeName"
                  v-model:value="data.dischargeName"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant :required="true" type="edit" name="plantCd" v-model:value="data.plantCd" />
              </div> -->
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="연료별 정보"
            tableId="processManual"
            :columns="grid.columns"
            gridHeight="300px"
            :data="grid.data"
            :columnSetting="false"
            :isFullScreen="false"
            :usePaging="false"
            :expandAll="true"
            selection="multiple"
            rowKey="fuel"
          >
            <!-- 버튼 영역 -->
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn label="추가" icon="add" />
                <c-btn label="삭제" icon="remove" />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </div>
    </q-form>
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
  name: 'emissionsDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const message = useMessageStore()
// const userStroe = useUserStore()
// const { user } = storeToRefs(userStroe)

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
const data = ref<any>({
  plantCd: '1000',
  dischargeName: '공정 연소시설 #21',
  actMonth: '2022-11',
  activityCd: 'EGA001',
  dischargeCd: 'EGMD001',
  deptCd: 'D10005'
})
// const saveUrl = ref(transactionConfig.env.air.daily.result.insert.url)
// const detailUrl = ref('')
// const deleteUrl = ref('')
// const isSave = ref(false)
const editable = ref(true)
const editForm = ref<any>(null)
const table = ref<any>(null)
const grid = ref<gridType>({
  columns: [
    {
      name: 'fuel',
      field: 'fuel',
      label: '연료명',
      align: 'center',
      type: 'text',
      sortable: true
    },
    {
      name: 'col2',
      field: 'col2',
      label: '분석기관',
      align: 'center',
      type: 'select',
      comboItems: [
        { code: '1', codeName: '자체분석' },
        { code: '2', codeName: '시험기관' }
      ],
      sortable: true,
      style: 'width: 120px'
    },
    {
      name: 'col3',
      field: 'col3',
      label: '연료사용량',
      align: 'center',
      sortable: true,
      type: 'number',
      style: 'width: 120px'
    },
    {
      name: 'col31',
      field: 'col31',
      label: '순발열량',
      helpcomment:
        '[총발열량] 이란 연료의 연소과정에서 발생하는 수증기의 잠열을 포함한 발열량을 말한다. <br/>[순발열량] 이란 연료의 연소과정에서 발생하는 수증기의 잠열을 제외한 발열량을 말한다.',
      align: 'center',
      sortable: true,
      type: 'number',
      style: 'width: 120px'
    },
    {
      name: 'col200',
      field: 'col200',
      label: '적용Tier',
      align: 'center',
      type: 'select',
      comboItems: [
        { code: '1', codeName: 'Tier 1' },
        { code: '2', codeName: 'Tier 2' },
        { code: '3', codeName: 'Tier 3' },
        { code: '4', codeName: 'Tier 4' }
      ],
      sortable: true,
      style: 'width: 120px'
    },
    {
      name: 'col40',
      field: 'col40',
      label: '배출계수(MWh)',
      helpcomment:
        'MWh 배출계수는 이산화탄소 배출량을 전기발전량으로 나눈 값으로, 온실가스 배출계수라고도 한다. ',
      child: [
        {
          name: 'col4',
          field: 'col4',
          label: 'CO2(tCO2/TJ)',
          align: 'center',
          sortable: true,
          type: 'number',
          style: 'width: 120px'
        },
        {
          name: 'col5',
          field: 'col5',
          label: 'CH4(tCH4/TJ)',
          align: 'center',
          sortable: true,
          type: 'number',
          style: 'width: 120px'
        },
        {
          name: 'col6',
          field: 'col6',
          label: 'N2O(tN2O/TJ)',
          align: 'center',
          sortable: true,
          type: 'number',
          style: 'width: 120px'
        }
      ]
    },
    {
      name: 'col32',
      field: 'col32',
      label: '산화율(%)',
      align: 'center',
      sortable: true,
      type: 'number',
      style: 'width: 120px'
    },
    {
      name: 'col40',
      field: 'col40',
      label: '배출량',
      child: [
        {
          name: 'col41',
          field: 'col41',
          label: 'CO2(ton)',
          align: 'center',
          sortable: true,
          type: 'number',
          style: 'width: 120px'
        },
        {
          name: 'col51',
          field: 'col51',
          label: 'CH4(kg)',
          align: 'center',
          sortable: true,
          type: 'number',
          style: 'width: 120px'
        },
        {
          name: 'col61',
          field: 'col61',
          label: 'N2O(kg)',
          align: 'center',
          sortable: true,
          type: 'number',
          style: 'width: 120px'
        }
      ]
    }
  ],
  data: [
    {
      fuel: '나프타',
      col1: '1',
      col2: '2',
      col02: '1',
      col3: '100',
      col4: '0.0021',
      col5: '0.0127',
      col6: '0.0006',
      col41: '123',
      col51: '0.123',
      col61: '0.123',
      col200: '2'
    }
  ]
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
  // url setting
  // code setting
  // list setting
  // getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
