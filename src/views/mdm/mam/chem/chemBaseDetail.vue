<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="chem"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <c-text
              :required="true"
              :disabled="disabled"
              :editable="editable"
              label="화학물질명(ENG)"
              name="chemNmEn"
              v-model:value="chem.chemNmEn"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <c-text
              :disabled="disabled"
              :editable="editable"
              label="화학물질명(KOR)"
              name="chemNmKr"
              v-model:value="chem.chemNmKr"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <c-text
              :required="true"
              :disabled="disabled"
              :editable="editable"
              label="CAS No."
              name="casNo"
              v-model:value="chem.casNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <c-text
              :editable="editable"
              label="화학식"
              name="molecularFormula"
              v-model:value="chem.molecularFormula"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <c-checkbox
              :editable="editable"
              :isFlag="true"
              label="규제물질 대상여부"
              name="regulFlag"
              v-model:value="chem.regulFlag"
            />
          </div> -->
        </template>
      </c-card>
    </q-form>
    <c-tab
      class="q-mt-sm"
      type="tabcard"
      align="left"
      :tabItems="tabItems"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :chem="chem"
          :popupParam="popupParam"
          :isOld="isOld"
          :contentHeight="contentHeight"
        />
      </template>
    </c-tab>
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
import { chemBaseColumnSettingType, chemBaseDetailLiteralType, chemBaseType } from './chemBase'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemBaseDetail'
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
const emits = defineEmits(['setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    mdmChemId: stringNull
  }
  contentHeight: string
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
      mdmChemId: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const chem = ref<chemBaseType>({
  mdmChemId: '', // 화학물질 일련번호
  casNo: '', // CAS No.
  chemNmEn: '', // 화학물질명(ENG)
  chemNmKr: '', // 화학물질명(KOR)
  nlId: '', // 뉴로라인즈 물질ID
  molecularFormula: '', // 화학식
  regulFlag: 'N', // 규제물질 대상여부
  nlRegDt: '', // 뉴로라인즈 생성일
  nlChgDt: '', // 뉴로라인즈 수정일
  propertiesStateCd: '', // 성상
  mttrid: '', // 산업안전보건공단 chemid
  deleteFlag: '', // 삭제여부
  regUserId: '', // 등록자
  chgUserId: '', // 수정자
  // 상세정보
  boilingPoint: '', // 끓는점-위험성평가용
  cmrFlag: 'N', // CMR 물질 여부-위험성평가용
  carcinogens: '', // 발암성물질
  mutagens: '', // 변이원성물질
  reproductiveToxins: '', // 생식독성물질
  maleficenceForm: null, // 유해성 발생형태-위험성평가용
  maleficenceValue: null, // 유해성 측정값-위험성평가용
  maleficenceGrade: null, // 비산성 등급-위험성평가용
  maleficenceType: null, // 비산/휘발성 구분-위험성평가용
  hrCodeGrade: null, // 위험문구/유해위험문구 등급-위험성평가용
  hcode: '', // 유해･위험문구-위험성평가용
  rcode: '', // 위험문구-위험성평가용
  restrictions: '', // 제한사항
  prohibited: '', // 금지사항
  accidentManuQuantity: '', // 사고대비물질_제조사용 지정수량(Kg)
  accidentStoreQuantity: '', // 사고대비물질_보관저장 지정수량(kg)
  exclusionConditions: '', // 제외조건내용
  exclusionConditionSign: null, // 제외조건_부등호
  exclusionConditionQuantity: '', // 제외조건_정량값
  exclusionConditionUnit: '', // 제외조건_단위
  prtrGroupId: '', // PRTR_Group_ID
  prtrMaterialName: '', // PRTR_물질명
  prtrSwcsWt: '', // PRTR_조사대상무게함유기준(wt%)
  prtrSwcsWtSign: null, // PRTR_조사대상무게함유기준_부등호
  prtrSwcsWtQuantity: null, // PRTR_조사대상무게함유기준_정량값
  prtrSwcsWtUnit: '', // PRTR_조사대상무게함유기준_단위
  prtrSwcsTon: '', // PRTR_조사대상취급량기준(톤/년)
  prtrSwcsTonSign: '', // PRTR_조사대상취급량기준_부등호
  prtrSwcsTonQuantity: '', // PRTR_조사대상취급량기준_정량값
  prtrSwcsTonUnit: '', // PRTR_조사대상취급량기준_단위
  remark1: '', // 고시내용 외 참조내용 입력(예, CMR, PBT 등)
  dangerousContents: '', // 위험물내용
  dangerousClass: '', // 위험물유별구분
  dangerousProp: '', // 위험물성질
  dangerousName: '', // 위험물품명
  designatedQuantityDose: '', // 지정수량_정량값
  designatedQuantityUnit: '', // 지정수량_단위
  psmAmount: '', // 공정안전관리 제조∙취급∙저장량(kg/일)
  bei: '', // 생물학적노출기준(단위포함 Full text)
  sensitization: '', // 과민성 여부 입력(고용노동부, ACGIH 등)
  simpleAsphyxiants: '', // 질식제 여부 입력(ACGIH, EU 노출기준 등)
  skinNotations: '', // 피부영향 여부 입력(고용노동부, ACGIH 등)
  basisCriticalEffects: '', // 표적장기 입력(예, 간, 신장 등)
  twaPpm: '', // TWA 노출기준입력 ppm
  twaMm: '', // TWA 노출기준입력 mg/m3
  stelPpm: '', // STEL 노출기준입력 ppm
  stelMm: '', // STEL 노출기준입력 mg/m3
  ceilingsPpm: '', // Celling 노출기준입력 ppm
  ceilingsMm: '', // Celling 노출기준입력 mg/m3
  lelPpm: '', // LEL노출기준입력 ppm
  lelMm: '', // LEL노출기준입력 mg/m3
  remark2: '', // 적용기준, 고시내용 외 추가 참조사항 입력
  remark3: '', // 기타 참조사항
  reguls: [], // 평가자
  deleteReguls: [], // [삭제]평가자
  columnSetting: {} as chemBaseColumnSettingType
})
const tab = ref('regul')
const tabItems = ref([
  {
    name: 'regul',
    icon: 'schema',
    label: '규제',
    component: shallowRef(defineAsyncComponent(() => import(`./chemBaseRegul.vue`)))
  },
  {
    name: 'detail',
    icon: 'settings_suggest',
    label: '화학물질 상세정보',
    component: shallowRef(defineAsyncComponent(() => import(`./chemBaseDetailInfo.vue`)))
  }
])
const isSave = ref(false)
const detailUrl = ref('')
const detailColumnSettingUrl = ref('')
const validUrl = ref('')
const saveUrl = ref('')
const mappingType = ref('PUT')
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.mdmChemId))
/**
 * 뉴로라인즈에서 받는 정보인 경우 다음 항목 비활성화
 *
 *  CAS No. (규제 DB 업로드 시에 키처럼 비교함으로)
 * 명칭 (뉴로라인즈에서 키처럼 사용 중임으로)
 */
const disabled = computed(() => Boolean(chem.value.nlId))
const tabHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 150
      : 500
  if (height < 500) {
    height = 500
  }
  return `${String(height)}px`
})

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
  detailUrl.value = selectConfig.chm.base.chemBase.get.url
  detailColumnSettingUrl.value = selectConfig.chm.base.chemBaseColumnSetting.get.url
  validUrl.value = selectConfig.chm.base.chemBase.valid.url
  saveUrl.value = transactionConfig.chm.base.chemBase.update.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 화학물질 상세 조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.mdmChemId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(chem.value, _result.data)
      for (const key in chem.value) {
        const disabledColumnKey = key as chemBaseDetailLiteralType
        chem.value[`${disabledColumnKey}Disabled`] =
          chem.value.columnSetting[disabledColumnKey] === 'Y' ? true : false
      }

      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
    })
  } else {
    // column setting info get
    $http({
      url: detailColumnSettingUrl.value,
      method: 'GET'
    }).then((_result: any) => {
      _.extend(chem.value.columnSetting, _result.data)
      for (const key in chem.value) {
        const disabledColumnKey = key as chemBaseDetailLiteralType
        chem.value[`${disabledColumnKey}Disabled`] =
          chem.value.columnSetting[disabledColumnKey] === 'Y' ? true : false
      }
    })
  }
}
/******************************
 * TODO (목적): 화학물질 저장 전 처리
 *******************************/
function saveInfo() {
  if (isOld.value) {
    saveUrl.value = transactionConfig.chm.base.chemBase.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.chm.base.chemBase.insert.url
    mappingType.value = 'POST'
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: validUrl.value,
        method: 'GET',
        params: {
          mdmChemId: props.popupParam.mdmChemId,
          casNo: chem.value.casNo
        }
      }).then((_result: any) => {
        if (_result.data === 0) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',

            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              chem.value.regUserId = user.value.userId
              chem.value.chgUserId = user.value.userId

              isSave.value = !isSave.value
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '입력한 CAS No.를 가진 화학물질이 이미 등록되어있습니다.', // 입력한 CAS No.를 가진 화학물질이 이미 등록되어있습니다.
            type: 'warning' // success / info / warning / error
          })
        }
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 화학물질 저장 후 처리
 * @param (1): API 서버 반환 값
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.mdmChemId = result.data
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
