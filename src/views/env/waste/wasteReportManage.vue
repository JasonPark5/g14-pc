<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="인계기간"
            name="allbaroDts"
            v-model:value="searchParam.allbaroDts"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="폐기물 처리현황 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="올바로데이터 업로드" icon="add" @btnClicked="openUpload" />
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
  name: 'wasteReportManage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  // plantCd: null,
  allbaroDts: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true
    },
    {
      name: 'allbaroDt',
      field: 'allbaroDt',
      label: '인계일',
      align: 'center',
      sortable: true
    },
    {
      name: 'envWasteAllbaroNo',
      field: 'envWasteAllbaroNo',
      label: '인계번호',
      align: 'center',
      sortable: true,
      type: 'link'
    },
    {
      name: 'envWasteKindName',
      field: 'envWasteKindName',
      label: '폐기물 종류',
      align: 'left',
      sortable: true
    },
    {
      name: 'envWasteName',
      field: 'envWasteName',
      label: '폐기물명',
      align: 'left',
      sortable: true
    },
    {
      name: 'state',
      field: 'state',
      label: '성상',
      align: 'center',
      sortable: true
    },
    {
      name: 'wasteVolume',
      field: 'wasteVolume',
      label: '위탁량',
      align: 'center',
      type: 'cost',
      sortable: true
    },
    {
      name: 'wasteVolumeUnit',
      field: 'wasteVolumeUnit',
      label: '단위',
      align: 'center',
      sortable: true
    },
    // {
    //   name: 'transportName',
    //   field: 'transportName',
    //   label: '운반자명',
    //   align: 'center',
    //   sortable: true
    // },
    {
      name: 'processName',
      field: 'processName',
      label: '처리자명',
      align: 'center',
      sortable: true
    },
    {
      name: 'processMethodName',
      field: 'processMethodName',
      label: '처리방법',
      align: 'center',
      sortable: true
    },
    {
      name: 'transferName',
      field: 'transferName',
      label: '인계자명',
      align: 'center',
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
  listUrl.value = selectConfig.env.waste.allbaro.list.url
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
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '폐기물 처리현황 상세'
  popupOptions.value.param = {
    envWasteAllbaroId: row ? row.envWasteAllbaroId : ''
    // plantCd: row ? row.plantCd : searchParam.value.plantCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./wasteReportManageDetail.vue`))
  )
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 폐기물 처리결과 엑셀 업로드 (to. 올바로)
 *******************************/
function openUpload() {
  popupOptions.value.title = '폐기물 처리결과 업로드(올바로)'
  // popupOptions.value.param = { plantCd: searchParam.value.plantCd }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./wasteReportUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
function closeExcelUploadPopup(_result?: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item) => !item.error_message)
    _.forEach(s_data, (item) => {
      // alert('plantCd: ' + searchParam.value.plantCd)
      item.regUserId = user.value.userId // 등록자 ID
      item.chgUserId = user.value.userId // 수정자 ID
      item.userId = user.value.userId
      // item.plantCd = searchParam.value.plantCd
      item.editFlag = 'C'
    })
    $http({
      url: transactionConfig.env.waste.allbaro.excel.url,
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
