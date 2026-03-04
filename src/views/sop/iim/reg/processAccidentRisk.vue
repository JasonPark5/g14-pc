<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" topClass="topcolor-orange">
      <c-table
        ref="riskTable"
        title="위험성 평가 목록"
        :columns="grid.columns"
        :data="accidentInfo.riskAssessList"
        :filtering="false"
        :isExcelDown="false"
        :columnSetting="false"
        :usePaging="false"
        :hideBottom="true"
        :editable="editable"
        rowKey="ramRiskAssessmentPlanId"
        selection="multiple"
        @linkClick="linkClick"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              label="추가"
              :showLoading="false"
              icon="add"
              @btnClicked="addRisk"
            />
            <c-btn
              v-if="editable && !disabled && accidentInfo.riskAssessList!.length > 0"
              label="삭제"
              :showLoading="false"
              icon="remove"
              @btnClicked="removeRisk"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { processAccidentPopupParamType, processAccidentType } from '../processAccident'

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
  name: 'processAccidentRisk'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

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
  popupParam: processAccidentPopupParamType
  accidentInfo: processAccidentType
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
      iimAccidentId: ''
    }
  },
  accidentInfo: () => {
    return {
      plantCd: '',
      iimAccidentId: '',
      accidentStatusCd: '',
      riskAssessList: []
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
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<any>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sotrable: true
    },
    {
      name: 'ramTechniqueName',
      field: 'ramTechniqueName',
      label: '평가분류',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'assessmentName',
      field: 'assessmentName',
      label: '평가명',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'link'
    },
    {
      name: 'assessmentDate',
      field: 'assessmentDate',
      label: '평가기간',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'ramAssessTypeName',
      field: 'ramAssessTypeName',
      label: '평가구분',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '작성자',
      align: 'center',
      style: 'width:100px',
      sortable: true
    }
  ],
  data: [],
  height: '280px'
})
const getUrl = ref('')
const saveUrl = ref('')
const riskTable = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    editable.value &&
    Boolean(props.accidentInfo.accidentStatusCd) &&
    props.accidentInfo.accidentStatusCd === 'ISPC000005'
)

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
  getUrl.value = selectConfig.sop.iim.accident.process.get.url
  saveUrl.value = transactionConfig.ram.assessPlan.accident.insert.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.accidentInfo.iimAccidentId) {
    $http({
      url: $format(getUrl.value, props.accidentInfo.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      props.accidentInfo.riskAssessList = _.clone(_result.data.riskAssessList)
    })
  }
}
/******************************
 * TODO (목적): 위험성 평가 추가
 *******************************/
function addRisk() {
  popupOptions.value = getPopupOptions('riskAssessment', popupOptions.value, closeRiskPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
function closeRiskPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const saveRisks: any = []
    _.forEach(data, (_item) => {
      const index = _.findIndex(props.accidentInfo.riskAssessList, {
        ramRiskAssessmentPlanId: _item.ramRiskAssessmentPlanId
      })
      if (index === -1) {
        saveRisks.push({
          iimAccidentId: props.accidentInfo.iimAccidentId,
          ramRiskAssessmentPlanId: _item.ramRiskAssessmentPlanId,
          plantName: _item.plantName,
          ramTechniqueName: _item.ramTechniqueName,
          assessmentName: _item.assessmentName,
          assessmentDate: _item.assessmentDate,
          ramAssessTypeName: _item.ramAssessTypeName,
          regUserName: _item.regUserName,
          reviewUserName: _item.reviewUserName,
          approvalUserName: _item.approvalUserName,
          vendorFlag: _item.vendorFlag,
          ramTechniqueCd: _item.ramTechniqueCd,
          ramStepCd: _item.ramStepCd,
          editFlag: 'C'
        })
      }
    })
    $http({
      url: saveUrl.value,
      method: 'POST',
      data: saveRisks
    }).then(() => {
      message.requestSuccess()
      getDetail()
    })
  }
}
/******************************
 * TODO (목적): 위험성 평가 삭제
 *******************************/
function removeRisk() {
  const selectData = riskTable.value.getSelected()
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
      confirmCallback: () => {
        $http({
          url: saveUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (_item) => {
            props.accidentInfo.riskAssessList = _.reject(props.accidentInfo.riskAssessList, _item)
          })
          riskTable.value.selected = []
          message.requestSuccess()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 상세팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '위험성평가 상세'
  popupOptions.value.param = {
    ramRiskAssessmentPlanId: row ? row.ramRiskAssessmentPlanId : '',
    ramStepCd: row.ramStepCd || 'RRS0000001',
    vendorFlag: row ? row.vendorFlag > 0 : false,
    ramTechniqueCd: row.ramTechniqueCd || '',
    assessmentName: row.assessmentName || ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/ram/riskDetail.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
