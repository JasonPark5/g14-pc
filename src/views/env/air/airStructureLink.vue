<template>
  <div>
    <!-- <c-search-box @enter="getStructureList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-tree-table
          title="시설구조"
          parentProperty="upStructureLinkId"
          customID="airStructureLinkId"
          :columns="grid.columns"
          :data="grid.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          :isFixExpand="true"
          :customTrClass="setTrClass"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="배출구추가" icon="add" @btnClicked="addFacility('OUTLET')" />
              <c-btn label="검색" icon="search" @btnClicked="getStructureList" />
            </q-btn-group>
          </template>
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <q-form ref="editForm">
          <!-- <c-card title="사업장" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  :editable="false"
                  label="사업장 코드"
                  name="plantCd"
                  type="edit"
                  v-model:value="structureData.plantCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-plant
                  type="edit"
                  :editable="false"
                  name="plantCd"
                  :isFirstValue="false"
                  v-model:value="structureData.plantCd"
                />
              </div>
            </template>
          </c-card> -->
          <c-table
            v-if="
              ['AFT0000001', 'AFT0000005', 'AFT0000010', 'AFT0000015', 'AFT0000000'].includes(
                structureData.facilityType
              )
            "
            title="배출구"
            :columns="grid2.columns"
            :data="grid2.data"
            :filtering="false"
            :isFullScreen="false"
            :usePaging="false"
            :isExcelDown="false"
            gridHeightAuto
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && structureData.facilityType === 'AFT0000001'"
                  label="방지시설 연결"
                  icon="add"
                  @btnClicked="addFacility('PREVENTIVE')"
                />
                <c-btn
                  v-if="
                    editable && structureData.facilityType === 'AFT0000001' && !prevExempDisabled
                  "
                  label="방지시설 면제"
                  icon="check"
                  @btnClicked="addFacility('PREVENTIVE_EXEMPTION')"
                />
                <c-btn
                  v-if="editable && structureData.facilityType === 'AFT0000001'"
                  :url="deleteUrl"
                  :isSubmit="isDelete"
                  :param="structureData"
                  mappingType="DELETE"
                  label="제거"
                  icon="remove"
                  @beforeAction="deleteFacility"
                  @btnCallback="deleteCallback"
                />
              </q-btn-group>
            </template>
          </c-table>
          <c-table
            v-if="
              ['AFT0000000', 'AFT0000005', 'AFT0000010', 'AFT0000015'].includes(
                structureData.facilityType
              )
            "
            title="방지시설"
            :columns="grid3.columns"
            :data="grid3.data"
            :filtering="false"
            :isFullScreen="false"
            :usePaging="false"
            :isExcelDown="false"
            gridHeightAuto
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && structureData.facilityType === 'AFT0000005'"
                  label="하위방지시설 연결"
                  icon="add"
                  @btnClicked="addFacility('PREVENTIVE')"
                />
                <c-btn
                  v-if="
                    editable &&
                    (structureData.facilityType === 'AFT0000005' ||
                      structureData.facilityType === 'AFT0000000') &&
                    !dischargeDisabled
                  "
                  label="배출시설 연결"
                  icon="add"
                  @btnClicked="addFacility('DISCHARGE')"
                />
                <c-btn
                  v-if="
                    editable &&
                    (structureData.facilityType === 'AFT0000005' ||
                      structureData.facilityType === 'AFT0000000')
                  "
                  :url="deleteUrl"
                  :isSubmit="isDelete"
                  :param="structureData"
                  mappingType="DELETE"
                  label="제거"
                  icon="remove"
                  @beforeAction="deleteFacility"
                  @btnCallback="deleteCallback"
                />
              </q-btn-group>
            </template>
          </c-table>
          <c-table
            v-if="
              ['AFT0000010', 'AFT0000015'].includes(structureData.facilityType) &&
              (structureData.subAirMstPreventiveList?.length ?? 0) > 0
            "
            title="하위방지시설"
            :columns="grid5.columns"
            :data="grid5.data"
            :filtering="false"
            :isFullScreen="false"
            :usePaging="false"
            :isExcelDown="false"
            gridHeightAuto
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="
                    editable &&
                    (structureData.facilityType === 'AFT0000005' ||
                      structureData.facilityType === 'AFT0000010')
                  "
                  label="하위방지시설 연결"
                  icon="add"
                  @btnClicked="addFacility('PREVENTIVE')"
                />
                <c-btn
                  v-if="
                    editable &&
                    (structureData.facilityType === 'AFT0000010' ||
                      structureData.facilityType === 'AFT0000000')
                  "
                  label="배출시설 연결"
                  icon="add"
                  @btnClicked="addFacility('DISCHARGE')"
                />
                <c-btn
                  v-if="
                    editable &&
                    (structureData.facilityType === 'AFT0000010' ||
                      structureData.facilityType === 'AFT0000000')
                  "
                  :url="deleteUrl"
                  :isSubmit="isDelete"
                  :param="structureData"
                  mappingType="DELETE"
                  label="제거"
                  icon="remove"
                  @beforeAction="deleteFacility"
                  @btnCallback="deleteCallback"
                />
              </q-btn-group>
            </template>
          </c-table>
          <c-table
            v-if="structureData.facilityType === 'AFT0000015'"
            title="배출시설"
            :columns="grid4.columns"
            :data="grid4.data"
            :filtering="false"
            :isFullScreen="false"
            :usePaging="false"
            :isExcelDown="false"
            gridHeightAuto
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && structureData.facilityType === 'AFT0000015'"
                  :url="deleteUrl"
                  :isSubmit="isDelete"
                  :param="structureData"
                  mappingType="DELETE"
                  label="제거"
                  icon="remove"
                  @beforeAction="deleteFacility"
                  @btnCallback="deleteCallback"
                />
              </q-btn-group>
            </template>
          </c-table>
        </q-form>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { airStructureType } from './mst/airMaster'

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
  name: 'airStructureLink'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  // plantCd: stringNull
  deptNm: stringNull
  useFlag: stringNull
}

interface gridType {
  columns: tableColumnType
  data: Array<any>
  height?: stringNull
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
const searchParam = ref<searchParamType>({
  // plantCd: null,
  deptNm: '',
  useFlag: 'Y'
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const structureData = ref<airStructureType>({
  plantCd: null,
  airStructureLinkId: '',
  facilityId: '',
  facilityName: '',
  linkId: '',
  facilityType: '',
  upStructureLinkId: '',
  airMstOutletModel: {},
  airMstPreventiveModel: {},
  subAirMstPreventiveModel: {},
  airMstDischargeModel: {}
})

const grid = ref<gridType>({
  columns: [
    {
      name: 'facilityName',
      field: 'facilityName',
      label: '시설명',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'outletSemsId',
      field: 'outletSemsId',
      label: '배출구일련번호<br>(SEMS)',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'outletPermitNo',
      field: 'outletPermitNo',
      label: '허가증상배출구번호(SEMS)',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'outletIepsNo',
      field: 'outletIepsNo',
      label: '배출구번호(IEPS)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'outletIepsPlantMgtNo',
      field: 'outletIepsPlantMgtNo',
      label: '사업장관리번호(IEPS)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구명',
      align: 'left',
      style: 'width:200px',
      sortable: true
    }
  ],
  data: []
})
const grid3 = ref<gridType>({
  columns: [
    {
      name: 'preventiveSemsId',
      field: 'preventiveSemsId',
      label: '방지시설일련번호<br>(SEMS)',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    },
    {
      name: 'preventivePermitNo',
      field: 'preventivePermitNo',
      label: '허가증상방지시설번호(SEMS)',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    },
    {
      name: 'preventiveIepsNo',
      field: 'preventiveIepsNo',
      label: '방지시설관리번호(IEPS)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'preventiveIepsPlantMgtNo',
      field: 'preventiveIepsPlantMgtNo',
      label: '사업장관리번호(IEPS)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      align: 'left',
      style: 'width: 200px',
      sortable: true
    }
  ],
  data: []
})
const grid4 = ref<gridType>({
  columns: [
    {
      name: 'dischargeSemsId',
      field: 'dischargeSemsId',
      label: '배출시설일련번호<br>(SEMS)',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'dischargePermitNo',
      field: 'dischargePermitNo',
      label: '허가증상배출시설번호(SEMS)',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'dischargeIepsNo',
      field: 'dischargeIepsNo',
      label: '배출시설관리번호(IEPS)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'dischargeIepsPlantMgtNo',
      field: 'dischargeIepsPlantMgtNo',
      label: '사업장관리번호(IEPS)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'dischargeName',
      field: 'dischargeName',
      label: '배출시설명',
      align: 'left',
      style: 'width:200px',
      sortable: true
    }
  ],
  data: []
})
const grid5 = ref<gridType>({
  columns: [
    {
      name: 'preventiveSemsId',
      field: 'preventiveSemsId',
      label: '방지시설일련번호(SEMS)',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    },
    {
      name: 'preventivePermitNo',
      field: 'preventivePermitNo',
      label: '허가증상방지시설번호(SEMS)',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    },
    {
      name: 'preventiveIepsNo',
      field: 'preventiveIepsNo',
      label: '방지시설관리번호(IEPS)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'preventiveIepsPlantMgtNo',
      field: 'preventiveIepsPlantMgtNo',
      label: '사업장관리번호(IEPS)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'preventiveName',
      field: 'preventiveName',
      label: '방지시설명',
      align: 'left',
      style: 'width: 200px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const useFlagItems = ref<Array<any>>([])
const listUrl = ref('')
const detailUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const updateMode = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const selectedAirStructureLinkId = ref('')
const rowNotSelected = ref(true)
const isDelete = ref(false)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
// const subPreventiveDisabled = computed(() => {
//   return (
//     _.findIndex(grid.value.data, { upStructureLinkId: structureData.value.airStructureLinkId }) !==
//     -1
//   )
// })
const dischargeDisabled = computed(() => {
  return (
    _.findIndex(grid.value.data, {
      upStructureLinkId: structureData.value.airStructureLinkId,
      facilityType: 'AFT0000010'
    }) !== -1
  )
})

const prevExempDisabled = computed(() => {
  return (
    _.findIndex(
      grid.value.data,
      (item) =>
        item.upStructureLinkId === structureData.value.airStructureLinkId &&
        ['AFT0000005', 'AFT0000000'].includes(item.facilityType)
    ) !== -1
  )
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
  listUrl.value = selectConfig.env.air.structure.list.url
  detailUrl.value = selectConfig.env.air.structure.get.url
  insertUrl.value = transactionConfig.env.air.structure.insert.url
  deleteUrl.value = transactionConfig.env.air.structure.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적):  목록 조회
 *******************************/
function getList() {
  rowNotSelected.value = true
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    _.forEach(_result.data, (item) => {
      if (item.facilityType === 'AFT0000001') {
        item.facilityName = `[배출구] ${item.facilityName}`
      }
      if (
        item.facilityType === 'AFT0000005' ||
        item.facilityType === 'AFT0000010' ||
        item.facilityType === 'AFT0000000'
      ) {
        item.facilityName = `[방지시설] ${item.facilityName}`
      }
      if (item.facilityType === 'AFT0000015') {
        item.facilityName = `[배출시설] ${item.facilityName}`
      }
    })
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 선택한 항목 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
/******************************
 * TODO (목적): 부서 목록 조회, 리셋
 *******************************/
function getStructureList() {
  getList()
  reset()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function rowClick(row: any) {
  // 상세조회
  rowNotSelected.value = false
  updateMode.value = true
  selectedAirStructureLinkId.value = row.airStructureLinkId
  $http({
    url: $format(detailUrl.value, selectedAirStructureLinkId.value),
    method: 'GET'
  }).then((_result: any) => {
    console.log(_result.data)
    structureData.value = _result.data
    grid2.value.data = [structureData.value.airMstOutletModel]
    grid3.value.data = [structureData.value.airMstPreventiveModel]
    grid5.value.data = structureData.value.subAirMstPreventiveList ?? []
    grid4.value.data = [structureData.value.airMstDischargeModel]

    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  })
}
/******************************
 * TODO (목적): 시설 추가
 *******************************/
function addFacility(type: string) {
  if (type === 'OUTLET') {
    popupOptions.value.title = '배출구 추가'
    popupOptions.value = getPopupOptions('airOutlet', popupOptions.value, closeOutletPopup, {
      type: 'single'
      // searchParam: { plantCd: searchParam.value.plantCd }
    })
  }
  if (type === 'PREVENTIVE') {
    popupOptions.value.title = '방지시설 추가'
    popupOptions.value = getPopupOptions('airPreventive', popupOptions.value, closeOutletPopup, {
      type: 'single',
      searchParam: { plantCd: structureData.value.plantCd }
    })
  }
  if (type === 'DISCHARGE') {
    popupOptions.value.title = '배출시설 추가'
    popupOptions.value = getPopupOptions('airDischarge', popupOptions.value, closeOutletPopup, {
      type: 'single',
      searchParam: { plantCd: structureData.value.plantCd }
    })
  }
  if (type === 'PREVENTIVE_EXEMPTION') {
    message.confirm({
      title: '확인',
      message:
        '방지시설 면제 처리 시 해당 배출구 밑에 방지시설 면제 정보가 등록되며, 이후 배출시설 등록이 가능해집니다.',
      type: 'info',
      confirmCallback: () => {
        const saveData = {
          facilityId: uid(),
          linkId: grid2.value.data[0].envAirMstOutletId,
          upStructureLinkId: structureData.value.airStructureLinkId,
          regUserId: user.value.userId,
          plantCd: '1000',
          facilityType: 'AFT0000000'
        }
        $http({
          url: insertUrl.value,
          method: 'POST',
          data: saveData
        }).then((_result: any) => {
          message.requestSuccess()
          getStructureList()
        })
      },
      cancelCallback: () => {}
    })
  }
}
function closeOutletPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  let saveData = {}
  let checkDuplicate = false
  let messageText = ''
  if (_data && _data.length > 0) {
    if (_data[0].envAirMstOutletId) {
      checkDuplicate =
        _.findIndex(grid.value.data, ['facilityId', _data[0].envAirMstOutletId]) !== -1
      messageText = '이미 추가된 배출구입니다.'
      saveData = {
        facilityId: _data[0].envAirMstOutletId,
        regUserId: user.value.userId,
        plantCd: _data[0].plantCd,
        facilityType: 'AFT0000001'
      }
    } else if (_data[0].envAirMstPreventiveId) {
      const newPreventiveId = _data[0].envAirMstPreventiveId
      const parent = structureData.value // 현재 클릭한 트리 노드(부모)
      const parentLinkId = parent.airStructureLinkId

      // 공통: 부모 시설 id가 linkId로 들어가게 통일
      const parentFacilityId = parent.facilityId

      if (parent.facilityType === 'AFT0000001') {
        // 배출구 밑에 1차 방지시설 추가
        checkDuplicate =
          _.findIndex(grid.value.data, {
            facilityId: newPreventiveId,
            linkId: parentFacilityId
          }) !== -1

        saveData = {
          facilityId: newPreventiveId,
          linkId: parentFacilityId, // outlet_id
          upStructureLinkId: parentLinkId, // outlet link id(있다면)
          regUserId: user.value.userId,
          plantCd: _data[0].plantCd,
          facilityType: 'AFT0000005'
        }
      } else if (parent.facilityType === 'AFT0000005' || parent.facilityType === 'AFT0000010') {
        // 1차/하위 방지시설 밑에 하위 방지시설 추가 (2차/3차/4차...)
        checkDuplicate =
          _.findIndex(grid.value.data, {
            facilityId: newPreventiveId,
            linkId: parentFacilityId,
            upStructureLinkId: parentLinkId
          }) !== -1

        saveData = {
          facilityId: newPreventiveId,
          linkId: parentFacilityId, // 부모 preventive_id
          upStructureLinkId: parentLinkId, // 부모 링크 id
          regUserId: user.value.userId,
          plantCd: _data[0].plantCd,
          facilityType: 'AFT0000010'
        }
      } else {
        // 여기 오면 UX상 방지시설을 달면 안 되는 타입(배출시설 등)
        message.alert({
          title: '안내',
          message: '해당 위치에는 방지시설을 추가할 수 없습니다.',
          type: 'warning'
        })
        return
      }
    } else if (_data[0].envAirMstDischargeId) {
      const newDischargeId = _data[0].envAirMstDischargeId
      const parent = structureData.value
      const parentLinkId = parent.airStructureLinkId
      const parentFacilityId = parent.facilityId

      // 배출시설은 방지시설(1차/면제/하위) 밑에만
      if (!['AFT0000005', 'AFT0000000', 'AFT0000010'].includes(parent.facilityType)) {
        message.alert({
          title: '안내',
          message: '해당 위치에는 배출시설을 추가할 수 없습니다.',
          type: 'warning'
        })
        return
      }

      checkDuplicate =
        _.findIndex(grid.value.data, {
          facilityId: newDischargeId,
          linkId: parentFacilityId,
          upStructureLinkId: parentLinkId
        }) !== -1

      messageText = '이미 추가된 배출시설입니다.'
      saveData = {
        facilityId: newDischargeId,
        linkId: parentFacilityId,
        upStructureLinkId: parentLinkId,
        regUserId: user.value.userId,
        plantCd: _data[0].plantCd,
        facilityType: 'AFT0000015'
      }
    }
    if (checkDuplicate) {
      message.alert({
        title: '안내',
        message: messageText,
        type: 'warning'
      })
    } else {
      $http({
        url: insertUrl.value,
        method: 'POST',
        data: saveData
      }).then((_result: any) => {
        message.requestSuccess()
        getStructureList()
      })
    }
  }
}

/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  updateMode.value = false
  selectedAirStructureLinkId.value = ''
  structureData.value = {
    plantCd: null,
    airStructureLinkId: '',
    facilityId: '',
    facilityName: '',
    linkId: '',
    facilityType: '',
    upStructureLinkId: ''
  }
  grid2.value.data = []
  grid3.value.data = []
  grid4.value.data = []
  grid5.value.data = []
}
/******************************
 * TODO (목적): 시설 제거
 *******************************/
function deleteFacility() {
  message.confirm({
    title: '확인',
    message: '시설을 제거하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, structureData.value.airStructureLinkId),
        method: 'DELETE'
      }).then((_result: any) => {
        isDelete.value = !isDelete.value
      })
    }
  })
}
/******************************
 * TODO (목적): 부서 삭제 콜백
 *******************************/
function deleteCallback() {
  message.requestSuccess()
  getStructureList()
}

function setTrClass(_props: any) {
  if (_props.row.facilityType === 'AFT0000001') {
    return 'text-indigo-8'
  }
  if (
    _props.row.facilityType === 'AFT0000005' ||
    _props.row.facilityType === 'AFT0000010' ||
    _props.row.facilityType === 'AFT0000000'
  ) {
    return 'text-red-5'
  }
  if (_props.row.facilityType === 'AFT0000015') {
    return 'text-green-7'
  }
  return ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>

<style>
.text-indigo-8 > td {
  color: #303f9f !important;
}

.text-red-5 > td {
  color: #ef4444 !important;
}

.text-green-7 > td {
  color: #43a047 !important;
}
</style>
