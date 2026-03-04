<template>
  <div>
    <c-tab
      ref="esTab"
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
          :apprMode="false"
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
import { sapaInspectionType } from './selfEvaluation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'esteamInspectionDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
    saiSapaEsCheckId: stringNull
    isApprContent: boolean
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
      saiSapaEsCheckId: '',
      isApprContent: false
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
const inspection = ref<sapaInspectionType>({
  saiSapaEsCheckId: '',
  plantCd: '1000',
  deptCd: user.value.deptCd,
  completeFlag: 'N',
  checkDate: getTodayDateTiemMin(),
  checkYear: getThisYear(),
  checkSemiAnnualCd: Number(getTodayDateTiemMin().split('-')[1]) < 7 ? 'CSAC00001' : 'CSAC00002',
  checkTitle: `${getThisYear()}년 ${Number(getTodayDateTiemMin().split('-')[1]) < 7 ? '상반기' : '하반기'} EHS팀 반기점검`,
  checkUserId: user.value.userId,
  checkMethod: '',
  results: [],
  delResults: []
})
const tab = ref('info')
const detailUrl = ref('')
const resultItemUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.saiSapaEsCheckId))
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
      component: defineAsyncComponent(() => import(`./esteamInspectionDetail2.vue`)),
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
const disabled = computed(
  () => inspection.value.completeFlag === 'Y' || inspection.value.sysApprovalRequestId
)
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.saiSapaEsCheckId,
    ibmTaskTypeCd: 'ITT0000240',
    ibmTaskUnderTypeCd: 'ITTU000265',
    requestContents: inspection.value.checkTitle,
    disabled: disabled.value,
    isOld: isOld.value,
    isTable: false,
    gridItem: {
      listUrl: '',
      param: null,
      title: '점검항목별 개선목록',
      merge: [],
      data: _.filter(inspection.value.results, (result: any) => {
        return result.ibmTooltip
      }),
      columns: [
        {
          name: 'requirement',
          field: 'requirement',
          label: '점검항목',
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
watch(
  () => inspection.value.checkDate,
  () => {
    if (Number(inspection.value.checkDate.split('-')[1]) < 7)
      inspection.value.checkSemiAnnualCd = 'CSAC00001'
    else inspection.value.checkSemiAnnualCd = 'CSAC00002'
    inspection.value.checkYear = inspection.value.checkDate.split('-')[0]
    inspection.value.checkTitle = `${inspection.value.checkYear}년 ${inspection.value.checkSemiAnnualCd === 'CSAC00001' ? '상반기' : '하반기'} EHS팀 반기점검`
  }
)
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
  detailUrl.value = selectConfig.sai.sse.es.get.url
  resultItemUrl.value = selectConfig.sai.sse.mst.esteam.list.all.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  inspection.value.results = []
  if (props.popupParam.saiSapaEsCheckId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiSapaEsCheckId),
      method: 'GET'
    }).then((_result: any) => {
      inspection.value = _result.data
      emits('setRegInfo', _result.data)
    })
  } else {
    $http({
      url: resultItemUrl.value,
      method: 'GET',
      params: { useFlag: 'Y' }
    }).then((_result: any) => {
      inspection.value.results = _result.data
    })
  }
}
function closePopup(data: any) {
  emits('closePopup', data)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
