<template>
  <q-form ref="editForm">
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn label="훈련결과서" icon="print" @btnClicked="print('T')" />
          <c-btn label="교육결과서" icon="print" @btnClicked="print('E')" />
          <c-btn
            v-show="editable"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="performanceResultRecord"
            :mappingType="saveType"
            label="저장"
            icon="save"
            @beforeAction="savePerformanceResultRecord"
            @btnCallback="savePerformanceResultRecordCallback"
          />
          <c-btn
            v-show="editable && Boolean(props.popupParam.sopFireFightingPerformanceResultRecordId)"
            label="삭제"
            icon="delete_forever"
            @btnClicked="deleteperformanceResultRecord"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            required
            :editable="editable"
            label="실시결과기록부명"
            name="recordName"
            v-model:value="performanceResultRecord.recordName"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            label="관계인"
            name="relatedUserName"
            v-model:value="performanceResultRecord.relatedUserName"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :editable="editable"
            label="관계인 주소"
            name="address"
            v-model:value="performanceResultRecord.address"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            required
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="performanceResultRecord.plantCd"
          />
        </div> -->
      </template>
    </c-card>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="소방안전관리대상물" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="대상명"
                name="targetName"
                v-model:value="performanceResultRecord.targetName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="용도"
                name="usage"
                v-model:value="performanceResultRecord.usage"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :editable="editable"
                :isSignature="true"
                :changeSignature="changeSignature"
                :data="performanceResultRecord"
                label="대표자"
                name="ownerId"
                v-model:value="performanceResultRecord.ownerId"
                @userInfo="
                  (_data: any) => {
                    performanceResultRecord.phoneNumber = _data.mobileNo
                  }
                "
                @signReExamine="signReExamine"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                :disabled="true"
                label="전화번호"
                name="phoneNumber"
                v-model:value="performanceResultRecord.phoneNumber"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
              <c-text
                :editable="editable"
                label="주소"
                name="location"
                v-model:value="performanceResultRecord.location"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-radio
                :editable="editable"
                codeGroupCd="SOP_FIRE_MANAGEMENT_LEVEL_CD"
                label="등급"
                name="sopFireManagementLevelCd"
                v-model:value="performanceResultRecord.sopFireManagementLevelCd"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          title="소방안전관리자"
          :columns="grid.columns"
          :data="performanceResultRecord.managers"
          :usePaging="false"
          :hideBottom="true"
          gridHeight="192px"
          rowKey="seniorStatusId"
          selection="multiple"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addManager" />
              <c-btn
                v-if="
                  editable &&
                  performanceResultRecord.managers &&
                  performanceResultRecord.managers?.length > 0
                "
                label="제외"
                icon="remove"
                @btnClicked="removeManager"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>

    <c-tab
      type="tabcard"
      align="left"
      :tabItems="tabItems"
      :inlineLabel="true"
      :height="tabHeight"
      :dense="true"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          ref="swp-tab"
          :is="tab.component"
          :performanceResultRecord="performanceResultRecord"
        />
      </template>
    </c-tab>
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
import { recordType } from '../fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingPerformanceResultDetail'
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
    sopFireFightingPerformanceResultRecordId?: stringNull
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
      sopFireFightingPerformanceResultRecordId: ''
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
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const performanceResultRecord = ref<recordType>({
  sopFireFightingPerformanceResultRecordId: '', // 소방 교육·훈련 실기결과기록부 일련번호
  recordName: '', // 실시결과기록부명
  targetName: '', // 소방대상물 - 대상명
  usage: '', // 소방대상물 - 용도
  ownerId: '', // 소방대상물 - 대표자ID
  location: '', // 소방대상물 - 주소
  sopFireManagementLevelCd: '', // 소방대상물 - 등급
  relatedUserName: '', // 관계인 - 성명(기관 또는 법인명)
  address: '', // 관계인 - 주소
  trainingDate: '', // 훈련일자
  trainingStartTime: '', // 훈련시작시간
  trainingEndTime: '', // 훈련종료시간
  trainingTime: [],
  trainingLocation: '', // 훈련장소
  trainingTypeCd: '', // 훈련유형(자체/합동)
  trainingInstructor: '', // 훈련교관
  trainingTargetCount: null, // 참석대상(명)
  trainingAttendanceCount: null, // 참석(명)
  trainingAbsenceCount: null, // 미참석(명)
  trainingMaterials: '', // 훈련보조재료
  fireDrillContent: '', // 소화훈련내용
  notificationContent: '', // 통보훈련내용
  evacuationContent: '', // 피난훈련내용
  trainingResult: '', // 훈련성과
  trainingIssue: '', // 훈련 문제점
  trainingImprovementPlan: '', // 개선계획
  educationDate: '', // 교육일자
  educationStartTime: '', // 교육시작시간
  educationEndTime: '', // 교육종료시간
  educationTime: [],
  educationLocation: '', // 교육장소
  educationInstructor: '', // 교육강사
  eduTargetCount: null, // 참석대상(명)
  eduAttendanceCount: null, // 참석(명)
  eduAbsenceCount: null, // 미참석(명)
  educationContent: '', // 교육내용
  educationResult: '', // 교육성과
  educationIssue: '', // 교육 문제점
  eduImprovementPlan: '', // 개선계획
  plantCd: '', // 사업장 코드
  managers: [], // 소방안전관리자
  deleteManagers: []
})
const trainingAttachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'FIRE_FIGHTING_TRAINING_PICTURE',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
const educationAttachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'FIRE_FIGHTING_EDU_PICTURE',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'userName',
      field: 'userName',
      label: '성명',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'seniorDate',
      field: 'seniorDate',
      label: '선임일자',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'certification',
      field: 'certification',
      label: '보유자격',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'qualificationType',
      field: 'qualificationType',
      label: '자격구분',
      style: 'width:100px',
      type: 'select',
      comboItems: [
        { code: 'Y', codeName: '주' },
        { code: 'N', codeName: '보조' }
      ],
      align: 'center',
      sortable: true
    },
    {
      name: 'mobileNo',
      field: 'mobileNo',
      label: '연락처',
      style: 'width:100px',
      align: 'center',
      sortable: true
    }
  ]
})
const editable = ref(true)
const isSave = ref(false)
const saveType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const printUrl = ref('')
const editForm = ref<any>(null)
const changeSignature = ref<any>('')
const table = ref<any>(null)
const tabItems = ref<Array<tabItemsType>>([
  {
    name: 'training',
    icon: 'local_fire_department',
    class: 'tab-lightblue',
    label: '소방훈련',
    component: shallowRef(
      defineAsyncComponent(() => import(`./fireFightingPerformanceResultTraining.vue`))
    )
  },
  {
    name: 'education',
    icon: 'school',
    class: 'tab-red',
    label: '소방교육',
    component: shallowRef(
      defineAsyncComponent(() => import(`./fireFightingPerformanceResultEdu.vue`))
    )
  }
])
const tab = ref('training')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => String(props.contentHeight - 350))

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
  detailUrl.value = selectConfig.fft.fireFightingPerformanceResult.get.url
  saveUrl.value = transactionConfig.fft.fireFightingPerformanceResult.update.url
  deleteUrl.value = transactionConfig.fft.fireFightingPerformanceResult.delete.url
  printUrl.value = selectConfig.fft.fireFightingPerformanceResult.print.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.sopFireFightingPerformanceResultRecordId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopFireFightingPerformanceResultRecordId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(performanceResultRecord.value, _result.data)
      performanceResultRecord.value.trainingTime = [
        _result.data.trainingStartTime,
        _result.data.trainingEndTime
      ]
      performanceResultRecord.value.educationTime = [
        _result.data.educationStartTime,
        _result.data.educationEndTime
      ]
      trainingAttachInfo.value.taskKey = props.popupParam.sopFireFightingPerformanceResultRecordId
      educationAttachInfo.value.taskKey = props.popupParam.sopFireFightingPerformanceResultRecordId
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  }
}

/******************************
 * TODO (목적): 소방안전관리자 추가
 *******************************/
function addManager() {
  if (performanceResultRecord.value.managers!.length === 3) {
    message.alert({
      title: '안내',
      message: '소방안전관리자는 3명까지 추가 가능합니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    popupOptions.value = getPopupOptions('seniorStatus', popupOptions.value, closeManagerPopup, {
      type: 'multiple'
    })
  }
}

function closeManagerPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    console.log(_data)
    _.forEach(_data, (item) => {
      if (
        _.findIndex(performanceResultRecord.value.managers, {
          seniorStatusId: item.seniorStatusId
        }) === -1
      ) {
        performanceResultRecord.value.managers?.push({
          sopFireFightingPerformanceResultRecordId:
            performanceResultRecord.value.sopFireFightingPerformanceResultRecordId,
          seniorStatusId: item.seniorStatusId,
          userName: item.seniorUserName,
          seniorDate: item.seniorDate,
          certification: item.relatedCertificate,
          qualificationType: '',
          mobileNo: item.mobileNo,
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}

/******************************
 * TODO (목적): 소방안전관리자 제외
 *******************************/
function removeManager() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!performanceResultRecord.value.deleteManagers)
      performanceResultRecord.value.deleteManagers = []
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(performanceResultRecord.value.deleteManagers, {
          seniorStatusId: item.seniorStatusId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        performanceResultRecord.value.deleteManagers?.push(item)
        performanceResultRecord.value.managers = _.reject(
          performanceResultRecord.value.managers,
          item
        )
      }
    })
    table.value.compoTable.clearSelection()
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function savePerformanceResultRecord() {
  if (props.popupParam.sopFireFightingPerformanceResultRecordId) {
    saveType.value = 'PUT'
  } else {
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          if (performanceResultRecord.value.trainingTime) {
            performanceResultRecord.value.trainingStartTime =
              performanceResultRecord.value.trainingTime[0]
            performanceResultRecord.value.trainingEndTime =
              performanceResultRecord.value.trainingTime[1]
          }
          if (performanceResultRecord.value.educationTime) {
            performanceResultRecord.value.educationStartTime =
              performanceResultRecord.value.educationTime[0]
            performanceResultRecord.value.educationEndTime =
              performanceResultRecord.value.educationTime[1]
          }
          performanceResultRecord.value.regUserId = user.value.userId
          performanceResultRecord.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function savePerformanceResultRecordCallback(result: any) {
  message.requestSuccess()
  props.popupParam.sopFireFightingPerformanceResultRecordId = result.data
  if (saveType.value === 'POST') {
    trainingAttachInfo.value.isSubmit = uid()
    educationAttachInfo.value.isSubmit = uid()
  }
  trainingAttachInfo.value.taskKey = result.data
  educationAttachInfo.value.taskKey = result.data
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteperformanceResultRecord() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.sopFireFightingPerformanceResultRecordId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}

function signReExamine(_userInfo: any) {
  changeSignature.value = uid()
}

/******************************
 * TODO (목적): 출력
 *******************************/
function print(type: string) {
  $http({
    url: printUrl.value,
    method: 'GET',
    params: {
      sopFireFightingPerformanceResultRecordId:
        performanceResultRecord.value.sopFireFightingPerformanceResultRecordId,
      printType: type
    }
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = `소방${type === 'T' ? '훈련' : '교육'}실시결과서.xlsx`
    link.click()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
