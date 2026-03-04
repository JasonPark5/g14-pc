<template>
  <q-form ref="editForm">
    <c-card class="cardClassDetailForm" title="상세">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && !disabled && isOld"
            label="삭제"
            icon="delete"
            @btnClicked="deleteLawCheck"
          />
          <c-btn
            v-show="requestBtnEditable"
            :isSubmit="isRequest"
            :url="completeUrl"
            :param="lawCheck"
            mappingType="PUT"
            label="검토요청"
            color="grey-8"
            icon="check"
            @beforeAction="requestLawCheck"
            @btnCallback="requestLawCheckCallback"
          />
          <c-btn
            v-show="completeBtnEditable"
            :isSubmit="isComplete"
            :url="completeUrl"
            :param="lawCheck"
            mappingType="PUT"
            label="완료"
            icon="check"
            color="grey-8"
            @beforeAction="completeLawCheck"
            @btnCallback="completeLawCheckCallback"
          />
          <c-btn
            v-show="editable && !disabled"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="lawCheck"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="saveLawCheck"
            @btnCallback="saveLawCheckCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-field
            :required="true"
            :disabled="disabled"
            :editable="editable"
            :data="lawCheck"
            deptValue="managerDeptCd"
            type="dept_user"
            label="담당자"
            name="managerId"
            v-model:value="lawCheck.managerId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-dept-multi
            :required="true"
            :disabled="disabled"
            :editable="editable"
            :parentCheckDepts="lawCheck.acceptDeptCds"
            label="적용부서"
            name="acceptDeptCds"
            v-model:value="lawCheck.acceptDeptCds"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-text
            :disabled="disabled"
            :editable="editable"
            label="해당시설"
            name="applicableFacility"
            v-model:value="lawCheck.applicableFacility"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            label="현행 법규내용 요약"
            name="currentLawContents"
            v-model:value="lawCheck.currentLawContents"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            label="개정 법규내용 요약"
            name="reLawContents"
            v-model:value="lawCheck.reLawContents"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            label="검토요청내용"
            name="reviewRequestContents"
            v-model:value="lawCheck.reviewRequestContents"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            label="비고"
            name="remark"
            v-model:value="lawCheck.remark"
          />
        </div>
      </template>
    </c-card>
    <c-card class="cardClassDetailForm q-mt-sm q-mb-sm" noHeader>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <c-text
                :required="true"
                :readonly="true"
                :editable="editable"
                :appendIcon="[{ name: 'search', click: true, callbackName: 'searchLaw' }]"
                label="법령명(약칭)"
                name="lawNameKor"
                v-model:value="lawCheck.lawNameKor"
                @searchLaw="searchLaw"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <c-text
                :editable="editable"
                :readonly="true"
                label="공포일자"
                name="promulgationDate"
                v-model:value="lawCheck.promulgationDate"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <c-text
                :editable="editable"
                :readonly="true"
                label="제개정"
                name="revisiontypename"
                v-model:value="lawCheck.revisiontypename"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <c-text
                :editable="editable"
                :readonly="true"
                label="소관부처"
                name="competentMinistriesName"
                v-model:value="lawCheck.competentMinistriesName"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <c-text
                :editable="editable"
                :readonly="true"
                label="법령구분"
                name="lawClassName"
                v-model:value="lawCheck.lawClassName"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <c-text
                :editable="editable"
                :readonly="true"
                label="시행일자"
                name="enforcementDate"
                v-model:value="lawCheck.enforcementDate"
              />
            </div>
            <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2">
              <q-chip
                v-if="lawCheck.lawLink"
                outline
                square
                color="orange"
                icon="open_in_new"
                clickable
                class="cursor-pointer q-mt-lg"
                @click="lawOpen(1)"
                >{{ $language('신구법비교') }}</q-chip
              >
            </div>
            <div class="col-xs-12 col-sm-6 col-md-2 col-lg-2">
              <q-chip
                v-if="lawCheck.lawLink"
                outline
                square
                color="teal"
                icon="open_in_new"
                clickable
                class="cursor-pointer q-mt-lg"
                @click="lawOpen(2)"
                >{{ $language('법령상세') }}</q-chip
              >
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-upload :attachInfo="attachInfo" :editable="editable && !disabled" />
        </div>
      </template>
    </c-card>
    <c-table
      ref="table"
      title="검토자 목록"
      :columns="userTableColumns"
      :data="lawCheck.checkUsers"
      :gridHeight="gridHeight"
      :editable="editable && !disabled"
      :usePaging="false"
      :isExcelDown="false"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="mdmLawCheckUserId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addChecker" />
          <c-btn
            v-if="editable && !disabled && lawCheck.checkUsers.length > 0"
            label="제외"
            icon="remove"
            @btnClicked="deleteChecker"
          />
        </q-btn-group>
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
import { lawType } from '../law'
import { lawCheckType, lawCheckUserType, lawReviewPopupParamType } from './lawReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'lawReviewDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  popupParam: lawReviewPopupParamType
  contentHeight: string
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
      mdmLawCheckId: ''
    }
  },
  contentHeight: 'auto'
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
const lawCheck = ref<lawCheckType>({
  /** 입법예고검토 정보 */
  mdmLawCheckId: '', // 법령검토 번호
  lawId: '', // 법령ID
  mdmLawId: '', // 시행일 법령 번호
  mdmLawStepCd: '', // 진행단계
  managerId: '', // 담당자id
  acceptDeptCds: '', // 적용부서
  currentLawContents: '', // 현행 법규내용 요약
  reLawContents: '', // 개정 법규내용 요약
  applicableFacility: '', // 해당시설
  reviewRequestContents: '', // 검토요청내용
  remark: '', // 비고
  /** 입법예고 정보 */
  lawSerialNum: '', // 법령일련번호
  curHistroyCode: '', // 현행연혁코드
  lawNameKor: '', // 법령명한글
  lawNameAbb: '', // 법령약칭명
  promulgationDate: '', // 공포일자
  promulgationNum: '', // 공포번호
  revisiontypename: '', // 제개정구분명
  competentMinistriesCode: '', // 소관부처코드
  competentMinistriesName: '', // 소관부처명
  lawClassName: '', // 법령구분명
  enforcementDate: '', // 시행일자
  lawTypeFlag: '', // 자법타법여부
  lawLink: '', // 법령상세링크
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  checkUsers: [], // 검토자들
  deleteCheckUsers: [] // 검토자들 [삭제]
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '', // 판정에서 데이터가 저장되어 키가 있는 상황임으로 사용하지 않음
  taskClassCd: 'LAW_CHECK',
  taskKey: ''
})
const isSave = ref(true)
const isRequest = ref(true)
const isComplete = ref(true)
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const completeUrl = ref('')
const mappingType = ref('PUT')
const table = ref<any>(null)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.mdmLawCheckId))
const disabled = computed(() => lawCheck.value.mdmLawStepCd === 'LS00000010')
const requestBtnEditable = computed(
  () =>
    editable.value && !disabled.value && lawCheck.value.mdmLawStepCd === 'LS00000001' && isOld.value
)
const completeBtnEditable = computed(
  () =>
    editable.value && !disabled.value && lawCheck.value.mdmLawStepCd === 'LS00000005' && isOld.value
)
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 550
      : 350
  if (height < 300) {
    height = 300
  }
  return String(height) + 'px'
})
const userTableColumns = computed(() => {
  const _item: Array<tableColumnType> = [
    {
      name: 'checkDeptName',
      field: 'checkDeptName',
      label: '부서',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'checkUserName',
      field: 'checkUserName',
      label: '검토자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ]
  if (isOld.value && lawCheck.value.mdmLawStepCd !== 'LS00000001') {
    _item.push({
      name: 'remark',
      field: 'remark',
      label: '검토의견',
      align: 'left',
      style: 'width:400px',
      sortable: true,
      type: 'textarea'
    })
  }
  return _item
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
  detailUrl.value = selectConfig.sai.lawCheck.check.get.url
  saveUrl.value = transactionConfig.sai.lawCheck.check.insert.url
  deleteUrl.value = transactionConfig.sai.lawCheck.check.delete.url
  completeUrl.value = transactionConfig.sai.lawCheck.check.complete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getDetail() {
  if (props.popupParam.mdmLawCheckId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.mdmLawCheckId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(lawCheck.value, _result.data)

      attachInfo.value.taskKey = props.popupParam.mdmLawCheckId

      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
    })
  } else {
    lawCheck.value.mdmLawStepCd = 'LS00000001'
    lawCheck.value.managerId = user.value.userId
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function searchLaw(icon: any) {
  if (icon) {
    popupOptions.value = getPopupOptions('law', popupOptions.value, closeLawPopup, {
      /** 원하는 parameter 정의 */
      type: 'single'
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeLawPopup(data: Array<lawType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.extend(lawCheck.value, data[0])
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function lawOpen(num: number) {
  if (num === 2) {
    window.open('http://www.law.go.kr' + lawCheck.value.lawLink, '법규', 'width=1200, height=800')
  } else {
    window.open(
      'http://www.law.go.kr' + lawCheck.value.lawLink.replace('eflaw', 'oldAndNew'),
      '신구법 비교',
      'width=1200,height=800'
    )
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function addChecker() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeUserPopup(data: Array<userType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const _data: Array<lawCheckUserType> = []
    _.forEach(data, (item) => {
      if (
        _.findIndex(lawCheck.value.checkUsers, {
          checkUserId: item.userId
        }) === -1
      ) {
        _data.push({
          mdmLawCheckUserId: uid(), // 법령검토자 번호
          mdmLawCheckId: props.popupParam.mdmLawCheckId, // 법령검토 번호
          checkDeptCd: item.deptCd,
          checkDeptName: item.deptName,
          checkUserId: item.userId,
          checkUserName: item.userName,
          remark: '',
          finishFlag: 'N',
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
    lawCheck.value.checkUsers = _.concat(lawCheck.value.checkUsers, _data)
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function deleteChecker() {
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
      message: '제외하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        if (!lawCheck.value.deleteCheckUsers) lawCheck.value.deleteCheckUsers = []
        _.forEach(selectData, (item) => {
          if (
            item.editFlag !== 'C' &&
            _.findIndex(lawCheck.value.deleteCheckUsers, {
              mdmLawCheckUserId: item.mdmLawCheckUserId
            })
          ) {
            lawCheck.value.deleteCheckUsers.push(item)
          }
          lawCheck.value.checkUsers = _.reject(lawCheck.value.checkUsers, item)
        })
        table.value.compoTable.clearSelection()
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveLawCheck() {
  if (props.popupParam.mdmLawCheckId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.sai.lawCheck.check.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.sai.lawCheck.check.insert.url
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          lawCheck.value.regUserId = user.value.userId
          lawCheck.value.chgUserId = user.value.userId

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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveLawCheckCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.mdmLawCheckId = _result.data
  attachInfo.value.taskKey = _result.data
  attachInfo.value.isSubmit = uid()
  getDetail()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function requestLawCheck() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '검토요청하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          lawCheck.value.chgUserId = user.value.userId

          isRequest.value = !isRequest.value
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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function requestLawCheckCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function completeLawCheck() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          lawCheck.value.chgUserId = user.value.userId

          isComplete.value = !isComplete.value
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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function completeLawCheckCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function deleteLawCheck() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.mdmLawCheckId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
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
