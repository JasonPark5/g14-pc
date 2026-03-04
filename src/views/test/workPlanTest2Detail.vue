<template>
  <div>
    <q-form ref="editForm">
      <c-card title="작업정보" class="cardClassDetailForm">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="일괄저장" icon="save" />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-field
              :editable="editable"
              type="dept_spot_user"
              label="담당부서/직위/성명"
              name="userId"
              v-model:value="sop.userId"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="공사(작업)명"
              name="sopName"
              v-model:value="sop.sopName"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-datepicker
              :editable="editable"
              label="공사(작업)일"
              name="planDate"
              v-model:value="sop.planDate"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="공사(작업)인원"
              name="test1"
              type="number"
              v-model:value="sop.test1"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="공사(작업)장소"
              name="test2"
              v-model:value="sop.test2"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="공사(작업)내용"
              name="test3"
              v-model:value="sop.test3"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="공사(작업)공구"
              name="test4"
              v-model:value="sop.test4"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="설비(기기)명"
              name="test5"
              v-model:value="sop.test5"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="설비(기기)번호"
              name="test6"
              v-model:value="sop.test6"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="안전보호구"
              name="test7"
              v-model:value="sop.test7"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text :editable="editable" label="안전장비" name="test8" v-model:value="sop.test8" />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="공사(작업)공구"
              name="test9"
              v-model:value="sop.test9"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="협력업체명"
              name="test13"
              v-model:value="sop.test13"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="작업책임자 직책"
              name="test14"
              v-model:value="sop.test14"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="작업책임자 성명"
              name="test15"
              v-model:value="sop.test15"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
            <c-text
              :editable="editable"
              label="작업책임자 연락처"
              name="test16"
              v-model:value="sop.test16"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <c-checkbox
              :editable="editable"
              :isArray="false"
              :comboItems="[
                { code: '1', codeName: '해당없음' },
                { code: '2', codeName: '안전관리계획서' },
                { code: '3', codeName: '물질안전보건자료' },
                { code: '4', codeName: '자격취득(자격증)' },
                { code: '5', codeName: '밀폐공간운영프로그램' },
                { code: '6', codeName: '중량물 취급작업계획서' }
              ]"
              itemText="codeName"
              itemValue="code"
              maxValues="3"
              name="test10"
              label="추가서류"
              v-model:value="sop.test10"
            />
          </div>

          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <c-checkbox
              :editable="editable"
              :isArray="false"
              :comboItems="[
                { code: '1', codeName: '현장확인(견적, 도면)' },
                { code: '2', codeName: '현장점검(설비, Layout)' },
                { code: '3', codeName: '프로그램작업(추가, 변경)' }
              ]"
              itemText="codeName"
              itemValue="code"
              maxValues="3"
              name="test11"
              label="작업구분"
              v-model:value="sop.test11"
            />
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <c-checkbox
              codeGroupCd="SOP_SUPPLEMENT_WORK_TYPE_CD"
              :editable="editable"
              :isArray="false"
              itemText="codeName"
              itemValue="code"
              maxValues="3"
              name="accidentKindCd3"
              label="공사구분"
              v-model:value="sop.accidentKindCd3"
            />
          </div>
        </template>
      </c-card>
      <c-card title="정비·보수 및 작업 계획" class="cardClassDetailForm">
        <template v-slot:card-detail>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <c-table
              ref="attendeeTable"
              title="정비·보수 및 작업 구분"
              :columns="gridTest2.columns"
              :data="gridTest2.data"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              gridHeightAuto
              :isExcelDown="false"
              :hideBottom="true"
              :editable="editable"
            />
          </div>
          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <c-table
              ref="attendeeTable"
              title="정비·보수 및 작업 주기"
              :columns="gridTest3.columns"
              :data="gridTest3.data"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              gridHeightAuto
              :isExcelDown="false"
              :hideBottom="true"
              :editable="editable"
            />
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <c-table
              ref="attendeeTable"
              title="작업 원인/내용 목록"
              :columns="gridTest1.columns"
              :merge="gridTest1.merge"
              :data="gridTest1.data"
              :filtering="false"
              :columnSetting="false"
              :usePaging="false"
              gridHeightAuto
              :isExcelDown="false"
              :hideBottom="true"
              :editable="editable"
              selection="multiple"
              rowKey="no"
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
const sop = ref<any>({
  mdmSopId: '', // 안전작업 표준 일련번호
  plantCd: null, // 사업장코드
  subProcessCd: '', // 단위공정 코드
  sopNo: '', // 안전작업 표준 번호
  sopName: '지원등 현수막 시공', // 세부공정(작업) 명
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
  userId: 'U000000001',
  planDate: '2025-10-17',
  test1: 1,
  test2: '지원등 휠로티',
  test3: '지원등 현수막 시공',
  test4: '수공구',
  test5: '설비 #00001',
  test6: 'EQUIP00001',
  test7: '안전모, 안전화, 안전대',
  test8: '작업현황판, 라바콘, 스카이',
  test9: '수공구',
  test10: '1',
  test11: '2',
  test12: 'SWT0000030',
  test13: '씨엠알',
  test14: '팀장',
  test15: '안다미',
  test16: '010-0000-0000',
  test17: '2',
  test18: '4',
  revSelectValue: null,
  sopSteps: [], // 작업단계 목록
  revs: [], // 개정 목록
  mmEquips: [], // 설비 목록
  mmMachines: [], // 기계기구 목록
  chems: [], // 화학자재 목록
  sopSummary: [], // 요약정보
  sopStepHazards: [] // 작업단계 (w/h. 유해위험요인)
})

const gridTest1 = ref<any>({
  merge: [
    { index: 0, colName: 'no' },
    { index: 1, colName: 'no' },
    { index: 2, colName: 'no' }
  ],
  columns: [
    {
      name: 'no',
      field: 'no',
      label: 'NO',
      style: 'width:80px',
      align: 'center',
      type: 'number',
      sortable: false
    },
    {
      name: 'test0',
      field: 'test0',
      label: '구분',
      style: 'width:130px',
      align: 'center',
      type: 'text',
      sortable: false
    },
    {
      name: 'test1',
      field: 'test1',
      label: '정비·보수 및 작업 원인',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'test2',
      field: 'test2',
      label: '정비·보수 및 작업 내용',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'before',
      field: 'before',
      label: '정비·보수 및 작업 시간',
      align: 'center',
      child: [
        {
          name: 'test3',
          field: 'test3',
          label: '시작시간',
          type: 'datetime',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'test4',
          field: 'test4',
          label: '완료시간',
          type: 'datetime',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'test5',
          field: 'test5',
          label: '소요시간',
          align: 'center',
          style: 'width:100px',
          sortable: false
        }
      ]
    }
  ],
  data: [
    {
      no: 1,
      test0: '1일차',
      test1: '현수막 교체 작업',
      test2: '스카이 고소작업 세팅',
      test3: '07:30',
      test4: '08:30',
      test5: '1h'
    },
    {
      no: 1,
      test0: '1일차',
      test1: '현수막 교체 작업',
      test2: '기존 현수막 해체',
      test3: '08:30',
      test4: '10:00',
      test5: '1h 30m'
    },
    {
      no: 1,
      test0: '1일차',
      test1: '현수막 교체 작업',
      test2: '신규 현수막 설치',
      test3: '10:30',
      test4: '13:00',
      test5: '2h 30m'
    },
    {
      no: 1,
      test0: '1일차',
      test1: '현수막 교체 작업',
      test2: '텐션 조정·모서리 보강',
      test3: '14:00',
      test4: '15:30',
      test5: '1h 30m'
    },
    {
      no: 1,
      test0: '1일차',
      test1: '현수막 교체 작업',
      test2: '사진 촬영 및 검수 보고',
      test3: '16:00',
      test4: '16:30',
      test5: '30m'
    },

    {
      no: 2,
      test0: '2일차',
      test1: 'LED 간판 점검',
      test2: '절연저항 측정',
      test3: '09:00',
      test4: '10:00',
      test5: '1h'
    },
    {
      no: 2,
      test0: '2일차',
      test1: 'LED 간판 점검',
      test2: '노후 램프 교체',
      test3: '10:00',
      test4: '12:00',
      test5: '2h'
    },
    {
      no: 2,
      test0: '2일차',
      test1: 'LED 간판 점검',
      test2: '컨버터·전원부 점검',
      test3: '13:00',
      test4: '14:00',
      test5: '1h'
    },
    {
      no: 2,
      test0: '2일차',
      test1: 'LED 간판 점검',
      test2: '케이블 타이 정비·정렬',
      test3: '14:00',
      test4: '15:30',
      test5: '1h 30m'
    },
    {
      no: 2,
      test0: '2일차',
      test1: 'LED 간판 점검',
      test2: '접지·차단기 테스트',
      test3: '15:30',
      test4: '17:00',
      test5: '1h 30m'
    },

    {
      no: 3,
      test0: '3일차',
      test1: '전기 배선 정비',
      test2: '자재 반입·현장 세팅',
      test3: '08:00',
      test4: '09:00',
      test5: '1h'
    },
    {
      no: 3,
      test0: '3일차',
      test1: '전기 배선 정비',
      test2: '배선 트레이 정리',
      test3: '09:00',
      test4: '11:00',
      test5: '2h'
    },
    {
      no: 3,
      test0: '3일차',
      test1: '전기 배선 정비',
      test2: '분전반 라벨링 갱신',
      test3: '11:00',
      test4: '12:00',
      test5: '1h'
    },
    {
      no: 3,
      test0: '3일차',
      test1: '전기 배선 정비',
      test2: '손상 케이블 교체',
      test3: '13:00',
      test4: '15:00',
      test5: '2h'
    },
    {
      no: 3,
      test0: '3일차',
      test1: '전기 배선 정비',
      test2: '터미널 체결 토크 점검',
      test3: '15:00',
      test4: '16:30',
      test5: '1h 30m'
    },

    {
      no: 4,
      test0: '4일차',
      test1: '안전 점검',
      test2: 'TBM 및 위험성 평가',
      test3: '09:00',
      test4: '09:30',
      test5: '30m'
    },
    {
      no: 4,
      test0: '4일차',
      test1: '안전 점검',
      test2: '추락방지 난간·발판 점검',
      test3: '09:30',
      test4: '11:00',
      test5: '1h 30m'
    },
    {
      no: 4,
      test0: '4일차',
      test1: '안전 점검',
      test2: '전기·접지 상태 점검',
      test3: '11:00',
      test4: '12:00',
      test5: '1h'
    },
    {
      no: 4,
      test0: '4일차',
      test1: '안전 점검',
      test2: 'PPE 착용·상태 확인',
      test3: '13:30',
      test4: '15:00',
      test5: '1h 30m'
    },
    {
      no: 4,
      test0: '4일차',
      test1: '안전 점검',
      test2: '비상동선·소화설비 점검',
      test3: '15:00',
      test4: '16:00',
      test5: '1h'
    }
  ]
})
const gridTest2 = ref<any>({
  columns: [
    {
      name: 'test0',
      field: 'test0',
      label: '예방정비·보수',
      style: 'width:130px',
      type: 'check',
      true: 'o',
      false: 'x',
      align: 'center',
      sortable: false
    },
    {
      name: 'test1',
      field: 'test1',
      label: '고장정비·보수',
      style: 'width:130px',
      type: 'check',
      true: 'o',
      false: 'x',
      align: 'center',
      sortable: false
    },
    {
      name: 'test2',
      field: 'test2',
      label: '안전·시설개선',
      style: 'width:130px',
      type: 'check',
      true: 'o',
      false: 'x',
      align: 'center',
      sortable: false
    },
    {
      name: 'test3',
      field: 'test3',
      label: '기타작업(견적,실측 등)',
      style: 'width:130px',
      type: 'check',
      true: 'o',
      false: 'x',
      align: 'center',
      sortable: false
    }
  ],
  data: [
    {
      no: 1,
      test0: 'x',
      test1: 'o',
      test2: 'x',
      test3: 'x',
      test4: 'x'
    }
  ]
})
const gridTest3 = ref<any>({
  columns: [
    {
      name: 'test0',
      field: 'test0',
      label: '1개월',
      style: 'width:100px',
      type: 'check',
      true: 'o',
      false: 'x',
      align: 'center',
      sortable: false
    },
    {
      name: 'test1',
      field: 'test1',
      label: '3개월',
      type: 'check',
      true: 'o',
      false: 'x',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'test2',
      field: 'test2',
      label: '6개월',
      type: 'check',
      true: 'o',
      false: 'x',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'test3',
      field: 'test3',
      label: '1년',
      type: 'check',
      true: 'o',
      false: 'x',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'test4',
      field: 'test4',
      type: 'check',
      true: 'o',
      false: 'x',
      label: '발생시',
      style: 'width:100px',
      align: 'center',
      sortable: false
    }
  ],
  data: [
    {
      no: 1,
      test0: 'x',
      test1: 'x',
      test2: 'x',
      test3: 'o',
      test4: 'x'
    }
  ]
})
const editForm = ref<HTMLFormElement | null>(null)

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
