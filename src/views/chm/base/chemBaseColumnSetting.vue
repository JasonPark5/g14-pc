<template>
  <q-form ref="editForm">
    <c-card title="화학물질 컬럼 정보" class="cardClassDetailForm chemBaseColumnSettingCard">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="columnSetting"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveInfo"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-12">
          <c-table
            title=""
            :columns="checkGrid.columns"
            :data="checkGrid.data"
            customDataTr
            gridHeightAuto
            hideHeader
            hideBottom
            hideBorder
            isDense
            :isTitle="false"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
          >
            <template v-slot:customDataTr="props">
              <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-th-style"
                  :rowspan="1"
                  :colspan="6"
                >
                  <span>
                    {{ $language('위험성평가') }}
                  </span>
                </q-td>
              </q-tr>
              <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :disabled="true"
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="끓는점(℃)"
                    falseLabel="끓는점(℃)"
                    name="boilingPoint"
                    v-model:value="columnSetting.boilingPoint"
                  />
                  <c-checkbox
                    :disabled="true"
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="위험문구/유해위험문구 등급"
                    falseLabel="위험문구/유해위험문구 등급"
                    name="hrCodeGrade"
                    v-model:value="columnSetting.hrCodeGrade"
                  />
                  <c-checkbox
                    :disabled="true"
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="유해･위험문구"
                    falseLabel="유해･위험문구"
                    name="hcode"
                    v-model:value="columnSetting.hcode"
                  />
                  <c-checkbox
                    :disabled="true"
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="위험문구"
                    falseLabel="위험문구"
                    name="rcode"
                    v-model:value="columnSetting.rcode"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :disabled="true"
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="CMR 물질 여부"
                    falseLabel="CMR 물질 여부"
                    name="cmrFlag"
                    v-model:value="columnSetting.cmrFlag"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="발암성물질"
                    falseLabel="발암성물질"
                    name="carcinogens"
                    v-model:value="columnSetting.carcinogens"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="변이원성물질"
                    falseLabel="변이원성물질"
                    name="mutagens"
                    v-model:value="columnSetting.mutagens"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="생식독성물질"
                    falseLabel="생식독성물질"
                    name="reproductiveToxins"
                    v-model:value="columnSetting.reproductiveToxins"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :disabled="true"
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="유해성 발생형태"
                    falseLabel="유해성 발생형태"
                    name="maleficenceForm"
                    v-model:value="columnSetting.maleficenceForm"
                  />
                  <c-checkbox
                    :disabled="true"
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="유해성 측정값"
                    falseLabel="유해성 측정값"
                    name="maleficenceValue"
                    v-model:value="columnSetting.maleficenceValue"
                  />
                  <c-checkbox
                    :disabled="true"
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="비산성 등급"
                    falseLabel="비산성 등급"
                    name="maleficenceGrade"
                    v-model:value="columnSetting.maleficenceGrade"
                  />
                  <c-checkbox
                    :disabled="true"
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="비산/휘발성 구분"
                    falseLabel="비산/휘발성 구분"
                    name="maleficenceType"
                    v-model:value="columnSetting.maleficenceType"
                  />
                </q-td>
              </q-tr>
            </template>
          </c-table>
        </div>
        <div class="col-12">
          <c-table
            title=""
            :columns="checkGrid.columns"
            :data="checkGrid.data"
            customDataTr
            gridHeightAuto
            hideHeader
            hideBottom
            hideBorder
            isDense
            :isTitle="false"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
          >
            <template v-slot:customDataTr="props">
              <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-th-style"
                  :rowspan="1"
                  :colspan="6"
                >
                  <span>
                    {{ $language('유해화학물질') }}
                  </span>
                </q-td>
              </q-tr>
              <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="제한사항"
                    falseLabel="제한사항"
                    name="restrictions"
                    v-model:value="columnSetting.restrictions"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="금지사항"
                    falseLabel="금지사항"
                    name="prohibited"
                    v-model:value="columnSetting.prohibited"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="사고대비물질_제조사용 지정수량(Kg)"
                    falseLabel="사고대비물질_제조사용 지정수량(Kg)"
                    name="accidentManuQuantity"
                    v-model:value="columnSetting.accidentManuQuantity"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="사고대비물질_보관저장 지정수량(kg)"
                    falseLabel="사고대비물질_보관저장 지정수량(kg)"
                    name="accidentStoreQuantity"
                    v-model:value="columnSetting.accidentStoreQuantity"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                />
              </q-tr>
            </template>
          </c-table>
        </div>
        <div class="col-12">
          <c-table
            title=""
            :columns="checkGrid.columns"
            :data="checkGrid.data"
            customDataTr
            gridHeightAuto
            hideHeader
            hideBottom
            hideBorder
            isDense
            :isTitle="false"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
          >
            <template v-slot:customDataTr="props">
              <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-th-style"
                  :rowspan="1"
                  :colspan="6"
                >
                  <span>
                    {{ $language('제외조건') }}
                  </span>
                </q-td>
              </q-tr>
              <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="내용"
                    falseLabel="내용"
                    name="exclusionConditions"
                    v-model:value="columnSetting.exclusionConditions"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="부등호"
                    falseLabel="부등호"
                    name="exclusionConditionSign"
                    v-model:value="columnSetting.exclusionConditionSign"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="정량값"
                    falseLabel="정량값"
                    name="exclusionConditionQuantity"
                    v-model:value="columnSetting.exclusionConditionQuantity"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="단위"
                    falseLabel="단위"
                    name="exclusionConditionUnit"
                    v-model:value="columnSetting.exclusionConditionUnit"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                />
              </q-tr>
            </template>
          </c-table>
        </div>
        <div class="col-12">
          <c-table
            title=""
            :columns="checkGrid.columns"
            :data="checkGrid.data"
            customDataTr
            gridHeightAuto
            hideHeader
            hideBottom
            hideBorder
            isDense
            :isTitle="false"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
          >
            <template v-slot:customDataTr="props">
              <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-th-style"
                  :rowspan="1"
                  :colspan="6"
                >
                  <span> PRTR </span>
                </q-td>
              </q-tr>
              <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="Group_ID"
                    falseLabel="Group_ID"
                    name="prtrGroupId"
                    v-model:value="columnSetting.prtrGroupId"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="물질명"
                    falseLabel="물질명"
                    name="prtrMaterialName"
                    v-model:value="columnSetting.prtrMaterialName"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="조사대상무게함유기준(wt%)"
                    falseLabel="조사대상무게함유기준(wt%)"
                    name="prtrSwcsWt"
                    v-model:value="columnSetting.prtrSwcsWt"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="조사대상무게함유기준_부등호"
                    falseLabel="조사대상무게함유기준_부등호"
                    name="prtrSwcsWtSign"
                    v-model:value="columnSetting.prtrSwcsWtSign"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="조사대상무게함유기준_정량값"
                    falseLabel="조사대상무게함유기준_정량값"
                    name="prtrSwcsWtQuantity"
                    v-model:value="columnSetting.prtrSwcsWtQuantity"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="조사대상무게함유기준_단위"
                    falseLabel="조사대상무게함유기준_단위"
                    name="prtrSwcsWtUnit"
                    v-model:value="columnSetting.prtrSwcsWtUnit"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="조사대상취급량기준(톤/년)"
                    falseLabel="조사대상취급량기준(톤/년)"
                    name="prtrSwcsTon"
                    v-model:value="columnSetting.prtrSwcsTon"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="조사대상취급량기준_부등호"
                    falseLabel="조사대상취급량기준_부등호"
                    name="prtrSwcsTonSign"
                    v-model:value="columnSetting.prtrSwcsTonSign"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="조사대상취급량기준_정량값"
                    falseLabel="조사대상취급량기준_정량값"
                    name="prtrSwcsTonQuantity"
                    v-model:value="columnSetting.prtrSwcsTonQuantity"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="조사대상취급량기준_단위"
                    falseLabel="조사대상취급량기준_단위"
                    name="prtrSwcsTonUnit"
                    v-model:value="columnSetting.prtrSwcsTonUnit"
                  />
                </q-td>
              </q-tr>
            </template>
          </c-table>
        </div>
        <div class="col-12">
          <c-table
            title=""
            :columns="checkGrid.columns"
            :data="checkGrid.data"
            customDataTr
            gridHeightAuto
            hideHeader
            hideBottom
            hideBorder
            isDense
            :isTitle="false"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
          >
            <template v-slot:customDataTr="props">
              <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-th-style"
                  :rowspan="1"
                  :colspan="6"
                >
                  <span>
                    {{ $language('위험물') }}
                  </span>
                </q-td>
              </q-tr>
              <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="위험물내용"
                    falseLabel="위험물내용"
                    name="dangerousContents"
                    v-model:value="columnSetting.dangerousContents"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="위험물유별구분"
                    falseLabel="위험물유별구분"
                    name="dangerousClass"
                    v-model:value="columnSetting.dangerousClass"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="위험물성질"
                    falseLabel="위험물성질"
                    name="dangerousProp"
                    v-model:value="columnSetting.dangerousProp"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="위험물품명"
                    falseLabel="위험물품명"
                    name="dangerousName"
                    v-model:value="columnSetting.dangerousName"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="지정수량_정량값"
                    falseLabel="지정수량_정량값"
                    name="designatedQuantityDose"
                    v-model:value="columnSetting.designatedQuantityDose"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="지정수량_단위"
                    falseLabel="지정수량_단위"
                    name="designatedQuantityUnit"
                    v-model:value="columnSetting.designatedQuantityUnit"
                  />
                </q-td>
              </q-tr>
            </template>
          </c-table>
        </div>
        <div class="col-12">
          <c-table
            title=""
            :columns="checkGrid.columns"
            :data="checkGrid.data"
            customDataTr
            gridHeightAuto
            hideHeader
            hideBottom
            hideBorder
            isDense
            :isTitle="false"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
          >
            <template v-slot:customDataTr="props">
              <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-th-style"
                  :rowspan="1"
                  :colspan="6"
                >
                  <span>
                    {{ $language('노출기준') }}
                  </span>
                </q-td>
              </q-tr>
              <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="공정안전관리 제조∙취급∙저장량(kg/일)"
                    falseLabel="공정안전관리 제조∙취급∙저장량(kg/일)"
                    name="psmAmount"
                    v-model:value="columnSetting.psmAmount"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="생물학적노출기준(단위포함 Full text)"
                    falseLabel="생물학적노출기준(단위포함 Full text)"
                    name="bei"
                    v-model:value="columnSetting.bei"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="과민성 여부 입력(고용노동부, ACGIH 등)"
                    falseLabel="과민성 여부 입력(고용노동부, ACGIH 등)"
                    name="sensitization"
                    v-model:value="columnSetting.sensitization"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="질식제 여부 입력(ACGIH, EU 노출기준 등)"
                    falseLabel="질식제 여부 입력(ACGIH, EU 노출기준 등)"
                    name="simpleAsphyxiants"
                    v-model:value="columnSetting.simpleAsphyxiants"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="피부영향 여부 입력(고용노동부, ACGIH 등)"
                    falseLabel="피부영향 여부 입력(고용노동부, ACGIH 등)"
                    name="skinNotations"
                    v-model:value="columnSetting.skinNotations"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="표적장기 입력(예, 간, 신장 등)"
                    falseLabel="표적장기 입력(예, 간, 신장 등)"
                    name="basisCriticalEffects"
                    v-model:value="columnSetting.basisCriticalEffects"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="TWA 노출기준입력(only 숫자만) ppm"
                    falseLabel="TWA 노출기준입력(only 숫자만) ppm"
                    name="twaPpm"
                    v-model:value="columnSetting.twaPpm"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="TWA 노출기준입력(only 숫자만) mg/m3"
                    falseLabel="TWA 노출기준입력(only 숫자만) mg/m3"
                    name="twaMm"
                    v-model:value="columnSetting.twaMm"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="STEL 노출기준입력(only 숫자만) ppm"
                    falseLabel="STEL 노출기준입력(only 숫자만) ppm"
                    name="stelPpm"
                    v-model:value="columnSetting.stelPpm"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="STEL 노출기준입력(only 숫자만) mg/m3"
                    falseLabel="STEL 노출기준입력(only 숫자만) mg/m3"
                    name="stelMm"
                    v-model:value="columnSetting.stelMm"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="Celling 노출기준입력(only 숫자만) ppm"
                    falseLabel="Celling 노출기준입력(only 숫자만) ppm"
                    name="ceilingsPpm"
                    v-model:value="columnSetting.ceilingsPpm"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="Celling 노출기준입력(only 숫자만) mg/m3"
                    falseLabel="Celling 노출기준입력(only 숫자만) mg/m3"
                    name="ceilingsMm"
                    v-model:value="columnSetting.ceilingsMm"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="LEL노출기준입력(only 숫자만) ppm"
                    falseLabel="LEL노출기준입력(only 숫자만) ppm"
                    name="lelPpm"
                    v-model:value="columnSetting.lelPpm"
                  />
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="LEL노출기준입력(only 숫자만) mg/m3"
                    falseLabel="LEL노출기준입력(only 숫자만) mg/m3"
                    name="lelMm"
                    v-model:value="columnSetting.lelMm"
                  />
                </q-td>
              </q-tr>
            </template>
          </c-table>
        </div>
        <div class="col-12">
          <c-table
            title=""
            :columns="checkGrid.columns"
            :data="checkGrid.data"
            customDataTr
            gridHeightAuto
            hideHeader
            hideBottom
            hideBorder
            isDense
            :isTitle="false"
            :columnSetting="false"
            :isFullScreen="false"
            :isExcelDown="false"
            :filtering="false"
          >
            <template v-slot:customDataTr="props">
              <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-th-style"
                  :rowspan="1"
                  :colspan="6"
                >
                  <span>
                    {{ $language('그 외') }}
                  </span>
                </q-td>
              </q-tr>
              <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="고시내용 외 참조내용 입력(예, CMR, PBT 등)"
                    falseLabel="고시내용 외 참조내용 입력(예, CMR, PBT 등)"
                    name="remark1"
                    v-model:value="columnSetting.remark1"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="적용기준, 고시내용 외 추가 참조사항 입력"
                    falseLabel="적용기준, 고시내용 외 추가 참조사항 입력"
                    name="remark2"
                    v-model:value="columnSetting.remark2"
                  />
                </q-td>
                <q-td
                  class="text-center chem-column-setting-th-td-style chem-column-setting-td-style"
                  :rowspan="1"
                  :colspan="1"
                >
                  <c-checkbox
                    :editable="editable"
                    :isFlag="true"
                    trueLabel="기타 참조사항"
                    falseLabel="기타 참조사항"
                    name="remark3"
                    v-model:value="columnSetting.remark3"
                  />
                </q-td>
              </q-tr>
            </template>
          </c-table>
        </div>
      </template>
    </c-card>
  </q-form>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemBaseColumnSetting'
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

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const columnSetting = ref({
  boilingPoint: 'Y', // 끓는점
  cmrFlag: 'Y', // CMR 물질 여부
  carcinogens: 'N', // 발암성물질
  mutagens: 'N', // 변이원성물질
  reproductiveToxins: 'N', // 생식독성물질
  maleficenceForm: 'Y', // 유해성 발생형태
  maleficenceValue: 'Y', // 유해성 측정값
  maleficenceGrade: 'Y', // 비산성 등급
  maleficenceType: 'Y', // 비산/휘발성 구분
  hrCodeGrade: 'Y', // 위험문구/유해위험문구 등급
  hcode: 'Y', // 유해･위험문구
  rcode: 'Y', // 위험문구
  restrictions: 'N', // 제한사항
  prohibited: 'N', // 금지사항
  accidentManuQuantity: 'N', // 사고대비물질_제조사용 지정수량(Kg)
  accidentStoreQuantity: 'N', // 사고대비물질_보관저장 지정수량(kg)
  exclusionConditions: 'N', // 제외조건내용
  exclusionConditionSign: 'N', // 제외조건_부등호
  exclusionConditionQuantity: 'N', // 제외조건_정량값
  exclusionConditionUnit: 'N', // 제외조건_단위
  prtrGroupId: 'N', // PRTR_Group_ID
  prtrMaterialName: 'N', // PRTR_물질명
  prtrSwcsWt: 'N', // PRTR_조사대상무게함유기준(wt%)
  prtrSwcsWtSign: 'N', // PRTR_조사대상무게함유기준_부등호
  prtrSwcsWtQuantity: 'N', // PRTR_조사대상무게함유기준_정량값
  prtrSwcsWtUnit: 'N', // PRTR_조사대상무게함유기준_단위
  prtrSwcsTon: 'N', // PRTR_조사대상취급량기준(톤/년)
  prtrSwcsTonSign: 'N', // PRTR_조사대상취급량기준_부등호
  prtrSwcsTonQuantity: 'N', // PRTR_조사대상취급량기준_정량값
  prtrSwcsTonUnit: 'N', // PRTR_조사대상취급량기준_단위
  remark1: 'N', // 고시내용 외 참조내용 입력(예, CMR, PBT 등)
  dangerousContents: 'N', // 위험물내용
  dangerousClass: 'N', // 위험물유별구분
  dangerousProp: 'N', // 위험물성질
  dangerousName: 'N', // 위험물품명
  designatedQuantityDose: 'N', // 지정수량_정량값
  designatedQuantityUnit: 'N', // 지정수량_단위
  psmAmount: 'N', // 공정안전관리 제조∙취급∙저장량(kg/일)
  bei: 'N', // 생물학적노출기준(단위포함 Full text)
  sensitization: 'N', // 과민성 여부 입력(고용노동부, ACGIH 등)
  simpleAsphyxiants: 'N', // 질식제 여부 입력(ACGIH, EU 노출기준 등)
  skinNotations: 'N', // 피부영향 여부 입력(고용노동부, ACGIH 등)
  basisCriticalEffects: 'N', // 표적장기 입력(예, 간, 신장 등)
  twaPpm: 'N', // TWA 노출기준입력(only 숫자만) ppm
  twaMm: 'N', // TWA 노출기준입력(only 숫자만) mg/m3
  stelPpm: 'N', // STEL 노출기준입력(only 숫자만) ppm
  stelMm: 'N', // STEL 노출기준입력(only 숫자만) mg/m3
  ceilingsPpm: 'N', // Celling 노출기준입력(only 숫자만) ppm
  ceilingsMm: 'N', // Celling 노출기준입력(only 숫자만) mg/m3
  lelPpm: 'N', // LEL노출기준입력(only 숫자만) ppm
  lelMm: 'N', // LEL노출기준입력(only 숫자만) mg/m3
  remark2: 'N', // 적용기준, 고시내용 외 추가 참조사항 입력
  remark3: 'N', // 기타 참조사항
  regUserId: '',
  chgUserId: ''
})
const checkGrid = ref({
  columns: [
    { name: '1', field: '1' },
    { name: '2', field: '2' },
    { name: '3', field: '3' }
  ],
  data: [{}, {}]
})
const detailUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const editForm = ref<any>(null)

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
  detailUrl.value = selectConfig.chm.base.chemBaseColumnSetting.get.url
  saveUrl.value = transactionConfig.chm.base.chemBaseColumnSetting.save.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 화학물질 컬럼 조회
 *******************************/
function getList() {
  $http({
    url: detailUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    _.extend(columnSetting.value, _result.data)
  })
}
/******************************
 * TODO (목적): 화학물질 컬럼 저장 전 처리
 *******************************/
function saveInfo() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          columnSetting.value.regUserId = user.value.userId
          columnSetting.value.chgUserId = user.value.userId

          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
/******************************
 * TODO (목적): 화학물질 컬럼 후 처리
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
