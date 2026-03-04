<template>
  <div>
    <c-card class="cardClassDetailInfo" :noHeader="true">
      <template v-slot:card-detail>
        <div class="col-2">
          <c-label-text title="사업장" :value="fireFighting.plantName" />
        </div>
        <div class="col-2">
          <c-label-text title="관리번호" :value="fireFighting.manageNo" />
        </div>
        <div class="col-2">
          <c-label-text title="설비유형" :value="fireFighting.sopFireFightingTypeName" />
        </div>
        <div class="col-2">
          <c-label-text title="설비종류" :value="fireFighting.sopFireFightingTypeName" />
        </div>
        <div class="col-4">
          <c-label-text title="소방설비 및 장비명" :value="fireFighting.fireFightingName" />
        </div>
      </template>
    </c-card>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table1"
          title="점검이력"
          :columns="grid.columns"
          :data="fireFighting.checks"
          :gridHeight="gridHeight"
          @linkClick="linkClick"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table2"
          title="소방화재수신기 작동이력"
          :columns="grid2.columns"
          :data="fireFighting.history"
          :gridHeight="gridHeight"
          @linkClick="linkClick"
        />
      </div>
    </div>
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
import { fireFightingType } from './fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingHistory'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopFireFightingId?: stringNull
  }
  contentHeight?: stringNull
  isOld?: boolean
  fireFighting?: fireFightingType
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
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
  popupParam: () => {
    return {
      sopFireFightingId: ''
    }
  },
  fireFighting: () => {
    return {
      sopFireFightingId: '', // 소방설비 일련번호
      plantCd: null, // 사업장
      plantName: null, // 사업장
      sopFireFightingTypeCd: null, // 유형
      sopFireFightingTypeName: null, // 유형
      sopFireFightingKindCd: null, // 점검 소방시설 종류
      sopFireFightingKindName: '', // 점검 소방시설 종류
      manageNo: '', // 관리번호
      fireFightingName: '', // 소방설비명
      deptCd: '', // 관리부서
      processCd: '', // 관련공정
      sopFireFightinhReplacementCycleCd: '', // 소방설비 교체 주기
      amount: '', // 수량
      chmDangerMstId: '', // 관련 위험물 저장소 일련번호
      location: '', // 설비위치
      installDate: '', // 설치일
      disposeFlag: 'N', // 폐기여부
      disposeDate: '', // 폐기일
      deleteFlag: 'N', // 삭제여부
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      replacementHistroies: [],
      deleteReplacementHistroies: [],
      checks: [],
      history: []
    }
  },
  isOld: false,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  columns: [
    {
      name: 'checkName',
      field: 'checkName',
      label: '점검명',
      align: 'left',
      sortable: true,
      style: 'width: 150px',
      type: 'link'
    },
    {
      name: 'sopFireFightingCheckTypeName',
      field: 'sopFireFightingCheckTypeName',
      style: 'width:100px',
      label: '점검유형',
      align: 'center',
      sortable: true
    },
    {
      name: 'sopFireFightingCheckStepName',
      field: 'sopFireFightingCheckStepName',
      label: '진행상태',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'checkPeriod',
      field: 'checkPeriod',
      label: '점검기간',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkResult',
      field: 'checkResult',
      style: 'width:100px',
      label: '점검결과',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'reportDate',
      field: 'reportDate',
      label: '보고일',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'fireFightingGroupName',
      field: 'fireFightingGroupName',
      label: '소방설비',
      align: 'left',
      sortable: true,
      style: 'width: 200px',
      type: 'link'
    },
    {
      name: 'repeater',
      field: 'repeater',
      label: '중계기 번호',
      align: 'center',
      sortable: true,
      style: 'width: 150px'
    },
    {
      name: 'location',
      field: 'location',
      label: '장소',
      align: 'center',
      sortable: true,
      style: 'width: 150px'
    }
  ],
  data: []
})
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 160 + 'px' : '500px'
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
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any, col: any) {
  if (col.name === 'checkName') {
    popupOptions.value.title = '소방설비 점검 상세'
    popupOptions.value.param = { sopFireFightingCheckId: row.sopFireFightingCheckId }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./fireFightingCheckDetail.vue`))
    )
  } else {
    popupOptions.value.title = '소방 화재수신기 작동 보고 상세'
    popupOptions.value.param = {
      sopFireFightingReceivingSetHistoryId: row.sopFireFightingReceivingSetHistoryId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(
        () => import(`@/views/fft/receiving/fireFightingReceivingSetHistoryDetail.vue`)
      )
    )
  }
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
