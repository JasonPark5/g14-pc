<template>
  <div>
    <c-card title="대상자 정보" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            label="상위부서 / 부서"
            :editable="false"
            name="teamLabel"
            v-model:value="teamLabel"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            label="직종 / 사번 / 성명"
            :editable="false"
            name="nameLabel"
            v-model:value="nameLabel"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            label="생년월일 / 연령 / 근속년수"
            :editable="false"
            name="birthLabel"
            v-model:value="birthLabel"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            label="병원 / 검진종류 / 검진일"
            :editable="false"
            name="hospitalLabel"
            v-model:value="hospitalLabel"
          />
        </div>
      </template>
    </c-card>
    <c-card title="검진결과 상세" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div
          v-for="(data, idx) in resultData.examines"
          :key="idx"
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
        >
          <c-textarea
            v-if="data.examineResult!.length > 20"
            :label="data.examineName"
            :editable="false"
            :name="`examine_${idx}`"
            v-model:value="data.examineResult"
            autogrow
          />
          <c-text
            v-else
            :label="data.examineName"
            :editable="false"
            :name="`examine_${idx}`"
            v-model:value="data.examineResult"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="table"
      title="소견 상세"
      class="q-pb-lg"
      :columns="grid.columns"
      :data="resultData.opinions"
      gridHeightAuto
      :columnSetting="false"
      :usePaging="false"
      :isExcelDown="false"
      :isFullScreen="false"
      :customTrClass="
        (_props: any) =>
          _props.row.healthType.includes('D') || _props.row.healthType.includes('C')
            ? 'bg-orange-1'
            : ''
      "
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <q-icon name="info" color="primary" size="sm" class="q-mr-sm">
            <q-menu style="padding: 10px; overflow-y: auto; max-height: 90vh">
              <c-table
                dense
                hideBottom
                :usePaging="false"
                :isExcelDown="false"
                :columnSetting="false"
                :isFullScreen="false"
                gridHeightAuto
                title="건강관리 구분"
                :columns="typeColumns"
                :data="typeRows"
              />
            </q-menu>
          </q-icon>
        </q-btn-group>
      </template>
    </c-table>
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
import { resultType } from './checkupType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'checkUpResultDetail'
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
interface propType {
  popupParam: {
    heaCheckupResultId: stringNull
  }
  contentHeight: string | number | null
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      heaCheckupResultId: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const resultData = ref<resultType>({
  heaCheckupResultId: '',
  jobClassName: '',
  checkupTypeName: '',
  age: 0,
  workPeriod: 0,
  upDeptName: '',
  deptName: '',
  userName: '',
  empNo: '',
  checkupDate: '',
  birthDate: '',
  hospitalName: '',
  examines: [],
  opinions: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'laborCd',
      field: 'laborCd',
      label: '노동부일반1차판정',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'laborOpinion',
      field: 'laborOpinion',
      label: '노동부일반1차소견',
      align: 'left',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'industrialCd',
      field: 'industrialCd',
      label: '공단일반1차판정',
      align: 'center',
      style: 'width: 60px',
      sortable: false
    },
    {
      name: 'industrialOpinion',
      field: 'industrialOpinion',
      label: '공단일반1차소견',
      align: 'left',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'industrialMeasure',
      field: 'industrialMeasure',
      label: '일반1차조치',
      align: 'left',
      style: 'width: 220px',
      sortable: false
    },
    {
      name: 'hazardName',
      field: 'hazardName',
      label: '취급물질',
      align: 'center',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'healthType',
      field: 'healthType',
      label: '판정',
      align: 'center',
      style: 'width:50px',
      sortable: false
    },
    {
      name: 'checkupOpinion',
      field: 'checkupOpinion',
      label: '소견',
      align: 'left',
      style: 'width:160px',
      sortable: false
    },
    {
      name: 'afterManage',
      field: 'afterManage',
      label: '조치',
      align: 'left',
      style: 'width:340px',
      sortable: false
    },
    {
      name: 'suitableFlag',
      field: 'suitableFlag',
      label: '업무적합성',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'suitableType',
      field: 'suitableType',
      label: '사후관리 구분',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'afterCare',
      field: 'afterCare',
      label: '사후관리',
      align: 'left',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      // style: 'width:160px',
      sortable: false
    }
  ],
  data: []
})
const typeColumns = ref([
  {
    name: 'code',
    field: 'code',
    label: '구분',
    align: 'center',
    style: 'width: 60px'
  },
  {
    name: 'codeName',
    field: 'codeName',
    label: '설명',
    align: 'left',
    style: 'width: 560px'
  }
])
const typeRows = ref([
  {
    code: 'A',
    codeName: '건강관리상 사후관리가 필요 없는 자 (건강자)'
  },
  {
    code: 'C1',
    codeName: '직업성 질병으로 진전될 우려가 있어 추적조사 등 관찰이 필요한 자 (직업병 요관찰자)'
  },
  {
    code: 'C2',
    codeName: '일반 질병으로 진전될 우려가 있어 추적조사 등 관찰이 필요한 자 (일반 질병 요관찰자)'
  },
  {
    code: 'CN',
    codeName: '질병으로 진전될 우려가 있어 야간작업시 추적관찰이 필요한 근로자 (요관찰자)'
  },
  {
    code: 'D1',
    codeName: '직업성 질병의 소견을 보여 사후관리가 필요한 자 (직업병 유소견자)'
  },
  {
    code: 'D2',
    codeName: '일반 질병의 소견을 보여 사후관리가 필요한 자 (일반 질병 유소견자)'
  },
  {
    code: 'DN',
    codeName: '질병의 소견을 보여 야간작업시 사후관리가 필요한 근로자 (유소견자)'
  },
  {
    code: 'R',
    codeName:
      '건강진단 1차 검사결가 건강수준의 평가가 곤란하거나 질병이 의심되는 근로자 (2차건강진단 대상자)'
  }
])
const editable = ref(false)
const getUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const teamLabel = computed(
  () => (resultData.value.upDeptName || '') + ' / ' + (resultData.value.deptName || '')
)
const nameLabel = computed(
  () =>
    (resultData.value.jobClassName || '') +
    ' / ' +
    (resultData.value.empNo || '') +
    ' / ' +
    (resultData.value.userName || '')
)
const hospitalLabel = computed(
  () =>
    (resultData.value.hospitalName || '') +
    ' / ' +
    (resultData.value.checkupTypeName || '') +
    ' / ' +
    (resultData.value.checkupDate || '')
)
const birthLabel = computed(
  () =>
    (resultData.value.birthDate || '') +
    ' / ' +
    (resultData.value.age || '') +
    ' / ' +
    (resultData.value.workPeriod || '')
)
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
  getUrl.value = selectConfig.hea.checkup.result.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 해당 플랜에서의 검진업로드 결과 조회
 *******************************/
function getDetail() {
  if (props.popupParam.heaCheckupResultId) {
    $http({
      url: getUrl.value,
      method: 'GET',
      params: { heaCheckupResultId: props.popupParam.heaCheckupResultId }
    }).then((_result: any) => {
      resultData.value = _result.data
    })
  }
}
</script>
