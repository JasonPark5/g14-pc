<template>
  <div class="row">
    <!-- <div class="col-sm-2 col-md-2 col-lg-2">
      <c-table
        ref="table"
        title="훈련 시나리오 목록"
        :columns="grid.columns"
        :data="grid.data"
        gridHeightAuto
        :filtering="false"
        :isExcelDown="false"
        :columnSetting="false"
        :usePaging="false"
        :isFullScreen="false"
        :editable="editable && !disabled"
        rowKey="trainingScenarioDescNo"
        @rowClick="rowClick"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              label="시나리오 복사"
              icon="save_alt"
              @btnClicked="copyScenario"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div> -->
    <div class="risk-process-chips col-12">
      <b style="color: tomato; padding-left: 10px" class="q-mr-sm">{{
        $language('※ 훈련 시나리오를 선택하세요.')
      }}</b>
      <q-chip
        v-for="(scenario, idx) in grid.data"
        outline
        square
        :key="idx"
        :removable="editable && !disabled"
        :color="scenario.selected ? 'primary' : 'grey-6'"
        icon="memory"
        :selected="scenario.selected"
        :label="$language(scenario.trainingScenarioName)"
        v-model="scenario.check"
        @remove="(state: boolean) => removeScenario(state, scenario)"
        @update:selected="(state: boolean) => chipClick(state, scenario, idx)"
      />
      <q-btn-group outline>
        <c-btn
          v-if="editable"
          label="시나리오 복사"
          icon="save_alt"
          @btnClicked="copyScenario"
          class="q-ml-sm"
        />
        <c-btn v-if="editable" label="신규시나리오" icon="add" @btnClicked="addScenario" />
        <c-btn
          v-if="!disabled && editable"
          :url="saveUrl"
          :isSubmit="isSave"
          :param="traning"
          :mappingType="saveType"
          label="훈련시나리오 저장"
          icon="save"
          @beforeAction="saveScenario"
          @btnCallback="saveCallback"
        />
      </q-btn-group>
    </div>
    <c-card
      v-if="gridrev.data && gridrev.data.length > 0"
      title="개정"
      class="cardClassDetailForm"
      topClass="topcolor-orange"
    >
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :required="editable && isRevision"
            :editable="editable && isRevision"
            label="개정번호"
            name="revisionNum"
            v-model:value="traning.revisionNum"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="false"
            label="개정일시"
            name="regDtStr"
            v-model:value="traning.regDtStr"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="false"
            label="개정자"
            name="regUserName"
            v-model:value="traning.regUserName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :required="editable && isRevision"
            :editable="editable && isRevision"
            label="개정사유"
            autogrow
            name="revisionContent"
            v-model:value="traning.revisionContent"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" id="revdiv">
            <c-table
              ref="revisiontable"
              title="개정이력"
              topBorderClass="topcolor-orange"
              :columns="gridrev.columns"
              :data="gridrev.data"
              gridHeight="210px"
              :columnSetting="false"
              :expandAll="false"
              :isFullScreen="false"
              :usePaging="false"
              :isExcelDown="false"
              :hideBottom="true"
              :filtering="false"
              @rowClick="rowClickRev"
            />
          </div> -->
      </template>
    </c-card>
    <div class="col-12">
      <q-form ref="editForm">
        <c-card title="훈련 시나리오 상세" class="cardClassDetailForm" topClass="topcolor-blue">
          <template v-slot:card-select>
            <c-select
              :editable="!isRevision"
              v-if="gridrev.data"
              :comboItems="gridrev.data"
              type="custom"
              typetext="개정이력"
              itemText="revisionNum"
              itemValue="trainingScenarioNo"
              name="trainingScenarioNo"
              label=""
              v-model:value="realKey"
              @update:value="rowClickRev"
            />
          </template>
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-show="editable && traning.trainingScenarioNo && !isRevision && !disabled"
                label="개정"
                icon="restart_alt"
                @btnClicked="setRevision"
              />
              <c-btn
                v-show="editable && traning.trainingScenarioNo && isRevision && !disabled"
                label="개정취소"
                icon="restart_alt"
                @btnClicked="cancelRevision"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-sm-12 col-md-4 col-lg-4">
              <c-text
                required
                :editable="editable && !disabled"
                label="훈련시나리오명"
                name="trainingScenarioName"
                v-model:value="traning.trainingScenarioName"
              />
            </div>
            <div class="col-sm-12 col-md-7 col-lg-7">
              <c-textarea
                required
                :editable="editable && !disabled"
                autogrow
                label="훈련내용요약"
                name="trainingContentsSummary"
                v-model:value="traning.trainingContentsSummary"
              />
            </div>
            <div class="col-sm-6 col-md-1 col-lg-1">
              <c-radio
                :editable="editable && !disabled"
                :comboItems="useFlagItems"
                label="사용여부"
                name="useFlag"
                v-model:value="traning.useFlag"
              />
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
              <c-textarea
                :editable="editable && !disabled"
                autogrow
                label="훈련시나리오개요"
                name="trainingContentsOutline"
                v-model:value="traning.trainingContentsOutline"
              />
            </div>
            <!-- <div class="col-sm-12 col-md-4 col-lg-4">
              <c-textarea
                :editable="editable && !disabled"
                autogrow
                label="직접참가자 유의사항"
                name="directlyNotice"
                v-model:value="traning.directlyNotice"
              />
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
              <c-textarea
                :editable="editable && !disabled"
                autogrow
                label="간접참가자 유의사항"
                name="indirectNotice"
                v-model:value="traning.indirectNotice"
              />
            </div> -->
            <div class="col-sm-12 col-md-4 col-lg-4">
              <c-textarea
                :editable="editable && !disabled"
                autogrow
                label="준비물"
                name="materials"
                v-model:value="traning.materials"
              />
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
              <c-textarea
                :editable="editable && !disabled"
                autogrow
                label="사전준비사항"
                name="preRequisites"
                v-model:value="traning.preRequisites"
              />
            </div>
            <!-- <div class="col-sm-6 col-md-6 col-lg-6" />
                  <div class="col-sm-12 col-md-6 col-lg-6">
                    <c-upload :editable="editable && !disabled" label="피해반경" />
                  </div>
                  <div class="col-sm-12 col-md-6 col-lg-6">
                    <c-upload :editable="editable && !disabled" label="비상대응훈련시나리오" />
                  </div> -->
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-12">
      <c-table
        ref="table2"
        title="훈련 상세 목록"
        :columns="gridDetail.columns"
        :data="traning.emergencyScenarioDetailModelList"
        gridHeightAuto
        :filtering="false"
        :isExcelDown="false"
        :usePaging="false"
        :columnSetting="false"
        :editable="editable && !disabled"
        selection="multiple"
        rowKey="trainingScenarioDescNo"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              label="추가"
              icon="add"
              @btnClicked="addScenarioDetail"
            />
            <c-btn
              v-if="editable && !disabled && traning.emergencyScenarioDetailModelList.length > 0"
              label="제외"
              icon="remove"
              @btnClicked="removeScenarioDetail"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
  </div>
  <c-dialog :param="popupOptions" />
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
import { emergencyMeasureType } from '@views/sop/eap/old/emergency'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'traningScenario'
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
    sopEmergencyPlanId: stringNull
  }
  emerActPlanDocu?: emergencyMeasureType
  contentHeight: stringNull | numberNull
}

interface gridType {
  columns: tableColumnType
  data: Array<any>
  height?: stringNull
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
      sopEmergencyPlanId: ''
    }
  },
  emerActPlanDocu: () => {
    return {
      sopEmergencyPlanId: '',
      plantCd: '',
      documentNo: '',
      emergencyPlanName: '',
      emergencyTypeCd: null,
      emergencyClassCd: '',
      damageTypeExpectPeopleNumber: '',
      expectDamageRange: '',
      expectCause: '',
      processActionMatter: '',
      emergencyReactNotice: '',
      evacuationProcedures: '',
      evacuationAfterAction: '',
      processAccidents: [],
      edus: [],
      managerId: '',
      mobileNo: '',
      useFlag: 'Y',
      deptCd: null,
      writerDt: ''
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
const useFlagItems = ref<Array<codeMasterType>>([
  { code: 'Y', codeName: $language('사용') },
  { code: 'N', codeName: $language('미사용') }
])
const traning = ref<any>({
  sopEmergencyPlanId: '',
  trainingScenarioNo: '',
  revNo: 1,
  trainingScenarioName: '',
  trainingContentsSummary: '',
  trainingContentsOutline: '',
  directlyNotice: '',
  indirectNotice: '',
  materials: '',
  preRequisites: '',
  revRemark: '',
  revisionContent: '제정',
  revisionNum: '',
  groupId: '',
  regUserId: '',
  chgUserId: '',
  emergencyScenarioDetailModelList: [], // 훈련시나리오 상세
  deleteEmergencyScenarioDetailModelList: [], // 훈련시나리오 상세
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [],
  data: []
})
const gridDetail = ref<gridType>({
  columns: [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:5%',
      sortable: false,
      type: 'number'
    },
    {
      name: 'leadTime',
      field: 'leadTime',
      label: '묵표시간',
      align: 'center',
      minuteStep: 10,
      style: 'width:8%',
      sortable: false,
      type: 'datetime'
    },
    {
      name: 'itemName',
      field: 'itemName',
      label: '주요상황',
      align: 'left',
      style: 'width:14%',
      sortable: false,
      type: 'text'
    },
    {
      required: true,
      name: 'trainingDetailContents',
      field: 'trainingDetailContents',
      label: '조치요령',
      align: 'left',
      // style: 'width:40%',
      sortable: false,
      type: 'textarea'
    },
    {
      name: 'managerUserName',
      field: 'managerUserName',
      label: '담당자',
      align: 'center',
      style: 'width:8%',
      userId: 'managerUserId',
      sortable: false,
      setHeader: true,
      type: 'user'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width:14%',
      sortable: false,
      type: 'text'
    }
  ],
  height: '500px',
  data: []
})

const gridrev = ref<gridType>({
  columns: [],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const disabled = ref(true)
const saveUrl = ref('')
const saveType = ref('POST')
const isSave = ref(false)
const getUrl = ref('')
const revlistUrl = ref('')
const getRevUrl = ref('')
const isRevision = ref(false)
const realKey = ref('')
const table2 = ref<any>(null)
// const revisiontable = ref<any>(null)
const editForm = ref<any>(null)
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
  getUrl.value = selectConfig.sop.eap.scenario.get.url
  saveUrl.value = transactionConfig.sop.eap.scenario.insert.url
  revlistUrl.value = selectConfig.sop.eap.scenario.rev.url
  getRevUrl.value = selectConfig.sop.eap.scenario.rev.get.url
  // code setting
  // list setting
  getDetail(true)
}
function getDetail(_check: any) {
  if (_check) {
    isRevision.value = false
    if (props.param.sopEmergencyPlanId) {
      $http({
        url: $format(getUrl.value, props.param.sopEmergencyPlanId),
        method: 'GET'
      }).then((_result: any) => {
        if (_result.data && _result.data.length > 0) {
          grid.value.data = _result.data
          if (grid.value.data?.length > 0) chipClick(true, grid.value.data[0], 0)
          // if (realKey.value) {
          //   const index = _.findIndex(grid.value.data, { trainingScenarioNo: realKey.value })
          //   rowClick(true, grid.value.data[index], index)
          // }
        }
      })
    }
  } else {
    $http({
      url: $format(
        getRevUrl.value,
        props.param.sopEmergencyPlanId,
        traning.value.trainingScenarioNo
      ),
      method: 'GET'
    }).then((_result: any) => {
      if (_result.data) {
        traning.value = _result.data
        traning.value.regDtStr = traning.value.regDtStr.slice(0, 19)
        if (_result.data.trainingScenarioNo === realKey.value) disabled.value = false
        else disabled.value = true
      }
    })
  }
}
function chipClick(state: boolean, row: any, idx: number) {
  if (state) {
    _.forEach(grid.value.data, (item: any, index: number) => {
      // item.selected = idx === index
      if (idx !== index) item.selected = false
      else {
        item.selected = true
        disabled.value = false
        traning.value = row
        realKey.value = row.trainingScenarioNo // key 복사 (editable 체크)
      }
    })
  } else grid.value.data[idx].selected = true
  getRevList(row.groupId)
}
function saveScenario() {
  if (traning.value.trainingScenarioNo) {
    saveUrl.value = transactionConfig.sop.eap.scenario.update.url
    saveType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.eap.scenario.insert.url
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (
      _result &&
      validTable(gridDetail.value.columns, traning.value.emergencyScenarioDetailModelList)
    ) {
      message.confirm({
        title: '확인',
        message: isRevision.value ? '현재버전을 개정하여 저장하시겠습니까?' : '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          traning.value.regUserId = user.value.userId
          traning.value.chgUserId = user.value.userId
          traning.value.sopEmergencyPlanId = props.param.sopEmergencyPlanId
          if (isRevision.value) {
            saveUrl.value = transactionConfig.sop.eap.scenario.insert.url
            saveType.value = 'POST'
            traning.value.revNo = Number(traning.value.revNo) + 1
          }
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  realKey.value = _result.data
  getDetail(true)
}
function getRevList(_groupId: any) {
  $http({
    url: revlistUrl.value,
    method: 'GET',
    params: { groupId: _groupId }
  }).then((_result: any) => {
    gridrev.value.data = _result.data
  })
}
function addScenarioDetail() {
  traning.value.emergencyScenarioDetailModelList.push({
    sopEmergencyPlanId: props.param.sopEmergencyPlanId,
    trainingScenarioNo: traning.value.trainingScenarioNo ? traning.value.trainingScenarioNo : '',
    revNo: traning.value.revNo,
    trainingScenarioDescNo: uid(),
    sortOrder: traning.value.emergencyScenarioDetailModelList.length + 1,
    leadTime: '',
    itemName: '',
    trainingDetailContents: '',
    managerUserId: '',
    managerUserName: '',
    managerDeptName: '',
    editFlag: 'C'
  })
}
function removeScenarioDetail() {
  const selectData = table2.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!traning.value.deleteEmergencyScenarioDetailModelList) {
        traning.value.deleteEmergencyScenarioDetailModelList = []
      }
      if (
        _.findIndex(traning.value.deleteEmergencyScenarioDetailModelList, {
          trainingScenarioDescNo: item.trainingScenarioDescNo
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        traning.value.deleteEmergencyScenarioDetailModelList.push(item)
      }
      traning.value.emergencyScenarioDetailModelList = _.reject(
        traning.value.emergencyScenarioDetailModelList,
        { trainingScenarioDescNo: item.trainingScenarioDescNo }
      )
    })
  }
}
function setRevision() {
  $http({
    url: selectConfig.com.revision.getversion,
    method: 'GET',
    params: {
      revisionNum: traning.value.revisionNum
    }
  }).then((_result: any) => {
    traning.value.revisionNum = _result.data
    traning.value.revisionContent = ''
    traning.value.regDtStr = ''
    traning.value.regUserName = ''
    isRevision.value = true
    // document.getElementById('revdiv').scrollIntoView()
  })
}
function cancelRevision() {
  isRevision.value = false
  getDetail(true)
}
function rowClickRev(row: any) {
  if (row && row !== traning.value.trainingScenarioNo) {
    traning.value.trainingScenarioNo = row
    getDetail(false)
  }
}
function addScenario() {
  disabled.value = false
  const newScenario = {
    trainingScenarioNo: '',
    sopEmergencyPlanId: props.param.sopEmergencyPlanId,
    revNo: 1,
    trainingScenarioName: '',
    trainingContentsSummary: '',
    trainingContentsOutline: '',
    directlyNotice: '',
    indirectNotice: '',
    materials: '',
    preRequisites: '',
    revRemark: '',
    revisionContent: '제정',
    revisionNum: 'v0.1',
    groupId: '',
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    emergencyScenarioDetailModelList: [],
    deleteEmergencyScenarioDetailModelList: [],
    useFlag: 'Y'
  }
  grid.value.data?.push(newScenario)
  gridrev.value.data = [
    {
      revisionNum: 'v0.1',
      trainingScenarioNo: '',
      sopEmergencyPlanId: props.param.sopEmergencyPlanId
    }
  ]
  chipClick(true, grid.value.data[grid.value.data?.length - 1], grid.value.data?.length - 1)
}
function copyScenario() {
  // popupOptions.value = getPopupOptions('trainingScenario', popupOptions.value, closeCopyPopup, {
  //   type: 'single',
  //   searchParam: { trainingScenarioNo: realKey.value }
  // })
  popupOptions.value.title = '훈련 시나리오 검색'
  popupOptions.value.param = {
    type: 'single',
    trainingScenarioNo: realKey.value
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/sop/eap/old/traningScenarioCopyPop.vue`))
  )
  popupOptions.value.width = '70%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeCopyPopup
}
function closeCopyPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    disabled.value = true
    const newScenario = {
      trainingScenarioNo: '',
      sopEmergencyPlanId: props.param.sopEmergencyPlanId,
      revNo: 1,
      trainingScenarioName: _data[0].trainingScenarioName,
      trainingContentsSummary: _data[0].trainingContentsSummary,
      trainingContentsOutline: _data[0].trainingContentsOutline,
      directlyNotice: _data[0].directlyNotice,
      indirectNotice: _data[0].indirectNotice,
      materials: _data[0].materials,
      preRequisites: _data[0].preRequisites,
      revRemark: '',
      revisionContent: '개정',
      revisionNum: 'v0.1',
      groupId: '',
      regUserId: user.value.userId,
      chgUserId: user.value.userId,
      emergencyScenarioDetailModelList: [],
      deleteEmergencyScenarioDetailModelList: [],
      useFlag: 'Y',
      copyFlag: 'Y'
    } as any
    _.forEach(_data[0].emergencyScenarioDetailModelList, (item: any) => {
      newScenario.emergencyScenarioDetailModelList.push({
        sopEmergencyPlanId: props.param.sopEmergencyPlanId,
        trainingScenarioNo: traning.value.trainingScenarioNo,
        revNo: traning.value.revNo,
        trainingScenarioDescNo: uid(),
        sortOrder: item.sortOrder,
        leadTime: item.leadTime,
        itemName: item.itemName,
        trainingDetailContents: item.trainingDetailContents,
        managerUserId: item.managerUserId,
        managerUserName: item.managerUserName,
        managerDeptName: ''
      })
    })
    grid.value.data?.push(newScenario)
    gridrev.value.data = [
      {
        revisionNum: 'v0.1',
        trainingScenarioNo: '',
        sopEmergencyPlanId: props.param.sopEmergencyPlanId
      }
    ]
    chipClick(true, grid.value.data[grid.value.data?.length - 1], grid.value.data?.length - 1)
  }
}
/******************************
 * TODO (목적): 시나리오 삭제
 *******************************/
function removeScenario(_state: any, _scenario: any) {
  if (_scenario.trainingScenarioNo) {
    message.confirm({
      title: '확인',
      message: '훈련 시나리오를 삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: $format(
            transactionConfig.sop.eap.scenario.delete.url,
            _scenario.sopEmergencyPlanId,
            _scenario.trainingScenarioNo
          ),
          method: 'DELETE'
        }).then(() => {
          message.requestSuccess()
          getDetail(true)
        })
      },
      cancelCallback: () => {
        _scenario.check = true
      }
    })
  } else traning.value = grid.value.data[0]
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
