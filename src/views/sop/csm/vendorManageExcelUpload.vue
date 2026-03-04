<template>
  <div>
    <c-card title="업체마스터 일괄업로드" class="cardClassDetailForm">
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
  name: 'lawRegisterExcelUpload'
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
interface gridType {
  rowKeys: Array<string>
  taskClassCd: string
  sheetNum: number
  columns: tableColumnType
  data: Array<Array<vendorType>>
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
const excelUploadInfo = ref<gridType>({
  rowKeys: ['vendorCd'], // 데이터들의 키 속성값
  taskClassCd: 'VENDOR_UPLOAD', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [],
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
  // code setting
  getComboItems('VENDOR_CLASS_CD').then((_result) => {
    getComboItems('VENDOR_TYPE_CD').then((_result2) => {
      excelUploadInfo.value.columns = [
        [
          // {
          //   name: 'vendorCd',
          //   label: '업체코드',
          //   align: 'center',
          //   sortable: false,
          //   style: 'width:130px',
          //   required: true
          // },
          {
            name: 'vendorName',
            label: '업체명',
            align: 'left',
            sortable: false,
            style: 'width:130px',
            required: true
          },
          {
            name: 'vendorClassCd',
            label: '업체분류',
            align: 'center',
            style: 'width:90px',
            sortable: false,
            required: true,
            type: 'select',
            comboItems: _result
          },
          {
            name: 'vendorTypeCd',
            label: '업체유형',
            align: 'center',
            style: 'width:90px',
            sortable: false,
            required: true,
            type: 'select',
            comboItems: _result2
          },
          {
            name: 'bizNo',
            label: '사업자번호',
            align: 'center',
            sortable: false,
            style: 'width:130px'
          },
          {
            name: 'representName',
            label: '대표자명',
            align: 'center',
            sortable: false,
            style: 'width:130px'
          },
          {
            name: 'phoneNo',
            label: '대표전화번호',
            align: 'center',
            sortable: false,
            style: 'width:130px'
          },
          {
            name: 'email',
            label: '대표이메일',
            align: 'center',
            sortable: false,
            style: 'width:130px'
          },
          {
            name: 'chargeName',
            label: '담당자명',
            align: 'center',
            sortable: false,
            style: 'width:130px'
          },
          {
            name: 'address',
            label: '본사주소',
            align: 'center',
            sortable: false,
            style: 'width:300px'
          }
          // {
          //   name: 'plantCds',
          //   label: '관련사업장',
          //   align: 'left',
          //   style: 'width:150px',
          //   type: 'plant',
          //   sortable: false,
          //   required: true
          // }
        ]
      ]
    })
  })
  // list setting
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function acceptData() {
  if (excelUploadInfo.value.data) {
    let dataCntCheck = true
    let errorDataCheck = false
    if (!excelUploadInfo.value.data[0] || excelUploadInfo.value.data[0].length === 0) {
      dataCntCheck = false
    }
    if (
      _.findIndex(excelUploadInfo.value.data[0], (item: any) => {
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
      if (errorDataCheck) {
        message.alert({
          title: '안내',
          message: '에러가 있는 데이터가 존재합니다. 데이터 확인 후 적용하시길 바랍니다.',
          type: 'warning' // success / info / warning / error
        })
      } else {
        message.confirm({
          title: '확인',
          message:
            '해당 엑셀데이터를 업로드하면, 신규데이터로 저장됩니다. (동일한 업체는 사용안함 처리 후 업로드 하세요.) 그대로 적용하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            emits('closePopup', excelUploadInfo.value.data[0])
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
