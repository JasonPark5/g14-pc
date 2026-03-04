<template>
  <div class="row">
    <div class="col-12">
      <c-table
        ref="table"
        title="평가대상 목록"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="processData.targets"
        :merge="grid.merge"
        :columnSetting="false"
        :expandAll="false"
        :isFullScreen="false"
        :usePaging="false"
        :filtering="false"
        :editable="editable && !disabled"
        selection="multiple"
        rowKey="ramChecklistAssessScenarioId"
        @innerBtnClicked="innerBtnClicked"
        @table-data-change="tableDataChange"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable && !disabled && isSelect"
              label="직접추가"
              icon="add"
              @btnClicked="addKeyinTarget"
            />
            <c-btn
              v-show="editable && !disabled && isSelect"
              label="추가"
              icon="add"
              @btnClicked="addTarget"
            />
            <c-btn
              v-show="
                editable &&
                !disabled &&
                isSelect &&
                processData.targets &&
                processData.targets.length > 0
              "
              label="삭제"
              icon="remove"
              @btnClicked="removeScenario"
            />
            <c-btn
              v-show="
                editable &&
                !disabled &&
                isSelect &&
                processData.targets &&
                processData.targets.length > 0
              "
              :isSubmit="isSave"
              :url="saveUrl"
              :param="targetScenarioSave"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveTarget"
              @btnCallback="saveTargetCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'ramCheckItemClassName'">
            {{ props.row[col.name] }}
            <q-btn-group outline class="ColumInnerBtnGroup">
              <q-btn
                v-if="editable && !disabled && isSelect"
                icon="add"
                color="green"
                text-color="white"
                class="ColumInnerBtn"
                align="center"
                @click.stop="innerBtnClicked(col, props, '1')"
              >
                <q-tooltip>{{ $language('직접 평가대상 추가') }}</q-tooltip>
              </q-btn>
              <q-btn
                v-if="
                  editable &&
                  !disabled &&
                  isSelect &&
                  props.row.ramCheckItemClassCd !== 'RCIC000015'
                "
                icon="add"
                color="amber"
                text-color="white"
                class="ColumInnerBtn"
                align="center"
                @click.stop="innerBtnClicked(col, props, '2')"
              >
                <q-tooltip>{{ $language('평가대상 추가') }}</q-tooltip>
              </q-btn>
            </q-btn-group>
          </template>
          <template v-else-if="col.name === 'checkItemName'">
            <template
              v-if="props.row.checkItemId && props.row.ramCheckItemClassCd !== 'RCIC000015'"
            >
              <!-- 작업, 기계·기구, 유해인자 & link 걸린 대상 -->
              <q-btn
                flat
                class="tableinnerBtn"
                align="left"
                color="blue-6"
                :label="props.row[col.name]"
                @click.stop="linkClick(props.row)"
              />
            </template>
            <template v-else>
              <!-- 기타 & link 걸리지 않은 대상 -->
              <c-text-column
                v-if="col.name === 'checkItemName'"
                :editable="editable && !disabled && isSelect"
                :col="col"
                :props="props"
                v-model:value="props.row['checkItemName']"
                @datachange="tableDataChange(props, col)"
              />
              <c-text-column
                v-else
                :editable="editable && !disabled && isSelect"
                :col="col"
                :props="props"
                v-model:value="props.row['checklistQuestion']"
                @datachange="tableDataChange(props, col)"
              />
            </template>
            <q-btn-group outline class="ColumInnerBtnGroup">
              <q-btn
                v-if="editable && !disabled && isSelect"
                icon="add"
                color="primary"
                text-color="white"
                class="ColumInnerBtn"
                align="center"
                @click.stop="innerBtnClicked(col, props)"
              >
                <q-tooltip>{{ $language('문항 추가') }}</q-tooltip>
              </q-btn>
            </q-btn-group>
          </template>
        </template>
      </c-table>
    </div>
    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 350px">
        <q-form ref="editForm">
          <c-card title="평가대상 분류" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled && isSelect"
                  label="확인"
                  icon="save"
                  @btnClicked="accepts"
                />
                <c-btn label="닫기" icon="cancel" @btnClicked="closeDialog" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-12">
                <c-select
                  ref="ramCheckItemClassSelect"
                  :required="true"
                  :editable="editable && !disabled"
                  codeGroupCd="RAM_CHECK_ITEM_CLASS_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="ramCheckItemClassCd"
                  label="분류"
                  v-model:value="target.ramCheckItemClassCd"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </q-card>
    </q-dialog>
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
import { processDataType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'checklistTargetItem'
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
const emits = defineEmits(['saveCallback'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  processData: processDataType
  disabled: boolean
}

interface gridType {
  columns: tableColumnType
  height: stringNull
  merge: tableMergeType
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
  processData: () => {
    return {
      ramRiskAssessmentPlanId: '', // 평가 일련번호
      processCd: '', // 단위공정 코드
      processName: '', // 단위공정명
      ramProcessAssessStepCd: '', // 평가진행상태
      processExplainFeature: '', // 공정 특징 설명
      assessDeptCd: '', // 평가 부서 코드
      assessUserId: '', // 평가 담당자
      assessUserName: '', // 평가 담당자
      workCycleCd: null, // 작업발생주기코드
      workingTime: 0, // 작업시간(1회)
      vendorFlag: 0,
      temperature: null,
      workMeasurementPlanId: '',
      measPlanContent: '',
      regUserId: '', // 작성자 ID
      chgUserId: '', // 수정자 ID
      equipments: [],
      sops: [],
      drawNodes: [],
      draws: [],
      fmScenarios: [],
      hazopScenarios: [],
      scenarios: [],
      charmResultScenarios: [],
      charmEstimationScenarios: [],
      targets: [],
      thirdScenarios: []
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
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'ramCheckItemClassCd' }],
  columns: [
    {
      name: 'ramCheckItemClassName',
      field: 'ramCheckItemClassName',
      label: '분류',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      type: 'custom'
    },
    {
      required: true,
      name: 'checkItemName',
      field: 'checkItemName',
      label: '평가대상',
      align: 'left',
      type: 'custom',
      sortable: true,
      style: 'width:200px'
    },
    {
      required: true,
      name: 'checklistQuestion',
      field: 'checklistQuestion',
      label: '체크리스트 문항',
      align: 'left',
      type: 'text',
      sortable: true,
      style: 'width:350px'
    }
  ],
  data: [],
  height: '520px'
})
const target = ref<any>({
  ramCheckItemClassCd: null
})
const targetScenarioSave = ref<any>({
  ramRiskAssessmentPlanId: '',
  processCd: '',
  targets: [],
  scenarios: []
})
const editForm = ref<any>(null)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const dialog = ref(false)
const table = ref<any>(null)
const ramCheckItemClassSelect = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isSelect = computed(() => {
  return props.processData && props.processData.processCd && !props.disabled ? true : false
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
  listUrl.value = selectConfig.ram.checklist.target.list.url
  saveUrl.value = transactionConfig.ram.checklist.target.save.url
  deleteUrl.value = transactionConfig.ram.checklist.target.delete.url
  // code setting
  // list setting
}

/******************************
 * TODO (목적): 조회
 *******************************/
function getTargets() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd
    }
  }).then((_result: any) => {
    props.processData.targets = _result.data
  })
}
function tableDataChange(_props: any, _col: any) {
  if (_col.name === 'checkItemName') {
    if (_props.row.editFlag !== 'C' && _props.row.targetEditFlag !== 'C') {
      _props.row.targetEditFlag = 'U'
      _props.row.editFlag = 'U'
      _props.row.chgUserId = user.value.userId
    }
  } else if (_col.name === 'checklistQuestion') {
    if (_props.row.editFlag === 'U' && _props.row.scenarioEditFlag !== 'C') {
      _props.row.scenarioEditFlag = 'U'
      _props.row.editFlag = 'U'
      _props.row.chgUserId = user.value.userId
    }
  }
}

function linkClick(row: any) {
  if (row.ramCheckItemClassCd === 'RCIC000001') {
    popupOptions.value.title = '안전작업표준 상세'
    popupOptions.value.param = {
      mdmSopId: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import('@views/mdm/pim/sopDetail.vue'))
    )
    popupOptions.value.width = '80%'
    popupOptions.value.isFull = false
  } else if (row.ramCheckItemClassCd === 'RCIC000005') {
    popupOptions.value.title = '유해위험기계기구 상세'
    popupOptions.value.param = {
      hhmHazardousMachineryId: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(
        () => import('@views/sop/mim/hazardEquipment/hazardEquipmentClassDetail.vue')
      )
    )
    popupOptions.value.isFull = true
  } else {
    popupOptions.value.title = '유해인자 상세'
    popupOptions.value.param = {
      hazardCd: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import('@views/sai/wmr/harmfulFactorsDetail.vue'))
    )
    popupOptions.value.isFull = false
    popupOptions.value.width = '80%'
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
function closeDialog() {
  dialog.value = false
}
function addKeyinTarget() {
  dialog.value = true
}
function addTarget() {
  popupOptions.value.title = '평가대상 검색'
  popupOptions.value.param = {
    processCd: props.processData.processCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/ram/checklist/checklistTargetPop.vue'))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeTargetPopup
}
function closeTargetPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(props.processData.targets, { checkItemId: item.checkItemId }) === -1) {
        const idx = _.findIndex(props.processData.targets, {
          ramCheckItemClassCd: item.ramCheckItemClassCd
        })
        props.processData.targets.splice(idx > -1 ? idx : 0, 0, {
          ramChecklistAssessScenarioId: uid(), // 시나리오 일련번호
          ramAssessChecklistTargetId:
            idx > -1 ? props.processData.targets[idx].ramAssessChecklistTargetId : uid(), // 공종/유해인자/설비 일련번호
          ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
          processCd: props.processData.processCd, // 단위공정 코드
          processName: props.processData.processName, // 단위공정명
          ramCheckItemClassCd: item.ramCheckItemClassCd, // 분류코드
          ramCheckItemClassName: item.ramCheckItemClassName, // 분류코드
          checkItemId: item.checkItemId, // 분류id
          checkItemName: item.checkItemName, // 분류명
          checklistQuestion: '', // 체크리스트 문항
          ramInspectResultCd: 'RIR0000001',
          regUserId: user.value.userId, // 작성자 ID
          targetEditFlag: idx > -1 ? '' : 'C',
          scenarioEditFlag: 'C',
          editFlag: 'C'
        })
      }
    })
  }
}
function accepts() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      const idx = _.findIndex(props.processData.targets, {
        ramCheckItemClassCd: target.value.ramCheckItemClassCd
      })
      props.processData.targets.splice(idx > -1 ? idx : 0, 0, {
        ramChecklistAssessScenarioId: uid(), // 시나리오 일련번호
        ramAssessChecklistTargetId:
          idx > -1 ? props.processData.targets[idx].ramAssessChecklistTargetId : uid(), // 공종/유해인자/설비 일련번호
        ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
        processCd: props.processData.processCd, // 단위공정 코드
        processName: props.processData.processName, // 단위공정명
        ramCheckItemClassCd: target.value.ramCheckItemClassCd, // 분류코드
        ramCheckItemClassName: ramCheckItemClassSelect.value.getName(), // 분류코드
        checkItemId: '', // 분류id
        checkItemName: '', // 분류명
        checklistQuestion: '', // 체크리스트 문항
        ramInspectResultCd: 'RIR0000001',
        regUserId: user.value.userId, // 작성자 ID
        targetEditFlag: idx > -1 ? '' : 'C',
        scenarioEditFlag: 'C',
        editFlag: 'C'
      })

      dialog.value = false
    } else {
      message.validError()
    }
  })
}
function innerBtnClicked(_col: any, _props: any, _btn?: any) {
  if (_col.name === 'ramCheckItemClassName') {
    // 분류
    if (_btn === '1') {
      // 직접추가
      const idx = _.findIndex(props.processData.targets, {
        ramCheckItemClassCd: _props.row.ramCheckItemClassCd
      })
      props.processData.targets.splice(idx > -1 ? idx : 0, 0, {
        ramChecklistAssessScenarioId: uid(), // 시나리오 일련번호
        ramAssessChecklistTargetId:
          idx > -1 ? props.processData.targets[idx].ramAssessChecklistTargetId : uid(), // 공종/유해인자/설비 일련번호
        ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
        processCd: props.processData.processCd, // 단위공정 코드
        processName: props.processData.processName, // 단위공정명
        ramCheckItemClassCd: _props.row.ramCheckItemClassCd, // 분류코드
        ramCheckItemClassName: _props.row.ramCheckItemClassName, // 분류코드
        checkItemId: '', // 분류id
        checkItemName: '', // 분류명
        checklistQuestion: '', // 체크리스트 문항
        ramInspectResultCd: 'RIR0000001',
        regUserId: user.value.userId, // 작성자 ID
        targetEditFlag: idx > -1 ? '' : 'C',
        scenarioEditFlag: 'C',
        editFlag: 'C'
      })
    } else {
      // 추가
      popupOptions.value.title = '평가대상 검색'
      popupOptions.value.param = {
        processCd: props.processData.processCd,
        ramCheckItemClassCd: _props.row.ramCheckItemClassCd
      }
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import('@views/ram/checklist/checklistTargetPop.vue'))
      )
      popupOptions.value.width = '80%'
      popupOptions.value.visible = true
      popupOptions.value.closeCallback = closeTargetPopup
    }
  } else if (_col.name === 'checkItemName') {
    // 평가대상
    const idx = _.findIndex(props.processData.targets, {
      ramCheckItemClassCd: _props.row.ramCheckItemClassCd,
      checkItemName: _props.row.checkItemName
    })
    props.processData.targets.splice(idx > -1 ? idx : 0, 0, {
      ramChecklistAssessScenarioId: uid(), // 시나리오 일련번호
      ramAssessChecklistTargetId:
        idx > -1 ? props.processData.targets[idx].ramAssessChecklistTargetId : uid(), // 공종/유해인자/설비 일련번호
      ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
      processCd: props.processData.processCd, // 단위공정 코드
      processName: props.processData.processName, // 단위공정명
      ramCheckItemClassCd: _props.row.ramCheckItemClassCd, // 분류코드
      ramCheckItemClassName: _props.row.ramCheckItemClassName, // 분류코드
      checkItemId: _props.row.checkItemId, // 분류id
      checkItemName: _props.row.checkItemName, // 분류명
      checklistQuestion: '', // 체크리스트 문항
      ramInspectResultCd: 'RIR0000001',
      regUserId: user.value.userId, // 작성자 ID
      targetEditFlag: idx > -1 ? '' : 'C',
      scenarioEditFlag: 'C',
      editFlag: 'C'
    })
  }
}
function saveTarget() {
  if (validTable(grid.value.columns, props.processData.targets)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        targetScenarioSave.value.ramRiskAssessmentPlanId = props.processData.ramRiskAssessmentPlanId
        targetScenarioSave.value.processCd = props.processData.processCd
        targetScenarioSave.value.targets = []
        targetScenarioSave.value.scenarios = []
        const tempTargets = [] as any

        _.forEach(props.processData.targets, (target) => {
          if (
            _.findIndex(tempTargets, {
              ramCheckItemClassCd: target.ramCheckItemClassCd,
              checkItemName: target.checkItemName
            }) === -1 &&
            target.targetEditFlag
          ) {
            tempTargets.push(target)
          }
        })
        targetScenarioSave.value.targets = _.map(tempTargets, (target1) => {
          return _.extend(target1, {
            editFlag: target1.editFlag
          })
        })
        targetScenarioSave.value.scenarios = _.map(props.processData.targets, (target2) => {
          return _.extend(target2, {
            editFlag: target2.scenarioEditFlag
          })
        })

        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveTargetCallback() {
  message.requestSuccess()
  emits('saveCallback', props.processData.ramRiskAssessmentPlanId)
  getTargets()
}
function removeScenario() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    const _message =
      '관련되어 있는 정보 및 개선사항, 위험등록부가 같이 삭제됩니다. 진행하시겠습니까?'
    message.confirm({
      title: '확인',
      message: _message,
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            props.processData.targets = _.reject(props.processData.targets, item)
          })
          table.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
