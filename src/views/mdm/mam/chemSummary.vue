<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-card
            :title="'1. ' + $language('일반정보') + ' - ' + data.mdmChemMaterialName"
            class="cardClassDetailForm"
          >
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- <c-btn 
                  v-if="data.mdmChemMaterialId && editable"
                  label="출력" 
                  icon="print"
                  @btnClicked="printChem" /> -->
                <!-- <c-btn v-if="data.mdmChemMaterialId && editable" label="삭제" :editable="editable" icon="delete_forever" @btnClicked="removeData" /> -->
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="data"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <c-text :editable="false" label="CAS No." name="casNo" v-model:value="data.casNo" />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <c-text
                  :editable="false"
                  label="어는점"
                  suffix="℃"
                  name="freezingPoint"
                  v-model:value="data.freezingPoint"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <c-text
                  :editable="false"
                  label="끓는점"
                  suffix="℃"
                  name="boilPoint"
                  v-model:value="data.boilPoint"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                <c-text
                  :editable="false"
                  label="인화점"
                  suffix="℃"
                  name="flashPoint"
                  v-model:value="data.flashPoint"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-textarea
                  :editable="editable"
                  label="주요용도"
                  name="mainUse"
                  :rows="2"
                  v-model:value="data.mainUse"
                />
              </div>
            </template>
          </c-card>
          <c-table
            ref="table"
            title="2. 물질정보"
            :columns="grid.columns"
            :data="data.chems"
            :isFullScreen="false"
            :columnSetting="false"
            :filtering="false"
            :gridHeightAuto="true"
            :usePaging="false"
            :isExcelDown="false"
          />
          <c-card title="3. 그림문자" class="cardClassDetailForm msdsc pmsds" :collapsed="true">
            <template v-slot:card-detail>
              <span
                v-for="(item, index) in data.pics"
                :key="index"
                class="chemGhsResultPicContainer"
                style="display: inline-table; margin-right: 30px; text-align: center"
              >
                <template v-if="item.pic !== '해당없음'">
                  <q-img
                    :src="getSrc(item.pic)"
                    style="width: 80px"
                    class="cursor-pointer"
                    @click="
                      () => {
                        item.chk = item.chk === 'Y' ? 'N' : 'Y'
                      }
                    "
                  />
                  <q-checkbox
                    class="chemGhsResultPicCheckbox"
                    color="red"
                    true-value="Y"
                    false-value="N"
                    :label="item.attrVal1"
                    v-model="item.chk"
                  />
                </template>
              </span>
            </template>
          </c-card>
          <c-card title="4. 유해위험 문구" class="cardClassDetailForm msdsc" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-textarea
                  :editable="editable"
                  label=""
                  noLabel
                  name="hcodeResult"
                  autogrow
                  v-model:value="data.hcodeResult"
                />
              </div>
            </template>
          </c-card>
          <c-card title="5. 응급조치요령" class="cardClassDetailForm" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="가. 눈에 들어갔을 때"
                  name="fourFirst"
                  autogrow
                  v-model:value="data.fiveFirst"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="나. 피부에 접촉했을 때"
                  name="fiveSecond"
                  autogrow
                  v-model:value="data.fiveSecond"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="다. 흡입했을 때"
                  name="fiveThird"
                  autogrow
                  v-model:value="data.fiveThird"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="라. 먹었을 때"
                  name="fiveFourth"
                  autogrow
                  v-model:value="data.fiveFourth"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-textarea
                  :editable="editable"
                  label="마. 기타"
                  name="fiveFive"
                  autogrow
                  v-model:value="data.fiveFive"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-card title="6. 저장방법" class="cardClassDetailForm" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-textarea
                  :editable="editable"
                  label=""
                  name="sixTxt"
                  noLabel
                  autogrow
                  v-model:value="data.sixTxt"
                />
              </div>
            </template>
          </c-card>
          <c-card
            title="7. 피해야 할 조건 및 물질"
            class="cardClassDetailForm msdsc"
            :collapsed="true"
          >
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-text
                  :editable="editable"
                  label="피해야 할 조건"
                  name="sevenFirst"
                  v-model:value="data.sevenFirst"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-text
                  :editable="editable"
                  label="피해야 할 물질"
                  name="sevenSecond"
                  v-model:value="data.sevenSecond"
                />
              </div>
            </template>
          </c-card>
          <c-card
            title="8. 누출 및 폭발·화재 사고시 대처방법"
            class="cardClassDetailForm msdsc"
            :collapsed="true"
          >
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-textarea
                  :editable="editable"
                  label="누출"
                  name="eightTxt"
                  autogrow
                  v-model:value="data.eightTxt"
                />
              </div>
            </template>
          </c-card>
          <c-table
            ref="table2"
            title="9. 법적규제현황"
            :columns="grid2.columns"
            :data="data.reguls"
            :isFullScreen="false"
            :columnSetting="false"
            :filtering="false"
            :gridHeightAuto="true"
            :usePaging="false"
            :hideBottom="true"
            :isExcelDown="false"
            :hideHeader="true"
            :merge="grid2.merge"
          />
          <c-card title="10. 취급시 주의사항" class="cardClassDetailForm msdsc" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-textarea
                  :editable="editable"
                  label=""
                  name="tenTxt"
                  noLabel
                  autogrow
                  v-model:value="data.tenTxt"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
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
import { chemMaterialType } from './chemMaterial'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemSummary'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** user 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
// const emits = defineEmits(['closePopup'])

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
  chemData?: chemMaterialType
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
      materialCd: '', // 화학자재번호
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
const grid = ref({
  columns: [
    {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '물질명',
      align: 'left',
      sortable: false
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      sortable: false
    },
    {
      name: 'limitRepval',
      field: 'limitRepval',
      label: '함유량(%)',
      align: 'center',
      sortable: false
    }
  ]
})
const grid2 = ref({
  merge: [{ index: 0, colName: 'regulationBillName' }],
  columns: [
    {
      name: 'regulationBillName',
      field: 'regulationBillName',
      label: '',
      align: 'left',
      sortable: false
    },
    {
      name: 'regulatedItemName',
      field: 'regulatedItemName',
      label: '',
      align: 'left',
      sortable: false
    }
  ]
})
const data = ref({
  mdmChemMaterialId: '', // 화학자재 일련코드
  mdmChemMaterialName: '',
  mainUse: '', // 주요용도
  casNo: '', // casNo
  freezingPoint: '', // 어는점
  boilPoint: '', // 끓는점
  flashPoint: '', // 인화점
  imageWord: '', // 그림문자
  hcodeResult: '', // 유해위험 문구
  // fourTxt: '', // 유해위험 문구
  fiveFirst: '', // 응급조치요령-눈에들어갔을때
  fiveSecond: '', // 응급조치요령-피부에접촉
  fiveThird: '', // 응급조치요령-흡입
  fiveFourth: '', // 응급조치요령-먹었을때
  fiveFive: '', // 응급조치요령-기타
  sixTxt: '', // 저장방법
  sevenFirst: '', // 피해야할 조건
  sevenSecond: '', // 피해야할 물질
  eightTxt: '', // 누출대처방법
  tenTxt: '', // 취급시 주의사항
  regUserId: '',
  chgUserId: '',
  chems: [], // 구성물질
  reguls: [], // 규제항목
  pics: []
})
const mappingType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
// const deleteUrl = ref('')
// const printUrl = ref('')
const isSave = ref(false)
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
  detailUrl.value = selectConfig.chm.summary.get.url
  // printUrl.value = selectConfig.chm.summary.print.url
  saveUrl.value = transactionConfig.chm.summary.insert.url
  // deleteUrl.value = transactionConfig.chm.summary.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): MSDS 요약본 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.mdmChemMaterialId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        mdmChemMaterialId: props.popupParam.mdmChemMaterialId
      }
    }).then((_result: any) => {
      if (_result.data) {
        data.value = _result.data
      }
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getSrc(imgname: string) {
  return new URL(`/src/assets/images/${imgname}.gif`, import.meta.url).href
}
/******************************
 * TODO (목적): MSDS 요약본 전 처리
 *******************************/
function saveData() {
  if (data.value.mdmChemMaterialId) {
    saveUrl.value = transactionConfig.chm.summary.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.chm.summary.insert.url
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          data.value.mdmChemMaterialId = props.popupParam.mdmChemMaterialId
          data.value.regUserId = user.value.userId
          data.value.chgUserId = user.value.userId

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
 * TODO (목적): MSDS 요약본 후 처리
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
// function removeData() {
//   message.confirm({
//     title: '확인',
//     message: '삭제하시겠습니까?',
//     // TODO : 필요시 추가하세요.
//     type: 'warning', // success / info / warning / error
//     // 확인 callback 함수
//     confirmCallback: () => {
//       $http({
//         url: $format(deleteUrl.value, data.value.mdmChemMaterialId),
//         method: 'GET'
//       }).then((_result: any) => {
//         message.requestSuccess()
//         emits('closePopup')
//       })
//     },
//     // 취소 callback 함수
//     cancelCallback: () => {}
//   })
// }
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
// function printChem() {
//   $http({
//     url: $format(printUrl.value, data.value.mdmChemMaterialId),
//     method: 'GET'
//   }).then((_result: any) => {
//     const fileOrgNm = data.value.materialName + ' ' + $language('MSDS요약본') + '.docx'
//     const blob = base64ToBlob(_result.data)
//     const nav = window.navigator as any
//     if (nav && nav.msSaveOrOpenBlob) {
//       nav.msSaveOrOpenBlob(blob, fileOrgNm)
//     } else {
//       const link = document.createElement('a')
//       link.href = window.URL.createObjectURL(blob)
//       link.download = fileOrgNm
//       link.click()
//     }
//   })
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
