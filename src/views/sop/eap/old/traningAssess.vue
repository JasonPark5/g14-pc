<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-4">
          <c-card title="훈련평가 상세" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col">
                <div class="row">
                  <div class="col-sm-12 col-md-12 col-lg-12">
                    <c-field
                      :editable="editable"
                      :data="info"
                      type="dept_user"
                      label="평가자"
                      name="evaluationUserId"
                      v-model:value="info.evaluationUserId"
                    />
                  </div>
                </div>
                <div class="row q-pt-sm">
                  <div class="col-sm-12 col-md-12 col-lg-12">
                    <c-textarea
                      :editable="editable"
                      label="평가의견"
                      autogrow
                      :maxrows="20"
                      name="evaluationOpinon"
                      v-model:value="info.evaluationOpinon"
                    />
                  </div>
                </div>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-8">
          <c-table
            ref="table"
            title="훈련평가항목 목록"
            :columns="grid.columns"
            :data="grid.data"
            :noDataLabel="$language('훈련구분에 따른 항목이 나옵니다.')"
            :editable="editable"
            :usePaging="false"
            :isExcelDown="false"
            :gridHeight="gridHeight"
            rowKey="attendUserId"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="!disabled && editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="info"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="savePlan"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
          </c-table>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'traningAssess'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
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
  param: {
    sopEmergencyTrainingId: stringNull
    eapTrainingTypeCd: stringNull
    plantCd: stringNull
  }
}
interface gridType {
  columns: tableColumnType
  height: stringNull
  data: Array<any>
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
      sopEmergencyTrainingId: '',
      eapTrainingTypeCd: '',
      plantCd: ''
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
const table = ref<any>(null)
const saveUrl = ref('')
const saveType = ref('PUT')
const isSave = ref(false)
const getItemUrl = ref('')
const getUrl = ref('')
const disabled = ref(false)
const info = ref<any>({
  sopEmergencyTrainingId: '',
  evaluationUserId: '',
  evaluationOpinon: '',
  deptCd: '',
  emergencyTrainingEvaluationModels: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'evaluationItemName',
      field: 'evaluationItemName',
      label: '평가항목',
      align: 'left',
      style: 'width:400px',
      sortable: false
    },
    {
      setHeader: true,
      name: 'evaluationPointCd',
      field: 'evaluationPointCd',
      label: '점수',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      type: 'select',
      codeGroupCd: 'EAP_TRAINING_POINT_CD',
      isChip: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'text'
    }
  ],
  data: [],
  height: '460px'
})
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => window.innerHeight - 160 + 'px')

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
  getItemUrl.value = selectConfig.sop.eap.training.plan.getItem.url
  getUrl.value = selectConfig.sop.eap.training.plan.get.url
  saveUrl.value = transactionConfig.sop.eap.training.plan.update.url + '/item'
  // code setting
  // list setting
  getDetail()
  getData()
}
function getDetail() {
  if (props.param.sopEmergencyTrainingId) {
    $http({
      url: $format(getUrl.value, props.param.sopEmergencyTrainingId),
      method: 'GET'
    }).then((_result: any) => {
      info.value.sopEmergencyTrainingId = props.param.sopEmergencyTrainingId
      info.value.evaluationUserId = _result.data.evaluationUserId || user.value.userId
      info.value.evaluationOpinon = _result.data.evaluationOpinon
      info.value.deptCd = _result.data.deptCd
      if (_result.data.trainingCompleteFlag === 'Y') {
        disabled.value = true
      }
    })
  }
}
function getData() {
  $http({
    url: getItemUrl.value,
    method: 'GET',
    params: {
      sopEmergencyTrainingId: props.param.sopEmergencyTrainingId,
      trainingTypeCd: props.param.eapTrainingTypeCd,
      plantCd: props.param.plantCd,
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
    info.value.emergencyTrainingEvaluationModels = _result.data
  })
}
function savePlan() {
  saveType.value = 'PUT'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          info.value.chgUserId = user.value.userId
          info.value.emergencyTrainingEvaluationModels = grid.value.data
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
function saveCallback() {
  message.requestSuccess()
  getDetail()
  getData()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
