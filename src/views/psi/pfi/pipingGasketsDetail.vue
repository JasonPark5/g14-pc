<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card
            title="개정"
            class="cardClassDetailForm revisionLayout"
            topClass="topcolor-orange"
            v-if="popupParam.psiPipeGasketId"
          >
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div class="row">
                  <div class="col-1">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정번호"
                      name="revisionNum"
                      v-model:value="pipe.revisionNum"
                    />
                  </div>
                  <div class="col-2">
                    <c-text
                      :editable="false"
                      label="개정일시"
                      name="regDtStr"
                      v-model:value="pipe.regDtStr"
                    />
                  </div>
                  <div class="col-1">
                    <c-text
                      :editable="false"
                      label="개정자"
                      name="regUserName"
                      v-model:value="pipe.regUserName"
                    />
                  </div>
                  <!-- <div class="col-4">
                    <c-moc 
                      :editable="editable && isRevision"
                      :isSubmit="saveCallData"
                      :document="pipe"
                      :documentId="popupParam.psiPipeGasketId"
                      documentTitle="pipeName"
                      mocRelatedTaskCd="RT00000001"
                      label="MOC번호"
                      name="sopMocId"
                      v-model:value="pipe.sopMocId"
                    />
                  </div> -->
                  <div class="col-4">
                    <c-text
                      :required="editable && isRevision"
                      :editable="editable && isRevision"
                      label="개정사유"
                      name="revisionContent"
                      v-model:value="pipe.revisionContent"
                    />
                  </div>
                </div>
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6" style="margin-top: -18px !important" id="revdiv">
                <c-table
                  ref="revision"
                  title="개정이력"
                  tableId="revision"
                  topBorderClass="topcolor-orange"
                  :columns="gridrev.columns"
                  :data="gridrev.data"
                  gridHeight="150px"
                  :columnSetting="false"
                  :expandAll="false"
                  :isFullScreen="false"
                  :usePaging="false"
                  :hideBottom="true"
                  :filtering="false"
                  @rowClick="rowClickRev"
                >
                </c-table>
              </div> -->
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-table
            ref="table1"
            title="분류별 유체목록"
            :isExcelDown="false"
            :columnSetting="false"
            :isFullScreen="false"
            :usePaging="false"
            :columns="grid.columns"
            :data="grid.data"
            @rowClick="rowClick"
            gridHeight="330px"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
          <c-card title="배관 및 개스킷 상세정보" class="cardClassDetailForm">
            <template v-slot:card-select>
              <c-select
                :editable="!isRevision"
                v-if="popupParam.psiPipeGasketId"
                :comboItems="gridrev.data"
                type="custom"
                typetext="개정이력"
                itemText="revisionNum"
                itemValue="psiPipeGasketId"
                name="selectedpsiPipeGasketId"
                label=""
                v-model:value="selectedpsiPipeGasketId"
                @update:value="rowClickRev"
              />
            </template>
            <template v-slot:card-button>
              <q-btn-group outline>
                <q-icon
                  name="help"
                  style="font-size: 20px; margin-right: 5px"
                  class="custom-btn text-primary"
                >
                  <q-tooltip
                    anchor="bottom left"
                    self="top right"
                    :offset="[0, 0]"
                    style="font-size: 0.9em; padding: 10px"
                  >
                    <div class="tooltipCustom">
                      {{
                        $language(
                          '① 분류코드란에는 공정배관계장도 도면상의 배관분류 코드를 기재합니다.'
                        )
                      }}<br />
                      {{ $language('② 배관재질란은 KS/ASTM 등의 기호로 기재합니다.') }}<br />
                      {{
                        $language(
                          '③ 개스킷 재질 및 형태란에는 일반명 및 형태를 기입하고 상품번호는 기재하지 아니합니다.'
                        )
                      }}
                    </div>
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-show="editable && popupParam.psiPipeGasketId && !isRevision"
                  label="유체정보 개정"
                  icon="restart_alt"
                  @btnClicked="setRevision"
                />
                <c-btn
                  v-show="editable && popupParam.psiPipeGasketId && isRevision"
                  label="개정취소"
                  icon="restart_alt"
                  @btnClicked="cancelRevision"
                />
                <c-btn
                  v-if="editable && popupParam.psiPipeGasketId"
                  label="유체 추가"
                  icon="add"
                  @btnClicked="addData"
                />
                <c-btn
                  v-if="editable && popupParam.psiPipeGasketId && deletable"
                  label="유체 삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="pipe"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-4">
                <c-text
                  :required="true"
                  :editable="editable && pipeTypeCdable"
                  label="분류코드"
                  name="pipeTypeCd"
                  v-model:value="pipe.pipeTypeCd"
                />
              </div>
              <div class="col-4">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="유체의명칭 또는 구분"
                  name="pipeName"
                  v-model:value="pipe.pipeName"
                />
              </div>
              <!-- <div class="col-4">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="pipe.plantCd"
                />
              </div> -->
              <div class="col-4">
                <c-text
                  suffix="MPa"
                  :editable="editable"
                  label="설계압력(MPa)"
                  name="designPress"
                  v-model:value="pipe.designPress"
                />
              </div>
              <div class="col-4">
                <c-text
                  suffix="℃"
                  :editable="editable"
                  label="설계온도(℃)"
                  name="designTemp"
                  v-model:value="pipe.designTemp"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable"
                  label="배관재질"
                  name="pipeMaterial"
                  v-model:value="pipe.pipeMaterial"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable"
                  label="개스킷 재질 및 형태"
                  name="gasketMaterial"
                  v-model:value="pipe.gasketMaterial"
                />
              </div>
              <div class="col-4">
                <c-text
                  :editable="editable"
                  label="개스킷 재질 및 상세"
                  name="gasketMaterial"
                  v-model:value="pipe.gasketMaterial"
                />
              </div>
              <div class="col-2">
                <c-text
                  suffix="%"
                  :editable="editable"
                  label="비파괴검사율(%)"
                  name="noneDestructPercent"
                  v-model:value="pipe.noneDestructPercent"
                />
              </div>
              <div class="col-2">
                <c-text
                  :editable="editable"
                  label="후열처리여부"
                  name="afterHeatTreatFlag"
                  v-model:value="pipe.afterHeatTreatFlag"
                />
              </div>
              <!-- <div class="col-3">
                <c-task-target
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="pipe.plantCd"
                  :editable="editable"
                  label="관련공정"
                  name="processCd"
                  v-model:value="pipe.processCd"
                />
              </div>
              <div class="col-3">
                <c-dept
                  :editable="editable"
                  label="관리부서"
                  name="deptCd"
                  v-model:value="pipe.deptCd">
                </c-dept>
              </div> -->
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  label="비고"
                  name="remarks"
                  v-model:value="pipe.remarks"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
          style="padding-top: 20px !important"
        >
          <c-upload :attachInfo="attachInfo" :editable="editable" label="첨부파일" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table2"
            title="배관 및 개스킷 별 화학물질 목록"
            :columns="grid2.columns"
            :data="grid2.data"
            :columnSetting="false"
            selection="multiple"
            rowKey="psiPipeGasketSubstancesId"
            :filtering="false"
            :usePaging="false"
            :hideBottom="true"
            :isExcelDown="false"
            gridHeight="250px"
          >
            <!-- 버튼 영역 -->
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn label="화학물질 추가" v-if="editable" icon="add" @btnClicked="addApiRow" />
                <c-btn label="추가" v-if="editable" icon="add" @btnClicked="addrow" />
                <c-btn
                  label="삭제"
                  v-if="editable && grid2.data && grid2.data.length > 0"
                  icon="remove"
                  @btnClicked="removeRow"
                />
              </q-btn-group>
            </template>
            <template v-slot:customArea="{ props, col }">
              <q-chip
                v-if="col.name === 'msdslink' && props.row.mttrid !== ''"
                color="primary"
                :clickable="true"
                @click.stop="() => msdslink(props.row)"
                text-color="white"
              >
                MSDS
              </q-chip>
            </template>
          </c-table>
        </div>
      </div>
      <c-dialog :param="popupOptions" />
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { pipeType } from '../processSafetyInfo'
import { chemReviewSubstanceType } from '@/views/mdm/mam/review/chemReview'

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
  name: 'pipingGasketsDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    psiPipeGasketId?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<any>
  height?: stringNull
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
      psiPipeGasketId: ''
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'PSI_PIPINGGASKETS',
  taskKey: '',
  beforeTaskKey: '',
  isRev: false
})
const gridrev = ref<gridType>({
  columns: [
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: '개정번호',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    },
    {
      name: 'revisionContent',
      field: 'revisionContent',
      label: '개정사유',
      align: 'left',
      sortable: true
    },
    {
      name: 'regDtStr',
      field: 'regDtStr',
      label: '개정일시',
      style: 'width: 150px',
      align: 'center',
      sortable: true
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '개정자',
      align: 'center',
      style: 'width: 80px',
      sortable: true
    }
  ],
  data: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'pipeTypeCd',
      field: 'pipeTypeCd',
      label: '분류코드',
      align: 'center',
      style: 'width:150px',
      sortable: false
    },
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: 'Rev.',
      align: 'center',
      style: 'width:50px',
      sortable: true
    },
    {
      name: 'pipeName',
      field: 'pipeName',
      label: '유체의명칭 또는 구분',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [],
  data: []
})
const pipe = ref<pipeType>({
  psiPipeGasketId: '', // 배관및개스킷 일련번호
  plantCd: '', // 사업장코드
  pipeTypeCd: '', // 분류코드
  pipeName: '', // 유체의명칭또는구분
  designPress: '', // 설계압력(MPa)
  designTemp: '', // 설계온도(℃)
  pipeMaterial: '', // 배관재질
  gasketMaterial: '', // 개스킷 재질 및 형태
  noneDestructPercent: '', // 비파괴검사율
  afterHeatTreatFlag: '', // 후열처리여부
  remarks: '', // 비고
  processCd: '',
  deptCd: '',
  revisionNum: '',
  groupId: '',
  sysRevision: 1,
  revisionContent: '제정',
  regDtStr: '',
  regUserName: '',
  sopMocId: ''
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const isSave = ref(false)
const deletable = ref(false)
const isRevision = ref(false)
const pipeTypeCdable = ref(true)
const selectedpsiPipeGasketId = ref<stringNull>(null)
const detailUrl = ref('')
const listUrl = ref('')
const saveUrl = ref(transactionConfig.psi.pfi.pipegasket.insert.url)
const deleteUrl = ref('')
const revlistUrl = ref('')
const sublistUrl = ref('')
const subsaveUrl = ref('')
const subdeleteUrl = ref('')
const saveCallData = ref('')
const mappingType = ref('POST')
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)

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
  listUrl.value = selectConfig.psi.pfi.pipegasket.list.url
  detailUrl.value = selectConfig.psi.pfi.pipegasket.get.url
  deleteUrl.value = transactionConfig.psi.pfi.pipegasket.delete.url
  sublistUrl.value = selectConfig.psi.pfi.pipegasket.substance.list.url
  subsaveUrl.value = transactionConfig.psi.pfi.pipegasket.substance.save.url
  subdeleteUrl.value = transactionConfig.psi.pfi.pipegasket.substance.delete.url
  revlistUrl.value = selectConfig.psi.pfi.pipegasket.list.url + '/revs'
  // code setting
  grid2.value.columns = [
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      style: 'width:120px',
      type: 'text',
      sortable: false
    },
    {
      name: 'chemNmKr',
      field: 'chemNmKr',
      label: '화학물질명(KOR)',
      type: 'text',
      align: 'left',
      sortable: false
    },
    {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '화학물질명(ENG)',
      type: 'text',
      align: 'left',
      sortable: false
    },
    {
      name: 'msdslink',
      field: 'msdslink',
      label: 'MSDS',
      type: 'custom',
      align: 'center',
      sortable: false,
      style: 'width:100px',
      helpcomment: $language('산업안전보건공단에서 제공하는 MSDS정보')
    },
    {
      name: 'molecularFormula',
      field: 'molecularFormula',
      label: '분자식',
      align: 'center',
      style: 'width:120px',
      type: 'text',
      sortable: false
    },
    {
      label: '함유량(%)',
      align: 'center',
      child: [
        {
          name: 'limitHigh',
          field: 'limitHigh',
          label: '상한',
          align: 'center',
          style: 'width:100px',
          type: 'text',
          sortable: false
        },
        {
          name: 'limitLow',
          field: 'limitLow',
          label: '하한',
          align: 'center',
          style: 'width:100px',
          type: 'text',
          sortable: false
        },
        {
          name: 'limitRepval',
          field: 'limitRepval',
          label: '대표값',
          align: 'center',
          style: 'width:100px',
          type: 'text',
          sortable: false
        }
      ]
    },
    {
      label: '물질정보',
      align: 'center',
      child: [
        {
          name: 'exposedBasis',
          field: 'exposedBasis',
          label: '노출기준',
          align: 'center',
          style: 'width:110px',
          type: 'text',
          sortable: false
        },
        {
          name: 'toxicity',
          field: 'toxicity',
          label: '독성치',
          align: 'center',
          style: 'width:120px',
          type: 'text',
          sortable: false
        }
      ]
    }
  ]
  // list setting
  getData()
}
/******************************
 * TODO (목적): 유체테이블 조회
 *******************************/
function getList(_plantCd?: stringNull, _pipeTypeCd?: stringNull) {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { plantCd: _plantCd, pipeTypeCd: _pipeTypeCd }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 배관 및 개스킷 별 화학물질 목록 조회
 *******************************/
function getSubList(row: any) {
  $http({
    url: $format(sublistUrl.value, row.psiPipeGasketId),
    method: 'GET'
  }).then((_result: any) => {
    grid2.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 배관 및 개스킷 상세 조회
 *******************************/
function getData() {
  isRevision.value = false
  if (props.popupParam.psiPipeGasketId) {
    getDetail(props.popupParam.psiPipeGasketId, true)
    attachInfo.value.taskKey = props.popupParam.psiPipeGasketId
    pipeTypeCdable.value = true
  } else pipeTypeCdable.value = false
}
function getDetail(_psiPipeGasketId?: stringNull, _check?: boolean) {
  $http({
    url: $format(detailUrl.value, _psiPipeGasketId),
    method: 'GET'
  }).then((_result: any) => {
    pipe.value = _result.data
    pipe.value.regDtStr = pipe.value.regDtStr.slice(0, -2)
    emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    getList(_result.data.plantCd, _result.data.pipeTypeCd)
    isRevision.value = false
    if (_check) getRevList(_result.data.groupId)
    if (_result.data.psiPipeGasketId === props.popupParam.psiPipeGasketId) {
      editable.value = Boolean(route.meta.editable)
    } else editable.value = false
    deletable.value = true
    getSubList({ psiPipeGasketId: _result.data.psiPipeGasketId })
  })
}
/******************************
 * TODO (목적): 유체 row 추가
 *******************************/
function addData() {
  props.popupParam.psiPipeGasketId = ''
  deletable.value = false
  pipeTypeCdable.value = false
  grid2.value.data = []
  pipe.value = {
    psiPipeGasketId: '', // 배관및개스킷 일련번호
    plantCd: '', // 사업장코드
    pipeTypeCd: grid.value.data.length > 0 ? grid.value.data[0].pipeTypeCd : '', // 분류코드
    pipeName: '', // 유체의명칭또는구분
    designPress: '', // 설계압력(MPa)
    designTemp: '', // 설계온도(℃)
    pipeMaterial: '', // 배관재질
    gasketMaterial: '', // 개스킷 재질 및 형태
    noneDestructPercent: '', // 비파괴검사율
    afterHeatTreatFlag: '', // 후열처리여부
    remarks: '', // 비고
    processCd: '',
    deptCd: '',
    revisionNum: '',
    groupId: '',
    sysRevision: 1,
    revisionContent: '제정',
    regDtStr: '',
    regUserName: '',
    sopMocId: ''
  }
}
/******************************
 * TODO (목적): 유체 row 클릭시 상세내용 표시
 *******************************/
function rowClick(row: any) {
  $http({
    url: $format(detailUrl.value, row.psiPipeGasketId),
    method: 'GET'
  }).then((_result: any) => {
    deletable.value = true
    pipe.value = _result.data
    props.popupParam.psiPipeGasketId = _result.data.psiPipeGasketId
    getRevList(_result.data.groupId)
    getSubList(row)
    pipeTypeCdable.value = false
    selectedpsiPipeGasketId.value = _result.data.psiPipeGasketId
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.psiPipeGasketId) {
    pipe.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    pipe.value.regUserId = user.value.userId
    mappingType.value = 'POST'
  }
  let saveMsg = '저장하시겠습니까?'
  if (isRevision.value) saveMsg = '현재버전을 개정하여 저장하시겠습니까?'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: saveMsg,
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          // 개정시
          if (isRevision.value) {
            mappingType.value = 'POST'
            pipe.value.sysRevision = parseInt(pipe.value.sysRevision) + 1
          }
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  props.popupParam.psiPipeGasketId = result.data.psiPipeGasketId
  saveCallData.value = uid()
  // 첨부파일 셋팅
  attachInfo.value.taskKey = result.data.psiPipeGasketId
  attachInfo.value.isSubmit = uid()
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  saveSubstance()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.psiPipeGasketId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        if (grid.value.data.length === 1) emits('closePopup')
        else getList(pipe.value.plantCd, pipe.value.pipeTypeCd)
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 화학물질정보 검색 팝업에서 선택해서 추가
 *******************************/
function addApiRow() {
  popupOptions.value = getPopupOptions('chemBase', popupOptions.value, closeCasPopup, {
    type: 'multiple'
  })
}
function closeCasPopup(_data: Array<chemReviewSubstanceType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(grid2.value.data, { casNo: item.casNo }) === -1) {
        grid2.value.data.splice(0, 0, {
          editFlag: 'C',
          psiPipeGasketId: props.popupParam.psiPipeGasketId, // 배관및개스킷 일련번호
          psiPipeGasketSubstancesId: uid(), // 조성품 일련번호
          casNo: item.casNo ? item.casNo : '',
          chemNmKr: item.chemNmKr ? item.chemNmKr : '',
          chemNmEn: item.chemNmEn ? item.chemNmEn : '',
          limitHigh: '', // 함유량 상한(%)
          limitLow: '', // 함유량 하한(%)
          limitRepval: '', // 함유량 대표값(%)
          molecularFormula: item.molecularFormula ? item.molecularFormula : '', // 화학식
          exposedBasis: '', // 노출기준
          toxicity: '', // 독성치
          mttrid: item.mttrid ? item.mttrid : '',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 직접 화학물질 정보 추가
 *******************************/
function addrow() {
  // 초기에는 userId에 tempId를 부여
  grid2.value.data.splice(0, 0, {
    editFlag: 'C',
    psiPipeGasketId: props.popupParam.psiPipeGasketId, // 배관및개스킷 일련번호
    psiPipeGasketSubstancesId: uid(), // 조성품 일련번호
    casNo: '', // CAS No.
    chemNmKr: '', // 화학물질명(KOR)
    chemNmEn: '', // 화학물질명(ENG)
    limitHigh: '', // 함유량 상한(%)
    limitLow: '', // 함유량 하한(%)
    limitRepval: '', // 함유량 대표값(%)
    molecularFormula: '', // 분자식
    exposedBasis: '', // 노출기준
    toxicity: '', // 독성치
    mttrid: '', // 환경부데이터 물질ID
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): MSDS 정보 조회 창 팝업
 *******************************/
function msdslink(row: any) {
  window.open(
    'https://msds.kosha.or.kr/MSDSInfo/kcic/msdsdetail.do?chem_id=' + row.mttrid + '&viewType=msds',
    'msdspop',
    'width=1280, height=768, menubar=no, status=no, toolbar=no'
  )
}
/******************************
 * TODO (목적): 화학물질 목록 저장
 *******************************/
function saveSubstance() {
  let isConti = true
  _.forEach(grid2.value.data, (item) => {
    if (!item.chemNmKr) {
      isConti = false
      return false
    }
  })
  if (!isConti) {
    message.alert({
      title: '안내',
      message: '필수 입력값을 입력해 주세요. [화학물질명]',
      type: 'warning' // success / info / warning / error
    })
  } else {
    let saveData = []
    if (isRevision.value) {
      saveData = grid2.value.data
      _.forEach(saveData, (item) => {
        item.editFlag = 'C'
        item.regUserId = user.value.userId
        item.chgUserId = user.value.userId
        item.psiPipeGasketId = props.popupParam.psiPipeGasketId
      })
    } else {
      saveData = grid2.value.data.filter((x) => x.editFlag === 'C' || x.editFlag === 'U')
      _.forEach(saveData, (item) => {
        item.regUserId = user.value.userId
        item.chgUserId = user.value.userId
        item.psiPipeGasketId = props.popupParam.psiPipeGasketId
      })
    }
    if (saveData.length > 0) {
      $http({
        url: subsaveUrl.value,
        method: 'POST',
        data: saveData
      }).then(() => {
        message.alert({
          title: '안내',
          message: '저장되었습니다.',
          type: 'success' // success / info / warning / error
        })
        getData()
      })
    } else {
      getData()
      message.alert({
        title: '안내',
        message: '저장되었습니다.',
        type: 'success' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 화학물질 row 삭제
 *******************************/
function removeRow() {
  const selectData = table2.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: subdeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          // getSubList({psiPipeGasketId: props.popupParam.psiPipeGasketId})
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid2.value.data = _.reject(grid2.value.data, item)
          })
          table2.value.compoTable.clearSelection()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 개정 버전 조회
 *******************************/
function getRevList(_groupId?: string) {
  $http({
    url: revlistUrl.value,
    method: 'GET',
    params: { groupId: _groupId }
  }).then((_result: any) => {
    gridrev.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 개정 버전 추가
 *******************************/
function setRevision() {
  $http({
    url: selectConfig.com.revision.getversion,
    method: 'GET',
    params: { revisionNum: pipe.value.revisionNum }
  }).then((_result: any) => {
    pipe.value.revisionNum = _result.data
    pipe.value.revisionContent = ''
    pipe.value.regDtStr = ''
    pipe.value.regUserName = ''
    pipe.value.sopMocId = ''
    isRevision.value = true
    // 첨부파일 셋팅
    attachInfo.value.taskKey = ''
    attachInfo.value.beforeTaskKey = props.popupParam.psiPipeGasketId
    attachInfo.value.isRev = true
  })
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  isRevision.value = false
  attachInfo.value.taskKey = props.popupParam.psiPipeGasketId
  attachInfo.value.beforeTaskKey = ''
  attachInfo.value.isRev = false
  getData()
}
/******************************
 * TODO (목적): 개정 버전 변경 업데이트
 *******************************/
function rowClickRev(row?: any) {
  if (row) {
    getDetail(row, true)
    attachInfo.value.taskKey = row
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
