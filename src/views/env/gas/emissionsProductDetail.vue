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
                <c-datepicker label="생산월" name="month" type="month" v-model:value="data.month" />
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
            ref="table2"
            title="제품별 생산량"
            :columns="grid2.columns"
            :gridHeight="grid2.height"
            :data="grid2.data"
            :columnSetting="false"
            :isFullScreen="false"
            :usePaging="false"
            :expandAll="true"
          />
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
  name: 'emissionsProductDetail'
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
  month: '2021-11',
  dischargeName: '공정 연소시설',
  plantCd: '1000'
})
// const saveUrl = ref(transactionConfig.env.air.daily.result.insert.url)
// const detailUrl = ref('')
// const deleteUrl = ref('')
// const isSave = ref(false)
const editable = ref(true)
const editForm = ref<any>(null)
const table2 = ref<any>(null)
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'col0',
      field: 'col0',
      label: '제품명',
      align: 'center',
      sortable: true
    },
    {
      name: 'col1',
      field: 'col1',
      label: '제품단위',
      align: 'center',
      sortable: true,
      style: 'width: 150px'
    },
    {
      name: 'col2',
      field: 'col2',
      label: '생산량',
      align: 'center',
      type: 'number',
      style: 'width: 150px',
      sortable: true
    }
  ],
  data: [
    {
      col0: '제품1',
      col1: 'M/T',
      col2: '135'
    },
    {
      col0: '제품2',
      col1: 'M/T',
      col2: '90'
    }
  ],
  height: '300px'
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
