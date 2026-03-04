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
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            type="search"
            label="담당부서"
            name="departmentDeptCd"
            v-model:value="searchParam.departmentDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-field
            type="user"
            label="담당자"
            name="departmentUserId"
            v-model:value="searchParam.departmentUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="HAZARD_GRADE_CD"
            itemText="codeName"
            itemValue="code"
            name="gradeCd"
            label="등급"
            v-model:value="searchParam.gradeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            codeGroupCd="HAZARD_RESULT_CD"
            itemText="codeName"
            itemValue="code"
            name="resultCd"
            label="검사결과"
            v-model:value="searchParam.resultCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            type="search"
            itemText="codeName"
            itemValue="code"
            codeGroupCd="INSPECTION_SUBJECT_FLAG"
            :editable="editable"
            label="검사상태 여부"
            name="inspectionSubjectFlag"
            v-model:value="searchParam.inspectionSubjectFlag"
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
    <c-table
      ref="table"
      title="유해위험기계기구 목록"
      tableId="equipmentInsp"
      :columns="grid.columns"
      :data="grid.data"
      :checkClickFlag="false"
      rowKey="hhmHazardousMachineryId"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
      <template v-slot:customArea="{ props }">
        <template v-if="props.row['inspectionSubjectFlag']">
          <q-chip
            v-if="props.row.inspectionSubjectFlag === 'A'"
            :color="setTagColor(props.row.inspectionSubjectFlag)"
            outline
            square
            class="full-size-chip inspectionSubjectFlag-blinking"
            text-color="white"
            icon="alarm"
          >
            {{ setTagName(props.row.inspectionSubjectFlag) }}
          </q-chip>
          <q-chip
            v-else
            :color="setTagColor(props.row.inspectionSubjectFlag)"
            outline
            square
            class="full-size-chip"
            text-color="white"
          >
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
  name: 'hazardEquipmentClass'
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
interface gridType {
  columns: tableColumnType
  data: Array<any>
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<any>({
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
const grid = ref<gridType>({
  columns: [
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
      sortable: true
    },
    {
      name: 'itemNo',
      field: 'itemNo',
      label: 'item No',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'machineryClassificationName',
      field: 'machineryClassificationName',
      label: '기계분류',
      style: 'width:170px',
      align: 'center',
      sortable: true
    },
    {
      name: 'processName',
      field: 'processName',
      label: '단위공정',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'departmentDeptName',
      field: 'departmentDeptName',
      label: '담당부서',
      style: 'width:150px',
      align: 'left',
      sortable: true
    },
    {
      name: 'departmentUserName',
      field: 'departmentUserName',
      label: '담당자',
      align: 'center',
      sortable: true
    },
    {
      name: 'gradeName',
      field: 'gradeName',
      label: '등급',
      align: 'center',
      style: 'width:50px',
      sortable: true
    },
    {
      name: 'inspectionKindName',
      field: 'inspectionKindName',
      label: '검사종류',
      align: 'center',
      sortable: true,
      style: 'width:70px'
    },
    {
      name: 'inspectionCycleName',
      field: 'inspectionCycleName',
      label: '검사주기',
      align: 'center',
      sortable: true
    },
    {
      name: 'lastInspectionDate',
      field: 'lastInspectionDate',
      label: '최근검사일',
      align: 'center',
      sortable: true
    },
    {
      name: 'nextInspectionDate',
      field: 'nextInspectionDate',
      label: '차기검사일',
      align: 'center',
      sortable: true
    },
    {
      name: 'inspCertificateIssuanceDate',
      field: 'inspCertificateIssuanceDate',
      label: '검사증교부일',
      align: 'center',
      sortable: true
    },
    {
      name: 'useFlagName',
      field: 'useFlagName',
      label: '사용여부',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const listUrl = ref('')
const useFlagItems = ref<Array<codeMasterType>>([])
const colorItems = ref<Array<any>>([])
const period = ref<any>([])

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
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function linkClick(row?: any) {
  popupOptions.value.title = '유해위험기계기구 상세'
  popupOptions.value.param = {
    hhmHazardousMachineryId: row ? row.hhmHazardousMachineryId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./hazardEquipmentClassDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
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
