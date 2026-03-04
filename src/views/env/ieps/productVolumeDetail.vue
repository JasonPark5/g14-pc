<template>
  <div>
    <q-form ref="editForm">
      <c-card title="제품 생산량" class="cardClassDetailForm">
        <!-- 카드 상세 영역 -->
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              :required="true"
              label="사용년월"
              name="usageMonth"
              type="month"
              v-model:value="productVolumeData.usageMonth"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :required="true"
              :editable="editable"
              label="생산제품번호"
              type="text"
              name="iepsProductNo"
              v-model:value="productVolumeData.iepsProductNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :required="true"
              :editable="editable"
              label="생산제품명"
              type="text"
              name="iepsProductName"
              v-model:value="productVolumeData.iepsProductName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :required="true"
              :editable="editable"
              label="제품구분명"
              type="text"
              name="iepsProductTypeName"
              v-model:value="productVolumeData.iepsProductTypeName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :required="true"
              :editable="editable"
              label="생산량"
              type="number"
              name="productVolume"
              v-model:value="productVolumeData.productVolume"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-select
              :required="true"
              :editable="editable"
              type="edit"
              label="생산량 단위코드"
              codeGroupCd="IEPS_PRODUCT_VOLUME_UNIT_CD"
              itemText="codeName"
              itemValue="code"
              name="productVolumeUnitCd"
              v-model:value="productVolumeData.productVolumeUnitCd"
            />
          </div>
          <div
            v-if="productVolumeData.productVolumeUnitCd === '14'"
            class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
          >
            <c-text
              :editable="editable"
              label="직접입력 단위명"
              :disabled="productVolumeData.productVolumeUnitCd !== '14'"
              name="productVolumeUnitName"
              v-model:value="productVolumeData.productVolumeUnitName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="비고"
              :disabled="false"
              name="comment"
              v-model:value="productVolumeData.comment"
            />
          </div>
        </template>
        <!-- 카드 버튼 영역 -->
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="productVolumeData"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-if="Boolean(popupParam.productVolumeId) && editable"
              label="삭제"
              icon="delete_forever"
              @btnClicked="remove"
            />
          </q-btn-group>
        </template>

        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'productVolumeUnitName'">
            <c-text-column
              v-if="props.row.productVolumeUnitCd === '14'"
              :editable="editable"
              :props="props"
              :col="col"
              v-model:value="props.row.productVolumeUnitName"
            />
            <span v-else>
              {{ props.row.productVolumeUnitName }}
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
  name: 'productVolumeDetail'
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
    productVolumeId?: stringNull
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
      productVolumeId: ''
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

const productVolumeData = ref<any>({
  productVolumeId: '', // 제품생산량ID
  plantCd: '', // 사업장
  usageMonth: '', // 사용년월
  iepsProductNo: '', // 생산제품번호
  iepsProductName: '', // 생산제품명
  iepsProductTypeName: '', // 제품구분명
  productVolume: 0, // 생산량
  productVolumeUnitCd: '', // 생산량단위코드(IEPS_PRODUCT_VOLUME_UNIT_CD)
  productVolumeUnitName: '', // 생산량단위명(직접입력)
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
  //listUrl.value = selectConfig.env.ieps.product.list.url
  saveUrl.value = transactionConfig.env.ieps.product.save.url
  deleteUrl.value = transactionConfig.env.ieps.product.delete.url
  // code setting
  detailUrl.value = selectConfig.env.ieps.product.detail.url
  insertUrl.value = transactionConfig.env.ieps.product.insert.url
  updateUrl.value = transactionConfig.env.ieps.product.save.url

  // list setting
  getDetail()
}

function getDetail() {
  if (props.popupParam.productVolumeId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.productVolumeId),
      method: 'GET'
    }).then((_result: any) => {
      productVolumeData.value = _result.data
    })
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.productVolumeId) {
    mappingType.value = 'PUT'
    productVolumeData.value.chgUserId = user.value.userId
    saveUrl.value = updateUrl.value
  } else {
    mappingType.value = 'POST'
    productVolumeData.value.regUserId = user.value.userId
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
        message: '필수항목을 입력해주세요.',
        type: 'error' // success / info / warning / error
      })
    }
  })
}

/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.productVolumeId = result.data
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
        url: $format(deleteUrl.value, props.popupParam.productVolumeId),
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
