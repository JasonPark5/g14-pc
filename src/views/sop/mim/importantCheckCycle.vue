<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target-tree
            :editable="editable"
            type="search"
            label="설비유형"
            targetKey="equipClass"
            name="equipmentTypeCd"
            v-model:value="searchParam.equipmentTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            label="설비"
            type="search"
            name="equipmentCd"
            :customPopupParam="{ targetKey: 'equip' }"
            v-model:value="searchParam.equipmentCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            codeGroupCd="MDM_EQUIP_GRADE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="grade"
            label="중요도"
            v-model:value="searchParam.grade"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            label="관리부서"
            type="search"
            name="managementDepts"
            v-model:value="searchParam.managementDepts"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="설비 중요도 및 법정점검주기"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      rowKey="equipmentTypeCd"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <!-- <c-btn label="등록" icon="add_circle" /> -->
          <c-btn label="출력" icon="print" @btnClicked="btnPrint" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="props.row[col.name] === 'O'">
          <q-icon name="radio_button_unchecked" color="grey-7" />
        </template>
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
  name: 'importantCheckCycle'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  grade: stringNull
  inspectionCycleCd: stringNull
  equipmentCheckTypeCd: stringNull
  managementDepts: stringNull
  equipmentTypeCd: stringNull
  equipmentCd: stringNull
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
  plantCd: '',
  grade: null,
  inspectionCycleCd: null,
  equipmentCheckTypeCd: null,
  managementDepts: '',
  equipmentTypeCd: '',
  equipmentCd: ''
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<any>({
  merge: [
    { index: 0, colName: 'mergeGroup' },
    { index: 1, colName: 'mergeGroup' }
  ],
  columns: [
    {
      label: '설비유형',
      align: 'center',
      child: [
        {
          name: 'upEquipmentTypeName',
          field: 'upEquipmentTypeName',
          label: '대분류',
          style: 'width:160px',
          align: 'center',
          fix: true,
          sortable: false
        },
        {
          name: 'equipmentTypeName',
          field: 'equipmentTypeName',
          label: '중분류',
          style: 'width:160px',
          align: 'center',
          fix: true,
          sortable: false
        }
      ]
    },
    {
      name: 'equipmentCdName',
      field: 'equipmentCdName',
      label: '해당설비명(관리번호)',
      style: 'width:180px',
      align: 'left',
      sortable: false,
      fix: true,
      type: 'link'
    },
    {
      name: 'checkCycle',
      field: 'checkCycle',
      label: '법정점검주기',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'dailyInspection',
          field: 'dailyInspection',
          label: '일상',
          align: 'center',
          style: 'width:45px',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'twoWeeks',
          field: 'twoWeeks',
          label: '2주',
          align: 'center',
          style: 'width:45px',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'oneMonth',
          field: 'oneMonth',
          label: '1개월',
          style: 'width:45px',
          align: 'center',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'twoMonth',
          field: 'twoMonth',
          label: '2개월',
          align: 'center',
          style: 'width:45px',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'sixMonth',
          field: 'sixMonth',
          label: '6개월',
          align: 'center',
          style: 'width:45px',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'annualRemuneration',
          field: 'annualRemuneration',
          label: '연간',
          align: 'center',
          sortable: false,
          style: 'width:45px',
          type: 'custom'
        }
      ]
    },
    {
      label: '정비구분',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'operFlag',
          field: 'operFlag',
          label: '운전',
          align: 'center',
          style: 'width:50px',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'pmFlag',
          field: 'pmFlag',
          label: '예방',
          align: 'center',
          style: 'width:50px',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'predictiveFlag',
          field: 'predictiveFlag',
          label: '예측',
          align: 'center',
          style: 'width:50px',
          sortable: false,
          type: 'custom'
        },
        {
          name: 'cmFlag',
          field: 'cmFlag',
          label: '고장',
          align: 'center',
          style: 'width:50px',
          sortable: false,
          type: 'custom'
        }
      ]
    },
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:100px',
      align: 'center',
      sortable: false
      // rowspan: 5,
    },
    {
      name: 'managementDeptName',
      field: 'managementDeptName',
      label: '관리부서',
      style: 'width:120px',
      align: 'left',
      sortable: false
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      style: 'width:120px',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const listUrl = ref('')
const printUrl = ref('')
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
  listUrl.value = selectConfig.sop.min.equipment.checkCycle.list.url
  printUrl.value = selectConfig.sop.min.equipment.checkCycle.print.url
  // code setting
  grid.value.columns.splice(3, 0, {
    name: 'grade',
    field: 'grade',
    label: '중요도',
    style: 'width:80px',
    type: 'tag',
    colorItems: [
      { stepperMstCd: 'MEGC000001', stepperMstNm: $language('A등급'), colorClass: 'blue' },
      { stepperMstCd: 'MEGC000005', stepperMstNm: $language('B등급'), colorClass: 'green' },
      { stepperMstCd: 'MEGC000010', stepperMstNm: $language('C등급'), colorClass: 'orange' },
      { stepperMstCd: 'MEGC000015', stepperMstNm: $language('D등급'), colorClass: 'gray' }
    ],
    align: 'center',
    sortable: false
  })
  // list setting
  getList()
}
/******************************
 * TODO (목적): 설비등급 중요도 및 주기 조회
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
 * TODO (목적): 설비등급 중요도 및 주기 링크 클릭
 *******************************/
function linkClick(row: any, col: any) {
  if (!col.value) return
  let param = null
  if (col.name === 'equipmentCdName') {
    param = {
      equipmentCd: row.equipmentCd || '',
      plantCd: row ? row.plantCd : '',
      psmFlag: row ? row.psmFlag : ''
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/mdm/fim/equipmentDetail.vue`))
    )
    popupOptions.value.title = '설비마스터 상세'
    popupOptions.value.visible = true
    popupOptions.value.param = param
    popupOptions.value.isFull = true
    popupOptions.value.closeCallback = closePopup
  }
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
function btnPrint() {
  $http({
    url: printUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, $language('설비 중요도 및 법정점검주기'))
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = $language('설비 중요도 및 법정점검주기') + '.xlsx'
      link.click()
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
