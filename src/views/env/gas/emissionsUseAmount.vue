<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            label="대상년월"
            name="targetMonth"
            type="month"
            default="today"
            v-model:value="searchParam.targetMonth"
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
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          title="사용량 입력/조회"
          :columns="grid.columns"
          :data="grid.data"
          :columnSetting="false"
          :usePaging="false"
          selection="multiple"
          rowKey="envGhgUseAmountId"
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
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'emissionsUseAmount'
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

/******************************
 * @inject_선언
 *******************************/

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
  targetMonth: '2025-07',
  facilityTypeCd: null,
  deptCd: null,
  processCd: null,
  envGhgFacilityFuelId: null,
  envGhgFacilityId: null
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'targetMonth',
      field: 'targetMonth',
      label: '대상년월',
      align: 'center',
      sortable: false,
      style: 'width: 80px'
    },
    {
      name: 'facilityTypeName',
      field: 'facilityTypeName',
      label: '배출형태',
      align: 'center',
      sortable: false,
      style: 'width: 80px'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공장명',
      align: 'center',
      sortable: false,
      style: 'width: 100px'
    },
    {
      name: 'rawFuelName',
      field: 'rawFuelName',
      label: '배출원(연료)',
      align: 'center',
      style: 'width: 80px',
      sortable: false
    },
    {
      name: 'facilityName',
      field: 'facilityName',
      label: '시설명',
      align: 'left',
      sortable: false,
      style: 'width: 150px'
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'left',
      sortable: false,
      style: 'width: 180px'
    },
    {
      name: 'inputTypeCd',
      field: 'inputTypeCd',
      label: '입력구분',
      align: 'center',
      sortable: false,
      style: 'width: 100px',
      type: 'select',
      itemText: 'codeName',
      itemValue: 'code',
      codeGroupCd: 'ENV_GAS_INPUT_TYPE_CD'
    },
    {
      name: 'rawFuelTypeName',
      field: 'rawFuelTypeName',
      label: '단위',
      align: 'center',
      sortable: false,
      style: 'width: 80px'
    },
    {
      name: 'useAmount',
      field: 'useAmount',
      label: '사용량',
      align: 'right',
      sortable: false,
      currentDay: true,
      required: true,
      type: 'number',
      style: 'width: 100px'
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      setHeader: true,
      label: '등록자',
      userId: 'regUserId',
      type: 'user',
      align: 'center',
      required: true,
      sortable: false,
      style: 'width: 100px'
    },
    {
      name: 'confirmUserName',
      field: 'confirmUserName',
      setHeader: true,
      label: '확정자',
      userId: 'confirmUserId',
      type: 'user',
      required: true,
      align: 'center',
      sortable: false,
      style: 'width: 100px'
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const isSave = ref(false)
const saveUrl = ref()
const deleteUrl = ref('')
const table = ref<any>(null)

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
  saveUrl.value = transactionConfig.env.ghg.amount.save.url
  deleteUrl.value = transactionConfig.env.ghg.amount.delete.url
  listUrl.value = selectConfig.env.ghg.amount.list.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (!searchParam.value.targetMonth) {
    message.alert({
      title: '안내',
      message: '대상년월을 선택하세요.',
      type: 'error'
    })
    return
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
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
          targetMonth: searchParam.value.targetMonth,
          envGhgUseAmountId: uid(),
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
          useAmount: 0,
          inputTypeCd: null,
          regUserName: user.value.userName,
          confirmUserName: user.value.userName,
          confirmUserId: user.value.userId,
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
  if (!searchParam.value.targetMonth) {
    message.alert({
      title: '안내',
      message: '대상년월을 선택하세요.',
      type: 'error'
    })
    return
  }
  // if (validTable(grid.value.columns, grid.value.data!)) {
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
  // }
}
function saveCallback() {
  message.requestSuccess()
  getList()
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
