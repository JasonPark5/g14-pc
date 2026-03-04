<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="watterData"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :required="true"
              :editable="editable"
              label="전력량계명"
              name="envWaterMstWattmeterName"
              v-model:value="watterData.envWaterMstWattmeterName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              label="전력량계 관리번호"
              name="envWaterMstWattmeterNo"
              v-model:value="watterData.envWaterMstWattmeterNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :required="true"
              :editable="editable"
              type="number"
              label="전력량계 배율"
              name="wattmeterMagnification"
              v-model:value="watterData.wattmeterMagnification"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-plant
              :required="true"
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="watterData.plantCd"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-dept
              type="edit"
              :editable="editable"
              label="관리부서"
              name="deptCd"
              v-model:value="watterData.deptCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-checkbox
              :isFlag="true"
              :editable="editable"
              label="사용여부"
              name="useFlag"
              v-model:value="watterData.useFlag"
            />
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
import { waterWattmetType } from './waterMasterType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'waterMaster03Detail'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    envWaterMstWattmeterId: stringNull
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
      envWaterMstWattmeterId: ''
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
const detailUrl = ref('')
const saveUrl = ref('')
const editable = ref(true)
const mappingType = ref('POST')
const editForm = ref<any>(null)
const isSave = ref(false)

const watterData = ref<waterWattmetType>({
  plantCd: null, // 사업장코드
  envWaterMstWattmeterId: '', // 수질전력량계 일련번호
  envWaterMstWattmeterName: '', // 수질전력량계명
  envWaterMstWattmeterNo: '', // 수질전력량계 관리번호
  wattmeterMagnification: '1',
  deptCd: '', // 관리부서 코드
  useFlag: 'Y' // 사용여부
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
  // url settin
  detailUrl.value = selectConfig.env.water.mst.wattmeter.get.url
  saveUrl.value = transactionConfig.env.water.mst.wattmeter.insert.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.envWaterMstWattmeterId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.envWaterMstWattmeterId),
      method: 'GET'
    }).then((_result: any) => {
      watterData.value = _result.data
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.envWaterMstWattmeterId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.env.water.mst.wattmeter.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.env.water.mst.wattmeter.insert.url
  }
  editForm.value.validate().then((_result: Boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          watterData.value.regUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.envWaterMstWattmeterId = result.data.envWaterMstWattmeterId
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
