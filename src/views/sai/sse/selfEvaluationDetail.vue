<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && isOld"
              label="삭제"
              icon="delete"
              @btnClicked="deleteSelfEvaluation"
            />
            <c-btn
              v-show="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="selfEvaluation"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveData"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              required
              :editable="editable"
              label="자율점검명"
              name="evaluationName"
              v-model:value="selfEvaluation.evaluationName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              required
              :editable="editable"
              :range="true"
              label="기간"
              name="evaluationPeriodArray"
              v-model:value="selfEvaluation.evaluationPeriodArray"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-field
              :editable="editable"
              :data="selfEvaluation"
              :plantCd="selfEvaluation.plantCd"
              type="dept_user"
              label="담당자"
              name="managerId"
              v-model:value="selfEvaluation.managerId"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-plant
              required
              :editable="editable"
              name="plantCd"
              v-model:value="selfEvaluation.plantCd"
              @datachange="setTableItems"
            />
          </div> -->
        </template>
      </c-card>
      <c-table
        ref="table"
        class="q-pb-md"
        title="자율점검표"
        :merge="grid.merge"
        :columns="grid.columns"
        :data="selfEvaluation.results"
        gridHeight="860px"
        :editable="editable"
        :columnSetting="false"
        :expandAll="false"
        :isFullScreen="false"
        :filtering="false"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { selfEvaluationType } from './selfEvaluation'

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
  name: 'selfEvaluationDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    saiSelfEvaluationId: stringNull
  }
  contentHeight: stringNull | numberNull
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
      saiSelfEvaluationId: ''
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
const selfEvaluation = ref<selfEvaluationType>({
  saiSelfEvaluationId: '', // 중대재해처벌법 자율점검 일련번호
  plantCd: '', // 사업장 코드
  evaluationName: '', // 자율점검명
  evaluationPeriodArray: [], // 자율점검 기간
  evaluationStartDate: '', // 자율점검 시작일
  evaluationEndDate: '', // 자율점검 종료일
  managerId: '', // 담당자
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  results: [],
  deleteResults: []
})
const grid = ref({
  merge: [{ index: 0, colName: 'selfEvaluationClassCd' }],
  columns: [
    {
      name: 'selfEvaluationClassName',
      field: 'selfEvaluationClassName',
      label: '핵심요소',
      align: 'center',
      style: 'width: 170px',
      sortable: false
    },
    {
      name: 'selfEvaluationTableItemName',
      field: 'selfEvaluationTableItemName',
      label: '항목',
      align: 'left',
      sortable: false
    },
    {
      required: true,
      name: 'selfEvaluationTableResultCd',
      field: 'selfEvaluationTableResultCd',
      label: '결과',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      type: 'select',
      codeGroupCd: 'SELF_EVALUATION_TABLE_RESULT_CD'
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      style: 'width: 200px',
      align: 'left',
      sortable: false,
      type: 'textarea'
    }
  ]
})
const savedPlantCd = ref('')
const mappingType = ref('POST')
const detailUrl = ref('')
const itemListUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.popupParam.saiSelfEvaluationId)
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
  detailUrl.value = selectConfig.sai.sse.selfEvaluation.get.url
  itemListUrl.value = selectConfig.sai.sse.selfEvaluationTableItem.list.url
  saveUrl.value = transactionConfig.sai.sse.selfEvaluation.insert.url
  deleteUrl.value = transactionConfig.sai.sse.selfEvaluation.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 자율점검 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiSelfEvaluationId),
      method: 'GET'
    }).then((_result: any) => {
      _result.data.evaluationPeriodArray = [
        _result.data.evaluationStartDate,
        _result.data.evaluationEndDate
      ]
      _.extend(selfEvaluation.value, _result.data)
      savedPlantCd.value = _.clone(selfEvaluation.value.plantCd)

      emits('setRegInfo', _result.data)
    })
  } else {
    setTableItems()
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function haveCheck() {
  return new Promise((resolve) => {
    if (selfEvaluation.value.results && selfEvaluation.value.results.length > 0) {
      // 기존 데이터가 존재 할 시에 값 제거 처리
      message.confirm({
        title: '확인',
        message: '사업장에 따른 점검항목이 변경됩니다.\n진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          selfEvaluation.value.deleteResults = _.filter(selfEvaluation.value.results, (result) => {
            return result.editFlag !== 'C'
          })
          savedPlantCd.value = _.clone(selfEvaluation.value.plantCd)
          resolve(true)
        },
        // 취소 callback 함수
        cancelCallback: () => {
          selfEvaluation.value.plantCd = _.clone(savedPlantCd.value)
          resolve(false)
        }
      })
    } else {
      resolve(true)
    }
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getTableItems() {
  return new Promise((resolve) => {
    $http({
      url: itemListUrl.value,
      method: 'GET',
      params: {
        plantCd: selfEvaluation.value.plantCd,
        useFlag: 'Y'
      }
    }).then((_result: any) => {
      selfEvaluation.value.results = _.map(_result.data, (item) => {
        return {
          saiSelfEvaluationTableResultId: uid(), // 중대재해처벌법 자율점검표 결과 일련번호
          saiSelfEvaluationId: props.popupParam.saiSelfEvaluationId, // 중대재해처벌법 자율점검 일련번호
          saiSelfEvaluationTableItemId: item.saiSelfEvaluationTableItemId, // 중대재해처벌법 자율점검표 항목 일련번호
          selfEvaluationClassCd: item.selfEvaluationClassCd, // 핵심요소 구분
          selfEvaluationClassName: item.selfEvaluationClassName, // 핵심요소 구분
          selfEvaluationTableItemName: item.selfEvaluationTableItemName, // 중대재해처벌법 자율점검표 항목명
          selfEvaluationTableResultCd: 'SETR000001', // 중대재해처벌법 자율점검 결과
          remarks: '', // 비고
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C'
        }
      })
      resolve(true)
    })
  })
}
/******************************
 * TODO (목적): 점검항목 조회 (사업장에 따른)
 *******************************/
function setTableItems() {
  const promises = [
    {
      func: haveCheck
    },
    {
      func: getTableItems
    }
  ]
  orderedPromise(promises)
}
/******************************
 * TODO (목적): 자율점검 저장 전 처리
 *******************************/
function saveData() {
  if (props.popupParam.saiSelfEvaluationId) {
    saveUrl.value = transactionConfig.sai.sse.selfEvaluation.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sai.sse.selfEvaluation.insert.url
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      if (validTable(grid.value.columns, selfEvaluation.value.results)) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            selfEvaluation.value.regUserId = user.value.userId
            selfEvaluation.value.chgUserId = user.value.userId

            selfEvaluation.value.evaluationStartDate = selfEvaluation.value.evaluationPeriodArray[0]
            selfEvaluation.value.evaluationEndDate = selfEvaluation.value.evaluationPeriodArray[1]

            isSave.value = !isSave.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 자율점검 저장 후 처리
 * @param (1): API 서버 반환값
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.saiSelfEvaluationId = result.data
  getDetail()
}
/******************************
 * TODO (목적): 자율점검 삭제
 *******************************/
function deleteSelfEvaluation() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiSelfEvaluationId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
