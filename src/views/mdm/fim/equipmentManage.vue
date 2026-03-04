<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept label="관리부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :customPopupParam="{ targetKey: 'process' }"
            label="단위공정"
            name="subProcessCd"
            v-model:value="searchParam.subProcessCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="MDM_EQUIP_GRADE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="grade"
            label="설비등급"
            v-model:value="searchParam.grade"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="discardFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="discardFlag"
            label="폐기여부"
            v-model:value="searchParam.discardFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="설비 목록"
      selection="multiple"
      rowKey="equipmentCd"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="QR코드 출력" icon="save_alt" @btnClicked="btnQrCode" />
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="openPop" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentManage'
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
  deptCd: stringNull
  subProcessCd: stringNull
  equipmentName: stringNull
  equipmentTypeCd: stringNull
  grade: stringNull
  discardFlag: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  deptCd: null,
  subProcessCd: null,
  equipmentName: '',
  equipmentTypeCd: '',
  grade: null,
  discardFlag: 'N'
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const discardFlagItems = ref<codeMasterType>([
  { code: 'N', codeName: '미폐기' },
  { code: 'Y', codeName: '폐기' }
])
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width: 120px'
    },
    {
      name: 'equipmentNo',
      field: 'equipmentNo',
      label: '설비관리번호',
      align: 'center',
      sortable: true,
      style: 'width: 150px'
    },
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'left',
      sortable: true,
      style: 'width: 250px',
      type: 'link'
    },
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '설비유형',
      align: 'center',
      sortable: true,
      style: 'width: 250px'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '단위공정',
      align: 'center',
      sortable: true,
      style: 'width: 200px'
    },
    {
      name: 'managementDeptName',
      field: 'managementDeptName',
      label: '관리부서',
      align: 'center',
      sortable: true
    },
    {
      name: 'equipmentLocation',
      field: 'equipmentLocation',
      label: '설비위치',
      align: 'center',
      sortable: true
    },
    {
      name: 'equipGradeName',
      field: 'equipGradeName',
      label: '설비등급',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'discardFlag',
      field: 'discardFlag',
      label: '폐기여부',
      align: 'center',
      sortable: true,
      style: 'width: 70px'
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const table = ref<any>(null)

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
  editable.value = Boolean(route.meta.editable)
  listUrl.value = selectConfig.mdm.equipment.list.url
  getList()
}
/******************************
 * TODO (목적): 설비 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 행 링크 클릭
 * @param (1): 행 전체 정보
 *******************************/
function linkClick(row: any) {
  openPop(row)
}
/******************************
 * TODO (목적): 설비 상세 팝업창 표시
 * @param (1): 행 전체 정보 (신규등록인 경우 null)
 *******************************/
function openPop(row: any) {
  popupOptions.value.title = '설비 상세'
  popupOptions.value.param = {
    equipmentCd: row ? row.equipmentCd : '',
    plantCd: row ? row.plantCd : '',
    psmFlag: row ? row.psmFlag : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/mdm/fim/equipmentDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 설비 상세 팝업창 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): QR코드 팝업 표시
 *******************************/
function btnQrCode() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning'
    })
    return
  }
  if (selectData.length > 10) {
    message.alert({
      title: '안내',
      message: 'QR코드 일괄출력은 한번에 10개까지 가능합니다.',
      type: 'warning'
    })
    return
  }
  popupOptions.value.title = '설비 QR코드'
  popupOptions.value.param = {
    selectData: selectData
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./equipmentQr.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '800px'
  popupOptions.value.closeCallback = closePopup
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
