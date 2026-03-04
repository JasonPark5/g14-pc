<template>
  <div>
    <c-search-box @enter="getList">
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
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
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
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
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
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-tree-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <q-form ref="editForm">
          <c-card title="설비유형 상세정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addClass" />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="equipClassData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveClass"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  required
                  :editable="editable && dataeditable"
                  label="설비유형 명칭"
                  name="equipmentTypeName"
                  v-model:value="equipClassData.equipmentTypeName"
                />
              </div>
              <div class="col-6">
                <c-text
                  :afterIcon="
                    editable
                      ? [
                          {
                            name: 'search',
                            click: true,
                            callbackName: 'selectUpType'
                          },
                          { name: 'close', click: true, callbackName: 'removeUpType' }
                        ]
                      : null
                  "
                  :disabled="true"
                  :editable="editable && dataeditable"
                  label="상위 설비유형"
                  name="upEquipmentTypeName"
                  v-model:value="equipClassData.upEquipmentTypeName"
                  @selectUpType="
                    () => {
                      isUpTypeOpen = true
                    }
                  "
                  @removeUpType="removeUpType"
                />
              </div>
              <!-- <div class="col-6">
                <c-plant
                  required
                  type="edit"
                  :disabled="updateMode"
                  :editable="editable && dataeditable"
                  name="plantCd"
                  v-model:value="equipClassData.plantCd"
                />
              </div> -->
              <div class="col-3">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="일상점검 대상"
                  name="dailyFlag"
                  v-model:value="equipClassData.dailyFlag"
                />
              </div>
              <div class="col-3">
                <c-checkbox
                  :editable="editable && dataeditable"
                  :isFlag="true"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="equipClassData.useFlag"
                />
              </div>
              <div class="col-4">
                <c-radio
                  :editable="editable && dataeditable"
                  :comboItems="hazardMachineItems"
                  label="유해위험기계기구 여부"
                  name="hazardMachineFlag"
                  v-model:value="equipClassData.hazardMachineFlag"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :counter="true"
                  :maxlength="200"
                  :editable="editable && dataeditable"
                  :rows="5"
                  label="비고"
                  name="remarks"
                  v-model:value="equipClassData.remarks"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>
    <q-dialog ref="upTypeDialog" persistent v-model="isUpTypeOpen">
      <q-card class="menu-card" style="width: 600px">
        <q-card-section class="row items-center q-pb-none px-2 py-1 bg-orange-custom text-white">
          <div class="text-h6">{{ $language('상위 설비유형') }}</div>
          <q-space />
          <q-btn icon="done" flat round dense @click="selectUpType" />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label caption>
              <q-chip outline square color="primary">
                <q-icon name="check" />{{ upTypeNm }}
              </q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />

        <q-card-section class="uptype-content p-2">
          <q-tree
            ref="upTypeTreeRef"
            :nodes="upTypeTree"
            node-key="equipmentTypeCd"
            label-key="equipmentTypeName"
            children-key="children"
            no-nodes-label="상위유형이 없습니다."
            no-results-label=""
            :default-expand-all="false"
            selected-color="primary"
            v-model:selected="selectedUpType"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
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
  name: 'equipmentClass'
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

/******************************
 * @Interface_선언
 *******************************/
interface searchParamType {
  plantCd: stringNull
  hazardMachineFlag: stringNull
  useFlag: stringNull
}
interface equipClassDataType {
  plantCd?: stringNull
  equipmentTypeName?: stringNull
  equipmentTypeCd?: stringNull
  upEquipmentTypeCd?: stringNull
  upEquipmentTypeName?: stringNull
  remarks?: stringNull
  hazardMachineFlag?: stringNull
  useFlag?: stringNull
  dailyFlag?: stringNull
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
const equipClassData = ref<equipClassDataType>({
  plantCd: null,
  equipmentTypeName: '',
  equipmentTypeCd: '',
  upEquipmentTypeCd: '',
  upEquipmentTypeName: '',
  remarks: '',
  hazardMachineFlag: 'N',
  useFlag: 'Y',
  dailyFlag: 'N'
})
const gridClass = ref<any>({
  columns: [
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      align: 'left',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'dailyFlagName',
      field: 'dailyFlagName',
      label: '일상점검 대상',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'hazardMachineFlagNm',
      field: 'hazardMachineFlagNm',
      label: '유해위험기계기구 여부',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'useFlagNm',
      field: 'useFlagNm',
      label: '사용여부',
      align: 'center',
      style: 'width:80px',
      sortable: false
    }
  ],
  data: [],
  height: '362px'
})
const upTypeTree = ref<any>([])
const upTypeNm = ref('상위유형을 선택하세요.')
const isUpTypeOpen = ref(false)
const selectedUpType = ref(null)
const listUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const detailUrl = ref('')
const checkUrl = ref('')
const saveable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const useFlagItems = ref<codeMasterType>([])
const hazardMachineItems = ref<codeMasterType>([])
const isSave = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const editForm = ref<any>(null)
const upTypeDialog = ref<any>(null)
const upTypeTreeRef = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => selectedUpType.value,
  () => {
    if (selectedUpType.value) {
      const data = upTypeTreeRef.value.getNodeByKey(selectedUpType.value)
      upTypeNm.value = data.equipmentTypeName
    } else {
      upTypeNm.value = '상위유형을 선택하세요.'
    }
  }
)
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
  dataeditable.value = false
  // url setting
  listUrl.value = selectConfig.mdm.equipment.class.list.url
  detailUrl.value = selectConfig.mdm.equipment.class.get.url
  insertUrl.value = transactionConfig.mdm.equipment.class.insert.url
  saveUrl.value = transactionConfig.mdm.equipment.class.insert.url
  updateUrl.value = transactionConfig.mdm.equipment.class.update.url
  checkUrl.value = selectConfig.mdm.equipment.class.check.url
  // code setting
  hazardMachineItems.value = [
    { code: 'Y', codeName: $language('유해위험기계기구') },
    { code: 'N', codeName: $language('일반') }
  ]
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 트리 테이블 변환
 *******************************/
function convertTree(_treeBases: any) {
  if (!_treeBases || _treeBases.length <= 0) return null
  const tree = arrayToTree(_treeBases, {
    parentProperty: 'upEquipmentTypeCd',
    customID: 'equipmentTypeCd'
  })
  return tree
}
/******************************
 * TODO (목적): 상위 유형 선택
 *******************************/
function selectUpType() {
  if (selectedUpType.value) {
    const data = upTypeTreeRef.value.getNodeByKey(selectedUpType.value)
    equipClassData.value.upEquipmentTypeCd = data.equipmentTypeCd
    equipClassData.value.upEquipmentTypeName = data.equipmentTypeName
    upTypeDialog.value.hide()
  } else {
    message.alert({
      title: '안내',
      message: '상위 유형을 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
  }
}
/******************************
 * TODO (목적): 상위 유형 삭제
 *******************************/
function removeUpType() {
  message.confirm({
    title: '확인',
    message: '상위유형이 없는 경우 최상위 유형로 들어가게 됩니다. 진행하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      equipClassData.value.upEquipmentTypeCd = null
      equipClassData.value.upEquipmentTypeName = null
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 전체조회
 *******************************/
function getList() {
  reset()
  saveable.value = false
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridClass.value.data = _result.data
    upTypeTree.value = convertTree(_result.data)
  })
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function rowClick(row: equipClassDataType) {
  saveable.value = true
  updateMode.value = true
  $http({
    url: $format(detailUrl.value, row.equipmentTypeCd, row.plantCd),
    method: 'GET'
  }).then((_result: any) => {
    equipClassData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
  })
}
/******************************
 * TODO (목적): 상위 유형 신규 추가
 *******************************/
function addClass() {
  saveable.value = true
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  equipClassData.value = {
    plantCd: searchParam.value.plantCd,
    equipmentTypeName: '',
    equipmentTypeCd: '',
    upEquipmentTypeCd: equipClassData.value.equipmentTypeCd,
    upEquipmentTypeName: equipClassData.value.equipmentTypeName,
    remarks: '',
    hazardMachineFlag: 'N',
    useFlag: 'Y',
    dailyFlag: 'N'
  }
}
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
function reset() {
  rowRemoveSelect()
  saveable.value = false
  updateMode.value = false
  dataeditable.value = false
  equipClassData.value = {
    plantCd: null,
    equipmentTypeName: '',
    equipmentTypeCd: '',
    upEquipmentTypeCd: '',
    upEquipmentTypeName: '',
    remarks: '',
    hazardMachineFlag: 'Y',
    useFlag: 'Y',
    dailyFlag: 'N'
  }
}
/******************************
 * TODO (목적): 상위 유형 저장
 *******************************/
function saveClass() {
  editForm.value.validate().then((_result: boolean) => {
    // 중복체크
    if (_result) {
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
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 상위 유형 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  getList()
  rowClick({ plantCd: result.data.plantCd, equipmentTypeCd: result.data.equipmentTypeCd })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.uptype-content
  height: 100%
  max-height: 600px !important
  min-height: 500px !important
  overflow-y: auto
</style>
