<template>
  <div>
    <q-form ref="editForm">
      <c-card class="cardClassDetailForm" title="상세">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn v-if="isOld" label="출력" icon="print" @btnClicked="printStatus" />
            <c-btn v-if="editable && isOld" label="삭제" icon="delete" @btnClicked="deleteStatus" />
            <c-btn
              v-show="editable"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="facilityStatusTable"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveStatus"
              @btnCallback="saveStatusCallback"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-plant
              :required="true"
              :disabled="isOld"
              :editable="editable"
              name="plantCd"
              v-model:value="facilityStatusTable.plantCd"
              @datachange="datachange"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-datepicker
              :editable="editable"
              label="허가일"
              name="permitDate"
              v-model:value="facilityStatusTable.permitDate"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-datepicker
              required
              :editable="editable"
              default="today"
              type="year"
              label="년도"
              name="year"
              v-model:value="facilityStatusTable.year"
              @datachange="datachange('year')"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <c-text
              :required="true"
              :editable="editable"
              label="현황표명"
              name="facilityStatusTableName"
              v-model:value="facilityStatusTable.facilityStatusTableName"
            />
          </div>
          <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              :readonly="true"
              label="작성정보"
              name="reg"
              v-model:value="reg">
            </c-text>
          </div> -->
        </template>
      </c-card>
      <c-card class="cardClassDetailForm" title="회사 정보">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              :readonly="true"
              label="회사명"
              name="companyName"
              v-model:value="facilityStatusTable.companyName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              :readonly="true"
              label="대표자"
              name="managerName"
              v-model:value="facilityStatusTable.managerName"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              :readonly="true"
              label="소재지"
              name="attrVal2"
              v-model:value="facilityStatusTable.attrVal2"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              :readonly="true"
              label="전화번호"
              name="phoneNo"
              v-model:value="facilityStatusTable.phoneNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              :readonly="true"
              label="시설구분"
              name="attrVal3"
              v-model:value="facilityStatusTable.attrVal3"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              :readonly="true"
              label="사업자번호"
              name="bizNo"
              v-model:value="facilityStatusTable.bizNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
            <c-text
              :editable="editable"
              :readonly="true"
              label="대표자 email"
              name="managerEmail"
              v-model:value="facilityStatusTable.managerEmail"
            />
          </div>
        </template>
      </c-card>
    </q-form>
    <div v-if="isOld" class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
        <c-table
          ref="table"
          title="유해화학물질관리자 목록"
          :columns="grid.columns"
          :data="facilityStatusTable.managers"
          :gridHeight="gridHeight"
          :editable="editable"
          :hideBottom="true"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
        <c-table
          ref="table"
          title="검사대상 유해화학물질 취급시설 개수"
          :columns="gridFacility.columns"
          :data="gridFacilityData"
          :gridHeight="gridHeight"
          :hideBottom="true"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
        />
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
import { facilityStatusTableType } from './facilityStatusTable'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'facilityStatusTableBaseInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['plantChange', 'getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    chmFacilityStatusTableId: stringNull
  }
  facilityStatusTable: facilityStatusTableType
  hcfFacilityTypeItems: Array<codeMasterType>
  contentHeight: string
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
  chmFacilityStatusTableId: () => {
    return {
      chmFacilityStatusTableId: ''
    }
  },
  facilityStatusTable: () => {
    return {
      chmFacilityStatusTableId: '', // 취급시설 현황표 일련번호
      facilityStatusTableName: '', // 현황표명
      plantCd: '', // 사업장코드
      year: '',
      permitDate: '', // 허가일
      companyName: '', // 회사명
      managerName: '', // 대표자
      managerEmail: '', // 대표자 E-MAIL
      phoneNo: '', // 전화번호
      bizNo: '', // 사업자번호
      remarks: '', // 비고
      attrVal1: '', // 회사id
      attrVal2: '', // 소재지
      attrVal3: '', // 시설구분
      regDtStr: '',
      regUserName: '',
      managers: [], // 유해화학물질관리자
      facilities: [], // 시설
      hazardChems: [], // 유해화학물질 취급현황
      equipDevices: [], // 설비 장치
      equipPowers: [] // 설비 동력기계
    }
  },
  hcfFacilityTypeItems: () => [],
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
const grid = ref({
  columns: [
    {
      name: 'seniorUserName',
      field: 'seniorUserName',
      label: '이름',
      align: 'left',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'relatedCertificate',
      field: 'relatedCertificate',
      label: '관련자격증',
      align: 'center',
      style: 'width:130px',
      sortable: true
    },
    {
      name: 'dismissalFlagName',
      field: 'dismissalFlagName',
      label: '선임구분',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'seniorDate',
      field: 'seniorDate',
      label: '선임일',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const gridFacility = ref({
  columns: [
    {
      name: 'gubun',
      field: 'gubun',
      label: '구분',
      align: 'center',
      style: 'width:60%',
      sortable: true
    },
    {
      name: 'count',
      field: 'count',
      label: '개수',
      align: 'right',
      style: 'width:40%',
      sortable: true
    }
  ]
})
const isSave = ref(false)
const printUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const mappingType = ref('PUT')
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.chmFacilityStatusTableId))
const gridFacilityData = computed(() => {
  const _data: Array<any> = []
  if (
    props.facilityStatusTable.facilities &&
    props.facilityStatusTable.facilities.length > 0 &&
    props.hcfFacilityTypeItems &&
    props.hcfFacilityTypeItems.length > 0
  ) {
    _.forEach(props.hcfFacilityTypeItems, (item) => {
      const typeData = _.filter(props.facilityStatusTable.facilities, {
        hcfFacilityTypeCd: item.code
      })
      if (item.code !== 'HFT0000040') {
        _data.push({
          gubun: item.codeName,
          count: typeData ? typeData.length : 0
        })
      } else {
        _data.push({
          gubun: `${item.codeName} (km)`,
          count: typeData.length + ' (' + _.sum(_.map(typeData, 'distance')) + ')'
        })
      }
    })
  }
  return _data
})
const gridHeight = computed(() => '450px')

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
  printUrl.value = selectConfig.chm.facilityStatusTable.print.url
  saveUrl.value = transactionConfig.chm.facilityStatusTable.insert.url
  deleteUrl.value = transactionConfig.chm.facilityStatusTable.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 사업장 변경에 따른 emit 처리
 *******************************/
function datachange(key?: stringNull) {
  emits('plantChange')
  const _year = props.facilityStatusTable.year
  if (
    props.facilityStatusTable.plantCd &&
    props.facilityStatusTable.year &&
    !props.popupParam.chmFacilityStatusTableId
  ) {
    $http({
      url: selectConfig.chm.facilityStatusTable.list.url,
      method: 'GET',
      params: {
        plantCd: props.facilityStatusTable.plantCd,
        year: props.facilityStatusTable.year
      }
    }).then((_result: any) => {
      if (_result.data?.length === 0 || !_result.data) {
        props.facilityStatusTable.year = _year
        if (key === 'year' && !props.facilityStatusTable.facilityStatusTableName) {
          props.facilityStatusTable.facilityStatusTableName =
            _year + $language('년 유해화학물질 취급시설 현황표')
        }
      } else if (_result.data?.length > 0) {
        message.alert({
          title: '안내',
          message: '입력한 사업장과 년도에 이미 데이터가 존재합니다. [년도] 를 다시 입력하세요.',
          type: 'warning' // success / info / warning / error
        })
        props.facilityStatusTable.year = null
      }
    })
  }
}
/******************************
 * TODO (목적): 시설현황표 저장 전 처리
 *******************************/
function saveStatus() {
  if (props.popupParam.chmFacilityStatusTableId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.chm.facilityStatusTable.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.chm.facilityStatusTable.insert.url
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.facilityStatusTable.regUserId = user.value.userId
          props.facilityStatusTable.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * TODO (목적): 시설현황표 저장 후 처리
 *******************************/
function saveStatusCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.chmFacilityStatusTableId = _result.data
  emits('getDetail')
}
/******************************
 * TODO (목적): 시설현황표 삭제
 *******************************/
function deleteStatus() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.chmFacilityStatusTableId),
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
 * TODO (목적): 시설현황표 출력
 *******************************/
function printStatus() {
  $http({
    url: $format(printUrl.value, props.popupParam.chmFacilityStatusTableId),
    method: 'GET',
    params: {
      plantCd: props.facilityStatusTable.plantCd,
      printUserName: user.value.userName
    }
  }).then((_result: any) => {
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(base64ToBlob(_result.data))
    link.download = props.facilityStatusTable.facilityStatusTableName + '.xlsx'
    link.click()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
