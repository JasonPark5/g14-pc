<template>
  <q-form ref="editForm">
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="journal"
            :mappingType="saveType"
            label="저장"
            icon="save"
            @beforeAction="saveJournal"
            @btnCallback="saveJournalCallback"
          />
          <c-btn
            v-show="editable && isOld"
            label="삭제"
            icon="delete_forever"
            @btnClicked="deleteJournal"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            required
            :editable="editable"
            label="일지명"
            name="journalName"
            v-model:value="journal.journalName"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-field
            required
            :editable="editable"
            type="user"
            label="확인자"
            name="confirmUserId"
            v-model:value="journal.confirmUserId"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            :editable="editable"
            default="today"
            label="실시일"
            name="actionDate"
            v-model:value="journal.actionDate"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            required
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="journal.plantCd"
          />
        </div> -->
      </template>
    </c-card>
    <c-table
      ref="table"
      title="소방교육 및 훈련일지 정보"
      class="q-mt-sm"
      :columns="grid.columns"
      :gridHeight="gridHeight"
      :data="journal.contents"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
      rowKey="sopFireFightingJournalContentsId"
      selection="multiple"
      @linkClick="openContentsPop"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :showLoading="false"
            label="교육 추가"
            icon="add"
            @btnClicked="addContents('E')"
          />
          <c-btn
            v-if="editable"
            :showLoading="false"
            label="훈련 추가"
            icon="add"
            @btnClicked="addContents('T')"
          />
          <c-btn
            v-if="editable && journal.contents!.length > 0"
            :showLoading="false"
            label="제외"
            icon="remove"
            @btnClicked="removeContents"
          />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'userCount'">
          <q-btn
            v-if="props.row[col.name]"
            class="tableinnerBtn"
            flat
            :align="col.align"
            color="blue-6"
            :label="props.row[col.name]"
          >
            <q-popup-proxy :ref="'proxy_' + props.rowIndex + '_' + col.name">
              <component :is="col.component" :props="props" :col="col" :editable="editable" />
              <!-- @callback="(data, color) => callbackProxy(data, props, col)" -->
            </q-popup-proxy>
          </q-btn>
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </q-form>
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
import { journalType } from '../fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingJournalDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopFireFightingJournalId?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
      sopFireFightingJournalId: ''
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const journal = ref<journalType>({
  sopFireFightingJournalId: '', // 소방 일지 일련번호
  plantCd: '', // 사업장 코드
  journalName: '', // 일지명
  confirmUserId: '', // 확인자ID
  actionDate: '', // 실시일
  regUserId: '', // 등록자 ID
  contents: [],
  deleteContents: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'firstType',
      field: 'firstType',
      label: '구분',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'resultType',
      field: 'resultType',
      label: '종별',
      style: 'width:150px',
      align: 'left',
      sortable: false
    },
    {
      name: 'taskName',
      field: 'taskName',
      label: '교육·훈련명',
      style: 'width:150px',
      align: 'left',
      type: 'link',
      sortable: false
    },
    {
      name: 'contents',
      field: 'contents',
      label: '내용',
      style: 'width:500px',
      align: 'left',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'userCount',
      field: 'userCount',
      label: '참가자',
      style: 'width:100px',
      align: 'center',
      type: 'custom',
      sortable: false,
      component: markRaw(defineAsyncComponent(() => import(`./contentsEntrants.vue`)))
    },
    {
      name: 'courseEvaluation',
      field: 'courseEvaluation',
      label: '강평사항',
      style: 'width:250px',
      align: 'left',
      type: 'textarea',
      sortable: false
    }
  ],
  data: [],
  height: '300px'
})
const editable = ref(true)
const isSave = ref(false)
const detailUrl = ref('')
const deleteUrl = ref('')
const saveUrl = ref('')
const eduContentsListUrl = ref('')
const trainingContentsListUrl = ref('')
const saveType = ref('POST')
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.sopFireFightingJournalId))
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 100 + 'px' : '600px'
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
  detailUrl.value = selectConfig.fft.fireFightingJournal.get.url
  eduContentsListUrl.value = selectConfig.sop.edu.result.fireJournal.contents.url
  trainingContentsListUrl.value = selectConfig.sop.eap.training.fireJournal.contents.url
  saveUrl.value = transactionConfig.fft.fireFightingJournal.update.url
  deleteUrl.value = transactionConfig.fft.fireFightingJournal.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopFireFightingJournalId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(journal.value, _result.data)
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  }
}
/******************************
 * TODO (목적): 팝업프록시 콜백
 *******************************/
// function callbackProxy(_data: any, _props: any, col: any) {
//   if (col.name === 'beforeRisk') {
//     $set(node.hazopScenarios[_props.rowIndex], 'beforeFrequency', _data.f)
//     $set(node.hazopScenarios[_props.rowIndex], 'beforeStrength', _data.s)
//     $set(node.hazopScenarios[_props.rowIndex], 'beforeRisk', _data.r)
//     $set(node.hazopScenarios[_props.rowIndex], 'beforeRamMatrixRiskId', _data.ramMatrixRiskId)
//   } else {
//     $set(node.hazopScenarios[_props.rowIndex], 'afterFrequency', _data.f)
//     $set(node.hazopScenarios[_props.rowIndex], 'afterStrength', _data.s)
//     $set(node.hazopScenarios[_props.rowIndex], 'afterRisk', _data.r)
//     $set(node.hazopScenarios[_props.rowIndex], 'afterRamMatrixRiskId', _data.ramMatrixRiskId)
//   }
//   if (node.hazopScenarios[_props.rowIndex].editFlag !== 'C') {
//     $set(node.hazopScenarios[_props.rowIndex], 'editFlag', 'U')
//   }
// }
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function openContentsPop(row: any) {
  if (row.eduEducationId) {
    popupOptions.value.title = '교육계획 및 결과 상세'
    popupOptions.value.param = {
      eduEducationId: row.eduEducationId,
      stepCd: row.stepCd === 'ESC000001' ? 'ESC0000005' : 'ESC0000010'
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/edu/result/educationResultDetail.vue`))
    )
  } else {
    popupOptions.value.title = '비상대응 훈련 상세'
    popupOptions.value.param = { sopEmergencyTrainingId: row.sopEmergencyTrainingId }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/sop/eap/old/traningDetail.vue`))
    )
  }
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 상세보기 팝업에서 가져오기
 *******************************/
function addContents(flag?: stringNull) {
  popupOptions.value = getPopupOptions(
    flag === 'E' ? 'edu' : 'training',
    popupOptions.value,
    flag === 'E' ? closeEdu : closeTraining,
    { type: 'multiple' }
  )
}
function closeEdu(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    let pushDatas = [] as Array<any>
    _.forEach(_data, (item) => {
      /**
       * 종별 : [교육] ${교육종류1} / ${교육종류2}
       * 참가인원 : 교육대상자
       * 내용 : 교육내용 ${과목 및 세부내용} (${교육시간})
       * **교육 대상자 및 교육내용을 가져와야 함
       */
      if (
        _.find(journal.value.contents, { eduEducationId: item.eduEducationId }) === undefined &&
        _.find(pushDatas, { eduEducationId: item.eduEducationId }) === undefined
      )
        pushDatas.push(item)
    })
    if (pushDatas.length > 0) {
      $http({
        url: eduContentsListUrl.value,
        method: 'GET',
        params: { eduEducationIds: _.map(pushDatas, 'eduEducationId') }
      }).then((_result: any) => {
        pushDatas = _.map(pushDatas, (data) => {
          const contents = _.find(_result.data, { eduEducationId: data.eduEducationId })
          return _.extend(data, {
            contents: contents.contents || '',
            users:
              _.map(contents.users, (_user) => {
                return {
                  sopFireFightingJournalContentsUserId: '', // 소방 일지 참가자 일련번호
                  sopFireFightingJournalContentsId: '', // 소방 일지 내용 일련번호
                  sopFireFightingJournalId: props.popupParam.sopFireFightingJournalId, // 소방 일지 일련번호
                  userId: _user.attendeesId, // 참가자ID
                  userName: _user.attendeesName, // 참가자명
                  regUserId: user.value.userId, // 등록자 ID
                  editFlag: 'C'
                }
              }) || [],
            userCount: contents.userCount || ''
          })
        })
        _.forEach(pushDatas, (pushData) => {
          journal.value.contents!.push({
            sopFireFightingJournalContentsId: uid(), // 소방 일지 내용 일련번호
            sopFireFightingJournalId: props.popupParam.sopFireFightingJournalId, // 소방 일지 일련번호
            sopEmergencyTrainingId: '', // 훈련 일련번호
            eduEducationId: pushData.eduEducationId, // 교육 일련번호
            taskName: pushData.educationName,
            resultType: `${pushData.educationKindCdLargeName} / ${pushData.educationKindCdSmallName}`, // 종별
            contents: pushData.contents, // 내용
            users: pushData.users,
            userCount: `${pushData.users[0].userName} 외 ${pushData.users.length - 1}`,
            deleteUsers: [],
            regUserId: user.value.userId, // 등록자 ID
            editFlag: 'C',
            firstType: '교육'
          })
        })
      })
    }
  }
}
function closeTraining(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    let pushDatas = [] as Array<any>
    _.forEach(_data, (item) => {
      /**
       * 종별 : [훈련] ${훈련구분}
       * 참가인원 : 훈련참가자
       * 내용 : 훈련상세내용 ${항목} / ${상세훈련내용} (${소요시간})
       * **훈련참가자 및 훈련상세내용을 가져와야 함
       */
      if (
        _.find(journal.value.contents, { sopEmergencyTrainingId: item.sopEmergencyTrainingId }) ===
          undefined &&
        _.find(pushDatas, { sopEmergencyTrainingId: item.sopEmergencyTrainingId }) === undefined
      ) {
        pushDatas.push(item)
      }
    })
    if (pushDatas.length > 0) {
      $http({
        url: trainingContentsListUrl.value,
        method: 'GET',
        params: { sopEmergencyTrainingIds: _.map(pushDatas, 'sopEmergencyTrainingId') }
      }).then((_result: any) => {
        pushDatas = _.map(pushDatas, (data) => {
          const contents = _.find(_result.data, {
            sopEmergencyTrainingId: data.sopEmergencyTrainingId
          })
          return _.extend(data, {
            contents: contents.contents || '',
            users:
              _.map(contents.users, (_user) => {
                return {
                  sopFireFightingJournalContentsUserId: '', // 소방 일지 참가자 일련번호
                  sopFireFightingJournalContentsId: '', // 소방 일지 내용 일련번호
                  sopFireFightingJournalId: props.popupParam.sopFireFightingJournalId, // 소방 일지 일련번호
                  userId: _user.attendUserId, // 참가자ID
                  userName: _user.attendUserName, // 참가자명
                  regUserId: user.value.userId, // 등록자 ID
                  editFlag: 'C'
                }
              }) || [],
            userCount: contents.userCount || ''
          })
        })
        _.forEach(pushDatas, (pushData) => {
          journal.value.contents!.push({
            sopFireFightingJournalContentsId: uid(), // 소방 일지 내용 일련번호
            sopFireFightingJournalId: props.popupParam.sopFireFightingJournalId, // 소방 일지 일련번호
            sopEmergencyTrainingId: pushData.sopEmergencyTrainingId, // 훈련 일련번호
            eduEducationId: '', // 교육 일련번호
            taskName: pushData.trainingName,
            resultType: pushData.eapTrainingTypeName, // 종별
            contents: pushData.contents, // 내용
            users: pushData.users,
            userCount: `${pushData.users[0].userName} 외 ${pushData.users.length - 1}`,
            deleteUsers: [],
            regUserId: user.value.userId, // 등록자 ID
            editFlag: 'C',
            firstType: '훈련'
          })
        })
      })
    }
  }
}
/******************************
 * TODO (목적): 선택 row 삭제
 *******************************/
function removeContents() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!journal.value.deleteContents) journal.value.deleteContents = []
      if (
        _.findIndex(journal.value.deleteContents, {
          sopFireFightingJournalContentsId: item.sopFireFightingJournalContentsId
        }) === -1 &&
        item.editFlag !== 'C'
      )
        journal.value.deleteContents.push(item)
      journal.value.contents = _.reject(journal.value.contents, item)
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveJournal() {
  saveType.value = isOld.value ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, journal.value.contents!)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          journal.value.regUserId = user.value.userId
          journal.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveJournalCallback(result: any) {
  message.requestSuccess()
  props.popupParam.sopFireFightingJournalId = result.data
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteJournal() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.sopFireFightingJournalId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
