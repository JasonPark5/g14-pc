<template>
  <div>
    <q-form ref="editForm">
      <c-card class="cardClassDetailForm passwordChangeArea">
        <template v-slot:card-detail>
          <div class="col-12">
            <c-label-text
              title="기존 아이디"
              style="padding-bottom: 25px !important"
              :value="portalInfo.loginId"
            />
          </div>
          <div class="col-12">
            <c-text
              :required="true"
              label="변경할 아이디 (영문+숫자 조합 5자리 이상)"
              name="portalId"
              type="text"
              v-model:value="portalInfo.portalId"
            />
          </div>
          <div class="col-12" style="text-align: right">
            <q-btn-group outline>
              <c-btn label="아이디 변경" icon="save" @btnClicked="saveId" />
            </q-btn-group>
          </div>
        </template>
      </c-card>
    </q-form>
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
import { portalIdType, protalIdPopupParamType } from './portalIdChange'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'portalIdChange'
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
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam?: protalIdPopupParamType
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      vendorCd: '',
      loginId: ''
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
const portalInfo = ref<portalIdType>({
  vendorCd: '',
  loginId: '',
  portalId: '',
  chgUserId: ''
})
const saveUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/

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
  saveUrl.value = transactionConfig.mdm.cim.vendor.chgId.url
  // code setting
  portalInfo.value.vendorCd = props.popupParam.vendorCd
  portalInfo.value.loginId = props.popupParam.loginId
  portalInfo.value.chgUserId = user.value.userId
  // list setting
}
function saveId() {
  const idReg = {
    lowerCase: /[a-z]/g,
    upperCase: /[A-Z]/g,
    numberCase: /[0-9]/g,
    lowerCaseTest: false,
    upperCaseTest: false,
    numberCaseTest: false
  }

  if (portalInfo.value.portalId === '') {
    message.alert({
      title: '안내',
      message: '변경할 아이디를 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  } else {
    idReg.lowerCaseTest = idReg.lowerCase.test(portalInfo.value.portalId)
    idReg.upperCaseTest = idReg.upperCase.test(portalInfo.value.portalId)
    idReg.numberCaseTest = idReg.numberCase.test(portalInfo.value.portalId)
    const resultTest = _.filter(idReg, (value) => {
      return value === false
    })
    if (resultTest.length > 1 || portalInfo.value.portalId.length < 5) {
      message.alert({
        title: '안내',
        message: '아이디는 최소 5자리여야 하며, 영문/숫자를 포함해야합니다.',
        type: 'warning' // success / info / warning / error
      })
      return
    } else {
      $http({
        url: saveUrl.value,
        method: 'PUT',
        data: portalInfo.value
      }).then((_result: any) => {
        if (_result.data == 'DUPLICATE') {
          message.alert({
            title: '안내',
            message: '사용중인 아이디가 있습니다.',
            type: 'warning' // success / info / warning / error
          })
        } else {
          message.alert({
            title: '안내',
            message: '접속 아이디가 변경되었습니다.',
            type: 'success' // success / info / warning / error
          })
          emits('closePopup', { portalId: _result })
        }
      })
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.passwordChangeArea
  .titleArea
    width: 100%
    .title
      font-size:2em
      font-weight: 700
      text-align: center
      .emphasis
        color: #C10015
    .subtitle
      font-size:1.05em
      font-weight: 500
</style>
