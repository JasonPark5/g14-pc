<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            label="인터락번호"
            name="interLockNo"
            v-model:value="searchParam.interLockNo">
          </c-text>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            label="대상설비"
            name="facilityName"
            v-model:value="searchParam.facilityName">
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
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="interlock"
          title="인터락 작동조건 및 가동중지 범위 목록"
          :columns="grid.columns"
          :data="grid.data"
          rowKey="psiInterLockId"
          :columnSetting="false"
          :expandAll="true"
          @linkClick="linkClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                label="엑셀업로드"
                icon="upload"
                @btnClicked="excelUploadData"
              />
              <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
              <c-btn label="검색" icon="search" @btnClicked="getList" />
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
  name: 'interlockOperation'
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
  plantCd: '',
  interLockNo: '',
  facilityName: '',
  processCd: '',
  deptCd: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: 'Rev.',
      align: 'center',
      style: 'width:50px',
      sortable: true
    },
    {
      name: 'interLockNo',
      field: 'interLockNo',
      label: '인터락 번호',
      align: 'center',
      style: 'width:100px',
      type: 'link',
      sortable: true
    },
    {
      name: 'facilityName',
      field: 'facilityName',
      label: '대상설비',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      label: '설정값',
      style: 'width:80px',
      align: 'center',
      child: [
        {
          name: 'temperature',
          field: 'temperature',
          label: '온도(℃)',
          align: 'center',
          style: 'width:80px',
          sortable: true
        },
        {
          name: 'pressure',
          field: 'pressure',
          label: '압력(MPa)',
          align: 'center',
          style: 'width:80px',
          sortable: true
        },
        {
          name: 'liquidLevel',
          field: 'liquidLevel',
          label: '액위(m)',
          align: 'center',
          style: 'width:80px',
          sortable: true
        },
        {
          name: 'etc',
          field: 'etc',
          label: '기타',
          align: 'center',
          style: 'width:80px',
          sortable: true
        }
      ]
    },
    {
      name: 'detectorNum',
      field: 'detectorNum',
      label: '감지기번호',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'lastOperationEquipment',
      field: 'lastOperationEquipment',
      label: '최종작동설비',
      align: 'center',
      style: 'width:160px',
      sortable: true
    },
    {
      name: 'operationStopRange',
      field: 'operationStopRange',
      label: '가동중지범위',
      align: 'left',
      style: 'width:180px',
      sortable: true
    },
    {
      name: 'checkCycle',
      field: 'checkCycle',
      label: '점검주기',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      style: 'width:120px'
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
  listUrl.value = selectConfig.psi.pcd.interlock.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 동력기계 조회
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
  popupOptions.value.title = '인터락 작동조건 및 가동중지 범위 상세'
  popupOptions.value.param = {
    psiInterLockId: row ? row.psiInterLockId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./interlockOperationDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
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
  popupOptions.value.title = '인터락 작동조건 및 가동중지 목록 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./interlockOperationExcelUpload.vue`))
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
      // item.plantCd = this.searchParam.plantCd
      item.sysRevision = 1
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    $http({
      url: transactionConfig.psi.pcd.interlock.insert.url + '/excel',
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
