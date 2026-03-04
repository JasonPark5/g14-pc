<!--
목적 : 확장검색 기능을 지원하는 컴포넌트
Detail :
 *
examples:
 *
-->
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
        <!-- :filter="filter" -->
        <template v-slot:header="scope">
          <div class="row no-wrap items-center q-pa-none">
            <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
            <div class="col" style="padding-top: 0px !important; margin-top: 0px !important">
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
            <!-- custom -->
            <slot v-if="isCustomDown" name="customBtn" />
            <q-btn
              v-if="editable && isTemplateDown && !isCustomDown"
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
    </div>
    <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
      <!-- 업로드 현황 -->
      <c-card
        title="업로드 현황"
        class="cardClassDetailForm excel-upload-status-card"
        height="164px"
      >
        <template v-slot:card-detail>
          <span
            class="text-grey-9 q-pa-sm"
            style="font-size: 0.95em"
            v-html="convertEnter(uploadMessage)"
          />
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
          <c-table
            :ref="
              (el: any) => {
                excelUploadTable[Number(tab.name)] = el
              }
            "
            title="Excel Sheet별 결과 목록"
            tableId="excel-upload"
            :editable="editable"
            :columns="columns[Number(tab.name)]"
            :data="
              excelUploadInfo.data[Number(tab.name)]
                ? excelUploadInfo.data[Number(tab.name)].filter(
                    (data: any) => !errorDataCheck || data.error_message
                  )
                : []
            "
            :gridHeight="gridHeight"
            :isExpand="true"
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
                  :label="!errorDataCheck ? '에러 데이터만 확인' : '전체보기'"
                  icon="find_in_page"
                  @btnClicked="errorDataCheck = !errorDataCheck"
                />
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
            <template v-slot:expand-header>
              {{ $language('에러 상세') }}
            </template>
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
        </template>
      </c-tab>
    </div>
    <q-dialog v-model="sameUserDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            {{ $language('동명이인 선택') }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-for="(sheet, idx) in userSameSheet" :key="idx">
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title
                >{{ $language('시트명') }} : {{ $language(sheet.sheetName) }}</q-toolbar-title
              >
            </q-toolbar>
            <q-list bordered>
              <div v-for="(item, _idx) in sheet.list" :key="_idx">
                <q-item-label header>{{ item.label }}</q-item-label>
                <q-item v-for="(user, __idx) in item.userList" :key="__idx" tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-radio v-model="item.selectData" :val="user.userId" color="orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ user.userName }}</q-item-label>
                    <q-item-label caption>{{ user.userId }} / {{ user.deptName }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$language('선택')" @click.prevent="selectSameUser" />
          <q-btn flat :label="$language('취소')" @click.prevent="closeSameUserPopup" />
        </q-card-actions>
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
import { uid } from 'quasar'
import { read, utils } from 'xlsx'
import { forEach, uniq, map, filter, findIndex, find, reject } from 'lodash-es'
import moment from 'moment'

import selectConfig from '@utils/selectConfig'
import { getComboItems, bytesToSize, getHeaders, base64ToBlob, convertEnter } from '@utils/common'
import { $http } from '@utils/http'

import { GetTranLanguageFunction } from '@/types/language'

import { useUserStore } from '@stores/user'
import { useSystemInfoStore } from '@stores/systemInfo'

import { encrypt, fileDownDecrypt } from '@utils/aes256'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CExcelUpload'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/** userStore 호출 */
const systemInfo = useSystemInfoStore()
const { users, depts } = storeToRefs(systemInfo)
/** message 호출 */
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['emitFunction'])

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
  isCustomDown?: boolean
  label?: string
  maxheight?: string
  tabHeight?: string
  gridHeight?: string
  popupParam?: {
    heaCheckupPlanId: stringNull
    jsonData?: Array<any>
    checkupList?: Array<any>
    templateHeader?: Array<any>
  }
  excelUploadInfo?: {
    rowKeys: Array<string>
    taskClassCd: string // 엑셀업로드 양식 구분 값
    sheetNum: number
    columns: Array<any>
    data: Array<any>
  }
  templateData?: string
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
  isCustomDown: false,
  label: '엑셀 업로드',
  maxheight: 'max-height:200px;min-height:200px;width: 100%;',
  tabHeight: '440px',
  gridHeight: '380px',
  popupParam: () => {
    return {
      heaCheckupPlanId: '',
      jsonData: [],
      checkupList: [],
      templateHeader: []
    }
  },
  excelUploadInfo: () => {
    return {
      rowKeys: [], // 데이터들의 키 속성값
      taskClassCd: '', // 엑셀업로드 양식 구분 값
      sheetNum: 0,
      columns: [],
      data: []
    }
  },
  templateData: ''
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
const plantItems = ref<Array<any>>([])
const plantCd = ref('')
const chemMaterials = ref<Array<any>>([])
const vendors = ref<Array<any>>([])
const facilitys = ref<Array<any>>([])
const processList = ref<Array<any>>([])
const userSame = ref<Array<any>>([])
const sameUserDialog = ref(false)
const isError = ref(false)
const uploadMessage = ref('')
const templateHeader = ref<Array<any>>([])
const sheetNames = ref<Array<any>>([])
const tab = ref(0)
const fileInfoUrl = ref('')
const templateExcelFileUrl = ref('')
const processUrl = ref('')
const chemMaterialUrl = ref('')
const vendorUrl = ref('')
const facilityUrl = ref('')
const checkupItemUrl = ref('')
const excelUpload = ref<any>(null)
const excelUploadTable = ref<Array<any>>([])

/******************************
 * @Computed_선언
 *******************************/
const columns = computed(() => {
  const _columns: Array<any> = []
  if (props.excelUploadInfo.columns && props.excelUploadInfo.columns.length > 0) {
    /**
     * 사업장, 부서, 사용자, 날짜, select box를 제외한 나머지의 경우 type을 text로 변경
     * 단, disabled true인 경우 type none
     */
    forEach(props.excelUploadInfo.columns, (column: any) => {
      const __columns: Array<any> = []
      forEach(column, (item: any) => {
        if (item.disabled) {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: item.align,
            style: item.style,
            sortable: false
          })
        } else if (item.type === 'plant') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
            style: item.style,
            sortable: false,
            type: 'plant',
            required: item.required
          })
        } else if (item.type === 'dept') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
            style: item.style,
            sortable: false,
            type: 'dept',
            deptCd: item.deptCd,
            required: item.required
          })
        } else if (item.type === 'user') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
            style: item.style,
            sortable: false,
            type: 'user',
            userId: item.userId,
            required: item.required
          })
        } else if (item.type === 'date') {
          let format = 'YYYY-MM-DD'
          let excelFormat = 'YYYY/MM/DD'
          if (item.type) {
            if (item.type === 'year') {
              format = 'YYYY'
              excelFormat = 'YYYY'
            } else if (item.type === 'month') {
              format = 'YYYY-MM'
              excelFormat = 'YYYY/MM'
            }
          }
          item.format = format
          item.excelFormat = excelFormat
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
            style: item.style,
            sortable: false,
            // type: item.type,
            range: item.range === true ? true : false,
            required: item.required
          })
        } else if (item.type === 'select') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
            style: item.style,
            sortable: false,
            type: 'select',
            comboItems: item.comboItems,
            required: item.required
          })
        } else if (item.type === 'number') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: item.align,
            style: item.style,
            sortable: false,
            type: 'number',
            required: item.required
          })
        } else if (item.type === 'textarea') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: item.align,
            style: item.style,
            sortable: false,
            type: 'textarea',
            required: item.required
          })
        } else if (item.type === 'readonly') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: item.align,
            style: item.style,
            sortable: false,
            required: item.required
          })
        } else if (item.type === 'chemMaterial') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
            style: item.style,
            sortable: false,
            required: item.required
          })
        } else if (item.type === 'vendor') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
            style: item.style,
            sortable: false,
            required: item.required
          })
        } else if (item.type === 'facility') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
            style: item.style,
            sortable: false,
            required: item.required
          })
        } else if (item.type === 'deptMulti') {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: 'center',
            style: item.style,
            sortable: false,
            required: item.required
          })
        } else {
          __columns.push({
            name: item.name,
            field: item.name,
            label: item.label,
            align: item.align,
            style: item.style,
            sortable: false,
            // type: 'text',
            required: item.required
          })
        }
      })
      _columns.push(__columns)
    })
  }
  return _columns
})
const tabItems = computed(() => {
  const _items: Array<any> = []
  if (sheetNames.value && sheetNames.value.length > 0) {
    let idx = 0
    forEach(sheetNames.value, (sheet) => {
      _items.push({
        name: idx,
        label: sheet
      })
      idx++
    })
  }
  return _items
})
const userSameSheet = computed(() => {
  const _userSameSheet = []
  const sheetArray = uniq(map(userSame.value, 'sheetNum'))
  if (sheetArray && sheetArray.length > 0) {
    for (let i = 0; i < sheetArray.length; i++) {
      const sheetData: Array<any> = filter(userSame.value, { sheetNum: sheetArray[i] })
      forEach(sheetData, (userData: any) => {
        userData.selectData = null
      })
      _userSameSheet.push({
        sheetNum: sheetData[0].sheetNum,
        sheetName: sheetData[0].sheetName,
        list: sheetData
      })
    }
  }
  return _userSameSheet
})
const userList = computed(() => users.value)

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.excelUploadInfo.taskClassCd,
  () => {
    getFileInfo()
    getExcelTemplateHeader()
  }
)
watch(
  () => props.templateData,
  () => {
    getExcelTemplateHeader()
  }
)
watch(uploadMessage, () => {
  /**
   * 오류 메시지가 있는 경우 Excel 결과 목록에 표시 X
   * 업로더에 올라간 파일로 reset
   */
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
  // url setting
  templateExcelFileUrl.value = selectConfig.sys.excelUpload.template.url
  fileInfoUrl.value = selectConfig.com.upload.fileInfo.url
  processUrl.value = selectConfig.mdm.process.list.url
  chemMaterialUrl.value = selectConfig.mdm.mam.chem.list.url
  vendorUrl.value = selectConfig.mdm.cim.vendor.list.url
  facilityUrl.value = selectConfig.env.facility.list.url
  checkupItemUrl.value = selectConfig.hea.examine.list.url
  // list
  getComboItems('PLANT_CD').then((_result: any) => {
    plantItems.value = _result
  })
  getFileInfo()
  if (props.popupParam.heaCheckupPlanId) getCheckUpItemList()
  getExcelTemplateHeader()
  getProcessList()
  getChemMaterials()
  getVendors()
  getFacilitys()
}
/******************************
 * TODO (목적): 단위공정 조회
 *******************************/
function getProcessList() {
  $http({
    url: processUrl.value,
    method: 'GET',
    params: {
      processLevelCd: '20'
    }
  }).then((_result: any) => {
    processList.value = _result.data
  })
}
/******************************
 * TODO (목적): 화학자재 조회
 *******************************/
function getChemMaterials() {
  $http({
    url: chemMaterialUrl.value,
    method: 'GET',
    params: {
      plantCd: plantCd.value ? plantCd.value : user.value.plantCd
    }
  }).then((_result: any) => {
    chemMaterials.value = _result.data
  })
}
/******************************
 * TODO (목적): 업체 조회
 *******************************/
function getVendors() {
  $http({
    url: vendorUrl.value,
    method: 'GET',
    params: {
      plantCd: plantCd.value ? plantCd.value : user.value.plantCd
    }
  }).then((_result: any) => {
    vendors.value = _result.data
  })
}
/******************************
 * TODO (목적): 설비 조회
 *******************************/
function getFacilitys() {
  $http({
    url: facilityUrl.value,
    method: 'GET',
    params: {
      plantCd: plantCd.value ? plantCd.value : user.value.plantCd
    }
  }).then((_result: any) => {
    facilitys.value = _result.data
  })
}
/******************************
 * TODO (목적): 검진항목 (마스터) 조회
 *******************************/
function getCheckUpItemList() {
  $http({
    url: checkupItemUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    props.popupParam.checkupList = _result.data
  })
}
/******************************
 * TODO (목적): 엑셀파일 양식 정보 조회
 *******************************/
function getFileInfo() {
  if (!props.excelUploadInfo.taskClassCd || props.isCustomDown) return
  // custom 속성 etg 2023-01-12
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
 * TODO (목적): 파일 사이즈
 * @param (1): 파일 사이즈
 * @return (반환): 파일 사이즈
 *******************************/
function getFileSizeTextByRound(_fileByteSize: number) {
  return bytesToSize(_fileByteSize)
}
/******************************
 * TODO (목적): 업로드할 엑셀 파일 추가 시 데이터 검증 진행
 * @param (1): 업로드할 엑셀 파일
 *******************************/
function added(files: readonly any[]) {
  /**
   * 파일을 다시 올리는 경우 업로드 현황 & Excel 결과 목록 초기화
   */
  isError.value = false
  uploadMessage.value = ''
  props.excelUploadInfo.data = []
  /**
   * 엑셀의 헤더가 업로드 된 엑셀과 맞지 않을 경우를 체크
   */
  const reader = new FileReader()
  reader.readAsDataURL(files[0])
  reader.onload = function () {
    const result: string = String(reader.result)

    const base64Data = result!.replace('data:' + files[0].type + ';base64,', '')
    const cfb = read(base64Data, {
      type: 'base64',
      cellDates: true
    })

    /**
     * 1. 헤더가 맞지 않은 경우 체크
     * 2. 데이터가 없는 경우 체크
     * 3. 넘겨받은 컬럼에 맞춰 유효성 체크
     *  - 필수 값 : required true일 경우 데이터가 비었다는 체크
     *  - 사업장 : 사업장명을 통해 id를 산출
     *  - 부서 : 부서명을 통해 id를 산출
     *  - 사용자 : 사용자명을 통해 id를 산출
     *             사용자 리스트는 행의 사업장 또는 로그인자의 사업장
     *             동명이인이 있을 경우 팝업창 표시 후 사용자 선택 하도록 설정
     *  - 날짜 : default : yyyy-MM-dd (yyyy, yyyy-MM, yyyy-MM-dd)
     *  - select box : list를 받은 후 text에 맞는 걸로 value를 key-in
     *  - text box : 위의 경우를 제외하고는 text box로 사용자가 추가적으로 수정할 수 있게 처리
     *  - 수정을 원치 않는 데이터의 경우 disabled 속성을 받아 처리
     *  - 위의 경우를 제외한 나머지 유효성 체크의 경우 각 화면에서 독자적으로 진행
     *
     *  ## 유효성 체크에서 탈락한 경우 그 행의 row 색상을 빨간색으로 표시
     */
    const sheetNum = props.excelUploadInfo.sheetNum || 0
    sheetNames.value = []
    for (let i = 0; i <= sheetNum; i++) {
      const uploadExcel = {
        header: getHeaders(cfb.Sheets[cfb.SheetNames[i]]),
        data: utils.sheet_to_json(cfb.Sheets[cfb.SheetNames[i]], {
          raw: false
          // cellDates: true
        })
      }
      sheetNames.value.push(cfb.SheetNames[i])
      templateHeader.value.push(getHeaders(cfb.Sheets[cfb.SheetNames[i]]))
      props.popupParam.templateHeader = templateHeader.value[1]
      props.popupParam.jsonData = uploadExcel.data

      // 1. 헤더가 맞지 않은 경우 체크
      const headerCheck = templateHeader.value[i].every((item: any, idx: number) => {
        return uploadExcel.header[idx] === item
      })
      if (!headerCheck) {
        isError.value = true
        uploadMessage.value += $language(
          '업로드한 엑셀의 헤더가 올바르지 않습니다. 양식 다운로드하여 확인바랍니다.'
        )
        break
      }

      // 2. 데이터가 없는 경우 체크
      if (!uploadExcel.data || uploadExcel.data.length === 0) {
        isError.value = true
        uploadMessage.value += $language(
          '업로드한 엑셀에 데이터가 없습니다. 확인 후 업로드 해주십시오.'
        )
        break
      }

      // 3. 넘겨받은 컬럼에 맞춰 유효성 체크
      props.excelUploadInfo.data[i] = []
      const rowData: Array<any> = []
      forEach(uploadExcel.data, (data: any) => {
        const cellData: Record<string, string | number | boolean | null | undefined> = {
          error_message: ''
        }
        cellData[props.excelUploadInfo.rowKeys[i]] = uid()
        forEach(props.excelUploadInfo.columns[i], (item: any) => {
          item.label = $language(item.label) // 다국어 처리로 인한 문제 해결
          // *  - 필수 값 : required true일 경우 데이터가 비었다는 체크
          if (item.required && !data[item.label]) {
            cellData['error_message'] +=
              $language('■ 필수값이 입력되지 않았습니다.') + '[' + item.label + ']\n'
            cellData[item.name] = null
          }
          if (item.type === 'plant') {
            // *  - 사업장 : 사업장명을 통해 id를 산출
            const p_idx = findIndex(plantItems.value, {
              codeName: data[item.label]
            })
            if (p_idx === -1) {
              cellData['error_message'] +=
                $language('■ 관리되지 않는 사업장입니다.') + '[' + data[item.label] + ']\n'
              cellData[item.name] = null
            } else {
              cellData[item.name] = plantItems.value[p_idx].code
            }
          } else if (item.type === 'dept') {
            // *  - 부서 : 부서명을 통해 id를 산출, row에 사업장이 있을 경우 row에 있는 사업장을 확인 없는 경우 로그인자의 사업장으로 확인
            let plantCd = user.value.plantCd
            let plantName = user.value.plantName
            const checkPlantIdx = findIndex(props.excelUploadInfo.columns[i], {
              type: 'plant'
            })
            if (checkPlantIdx > -1) {
              const plant = find(plantItems.value, {
                codeName: data[props.excelUploadInfo.columns[i][checkPlantIdx].label]
              })
              // 사업장이 조회되지 않는 경우는 로그인자의 사업장으로 처리
              if (plant) {
                plantName = plant.codeName
                plantCd = plant.code
              }
            }
            const d_idx = findIndex(depts.value, {
              plantCd: plantCd,
              deptName: data[item.label]
            })
            if (d_idx === -1) {
              cellData['error_message'] +=
                $language('■ 사업장에서 관리되지 않는 부서입니다.') +
                '[' +
                data[item.label] +
                ', 사업장: ' +
                plantName +
                ']\n'
              cellData[item.name] = null
            } else {
              cellData[item.name] = depts.value[d_idx].deptName
              cellData[item.deptCd] = depts.value[d_idx].deptCd
            }
          } else if (item.type === 'deptMulti') {
            // *  - 부서 : 부서명을 통해 id를 산출, row에 사업장이 있을 경우 row에 있는 사업장을 확인 없는 경우 로그인자의 사업장으로 확인
            const deptCds: any = []
            const deptNames: any = []
            let plantCd = user.value.plantCd
            let plantName = user.value.plantName
            const checkPlantIdx = findIndex(props.excelUploadInfo.columns[i], {
              type: 'plant'
            })
            if (checkPlantIdx > -1) {
              const plant = find(plantItems.value, {
                codeName: data[props.excelUploadInfo.columns[i][checkPlantIdx].label]
              })
              // 사업장이 조회되지 않는 경우는 로그인자의 사업장으로 처리
              if (plant) {
                plantName = plant.codeName
                plantCd = plant.code
              }
            }

            let splitDeptName = []
            if (data[item.label]) {
              splitDeptName = data[item.label].split(',')
            }

            _.forEach(splitDeptName, (_item) => {
              const d_idx = findIndex(depts.value, {
                plantCd: plantCd,
                deptName: _item
              })
              if (d_idx === -1) {
                cellData['error_message'] +=
                  $language('■ 사업장에서 관리되지 않는 부서입니다.') +
                  '[' +
                  data[item.label] +
                  ', 사업장: ' +
                  plantName +
                  ']\n'
              } else {
                deptNames.push(depts.value[d_idx].deptName)
                deptCds.push(depts.value[d_idx].deptCd)
              }
            })

            cellData[item.name] = deptNames.toString()

            if (item.isArray) {
              cellData[item.deptCd] = deptCds
            } else {
              cellData[item.deptCd] = deptCds.toString()
            }
          } else if (item.type === 'process') {
            // 공정 추가 etg > 공정 : 사업장 관계 x
            const d_idx = findIndex(processList.value, {
              processName: data[item.label]
            })
            if (d_idx === -1) {
              cellData['error_message'] +=
                $language('■ 관리되지 않는 공정입니다.') + '[' + data[item.label] + ']\n'
              cellData[item.name] = null
            } else {
              cellData[item.name] = processList.value[d_idx].processName
              cellData[item.processCd] = processList.value[d_idx].processCd
            }
          } else if (item.type === 'user') {
            //  *  - 사용자 : 사용자명을 통해 id를 산출
            //  *             사용자 리스트는 행의 사업장 또는 로그인자의 사업장
            //  *             동명이인이 있을 경우 팝업창 표시 후 사용자 선택 하도록 설정
            let plantCd = user.value.plantCd
            let plantName = user.value.plantName
            const checkPlantIdx = findIndex(props.excelUploadInfo.columns[i], {
              type: 'plant'
            })
            if (checkPlantIdx > -1) {
              const plant = find(plantItems.value, {
                codeName: data[props.excelUploadInfo.columns[i][checkPlantIdx].label]
              })
              // 사업장이 조회되지 않는 경우는 로그인자의 사업장으로 처리
              if (plant) {
                plantName = plant.codeName
                plantCd = plant.code
              }
            }
            const u_list: Array<any> = filter(userList.value, {
              plantCd: plantCd,
              userName: data[item.label]
            })
            if (!u_list || u_list.length === 0) {
              cellData['error_message'] +=
                $language('■ 사업장에서 관리되지 않는 사용자입니다.') +
                '[' +
                data[item.label] +
                ', 사업장: ' +
                plantName +
                ']\n'
              cellData[item.name] = null
            } else {
              if (u_list.length === 1) {
                cellData[item.name] = u_list[0].userName
                cellData[item.userId] = u_list[0].userId
              } else {
                /**
                 * 동명이인이 있는 경우에
                 *  userSame에 해당 정하는 데이터 셋팅
                 *  값은 셋팅하지 않으며 유효성 체크가 끝나고 난 후 동명이인에 대해서 선택하는 팝업 open
                 */
                if (findIndex(userSame.value, { name: item.name }) === -1) {
                  userSame.value.push({
                    sheetNum: i,
                    sheetName: cfb.SheetNames[i],
                    userId: item.userId,
                    name: item.name,
                    label: item.label,
                    userList: u_list
                  })
                  cellData[item.name] = ''
                  cellData[item.userId] = ''
                }
              }
            }
          } else if (item.type === 'date') {
            //  *  - 날짜 : default : yyyy-MM-dd, 이후에 추가할 포맷 : (yyyy, yyyy-MM, yyyy-MM-dd, yyyy-MM-dd HH:mi)
            // const date = moment(data[item.label], item.excelFormat).format(item.format)
            const date = formatDate(data[item.label])
            if (moment(date, item.format, true).isValid()) {
              cellData[item.name] = date
            } else {
              cellData['error_message'] +=
                $language('■ 날짜형식에 맞지 않습니다.') +
                ' [값: ' +
                date +
                ', 형식: ' +
                item.format +
                ']\n'
              cellData[item.name] = null
            }
          } else if (item.type === 'select') {
            //  *  - select box : list를 받은 후 text에 맞는 걸로 value를 key-in
            const selectData = find(item.comboItems, (comboItem) => {
              return (
                comboItem[item.valueText ? item.valueText : 'codeName'] ===
                data[item.label]?.toString().trim()
              )
            })
            if (selectData) {
              cellData[item.name] = selectData[item.valueKey ? item.valueKey : 'code']
            } else {
              cellData['error_message'] +=
                $language('■ 관리되는 항목명이 아닙니다.') + ' [' + data[item.label] + ']\n'
              cellData[item.name] = null
            }
          } else if (item.type === 'chemMaterial') {
            const p_idx = findIndex(chemMaterials.value, {
              materialCd: data[item.label]
            })
            if (p_idx === -1) {
              cellData['error_message'] +=
                '■ [' + data[item.label] + '] 값은 관리되지 않는 화학자재입니다.\n'
              cellData[item.name] = null
            } else {
              cellData[item.name] = data[item.label]
            }
          } else if (item.type === 'vendor' && data[item.label]) {
            const vendorData = find(vendors.value, { vendorName: data[item.label] })
            if (vendorData) {
              cellData[item.name] = data[item.label]
              cellData[item.vendorCd] = vendorData.vendorCd
            } else {
              cellData['error_message'] +=
                $language('■ 관리되는 협력업체가 아닙니다.') + ' [' + data[item.label] + ']\n'
              cellData[item.name] = null
              cellData[item.vendorCd] = null
            }
          } else if (item.type === 'facility') {
            const p_idx = findIndex(facilitys.value, {
              facilityNo: data[item.label]
            })
            if (p_idx === -1) {
              cellData['error_message'] +=
                '■ [' + data[item.label] + '] 값은 관리되지 않는 취급시설입니다.\n'
              cellData[item.name] = null
            } else {
              cellData[item.name] = data[item.label]
            }
          } else if (item.type === 'number') {
            if (data[item.label]) {
              cellData[item.name] = data[item.label].replace(',', '')
            }
          } else {
            cellData[item.name] = data[item.label]
          }
        })
        rowData.push(cellData)
      })
      props.excelUploadInfo.data[i] = rowData
      uploadMessage.value +=
        `<b>${$language('✅ Sheet 명')}</b> : ` +
        cfb.SheetNames[i] +
        '\n' +
        ` <b>${$language('총 데이터 수')}</b> : ` +
        props.excelUploadInfo.data[i].length +
        '\n' +
        ` <b>${$language('- 문제')} <font color="#8BC34A">${$language('없는')}</font> ${$language('데이터 수')}</b> : ` +
        filter(props.excelUploadInfo.data[i], (item) => {
          return !item.error_message
        }).length +
        '\n' +
        ` <b>${$language('- 문제')} <font color="#F44336">${$language('있는')}</font> ${$language('데이터 수')}</b> : ` +
        filter(props.excelUploadInfo.data[i], (item) => {
          return item.error_message
        }).length +
        '\n'

      emits(
        'emitFunction',
        props.popupParam.jsonData,
        props.popupParam.templateHeader,
        props.popupParam.checkupList
      )
    }
    if (userSame.value && userSame.value.length > 0) {
      sameUserDialog.value = true
    }
  }
}
/******************************
 * TODO (목적): 엑셀 파일 업로드 거부
 * @param (1): 거부된 사유
 *******************************/
function rejected(info: any) {
  if (!info || info.length === 0) {
    return
  }
  // 다시 파일을 올림으로 인해 메시지를 초기화 처리함
  isError.value = false
  uploadMessage.value = ''
  forEach(info, (rejectInfo) => {
    // accept, max-file-size, max-total-size, filter, etc
    switch (rejectInfo.failedPropValidation) {
      case 'max-file-size': // 파일용량 초과
      case 'max-total-size': // 파일 전체 용량 초과
        isError.value = true
        uploadMessage.value +=
          $language('첨부하신 파일의 용량이 지정된 용량보다 큽니다. 파일 용량 : ') +
          '(' +
          getFileSizeTextByRound(rejectInfo.file.size) +
          ')'
        break
      case 'max-files': // 업로드 갯수 초과
        isError.value = true
        uploadMessage.value = $language(
          '첨부하신 파일의 지정된 업로드 갯수를 초과하여 업로드 되지 않았습니다.'
        )
        break
      case 'accept': // 확장자 맞지않음
        isError.value = true
        uploadMessage.value = $language('첨부하신 파일의 확장자가 올바르지 않습니다.')
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
    params: {
      taskClassCd: encrypt(props.excelUploadInfo.taskClassCd)
    }
  }).then((_result: any) => {
    const fileDecInfo = fileDownDecrypt(_result.data)
    if (fileDecInfo.id === props.excelUploadInfo.taskClassCd) {
      let data = fileDecInfo.bytes
      // custom 속성 etg 2023-01-12
      if (props.isCustomDown) {
        data = props.templateData
      }
      const cfb = read(data, { type: 'base64' })
      sheetNames.value = []
      templateHeader.value = []
      const sheetNum = props.excelUploadInfo.sheetNum || 0
      for (let i = 0; i <= sheetNum; i++) {
        sheetNames.value.push(cfb.SheetNames[i])
        templateHeader.value.push(getHeaders(cfb.Sheets[cfb.SheetNames[i]]))
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
 * TODO (목적): 엑셀 양식 다운로드
 *******************************/
function downTemplate() {
  $http({
    url: templateExcelFileUrl.value,
    method: 'GET',
    params: {
      taskClassCd: encrypt(props.excelUploadInfo.taskClassCd)
    }
  }).then((_result: any) => {
    const fileDecInfo = fileDownDecrypt(_result.data)
    if (fileDecInfo.id === props.excelUploadInfo.taskClassCd) {
      const blob = base64ToBlob(fileDecInfo.bytes, fileInfo.value.fileExt)
      const nav = window.navigator as any
      if (nav && nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(blob, fileInfo.value.oriFileNm)
      } else {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileInfo.value.oriFileNm
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
 * TODO (목적): 파일 삭제
 *******************************/
function deleteFile() {
  // excelUpload.value.removeQueuedFiles();
  isError.value = false
  uploadMessage.value = ''
  props.excelUploadInfo.data = []
  excelUpload.value.reset()
}
/******************************
 * TODO (목적): 엑셀 시트에 따른 테이블 데이터 삭제
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
    forEach(selectData, (item) => {
      props.excelUploadInfo.data[idx] = reject(props.excelUploadInfo.data[idx], (gridItem) => {
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
 * TODO (목적): 동명이인 선택
 *******************************/
function selectSameUser() {
  forEach(userSameSheet.value, (sheet: any) => {
    forEach(sheet.list, (user) => {
      forEach(props.excelUploadInfo.data[sheet.sheetNum], (item) => {
        item[user.name] = find(user.userList, { userId: user.selectData }).userName
        item[user.userId] = user.selectData
      })
    })
  })

  sameUserDialog.value = false
}
/******************************
 * TODO (목적): 동명이인 선택 팝업 닫기
 *******************************/
function closeSameUserPopup() {
  sameUserDialog.value = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
