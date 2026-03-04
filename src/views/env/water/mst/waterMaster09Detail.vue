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
              :param="drugData"
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
              label="약품명"
              name="envWaterMstDrugName"
              v-model:value="drugData.envWaterMstDrugName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              label="비고"
              name="remark"
              v-model:value="drugData.remark"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <c-plant
              :required="true"
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="drugData.plantCd"
            />
          </div> -->
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <c-dept
              type="edit"
              :editable="editable"
              label="관리부서"
              name="deptCd"
              v-model:value="drugData.deptCd"
            />
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <c-checkbox
              :editable="editable"
              :isFlag="true"
              label="사용여부"
              name="useFlag"
              v-model:value="drugData.useFlag"
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
import { DrugType } from './waterMasterType'
/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'waterMaster09Detail'
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
    envWaterMstDrugId: stringNull
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
      envWaterMstDrugId: ''
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
const editForm = ref<any>(null)
const mappingType = ref('POST')
const isSave = ref(false)
const editable = ref(true)
const drugData = ref<DrugType>({
  plantCd: null, // 사업장코드
  envWaterMstDrugId: '', // 수질약품 일련번호
  envWaterMstDrugName: '', // 수질약품명
  remark: '',
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
  // url setting
  detailUrl.value = selectConfig.env.water.mst.drug.get.url
  saveUrl.value = transactionConfig.env.water.mst.drug.insert.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWaterMstDrugId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.envWaterMstDrugId),
      method: 'GET'
    }).then((_result: any) => {
      drugData.value = _result.data
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.envWaterMstDrugId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.env.water.mst.drug.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.env.water.mst.drug.insert.url
  }
  editForm.value.validate().then((_result: Boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          drugData.value.regUserId = user.value.userId
          drugData.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.envWaterMstDrugId = result.data.envWaterMstDrugId
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
