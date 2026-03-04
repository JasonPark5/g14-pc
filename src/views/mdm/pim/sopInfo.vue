<template>
  <div>
    <q-form ref="editForm">
      <c-card
        title="개정"
        class="cardClassDetailForm revisionLayout"
        topClass="topcolor-orange"
        v-if="isOld"
      >
        <template v-slot:card-detail>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-1">
            <c-text
              :required="editable && rev.isRevision"
              :editable="editable && rev.isRevision"
              label="개정번호"
              name="revisionNum"
              v-model:value="sop.revisionNum"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-4 col-lg-2">
            <c-text
              :editable="false"
              label="개정일시"
              name="regDtStr"
              v-model:value="sop.regDtStr"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-1">
            <c-text
              :editable="false"
              label="개정자"
              name="regUserName"
              v-model:value="sop.regUserName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <c-moc
              :editable="editable && rev.isRevision"
              :isSubmit="saveCallData"
              :document="sop"
              :documentId="popupParam.mdmSopId"
              documentTitle="diagramTitle"
              label="MOC번호"
              name="sopMocId"
              v-model:value="sop.sopMocId"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <c-text
              :required="editable && rev.isRevision"
              :editable="editable && rev.isRevision"
              label="개정사유"
              name="revisionContent"
              v-model:value="sop.revisionContent"
            />
          </div>
        </template>
      </c-card>
      <c-card title="SOP 정보" class="cardClassDetailForm">
        <template v-slot:card-select>
          <c-select
            v-if="isOld"
            :editable="editable && !rev.isRevision"
            :comboItems="sop.revs"
            type="custom"
            typetext="개정이력"
            itemText="revisionNum"
            itemValue="mdmSopId"
            label=""
            name="revSelectValue"
            v-model:value="sop.revSelectValue"
            @update:value="getRevVersion"
          />
        </template>
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-qr-btn
              v-if="editable && isOld && !rev.isRevision"
              :mobileUrl="'/mdm/pim/sopManage?mdmSopId=' + popupParam.mdmSopId"
              text-color="white"
            />
            <c-btn
              v-show="editable && isOld && !rev.isRevision"
              label="개정"
              icon="restart_alt"
              @btnClicked="setRevision"
            />
            <c-btn
              v-show="editable && isOld && rev.isRevision"
              label="개정취소"
              icon="restart_alt"
              @btnClicked="cancelRevision"
            />
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="sop"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveSopInfo"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <c-text
              :required="true"
              :editable="editable"
              label="안전작업표준 작업명"
              name="sopName"
              v-model:value="sop.sopName"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
            <c-select
              codeGroupCd="RAM_TECHNIQUE_HAZARD_TYPE_CD"
              type="search"
              itemText="codeName"
              itemValue="code"
              name="ramRiskHazardTechniqueCd"
              label="평가기법 분류"
              v-model:value="sop.ramRiskHazardTechniqueCd"
              @datachange="techDataChange"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
            <c-text
              :editable="editable"
              label="안전작업표준 관리번호"
              name="sopNo"
              v-model:value="sop.sopNo"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
            <c-task-target
              :required="true"
              :editable="editable"
              :customPopupParam="{ targetKey: 'process' }"
              label="단위공정"
              name="subProcessCd"
              v-model:value="sop.subProcessCd"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
            <c-select
              codeGroupCd="WORK_CLASS_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="workClassCd"
              label="작업구분"
              v-model:value="sop.workClassCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <c-dept-multi
              label="관리부서"
              :parentCheckDepts="sop.managementDepts"
              :plantCd="sop.plantCd"
              name="managementDepts"
              v-model:value="sop.managementDepts"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
            <c-select
              codeGroupCd="WORK_TYPE_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="workTypeCd"
              label="작업유형"
              v-model:value="sop.workTypeCd"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
            <c-select
              codeGroupCd="WORK_KIND_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="workKindCd"
              label="작업형태"
              v-model:value="sop.workKindCd"
            />
          </div>
          <!-- <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
            <c-plant
              :required="true"
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="sop.plantCd"
            />
          </div> -->
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
            <c-checkbox
              :editable="editable"
              :isFlag="true"
              label="사용여부"
              name="useFlag"
              v-model:value="sop.useFlag"
            />
          </div>
        </template>
      </c-card>
      <div style="height: 0">
        <q-banner
          v-if="rev.isRevision"
          inline-actions
          class="text-white bg-red sop-step-table-info-banner"
        >
          <template v-slot:avatar>
            <q-icon name="info_outline" color="white" />
          </template>
          {{
            $language(
              '개정시에 `작업단계 > 유해위험요인 > 원인` 정보는 이전 버전 정보를 사용하게 됩니다.'
            )
          }}
        </q-banner>
      </div>
      <c-table
        v-if="isOld"
        ref="table"
        title="작업절차"
        gridHeightAuto
        :merge="grid.merge"
        :columns="grid.columns"
        :data="sop.sopStepHazards"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :editable="editable && !rev.isRevision"
        :isExcelDown="false"
        :isFullScreen="false"
        selection="multiple"
        rowKey="jobStepId"
        @linkClick="linkClick"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !rev.isRevision"
              label="추가"
              icon="add"
              @btnClicked="openSopStepDetail"
            />
            <c-btn
              v-if="editable && !rev.isRevision && sop.sopStepHazards!.length > 0"
              label="삭제"
              icon="remove"
              @btnClicked="deleteSopStep"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'sopStep'">
            <q-item class="card-sop-step-list">
              <q-item-section thumbnail>
                <img
                  :src="props.row['sopStepDownPath']"
                  style="height: 80px; width: 80px"
                  :class="{ 'cursor-pointer': Boolean(props.row.sopStepSysAttachFileId) }"
                  @click.prevent="setPreview(props.row, props.row.sopStepSysAttachFileId)"
                />
              </q-item-section>
              <q-item-section>
                <q-chip
                  dense
                  outline
                  square
                  color="teal"
                  text-color="white"
                  style="max-width: 60px"
                  :label="`# ${props.row.jobStepNo}`"
                  @click.stop="openSopStepDetail(props.row.jobStepId)"
                />
                <q-item-label class="sopStep-card-title">
                  <q-btn
                    class="tableinnerBtn"
                    flat
                    :align="col.align"
                    color="blue-6"
                    :label="props.row['jobStepName']"
                    @click.stop="openSopStepDetail(props.row.jobStepId)"
                  />
                </q-item-label>
                <q-item-label caption>
                  {{ props.row['jobStepDesc'] }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-else-if="col.name === 'hazard'">
            <q-item v-if="props.row.sopStepHazardId" class="card-sop-step-list">
              <q-item-section>
                <q-item-label class="sopStep-card-title">
                  {{ `${props.row['ramRiskHazardClassName']} / ${props.row['riskHazardName']}` }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </template>
      </c-table>
    </q-form>

    <q-dialog v-if="preview && preview.src" v-model="preview.isShow">
      <q-card class="preview-image-card">
        <q-btn
          color="white"
          text-color="primary"
          @click="preview.isShow = false"
          round
          dense
          icon="close"
          class="preview-close-btn"
        >
          <q-tooltip class="bg-white text-primary">{{ $language('창닫기') }}</q-tooltip>
        </q-btn>
        <q-img :src="preview.src" />
        <q-card-section>
          <q-btn
            fab
            color="primary"
            icon="save_alt"
            class="absolute"
            style="top: 0; right: 12px; transform: translateY(-50%)"
            @click.prevent="fileDown(preview)"
          />
          <div class="row no-wrap items-center">
            <div class="col text-h6">
              {{ preview.oriFileNm }}
            </div>
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              {{ bytesToSize(preview.fileSize) }}
            </div>
          </div>
        </q-card-section>
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
import { sopType } from './sopInfo'
import { bytesToSize } from '@utils/common'
import { encrypt, fileDownDecrypt } from '@utils/aes256'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'sopInfo'
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
const emits = defineEmits(['getDetail', 'closePopup'])

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
  }
  rev: {
    isRevision: boolean
  }
  sop: sopType
  isOld: boolean
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
      mdmSopId: ''
    }
  },
  sop: () => {
    return {
      mdmSopId: '', // 안전작업 표준 일련번호
      plantCd: null, // 사업장코드
      subProcessCd: '', // 단위공정 코드
      sopNo: '', // 안전작업 표준 번호
      sopName: '', // 세부공정(작업) 명
      revNo: '', // 개정번호
      revReason: '', // 개정사유
      applyRange: '', // 적용범위
      purpose: '', // 목적
      hazardGradeCd: null, // 위험등급 1 ~ 5등급
      workTypeCd: null, // 작업유형 : 특별안전, 일반안전, 단순일상
      workKindCd: null, // 작업형태 : Gas, 고소, 굴착/매설, 방사선, 전기, 지게차, 기타
      workClassCd: null, // 작업구분 : Set-up, PM, BM, Part교체, 기타
      workerName: '', // 작업자
      managementDepts: '', // 관리부서 복수
      managementDepts2: '', // 관리부서 복수
      saftyShied: '', // 안전보호구
      saftyCaution: '', // 안전주의사항
      ramRiskHazardTechniqueCd: null,
      sopMocId: '',
      useFlag: 'Y', // 사용여부
      revisionNum: '',
      groupId: '',
      sysRevision: 1,
      revisionContent: '제정',
      regDtStr: '',
      regUserName: '',
      regUserId: '',
      chgUserId: '',
      revSelectValue: null,
      sopSteps: [], // 작업단계 목록
      revs: [], // 개정 목록
      mmEquips: [], // 설비 목록
      mmMachines: [], // 기계기구 목록
      chems: [], // 화학자재 목록
      sopSummary: [], // 요약정보
      sopStepHazards: [] // 작업단계 (w/h. 유해위험요인)
    }
  },
  rev: () => {
    return {
      isRevision: false
    }
  },
  isOld: false,
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
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'jobStepId' },
    { index: 1, colName: 'sopStepHazardId' },
    { index: 2, colName: 'sopStepHazardId' },
    { index: 5, colName: 'jobStepId' },
    { index: 6, colName: 'jobStepId' },
    { index: 7, colName: 'jobStepId' }
  ],
  columns: [
    {
      name: 'sopStep',
      field: 'sopStep',
      label: '작업단계',
      align: 'left',
      sortable: false,
      type: 'custom',
      style: 'width: 300px'
    },
    {
      name: 'hazard',
      field: 'hazard',
      label: '분류/유해위험요인',
      align: 'left',
      sortable: false,
      type: 'custom',
      style: 'width: 450px'
    },
    {
      name: 'afterRisk',
      field: 'afterRisk',
      label: '위험도',
      align: 'center',
      style: 'width:60px',
      type: 'link',
      sortable: false
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
    },
    {
      name: 'caution',
      field: 'caution',
      label: '주의사항',
      align: 'left',
      sortable: false,
      style: 'width: 150px'
    },
    {
      name: 'saftyShied',
      field: 'saftyShied',
      label: '안전보호구',
      align: 'left',
      sortable: false,
      style: 'width: 120px'
    },
    {
      name: 'useTool',
      field: 'useTool',
      label: '사용공구',
      align: 'left',
      sortable: false,
      style: 'width: 120px'
    }
    // {
    //   name: 'before',
    //   field: 'before',
    //   label: '개선전',
    //   align: 'center',
    //   child: [
    //     {
    //       name: 'beforeFrequency',
    //       field: 'beforeFrequency',
    //       label: '빈도',
    //       align: 'center',
    //       style: 'width:50px',
    //       sortable: false
    //     },
    //     {
    //       name: 'beforeStrength',
    //       field: 'beforeStrength',
    //       label: '강도',
    //       align: 'center',
    //       style: 'width:50px',
    //       sortable: false
    //     },
    //     {
    //       name: 'beforeRisk',
    //       field: 'beforeRisk',
    //       label: '위험도',
    //       align: 'center',
    //       style: 'width:60px',
    //       sortable: false
    //     }
    //   ]
    // },
    // {
    //   name: 'after',
    //   field: 'after',
    //   label: '개선후',
    //   align: 'center',
    //   child: [
    //     {
    //       name: 'afterFrequency',
    //       field: 'afterFrequency',
    //       label: '빈도',
    //       align: 'center',
    //       style: 'width:50px',
    //       sortable: false
    //     },
    //     {
    //       name: 'afterStrength',
    //       field: 'afterStrength',
    //       label: '강도',
    //       align: 'center',
    //       style: 'width:50px',
    //       sortable: false
    //     },
    //     {
    //       name: 'afterRisk',
    //       field: 'afterRisk',
    //       label: '위험도',
    //       align: 'center',
    //       style: 'width:60px',
    //       sortable: false
    //     }
    //   ]
    // },
  ]
})
const editForm = ref<HTMLFormElement | null>(null)
const table = ref<any>(null)
const preview = ref<any>({
  isShow: false,
  sysAttachFileId: '',
  src: '',
  oriFileNm: '',
  fileSize: 0,
  fileExt: ''
})
const mappingType = ref('POST')
const saveCallData = ref('')
const isSave = ref(false)
const saveUrl = ref('')
const sopStepHazardListUrl = ref('')
const deleteSopStepUrl = ref('')
const deleteSopStepHazardAllUrl = ref('')
const revVersionUrl = ref('')
const previewUrl = ref('')
const fileDownUrl = ref('')

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
  saveUrl.value = transactionConfig.mdm.sop.job.insert.url
  sopStepHazardListUrl.value = selectConfig.mdm.sop.sopStepHazard.url
  deleteSopStepUrl.value = transactionConfig.mdm.sop.step.delete.url
  deleteSopStepHazardAllUrl.value = transactionConfig.mdm.sop.step.hazardAllDelete.url
  revVersionUrl.value = selectConfig.com.revision.getversion
  previewUrl.value = selectConfig.com.upload.preview.url
  fileDownUrl.value = selectConfig.com.upload.fileDown.url
  // code setting
  // list setting
}
function getSopStepList() {
  if (props.isOld) {
    $http({
      url: sopStepHazardListUrl.value,
      method: 'GET',
      params: {
        mdmSopId: props.popupParam.mdmSopId
      }
    }).then((_result: any) => {
      props.sop.sopStepHazards = _result.data
      props.sop.regDtStr = props.sop.regDtStr.slice(0, 19)
    })
  }
}
function saveSopInfo() {
  if (props.isOld) {
    saveUrl.value = transactionConfig.mdm.sop.job.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.mdm.sop.job.insert.url
    mappingType.value = 'POST'
  }
  let saveMsg = '저장하시겠습니까?'
  if (props.rev.isRevision) {
    saveMsg = '현재버전을 개정하시겠습니까?'
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: saveMsg,
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.sop.regUserId = user.value.userId
          props.sop.chgUserId = user.value.userId

          // 개정시
          if (props.rev.isRevision) {
            saveUrl.value = transactionConfig.mdm.sop.job.insert.url
            mappingType.value = 'POST'
            props.sop.sysRevision = Number(props.sop.sysRevision) + 1
          }
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
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.mdmSopId = result.data
  saveCallData.value = uid()
  props.rev.isRevision = false
  emits('getDetail')
}
function setRevision() {
  $http({
    url: revVersionUrl.value,
    method: 'GET',
    params: {
      revisionNum: props.sop.revisionNum
    }
  }).then((_result: any) => {
    _.extend(props.sop, {
      revisionNum: _result.data,
      revisionContent: '',
      regDtStr: '',
      regUserName: ''
    })
    props.rev.isRevision = true
  })
}
function cancelRevision() {
  props.rev.isRevision = false
  emits('getDetail')
}
function getRevVersion(mdmSopId: any) {
  if (mdmSopId) {
    emits('getDetail', mdmSopId)
  }
}
function deleteSopStep() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteSopStepUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            props.sop.sopStepHazards = _.reject(props.sop.sopStepHazards, {
              jobStepId: item.jobStepId
            })
          })
          table.value.compoTable.clearSelection()
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 위험성평가 상세 팝업
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '위험성평가 상세'
  popupOptions.value.param = {
    ramRiskAssessmentPlanId: row ? row.ramRiskAssessmentPlanId : '',
    ramStepCd: row ? row.ramStepCd : 'RRS0000001',
    vendorFlag: false,
    ramTechniqueCd: row.ramTechniqueCd,
    isNew: 'Y',
    assessmentName: row ? row.assessmentName : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/ram/riskDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 위험성평가 상세 팝업 닫기 callback
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  emits('getDetail')
}
function openSopStepDetail(jobStepId?: any) {
  popupOptions.value.title = '작업단계 상세'
  popupOptions.value.param = {
    mdmSopId: props.popupParam.mdmSopId,
    jobStepId: jobStepId ? jobStepId : '',
    ramRiskHazardTechniqueCd: props.sop.ramRiskHazardTechniqueCd
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./sopStepInfo.vue`)))
  popupOptions.value.width = '80%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeSopStepPopup
}
function closeSopStepPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  emits('getDetail')
  // getSopStepList()
}
function setPreview(file: any, sysAttachFileId: any) {
  if (!sysAttachFileId) return
  // 이미지인  경우
  $http({
    url: previewUrl.value,
    method: 'GET',
    params: {
      sysAttachFileId: encrypt(sysAttachFileId)
    }
  }).then((_result: any) => {
    const fileInfo = fileDownDecrypt(_result.data)
    if (fileInfo.id === sysAttachFileId) {
      preview.value.isShow = true
      preview.value.sysAttachFileId = sysAttachFileId
      preview.value.src = 'data:' + ';base64,' + fileInfo.bytes

      preview.value.oriFileNm = file.sopStepOriFileNm
      preview.value.fileSize = file.sopStepFileSize
    } else {
      message.alert({
        title: '안내', // 안내
        message: '잘못된 정보입니다.',
        type: 'error' // success / info / warning / error
      })
    }
  })
}
/******************************
 * TODO (목적): 파일 다운로드
 * @param (1): 다운로드할 파일 정보
 *******************************/
function fileDown(file: any) {
  const accept = getAccept(file.fileExt)
  $http({
    url: fileDownUrl.value,
    method: 'GET',
    params: {
      sysAttachFileId: file.sysAttachFileId
    }
  }).then((_result: any) => {
    const blob = base64ToBlob(_result.data, accept)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, file.oriFileNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = file.oriFileNm
      link.click()
    }
  })
}

function techDataChange() {
  if (props.popupParam.mdmSopId) {
    message.confirm({
      title: '확인',
      message:
        '평가기법 분류를 변경할 경우 작업절차 목록에 <br> 작업단계별 유해위험요인이 모두 삭제됩니다. <br> 그래도 삭제하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteSopStepHazardAllUrl.value,
          method: 'DELETE',
          data: Object.values(props.sop.sopStepHazards as any)
        }).then((_result: any) => {
          saveUrl.value = transactionConfig.mdm.sop.job.update.url
          mappingType.value = 'PUT'
          isSave.value = !isSave.value

          getSopStepList()
          table.value.compoTable.clearSelection()
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {
        emits('getDetail')
      }
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
