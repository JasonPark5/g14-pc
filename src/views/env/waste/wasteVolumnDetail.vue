<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && popupParam.envWasteVolumeId"
                  label="삭제"
                  icon="remove"
                  @btnClicked="deleteData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="wasteVolume"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-datepicker
                  :required="true"
                  :editable="editable && !popupParam.envWasteVolumeId"
                  type="month"
                  label="기준월"
                  default="today"
                  name="wasteYm"
                  v-model:value="wasteVolume.wasteYm"
                  @datachange="datachange"
                />
              </div>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <c-plant
                  :editable="editable && !popupParam.envWasteVolumeId"
                  :required="true"
                  type="edit"
                  name="plantCd"
                  v-model:value="wasteVolume.plantCd"
                  @datachange="getEmptyList2"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-field
                  :required="true"
                  :editable="editable && !popupParam.envWasteVolumeId"
                  :data="wasteVolume"
                  deptValue="deptCd"
                  type="dept_user"
                  label="작성부서 & 작성자"
                  name="userId"
                  v-model:value="wasteVolume.userId"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  type="number"
                  :required="true"
                  :editable="editable"
                  label="운반횟수"
                  name="wasteTransport"
                  v-model:value="wasteVolume.wasteTransport"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <c-text
                  suffix="톤"
                  type="number"
                  :required="true"
                  :editable="editable"
                  label="생산량"
                  name="salesVolume"
                  v-model:value="wasteVolume.salesVolume"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="폐기물 발생량"
            :columns="grid.columns"
            :gridHeight="grid.height"
            :data="grid.data"
            :columnSetting="false"
            :isFullScreen="false"
            :usePaging="false"
            :expandAll="true"
            :hideBottom="true"
            :filtering="false"
            :isExcelDown="false"
            @table-data-change="tableDataChange"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { wasteVolumeType } from './waste'

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
  name: 'wasteVolumnDetail'
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
    envWasteVolumeId?: stringNull
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
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      envWasteVolumeId: ''
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
const wasteVolume = ref<wasteVolumeType>({
  envWasteVolumeId: '', // 월별 폐기물 일련번호
  plantCd: null, // 사업장코드
  wasteYear: '', // 처리년도
  wasteMonth: '', // 처리월
  wasteTransport: null, // 폐기물 운반횟수
  salesVolume: null, // 생산량
  wasteOccurVolume: null,
  wasteCost: null,
  occurs: [], // 폐기물종류별 발생량,
  userId: '',
  wasteYm: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'envWasteName',
      field: 'envWasteName',
      label: '폐기물명',
      align: 'center',
      style: 'width:20%',
      sortable: false
    },
    {
      name: 'occurVolume',
      field: 'occurVolume',
      type: 'number',
      label: '폐기물 처리량(톤)',
      align: 'center',
      style: 'width:20%',
      sortable: false
    },
    {
      required: true,
      name: 'processUnitPrice',
      field: 'processUnitPrice',
      label: '처리단가(원)',
      align: 'center',
      style: 'width:20%',
      sortable: true,
      type: 'number'
    },
    {
      required: true,
      name: 'processCost',
      field: 'processCost',
      label: '처리비용(원)',
      align: 'center',
      style: 'width:20%',
      sortable: true,
      type: 'cost'
    },
    {
      name: 'comment',
      field: 'comment',
      label: '비고',
      align: 'center',
      style: 'width:20%',
      sortable: false,
      type: 'text'
    }
  ],
  data: [],
  height: '500px'
})
const saveUrl = ref(transactionConfig.env.waste.volume.insert.url)
const mappingType = ref('POST')
const editable = ref(true)
const isSave = ref(false)
const updateMode = ref(false)
const detailUrl = ref('')
const deleteUrl = ref('')
const checkUrl = ref('')
const emptylUrl = ref('')
const editForm = ref<any>(null)
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
  detailUrl.value = selectConfig.env.waste.volume.get.url
  emptylUrl.value = selectConfig.env.waste.volume.empty.url
  checkUrl.value = selectConfig.env.waste.volume.check.url
  deleteUrl.value = transactionConfig.env.waste.volume.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWasteVolumeId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envWasteVolumeId: props.popupParam.envWasteVolumeId }
    }).then((_result: any) => {
      wasteVolume.value = _result.data
      updateMode.value = true
      grid.value.data = _result.data.occurs
    })
  } else {
    getEmptyList()
    wasteVolume.value.userId = user.value.userId
  }
}
/******************************
 * TODO (목적): 테이블 목록 조회
 *******************************/
function getEmptyList() {
  $http({
    url: emptylUrl.value,
    method: 'GET',
    params: { plantCd: wasteVolume.value.plantCd, wasteYm: wasteVolume.value.wasteYm }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })

  //생산량조회(IEPS운영데이터-제품생산량)
  $http({
    url: selectConfig.env.ieps.product.list.url,
    method: 'GET',
    params: { plantCd: wasteVolume.value.plantCd, usageMonth: wasteVolume.value.wasteYm }
  }).then((_result: any) => {
    wasteVolume.value.salesVolume =
      _result.data && _result.data.length > 0 ? _result.data[0].productVolume : 0
  })
}
/******************************
 * TODO (목적): 기준월 데이터 변경 시 처리단가, 생산량 재조회
 * @param (1): _props
 *******************************/
function datachange() {
  getEmptyList()
}
/******************************
 * TODO (목적): 데이터 변경 시 처리비용 계산
 * @param (1): 행 전체 정보
 * @param (2): 컬럼 정보
 *******************************/
function tableDataChange(_props: any, _col: tableColumnType) {
  if (_col.name === 'occurVolume' || _col.name === 'processUnitPrice') {
    const occurVolume = parseFloat(_props.row['occurVolume'])
    const processUnitPrice = parseFloat(_props.row['processUnitPrice'])

    if (!isNaN(occurVolume) && !isNaN(processUnitPrice)) {
      _props.row['processCost'] = parseFloat((occurVolume * processUnitPrice).toFixed(2))
    }
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.popupParam.envWasteVolumeId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      $http({
        url: checkUrl.value,
        method: 'GET',
        params: {
          plantCd: wasteVolume.value.plantCd,
          wasteYear: wasteVolume.value.wasteYm.split('-')[0],
          wasteMonth: wasteVolume.value.wasteYm.split('-')[1]
        }
      }).then((_result: any) => {
        if (updateMode.value || _result.data === 0) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            confirmCallback: () => {
              wasteVolume.value.wasteYear = wasteVolume.value.wasteYm.split('-')[0]
              wasteVolume.value.wasteMonth = wasteVolume.value.wasteYm.split('-')[1]
              wasteVolume.value.regUserId = user.value.userId
              wasteVolume.value.chgUserId = user.value.userId
              const _saveData = grid.value.data!.filter(
                (x) => x.editFlag == 'C' || x.editFlag == 'U'
              )
              _.forEach(_saveData, (item) => {
                item.envWasteVolumeId = wasteVolume.value.envWasteVolumeId
                item.regUserId = user.value.userId
                item.chgUserId = user.value.userId
                item.wasteYear = wasteVolume.value.wasteYm.split('-')[0]
                item.wasteMonth = wasteVolume.value.wasteYm.split('-')[1]
              })
              wasteVolume.value.occurs = _saveData
              isSave.value = !isSave.value
            },
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message:
              $language('동일한 년월에 데이터가 존재합니다.') + ' : ' + wasteVolume.value.wasteYm,
            type: 'warning' // success / info / warning / error
          })
          return
        }
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  props.popupParam.envWasteVolumeId = result.data.envWasteVolumeId
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.envWasteVolumeId),
        method: 'DELETE'
      }).then(() => {
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
