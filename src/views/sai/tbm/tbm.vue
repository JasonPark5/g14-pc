<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :customPopupParam="{ targetKey: 'workPermit' }"
            label="작업허가서"
            name="sopWorkPermitId"
            v-model:value="searchParam.sopWorkPermitId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            label="TBM기간"
            defaultStart="-6M"
            defaultEnd="6M"
            name="period"
            v-model:value="period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :editable="editable"
            :customPopupParam="{ targetKey: 'vendor' }"
            label="업체"
            name="vendorCd"
            v-model:value="searchParam.vendorCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field label="TBM리더" name="tbmLeaderId" v-model:value="searchParam.tbmLeaderId" />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="TBM 목록"
      :columns="grid.columns"
      :gridHeight="grid.height"
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
import { tbmType } from './tbm'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'tbm'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
interface searchParamType {
  startYmd: stringNull
  endYmd: stringNull
  plantCd: stringNull
  processCd: stringNull
  vendorCd: stringNull
  mdmSopId: stringNull
  sopName: stringNull
  permitNo: stringNull
  sopWorkPermitId: stringNull
  sopMapId: stringNull
  mapName: stringNull
  tbmCompleteFlag: stringNull
  tbmLeaderId: stringNull
}
const listUrl = ref('')
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<searchParamType>({
  startYmd: '',
  endYmd: '',
  plantCd: '',
  processCd: '',
  vendorCd: '',
  mdmSopId: '',
  sopName: '',
  permitNo: '',
  sopWorkPermitId: '',
  sopMapId: '',
  mapName: '',
  tbmCompleteFlag: null,
  tbmLeaderId: ''
})
const period = ref([])
const grid = ref<any>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'tbmNo',
      field: 'tbmNo',
      label: 'TBM번호',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'tbmName',
      field: 'tbmName',
      label: 'TBM명',
      align: 'left',
      style: 'width:160px',
      type: 'link',
      sortable: true
    },
    {
      name: 'workSummary',
      field: 'workSummary',
      label: '작업허가서',
      style: 'width:220px',
      align: 'left',
      type: 'link',
      sortable: true
    },
    {
      name: 'tbmLocation',
      field: 'tbmLocation',
      label: '장소',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    {
      name: 'permitDate',
      field: 'permitDate',
      label: '작업일',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'tbmDate',
      field: 'tbmDate',
      label: 'TBM일자',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'workTime',
      field: 'workTime',
      label: 'TBM시간',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'vendorName',
      field: 'vendorName',
      style: 'width:80px',
      label: '업체',
      align: 'center',
      sortable: true
    },
    {
      name: 'tbmLeaderName',
      field: 'tbmLeaderName',
      label: 'TBM리더',
      style: 'width:80px',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
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
  listUrl.value = selectConfig.sai.tbm.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): TBM 조회
 *******************************/
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

/******************************
 * TODO (목적): TBM 등록 및 상세 클릭
 *******************************/
function linkClick(result: tbmType, col: any) {
  if (result && col.name === 'workSummary') {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/sop/swp/safeWorkPermitDetail.vue`))
    )
    popupOptions.value.title = '작업허가서 상세'
    popupOptions.value.param = {
      sopWorkPermitId: result ? result.sopWorkPermitId : '',
      permitTypeCd: result ? result.permitTypeCd : ''
    }
  } else {
    popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./tbmDetail.vue`)))
    popupOptions.value.title = 'TBM 상세'
    popupOptions.value.param = {
      tbmId: result ? result.tbmId : ''
    }
  }
  popupOptions.value.isFull = true
  // popupOptions.value.width = '95%';
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): TBM 상세 팝업 닫기 콜백
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
