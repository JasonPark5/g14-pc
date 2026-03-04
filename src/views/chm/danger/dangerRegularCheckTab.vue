<template>
  <div>
    <c-tab
      type="horizon"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :height="tabHeight"
          :contentHeight="contentHeight"
          :check="check"
          @closePopup="closePopup"
          @changeStatus="changeStatus"
          @changeComplete="changeComplete"
          @getDetail="getDetail"
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
import { dangerCheckType } from './dangerStorage'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerRegularCheckTab'
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
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  contentHeight?: stringNull
  popupParam: {
    chmDangerRegularCheckId?: stringNull
    chmDangerMstTypeId?: stringNull
    chmStatusDangerRegularCheckCd?: stringNull
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
      chmDangerRegularCheckId: '',
      chmDangerMstTypeId: '',
      chmStatusDangerRegularCheckCd: ''
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
const tab = ref('dangerRegularCheckDetail') //처음 화면에 보여질 tab을 표시하는 부분
const check = ref<dangerCheckType>({
  chmDangerRegularCheckId: '',
  chmDangerMstId: '',
  chmDangerMstTypeId: '',
  plantCd: '',
  chmDangerTypeCd: null,
  chmDangerLocation: '',
  chmDangerCheckName: '',
  chmDangerPermitNo: '',
  chmDangerUserId: '',
  chmDangerManageUserId: '',
  chmDangerSafetyUserId: '',
  chmDangerInspectorUserId: '',
  chmStatusDangerRegularCheckCd: '',
  chmDangerCount: '',
  installPermitDate: '',
  chmDangerHandlingOverview: '',
  chmDangerStartDate: '',
  chmDangerEndDate: '',
  checkitems: [],
  deletecheckitems: [],
  period: [],
  checkResults: [],
  deleteCheckResults: [],
  types: []
})
const editable = ref(true)
const detailUrl = ref('')
const tabItems = ref<Array<tabItemsType>>([
  {
    name: 'dangerRegularCheckDetail',
    icon: 'construction',
    label: '위험물저장소 기본정보',
    component: shallowRef(defineAsyncComponent(() => import(`./dangerRegularCheckDetail.vue`)))
  }
])
const addTabItems = ref<Array<tabItemsType>>([
  {
    name: 'dangerRegularCheckInfo',
    icon: 'edit',
    label: '위험물저장소 추가정보',
    component: shallowRef(defineAsyncComponent(() => import(`./dangerRegularCheckInfo.vue`)))
  }
])

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 1 + 'px' : '620px'
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
  detailUrl.value = selectConfig.chm.danger.regularChecks.get.url
  // code setting
  if (props.popupParam.chmDangerRegularCheckId) {
    tabItems.value = tabItems.value.concat(addTabItems.value)
  }
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.chmDangerRegularCheckId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.chmDangerRegularCheckId),
      method: 'GET'
    }).then((_result: any) => {
      check.value = _result.data
      check.value.period = [_result.data.chmDangerStartDate, _result.data.chmDangerEndDate]
    })
  }
}
/******************************
 * TODO (목적): 자식에게서 값 전달받는함수
 *******************************/
function closePopup(_data: any) {
  emits('closePopup', _data)
}
/******************************
 * TODO (목적): 상태변화
 *******************************/
function changeComplete() {
  props.popupParam.chmStatusDangerRegularCheckCd = 'CSDRCC0002'
}
/******************************
 * TODO (목적): 상태감지. 상태변화(등록했을 경우 개선관리 탭을 추가해서 보여줌)
 *******************************/
function changeStatus() {
  tabItems.value = tabItems.value.concat(addTabItems.value)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
