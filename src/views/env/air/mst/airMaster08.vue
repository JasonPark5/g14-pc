<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <c-table
      ref="table"
      title="사업장별 대기 검사항목"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      selection="multiple"
      rowKey="envAirPlantInspectItemId"
      :filtering="false"
      :usePaging="false"
      :editable="editable"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRow" />
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="removeRow"
          />
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="저장"
            icon="save"
            @btnClicked="saveItem"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
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
  name: 'airMaster08'
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
  columns: Array<tableColumnType>
  data: Array<any>
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
const searchParam = ref({
  // plantCd: null,
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      type: 'plant',
      sortable: true,
      style: 'width:150px'
    },
    {
      name: 'airInspectTypeName',
      field: 'airInspectTypeName',
      label: '검사구분',
      align: 'center',
      sortable: true
    },
    {
      name: 'envAirMstInspectItemName',
      field: 'envAirMstInspectItemName',
      label: '오염물질명',
      align: 'center',
      sortable: true
    },
    {
      name: 'airInspectUnitName',
      field: 'airInspectUnitName',
      label: '단위',
      align: 'center',
      style: 'width: 150px',
      sortable: true
    },
    {
      name: 'legalStandard',
      field: 'legalStandard',
      label: '법적기준',
      align: 'center',
      type: 'cost',
      style: 'width: 120px',
      sortable: true
    },
    {
      name: 'innerStandard',
      field: 'innerStandard',
      label: '내부기준',
      align: 'center',
      type: 'number',
      style: 'width: 120px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const saveUrl = ref('')
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
  listUrl.value = selectConfig.env.air.mst.inspect.plant.url
  deleteUrl.value = transactionConfig.env.air.mst.inspect.plant.delete.url
  saveUrl.value = transactionConfig.env.air.mst.inspect.plant.save.url
  // code setting
  // list setting
  getList()
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
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addRow() {
  popupOptions.value = getPopupOptions('airInspectItemMst', popupOptions.value, closePopup, {
    type: 'multiple'
  })
}
function closePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  /**
   * 2023-04-19 kdh
   * 로그인자 사업장 : 사업장1
   * 넣고자하는 사업장 : 사업장 2
   * 위 경우 사업장1에 검사항목 F가 있는 경우 사업장 2에 추가할 수가 없음 > 따라서 검사항목 없을때만 넣는 로직 제거
   */
  // if (_.findIndex(grid.value.data, { envAirMstInspectItemId: item.envAirMstInspectItemId }) === -1) {
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(grid.value.data, { envAirMstInspectItemId: item.envAirMstInspectItemId }) === -1
      ) {
        grid.value.data!.splice(0, 0, {
          envAirPlantInspectItemId: uid(), // 사업장별 대기 검사항목 일련번호
          // plantCd: searchParam.value.plantCd, // 사업장코드
          envAirMstInspectItemId: item.envAirMstInspectItemId, // 대기 검사항목 일련번호
          airInspectTypeName: item.airInspectTypeName,
          envAirMstInspectItemName: item.envAirMstInspectItemName,
          airInspectUnitName: item.airInspectUnitName,
          legalStandard: item.legalStandard,
          innerStandard: null, // 내부기준
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveItem() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    const saveData = grid.value.data!.filter((x) => x.editFlag == 'C' || x.editFlag == 'U')
    if (saveData.length > 0) {
      $http({
        url: listUrl.value,
        method: 'GET'
      }).then((_result: any) => {
        let duplicateFlag = false
        _.forEach(saveData, (item) => {
          // 전체
          let allCheck = _.filter(_result.data, {
            plantCd: item.plantCd,
            envAirMstInspectItemId: item.envAirMstInspectItemId
          })
          // 현재 테이블
          const currentCheck = _.filter(grid.value.data, {
            plantCd: item.plantCd,
            envAirMstInspectItemId: item.envAirMstInspectItemId
          })
          // 수정인 경우 전체에서 자기자신 제외
          if (item.editFlag === 'U') {
            allCheck = _.reject(allCheck, {
              envAirPlantInspectItemId: item.envAirPlantInspectItemId
            })
          }
          if (allCheck.length !== 0 || currentCheck.length !== 1) {
            duplicateFlag = true
            return false
          }
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
        if (!duplicateFlag) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info',
            confirmCallback: () => {
              $http({
                url: saveUrl.value,
                method: 'POST',
                data: saveData
              }).then(() => {
                getList()
                message.requestSuccess()
              })
            },
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '입력하신 데이터 중 사업장, 검사항목이 동일한 데이터가 존재합니다.',
            type: 'warning' // success / info / warning / error
          })
        }
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.',
        type: 'warning' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 특정 행 삭제
 *******************************/
function removeRow() {
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
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          table.value.compoTable.clearSelection()
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
