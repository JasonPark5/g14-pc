<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="useFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            label="사용여부"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="table"
          title="변수 목록"
          tableId="variable"
          :columns="grid.columns"
          :data="grid.data"
          gridHeight="770px"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          @rowClick="rowClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <q-form ref="editForm">
          <c-card title="변수 상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addData" />
                <c-btn
                  v-if="saveEditable"
                  :isSubmit="isSave"
                  :url="saveUrl"
                  :param="variable"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveVariable"
                  @btnCallback="saveVariableCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-4">
                <c-text
                  :disabled="!saveMode"
                  :editable="editable"
                  :required="true"
                  label="변수"
                  name="variableName"
                  v-model:value="variable.variableName"
                />
              </div>
              <!-- <div class="col-4">
                <c-plant
                  :disabled="!saveMode"
                  :editable="editable"
                  :required="true"
                  type="edit"
                  name="plantCd"
                  v-model:value="variable.plantCd"
                />
              </div> -->
              <div class="col-4">
                <c-radio
                  :disabled="!saveMode"
                  :editable="editable"
                  :comboItems="useFlagItems"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="variable.useFlag"
                />
              </div>
              <div class="col-12">
                <c-tab
                  type="tabcard"
                  align="left"
                  :tabItems="tabItems"
                  :inlineLabel="true"
                  :tabInCheck="true"
                  :disabled="!saveEditable"
                  height="574"
                  v-model:value="tab"
                  @changeCheckbox="changeCheckbox"
                >
                  <template v-slot:default="tab">
                    <component
                      :is="tab.component"
                      :variable="variable"
                      :ramVariableGuidewordCd="tab.name"
                      :label="tab.label"
                      :attrVal1="tab.attrVal1"
                      :disabled="!tab.check"
                    />
                  </template>
                </c-tab>
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>
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
import { variableType } from './hazopGuideword'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazopGuideword'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
/** message 호출 */
const message = useMessageStore()

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
interface searchParamType {
  plantCd: stringNull
  useFlag: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const searchParam = ref<searchParamType>({
  plantCd: null,
  useFlag: 'Y'
})
const useFlagItems = ref<codeMasterType>([])
const variable = ref<variableType>({
  ramVariableId: '', // 변수 번호
  plantCd: null,
  variableName: '', // 변수명
  useFlag: 'Y', // 사용여부
  sortOrder: '', // 순번
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  variableGuidewords: [], // 사용 가이드워드 목록
  deleteVariableGuidewords: [] // [삭제] 사용 가이드워드 목록
})
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'variableName',
      field: 'variableName',
      label: '변수',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:80px',
      sortable: true
    }
  ],
  data: []
})
const tab = ref('')
const tabItems = ref<any>([])
const listUrl = ref('')
const detailUrl = ref('')
const saveUrl = ref('')
const saveMode = ref(false)
const isSave = ref(false)
const mappingType = ref('POST')
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const saveEditable = computed(() => {
  return editable.value && saveMode.value
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
  listUrl.value = selectConfig.ram.variable.list.url
  detailUrl.value = selectConfig.ram.variable.get.url
  saveUrl.value = transactionConfig.ram.variable.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  getComboItems('RAM_VARIABLE_GUIDEWORD_CD').then((_result: any) => {
    tab.value = _result[0].code
    _.forEach(_result, (item: any) => {
      tabItems.value.push({
        name: item.code,
        label: item.codeName,
        check: false,
        attrVal1: item.attrVal1,
        component: shallowRef(
          defineAsyncComponent(() => import(`@views/ram/base/hazopDeviationPosibleCause.vue`))
        )
      })
    })
  })
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
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 행 클릭 - 상세조회
 * @param (1): 행 전체 정보
 *******************************/
function rowClick(_row: any) {
  $http({
    url: $format(detailUrl.value, _row.ramVariableId),
    method: 'GET'
  }).then((_result: any) => {
    variable.value = _result.data
    if (variable.value.variableGuidewords && variable.value.variableGuidewords.length > 0) {
      const data = _.uniq(_.map(variable.value.variableGuidewords, 'ramVariableGuidewordCd'))
      _.forEach(tabItems.value, (_item) => {
        if (_.indexOf(data, _item.name) > -1) {
          _item.check = true
        } else {
          _item.check = false
        }
      })
    } else {
      _.forEach(tabItems.value, (_item2) => {
        _item2.check = false
      })
    }

    saveMode.value = true
  })
}
/******************************
 * TODO (목적): 가이드워드 체크 이벤트
 *******************************/
function changeCheckbox(_val: any, _tab: any) {
  if (!_val) {
    if (!variable.value.deleteVariableGuidewords) {
      variable.value.deleteVariableGuidewords = []
    }
    _.forEach(variable.value.variableGuidewords, (item: any) => {
      if (item.ramVariableGuidewordCd == _tab.name) {
        variable.value.deleteVariableGuidewords?.push(item)
      }
    })
    variable.value.variableGuidewords = _.reject(variable.value.variableGuidewords, {
      ramVariableGuidewordCd: _tab.name
    })
  }
}
/******************************
 * TODO (목적): 등록
 *******************************/
function addData() {
  variable.value = {
    ramVariableId: '', // 변수 번호
    plantCd: null,
    variableName: '', // 변수명
    useFlag: 'Y', // 사용여부
    sortOrder: '', // 순번
    regUserId: '', // 등록자 ID
    chgUserId: '', // 수정자 ID
    variableGuidewords: [], // 사용 가이드워드 목록
    deleteVariableGuidewords: [] // [삭제] 사용 가이드워드 목록
  }
  saveMode.value = true
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveVariable() {
  if (variable.value.ramVariableId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.ram.variable.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.ram.variable.insert.url
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '가능한 원인을 작성하지 않은 행은 저장하지 않습니다. 저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          variable.value.regUserId = user.value.userId
          variable.value.chgUserId = user.value.userId

          if (variable.value.variableGuidewords && variable.value.variableGuidewords.length > 0) {
            variable.value.variableGuidewords = _.reject(
              variable.value.variableGuidewords,
              (item) => {
                return !item.causeName
              }
            )
          }
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 저장 후 callback
 *******************************/
function saveVariableCallback(_result: any) {
  variable.value.ramVariableId = _result.data
  message.requestSuccess()
  getList()
  rowClick({ ramVariableId: _result.data })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
