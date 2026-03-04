<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table1"
          title="가중인원 대상부서"
          :merge="grid1.merge"
          tableId="grid1"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :columns="grid1.columns"
          :data="grid1.data"
          :isExcelDown="false"
          selection="multiple"
          rowKey="deptCd"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="부서추가" icon="add" @btnClicked="addDept(1)" v-if="editable" />
              <c-btn
                label="제외"
                icon="remove"
                @btnClicked="removeDept(1)"
                v-if="editable && grid1.data && grid1.data.length > 0"
              />
              <!-- <c-btn label="검색" icon="search" @btnClicked="getList1" /> -->
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table2"
          title="일반 대상부서"
          :merge="grid2.merge"
          tableId="grid2"
          :columnSetting="false"
          :usePaging="false"
          :isFullScreen="false"
          :columns="grid2.columns"
          :data="grid2.data"
          :isExcelDown="false"
          selection="multiple"
          rowKey="deptCd"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="부서추가" icon="add" @btnClicked="addDept(2)" v-if="editable" />
              <c-btn
                label="제외"
                icon="remove"
                @btnClicked="removeDept(2)"
                v-if="editable && grid2.data && grid2.data.length > 0"
              />
              <!-- <c-btn label="검색" icon="search" @btnClicked="getList2" /> -->
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
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
  name: 'uninjuryDept'
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
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
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
  // plantCd: null,
  useFlag: 'Y',
  increaseFlag: 'N'
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid1 = ref<gridType>({
  merge: [],
  columns: [
    // {
    //   name: 'upDeptName',
    //   field: 'upDeptName',
    //   label: '상위부서',
    //   align: 'center',
    //   sortable: false,
    // },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: false
    },
    {
      name: 'increaseFlagName',
      field: 'increaseFlagName',
      label: '무재해대상',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  merge: [],
  columns: [],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const updateUrl = ref('')
const table1 = ref<any>(null)
const table2 = ref<any>(null)

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
  listUrl.value = selectConfig.mdm.dept.list.url
  updateUrl.value = transactionConfig.mdm.dept.update.url + 'increase'
  // code setting
  grid2.value.columns = grid1.value.columns
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  getList1()
  getList2()
}
function getList1() {
  searchParam.value.increaseFlag = 'Y'
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid1.value.data = _result.data
  })
}
function getList2() {
  searchParam.value.increaseFlag = 'X'
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid2.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 1,2번 테이블 부서 추가
 *******************************/
function addDept(num?: number) {
  popupOptions.value.title = num === 1 ? '가중인원 대상부서 추가' : '일반 대상부서 추가'
  popupOptions.value.param = { type: 'multiple' }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@popups/dept/deptPop.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = num === 1 ? closeDept1 : closeDept2
}
function closeDept1(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData: Array<any> = []
    _.forEach(_data, (item) => {
      if (
        _.findIndex(grid1.value.data, { deptCd: item.deptCd }) === -1 &&
        _.findIndex(grid2.value.data, { deptCd: item.deptCd }) === -1
      ) {
        saveData.push({
          increaseFlag: 'Y',
          deptCd: item.deptCd
        })
      }
    })
    $http({
      url: updateUrl.value,
      method: 'PUT',
      data: saveData
    }).then(() => {
      getList1()
    })
  }
}
function closeDept2(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData: Array<any> = []
    _.forEach(_data, (item) => {
      if (
        _.findIndex(grid1.value.data, { deptCd: item.deptCd }) === -1 &&
        _.findIndex(grid2.value.data, { deptCd: item.deptCd }) === -1
      ) {
        saveData.push({
          increaseFlag: 'X',
          deptCd: item.deptCd
        })
      }
    })
    $http({
      url: updateUrl.value,
      method: 'PUT',
      data: saveData
    }).then(() => {
      getList2()
    })
  }
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function removeDept(num?: number) {
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
      message: '무재해 대상에서 제거하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        const saveData: Array<any> = []
        _.forEach(selectData, (item) => {
          saveData.push({
            increaseFlag: 'N',
            deptCd: item.deptCd
          })
        })
        $http({
          url: updateUrl.value,
          method: 'PUT',
          data: saveData
        }).then(() => {
          num === 1 ? getList1() : getList2()
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
