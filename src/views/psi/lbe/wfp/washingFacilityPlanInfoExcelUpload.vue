<template>
  <div>
    <c-card
      title="세척세안시설 목록 업로드 (동일한 관리번호는 자료가 수정됩니다.)"
      class="cardClassDetailForm"
    >
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="적용" icon="save" @btnClicked="acceptData" />
        </q-btn-group>
      </template>
      <!-- <template v-slot:card-detail>
        <div class="col-3">
          <c-plant :editable="false" type="edit" name="plantCd" v-model:value="plantCd" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'washingFacilityPlanInfoExcelUpload'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const userStore = useUserStore()
// const { user } = storeToRefs(userStore)
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
  rowKeys?: Array<string>
  taskClassCd?: string
  sheetNum?: number
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
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
const excelUploadInfo = ref<gridType>({
  rowKeys: ['managerNo'], // 데이터들의 키 속성값
  taskClassCd: 'PSI_WASHING_FACILITY_UPLOAD', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [
    [
      {
        name: 'plantCd',
        label: '사업장',
        align: 'center',
        style: 'width:100px',
        type: 'plant',
        sortable: false
      },
      {
        name: 'deptName',
        label: '관리부서명',
        deptCd: 'deptCd',
        align: 'center',
        style: 'width:120px',
        type: 'dept',
        sortable: false
      },
      {
        name: 'managerNo',
        field: 'managerNo',
        label: '관리번호',
        style: 'width:120px',
        type: 'link',
        align: 'center',
        sortable: false
      },
      {
        name: 'areaName',
        field: 'areaName',
        label: '지역(공정)',
        align: 'center',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'location',
        field: 'location',
        label: '설치장소',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'warmMethod',
        field: 'warmMethod',
        label: '보온방법',
        style: 'width:100px',
        align: 'center',
        sortable: false
      },
      {
        name: 'checkCycle',
        field: 'checkCycle',
        label: '점검주기',
        style: 'width:100px',
        align: 'center',
        sortable: false
      },
      {
        name: 'remark',
        field: 'remark',
        label: '비고',
        align: 'left',
        style: 'width:120px',
        sortable: false
      }
    ]
  ],
  data: []
})
// const plantCd = ref(user.value.plantCd)
const editable = ref(true)

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
 * TODO (목적): 업로드한 데이터를 부모에게 전달
 *******************************/
function acceptData() {
  if (excelUploadInfo.value.data) {
    let dataCntCheck = true
    let errorDataCheck = false
    if (!excelUploadInfo.value.data[0] || excelUploadInfo.value.data[0].length === 0)
      dataCntCheck = false
    if (_.findIndex(excelUploadInfo.value.data[0], (item: any) => item.error_message) > -1)
      errorDataCheck = true
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
          title: '확인',
          message: '에러가 있는 데이터가 존재합니다. 데이터 확인 후 적용하시길 바랍니다.',
          type: 'warning' // success / info / warning / error
        })
      } else {
        message.confirm({
          title: '확인',
          message:
            '해당 엑셀데이터를 업로드하면, 동일한 세척세안시설의 정보가 수정됩니다. 그대로 적용하시겠습니까?',
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
