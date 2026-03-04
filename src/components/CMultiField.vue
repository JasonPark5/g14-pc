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
      v-model="multiUsers"
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
        <q-chip
          v-for="(user, index) in multiUsers"
          :key="index"
          outline
          square
          :removable="!disabled && editable"
          color="primary"
          text-color="white"
          class="q-ma-none customchipdept"
          @remove="remove(user)"
        >
          <template v-if="type === 'user'">
            {{ user.userName }}
          </template>
          <template v-else-if="type === 'dept_user'">
            {{ user.deptName }} / {{ user.userName }}
          </template>
        </q-chip>
      </template>

      <template v-slot:before>
        <template v-if="beforeText">
          <div class="custom-text-before q-pl-xs q-pr-xs bg-blue-7 text-white">
            {{ beforeText }}
          </div>
        </template>
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
import { ref, computed, inject, watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'

import { GetTranLanguageFunction } from '@/types/language'
import { popupParamType } from '@/types/popupParam'
import { cloneDeep, find, forEach, map, indexOf, concat, findIndex } from 'lodash-es'

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
  name: 'CMultiField'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const systemInfo = useSystemInfoStore()
const { users } = storeToRefs(systemInfo)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['update:value', 'dataChange', 'removeData', 'user'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  value: objectStringNumber | arrayObject | undefined | null
  userInfo?: any
  label?: string
  editable?: boolean
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  dense?: boolean
  beforeText?: string
  plantCd?: string
  deptCd?: stringNull
  isArray?: boolean
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
  userInfo: () => {
    return {
      userItems: [],
      userText: 'userName',
      userValue: 'userId',
      deptText: 'deptName',
      deptValue: 'deptCd'
    }
  },
  label: '',
  editable: true,
  type: 'user', // user dept_user plant_dept_user detail_user
  placeholder: '',
  required: false,
  disabled: false,
  dense: false,
  beforeText: '',
  plantCd: '',
  deptCd: '',
  isArray: false
})

/******************************
 * @VModel_선언
 *******************************/
const vValue = ref<arrayObject | arrayString | string | undefined | null>('')

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const customField = ref<any>(null)
const userList = ref<any[]>([])
const setEvent = ref(false)
const isString = ref(true)
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
const multiUsers = computed(() => {
  const _users: any = []
  if (userList.value && userList.value.length > 0 && props.value) {
    let splitUserId: any = []
    if (typeof vValue.value === 'string') {
      splitUserId = vValue.value.split(',')
    } else {
      splitUserId = cloneDeep(vValue.value)
    }
    forEach(splitUserId, (userId) => {
      const data = find(userList.value, { userId })
      if (data) {
        _users.push({
          userId: data.userId,
          userName: data.userName,
          deptCd: data.deptCd,
          deptName: data.deptName
        })
      }
    })
  }
  return _users
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
  }
)
watch(
  () => multiUsers.value,
  () => {
    if (multiUsers.value && multiUsers.value.length > 0) {
      if (props.userInfo.userItems && props.userInfo.userItems.length > 0) {
        const deleteUserIdx: any = []
        _.forEach(props.userInfo.userItems, (user) => {
          const data = _.find(multiUsers.value, (item) => {
            return user[props.userInfo.userValue] === item.userId
          })
          if (data) {
            user[props.userInfo.userValue] = data.userId
            user[props.userInfo.userText] = data.userName
            if (props.type === 'dept_user') {
              user[props.userInfo.deptValue] = data.deptCd
              user[props.userInfo.deptText] = data.deptName
            }
          } else {
            deleteUserIdx.push(
              _.findIndex(props.userInfo.userItems, (item: any) => {
                return item[props.userInfo.userValue] === user[props.userInfo.userValue]
              })
            )
          }
        })
        _.forEach(deleteUserIdx, (idx) => {
          props.userInfo.userItems.splice(idx, 1)
        })

        _.forEach(multiUsers.value, (user) => {
          if (
            _.findIndex(props.userInfo.userItems, (item: any) => {
              return item[props.userInfo.userValue] === user.userId
            }) === -1
          ) {
            const pushData: any = {}
            pushData[props.userInfo.userValue] = user.userId
            pushData[props.userInfo.userText] = user.userName
            if (props.type === 'dept_user') {
              pushData[props.userInfo.deptValue] = user.deptCd
              pushData[props.userInfo.deptText] = user.deptName
            }
            props.userInfo.userItems.push(pushData)
          }
        })
      } else {
        _.forEach(multiUsers.value, (user) => {
          const pushData: any = {}
          pushData[props.userInfo.userValue] = user.userId
          pushData[props.userInfo.userText] = user.userName
          if (props.type === 'dept_user') {
            pushData[props.userInfo.deptValue] = user.deptCd
            pushData[props.userInfo.deptText] = user.deptName
          }
          props.userInfo.userItems.push(pushData)
        })
      }
    } else {
      if (props.userInfo.userItems && props.userInfo.userItems.length > 0) {
        props.userInfo.userItems.splice(0, props.userInfo.userItems.length)
      }
      // this.$set(props.userInfo, 'userItems', [])
    }
  },
  { deep: true }
)

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  vValue.value = props.value
  isString.value = typeof vValue.value === 'string'
  setValueText()
})

onMounted(() => {
  if (!props.disabled && !setEvent.value) {
    setEvent.value = true
    customField.value.$el
      .getElementsByClassName('q-field__native')[0]
      .addEventListener('click', search)
  }
})

onBeforeUnmount(() => {
  // if (!props.disabled) {
  //   customField.value.$el
  //     .getElementsByClassName('q-field__native')[0]
  //     .addEventListener('click', search)
  // }
})

/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
async function getUserList() {
  try {
    userList.value = users.value
    setValueText()
  } catch (error) {
    console.error('Error fetching list:', error)
  }
}

function setValueText() {
  if (vValue.value) {
    if (userList.value.length === 0) {
      getUserList()
    }
  }
}

function search() {
  // 공통팝업 소스(들고가서 변경)
  popupOptions.value = getPopupOptions('user', popupOptions.value, closePopup, {
    type: 'multiple',
    searchParam: {
      deptCd: props.deptCd
    }
  })
}
function closePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const emitUsers: any = []
    forEach(data, (item) => {
      if (findIndex(multiUsers.value, { userId: item.userId }) === -1) {
        emitUsers.push(item)
      }
    })
    let emitUserId: any = cloneDeep(vValue.value)
    if (typeof vValue.value === 'string' || isString.value || !props.isArray) {
      // 문자열로 들어온 경우
      // 문자열이 있는경우 ',' 붙임.
      if (emitUserId) {
        emitUserId += ',' + map(emitUsers, 'userId').toString()
      } else {
        emitUserId = map(emitUsers, 'userId').toString()
      }
    } else {
      // 배열로 들어온 경우
      if (emitUserId) {
        emitUserId = concat(emitUserId, map(emitUsers, 'userId'))
      } else {
        emitUserId = map(emitUsers, 'userId')
      }
    }

    emits('update:value', emitUserId)
    emits('dataChange', emitUserId)
    emits('user', emitUsers)
  }
}

function reset() {
  emits('update:value', null)
  emits('dataChange', null)
  emits('user', null)
}

function remove(user: any) {
  let emitUserId: any = ''
  let splitUserId: any = []

  if (typeof vValue.value === 'string') {
    splitUserId = vValue.value?.split(',')
    splitUserId.splice(indexOf(splitUserId, user.userId), 1)
    emitUserId = splitUserId.toString()
  } else {
    splitUserId = vValue.value
    splitUserId.splice(indexOf(splitUserId, user.userId), 1)
    emitUserId = splitUserId
  }
  const emitUsers = multiUsers.value.filter((u: any) => u.userId !== user.userId)

  emits('update:value', emitUserId)
  emits('dataChange', emitUserId)
  emits('removeData', user.userId)
  emits('user', emitUsers)
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
