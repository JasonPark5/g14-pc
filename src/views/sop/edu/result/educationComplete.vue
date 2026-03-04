<template>
  <q-form ref="editForm">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="교육대상자"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="grid.data"
        :filtering="false"
        :checkClickFlag="false"
        :columnSetting="false"
        :usePaging="false"
        :hideBottom="true"
        :editable="editable && !disabled"
        rowKey="attendeesNo"
        selection="multiple"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              label="추가"
              :showLoading="false"
              icon="add"
              @btnClicked="addItem"
            />
            <c-btn
              v-if="editable && !disabled && grid.data.length > 0"
              label="삭제"
              :showLoading="false"
              icon="remove"
              @btnClicked="removeItem"
            />
            <c-btn
              v-if="editable && !disabled && grid.data.length > 0"
              :url="insertUrl"
              :isSubmit="isSave1"
              :param="grid.data"
              mappingType="POST"
              label="저장"
              icon="save"
              @beforeAction="saveEducation1"
              @btnCallback="saveCallback1"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'click'">
            <q-btn
              round
              unelevated
              size="10px"
              color="amber"
              icon="search"
              @click.stop="
                () => {
                  ;(rowIndex = props.rowIndex), (electronSignature = props.row.electronSignature)
                }
              "
            >
              <q-popup-proxy :ref="'proxy1_' + props.rowIndex" :breakpoint="400">
                <component
                  :is="col.component"
                  :popupParam="props.row"
                  :rowIndex="props.rowIndex"
                  @callback="callback1"
                />
              </q-popup-proxy>
            </q-btn>
          </template>
          <template v-if="col.name === 'vodPlayTime'">
            <q-chip
              :color="getPlayTimeColor(props.row.vodTotalTime)"
              outline
              square
              :clickable="false"
              text-color="white"
            >
              {{ getPlayTime(props.row) }}
            </q-chip>
          </template>
          <!-- <template v-if="col.name === 'electronSignature'">
            <div class="col-12">
              <q-img :src="props.row.electronSignature" fit="scale-down"
                :ratio="4/3"
                style="min-width: 100px; max-width: 150px">
                <template v-slot:loading>
                  <q-spinner-gears color="white" />
                </template>
              </q-img>
            </div>
          </template> -->
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table4"
        title="외부인력 교육대상자"
        :columns="grid2.columns"
        :gridHeight="grid2.height"
        :data="grid2.data"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :checkClickFlag="false"
        :hideBottom="true"
        :editable="editable && !disabled"
        rowKey="attendeesNo"
        selection="multiple"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              label="추가"
              :showLoading="false"
              icon="add"
              @btnClicked="addItem4"
            />
            <c-btn
              v-if="editable && !disabled && grid2.data.length > 0"
              label="삭제"
              :showLoading="false"
              icon="remove"
              @btnClicked="removeItem4"
            />
            <c-btn
              v-if="editable && !disabled && grid2.data.length > 0"
              :url="insertUrl"
              :isSubmit="isSave2"
              :param="grid2.data"
              mappingType="POST"
              label="저장"
              icon="save"
              @beforeAction="saveEducation2"
              @btnCallback="saveCallback2"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 sign">
      <c-card title="이수자 명단 파일" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-sm-12 col-md-12 col-lg-12" style="height: 220px">
            <c-upload :attachInfo="attachInfo" :editable="editable" label="이수자 명단 파일" />
          </div>
        </template>
      </c-card>
    </div>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { eduAttendeeType, eduResultType } from './eduResult'

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
  name: 'educationComplete'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user, auths } = storeToRefs(userStore)

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
  educationInfo: eduResultType
  planUpdateBtnData: planUpdateBtnDataType
}
interface planUpdateBtnDataType {
  title: stringNull
  flag: boolean
  research: stringNull
  planResearch: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<eduAttendeeType>
  height: stringNull
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
  educationInfo: () => {
    return {
      eduEducationId: '',
      eduCourseId: '',
      documentStatusCd: '',
      eduAttendeeList: [],
      eduQuestionFlag: 'N'
    }
  },
  planUpdateBtnData: () => {
    return {
      title: '계획',
      flag: false,
      research: '',
      planResearch: ''
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
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'EDU_COMPLETE_LIST',
  taskKey: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'attendeesDeptName',
      field: 'attendeesDeptName',
      style: 'width:80px',
      label: '부서',
      align: 'center',
      sortable: false
    },
    {
      name: 'attendeesPositionName',
      field: 'attendeesPositionName',
      style: 'width:80px',
      label: '직책',
      align: 'center',
      sortable: false
    },
    {
      name: 'seniorityName',
      field: 'seniorityName',
      style: 'width:130px',
      label: '선임',
      align: 'center',
      sortable: false
    },
    {
      name: 'attendeesName',
      field: 'attendeesName',
      label: '대상자',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'evaluationDate',
      field: 'evaluationDate',
      setHeader: true,
      label: '이수일',
      type: 'date',
      style: 'width:110px',
      align: 'center',
      sortable: false
    },
    {
      name: 'electronSignatureFlag',
      field: 'electronSignatureFlag',
      label: '서명여부',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'attendanceTime',
      field: 'attendanceTime',
      setHeader: true,
      label: '출석시간',
      style: 'width:100px',
      type: 'datetime',
      align: 'center',
      sortable: false
    },
    {
      name: 'noAttendanceReason',
      field: 'noAttendanceReason',
      label: '불참사유',
      type: 'text',
      align: 'left',
      style: 'width:180px',
      sortable: false
    },
    {
      name: 'opinionContent',
      field: 'opinionContent',
      label: '의견',
      type: 'text',
      align: 'left',
      style: 'width:180px',
      sortable: false
    }
  ],
  data: [],
  height: '350px'
})
const grid2 = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'attendeesDeptName',
      field: 'attendeesDeptName',
      label: '소속',
      align: 'center',
      style: 'width:130px',
      type: 'text',
      sortable: false
    },
    {
      name: 'attendeesPositionName',
      field: 'attendeesPositionName',
      style: 'width:100px',
      label: '직책',
      type: 'text',
      align: 'center',
      sortable: false
    },
    {
      required: true,
      name: 'attendeesName',
      field: 'attendeesName',
      label: '대상자',
      type: 'text',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    // {
    //   name: 'residentNo',
    //   field: 'residentNo',
    //   // 생년월일
    //   label: '생년월일',
    //   type: 'date',
    //   style: 'width:100px',
    //   align: 'center',
    //   sortable: false
    // },
    {
      name: 'evaluationDate',
      field: 'evaluationDate',
      setHeader: true,
      label: '이수일',
      type: 'date',
      style: 'width:110px',
      align: 'center',
      sortable: false
    },
    {
      name: 'evaluationPoint',
      field: 'evaluationPoint',
      label: '평가점수',
      type: 'number',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'evaluationContent',
      field: 'evaluationContent',
      label: '평가내용',
      type: 'text',
      style: 'width:230px',
      align: 'center',
      sortable: false
    },
    {
      name: 'attendanceTime',
      field: 'attendanceTime',
      label: '출석시간',
      setHeader: true,
      type: 'datetime',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'noAttendanceReason',
      field: 'noAttendanceReason',
      label: '불참사유',
      type: 'text',
      style: 'width:180px',
      align: 'center',
      sortable: false
    },
    {
      name: 'opinionContent',
      field: 'opinionContent',
      label: '의견',
      style: 'width:180px',
      align: 'left',
      type: 'text',
      sortable: false
    }
  ],
  data: [],
  height: '250px'
})
const isSave1 = ref(false)
const isSave2 = ref(false)
const insertUrl = ref('')
const deleteUrl = ref('')
const getUrl = ref('')
const getAttendUrl = ref('')
const rowIndex = ref(0)
const electronSignature = ref('')
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  if (isEnvSafDept.value) {
    return false
  } else {
    return disabled2.value
  }
})
const disabled2 = computed(
  () =>
    Boolean(props.educationInfo.documentStatusCd) &&
    props.educationInfo.documentStatusCd === 'ESC000010'
)
const isEnvSafDept = computed(
  () => _.indexOf(auths.value, 'SAGI000021') > -1 || user.value.empNo === 'admin'
)
const table = ref<any>(null)
const table4 = ref<any>(null)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.educationInfo,
  () => {
    getDetail()
  },
  { deep: true }
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
  getUrl.value = selectConfig.sop.edu.attendee.get.url
  insertUrl.value = transactionConfig.sop.edu.plan.insert.targetUser.url
  deleteUrl.value = transactionConfig.sop.edu.plan.delete.targetUser.url
  getAttendUrl.value = selectConfig.sop.edu.result.get.targetUser.url
  // code setting
  const signatureColumn = {
    name: 'click',
    field: 'click',
    label: '서명',
    style: 'width:60px',
    type: 'custom',
    align: 'center',
    sortable: false,
    component: shallowRef(defineAsyncComponent(() => import(`./signaturePop.vue`)))
  }
  grid.value.columns.splice(6, 0, signatureColumn)
  const newColumn = {
    name: 'checkCompleteFlag',
    field: 'checkCompleteFlag',
    label: '이수여부',
    type: 'select',
    setHeader: true,
    style: 'width:120px',
    align: 'center',
    comboItems: [
      { code: 'Y', codeName: $language('이수') },
      { code: 'N', codeName: $language('미이수') }
    ],
    sortable: false
  }
  grid.value.columns.splice(4, 0, newColumn)
  grid2.value.columns.splice(3, 0, newColumn)
  if (props.educationInfo.educationMethodCd == 'EMC999999') {
    // 동영상교육
    grid.value.columns.splice(8, 0, {
      name: 'vodPlayTime',
      field: 'vodPlayTime',
      label: '동영상 시청시간',
      align: 'center',
      style: 'width:150px',
      sortable: true,
      type: 'custom'
    })
  }
  if (props.educationInfo.eduQuestionFlag == 'Y') {
    // 문제풀이 여부
    grid.value.columns.push(
      {
        name: 'questionScore',
        field: 'questionScore',
        label: '문제풀이점수',
        style: 'width:80px',
        align: 'center',
        sortable: false
      },
      {
        name: 'questionScoreDt',
        field: 'questionScoreDt',
        label: '문제풀이 일시',
        style: 'width:140px',
        align: 'center',
        sortable: false
      }
    )
  }
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 교육 대상자 조회
 *******************************/
function getDetail() {
  attachInfo.value.taskKey = props.educationInfo.eduEducationId
  if (props.educationInfo.eduEducationId) {
    grid.value.data = []
    grid2.value.data = []
    _.forEach(props.educationInfo.eduAttendeeList, (_item) => {
      if (_item.inExTypeCd === 'EX') {
        grid2.value.data.push(_item) // 외부인력
      } else {
        grid.value.data.push(_item) // 내부
      }
    })
  }
}
/******************************
 * TODO (목적): 동영상 시청 시간
 *******************************/
function getPlayTime(_row: any) {
  if (_row.vodTotalTime === null) {
    return $language('시청 전')
  } else {
    const m1 = _.padStart(String(Math.floor(_row.vodPlayTime / 60)), 2, '0')
    const s1 = _.padStart(String(Math.floor(_row.vodPlayTime % 60)), 2, '0')
    const m2 = _.padStart(String(Math.floor(_row.vodTotalTime / 60)), 2, '0')
    const s2 = _.padStart(String(Math.floor(_row.vodTotalTime % 60)), 2, '0')
    return m1 + ' : ' + s1 + ' / ' + m2 + ' : ' + s2
  }
}
function getPlayTimeColor(_min: any) {
  if (_min === null) {
    return 'grey-6'
  } else {
    return 'blue'
  }
}
/******************************
 * TODO (목적): 교육 대상자 조회
 *******************************/
function getAttendeeList() {
  if (props.educationInfo.eduEducationId) {
    $http({
      url: $format(getAttendUrl.value, props.educationInfo.eduEducationId),
      method: 'GET'
    }).then((_result: any) => {
      props.educationInfo.eduAttendeeList = _result.data
      grid.value.data = []
      grid2.value.data = []
      _.forEach(props.educationInfo.eduAttendeeList, (_item) => {
        if (_item.inExTypeCd === 'EX') {
          grid2.value.data.push(_item) // 외부인력
        } else {
          grid.value.data.push(_item) // 내부
        }
      })
    })
  }
}
/******************************
 * TODO (목적): 교육 대상자 저장
 *******************************/
function saveEducation1() {
  let invalidItemExists = false
  invalidItemExists = _.some(grid.value.data, (_item) => {
    return (
      _item.checkCompleteFlag === 'Y' &&
      (_item.evaluationDate === null || _item.evaluationDate === '')
    )
  })
  if (!invalidItemExists) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
        isSave1.value = !isSave1.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.alert({
      title: '안내',
      message: '이수완료 처리한 대상자의 이수일을 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
  }
}
function saveCallback1() {
  message.requestSuccess()
  _.forEach(grid.value.data, (item) => {
    item.editFlag = 'U'
  })
  props.planUpdateBtnData.research = uid()
  getAttendeeList()
}
/******************************
 * TODO (목적): 교육 대상자 조회 (외부)
 *******************************/
function saveEducation2() {
  if (validTable(grid2.value.columns, grid2.value.data)) {
    let invalidItemExists2 = false
    invalidItemExists2 = _.some(grid2.value.data, (_item) => {
      return (
        _item.checkCompleteFlag === 'Y' &&
        (_item.evaluationDate === null || _item.evaluationDate === '')
      )
    })
    if (!invalidItemExists2) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          _.forEach(grid2.value.data, (item) => {
            item.regUserId = user.value.userId
            item.chgUserId = user.value.userId
          })
          isSave2.value = !isSave2.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '이수완료 처리한 대상자의 이수일을 입력하세요.',
        type: 'warning' // success / info / warning / error
      })
    }
  } else {
    message.alert({
      title: '안내',
      message: '외부 대상자의 소속회사와 이름을 입력해주세요.',
      type: 'warning' // success / info / warning / error
    })
  }
}
function saveCallback2() {
  message.requestSuccess()
  _.forEach(grid2.value.data, (item) => {
    item.editFlag = 'U'
  })
  props.planUpdateBtnData.research = uid()
  getAttendeeList()
}
/******************************
 * TODO (목적): 교육 대상자 추가
 *******************************/
function addItem() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeTargetUserPopup, {
    type: 'multiple',
    plantCd: props.educationInfo.plantCd
  })
}
function closeTargetUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data.selectData && data.selectData.length > 0) {
    _.forEach(data.selectData, (_item) => {
      const index = _.findIndex(grid.value.data, {
        attendeesId: _item.userId
      })
      if (index === -1) {
        grid.value.data.splice(0, 0, {
          attendeesNo: uid(),
          attendeesTypeCd: 'EATC00003',
          attendeesDeptName: _item.deptName,
          attendeesPositionName: _item.jobName,
          attendeesId: _item.userId,
          attendeesName: _item.userName,
          inExTypeCd: 'IN',
          eduEducationId: props.educationInfo.eduEducationId,
          seniorityName: _item.seniorName,
          checkCompleteFlag: null,
          electronSignature: '',
          evaluationPoint: null,
          evaluationContent: null,
          evaluationDate: null,
          attendanceTime: '',
          noAttendanceReason: '',
          opinionContent: '',
          checkCompleteFlagName: $language('미이수'),
          electronSignatureFlag: $language('미서명'),
          vodTotalTime: null,
          vodPlayTime: null,
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 교육 대상자 삭제
 *******************************/
function removeItem() {
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
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, { attendeesNo: item.attendeesNo })
          })
          props.planUpdateBtnData.research = uid()
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 교육 대상자 추가 (외부)
 *******************************/
function addItem4() {
  grid2.value.data.splice(0, 0, {
    attendeesNo: uid(),
    attendeesTypeCd: 'EATC00004',
    attendeesDeptName: '',
    attendeesPositionName: '',
    eduEducationId: props.educationInfo.eduEducationId,
    attendeesId: '',
    attendeesName: '',
    checkCompleteFlag: null,
    inExTypeCd: 'EX',
    evaluationPoint: null,
    evaluationContent: null,
    evaluationDate: null,
    attendanceTime: '',
    noAttendanceReason: '',
    opinionContent: '',
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): 교육 대상자 삭제 (외부)
 *******************************/
function removeItem4() {
  const selectData = table4.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  }
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: deleteUrl.value,
        method: 'DELETE',
        data: Object.values(selectData)
      }).then(() => {
        _.forEach(selectData, (item) => {
          grid2.value.data = _.reject(grid2.value.data, { attendeesNo: item.attendeesNo })
        })
        props.planUpdateBtnData.research = uid()
        message.requestSuccess()
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function callback1(data: any, rowIndex: number) {
  const refName: any = 'proxy1_' + rowIndex
  refName.hide()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
