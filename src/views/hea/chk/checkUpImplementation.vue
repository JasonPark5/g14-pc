<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker
          required
          label="대상년도"
          name="year"
          type="year"
          default="today"
          v-model:value="searchParam.year"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-dept
          type="search"
          :isFirstValue="false"
          label="부서"
          name="deptCd"
          v-model:value="searchParam.deptCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-field label="대상자" name="userId" v-model:value="searchParam.userId" />
      </div>
      <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
        <c-select
          codeGroupCd="JOB_CLASS_CD"
          type="search"
          itemText="codeName"
          itemValue="code"
          label="직종"
          name="jobClassCd"
          v-model:value="searchParam.jobClassCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-checkbox
          :editable="editable"
          trueLabel="O"
          falseLabel="전체"
          codeGroupCd="CHECK_UP_TYPE_CD"
          itemText="codeName"
          itemValue="code"
          label="검진종류"
          name="checkupFlags"
          v-model:value="searchParam.checkupFlags"
        />
      </div>
      <!-- <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col-xl-2">
        <c-checkbox
          :editable="editable"
          :isFlag="true"
          trueLabel="O"
          falseLabel="전체"
          label="일반검진"
          name="normalFlag"
          v-model:value="searchParam.normalFlag"
        />
      </div>
      <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col-xl-2">
        <c-checkbox
          :editable="editable"
          :isFlag="true"
          trueLabel="O"
          falseLabel="전체"
          label="초음파검진"
          name="ultrasoundFlag"
          v-model:value="searchParam.ultrasoundFlag"
        />
      </div>
      <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col-xl-2">
        <c-checkbox
          :editable="editable"
          :isFlag="true"
          trueLabel="O"
          falseLabel="전체"
          label="배치전검진"
          name="batchFlag"
          v-model:value="searchParam.batchFlag"
        />
      </div> -->
    </template>
  </c-search-box>
  <c-table
    ref="table"
    title="건강진단 실시이력"
    tableId="table"
    :merge="grid.merge"
    :columns="grid.columns"
    :data="grid.data"
    rowKey="userId"
    :columnSetting="false"
  >
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn
          v-if="editable"
          :url="saveUrl"
          :isSubmit="isSave"
          :param="grid.data"
          mappingType="PUT"
          label="저장"
          icon="save"
          @beforeAction="saveRemark"
          @btnCallback="saveCallback"
        />
        <c-btn label="검색" icon="search" @btnClicked="getList" />
      </q-btn-group>
    </template>
  </c-table>
  <c-dialog :param="popupOptions" />
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
  name: 'checkUpImplementation'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
  deptCd: null,
  userId: null,
  year: '',
  checkupFlags: [],
  // synthesisFlag: 'N',
  // normalFlag: 'N',
  // ultrasoundFlag: 'N',
  // batchFlag: 'N',
  jobClassCd: null
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  merge: [
    { index: 0, colName: 'upDeptCd' },
    { index: 1, colName: 'deptCd' }
    // { index: 2, colName: 'deptCd' }
  ],
  columns: [
    // {
    //   name: 'plantName',
    //   field: 'plantName',
    //   style: 'width: 80px',
    //   label: '사업장',
    //   align: 'center',
    //   sortable: true,
    //   fix: true
    // },
    {
      name: 'upDeptName',
      field: 'upDeptName',
      style: 'width: 100px',
      label: '상위소속',
      align: 'center',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      style: 'width: 100px',
      label: '부서',
      align: 'center',
      sortable: true
    },
    {
      name: 'empNo',
      field: 'empNo',
      label: '사번',
      style: 'width: 100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'userName',
      field: 'userName',
      style: 'width: 100px',
      label: '성명',
      align: 'center',
      sortable: true
    },
    {
      name: 'spotName',
      field: 'spotName',
      style: 'width: 80px',
      label: '직위',
      align: 'center',
      sortable: true
    },
    // {
    //   name: 'jobName',
    //   field: 'jobName',
    //   style: 'width: 80px',
    //   label: '직책',
    //   align: 'center',
    //   sortable: true
    // },
    {
      name: 'jobClassName',
      field: 'jobClassName',
      style: 'width: 80px',
      label: '직종',
      align: 'center',
      sortable: true
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      style: 'width: 100px',
      label: '생년월일',
      align: 'center',
      sortable: true
    },
    {
      name: 'age',
      field: 'age',
      style: 'width: 60px',
      label: '연령',
      align: 'center',
      sortable: true
    },
    {
      name: 'enterDate',
      field: 'enterDate',
      label: '입사일',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'workPeriod',
      field: 'workPeriod',
      label: '근속년수',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'normalDate',
      field: 'normalDate',
      label: '일반검진',
      style: 'width: 100px',
      align: 'center',
      helpcomment:
        '1. 본사 사무직을 제외한 생산직 근무자들은 1회/1년 실시<br> ' +
        '2. 종합검진 대상자는 제외<br> ' +
        '3. 직위 : 임시직 및 계약직 제외',
      sortable: true
    },
    {
      name: 'specialDate',
      field: 'specialDate',
      label: '특수검진',
      style: 'width: 100px',
      align: 'center',
      helpcomment:
        '1. 유해인자에 노출되는 업무 종사 근로자<br> ' +
        '2. 건강진단 결과 유소견자로 판정받아 작업 전환을 하거나 작업장소를 변경하여 해당 판정의 원인이 된 특수건강진단 대상업무에 종사하지 아니하는 사람<br> ' +
        '3. 진단주기 : 유해인자 종류에 따라 1회/6개월~2년 > 자세한 정보는 [특수건강진단 주기 및 도래일 관리] 메뉴 참조',
      sortable: true
    },
    // {
    //   name: 'synthesisFlag',
    //   field: 'synthesisFlag',
    //   label: '종합검진',
    //   style: 'width: 80px',
    //   align: 'center',
    //   helpcomment:
    //     '1. 인사기록 상 연령 : 41, 43, 45, 47, 49, 51, 53, 55 + 56세 이상<br> ' +
    //     '2. 근속년수 : 4년 이상<br> ' +
    //     '3. 직위 : 임시직 및 계약직 제외 ',
    //   sortable: true
    // },
    // {
    //   name: 'ultrasoundFlag',
    //   field: 'ultrasoundFlag',
    //   label: '초음파검진',
    //   style: 'width:80px',
    //   align: 'center',
    //   helpcomment:
    //     '1. 연 1회 실시 <br>' +
    //     '2. 직위 : 임시직 및 계약직 제외 <br> ' +
    //     '3. 단, 계약직 중 무기계약직은 포함 <br> ' +
    //     '4. 종합검진 대상자는 제외',
    //   sortable: true
    // }
    {
      name: 'batchDate',
      field: 'batchDate',
      label: '배치전검진',
      style: 'width:100px',
      helpcomment:
        '1. 입사일 다음날<br/>2. 새로운 물질을 다루거나 다른 유기용제를 취급하는 반으로 이동할 경우',
      align: 'center',
      sortable: true
    },
    {
      name: 'batchAfter',
      field: 'batchAfter',
      label: '배치후검진',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      type: 'textarea',
      // style: 'width: 250px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)

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
  listUrl.value = selectConfig.hea.checkup.implementation.list.url
  saveUrl.value = transactionConfig.hea.checkup.implementation.save.url
  // code setting
  searchParam.value.year = getThisYear()
  // list setting
  getList()
}

/******************************
 * TODO (목적): 검진수검여부 목록조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

/******************************
 * TODO (목적): 목록의 데이터 변경하여 저장
 *******************************/
function saveRemark() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (row: any) => (row.year = searchParam.value.year))
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getList()
}
</script>
