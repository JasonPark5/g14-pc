<template>
  <div>
    <c-card
      title="장치 및 설비 목록 업로드 (일괄업로드는 신규로만 저장이 됩니다.)"
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
  name: 'deviceEquipmentExcelUpload'
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
  rowKeys: ['equipmentNo', 'devicePartName'], // 데이터들의 키 속성값
  taskClassCd: 'PSI_DEVICE_EQUIPMENT_UPLOAD', // 엑셀업로드 양식 구분 값
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
        style: 'width:100px',
        type: 'dept',
        sortable: false
      },
      {
        name: 'equipmentNo',
        label: '장치번호',
        align: 'center',
        style: 'width:120px',
        sortable: false,
        fix: true
      },
      {
        name: 'deviceName',
        label: '장치명',
        align: 'left',
        style: 'width:200px',
        sortable: false,
        fix: true
      },
      {
        name: 'devicePartName',
        label: '장치구분',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        name: 'inMaterials',
        label: '내용물',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'volume',
        label: '용량',
        align: 'center',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'pressOperation',
        label: '운전압력(MPa)',
        align: 'center',
        style: 'width:60px',
        sortable: false
      },
      {
        name: 'pressDesign',
        label: '설계압력(MPa)',
        align: 'center',
        style: 'width:60px',
        sortable: false
      },
      {
        name: 'tempOperation',
        label: '운전온도(℃)',
        align: 'center',
        style: 'width:60px',
        sortable: false
      },
      {
        name: 'tempDesign',
        label: '설계온도(℃)',
        align: 'center',
        style: 'width:60px',
        sortable: false
      },
      {
        name: 'materialMain',
        label: '사용재질-본체',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'materialSubPart',
        label: '사용재질-부속품',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'materialGasket',
        label: '사용재질-개스킷',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'weldingEfficiency',
        label: '용접효율',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        name: 'calculateThick',
        label: '계산두께(mm)',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        name: 'corrosionAllowance',
        label: '부식여유(mm)',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        name: 'useThick',
        label: '사용두께(mm)',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        name: 'afterHeatTreatYn',
        label: '후열처리여부',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        name: 'nondestructPercent',
        label: '비파괴검사율(%)',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        name: 'applicableLaws',
        label: '적용법령',
        align: 'center',
        style: 'width:200px',
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
            '해당 엑셀데이터를 업로드하면, 신규데이터로 저장됩니다. (동일한 장치는 삭제 후 업로드 하세요.) 그대로 적용하시겠습니까?',
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
