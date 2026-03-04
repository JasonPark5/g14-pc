<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기본정보" class="cardClassDetailForm">
        <template v-slot:card-description>
          <span style="font-size: 0.9em; font-weight: 500; color: tomato; margin-left: 10px">
            ※
            {{
              $language(
                '배출구 기본정보는 IEPS(통합환경허가시스템)에 등록된 정보와 반드시 일치해야 합니다.'
              )
            }}
          </span>
        </template>
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="infoData"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
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
              v-model:value="infoData.plantCd"
            />
          </div> -->
          <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              label="배출구 관리번호"
              name="envWaterMstPreventiveNo"
              v-model:value="infoData.envWaterMstOutletNo"
            />
          </div> -->
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              label="배출구번호(IEPS)"
              name="envWaterMstPreventiveNo"
              v-model:value="infoData.outletIepsNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :editable="editable"
              label="사업장관리번호(IEPS)"
              name="envWaterMstPreventiveNo"
              v-model:value="infoData.outletIepsPlantMgtNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              :required="true"
              :editable="editable"
              label="배출구명"
              name="envWaterMstPreventiveName"
              v-model:value="infoData.envWaterMstOutletName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-task-target
              :editable="editable"
              label="IEPS 공정"
              name="processCd"
              :customPopupParam="{ targetKey: 'envProcess' }"
              v-model:value="infoData.processCd"
              @dataChange="dataChange"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-text
              readonly
              label="IEPS 공정번호"
              name="processNo"
              v-model:value="infoData.processNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-dept
              type="edit"
              :editable="editable"
              label="관리부서"
              name="deptCd"
              v-model:value="infoData.deptCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-checkbox
              :editable="editable"
              :isFlag="true"
              label="사용여부"
              name="useFlag"
              v-model:value="infoData.useFlag"
            />
          </div>
        </template>
      </c-card>
    </q-form>
    <c-table
      ref="table"
      title="연결 방지시설"
      :columns="grid.columns"
      :data="infoData.preventives"
      :usePaging="false"
      :columnSetting="false"
      :isFullScreen="false"
      :filtering="false"
      :isExcelDown="false"
      selection="multiple"
      rowKey="envWaterMstPreventiveId"
      gridHeight="300px"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addPreventive" />
          <c-btn
            v-if="editable && infoData.preventives.length > 0"
            label="제외"
            icon="remove"
            @btnClicked="removePreventive"
          />
        </q-btn-group>
      </template>
    </c-table>
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
import { waterMasterDataType } from './waterMasterType'
/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'waterOutletDetail'
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
    envWaterMstOutletId: stringNull
  }
}
interface gridType {
  columns: tableColumnType
  data?: Array<waterMasterDataType>
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
      envWaterMstOutletId: ''
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'processNo',
      field: 'processNo',
      label: 'IEPS 공정번호',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'processName',
      field: 'processName',
      label: 'IEPS 공정',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'preventiveIepsPlantMgtNo',
      field: 'preventiveIepsPlantMgtNo',
      label: '사업장관리번호(IEPS)',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'envWaterMstPreventiveName',
      field: 'envWaterMstPreventiveName',
      label: '방지시설명',
      align: 'center',
      style: 'width:200px',
      sortable: true
    }
  ]
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const detailUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const editForm = ref<any>(null)
const editable = ref(true)
const infoData = ref<waterMasterDataType>({
  plantCd: null, // 사업장코드
  envWaterMstOutletId: '', // 수질방지시설 일련번호
  envWaterMstOutletName: '', // 수질방지시설명
  envWaterMstOutletNo: '', // 수질방지시설 관리번호
  outletIepsNo: '',
  outletIepsPlantMgtNo: '',
  processCd: '',
  processNo: '',
  preventives: [],
  deletePreventives: [],
  deptCd: '', // 관리부서 코드
  useFlag: 'Y' // 사용여부
})
const table = ref<any>(null)
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
  detailUrl.value = selectConfig.env.water.mst.outlet.get.url
  saveUrl.value = transactionConfig.env.water.mst.outlet.save.url
  // code setting

  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 정보 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWaterMstOutletId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.envWaterMstOutletId),
      method: 'GET'
    }).then((_result: any) => {
      infoData.value = _result.data
    })
  }
}

/******************************
 * TODO (목적): 공정번호 자동반영
 *******************************/
function dataChange(_data1: any, _data2: any, _data3: any) {
  infoData.value.processNo = _data3.processNo
}

/******************************
 * TODO (목적): 연결 방지시설 추가
 *******************************/
function addPreventive() {
  popupOptions.value = getPopupOptions('waterPreventive', popupOptions.value, closePopup, {
    type: 'multiple'
  })
}

function closePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(infoData.value.preventives, {
          envWaterMstPreventiveId: item.envWaterMstPreventiveId
        }) === -1
      ) {
        infoData.value.preventives!.push({
          envWaterMstOutletId: infoData.value.envWaterMstOutletId,
          envWaterMstPreventiveId: item.envWaterMstPreventiveId,
          processNo: item.processNo,
          processName: item.processName,
          preventiveIepsPlantMgtNo: item.preventiveIepsPlantMgtNo,
          envWaterMstPreventiveName: item.envWaterMstPreventiveName,
          regUserId: item.regUserId,
          editFlag: 'C'
        })
      }
    })
  }
}

/******************************
 * TODO (목적): 연결 방지시설 제외
 *******************************/
function removePreventive() {
  const selectData = table.value.getSelected()

  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!infoData.value.deletePreventives) infoData.value.deletePreventives = []

      if (
        _.findIndex(infoData.value.deletePreventives, {
          envWaterMstPreventiveId: item.envWaterMstPreventiveId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        infoData.value.deletePreventives.push(item)
      }
      infoData.value.preventives = _.reject(infoData.value.preventives, item)
    })
  }
  table.value.compoTable.clearSelection()
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.popupParam.envWaterMstOutletId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: Boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          infoData.value.regUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}

function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.envWaterMstOutletId = result.data
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
