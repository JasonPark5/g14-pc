<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-table
        ref="vendorUserTable"
        title="협력업체 근무인원"
        tableId="vendorUserTable"
        :columns="grid.columns"
        :data="grid.data"
        gridHeight="790px"
        :usePaging="false"
        :hideBottom="true"
        :columnSetting="false"
        selection="multiple"
        rowKey="vendorUserCd"
        @table-data-change="tableDataChange"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable && parentVendorCd" label="추가" icon="add" @btnClicked="addrow" />
            <c-btn
              v-if="editable && parentVendorCd && grid.data.length > 0"
              label="삭제"
              icon="remove"
              @btnClicked="removerow"
            />
            <c-btn
              v-if="editable && parentVendorCd && grid.data.length > 0"
              label="저장"
              icon="save"
              @btnClicked="saveVendorUser"
            />
          </q-btn-group>
        </template>
      </c-table>
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
  name: 'vendorUser'
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
interface propType {
  parentVendorCd?: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  parentVendorCd: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref<gridType>({
  columns: [],
  data: []
})
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const vendorUserTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.parentVendorCd,
  () => {
    if (props.parentVendorCd) {
      getVendorUserList({ vendorCd: props.parentVendorCd })
    } else {
      grid.value.data = []
    }
  }
)
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
  listUrl.value = selectConfig.mdm.cim.vendor.user.list.url
  saveUrl.value = transactionConfig.mdm.cim.vendor.user.save.url
  deleteUrl.value = transactionConfig.mdm.cim.vendor.user.delete.url
  // code setting
  getComboItems('SEX_CD').then((sexFlag) => {
    grid.value.columns = [
      {
        name: 'personName',
        field: 'personName',
        label: '이름',
        align: 'center',
        sortable: false,
        style: 'width:100px',
        type: 'text',
        fix: true
      },
      {
        name: 'birthDate',
        field: 'birthDate',
        label: '생년월일',
        style: 'width:120px',
        type: 'date',
        align: 'center',
        sortable: false
      },
      {
        name: 'sexCd',
        field: 'sexCd',
        label: '성별',
        align: 'center',
        style: 'width:65px',
        sortable: false,
        valueName: 'codeName',
        itemText: 'codeName',
        itemValue: 'code',
        type: 'select',
        comboItems: sexFlag
      },
      {
        name: 'jobName',
        field: 'jobName',
        label: '직책',
        style: 'width:100px',
        type: 'text',
        align: 'center',
        sortable: false
      },
      // {
      //   name: 'dailyEmployFlag',
      //   field: 'dailyEmployFlag',
      //   label: '일용직여부',
      //   style: 'width:50px',
      //   type: 'check',
      //   'true': 'Y',
      //   'false': 'N',
      //   align: 'center',
      //   sortable: false,
      // },
      {
        name: 'mobileNo',
        field: 'mobileNo',
        label: '연락처',
        style: 'width:120px',
        align: 'center',
        type: 'text',
        mask: '###-####-####',
        sortable: false
      },
      {
        name: 'employDate',
        field: 'employDate',
        label: '근무기간',
        style: 'width:200px',
        align: 'center',
        type: 'date',
        range: true,
        sortable: false
      },
      {
        name: 'educationFlag',
        field: 'educationFlag',
        label: '안전교육이수여부',
        align: 'center',
        sortable: false,
        child: [
          {
            name: 'industrySafetyEdcationFlag',
            field: 'industrySafetyEdcationFlag',
            label: '산업',
            style: 'width:55px',
            type: 'check',
            true: 'Y',
            false: 'N',
            align: 'center',
            sortable: false
          },
          {
            name: 'constructionSafetyEdcationFlag',
            field: 'constructionSafetyEdcationFlag',
            label: '건설',
            style: 'width:55px',
            type: 'check',
            true: 'Y',
            false: 'N',
            align: 'center',
            sortable: false
          }
        ]
      },
      // {
      //   name: 'remarks',
      //   field: 'remarks',
      //   label: '비고',
      //   align: 'left',
      //   type: 'text',
      //   style: 'width:100px',
      //   sortable: false,
      // },
      {
        name: 'attach',
        field: 'attach',
        label: '이수증 첨부파일',
        align: 'center',
        style: 'width:180px',
        type: 'attach',
        taskClassCd: 'VENDOR_USER_EDUCATION',
        keyText: 'vendorUserCd',
        sortable: false
      }
    ]
    if (props.parentVendorCd) {
      getVendorUserList({ vendorCd: props.parentVendorCd })
    }
  })
  // list setting
}
/******************************
 * TODO (목적): 도급업체 직원 조회
 *******************************/
function getVendorUserList(row: any) {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { vendorCd: row.vendorCd }
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      _.forEach(_result.data, (item) => {
        item.employDate = [item.employStartDate, item.employEndDate]
      })
    }
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): Table Change
 *******************************/
function tableDataChange(_props: any, col: tableColumnType) {
  if (col.name === 'employDate' && _props.row[col.name] && _props.row[col.name].length > 0) {
    _props.row.employStartDate = _props.row[col.name][0]
    _props.row.employEndDate = _props.row[col.name][1]
  } else {
    _props.row.employStartDate = ''
    _props.row.employEndDate = ''
  }
}
/******************************
 * TODO (목적): 도급업체 직원 추가
 *******************************/
function addrow() {
  // 초기에는 userId에 tempId를 부여
  grid.value.data.splice(0, 0, {
    editFlag: 'C',
    vendorCd: props.parentVendorCd,
    vendorUserCd: uid(),
    personName: '',
    birthDate: '',
    sexCd: null,
    jobName: '',
    dailyEmployFlag: 'N',
    employStartDate: '',
    employEndDate: '',
    employDate: [],
    industrySafetyEdcationFlag: 'N',
    constructionSafetyEdcationFlag: 'N',
    remarks: ''
  })
}
/******************************
 * TODO (목적): 도급업체 직원 저장
 *******************************/
function saveVendorUser() {
  if (validTable(grid.value.columns, grid.value.data)) {
    const saveData = grid.value.data.filter((x) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          _.forEach(saveData, (_item) => {
            if (_item.employDate.length > 0) {
              _item.employStartDate = _item.employDate[0]
              _item.employEndDate = _item.employDate[1]
            }
          })
          $http({
            url: saveUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            message.requestSuccess()
            getVendorUserList({ vendorCd: props.parentVendorCd })
          })
        },
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
 * TODO (목적): 도급업체 직원 삭제
 *******************************/
function removerow() {
  const selectData = vendorUserTable.value.getSelected()
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
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          message.requestSuccess()
          vendorUserTable.value.compoTable.clearSelection()
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
