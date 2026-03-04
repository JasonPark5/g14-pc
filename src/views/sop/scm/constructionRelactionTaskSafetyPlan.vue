<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :editable="editable"
            :customPopupParam="{ targetKey: 'vendor', selfFlag: false }"
            label="수급업체"
            name="vendorCd"
            v-model:value="searchParam.vendorCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="tasktable"
      title="안전보건관리계획 목록"
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
import { constructionPopupParamType, constructionTaskType } from './construction'

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
  name: 'constructionRelactionTaskSafetyPlan'
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
interface propType {
  popupParam: constructionPopupParamType
  task: constructionTaskType
}
interface searchParamType {
  plantCd: stringNull
  vendorCd: stringNull
  sopConstructionId: stringNull
  constructionFlag: boolean
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      sopConstructionId: ''
    }
  },
  task: () => {
    return {
      insertUrl: '',
      deleteUrl: ''
    }
  }
})

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
  plantCd: null,
  vendorCd: null,
  sopConstructionId: '',
  constructionFlag: true
})
const grid = ref<any>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '수급업체',
      align: 'center',
      sortable: true,
      type: 'link',
      style: 'width:300px'
    },
    {
      name: 'constructionName',
      field: 'constructionName',
      label: '공사',
      align: 'left',
      sortable: true,
      style: 'width:250px'
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '최초등록자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'regUserDeptName',
      field: 'regUserDeptName',
      label: '최초등록부서',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'regDtStrTime',
      field: 'regDtStrTime',
      label: '최초등록일시',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'chgUserName',
      field: 'chgUserName',
      label: '최근수정자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'chgUserDeptName',
      field: 'chgUserDeptName',
      label: '최근수정부서',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'chgDtStrTime',
      field: 'chgDtStrTime',
      label: '최근수정일시',
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
  listUrl.value = selectConfig.sai.vendor.safety.plan.list.url
  // code setting
  searchParam.value.sopConstructionId = props.popupParam.sopConstructionId
  // list setting
  getList()
}
/******************************
 * TODO (목적): 안전보건관리 계획 조회
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
 * TODO (목적): 안전보건관리 계획 상세 조회
 *******************************/
/* eslint-disable no-unused-vars */
function linkClick(row: any) {
  popupOptions.value.title = '안전보건관리계획 상세'
  popupOptions.value.param = {
    saiVendorSafetyPlanId: row ? row.saiVendorSafetyPlanId : '',
    copyFlag: false
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sai/vendor/safetyPlanDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 안전보건관리 계획 팝업 닫기 콜백
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
