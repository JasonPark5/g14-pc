<template>
  <div>
    <div v-if="editable && param.selfInspectionStatusCd == 'SISC000001'" class="col float-right">
      <q-btn-group outline>
        <c-btn
          v-if="
            editable &&
            param.selfInspectionResultId &&
            param.selfInspectionStatusCd === 'SISC000001'
          "
          label="삭제"
          icon="remove"
          @btnClicked="deleteData"
        />
        <c-btn
          v-show="
            editable &&
            param.selfInspectionResultId &&
            param.selfInspectionStatusCd === 'SISC000001'
          "
          :url="saveUrl"
          :isSubmit="isSave"
          :param="info"
          mappingType="PUT"
          label="계획완료"
          icon="assignment_turned_in"
          color="orange-6"
          @beforeAction="saveDataEnd"
          @btnCallback="saveCallbackEnd"
        />
      </q-btn-group>
    </div>
    <c-tab type="vertical" :tabItems="tabItems" height="790px" v-model:value="tab">
      <template v-slot:default="tab">
        <component :is="tab.component" :popupParam="param" />
      </template>
    </c-tab>
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
  name: 'compliancePlan'
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
const emits = defineEmits(['emitStep'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  param: {
    selfInspectionResultId?: stringNull
    selfInspectionStatusCd?: stringNull
    sysRevision?: stringNull // 평가항목 개정번호
    count?: numberNull
  }
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
  param: () => {
    return {
      selfInspectionResultId: '',
      selfInspectionStatusCd: '',
      sysRevision: '', // 평가항목 개정번호
      count: 0
    }
  },
  height: ''
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const info = ref({
  selfInspectionResultId: '',
  selfInspectionStatusCd: '',
  regUserId: '',
  sysRevision: props.param.sysRevision
})
const editable = ref(true)
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const isdelete = ref(false)
const tab = ref('planInfo')

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() => [
  {
    key: uid(),
    name: 'planInfo',
    icon: 'edit',
    label: '감사계획정보',
    component: defineAsyncComponent(() => import(`./planInfo.vue`))
  },
  {
    key: uid(),
    name: 'planItem',
    icon: 'category',
    label: '감사항목',
    component: defineAsyncComponent(() => import(`./planItem.vue`)),
    disabled: props.param.selfInspectionResultId ? false : true
  },
  {
    key: uid(),
    name: 'auditTable',
    icon: 'table_view',
    label: '환산표',
    component: defineAsyncComponent(() => import(`./auditTables.vue`)),
    disabled: props.param.selfInspectionResultId ? false : true
  }
])

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
  deleteUrl.value = transactionConfig.sop.pca.result.info.delete.url
  saveUrl.value = transactionConfig.sop.pca.result.info.planend.url
  // code setting
  // list setting
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveDataEnd() {
  message.confirm({
    title: '확인',
    message: '계획을 완료하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      info.value.selfInspectionResultId = props.param.selfInspectionResultId
      info.value.selfInspectionStatusCd = 'SISC000002'
      info.value.regUserId = user.value.userId
      isSave.value = !isSave.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function saveCallbackEnd() {
  message.requestSuccess()
  // stepper 이동
  emits('emitStep', { name: 'currentStep', param: 'SISC000002' })
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteData() {
  message.confirm({
    title: '확인',
    message: '자체감사의 모든정보가 삭제됩니다. 정말로 삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.param.selfInspectionResultId),
        method: 'DELETE'
      }).then(() => {
        isdelete.value = !isdelete.value
        message.requestSuccess()
        emits('emitStep', { name: 'closePopup', param: {} })
      })
    },
    cancelCallback: () => {}
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
