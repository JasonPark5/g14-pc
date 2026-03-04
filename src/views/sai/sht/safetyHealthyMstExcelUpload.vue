<template>
  <div>
    <c-card
      title="안전보건목표 기준정보 업로드 (일괄업로드는 신규로만 저장이 됩니다.)"
      class="cardClassDetailForm"
    >
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="적용" icon="save" @btnClicked="acceptData" />
        </q-btn-group>
      </template>
      <!-- <template v-slot:card-detail>
        <div class="col-3">
          <c-plant :editable="false" type="edit" name="plantCd" v-model:value="edata.plantCd" />
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
import { safetyHealthyMstExcelType } from './safetyHealthyMst'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyHealthyMstExcelUpload'
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
  data: Array<Array<safetyHealthyMstExcelType>>
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
// const edata = ref({
//   plantCd: null // 사업장코드
// })
const excelUploadInfo = ref<gridType>({
  rowKeys: ['targetName', 'detailName'], // 데이터들의 키 속성값
  taskClassCd: 'SAFETY_HEALTHY_MST_UPLOAD', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [
    [
      {
        name: 'plantCd',
        label: '사업장',
        align: 'center',
        style: 'width:110px',
        type: 'plant',
        sortable: false
      },
      {
        required: true,
        name: 'targetName',
        label: '안전보건목표',
        align: 'left',
        style: 'width:290px',
        sortable: false,
        type: 'custom'
      },
      {
        required: true,
        name: 'detailName',
        label: '세부추진사항',
        align: 'left',
        sortable: false,
        type: 'text'
      },
      {
        name: 'deptName',
        label: '해당부서',
        align: 'center',
        style: 'width:200px',
        sortable: false,
        type: 'dept',
        deptCd: 'deptCd',
        isFirstValue: false
      },
      {
        name: 'kpi',
        label: 'KPI성과지표',
        align: 'left',
        style: 'width:200px',
        type: 'text',
        sortable: false
      },
      {
        name: 'sortOrder',
        label: '순번',
        align: 'center',
        sortable: false,
        style: 'width:80px',
        type: 'number'
      }
    ]
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
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 엑셀 데이터 적용
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
            '해당 엑셀데이터를 업로드하면, 신규데이터로 저장됩니다. (동일한 안전보건 목표는 사용안함 처리 후 업로드 하세요.) 그대로 적용하시겠습니까?',
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
