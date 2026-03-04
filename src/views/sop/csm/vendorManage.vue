<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-search-box @enter="getSearchList">
          <template v-slot:search>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
          </div> -->
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                codeGroupCd="VENDOR_CLASS_CD"
                type="search"
                itemText="codeName"
                itemValue="code"
                name="vendorClassCd"
                label="업체분류"
                v-model:value="searchParam.vendorClassCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                codeGroupCd="VENDOR_TYPE_CD"
                type="search"
                itemText="codeName"
                itemValue="code"
                name="vendorTypeCd"
                label="업체유형"
                v-model:value="searchParam.vendorTypeCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                :comboItems="useFlagItems"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="useFlag"
                label="사용여부"
                v-model:value="searchParam.useFlag"
              />
            </div>
          </template>
        </c-search-box>
        <c-table
          ref="vendorTable"
          title="협력업체 목록"
          :columns="grid.columns"
          :data="grid.data"
          :columnSetting="false"
          :isFullScreen="false"
          :expandAll="true"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                label="엑셀 업로드"
                icon="upload"
                @btnClicked="excelUploadData"
              />
              <c-btn label="검색" icon="search" @btnClicked="getSearchList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <c-tab
          type="tabcard"
          :tabItems="tabItems"
          :inlineLabel="true"
          :height="tabHeight"
          v-model:value="tab"
          align="left"
        >
          <template v-slot:default="tab">
            <component
              v-if="tab.name == 'vendorDetail'"
              ref="refVendorDetail"
              :is="tab.component"
              @searchDetail="getVendorList"
              @isNew="resetVendor"
              :parentVendorCd="selectedVendorCd"
            />
            <component
              v-else-if="tab.name == 'vendorUser'"
              ref="vendorUser"
              :is="tab.component"
              @searchDetail="getVendorList"
              @isNew="resetVendor"
              :parentVendorCd="selectedVendorCd"
            />
            <component
              v-else-if="tab.name == 'vendorRelatedAttach'"
              ref="vendorRelatedAttach"
              :is="tab.component"
              @searchDetail="getVendorList"
              @isNew="resetVendor"
              :parentVendorCd="selectedVendorCd"
            />
          </template>
        </c-tab>
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
  name: 'vendorManage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
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
interface searchParamType {
  vendorTypeCd: stringNull
  plantCd: stringNull
  vendorClassCd: stringNull
  vendorName: stringNull
  useFlag: stringNull
}
/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const searchParam = ref<searchParamType>({
  vendorTypeCd: null,
  plantCd: null,
  vendorClassCd: null,
  vendorName: '',
  useFlag: 'Y'
})
const tabHeight = ref('820px')

const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'vendorDetail',
      icon: 'list',
      label: '상세정보',
      component: defineAsyncComponent(() => import(`./vendorDetail.vue`))
    },
    {
      name: 'vendorUser',
      icon: 'info',
      label: '근무인원',
      component: defineAsyncComponent(() => import(`./vendorUser.vue`))
    },
    {
      name: 'vendorRelatedAttach',
      icon: 'folder',
      label: '관련서류',
      component: defineAsyncComponent(() => import(`./vendorRelatedAttach.vue`))
    }
  ]
  return _items
})
const grid = ref({
  columns: [
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '업체',
      align: 'left',
      sortable: true,
      style: 'width:130px'
    },
    {
      name: 'vendorClassName',
      field: 'vendorClassName',
      label: '업체분류',
      align: 'center',
      style: 'width:70px',
      sortable: true
    },
    {
      name: 'vendorTypeName',
      field: 'vendorTypeName',
      label: '업체유형',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    // {
    //   name: 'plantNames',
    //   field: 'plantNames',
    //   label: '관련사업장',
    //   align: 'left',
    //   style: 'width:150px',
    //   sortable: true
    // },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:50px',
      sortable: true
    }
  ],
  data: []
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const tab = ref('vendorDetail')
const selectedVendorCd = ref('')
const selectedVendor = ref<Array<any>>([])
const listUrl = ref('')
const excelSaveUrl = ref('')
const useFlagItems = ref<Array<codeMasterType>>([])
const refVendorDetail = ref<any>(null)

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
  listUrl.value = selectConfig.mdm.cim.vendor.list.url
  excelSaveUrl.value = transactionConfig.mdm.cim.vendor.insert.url + '/excel'
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list settin
  getList()
}
/******************************
 * TODO (목적): 선택한 항목 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
function getSearchList() {
  getList()
  resetVendor()
}
function getVendorList() {
  getList()
  if (selectedVendorCd.value == '') {
    resetVendor()
  }
}
/******************************
 * TODO (목적): 협력업체 조회
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
 * TODO (목적): 상세 조회
 *******************************/
function rowClick(row: any) {
  selectedVendor.value = row
  selectedVendorCd.value = row.vendorCd
}
function resetVendor() {
  rowRemoveSelect()
  selectedVendorCd.value = ''
  selectedVendor.value = []
}
function excelUploadData() {
  popupOptions.value.title = '업체마스터 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./vendorManageExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
function closeExcelUploadPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item: any) => {
      return !item.error_message
    })
    _.forEach(s_data, (item: any) => {
      item.SysRevision = 1
      item.regUserId = user.value.userId // 등록자 ID
      item.chgUserId = user.value.userId // 수정자 ID
      item.useFlag = 'Y'
      item.editFlag = 'C'
    })

    $http({
      url: excelSaveUrl.value,
      method: 'POST',
      data: s_data
    }).then((_result: any) => {
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
