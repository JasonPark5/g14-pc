<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            defaultStart="-6M"
            defaultEnd="1M"
            label="변경 작업 기간"
            name="mocPeriod"
            v-model:value="searchParam.mocPeriod"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-dept
            type="search"
            label="발의부서"
            name="initiativeDeptCd"
            v-model:value="searchParam.initiativeDeptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="stepItems"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="mocStepCd"
            label="진행단계"
            v-model:value="searchParam.mocStepCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="임시변경-MOC 목록"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add_circle" @btnClicked="openPopup" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:table-chip>
        <div style="font-size: 0.9em; padding-left: 10px">
          <span class="text-red-7">▲</span> : {{ $language('변경관리 대상업무-문서추가 미완') }}
          <span class="text-green" style="padding-left: 10px">●</span> :
          {{ $language('변경관리 대상업무-문서추가 완료') }}
        </div>
      </template>
      <template v-slot:customArea="{ props, col }">
        <div
          v-if="props.row[col.name]"
          :class="
            props.row[col.name] === '●' || props.row[col.name] === 'Y' ? 'text-green' : 'text-red-7'
          "
        >
          <template v-if="props.row[col.name] === 'Y'">●</template>
          <template v-else-if="props.row[col.name] === 'N'"
            ><q-icon name="close" style="font-weight: 700" size="1.2em"
          /></template>
          <template v-else>{{ props.row[col.name] }}</template>
          <q-tooltip
            v-if="
              col.name !== 'changeFlag' &&
              props.row[col.name] !== 'Y' &&
              props.row[col.name] !== 'N'
            "
            class="text-caption"
            :offset="[0, 0]"
          >
            <span v-if="props.row.psiDueDate">
              완료예정일 : {{ props.row.psiDueDate }}<br />
              남은일수 : {{ daysLeft(props.row.psiDueDate) }}</span
            >
            <span v-else-if="col.name === 'riskAssessFlag' && props.row.ramDueDate">
              완료예정일 : {{ props.row.ramDueDate }}<br />
              남은일수 : {{ daysLeft(props.row.ramDueDate) }}</span
            >
            <span v-else-if="col.name === 'preStartFlag' && props.row.preDueDate">
              완료예정일 : {{ props.row.preDueDate }}<br />
              남은일수 : {{ daysLeft(props.row.preDueDate) }}</span
            >
            <span v-else-if="col.name === 'workpermitFlag' && props.row.swpDueDate">
              완료예정일 : {{ props.row.swpDueDate }}<br />
              남은일수 : {{ daysLeft(props.row.swpDueDate) }}</span
            >
            <span v-else-if="col.name === 'eduFlag' && props.row.eduDueDate">
              완료예정일 : {{ props.row.eduDueDate }}<br />
              남은일수 : {{ daysLeft(props.row.eduDueDate) }}</span
            >
            <span v-else-if="col.name === 'licenseFlag' && props.row.licenseDueDate">
              완료예정일 : {{ props.row.licenseDueDate }}<br />
              남은일수 : {{ daysLeft(props.row.licenseDueDate) }}</span
            >
          </q-tooltip>
        </div>
        <template v-else />
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
import { mocType } from './moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'mocTemp'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  mocPeriod: [],
  initiativeDeptCd: null,
  mocStepCd: null,
  mocTypeCd: 'MT00000005'
})
const grid = ref({
  merge: [{ index: 0, colName: 'initiativeYear' }],
  columns: [
    {
      name: 'initiativeYear',
      field: 'initiativeYear',
      label: '년도',
      align: 'center',
      style: 'width:60px',
      sortable: true,
      fix: true
    },
    {
      name: 'yearRank',
      field: 'yearRank',
      label: '#',
      align: 'center',
      style: 'width:45px',
      sortable: true,
      fix: true
    },
    {
      name: 'initiativeDt',
      field: 'initiativeDt',
      label: '발의일',
      align: 'center',
      style: 'width:80px',
      sortable: true,
      fix: true
    },
    {
      name: 'mocTitle',
      field: 'mocTitle',
      label: '제목',
      align: 'left',
      sortable: true,
      style: 'width:280px',
      type: 'link',
      fix: true
    },
    {
      name: 'mocStepName',
      field: 'mocStepName',
      label: '진행단계',
      align: 'center',
      style: 'width:90px',
      sortable: true,
      fix: true
    },
    // {
    //   name: 'bizApprStepNm',
    //   field: 'bizApprStepNm',
    //   label: '결재진행단계',
    //   align: 'center',
    //   style: 'width:100px',
    //   sortable: true
    // },
    {
      name: 'mocTypeName',
      field: 'mocTypeName',
      label: '변경구분',
      align: 'center',
      style: 'width:70px',
      sortable: true,
      fix: true
    },
    {
      name: 'changeFlag',
      field: 'changeFlag',
      label: '변경관리위원회 승인여부',
      align: 'center',
      style: 'width:80px',
      sortable: true,
      type: 'custom'
    },
    {
      name: 'psi',
      field: 'psi',
      label: '공정안전자료',
      child: [
        {
          name: 'pidFlag',
          field: 'pidFlag',
          label: 'P&ID',
          align: 'center',
          style: 'width:70px',
          sortable: true,
          type: 'custom'
        },
        {
          name: 'powerMachineFlag',
          field: 'powerMachineFlag',
          label: '동력기계',
          align: 'center',
          style: 'width:70px',
          sortable: true,
          type: 'custom'
        },
        {
          name: 'deviceEquipmentFlag',
          field: 'deviceEquipmentFlag',
          label: '장치 및 설비',
          align: 'center',
          style: 'width:90px',
          sortable: true,
          type: 'custom'
        },
        {
          name: 'pipeGasketFlag',
          field: 'pipeGasketFlag',
          label: '배관 및 개스킷',
          align: 'center',
          style: 'width:70px',
          sortable: true,
          type: 'custom'
        },
        {
          name: 'safetyValveRuptureDiskFlag',
          field: 'safetyValveRuptureDiskFlag',
          label: '배관 및 개스킷',
          align: 'center',
          style: 'width:80px',
          sortable: true,
          type: 'custom'
        },
        {
          name: 'documentFlag',
          field: 'documentFlag',
          label: '절차서',
          align: 'center',
          style: 'width:70px',
          sortable: true,
          type: 'custom'
        }
      ]
    },
    {
      name: 'riskAssessFlag',
      field: 'riskAssessFlag',
      label: '위험성평가',
      align: 'center',
      style: 'width:80px',
      sortable: true,
      type: 'custom'
    },
    {
      name: 'preStartFlag',
      field: 'preStartFlag',
      label: '가동전점검',
      align: 'center',
      style: 'width:80px',
      sortable: true,
      type: 'custom'
    },
    {
      name: 'workpermitFlag',
      field: 'workpermitFlag',
      label: '안전작업허가',
      align: 'center',
      style: 'width:80px',
      sortable: true,
      type: 'custom'
    },
    {
      name: 'eduFlag',
      field: 'eduFlag',
      label: '교육',
      align: 'center',
      style: 'width:60px',
      sortable: true,
      type: 'custom'
    },
    {
      name: 'licenseFlag',
      field: 'licenseFlag',
      label: '인허가',
      align: 'center',
      style: 'width:60px',
      sortable: true,
      type: 'custom'
    },
    {
      name: 'mocNo',
      field: 'mocNo',
      label: '관리번호',
      align: 'center',
      style: 'width:110px',
      sortable: true
    },
    {
      name: 'mocDates',
      field: 'mocDates',
      label: '변경 작업 기간',
      align: 'center',
      style: 'width:170px',
      sortable: true
    },
    {
      name: 'initiativeUserName',
      field: 'initiativeUserName',
      label: '발의자',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:90px',
      sortable: true
    }
  ],
  data: []
})
const stepItems = ref([])
const listUrl = ref('')

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
  listUrl.value = selectConfig.sop.moc.change.list.url
  // code setting
  getStepItems('MOC_TEMP_STEP_CD').then((_result: any) => {
    const idx = _.findIndex(_result, { stepperMstCd: 'MT00000020' })
    _result[idx].stepperMstNm = _result[idx - 1].stepperMstNm + ' / ' + _result[idx].stepperMstNm
    _result = _.reject(_result, { stepperMstCd: 'MT00000015' })
    stepItems.value = _result
  })
  // list setting
  getList()
}
/******************************
 * TODO (목적): 임시변경관리 조회
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
 * TODO (목적): 남은 일 수 계산
 * @param (1): 대상 날짜
 * @return (반환): 남은 일 수
 *******************************/
function daysLeft(date: string) {
  return Math.ceil((new Date(date).valueOf() - new Date().valueOf()) / (1000 * 60 * 60 * 24))
}
/******************************
 * TODO (목적): 임시변경관리 링크 클릭
 * @param (1): 행 정보
 *******************************/
function linkClick(row: mocType) {
  if (!row) return
  openPopup(row)
}
/******************************
 * TODO (목적): 임시변경관리 팝업 표시
 * @param (1): 행 정보
 *******************************/
function openPopup(row: mocType) {
  popupOptions.value.title = '변경관리 상세'
  popupOptions.value.param = {
    sopMocId: row ? row.sopMocId : '',
    mocTypeCd: row ? row.mocTypeCd : 'MT00000005',
    mocStepCd: row ? row.mocStepCd : ''
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./mocDetail.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 임시변경관리 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
