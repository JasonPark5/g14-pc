<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-card title="기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="receivingSetHistory"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveInfo"
                  @btnCallback="saveCallback"
                />
                <c-btn
                  v-show="editable && isOld"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="deleteInfo"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <c-plant
                  :required="true"
                  :editable="editable"
                  :disabled="isOld"
                  type="edit"
                  name="plantCd"
                  v-model:value="receivingSetHistory.plantCd"
                />
              </div> -->
              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <c-datepicker
                  :required="true"
                  :editable="editable"
                  type="datetime"
                  default="today"
                  label="보고일시"
                  name="plantCd"
                  v-model:value="receivingSetHistory.reportDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-card title="설비 정보" class="cardClassDetailForm" topClass="topcolor-blue">
                  <template v-slot:card-detail>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                      <c-task-target
                        label="관련 소방설비"
                        name="sopFireFightingId"
                        :customPopupParam="{ targetKey: 'fireFightingEquip' }"
                        v-model:value="receivingSetHistory.sopFireFightingId"
                        @dataChange="fireFightingChange"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                      <c-text
                        disabled
                        :editable="editable"
                        label="소방설비 종류"
                        name="sopFireFightingTypeName"
                        v-model:value="receivingSetHistory.sopFireFightingTypeName"
                      />
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4">
                      <c-text
                        :editable="editable"
                        label="중계기 종류"
                        name="repeaterType"
                        v-model:value="receivingSetHistory.repeaterType"
                      />
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4">
                      <c-text
                        :editable="editable"
                        label="중계기 번호"
                        name="repeater"
                        v-model:value="receivingSetHistory.repeater"
                      />
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4">
                      <c-text
                        :editable="editable"
                        label="제조사"
                        name="repeaterMenufCompany"
                        v-model:value="receivingSetHistory.repeaterMenufCompany"
                      />
                    </div>
                  </template>
                </c-card>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-card title="장소" class="cardClassDetailForm" topClass="topcolor-blue">
                  <template v-slot:card-detail>
                    <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                      <c-text
                        :editable="editable"
                        label="장소_동"
                        name="locationDong"
                        v-model:value="receivingSetHistory.locationDong"
                      />
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                      <c-text
                        :editable="editable"
                        label="장소_층"
                        name="locationFloor"
                        v-model:value="receivingSetHistory.locationFloor"
                      />
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-8 col-lg-8">
                      <c-text
                        :editable="editable"
                        label="세부위치"
                        name="locationDetail"
                        v-model:value="receivingSetHistory.locationDetail"
                      />
                    </div>
                  </template>
                </c-card>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="발생내용"
                  name="happened"
                  v-model:value="receivingSetHistory.happened"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="미흡사항"
                  name="insufficiencies"
                  v-model:value="receivingSetHistory.insufficiencies"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="원인분석"
                  name="causeAnalysis"
                  v-model:value="receivingSetHistory.causeAnalysis"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <c-card title="근무자 대피" class="cardClassDetailForm" topClass="topcolor-blue">
                  <template v-slot:card-detail>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <c-checkbox
                        :editable="editable"
                        :isFlag="true"
                        label="대피유무"
                        name="evacuationFlag"
                        v-model:value="receivingSetHistory.evacuationFlag"
                      />
                    </div>
                    <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                      <c-text
                        :editable="editable"
                        type="number"
                        label="대피인원"
                        name="evacuationCount"
                        v-model:value="receivingSetHistory.evacuationCount"
                      />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <c-textarea
                        :editable="editable"
                        autogrow
                        label="대피내용 / 미대피 사유"
                        name="evacuationDetails"
                        v-model:value="receivingSetHistory.evacuationDetails"
                      />
                    </div>
                  </template>
                </c-card>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="개선방안"
                  name="improvement"
                  v-model:value="receivingSetHistory.improvement"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  :rows="2"
                  label="비고"
                  name="remarks"
                  v-model:value="receivingSetHistory.remarks"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-card title="감지기 동작 위치" class="cardClassDetailForm">
            <template v-slot:card-button>
              <c-pick-file
                :editable="editable"
                outlined
                v-model:value="file"
                :dense="true"
                @getImageData="getImageData"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </c-pick-file>
            </template>
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <q-img :src="receivingSetHistory.detectorOperatingPositionSrc" />
              </div>
            </template>
          </c-card>
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <c-upload
                :isPhoto="true"
                :attachInfo="attachInfo"
                :editable="editable"
                label="관련 사진"
              />
            </div>
          </div>
        </div>
      </div>
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
import { receiveType } from '../fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingReceivingSetHistoryInfo'
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
const emits = defineEmits(['getDetail', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    sopFireFightingReceivingSetHistoryId?: stringNull
  }
  contentHeight?: stringNull
  isOld?: boolean
  receivingSetHistory?: receiveType
  attachInfo?: attachSettingType
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
      sopFireFightingReceivingSetHistoryId: ''
    }
  },
  receivingSetHistory: () => {
    return {
      sopFireFightingReceivingSetHistoryId: '', // 화재수신기 작동 이력 보고 일련번호
      plantCd: null, // 사업장코드
      reportDate: '', // 보고일
      locationDong: '', // 장소_동
      locationFloor: '', // 장소_층
      locationDetail: '', // 세부위치
      sopFireFightingId: '', // 소방설비 일련번호
      fireFightingName: '', // 소방설비명
      sopFireFightingTypeName: '', // 소방설비 종류명
      repeaterType: '', // 중계기 번호
      repeater: '', // 중계기
      repeaterMenufCompany: '', // 제조사
      happened: '', // 발생내용
      insufficiencies: '', // 미흡사항
      causeAnalysis: '', // 원인분석
      evacuationFlag: 'N', // 대피유무
      evacuationCount: '', // 대피인원
      evacuationDetails: '', // 대피내용, 미대피 사유
      improvement: '', // 개선방안
      remarks: '', // 비고
      detectorOperatingPositionSrc: '', // 감지기 동작 위치
      regUserId: '', // 등록자
      chgUserId: ''
    }
  },
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: 'FIRE_RECEIVING_SET',
      taskKey: ''
    }
  },
  isOld: false,
  contentHeight: null
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
const file = ref(null)
const deleteUrl = ref('')
const saveUrl = ref('')
const mappingType = ref('PUT')
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
  saveUrl.value = transactionConfig.fft.fireFightingReceivingSetHistory.update.url
  deleteUrl.value = transactionConfig.fft.fireFightingReceivingSetHistory.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 값 바뀔때마다
 *******************************/
function fireFightingChange(data1: any, data2: any, data3: any) {
  if (data3) {
    props.receivingSetHistory.fireFightingName = data3.fireFightingName
    props.receivingSetHistory.sopFireFightingTypeName = data3.sopFireFightingTypeName
  } else {
    props.receivingSetHistory.fireFightingName = null
    props.receivingSetHistory.sopFireFightingTypeName = null
  }
}
/******************************
 * TODO (목적): 이미지 데이터 조회
 *******************************/
function getImageData(_data: any) {
  props.receivingSetHistory.detectorOperatingPositionSrc = _data
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.isOld ? 'PUT' : 'POST'
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          props.receivingSetHistory.regUserId = user.value.userId
          props.receivingSetHistory.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else message.validError()
  })
}
function saveCallback(_result: any) {
  message.requestSuccess()
  if (!props.popupParam.sopFireFightingReceivingSetHistoryId) {
    props.attachInfo.taskKey = _result.data
    props.attachInfo.isSubmit = uid()
  }
  props.popupParam.sopFireFightingReceivingSetHistoryId = _result.data
  emits('getDetail')
}
/******************************
 * TODO (목적): 삭제
 *******************************/
function deleteInfo() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.sopFireFightingReceivingSetHistoryId),
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
