<template>
  <div>
    <c-table
      ref="table"
      title="관련인허가 목록"
      :columns="grid.columns"
      :data="grid.data"
      gridHeight="660px"
      :isFullScreen="false"
      :columnSetting="false"
      :filtering="false"
      :usePaging="false"
      @linkClick="licensePop"
    />
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
import { licenseType } from '@/views/sop/lim/license'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemLicense'
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
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    mdmChemMaterialId: string
    tabName: stringNull
    subtabName: stringNull
    plantCd: stringNull
  }
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
      mdmChemMaterialId: '',
      tabName: '',
      subtabName: '',
      plantCd: null
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '100%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const listUrl = ref('')
const grid = ref({
  columns: [
    {
      name: 'licenseNo',
      field: 'licenseNo',
      label: '인허가 번호',
      align: 'center',
      sortable: false
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련 법규명',
      align: 'center',
      sortable: false
    },
    {
      name: 'limLicenseKindName',
      field: 'limLicenseKindName',
      label: '인허가종류',
      align: 'left',
      type: 'link',
      sortable: false
    },
    {
      name: 'licenseStartDate',
      field: 'licenseStartDate',
      label: '인허가시작일',
      align: 'center',
      sortable: false
    },
    {
      name: 'licenseEndDate',
      field: 'licenseEndDate',
      label: '인허가종료일',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})

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
  listUrl.value = selectConfig.mdm.mam.chem.license.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 화학자재 관련 인허가 조회
 *******************************/
function getList() {
  if (props.popupParam.mdmChemMaterialId) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        mdmChemMaterialId: props.popupParam.mdmChemMaterialId
      }
    }).then((_result: any) => {
      grid.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 인허가 상세 팝업 표시
 * @param (1): 행 정보
 *******************************/
function licensePop(row: licenseType) {
  popupOptions.value.title = '인허가 상세'
  popupOptions.value.param = {
    limLicenseId: row ? row.limLicenseId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sop/lim/licenseStatusDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 인허가 상세 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
