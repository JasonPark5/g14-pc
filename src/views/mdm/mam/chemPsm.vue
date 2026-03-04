<template>
  <div>
    <q-form ref="editForm">
      <c-card class="cardClassDetailInfo" :noHeader="true">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-label-text title="화학자재명" :value="chemData.mdmChemMaterialName" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-label-text title="화학자재번호" :value="chemData.mdmChemMaterialCd" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-label-text title="MSDS No." :value="chemData.msdsNo" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-label-text title="고유번호" :value="chemData.serialNo" />
          </div>
        </template>
      </c-card>
      <c-card title="유해화학물질(PSM) 정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <q-icon
              name="help"
              style="font-size: 20px; margin-right: 10px"
              class="custom-btn text-primary"
            >
              <q-tooltip anchor="bottom left" self="top left">
                <div class="tooltipCustomTop">
                  {{ $language('(주)') }}
                </div>
                <div class="tooltipCustom">
                  ①
                  {{
                    $language(
                      '유해․위험물질은 제출대상 설비에서 제조 또는 취급하는 모든 화학물질을 기재합니다.'
                    )
                  }}<br />
                  ② {{ $language('증기압은 상온에서의 증기압을 말합니다.') }}<br />
                  ③ {{ $language('부식성 유무는 있으면 ○, 없으면 ×로 표시합니다.') }}<br />
                  ④
                  {{
                    $language(
                      '이상반응 여부는 그 물질과 이상반응을 일으키는 물질과 그 조건(금수성 등)을 표시하고 필요시 별도로 작성합니다.'
                    )
                  }}<br />
                  ⑤ {{ $language('노출기준에는 시간가중평균노출기준(TWA)을 기재합니다.') }}<br />
                  ⑥
                  {{
                    $language(
                      '독성치에는 LD50(경구, 쥐), LD50(경피, 쥐 또는 토끼) 또는 LC50(흡입, 4시간 쥐)을 기재합니다.'
                    )
                  }}
                </div>
              </q-tooltip>
            </q-icon>
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="psmData"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveHazard"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              type="text"
              suffix="%"
              label="폭발한계상한(%)"
              name="explUpLimit"
              v-model:value="psmData.explUpLimit"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              type="text"
              suffix="%"
              label="폭발한계하한(%)"
              name="explLowLimit"
              v-model:value="psmData.explLowLimit"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              type="text"
              suffix="℃"
              label="인화점(℃)"
              name="flashingPoint"
              v-model:value="psmData.flashingPoint"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              type="text"
              suffix="℃"
              label="발화점(℃)"
              name="ignitionPoint"
              v-model:value="psmData.ignitionPoint"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
            <c-textarea
              :counter="true"
              :maxlength="500"
              :editable="editable"
              :rows="3"
              label="노출기준"
              name="exposureLimit"
              v-model:value="psmData.exposureLimit"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
            <c-textarea
              :counter="true"
              :maxlength="500"
              :editable="editable"
              :rows="3"
              label="독성치"
              name="toxicValue"
              v-model:value="psmData.toxicValue"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              type="text"
              suffix="mmHg"
              label="증기압(20℃,mmHg)"
              name="vaporPressure"
              v-model:value="psmData.vaporPressure"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              type="text"
              suffix="Nm/kg"
              label="일일취급량(kg)"
              name="dailyUsage"
              v-model:value="psmData.dailyUsage"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              type="text"
              suffix="Nm/kg"
              label="저장량(kg)"
              name="stockage"
              v-model:value="psmData.stockage"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-dept
              :editable="editable"
              type="edit"
              label="관리부서"
              name="deptCd"
              v-model:value="psmData.deptCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
            <c-textarea
              :editable="editable"
              :counter="true"
              :maxlength="500"
              :rows="3"
              label="이상반응유무"
              name="extraReaction"
              v-model:value="psmData.extraReaction"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 mb-2">
            <c-textarea
              :editable="editable"
              :counter="true"
              :maxlength="500"
              :rows="3"
              label="부식성유무"
              name="corrosivenessFlag"
              v-model:value="psmData.corrosivenessFlag"
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

import { chemMaterialType } from './chemMaterial'

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
  name: 'chemPsm'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
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
interface propType {
  popupParam: {
    mdmChemMaterialId: string
    tabName: stringNull
    subtabName: stringNull
    plantCd: stringNull
  }
  chemData: chemMaterialType
  contentHeight: stringNull
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
      mdmChemMaterialId: '',
      tabName: '',
      subtabName: '',
      plantCd: null
    }
  },
  chemData: () => {
    return {
      plantCd: null, // 사업장코드
      plantName: '', // 사업장
      mdmChemMaterialId: '', // 화학자재 일련번호
      mdmChemMaterialCd: '', // 화학자재번호
      mdmChemMaterialName: '', // 화학자재 품명
      mdmChemReviewId: '', // 사전검토 일련번호
      deliveryVendorCd: '', // 납품업체 코드
      mfgVendorCd: '', // 제조업체 코드
      psmFlag: 'N', // PSM 대상 여부
      usageCd: null, // 용도-회사별 공통코드
      usageEtc: '', // 용도 기타
      msdsNo: '', // MSDS번호
      casNo: '', // MSDS번호
      inUnitCd: null, // 입고단위
      inConversonFactor: '', // 입고 환산계수
      inConversonUnitCd: null, // 입고 환산단위
      specificGravity: '', // 비중
      propertiesStateCd: null, // 성상
      freezingPoint: '', // 어는점
      boilPoint: '', // 끓는점
      flashPoint: '', // 인화점
      firePoint: '', // 발화점
      licensingFlag: 'N', // 인허가대상 물질 여부 Y/N
      dangerFlag: 'N', // 위험물 여부Y/N
      makeFlag: 'N', // 제품분류(제조)
      impFlag: 'N', // 제품분류(수입)
      buyFlag: 'N', // 제품분류(구매)
      usingFlag: 'N', // 제품분류(사용)
      expFlag: 'N', // 제품분류(수출)
      salesFlag: 'N', // 제품분류(판매)
      toxicPoisonFlag: 'N', // 유해화학물질포함여부(유독물질)
      toxicPermitFlag: 'N', // 유해화학물질포함여부(허가물질)
      toxicLimitFlag: 'N', // 유해화학물질포함여부(제한물질)
      toxicProhibitFlag: 'N', // 유해화학물질포함여부(금지물질)
      remarks: '', // 비고
      useFlag: 'Y', // 사용여부
      unusedReason: '', // 미사용사유
      preMdmChemMaterialId: '', // 이전화학자재 일련번호
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      depts: '', // 사용반
      revisionNum: '',
      groupId: '',
      sysRevision: 1,
      revisionContent: '제정',
      productCategoryCd: null, // 제품구분
      keepFacilityFlag: 'N', // 보관시설 유무
      maxKeepAmount: '', // 최대보관량
      storageFacilityFlag: 'N', // 저장시설 유무
      maxStorageAmount: '', // 최대저장량
      manufacturingFacilitiesFlag: 'N', // 제조 사용시설 여부
      nanoManufacturingFlag: 'N', // 나노물질 제조 여부
      nanoIncomeFlag: 'N', // 나노물질 수입 여부
      nanoNoneApplicableFlag: 'N', // 나노물질 해당없음 여부
      nanoUnknownFlag: 'N', // 나노물질 모름 여부
      inputDissolutionTank: '', // 투입 용해조
      productManufClassCd: null, // 제품제조구분 코드
      chemIngredientsCd: null, // 구성성분 작성근거
      mixFlag: 'N', // 물질구성(단일 N/혼합 Y)
      serialNo: '', // 고유번호(유독물번호or고시번호)
      fugacity: '', // 비산성(고체)
      keNo: '', // KE 번호
      hsNo: '', // HS번호
      meltingPoint: '', // 녹는점
      moleWeight: '', // 분자량
      mdmChemMaterialMsdsId: '', // MSDS key
      msdsRegDtStr: '', // MSDS 개정일시
      msdsRegUserName: '' // MSDS 개정자
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
const editable = ref(true)
const saveUrl = ref('')
const detailUrl = ref('')
const mappingType = ref('POST')
const isSave = ref(false)
const psmData = ref({
  psiHazardMaterialId: '', // 유해위험물질 일련번호
  mdmChemMaterialId: '', // 화학자재 일련번호
  plantCd: '', // 사업장코드
  deptCd: '', // 관리부서
  explUpLimit: '', // 폭발한계상한(vol%)
  explLowLimit: '', // 폭발한계하한(vol%)
  flashingPoint: '', // 인하점(℃)
  ignitionPoint: '', // 발화점(℃)
  vaporPressure: '', // 증기압(20℃)
  extraReaction: '', // 이상반응유무(내용기술)
  corrosivenessFlag: '', // 부식성유무
  dailyUsage: '', // 일 사용량
  stockage: '', // 저장량
  remarks: '', // 비고
  exposureLimit: '', // 노출기준TWA
  toxicValue: '', // 독성치
  regUserId: '',
  chgUserId: ''
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
  detailUrl.value = selectConfig.mdm.mam.chem.hazard.url
  saveUrl.value = transactionConfig.mdm.mam.chem.hazard.insert.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): PSM 정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.mdmChemMaterialId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        mdmChemMaterialId: props.popupParam.mdmChemMaterialId,
        plantCd: props.popupParam.plantCd
      }
    }).then((_result: any) => {
      if (_result.data.psiHazardMaterialId) {
        _.extend(psmData.value, _result.data)
      } else {
        psmData.value = {
          psiHazardMaterialId: '', // 유해위험물질 일련번호
          mdmChemMaterialId: props.popupParam.mdmChemMaterialId, // 화학자재 일련번호
          plantCd: props.popupParam.plantCd, // 사업장코드
          deptCd: '', // 관리부서
          explUpLimit: '', // 폭발한계상한(vol%)
          explLowLimit: '', // 폭발한계하한(vol%)
          flashingPoint: '', // 인하점(℃)
          ignitionPoint: '', // 발화점(℃)
          vaporPressure: '', // 증기압(20℃)
          extraReaction: '', // 이상반응유무(내용기술)
          corrosivenessFlag: '', // 부식성유무
          dailyUsage: '', // 일 사용량
          stockage: '', // 저장량
          remarks: '', // 비고
          exposureLimit: '', // 노출기준TWA
          toxicValue: '', // 독성치
          regUserId: user.value.userId,
          chgUserId: ''
        }
      }
    })
  }
}
/******************************
 * TODO (목적): PSM 저장 전 처리
 *******************************/
function saveHazard() {
  if (psmData.value.psiHazardMaterialId) {
    mappingType.value = 'PUT'
  } else {
    mappingType.value = 'POST'
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          psmData.value.regUserId = user.value.userId
          psmData.value.chgUserId = user.value.userId

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
 * TODO (목적): PSM 저장 후 처리
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
