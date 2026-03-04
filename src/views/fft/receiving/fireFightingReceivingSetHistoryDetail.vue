<template>
  <div>
    <c-tab
      type="horizon"
      :dense="true"
      :inlineLabel="true"
      :tabItems="tabItems"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :receivingSetHistory="receivingSetHistory"
          :attachInfo="attachInfo"
          :imprTabInfo="imprTabInfo"
          :isOld="isOld"
          :contentHeight="contentHeight"
          @getDetail="getDetail"
          @closePopup="closePopup"
        />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { receiveType } from '../fireFighting'

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
  name: 'fireFightingReceivingSetHistoryDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  contentHeight?: stringNull
  popupParam: {
    sopFireFightingReceivingSetHistoryId?: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  popupParam: () => {
    return {
      sopFireFightingReceivingSetHistoryId: ''
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
const tab = ref('info')
const detailUrl = ref('')
const receivingSetHistory = ref<receiveType>({
  sopFireFightingReceivingSetHistoryId: '', // 화재수신기 작동 이력 보고 일련번호
  plantCd: null, // 사업장코드
  reportDate: '', // 보고일
  locationDong: '', // 장소_동
  locationFloor: '', // 장소_층
  locationDetail: '', // 세부위치
  sopFireFightingId: '', // 소방설비 일련번호
  fireFightingName: '', // 소방설비명
  sopFireFightingTypeName: '', // 소방설비 종류명
  repeaterType: '', // 중계기 번호
  repeater: '', // 중계기
  repeaterMenufCompany: '', // 제조사
  happened: '', // 발생내용
  insufficiencies: '', // 미흡사항
  causeAnalysis: '', // 원인분석
  evacuationFlag: 'N', // 대피유무
  evacuationCount: '', // 대피인원
  evacuationDetails: '', // 대피내용, 미대피 사유
  improvement: '', // 개선방안
  remarks: '', // 비고
  detectorOperatingPositionSrc: '', // 감지기 동작 위치
  regUserId: '', // 등록자
  chgUserId: ''
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'FIRE_RECEIVING_SET',
  taskKey: ''
})

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.sopFireFightingReceivingSetHistoryId))
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 6 + 'px' : '530px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'info',
      label: '점검상세',
      component: defineAsyncComponent(() => import(`./fireFightingReceivingSetHistoryInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items.push({
      name: 'improvement',
      icon: 'construction',
      label: '감소대책 및 시정조치',
      component: defineAsyncComponent(() => import(`@/views/common/ibm/imprTab.vue`))
    })
  }
  return _items
})
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.sopFireFightingReceivingSetHistoryId,
    ibmTaskTypeCd: 'ITT0000210',
    ibmTaskUnderTypeCd: 'ITTU000240',
    requestContents:
      '(' +
      receivingSetHistory.value.reportDate +
      ') ' +
      receivingSetHistory.value.fireFightingName,
    disabled: false,
    isOld: true,
    isTable: true,
    gridItem: {
      listUrl: null,
      param: null,
      title: null,
      data: {},
      columns: [],
      research: {}
    },
    gridOther: {
      title: '개선 목록'
    }
  }
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
  // url setting
  detailUrl.value = selectConfig.fft.fireFightingReceivingSetHistory.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopFireFightingReceivingSetHistoryId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(receivingSetHistory.value, _result.data)
      attachInfo.value.taskKey = props.popupParam.sopFireFightingReceivingSetHistoryId
    })
  }
}
/******************************
 * TODO (목적): emit
 *******************************/
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
