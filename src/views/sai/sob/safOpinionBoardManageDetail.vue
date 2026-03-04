<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="제안의견" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                required
                :editable="false"
                label="제목"
                name="boardTitle"
                v-model:value="opinionData.boardTitle"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                required
                :editable="false"
                label="의견게시일"
                name="boardDate"
                v-model:value="opinionData.boardDate"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-plant
                required
                :editable="false"
                type="edit"
                name="plantCd"
                v-model:value="opinionData.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-field
                v-if="opinionData.regFlag === 'user'"
                :editable="false"
                type="dept_user"
                label="작성자"
                name="regUserId"
                v-model:value="opinionData.regUserId"
              />
              <c-text
                v-else
                :editable="false"
                label="작성자"
                name="regUserName"
                v-model:value="opinionData.regUserName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                required
                :editable="false"
                :rows="8"
                label="의견"
                name="boardContents"
                v-model:value="opinionData.boardContents"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-upload
                :attachInfo="attachInfoRequest"
                :editable="false"
                label="제안의견 첨부파일"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="의견 결과" class="cardClassDetailForm" bgClass="orange-2">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave2"
                :param="opinionData"
                :mappingType="mappingType"
                label="처리결과 저장"
                icon="save"
                @beforeAction="saveData2"
                @btnCallback="saveCallback2"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-select
                :editable="editable"
                codeGroupCd="SOP_BOARD_RESULT_CD"
                itemText="codeName"
                itemValue="code"
                type="edit"
                name="resultCd"
                label="처리결과"
                v-model:value="opinionData.resultCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10" />
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-textarea
                :editable="editable"
                autogrow
                label="의견 처리 결과"
                name="boardResultContent"
                v-model:value="opinionData.boardResultContent"
              />
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6">
              <c-upload :attachInfo="attachInfo" :editable="editable" label="의견결과 첨부파일" />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="제안의견 개선 요청"
          :columns="gridImpr.columns"
          :data="gridImpr.data"
          gridHeight="300px"
          :usePaging="false"
          :filtering="false"
          :columnSetting="false"
          @linkClick="linkClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                label="개선요청"
                :showLoading="false"
                icon="add"
                @btnClicked="addImpr(1)"
              />
              <c-btn
                v-if="editable"
                label="즉시조치"
                :showLoading="false"
                icon="add"
                @btnClicked="addImpr(2)"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-12" style="height: 20px" />
    </div>
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
import { dataBaseType } from '@/types/dataBase'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safOpinionBoardManageDetail'
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
    boardId: stringNull
  }
}
interface opinionType extends dataBaseType {
  boardId: stringNull
  plantCd: stringNull
  boardDate: stringNull
  boardContents: stringNull
  boardTitle: stringNull
  boardTypeCd: stringNull
  boardProblem: stringNull
  boardResultContent: stringNull
  boardImprove: stringNull
  boardBenefit: stringNull
  boardLocation: stringNull
  policyCommentModelList: object[]
  regUserId: stringNull
  regFlag: stringNull
  resultCd: stringNull
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
      boardId: ''
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
  taskClassCd: 'SOB_BOARD',
  taskKey: ''
})
const attachInfoRequest = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'SOB_BOARD_REQUEST',
  taskKey: ''
})
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const opinionData = ref<opinionType>({
  boardId: '',
  plantCd: '',
  boardDate: '',
  boardContents: '',
  boardTitle: '',
  boardTypeCd: null,
  boardProblem: '',
  boardResultContent: '',
  boardImprove: '',
  boardBenefit: '',
  boardLocation: '',
  policyCommentModelList: [],
  regUserId: '',
  regFlag: '',
  resultCd: ''
})
const gridImpr = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'ibmClassName',
      field: 'ibmClassName',
      label: '구분',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'actionDeptName',
      field: 'actionDeptName',
      label: '조치부서',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'ibmTitle',
      field: 'ibmTitle',
      label: '제목',
      align: 'left',
      style: 'width:300px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'actionContents',
      field: 'actionContents',
      label: '조치내용',
      align: 'left',
      style: 'width:400px',
      sortable: false
    },
    {
      name: 'actionCompleteDate',
      field: 'actionCompleteDate',
      label: '조치완료일',
      align: 'center',
      style: 'width:120px',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const deletable = ref(false)
const isSave2 = ref(false)
const isOwner = ref(false)
const mappingType = ref('POST')
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.sai.sob.board.insert.url)
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const impListUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)

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
  editable.value = Boolean(route.meta.editable)
  opinionData.value.boardDate = getToday()
  opinionData.value.regUserId = user.value.userId

  detailUrl.value = selectConfig.sai.sob.board.get.url
  insertUrl.value = transactionConfig.sai.sob.board.insert.url
  updateUrl.value = transactionConfig.sai.sob.board.update.url
  deleteUrl.value = transactionConfig.sai.sob.board.delete.url
  impListUrl.value = selectConfig.sop.ibm.improve.others.url
  getDetail()
}

/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.boardId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.boardId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(opinionData.value, _result.data)
      if (opinionData.value.regUserId === user.value.userId) {
        isOwner.value = true
        deletable.value = true
      } else {
        isOwner.value = false
        deletable.value = false
      }
      getImpList()
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
      attachInfo.value.taskKey = props.popupParam.boardId
      attachInfoRequest.value.taskKey = props.popupParam.boardId
    })
  } else {
    opinionData.value.regUserId = user.value.userId
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveData2() {
  mappingType.value = props.popupParam.boardId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: any) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          isSave2.value = !isSave2.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}

function saveCallback2(result: any) {
  message.requestSuccess()
  if (mappingType.value === 'POST') {
    props.popupParam.boardId = result.data
    attachInfo.value.taskKey = props.popupParam.boardId
    attachInfo.vallue.isSubmit = uid()
    attachInfoRequest.value.taskKey = props.popupParam.boardId
    attachInfoRequest.value.isSubmit = uid()
  }
  getDetail()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getImpList() {
  if (props.popupParam.boardId) {
    $http({
      url: impListUrl.value,
      method: 'GET',
      params: {
        ibmTaskTypeCd: 'ITT0000220',
        ibmTaskUnderTypeCd: 'ITTU000250',
        relationTableKey: props.popupParam.boardId
      }
    }).then((_result: any) => {
      gridImpr.value.data = _result.data
    })
  }
}

/******************************
 * TODO (목적): 개선요청 / 즉시조치 추가
 *******************************/
function addImpr(num?: number) {
  popupOptions.value.title = num === 1 ? '개선요청' : '즉시조치'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(
      () => import(num === 1 ? `@views/sop/ibm/imprDetail.vue` : `@views/sop/ibm/imprImmDetail.vue`)
    )
  )
  popupOptions.value.param = {
    requestContents: opinionData.value.boardTitle,
    relationTableKey: props.popupParam.boardId,
    ibmTaskTypeCd: 'ITT0000220',
    ibmTaskUnderTypeCd: 'ITTU000250'
  }
  popupOptions.value.width = '80%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
function closeAddImprPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getImpList()
}

/******************************
 * TODO (목적): row 클릭
 *******************************/
function linkClick(row: any) {
  if (row.ibmClassCd === 'IC00000001') {
    popupOptions.value.title = '개선'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/ibm/imprDetail.vue`))
    )
  } else {
    popupOptions.value.title = '즉시조치'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/ibm/imprImmDetail.vue`))
    )
  }
  popupOptions.value.param = { sopImprovementId: row.sopImprovementId }
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAddImprPopup
}
</script>
