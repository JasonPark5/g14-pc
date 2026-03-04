<template>
  <div>
    <c-card title="검진결과 엑셀업로드" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="적용" icon="save" @btnClicked="acceptData" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable"
            :disabled="true"
            label="병원"
            name="hospitalName"
            v-model:value="props.popupParam.hospitalName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable"
            :disabled="true"
            label="요청부서/이름/일자"
            name="request"
            v-model:value="request"
          />
        </div>
      </template>
    </c-card>
    <!-- 검진결과 + 소견 합친것 -->
    <c-check-up-excel-upload
      :heaCheckupPlanId="popupParam.heaCheckupPlanId"
      :editable="editable"
      :hospitalId="popupParam.hospitalId"
      :excelUploadInfo="excelUploadInfo"
      tabHeight="660px"
      gridHeight="630px"
      @noUpload="noUpload"
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
  name: 'checkUpResultExcelUpload'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['noUpload', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    plantCd: stringNull
    hospitalId: stringNull
    hospitalName: stringNull
    heaCheckupPlanId?: stringNull
    checkup?: object
  }
}

/******************************
 * @inject_선언
 *******************************/
// const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      plantCd: '',
      hospitalId: null,
      hospitalName: '',
      heaCheckupPlanId: null
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const excelUploadInfo = ref<any>({
  rowKeys: ['heaCheckupResultId'], // 데이터들의 키 속성값
  taskClassCd: 'HEA_RESULT2', // 엑셀업로드 양식 구분 값 (검진결과 + 소견 합친것)
  sheetNum: 0,
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      deptCd: 'deptCd',
      align: 'center',
      style: 'width:100px',
      type: 'dept',
      isExamine: false,
      fix: true
    },
    {
      name: 'empNo',
      field: 'empNo',
      label: '사번',
      align: 'center',
      style: 'width:100px',
      isExamine: false,
      sortable: false,
      fix: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '성명',
      align: 'center',
      style: 'width:100px',
      isExamine: false,
      sortable: false,
      fix: true
    },
    {
      name: 'jobClassName',
      field: 'jobClassName',
      label: '직종',
      align: 'center',
      style: 'width: 80px',
      isExamine: false,
      sortable: false
    },
    {
      name: 'gender',
      field: 'gender',
      label: '성별',
      align: 'center',
      style: 'width: 50px',
      isExamine: false,
      sortable: false
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      label: '생년월일',
      align: 'center',
      style: 'width:100px',
      isExamine: false,
      sortable: false
    },
    {
      name: 'enterDate',
      field: 'enterDate',
      label: '입사일자',
      align: 'center',
      style: 'width: 100px',
      isExamine: false,
      sortable: false
    },
    {
      name: 'moveDate',
      field: 'moveDate',
      label: '전입일자',
      align: 'center',
      style: 'width: 100px',
      isExamine: false,
      sortable: false
    },
    {
      name: 'checkupDate',
      field: 'checkupDate',
      label: '검진일자',
      align: 'center',
      style: 'width:100px',
      isExamine: false,
      sortable: false
    }
  ],
  data: []
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
}
/******************************
 * TODO (목적): 업로드한 데이터 오류체크후 부모에게 전달
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
      } else emits('closePopup', excelUploadInfo.value.data[0])
    }
  }
}
/******************************
 * TODO (목적): 업로드 여부 전달
 *******************************/
function noUpload(isUpload: boolean) {
  emits('noUpload', isUpload)
}
</script>
