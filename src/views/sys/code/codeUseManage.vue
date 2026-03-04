<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="grpTable"
          title="코드 그룹"
          tableId="grpTable"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :columns="grpGrid.columns"
          :isExcelDown="false"
          :data="grpGrid.data"
          @rowClick="getCodeMst"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <c-btn label="검색" icon="search" @btnClicked="getCodeGroup" />
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="mstTable"
          title="코드 마스터"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :columns="mstGrid.columns"
          :isExcelDown="false"
          :data="mstGrid.data"
          selection="multiple"
          rowKey="code"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="추가" icon="add" @btnClicked="addrow" v-if="editable && isSelectGrp" />
              <!-- <c-btn
                label="삭제"
                icon="remove"
                @btnClicked="removeRow"
                v-if="editable && isSelectGrp"
              /> -->
              <c-btn
                label="저장"
                icon="save"
                @btnClicked="saveMst"
                v-if="editable && isSelectGrp"
              />
            </q-btn-group>
          </template>
          <template v-slot:table-header-append>
            <c-select
              :comboItems="useFlagItems"
              type="search"
              class="no-label-control"
              :dense="true"
              itemText="codeName"
              itemValue="code"
              name="srchUseFlag"
              label=""
              v-model:value="searchParam.srchUseFlag"
              @update:value="getCodeMst({ codeGrpCd: selectedGroupCd })"
            />
          </template>
        </c-table>
      </div>
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $language('코드') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model:model-value="hiddenMstCd" autofocus @keyup.enter="setMst" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$language('취소')" @click="cancelMst" />
          <q-btn flat :label="$language('추가')" @click="setMst" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  name: 'codeUseManage'
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
interface gridType {
  columns: tableColumnType
  data: any
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
const searchParam = ref({
  srchUseFlag: 'Y'
})
const prompt = ref(false)
const hiddenMstCd = ref('')
const selectedGroupCd = ref('')
const grouplistUrl = ref('')
const mstSaveUrl = ref('')
const mstDeleteUrl = ref('')
const mstlistUrl = ref('')
const isSelectGrp = ref(false)
const mstTable = ref<any>(null)
const useFlagItems = ref<Array<codeMasterType>>([])

const grpGrid = ref<gridType>({
  columns: [
    {
      name: 'codeGrpCd',
      field: 'codeGrpCd',
      label: '코드 그룹',
      align: 'center',
      style: 'width:50%',
      sortable: true
    },
    {
      name: 'codeGrpNm',
      field: 'codeGrpNm',
      label: '그룹명',
      style: 'width:50%',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
const mstGrid = ref<gridType>({
  columns: [
    {
      name: 'code',
      field: 'code',
      label: '코드',
      align: 'center',
      style: 'width:150px',
      required: true,
      sortable: false
    },
    {
      name: 'codeName',
      field: 'codeName',
      label: '코드명',
      align: 'left',
      style: 'width:300px',
      type: 'text',
      required: true,
      sortable: false
    },
    {
      name: 'attrVal1',
      field: 'attrVal1',
      label: '추가속성1',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'attrVal2',
      field: 'attrVal2',
      label: '추가속성2',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:70px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      style: 'width:60px',
      align: 'center',
      type: 'number',
      required: true,
      sortable: false
    }
  ],
  data: []
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
  grouplistUrl.value = selectConfig.sys.code.usegroup.list.url
  mstlistUrl.value = selectConfig.sys.code.mst.list.url
  mstSaveUrl.value = transactionConfig.sys.code.mst.save.url
  mstDeleteUrl.value = transactionConfig.sys.code.mst.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getCodeGroup()
}
/******************************
 * TODO (목적): 코드 그룹 목록 조회
 *******************************/
function getCodeGroup() {
  rowRemoveSelect()
  isSelectGrp.value = true
  mstGrid.value.data = []
  $http({
    url: grouplistUrl.value,
    method: 'GET',
    params: {
      srchSystemYn: 'N'
    }
  }).then((_result: any) => {
    grpGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 선택한 항목 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getCodeMst(row: any) {
  // 상세조회
  isSelectGrp.value = true
  selectedGroupCd.value = row.codeGrpCd
  $http({
    url: $format(mstlistUrl.value, selectedGroupCd.value),
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    mstGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 코드 저장
 *******************************/
function saveMst() {
  if (validTable(mstGrid.value.columns, mstGrid.value.data)) {
    const saveData: any = mstGrid.value.data.filter((x: any) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          $http({
            url: mstSaveUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            message.requestSuccess()
            getCodeMst({ codeGrpCd: saveData[0].codeGrpCd })
          })
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.', // 변경된 데이터가 없습니다.
        type: 'info' // success / info / warning / error
      })
    }
  }
}

/******************************
 * TODO (목적): 코드 추가
 *******************************/
function addrow() {
  const cnt: any = mstGrid.value.data.length
  prompt.value = true
  if (cnt > 0) {
    const _code = mstGrid.value.data[cnt - 1].code
    if (_code.length == 10) {
      const _num = _code.replace(/[a-zA-Z]/g, '')
      const _eng = _code.replace(_num, '')
      hiddenMstCd.value = _eng + String(parseInt(_num) + 1).padStart(_num.length, '0')
    }
  }
}
/******************************
 * TODO (목적): 코드 취소
 *******************************/
function cancelMst() {
  hiddenMstCd.value = ''
  prompt.value = false
}
function setMst() {
  prompt.value = false
  let _order = 0
  const cnt = mstGrid.value.data.length
  if (cnt == 0) {
    _order = 1
  } else if (cnt == 1) {
    _order = 10
  } else {
    _order = mstGrid.value.data[cnt - 1].sortOrder + 10
  }
  mstGrid.value.data.push({
    editFlag: 'C',
    codeGrpCd: selectedGroupCd.value,
    code: hiddenMstCd.value,
    codeName: '',
    attrVal1: '',
    attrVal2: '',
    attrVal3: '',
    attrVal4: '',
    useFlag: 'Y',
    sortOrder: _order
  })
  hiddenMstCd.value = ''
}
/******************************
 * TODO (목적): 코드 삭제
 *******************************/
// function removeRow() {
//   const selectData = mstTable.value.getSelected()
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
//       // 확인 callback 함수
//       confirmCallback: () => {
//         $http({
//           url: mstDeleteUrl.value,
//           method: 'DELETE',
//           data: Object.values(selectData)
//         }).then(() => {
//           message.requestSuccess()

//           _.forEach(selectData, (item) => {
//             mstGrid.value.data = _.reject(mstGrid.value.data, item)
//           })
//           mstTable.value.compoTable.clearSelection()
//         })
//       },
//       // 취소 callback 함수
//       cancelCallback: () => {}
//     })
//   }
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
