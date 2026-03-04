<template>
  <div class="row">
    <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
      <c-card title="법규별 규제사항" class="cardClassDetailForm">
        <template v-slot:card-description>
          <span style="color: tomato; margin-left: 10px">
            {{
              '주황색 테두리로 강조된 규제 항목은 사용자가 직접 확인을 하여 체크를 하셔야 합니다.'
            }}
          </span>
        </template>
        <template v-slot:card-button>
          <q-btn-group outline v-if="editable && !disabled">
            <!-- <c-btn
            label="검증"
            icon="auto_fix_high"
            @btnClicked="verification"
          /> -->
            <c-btn
              v-if="editable"
              label="규제항목 기준값 조회"
              icon="help"
              @btnClicked="openChemQuantity"
            />
            <c-btn
              :url="saveUrl"
              :isSubmit="isSave"
              :param="saveData"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-12 chemLawRegulCheckbox" v-for="(item, idx) in review.bills" :key="idx">
            <div class="chemLawRegulBillDiv">{{ item.regulationBillName }}</div>
            <q-checkbox
              v-for="(regul, _idx) in item.reguls"
              :key="_idx"
              dense
              class="customqcbox"
              color="orange-custom"
              true-value="Y"
              false-value="N"
              :disable="!editable || disabled"
              :label="regul.regulatedItemName"
              v-model="regul.val"
              :class="{
                'highlight-checkbox': highlightCodes.includes(regul.regulatedItemCd)
              }"
            />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
      <c-card title="규제 선택 참고사항" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="cardContents">
            <ul>
              <li>
                <div class="law-title">1. 산업안전보건법</div>
                <div class="law-desc">
                  📌 <b>[작업자노출기준], [허용기준 설정 대상 유해인자]</b>는 규제 항목이 존재한다면
                  규제 대상으로 간주됩니다. <br />
                  📌 구성물질 정보/규제 탭에서 노출기준(TWA와 STEL)을 확인할 수 있습니다.
                </div>
              </li>
              <li>
                <div class="law-title">2. 화학물질관리법</div>
                <div class="law-desc">
                  📌 <b>[배출량대상화학물질]</b>은 규제 항목이 존재한다면 규제 대상으로 간주됩니다.
                  <br />
                  📌 <b>[PRTR1그룹]</b>과 <b>[PRTR2그룹]</b>은 그룹 구분과 PRTR 정량값에 따라 자동
                  체크됩니다.
                </div>
              </li>
              <li>
                <div class="law-title">5. 위험물안전관리법</div>
                <div class="law-desc">
                  📌 <b>[제1류 ~ 제6류]</b>는 지정수량 기준값에 따라 자동 체크됩니다. <br />
                  📌 특히 <b>[제4류, 제5류]</b>는 위험물 품명에 따라 수용성/비수용성 여부까지
                  포함하여 자동 계산됩니다. <br />
                  📌 단, 위험물 품명이 "(수용성여부 자료없음)"으로 표시된 경우에는 기준값이 복수로
                  산정되므로, 수동으로 체크해주시기 바랍니다.
                </div>
              </li>
              <li>
                <div class="law-title">※ 주의사항</div>
                <div class="law-desc">
                  📌 <b>[고압가스안전관리법의 규제항목들]</b>과 <b>[CMR등록물질]</b>은 정량값이
                  명시되지 않은 경우에도 규제 항목이 존재한다면 규제 대상으로 간주됩니다.
                </div>
              </li>
              <li>
                <div class="law-title">※ 기타</div>
                <div class="law-desc">
                  📌 나머지 규제 항목은 적용 기준의 정량값과 화학물질의 함유량을 기준으로 자동
                  계산됩니다.
                </div>
              </li>
            </ul>
          </div>
        </template>
      </c-card>
    </div>
    <c-dialog :param="popupOptions" />
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
import { chemReviewRegulationType, chemReviewType } from './chemReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemReviewLaw'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
// const emits = defineEmits(['getDetailInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    mdmChemReviewId: stringNull
  }
  review: chemReviewType
  disabled: boolean
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
      mdmChemReviewId: ''
    }
  },
  review: () => {
    return {
      mdmChemReviewId: '', // 사전검토 일련번호
      reviewRequestDate: '', // 검토요청일
      plantCds: '', // 사업장코드
      materialCd: '', // 화학자재번호
      materialName: '', // 자재명(KOR)
      materialNameEn: '', // 자재명(ENG)
      deliveryVendorCd: null, // 납품업체 코드
      deliveryVendorName: '', // 납품업체명
      mfgVendorCd: null, // 제조업체 코드
      mfgVendorName: '', // 제조업체명
      mdmChemReviewStepCd: null, // 사전검토 진행상태
      propertiesStateCd: null, // 성상-공통코드
      fugacity: '', // 비산성(고체)
      boilPoint: '', // 끊는점(액체,기체)
      meltingPoint: '', // 녹는점
      moleWeight: '', // 분자량
      usageCd: null, // 용도-회사별 공통코드
      usageEtc: '', // 용도 기타
      hsNo: '', // HS번호
      specificGravity: '', // 비중
      casNo: '', // CAS No.
      serialNo: '', // 고유번호(유독물번호or고시번호)
      keNo: '', // KE 번호
      psmFlag: 'N', // PSM 대상 여부
      mixFlag: 'N', // 물질구성(단일 N/혼합 Y)
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
      returnRemark: '', // 반려사유
      returnFlag: '', // 반려여부
      chemSubsControlFlag: '', // 화평법 등록여부
      chemAuthFlag: '', // 화학물질확인증명 여부
      chemLicenseFlag: '', // 유해화학물질 인허가 여부
      chemReportFlag: '', // 유해화학물질 신고여부
      msdsFlag: '', // MSDS제출/비공개 승인여부
      msdsNo: '', // MSDS번호
      materialCount: '',
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      subs: [],
      subsRegul: [],
      prodReguls: [],
      bills: [],
      checks: []
    }
  },
  disabled: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const saveData = ref({
  mdmChemReviewId: '',
  prodReguls: [] as Array<chemReviewRegulationType>
})
const isSave = ref(false)
const listUrl = ref('')
const calUrl = ref('')
const saveUrl = ref('')
const highlightCodes = [
  // 'D12010003.001',
  // 'D14010006',
  'D14010005',
  'D14010004'
  // 'D14010003',
  // 'D14010002',
  // 'D14010001',
  // 'D12010008'
]
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
  listUrl.value = selectConfig.mdm.mam.review.regul.list.url
  calUrl.value = selectConfig.mdm.mam.review.regul.calcul.url
  saveUrl.value = transactionConfig.mdm.mam.review.regul.save.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 규제사항 저장 후 화학자재에 따른 적용 규제항목 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      mdmChemReviewId: props.popupParam.mdmChemReviewId
    }
  }).then((_result: any) => {
    props.review.prodReguls = _result.data

    props.review.bills = []
    if (props.review.prodReguls && props.review.prodReguls.length > 0) {
      props.review.bills = _.map(props.review.prodReguls, (value) => {
        return {
          regulationBillCd: value['regulationBillCd'],
          regulationBillName: value['regulationBillName'],
          reguls: []
        }
      })
      props.review.bills = _.uniqBy(props.review.bills, (item) => {
        return item.regulationBillCd
      })
      _.forEach(props.review.bills, (bill) => {
        bill.reguls = _.filter(props.review.prodReguls, {
          regulationBillCd: bill.regulationBillCd
        })
      })
    }
  })
}
/******************************
 * TODO (목적): 규제검증 팝업 표시
 *******************************/
// function verification() {
//   popupOptions.value.title = '규제검증'
//   popupOptions.value.param = {
//     mdmChemReviewId: props.popupParam.mdmChemReviewId
//   }
//   popupOptions.value.target = shallowRef(
//     defineAsyncComponent(() => import(`./chemReviewVerification.vue`))
//   )
//   popupOptions.value.visible = true
//   popupOptions.value.closeCallback = closePopup
// }
/******************************
 * TODO (목적): 규제검증 팝업 닫기
 *******************************/
// function closePopup() {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   emits('getDetailInfo')
// }
/******************************
 * TODO (목적): 규제 저장 전 처리
 *******************************/
function saveInfo() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      saveData.value.mdmChemReviewId = props.popupParam.mdmChemReviewId
      saveData.value.prodReguls = _.filter(props.review.prodReguls, { val: 'Y' })

      isSave.value = !isSave.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 규제 저장 후 처리
 *******************************/
function saveCallback() {
  message.requestSuccess()
  saveData.value = {
    mdmChemReviewId: '',
    prodReguls: []
  }
  getList()
}
/******************************
 * TODO (목적): 규제항목 기준값 조회 검증 팝업 표시
 *******************************/
function openChemQuantity() {
  popupOptions.value.title = '규제항목 기준값 조회'
  popupOptions.value.param = {
    mdmChemReviewId: props.popupParam.mdmChemReviewId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./chemReviewQuantity.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<style lang="css">
.cardContents {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fefefe;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: #333;
  font-size: 16px;
  line-height: 1.7;
}

.cardContents ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.cardContents li {
  background: #f5f8fa;
  border-left: 5px solid #3498db;
  padding: 13px;
  margin-bottom: 12px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.cardContents li:hover {
  background: #eaf2f8;
}

.cardContents li::before {
  font-size: 18px;
}

.law-title {
  font-weight: bold;
  font-size: 17px;
  color: #2c3e50;
  margin-bottom: 5px;
}

.law-desc {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
}

.highlight-checkbox {
  border: 2px solid tomato !important;
  border-radius: 6px;
  padding: 4px 4px;
  background-color: #fffdf5;
}

.customqcbox {
  margin-right: 5px;
}
</style>
