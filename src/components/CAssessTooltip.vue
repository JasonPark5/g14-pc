<template>
  <q-tooltip
    :content-class="contentClass"
    :content-style="contentStyle"
    anchor="bottom left"
    :offset="[0, 5]"
  >
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label style="font-size: 12px; font-weight: bold; color: yellow">{{
            title
          }}</q-item-label>
          <q-item-label
            caption
            lines="2"
            class="text-white opacity-6"
            style="max-width: 300px !important"
            >{{ contents['ibm_title'].text }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
  </q-tooltip>
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
  name: 'CAssessTooltip'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  ibmTooltip?: string
  ibmClassCd?: string
  contentClass?: string
  contentStyle?: string
  isVendor?: boolean
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
  ibmTooltip: '',
  ibmClassCd: '',
  contentClass: 'bg-dark text-white',
  contentStyle: 'margin-top:-10px !important',
  isVendor: false
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/

/******************************
 * @Computed_선언
 *******************************/
const contentsItems = computed(() => ['제목', '조치부서', '조치완료 요청일', '조치일'])
const contentsVendorItems = computed(() => ['제목', '조치일'])
const contents = computed(() => {
  const _contents: any = {}
  if (props.ibmTooltip) {
    let idx = 0
    _.forEach(_.split(props.ibmTooltip, '|'), (splitItem) => {
      const _item = _.split(splitItem, ':')
      _contents[_item[0]] = {
        text: _item[1],
        label: !props.isVendor ? contentsItems.value[idx] : contentsVendorItems.value[idx]
      }
      idx++
    })
  }
  return _contents
})
const title = computed(() => {
  let text = ''
  if (contents.value) {
    if (!props.isVendor) {
      if (!props.ibmClassCd || props.ibmClassCd === 'IC00000001') {
        text += `${$language('[개선]')} ${contents.value['action_dept_name'] ? contents.value['action_dept_name'].text : ''} / ${contents.value['action_complete_request_date'] ? contents.value['action_complete_request_date'].text : ''}`
      } else if (props.ibmClassCd === 'IC00000005') {
        text += `${$language('[즉시]')} ${contents.value['action_dept_name'] ? contents.value['action_dept_name'].text : ''} / ${contents.value['action_complete_date'] ? contents.value['action_complete_date'].text : ''}`
      }
    } else {
      text += `[Punch-list] ${contents.value['action_complete_date'] ? contents.value['action_complete_date'].text : ''}`
    }
  }
  return text
})

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
  // url setting
  // code setting
  // list setting
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
