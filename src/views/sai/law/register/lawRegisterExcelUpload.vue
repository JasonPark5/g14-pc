<template>
  <div>
    <c-card
      title="법규등록부 업로드 (일괄업로드는 신규로만 저장이 됩니다.)"
      class="cardClassDetailForm"
    >
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="적용" icon="save" @btnClicked="acceptData" />
        </q-btn-group>
      </template>
      <!-- <template v-slot:card-detail>
        <div class="col-3">
          <c-plant :editable="false" type="edit" name="plantCd" v-model:value="data.plantCd" />
        </div>
      </template> -->
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
import { lawRegisterExcelType } from './lawRegister'

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
  data: Array<Array<lawRegisterExcelType>>
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
  rowKeys: ['lawName', 'gubunName', 'itemName'], // 데이터들의 키 속성값
  taskClassCd: 'LAW_REGISTER_UPLOAD', // 엑셀업로드 양식 구분 값
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
  getComboItems('LAW_ID').then((_result) => {
    excelUploadInfo.value.columns.push([
      {
        name: 'lawId',
        field: 'lawId',
        label: '법령명',
        align: 'center',
        style: 'width:120px',
        type: 'select',
        sortable: false,
        comboItems: _result
      },
      {
        required: true,
        name: 'gubunName',
        field: 'gubunName',
        label: '구분',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'sortOrder1',
        field: 'sortOrder1',
        label: '구분순번',
        align: 'center',
        sortable: true,
        style: 'width:60px'
      },
      {
        required: true,
        name: 'itemName',
        field: 'itemName',
        label: '항목',
        align: 'left',
        style: 'width:150px',
        sortable: true
      },
      {
        required: true,
        name: 'relevantClause',
        field: 'relevantClause',
        label: '관련조항',
        type: 'text',
        align: 'center',
        style: 'width:100px',
        sortable: true
      },
      {
        name: 'requirements',
        field: 'requirements',
        label: '요구사항',
        align: 'left',
        sortable: true
      },
      {
        name: 'applyConstruction',
        field: 'applyConstruction',
        label: '적용사항',
        align: 'left',
        style: 'width:140px',
        sortable: true
      },
      {
        name: 'target',
        field: 'target',
        label: '적용대상',
        align: 'center',
        style: 'width:90px',
        sortable: true
      },
      {
        name: 'relatedDocument',
        field: 'relatedDocument',
        label: '관련문서(기록)',
        align: 'left',
        style: 'width:200px',
        sortable: true
      },
      {
        name: 'sortOrder',
        field: 'sortOrder',
        label: '순번',
        align: 'center',
        sortable: true,
        style: 'width:60px'
      }
    ])
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
            '해당 엑셀데이터를 업로드하면, 신규데이터로 저장됩니다. (동일한 법규등록부는 사용안함 처리 후 업로드 하세요.) 그대로 적용하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            emits('closePopup', excelUploadInfo.value.data[0])
          },
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
