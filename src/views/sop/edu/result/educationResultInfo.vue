<template>
  <q-form ref="editForm">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-card class="cardClassDetailForm" title="교육계획 기본정보">
        <template v-slot:card-button>
          <c-btn
            v-if="editable && !disabled"
            :url="updateUrl"
            :isSubmit="isSave"
            :param="educationInfo"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveEducation"
            @btnCallback="saveCallback"
          />
        </template>
        <template v-slot:card-detail>
          <div class="col-3">
            <c-label-text title="교육명" :value="educationInfo.educationName" />
          </div>
          <div class="col-3">
            <c-label-text title="교육과정" :value="educationInfo.educationCourseName" />
          </div>
          <div class="col-3">
            <c-label-text title="교육종류1" :value="educationInfo.educationKindCdLargeName" />
          </div>
          <div class="col-3">
            <c-label-text title="교육종류2" :value="educationInfo.educationKindCdSmallName" />
          </div>
          <div class="col-3">
            <c-label-text title="교육구분" :value="educationInfo.educationTypeName" />
          </div>
          <div class="col-3">
            <c-label-text title="사업장" :value="educationInfo.plantName" />
          </div>
          <div class="col-3">
            <c-label-text title="주관부서" :value="educationInfo.departmentDeptName" />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-card title="교육평가 및 경비정보" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
            <c-textarea
              :disabled="disabled"
              :rows="3"
              :editable="editable"
              name="educationOverview"
              label="교육총평"
              v-model:value="educationInfo.educationOverview"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              :rows="5"
              label="평가자 의견"
              name="instructorOpinion"
              v-model:value="educationInfo.instructorOpinion">
            </c-textarea>
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-textarea
              :editable="editable"
              :disabled="disabled"
              :rows="3"
              label="비고"
              name="remark"
              v-model:value="educationInfo.remark"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :suffix="$language('원')"
              type="number"
              :editable="editable"
              :disabled="disabled"
              label="집행예산"
              name="executionBudget"
              v-model:value="educationInfo.executionBudget"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :suffix="$language('원')"
              type="number"
              :editable="editable"
              :disabled="true"
              label="예산잔액"
              name="budgetPlan"
              v-model:value="budgetPlan"
            />
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
            <c-select
              :editable="editable"
              :disabled="disabled"
              type="edit"
              codeGroupCd="EDU_EVAL_CD"
              itemText="codeName"
              itemValue="code"
              name="evaluationEvalCd"
              label="교육평가"
              v-model:value="educationInfo.evaluationEvalCd"
            />
          </div>
        </template>
      </c-card>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="평가자 목록"
          :columns="grid.columns"
          :gridHeight="grid.height"
          :data="educationInfo.eduEvalUserList"
          :filtering="false"
          :checkClickFlag="false"
          :columnSetting="false"
          :usePaging="false"
          :isExcelDown="false"
          :hideBottom="true"
          :editable="editable && !disabled"
          rowKey="evalUserId"
          selection="multiple"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <!-- 추가 -->
              <c-btn
                v-if="editable && !disabled"
                label="추가"
                :showLoading="false"
                icon="add"
                @btnClicked="addEvalUser"
              />
              <!-- 제외 -->
              <c-btn
                v-if="editable && !disabled && educationInfo.eduEvalUserList!.length > 0"
                label="제외"
                :showLoading="false"
                icon="remove"
                @btnClicked="removeEvalUser"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { eduResultType } from './eduResult'

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
  name: 'educationResultInfo'
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
const emits = defineEmits(['setData'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: eduResultPopupParamType
  educationInfo: eduResultType
  planUpdateBtnData: planUpdateBtnDataType
}
interface eduResultPopupParamType {
  eduEducationId: stringNull
}
interface planUpdateBtnDataType {
  title: stringNull
  flag: boolean
  research: stringNull
  planResearch: stringNull
}
interface gridType {
  columns: tableColumnType
  height: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      eduEducationId: ''
    }
  },

  educationInfo: () => {
    return {
      eduEducationId: '',
      educationName: '',
      eduCourseId: '',
      plantCd: '',
      educationCourseName: '',
      educationKindCdLarge: null,
      educationKindCdSmall: null,
      educationTypeCd: null,
      departmentDeptCd: '',
      departmentDeptName: '',
      executionBudget: '',
      estimatedEducationExpenses: '',
      educationMethodName: '',
      educationMethodCd: null,
      educationOverview: '',
      evaluationEvalCd: null,
      documentStatusCd: '',
      qrCodeRoute: '',
      educationTypeName: null,
      plantName: null,

      regUserId: '',
      chgUserId: '',
      eduSubjectList: [], // 과정별 교육과목
      eduAttendeeList: [],
      eduEvalUserList: [],
      deleteEduEvalUserList: []
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'evalStandard',
      field: 'evalStandard',
      style: 'width:40%',
      type: 'text',
      label: '평가기준',
      align: 'left',
      sortable: false
    },
    {
      name: 'evalUserName',
      field: 'evalUserName',
      style: 'width:20%',
      label: '평가자',
      align: 'center',
      sortable: false
    },
    {
      name: 'evalResult',
      field: 'evalResult',
      style: 'width:40%',
      type: 'text',
      label: '평가결과',
      align: 'left',
      sortable: false
    }
  ],
  height: '240px'
})
const budgetPlan = ref(0)
const getUrl = ref('')
const updateUrl = ref('')
const completeUrl = ref('')
const isSave = ref(false)
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isEnvSafDept = computed(
  () => _.indexOf(auths.value, 'SAGI000021') > -1 || user.value.empNo === 'admin'
)
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
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.educationInfo.executionBudget,
  () => {
    budgetPlan.value =
      Number(props.educationInfo.estimatedEducationExpenses) -
      Number(props.educationInfo.executionBudget)
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
  getUrl.value = selectConfig.sop.edu.result.get.url
  updateUrl.value = transactionConfig.sop.edu.result.update.url
  completeUrl.value = transactionConfig.sop.edu.result.complete.url
  // code setting
  // list setting
}
function saveEducation() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.educationInfo.chgUserId = user.value.userId
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
function addEvalUser() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
  popupOptions.value.title = '교육평가자 검색'
  popupOptions.value.param = {
    type: 'multiple'
  }
}
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(props.educationInfo.eduEvalUserList, {
        evalUserId: _item.userId
      })
      if (index === -1) {
        props.educationInfo.eduEvalUserList!.splice(0, 0, {
          eduEducationId: props.param.eduEducationId,
          evalUserId: _item.userId,
          evalUserName: _item.userName,
          evalResult: '',
          evalStandard: '',
          regUserId: user.value.userId,
          chgUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.param.eduEducationId = result.data
  emits('setData', result.data)
}
function removeEvalUser() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.educationInfo.deleteEduEvalUserList) {
        props.educationInfo.deleteEduEvalUserList = []
      }
      if (
        _.findIndex(props.educationInfo.deleteEduEvalUserList, {
          evalUserId: item.evalUserId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.educationInfo.deleteEduEvalUserList.push(item)
      }
      props.educationInfo.eduEvalUserList = _.reject(props.educationInfo.eduEvalUserList, item)
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
