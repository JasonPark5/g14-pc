<template>
  <q-form ref="editForm">
    <c-card title="추가정보" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div class="col-12 col-md-4">
          <c-task-target
            :editable="editable"
            :disabled="true"
            label="위험물저장소"
            name="chmDangerMstId"
            :customPopupParam="{ targetKey: 'hazardStorage' }"
            v-model:value="check.chmDangerMstId"
            @dataChange="dataChange"
          />
        </div>
        <div class="col-12 col-md-4">
          <c-multi-field
            :editable="editable"
            :data="check"
            :disabled="true"
            label="안전관리자"
            type="user"
            name="chmDangerManageUserId"
            v-model:value="check.chmDangerManageUserId"
          />
        </div>
        <div class="col-12 col-md-4">
          <c-multi-field
            :editable="editable"
            :data="check"
            :disabled="true"
            label="담당자"
            type="user"
            name="chmDangerUserId"
            v-model:value="check.chmDangerUserId"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="tableType"
      title="저장품목"
      :columns="grid2.columns"
      gridHeight="650px"
      :data="check.checkitems"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      noDataLabel="저장품목을 추가하세요."
      rowKey="chmDangerRegularCheckItemId"
    >
      <!-- <template slot="table-button">
        <q-btn-group outline>
          <c-btn v-if="editable" :showLoading="false" label="추가" icon="add" @btnClicked="addType" />
          <c-btn v-if="editable && check.types && check.types.length > 0" :showLoading="false" label="제외" icon="remove" @btnClicked="removeType" />
        </q-btn-group>
      </template> -->
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
import { dangerCheckType } from './dangerStorage'
import { toThousandFilter } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerRegularCheckInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
    chmDangerRegularCheckId?: stringNull
    chmDangerMstTypeId?: stringNull
    chmStatusDangerRegularCheckCd?: stringNull
  }
  contentHeight?: stringNull
  check: dangerCheckType
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
  contentHeight: null,
  popupParam: () => {
    return {
      chmDangerRegularCheckId: '',
      chmStatusDangerRegularCheckCd: '',
      chmDangerMstTypeId: ''
    }
  },
  check: () => {
    return {
      chmDangerRegularCheckId: '',
      chmDangerMstId: '',
      chmDangerMstTypeId: '',
      plantCd: '',
      chmDangerTypeCd: null,
      chmDangerLocation: '',
      chmDangerCheckName: '',
      chmDangerPermitNo: '',
      chmDangerUserId: '',
      chmDangerManageUserId: '',
      chmDangerSafetyUserId: '',
      chmDangerInspectorUserId: '',
      chmStatusDangerRegularCheckCd: '',
      chmDangerCount: '',
      installPermitDate: '',
      chmDangerHandlingOverview: '',
      chmDangerStartDate: '',
      chmDangerEndDate: '',
      checkitems: [],
      deletecheckitems: [],
      period: [],
      checkResults: [],
      deleteCheckResults: [],
      types: []
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
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'dangerItemName',
      field: 'dangerItemName',
      label: '품목',
      style: 'width:300px',
      align: 'left',
      sortable: false
    },
    {
      name: 'chmDangerTypeName',
      field: 'chmDangerTypeName',
      label: '품목명',
      style: 'width:200px',
      align: 'left',
      sortable: false
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      style: 'width:150px',
      align: 'center',
      sortable: false
    },
    {
      name: 'calcuOriginal',
      field: 'calcuOriginal',
      label: '품목별 지정수량 (L/KG)',
      style: 'width:150px',
      type: 'cost',
      sortable: false
    },
    {
      name: 'calcuMultiple',
      field: 'calcuMultiple',
      label: '배수(사업장 허가)',
      style: 'width:150px',
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
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const editForm = ref<any>(null)

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
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 품명 변경시 반영 로직
 *******************************/
function dataChange(data1: any, data2: any, data3: any) {
  if (
    !props.popupParam.chmDangerRegularCheckId &&
    data3.chmDangerMstId &&
    data3.chmDangerMstId.length > 0
  ) {
    data3 = {
      ...data3,
      chmDangerLocation: data3.chmDangerArea,
      chmDangerPermitNo: data3.permitNo,
      chmDangerManageUserId: data3.chmDangerManageUserId,
      chmDangerUserId: data3.chmDangerUserId
    }
    data3.checkitems = _.map(data3.typeList, (item) => ({
      ...item,
      regUserId: user.value.userId,
      editFlag: 'C'
    }))
  } else {
    data3.checkitems = _.map(data3.typeList, (item) => ({
      ...item,
      regUserId: user.value.userId,
      editFlag: 'C'
    }))
  }
  _.extend(props.check, data3)
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
