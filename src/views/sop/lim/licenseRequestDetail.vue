<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <q-form ref="editForm">
        <c-card class="cardClassDetailForm" title="인허가 요청정보">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-show="editable && param.limLicenseRequestId && deleteEditable && !disabled"
                label="삭제"
                icon="delete_forever"
                @btnClicked="deleteData"
              />
              <c-btn
                v-show="editable && !disabled"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="licenseRequest"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveData"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-show="editable && param.limLicenseRequestId && !disabled"
                :url="receiptUrl"
                :isSubmit="isRequest"
                :param="licenseRequest"
                mappingType="PUT"
                label="인허가요청"
                icon="check"
                @beforeAction="requestData"
                @btnCallback="requestCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="인허가 요청명"
                name="licenseRequestName"
                v-model:value="licenseRequest.licenseRequestName"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-plant
                :required="true"
                :disabled="disabled"
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model:value="licenseRequest.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-field
                :editable="editable"
                :disabled="true"
                :data="licenseRequest"
                deptValue="requestDeptCd"
                type="dept_user"
                label="요청부서 & 요청자"
                name="requestUserId"
                v-model:value="licenseRequest.requestUserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-field
                :required="true"
                :disabled="disabled"
                :editable="editable"
                :data="licenseRequest"
                deptValue="reviewDeptCd"
                type="dept_user"
                label="검토부서 & 검토자"
                name="reviewUserId"
                v-model:value="licenseRequest.reviewUserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="인허가 완료 요청일"
                name="completeRequestDate"
                v-model:value="licenseRequest.completeRequestDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-textarea
                :disabled="disabled"
                :editable="editable"
                autogrow
                name="requestContent"
                label="요청 내용"
                v-model:value="licenseRequest.requestContent"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-textarea
                v-show="licenseRequest.requestStepCd == 'RSC0999999'"
                :disabled="true"
                :editable="editable"
                label="기각사유"
                name="dismissReason"
                v-model:value="licenseRequest.dismissReason"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        class="q-mt-sm"
        title="인허가 검토 목록"
        :columns="grid.columns"
        :data="licenseRequest.reviews"
        gridHeight="540px"
        :columnSetting="false"
        :usePaging="false"
        :isFullScreen="false"
        :isExcelDown="false"
        :editable="editable && !disabled"
        selection="multiple"
        rowKey="limLicenseReviewId"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addReview" />
            <c-btn
              v-if="editable && !disabled && licenseRequest.reviews.length > 0"
              label="제외"
              icon="remove"
              @btnClicked="deleteReview"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props: bodyProps, col }">
          <template v-if="col.name === 'limLicenseKindId'">
            <c-task-target
              :editable="editable && !disabled"
              name="limLicenseKindId"
              label=""
              :customPopupParam="{ targetKey: 'licenseKind' }"
              v-model:value="bodyProps.row.limLicenseKindId"
              @dataChange="
                (newValue: string, oldValue: string, taskData: licenseType) =>
                  dataChange(bodyProps.row, taskData)
              "
            />
          </template>
          <template v-else-if="col.name === 'asLicenseSeq'">
            <c-task-target
              v-if="bodyProps.row.renewalFlag === 'Y'"
              :editable="editable && !disabled"
              name="asLicenseSeq"
              label=""
              :customPopupParam="{
                targetKey: 'license',
                setSearchParam: { limLicenseKindId: bodyProps.row.limLicenseKindId }
              }"
              v-model:value="bodyProps.row.asLicenseSeq"
            />
          </template>
        </template>
      </c-table>
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
import { licenseRequestType, licenseReviewType, licenseType } from './license'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'licenseRequestDetail'
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
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    limLicenseRequestId: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
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
      limLicenseRequestId: ''
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
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

const licenseRequest = ref<licenseRequestType>({
  limLicenseRequestId: '',
  plantCd: '',
  licenseRequestName: '',
  requestDeptCd: '',
  requestUserId: '',
  completeRequestDate: '',
  requestContent: '',
  sopMocId: '',
  requestStepCd: 'RSC0000001',
  dismissReason: '',
  reviewOpinion: '',
  reviewUserId: '',
  reviewDeptCd: '',
  regUserId: '',
  chgUserId: '',
  reviews: [],
  deleteReviews: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      align: 'center',
      style: 'widht: 150px',
      sortable: false
    },
    {
      required: true,
      name: 'limLicenseKindId',
      field: 'limLicenseKindId',
      label: '인허가종류',
      align: 'center',
      style: 'widht: 150px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'review',
      field: 'review',
      label: '검토',
      sortable: false,
      child: [
        {
          name: 'reviewDeptName',
          field: 'reviewDeptName',
          label: '부서',
          align: 'center',
          style: 'widht: 100px',
          sortable: false
        },
        {
          required: true,
          name: 'reviewUserName',
          field: 'reviewUserName',
          label: '검토자',
          align: 'center',
          style: 'widht: 100px',
          type: 'user',
          userId: 'reviewUserId',
          deptName: 'reviewDeptName',
          sortable: false
        }
      ]
    },
    {
      name: 'renewalFlag',
      field: 'renewalFlag',
      label: '갱신여부',
      align: 'center',
      style: 'widht: 100px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    },
    {
      name: 'asLicenseSeq',
      field: 'asLicenseSeq',
      label: '갱신대상 인허가',
      align: 'center',
      style: 'widht: 150px',
      type: 'custom',
      sortable: false
    }
  ]
})
const editable = ref(true)
const isSave = ref(false)
const isRequest = ref(false)
const mappingType = ref('POST')
const saveUrl = ref('')
const detailUrl = ref('')
const deleteUrl = ref('')
const receiptUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const deleteEditable = computed(() => {
  return (
    licenseRequest.value.requestStepCd === 'RSC0000001' ||
    licenseRequest.value.requestStepCd == 'RSC0000002' ||
    licenseRequest.value.requestStepCd == 'RSC0000003'
  )
})
const disabled = computed(() => {
  return (
    licenseRequest.value.requestUserId !== user.value.userId ||
    licenseRequest.value.requestDeptCd !== user.value.deptCd ||
    (licenseRequest.value.requestStepCd && licenseRequest.value.requestStepCd !== 'RSC0000001')
  )
})

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  window.addEventListener('resize', setSize)
})
onMounted(() => {
  init()
})
onDeactivated(() => {
  window.removeEventListener('resize', setSize)
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기셋팅..
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  detailUrl.value = selectConfig.sop.lim.lincense.request.get.url
  saveUrl.value = transactionConfig.sop.lim.lincense.request.insert.url
  deleteUrl.value = transactionConfig.sop.lim.lincense.request.delete.url
  receiptUrl.value = transactionConfig.sop.lim.lincense.request.reviewRecepit.url
  // code setting
  // list setting
  setSize()
  getDetail()
}

/******************************
 * TODO (목적): 화면크기에 맞춰 테이블 높이 동적 설정
 *******************************/
function setSize() {
  let height = window.innerHeight - 450
  if (height < 300) height = 300
  grid.value.height = String(height) + 'px'
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.param.limLicenseRequestId) {
    $http({
      url: $format(detailUrl.value, props.param.limLicenseRequestId),
      method: 'GET'
    }).then((_result: any) => {
      licenseRequest.value = _result.data
    })
  } else {
    licenseRequest.value.requestDeptCd = user.value.deptCd // 요청부서 코드
    licenseRequest.value.requestUserId = user.value.userId // 요청자
  }
}

/******************************
 * TODO (목적): 특정 컬럼 입력시 특정 속성 변경
 *******************************/
function dataChange(row: any, taskData: any) {
  row.relatedLawsName = taskData.relatedLawsName
  row.relatedLawsCd = taskData.relatedLawsCd
}

/******************************
 * TODO (목적): 요청에 대한 검토 추가
 *******************************/
function addReview() {
  const newObj: licenseReviewType = {
    limLicenseReviewId: uid(),
    limLicenseRequestId: props.param.limLicenseRequestId,
    limLicenseKindId: '',
    renewalFlag: 'N',
    reviewDeptCd: user.value.deptCd,
    reviewUserId: user.value.userId,
    reviewOpinion: '',
    reviewCompleteFlag: 'N',
    limLicenseKindStatusCd: 'LLKSC00001',
    asLicenseSeq: '',
    newLicenseSeq: '',
    regUserId: user.value.userId,
    editFlag: 'C',
    plantCd: null,
    relatedLawsCd: null,
    relatedLawsName: null,
    limLicenseKindName: null,
    reviewDeptName: null,
    reviewUserName: null,
    limLicenseKindStatusName: null,
    asLicenseSeqName: null
  }
  licenseRequest.value.reviews.push(newObj)
}

/******************************
 * TODO (목적): 요청에 대한 검토 삭제
 *******************************/
function deleteReview() {
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
        if (!licenseRequest.value.deleteReviews) licenseRequest.value.deleteReviews = []
        _.forEach(selectData, (item) => {
          if (
            item.editFlag !== 'C' &&
            _.findIndex(licenseRequest.value.deleteReviews, {
              limLicenseReviewId: item.limLicenseReviewId
            }) === -1
          )
            licenseRequest.value.deleteReviews.push(item)
          licenseRequest.value.reviews = _.reject(licenseRequest.value.reviews, item)
        })
        table.value.compoTable.clearSelection()
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  mappingType.value = props.param.limLicenseRequestId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (
        validTable(grid.value.columns, licenseRequest.value.reviews, $language('인허가 검토'), true)
      ) {
        // 갱신을 하는 경우 갱신대상 인허가 필수
        if (licenseRequest.value.reviews && licenseRequest.value.reviews.length > 0) {
          if (
            _.findIndex(licenseRequest.value.reviews, (review) => {
              return review.renewalFlag === 'Y' && !review.asLicenseSeq
            }) > -1
          ) {
            message.alert({
              title: '안내',
              message: '갱신대상 인허가 정보가 입력되지 않은 행이 있습니다.',
              type: 'warning' // success / info / warning / error
            })
            return
          }
        }
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            licenseRequest.value.regUserId = user.value.userId
            licenseRequest.value.chgUserId = user.value.userId
            isSave.value = !isSave.value
          },
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}

function saveCallback(result: any) {
  message.requestSuccess()
  if (mappingType.value === 'POST') {
    props.param.limLicenseRequestId = result.data.limLicenseRequestId
    emits('emitStep', {
      name: 'setId',
      param: result.data.limLicenseRequestId
    })
  }
  getDetail()
}

/******************************
 * TODO (목적): 인허가 요청, 검토항목 하나 이상
 *******************************/
function requestData() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (validTable(grid.value.columns, licenseRequest.value.reviews, $language('인허가 검토'))) {
        message.confirm({
          title: '확인',
          message: '인허가요청을 하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            licenseRequest.value.chgUserId = user.value.userId
            isRequest.value = !isRequest.value
          },
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}

function requestCallback(result: any) {
  message.requestSuccess()
  getDetail()
  emits('emitStep', {
    name: 'currentStep',
    param: result.data.requestStepCd
  })
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.limLicenseRequestId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('emitStep', { name: 'closePopup' })
      })
    },
    cancelCallback: () => {}
  })
}
</script>
