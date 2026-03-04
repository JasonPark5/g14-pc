<template>
  <div>
    <c-tab
      type="horizon"
      :dense="true"
      :inlineLabel="true"
      :tabItems="tabItems"
      :height="tabHeight"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component
          :is="tab.component"
          :popupParam="popupParam"
          :dangerStore="dangerStore"
          :isOld="isOld"
          :contentHeight="contentHeight"
          @getDetail="getDetail"
          @closePopup="closePopup"
        />
      </template>
    </c-tab>
  </div>
</template>

<script setup lang="ts">
import { dangerStorageType } from '@/views/chm/danger/dangerStorage'

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
  name: 'dangerMasterDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  contentHeight?: stringNull
  popupParam: {
    chmDangerMstId?: stringNull
  }
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  contentHeight: null,
  popupParam: () => {
    return {
      chmDangerMstId: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const tab = ref('info')
const editable = ref(true)
const detailUrl = ref('')
const dangerStore = ref<dangerStorageType>({
  chmDangerMstId: '',
  plantCd: '',
  chmDangerArea: '',
  chmDangerManageUserId: '',
  chmDangerMstName: '',
  chmDangerUserId: '',
  chmDangerSafetyUserId: '',
  chmDangerCount: '',
  chmDangerMainUse: '',
  installPermitDate: '',
  permitNo: '',
  useFlag: 'Y',
  chmDangerTypeCd: null,
  typeList: [],
  deleteTypeList: [],
  itemList: [],
  fireFightings: []
})

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.chmDangerMstId))
const tabHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight + 'px' : '500px'
)
const tabItems = computed(() => {
  const _items: Array<tabItemsType> = [
    {
      name: 'info',
      icon: 'info',
      label: '기본정보',
      component: defineAsyncComponent(() => import(`./dangerMasterInfo.vue`))
    }
  ]
  if (isOld.value) {
    _items.push({
      name: 'history',
      icon: 'history',
      label: '점검이력',
      component: defineAsyncComponent(() => import(`./dangerMasterHistory.vue`))
    })
    _items.push({
      name: 'fire',
      icon: 'fire_extinguisher',
      label: '소방시설',
      component: defineAsyncComponent(() => import(`./dangerMasterFire.vue`))
    })
  }
  return _items
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
  editable.value = Boolean(route.meta.editable)
  // url setting
  detailUrl.value = selectConfig.chm.danger.master.get.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세조회
 *******************************/
function getDetail() {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.chmDangerMstId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(dangerStore.value, _result.data)
      emits('setRegInfo', _result.data) // 상세팝업 최초작성/최근수정 정보 노출
    })
  }
}
/******************************
 * TODO (목적): emit
 *******************************/
function closePopup() {
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
