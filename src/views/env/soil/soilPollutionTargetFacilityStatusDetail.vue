<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <q-form ref="editForm">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="facilityData"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
                <c-btn
                  v-show="editable && isOld"
                  label="삭제"
                  :editable="editable"
                  icon="delete_forever"
                  @btnClicked="removeInfo"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  :required="true"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="facilityData.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-select
                  :required="true"
                  type="edit"
                  :editable="editable"
                  codeGroupCd="SOIL_POLLUTION_FACILITY_TYPE_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="시설유형"
                  name="facilityTypeCd"
                  v-model:value="facilityData.facilityTypeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="시설명"
                  name="outletName"
                  v-model:value="facilityData.facilityName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  :editable="editable"
                  label="비고"
                  name="remark"
                  :rows="5"
                  v-model:value="facilityData.remark"
                />
              </div>
            </template>
          </c-card>
        </q-form>
      </div>
    </div>
    <div>
      <c-table
        ref="table"
        title="신고필증 이력 목록"
        :columns="grid.columns"
        :data="facilityData.historyList"
        :usePaging="false"
        :columnSetting="false"
        :isFullScreen="false"
        :filtering="false"
        :isExcelDown="false"
        :gridHeight="gridHeight"
        selection="multiple"
        rowKey="envSoilPollutionTargetFacilityHistoryId"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn label="추가" icon="add" @btnClicked="addrow" />
            <c-btn
              label="제외"
              v-if="editable && facilityData.historyList!.length > 0"
              icon="remove"
              @btnClicked="removeRow"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { safetyHealthDutyInspectionType } from './soilPollutionTargetFacility'

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
  name: 'airOutletDetail'
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
const emits = defineEmits(['insertOutletInfo', 'closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    envSoilPollutionTargetFacilityId?: stringNull
  }
  contentHeight?: stringNull
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
      envSoilPollutionTargetFacilityId: ''
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
const facilityData = ref<safetyHealthDutyInspectionType>({
  envSoilPollutionTargetFacilityId: '', // 토양오염측정일지 일련번호
  plantCd: '', // 사업장
  facilityName: '', // 시설명
  facilityTypeCd: '', // 시설유형
  remark: '', // 비고
  historyList: [],
  deleteHistoryList: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '50%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'historyDate',
      field: 'historyDate',
      label: '신고일',
      align: 'center',
      type: 'date',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      style: 'width:500px',
      type: 'textarea',
      align: 'left',
      sortable: false
    },
    {
      name: 'attach',
      field: 'attach',
      label: '신고필증',
      align: 'center',
      style: 'width:160px',
      type: 'attach',
      taskClassCd: 'POLLUTION_TARGET_FACILITY_CERTIFICATE',
      keyText: 'envSoilPollutionTargetFacilityHistoryId',
      sortable: false
    }
  ]
})
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const detailUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const saveUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 350
      : 540
  if (height < 540) {
    height = 540
  }
  return `${String(height)}px`
})
const isOld = computed(() => {
  return Boolean(props.popupParam.envSoilPollutionTargetFacilityId)
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
  detailUrl.value = selectConfig.env.soil.facility.get.url
  saveUrl.value = transactionConfig.env.soil.facility.insert.url
  insertUrl.value = transactionConfig.env.soil.facility.insert.url
  updateUrl.value = transactionConfig.env.soil.facility.update.url
  deleteUrl.value = transactionConfig.env.soil.facility.delete.url
  // code setting
  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envSoilPollutionTargetFacilityId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.envSoilPollutionTargetFacilityId),
      method: 'GET'
    }).then((_result: any) => {
      facilityData.value = _result.data
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.envSoilPollutionTargetFacilityId) {
    mappingType.value = 'PUT'
    saveUrl.value = updateUrl.value
    facilityData.value.chgUserId = user.value.userId
  } else {
    mappingType.value = 'POST'
    facilityData.value.regUserId = user.value.userId
    saveUrl.value = insertUrl.value
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
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
  props.popupParam.envSoilPollutionTargetFacilityId = result.data
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addrow() {
  facilityData.value.historyList?.splice(0, 0, {
    envSoilPollutionTargetFacilityHistoryId: uid(), // 토양오염측정일지 이력 일련번호
    envSoilPollutionTargetFacilityId: props.popupParam.envSoilPollutionTargetFacilityId, // 토양오염측정일지 일련번호
    historyDate: '', // 이력일
    remark: '', // 비고
    regUserId: user.value.userId, // 작성자
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 행 삭제
 *******************************/
function removeRow() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!facilityData.value.deleteHistoryList) facilityData.value.deleteHistoryList = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(facilityData.value.deleteHistoryList, {
          envSoilPollutionTargetFacilityHistoryId: item.envSoilPollutionTargetFacilityHistoryId
        }) === -1
      )
        facilityData.value.deleteHistoryList!.push(item)
      facilityData.value.historyList = _.reject(facilityData.value.historyList, item)
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): TBM 삭제
 *******************************/
function removeInfo() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.envSoilPollutionTargetFacilityId),
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
