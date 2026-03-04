<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        :title="tableTitle"
        :columns="grid.columns"
        rowKey="dataId"
        :data="grid.data"
        :editable="editable"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
            <c-btn
              v-show="editable && grid.data.length > 0"
              :url="insertUrl"
              :isSubmit="isSave"
              :param="grid.data"
              mappingType="POST"
              label="저장"
              icon="save"
              @beforeAction="saveItem"
              @btnCallback="saveCallback"
            />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </template>
      </c-table>
    </div>
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
  name: 'emergencyRelationInfoDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

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
interface propType {
  searchParam: {
    plantCd: stringNull
    dataTypeCd: stringNull
    useFlag: stringNull
  }
  tabParam: {
    dataTypeCd: stringNull
    title: stringNull
  }
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  searchParam: () => {
    return {
      plantCd: '1',
      dataTypeCd: '1',
      useFlag: 'Y'
    }
  },
  tabParam: () => {
    return {
      dataTypeCd: '1',
      title: '비상연락체계도'
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:100px',
      type: 'plant'
    },
    {
      required: true,
      name: 'dataName',
      field: 'dataName',
      label: '자료명',
      align: 'left',
      sortable: true,
      style: 'width:150px',
      type: 'text'
    },
    {
      name: 'dataDesc',
      field: 'dataDesc',
      label: '자료설명',
      align: 'left',
      sortable: true,
      style: 'width:250px',
      type: 'text'
    },
    {
      name: 'attach',
      field: 'attach',
      label: '관련 파일첨부',
      align: 'center',
      style: 'width:200px',
      type: 'attach',
      taskClassCd: 'EMERGENCY_RELATION',
      keyText: 'dataId',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:90px',
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const tableTitle = computed(() => {
  return $language(props.tabParam.title) + ' ' + $language('목록')
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
  listUrl.value = selectConfig.sop.eap.relation.list.url
  insertUrl.value = transactionConfig.sop.eap.relation.insert.url
  deleteUrl.value = transactionConfig.sop.eap.relation.delete.url
  // code setting
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: props.searchParam
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function add() {
  grid.value.data.splice(0, 0, {
    plantCd: '',
    dataTypeCd: props.tabParam.dataTypeCd,
    dataId: uid(),
    dataName: '',
    dataDesc: '',
    useFlag: 'Y',
    editFlag: 'C'
  })
}
function saveItem() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
