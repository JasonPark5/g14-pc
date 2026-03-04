<template>
  <div class="fix-height">
    <q-field
      ref="customMaterial"
      class="customMaterial"
      stack-label
      color="orange-custom"
      :label="$language(label)"
      :disable="disabled || !editable"
      :rules="[validRule]"
      :validMessage="validMessage"
      v-model="valueText"
    >
      <template v-slot:label v-if="label">
        <div class="row items-center all-pointer-events">
          <b>
            <i v-if="!required" class="pe-7s-note labelfrontIcon searchAreaLabelIcon" />
            <span class="formLabelTitle">{{ $language(label) }}</span>
            <i v-if="required" class="material-icons labelfrontIcon text-requiredColor">check</i>
          </b>
        </div>
      </template>
      <template v-slot:control>
        <template v-if="!editing">
          {{ valueText }}
        </template>
        <template v-else>
          <div v-if="isWrite" class="col-2 input-material-div">
            <q-chip outline square size="6px" color="primary" text-color="white"> TEMP </q-chip>
          </div>
          <div v-if="isWrite" class="input-material-div" :class="isWrite ? 'col-2' : 'col-4'">
            <input
              class="custom-editing-input"
              ref="customEditingInputFirst"
              type="text"
              maxlength="10"
              :disabled="!isWrite"
              v-model="valueText1"
              @input="datachange('1')"
            />
          </div>
          <div class="col-1 input-material-div">/</div>
          <div class="input-material-div" :class="type === 'codenameen' ? 'col-3' : 'col-7'">
            <input
              class="custom-editing-input"
              ref="custom-editing-input"
              type="text"
              :disabled="!isWrite"
              v-model="valueText2"
              @input="datachange('2')"
            />
          </div>
          <div v-if="type === 'codenameen'" class="col-1 input-material-div">/</div>
          <div v-if="type === 'codenameen'" class="col-3 input-material-div">
            <input
              class="custom-editing-input"
              ref="custom-editing-input"
              type="text"
              :disabled="!isWrite"
              v-model="valueText3"
              @input="datachange('3')"
            />
          </div>
        </template>
      </template>

      <template v-slot:append>
        <q-icon
          v-if="!disabled && editable && isWrite"
          name="edit"
          @click="edit"
          class="cursor-pointer"
          :class="[editing ? 'text-red' : '']"
        />
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

import { materialType } from '@/views/mdm/mam/material'

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
  name: 'CMaterial'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['name', 'update:value', 'datachange'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: stringNull
  value?: stringNull
  label?: stringNull
  editable?: boolean
  type?: stringNull
  plantCd?: stringNull
  required?: boolean
  disabled?: boolean
  dense?: boolean
  multiple?: stringNull
  isWrite?: boolean
  data?: any
  materialName?: stringNull
  materialNameEn?: stringNull
  reviewCheck?: boolean
  newChem?: stringNull
  error?: ErrorFunction
  validMessage?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  name: 'material',
  value: '',
  label: '',
  editable: true,
  type: 'name',
  plantCd: '',
  required: false,
  disabled: false,
  dense: true,
  multiple: 'single',
  isWrite: false,
  data: () => {},
  materialName: 'materialName',
  materialNameEn: 'materialNameEn',
  reviewCheck: false,
  newChem: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const EDIT_PREFIX = 'TEMP'
const popupOptions = ref<popupParamType>({
  width: '60%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const vValue = ref<stringNull>(null)
const valueText = ref('')
const valueText1 = ref('')
const valueText2 = ref('')
const valueText3 = ref('')
const editing = ref(false)
const customEditingInputFirst = ref<any>(null)

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
    if (vValue.value && vValue.value!.indexOf(EDIT_PREFIX) > -1) {
      editing.value = true
    } else {
      editing.value = false
    }
    setValueText()
  },
  { deep: true }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  init()
})
// onMounted(() => {
//   init()
// })
// onBeforeUnmount(() => {
//   init()
// })

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
  // url setting
  // code setting
  vValue.value = props.value
  if (!editing.value && vValue.value && vValue.value!.indexOf(EDIT_PREFIX) > -1) {
    editing.value = true
  }
  setValueText()
  // list setting
}
/******************************
 * TODO (목적): 화학자재값 셋팅, TEMP인 경우 api통신 X
 *******************************/
function setValueText() {
  if (vValue.value) {
    if (!editing.value) {
      $http({
        url: $format(selectConfig.mdm.mam.material.get.url, vValue.value),
        method: 'GET'
      }).then((_result: any) => {
        if (props.type == 'name') {
          valueText.value = _result.data.materialName
        } else if (props.type == 'codename') {
          valueText.value = _result.data.materialCd + ' / ' + _result.data.materialName
        } else if (props.type == 'codenameen') {
          valueText.value =
            _result.data.materialCd +
            ' / ' +
            _result.data.materialName +
            (_result.data.materialNameEn ? ' / ' + _result.data.materialNameEn : '')
        }
      })
    } else {
      let text1 = (_.clone(vValue.value) as string) || ''
      if (text1 && vValue.value!.indexOf(EDIT_PREFIX) === 0) {
        text1 = _.replace(text1, EDIT_PREFIX, '')
      }
      valueText1.value = text1
      valueText2.value = props.data[props.materialName] || ''
      valueText3.value = props.data[props.materialNameEn] || ''
      valueText.value = valueText1.value + valueText2.value + valueText3.value
    }
  } else {
    if (editing.value) {
      valueText1.value = ''
      valueText2.value = ''
      valueText3.value = ''
    }
    valueText.value = ''
  }
}
/******************************
 * TODO (목적): 자재 팝업 표시
 *******************************/
function search() {
  popupOptions.value = getPopupOptions('material', popupOptions.value, closePopup, {
    /** 원하는 parameter 정의 */
    type: props.multiple,
    searchParam: {
      materialKindCd: 'MKC0000001', // 일반자재
      materialTypeCd: 'MTC0000009', // 화학자재
      upMaterialTypeCd: 'MTC0000008', // 기타
      newChem: 'Y'
    }
  })
}
/******************************
 * TODO (목적): 자재 팝업 닫기
 * @param (1): 선택한 자재 팝업
 *******************************/
function closePopup(data: Array<materialType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (props.type == 'name') {
      valueText.value = data[0].materialName
      emits('name', data[0].materialName)
    } else if (props.type == 'codename') {
      valueText.value = data[0].materialNo + ' / ' + data[0].materialName
      props.data[props.materialName] = data[0].materialName
      emits('name', data[0].materialNo + ' / ' + data[0].materialName)
    } else if (props.type == 'codenameen') {
      valueText.value =
        data[0].materialNo + ' / ' + data[0].materialName + ' / ' + data[0].materialNameEn
      props.data[props.materialName] = data[0].materialName
      props.data[props.materialNameEn] = data[0].materialNameEn
      emits(
        'name',
        data[0].materialNo + ' / ' + data[0].materialName + ' / ' + data[0].materialNameEn
      )
    }
    emits('update:value', data[0].materialCd)
    emits('datachange', data[0])
  }
}
/******************************
 * TODO (목적): 초기화
 *******************************/
function reset() {
  valueText.value = ''
  valueText1.value = ''
  valueText2.value = ''
  valueText3.value = ''
  props.data[props.materialName] = null
  props.data[props.materialNameEn] = null
  emits('update:value', null)
  emits('datachange', null)
}
/******************************
 * TODO (목적): 직접 작성모드 전환
 *******************************/
function edit() {
  /** key-in */
  if (!editing.value) {
    editing.value = true
    setTimeout(() => {
      customEditingInputFirst.value.focus()
    }, 50)
    emits('update:value', 'TEMP')
  } else {
    props.data[props.materialName] = null
    props.data[props.materialNameEn] = null
    editing.value = false
    emits('update:value', null)
  }
  emits('datachange', null)
  valueText.value = ''
  valueText1.value = ''
  valueText2.value = ''
  valueText3.value = ''
}
/******************************
 * TODO (목적): 직접 작성에 따른 값 변경 시
 * @param (1): 변경된 값의 위치
 *******************************/
function datachange(type: string) {
  if (type === '1') {
    emits('update:value', EDIT_PREFIX + valueText1.value)
    // this.$set(props.data, 'materialCd', valueText1.value)
  } else if (type === '2') {
    props.data[props.materialName] = valueText2.value
  } else {
    props.data[props.materialNameEn] = valueText3.value
  }
  valueText.value = valueText1.value + valueText2.value + valueText3.value
  emits('datachange', props.data)
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
<style lang="sass">
.customMaterial
  .q-field__native.row
    padding-left: 3px
    font-size: 0.95em
    padding-top: 4px !important
  .q-field__native
    padding-bottom: 6px !important
  .q-field__label
    margin-left: 5px
  .material-icons
    font-size: 0.8rem
  .dateCloseIcon
    font-size: 0.8rem !important
    display: none
.customMaterial:hover
  .dateCloseIcon
    display: block
.customMaterial.q-field--dense .q-field__control, .customMaterial.q-field--dense .q-field__marginal
  height: 33px !important
  min-height: 33px !important
.customMaterial.q-field--filled .q-field__control
  border: 1px solid rgba(0,0,0,0.15) !important
  padding: 0px 8px 0px 2px

.customMaterial
  .q-field__native
    cursor: pointer
    .q-field__control
      border:0 !important
      padding:0px !important
    .custom-editing-input
      line-height: 18px !important
      padding: 0 !important
      border: 0
    .custom-editing-input:focus
      border: 0 !important
      outline: none

.input-material-div
  padding: 0 !important
  margin-top: -3px
</style>
