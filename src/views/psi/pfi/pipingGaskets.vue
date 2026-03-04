<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            label="분류코드"
            name="pipeTypeCd"
            v-model:value="searchParam.pipeTypeCd">
          </c-text>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            label="유체의명칭또는구분"
            name="pipeName"
            v-model:value="searchParam.pipeName">
          </c-text>
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :customPopupParam="{ targetKey: 'process' }"
            :plantCd="searchParam.plantCd"
            label="관련공정"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept type="search" label="관리부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="pipegasket"
      title="배관 및 개스킷 목록"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      rowKey="psiPipeGasketId"
      :columnSetting="false"
      :expandAll="true"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="엑셀업로드" icon="upload" @btnClicked="excelUploadData" />
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
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
  name: 'pipingGaskets'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  deviceName: '',
  pipeTypeCd: '',
  pipeName: '',
  processCd: '',
  deptCd: ''
})
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'pipeTypeCd' },
    { index: 1, colName: 'pipeTypeCd' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    // {
    //   name: 'revisionNum',
    //   field: 'revisionNum',
    //   label: 'Rev.',
    //   align: 'center',
    //   style: 'width:50px',
    //   sortable: true,
    // },
    {
      name: 'pipeTypeCd',
      field: 'pipeTypeCd',
      label: '분류코드',
      align: 'center',
      type: 'link',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'pipeName',
      field: 'pipeName',
      label: '유체의명칭 또는 구분',
      style: 'width:200px',
      align: 'left',
      sortable: true
    },
    {
      name: 'designPress',
      field: 'designPress',
      label: '설계압력(MPa)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'designTemp',
      field: 'designTemp',
      label: '설계온도(℃)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'pipeMaterial',
      field: 'pipeMaterial',
      label: '배관재질',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'gasketMaterial',
      field: 'gasketMaterial',
      label: '개스킷 재질 및 형태',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'noneDestructPercent',
      field: 'noneDestructPercent',
      label: '비파괴검사율(%)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'afterHeatTreatFlag',
      field: 'afterHeatTreatFlag',
      label: '후열처리여부',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'remarks',
      field: 'remarks',
      label: '비고',
      align: 'left',
      style: 'width:180px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')

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
  listUrl.value = selectConfig.psi.pfi.pipegasket.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 장치 및 설비 조회
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
 * TODO (목적): 링크 클릭 시 팝업 표시
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '배관 및 개스킷 상세'
  popupOptions.value.param = {
    psiPipeGasketId: row ? row.psiPipeGasketId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./pipingGasketsDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '90%'
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 엑셀 업로드
 *******************************/
function excelUploadData() {
  popupOptions.value.title = '배관 및 개스킷 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./pipingGasketsExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
function closeExcelUploadPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item: any) => !item.error_message)
    _.forEach(s_data, (item) => {
      // item.plantCd = searchParam.value.plantCd
      item.sysRevision = 1
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    $http({
      url: transactionConfig.psi.pfi.pipegasket.insert.url + '/excel',
      method: 'POST',
      data: s_data
    }).then(() => {
      message.requestSuccess()
      getList()
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
