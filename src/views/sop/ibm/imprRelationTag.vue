<template>
  <c-btn v-if="editable && !Boolean(props.disabled)" label="상세업무" icon="info_outline">
    <template v-slot:tooltip>
      <q-popup-proxy transition-show="scale" transition-hide="scale">
        <div class="row">
          <div class="col-12">
            <div class="bg-grey-9 text-white p-3 text-center">
              <div style="font-size: 1.1rem; font-weight: bolder" class="mb-1">
                <q-icon name="info_outline" /> {{ improveRelationTask.relationTableTitle }}
              </div>
              <div v-if="isExistsTask" class="pl-1">
                {{ limit(improveRelationTask.relationTableNavi, 50) }}
              </div>
            </div>
            <div v-if="isExistsTask" class="text-grey-9 text-start p-3">
              <div v-html="convertEnter(improveRelationTask.relationTableContents)" />
            </div>
          </div>
        </div>
      </q-popup-proxy>
    </template>
  </c-btn>
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
import { convertEnter } from '@utils/common'
import { taskParamType, relationTaskType } from './impr'
import { limit } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'imprRelationTag'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  taskParam: taskParamType
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
  taskParam: () => {
    return {
      sopImprovementId: null,
      ibmTaskTypeCd: null,
      ibmTaskUnderTypeCd: null,
      relationTableKey: null
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
const improveRelationTask = ref<relationTaskType>({
  sopImprovementId: null,
  ibmTaskTypeCd: null,
  ibmTaskUnderTypeCd: null,
  relationTableKey: null,
  relationTableTitle: '연결된 업무가 없습니다..',
  relationTableNavi: '',
  relationTableContents: ''
})
const detailUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const isExistsTask = computed(() => {
  return Boolean(improveRelationTask.value.sopImprovementId)
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.taskParam.sopImprovementId,
  () => {
    getDetail()
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
  detailUrl.value = selectConfig.sop.ibm.improve.relationTask.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세업무 조회
 *******************************/
function getDetail() {
  if (props.taskParam.sopImprovementId) {
    $http({
      url: $format(detailUrl.value, props.taskParam.sopImprovementId),
      method: 'GET',
      params: {
        ibmTaskTypeCd: props.taskParam.ibmTaskTypeCd,
        ibmTaskUnderTypeCd: props.taskParam.ibmTaskUnderTypeCd
      }
    }).then((_result: any) => {
      _.extend(improveRelationTask.value, _result.data)
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.p-3
  padding: 10px 18px !important
</style>
