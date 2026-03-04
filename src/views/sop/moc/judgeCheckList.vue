<template>
  <div style="width: 100%; padding: 0.5rem !important">
    <q-form ref="editForm">
      <c-card v-show="!onePage" title="요청상세" class="cardClassDetailForm q-mb-sm q-mt-sm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn v-show="deletable" label="삭제" icon="remove" @btnClicked="removeMoc" />
            <c-btn
              v-show="deletable"
              :isSubmit="isComplete"
              :url="completeUrl"
              :param="moc"
              mappingType="PUT"
              label="완료"
              icon="check"
              @beforeAction="completeMoc"
              @btnCallback="completeMocCallback"
            />
            <c-btn
              v-show="editable && !disabledTask"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="moc"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveMoc"
              @btnCallback="saveMocCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :required="true"
              :disabled="disabledTask"
              :editable="editable"
              label="제목"
              name="mocTitle"
              v-model:value="moc.mocTitle"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-plant
              :required="true"
              :disabled="disabledTask"
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="moc.plantCd"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              :disabled="true"
              :editable="editable"
              codeGroupCd="MOC_TYPE_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="mocTypeCd"
              label="변경구분"
              v-model:value="moc.mocTypeCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              :disabled="true"
              label="MOC번호"
              name="mocNo"
              v-model:value="moc.mocNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              :disabled="true"
              label="발의부서/이름"
              name="initiative"
              v-model:value="initiative"
            />
          </div>
        </template>
      </c-card>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-7">
          <c-table
            title="기기 및 물질의 변경판정 기준"
            :columns="grid.columns"
            :gridHeight="gridHeight"
            :data="moc.checklistEquips"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :editable="editable && !disabledTask && !props.disabled"
            :contentsField="contentsField"
            @table-data-change="tableDataChange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-5">
          <c-table
            title="정비·운전 변경여부 판정 기준"
            :columns="grid2.columns"
            :gridHeight="gridHeight"
            :data="moc.checklistDrives"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :editable="editable && !disabledTask && !props.disabled"
            :contentsField="contentsField"
            @table-data-change="tableDataChange"
          />
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
import { mocType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'judgeCheckList'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user, auths } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    sopMocId: stringNull
    mocTypeCd: stringNull
    mocStepCd: stringNull
  }
  height?: string
  onePage?: boolean
  disabled?: boolean
}
interface gridType {
  columns: Array<tableColumnType>
  filterData: Array<any>
  saveData: {
    sopMocId: stringNull
    checklists: Array<any>
  }
  itemCds: Array<string>
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
  param: () => {
    return {
      sopMocId: '',
      mocTypeCd: '',
      mocStepCd: ''
    }
  },
  height: '',
  onePage: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref<gridType>({
  columns: [
    {
      name: 'mocCheckItemName',
      field: 'mocCheckItemName',
      label: '변경요소',
      align: 'center',
      sortable: true,
      style: 'width:130px'
    }
  ],
  filterData: [],
  saveData: {
    sopMocId: '',
    checklists: []
  },
  itemCds: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'mocCheckItemName',
      field: 'mocCheckItemName',
      label: '변경요소',
      align: 'center',
      sortable: true,
      style: 'width:130px'
    }
  ],
  filterData: [],
  saveData: {
    sopMocId: '',
    checklists: []
  },
  itemCds: []
})
const moc = ref<mocType>({
  sopMocId: '', // MOC 일련번호
  mocNo: '', // moc 관리번호
  plantCd: '', // 사업장 코드
  processCd: '', // 공정
  judgmentUserId: '', // 판정자 ID
  judgmentUserName: '', // 판정자 명
  initiativeUserId: '', // 발의자 ID
  initiativeUserName: '', // 발의자 명
  initiativeDeptCd: '', // 발의 부서 코드
  initiativeDeptName: '', // 발의 부서명
  mocTitle: '', // 변경관리 제목
  mocSummary: '', // 변경 개요
  mocTypeCd: 'MT00000001', // 변경구분_공통코드(정상/비상/임시)
  mocWriteLevelCd: null, // 변경등급_작성
  mocConfirmLevelCd: null, // 변경등급_검토
  processSatefySecureMeasures: '', // 공정안전 확보 대책
  technicalBasisProcessDesign: '', // 변경계획에 대한 공정 및 설계의 기술근거
  safetyReliabilityImprovementEffect: '', // 안전성에 필요한 사항 및 신뢰성 향상 효과
  leaderOpinion: '', // 팀장의견
  relatedLaws: '', // 관련 볍령_텍스트
  processRiskAssessFlag: '', // 공정위험성 평가 여부
  jobRiskAssessFlag: '', // 작업위헝성 평가 여부
  mocPeriod: [],
  mocStartDate: '', // 변경 시작일
  mocEndDate: '', // 변경 종료일
  mocStepCd: '', // 변경관리 단계
  mocActionDeptCd: '', // 변경실행 부서코드
  mocActionResponsibilityUserId: '', // 변경실행 책임자 ID
  mocCompleteCheckUserId: '', // 변경완료 확인자 ID
  mocCompleteCheckDeptCd: '', // 변경완료 확인 부서 코드
  mocCompleteOpinion: '', // 변경완료 의견
  mocBenefitCds: '', // 변경관리 기대효과_복수
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  checklists: [],
  checklistEquips: [],
  checklistDrives: []
})
const baseUrl = ref('')
const detailUrl = ref('')
const saveUrl = ref('')
const completeUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const isComplete = ref(false)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  const heightNum = _.replace(props.height, 'px', '')
  return heightNum ? Number(heightNum) - 190 + 'px' : '500px'
})
const disabledTask = computed(() => {
  if (isEnvSafDept.value) {
    return false
  } else {
    // 비상변경에 대해서는 생각하지 않음
    return disabled2.value
  }
})
const disabled2 = computed(() => {
  // 비상변경에 대해서는 생각하지 않음
  const stepCheck = props.param.mocTypeCd === 'MT00000001' ? 'MS00000000' : 'MT00000000'
  return props.param.mocStepCd !== stepCheck && Boolean(props.param.sopMocId)
})
const initiative = computed(
  () => moc.value.initiativeDeptName + ' / ' + moc.value.initiativeUserName
)
const isEnvSafDept = computed(
  // 안전환경팀 수정권한
  () => _.indexOf(auths.value, 'SAGI000021') > -1 || user.value.empNo === 'admin'
)
const deletable = computed(
  () => editable.value && !disabled2.value && Boolean(props.param.sopMocId)
)

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
  detailUrl.value = selectConfig.sop.moc.change.judgeCheckList.get.url
  baseUrl.value = selectConfig.sop.moc.change.judgeCheckList.base.url
  saveUrl.value = transactionConfig.sop.moc.checklist.save.url
  completeUrl.value = transactionConfig.sop.moc.change.complete.url
  deleteUrl.value = transactionConfig.sop.moc.change.delete.url
  // code setting
  getComboItems('MOC_CHECK_TYPE_CD').then((_result: any) => {
    const columns1 = _.filter(_result, { attrVal1: 'equip' })
    const columns2 = _.filter(_result, { attrVal1: 'check-dirve' })

    grid.value.itemCds = _.map(columns1, 'code') as Array<codeMasterType>
    grid2.value.itemCds = _.map(columns2, 'code') as Array<codeMasterType>

    if (columns1 && columns1.length > 0) {
      _.forEach(columns1, (column) => {
        grid.value.columns.push({
          name: column.code,
          field: column.code,
          label: $language(column.codeName),
          align: 'center',
          sortable: true,
          style: 'width:' + String(30 + column.codeName.length * 10) + 'px',
          type: 'check',
          true: 'Y',
          false: 'N'
        })
      })
    }
    if (columns2 && columns2.length > 0) {
      _.forEach(columns2, (column) => {
        grid2.value.columns.push({
          name: column.code,
          field: column.code,
          label: $language(column.codeName),
          align: 'center',
          sortable: true,
          style: 'width:' + String(30 + column.codeName.length * 10) + 'px',
          type: 'check',
          true: 'Y',
          false: 'N'
        })
      })
    }
  })
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): MOC 상세 정보 조회
 *******************************/
function getDetail() {
  if (props.param.sopMocId) {
    $http({
      url: $format(detailUrl.value, props.param.sopMocId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(moc.value, _result.data)
    })
  } else {
    $http({
      url: baseUrl.value,
      method: 'GET'
    }).then((_result: any) => {
      _.extend(moc.value, _result.data)
      moc.value.plantCd = user.value.plantCd
      moc.value.initiativeUserId = user.value.userId
      moc.value.initiativeUserName = user.value.userName
      moc.value.initiativeDeptCd = user.value.deptCd
      moc.value.initiativeDeptName = user.value.deptName
      moc.value.initiativeDt = getToday()
      moc.value.regUserId = user.value.userId
      moc.value.mocTypeCd = props.param.mocTypeCd
      if (!moc.value.mocStepCd) {
        moc.value.mocStepCd = props.param.mocTypeCd === 'MT00000001' ? 'MS00000000' : 'MT00000000'
      }
    })
  }
}
/******************************
 * TODO (목적): 판정 체크박스 표시 여부 체크
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 * @return (반환): 판정 체크박스 표시 여부
 *******************************/
function contentsField(_props: any, col: tableColumnType) {
  let returnVal = true
  if (col.name !== 'mocCheckItemName') {
    returnVal = _props.row[col.name + '_use_flag'] === 'Y'
  }
  return returnVal
}
/******************************
 * TODO (목적): 판정 데이터 변경 시 edit flag 처리
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tableDataChange(_props: any, col: tableColumnType) {
  if (_props.row[col.name + '_edit_flag'] !== 'C') _props.row[col.name + '_edit_flag'] = 'U'
}
/******************************
 * TODO (목적): MOC 저장 전 처리
 *******************************/
function saveMoc() {
  editForm.value.validate().then((_result: boolean) => {
    if (
      _result &&
      validTable(grid.value.columns, moc.value.checklistEquips) &&
      validTable(grid2.value.columns, moc.value.checklistDrives)
    ) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          moc.value.regUserId = user.value.userId
          moc.value.chgUserId = user.value.userId

          // 설비별 변경여부 판정 기준
          moc.value.checklists = []
          _.forEach(moc.value.checklistEquips, (item) => {
            for (const key in item) {
              if (_.indexOf(grid.value.itemCds, key) > -1) {
                moc.value.checklists!.push({
                  sopMocId: props.param.sopMocId, // MOC 일련번호
                  mocCheckTypeCd: key, // 체크 구분 코드
                  mocCheckItemCd: item.mocCheckItemCd, // 체크 항목 코드
                  mocChecklistTypeCd: 'MCT0000001', // 체크리스트 타입 코드
                  checkFlag: item[key], // 사용 여부
                  regUserId: user.value.userId, // 등록자 ID
                  chgUserId: user.value.userId, // 수정자 ID
                  editFlag: item[key + '_edit_flag']
                })
              }
            }
          })

          // 정비운전 변경여부 판정 기준
          _.forEach(moc.value.checklistDrives, (item) => {
            for (const key in item) {
              if (_.indexOf(grid2.value.itemCds, key) > -1) {
                moc.value.checklists!.push({
                  sopMocId: props.param.sopMocId, // MOC 일련번호
                  mocCheckTypeCd: key, // 체크 구분 코드
                  mocCheckItemCd: item.mocCheckItemCd, // 체크 항목 코드
                  mocChecklistTypeCd: 'MCT0000005', // 체크리스트 타입 코드
                  checkFlag: item[key], // 사용 여부
                  regUserId: user.value.userId, // 등록자 ID
                  chgUserId: user.value.userId, // 수정자 ID
                  editFlag: item[key + '_edit_flag']
                })
              }
            }
          })

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
 * TODO (목적): MOC 저장 후 처리
 * @param (1): API 반환 값
 *******************************/
function saveMocCallback(_result: any) {
  message.requestSuccess()
  props.param.sopMocId = _result.data
  if (!props.param.mocStepCd) {
    props.param.mocStepCd = props.param.mocTypeCd === 'MT00000001' ? 'MS00000000' : 'MT00000000'
  }
  emits('emitStep', {
    name: 'keySetting',
    param: _result.data
  })
  getDetail()
}
/******************************
 * TODO (목적): MOC 완료 전 처리
 *******************************/
function completeMoc() {
  // 판정이 하나라도 이루어 졌는지?
  let isProgress = true
  if (moc.value.checklistEquips && moc.value.checklistEquips.length > 0) {
    let isChecklist = false
    _.forEach(moc.value.checklistEquips, (item) => {
      for (const key in item) {
        if (_.indexOf(grid.value.itemCds, key) > -1 && item[key] === 'Y') {
          isChecklist = true
          break
        }
      }
      if (isChecklist) {
        return false
      }
    })
    if (!isChecklist) {
      _.forEach(moc.value.checklistDrives, (item) => {
        for (const key in item) {
          if (_.indexOf(grid2.value.itemCds, key) > -1 && item[key] === 'Y') {
            isChecklist = true
            break
          }
        }
        if (isChecklist) {
          return false
        }
      })
      if (!isChecklist) {
        isProgress = false
        message.alert({
          title: '안내',
          message: '판정이 이루어지지 않았습니다. 체크리스트 중 하나 이상 판정을 해주십시오.',
          type: 'warning' // success / info / warning / error
        })
      }
    }
  }

  if (isProgress) {
    message.confirm({
      title: '확인',
      message: '완료하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        moc.value.chgUserId = user.value.userId
        moc.value.mocStepCd = props.param.mocTypeCd === 'MT00000001' ? 'MS00000001' : 'MT00000001'

        isComplete.value = !isComplete.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): MOC 완료 후 처리
 *******************************/
function completeMocCallback() {
  message.requestSuccess()
  // 계획 상세 조회
  getDetail()
  // stepper 이동
  emits('emitStep', {
    name: 'stepBystep',
    param: moc.value.mocStepCd
  })
}
/******************************
 * TODO (목적): MOC 삭제
 *******************************/
function removeMoc() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.sopMocId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('emitStep', {
          name: 'closePopup'
        })
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
