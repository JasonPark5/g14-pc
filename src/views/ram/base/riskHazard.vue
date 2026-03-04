<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="RAM_TECHNIQUE_HAZARD_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="ramRiskHazardTechniqueCd"
            label="평가기법 분류"
            v-model:value="searchParam.ramRiskHazardTechniqueCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="RAM_RISK_HAZARD_CLASS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="ramRiskHazardClassCd"
            label="유해위험요인 분류"
            v-model:value="searchParam.ramRiskHazardClassCd"
          />
        </div>
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
    <c-table
      ref="table"
      title="유해위험요인 목록"
      tableId="riskHazrd01"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" :showLoading="false" label="추가" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="saveData"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveRiskHazard"
            @btnCallback="saveRiskHazardCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
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
import { rskHazardType } from './riskHazard'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskHazard'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface gridType {
  columns: tableColumnType
  data: Array<rskHazardType>
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
const table = ref<any>(null)
const searchParam = ref({
  ramRiskHazardClassCd: null,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [],
  data: []
})
const saveData = ref<Array<rskHazardType>>([])
const useFlagItems = ref<Array<codeMasterType>>([])
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')

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
  listUrl.value = selectConfig.ram.riskHazard.list.url
  saveUrl.value = transactionConfig.ram.riskHazard.update.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  grid.value.columns = [
    {
      name: 'ramRiskHazardTechniqueCd',
      field: 'ramRiskHazardTechniqueCd',
      label: '평가기법 분류',
      align: 'center',
      style: 'width:100px',
      setHeader: true,
      sortable: false,
      required: true,
      type: 'select',
      codeGroupCd: 'RAM_TECHNIQUE_HAZARD_TYPE_CD'
    },
    {
      name: 'ramRiskHazardClassCd',
      field: 'ramRiskHazardClassCd',
      label: '유해위험요인 분류',
      align: 'center',
      style: 'width:140px',
      sortable: true,
      type: 'select',
      codeGroupCd: 'RAM_RISK_HAZARD_CLASS_CD'
    },
    {
      name: 'riskHazardNumber',
      field: 'riskHazardNumber',
      label: '분류번호',
      style: 'width:60px',
      align: 'right',
      sortable: true,
      type: 'text'
    },
    {
      name: 'riskHazardName',
      field: 'riskHazardName',
      label: '유해위험요인 (재해형태)',
      align: 'left',
      style: 'width:300px',
      sortable: true,
      required: true,
      type: 'text'
    },
    {
      name: 'relevantLegalStandards',
      field: 'relevantLegalStandards',
      label: '관련근거(법적기준)',
      style: 'width:300px',
      align: 'left',
      sortable: true,
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:90px',
      sortable: true,
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 * @param (1):
 * @param (2):
 * @return (반환):
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
 * TODO (목적): 마스터 추가
 *******************************/
function add() {
  const date = new Date()
  if (!grid.value.data) {
    grid.value.data = []
  }
  grid.value.data.splice(0, 0, {
    ramRiskHazardId: String(date.getTime()), // 유해위험요인 번호
    riskHazardName: '', // 유해위험요인명
    ramRiskHazardClassCd: null, // 유해위험요인 분류 코드
    relevantLegalStandards: '', // 관련근거(법적기준)
    riskHazardNumber: '',
    useFlag: 'Y', // 사용여부
    regUserId: '', // 등록자 ID
    chgUserId: '', // 수정자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveRiskHazard() {
  if (validTable(grid.value.columns, grid.value.data)) {
    /** [구분 - 항목] 데이터 분리 : 분리시 수정&등록된 데이터만 처리 */
    saveData.value = grid.value.data.filter((item2) => {
      return item2.editFlag === 'C' || item2.editFlag === 'U'
    })
    if (saveData.value.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.',
        type: 'info' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 저장 후 callback
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveRiskHazardCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
