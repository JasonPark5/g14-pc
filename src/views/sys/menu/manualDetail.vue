<template>
  <div class="manual-detail">
    <q-form ref="editForm">
      <c-card title="매뉴얼" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="manualData"
              :mappingType="saveType"
              label="저장"
              icon="save"
              @beforeAction="saveData"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-textarea
              :editable="editable"
              type="editor"
              label="매뉴얼 내용"
              name="content"
              :editheight="40"
              v-model:value="manualData.content"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <c-checkbox
              :isFlag="true"
              label="첨부 PDF 파일로 매뉴얼 사용여부(첫번째 파일 - 첨부파일 사용안할 경우 첨부개수 1로 고정)"
              name="pdfUseFlag"
              v-model:value="manualData.pdfUseFlag"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style="margin-top: 20px">
            <c-upload :attachInfo="attachInfo" :editable="editable" label="첨부파일" />
          </div>
        </template>
      </c-card>
    </q-form>
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
import { menuType } from './menu'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'manualDetail'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sysMenuId: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      sysMenuId: ''
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
const saveUrl = ref('')
const saveType = ref('POST')
const insertUrl = ref('')
const updateUrl = ref('')
const isSave = ref(false)
const updateMode = ref(false)
const detailUrl = ref('')
const manualData = ref<menuType>({
  sysMenuId: '', // 메뉴 SEQ
  content: '', // 매뉴얼 내용
  useFlag: 'Y', // 사용여부
  pdfUseFlag: 'N',
  existManual: 'N'
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'MANUAL_FILE',
  taskKey: ''
})
const editForm = ref<any>(null)
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
 * TODO function 주석 작성 (asdffunctionannotation 사용)\
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  detailUrl.value = selectConfig.sys.manual.get.url
  insertUrl.value = transactionConfig.sys.manual.insert.url
  updateUrl.value = transactionConfig.sys.manual.update.url
  // code setting
  // list setting
  getData()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getData() {
  if (props.popupParam.sysMenuId) {
    attachInfo.value.taskKey = props.popupParam.sysMenuId
    updateMode.value = true
    $http({
      url: $format(detailUrl.value, props.popupParam.sysMenuId),
      method: 'GET'
    }).then((_result: any) => {
      if (_result.data.existManual == 'N') {
        manualData.value = {
          sysMenuId: props.popupParam.sysMenuId, // 메뉴 SEQ
          content: '', // 매뉴얼 내용
          useFlag: 'Y', // 사용여부
          pdfUseFlag: 'N' // PDF 사용여부
        }
        saveUrl.value = insertUrl.value
        saveType.value = 'POST'
      } else {
        manualData.value = _result.data
        saveUrl.value = updateUrl.value
        saveType.value = 'PUT'
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 사저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getData()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="scss">
.manual-detail {
  padding: 10px;
}
</style>
