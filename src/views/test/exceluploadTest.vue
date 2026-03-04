<template>
  <c-card title="테스트">
    <template v-slot:card-detail>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-excel-upload :excelUploadInfo="excelUploadInfo" />
      </div>
    </template>
  </c-card>
</template>

<script setup lang="ts">
const excelUploadInfo = ref({
  rowKeys: ['userId'], // 데이터들의 키 속성값
  taskClassCd: 'HEA_CYCLE', // 엑셀업로드 양식 구분 값
  sheetNum: 0,
  columns: [
    [
      {
        required: true,
        name: 'empNo',
        field: 'empNo',
        label: '사번',
        align: 'center',
        style: 'width:100px',
        type: 'readonly',
        sortable: false
      },
      {
        required: true,
        name: 'userName',
        field: 'userName',
        label: '대상자',
        style: 'width:100px',
        align: 'center',
        type: 'readonly',
        sortable: false
      },
      {
        name: 'typeName',
        field: 'typeName',
        label: '검진종류',
        align: 'center',
        style: 'width:100px',
        type: 'readonly',
        sortable: false
      },
      {
        name: 'cycleName',
        field: 'cycleName',
        label: '검진주기',
        align: 'center',
        style: 'width:100px',
        type: 'readonly',
        sortable: false
      },
      {
        name: 'checkupStatus',
        field: 'checkupStatus',
        label: '비고',
        align: 'left',
        style: 'width:300px',
        sortable: false
      }
    ]
  ],
  data: []
})
</script>
