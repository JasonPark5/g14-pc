<template>
  <q-form ref="editForm">
    <c-card title="점검항목" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="preStartupCheckItem"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="savePreStartupCheckItem"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <!-- <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            :required="true"
            :disabled="disabled"
            :editable="editable"
            class="q-pb-sm"
            type="edit"
            name="plantCd"
            v-model:value="preStartupCheckItem.plantCd"
          />
        </div> -->
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :required="true"
            :disabled="disabled"
            :editable="editable"
            class="q-pb-sm"
            codeGroupCd="PSR_CHECK_TYPE_CD"
            type="edit"
            itemText="codeName"
            itemValue="code"
            name="psrCheckTypeCd"
            label="점검유형"
            v-model:value="preStartupCheckItem.psrCheckTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-text
            v-show="showLevel1"
            class="q-pb-sm"
            :disabled="true"
            :editable="editable"
            label="대분류"
            name="first"
            v-model:value="first"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-text
            v-show="showLevel2"
            class="q-pb-sm"
            :disabled="true"
            :editable="editable"
            label="중분류"
            name="second"
            v-model:value="second"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-text
            :required="true"
            :editable="editable"
            label="항목명"
            name="sopPrestartupCheckItemName"
            v-model:value="preStartupCheckItem.sopPrestartupCheckItemName"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-radio
            :editable="editable"
            :comboItems="useFlagItems"
            label="사용여부"
            name="useFlag"
            v-model:value="preStartupCheckItem.useFlag"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
          <c-text
            :editable="editable"
            type="number"
            label="순번"
            name="sortOrder"
            v-model:value="preStartupCheckItem.sortOrder"
          />
        </div>
      </template>
    </c-card>
  </q-form>
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
  name: 'preStartupReviewItemDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  popupParam: {
    sopPrestartupCheckItemId: stringNull
    psrDataLevelCd: stringNull
    level: {
      psrCheckTypeCd: stringNull
      first: stringNull
      second: stringNull
    }
  }
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
  popupParam: () => {
    return {
      sopPrestartupCheckItemId: '',
      psrDataLevelCd: '',
      level: {
        psrCheckTypeCd: '',
        first: '',
        second: ''
      }
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
const editable = ref(true)
const isSave = ref(false)
const mappingType = ref('POST')
const saveUrl = ref('')
const detailUrl = ref('')
const preStartupCheckItem = ref<any>({
  sopPrestartupCheckItemId: '', // 점검항목번호
  sopPrestartupCheckItemName: '', // 점검항목명
  plantCd: null, // 사업장코드
  psrCheckTypeCd: null, // 점검유형
  psrDataLevelCd: null, // 데이터 레벨
  psopPrestartupCheckItemId: '', // 상위 점검항목
  useFlag: 'Y', // 사용여부
  sortOrder: 0, // 순번
  regUserId: '', // 등록자 ID
  chgUserId: '' // 수정자 ID
})
const first = ref('')
const second = ref('')
const useFlagItems = ref<codeMasterType>([])
const showLevel1 = ref(false)
const showLevel2 = ref(false)
const editForm = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(() => {
  return props.popupParam.sopPrestartupCheckItemId || showLevel1.value || showLevel2.value
    ? true
    : false
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
  detailUrl.value = selectConfig.sop.psr.checkItem.get.url
  saveUrl.value = transactionConfig.sop.psr.checkItem.insert.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getPreStartupCheckItem()
}
function getPreStartupCheckItem() {
  /**
   * 데이터 레벨에 따라 표시하는 영역을 따로 표기
   *
   *  # 대분류 : showLevel1, showLevel2 false & 대분류, 중분류 리스트 조회 X
   *  # 중분류 : showLevel1 true, showLevel2 false & 대분류 리스트 조회, 중분류 리스트 조회 X
   *  # 대분류 : showLevel1, showLevel2 true & 대분류, 중분류 리스트 조회
   */
  if (!props.popupParam.level.first) {
    showLevel1.value = false
    showLevel2.value = false
  } else if (!props.popupParam.level.second) {
    showLevel1.value = true
    showLevel2.value = false
    getLevelItems(props.popupParam.level.first, 1)
  } else {
    showLevel1.value = true
    showLevel2.value = true
    getLevelItems(props.popupParam.level.first, 1)
    getLevelItems(props.popupParam.level.second, 2)
  }

  /**
   * 데이터 조회
   */
  if (props.popupParam.sopPrestartupCheckItemId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.sopPrestartupCheckItemId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(preStartupCheckItem.value, _result.data)
    })
  } else {
    preStartupCheckItem.value.psrCheckTypeCd = props.popupParam.level.psrCheckTypeCd
    preStartupCheckItem.value.psopPrestartupCheckItemId = props.popupParam.level.second
      ? props.popupParam.level.second
      : props.popupParam.level.first

    getComboItems('PSR_DATA_LEVEL_CD').then((_result: any) => {
      preStartupCheckItem.value.psrDataLevelCd = props.popupParam.level.second
        ? _result[2].code
        : props.popupParam.level.first
          ? _result[1].code
          : _result[0].code
    })
  }
}
function getLevelItems(_psopPrestartupCheckItemId: any, _level: any) {
  $http({
    url: $format(detailUrl.value, _psopPrestartupCheckItemId),
    method: 'GET'
  }).then((_result: any) => {
    if (_level === 1) {
      // 대분류
      first.value = _result.data.sopPrestartupCheckItemName
    } else {
      // 중분류
      second.value = _result.data.sopPrestartupCheckItemName
    }
  })
}
function savePreStartupCheckItem() {
  if (props.popupParam.sopPrestartupCheckItemId) {
    saveUrl.value = transactionConfig.sop.psr.checkItem.update.url
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.sop.psr.checkItem.insert.url
    mappingType.value = 'POST'
  }

  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          preStartupCheckItem.value.regUserId = user.value.userId
          preStartupCheckItem.value.chgUserId = user.value.userId

          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(_result: any) {
  props.popupParam.sopPrestartupCheckItemId = _result.data
  message.requestSuccess()
  getPreStartupCheckItem()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
