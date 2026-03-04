<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="EAP_EVAL_CLASS_CD"
            itemText="codeName"
            itemValue="code"
            name="trainingTypeCd"
            label="훈련구분"
            v-model:value="searchParam.trainingTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="EVAL_ITEM_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="evalItemTypeCd"
            label="항목구분"
            v-model:value="searchParam.evalItemTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="useFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            label="사용여부"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="훈련평가항목 목록"
      :columnSetting="false"
      :columns="grid.columns"
      :data="grid.data"
      :isFullScreen="false"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" :showLoading="false" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable && grid.data.length > 0"
            :url="insertUrl"
            :isSubmit="isSave"
            :param="saveData"
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
  name: 'traningAssessItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
  plantCd: stringNull
  trainingTypeCd?: stringNull
  useFlag: stringNull
  evalItemTypeCd?: stringNull
}
interface gridType {
  columns: Array<tableColumnType>
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

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref<gridType>({
  columns: [],
  data: []
})
const searchParam = ref<searchParamType>({
  plantCd: '',
  trainingTypeCd: null,
  useFlag: 'Y',
  evalItemTypeCd: null
})
const useFlagItems = ref<codeMasterType>([])
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const table = ref<any>(null)
const saveData = ref<Array<any>>([])
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
  listUrl.value = selectConfig.sop.eap.base.list.url
  insertUrl.value = transactionConfig.sop.eap.base.insert.url
  deleteUrl.value = transactionConfig.sop.eap.base.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  getComboItems('EAP_EVAL_CLASS_CD').then((_result) => {
    grid.value.columns = [
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
        name: 'trainingTypeCd',
        field: 'trainingTypeCd',
        label: '훈련구분',
        align: 'center',
        sortable: true,
        style: 'width:130px',
        type: 'select',
        codeGroupCd: 'EAP_EVAL_CLASS_CD'
      },
      {
        name: 'evalItemTypeCd',
        field: 'evalItemTypeCd',
        label: '항목구분',
        align: 'center',
        sortable: true,
        style: 'width:140px',
        type: 'select',
        codeGroupCd: 'EVAL_ITEM_TYPE_CD'
      },
      {
        required: true,
        name: 'evaluationItemName',
        field: 'evaluationItemName',
        label: '평가항목',
        align: 'left',
        sortable: true,
        style: 'width:500px',
        type: 'text'
      },
      {
        name: 'useFlag',
        field: 'useFlag',
        label: '사용여부',
        align: 'center',
        sortable: true,
        style: 'width:40px',
        type: 'check',
        true: 'Y',
        false: 'N'
      },
      {
        name: 'sortOrder',
        field: 'sortOrder',
        label: '정렬순서',
        align: 'center',
        sortable: true,
        style: 'width:40px',
        type: 'number'
      }
    ]
    getList()
  })
  // list setting
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
function add() {
  grid.value.data.splice(0, 0, {
    plantCd: '',
    trainingTypeCd: null,
    sopEmergencyTrainingEvalItemId: uid(),
    evaluationItemName: '',
    sortOrder: grid.value.data.length + 1,
    useFlag: 'Y',
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    editFlag: 'C'
  })
}
function saveItem() {
  if (validTable(grid.value.columns, grid.value.data)) {
    saveData.value = grid.value.data.filter((item2) => {
      return item2.editFlag === 'C' || item2.editFlag === 'U'
    })
    if (saveData.value.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          _.forEach(grid.value.data, (item) => {
            item.regUserId = user.value.userId
            item.chgUserId = user.value.userId
          })
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.',
        type: 'info' // success / info / warning / error
      })
    }
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
