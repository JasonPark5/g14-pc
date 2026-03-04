<template>
  <div>
    <q-form ref="editForm">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="건강검진 기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-show="editable && isOld"
                label="삭제"
                icon="delete_forever"
                @btnClicked="remove"
              />
              <c-btn
                v-show="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="checkUp"
                :mappingType="saveType"
                label="저장"
                icon="save"
                @beforeAction="savePlan"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                required
                :editable="editable"
                :disabled="isOld"
                :comboItems="comboItems"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="hospitalId"
                label="병원"
                v-model:value="checkUp.hospitalId"
                @update:value="(val: any) => setTitle(val, 1)"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                required
                :editable="editable"
                :disabled="checkUp.typeFlag === 'N' || isOld"
                codeGroupCd="CHECK_UP_TYPE_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="checkupTypeCd"
                label="건강검진 종류"
                v-model:value="checkUp.checkupTypeCd"
                @update:value="(val: any) => setTitle(val, 2)"
              />
            </div>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-plant required type="edit" name="plantCd" v-model:value="checkUp.plantCd" />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                required
                :range="true"
                label="건강검진 기간"
                name="checkupDateArray"
                v-model:value="checkUp.checkupDateArray"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                required
                label="제목"
                name="checkupName"
                v-model:value="checkUp.checkupName"
              />
            </div>
          </template>
        </c-card>
      </div>
    </q-form>
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
import { checkupType, hospitalType } from './checkupType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'checkUpPlan'
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
const emits = defineEmits(['changeStatus', 'getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    heaCheckupPlanId: stringNull
  }
  checkUp: checkupType
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
      heaCheckupPlanId: ''
    }
  },
  checkUp: () => {
    return {
      heaCheckupPlanId: '',
      plantCd: '',
      checkupName: '',
      checkupTypeCd: null,
      checkupStartDate: '',
      checkupEndDate: '',
      regUserId: '',
      chgUserId: '',
      hospitalId: '',
      hospitalLocation: '',
      typeFlag: '',
      checkupDateArray: []
    }
  },
  temp: null,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const isSave = ref(false)
const saveType = ref('POST')
const comboItems = ref<hospitalType[]>([])
const saveUrl = ref('')
const deleteUrl = ref('')
const targetUserUrl = ref('')
const editForm = ref<any>(null)
const hospitalName = ref('')
const checkupTypeName = ref<stringNull>('')

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.heaCheckupPlanId))

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => [props.checkUp.hospitalId, checkupTypeName.value, props.checkUp.checkupDateArray],
  () => {
    if (
      !props.popupParam.heaCheckupPlanId &&
      props.checkUp.hospitalId &&
      props.checkUp.checkupTypeCd &&
      props.checkUp.checkupDateArray &&
      props.checkUp.checkupDateArray.length === 2
    ) {
      props.checkUp.checkupName = `${hospitalName.value} / ${checkupTypeName.value} / ${props.checkUp.checkupDateArray[0]}~${props.checkUp.checkupDateArray[1]}`
    }
  }
)

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
  targetUserUrl.value = selectConfig.hea.checkup.plan.target.users.url
  saveUrl.value = transactionConfig.hea.checkup.plan.insert.url
  deleteUrl.value = transactionConfig.hea.checkup.plan.delete.url
  // code setting
  // list setting
  setHospital()
}
/******************************
 * TODO (목적): 검진받은 병원 이름 가져오기
 *******************************/
function setHospital() {
  $http({
    url: selectConfig.hea.hospital.list.url,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    _.forEach(_result.data, (_item) => {
      comboItems.value.push({
        code: _item.hospitalId,
        codeName: _item.hospitalName,
        typeFlag: _item.typeFlag
      })
    })
  })
}

/******************************
 * TODO (목적): 검진결과의 플랜 저장
 *******************************/
function savePlan() {
  saveType.value = props.checkUp.heaCheckupPlanId ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          props.checkUp.regUserId = user.value.userId
          props.checkUp.chgUserId = user.value.userId
          if (props.checkUp.checkupDateArray && props.checkUp.checkupDateArray.length > 0) {
            props.checkUp.checkupStartDate = props.checkUp.checkupDateArray[0]
            props.checkUp.checkupEndDate = props.checkUp.checkupDateArray[1]
          }
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  if (!props.checkUp.heaCheckupPlanId) emits('changeStatus', result.data)
  else emits('getDetail')
}

/******************************
 * TODO (목적): 검진결과의 플랜 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까? 계획과 결과의 모든 정보가 삭제됩니다.',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.checkUp.heaCheckupPlanId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup', 'REMOVE')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
async function setTitle(_data: any, num: numberNull) {
  if (num === 1)
    hospitalName.value = comboItems.value.find((item: any) => item.code === _data)?.codeName
  else if (num === 2) {
    const codeName = await getCodeName('CHECK_UP_TYPE_CD', _data)
    checkupTypeName.value = codeName
  }
}
</script>
