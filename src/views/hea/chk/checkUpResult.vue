<template>
  <div>
    <q-form ref="editForm">
      <c-card title="건강검진 기본정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-show="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="checkUp"
              :mappingType="saveType"
              label="저장"
              icon="save"
              @beforeAction="savePlan"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-show="editable && isOld"
              label="삭제"
              icon="delete_forever"
              @btnClicked="remove"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              required
              :editable="editable && !isOld"
              :comboItems="comboItems"
              type="edit"
              itemText="codeName"
              itemValue="code"
              name="hospitalId"
              label="병원"
              v-model:value="checkUp.hospitalId"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              required
              :editable="editable && !isOld"
              codeGroupCd="CHECK_UP_TYPE_CD"
              type="edit"
              itemText="codeName"
              itemValue="code"
              label="건강검진 종류"
              name="checkupTypeCd"
              v-model:value="checkUp.checkupTypeCd"
              @setName="(val: any) => (checkupTypeName = val)"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-datepicker
              required
              :editable="editable && !isOld"
              :range="true"
              label="건강검진 기간"
              name="checkupDateArray"
              v-model:value="checkUp.checkupDateArray"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text
              required
              label="계획명"
              name="checkupName"
              v-model:value="checkUp.checkupName"
            />
          </div>
          <div v-if="isOld" class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-multi-select
              :editable="editable"
              :isArray="true"
              codeGroupCd="HEA_HEALTH_TYPE_CD"
              type="search"
              itemText="codeName"
              itemValue="code"
              name="healthTypes"
              label="건강구분"
              maxValues="7"
              v-model:value="searchParam.healthTypes"
            />
          </div>
          <div v-if="isOld" class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
            <c-btn label="검색" icon="search" class="q-mt-lg" @btnClicked="getList" />
          </div>
        </template>
      </c-card>
    </q-form>
    <c-table
      v-if="isOld"
      ref="table"
      title="검진결과 목록"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :gridHeight="gridHeight"
      :columnSetting="false"
      :usePaging="false"
      :isExcelDown="false"
      :isFullScreen="false"
      noDataLabel="검진결과를 추가하세요."
      :customTrClass="
        (_props: any) =>
          _props.row.healthType.includes('D') || _props.row.healthType.includes('C')
            ? 'bg-orange-1'
            : ''
      "
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <q-icon name="info" color="primary" size="sm" class="q-mr-sm">
            <q-menu style="padding: 10px; overflow-y: auto; max-height: 90vh">
              <c-table
                dense
                hideBottom
                :usePaging="false"
                :isExcelDown="false"
                :columnSetting="false"
                :isFullScreen="false"
                gridHeightAuto
                title="건강관리 구분"
                :columns="typeColumns"
                :data="typeRows"
              />
            </q-menu>
          </q-icon>
          <c-btn label="검진결과 업로드" icon="upload" @btnClicked="openExcelUploader" />
          <c-btn
            v-if="editable && grid.data && grid.data.length > 0"
            label="전체 삭제"
            icon="remove"
            @btnClicked="removeAll"
          />
        </q-btn-group>
      </template>
      <template v-slot:table-chip>
        <span style="color: tomato" class="q-mx-md">
          ※ 추가로 엑셀업로드 시 기존데이터에 결과가 추가됩니다. (중복 허용) 다시 업로드 하려면 전체
          삭제 후 진행하세요.
        </span>
        <b class="text-electric"> 총 대상자 수 : {{ checkUp.resultCnt }} </b>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" :isConfirm="true" />
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
import { checkupType, resultType, hospitalType } from './checkupType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'checkUpResult'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['update', 'changeStatus', 'getList', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    heaCheckupPlanId: stringNull
    hospitalId?: stringNull
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
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      heaCheckupPlanId: '',
      hospitalId: ''
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
const checkUp = ref<checkupType>({
  heaCheckupPlanId: '',
  plantCd: '',
  checkupName: '',
  checkupTypeCd: null,
  uploadFlag: 'N',
  checkupStartDate: '',
  checkupEndDate: '',
  checkupDateArray: [],
  regUserId: '',
  chgUserId: '',
  hospitalId: null,
  hospitalName: '',
  hospitalLocation: '',
  typeFlag: 'Y',
  resultCnt: 0
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'empNo' },
    { index: 1, colName: 'empNo' },
    { index: 2, colName: 'empNo' },
    { index: 3, colName: 'empNo' },
    { index: 4, colName: 'empNo' },
    { index: 5, colName: 'empNo' },
    { index: 6, colName: 'empNo' },
    { index: 7, colName: 'empNo' },
    { index: 8, colName: 'empNo' }
  ],
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width: 60px',
      sortable: false,
      fix: true
    },
    {
      name: 'empNo',
      field: 'empNo',
      label: '사번',
      align: 'center',
      style: 'width: 60px',
      sortable: false,
      fix: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '대상자',
      align: 'center',
      style: 'width: 60px',
      sortable: false,
      type: 'link',
      fix: true
    },
    {
      name: 'jobClassName',
      field: 'jobClassName',
      label: '직종',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'gender',
      field: 'gender',
      label: '성별',
      align: 'center',
      style: 'width: 40px',
      sortable: false
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      label: '생년월일',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'enterDate',
      field: 'enterDate',
      label: '입사일',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'moveDate',
      field: 'moveDate',
      label: '전입일',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'checkupDate',
      field: 'checkupDate',
      label: '검진일',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'hazardName',
      field: 'hazardName',
      label: '취급물질',
      align: 'center',
      style: 'width:240px',
      sortable: false
    },
    {
      name: 'healthType',
      field: 'healthType',
      label: '판정',
      align: 'center',
      style: 'width:50px',
      sortable: false
    },
    {
      name: 'checkupOpinion',
      field: 'checkupOpinion',
      label: '소견',
      align: 'left',
      style: 'width:160px',
      sortable: false
    },
    // {
    //   name: 'afterManage',
    //   field: 'afterManage',
    //   label: '조치',
    //   align: 'left',
    //   style: 'width:400px',
    //   sortable: false
    // },
    {
      name: 'suitableFlag',
      field: 'suitableFlag',
      label: '업무적합성',
      align: 'center',
      style: 'width:50px',
      sortable: false
    },
    {
      name: 'afterCare',
      field: 'afterCare',
      label: '사후관리',
      align: 'left',
      style: 'width:200px',
      sortable: false
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  isUpload: false,
  saveUploadUrl: '',
  closeCallback: () => {}
})
const searchParam = ref({
  heaCheckupPlanId: '',
  healthTypes: [],
  suitableFlags: []
})
const editable = ref(true)
const getUrl = ref('')
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const saveUploadUrl = ref('')
const deleteReleaseUrl = ref('')
const isSave = ref(false)
const table = ref<any>(null)
const comboItems = ref<hospitalType[]>([])
const saveType = ref('POST')
const editForm = ref<any>(null)
const checkupTypeName = ref<stringNull>('')
const typeColumns = ref([
  {
    name: 'code',
    field: 'code',
    label: '구분',
    align: 'center',
    style: 'width: 60px'
  },
  {
    name: 'codeName',
    field: 'codeName',
    label: '설명',
    align: 'left',
    style: 'width: 560px'
  }
])
const typeRows = ref([
  {
    code: 'A',
    codeName: '건강관리상 사후관리가 필요 없는 자 (건강자)'
  },
  {
    code: 'C1',
    codeName: '직업성 질병으로 진전될 우려가 있어 추적조사 등 관찰이 필요한 자 (직업병 요관찰자)'
  },
  {
    code: 'C2',
    codeName: '일반 질병으로 진전될 우려가 있어 추적조사 등 관찰이 필요한 자 (일반 질병 요관찰자)'
  },
  {
    code: 'CN',
    codeName: '질병으로 진전될 우려가 있어 야간작업시 추적관찰이 필요한 근로자 (요관찰자)'
  },
  {
    code: 'D1',
    codeName: '직업성 질병의 소견을 보여 사후관리가 필요한 자 (직업병 유소견자)'
  },
  {
    code: 'D2',
    codeName: '일반 질병의 소견을 보여 사후관리가 필요한 자 (일반 질병 유소견자)'
  },
  {
    code: 'DN',
    codeName: '질병의 소견을 보여 야간작업시 사후관리가 필요한 근로자 (유소견자)'
  },
  {
    code: 'R',
    codeName:
      '건강진단 1차 검사결가 건강수준의 평가가 곤란하거나 질병이 의심되는 근로자 (2차건강진단 대상자)'
  }
])
/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.heaCheckupPlanId))
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(Number(props.contentHeight.replace('px', '')))
      ? Number(props.contentHeight.replace('px', '')) - 120
      : 200
  if (height < 200) height = 200
  return height + 'px'
})
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [checkUp.value.hospitalId, checkUp.value.checkupTypeCd, checkUp.value.checkupDateArray],
  () => {
    if (
      !props.popupParam.heaCheckupPlanId &&
      checkUp.value.hospitalId &&
      checkUp.value.checkupTypeCd &&
      checkUp.value.checkupDateArray &&
      checkUp.value.checkupDateArray.length === 2
    )
      checkUp.value.checkupName = `${comboItems.value.find((item: any) => item.code === checkUp.value.hospitalId)?.codeName} / ${checkupTypeName.value} / ${checkUp.value.checkupDateArray![0]}`
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
  getUrl.value = selectConfig.hea.checkup.plan.get.url
  listUrl.value = selectConfig.hea.checkup.opinion.list.url
  saveUrl.value = transactionConfig.hea.checkup.plan.insert.url
  deleteUrl.value = transactionConfig.hea.checkup.results.delete.url
  saveUploadUrl.value = transactionConfig.hea.examine.resultUpload.url
  deleteReleaseUrl.value = transactionConfig.hea.checkup.suspect.user.delete.url
  // code setting
  // list setting
  $http({
    url: selectConfig.hea.hospital.list.url,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    _.forEach(_result.data, (_item) => {
      comboItems.value.push({
        code: _item.hospitalId,
        codeName: _item.hospitalName,
        typeFlag: _item.typeFlag
      })
    })
  })
  getDetail()
  getList()
  deleteTemps()
}

/******************************
 * TODO (목적): 검진결과 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.heaCheckupPlanId) {
    $http({
      url: $format(getUrl.value, props.popupParam.heaCheckupPlanId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(checkUp.value, _result.data)
      if (checkUp.value.checkupStartDate && checkUp.value.checkupEndDate) {
        checkUp.value.checkupDateArray = [
          checkUp.value.checkupStartDate,
          checkUp.value.checkupEndDate
        ]
      }
    })
  }
}

/******************************
 * TODO (목적): 해당 플랜에서의 검진업로드 결과 조회
 *******************************/
function getList() {
  if (props.popupParam.heaCheckupPlanId) {
    searchParam.value.heaCheckupPlanId = props.popupParam.heaCheckupPlanId
    $http({
      url: listUrl.value,
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      grid.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 업로드용 Temp Data 일괄 삭제
 *******************************/
function deleteTemps() {
  $http({
    url: transactionConfig.hea.examine.tempUploadDelete.url,
    method: 'DELETE'
  }).then(() => {})
}
/******************************
 * TODO (목적): 검진등록결과 중 선택한 검진자에 대한 상세검진결과 팝업표시
 *******************************/
function linkClick(row: resultType) {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./checkUpResultDetail.vue`))
  )
  popupOptions.value.title = $language('건강진단 결과 상세') + ' : ' + row.userName
  popupOptions.value.isFull = true
  popupOptions.value.param = { heaCheckupResultId: row ? row.heaCheckupResultId : '' }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup2
}
function closePopup2() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 건강검진 결과 업로드 팝업표시 + 팝업에서 업로드한 데이터를 본 테이블에 저장 후 임시테이블에서 삭제
 *******************************/
function openExcelUploader() {
  popupOptions.value.title = '건강진단 결과 업로드'
  popupOptions.value.param = {
    checkUp: checkUp.value,
    heaCheckupPlanId: props.popupParam.heaCheckupPlanId,
    hospitalId: checkUp.value.hospitalId,
    hospitalName: checkUp.value.hospitalName,
    plantCd: checkUp.value.plantCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./checkUpResultExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup(_result: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const saveData = {
      heaCheckupPlanId: checkUp.value.heaCheckupPlanId,
      heaCheckupResultId: uid(),
      regUserId: user.value.userId,
      chgUserId: user.value.userId
    }
    $http({
      url: saveUploadUrl.value,
      method: 'POST',
      data: saveData
    }).then(
      () => {
        message.requestSuccess()
        getList()
        deleteTemps()
      },
      () => message.validError()
    )
  } else deleteTemps()
}
/******************************
 * TODO (목적): 해당 플랜 내에 업로드한 검진결과 데이터 일괄삭제
 *******************************/
function removeAll() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까? ',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, checkUp.value.heaCheckupPlanId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('update', uid())
        getList()
      })
    },
    cancelCallback: () => {}
  })
}

/******************************
 * TODO (목적): 검진결과의 플랜 저장
 *******************************/
function savePlan() {
  saveType.value = isOld.value ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          checkUp.value.regUserId = user.value.userId
          checkUp.value.chgUserId = user.value.userId
          if (checkUp.value.checkupDateArray && checkUp.value.checkupDateArray.length === 2) {
            ;[checkUp.value.checkupStartDate, checkUp.value.checkupEndDate] =
              checkUp.value.checkupDateArray
          }
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  if (!props.popupParam.heaCheckupPlanId) props.popupParam.heaCheckupPlanId = result.data
  getDetail()
}

/******************************
 * TODO (목적): 검진결과의 플랜 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까? 계획과 결과의 모든 정보가 삭제됩니다.',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, checkUp.value.heaCheckupPlanId),
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
