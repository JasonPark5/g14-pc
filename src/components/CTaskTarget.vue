<template>
  <div class="fix-height">
    <q-field
      stack-label
      ref="customTaskTarget"
      class="customTaskTarget"
      color="orange-custom"
      no-error-icon
      :rules="[validRule]"
      :validMessage="validMessage"
      :label="$language(label)"
      :disable="disabled || !editable"
      v-model="valueText"
    >
      <template v-slot:label v-if="label">
        <div class="row items-center all-pointer-events">
          <b>
            <span class="formLabelTitle">{{ $language(label) }}</span>
            <i v-if="required" class="material-icons labelfrontIcon text-requiredColor">check</i>
          </b>
        </div>
      </template>
      <template v-slot:control>
        {{ valueText }}
      </template>

      <template v-slot:append>
        <div
          v-for="(append, idx) in appends"
          :key="idx"
          class="cursor-pointer"
          @click="appendClick(append)"
        >
          {{ $language(append.text) }}
        </div>
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
import * as popupVues from '@utils/popup'
import { getNameOption } from '@utils/taskNameOption'
import { targetLiteralType } from '@/common/utils/taskTarget'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CTaskTarget'
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
const emits = defineEmits(['update:value', 'dataChange', 'getName', 'getDetailTask'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  value?: string | null | undefined
  label?: string
  placeholder?: string
  editable?: boolean
  disabled?: boolean
  required?: boolean
  dense?: boolean
  multiple?: boolean
  plantCd?: stringNull
  processCd?: stringNull
  appends?: Array<appendType>
  customPopupParam: customPopupParamType
  notSearchName?: boolean
  error?: ErrorFunction
  validMessage?: stringNull
  isObject?: boolean
}
type appendType = {
  text: string
  visible: boolean
  clickFunction: (taskTargetValue: string | null, taskTargetText: string | null) => void
}
interface customPopupParamType {
  targetKey: targetLiteralType
  setSearchParam?: objectStringNumber
  title: string
  width?: string
  isFull?: boolean
  param?: objectStringNumber
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  name: '',
  value: null,
  label: '',
  placeholder: '',
  editable: true,
  disabled: false,
  required: false,
  dense: true,
  multiple: false,
  plantCd: null,
  processCd: null,
  isObject: false,
  appends: () => [],
  customPopupParam: () => {
    return {
      targetKey: 'equip',
      title: '',
      width: '50%',
      isFull: false,
      param: {}
    }
  },
  notSearchName: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const vValue = ref<string | null>(null)
const valueText = ref<string | null>('')
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const customTaskTarget = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.value,
  () => {
    vValue.value = props.value
    setValueText()
  }
)
watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
      customTaskTarget.value.$el
        .getElementsByClassName('q-field__native')[0]
        .addEventListener('click', search)
    }
  },
  { deep: true }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  init()
})
onMounted(() => {
  if (!props.disabled && props.editable && customTaskTarget.value) {
    customTaskTarget.value.$el
      .getElementsByClassName('q-field__native')[0]
      .addEventListener('click', search)
  }
})
onUnmounted(() => {
  if (!props.disabled && props.editable && customTaskTarget.value) {
    customTaskTarget.value.$el
      .getElementsByClassName('q-field__native')[0]
      .removeEventListener('click', search)
  }
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
  vValue.value = props.value
  setValueText()
}
/******************************
 * TODO (목적): 이름 셋팅
 *******************************/
function setValueText() {
  if (vValue.value) {
    const manageNameOption = getNameOption(props.customPopupParam.targetKey)
    const params = _.clone(manageNameOption.params)
    if (params.key) {
      params[manageNameOption.valueKey] = vValue.value
    }
    let url = manageNameOption.url
    if (params.formatkey) {
      url = $format(url, vValue.value)
    }
    $http({
      url: url,
      method: 'GET',
      params: params
    }).then((_result: any) => {
      if (typeof _result.data === 'string') {
        // 이름만 반환하는 경우
        valueText.value = _result.data
      } else if (Array.isArray(_result.data)) {
        valueText.value =
          _result.data && _result.data.length > 0 ? _result.data[0][manageNameOption.nameKey] : ''
      } else {
        // 상세 정보를 반환하는 경우
        valueText.value = _result.data ? _result.data[manageNameOption.nameKey] : ''
        emits('getDetailTask', _result.data)
      }
    })
  } else {
    valueText.value = ''
  }
}
/******************************
 * TODO (목적): 검색 팝업 표시
 *******************************/
function search() {
  const managePopupOptions = popupVues.getPopupOption(props.customPopupParam.targetKey)
  if (managePopupOptions) {
    const popupParam = _.extend(
      {
        searchParam: _.extend(
          {},
          {
            plantCd: props.plantCd,
            processCd: props.processCd
          },
          props.customPopupParam.param
        )
      },
      managePopupOptions.param,
      props.customPopupParam.param,
      {
        type: props.multiple ? 'multiple' : 'single'
      }
    )
    popupOptions.value.param = popupParam
    popupOptions.value.title = managePopupOptions.title + ' 검색'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/components/commonPop.vue`))
    )
    popupOptions.value.width = managePopupOptions.width
    popupOptions.value.isFull = managePopupOptions.isFull
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closePopup
  } else {
    message.alert({
      title: '안내',
      message: '관리자에게 문의바랍니다.',
      type: 'error'
    })
  }
}
/******************************
 * TODO (목적): 검색 팝업 닫힌 후 emit
 * @param (1): 검색 팝업에서 선택한 값
 *******************************/
function closePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const manageNameOption = getNameOption(props.customPopupParam.targetKey)
    const beforeValue = _.clone(vValue.value)
    if (manageNameOption && manageNameOption.valueKey) {
      if (!props.multiple) {
        if (props.isObject) {
          emits('update:value', data[0])
          emits('dataChange', data[0], beforeValue, data[0])
          emits('getName', data[0][manageNameOption.nameKey])
        } else {
          emits('update:value', data[0][manageNameOption.valueKey])
          emits('dataChange', data[0][manageNameOption.valueKey], beforeValue, data[0])
          emits('getName', data[0][manageNameOption.nameKey])
        }
      } else {
        emits('update:value', _.map(data, manageNameOption.valueKey).join(','))
        emits('dataChange', _.map(data, manageNameOption.valueKey), beforeValue, data)
        emits('getName', _.map(data, manageNameOption.nameKey))
      }
    }
  }
}
/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  const beforeVendorCd = _.clone(vValue.value)
  emits('dataChange', null, beforeVendorCd, {})
  emits('getName', '')
  emits('update:value', null)
}
/******************************
 * TODO (목적): append한 영역을 클릭 시
 * @param (1): append 정보
 *******************************/
function appendClick(append: appendType) {
  append.clickFunction(vValue.value, valueText.value)
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
