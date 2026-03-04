<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="유해인자 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <q-icon
                  v-if="!popupParam.hazardCd"
                  name="help"
                  color="deep-purple-6"
                  size="sm"
                  style="margin-right: 10px"
                >
                  <q-tooltip
                    anchor="bottom left"
                    self="top left"
                    style="font-size: 0.9em; padding: 10px"
                  >
                    {{ $language('물리적인자 선택 시, Cas No.는 입력할 수 없습니다.') }} <br />
                    {{
                      $language(
                        '화학적인자 선택 시, Cas No.의 돋보기 클릭 시 환경부-화학물질정보에서 선택할 수 있습니다.'
                      )
                    }}
                  </q-tooltip>
                </q-icon>
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="hazFactor"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <c-select
                  required
                  codeGroupCd="HAZARD_CLASS_FST_CD"
                  type="edit"
                  :disabled="updateMode"
                  itemText="codeName"
                  itemValue="code"
                  name="hazardClassFstCd"
                  label="유해인자 대분류"
                  v-model:value="hazFactor.hazardClassFstCd"
                  @update:value="datachangeSelect"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <c-select
                  required
                  :comboItems="occSecItems"
                  :disabled="updateMode"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="hazardClassSecCd"
                  label="유해인자 중분류"
                  v-model:value="hazFactor.hazardClassSecCd"
                />
              </div>
              <!-- { name: 'close', click: true, callbackName: 'removeHazard', color: 'red' } -->
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  label="CAS NO."
                  :disabled="true"
                  name="casNo"
                  :placeholder="
                    hazFactor.hazardClassFstCd === 'HCF0000005' ||
                    hazFactor.hazardClassFstCd === 'HCF0000010'
                      ? ''
                      : '입력할 수 없음'
                  "
                  v-model:value="hazFactor.casNo"
                  :close="false"
                  :afterIcon="
                    hazFactor.hazardClassFstCd === 'HCF0000005' ||
                    hazFactor.hazardClassFstCd === 'HCF0000010'
                      ? [
                          {
                            name: 'search',
                            click: true,
                            callbackName: 'searchPop'
                          },
                          { name: 'close', click: true, callbackName: 'removeHazard' }
                        ]
                      : null
                  "
                  @searchPop="searchPop"
                  @removeHazard="removeHazard"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :editable="editable"
                  :disabled="true"
                  :placeholder="
                    hazFactor.hazardClassFstCd === 'HCF0000005' ||
                    hazFactor.hazardClassFstCd === 'HCF0000010'
                      ? ''
                      : '입력할 수 없음'
                  "
                  label="화학물질명"
                  name="chemName"
                  v-model:value="hazFactor.chemName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  required
                  :editable="editable"
                  label="유해인자명"
                  name="hazardName"
                  v-model:value="hazFactor.hazardName"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <c-text
                  required
                  :editable="editable"
                  :disabled="true"
                  label="유해인자코드"
                  name="hazardCd"
                  v-model:value="data.hazardCd">
                </c-text>
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <c-radio
                  :editable="editable"
                  :comboItems="workFlagItems"
                  label="작업환경관련여부"
                  name="workEnvFlag"
                  v-model:value="hazFactor.workEnvFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <c-select
                  :disabled="hazFactor.workEnvFlag === 'N'"
                  type="edit"
                  codeGroupCd="WORK_MEAS_CYCLE_CD"
                  itemText="codeName"
                  itemValue="code"
                  name="workMeasCycleCd"
                  label="작업환경측정 주기"
                  v-model:value="hazFactor.workMeasCycleCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <c-task-target
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'process' }"
                  label="공정"
                  name="processCd"
                  v-model:value="hazFactor.processCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-1 col-xl-1">
                <c-text
                  :editable="editable"
                  type="number"
                  label="순번"
                  name="sortOrder"
                  v-model:value="hazFactor.sortOrder"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-2 col-xl-2">
                <c-radio
                  :editable="editable"
                  :comboItems="useFlagItems"
                  label="사용여부"
                  name="useFlag"
                  v-model:value="hazFactor.useFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <c-radio
                  :editable="editable"
                  :comboItems="workFlagItems"
                  label="특수건강검진관련여부"
                  name="speHealthFlag"
                  v-model:value="hazFactor.speHealthFlag"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <c-select
                  :disabled="hazFactor.speHealthFlag === 'N'"
                  codeGroupCd="WORK_MEAS_CYCLE_CD"
                  type="edit"
                  itemText="codeName"
                  itemValue="code"
                  name="factorMeasCycleCd"
                  label="특수건강검진 주기"
                  v-model:value="hazFactor.factorMeasCycleCd"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="deptTable"
            title="유해인자 취급부서 목록"
            tableId="deptTable"
            :columns="grid.columns"
            :data="hazFactor.deptList"
            :columnSetting="false"
            selection="multiple"
            :isExcelDown="false"
            rowKey="deptCd"
            :filtering="false"
            :usePaging="false"
            :hideBottom="true"
            gridHeight="305px"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn label="추가" v-if="editable" icon="add" @btnClicked="addrow" />
                <c-btn
                  label="제외"
                  v-if="editable && hazFactor.deptList && hazFactor.deptList.length > 0"
                  icon="remove"
                  @btnClicked="removeRow"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="deptTable"
            title="관련 화학자재 부서 목록"
            tableId="deptTable"
            :columns="grid.columns"
            :data="data.relateDeptList"
            :columnSetting="false"
            selection="multiple"
            :isExcelDown="false"
            rowKey="deptCd"
            :filtering="false"
            :usePaging="false"
            :hideBottom="true"
            gridHeight="305px"
          >
          </c-table>
        </div> -->
        <!-- <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-table
            ref="subsTable"
            title="관련 화학물질 목록"
            tableId="subsTable"
            :columns="gridsubs.columns"
            :data="gridsubs.data"
            :columnSetting="false"
            selection="multiple"
            rowKey="mttrid"
            :filtering="false"
            :usePaging="false"
            :hideBottom="true"
            gridHeight="305px"
          >
            <template v-slot:table-button">
              <q-btn-group outline>
                <q-btn
                  v-if="!popupParam.hazardCd"
                  icon="help"
                  color="deep-purple-6"
                  text-color="white"
                  class="custom-btn"
                  align="center"
                  round>
                  <q-tooltip anchor="bottom left" self="top left">
                    <div class="tooltipCustom">
                    기본정보 저장 후에 추가 및 삭제가 가능합니다.
                    </div>
                  </q-tooltip>
                </q-btn>
                <c-btn label="환경부-화학물질정보 연동 추가" icon="add" v-if="editable && popupParam.hazardCd" @btnClicked="addApiRow" />
                <c-btn label="삭제" v-if="editable && popupParam.hazardCd" icon="remove" @btnClicked="removeRowSubstance" />
              </q-btn-group>
            </template>
          </c-table>
        </div> -->
      </div>
      <c-dialog :param="popupOptions" />
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { workMeasureType } from './workMeasure'

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
  name: 'harmfulFactorsDetail'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    hazardCd?: stringNull
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
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      hazardCd: ''
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
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'deptCd',
      field: 'deptCd',
      label: '부서코드',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
// const gridsubs = ref<gridType>({
//   columns: [
//     {
//       name: 'chemNmKr',
//       field: 'chemNmKr',
//       label: '화학물질명',
//       align: 'left'
//     }
//   ],
//   data: []
// })
const hazFactor = ref<workMeasureType>({
  hazardCd: '',
  hazardName: '',
  hazardClassFstCd: null,
  hazardClassSecCd: null,
  hazardId: '',
  mdmChemMaterialId: '',
  useFlag: 'Y',
  sortOrder: 0,
  casNo: '',
  workEnvFlag: 'Y',
  speHealthFlag: 'Y',
  workMeasCycleCd: null,
  factorMeasCycleCd: null,
  checmName: '',
  regUserId: '',
  chgUserId: '',
  processCd: '',
  deptList: []
})
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const updateMode = ref(false)
const detailUrl = ref('')
const detailDeptUrl = ref('')
const deptDeleteUrl = ref('')
const saveUrl = ref('')
const checkUrl = ref('')
const subListUrl = ref('')
const subSaveUrl = ref('')
const subDeleteUrl = ref('')
const workFlagItems = ref<codeMasterType>([])
const useFlagItems = ref<codeMasterType>([])
const occSecItems = ref<codeMasterType>([])
const editForm = ref<any>(null)
const deptTable = ref<any>(null)

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
  detailUrl.value = selectConfig.sai.hazard.get.url
  detailDeptUrl.value = selectConfig.mdm.mam.chem.dept.url
  checkUrl.value = selectConfig.sai.hazard.check.url
  deptDeleteUrl.value = transactionConfig.mdm.mam.chem.dept.delete.url
  subListUrl.value = selectConfig.sai.hazard.substance.list.url
  subSaveUrl.value = transactionConfig.sai.hazard.substance.save.url
  subDeleteUrl.value = transactionConfig.sai.hazard.substance.delete.url
  saveUrl.value = transactionConfig.sai.hazard.insert.url
  // code setting
  workFlagItems.value = [
    { code: 'Y', codeName: $language('관련') },
    { code: 'N', codeName: $language('무관') }
  ]
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 유해인자 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam?.hazardCd) {
    $http({
      url: $format(detailUrl.value, props.popupParam.hazardCd),
      method: 'GET'
    }).then((_result: any) => {
      hazFactor.value = _.clone(_result.data)
      setSecondItems(_result.data.hazardClassFstCd)
      updateMode.value = true
    })
  }
}
/******************************
 * TODO (목적): 유해인자별 화학물질 목록 조회
 *******************************/
// function getSubstanse() {
//   if (props.popupParam.hazardCd) {
//     $http({
//       url: subListUrl.value,
//       method: 'GET',
//       params: { hazardCd: props.popupParam.hazardCd }
//     }).then((_result: any) => {
//       gridsubs.value.data = _result.data
//     })
//   }
// }
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (props.popupParam.hazardCd) {
    hazFactor.value.chgUserId = user.value.userId
    mappingType.value = 'PUT'
  } else {
    hazFactor.value.regUserId = user.value.userId
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: checkUrl.value,
        method: 'GET',
        params: {
          hazardId: hazFactor.value.hazardId,
          hazardName: hazFactor.value.hazardName
        }
      }).then((_result: any) => {
        if (_result.data > 0 && !updateMode.value) {
          message.alert({
            title: '안내',
            message: '같은 유해인자가 존재합니다.',
            type: 'warning' // success / info / warning / error
          })
          return
        } else {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              isSave.value = !isSave.value
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        }
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.hazardCd = result.data
  getDetail()
}

/******************************
 * TODO (목적): casNo 팝업에서 가져온 데이터로 값 세팅
 *******************************/
function searchPop() {
  popupOptions.value = getPopupOptions('chemBase', popupOptions.value, closeCasPopup, {
    type: 'single'
  })
}
function closeCasPopup(_data: any) {
  const plainData = JSON.parse(JSON.stringify(_data))
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data) {
    hazFactor.value.casNo = plainData[0].casNo
    hazFactor.value.chemName = plainData[0].chemNmKr
    $http({
      url: selectConfig.mdm.mam.chem.factor.regulate.url,
      method: 'GET',
      params: { mdmChemId: plainData[0].mdmChemId }
    }).then((_result: any) => {
      hazFactor.value.workEnvFlag = _result.data[0].D12010005
      hazFactor.value.speHealthFlag = _result.data[0].D12010005
    })
  }
}
/******************************
 * TODO (목적): 유해인자명 삭제, selct 요소 선택시마다 유해인자명 삭제
 *******************************/
function removeHazard() {
  hazFactor.value.hazardCd = ''
  hazFactor.value.hazardName = ''
  hazFactor.value.mdmChemMaterialId = ''
  hazFactor.value.casNo = ''
  hazFactor.value.checmName = ''
  hazFactor.value.hazardClassSecCd = null
  setSecondItems(hazFactor.value.hazardClassFstCd)
}
function datachangeSelect() {
  removeHazard()
}
/******************************
 * TODO (목적): 대분류코드로 중분류 아이템 가져옴
 *******************************/
function setSecondItems(hazardClassFstCd: stringNull) {
  $http({
    url: $format(selectConfig.sys.code.mst.list.attr.url, 'HAZARD_CLASS_SEC_CD', hazardClassFstCd),
    method: 'GET',
    params: { srchUseFlag: 'Y' }
  }).then((_result: any) => {
    occSecItems.value = []
    _.forEach(_result.data, (_item) => {
      occSecItems.value.push({
        code: _item.code,
        codeName: _item.codeName
      })
    })
  })
}
/******************************
 * TODO (목적): 관련부서 추가
 *******************************/
function addrow() {
  popupOptions.value = getPopupOptions('dept', popupOptions.value, closeDept, {
    type: 'multiple'
  })
}
function closeDept(result: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.length > 0) {
    _.forEach(result, (item) => {
      if (_.findIndex(hazFactor.value.deptList, { deptCd: item.deptCd }) === -1) {
        hazFactor.value.deptList?.push({
          mdmChemMaterialId: hazFactor.value.mdmChemMaterialId,
          hazardCd: props.popupParam.hazardCd,
          plantCd: item.plantCd,
          plantName: item.plantName,
          deptCd: item.deptCd,
          deptName: item.deptName,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 관련부서 삭제
 *******************************/
function removeRow() {
  const selectData = deptTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      hazFactor.value.deptList = _.reject(hazFactor.value.deptList, item)
    })
  }
}
</script>
