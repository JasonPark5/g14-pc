<template>
  <div>
    <q-form ref="editForm">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-plant
                :required="true"
                type="edit"
                name="plantCd"
                v-model:value="searchParam.plantCd"
                @datachange="getList"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :required="true"
                label="가동일자"
                name="operationDate"
                v-model:value="searchParam.operationDate"
                @datachange="getList"
              />
            </div>
          </template>
        </c-card>
        <c-table
          ref="table"
          :title="`${searchParam.operationDate ? searchParam.operationDate : ''} 배출구 가동시간 목록`"
          :columns="grid.columns"
          :data="grid.data"
          :usePaging="true"
          :columnSetting="false"
          :filtering="true"
          :isExcelDown="false"
          gridHeight="598px"
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
  name: 'airOutletOpertimeDetail01'
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
const searchParam = ref({
  plantCd: null,
  operationDate: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'outletSemsId',
      field: 'outletSemsId',
      label: '배출구일련번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'outletPermitNo',
      field: 'outletPermitNo',
      label: '허가증상배출구번호',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'outletName',
      field: 'outletName',
      label: '배출구명',
      style: 'width:200px',
      align: 'left',
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
      style: 'width:200px',
      type: 'text',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const editForm = ref<HTMLFormElement | null>(null)
const editable = ref(true)
const listUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')

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
  listUrl.value = selectConfig.env.air.sems.opertimes.day.url
  saveUrl.value = transactionConfig.env.air.sems.opertime.save.url
  // code setting
  searchParam.value.operationDate = getToday()
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  if (searchParam.value.operationDate === null || searchParam.value.plantCd === null) {
    grid.value.data = []
    // message.alert({
    //   title: '안내',
    //   message: '사업장과 가동일자를 선택해주세요.',
    //   type: 'warning'
    // })
  } else {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      grid.value.data = _result.data
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
            item.operationDate = searchParam.value.operationDate
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
