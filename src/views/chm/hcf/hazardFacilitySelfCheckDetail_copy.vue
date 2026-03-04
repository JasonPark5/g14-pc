<template>
  <q-form ref="editForm">
    <c-card title="상세" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-show="printable" label="출력" icon="print" @btnClicked="printSelfCheck" />
          <c-btn
            v-show="editable && deleteable && !isReadOnly"
            label="삭제"
            icon="remove"
            @btnClicked="removeSelfCheck"
          />
          <c-btn
            v-show="editable && !disabled && !isReadOnly && isOld"
            :isSubmit="isComplete"
            :url="completeUrl"
            :param="selfCheck"
            mappingType="PUT"
            label="완료"
            icon="check"
            color="grey-8"
            @beforeAction="complete"
            @btnCallback="completeCallback"
          />
          <c-btn
            v-show="editable && !disabled && !isReadOnly"
            :isSubmit="isSave"
            :param="selfCheck"
            :mappingType="saveType"
            :url="saveUrl"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :editable="editable"
            :disabled="disabled || isReadOnly"
            :required="true"
            :customPopupParam="{ targetKey: 'facility' }"
            label="시설"
            name="facilityCd"
            v-model:value="selfCheck.facilityCd"
            @getDetailTask="facilityInfo"
            @dataChange="(data1: any, data2: any, data3: any) => setTitle(data3, 1)"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :editable="false"
            label="취급자재"
            name="materialNames"
            v-model:value="selfCheck.materialNames"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            :disabled="disabled || isReadOnly"
            :editable="editable"
            default="today"
            type="date"
            label="자체점검일"
            name="selfCheckDate"
            v-model:value="selfCheck.selfCheckDate"
            @datachange="(_data: any) => setTitle(_data, 2)"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            :disabled="disabled || isReadOnly"
            :editable="editable"
            :range="true"
            :minuteStep="10"
            type="time"
            label="점검시간"
            name="time"
            v-model:value="selfCheck.time"
            @datachange="(_data: any) => setTitle(_data, 3)"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            :required="true"
            :disabled="disabled || isReadOnly"
            :editable="editable"
            label="주관부서"
            name="deptCd"
            v-model:value="selfCheck.deptCd"
            @setDeptName="
              (val: any) => {
                selfCheck.deptName = val
              }
            "
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            :required="true"
            :editable="editable"
            :disabled="disabled || isReadOnly"
            type="user"
            label="점검자"
            name="selfCheckUserId"
            v-model:value="selfCheck.selfCheckUserId"
            @username="
              (val: any) => {
                selfCheck.selfCheckUserName = val
              }
            "
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :disabled="true"
            :editable="editable"
            label="시설관리번호"
            name="facilityNo"
            v-model:value="selfCheck.facilityNo">
          </c-text>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :disabled="true"
            :editable="editable"
            label="시설유형"
            name="hcfFacilityTypeName"
            v-model:value="selfCheck.hcfFacilityTypeName">
          </c-text>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            :required="true"
            :disabled="disabled || isReadOnly"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="selfCheck.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :editable="editable"
            :disabled="disabled || isReadOnly"
            :required="true"
            label="점검명"
            name="selfCheckName"
            v-model:value="selfCheck.selfCheckName"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="table"
      class="q-mt-sm"
      title="점검결과 목록"
      :editable="editable && !disabled && !isReadOnly"
      :columns="grid.columns"
      :data="selfCheck.selfCheckItemResults"
      :gridHeight="grid.height"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      rowKey="hcfHazardFacilitySelfCheckItemId"
      selection="multiple"
    >
      <template v-slot:suffixTitle>
        <span style="font-size: 0.8em; font-weight: 500; color: tomato">
          <br />{{
            $language(
              '1. 비고란에는 자체점검 시 조치완료된 사항 또는 재점검이 필요한 사항을 적습니다.'
            )
          }}<br />
          {{
            $language(
              '2. 유해화학물질 취급시설 자체점검을 하려는 자는 양식의 점검 항목이 모두 포함된 별도의 서식을 사용할 수 있으며, 점검 항목이 모두 포함되어 있음을 명확하게 알 수 있도록 표기해야 합니다.'
            )
          }}
        </span>
      </template>
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !isReadOnly"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addResult"
          />
          <c-btn
            v-if="editable && !isReadOnly"
            :showLoading="false"
            label="제외"
            icon="remove"
            @btnClicked="removeResult"
          />
        </q-btn-group>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { selfcheck } from './hazardFacility'
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
  name: 'hazardFacilitySelfCheckDetail'
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
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    hcfHazardFacilitySelfCheckId: stringNull
    facilityCd: stringNull
    selfCheckDate: stringNull
    readOnly: Boolean
  }
  contentHeight: stringNull | numberNull
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
      hcfHazardFacilitySelfCheckId: '',
      facilityCd: '',
      selfCheckDate: '',
      readOnly: false
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
      name: 'selfCheckItemName',
      field: 'selfCheckItemName',
      label: '점검항목',
      align: 'left',
      type: 'text',
      // style: 'width:300px',
      required: true,
      sortable: false
    },
    {
      name: 'hcfAbnormalityCd',
      field: 'hcfAbnormalityCd',
      label: '이상유무',
      align: 'center',
      style: 'width:160px',
      type: 'select',
      codeGroupCd: 'HCF_ABNORMALITY_CD',
      required: true,
      isChip: true,
      setHeader: true,
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width:200px',
      type: 'text',
      sortable: false
    }
  ] as any,
  data: [],
  height: '600px'
})
const selfCheck = ref<selfcheck>({
  hcfHazardFacilitySelfCheckId: '', // 유해화학자재 취급시설 자체점검 번호
  hcfHazardFacilitySelfCheckItemId: uid(),
  plantCd: null, // 사업장코드
  selfCheckName: '', // 점검명
  facilityCd: '', // 시설 코드
  facilityNo: '', // 시설관리번호
  facilityName: '', // 시설명
  hcfFacilityTypeName: '', // 시설유형
  selfCheckDate: '', // 자체점검일
  startTime: '', // 점검시작시간
  endTime: '', // 점검종료시간
  time: [] as Array<string>, // 점검시간
  deptCd: '', // 주관부서 코드
  deptName: '', // 주관부서명
  selfCheckUserId: '', // 점검자id
  selfCheckUserName: '', // 점검자
  hcfSelfCheckCompleteFlag: 'N', // 점검완료여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  selfCheckItemResults: [], // 자체점검 항목 결과
  materialNames: '',
  deleteCheckResults: []
})
const isComplete = ref(false)
const isSave = ref(false)
const printUrl = ref('')
const saveType = ref('POST')
const saveUrl = ref('')
const deleteUrl = ref('')
const itemResultUrl = ref('')
const detailUrl = ref('')
const completeUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.hcfHazardFacilitySelfCheckId))
const disabled = computed(() => {
  return selfCheck.value.hcfSelfCheckCompleteFlag === 'Y'
})
const deleteable = computed(() => {
  return props.popupParam.hcfHazardFacilitySelfCheckId && !disabled.value
})
const printable = computed(() => {
  return props.popupParam.hcfHazardFacilitySelfCheckId
})
const isReadOnly = computed(() => Boolean(props.popupParam.readOnly))
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.contentHeight,
  () => {
    let height = props.contentHeight - 220
    if (height < 400) {
      height = 500
    }
    grid.value.height = height + 'px'
  }
)
// watch(
//   () => [selfCheck.value.facilityName, selfCheck.value.selfCheckDate, selfCheck.value.time],
//   ([facilityName, selfCheckDate, time]) => {
//     if (facilityName && selfCheckDate && time?.length === 2) {
//       const [start, end] = time
//       selfCheck.value.selfCheckName = `${facilityName} - ${selfCheckDate} ${start}~${end}`
//     } else if (facilityName && selfCheckDate) {
//       selfCheck.value.selfCheckName = `${facilityName} - ${selfCheckDate}`
//     }
//   },
//   { immediate: true }
// )
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
  printUrl.value = selectConfig.env.facilitySelfCheck.print.url
  detailUrl.value = selectConfig.env.facilitySelfCheck.get.url
  itemResultUrl.value = selectConfig.env.facilitySelfCheck.item.url
  saveUrl.value = transactionConfig.env.facilitySelfCheck.insert.url
  deleteUrl.value = transactionConfig.env.facilitySelfCheck.delete.url
  completeUrl.value = transactionConfig.env.facilitySelfCheck.complete.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.hcfHazardFacilitySelfCheckId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.hcfHazardFacilitySelfCheckId),
      method: 'GET'
    }).then((_result: any) => {
      _result.data.time = [_result.data.startTime, _result.data.endTime]
      _.extend(selfCheck.value, _result.data)
      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
    })
  } else {
    // 등록인 경우 점검결과 값을 불러온다
    $http({
      url: itemResultUrl.value,
      method: 'GET'
    }).then((_result: any) => {
      _.forEach(_result.data, (item) => {
        item.editFlag = 'C'
        item.regUserId = user.value.userId
      })
      selfCheck.value.selfCheckItemResults = _result.data
      if (props.popupParam.facilityCd) {
        selfCheck.value.facilityCd = props.popupParam.facilityCd
      }
      if (props.popupParam.selfCheckDate) {
        selfCheck.value.selfCheckDate = props.popupParam.selfCheckDate
      }
      selfCheck.value.selfCheckUserId = user.value.userId
      selfCheck.value.selfCheckUserName = user.value.userName
      selfCheck.value.time = ['08:00', '12:00']
    })
  }
}
/******************************
 * TODO (목적): 시설현황표 저장 전 처리
 *******************************/
function save() {
  saveType.value = props.popupParam.hcfHazardFacilitySelfCheckId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (
      _result &&
      (selfCheck.value.selfCheckItemResults!.length === 0 ||
        validTable(grid.value.columns, selfCheck.value.selfCheckItemResults))
    ) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          selfCheck.value.regUserId = user.value.userId
          selfCheck.value.chgUserId = user.value.userId
          selfCheck.value.startTime = selfCheck.value.time[0]
          selfCheck.value.endTime = selfCheck.value.time[1]
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
/******************************
 * TODO (목적): 저장 후 처리
 *******************************/
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.hcfHazardFacilitySelfCheckId = _result.data
  getDetail()
}
function complete() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, selfCheck.value.selfCheckItemResults)) {
      message.confirm({
        title: '확인',
        message: '완료하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          selfCheck.value.regUserId = user.value.userId
          selfCheck.value.chgUserId = user.value.userId
          selfCheck.value.startTime = selfCheck.value.time[0]
          selfCheck.value.endTime = selfCheck.value.time[1]
          selfCheck.value.hcfSelfCheckCompleteFlag = 'Y'
          isComplete.value = !isComplete.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      selfCheck.value.hcfSelfCheckCompleteFlag = 'N'
      message.validError()
    }
  })
}
function completeCallback(result: any) {
  props.popupParam.hcfHazardFacilitySelfCheckId = result.data
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적):  삭제
 *******************************/
function removeSelfCheck() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.hcfHazardFacilitySelfCheckId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 출력
 *******************************/
function printSelfCheck() {
  $http({
    url: $format(printUrl.value, props.popupParam.hcfHazardFacilitySelfCheckId),
    method: 'GET'
  }).then((_result: any) => {
    const fileOrgNm =
      $language('시설 자체점검') +
      '_' +
      selfCheck.value.selfCheckName +
      '_' +
      selfCheck.value.selfCheckDate +
      '.docx'
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
function facilityInfo(_data: any) {
  if (_data) {
    selfCheck.value.facilityCd = _data.facilityCd
    selfCheck.value.facilityNo = _data.facilityNo
    selfCheck.value.facilityName = _data.facilityName
    selfCheck.value.hcfFacilityTypeName = _data.hcfFacilityTypeName
    selfCheck.value.materialNames = _data.materialNames.replace('\n', '')
  } else {
    selfCheck.value.facilityCd = ''
    selfCheck.value.facilityNo = ''
    selfCheck.value.facilityName = ''
    selfCheck.value.hcfFacilityTypeName = ''
    selfCheck.value.materialNames = ''
  }
}

function setTitle(_data: any, num: numberNull) {
  if (!props.popupParam.hcfHazardFacilitySelfCheckId) {
    const titleArr = selfCheck.value.selfCheckName.split(' / ')
    if (num === 1)
      selfCheck.value.selfCheckName =
        _data.facilityName +
        (titleArr.length > 1 ? ' / ' + titleArr[1] : '') +
        (titleArr.length > 2 ? ' / ' + titleArr[2] : '')
    else if (num === 2 && titleArr.length > 0) {
      selfCheck.value.selfCheckName =
        titleArr[0] +
        ' / ' +
        selfCheck.value.selfCheckDate +
        (titleArr.length > 2 ? ' / ' + titleArr[2] : '')
    } else if (num === 3 && titleArr.length > 1) {
      selfCheck.value.selfCheckName =
        titleArr[0] +
        ' / ' +
        titleArr[1] +
        ' / ' +
        selfCheck.value.time![0] +
        ' ~ ' +
        selfCheck.value.time![1]
    }
  }
}
const addResult = () => {
  selfCheck.value.selfCheckItemResults?.unshift({
    hcfHazardFacilitySelfCheckId: props.popupParam.hcfHazardFacilitySelfCheckId,
    hcfHazardFacilitySelfCheckItemId: uid().slice(-10),
    selfCheckItemName: '',
    hcfAbnormalityCd: 'HA00000001',
    remark: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
const removeResult = () => {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!selfCheck.value.deleteCheckResults) selfCheck.value.deleteCheckResults = []
      if (
        _.findIndex(selfCheck.value.deleteCheckResults, {
          hcfHazardFacilitySelfCheckId: item.hcfHazardFacilitySelfCheckId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        selfCheck.value.deleteCheckResults.push(item)
      }
      selfCheck.value.selfCheckItemResults = _.reject(selfCheck.value.selfCheckItemResults, item)
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
