<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 risk-process-chips">
        <q-chip
          v-for="(dept, idx) in evaluation.targetDeptList"
          :key="idx"
          outline
          square
          :removable="editable && !disabled"
          :color="dept.selected ? 'primary' : 'grey-6'"
          text-color="white"
          icon="memory"
          :selected="dept.selected"
          :label="dept.deptName"
          @remove="(state: boolean) => removeDept(state, dept)"
          @update:selected="(state: boolean) => selectedDept(state, dept, idx)"
        />
        <q-chip
          v-if="editable && !disabled"
          clickable
          square
          color="orange"
          text-color="white"
          icon="add"
          :label="$language('부서선택')"
          @click="addDept"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <component
          :is="resultDeptComponent"
          :popupParam="props.popupParam"
          :evaluation="evaluation"
          :deptResultData="deptResultData"
          :itemList="props.itemList"
          :disabled="disabled"
          :selectedDeptCd="selectedDeptCd"
        />
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
import {
  performanceEvaluationResultType,
  performanceEvaluationType
} from './performanceEvaluationType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'performanceEvaluationResult'
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
    evaluationId: stringNull
  }
  evaluation: performanceEvaluationType
  itemList: performanceEvaluationResultType[]
  contentHeight: stringNull | numberNull
  disabled: boolean
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
      evaluationId: ''
    }
  },
  evaluation: () => {
    return {
      evaluationId: '', // 성과평가 일련번호
      plantCd: '', // 사업장 코드
      evaluationStatusCd: '', // 성과평가 진행상태
      targetDeptCds: '',
      evaluationName: '', // 평가명
      evaluationDate: '', // 평가일자
      evaluationUserId: '', // 작성자
      resultRemark: '',
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      evaluationResultList: [],
      deleteEvaluationResultList: [],
      targetDeptList: [],
      deleteTargetDeptList: [],
      approvalStatusCd: '', // 결재관련 결재상태
      sysApprovalRequestId: '' // 결재관련 결재요청코드
    }
  },
  itemList: () => [],
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
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const saveUrl = ref('')
const deleteUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const selectedDeptCd = computed(() => {
  const dept = props.evaluation.targetDeptList!.find((dept: any) => dept.selected)
  return dept ? dept.deptCd : ''
})

const deptResultData = computed(() => {
  return props.evaluation.evaluationResultList!.filter(
    (result: any) => result.deptCd === selectedDeptCd.value
  )
})

const resultDeptComponent = computed(() => {
  return defineAsyncComponent(() => import(`./performanceEvaluationResultDept.vue`))
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.evaluation.targetDeptList,
  () => {
    if (props.evaluation.targetDeptList && props.evaluation.targetDeptList.length > 0) {
      const idx = _.findIndex(props.evaluation.targetDeptList, { deptCd: selectedDeptCd.value })
      if (idx === -1) {
        selectedDept(true, props.evaluation.targetDeptList[0], 0)
      }
    }
  },
  { deep: true }
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
  saveUrl.value = transactionConfig.pe.targetDept.save.url
  deleteUrl.value = transactionConfig.pe.targetDept.delete.url
  // code setting
  // list setting
  if (props.evaluation.targetDeptList && props.evaluation.targetDeptList.length > 0) {
    props.evaluation.targetDeptList[0].selected = true
  }
}

function selectedDept(_state: any, _dept: any, _idx: any) {
  if (_state) {
    props.evaluation.targetDeptList!.forEach((item: any, index: any) => {
      if (_idx !== index) {
        item.selected = false
      } else {
        item.selected = true
      }
    })
  }
}

/******************************
 * TODO (목적): 부서 추가
 *******************************/
function addDept() {
  popupOptions.value = getPopupOptions('dept', popupOptions.value, closeDeptPopup, {
    type: 'multiple'
  })
}

/******************************
 * TODO (목적): 부서 추가 callback
 *******************************/
function closeDeptPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false

  if (_data && _data.length > 0) {
    const addDept = _.filter(_data, (item) => {
      return _.findIndex(props.evaluation.targetDeptList, { deptCd: item.deptCd }) === -1
    })
    const plantItem = _.filter(
      props.itemList,
      (value) => value.plantCd === props.evaluation.plantCd
    )
    _.forEach(addDept, (item) => {
      item.regUserId = user.value.userId
      item.evaluationId = props.evaluation.evaluationId
      item.selected = false
      item.editFlag = 'C'

      _.forEach(plantItem, (base) => {
        const _result = _.cloneDeep(base)
        _result.deptCd = item.deptCd
        _result.perc000001 = 'Y'
        _result.perc000005 = 'N'
        _result.perc000010 = 'N'
        _result.editFlag = 'C'
        _result.regUserId = user.value.userId
        props.evaluation.evaluationResultList?.push(_result)
      })
    })
    props.evaluation.targetDeptList = [...props.evaluation.targetDeptList!, ...addDept]
  }
}

/******************************
 * TODO (목적): 부서 삭제
 *******************************/
function removeDept(_state: any, _dept: any) {
  message.confirm({
    title: '확인',
    message: '제외하실 경우 해당 부서에 해당하는 평가항목도 삭제됩니다. 진행하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      props.evaluation.targetDeptList = _.reject(props.evaluation.targetDeptList, _dept)
      if (!props.evaluation.deleteTargetDeptList) {
        props.evaluation.deleteTargetDeptList = []
      }
      props.evaluation.deleteTargetDeptList!.push(_dept)

      // 평가결과 제외
      const selectData = _.filter(
        props.evaluation.evaluationResultList,
        (result) => result.deptCd === _dept.deptCd
      )
      _.forEach(selectData, (item) => {
        if (!props.evaluation.deleteEvaluationResultList) {
          props.evaluation.deleteEvaluationResultList = []
        }
        if (
          _.findIndex(props.evaluation.deleteEvaluationResultList, {
            evaluationResultId: item.evaluationResultId
          }) === -1 &&
          item.editFlag !== 'C'
        ) {
          props.evaluation.deleteEvaluationResultList.push(item)
        }
        props.evaluation.evaluationResultList = _.reject(
          props.evaluation.evaluationResultList,
          item
        )
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {
      _dept.check = true
    }
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
