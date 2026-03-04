<template>
  <div>
    <q-list bordered dense separator class="custom-file-column">
      <q-item v-for="(file, idx) in fileList" :key="idx" clickable v-ripple @click="fileDown(file)">
        <q-item-section side>
          <q-avatar rounded size="sm">
            <img :src="setIcon(file).href" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-primary">
            {{ file.oriFileNm }}
            <q-tooltip content-class="bg-red" :offset="[10, 10]">
              {{ file.oriFileNm }}
            </q-tooltip>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
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
import { ref, computed, watch, onBeforeMount } from 'vue'
import { forEach } from 'lodash-es'

import selectConfig from '@utils/selectConfig'
import { $http } from '@utils/http'
import { base64ToBlob, getAccept } from '@utils/common'
import { encrypt, fileDownDecrypt } from '@utils/aes256'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CFileColumn'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  name?: string
  editable?: boolean
  fileIds: stringNull
  preview: {
    isShow: boolean
    sysAttachFileId: string
    src: string
    oriFileNm: string
    fileSize: number
    fileExt: string
  }
}
interface fileType {
  oriFileNm: string
  previewImage: string
  imgUrl: string
  fileExt: string
  sysAttachFileId: string
  contentType: string
  fileSize: number
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  name: '',
  editable: true,
  fileIds: null,
  preview: () => {
    return {
      isShow: false,
      sysAttachFileId: '',
      src: '',
      oriFileNm: '',
      fileSize: 0,
      fileExt: ''
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
const fileList = ref<Array<fileType>>([])
const uploadedFilesUrl = ref('')
const fileDownUrl = ref('')
const previewUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const fileIdSplit = computed(() => {
  let files = []
  if (props.fileIds) {
    files = props.fileIds.split(',')
  }
  return files
})

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => fileIdSplit,
  () => {
    getUploadedFiles()
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
  // url setting
  uploadedFilesUrl.value = selectConfig.com.upload.fileList.url
  fileDownUrl.value = selectConfig.com.upload.fileDown.url
  previewUrl.value = selectConfig.com.upload.preview.url
  getUploadedFiles()
}
/******************************
 * TODO (목적): 첨부된 파일 조회 및 파일(이미지) preview 셋팅
 *******************************/
function getUploadedFiles() {
  if (!fileIdSplit.value || fileIdSplit.value.length === 0) {
    fileList.value = []
    return
  }
  $http({
    url: uploadedFilesUrl.value,
    method: 'GET',
    params: {
      fileIds: fileIdSplit.value
    }
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      // 신규로 등록됨에 따라 임시로 만든 taskKey를 반환처리
      fileList.value = _result.data
      forEach(fileList.value, (item: any) => {
        const encstr = item.previewImage
        const url = window.URL || window.webkitURL
        const blob = base64ToBlob(encstr, 'image/jpeg')
        const imgUrl = url.createObjectURL(blob)
        item.imgUrl = imgUrl
      })
    } else {
      fileList.value = []
    }
  })
}
/******************************
 * TODO (목적): 파일 아이콘 셋팅
 * @param (1): 파일
 * @return (반환): 파일 아이콘
 *******************************/
function setIcon(file: any) {
  let icon = new URL('@/assets/images/txt_small.png', import.meta.url)
  switch (file.fileExt) {
    case 'xlsx':
    case 'xlx':
      // 엑셀
      icon = new URL('@/assets/images/excel_small.png', import.meta.url)
      break
    case 'ppt':
    case 'pptx':
      // 파워포인트
      icon = new URL('@/assets/images/ppt_small.png', import.meta.url)
      break
    case 'word':
      // 워드
      icon = new URL('@/assets/images/work_small.png', import.meta.url)
      break
    case 'pdf':
      // pdf
      icon = new URL('@/assets/images/pdf_small.png', import.meta.url)
      break
    case 'png':
    case 'gif':
    case 'jpg':
    case 'jpeg':
      // image
      icon = new URL('@/assets/images/image_small.png', import.meta.url)
      break
    default:
      // txt
      icon = new URL('@/assets/images/txt_small.png', import.meta.url)
  }
  return icon
}
/******************************
 * TODO (목적): 파일 다운로드
 * @param (1): 파일
 *******************************/
function fileDown(file: fileType) {
  if (
    file.fileExt.toLowerCase() == 'png' ||
    file.fileExt.toLowerCase() == 'gif' ||
    file.fileExt.toLowerCase() == 'jpg' ||
    file.fileExt.toLowerCase() == 'jpeg'
  ) {
    // 이미지의 경우 미리보기 창 오픈
    setPreview(file)
  } else {
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
}
/******************************
 * TODO (목적): 미리보기 셋팅
 * @param (1): 파일
 *******************************/
function setPreview(file: fileType) {
  if (!file) return
  // 이미지인  경우
  if (file.sysAttachFileId) {
    $http({
      url: previewUrl.value,
      method: 'GET',
      params: {
        sysAttachFileId: encrypt(file.sysAttachFileId)
      }
    }).then((_result: any) => {
      const fileInfo = fileDownDecrypt(_result.data)
      if (fileInfo.id === file.sysAttachFileId) {
        props.preview.isShow = true
        props.preview.sysAttachFileId = file.sysAttachFileId
        props.preview.src = 'data:' + file.contentType + ';base64,' + fileInfo.bytes
        props.preview.oriFileNm = file.oriFileNm
        props.preview.fileSize = file.fileSize
        props.preview.fileExt = file.fileExt
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style scoped>
.custom-file-column .q-item__label {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 300px;
}
</style>
