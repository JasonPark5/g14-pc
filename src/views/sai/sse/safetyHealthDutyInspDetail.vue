<template>
  <div>
    <c-tab
      ref="sseTab"
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
          :inspection="inspection"
          :imprTabInfo="imprTabInfo"
          :contentHeight="tabHeight"
          :isOld="isOld"
          :disabled="disabled"
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
import { inspectionType } from './selfEvaluation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyHealthDutyInspDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sdpSemiCheckId: stringNull
  }
  contentHeight?: stringNull
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
      sdpSemiCheckId: ''
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
const editable = ref(true)
const inspection = ref<inspectionType>({
  sdpSemiCheckId: '',
  // plantCd: '',
  checkTitle: '',
  checkYear: '',
  checkSemiAnnualCd: '',
  checkDate: '',
  deptCd: '',
  deptName: '',
  checkUserId: '',
  checkMethod: '',
  parentResults: [],
  subResults: [],
  delSubResults: []
})
const tab = ref('info')
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.sdpSemiCheckId))
const disabled = computed(() => inspection.value.checkFinishFlag === 'Y')
const tabHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight) ? Number(props.contentHeight) : 600
  if (height < 600) height = 600
  return height + 'px'
})
const tabItems = computed(() => {
  const items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'edit',
      label: '기본정보',
      component: defineAsyncComponent(() => import(`./safetyHealthDutyInspectionInfo.vue`)),
      key: uid()
    }
  ]
  if (isOld.value) {
    items.push({
      name: 'impr',
      icon: 'construction',
      label: '개선관리',
      component: defineAsyncComponent(() => import(`@views/common/ibm/imprTab.vue`)),
      key: uid()
    })
  }
  return items
})

const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.sdpSemiCheckId,
    ibmTaskTypeCd: 'ITT0000250',
    ibmTaskUnderTypeCd: 'ITTU000245',
    requestContents: inspection.value.checkTitle, // 요청내용
    disabled: disabled.value,
    isOld: isOld.value,
    isTable: false,
    gridItem: {
      listUrl: '',
      param: null,
      title: '점검내용별 개선목록',
      merge: [],
      data: _.filter(inspection.value.subResults, (result: any) => {
        return result.ibmTooltip
      }),
      columns: [
        {
          name: 'checkContent',
          field: 'checkContent',
          label: '점검내용',
          align: 'left',
          style: 'width:400px',
          sortable: false
        },
        {
          name: 'checkResultName',
          field: 'checkResultName',
          label: '점검결과',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'remark',
          field: 'remark',
          label: '비고',
          align: 'left',
          style: 'width:230px',
          sortable: false
        }
      ],
      research: {}
    },
    gridOther: {
      title: '항목외 개선 목록'
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  detailUrl.value = selectConfig.sai.sse.shd.inpection.get.url
  // code setting
  // list setting
  getDetail()
}

/***********************************************************
 * TODO (목적): 기존에 등록되어 있었을 시, 신규 등록시 정보 조회
 ***********************************************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sdpSemiCheckId),
      method: 'GET'
    }).then((_result: any) => {
      inspection.value = _result.data
      emits('setRegInfo', _result.data)
    })
  } else {
    $http({
      url: selectConfig.sai.sse.shd.result.default.url,
      method: 'GET'
    }).then((_result: any) => {
      inspection.value.subResults = _result.data
    })
  }
}
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
