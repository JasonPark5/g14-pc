<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-table
        ref="eduTable"
        title="관련 교육 목록"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="emerActPlanDocu.edus"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :isExcelDown="false"
        :hideBottom="true"
        :editable="editable"
        rowKey="eduEducationId"
        selection="multiple"
        @linkClick="linkClick"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              :showLoading="false"
              label="추가"
              icon="add"
              @btnClicked="addEdu"
            />
            <c-btn
              v-if="
                editable && !disabled && emerActPlanDocu.edus && emerActPlanDocu.edus.length > 0
              "
              :showLoading="false"
              label="삭제"
              icon="remove"
              @btnClicked="delEdu"
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
  name: 'emergencyEdu'
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
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  emerActPlanDocu: {
    plantCd: stringNull
    sopEmergencyPlanId: stringNull
    edus: Array<any>
  }
  disabled?: boolean
}

interface gridType {
  columns: tableColumnType
  height: stringNull
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
  emerActPlanDocu: () => {
    return {
      plantCd: '',
      sopEmergencyPlanId: '',
      edus: []
    }
  },
  disabled: false
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
  isFull: true,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
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
  data: [],
  height: '760px'
})
const eduTable = ref<any>(null)

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
function addEdu() {
  popupOptions.value = getPopupOptions('edu', popupOptions.value, closeEduPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeEduPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const eduList = [] as any
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.emerActPlanDocu.edus, {
          eduEducationId: item.eduEducationId
        }) === -1
      ) {
        eduList.push({
          sopEmergencyPlanId: props.emerActPlanDocu.sopEmergencyPlanId,
          eduEducationId: item.eduEducationId,
          editFlag: 'C'
        })
      }
    })
    $http({
      url: transactionConfig.sop.eap.relateEdu.insert.url,
      method: 'POST',
      data: eduList
    }).then((_result: any) => {
      message.requestSuccess()
      emits('getDetail')
    })
  }
}
function delEdu() {
  const selectData = eduTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: transactionConfig.sop.eap.relateEdu.delete.url,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (_item: any) => {
            props.emerActPlanDocu.edus = _.reject(props.emerActPlanDocu.edus, _item)
          })
          eduTable.value.compoTable.clearSelection()
        })
      },
      cancelCallback: () => {}
    })
  }
}
function linkClick(_row: any) {
  popupOptions.value.title = '관련 교육계획 상세'
  popupOptions.value.param = popupOptions.value.param = {
    plantCd: _row.plantCd || null,
    eduEducationId: _row ? _row.eduEducationId : '',
    stepCd:
      !_row || _row.documentStatusCd === 'ESC000001' || _row.documentStatusCd === 'ESC000005'
        ? 'ESC0000005'
        : 'ESC0000010'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/sop/edu/result/educationResultDetail.vue`))
  )
  popupOptions.value.isFull = true
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
