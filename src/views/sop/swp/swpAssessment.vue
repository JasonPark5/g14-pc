<template>
  <div class="swp-assessment">
    <c-card title="작업 위험성평가">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && isWriting"
            label="허가서에서 발급정보 가져오기"
            icon="save_alt"
            :showLoading="false"
            @btnClicked="setPermitData"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-field
            :disabled="!isWriting"
            :editable="editable"
            :data="workPermit"
            deptValue="assessWriteDeptCd"
            type="dept_user"
            label="발급"
            name="assessWriteUserId"
            v-model:value="workPermit.assessWriteUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-field
            :disabled="!isWriting"
            :editable="editable"
            :data="workPermit"
            deptValue="assessApprovalDeptCd"
            type="dept_user"
            label="승인"
            name="assessApprovalUserId"
            v-model:value="workPermit.assessApprovalUserId"
          />
        </div>
        <div class="col-12">
          <c-table
            :columns="checkGrid.columns"
            :data="checkGrid.data"
            customDataTr
            gridHeightAuto
            hideHeader
            hideBottom
            :isTitle="false"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
            :hideBorder="true"
          >
            <template v-slot:customDataTr="props">
              <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
                <q-td class="text-center th-td-style th-style" :rowspan="1" :colspan="6">
                  <span>
                    {{ $language('잠재위험요소 (해당 항목에 Check하고 안전조치를 취할 것)') }}
                  </span>
                </q-td>
              </q-tr>
              <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
                <q-td class="text-center th-td-style td-style" :rowspan="1" :colspan="1">
                  <c-checkbox
                    :isArray="false"
                    :disabled="!isWriting"
                    :editable="editable"
                    codeGroupCd="SOP_ASSESSMENT_CHECK_TYPE_CD1"
                    valueText="codeName"
                    valueKey="code"
                    label=""
                    name="sopAssessmentCheckTypeCd1"
                    v-model:value="workPermit.sopAssessmentCheckTypeCd1"
                  />
                </q-td>
                <q-td class="text-center th-td-style td-style" :rowspan="1" :colspan="1">
                  <c-checkbox
                    :isArray="false"
                    :disabled="!isWriting"
                    :editable="editable"
                    codeGroupCd="SOP_ASSESSMENT_CHECK_TYPE_CD2"
                    valueText="codeName"
                    valueKey="code"
                    label=""
                    name="sopAssessmentCheckTypeCd2"
                    v-model:value="workPermit.sopAssessmentCheckTypeCd2"
                  />
                </q-td>
                <q-td class="text-center th-td-style td-style" :rowspan="1" :colspan="1">
                  <c-checkbox
                    :isArray="false"
                    :disabled="!isWriting"
                    :editable="editable"
                    codeGroupCd="SOP_ASSESSMENT_CHECK_TYPE_CD3"
                    valueText="codeName"
                    valueKey="code"
                    label=""
                    name="sopAssessmentCheckTypeCd3"
                    v-model:value="workPermit.sopAssessmentCheckTypeCd3"
                  />
                </q-td>
                <q-td class="text-center th-td-style td-style" :rowspan="1" :colspan="1">
                  <c-checkbox
                    :isArray="false"
                    :disabled="!isWriting"
                    :editable="editable"
                    codeGroupCd="SOP_ASSESSMENT_CHECK_TYPE_CD4"
                    valueText="codeName"
                    valueKey="code"
                    label=""
                    name="sopAssessmentCheckTypeCd4"
                    v-model:value="workPermit.sopAssessmentCheckTypeCd4"
                  />
                </q-td>
                <q-td class="text-center th-td-style td-style" :rowspan="1" :colspan="1">
                  <c-checkbox
                    :isArray="false"
                    :disabled="!isWriting"
                    :editable="editable"
                    codeGroupCd="SOP_ASSESSMENT_CHECK_TYPE_CD5"
                    valueText="codeName"
                    valueKey="code"
                    label=""
                    name="sopAssessmentCheckTypeCd5"
                    v-model:value="workPermit.sopAssessmentCheckTypeCd5"
                  />
                </q-td>
                <q-td class="text-center th-td-style td-style" :rowspan="1" :colspan="1">
                  <c-checkbox
                    :isArray="false"
                    :disabled="!isWriting"
                    :editable="editable"
                    codeGroupCd="SOP_ASSESSMENT_CHECK_TYPE_CD6"
                    valueText="codeName"
                    valueKey="code"
                    label=""
                    name="sopAssessmentCheckTypeCd6"
                    v-model:value="workPermit.sopAssessmentCheckTypeCd6"
                  />
                </q-td>
              </q-tr>
            </template>
          </c-table>
        </div>
      </template>
    </c-card>
    <c-table
      ref="table"
      class="q-mt-sm"
      title="안전조치사항"
      :columns="gridColumns"
      :gridHeight="grid.height"
      :data="workPermit.assessments"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && isWriting"
      selection="multiple"
      rowKey="sopWorkSopAssessmentId"
    >
      <!-- @table-data-change="tableDataChange" -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && isWriting"
            label="추가"
            icon="add"
            :showLoading="false"
            @btnClicked="add"
          />
          <c-btn
            v-if="editable && isWriting && workPermit.assessments.length > 0"
            label="제외"
            icon="remove"
            :showLoading="false"
            @btnClicked="remove"
          />
        </q-btn-group>
      </template>
    </c-table>
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
import { riskThirdStandardType } from '@/views/ram/base/riskThirdStandard'
import { workPermitType } from './safeWorkPermit'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'swpAssessment'
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
  workPermit: workPermitType
  isWriting: boolean
}
// interface checkFiveType {
//   bool: boolean
//   type?: string
// }

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  workPermit: () => {
    return {
      sopWorkPermitId: '', // 작업허가서 일련번호
      plantCd: '', // 사업장 코드
      sopName: '', // 작업명
      mdmSopId: '', // 안전작업 표준 일련번호_SOP에서 불러와서 관련 정보 표시후 수정
      permitNo: '', // 허가번호_(YYYYMMDD-01)
      swpStepCd: '', // 진행단계 코드
      applicationDeptCd: '', // 신청인 부서코드
      applicationDeptName: '',
      applicationUserId: '', // 신청인 ID
      applicationUserName: '',
      permitTypeCd: '', // 허가서 구분_화기/일반
      permitDate: '', // 허가일
      workStartTime: '', // 작업시작시간
      workEndTime: '', // 작업종료시간
      workTime: [], // 작업시간
      processCd: '', // 작업공정
      workLocation: '', // 작업장소
      equipmentCd: '', // 설비번호_설비마스터
      workSummary: '', // 작업개요
      specialRequirements: '', // 특별요구사항
      cancelRemark: '', // 취소사유
      actionRemark: '', // 조치사항
      maintenanceDeptCheckUserId: '', // 정비부서 책임자 - 안전조치확인
      maintenanceDeptEntryUserId: '', // 정비부서 입회자 - 안전조치확인
      workCompleteTime: '', // 작업완료시간
      workCompleteEntryUserId: '', // 작업완료 입회자/확인자
      workCompleteWorkUserId: '', // 작업완료 작업자
      issuedDeptCd: '', // 발급자 부서코드
      issuedUserId: '', // 발급자 ID
      workManagerId: '', //담당자id
      approvalDeptCd: '', // 승인자 부서코드
      approvalUserId: '', // 승인자 ID
      relationCooperation1DeptCd: '', // 관련부서 협조자1 부서코드
      relationCooperation1UserId: '', // 관련부서 협조자1 ID
      relationCooperation2DeptCd: '', // 관련부서 협조자2 부서코드
      relationCooperation2UserId: '', // 관련부서 협조자2 ID
      vendorCd: '', // 작업업체 코드
      overWorkFlag: '', // 연장작업 여부
      psmFlag: 'N', // PSM 관련 여부
      sopMocId: '', // MOC 일련번호
      assessWriteUserId: '', // 작업위험성평가_작성자 ID
      assessApprovalUserId: '', // 작업위험성평가_승인자 ID
      swpWorkRequestCd: '', // 작업허가요청
      returnRemark: '', // 반려사유
      vendorFlag: 0, // 업체작성여부
      sopAssessmentCheckTypeCd1: '', // 잠재위험요소1
      sopAssessmentCheckTypeCd2: '', // 잠재위험요소2
      sopAssessmentCheckTypeCd3: '', // 잠재위험요소3
      sopAssessmentCheckTypeCd4: '', // 잠재위험요소4
      sopAssessmentCheckTypeCd5: '', // 잠재위험요소5
      sopAssessmentCheckTypeCd6: '', // 잠재위험요소6
      sopConstructionId: '',
      fireWatchmanId: '', // 화재감시자
      fireWorkClassification: '', // 화기 작업구분
      fireWorkClassificationEtc: '', // 화기 작업구분
      fireSafetyManagerId: '', // 소방안전관리자
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      supWorks: [],
      deleteSupWorks: [],
      checkResults: [],
      deleteCheckResults: [],
      gases: [], // 조회용
      gasChecks: [], // 저장용
      deleteGasChecks: [],
      deleteGasCheckVals: [],
      maps: [],
      deleteMaps: [],
      workers: [],
      deleteWorkers: [],
      assessments: [],
      deleteAssessments: [],
      overs: [],
      deleteOvers: [],
      protectiveGears: [],
      deleteProtectiveGears: [],
      lotos: [],
      deleteLotos: [],
      checklistResults: [],
      deleteChecklistResults: [],
      approvalStatusCd: '', // 결재관련 결재상태
      sysApprovalRequestId: '' // 결재관련 결재요청코드
    }
  },
  isWriting: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const checkGrid = ref({
  columns: [
    {
      name: '1',
      field: '1'
    },
    {
      name: '2',
      field: '2'
    },
    {
      name: '3',
      field: '3'
    },
    {
      name: '4',
      field: '4'
    },
    {
      name: '5',
      field: '5'
    },
    {
      name: '6',
      field: '6'
    }
  ],
  data: [{}, {}]
})
const grid = ref({
  data: [],
  height: '400px'
})
const riskStandardItems = ref<Array<riskThirdStandardType>>([])
const listRiskStandardUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridColumns = computed(() => {
  return [
    {
      name: 'jobStepName',
      field: 'jobStepName',
      label: '작업단계',
      align: 'center',
      type: 'text',
      style: 'width: 20%',
      sortable: false
    },
    {
      name: 'riskHazardName',
      field: 'riskHazardName',
      label: '잠재위험요소',
      align: 'left',
      type: 'text',
      style: 'width: 25%',
      sortable: false
    },
    {
      name: 'riskThirdBeforeId',
      field: 'riskThirdBeforeId',
      label: '개선전 판단결과',
      align: 'center',
      style: 'width: 8%',
      sortable: false,
      type: 'select',
      itemText: 'ramRiskLevelName',
      itemValue: 'ramRiskThirdStandardId',
      comboItems: _.cloneDeep(riskStandardItems.value),
      isChip: true,
      setHeader: true
    },
    {
      name: 'safetyActionMeasures',
      field: 'safetyActionMeasures',
      label: `개선대책 (개선전 판단결과 '상' 이상은 필수 개선)`,
      align: 'left',
      style: 'width: 30%',
      type: 'text',
      value: '',
      setHeader: true,
      sortable: false
    },
    {
      name: 'riskThirdAfterId',
      field: 'riskThirdAfterId',
      label: '개선후 판단결과',
      align: 'center',
      style: 'width: 8%',
      sortable: false,
      type: 'select',
      itemText: 'ramRiskLevelName',
      itemValue: 'ramRiskThirdStandardId',
      comboItems: _.cloneDeep(riskStandardItems.value),
      isChip: true,
      setHeader: true
    },
    {
      name: 'actionEducationFlag',
      field: 'actionEducationFlag',
      label: '조치/교육완료여부',
      align: 'center',
      type: 'check',
      style: 'width: 8%',
      true: 'Y',
      false: 'N',
      value: 'N',
      setHeader: true,
      sortable: false
    }
  ]
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
  listRiskStandardUrl.value = selectConfig.ram.riskThirdStandard.list.url
  // code setting
  // list setting
  getRiskStandardItems()
}
/******************************
 * TODO (목적): 위험성 기준 조회
 *******************************/
function getRiskStandardItems() {
  $http({
    url: listRiskStandardUrl.value,
    method: 'GET',
    params: {
      plantCd: props.workPermit.plantCd
    }
  }).then((_result: any) => {
    riskStandardItems.value = _.map(_result.data, (item) => {
      return _.extend(item, {
        attrVal1: item.riskColor
      })
    })
  })
}
/******************************
 * TODO (목적): 작업 위험성평가 추가
 *******************************/
function add() {
  if (!props.workPermit.assessments) props.workPermit.assessments = []
  props.workPermit.assessments.push({
    sopWorkSopAssessmentId: uid(), // 작업허가서_작업위험성평가_일련번호
    sopWorkPermitId: props.workPermit.sopWorkPermitId, // 작업허가서 일련번호
    jobStepName: '', // 작업단계 명
    riskHazardName: '', // 유해위험요인명
    safetyActionMeasures: '', // 안전조치사항
    actionEducationFlag: 'N', // 조치/교육완료여부
    beforeFrequency: null, // 개선전 빈도
    beforeStrength: null, // 개선전 강도
    beforeRisk: null, // 개선전 위험도
    riskThirdBeforeId: null,
    afterFrequency: null, // 개선후 빈도
    afterStrength: null, // 개선후 강도
    afterRisk: null, // 개선후 위험도
    riskThirdAfterId: null,
    regUserId: user.value.userId, // 등록자 ID
    chgUserId: '', // 수정자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 작업 위험성평가 제외
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
    if (!props.workPermit.deleteAssessments) props.workPermit.deleteAssessments = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.workPermit.deleteAssessments, {
          sopWorkSopAssessmentId: item.sopWorkSopAssessmentId
        }) === -1
      ) {
        props.workPermit.deleteAssessments.push(item)
      }
      props.workPermit.assessments = _.reject(props.workPermit.assessments, item)
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 발급자 승인자 불러오기
 *******************************/
function setPermitData() {
  props.workPermit.assessWriteDeptCd = _.clone(props.workPermit.issuedDeptCd)
  props.workPermit.assessWriteUserId = _.clone(props.workPermit.issuedUserId)
  props.workPermit.assessApprovalDeptCd = _.clone(props.workPermit.approvalDeptCd)
  props.workPermit.assessApprovalUserId = _.clone(props.workPermit.approvalUserId)
}
/******************************
 * TODO (목적): 작업 위험성평가 위험도 계산 (현재 사용 X, 3단계 판단으로 진행)
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
// function tableDataChange(_props: any, col: tableColumnType) {
//   if (!_props.row[col.name]) return
//   if (col.name === 'beforeFrequency' || col.name === 'beforeStrength') {
//     const c = checkFive(col.name, _props.row['beforeFrequency'], _props.row['beforeStrength'])
//     if (c.bool) {
//       const f = _props.row['beforeFrequency'] ? Number(_props.row['beforeFrequency']) : 0
//       const s = _props.row['beforeStrength'] ? Number(_props.row['beforeStrength']) : 0
//       _props.row.beforeRisk = f * s
//     } else {
//       message.alert({
//         title: '안내',
//         message: '1 ~ 5 사이로 지정해주세요.',
//         type: 'warning' // success / info / warning / error
//       })
//       _props.row[c.type === 'f' ? 'beforeFrequency' : 'beforeStrength'] = 0
//     }
//   } else if (col.name === 'afterFrequency' || col.name === 'afterStrength') {
//     const c = checkFive(col.name, _props.row['afterFrequency'], _props.row['afterStrength'])
//     if (c.bool) {
//       const f = _props.row['afterFrequency'] ? Number(_props.row['afterFrequency']) : 0
//       const s = _props.row['afterStrength'] ? Number(_props.row['afterStrength']) : 0
//       _props.row.afterRisk = f * s
//     } else {
//       message.alert({
//         title: '안내',
//         message: '1 ~ 5 사이로 지정해주세요.',
//         type: 'warning' // success / info / warning / error
//       })
//       _props.row[c.type === 'f' ? 'afterFrequency' : 'afterStrength'] = 0
//     }
//   }
// }
/******************************
 * TODO (목적): 빈도 / 강도 0 ~ 5로 입력되었는지 확인
 * @param (1): 컬럼 명
 * @param (2): 빈도
 * @param (3): 강도
 * @return (반환): 입력값 유효성 체크 및 빈도/강도 정보
 *******************************/
// function checkFive(colName: string, f: number, s: number) {
//   let result: checkFiveType = {
//     bool: false,
//     type: ''
//   }
//   if (colName.indexOf('Frequency') > -1) {
//     if (f && f >= 0 && f <= 5) {
//       result = {
//         bool: true
//       }
//     } else {
//       result = {
//         bool: false,
//         type: 'f'
//       }
//     }
//   } else if (colName.indexOf('Strength') > -1) {
//     if (s && s >= 0 && s <= 5) {
//       result = {
//         bool: true
//       }
//     } else {
//       result = {
//         bool: false,
//         type: 's'
//       }
//     }
//   }
//   return result
// }
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
