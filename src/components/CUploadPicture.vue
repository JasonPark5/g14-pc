<!--
목적 : 확장검색 기능을 지원하는 컴포넌트
Detail :
 *
examples:
 *
-->
<template>
  <div v-if="isUploaderSetting || isMultiTask" class="fix-height row upload-picture-cover">
    <div class="col-12">
      <q-uploader
        flat
        bordered
        with-credentials
        ref="customUpload"
        color="custom-upload-color"
        class="custom-upload-picture"
        capture="environment"
        field-name="file"
        :url="url"
        :headers="headers"
        method="POST"
        :label="$language(label)"
        :form-fields="formFields"
        :auto-upload="false"
        :hide-upload-btn="true"
        :multiple="uploaderSetting.multipleSelFlag === 'Y'"
        :accept="uploaderSetting.acceptExt"
        :max-file-size="uploaderSetting.limitSize * 1000000"
        :max-total-size="uploaderSetting.limitSize * 1000000 * uploaderSetting.limitCnt"
        :max-files="maxFiles"
        :no-thumbnails="uploaderSetting.previewFlag === 'Y'"
        :style="uploadStyle"
        @added="added"
        @finish="finish"
        @failed="failed"
        @rejected="rejected"
      >
        <!-- :disable="!editable" -->
        <!-- :filter="filter" -->
        <template v-slot:header />
        <!-- <template v-slot:list="scope"> -->
        <template v-slot:list>
          <div v-if="fileList && fileList.length > 0" class="update-picture-card">
            <q-img
              :src="fileList[previewImageIndex].imgUrl"
              spinner-color="white"
              fit="contain"
              class="upload-picture"
            />
            <div class="info">
              <!-- 이전 사진 -->
              <q-btn
                v-if="fileList && fileList.length > 1"
                unelevated
                round
                dense
                size="10px"
                color="grey"
                icon="chevron_left"
                @click="beforePreView"
              />
              <!-- 확장 -->
              <q-btn
                unelevated
                round
                dense
                size="10px"
                color="primary"
                icon="fullscreen"
                @click="allImagePreView"
              />
              <!-- 삭제 -->
              <q-btn
                v-if="editable && !isMultiTask"
                unelevated
                round
                dense
                size="10px"
                color="negative"
                icon="delete_outline"
                @click="removeFile(fileList[0])"
              />
              <!-- 다음 사진 -->
              <q-btn
                v-if="fileList && fileList.length > 1"
                unelevated
                round
                dense
                size="10px"
                color="grey"
                icon="navigate_next"
                @click="afterPreView"
              />
            </div>
            <template v-if="editable && !isMultiTask">
              <q-uploader-add-trigger />
            </template>
          </div>
          <!-- <template v-else-if="!scope.files || scope.files.length === 0"> -->
          <template v-else>
            <div class="empty_dscription">
              <div style="text-align: center; padding: 5px" v-show="editable && !isMultiTask">
                <!-- <q-chip square icon="info" style="width:100%">
                  Drag or Click
                </q-chip> -->
                <div style="text-align: center">
                  <q-icon size="35px" name="file_upload" />
                </div>
                <div style="text-align: center">
                  <!-- 사진을 올리세요 -->
                  {{ $language('사진을 올리세요.') }}
                </div>
              </div>
              <template v-if="editable && !isMultiTask">
                <q-uploader-add-trigger />
              </template>
            </div>
          </template>
        </template>
      </q-uploader>
    </div>

    <!-- 이미지 미리보기 -->
    <q-dialog
      v-if="preview && (preview.src || (preview.fileList && preview.fileList.length > 0))"
      v-model="preview.isShow"
    >
      <q-card class="preview-image-card">
        <div class="text-right">
          <q-icon
            color="primary"
            @click="preview.isShow = false"
            name="close"
            size="sm"
            class="cursor-pointer q-mt-sm q-mr-sm"
          >
            <q-tooltip>{{ $language('창닫기') }}</q-tooltip>
          </q-icon>
        </div>
        <q-carousel
          v-if="preview.fileList && preview.fileList.length > 0"
          swipeable
          animated
          thumbnails
          infinite
          v-model="preview.slide"
          @transition="transitionImage"
        >
          <q-carousel-slide
            v-for="(file, idx) in preview.fileList"
            :key="idx"
            :name="file.sysAttachFileId"
            :img-src="file.src"
          />
        </q-carousel>
        <q-img v-else :src="preview.src" />
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-grey-9 q-mt-md" style="font-size: 1.2em; font-weight: 500">
              {{ preview.oriFileNm }}
            </div>
            <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              <q-icon
                color="primary"
                name="save_alt"
                size="sm"
                class="cursor-pointer q-mr-sm"
                @click.prevent="fileDown(preview)"
              />
              <span>{{ getFileSizeTextByRound(preview.fileSize) }}</span>
            </div>
          </div>
        </q-card-section>
        <q-separator v-if="preview.description" />
        <q-card-section v-if="preview.description" class="q-pt-none">
          <div class="text-subtitle1">
            <q-icon name="info" />
            {{ $language('파일 설명') }}
          </div>
          <div class="text-caption text-grey">
            {{ preview.description }}
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
import Compressor from 'compressorjs'

import { encrypt, fileDownDecrypt } from '@utils/aes256'

import { getAccessToken } from '@/common/auth'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CUploadPicture'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/** loading 호출 */
const loading = useLoadingStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['files'])

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
  height?: string
  attachInfo: attachSettingType
  imageRestriction?: {
    width: number
    height: number
  }
  isMultiTask?: boolean
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
type fileType = {
  oriFileNm: string
  fileSize: number
  description: string
  contentType: string
  imgUrl: string
  filePath: string
}
type queuedFileInfoType = {
  files: Array<any>
  compressFiles: Array<any>
  len: number
  isStart: boolean
  isUpload: boolean
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
  editable: false,
  label: '첨부파일',
  height: '100px',
  attachInfo: () => {
    return {
      isSubmit: '',
      taskClassCd: '',
      taskKey: '',
      isRev: false,
      task: []
    }
  },
  imageRestriction: () => {
    return {
      width: 0,
      height: 0
    }
  },
  isMultiTask: false
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
const uploaderSetting = ref({
  multipleSelFlag: 'N',
  previewFlag: 'N',
  acceptExt: '*',
  limitSize: 1048576,
  limitCnt: 5,
  noThumbnails: false,
  explainFlag: 'N',
  resizeWidth: 0,
  resizeQuality: 1
})
const previewImageIndex = ref(0)
const fileList = ref<Array<fileType>>([])
const uploderSettingUrl = ref('')
const uploadedFilesUrl = ref('')
const tempTaskKeyUpdateUrl = ref('')
const allDeleteUrl = ref('')
const deleteUrl = ref('')
const previewUrl = ref('')
const fileDownUrl = ref('')
const customUpload = ref<any>(null)
const fileSearchQueue = ref<Array<any>>([])
const $q = useQuasar()
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

/******************************
 * @Computed_선언
 *******************************/
const url = computed(
  () => import.meta.env.VITE_API_URL + transactionConfig.com.upload.uploading.url
)
const headers = computed(() => [{ name: 'X-Authorization', value: String(getAccessToken()) }])
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
  if (props.attachInfo) {
    if (props.attachInfo.taskClassCd) {
      data.push({
        name: 'taskClassCd',
        value: props.attachInfo.taskClassCd
      })
    }
    /**
     * 신규인 경우 taskKey가 없을 수 있음
     * 해당의 경우 api-server에서 유니크한 id를 생성하여 저장 후 반환한다.
     */
    if (props.attachInfo.taskKey) {
      data.push({
        name: 'taskKey',
        value: props.attachInfo.taskKey
      })
    } else {
      const val = props.attachInfo.taskClassCd + '_' + uid()
      data.push({
        name: 'taskKey',
        value: val
      })
    }
  }
  return data
})
const maxFiles = computed(() => {
  const fileCnt = fileList.value ? fileList.value.length : 0
  return uploaderSetting.value.limitCnt - fileCnt
})
const uploadStyle = computed(
  () => `max-height:${props.height};min-height:${props.height};width: 100%;`
)
const isTasks = computed(() => props.attachInfo.task && props.attachInfo.task.length > 0)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.attachInfo.taskClassCd,
  () => {
    setUploderSetting()
    getUploadedFiles()
  }
)
watch(
  () => props.attachInfo.taskKey,
  () => {
    getUploadedFiles()
  }
)
watch(
  () => props.attachInfo.isSubmit,
  () => {
    loading.loadingShow()
    if (fileList.value && fileList.value.length > 0) {
      _.forEach(fileList.value, (file: any) => {
        file.taskKey = props.attachInfo.taskKey
      })
    }
    // 첨부 저장하는 단계
    $http({
      url: tempTaskKeyUpdateUrl.value,
      method: 'PUT',
      data: fileList.value
    })
      .then((_result: any) => {
        if (_result.data) {
          // 신규로 등록됨에 따라 임시로 만든 taskKey를 반환처리
          getUploadedFiles()
          loading.loadingHide()
        }
      })
      .catch(() => {
        loading.loadingHide()
      })
  }
)
watch(
  () => props.attachInfo.task,
  () => {
    getUploadedFiles()
  },
  { deep: true }
)
watch(
  fileSearchQueue.value,
  () => {
    if (fileSearchQueue.value && fileSearchQueue.value.length > 0) {
      const queue = fileSearchQueue.value[0]
      if (!queue.ing) {
        queue.ing = true
        queue.fnc(queue.taskClassCd, queue.taskKey, queue.taskKeyClassCds).finally(() => {
          fileSearchQueue.value.shift()
        })
      }
    }
  },
  { deep: true }
)

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
  uploderSettingUrl.value = selectConfig.sys.attach.get.url
  uploadedFilesUrl.value = selectConfig.com.upload.fileList.url
  tempTaskKeyUpdateUrl.value = transactionConfig.com.upload.save.url
  allDeleteUrl.value = transactionConfig.com.upload.allDelete.url
  deleteUrl.value = transactionConfig.com.upload.delete.url
  previewUrl.value = selectConfig.com.upload.preview.url
  fileDownUrl.value = selectConfig.com.upload.fileDown.url
  // code setting
  setUploderSetting()
  if (props.isMultiTask) {
    // multi 업무의 경우 첨부파일 업로드 정보를 따로 넣지 않음으로 인하여 높이 설정을 따로 하지 않음으로 init에서 설정하도록 처리
    setTimeout(() => {
      customUpload.value.$el.style.setProperty('--height-var', props.height)
    }, 150)
  }
  getUploadedFiles()
  setCompressOptions()
  // list setting
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
  customUpload.value.removeUploadedFiles()
  customUpload.value.reset()
  reset()
  getUploadedFiles()
}
/******************************
 * TODO (목적): 파일 추가, 추가하는 동시에 파일 압축진행
 * @param (1): 추가한 파일들
 *******************************/
function added(files: readonly any[]) {
  if (queuedFileInfo.value.isUpload) return
  compressCheck(files, uploaderSetting.value)
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
    _.forEach(info.files, (file) => {
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
  _.forEach(info, (reject) => {
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
          uploaderSetting.value.limitCnt +
          ')'
        break
      case 'accept': // 확장자 맞지않음
        message =
          $language('첨부하신 파일의 확장자가 올바르지 않습니다.') +
          '(' +
          uploaderSetting.value.acceptExt +
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
  if (!props.attachInfo.taskClassCd) return
  $http({
    url: $format(uploderSettingUrl.value, props.attachInfo.taskClassCd),
    method: 'GET'
  }).then((_result: any) => {
    if (_result.data) {
      isUploaderSetting.value = true
      _.extend(uploaderSetting.value, _result.data)

      // 높이 설정
      setTimeout(() => {
        customUpload.value.$el.style.setProperty('--height-var', props.height)
      }, 150)
    }
  })
}
/******************************
 * TODO (목적): 업무 & 문서에 따른 첨부파일 조회
 *******************************/
function getUploadedFiles() {
  if (!props.isMultiTask) {
    if (!props.attachInfo.taskClassCd || !props.attachInfo.taskKey) {
      fileList.value = []
      return
    }
  } else {
    if (!isTasks.value) {
      fileList.value = []
      return
    }
  }
  // else if (toLength(props.attachInfo.taskKey) > 10) {
  //   // 가상의 key가 따진 경우
  //   fileList.value = []
  //   return
  // }
  fileSearchQueue.value.push({
    taskClassCd: _.clone(props.attachInfo.taskClassCd),
    taskKey: _.clone(props.attachInfo.taskKey),
    taskKeyClassCds: _.map(props.attachInfo.task, (item) => {
      return `${item.taskKey}^${item.taskClassCd}`
    }),
    fnc: searchFile.bind(''),
    ing: false
  })
}
function searchFile(taskClassCd: string, taskKey: string, taskKeyClassCds: Array<any>) {
  return new Promise((_resolve, _reject) => {
    $http({
      url: uploadedFilesUrl.value,
      method: 'GET',
      params: !props.isMultiTask
        ? {
            taskClassCd: taskClassCd,
            taskKey: taskKey
          }
        : {
            taskKeyClassCds: taskKeyClassCds
          }
    })
      .then((_result: any) => {
        fileList.value = []
        if (_result.data) {
          // 신규로 등록됨에 따라 임시로 만든 taskKey를 반환처리
          fileList.value = _result.data
          if (fileList.value && fileList.value.length > 0) {
            _.forEach(fileList.value, (item: any) => {
              const encstr = item.bigPreviewImage
              const url = window.URL || window.webkitURL
              const blob = base64ToBlob(encstr, 'image/jpeg')
              const imgUrl = url.createObjectURL(blob)
              item.imgUrl = imgUrl
            })
          }
        }
        emits('files', fileList.value)
        _resolve(true)
      })
      .catch(() => {
        _resolve(true)
      })
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
          const curFile: any = _.find(preview.value.fileList, {
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
    _.forEach(fileList.value, (file: any) => {
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
  const curFile = _.find(preview.value.fileList, { sysAttachFileId: val })
  if (curFile) {
    setPreview(curFile, 'multi')
  }

  const preFile = _.find(preview.value.fileList, { sysAttachFileId: oldVal })
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
      getUploadedFiles()
    }
  })
}
/******************************
 * TODO (목적): 이전 사진 이동
 *******************************/
function beforePreView() {
  if (previewImageIndex.value === 0) {
    previewImageIndex.value = fileList.value.length - 1
  } else {
    previewImageIndex.value = previewImageIndex.value - 1
  }
}
/******************************
 * TODO (목적): 다음 사진 이동
 *******************************/
function afterPreView() {
  if (previewImageIndex.value === fileList.value.length - 1) {
    previewImageIndex.value = 0
  } else {
    previewImageIndex.value = previewImageIndex.value + 1
  }
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
    _.extend(queuedFileInfo.value.files, files)
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
    _.forEach(queuedFileInfo.value.files, (_file) => {
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
 * TODO (목적): 압축파일 리스트 목록 초기화
 *******************************/
function reset() {
  queuedFileInfo.value.files = []
  queuedFileInfo.value.compressFiles = []
  queuedFileInfo.value.len = 0
  queuedFileInfo.value.isStart = false
  queuedFileInfo.value.isUpload = false
}
/******************************
 * TODO (목적): 압축파일 진행
 *******************************/
function queuedLenMi() {
  queuedFileInfo.value.len = queuedFileInfo.value.len - 1

  if (queuedFileInfo.value.isStart && queuedFileInfo.value.len === 0) {
    customUpload.value.removeQueuedFiles()
    queuedFileInfo.value.isUpload = true
    setTimeout(() => {
      customUpload.value.addFiles(queuedFileInfo.value.compressFiles)

      customUpload.value.upload()
    }, 500)
  }
}
/******************************
 * TODO (목적): props로 attachInfo를 받는경우(components로 import된 곳과 attachInfo가 선언된 곳이 다른 경우) 파일 업로드 후 반환
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function submitFile() {
  return new Promise((_resolve, _reject) => {
    loading.loadingShow()
    if (fileList.value && fileList.value.length > 0) {
      _.forEach(fileList.value, (file: any) => {
        file.taskKey = props.attachInfo.taskKey
      })
    }
    // 첨부 저장하는 단계
    $http({
      url: tempTaskKeyUpdateUrl.value,
      method: 'PUT',
      data: fileList.value
    })
      .then((_result: any) => {
        if (_result.data) {
          // 신규로 등록됨에 따라 임시로 만든 taskKey를 반환처리
          getUploadedFiles()
          loading.loadingHide()
          _resolve(true)
        }
      })
      .catch(() => {
        loading.loadingHide()
        _reject(true)
      })
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
defineExpose({ submitFile })
</script>
