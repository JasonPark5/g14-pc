<template>
  <div class="row">
    <div class="col-md-12 col-lg-12">
      <q-form ref="editForm">
        <c-card title="연간 KPI 기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && isOld"
                label="삭제"
                icon="delete_forever"
                @btnClicked="remove"
              />
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="kpi"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="save"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                :editable="editable && !isOld"
                label="KPI년도"
                type="year"
                name="year"
                v-model:value="kpi.year"
                @datachange="yearCheck"
              />
            </div>
          </template>
        </c-card>
        <div class="col-lg-12 col-md-12 col-sm-12">
          <c-table
            ref="table"
            class="table_vt_top q-mb-xl"
            title="점검항목 목록"
            :columns="grid.columns"
            :data="kpi.results"
            gridHeightAuto
            :isExcelDown="false"
            :columnSetting="false"
            :usePaging="false"
            :isFullScreen="false"
            :editable="editable"
            rowKey="saiKpiResultId"
            selection="multiple"
            @table-data-change="tableDataChange"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addResult"
                />
                <c-btn
                  v-if="editable && kpi.results!.length > 0"
                  :showLoading="false"
                  label="제외"
                  icon="remove"
                  @btnClicked="removeResult"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </q-form>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>
<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { kpiType } from './kpi'

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
  name: 'kpiDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const route = useRoute()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    saiKpiId: stringNull
    year?: stringNull
  }
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
      saiKpiId: '',
      year: ''
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
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const kpi = ref<kpiType>({
  saiKpiId: '',
  year: '',
  results: [],
  delResults: []
})
const grid = ref<any>({
  columns: [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      type: 'number',
      style: 'width:3%',
      sortable: false,
      fix: true
    },
    {
      required: true,
      name: 'kpi',
      field: 'kpi',
      label: 'KPI',
      style: 'width:12%',
      align: 'left',
      sortable: false,
      type: 'text',
      fix: true
    },
    {
      required: true,
      name: 'definition',
      field: 'definition',
      label: 'Definition',
      // style: 'width:50%',
      align: 'left',
      type: 'textarea',
      sortable: false,
      fix: true
    },
    {
      name: 'month1',
      field: 'month1',
      label: 'Jan',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month2',
      field: 'month2',
      label: 'Feb',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month3',
      field: 'month3',
      label: 'Mar',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month4',
      field: 'month4',
      label: 'Apr',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month5',
      field: 'month5',
      label: 'May',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month6',
      field: 'month6',
      label: 'Jun',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month7',
      field: 'month7',
      label: 'Jul',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month8',
      field: 'month8',
      label: 'Aug',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month9',
      field: 'month9',
      label: 'Sep',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month10',
      field: 'month10',
      label: 'Oct',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month11',
      field: 'month11',
      label: 'Nov',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'month12',
      field: 'month12',
      label: 'Dec',
      style: 'width: 3%',
      align: 'left',
      type: 'number',
      sortable: false
    },
    {
      name: 'sum',
      field: 'sum',
      label: '합계',
      style: 'width: 3%',
      align: 'right',
      type: 'cost',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      style: 'width: 10%',
      align: 'left',
      type: 'textarea',
      sortable: false
    }
  ],
  data: []
})
const saveType = ref('POST')
const isSave = ref(false)
const saveUrl = ref('')
const deleteUrl = ref('')
const getUrl = ref('')
const table = ref<any>(null)
const editForm = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.saiKpiId))
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
  getUrl.value = selectConfig.sai.kpi.get.url
  saveUrl.value = transactionConfig.sai.kpi.insert.url
  deleteUrl.value = transactionConfig.sai.kpi.delete.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  if (props.popupParam.saiKpiId) {
    $http({
      url: getUrl.value,
      method: 'GET',
      params: { saiKpiId: props.popupParam.saiKpiId }
    }).then((_result: any) => {
      kpi.value = _result.data
      emits('setRegInfo', _result.data)
    })
  } else {
    kpi.value.year = getThisYear()
    yearCheck()
  }
}
function yearCheck() {
  $http({
    url: selectConfig.sai.kpi.list.url,
    method: 'GET',
    params: { year: kpi.value.year }
  }).then((_result: any) => {
    if (_result.data.length > 0) {
      message.alert({
        title: '안내',
        message: '해당 년도의 KPI가 이미 존재합니다.',
        type: 'warning' // success / info / warning / error
      })
      kpi.value.year = null
      return
    }
  })
}
function tableDataChange(_props: any) {
  _props.row.sum =
    Number(_props.row.month1 || 0) +
    Number(_props.row.month2 || 0) +
    Number(_props.row.month3 || 0) +
    Number(_props.row.month4 || 0) +
    Number(_props.row.month5 || 0) +
    Number(_props.row.month6 || 0) +
    Number(_props.row.month7 || 0) +
    Number(_props.row.month8 || 0) +
    Number(_props.row.month9 || 0) +
    Number(_props.row.month10 || 0) +
    Number(_props.row.month11 || 0) +
    Number(_props.row.month12 || 0)
}
function save() {
  saveType.value = props.popupParam.saiKpiId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(grid.value.columns, kpi.value.results)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          kpi.value.regUserId = user.value.userId
          kpi.value.chgUserId = user.value.userId
          _.forEach(kpi.value.results, (row: any) => {
            row.regUserId = user.value.userId
            row.chgUserId = user.value.userId
          })
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  if (!isOld.value) props.popupParam.saiKpiId = _result.data
  getDetail()
}
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.saiKpiId),
        method: 'DELETE'
      }).then((_result: any) => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}
function addResult() {
  kpi.value.results?.push({
    saiKpiId: props.popupParam.saiKpiId,
    saiKpiResultId: uid(),
    month1: 0,
    month2: 0,
    month3: 0,
    month4: 0,
    month5: 0,
    month6: 0,
    month7: 0,
    month8: 0,
    month9: 0,
    month10: 0,
    month11: 0,
    month12: 0,
    kpi: '',
    definition: '',
    remark: '',
    sortOrder: kpi.value.results?.length + 1,
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
      if (!kpi.value.delResults) kpi.value.delResults = []
      if (
        _.findIndex(kpi.value.delResults, { saiKpiResultId: item.saiKpiResultId }) === -1 &&
        item.editFlag !== 'C'
      )
        kpi.value.delResults.push(item)
      kpi.value.results = _.reject(kpi.value.results, item)
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
