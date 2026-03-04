<template>
  <div>
    <q-form ref="editForm">
      <c-card title="기타화학물질 사용량" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-datepicker
              :required="true"
              label="사용년월"
              name="usageMonth"
              type="month"
              v-model:value="etcData.usageMonth"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-task-target
              required
              :editable="editable"
              :disabled="popupParam.disabled"
              :customPopupParam="{ targetKey: 'envProcess' }"
              label="공정명"
              name="processCd"
              v-model:value="etcData.processCd"
              @dataChange="(data1: any, data2: any, data3: any) => dataChange(data3)"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-label-text title="공정번호" name="processNo" v-model:value="etcData.processNo" />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="화학물질명"
              :required="true"
              type="text"
              name="etcChemMaterialsName"
              v-model:value="etcData.etcChemMaterialsName"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량"
              :required="true"
              type="number"
              name="etcChemMaterialsUsage"
              v-model:value="etcData.etcChemMaterialsUsage"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-select
              :editable="editable"
              type="edit"
              label="물질사용단위코드"
              :required="true"
              codeGroupCd="AIR_MATERIAL_UNIT_CD"
              itemText="codeName"
              itemValue="code"
              name="airMaterialUnitCd"
              v-model:value="etcData.airMaterialUnitCd"
            />
          </div>

          <div
            v-if="etcData.airMaterialUnitCd === '14'"
            class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3"
          >
            <c-text
              :editable="editable"
              label="직접입력단위명"
              :disabled="etcData.airMaterialUnitCd !== '14'"
              name="airMaterialUnitName"
              v-model:value="etcData.airMaterialUnitName"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="비고"
              :disabled="false"
              name="comment"
              v-model:value="etcData.comment"
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
              :param="etcData"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-if="Boolean(popupParam.etcChemUsageId) && editable"
              label="삭제"
              icon="delete_forever"
              @btnClicked="remove"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'airMaterialUnitName'">
            <c-text-column
              v-if="props.row.airMaterialUnitCd === '14'"
              :editable="editable"
              :props="props"
              :col="col"
              v-model:value="props.row.airMaterialUnitName"
            />
            <span v-else>
              {{ props.row.airMaterialUnitName }}
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
  name: 'etcChemMaterialsUsage'
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
    etcChemUsageId?: stringNull
    disabled?: boolean
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
      etcChemUsageId: '',
      disabled: false
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
const etcData = ref<any>({
  etcChemUsageId: '', // 기타화학물질사용량ID
  plantCd: '', // 사업장
  usageMonth: '', // 사용년월
  processCd: '', // 공정Id
  processNo: '', // 공정번호
  processName: '', // 공정명
  etcChemMaterialsName: '', // 기타화학물질명
  etcChemMaterialsUsage: '', // 기타화학물질사용량
  airMaterialUnitCd: '', // 원료사용단위코드(AIR_MATERIAL_UNIT_CD)
  airMaterialUnitName: '', // 원료사용단위명
  comment: '', // 비고
  regUserId: '', // 등록자 ID
  chgUserId: '' // 수정자 ID
})

const editable = ref(true)

// const materialUrl = ref('')
const detailUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const updateUrl = ref('')
const insertUrl = ref('')
const editForm = ref<any>(null)
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
  saveUrl.value = transactionConfig.env.ieps.etcChem.save.url
  deleteUrl.value = transactionConfig.env.ieps.etcChem.delete.url
  // 상세 가져오기
  detailUrl.value = selectConfig.env.ieps.etcChem.detail.url
  updateUrl.value = transactionConfig.env.ieps.etcChem.save.url
  insertUrl.value = transactionConfig.env.ieps.etcChem.insert.url
  // code setting
  // etcData.value.usageMonth = getThisMonth()
  // etcData.value.useFlag = 'Y'
  // list setting
  // getMaterialList()
  getDetail()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.etcChemUsageId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.etcChemUsageId),
      method: 'GET'
    }).then((_result: any) => {
      etcData.value = _result.data
    })
  }
}

/******************************
 * TODO (목적): 화학물질 조회(화학물질마스터를 사용할지 키인할지 검토)
 *******************************/
// function getMaterialList() {
// $http({
//   url: materialUrl.value,
//   method: 'GET',
//   params: etcData.value
// }).then((_result: any) => {
//   _.forEach(_result.data, (item) => {
//     materialItems.value.push({
//       code: item.envAirMstMaterialId,
//       codeName: item.envAirMstMaterialName,
//       airMaterialUnitCd: item.airMaterialUnitCd
//     })
//   })
// })
// }

/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (etcData.value.etcChemUsageId) {
    mappingType.value = 'PUT'
    saveUrl.value = updateUrl.value
    etcData.value.chgUserId = user.value.userId
  } else {
    mappingType.value = 'POST'
    saveUrl.value = insertUrl.value
    etcData.value.regUserId = user.value.userId
  }
  editForm.value.validate().then((_result1: boolean) => {
    if (_result1) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '사용년월을 입력하세요.',
        type: 'error'
      })
    }
  })
}

/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.etcChemUsageId = result.data
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
        url: $format(deleteUrl.value, props.popupParam.etcChemUsageId),
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
 * TODO (목적): 데이터 변경에 따른 수정자 셋팅
 *******************************/
function dataChange(_data: any) {
  etcData.value.processNo = _data.processNo
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
