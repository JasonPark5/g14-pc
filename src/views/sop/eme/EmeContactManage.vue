<template>
  <div>
    <!-- <c-search-box @enter="getList" v-if="!searchParam.innerFlag">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam2.plantCd"
            @datachange="getList"
          />
        </div>
      </template>
    </c-search-box> -->
    <c-table
      ref="table"
      title="응급상황 대응 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :expandAll="true"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="bookPopup" />
          <!-- <c-btn label="검색" icon="search" @btnClicked="getList" /> -->
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
  name: 'EmeContactManage'
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
// interface propType {
//   searchParam: {
//     plantCd: stringNull
//     innerFlag: stringNull
//   }
//   tabParam: {
//     dataTypeCd: stringNull
//     title: stringNull
//   }
// }
interface gridType {
  columns: tableColumnType
  data: Array<any>
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
// const props = withDefaults(defineProps<propType>(), {
//   searchParam: () => {
//     return {
//       plantCd: null,
//       innerFlag: ''
//     }
//   },
//   tabParam: () => {
//     return {
//       dataTypeCd: '1',
//       title: '비상연락체계도'
//     }
//   }
// })

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      type: 'link',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '최초등록자',
      align: 'center',
      style: 'width:120px',
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
      style: 'width:120px',
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
// const searchParam2 = ref<any>({
//   plantCd: null
// })
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
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
  listUrl.value = selectConfig.sop.eme.contact.list.url
  // code setting
  // list setting
  getList()
}
function getList() {
  // if (props.searchParam.innerFlag == 'Y') {
  //   searchParam2.value.plantCd = props.searchParam.plantCd
  // }
  $http({
    url: listUrl.value,
    method: 'GET'
    // params: searchParam2.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function linkClick(row: any) {
  bookPopup(row)
}
function bookPopup(result: any) {
  popupOptions.value.title = '응급상황 대응 상세'
  popupOptions.value.param = {
    emeConcactId: result ? result.emeConcactId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./EmeContactDetail.vue`))
  )
  popupOptions.value.width = '70%'
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
