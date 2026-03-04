<template>
  <div>
    <c-table
      ref="tasktable"
      title="관련 교육 목록"
      :columns="grid.columns"
      :data="grid.data"
      :columnSetting="false"
      :isFullScreen="false"
      :usePaging="false"
      :expandAll="true"
      selection="multiple"
      rowKey="eduEducationId"
      checkDisableColumn="non"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteTask"
          />
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addTask" />
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
  name: 'riskEducation'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
    vendorFlag: boolean
  }
  task: {
    insertUrl: stringNull
    deleteUrl: stringNull
  }
  height?: stringNull
}

interface gridType {
  columns: tableColumnType
  data: Array<any>
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => ({
    ramRiskAssessmentPlanId: '',
    ramStepCd: '',
    vendorFlag: false
  }),
  task: () => ({
    insertUrl: '',
    deleteUrl: ''
  }),
  height: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const grid = ref<gridType>({
  columns: [
    {
      name: 'educationName',
      field: 'educationName',
      label: '교육명',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'educationCourseName',
      field: 'educationCourseName',
      label: '교육과정',
      align: 'left',
      sortable: true
    },
    {
      name: 'educationDate',
      field: 'educationDate',
      label: '교육일',
      align: 'center',
      sortable: true
    },
    {
      name: 'eduPlanTime',
      field: 'eduPlanTime',
      label: '교육시간',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationKindCdLargeName',
      field: 'educationKindCdLargeName',
      label: '교육종류1',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationKindCdSmallName',
      field: 'educationKindCdSmallName',
      label: '교육종류2',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationTypeName',
      field: 'educationTypeName',
      label: '교육구분',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationMethodName',
      field: 'educationMethodName',
      label: '교육방법',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const listUrl = ref('')
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const tasktable = ref<any>(null)

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
  listUrl.value = selectConfig.sop.edu.result.list.url
  // code setting
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function linkClick(_row: any) {
  popupOptions.value.title = '교육계획 상세'
  popupOptions.value.param = {
    plantCd: _row.plantCd || null,
    eduEducationId: _row.eduEducationId || '',
    stepCd:
      !_row || _row.documentStatusCd === 'ESC000001' || _row.documentStatusCd === 'ESC000005'
        ? 'ESC0000005'
        : 'ESC0000010'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/sop/edu/result/educationResultDetail.vue'))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
function deleteTask() {
  const selectData = tasktable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '제외하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: props.task.deleteUrl,
          method: 'DELETE',
          data: Object.values(
            _.map(selectData, (item: any) => {
              return {
                ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId,
                eduEducationId: item.eduEducationId
              }
            })
          )
        }).then(() => {
          message.requestSuccess()
          tasktable.value.compoTable.clearSelection()
          getList()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
function addTask() {
  popupOptions.value.title = '교육 검색'
  popupOptions.value.isFull = false
  popupOptions.value.width = '90%'
  popupOptions.value = getPopupOptions('edu', popupOptions.value, closeTaskPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeTaskPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const insertList = [] as any
    _.forEach(_data, (item) => {
      if (_.findIndex(grid.value.data, { eduEducationId: item.eduEducationId }) === -1) {
        insertList.push({
          ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId,
          eduEducationId: item.eduEducationId
        })
      }
    })
    $http({
      url: props.task.insertUrl,
      method: 'POST',
      data: insertList
    }).then(() => {
      message.requestSuccess()
      getList()
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
