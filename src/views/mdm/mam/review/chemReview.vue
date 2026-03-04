<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            defaultStart="-2M"
            defaultEnd="7d"
            label="검토요청일"
            name="reviewRequestPeriod"
            v-model:value="searchParam.reviewRequestPeriod"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            stepperGrpCd="MDM_CHEM_REVIEW_STEP_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="mdmChemReviewStepCd"
            label="진행상태"
            v-model:value="searchParam.mdmChemReviewStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="구매 전 검토 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="openPop" />
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
import { chemReviewType } from './chemReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemReview'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  reviewRequestPeriod: [],
  mdmChemReviewStepCd: null
})
const grid = ref({
  columns: [
    // {
    //   name: 'materialCd',
    //   field: 'materialCd',
    //   label: '자재 일련번호',
    //   align: 'center',
    //   style: 'width:120px',
    //   sortable: true
    // },
    {
      name: 'materialName',
      field: 'materialName',
      label: '화학자재명',
      align: 'left',
      type: 'link',
      style: 'width:250px',
      sortable: true
    },
    // {
    //   name: 'materialNameEn',
    //   field: 'materialNameEn',
    //   label: '화학자재명(영문)',
    //   align: 'left',
    //   style: 'width:200px',
    //   sortable: true
    // },
    {
      name: 'mdmChemReviewStepName',
      field: 'mdmChemReviewStepName',
      label: '진행상태',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '작성자',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'review',
      field: 'review',
      label: '검토',
      align: 'center',
      style: 'width:90px',
      sortable: true,
      type: 'proxy',
      component: shallowRef(
        defineAsyncComponent(() => import(`@views/mdm/mam/review/reviewStatusProxy.vue`))
      )
    },
    {
      name: 'plantNames',
      field: 'plantNames',
      label: '사업장명',
      align: 'center',
      style: 'width:200px',
      sortable: true
    }
  ],
  data: []
})
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
  listUrl.value = selectConfig.mdm.mam.review.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 사전 검토 조회
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
 * TODO (목적): 사전 검토 링크 클릭
 * @param (1): 행 정보\
 *******************************/
function linkClick(row: chemReviewType) {
  openPop(row)
}
/******************************
 * TODO (목적): 사전 검토 팝업 표시
 * @param (1): 행 정보
 *******************************/
function openPop(row?: chemReviewType) {
  popupOptions.value.title = '구매 전 검토 상세'
  popupOptions.value.param = {
    mdmChemReviewId: row ? row.mdmChemReviewId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./chemReviewDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 사전 검토 팝업 닫기
 * @param (1):
 * @param (2):
 * @return (반환):
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
