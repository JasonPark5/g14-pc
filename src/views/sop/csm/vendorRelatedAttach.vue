<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-table
        ref="vendorTable"
        title="협력업체 첨부파일 목록"
        :columns="grid.columns"
        :data="grid.data"
        gridHeight="790px"
        :filtering="false"
        :isFullScreen="false"
        :columnSetting="false"
        hideBottom
        selection="multiple"
        rowKey="mdmVendorAttachId"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              label="추가"
              v-if="editable && parentVendorCd"
              icon="add"
              @btnClicked="addAttach"
            />
            <c-btn
              label="삭제"
              v-if="editable && parentVendorCd && grid.data.length > 0"
              icon="remove"
              @btnClicked="deleteAttach"
            />
            <c-btn
              v-if="editable && parentVendorCd"
              :isSubmit="isSaveAttach"
              :url="saveAttachUrl"
              :param="grid.data"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveAttach"
              @btnCallback="saveAttachCallback"
            />
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
  name: 'vendorRelatedAttach'
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
const emits = defineEmits(['searchDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  parentVendorCd?: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  parentVendorCd: ''
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
  columns: [],
  data: []
})
const listAttachUrl = ref('')
const deleteAttachUrl = ref('')
const saveAttachUrl = ref('')
const isSaveAttach = ref(false)
const vendorTable = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.parentVendorCd,
  () => {
    if (props.parentVendorCd) {
      getList({ vendorCd: props.parentVendorCd })
    } else {
      grid.value.data = []
    }
  }
)
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
  listAttachUrl.value = selectConfig.mdm.cim.vendor.attach.list.url
  saveAttachUrl.value = transactionConfig.mdm.cim.vendor.attach.save.url
  deleteAttachUrl.value = transactionConfig.mdm.cim.vendor.attach.delete.url
  // code setting
  getComboItems('VENDOR_ATTACH_TYPE_CD').then((_result) => {
    grid.value.columns = [
      // {
      //   name: 'vendorCd',
      //   field: 'vendorCd',
      //   label: '업체',
      //   align: 'center',
      //   style: 'width:120px',
      //   sortable: false,
      //   required: true,
      //   type: 'vendor',
      // },
      {
        name: 'vendorAttachTypeCd',
        field: 'vendorAttachTypeCd',
        label: '첨부분류',
        align: 'center',
        style: 'width:20%',
        sortable: false,
        required: true,
        type: 'select',
        comboItems: _result
      },
      {
        name: 'title',
        field: 'title',
        label: '제목',
        align: 'left',
        style: 'width:20%',
        sortable: false,
        required: true,
        type: 'text'
      },
      {
        name: 'remark',
        field: 'remark',
        label: '비고',
        align: 'left',
        style: 'width:20%',
        sortable: false,
        type: 'textarea'
      },
      {
        name: 'regDtStr',
        field: 'regDtStr',
        label: '등록일',
        align: 'center',
        style: 'width:90px',
        sortable: false
      },
      {
        name: 'attach',
        field: 'attach',
        label: '첨부파일',
        align: 'center',
        // style: 'width:40%',
        type: 'attach',
        taskClassCd: 'VENDOR_ATTACH',
        keyText: 'mdmVendorAttachId',
        sortable: false
      }
    ]
  })
  if (props.parentVendorCd) {
    getList({ vendorCd: props.parentVendorCd })
  }
  // list setting
}

/******************************
 * TODO (목적): 도급업체 첨부파일 조회
 *******************************/
function getList(row: any) {
  $http({
    url: listAttachUrl.value,
    method: 'GET',
    params: { vendorCd: row.vendorCd }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 도급업체 첨부파일 조회
 *******************************/
function addAttach() {
  grid.value.data.splice(0, 0, {
    mdmVendorAttachId: uid(), // 협력업체 첨부파일 일련번호
    vendorCd: props.parentVendorCd, // 업체코드
    vendorAttachTypeCd: null, // 업체별 첨부파일 구분 코드
    title: '', // 업체 첨부파일 제목
    remark: '', // 업체 첨부파일 비고
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 도급업체 첨부파일 저장
 *******************************/
function saveAttach() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSaveAttach.value = !isSaveAttach.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 도급업체 첨부파일 삭제
 *******************************/
function deleteAttach() {
  const selectData = vendorTable.value.getSelected()
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
        $http({
          url: deleteAttachUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          message.requestSuccess()
          vendorTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 도급업체 첨부파일 저장 후 콜백
 *******************************/
function saveAttachCallback() {
  message.requestSuccess()
  emits('searchDetail')
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
