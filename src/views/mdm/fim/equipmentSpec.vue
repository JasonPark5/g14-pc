<template>
  <div>
    <c-card class="cardClassDetailInfo" :noHeader="true">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="사업장" :value="equipData.plantName" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="설비유형" :value="equipData.equipmentTypeName" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="설비관리번호" :value="equipData.equipmentNo" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="설비명" :value="equipData.equipmentName" />
        </div>
      </template>
    </c-card>
    <c-table
      ref="table"
      title="설비 사양"
      :columns="grid.columns"
      :data="equipData.specs"
      :gridHeight="gridHeight"
      :isFullScreen="false"
      :columnSetting="false"
      :filtering="false"
      :editable="editable"
      selection="multiple"
      rowKey="equipmentSpecId"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRow" />
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="deleteSpec"
          />
          <c-btn
            v-if="editable && grid.data.length > 0"
            label="저장"
            icon="save"
            @btnClicked="saveSpec"
          />
        </q-btn-group>
      </template>
    </c-table>
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
import { equipPopupParamType, equipSpecType, equipType } from './equipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentSpec'
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
  isOld: boolean
  contentHeight: string
}
interface gridType {
  columns: tableColumnType
  data: Array<equipSpecType>
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
      licenses: []
    }
  },
  isOld: false,
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'item',
      field: 'item',
      label: '항목',
      style: 'width:100px',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'itemDesc',
      field: 'itemDesc',
      label: '항목설명',
      style: 'width:200px',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'itemValue',
      field: 'itemValue',
      label: '값',
      type: 'text',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'itemUnit',
      field: 'itemUnit',
      label: '단위',
      type: 'text',
      align: 'center',
      style: 'width:80px',
      sortable: false
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
      ? Number(props.contentHeight) - 150
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
  listUrl.value = selectConfig.mdm.equipment.spec.list.url
  saveUrl.value = transactionConfig.mdm.equipment.spec.save.url
  deleteUrl.value = transactionConfig.mdm.equipment.spec.delete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 설비 사양 조회
 *******************************/
function getList() {
  if (props.isOld) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        plantCd: props.popupParam.plantCd,
        equipmentCd: props.popupParam.equipmentCd
      }
    }).then((_result: any) => {
      props.equipData.specs = _result.data
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function addRow() {
  if (!props.equipData.specs) props.equipData.specs = []
  props.equipData.specs.push({
    plantCd: props.popupParam.plantCd,
    equipmentCd: props.popupParam.equipmentCd,
    equipmentSpecId: uid(),
    sortOrder: 0,
    item: '',
    itemDesc: '',
    itemValue: '',
    itemUnit: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function deleteSpec() {
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
            props.equipData.specs = _.reject(props.equipData.specs, item)
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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveSpec() {
  if (validTable(grid.value.columns, props.equipData.specs!)) {
    const saveData = props.equipData.specs!.filter((x: any) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          $http({
            url: saveUrl.value,
            method: 'POST',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            getList()
          })
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.',
        type: 'info' // success / info / warning / error
      })
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
