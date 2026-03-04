<template>
  <div>
    <q-form ref="editSopStepForm">
      <c-card
        :title="'[' + sopStep.jobStepName + '] ' + $language('작업단계 상세정보')"
        class="cardClassDetailForm no-margin"
      >
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable"
              :isSubmit="isSaveSopStep"
              :url="saveSopStepUrl"
              :param="sopStep"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveSopStep"
              @btnCallback="saveSopStepCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-5">
            <div class="row">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-upload-picture
                  height="300px"
                  :attachInfo="attachSopStepInfo"
                  :editable="editable"
                />
              </div>
              <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                <c-text
                  required
                  :editable="editable"
                  label="작업단계"
                  name="jobStepName"
                  v-model:value="sopStep.jobStepName"
                />
              </div>
              <div class="col-2">
                <c-text
                  required
                  :editable="editable"
                  type="number"
                  label="번호"
                  name="jobStepNo"
                  v-model:value="sopStep.jobStepNo"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  autogrow
                  label="설명"
                  name="jobStepDesc"
                  v-model:value="sopStep.jobStepDesc"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  label="안전보호구"
                  name="saftyShied"
                  autogrow
                  v-model:value="sopStep.saftyShied"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  label="사용공구"
                  name="useTool"
                  autogrow
                  v-model:value="sopStep.useTool"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  label="안전작업방법"
                  name="saftyWorkMethod"
                  autogrow
                  v-model:value="sopStep.saftyWorkMethod"
                />
              </div>
              <div class="col-6">
                <c-textarea
                  :editable="editable"
                  label="주의사항"
                  name="caution"
                  autogrow
                  v-model:value="sopStep.caution"
                />
              </div>
            </div>
          </div>

          <div class="col-7">
            <c-table
              ref="tableHazard"
              title="유해위험요인 목록"
              :editable="editable"
              :columns="gridHazard.columns"
              :merge="gridHazard.merge"
              :data="sopStep.sopHazardFactors"
              gridHeight="650px"
              selection="multiple"
              rowKey="sopStepHazardId"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addSopHazard" />
                  <c-btn
                    v-if="editable && sopStep.sopHazardFactors!.length > 0"
                    label="제외"
                    icon="remove"
                    @btnClicked="deleteSopHazard"
                  />
                </q-btn-group>
              </template>
              <template v-slot:customArea="{ props, col }">
                <q-item
                  v-if="col.name === 'riskHazardName'"
                  class="card-sop-step-list"
                  style="padding: 2px 0 !important"
                >
                  <q-item-section>
                    <q-item-label class="sopStep-card-title">
                      <q-btn
                        v-if="props.row.editFlag !== 'C'"
                        class="tableinnerBtn textLeft"
                        flat
                        align="left"
                        color="blue-6"
                        :label="props.row.riskHazardName"
                        @click.stop="openHazardCasue(props.row)"
                      />
                      <template v-else>
                        {{ props.row.riskHazardName }}
                        <q-badge color="red"> NEW </q-badge>
                      </template>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </c-table>
          </div>
        </template>
      </c-card>
    </q-form>
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
import { sopStepType } from './sopInfo'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'sopStepInfo'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    mdmSopId: stringNull
    jobStepId: stringNull
    ramRiskHazardTechniqueCd: stringNull
  }
  contentHeight: stringNull | numberNull
}
interface gridType {
  merge: tableMergeType
  columns: tableColumnType
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
      mdmSopId: '',
      jobStepId: '',
      ramRiskHazardTechniqueCd: null
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
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const gridHazard = ref<gridType>({
  merge: [
    { index: 0, colName: 'sopStepHazardId' },
    { index: 1, colName: 'sopStepHazardId' },
    { index: 2, colName: 'sopStepHazardId' }
  ],
  columns: [
    {
      name: 'ramRiskHazardClassName',
      field: 'ramRiskHazardClassName',
      label: '분류',
      align: 'center',
      sortable: false,
      style: 'width: 80px'
    },
    {
      name: 'riskHazardName',
      field: 'riskHazardName',
      label: '유해위험요인',
      align: 'left',
      sortable: false,
      type: 'custom',
      style: 'width: 180px'
    },
    {
      name: 'attach',
      field: 'attach',
      label: '관련 파일첨부',
      align: 'center',
      style: 'width:100px',
      type: 'attach',
      taskClassCd: 'RISK_HAZARD',
      keyText: 'sopStepHazardId',
      sortable: true
    },
    {
      name: 'hazardOccurReason',
      field: 'hazardOccurReason',
      label: '원인',
      align: 'left',
      sortable: false,
      style: 'width: 100px'
    },
    {
      name: 'hazardOccurResult',
      field: 'hazardOccurResult',
      label: '결과',
      align: 'left',
      sortable: false,
      style: 'width: 100px'
    }
  ]
})
const editSopStepForm = ref<HTMLFormElement | null>(null)
const tableHazard = ref<any>(null)
const mappingType = ref('POST')
const isSaveSopStep = ref(false)
const sopStepDetailUrl = ref('')
const saveSopStepUrl = ref('')
const attachSopStepInfo = ref<any>({
  isSubmit: '',
  taskClassCd: 'SOP_STEP_PHOTO',
  taskKey: ''
})
const sopStep = ref<sopStepType>({
  jobStepId: '', // 작업단계일련번호
  mdmSopId: '', // 안전작업 표준 일련번호
  jobStepNo: '', // 작업단계 번호
  jobStepName: '', // 작업단계 명
  jobStepDesc: '', // 작업단계 설명
  saftyWorkMethod: '', // 안전작업방법(주의사항)
  saftyShied: '', // 안전보호구 수기 입력
  useTool: '', // 사용공구
  caution: '', // 주의사항
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 등록자 ID
  editFlag: '',
  sopHazards: [],
  deleteSopHazards: [],
  sopHazardFactors: [],
  show: false
})

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
  sopStepDetailUrl.value = selectConfig.mdm.sop.step.get.url
  saveSopStepUrl.value = transactionConfig.mdm.sop.step.update.url
  // code setting
  // list setting
  getSopStepDetail()
}
function getSopStepDetail() {
  if (props.popupParam.jobStepId) {
    $http({
      url: $format(sopStepDetailUrl.value, props.popupParam.jobStepId),
      method: 'GET'
    }).then((_result: any) => {
      sopStep.value = _result.data
      attachSopStepInfo.value.taskKey = props.popupParam.jobStepId
    })
  } else {
    sopStep.value.mdmSopId = props.popupParam.mdmSopId
  }
}
function saveSopStep() {
  if (props.popupParam.jobStepId) {
    saveSopStepUrl.value = transactionConfig.mdm.sop.step.update.url
    mappingType.value = 'PUT'
  } else {
    saveSopStepUrl.value = transactionConfig.mdm.sop.step.insert.url
    mappingType.value = 'POST'
  }
  editSopStepForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          sopStep.value.regUserId = user.value.userId
          sopStep.value.chgUserId = user.value.userId

          isSaveSopStep.value = !isSaveSopStep.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveSopStepCallback(result: any) {
  message.requestSuccess()
  props.popupParam.jobStepId = result.data
  attachSopStepInfo.value.taskKey = result.data
  attachSopStepInfo.value.isSubmit = uid()
  getSopStepDetail()
}
function addSopHazard() {
  popupOptions.value = getPopupOptions('riskHazard', popupOptions.value, closeHazardPopup, {
    type: 'multiple',
    searchParam: {
      ramRiskHazardTechniqueCd: props.popupParam.ramRiskHazardTechniqueCd
    }
  })
}
function closeHazardPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (!sopStep.value.sopHazards) sopStep.value.sopHazards = []
    if (!sopStep.value.sopHazardFactors) sopStep.value.sopHazardFactors = []
    _.forEach(data, (item) => {
      if (
        _.findIndex(sopStep.value.sopHazards, { mdmHazardFactorsId: item.ramRiskHazardId }) === -1
      ) {
        sopStep.value.sopHazards.push({
          sopStepHazardId: uid(), // 작업단계별 유해위험요인 일련번호
          mdmSopId: props.popupParam.mdmSopId, // 안전작업 표준 일련번호
          jobStepId: props.popupParam.jobStepId, // 작업단계 일련번호
          mdmHazardFactorsId: item.ramRiskHazardId, // 유해위험요인 일련번호
          riskHazardName: item.riskHazardName,
          ramRiskHazardClassCd: item.ramRiskHazardClassCd,
          ramRiskHazardClassName: item.ramRiskHazardClassName,
          regUserId: user.value.userId,
          editFlag: 'C'
        })
        sopStep.value.sopHazardFactors.splice(0, 0, {
          sopStepHazardId: uid(), // 작업단계별 유해위험요인 일련번호
          mdmSopId: props.popupParam.mdmSopId, // 안전작업 표준 일련번호
          jobStepId: props.popupParam.jobStepId, // 작업단계 일련번호
          mdmHazardFactorsId: item.ramRiskHazardId, // 유해위험요인 일련번호
          riskHazardName: item.riskHazardName,
          ramRiskHazardClassCd: item.ramRiskHazardClassCd,
          ramRiskHazardClassName: item.ramRiskHazardClassName,
          hazardOccurReason: '',
          hazardOccurResult: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
    // tableHazard.value.reRend()
  }
}
function deleteSopHazard() {
  const selectData = tableHazard.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '제외하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        if (!sopStep.value.deleteSopHazards) sopStep.value.deleteSopHazards = []
        _.forEach(selectData, (item) => {
          if (
            item.editFlag !== 'C' &&
            _.findIndex(sopStep.value.deleteSopHazards, {
              sopStepHazardId: item.sopStepHazardId
            }) === -1
          ) {
            sopStep.value.deleteSopHazards.push(item)
          }
          sopStep.value.sopHazards = _.reject(sopStep.value.sopHazards, {
            mdmHazardFactorsId: item.mdmHazardFactorsId
          })
          sopStep.value.sopHazardFactors = _.reject(sopStep.value.sopHazardFactors, item)
        })
        tableHazard.value.compoTable.clearSelection()
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function openHazardCasue(hazard: any) {
  popupOptions.value.title = '유해위험요인별 가능한 원인'
  popupOptions.value.param = {
    mdmSopId: hazard.mdmSopId,
    jobStepId: hazard.jobStepId,
    sopStepHazardId: hazard.sopStepHazardId,
    mdmHazardFactorsId: hazard.mdmHazardFactorsId,
    gridTitle: `${hazard.ramRiskHazardClassName} / ${hazard.riskHazardName}`
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./sopHazardFactorPop.vue`))
  )
  popupOptions.value.width = '60%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeHazardCausePopup
}
function closeHazardCausePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getSopStepDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.textLeft
  .text-center
    text-align: left !important
</style>
