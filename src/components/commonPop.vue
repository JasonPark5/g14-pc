<template>
  <div>
    <c-search-box
      v-if="!noSearchboxTarget.includes(popupParam.targetKey)"
      ref="searchbox"
      @enter="getList"
    >
      <template v-slot:search>
        <!-- 업무별로 searchBox 추가해야 함.  targetKey만 바꾸고 나머진 동일 -->
        <userSearchBox
          ref="childRef"
          v-if="popupParam.targetKey === 'user'"
          :propsSearchParam="popupParam.searchParam"
        />
        <processSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'upProcess' || popupParam.targetKey === 'process'"
          :propsSearchParam="popupParam.searchParam"
        />
        <equipSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'equip'"
          :propsSearchParam="popupParam.searchParam"
        />
        <licenseSearchBox
          ref="childRef"
          :targetKey="popupParam.targetKey"
          v-else-if="popupParam.targetKey === 'license' || popupParam.targetKey === 'licenseKind'"
          :propsSearchParam="popupParam.searchParam"
        />
        <materialSearchBox
          ref="childRef"
          :targetKey="popupParam.targetKey"
          v-else-if="popupParam.targetKey === 'material' || popupParam.targetKey === 'materialType'"
          :propsSearchParam="popupParam.searchParam"
        />
        <materialProcessSearchBox
          ref="childRef"
          :targetKey="popupParam.targetKey"
          v-else-if="popupParam.targetKey === 'materialProcess'"
          :propsSearchParam="popupParam.searchParam"
        />
        <chemBaseSearchBox ref="childRef" v-else-if="popupParam.targetKey === 'chemBase'" />
        <vendorSearchBox
          ref="childRef"
          :targetKey="popupParam.targetKey"
          v-else-if="popupParam.targetKey === 'vendor' || popupParam.targetKey === 'vendorUser'"
          :propsSearchParam="popupParam.searchParam"
        />
        <seniorSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'senior'"
          :propsSearchParam="popupParam.searchParam"
        />
        <lawSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'law'"
          :targetKey="popupParam.targetKey"
        />
        <lawRegisterSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'lawRegister'"
          :propsSearchParam="popupParam.searchParam"
        />
        <eduCourseSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'eduCourse'"
          :propsSearchParam="popupParam.searchParam"
        />
        <mocSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'moc'"
          :propsSearchParam="popupParam.searchParam"
        />
        <chemMaterialSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'chemMaterial'"
          :propsSearchParam="popupParam.searchParam"
        />
        <sopSearchBox
          ref="childRef"
          v-else-if="
            ['sop1', 'sop2', 'sop3', 'sop4', 'sop5', 'sop6', 'sop7'].indexOf(popupParam.targetKey) >
            -1
          "
          :propsSearchParam="popupParam.searchParam"
        />
        <workPermitSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'workPermit'"
          :propsSearchParam="popupParam.searchParam"
        />
        <eduSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'edu'"
          :propsSearchParam="popupParam.searchParam"
        />
        <constructionSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'construction'"
          :propsSearchParam="popupParam.searchParam"
        />
        <chemReviewSearchBox ref="childRef" v-else-if="popupParam.targetKey === 'chemReview'" />
        <eduQuizSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'eduQuiz'"
          :propsSearchParam="popupParam.searchParam"
        />
        <checkupSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'checkup'"
          :propsSearchParam="popupParam.searchParam"
        />
        <hazardFactorSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'hazardFactor'"
          :propsSearchParam="popupParam.searchParam"
        />
        <facilitySearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'facility'"
          :propsSearchParam="popupParam.searchParam"
        />
        <regulSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'regul'"
          :propsSearchParam="popupParam.searchParam"
        />
        <riskRelationDocuSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'riskRelationDocu'"
          :propsSearchParam="popupParam.searchParam"
        />
        <nearAccidentSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'nearAccident'"
          :propsSearchParam="popupParam.searchParam"
        />
        <accidentSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'accident'"
          :propsSearchParam="popupParam.searchParam"
        />
        <complianceSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'compliance'"
          :propsSearchParam="popupParam.searchParam"
        />
        <ghsSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'ghsHarmfulRiskClass'"
          :propsSearchParam="popupParam.searchParam"
        />
        <riskAssessmentSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'riskAssessment'"
          :propsSearchParam="popupParam.searchParam"
        />
        <emergencyActionPlanSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'emergencyActionPlan'"
          :propsSearchParam="popupParam.searchParam"
        />
        <trainingScenarioSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'trainingScenario'"
          :propsSearchParam="popupParam.searchParam"
        />
        <hazardStorageSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'hazardStorage'"
          :propsSearchParam="popupParam.searchParam"
        />
        <fireFightingEquipSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'fireFightingEquip'"
          :propsSearchParam="popupParam.searchParam"
        />
        <dangerStorageChecklistSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'dangerStorageChecklist'"
          :propsSearchParam="popupParam.searchParam"
        />
        <trainingSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'training'"
          :propsSearchParam="popupParam.searchParam"
        />
        <seniorStatusSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'seniorStatus'"
          :propsSearchParam="popupParam.searchParam"
        />
        <hazardequipSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'hazardequip'"
          :propsSearchParam="popupParam.searchParam"
        />
        <tbmSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'tbm'"
          :propsSearchParam="popupParam.searchParam"
        />
        <patrolSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'patrol'"
          :propsSearchParam="popupParam.searchParam"
        />
        <vendorAssessSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'vendorAssess'"
          :propsSearchParam="popupParam.searchParam"
        />
        <imprSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'impr'"
          :propsSearchParam="popupParam.searchParam"
        />
        <workMeasureSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'workMeasure'"
          :propsSearchParam="popupParam.searchParam"
        />
        <riskHazardSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'riskHazard'"
          :propsSearchParam="popupParam.searchParam"
        />
        <forkLiftSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'heqfork'"
          :propsSearchParam="popupParam.searchParam"
        />
        <closedSpaceSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'closedSpace'"
          :propsSearchParam="popupParam.searchParam"
        />
        <ghgFacilityEquipmentSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'ghgFacilityEquipment'"
          :propsSearchParam="popupParam.searchParam"
        />
        <ghgFacilitySearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'ghgFacility'"
          :propsSearchParam="popupParam.searchParam"
        />
        <AirOutletSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'airOutlet'"
          :propsSearchParam="popupParam.searchParam"
        />
        <AirPreventiveSearchBox
          ref="childRef"
          v-else-if="
            popupParam.targetKey === 'airPreventive' || popupParam.targetKey === 'airDischarge'
          "
          :propsSearchParam="popupParam.searchParam"
        />
        <AirInspectItemMstSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'airInspectItemMst'"
          :propsSearchParam="popupParam.searchParam"
        />
        <checkupOpinionSearchBox
          ref="childRef"
          v-else-if="popupParam.targetKey === 'checkupOpinion'"
          :propsSearchParam="popupParam.searchParam"
        />
      </template>
    </c-search-box>
    <c-table
      ref="commonTable"
      :title="`${popupParam.mainTitle} 목록`"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="grid.height"
      :selection="popupParam.type"
      :rowKey="popupParam.tableRowKey"
      :columnSetting="
        typeof popupParam.tableSetting?.columnSetting === 'boolean'
          ? popupParam.tableSetting.columnSetting
          : false
      "
      :isExcelDown="
        typeof popupParam.tableSetting?.isExcelDown === 'boolean'
          ? popupParam.tableSetting.isExcelDown
          : false
      "
      :isFullScreen="
        typeof popupParam.tableSetting?.isFullScreen === 'boolean'
          ? popupParam.tableSetting.isFullScreen
          : false
      "
      :hideBottom="
        typeof popupParam.tableSetting?.hideBottom === 'boolean'
          ? popupParam.tableSetting.hideBottom
          : false
      "
      :hideHeader="
        typeof popupParam.tableSetting?.hideHeader === 'boolean'
          ? popupParam.tableSetting.hideHeader
          : false
      "
      :usePaging="
        typeof popupParam.tableSetting?.usePaging === 'boolean'
          ? popupParam.tableSetting.usePaging
          : true
      "
      :isExpand="
        typeof popupParam.tableSetting?.isExpand === 'boolean'
          ? popupParam.tableSetting.isExpand
          : false
      "
      :isTitle="
        typeof popupParam.tableSetting?.isTitle === 'boolean'
          ? popupParam.tableSetting.isTitle
          : true
      "
      :filtering="
        typeof popupParam.tableSetting?.filtering === 'boolean'
          ? popupParam.tableSetting.filtering
          : true
      "
      @linkClick="linkClick"
      @rowDblclick="rowDblclick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="!noSearchboxTarget.includes(popupParam.targetKey)"
            label="검색"
            icon="search"
            @btnClicked="getList"
          />
          <c-btn label="선택" icon="check" @btnClicked="select" />
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
import { ref, onMounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { forEach } from 'lodash-es'

import * as popupVues from '@utils/popup'
import { $http } from '@utils/http'
import { targetLiteralType } from '@/common/utils/taskTarget'

import { popupParamType } from '@/types/popupParam'
import { arrayObject, arrayString } from '@/types/variable'

import equipSearchBox from '@/components/searchBox/equipSearchBox.vue'
import processSearchBox from '@/components/searchBox/processSearchBox.vue'
import licenseSearchBox from '@/components/searchBox/licenseSearchBox.vue'
import materialSearchBox from '@/components/searchBox/materialSearchBox.vue'
import materialProcessSearchBox from '@/components/searchBox/materialProcessSearchBox.vue'
import chemBaseSearchBox from '@/components/searchBox/chemBaseSearchBox.vue'
import vendorSearchBox from '@/components/searchBox/vendorSearchBox.vue'
import userSearchBox from '@/components/searchBox/userSearchBox.vue'
import seniorSearchBox from './searchBox/seniorSearchBox.vue'
import lawSearchBox from '@/components/searchBox/lawSearchBox.vue'
import lawRegisterSearchBox from '@/components/searchBox/lawRegisterSearchBox.vue'
import eduCourseSearchBox from '@/components/searchBox/eduCourseSearchBox.vue'
import mocSearchBox from '@/components/searchBox/mocSearchBox.vue'
import chemMaterialSearchBox from '@/components/searchBox/chemMaterialSearchBox.vue'
import sopSearchBox from '@/components/searchBox/sopSearchBox.vue'
import workPermitSearchBox from '@/components/searchBox/workPermitSearchBox.vue'
import eduSearchBox from '@/components/searchBox/eduSearchBox.vue'
import constructionSearchBox from '@/components/searchBox/constructionSearchBox.vue'
import chemReviewSearchBox from '@/components/searchBox/chemReviewSearchBox.vue'
import eduQuizSearchBox from '@/components/searchBox/eduQuizSearchBox.vue'
import checkupSearchBox from '@/components/searchBox/checkupSearchBox.vue'
import hazardFactorSearchBox from '@/components/searchBox/hazardFactorSearchBox.vue'
import facilitySearchBox from '@/components/searchBox/facilitySearchBox.vue'
import regulSearchBox from '@/components/searchBox/regulSearchBox.vue'
import riskRelationDocuSearchBox from '@/components/searchBox/riskRelationDocuSearchBox.vue'
import nearAccidentSearchBox from '@/components/searchBox/nearAccidentSearchBox.vue'
import accidentSearchBox from '@/components/searchBox/accidentSearchBox.vue'
import complianceSearchBox from '@/components/searchBox/complianceSearchBox.vue'
import riskAssessmentSearchBox from '@/components/searchBox/riskAssessmentSearchBox.vue'
import emergencyActionPlanSearchBox from '@/components/searchBox/emergencyActionPlanSearchBox.vue'
import trainingScenarioSearchBox from '@/components/searchBox/trainingScenarioSearchBox.vue'
import hazardStorageSearchBox from './searchBox/hazardStorageSearchBox.vue'
import fireFightingEquipSearchBox from './searchBox/fireFightingEquipSearchBox.vue'
import dangerStorageChecklistSearchBox from './searchBox/dangerStorageChecklistSearchBox.vue'
import trainingSearchBox from './searchBox/trainingSearchBox.vue'
import seniorStatusSearchBox from './searchBox/seniorStatusSearchBox.vue'
import hazardequipSearchBox from '@/components/searchBox/hazardequipSearchBox.vue'
import tbmSearchBox from '@/components/searchBox/tbmSearchBox.vue'
import patrolSearchBox from '@/components/searchBox/patrolSearchBox.vue'
import vendorAssessSearchBox from '@/components/searchBox/vendorAssessSearchBox.vue'
import imprSearchBox from '@/components/searchBox/imprSearchBox.vue'
import workMeasureSearchBox from '@/components/searchBox/workMeasureSearchBox.vue'
import riskHazardSearchBox from '@/components/searchBox/riskHazardSearchBox.vue'
import ghsSearchBox from '@/components/searchBox/ghsSearchBox.vue'
import forkLiftSearchBox from '@/components/searchBox/forkLiftSearchBox.vue'
import closedSpaceSearchBox from '@/components/searchBox/closedSpaceSearchBox.vue'
import ghgFacilityEquipmentSearchBox from '@/components/searchBox/ghgFacilityEquipmentSearchBox.vue'
import ghgFacilitySearchBox from '@/components/searchBox/ghgFacilitySearchBox.vue'
import AirOutletSearchBox from './searchBox/airOutletSearchBox.vue'
import AirInspectItemMstSearchBox from './searchBox/airInspectItemMstSearchBox.vue'
import AirPreventiveSearchBox from './searchBox/airPreventiveSearchBox.vue'
import checkupOpinionSearchBox from './searchBox/checkupOpinionSearchBox.vue'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'commonPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
  popupParam: commonParamType
  contentHeight?: string | number
}
interface commonParamType {
  type: string
  targetKey: targetLiteralType
  plantCd?: string | null
  listUrl: string
  tableRowKey: string
  detailParams: arrayString | undefined | null
  mainTitle: string
  searchParam?: any
  columnArray: arrayObject | Array<tableMergeType> | undefined | null
  linkFieldName: string
  searchConditions: arrayString | undefined | null
  tableSetting?: {
    hideBottom?: boolean
    hideHeader?: boolean
    usePaging?: boolean
    isExpand?: boolean
    isTitle?: boolean
    filtering?: boolean
    isExcelDown?: boolean
    isFullScreen?: boolean
    columnSetting?: boolean
  }
}
interface gridType {
  columns?: Array<tableColumnType>
  data?: Array<any>
  merge?: Array<tableMergeType>
  height?: string
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
      type: 'multiple',
      targetKey: 'equip',
      plantCd: null,
      listUrl: '',
      tableRowKey: '',
      detailParams: undefined,
      mainTitle: '',
      searchParam: { plantCd: null, useFlag: 'Y' },
      columnArray: undefined,
      linkFieldName: '',
      searchConditions: undefined
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  top: '',
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const listUrl = ref('')
const searchbox = ref<any>(null)
const commonTable = ref<any>(null)
const grid = ref<gridType>({
  columns: [],
  data: [],
  merge: [],
  height: '580px'
})
const noSearchboxTarget = ref([
  'closedEquip',
  'dangerItem',
  'lawCode',
  'envOnlyProcess',
  'wasteMst',
  'waterInspectItemMst',
  'dept',
  'internalAuditChecklist',
  'safetyGear',
  'fireFightingLocation',
  'airInspectItem',
  'airMaterial',
  'airWattmeter',
  'hazardChem'
])
const childRef = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
// const keyCount = computed(() => Object.keys(reactive(childRef.value.searchParam)).length)

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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  listUrl.value = props.popupParam.listUrl
  // code setting
  // list setting
  setColumns()
  // grid.value.height = keyCount.value > 4 ? '450px' : '580px'
  setMerge()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getList() {
  if (searchbox.value) {
    searchbox.value.validation().then((result: boolean) => {
      if (result) {
        _.extend(props.popupParam.searchParam, { useFlag: 'Y' })
        $http({
          url: listUrl.value,
          method: 'GET',
          params: childRef.value ? childRef.value.searchParam : props.popupParam.searchParam
        }).then((_result: any) => {
          grid.value.data = _result.data
        })
      } else {
        grid.value.data = []
      }
    })
  } else {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: props.popupParam.searchParam
    }).then((_result: any) => {
      grid.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 테이블 컬럼 정의
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setColumns() {
  if (props.popupParam.columnArray && props.popupParam.columnArray.length >= 3) {
    const propsFields: any = props.popupParam.columnArray[0]
    const propsLabels: any = props.popupParam.columnArray[1]
    const propsAligns: any = props.popupParam.columnArray[2]
    const propsStyle: any = props.popupParam.columnArray[4]
    const haveStyle = propsStyle && propsStyle.length > 0
    const gridColumns = []
    for (let i = 0; i <= propsFields.length - 1; i++) {
      let colStyle = ''
      if (haveStyle) {
        colStyle = _.find(propsStyle, { colName: String(propsFields[i]) })?.style || ''
      }
      gridColumns.push({
        name: String(propsFields[i]),
        field: String(propsFields[i]),
        label: propsLabels[i],
        align: propsAligns[i],
        type: String(propsFields[i]) === props.popupParam.linkFieldName ? 'link' : null,
        style: colStyle,
        sortable: false
      })
    }
    grid.value.columns = gridColumns
    getList()
  }
}
/******************************
 * TODO (목적): 테이블 rowspan
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function setMerge() {
  if (props.popupParam.columnArray && props.popupParam.columnArray.length >= 4) {
    const mergeInfos: Array<tableMergeType> = props.popupParam.columnArray[3]
    if (mergeInfos && mergeInfos.length > 0) {
      grid.value.merge = mergeInfos
    }
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function select() {
  const selectData = commonTable.value.getSelected()

  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning'
    })
  } else {
    emits('closePopup', selectData)
  }
}
/******************************
 * TODO (목적): 공통 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: any) {
  if (props.popupParam.targetKey === 'law') {
    window.open(
      'http://www.law.go.kr' + row[props.popupParam.detailParams![0]],
      '법규',
      'width=1200, height=800'
    )
  } else if (props.popupParam.linkFieldName) {
    popupOptions.value.title = props.popupParam.mainTitle + ' 상세'
    if (props.popupParam.detailParams && props.popupParam.detailParams.length > 0) {
      forEach(props.popupParam.detailParams, (_item: string) => {
        popupOptions.value.param![_item] = row[_item]
      })
    }
    popupOptions.value.target = shallowRef(popupVues[`${props.popupParam.targetKey}Detail`])
    popupOptions.value.visible = true
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
    popupOptions.value.closeCallback = closePopup
  }
}
/******************************
 * TODO (목적): 상세 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 행 더블 클릭 시 해당 행 정보 emit (단일 선택인 경우만)
 * @param (1): 행 정보
 *******************************/
function rowDblclick(row: any) {
  if (props.popupParam.type === 'single') {
    emits('closePopup', [row])
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
