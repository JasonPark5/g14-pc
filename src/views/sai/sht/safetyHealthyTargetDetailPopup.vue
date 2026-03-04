<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="상세실적"
        :columns="grid.columns"
        :data="grid.data"
        :gridHeight="grid.height"
        :editable="editable"
        :usePaging="false"
        :isExcelDown="true"
        :filtering="false"
        :isFullScreen="false"
        :columnSetting="false"
        selection="multiple"
        rowKey="saiSafetyHealthyTargetResultId"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addResult" />
            <c-btn
              v-if="editable && grid.data && grid.data.length > 0"
              label="삭제"
              icon="delete"
              @btnClicked="deleteResult"
            />
            <c-btn
              v-if="editable && grid.data && grid.data.length > 0"
              label="저장"
              icon="save"
              @btnClicked="saveResult"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
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
import { safetyHealthyTargetDetailPopType } from './safetyHealthyMst'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'safetyHealthyTargetDetailPopup'
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
interface gridType {
  columns: tableColumnType
  data: Array<safetyHealthyTargetDetailPopType>
  height: stringNull
}
interface propType {
  popupParam: {
    saiSafetyHealthyTargetId: stringNull
    saiSafetyHealthyTargetPlanId: stringNull
  }
  returnData: {
    col1: stringNull
  }
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
      saiSafetyHealthyTargetId: '',
      saiSafetyHealthyTargetPlanId: ''
    }
  },
  returnData: () => {
    return {
      col1: ''
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
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)
const grid = ref<gridType>({
  columns: [],
  data: [],
  height: '600px'
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
  listUrl.value = selectConfig.sai.safetyHealthy.result.list.url
  saveUrl.value = transactionConfig.sai.safetyHealthy.result.save.url
  deleteUrl.value = transactionConfig.sai.safetyHealthy.result.delete.url
  // code setting
  // list setting
  getColumn()
}
/******************************
 * TODO (목적): 그리드 컬럼 세팅
 *******************************/
function getColumn() {
  const months = ref<Array<codeMasterType>>([])
  for (let i = 1; i < 13; i++) {
    months.value.push({
      code: String(i),
      codeName: $language(String(i) + '월') //월
    })
  }
  grid.value.columns = [
    {
      required: props.popupParam.saiSafetyHealthyTargetPlanId === 'SHP0000156' ? false : true,
      name: 'month',
      field: 'month',
      label: '실적월',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      type: props.popupParam.saiSafetyHealthyTargetPlanId === 'SHP0000156' ? null : 'select',
      // type: 'select',
      comboItems: months
    },
    {
      required: props.popupParam.saiSafetyHealthyTargetPlanId === 'SHP0000156' ? false : true,
      name: 'resultContents',
      field: 'resultContents',
      label: '실적내용',
      align: 'left',
      type: props.popupParam.saiSafetyHealthyTargetPlanId === 'SHP0000156' ? null : 'textarea',
      // type: 'textarea',
      sortable: false
    },
    {
      name: 'attach',
      field: 'attach',
      label: '관련 파일첨부',
      align: 'center',
      style: 'width:180px',
      type: 'attach',
      taskClassCd: 'RISK_PLAN',
      keyText: 'saiSafetyHealthyTargetResultId',
      sortable: false
    },
    {
      name: 'managerUserName',
      field: 'managerUserName',
      label: '담당자',
      align: 'center',
      type: 'user',
      userId: 'managerUserId',
      style: 'width: 120px',
      sortable: false
    }
  ]
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      saiSafetyHealthyTargetPlanId: props.popupParam.saiSafetyHealthyTargetPlanId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
    props.returnData.col1 = _.reject(grid.value.data, { editFlag: 'C' })
  })
}

/******************************
 * TODO (목적): 실적 추가
 *******************************/
function addResult() {
  grid.value.data.splice(0, 0, {
    saiSafetyHealthyTargetResultId: uid(), // 안전보건목표 실적 일련번호
    saiSafetyHealthyTargetPlanId: props.popupParam.saiSafetyHealthyTargetPlanId, // 안전보건목표 계획 일련번호
    saiSafetyHealthyTargetId: props.popupParam.saiSafetyHealthyTargetId, // 안전보건목표 일련번호
    month: null, // 실적월
    resultContents: '', // 실적내용
    managerUserId: user.value.userId, // 담당자id
    managerUserName: user.value.userName, // 담당자id
    regUserId: user.value.userId, // 등록자
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 실적 저장
 *******************************/
function saveResult() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: saveUrl.value,
          method: 'PUT',
          data: grid.value.data
        }).then((_result: any) => {
          message.requestSuccess()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.alert({
      title: '안내',
      message: '변경된 데이터가 없습니다.',
      type: 'info' // success / info / warning / error
    })
  }
}
/******************************
 * TODO (목적): 실적 삭제
 *******************************/
function deleteResult() {
  const selectData = table.value.getSelected()
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
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          table.value.compoTable.clearSelection()
          props.returnData.col1 = grid.value.data
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
