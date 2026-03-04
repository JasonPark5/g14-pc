<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
            label="폐기물 종류"
            itemText="codeName"
            itemValue="code"
            name="envWasteKindCd"
            type="search"
            codeGroupCd="ENV_WASTE_KIND_CD"
            v-model:value="searchParam.envWasteKindCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :editable="editable"
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
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="table"
          :title="title"
          :columnSetting="false"
          :isFullScreen="false"
          :isExcelDown="true"
          :usePaging="false"
          :columns="grid.columns"
          :data="grid.data"
          rowKey="envWasteMstId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="add" />
              <c-btn
                v-if="editable && grid.data!.length > 0"
                label="저장"
                icon="save"
                @btnClicked="save"
              />
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
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
  name: 'wasteMasterManage'
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
const searchParam = ref({
  plantCd: null,
  envWasteKindCd: '',
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'envWasteKindCd',
      field: 'envWasteKindCd',
      label: '폐기물종류',
      align: 'center',
      style: 'width:150px',
      sortable: true,
      type: 'select',
      codeGroupCd: 'ENV_WASTE_KIND_CD'
    },
    {
      required: true,
      name: 'envWasteCd',
      field: 'envWasteCd',
      label: '폐기물 코드',
      align: 'center',
      sortable: true,
      style: 'width:90px',
      type: 'text'
    },
    {
      required: true,
      name: 'envWasteName',
      field: 'envWasteName',
      label: '폐기물명',
      align: 'left',
      style: 'width: 20%',
      sortable: true,
      type: 'text'
    },
    {
      required: true,
      name: 'state',
      field: 'state',
      label: '성상',
      align: 'center',
      style: 'width: 3%',
      sortable: true,
      type: 'select',
      codeGroupCd: 'WASTE_STATE_CD'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '처리업체',
      align: 'center',
      style: 'width: 10%',
      sortable: true,
      type: 'text'
    },
    {
      name: 'processType',
      field: 'processType',
      label: '처리방법',
      align: 'left',
      style: 'width: 20%',
      sortable: true,
      type: 'select',
      codeGroupCd: 'ENV_WASTE_METHOD_CD'
    },
    {
      name: 'processLocation',
      field: 'processLocation',
      label: '처리장소',
      align: 'left',
      style: 'width: 10%',
      sortable: true,
      type: 'text'
    },
    {
      name: 'transportName',
      field: 'transportName',
      label: '운반자',
      align: 'center',
      style: 'width: 10%',
      sortable: true,
      type: 'text'
    },
    {
      name: 'officeName',
      field: 'officeName',
      label: '관할관청',
      align: 'left',
      style: 'width: 10%',
      sortable: true,
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:60px',
      type: 'check',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const title = ref('폐기물명 목록')
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const useFlagItems = ref<Array<codeMasterType>>([])

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
  listUrl.value = selectConfig.env.waste.mst.list.url
  saveUrl.value = transactionConfig.env.waste.mst.save.url

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
 * TODO (목적): 우측테이블 행 추가
 *******************************/
function add() {
  grid.value.data?.splice(0, 0, {
    envWasteMstId: uid(),
    plantCd: searchParam.value.plantCd,
    envWasteKindCd: '',
    envWasteName: '',
    envWasteCd: null,
    state: null,
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 우측테이블 저장
 *******************************/
function save() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    const saveData = grid.value.data!.filter((x) => x.editFlag === 'C' || x.editFlag === 'U')
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData && saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          $http({
            url: saveUrl.value,
            method: 'PUT',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            getList()
          })
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    }
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
