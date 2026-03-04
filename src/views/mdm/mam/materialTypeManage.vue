<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-tree-table
          title="자재분류 목록"
          parentProperty="upMaterialTypeCd"
          customID="materialTypeCd"
          :columns="gridType.columns"
          :data="gridType.data"
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
          <c-card title="자재분류 상세정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="editable" label="등록" icon="add" @btnClicked="addType" />
                <c-btn
                  v-if="editable && dataeditable"
                  label="삭제"
                  icon="remove"
                  @btnClicked="delType"
                />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="materialTypeData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveTypes"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-6">
                <c-text
                  required
                  :editable="editable && dataeditable"
                  label="자재분류 명칭"
                  name="materialTypeName"
                  v-model:value="materialTypeData.materialTypeName"
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
                            callbackName: 'selectUpType',
                            color: 'light-blue'
                          },
                          { name: 'close', click: true, callbackName: 'removeUpType', color: 'red' }
                        ]
                      : null
                  "
                  :disabled="true"
                  :editable="editable && dataeditable"
                  label="상위 자재분류"
                  name="upMaterialTypeName"
                  v-model:value="materialTypeData.upMaterialTypeName"
                  @selectUpType="
                    () => {
                      isUpTypeOpen = true
                    }
                  "
                  @removeUpType="removeUpType"
                />
              </div>
              <div class="col-6">
                <c-text
                  required
                  :editable="editable && dataeditable"
                  label="순번"
                  name="sortOrder"
                  type="number"
                  v-model:value="materialTypeData.sortOrder"
                />
              </div>
              <div class="col-6">
                <c-radio
                  :editable="editable && dataeditable"
                  codeGroupCd="MATERIAL_KIND_CD"
                  label="자재구분"
                  name="materialKindCd"
                  v-model:value="materialTypeData.materialKindCd"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>
    <q-dialog ref="upTypeDialog" persistent v-model:model-value="isUpTypeOpen">
      <q-card class="menu-card" style="width: 600px">
        <q-card-section class="row items-center q-pb-none px-2 py-1 bg-orange-custom text-white">
          <div class="text-h6">상위 자재분류</div>
          <q-space />
          <q-btn icon="done" flat round dense @click="selectUpType" />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label caption>
              <q-chip outline square color="primary" text-color="white">
                <q-icon name="check" />{{ upTypeNm }}
              </q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />

        <q-card-section class="uptype-content-material p-2">
          <q-tree
            ref="treeRef"
            :nodes="upTypeTree"
            node-key="materialTypeCd"
            label-key="materialTypeName"
            children-key="children"
            no-nodes-label="상위유형이 없습니다."
            no-results-label=""
            :default-expand-all="false"
            selected-color="primary"
            v-model:selected="selectedUpType"
            @update:selected="updateSelected"
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
import arrayToTree from 'array-to-tree'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'materialTypeManage'
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
  delFlag: stringNull
}
interface materialType {
  materialTypeCd: stringNull // 자재분류 코드
  materialTypeName: stringNull // 자재분류명
  upMaterialTypeCd: stringNull // 상위자재분류 코드
  upMaterialTypeName: stringNull
  materialKindCd: stringNull // 자재구분코드
  sortOrder: stringNull // 순번
  delFlag: stringNull // 삭제여부
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
const searchParam = ref<searchParamType>({
  delFlag: 'N'
})
const materialTypeData = ref<materialType>({
  materialTypeCd: '', // 자재분류 코드
  materialTypeName: '', // 자재분류명
  upMaterialTypeCd: '', // 상위자재분류 코드
  upMaterialTypeName: '',
  materialKindCd: 'MKC0000001', // 자재구분코드
  sortOrder: '', // 순번
  delFlag: 'N' // 삭제여부
})
const gridType = ref({
  columns: [
    {
      name: 'materialTypeName',
      field: 'materialTypeName',
      label: '자재분류',
      align: 'left',
      sortable: false
    },
    {
      name: 'materialKindName',
      field: 'materialKindName',
      label: '자재구분',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:100px',
      sortable: false
    }
  ],
  data: []
})
const upTypeTree = ref<any>(null)
const upTypeNm = ref('상위분류를 선택하세요.')
const isUpTypeOpen = ref(false)
const selectedUpType = ref('')
const listUrl = ref('')
const detailUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const nameUrl = ref('')
const saveable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
// const isDelete = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const editForm = ref<any>(null)
const treeRef = ref<any>(null)
const upTypeDialog = ref<any>(null)
const clicks = ref(0)
const timer = ref<NodeJS.Timeout>(setTimeout(() => {}, 1))
const delay = ref(180)

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
      const data = treeRef.value.getNodeByKey(selectedUpType.value)
      upTypeNm.value = data.materialTypeName
    } else {
      upTypeNm.value = '상위분류를 선택하세요.'
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
  listUrl.value = selectConfig.mdm.mam.material.type.list.url
  saveUrl.value = transactionConfig.mdm.mam.material.type.insert.url
  detailUrl.value = selectConfig.mdm.mam.material.type.get.url
  nameUrl.value = selectConfig.mdm.mam.material.type.name.url
  insertUrl.value = transactionConfig.mdm.mam.material.type.insert.url
  updateUrl.value = transactionConfig.mdm.mam.material.type.update.url
  deleteUrl.value = transactionConfig.mdm.mam.material.type.delete.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): Tree 형식으로 변경
 *******************************/
function convertTree(_treeBases: any) {
  if (!_treeBases || _treeBases.length <= 0) return null
  const tree = arrayToTree(_treeBases, {
    parentProperty: 'upMaterialTypeCd',
    customID: 'materialTypeCd'
  })
  return tree
}
/******************************
 * TODO (목적): 상위 자재 분류 선택
 *******************************/
function selectUpType() {
  if (selectedUpType.value) {
    const data = treeRef.value.getNodeByKey(selectedUpType.value)
    materialTypeData.value.upMaterialTypeCd = data.materialTypeCd
    materialTypeData.value.upMaterialTypeName = data.materialTypeName
    upTypeDialog.value.hide()
  } else {
    message.alert({
      title: '안내',
      message: '상위 분류를 선택하세요.', // 상위 분류를 선택하세요.
      type: 'warning' // success / info / warning / error
    })
  }
}
/******************************
 * TODO (목적): 상위 자재 분류 삭제
 *******************************/
function removeUpType() {
  message.confirm({
    title: '확인',
    message: '상위분류가 없는 경우 최상위 분류로 들어가게 됩니다.\n\r진행하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      materialTypeData.value.upMaterialTypeCd = null
      materialTypeData.value.upMaterialTypeName = null
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 선택한 항목 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
/******************************
 * TODO (목적): 자재 목록 조회
 *******************************/
function getList() {
  reset()
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridType.value.data = _result.data
    upTypeTree.value = convertTree(_result.data)
  })
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function rowClick(row: any) {
  // 상세조회
  saveable.value = true
  updateMode.value = true
  $http({
    url: detailUrl.value,
    method: 'GET',
    params: { materialTypeCd: row.materialTypeCd }
  }).then((_result: any) => {
    materialTypeData.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
  })
}
/******************************
 * TODO (목적): 자재 분류 추가
 *******************************/
function addType() {
  saveable.value = true
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  materialTypeData.value = {
    materialTypeCd: '', // 자재분류 코드
    materialTypeName: '', // 자재분류명
    upMaterialTypeCd: '', // 상위자재분류 코드
    upMaterialTypeName: '',
    materialKindCd: 'MKC0000001', // 자재구분코드
    sortOrder: '', // 순번
    delFlag: 'N' // 삭제여부
  }
}
/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  saveable.value = false
  updateMode.value = false
  dataeditable.value = false
  materialTypeData.value = {
    materialTypeCd: '', // 자재분류 코드
    materialTypeName: '', // 자재분류명
    upMaterialTypeCd: '', // 상위자재분류 코드
    upMaterialTypeName: '',
    materialKindCd: 'MKC0000001', // 자재구분코드
    sortOrder: '', // 순번
    delFlag: 'N' // 삭제여부
  }
}
/******************************
 * TODO (목적): 자재 분류 삭제
 *******************************/
function delType() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, materialTypeData.value.upMaterialTypeCd),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        getList()
      })
    }
  })
}
/******************************
 * TODO (목적): 자재 분류 저장
 *******************************/
function saveTypes() {
  editForm.value.validate().then((_result: any) => {
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
 * TODO (목적): 자재 분류 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  getList()
  rowClick({ materialTypeCd: result.data.materialTypeCd })
}
/********************
 * TODO (목적): Tree에서 체크한 메뉴 정보 update
 *******************************/
function updateSelected() {
  clicks.value++
  if (clicks.value === 1) {
    timer.value = setTimeout(function () {
      /** 행 클릭 */
      clicks.value = 0
    }, delay.value)
  } else {
    /** 행 더블 클릭 */
    clearTimeout(timer.value)
    clicks.value = 0
    selectUpType()
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.uptype-content-material
  height: 100%
  max-height: 600px !important
  min-height: 500px !important
  overflow-y: auto
</style>
