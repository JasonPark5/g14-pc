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
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            label="대상년도"
            name="targetYear"
            type="year"
            default="today"
            v-model:value="searchParam.targetYear"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            :editable="editable"
            codeGroupCd="ENV_GAS_MST_DISCHARGE_CD"
            itemText="codeName"
            itemValue="code"
            label="배출형태"
            name="facilityTypeCd"
            v-model:value="searchParam.facilityTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            label="공장"
            :editable="editable"
            codeGroupCd="ENV_GAS_PLANT_CD"
            itemText="codeName"
            itemValue="code"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="edit"
            :editable="editable"
            label="부서"
            name="deptCd"
            :isFirstValue="false"
            v-model:value="searchParam.deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            type="search"
            :customPopupParam="{ targetKey: 'ghgFacility' }"
            label="시설"
            :editable="editable"
            name="envGhgFacilityId"
            v-model:value="searchParam.envGhgFacilityId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            type="search"
            :customPopupParam="{ targetKey: 'ghgFacilityEquipment' }"
            label="설비"
            :editable="editable"
            name="envGhgFacilityFuelId"
            v-model:value="searchParam.envGhgFacilityFuelId"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="배출계수 관리"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :usePaging="false"
      selection="multiple"
      rowKey="envGhgFacilityFuelId"
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
          <c-btn
            v-if="editable && grid.data!.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteData"
          />
          <c-btn label="검색" icon="search" @btnClicked="getGhgMasterItems" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'emissionsFactor'
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  rawFuelDivisionCd: null,
  activityCd: null,
  targetYear: '2025',
  facilityTypeCd: null,
  deptCd: null,
  processCd: null,
  envGhgFacilityId: null,
  envGhgFacilityFuelId: null
})
const grid = ref<gridType>({
  columns: [] as any,
  data: []
})
const table = ref<any>(null)
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref()
const typeItems = ref<any>([])
const ghgListUrl = ref('')
const ghgMasterItems = ref<any>([])
const deleteUrl = ref('')

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
  saveUrl.value = transactionConfig.env.ghg.factor.save.url
  deleteUrl.value = transactionConfig.env.ghg.factor.delete.url
  listUrl.value = selectConfig.env.ghg.factor.list.url

  ghgListUrl.value = selectConfig.env.ghg.master.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  getComboItems('ENV_GAS_MST_TYPE_CD').then((_result: any) => {
    typeItems.value = _result
    getGhgMasterItems()
  })
  // list setting
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (!searchParam.value.targetYear) {
    message.alert({
      title: '안내',
      message: '대상년도를 선택하세요.',
      type: 'error' // success / info / warning / error
    })
    return
  }
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
            _item[gas.envGhgMstId + '|' + gas.envGhgMstTypeCd] = gas.emissionFactor
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
        name: 'targetYear',
        field: 'targetYear',
        label: '대상년도',
        align: 'center',
        fix: true,
        sortable: false,
        style: 'width: 70px'
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
        name: 'facilityTypeName',
        field: 'facilityTypeName',
        label: '배출형태',
        align: 'center',
        fix: true,
        sortable: false,
        style: 'width: 80px'
      },
      {
        name: 'processName',
        field: 'processName',
        label: '공장명',
        align: 'center',
        fix: true,
        sortable: false,
        style: 'width: 100px'
      },
      {
        name: 'rawFuelName',
        field: 'rawFuelName',
        label: '배출원(연료)',
        align: 'center',
        fix: true,
        style: 'width: 80px',
        sortable: false
      },
      {
        name: 'facilityName',
        field: 'facilityName',
        label: '시설명',
        align: 'left',
        fix: true,
        sortable: false,
        style: 'width: 150px'
      },
      {
        name: 'equipmentName',
        field: 'equipmentName',
        label: '설비명',
        align: 'left',
        sortable: false,
        fix: true,
        style: 'width: 250px'
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
      _.forEach(typeItems.value, (_type) => {
        gasColumns.push({
          // setHeader: true,
          name: _item.envGhgMstId + '|' + _type.code,
          field: _item.envGhgMstId + '|' + _type.code,
          label: _item.envGhgMstName + '-' + _type.codeName,
          //  '<br>' +
          align: 'center',
          sortable: false,
          style: 'width: 100px',
          type: 'number'
        })
      })
    })
    grid.value.columns = _.concat(grid.value.columns, gasColumns)

    getList()
  })
}
/******************************
 * TODO (목적): 배출시설 선택
 *******************************/
function addData() {
  popupOptions.value = getPopupOptions('ghgFacilityEquipment', popupOptions.value, closePopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: { useFlag: 'Y' }
  })
}
/******************************
 * TODO (목적): 배출시설 팝업 닫기 콜백
 *******************************/
function closePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      if (
        _.findIndex(grid.value.data, { envGhgFacilityFuelId: _item.envGhgFacilityFuelId }) === -1
      ) {
        grid.value.data!.push({
          targetYear: searchParam.value.targetYear,
          envGhgFacilityFuelId: _item.envGhgFacilityFuelId,
          envGhgFacilityId: _item.envGhgFacilityId,
          envGhgRawFuelId: _item.envGhgRawFuelId,
          facilityTypeName: _item.facilityTypeName,
          processName: _item.processName,
          equipmentName: _item.equipmentName,
          deptName: _item.deptName,
          facilityName: _item.facilityName,
          rawFuelName: _item.rawFuelName,
          rawFuelTypeName: _item.rawFuelTypeName,
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (!searchParam.value.targetYear) {
    message.alert({
      title: '안내',
      message: '대상년도를 선택하세요.',
      type: 'error'
    })
    return
  }
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (_item) => {
          _item.gasList = []

          _.forEach(_item, (value, key) => {
            if (/^EGM\d{7}\|.+$/.test(key)) {
              const [envGhgMstId, envGhgMstTypeCd] = key.split('|')
              _item.gasList.push({
                envGhgMstId: envGhgMstId,
                envGhgMstTypeCd: envGhgMstTypeCd,
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
 * TODO (목적):  삭제
 *******************************/
function deleteData() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          table.value.compoTable.clearSelection()
          message.requestSuccess()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
