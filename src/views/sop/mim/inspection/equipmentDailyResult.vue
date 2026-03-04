<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="일상점검 결과 목록"
            :merge="grid.merge"
            :columns="grid.columns"
            :data="grid.data"
            :gridHeight="grid.height"
            selection="multiple"
            rowKey="equipmentCd"
            :editable="!disabled"
            :columnSetting="false"
            :usePaging="false"
            @headLinkClick="headLinkClick"
          >
            <template v-slot:prefixContent>
              <span v-if="!dailyCheck.lineId && !dailyCheck.checkDate" class="text-red">
                {{ $language('※ 라인과 점검년월을 선택하세요.') }}
              </span>
              <span style="font-size: 0.8em; font-weight: 500" class="text-grey-9">
                <q-icon name="radio_button_unchecked" class="ml-10" /> : {{ $language('정상') }}
                <q-icon name="close" class="ml-10" /> : {{ $language('이상') }}
                <span class="ml-10">● : {{ $language('청소') }}</span>
                <q-icon name="check" size="xs" class="ml-10" /> :
                {{ $language('교환') }}
                <q-icon name="check_box_outline_blank" class="ml-10" /> :
                {{ $language('마모') }}
                <q-icon name="change_history" class="ml-10" /> : {{ $language('Oil 누유') }}
                <span class="ml-10">▲ : {{ $language('점검필요') }} </span>
                <q-icon name="radio_button_checked" class="ml-10" /> :
                {{ $language('비가동') }}
              </span>
            </template>
            <template v-slot:customArea="{ props: bodyProps, col }">
              <template v-if="bodyProps.row[col.name] === 'Y'">
                {{ '●' }}
              </template>
              <template v-else-if="bodyProps.row[col.name] === '○'">
                <q-icon name="radio_button_unchecked" />
              </template>
              <template v-else-if="bodyProps.row[col.name] === 'X'">
                <q-icon name="close" />
              </template>
              <template v-else-if="bodyProps.row[col.name] === '□'">
                <q-icon name="check_box_outline_blank" />
              </template>
              <template v-else-if="bodyProps.row[col.name] === 'V'">
                <q-icon name="check" size="xs" />
              </template>
              <template v-else-if="bodyProps.row[col.name] === '△'">
                <q-icon name="change_history" />
              </template>
              <template v-else-if="bodyProps.row[col.name] !== 'N'">
                {{ bodyProps.row[col.name] }}
              </template>
              <template v-else />
            </template>
          </c-table>
        </div>
      </div>
      <c-dialog :param="popupOptions" :returnData="{ col1: dailyCheck.dailyCheckId }">></c-dialog>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { equipDailyType } from './equipmentDaily'

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
  name: 'equipmentDailyResult'
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
const emits = defineEmits(['setKey', 'getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  dailyCheck: equipDailyType
  grid: gridType
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: any
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
  dailyCheck: () => {
    return {
      dailyCheckId: '', // 열화점검 일련 번호
      plantCd: '', // 사업장 코드
      checkStatusCd: '', // 계획수립/점검중/점검완료
      lineId: '',
      processCd: '', // 라인일련번호
      checkDeptCd: '', // 점검부서
      checkUserId: '', // 점검자 ID
      checkDate: '', // 점검월
      dailyName: '', // 점검명
      evaluationCompleteFlag: 'N', // 결재완료 후 평가완료 처리
      approvalStatusCd: '', // 결재관련 결재상태
      sysApprovalRequestId: '', // 결재관련 결재요청코드
      utilityFlag: 'N',
      dailyResultModelList: [], // sheet
      dailyImproveModelList: [] // 개선 list
    }
  },
  grid: () => {
    return {
      merge: [{ index: 0, colName: 'equipmentCd' }],
      columns: [],
      data: [],
      height: 'auto'
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
const today = ref('')
const table = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return (
    props.dailyCheck.checkStatusCd === 'MCSC000015' ||
    Boolean(props.dailyCheck.sysApprovalRequestId)
  )
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
  // code setting
  today.value = getToday().slice(-2, getToday().length)
  if (today.value.substring(Number(today.value), 0) === '0') {
    today.value = today.value.substring(Number(today.value), 0)
  }
  // list setting
}
/******************************
 * TODO (목적): 테이블 컬럼헤더 링크
 *******************************/
function headLinkClick(_props: any, col: any) {
  const selectData = table.value.getSelected()
  const realData: any = []
  _.forEach(selectData, (_item) => {
    _.forEach(_.filter(props.grid.data, { equipmentCd: _item.equipmentCd }), (__item) => {
      if (_.findIndex(realData, { dailyCheckResultId: __item.dailyCheckResultId }) === -1) {
        realData.push(__item)
      }
    })
  })
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '점검할 설비/장비를 체크하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    popupOptions.value.param = {
      col: col,
      equipmentList: realData,
      dailyCheck: props.dailyCheck
    }
    popupOptions.value.title = '일상점검 결과 상세'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./equipmentDailyChecking.vue`))
    )
    popupOptions.value.visible = true
    popupOptions.value.isFull = false
    popupOptions.value.width = '95%'
    popupOptions.value.closeCallback = closeResultPopup
  }
}
/******************************
 * TODO (목적): 상세 팝업 닫기 콜백
 *******************************/
function closeResultPopup(returnData: any) {
  table.value.setSelected([])
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (returnData.col1) {
    props.dailyCheck.dailyCheckId = returnData.col1
    emits('setKey', returnData.col1)
  } else {
    emits('getDetail')
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.ml-10
  margin-left: 10px !important
</style>
