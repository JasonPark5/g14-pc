<template>
  <div>
    <c-card v-if="ifArea(1)" title="위험성평가" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div v-if="ifInput('boilingPoint')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            type="number"
            label="끓는점 (℃)"
            name="boilingPoint"
            v-model:value="chem.boilingPoint"
          />
        </div>
        <div v-if="ifInput('maleficenceForm')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-select
            :editable="editable"
            codeGroupCd="MALEFICENCE_FORM"
            itemText="codeName"
            itemValue="code"
            type="edit"
            label="유해성 노출기준 발생형태"
            name="maleficenceForm"
            v-model:value="chem.maleficenceForm"
          />
        </div>
        <div v-if="ifInput('maleficenceValue')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            type="number"
            label="유해성 측정값"
            name="maleficenceValue"
            v-model:value="chem.maleficenceValue"
          />
        </div>
        <div v-if="ifInput('maleficenceGrade')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-select
            :editable="editable"
            codeGroupCd="MALEFICENCE_GRADE"
            itemText="codeName"
            itemValue="code"
            type="edit"
            label="비산성 등급"
            name="maleficenceGrade"
            v-model:value="chem.maleficenceGrade"
          />
        </div>
        <div v-if="ifInput('maleficenceType')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-select
            :editable="editable"
            codeGroupCd="MALEFICENCE_TYPE"
            itemText="codeName"
            itemValue="code"
            type="edit"
            label="비산/휘발성 구분"
            name="maleficenceType"
            v-model:value="chem.maleficenceType"
          />
        </div>
        <div v-if="ifInput('hrCodeGrade')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-select
            :editable="editable"
            codeGroupCd="HR_CODE_GRADE"
            itemText="codeName"
            itemValue="code"
            type="edit"
            label="위험문구/유해위험문구 등급"
            name="hrCodeGrade"
            v-model:value="chem.hrCodeGrade"
          />
        </div>
        <div v-if="ifInput('hcode')" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-textarea
            :editable="editable"
            :rows="2"
            label="유해･위험문구"
            name="hcode"
            v-model:value="chem.hcode"
          />
        </div>
        <div v-if="ifInput('rcode')" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-textarea
            :editable="editable"
            :rows="2"
            label="누출 및 폭발·화재 사고시 대처방법"
            name="rcode"
            v-model:value="chem.rcode"
          />
        </div>
        <div v-if="ifInput('cmrFlag')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-checkbox
            :editable="editable"
            :isFlag="true"
            label="CMR 물질 여부"
            name="cmrFlag"
            v-model:value="chem.cmrFlag"
          />
        </div>
        <div v-if="ifInput('carcinogens')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="발암성물질"
            name="carcinogens"
            v-model:value="chem.carcinogens"
          />
        </div>
        <div v-if="ifInput('mutagens')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="변이원성물질"
            name="mutagens"
            v-model:value="chem.mutagens"
          />
        </div>
        <div v-if="ifInput('reproductiveToxins')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="생식독성물질"
            name="reproductiveToxins"
            v-model:value="chem.reproductiveToxins"
          />
        </div>
      </template>
    </c-card>
    <c-card v-if="ifArea(2)" title="유해화학물질" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div v-if="ifInput('restrictions')" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-textarea
            :editable="editable"
            label="제한사항"
            name="restrictions"
            v-model:value="chem.restrictions"
          />
        </div>
        <div v-if="ifInput('prohibited')" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-textarea
            :editable="editable"
            label="금지사항"
            name="prohibited"
            v-model:value="chem.prohibited"
          />
        </div>
        <div v-if="ifInput('accidentManuQuantity')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="사고대비물질_제조사용 지정수량(Kg)"
            name="accidentManuQuantity"
            v-model:value="chem.accidentManuQuantity"
          />
        </div>
        <div v-if="ifInput('accidentStoreQuantity')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="사고대비물질_보관저장 지정수량(kg)"
            name="accidentStoreQuantity"
            v-model:value="chem.accidentStoreQuantity"
          />
        </div>
      </template>
    </c-card>
    <c-card v-if="ifArea(3)" title="제외조건" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div v-if="ifInput('exclusionConditions')" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-textarea
            :editable="editable"
            label="제외조건내용"
            name="exclusionConditions"
            v-model:value="chem.exclusionConditions"
          />
        </div>
        <div v-if="ifInput('exclusionConditionSign')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-select
            :editable="editable"
            codeGroupCd="CHM_STND_SIGN"
            itemText="codeName"
            itemValue="code"
            type="edit"
            label="제외조건부등호"
            name="exclusionConditionSign"
            v-model:value="chem.exclusionConditionSign"
          />
        </div>
        <div
          v-if="ifInput('exclusionConditionQuantity')"
          class="col-xs-12 col-sm-12 col-md-2 col-lg-2"
        >
          <c-text
            :editable="editable"
            label="정량값"
            name="exclusionConditionQuantity"
            v-model:value="chem.exclusionConditionQuantity"
          />
        </div>
        <div v-if="ifInput('exclusionConditionUnit')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="단위"
            name="exclusionConditionUnit"
            v-model:value="chem.exclusionConditionUnit"
          />
        </div>
      </template>
    </c-card>
    <c-card v-if="ifArea(4)" title="PRTR" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div v-if="ifInput('prtrGroupId')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="PRTR_Group_ID"
            name="prtrGroupId"
            v-model:value="chem.prtrGroupId"
          />
        </div>
        <div v-if="ifInput('prtrMaterialName')" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable"
            label="PRTR_물질명"
            name="prtrMaterialName"
            v-model:value="chem.prtrMaterialName"
          />
        </div>
        <div v-if="ifInput('prtrSwcsWt')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="PRTR_조사대상무게함유기준(wt%)"
            name="prtrSwcsWt"
            v-model:value="chem.prtrSwcsWt"
          />
        </div>
        <div v-if="ifInput('prtrSwcsWtSign')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-select
            :editable="editable"
            codeGroupCd="CHM_STND_SIGN"
            itemText="codeName"
            itemValue="code"
            type="edit"
            label="조사대상무게함유기준_부등호"
            name="prtrSwcsWtSign"
            v-model:value="chem.prtrSwcsWtSign"
          />
        </div>
        <div v-if="ifInput('prtrSwcsWtQuantity')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="조사대상무게함유기준_정량값"
            name="prtrSwcsWtQuantity"
            v-model:value="chem.prtrSwcsWtQuantity"
          />
        </div>
        <div v-if="ifInput('prtrSwcsWtUnit')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="조사대상무게함유기준_단위"
            name="prtrSwcsWtUnit"
            v-model:value="chem.prtrSwcsWtUnit"
          />
        </div>
        <div v-if="ifInput('prtrSwcsTon')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="조사대상취급량기준(톤/년)"
            name="prtrSwcsTon"
            v-model:value="chem.prtrSwcsTon"
          />
        </div>
        <div v-if="ifInput('prtrSwcsTonSign')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-select
            :editable="editable"
            codeGroupCd="CHM_STND_SIGN"
            itemText="codeName"
            itemValue="code"
            type="edit"
            label="조사대상취급량기준_부등호"
            name="prtrSwcsTonSign"
            v-model:value="chem.prtrSwcsTonSign"
          />
        </div>
        <div v-if="ifInput('prtrSwcsTonQuantity')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="조사대상취급량기준_정량값"
            name="prtrSwcsTonQuantity"
            v-model:value="chem.prtrSwcsTonQuantity"
          />
        </div>
        <div v-if="ifInput('prtrSwcsTonUnit')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="조사대상취급량기준_단위"
            name="prtrSwcsTonUnit"
            v-model:value="chem.prtrSwcsTonUnit"
          />
        </div>
      </template>
    </c-card>
    <c-card v-if="ifArea(5)" title="위험물" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div v-if="ifInput('dangerousContents')" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable"
            label="위험물내용"
            name="dangerousContents"
            v-model:value="chem.dangerousContents"
          />
        </div>
        <div v-if="ifInput('dangerousClass')" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable"
            label="위험물유별구분"
            name="dangerousClass"
            v-model:value="chem.dangerousClass"
          />
        </div>
        <div v-if="ifInput('dangerousProp')" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable"
            label="위험물성질"
            name="dangerousProp"
            v-model:value="chem.dangerousProp"
          />
        </div>
        <div v-if="ifInput('dangerousName')" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable"
            label="위험물품명"
            name="dangerousName"
            v-model:value="chem.dangerousName"
          />
        </div>
        <div v-if="ifInput('designatedQuantityDose')" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable"
            label="지정수량_정량값"
            name="designatedQuantityDose"
            v-model:value="chem.designatedQuantityDose"
          />
        </div>
        <div v-if="ifInput('designatedQuantityUnit')" class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <c-text
            :editable="editable"
            label="지정수량_단위"
            name="designatedQuantityUnit"
            v-model:value="chem.designatedQuantityUnit"
          />
        </div>
      </template>
    </c-card>
    <c-card v-if="ifArea(6)" title="노출기준" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div v-if="ifInput('psmAmount')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="공정안전관리 제조∙취급∙저장량(kg/일)"
            name="psmAmount"
            v-model:value="chem.psmAmount"
          />
        </div>
        <div v-if="ifInput('bei')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="생물학적노출기준(단위포함 Full text)"
            name="bei"
            v-model:value="chem.bei"
          />
        </div>
        <div v-if="ifInput('sensitization')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="과민성 여부 입력(고용노동부, ACGIH 등)"
            name="sensitization"
            v-model:value="chem.sensitization"
          />
        </div>
        <div v-if="ifInput('simpleAsphyxiants')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="질식제 여부 입력(ACGIH, EU 노출기준 등)"
            name="simpleAsphyxiants"
            v-model:value="chem.simpleAsphyxiants"
          />
        </div>
        <div v-if="ifInput('skinNotations')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="피부영향 여부 입력(고용노동부, ACGIH 등)"
            name="skinNotations"
            v-model:value="chem.skinNotations"
          />
        </div>
        <div v-if="ifInput('basisCriticalEffects')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="표적장기 입력(예, 간, 신장 등)"
            name="basisCriticalEffects"
            v-model:value="chem.basisCriticalEffects"
          />
        </div>
        <div v-if="ifInput('twaPpm')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="TWA 노출기준입력 ppm"
            name="twaPpm"
            v-model:value="chem.twaPpm"
          />
        </div>
        <div v-if="ifInput('twaMm')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="TWA 노출기준입력 mg/m3"
            name="twaMm"
            v-model:value="chem.twaMm"
          />
        </div>
        <div v-if="ifInput('stelPpm')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="STEL 노출기준입력 ppm"
            name="stelPpm"
            v-model:value="chem.stelPpm"
          />
        </div>
        <div v-if="ifInput('stelMm')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="STEL 노출기준입력 mg/m3"
            name="stelMm"
            v-model:value="chem.stelMm"
          />
        </div>
        <div v-if="ifInput('ceilingsPpm')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="Celling 노출기준입력 ppm"
            name="ceilingsPpm"
            v-model:value="chem.ceilingsPpm"
          />
        </div>
        <div v-if="ifInput('ceilingsMm')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="Celling 노출기준입력 mg/m3"
            name="ceilingsMm"
            v-model:value="chem.ceilingsMm"
          />
        </div>
        <div v-if="ifInput('lelPpm')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="LEL노출기준입력 ppm"
            name="lelPpm"
            v-model:value="chem.lelPpm"
          />
        </div>
        <div v-if="ifInput('lelMm')" class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
          <c-text
            :editable="editable"
            label="LEL노출기준입력 mg/m3"
            name="lelMm"
            v-model:value="chem.lelMm"
          />
        </div>
      </template>
    </c-card>
    <c-card v-if="ifArea(7)" title="그 외" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div v-if="ifInput('remark1')" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-textarea
            :editable="editable"
            label="고시내용 외 참조내용 입력(예, CMR, PBT 등)"
            name="remark1"
            v-model:value="chem.remark1"
          />
        </div>
        <div v-if="ifInput('remark2')" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-textarea
            :editable="editable"
            label="적용기준, 고시내용 외 추가 참조사항 입력"
            name="remark2"
            v-model:value="chem.remark2"
          />
        </div>
        <div v-if="ifInput('remark3')" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <c-textarea
            :editable="editable"
            label="기타 참조사항"
            name="remark3"
            v-model:value="chem.remark3"
          />
        </div>
      </template>
    </c-card>
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
import { chemBaseColumnSettingType, chemBaseDetailLiteralType, chemBaseType } from './chemBase'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemBaseDetailInfo'
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
  // code setting
  // list setting
}
/******************************
 * TODO (목적): input 표시 여부 확인
 * @param (1): input 이름
 * @return (반환): input 표시 여부
 *******************************/
function ifInput(name: chemBaseDetailLiteralType) {
  return props.chem[`${name}Disabled`]
}
/******************************
 * TODO (목적): 영역 표시 확인
 * @param (1): 영역 index
 * @return (반환): 영역 표시 여부
 *******************************/
function ifArea(type: number) {
  const _area = [
    {
      type: 1,
      col: [
        'boilingPoint',
        'hrCodeGrade',
        'hcode',
        'rcode',
        'cmrFlag',
        'carcinogens',
        'mutagens',
        'reproductiveToxins',
        'maleficenceForm',
        'maleficenceValue',
        'maleficenceGrade',
        'maleficenceType'
      ]
    },
    {
      type: 2,
      col: ['restrictions', 'prohibited', 'accidentManuQuantity', 'accidentStoreQuantity']
    },
    {
      type: 3,
      col: [
        'exclusionConditions',
        'exclusionConditionSign',
        'exclusionConditionQuantity',
        'exclusionConditionUnit'
      ]
    },
    {
      type: 4,
      col: [
        'prtrGroupId',
        'prtrMaterialName',
        'prtrSwcsWt',
        'prtrSwcsWtSign',
        'prtrSwcsWtQuantity',
        'prtrSwcsWtUnit',
        'prtrSwcsTon',
        'prtrSwcsTonSign',
        'prtrSwcsTonQuantity',
        'prtrSwcsTonUnit'
      ]
    },
    {
      type: 5,
      col: [
        'dangerousContents',
        'dangerousClass',
        'dangerousProp',
        'dangerousName',
        'designatedQuantityDose',
        'designatedQuantityUnit'
      ]
    },
    {
      type: 6,
      col: [
        'psmAmount',
        'bei',
        'sensitization',
        'simpleAsphyxiants',
        'skinNotations',
        'basisCriticalEffects',
        'twaPpm',
        'twaMm',
        'stelPpm',
        'stelMm',
        'ceilingsPpm',
        'ceilingsMm',
        'lelPpm',
        'lelMm'
      ]
    },
    {
      type: 7,
      col: ['remark1', 'remark2', 'remark3']
    }
  ]
  const _cols = _.find(_area, { type: type })
  if (_cols) {
    return _.size(
      _.filter(_cols.col, (col) => {
        const disabledColumnKey = col as chemBaseDetailLiteralType
        return props.chem[`${disabledColumnKey}Disabled`]
      })
    ) > 0
      ? true
      : false
  } else {
    return false
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
