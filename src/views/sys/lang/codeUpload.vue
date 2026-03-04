<template>
  <c-card title="다국어 데이터(공통코드용) 일괄업로드" class="cardClassDetailForm">
    <template v-slot:card-button>
      <q-btn-group outline>
        <c-btn
          v-if="editable"
          label="다국어 데이터(공통코드용) 양식 다운로드"
          icon="download"
          @btnClicked="downLoadTemplate"
        />
        <c-btn v-if="editable" label="일괄저장" icon="save" @btnClicked="excelUpload" />
      </q-btn-group>
    </template>
    <template v-slot:card-detail>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-excel-upload
          :editable="editable"
          :excelUploadInfo="excelUploadInfo"
          :isTemplateDown="false"
        />
      </div>
    </template>
  </c-card>
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
  name: 'codeUpload'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface langUploadType {
  codeGrpCd?: stringNull
  codeGrpNm: stringNull
  code: stringNull
  codeNameKr: stringNull
  codeNameEn: stringNull
  codeNameJa: stringNull
  codeNameZhCn: stringNull
  codeNameZhTw?: stringNull
  error_message?: stringNull // 구분
  useFlag?: stringNull // 사용여부
  regUserId?: stringNull
  chgUserId?: stringNull
  editFlag?: stringNull
}
interface gridType {
  rowKeys: Array<string>
  taskClassCd: string
  sheetNum: number
  columns: tableColumnType
  data: Array<Array<langUploadType>>
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
const languageUrl = ref('')
const uploadUrl = ref('')
const excelUploadInfo = ref<gridType>({
  rowKeys: ['code'], // 데이터들의 키 속성값
  taskClassCd: 'COMMCD_FULL_UPLOAD', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [
    [
      {
        name: 'codeGrpCd',
        field: 'codeGrpCd',
        label: '그룹코드',
        align: 'center',
        type: 'readonly',
        sortable: false
      },
      {
        name: 'codeGrpNm',
        field: 'codeGrpNm',
        label: '그룹코드명',
        align: 'center',
        type: 'readonly',
        sortable: false
      },
      {
        name: 'code',
        field: 'code',
        label: '코드',
        align: 'center',
        type: 'readonly',
        sortable: false
      },
      {
        name: 'codeNameKr',
        field: 'codeNameKr',
        label: '코드명국문',
        align: 'left',
        type: 'text',
        sortable: false
      },
      {
        name: 'codeNameEn',
        field: 'codeNameEn',
        label: '코드명영문',
        align: 'left',
        type: 'text',
        sortable: false
      },
      {
        name: 'codeNameJa',
        field: 'codeNameJa',
        label: '코드명일문',
        align: 'left',
        type: 'text',
        sortable: false
      },
      {
        name: 'codeNameZhCn',
        field: 'codeNameZhCn',
        label: '코드명중국어간체',
        align: 'left',
        type: 'text',
        sortable: false
      },
      {
        name: 'codeNameZhTw',
        field: 'codeNameZhTw',
        label: '코드명중국어번체',
        align: 'left',
        type: 'text',
        sortable: false
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
  languageUrl.value = selectConfig.sys.language.commcd.url
  uploadUrl.value = transactionConfig.sys.language.commcd.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 템플릿 다운로드
 *******************************/
function downLoadTemplate() {
  $http({
    url: languageUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, '다국어_공통코드업로드양식.xlsx')
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = '다국어_공통코드업로드양식.xlsx'
      link.click()
    }
  })
}

/******************************
 * TODO (목적): 일괄업로드
 *******************************/
function excelUpload() {
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
        message.confirm({
          title: '확인',
          message:
            '에러가 있는 데이터가 존재합니다.\n\r에러 있는 데이터를 제외한 나머지 데이터를 적용하시겠습니까?',
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            const _result = excelUploadInfo.value.data[0]
            if (_result && _result.length > 0) {
              const s_data = _.filter(_result, (item) => {
                return !item.error_message
              })
              _.forEach(s_data, (item) => {
                item.regUserId = user.value.userId // 등록자 ID
                item.chgUserId = user.value.userId // 수정자 ID
                item.editFlag = 'U'
              })
              $http({
                url: uploadUrl.value,
                method: 'POST',
                data: s_data
              }).then((_result: any) => {
                message.requestSuccess()
              })
            }
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else {
        message.confirm({
          title: '확인',
          message: '데이터를 적용하시겠습니까?',
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            const _result = excelUploadInfo.value.data[0]
            if (_result && _result.length > 0) {
              const s_data = _.filter(_result, (item) => {
                return !item.error_message
              })
              _.forEach(s_data, (item) => {
                item.regUserId = user.value.userId // 등록자 ID
                item.chgUserId = user.value.userId // 수정자 ID
                item.editFlag = 'U'
              })
              $http({
                url: uploadUrl.value,
                method: 'POST',
                data: s_data
              }).then((_result: any) => {
                message.requestSuccess()
              })
            }
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
