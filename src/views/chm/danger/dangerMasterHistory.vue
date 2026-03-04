<template>
  <div class="row">
    <div class="col-12">
      <c-table
        ref="itemTable"
        title="점검이력"
        :columns="grid.columns"
        :data="grid.data"
        gridHeight="780px"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :editable="editable"
        rowKey="chmDangerMstItemId"
        @linkClick="linkClick"
      >
        <!-- <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :showLoading="false"
              label="추가"
              icon="add"
              @btnClicked="addItem"
            />
            <c-btn
              v-if="editable && dangerStore.itemList!.length > 0"
              :url="saveItemUrl"
              :isSubmit="isSaveItem"
              :param="dangerStore.itemList"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveItem"
              @btnCallback="saveItemCallback"
            />
            <c-btn
              v-if="editable && dangerStore.itemList!.length > 0"
              :showLoading="false"
              label="삭제"
              icon="remove"
              @btnClicked="removeItem"
            />
          </q-btn-group>
        </template> -->
      </c-table>
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
import { dangerStorageType } from './dangerStorage'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerMasterHistory'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const userStroe = useUserStore()
// const { user } = storeToRefs(userStroe)
// const message = useMessageStore()

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
  popupParam: {
    chmDangerMstId?: stringNull
  }
  contentHeight?: stringNull
  isOld?: boolean
  dangerStore?: dangerStorageType
}
interface gridTypes {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
      chmDangerMstId: ''
    }
  },
  dangerStore: () => {
    return {
      chmDangerMstId: '',
      plantCd: '',
      chmDangerArea: '',
      chmDangerManageUserId: '',
      chmDangerMstName: '',
      chmDangerUserId: '',
      chmDangerSafetyUserId: '',
      chmDangerCount: '',
      chmDangerMainUse: '',
      installPermitDate: '',
      permitNo: '',
      useFlag: 'Y',
      chmDangerTypeCd: null,
      typeList: [],
      deleteTypeList: [],
      itemList: [],
      fireFightings: []
    }
  },
  isOld: false,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridTypes>({
  columns: [
    {
      name: 'chmDangerDate',
      field: 'chmDangerDate',
      style: 'width:100px',
      label: '점검기간',
      align: 'center',
      sortable: true
    },
    {
      name: 'chmDangerCheckName',
      field: 'chmDangerCheckName',
      label: '점검명',
      style: 'width:200px',
      align: 'left',
      type: 'link',
      sortable: true
    },
    {
      name: 'chmStatusDangerRegularCheckName',
      field: 'chmStatusDangerRegularCheckName',
      label: '진행상태',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'checkResultNumber',
      field: 'checkResultNumber',
      label: '점검결과 (부적합/전체)',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    {
      name: 'chmDangerInspectorUserName',
      field: 'chmDangerInspectorUserName',
      style: 'width:150px',
      label: '점검자',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
// const isSaveItem = ref(false)
const listUrl = ref(selectConfig.chm.danger.regularChecks.list.url)
const saveItemUrl = ref('')
const deleteItemUrl = ref('')
const itemTable = ref<any>(null)

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
  saveItemUrl.value = transactionConfig.chm.danger.item.save.url
  deleteItemUrl.value = transactionConfig.chm.danger.item.delete.url
  // code setting
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
    params: {
      chmDangerTypeCd: props.dangerStore.chmDangerTypeCd,
      chmDangerArea: props.dangerStore.chmDangerArea
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
// /******************************
//  * TODO (목적): 점검항목 추가
//  *******************************/
// function addItem() {
//   popupOptions.value = getPopupOptions('dangerStorageChecklist', popupOptions.value, closeItem, {
//     type: 'multiple',
//     searchParam: { chmDangerTypeCd: props.dangerStore.chmDangerTypeCd }
//   })
// }
// function closeItem(_data: any) {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   if (_data && _data.length > 0) {
//     _.forEach(_data, (item) => {
//       props.dangerStore.itemList!.push({
//         chmDangerMstId: props.popupParam.chmDangerMstId,
//         chmDangerMstItemId: uid(),
//         dangerCheckItem: item.dangerCheckItem,
//         dangerCheckContent: item.dangerCheckContent,
//         dangerCheckMethod: item.dangerCheckMethod,
//         regUserId: user.value.userId,
//         editFlag: 'C'
//       })
//     })
//   }
// }
// /******************************
//  * TODO (목적): 점검항목 제외
//  *******************************/
// function removeItem() {
//   const selectData = itemTable.value.getSelected()
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
//       confirmCallback: () => {
//         $http({
//           url: deleteItemUrl.value,
//           method: 'DELETE',
//           data: Object.values(selectData)
//         }).then(() => {
//           _.forEach(selectData, (item) => {
//             props.dangerStore.itemList = _.reject(props.dangerStore.itemList, item)
//           })
//           itemTable.value.compoTable.clearSelection()
//           message.requestSuccess()
//         })
//       },
//       cancelCallback: () => {}
//     })
//   }
// }
// /******************************
//  * TODO (목적): 점검항목 테이블 저장
//  *******************************/
// function saveItem() {
//   if (validTable(gridItem.value.columns, props.dangerStore.itemList!)) {
//     message.confirm({
//       title: '확인',
//       message: '저장하시겠습니까?',
//       type: 'info', // success / info / warning / error
//       confirmCallback: () => {
//         isSaveItem.value = !isSaveItem.value
//       },
//       cancelCallback: () => {}
//     })
//   }
// }
// function saveItemCallback() {
//   message.requestSuccess()
//   $http({
//     url: itemListUrl.value,
//     method: 'GET',
//     params: { chmDangerMstId: props.popupParam.chmDangerMstId }
//   }).then((_result: any) => {
//     props.dangerStore.itemList = _result.data
//   })
// }
/******************************
 * TODO (목적): 상세 링크팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '위험물정기점검 상세'
  popupOptions.value.param = {
    chmDangerRegularCheckId: row ? row.chmDangerRegularCheckId : '',
    chmStatusDangerRegularCheckCd: row ? row.chmStatusDangerRegularCheckCd : '',
    isView: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./dangerRegularCheckDetail.vue`))
  )
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
