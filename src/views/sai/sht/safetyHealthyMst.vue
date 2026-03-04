<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="안전보건 목표"
        :columns="grid.columns"
        :data="grid.data"
        :merge="grid.merge"
        :columnSetting="false"
        :isExcelDown="false"
        :isFullScreen="false"
        :filtering="false"
        :usePaging="false"
        selection="multiple"
        rowKey="saiSafetyHealthyDetailId"
        @table-data-change="tableDataChange"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="엑셀업로드" icon="upload" @btnClicked="excelUploadData" />
            <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addMaster" />
            <c-btn
              v-if="editable"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="saveData"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveMaster"
              @btnCallback="saveMasterCallback"
            />
            <c-btn v-if="editable" label="삭제" icon="remove" @btnClicked="removeRow" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'targetName'">
            <c-text-column
              :editable="editable"
              :col="col"
              :props="props"
              v-model:value="props.row[col.name]"
              @datachange="datachange(props, col)"
            />
            <div v-if="editable">
              <q-btn-group outline class="ColumInnerBtnGroup">
                <q-btn
                  icon="add"
                  color="red-6"
                  text-color="white"
                  class="ColumInnerBtn"
                  align="center"
                  @click.prevent="innerBtnClicked(col, props)"
                >
                  <q-tooltip>
                    {{ $language('안전보건 목표별 항목 추가') }}
                  </q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>
          </template>
        </template>
      </c-table>
      <c-dialog :param="popupOptions" />
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
// import { kMaxLength } from 'buffer'
import {
  safetyHealthyMstType,
  safetyHealthyMasterType,
  safetyHealthyMstExcelType
} from './safetyHealthyMst'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyHealthyMst'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
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
interface gridType {
  columns: tableColumnType
  data: Array<safetyHealthyMstType>
  merge?: Array<tableMergeType>
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
const editable = ref(true)
const table = ref<any>(null)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  // plantCd: null,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  // merge: [
  //   { index: 0, colName: 'saiSafetyHealthyId' },
  //   { index: 1, colName: 'saiSafetyHealthyId' }
  // ],
  columns: [
    {
      required: true,
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      type: 'plant'
    },
    {
      required: true,
      name: 'targetName',
      field: 'targetName',
      label: '안전보건 목표',
      align: 'left',
      style: 'width:290px',
      sortable: false,
      type: 'custom'
    },
    {
      required: true,
      name: 'detailName',
      field: 'detailName',
      label: '세부추진사항',
      align: 'left',
      sortable: false,
      type: 'text'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '해당부서',
      align: 'center',
      style: 'width:200px',
      sortable: false,
      type: 'deptMulti',
      deptCd: 'deptCd',
      isFirstValue: false
    },
    {
      required: true,
      name: 'kpiAttrCd',
      field: 'kpiAttrCd',
      label: '지표속성',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      type: 'select',
      itemText: 'codeName',
      itemValue: 'code'
    },
    {
      // required: true,
      name: 'kpiDirectionCd',
      field: 'kpiDirectionCd',
      label: '지표방향',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      type: 'select',
      itemText: 'codeName',
      itemValue: 'code'
    },
    {
      // required: true,
      name: 'kpiUnit',
      field: 'kpiUnit',
      label: '지표단위',
      align: 'left',
      sortable: true,
      style: 'width:60px',
      type: 'text'
    },
    {
      name: 'kpi',
      field: 'kpi',
      label: 'KPI성과지표',
      align: 'left',
      style: 'width:200px',
      type: 'text',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      sortable: false,
      style: 'width:80px',
      type: 'number'
    }
  ],
  data: []
})
const useFlagItems = ref<Array<codeMasterType>>([])
const saveData = ref<Array<safetyHealthyMasterType>>([])
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const excelUrl = ref('')
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
  listUrl.value = selectConfig.sai.safetyHealthy.base.list.url
  saveUrl.value = transactionConfig.sai.safetyHealthy.base.save.url
  excelUrl.value = transactionConfig.sai.safetyHealthy.base.save.url + '/excel'
  deleteUrl.value = transactionConfig.sai.safetyHealthy.base.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  getComboItems('KPI_ATTR_CD').then((_result) => {
    getComboItems('KPI_DIRECTION_CD').then((_result2) => {
      grid.value.columns[4].comboItems = _result
      grid.value.columns[5].comboItems = _result2
    })
  })
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getList() {
  grid.value.data = []
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 데이터 변경 시 수정자 정보 셋팅
 * @param (1): 행 전체 정보
 *******************************/
function datachange(_props: any, _col: tableColumnType) {
  if (_props.row['mstEditFlag'] !== 'C') {
    _props.row['mstEditFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // table.value.acceptData(_props.row, _col.name, _props.row[_col.name])
}
/******************************
 * TODO (목적): 데이터 변경 시 수정자 정보 셋팅
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tableDataChange(_props: any, _col: tableColumnType) {
  if (_col.name !== 'gubunName' && _props.row['itemEditFlag'] !== 'C') {
    _props.row['itemEditFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // Check if kpiAttrCd is '정량' and kpiDirectionCd is not selected
  if (_props.row['kpiAttrCd'] === 'KAC0000001' && !_props.row['kpiDirectionCd']) {
    message.alert({
      title: '안내',
      message: '지표속성이 정량인 경우 지표방향을 반드시 선택해야 합니다.',
      type: 'warning' // success / info / warning / error
    })
  }
  // table.value.acceptData(_props.row, _col.name, _props.row[_col.name])
}

/******************************
 * TODO (목적): 마스터 추가
 *******************************/
function addMaster() {
  grid.value.data.splice(0, 0, {
    // grid.value.data.push({
    saiSafetyHealthyId: uid(), // 안전보건목표 일련번호
    plantCd: null, // 사업장
    targetName: '', // 안전보건목표
    detailName: '', // 세부추진사항
    deptName: '', // 해당부서
    kpi: '', // KPI성과지표
    kpiAttrCd: '', // 지표속성
    kpiDirectionCd: '', // 지표방향
    kpiUnit: '', // 지표단위
    sortOrder: '',
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자
    mstEditFlag: 'C',
    editFlag: 'C',
    itemEditFlag: 'C'
  })
}
/******************************
 * TODO (목적): 행 추가 버튼 클릭
 * @param (1): 컬럼 정보
 * @param (2): 행 전체 정보
 *******************************/
function innerBtnClicked(coltd: tableColumnType, propstd: any) {
  grid.value.data.splice(propstd.rowIndex, 0, {
    // grid.value.data.push({
    saiSafetyHealthyDetailId: uid(), // 안전보건목표 세부추진사항 일련번호
    plantCd: propstd.row.plantCd, // 사업장
    targetName: propstd.row.targetName, // 안전보건목표
    saiSafetyHealthyId: propstd.row.saiSafetyHealthyId, // 안전보건목표 일련번호
    detailName: '', // 세부추진사항
    deptCd: null, // 해당부서
    kpi: '', // kpi 성과지표
    kpiAttrCd: '', // 지표속성
    kpiDirectionCd: '', // 지표방향
    kpiUnit: '', // 지표단위
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자
    itemEditFlag: 'C',
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveMaster() {
  if (validTable(grid.value.columns, grid.value.data)) {
    /** [구분 - 항목] 데이터 분리 : 분리시 수정&등록된 데이터만 처리 */
    const _saveData: Array<safetyHealthyMstType> = grid.value.data.filter((item2) => {
      return (
        item2.mstEditFlag === 'C' ||
        item2.mstEditFlag === 'U' ||
        item2.itemEditFlag === 'C' ||
        item2.itemEditFlag === 'U' ||
        item2.editFlag === 'C' ||
        item2.editFlag === 'U'
      )
    })
    saveData.value = _.map(_.uniqBy(_saveData, 'saiSafetyHealthyId'), (mst3) => {
      return {
        saiSafetyHealthyId: mst3.saiSafetyHealthyId, // 법규등록부 구분 일련번호
        plantCd: mst3.plantCd,
        targetName: mst3.targetName,
        useFlag: 'Y', // 사용여부
        editFlag: mst3.mstEditFlag,
        regUserId: user.value.userId,
        chgUserId: user.value.userId,
        items: _.map(
          _.filter(_saveData, { saiSafetyHealthyId: mst3.saiSafetyHealthyId }),
          (item3: any) => {
            return {
              saiSafetyHealthyId: mst3.saiSafetyHealthyId, // 법규등록부 구분 일련번호
              saiSafetyHealthyDetailId: item3.saiSafetyHealthyDetailId, // 법규등록부 항목 일련번호
              detailName: item3.detailName, // 세부추진사항
              deptCd: item3.deptCd, // 해당부서
              kpi: item3.kpi, // kpi성과지표
              kpiAttrCd: item3.kpiAttrCd, // 지표속성
              kpiDirectionCd: item3.kpiDirectionCd, // 지표방향
              kpiUnit: item3.kpiUnit, // 지표단위
              useFlag: item3.useFlag, // 사용여부
              sortOrder: item3.sortOrder,
              editFlag: item3.editFlag,
              regUserId: user.value.userId,
              chgUserId: user.value.userId
            }
          }
        )
      }
    }) as Array<safetyHealthyMasterType>
    if (saveData.value.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
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
 * TODO (목적): 저장 후 callback
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveMasterCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * TODO (목적): 엑셀업로드 팝업오픈
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function excelUploadData() {
  popupOptions.value.title = '안전보건목표 기준정보 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sai/sht/safetyHealthyMstExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
/******************************
 * TODO (목적): 엑셀업로드 팝업 닫은 후 데이터 처리
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeExcelUploadPopup(_result: Array<safetyHealthyMstExcelType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data: Array<safetyHealthyMstExcelType> = _.filter(_result, (item) => {
      return !item.error_message
    })
    const mst_data: Array<safetyHealthyMasterType> = []
    const mst_data_targetName: Array<string> = []
    _.forEach(s_data, (item1) => {
      item1.useFlag = 'Y'
      item1.regUserId = user.value.userId // 등록자 ID
      if (_.indexOf(mst_data_targetName, item1.targetName) < 0) {
        mst_data_targetName.push(item1.targetName)
        mst_data.push({
          saiSafetyHealthyId: uid(), // 안전보건목표 일련번호
          plantCd: item1.plantCd, // 사업장
          targetName: item1.targetName, // 안전보건목표
          useFlag: 'Y', // 사용여부
          regUserId: user.value.userId, // 등록자
          items: []
        })
      }
    })
    _.forEach(mst_data, (_mst) => {
      _.forEach(s_data, (item2) => {
        if (_mst.targetName == item2.targetName) {
          item2.useFlag = 'Y'
          item2.regUserId = user.value.userId // 등록자 ID
          _mst.items.push({
            saiSafetyHealthyId: _mst.saiSafetyHealthyId, // 법규등록부 구분 일련번호
            saiSafetyHealthyDetailId: uid(), // 법규등록부 항목 일련번호
            detailName: item2.detailName, // 세부추진사항
            deptCd: item2.deptCd, // 해당부서
            kpi: item2.kpi, // kpi성과지표
            kpiAttrCd: item2.kpiAttrCd, // 지표속성
            kpiDirectionCd: item2.kpiDirectionCd, // 지표방향
            kpiUnit: item2.kpiUnit, // 지표단위
            useFlag: 'Y', // 사용여부
            sortOrder: item2.sortOrder,
            regUserId: user.value.userId,
            chgUserId: user.value.userId
          })
        }
      })
    })

    $http({
      url: excelUrl.value,
      method: 'POST',
      data: mst_data
    }).then((_result: any) => {
      message.requestSuccess()
      getList()
    })
  }
}

/******************************
 * TODO (목적): 행 삭제
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
      // 확인 callback 함수
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
