<template>
  <q-form ref="editForm">
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="dangerStore"
            :mappingType="saveType"
            label="저장"
            icon="save"
            @beforeAction="saveMst"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-select
            required
            :editable="editable"
            type="edit"
            codeGroupCd="CHM_DANGER_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="chmDangerTypeCd"
            label="구분"
            v-model:value="dangerStore.chmDangerTypeCd"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-text
            required
            :editable="editable"
            label="위험물저장소명"
            name="chmDangerArea"
            v-model:value="dangerStore.chmDangerArea"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-text
            :editable="editable"
            :disabled="true"
            label="품명 표기"
            name="chmDangerMstName"
            v-model:value="dangerStore.chmDangerMstName"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            :required="true"
            :editable="editable"
            label="설치허가일"
            name="installPermitDate"
            v-model:value="dangerStore.installPermitDate"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            label="허가번호"
            name="permitNo"
            v-model:value="dangerStore.permitNo"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-multi-field
            :editable="editable"
            :data="dangerStore"
            label="안전관리자"
            type="user"
            name="chmDangerManageUserId"
            v-model:value="dangerStore.chmDangerManageUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-multi-field
            :editable="editable"
            :data="dangerStore"
            label="담당자"
            type="user"
            name="chmDangerUserId"
            v-model:value="dangerStore.chmDangerUserId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-multi-field
            :editable="editable"
            :data="dangerStore"
            label="안전대리자"
            type="user"
            name="chmDangerSafetyUserId"
            v-model:value="dangerStore.chmDangerSafetyUserId"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="false"
            label="지정수량배수 (품목별 배수의 합계)"
            name="chmDangerCount"
            type="number"
            v-model:value="dangerStore.chmDangerCount"
          />
        </div>
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-text
            :editable="editable"
            label="주용도"
            name="chmDangerMainUse"
            v-model:value="dangerStore.chmDangerMainUse"
          />
        </div>
        <!-- <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            required
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="dangerStore.plantCd"
          />
        </div> -->
        <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
          <c-checkbox
            :editable="editable"
            :isFlag="true"
            label="사용여부"
            name="useFlag"
            v-model:value="dangerStore.useFlag"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="table"
      title="저장품목"
      :columns="gridType.columns"
      :gridHeight="gridHeight"
      :data="dangerStore.typeList"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      noDataLabel="저장품목을 추가하세요."
      :editable="editable"
      rowKey="chmDangerMstTypeId"
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
            @btnClicked="addType"
          />
          <c-btn
            v-if="editable && dangerStore.typeList!.length > 0"
            :showLoading="false"
            label="제외"
            icon="remove"
            @btnClicked="removeType"
          />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'calcuMethod'">
          {{ toThousandFilter(Number(props.row.calcuOriginal) * Number(props.row.calcuMultiple)) }}
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
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
import { dangerStorageType } from './dangerStorage'
import { toThousandFilter } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerMasterInfo'
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
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    chmDangerMstId?: stringNull
  }
  contentHeight?: stringNull
  isOld?: boolean
  dangerStore?: dangerStorageType
}
interface gridTypes {
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
      chmDangerMstId: ''
    }
  },
  dangerStore: () => {
    return {
      chmDangerMstId: '',
      plantCd: '',
      chmDangerArea: '',
      chmDangerManageUserId: '',
      chmDangerMstName: '',
      chmDangerUserId: '',
      chmDangerSafetyUserId: '',
      chmDangerCount: '',
      chmDangerMainUse: '',
      installPermitDate: '',
      permitNo: '',
      useFlag: 'Y',
      chmDangerTypeCd: null,
      typeList: [],
      deleteTypeList: [],
      itemList: [],
      fireFightings: []
    }
  },
  isOld: false,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const gridType = ref<gridTypes>({
  columns: [
    {
      required: true,
      name: 'dangerItemName',
      field: 'dangerItemName',
      label: '품목',
      style: 'width:300px',
      align: 'left',
      sortable: false
    },
    {
      required: true,
      name: 'chmDangerTypeName',
      field: 'chmDangerTypeName',
      label: '품목명',
      style: 'width:200px',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      style: 'width:150px',
      align: 'center',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      name: 'calcuOriginal',
      field: 'calcuOriginal',
      label: '품목별 지정수량 (L/KG)',
      style: 'width:150px',
      type: 'number',
      sortable: false
    },
    {
      required: true,
      name: 'calcuMultiple',
      field: 'calcuMultiple',
      label: '배수(사업장 허가)',
      style: 'width:150px',
      type: 'number',
      sortable: false
    },
    {
      name: 'calcuMethod',
      field: 'calcuMethod',
      label: '적용 지정수량 (L/KG)',
      style: 'width:150px',
      type: 'custom',
      sortable: false
    }
  ],
  data: [],
  height: '300px'
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '70%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const isSave = ref(false)
const saveType = ref('POST')
const saveUrl = ref('')
const editForm = ref<any>(null)
const table = ref<any>(null)
const useFlagItems = ref<Array<codeMasterType>>([])

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 320 + 'px' : '300px'
)
const multiSum = computed(() =>
  props.dangerStore.typeList?.reduce((sum, item) => sum + Number(item.calcuMultiple), 0)
)
const totalName = computed(() => {
  if (
    props.dangerStore.typeList!.length > 0 &&
    props.dangerStore.typeList!.filter((item) => item.chmDangerTypeName.length > 0).length ===
      props.dangerStore.typeList!.length
  ) {
    return props.dangerStore.typeList
      ?.map((item) => `${item.dangerItemName}/${item.chmDangerTypeName}`)
      .join(', ')
  } else return ''
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => multiSum.value,
  () => {
    props.dangerStore.chmDangerCount = multiSum.value
  }
)
watch(
  () => totalName.value,
  () => {
    props.dangerStore.chmDangerMstName = totalName.value
  }
)

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
  saveUrl.value = transactionConfig.chm.danger.master.update.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
}
/******************************
 * TODO (목적): 저장품목 추가
 *******************************/
function addType() {
  popupOptions.value = getPopupOptions('dangerItem', popupOptions.value, closeItem, {
    type: 'multiple'
  })
}
function closeItem(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  // let _chmDangerMstName = ''
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      props.dangerStore.typeList!.push({
        chmDangerMstId: props.popupParam.chmDangerMstId,
        chmDangerMstTypeId: uid(),
        chmDangerTypeName: '',
        chmDangerItemId: item.chmDangerItemId,
        dangerItemName: item.regulatedItemName + ' - ' + item.dangerItemName,
        casNo: '',
        calcuMethod: item.quantity,
        calcuOriginal: item.quantity,
        calcuMultiple: 1,
        regUserId: user.value.userId,
        editFlag: 'C'
      })
      // _chmDangerMstName +=
      //   (_chmDangerMstName === '' ? '' : ',') +
      //   item.regulatedItemName +
      //   item.dangerItemName.split('.')[1]
    })
  }
  // if (!props.dangerStore.chmDangerMstName) props.dangerStore.chmDangerMstName = _chmDangerMstName
}
/******************************
 * TODO (목적): 저장품목 제외
 *******************************/
function removeType() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.dangerStore.deleteTypeList) props.dangerStore.deleteTypeList = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.dangerStore.deleteTypeList, {
          chmDangerMstTypeId: item.chmDangerMstTypeId
        }) === -1
      )
        props.dangerStore.deleteTypeList!.push(item)
      props.dangerStore.typeList = _.reject(props.dangerStore.typeList, item)
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveMst() {
  saveType.value = props.isOld ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result && validTable(gridType.value.columns, props.dangerStore.typeList!)) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.dangerStore.regUserId = user.value.userId
          props.dangerStore.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.chmDangerMstId = _result.data
  emits('getDetail')
}

function tableDataChange(_props: any) {
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
