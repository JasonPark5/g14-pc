<!--
목적 : 부서 멀티선택 팝업 컴포넌트
-->
<template>
  <div class="fix-height">
    <q-field
      no-error-icon
      ref="customDeptMulti"
      class="customDeptMulti"
      color="orange"
      :rules="[validRule]"
      :validMessage="validMessage"
      :label="$language(label)"
      :disable="disabled || !editable"
      stack-label
      v-model="valueText"
    >
      <template v-slot:label v-if="label">
        <div class="row items-center all-pointer-events">
          <b>
            <span class="formLabelTitle">{{ $language(props.label) }}</span>
            <i v-if="required" class="material-icons labelfrontIcon text-requiredColor">check</i>
          </b>
        </div>
      </template>
      <template v-slot:control>
        <q-chip
          v-for="(item, index) in setValueText()"
          :key="index"
          outline
          dense
          square
          color="orange"
          class="q-ma-none customchipdept"
        >
          {{ item }}
        </q-chip>
      </template>

      <template v-slot:append>
        <q-icon v-if="!disabled && editable" name="search" @click="search" class="cursor-pointer" />
        <q-icon v-if="!disabled && editable" name="close" @click="reset" class="cursor-pointer" />
      </template>
    </q-field>
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
  name: 'CDeptMulti'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const systemInfo = useSystemInfoStore()
const { depts } = storeToRefs(systemInfo)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setDeptName', 'datachange'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  editable?: boolean
  disabled?: boolean
  required?: boolean
  label?: string
  placeholder?: string
  plantCd?: string
  stype?: string
  dense?: boolean
  multiple?: string
  parentCheckDepts?: string
  error?: ErrorFunction
  validMessage?: stringNull
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
  name: '',
  editable: true,
  disabled: false,
  required: false,
  label: '부서',
  placeholder: '',
  plantCd: '',
  stype: '20' /** 10:상위공정, 20: 단위공정 */,
  dense: true,
  multiple: 'single',
  parentCheckDepts: ''
})

/******************************
 * @VModel_선언
 *******************************/
const value = defineModel('value', {
  default: '',
  type: String as PropType<string | null | undefined>
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const valueText = ref('')
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
const customDeptMulti = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  value,
  () => {
    setValueText()
  },
  {
    deep: true
  }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  setValueText()
})
onMounted(() => {
  if (!props.disabled) {
    customDeptMulti.value.$el
      .getElementsByClassName('q-field__native')[0]
      .addEventListener('click', search)
  }
})
onBeforeUnmount(() => {
  if (!props.disabled) {
    customDeptMulti.value.$el
      .getElementsByClassName('q-field__native')[0]
      .addEventListener('click', search)
  }
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 부서코드에 따른 부서명 셋팅 (0 ~ N개)
 *******************************/
function setValueText() {
  if (value.value) {
    const _list: Array<string> = []
    _.forEach(depts.value, (_item: any) => {
      if (value.value!.indexOf(_item.deptCd) > -1) {
        _list.push(_item.deptName)
      }
    })
    valueText.value = _list.join(',')
    return _list
  } else {
    valueText.value = ''
    return null
  }
}
/******************************
 * TODO (목적): 부서팝업 표시
 *******************************/
function search() {
  popupOptions.value.title = '부서조회'
  popupOptions.value.param = {
    plantCd: props.plantCd,
    parentCheckDepts: props.parentCheckDepts
      ? props.parentCheckDepts
      : value.value
        ? value.value
        : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@popups/dept/deptPop.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.width = '50%'
  popupOptions.value.closeCallback = closeDept
}
/******************************
 * TODO (목적): 부서팝업에서 넘어온 값 셋팅
 * @param (1): 부서팝업에서 넘어온 부서정보들
 *******************************/
function closeDept(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const pName: Array<string> = []
    const pCd: Array<string> = []
    _.forEach(data, (item: any) => {
      pName.push(item.deptName)
      pCd.push(item.deptCd)
    })
    valueText.value = pName.join(',')
    value.value = pCd.join(',')
    emits('setDeptName', pName.join(','))
    emits('datachange', pCd.join(','), pName.join(','))
  }
}
/******************************
 * TODO (목적): 부서값 초기화
 *******************************/
function reset() {
  valueText.value = ''
  value.value = null
  emits('setDeptName', valueText.value)
  emits('datachange', null, null)
}
/******************************
 * TODO (목적): 유효성 검증
 * @param (1): 값
 * @return (반환): true: 통과, 그 외 : 통과X
 *******************************/
function validRule(val: any) {
  let validCheck = true
  if (props.required) {
    validCheck = Boolean(val) && val.length > 0
  }

  if (validCheck && props.error) {
    validCheck = props.error(val)
  }
  return validCheck
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
