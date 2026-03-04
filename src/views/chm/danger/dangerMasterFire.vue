<template>
  <div class="row">
    <div class="col-12">
      <c-table
        ref="fireTable"
        title="관련 소방시설 목록"
        :columns="gridFire.columns"
        :data="dangerStore.fireFightings"
        gridHeight="780px"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        noDataLabel="소방시설을 추가하세요."
        :editable="editable"
        rowKey="sopFireFightingId"
        selection="multiple"
        @linkClick="linkClick"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :showLoading="false"
              label="추가"
              icon="add"
              @btnClicked="addFireFighting"
            />
            <c-btn
              v-if="editable && dangerStore.fireFightings!.length > 0"
              :showLoading="false"
              label="삭제"
              icon="remove"
              @btnClicked="removeFireFighting"
            />
          </q-btn-group>
        </template>
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
  name: 'dangerMasterFire'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
const gridFire = ref<gridTypes>({
  columns: [
    {
      name: 'manageNo',
      field: 'manageNo',
      label: '관리번호',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'fireFightingName',
      field: 'fireFightingName',
      label: '소방설비',
      align: 'left',
      sortable: true,
      style: 'width: 200px',
      type: 'link'
    },
    {
      name: 'sopFireFightingTypeName',
      field: 'sopFireFightingTypeName',
      label: '유형',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '관련공정',
      align: 'left',
      sortable: true,
      style: 'width: 200px'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '관리부서',
      align: 'left',
      sortable: true,
      style: 'width: 100px'
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
const itemListUrl = ref('')
const saveItemUrl = ref('')
const deleteItemUrl = ref('')
const fireListUrl = ref('')
const saveFireUrl = ref('')
const deleteFireUrl = ref('')
const fireTable = ref<any>(null)

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
  itemListUrl.value = selectConfig.chm.danger.item.list.url
  fireListUrl.value = selectConfig.fft.fireFighting.list.url
  saveItemUrl.value = transactionConfig.chm.danger.item.save.url
  deleteItemUrl.value = transactionConfig.chm.danger.item.delete.url
  saveFireUrl.value = transactionConfig.chm.danger.fireFighting.save.url
  deleteFireUrl.value = transactionConfig.chm.danger.fireFighting.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 소방설비 목록 조회
 *******************************/
function getFireFightingList() {
  $http({
    url: fireListUrl.value,
    method: 'GET',
    params: { chmDangerMstId: props.popupParam.chmDangerMstId }
  }).then((_result: any) => {
    props.dangerStore.fireFightings = _result.data
  })
}
/******************************
 * TODO (목적): 소방설비 추가
 *******************************/
function addFireFighting() {
  popupOptions.value = getPopupOptions('fireFightingEquip', popupOptions.value, closeFire, {
    type: 'multiple'
  })
}
function closeFire(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.dangerStore.fireFightings, {
          sopFireFightingId: item.sopFireFightingId
        }) === -1
      ) {
        props.dangerStore.fireFightings!.push(
          _.extend(item, {
            chmDangerMstId: props.popupParam.chmDangerMstId,
            editFlag: 'C'
          })
        )
      }
    })
    $http({
      url: saveFireUrl.value,
      method: 'PUT',
      data: props.dangerStore.fireFightings
    }).then(() => {
      message.requestSuccess()
      getFireFightingList()
    })
  }
}
/******************************
 * TODO (목적): 소방설비 제외
 *******************************/
function removeFireFighting() {
  const selectData = fireTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: deleteFireUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (item) => {
            props.dangerStore.fireFightings = _.reject(props.dangerStore.fireFightings, item)
          })
          fireTable.value.compoTable.clearSelection()
          message.requestSuccess()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 상세 링크팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '소방설비 상세'
  popupOptions.value.param = { sopFireFightingId: row.sopFireFightingId }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/fft/fireFightingMasterDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getFireFightingList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
