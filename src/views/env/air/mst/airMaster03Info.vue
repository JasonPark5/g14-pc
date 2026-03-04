<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <q-form ref="editForm">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="airPreventiveMst"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="대기방지시설명"
                  name="envAirMstPreventiveName"
                  v-model:value="airPreventiveMst.envAirMstPreventiveName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="방지시설일련번호"
                  name="envAirMstPreventiveNo"
                  v-model:value="airPreventiveMst.envAirMstPreventiveNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="사내고유방지시설번호"
                  name="envAirMstPreventiveNum"
                  v-model:value="airPreventiveMst.envAirMstPreventiveNum"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  :required="true"
                  type="edit"
                  name="plantCd"
                  v-model:value="airPreventiveMst.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-dept
                  type="edit"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="airPreventiveMst.deptCd"
                  :isFirstValue="false"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="airPreventiveMst.useFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="위치"
                  name="location"
                  v-model:value="airPreventiveMst.location"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  suffix="㎥/분"
                  type="number"
                  :required="true"
                  :editable="editable"
                  label="처리용량"
                  name="handlingCapacity"
                  v-model:value="airPreventiveMst.handlingCapacity"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  suffix="㎥/분"
                  type="number"
                  :editable="editable"
                  label="설계허가증상용량"
                  name="permitCapacity"
                  v-model:value="airPreventiveMst.permitCapacity"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  label="처리오염물질"
                  name="handlingMaterial"
                  v-model:value="airPreventiveMst.handlingMaterial"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  type="number"
                  :editable="editable"
                  label="처리농도"
                  name="handlingConcentration"
                  v-model:value="airPreventiveMst.handlingConcentration"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  suffix="%"
                  type="number"
                  :editable="editable"
                  label="처리효율"
                  name="handlingPercent"
                  v-model:value="airPreventiveMst.handlingPercent"
                />
              </div>
            </template>
          </c-card>
          <c-card title="적산전력계" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-checkbox
                  :editable="editable"
                  :isFlag="true"
                  label="전력계부착여부"
                  name="wattmeterFlag"
                  v-model:value="airPreventiveMst.wattmeterFlag"
                  @update:value="changeWattmeterFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-select
                  :required="airPreventiveMst.wattmeterFlag === 'Y'"
                  :editable="editable && airPreventiveMst.wattmeterFlag === 'Y'"
                  :comboItems="wattmeterItems || []"
                  label="적산전력계"
                  itemText="envAirMstWattmeterName"
                  itemValue="envAirMstWattmeterId"
                  name="envAirMstWattmeterId"
                  type="edit"
                  v-model:value="airPreventiveMst.envAirMstWattmeterId"
                  @update:value="changeWattmeter"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="false"
                  label="적산전력계번호"
                  name="envAirMstWattmeterNo"
                  v-model:value="airPreventiveMst.envAirMstWattmeterNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="false"
                  label="배율"
                  type="number"
                  name="wattmeterMagnification"
                  v-model:value="airPreventiveMst.wattmeterMagnification"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { airPreventiveType } from './airMaster'

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
  name: 'airMaster03Info'
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
const emits = defineEmits(['insertPreventiveInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    envAirMstPreventiveId?: stringNull
    plantCd?: stringNull
  }
  contentHeight?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      envAirMstPreventiveId: '',
      plantCd: ''
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
const airPreventiveMst = ref<airPreventiveType>({
  plantCd: null, // 사업장코드
  envAirMstPreventiveId: '', // 대기방지시설 시스템일련번호
  envAirMstPreventiveName: '', // 대기방지시설명
  envAirMstPreventiveNo: '', // 대기방지시설 일련번호
  envAirMstPreventiveNum: '', // 대기방지시설 사내고유번호
  location: '', // 위치
  handlingCapacity: '', // 처리용량
  permitCapacity: '', // 설계허가증상용량
  handlingMaterial: '', // 처리오염물질
  handlingConcentration: '', // 처리농도
  handlingPercent: '', // 처리효율
  wattmeterFlag: 'N', // 전력계부착여부
  wattmeterMagnification: '', //  배율
  envAirMstWattmeterId: '', // 전력계일련번호
  envAirMstWattmeterNo: '', // 전력계번호
  envAirMstWattmeterName: '', // 전력계명
  deptCd: '', // 관리부서 코드
  useFlag: 'Y' // 사용여부
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const updateMode = ref(false)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.env.air.mst.preventive.insert.url)
const editForm = ref<any>(null)
const wattmeterItems = ref<Array<codeMasterType>>([])

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
  detailUrl.value = selectConfig.env.air.mst.preventive.get.url
  // code setting
  // list setting
  getCombos()
}
/******************************
 * TODO (목적): 적산전력계 항목 조회
 *******************************/
function getCombos() {
  $http({
    url: selectConfig.env.air.mst.wattmeter.list.url,
    method: 'GET',
    params: {
      plantCd: props.param.plantCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    wattmeterItems.value = _result.data
    getDetail()
  })
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.param.envAirMstPreventiveId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envAirMstPreventiveId: props.param.envAirMstPreventiveId }
    }).then((_result: any) => {
      airPreventiveMst.value = _result.data
      updateMode.value = true
    })
  }
}
/******************************
 * TODO (목적): 적산전력계 선택변경시
 *******************************/
function changeWattmeter() {
  const filterData = wattmeterItems.value.filter(
    (x: any) => x.envAirMstWattmeterId === airPreventiveMst.value.envAirMstWattmeterId
  )
  airPreventiveMst.value.envAirMstWattmeterNo = filterData[0].envAirMstWattmeterNo
  airPreventiveMst.value.wattmeterMagnification = filterData[0].wattmeterMagnification
}
/******************************
 * TODO (목적): 적산전력계 부착여부 체크변경시
 *******************************/
function changeWattmeterFlag() {
  if (airPreventiveMst.value.wattmeterFlag == 'N') {
    airPreventiveMst.value.envAirMstWattmeterId = null
    airPreventiveMst.value.envAirMstWattmeterNo = ''
    airPreventiveMst.value.wattmeterMagnification = 0
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.param.envAirMstPreventiveId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          airPreventiveMst.value.regUserId = user.value.userId
          airPreventiveMst.value.chgUserId = user.value.userId
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
  props.param.envAirMstPreventiveId = result.data.envAirMstPreventiveId
  message.requestSuccess()
  if (mappingType.value === 'POST') emits('insertPreventiveInfo', result.data.envAirMstPreventiveId)
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
