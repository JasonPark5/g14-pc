<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="facilityData"
                  :mappingType="saveType"
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
                  label="배출시설코드"
                  name="facilityCode"
                  v-model:value="facilityData.facilityCode"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  type="edit"
                  :required="true"
                  :editable="editable"
                  codeGroupCd="ENV_GAS_MST_DISCHARGE_CD"
                  itemText="codeName"
                  itemValue="code"
                  label="배출형태"
                  name="facilityTypeCd"
                  v-model:value="facilityData.facilityTypeCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-text
                  :required="true"
                  :editable="editable"
                  label="배출시설명"
                  name="facilityName"
                  v-model:value="facilityData.facilityName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  type="edit"
                  label="공장"
                  :editable="editable"
                  codeGroupCd="ENV_GAS_PLANT_CD"
                  itemText="codeName"
                  itemValue="code"
                  name="processCd"
                  v-model:value="facilityData.processCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-dept
                  type="edit"
                  :editable="editable"
                  label="부서"
                  name="deptCd"
                  :isFirstValue="false"
                  v-model:value="facilityData.deptCd"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-select
                  required
                  :editable="editable"
                  :comboItems="useFlagItems"
                  label="사용여부"
                  itemText="codeName"
                  itemValue="code"
                  name="useFlag"
                  type="search"
                  v-model:value="facilityData.useFlag"
                />
              </div>
            </template>
          </c-card>
        </div>
      </div>
      <c-table
        ref="table"
        title="배출원(연료) 목록"
        :columns="grid.columns"
        gridHeight="700px"
        :data="facilityData.fuelList"
        :editable="editable"
        :columnSetting="false"
        :isFullScreen="false"
        :usePaging="false"
        :expandAll="true"
        selection="multiple"
        rowKey="envGhgFacilityFuelId"
        @innerBtnClicked="innerBtnClicked"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addData" />
            <c-btn v-if="editable" label="제외" icon="remove" @btnClicked="removeData" />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'equipmentName'">
            <c-text-column
              :editable="editable"
              :col="col"
              :props="props"
              v-model:value="props.row[col.name]"
              @datachange="datachange(props, col)"
            />
            <div v-if="editable">
              <q-btn-group outline class="ColumInnerBtnGroup">
                <q-btn
                  icon="add"
                  color="green"
                  text-color="white"
                  class="ColumInnerBtn"
                  align="center"
                  @click.prevent="innerBtnClicked(col, props)"
                >
                  <q-tooltip>
                    {{ $language('항목추가') }}
                  </q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>
          </template>
        </template>
      </c-table>
    </q-form>
    <c-dialog :param="popupOptions" />
  </div>
</template>
<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { dischargeFacilityType, dischargeFacilityFuelType } from './dischargeFacility'

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
  name: 'dischargeFacilityDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface gridType {
  merge?: Array<tableMergeType>
  columns?: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}
interface propType {
  popupParam: any
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
      envGhgFacilityId: ''
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const facilityData = ref<dischargeFacilityType>({
  plantCd: '', // 사업장코드
  envGhgFacilityId: '', // 온실가스 일련번호
  facilityTypeCd: '', // 배출형태
  facilityCode: '',
  facilityName: '', // 배출시설명
  processCd: '', // 공장
  deptCd: '', // 부서
  useFlag: 'Y', // 사용여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  fuelList: [],
  deleteFuelList: []
})
const saveUrl = ref()
const insertUrl = ref()
const updateUrl = ref()
const getUrl = ref('')
const saveType = ref('POST')
const isSave = ref(false)
const editable = ref(true)
const editForm = ref<any>(null)
const table = ref<any>(null)
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'equipmentCode',
      field: 'equipmentCode',
      label: '설비코드',
      align: 'left',
      style: 'width: 100px',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      name: 'equipmentName',
      field: 'equipmentName',
      label: '설비명',
      align: 'left',
      style: 'width: 500px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '정렬순서',
      align: 'center',
      sortable: false,
      style: 'width:60px',
      type: 'number'
    },
    {
      name: 'rawFuelName',
      field: 'rawFuelName',
      label: '배출원(연료)명',
      align: 'center',
      style: 'width: 140px',
      sortable: false
    },
    {
      name: 'rawFuelTypeName',
      field: 'rawFuelTypeName',
      label: '단위',
      align: 'center',
      style: 'width: 140px',
      sortable: false
    }
  ],
  data: [],
  height: '400px'
})
const useFlagItems = ref<Array<codeMasterType>>([])

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
  getUrl.value = selectConfig.env.ghg.facility.get.url
  saveUrl.value = transactionConfig.env.ghg.facility.insert.url
  insertUrl.value = transactionConfig.env.ghg.facility.insert.url
  updateUrl.value = transactionConfig.env.ghg.facility.update.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 배출시설 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envGhgFacilityId) {
    $http({
      url: $format(getUrl.value, props.popupParam.envGhgFacilityId),
      method: 'GET'
    }).then((_result: any) => {
      facilityData.value = _result.data
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  }
}
/******************************
 * TODO (목적): 연료 추가
 *******************************/
function addData() {
  popupOptions.value = getPopupOptions('ghgFuel', popupOptions.value, closePopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: { useFlag: 'Y' }
  })
}
/******************************
 * TODO (목적): 연료 팝업 닫기 콜백
 *******************************/
function closePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      facilityData.value.fuelList!.push({
        envGhgFacilityFuelId: uid(),
        envGhgFacilityId: '',
        envGhgRawFuelId: _item.envGhgRawFuelId,
        equipmentCode: '',
        equipmentName: '',
        rawFuelName: _item.rawFuelName,
        rawFuelTypeName: _item.rawFuelTypeName,
        sortOrder: 1, // 순번
        regUserId: user.value.userId,
        editFlag: 'C'
      })
    })
  }
}
/******************************
 * TODO (목적): 추가 버튼 클릭
 * @param (1): 컬럼 정보
 * @param (2): 행 전체 정보
 *******************************/
function innerBtnClicked(col: tableColumnType, _props: any) {
  facilityData.value.fuelList!.splice(_props.rowIndex + 1, 0, {
    envGhgFacilityFuelId: uid(),
    envGhgFacilityId: _props.row.envGhgFacilityId,
    envGhgRawFuelId: _props.row.envGhgRawFuelId,
    equipmentCode: _props.row.equipmentCode,
    equipmentName: _props.row.equipmentName,
    rawFuelName: _props.row.rawFuelName,
    rawFuelTypeName: _props.row.rawFuelTypeName,
    sortOrder: _props.rowIndex + 2, // 순번
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 연료 제외
 *******************************/
function removeData() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!facilityData.value.deleteFuelList) facilityData.value.deleteFuelList = []
    _.forEach(selectData, (item) => {
      if (
        _.findIndex(facilityData.value.deleteFuelList, {
          envGhgFacilityFuelId: item.envGhgFacilityFuelId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        facilityData.value.deleteFuelList?.push(item)
      }
      facilityData.value.fuelList = _.reject(facilityData.value.fuelList, item)
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveData() {
  if (facilityData.value.envGhgFacilityId) {
    facilityData.value.chgUserId = user.value.userId
    saveUrl.value = updateUrl.value
    saveType.value = 'PUT'
  } else {
    facilityData.value.regUserId = user.value.userId
    saveUrl.value = insertUrl.value
    saveType.value = 'POST'
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
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.envGhgFacilityId = _result.data
  getDetail()
}
/******************************
 * TODO (목적): 테이블 내 input 값 변경시 editFlag 변경
 *******************************/
function datachange(_props: any, _col: any) {
  if (_props.row.editFlag !== 'C') {
    _props.row.editFlag = 'U'
    _props.row.chgUserId = user.value.userId
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
