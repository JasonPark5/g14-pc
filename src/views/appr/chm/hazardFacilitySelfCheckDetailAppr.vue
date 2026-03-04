<template>
  <div>
    <c-tab
      ref="selfCheckTab"
      type="horizon"
      :inlineLabel="true"
      :dense="true"
      :height="tabHeight"
      :tabItems="tabItems"
      v-model:value="tab"
    >
      <!-- :attachInfo="attachInfo" -->
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :selfCheck="selfCheck"
          :imprTabInfo="imprTabInfo"
          :disabled="disabled"
          :isOld="isOld"
          :height="tabHeight"
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
import { selfcheck } from '@/views/chm/hcf/hazardFacility'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardFacilitySelfCheckDetailAppr'
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
    hcfHazardFacilitySelfCheckId: stringNull
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
      hcfHazardFacilitySelfCheckId: '',
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
const selfCheck = ref<selfcheck>({
  hcfHazardFacilitySelfCheckId: '', // 유해화학자재 취급시설 자체점검 번호
  hcfHazardFacilitySelfCheckResultId: '',
  plantCd: null, // 사업장코드
  selfCheckName: '', // 점검명
  selfCheckItemName: '',
  facilityCd: '', // 시설 코드
  facilityNo: '', // 시설관리번호
  facilityName: '', // 시설명
  hcfFacilityTypeName: '', // 시설유형
  selfCheckDate: '', // 자체점검일
  startTime: '', // 점검시작시간
  endTime: '', // 점검종료시간
  time: [] as Array<string>, // 점검시간
  deptCd: '', // 주관부서 코드
  deptName: '', // 주관부서명
  selfCheckUserId: '', // 점검자id
  selfCheckUserName: '', // 점검자
  hcfSelfCheckCompleteFlag: '', // 개선진행상태
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  selfCheckItemResults: [], // 자체점검 항목 결과
  materialNames: '',
  deleteCheckResults: [],
  //hcfSelfCheckProgressCompleteFlag: '',
  approvalStatusCd: '', // 결재관련 결재상태
  hcfApprovalRequestId: '', // 결재관련 결재요청코드
  sysApprovalRequestId: ''
})
// const attachInfo = ref({
//   isSubmit: '',
//   taskClassCd: 'PATROL_RESULT',
//   taskKey: ''
// })
const tab = ref('info')
const detailUrl = ref('')
const resultItemUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.hcfHazardFacilitySelfCheckId))
const tabHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight) ? Number(props.contentHeight) : 800
  if (height < 800) height = 800
  return height + 'px'
})
const tabItems = computed(() => {
  const items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'edit',
      label: '점검 정보',
      component: defineAsyncComponent(
        () => import(`@/views/chm/hcf/hazardFacilitySelfCheckInfo.vue`)
      ),
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
    selfCheck.value.hcfSelfCheckCompleteFlag === 'Y' ||
    Boolean(selfCheck.value.sysApprovalRequestId)
    // || props.popupParam.isApprContent
  )
})
const imprTabInfo = computed(() => {
  return {
    key: props.popupParam.hcfHazardFacilitySelfCheckId,
    ibmTaskTypeCd: 'ITT0000245',
    ibmTaskUnderTypeCd: 'ITTU000270',
    requestContents: selfCheck.value.selfCheckName,
    disabled: disabled.value,
    isOld: isOld.value,
    isTable: false,
    gridItem: {
      listUrl: '',
      param: null,
      title: '점검항목별 개선목록',
      merge: [],
      data: _.filter(selfCheck.value.selfCheckItemResults, (result: any) => {
        return result.ibmTooltip
      }),
      columns: [
        {
          name: 'selfCheckItemName',
          field: 'selfCheckItemName',
          label: '점검항목',
          align: 'left',
          style: 'width:300px',
          sortable: false
        },
        {
          name: 'hcfAbnormalityCdName',
          field: 'hcfAbnormalityCdName',
          label: '이상유무',
          align: 'center',
          style: 'width:160px',
          sortable: false
        },
        {
          name: 'remark',
          field: 'remark',
          label: '비고',
          align: 'left',
          style: 'width:200px',
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
  detailUrl.value = selectConfig.env.facilitySelfCheck.get.url
  resultItemUrl.value = selectConfig.env.facilitySelfCheck.item.url
  // listUrl.value = selectConfig.env.facilitySelfCheckItem.list.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적) : 유해화학물질 취급시설 자체점검 상세 정보를 조회하거나 신규 등록 시 기본 점검항목 리스트를 불러오는 역할
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.hcfHazardFacilitySelfCheckId),
      method: 'GET'
    }).then((_result: any) => {
      _result.data.time = [_result.data.startTime, _result.data.endTime]
      selfCheck.value = _result.data
      //_.extend(selfCheck.value, _result.data)
      // attachInfo.value.taskKey = props.popupParam.saiPatrolId
      emits('setRegInfo', _result.data)
    })
  } else {
    selfCheck.value.selfCheckDate = getToday()
    selfCheck.value.selfCheckUserId = user.value.userId
    selfCheck.value.time = ['08:00', '17:00']
    $http({
      url: resultItemUrl.value,
      method: 'GET',
      params: { useFlag: 'Y' }
    }).then((_result: any) => {
      selfCheck.value.selfCheckItemResults = []
      _.forEach(_result.data, (_item) => {
        selfCheck.value.selfCheckItemResults!.push({
          hcfHazardFacilitySelfCheckId: props.popupParam.hcfHazardFacilitySelfCheckId,
          hcfHazardFacilitySelfCheckResultId: uid(),
          hcfHazardFacilitySelfCheckItemId: _item.hcfHazardFacilitySelfCheckItemId,
          selfCheckItemName: _item.selfCheckItemName,
          regUserId: user.value.userId,
          hcfAbnormalityCd: 'HA00000001',
          remark: '',
          editFlag: 'C'
        })
      })
    })
  }
}
function closePopup(data: object | any) {
  emits('closePopup', data)
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
