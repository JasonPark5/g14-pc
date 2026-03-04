<template>
  <div>
    <q-form ref="editForm">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-task-target
                :required="true"
                label="배출구"
                name="envAirMstOutletId"
                :customPopupParam="{ targetKey: 'airOutlet' }"
                v-model:value="searchParam.envAirMstOutletId"
                @dataChange="(data1: any, data2: any, data3: any) => addAirOutletMst(data1, data3)"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :required="true"
                label="가동일자(월)"
                type="month"
                name="operationMonth"
                v-model:value="searchParam.operationMonth"
                @datachange="getList"
              />
            </div>
          </template>
        </c-card>
        <c-card title="시설 기본정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-plant
                :editable="false"
                type="edit"
                name="plantCd"
                v-model:value="airOutletMst.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="false"
                label="배출구 일련번호"
                name="outletSemsId"
                v-model:value="airOutletMst.outletSemsId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="false"
                label="허가증상 배출구번호"
                name="outletPermitNo"
                v-model:value="airOutletMst.outletPermitNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :editable="false"
                label="배출구명"
                name="outletName"
                v-model:value="airOutletMst.outletName"
              />
            </div>
          </template>
        </c-card>
        <c-table
          ref="table"
          :title="`${title} 가동시간 목록`"
          :columns="grid.columns"
          :data="grid.data"
          :usePaging="false"
          :columnSetting="false"
          :filtering="true"
          :isExcelDown="false"
          gridHeight="500px"
          @table-data-change="tableDataChange"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="grid.data"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveOperation"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:table-chip>
            <span style="font-size: 0.8em; font-weight: 500; color: tomato">
              {{ $language('※ 가동시간과 분은 두 자리 숫자 형태로 입력해주세요. 예시) 00, 05') }}
            </span>
          </template>
        </c-table>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import moment from 'moment'
import { airOutletType } from '../mst/airMaster'

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
  name: 'airOutletOpertimeDetail02'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
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
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
  height?: stringNull
}
interface searchParamType {
  plantCd: stringNull
  operationMonth: stringNull
  envAirMstOutletId: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  operationMonth: '',
  envAirMstOutletId: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'operationDate',
      field: 'operationDate',
      label: '가동일자',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'operationHour',
      field: 'operationHour',
      label: '배출구 가동시간(시간)',
      style: 'width:100px',
      type: 'text',
      align: 'center',
      sortable: false,
      setHeader: true
    },
    {
      name: 'operationMin',
      field: 'operationMin',
      label: '배출구 가동시간(분)',
      style: 'width:100px',
      type: 'text',
      align: 'center',
      sortable: false,
      setHeader: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      style: 'width:250px',
      type: 'text',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const airOutletMst = ref<airOutletType>({
  plantCd: null, // 사업장코드
  envAirMstOutletId: '',
  outletSemsId: '', // 대기배출구 일련번호
  outletName: '', // 배출구명
  outletPermitNo: '' // 허가증상 배출구번호
})
const editForm = ref<HTMLFormElement | null>(null)
const editable = ref(true)
const listUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const title = ref('')

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
  listUrl.value = selectConfig.env.air.sems.opertimes.outlet.url
  saveUrl.value = transactionConfig.env.air.sems.opertime.save.url
  // code setting
  searchParam.value.operationMonth = getThisMonth()
  // list setting
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (!searchParam.value.operationMonth || !searchParam.value.envAirMstOutletId) {
    // message.alert({
    //   title: '안내',
    //   message: '배출구와 가동일자를 선택해주세요.',
    //   type: 'warning'
    // })
    title.value = ''
    grid.value.data = []
  } else {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      const [year, month] = searchParam.value.operationMonth.split('-').map(Number)
      const dateList = getAllDatesInMonth(year, month)
      grid.value.data = []
      _.forEach(dateList, (date) => {
        const found = _.find(_result.data, { operationDate: date })
        grid.value.data.push(
          found
            ? found
            : {
                envAirSemsOutletOpertimeId: '',
                envAirMstOutletId: searchParam.value.envAirMstOutletId,
                operationDate: date,
                operationHour: '',
                operationMin: '',
                remark: ''
              }
        )
      })
      title.value = `${airOutletMst.value.outletName} ${searchParam.value.operationMonth.split('-')[1]}월`
    })
  }
}
/******************************
 * TODO (목적): 가동시간 데이터 변경에 따른 editFlag 설정
 *******************************/
function tableDataChange(_props: any) {
  _props.row.editFlag = 'U'
}

/******************************
 * TODO (목적): 배출구 정보 반영
 *******************************/
function addAirOutletMst(_data1: any, _data3: any) {
  if (!_data1) {
    searchParam.value.envAirMstOutletId = _data1
  }
  airOutletMst.value = _data3
  getList()
}

/******************************
 * TODO (목적): 달력 리스트 생성
 *******************************/
function getAllDatesInMonth(year: number, month: number) {
  const start = moment([year, month - 1, 1])
  const end = moment(start).endOf('month')
  const result = []
  const current = start.clone()
  while (current.isSameOrBefore(end)) {
    result.push(current.format('YYYY-MM-DD'))
    current.add(1, 'day')
  }
  return result
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveOperation() {
  mappingType.value = 'PUT'
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      // if ()
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          _.forEach(grid.value.data, (item) => {
            if (!item.envAirSemsOutletOpertimeId) {
              item.editFlag = 'C'
            }
            item.regUserId = user.value.userId
            item.chgUserId = user.value.userId
            item.envAirMstOutletId = searchParam.value.envAirMstOutletId
          })
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
