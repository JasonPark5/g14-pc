<template>
  <q-form ref="editForm">
    <c-card title="조사계획" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="!disabled && !isInvestY"
            :url="updateUrl"
            :isSubmit="isSave"
            :param="accidentInfo"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveAccident"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-9 col-sm-9 col-md-3 col-lg-3 col-xl-3">
          <c-radio
            :required="true"
            :editable="editable"
            :disabled="disabled || accidentInfo.accidentStatusCd === 'ISPC000004'"
            :comboItems="checkTargetItems"
            :range="true"
            label="조사대상 여부"
            name="investigationFlag"
            v-model:value="accidentInfo.investigationFlag"
            @datachange="datachange"
          />
        </div>
        <div class="col-xs-9 col-sm-9 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :editable="editable"
            :disabled="disabled || isInvestY"
            :range="true"
            label="기간"
            name="investigationDate"
            v-model:value="accidentInfo.investigationDate"
          />
        </div>
        <div class="col-xs-4 col-sm-4 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled || isInvestY"
            label="계획"
            autogrow
            name="investigationPlan"
            v-model:value="accidentInfo.investigationPlan"
          />
        </div>
      </template>
    </c-card>
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-table
        ref="table"
        title="사고조사팀"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="accidentInfo.accidentInvestigationTeamModelList"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :editable="editable && !disabled && !isInvestY"
        selection="multiple"
        rowKey="researcherId"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled && !isInvestY"
              :showLoading="false"
              label="추가"
              icon="add"
              @btnClicked="add"
            />
            <c-btn
              v-if="
                editable &&
                !disabled &&
                !isInvestY &&
                accidentInfo.accidentInvestigationTeamModelList!.length > 0
              "
              :showLoading="false"
              label="제외"
              icon="remove"
              @btnClicked="remove"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { processAccidentInvestiationType, processAccidentPopupParamType } from '../processAccident'

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
  name: 'processAccidentReceptionPlan'
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
const emits = defineEmits(['currentStep', 'getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: processAccidentPopupParamType
  accidentInfo: processAccidentInvestiationType
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      iimAccidentId: '',
      stepCd: '',
      count: 0
    }
  },
  accidentInfo: () => {
    return {
      iimAccidentId: '',
      investigationFlag: '',
      investigationDate: '',
      investigationPlan: '',
      reportDate: '',
      occurrenceCause: '',
      accidentDamageHistory: '',
      emergencyMeasures: '',
      materialLossHistory: '',
      materialLossAmount: '',
      enviromentLeakInformation: '',
      enviromentImpactHistory: '',
      accidentStatusCd: '',

      accidentInvestigationTeamModelList: [],
      deleteInvestigationTeamModelList: [],
      accidentVictimModelList: [],
      deleteAccidentVictimModelList: []
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<any>({
  columns: [
    {
      name: 'researcherDeptName',
      field: 'researcherDeptName',
      label: '부서',
      style: 'width:20%',
      align: 'center',
      sortable: false
    },
    {
      name: 'researcherName',
      field: 'researcherName',
      label: '이름',
      style: 'width:20%',
      align: 'center',
      sortable: false
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      label: '생년월일',
      style: 'width:20%',
      align: 'center',
      sortable: false
    },
    {
      name: 'researcherPosition',
      field: 'researcherPosition',
      label: '직급',
      style: 'width:20%',
      align: 'center',
      sortable: false
    },
    {
      name: 'researcherRole',
      field: 'researcherRole',
      label: '역할',
      type: 'text',
      align: 'left',
      sortable: false
    }
  ],
  data: [],
  height: '300px'
})
const checkTargetItems = ref<any>([])
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const getVictimUrl = ref('')
const table = ref<any>(null)
const editForm = ref<any>(null)
const isSave = ref(false)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    editable.value && Boolean(props.popupParam.stepCd) && props.popupParam.stepCd === 'ISPC000005'
)
const isInvestY = computed(() => Boolean(props.accidentInfo.investigationFlag === 'N'))
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.popupParam.count,
  () => {
    getVictimDetail()
  }
)

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
  getVictimUrl.value = selectConfig.sop.iim.accident.process.investigation.victim.get.url
  insertUrl.value = transactionConfig.sop.iim.accident.process.investigation.insert.url
  updateUrl.value = transactionConfig.sop.iim.accident.process.investigation.update.url
  deleteUrl.value = transactionConfig.sop.iim.accident.process.delete.url
  // code setting
  checkTargetItems.value = [
    { code: 'Y', codeName: $language('대상') },
    { code: 'N', codeName: $language('비대상') }
  ]
  // list setting
}
/******************************
 * TODO (목적): 사고자 조회
 *******************************/
function getVictimDetail() {
  if (props.popupParam.iimAccidentId) {
    $http({
      url: $format(getVictimUrl.value, props.popupParam.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      props.accidentInfo.accidentVictimModelList = _.clone(_result.data)
      if (_result.data) {
        _.forEach(props.accidentInfo.accidentVictimModelList, (_item) => {
          if (_item.expectTreatmentDate) {
            _item.expectTreatmentDate = _item.expectTreatmentDate.split(',')
          }
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 사고자 추가
 *******************************/
function add() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 사고자 추가 팝업 닫기 콜백
 *******************************/
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(props.accidentInfo.accidentInvestigationTeamModelList, {
        researcherId: _item.userId
      })
      if (index === -1) {
        props.accidentInfo.accidentInvestigationTeamModelList!.splice(0, 0, {
          iimAccidentId: props.popupParam.iimAccidentId,
          researcherNo: uid(),
          researcherDeptName: _item.deptName,
          researcherId: _item.userId,
          researcherName: _item.userName,
          birthDate: _item.birthDate,
          researcherRole: '',
          researcherPosition: _item.spotName,
          insideOutsideTypeCd: null,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 사고자 삭제
 *******************************/
function remove() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      props.accidentInfo.accidentInvestigationTeamModelList = _.reject(
        props.accidentInfo.accidentInvestigationTeamModelList,
        { researcherId: item.researcherId }
      )
    })
    _.forEach(selectData, (item) => {
      if (!props.accidentInfo.deleteAccidentInvestigationTeamModelList) {
        props.accidentInfo.deleteAccidentInvestigationTeamModelList = []
      }
      if (
        _.findIndex(props.accidentInfo.deleteAccidentInvestigationTeamModelList, {
          researcherId: item.researcherId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.accidentInfo.deleteAccidentInvestigationTeamModelList.push(item)
      }
      props.accidentInfo.accidentInvestigationTeamModelList = _.reject(
        props.accidentInfo.accidentInvestigationTeamModelList,
        { researcherId: item.researcherId }
      )
    })
  }
}
/******************************
 * TODO (목적): 조사계획 저장
 *******************************/
function saveAccident() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          if (props.accidentInfo.investigationDate) {
            props.accidentInfo.investigationDate = props.accidentInfo.investigationDate.join()
          }
          if (props.accidentInfo.accidentVictimModelList) {
            _.forEach(props.accidentInfo.accidentVictimModelList, (_item) => {
              if (_item.expectTreatmentDate)
                _item.expectTreatmentDate = _item.expectTreatmentDate.join()
            })
          }
          props.accidentInfo.regUserId = user.value.userId
          props.accidentInfo.chgUserId = user.value.userId

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
 * TODO (목적): 조사계획 저장 콜백
 *******************************/
function saveCallback(result: any) {
  props.popupParam.iimAccidentId = result.data
  message.requestSuccess()
  emits('getDetail')
  emits('currentStep')
}
/******************************
 * TODO (목적): 조사 대상/비대상 여부
 *******************************/
function datachange() {
  if (props.accidentInfo.investigationFlag === 'N' && !isInvestY.value) {
    message.confirm({
      title: '확인',
      message: '조사정보가 초기화 됩니다. 변경하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        props.accidentInfo.deleteAccidentInvestigationTeamModelList = _.clone(
          props.accidentInfo.accidentInvestigationTeamModelList
        ) // 조사인원 데이터
        props.accidentInfo.accidentInvestigationTeamModelList = [] // 조사인원 데이터
        props.accidentInfo.investigationDate = null
        props.accidentInfo.investigationPlan = ''
        props.accidentInfo.reportDate = ''
        props.accidentInfo.occurrenceCause = ''
        props.accidentInfo.emergencyMeasures = ''
        props.accidentInfo.accidentDamageHistory = ''
        props.accidentInfo.materialLossHistory = ''
        props.accidentInfo.materialLossAmount = ''
        props.accidentInfo.enviromentLeakInformation = ''
        props.accidentInfo.enviromentImpactHistory = ''
        if (props.accidentInfo.investigationDate) {
          props.accidentInfo.investigationDate = props.accidentInfo.investigationDate.join()
        }
        if (props.accidentInfo.accidentVictimModelList) {
          _.forEach(props.accidentInfo.accidentVictimModelList, (_item) => {
            if (_item.expectTreatmentDate)
              _item.expectTreatmentDate = _item.expectTreatmentDate.join()
          })
        }
        $http({
          url: transactionConfig.sop.iim.accident.process.investigation.update.url,
          method: 'PUT',
          data: props.accidentInfo
        }).then((_result: any) => {
          $http({
            url: transactionConfig.sop.iim.accident.process.investigation.update.status.url,
            method: 'PUT',
            data: {
              investigationFlag: props.accidentInfo.investigationFlag,
              iimAccidentId: props.accidentInfo.iimAccidentId,
              accidentStatusCd: 'ISPC000002'
            }
          }).then((_result: any) => {
            emits('getDetail')
          })
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {
        props.accidentInfo.investigationFlag = 'Y'
      }
    })
    // 상태변경
  } else if (props.accidentInfo.investigationFlag === 'Y') {
    $http({
      url: transactionConfig.sop.iim.accident.process.investigation.update.status.url,
      method: 'PUT',
      data: {
        investigationFlag: props.accidentInfo.investigationFlag,
        iimAccidentId: props.accidentInfo.iimAccidentId,
        accidentStatusCd: 'ISPC000003'
      }
    }).then((_result: any) => {})
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
