<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="결재요청 정보" class="cardClassDetailForm" topClass="topcolor-orange">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="popupParam.approvalDocType == 'TODO'"
                label="반려"
                icon="remove"
                @btnClicked="returnApprRequest"
              />
              <c-btn
                v-if="popupParam.approvalDocType == 'TODO'"
                label="결재"
                icon="save"
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
                  v-model:value="apprinfo.approvalTypeName"
                />
              </div>
              <div class="col-12">
                <c-text
                  :editable="false"
                  :required="true"
                  label="결재 요청명"
                  name="approvalRequestName"
                  v-model:value="apprinfo.approvalRequestName"
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
                gridHeight="250px"
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
                gridHeight="250px"
                :columns="gridline.columns"
                :data="gridline.data"
              >
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
                  <template v-if="col.name === 'sign'">
                    <q-btn round unelevated size="10px" color="amber" icon="search">
                      <q-popup-proxy :id="'proxy_' + props.rowIndex" :breakpoint="400">
                        <component
                          :is="col.component"
                          :popupParam="props.row"
                          :rowIndex="props.rowIndex"
                          @callback="(data: any) => callbackProxy(data, props)"
                        />
                      </q-popup-proxy>
                    </q-btn>
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
          topClass="topcolor-orange"
        >
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <component :is="component" :popupParam="apprinfo.approvalParamValue" />
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
import { apprPopupParamType, apprInfo } from './appr'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'apprProcess'
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
const emits = defineEmits(['closePopup', 'callbackProxy'])

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

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      sysApprovalRequestId: '', // 결재 요청 일련번호
      approvalDocType: ''
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
const dialogShow = ref(false)
const signaturePad = ref<any>(null)
const detailTypeUrl = ref('')
const apprLineUrl = ref('')
const saveApprRequestUrl = ref('')
const returnApprRequestUrl = ref('')
const listUrl = ref('')
const infoUrl = ref('')
const apprinfo = ref<apprInfo>({
  approvalTypeCd: '', // 결재유형코드
  approvalRequestName: '', // 결재 요청명
  approvalTypeName: '', // 결재업무명
  approvalUrl: '', // 결재화면 page경로
  approvalStatusCd: '', // 결재상태
  approvalParam: '', // 결재파라메터
  approvalConnId: ''
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '50%',
  isFull: false,
  param: {},
  closeCallback: () => {}
})
const gridline = ref({
  columns: [
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
      style: 'width: 140px',
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
const component = ref<any>(null)

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
 * TODO (목적): init
 *******************************/
function init() {
  // role setting
  // url setting
  infoUrl.value = selectConfig.sys.appr.info.get.url
  listUrl.value = selectConfig.sys.appr.line.list.url
  detailTypeUrl.value = selectConfig.sys.appr.type.get.url
  apprLineUrl.value = selectConfig.sys.appr.line.last.url
  saveApprRequestUrl.value = transactionConfig.sys.appr.request.update.url
  returnApprRequestUrl.value = transactionConfig.sys.appr.request.return.url
  // code setting
  // 환경설정 결재서명여부
  if (user.value.approveSignature === 'Y') {
    gridline.value.columns.push({
      name: 'sign',
      field: 'sign',
      label: '서명보기',
      style: 'width:70px',
      type: 'custom',
      align: 'center',
      sortable: false,
      component: shallowRef(defineAsyncComponent(() => import(`@popups/appr/apprSignaturePop.vue`)))
    })
  }
  // list setting
  getApprInfo()
  getApprLine()
}
/******************************
 * TODO (목적): 결재선 불러오기
 *******************************/
function getApprLine() {
  // AKC0000001 : 상신, AKC0000002 : 합의, AKC0000003 : 결재, AKC0000004 : 확인, AKC0000009 : 회람, AKC0000010 : 재상신
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      sysApprovalRequestId: props.popupParam.sysApprovalRequestId
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      const lineData1 = ref(
        _result.data.filter((x: any) => {
          return (
            x.approvalKindCd == 'AKC0000001' ||
            x.approvalKindCd == 'AKC0000002' ||
            x.approvalKindCd == 'AKC0000003' ||
            x.approvalKindCd == 'AKC0000004' ||
            x.approvalKindCd == 'AKC0000010'
          )
        })
      )
      const lineData2 = ref(
        _result.data.filter((x: any) => {
          return x.approvalKindCd == 'AKC0000009'
        })
      )
      // `approvalDt` 속성값의 앞 19자리만 슬라이스하여 밀리초단위 삭제
      lineData1.value.forEach((item: any) => {
        if (item.approvalDt) {
          item.approvalDt = item.approvalDt.slice(0, 19)
        }
      })
      gridline.value.data = lineData1.value
      gridline2.value.data = lineData2.value
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
    apprinfo.value = _result.data

    component.value = getApprComponent(_result.data.approvalUrl)
    apprinfo.value.approvalParamValue = JSON.parse(_result.data.approvalParam)
    _.extend(apprinfo.value.approvalParamValue, {
      approvalDocType: props.popupParam.approvalDocType
    })
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
 * TODO (목적): 결재종류별 색상
 *******************************/
function getLineKindColor(_cd: string | null | undefined) {
  const color = ref('')
  // AKC0000001 : 상신, AKC0000002 : 합의, AKC0000003 : 결재, AKC0000004 : 확인, AKC0000009 : 회람, AKC0000010 : 재상신
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
 * TODO (목적): 결재종류별(반려) 색상
 *******************************/
function getLineKindColor2(_cd: string | null | undefined) {
  const color = ref('')
  switch (_cd) {
    case '반려':
      color.value = 'text-weight-bold text-red'
      break
  }
  return color.value
}
/******************************
 * TODO (목적): 반려처리
 *******************************/
function returnApprRequest() {
  const apprUserInfo = ref({
    approvalLineNo: '',
    approvalUserId: '',
    sysApprovalRequestId: '',
    approvalStatusCd: '',
    returnReason: '',
    approvalTransferUserId: ''
  })
  const returnData = gridline.value.data.filter((x: any) => {
    return x.approvalStatusCd == 'ASC0000001' && x.approvalUserId == user.value.userId
  })
  const returnData2 = gridline.value.data.filter((x: any) => {
    return (
      x.approvalStatusCd == 'ASC0000001' && x.approvalTransferUserId.indexOf(user.value.userId) > -1
    )
  })
  if (returnData.length > 0) {
    apprUserInfo.value.approvalLineNo = returnData[0].approvalLineNo
    apprUserInfo.value.approvalUserId = returnData[0].approvalUserId
    apprUserInfo.value.sysApprovalRequestId = returnData[0].sysApprovalRequestId
    apprUserInfo.value.approvalStatusCd = 'ASC0000002' // 반려
    apprUserInfo.value.returnReason = returnData[0].returnReason

    if (apprUserInfo.value.returnReason === null || apprUserInfo.value.returnReason == '') {
      message.alert({
        title: '안내',
        message: '반려사유를 입력하세요.',
        type: 'warning' // success / info / warning / error
      })
      return false
    }
  } else if (returnData2.length > 0) {
    apprUserInfo.value.approvalLineNo = returnData2[0].approvalLineNo
    apprUserInfo.value.approvalUserId = returnData2[0].approvalUserId
    apprUserInfo.value.sysApprovalRequestId = returnData2[0].sysApprovalRequestId
    apprUserInfo.value.approvalTransferUserId = user.value.userId
    apprUserInfo.value.approvalStatusCd = 'ASC0000002' // 반려
    apprUserInfo.value.returnReason = returnData2[0].returnReason

    if (apprUserInfo.value.returnReason === null || apprUserInfo.value.returnReason == '') {
      message.alert({
        title: '안내',
        message: '반려사유를 입력하세요.',
        type: 'warning' // success / info / warning / error
      })
      return false
    }
  }
  message.confirm({
    title: '확인',
    message: '반려하시겠습니까?',
    type: 'info',
    // 확인 callback 함수
    confirmCallback: () => {
      const apprSubmitUserInfo = _.find(gridline.value.data, { approvalStatusCd: 'ASC0000000' })

      $http({
        url: returnApprRequestUrl.value,
        method: 'PUT',
        data: {
          approvalUser: apprUserInfo.value,
          approvalSubmit: apprSubmitUserInfo,
          approvalLineModel: gridline.value.data,
          approvalRequestModel: {
            approvalTypeCd: apprinfo.value.approvalTypeCd,
            approvalConnId: apprinfo.value.approvalConnId,
            approvalStatusCd: 'ASC0000002',
            sysApprovalRequestId: props.popupParam.sysApprovalRequestId,
            approvalRequestName: apprinfo.value.approvalRequestName
          }
        }
      }).then((_result: any) => {
        message.alert({
          title: '안내',
          message: '결재가 반려 처리되었습니다.',
          type: 'success' // success / info / warning / error
        })
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 최근결재 사인이미지 불러오기
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
 * TODO (목적): 결재
 *******************************/
function saveApprRequest() {
  if (user.value.approveSignature === 'Y' || user.value.approveSignature === 'M') {
    dialogShow.value = true
    setTimeout(setSignature, 500)
  } else {
    message.confirm({
      title: '확인',
      message: '결재하시겠습니까?',
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        // 상신자 제외 첫번째 결재자에 결재중상태로 변경
        const apprUserInfo = ref({
          approvalLineNo: '',
          approvalUserId: '',
          sysApprovalRequestId: '',
          electronSignature: '',
          approvalStatusCd: '',
          approvalTransferUserId: ''
        })
        const apprNextUserInfo = ref({
          approvalLineNo: '',
          approvalUserId: '',
          sysApprovalRequestId: '',
          approvalStatusCd: ''
        })
        const apprSubmitUserInfo = ref({
          approvalUserId: ''
        })
        const apprSignature = ref('')
        if (signaturePad.value.saveSignature().isEmpty) {
          apprSignature.value = ''
        } else {
          apprSignature.value = signaturePad.value.saveSignature().data
        }
        for (let i = 0; i < gridline.value.data.length; i++) {
          if (
            gridline.value.data[i].approvalStatusCd == 'ASC0000001' &&
            gridline.value.data[i].approvalUserId == user.value.userId
          ) {
            // 결재중인 사용자 결재처리
            apprUserInfo.value.approvalLineNo = gridline.value.data[i].approvalLineNo
            apprUserInfo.value.approvalUserId = gridline.value.data[i].approvalUserId
            apprUserInfo.value.sysApprovalRequestId = gridline.value.data[i].sysApprovalRequestId
            apprUserInfo.value.electronSignature = apprSignature.value
            apprUserInfo.value.approvalStatusCd = 'ASC9999999'
            // 다음결재 결재중으로 UPDATE
            if (gridline.value.data[i + 1] !== undefined) {
              apprNextUserInfo.value.approvalLineNo = gridline.value.data[i].approvalLineNo + 1
              apprNextUserInfo.value.approvalUserId = gridline.value.data[i + 1].approvalUserId
              apprNextUserInfo.value.sysApprovalRequestId =
                gridline.value.data[i].sysApprovalRequestId
              apprNextUserInfo.value.approvalStatusCd = 'ASC0000001'
            }
          } else if (
            gridline.value.data[i].approvalStatusCd == 'ASC0000001' &&
            gridline.value.data[i].approvalTransferUserId.indexOf(user.value.userId) > -1
          ) {
            // 결재이양자 대상일 경우
            apprUserInfo.value.approvalLineNo = gridline.value.data[i].approvalLineNo
            apprUserInfo.value.approvalUserId = gridline.value.data[i].approvalUserId
            apprUserInfo.value.approvalTransferUserId = user.value.userId
            apprUserInfo.value.sysApprovalRequestId = gridline.value.data[i].sysApprovalRequestId
            apprUserInfo.value.electronSignature = apprSignature.value
            apprUserInfo.value.approvalStatusCd = 'ASC9999999'
            // 다음결재 결재중으로 UPDATE
            if (gridline.value.data[i + 1] !== undefined) {
              apprNextUserInfo.value.approvalLineNo = gridline.value.data[i].approvalLineNo + 1
              apprNextUserInfo.value.approvalUserId = gridline.value.data[i + 1].approvalUserId
              apprNextUserInfo.value.sysApprovalRequestId =
                gridline.value.data[i].sysApprovalRequestId
              apprNextUserInfo.value.approvalStatusCd = 'ASC0000001'
            }
          }
          if (gridline.value.data[i].approvalStatusCd == 'ASC0000000') {
            // 결재 상신자
            apprSubmitUserInfo.value.approvalUserId = gridline.value.data[i].approvalUserId
          }
        }
        $http({
          url: saveApprRequestUrl.value,
          method: 'PUT',
          data: {
            approvalUser: apprUserInfo.value,
            approvalNext: apprNextUserInfo.value,
            approvalSubmit: apprSubmitUserInfo.value,
            approvalRequestModel: {
              approvalTypeCd: apprinfo.value.approvalTypeCd,
              approvalConnId: apprinfo.value.approvalConnId,
              approvalRequestName: apprinfo.value.approvalRequestName
            }
          }
        }).then((_result: any) => {
          message.alert({
            title: '안내',
            message: '결재가 정상적으로 처리되었습니다.',
            type: 'success' // success / info / warning / error
          })
          emits('closePopup')
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 결재 (사인팝업 후)
 *******************************/
function saveDialog() {
  if (signaturePad.value.saveSignature().isEmpty) {
    message.alert({
      title: '안내',
      message: '서명을 작성하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  const apprUserInfo = ref({
    approvalLineNo: '',
    approvalUserId: '',
    sysApprovalRequestId: '',
    electronSignature: '',
    approvalStatusCd: '',
    approvalTransferUserId: ''
  })
  const apprNextUserInfo = ref({
    approvalLineNo: '',
    approvalUserId: '',
    sysApprovalRequestId: '',
    approvalStatusCd: ''
  })
  const apprSubmitUserInfo = ref({
    approvalUserId: ''
  })
  for (let i = 0; i < gridline.value.data.length; i++) {
    if (
      gridline.value.data[i].approvalStatusCd == 'ASC0000001' &&
      gridline.value.data[i].approvalUserId == user.value.userId
    ) {
      // 결재중인 사용자 결재처리
      const apprSignature = ref('')
      if (signaturePad.value.saveSignature().isEmpty) {
        apprSignature.value = ''
      } else {
        apprSignature.value = signaturePad.value.saveSignature().data
      }
      apprUserInfo.value.approvalLineNo = gridline.value.data[i].approvalLineNo
      apprUserInfo.value.approvalUserId = gridline.value.data[i].approvalUserId
      apprUserInfo.value.sysApprovalRequestId = gridline.value.data[i].sysApprovalRequestId
      apprUserInfo.value.electronSignature = apprSignature.value
      apprUserInfo.value.approvalStatusCd = 'ASC9999999'
      // 다음결재 결재중으로 UPDATE
      if (gridline.value.data[i + 1] !== undefined) {
        apprNextUserInfo.value.approvalLineNo = gridline.value.data[i].approvalLineNo + 1
        apprNextUserInfo.value.sysApprovalRequestId = gridline.value.data[i].sysApprovalRequestId
        apprNextUserInfo.value.approvalUserId = gridline.value.data[i + 1].approvalUserId
        apprNextUserInfo.value.approvalStatusCd = 'ASC0000001'
      }
    } else if (
      gridline.value.data[i].approvalStatusCd == 'ASC0000001' &&
      gridline.value.data[i].approvalTransferUserId.indexOf(user.value.userId) > -1
    ) {
      // 결재이양자 대상일 경우
      const apprSignature = ref('')
      if (signaturePad.value.saveSignature().isEmpty) {
        apprSignature.value = ''
      } else {
        apprSignature.value = signaturePad.value.saveSignature().data
      }

      apprUserInfo.value.approvalLineNo = gridline.value.data[i].approvalLineNo
      apprUserInfo.value.approvalUserId = gridline.value.data[i].approvalUserId
      apprUserInfo.value.approvalTransferUserId = user.value.userId
      apprUserInfo.value.sysApprovalRequestId = gridline.value.data[i].sysApprovalRequestId
      apprUserInfo.value.electronSignature = apprSignature.value
      apprUserInfo.value.approvalStatusCd = 'ASC9999999'
      // 다음결재 결재중으로 UPDATE
      if (gridline.value.data[i + 1] !== undefined) {
        apprNextUserInfo.value.approvalLineNo = gridline.value.data[i].approvalLineNo + 1
        apprNextUserInfo.value.sysApprovalRequestId = gridline.value.data[i].sysApprovalRequestId
        apprNextUserInfo.value.approvalUserId = gridline.value.data[i + 1].approvalUserId
        apprNextUserInfo.value.approvalStatusCd = 'ASC0000001'
      }
    }
    if (gridline.value.data[i].approvalStatusCd == 'ASC0000000') {
      // 결재 상신자
      apprSubmitUserInfo.value.approvalUserId = gridline.value.data[i].approvalUserId
    }
  }
  $http({
    url: saveApprRequestUrl.value,
    method: 'PUT',
    data: {
      approvalUser: apprUserInfo.value,
      approvalNext: apprNextUserInfo.value,
      approvalSubmit: apprSubmitUserInfo.value,
      approvalRequestModel: {
        approvalTypeCd: apprinfo.value.approvalTypeCd,
        approvalConnId: apprinfo.value.approvalConnId,
        approvalRequestName: apprinfo.value.approvalRequestName
      }
    }
  }).then((_result: any) => {
    message.alert({
      title: '안내',
      message: '결재가 정상적으로 처리되었습니다.',
      type: 'success' // success / info / warning / error
    })
    emits('closePopup')
  })
}
/******************************
 * TODO (목적): 팝업닫기
 *******************************/
function closeDialog() {
  dialogShow.value = false
}

/******************************
 * TODO (목적): 사인 지우기
 *******************************/
function eraseSignature() {
  signaturePad.value.clearSignature()
}

/******************************
 * TODO (목적): 결재 후 callback
 *******************************/
function callbackProxy(_data: any, _props: any) {
  const refName = 'proxy_' + _props.rowIndex
  emits('callbackProxy', _data, _props)
  const elements = document.getElementById(refName) as any
  if (elements) elements.hide()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
