<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            name="period"
            :range="true"
            label="실행기간"
            defaultStart="-6M"
            defaultEnd="6M"
            v-model:value="period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="MIM_CHECK_RESULT_CD"
            itemText="codeName"
            itemValue="code"
            name="resultCd"
            label="결과"
            v-model:value="searchParam.resultCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :comboItems="typeItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="equipmentType"
            label="현황분류"
            v-model:value="searchParam.equipmentType"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-multi-select
            :editable="editable"
            codeGroupCd="RELATED_LAWS_CD"
            itemText="codeName"
            itemValue="code"
            label="관련법규"
            name="relatedLawList"
            maxValues="3"
            v-model:value="searchParam.relatedLawList"
          />
        </div>
      </template>
    </c-search-box>
    <div class="col-12">
      <c-table
        ref="table"
        title="설비 목록"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="grid.data"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :hideBottom="true"
        :editable="editable"
        rowKey="key"
        @rowClick="rowClick"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn label="검색" icon="search" @btnClicked="getList" />
            <c-btn label="기기정비 이력기록서" icon="print" @btnClicked="btnRecord" />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <div
      v-if="isCheck === '1'"
      class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
      topClass="topcolor-orange"
    >
      <c-table
        ref="table"
        :title="`${$language('설비별 점검항목(실행일 : ')} ${realDate})`"
        :columns="grid2.columns"
        :gridHeight="grid2.height"
        :data="record.equipmentResultList"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :hideBottom="true"
        :noDataLabel="$language('설비에 대한 점검항목이 없습니다.')"
        rowKey="checkItemSeq"
        cardClass="topcolor-orange"
      >
        <template v-slot:table-button>
          <c-btn label="점검결과 보고서" icon="print" @btnClicked="btnResult" />
        </template>
      </c-table>
    </div>
    <div v-if="isCheck === '2'" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-card
        class="cardClassDetailForm"
        title="설비 정비결과"
        topClass="topcolor-orange"
        bgClass=""
      >
        <template v-slot:card-detail>
          <div v-if="editable && record.inspResultAfterMemName" class="col-3">
            <c-label-text title="정비결과" :value="record.inspResultAfterMemName" />
          </div>
          <div v-if="editable && record.maintenanceTimeT" class="col-3">
            <c-label-text title="정비시간" :value="record.maintenanceTimeT" />
          </div>
          <div v-if="editable && record.stopDrivingTimeT" class="col-3">
            <c-label-text title="운전정지시간" :value="record.stopDrivingTimeT" />
          </div>
          <div v-if="editable && record.maintenanceQualifications" class="col-12">
            <c-label-text title="정비자 자격사항" :value="record.maintenanceQualifications" />
          </div>
          <div v-if="editable && record.maintenanceCause" class="col-12">
            <c-label-text title="정비원인" :value="record.maintenanceCause" />
          </div>
          <div v-if="editable && record.maintenanceContent" class="col-12">
            <c-label-text title="정비내용" :value="record.maintenanceContent" />
          </div>
          <div v-if="editable && record.maintenanceResultSummary" class="col-12">
            <c-label-text title="정비결과요약" :value="record.maintenanceResultSummary" />
          </div>
          <div v-if="editable && record.reviewOpinionOfMananger" class="col-12">
            <c-label-text title="관리자의 검토의견" :value="record.reviewOpinionOfMananger" />
          </div>
        </template>
      </c-card>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentRecord'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  popupParam: equipPlanPopupParamType
  contentHeight: stringNull
}
interface equipPlanPopupParamType {
  equipmentCd: stringNull
  year: stringNull
  minEquipmentCheckId: stringNull
  statusTypeName: stringNull
  realDate: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {})

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
const typeItems = ref<codeMasterType>([
  { code: '1', codeName: '점검' },
  { code: '2', codeName: '정비' }
])
const record = ref<any>({
  // 점검쪽
  minEquipmentCheckId: '',
  plantCd: '',
  plantName: '',
  checkDeptCd: '',
  checkDeptName: '',
  checkUserId: '',
  checkUserName: '',
  sopMocId: '',
  equipmentCheckKindCd: null,
  equipmentCheckKindNm: '',
  checkStatusCd: '',
  checkScheduleUserName: '',
  checkScheduleUserId: '',
  checkScheduleDate: '',
  equipmentTypeCd: '',
  equipmentCd: '',
  equipmentName: '',
  inspectionCycleName: '',
  inspectionCycleCd: '',
  recentInspectionDate: '',
  relatedLaws: '',
  regUserId: '',
  chgUserId: '',
  noPlanResultEnrollFlag: 'N',
  checkResultCd: null,
  checkCompleteFlag: null,
  checkDate: '',
  equipmentResultList: [],
  // 정비쪽
  minEquipmentMaintenanceId: '',
  maintenanceStatusCd: null,
  equipmentCheckTypeCd: null,
  memDeptEntrantUserId: '',
  maintenanceDueDate: '',
  maintenanceDueUserId: '',
  maintenanceUserId: '',
  maintenanceQualifications: '',
  maintenanceDate: '',
  maintenanceResultSummary: '',
  inspResultAfterMemCd: null,
  maintenanceCompleteFlag: null,
  maintenanceCause: '',
  maintenanceContent: '',
  maintenanceTime: '',
  stopDrivingTime: '',
  reviewOpinionOfMananger: ''
})
const grid = ref<any>({
  columns: [
    {
      name: 'statusTypeCd',
      field: 'statusTypeCd',
      label: '현황분류',
      style: 'width:80px',
      type: 'tag',
      colorItems: [
        { stepperMstCd: 'Y', stepperMstNm: '점검', colorClass: 'green' },
        { stepperMstCd: 'N', stepperMstNm: '정비', colorClass: 'orange' }
      ],
      align: 'center',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '점검부서/정비입회자',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'typeName',
      field: 'typeName',
      label: '점검/정비유형',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },

    {
      label: '점검/정비',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'realDateT',
          field: 'realDateT',
          label: '실행일',
          style: 'width:110px',
          align: 'center',
          sortable: false
        },
        {
          name: 'userName',
          field: 'userName',
          label: '관리자',
          style: 'width:100px',
          align: 'center',
          sortable: false
        },
        {
          name: 'resultName',
          field: 'resultName',
          label: '결과',
          style: 'width:90px',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      style: 'width:250px',
      align: 'left',
      sortable: false
    }
  ],
  data: [],
  height: '300px'
})

const grid2 = ref<any>({
  merge: [{ index: 0, colName: 'mergeSet' }],
  columns: [
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '점검항목',
      style: 'width:200px',
      // type: 'textarea',
      align: 'left',
      sortable: false
    },
    {
      name: 'checkResult',
      field: 'checkResult',
      label: '점검결과',
      align: 'left',
      style: 'width:250px',
      sortable: false
    },
    {
      name: 'checkWayName',
      field: 'checkWayName',
      label: '검사방법',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'judgmentResultTypeName',
      field: 'judgmentResultTypeName',
      label: '적합/부적합',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'decisionBasis',
      field: 'decisionBasis',
      label: '판정기준',
      // type: 'textarea',
      style: 'width:200px',
      align: 'left',
      sortable: false
    },
    {
      name: 'checkCaution',
      field: 'checkCaution',
      label: '점검시 안전사항',
      style: 'width:200px',
      align: 'left',
      sortable: false
    }
  ],
  data: [],
  height: '480px'
})
const getUrl = ref('')
const listUrl = ref('')
const printUrl = ref('')
const printUrl2 = ref('')
const isCheck = ref('0')
const realDate = ref('')
const searchParam = ref<any>({
  // 설비점검 start
  safCheckTypeCd1: null,
  // 설비정비 start
  safCheckTypeCd2: null,
  resultCd: null,
  startYmd: '',
  endYmd: '',
  detailFlag: 'N',
  noPlanResultEnrollFlag: null,
  relatedLawList: [],
  lawEquipmentFlag: null,
  equipmentType: null,
  year: ''
})
const period = ref(['', ''])
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
  listUrl.value = selectConfig.sop.min.equipment.maintain.getYear.url
  printUrl.value = selectConfig.sop.min.equipment.maintain.print.url
  printUrl2.value = selectConfig.sop.min.equipment.maintain.print2.url
  // code setting
  // searchParam.value.year = getThisYear()
  if (props.popupParam.equipmentCd) {
    searchParam.value.equipmentCd = props.popupParam.equipmentCd
  }
  // list setting
  getList()
  rowClick({
    equipKey: props.popupParam.minEquipmentCheckId,
    statusTypeName: props.popupParam.statusTypeName,
    realDate: props.popupParam.realDate
  })
}
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  record.value = {}

  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 설비 점검결과 상세 조회
 *******************************/
function rowClick(row: any) {
  if (row.statusTypeName === '점검') {
    getUrl.value = selectConfig.sop.min.equipment.plan.get.url
    isCheck.value = '1'
  } else {
    getUrl.value = selectConfig.sop.min.maintenance.plan.get.url
    isCheck.value = '2'
  }
  realDate.value = _.cloneDeep(row.realDate)
  $http({
    url: $format(getUrl.value, row.equipKey),
    method: 'GET'
  }).then((_result: any) => {
    record.value = _result.data

    searchParam.value.plantCd = _result.data.plantCd
  })
}
/******************************
 * TODO (목적): 기기정비 이력기록서 출력
 *******************************/
function btnRecord() {
  $http({
    url: printUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const fileOrgNm = record.value.equipmentName + ' ' + $language('기기정비이력기록서') + '.xlsx'
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
/******************************
 * TODO (목적): 점검결과 보고서 출력
 *******************************/
function btnResult() {
  $http({
    url: printUrl2.value,
    method: 'GET',
    params: {
      checkDate: realDate.value,
      checkDeptName: record.value.checkDeptName,
      checkUserName: record.value.checkUserName,
      plantName: record.value.plantName,
      equipmentCd: props.popupParam.equipmentCd,
      minEquipmentCheckId: record.value.minEquipmentCheckId
    }
  }).then((_result: any) => {
    const fileOrgNm = record.value.equipmentName + '(' + record.value.checkDate + ')' + '.xlsx'
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<!-- <style>
#chip {
  font-size: 15px !important;
  border-left: 20px;
  margin: 4px;
}
</style> -->
