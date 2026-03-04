<template>
  <div class="fix-height">
    <q-field
      ref="customField"
      class="customUserField"
      :class="[beforeText ? 'before-field' : '']"
      stack-label
      no-error-icon
      :rules="[validRule]"
      :validMessage="validMessage"
      color="orange-custom"
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
        <template v-if="!editing">
          {{ valueText || placeholder }}
        </template>
        <template v-else>
          <input
            class="custom-editing-input"
            ref="custom-editing-input"
            type="text"
            v-model="valueText"
            @update:model-value="datachange"
          />
        </template>
      </template>

      <template v-slot:before>
        <template v-if="beforeText">
          <div class="custom-text-before q-pl-xs q-pr-xs bg-blue-7 text-white">
            {{ beforeText }}
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
  PropType,
  ref,
  computed,
  inject,
  watch,
  onBeforeMount,
  onMounted,
  onBeforeUnmount
} from 'vue'

import { GetTranLanguageFunction } from '@/types/language'
import { storeToRefs } from 'pinia'
import { useSystemInfoStore } from '@stores/systemInfo'
import { popupParamType } from '@/types/popupParam'
import { filter, extend } from 'lodash-es'
import * as popupVues from '@utils/popup'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CField'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const systemInfo = useSystemInfoStore()
const { users, vendorUsers } = storeToRefs(systemInfo)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['username', 'update:value', 'dataChange', 'userInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  value?: string
  data?: any
  deptValue?: string
  plantValue?: string
  label?: string
  editable?: boolean
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  dense?: boolean
  beforeText?: string
  plantCd?: string
  isWrite?: boolean
  userName?: string
  isSuspect?: boolean
  isFirstValue?: boolean
  targetDeptCd?: string
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
  name: 'field',
  value: '',
  data: () => {
    return {
      userId: '',
      deptCd: '',
      userName: '',
      deptName: ''
    }
  },
  deptValue: 'deptCd',
  plantValue: 'plantCd',
  label: '',
  editable: true,
  type: 'user', // user dept_user plant_dept_user detail_user
  placeholder: '',
  required: false,
  disabled: false,
  dense: true,
  beforeText: '',
  plantCd: '',
  isWrite: false,
  userName: 'userName',
  isSuspect: false,
  isFirstValue: true,
  targetDeptCd: ''
})

/******************************
 * @VModel_선언
 *******************************/
const vValue = defineModel('value', {
  default: '',
  type: String as PropType<string | null | undefined>
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const customField = ref<any>(null)
const valueText = ref('')
const editing = ref(false)
const setEvent = ref(false)
const userListTemp = ref<any[]>([])
const vendorListTemp = ref<any[]>([])
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '60%',
  param: {},
  closeCallback: () => {}
})

/******************************
 * @Computed_선언
 *******************************/
const userList = computed(() => {
  const _users =
    userListTemp.value.length > 0
      ? userListTemp.value
      : props.plantCd
        ? users.value.filter((user: any) => user.plantCd === props.plantCd)
        : users.value

  const _vendorUsers = vendorListTemp.value.length > 0 ? vendorListTemp.value : vendorUsers.value

  return [..._users, ..._vendorUsers]
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.value,
  () => {
    vValue.value = props.value
    setValueText()
  },
  { deep: true }
)
watch(
  () => props.disabled,
  () => {
    if (setEvent.value && props.disabled) {
      setEvent.value = true
      customField.value.$el
        .getElementsByClassName('q-field__native')[0]
        .addEventListener('click', search)
    }
  },
  { deep: true }
)
watch(
  () => editing,
  () => {
    if (editing.value) {
      customField.value.$el
        .getElementsByClassName('q-field__native')[0]
        .removeEventListener('click', search)
    } else {
      customField.value.$el
        .getElementsByClassName('q-field__native')[0]
        .addEventListener('click', search)
    }
  },
  { deep: true }
)
watch(
  users,
  () => {
    userListTemp.value = props.plantCd
      ? filter(users.value, { plantCd: props.plantCd })
      : users.value
  },
  { deep: true }
)
watch(
  vendorUsers,
  () => {
    vendorListTemp.value = vendorUsers.value
  },
  { deep: true }
)
/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  vValue.value = props.value || ''
  if (props.isFirstValue && users.value?.length > 0) {
    setValueText()
  }
})
onMounted(() => {
  if (!props.disabled) {
    setEvent.value = true
    customField.value.$el
      .getElementsByClassName('q-field__native')[0]
      .addEventListener('click', search)
  }
})
onBeforeUnmount(() => {
  if (!props.disabled) {
    customField.value.$el
      .getElementsByClassName('q-field__native')[0]
      .removeEventListener('click', search)
  }
})
/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
function setValueText() {
  if (vValue.value) {
    const user = userList.value.find(
      (item: any) => item.userId === vValue.value || item.vendorUserCd === vValue.value
    )
    if (user) {
      const userName = user.userName || user.personName
      const deptName = user.deptName || user.vendorName
      const jobName = user.jobName || ''
      const spotName = user.spotName || ''
      valueText.value =
        props.type === 'user'
          ? userName
          : props.type === 'dept_user'
            ? `${deptName} / ${userName}`
            : props.type === 'plant_dept_user'
              ? `${user.plantName} / ${deptName} / ${userName}`
              : props.type === 'dept_job_user'
                ? `${deptName} / ${jobName} / ${userName}`
                : props.type === 'dept_spot_user'
                  ? `${deptName} / ${spotName} / ${userName}`
                  : props.type === 'detail_user'
                    ? `${deptName} / ${user.empNo} / ${userName}`
                    : ''
    } else if (props.type === 'dept_user' && (props.disabled || !props.editable)) {
      valueText.value = vValue.value
    } else {
      emits('update:value', null)
      valueText.value = ''
    }
  } else if (props.data && props.userName) {
    valueText.value = props.data[props.userName] || ''
  } else {
    valueText.value = ''
  }
}

function edit() {
  editing.value = !editing.value
  setTimeout(() => {
    const inputElement = document.querySelector('.custom-editing-input') as HTMLInputElement
    inputElement?.focus()
  }, 50)
  reset()
}

function search() {
  const managePopupOptions = popupVues.getPopupOption('user')
  if (managePopupOptions) {
    const popupParam: any = extend(
      {
        type: 'single',
        searchParam: {
          plantCd: props.plantCd
        }
      },
      managePopupOptions.param
    )
    popupOptions.value.title = '사용자 검색'
    popupOptions.value.param = popupParam
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/components/commonPop.vue`))
    )
    popupOptions.value.visible = true
    popupOptions.value.width = '50%'
    popupOptions.value.closeCallback = closePopup
  }
}

function closePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const userId = data[0].userId || data[0].vendorUserCd
    const userName = data[0].userName || data[0].personName
    const deptCd = data[0].deptCd || data[0].vendorCd
    const deptName = data[0].deptName || data[0].vendorName
    const plantName = data[0].plantName
    if (props.type === 'user') {
      valueText.value = userName + ' ' + data[0].jobName
    } else if (props.type === 'dept_user') {
      props.data[props.deptValue] = deptCd
      valueText.value = deptName + ' / ' + userName + ' ' + data[0].jobName
    } else if (props.type === 'dept_job_user') {
      props.data[props.deptValue] = deptCd
      valueText.value = deptName + ' / ' + data[0].jobName + ' / ' + userName
    } else if (props.type === 'plant_dept_user') {
      // 협력업체 포탈에서 사용하지 않음
      props.data[props.deptValue] = deptCd
      props.data[props.plantValue] = data[0].plantCd
      valueText.value = plantName + ' / ' + deptName + ' / ' + userName
    } else if (props.type === 'detail_user') {
      props.data[props.deptValue] = deptCd
      valueText.value =
        data[0].upDeptName +
        ' / ' +
        deptName +
        ' / ' +
        data[0].empNo +
        ' / ' +
        userName +
        ' / ' +
        data[0].birthDate
    }
    emits('username', userName)
    emits('update:value', userId)
    emits('dataChange', userId, data[0])
    emits('userInfo', data[0])
  }
}

function reset() {
  valueText.value = ''
  emits('update:value', null)
  emits('username', null)
  emits('dataChange', null)
  emits('userInfo', null)
}

function datachange() {
  if (props.data && props.userName) {
    props.data[props.userName] = valueText.value
  }
  emits('dataChange', valueText.value)
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
