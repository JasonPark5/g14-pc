<template>
  <div>
    <c-card title="엑셀업로드" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="적용" icon="save" @btnClicked="acceptData" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            required
            :editable="editable"
            label="사업장"
            name="plantCd"
            v-model:value="excelUploadInfo.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
          <c-text
            :editable="editable"
            :disabled="true"
            label="담당부서/이름/일자"
            name="request"
            v-model:value="request"
          />
        </div>
      </template>
    </c-card>
    <c-excel-upload
      :editable="editable"
      :excelUploadInfo="excelUploadInfo"
      tabHeight="660px"
      gridHeight="630px"
    />
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
  name: 'hazardResultExcelUpload'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface gridType {
  columns: tableColumnType
  data: Array<Array<any>>
  rowKeys: Array<string>
  taskClassCd: string
  sheetNum: number
  plantCd: stringNull
  deptCd: stringNull
  processCd: stringNull
  workplace: stringNull
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
  rowKeys: ['inspectionNo'], // 데이터들의 키 속성값
  taskClassCd: 'HAZARD_RESULT', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [],
  data: [],
  deptCd: '',
  plantCd: '',
  processCd: '',
  workplace: ''
})

/******************************
 * @Computed_선언
 *******************************/
const request = computed(
  () => user.value.deptName + ' / ' + user.value.userName + ' / ' + getToday()
)

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
  setHeader()
}
function setHeader() {
  excelUploadInfo.value.columns = [
    [
      {
        required: true,
        name: 'itemNo',
        field: 'itemNo',
        label: 'item No',
        style: 'width:180px',
        align: 'center',
        type: 'readonly',
        sortable: false
      },
      {
        required: true,
        name: 'inspectionDate',
        field: 'inspectionDate',
        label: '검사일자',
        style: 'width:120px',
        align: 'center',
        type: 'date',
        sortable: false
      },
      {
        name: 'departmentDeptName',
        field: 'departmentDeptName',
        deptCd: 'departmentDeptCd',
        label: '주관부서',
        style: 'width:250px',
        type: 'dept',
        align: 'left',
        sortable: false
      },
      {
        name: 'inspectionAgency',
        field: 'inspectionAgency',
        label: '기관',
        style: 'width:250px',
        align: 'left',
        sortable: false
      },
      {
        name: 'setInspectionResultDetail',
        field: 'setInspectionResultDetail',
        label: '검사결과내역',
        style: 'width:500px',
        align: 'left',
        sortable: false
      }
    ]
  ]
}
/******************************
 * TODO (목적): 적용 버튼 클릭시 alert를 통한 데이터 검증
 *******************************/
const acceptData = () => {
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
          '업로드할 데이터가 없는 Sheet가 있습니다. 데이터 확인 또는 엑셀을 업로드 하였는지 확인바랍니다.', // 업로드할 데이터가 없는 Sheet가 있습니다. 데이터 확인 또는 엑셀을 업로드 하였는지 확인바랍니다.
        type: 'warning' // success / info / warning / error
      })
    } else {
      if (errorDataCheck) {
        message.confirm({
          title: '확인',
          message:
            '에러가 있는 데이터가 존재합니다.\n\r에러 있는 데이터를 제외한 나머지 데이터를 적용하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            emits('closePopup', excelUploadInfo.value.data[0])
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else {
        emits('closePopup', excelUploadInfo.value.data[0], excelUploadInfo.value.plantCd)
      }
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
