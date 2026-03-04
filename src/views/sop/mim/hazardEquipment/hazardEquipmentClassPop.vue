<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="HHM_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="machineryClassification"
            label="기계분류"
            v-model:value="searchParam.machineryClassification"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="유해위험기계기구 목록"
      :columns="grid.columns"
      :data="grid.data"
      :selection="popupParam.type"
      :isExcelDown="false"
      :isExpan="false"
      :isFullScreen="false"
      :columnSetting="false"
      gridHeight="640px"
      rowKey="hhmHazardousMachineryId"
      @linkClick="linkClick"
      @rowDblclick="rowDblclick"
    >
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn label="검색" icon="search" @btnClicked="getList" />
            <c-btn label="선택" icon="check" @btnClicked="select" />
          </q-btn-group>
        </div>
      </template>
      <template v-slot:customArea="{ props }">
        <template v-if="props.row['inspectionSubjectFlag']">
          <q-chip
            outline
            square
            :color="setTagColor(props.row.inspectionSubjectFlag)"
            :class="props.row.inspectionSubjectFlag === 'A' ? 'blinking' : null"
          >
            <q-icon
              v-if="props.row.inspectionSubjectFlag === 'A'"
              name="alarm"
              style="margin-right: 5px"
            />
            {{ setTagName(props.row.inspectionSubjectFlag) }}
          </q-chip>
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
  name: 'hazardEquipmentClassPop'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface gridType {
  columns: tableColumnType
  data: Array<any>
}
interface propType {
  popupParam: {
    type: stringNull
    plantCd: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      type: 'single',
      plantCd: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const searchParam = ref({
  plantCd: null,
  machineryClassification: null,
  inspectionSubjectFlag: null,
  resultCd: null,
  gradeCd: null,
  inspectionKindCd: null,
  inspectionCycle: null,
  departmentDeptCd: '',
  departmentUserId: '',
  startYmd: '',
  endYmd: '',
  useFlag: 'Y'
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const listUrl = ref('')
const table = ref<any>(null)
const colorItems = ref<stepMasterType>([])
const grid = ref<gridType>({
  columns: [],
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
  listUrl.value = selectConfig.sop.hhm.hazard.check.list.url
  // code setting
  colorItems.value = [
    { stepperMstCd: 'Y', stepperMstNm: $language('대상'), colorClass: 'green' },
    { stepperMstCd: 'N', stepperMstNm: $language('비대상'), colorClass: 'orange' },
    { stepperMstCd: 'A', stepperMstNm: $language('지연'), colorClass: 'red' }
  ]
  if (props.popupParam.plantCd) {
    searchParam.value.plantCd = props.popupParam.plantCd
  }
  // list setting
  getList()
  setHeader()
}
/******************************
 * TODO (목적): 조회
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
function setHeader() {
  grid.value.columns = [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'machineryName',
      field: 'machineryName',
      label: '기계명',
      style: 'width:200px',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'inspectionSubjectFlag',
      field: 'inspectionSubjectFlag',
      label: '검사상태',
      type: 'custom',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'itemNo',
      field: 'itemNo',
      label: 'item 번호',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'machineryClassificationName',
      field: 'machineryClassificationName',
      label: '기계분류',
      style: 'width:160px',
      align: 'left',
      sortable: true
    },
    {
      name: 'amount',
      field: 'amount',
      label: '수량',
      align: 'center',
      sortable: true,
      style: 'width:40px'
    },
    {
      name: 'departmentDeptName',
      field: 'departmentDeptName',
      label: '담당부서',
      style: 'width:120px',
      align: 'left',
      sortable: true
    },
    {
      name: 'departmentUserName',
      field: 'departmentUserName',
      label: '담당자',
      align: 'center',
      sortable: true,
      style: 'width:80px'
    },
    {
      name: 'resultCd',
      field: 'resultCd',
      label: '검사결과',
      type: 'tag',
      colorItems: [
        { stepperMstCd: 'HRC000005', stepperMstNm: $language('합격'), colorClass: 'blue' },
        { stepperMstCd: 'HRC000010', stepperMstNm: $language('불합격'), colorClass: 'red' }
      ],
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'gradeName',
      field: 'gradeName',
      label: '등급',
      align: 'center',
      style: 'width:60px',
      sortable: true
    },
    {
      name: 'inspectionKindName',
      field: 'inspectionKindName',
      label: '검사종류',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'inspectionCycleName',
      field: 'inspectionCycleName',
      label: '검사주기',
      align: 'center',
      sortable: true,
      style: 'width:90px'
    },
    {
      name: 'lastInspectionDate',
      field: 'lastInspectionDate',
      label: '최근검사일',
      align: 'center',
      sortable: true,
      style: 'width:90px'
    },
    {
      name: 'nextInspectionDate',
      field: 'nextInspectionDate',
      label: '차기검사일',
      align: 'center',
      sortable: true,
      style: 'width:90px'
    },
    {
      name: 'inspCertificateIssuanceDate',
      field: 'inspCertificateIssuanceDate',
      label: '검사증교부일',
      align: 'center',
      sortable: true,
      style: 'width:90px'
    }
  ]
}
/******************************
 * TODO (목적): 선택
 *******************************/
function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '세부추진사항을 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', selectData)
  }
}
/******************************
 * TODO (목적): Row 더블클릭
 *******************************/
function rowDblclick(row: any) {
  if (props.popupParam.type === 'single') {
    emits('closePopup', [row])
  }
}
/******************************
 * TODO (목적): 링크클릭
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '유해위험기계기구 상세'
  popupOptions.value.param = {
    hhmHazardousMachineryId: row.hhmHazardousMachineryId || ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(
      () => import(`@views/sop/mim/hazardEquipment/hazardEquipmentClassDetail.vue`)
    )
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
function setTagColor(data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { stepperMstCd: data })
    return color ? color.attrVal1 || color.colorClass : ''
  } else {
    return ''
  }
}
function setTagName(data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { stepperMstCd: data })
    return color ? color.codeName || color.stepperMstNm : ''
  } else {
    return ''
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
