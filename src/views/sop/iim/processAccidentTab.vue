<template>
  <div>
    <c-tab
      type="tabcard"
      align="left"
      :height="tabHeight"
      :inlineLabel="true"
      :tabItems="tabItems"
      :editable="editable"
      :addTab="!tabAddDisabled"
      :removeTab="!tabRemoveDisabled"
      removeConditionCol="accidentStatusCd"
      removeConditionVal="ISPC000005"
      v-model:value="tab"
      @addTab="addTab"
      @removeTab="removeTab"
      @tabClick="tabClick"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :stepSize="stepSize"
          @setReportTab="setReportTab"
        />
      </template>
    </c-tab>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section />

        <q-form ref="editForm">
          <q-card-section class="q-pt-none">
            <c-text required label="보고명" name="reportName" v-model:value="reportName" />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <c-select
              required
              type="edit"
              :editable="editable"
              :comboItems="comboItems"
              itemText="codeName"
              itemValue="code"
              label="보고유형"
              name="reportTypeCd"
              v-model:value="reportTypeCd"
            />
          </q-card-section>
        </q-form>
        <q-card-actions actions align="right" class="text-primary">
          <q-btn flat :label="$language('취소')" @click="cancelReportName" />
          <q-btn flat :label="$language('추가')" @click="setReportName" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { processAccidentPopupParamType } from './processAccident'

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
  name: 'processAccidentTab'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: processAccidentPopupParamType
  contentHeight: stringNull
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
      iimAccidentId: '',
      stepCd: '',
      reportName: '',
      iimReportGroupId: '',
      count: 0
    }
  },
  contentHeight: ''
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
const tab = ref('first')
const tabItems = ref<any>([])
const prompt = ref(false)
const comboItems = ref<codeMasterType>([])
const reportName = ref('')
const reportTypeCd = ref(null)
const getUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const beforeStatusCd = ref('')
const editForm = ref<any>(null)
const stepSize = ref(820)
/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  props.contentHeight && !isNaN(props.contentHeight) ? props.contentHeight + 'px' : '780px'
)
const tabAddDisabled = computed(
  () =>
    !props.popupParam.iimAccidentId ||
    props.popupParam.stepCd === 'ISPC000001' ||
    _.findIndex(tabItems.value, { reportTypeCd: 'IRC0000010' }) >= 0 ||
    _.findIndex(tabItems.value, {
      reportTypeCd: 'IRC0000010',
      accidentStatusCd: 'ISPC000005'
    }) >= 0 ||
    beforeStatusCd.value !== 'ISPC000005'
)
const tabRemoveDisabled = computed(
  () =>
    (tabItems.value.length === 1 && props.popupParam.stepCd !== 'ISPC000001') ||
    _.findIndex(tabItems.value, {
      reportTypeCd: 'IRC0000010',
      accidentStatusCd: 'ISPC000005'
    }) >= 0
)
/******************************
 * @Watch_선언
 *******************************/
// watch(
//   () => props.contentHeight,
//   () => {
//     let height = props.contentHeight - 130
//     if (height < 400) {
//       height = 500
//     }
//     stepSize.value = height
//   }
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
  getUrl.value = selectConfig.sop.iim.accident.process.reportTab.get.url
  insertUrl.value = transactionConfig.sop.iim.accident.process.reportTab.insert.url
  deleteUrl.value = transactionConfig.sop.iim.accident.process.reportTab.delete.url
  // code setting
  getComboItems('IIM_REPORT_CD').then((_result: any) => {
    comboItems.value = _.reject(_result, { code: 'IRC0000001' })
  })
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 사고보고서 조회
 *******************************/
function getDetail() {
  if (props.popupParam.iimReportGroupId) {
    tabItems.value = []
    $http({
      url: $format(getUrl.value, props.popupParam.iimReportGroupId),
      method: 'GET'
    }).then((_result: any) => {
      tabItems.value = _result.data
      tab.value = _result.data[0].iimReportId
      beforeStatusCd.value = _result.data[_result.data.length - 1].accidentStatusCd
      _.forEach(tabItems.value, (item) => {
        item.name = item.iimReportId
        item.label = item.reportName
        item.icon = 'folder'
        item.component = shallowRef(
          defineAsyncComponent(() => import(`./processAccidentDetail.vue`))
        )
        item.key = uid()
      })
    })
  } else {
    tabItems.value = [
      {
        key: uid(),
        name: 'first',
        icon: 'folder',
        label: '최초보고',
        component: shallowRef(defineAsyncComponent(() => import(`./processAccidentDetail.vue`)))
      }
    ]
  }
}
/******************************
 * TODO (목적): 탭클릭
 *******************************/
function tabClick(_tab: any) {
  tab.value = _tab.name
  if (props.popupParam.iimAccidentId) {
    props.popupParam.stepCd = _tab.accidentStatusCd
    props.popupParam.iimAccidentId = _tab.iimAccidentId
  }
}
/******************************
 * TODO (목적): 사고보고서 추가
 *******************************/
function addTab() {
  prompt.value = true
}
/******************************
 * TODO (목적): 사고보고서 취소
 *******************************/
function cancelReportName() {
  reportName.value = ''
  prompt.value = false
}
/******************************
 * TODO (목적): 사고보고서 이름 변경
 *******************************/
function setReportName() {
  const saveData = {
    firstIimAccidentId: props.popupParam.iimReportGroupId,
    reportName: reportName.value,
    reportTypeCd: reportTypeCd.value,
    iimReportId: uid(),
    regUserId: user.value.userId
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: insertUrl.value,
        method: 'POST',
        data: saveData
      }).then((_result: any) => {
        message.requestSuccess()
        prompt.value = false
        reportName.value = ''
        reportTypeCd.value = null
        getDetail()
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 사고보고서 탭 삭제
 *******************************/
function removeTab(_tab: any) {
  message.confirm({
    title: '확인',
    message: '제외하실 경우 해당 보고에 해당하는 사고 정보가 삭제됩니다. 진행하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, _tab.iimAccidentId, _tab.iimReportId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        if (tabItems.value.length === 1) {
          emits('closePopup')
        } else {
          tabItems.value[_.findIndex(tabItems.value, { name: _tab.iimReportId })] = null
          tab.value = tabItems.value[0].name
        }
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 사고보고서 탭 변경
 *******************************/
function setReportTab(data: any) {
  if (!props.popupParam.iimAccidentId) {
    props.popupParam.iimAccidentId = data.groupId
    props.popupParam.iimReportGroupId = data.groupId
    props.popupParam.stepCd = 'ISPC000001'
  } else {
    props.popupParam.stepCd = data.stepCd
  }
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
