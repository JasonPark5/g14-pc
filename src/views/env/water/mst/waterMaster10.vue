<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
          <c-select
            :comboItems="useFlagItems"
            label="사용여부"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            type="search"
            v-model:value="searchParam.useFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="폭기조 목록"
      :columns="aeraGrid.columns"
      :data="aeraGrid.data"
      :columnSetting="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable && aeraGrid.data!.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="aeraGrid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="save"
            @btnCallback="saveCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
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
  name: 'waterMaster10'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
  columns: Array<tableColumnType>
  data?: Array<any>
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
const listUrl = ref('')
const saveUrl = ref(transactionConfig.env.water.mst.aerationtank.insert.url)
const useFlagItems = ref<Array<codeMasterType>>([])
const editable = ref(true)
const isSave = ref(false)
const table = ref<any>(null)
const searchParam = ref({
  plantCd: null,
  deptCd: '',
  useFlag: 'Y'
})
const aeraGrid = ref<gridType>({
  columns: [
    {
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      style: 'width: 15%',
      sortable: true,
      type: 'plant'
    },
    {
      required: true,
      name: 'envWaterMstAerationtankName',
      field: 'envWaterMstAerationtankName',
      label: '폭기조명',
      align: 'left',
      style: 'width: 30%',
      type: 'text',
      sortable: true
    },
    {
      name: 'envWaterMstAerationtankNo',
      field: 'envWaterMstAerationtankNo',
      label: '폭기조 관리번호',
      align: 'center',
      sortable: true,
      type: 'text'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '관리부서',
      align: 'center',
      style: 'width: 15%',
      sortable: true,
      type: 'dept'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width: 5%',
      sortable: true,
      type: 'check',
      true: 'Y',
      false: 'N'
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
  listUrl.value = selectConfig.env.water.mst.aerationtank.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록조회
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    aeraGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function add() {
  aeraGrid.value.data?.splice(0, 0, {
    plantCd: null, // 사업장코드
    envWaterMstAerationtankId: uid(), // 수질폭기조 일련번호
    envWaterMstAerationtankName: '', // 수질폭기조명
    envWaterMstAerationtankNo: '',
    deptCd: '', // 관리부서 코드
    useFlag: 'Y',
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function save() {
  if (validTable(aeraGrid.value.columns, aeraGrid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(aeraGrid.value.data, (item) => {
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
