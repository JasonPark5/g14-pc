<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="페기물 처리결과" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && popupParam.envWasteAllbaroId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="waste"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="인계번호"
                  name="envWasteAllbaroNo"
                  v-model:value="waste.envWasteAllbaroNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-datepicker
                  :required="true"
                  label="인계일자"
                  name="allbaroDt"
                  v-model:value="waste.allbaroDt"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="폐기물 종류"
                  name="envWasteKindName"
                  v-model:value="waste.envWasteKindName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-text
                  :editable="editable"
                  label="구분"
                  name="envWasteCd"
                  v-model:value="waste.envWasteCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-task-target
                  :required="true"
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'wasteMst' }"
                  label="폐기물명"
                  name="envWasteMstId"
                  v-model:value="waste.envWasteMstId"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="성상"
                  name="state"
                  v-model:value="waste.state"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
                <c-select
                  :comboItems="endFlagItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="endFlag"
                  label="확정여부"
                  v-model:value="waste.endFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  type="number"
                  :required="true"
                  :editable="editable"
                  label="위탁량"
                  name="wasteVolume"
                  v-model:value="waste.wasteVolume"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  :required="true"
                  codeGroupCd="WASTE_UNIT_CD"
                  itemText="codeName"
                  itemValue="code"
                  type="edit"
                  name="wasteVolumeUnit"
                  label="단위"
                  v-model:value="waste.wasteVolumeUnit"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  type="number"
                  :editable="editable"
                  label="처리자인수량"
                  name="wasteVolumeInsu"
                  v-model:value="waste.wasteVolumeInsu"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="운반자명"
                  name="transportName"
                  v-model:value="waste.transportName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="차량번호"
                  name="carNo"
                  v-model:value="waste.carNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="처리자명"
                  name="processName"
                  v-model:value="waste.processName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="처리방법"
                  name="processMethodName"
                  v-model:value="waste.processMethodName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-textarea
                  :editable="editable"
                  label="처리장소"
                  name="processLocation"
                  autogrow
                  v-model:value="waste.processLocation"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="인계자명"
                  name="transferName"
                  v-model:value="waste.transferName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  :comboItems="emitterFlagItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="emitterFlag"
                  label="공동배출자여부"
                  v-model:value="waste.emitterFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  :comboItems="inputMehtodItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="emitterFlag"
                  label="입력구분"
                  v-model:value="waste.inputFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="관할관청"
                  name="officeName"
                  v-model:value="waste.officeName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  :comboItems="statusItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="status"
                  label="진행상태"
                  v-model:value="waste.status"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  :comboItems="processResultItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="processResult"
                  label="처리결과"
                  v-model:value="waste.processResult"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  :comboItems="ipItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="transportIp"
                  label="운반IP동일"
                  v-model:value="waste.transportIp"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  :comboItems="ipItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="processIp"
                  label="처리IP동일"
                  v-model:value="waste.processIp"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="예외사유"
                  name="remark"
                  v-model:value="waste.remark"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-field
                  :required="true"
                  :editable="editable && !popupParam.envWasteAllbaroId"
                  :data="waste"
                  deptValue="deptCd"
                  type="dept_user"
                  label="작성부서 & 작성자"
                  name="userId"
                  v-model:value="waste.userId"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  :required="true"
                  type="edit"
                  name="plantCd"
                  v-model:value="waste.plantCd"
                />
              </div> -->
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { wasteType } from './waste'

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
  name: 'wasteReportManageDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
interface propType {
  popupParam: {
    envWasteAllbaroId?: stringNull
    plantCd?: stringNull
  }
  contentHeight?: stringNull
}
/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      envWasteAllbaroId: '',
      plantCd: null
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const waste = ref<wasteType>({
  envWasteAllbaroId: '', // 폐기물 인계서 시스템일련번호
  plantCd: null, // 사업장
  userId: '',
  envWasteAllbaroNo: '', // 인계번호
  allbaroDt: '', // 인계일자
  endFlag: null, // 확정여부
  envWasteCd: null, // 폐기물명 코드
  envWasteMstId: null, // 폐기물종류 일련번호
  envWasteKindName: '',
  state: '', // 성상
  envWasteName: '', // 폐기물명
  wasteVolume: '', // 위탁량
  wasteVolumeUnit: null, // 단위
  wasteVolumeInsu: '', // 처리자인수량
  transportName: '', // 운반자명
  carNo: '', // 차량번호
  processName: '', // 처리자명
  processMethod: '', // 처리방법
  processMethodName: '',
  processLocation: '', // 처리장소
  transferName: '', // 인계자명
  emitterFlag: null, // 공동배출자여부
  inputFlag: '', // 입력구분
  officeName: '', // 관할관청
  status: '', // 진행상태
  processResult: '', // 처리결과
  transportIp: 'Y', // 운반IP동일
  processIp: 'Y', // 처리IP동일
  remark: '' // 예외사유
})
const saveUrl = ref(transactionConfig.env.waste.allbaro.insert.url)
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const updateMode = ref(false)
const detailUrl = ref('')
const deleteUrl = ref('')
const editForm = ref<any>(null)
const statusItems = ref<Array<codeMasterType>>([])
const processResultItems = ref<Array<codeMasterType>>([])
const endFlagItems = ref<Array<codeMasterType>>([])
const emitterFlagItems = ref<Array<codeMasterType>>([])
const ipItems = ref<Array<codeMasterType>>([
  {
    code: 'Y',
    codeName: 'Y'
  },
  {
    code: 'N',
    codeName: 'N'
  }
])
const inputMehtodItems = ref<Array<codeMasterType>>([
  {
    code: 'Internet',
    codeName: 'Internet'
  },
  {
    code: 'Mobile',
    codeName: 'Mobile'
  }
])
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
  detailUrl.value = selectConfig.env.waste.allbaro.get.url
  deleteUrl.value = transactionConfig.env.waste.allbaro.delete.url
  // code setting
  endFlagItems.value = [
    { code: $language('예'), codeName: $language('예') },
    { code: $language('아니오'), codeName: $language('아니오') }
  ]
  emitterFlagItems.value = [
    { code: $language('예'), codeName: $language('예') },
    { code: $language('아니오'), codeName: $language('아니오') }
  ]
  processResultItems.value = [
    { code: $language('운반중'), codeName: $language('운반중') },
    { code: $language('운반전'), codeName: $language('운반전') },
    { code: $language('운반완료'), codeName: $language('운반완료') }
  ]
  statusItems.value = [
    { code: $language('정상'), codeName: $language('정상') },
    { code: $language('오류'), codeName: $language('오류') }
  ]
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWasteAllbaroId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envWasteAllbaroId: props.popupParam.envWasteAllbaroId }
    }).then((_result: any) => {
      waste.value = _result.data
      updateMode.value = true
    })
  } else {
    waste.value.userId = user.value.userId
    waste.value.plantCd = props.popupParam.plantCd
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.popupParam.envWasteAllbaroId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          waste.value.regUserId = user.value.userId
          waste.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  props.popupParam.envWasteAllbaroId = result.data.envWasteAllbaroId
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.envWasteAllbaroId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 폐기물 명칭 변경시
 *******************************/
function dataChange(data1: any, data2: any, data3: any) {
  waste.value.envWasteCd = data3.envWasteCd || ''
  waste.value.envWasteMstId = data3.envWasteMstId || ''
  waste.value.envWasteKindName = data3.envWasteKindName || ''
  waste.value.envWasteName = data3.envWasteName || ''
  waste.value.state = data3.state || ''
  waste.value.processMethod = data3.processType || ''
  waste.value.processMethodName = data3.processTypeName || ''
  waste.value.processName = data3.processName || ''
  waste.value.processLocation = data3.processLocation || ''
  waste.value.transportName = data3.transportName || ''
  waste.value.officeName = data3.officeName || ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
