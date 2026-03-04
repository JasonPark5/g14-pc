<template>
  <q-form ref="editForm">
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !isReadOnly"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="resultData"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="saveData"
                @btnCallback="saveCallback"
              />
              <c-btn
                v-if="editable && isOld && !isReadOnly"
                label="삭제"
                icon="remove"
                @btnClicked="deleteData"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-task-target
                :required="true"
                :editable="editable"
                :disabled="isOld || isReadOnly"
                :customPopupParam="{ targetKey: 'hazardequip' }"
                label="유해위험기계기구"
                name="hhmHazardousMachineryId"
                v-model:value="resultData.hhmHazardousMachineryId"
                @dataChange="
                  (key: any, bfValue: any, data: any) => {
                    resultData.machineryName = data.machineryName
                    setInspectionName()
                    dataChange(data)
                  }
                "
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                :required="true"
                :editable="editable"
                :disabled="isReadOnly"
                default="today"
                label="검사일"
                name="inspectionDate"
                v-model:value="resultData.inspectionDate"
                @datachange="setInspectionName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-dept
                :required="true"
                :editable="editable"
                :disabled="isReadOnly"
                label="주관부서"
                type="edit"
                name="departmentDeptCd"
                v-model:value="resultData.departmentDeptCd"
                @setDeptName="
                  (name: any) => {
                    resultData.departmentDeptName = name
                    setInspectionName()
                  }
                "
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :editable="editable"
                :disabled="isReadOnly"
                label="기관(검사원명)"
                name="inspectionAgency"
                v-model:value="resultData.inspectionAgency"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text
                :editable="editable"
                :disabled="isReadOnly"
                label="검사결과 상세"
                name="inspectionResultDetail"
                v-model:value="resultData.inspectionResultDetail"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :required="true"
                :editable="editable"
                :disabled="isReadOnly"
                label="점검명"
                name="inspectionName"
                v-model:value="resultData.inspectionName"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <c-upload
                :attachInfo="attachInfo"
                :editable="editable && !isReadOnly"
                label="첨부파일"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-lg-12 col-md-12 col-sm-12">
        <c-table
          ref="table"
          title="필수항목 목록"
          :columns="grid.columns"
          :gridHeight="grid.height"
          :data="resultData.resultList"
          :filtering="false"
          :isExcelDown="false"
          :columnSetting="false"
          :usePaging="false"
          :editable="editable && !isReadOnly"
          selection="multiple"
          rowKey="hazardousMachineryInspectionResultItemId"
        >
          <template v-slot:suffixTitle>
            <span style="font-size: 0.8em; font-weight: 300">
              &nbsp;&nbsp;
              {{ $language('V : 육안검사') }} &nbsp;&nbsp;
              {{ $language('E : 장비검사') }} &nbsp;&nbsp;
              {{ $language('A : 작동검사') }} &nbsp;&nbsp;
              {{ $language('C : 인증확인대상') }} &nbsp;&nbsp;
            </span>
          </template>
          <template v-slot:customArea="{ props }">
            <template v-if="props.row.testMothod">
              <!-- <q-chip
                v-for="(name, index) in getSplitMethodNames(props.row.testMothodName)"
                :key="index"
                outline
                square
                color="orange"
                text-color="white"
                class="q-ma-none"
              >
                {{ name + ' ' }}
              </q-chip> -->
            </template>
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !isReadOnly"
                :showLoading="false"
                label="추가"
                icon="add"
                @btnClicked="addResult"
              />
              <c-btn
                v-if="
                  editable &&
                  !isReadOnly &&
                  resultData.resultList &&
                  resultData.resultList.length > 0
                "
                :showLoading="false"
                label="제외"
                icon="remove"
                @btnClicked="removeResult"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <c-dialog :param="popupOptions" />
    </div>
  </q-form>
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
  name: 'hazardEquipmentResultRegisterDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    inspectionNo: stringNull
    readOnly: Boolean
  }
}
interface gridType {
  columns: tableColumnType
  data: Array<any>
  height: string
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
      inspectionNo: '',
      readOnly: false
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'itemName',
      field: 'itemName',
      label: '검사항목',
      style: 'width:150px',
      align: 'center',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      name: 'itemCriterion',
      field: 'itemCriterion',
      label: '판정기준',
      style: 'width:400px',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      setHeader: true,
      name: 'inspectionFlag',
      field: 'inspectionFlag',
      label: '점검(판정)결과',
      style: 'width:150px',
      align: 'center',
      type: 'select',
      sortable: false,
      comboItems: [
        { code: 'Y', codeName: '합격' },
        { code: 'N', codeName: '불합격' },
        { code: 'E', codeName: '해당없음' }
      ]
    },
    {
      name: 'testMothod',
      field: 'testMothod',
      label: '검사방법',
      align: 'center',
      style: 'width:150px',
      type: 'text',
      sortable: false
    },
    {
      name: 'useEquip',
      field: 'useEquip',
      label: '활용장비',
      align: 'center',
      style: 'width:120px',
      type: 'text',
      sortable: false
    },
    {
      name: 'testResult',
      field: 'testResult',
      label: '검사결과',
      align: 'left',
      style: 'width:250px',
      type: 'text',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '조항',
      align: 'center',
      style: 'width:80px',
      type: 'text',
      sortable: false
    }
  ],
  data: [],
  height: '850px'
})
const resultData = ref<any>({
  hhmHazardousMachineryId: null,
  inspectionDate: null,
  departmentDeptName: null,
  departmentDeptCd: null,
  inspectionAgency: null,
  inspectionResultDetail: null,
  inspectionResultCd: null,
  inspectionName: '',
  resultList: [],
  deleteResultList: []
})
const editForm = ref<any>(null)
const table = ref<any>(null)
const saveType = ref('POST')
const getUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const getNewUrl = ref('')
const isSave = ref(false)
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: 'HAZARD_EQUIPMENT',
  taskKey: ''
})

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.inspectionNo))
const isReadOnly = computed(() => Boolean(props.popupParam.readOnly))
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
  getUrl.value = selectConfig.sop.hhm.hazard.history.get.url
  getNewUrl.value = selectConfig.sop.hhm.hazard.history.newitem.url
  saveUrl.value = transactionConfig.sop.hhm.hazard.history.insert.url
  insertUrl.value = transactionConfig.sop.hhm.hazard.history.insert.url
  updateUrl.value = transactionConfig.sop.hhm.hazard.history.update.url
  deleteUrl.value = transactionConfig.sop.hhm.hazard.history.delete.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.inspectionNo) {
    $http({
      url: $format(getUrl.value, props.popupParam.inspectionNo),
      method: 'GET'
    }).then((_result: any) => {
      resultData.value = _.clone(_result.data)
      attachInfo.value.taskKey = props.popupParam.inspectionNo
    })
  }
}
// function getSplitMethodNames(_testMothodName: any) {
//   return _.split(_testMothodName, ',')
// }
function saveData() {
  if (props.popupParam.inspectionNo) {
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    saveType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          resultData.value.regUserId = user.value.userId
          resultData.value.chgUserId = user.value.userId

          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  attachInfo.value.taskKey = result.data
  attachInfo.value.isSubmit = uid()
  props.popupParam.inspectionNo = result.data
  getDetail()
}
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.inspectionNo),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function dataChange(_data: any) {
  $http({
    url: getNewUrl.value,
    method: 'GET',
    params: {
      machineryClassification: _data.machineryClassification
    }
  }).then((_result: any) => {
    resultData.value.resultList = _result.data
  })
}
function setInspectionName() {
  if (
    resultData.value.hhmHazardousMachineryId &&
    resultData.value.inspectionDate &&
    resultData.value.departmentDeptCd
  ) {
    resultData.value.inspectionName =
      resultData.value.machineryName +
      ' ' +
      resultData.value.departmentDeptName +
      ' (' +
      resultData.value.inspectionDate +
      ')'
  }
}
/******************************
 * TODO (목적): 점검항목 추가
 *******************************/
function addResult() {
  resultData.value.resultList?.splice(0, 0, {
    hazardousMachineryInspectionResultItemId: uid(),
    inspectionNo: props.popupParam.inspectionNo,
    itemName: '',
    itemCriterion: '',
    testMothod: '',
    useEquip: '',
    sortOrder: '',
    inspectionFlag: '',
    inspectionResult: '',
    testResult: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
function removeResult() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!resultData.value.deleteResultList) resultData.value.deleteResultList = []
      if (
        _.findIndex(resultData.value.deleteResultList, {
          hazardousMachineryInspectionResultItemId: item.hazardousMachineryInspectionResultItemId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        resultData.value.deleteResultList.push(item)
      }
      resultData.value.resultList = _.reject(resultData.value.resultList, item)
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
