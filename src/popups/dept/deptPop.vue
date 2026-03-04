<template>
  <div>
    <c-card title="부서 상세" class="cardClassDetailForm no-margin">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="선택" icon="check" @btnClicked="selectDept" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-12">
          <q-tree
            ref="customTreeDept"
            :nodes="deptTree"
            tick-strategy="strict"
            node-key="deptCd"
            label-key="deptName"
            children-key="children"
            selected-color="primary"
            :no-nodes-label="$language('부서 정보가 없습니다.')"
            :default-expand-all="true"
            v-model:ticked="checkDepts"
          />
        </div>
      </template>
    </c-card>
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
import { useUserStore } from '@stores/user'
import arrayToTree from 'array-to-tree'
import { forEach, filter } from 'lodash-es'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/

defineOptions({
  name: ''
})
/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/** userStore 호출 */
const systemInfo = useSystemInfoStore()
const { depts } = storeToRefs(systemInfo)
const customTreeDept = ref<any>(null)

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
  popupParam: popupParamType
}

type popupParamType = {
  plantCd?: string | null
  parentCheckDepts: string
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const checkDepts = ref<Array<any>>([])
// const selected = ref<string | null>(null)

/******************************
 * @Computed_선언
 *******************************/
const filterDepts = computed(() => {
  let list: any = []
  if (user.value.plantCds !== null && user.value.plantCds !== '') {
    const plantCds = user.value.plantCds.split(',')
    forEach(depts.value, (_item) => {
      const index = plantCds.findIndex((a) => a === _item.plantCd)
      if (index > -1) {
        list.push(_item)
      }
    })
  } else {
    list = filter(depts.value, {
      plantCd: user.value.plantCd
    })
  }
  if (props.popupParam.plantCd) {
    list = filter(depts.value, { plantCd: props.popupParam.plantCd })
  }
  if (editable.value) {
    // 사용여부가 Y인 것만 리스트에 표현한다.
    // default : 사용여부 상관없이 전체
    list = filter(list, { useFlag: 'Y' })
  }
  return list
})
const deptTree = computed(() => {
  const val = convertTree(filterDepts.value)
  return val ? val : []
})

/******************************
 * @Watch_선언
 *******************************/
/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
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
  editable.value = Boolean(route.meta.editable)
  if (props.popupParam.parentCheckDepts) {
    checkDepts.value = props.popupParam.parentCheckDepts.split(',')
  }
}
/******************************
 * TODO (목적): 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
 * @param (1): 부서 리스트
 *******************************/
function convertTree(_treeBases: Array<any>) {
  if (!_treeBases || _treeBases.length <= 0) return null
  const tree = arrayToTree(_treeBases, {
    parentProperty: 'upDeptCd',
    customID: 'deptCd'
  })
  return tree
}
/******************************
 * TODO (목적): 부서트리에서 부서 정보 선택
 *******************************/
function selectDept() {
  if (!checkDepts.value || checkDepts.value.length === 0) {
    message.alert({
      title: '안내',
      message: '부서를 지정하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', customTreeDept.value.getTickedNodes())
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
