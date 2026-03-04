<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="SAS_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="safetyTypeCd"
            label="보호구종류"
            v-model:value="searchParam.safetyTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="useFlagItems"
            type="search"
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
      ref="table"
      title="보호구 목록"
      :columns="grid.columns"
      :data="grid.data"
      :editable="editable"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addrowMst" />
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveMst"
            @btnCallback="saveCallback"
          />
          <c-btn v-if="editable" label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
    </c-table>
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
  name: 'safetyGear'
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
interface searchParamType {
  plantCd: stringNull
  useFlag: stringNull
  safetyTypeCd?: stringNull
}
interface gridType {
  columns: Array<tableColumnType>
  data: Array<any>
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

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
const searchParam = ref<searchParamType>({
  plantCd: '',
  useFlag: 'Y',
  safetyTypeCd: null
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      style: 'width:120px',
      align: 'left',
      type: 'plant',
      sortable: false
    },
    {
      required: true,
      name: 'safetyTypeCd',
      field: 'safetyTypeCd',
      label: '보호구종류',
      align: 'center',
      style: 'width:250px',
      sortable: false,
      type: 'select',
      codeGroupCd: 'SAS_TYPE_CD'
    },
    {
      required: true,
      name: 'safetyGearName',
      field: 'safetyGearName',
      label: '보호구명',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'supplyVendorName',
      field: 'supplyVendorName',
      label: '공급업체명',
      align: 'left',
      type: 'text',
      style: 'width:250px',
      sortable: true
    },
    {
      name: 'unitCd',
      field: 'unitCd',
      label: '단위',
      align: 'center',
      style: 'width:120px',
      sortable: false,
      type: 'select',
      setHeader: true,
      codeGroupCd: 'SAS_UNIT_CD'
    },
    // {
    //   required: true,
    //   name: 'price',
    //   field: 'price',
    //   label: '단가(원)',
    //   align: 'right',
    //   type: 'number',
    //   style: 'width:250px',
    //   sortable: true,
    // },
    {
      name: 'attach',
      field: 'attach',
      label: '보호구 사진',
      align: 'center',
      style: 'width:200px',
      type: 'attach',
      taskClassCd: 'SAFETY_GEAR',
      keyText: 'safetyGearId',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:80px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    }
  ],
  data: []
})
const useFlagItems = ref<object[]>([])
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
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
  listUrl.value = selectConfig.sop.sas.safetyGear.list.url
  saveUrl.value = transactionConfig.sop.sas.safetyGear.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
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
 * TODO (목적): row 추가
 *******************************/
function addrowMst() {
  grid.value.data.push({
    plantCd: '',
    safetyGearId: uid(),
    safetyTypeCd: null,
    safetyGearName: '',
    supplyVendorName: '',
    unitCd: null,
    price: '',
    useFlag: 'Y',
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveMst() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
