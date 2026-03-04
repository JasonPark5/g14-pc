<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
      <c-table
        ref="table1"
        :title="title"
        :columnSetting="false"
        :isFullScreen="false"
        :columns="grid.columns"
        :filtering="false"
        :data="grid.data"
        :gridHeight="gridHeight"
        selection="multiple"
        rowKey="envAirMstPreventivePartId"
        :isExcelDown="false"
        :editable="editable"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn label="추가" v-if="editable" icon="add" @btnClicked="addrow1" />
            <c-btn
              label="삭제"
              v-if="editable && grid.data.length > 0"
              icon="remove"
              @btnClicked="removeRow(1)"
            />
            <c-btn
              label="저장"
              v-if="editable && grid.data.length > 0"
              icon="save"
              @btnClicked="saveRow1"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'customCol'">
            <q-chip
              color="grey-8"
              style="font-size: 11px"
              clickable
              outline
              square
              @click="rowClick(props.row)"
            >
              {{ '보기' }}
            </q-chip>
          </template>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
      <c-table
        ref="table2"
        :title="title2"
        :columnSetting="false"
        :isFullScreen="false"
        :columns="grid2.columns"
        :filtering="false"
        :data="grid2.data"
        :gridHeight="gridHeight"
        selection="multiple"
        rowKey="envAirMstPreventivePartHistoryId"
        :isExcelDown="false"
        :editable="editable"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              label="추가"
              v-if="editable && selectedenvAirMstPreventivePartId"
              icon="add"
              @btnClicked="addrow2"
            />
            <c-btn
              label="삭제"
              v-if="editable && selectedenvAirMstPreventivePartId && grid2.data.length > 0"
              icon="remove"
              @btnClicked="removeRow(2)"
            />
            <c-btn
              label="저장"
              v-if="editable && selectedenvAirMstPreventivePartId && grid2.data.length > 0"
              icon="save"
              @btnClicked="saveRow2"
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
  name: 'airMaster03Part'
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
interface propType {
  param: {
    envAirMstPreventiveId: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
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
const props = withDefaults(defineProps<propType>(), {
  param: () => {
    return {
      envAirMstPreventiveId: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  columns: [],
  data: []
})
const grid2 = ref<gridType>({
  columns: [],
  data: []
})
const editable = ref(true)
const detailUrl = ref('')
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const hislistUrl = ref('')
const hisinsertUrl = ref('')
const hisdeleteUrl = ref('')
const nowplantCd = ref('')
const selectedenvAirMstPreventivePartId = ref('')
const selectedenvAirMstPreventivePartName = ref('')
const title = ref('')
const title2 = ref('부품별 교체/청소 이력')
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const gridHeight = ref('740px')

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
  detailUrl.value = selectConfig.env.air.mst.preventive.get.url
  listUrl.value = selectConfig.env.air.mst.preventive.part.url
  insertUrl.value = transactionConfig.env.air.mst.preventive.part.save.url
  deleteUrl.value = transactionConfig.env.air.mst.preventive.part.delete.url
  hislistUrl.value = selectConfig.env.air.mst.history.list.url
  hisinsertUrl.value = transactionConfig.env.air.mst.history.save.url
  hisdeleteUrl.value = transactionConfig.env.air.mst.history.delete.url
  // code setting
  // list setting
  getDetail()
  grid.value.columns = [
    {
      name: 'envAirMstPreventivePartType',
      field: 'envAirMstPreventivePartType',
      label: '부품타입',
      align: 'center',
      type: 'select',
      required: true,
      codeGroupCd: 'ENV_AIR_MST_OUTLET_PART_TYPE',
      style: 'width:110px',
      sortable: true
    },
    {
      name: 'envAirMstPreventivePartName',
      field: 'envAirMstPreventivePartName',
      label: '부품명',
      align: 'left',
      type: 'text',
      required: true,
      sortable: true
    },
    {
      name: 'cleanCycleTerm',
      field: 'cleanCycleTerm',
      label: '청소주기',
      align: 'center',
      type: 'number',
      style: 'width:70px',
      sortable: true
    },
    {
      name: 'cleanCycleCd',
      field: 'cleanCycleCd',
      label: '청소주기',
      align: 'center',
      type: 'select',
      style: 'width:70px',
      comboItems: [
        { code: 'Y', codeName: $language('년') },
        { code: 'M', codeName: $language('월') },
        { code: 'D', codeName: $language('일') }
      ],
      sortable: true
    },
    {
      name: 'cleanNextDt',
      field: 'cleanNextDt',
      label: '다음청소예정일',
      align: 'center',
      style: 'width:110px',
      sortable: true
    },
    {
      name: 'changeCycleTerm',
      field: 'changeCycleTerm',
      label: '교체주기',
      align: 'center',
      type: 'number',
      style: 'width:70px',
      sortable: true
    },
    {
      name: 'changeCycleCd',
      field: 'changeCycleCd',
      label: '교체주기',
      align: 'center',
      type: 'select',
      style: 'width:70px',
      comboItems: [
        { code: 'Y', codeName: $language('년') },
        { code: 'M', codeName: $language('월') },
        { code: 'D', codeName: $language('일') }
      ],
      sortable: true
    },
    {
      name: 'changeNextDt',
      field: 'changeNextDt',
      label: '다음교체예정일',
      style: 'width:110px',
      align: 'center',
      sortable: true
    },
    {
      name: 'sizeName',
      field: 'sizeName',
      label: '사이즈',
      align: 'center',
      type: 'text',
      style: 'width:130px',
      sortable: true
    },
    {
      name: 'amount',
      field: 'amount',
      label: '수량',
      style: 'width:60px',
      align: 'center',
      type: 'number',
      sortable: true
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '이력',
      align: 'center',
      style: 'width:60px',
      type: 'custom',
      sortable: false
    }
  ]
  grid2.value.columns = [
    {
      name: 'preventivePartExecType',
      field: 'preventivePartExecType',
      label: '구분',
      align: 'center',
      type: 'select',
      style: 'width:70px',
      comboItems: [
        { code: 'OPET000001', codeName: $language('청소') },
        { code: 'OPET000002', codeName: $language('교체') }
      ],
      sortable: true,
      required: true
    },
    {
      name: 'execDt',
      field: 'execDt',
      label: '교체/청소일',
      align: 'center',
      type: 'date',
      style: 'width:120px',
      sortable: true,
      required: true
    },
    {
      name: 'execUserName',
      field: 'execUserName',
      label: '교체/청소자',
      align: 'center',
      type: 'user',
      userId: 'execUserId',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '내용',
      type: 'text',
      align: 'left',
      sortable: true
    }
  ]
  getList()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (props.param.envAirMstPreventiveId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: {
        envAirMstPreventiveId: props.param.envAirMstPreventiveId
      }
    }).then((_result: any) => {
      nowplantCd.value = _result.data.plantCd
      title.value = $language('방지시설 부품목록') + ' (' + _result.data.preventiveName + ')'
    })
  }
}
/******************************
 * TODO (목적): 다른 행 선택시
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) _table.classList.remove('bg-light-blue-1')
  const _table2 = document.getElementsByClassName('bg-light-blue-1')[1]
  if (_table2) _table2.classList.remove('bg-light-blue-1')
}
/******************************
 * TODO (목적): 선택 리셋
 *******************************/
function reset() {
  rowRemoveSelect()
  grid2.value.data = []
  selectedenvAirMstPreventivePartId.value = ''
  selectedenvAirMstPreventivePartName.value = ''
  title2.value = '부품별 교체/청소 이력'
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      envAirMstPreventiveId: props.param.envAirMstPreventiveId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

/******************************
 * TODO (목적): 좌측 테이블의 화살표 아이콘 클릭시 우측에 상세테이블 표시
 *******************************/
function rowClick(row: any) {
  selectedenvAirMstPreventivePartId.value = row.envAirMstPreventivePartId
  selectedenvAirMstPreventivePartName.value = row.envAirMstPreventivePartName
  title2.value =
    $language('부품별 교체/청소 이력') + ' (' + selectedenvAirMstPreventivePartName.value + ')'
  $http({
    url: hislistUrl.value,
    method: 'GET',
    params: { envAirMstPreventivePartId: row.envAirMstPreventivePartId }
  }).then((_result: any) => {
    grid2.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 좌측 테이블 행 추가
 *******************************/
function addrow1() {
  rowRemoveSelect()
  grid2.value.data = []
  selectedenvAirMstPreventivePartId.value = ''
  selectedenvAirMstPreventivePartName.value = ''
  title2.value = '부품별 교체/청소 이력'
  grid.value.data!.push({
    plantCd: nowplantCd.value, // 사업장코드
    envAirMstPreventiveId: props.param.envAirMstPreventiveId, // 대기배출구(방지시설) 일련번호
    envAirMstPreventivePartId: uid(), // 방지시설별 부품 일련번호
    envAirMstPreventivePartName: '', // 방지시설별 부품명
    envAirMstPreventivePartType: null, // 방지시설별 부품타입
    cleanCycleCd: null, // 청소주기구분(일,월,년)
    cleanCycleTerm: null, // 청소주기기간
    cleanNextDt: '', // 다음청소예정일자
    changeCycleCd: null, // 교체주기구분(일,월,년)
    changeCycleTerm: null, // 교체주기기간
    changeNextDt: '', // 다음교체예정일자
    sizeName: '', // 사이즈
    amount: null, // 수량
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 행 삭제
 *******************************/
function removeRow(num?: number) {
  const selectData = num === 1 ? table1.value.getSelected() : table2.value.getSelected()
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
      confirmCallback: () => {
        $http({
          url: num === 1 ? deleteUrl.value : hisdeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          num === 1
            ? _.forEach(selectData, (item) => (grid.value.data = _.reject(grid.value.data, item)))
            : _.forEach(selectData, (item) => (grid2.value.data = _.reject(grid2.value.data, item)))
          num === 1
            ? table1.value.compoTable.clearSelection()
            : table2.value.compoTable.clearSelection()
          num === 1 ? reset() : getList()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 좌측 테이블 행 저장
 *******************************/
function saveRow1() {
  const saveData = grid.value.data!.filter((x) => x.editFlag === 'C' || x.editFlag === 'U')
  _.forEach(saveData, (item) => {
    item.regUserId = user.value.userId
    item.chgUserId = user.value.userId
  })
  if (saveData.length > 0) {
    if (validTable(grid.value.columns, grid.value.data!)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: insertUrl.value,
            method: 'POST',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            getList()
            reset()
          })
        },
        cancelCallback: () => {}
      })
    }
  } else {
    message.alert({
      title: '안내',
      message: '변경된 데이터가 없습니다.',
      type: 'info' // success / info / warning / error
    })
  }
}
/******************************
 * TODO (목적): 우측 테이블 행 추가
 *******************************/
function addrow2() {
  grid2.value.data!.push({
    envAirMstPreventivePartHistoryId: uid(), // 부품 청소/교체 일련번호
    plantCd: nowplantCd.value, // 사업장코드
    envAirMstPreventiveId: props.param.envAirMstPreventiveId, // 대기배출구(방지시설) 일련번호
    envAirMstPreventivePartId: selectedenvAirMstPreventivePartId.value, // 방지시설별 부품 일련번호
    preventivePartExecType: null, // 청소/교체 구분
    execDt: getToday(), // 실시일자
    execUserId: user.value.userId, // 업무 실시자
    execUserName: user.value.userName, // 업무 실시자
    remarks: '', // 내용
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 우측 테이블 행 저장
 *******************************/
function saveRow2() {
  const saveData = grid2.value.data!.filter((x) => x.editFlag === 'C' || x.editFlag === 'U')
  _.forEach(saveData, (item) => {
    item.regUserId = user.value.userId
    item.chgUserId = user.value.userId
  })
  if (saveData.length > 0) {
    if (validTable(grid2.value.columns, grid2.value.data!)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: hisinsertUrl.value,
            method: 'POST',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            _.forEach(saveData, (item) => {
              item.editFlag = null
            })
            getList()
          })
        },
        cancelCallback: () => {}
      })
    }
  } else {
    message.alert({
      title: '안내',
      message: '변경된 데이터가 없습니다.',
      type: 'info' // success / info / warning / error
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
