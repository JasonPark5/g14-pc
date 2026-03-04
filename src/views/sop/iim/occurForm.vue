<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="fstTable"
          title="대분류 목록"
          rowKey="iimOccurMasterId"
          :editable="editable"
          :isExcelDown="false"
          :columns="grid1.columns"
          :data="grid1.data"
          gridHeight="860px"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && firstEditable"
                label="추가"
                icon="add"
                :showLoading="false"
                @btnClicked="addrow1"
              />
              <c-btn
                v-if="editable && firstEditable && grid1.data.length > 0"
                :url="saveUrl"
                :isSubmit="isSave1"
                :param="grid1.data"
                mappingType="POST"
                label="저장"
                icon="save"
                @beforeAction="saveClass1"
                @btnCallback="saveCallback1"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'click'">
              <q-chip
                v-if="props.row.editFlag !== 'C'"
                color="grey-8"
                style="font-size: 11px"
                clickable
                outline
                square
                label="보기"
                @click="rowClick(props.row)"
              />
            </template>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="secTable"
          title="중분류 목록"
          :editable="editable"
          rowKey="iimOccurMasterId"
          :isExcelDown="false"
          :columns="grid2.columns"
          :data="grid2.data"
          gridHeight="860px"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-chip>
            <q-btn-group outline>
              <q-chip size="md" outline square color="primary">
                {{ '대분류 : ' + popupData.rowOccurName }}
              </q-chip>
            </q-btn-group>
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && secondEditable"
                label="추가"
                icon="add"
                :showLoading="false"
                @btnClicked="addrow2"
              />
              <c-btn
                v-if="editable && secondEditable && grid2.data.length > 0"
                :url="saveUrl"
                :isSubmit="isSave2"
                :param="grid2.data"
                mappingType="POST"
                label="저장"
                icon="save"
                @beforeAction="saveClass2"
                @btnCallback="saveCallback2"
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

import { occurFormType } from './occurForm'

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
  name: 'occurForm'
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

interface searchParamType {
  useFlag: stringNull
  occurLevel: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<occurFormType>
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<searchParamType>({
  useFlag: null,
  occurLevel: '1'
})
const grid1 = ref<gridType>({
  columns: [
    {
      reqired: true,
      name: 'occurName',
      field: 'occurName',
      label: '대분류명',
      type: 'text',
      align: 'left',
      sortable: true
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
      name: 'click',
      field: 'click',
      label: '중분류',
      align: 'center',
      style: 'width:50px',
      sortable: false,
      type: 'custom'
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'occurName',
      field: 'occurName',
      label: '중분류명',
      type: 'text',
      align: 'left',
      sortable: true
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
    }
  ],
  data: []
})
const popupData = ref<any>({
  first: '',
  rowOccurName: ''
})
// const useFlagItems = ref<codeMasterType>([
//   { code: 'Y', codeName: '사용' },
//   { code: 'N', codeName: '미사용' }
// ])
const listUrl = ref('')
const isSave1 = ref(false)
const isSave2 = ref(false)
const deleteUrl = ref('')
const saveUrl = ref('')
/******************************
 * @Computed_선언
 *******************************/
const firstEditable = computed(() => editable.value)
const secondEditable = computed(() => editable.value && popupData.value.first)

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
  listUrl.value = selectConfig.sop.iim.occurForm.list.url
  saveUrl.value = transactionConfig.sop.iim.occurForm.save.url
  deleteUrl.value = transactionConfig.sop.iim.occurForm.delete.url
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
    grid1.value.data = _result.data
    grid2.value.data = []
    popupData.value.first = null
    popupData.value.second = null
  })
}
function rowClick(row: occurFormType) {
  if (row.editFlag && row.editFlag === 'C') return

  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      iimUpOccurMasterId: row.iimOccurMasterId,
      occurLevel: '2'
    }
  }).then((_result: any) => {
    grid2.value.data = _result.data
    popupData.value.first = row.iimOccurMasterId
    popupData.value.rowOccurName = row.occurName
  })
}
/* eslint-disable no-unused-vars */
function addrow1() {
  grid1.value.data.splice(0, 0, {
    iimOccurMasterId: uid(),
    iimUpOccurMasterId: '',
    occurName: '',
    occurLevel: '1',
    useFlag: 'Y',
    editFlag: 'C'
  })
}
function saveClass1() {
  let flag = true
  _.forEach(grid1.value.data, (item) => {
    if (!item.occurName) {
      message.alert({
        title: '안내',
        message: '대분류명을 입력하세요.',
        type: 'warning' // success / info / warning / error
      })
      flag = false
    }
  })
  if (flag) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave1.value = !isSave1.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function addrow2() {
  grid2.value.data.splice(0, 0, {
    iimOccurMasterId: uid(),
    iimUpOccurMasterId: popupData.value.first,
    occurName: '',
    occurLevel: '2',
    useFlag: 'Y',
    editFlag: 'C'
  })
}
function saveClass2() {
  let flag = true
  _.forEach(grid2.value.data, (item) => {
    if (!item.occurName) {
      message.alert({
        title: '안내',
        message: '중분류명을 입력하세요.',
        type: 'warning' // success / info / warning / error
      })
      flag = false
    }
  })
  if (flag) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave2.value = !isSave2.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveCallback1() {
  message.requestSuccess()
  getList()
}
function saveCallback2() {
  message.requestSuccess()
  rowClick({
    iimOccurMasterId: popupData.value.first,
    occurName: popupData.value.rowOccurName
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
