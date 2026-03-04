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
              :param="disInfoData"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-plant
              :required="true"
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="disInfoData.plantCd"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :required="true"
              :editable="editable"
              label="배출시설명"
              name="envWaterMstDischargeName"
              v-model:value="disInfoData.envWaterMstDischargeName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-dept
              type="edit"
              :editable="editable"
              label="관리부서"
              name="deptCd"
              v-model:value="disInfoData.deptCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-checkbox
              :editable="editable"
              :isFlag="true"
              label="사용여부"
              name="useFlag"
              v-model:value="disInfoData.useFlag"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-checkbox
              :editable="editable"
              :isFlag="true"
              label="IEPS시설여부"
              name="useFlag"
              v-model:value="disInfoData.useFlag"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              label="배출시설 관리번호(IEPS)"
              name="dischargeIepsNo"
              v-model:value="disInfoData.dischargeIepsNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              label="사업장 관리번호(IEPS)"
              name="dischargeIepsPlantMgtNo"
              v-model:value="disInfoData.dischargeIepsPlantMgtNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              label="IEPS배출시설명"
              name="dischargeIepsName"
              v-model:value="disInfoData.dischargeIepsName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-task-target
              :editable="editable"
              label="IEPS 공정"
              name="processCd"
              :customPopupParam="{ targetKey: 'envProcess' }"
              v-model:value="disInfoData.processCd"
              @dataChange="dataChange"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              readonly
              label="IEPS 공정번호"
              name="processNo"
              v-model:value="disInfoData.processNo"
            />
          </div>
        </template>
      </c-card>
    </q-form>
    <!-- <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        :editable="editable"
        ref="table"
        title="기본 가동(조업)시간"
        tableId="grid"
        :columns="checkTable.columns"
        :data="checkTable.data"
        :usePaging="false"
        :hideBottom="true"
        :columnSetting="false"
        :isFullScreen="false"
        :filtering="false"
        :isExcelDown="false"
        gridHeightAuto
      />
    </div> -->
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
import { waterDisChargeType } from './waterMasterType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'waterMaster02Detail'
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
    envWaterMstDischargeId: stringNull
  }
}
interface gridType {
  columns: tableColumnType
  data: Array<waterDisChargeType>
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
      envWaterMstDischargeId: ''
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
const workplaceListUrl = ref('')
const saveUrl = ref('')
const mappingType = ref('POST')
const editForm = ref<any>(null)
const isSave = ref(false)
const editable = ref(true)
const disInfoData = ref<waterDisChargeType>({
  plantCd: null, // 사업장코드
  envWaterMstDischargeId: '', // 수질방지시설 일련번호
  envWaterMstDischargeName: '', // 수질방지시설명
  dischargeIepsNo: '',
  dischargeIepsPlantMgtNo: '',
  dischargeIepsName: '',
  envWaterMstDischargeNo: '', // 수질방지시설 관리번호
  processCd: '',
  deptCd: '', // 관리부서 코드
  useFlag: 'Y', // 사용여부
  iepsFlag: 'Y'
  // oprTime01: 'N', // 기본 가동시간 01시
  // oprTime02: 'N', // 기본 가동시간 02시
  // oprTime03: 'N', // 기본 가동시간 03시
  // oprTime04: 'N', // 기본 가동시간 04시
  // oprTime05: 'N', // 기본 가동시간 05시
  // oprTime06: 'N', // 기본 가동시간 06시
  // oprTime07: 'N', // 기본 가동시간 07시
  // oprTime08: 'N', // 기본 가동시간 08시
  // oprTime09: 'N', // 기본 가동시간 09시
  // oprTime10: 'N', // 기본 가동시간 10시
  // oprTime11: 'N', // 기본 가동시간 11시
  // oprTime12: 'N', // 기본 가동시간 12시
  // oprTime13: 'N', // 기본 가동시간 13시
  // oprTime14: 'N', // 기본 가동시간 14시
  // oprTime15: 'N', // 기본 가동시간 15시
  // oprTime16: 'N', // 기본 가동시간 16시
  // oprTime17: 'N', // 기본 가동시간 17시
  // oprTime18: 'N', // 기본 가동시간 18시
  // oprTime19: 'N', // 기본 가동시간 19시
  // oprTime20: 'N', // 기본 가동시간 20시
  // oprTime21: 'N', // 기본 가동시간 21시
  // oprTime22: 'N', // 기본 가동시간 22시
  // oprTime23: 'N', // 기본 가동시간 23시
  // oprTime24: 'N' // 기본 가동시간 24시
})
const checkTable = ref<gridType>({
  columns: Array.from({ length: 24 }, (_, i) => ({
    name: `oprTime${(i + 1).toString().padStart(2, '0')}`,
    field: `oprTimee${(i + 1).toString().padStart(2, '0')}`,
    label: `${i + 1}`,
    align: 'center',
    type: 'check',
    true: 'Y',
    false: 'N',
    value: 'N',
    sortable: false
  })),
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
  // url settin
  detailUrl.value = selectConfig.env.water.mst.discharge.get.url
  workplaceListUrl.value = selectConfig.env.procWork.list.url
  saveUrl.value = transactionConfig.env.water.mst.discharge.insert.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세 정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWaterMstDischargeId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.envWaterMstDischargeId),
      method: 'GET'
    }).then((_result: any) => {
      disInfoData.value = _result.data
      checkTable.value.data = [_result.data]
    })
  }
}

function dataChange(_data1: any, _data2: any, _data3: any) {
  disInfoData.value.processNo = _data3.processNo
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.envWaterMstDischargeId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.env.water.mst.discharge.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.env.water.mst.discharge.insert.url
  }
  editForm.value.validate().then((_result: Boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          disInfoData.value.regUserId = user.value.userId
          // disInfoData.value.oprTime01 = checkTable.value.data[0].oprTime01 // 기본 가동시간 01시
          // disInfoData.value.oprTime02 = checkTable.value.data[0].oprTime02 // 기본 가동시간 02시
          // disInfoData.value.oprTime03 = checkTable.value.data[0].oprTime03 // 기본 가동시간 03시
          // disInfoData.value.oprTime04 = checkTable.value.data[0].oprTime04 // 기본 가동시간 04시
          // disInfoData.value.oprTime05 = checkTable.value.data[0].oprTime05 // 기본 가동시간 05시
          // disInfoData.value.oprTime06 = checkTable.value.data[0].oprTime06 // 기본 가동시간 06시
          // disInfoData.value.oprTime07 = checkTable.value.data[0].oprTime07 // 기본 가동시간 07시
          // disInfoData.value.oprTime08 = checkTable.value.data[0].oprTime08 // 기본 가동시간 08시
          // disInfoData.value.oprTime09 = checkTable.value.data[0].oprTime09 // 기본 가동시간 09시
          // disInfoData.value.oprTime10 = checkTable.value.data[0].oprTime10 // 기본 가동시간 10시
          // disInfoData.value.oprTime11 = checkTable.value.data[0].oprTime11 // 기본 가동시간 11시
          // disInfoData.value.oprTime12 = checkTable.value.data[0].oprTime12 // 기본 가동시간 12시
          // disInfoData.value.oprTime13 = checkTable.value.data[0].oprTime13 // 기본 가동시간 13시
          // disInfoData.value.oprTime14 = checkTable.value.data[0].oprTime14 // 기본 가동시간 14시
          // disInfoData.value.oprTime15 = checkTable.value.data[0].oprTime15 // 기본 가동시간 15시
          // disInfoData.value.oprTime16 = checkTable.value.data[0].oprTime16 // 기본 가동시간 16시
          // disInfoData.value.oprTime17 = checkTable.value.data[0].oprTime17 // 기본 가동시간 17시
          // disInfoData.value.oprTime18 = checkTable.value.data[0].oprTime18 // 기본 가동시간 18시
          // disInfoData.value.oprTime19 = checkTable.value.data[0].oprTime19 // 기본 가동시간 19시
          // disInfoData.value.oprTime20 = checkTable.value.data[0].oprTime20 // 기본 가동시간 20시
          // disInfoData.value.oprTime21 = checkTable.value.data[0].oprTime21 // 기본 가동시간 21시
          // disInfoData.value.oprTime22 = checkTable.value.data[0].oprTime22 // 기본 가동시간 22시
          // disInfoData.value.oprTime23 = checkTable.value.data[0].oprTime23 // 기본 가동시간 23시
          // disInfoData.value.oprTime24 = checkTable.value.data[0].oprTime24 // 기본 가동시간 24시
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.envWaterMstDischargeId = result.data.envWaterMstDischargeId
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
