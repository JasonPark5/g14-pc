<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="CLOSED_SPACE_EQUIPMENT_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="equipmentTypeCd"
            label="장비종류"
            v-model:value="searchParam.equipmentTypeCd"
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
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="equipTable"
          title="밀폐공간작업 장비 목록"
          tableId="equipTable"
          rowKey="heaClosedSpaceEquipmentId"
          :editable="editable"
          :isExcelDown="false"
          :columns="grid.columns"
          :data="grid.data"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :showLoading="false"
                label="추가"
                icon="add"
                @btnClicked="addrow"
              />
              <c-btn
                v-if="editable && grid.data!.length > 0"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="grid.data"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveEquip"
                @btnCallback="saveCallback"
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
import { closedEquipType } from './closedSpace'

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
  name: 'closedSpaceEquipStock'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
  columns?: Array<tableColumnType>
  data?: Array<closedEquipType>
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
  useFlag: 'Y',
  plantCd: '',
  equipmentTypeCd: ''
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      type: 'plant',
      style: 'width:180px',
      sortable: true
    },
    {
      required: true,
      name: 'equipmentTypeCd',
      field: 'equipmentTypeCd',
      label: '장비종류',
      align: 'left',
      type: 'select',
      codeGroupCd: 'CLOSED_SPACE_EQUIPMENT_CD',
      style: 'width:180px',
      sortable: false
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '장비명',
      type: 'text',
      align: 'left',
      sortable: true,
      style: 'width:200px',
      required: true
    },
    {
      name: 'equipmentStockNumber',
      field: 'equipmentStockNumber',
      label: '재고량',
      type: 'number',
      align: 'right',
      style: 'width:60px',
      sortable: true
    },
    {
      name: 'unitCd',
      field: 'unitCd',
      label: '단위',
      align: 'center',
      style: 'width:60px',
      sortable: false,
      type: 'select',
      setHeader: true,
      codeGroupCd: 'HEA_CLOSED_EQUIP_UNIT_CD'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:60px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const popupData = ref({
  first: '' as stringNull
})
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
  listUrl.value = selectConfig.hea.cse.equip.list.url
  saveUrl.value = transactionConfig.hea.cse.equip.save.url
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
    popupData.value.first = null
  })
}
/******************************
 * TODO (목적): row 추가
 *******************************/
function addrow() {
  grid.value.data!.splice(0, 0, {
    heaClosedSpaceEquipmentId: '',
    equipmentName: '',
    equipmentStockNumber: '',
    useFlag: 'Y',
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): 수정한 수량 저장
 *******************************/
function saveEquip() {
  let flag = true
  _.forEach(grid.value.data, (item) => {
    if (!item.equipmentName) {
      message.alert({
        title: '확인',
        message: '장비명을 입력하세요.',
        type: 'warning' // success / info / warning / error
      })
      flag = false
    } else if (item.equipmentStockNumber < 0) {
      message.alert({
        title: '안내',
        message: '재고량에 음수가 들어갈 수 없습니다.',
        type: 'warning' // success / info / warning / error
      })
      flag = false
    }
  })
  if (flag) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.chgUserId = user.value.userId
          item.regUserId = user.value.userId
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
