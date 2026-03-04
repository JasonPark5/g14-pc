<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="공정사고 기본정보" class="cardClassDetailInfo">
          <template v-slot:card-detail>
            <div class="col-3">
              <c-label-text title="사고번호" :value="standardInfo.accidentNo" />
            </div>
            <div class="col-3">
              <c-label-text title="사고명" :value="standardInfo.accidentName" />
            </div>
            <div class="col-3">
              <c-label-text title="사고종류" :value="standardInfo.accidentKindName" />
            </div>
            <div class="col-3">
              <c-label-text title="사고등급" :value="standardInfo.accidentGradeName" />
            </div>
            <div class="col-3">
              <c-label-text title="발생일시" :value="standardInfo.occurrenceDate" />
            </div>
            <div class="col-3">
              <c-label-text title="발생부서" :value="standardInfo.occurrenceDeptName" />
            </div>
            <div class="col-3">
              <c-label-text title="발생형태 대분류" :value="standardInfo.occurrenceModeLargeName" />
            </div>
            <div class="col-3">
              <c-label-text title="발생형태 중분류" :value="standardInfo.occurrenceModeSmallName" />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card class="" title="공정사고보고서 정보">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                :label="'[' + $language(standardInfo.reportName) + '] ' + $language('출력')"
                icon="print"
                @btnClicked="accidentPrint1"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary">{{
                    $language('1. 일반사항')
                  }}</q-item-label>
                  <br />
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '사업장 : ' }} {{ standardInfo.plantName }}</q-item-label
                  >
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '사고발생일시 : ' }}
                    {{ standardInfo.occurrenceDate }}</q-item-label
                  >
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '사고발생장소 : ' }}
                    {{ standardInfo.occurrenceLocation }}</q-item-label
                  >
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '사고조사기간 : ' }}
                    {{ standardInfo.investigationDate }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary">{{
                    $language('2. 공정사고의 형태')
                  }}</q-item-label>
                  <q-item-label>
                    <!-- :disabled="true" -->
                    <c-multi-select
                      codeGroupCd="IIM_KIND_CD"
                      :editable="editable"
                      :isArray="false"
                      :disabled="true"
                      itemText="codeName"
                      itemValue="code"
                      maxValues="3"
                      label=""
                      name="accidentKindCd"
                      v-model:value="standardInfo.accidentKindCd"
                    />
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary">{{
                    $language('3. 공정사고의 상황개요')
                  }}</q-item-label>
                  <br />
                  <q-item-label
                    v-for="(item, index) in overviewAccidentSituations"
                    :key="index"
                    class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ item }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary">{{
                    $language('4. 공정사고의 발생원인')
                  }}</q-item-label>
                  <br />
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '직접원인 : ' }}
                    {{ standardInfo.directCause }}</q-item-label
                  >
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '간접원인 : ' }}
                    {{ standardInfo.indirectCause }}</q-item-label
                  >
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '기인물 : ' }} {{ standardInfo.openning }}</q-item-label
                  >
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '가해물 : ' }} {{ standardInfo.injurious }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary">{{
                    $language('5. 사고피해')
                  }}</q-item-label>
                  <br />
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '물적피해내역 : ' }}
                    {{ standardInfo.materialDamageHistory }}</q-item-label
                  >
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp;{{ '인적피해내역 : ' }}
                    {{ standardInfo.humanDamageHistory }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary">{{
                    $language('6. 긴급조치사항')
                  }}</q-item-label>
                  <br />
                  <q-item-label class="text-body2 text-grey-9"
                    >&nbsp;&nbsp;&nbsp; {{ standardInfo.emergencyMeasures }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary">{{
                    $language('7. 공정사고 재발장지를 위한 장·단기 대책')
                  }}</q-item-label>
                  <br />
                  <q-item-label class="text-body2 text-grey-9">
                    <span class="cursor-pointer"
                      >&nbsp;&nbsp;&nbsp;{{ '단기 대책 : ' }} {{ standardInfo.shortPlan }}</span
                    >
                  </q-item-label>
                  <q-item-label class="text-body2 text-grey-9">
                    <span class="cursor-pointer"
                      >&nbsp;&nbsp;&nbsp;{{ '중장기 대책 : ' }} {{ standardInfo.longPlan }}</span
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator spaced inset />
              <q-item>
                <q-item-section>
                  <q-item-label class="q-mt-xs text-body2 text-weight-bold text-primary">{{
                    $language('8. 담당자 의견')
                  }}</q-item-label>
                  <br />
                  <q-item-label class="text-body2 text-grey-9">
                    <span class="cursor-pointer"
                      >&nbsp;&nbsp;&nbsp;{{ standardInfo.managerOpinion }}</span
                    >
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced inset />
            </div>
          </template>
        </c-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { processAccidentPopupParamType } from './processAccident'

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
  name: 'processAccidentReport'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  param: processAccidentPopupParamType
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
      iimAccidentId: '',
      stepCd: ''
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
const standardInfo = ref<any>({
  iimAccidentId: '',
  accidentTypeCd: '',
  plantCd: '',
  processCd: '',
  processName: '',
  accidentNo: '',
  accidentName: '',
  accidentStatusCd: '',
  reportUserId: '',
  reportDate: '',
  accidentKindCd: '',
  accidentGradeCd: null,
  occurrenceDate: '',
  occurrenceDeptCd: '',
  occurrenceLocation: '',
  weather: '',
  emergencyMeasures: '',
  overviewAccidentSituation: '',
  occurrenceModeLargeCd: null,
  occurrenceModeSmallCd: null,
  humanDamage: '',
  directCause: '',
  indirectCause: '',
  openning: '',
  injurious: '',
  materialDamageHistory: '',
  humanDamageHistory: '',
  toxicFlag: 'N'
})
const overviewAccidentSituations = ref([])
const getUrl = ref('')
const printUrl = ref('')
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
  getUrl.value = selectConfig.sop.iim.accident.report.get.url
  printUrl.value = selectConfig.sop.iim.accident.report.print.url
  // code setting
  // list setting
  getStdInfo()
}
/******************************
 * TODO (목적): 기본정보 조회
 *******************************/
function getStdInfo() {
  if (props.param.iimAccidentId) {
    $http({
      url: $format(getUrl.value, props.param.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      standardInfo.value = _result.data

      if (standardInfo.value.overviewAccidentSituation) {
        overviewAccidentSituations.value = standardInfo.value.overviewAccidentSituation.split('\n')
      }
    })
  }
}
/******************************
 * TODO (목적): 공정보고서 출력
 *******************************/
function accidentPrint1() {
  $http({
    url: $format(printUrl.value, props.param.iimAccidentId),
    method: 'GET'
  }).then((_result: any) => {
    const fileOrgNm =
      '[' + standardInfo.value.reportName + '] ' + standardInfo.value.accidentName + '.docx'
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
