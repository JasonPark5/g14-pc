<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="결재요청 정보" class="cardClassDetailForm" topClass="topcolor-orange">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                label="결재요청"
                icon="check"
                color="yellow-custom"
                @btnClicked="saveApprRequest"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <div class="col-12">
                <c-text
                  :editable="false"
                  label="결재 업무명"
                  name="approvalTypeName"
                  v-model:value="apprtype.approvalTypeName"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  :required="true"
                  label="결재 요청명"
                  name="approvalRequestName"
                  v-model:value="reqdata.approvalRequestName"
                />
              </div>
            </div>
            <div
              class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
              style="margin-top: -15px !important"
            >
              <c-table
                ref="apprline2"
                title="회람"
                tableId="apprline2"
                topBorderClass="topcolor-orange"
                :columnSetting="false"
                :isFullScreen="false"
                :hideBottom="true"
                :usePaging="false"
                :filtering="false"
                :isExcelDown="false"
                gridHeight="220px"
                :columns="gridline2.columns"
                :data="gridline2.data"
              />
            </div>
            <div
              class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"
              style="margin-top: -15px !important"
            >
              <c-table
                ref="apprline"
                title="결재선"
                tableId="apprline"
                topBorderClass="topcolor-orange"
                :columnSetting="false"
                :isFullScreen="false"
                :hideBottom="true"
                :usePaging="false"
                :filtering="false"
                :isExcelDown="false"
                gridHeight="220px"
                :columns="gridline.columns"
                :data="gridline.data"
              >
                <template v-slot:table-button>
                  <q-btn-group outline>
                    <c-btn
                      label="결재선 변경"
                      icon="change_circle"
                      color="orange"
                      @btnClicked="changeApprLine"
                    />
                  </q-btn-group>
                </template>
                <template v-slot:customArea="{ props, col }">
                  <template v-if="col.name === 'approvalKindName'">
                    <span
                      class="text-weight-bold"
                      :class="getLineKindColor(props.row.approvalKindCd)"
                      >{{ props.row.approvalKindName }}</span
                    >
                  </template>
                  <template v-if="col.name === 'approvalStatusName'">
                    <span :class="getLineKindColor2(props.row.approvalStatusName)">{{
                      props.row.approvalStatusName
                    }}</span>
                  </template>
                </template>
              </c-table>
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card
          title="결재 상세내용"
          class="cardClassDetailForm displayBlockCard"
          style="margin-bottom: 22px !important"
          topClass="topcolor-orange"
        >
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <component :is="component" :popupParam="props.popupParam.approvalParamValue" />
            </div>
          </template>
        </c-card>
      </div>
    </div>
    <q-dialog v-model="dialogShow" persistent>
      <q-card style="min-width: 350px">
        <q-form ref="editForm">
          <c-card title="서명란" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-show="editable" label="결재" icon="save" @btnClicked="saveDialog" />
                <c-btn
                  label="지우기"
                  color="orange"
                  :showLoading="false"
                  @btnClicked="eraseSignature"
                />
                <c-btn label="취소" icon="cancel" @btnClicked="closeDialog" />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="row">
                <div class="col-xs-12 col-sm-12">
                  <VueSignaturePad width="300px" height="300px" ref="signaturePad" />
                </div>
              </div>
            </template>
          </c-card>
        </q-form>
      </q-card>
    </q-dialog>
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
import { apprPopupParamType, apprType, reqData } from './appr'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'apprRequest'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: apprPopupParamType
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
      sysApprovalRequestId: '', // 결재 요청 일련번호
      approvalTypeCd: '', // 결재 유형 코드
      approvalRequestName: '', // 결재 요청명
      approvalParamValue: '', // 결재 파라미터
      approvalConnId: '' // 결재업무 연결용 업무일련번호
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
  target: null,
  title: '',
  visible: false,
  width: '50%',
  isFull: false,
  param: {},
  closeCallback: () => {}
})
const signaturePad = ref<any>(null)
const maxLineGrp = ref(1)
const dialogShow = ref(false)
const component = ref<any>(null)
const detailTypeUrl = ref('')
const apprLineUrl = ref('')
const infoUrl = ref('')
const listUrl = ref('')
const saveApprRequestUrl = ref('')
const apprtype = ref<apprType>({
  approvalTypeCd: '', // 결재유형코드
  approvalTypeName: '', // 결재업무명
  approvalUrl: '', // 결재화면 page경로
  approvalParam: '', // 결재파라메터
  approvalContent: '' // 결재메일내용
})
const reqdata = ref<reqData>({
  approvalTypeCd: '', // 결재유형코드
  approvalRequestName: '', // 결재 요청명
  approvalStatusCd: '', // 결재상태
  approvalParam: '' // 결재파라메터
})
const columnsline = ref([
  {
    name: 'approvalKindName',
    field: 'approvalKindName',
    label: '결재구분',
    align: 'center',
    style: 'width: 80px',
    type: 'custom',
    sortable: false
  },
  {
    name: 'deptName',
    field: 'deptName',
    label: '부서',
    align: 'center',
    style: 'width: 120px',
    sortable: false
  },
  {
    name: 'approvalUserName',
    field: 'approvalUserName',
    label: '이름',
    align: 'center',
    type: 'html',
    style: 'width: 120px',
    sortable: false
  },
  {
    name: 'approvalStatusName',
    field: 'approvalStatusName',
    label: '결재상태',
    align: 'center',
    style: 'width: 80px',
    type: 'custom',
    sortable: false
  },
  {
    name: 'returnReason',
    field: 'returnReason',
    label: '반려사유',
    align: 'left',
    type: 'textarea',
    sortable: false,
    disableTarget: 'approvalStatusCd',
    disableCon: 'ASC0000001'
  },
  {
    name: 'approvalDt',
    field: 'approvalDt',
    label: '결재일시',
    align: 'center',
    style: 'width: 160px',
    sortable: false
  }
])
const gridline = ref({
  columns: [
    {
      name: 'approvalKindName',
      field: 'approvalKindName',
      label: '결재구분',
      align: 'center',
      style: 'width: 20%',
      type: 'custom',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width: 40%',
      sortable: false
    },
    {
      name: 'approvalUserName',
      field: 'approvalUserName',
      label: '이름',
      align: 'center',
      style: 'width: 40%',
      sortable: false
    }
  ] as any,
  data: [] as any
})
const gridline2 = ref({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width: 40%',
      sortable: false
    },
    {
      name: 'approvalUserName',
      field: 'approvalUserName',
      label: '이름',
      align: 'center',
      style: 'width: 40%',
      sortable: false
    }
  ] as any,
  data: [] as any
})

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
 * TODO (목적): 초기화 함수
 *******************************/
function init() {
  infoUrl.value = selectConfig.sys.appr.info.get.url
  listUrl.value = selectConfig.sys.appr.line.list.url
  detailTypeUrl.value = selectConfig.sys.appr.type.get.url
  apprLineUrl.value = selectConfig.sys.appr.line.last.url
  saveApprRequestUrl.value = transactionConfig.sys.appr.request.insert.url
  reqdata.value.approvalRequestName = props.popupParam.approvalRequestName
  if (props.popupParam.sysApprovalRequestId) {
    // 재상신의 경우
    gridline.value.columns = columnsline.value
    getApprInfo()
    getApprLines()
  } else {
    // 첫 결재요청
    getApprType()
    getApprLine()
    getApprLine2()
  }
}

/******************************
 * TODO (목적): 결재선 불러오기
 *******************************/
function getApprLines() {
  // AKC0000001 : 상신, AKC0000002 : 합의, AKC0000003 : 결재, AKC0000004 : 확인, AKC0000009 : 회람, AKC0000010 : 재상신
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      sysApprovalRequestId: props.popupParam.sysApprovalRequestId
    }
  }).then((_result: any) => {
    if (_result) {
      if (_result.data.length > 0) {
        const lineData0 = _result.data.filter((x: any) => {
          return x.approvalKindCd != 'AKC0000009'
        })
        const lineData1 = _result.data.filter((x: any) => {
          return (
            (x.approvalKindCd == 'AKC0000001' ||
              x.approvalKindCd == 'AKC0000002' ||
              x.approvalKindCd == 'AKC0000003' ||
              x.approvalKindCd == 'AKC0000004' ||
              x.approvalKindCd == 'AKC0000010') &&
            x.approvalStatusCd != ''
          )
        })
        const lineData2 = _result.data.filter((x: any) => {
          return x.approvalKindCd == 'AKC0000009'
        })
        const maxgrps = ref([]) as any
        _.forEach(lineData0, (item) => {
          maxgrps.value.push(item.approvalLineGrp)
        })
        const _max = ref(0)
        if (maxgrps.value.length > 0) {
          _max.value = Math.max.apply(null, maxgrps.value)
        }
        maxLineGrp.value = _max.value + 1

        gridline.value.data = lineData1
        const cnt = ref(0)
        cnt.value = parseInt(gridline.value.data[gridline.value.data.length - 1].approvalLineNo)
        _.forEach(lineData0, (item) => {
          if (item.approvalLineGrp == _max.value) {
            cnt.value = cnt.value + 1
            gridline.value.data.push({
              approvalKindCd:
                item.approvalKindCd == 'AKC0000001' ? 'AKC0000010' : item.approvalKindCd, // 상신
              approvalKindName:
                item.approvalKindName == $language('상신')
                  ? $language('재상신')
                  : item.approvalKindName, // 상신 ? 재상신
              approvalUserId: item.approvalUserId,
              approvalUserName: item.approvalUserName,
              deptName: item.deptName,
              approvalLineNo: cnt.value,
              approvalStatusCd: '',
              approvalStatusName: '',
              approvalLineGrp: maxLineGrp.value,
              approvalDt: '',
              draggable: item.approvalKindCd == 'AKC0000001' ? false : true
            })
          }
        })
        gridline2.value.data = lineData2
      }
    }
  })
}

/******************************
 * TODO (목적): 결재정보
 *******************************/
function getApprInfo() {
  $http({
    url: infoUrl.value,
    method: 'GET',
    params: {
      sysApprovalRequestId: props.popupParam.sysApprovalRequestId
    }
  }).then((_result: any) => {
    apprtype.value.approvalTypeName = _result.data.approvalTypeName
    reqdata.value.approvalRequestName = _result.data.approvalRequestName

    // component.value = shallowRef(
    //   defineAsyncComponent(() => import(`@views${_result.data.approvalUrl}`))
    // )
    component.value = getApprComponent(_result.data.approvalUrl)
    props.popupParam.approvalParamValue = JSON.parse(_result.data.approvalParam)
    _.extend(props.popupParam.approvalParamValue, { approvalDocType: 'TODO' })
  })
}

function getApprType() {
  $http({
    url: $format(detailTypeUrl.value, props.popupParam.approvalTypeCd),
    method: 'GET',
    params: {
      sysApprovalRequestId: props.popupParam.sysApprovalRequestId
    }
  }).then((_result: any) => {
    apprtype.value = _result.data
    // component.value = shallowRef(
    //   defineAsyncComponent(() => import(`@views${apprtype.value.approvalUrl}`))
    // )
    component.value = getApprComponent(_result.data.approvalUrl)
  })
}
/******************************
 * TODO (목적): 결재 상세 컴포넌트 반환
 * @param (1): 결재 상세 위치
 * @return (반환): 결재 상세 컴포넌트
 *******************************/
function getApprComponent(url?: string) {
  let apprComponet = undefined
  if (url) {
    const directoryPaths = _.split(url, '/')
    /** 제일 처음 빈 공간 제거 */
    directoryPaths.shift()
    if (directoryPaths && directoryPaths.length > 0) {
      switch (directoryPaths.length) {
        case 1:
          apprComponet = markRaw(
            defineAsyncComponent(() => import(`@views/${directoryPaths[0]}.vue`))
          )

          break
        case 2:
          apprComponet = markRaw(
            defineAsyncComponent(
              () => import(`@views/${directoryPaths[0]}/${directoryPaths[1]}.vue`)
            )
          )

          break
        case 3:
          apprComponet = markRaw(
            defineAsyncComponent(
              () =>
                import(`@views/${directoryPaths[0]}/${directoryPaths[1]}/${directoryPaths[2]}.vue`)
            )
          )

          break
        case 4:
          apprComponet = markRaw(
            defineAsyncComponent(
              () =>
                import(
                  `@views/${directoryPaths[0]}/${directoryPaths[1]}/${directoryPaths[2]}/${directoryPaths[3]}.vue`
                )
            )
          )

          break
        case 5:
          apprComponet = markRaw(
            defineAsyncComponent(
              () =>
                import(
                  `@views/${directoryPaths[0]}/${directoryPaths[1]}/${directoryPaths[2]}/${directoryPaths[3]}/${directoryPaths[4]}.vue`
                )
            )
          )

          break
        default:
          break
      }
    }
  }
  return apprComponet
}

/******************************
 * TODO (목적): 요청자가 상신자인 최근 결재선호출
 *******************************/
function getApprLine() {
  // AKC0000001 : 상신, AKC0000002 : 합의, AKC0000003 : 결재, AKC0000004 : 확인, AKC0000009 : 회람
  $http({
    url: apprLineUrl.value,
    method: 'GET',
    params: {
      approvalTypeCd: props.popupParam.approvalTypeCd,
      approvalUserId: user.value.userId,
      approvalKindCd: 'AKC0000001',
      passFlag: 'N', // 회람자제외
      passFlagKindCd: 'AKC0000009' // 회람자제외
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      gridline.value.data = _result.data
      const ordercnt = ref(1)
      _.forEach(gridline.value.data, (_item) => {
        _item.approvalLineNo = ordercnt.value
        _item.approvalLineGrp = 1
        ordercnt.value = ordercnt.value + 1
      })
    } else {
      // 최근이력이 없을 경우 상신자만 추가
      gridline.value.data.push({
        approvalKindCd: 'AKC0000001', // 상신
        approvalKindName: '상신',
        approvalUserId: user.value.userId,
        approvalUserName: user.value.userName,
        deptName: user.value.deptName,
        approvalLineGrp: 1,
        approvalLineNo: '1',
        approvalStatusCd: 'ASC0000000' // 결재요청으로 저장
      })
    }
  })
}

/******************************
 * TODO (목적): 요청자가 상신자인 최근 회람자호출
 *******************************/
function getApprLine2() {
  // AKC0000001 : 상신, AKC0000002 : 합의, AKC0000003 : 결재, AKC0000004 : 확인, AKC0000009 : 회람
  $http({
    url: apprLineUrl.value,
    method: 'GET',
    params: {
      approvalTypeCd: props.popupParam.approvalTypeCd,
      approvalUserId: user.value.userId,
      approvalKindCd: 'AKC0000001',
      passFlag: 'Y', // 회람자제외
      passFlagKindCd: 'AKC0000009' // 회람자제외
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      gridline.value.data = _result.data
      const ordercnt = ref(1)
      _.forEach(gridline.value.data, (_item) => {
        _item.approvalLineNo = ordercnt
        _item.approvalLineGrp = 1
        ordercnt.value = ordercnt.value + 1
      })
    } else {
      gridline2.value.data = _result.data
    }
  })
}

/******************************
 * TODO (목적): 결재선 변경 팝업
 *******************************/
function changeApprLine() {
  popupOptions.value.title = '결재선 변경' // 결재선 변경
  if (props.popupParam.sysApprovalRequestId) {
    // 재상신의 경우
    const line = gridline.value.data.filter((x: any) => {
      return x.approvalDt == ''
    })
    popupOptions.value.param = {
      apprlinedata: line,
      apprlinedata2: gridline2.value.data,
      approvalLineGrp: maxLineGrp.value
    }
  } else {
    popupOptions.value.param = {
      apprlinedata: gridline.value.data,
      apprlinedata2: gridline2.value.data,
      approvalLineGrp: maxLineGrp.value
    }
  }

  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@popups/appr/apprLinePop.vue`))
  )
  popupOptions.value.width = '60%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeApprLinePopup
}
/******************************
 * TODO (목적): 결재선 변경 팝업 닫기 이벤트
 *******************************/
function closeApprLinePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data.apprlinedata || data.apprlinedata2) {
    if (props.popupParam.sysApprovalRequestId) {
      // 재상신의 경우
      const oridata = gridline.value.data.filter((x: any) => {
        return x.approvalDt != ''
      })
      gridline.value.data = oridata.concat(data.apprlinedata)
    } else {
      gridline.value.data = data.apprlinedata
    }
    gridline2.value.data = data.apprlinedata2
  }
}
/******************************
 * TODO (목적): 결재종류별 색상
 *******************************/
function getLineKindColor(_cd: string | null) {
  const color = ref('')
  // AKC0000001 : 상신, AKC0000002 : 합의, AKC0000003 : 결재, AKC0000004 : 확인, AKC0000009 : 회람
  switch (_cd) {
    case 'AKC0000001':
    case 'AKC0000010':
      color.value = 'blue-grey-4'
      break
    case 'AKC0000002':
      color.value = 'green-7'
      break
    case 'AKC0000003':
      color.value = 'blue-7'
      break
    case 'AKC0000004':
      color.value = 'blue-grey-4'
      break
  }
  return 'text-' + color.value
}

/******************************
 * TODO (목적): 반려 색상
 *******************************/
function getLineKindColor2(_cd: string | null) {
  const color = ref('')
  switch (_cd) {
    case '반려':
      color.value = 'text-weight-bold text-red'
      break
  }
  return color.value
}
/******************************
 * 최근결재 사인이미지 불러오기
 *******************************/
function setSignature() {
  $http({
    url: '/api/sys/appr/signature',
    method: 'GET',
    params: {
      userId: user.value.userId
    }
  }).then((_result: any) => {
    if (_result.data) {
      signaturePad.value.fromDataURL(_result.data)
    }
  })
}
/******************************
 * TODO (목적): 결재요청
 *******************************/
function saveApprRequest() {
  const chgdata = ref([]) as any
  if (reqdata.value.approvalRequestName == '') {
    message.alert({
      title: '안내',
      message: '결재 요청명을 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else if (gridline.value.data.length < 2) {
    message.alert({
      title: '안내',
      message: '결재선을 등록하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (props.popupParam.sysApprovalRequestId) {
      // 재상신의 경우
      const ordercnt2 = ref(0)
      _.forEach(gridline.value.data, (_item) => {
        ordercnt2.value = ordercnt2.value + 1
        _item.approvalLineNo = ordercnt2.value
      })
      chgdata.value = gridline.value.data.filter((x: any) => {
        return x.approvalStatusName == ''
      })
      if (chgdata.value.length < 2) {
        message.alert({
          title: '안내',
          message: '재상신 결재선을 등록하세요.',
          type: 'warning' // success / info / warning / error
        })
        return false
      } else {
        chgdata.value[0].approvalStatusCd = 'ASC0000000'
        chgdata.value[1].approvalStatusCd = 'ASC0000001'
      }
    }
    // 환경설정 결재서명여부
    if (user.value.approveSignature === 'Y') {
      dialogShow.value = true
      setTimeout(setSignature, 500)
    } else {
      message.confirm({
        title: '확인',
        message: '결재를 요청하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          const saveData = ref([]) as any
          const apprSignature = ref('')
          if (props.popupParam.sysApprovalRequestId) {
            // 재상신의 경우
            _.extend(reqdata.value, {
              approvalConnId: props.popupParam.approvalConnId, // 결재업무 연결용 업무일련번호
              approvalTypeCd: apprtype.value.approvalTypeCd, // 결재유형코드
              approvalStatusCd: 'ASC0000001', // 결재상태 (결재중)
              approvalParam: JSON.stringify(props.popupParam.approvalParamValue) // 결재상세화면 호출파라메터
            })
            saveData.value = chgdata.concat(gridline2.value.data)

            $http({
              url: saveApprRequestUrl.value + '/re',
              method: 'PUT',
              data: {
                approvalRequestModel: reqdata.value,
                approvalLineModel: saveData.value,
                sysApprovalRequestId: props.popupParam.sysApprovalRequestId,
                electronSignature: apprSignature.value
              }
            }).then((_result: any) => {
              requestResult(_result)
            })
          } else {
            _.extend(reqdata.value, {
              approvalConnId: props.popupParam.approvalConnId, // 결재업무 연결용 업무일련번호
              approvalTypeCd: apprtype.value.approvalTypeCd, // 결재유형코드
              approvalStatusCd: 'ASC0000001', // 결재상태 (결재중)
              approvalParam: JSON.stringify(props.popupParam.approvalParamValue) // 결재상세화면 호출파라메터
            })
            const ordercnt3 = ref(0)
            // 상신자 제외 첫번째 결재자에 결재중상태로 변경
            _.forEach(gridline.value.data, (_item) => {
              if (ordercnt3.value == 1) {
                _item.approvalStatusCd = 'ASC0000001'
              }
              ordercnt3.value = ordercnt3.value + 1
            })
            saveData.value = gridline.value.data.concat(gridline2.value.data)

            $http({
              url: saveApprRequestUrl.value,
              method: 'POST',
              data: {
                approvalRequestModel: reqdata.value,
                approvalLineModel: saveData.value,
                electronSignature: apprSignature.value
              }
            }).then((_result: any) => {
              requestResult(_result)
            })
          }
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    }
  }
}
/******************************
 * TODO (목적): 결재요청 후 callback
 *******************************/
function requestResult(_result: any) {
  if (_result.data.sysApprovalRequestId !== 'DUPLICATE') {
    message.alert({
      title: '안내',
      message: '결재가 정상적으로 요청되었습니다.',
      type: 'success' // success / info / warning / error
    })
  } else {
    message.alert({
      title: '안내',
      message: $language('업무는', {
        s1: _result.data.approvalExistModel.userName,
        s2: _result.data.approvalExistModel.spotName,
        s3: _result.data.approvalExistModel.deptName
      }),
      type: 'warning' // success / info / warning / error
    })
  }
  emits('closePopup')
}
/******************************
 * TODO (목적): 결재요청 - 사인팝업 입력 후
 *******************************/
function saveDialog() {
  const chgdata = ref([]) as any
  if (reqdata.value.approvalRequestName == '') {
    message.alert({
      title: '안내',
      message: '결재 요청명을 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else if (gridline.value.data.length < 2) {
    message.alert({
      title: '안내',
      message: '결재선을 등록하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else if (signaturePad.value.saveSignature().isEmpty) {
    message.alert({
      title: '안내',
      message: '서명을 작성하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (props.popupParam.sysApprovalRequestId) {
      // 재상신의 경우
      const ordercntre = ref(1)
      _.forEach(gridline.value.data, (_item) => {
        _item.approvalLineNo = ordercntre.value
        ordercntre.value = ordercntre.value + 1
      })
      chgdata.value = gridline.value.data.filter((x: any) => {
        return x.approvalStatusName == ''
      })
      if (chgdata.value.length < 2) {
        message.alert({
          title: '안내',
          message: '재상신 결재선을 등록하세요.',
          type: 'warning' // success / info / warning / error
        })
        return false
      } else {
        chgdata.value[0].approvalStatusCd = 'ASC0000000'
        chgdata.value[1].approvalStatusCd = 'ASC0000001'
      }
    }
    const saveData = ref([])
    const apprSignature = ref('')
    if (signaturePad.value.saveSignature().isEmpty) {
      apprSignature.value = ''
    } else {
      apprSignature.value = signaturePad.value.saveSignature().data
    }
    if (props.popupParam.sysApprovalRequestId) {
      // 재상신의 경우
      _.extend(reqdata.value, {
        approvalConnId: props.popupParam.approvalConnId, // 결재업무 연결용 업무일련번호
        approvalTypeCd: apprtype.value.approvalTypeCd, // 결재유형코드
        approvalStatusCd: 'ASC0000001', // 결재상태 (결재중)
        approvalParam: JSON.stringify(props.popupParam.approvalParamValue) // 결재상세화면 호출파라메터
      })
      saveData.value = chgdata.value.concat(gridline2.value.data)

      $http({
        url: saveApprRequestUrl.value + '/re',
        method: 'PUT',
        data: {
          approvalRequestModel: reqdata.value,
          approvalLineModel: saveData.value,
          sysApprovalRequestId: props.popupParam.sysApprovalRequestId,
          electronSignature: apprSignature.value
        }
      }).then((_result: any) => {
        requestResult2(_result)
      })
    } else {
      _.extend(reqdata.value, {
        approvalConnId: props.popupParam.approvalConnId, // 결재업무 연결용 업무일련번호
        approvalTypeCd: apprtype.value.approvalTypeCd, // 결재유형코드
        approvalStatusCd: 'ASC0000001', // 결재상태 (결재중)
        approvalParam: JSON.stringify(props.popupParam.approvalParamValue) // 결재상세화면 호출파라메터
      })
      const ordercntre2 = ref(0)
      // 상신자 제외 첫번째 결재자에 결재중상태로 변경
      _.forEach(gridline.value.data, (_item) => {
        if (ordercntre2.value == 1) {
          _item.approvalStatusCd = 'ASC0000001'
        }
        ordercntre2.value = ordercntre2.value + 1
      })
      saveData.value = gridline.value.data.concat(gridline2.value.data)

      $http({
        url: saveApprRequestUrl.value,
        method: 'POST',
        data: {
          approvalRequestModel: reqdata.value,
          approvalLineModel: saveData.value,
          electronSignature: apprSignature.value
        }
      }).then((_result: any) => {
        requestResult2(_result)
      })
    }
  }
}
/******************************
 * TODO (목적): 결재요청 - 사인팝업 입력 후 callback
 *******************************/
function requestResult2(_result: any) {
  if (_result.data.sysApprovalRequestId !== 'DUPLICATE') {
    message.alert({
      title: '안내',
      message: '결재가 정상적으로 요청되었습니다.',
      type: 'success' // success / info / warning / error
    })
  } else {
    message.alert({
      title: '안내',
      message:
        $language('결재요청되었습니다. 확인바랍니다.') +
        '\n' +
        $language('기존결재 요청자/직책/부서') +
        ' : ' +
        _result.data.approvalExistModel.userName +
        ' / ' +
        _result.data.approvalExistModel.spotName +
        ' / ' +
        _result.data.approvalExistModel.deptName,
      type: 'warning' // success / info / warning / error
    })
  }
  emits('closePopup')
}
/******************************
 * TODO (목적): 결재사인 팝업 닫기
 *******************************/
function closeDialog() {
  dialogShow.value = false
}
/******************************
 * TODO (목적): 결재사인 지우기
 *******************************/
function eraseSignature() {
  signaturePad.value.clearSignature()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
