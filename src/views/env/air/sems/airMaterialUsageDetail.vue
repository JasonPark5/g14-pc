<template>
  <div>
    <q-form ref="editForm">
      <c-card title="원료사용량" class="cardClassDetailForm">
        <!-- 카드 버튼 영역 -->
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              :url="saveUrl"
              :isSubmit="isSave"
              :param="materialData"
              :mappingType="mappingType"
              label="저장"
              icon="save"
              @beforeAction="saveInfo"
              @btnCallback="saveCallback"
            />
            <c-btn
              v-if="Boolean(popupParam.envAirSemsMaterialUsageId) && editable"
              label="삭제"
              icon="delete_forever"
              @btnClicked="remove"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-datepicker
              :required="true"
              label="사용년도"
              name="usageYear"
              type="year"
              v-model:value="materialData.usageYear"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-select
              :required="true"
              :editable="editable"
              type="edit"
              label="원료명"
              :comboItems="materialItems"
              itemText="codeName"
              itemValue="code"
              name="envAirMstMaterialId"
              v-model:value="materialData.envAirMstMaterialId"
              @datachange="onMaterialChange"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
            <c-label-text title="사용량단위" :value="materialData.airMaterialUnitName" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 1월"
              type="number"
              name="usageVolume1"
              v-model:value="materialData.usageVolume1"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 2월"
              type="number"
              name="usageVolume2"
              v-model:value="materialData.usageVolume2"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 3월"
              type="number"
              name="usageVolume3"
              v-model:value="materialData.usageVolume3"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 4월"
              type="number"
              name="usageVolume4"
              v-model:value="materialData.usageVolume4"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text-number
              :editable="editable"
              label="사용량 5월"
              name="usageVolume5"
              v-model:value="materialData.usageVolume5"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 6월"
              type="number"
              name="usageVolume6"
              v-model:value="materialData.usageVolume6"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 7월"
              type="number"
              name="usageVolume7"
              v-model:value="materialData.usageVolume7"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 8월"
              type="number"
              name="usageVolume8"
              v-model:value="materialData.usageVolume8"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 9월"
              type="number"
              name="usageVolume9"
              v-model:value="materialData.usageVolume9"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 10월"
              type="number"
              name="usageVolume10"
              v-model:value="materialData.usageVolume10"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 11월"
              type="number"
              name="usageVolume11"
              v-model:value="materialData.usageVolume11"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-text
              :editable="editable"
              label="사용량 12월"
              type="number"
              name="usageVolume12"
              v-model:value="materialData.usageVolume12"
            />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'airMaterialUsageDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
    envAirSemsMaterialUsageId?: stringNull
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
      envAirSemsMaterialUsageId: ''
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
const materialData = ref<any>({
  envAirSemsMaterialUsageId: '', // 원부원료사용량ID
  plantCd: '', // 사업장
  usageYear: '', // 사용년도
  envAirMstMaterialId: '', // 원료
  usageVolume1: 0, // 원료사용량1
  usageVolume2: 0, // 원료사용량2
  usageVolume3: 0, // 원료사용량3
  usageVolume4: 0, // 원료사용량4
  usageVolume5: 0, // 원료사용량5
  usageVolume6: 0, // 원료사용량6
  usageVolume7: 0, // 원료사용량7
  usageVolume8: 0, // 원료사용량8
  usageVolume9: 0, // 원료사용량9
  usageVolume10: 0, // 원료사용량10
  usageVolume11: 0, // 원료사용량11
  usageVolume12: 0, // 원료사용량12
  airMaterialUnitName: '' // 원료사용단위명
})
const materialItems = ref<codeMasterType>([])
const editable = ref(true)
const editForm = ref<HTMLFormElement | null>(null)
const detailUrl = ref('')
const materialUrl = ref('')
const saveUrl = ref('')
const checkUrl = ref('')
const deleteUrl = ref('')
const isSave = ref(false)
const mappingType = ref('POST')
const updateUrl = ref('')
const insertUrl = ref('')

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
  detailUrl.value = selectConfig.env.air.sems.materialsUsage.get.url
  materialUrl.value = selectConfig.env.air.mst.material.list.url
  checkUrl.value = selectConfig.env.air.sems.materialsUsage.check.url
  saveUrl.value = transactionConfig.env.air.sems.material.insert.url
  insertUrl.value = transactionConfig.env.air.sems.material.insert.url
  updateUrl.value = transactionConfig.env.air.sems.material.update.url
  deleteUrl.value = transactionConfig.env.air.sems.material.delete.url
  // code setting
  // list setting
  getMaterialList()
  getDetail()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envAirSemsMaterialUsageId) {
    $http({
      url: detailUrl.value,
      method: 'GET',
      params: { envAirSemsMaterialUsageId: props.popupParam.envAirSemsMaterialUsageId }
    }).then((_result: any) => {
      materialData.value = _result.data
    })
  } else {
    materialData.value.usageYear = getThisYear()
  }
}

/******************************
 * TODO (목적): 원료 조회
 *******************************/
function getMaterialList() {
  $http({
    url: materialUrl.value,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    materialItems.value = []
    _.forEach(_result.data, (item) => {
      materialItems.value.push({
        code: item.envAirMstMaterialId,
        codeName: item.envAirMstMaterialName,
        airMaterialUnitName: item.airMaterialUnitName
      })
    })
  })
}
/******************************
 * TODO (목적): 테이블 데이터 변경에 따른 수정사항
 *******************************/
function onMaterialChange() {
  const selected = materialItems.value.find(
    (d: any) => d.code === materialData.value.envAirMstMaterialId
  )
  if (selected) {
    materialData.value.airMaterialUnitName = selected.airMaterialUnitName
  } else {
    materialData.value.airMaterialUnitName = ''
  }
}

/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (props.popupParam.envAirSemsMaterialUsageId) {
    mappingType.value = 'PUT'
    materialData.value.chgUserId = user.value.userId
    saveUrl.value = updateUrl.value
  } else {
    mappingType.value = 'POST'
    materialData.value.regUserId = user.value.userId
    saveUrl.value = insertUrl.value
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      if (!materialData.value.envAirSemsMaterialUsageId) {
        $http({
          url: checkUrl.value,
          method: 'GET',
          params: {
            usageYear: materialData.value.usageYear,
            envAirMstMaterialId: materialData.value.envAirMstMaterialId
          }
        }).then((_result: any) => {
          if (_result.data === 0) {
            message.confirm({
              title: '확인',
              message: '저장하시겠습니까?',
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                isSave.value = !isSave.value
              },
              // 취소 callback 함수
              cancelCallback: () => {}
            })
          } else {
            message.alert({
              title: '안내',
              message: `${materialData.value.usageYear}년에 해당 원료에 대한 사용량이 존재합니다.`,
              type: 'warning' // success / info / warning / error
            })
          }
        })
      } else {
        message.confirm({
          title: '확인',
          message: '저장하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            isSave.value = !isSave.value
          },
          cancelCallback: () => {}
        })
      }
    } else {
      message.validError()
    }
  })
}

/******************************
 * TODO (목적): 저장 콜백
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.envAirSemsMaterialUsageId = result.data
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
        url: $format(deleteUrl.value, props.popupParam.envAirSemsMaterialUsageId),
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
