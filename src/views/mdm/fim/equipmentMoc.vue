<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="관련 MOC 목록"
        :columns="gridMoc.columns"
        :data="equipData.mocs"
        :gridHeight="gridHeight"
        :isFullScreen="false"
        :columnSetting="false"
        :filtering="false"
        @linkClick="openPopup"
      />
    </div>
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
import { equipMocType, equipPopupParamType, equipType } from './equipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentMoc'
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
  contentHeight: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<equipMocType>
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
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const gridMoc = ref<gridType>({
  columns: [
    {
      name: 'initiativeDt',
      field: 'initiativeDt',
      label: '발의일',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'mocTitle',
      field: 'mocTitle',
      label: '제목',
      align: 'left',
      sortable: true,
      style: 'width:280px',
      type: 'link'
    },
    {
      name: 'mocStepName',
      field: 'mocStepName',
      label: '진행단계',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'mocTypeName',
      field: 'mocTypeName',
      label: '변경구분',
      align: 'center',
      style: 'width:70px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const popupOptions = ref<popupParamType>({
  target: null,
  isFull: true,
  title: '',
  visible: false,
  width: '50%',
  param: {},
  closeCallback: () => {}
})

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 180
      : 500
  if (height < 300) {
    height = 300
  }
  return String(height) + 'px'
})

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
  listUrl.value = selectConfig.sop.moc.relationEquip.list.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 관련 변경관리 조회
 *******************************/
function getList() {
  if (props.popupParam.equipmentCd) {
    $http({
      url: $format(listUrl.value, props.popupParam.equipmentCd),
      method: 'GET'
    }).then((_result: any) => {
      props.equipData.mocs = _result.data
    })
  }
}
/******************************
 * TODO (목적): 링크 클릭 시 변경관리 상세 팝업 표시
 * @param (1): 행 정보
 *******************************/
function openPopup(row: equipMocType) {
  popupOptions.value.title = '변경관리 상세'
  popupOptions.value.param = {
    sopMocId: row ? row.sopMocId : '',
    mocTypeCd: row ? row.mocTypeCd : 'MT00000001',
    mocStepCd: row ? row.mocStepCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/moc/mocDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 변경관리 상세 팝업 닫기
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
