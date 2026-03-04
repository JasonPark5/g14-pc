<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            label="폐기물 종류"
            itemText="codeName"
            itemValue="code"
            name="envWasteKindCd"
            type="search"
            codeGroupCd="ENV_WASTE_KIND_CD"
            v-model:value="searchParam.envWasteKindCd"
          />
        </div>
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
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          title="폐기물 목록"
          :columnSetting="false"
          :isFullScreen="false"
          :isExcelDown="true"
          :usePaging="false"
          :columns="grid.columns"
          :data="grid.data"
          rowKey="envWasteMstId"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="tableUnit"
          title="처리업체 계약 내역(년도별 톤당 단가)"
          :filtering="false"
          :columnSetting="false"
          :isFullScreen="false"
          :isExcelDown="false"
          :usePaging="false"
          :columns="gridUnit.columns"
          :data="gridUnit.data"
          selection="multiple"
          rowKey="envWasteContractId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
              <c-btn v-if="editable" label="삭제" icon="remove" @btnClicked="remove" />
              <c-btn
                v-if="editable && gridUnit.data!.length > 0"
                label="저장"
                icon="save"
                @btnClicked="save"
              />
            </q-btn-group>
          </template>
        </c-table>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'wasteMasterManage'
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
  data?: Array<any>
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
const searchParam = ref({
  plantCd: null,
  envWasteKindCd: '',
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'envWasteKindName',
      field: 'envWasteKindName',
      label: '폐기물종류',
      align: 'center',
      style: 'width:60px',
      sortable: true
    },
    {
      name: 'envWasteCd',
      field: 'envWasteCd',
      label: '폐기물 코드',
      align: 'center',
      sortable: true,
      style: 'width:60px'
    },
    {
      name: 'envWasteName',
      field: 'envWasteName',
      label: '폐기물명',
      align: 'left',
      sortable: true,
      style: 'width:120px'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '처리업체',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: []
})
const gridUnit = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'contractStartDate',
      field: 'contractStartDate',
      label: '계약시작일자',
      align: 'center',
      sortable: true,
      style: 'width:90px',
      type: 'date'
    },
    {
      required: true,
      name: 'contractEndDate',
      field: 'contractEndDate',
      label: '계약종료일자',
      align: 'left',
      style: 'width:90px',
      sortable: true,
      type: 'date'
    },
    {
      required: true,
      name: 'processUnitPrice',
      field: 'processUnitPrice',
      label: '처리단가(원)',
      align: 'center',
      style: 'width:90px',
      sortable: true,
      type: 'number'
    },
    {
      name: 'chgUserName',
      field: 'chgUserName',
      label: '수정자',
      align: 'center',
      style: 'width:50px'
    },
    {
      name: 'chgDtStr',
      field: 'chgDtStr',
      label: '수정일',
      align: 'center',
      style: 'width:50px'
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '입력자',
      align: 'center',
      style: 'width:50px'
    },
    {
      name: 'regDtStr',
      field: 'regDtStr',
      label: '입력일',
      align: 'center',
      style: 'width:50px'
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const detailUrl = ref('')
const saveUrl = ref('')
const removeUrl = ref('')
const useFlagItems = ref<Array<codeMasterType>>([])
const table = ref<any>(null)
const tableUnit = ref<any>(null)
const selectedRow = ref({
  envWasteMstName: '',
  envWasteMstId: ''
})
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
  listUrl.value = selectConfig.env.waste.mst.list.url
  detailUrl.value = selectConfig.env.waste.contract.list.url
  saveUrl.value = transactionConfig.env.waste.contract.save.url
  removeUrl.value = transactionConfig.env.waste.contract.remove.url

  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
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
 * TODO (목적): 행클릭시 우측테이블에 세부항목 표시
 *******************************/
function rowClick(row: any) {
  $http({
    url: $format(detailUrl.value, row.envWasteMstId),
    method: 'GET'
  }).then((_result: any) => {
    selectedRow.value.envWasteMstId = row.envWasteMstId
    selectedRow.value.envWasteMstName = row.envWasteMstName
    gridUnit.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 우측테이블 행 추가
 *******************************/
function add() {
  gridUnit.value.data?.splice(0, 0, {
    envWasteContractId: uid(),
    plantCd: searchParam.value.plantCd,
    envWasteMstId: selectedRow.value.envWasteMstId,
    contractStartDate: null,
    contractEndDate: null,
    processUnitPrice: null,
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 계약일자가 기존 Row와 겹치는지 실시간 검사
 *******************************/
function validateContractDate(newRow: any): boolean {
  const startDate = newRow.contractStartDate
  const endDate = newRow.contractEndDate

  console.log('▶️ 비교결과:', startDate > endDate)

  if (startDate > endDate) {
    message.alert({
      title: '경고',
      message: '계약 시작일은 종료일보다 이전이어야 합니다.',
      type: 'warning'
    })
    return false
  }

  for (const row of gridUnit.value.data!) {
    if (
      row.envWasteContractId !== newRow.envWasteContractId &&
      row.contractStartDate &&
      row.contractEndDate
    ) {
      const existingStartDate = row.contractStartDate
      const existingEndDate = row.contractEndDate

      if (startDate <= existingEndDate && endDate >= existingStartDate) {
        message.alert({
          title: '경고',
          message: '계약 기간이 기존 계약과 겹칩니다.',
          type: 'warning'
        })
        return false
      }
    }
  }
  return true
}
/******************************
 * TODO (목적): 우측테이블 저장
 *******************************/
function save() {
  if (validTable(gridUnit.value.columns, gridUnit.value.data!)) {
    const saveData = gridUnit.value.data!.filter((x) => x.editFlag === 'C' || x.editFlag === 'U')

    for (const item of saveData) {
      if (!validateContractDate(item)) {
        return // Stop saving if any row fails validation
      }
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    }

    if (saveData && saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          $http({
            url: saveUrl.value,
            method: 'PUT',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            rowClick({
              envWasteMstId: selectedRow.value.envWasteMstId,
              envWasteMstName: selectedRow.value.envWasteMstName
            })
          })
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    }
  }
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function remove() {
  const selectData = tableUnit.value.getSelected()
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
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: removeUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridUnit.value.data = _.reject(gridUnit.value.data, item)
          })
          tableUnit.value.compoTable.clearSelection()
          rowClick({
            envWasteMstId: selectedRow.value.envWasteMstId,
            envWasteMstName: selectedRow.value.envWasteMstName
          })
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
