<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="LAW_ID"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="lawId"
            label="법령"
            v-model:value="searchParam.lawId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-field type="user" label="담당자" name="userId" v-model:value="searchParam.userId" />
        </div>
      </template>
    </c-search-box>
    <c-table ref="table" title="법령 담당자 목록" :columns="grid.columns" :data="grid.data">
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'users'">
          <c-tag
            :editable="editable"
            icon="person_outline"
            itemText="userName"
            itemValue="userId"
            name="users"
            v-model:value="props.row.users"
            @addTag="addManager(props.row)"
            @removeTag="(item: lawManagerType) => removeManager(item)"
          />
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
import { lawIdType, lawManagerType } from './lawManager'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'lawManager'
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
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'lawName',
      field: 'lawName',
      label: '법령',
      align: 'left',
      style: 'width:400px',
      sortable: true
    },
    {
      name: 'users',
      field: 'users',
      label: '담당자',
      align: 'left',
      type: 'custom',
      sortable: true
    }
  ],
  data: []
})
const searchParam = ref({
  lawId: null,
  userId: null
})
const row = ref<lawIdType>({
  lawId: '',
  lawName: '',
  users: null
})
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')

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
  listUrl.value = selectConfig.mdm.lawManager.list.url
  insertUrl.value = transactionConfig.mdm.lawManager.insert.url
  deleteUrl.value = transactionConfig.mdm.lawManager.delete.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 법령별 담당자 조회
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
 * TODO (목적): 사용자 검색 팝업 표시
 * @param (1): 행 정보
 *******************************/
function addManager(_row: any) {
  row.value = _.clone(_row)
  popupOptions.value = getPopupOptions('user', popupOptions.value, closePopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 선정한 사용자 정보를 법령에 따른 담당자로 저장
 * @param (1): 선정한 사용자 정보들
 *******************************/
function closePopup(data: Array<userType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData: Array<lawManagerType> = []
    _.forEach(data, (item) => {
      if (_.findIndex(row.value.users, { userId: item.userId }) === -1) {
        item.lawId = row.value.lawId
        saveData.push(item)
      }
    })
    $http({
      url: insertUrl.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      message.requestSuccess()
      getList()
    })
  }
}
/******************************
 * TODO (목적): 법령별 담당자 삭제
 * @param (1): 법령정보
 *******************************/
function removeManager(item: lawManagerType) {
  $http({
    url: $format(deleteUrl.value, item.mdmLawManagerId),
    method: 'DELETE'
  }).then(() => {
    message.requestSuccess()
    getList()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
