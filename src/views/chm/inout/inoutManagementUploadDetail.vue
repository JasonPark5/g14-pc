<template>
  <div>
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            :disabled="popupParam.isOld"
            :editable="editable"
            type="edit"
            name="plantCd"
            v-model:value="popupParam.plantCd"
            @datachange="datachange"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :disabled="popupParam.isOld"
            :editable="editable"
            type="year"
            label="년도"
            name="year"
            v-model:value="popupParam.year"
            @datachange="datachange"
          />
        </div>
      </template>
    </c-card>
    <c-table
      ref="inout-table"
      class="q-mt-sm"
      :title="(popupParam.year || '') + ' ' + $language('제조/수입/사용/판매 관리대장 (단위 : t)')"
      :editable="editable"
      :columns="gridColumns"
      :data="grid.data"
      :gridHeight="gridHeight"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            label="관리대장(제조/수입/사용/판매) 엑셀업로드"
            icon="note_add"
            @btnClicked="openExcelUploader"
          />
        </q-btn-group>
      </template>
    </c-table>
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
import { toBizNum } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: ''
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
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
interface propType {
  popupParam: {
    plantCd: stringNull
    year: stringNull
    isOld: boolean
  }
  contentHeight: string
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
      plantCd: '',
      year: '',
      isOld: false
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  data: []
})
const listUrl = ref('')
const validUrl = ref('')
const saveUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 120
      : 500
  if (height < 500) {
    height = 500
  }
  return `${String(height)}px`
})
const gridColumns = computed(() => [
  {
    name: 'inoutDate',
    field: 'inoutDate',
    label: '입출고일',
    align: 'center',
    style: 'width:140px',
    fix: true,
    sortable: true
  },
  {
    name: 'materialCd',
    field: 'materialCd',
    label: '화학자재번호',
    align: 'center',
    style: 'width:120px',
    fix: true,
    sortable: true
  },
  {
    name: 'materialName',
    field: 'materialName',
    label: '화학자재명',
    align: 'left',
    style: 'width:250px',
    fix: true,
    sortable: true
  },
  {
    name: 'facilityName',
    field: 'facilityName',
    label: '저장시설',
    align: 'left',
    style: 'width:220px',
    fix: true,
    sortable: true
  },
  {
    name: 'in',
    field: 'in',
    label: '입고량',
    align: 'center',
    child: [
      {
        name: 'carryover',
        field: 'carryover',
        label: '이월량',
        align: 'right',
        style: 'width:70px',
        type: 'cost',
        sortable: false
      },
      {
        name: 'purchase',
        field: 'purchase',
        label: '제조ㆍ수입ㆍ구입량',
        child: [
          {
            name: 'chmInTypeName',
            field: 'chmInTypeName',
            label: '구분',
            align: 'center',
            style: 'width:80px',
            sortable: false
          },
          {
            name: 'inAmount',
            field: 'inAmount',
            label: '수량',
            align: 'right',
            style: 'width:70px',
            sortable: false,
            type: 'cost'
          }
        ]
      },
      {
        name: 'purchaseDetails',
        field: 'purchaseDetails',
        label: '구입명세',
        child: [
          {
            name: 'inVendorName',
            field: 'inVendorName',
            label: '상호',
            align: 'center',
            style: 'width:220px'
          },
          {
            name: 'inCorpRegistrationNumber',
            field: 'inCorpRegistrationNumber',
            label: '사업자등록번호',
            align: 'center',
            style: 'width:110px',
            sortable: false
          },
          {
            name: 'inAddress',
            field: 'inAddress',
            label: '주소',
            align: 'center',
            style: 'width:200px',
            sortable: false
          },
          {
            name: 'inUserName',
            field: 'inUserName',
            label: '담당자',
            align: 'center',
            style: 'width:80px',
            sortable: false
          },
          {
            name: 'inPhoneNumber',
            field: 'inPhoneNumber',
            label: '전화번호',
            align: 'center',
            style: 'width:150px',
            sortable: false
          }
        ]
      }
    ]
  },
  {
    name: 'out',
    field: 'out',
    label: '출고량',
    align: 'center',
    child: [
      {
        name: 'sale',
        field: 'sale',
        label: '사용ㆍ판매량',
        child: [
          {
            name: 'chmOutTypeName',
            field: 'chmOutTypeName',
            label: '구분',
            align: 'center',
            style: 'width:80px'
          },
          {
            name: 'outAmount',
            field: 'outAmount',
            label: '수량',
            align: 'right',
            style: 'width:70px',
            sortable: false,
            type: 'cost'
          }
        ]
      },
      {
        name: 'saleDetails',
        field: 'saleDetails',
        label: '판매명세',
        child: [
          {
            name: 'outVendorName',
            field: 'outVendorName',
            label: '상호',
            align: 'center',
            style: 'width:220px',
            sortable: false
          },
          {
            name: 'outCorpRegistrationNumber',
            field: 'outCorpRegistrationNumber',
            label: '사업자등록번호',
            align: 'center',
            style: 'width:110px',
            sortable: false
          },
          {
            name: 'outAddress',
            field: 'outAddress',
            label: '주소',
            align: 'center',
            style: 'width:200px',
            sortable: false
          },
          {
            name: 'outUserName',
            field: 'outUserName',
            label: '담당자',
            align: 'center',
            style: 'width:80px',
            sortable: false
          },
          {
            name: 'outPhoneNumber',
            field: 'outPhoneNumber',
            label: '전화번호',
            align: 'center',
            style: 'width:150px',
            sortable: false
          },
          {
            name: 'outPurpose',
            field: 'outPurpose',
            label: '용도',
            align: 'left',
            style: 'width:180px',
            sortable: false
          },
          {
            name: 'outBuyerBusinessLicense',
            field: 'outBuyerBusinessLicense',
            label: '구매자 영업허가 구분',
            align: 'left',
            style: 'width:180px',
            sortable: false
          }
        ]
      }
    ]
  },
  {
    name: 'inventory',
    field: 'inventory',
    label: '재고량',
    align: 'right',
    style: 'width:70px',
    sortable: false,
    type: 'cost'
  },
  {
    name: 'remarks',
    field: 'remarks',
    label: '비고',
    align: 'left',
    style: 'width:150px',
    sortable: false
  }
])

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
  listUrl.value = selectConfig.chm.inout.get.url
  validUrl.value = selectConfig.chm.inout.valid.url
  saveUrl.value = transactionConfig.chm.inout.saveall.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 관리대장 사업장, 년도별 데이터 조회
 *******************************/
function getList() {
  if (props.popupParam.plantCd && props.popupParam.year) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        plantCd: props.popupParam.plantCd,
        year: props.popupParam.year
      }
    }).then((_result: any) => {
      grid.value.data = _result.data.map((item: any) => ({
        ...item,
        inCorpRegistrationNumber: item.inCorpRegistrationNumber
          ? item.inCorpRegistrationNumber.includes('-')
            ? item.inCorpRegistrationNumber
            : toBizNum(item.inCorpRegistrationNumber)
          : '',
        outCorpRegistrationNumber: item.outCorpRegistrationNumber
          ? item.outCorpRegistrationNumber.includes('-')
            ? item.outCorpRegistrationNumber
            : toBizNum(item.outCorpRegistrationNumber)
          : ''
      }))
    })
  }
}
/******************************
 * TODO (목적): 사업장, 년도 변경에 따른 데이터 존재 체크
 *******************************/
function datachange() {
  if (props.popupParam.plantCd && props.popupParam.year && !props.popupParam.isOld) {
    $http({
      url: validUrl.value,
      method: 'GET',
      params: {
        plantCd: props.popupParam.plantCd,
        year: props.popupParam.year
      }
    }).then((_result: any) => {
      if (_result.data > 0) {
        message.alert({
          title: '안내',
          message: '입력한 사업장과 년도에 이미 데이터가 존재합니다. [년도] 를 다시 입력하세요.',
          type: 'warning' // success / info / warning / error
        })
        props.popupParam.year = null
      } else {
        // nothing..
      }
    })
  }
}
/******************************
 * TODO (목적): 엑셀업로드 팝업 표시
 *******************************/
function openExcelUploader() {
  if (!props.popupParam.plantCd || !props.popupParam.year) {
    message.alert({
      title: '안내' /* 안내 */,
      message: '사업장과 년도를 입력 후 이용바랍니다.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  popupOptions.value.title = '화학물질 관리대장 엑셀 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./inoutManagementExcelUpload.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploaderPopup
}
/******************************
 * TODO (목적): 엑셀업로드 팝업 닫기
 * @param (1): 적용된 데이터
 *******************************/
function closeExcelUploaderPopup(data: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const s_data = _.filter(data, (item) => !item.error_message)
    _.forEach(s_data, (item) => {
      // item.plantCd = props.popupParam.plantCd;
      // item.year = props.popupParam.year;
      item.regUserId = user.value.userId
      item.editFlag = 'C'
    })
    $http({
      url: saveUrl.value,
      method: 'PUT',
      data: {
        plantCd: props.popupParam.plantCd,
        year: props.popupParam.year,
        inouts: s_data
      }
    }).then((_result: any) => {
      message.requestSuccess()
      getList()
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
