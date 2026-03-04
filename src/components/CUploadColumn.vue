<template>
  <div v-if="isUploaderSetting">
    <q-uploader
      flat
      bordered
      with-credentials
      ref="tableUpload"
      class="table-upload"
      capture="environment"
      field-name="file"
      :url="url"
      :headers="headers"
      method="POST"
      :label="$language(label)"
      :form-fields="formFields"
      :auto-upload="false"
      :hide-upload-btn="true"
      :multiple="setting.multipleSelFlag === 'Y'"
      :accept="setting.acceptExt"
      :max-file-size="setting.limitSize * 1000000"
      :max-total-size="setting.limitSize * 1000000 * setting.limitCnt"
      :max-files="maxFiles"
      :no-thumbnails="setting.previewFlag === 'Y'"
      :disable="!editable"
      :style="maxheight"
      @added="added"
      @finish="finish"
      @failed="failed"
      @rejected="rejected"
    >
      <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-none">
          <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
          <div class="col no-margin" />
          <q-btn
            v-if="editable && maxFiles > 0"
            class="no-margin"
            icon="add"
            size="sm"
            round
            dense
            flat
          >
            <q-uploader-add-trigger />
            <q-tooltip>{{ $language('파일 선택하기') }}</q-tooltip>
          </q-btn>
          <q-btn
            v-if="haveImage()"
            class="no-margin"
            icon="visibility"
            round
            dense
            flat
            size="sm"
            @click="allImagePreView"
          >
            <q-tooltip>{{ $language('이미지 파일 미리보기') }}</q-tooltip>
          </q-btn>
          <q-btn
            v-if="fileList && fileList.length > 0"
            class="no-margin"
            icon="delete_outline"
            round
            dense
            flat
            size="sm"
            @click="removeAllFiles"
          >
            <q-tooltip>{{ $language('파일 전체 삭제') }}</q-tooltip>
          </q-btn>
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
            </q-item>
          </q-list>
        </template>
        <template v-else>
          <div class="empty_dscription">
            <q-uploader-add-trigger />
          </div>
        </template>
      </template>
    </q-uploader>
    <q-list
      v-if="fileList && fileList.length > 0"
      separator
      bordered
      class="uploaded-file-list uploaded-file-list-table"
    >
      <q-item v-for="(file, idx) in fileList" :key="idx">
        <q-item-section>
          <q-item-label class="table-file-origin-name">
            <span class="text-blue cursor-pointer table-ellipsis" @click.prevent="fileDown(file)">
              {{ file.oriFileNm }}
              <q-tooltip anchor="bottom left" self="top left">
                {{ file.oriFileNm }}
              </q-tooltip>
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section
          v-if="file.contentType && file.contentType.indexOf('image') > -1"
          thumbnail
          class="gt-xs cursor-pointer"
        >
          <img
            class="thumnailUpload"
            :src="file.imgUrl ? file.imgUrl : file.filePath"
            @click.prevent="setPreview(file, 'single')"
          />
        </q-item-section>
        <q-item-section top side>
          <q-btn
            v-if="editable"
            class="gt-xs"
            size="12px"
            flat
            dense
            round
            icon="delete"
            @click.prevent="removeFile(file)"
          >
            <q-tooltip>{{ $language('파일 삭제') }}</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
    <!-- 이미지 미리보기 -->
    <q-dialog
      v-if="preview && (preview.src || (preview.fileList && preview.fileList.length > 0))"
      v-model="preview.isShow"
    >
      <q-card class="preview-image-card" style="padding: 10px">
        <p style="margin-bottom: 25px">
          <q-icon
            name="close"
            size="sm"
            class="cursor-pointer preview-close-btn text-grey-7"
            @click="preview.isShow = false"
          >
            <q-tooltip class="bg-dark">{{ $language('창닫기') }}</q-tooltip>
          </q-icon>
        </p>
        <p>
          <q-carousel
            v-if="preview.fileList && preview.fileList.length > 0"
            swipeable
            animated
            thumbnails
            infinite
            style="max-width: 100%; max-height: 700px"
            v-model="preview.slide"
            @transition="transitionImage"
          >
            <q-carousel-slide
              v-for="(file, idx) in preview.fileList"
              :key="idx"
              :name="file.sysAttachFileId"
              :img-src="file.src"
              fit="contain"
              style="
                border: 1px solid #bdbdbd !important;
                border-radius: 15px;
                background-size: contain !important; /* 이미지가 잘리지 않도록 */
                background-position: center center;
                background-repeat: no-repeat;
              "
            />
          </q-carousel>
          <q-img
            fit="contain"
            v-else
            :src="preview.src"
            style="
              max-width: 100%;
              max-height: 710px;
              width: auto;
              height: auto;
              object-fit: contain;
              position: relative;
              display: block;
            "
          />
        </p>
        <q-card-section>
          <div class="row no-wrap items-center" style="margin: -20px 0">
            <div class="col">{{ preview.oriFileNm }}</div>
            <div class="col-auto text-grey">
              <span style="margin-right: 20px">{{ getFileSizeTextByRound(preview.fileSize) }}</span>
              <q-icon
                name="save_alt"
                size="md"
                style="position: relative; top: -4px"
                class="cursor-pointer preview-close-btn text-primary"
                @click.prevent="fileDown(preview)"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
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
import { ref, watch, computed, inject, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { forEach, extend, find } from 'lodash-es'
import { uid, useQuasar } from 'quasar'
import Compressor from 'compressorjs'
import $format from 'string-format'

import selectConfig from '@utils/selectConfig'
import transactionConfig from '@utils/transactionConfig'
import { $http } from '@utils/http'
import { bytesToSize, base64ToBlob, getAccept } from '@utils/common'
import { encrypt, fileDownDecrypt } from '@utils/aes256'

import { GetTranLanguageFunction } from '@/types/language'

import { useUserStore } from '@stores/user'

import { getAccessToken } from '@/common/auth'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CUploadColumn'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['upload-change'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  editable?: boolean
  label?: string
  maxheight?: string
  col: {
    taskClassCd: string
    taskKey: string
    keyText: string
    name: string
    disableData?: string
  }
  row: any
  uploaderSetting: {
    multipleSelFlag: string
    previewFlag: string
    acceptExt: string
    limitSize: number
    limitCnt: number
    noThumbnails: boolean
    explainFlag: string
    resizeWidth: number
    resizeQuality: number
  }
  colUploaderSetting: any
  imageRestriction: {
    width: number
    height: number
  }
  change: {
    data: string
  }
}
type previewType = {
  slide: number
  isShow: boolean
  sysAttachFileId: string
  src: string
  oriFileNm: string
  fileSize: 0
  description: string
  fileExt: string
  fileList: Array<any>
}
type queuedFileInfoType = {
  files: Array<any>
  compressFiles: Array<any>
  len: number
  isStart: boolean
  isUpload: boolean
}
type fileType = {
  oriFileNm: string
  fileSize: number
  description: string
  contentType: string
  imgUrl: string
  filePath: string
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
  label: '첨부파일',
  maxheight: 'max-height:200px;',
  col: () => {
    return {
      taskClassCd: '',
      taskKey: '',
      keyText: '',
      name: ''
    }
  },
  row: () => {},
  uploaderSetting: () => {
    return {
      multipleSelFlag: 'N',
      previewFlag: 'N',
      acceptExt: '*',
      limitSize: 1048576,
      limitCnt: 5,
      noThumbnails: false,
      explainFlag: 'N',
      resizeWidth: 0,
      resizeQuality: 1
    }
  },
  colUploaderSetting: () => {},
  imageRestriction: () => {
    return {
      width: 0,
      height: 0
    }
  },
  change: () => {
    return {
      data: ''
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
const preview = ref<previewType>({
  slide: 1,
  isShow: false,
  sysAttachFileId: '',
  src: '',
  oriFileNm: '',
  fileSize: 0,
  description: '',
  fileExt: '',
  fileList: []
})
const isUploaderSetting = ref(false)
const fileList = ref<Array<fileType>>([])
const uploderSettingUrl = ref('')
const uploadedFilesUrl = ref('')
const tempTaskKeyUpdateUrl = ref('')
const allDeleteUrl = ref('')
const deleteUrl = ref('')
const previewUrl = ref('')
const fileDownUrl = ref('')
const tableUpload = ref<any>(null)
/** 파일 압축 */
const queuedFileInfo = ref<queuedFileInfoType>({
  files: [],
  compressFiles: [],
  len: 0,
  isStart: false,
  isUpload: false
})
/** compressor Data */
const options = ref<Compressor.Options>({
  strict: true,
  checkOrientation: true,
  maxWidth: 600,
  maxHeight: undefined,
  minWidth: 0,
  minHeight: 0,
  width: undefined,
  height: undefined,
  resize: 'contain', // none contain cover
  quality: 0.1,
  mimeType: '',
  convertTypes: 'image/png',
  convertSize: 5000000,
  success: () => {},
  error: () => {}
  // success: this.successCompress,
  // error: this.errorCompress,
})
const $q = useQuasar()

/******************************
 * @Computed_선언
 *******************************/
const url = computed(
  () => import.meta.env.VITE_API_URL + transactionConfig.com.upload.uploading.url
)
const headers = computed(() => [{ name: 'X-Authorization', value: String(getAccessToken()) }])
const setting = computed(() =>
  props.colUploaderSetting && props.colUploaderSetting.limitCnt > 0
    ? props.colUploaderSetting
    : props.uploaderSetting
)
const attachInfo = computed(() => {
  let taskKey = ''
  if (props.col.keyText && props.row[props.col.keyText]) {
    taskKey = props.row[props.col.keyText]
  } else {
    /**
     * 신규인 경우 taskKey가 없을 수 있음
     * 해당의 경우 api-server에서 유니크한 id를 생성하여 저장 후 반환한다.
     */
    taskKey = props.col.taskClassCd + '_' + uid()
  }
  return {
    taskClassCd: props.col.taskClassCd,
    taskKey: taskKey
  }
})
const formFields = computed(() => {
  const data = [
    {
      name: 'regUserId',
      value: user.value.userId
    },
    {
      name: 'chgUserId',
      value: user.value.userId
    }
  ]
  if (attachInfo.value) {
    data.push({
      name: 'taskClassCd',
      value: attachInfo.value.taskClassCd
    })
    data.push({
      name: 'taskKey',
      value: attachInfo.value.taskKey
    })
  }
  return data
})
const maxFiles = computed(() => {
  const fileCnt = fileList.value ? fileList.value.length : 0
  return setting.value.limitCnt - fileCnt
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => attachInfo.value.taskClassCd,
  () => {
    setUploderSetting()
    getUploadedFiles()
  }
)
watch(
  () => attachInfo.value.taskKey,
  () => {
    getUploadedFiles()
  }
)
watch(
  () => props.change.data,
  () => {
    getUploadedFiles()
  }
)
watch(
  () => props.row,
  (newData, oldData) => {
    if (newData[`uprecol_${props.col.name}`] !== oldData[`uprecol_${props.col.name}`]) {
      getUploadedFiles()
    }
  },
  {
    deep: true
  }
)
watch(attachInfo, () => {
  if (
    attachInfo.value &&
    attachInfo.value.taskKey &&
    !(props.col.keyText && props.row[props.col.keyText])
  ) {
    props.row[props.col.keyText] = attachInfo.value.taskKey
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
  // url setting
  uploderSettingUrl.value = selectConfig.sys.attach.get.url
  uploadedFilesUrl.value = selectConfig.com.upload.fileList.url
  tempTaskKeyUpdateUrl.value = transactionConfig.com.upload.save.url
  allDeleteUrl.value = transactionConfig.com.upload.allDelete.url
  deleteUrl.value = transactionConfig.com.upload.delete.url
  previewUrl.value = selectConfig.com.upload.preview.url
  fileDownUrl.value = selectConfig.com.upload.fileDown.url

  setUploderSetting()
  getUploadedFiles()
  setCompressOptions()
}
/******************************
 * TODO (목적): byte단위의 파일 크기를 보기 좋게 표시
 * @param (1): 파일 크기 (byte)
 *******************************/
function getFileSizeTextByRound(_fileByteSize: number) {
  return bytesToSize(_fileByteSize)
}
/******************************
 * TODO (목적): 파일 업로드 종료
 *******************************/
function finish() {
  tableUpload.value.removeUploadedFiles()
  tableUpload.value.reset()
  reset()
  emits('upload-change', 'F')
  getUploadedFiles()
}
/******************************
 * TODO (목적): 파일 추가, 추가하는 동시에 파일 압축진행
 * @param (1): 추가한 파일들
 *******************************/
function added(files: readonly any[]) {
  if (queuedFileInfo.value.isUpload) return
  compressCheck(files, props.uploaderSetting)
}
/******************************
 * TODO (목적): 파일 업로드 실패
 * @param (1): 실패 정보
 *******************************/
function failed(info: any) {
  let message = ''
  if (info && info.files && info.files.length > 0) {
    message = '['
    let idx = 0
    forEach(info.files, (file) => {
      message += '"' + file.name + (idx !== info.files.length - 1 ? '", ' : '"] ')
      idx++
    })
    message += $language('업로드에 실패하였습니다.')
  }
  $q.notify({
    color: 'negative',
    html: true,
    message: message,
    multiLine: true,
    timeout: 5000
  })
}
/******************************
 * TODO (목적): 업로드할 파일 거부
 * @param (1): 거부된 정보
 *******************************/
function rejected(info: any) {
  if (!info || info.length === 0) {
    return
  }
  let message = ''
  forEach(info, (reject) => {
    // accept, max-file-size, max-total-size, filter, etc
    switch (reject.failedPropValidation) {
      case 'max-file-size': // 파일용량 초과
      case 'max-total-size': // 파일 전체 용량 초과
        message +=
          $language('첨부하신 파일의 용량이 지정된 용량보다 큽니다. 파일 용량 : ') +
          '(' +
          getFileSizeTextByRound(reject.file.size) +
          ')'
        break
      case 'max-files': // 업로드 갯수 초과
        message =
          $language('첨부하신 파일의 지정된 업로드 갯수를 초과하여 업로드 되지 않았습니다.') +
          '(' +
          props.uploaderSetting.limitCnt +
          ')'
        break
      case 'accept': // 확장자 맞지않음
        message =
          $language('첨부하신 파일의 확장자가 올바르지 않습니다.') +
          '(' +
          props.uploaderSetting.acceptExt +
          ')'
        break
      case 'filter': // filter 걸린경우
        // 해당 기능 사용하지 않음으로 다국어 처리하지 않음
        message =
          '첨부하신 이미지 "' +
          reject.file.name +
          '"의 사이즈가 올바르지 않습니다. (사이즈 : ' +
          props.imageRestriction.width +
          ' X ' +
          props.imageRestriction.height +
          ')'
        break
      default:
        break
    }
  })
  $q.notify({
    color: 'negative',
    html: true,
    message: message,
    multiLine: true,
    timeout: 5000
  })
}
/******************************
 * TODO (목적): 업무에 따른 첨부파일 속성 셋팅
 *******************************/
function setUploderSetting() {
  if (!attachInfo.value.taskClassCd) return
  if (props.colUploaderSetting && props.colUploaderSetting.limitCnt > 0) {
    isUploaderSetting.value = true
  } else {
    $http({
      url: $format(uploderSettingUrl.value, attachInfo.value.taskClassCd),
      method: 'GET'
    }).then((_result: any) => {
      if (_result.data) {
        isUploaderSetting.value = true
        extend(props.uploaderSetting, _result.data)
      }
    })
  }
}
/******************************
 * TODO (목적): 업무 & 문서에 따른 첨부파일 조회
 *******************************/
function getUploadedFiles() {
  if (!attachInfo.value.taskClassCd || !attachInfo.value.taskKey) return
  $http({
    url: uploadedFilesUrl.value,
    method: 'GET',
    params: {
      taskClassCd: attachInfo.value.taskClassCd,
      taskKey: attachInfo.value.taskKey
    }
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      // 신규로 등록됨에 따라 임시로 만든 taskKey를 반환처리
      fileList.value = _result.data
      if (fileList.value && fileList.value.length > 0) {
        forEach(fileList.value, (item: any) => {
          const encstr = item.previewImage
          const url = window.URL || window.webkitURL
          const blob = base64ToBlob(encstr, 'image/jpeg')
          const imgUrl = url.createObjectURL(blob)
          item.imgUrl = imgUrl
        })
      }
      props.row.fileList = fileList.value
    } else {
      fileList.value = []
      props.row.fileList = []
    }
  })
}
/******************************
 * TODO (목적): 파일 다운로드
 * @param (1): 다운로드할 파일 정보
 *******************************/
function fileDown(file: any) {
  const accept = getAccept(file.fileExt)
  $http({
    url: fileDownUrl.value,
    method: 'GET',
    params: {
      sysAttachFileId: encrypt(file.sysAttachFileId)
    }
  }).then((_result: any) => {
    const fileInfo = fileDownDecrypt(_result.data)
    if (fileInfo.id === file.sysAttachFileId) {
      const blob = base64ToBlob(fileInfo.bytes, accept)
      const nav = window.navigator as any
      if (nav && nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(blob, file.oriFileNm)
      } else {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = file.oriFileNm
        link.click()
      }
    } else {
      message.alert({
        title: '안내', // 안내
        message: '잘못된 정보입니다.',
        type: 'error' // success / info / warning / error
      })
    }
  })
}
/******************************
 * TODO (목적): 이미지 파일 존재여부 파악
 * @return (반환): 이미지 파일 존재여부
 *******************************/
function haveImage() {
  if (fileList.value && fileList.value.length > 0) {
    let flag = false
    forEach(fileList.value, (file: any) => {
      if (file.contentType && file.contentType.indexOf('image') > -1) {
        flag = true
        return false
      }
    })
    return flag
  } else {
    return false
  }
}
/******************************
 * TODO (목적): 미리보기 셋팅
 * @param (1): 미리보기할 파일 정보
 * @param (2): 파일 여러 개 여부 flag
 *******************************/
function setPreview(file: any, type: 'single' | 'multi') {
  if (!file) return
  // 이미지인  경우
  if (file.sysAttachFileId) {
    if (type === 'single') {
      preview.value.fileList = []
    }
    $http({
      url: previewUrl.value,
      method: 'GET',
      params: {
        sysAttachFileId: encrypt(file.sysAttachFileId)
      }
    }).then((_result: any) => {
      const fileInfo = fileDownDecrypt(_result.data)
      if (fileInfo.id === file.sysAttachFileId) {
        preview.value.isShow = true
        preview.value.sysAttachFileId = file.sysAttachFileId
        if (type === 'single') {
          preview.value.src = 'data:' + file.contentType + ';base64,' + fileInfo.bytes
        } else {
          const curFile: any = find(preview.value.fileList, {
            sysAttachFileId: file.sysAttachFileId
          })
          curFile.src = 'data:' + file.contentType + ';base64,' + fileInfo.bytes
        }
        preview.value.oriFileNm = file.oriFileNm
        preview.value.fileSize = file.fileSize
        preview.value.description = file.description
        preview.value.fileExt = file.fileExt
      } else {
        message.alert({
          title: '안내', // 안내
          message: '잘못된 정보입니다.',
          type: 'error' // success / info / warning / error
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 모든 이미지 미리보기
 *******************************/
function allImagePreView() {
  if (fileList.value && fileList.value.length > 0) {
    preview.value.fileList = []
    forEach(fileList.value, (file: any) => {
      if (file.contentType && file.contentType.indexOf('image') > -1) {
        file.src = file.imgUrl
        preview.value.fileList.push(file)
      }
    })
    const firstFile = preview.value.fileList[0]
    preview.value.slide = firstFile.sysAttachFileId
    preview.value.isShow = true
    setPreview(firstFile, 'multi')
  } else {
    preview.value.fileList = []
  }
}
/******************************
 * TODO (목적): 미리보기 사진 넘기기
 * @param (1): 파일 id (넘길 사진)
 * @param (2): 파일 id (이전 사진)
 *******************************/
function transitionImage(val: string | number, oldVal: string | number) {
  const curFile = find(preview.value.fileList, { sysAttachFileId: val })
  if (curFile) {
    setPreview(curFile, 'multi')
  }

  const preFile = find(preview.value.fileList, { sysAttachFileId: oldVal })
  if (preFile) {
    preFile.src = preFile.imgUrl
  }
}
/******************************
 * TODO (목적): 파일 삭제
 * @param (1): 삭제할 파일 정보
 *******************************/
function removeFile(file: any) {
  $http({
    url: $format(deleteUrl.value, file.sysAttachFileId),
    method: 'DELETE'
  }).then((_result: any) => {
    if (_result.data > 0) {
      $q.notify({
        color: 'positive',
        html: true,
        message: $language('삭제 완료'), // 삭제 완료
        multiLine: true,
        timeout: 5000
      })
      emits('upload-change', 'R')
      getUploadedFiles()
    }
  })
}
/******************************
 * TODO (목적): 파일 전체 삭제
 *******************************/
function removeAllFiles() {
  $http({
    url: $format(allDeleteUrl.value, attachInfo.value.taskKey, attachInfo.value.taskClassCd),
    method: 'DELETE'
  }).then((_result: any) => {
    if (_result.data > 0) {
      $q.notify({
        color: 'positive',
        html: true,
        message: $language('삭제 완료'), // 삭제 완료
        multiLine: true,
        timeout: 5000
      })
      emits('upload-change', 'R')
      getUploadedFiles()
    }
  })
}
/******************************
 * TODO (목적): 파일 압축 옵션 셋팅
 *******************************/
function setCompressOptions() {
  options.value.success = successCompress
  options.value.error = errorCompress
}
/******************************
 * TODO (목적): 파일 압축 체크
 * @param (1): 압축할 파일들
 * @param (2): 압축 셋팅정보
 *******************************/
function compressCheck(files: readonly any[], uploadSetting: any) {
  if (files && files.length > 0) {
    extend(queuedFileInfo.value.files, files)
    queuedFileInfo.value.compressFiles = []
    queuedFileInfo.value.isStart = true
    if (uploadSetting) {
      if (uploadSetting.resizeWidth === 0) {
        options.value.maxWidth = undefined
        options.value.quality = 1
      } else {
        options.value.maxWidth = uploadSetting.resizeWidth
        options.value.quality = uploadSetting.resizeQuality
      }
    }
    // 이미지 파일을 포함한 모든 파일의 갯수
    queuedFileInfo.value.len = files.length
    forEach(queuedFileInfo.value.files, (_file) => {
      compress(_file)
    })
  }
}
/******************************
 * TODO (목적): 파일 압축
 * @param (1): 압축할 파일
 *******************************/
function compress(file: any) {
  if (!file) {
    return
  }
  const reg = /(gif|jpe?g|tiff?|png|webp|bmp)$/g
  const _check = reg.test(file.type)
  if (_check) {
    // if (URL) {
    //   this.inputURL = URL.createObjectURL(file);
    // }
    // this.input = file;
    new Compressor(file, options.value)
    // 이미지
  } else {
    if (!queuedFileInfo.value.compressFiles) queuedFileInfo.value.compressFiles = []
    queuedFileInfo.value.compressFiles.push(file)
    queuedLenMi()
  }
}
/******************************
 * TODO (목적): 파일 압축 성공
 * @param (1): 압축 성공한 파일 정보
 *******************************/
function successCompress(result: any) {
  if (!queuedFileInfo.value.compressFiles) queuedFileInfo.value.compressFiles = []
  queuedFileInfo.value.compressFiles.push(result)
  queuedLenMi()
}
/******************************
 * TODO (목적): 파일 압축 실패
 * @param (1): 실패 정보
 *******************************/
function errorCompress(err: any) {
  console.log(err)
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function reset() {
  queuedFileInfo.value.files = []
  queuedFileInfo.value.compressFiles = []
  queuedFileInfo.value.len = 0
  queuedFileInfo.value.isStart = false
  queuedFileInfo.value.isUpload = false
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function queuedLenMi() {
  queuedFileInfo.value.len = queuedFileInfo.value.len - 1

  if (queuedFileInfo.value.isStart && queuedFileInfo.value.len === 0) {
    tableUpload.value.removeQueuedFiles()
    queuedFileInfo.value.isUpload = true
    setTimeout(() => {
      tableUpload.value.addFiles(queuedFileInfo.value.compressFiles)

      tableUpload.value.upload()
    }, 500)
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
