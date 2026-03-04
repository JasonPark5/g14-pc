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
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="순회점검항목 목록"
      rowKey="saiPatrolResultItemId"
      :columns="grid.columns"
      :data="grid.data"
      :editable="editable"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="엑셀업로드" icon="upload" @btnClicked="excelUploadData" />
          <c-btn v-if="editable" label="추가" :showLoading="false" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable && grid.data.length > 0"
            :url="insertUrl"
            :isSubmit="isSave"
            :param="grid.data"
            mappingType="POST"
            label="저장"
            icon="save"
            @beforeAction="saveItem"
            @btnCallback="saveCallback"
          />
          <!-- <c-btn v-if="editable && grid.data.length > 0" label="삭제" :showLoading="false" :editable="editable" icon="remove" @btnClicked="remove" /> -->
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
import { patrolMasterType } from './patrolType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'patrolMaster'
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
interface gridType {
  columns: tableColumnType
  data: Array<patrolMasterType>
}

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
  target: null,
  top: '',
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: '',
  trainingTypeCd: null,
  useFlag: 'Y'
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      sortable: true,
      required: true,
      style: 'width:150px',
      type: 'plant'
    },
    {
      required: true,
      name: 'patrolItemName',
      field: 'patrolItemName',
      label: '점검항목',
      align: 'left',
      sortable: true,
      style: 'width:600px',
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:100px',
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '정렬순서',
      align: 'center',
      sortable: true,
      style: 'width:100px',
      type: 'number'
    }
  ],
  data: []
})
const useFlagItems = ref([
  { code: 'Y', codeName: getLanguage('사용') },
  { code: 'N', codeName: getLanguage('미사용') }
])
const table = ref<any>(null)
const isSave = ref(false)
const listUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')

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
  listUrl.value = selectConfig.sai.patrol.resultItem.list.url
  insertUrl.value = transactionConfig.sai.patrol.resultItem.insert.url
  deleteUrl.value = transactionConfig.sai.patrol.resultItem.delete.url
  // code setting
  // list setting
  getList()
}
const getList = () => {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 추가 버튼 클릭
 *******************************/
const add = () => {
  grid.value.data.splice(0, 0, {
    plantCd: user.value.plantCd,
    saiPatrolResultItemId: uid(),
    patrolItemName: '',
    useFlag: 'Y',
    sortOrder: grid.value.data.length + 1,
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장 버튼 클릭
 *******************************/
const saveItem = () => {
  const checkItem: (keyof patrolMasterType)[] = ['plantCd', 'patrolItemName', 'useFlag']
  let isConti = true
  _.forEach(grid.value.data, (item: patrolMasterType) => {
    _.forEach(checkItem, (check: keyof patrolMasterType) => {
      if (!item[check]) {
        isConti = false
        return false
      }
    })
  })
  if (!isConti) {
    message.alert({
      title: '안내',
      message: '필수 입력값을 입력해 주세요.</br> [사업장, 점검항목, 사용여부]',
      type: 'warning' // success / info / warning / error
    })
  } else {
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
const saveCallback = () => {
  message.requestSuccess()
  getList()
}
// const remove = () => {
//   const selectData = table.value.getSelected()
//   if (!selectData || selectData.length === 0) {
//     message.alert({
//       title: '안내',
//       message: '선택된 항목이 없습니다.',
//       type: 'warning' // success / info / warning / error
//     })
//   } else {
//     message.confirm({
//       title: '확인',
//       message: '삭제하시겠습니까?',
//       type: 'warning', // success / info / warning / error
//       // 확인 callback 함수
//       confirmCallback: () => {
//         $http({
//           url: deleteUrl.value,
//           method: 'DELETE',
//           params: {
//             data: Object.values(selectData)
//           }
//         }).then((_result: any) => {
//           grid.value.data = _result.data

//           _.forEach(selectData, (item) => {
//             grid.value.data = _.reject(grid.value.data, {
//               saiPatrolResultItemId: item.saiPatrolResultItemId
//             })
//           })
//           message.requestSuccess()
//         })
//       },
//       // 취소 callback 함수
//       cancelCallback: () => {}
//     })
//   }
// }
/******************************
 * TODO (목적): 엑셀 업로드 버튼 클릭
 *******************************/
const excelUploadData = () => {
  popupOptions.value.title = '순회점검 점검항목 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./patrolMasterExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
/******************************
 * TODO (목적): 엑셀 업로드 팝업에서 적용 버튼 클릭
 *******************************/
const closeExcelUploadPopup = (_result: any) => {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item: any) => {
      return !item.error_message
    })
    _.forEach(s_data, (item) => {
      item.useFlag = 'Y'
      item.editFlag = 'C'
      item.regUserId = user.value.userId // 등록자 ID
      item.chgUserId = user.value.userId // 수정자 ID
    })

    $http({
      url: insertUrl.value,
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
