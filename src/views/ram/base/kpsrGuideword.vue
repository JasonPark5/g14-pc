<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
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
          title="위험형태 목록"
          tableId="riskType"
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
          <c-card title="위험형태 상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addData" />
                <c-btn
                  v-if="saveEditable"
                  :isSubmit="isSave"
                  :url="saveUrl"
                  :param="riskType"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveRiskType"
                  @btnCallback="saveRiskTypeCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  :disabled="!saveMode"
                  :editable="editable"
                  :required="true"
                  label="위험형태"
                  name="riskTypName"
                  v-model:value="riskType.riskTypName"
                />
              </div>
              <div class="col-6">
                <c-radio
                  :disabled="!saveMode"
                  :editable="editable"
                  :comboItems="useFlagItems"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="riskType.useFlag"
                />
              </div>
              <div class="col-12">
                <c-table
                  ref="causeTable"
                  title="위험형태별 원인 목록"
                  :columns="gridCasue.columns"
                  :gridHeight="gridCasue.height"
                  :data="riskType.causes"
                  :filtering="false"
                  :columnSetting="false"
                  :usePaging="false"
                  :editable="saveEditable"
                  selection="multiple"
                  rowKey="ramRiskTypeCauseId"
                >
                  <template v-slot:table-button>
                    <q-btn-group outline>
                      <c-btn
                        v-if="saveEditable"
                        :showLoading="false"
                        label="추가"
                        icon="add"
                        @btnClicked="addCause"
                      />
                      <c-btn
                        v-if="saveEditable"
                        :showLoading="false"
                        label="제외"
                        icon="remove"
                        @btnClicked="deleteCause"
                      />
                    </q-btn-group>
                  </template>
                </c-table>
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
import { kpsrRiskType } from './kpsrGuideword'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'kpsrGuideword'
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
  useFlag: 'Y'
})
const useFlagItems = ref<codeMasterType>([])
const riskType = ref<kpsrRiskType>({
  ramRiskTypeId: '', // 위험형태 번호
  riskTypName: '', // 위험형태명
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  causes: [], // 위험형태 원인 목록
  deleteCauses: [] // [삭제] 위험형태 원인 목록
})
const grid = ref({
  columns: [
    {
      name: 'riskTypName',
      field: 'riskTypName',
      label: '위험형태',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const gridCasue = ref({
  columns: [] as any,
  data: [],
  height: '550px'
})
const listUrl = ref('')
const detailUrl = ref('')
const saveUrl = ref('')
const saveMode = ref(false)
const isSave = ref(false)
const mappingType = ref('POST')
const editForm = ref<any>(null)
const causeTable = ref<any>(null)

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
  listUrl.value = selectConfig.ram.riskType.list.url
  detailUrl.value = selectConfig.ram.riskType.get.url
  saveUrl.value = transactionConfig.ram.riskType.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  getComboItems('MDM_PROCESS_TYPE_CD').then((_result: any) => {
    gridCasue.value.columns = [
      {
        name: 'riskTypeCauseMainName',
        field: 'riskTypeCauseMainName',
        label: '원인(대분류)',
        align: 'center',
        style: 'width:100px',
        type: 'text',
        sortable: true,
        required: true
      },
      {
        name: 'riskTypeCauseSubName',
        field: 'riskTypeCauseSubName',
        label: '원인(소분류)',
        align: 'left',
        style: 'width:300px',
        type: 'text',
        sortable: true,
        required: true
      },
      {
        name: 'processTypes',
        field: 'processTypes',
        label: '공정구분',
        align: 'center',
        style: 'width:80px',
        type: 'multiSelect',
        isObject: true,
        valueText: 'mdmProcessTypeName',
        valueKey: 'mdmProcessTypeCd',
        itemText: 'codeName',
        itemValue: 'code',
        comboItems: _result,
        sortable: true
      }
    ]
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
    url: $format(detailUrl.value, _row.ramRiskTypeId),
    method: 'GET'
  }).then((_result: any) => {
    riskType.value = _result.data
    saveMode.value = true
  })
}
/******************************
 * TODO (목적): 등록
 *******************************/
function addData() {
  riskType.value = {
    ramRiskTypeId: '', // 위험형태 번호
    riskTypName: '', // 위험형태명
    useFlag: 'Y', // 사용여부
    regUserId: '', // 등록자 ID
    chgUserId: '', // 수정자 ID
    causes: [], // 위험형태 원인 목록
    deleteCauses: [] // [삭제] 위험형태 원인 목록
  }
  saveMode.value = true
}
/******************************
 * TODO (목적): 원인 추가
 *******************************/
function addCause() {
  const date = new Date()
  if (!riskType.value.causes) {
    riskType.value.causes = []
  }
  riskType.value.causes.push({
    ramRiskTypeCauseId: String(date.getTime()), // 위험형태원인 번호
    ramRiskTypeId: '', // 위험형태 번호
    riskTypeCauseMainName: '', // 위험형태원인명- 대분류
    riskTypeCauseSubName: '', // 위험형태원인명- 소분류
    processTypes: [],
    editFlag: 'C'
  })
}
function deleteCause() {
  const selectData = causeTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!riskType.value.deleteCauses) {
      riskType.value.deleteCauses = []
    }
    _.forEach(selectData, (_item: any) => {
      if (
        _.findIndex(riskType.value.deleteCauses, {
          ramRiskTypeCauseId: _item.ramRiskTypeCauseId
        }) === -1 &&
        _item.editFlag !== 'C'
      ) {
        riskType.value.deleteCauses?.push(_item)
      }
      riskType.value.causes = _.reject(riskType.value.causes, {
        ramRiskTypeCauseId: _item.ramRiskTypeCauseId
      })
    })
    causeTable.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveRiskType() {
  if (riskType.value.ramRiskTypeId) {
    mappingType.value = 'PUT'
    saveUrl.value = transactionConfig.ram.riskType.update.url
  } else {
    mappingType.value = 'POST'
    saveUrl.value = transactionConfig.ram.riskType.insert.url
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      let saving = true
      if (riskType.value.causes && riskType.value.causes.length > 0) {
        saving = validTable(gridCasue.value.columns, riskType.value.causes)
      }
      if (saving) {
        message.confirm({
          title: '확인',
          message: '가능한원인을 작성하지 않은 행은 저장하지 않습니다.\n\r저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            riskType.value.regUserId = user.value.userId
            riskType.value.chgUserId = user.value.userId
            isSave.value = !isSave.value
          },
          // 취소 callback 함수
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 저장 후 callback
 *******************************/
function saveRiskTypeCallback(_result: any) {
  riskType.value.ramRiskTypeId = _result.data
  message.requestSuccess()
  getList()
  rowClick({ ramRiskTypeId: _result.data })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
