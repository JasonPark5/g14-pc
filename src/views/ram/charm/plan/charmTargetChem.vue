<template>
  <div class="row">
    <div class="col-12">
      <c-table
        ref="table"
        title="평가대상 목록 - 화학자재"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="processData.charmResultScenarios"
        :columnSetting="false"
        :expandAll="false"
        :isFullScreen="false"
        :usePaging="false"
        :filtering="false"
        :editable="editable && !disabled"
        selection="multiple"
        rowKey="mdmChemMaterialId"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable && !disabled && isSelect"
              label="추가"
              icon="add"
              @btnClicked="openChem"
            />
            <c-btn
              v-show="
                editable &&
                !disabled &&
                isSelect &&
                processData.charmResultScenarios &&
                processData.charmResultScenarios.length > 0
              "
              label="삭제"
              icon="remove"
              @btnClicked="removeChem"
            />
            <c-btn
              v-show="
                editable &&
                !disabled &&
                isSelect &&
                processData.charmResultScenarios &&
                processData.charmResultScenarios.length > 0
              "
              :isSubmit="isSave"
              :url="saveUrl"
              :param="processData.charmResultScenarios"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveChem"
              @btnCallback="saveChemCallback"
            />
          </q-btn-group>
        </template>
      </c-table>
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
import { processDataType } from '../../risk'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'charmTargetChem'
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
const emits = defineEmits(['saveProcess', 'research'])

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
      jobs: [],
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
  isFull: true,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'materialName',
      field: 'materialName',
      label: '화학자재',
      align: 'left',
      style: 'width:40%',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '제조 또는 사용여부',
      align: 'center',
      style: 'width:15%',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'usePurpose',
      field: 'usePurpose',
      label: '사용온도(℃)',
      align: 'left',
      style: 'width:20%',
      sortable: false,
      type: 'text'
    },
    {
      name: 'dailyVolume',
      field: 'dailyVolume',
      label: '일취급량',
      align: 'left',
      style: 'width:15%',
      sortable: false,
      required: true,
      type: 'number'
    },
    {
      required: true,
      name: 'volumeUnit',
      field: 'volumeUnit',
      label: '단위',
      align: 'left',
      style: 'width:10%',
      type: 'select',
      codeGroupCd: 'VOLUME_UNIT',
      sortable: false
    }
  ],
  data: [],
  height: '460px'
})
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isSelect = computed(() => {
  return props.processData &&
    props.processData.processCd &&
    props.processData.ramProcessAssessStepCd !== 'RPA0000005'
    ? true
    : false
})
const checkProcessCd = computed(() => {
  return props.processData.processCd.indexOf('WTE') === -1
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
  listUrl.value = selectConfig.ram.charm.scenario.result.url
  saveUrl.value = transactionConfig.ram.charm.scenario.target.url
  deleteUrl.value = transactionConfig.ram.charm.scenario.delete.url
  // code setting
  getComboItems('VOLUME_UNIT').then((_result: any) => {
    grid.value.columns = [
      {
        name: 'materialName',
        field: 'materialName',
        label: '화학자재',
        align: 'left',
        style: 'width:40%',
        sortable: false
      },
      {
        name: 'useFlag',
        field: 'useFlag',
        label: '제조 또는 사용여부',
        align: 'center',
        style: 'width:15%',
        sortable: false,
        type: 'check',
        true: 'Y',
        false: 'N'
      },
      {
        name: 'usePurpose',
        field: 'usePurpose',
        label: '사용용도',
        align: 'left',
        style: 'width:20%',
        sortable: false,
        type: 'text'
      },
      {
        name: 'daily',
        field: 'daily',
        label: '일취급',
        child: [
          {
            name: 'dailyVolume',
            field: 'dailyVolume',
            label: '양',
            align: 'left',
            style: 'width:15%',
            sortable: false,
            required: true,
            type: 'number'
          },
          {
            name: 'volumeUnit',
            field: 'volumeUnit',
            label: '단위',
            align: 'left',
            style: 'width:10%',
            sortable: false,
            required: true,
            type: 'select',
            comboItems: _result
          }
        ]
      }
    ]
  })
  // list setting
}

/******************************
 * TODO (목적): SOP 조회
 *******************************/
function getChems() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId,
      processCd: props.processData.processCd
    }
  }).then((_result: any) => {
    props.processData.charmResultScenarios = _result.data
  })
}
/******************************
 * TODO (목적): SOP 팝업
 *******************************/
function openChem() {
  popupOptions.value = getPopupOptions('materialProcess', popupOptions.value, closeChemPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: { processCd: checkProcessCd.value ? props.processData.processCd : '' }
  })
}
/******************************
 * TODO (목적): SOP 팝업 callback
 *******************************/
function closeChemPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.processData.charmResultScenarios, {
          mdmChemMaterialId: item.mdmChemMaterialId
        }) === -1
      ) {
        props.processData.charmResultScenarios.splice(0, 0, {
          ramCharmResultAssessScenarioId: uid(), // 시나리오 일련번호_시나리오의 한 라인(원일별)
          mdmChemMaterialId: item.mdmChemMaterialId,
          materialName: item.mdmChemMaterialName,
          useFlag: item.useFlag,
          usePurpose: item.usePurpose,
          dailyVolume: item.dailyVolume,
          volumeUnit: item.volumeUnit,
          ramRiskAssessmentPlanId: props.processData.ramRiskAssessmentPlanId, // 평가 일련번호
          processCd: props.processData.processCd, // 단위공정 코드
          processName: props.processData.processName,
          ramTechniqueCd: 'RT00000030',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveChem() {
  if (validTable(grid.value.columns, props.processData.charmResultScenarios)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(props.processData.charmResultScenarios, (_sop: any) => {
          _sop.chgUserId = user.value.userId
        })
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장 callback
 *******************************/
function saveChemCallback() {
  message.requestSuccess()
  emits('saveProcess', props.processData.processCd)
  emits('research')
  getChems()
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function removeChem() {
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
            props.processData.charmResultScenarios = _.reject(
              props.processData.charmResultScenarios,
              item
            )
          })
          emits('research')
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
