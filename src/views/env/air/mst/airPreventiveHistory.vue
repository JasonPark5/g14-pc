<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table3"
        :title="title"
        :columnSetting="false"
        :isFullScreen="false"
        :columns="grid.columns"
        :filtering="false"
        :data="grid.data"
        selection="multiple"
        rowKey="envAirDailyResultPreventiveHistoryId"
        :editable="editable"
        gridHeight="740px"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn label="추가" v-if="editable" icon="add" @btnClicked="addrow1" />
            <c-btn
              label="삭제"
              v-if="editable && grid.data.length > 0"
              icon="remove"
              @btnClicked="removeRow1"
            />
            <c-btn
              label="저장"
              v-if="editable && grid.data.length > 0"
              icon="save"
              @btnClicked="saveRow1"
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
  name: 'airPreventiveHistory'
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
  columns: [
    {
      name: 'period',
      field: 'period',
      label: '보수기간',
      child: [
        {
          name: 'startDt',
          field: 'startDt',
          label: '보수시작일',
          align: 'center',
          type: 'date',
          style: 'width:100px',
          sortable: true
        },
        {
          name: 'endDt',
          field: 'endDt',
          label: '보수종료일',
          align: 'center',
          type: 'date',
          style: 'width:100px',
          sortable: true
        }
      ]
    },
    {
      name: 'userName',
      field: 'userName',
      label: '보수자',
      align: 'center',
      type: 'user',
      userId: 'userId',
      setHeader: true,
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '보수명세',
      align: 'left',
      type: 'text',
      style: 'width:300px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const detailUrl = ref('')
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const nowplantCd = ref('')
const title = ref('')
const table3 = ref<any>(null)

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
  listUrl.value = selectConfig.env.air.daily.preventive.history.url
  saveUrl.value = transactionConfig.env.air.daily.preventive.history.save.url
  deleteUrl.value = transactionConfig.env.air.daily.preventive.history.delete.url
  // code setting
  // list setting
  getDetail()
  getList()
}
/******************************
 * TODO (목적): 방지시설 조회
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
      title.value = $language('방지시설 보수이력') + ' (' + _result.data.preventiveName + ')'
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
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { envAirMstPreventiveId: props.param.envAirMstPreventiveId }
  }).then((_result: any) => {
    // _result.data = _.map(_result.data, (item) =>
    //   _.extend(item, { repairPeriod: [item.startDt, item.endDt] })
    // )
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addrow1() {
  rowRemoveSelect()
  grid.value.data!.splice(0, 0, {
    plantCd: nowplantCd.value, // 사업장코드
    envAirMstPreventiveId: props.param.envAirMstPreventiveId, // 대기방지시설 일련번호
    envAirDailyResultPreventiveHistoryId: uid(),
    startDt: '',
    endDt: '',
    userId: user.value.userId,
    userName: user.value.userName,
    remark: '',
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): 행 삭제
 *******************************/
function removeRow1() {
  const selectData = table3.value.getSelected()
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
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => (grid.value.data = _.reject(grid.value.data, item)))
          table3.value.compoTable.clearSelection()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveRow1() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    const saveData = grid.value.data!.filter((x) => x.editFlag === 'C' || x.editFlag === 'U')
    // saveData = _.map(saveData, (item) =>
    //   _.extend(item, { startDt: item.repairPeriod[0], endDt: item.repairPeriod[1] })
    // )
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
          }).then(() => {
            message.requestSuccess()
            getList()
            rowRemoveSelect()
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
