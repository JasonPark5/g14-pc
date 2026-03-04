<template>
  <q-form ref="editForm">
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="educationInfo"
            :mappingType="saveType"
            label="저장"
            icon="save"
            @beforeAction="saveInfo"
            @btnCallback="saveCallback"
          />
          <!-- <c-btn 
            v-if="editable&&popupParam.eduCourseId" 
            label="삭제" 
            icon="delete_forever" 
            @btnClicked="removeInfo"
          /> -->
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <c-text
            required
            :editable="editable"
            label="교육과정명"
            name="educationCourseName"
            v-model:value="educationInfo.educationCourseName"
          />
        </div>
        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <c-select
            required
            :editable="editable"
            type="edit"
            codeGroupCd="EDU_KIND_FST_CD"
            itemText="codeName"
            itemValue="code"
            name="educationKindCdLarge"
            label="교육종류1"
            v-model:value="educationInfo.educationKindCdLarge"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            required
            :editable="editable"
            type="edit"
            codeGroupCd="EDU_KIND_SEC_CD"
            itemText="codeName"
            itemValue="code"
            name="educationKindCdSmall"
            label="교육종류2"
            v-model:value="educationInfo.educationKindCdSmall"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            required
            :editable="editable"
            :isEnterprise="true"
            type="edit"
            name="plantCd"
            v-model:value="educationInfo.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            required
            :editable="editable"
            type="edit"
            codeGroupCd="EDU_CLASS_CD"
            itemText="codeName"
            itemValue="code"
            name="educationTypeCd"
            label="교육구분"
            v-model:value="educationInfo.educationTypeCd"
          />
        </div>
        <div class="col-xs-4 col-sm-4 col-md-1 col-lg-1 col-xl-1">
          <c-checkbox
            :editable="editable"
            :isFlag="true"
            label="법정교육여부"
            name="legalEducationFlag"
            v-model:value="educationInfo.legalEducationFlag"
            @datachange="legalDatachange"
          />
        </div>
        <div class="col-xs-4 col-sm-4 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :required="true"
            :editable="editable"
            type="edit"
            codeGroupCd="EDU_CYCLE_CD"
            itemText="codeName"
            itemValue="code"
            name="educationCycle"
            label="교육주기"
            v-model:value="educationInfo.educationCycle"
          />
        </div>
        <div class="col-xs-4 col-sm-4 col-md-3 col-lg-3 col-xl-3">
          <c-text
            :suffix="$language('원')"
            type="number"
            :editable="editable"
            label="예상교육비"
            name="estimatedEducationExpenses"
            v-model:value="educationInfo.estimatedEducationExpenses"
          />
        </div>
        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <c-text
            :editable="editable"
            label="주요 대상자"
            name="mainTargetAudience"
            v-model:value="educationInfo.mainTargetAudience"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            :required="true"
            :editable="editable"
            label="교육장소"
            name="educationLocation"
            v-model:value="educationInfo.educationLocation"
          />
        </div>
        <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <c-multi-select
            required
            :editable="editable"
            :isArray="false"
            codeGroupCd="RELATED_LAWS_CD"
            itemText="codeName"
            itemValue="code"
            label="관련법규"
            name="relationLaws"
            maxValues="3"
            v-model:value="educationInfo.relationLaws"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <c-text
            required
            :editable="editable"
            label="학습목적"
            name="educationPurpose"
            v-model:value="educationInfo.educationPurpose"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
          <c-checkbox
            :editable="editable"
            :isFlag="true"
            label="사용여부"
            name="useFlag"
            v-model:value="educationInfo.useFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            type="edit"
            :comboItems="comboItems"
            itemText="codeName"
            itemValue="code"
            itemDisable="disable"
            name="educationMethodCd"
            label="교육방법"
            v-model:value="educationInfo.educationMethodCd"
            @datachange="educationMethodChange"
          >
            <template v-slot:suffixLabel>
              <q-icon name="info" color="orange" style="font-size: 1.4em; margin-left: 10px">
                <q-tooltip
                  anchor="center right"
                  self="center left"
                  :offset="[10, 10]"
                  content-style="font-size: 0.9em"
                >
                  {{ $language('교육교재 섹션에서 동영상 파일 첨부시 동영상 선택 가능') }}
                </q-tooltip>
              </q-icon>
            </template>
          </c-select>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :disabled="educationInfo.educationMethodCd != 'EMC999999'"
            :editable="editable"
            :comboItems="educationVodItems"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="vod"
            label="교육용 동영상"
            v-model:value="educationInfo.vod"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
          <c-checkbox
            :editable="editable"
            :isFlag="true"
            label="문제풀이여부"
            name="eduQuestionFlag"
            v-model:value="educationInfo.eduQuestionFlag"
            @datachange="questionDatachange"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :disabled="!isQuestion"
            :required="isQuestion"
            :customPopupParam="{ targetKey: 'eduQuiz' }"
            :editable="editable"
            label="문제풀이SET"
            name="eduQuestionMstId"
            v-model:value="educationInfo.eduQuestionMstId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
          <c-text
            :disabled="!isQuestion"
            :required="isQuestion"
            :editable="editable"
            type="number"
            label="통과기준점수"
            name="eduQuestionPassScore"
            v-model:value="educationInfo.eduQuestionPassScore"
          />
        </div>
      </template>
    </c-card>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          title="교육내용"
          :gridHeight="gridHeight"
          :columns="grid.columns"
          :data="educationInfo.eduCourseSubjectList"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :hideBottom="true"
          :isExcelDown="false"
          :editable="editable"
          rowKey="subjectNo"
          selection="multiple"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                label="추가"
                :showLoading="false"
                icon="add"
                @btnClicked="addItem"
              />
              <c-btn
                v-if="editable && educationInfo.eduCourseSubjectList.length > 0"
                label="제외"
                :showLoading="false"
                icon="remove"
                @btnClicked="removeItem"
              />
            </q-btn-group>
          </template>
          <template
            v-if="
              educationInfo.eduCourseSubjectList && educationInfo.eduCourseSubjectList.length > 0
            "
            v-slot:suffixTitle
          >
            <span style="font-size: 0.8em; color: red">
              {{ $language('※ 총 교육소요시간 : ') }}
            </span>
            <q-chip
              outline
              square
              dense
              color="primary"
              text-color="white"
              class="q-ma-none customchipdept"
            >
              {{ formattedEducationTime }}
            </q-chip>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 attach">
        <c-upload
          ref="fileUpload"
          :attachInfo="attachInfo"
          :editable="editable"
          label="교육교재"
          @files="files"
        />
      </div>
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
import { eduCourseType, eduCoursePopupParamType, eduCourseSubjectType } from './eduCourse'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'educationCourseInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['changeStatus', 'getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: eduCoursePopupParamType
  educationInfo: eduCourseType
  attachInfo: attachSettingType
}
interface gridType {
  columns: tableColumnType
  data: Array<eduCourseSubjectType>
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
      eduCourseId: ''
    }
  },
  educationInfo: () => {
    return {
      plantName: null,
      eduCourseId: '', // 교육과정 일련번호
      plantCd: '', // 사업장 코드
      educationCourseName: '', // 교육과정명
      educationKindCdLarge: null, // 교육종류1
      educationKindCdSmall: null, // 교육종류2
      educationTypeCd: null, // 전사자체/부서자체/사내위탁/사외교육/연수/기타
      legalEducationFlag: 'Y', // 법정교육 여부
      sumEducationTime: '', // 교육시간
      educationCycle: null, // 주기
      educationPurpose: '', // 학습목적
      mainTargetAudience: '', // 기술
      estimatedEducationExpenses: '', // 예상 교육비
      relationLaws: '', // 관련 법규
      useFlag: 'Y',
      eduQuestionFlag: 'N',
      eduQuestionMstId: '',
      eduQuestionPassScore: 0,
      educationLocation: '', // 교육장소
      ramRiskAssessmentPlanId: '', //3단계판단법 일련번호
      educationMethodCd: null, //교육방법
      vod: null, // 동영상교육소스

      eduCourseSubjectList: [], // 과정별 교육과목
      deleteEduCourseSubjectList: [], // 제외과목
      eduCourseUserList: [], // 대상자
      deleteEduCourseUserList: [], // 제외 대상자
      eduCourseDeptList: [], // 대상부서
      deleteEduCourseDeptList: [], // 제외 대상부서
      eduCourseSeniorList: [], // 대상 선임
      deleteEduCourseSeniorList: [], // 제외 대상 선임

      regUserId: '',
      chgUserId: ''
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'EDU_CURRICULUM',
      taskKey: ''
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
const resultCountUrl = ref('')
const saveUrl = ref('')
const saveType = ref('')
const isSave = ref(false)
const checkUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const comboItems = ref<Array<any>>([])
const educationVodItems = ref<Array<any>>([])
const editForm = ref<any>(null)
const table = ref<any>(null)
const fileUpload = ref<any>(null)
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'subjectName',
      field: 'subjectName',
      label: '과목 및 세부내용',
      style: 'width:200px',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'educationTime',
      field: 'educationTime',
      label: '교육소요시간',
      type: 'datetime',
      minuteStep: 10,
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'instructorName',
      field: 'instructorName',
      type: 'text',
      label: '강사명',
      style: 'width:80px',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => String(Number(window.innerHeight) - 550) + 'px')
const isQuestion = computed(() => props.educationInfo.eduQuestionFlag == 'Y')
const formattedEducationTime = computed(() => {
  let totalMinutes = 0
  props.educationInfo.eduCourseSubjectList.forEach((item: eduCourseSubjectType) => {
    if (item.educationTime) {
      const [hours, minutes] = item.educationTime.split(':').map((part: any) => parseInt(part, 10))
      totalMinutes += hours * 60 + minutes
    }
  })
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60
  // 계산된 총 시간을 표시, 앞에 '0'을 붙여 두 자리 숫자로 표시
  const formattedHours = totalHours.toString().padStart(2, '0')
  const formattedMinutes = remainingMinutes.toString().padStart(2, '0')
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  props.educationInfo.sumEducationTime = `${formattedHours}:${formattedMinutes}`
  return props.educationInfo.sumEducationTime // 계산된 총 시간을 반환
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
  saveUrl.value = transactionConfig.sop.edu.course.insert.url
  insertUrl.value = transactionConfig.sop.edu.course.insert.url
  updateUrl.value = transactionConfig.sop.edu.course.update.url
  deleteUrl.value = transactionConfig.sop.edu.course.delete.url
  checkUrl.value = selectConfig.sop.edu.course.check.url
  resultCountUrl.value = selectConfig.sop.edu.result.count.url
  // code setting
  getComboItems('EDU_METHOD_CD').then((_result: any) => {
    _.forEach(_result, (_item: codeMasterType) => {
      if (_item.attrVal1 == 'Y') _item.disable = true
      else _item.disable = false
    })
    comboItems.value = _result
  })
  // list setting
}
/******************************
 * TODO (목적): 교육방법 datachange
 *******************************/
function educationMethodChange() {
  if (props.educationInfo.educationMethodCd !== 'EMC999999') {
    props.educationInfo.vod = null
  }
}

/******************************
 * TODO (목적): 교육교재 datachange
 *******************************/
function files(fileList: any) {
  educationVodItems.value = []
  _.forEach(fileList, (_item) => {
    if (_item.contentType == 'video/mp4') {
      educationVodItems.value.push({
        code: _item.sysAttachFileId,
        codeName: _item.oriFileNm
      })
    }
  })
  if (fileList.length > 0) {
    _.forEach(fileList, (_item) => {
      if (_item.contentType == 'video/mp4') {
        _.forEach(comboItems.value, (_item) => {
          _item.disable = false
          return
        })
      }
    })
  } else {
    _.forEach(comboItems.value, (_item) => {
      if (_item.attrVal1 === 'Y') _item.disable = true
      else _item.disable = false
    })
  }
}
/******************************
 * TODO (목적): 교육내용 추가
 *******************************/
function addItem() {
  props.educationInfo.eduCourseSubjectList.splice(0, 0, {
    eduCourseId: props.popupParam.eduCourseId,
    subjectNo: uid(),
    subjectName: '', // 교육명
    educationTime: '01:00', // 교육시간
    instructorName: '', // 강사명
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 교육내용 삭제
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
    _.forEach(selectData, (item) => {
      if (!props.educationInfo.deleteEduCourseSubjectList) {
        props.educationInfo.deleteEduCourseSubjectList = []
      }
      if (
        _.findIndex(props.educationInfo.deleteEduCourseSubjectList, {
          subjectNo: item.subjectNo
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.educationInfo.deleteEduCourseSubjectList.push(item)
      }
      props.educationInfo.eduCourseSubjectList = _.reject(
        props.educationInfo.eduCourseSubjectList,
        item
      )
    })
  }
}
/******************************
 * TODO (목적): 교육과정 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.eduCourseId) {
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      if (props.educationInfo.eduQuestionFlag == 'N') {
        props.educationInfo.eduQuestionMstId = null
        props.educationInfo.eduQuestionPassScore = 0
      } else {
        if (props.educationInfo.eduQuestionPassScore == 0) {
          message.alert({
            title: '안내',
            message: '문제풀이 통과 기준점수를 입력하세요.', // 문제풀이 통과 기준점수를 입력하세요.
            type: 'warning' // success / info / warning / error
          })
          return
        }
      }
      let validPass = true
      if (
        props.educationInfo.eduCourseSubjectList &&
        props.educationInfo.eduCourseSubjectList.length > 0
      ) {
        validPass = validTable(grid.value.columns, props.educationInfo.eduCourseSubjectList)
      }
      if (validPass) {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',

          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            props.educationInfo.regUserId = user.value.userId
            props.educationInfo.chgUserId = user.value.userId

            isSave.value = !isSave.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 교육과정 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  if (!props.popupParam.eduCourseId) {
    props.attachInfo.taskKey = result.data
    fileUpload.value.submitFile().finally(() => {
      props.popupParam.eduCourseId = result.data
      emits('getDetail')
    })
  } else {
    emits('getDetail')
  }
}
/******************************
 * TODO (목적): 교육과정 삭제
 *******************************/
// function removeInfo() {
//   $http({
//     url: $format(resultCountUrl.value, props.popupParam.eduCourseId),
//     method: 'GET'
//   }).then((_result: any) => {
//     if (_result.data > 0) {
//       message.alert({
//         title: '안내',
//         // 해당 교육과정은 사용중인 교육계획이 존재하여\r\n삭제할 수 없습니다.
//         message: '해당 교육과정은 사용중인 교육계획이 존재하여 삭제할 수 없습니다.',
//         type: 'info' // success / info / warning / error
//       })
//     } else {
//       message.confirm({
//         title: '확인',
//         message: '삭제하시겠습니까?',
//         type: 'info', // success / info / warning / error
//         // 확인 callback 함수
//         confirmCallback: () => {
//           $http({
//             url: $format(deleteUrl.value, props.popupParam.eduCourseId),
//             method: 'DELETE'
//           }).then((_result: any) => {
//             message.requestSuccess()
//             emits('closePopup')
//           })
//         },
//         // 취소 callback 함수
//         cancelCallback: () => {}
//       })
//     }
//   })
// }
/******************************
 * TODO (목적): 법정교육여부 datachange
 *******************************/
function legalDatachange() {
  if (props.educationInfo.legalEducationFlag !== 'Y') {
    props.educationInfo.educationCycle = null
  }
}
/******************************
 * TODO (목적): 문제풀이여부 datachange
 *******************************/
function questionDatachange(value: string) {
  if (value === 'Y') props.educationInfo.eduQuestionPassScore = 80
  else props.educationInfo.eduQuestionPassScore = 0
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.attach
  .upload-cover
    margin-top: -5px !important
    .custom-upload, .uploaded-file-list
      min-height: 300px !important
      max-height: 300px !important
</style>
