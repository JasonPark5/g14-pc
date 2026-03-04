<template>
  <div>
    <c-tab
      ref="patrolTab"
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
          :patrol="patrol"
          :attachInfo="attachInfo"
          :imprTabInfo="imprTabInfo"
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
import { patrolDetailType } from '@/views/sai/patrol/patrolType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'patrolDetailAppr'
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
    saiPatrolId: stringNull
    isApprContent: boolean
  }
  contentHeight: stringNull
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
      saiPatrolId: '',
      isApprContent: true
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
const patrol = ref<patrolDetailType>({
  saiPatrolId: '',
  plantCd: '',
  processCd: '',
  vendorCd: '',
  sopMapId: '',
  patrolTypeCd: '',
  patrolDate: '',
  patrolName: '',
  patrolResultCd: '',
  patrolResultSummary: '',
  patrolCompleteFlag: '',
  sopConstructionId: '',
  ramRiskAssessmentPlanId: '',
  approvalStatusCd: '',
  sysApprovalRequestId: '',
  results: [],
  deleteResults: [],
  imprs: []
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'PATROL_RESULT',
  taskKey: ''
})
const tab = ref('info')
const detailUrl = ref('')
const resultItemUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.saiPatrolId))
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
      label: '순회점검 정보',
      component: defineAsyncComponent(() => import(`@views/sai/patrol/patrolInfo.vue`)),
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
const disabled = computed(() => {
  return (
    patrol.value.patrolCompleteFlag === 'Y' ||
    // 결재중인 경우 비활성화
    (patrol.value.approvalStatusCd === 'ASC0000001' && props.popupParam.isApprContent)
  )
})
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.saiPatrolId,
    ibmTaskTypeCd: 'ITT0000065',
    ibmTaskUnderTypeCd: 'ITTU000105',
    requestContents: patrol.value.patrolName,
    disabled: disabled.value,
    isOld: isOld.value,
    isTable: false,
    gridItem: {
      listUrl: '',
      param: null,
      title: '점검항목별 개선목록',
      merge: [],
      data: _.filter(patrol.value.results, (result: any) => {
        return result.ibmTooltip
      }),
      columns: [
        {
          name: 'patrolItemName',
          field: 'patrolItemName',
          label: '점검항목',
          align: 'left',
          style: 'width:400px',
          sortable: false
        },
        {
          name: 'patrolResultName',
          field: 'patrolResultName',
          label: '점검결과',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'patrolContents',
          field: 'patrolContents',
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
  detailUrl.value = selectConfig.sai.patrol.get.url
  resultItemUrl.value = selectConfig.sai.patrol.resultItem.list.url
  // code setting
  // list setting
  getDetail()
}
const getDetail = () => {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.saiPatrolId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(patrol.value, _result.data)
      attachInfo.value.taskKey = props.popupParam.saiPatrolId
      emits('setRegInfo', _result.data)
    })
  } else {
    patrol.value.patrolDate = getToday()
    patrol.value.patrolName = `${patrol.value.patrolDate} 순회점검`
    $http({
      url: resultItemUrl.value,
      method: 'GET',
      params: {
        plantCd: user.value.plantCd,
        useFlag: 'Y'
      }
    }).then((_result: any) => {
      _.forEach(_result.data, (_item) => {
        patrol.value.results.push({
          saiPatrolId: '',
          saiPatrolResultId: uid(),
          patrolItemName: _item.patrolItemName,
          patrolResultCd: 'PRCC000001',
          patrolContents: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      })
    })
  }
}
const closePopup = (data: object | any) => {
  emits('closePopup', data)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
