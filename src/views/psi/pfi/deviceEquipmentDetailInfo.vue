<template>
  <div>
    <q-form ref="editForm">
      <c-card :noHeader="true" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-12" v-if="checkTypes">
            <c-text
              required
              :editable="param.editable"
              label="장치구분"
              name="devicePartName"
              v-model:value="item.devicePartName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-textarea
              :editable="param.editable"
              label="내용물"
              name="inMaterials"
              :rows="5"
              v-model:value="item.inMaterials"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-textarea
              :editable="param.editable"
              label="용량"
              name="volume"
              :rows="5"
              v-model:value="item.volume"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 m5">
            <c-text
              suffix="MPa"
              :editable="param.editable"
              label="압력(MPa)-운전"
              name="pressOperation"
              v-model:value="item.pressOperation"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 m5">
            <c-text
              suffix="MPa"
              :editable="param.editable"
              label="압력(MPa)-설계"
              name="pressDesign"
              v-model:value="item.pressDesign"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 m5">
            <c-text
              suffix="℃"
              :editable="param.editable"
              label="온도(℃)-운전"
              name="tempOperation"
              v-model:value="item.tempOperation"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 m5">
            <c-text
              suffix="℃"
              :editable="param.editable"
              label="온도(℃)-설계"
              name="tempDesign"
              v-model:value="item.tempDesign"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-textarea
              :editable="param.editable"
              label="사용재질-본체"
              name="materialMain"
              autogrow
              v-model:value="item.materialMain"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-textarea
              :editable="param.editable"
              label="사용재질-부속품"
              name="materialSubPart"
              autogrow
              v-model:value="item.materialSubPart"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-textarea
              :editable="param.editable"
              label="사용재질-개스킷"
              name="materialGasket"
              autogrow
              v-model:value="item.materialGasket"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3" />
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 m5">
            <c-text
              :editable="param.editable"
              label="용법효율"
              name="weldingEfficiency"
              v-model:value="item.weldingEfficiency"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 m5">
            <c-text
              suffix="mm"
              :editable="param.editable"
              label="계산두께(mm)"
              name="calculateThick"
              v-model:value="item.calculateThick"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 m5">
            <c-text
              suffix="mm"
              :editable="param.editable"
              label="부식여유(mm)"
              name="corrosionAllowance"
              v-model:value="item.corrosionAllowance"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 m5">
            <c-text
              suffix="mm"
              :editable="param.editable"
              label="사용두께(mm)"
              name="useThick"
              v-model:value="item.useThick"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-select
              :editable="param.editable"
              :comboItems="afterHeatTreatYnItems"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="afterHeatTreatYn"
              label="후열처리 여부"
              v-model:value="item.afterHeatTreatYn"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              suffix="%"
              :editable="param.editable"
              label="비파괴검사율(%)"
              name="nondestructPercent"
              v-model:value="item.nondestructPercent"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-text
              :editable="param.editable"
              label="적용법령"
              name="applicableLaws"
              v-model:value="item.applicableLaws"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt5">
            <c-text
              :editable="param.editable"
              label="연결구 상태"
              name="conectorStatus"
              v-model:value="item.conectorStatus"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mt5">
            <c-text
              :editable="param.editable"
              label="설계표준"
              name="designStandards"
              v-model:value="item.designStandards"
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
import { deviceDetailType } from '../processSafetyInfo'

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
  name: 'deviceEquipmentDetailInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    psiDeviceEquipmentId?: stringNull
    deviceTypeCd?: stringNull
    devicePartCd?: stringNull
    devicePartName?: stringNull
    editable?: boolean
  }
  item?: deviceDetailType
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
      psiDeviceEquipmentId: '',
      deviceTypeCd: '', // 장치
      devicePartCd: '',
      devicePartName: '',
      editable: false
    }
  },
  item: () => {
    return {
      psiDeviceEquipmentId: '', // 장치일련번호
      deviceTypeCd: '', // 장치
      devicePartCd: '', // 장치구분
      devicePartName: '', // 장치구분명
      inMaterials: '', // 내용물
      volume: '', // 용량
      pressOperation: '', // 압력(MPa)-운전
      pressDesign: '', // 압력(MPa)-설계
      tempOperation: '', // 온도(℃)-운전
      tempDesign: '', // 온도(℃)-설계
      materialMain: '', // 사용재질-본체
      materialSubPart: '', // 사용재질-부속품
      materialGasket: '', // 사용재질-개스킷
      weldingEfficiency: '', // 용접효율
      calculateThick: '', // 계산두께(mm)
      corrosionAllowance: '', // 부식여유(mm)
      useThick: '', // 사용두께(mm)
      afterHeatTreatYn: 'N', // 후열처리여부
      nondestructMethod: '', // 비파괴검사방법
      nondestructPercent: '', // 비파괴검사율(%)
      applicableLaws: '', // 적용법령
      conectorStatus: '', // 적용법령
      designStandards: '', // 적용법령
      regUserId: '',
      chgUserId: ''
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
const afterHeatTreatYnItems = ref<Array<codeMasterType>>([
  { code: 'Y', codeName: 'Y' },
  { code: 'N', codeName: 'N' }
])

/******************************
 * @Computed_선언
 *******************************/
const checkTypes = computed(() => (props.param.deviceTypeCd === 'DTC0000000' ? true : false))

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
  // url setting
  // code setting
  props.item.psiDeviceEquipmentId = props.param.psiDeviceEquipmentId
  props.item.regUserId = user.value.userId
  props.item.chgUserId = user.value.userId
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.m5
  margin: 15px 0 !important
.mt5
  margin-top: 15px !important
</style>
