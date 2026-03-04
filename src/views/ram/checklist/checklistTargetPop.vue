<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-task-target
            :customPopupParam="{ targetKey: 'process' }"
            label="관련공정"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <c-select
            :disabled="isCheckItemClass"
            codeGroupCd="RAM_CHECK_ITEM_CLASS_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="ramCheckItemClassCd"
            label="분류"
            v-model:value="searchParam.ramCheckItemClassCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="평가대상 목록"
      :merge="grid.merge"
      :gridHeight="grid.height"
      :columns="grid.columns"
      :data="grid.data"
      rowKey="checkItemId"
      selection="multiple"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
          <c-btn v-if="editable" label="선택" icon="check" @btnClicked="select" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'checklistTargetPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
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
    processCd: stringNull
    ramCheckItemClassCd: stringNull
  }
}
interface searchParamType {
  processCd: stringNull
  ramCheckItemClassCd: stringNull
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
      processCd: '',
      ramCheckItemClassCd: null
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
const searchParam = ref<searchParamType>({
  processCd: '',
  ramCheckItemClassCd: null
})
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: false,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  merge: [
    { index: 0, colName: 'ramCheckItemClassCd' },
    { index: 1, colName: 'processGroup' }
  ],
  columns: [
    {
      name: 'ramCheckItemClassName',
      field: 'ramCheckItemClassName',
      label: '분류',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'checkItemName',
      field: 'checkItemName',
      label: '평가대상',
      align: 'center',
      sortable: true,
      style: 'width:200px',
      type: 'link'
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      sortable: true,
      style: 'width:350px',
      type: 'html'
    }
    /**
     * 작업 : 작업구분, 작업유형, 작업형태
     * 기계기구 : 기계분류, 기계관리번호
     * 유해인자 : 분류, 취급부서
     */
  ],
  data: [],
  height: '600px'
})
const listUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isCheckItemClass = computed(() => {
  return Boolean(props.popupParam.ramCheckItemClassCd)
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
  listUrl.value = selectConfig.ram.checklist.target.base.url
  // code setting
  if (props.popupParam.processCd) {
    searchParam.value.processCd = props.popupParam.processCd
  }
  if (props.popupParam.ramCheckItemClassCd) {
    searchParam.value.ramCheckItemClassCd = props.popupParam.ramCheckItemClassCd
  }
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 선택
 *******************************/
function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', selectData)
  }
}
function linkClick(row: any) {
  if (row.ramCheckItemClassCd === 'RCIC000001') {
    popupOptions.value.title = '안전작업표준 상세'
    popupOptions.value.param = {
      mdmSopId: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import('@views/mdm/pim/sopDetail.vue'))
    )
    popupOptions.value.width = '80%'
    popupOptions.value.isFull = false
  } else if (row.ramCheckItemClassCd === 'RCIC000005') {
    popupOptions.value.title = '유해위험기계기구 상세'
    popupOptions.value.param = {
      hhmHazardousMachineryId: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(
        () => import('@views/sop/mim/hazardEquipment/hazardEquipmentClassDetail.vue')
      )
    )
    popupOptions.value.isFull = true
  } else {
    popupOptions.value.title = '유해인자 상세'
    popupOptions.value.param = {
      hazardCd: row.checkItemId
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import('@views/sai/wmr/harmfulFactorsDetail.vue'))
    )
    popupOptions.value.isFull = false
    popupOptions.value.width = '80%'
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
