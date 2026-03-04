<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-table
          ref="typeTable"
          title="평가종류"
          tableId="kindgrid"
          :columns="kindgrid.columns"
          :data="kindgrid.data"
          @rowClick="getItemList"
          :usePaging="false"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          :isExcelDown="false"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
        <c-table
          ref="itemTable"
          title="평가항목"
          tableId="itemgrid"
          :columns="itemgrid.columns"
          :data="itemgrid.data"
          :usePaging="false"
          :columnSetting="false"
          selection="multiple"
          rowKey="mdmVendorEvaluationItemId"
        >
          <template v-slot:table-chip>
            <q-chip
              dense
              outline
              square
              :label="selectedCodeName"
              color="blue"
              style="float: left"
            />
            <span style="float: left; position: relative; top: 4px" class="q-mx-sm"
              >평가항목 구분 :</span
            >
            <c-select
              class="no-label-control"
              style="display: inline; float: left; width: 160px"
              :editable="editable"
              codeGroupCd="VENDOR_EVALUATION_TYPE_CD"
              type="search"
              itemText="codeName"
              itemValue="code"
              name="vendorEvaluationTypeCd"
              v-model:value="searchParam.vendorEvaluationTypeCd"
              @update:value="getItemList2"
            />
            <c-radio
              style="display: inline; float: left; width: 200px"
              :comboItems="[
                { code: 'Y', codeName: $language('사용') },
                { code: 'N', codeName: $language('미사용') },
                { code: null, codeName: $language('전체') }
              ]"
              class="no-label-control q-ml-md"
              label=""
              dense
              name="useFlag"
              v-model:value="searchParam.useFlag"
              @input="getItemList2"
            />
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="" icon="add" @btnClicked="addrow" v-if="editable && isSelectGrp" />
              <!-- <c-btn
                label="삭제"
                icon="remove"
                @btnClicked="removeRow"
                v-if="editable && isSelectGrp && itemgrid.data.length > 0"
              /> -->
              <c-btn
                label=""
                icon="save"
                @btnClicked="saveMst"
                v-if="editable && isSelectGrp && itemgrid.data.length > 0"
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
  name: 'vendorAssessItem'
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
  plantCd: stringNull
  useFlag: stringNull
  vendorEvaluationTypeCd?: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<codeMasterType>
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
  plantCd: null,
  useFlag: 'Y',
  vendorEvaluationTypeCd: null
})
const itemTable = ref<any>(null)
const editable = ref(true)
const useFlagItems = ref<Array<any>>([])
const isSelectGrp = ref(false)
const selectedGroup = ref<codeMasterType>({
  code: null,
  codeName: null
})
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const typeTable = ref<any>(null)
const kindgrid = ref<gridType>({
  columns: [
    {
      name: 'codeName',
      field: 'codeName',
      label: '평가종류',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const itemgrid = ref<gridType>({
  columns: [
    {
      name: 'vendorEvaluationTypeCd',
      field: 'vendorEvaluationTypeCd',
      label: '평가항목구분',
      align: 'left',
      type: 'select',
      codeGroupCd: 'VENDOR_EVALUATION_TYPE_CD',
      style: 'width:160px',
      sortable: false,
      required: true
    },
    {
      name: 'itemNm',
      field: 'itemNm',
      label: '평가항목명',
      align: 'left',
      type: 'text',
      style: 'width:400px',
      sortable: false,
      required: true
    },
    {
      name: 'scoring',
      field: 'scoring',
      label: '배점',
      align: 'center',
      type: 'number',
      style: 'width:50px',
      sortable: false,
      required: true
    },
    {
      name: 'standardScore',
      field: 'standardScore',
      label: '기준점수',
      child: [
        {
          name: 'scoreGreat',
          field: 'scoreGreat',
          label: '우수',
          align: 'center',
          type: 'number',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'scoreCommonly',
          field: 'scoreCommonly',
          label: '보통',
          align: 'center',
          type: 'number',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'scoreInadequate',
          field: 'scoreInadequate',
          label: '미흡',
          align: 'center',
          type: 'number',
          style: 'width:50px',
          sortable: false
        }
      ]
    },
    {
      name: 'evaluationCriteria',
      field: 'evaluationCriteria',
      label: '평가기준',
      align: 'center',
      type: 'text',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'orderNo',
      field: 'orderNo',
      label: '정렬순서',
      align: 'center',
      type: 'number',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:60px',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
/******************************
 * @Computed_선언
 *******************************/
const selectedCodeName = computed(() => selectedGroup.value.codeName)

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
  listUrl.value = selectConfig.mdm.cim.vendor.item.list.url
  saveUrl.value = transactionConfig.mdm.cim.vendor.item.save.url
  deleteUrl.value = transactionConfig.mdm.cim.vendor.item.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getComboItems('VENDOR_EVALUATION_KIND_CD').then((_result) => {
    kindgrid.value.data = _result
  })
}
function getItemList(_row: any) {
  isSelectGrp.value = true
  selectedGroup.value = _row
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      useFlag: searchParam.value.useFlag,
      vendorEvaluationKindCd: _row.code
    }
  }).then((_result: any) => {
    itemgrid.value.data = _result.data
  })
}
function getItemList2() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      useFlag: searchParam.value.useFlag || 'Y',
      vendorEvaluationKindCd: selectedGroup.value.code,
      vendorEvaluationTypeCd: searchParam.value.vendorEvaluationTypeCd || null
    }
  }).then((_result: any) => {
    itemgrid.value.data = _result.data
  })
}
function addrow() {
  itemgrid.value.data.push({
    plantCd: searchParam.value.plantCd, // 사업장코드
    mdmVendorEvaluationItemId: uid(), // 평가항목 일련번호
    vendorEvaluationKindCd: selectedGroup.value.code, // 평가종류코드
    vendorEvaluationTypeCd: searchParam.value.vendorEvaluationTypeCd || null,
    itemNm: '', // 평가항목명
    scoring: null, // 배점
    scoreGreat: null, // 우수 기준점수
    scoreCommonly: null, // 보통 기준점수
    scoreInadequate: null, // 미흡 기준점수
    evaluationCriteria: '', // 평가기준
    orderNo: itemgrid.value.data.length + 1, // 정렬순서
    useFlag: 'Y', // 사용여부
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
function saveMst() {
  if (validTable(itemgrid.value.columns, itemgrid.value.data)) {
    const saveData = itemgrid.value.data.filter((x: any) => x.editFlag == 'C' || x.editFlag == 'U')
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: saveUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            message.requestSuccess()
            getItemList(selectedGroup.value)
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
// function removeRow() {
//   const selectData = itemTable.value.getSelected()
//   if (!selectData || selectData.length === 0) {
//     message.alert({
//       title: '안내',
//       message: '선택된 항목이 없습니다.',
//       type: 'warning' // success / info / warning / error
//     })
//   } else {
//     message.confirm({
//       title: '확인',
//       message: '삭제하시겠습니까?',
//       type: 'warning', // success / info / warning / error
//       confirmCallback: () => {
//         $http({
//           url: deleteUrl.value,
//           method: 'DELETE',
//           data: Object.values(selectData)
//         }).then((_result: any) => {
//           message.requestSuccess()
//           _.forEach(selectData, (item) => {
//             itemgrid.value.data = _.reject(itemgrid.value.data, item)
//           })
//           itemTable.value.compoTable.clearSelection()
//         })
//       },
//       cancelCallback: () => {}
//     })
//   }
// }
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
