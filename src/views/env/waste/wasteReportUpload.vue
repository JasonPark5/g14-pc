<template>
  <div>
    <c-card title="엑셀업로드" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="적용" icon="save" @btnClicked="acceptData" />
        </q-btn-group>
      </template>
      <!-- <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            required
            :editable="editable"
            label="사업장"
            name="plantCd"
            v-model:value="popupParam.plantCd"
          />
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
  name: 'wasteReportUpload'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
  merge?: Array<any>
  rowKeys?: Array<string>
  taskClassCd?: string
  sheetNum?: number
  columns: Array<tableColumnType>
  data: Array<any>
  deptCd?: stringNull
  processCd?: stringNull
  workplace?: stringNull
}
// interface propType {
//   popupParam: {
//     plantCd: stringNull
//   }
// }
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
// const props = withDefaults(defineProps<propType>(), {
//   popupParam: () => {
//     return {
//       plantCd: ''
//     }
//   }
// })

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const excelUploadInfo = ref<gridType>({
  rowKeys: ['envWasteAllbaroNo'], // 데이터들의 키 속성값
  taskClassCd: 'WASTE_ALLBARO_UPLOAD', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [
    [
      {
        name: 'envWasteAllbaroNo',
        field: 'envWasteAllbaroNo',
        label: '인계번호',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        required: true,
        name: 'allbaroDt',
        field: 'allbaroDt',
        label: '인계일자',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'endFlag',
        field: 'endFlag',
        label: '확정여부',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        required: true,
        name: 'envWasteName',
        field: 'envWasteName',
        label: '폐기물명',
        align: 'center',
        style: 'width:160px',
        sortable: false
      },
      {
        name: 'envWasteCd',
        field: 'envWasteCd',
        label: '구분',
        align: 'center',
        style: 'width:60px',
        sortable: false
      },
      {
        required: true,
        name: 'wasteVolume',
        field: 'wasteVolume',
        label: '위탁량',
        align: 'center',
        style: 'width:120px',
        type: 'number',
        sortable: false
      },
      {
        required: true,
        name: 'wasteVolumeUnit',
        field: 'wasteVolumeUnit',
        label: '단위',
        align: 'center',
        style: 'width:60px',
        sortable: false
      },
      {
        name: 'wasteVolumeInsu',
        field: 'wasteVolumeInsu',
        label: '처리자인수량',
        align: 'center',
        style: 'width:120px',
        type: 'number',
        sortable: false
      },
      {
        name: 'transportName',
        field: 'transportName',
        label: '운반자명',
        align: 'center',
        style: 'width:150px',
        sortable: false
      },
      {
        required: true,
        name: 'carNo',
        field: 'carNo',
        label: '차량번호',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'processName',
        field: 'processName',
        label: '처리자명',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'processMethodName',
        field: 'processMethodName',
        label: '처리방법',
        align: 'center',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'processLocation',
        field: 'processLocation',
        label: '처리장소',
        align: 'left',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'transferName',
        field: 'transferName',
        label: '인계자명',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'emitterFlag',
        field: 'emitterFlag',
        label: '공동배출자여부',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'inputFlag',
        field: 'inputFlag',
        label: '입력구분',
        align: 'center',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'officeName',
        field: 'officeName',
        label: '관할관청',
        align: 'center',
        style: 'width:180px',
        sortable: false
      },
      {
        name: 'status',
        field: 'status',
        label: '진행상태',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'processResult',
        field: 'processResult',
        label: '처리결과',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'transportIp',
        field: 'transportIp',
        label: '운반IP동일',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'processIp',
        field: 'processIp',
        label: '처리IP동일',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'remark',
        field: 'remark',
        label: '예외사유',
        align: 'center',
        style: 'width:150px',
        sortable: false
      }
    ]
  ],
  data: [],
  deptCd: '',
  processCd: '',
  workplace: ''
})
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
        message.confirm({
          title: '확인',
          message:
            '에러가 있는 데이터가 존재합니다. 에러 있는 데이터를 제외한 나머지 데이터를 적용하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            emits('closePopup', excelUploadInfo.value.data[0])
          },
          cancelCallback: () => {}
        })
      } else {
        emits('closePopup', excelUploadInfo.value.data[0])
      }
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
