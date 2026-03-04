<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-select
            codeGroupCd="RELATED_LAWS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="relatedLawsCd"
            label="관련법규"
            v-model:value="searchParam.relatedLawsCd"
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
      title="인허가 종류 목록"
      tableId="licensKindTable"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      selection="multiple"
      :editable="editable"
      rowKey="limLicenseKindId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="추가" v-if="editable" icon="add" @btnClicked="addrow" />
          <c-btn
            label="저장"
            v-if="editable && grid.data!.length > 0"
            icon="save"
            @btnClicked="saveLicenseKind"
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
import { licenseType } from './license'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'licenseKind'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<licenseType>
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'relatedLawsCd',
      field: 'relatedLawsCd',
      label: '관련법규',
      align: 'center',
      style: 'width:350px',
      type: 'select',
      codeGroupCd: 'RELATED_LAWS_CD',
      sortable: false
    },
    {
      name: 'limLicenseKindName',
      field: 'limLicenseKindName',
      label: '인허가종류명',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      type: 'number',
      style: 'width:70px',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:80px',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const searchParam = ref({
  useFlag: 'Y',
  relatedLawsCd: null
})
const editable = ref(true)
const useFlagItems = ref<Array<codeMasterType>>([])
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)

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
  listUrl.value = selectConfig.sop.lim.lincense.kind.list.url
  saveUrl.value = transactionConfig.sop.lim.lincense.kind.save.url
  deleteUrl.value = transactionConfig.sop.lim.lincense.kind.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
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
    grid.value.data = _result.data as Array<licenseType>
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addrow() {
  grid.value.data!.splice(0, 0, {
    editFlag: 'C',
    limLicenseKindId: uid(), // 인허가종류 알련번호
    relatedLawsCd: null, // 관련법규
    limLicenseKindName: '', // 인허가종류명
    sortOrder: '', // 정렬순서
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveLicenseKind() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    const saveData = grid.value.data!.filter((x) => x.editFlag == 'C' || x.editFlag == 'U')
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: saveUrl.value,
            method: 'POST',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            getList()
          })
        },
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
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
