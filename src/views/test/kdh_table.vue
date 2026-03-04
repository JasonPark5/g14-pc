<template>
  <c-table
    ref="editTable"
    title="인라인에디터"
    :columns="gridEdit.columns"
    :data="gridEdit.data"
    :merge="gridEdit.merge"
    selection="multiple"
    rowKey="id"
  >
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn label="추가" icon="add" :showLoading="false" @btnClicked="addrow" />
        <c-btn :showLoading="false" label="삭제" icon="remove" @btnClicked="remove" />
      </q-btn-group>
    </template>
  </c-table>
  <c-table title="작업허가서 목록" :columns="grid.columns" :data="grid.data" @linkClick="linkClick">
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn label="검색" icon="search" @btnClicked="btnClicked" />
      </q-btn-group>
    </template>
  </c-table>
  <c-table title="가스항목 목록" :columns="gridGas.columns" :data="gridGas.data" />
  <c-tree-table
    title="메뉴목록"
    parentProperty="upMenuId"
    customID="sysMenuId"
    :columns="gridMenu.columns"
    :data="gridMenu.data"
    :columnSetting="false"
    :isFullScreen="false"
    :usePaging="false"
    :expandAll="true"
    :hideBottom="true"
    @rowClick="rowClick"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn label="검색" icon="search" @btnClicked="getMenuList" />
      </q-btn-group>
    </template>
  </c-tree-table>
</template>

<script setup lang="ts">
import selectConfig from '@/common/utils/selectConfig'
import { $http } from '@utils/http'

defineOptions({
  name: 'IndexPage'
})

const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'workSummary',
      field: 'workSummary',
      label: '작업개요',
      align: 'left',
      sortable: true,
      type: 'link',
      style: 'width:240px'
    },
    {
      name: 'swpStepName',
      field: 'swpStepName',
      label: '진행단계',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재진행단계',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'permitDate',
      field: 'permitDate',
      label: '허가일',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'permitTypeName',
      field: 'permitTypeName',
      label: '허가서구분',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'supplementWorkTypeNames',
      field: 'supplementWorkTypeNames',
      label: '보충작업',
      align: 'left',
      sortable: true,
      style: 'width:200px'
    },
    {
      name: 'applicationDeptName',
      field: 'applicationDeptName',
      label: '신청부서',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'issuedDeptName',
      field: 'issuedDeptName',
      label: '발급부서',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    }
  ],
  data: []
})
const editTable = ref<any>(null)
const gridEdit = ref({
  merge: [
    { index: 0, colName: 'mergeId' },
    { index: 1, colName: 'mergeId' }
  ],
  columns: [
    {
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      sortable: true,
      required: true,
      style: 'width:100px',
      type: 'plant'
    },
    {
      name: 'col1',
      field: 'col1',
      label: '텍스트',
      align: 'left',
      sortable: true,
      required: true,
      setHeader: true,
      style: 'width:100px',
      type: 'text'
    },
    {
      name: 'col2',
      field: 'col2',
      label: '날짜',
      align: 'left',
      sortable: true,
      required: true,
      setHeader: true,
      style: 'width:200px',
      type: 'date'
    },
    {
      name: 'col3',
      field: 'col3',
      label: '작업종류',
      align: 'left',
      sortable: true,
      required: true,
      setHeader: true,
      style: 'width:200px',
      type: 'select',
      codeGroupCd: 'SOP_WORK_TYPE_CD'
    },
    {
      name: 'col4',
      field: 'col4',
      label: '사용여부',
      align: 'center',
      sortable: true,
      setHeader: true,
      style: 'width:100px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'col5',
      field: 'col5',
      label: '첨부',
      align: 'center',
      sortable: true,
      setHeader: true,
      style: 'width:100px',
      type: 'attach'
    },
    {
      name: 'col6',
      field: 'col6',
      label: '파일',
      align: 'center',
      sortable: true,
      setHeader: true,
      style: 'width:100px',
      type: 'file'
    },
    {
      name: 'col7',
      field: 'col7',
      label: '시간',
      align: 'center',
      sortable: true,
      setHeader: true,
      style: 'width:100px',
      type: 'datetime'
    },
    {
      name: 'col8',
      field: 'col8',
      label: '태그',
      align: 'center',
      sortable: true,
      setHeader: true,
      style: 'width:100px',
      type: 'tag'
    }
  ],
  data: [] as Array<any>
})
const gridGas = ref({
  columns: [
    {
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      sortable: true,
      required: true,
      style: 'width:100px',
      type: 'plant'
    },
    {
      name: 'gasName',
      field: 'gasName',
      label: '가스항목명',
      align: 'left',
      sortable: true,
      required: true,
      style: 'width:300px',
      type: 'text'
    },
    {
      name: 'safetyStandards',
      field: 'safetyStandards',
      label: '안전기준',
      align: 'center',
      sortable: true,
      style: 'width:150px',
      type: 'text'
    },
    {
      name: 'equipId',
      field: 'equipId',
      label: '설비',
      align: 'center',
      sortable: true,
      style: 'width:150px',
      type: 'equip'
    },
    {
      name: 'chemFile',
      field: 'chemFile',
      label: '사진',
      align: 'center',
      sortable: true,
      style: 'width:150px',
      type: 'file'
    },
    {
      name: 'workTypes',
      field: 'workTypes',
      label: '작업종류',
      align: 'left',
      sortable: true,
      required: true,
      style: 'width:300px',
      type: 'multiSelect',
      isObject: true,
      valueText: 'sopWorkTypeName',
      valueKey: 'sopWorkTypeCd',
      itemText: 'codeName',
      itemValue: 'code',
      codeGroupCd: 'SOP_WORK_TYPE_CD'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:100px',
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const gridMenu = ref({
  columns: [
    {
      name: 'menuNm',
      field: 'menuNm',
      label: '메뉴명',
      align: 'left',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      style: 'width:80px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})

onMounted(() => {
  getList()
  getGasList()
  getMenuList()
  getEdit()
})

function getEdit() {
  gridEdit.value.data = [
    {
      id: '1',
      mergeId: '1',
      col1: '',
      col2: '',
      col3: '',
      col4: '',
      col5: '',
      col6: '',
      col7: '',
      col8: '',
      col9: '',
      col10: '',
      col11: '',
      col12: '',
      col13: '',
      col14: '',
      col15: ''
    },
    {
      id: '2',
      mergeId: '1',
      col1: '',
      col2: '',
      col3: '',
      col4: '',
      col5: '',
      col6: '',
      col7: '',
      col8: '',
      col9: '',
      col10: '',
      col11: '',
      col12: '',
      col13: '',
      col14: '',
      col15: ''
    },
    {
      id: '3',
      mergeId: '2',
      col1: '',
      col2: '',
      col3: '',
      col4: '',
      col5: '',
      col6: '',
      col7: '',
      col8: '',
      col9: '',
      col10: '',
      col11: '',
      col12: '',
      col13: '',
      col14: '',
      col15: ''
    }
  ]
}
function getList() {
  $http({
    url: selectConfig.sop.swp.workPermit.list.url,
    method: 'GET'
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function getGasList() {
  $http({
    url: selectConfig.sop.swp.gas.list.url,
    method: 'GET'
  }).then((_result: any) => {
    _result.data[0].chemFile = 'A000001340,A000001381,A000001382'
    gridGas.value.data = _result.data
  })
}
function getMenuList() {
  $http({
    url: selectConfig.sys.menu.list.url,
    method: 'GET',
    params: {
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    gridMenu.value.data = _result.data
  })
}

function linkClick() {}

function btnClicked() {}

function rowClick() {}
function addrow() {
  // 초기에는 userId에 tempId를 부여
  gridEdit.value.data.splice(0, 0, {
    id: uid(),
    mergeId: uid(),
    plantCd: null,
    col1: '',
    col2: '',
    col3: null,
    col4: 'Y',
    col5: '',
    col6: '',
    col7: '',
    col8: ''
  })
}
function remove() {
  const selectData = editTable.value.getSelected()
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
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(selectData, (item) => {
          gridEdit.value.data = _.reject(gridEdit.value.data, item)
        })
        editTable.value.compoTable.clearSelection()
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
</script>
