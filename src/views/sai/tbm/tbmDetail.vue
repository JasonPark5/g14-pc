<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="tbmData"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveTbm"
                  @btnCallback="saveCallback"
                />
                <!-- <c-btn
                  v-show="editable&&!disabled&&isOld"
                  :url="updateUrl"
                  :isSubmit="isComplete"
                  :param="tbmData"
                  mappingType="PUT"
                  label="완료"
                  icon="check"
                  @beforeAction="resultComplete"
                  @btnCallback="saveCallback"
                /> -->
                <c-btn
                  v-show="editable && isOld && !disabled"
                  label="삭제"
                  :editable="editable"
                  icon="delete_forever"
                  @btnClicked="remove"
                />
                <c-btn
                  v-show="editable && !isOld"
                  label="타 TBM 불러오기"
                  icon="save_alt"
                  @btnClicked="copyTbm"
                />
                <c-btn v-show="tbmData.tbmId" label="출력" icon="print" @btnClicked="printTbm" />
                <c-qr-btn
                  v-if="editable && isOld"
                  :mobileUrl="'/sai/tbm/tbm?tbmId=' + tbmData.tbmId"
                  text-color="white"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  :editable="editable"
                  :disabled="disabled"
                  type="edit"
                  name="plantCd"
                  v-model:value="tbmData.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-task-target
                  :disabled="disabled"
                  :customPopupParam="{ targetKey: 'process' }"
                  label="공정"
                  name="processCd"
                  v-model:value="tbmData.processCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-task-target
                  :disabled="disabled"
                  :customPopupParam="{ targetKey: 'vendor' }"
                  label="업체"
                  name="vendorCd"
                  v-model:value="tbmData.vendorCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  label="TBM번호"
                  name="tbmNo"
                  v-model:value="tbmData.tbmNo"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="editable"
                  :disabled="disabled"
                  label="TBM일"
                  type="date"
                  name="tbmDate"
                  v-model:value="tbmData.tbmDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 work-item">
                <c-datepicker
                  :disabled="disabled"
                  :editable="editable"
                  :range="true"
                  :minuteStep="10"
                  type="time"
                  label="TBM시간"
                  name="workTime"
                  v-model:value="workTime"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  required
                  :editable="editable"
                  :disabled="disabled"
                  label="TBM명"
                  name="tbmName"
                  v-model:value="tbmData.tbmName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="작업"
                  name="workName"
                  v-model:value="tbmData.workName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-task-target
                  :customPopupParam="{ targetKey: 'workPermit' }"
                  label="작업허가서"
                  name="sopWorkPermitId"
                  v-model:value="tbmData.sopWorkPermitId"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-field
                  :editable="editable"
                  :disabled="disabled"
                  type="dept_spot_user"
                  label="TBM리더"
                  name="tbmLeaderId"
                  v-model:value="tbmData.tbmLeaderId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="TBM장소"
                  name="tbmLocation"
                  v-model:value="tbmData.tbmLocation"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="작업내용"
                  name="tbmContents"
                  v-model:value="tbmData.tbmContents"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-task-target
                  :disabled="disabled"
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'construction' }"
                  label="관련공사"
                  name="sopConstructionId"
                  v-model:value="tbmData.sopConstructionId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                <c-checkbox
                  :disabled="disabled"
                  :editable="editable"
                  :isArray="false"
                  codeGroupCd="TBM_PRE_INSPECTION_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="사전점검"
                  name="preInspections"
                  v-model:value="tbmData.preInspections"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  label="작업 전 일일 안전점검 시행 결과"
                  :rows="2"
                  name="preInspectionResult"
                  v-model:value="tbmData.preInspectionResult"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-textarea
                  :editable="editable"
                  :disabled="disabled"
                  label="작업 후 종료 미팅 (중점대책의 실효성)"
                  :rows="2"
                  name="tbmResult"
                  v-model:value="tbmData.tbmResult"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
          <c-table
            ref="riskTable"
            title="위험요인 목록"
            :columns="riskGrid.columns"
            :gridHeight="riskGrid.height"
            :data="tbmData.tbmRiskList"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :isExcelDown="false"
            noDataLabel="위험요인을 추가하세요."
            :hideBottom="true"
            :editable="editable && !disabled"
            rowKey="tbmRiskId"
            selection="multiple"
            @table-data-change="tableDataChange"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="3단계판단법"
                  icon="add"
                  @btnClicked="add3rdRisk"
                />
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="4M"
                  icon="add"
                  @btnClicked="add4MRisk"
                />
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="JRA"
                  icon="add"
                  @btnClicked="addJRARisk"
                />
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="직접추가"
                  icon="add"
                  @btnClicked="addDirectRisk"
                />
                <c-btn
                  v-if="editable && !disabled && tbmData.tbmRiskList!.length > 0"
                  :showLoading="false"
                  label="제외"
                  icon="remove"
                  @btnClicked="removeRisk"
                />
              </q-btn-group>
            </template>
            <template v-slot:customArea="{ props, col }">
              <template v-if="col.name === 'tbmRisk'">
                <c-text-column
                  v-if="props.row['tbmRiskType'] === '직접추가'"
                  :editable="editable"
                  :props="props"
                  :col="col"
                  :disabled="disabled"
                  v-model:value="props.row[col.name]"
                />
                <span v-else>
                  {{ props.row[col.name] }}
                </span>
              </template>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
          <c-table
            ref="equipTable"
            title="관련 유해위험기계기구 목록"
            :columns="gridEquip.columns"
            :gridHeight="riskGrid.height"
            :data="tbmData.tbmHazardEquipModelList"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :isExcelDown="false"
            noDataLabel="잠금 설비를 추가하세요."
            :hideBottom="true"
            :editable="editable && !disabled"
            selection="multiple"
            rowKey="tbmHazardEquipId"
            @linkClick="linkClick"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  label="추가"
                  icon="add"
                  @btnClicked="addEquip"
                />
                <c-btn
                  v-if="
                    editable &&
                    !disabled &&
                    tbmData.tbmHazardEquipModelList &&
                    tbmData.tbmHazardEquipModelList.length > 0
                  "
                  label="제외"
                  icon="remove"
                  @btnClicked="removeEquip"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"
          style="margin-bottom: 20px !important"
        >
          <c-table
            ref="attendeeTable"
            title="참석자 및 건강상태 목록"
            :columns="attendeeGrid.columns"
            :gridHeight="attendeeGrid.height"
            :data="tbmData.tbmAttendeeList"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :isExcelDown="false"
            noDataLabel="참석자가 없습니다."
            :hideBottom="true"
            :editable="editable && !disabled"
            selection="multiple"
            rowKey="tbmAttendeeId"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="추가(업체 근무자)"
                  icon="add"
                  @btnClicked="addAttendeePartner"
                />
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="추가(현업)"
                  icon="add"
                  @btnClicked="addAttendee"
                />
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="직접추가"
                  icon="add"
                  @btnClicked="addAttendeeDirect"
                />
                <c-btn
                  v-if="editable && !disabled && tbmData.tbmAttendeeList!.length > 0"
                  :showLoading="false"
                  label="제외"
                  icon="remove"
                  @btnClicked="removeAttendee"
                />
              </q-btn-group>
            </template>
            <template v-slot:customArea="{ props, col }">
              <template
                v-if="
                  col.name === 'click' &&
                  (props.row.attendeeType === '내부' || props.row.attendeeType === '작업허가서')
                "
              >
                <q-btn round unelevated size="10px" color="amber" icon="mode">
                  <q-popup-proxy
                    :ref="
                      (el: any) => {
                        proxies[props.rowIndex] = el
                      }
                    "
                    :breakpoint="400"
                  >
                    <component
                      :is="col.component"
                      :outFlag="true"
                      :popupParam="props.row"
                      :data="tbmData"
                      :rowIndex="props.rowIndex"
                      @signCallback2="signCallback2"
                    />
                  </q-popup-proxy>
                </q-btn>
              </template>
              <template v-if="col.name === 'tbmAttendeeDept'">
                <c-text-column
                  v-if="props.row.attendeeType === '직접추가'"
                  :editable="editable"
                  :props="props"
                  :col="col"
                  :disabled="disabled"
                  v-model:value="props.row.tbmAttendeeDept"
                />
                <span v-else>
                  {{ props.row[col.name] }}
                </span>
              </template>
              <template v-if="col.name === 'tbmAttendeeJob'">
                <c-text-column
                  v-if="props.row.attendeeType === '직접추가'"
                  :editable="editable"
                  :props="props"
                  :col="col"
                  :disabled="disabled"
                  v-model:value="props.row.tbmAttendeeJob"
                />
                <span v-else>
                  {{ props.row[col.name] }}
                </span>
              </template>
              <template v-if="col.name === 'tbmAttendeeName'">
                <c-text-column
                  v-if="props.row.attendeeType === '직접추가'"
                  :editable="editable"
                  :props="props"
                  :col="col"
                  :disabled="disabled"
                  v-model:value="props.row.tbmAttendeeName"
                />
                <span v-else>
                  {{ props.row[col.name] }}
                </span>
              </template>
            </template>
          </c-table>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 tbm">
          <c-upload
            style="margin-top: -5px !important"
            :fullWidth="true"
            :attachInfo="attachInfo"
            :editable="editable && !disabled"
            label="교육자료, 참석자서명, 증빙사진"
          />
        </div>
      </div>
    </q-form>
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
import { tbmType, tbmAttendeeType, tbmPopupParamType } from './tbm'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'tbmDetail'
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
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: tbmPopupParamType
  contentHeight: stringNull
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
      tbmId: ''
    }
  },
  contentHeight: ''
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const proxies = ref<any>([])
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const tbmData = ref<tbmType>({
  tbmId: '',
  tbmNo: '',
  plantCd: '',
  permitDate: '', // 참조 작업허가서 날짜
  workName: '', // 작업명
  tbmLeaderDept: '', // TBM리더 부서or(외부업체인 경우)회사
  tbmLeaderId: '', // TBM리더 이름
  tbmLeaderSign: '', // TBM리더 전자서명
  tbmName: '', // TBM 타이틀
  tbmDate: '', // TBM 진행 날짜
  tbmStartTime: '', // 시작시간
  tbmEndTime: '', // 종료시간
  tbmLocation: '', // 장소
  tbmContents: '', // 작업내용
  preInspectionResult: '', // 사전점검결과
  tbmResult: '', // TBM 결과 (중점대책의 실효성)
  tbmCompleteFlag: 'N', // TBM 진행단계
  processCd: '', // 공정코드
  vendorCd: '', // 협력사 코드
  permitNo: '', // 참조 작업허가서 번호
  sopWorkPermitId: '',
  sopConstructionId: '',
  preInspections: '', // 사전점검에서 체크한 항목들. XXX,XXX,XXX 형식

  regUserId: '', // 작성자 ID
  regUserName: '',
  regUserDeptName: '',
  regDtStringTime: '',
  regDt: '',
  chgUserId: '',
  chgUserName: '',
  chgUserDeptName: '',
  chgDtStringTime: '',
  chgDt: '',
  tbmAttendeeList: [],
  deleteTbmAttendeeList: [],
  tbmRiskList: [],
  deleteTbmRiskList: [],
  tbmHazardEquipModelList: [],
  deleteTbmHazardEquipModelList: []
})
const workTime = ref<any>([])
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'TBM_EDUCATION',
  taskKey: '',
  beforeTaskKey: ''
})
const riskGrid = ref<any>({
  columns: [
    {
      required: true,
      name: 'tbmRisk',
      field: 'tbmRisk',
      label: '위험요인',
      align: 'left',
      style: 'width:40%',
      type: 'custom',
      sortable: false
    },
    {
      name: 'tbmImprove',
      field: 'tbmImprove',
      label: '안전대책',
      type: 'text',
      style: 'width:40%',
      align: 'left',
      sortable: false
    },
    {
      name: 'tbmRiskType',
      field: 'tbmRiskType',
      label: '구분',
      style: 'width:10%',
      align: 'center',
      sortable: false
    },
    {
      name: 'tbmRiskKeyFlag',
      field: 'tbmRiskKeyFlag',
      label: '중점요인',
      type: 'check',
      true: 'Y',
      false: 'N',
      style: 'width:40px',
      align: 'center',
      sortable: false
    }
  ],
  height: '300px',
  data: []
})
const attendeeGrid = ref<any>({
  columns: [
    {
      required: true,
      name: 'tbmAttendeeDept',
      field: 'tbmAttendeeDept',
      label: '소속',
      style: 'width:120px',
      align: 'center',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'tbmAttendeeJob',
      field: 'tbmAttendeeJob',
      label: '직책',
      style: 'width:90px',
      align: 'center',
      sortable: false,
      type: 'custom'
    },
    {
      required: true,
      name: 'tbmAttendeeName',
      field: 'tbmAttendeeName',
      label: '참석자',
      style: 'width:120px',
      align: 'center',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'mentalFlag',
      field: 'mentalFlag',
      label: '정신적 피로',
      style: 'width:50px',
      align: 'center',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    },
    {
      name: 'phychologicalFlag',
      field: 'phychologicalFlag',
      label: '심리적 피로',
      style: 'width:50px',
      align: 'center',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    },
    {
      name: 'physicalFlag',
      field: 'physicalFlag',
      label: '육체적 피로',
      style: 'width:50px',
      align: 'center',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    },
    {
      name: 'physicalDefectFlag',
      field: 'physicalDefectFlag',
      label: '신체적 결함',
      style: 'width:50px',
      align: 'center',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    },
    {
      name: 'healthStatusCd',
      field: 'healthStatusCd',
      label: '건강상태',
      type: 'select',
      setHeader: true,
      style: 'width:90px',
      align: 'center',
      codeGroupCd: 'TBM_HEALTH_STATUS_CD',
      sortable: false
    },
    {
      name: 'click',
      field: 'click',
      label: '서명',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false,
      visible: true,
      component: shallowRef(defineAsyncComponent(() => import(`./signaturePop.vue`)))
    },
    {
      name: 'attendeeType',
      field: 'attendeeType',
      label: '구분',
      style: 'width:90px',
      align: 'center',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      type: 'textarea',
      // style: 'width:120px',
      align: 'left',
      sortable: false
    }
  ],
  height: '300px',
  data: []
})
const gridEquip = ref<any>({
  columns: [],
  height: '300px',
  data: []
})
const getUrl = ref('')
const saveUrl = ref('')
const insertUrl = ref('')
const deleteUrl = ref('')
const updateUrl = ref('')
const printUrl = ref('')
const getWorkPermitUrl = ref('')
const saveType = ref('POST')
const isSave = ref(false)
// const isComplete = ref(false)
const equipTable = ref<any>(null)
const riskTable = ref<any>(null)
const attendeeTable = ref<any>(null)
const editForm = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return tbmData.value.tbmCompleteFlag === 'Y'
})
const isOld = computed(() => {
  return Boolean(props.popupParam.tbmId)
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
  getWorkPermitUrl.value = selectConfig.sop.swp.workPermit.get.url
  getUrl.value = selectConfig.sai.tbm.get.url
  saveUrl.value = transactionConfig.sai.tbm.insert.url
  insertUrl.value = transactionConfig.sai.tbm.insert.url
  updateUrl.value = transactionConfig.sai.tbm.update.url
  deleteUrl.value = transactionConfig.sai.tbm.delete.url
  printUrl.value = selectConfig.sai.tbm.print.url
  // code setting
  // list setting
  getDetail()
  setHeader()
}
/******************************
 * TODO (목적): TBM 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.tbmId) {
    $http({
      url: $format(getUrl.value, props.popupParam.tbmId),
      method: 'GET'
    }).then((_result: any) => {
      tbmData.value = _result.data
      tbmData.value.tbmRiskList = tbmData.value.tbmRiskList!.map((item) => ({
        ...item,
        tbmRiskType:
          item.tbmRiskType == 'SWP'
            ? $language('작업허가서')
            : item.tbmRiskType == 'DIRECT'
              ? $language('직접추가')
              : item.tbmRiskType == '3STEP'
                ? $language('3단계판단법')
                : item.tbmRiskType
      }))
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
      attachInfo.value.taskKey = props.popupParam.tbmId
      workTime.value = [_result.data.tbmStartTime, _result.data.tbmEndTime]
      tbmData.value.tbmLeaderId = _result.data.tbmLeaderId
    })
  } else {
    tbmData.value.tbmDate = getToday()
    workTime.value = ['08:00', '17:00']
  }
}
/******************************
 * TODO (목적): 기계기구 테이블 헤더 세팅
 *******************************/
function setHeader() {
  gridEquip.value.columns = [
    {
      name: 'machineryName',
      field: 'machineryName',
      label: '기계명',
      // style: 'width:200px',
      align: 'left',
      type: 'link',
      sortable: true
    },
    {
      name: 'inspectionSubjectFlag',
      field: 'inspectionSubjectFlag',
      label: '검사대상',
      style: 'width:60px',
      type: 'tag',
      colorItems: [
        { stepperMstCd: 'N', stepperMstNm: $language('비대상'), colorClass: 'orange' },
        { stepperMstCd: 'Y', stepperMstNm: $language('대상'), colorClass: 'green' },
        { stepperMstCd: 'A', stepperMstNm: $language('지연'), colorClass: 'red' }
      ],
      align: 'center',
      sortable: true
    },
    {
      name: 'itemNo',
      field: 'itemNo',
      label: '설비번호',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'machineryClassificationName',
      field: 'machineryClassificationName',
      label: '기계분류',
      style: 'width:120px',
      align: 'left',
      sortable: true
    },
    {
      name: 'resultCd',
      field: 'resultCd',
      label: '검사결과',
      style: 'width:60px',
      type: 'tag',
      colorItems: [
        { stepperMstCd: 'HRC000005', stepperMstNm: $language('합격'), colorClass: 'blue' },
        { stepperMstCd: 'HRC000010', stepperMstNm: $language('불합격'), colorClass: 'red' }
      ],
      align: 'center',
      sortable: true
    },
    {
      name: 'gradeName',
      field: 'gradeName',
      label: '등급',
      align: 'center',
      style: 'width:60px',
      sortable: true
    }
  ]
}
/******************************
 * TODO (목적): TBM 저장
 *******************************/
function saveTbm() {
  if (tbmData.value.tbmId) {
    tbmData.value.chgUserId = user.value.userId
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  } else {
    tbmData.value.regUserId = user.value.userId
    saveUrl.value = insertUrl.value
    saveType.value = 'POST'
  }
  tbmData.value.tbmStartTime = workTime.value[0]
  tbmData.value.tbmEndTime = workTime.value[1]

  editForm.value.validate().then((_result: boolean) => {
    if (
      _result &&
      validTable(riskGrid.value.columns, tbmData.value.tbmRiskList) &&
      validTable(attendeeGrid.value.columns, tbmData.value.tbmAttendeeList)
    ) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
/******************************
 * TODO (목적): TBM 저장 콜백
 *******************************/
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.tbmId = _result.data
  if (saveType.value === 'POST') {
    attachInfo.value.isSubmit = uid()
  }
  attachInfo.value.taskKey = _result.data
  getDetail()
}
/******************************
 * TODO (목적): TBM 완료
 *******************************/
// function resultComplete() {
//   editForm.value.validate().then((_result: boolean) => {
//     if (_result) {
//       if (validTable(riskGrid.value.columns, tbmData.value.tbmRiskList)) {
//         message.confirm({
//           title: '확인',
//           message: '완료하시겠습니까? (저장과 함께 처리됩니다.)',
//           type: 'warning', // success / info / warning / error
//           confirmCallback: () => {
//             tbmData.value.tbmCompleteFlag = 'Y'
//             tbmData.value.chgUserId = user.value.userId
//             isComplete.value = !isComplete.value
//           },
//           cancelCallback: () => {} // 취소 callback 함수
//         })
//       }
//     } else {
//       message.validError()
//     }
//   })
// }
/******************************
 * TODO (목적): TBM 위험요인 직접 추가
 *******************************/
function addDirectRisk() {
  tbmData.value.tbmRiskList!.push({
    tbmId: tbmData.value.tbmId,
    tbmRiskId: uid(),
    tbmRiskProcess: '',
    tbmRisk: '',
    tbmImprove: '',
    tbmRiskKeyFlag: 'N',
    tbmRiskType: '직접추가',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): TBM 위험요인 제외
 *******************************/
function removeRisk() {
  const selectData = riskTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!tbmData.value.deleteTbmRiskList) {
        tbmData.value.deleteTbmRiskList = []
      }
      if (
        _.findIndex(tbmData.value.deleteTbmRiskList, {
          tbmRiskId: item.tbmRiskId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        tbmData.value.deleteTbmRiskList.push(item)
      }
      tbmData.value.tbmRiskList = _.reject(tbmData.value.tbmRiskList, item)
    })
  }
}
/******************************
 * TODO (목적): TBM 위험요인 3단계 판단법 추가
 *******************************/
function add3rdRisk() {
  popupOptions.value.title = '3단계 판단법 위험등록부 검색'
  popupOptions.value.param = {
    type: 'multiple',
    plantCd: tbmData.value.plantCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/ram/riskRegister/3rdRamListPop.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = close3rdPopup
}
/******************************
 * TODO (목적): TBM 위험요인 3단계 판단법 팝업 닫기 콜백
 *******************************/
function close3rdPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      tbmData.value.tbmRiskList!.push({
        tbmId: tbmData.value.tbmId,
        tbmRiskId: uid(),
        tbmRiskProcess: _item.processName,
        tbmRisk: _item.riskHazardQuestionName,
        tbmImprove: _item.improvementMeasures,
        ramAfterRiskThirdStandardId: _item.ramAfterRiskLevelCd,
        tbmRiskKeyFlag: 'N',
        tbmRiskType: '3단계판단법',
        regUserId: user.value.userId,
        editFlag: 'C'
      })
    })
  }
}
/******************************
 * TODO (목적): TBM 위험요인 4M 추가
 *******************************/
function add4MRisk() {
  popupOptions.value.title = '4M 위험등록부 검색'
  popupOptions.value.param = {
    type: 'multiple',
    plantCd: tbmData.value.plantCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/ram/riskRegister/fmAssessRiskRegisterPop.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAssessRiskRegisterPopPopup1
}
/******************************
 * TODO (목적): TBM 위험요인 4M 팝업 닫기 콜백
 *******************************/
function closeAssessRiskRegisterPopPopup1(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      tbmData.value.tbmRiskList!.splice(0, 0, {
        tbmId: tbmData.value.tbmId,
        tbmRiskId: uid(),
        tbmJobStep: item.jobName, // 작업단계가 없기 때문에 작업으로 <<
        tbmRisk: item.riskHazardName,
        tbmImprove: item.addingRiskManagementActivities, // 안전대책은 추가 리스트관리 계획
        tbmRiskKeyFlag: 'N',
        tbmRiskType: '4M',
        regUserId: user.value.userId,
        editFlag: 'C'
      })
    })
  }
}
/******************************
 * TODO (목적): TBM 위험요인 JRA 추가
 *******************************/
function addJRARisk() {
  popupOptions.value.title = 'JRA 위험등록부 검색'
  popupOptions.value.param = {
    type: 'multiple',
    plantCd: tbmData.value.plantCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/ram/riskRegister/jraAssessRiskRegisterPop.vue`))
  )
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeAssessRiskRegisterPopPopup2
}
/******************************
 * TODO (목적): TBM 위험요인 JRA 팝업 닫기 콜백
 *******************************/
function closeAssessRiskRegisterPopPopup2(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      tbmData.value.tbmRiskList!.splice(0, 0, {
        tbmId: tbmData.value.tbmId,
        tbmRiskId: uid(),
        tbmJobStep: item.jobStepName,
        tbmRisk: item.riskHazardName,
        tbmImprove: item.currentSafetyMeasures, // 안전대책은 현재안전조치
        tbmRiskKeyFlag: 'N',
        tbmRiskType: 'JRA',
        regUserId: user.value.userId,
        editFlag: 'C'
      })
    })
  }
}
/******************************
 * TODO (목적): TBM 업체 근무자 추가
 *******************************/
function addAttendeePartner() {
  popupOptions.value = getPopupOptions('vendorUser', popupOptions.value, closeAddPartner, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: {
      plantCd: tbmData.value.plantCd,
      vendorCd: tbmData.value.vendorCd // 수급업체코드
    }
  })
}
/******************************
 * TODO (목적): TBM 참석자 팝업 닫기 콜백
 *******************************/
function closeAddPartner(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(tbmData.value.tbmAttendeeList, {
        tbmAttendeeUserId: _item.userId
      })
      if (index === -1) {
        tbmData.value.tbmAttendeeList!.push({
          tbmId: props.popupParam.tbmId,
          tbmAttendeeId: uid(),
          tbmAttendeeDept: '(업체) ' + _item.vendorName, // 소속명
          vendorCd: _item.vendorCd,
          tbmAttendeeUserId: '',
          tbmAttendeeName: _item.personName,
          tbmAttendeeJob: _item.jobName,
          healthStatusCd: 'THS0000001',
          mentalFlag: 'N',
          phychologicalFlag: 'N',
          physicalFlag: 'N',
          physicalDefectFlag: 'N',
          attendeeType: '파트너',
          remark: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): TBM 참석자 내부직원 추가
 *******************************/
function addAttendee() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeAttendee, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: {
      plantCd: tbmData.value.plantCd
    }
  })
}
/******************************
 * TODO (목적): TBM 참석자 내부직원 팝업 닫기 콜백
 *******************************/
function closeAttendee(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(tbmData.value.tbmAttendeeList, {
        tbmAttendeeUserId: _item.userId
      })
      if (index === -1) {
        tbmData.value.tbmAttendeeList!.push({
          tbmId: props.popupParam.tbmId,
          tbmAttendeeId: uid(),
          tbmAttendeeDept: '(현업) ' + _item.deptName, // 소속명
          tbmAttendeeUserId: _item.userId,
          tbmAttendeeName: _item.userName,
          tbmAttendeeJob: _item.jobName,
          healthStatusCd: 'THS0000001',
          mentalFlag: 'N',
          phychologicalFlag: 'N',
          physicalFlag: 'N',
          physicalDefectFlag: 'N',
          attendeeType: '내부',
          remark: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): TBM 참석자 직접 추가
 *******************************/
function addAttendeeDirect() {
  // 참석자 직접추가
  const newAttendee: tbmAttendeeType = {
    tbmId: props.popupParam.tbmId,
    tbmAttendeeId: uid(),
    tbmAttendeeUserId: '',
    tbmAttendeeName: '',
    tbmAttendeeJob: '',
    tbmAttendeeDept: '',
    healthStatusCd: 'THS0000001',
    mentalFlag: 'N',
    phychologicalFlag: 'N',
    physicalFlag: 'N',
    physicalDefectFlag: 'N',
    attendeeType: '직접추가',
    remark: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  }
  tbmData.value.tbmAttendeeList!.push(newAttendee)
}
/******************************
 * TODO (목적): TBM 참석자 삭제
 *******************************/
function removeAttendee() {
  const selectData = attendeeTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.', //
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!tbmData.value.deleteTbmAttendeeList) {
        tbmData.value.deleteTbmAttendeeList = []
      }
      if (
        _.findIndex(tbmData.value.deleteTbmAttendeeList, {
          tbmAttendeeId: item.tbmAttendeeId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        tbmData.value.deleteTbmAttendeeList.push(item)
      }
      tbmData.value.tbmAttendeeList = _.reject(tbmData.value.tbmAttendeeList, item)
    })
  }
}
/******************************
 * TODO (목적): TBM 참석자 복사기능
 *******************************/
function copyTbm() {
  if (tbmData.value.sopWorkPermitId || tbmData.value.tbmName) {
    message.confirm({
      title: '확인',
      message: tbmData.value.sopWorkPermitId
        ? '불러온 작업허가서 정보를 삭제하시겠습니까?'
        : '작성중인 TBM 정보를 삭제하시겠습니까?',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        removeWorkPermit()
        callTbm()
      },
      cancelCallback: () => {} // 취소 callback 함수
    })
  } else callTbm()
}
function callTbm() {
  popupOptions.value = getPopupOptions('tbm', popupOptions.value, closeCopyTbmPopup, {
    /** 원하는 parameter 정의 */
    type: 'single'
  })
}
function closeCopyTbmPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  tbmData.value.tbmRiskList = []
  if (data && data.length > 0) {
    if (data[0].tbmId) {
      $http({
        url: $format(getUrl.value, data[0].tbmId),
        method: 'GET'
      }).then((_result: any) => {
        tbmData.value = _result.data
        tbmData.value.tbmCompleteFlag = 'N'
      })
    }
  }
}
/******************************
 * TODO (목적): TBM 출력물
 *******************************/
function printTbm() {
  $http({
    url: $format(printUrl.value, tbmData.value.tbmId),
    method: 'GET'
  }).then((_result: any) => {
    const fileOrgNm = 'TBM_' + tbmData.value.tbmName + '_' + tbmData.value.tbmDate + '.xlsx'
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}
/******************************
 * TODO (목적): 작업허가서 선택 시 관련 내용 조회
 *******************************/
function dataChange(data1: any, data2: any, data3: any) {
  if (data3.sopWorkPermitId!.length > 0) {
    $http({
      url: $format(getWorkPermitUrl.value, data3.sopWorkPermitId),
      method: 'GET'
    }).then((_result: any) => {
      tbmData.value.sopWorkPermitId = _result.data.sopWorkPermitId // 허가번호
      tbmData.value.tbmDate = _result.data.permitDate // 작업일
      tbmData.value.permitDate = _result.data.permitDate
      tbmData.value.processCd = _result.data.processCd // 공정
      tbmData.value.vendorCd = _result.data.vendorCd // 업체
      tbmData.value.tbmLocation = _result.data.workLocation // 작업장소
      tbmData.value.workName = _result.data.sopName // 작업
      tbmData.value.tbmName = _result.data.sopName // TBM명
      tbmData.value.tbmContents = _result.data.workSummary // 작업내용

      // 들고온 작업허가서에 책임자가 없으면 디폴트값으로 작성자 id 자동입력
      tbmData.value.tbmLeaderId = _result.data.workManagerId || user.value.userId

      // 새로 불러오기 위해 위험요소 리스트를 제거대상리스트에 다 넣는다
      if (!tbmData.value.deleteTbmRiskList) tbmData.value.deleteTbmRiskList = []
      _.forEach(tbmData.value.tbmRiskList, (item) => {
        if (
          _.findIndex(tbmData.value.deleteTbmRiskList, { tbmRiskId: item.tbmRiskId }) === -1 &&
          item.editFlag !== 'C'
        ) {
          tbmData.value.deleteTbmRiskList!.push(item)
        }
        tbmData.value.tbmRiskList = _.reject(tbmData.value.tbmRiskList, item)
      })

      if (!tbmData.value.deleteTbmAttendeeList) tbmData.value.deleteTbmAttendeeList = []
      _.forEach(tbmData.value.tbmAttendeeList, (item) => {
        if (
          _.findIndex(tbmData.value.deleteTbmAttendeeList, {
            tbmAttendeeId: item.tbmAttendeeId
          }) === -1 &&
          item.editFlag !== 'C'
        ) {
          tbmData.value.deleteTbmAttendeeList!.push(item)
        }
        tbmData.value.tbmAttendeeList = _.reject(tbmData.value.tbmAttendeeList, item)
      })
      // 작업허가서 lotos 는 설비 목록이라 위험설비 목록으로 불러올수없다.
      // if (!tbmData.value.deleteTbmHazardEquipModelList)
      //   tbmData.value.deleteTbmHazardEquipModelList = []
      // _.forEach(tbmData.value.tbmHazardEquipModelList, (item) => {
      //   if (
      //     _.findIndex(tbmData.value.deleteTbmHazardEquipModelList, {
      //       tbmHazardEquipId: item.tbmHazardEquipId
      //     }) === -1 &&
      //     item.editFlag !== 'C'
      //   ) {
      //     tbmData.value.deleteTbmHazardEquipModelList!.push(item)
      //   }
      //   tbmData.value.tbmHazardEquipModelList = _.reject(
      //     tbmData.value.tbmHazardEquipModelList,
      //     item
      //   )
      // })

      tbmData.value.tbmAttendeeList = []
      if (_result.data.workers && _result.data.workers.length > 0) {
        _.forEach(_result.data.workers, (_item) => {
          const index = _.findIndex(tbmData.value.tbmAttendeeList, {
            tbmAttendeeName: _item.workerName
          })
          if (index === -1) {
            let attendType = '직접추가'
            if (_item.belongName.includes('현업')) {
              attendType = '내부'
            } else if (_item.belongName.includes('협력업체')) {
              attendType = '파트너'
            }
            tbmData.value.tbmAttendeeList!.push({
              tbmId: tbmData.value.tbmId || uid(),
              tbmAttendeeId: uid(),
              tbmAttendeeUserId: _item.userId,
              tbmAttendeeName: _item.workerName,
              tbmAttendeeDept: _item.belongName,
              tbmAttendeeJob: _item.jobName,
              healthStatusCd: 'THS0000001',
              mentalFlag: 'N',
              phychologicalFlag: 'N',
              physicalFlag: 'N',
              physicalDefectFlag: 'N',
              attendeeType: attendType,
              regUserId: user.value.userId,
              editFlag: 'C'
            })
          }
        })
      }
      tbmData.value.tbmRiskList = []
      if (_result.data.assessments && _result.data.assessments.length > 0) {
        _.forEach(_result.data.assessments, (_item) => {
          if (!_item.riskHazardName) return
          tbmData.value.tbmRiskList!.push({
            tbmId: tbmData.value.tbmId || uid(),
            tbmRiskId: uid(),
            tbmRiskProcess: _item.jobStepName,
            tbmRisk: _item.riskHazardName,
            tbmImprove: _item.safetyActionMeasures,
            tbmRiskKeyFlag: 'N',
            tbmRiskType: '작업허가서',
            regUserId: user.value.userId,
            editFlag: 'C'
          })
        })
      }
      // 작업허가서 lotos 는 설비 목록이라 위험설비 목록으로 불러올수없다.
      // tbmData.value.tbmHazardEquipModelList = []
      // if (_result.data.lotos && _result.data.lotos.length > 0) {
      //   _.forEach(_result.data.lotos, (_item) => {
      //     if (!_item.riskHazardName) return
      //     $http({
      //       url: selectConfig.sop.hhm.hazard.check.list.url,
      //       method: 'GET',
      //       params: { equipmentCd: _item.equipmentCd }
      //     }).then((__result: any) => {
      //       if (__result.data.length > 0) {
      //         tbmData.value.tbmHazardEquipModelList!.push({
      //           tbmId: tbmData.value.tbmId || uid(),
      //           tbmHazardEquipId: uid(),
      //           saiContructFacilityId: __result.data[0].equipmentCd,
      //           emplacementPlace: __result.data[0].emplacementPlace,
      //           plantName: __result.data[0].plantName,
      //           machineryClassification: __result.data[0].machineryClassification,
      //           machineryName: __result.data[0].machineryName,
      //           volume: __result.data[0].volume,
      //           inspectionSubjectFlag: __result.data[0].inspectionSubjectFlag,
      //           inspectionSubjectFlagName: __result.data[0].inspectionSubjectFlagName,
      //           itemNo: __result.data[0].itemNo,
      //           machineryClassificationName: __result.data[0].machineryClassificationName,
      //           resultCd: __result.data[0].resultCd,
      //           gradeName: __result.data[0].gradeName,
      //           regUserId: user.value.userId,
      //           editFlag: 'C'
      //         })
      //       }
      //     })
      //   })
      // }
    })
  }
}
/******************************
 * TODO (목적): TBM 작업허가서 삭제 시 관련 데이터 제거
 *******************************/
function removeWorkPermit() {
  getDetail()
}
/******************************
 * TODO (목적): TBM 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.tbmId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): TBM 서명 콜백
 *******************************/
function signCallback2(data: any, rowIndex: any) {
  tbmData.value.tbmAttendeeList![rowIndex].electronSignature = data
  if (tbmData.value.tbmAttendeeList![rowIndex].editFlag !== 'C') {
    tbmData.value.tbmAttendeeList![rowIndex].editFlag = 'U'
  }
  proxies.value[rowIndex].hide()
}
/******************************
 * TODO (목적): TBM 위험요인 테이블 DATACHANGE
 *******************************/
function tableDataChange(prop: any, col: any) {
  if (col.name === 'tbmRiskKeyFlag') {
    tbmData.value.tbmRiskList!.forEach((item, index) => {
      // if (index === checkIndex){this.$set(item, 'tbmRiskKeyFlag', 'Y')}
      if (index !== prop.rowIndex) {
        item.tbmRiskKeyFlag = 'N'
      }
    })
  }
}
/******************************
 * TODO (목적): TBM 유해위험기계기구 상세 클릭
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '유해위험기계기구 상세'
  popupOptions.value.param = {
    hhmHazardousMachineryId: row.saiContructFacilityId ? row.saiContructFacilityId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(
      () => import(`@views/sop/mim/hazardEquipment/hazardEquipmentClassDetail.vue`)
    )
  )
  popupOptions.value.visible = true
  popupOptions.value.width = '95%'
  popupOptions.value.closeCallback = closeEquip1
}
/******************************
 * TODO (목적): TBM 유해위험기계기구 상세 팝업 닫기 콜백
 *******************************/
function closeEquip1() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): TBM 유해위험기계기구 추가
 *******************************/
function addEquip() {
  popupOptions.value = getPopupOptions('hazardequip', popupOptions.value, closeEquip2, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): TBM 유해위험기계기구 상세 팝업 닫기 콜백
 *******************************/
function closeEquip2(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (
        _.findIndex(tbmData.value.tbmHazardEquipModelList, {
          saiContructFacilityId: item.hhmHazardousMachineryId
        }) === -1
      ) {
        tbmData.value.tbmHazardEquipModelList!.push({
          tbmId: tbmData.value.tbmId,
          tbmHazardEquipId: uid(),
          saiContructFacilityId: item.hhmHazardousMachineryId,
          emplacementPlace: item.emplacementPlace,
          plantName: item.plantName,
          machineryClassification: item.machineryClassification,
          machineryName: item.machineryName,
          volume: item.volume,
          inspectionSubjectFlag: item.inspectionSubjectFlag,
          inspectionSubjectFlagName: item.inspectionSubjectFlagName,
          itemNo: item.itemNo,
          machineryClassificationName: item.machineryClassificationName,
          resultCd: item.resultCd,
          gradeName: item.gradeName,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): TBM 유해위험기계기구 제외
 *******************************/
function removeEquip() {
  const selectData = equipTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '삭제할 행을 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!tbmData.value.deleteTbmHazardEquipModelList) {
        tbmData.value.deleteTbmHazardEquipModelList = []
      }
      if (
        item.editFlag !== 'C' &&
        _.findIndex(tbmData.value.deleteTbmHazardEquipModelList, {
          equipmentCd: item.equipmentCd
        }) === -1
      ) {
        tbmData.value.deleteTbmHazardEquipModelList.push(item)
      }
      tbmData.value.tbmHazardEquipModelList = _.reject(tbmData.value.tbmHazardEquipModelList, item)
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.leaderSign
  color: #0072c6 !important
  font-size: 0.9em !important
  font-weight: 600
.custom-checkbox
  display: flex !important
  flex-direction: column-reverse !important
  align-items: flex-start !important
  .q-checkbox__label
    color: #0072c6
    font-weight: 600
    display: block !important
  .q-checkbox__inner
    display: block !important
.tbm
  .nofileArea
    height: 140px !important
</style>
