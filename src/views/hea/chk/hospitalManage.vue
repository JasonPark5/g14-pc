<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="useFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="useFlag"
            label="사용여부"
            v-model:value="searchParam.useFlag"
            @datachange="getList"
          />
        </div>
      </template>
    </c-search-box>
    <c-table ref="table" title="검진기관 목록" :columns="grid.columns" :data="grid.data">
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
          <!-- <c-btn label="검색" icon="search"  @btnClicked="getList"/> -->
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
  name: 'hospitalManage'
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
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
const grid = ref<gridType>({
  columns: [
    // {
    //   required: true,
    //   name: 'plantCd',
    //   field: 'plantCd',
    //   label: '사업장',
    //   align: 'left',
    //   style: 'width:120px',
    //   type: 'plant',
    //   sortable: false,
    // },
    {
      required: true,
      name: 'hospitalName',
      field: 'hospitalName',
      label: '병원명',
      style: 'width:200px',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      name: 'hospitalLocation',
      field: 'hospitalLocation',
      label: '위치',
      style: 'width:300px',
      align: 'left',
      type: 'text',
      sortable: false
    },
    // {
    //   required: true,
    //   name: 'typeFlag',
    //   field: 'typeFlag',
    //   label: '건강검진 종류 구분하는 방법<br>(기본정보:☑, 검진소견서:☐)',
    //   align: 'center',
    //   style: 'width:80px',
    //   type: 'check',
    //   true: 'Y',
    //   false: 'N',
    //   sortable: false,
    // },
    {
      required: true,
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
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y'
})
const useFlagItems = ref<Array<codeMasterType>>([])
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const table = ref<any>(null)

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
  listUrl.value = selectConfig.hea.hospital.list.url
  saveUrl.value = transactionConfig.hea.hospital.save.url
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
 * TODO (목적): 행 추가
 *******************************/
function addrowMst() {
  grid.value.data?.push({
    hospitalId: uid(),
    hospitalName: '',
    hospitalLocation: '',
    useFlag: 'Y',
    typeFlag: 'Y', // 나중에 필요할 때 주석
    sortOrder: grid.value.data.length + 1,
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveMst() {
  if (grid.value.data && validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
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
