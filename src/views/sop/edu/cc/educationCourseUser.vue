<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-table
        ref="userTable"
        title="대상자 (교육계획 수립시 교육대상자 자동추가)"
        :columns="userGrid.columns"
        :gridHeight="gridHeight"
        :data="userGrid.data"
        :filtering="false"
        :isFullScreen="false"
        :checkClickFlag="false"
        :columnSetting="false"
        :usePaging="false"
        :isExcelDown="false"
        :editable="editable"
        rowKey="userId"
        selection="multiple"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn label="추가" icon="add" @btnClicked="addUser" v-if="editable" />
            <c-btn
              v-if="editable && userGrid.data.length > 0"
              label="삭제"
              :showLoading="false"
              icon="remove"
              @btnClicked="removeUser"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
      <c-table
        ref="deptTable"
        title="대상 부서 (부서원 전체)"
        :columns="deptGrid.columns"
        :gridHeight="gridHeight"
        :data="deptGrid.data"
        :filtering="false"
        :isFullScreen="false"
        :checkClickFlag="false"
        :columnSetting="false"
        :usePaging="false"
        :isExcelDown="false"
        :editable="editable"
        rowKey="deptCd"
        selection="multiple"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn label="추가" icon="add" @btnClicked="addDept" v-if="editable" />
            <c-btn
              v-if="editable && deptGrid.data.length > 0"
              label="삭제"
              :showLoading="false"
              icon="remove"
              @btnClicked="removeDept"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
      <c-table
        ref="seniorTable"
        title="대상 선임명 (선임자 전체)"
        :columns="seniorGrid.columns"
        :gridHeight="gridHeight"
        :data="seniorGrid.data"
        :filtering="false"
        :isFullScreen="false"
        :checkClickFlag="false"
        :columnSetting="false"
        :usePaging="false"
        :isExcelDown="false"
        :editable="editable"
        rowKey="seniorId"
        selection="multiple"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn label="추가" icon="add" @btnClicked="addSenior" v-if="editable" />
            <c-btn
              v-if="editable && seniorGrid.data.length > 0"
              label="삭제"
              :showLoading="false"
              icon="remove"
              @btnClicked="removeSenior"
            />
          </q-btn-group>
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
import { seniorInterface } from '../../com/senior'
import {
  eduCourseType,
  eduCoursePopupParamType,
  eduCourseUserType,
  eduCourseDeptType,
  eduCourseSeniorType
} from './eduCourse'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'educationCourseUser'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

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
  popupParam: eduCoursePopupParamType
  educationInfo: eduCourseType
}
interface gridUserType {
  columns: tableColumnType
  data: Array<eduCourseUserType>
}
interface gridDeptType {
  columns: tableColumnType
  data: Array<eduCourseDeptType>
}
interface gridSeniorType {
  columns: tableColumnType
  data: Array<eduCourseSeniorType>
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
const userGrid = ref<gridUserType>({
  columns: [
    {
      name: 'userName',
      field: 'userName',
      label: '사용자',
      style: 'width:25%',
      align: 'center',
      sortable: false
    },
    {
      name: 'plantName',
      field: 'plantName',
      style: 'width:25%',
      label: '사업장',
      align: 'center',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      style: 'width:25%',
      label: '부서',
      align: 'center',
      sortable: false
    },
    {
      name: 'jobName',
      field: 'jobName',
      style: 'width:25%',
      label: '직책',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const deptGrid = ref<gridDeptType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      style: 'width:50%',
      label: '사업장',
      align: 'center',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const seniorGrid = ref<gridSeniorType>({
  columns: [
    {
      name: 'seniorName',
      field: 'seniorName',
      label: '선임명',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const userListUrl = ref('')
const userSaveUrl = ref('')
const userDeleteUrl = ref('')
const deptListUrl = ref('')
const deptSaveUrl = ref('')
const deptDeleteUrl = ref('')
const seniorListUrl = ref('')
const seniorSaveUrl = ref('')
const seniorDeleteUrl = ref('')
const userTable = ref<any>(null)
const deptTable = ref<any>(null)
const seniorTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => String(Number(window.innerHeight) - 200) + 'px')

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
  userListUrl.value = selectConfig.sop.edu.course.userlist.url
  userSaveUrl.value = transactionConfig.sop.edu.course.usersave.url
  userDeleteUrl.value = transactionConfig.sop.edu.course.userdelete.url
  deptListUrl.value = selectConfig.sop.edu.course.deptlist.url
  deptSaveUrl.value = transactionConfig.sop.edu.course.deptsave.url
  deptDeleteUrl.value = transactionConfig.sop.edu.course.deptdelete.url
  seniorListUrl.value = selectConfig.sop.edu.course.seniorlist.url
  seniorSaveUrl.value = transactionConfig.sop.edu.course.seniorsave.url
  seniorDeleteUrl.value = transactionConfig.sop.edu.course.seniordelete.url
  // code setting
  // list setting
  getUserList()
  getDeptList()
  getSeniorList()
}
/******************************
 * TODO (목적): 교육과정별 대상자 조회
 *******************************/
function getUserList() {
  $http({
    url: userListUrl.value,
    method: 'GET',
    params: { eduCourseId: props.popupParam.eduCourseId }
  }).then((_result: any) => {
    userGrid.value.data = _result.data
    userTable.value.selected = []
  })
}
/******************************
 * TODO (목적): 교육과정별 부서 조회
 *******************************/
function getDeptList() {
  $http({
    url: deptListUrl.value,
    method: 'GET',
    params: { eduCourseId: props.popupParam.eduCourseId }
  }).then((_result: any) => {
    deptGrid.value.data = _result.data
    deptTable.value.selected = []
  })
}
/******************************
 * TODO (목적): 교육과정별 선/해임 조회
 *******************************/
function getSeniorList() {
  $http({
    url: seniorListUrl.value,
    method: 'GET',
    params: { eduCourseId: props.popupParam.eduCourseId }
  }).then((_result: any) => {
    seniorGrid.value.data = _result.data
    seniorTable.value.selected = []
  })
}
/******************************
 * TODO (목적): 교육과정별 대상자 추가
 *******************************/
function addUser() {
  popupOptions.value.width = '70%'
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeUserPopup(data: Array<userType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData = [] as any
    _.forEach(data, (item) => {
      if (_.findIndex(userGrid.value.data, { userId: item.userId }) === -1) {
        saveData.push({
          eduCourseId: props.popupParam.eduCourseId,
          userId: item.userId
        })
      }
    })
    $http({
      url: userSaveUrl.value,
      method: 'POST',
      data: saveData
    }).then((_result: any) => {
      message.requestSuccess()
      getUserList()
    })
  }
}
/******************************
 * TODO (목적): 교육과정별 대상자 삭제
 *******************************/
function removeUser() {
  const selectData = userTable.value.getSelected()
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
          url: userDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getUserList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 교육과정별 부서 추가
 *******************************/
function addDept() {
  popupOptions.value = getPopupOptions('dept', popupOptions.value, closeDeptPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeDeptPopup(data: Array<deptType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData = [] as any
    _.forEach(data, (item) => {
      if (_.findIndex(deptGrid.value.data, { deptCd: item.deptCd }) === -1) {
        saveData.push({
          eduCourseId: props.popupParam.eduCourseId,
          deptCd: item.deptCd
        })
      }
    })
    $http({
      url: deptSaveUrl.value,
      method: 'POST',
      data: saveData
    }).then((_result: any) => {
      message.requestSuccess()
      getDeptList()
    })
  }
}
/******************************
 * TODO (목적): 교육과정별 부서 삭제
 *******************************/
function removeDept() {
  const selectData = deptTable.value.getSelected()
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
          url: deptDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getDeptList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 교육과정별 선해임 추가
 *******************************/
function addSenior() {
  popupOptions.value.width = '90%'
  popupOptions.value = getPopupOptions('senior', popupOptions.value, closeSeniorPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeSeniorPopup(data: Array<seniorInterface>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData = [] as any
    _.forEach(data, (item) => {
      if (_.findIndex(seniorGrid.value.data, { seniorId: item.seniorId }) === -1) {
        saveData.push({
          eduCourseId: props.popupParam.eduCourseId,
          seniorId: item.seniorId
        })
      }
    })

    $http({
      url: seniorSaveUrl.value,
      method: 'POST',
      data: saveData
    }).then((_result: any) => {
      message.requestSuccess()
      getSeniorList()
    })
  }
}
/******************************
 * TODO (목적): 교육과정별 선해임 삭제
 *******************************/
function removeSenior() {
  const selectData = seniorTable.value.getSelected()
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
          url: seniorDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getSeniorList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
