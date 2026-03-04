<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker name="year" type="year" label="점검년도" v-model:value="searchParam.year" />
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
            codeGroupCd="MIM_CHECK_RESULT_CD"
            itemText="codeName"
            itemValue="code"
            name="resultCd"
            label="결과"
            v-model:value="searchParam.resultCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :range="true"
            name="period"
            label="실행기간"
            defaultStart="-6M"
            defaultEnd="6M"
            v-model:value="period"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="editable"
            :comboItems="typeItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="equipmentType"
            label="현황분류"
            v-model:value="searchParam.equipmentType"
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
      title="설비점검/정비완료 현황 목록"
      tableId="equipmentCd"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'resultName'">
          <div :class="props.row[col.name] === '부적합' ? 'text-red' : ''">
            {{ props.row[col.name] }}
          </div>
        </template>
        <template v-if="col.name === 'statusTypeCd'">
          <q-chip
            :color="setTagColor(props.row.statusTypeCd)"
            outline
            square
            :clickable="true"
            text-color="white"
            class="full-size-chip"
            @click="linkClick(props.row, { name: 'statusTypeCd' })"
          >
            {{ setTagName(props.row.statusTypeCd) }}
          </q-chip>
        </template>
      </template>
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
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
  name: 'equipmentMaintainStatus'
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
  plantCd: null
  // 설비점검 start
  safCheckTypeCd1: stringNull
  // 설비정비 start
  safCheckTypeCd2: stringNull
  resultCd: stringNull
  startYmd: stringNull
  endYmd: stringNull
  noPlanResultEnrollFlag: stringNull
  relatedLawList: Array<string> | null
  lawEquipmentFlag: stringNull
  equipmentType: stringNull
  year: stringNull
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

const searchParam = ref<searchParamType>({
  plantCd: null,
  equipmentCd: '',
  // 설비점검 start
  safCheckTypeCd1: null,
  // 설비정비 start
  safCheckTypeCd2: null,
  resultCd: null,
  startYmd: '',
  endYmd: '',
  noPlanResultEnrollFlag: null,
  relatedLawList: [],
  lawEquipmentFlag: null,
  equipmentType: null,
  year: ''
})
const period = ref(['', ''])
const typeItems = ref<codeMasterType>([])
const colorItems = ref<stepMasterType>([])
const listUrl = ref('')
const grid = ref<any>({
  merge: [
    { index: 0, colName: 'equipmentCdName' },
    { index: 1, colName: 'equipmentCdName' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'equipmentCdName',
      field: 'equipmentCdName',
      label: '설비명 (관리번호)',
      style: 'width:130px',
      align: 'center',
      sortable: false,
      type: 'link'
    },
    {
      name: 'statusTypeCd',
      field: 'statusTypeCd',
      label: '현황분류',
      style: 'width:40px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '점검부서/정비입회자',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'typeName',
      field: 'typeName',
      label: '점검/정비 유형',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'cycleName',
      field: 'cycleName',
      label: '주기',
      style: 'width:50px',
      align: 'center',
      sortable: false
    },
    {
      label: '점검/정비',
      align: 'center',
      sortable: false,
      child: [
        {
          name: 'realDate',
          field: 'realDate',
          label: '실행일',
          style: 'width:80px',
          align: 'center',
          sortable: false
        },
        {
          name: 'userName',
          field: 'userName',
          label: '담당자',
          style: 'width:80px',
          align: 'center',
          sortable: false
        },
        {
          name: 'resultName',
          field: 'resultName',
          label: '결과',
          style: 'width:60px',
          type: 'custom',
          align: 'center',
          sortable: false
        }
      ]
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      style: 'width:200px',
      align: 'left',
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
  listUrl.value = selectConfig.sop.min.equipment.maintain.list.url
  // code setting
  typeItems.value = [
    { code: '1', codeName: $language('점검') },
    { code: '2', codeName: $language('정비') }
  ]
  colorItems.value = [
    { stepperMstCd: 'Y', stepperMstNm: $language('점검'), colorClass: 'green' },
    { stepperMstCd: 'N', stepperMstNm: $language('정비'), colorClass: 'orange' }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 설비 유지 관리 조회
 *******************************/
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
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
 * TODO (목적): 설비 유지 관리 상세 클릭
 *******************************/
/* eslint-disable no-unused-vars */
function linkClick(row: any, col: any) {
  if (col && col.name === 'equipmentCdName') {
    popupOptions.value.param = {
      equipmentCd: row ? row.equipmentCd : '',
      plantCd: row ? row.plantCd : '',
      psmFlag: row ? row.psmFlag : ''
    }
    popupOptions.value.title = '설비마스터 상세'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@views/mdm/fim/equipmentDetail.vue`))
    )
  } else if (col && col.name === 'statusTypeCd') {
    popupOptions.value.title = $language('설비점검/정비 현황') + ' [' + row.equipmentCdName + ']'
    popupOptions.value.param = {
      statusTypeName: row.statusTypeName,
      minEquipmentCheckId: row.minEquipmentCheckId ? row.minEquipmentCheckId : '',
      equipmentCd: row.equipmentCd,
      realDate: row.realDate,
      year: searchParam.value.year
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./equipmentRecord.vue`))
    )
  }
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 설비 유지 관리 상세 닫기 콜백
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 진행상태 Tag 색 지정
 *******************************/
function setTagColor(data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { stepperMstCd: data })
    return color ? color.attrVal1 || color.colorClass : ''
  } else {
    return ''
  }
}
/******************************
 * TODO (목적): 진행상태 Tag 이름 지정
 *******************************/
function setTagName(_data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: _data }) || _.find(colorItems.value, { stepperMstCd: _data })
    return color ? color.codeName || color.stepperMstNm : ''
  } else return ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
