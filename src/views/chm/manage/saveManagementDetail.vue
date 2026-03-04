<template>
  <div>
    <div class="row">
      <div class="col-12">
        <c-card title="화학자재 상세정보" class="cardClassDetailInfo">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <div class="row">
                <div class="col-xs-12 col-sm-7 col-md-7 col-lg-7">
                  <c-task-target
                    :required="true"
                    :editable="editable"
                    :disabled="isOld"
                    :customPopupParam="{
                      targetKey: 'chemMaterial',
                      param: { toxicFlag: 'Y' }
                    }"
                    label="화학자재"
                    name="mdmChemMaterialId"
                    v-model:value="inout.mdmChemMaterialId"
                    @getDetailTask="chemMaterialInfo"
                  />
                </div>
                <div class="col-xs-12 col-sm-5 col-md-5 col-lg-5">
                  <c-select
                    :disabled="true"
                    :editable="editable"
                    codeGroupCd="USAGE_CD"
                    type="edit"
                    itemText="codeName"
                    itemValue="code"
                    name="usageCd"
                    label="용도"
                    v-model:value="inout.usageCd"
                  />
                </div>
                <div
                  class="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                  v-for="(item, idx) in reguls"
                  :key="idx"
                >
                  <span class="formLabelTitle txtlabel">{{ item.label }}</span>
                  <q-space />
                  <q-checkbox
                    v-for="(_item, _idx) in item.child"
                    :key="_idx"
                    :disable="true"
                    :label="$language(_item.label)"
                    dense
                    class="customqcbox"
                    color="orange-custom"
                    true-value="Y"
                    false-value="N"
                    v-model="_item.vals"
                  />
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <c-table
                ref="table"
                title="구성물질"
                tableId="table1"
                :columns="gridChemRegul.columns"
                :data="gridChemRegul.data"
                :columnSetting="false"
                :filtering="false"
                :usePaging="false"
                :hideBottom="true"
                gridHeight="220px"
              />
            </div>
          </template>
        </c-card>
      </div>
    </div>
    <c-table
      ref="inoutTable"
      class="q-mt-sm"
      title="보관/저장 관리대장"
      :columns="gridInout.columns"
      :data="gridInout.data"
      :gridHeight="gridHeight"
      :filtering="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="chmSaveManageId"
      :editable="editable"
      @table-data-change="tableDataChange"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="printFlag" label="출력" icon="print" @btnClicked="print" />
          <c-btn
            v-if="editable && !disabled"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="add"
          />
          <c-btn
            v-if="editable && !disabled && gridInout.data.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteItem"
          />
          <c-btn
            v-if="editable && !disabled && gridInout.data.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="gridInout.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:customHeader>
        <c-select
          v-if="yearMonthItems && yearMonthItems.length > 0"
          :comboItems="yearMonthItems"
          type="search"
          itemText="codeName"
          itemValue="code"
          name="yearmonth"
          label=""
          v-model:value="inout.yearmonth"
          @datachange="changeYearMonth"
        />
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
import moment from 'moment'
import { saveManagementType } from './saveManagement'
import { chemHeaderType, chemMaterialType } from '@/views/mdm/mam/chemMaterial'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'saveManagementDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
  popupParam: {
    mdmChemMaterialId: string
  }
  contentHeight?: string
}
interface gridInoutType {
  columns: Array<tableColumnType>
  data: Array<saveManagementType>
  prevData: Array<saveManagementType>
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      mdmChemMaterialId: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const inout = ref({
  mdmChemMaterialId: '', // 화학자재 일련번호
  materialName: '',
  materialCd: '', // 자재코드
  mdmChemMaterialCd: '',
  mdmChemMaterialName: '',
  yearmonth: '', // 년월
  makeFlag: 'N',
  impFlag: 'N',
  buyFlag: 'N',
  usingFlag: 'N',
  expFlag: 'N',
  salesFlag: 'N',
  usageCd: null
})
const reguls = ref<Array<chemHeaderType>>([])
const gridChemRegul = ref({
  columns: [
    {
      name: 'chemName',
      field: 'chemName',
      label: '화학물질',
      align: 'left',
      sortable: true
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'limitRepval',
      field: 'limitRepval',
      label: '함유량(%)',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const gridInout = ref<gridInoutType>({
  columns: [],
  data: [],
  prevData: []
})
const yearMonthItems = ref([])
const printFlag = ref(false)
const substanceUrl = ref('')
const regulUrl = ref('')
const listUrl = ref('')
const yearMonthUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const printUrl = ref('')
const isSave = ref(false)
const inoutTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 310
      : 400
  if (height < 400) {
    height = 400
  }
  return `${String(height)}px`
})
const disabled = computed(() => !inout.value.mdmChemMaterialId)
const isOld = computed(() => {
  const savedData = _.filter(gridInout.value.data, (item) => {
    return item.editFlag !== 'C'
  })
  return savedData && savedData.length > 0
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
  substanceUrl.value = selectConfig.mdm.mam.chem.substance.url
  regulUrl.value = selectConfig.mdm.mam.chem.header.value.url
  listUrl.value = selectConfig.chm.save.list.url
  yearMonthUrl.value = selectConfig.chm.save.yearMonth.url
  saveUrl.value = transactionConfig.chm.save.save.url
  deleteUrl.value = transactionConfig.chm.save.delete.url
  printUrl.value = selectConfig.chm.save.print.url
  // code setting
  // list setting
  setInout()
}
/******************************
 * TODO (목적): 입출고 테이블 헤더 셋팅
 *******************************/
function setHeader() {
  gridInout.value.columns = [
    {
      name: 'inoutDate',
      field: 'inoutDate',
      label: '입출고일',
      align: 'center',
      style: 'width:140px',
      sortable: false,
      type: 'date',
      start: inout.value.yearmonth ? inout.value.yearmonth + '-01' : '',
      end: inout.value.yearmonth
        ? moment(inout.value.yearmonth).endOf('month').format('YYYY-MM-DD')
        : '',
      required: true,
      headerCustom: true
    },
    {
      name: 'facilityCd',
      field: 'facilityCd',
      label: '취급시설',
      align: 'left',
      style: 'width:160px',
      sortable: false,
      type: 'facility',
      facilityInfo: {
        facilityName: 'facilityName'
      },
      required: true
    },
    {
      name: 'in',
      field: 'in',
      label: '입고량',
      align: 'center',
      child: [
        {
          name: 'carryover',
          field: 'carryover',
          label: '이월량',
          align: 'right',
          style: 'width:80px',
          sortable: false
        },
        {
          name: 'purchase',
          field: 'purchase',
          label: '위탁인',
          child: [
            {
              name: 'inVendorCd',
              field: 'inVendorCd',
              label: '상호',
              align: 'center',
              style: 'width:160px',
              sortable: false,
              type: 'vendor',
              vendorInfo: {
                vendorName: 'inVendorName',
                bizNo: 'inCorpRegistrationNumber',
                address: 'inAddress',
                chargeName: 'inUserName',
                phoneNo: 'inPhoneNumber'
              }
            },
            {
              name: 'inCorpRegistrationNumber',
              field: 'inCorpRegistrationNumber',
              label: '사업자등록번호',
              align: 'center',
              style: 'width:100px',
              sortable: false
            },
            {
              name: 'inAddress',
              field: 'inAddress',
              label: '주소',
              align: 'left',
              style: 'width:200px',
              sortable: false
            },
            {
              name: 'inAmount',
              field: 'inAmount',
              label: '수량',
              align: 'right',
              style: 'width:70px',
              sortable: false,
              type: 'number'
            }
          ]
        }
      ]
    },
    {
      name: 'out',
      field: 'out',
      label: '출고량',
      align: 'center',
      child: [
        {
          name: 'sale',
          field: 'sale',
          label: '위탁인',
          child: [
            {
              name: 'outVendorCd',
              field: 'outVendorCd',
              label: '상호',
              align: 'center',
              style: 'width:160px',
              sortable: false,
              type: 'vendor',
              vendorInfo: {
                vendorName: 'outVendorName',
                bizNo: 'outCorpRegistrationNumber',
                address: 'outAddress',
                chargeName: 'outUserName',
                phoneNo: 'outPhoneNumber'
              }
            },
            {
              name: 'outCorpRegistrationNumber',
              field: 'outCorpRegistrationNumber',
              label: '사업자등록번호',
              align: 'center',
              style: 'width:100px',
              sortable: false
            },
            {
              name: 'outAddress',
              field: 'outAddress',
              label: '주소',
              align: 'left',
              style: 'width:200px',
              sortable: false
            },
            {
              name: 'outAmount',
              field: 'outAmount',
              label: '수량',
              align: 'right',
              style: 'width:70px',
              sortable: false,
              type: 'number'
            }
          ]
        }
      ]
    },
    {
      name: 'inventory',
      field: 'inventory',
      label: '재고량',
      align: 'right',
      style: 'width:70px',
      sortable: false
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      align: 'left',
      style: 'width:150px',
      sortable: false,
      type: 'text'
    }
  ]
}
/******************************
 * TODO (목적): 입출고 데이터 조회를 위한 셋팅 및 호출
 *******************************/
function setInout() {
  if (props.popupParam.mdmChemMaterialId) {
    inout.value.mdmChemMaterialId = _.clone(props.popupParam.mdmChemMaterialId)
  }
  setHeader()
  getList()
  getYearMonth()
  getReguls()
}
/******************************
 * TODO (목적): 입출고 데이터 조회
 * @param (1): 과거 이력 표시 여부
 *******************************/
function getList(isPrev?: boolean) {
  if (!inout.value.mdmChemMaterialId && !props.popupParam.mdmChemMaterialId) {
    printFlag.value = false
    return
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      mdmChemMaterialId: inout.value.mdmChemMaterialId || props.popupParam.mdmChemMaterialId,
      yearMonth: inout.value.yearmonth,
      prevFlag: !isPrev ? '' : true
      // facilities: !isPrev ? '' : _.map(this.facilities, 'facilityCd'),
    }
  }).then((_result: any) => {
    if (!isPrev) {
      gridInout.value.data = _result.data
      printFlag.value = gridInout.value.data && gridInout.value.data.length > 0
      getList(true)
    } else {
      gridInout.value.prevData = _result.data
    }
  })
}
/******************************
 * TODO (목적): 입출고 년월 그룹 조회
 *******************************/
function getYearMonth() {
  $http({
    url: yearMonthUrl.value,
    method: 'GET',
    params: {
      mdmChemMaterialId: inout.value.mdmChemMaterialId || props.popupParam.mdmChemMaterialId
    }
  }).then((_result: any) => {
    yearMonthItems.value = _result.data
  })
}
/******************************
 * TODO (목적): 화학자재 제품분류 조회
 *******************************/
function getReguls() {
  $http({
    url: regulUrl.value,
    method: 'GET',
    params: {
      mdmChemMaterialId: inout.value.mdmChemMaterialId || props.popupParam.mdmChemMaterialId
    }
  }).then((_result: any) => {
    reguls.value = _.filter(_result.data, (item) => {
      return item.id === 'D140' || item.id === 'D100'
    })
  })
}
/******************************
 * TODO (목적): 화학자재 구성성분 조회
 *******************************/
function getSubstance() {
  $http({
    url: substanceUrl.value,
    method: 'GET',
    params: {
      mdmChemMaterialId: inout.value.mdmChemMaterialId || props.popupParam.mdmChemMaterialId,
      delFlag: 'N'
    }
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      _.forEach(_result.data, (item) => {
        item.chemName = item.chemNmEn + '(' + item.chemNmKr + ')'
      })
    }
    gridChemRegul.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 화학자재 정보 변경에 따른 조회
 * @param (1): 화학자재 정보
 *******************************/
function chemMaterialInfo(taskData: chemMaterialType) {
  // 규제사항 재조회
  getReguls()
  // 구성물질 재조회
  getSubstance()
  // 자재 정보 셋팅
  _.extend(inout.value, taskData)
  props.popupParam.mdmChemMaterialId = inout.value.mdmChemMaterialId

  // 입출고 데이터 조회 (신규등록 시 있는지 확인)
  getList()
  getYearMonth()
}
/******************************
 * TODO (목적): 년월 변경에 따른 입출고 정보 조회
 *******************************/
function changeYearMonth() {
  setHeader()
  getList()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function tableDataChange(_props: any, col: tableColumnType) {
  if (col.name === 'inoutDate') {
    //  || col.name === 'facilityCd'
    // 1. 입출고일 2. 저장시설
    //   - 입출고일이 있는지 확인
    //   - 입출고일 & 저장시설 동일 데이터가 있는지 확인
    //   - 전 데이터 기준으로 재고량을 이월량 & 재고량으로 옮기기
    // ** 이전 데이터 중 최신 데이터를 찾는다.
    checkDate(_props, true)
    getList(true)
  } else if (col.name === 'inAmount' || col.name === 'outAmount') {
    //  3. 입고량 4. 출고량
    //   - 입출고일이 있는지 확인
    //   - 재고량 = 재고량 + 입고량
    //   - 입출고일 & 저장시설 기점으로 이후데이터 차례대로 이월량 및 재고량 변경
    //       이월량 : 전 데이터 재고량
    //       재고량 : 전 데이터 이월량 + 입고량 - 출고량
    checkDate(_props, false)
  }
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
    _props.row.chgUserId = user.value.userId
  }
}
/******************************
 * TODO (목적): 날짜 유효성 검증
 * @param (1): 행 전체 정보
 * @param (2): 동일 날짜 여부 체크
 *******************************/
function checkDate(_props: any, sameDataCheck: boolean) {
  if (_props.row.inoutDate) {
    // props.row.facilityCd &&
    if (sameDataCheck) {
      const filterLen = _.filter(gridInout.value.data, {
        inoutDate: _props.row.inoutDate
      }).length
      if (filterLen > 1) {
        message.alert({
          title: '안내', // 안내
          message: '입출고일이 동일한 데이터가 존재합니다.',
          type: 'warning' // success / info / warning / error
        })
        return
      }
    }
    const filterData = _.sortBy(gridInout.value.data, 'inoutDate')
    if (filterData && filterData.length > 0) {
      const _idx = _.findIndex(filterData, { inoutDate: _props.row.inoutDate })
      if (_idx > 0) {
        // 전 데이터가 존재
        _props.row.carryover = Number(filterData[_idx - 1].inventory)
        _props.row.inventory =
          Number(filterData[_idx - 1].inventory) +
          Number(_props.row.inAmount) -
          Number(_props.row.outAmount)
      } else {
        // 첫 데이터
        _props.row.carryover = 0
        _props.row.inventory = Number(_props.row.inAmount) - Number(_props.row.outAmount)
        // }
      }
      if (_props.row.editFlag !== 'C') {
        _props.row.editFlag = 'U'
        _props.row.chgUserId = user.value.userId
      }

      if (!sameDataCheck && _idx + 1 < filterData.length) {
        for (let i = _idx + 1; i < filterData.length; i++) {
          filterData[i].carryover = Number(filterData[i - 1].inventory)
          filterData[i].inventory =
            Number(filterData[i - 1].inventory) +
            Number(filterData[i].inAmount) -
            Number(filterData[i].outAmount)
          if (filterData[i].editFlag !== 'C') {
            filterData[i].editFlag = 'U'
            filterData[i].chgUserId = user.value.userId
          }
        }
      }
    }
  }
}
/******************************
 * TODO (목적): 입출고 데이터 추가
 *******************************/
function add() {
  // 시설이 필터링 되어 있는 경우 추가버튼 클릭 시 시설을 자동으로 적용
  gridInout.value.data.splice(0, 0, {
    chmSaveManageId: uid(), // 입출고 번호
    mdmChemMaterialId: inout.value.mdmChemMaterialId, // 화학자재 일련번호
    materialCd: inout.value.mdmChemMaterialCd, // 자재코드
    inoutDate: '', // 입출고일
    carryover: 0, // 이월량
    inAmount: 0, // 입고량
    inVendorCd: '', // 구입업체코드
    inVendorName: '', // 구입업체명
    inCorpRegistrationNumber: '', // 구입업체 사업자등록번호
    inAddress: '', // 구입업체 주소
    outAmount: 0, // 출고령
    outVendorCd: '', // 판매업체코드
    outVendorName: '', // 판매업체
    outCorpRegistrationNumber: '', // 판매업체 사업자등록번호
    outAddress: '', // 판매업체 주소
    inventory: 0, // 재고량
    remarks: '', // 비고
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 입출고 데이터 저장 전 처리
 *******************************/
function save() {
  if (validTable(gridInout.value.columns, gridInout.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 입출고 데이터 저장 후 처리
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
  getYearMonth()
}
/******************************
 * TODO (목적): 입출고 데이터 삭제
 *******************************/
function deleteItem() {
  const selectData = inoutTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    let filterData = _.cloneDeep(gridInout.value.data)
    _.forEach(selectData, (item) => {
      filterData = _.reject(filterData, item)
    })

    if (
      _.findIndex(filterData, (item) => {
        return !item.inoutDate // !item.facilityCd || !item.inoutDate
      }) > -1
    ) {
      message.alert({
        title: '안내',
        message:
          '선택한 행을 삭제 후 이월량&재고량을 업데이트합니다. 그 과정에서 입출고일&저장시설이 입력되지 않은 행이 있으면 삭제되지 않으므로 빈 데이터를 입력후 진행바랍니다.',
        type: 'warning' // success / info / warning / error
      })
      return
    }
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
          // message.requestSuccess();
          _.forEach(selectData, (item) => {
            gridInout.value.data = _.reject(gridInout.value.data, item)
          })
          inoutTable.value.compoTable.clearSelection()
          allDataUpdate()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 입출고 전체 데이터 update (재고)
 *******************************/
function allDataUpdate() {
  /**
   * 1. 입출고일 기준으로 오름차순 정렬
   * 2. 재고량 & 이월량 업데이트
   * 3. 저장
   */
  const splitData = _.sortBy(gridInout.value.data, 'inoutDate')
  if (splitData && splitData.length > 0) {
    let idx = 0
    _.forEach(splitData, (item) => {
      if (idx > 0) {
        item.carryover = Number(splitData[idx - 1].inventory)
        item.inventory =
          Number(splitData[idx - 1].inventory) + Number(item.inAmount) - Number(item.outAmount)
      } else {
        item.carryover = 0
        item.inventory = Number(item.inAmount) - Number(item.outAmount)
      }
      if (item.editFlag !== 'C') {
        item.editFlag = 'U'
        item.chgUserId = user.value.userId
      }
      idx++
    })
  }

  isSave.value = !isSave.value
}
/******************************
 * TODO (목적): 입출고 출력
 *******************************/
function print() {
  console.log('inout.value', inout.value)
  $http({
    url: printUrl.value,
    method: 'GET',
    params: {
      mdmChemMaterialId: inout.value.mdmChemMaterialId || props.popupParam.mdmChemMaterialId,
      yearMonth: inout.value.yearmonth
    }
  }).then((_result: any) => {
    const fileOrgNm =
      inout.value.mdmChemMaterialName +
      '_' +
      inout.value.yearmonth +
      ' 보관ㆍ저장  관리대장' +
      '.xlsx'
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
