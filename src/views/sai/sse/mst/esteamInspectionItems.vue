<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <!-- <c-search-box @enter="getCodes">
          <template v-slot:search>
            <div class="col-4">
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
        </c-search-box> -->
        <c-tree-table
          ref="mainTable"
          class="sapa"
          title="EHS팀 반기점검항목"
          :columns="mainGrid.columns"
          :data="mainGrid.data"
          parentProperty="attrVal1"
          customID="code"
          :usePaging="false"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          :isExcelDown="false"
          :isFixExpand="true"
          @rowClick="getChecklist"
        >
          <!-- 버튼 영역 -->
          <!-- <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getCodes" />
            </q-btn-group>
          </template> -->
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="checkTable"
          title="중분류"
          :columnSetting="false"
          :isFullScreen="false"
          :isExcelDown="false"
          :filtering="false"
          :columns="subGrid.columns"
          :data="subGrid.data"
        >
          <!-- selection="multiple"
          rowKey="saiInternalAuditChecklistId" -->
          <!-- <template v-slot:table-chip>
            <q-chip v-if="selectRow.code" size="md" outline square dense color="primary">
              {{ selectRow.code }}
            </q-chip>
          </template> -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && selectRow.code"
                label="추가"
                icon="add"
                @btnClicked="addCheck"
              />
              <!-- <c-btn v-if="editable && selectSaiSapaEsMstId" label="삭제" icon="remove" @btnClicked="deleteCheck" /> -->
              <c-btn
                v-if="editable && selectRow.code && subGrid.data!.length > 0"
                label="저장"
                icon="save"
                @btnClicked="saveMst"
              />
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
  name: 'internalChecklist'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '40%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  // plantCd: null,
  useFlag: 'Y',
  groupId: null,
  level: 0
})
const mainGrid = ref<gridType>({
  columns: [
    {
      name: 'codeName',
      field: 'codeName',
      label: '대분류명',
      align: 'left',
      sortable: false
    }
    // {
    //   name: 'plantCd',
    //   field: 'plantCd',
    //   label: '사업장',
    //   align: 'center',
    //   sortable: true,
    //   required: true,
    //   style: 'width:80px',
    //   type: 'plant'
    // },
    // {
    //   name: 'sortOrder',
    //   field: 'sortOrder',
    //   label: '순번',
    //   align: 'center',
    //   style: 'width:50px',
    //   sortable: true,
    //   type: 'number'
    // },
    // {
    //   required: true,
    //   name: 'requirement',
    //   field: 'requirement',
    //   label: '법적 요구사항',
    //   align: 'left',
    //   type: 'text',
    //   sortable: false
    // },
    // {
    //   name: 'relatedLaw',
    //   field: 'relatedLaw',
    //   label: '관계법령',
    //   align: 'left',
    //   style: 'width:200px',
    //   type: 'text',
    //   sortable: false
    // },
    // {
    //   name: 'useFlag',
    //   field: 'useFlag',
    //   label: '사용여부',
    //   align: 'center',
    //   style: 'width:50px',
    //   type: 'check',
    //   true: 'Y',
    //   false: 'N',
    //   sortable: false
    // },
    // {
    //   name: 'customCol',
    //   field: 'customCol',
    //   label: '상세',
    //   align: 'center',
    //   style: 'width:40px',
    //   type: 'custom',
    //   sortable: false
    // }
  ],
  data: []
})
const subGrid = ref<gridType>({
  columns: [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      type: 'number',
      align: 'center',
      style: 'width:10%',
      sortable: true
    },
    {
      required: true,
      name: 'requirement',
      field: 'requirement',
      label: '세부 요구사항',
      align: 'left',
      sortable: true,
      style: 'width:70%',
      type: 'textarea'
    },
    // {
    //   name: 'details',
    //   field: 'details',
    //   label: '상세',
    //   align: 'left',
    //   sortable: true,
    //   type: 'textarea'
    // },
    // {
    //   name: 'relatedLaw',
    //   field: 'relatedLaw',
    //   label: '관계법령',
    //   align: 'left',
    //   sortable: true,
    //   style: 'width:25%',
    //   type: 'textarea'
    // },
    // {
    //   name: 'cycle',
    //   field: 'cycle',
    //   label: '점검주기',
    //   align: 'center',
    //   sortable: true,
    //   style: 'width:50px',
    //   type: 'number'
    // },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      type: 'check',
      sortable: true,
      align: 'center',
      style: 'width:10%',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const saveUrl = ref('')
const selectRow = ref<codeMasterType>({
  code: null,
  codeName: null
})
const mainTable = ref<any>(null)
const checkTable = ref<any>(null)

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
  listUrl.value = selectConfig.sai.sse.mst.esteam.list.url
  saveUrl.value = transactionConfig.sai.sse.mst.esteam.save.url
  // code setting
  // list settin
  getCodes()
}
/******************************
 * TODO (목적): 좌측 시스템요소 조회
 *******************************/
function getCodes() {
  getComboItems('SAI_SAPA_ES_ITEM_CD', undefined, 'Y').then((_result: any) => {
    mainGrid.value.data = _result
    getChecklist(mainGrid.value.data![0])
  })
  // subGrid.value.data = []
  // searchParam.value.level = 1
  // searchParam.value.groupId = null
  // $http({
  //   url: listUrl.value,
  //   method: 'GET',
  //   params: searchParam.value
  // }).then((_result: any) => {
  //   mainGrid.value.data = _result.data
  // })
}
/******************************
 * TODO (목적): 우측 체크리스트 조회
 *******************************/
function getChecklist(row: any) {
  selectRow.value = row
  searchParam.value.level = 2
  searchParam.value.groupId = row.code
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    subGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 우측 목록에 행 추가
 *******************************/
function addCheck() {
  subGrid.value.data?.push({
    saiSapaEsMstId: uid(), // 일련번호
    requirement: '', // 법적 요구사항
    level: 2,
    groupId: selectRow.value.code,
    useFlag: 'Y', // 사용여부
    sortOrder: subGrid.value.data.length + 1, // 순번
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): 우측 목록 저장
 *******************************/
function saveMst() {
  const check = subGrid.value.data?.length
    ? validTable(subGrid.value.columns, subGrid.value.data)
    : true
  if (check) {
    _.forEach(subGrid.value.data, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      confirmCallback: () => {
        $http({
          url: saveUrl.value,
          method: 'PUT',
          data: subGrid.value.data
        }).then(() => {
          message.requestSuccess()
          getChecklist(selectRow.value)
        })
      },
      cancelCallback: () => {}
    })
  }
}
// /******************************
//  * TODO (목적): 우측 체크리스트 삭제
//  *******************************/
// function deleteCheck() {
//   const selectData = checkTable.value.getSelected()
//   if (!selectData || selectData.length === 0) {
//     message.alert({
//       title: '안내',
//       message: '선택된 항목이 없습니다.',
//       type: 'warning' // success / info / warning / error
//     })
//   } else {
//     message.confirm({
//       title: '확인',
//       message: '삭제하시겠습니까?',
//       type: 'warning', // success / info / warning / error
//       confirmCallback: () => {
//         $http({
//           url: saveUrl.value,
//           method: 'DELETE',
//           data: Object.values(selectData)
//         }).then((_result: any) => {
//           message.requestSuccess()
//           _.forEach(selectData, (item) => {
//             subGrid.value.data = _.reject(subGrid.value.data, item)
//           })
//           checkTable.value.compoTable.clearSelection()
//         })
//       },
//       cancelCallback: () => {}
//     })
//   }
// }
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.sapa
  tbody.q-virtual-scroll__content
    tr
      td
        padding: 10px 6px !important
</style>
