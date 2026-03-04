<template>
  <div>
    <q-form ref="editForm">
      <c-card
        title="개정"
        class="cardClassDetailForm revisionLayout"
        topClass="topcolor-orange"
        v-if="isOld"
      >
        <template v-slot:card-detail>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-1">
            <c-text
              :required="editable && rev.isRevision"
              :editable="editable && rev.isRevision"
              label="개정번호"
              name="revisionNum"
              v-model:value="sop.revisionNum"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-4 col-lg-2">
            <c-text
              :editable="false"
              label="개정일시"
              name="regDtStr"
              v-model:value="sop.regDtStr"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-2 col-lg-1">
            <c-text
              :editable="false"
              label="개정자"
              name="regUserName"
              v-model:value="sop.regUserName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <c-moc
              :editable="editable && rev.isRevision"
              :isSubmit="saveCallData"
              :document="sop"
              :documentId="popupParam.mdmSopId"
              documentTitle="diagramTitle"
              label="MOC번호"
              name="sopMocId"
              v-model:value="sop.sopMocId"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
            <c-text
              :required="editable && rev.isRevision"
              :editable="editable && rev.isRevision"
              label="개정사유"
              name="revisionContent"
              v-model:value="sop.revisionContent"
            />
          </div>
        </template>
      </c-card>
      <c-card title="작업정보" class="cardClassDetailForm">
        <template v-slot:card-select>
          <c-select
            v-if="isOld"
            :editable="editable && !rev.isRevision"
            :comboItems="sop.revs"
            type="custom"
            typetext="개정이력"
            itemText="revisionNum"
            itemValue="mdmSopId"
            label=""
            name="revSelectValue"
            v-model:value="sop.revSelectValue"
          />
        </template>
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-qr-btn
              v-if="editable && isOld && !rev.isRevision"
              :mobileUrl="'/mdm/pim/sopManage?mdmSopId=' + popupParam.mdmSopId"
              text-color="white"
            />
            <c-btn v-show="editable && isOld && !rev.isRevision" label="개정" icon="restart_alt" />
            <c-btn
              v-show="editable && isOld && rev.isRevision"
              label="개정취소"
              icon="restart_alt"
            />
            <c-btn v-if="editable" label="일괄저장" icon="save" />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :required="true"
              :editable="editable"
              label="작업명"
              name="sopName"
              v-model:value="sop.sopName"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-multi-select
              codeGroupCd="WO_RISK_FACTOR"
              :editable="editable"
              :isArray="false"
              itemText="codeName"
              itemValue="code"
              maxValues="3"
              name="accidentKindCd"
              label="재해유형"
              v-model:value="sop.accidentKindCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-multi-select
              codeGroupCd="WO_RISK_FACTOR"
              :editable="editable"
              :isArray="false"
              itemText="codeName"
              itemValue="code"
              maxValues="3"
              name="accidentKindCd2"
              label="상해종류"
              v-model:value="sop.accidentKindCd2"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
            <c-multi-select
              codeGroupCd="SOP_SUPPLEMENT_WORK_TYPE_CD"
              :editable="editable"
              :isArray="false"
              itemText="codeName"
              itemValue="code"
              maxValues="3"
              name="accidentKindCd3"
              label="작업종류"
              v-model:value="sop.accidentKindCd3"
            />
          </div>
        </template>
      </c-card>
      <c-table
        ref="attendeeTable"
        title="JSA 평가 수행팀/최종승인자 목록"
        :columns="gridTest1.columns"
        :data="gridTest1.data"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        gridHeightAuto
        :isExcelDown="false"
        :hideBottom="true"
        :editable="editable"
        selection="multiple"
        rowKey="tbmAttendeeId"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn :showLoading="false" label="추가" icon="add" />
            <c-btn :showLoading="false" label="제외" icon="remove" />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props, col }">
          <template v-if="col.name === 'click'">
            <q-btn round unelevated size="10px" color="amber" icon="mode">
              <q-popup-proxy
                :ref="
                  (el: any) => {
                    proxies[props.rowIndex] = el
                  }
                "
                :breakpoint="400"
              >
                <component
                  :is="col.component"
                  :outFlag="true"
                  :popupParam="props.row"
                  :data="sop"
                  :rowIndex="props.rowIndex"
                />
              </q-popup-proxy>
            </q-btn>
          </template>
        </template>
      </c-table>
      <c-card title="취급물질 정보" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <div class="row">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="취급약품"
                  :rows="2"
                  name="test1"
                  v-model:value="sop.test1"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="그림문자"
                  :rows="2"
                  name="test2"
                  v-model:value="sop.test2"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="유해 · 위험성"
                  :rows="2"
                  name="test3"
                  v-model:value="sop.test3"
                />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="응급조치요령"
                  :rows="2"
                  name="test4"
                  v-model:value="sop.test4"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <c-table
              ref="attendeeTable"
              title="구성성분/함유량 목록"
              :columns="gridTest2.columns"
              :data="gridTest2.data"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              gridHeightAuto
              :isExcelDown="false"
              :hideBottom="true"
              :editable="editable"
              selection="multiple"
              rowKey="tbmAttendeeId"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn :showLoading="false" label="추가" icon="add" />
                  <c-btn :showLoading="false" label="제외" icon="remove" />
                </q-btn-group>
              </template>
              <template v-slot:customArea="{ props, col }">
                <template v-if="col.name === 'click'">
                  <q-btn round unelevated size="10px" color="amber" icon="mode">
                    <q-popup-proxy
                      :ref="
                        (el: any) => {
                          proxies[props.rowIndex] = el
                        }
                      "
                      :breakpoint="400"
                    >
                      <component
                        :is="col.component"
                        :outFlag="true"
                        :popupParam="props.row"
                        :data="sop"
                        :rowIndex="props.rowIndex"
                      />
                    </q-popup-proxy>
                  </q-btn>
                </template>
              </template>
            </c-table>
          </div>
        </template>
      </c-card>
      <c-table
        ref="table"
        title="위험요소 및 추가 개선사항 목록"
        gridHeightAuto
        :merge="gridTest3.merge"
        :columns="gridTest3.columns"
        :data="gridTest3.data"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :editable="editable && !rev.isRevision"
        :isExcelDown="false"
        :isFullScreen="false"
        selection="multiple"
        rowKey="jobStepId"
      >
        <template v-slot:table-chip>
          <span class="text-teal q-ml-lg"
            >{{
              '※ 특이사항(작업단계 외 발생 가능한 유해위험요인 및 안전대책 등의 추가 개선사항 기록)'
            }}
          </span>
        </template>
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable && !rev.isRevision" label="추가" icon="add" />
            <c-btn v-if="editable && !rev.isRevision" label="제외" icon="remove" />
          </q-btn-group>
        </template>
      </c-table>
      <c-table
        ref="table"
        title="작업절차 목록"
        gridHeightAuto
        :merge="grid.merge"
        :columns="grid.columns"
        :data="grid.data"
        :filtering="false"
        :columnSetting="false"
        :usePaging="false"
        :editable="editable && !rev.isRevision"
        :isExcelDown="false"
        :isFullScreen="false"
        selection="multiple"
        rowKey="jobStepId"
      >
        <template v-slot:table-chip>
          <span class="text-teal q-ml-lg"
            >{{ '(JSA 평가 작성 시 작업단계(Step)를 반드시 6단계 이상 분류하여 작성실시)' }}
          </span>
        </template>
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable && !rev.isRevision" label="추가" icon="add" />
            <c-btn v-if="editable && !rev.isRevision" label="제외" icon="remove" />
          </q-btn-group>
        </template>
      </c-table>
      <c-card title="업체 정보" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <c-task-target
              :editable="editable"
              :customPopupParam="{ targetKey: 'vendor' }"
              label="공사업체"
              name="test5"
              v-model:value="sop.test5"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <c-table
              ref="attendeeTable"
              title="JSA 교육 이수자(도급업체)"
              :columns="gridTest4.columns"
              :data="gridTest4.data"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              gridHeightAuto
              :isExcelDown="false"
              :hideBottom="true"
              :editable="editable"
              selection="multiple"
              rowKey="tbmAttendeeId"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn :showLoading="false" label="추가" icon="add" />
                  <c-btn :showLoading="false" label="제외" icon="remove" />
                </q-btn-group>
              </template>
              <template v-slot:customArea="{ props, col }">
                <template v-if="col.name === 'click'">
                  <q-btn round unelevated size="10px" color="amber" icon="mode">
                    <q-popup-proxy
                      :ref="
                        (el: any) => {
                          proxies[props.rowIndex] = el
                        }
                      "
                      :breakpoint="400"
                    >
                      <component
                        :is="col.component"
                        :outFlag="true"
                        :popupParam="props.row"
                        :data="sop"
                        :rowIndex="props.rowIndex"
                      />
                    </q-popup-proxy>
                  </q-btn>
                </template>
              </template>
            </c-table>
          </div>
        </template>
      </c-card>
    </q-form>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'sopInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
    mdmSopId: stringNull
  }
  rev: {
    isRevision: boolean
  }
  sop: any
  isOld: boolean
  contentHeight: stringNull | numberNull
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
      mdmSopId: ''
    }
  },
  sop: () => {
    return {
      mdmSopId: '', // 안전작업 표준 일련번호
      plantCd: null, // 사업장코드
      subProcessCd: '', // 단위공정 코드
      sopNo: '', // 안전작업 표준 번호
      sopName: '', // 세부공정(작업) 명
      revNo: '', // 개정번호
      revReason: '', // 개정사유
      applyRange: '', // 적용범위
      purpose: '', // 목적
      hazardGradeCd: null, // 위험등급 1 ~ 5등급
      workTypeCd: null, // 작업유형 : 특별안전, 일반안전, 단순일상
      workKindCd: null, // 작업형태 : Gas, 고소, 굴착/매설, 방사선, 전기, 지게차, 기타
      workClassCd: null, // 작업구분 : Set-up, PM, BM, Part교체, 기타
      workerName: '', // 작업자
      managementDepts: '', // 관리부서 복수
      managementDepts2: '', // 관리부서 복수
      saftyShied: '', // 안전보호구
      saftyCaution: '', // 안전주의사항
      ramRiskHazardTechniqueCd: null,
      sopMocId: '',
      useFlag: 'Y', // 사용여부
      revisionNum: '',
      groupId: '',
      sysRevision: 1,
      revisionContent: '제정',
      regDtStr: '',
      regUserName: '',
      regUserId: '',
      chgUserId: '',
      revSelectValue: null,
      sopSteps: [], // 작업단계 목록
      revs: [], // 개정 목록
      mmEquips: [], // 설비 목록
      mmMachines: [], // 기계기구 목록
      chems: [], // 화학자재 목록
      sopSummary: [], // 요약정보
      sopStepHazards: [] // 작업단계 (w/h. 유해위험요인)
    }
  },
  rev: () => {
    return {
      isRevision: false
    }
  },
  isOld: false,
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const proxies = ref<any>([])
const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<any>({
  merge: [],
  columns: [
    {
      name: 'no',
      field: 'no',
      label: '구분',
      sortable: false,
      type: 'number',
      style: 'width: 60px'
    },
    {
      name: 'sopStep',
      field: 'sopStep',
      label: '작업단계(Steps)',
      align: 'left',
      sortable: false,
      type: 'textarea',
      style: 'width: 300px'
    },
    {
      name: 'hazard',
      field: 'hazard',
      label: '유해위험요인',
      align: 'left',
      type: 'textarea',
      sortable: false,
      style: 'width: 450px'
    },
    {
      name: 'safety',
      field: 'safety',
      label: '안전작업방법(안전대책) (Controls)',
      align: 'left',
      type: 'textarea',
      sortable: false,
      style: 'width: 450px'
    },
    {
      name: 'before',
      field: 'before',
      label: '위험도',
      align: 'center',
      child: [
        {
          name: 'beforeFrequency',
          field: 'beforeFrequency',
          label: '빈도',
          type: 'text',
          align: 'center',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'beforeStrength',
          field: 'beforeStrength',
          label: '강도',
          type: 'text',
          align: 'center',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'beforeRisk',
          field: 'beforeRisk',
          label: '위험도',
          type: 'text',
          align: 'center',
          style: 'width:60px',
          sortable: false
        }
      ]
    },
    {
      name: 'hazardOccurReason',
      field: 'hazardOccurReason',
      label: '개인보호구 및 안전장비',
      align: 'left',
      type: 'text',
      sortable: false,
      style: 'width: 150px'
    },
    {
      name: 'test2',
      field: 'test2',
      label: '확인부서',
      type: 'text',
      align: 'left',
      sortable: false,
      style: 'width: 100px'
    },
    {
      name: 'test3',
      field: 'test3',
      label: '담당자',
      type: 'text',
      align: 'left',
      sortable: false,
      style: 'width: 100px'
    }
  ],
  data: [
    {
      no: 1,
      sopStep: '작업 자재 및 공구 운반',
      hazard: '■ 작업범위 설정을 통한 보행자 충돌 및 전도사고 예방',
      safety: '■ 작업자재 및 공구 운반 시 이동 대차 사용 <br>■ 작업자 안전 보호구 착용',
      beforeFrequency: '2',
      beforeStrength: '1',
      beforeRisk: '2',
      hazardOccurReason: '안전모, 안전화, 안전장갑',
      test2: '총무그룹',
      test3: '송지수'
    },
    {
      no: 2,
      sopStep: '고소작업',
      hazard: '■ 스카이 작업 시 추락 위험',
      safety:
        '■ 작업지역 안전봉 및 안전띠 설치로 작업구역 설정 <br> ■ 안전모, 안전화, 안전장갑 착용 <br> ■ 안전작업허가서 비치',
      beforeFrequency: '1',
      beforeStrength: '3',
      beforeRisk: '3',
      hazardOccurReason: '안전모, 안전화, 안전장갑, 안전대',
      test2: '총무그룹',
      test3: '송지수'
    },
    {
      no: 3,
      sopStep: '작업 구역 정리',
      hazard: '■ 작업지역 공사 자재 미정리로 인한 충돌 및 부상위험',
      safety: '■ 안전화, 안전모, 안전장갑 착용 <br> ■ 작업지역 공사 관계자 외 출입금지',
      beforeFrequency: '1',
      beforeStrength: '1',
      beforeRisk: '1',
      hazardOccurReason: '안전모, 안전화, 안전장갑, 입간판, 작업 등',
      test2: '총무그룹',
      test3: '송지수'
    }
  ]
})

const gridTest1 = ref<any>({
  merge: [{ index: 0, colName: 'test0' }],
  columns: [
    {
      name: 'test0',
      field: 'test0',
      label: '구분',
      align: 'left',
      sortable: false
    },
    {
      name: 'test1',
      field: 'test1',
      label: '부서',
      align: 'left',
      sortable: false
    },
    {
      name: 'test2',
      field: 'test2',
      label: '성명',
      align: 'left',
      sortable: false
    },
    {
      name: 'test3',
      field: 'test3',
      label: '직책(직급)',
      align: 'left',
      sortable: false
    },
    {
      name: 'click',
      field: 'click',
      label: '서명',
      style: 'width:60px',
      type: 'custom',
      align: 'center',
      sortable: false,
      visible: true,
      component: shallowRef(defineAsyncComponent(() => import(`./signaturePop.vue`)))
    }
  ],
  data: [
    {
      test0: 'JSA 평가 수행팀',
      test1: '총무그룹',
      test2: '박승호',
      test3: '프로',
      test4: ''
    },
    {
      test0: 'JSA 평가 수행팀',
      test1: '총무그룹',
      test2: '박선우',
      test3: '프로',
      test4: ''
    },
    {
      test0: 'JSA 평가 수행팀',
      test1: '총무그룹',
      test2: '송지수',
      test3: '프로',
      test4: ''
    },
    {
      test0: 'JSA 평가 최종승인자',
      test1: '총무그룹',
      test2: '박승호',
      test3: '그룹장',
      test4: ''
    }
  ]
})

const gridTest2 = ref<any>({
  columns: [
    {
      name: 'test0',
      field: 'test0',
      label: '물질명',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'test1',
      field: 'test1',
      label: '함유량',
      align: 'left',
      type: 'text',
      sortable: false
    }
  ],
  data: [
    {
      test0: '염화 나트륨 (sodium chloride)',
      test1: '50%'
    },
    {
      test0: '염화칼륨 (Potassium Chloride)',
      test1: '20%'
    },
    {
      test0: '에탄올(Ethanol)',
      test1: '30%'
    }
  ]
})

const gridTest3 = ref<any>({
  columns: [
    {
      name: 'test0',
      field: 'test0',
      label: '위험요소',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'test1',
      field: 'test1',
      label: '추가 안전대책',
      align: 'left',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'test2',
      field: 'test2',
      label: '조치일정',
      align: 'center',
      type: 'date',
      style: 'width:200px',
      sortable: false
    },
    {
      name: 'test3',
      field: 'test3',
      label: '담당자',
      align: 'center',
      style: 'width:200px',
      type: 'text',
      sortable: false
    }
  ],
  data: [
    {
      test0: '작업 간 공구 이동 시 전도 주의',
      test1: '■ 관리감독자 감시 철저 <br> ■ 작업자안전보호구 착용 철저',
      test2: '2025-10-17',
      test3: '안다미컴퍼니'
    },
    {
      test0: '작업 간 장비 충돌 주의',
      test1: '■ 감독자 감시 철저 및 보호구 착용',
      test2: '2025-10-17',
      test3: '안다미컴퍼니'
    }
  ]
})

const gridTest4 = ref<any>({
  columns: [
    {
      name: 'test2',
      field: 'test2',
      label: '직책(직급)',
      align: 'center',
      type: 'text',
      sortable: false
    },
    {
      name: 'test3',
      field: 'test3',
      label: '성명',
      align: 'center',
      type: 'text',
      sortable: false
    },
    {
      name: 'click',
      field: 'click',
      label: '서명',
      style: 'width:150px',
      type: 'custom',
      align: 'center',
      sortable: false,
      visible: true,
      component: shallowRef(defineAsyncComponent(() => import(`./signaturePop.vue`)))
    },
    {
      name: 'test4',
      field: 'test4',
      label: '직책(직급)',
      align: 'center',
      type: 'text',
      sortable: false
    },
    {
      name: 'test5',
      field: 'test5',
      type: 'text',
      label: '성명',
      align: 'center',
      sortable: false
    },
    {
      name: 'click',
      field: 'click',
      label: '서명',
      style: 'width:150px',
      type: 'custom',
      align: 'center',
      sortable: false,
      visible: true,
      component: shallowRef(defineAsyncComponent(() => import(`./signaturePop.vue`)))
    }
  ],
  data: [
    {
      test2: '사원',
      test3: '김길동',
      test4: '대리',
      test5: '김대리'
    },
    {
      test2: '사원',
      test3: '이길동',
      test4: '대리',
      test5: '이대리'
    },
    {
      test2: '사원',
      test3: '홍길동',
      test4: '과장',
      test5: '홍과장'
    },
    {
      test2: '사원',
      test3: '정길동',
      test4: '과장',
      test5: '정과장'
    },
    {
      test2: '사원',
      test3: '엄길동',
      test4: '대리',
      test5: '엄대리'
    },
    {
      test2: '사원',
      test3: '강길동',
      test4: '대리',
      test5: '강대리'
    }
  ]
})
const editForm = ref<HTMLFormElement | null>(null)
const table = ref<any>(null)
const saveCallData = ref('')

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
  console.log(props.contentHeight)
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
