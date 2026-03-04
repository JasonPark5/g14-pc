<template>
  <q-form ref="editForm">
    <c-card title="감사실행정보" class="cardClassDetailForm" topClass="topcolor-lightblue">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && popupParam.selfInspectionStatusCd == 'SISC000002'"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="audit"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="saveData"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :editable="editable && Boolean(popupParam.selfInspectionResultId)"
            label="감사원 소견"
            name="selfInspectionResultOpinion"
            v-model:value="audit.selfInspectionResultOpinion"
            :rows="4"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :editable="editable && Boolean(popupParam.selfInspectionResultId)"
            label="감사 결과 종합의견"
            name="selfInspectionResultTotalOpinion"
            v-model:value="audit.selfInspectionResultTotalOpinion"
            :rows="4"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-textarea
            :editable="editable && Boolean(popupParam.selfInspectionResultId)"
            label="시정 및 권고 요약"
            name="selfInspectionResultCorrect"
            v-model:value="audit.selfInspectionResultCorrect"
            :rows="4"
          />
        </div>
      </template>
    </c-card>
    <c-upload
      class="col-12"
      :attachInfo="attachInfo"
      :editable="editable && popupParam.selfInspectionStatusCd == 'SISC000002'"
      label="자체감사 관련자료"
    />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { auditType } from '../audit'

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
  name: 'runInfo'
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
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull
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
      selfInspectionResultId: '',
      selfInspectionStatusCd: '',
      sysRevision: ''
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
const audit = ref<auditType>({
  selfInspectionResultId: '', // 자체감사 계획 일련번호
  selfInspectionTitle: '', // 감사명
  selfInspectionYear: '', // 감사년도
  selfInspectionTypeCd: null, // 감사종류
  plantCd: null, // 해당사업장
  remark: '', // 감사대상 개요
  selfInspectionStartDt: '', // 감사기간-시작일
  selfInspectionEndDt: '', // 감사기간-종료일
  selfInspectionStatusCd: '', // 감사진행상태-계획중,계획완료,감사완료
  selfInspectionResultOpinion: '', // 감사원소견
  selfInspectionResultTotalOpinion: '', // 감사 결과 종합의견
  selfInspectionResultCorrect: '', // 시정 및 권고 요약
  selfInspectionDt: [],
  sysRevision: '' // 평가항목 개정번호
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'SELF_INSPECTION',
  taskKey: ''
})
const editable = ref(true)
const isSave = ref(false)
const saveUrl = ref(transactionConfig.sop.pca.result.info.update.url)
const updateUrl = ref('')
const infoUrl = ref('')
const mappingType = ref('PUT')
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
  infoUrl.value = selectConfig.sop.pca.result.info.get.url
  updateUrl.value = transactionConfig.sop.pca.result.info.update.url
  // code setting
  attachInfo.value.taskKey = props.popupParam.selfInspectionResultId
  // list setting
  getInfo()
}
/******************************
 * TODO (목적): 기본정보 조회
 *******************************/
function getInfo() {
  $http({
    url: infoUrl.value,
    method: 'GET',
    params: { selfInspectionResultId: props.popupParam.selfInspectionResultId }
  }).then((_result: any) => {
    audit.value = _result.data
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  saveUrl.value = updateUrl.value
  mappingType.value = 'PUT'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          audit.value.regUserId = user.value.userId
          audit.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback() {
  message.requestSuccess()
  getInfo()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
