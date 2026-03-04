<template>
  <div>
    <c-card title="작업환경측정결과 엑셀업로드" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="적용" icon="save" @btnClicked="acceptData" />
        </q-btn-group>
      </template>
      <!-- <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="관련공정"
            name="processCd"
            :customPopupParam="{ targetKey: 'process' }"
            v-model:value="excelUploadInfo.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            :editable="editable"
            label="부서"
            name="deptCd"
            v-model:value="excelUploadInfo.deptCd">
          </c-dept>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            required
            :editable="editable"
            label="단위작업장소"
            name="workPlace"
            v-model:value="excelUploadInfo.workPlace">
          </c-text>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <c-text
            :editable="editable"
            :disabled="true"
            label="요청부서/이름/일자"
            name="request"
            v-model:value="request"
          />
        </div>
      </template> -->
    </c-card>
    <c-excel-upload
      :editable="editable"
      :excelUploadInfo="excelUploadInfo"
      tabHeight="560px"
      gridHeight="520px"
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
  name: 'workMeasureResultExcelUpload'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const userStroe = useUserStore()
// const { user } = storeToRefs(userStroe)
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
  data: Array<Array<any>>
  deptCd?: stringNull
  processCd?: stringNull
  workplace?: stringNull
}
/******************************
 * @inject_선언
 *******************************/
// const $language = inject('$language') as GetTranLanguageFunction

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
  rowKeys: ['workMeasurementResultId'], // 데이터들의 키 속성값
  taskClassCd: 'WMR_RESULT', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [],
  data: [],
  deptCd: '',
  processCd: '',
  workplace: ''
})
const editable = ref(true)

/******************************
 * @Computed_선언
 *******************************/
// const request = computed(
//   () => user.value.deptName + ' / ' + user.value.userName + ' / ' + getToday()
// )

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
  excelUploadInfo.value.columns = [
    [
      {
        required: true,
        name: 'processCd',
        field: 'processCd',
        label: '단위사업체명',
        align: 'center',
        style: 'width:100px'
      },
      {
        required: true,
        name: 'deptName',
        field: 'deptName',
        label: '부서 또는 공정명',
        align: 'center',
        style: 'width:120px'
      },
      {
        required: true,
        name: 'workPlace',
        field: 'workPlace',
        label: '단위 작업 장소',
        align: 'left',
        style: 'width:200px'
      },
      {
        required: true,
        name: 'typeName',
        field: 'typeName',
        label: '구분',
        align: 'center',
        style: 'width:100px'
      },
      {
        required: true,
        name: 'hazardCd',
        field: 'hazardCd',
        label: '유해인자명',
        align: 'center',
        style: 'width:160px'
      },
      {
        name: 'workContents',
        field: 'workContents',
        label: '작업내용',
        style: 'width:240px',
        align: 'left'
      },
      {
        name: 'workCount',
        field: 'workCount',
        label: '근로자수',
        align: 'center',
        style: 'width:60px'
      },
      {
        name: 'shiftType',
        field: 'shiftType',
        label: '근로형태 및 실제 근로시간',
        align: 'left',
        style: 'width:150px'
      },
      {
        name: 'occurTime',
        field: 'occurTime',
        label: '발생시간',
        align: 'center',
        style: 'width:100px'
      },
      {
        name: 'measPositionName',
        field: 'measPositionName',
        label: '측정위치(근로자명)',
        align: 'left',
        style: 'width:120px'
      },
      {
        name: 'measStartTime',
        field: 'measStartTime',
        label: '측정시간',
        align: 'left',
        style: 'width:120px'
      },
      {
        name: 'measCount',
        field: 'measCount',
        label: '측정횟수',
        align: 'center',
        style: 'width:60px'
      },
      {
        required: true,
        name: 'measValue',
        field: 'measValue',
        label: '측정치',
        align: 'center',
        style: 'width:80px'
      },
      {
        name: 'twaPrev',
        field: 'twaPrev',
        label: '전회치',
        align: 'center',
        style: 'width:80px'
      },
      {
        name: 'twaCurr',
        field: 'twaCurr',
        label: '금회치',
        align: 'center',
        style: 'width:80px'
      },
      {
        name: 'exposureStandard',
        field: 'exposureStandard',
        label: '노출기준',
        align: 'center',
        style: 'width:80px'
      },
      {
        name: 'exposureFlag',
        field: 'exposureFlag',
        label: '측정농도 평가결과',
        align: 'center',
        style: 'width:60px'
      },
      {
        name: 'measMethod',
        field: 'measMethod',
        label: '측정방법',
        style: 'width:100px',
        align: 'left'
      },
      {
        name: 'measAnalysis',
        field: 'measAnalysis',
        label: '분석방법',
        align: 'left',
        style: 'width:120px'
      },
      {
        name: 'remark',
        field: 'remark',
        label: '비고',
        align: 'left',
        style: 'width:100px'
      }
    ]
  ]
  // list setting
}

/******************************
 * TODO (목적): 업로드한 데이터를 부모에게 전달
 *******************************/
function acceptData() {
  if (excelUploadInfo.value.data && excelUploadInfo.value.data[0]) {
    let dataCntCheck = true
    let errorDataCheck = false
    if (!excelUploadInfo.value.data[0] || excelUploadInfo.value.data[0].length === 0)
      dataCntCheck = false
    if (_.findIndex(excelUploadInfo.value.data[0], (item) => item.error_message) > -1)
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
          // 확인 callback 함수
          confirmCallback: () => {
            emits('closePopup', excelUploadInfo.value.data[0])
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else emits('closePopup', excelUploadInfo.value.data[0])
    }
  }
}
</script>
