<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-table
        ref="table"
        title="설비등급 변경이력"
        :columns="grid.columns"
        :data="equipData.ranks"
        gridHeight="570px"
        :hide-pagination="true"
        :isFullScreen="false"
        :columnSetting="false"
        :filtering="false"
        @rowClick="rowClick"
      />
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <q-form ref="editForm">
        <c-card title="설비등급 변경정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && (!grid.data || grid.data.length === 0)"
                label="등록"
                icon="add"
                @btnClicked="addRank"
              />
              <c-btn
                v-if="editable && revisionMode"
                label="개정"
                icon="restart_alt"
                @btnClicked="revisionRank"
              />
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="equipRank"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="saveRank"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                :required="true"
                :editable="editable && updateMode"
                codeGroupCd="MDM_EQUIP_GRADE_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="grade"
                label="위험등급"
                v-model:value="equipRank.grade"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-datepicker
                :required="true"
                :editable="editable && updateMode"
                label="등급변경일"
                name="gradeDate"
                v-model:value="equipRank.gradeDate"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :required="true"
                :editable="editable && updateMode"
                label="평가점수"
                type="number"
                name="estimationScore"
                v-model:value="equipRank.estimationScore"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-textarea
                :required="true"
                :editable="editable && updateMode"
                label="등급변경사유"
                name="changeReason"
                v-model:value="equipRank.changeReason"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-upload
                :attachInfo="attachInfo"
                :editable="editable && updateMode"
                label="설비중요도 등급평가표"
              />
            </div>
          </template>
        </c-card>
      </q-form>
    </div>
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
import { equipPopupParamType, equipType, equipRankType } from './equipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentGrade'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
interface propType {
  popupParam: equipPopupParamType
  equipData: equipType
  contentHeight: string
}
interface gridType {
  columns: tableColumnType
  data: Array<equipRankType>
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
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'EQUIPMENT_GRADE',
  taskKey: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'gradeDate',
      field: 'gradeDate',
      label: '등급변경일',
      align: 'center',
      sortable: false
    },
    {
      name: 'gradeName',
      field: 'gradeName',
      label: '설비등급',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const equipRank = ref<equipRankType>({
  plantCd: null,
  equipmentCd: '',
  recordNo: '',
  grade: null,
  estimationScore: '',
  gradeDate: '',
  changeReason: '',
  regUserId: '',
  chgUserId: ''
})
const listUrl = ref('')
const detailUrl = ref('')
const editable = ref(true)
const updateMode = ref(false)
const revisionMode = ref(false)
const isSave = ref(false)
const saveUrl = ref('')
const saveType = ref('POST')
const editForm = ref<any>(null)

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
  saveUrl.value = transactionConfig.mdm.equipment.rank.save.url
  listUrl.value = selectConfig.mdm.equipment.rank.list.url
  detailUrl.value = selectConfig.mdm.equipment.rank.get.url
  saveUrl.value = transactionConfig.mdm.equipment.rank.save.url
  // code setting
  attachInfo.value.taskKey = props.popupParam.equipmentCd
  // list setting
}
/******************************
 * TODO (목적): 설비 등급 조회 및 행 선택 표시 제거
 *******************************/
function getRankList() {
  getList()
  rowRemoveSelect()
}
/******************************
 * TODO (목적): 행 선택 표시 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
}
/******************************
 * TODO (목적): 설비 등급 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      plantCd: props.popupParam.plantCd,
      equipmentCd: props.popupParam.equipmentCd
    }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      props.equipData.ranks = _result.data
      reset()
      updateMode.value = false
    } else {
      reset()
    }
  })
}
/******************************
 * TODO (목적): 행 클릭 시 설비 등급 상세 조회
 * @param (1): 행 정보
 *******************************/
function rowClick(row: equipRankType) {
  updateMode.value = false
  $http({
    url: detailUrl.value,
    method: 'GET',
    params: {
      plantCd: row.plantCd,
      equipmentCd: row.equipmentCd,
      recordNo: row.recordNo
    }
  }).then((_result: any) => {
    _.extend(equipRank.value, _result.data)

    equipRank.value.editFlag = 'U'
    revisionMode.value = true
  })
}
/******************************
 * TODO (목적): 설비 등급 데이터 등록 (데이터가 없는 경우만 활성화)
 *******************************/
function addRank() {
  updateMode.value = true
  reset()
  equipRank.value.gradeDate = getToday()
}
/******************************
 * TODO (목적): 설비 등급 정보 초기화
 *******************************/
function reset() {
  rowRemoveSelect()
  equipRank.value = {
    editFlag: 'C',
    plantCd: props.popupParam.plantCd,
    equipmentCd: props.popupParam.equipmentCd,
    recordNo: '',
    grade: null,
    estimationScore: '',
    gradeDate: '',
    changeReason: '',
    regUserId: '',
    chgUserId: ''
  }
}
/******************************
 * TODO (목적): 설비 등급 개정 데이터 셋팅
 *******************************/
function revisionRank() {
  rowRemoveSelect()
  equipRank.value = {
    plantCd: props.popupParam.plantCd,
    equipmentCd: props.popupParam.equipmentCd,
    recordNo: '',
    grade: null,
    estimationScore: '',
    gradeDate: getToday(),
    changeReason: '',
    regUserId: user.value.userId,
    editFlag: 'R'
  }
  updateMode.value = true
}
/******************************
 * TODO (목적): 설비 등급 저장
 *******************************/
function saveRank() {
  editForm.value.validate().then((_result: boolean) => {
    // 중복체크
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          isSave.value = !isSave.value
          equipRank.value.regUserId = user.value.userId
          equipRank.value.chgUserId = user.value.userId
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 설비 등급 저장 후
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getRankList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
