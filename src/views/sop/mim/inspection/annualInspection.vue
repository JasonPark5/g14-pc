<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="targetItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="targetYn"
            label="올해점검대상"
            v-model:value="searchParam.targetYn"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            label="점검년도"
            name="year"
            type="year"
            default="today"
            v-model:value="searchParam.year"
          />
        </div>
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
            type="search"
            codeGroupCd="MDM_CHECK_KIND_CD"
            itemText="codeName"
            itemValue="code"
            name="equipmentCheckKindCd"
            label="점검유형"
            v-model:value="searchParam.equipmentCheckKindCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            codeGroupCd="MDM_EQUIP_CYCLE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="inspectionCycleCd"
            label="법정점검주기"
            v-model:value="searchParam.inspectionCycleCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="MDM_EQUIP_CYCLE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="selfCycleCd"
            label="자체점검주기"
            v-model:value="searchParam.selfCycleCd"
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
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-multi-select
            :editable="editable"
            codeGroupCd="RELATED_LAWS_CD"
            itemText="codeName"
            itemValue="code"
            label="관련법규"
            name="relatedLawList"
            maxValues="3"
            v-model:value="searchParam.relatedLawList"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="설비등급 및 점검계획표"
      :columns="grid.columns"
      :checkClickFlag="false"
      :data="grid.data"
      rowKey="equipmentCd"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="등록" v-if="editable" icon="add" @btnClicked="onItemClick()" />
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
  name: 'annualInspection'
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
  year: stringNull
  equipmentCheckKindCd: stringNull
  relatedLawList: arrayString | null
  equipmentTypeCd: stringNull
  equipmentCd: stringNull
  inspectionCycleCd: stringNull
  selfCycleCd: stringNull
  targetYn: stringNull
  grade: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: '',
  year: '',
  equipmentCheckKindCd: null,
  relatedLawList: [],
  equipmentTypeCd: '',
  equipmentCd: '',
  inspectionCycleCd: null,
  selfCycleCd: null,
  targetYn: null,
  grade: ''
})
const listUrl = ref('')
const table = ref<any>(null)
const targetItems = ref<codeMasterType>([])
const grid = ref<any>({
  merge: [
    { index: 0, colName: 'equipmentTypeCd' },
    { index: 1, colName: 'equipmentTypeCd' }
  ],
  columns: [
    {
      name: 'upEquipmentTypeName',
      field: 'upEquipmentTypeName',
      label: '대분류',
      style: 'width:200px',
      align: 'center',
      fix: true,
      sortable: false
    },
    {
      name: 'equipmentTypeName',
      field: 'equipmentTypeName',
      label: '중분류',
      style: 'width:170px',
      align: 'center',
      fix: true,
      sortable: false
    },
    {
      name: 'equipmentCdName',
      field: 'equipmentCdName',
      label: '설비명(관리번호)',
      style: 'width:180px',
      align: 'left',
      sortable: false,
      fix: true,
      type: 'link'
    },
    {
      name: 'estimationScore',
      field: 'estimationScore',
      label: '평가점수',
      style: 'width:60px',
      align: 'center',
      fix: true,
      sortable: false
    },
    {
      name: 'gradeName',
      field: 'gradeName',
      label: '위험등급',
      style: 'width:80px',
      align: 'center',
      fix: true,
      sortable: false
    },

    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: false
      // rowspan: 5,
    },
    {
      label: '점검일정',
      align: 'center',
      style: 'width:360px',
      sortable: false,
      child: [
        {
          name: 'mon01',
          field: 'mon01',
          label: '1월',
          align: 'center',
          style: 'width:50px',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon02',
          field: 'mon02',
          label: '2월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon03',
          field: 'mon03',
          label: '3월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon04',
          field: 'mon04',
          label: '4월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon05',
          field: 'mon05',
          label: '5월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon06',
          field: 'mon06',
          label: '6월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon07',
          field: 'mon07',
          label: '7월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon08',
          field: 'mon08',
          label: '8월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon09',
          field: 'mon09',
          label: '9월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon10',
          field: 'mon10',
          label: '10월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon11',
          field: 'mon11',
          label: '11월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        },
        {
          name: 'mon12',
          field: 'mon12',
          label: '12월',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'link'
        }
      ]
    },
    {
      label: '법정점검',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'recentInspectionDate',
          field: 'recentInspectionDate',
          label: '최근일',
          style: 'width:80px',
          align: 'center',
          sortable: false
        },
        {
          name: 'inspectionRequestDate',
          field: 'inspectionRequestDate',
          label: '필요일',
          style: 'width:80px',
          align: 'center',
          sortable: false
        },
        {
          name: 'inspectionCycleName',
          field: 'inspectionCycleName',
          label: '주기',
          style: 'width:60px',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      label: '자체점검',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'recentSelfDate',
          field: 'recentSelfDate',
          label: '최근일',
          style: 'width:80px',
          align: 'center',
          sortable: false
        },
        {
          name: 'selfRequestDate',
          field: 'selfRequestDate',
          label: '필요일',
          style: 'width:80px',
          align: 'center',
          sortable: false
        },
        {
          name: 'selfCycleName',
          field: 'selfCycleName',
          label: '주기',
          style: 'width:60px',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      label: '점검자',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'checkDeptNames',
          field: 'checkDeptNames',
          label: '부서',
          style: 'width:100px',
          align: 'left',
          sortable: false
        },
        {
          name: 'checkUserNames',
          field: 'checkUserNames',
          style: 'width:150px',
          label: '점검자',
          align: 'left',
          sortable: false
        }
      ]
    },
    {
      name: 'managementDeptName',
      field: 'managementDeptName',
      label: '관리부서',
      align: 'left',
      style: 'width:150px',
      sortable: false
    },
    {
      label: '정비계획',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'cmFlagName',
          field: 'cmFlagName',
          style: 'width:80px',
          label: '고장정비',
          align: 'center',
          sortable: false
        },
        {
          name: 'preventCycleName',
          field: 'preventCycleName',
          style: 'width:100px',
          label: '예방정비',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      align: 'left',
      style: 'width:280px',
      sortable: false
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
  listUrl.value = selectConfig.sop.min.equipment.annual.list.url
  // code setting
  targetItems.value = [
    { code: 'Y', codeName: $language('대상') },
    { code: 'N', codeName: $language('비대상') }
  ]
  grid.value.columns.splice(6, 0, {
    name: 'targetYn',
    field: 'targetYn',
    label: '올해법정점검대상',
    align: 'center',
    style: 'width:72px',
    type: 'tag',
    colorItems: [
      { stepperMstCd: 'Y', stepperMstNm: $language('대상'), colorClass: 'blue' },
      { stepperMstCd: 'N', stepperMstNm: $language('비대상'), colorClass: 'blue-grey-4' }
    ],
    sortable: false
    // rowspan: 5,
  })
  searchParam.value.year = '2021'
  // list setting
  getList()
}
/******************************
 * TODO (목적): 연간설비계획 조회
 *******************************/
function getList() {
  if (!searchParam.value.year) {
    message.alert({
      title: '안내',
      message: '점검년도를 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  // 전체조회

  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 연간설비계획 상세 조회
 *******************************/
/* eslint-disable no-unused-vars */
function linkClick(row: any, col: any) {
  let title = ''
  let param = null
  if (col && col.name === 'equipmentCdName') {
    param = {
      equipmentCd: row.equipmentCd || '',
      plantCd: row ? row.plantCd : '',
      psmFlag: row ? row.psmFlag : ''
    }
    title = '설비마스터 상세'

    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/mdm/fim/equipmentDetail.vue`))
    )
    popupOptions.value.isFull = true
  } else {
    param = {
      selectData: [],
      plantCd: row.plantCd || '',
      equipmentCd: row.equipmentCd || '',
      checkDate: searchParam.value.year + '-' + col.name.substring(3)
    }
    title =
      $language('연간점검계획 상세') +
      ' [' +
      row.equipmentCdName +
      ' | ' +
      searchParam.value.year +
      '/' +
      col.name.substring(3) +
      ']'

    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./equipmentPlan.vue`))
    )
  }
  popupOptions.value.title = title
  popupOptions.value.param = param
  popupOptions.value.width = '95%'
  popupOptions.value.isFull = false
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 연간설비계획 상세 닫기 콜백
 *******************************/
function closePopup(type: string) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  table.value.setSelected([])
  if (type === 'COMPLETE' || type === 'SAVE') {
    message.requestSuccess()
  }
  getList()
}
/******************************
 * TODO (목적): 연간설비계획 신규 등록
 *******************************/
function onItemClick() {
  const selectData = table.value.getSelected()
  let title = ''
  let param = null
  param = {
    title: '연간점검계획',
    selectData: selectData ? selectData : [],
    equipmentCd: '',
    checkDate: ''
  }
  title = '연간점검계획 상세'
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./equipmentPlan.vue`)))

  popupOptions.value.title = title
  popupOptions.value.param = param
  popupOptions.value.width = '95%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
