<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            label="계기번호"
            name="valveRuptureNo"
            v-model:value="searchParam.valveRuptureNo">
          </c-text>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            label="내용물"
            name="inMaterial"
            v-model:value="searchParam.inMaterial">
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
      ref="valveRupture"
      title="안전밸브 및 파열판 목록"
      :columns="grid.columns"
      :data="grid.data"
      rowKey="psiValveRuptureId"
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
  name: 'safetyValveRuptureDisk'
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
  valveRuptureNo: '',
  inMaterial: '',
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
      sortable: true,
      fix: true
    },
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: 'Rev.',
      align: 'center',
      style: 'width:50px',
      sortable: true,
      fix: true
    },
    {
      name: 'valveRuptureNo',
      field: 'valveRuptureNo',
      label: '계기번호',
      align: 'center',
      style: 'width:120px',
      type: 'link',
      sortable: true,
      fix: true
    },
    {
      name: 'inMaterial',
      field: 'inMaterial',
      label: '내용물',
      align: 'center',
      style: 'width:120px',
      sortable: true,
      fix: true
    },
    {
      name: 'conditionVal',
      field: 'conditionVal',
      label: '상태',
      align: 'center',
      style: 'width:60px',
      sortable: true
    },
    {
      name: 'outVolume',
      field: 'outVolume',
      label: '배출용량(kg/hr)',
      align: 'center',
      style: 'width:100px',
      type: 'cost',
      sortable: true
    },
    {
      name: 'regulVolume',
      field: 'regulVolume',
      label: '정격용량(kg/hr)',
      align: 'center',
      style: 'width:100px',
      type: 'cost',
      sortable: true
    },
    {
      label: '노즐크기',
      align: 'center',
      child: [
        {
          name: 'nozzleSizeIn',
          field: 'nozzleSizeIn',
          label: '입구',
          align: 'center',
          sortable: true,
          style: 'width:60px'
        },
        {
          name: 'nozzleSizeOut',
          field: 'nozzleSizeOut',
          label: '출구',
          align: 'center',
          sortable: true,
          style: 'width:60px'
        }
      ]
    },
    {
      label: '보호기기압력',
      align: 'center',
      child: [
        {
          name: 'protectSerial',
          field: 'protectSerial',
          label: '기기번호',
          align: 'center',
          sortable: true,
          style: 'width:80px'
        },
        {
          name: 'protectOperation',
          field: 'protectOperation',
          label: '운전(MPa)',
          align: 'center',
          sortable: true,
          style: 'width:60px'
        },
        {
          name: 'protectDesign',
          field: 'protectDesign',
          label: '설계(MPa)',
          align: 'center',
          sortable: true,
          style: 'width:60px'
        }
      ]
    },
    {
      label: '안전밸브 등',
      align: 'center',
      child: [
        {
          name: 'valveSetting',
          field: 'valveSetting',
          label: '설정(MPa)',
          align: 'center',
          style: 'width:60px',
          sortable: true
        },
        {
          name: 'safetyValveMaterial',
          field: 'safetyValveMaterial',
          label: '몸체재질',
          align: 'center',
          style: 'width:80px',
          sortable: true
        },
        {
          name: 'safetyValveTrim',
          field: 'safetyValveTrim',
          label: 'Trim재질',
          align: 'center',
          style: 'width:80px',
          sortable: true
        }
      ]
    },
    {
      name: 'precisionVal',
      field: 'precisionVal',
      label: '정밀도(오차범위)',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'outConnect',
      field: 'outConnect',
      label: '배출연결부위',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'outReason',
      field: 'outReason',
      label: '배출원인',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'formVal',
      field: 'formVal',
      label: '형식',
      align: 'center',
      style: 'width:100px',
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
  listUrl.value = selectConfig.psi.pfi.valve.list.url
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
  popupOptions.value.title = '안전밸브 및 파열판 상세'
  popupOptions.value.param = {
    psiValveRuptureId: row ? row.psiValveRuptureId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safetyValveRuptureDiskDetail.vue`))
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
  popupOptions.value.title = '안전밸브 및 파열판 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safetyValveRuptureDiskExcelUpload.vue`))
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
      url: transactionConfig.psi.pfi.valve.insert.url + '/excel',
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
