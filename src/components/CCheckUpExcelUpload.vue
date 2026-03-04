<template>
  <div class="fix-height row excel-upload-cover">
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
      <q-uploader
        flat
        bordered
        with-credentials
        ref="excelUpload"
        class="excel-upload"
        capture="environment"
        field-name="file"
        method="POST"
        :label="$language(label)"
        :auto-upload="false"
        :hide-upload-btn="true"
        :multiple="false"
        accept="xlsx"
        :max-file-size="100000000"
        :max-total-size="100000000"
        :max-files="1"
        :no-thumbnails="false"
        :disable="!editable"
        :style="maxheight"
        @rejected="rejected"
        @added="added"
      >
        <template v-slot:header="scope">
          <div class="row no-wrap items-center q-pa-none q-gutter-xs">
            <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
            <div class="col">
              <div
                class="q-uploader__title inline-block"
                style="padding: 4px 0px !important; font-size: 0.95em !important"
              >
                {{ $language(label) }}
              </div>
              &nbsp;&nbsp;
              <div class="q-uploader__subtitle inline-block" v-if="editable">
                {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
              </div>
            </div>
            <q-btn
              v-if="editable && isTemplateDown"
              class="excel-upload-btn"
              icon="file_download"
              dense
              outline
              size="sm"
              :label="$language('양식 다운로드')"
              @click="downTemplate"
            />
            <q-btn
              v-if="scope.queuedFiles.length > 0 && editable"
              class="excel-upload-btn"
              icon="delete"
              dense
              outline
              size="sm"
              :label="$language('파일 삭제')"
              @click="deleteFile()"
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
                <span class="text-positive">{{ $language('업로드 가능 확장자') }}</span> : xlsx<br />
                <span class="text-positive">{{ $language('업로드 가능 파일 수') }}</span> : 1<br />
                <span class="text-positive">{{ $language('허용 파일 크기') }}</span> : 100MB
              </div>
              <q-uploader-add-trigger />
            </div>
          </template>
        </template>
      </q-uploader>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
      <c-card
        title="업로드 현황"
        class="cardClassDetailForm excel-upload-status-card"
        height="160px"
        overflowY
      >
        <template v-slot:card-detail>
          <div class="col-12">
            <span class="text-grey-7" v-html="convertEnter(uploadMessage)" />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-12">
      <c-tab
        type="tabcard"
        align="left"
        :tabItems="tabItems"
        :inlineLabel="true"
        :height="tabHeight"
        v-model:value="tab"
      >
        <template v-slot:default="tab">
          <div class="check-up-loading-style">
            <c-table
              :ref="
                (el: any) => {
                  excelUploadTable[Number(tab.name)] = el
                }
              "
              title="Excel Sheet별 결과 목록"
              :editable="editable"
              :columns="excelUploadInfo.columns"
              :data="
                excelUploadInfo.data[Number(tab.name)]
                  ? excelUploadInfo.data[Number(tab.name)].filter(
                      (data: any) => !errorDataCheck || data.error_message
                    )
                  : []
              "
              class="q-pb-lg table_vt_top"
              gridHeight="600px"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              selection="multiple"
              :rowKey="excelUploadInfo.rowKeys[Number(tab.name)]"
              :customTrClass="setTrClass"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="
                      excelUploadInfo.data[Number(tab.name)] &&
                      excelUploadInfo.data[Number(tab.name)].length > 0 &&
                      editable
                    "
                    label="제외"
                    icon="remove"
                    @btnClicked="removeData(tab.name)"
                  />
                </q-btn-group>
              </template>
              <template v-slot:expand-header>{{ $language('에러 상세') }}</template>
              <template v-slot:expand-td="props">
                <c-card class="excel-upload-status-card" :noHeader="true">
                  <template v-slot:card-detail>
                    <div class="col-12">
                      <span v-html="convertEnter(props.row.error_message)" />
                    </div>
                  </template>
                </c-card>
              </template>
            </c-table>
            <q-inner-loading v-if="firstShow || secondShow" style="z-index: 100" :showing="visible">
              <template v-slot:default>
                <div
                  v-if="firstShow"
                  class="check-up-loading-style-text"
                  data-text="양식에 맞게 업로드 하세요."
                >
                  {{ $language('양식에 맞게 업로드 하세요.') }}
                </div>
                <div
                  v-else-if="secondShow"
                  class="check-up-loading-style-text"
                  data-text="파일을 읽는 중입니다."
                >
                  {{ $language('파일을 읽는 중입니다.') }}
                </div>
              </template>
            </q-inner-loading>
            <q-inner-loading v-else-if="thirdShow" style="z-index: 100" :showing="visible">
              <template v-slot:default>
                <q-spinner-clock class="check-up-spinner" size="5em" />
                <div
                  class="check-up-loading-style-text check-up-animation"
                  data-text="업로드 중입니다. . . ."
                >
                  {{ $language('업로드 중입니다.') }} . . .
                </div>
                <div class="check-up-loading-style-text">
                  <ICountUp
                    :startVal="0"
                    :endVal="ingCnt"
                    :decimals="0"
                    :duration="4"
                    :options="countOptions"
                  />
                </div>
              </template>
            </q-inner-loading>
            <q-inner-loading v-else-if="fourthShow" style="z-index: 100" :showing="visible">
              <template v-slot:default>
                <q-icon name="thumb_up" size="5em" color="primary" class="thumbIcon" />
                <div class="check-up-loading-style-text text-primary">
                  {{ $language('성공적으로 업로드 되었습니다. 적용버튼을 누르세요.') }}
                </div>
              </template>
            </q-inner-loading>
            <q-inner-loading v-else :showing="visible">
              <template v-slot:default>
                <q-spinner-comment class="check-up-spinner" size="5em" />
                <div class="check-up-loading-style-text" v-html="failMessage" />
              </template>
            </q-inner-loading>
          </div>
        </template>
      </c-tab>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable no-unused-vars */
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
import { bytesToSize, getHeaders, base64ToBlob, convertEnter, orderedPromise } from '@utils/common'
// import { useLoadingStore } from '@stores/loading'
import ICountUp from 'vue-countup-v3'
import { read, utils } from 'xlsx'
import { encrypt, fileDownDecrypt } from '@utils/aes256'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CCheckUpExcelUpload'
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
const emits = defineEmits(['noUpload', 'saveFileInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  editable?: boolean
  isTemplateDown?: boolean
  label?: string
  maxheight?: string
  tabHeight?: string
  gridHeight?: string
  hospitalId?: stringNull
  heaCheckupPlanId?: stringNull
  excelUploadInfo?: {
    rowKeys: Array<string>
    taskClassCd: string // 엑셀업로드 양식 구분 값
    sheetNum: number
    columns: Array<tableColumnType>
    data: Array<any>
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
  name: '',
  editable: true,
  isTemplateDown: true,
  label: '엑셀 업로드',
  maxheight: 'max-height:200px;min-height:200px;width: 100%;',
  tabHeight: '430px',
  gridHeight: '400px',
  hospitalId: null,
  heaCheckupPlanId: null,
  excelUploadInfo: () => {
    return {
      rowKeys: [], // 데이터들의 키 속성값
      taskClassCd: '', // 엑셀업로드 양식 구분 값
      sheetNum: 0,
      columns: [],
      data: []
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
const errorDataCheck = ref(false)
const fileInfo = ref({
  oriFileNm: '',
  fileExt: ''
})
const uploadIndex = ref(0)
const firstShow = ref(true)
const secondShow = ref(false)
const thirdShow = ref(false)
const fourthShow = ref(false)
const visible = ref(true)
const isUpload = ref(false)
const isError = ref(false)
const failMessage = ref('')
const uploadMessage = ref('')
const templateHeader = ref<Array<any>>([])
const sheetNames = ref<Array<any>>([])
const tab = ref(0)
const fileInfoUrl = ref('')
const templateExcelFileUrl = ref('')
const listUrl = ref('')
const checkupList = ref<Array<any>>([])
const countOptions = ref({
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
  prefix: '',
  suffix: '건 / 300건'
})
const ingCnt = ref(0)
const tempSaveUrl = ref('')
const tempDeleteUrl = ref('')
const tempListUrl = ref('')
const jsonData = ref<Array<any>>([])
const columnIdx = ref(0)
const seqCount = ref(0)
const noUserCnt = ref(0)
const successResult = ref<Array<any>>([])
// const retireUserCnt = ref(0)
// const retireUsers = ref('')
const noUsers = ref('')
const excelUpload = ref<any>(null)
const excelUploadTable = ref<Array<any>>([])
const cfb = ref<any>({})
const longNames = ref<Array<any>>(['일반1차조치', '취급물질', '특수소견', '특수조치'])
const truncateSize = ref<number>(100)

/******************************
 * @Computed_선언
 *******************************/
const tabItems = computed(() =>
  _.map(sheetNames.value || [], (sheet, idx) => ({
    name: idx,
    label: sheet
  }))
)
/******************************
 * @Watch_선언
 *******************************/
watch(uploadMessage, () => {
  // 오류 메시지가 있는 경우 Excel 결과 목록에 표시 X > 업로더에 올라간 파일로 reset
  if (isError.value) {
    props.excelUploadInfo.data = []
    excelUpload.value.reset()
  }
})

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
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
  // url setting
  listUrl.value = selectConfig.hea.examine.list.url
  templateExcelFileUrl.value = selectConfig.sys.excelUpload.template.url
  fileInfoUrl.value = selectConfig.com.upload.fileInfo.url
  tempSaveUrl.value = transactionConfig.hea.examine.tempUploadSave.url
  tempDeleteUrl.value = transactionConfig.hea.examine.tempUploadDelete.url
  tempListUrl.value = selectConfig.hea.examine.tempUploadList.url
  // code setting
  // list setting
  getCheckUpItemList()
  getFileInfo()
  getExcelTemplateHeader()
}
/******************************
 * TODO (목적): 검진항목 조회
 *******************************/
function getCheckUpItemList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    checkupList.value = _result.data
  })
}
/******************************
 * TODO (목적): 엑셀파일 양식 정보 조회
 *******************************/
function getFileInfo() {
  $http({
    url: fileInfoUrl.value,
    method: 'GET',
    params: {
      taskClassCd: 'EXCEL_UPLOAD_TEMPLATE',
      taskKey: props.excelUploadInfo.taskClassCd
    }
  }).then((_result: any) => {
    fileInfo.value = _result.data
  })
}
/******************************
 * TODO (목적): 파일 추가
 * @param (1): 파일 Array
 *******************************/
function added(files: readonly any[]) {
  emits('noUpload', true)
  isUpload.value = true
  ingCnt.value = 0
  visible.value = true
  failMessage.value = ''
  firstShow.value = false
  secondShow.value = true
  thirdShow.value = false
  fourthShow.value = false

  isError.value = false
  uploadMessage.value = ''
  props.excelUploadInfo.data = []
  // 엑셀의 헤더가 업로드 된 엑셀과 맞지 않을 경우를 체크
  const reader = new FileReader()
  reader.readAsDataURL(files[0]) // 첫 번째 파일을 데이터 URL로 읽음
  reader.onload = function () {
    const base64Data = String(reader.result!).replace('data:' + files[0].type + ';base64,', '') // 파일의 결과의 base64 데이터에서 메타정보 제거
    cfb.value = read(base64Data, {
      type: 'base64',
      cellDates: false // 날짜 셀 처리 (false > 날짜값 문자열로 읽어옴)
    })
    const sheetNum = props.excelUploadInfo.sheetNum || 0 // 시트 수를 가져옴, 기본값은 0
    for (let i = 0; i <= sheetNum; i++) {
      const excelHeader = getHeaders(cfb.value.Sheets[cfb.value.SheetNames[i]]) // 엑셀 헤더 가져오기
      jsonData.value = utils.sheet_to_json(cfb.value.Sheets[cfb.value.SheetNames[i]], {
        raw: false
        // cellDates: true
      }) // 엑셀시트의 데이터를 JSON 으로 변환
      const uploadExcel = {
        header: excelHeader,
        data: jsonData.value
      }
      // 1. 헤더가 맞지 않은 경우 체크 > templateHeader = 기본양식다운로드용 엑셀파일의 헤더에서 가져온 임시헤더
      const headerCheck = templateHeader.value[i].every(
        (item: any, idx: number) => uploadExcel.header[idx] === item
      ) // 헤더가 일치하는지 확인 (일치하면 true, 불일치시 false 리턴)
      if (!headerCheck) {
        isError.value = true
        uploadMessage.value += $language(
          '업로드한 엑셀의 헤더가 올바르지 않습니다. 양식 다운로드하여 확인바랍니다.'
        )
        emitUpload()
        break
      }
      // 2. 데이터가 없는 경우 체크
      if (!uploadExcel.data || uploadExcel.data.length === 0) {
        isError.value = true
        uploadMessage.value += $language(
          '업로드한 엑셀에 데이터가 없습니다. 확인 후 업로드 해주십시오.'
        )
        emitUpload()
        break
      }
      // 3. 검진항목 넣는 곳 > 업로드한 엑셀파일의 각 헤더 반복하며 > 검진항목리스트(마스터)에서 엑셀헤더명과 일치한 인덱스찾기
      let count = 0
      _.forEach(excelHeader, (header: any) => {
        const idx = _.findIndex(checkupList.value, { examineName: header })
        let findData: any = null
        if (idx > -1 && count > 12) {
          findData = checkupList.value[idx]
          _.forEach(jsonData.value, (obj) => {
            renameKey(obj, header, findData.examineName)
          }) // 키 이름 변경 (업로드엑셀파일의 헤더값과 마스터헤더값이 불일치할경우 마스터헤더값으로 변경)
          props.excelUploadInfo.columns.push({
            name: findData.examineId,
            field: findData.examineId,
            label: findData.examineName,
            roCd: findData.roCd,
            isExamine: true,
            align: _.includes(longNames.value, findData.examineName) ? 'left' : 'center',
            style: _.includes(longNames.value, findData.examineName) ? 'width:160px' : 'width:80px'
          })
        }
        count++
      })
      // 업로드 한 파일 데이터 모두 저장
      columnIdx.value = i
      saveData(i)
    }
  }
}
/******************************
 * TODO (목적): 데이터 저장 초기 시점
 *******************************/
function saveData(currentSheetIdx: number) {
  seqCount.value = 0
  uploadIndex.value = 0
  const promises = []
  countOptions.value.suffix = `건 / ${jsonData.value.length}건`
  const quotient = Math.ceil(jsonData.value.length / truncateSize.value) // 100으로 나눈 몫
  for (let j = 0; j < quotient; j++) promises.push({ func: () => saveDataDetail(currentSheetIdx) })
  promises.push(
    {
      func: validCheck
    },
    {
      func: () => completeUpload(currentSheetIdx)
    }
  ) // 데이터 유효성 검사와 업로드 완료 함수를 추가
  orderedPromise(promises)
}
/******************************
 * TODO (목적): 몫 횟수만큼 프로미스 배열에 saveDetail 함수 추가
 *******************************/
function saveDataDetail(currentSheetIdx: number) {
  const start = uploadIndex.value * truncateSize.value
  const end = start + truncateSize.value
  const sliceRows = _.slice(jsonData.value, start, end)

  return new Promise((resolve, _reject) => {
    const saveRows: any = []
    firstShow.value = false
    secondShow.value = false
    thirdShow.value = true
    fourthShow.value = false

    _.forEach(sliceRows, (row) => {
      const resultRows: any = []
      const opinionRows: any = []
      _.forEach(Object.keys(row), (_examineName) => {
        const idx1 = _.findIndex(props.excelUploadInfo.columns, {
          label: _examineName,
          isExamine: true
        })
        if (
          idx1 > -1 &&
          props.excelUploadInfo.columns[idx1].roCd === 'R' &&
          row[_examineName] &&
          row[_examineName] != ''
        ) {
          resultRows.push({
            regUserId: user.value.userId,
            heaCheckupPlanId: props.heaCheckupPlanId,
            heaCheckupUploadDetailId: uid(),
            examineId: props.excelUploadInfo.columns[idx1].name,
            examineName: _examineName,
            examineData: row[_examineName],
            roCd: props.excelUploadInfo.columns[idx1].roCd
          })
        }
      })
      const healthType = (row['특수판정'] || '').split('/')
      for (let idx = 0; idx < healthType.length; idx++) {
        opinionRows.push({
          regUserId: user.value.userId,
          heaCheckupPlanId: props.heaCheckupPlanId,
          heaCheckupUploadDetailId: uid(),
          laborCd: (row['노동부일반1차판정'] || '').split('/')[idx] || '',
          laborOpinion: (row['노동부일반1차소견'] || '').split('/')[idx] || '',
          industrialCd: (row['공단일반1차판정'] || '').split('/')[idx] || '',
          industrialOpinion: (row['공단일반1차소견'] || '').split('/')[idx] || '',
          industrialMeasure: (row['일반1차조치'] || '').split('/')[idx] || '',
          hazardName: (row['취급물질'] || '').split('/')[idx] || '',
          healthType: (row['특수판정'] || '').split('/')[idx] || '',
          checkupOpinion: (row['특수소견'] || '').split('/')[idx] || '',
          afterManage: (row['특수조치'] || '').split('/')[idx] || '',
          suitableFlag: (row['특수업무적합성'] || '').split('/')[idx] || '',
          suitableType: (row['특수사후관리'] || '').split('/')[idx] || '',
          remark: (row['비고'] || '').split('/')[idx] || ''
        })
      }
      saveRows.push({
        regUserId: user.value.userId,
        heaCheckupPlanId: props.heaCheckupPlanId,
        heaCheckupUploadId: uid(),
        userName: row['성명'],
        jobClassName: row['직종'],
        birthDate: formatDate2(row['주민번호']),
        checkupDate: formatDate2(row['검진일자']),
        gender: row['성별'],
        enterDate: formatDate2(row['입사일자']),
        moveDate: formatDate2(row['전입일자']),
        deptName: row['부서'],
        empNo: row['사번'],
        saveDetails: resultRows,
        opinionRows: opinionRows
      })
    })
    $http({
      url: tempSaveUrl.value,
      method: 'POST',
      data: saveRows
    }).then(
      (_result: any) => {
        if (_result.data > 0) {
          ingCnt.value += sliceRows && sliceRows.length > 0 ? sliceRows.length : 0 // 처리건수 카운트
          uploadIndex.value++ // 다음시트로 넘어감
          columnIdx.value = currentSheetIdx
          resolve(true)
        } else {
          thirdShow.value = false
          ingCnt.value += sliceRows && sliceRows.length > 0 ? sliceRows.length : 0
          uploadIndex.value++
          deleteTempData()
          failMessage.value = '업로드 결과 저장 중 에러가 발생하였습니다. 담당자에게 문의 바랍니다.'
          _reject('')
        }
      },
      () => {
        _reject('')
        deleteTempData()
      }
    )
  })
}
/******************************
 * TODO (목적): 유효성 체크
 *******************************/
function validCheck() {
  return new Promise((resolve, _reject) => {
    $http({
      url: tempListUrl.value,
      method: 'GET',
      params: { noUserFlag: '' }
    }).then(
      (_result: any) => {
        /**
         * 다시 업로드하는 경우
         * 1. 검진일자 없을 때
         * 2. 업로드 할 데이터가 없을 때
         *
         * 유저 정보가 없을 때
         * 1. 확인 : 필터링 -> 유저 제외
         * 2. 취소 : 다시 업로드
         */
        if (_result.data && _result.data.length > 0) {
          successResult.value = _result.data
          const idx = _.findIndex(
            _result.data,
            (item: any) => item.checkupDate === '' || item.checkupDate === null
          )
          const noUserList = _.filter(_result.data, { noUserFlag: 'Y' })
          // let retireUserList = _.filter(noUserList, {retireFlag: 'Y'})
          if (idx > -1) {
            thirdShow.value = false
            deleteTempData()
            failMessage.value =
              '검진일자를 입력하지 않은 데이터가 있습니다. 입력 후 다시 업로드하세요.'
            _reject('')
          }
          if (noUserList && noUserList.length > 0) {
            // retireUserCnt = retireUserList.length
            // retireUsers = _.map(retireUserList, 'userName').toString()
            noUserCnt.value = noUserList.length
            noUsers.value = _.map(noUserList, 'userName').toString()
            message.confirm({
              title: '확인',
              message: '사번이 없거나 퇴직한 대상자가 있습니다. 제외하고 업로드하시겠습니까?',
              type: 'info', // success / info / warning / error
              confirmCallback: () => {
                _.forEach(noUserList, (_item) => {
                  jsonData.value = _.reject(jsonData.value, {
                    성명: _item.userName
                  })
                })
                resolve(true)
              },
              cancelCallback: () => {
                thirdShow.value = false
                deleteTempData()
                failMessage.value = '대상자 확인 후 다시 업로드하세요. [ ' + noUsers.value + ' ]'
                _reject('')
              }
            })
          } else resolve(true)
        } else {
          thirdShow.value = false
          deleteTempData()
          failMessage.value = '업로드 할 데이터가 없습니다.'
          _reject('')
        }
      },
      () => {
        _reject('')
        deleteTempData()
      }
    )
  })
}
/******************************
 * TODO (목적): 유효성 체크 후 마지막으로 데이터 정리
 *******************************/
function completeUpload(currentSheetIdx: number) {
  return new Promise((resolve, _reject) => {
    firstShow.value = false
    secondShow.value = false
    thirdShow.value = false
    fourthShow.value = true
    const rowData: any = []
    const filteredData = jsonData.value.filter(
      (_data: any) => _data['사번'] != null && _data['사번'] !== ''
    )
    filteredData.forEach((__data: any) => {
      const cellData: any = {
        error_message: ''
      }
      cellData[props.excelUploadInfo.rowKeys[currentSheetIdx]] = uid()
      props.excelUploadInfo.data[currentSheetIdx] = []
      _.forEach(props.excelUploadInfo.columns, (item) => {
        // 날짜 형식 변환
        if (['checkupDate', 'enterDate', 'moveDate'].includes(item.name)) {
          cellData[item.name] = formatDate2(__data[item.label]) // 형식 변환 함수 호출
        } else if (item.name === 'birthDate') cellData[item.name] = formatDate2(__data['주민번호'])
        else cellData[item.name] = __data[item.label] // 업로드한 엑셀데이터를 한줄씩 오브젝트에 넣는다.
      })
      rowData.push(cellData)
    })
    props.excelUploadInfo.data[currentSheetIdx] = rowData // 데이터 표시
    uploadMessage.value +=
      `<b>✅ ${$language('Sheet 명')}</b> : ${cfb.value.SheetNames[currentSheetIdx]}\n` +
      ` <b>- ${$language('총 데이터 수')}</b> : ${jsonData.value.length}\n` +
      ` <b class="text-primary">- ${$language('업로드된 데이터 수')}</b> : ${successResult.value.length}\n` +
      ` <b class="text-red">- ${$language('제외된 데이터 수')}</b> : ${jsonData.value.length - successResult.value.length}` +
      (noUsers.value ? ` [ ${noUsers.value} ]` : '') +
      '\n' +
      ` <b>- ${$language('퇴직자는 업로드 할 수 없습니다.')} </b>\n`

    // 업데이트된 SheetNames로 sheetNames 값을 업데이트
    const _items = (cfb.value.SheetNames || []).map((sheet: any, idx: number) => ({
      name: idx,
      label: sheet
    }))
    // 여기서 sheetNames를 업데이트하면 tabItems도 자동으로 변경됩니다.
    sheetNames.value = _items.map((item: any) => item.label)

    setTimeout(() => {
      visible.value = false
      emitUpload()
    }, 2000) // 2초 후 업로드 프로세스 완료
    resolve(true) // Promise 완료
  })
}
/******************************
 * TODO (목적): 엑셀 헤더의 검진항목 중 빈 값들을 필터링
 *******************************/
function renameKey(obj: any, oldKey: string, newKey: string) {
  // Key값 바꾸면서 검진항목 중 빈 값들은 필터
  if (oldKey !== newKey && obj[oldKey]) {
    obj[newKey] = obj[oldKey]
    delete obj[oldKey]
  }
}
/******************************
 * TODO (목적): no Upload Emit
 *******************************/
function emitUpload() {
  isUpload.value = false
  emits('noUpload', false)
}
/******************************
 * TODO (목적): 첨부가 안됐을 때 메시지 표시
 *******************************/
function rejected(info: Array<any>) {
  if (!info || info.length === 0) return
  // 다시 파일을 올림으로 인해 메시지를 초기화 처리함
  isError.value = false
  uploadMessage.value = ''
  _.forEach(info, (reject) => {
    // accept, max-file-size, max-total-size, filter, etc
    switch (reject.failedPropValidation) {
      case 'max-file-size': // 파일용량 초과
      case 'max-total-size': // 파일 전체 용량 초과
        isError.value = true
        uploadMessage.value +=
          $language('첨부하신 파일의 용량이 지정된 용량보다 큽니다. 파일 용량 : ') +
          bytesToSize(reject.file.size)
        break
      case 'max-files': // 업로드 갯수 초과
        isError.value = true
        uploadMessage.value = $language(
          '첨부하신 파일의 지정된 업로드 갯수를 초과하여 업로드 되지 않았습니다.'
        )
        break
      case 'accept': // 확장자 맞지않음
        isError.value = true
        uploadMessage.value =
          $language('첨부하신 파일의 확장자가 올바르지 않습니다. 첨부한 파일명 : ') +
          reject.file.name
        break
      case 'filter': // filter 걸린경우
        break
      default:
        break
    }
  })
}

/******************************
 * TODO (목적): 엑셀 업로드 양식 헤더 반환
 *******************************/
function getExcelTemplateHeader() {
  if (!props.excelUploadInfo.taskClassCd) return
  $http({
    url: templateExcelFileUrl.value,
    method: 'GET',
    params: { taskClassCd: encrypt(props.excelUploadInfo.taskClassCd) }
  }).then((_result: any) => {
    const fileDecInfo = fileDownDecrypt(_result.data)
    if (fileDecInfo.id === props.excelUploadInfo.taskClassCd) {
      const cfb = read(fileDecInfo.bytes, { type: 'base64' })
      sheetNames.value = []
      templateHeader.value = []
      const sheetNum = props.excelUploadInfo.sheetNum || 0
      for (let i = 0; i <= sheetNum; i++) {
        sheetNames.value.push(cfb.SheetNames[i])
        templateHeader.value.push(getHeaders(cfb.Sheets[cfb.SheetNames[i]]))
      }
    } else {
      message.alert({
        title: '안내',
        message: '잘못된 정보입니다.',
        type: 'error' // success / info / warning / error
      })
    }
  })
}
/******************************
 * TODO (목적): 엑셀 양식 다운로드
 *******************************/
function downTemplate() {
  $http({
    url: templateExcelFileUrl.value,
    method: 'GET',
    params: { taskClassCd: encrypt(props.excelUploadInfo.taskClassCd) }
  }).then((_result: any) => {
    const fileDecInfo = fileDownDecrypt(_result.data)
    if (fileDecInfo.id === props.excelUploadInfo.taskClassCd) {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(
        base64ToBlob(fileDecInfo.bytes, fileInfo.value.fileExt)
      )
      link.download = fileInfo.value.oriFileNm
      link.click()
    } else {
      message.alert({
        title: '안내',
        message: '잘못된 정보입니다.',
        type: 'error' // success / info / warning / error
      })
    }
  })
}
/******************************
 * TODO (목적): 파일 삭제
 *******************************/
function deleteFile() {
  if (isUpload.value) {
    message.alert({
      title: '안내',
      message: '업로드 중 파일을 삭제할 수 없습니다.',
      type: 'error' // success / info / warning / error
    })
    return
  }
  isError.value = false
  uploadMessage.value = ''
  props.excelUploadInfo.data = []
  deleteTempData()
  excelUpload.value.reset()
}

/******************************
 * TODO (목적): TEMP 데이터 삭제
 *******************************/
function deleteTempData() {
  $http({
    url: tempDeleteUrl.value,
    method: 'DELETE'
  }).then((_result: any) => {})
  emitUpload()
}
/******************************
 * TODO (목적): 업로드한 엑셀파일의 데이터를 화면에 표시한후 row 선택하여 삭제
 * @param (1): 엑셀 시트 index
 *******************************/
function removeData(idx: number) {
  const selectData = excelUploadTable.value[idx].getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning'
    })
  } else {
    _.forEach(selectData, (item) => {
      props.excelUploadInfo.data[idx] = _.reject(props.excelUploadInfo.data[idx], (gridItem) => {
        return (
          gridItem[props.excelUploadInfo.rowKeys[idx]] === item[props.excelUploadInfo.rowKeys[idx]]
        )
      })
    })
    excelUploadTable.value[idx].compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 에러 메세지에 따라 행 색상 변경
 * @param (1): 행 정보
 *******************************/
function setTrClass(_props: any) {
  return _props.row.error_message ? 'bg-orange-5' : ''
}
/******************************
 * TODO (목적): '20240424' 를 '2024-04-24' 로 변경해주는 함수
 *******************************/
function formatDate2(dateString: stringNull) {
  if (!dateString) return null
  if (dateString.length === 14) {
    dateString = (dateString?.startsWith('0') ? '20' : '19') + dateString?.split('-')[0]
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return `${year}-${month}-${day}`
  } else if (dateString.length === 8) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)
    return `${year}-${month}-${day}`
  } else return dateString
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.excel-upload
  .q-btn
    margin-top: 0px !important
    margin-left: 0px !important
.excel-upload.q-uploader--disable
    min-height: 200px !important
.excel-upload-cover
  margin-top: 5px !important
  height: 700px

.q-uploader--disable
  max-height: 36px !important
  min-height: 20px !important

.empty_dscription
  font-size: 14px
  color: #909399
  margin-bottom: 0 !important

.file-origin-name
  line-height: 2em!important

.file-description
  .q-field--with-bottom
    padding-bottom: 0px !important
  .q-field--dense .q-field__inner
    padding-bottom: 0px !important

.excel-upload-status-card
  .customCardbody
    padding-top: 0px !important

.excel-upload-btn
  margin: 0px !important
  margin-right: 3px !important
  height: 26px !important

.txtfileinfo
  padding-left: 0px !important
  word-break: break-all
  font-size: 12px
.nofileArea
  height: 196px
  font-size: 0.95em !important
</style>
<style>
.check-up-spinner {
  color: #3498db;
}
.check-up-complete-icon {
  font-size: 5em;
}

.check-up-loading-style {
  background: white; /* #3498db; */
  height: 600px;
}
.check-up-loading-style-text {
  font-size: 2.1em;
  font-weight: 600;
  color: #5f5f5f;
}
.check-up-loading-style-text-sub {
  font-size: 1.1em;
  font-weight: 400;
  cursor: pointer;
}

.check-up-animation {
  color: rgba(0, 0, 0, 0.3);
}
.check-up-animation:before {
  content: attr(data-text);
  position: absolute;
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap;
  color: #3498db;
  animation: loading 3s linear;
  animation-iteration-count: infinite;
}
@keyframes loading {
  0% {
    max-width: 0;
  }
}

.thumbIcon {
  animation: motion 0.3s /* 속도 */ linear 0s /* 처음부터 끝까지 일정 속도로 진행 */ infinite
    alternate; /* 무한 반복 */
}
@keyframes motion {
  0% {
    margin-top: 0px;
  } /* 처음 위치 */
  100% {
    margin-top: 10px;
  } /* 마지막 위치 */
}
</style>
