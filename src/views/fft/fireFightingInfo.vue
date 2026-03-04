<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-md-12 col-lg-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-qr-btn
                  v-if="editable && isOld"
                  :mobileUrl="
                    '/sop/fft/fireFightingMaster?sopFireFightingId=' + popupParam.sopFireFightingId
                  "
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="fireFighting"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="소방설비명"
                  name="fireFightingName"
                  v-model:value="fireFighting.fireFightingName"
                />
              </div>
              <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="관리번호"
                  name="manageNo"
                  v-model:value="fireFighting.manageNo"
                />
              </div>
              <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                <c-select
                  :editable="editable"
                  codeGroupCd="SOP_FIRE_FIGHTING_TYPE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="sopFireFightingTypeCd"
                  label="설비유형"
                  v-model:value="fireFighting.sopFireFightingTypeCd"
                />
              </div>
              <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                <c-select
                  :editable="editable"
                  :comboItems="kindItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="sopFireFightingKindCd"
                  label="설비종류"
                  v-model:value="fireFighting.sopFireFightingKindCd"
                />
              </div>
              <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                <c-text
                  :editable="editable"
                  label="수량"
                  type="number"
                  name="amount"
                  v-model:value="fireFighting.amount"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <c-task-target
                  :editable="editable"
                  :plantCd="fireFighting.plantCd"
                  label="관련 위험물저장소"
                  name="chmDangerMstId"
                  :customPopupParam="{ targetKey: 'hazardStorage' }"
                  v-model:value="fireFighting.chmDangerMstId"
                />
              </div>
              <!-- <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                <c-plant
                  :required="true"
                  :editable="editable"
                  :disabled="isOld"
                  type="edit"
                  name="plantCd"
                  v-model:value="fireFighting.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-dept-multi
                  :editable="editable"
                  :parentCheckDepts="fireFighting.deptCd"
                  :plantCd="fireFighting.plantCd"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="fireFighting.deptCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-task-target
                  :multiple="true"
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'process' }"
                  label="관련공정"
                  name="processCd"
                  v-model:value="fireFighting.processCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-card title="설치관련 정보" class="cardClassDetailForm" topClass="topcolor-blue">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-text
                  :editable="editable"
                  label="설치장소"
                  name="location"
                  v-model:value="fireFighting.location"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-datepicker
                  :editable="editable"
                  label="설치일"
                  name="installDate"
                  v-model:value="fireFighting.installDate"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-card title="설치상태 정보" class="cardClassDetailForm" topClass="topcolor-blue">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-select
                  :editable="editable"
                  :comboItems="disposeFlagItems"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="disposeFlag"
                  label="폐기여부"
                  v-model:value="fireFighting.disposeFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-datepicker
                  :required="fireFighting.disposeFlag === 'Y'"
                  :editable="editable"
                  :disabled="fireFighting.disposeFlag === 'N'"
                  label="폐기일"
                  name="disposeDate"
                  v-model:value="fireFighting.disposeDate"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
      <c-table
        v-if="isOld"
        ref="table"
        title="교체이력"
        gridHeight="410px"
        :columns="grid.columns"
        :data="fireFighting.replacementHistroies"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :editable="editable"
        :isExcelDown="false"
        :isFullScreen="false"
        selection="multiple"
        rowKey="sopFireFightingReplacementHistoryId"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :showLoading="false"
              label="추가"
              icon="add"
              @btnClicked="addReplacementHistory"
            />
            <c-btn
              v-if="editable && fireFighting.replacementHistroies!.length > 0"
              label="제외"
              icon="remove"
              @btnClicked="deleteReplacementHistory"
            />
          </q-btn-group>
        </template>
      </c-table>
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
import { fireFightingType } from './fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingInfo'
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
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopFireFightingId?: stringNull
  }
  contentHeight?: stringNull
  isOld?: boolean
  fireFighting?: fireFightingType
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
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      sopFireFightingId: ''
    }
  },
  fireFighting: () => {
    return {
      sopFireFightingId: '', // 소방설비 일련번호
      plantCd: null, // 사업장
      plantName: null, // 사업장
      sopFireFightingTypeCd: null, // 유형
      sopFireFightingTypeName: null, // 유형
      sopFireFightingKindCd: null, // 점검 소방시설 종류
      sopFireFightingKindName: '', // 점검 소방시설 종류
      manageNo: '', // 관리번호
      fireFightingName: '', // 소방설비명
      deptCd: '', // 관리부서
      processCd: '', // 관련공정
      sopFireFightinhReplacementCycleCd: '', // 소방설비 교체 주기
      amount: '', // 수량
      chmDangerMstId: '', // 관련 위험물 저장소 일련번호
      location: '', // 설비위치
      installDate: '', // 설치일
      disposeFlag: 'N', // 폐기여부
      disposeDate: '', // 폐기일
      deleteFlag: 'N', // 삭제여부
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      replacementHistroies: [],
      deleteReplacementHistroies: [],
      checks: [],
      histroy: []
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'replacementDt',
      field: 'replacementDt',
      label: '교체일시',
      align: 'center',
      style: 'width:150px',
      type: 'datetime',
      datetimeType: 'datetime',
      minuteStep: 10,
      sortable: false,
      required: true
    },
    {
      name: 'replacementUserName',
      field: 'replacementUserName',
      label: '교체자',
      align: 'center',
      style: 'width:120px',
      type: 'user',
      userId: 'replacementUserId',
      sortable: false,
      required: true
    },
    {
      name: 'replacementContents',
      field: 'replacementContents',
      label: '교체 내용',
      align: 'left',
      style: 'width:250px',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      align: 'left',
      style: 'width:100px',
      type: 'textarea',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const mappingType = ref('PUT')
const checkUrl = ref('')
const saveUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)
const disposeFlagItems = ref<Array<codeMasterType>>([])
const kindItems = ref<Array<codeMasterType>>([])

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.fireFighting.sopFireFightingTypeCd,
  () => {
    setKind()
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
  checkUrl.value = selectConfig.fft.fireFighting.check.url
  saveUrl.value = transactionConfig.fft.fireFighting.update.url
  // code setting
  disposeFlagItems.value = [
    { code: 'N', codeName: $language('미폐기') },
    { code: 'Y', codeName: $language('폐기') }
  ]
  // list setting
  setKind()
}
/******************************
 * TODO (목적): 선택항목 조회
 *******************************/
function setKind() {
  if (props.fireFighting.sopFireFightingTypeCd) {
    getComboItems('SOP_FIRE_FIGHTING_KIND_CD', props.fireFighting.sopFireFightingTypeCd).then(
      (_result) => {
        kindItems.value = _result
        if (_.findIndex(kindItems.value, { code: props.fireFighting.sopFireFightingKindCd }) === -1)
          props.fireFighting.sopFireFightingKindCd = null
      }
    )
  } else kindItems.value = []
}
/******************************
 * TODO (목적): 소방설비 교체이력 추가
 *******************************/
function addReplacementHistory() {
  props.fireFighting.replacementHistroies!.splice(0, 0, {
    sopFireFightingReplacementHistoryId: uid(), // 소방설비 교체 이력 일련번호
    sopFireFightingId: props.popupParam.sopFireFightingId, // 소방설비 일련번호
    replacementDt: getTodayDateTiemMin(), // 교체일시
    replacementUserId: user.value.userId, // 교체자
    replacementUserName: user.value.userName, // 교체자
    replacementContents: '', // 교체 내용
    remarks: '', // 비고
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 소방설비 교체이력 제외
 *******************************/
function deleteReplacementHistory() {
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
      confirmCallback: () => {
        if (!props.fireFighting.deleteReplacementHistroies)
          props.fireFighting.deleteReplacementHistroies = []
        _.forEach(selectData, (item) => {
          if (
            item.editFlag !== 'C' &&
            _.findIndex(props.fireFighting.deleteReplacementHistroies, {
              sopFireFightingReplacementHistoryId: item.sopFireFightingReplacementHistoryId
            }) === -1
          ) {
            props.fireFighting.deleteReplacementHistroies!.push(item)
          }
          props.fireFighting.replacementHistroies = _.reject(
            props.fireFighting.replacementHistroies,
            item
          )
        })
        table.value.compoTable.clearSelection()
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.isOld ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: checkUrl.value,
        method: 'GET',
        params: {
          sopFireFightingId: props.popupParam.sopFireFightingId,
          manageNo: props.fireFighting.manageNo
        }
      }).then((_result: any) => {
        if (!_result.data) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            confirmCallback: () => {
              props.fireFighting.regUserId = user.value.userId
              props.fireFighting.chgUserId = user.value.userId
              isSave.value = !isSave.value
            },
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 관리번호가 존재합니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        }
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.sopFireFightingId = _result.data
  emits('getDetail')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
