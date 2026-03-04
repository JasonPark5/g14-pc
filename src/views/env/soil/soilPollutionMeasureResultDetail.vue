<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <q-form ref="editForm1">
          <c-card title="복합악취" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-datepicker
                  :editable="editable"
                  label="측정일시"
                  type="datetime"
                  :minuteStep="1"
                  name="envOdorMeasureDt"
                  v-model:value="soilData.envOdorMeasureDt"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  type="edit"
                  label="측정지점"
                  :comboItems="locationItems"
                  itemText="codeName"
                  itemValue="code"
                  name="envOdorLocation"
                  v-model:value="soilData.envOdorLocation"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="측정결과(배)"
                  type="number"
                  name="envOdorResult"
                  v-model:value="soilData.envOdorResult"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="허가배출기준"
                  type="number"
                  name="envOdorResultEmissionStandard"
                  v-model:value="soilData.envOdorResultEmissionStandard"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                <c-text
                  :editable="editable"
                  label="비고"
                  name="envNote"
                  v-model:value="soilData.envNote"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <q-form ref="editForm2">
          <c-card title="특정토양오염" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <q-btn-group outline>
                  <c-btn
                    v-if="Boolean(popupParam.envSoilPollutantMeasureResultId) && editable"
                    label="삭제"
                    icon="delete_forever"
                    @btnClicked="remove"
                  />
                  <c-btn
                    v-if="editable"
                    :url="saveUrl"
                    :isSubmit="isSave"
                    :param="soilData"
                    :mappingType="mappingType"
                    label="일괄저장"
                    icon="save"
                    @beforeAction="saveInfo"
                    @btnCallback="saveCallback"
                  />
                </q-btn-group>
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-datepicker
                  :editable="editable"
                  label="측정일시"
                  type="datetime"
                  :minuteStep="1"
                  name="envSoilMeasureDt"
                  v-model:value="soilData.envSoilMeasureDt"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  type="edit"
                  label="측정지점"
                  :comboItems="locationItems"
                  itemText="codeName"
                  itemValue="code"
                  name="envSoilMeasureLocation"
                  v-model:value="soilData.envSoilMeasureLocation"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="측정물질농도 (mg/kg)"
                  type="number"
                  name="envSoilPollutantConcentration"
                  v-model:value="soilData.envSoilPollutantConcentration"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  type="edit"
                  label="측정물질명"
                  :comboItems="pollutantItems"
                  itemText="codeName"
                  itemValue="code"
                  name="envSoilPollutantMstId"
                  v-model:value="soilData.envSoilPollutantMstId"
                  @datachange="soilPollutantDataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="측정물질코드"
                  :disabled="true"
                  name="envSoilPollutantMstNo"
                  v-model:value="soilData.envSoilPollutantMstNo"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :editable="editable"
                label="단위"
                :disabled="true"
                name="soilPollutantUnitName"
                v-model:value="soilData.soilPollutantUnitName"
              />
            </div> -->
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="허가배출기준"
                  :disabled="true"
                  name="envSoilEmissionStandard"
                  v-model:value="soilData.envSoilEmissionStandard"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <q-form ref="editForm3">
          <c-card title="소음진동" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-datepicker
                  :editable="editable"
                  label="측정일시"
                  type="datetime"
                  :minuteStep="1"
                  name="envNoiseMeasureDt"
                  v-model:value="soilData.envNoiseMeasureDt"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  type="edit"
                  label="측정지점"
                  :comboItems="locationItems"
                  itemText="codeName"
                  itemValue="code"
                  name="envNoiseLocation"
                  v-model:value="soilData.envNoiseLocation"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="측정기기"
                  name="envNoiseDeviceName"
                  v-model:value="soilData.envNoiseDeviceName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  label="측정시간대"
                  codeGroupCd="ENV_NOISE_TIME_SLOT"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="envNoiseTimeSlot"
                  v-model:value="soilData.envNoiseTimeSlot"
                  @datachange="noiseOrVibration"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="!vibrationFlag"
                  label="측정진동(dB(V))"
                  type="number"
                  name="envNoiseVibration"
                  v-model:value="soilData.envNoiseVibration"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="!noiseFlag"
                  label="배경소음(dB(A))"
                  type="number"
                  name="envNoiseBackground"
                  v-model:value="soilData.envNoiseBackground"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="!noiseFlag"
                  label="측정소음(dB(A))"
                  type="number"
                  name="envNoiseMeasured"
                  v-model:value="soilData.envNoiseMeasured"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="허용기준"
                  type="number"
                  name="envNoiseStandard"
                  v-model:value="soilData.envNoiseStandard"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  type="edit"
                  label="기준준수여부 (Y/N)"
                  codeGroupCd="ENV_NOISE_COMPLIANCE_YN"
                  itemText="codeName"
                  itemValue="code"
                  name="envNoiseComplianceYn"
                  v-model:value="soilData.envNoiseComplianceYn"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <q-form ref="editForm4">
          <c-card title="기타" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="soilData.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-datepicker
                  :editable="editable"
                  label="측정일시"
                  type="datetime"
                  :minuteStep="1"
                  name="envEtcMeasureDt"
                  v-model:value="soilData.envEtcMeasureDt"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  type="edit"
                  label="매체구분"
                  codeGroupCd="ENV_ETC_MEDIUM_TYPE"
                  itemText="codeName"
                  itemValue="code"
                  name="envEtcMediumType"
                  v-model:value="soilData.envEtcMediumType"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :editable="editable"
                  type="edit"
                  label="측정지점"
                  :comboItems="locationItems"
                  itemText="codeName"
                  itemValue="code"
                  name="envEtcLocation"
                  v-model:value="soilData.envEtcLocation"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="측정물질명"
                  name="envEtcPollutantName"
                  v-model:value="soilData.envEtcPollutantName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="배출가스량(S㎥/min) 또는 유량(㎥/일)"
                  type="number"
                  name="envEtcEmissionOrFlowRate"
                  v-model:value="soilData.envEtcEmissionOrFlowRate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="측정물질 농도"
                  type="number"
                  name="envEtcConcentration"
                  v-model:value="soilData.envEtcConcentration"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  label="허가배출기준"
                  type="number"
                  name="envEtcEmissionStandard"
                  v-model:value="soilData.envEtcEmissionStandard"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="지정악취" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="soilData.plantCd"
                />
              </div> -->
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-datepicker
                :editable="editable"
                label="측정일시"
                type="datetime"
                :minuteStep="1"
                name="envOdorPollutantMeasureDt"
                v-model:value="soilData.envOdorPollutantMeasureDt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                :editable="editable"
                type="edit"
                label="측정지점"
                :comboItems="locationItems"
                itemText="codeName"
                itemValue="code"
                name="envOdorPollutantLocation"
                v-model:value="soilData.envOdorPollutantLocation"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                :editable="editable"
                type="edit"
                label="측정물질명"
                :comboItems="OdorItems"
                itemText="codeName"
                itemValue="code"
                name="envOdorPollutantMstId"
                v-model:value="soilData.envOdorPollutantMstId"
                @datachange="odorDataChange"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :editable="editable"
                :disabled="true"
                label="측정물질코드"
                name="envOdorPollutantMstNo"
                v-model:value="soilData.envOdorPollutantMstNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :editable="editable"
                label="측정물질 농도(ppm)"
                type="number"
                name="envOdorPollutantConcentration"
                v-model:value="soilData.envOdorPollutantConcentration"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :editable="editable"
                :disabled="true"
                label="허가배출기준"
                name="envOdorEmissionStandard"
                v-model:value="soilData.envOdorEmissionStandard"
              />
            </div>
          </template>
        </c-card>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="비점오염" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="soilData.plantCd"
                />
              </div> -->
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-datepicker
                :editable="editable"
                label="측정일시"
                type="datetime"
                :minuteStep="1"
                name="envNonpointMeasureDt"
                v-model:value="soilData.envNonpointMeasureDt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                :editable="editable"
                type="edit"
                label="측정지점"
                :comboItems="locationItems"
                itemText="codeName"
                itemValue="code"
                name="envNonpointLocation"
                v-model:value="soilData.envNonpointLocation"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                :editable="editable"
                type="edit"
                label="측정물질명"
                :comboItems="nonPointItems"
                itemText="codeName"
                itemValue="code"
                name="envNonpointPollutantMstId"
                v-model:value="soilData.envNonpointPollutantMstId"
                @datachange="nonPointEmissionDataChange"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :editable="editable"
                :disabled="true"
                label="측정물질코드"
                name="envNonpointPollutantMstNo"
                v-model:value="soilData.envNonpointPollutantMstNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :editable="editable"
                label="측정물질 농도"
                type="number"
                name="envNonpointConcentration"
                v-model:value="soilData.envNonpointConcentration"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :editable="editable"
                :disabled="true"
                label="허가배출기준"
                name="envNonpointEmissionStandard"
                v-model:value="soilData.envNonpointEmissionStandard"
                @datachange="nonPointEmissionDataChange"
              />
            </div>
          </template>
        </c-card>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-upload :attachInfo="attachInfo" :editable="editable" label="첨부파일" />
    </div>
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
  name: 'soilPollutionMeasureResultDetail'
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
    envSoilPollutantMeasureResultId?: stringNull
  }
  contentHeight?: stringNull
}
interface codeMasterItem {
  code: string
  codeName: string
  unit?: string
  envSoilPollutantMstNo?: string
  soilPollutantUnitName?: string
  envSoilEmissionStandard?: string
  envOdorPollutantMstName?: string
  envOdorEmissionStandard?: string
  envNonpointPollutantMstNo?: string
  envOdorPollutantMstNo?: string
  envNonpointEmissionStandard?: string
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
      envSoilPollutantMeasureResultId: ''
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
const soilData = ref<any>({
  envSoilPollutantMeasureResultId: '', // 전체 오염측정일지 일련번호
  envOdorMstId: '', // 복합악취 일련번호
  envOdorMeasureDt: '', // 복합악취 측정일시
  envOdorLocation: '', // 복합악취 측정지점
  envOdorResult: '', // 복합악취 측정결과
  envOdorResultEmissionStandard: '', // 복합악취 허가배출기준
  envOdorPollutantMstId: '', // 지정악취 일련번호
  envOdorPollutantMeasureDt: '', // 지정악취 측정일시
  envOdorPollutantLocation: '', // 지정악취 측정지점
  envOdorPollutantConcentration: '', // 지정악취 농도(ppm)
  envNoiseMeasureMst: '', // 소음진동 일련번호
  envNoiseMeasureDt: '', // 소음진동 측정일시
  envNoiseLocation: '', // 소음진동 측정지점
  envNoiseDeviceName: '', // 소음진동 측정기기
  envNoiseTimeSlot: '', // 소음진동 측정시간대
  envNoiseVibration: '', // 측정진동(dB(V))
  envNoiseBackground: '', // 배경소음(dB(A))
  envNoiseMeasured: '', // 측정소음(dB(A))
  envNoiseStandard: '', // 소음진동 허용기준
  envNoiseComplianceYn: '', // 기준준수여부 (Y/N)
  envSoilPollutantMstId: '', // 특정토양오염물질 일련번호(fk)
  envSoilMeasureDt: '', // 측정일시
  envSoilMeasureLocation: '', // 측정지점
  envSoilPollutantConcentration: '', // 측정물질 농도
  envNonpointPollutantMstId: '', // 비점오염 일련번호
  envNonpointMeasureDt: '', // 비점오염 측정일시
  envNonpointLocation: '', // 비점오염 측정지점
  envNonpointConcentration: '', // 비점오염 측정물질 농도
  envEtcMeasureMst: '', // 기타 측정 일련번호
  envEtcMeasureDt: '', // 기타 측정일시
  envEtcMediumType: '', // 기타 매체구분
  envEtcLocation: '', // 기타 측정지점
  envEtcPollutantName: '', // 기타 측정물질명
  envEtcEmissionOrFlowRate: '', // 배출가스량(S㎥/min) 또는 유량(㎥/일)
  envEtcConcentration: '', // 기타 측정물질 농도
  envEtcEmissionStandard: '', // 기타 허가배출기준
  envNote: '', // 비고
  regUserId: '', // 작성자
  chgUserId: '' // 수정자
})
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const updateMode = ref(false)
const detailUrl = ref('')
const workplaceListUrl = ref('')
const saveUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const workplaceItems = ref<any>([])
const editForm1 = ref<any>(null)
const editForm2 = ref<any>(null)
const editForm3 = ref<any>(null)
const editForm4 = ref<any>(null)
const pollutantUrl = ref('')
const locationListUrl = ref('')
const odorListUrl = ref('')
const nonPointListUrl = ref('')
const noiseFlag = ref(false)
const vibrationFlag = ref(false)
const searchParam = ref({
  useFlag: 'Y'
})
const pollutantItems = ref<codeMasterItem[]>([])
// 지정 악취
const OdorItems = ref<codeMasterItem[]>([])
// 비점 오염
const nonPointItems = ref<codeMasterItem[]>([])
const locationItems = ref<codeMasterItem[]>([])
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'IEPS_ETC_SELF_MEASURE',
  taskKey: ''
})

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => soilData.value.processCd,
  (newCd) => {
    const found = workplaceItems.value.find((item: any) => item.code === newCd)
    if (found) {
      soilData.value.processNo = found.processNo
      soilData.value.processName = found.processName
    }
  }
)

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
  detailUrl.value = selectConfig.env.soil.get.url
  workplaceListUrl.value = selectConfig.env.procWork.list.url

  insertUrl.value = transactionConfig.env.soil.insert.url
  updateUrl.value = transactionConfig.env.soil.update.url
  saveUrl.value = transactionConfig.env.soil.insert.url
  deleteUrl.value = transactionConfig.env.soil.delete.url
  pollutantUrl.value = selectConfig.env.soil.mst.pollutant.list.url
  locationListUrl.value = selectConfig.env.ieps.mst.location.list.url

  odorListUrl.value = selectConfig.env.ieps.mst.odor.list.url
  nonPointListUrl.value = selectConfig.env.ieps.mst.nonPoint.list.url
  // code setting

  // list setting
  getPollutantList()
  getOdorList()
  getNonPointList()
  getLocationList()
  // getWorkplaceList()
  getDetail()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envSoilPollutantMeasureResultId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.envSoilPollutantMeasureResultId),
      method: 'GET'
    }).then((_result: any) => {
      soilData.value = _result.data
      attachInfo.value.taskKey = props.popupParam.envSoilPollutantMeasureResultId
      updateMode.value = true
    })
  }
}
/******************************
 * TODO (목적): 지정 악취 조회
 *******************************/
function getOdorList() {
  $http({
    url: odorListUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    OdorItems.value = []
    _.forEach(_result.data, (item) => {
      OdorItems.value.push({
        code: item.envOdorPollutantMstId, // 저장용 ID
        codeName: item.envOdorPollutantMstName, // 드롭다운에 표시할 이름
        envOdorPollutantMstNo: item.envOdorPollutantMstNo,
        envOdorEmissionStandard: item.envOdorEmissionStandard
      })
    })
  })
}

/******************************
 * TODO (목적): 비점 조회  !!!!!!!!추가!!!!!!!
 *******************************/
function getNonPointList() {
  $http({
    url: nonPointListUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    nonPointItems.value = []
    _.forEach(_result.data, (item) => {
      nonPointItems.value.push({
        code: item.envNonpointPollutantMstId, // 저장용 ID
        codeName: item.envNonpointPollutantMstName, // 드롭다운에 표시할 이름
        envNonpointPollutantMstNo: item.envNonpointPollutantMstNo,
        envNonpointEmissionStandard: item.envNonpointEmissionStandard
      })
    })
  })
}

/******************************
 * TODO (목적): 위치 조회
 *******************************/
function getLocationList() {
  $http({
    url: locationListUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    locationItems.value = []
    _.forEach(_result.data, (item) => {
      locationItems.value.push({
        code: item.envMateriaLocationMstId, // 저장용 ID
        codeName: item.envMateriaLocationMstName // 드롭다운에 표시할 이름
      })
    })
  })
}

/******************************
 * TODO (목적): 측정물질명 조회
 *******************************/
function getPollutantList() {
  $http({
    url: pollutantUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    // 여기서 한 번만 찍기
    pollutantItems.value = []
    _.forEach(_result.data, (item) => {
      pollutantItems.value.push({
        code: item.envSoilPollutantMstId, // 저장용 ID
        codeName: item.envSoilPollutantMstName, // 드롭다운에 표시할 이름
        envSoilPollutantMstNo: item.envSoilPollutantMstNo, // 측정물질코드 (자동 입력용)
        soilPollutantUnitName: item.soilPollutantUnitName, // 1. 부가 정보 (단위)
        envSoilEmissionStandard: item.envSoilEmissionStandard // 2. 부가 정보 (허가배출기준 정보를 같이 쓰기 위해)
      })
    })
    //setHeader()
  })
}

// /******************************
//  * TODO (목적): 작업장 조회
//  *******************************/
// function getWorkplaceList() {
//   $http({
//     url: workplaceListUrl.value,
//     method: 'GET',
//     params: { workplaceFlag: 'Y', processTypeCd: 'EPT0000001' }
//   }).then((_result: any) => {
//     _.forEach(_result.data, (item) => {
//       workplaceItems.value.push({
//         code: item.processCd,
//         codeName: item.workplaceName,
//         processNo: item.processNo,
//         processName: item.processName
//       })
//     })
//   })
// }

function noiseOrVibration(_data: any) {
  if (_data.color === 'N') {
    noiseFlag.value = true
    vibrationFlag.value = false
    return
  }
  if (_data.color === 'V') {
    vibrationFlag.value = true
    noiseFlag.value = false
    return
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.envSoilPollutantMeasureResultId) {
    mappingType.value = 'PUT'
    soilData.value.chgUserId = user.value.userId
    saveUrl.value = updateUrl.value
  } else {
    mappingType.value = 'POST'
    soilData.value.regUserId = user.value.userId
    saveUrl.value = insertUrl.value
  }
  editForm1.value.validate().then((_result1: boolean) => {
    editForm2.value.validate().then((_result2: boolean) => {
      editForm3.value.validate().then((_result3: boolean) => {
        editForm4.value.validate().then((_result4: boolean) => {
          if (_result1 || _result2 || _result3 || _result4) {
            message.confirm({
              title: '확인',
              message: '저장하시겠습니까?',
              type: 'info', // success / info / warning / error
              confirmCallback: () => {
                isSave.value = !isSave.value
              },
              cancelCallback: () => {}
            })
          } else {
            message.alert({
              title: '안내',
              message: '복합압취, 특정토양오염, 소음진동, 기타 중 측정일시를 입력하세요.',
              type: 'error' // success / info / warning / error
            })
          }
        })
      })
    })
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.envSoilPollutantMeasureResultId = result.data
  attachInfo.value.taskKey = props.popupParam.envSoilPollutantMeasureResultId
  attachInfo.value.isSubmit = uid()
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.envSoilPollutantMeasureResultId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
function soilPollutantDataChange(_data: any) {
  const pollutant = pollutantItems.value.find((d) => d.code === _data.value)
  if (pollutant) {
    soilData.value.envSoilPollutantMstNo = pollutant.envSoilPollutantMstNo
    soilData.value.soilPollutantUnitName = pollutant.soilPollutantUnitName
    soilData.value.envSoilEmissionStandard = pollutant.envSoilEmissionStandard
  }
}
function odorDataChange(_data: any) {
  const odor = OdorItems.value.find((d) => d.code === _data.value)
  if (odor) {
    soilData.value.envOdorPollutantMstNo = odor.envOdorPollutantMstNo
    // soilData.value.soilPollutantUnitName = pollutant.soilPollutantUnitName
    soilData.value.envOdorEmissionStandard = odor.envOdorEmissionStandard
  }
}
function nonPointEmissionDataChange(_data: any) {
  const nonPoint = nonPointItems.value.find((d) => d.code === _data.value)
  if (nonPoint) {
    soilData.value.envNonpointPollutantMstNo = nonPoint.envNonpointPollutantMstNo
    // soilData.value.soilPollutantUnitName = pollutant.soilPollutantUnitName
    soilData.value.envNonpointEmissionStandard = nonPoint.envNonpointEmissionStandard
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
