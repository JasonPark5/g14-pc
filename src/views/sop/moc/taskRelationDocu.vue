<template>
  <div>
    <c-search-box v-if="popupParam.mocRelatedTaskCd === 'RT00000001'" @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="psiKindItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="diagramClassCd"
            label="분류"
            v-model:value="searchParam.diagramClassCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="taskTable"
      title="관련업무 목록"
      :columns="popupParam.columns"
      :data="grid.data"
      :gridHeight="grid.height"
      selection="multiple"
      rowKey="documentId"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="popupParam.mocRelatedTaskCd === 'RT00000001'"
            label="검색"
            icon="search"
            @btnClicked="getList"
          />
          <c-btn v-if="editable" label="선택" icon="check" @btnClicked="selectTask" />
        </q-btn-group>
      </template>
    </c-table>
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
import { relatedWorkDocumnetType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'taskRelationDocu'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    type: string
    mocRelatedTaskCd: string
    columns: Array<tableColumnType>
  }
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
      type: 'multiple',
      mocRelatedTaskCd: '',
      columns: []
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
  width: '60%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  data: [],
  height: '650px'
})
const searchParam = ref({
  // plantCd: null,
  diagramClassCd: null
})
const diagKindItems = ref<Array<codeMasterType>>([])
const docuKindItems = ref<Array<codeMasterType>>([])
const listUrl = ref('')
const listDiagKindUrl = ref('')
const listDocuKindUrl = ref('')
const taskTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const psiKindItems = computed(() => {
  let items = [
    {
      code: 'DT00000010',
      codeName: $language('동력기계')
    },
    {
      code: 'DT00000015',
      codeName: $language('장치 및 설비')
    },
    {
      code: 'DT00000020',
      codeName: $language('배관 및 개스킷')
    },
    {
      code: 'DT00000025',
      codeName: $language('안전밸브 및 파열판')
    }
  ]
  if (diagKindItems.value && diagKindItems.value.length > 0) {
    items = _.concat(items, diagKindItems.value)
  }
  if (docuKindItems.value && docuKindItems.value.length > 0) {
    items = _.concat(items, docuKindItems.value)
  }
  return items
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
  switch (props.popupParam.mocRelatedTaskCd) {
    case 'RT00000001': // 공정안전자료 업데이트
      listUrl.value = selectConfig.sop.moc.relationWorkDocu.case1.list.url
      listDiagKindUrl.value = selectConfig.psi.diagramkind.url
      listDocuKindUrl.value = selectConfig.psi.documentkind.url
      getDiagKind()
      getDocuKind()
      break
    case 'RT00000005': // 위험성평가 결과
      listUrl.value = selectConfig.sop.moc.relationWorkDocu.case2.list.url
      break
    case 'RT00000010': // 교육 결과
      listUrl.value = selectConfig.sop.moc.relationWorkDocu.case3.list.url
      break
    case 'RT00000015': // 가동전 점검 결과
      listUrl.value = selectConfig.sop.moc.relationWorkDocu.case4.list.url
      break
    case 'RT00000020': // 안전작업 허가서
      listUrl.value = selectConfig.sop.moc.relationWorkDocu.case5.list.url
      break
    case 'RT00000030': // 인허가
      listUrl.value = selectConfig.sop.moc.relationWorkDocu.case6.list.url
      break
    default:
      break
  }
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 관련업무 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 도면 종류 조회
 *******************************/
function getDiagKind() {
  $http({
    url: listDiagKindUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    diagKindItems.value = _.map(_result.data, (item) => {
      return {
        codeName: item.diagramKindName,
        code: 'DIAG_' + item.diagramClassCd
      }
    })
  })
}
/******************************
 * TODO (목적): 문서 종류 조회
 *******************************/
function getDocuKind() {
  $http({
    url: listDocuKindUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    docuKindItems.value = _.map(_result.data, (item) => {
      return {
        codeName: item.documentKindName,
        code: 'DOCU_' + item.documentClassCd
      }
    })
  })
}
/******************************
 * TODO (목적): 실시업무 상세 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: relatedWorkDocumnetType) {
  if (props.popupParam.mocRelatedTaskCd == 'RT00000001') {
    // 공정안전자료 업데이트
    if (row.documentTypeCd == 'DT00000010') {
      // 동력기계
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pfi/powerMachineDetail.vue`))
      )
      popupOptions.value.title = '동력기계 상세'
      popupOptions.value.param = {
        psiPowerEquipmentId: row ? row.documentId : ''
      }
    } else if (row.documentTypeCd == 'DT00000015') {
      // 장치 및 설비
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pfi/deviceEquipmentDetail.vue`))
      )
      popupOptions.value.title = '장치 및 설비 상세'
      popupOptions.value.param = {
        psiDeviceEquipmentId: row ? row.documentId : ''
      }
    } else if (row.documentTypeCd == 'DT00000020') {
      // 배관 및 개스킷
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pfi/pipingGasketsDetail.vue`))
      )
      popupOptions.value.title = '배관 및 개스킷 상세'
      popupOptions.value.param = {
        psiPipeGasketId: row ? row.documentId : ''
      }
    } else if (row.documentTypeCd == 'DT00000025') {
      // 안전밸브 및 파열판
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pfi/safetyValveRuptureDiskDetail.vue`))
      )
      popupOptions.value.title = '안전밸브 및 파열판 상세'
      popupOptions.value.param = {
        psiValveRuptureId: row ? row.documentId : ''
      }
    } else if (row.documentTypeCd == 'DT00000001') {
      // 도면
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/pidMasterDetail.vue`))
      )
      popupOptions.value.title = $language('상세') + ' [' + row.classification + ']'
      popupOptions.value.param = {
        psiDiagramId: row ? row.documentId : null,
        diagramClassCd: row.diagramClassCd,
        title: row.documentTitle
      }
    } else if (row.documentTypeCd == 'DT00000005') {
      // 문서
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`@views/psi/documentMasterDetail.vue`))
      )
      popupOptions.value.title = $language('상세') + ' [' + row.classification + ']'
      popupOptions.value.param = {
        psiDocumentId: row ? row.documentId : null,
        diagramClassCd: row.diagramClassCd,
        title: row.documentTitle
      }
    }
    popupOptions.value.width = '80%'
    popupOptions.value.isFull = false
  } else if (props.popupParam.mocRelatedTaskCd == 'RT00000005') {
    // 위험성평가 결과
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/ram/riskDetail.vue`))
    )
    popupOptions.value.title = '위험성평가 상세'
    popupOptions.value.param = {
      ramRiskAssessmentPlanId: row ? row.documentId : '',
      ramStepCd: row ? row.ramStepCd : 'RRS0000001',
      vendorFlag: row ? row.vendorFlag > 0 : false,
      ramTechniqueCd: row ? row.ramTechniqueCd : ''
    }
    popupOptions.value.width = '95%'
  } else if (props.popupParam.mocRelatedTaskCd == 'RT00000010') {
    // 교육 결과
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/edu/result/educationResultDetail.vue`))
    )
    popupOptions.value.title = '교육계획 및 결과 상세'
    popupOptions.value.param = {
      eduEducationId: row ? row.documentId : '',
      stepCd: row.ramStepCd === 'ESC000001' ? 'ESC0000005' : 'ESC0000010'
    }
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
  } else if (props.popupParam.mocRelatedTaskCd == 'RT00000015') {
    // 가동전 점검 결과
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/psr/preStartupReviewDetail.vue`))
    )
    popupOptions.value.title = '가동전점검 상세'
    popupOptions.value.param = {
      sopPrestartupCheckId: row ? row.documentId : ''
    }
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
  } else if (props.popupParam.mocRelatedTaskCd == 'RT00000020') {
    // 안전작업 허가서
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/swp/safeWorkPermitDetail.vue`))
    )
    popupOptions.value.title = '안전작업 허가서 상세'
    popupOptions.value.param = {
      sopWorkPermitId: row ? row.documentId : '',
      permitTypeCd: row ? row.ramStepCd : ''
    }
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
  } else if (props.popupParam.mocRelatedTaskCd == 'RT00000030') {
    // 인허가
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/lim/licenseStatusDetail.vue`))
    )
    popupOptions.value.title = '인허가 상세'
    popupOptions.value.param = {
      limLicenseId: row ? row.documentId : null
    }
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
  }

  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopupLink
}
/******************************
 * TODO (목적): 실시업무 상세 팝업 닫기
 *******************************/
function closePopupLink() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 관련업무 선택
 *******************************/
function selectTask() {
  const selectData = taskTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '하나 이상 선택하세요',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', selectData)
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
