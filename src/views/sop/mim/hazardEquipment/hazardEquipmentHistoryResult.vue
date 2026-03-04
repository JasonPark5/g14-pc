<template>
  <div>
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12">
        <c-table
          ref="table"
          title="필수항목 목록"
          :columns="grid.columns"
          :gridHeight="grid.height"
          :data="data.rsltItemModelList"
          :filtering="false"
          :isExcelDown="false"
          :columnSetting="false"
          :usePaging="false"
          :editable="editable"
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
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && data.rsltItemModelList.length > 0"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="data.rsltItemModelList"
                mappingType="POST"
                label="저장"
                icon="save"
                @beforeAction="save"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props }">
            <template v-if="props.row.testMothod">
              <q-chip
                v-for="(name, index) in getSplitMethodNames(props.row.testMothodName)"
                :key="index"
                outline
                square
                color="orange"
                text-color="white"
                class="q-ma-none"
              >
                {{ name + ' ' }}
              </q-chip>
            </template>
          </template>
        </c-table>
      </div>
    </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardEquipmentHistoryResult'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    hhmHazardousMachineryId: stringNull
    inspectionNo: stringNull
    machineryClassification: stringNull
  }
}
interface gridType {
  columns: tableColumnType
  height: stringNull
  data: Array<any>
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
      hhmHazardousMachineryId: '',
      inspectionNo: '',
      machineryClassification: ''
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
const data = ref<any>({
  hhmHazardousMachineryId: null,
  inspectionResultCd: null,
  inspTgtModelList: [],
  rsltItemModelList: [],
  rsltMngModelList: []
})
const getUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const grid = ref<gridType>({
  columns: [
    {
      name: 'itemName',
      field: 'itemName',
      label: '검사항목',
      style: 'width:150px',
      align: 'center',
      sortable: false
    },
    {
      name: 'itemCriterion',
      field: 'itemCriterion',
      label: '판정기준',
      style: 'width:400px',
      align: 'left',
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
      type: 'custom',
      sortable: false
    },
    {
      name: 'useEquip',
      field: 'useEquip',
      label: '활용장비',
      align: 'center',
      style: 'width:120px',
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
      sortable: false
    }
  ],
  data: [],
  height: '850px'
})
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
  getUrl.value = selectConfig.sop.hhm.hazard.hazardHistory.result.get.url
  saveUrl.value = transactionConfig.sop.hhm.hazard.hazardHistory.result.save2.url
  // code setting
  // list setting
  getDetail()
}
function getSplitMethodNames(_testMothodName: any) {
  return _.split(_testMothodName, ',')
}
function getDetail() {
  if (props.popupParam.inspectionNo) {
    $http({
      url: $format(
        getUrl.value,
        props.popupParam.inspectionNo,
        props.popupParam.machineryClassification
      ),
      method: 'GET'
    }).then((_result: any) => {
      data.value = _.clone(_result.data)
    })
  }
}
function save() {
  if (validTable(grid.value.columns, data.value.rsltItemModelList)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        _.forEach(data.value.rsltItemModelList, (_item) => {
          _item.inspectionNo = props.popupParam.inspectionNo
          _item.regUserId = user.value.userId
          _item.chgUserId = user.value.userId
        })
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
