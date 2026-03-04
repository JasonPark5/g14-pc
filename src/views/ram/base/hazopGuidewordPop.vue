<template>
  <div>
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        dense
        dark
        icon="place"
        header-class="bg-blue-grey-6 text-white"
        expand-icon-class="text-white"
        :label="$language('노드 정보')"
      >
        <q-separator />
        <q-card class="q-pa-sm">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-label-text
                title="노드"
                :value="props.popupParam.node.nodeTitle + '(' + props.popupParam.node.nodeNo + ')'"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-label-text
                title="검토기간"
                :value="
                  props.popupParam.node.startStudyDate + '~' + props.popupParam.node.endStudyDate
                "
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-label-text :row="2" title="노드설명" :value="props.popupParam.node.nodeDesc" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-label-text
                :row="2"
                title="설계조건"
                :value="props.popupParam.node.designConditions"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-label-text
                :row="2"
                title="작동조건"
                :value="props.popupParam.node.operatingConditions"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-label-text :row="2" title="설계의도" :value="props.popupParam.node.designIntent" />
            </div>
          </div>
        </q-card>
      </q-expansion-item>
    </q-list>
    <c-table
      ref="table"
      class="q-mt-sm"
      title="구간별 가이드워드"
      :columns="grid.columns"
      :data="grid.data"
      :gridHeight="grid.height"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :hideBottom="true"
      rowKey="ramVariableId"
      :contentsField="contentsField"
      @changeSelection="changeSelection"
      :selection="props.popupParam.type"
      @rowDblclick="rowDblclick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="선택" icon="check" @btnClicked="select" />
        </q-btn-group>
      </template>
    </c-table>
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
import { hazopNodeType } from './hazopGuideword'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazopGuidewordPop'
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
    type: stringNull
    guideWordItems: Array<any> | null | undefined
    data: Array<any> | null | undefined
    node: hazopNodeType
    ramRiskAssessmentPlanId: stringNull
  }
  contentHeight: stringNull | numberNull
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
      guideWordItems: [],
      data: [],
      node: {
        ramAssessNodeId: '', // 노드 일련번호
        ramRiskAssessmentPlanId: '', // 평가 일련번호
        ramTechniqueCd: '', // 평가기법 코드_HAZOP, K-PSR 구분(평가계획의 평가기법 코드 그대로 사용)
        processCd: '', // 단위공정 코드
        psiDiagramId: '', // 도면 일련번호
        nodeNo: '', // 노드 번호_수기입력
        nodeTitle: '', // 노드 타이틀
        nodeDesc: '', // 노드 설명
        designConditions: '', // 설계조건
        operatingConditions: '', // 작동조건
        designIntent: '', // 설계의도
        startStudyDate: '', // 검토 시작일
        endStudyDate: '', // 검토 종료일
        scenarios: []
      },
      ramRiskAssessmentPlanId: ''
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
const editable = ref(true)
const grid = ref({
  columns: [] as any,
  data: [],
  height: '600px'
})
const listUrl = ref('')
const defaultData = ref<any>([])
const table = ref<any>(null)
const selectedGw = ref<any>([])
const selectedIndexs = ref<any>([])

/******************************
 * @Computed_선언
 *******************************/

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
  listUrl.value = selectConfig.ram.variable.list.url
  // code setting
  const guideword = ref<any>([])
  _.forEach(props.popupParam.guideWordItems, (item) => {
    guideword.value.push({
      name: item.code,
      field: item.code,
      label: item.codeName,
      align: 'center',
      sortable: true,
      selectionAble: true,
      type: 'check',
      true: 'Y',
      false: 'N'
    })
  })
  grid.value.columns = [
    {
      name: 'variableName',
      field: 'variableName',
      label: '변수',
      align: 'center',
      sortable: true
    },
    {
      name: 'guideword',
      field: 'guideword',
      label: '가이드워드',
      align: 'center',
      child: guideword
    }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y',
      ramRiskAssessmentPlanId: props.popupParam.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    defaultData.value = _result.data
    _.forEach(defaultData.value, (item) => {
      const ramVariableGuidewordIds = _.split(item.ramVariableGuidewordIds, ',')
      if (ramVariableGuidewordIds && ramVariableGuidewordIds.length > 0) {
        _.forEach(ramVariableGuidewordIds, (ramVariableGuidewordId) => {
          const splitData = _.split(ramVariableGuidewordId, '|')
          item[splitData[1] + '_use'] = 'Y'
          item[splitData[1] + '_id'] = splitData[0]
        })
      }
    })

    setGridData()
  })
}

/******************************
 * TODO (목적): 그리드 데이터
 *******************************/
function setGridData() {
  let dataIndex = 0
  _.forEach(defaultData.value, (item) => {
    _.forEach(props.popupParam.guideWordItems, (gw) => {
      const _index = _.findIndex(props.popupParam.data, (k) => {
        return k.deviationName === item.variableName + ' - ' + gw.codeName
      })
      if (_index > -1) {
        item[gw.code] = 'Y'
        selectedIndexs.value.push(dataIndex)
      } else {
        item[gw.code] = 'N'
      }
    })
    dataIndex++
  })
  selectedIndexs.value = _.uniq(selectedIndexs.value)
  _.forEach(selectedIndexs.value, (index) => {
    selectedGw.value.push(defaultData.value[index])
  })
  // this.$refs['table'].selected = selected
  grid.value.data = _.clone(defaultData.value)
  table.value.setSelected(selectedGw.value)
}
/******************************
 * TODO (목적): 선택
 *******************************/
function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '위험형태를 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', selectData)
  }
}
/******************************
 * TODO (목적): Row 더블클릭
 *******************************/
function rowDblclick(_row: any) {
  if (props.popupParam.type === 'single') {
    emits('closePopup', [_row])
  }
}
/******************************
 * TODO (목적): 필드값 여부
 *******************************/
function contentsField(_props: any, _col: any) {
  let returnVal = true
  if (_col.name !== 'variableName') {
    returnVal = _props.row[_col.name + '_use'] === 'Y'
  }
  return returnVal
}
/******************************
 * TODO (목적): 선택 변경
 *******************************/
function changeSelection(_detail: any) {
  const keys = _detail.keys
  if (keys && keys[0] && !_detail.added) {
    _.forEach(grid.value.data, (_item: any) => {
      if (_item.ramVariableId === keys[0]) {
        _.forEach(props.popupParam.guideWordItems, (_guideword: any) => {
          _item[_guideword.code] = 'N'
        })
        return false
      }
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
