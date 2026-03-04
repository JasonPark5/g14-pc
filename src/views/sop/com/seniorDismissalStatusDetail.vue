<template>
  <div>
    <q-form ref="editForm">
      <div class="col-12">
        <c-card title="선임명 정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <!-- <c-btn
                  v-show="editable && isOld"
                  label="새로운 선임자 등록"
                  icon="add"
                  @btnClicked="addData"/> -->
              <c-btn
                v-show="editable && isOld"
                label="삭제"
                icon="remove"
                @btnClicked="deleteData"
              />
              <c-btn
                v-show="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="seniorDismissalStatus"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveData"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <div class="col-12">
                <c-task-target
                  :required="!isOld"
                  :editable="editable"
                  :disabled="isOld"
                  :customPopupParam="{ targetKey: 'senior' }"
                  label="선임명"
                  name="senior"
                  v-model:value="seniorDismissalStatus.seniorId"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-12">
                <c-multi-select
                  :editable="editable"
                  :disabled="true"
                  :isArray="false"
                  codeGroupCd="LAW_ID"
                  itemText="codeName"
                  itemValue="code"
                  label="관련법규"
                  name="relatedLaws"
                  v-model:value="seniorDismissalStatus.relatedLaws"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  name="relatedReason"
                  label="관련근거"
                  autogrow
                  v-model:value="seniorDismissalStatus.relatedReason"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  name="seniorReason"
                  label="수행역할"
                  autogrow
                  v-model:value="seniorDismissalStatus.seniorReason"
                />
              </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
              <c-textarea
                :editable="false"
                :rows="10"
                :maxlength="1000"
                name="qualifiyRequire"
                label="자격요건"
                v-model:value="seniorDismissalStatus.qualifiyRequire"
              />
            </div>
          </template>
        </c-card>
        <c-card title="선임 정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  required
                  :disabled="isOld"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="seniorDismissalStatus.plantCd"
                />
              </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                required
                :editable="editable"
                type="dept_spot_user"
                label="부서 & 선임자"
                name="seniorUserId"
                v-model:value="seniorDismissalStatus.seniorUserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                required
                :editable="editable"
                label="선임일"
                name="seniorDate"
                v-model:value="seniorDismissalStatus.seniorDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-radio
                :editable="editable"
                :comboItems="dismissalFlagItems"
                label="해임여부"
                name="dismissalFlag"
                v-model:value="seniorDismissalStatus.dismissalFlag"
                @datachange="datachange"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :editable="editable"
                :disabled="seniorDismissalStatus.dismissalFlag !== 'Y'"
                label="해임일"
                :start="seniorDismissalStatus.seniorDate"
                name="dismissalDate"
                v-model:value="seniorDismissalStatus.dismissalDate"
              />
            </div>
          </template>
        </c-card>
        <c-card title="자격증 정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="관련자격증"
                name="relatedCertificate"
                v-model:value="seniorDismissalStatus.relatedCertificate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="editable"
                label="자격증번호"
                name="certificateNo"
                v-model:value="seniorDismissalStatus.certificateNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :editable="editable"
                label="자격취득일"
                name="certificateAcquiDate"
                v-model:value="seniorDismissalStatus.certificateAcquiDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-upload
                :attachInfo="attachInfo"
                :editable="editable"
                label="선해임자료 및 자격증"
              />
            </div>
          </template>
        </c-card>
      </div>
      <!-- <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="관련 교육과정 및 이수일"
            :columns="grid.columns"
            :data="seniorDismissalStatus.eduStatuses"
            gridHeight="320px"
            :filtering="false"
            :isExcelDown="false"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="tableHistory"
            title="선임자 이력"
            :columns="gridHistory.columns"
            :data="seniorDismissalStatus.seniorHistory"
            :gridHeight="gridHistory.height"
            :filtering="false"
            :isExcelDown="false"
          >
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name==='seniorUserName'">
                <template v-if="props.row.seniorStatusId !== popupParam.seniorStatusId">
                  <q-btn
                    class="tableinnerBtn"
                    flat 
                    align="center"
                    color="blue-6"
                    :label="props.row[col.name]"
                    @click.stop="openPopup(props.row)">
                    <q-badge v-if="props.row.retireFlag === 'Y'" color="red" class="scniorBadage">
                      <q-icon name="warning" color="white" class="q-ml-xs" /> 퇴직자
                    </q-badge>
                  </q-btn>
                </template>
                <template v-else>
                  {{props.row[col.name]}}
                  <q-badge class="scniorBadage">
                    <q-icon name="info_outline" color="white" class="q-ml-xs" /> 현재 선임자
                  </q-badge>
                </template>
              </template>
            </template>
          </c-table>
        </div> -->
    </q-form>
    <!-- <q-dialog v-model:value="newSeniorDialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-form ref="editFormDialog">
          <c-card title="선임자 정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline >
                <c-btn 
                  v-show="editable" 
                  label="저장" 
                  icon="save" 
                  @btnClicked="newSeniorSave"/>
                <c-btn 
                  label='닫기' 
                  icon="cancel" 
                  @btnClicked="closeDialog"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-field 
                  required
                  :editable="editable"
                  :data="newSeniorDialog"
                  type="dept_user" 
                  deptValue="seniorDeptCd"
                  label="부서 & 선임자" 
                  name="newseniorUserId" 
                  v-model:value="newSeniorDialog.seniorUserId" />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-datepicker
                  required
                  :editable="editable"
                  default="today"
                  label="선임일"
                  name="newseniorDate"
                  v-model:value="newSeniorDialog.seniorDate"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </q-card>
    </q-dialog> -->
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
import { seniorStatusType } from './senior'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'seniorDismissalStatusDetail'
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
    seniorStatusId: stringNull
  }
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
      seniorStatusId: ''
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
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'DISMISSAL_ATTACH',
  taskKey: ''
})
const popupOptions = ref<popupParamType>({
  width: '70%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const seniorDismissalStatus = ref<seniorStatusType>({
  seniorStatusId: '',
  seniorId: '',
  seniorName: '',
  plantCd: '',
  seniorUserId: '',
  seniorDate: '',
  relatedCertificate: '',
  certificateNo: '',
  certificateAcquiDate: '',
  relatedReason: '',
  seniorReason: '',
  groupId: '',
  sysRevision: '',
  revisionNum: '',
  dismissalFlag: 'N',
  dismissalDate: '',
  dismissalFlagSave: 'N',
  dismissalDateSave: '',
  revisionContent: '',
  regUserId: '',
  chgUserId: '',
  eduStatuses: [],
  qualifiyRequire: '',
  relatedLaws: ''
})
const dismissalFlagItems = ref([
  { code: 'Y', codeName: 'YES' },
  { code: 'N', codeName: 'NO' }
])
// const grid = ref({
//   columns: [
//     {
//       name: 'educationCourseName',
//       field: 'educationCourseName',
//       label: '교육과정',
//       style: 'width:250px',
//       align: 'left',
//       sortable: false
//     },
//     {
//       name: 'educationCycleName',
//       field: 'educationCycleName',
//       label: '교육주기',
//       style: 'width:100px',
//       align: 'center',
//       sortable: false
//     },
//     {
//       name: 'evaluationDate',
//       field: 'evaluationDate',
//       label: '최근 교육이수일',
//       style: 'width:120px',
//       align: 'center',
//       sortable: false
//     },
//     {
//       name: 'eduNextDate',
//       field: 'eduNextDate',
//       label: '차기 교육이수일',
//       style: 'width:120px',
//       align: 'center',
//       sortable: false
//     }
//   ]
// })
// const gridHistory = ref({
//   columns: [
//     {
//       name: "seniorUserName",
//       field: "seniorUserName",
//       label: "선임자",
//       style: 'width:180px',
//       align: 'center',
//       sortable: false,
//       type: 'custom',
//     },
//     {
//       name: "seniorDate",
//       field: "seniorDate",
//       label: "선임일",
//       style: 'width:130px',
//       align: 'center',
//       sortable: false,
//     },
//     {
//       name: "dismissalDate",
//       field: "dismissalDate",
//       label: "해임일",
//       style: 'width:130px',
//       align: 'center',
//       sortable: false,
//     },
//   ],
//   height: '400px'
// })
const editable = ref(true)
const isSave = ref(false)
const mappingType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => {
  return Boolean(props.popupParam.seniorStatusId)
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
  editable.value = Boolean(route.meta.editable)
  detailUrl.value = selectConfig.mdm.senior.status.get.url
  saveUrl.value = transactionConfig.mdm.senior.status.insert.url
  deleteUrl.value = transactionConfig.mdm.senior.status.delete.url
  getDetail()
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.seniorStatusId),
      method: 'GET'
    }).then((_result: any) => {
      seniorDismissalStatus.value = _result.data
      seniorDismissalStatus.value.dismissalFlagSave = _result.data.dismissalFlag
      seniorDismissalStatus.value.dismissalDateSave = _result.data.dismissalDate
      attachInfo.value.taskKey = props.popupParam.seniorStatusId
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  mappingType.value = isOld.value ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          seniorDismissalStatus.value.regUserId = user.value.userId
          seniorDismissalStatus.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}

function saveCallback(result: any) {
  message.requestSuccess()
  if (mappingType.value === 'POST') {
    props.popupParam.seniorStatusId = result.data
    attachInfo.value.taskKey = props.popupParam.seniorStatusId
    attachInfo.value.isSubmit = uid()
  }
  getDetail()
}

/******************************
 * TODO (목적): radio 선택 변경 시 발생 로직
 *******************************/
function datachange() {
  if (seniorDismissalStatus.value.dismissalFlag === 'N') {
    seniorDismissalStatus.value.dismissalDate = ''
  } else {
    seniorDismissalStatus.value.dismissalDate = getToday()
  }
}

/******************************
 * TODO (목적): 팝업창에서 선임명 선택시 발생로직
 *******************************/
function dataChange(data1: any, data2: any, data3: any) {
  if (data3) {
    seniorDismissalStatus.value.relatedLaws = data3.relatedLaws
    seniorDismissalStatus.value.seniorName = data3.seniorName
    seniorDismissalStatus.value.qualifiyRequire = data3.qualifiyRequire
    seniorDismissalStatus.value.seniorId = data3.seniorId
  }
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.seniorStatusId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
</script>
