<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8">
        <c-table
          ref="table"
          title="판정 설비별 목록"
          :columns="grid.columns"
          :data="grid.data"
          gridHeight="860px"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :isExcelDown="false"
          :isFullScreen="false"
          @table-data-change="tableDataChange"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :isSubmit="isSave1"
                :url="saveUrl"
                :param="grid.saveData"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveEquipChecklist"
                @btnCallback="saveEquipChecklistCallback"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
        <c-table
          ref="table"
          title="판정 정비·운전 목록"
          :columns="grid2.columns"
          :data="grid2.data"
          gridHeight="860px"
          :filtering="false"
          :columnSetting="false"
          :usePaging="false"
          :isExcelDown="false"
          :isFullScreen="false"
          @table-data-change="tableDataChange"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :isSubmit="isSave2"
                :url="saveUrl"
                :param="grid2.saveData"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveCheckDriveChecklist"
                @btnCallback="saveCheckDriveChecklistCallback"
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
  name: 'determinationChecklist'
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
interface gridType {
  columns: Array<tableColumnType>
  data: Array<any>
  saveData: Array<any>
  itemCds: Array<string>
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
const editable = ref(true)
const grid = ref<gridType>({
  columns: [
    {
      name: 'mocCheckItemName',
      field: 'mocCheckItemName',
      label: '변경요소',
      align: 'center',
      sortable: true,
      style: 'width:130px'
    }
  ],
  data: [],
  saveData: [],
  itemCds: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'mocCheckItemName',
      field: 'mocCheckItemName',
      label: '변경요소',
      align: 'center',
      sortable: true,
      style: 'width:200px'
    }
  ],
  data: [],
  saveData: [],
  itemCds: []
})
const listUrl = ref('')
const saveUrl = ref('')
const isSave1 = ref(false)
const isSave2 = ref(false)

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
  listUrl.value = selectConfig.sop.moc.determination.list.url
  saveUrl.value = transactionConfig.sop.moc.determination.save.url
  // code setting
  getComboItems('MOC_CHECK_TYPE_CD').then((_result: any) => {
    const columns1 = _.filter(_result, { attrVal1: 'equip' }) as Array<codeMasterType>
    const columns2 = _.filter(_result, { attrVal1: 'check-dirve' }) as Array<codeMasterType>

    grid.value.itemCds = _.map(columns1, 'code')
    grid2.value.itemCds = _.map(columns2, 'code')

    if (columns1 && columns1.length > 0) {
      _.forEach(columns1, (column) => {
        grid.value.columns.push({
          name: column.code,
          field: column.code,
          label: column.codeName,
          align: 'center',
          sortable: true,
          style: 'width:' + String(30 + column.codeName.length * 10) + 'px',
          type: 'check',
          true: 'Y',
          false: 'N'
        })
      })
    }
    if (columns2 && columns2.length > 0) {
      _.forEach(columns2, (column) => {
        grid2.value.columns.push({
          name: column.code,
          field: column.code,
          label: column.codeName,
          align: 'center',
          sortable: true,
          style: 'width:' + String(30 + column.codeName.length * 10) + 'px',
          type: 'check',
          true: 'Y',
          false: 'N'
        })
      })
    }
  })
  // list setting
  getList('equip')
  getList('check-dirve')
}
/******************************
 * TODO (목적): 판정 설비별/정비·운전 조회
 * @param (1): 설비별, 정비·운전 구분
 *******************************/
function getList(itemType: string) {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      itemType: itemType
    }
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      if (itemType === 'equip') {
        grid.value.data = _result.data
      } else {
        grid2.value.data = _result.data
      }
    }
  })
}
/******************************
 * TODO (목적): 테이블 변경에 따른 editFlag 처리
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tableDataChange(props: any, col: tableColumnType) {
  if (props.row[col.name + '_edit_flag'] !== 'C') {
    props.row[col.name + '_edit_flag'] = 'U'
  }
}
/******************************
 * TODO (목적): 판정 설비별 저장 전 처리
 *******************************/
function saveEquipChecklist() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        grid.value.saveData = []
        _.forEach(grid.value.data, (item) => {
          for (const key in item) {
            if (_.indexOf(grid.value.itemCds, key) > -1) {
              grid.value.saveData.push({
                mocCheckTypeCd: key, // 체크 구분 코드
                mocCheckItemCd: item.mocCheckItemCd, // 체크 항목 코드
                mocChecklistTypeCd: 'MCT0000001', // 체크리스트 타입 코드
                useFlag: item[key], // 사용 여부
                regUserId: user.value.userId, // 등록자 ID
                chgUserId: user.value.userId, // 수정자 ID
                editFlag: item[key + '_edit_flag']
              })
            }
          }
        })
        isSave1.value = !isSave1.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 판정 설비별 저장 후 처리
 *******************************/
function saveEquipChecklistCallback() {
  message.requestSuccess()
  getList('equip')
}
/******************************
 * TODO (목적): 판정 정비·운전 저장 전 처리
 *******************************/
function saveCheckDriveChecklist() {
  if (validTable(grid2.value.columns, grid2.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        grid2.value.saveData = []
        _.forEach(grid2.value.data, (item) => {
          for (const key in item) {
            if (_.indexOf(grid2.value.itemCds, key) > -1) {
              grid2.value.saveData.push({
                mocCheckTypeCd: key, // 체크 구분 코드
                mocCheckItemCd: item.mocCheckItemCd, // 체크 항목 코드
                mocChecklistTypeCd: 'MCT0000005', // 체크리스트 타입 코드
                useFlag: item[key], // 사용 여부
                regUserId: user.value.userId, // 등록자 ID
                chgUserId: user.value.userId, // 수정자 ID
                editFlag: item[key + '_edit_flag']
              })
            }
          }
        })
        isSave2.value = !isSave2.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 판정 정비·운전 저장 후 처리
 *******************************/
function saveCheckDriveChecklistCallback() {
  message.requestSuccess()
  getList('check-dirve')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
