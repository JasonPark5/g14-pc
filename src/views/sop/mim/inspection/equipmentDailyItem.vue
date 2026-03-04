<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-tree-table
          ref="typeTable"
          title="설비유형 목록"
          parentProperty="upEquipmentTypeCd"
          customID="equipmentTypeCd"
          :columns="typeGrid.columns"
          :data="typeGrid.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <!-- <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template> -->
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="itemTable"
          title="일상점검항목 목록"
          :columns="itemGrid.columns"
          :data="itemGrid.data"
          :merge="itemGrid.merge"
          selection="multiple"
          :editable="editable"
          :usePaging="false"
          :expandAll="true"
          :filtering="false"
          :columnSetting="false"
          :isExcelDown="true"
          rowKey="checkItemId"
        >
          <template v-slot:table-chip>
            <q-chip outline square icon="push_pin" color="blue">
              {{ $language('설비유형') + ' : ' + rowTypeName }}
            </q-chip>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'checkItemPartName'">
              <c-text-column
                :editable="editable"
                :col="col"
                :props="props"
                v-model:value="props.row[col.name]"
                @datachange="datachange(props)"
              />
              <span>
                <div>
                  <q-btn-group outline class="ColumInnerBtnGroup">
                    <template v-for="(btn, idx) in col.btns">
                      <q-btn
                        :key="idx"
                        v-if="editable"
                        :label="btn.label"
                        :icon="btn.icon ? btn.icon : void 0"
                        :color="btn.color ? btn.color : 'blue-grey-4'"
                        :text-color="btn.textColor ? btn.textColor : 'white'"
                        class="ColumInnerBtn"
                        align="center"
                        @click.stop="innerBtnClicked(col, props)"
                      >
                        <q-tooltip v-if="btn.tooltip">
                          <span v-html="btn.tooltip" />
                        </q-tooltip>
                      </q-btn>
                    </template>
                  </q-btn-group>
                </div>
              </span>
            </template>
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && updateMode"
                label="추가"
                icon="add"
                :showLoading="false"
                @btnClicked="addrow"
              />
              <c-btn
                v-if="editable && updateMode && itemGrid.data.length > 0"
                :showLoading="false"
                label="삭제"
                icon="remove"
                @btnClicked="remove"
              />
              <c-btn
                v-if="editable && updateMode && itemGrid.data.length > 0"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="itemGrid.data"
                mappingType="POST"
                label="저장"
                icon="save"
                @beforeAction="saveClass"
                @btnCallback="saveCallback"
              />
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
  name: 'equipmentDailyItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Interface_선언
 *******************************/

interface searchParamType {
  // plantCd: stringNull
  dailyFlag: stringNull
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

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const searchParam = ref<searchParamType>({
  // plantCd: null,
  useFlag: 'Y',
  dailyFlag: 'Y'
})
const typeGrid = ref<any>({
  columns: [
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      align: 'left',
      sortable: false
    }
  ],
  data: [],
  height: '720px'
})
const itemGrid = ref<any>({
  columns: [],
  data: [],
  height: '720px'
})
const listUrl = ref('')
const itemDetailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const useFlagItems = ref<codeMasterType>([])
const isSave = ref(false)
const updateMode = ref(false)
const key = ref<any>({
  equipmentTypeCd: '',
  plantCd: '',
  equipmentCheckTypeCd: null
})
const rowTypeName = ref('')
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
  listUrl.value = selectConfig.mdm.equipment.class.list.url
  itemDetailUrl.value = selectConfig.mdm.equipment.class.item.daily.list.url
  saveUrl.value = transactionConfig.mdm.equipment.class.item.daily.save.url
  deleteUrl.value = transactionConfig.mdm.equipment.class.item.daily.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  getComboItems('MDM_CHECK_CYCLE_CD').then((_result) => {
    itemGrid.value.columns = [
      {
        required: true,
        name: 'checkItemPartName',
        field: 'checkItemPartName',
        label: '부품명',
        btns: [
          {
            label: '',
            icon: 'add',
            color: 'orange',
            tooltip: $language('부품별 점검항목 추가')
          }
        ],
        style: 'width:250px',
        type: 'custom',
        align: 'left',
        sortable: false
      },
      {
        name: 'checkItemName',
        field: 'checkItemName',
        label: '점검항목',
        style: 'width:200px',
        type: 'text',
        align: 'left',
        sortable: false
      },
      {
        name: 'checkItemMethod',
        field: 'checkItemMethod',
        label: '점검방법',
        style: 'width:200px',
        type: 'text',
        align: 'left',
        sortable: false
      },
      {
        name: 'checkStandard',
        field: 'checkStandard',
        label: '점검기준',
        style: 'width:200px',
        type: 'text',
        align: 'left',
        sortable: false
      },
      {
        required: true,
        name: 'checkItemCycleCd',
        field: 'checkItemCycleCd',
        label: '주기',
        align: 'center',
        style: 'width:80px',
        type: 'select',
        comboItems: _result,
        sortable: false
      },
      {
        name: 'sortOrder',
        field: 'sortOrder',
        label: '정렬순서',
        style: 'width:70px',
        type: 'number',
        align: 'left',
        sortable: false
      }
    ]
    itemGrid.value.merge = [{ index: 0, colName: 'checkItemPartName' }]
  })
  // list setting
  getList()
}
/******************************
 * TODO (목적): 설비유형 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    typeGrid.value.data = _result.data
    updateMode.value = false
  })
}
/******************************
 * TODO (목적): 설비별 일상점검항목 조회
 *******************************/
function rowClick(row: any) {
  if (row) {
    rowTypeName.value = _.clone(row.equipmentTypeName)
    key.value.equipmentTypeCd = _.clone(row.equipmentTypeCd)
    key.value.plantCd = _.clone(row.plantCd)
  }
  updateMode.value = true
  // 설비유형별 점검항목 조회
  $http({
    url: $format(itemDetailUrl.value, key.value.equipmentTypeCd, key.value.plantCd),
    method: 'GET'
  }).then((_result: any) => {
    itemGrid.value.data = _.clone(_result.data)
  })
}
/******************************
 * TODO (목적): 설비별 일상점검항목 추가
 *******************************/
function addrow() {
  if (!key.value.equipmentTypeCd) {
    message.alert({
      title: '안내',
      message: '설비유형을 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  // 초기에는 userId에 tempId를 부여
  itemGrid.value.data.push({
    equipmentTypeCd: key.value.equipmentTypeCd,
    plantCd: key.value.plantCd,
    checkItemId: uid(),
    equipmentCheckTypeCd: null,
    checkItemPartCd: '',
    checkItemPartName: '',
    checkItemCycleCd: null,
    checkItemName: '',
    checkItemMethod: '',
    checkStandard: '',
    sortOrder: itemGrid.value.data.length == 0 ? 1 : itemGrid.value.data.length * 10,
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 설비별 일상점검항목 삭제
 *******************************/
function remove() {
  const selectData = itemTable.value.getSelected()
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
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            itemGrid.value.data = _.reject(itemGrid.value.data, {
              checkItemId: item.checkItemId
            })
          })
          message.requestSuccess()
          rowClick(null)
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 설비별 일상점검항목 저장
 *******************************/
function saveClass() {
  if (validTable(itemGrid.value.columns, itemGrid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 설비별 일상점검항목 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  rowClick({
    plantCd: result.data.plantCd,
    equipmentTypeCd: result.data.equipmentTypeCd,
    equipmentTypeName: rowTypeName.value
  })
}
/******************************
 * TODO (목적): 테이블 datachange
 *******************************/
function datachange(_props?: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // itemTable.value.acceptData(_props.row, col.name, _props.row[col.name])
}
/******************************
 * TODO (목적): 설비별 일상점검항목별 추가
 *******************************/
function innerBtnClicked(col: any, props: any) {
  itemGrid.value.data.splice(props.rowIndex + 1, 0, {
    equipmentTypeCd: key.value.equipmentTypeCd,
    plantCd: key.value.plantCd,
    checkItemId: uid(),
    equipmentCheckTypeCd: null,
    checkItemPartCd: '',
    checkItemPartName: props.row.checkItemPartName,
    checkItemCycleCd: null,
    checkItemName: '',
    checkItemMethod: '',
    checkStandard: '',
    sortOrder: Number(props.row.sortOrder),
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
