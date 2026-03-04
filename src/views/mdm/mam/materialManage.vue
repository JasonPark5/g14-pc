<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text label="자재명" name="materialName" v-model:value="searchParam.materialName" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="MATERIAL_KIND_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="materialKindCd"
            label="자재구분"
            v-model:value="searchParam.materialKindCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            name="materialTypeCd"
            label="자재분류"
            :customPopupParam="{ targetKey: 'materialType' }"
            v-model:value="searchParam.materialTypeCd"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="materialTable"
          title="자재목록"
          tableId="materialTable"
          :columns="grid.columns"
          :data="grid.data"
          :columnSetting="false"
          :editable="editable"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <q-form ref="editForm">
          <!-- 상세 -->
          <c-card title="상세" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn label="등록" v-if="editable" icon="add" @btnClicked="addData" />
                <c-btn
                  label="삭제"
                  v-if="editable && dataeditable && updateMode"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable && saveable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="data"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveMaterial"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-12">
                <!-- 자재관리번호 -->
                <c-text
                  :required="true"
                  :editable="editable && dataeditable"
                  label="자재관리번호"
                  name="materialNo"
                  v-model:value="data.materialNo"
                />
              </div>
              <div class="col-12">
                <!-- 자재명 -->
                <c-text
                  :required="true"
                  :editable="editable && dataeditable"
                  label="자재명"
                  name="materialName"
                  v-model:value="data.materialName"
                />
              </div>
              <div class="col-12">
                <c-task-target
                  name="materialTypeCd"
                  label="자재분류"
                  :customPopupParam="{ targetKey: 'materialType' }"
                  v-model:value="data.materialTypeCd"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { materialType } from './material'

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
  name: 'materialManage'
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
const searchParam = ref<any>({
  useFlag: 'Y',
  materialCd: '',
  materialName: '',
  chemMaterialFlag: null,
  materialTypeCd: '',
  materialKindCd: null
})
const useFlagItems = ref<codeMasterType>([])
const data = ref<materialType>({
  materialCd: '', // 자재코드
  materialNo: '', // 자재관리번호
  materialName: '', // 자재명(KOR)
  materialNameEn: '', // 자재명(ENG)
  chemMaterialFlag: '', // 화학자재 여부
  materialGroupCd: '', // 자재그룹 코드
  materialGroupName: '', // 자재그룹 명
  materialTypeCd: null, // 자재분류코드
  useFlag: 'Y' // 사용여부
})
const listUrl = ref('')
const detailUrl = ref('')
const checkUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const saveable = ref(false)
const deleteable = ref(false)
const dataeditable = ref(false)
const updateMode = ref(false)
const isSave = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const editForm = ref<any>(null)
const grid = ref<any>({
  columns: [
    {
      name: 'materialKindName',
      field: 'materialKindName',
      label: '자재구분',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'upMaterialTypeName',
      field: 'upMaterialTypeName',
      label: '자재 대분류',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'materialTypeName',
      field: 'materialTypeName',
      label: '자재 중분류',
      style: 'width:140px',
      align: 'center',
      sortable: true
    },
    {
      name: 'materialNo',
      field: 'materialNo',
      label: '자재관리번호',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'materialName',
      field: 'materialName',
      label: '자재명',
      align: 'left',
      sortable: true
    }
  ],
  data: []
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
  saveUrl.value = transactionConfig.mdm.user.insert.url
  listUrl.value = selectConfig.mdm.mam.material.list.url
  detailUrl.value = selectConfig.mdm.mam.material.get.url
  checkUrl.value = selectConfig.mdm.mam.material.check.url
  insertUrl.value = transactionConfig.mdm.mam.material.insert.url
  updateUrl.value = transactionConfig.mdm.mam.material.update.url
  deleteUrl.value = transactionConfig.mdm.mam.material.delete.url
  // code setting
  dataeditable.value = false
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 자재마스터 조회
 *******************************/
function getList() {
  reset()

  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
  saveable.value = false
  deleteable.value = false
}
/******************************
 * TODO (목적): 자재마스터 상세 조회
 *******************************/
function rowClick(row: materialType) {
  // 상세조회
  saveable.value = true
  deleteable.value = true
  updateMode.value = true

  $http({
    url: $format(detailUrl.value, row.materialCd),
    method: 'GET'
  }).then((_result: any) => {
    data.value = _result.data
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
    dataeditable.value = true
  })
}
/******************************
 * TODO (목적): 자재마스터 추가
 *******************************/
function addData() {
  saveable.value = true
  deleteable.value = false
  saveUrl.value = insertUrl.value
  saveType.value = 'POST'
  updateMode.value = false
  dataeditable.value = true
  data.value = {
    materialCd: '', // 자재코드
    materialNo: '', // 자재관리번호
    materialName: '', // 자재명(KOR)
    materialNameEn: '', // 자재명(ENG)
    chemMaterialFlag: '', // 화학자재 여부
    materialGroupCd: '', // 자재그룹 코드
    materialGroupName: '', // 자재그룹 명
    materialTypeCd: null, // 자재분류코드
    useFlag: 'Y' // 사용여부
  }
}
/******************************
 * TODO (목적): 자재마스터 초기화
 *******************************/
function reset() {
  saveable.value = false
  deleteable.value = false
  updateMode.value = false
  dataeditable.value = false
  data.value = {
    materialCd: '', // 자재코드
    materialNo: '', // 자재관리번호
    materialName: '', // 자재명(KOR)
    materialNameEn: '', // 자재명(ENG)
    chemMaterialFlag: '', // 화학자재 여부
    materialGroupCd: '', // 자재그룹 코드
    materialGroupName: '', // 자재그룹 명
    materialTypeCd: null, // 자재분류코드
    useFlag: 'Y' // 사용여부
  }
}
/******************************
 * TODO (목적): 자재마스터 저장
 *******************************/
function saveMaterial() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: $format(checkUrl.value, data.value.materialNo),
        method: 'GET'
      }).then((_result: any) => {
        if (updateMode.value || _result.data === 0) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',

            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              data.value.regUserId = user.value.userId
              data.value.chgUserId = user.value.userId
              isSave.value = !isSave.value
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 자재코드가 존재합니다.', // 동일한 자재코드가 존재합니다.
            type: 'warning' // success / info / warning / error
          })
          return
        }
      })
    }
  })
}
/******************************
 * TODO (목적): 자재마스터 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',

    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, data.value.materialCd),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        getList()
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 자재마스터 저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
