<template>
  <div>
    <c-card class="cardClassDetailInfo" :noHeader="true">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="사업장" :value="props.equipData.plantName" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="설비유형" :value="props.equipData.equipmentTypeName" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="설비관리번호" :value="props.equipData.equipmentNo" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="설비명" :value="props.equipData.equipmentName" />
        </div>
      </template>
    </c-card>
    <c-table
      ref="table1"
      title="설비점검이력"
      gridHeight="300px"
      :columns="grid.columns"
      :data="equipData.checks"
      :pagePerRow="{ pageNumber: 5 }"
    >
      <template v-slot:customArea="{ props }">
        <template v-if="props.row['checkStatusCd']">
          <q-chip
            v-if="props.row.checkStatusCd === 'MCSC000020'"
            :color="setTagColor(props.row.checkStatusCd)"
            outline
            square
            class="full-size-chip maintenanceStatusCd-blinking"
            text-color="white"
            icon="alarm"
          >
            {{ setTagName(props.row.checkStatusCd) }}
          </q-chip>
          <q-chip
            v-else
            :color="setTagColor(props.row.checkStatusCd)"
            outline
            square
            class="full-size-chip"
            text-color="white"
          >
            {{ setTagName(props.row.checkStatusCd) }}
          </q-chip>
        </template>
      </template>
    </c-table>
    <c-table
      ref="table2"
      title="설비정비이력"
      gridHeight="300px"
      :columns="grid2.columns"
      :data="equipData.maintenances"
      :pagePerRow="{ pageNumber: 5 }"
    >
      <template v-slot:customArea="{ props }">
        <template v-if="props.row['maintenanceStatusCd']">
          <q-chip
            v-if="props.row.maintenanceStatusCd === 'MCSC000020'"
            :color="setTagColor(props.row.maintenanceStatusCd)"
            outline
            square
            class="full-size-chip maintenanceStatusCd-blinking"
            text-color="white"
            icon="alarm"
          >
            {{ setTagName(props.row.maintenanceStatusCd) }}
          </q-chip>
          <q-chip
            v-else
            :color="setTagColor(props.row.maintenanceStatusCd)"
            outline
            square
            class="full-size-chip"
            text-color="white"
          >
            {{ setTagName(props.row.maintenanceStatusCd) }}
          </q-chip>
        </template>
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
import { equipPopupParamType, equipType } from './equipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentInspect'
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
  popupParam: equipPopupParamType
  equipData: equipType
  isOld: boolean
  contentHeight: string
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
      equipmentCd: '',
      plantCd: '',
      psmFlag: ''
    }
  },
  equipData: () => {
    return {
      plantCd: null, // 사업장코드
      plantName: '', // 사업장
      equipmentTypeCd: null, // 설비유형 코드
      equipmentTypeName: '', // 설비유형명
      equipmentCd: '', // 설비코드
      equipmentNo: '', // 설비코드
      equipmentName: '', // 설비명
      mainProcessCd: '', // 주공정
      subProcessCd: '', // 부공정
      managementDepts: '', // 관리부서
      equipmentLocation: '', // 설비위치
      installDate: '', // 설치일자
      installVendor: '', // 설치업체
      opertationDate: '', // 가동일자
      checkPassNo: '', // 검사합격번호
      checkPassDate: '', // 합격일자
      discardFlag: 'N',
      discardDate: '', // 폐기일자
      psmFlag: 'N', // PSM 대상 여부
      psmTypeCd: null,
      amount: '', // 수량
      lawEquipmentFlag: 'N', // 법정설비 여부
      inspectionCycleCd: null, // 법정점검 주기
      selfCycleCd: null, // 자체점검 주기
      pmCycleCd: null, // 자체점검 주기
      pmFlag: 'N', // 예방정비 여부
      cmFlag: 'N', // 고장정비 여부
      predictiveFlag: 'N', // 예지정비 여부
      operFlag: 'N', // 운전정비 여부
      relatedLaws: '', // 관련법규
      recentInspectionDate: '', // 최근 점검일자
      outsourcingVendor: '', // 유지보수업체
      hazardousFlag: 'N',
      equipGradeCd: null,
      regUserId: '',
      chgUserId: '',
      checks: [],
      maintenances: [],
      specs: [],
      ranks: [],
      materials: [],
      mocs: [],
      licenses: []
    }
  },
  isOld: false,
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref({
  columns: [
    {
      name: 'checkStatusCd',
      field: 'checkStatusCd',
      label: '진행상태',
      style: 'width:120px',
      type: 'custom',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkScheduleDate',
      field: 'checkScheduleDate',
      label: '점검예정일',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkScheduleUserName',
      field: 'checkScheduleUserName',
      style: 'width:150px',
      label: '점검예정자',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkDeptName',
      field: 'checkDeptName',
      style: 'width:150px',
      label: '점검부서',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkDate',
      field: 'checkDate',
      style: 'width:150px',
      label: '점검완료일',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkResultName',
      field: 'checkResultName',
      style: 'width:120px',
      label: '점검결과',
      align: 'center',
      sortable: true
    },
    {
      name: 'equipmentCheckKindNm',
      field: 'equipmentCheckKindNm',
      label: '점검유형',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'inspectionCycleName',
      field: 'inspectionCycleName',
      label: '점검주기',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      align: 'left',
      sortable: true
    },
    {
      name: 'noPlanName',
      field: 'noPlanName',
      label: '계획/무계획',
      style: 'width:120px',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const grid2 = ref({
  columns: [
    {
      name: 'maintenanceStatusCd',
      field: 'maintenanceStatusCd',
      label: '진행상태',
      style: 'width:120px',
      align: 'center',
      sortable: true,
      type: 'custom'
    },
    {
      name: 'maintenanceDueDate',
      field: 'maintenanceDueDate',
      label: '정비예정일',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'maintenanceDueUserName',
      field: 'maintenanceDueUserName',
      style: 'width:150px',
      label: '정비예정자',
      align: 'center',
      sortable: true
    },
    {
      name: 'memDeptEntrantUserName',
      field: 'memDeptEntrantUserName',
      style: 'width:150px',
      label: '정비부서 입회자',
      align: 'center',
      sortable: true
    },
    {
      name: 'maintenanceUserName',
      field: 'maintenanceUserName',
      style: 'width:150px',
      label: '실제정비자',
      align: 'center',
      sortable: true
    },
    {
      name: 'maintenanceDate',
      field: 'maintenanceDate',
      label: '정비완료일',
      style: 'width:150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'inspResultAfterMemName',
      field: 'inspResultAfterMemName',
      label: '정비결과',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'equipmentCheckTypeName',
      field: 'equipmentCheckTypeName',
      label: '정비유형',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'pmCycleName',
      field: 'pmCycleName',
      label: '정비주기',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      align: 'left',
      sortable: true
    },
    {
      name: 'noPlanName',
      field: 'noPlanName',
      label: '계획/무계획',
      style: 'width:120px',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const checkNoPlanItems = ref<Array<codeMasterType>>([]) // 점검진행상태
const colorItems = ref<Array<stepMasterType>>([])
const editable = ref(true)

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
  // code setting
  checkNoPlanItems.value = [
    { code: 'Y', codeName: $language('무계획') },
    { code: 'N', codeName: $language('계획') }
  ]
  colorItems.value = [
    {
      stepperMstCd: 'MCSC000005',
      stepperMstNm: $language('계획수립'),
      colorClass: 'blue'
    },
    {
      stepperMstCd: 'MCSC000010',
      stepperMstNm: $language('점검중'),
      colorClass: 'orange'
    },
    {
      stepperMstCd: 'MCSC000015',
      stepperMstNm: $language('점검완료'),
      colorClass: 'green'
    },
    { stepperMstCd: 'MCSC000020', stepperMstNm: $language('지연'), colorClass: 'red' }
  ]
  // list setting
}
/******************************
 * TODO (목적): 테이블에 표시되는 tag 색상 class 셋팅
 * @param (1): 데이터 정보
 * @return (반환): tag 색상 class
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
 * TODO (목적): 코드에 따른 명칭 반환
 * @param (1): 데이터 정보
 * @return (반환): 명칭
 *******************************/
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
