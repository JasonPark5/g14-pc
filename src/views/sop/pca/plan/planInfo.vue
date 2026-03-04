<template>
  <q-form ref="editForm">
    <c-card title="감사계획 상세" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable && popupParam.selfInspectionStatusCd === 'SISC000001'"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="audit"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="saveData"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-text
            :required="true"
            :editable="editable"
            label="감사명"
            name="selfInspectionTitle"
            v-model:value="audit.selfInspectionTitle"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :required="true"
            :editable="editable"
            type="year"
            label="감사년도"
            name="selfInspectionYear"
            v-model:value="audit.selfInspectionYear"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :required="true"
            codeGroupCd="SELF_INSPECTION_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="selfInspectionTypeCd"
            label="자체감사종류"
            v-model:value="audit.selfInspectionTypeCd"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            :required="true"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="audit.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :editable="false"
            type="none"
            :comboItems="revisionItems"
            itemText="codeName"
            itemValue="code"
            label="평가항목 개정번호"
            name="sysRevision"
            v-model:value="audit.sysRevision"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="감사대상" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-12">
                <c-text
                  :editable="editable"
                  label="감사대상개요"
                  name="remark"
                  v-model:value="audit.remark"
                />
              </div>
              <div class="col-4">
                <c-table
                  ref="table1"
                  title="대상공정"
                  tableId="grid1"
                  :columns="grid1.columns"
                  :data="grid1.data"
                  selection="multiple"
                  rowKey="processCd"
                  :isFullScreen="false"
                  :columnSetting="false"
                  :filtering="false"
                  :usePaging="false"
                  :hideBottom="true"
                  :isExcelDown="false"
                  gridHeight="300px"
                >
                  <!-- 버튼 영역 -->
                  <template v-slot:table-button>
                    <q-btn-group outline>
                      <c-btn
                        v-if="
                          editable &&
                          popupParam.selfInspectionResultId &&
                          popupParam.selfInspectionStatusCd === 'SISC000001'
                        "
                        icon="add"
                        @btnClicked="addrow(1)"
                      />
                      <c-btn
                        v-if="
                          editable &&
                          popupParam.selfInspectionResultId &&
                          popupParam.selfInspectionStatusCd === 'SISC000001'
                        "
                        icon="remove"
                        @btnClicked="removerow(1)"
                      />
                    </q-btn-group>
                  </template>
                </c-table>
              </div>
              <div class="col-4">
                <c-table
                  ref="table2"
                  title="대상설비"
                  tableId="grid2"
                  :columns="grid2.columns"
                  :data="grid2.data"
                  selection="multiple"
                  rowKey="equipmentCd"
                  :isFullScreen="false"
                  :columnSetting="false"
                  :filtering="false"
                  :usePaging="false"
                  :hideBottom="true"
                  :isExcelDown="false"
                  gridHeight="300px"
                >
                  <!-- 버튼 영역 -->
                  <template v-slot:table-button>
                    <q-btn-group outline>
                      <c-btn
                        v-if="
                          editable &&
                          popupParam.selfInspectionResultId &&
                          popupParam.selfInspectionStatusCd === 'SISC000001'
                        "
                        icon="add"
                        @btnClicked="addrow(2)"
                      />
                      <c-btn
                        v-if="
                          editable &&
                          popupParam.selfInspectionResultId &&
                          popupParam.selfInspectionStatusCd === 'SISC000001'
                        "
                        icon="remove"
                        @btnClicked="removerow(2)"
                      />
                    </q-btn-group>
                  </template>
                </c-table>
              </div>
              <div class="col-4">
                <c-table
                  ref="table3"
                  title="대상부서"
                  tableId="grid3"
                  :columns="grid3.columns"
                  :data="grid3.data"
                  selection="multiple"
                  rowKey="deptCd"
                  :isFullScreen="false"
                  :columnSetting="false"
                  :filtering="false"
                  :usePaging="false"
                  :hideBottom="true"
                  :isExcelDown="false"
                  gridHeight="300px"
                >
                  <!-- 버튼 영역 -->
                  <template v-slot:table-button>
                    <q-btn-group outline>
                      <c-btn
                        v-if="
                          editable &&
                          popupParam.selfInspectionResultId &&
                          popupParam.selfInspectionStatusCd === 'SISC000001'
                        "
                        icon="add"
                        @btnClicked="addrow(3)"
                      />
                      <c-btn
                        v-if="
                          editable &&
                          popupParam.selfInspectionResultId &&
                          popupParam.selfInspectionStatusCd === 'SISC000001'
                        "
                        icon="remove"
                        @btnClicked="removerow(3)"
                      />
                    </q-btn-group>
                  </template>
                </c-table>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-card title="감사수행일정" class="cardClassDetailForm">
            <template v-slot:card-detail>
              <div class="col-12">
                <c-datepicker
                  :required="true"
                  :editable="editable"
                  :range="true"
                  label="감사기간"
                  name="selfInspectionDt"
                  v-model:value="audit.selfInspectionDt"
                />
              </div>
              <div class="col-12">
                <c-table
                  ref="table4"
                  title="일자별 수행내역"
                  tableId="grid4"
                  :columns="grid4.columns"
                  :data="grid4.data"
                  selection="multiple"
                  rowKey="selfInspectionExecId"
                  :isFullScreen="false"
                  :columnSetting="false"
                  :filtering="false"
                  :usePaging="false"
                  :hideBottom="true"
                  gridHeight="300px"
                >
                  <!-- 버튼 영역 -->
                  <template v-slot:table-button>
                    <q-btn-group outline>
                      <c-btn
                        v-if="
                          editable &&
                          popupParam.selfInspectionResultId &&
                          popupParam.selfInspectionStatusCd === 'SISC000001'
                        "
                        icon="add"
                        @btnClicked="addrow(4)"
                      />
                      <c-btn
                        v-if="
                          editable &&
                          popupParam.selfInspectionResultId &&
                          popupParam.selfInspectionStatusCd === 'SISC000001'
                        "
                        icon="remove"
                        @btnClicked="removerow(4)"
                      />
                      <c-btn
                        v-if="
                          editable &&
                          popupParam.selfInspectionResultId &&
                          popupParam.selfInspectionStatusCd === 'SISC000001'
                        "
                        icon="save"
                        @btnClicked="saveRow(4)"
                      />
                    </q-btn-group>
                  </template>
                </c-table>
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table5"
            title="감사팀 목록"
            :columns="grid5.columns"
            :data="grid5.data"
            selection="multiple"
            rowKey="selfInspectionOrgId"
            :isFullScreen="false"
            :columnSetting="false"
            :filtering="false"
            :usePaging="false"
            gridHeight="300px"
          >
            <!-- 버튼 영역 -->
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="
                    editable &&
                    Boolean(popupParam.selfInspectionResultId) &&
                    popupParam.selfInspectionStatusCd === 'SISC000001'
                  "
                  label="추가"
                  icon="add"
                  @btnClicked="addrow(5)"
                />
                <c-btn
                  v-if="
                    editable &&
                    Boolean(popupParam.selfInspectionResultId) &&
                    popupParam.selfInspectionStatusCd === 'SISC000001'
                  "
                  label="삭제"
                  icon="remove"
                  @btnClicked="removerow(5)"
                />
                <c-btn
                  v-if="
                    editable &&
                    Boolean(popupParam.selfInspectionResultId) &&
                    popupParam.selfInspectionStatusCd === 'SISC000001'
                  "
                  label="저장"
                  icon="save"
                  @btnClicked="saveRow(5)"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </template>
    </c-card>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { auditType, equipType } from '../audit'

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
  name: 'planInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
  popupParam: {
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull
  }
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

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      selfInspectionResultId: '',
      selfInspectionStatusCd: '',
      sysRevision: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const audit = ref<auditType>({
  selfInspectionResultId: '', // 자체감사 계획 일련번호
  selfInspectionTitle: '', // 감사명
  selfInspectionYear: '', // 감사년도
  selfInspectionTypeCd: null, // 감사종류
  plantCd: null, // 해당사업장
  remark: '', // 감사대상 개요
  selfInspectionStartDt: '', // 감사기간-시작일
  selfInspectionEndDt: '', // 감사기간-종료일
  selfInspectionStatusCd: '', // 감사진행상태-계획중,계획완료,감사완료
  selfInspectionResultOpinion: '', // 감사원소견
  selfInspectionResultTotalOpinion: '', // 감사 결과 종합의견
  selfInspectionResultCorrect: '', // 시정 및 권고 요약
  selfInspectionDt: ['', ''],
  sysRevision: '' // 평가항목 개정번호
})
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '상위공정명',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid3 = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const grid4 = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'execDt',
      field: 'execDt',
      label: '수행일자',
      align: 'center',
      style: 'width: 120px',
      type: 'date',
      sortable: false
    },
    {
      required: true,
      name: 'execContent',
      field: 'execContent',
      label: '감사내역',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'execUser',
      field: 'execUser',
      label: '참석자',
      align: 'left',
      style: 'width: 200px',
      type: 'text',
      sortable: false
    }
  ],
  data: []
})
const grid5 = ref<gridType>({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '소속',
      align: 'center',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'jobName',
      field: 'jobName',
      label: '직책',
      align: 'center',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'userName',
      field: 'userName',
      label: '감사원명',
      align: 'center',
      style: 'width: 200px',
      sortable: false
    },
    {
      name: 'workName',
      field: 'workName',
      label: '담당업무',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'userMajor',
      field: 'userMajor',
      label: '전공',
      align: 'center',
      style: 'width: 200px',
      type: 'text',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const mappingType = ref('POST')
const infoUrl = ref('')
const saveUrl = ref(transactionConfig.sop.pca.result.info.insert.url)
const deleteUrl = ref('')
const list1Url = ref('')
const insert1Url = ref('')
const delete1Url = ref('')
const list2Url = ref('')
const insert2Url = ref('')
const delete2Url = ref('')
const list3Url = ref('')
const insert3Url = ref('')
const delete3Url = ref('')
const list4Url = ref('')
const insert4Url = ref('')
const delete4Url = ref('')
const revisionUrl = ref('')
const teamlistUrl = ref('')
const teaminsertUrl = ref('')
const teamdeleteUrl = ref('')
const revisionItems = ref<Array<codeMasterType>>([])
const editForm = ref<any>(null)
const table1 = ref<any>(null)
const table2 = ref<any>(null)
const table3 = ref<any>(null)
const table4 = ref<any>(null)
const table5 = ref<any>(null)

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
 * TODO (목적): 초기셋팅..
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  revisionUrl.value = selectConfig.sop.pca.item.revs.item
  infoUrl.value = selectConfig.sop.pca.result.info.get.url
  deleteUrl.value = transactionConfig.sop.pca.result.info.delete.url
  list1Url.value = selectConfig.sop.pca.result.process.list.url
  insert1Url.value = transactionConfig.sop.pca.result.process.save.url
  delete1Url.value = transactionConfig.sop.pca.result.process.delete.url
  list2Url.value = selectConfig.sop.pca.result.equipment.list.url
  insert2Url.value = transactionConfig.sop.pca.result.equipment.save.url
  delete2Url.value = transactionConfig.sop.pca.result.equipment.delete.url
  list3Url.value = selectConfig.sop.pca.result.dept.list.url
  insert3Url.value = transactionConfig.sop.pca.result.dept.save.url
  delete3Url.value = transactionConfig.sop.pca.result.dept.delete.url
  list4Url.value = selectConfig.sop.pca.result.exec.list.url
  insert4Url.value = transactionConfig.sop.pca.result.exec.save.url
  delete4Url.value = transactionConfig.sop.pca.result.exec.delete.url
  teamlistUrl.value = selectConfig.sop.pca.result.org.list.url
  teaminsertUrl.value = transactionConfig.sop.pca.result.org.save.url
  teamdeleteUrl.value = transactionConfig.sop.pca.result.org.delete.url
  // code setting
  // list setting
  getRevision()
}
/******************************
 * TODO (목적): 개정정보 조회
 *******************************/
function getRevision() {
  $http({
    url: revisionUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    revisionItems.value = _result.data
    if (!props.popupParam.selfInspectionResultId) {
      audit.value.sysRevision = revisionItems.value[0].code
      props.popupParam.sysRevision = revisionItems.value[0].code
      props.popupParam.selfInspectionStatusCd = 'SISC000001'
    } else {
      getInfo()
      getTaget(1)
      getTaget(2)
      getTaget(3)
      getTaget(4)
      getTaget(5) // 감사팀 테이블
    }
  })
}
/******************************
 * TODO (목적): 기본정보, 테이블의 데이터 조회
 *******************************/
function getInfo() {
  $http({
    url: infoUrl.value,
    method: 'GET',
    params: { selfInspectionResultId: props.popupParam.selfInspectionResultId }
  }).then((_result: any) => {
    audit.value = _result.data
    audit.value.sysRevision = audit.value.sysRevision + ''
    audit.value.selfInspectionDt = [
      audit.value.selfInspectionStartDt,
      audit.value.selfInspectionEndDt
    ]
  })
}
function getTaget(num?: number) {
  let listUrl = ''
  if (num === 1) listUrl = list1Url.value
  else if (num === 2) listUrl = list2Url.value
  else if (num === 3) listUrl = list3Url.value
  else if (num === 4) listUrl = list4Url.value
  else if (num === 5) listUrl = teamlistUrl.value
  $http({
    url: listUrl,
    method: 'GET',
    params: { selfInspectionResultId: props.popupParam.selfInspectionResultId }
  }).then((_result: any) => {
    if (num === 1) grid1.value.data = _result.data
    else if (num === 2) grid2.value.data = _result.data
    else if (num === 3) grid3.value.data = _result.data
    else if (num === 4) grid4.value.data = _result.data
    else if (num === 5) grid5.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 기본정보 저장
 *******************************/
function saveData() {
  mappingType.value = props.popupParam.selfInspectionResultId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          audit.value.regUserId = user.value.userId
          audit.value.chgUserId = user.value.userId
          if (Array.isArray(audit.value.selfInspectionDt)) {
            audit.value.selfInspectionStartDt = audit.value.selfInspectionDt[0]
            audit.value.selfInspectionEndDt = audit.value.selfInspectionDt[1]
          } else {
            audit.value.selfInspectionStartDt = undefined
            audit.value.selfInspectionEndDt = undefined
          }
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.selfInspectionResultId = result.data.selfInspectionResultId
  props.popupParam.selfInspectionStatusCd = result.data.selfInspectionStatusCd || 'SISC000001'
  getInfo()
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addrow(num?: number) {
  if (num === 1) {
    popupOptions.value = getPopupOptions('upProcess', popupOptions.value, closeProcess, {
      type: 'multiple',
      searchParam: { processLevelCd: '10' }
    })
  } else if (num === 2) {
    popupOptions.value = getPopupOptions('equip', popupOptions.value, closeEquipmenet, {
      type: 'multiple',
      searchParam: { plantCd: audit.value.plantCd }
    })
  } else if (num === 3) {
    popupOptions.value = getPopupOptions('dept', popupOptions.value, closeDept, {
      type: 'multiple',
      searchParam: { plantCd: audit.value.plantCd }
    })
  } else if (num === 4) {
    grid4.value.data.push({
      editFlag: 'C',
      selfInspectionResultId: props.popupParam.selfInspectionResultId, // 자체감사 계획 일련번호
      selfInspectionExecId: uid(), // 일자별 수행내역 일련번호
      execDt: getToday(), // 수행일자
      execContent: '', // 감사내역
      execUser: '' // 참석자
    })
  } else if (num === 5) {
    popupOptions.value = getPopupOptions('user', popupOptions.value, closeUser, {
      type: 'multiple'
    })
  }
}
function closeProcess(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData = [] as Array<processType>
    _.forEach(_data, (item) => {
      if (_.findIndex(grid1.value.data, { processCd: item.processCd }) === -1) {
        saveData.push({
          selfInspectionResultId: props.popupParam.selfInspectionResultId, // 자체감사 계획 일련번호
          processCd: item.processCd // 대상공정코드
        })
      }
    })
    $http({
      url: insert1Url.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      getTaget(1)
    })
  }
}
function closeEquipmenet(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData = [] as Array<equipType>
    _.forEach(_data, (item) => {
      if (_.findIndex(grid2.value.data, { equipmentCd: item.equipmentCd }) === -1) {
        saveData.push({
          selfInspectionResultId: props.popupParam.selfInspectionResultId,
          equipmentCd: item.equipmentCd
        })
      }
    })
    $http({
      url: insert2Url.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      getTaget(2)
    })
  }
}
function closeDept(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const saveData = [] as Array<any>
    _.forEach(_data, (item) => {
      if (_.findIndex(grid3.value.data, { deptCd: item.deptCd }) === -1) {
        saveData.push({
          selfInspectionResultId: props.popupParam.selfInspectionResultId,
          deptCd: item.deptCd
        })
      }
    })
    $http({
      url: insert3Url.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      getTaget(3)
    })
  }
}
function closeUser(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(grid5.value.data, { userId: item.userId }) === -1) {
        grid5.value.data?.push({
          editFlag: 'C',
          selfInspectionResultId: props.popupParam.selfInspectionResultId, // 자체감사 계획 일련번호
          selfInspectionOrgId: uid(),
          userId: item.userId,
          userName: item.userName,
          workName: '',
          userMajor: '',
          deptName: item.deptName,
          jobName: item.jobName
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 선택 삭제
 *******************************/
function removerow(num?: number) {
  let selectData = [] as Array<any>
  let delUrl = ''
  if (num === 1) {
    selectData = table1.value.getSelected()
    delUrl = delete1Url.value
  } else if (num === 2) {
    selectData = table2.value.getSelected()
    delUrl = delete2Url.value
  } else if (num === 3) {
    selectData = table3.value.getSelected()
    delUrl = delete3Url.value
  } else if (num === 4) {
    selectData = table4.value.getSelected()
    delUrl = delete4Url.value
  } else if (num === 5) {
    selectData = table5.value.getSelected()
    delUrl = teamdeleteUrl.value
  }
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
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: delUrl,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            if (num === 1) grid1.value.data = _.reject(grid1.value.data, item)
            else if (num === 2) grid2.value.data = _.reject(grid2.value.data, item)
            else if (num === 3) grid3.value.data = _.reject(grid3.value.data, item)
            else if (num === 4) grid4.value.data = _.reject(grid4.value.data, item)
            else if (num === 5) grid5.value.data = _.reject(grid5.value.data, item)
          })
          if (num === 1) table1.value.compoTable.clearSelection()
          else if (num === 2) table2.value.compoTable.clearSelection()
          else if (num === 3) table3.value.compoTable.clearSelection()
          else if (num === 4) table4.value.compoTable.clearSelection()
          else if (num === 5) table5.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 수행내역 테이블 / 감사팀 저장
 *******************************/
function saveRow(num?: number) {
  if (num === 4 && !validTable(grid4.value.columns, grid4.value.data!)) {
    message.alert({
      title: '안내',
      message: '필수 입력값을 입력해 주세요. [수행일자, 감사내역]',
      type: 'warning' // success / info / warning / error
    })
  } else {
    let saveData = null
    let insertUrl = ''
    if (num === 4) {
      saveData = grid4.value.data.filter((x) => x.editFlag == 'C' || x.editFlag == 'U')
      insertUrl = insert4Url.value
    } else if (num === 5) {
      saveData = grid5.value.data.filter((x) => x.editFlag == 'C' || x.editFlag == 'U')
      insertUrl = teaminsertUrl.value
    }
    if (saveData && saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: insertUrl,
            method: 'POST',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            if (num === 4) getTaget(4)
            else if (num === 5) getTaget(5)
          })
        },
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.',
        type: 'info' // success / info / warning / error
      })
    }
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
