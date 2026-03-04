<template>
  <div>
    <c-search-box @enter="getEquipClassList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="hazardMachineItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="hazardMachineFlag"
            label="유해위험기계기구 여부"
            v-model:value="searchParam.hazardMachineFlag"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-tree-table
          title="설비유형 목록"
          parentProperty="upEquipmentTypeCd"
          customID="equipmentTypeCd"
          :columns="gridClass.columns"
          :data="gridClass.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :expandAll="true"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getEquipClassList" />
            </q-btn-group>
          </template>
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="itemTable"
          title="설비유형별 법정점검항목 목록"
          :columns="insItemgrid.columns"
          :data="insItemgrid.data"
          :merge="insItemgrid.merge"
          selection="multiple"
          :editable="editable"
          :usePaging="false"
          :expandAll="true"
          :filtering="false"
          :columnSetting="false"
          :isExcelDown="true"
          rowKey="rowkey"
        >
          <template v-slot:table-chip>
            <q-chip outline square icon="push_pin" color="blue">
              {{ $language('설비유형') + ' : ' + rowTypeName }}
            </q-chip>
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
                v-if="editable && updateMode && insItemgrid.data.length > 0"
                :showLoading="false"
                label="삭제"
                icon="remove"
                @btnClicked="remove"
              />
              <c-btn
                label="저장"
                icon="save"
                @btnClicked="saveClass"
                v-if="editable && updateMode && insItemgrid.data.length > 0"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'checkItemNm'">
              <c-text-column
                :editable="editable"
                :col="col"
                :props="props"
                v-model:value="props.row['checkItemNm']"
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
  name: 'equipmentClassInsItem'
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
  plantCd: stringNull
  hazardMachineFlag: stringNull
  useFlag: stringNull
}
interface equipClassDataInsItemType {
  equipmentType: stringNull
  plantCd: stringNull
  equipmentCheckTypeCd: stringNull
  equipmentTypeCd: stringNull
  equipmentTypeName: stringNull
  checkItemNo: stringNull
  checkItemNm: stringNull
  checkMethodCd: stringNull
  decisionBasis: stringNull
  checkCaution: stringNull
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
  plantCd: null,
  hazardMachineFlag: null,
  useFlag: 'Y'
})
const gridClass = ref<any>({
  columns: [
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      align: 'left',
      sortable: false
    },
    {
      name: 'hazardMachineFlagNm',
      field: 'hazardMachineFlagNm',
      label: '유해위험기계기구 여부',
      align: 'center',
      style: 'width:100px',
      sortable: false
    }
  ],
  data: [],
  height: '720px'
})
const insItemgrid = ref<any>({
  columns: [],
  data: [],
  height: '720px'
})
const listUrl = ref('')
const itemDetailUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const useFlagItems = ref<codeMasterType>([])
const hazardMachineItems = ref<codeMasterType>([])
const updateMode = ref(false)
const updateMode2 = ref(false)
const key = ref<any>({
  equipmentTypeCd: '',
  plantCd: '',
  equipmentCheckTypeCd: null,
  checkItemNo: '',
  checkItemNm: ''
})
const rowTypeName = ref('')
const tempInsGridDetail = ref<any>({
  equipmentTypeCd: '',
  equipmentTypeName: '',
  plantCd: '',
  equipmentCheckTypeCd: '',
  checkItemNo: '',
  checkItemNm: '',
  checkMethodCd: null,
  decisionBasis: '',
  checkCaution: ''
})
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
  itemDetailUrl.value = selectConfig.mdm.equipment.class.insItem.list.url
  insertUrl.value = transactionConfig.mdm.equipment.class.insItem.insert.url
  deleteUrl.value = transactionConfig.mdm.equipment.class.insItem.delete.url
  // code setting
  hazardMachineItems.value = [
    { code: 'Y', codeName: $language('유해위험기계기구') },
    { code: 'N', codeName: $language('일반') }
  ]
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  getComboItems('MDM_METHOD_CHECK_CD').then((_result) => {
    getComboItems('MDM_CHECK_KIND_CD').then((_result2) => {
      insItemgrid.value.columns = [
        {
          name: 'equipmentCheckTypeCd',
          field: 'equipmentCheckTypeCd',
          label: '점검종류',
          required: true,
          align: 'center',
          style: 'width:140px',
          type: 'select',
          comboItems: _result2,
          sortable: false
        },
        {
          name: 'checkItemNm',
          field: 'checkItemNm',
          label: '점검항목 내용',
          btns: [
            {
              label: '',
              icon: 'add',
              color: 'orange',
              tooltip: $language('점검항목별 검사방법 추가')
            }
          ],
          type: 'custom',
          align: 'left',
          sortable: false
        },
        {
          name: 'checkMethodCd',
          field: 'checkMethodCd',
          required: true,
          label: '검사방법',
          align: 'center',
          style: 'width:150px',
          type: 'select',
          comboItems: _result,
          sortable: false
        },
        {
          name: 'decisionBasis',
          field: 'decisionBasis',
          label: '판정기준',
          align: 'left',
          type: 'text',
          style: 'width:250px',
          sortable: false
        },
        {
          name: 'checkCaution',
          field: 'checkCaution',
          label: '점검시 안전사항',
          align: 'left',
          type: 'text',
          style: 'width:250px',
          sortable: false
        }
      ]
      insItemgrid.value.merge = [
        { index: 0, colName: 'checkItemNo' },
        { index: 1, colName: 'checkItemNo' }
      ]
    })
  })
  // list setting
  getEquipClassList()
}
/******************************
 * TODO (목적): 설비유형 조회
 *******************************/
function getEquipClassList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridClass.value.data = _result.data
    updateMode.value = false
    updateMode2.value = false
  })
}
/******************************
 * TODO (목적): 설비유형별 법정점검항목 조회
 *******************************/
function rowClick(row: equipClassDataInsItemType | null) {
  if (row) {
    rowTypeName.value = _.clone(row.equipmentTypeName)
    key.value.equipmentTypeCd = _.clone(row.equipmentTypeCd)
    key.value.plantCd = _.clone(row.plantCd)
  }
  updateMode.value = true
  updateMode2.value = false
  // 설비유형별 점검항목 조회
  $http({
    url: $format(itemDetailUrl.value, key.value.equipmentTypeCd, key.value.plantCd),
    method: 'GET'
  }).then((_result: any) => {
    insItemgrid.value.data = _.clone(_result.data)
  })
}
/******************************
 * TODO (목적): 설비유형별 법정점검항목 추가
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
  insItemgrid.value.data.splice(0, 0, {
    equipmentTypeCd: key.value.equipmentTypeCd,
    plantCd: key.value.plantCd,
    equipmentCheckTypeCd: 'MCKC000010',
    checkItemNo: uid(),
    checkMethodCd: null,
    decisionBasis: '',
    checkCaution: '',
    regUserId: user.value.userId,
    chgUserId: user.value.userId,
    checkItemNm: '',
    click: '클릭',
    editFlag: 'C'
  })
  tempInsGridDetail.value = insItemgrid.value.data[0]
}
/******************************
 * TODO (목적): 설비유형별 법정점검항목 삭제
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
            insItemgrid.value.data = _.reject(insItemgrid.value.data, {
              checkItemNo: item.checkItemNo
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
 * TODO (목적): 설비유형별 법정점검항목 저장
 *******************************/
function saveClass() {
  if (validTable(insItemgrid.value.columns, insItemgrid.value.data)) {
    const saveData = insItemgrid.value.data
    if (saveData.length > 0) {
      // 같은 `checkItemNm` 값을 가진 행을 그룹화
      const groupData = _.groupBy(saveData, 'checkItemNm')

      // 중복 검사
      let isDuplicate = false
      Object.keys(groupData).forEach((key) => {
        const group = groupData[key]
        const methodSet = new Set()
        for (const row of group) {
          if (methodSet.has(row.checkMethodCd)) {
            isDuplicate = true
            break
          }
          methodSet.add(row.checkMethodCd)
        }
      })

      if (isDuplicate) {
        message.alert({
          title: '경고',
          message: '같은 점검항목 내용에 중복된 검사방법이 있습니다.',
          type: 'warning' // success / info / warning / error
        })
        return
      }
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: insertUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            message.alert({
              title: '안내',
              message: '저장되었습니다.',
              type: 'success' // success / info / warning / error
            })
            rowClick(null)
          })
        },
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '저장할 데이터가 없습니다.',
        type: 'info' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 설비유형별 법정점검항목별 추가
 *******************************/
function innerBtnClicked(col: any, _props: any) {
  if (_props.row.editFlag !== 'C') {
    insItemgrid.value.data.splice(_props.rowIndex + 1, 0, {
      equipmentTypeCd: _props.row.equipmentTypeCd,
      plantCd: _props.row.plantCd,
      equipmentCheckTypeCd: _props.row.equipmentCheckTypeCd,
      checkItemNo: _props.row.checkItemNo,
      checkItemNm: _props.row.checkItemNm,
      checkMethodCd: null,
      decisionBasis: '',
      checkCaution: '',
      regUserId: user.value.userId,
      chgUserId: user.value.userId,
      editFlag: 'C'
    })
  } else {
    message.alert({
      title: '안내',
      message:
        '점검항목을 추가 후 저장해야만 해당 점검항목에 대한 검사방법들을 추가할 수 있습니다.',
      type: 'warning' // success / info / warning / error
    })
  }
}
/******************************
 * TODO (목적): 설비유형별 법정점검항목 조회
 *******************************/
function datachange(_props?: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // , col?: any
  // itemTable.value.acceptData(_props.row, col.name, _props.row[col.name])
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
