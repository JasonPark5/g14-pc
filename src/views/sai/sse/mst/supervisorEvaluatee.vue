<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            :comboItems="useFlagItems"
            label="사용여부"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            type="search"
            v-model:value="searchParam.useFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            type="search"
            :isFirstValue="false"
            label="평가대상자 부서"
            name="deptCd"
            v-model:value="searchParam.deptCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="관리감독자 평가대상자 목록"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="grid.data"
      :usePaging="false"
      :columnSetting="false"
    >
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRow" />
            <c-btn
              v-if="editable && grid.data!.length > 0"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="grid.data"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="save"
              @btnCallback="saveCallback"
            />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
      <template v-slot:customArea="{ props, col }">
        <c-field
          :editable="editable"
          type="dept_spot_user"
          name="userId"
          v-model:value="props.row[col.name]"
          @update:value="datachange(props)"
        />
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
  name: 'supervisorEvaluatee'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
const $language = inject('$language') as GetTranLanguageFunction

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
  useFlag: 'Y',
  deptCd: null
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'deptCd' }],
  columns: [
    {
      name: 'deptNm',
      field: 'deptNm',
      label: '평가대상자 부서',
      align: 'center',
      sortable: true
    },
    {
      required: true,
      name: 'evaluateeId',
      field: 'evaluateeId',
      label: '평가대상자',
      align: 'center',
      type: 'custom',
      style: 'width: 27%',
      sortable: true
    },
    {
      name: 'evaluator1',
      field: 'evaluator1',
      label: '1차 평가자',
      align: 'center',
      type: 'custom',
      style: 'width: 27%',
      sortable: true
    },
    {
      name: 'evaluator2',
      field: 'evaluator2',
      label: '2차 평가자',
      align: 'center',
      type: 'custom',
      style: 'width: 27%',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:9%',
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const table = ref<any>(null)
const listUrl = ref('')
const saveUrl = ref('')
const useFlagItems = ref<Array<codeMasterType>>([
  { code: 'Y', codeName: $language('사용') },
  { code: 'N', codeName: $language('미사용') }
])

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
  listUrl.value = selectConfig.sai.sse.supervisor.mst.evaluatee.url
  saveUrl.value = transactionConfig.sai.sse.supervisor.mst.evaluatee.url
  // code setting
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function addRow() {
  grid.value.data?.push({
    evaluateeId: null,
    evaluator1: null,
    evaluator2: null,
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function save() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getList()
}
function datachange(_props: any) {
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
    _props.row.chgUserId = user.value.userId
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
