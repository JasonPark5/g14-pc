<template>
  <div>
    <c-card title="화학물질 관리대장 엑셀업로드" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="적용" icon="save" @btnClicked="acceptData" />
        </q-btn-group>
      </template>
    </c-card>
    <c-excel-upload :editable="editable" :excelUploadInfo="excelUploadInfo" />
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
  name: 'inoutManagementExcelUpload'
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
const emits = defineEmits(['closePopup'])

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
const excelUploadInfo = ref({
  rowKeys: ['chmInoutManageId'], // 데이터들의 키 속성값
  taskClassCd: 'CHM_INOUT', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [] as Array<Array<any>>,
  data: [] as Array<Array<any>>
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
  // code setting
  getMultiComboItems(['CHM_IN_TYPE_CD', 'CHM_OUT_TYPE_CD']).then((_result: any) => {
    excelUploadInfo.value.columns[0] = [
      {
        required: true,
        name: 'inoutDate',
        label: '입출고일',
        style: 'width:120px',
        align: 'center',
        type: 'date'
      },
      {
        required: true,
        name: 'materialCd',
        label: '화학자재번호',
        style: 'width:120px',
        align: 'center',
        type: 'chemMaterial'
      },
      {
        required: true,
        name: 'facilityCd',
        label: '저장시설관리번호',
        style: 'width:180px',
        align: 'left',
        type: 'facility'
      },
      {
        name: 'carryover',
        label: '이월량',
        align: 'right',
        style: 'width:70px',
        type: 'number'
      },
      {
        name: 'chmInTypeCd',
        label: '입고구분',
        style: 'width:90px',
        type: 'select',
        comboItems: _result['CHM_IN_TYPE_CD']
      },
      {
        name: 'inAmount',
        label: '입고수량',
        align: 'right',
        style: 'width:70px',
        type: 'number'
      },
      {
        name: 'inVendorName',
        label: '입고처코드',
        style: 'width:120px',
        align: 'left',
        type: 'vendor',
        vendorCd: 'inVendorCd'
      },
      {
        name: 'chmOutTypeCd',
        label: '출고구분',
        style: 'width:90px',
        type: 'select',
        comboItems: _result['CHM_OUT_TYPE_CD']
      },
      {
        name: 'outAmount',
        label: '출고수량',
        align: 'right',
        style: 'width:70px',
        type: 'number'
      },
      {
        name: 'outVendorName',
        label: '출고처코드',
        style: 'width:120px',
        align: 'left',
        type: 'vendor',
        vendorCd: 'outVendorCd'
      },
      {
        name: 'inventory',
        label: '재고량',
        align: 'right',
        style: 'width:70px',
        type: 'number'
      },
      {
        name: 'remarks',
        label: '비고',
        align: 'left',
        style: 'width:150px',
        type: 'text'
      }
    ]
  })
  // list setting
}
/******************************
 * TODO (목적): 엑셀 업로드 데이터 적용
 *******************************/
function acceptData() {
  if (excelUploadInfo.value.data) {
    let dataCntCheck = true
    let errorDataCheck = false
    if (!excelUploadInfo.value.data[0] || excelUploadInfo.value.data[0].length === 0) {
      dataCntCheck = false
    }
    if (
      _.findIndex(excelUploadInfo.value.data[0], (item) => {
        return item.error_message
      }) > -1
    ) {
      errorDataCheck = true
    }
    if (!dataCntCheck) {
      message.alert({
        title: '안내',
        message:
          '업로드할 데이터가 없는 Sheet가 있습니다. 데이터 확인 또는 엑셀을 업로드 하였는지 확인바랍니다.',
        type: 'warning' // success / info / warning / error
      })
    } else {
      message.confirm({
        title: '확인',
        message: errorDataCheck
          ? '에러가 있는 데이터가 존재합니다. 에러 있는 데이터를 제외한 나머지 데이터를 적용하시겠습니까?'
          : '적용하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          emits('closePopup', excelUploadInfo.value.data[0])
        },
        cancelCallback: () => {}
      })
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
