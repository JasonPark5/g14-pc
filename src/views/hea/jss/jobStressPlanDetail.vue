<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn v-show="editable && isOld" label="삭제" icon="delete" @btnClicked="deleteInfo" />
            <c-btn
              v-show="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="plan"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <c-text
              :required="true"
              :editable="editable"
              label="평가계획명"
              name="jobStressPlanName"
              v-model:value="plan.jobStressPlanName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              :required="true"
              :editable="editable"
              codeGroupCd="HEA_STRESS_TYPE_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="assessTypeCd"
              label="평가유형(기본/단축)"
              v-model:value="plan.assessTypeCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <c-datepicker
              :required="true"
              :editable="editable"
              type="year"
              label="년도"
              name="planYear"
              v-model:value="plan.planYear"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <c-datepicker
              :required="true"
              :editable="editable"
              range
              label="평가기간"
              name="period"
              v-model:value="plan.period"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
            <c-plant
              :required="true"
              :editable="editable"
              type="edit"
              name="plantCd"
              v-model:value="plan.plantCd"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <c-textarea
              :editable="editable"
              :rows="3"
              label="비고"
              name="remarks"
              v-model:value="plan.remarks"
            />
          </div>
        </template>
      </c-card>
    </q-form>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
        <c-table
          ref="table1"
          title="평가대상자 목록"
          :columns="grid.columns"
          :data="plan.users"
          :gridHeight="gridHeight"
          :filtering="false"
          :isExcelDown="false"
          :isFullScreen="false"
          :columnSetting="false"
          :usePaging="false"
          selection="multiple"
          rowKey="userId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addUser" />
              <c-btn v-if="editable" label="제외" icon="delete" @btnClicked="deleteUser" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
        <c-table
          ref="table2"
          title="중앙값"
          :columns="gridCenter.columns"
          :data="plan.centers"
          :gridHeight="gridHeight"
          :usePaging="false"
          :filtering="false"
          :isExcelDown="false"
          :isFullScreen="false"
          :columnSetting="false"
          rowKey="heaStressCheckClassCd"
        >
          <template v-slot:suffixTitle>
            <span style="font-size: 0.9em; font-weight: 400">
              <span class="text-teal q-mr-md">
                <q-chip color="teal" outline square>{{ $language('회사중앙값') }}</q-chip>
                : {{ $language('회사 근로자들의 직무스트레스 평가표 점수 평균값') }}
              </span>
              <span class="text-pink">
                <q-chip color="pink" outline square>{{ $language('한국 근로자 중앙값') }}</q-chip>
                : {{ $language('기준이 되는 한국 근로자 중앙값으로 기준정보에서 입력') }}
              </span>
            </span>
          </template>
        </c-table>
      </div>
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
import { evalPlanType } from './jobStress'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'jobStressPlanDetail'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    heaJobStressPlanId?: stringNull
    stepCd?: stringNull
    searchProcess?: any | null | undefined
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
  param: () => {
    return {
      heaJobStressPlanId: '',
      stepCd: null,
      searchProcess: {
        flag: '',
        isSearch: false
      }
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'userName',
      field: 'userName',
      label: '대상자',
      align: 'center',
      sortable: true,
      style: 'width: 20%'
    },
    {
      name: 'sexName',
      field: 'sexName',
      label: '성별',
      align: 'center',
      sortable: true,
      style: 'width: 20%'
    },
    {
      name: 'jobClassNm',
      field: 'jobClassNm',
      label: '직종',
      align: 'center',
      sortable: true,
      style: 'width: 20%'
    },
    {
      name: 'upDeptNm',
      field: 'upDeptNm',
      label: '본부',
      align: 'center',
      sortable: true,
      style: 'width: 20%'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: true,
      style: 'width: 20%'
    }
    // {
    //   name: 'result',
    //   field: 'result',
    //   label: '평가상태',
    //   style: 'width:100px',
    //   align: "center",
    //   sortable: true,
    // }
  ],
  data: []
})
const gridCenter = ref<gridType>({
  columns: [
    {
      name: 'heaStressCheckClassName',
      field: 'heaStressCheckClassName',
      label: '구분',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'company',
      field: 'company',
      label: '회사중앙값',
      child: [
        {
          name: 'companyMale',
          field: 'companyMale',
          label: '남성',
          align: 'right',
          sortable: true,
          style: 'width: 70px',
          type: 'cost'
        },
        {
          name: 'companyFemale',
          field: 'companyFemale',
          label: '여성',
          align: 'right',
          sortable: true,
          style: 'width: 70px',
          type: 'cost'
        },
        {
          name: 'company',
          field: 'company',
          label: '전체',
          align: 'right',
          sortable: true,
          style: 'width: 70px',
          type: 'cost'
        }
      ]
    },
    {
      name: 'korea',
      field: 'korea',
      label: '한국 근로자 중앙값',
      child: [
        {
          name: 'koreaMale',
          field: 'koreaMale',
          label: '남성',
          align: 'right',
          sortable: true,
          style: 'width: 70px'
        },
        {
          name: 'koreaFemale',
          field: 'koreaFemale',
          label: '여성',
          align: 'right',
          sortable: true,
          style: 'width: 70px'
        },
        {
          name: 'korea',
          field: 'korea',
          label: '전체',
          align: 'right',
          sortable: true,
          style: 'width: 70px'
        }
      ]
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const plan = ref<evalPlanType>({
  heaJobStressPlanId: '', // 직무스트레스 계획 일련번호
  plantCd: null, // 사업장
  planYear: '', // 년도
  stepCd: null, // 평가단계
  assessTypeCd: 'HST0000001', // 평가유형(기본/단축)
  jobStressPlanName: '', // 평가계획명
  assessmentStartDate: '', // 평가 시작일
  assessmentEndDate: '', // 평가 종료일
  period: [], // 평가기간
  remarks: '', // 비고
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  users: [], // 평가자
  deleteUsers: [], // [삭제]평가자
  centers: [] // 중앙값
})
const editable = ref(true)
const isSave = ref(false)
const mappingType = ref('PUT')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.param.heaJobStressPlanId))
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 270 + 'px' : '500px'
)

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
  detailUrl.value = selectConfig.hea.jobStress.plan.get.url
  saveUrl.value = transactionConfig.hea.jobStress.plan.update.url
  deleteUrl.value = transactionConfig.hea.jobStress.plan.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  if (props.param.heaJobStressPlanId) {
    $http({
      url: $format(detailUrl.value, props.param.heaJobStressPlanId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(plan.value, _result.data)
      plan.value.period = [plan.value.assessmentStartDate, plan.value.assessmentEndDate]
    })
  } else {
    plan.value.planYear = getThisYear()
    // 중앙값 구분자 들고 오기
    getComboItems('HEA_STRESS_CHECK_CLASS_CD').then((_result: any) => {
      if (_result && _result.length > 0) {
        _.forEach(_result, (item) => {
          $http({
            url: selectConfig.hea.jobStress.base.center.list.url,
            method: 'GET',
            params: {
              heaStressCheckClassCd: item.code,
              useFlag: 'Y'
            }
          }).then((result: any) => {
            plan.value.centers!.push({
              heaJobStressAssessmentCenterId: uid(), // 직무스트레스 결과 중앙값 일련번호
              heaJobStressPlanId: props.param.heaJobStressPlanId, // 직무스트레스 계획 일련번호
              heaStressCheckClassCd: item.code, // 직무스트레스 평가항목 구분
              heaStressCheckClassName: item.codeName, // 직무스트레스 평가항목 구분
              companyMale: null, // 회사 중앙값 남성
              companyFemale: null, // 회사 중앙값 여성
              company: null, // 회사 중앙값 전체
              koreaMale: result.data[0].koreaMale, // 한국 근로자 중앙값 남성
              koreaFemale: result.data[0].koreaFemale, // 한국 근로자 중앙값 여성
              korea: result.data[0].korea, // 한국 근로자 중앙값 전체
              regUserId: user.value.userId, // 등록자 id
              editFlag: 'C'
            })
          })
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 평가자 삭제
 *******************************/
function deleteUser() {
  const selectData = table1.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!plan.value.deleteUsers) plan.value.deleteUsers = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(plan.value.deleteUsers, { userId: item.userId }) === -1
      ) {
        plan.value.deleteUsers!.push(item)
      }
      plan.value.users = _.reject(plan.value.users, item)
    })
    table1.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 평가자 추가
 *******************************/
function addUser() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUser, {
    type: 'multiple'
  })
}
function closeUser(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(plan.value.users, { userId: item.userId }) === -1) {
        plan.value.users!.push({
          heaJobStressAssessmentUserId: uid(), // 직무스트레스 평가자 일련번호
          heaJobStressPlanId: props.param.heaJobStressPlanId, // 직무스트레스 계획 일련번호
          userId: item.userId, // 평가자id
          userName: item.userName, // 평가자
          deptCd: item.deptCd, // 평가자부서코드
          deptName: item.deptName, // 평가자부서
          sexCd: item.sexCd, // 성별
          sexName: item.sexName,
          upDeptCd: item.upDeptCd,
          upDeptNm: item.upDeptNm,
          jobClassCd: item.jobClassCd,
          jobClassNm: item.jobClassNm,
          physicalEnv: null, // (점수)물리적환경
          jobDemand: null, // (점수)직무요구
          jobAutonomy: null, // (점수)직무자율
          relationship: null, // (점수)관계갈등
          jobInsecurity: null, // (점수)직무불안정
          organizational: null, // (점수)조직체계
          inadequate: null, // (점수)보상부적절
          workplace: null, // (점수)직장문화
          manageTargetGroupFlag: 'N', // 관리대상군 여부
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = isOld.value ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result && plan.value.users!.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          plan.value.regUserId = user.value.userId
          plan.value.chgUserId = user.value.userId
          plan.value.assessmentStartDate = plan.value.period![0]
          plan.value.assessmentEndDate = plan.value.period![1]
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  props.param.searchProcess.isSearch = true
  props.param.heaJobStressPlanId = _result.data
  getDetail()
}
/******************************
 * TODO (목적): 계획 삭제
 *******************************/
function deleteInfo() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.heaJobStressPlanId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
