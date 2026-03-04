<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-upload :attachInfo="attachInfo" :editable="editable && revEditable" label="MSDS" />
    </div>
    <div
      class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
      style="padding-top: 10px !important"
    >
      <c-card
        title="MSDS개정"
        class="cardClassDetailForm revisionLayout"
        topClass="topcolor-orange"
      >
        <template v-slot:card-select>
          <c-select
            :editable="!isRevision"
            :comboItems="revs"
            type="custom"
            typetext="개정이력"
            itemText="revisionNum"
            itemValue="mdmChemMaterialMsdsId"
            label=""
            name="selectedId"
            v-model:value="selectedId"
            @update:value="rowClickRev"
          />
        </template>
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable && !isRevision"
              label="개정"
              icon="restart_alt"
              @btnClicked="setRevision"
            />
            <c-btn
              v-show="editable && isRevision"
              label="개정취소"
              icon="restart_alt"
              @btnClicked="cancelRevision"
            />
            <c-btn
              v-show="editable && isRevision"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="chemData"
              mappingType="POST"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div class="row">
              <div class="col-2">
                <c-text
                  :required="editable && isRevision"
                  :editable="editable && isRevision"
                  label="개정번호"
                  name="revisionNum"
                  v-model:value="chemData.revisionNum"
                />
              </div>
              <div class="col-3">
                <c-text
                  :editable="false"
                  label="개정일시"
                  name="msdsRegDtStr"
                  v-model:value="chemData.msdsRegDtStr"
                />
              </div>
              <div class="col-2">
                <c-text
                  :editable="false"
                  label="개정자"
                  name="msdsRegUserName"
                  v-model:value="chemData.msdsRegUserName"
                />
              </div>
              <!-- <div class="col-2">
                <c-text
                  :editable="editable && isRevision"
                  label="MSDS번호"
                  name="msdsNo"
                  v-model:value="chemData.msdsNo">
                </c-text>
              </div> -->
              <div class="col-5">
                <c-textarea
                  :required="editable && isRevision"
                  :editable="editable && isRevision"
                  label="개정사유"
                  name="revisionContent"
                  v-model:value="chemData.revisionContent"
                />
              </div>
            </div>
          </div>
        </template>
      </c-card>
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
import { chemMaterialType } from './chemMaterial'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemMsdsFile'
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
const revs = ref([])
const savedMdmChemMaterialMsdsId = ref('')
const isSave = ref(false)
const isRevision = ref(false)
const detailUrl = ref('')
const revListUrl = ref('')
const revVersionUrl = ref('')
const saveUrl = ref('')
const selectedId = ref<any>(null)
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'CHEM_MSDS',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
// const attachInfo2 = ref({
//   isSubmit: '',
//   taskClassCd: 'CHEM_MSDS_VENDOR',
//   taskKey: '',
//   beforeTaskKey: '',
//   isRev: false
// })

/******************************
 * @Computed_선언
 *******************************/
const revEditable = computed(() => selectedId.value === savedMdmChemMaterialMsdsId.value)

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
  detailUrl.value = selectConfig.mdm.mam.chem.msdsUnit.get.url
  revListUrl.value = selectConfig.mdm.mam.chem.msdsUnit.rev.url
  revVersionUrl.value = selectConfig.com.revision.getversion
  saveUrl.value = transactionConfig.mdm.mam.chem.msdsUnit.insert.url
  // code setting
  selectedId.value = props.chemData.mdmChemMaterialMsdsId
  savedMdmChemMaterialMsdsId.value = props.chemData.mdmChemMaterialMsdsId
  attachInfo.value.taskKey = props.chemData.mdmChemMaterialMsdsId
  // attachInfo2.value.taskKey = props.chemData.mdmChemMaterialMsdsId
  // list setting
  getRevList(props.chemData.groupId)
}
/******************************
 * TODO (목적): MSDS 상세 조회
 * @param (1): MSDS key
 * @param (2): 이력 조회 여부
 *******************************/
function getDetail(id: string, check: boolean) {
  const _id = id ? id : props.chemData.mdmChemMaterialMsdsId
  $http({
    url: $format(detailUrl.value, _id),
    method: 'GET'
  }).then((_result: any) => {
    _.extend(props.chemData, {
      mdmChemMaterialMsdsId: _result.data.mdmChemMaterialMsdsId,
      revisionNum: _result.data.revisionNum,
      groupId: _result.data.groupId,
      sysRevision: _result.data.sysRevision,
      msdsNo: _result.data.msdsNo,
      revisionContent: _result.data.revisionContent,
      msdsRegDtStr: _result.data.msdsRegDtStr.slice(0, 19),
      msdsRegUserName: _result.data.msdsRegUserName
    })

    if (check) {
      setTimeout(() => {
        selectedId.value = props.chemData.mdmChemMaterialMsdsId
        savedMdmChemMaterialMsdsId.value = props.chemData.mdmChemMaterialMsdsId
        attachInfo.value.taskKey = props.chemData.mdmChemMaterialMsdsId
        getRevList(_result.data.groupId)
      }, 200)
    }
  })
}
/******************************
 * TODO (목적): MSDS 이력 조회
 * @param (1): MSDS 이력 그룹 key
 *******************************/
function getRevList(_groupId: string) {
  $http({
    url: revListUrl.value,
    method: 'GET',
    params: {
      groupId: _groupId
    }
  }).then((_result: any) => {
    revs.value = _result.data
  })
}
/******************************
 * TODO (목적): 이력 정보 셋팅
 *******************************/
function setRevision() {
  $http({
    url: revVersionUrl.value,
    method: 'GET',
    params: {
      revisionNum: props.chemData.revisionNum
    }
  }).then((_result: any) => {
    props.chemData.revisionNum = _result.data
    props.chemData.revisionContent = ''
    props.chemData.regDtStr = ''
    props.chemData.regUserName = ''
    isRevision.value = true
    /**
     * 첨부파일 셋팅
     */
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.chemData.mdmChemMaterialMsdsId
    attachInfo.value.isRev = true
    // attachInfo2.value.taskKey = ''
    // attachInfo2.value.beforeTaskKey = props.chemData.mdmChemMaterialMsdsId
    // attachInfo2.value.isRev = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  /**
   * 첨부파일 셋팅
   */
  attachInfo.value.taskKey = props.chemData.mdmChemMaterialMsdsId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = true
  // attachInfo2.value.taskKey = props.chemData.mdmChemMaterialMsdsId
  // attachInfo2.value.beforeTaskKey = ''
  // attachInfo2.value.isRev = true

  selectedId.value = props.chemData.mdmChemMaterialMsdsId
  getDetail(selectedId.value, false)
}
/******************************
 * TODO (목적): 이력사항 선택
 * @param (1): 이력 정보
 *******************************/
function rowClickRev(row: any) {
  if (row && row != props.chemData.mdmChemMaterialMsdsId) {
    selectedId.value = row
    getDetail(selectedId.value, false)
    attachInfo.value.taskKey = selectedId.value
    // attachInfo2.value.taskKey = selectedId.value
  }
}
/******************************
 * TODO (목적): MSDS 개정 전 처리
 *******************************/
function saveInfo() {
  message.confirm({
    title: '확인',
    message: '현재버전을 개정하여 저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      props.chemData.regUserId = user.value.userId
      props.chemData.sysRevision = parseInt(props.chemData.sysRevision) + 1

      isSave.value = !isSave.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): MSDS 개정 후 처리
 * @param (1): API 서버 반환 값 (MSDS key)
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()

  /**
   * 첨부파일 셋팅
   */
  attachInfo.value.taskKey = result.data
  attachInfo.value.isSubmit = uid()
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  // attachInfo2.value.taskKey = result.data
  // attachInfo2.value.isSubmit = uid()
  // attachInfo2.value.beforeTaskKey = ''
  // attachInfo2.value.isRev = false

  isRevision.value = false
  selectedId.value = result.data
  getDetail(result.data, true)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
