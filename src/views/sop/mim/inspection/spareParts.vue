<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd22" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <c-table
      ref="table"
      title="예비품 목록"
      tableId="equipmentInsp"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      selection="multiple"
      rowKey="spareSeq"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn v-if="editable" label="추가" :showLoading="true" icon="add" @btnClicked="add" />
            <c-btn
              v-if="editable && isDelete"
              label="삭제"
              :showLoading="true"
              icon="remove"
              @btnClicked="remove"
            />
            <c-btn
              v-if="editable"
              :url="insertUrl"
              :isSubmit="isSave"
              :param="grid.data"
              mappingType="POST"
              label="저장"
              icon="save"
              @beforeAction="saveSparePart"
              @btnCallback="saveCallback"
            />
            <!-- <c-btn label="검색" icon="search" @btnClicked="getList" /> -->
          </q-btn-group>
        </div>
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
  name: 'spareParts'
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
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Interface_선언
 *******************************/
interface searchParamType {
  // plantCd: stringNull
  spareNm: stringNull
  purpose: stringNull
  manuCompany: stringNull
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
  // plantCd: null,
  spareNm: null,
  purpose: null,
  manuCompany: null
})
const grid = ref<any>({
  columns: [
    {
      required: true,
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      style: 'width:80px',
      type: 'plant',
      sortable: true
    },
    {
      required: true,
      name: 'spareName',
      field: 'spareName',
      label: '예비품명',
      style: 'width:150px',
      align: 'left',
      type: 'text',
      sortable: true
    },
    {
      name: 'sparePurpose',
      field: 'sparePurpose',
      label: '용도',
      style: 'width:150px',
      align: 'left',
      type: 'text',
      sortable: true
    },
    {
      name: 'spareVolume',
      field: 'spareVolume',
      label: '용량',
      style: 'width:150px',
      type: 'text',
      align: 'left',
      sortable: true
    },
    {
      name: 'sparePower',
      field: 'sparePower',
      label: '동력',
      align: 'left',
      style: 'width:100px',
      type: 'text',
      sortable: true
    },
    {
      name: 'registeredQuantity',
      field: 'registeredQuantity',
      label: '등록수량',
      align: 'center',
      type: 'number',
      style: 'width:60px',
      sortable: true
    },
    {
      name: 'vendorCd',
      field: 'vendorCd',
      label: '제조회사',
      align: 'left',
      style: 'width:120px',
      type: 'text',
      sortable: true
    }
  ],
  data: []
})
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const isDelete = ref(false)
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
  listUrl.value = selectConfig.mdm.equipment.spareParts.list.url
  insertUrl.value = transactionConfig.mdm.equipment.spareParts.insert.url
  deleteUrl.value = transactionConfig.mdm.equipment.spareParts.delete.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 예비품 목록
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    if (_result.data.length > 0) isDelete.value = true
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 예비품 추가
 *******************************/
function add() {
  grid.value.data.splice(0, 0, {
    spareSeq: uid(),
    plantCd: null,
    spareNm: '',
    sparePurpose: '',
    spareVolume: '',
    sparePower: '',
    registeredQuantity: '',
    vendorCd: '',
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 예비품 저장
 *******************************/
function saveSparePart() {
  if (validTable(grid.value.columns, grid.value.data)) {
    const saveData = grid.value.data.filter((x: any) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData.length > 0) {
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
 * TODO (목적): 예비품 저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * TODO (목적): 예비품 삭제
 *******************************/
function remove() {
  let selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',

      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        selectData = _.reject(selectData, (item) => {
          return !item.spareSeq
        })
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          saveCallback()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
