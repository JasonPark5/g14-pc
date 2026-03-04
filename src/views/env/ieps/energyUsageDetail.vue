<template>
  <div>
    <q-form ref="editForm">
      <c-card title="에너지 사용량" class="cardClassDetailForm">
        <!-- 카드 상세 영역 -->
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              :required="true"
              label="사용년월"
              name="usageMonth"
              type="month"
              v-model:value="iepsData.usageMonth"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-select
              :required="true"
              :editable="editable"
              type="edit"
              label="에너지코드"
              codeGroupCd="IEPS_ENERGY_CD"
              itemText="codeName"
              itemValue="code"
              name="iepsEnergyCd"
              v-model:value="iepsData.iepsEnergyCd"
            />
          </div>

          <div
            v-if="iepsData.iepsEnergyCd === '4'"
            class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
          >
            <c-text
              :editable="editable"
              label="직접입력 에너지명"
              :disabled="iepsData.iepsEnergyCd !== '4'"
              name="iepsEnergyName"
              v-model:value="iepsData.iepsEnergyName"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-select
              :editable="editable"
              type="edit"
              label="수급구분코드"
              :required="true"
              codeGroupCd="IEPS_ENERGY_SUPDEM_TYPE_CD"
              itemText="codeName"
              itemValue="code"
              name="iepsEnergySupdemTypeCd"
              v-model:value="iepsData.iepsEnergySupdemTypeCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량"
              :required="true"
              type="number"
              name="energyUsage"
              v-model:value="iepsData.energyUsage"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-select
              :editable="editable"
              type="edit"
              label="사용량 단위코드"
              :required="true"
              codeGroupCd="IEPS_ENERGY_UNIT_CD"
              itemText="codeName"
              itemValue="code"
              name="energyUnitCd"
              v-model:value="iepsData.energyUnitCd"
            />
          </div>
          <div
            v-if="iepsData.energyUnitCd === '14'"
            class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
          >
            <c-text
              :editable="editable"
              label="직접입력 단위명"
              :disabled="iepsData.energyUnitCd !== '14'"
              name="energyUsage"
              v-model:value="iepsData.energyUnitName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="비고"
              :disabled="false"
              name="comment"
              v-model:value="iepsData.comment"
            />
          </div>
        </template>

        <!-- 버튼 영역 -->
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="iepsData"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-if="Boolean(popupParam.energyUsageId) && editable"
              label="삭제"
              icon="delete_forever"
              @btnClicked="remove"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'iepsEnergyName'">
            <c-text-column
              v-if="props.row.iepsEnergyCd === '4'"
              :editable="editable"
              :props="props"
              :col="col"
              v-model:value="props.row.iepsEnergyName"
            />
            <span v-else>
              {{ props.row.iepsEnergyName }}
            </span>
          </template>
          <template v-if="col.name === 'energyUnitName'">
            <c-text-column
              v-if="props.row.energyUnitCd === '14'"
              :editable="editable"
              :props="props"
              :col="col"
              v-model:value="props.row.energyUnitName"
            />
            <span v-else>
              {{ props.row.energyUnitName }}
            </span>
          </template>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'energyUsage'
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
const emits = defineEmits(['closePopup'])
/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    energyUsageId?: stringNull
  }
  contentHeight?: stringNull
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
      energyUsageId: ''
    }
  },
  contentHeight: null
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const iepsData = ref<any>({
  energyUsageId: '', // 에너지사용량ID
  plantCd: '', // 사업장
  usageMonth: '', // 사용년월
  iepsEnergyCd: '', // 에너지코드
  iepsEnergyName: '', // 에너지명(직접입력)
  iepsEnergySupdemTypeCd: '', // 에너지 수급 구분코드
  energyUsage: '', // 에너지사용량
  energyUnitCd: '', // 에너지사용단위코드(IEPS_ENERGY_UNIT_CD)
  energyUnitName: '', // 에너지사용단위명(직접입력)
  comment: '', // 비고
  regUserId: '', // 등록자 ID
  chgUserId: '' // 수정자 ID
})

const editable = ref(true)
const editForm = ref<any>(null)
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const updateUrl = ref('')
const insertUrl = ref('')
const detailUrl = ref('')

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
  // materialUrl.value = selectConfig.env.air.mst.material.list.url
  saveUrl.value = transactionConfig.env.ieps.energy.save.url
  deleteUrl.value = transactionConfig.env.ieps.energy.delete.url

  // 추가
  insertUrl.value = transactionConfig.env.ieps.energy.insert.url
  updateUrl.value = transactionConfig.env.ieps.energy.save.url
  detailUrl.value = selectConfig.env.ieps.energy.detail.url
  // code setting

  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.energyUsageId) {
    mappingType.value = 'PUT'
    iepsData.value.chgUserId = user.value.userId
    saveUrl.value = updateUrl.value
  } else {
    mappingType.value = 'POST'
    iepsData.value.regUserId = user.value.userId
    saveUrl.value = insertUrl.value
  }
  editForm.value.validate().then((_result1: boolean) => {
    if (_result1) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내', // 안내
        message: '사용년월을 입력하세요.',
        type: 'error' // success / info / warning / error
      })
    }
  })
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.energyUsageId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.energyUsageId),
      method: 'GET'
    }).then((_result: any) => {
      iepsData.value = _result.data
    })
  }
}
/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.energyUsageId = result.data
  getDetail()
}

/******************************
 * TODO (목적): 삭제
 *******************************/
function remove() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.energyUsageId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    cancelCallback: () => {}
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
