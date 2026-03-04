<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <!-- [S]결재관련 버튼 -->
                <!-- sysApprovalRequestId: 상세조회시 관련 결재요청일련번호 확인 -->
                <!-- popupParam.isApprContent: 결재요청/결재처리 팝업의 component에 해당 페이지 호출시 true -->
                <!-- approvalStatusCd: 결재요청건에 대한 상태코드 -->
                <!-- popupParam.approvalDocType: TODO(결재할문서에서 상세페이지호출시) -->
                <c-appr-btn
                  ref="apprBtn"
                  name="work-permit-appr-btn"
                  :editable="editable"
                  :approvalInfo="approvalInfo"
                  @beforeApprAction="approvalPreWorkCheck"
                  @callbackApprAction="approvalPreWorkCheckCallback"
                  @requestAfterAction="getDetail"
                />
                <c-btn
                  v-show="editable && !disabled"
                  :isSubmit="isSave"
                  :url="saveUrl"
                  :param="preWorkCheck"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="savePreWorkCheck"
                  @btnCallback="savePreWorkCheckCallback"
                />
                <c-btn
                  v-show="editable && !disabled && isOld"
                  label="삭제"
                  icon="remove"
                  @btnClicked="removePreWorkCheck"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-text
                  :required="true"
                  :disabled="disabled"
                  :editable="editable"
                  label="점검명"
                  name="checkName"
                  v-model:value="preWorkCheck.checkName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-multi-select
                  :disabled="disabled"
                  :editable="editable"
                  :comboItems="checkClassItems"
                  itemText="checkClassName"
                  itemValue="sopPreWorkCheckClassId"
                  label="점검구분대상"
                  name="targets"
                  v-model:value="targets"
                  @datachange="changeTarget"
                />
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
                <c-field
                  :required="true"
                  :disabled="disabled"
                  :editable="editable"
                  :data="preWorkCheck"
                  :plantCd="preWorkCheck.plantCd"
                  deptValue="deptCd"
                  type="dept_user"
                  label="관리감독자"
                  name="managerId"
                  v-model:value="preWorkCheck.managerId"
                />
              </div>
              <div class="col-xs-12 col-sm-8 col-md-4 col-lg-4">
                <c-multi-field
                  :required="true"
                  :disabled="disabled"
                  :editable="editable"
                  :data="preWorkCheck"
                  :isArray="false"
                  deptValue="deptCd"
                  type="dept_user"
                  label="근로자"
                  name="workerIds"
                  v-model:value="preWorkCheck.workerIds"
                />
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
                <c-datepicker
                  :required="true"
                  :range="true"
                  :disabled="disabled"
                  :editable="editable"
                  label="점검기간"
                  name="checkPeriod"
                  v-model:value="preWorkCheck.checkPeriod"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
                <c-plant
                  :required="true"
                  :disabled="disabled"
                  :editable="editable"
                  label="사업장"
                  name="plantCd"
                  v-model:value="preWorkCheck.plantCd"
                />
              </div> -->
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
    <c-tab
      class="q-mt-sm"
      type="tabcard"
      align="left"
      :tabItems="tabItems"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          ref="swp-tab"
          :is="tab.component"
          :key="tab.componentKey"
          :popupParam="popupParam"
          :target="tab.target"
          :isOld="isOld"
          :disabled="disabled"
          :height="tabHeight"
        />
      </template>
    </c-tab>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'preWorkCheckDetail'
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
    sopPreWorkCheckId: stringNull
  }
  contentHeight: stringNull | numberNull
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
      sopPreWorkCheckId: ''
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
const editForm = ref<any>(null)
const apprBtn = ref<any>(null)
const preWorkCheck = ref<any>({
  sopPreWorkCheckId: '', // 작업 전 안전점검 일련번호
  plantCd: '', // 사업장 코드
  pwcPreWorkCheckStepCd: '', // 작업 전 안전점검 진행상태
  checkName: '', // 점검명
  managerId: '', // 관리감독자 일련번호
  workerIds: '', // 근로자 일련번호(복수)
  startDate: '', // 점검시작일
  endDate: '', // 점검종료일
  checkPeriod: [], // 점검기간
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  targets: [],
  deleteTargets: [],
  approvalStatusCd: '', // 결재관련 결재상태
  sysApprovalRequestId: '' // 결재관련 결재요청코드
})
const targets = ref<any>([])
const checkClassItems = ref<any>([])
const checkClassOrignItems = ref<any>([])
const checkItems = ref<any>([])
const tab = ref('PWC0000022')
const tabItems = ref<any>([])
const detailUrl = ref('')
const listItemUrl = ref('')
const listClassUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const approvalUrl = ref('')
const isSave = ref(false)
const isApproval = ref(false)
const mappingType = ref('POST')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  return props.contentHeight > 600 ? props.contentHeight - 210 + 'px' : '360px'
})
const isOld = computed(() => {
  return Boolean(props.popupParam.sopPreWorkCheckId)
})
const disabled = computed(() => {
  // 모든 입력폼이 비활성화 되는 상황
  // - 취소  - 작업완료
  // - 결재중
  return (
    isOld.value &&
    // - 취소  - 작업완료
    (preWorkCheck.value.pwcPreWorkCheckStepCd === 'PWC000005' ||
      // 결재중인 경우 비활성화
      preWorkCheck.value.approvalStatusCd === 'ASC0000001')
  )
})
const approvalInfo = computed(() => {
  return {
    sysApprovalRequestId: preWorkCheck.value.sysApprovalRequestId, // 결재요청번호
    /**
     * 결재상태코드
     * ASC0000001	결재중
     * ASC0000002	반려
     * ASC9999999	결재완료
     */
    approvalStatusCd: preWorkCheck.value.approvalStatusCd,
    apprEditable: isOld.value && preWorkCheck.value.pwcPreWorkCheckStepCd === 'PWC000001', // 결재버튼 활성화 기준
    param: preWorkCheck.value, // 결재 param
    approvalUrl: approvalUrl.value, // 결재 url
    isApproval: isApproval.value, // 결재 submit
    approvalTypeCd: 'APTC000017', // 결재유형코드
    approvalParamValue: {
      // 결재상세화면 파라미터
      sopPreWorkCheckId: preWorkCheck.value.sopPreWorkCheckId,
      isApprContent: true
    },
    approvalRequestName: preWorkCheck.value.checkName, // 결재요청명 (문서 title)
    approvalConnId: preWorkCheck.value.sopPreWorkCheckId // 결재연결용 업무일련번호 (문서 key)
  }
})
const preworkResultComponent = computed(() => {
  return markRaw(defineAsyncComponent(() => import(`./preWorkCheckTargetResult.vue`)))
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
  detailUrl.value = selectConfig.sop.pwc.check.get.url
  listItemUrl.value = selectConfig.sop.pwc.item.list.url
  listClassUrl.value = selectConfig.sop.pwc.class.list.url
  saveUrl.value = transactionConfig.sop.pwc.check.update.url
  deleteUrl.value = transactionConfig.sop.pwc.check.delete.url
  approvalUrl.value = transactionConfig.sop.pwc.check.update.url
  // code setting
  // list setting
  getCheckClass()
  getDetail()
}
function getDetail() {
  if (!tabItems.value) {
    tabItems.value = []
  }
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopPreWorkCheckId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(preWorkCheck.value, _result.data)

      preWorkCheck.value.checkPeriod =
        preWorkCheck.value.startDate && preWorkCheck.value.endDate
          ? [preWorkCheck.value.startDate, preWorkCheck.value.endDate]
          : []

      if (preWorkCheck.value.targets && preWorkCheck.value.targets.length > 0) {
        targets.value = _.map(
          _.reject(preWorkCheck.value.targets, { sopPreWorkCheckClassId: 'PWC0000022' }),
          'sopPreWorkCheckClassId'
        )
      }

      getCheckItems()
      setTabItems()

      // 상세팝업 최초작성/최근수정 정보 노출
      emits('setRegInfo', _result.data)
    })
  } else {
    // 공통 점검항목 적용
    const promises = [
      {
        func: getCheckClass
      },
      {
        func: getCheckItems
      },
      {
        func: setCommonItems
      }
    ]
    orderedPromise(promises)
  }
}
function getCheckItems() {
  // 사업장별 점검항목 정보 조회
  return new Promise((resolve) => {
    $http({
      url: listItemUrl.value,
      method: 'GET',
      params: {
        plantCd: user.value.plantCd,
        useFlag: 'Y'
      }
    }).then((_result: any) => {
      checkItems.value = _.map(_result.data, (item) => {
        return _.extend(item, {
          pwcWorkerResultCd: 'PR00000001',
          pwcManagerResultCd: 'PR00000001',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      })
      resolve(true)
    })
  })
}
function getCheckClass() {
  // 점검구분 정보 조회
  return new Promise((resolve) => {
    $http({
      url: listClassUrl.value,
      method: 'GET',
      params: {
        useFlag: 'Y'
      }
    }).then((_result: any) => {
      checkClassOrignItems.value = _.cloneDeep(_result.data)
      checkClassItems.value = _.reject(_result.data, { sopPreWorkCheckClassId: 'PWC0000022' })
      resolve(true)
    })
  })
}
function setCommonItems() {
  return new Promise((resolve) => {
    const classData = _.find(checkClassOrignItems.value, {
      sopPreWorkCheckClassId: 'PWC0000022'
    })
    preWorkCheck.value.targets.push({
      sopPreWorkCheckTargetId: '', // 작업 전 안전점검 대상 일련번호
      sopPreWorkCheckId: '', // 작업 전 안전점검 일련번호
      sopPreWorkCheckClassCd: classData.sopPreWorkCheckClassCd,
      sopPreWorkCheckClassName: classData.sopPreWorkCheckClassName,
      checkClassName: classData.checkClassName,
      sopPreWorkCheckClassId: 'PWC0000022', // 작업 전 안전점검구분 일련번호
      targetIds: '', // 대상 일련번호(복수)
      regUserId: user.value.userId, // 등록자 ID
      editFlag: 'C',
      results: _.cloneDeep(_.filter(checkItems.value, { sopPreWorkCheckClassId: 'PWC0000022' })),
      deleteResults: []
    })
    setTabItems()
    resolve(true)
  })
}
function setTabItems() {
  if (preWorkCheck.value.targets && preWorkCheck.value.targets.length > 0) {
    _.forEach(preWorkCheck.value.targets, (_target) => {
      const checkIdx = _.findIndex(tabItems.value, { name: _target.sopPreWorkCheckClassId })
      if (checkIdx === -1) {
        let pushData = {} as any
        switch (_target.sopPreWorkCheckClassCd) {
          // 작업별
          case 'PWCC000001':
            pushData = {
              componentKey: uid(),
              name: _target.sopPreWorkCheckClassId,
              class: 'tab-bluegrey',
              icon: 'construction',
              label: `${_target.sopPreWorkCheckClassName} - ${_target.checkClassName}`,
              component: preworkResultComponent.value,
              target: _target
            }
            break
          // 설비별
          case 'PWCC000005':
            pushData = {
              componentKey: uid(),
              name: _target.sopPreWorkCheckClassId,
              class: 'tab-bluegrey',
              icon: 'precision_manufacturing',
              label: `${_target.sopPreWorkCheckClassName} - ${_target.checkClassName}`,
              component: preworkResultComponent.value,
              target: _target
            }
            break
          // 계절별
          case 'PWCC000010':
            pushData = {
              componentKey: uid(),
              name: _target.sopPreWorkCheckClassId,
              class: 'tab-bluegrey',
              icon: 'cloud',
              label: `${_target.sopPreWorkCheckClassName} - ${_target.checkClassName}`,
              component: preworkResultComponent.value,
              target: _target
            }
            break
          // 기타
          case 'PWCC000015':
            // 맨 앞에 적용되도록 셋팅되어짐
            pushData = {
              componentKey: uid(),
              name: _target.sopPreWorkCheckClassId,
              class: 'tab-lightblue',
              icon: 'done',
              label: _target.checkClassName,
              component: preworkResultComponent.value,
              target: _target
            }
            break
          default:
          // code block
        }
        if (checkTab(_target.sopPreWorkCheckClassId)) {
          if (pushData.name === 'PWC0000022') {
            tabItems.value.splice(0, 0, pushData)
          } else {
            tabItems.value.push(pushData)
          }
        }
      } else {
        tabItems.value[checkIdx].target = _target
      }
    })
    const deleteItems = [] as any
    _.forEach(tabItems.value, (item) => {
      if (
        _.findIndex(preWorkCheck.value.targets, { sopPreWorkCheckClassId: item.name }) === -1 &&
        item.name !== 'PWC0000022'
      ) {
        deleteItems.push(item)
      }
    })
    if (deleteItems && deleteItems.length > 0) {
      _.forEach(deleteItems, (delItem) => {
        tabItems.value = _.reject(tabItems.value, delItem)
      })
    }
  }
}
function checkTab(tab: any) {
  return _.findIndex(tabItems.value, { name: tab }) === -1
}
function changeTarget() {
  // ## 추가된 대상을 넣는 과정
  if (targets.value && targets.value.length > 0) {
    _.forEach(targets.value, (classItem) => {
      if (_.findIndex(preWorkCheck.value.targets, { sopPreWorkCheckClassId: classItem }) === -1) {
        const classData = _.find(checkClassItems.value, { sopPreWorkCheckClassId: classItem })
        preWorkCheck.value.targets.push({
          sopPreWorkCheckTargetId: uid(), // 작업 전 안전점검 대상 일련번호
          sopPreWorkCheckId: props.popupParam.sopPreWorkCheckId
            ? props.popupParam.sopPreWorkCheckId
            : uid(), // 작업 전 안전점검 일련번호
          sopPreWorkCheckClassCd: classData.sopPreWorkCheckClassCd,
          sopPreWorkCheckClassName: classData.sopPreWorkCheckClassName,
          checkClassName: classData.checkClassName,
          sopPreWorkCheckClassId: classItem, // 작업 전 안전점검구분 일련번호
          targetIds: '', // 대상 일련번호(복수)
          regUserId: user.value.userId, // 등록자 ID
          editFlag: 'C',
          results: _.cloneDeep(_.filter(checkItems.value, { sopPreWorkCheckClassId: classItem })),
          deleteResults: []
        })
      }
    })
  }

  // ## 삭제된 대상을 빼는 과정
  if (preWorkCheck.value.targets && preWorkCheck.value.targets.length > 0) {
    const deleteItems = [] as any
    _.forEach(preWorkCheck.value.targets, (item) => {
      if (
        _.indexOf(targets.value, item.sopPreWorkCheckClassId) === -1 &&
        item.sopPreWorkCheckClassId !== 'PWC0000022'
      ) {
        deleteItems.push(item)
      }
    })

    if (!preWorkCheck.value.deleteTargets) preWorkCheck.value.deleteTargets = []
    _.forEach(deleteItems, (deleteItem) => {
      if (
        _.findIndex(preWorkCheck.value.deleteTargets, {
          sopPreWorkCheckClassId: deleteItem.sopPreWorkCheckClassId
        }) === -1 &&
        deleteItem.editFlag !== 'C'
      ) {
        preWorkCheck.value.deleteTargets.push(deleteItem)
      }
      const idx = _.findIndex(preWorkCheck.value.targets, {
        sopPreWorkCheckClassId: deleteItem.sopPreWorkCheckClassId
      })
      preWorkCheck.value.targets.splice(idx, 1)
    })
  }
  setTabItems()
}
function savePreWorkCheck() {
  if (isOld.value) {
    saveUrl.value = transactionConfig.sop.pwc.check.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.pwc.check.insert.url
    mappingType.value = 'POST'
  }

  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          preWorkCheck.value.regUserId = user.value.userId
          preWorkCheck.value.chgUserId = user.value.userId

          preWorkCheck.value.startDate = preWorkCheck.value.checkPeriod[0]
          preWorkCheck.value.endDate = preWorkCheck.value.checkPeriod[1]

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
function savePreWorkCheckCallback(result: any) {
  message.requestSuccess()
  props.popupParam.sopPreWorkCheckId = result.data
  getDetail()
}
function removePreWorkCheck() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.sopPreWorkCheckId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function approvalPreWorkCheck() {
  // 유효성 체크 : 1. 대상이 하나라도 입력되었는지?
  let isIng = true
  if (!preWorkCheck.value.targets || preWorkCheck.value.targets.length === 0) {
    message.alert({
      title: '안내',
      message: '점검대상을 하나 이상 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
    isIng = false
  }

  if (isIng) {
    editForm.value?.validate().then((_result: boolean) => {
      if (_result) {
        message.confirm({
          title: '확인',
          message: '결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            preWorkCheck.value.regUserId = user.value.userId
            preWorkCheck.value.chgUserId = user.value.userId

            preWorkCheck.value.startDate = preWorkCheck.value.checkPeriod[0]
            preWorkCheck.value.endDate = preWorkCheck.value.checkPeriod[1]

            isApproval.value = !isApproval.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      } else {
        message.validError()
      }
    })
  }
}
function approvalPreWorkCheckCallback() {
  // 결재관련 결재요청버튼 callback
  apprBtn.value.apprRequestPop()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
