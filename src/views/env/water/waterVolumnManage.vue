<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            type="year"
            label="기준년도"
            name="trustYear"
            v-model:value="searchParam.trustYear"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="월별 폐수 전량위탁 처리량 목록"
      :columns="grid.columns"
      :gridHeight="grid.height"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      selection="multiple"
      rowKey="waterTrustVolumeId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- <c-btn label="올바로데이터 업로드" icon="add" @btnClicked="openUpload" /> -->
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable && grid.data && grid.data.length > 0"
            label="삭제"
            icon="delete"
            @btnClicked="deleteInfo"
          />
          <c-btn
            v-if="editable && grid.data && grid.data.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'waterVolumnManage'
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
  plantCd: null,
  trustYear: ''
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
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
      name: 'trustYm',
      field: 'trustYm',
      label: '기준월',
      align: 'center',
      style: 'width:180px',
      sortable: true,
      type: 'date',
      dateType: 'month'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '작성부서',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'userName',
      field: 'userName',
      label: '작성자',
      align: 'center',
      sortable: false,
      style: 'width:120px',
      type: 'user',
      userId: 'userId',
      deptName: 'deptName'
    },
    {
      name: 'trustVolume',
      field: 'trustVolume',
      type: 'number',
      label: '폐수 전량위탁 처리량(kg)',
      align: 'center',
      sortable: true,
      style: 'width:180px'
    },
    {
      name: 'reVolume',
      field: 'reVolume',
      type: 'number',
      label: '폐수 재활용 판매량(kg)',
      align: 'center',
      sortable: true,
      style: 'width:180px'
    },
    {
      name: 'salesVolume',
      field: 'salesVolume',
      type: 'number',
      label: '생산량(kg)',
      align: 'center',
      sortable: true,
      style: 'width:180px'
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const deleteUrl = ref('')
const saveUrl = ref(transactionConfig.env.water.trust.insert.url)
const table = ref<any>(null)

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
  listUrl.value = selectConfig.env.water.trust.list.url
  deleteUrl.value = transactionConfig.env.water.trust.deleteAll.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
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
 * TODO (목적): 행 추가
 *******************************/
function add() {
  grid.value.data?.splice(0, 0, {
    waterTrustVolumeId: uid(),
    plantCd: searchParam.value.plantCd || null,
    trustYm: getThisMonth(),
    trustVolume: '',
    reVolume: '',
    salesVolume: '',
    userId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function save() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
          item.trustYear = item.trustYm.split('-')[0]
          item.trustMonth = item.trustYm.split('-')[1]
        })
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

/******************************
 * TODO (목적): 선택 행 삭제
 *******************************/
function deleteInfo() {
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
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (item) => (grid.value.data = _.reject(grid.value.data, item)))
          table.value.compoTable.clearSelection()
          message.requestSuccess()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
