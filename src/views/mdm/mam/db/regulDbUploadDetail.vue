<template>
  <div>
    <q-stepper
      v-model="step"
      ref="stepper"
      alternative-labels
      color="primary"
      animated
      @transition="stepTran"
    >
      <q-step :name="1" :title="$language('규제DB Excel 업로드')" icon="settings" :done="step > 1">
        <!-- excelupload -->
        <q-uploader
          flat
          bordered
          with-credentials
          ref="excelUpload"
          class="excel-upload"
          capture="environment"
          field-name="file"
          method="POST"
          label="EXCEL UPLOAD"
          :auto-upload="false"
          :hide-upload-btn="true"
          :multiple="false"
          accept="xlsx"
          :max-file-size="100000000"
          :max-total-size="100000000"
          :max-files="1"
          :no-thumbnails="false"
          :disable="!editable"
          style="max-height: 200px; min-height: 200px; width: 100%"
          @rejected="rejected"
          @added="added"
        >
          <!-- :filter="filter" -->
          <template v-slot:header="scope">
            <div class="row no-wrap items-center q-pa-none q-gutter-xs">
              <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
              <div class="col" style="padding-top: 0px !important; margin-top: 0px !important">
                <div
                  class="q-uploader__title inline-block"
                  style="padding: 6px !important; font-size: 0.95em !important"
                >
                  EXCEL UPLOAD
                </div>
                &nbsp;&nbsp;
                <div class="q-uploader__subtitle inline-block" v-if="editable">
                  {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
                </div>
              </div>
              <q-btn
                v-if="scope.queuedFiles.length > 0 && editable"
                class="excel-upload-btn"
                icon="delete"
                dense
                outline
                size="sm"
                :label="$language('파일 삭제')"
                @click="deleteFile"
              />
            </div>
          </template>
          <template v-slot:list="scope">
            <template v-if="scope.files && scope.files.length > 0">
              <q-list separator>
                <q-item v-for="file in scope.files" :key="file.name">
                  <q-item-section>
                    <q-item-label class="full-width ellipsis">
                      {{ file.name }}
                    </q-item-label>

                    <q-item-label caption> Status: {{ file.__status }} </q-item-label>

                    <q-item-label caption>
                      {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                    <img :src="file.__img.src" />
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
            <template v-else>
              <div class="empty_dscription">
                <div style="text-align: center; padding-bottom: 5px" v-show="editable">
                  <q-chip outline square icon="info" style="width: 100%"> Drag or Click </q-chip>
                </div>
                <div class="q-pl-md txtfileinfo" style="text-align: left">
                  <span class="text-positive">
                    {{ $language('업로드 가능 확장자') }}
                  </span>
                  : xlsx
                  <br />
                  <span class="text-positive">
                    {{ $language('업로드 가능 파일 수') }}
                  </span>
                  : 1
                  <br />
                  <span class="text-positive">
                    {{ $language('허용 파일 크기') }}
                  </span>
                  : 100MB
                </div>
                <q-uploader-add-trigger />
              </div>
            </template>
          </template>
        </q-uploader>
      </q-step>
      <q-step
        :name="2"
        :title="$language('양식 비교 및 업로드 준비')"
        icon="create_new_folder"
        :done="step > 2"
      >
        <div class="regul-db-loading-style">
          <q-inner-loading v-if="!fail.message1" :showing="visible">
            <template v-slot:default>
              <q-spinner-ball class="regul-db-spinner" size="5em" />
              <div
                class="regul-db-loading-style-text regul-db-animation"
                data-text="양식비교중입니다..."
              >
                {{ $language('양식비교중입니다...') }}
              </div>
            </template>
          </q-inner-loading>
          <q-inner-loading v-else :showing="visible">
            <template v-slot:default>
              <q-spinner-comment class="regul-db-spinner" size="5em" />
              <div class="regul-db-loading-style-text">
                {{ fail.message1 }}
              </div>
            </template>
          </q-inner-loading>
        </div>
      </q-step>

      <q-step :name="3" :title="$language('업로드 결과 저장')" icon="add_comment" :done="step > 3">
        <div class="regul-db-loading-style">
          <q-inner-loading v-if="!fail.message2" :showing="visible">
            <template v-slot:default>
              <q-spinner-ball class="regul-db-spinner" size="5em" />
              <div
                class="regul-db-loading-style-text regul-db-animation"
                data-text="업로드 결과 저장 중..."
              >
                {{ $language('업로드 결과 저장 중...') }}
              </div>
              <div class="regul-db-loading-style-text">
                {{ $language('총 건 수 : ') + regulDbUpload.totalCnt }}
              </div>
            </template>
          </q-inner-loading>
          <q-inner-loading v-else :showing="visible">
            <template v-slot:default>
              <q-spinner-comment class="regul-db-spinner" size="5em" />
              <div class="regul-db-loading-style-text" v-html="fail.message2" />
            </template>
          </q-inner-loading>
        </div>
      </q-step>

      <q-step :name="4" :title="$language('내역 저장')" icon="add_comment" :done="step > 4">
        <div class="regul-db-loading-style">
          <q-inner-loading v-if="!fail.message3" :showing="visible">
            <template v-slot:default>
              <q-spinner-ball class="regul-db-spinner" size="5em" />
              <div
                class="regul-db-loading-style-text regul-db-animation"
                data-text="업로드 내역 저장 중..."
              >
                {{ $language('업로드 내역 저장 중...') }}
              </div>
              <div class="regul-db-loading-style-text">
                <ICountUp
                  ref="saveCountup"
                  :startVal="regulDbUpload.ingStartCnt"
                  :endVal="regulDbUpload.ingCnt"
                  :decimals="0"
                  :duration="4"
                  :options="countOptions"
                />
              </div>
            </template>
          </q-inner-loading>
          <q-inner-loading v-else :showing="visible">
            <template v-slot:default>
              <q-spinner-comment class="regul-db-spinner" size="5em" />
              <div class="regul-db-loading-style-text" v-html="fail.message3" />
              <div class="regul-db-loading-style-text">
                <ICountUp
                  :startVal="0"
                  :endVal="regulDbUpload.ingCnt"
                  :decimals="0"
                  :duration="4"
                  :options="countOptions"
                />
              </div>
            </template>
          </q-inner-loading>
        </div>
      </q-step>
      <q-step :name="5" :title="$language('유효성 체크')" icon="create_new_folder" :done="step > 5">
        <div class="regul-db-loading-style">
          <q-inner-loading v-if="!fail.message4" :showing="visible">
            <template v-slot:default>
              <q-spinner-ball class="regul-db-spinner" size="5em" />
              <div
                class="regul-db-loading-style-text regul-db-animation"
                data-text="유효성 체크 중..."
              >
                {{ $language('유효성 체크 중...') }}
              </div>
            </template>
          </q-inner-loading>
          <c-table
            v-else-if="fail.message4 === 'VALID'"
            ref="table"
            title="유효성 실패 목록"
            :columns="validGrid.columns"
            :data="validGrid.data"
            :gridHeight="validGrid.height"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
          />
          <q-inner-loading v-else :showing="visible">
            <template v-slot:default>
              <q-spinner-comment class="regul-db-spinner" size="5em" />
              <div class="regul-db-loading-style-text" v-html="fail.message4" />
            </template>
          </q-inner-loading>
        </div>
      </q-step>
      <q-step
        :name="6"
        :title="$language('동일 파일 업로드 체크')"
        icon="create_new_folder"
        :done="step > 6"
      >
        <div class="regul-db-loading-style">
          <q-inner-loading v-if="!fail.message5" :showing="visible">
            <template v-slot:default>
              <q-spinner-ball class="regul-db-spinner" size="5em" />
              <div
                class="regul-db-loading-style-text regul-db-animation"
                data-text="최근 excel 업로드 건과 동일한 파일인지 검사 중..."
              >
                {{ $language('최근 excel 업로드 건과 동일한 파일인지 검사 중...') }}
              </div>
            </template>
          </q-inner-loading>
          <q-inner-loading v-else :showing="visible">
            <template v-slot:default>
              <q-spinner-comment class="regul-db-spinner" size="5em" />
              <div class="regul-db-loading-style-text" v-html="fail.message5" />
            </template>
          </q-inner-loading>
        </div>
      </q-step>
      <q-step
        :name="7"
        :title="$language('변경 내역 진행 중')"
        icon="create_new_folder"
        :done="step > 7"
      >
        <div class="regul-db-loading-style">
          <q-inner-loading v-if="!fail.message6" :showing="visible">
            <template v-slot:default>
              <q-spinner-ball class="regul-db-spinner" size="5em" />
              <div
                class="regul-db-loading-style-text regul-db-animation"
                data-text="변경된 내역 작성 중..."
              >
                {{ $language('변경된 내역 작성 중...') }}
              </div>
            </template>
          </q-inner-loading>
          <q-inner-loading v-else :showing="visible">
            <template v-slot:default>
              <q-spinner-comment class="regul-db-spinner" size="5em" />
              <div class="regul-db-loading-style-text" v-html="fail.message6" />
            </template>
          </q-inner-loading>
        </div>
      </q-step>
      <q-step :name="8" :title="$language('완료')" icon="create_new_folder" :done="step > 8">
        <div class="regul-db-loading-style">
          <q-inner-loading :showing="visible">
            <template v-slot:default>
              <q-icon name="check" class="regul-db-complete-icon text-green" />
              <div class="regul-db-loading-style-text">완료</div>
              <q-btn
                flat
                class="regul-db-loading-style-text-sub"
                :label="$language('변경된 이력보기')"
                @click="showHistory"
              />
            </template>
          </q-inner-loading>
        </div>
      </q-step>
    </q-stepper>
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
import { read, utils } from 'xlsx'
import ICountUp from 'vue-countup-v3'
import { regulDbUploadDetailType, regulDbUploadType } from './regulDbUpload'
import { encrypt, fileDownDecrypt } from '@/common/utils/aes256'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'regulDbUploadDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '70%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const regulDbUpload = ref<regulDbUploadType>({
  chmRegulDbUploadId: '', // 규제DB업로드 결과 일련번호
  updateDt: '', // 업로드 일시
  chmUploadStateCd: null, // 업로드 상태
  addCnt: 0, // 추가 건 수
  updateCnt: 0, // 수정 건 수
  deleteCnt: 0, // 삭제 건 수
  noChangeCnt: 0, // 변함없음 건 수
  totalCnt: 0, // 총 건 수
  failContents: '', // 실패사유
  regUserId: '', // 등록자 ID
  chgUserId: '', // 수정자 ID
  ingCnt: 0,
  ingStartCnt: 0,
  details: [],
  chemBases: [],
  chems: []
})
const step = ref(1)
const visible = ref(true)
const isError = ref(false)
const fail = ref({
  message1: '', // 엑셀 읽는 도중 발생한 에러
  message2: '', // 업로드 결과 저장 중 발생한 에러
  message3: '', // 내역 저장 중 발생한 에러
  message4: '', // 유효성 체크 도중 발생한 에러
  message5: '', // 동일 파일 업로드 체크 도중 발생한 에러
  message6: '' // 변경 내역 저장 중 발생한 에러
})
const templateColName = ref<Array<any>>([])
const templateHeader = ref<Array<Array<string | number>>>([])
const sheetNames = ref<Array<string>>([])
const saveCountup = ref<any>(null)
const countOptions = ref({
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
  prefix: '',
  suffix: '건 / 300건'
})
const validGrid = ref({
  data: [],
  columns: [
    {
      name: 'failContents',
      field: 'failContents',
      label: '업로드 일시',
      align: 'left',
      style: 'width:300px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '화학물질명(CAS No.)',
      align: 'left',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'regulationBillCd',
      field: 'regulationBillCd',
      label: '규제법규코드',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'regulatedItemCd',
      field: 'regulatedItemCd',
      label: '규제항목코드',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'appliStandSign',
      field: 'appliStandSign',
      label: '적용기준<br/>부등호',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'flag',
      field: 'flag',
      label: '추가/수정<br/>/삭제',
      align: 'center',
      style: 'width:60px',
      sortable: true
    },
    {
      name: 'notiDt',
      field: 'notiDt',
      label: '고시일',
      align: 'center',
      style: 'width:90px',
      sortable: true
    }
  ],
  height: '600px'
})
const uploadUrl = ref('')
const uploadDetailUrl = ref('')
const validUrl = ref('')
const validFailUrl = ref('')
const sameUrl = ref('')
const chemHistoryUrl = ref('')
const chemRegulHistoryUrl = ref('')
const templateExcelFileUrl = ref('')
const truncateSize = 30
const stepper = ref<any>(null)
const excelUpload = ref<any>(null)

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
  templateExcelFileUrl.value = selectConfig.sys.excelUpload.template.url
  uploadUrl.value = transactionConfig.chm.db.regulDbUpload.upload.url
  uploadDetailUrl.value = transactionConfig.chm.db.regulDbUploadDetail.upload.url
  validUrl.value = transactionConfig.chm.db.regulDbUpload.valid.url
  validFailUrl.value = selectConfig.chm.db.regulDbUpload.validFail.url
  sameUrl.value = transactionConfig.chm.db.regulDbUpload.same.url
  chemHistoryUrl.value = transactionConfig.chm.db.regulDbUpload.chemHistory.url
  chemRegulHistoryUrl.value = transactionConfig.chm.db.regulDbUpload.chemRegulHistory.url
  // code setting
  // list setting
  getExcelTemplateHeader()
}
/******************************
 * TODO (목적): 규제DB업로드 진행 단계 이동에 따른 처리
 * @param (1): 진행 단계 정보
 *******************************/
function stepTran(val: any) {
  const promises: Array<any> = []
  let quotient = 0
  let remainder = 0
  switch (val) {
    case 2: // 양식 비교 및 업로드 준비
      /**
       * 업로드 컴포넌트가 가지는 event method를 통해 서비스 실행
       *
       * 따라서 해당 경우에는 아무것도 하지 않음
       */
      break
    case 3: // 업로드 결과 저장
      regulDbUpload.value.ingCnt = 0
      regulDbUpload.value.ingStartCnt = 0
      regulDbUpload.value.updateDt = getTodayDateTime()
      regulDbUpload.value.regUserId = user.value.userId
      regulDbUpload.value.totalCnt = regulDbUpload.value.details.length
      countOptions.value.suffix = `건 / ${regulDbUpload.value.details.length}건`
      $http({
        url: uploadUrl.value,
        method: 'POST',
        data: regulDbUpload.value,
        timeout: 180000
      }).then((_result: any) => {
        if (_result.data !== 'FAIL') {
          regulDbUpload.value.chmRegulDbUploadId = _result.data
          _.forEach(regulDbUpload.value.details, (detail) => {
            detail.chmRegulDbUploadId = _result.data
          })
          setTimeout(() => {
            // 업로드 결과 저장 완료
            stepper.value.next()
          }, 2000)
        } else {
          fail.value.message2 = $language(
            '업로드 결과 저장 중 에러가 발생하였습니다.<br/>담당자에게 문의 바랍니다.'
          )
        }
      })

      break
    case 4: // 내역 저장
      quotient = regulDbUpload.value.totalCnt / truncateSize // 몫
      remainder = regulDbUpload.value.totalCnt % truncateSize // 나머지
      if (remainder > 0) {
        quotient + 1
      }
      for (let i = 0; i < quotient; i++) {
        promises.push({
          func: detailUpload,
          param: _.slice(regulDbUpload.value.details, i * truncateSize, truncateSize * (i + 1))
        })
      }
      promises.push({
        func: completeDetailUpload
      })
      orderedPromise(promises)

      break
    case 5: // 유효성 체크
      $http({
        url: validUrl.value,
        method: 'PUT',
        data: regulDbUpload.value,
        timeout: 180000
      }).then((_result: any) => {
        if (_result.data === 1) {
          setTimeout(() => {
            // 유효성 체크 완료
            stepper.value.next()
          }, 2000)
        } else {
          // 실패한 내역이 존재
          if (_result.data === -1) {
            // 테이블로 유효성 실패 내역 보여주기
            fail.value.message4 = 'VALID'
            $http({
              url: validFailUrl.value,
              method: 'GET',
              params: {
                chmRegulDbUploadId: regulDbUpload.value.chmRegulDbUploadId
              },
              timeout: 180000
            }).then((_result: any) => {
              validGrid.value.data = _result.data
            })
          } else if (_result.data === -2) {
            fail.value.message4 = $language(
              '유효성 체크 중 에러가 발생하였습니다.<br/>저장 중이던 내역 정보는 삭제됩니다.'
            )
          }
        }
      })

      break
    case 6: // 동일 파일 업로드 체크
      $http({
        url: sameUrl.value,
        method: 'PUT',
        data: regulDbUpload.value,
        timeout: 180000
      }).then((_result: any) => {
        if (_result.data === 1) {
          setTimeout(() => {
            // 동일 파일 업로드 체크 완료
            stepper.value.next()
          }, 2000)
        } else {
          if (_result.data === -1) {
            fail.value.message5 = $language(
              '전부 동일한 데이터로 판단되었습니다.<br/>새로운 파일을 제공해 주십시오.'
            )
          } else if (_result.data === -2) {
            fail.value.message5 = $language(
              '동일파일 업로드 체크 중 에러가 발생하였습니다.<br/>저장 중이던 내역 정보는 삭제됩니다.'
            )
          }
        }
      })

      break
    case 7: // 변경 내역 진행 중
      orderedPromise([
        {
          func: chemHistory
        },
        {
          func: chemRegulHistory
        }
      ])
      break
    default:
      // nothing...
      break
  }
}
/******************************
 * TODO (목적): 규제DB업로드 상세 내역 저장
 * @param (1): 저장할 행 정보 (30개 단위로 자름)
 *******************************/
function detailUpload(saveRows: Array<regulDbUploadDetailType>) {
  return new Promise((resolve, reject) => {
    $http({
      url: uploadDetailUrl.value,
      method: 'PUT',
      data: {
        chmRegulDbUploadId: regulDbUpload.value.chmRegulDbUploadId,
        details: saveRows
      },
      timeout: 180000
    })
      .then((_result: any) => {
        if (_result.data === 1) {
          regulDbUpload.value.ingStartCnt = regulDbUpload.value.ingCnt
          regulDbUpload.value.ingCnt += saveRows && saveRows.length > 0 ? saveRows.length : 0 // truncateSize
          resolve(true)
        } else {
          if (_result.data === -1) {
            fail.value.message3 = $language(
              '내역 저장 중 에러가 발생하였습니다.<br/>저장 중이던 내역 정보는 삭제됩니다.'
            )
          } else if (_result.data === -2) {
            // 앞 step이 처리되었다면 해당 return 값이 올 수 없음
          }
          reject('')
        }
      })
      .catch(() => {
        reject('')
      })
  })
}
/******************************
 * TODO (목적): 규제DB업로드 상세 내역 저장 완료에 따른 다음 스탭 이동
 *******************************/
function completeDetailUpload() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 내역 저장 완료
      stepper.value.next()
    }, 2000)
    resolve(true)
  })
}
/******************************
 * TODO (목적): 화학물질 변경내역 저장
 *******************************/
function chemHistory() {
  return new Promise((resolve, _reject) => {
    $http({
      url: chemHistoryUrl.value,
      method: 'PUT',
      data: regulDbUpload.value,
      timeout: 180000
    })
      .then((_result: any) => {
        if (_result.data === 1) {
          resolve(true)
        } else {
          fail.value.message6 = $language(
            '화학물질 변경내역 정리 중 에러가 발생하였습니다.<br/>저장 중이던 내역 정보는 삭제됩니다.'
          )
          _reject('')
        }
      })
      .catch(() => {
        _reject('')
      })
  })
}
/******************************
 * TODO (목적): 화학물질에 따른 규제정보 변경내역 저장
 *******************************/
function chemRegulHistory() {
  return new Promise((resolve, _reject) => {
    $http({
      url: chemRegulHistoryUrl.value,
      method: 'PUT',
      data: regulDbUpload.value,
      timeout: 180000
    })
      .then((_result: any) => {
        // 다 종료 되었으며 이력팝업 띄울거냐는 메세지를 화면에 표시
        if (_result.data === 1) {
          stepper.value.next()
          resolve(true)
        } else {
          fail.value.message6 = $language(
            '화학물질별 규제항목 변경내역 정리 중 에러가 발생하였습니다.<br/>저장 중이던 내역 정보는 삭제됩니다.'
          )
          _reject('')
        }
      })
      .catch(() => {
        _reject('')
      })
  })
}
/******************************
 * TODO (목적): 엑셀 양식 확인
 *******************************/
function getExcelTemplateHeader() {
  $http({
    url: templateExcelFileUrl.value,
    method: 'GET',
    params: {
      taskClassCd: encrypt('REGUL_DB_UPLOAD')
    },
    timeout: 180000
  }).then((_result: any) => {
    const fileInfo = fileDownDecrypt(_result.data)
    if (fileInfo.id === 'REGUL_DB_UPLOAD') {
      const cfb = read(fileInfo.bytes, { type: 'base64' })
      sheetNames.value = []
      templateHeader.value = []
      const sheetNum = 0
      sheetNames.value.push(cfb.SheetNames[sheetNum])
      templateHeader.value.push(getHeaders(cfb.Sheets[cfb.SheetNames[sheetNum]]))
      templateColName.value = utils.sheet_to_json(cfb.Sheets[cfb.SheetNames[sheetNum]], {
        raw: false
      })[0] as Array<any>
    } else {
      message.alert({
        title: '안내',
        message: '잘못된 정보입니다.',
        type: 'error'
      })
    }
  })
}
/******************************
 * TODO (목적): 파일 사이즈
 * @param (1): 파일 사이즈(byte)
 * @return (반환): 파일 사이즈(천단위에 맞춘 단위)
 *******************************/
function getFileSizeTextByRound(_fileByteSize: number) {
  return bytesToSize(_fileByteSize)
}
/******************************
 * TODO (목적): 업로드 파일 거부
 * @param (1): 파일 정보
 *******************************/
function rejected(info: any) {
  if (!info || info.length === 0) {
    return
  }
  // 다시 파일을 올림으로 인해 메시지를 초기화 처리함
  isError.value = false
  fail.value.message1 = ''
  _.forEach(info, (reject) => {
    // accept, max-file-size, max-total-size, filter, etc
    switch (reject.failedPropValidation) {
      case 'max-file-size': // 파일용량 초과
      case 'max-total-size': // 파일 전체 용량 초과
        isError.value = true
        fail.value.message1 +=
          reject.file.name +
          ' > ' +
          $language(
            '첨부하신 해당 파일의 용량이 지정된 용량보다 큽니다. (지정 용량 : 10MB, 파일 용량 : '
          ) +
          getFileSizeTextByRound(reject.file.size) +
          ')'
        break
      case 'max-files': // 업로드 갯수 초과
        isError.value = true
        fail.value.message1 =
          $language(
            '첨부하신 파일이 지정된 업로드 갯수를 초과하여 업로드 되지 않았습니다. (지정 업로드 갯수 : 1, 파일 갯수 : '
          ) +
          info.length +
          ')'
        break
      case 'accept': // 확장자 맞지않음
        isError.value = true
        fail.value.message1 =
          $language(
            '첨부하신 파일의 확장자가 올바르지 않습니다. (업로드 가능 확장자 : xlsx, 파일 확장자 : '
          ) +
          reject.file.extension +
          ')'
        break
      case 'filter': // filter 걸린경우
        break
      default:
        break
    }
  })
}
/******************************
 * TODO (목적): 업로드 파일 등록
 * @param (1): 파일 정보
 *******************************/
function added(files: readonly any[]) {
  excelUpload.value.reset()
  // 파일 올리기 완료
  stepper.value.next()
  /**
   * 파일을 다시 올리는 경우 업로드 현황 & Excel 결과 목록 초기화
   */
  isError.value = false
  fail.value.message1 = ''
  regulDbUpload.value.details = []
  /**
   * 엑셀의 헤더가 업로드 된 엑셀과 맞지 않을 경우를 체크
   */
  const reader = new FileReader()
  reader.readAsDataURL(files[0])
  reader.onload = function () {
    const result = reader.result

    const base64Data = String(result!).replace('data:' + files[0].type + ';base64,', '')
    const cfb = read(base64Data, {
      type: 'base64',
      cellDates: true,
      // cellText: true
      dateNF: 'YYYY-MM-DD'
    })

    const sheetNum = 1
    for (let i = 0; i < sheetNum; i++) {
      const uploadExcel = {
        header: getHeaders(cfb.Sheets[cfb.SheetNames[i]]),
        data: utils.sheet_to_json<any>(cfb.Sheets[cfb.SheetNames[i]], {
          raw: false,
          dateNF: 'YYYY-MM-DD'
          // cellDates: true
        })
      }

      // 1. 헤더가 맞지 않은 경우 체크
      const headerCheck = templateHeader.value[i].every((item, idx) => {
        return uploadExcel.header[idx] === item
      })
      if (!headerCheck) {
        isError.value = true
        fail.value.message1 += $language(
          '업로드한 엑셀의 헤더가 올바르지 않습니다. 담당자에게 문의 바랍니다.'
        )
        break
      }

      // 2. 데이터가 없는 경우 체크
      if (!uploadExcel.data || uploadExcel.data.length === 1) {
        isError.value = true
        fail.value.message1 += $language(
          '업로드한 엑셀에 데이터가 없습니다. 확인 후 업로드 해주십시오.'
        )
        break
      }
      uploadExcel.data.shift()
      regulDbUpload.value.details = []
      _.forEach(uploadExcel.data, (data) => {
        const pushData: any = {}
        for (const colKey in templateColName.value) {
          pushData[templateColName.value[colKey]] = data[colKey]
        }
        regulDbUpload.value.details.push(pushData) // 양삭에 정의된 키에 따라 매핑한 데이터를 저장
      })
    }

    if (!isError.value) {
      // this.step = 2;
      stepper.value.next()
    } else {
      // OUT
    }
  }
}
/******************************
 * TODO (목적): 업로드 파일 삭제
 *******************************/
function deleteFile() {
  isError.value = false
  fail.value = {
    message1: '', // 엑셀 읽는 도중 발생한 에러
    message2: '', // 업로드 결과 저장 중 발생한 에러
    message3: '', // 내역 저장 중 발생한 에러
    message4: '', // 유효성 체크 도중 발생한 에러
    message5: '', // 동일 파일 업로드 체크 도중 발생한 에러
    message6: '' // 변경 내역 저장 중 발생한 에러
  }
  stepper.value.goTo(1)
  regulDbUpload.value.details = []
  excelUpload.value.reset()
  excelUpload.value.removeQueuedFiles()
}
/******************************
 * TODO (목적): 변경이력 팝업 표시
 *******************************/
function showHistory() {
  popupOptions.value.title = '변경 이력' // 변경 이력
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./regulDbUploadHistory.vue`))
  )
  popupOptions.value.param = {
    chmRegulDbUploadId: regulDbUpload.value.chmRegulDbUploadId
  }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeHistoryPopup
}
/******************************
 * TODO (목적): 변경이력 팝업 닫기
 *******************************/
function closeHistoryPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
