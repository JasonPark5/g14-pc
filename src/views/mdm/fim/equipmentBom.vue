<template>
  <c-table
    ref="table"
    title="자재 목록"
    :columns="grid.columns"
    :data="equipData.materials"
    :gridHeight="gridHeight"
    :isFullScreen="false"
    :columnSetting="false"
    :filtering="false"
    :editable="editable"
    selection="multiple"
    rowKey="equipmentMaterialCd"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRow" />
        <c-btn
          v-if="editable && equipData.materials!.length > 0"
          label="삭제"
          icon="remove"
          @btnClicked="deleteMat"
        />
      </q-btn-group>
    </template>
  </c-table>
  <c-dialog :param="popupOptions" />
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
import { equipBomType, equipPopupParamType, equipType } from './equipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentBom'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
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
  popupParam: equipPopupParamType
  equipData: equipType
  contentHeight: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<equipBomType>
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
      equipmentCd: '',
      plantCd: '',
      psmFlag: ''
    }
  },
  equipData: () => {
    return {
      plantCd: null, // 사업장코드
      plantName: '', // 사업장
      equipmentTypeCd: null, // 설비유형 코드
      equipmentTypeName: '', // 설비유형명
      equipmentCd: '', // 설비코드
      equipmentNo: '', // 설비코드
      equipmentName: '', // 설비명
      mainProcessCd: '', // 주공정
      subProcessCd: '', // 부공정
      managementDepts: '', // 관리부서
      equipmentLocation: '', // 설비위치
      installDate: '', // 설치일자
      installVendor: '', // 설치업체
      opertationDate: '', // 가동일자
      checkPassNo: '', // 검사합격번호
      checkPassDate: '', // 합격일자
      discardFlag: 'N',
      discardDate: '', // 폐기일자
      psmFlag: 'N', // PSM 대상 여부
      psmTypeCd: null,
      amount: '', // 수량
      lawEquipmentFlag: 'N', // 법정설비 여부
      inspectionCycleCd: null, // 법정점검 주기
      selfCycleCd: null, // 자체점검 주기
      pmCycleCd: null, // 자체점검 주기
      pmFlag: 'N', // 예방정비 여부
      cmFlag: 'N', // 고장정비 여부
      predictiveFlag: 'N', // 예지정비 여부
      operFlag: 'N', // 운전정비 여부
      relatedLaws: '', // 관련법규
      recentInspectionDate: '', // 최근 점검일자
      outsourcingVendor: '', // 유지보수업체
      hazardousFlag: 'N',
      equipGradeCd: null,
      regUserId: '',
      chgUserId: '',
      checks: [],
      maintenances: [],
      specs: [],
      ranks: [],
      materials: [],
      mocs: [],
      licenses: [],
      processCds: []
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
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '50%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'mdmChemMaterialName',
      field: 'mdmChemMaterialName',
      label: '화학자재',
      type: 'link',
      align: 'center',
      sortable: true
    },
    {
      name: 'mdmChemMaterialCd',
      field: 'mdmChemMaterialCd',
      label: '화학자재코드',
      align: 'center',
      sortable: true
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'casNo',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 180
      : 500
  if (height < 300) {
    height = 300
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
 * @Function_선언* TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  listUrl.value = selectConfig.mdm.equipment.material.list.url
  saveUrl.value = transactionConfig.mdm.equipment.material.save.url
  deleteUrl.value = transactionConfig.mdm.equipment.material.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 설비 관련 자재 조회
 *******************************/
function getList() {
  if (props.popupParam.equipmentCd) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        equipmentCd: props.popupParam.equipmentCd
      }
    }).then((_result: any) => {
      props.equipData.materials = _result.data
    })
  }
}
/******************************
 * TODO (목적): 설비 관련 자재 추가
 *******************************/
function addRow() {
  popupOptions.value = getPopupOptions('chemMaterial', popupOptions.value, closePopup, {
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 자재 팝업 닫기
 * @param (1): 자재 정보들
 *******************************/
function closePopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveData = [] as any
    if (!props.equipData.materials) props.equipData.materials = []

    _.forEach(data, (item) => {
      if (
        _.findIndex(props.equipData.materials, { mdmChemMaterialId: item.mdmChemMaterialId }) === -1
      ) {
        saveData.push({
          equipmentMaterialCd: uid(),
          equipmentCd: props.popupParam.equipmentCd,
          mdmChemMaterialId: item.mdmChemMaterialId,
          mdmChemMaterialCd: item.mdmChemMaterialCd,
          mdmChemMaterialName: item.mdmChemMaterialName,
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      }
    })
    $http({
      url: saveUrl.value,
      method: 'POST',
      data: saveData
    }).then(() => {
      message.requestSuccess()
      getList()
    })
  }
}
/******************************
 * TODO (목적): 설비 관련 자재 삭제
 *******************************/
function deleteMat() {
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
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: $format(deleteUrl.value),
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()

          _.forEach(selectData, (item) => {
            props.equipData.materials = _.reject(props.equipData.materials, item)
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
