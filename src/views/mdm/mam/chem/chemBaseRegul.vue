<template>
  <div>
    <c-table
      ref="table"
      title="규제항목"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="chem.reguls"
      :gridHeight="gridHeight"
      :filtering="false"
      :isExcelDown="false"
      :isFullScreen="false"
      :columnSetting="false"
      :customTrClass="setTrClass"
      selection="multiple"
      rowKey="regulatedItemCd"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-header-append>
        <span style="font-size: 1em; color: red">
          {{
            $language('※ 규제 항목의 정량값이 두 개 이상일 경우, 해당 행의 색상이 강조 표시됩니다.')
          }}
        </span>
      </template>
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="제외" icon="delete" @btnClicked="deleteRegul" />
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRegul" />
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
import { chemBaseColumnSettingType, chemBaseType } from './chemBase'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemBaseRegul'
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
  popupParam: {
    mdmChemId: stringNull
  }
  chem: chemBaseType
  isOld: boolean
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
      mdmChemId: ''
    }
  },
  chem: () => {
    return {
      mdmChemId: '', // 화학물질 일련번호
      casNo: '', // CAS No.
      chemNmEn: '', // 화학물질명(ENG)
      chemNmKr: '', // 화학물질명(KOR)
      nlId: '', // 뉴로라인즈 물질ID
      molecularFormula: '', // 화학식
      regulFlag: 'N', // 규제물질 대상여부
      nlRegDt: '', // 뉴로라인즈 생성일
      nlChgDt: '', // 뉴로라인즈 수정일
      propertiesStateCd: '', // 성상
      mttrid: '', // 산업안전보건공단 chemid
      deleteFlag: '', // 삭제여부
      regUserId: '', // 등록자
      chgUserId: '', // 수정자
      // 상세정보
      boilingPoint: '', // 끓는점-위험성평가용
      cmrFlag: 'N', // CMR 물질 여부-위험성평가용
      carcinogens: '', // 발암성물질
      mutagens: '', // 변이원성물질
      reproductiveToxins: '', // 생식독성물질
      maleficenceForm: null, // 유해성 발생형태-위험성평가용
      maleficenceValue: null, // 유해성 측정값-위험성평가용
      maleficenceGrade: null, // 비산성 등급-위험성평가용
      maleficenceType: null, // 비산/휘발성 구분-위험성평가용
      hrCodeGrade: null, // 위험문구/유해위험문구 등급-위험성평가용
      hcode: '', // 유해･위험문구-위험성평가용
      rcode: '', // 위험문구-위험성평가용
      restrictions: '', // 제한사항
      prohibited: '', // 금지사항
      accidentManuQuantity: '', // 사고대비물질_제조사용 지정수량(Kg)
      accidentStoreQuantity: '', // 사고대비물질_보관저장 지정수량(kg)
      exclusionConditions: '', // 제외조건내용
      exclusionConditionSign: null, // 제외조건_부등호
      exclusionConditionQuantity: '', // 제외조건_정량값
      exclusionConditionUnit: '', // 제외조건_단위
      prtrGroupId: '', // PRTR_Group_ID
      prtrMaterialName: '', // PRTR_물질명
      prtrSwcsWt: '', // PRTR_조사대상무게함유기준(wt%)
      prtrSwcsWtSign: null, // PRTR_조사대상무게함유기준_부등호
      prtrSwcsWtQuantity: null, // PRTR_조사대상무게함유기준_정량값
      prtrSwcsWtUnit: '', // PRTR_조사대상무게함유기준_단위
      prtrSwcsTon: '', // PRTR_조사대상취급량기준(톤/년)
      prtrSwcsTonSign: '', // PRTR_조사대상취급량기준_부등호
      prtrSwcsTonQuantity: '', // PRTR_조사대상취급량기준_정량값
      prtrSwcsTonUnit: '', // PRTR_조사대상취급량기준_단위
      remark1: '', // 고시내용 외 참조내용 입력(예, CMR, PBT 등)
      dangerousContents: '', // 위험물내용
      dangerousClass: '', // 위험물유별구분
      dangerousProp: '', // 위험물성질
      dangerousName: '', // 위험물품명
      designatedQuantityDose: '', // 지정수량_정량값
      designatedQuantityUnit: '', // 지정수량_단위
      psmAmount: '', // 공정안전관리 제조∙취급∙저장량(kg/일)
      bei: '', // 생물학적노출기준(단위포함 Full text)
      sensitization: '', // 과민성 여부 입력(고용노동부, ACGIH 등)
      simpleAsphyxiants: '', // 질식제 여부 입력(ACGIH, EU 노출기준 등)
      skinNotations: '', // 피부영향 여부 입력(고용노동부, ACGIH 등)
      basisCriticalEffects: '', // 표적장기 입력(예, 간, 신장 등)
      twaPpm: '', // TWA 노출기준입력 ppm
      twaMm: '', // TWA 노출기준입력 mg/m3
      stelPpm: '', // STEL 노출기준입력 ppm
      stelMm: '', // STEL 노출기준입력 mg/m3
      ceilingsPpm: '', // Celling 노출기준입력 ppm
      ceilingsMm: '', // Celling 노출기준입력 mg/m3
      lelPpm: '', // LEL노출기준입력 ppm
      lelMm: '', // LEL노출기준입력 mg/m3
      remark2: '', // 적용기준, 고시내용 외 추가 참조사항 입력
      remark3: '', // 기타 참조사항
      reguls: [], // 평가자
      deleteReguls: [], // [삭제]평가자
      columnSetting: {} as chemBaseColumnSettingType
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '60%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  merge: [{ index: 0, colName: 'regulationBillCd' }],
  columns: [
    {
      name: 'regulationBillName',
      field: 'regulationBillName',
      label: '규제 법규',
      align: 'center',
      sortable: true,
      fix: true,
      style: 'width:120px'
    },
    {
      name: 'regulatedItemName',
      field: 'regulatedItemName',
      label: '규제항목',
      align: 'left',
      sortable: true,
      fix: true,
      style: 'width:170px'
    },
    {
      name: 'noti',
      field: 'noti',
      label: '고시',
      child: [
        {
          name: 'notiNo',
          field: 'notiNo',
          label: '고시번호',
          align: 'left',
          sortable: true,
          style: 'width:200px',
          type: 'text'
        },
        {
          name: 'notice',
          field: 'notice',
          label: '고시내용',
          align: 'left',
          sortable: true,
          style: 'width:300px',
          type: 'textarea'
        },
        {
          name: 'notiDt',
          field: 'notiDt',
          label: '고시일자',
          align: 'center',
          sortable: true,
          style: 'width:120px',
          type: 'date'
        },
        {
          name: 'uniqNo',
          field: 'uniqNo',
          label: '고유번호',
          align: 'center',
          sortable: true,
          style: 'width:100px',
          type: 'text'
        }
      ]
    },
    {
      name: 'appli',
      field: 'appli',
      label: '적용기준',
      child: [
        {
          name: 'appliStandContents',
          field: 'appliStandContents',
          label: '내용',
          align: 'left',
          sortable: true,
          style: 'width:600px',
          type: 'text',
          colorTarget: true
        },
        {
          name: 'appliStandSign',
          field: 'appliStandSign',
          label: '부등호',
          align: 'center',
          sortable: true,
          style: 'width:50px',
          type: 'select',
          codeGroupCd: 'CHM_STND_SIGN'
        },
        {
          name: 'appliStandQuantity',
          field: 'appliStandQuantity',
          label: '정량값',
          align: 'right',
          sortable: true,
          style: 'width:80px',
          type: 'text'
        },
        {
          name: 'appliStandUnit',
          field: 'appliStandUnit',
          label: '단위',
          align: 'left',
          sortable: true,
          style: 'width:50px',
          type: 'text'
        }
      ]
    },
    {
      name: 'prtr',
      field: 'prtr',
      label: '배출량조사대상물질 (PRTR 정량값)',
      child: [
        {
          name: 'prtrGroupId',
          field: 'prtrGroupId',
          label: '그룹',
          align: 'center',
          sortable: true,
          style: 'width:50px',
          type: 'select',
          codeGroupCd: 'CHM_PRTR_GROUP_CD'
          // type: 'text'
        },
        {
          name: 'prtrSwcsWtQuantity',
          field: 'prtrSwcsWtQuantity',
          label: '함유량(%)',
          align: 'right',
          sortable: true,
          type: 'text',
          style: 'width:90px'
        },
        {
          name: 'prtrSwcsTonQuantity',
          field: 'prtrSwcsTonQuantity',
          label: '취급량(톤/년)',
          align: 'right',
          sortable: true,
          type: 'text',
          style: 'width:90px'
        }
      ]
    },
    {
      name: 'exposure',
      field: 'exposure',
      label: '노출기준',
      child: [
        {
          name: 'twaPpm',
          field: 'twaPpm',
          label: 'TWA<br>(ppm)',
          align: 'right',
          sortable: true,
          style: 'width:80px',
          type: 'text'
        },
        {
          name: 'twaMm',
          field: 'twaMm',
          label: 'TWA<br>(mg/m3)',
          align: 'right',
          sortable: true,
          style: 'width:80px',
          type: 'text'
        },
        {
          name: 'stelPpm',
          field: 'stelPpm',
          label: 'STEL<br>(ppm)',
          align: 'right',
          sortable: true,
          style: 'width:80px',
          type: 'text'
        },
        {
          name: 'stelMm',
          field: 'stelMm',
          label: 'STEL<br>(mg/m3)',
          align: 'right',
          sortable: true,
          style: 'width:80px',
          type: 'text'
        }
      ]
    },
    {
      name: 'danger',
      field: 'danger',
      label: '위험물(지정수량)',
      child: [
        {
          name: 'dangerousName',
          field: 'dangerousName',
          label: '품명',
          align: 'left',
          sortable: true,
          style: 'width:100px',
          type: 'text'
        },
        {
          name: 'designatedQuantityDose',
          field: 'designatedQuantityDose',
          label: '정량값',
          align: 'right',
          sortable: true,
          style: 'width:80px',
          type: 'text'
        },
        {
          name: 'designatedQuantityUnit',
          field: 'designatedQuantityUnit',
          label: '단위',
          align: 'center',
          sortable: true,
          style: 'width:50px',
          type: 'text'
        },
        {
          name: 'designatedQuantityRemark',
          field: 'designatedQuantityRemark',
          label: '내용',
          align: 'left',
          sortable: true,
          style: 'width:200px',
          type: 'textarea'
        }
      ]
    }
  ]
})
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 215
      : 400
  if (height < 400) {
    height = 400
  }
  return `${String(height)}px`
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
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 규제사항 제외
 *******************************/
function deleteRegul() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    if (!props.chem.deleteReguls) props.chem.deleteReguls = []
    _.forEach(selectData, (item) => {
      if (
        item.editFlag !== 'C' &&
        _.findIndex(props.chem.deleteReguls, { regulatedItemCd: item.regulatedItemCd }) === -1
      ) {
        props.chem.deleteReguls.push(item)
      }
      props.chem.reguls = _.reject(props.chem.reguls, item)
    })
    table.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 규제사항 추가를 위한 규제항목 팝업 표시
 *******************************/
function addRegul() {
  popupOptions.value = getPopupOptions('regul', popupOptions.value, closeRegulPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 규제항목 팝업 닫기
 * @param (1): 선택한 규제정보
 *******************************/
function closeRegulPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(props.chem.reguls, { regulatedItemCd: item.regulatedItemCd }) === -1) {
        let idx = _.findIndex(props.chem.reguls, {
          regulationBillCd: item.regulationBillCd
        })
        idx = idx > -1 ? idx : 0
        props.chem.reguls.splice(idx, 0, {
          mdmChemId: props.popupParam.mdmChemId, // 화학물질 일련번호
          regulationBillCd: item.regulationBillCd, // 규제항목 코드
          regulationBillName: item.regulationBillName, // 규제항목 코드
          regulatedItemCd: item.regulatedItemCd, // 규제항목 코드
          regulatedItemName: item.regulatedItemName, // 규제항목 코드
          regulatedReason: '', // 규제대상 사유
          notiNo: '', // 고시번호
          notice: '', // 고시내용
          notiDt: '', // 고시일자
          uniqNo: '', // 고유번호
          appliStandContents: '', // 적용기준 내용
          appliStandSign: null, // 적용기준 부등호
          appliStandQuantity: '', // 적용기준 정량값
          appliStandUnit: '%', // 적용기준 단위
          editFlag: 'C'
        })
      }
    })
  }
}

function setTrClass(_props: any) {
  return _props.row.pluralFlag === 'Y' ? 'bg-blue-1' : ''
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
