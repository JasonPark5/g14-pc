<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            defaultStart="-6M"
            defaultEnd="6M"
            label="작업기간"
            name="permitDates"
            v-model:value="searchParam.permitDates"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="작업수행부서"
            name="applicationDeptCd"
            v-model:value="searchParam.applicationDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            label="작업허가부서"
            name="issuedDeptCd"
            v-model:value="searchParam.issuedDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="permitTypeItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="swpWorkPermitTypeCd"
            label="작업허가분류"
            v-model:value="searchParam.swpWorkPermitTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-select
            :comboItems="supplementWorkTypeItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="swpSupplementWorkTypeCd"
            label="작업종류"
            v-model:value="searchParam.swpSupplementWorkTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            label="협력회사"
            name="vendorCd"
            :customPopupParam="{ targetKey: 'vendor' }"
            v-model:value="searchParam.vendorCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text label="작업명" name="vendorCd" v-model:value="searchParam.vendorCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            label="협력회사 작업감독자"
            name="vendorCd"
            v-model:value="searchParam.vendorCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="SWP_STEP_CD"
            itemText="codeName"
            itemValue="code"
            name="swpStepCd"
            label="검토상태"
            v-model:value="searchParam.swpStepCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field label="신청자" name="userId" v-model:value="searchParam.userId" />
        </div>
      </template>
    </c-search-box>
    <c-table
      title="작업허가서 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addWork" />
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
  name: 'safeWorkPermit14'
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
  permitDates: [],
  applicationDeptCd: user.value.deptCd,
  issuedDeptCd: null,
  permitTypeCd: null,
  swpWorkPermitTypeCd: null,
  swpSupplementWorkTypeCd: null,
  vendorCd: null,
  userId: user.value.userId,
  swpStepCd: null
})
const grid = ref({
  columns: [
    {
      name: 'swpStepName',
      field: 'swpStepName',
      label: '진행단계',
      align: 'center',
      sortable: true
    },
    {
      name: 'permitTypeName',
      field: 'permitTypeName',
      label: '작업허가구분',
      align: 'center',
      sortable: true
    },
    {
      name: 'swpWorkPermitTypeName',
      field: 'swpWorkPermitTypeName',
      label: '작업허가분류',
      align: 'center',
      sortable: true
    },
    {
      name: 'swpSupplementWorkTypeName',
      field: 'swpSupplementWorkTypeName',
      label: '보조작업',
      align: 'center',
      isEllipsis: true,
      maxWidth: '150px',
      sortable: true
    },
    {
      name: 'workName',
      field: 'workName',
      label: '작업명',
      align: 'left',
      isEllipsis: true,
      maxWidth: '200px',
      sortable: true,
      type: 'link'
    },
    {
      name: 'permitDate',
      field: 'permitDate',
      label: '작업일자',
      align: 'center',
      sortable: true
    },
    {
      name: 'applicationUserName',
      field: 'applicationUserName',
      label: '신청인',
      align: 'center',
      sortable: true
    },
    {
      name: 'workDeptName',
      field: 'workDeptName',
      label: '작업수행부서',
      align: 'center',
      sortable: true
    },
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '협력회사',
      align: 'center',
      sortable: true
    },
    {
      name: 'workManagerName',
      field: 'workManagerName',
      label: '작업감독자',
      align: 'center',
      sortable: true
    },
    {
      name: 'issuedDeptName',
      field: 'issuedDeptName',
      label: '작업허가부서',
      align: 'center',
      sortable: true
    }
    // {
    //   name: 'regDt',
    //   field: 'regDt',
    //   label: '요청일시',
    //   align: 'center',
    //   sortable: true
    // }
  ],
  data: []
})
const permitTypeItems = ref<Array<codeMasterType>>([]) // 작업허가분류
const supplementWorkTypeItems = ref<Array<codeMasterType>>([]) // 보중작업
const allSupplementWorkTypeItems = ref<Array<codeMasterType>>([]) // 보충작업 전체 원본
const listUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => searchParam.value.swpWorkPermitTypeCd,
  (newVal) => {
    searchParam.value.swpSupplementWorkTypeCd = null // 보충작업 유형 초기화

    if (newVal) {
      // 선택된 작업허가분류에 따라 보충작업유형을 필터링
      supplementWorkTypeItems.value = allSupplementWorkTypeItems.value.filter(
        (item: codeMasterType) => item.attrVal1 === newVal
      )
    } else {
      // 선택이 해제되면 전체 목록을 보여줌
      supplementWorkTypeItems.value = [...allSupplementWorkTypeItems.value]
    }
  }
)
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
  listUrl.value = selectConfig.swp.workPermit.list.url
  // code setting
  getMultiComboItems(['SWP_WORK_PERMIT_TYPE_CD', 'SWP_SUPPLEMENT_WORK_TYPE_CD']).then(
    (_result: any) => {
      permitTypeItems.value = _result['SWP_WORK_PERMIT_TYPE_CD']
      allSupplementWorkTypeItems.value = _result['SWP_SUPPLEMENT_WORK_TYPE_CD']
      supplementWorkTypeItems.value = [...allSupplementWorkTypeItems.value] // 초기값 설정
    }
  )

  // list setting
  getList()
}
/******************************
 * TODO (목적): 작업허가서 조회
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
 * TODO (목적): 화기 작업허가서 등록
 *******************************/
function addWork() {
  // 화기 작업등록
  linkClick({})
}

/******************************
 * TODO (목적): 작업허가서 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '작업허가서 상세'
  popupOptions.value.param = {
    sopWorkPermitId: row ? row.sopWorkPermitId : '',
    callType: 'REQUEST',
    isDirty: false
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./safeWorkPermitDetail14.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 작업허가서 팝업 닫기
 *******************************/
function closePopup() {
  if (popupOptions.value.param.isDirty) {
    message.confirm({
      title: '확인',
      message: '수정된 내용이 있습니다. 저장하지 않고 닫으시겠습니까?',
      type: 'warning',
      confirmCallback: () => {
        popupOptions.value.target = null
        popupOptions.value.visible = false
        getList()
      }
    })
  } else {
    popupOptions.value.target = null
    popupOptions.value.visible = false
    getList()
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
