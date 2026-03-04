<template>
  <div>
    <c-search-box @enter="getGhgMasterItems">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="ENV_GAS_MST_DIVISION_CD"
            itemText="codeName"
            itemValue="code"
            label="배출원(연료) 구분"
            name="rawFuelDivisionCd"
            v-model:value="searchParam.rawFuelDivisionCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            :comboItems="useFlagItems"
            label="사용여부"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            type="search"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="배출원(연료) 관리"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addData" />
          <c-btn
            v-if="editable && grid.data!.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveData"
            @btnCallback="saveCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getGhgMasterItems" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'typeCd'">
          <!-- <template v-if="props.row.rawFuelDivisionCd === 'ED01'">
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                type="edit"
                class="no-label-control"
                codeGroupCd="ENV_GAS_FUEL_CD"
                itemText="codeName"
                itemValue="code"
                name="activityCd"
                v-model:value="props.row.rawFuelTypeCd"
              />
            </div>
          </template>
          <template v-else-if="props.row.rawFuelDivisionCd === 'ED02'">
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                type="edit"
                class="no-label-control"
                codeGroupCd="ENV_GAS_RAW_CD"
                itemText="codeName"
                itemValue="code"
                name="activityCd"
                v-model:value="props.row.rawFuelTypeCd"
              />
            </div>
          </template>
          <template v-else></template> -->
        </template>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'rawFuelManage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}
const useFlagItems = ref<Array<codeMasterType>>([])

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
const searchParam = ref({
  plantCd: null,
  rawFuelDivisionCd: null,
  activityCd: null,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [] as any,
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref()
const ghgListUrl = ref('')
const ghgMasterItems = ref<any>([])

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
  saveUrl.value = transactionConfig.env.ghg.rawFuel.save.url
  listUrl.value = selectConfig.env.ghg.rawFuel.list.url

  ghgListUrl.value = selectConfig.env.ghg.master.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getGhgMasterItems()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data

    _.forEach(grid.value.data, (_item) => {
      if (_item.gasList && Array.isArray(_item.gasList)) {
        _.forEach(_item.gasList, (gas) => {
          if (gas.envGhgMstId && gas.emissionFactor != null) {
            _item[gas.envGhgMstId] = gas.emissionFactor
          }
        })
      }
    })
  })
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getGhgMasterItems() {
  $http({
    url: ghgListUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    ghgMasterItems.value = _result.data

    grid.value.columns = [
      {
        name: 'plantCd',
        field: 'plantCd',
        label: '사업장',
        align: 'center',
        type: 'plant',
        sortable: false,
        style: 'width: 150px'
      },
      // {
      //   required: true,
      //   name: 'rawFuelDivisionCd',
      //   field: 'rawFuelDivisionCd',
      //   label: '구분',
      //   align: 'center',
      //   type: 'select',
      //   style: 'width: 120px',
      //   codeGroupCd: 'ENV_GAS_MST_DIVISION_CD',
      //   sortable: false
      // },
      {
        required: true,
        name: 'rawFuelName',
        field: 'rawFuelName',
        label: '배출원(연료)명',
        align: 'left',
        style: 'width: 300px',
        type: 'text',
        sortable: false
      },
      {
        required: true,
        name: 'rawFuelTypeCd',
        field: 'rawFuelTypeCd',
        label: '단위',
        align: 'center',
        type: 'select',
        codeGroupCd: 'ENV_GAS_UNIT_CD',
        style: 'width: 140px',
        sortable: false
      }
      // {
      //   name: 'calorificValue',
      //   field: 'calorificValue',
      //   label: '단위',
      //   align: 'center',
      //   sortable: false,
      //   style: 'width: 120px',
      //   type: 'text'
    ]
    const gasColumns: any = []
    _.forEach(ghgMasterItems.value, (_item) => {
      gasColumns.push({
        name: _item.envGhgMstId,
        field: _item.envGhgMstId,
        label: _item.envGhgMstName,
        //  '<br>' +
        align: 'center',
        sortable: false,
        style: 'width: 120px',
        type: 'number'
      })
    })
    gasColumns.push({
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: false,
      style: 'width:100px',
      type: 'check',
      true: 'Y',
      false: 'N'
    })
    grid.value.columns = _.concat(grid.value.columns, gasColumns)

    getList()
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addData() {
  grid.value.data?.splice(0, 0, {
    plantCd: '',
    envGhgRawFuelId: uid(),
    rawFuelDivisionCd: 'ED01',
    rawFuelName: '',
    rawFuelTypeCd: null,
    calorificValue: '',
    useFlag: 'Y',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (_item) => {
          _item.gasList = []

          _.forEach(_item, (value, key) => {
            if (/^EGM\d{7}$/.test(key)) {
              _item.gasList.push({
                envGhgMstId: key,
                emissionFactor: value,
                envGhgRawFuelId: _item.envGhgRawFuelId
              })
            }
          })
        })
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getGhgMasterItems()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
