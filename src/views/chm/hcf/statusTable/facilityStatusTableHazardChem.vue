<template>
  <div>
    <c-table
      ref="table"
      title="유해화학물질 취급현황"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="facilityStatusTable.hazardChems"
      :gridHeight="gridHeight"
      :editable="editable"
      :hideBottom="true"
      :isExcelDown="false"
      :filtering="false"
      :isFullScreen="false"
      :columnSetting="false"
      selection="multiple"
      rowKey="chmFacilityStatusTableHazardId"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && facilityStatusTable.hazardChems.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteHazardChem"
          />
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addHazardChem" />
          <c-btn
            v-show="editable && facilityStatusTable.hazardChems.length > 0"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="facilityStatusTable.hazardChems"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveHazardChem"
            @btnCallback="saveHazardChemCallback"
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

import { facilityStatusTableType } from './facilityStatusTable'

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
  name: 'facilityStatusTableHazardChem'
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
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    chmFacilityStatusTableId: stringNull
  }
  facilityStatusTable: facilityStatusTableType
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
  chmFacilityStatusTableId: () => {
    return {
      chmFacilityStatusTableId: ''
    }
  },
  facilityStatusTable: () => {
    return {
      chmFacilityStatusTableId: '', // 취급시설 현황표 일련번호
      facilityStatusTableName: '', // 현황표명
      plantCd: '', // 사업장코드
      year: '',
      permitDate: '', // 허가일
      companyName: '', // 회사명
      managerName: '', // 대표자
      managerEmail: '', // 대표자 E-MAIL
      phoneNo: '', // 전화번호
      bizNo: '', // 사업자번호
      remarks: '', // 비고
      attrVal1: '', // 회사id
      attrVal2: '', // 소재지
      attrVal3: '', // 시설구분
      regDtStr: '',
      regUserName: '',
      managers: [], // 유해화학물질관리자
      facilities: [], // 시설
      hazardChems: [], // 유해화학물질 취급현황
      equipDevices: [], // 설비 장치
      equipPowers: [] // 설비 동력기계
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
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  merge: [
    { index: 0, colName: 'materialName' },
    { index: 1, colName: 'materialName' }
  ],
  columns: [
    {
      name: 'materialName',
      field: 'materialName',
      label: '화학자재명',
      type: 'link',
      align: 'left',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'propertiesStateName',
      field: 'propertiesStateName',
      label: '저장성상',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '화학물질명',
      type: 'link',
      align: 'left',
      style: 'width:180px',
      sortable: true
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      style: 'width:90px',
      sortable: true
    },
    {
      name: 'limitRepval',
      field: 'limitRepval',
      label: '함량 (%)',
      align: 'right',
      style: 'width:70px',
      sortable: true
    },
    {
      name: 'useage',
      field: 'useage',
      label: '사용처',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      type: 'text'
    },
    {
      name: 'annualVolumne',
      field: 'annualVolumne',
      label: '연간취급량 (톤/년)<br/>(허가증상)',
      align: 'right',
      style: 'width:100px',
      sortable: true,
      type: 'number'
    },
    {
      name: 'previousVolumne',
      field: 'previousVolumne',
      label: '과년도취급량 (톤/년)<br/>(실적보고서상)',
      align: 'right',
      style: 'width:100px',
      sortable: true,
      type: 'number'
    },
    {
      name: 'storageMethod',
      field: 'storageMethod',
      label: '저장방법',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      type: 'text'
    }
  ],
  data: []
})
const isSave = ref(false)
const saveUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height = !Number.isNaN(props.contentHeight) ? Number(props.contentHeight) - 50 : 700
  if (height < 500) {
    height = 500
  }
  return String(height) + 'px'
})

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
  saveUrl.value = transactionConfig.chm.facilityStatusTable.hazard.save.url
  deleteUrl.value = transactionConfig.chm.facilityStatusTable.hazard.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 유해화학물질 추가를 위한 팝업 표시
 *******************************/
function addHazardChem() {
  popupOptions.value = getPopupOptions('hazardChem', popupOptions.value, closePopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: {
      plantCd: props.facilityStatusTable.plantCd
    }
  })
}
/******************************
 * TODO (목적): 유해화학물질 닫기
 * @param (1): 선택한 유해화학물질 정보
 *******************************/
function closePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (
        _.findIndex(props.facilityStatusTable.hazardChems, {
          mdmChemId: item.mdmChemId
        }) === -1
      ) {
        props.facilityStatusTable.hazardChems.splice(0, 0, {
          chmFacilityStatusTableHazardId: uid(), // 취급시설 현황표 유해화학물질 일련번호
          chmFacilityStatusTableId: props.popupParam.chmFacilityStatusTableId, // 취급시설 현황표 일련번호
          mdmChemId: item.mdmChemId, // 조성품 일련번호
          useage: '', // 사용처
          annualVolumne: '', // 연간취급량
          previousVolumne: '', // 과년도취급량
          storageMethod: '', // 저장방법
          materialCd: item.materialCd,
          materialName: item.mdmChemMaterialName,
          chemNmEn: item.chemNmEn,
          casNo: item.casNo,
          limitRepval: item.limitRepval,
          propertiesStateName: item.propertiesStateName,
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 유해화학물질 삭제
 *******************************/
function deleteHazardChem() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            props.facilityStatusTable.hazardChems = _.reject(
              props.facilityStatusTable.hazardChems,
              item
            )
          })
          table.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 유해화학물질 저장 전 처리
 *******************************/
function saveHazardChem() {
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
}
/******************************
 * TODO (목적): 유해화학물질 저장 후 처리
 *******************************/
function saveHazardChemCallback() {
  message.requestSuccess()
  emits('getDetail')
}
/******************************
 * TODO (목적): 화학자재 링크 클릭 시 팝업 표시
 * @param (1): 화학자재 정보
 *******************************/
function linkClick(row?: any, col?: any) {
  if (col.name === 'materialName') {
    popupOptions.value.title = '화학자재 상세'
    popupOptions.value.param = {
      mdmChemMaterialId: row ? row.mdmChemMaterialId : '',
      plantCd: row ? row.plantCd : ''
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/mdm/mam/chemDetail.vue`))
    )
  } else if (col.name === 'chemNmEn') {
    popupOptions.value.title = '화학물질 상세'
    popupOptions.value.param = {
      mdmChemId: row ? row.mdmChemId : ''
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`@/views/mdm/mam/chem/chemBaseDetail.vue`))
    )
  }
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup2
}
function closePopup2() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
