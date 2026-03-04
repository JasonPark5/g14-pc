<template>
  <div>
    <c-table
      ref="substanceTable"
      title="구성성분 목록"
      tableId="substanceTable"
      :columns="gridSubstance.columns"
      :data="gridSubstance.data"
      :columnSetting="false"
      selection="multiple"
      rowKey="mdmChemId"
      :filtering="false"
      :usePaging="false"
      :hideBottom="true"
      gridHeight="400px"
      :editable="editable"
      checkDisableColumn="noFlag"
      @table-data-change="tableDataChange"
      @linkClick="linkClick"
    >
      <template v-slot:customComment>
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-table
              dense
              hideBottom
              :usePaging="false"
              :isExcelDown="false"
              :columnSetting="false"
              :isFullScreen="false"
              gridHeightAuto
              class="prtr"
              title="PRTR Ⅰ 그룹 "
              :columns="prtrColumns"
              :data="prtr1rows"
              rowKey="casNo"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-table
              dense
              :isExcelDown="false"
              :columnSetting="false"
              :hideBottom="false"
              :isFullScreen="false"
              gridHeightAuto
              class="prtr"
              title="PRTR Ⅱ 그룹"
              :columns="prtrColumns"
              :data="prtr2rows"
              rowKey="casNo"
            />
          </div>
        </div>
      </template>
      <!-- 버튼 영역 -->
      <template v-slot:customArea="{ props: bodyProps, col }">
        <template v-if="col.name === 'prtrSwcsWtQuantity' || col.name === 'prtrSwcsTonQuantity'">
          <c-text-column
            v-if="bodyProps.row['regulD10'] > 0"
            :editable="editable"
            :props="bodyProps"
            :col="col"
            v-model:value="bodyProps.row[col.name]"
            @datachange="datachange(bodyProps)"
          />
          <span v-else>
            {{ bodyProps.row[col.name] }}
          </span>
        </template>
        <template v-if="col.name === 'designatedQuantityDose'">
          <c-text-column
            v-if="bodyProps.row['regulD14'] > 0"
            :editable="editable"
            :props="bodyProps"
            :col="col"
            v-model:value="bodyProps.row[col.name]"
            @datachange="datachange(bodyProps)"
          />
          <span v-else>
            {{ bodyProps.row[col.name] }}
          </span>
        </template>
      </template>
      <!-- <template v-slot:table-header-append>
        <span style="font-size: 1em; color: red">
          {{
            $language(
              '※ 구성성분을 신규 저장 시 [예,아니오] 상관없이 규제사항을 계산하여 자동으로 체크합니다.'
            )
          }}
        </span>
      </template> -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-checkbox
            noborder
            isFlag
            falseLabel="삭제물질 포함"
            trueLabel="삭제물질 포함"
            name="delFlag"
            addClasses="chemComponentsCheckbox"
            v-model:value="delFlag"
            @update:value="getDetail"
          />
          <!-- <c-btn label="환경부-화학물질정보 연동 추가" v-if="editable" icon="add" @btnClicked="addApiRow" /> -->
          <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addRow" />
          <c-btn
            v-if="editable && gridSubstance.data.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="removeRow"
          />
          <c-btn
            v-if="editable && gridSubstance.data.length > 0"
            label="저장"
            icon="save"
            @btnClicked="saveSubstance"
          />
        </q-btn-group>
      </template>
      <!-- <template v-slot:customArea="{ props, col }">
        <template>
          <q-chip
            v-if="col.name === 'msdslink' && props.row.mttrid != ''"
            outline
            square
            color="blue"
            :clickable="true"
            @click.stop="() => msdslink(props.row)"
            text-color="white"
          >
            MSDS
          </q-chip>
        </template>
      </template> -->
    </c-table>
    <c-table
      ref="innertable"
      tableId="innertable"
      title="구성성분별 규제사항"
      class="topcolor-orange"
      :columns="gridSubstanceRegul.columns"
      :data="gridSubstanceRegul.data"
      :columnSetting="false"
      :filtering="false"
      :usePaging="false"
      :hideBottom="true"
      :editable="false"
      :gridHeight="innertableHeight"
    >
      <template v-slot:suffixTitle>
        <q-btn-group outline>
          &nbsp; &nbsp; &nbsp;
          <c-btn
            v-if="editable"
            label="규제항목 기준값 조회"
            icon="history"
            @btnClicked="openChemQuantity"
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
import { chemBaseType } from './chem/chemBase'
import { chemMaterialType } from './chemMaterial'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemComponents'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** user 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegul'])

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
  chemData: chemMaterialType
  contentHeight: stringNull
}
interface gridType {
  columns: Array<tableColumnType>
  data: Array<any>
}
// interface nationDataType {
//   chemNmKr: stringNull
//   chemNmEn: stringNull
//   casNo: stringNull
// }

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
  },
  chemData: () => {
    return {
      plantCd: null, // 사업장코드
      plantName: '', // 사업장
      mdmChemMaterialId: '', // 화학자재 일련번호
      mdmChemMaterialCd: '', // 화학자재번호
      mdmChemMaterialName: '', // 화학자재 품명
      mdmChemReviewId: '', // 사전검토 일련번호
      deliveryVendorCd: '', // 납품업체 코드
      mfgVendorCd: '', // 제조업체 코드
      psmFlag: 'N', // PSM 대상 여부
      usageCd: null, // 용도-회사별 공통코드
      usageEtc: '', // 용도 기타
      msdsNo: '', // MSDS번호
      casNo: '', // MSDS번호
      inUnitCd: null, // 입고단위
      inConversonFactor: '', // 입고 환산계수
      inConversonUnitCd: null, // 입고 환산단위
      specificGravity: '', // 비중
      propertiesStateCd: null, // 성상
      freezingPoint: '', // 어는점
      boilPoint: '', // 끓는점
      flashPoint: '', // 인화점
      firePoint: '', // 발화점
      licensingFlag: 'N', // 인허가대상 물질 여부 Y/N
      dangerFlag: 'N', // 위험물 여부Y/N
      makeFlag: 'N', // 제품분류(제조)
      impFlag: 'N', // 제품분류(수입)
      buyFlag: 'N', // 제품분류(구매)
      usingFlag: 'N', // 제품분류(사용)
      expFlag: 'N', // 제품분류(수출)
      salesFlag: 'N', // 제품분류(판매)
      toxicPoisonFlag: 'N', // 유해화학물질포함여부(유독물질)
      toxicPermitFlag: 'N', // 유해화학물질포함여부(허가물질)
      toxicLimitFlag: 'N', // 유해화학물질포함여부(제한물질)
      toxicProhibitFlag: 'N', // 유해화학물질포함여부(금지물질)
      remarks: '', // 비고
      useFlag: 'Y', // 사용여부
      unusedReason: '', // 미사용사유
      preMdmChemMaterialId: '', // 이전화학자재 일련번호
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      depts: '', // 사용반
      revisionNum: '',
      groupId: '',
      sysRevision: 1,
      revisionContent: '제정',
      productCategoryCd: null, // 제품구분
      keepFacilityFlag: 'N', // 보관시설 유무
      maxKeepAmount: '', // 최대보관량
      storageFacilityFlag: 'N', // 저장시설 유무
      maxStorageAmount: '', // 최대저장량
      manufacturingFacilitiesFlag: 'N', // 제조 사용시설 여부
      nanoManufacturingFlag: 'N', // 나노물질 제조 여부
      nanoIncomeFlag: 'N', // 나노물질 수입 여부
      nanoNoneApplicableFlag: 'N', // 나노물질 해당없음 여부
      nanoUnknownFlag: 'N', // 나노물질 모름 여부
      inputDissolutionTank: '', // 투입 용해조
      productManufClassCd: null, // 제품제조구분 코드
      chemIngredientsCd: null, // 구성성분 작성근거
      mixFlag: 'N', // 물질구성(단일 N/혼합 Y)
      serialNo: '', // 고유번호(유독물번호or고시번호)
      fugacity: '', // 비산성(고체)
      keNo: '', // KE 번호
      hsNo: '', // HS번호
      meltingPoint: '', // 녹는점
      moleWeight: '', // 분자량
      mdmChemMaterialMsdsId: '', // MSDS key
      msdsRegDtStr: '', // MSDS 개정일시
      msdsRegUserName: '' // MSDS 개정자
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const gridSubstanceRegul = ref<gridType>({
  columns: [],
  data: []
})
const gridSubstance = ref<gridType>({
  columns: [
    // {
    //   name: 'chemNmKr',
    //   field: 'chemNmKr',
    //   label: '화학물질명(KOR)',
    //   align: 'left',
    //   style: 'width:350px',
    //   sortable: false,
    // },
    {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '화학물질명(ENG)',
      type: 'link',
      align: 'left',
      sortable: false,
      style: 'width:350px',
      fix: true
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'molecularFormula',
      field: 'molecularFormula',
      label: '분자식',
      align: 'center',
      style: 'width:120px',
      sortable: false
    },
    {
      label: '적용기준의 정량값에 대한 함유량(%)',
      align: 'center',
      child: [
        {
          name: 'limitDisplay',
          field: 'limitDisplay',
          label: '표시',
          align: 'center',
          style: 'width:120px',
          type: 'text',
          sortable: false
        },
        {
          name: 'limitHigh',
          field: 'limitHigh',
          label: '상한',
          align: 'center',
          style: 'width:90px',
          type: 'number',
          sortable: false
        },
        {
          name: 'limitLow',
          field: 'limitLow',
          label: '하한',
          align: 'center',
          style: 'width:90px',
          type: 'number',
          sortable: false
        },
        {
          name: 'limitRepval',
          field: 'limitRepval',
          label: '대표값',
          align: 'center',
          style: 'width:80px',
          type: 'number',
          sortable: false
        }
      ]
    },
    {
      label: '배출량조사대상물질 (PRTR 정량값)',
      helpcommentCustom: true,
      align: 'center',
      child: [
        // {
        //   name: 'prtrGroupId',
        //   field: 'prtrGroupId',
        //   label: '그룹',
        //   align: 'center',
        //   sortable: true,
        //   style: 'width:60px'
        // },

        {
          name: 'prtrSwcsWtQuantity',
          field: 'prtrSwcsWtQuantity',
          label: '함유량(%)',
          align: 'right',
          sortable: true,
          style: 'width:90px',
          type: 'custom'
        },
        {
          name: 'prtrSwcsTonQuantity',
          field: 'prtrSwcsTonQuantity',
          label: '취급량(톤/년)',
          align: 'right',
          sortable: true,
          style: 'width:90px',
          type: 'custom'
        }
      ]
    },
    {
      label: '위험물',
      align: 'center',
      child: [
        {
          name: 'dangerousName',
          field: 'dangerousName',
          label: '품명',
          align: 'left',
          sortable: true,
          style: 'width:100px'
        },
        {
          name: 'designatedQuantityDose',
          field: 'designatedQuantityDose',
          label: '정량값<br>(지정수량)',
          align: 'right',
          sortable: true,
          style: 'width:80px',
          type: 'custom'
        }
      ]
    },
    {
      label: '노출기준',
      align: 'center',
      child: [
        {
          name: 'twaPpm',
          field: 'twaPpm',
          label: 'TWA<br>(ppm)',
          align: 'right',
          sortable: true,
          style: 'width:80px'
        },
        {
          name: 'twaMm',
          field: 'twaMm',
          label: 'TWA<br>(mg/m3)',
          align: 'right',
          sortable: true,
          style: 'width:80px'
        },
        {
          name: 'stelPpm',
          field: 'stelPpm',
          label: 'STEL<br>(ppm)',
          align: 'right',
          sortable: true,
          style: 'width:80px'
        },
        {
          name: 'stelMm',
          field: 'stelMm',
          label: 'STEL<br>(mg/m3)',
          align: 'right',
          sortable: true,
          style: 'width:80px'
        }
      ]
    },
    {
      name: 'businessSecFlag',
      field: 'businessSecFlag',
      label: '영업비밀',
      align: 'center',
      style: 'width:80px',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'delFlag',
      field: 'delFlag',
      label: '삭제여부',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      label: 'CMR',
      align: 'center',
      child: [
        {
          name: 'cmrFlag',
          field: 'cmrFlag',
          label: '물질여부',
          align: 'center',
          style: 'width:70px',
          sortable: false
        },
        {
          name: 'carcinogens',
          field: 'carcinogens',
          label: '발암성',
          align: 'center',
          style: 'width:90px',
          sortable: false
        },
        {
          name: 'mutagens',
          field: 'mutagens',
          label: '변이원성',
          align: 'center',
          style: 'width:90px',
          sortable: false
        },
        {
          name: 'reproductiveToxins',
          field: 'reproductiveToxins',
          label: '생식독성',
          align: 'center',
          style: 'width:90px',
          sortable: false
        }
      ]
    },
    {
      label: '추가/삭제 이력',
      align: 'center',
      child: [
        {
          name: 'regDtStrTime',
          field: 'regDtStrTime',
          label: '추가일시',
          align: 'center',
          style: 'width:150px',
          sortable: false
        },
        {
          name: 'regUserName',
          field: 'regUserName',
          label: '추가사용자',
          align: 'center',
          style: 'width:150px',
          sortable: false
        },
        {
          name: 'chgDtStrTime',
          field: 'chgDtStrTime',
          label: '삭제일시',
          align: 'center',
          style: 'width:150px',
          sortable: false
        },
        {
          name: 'chgUserName',
          field: 'chgUserName',
          label: '삭제사용자',
          align: 'center',
          style: 'width:150px',
          sortable: false
        }
      ]
    }
  ],
  data: []
})
const prtr2Url = ref('')
const listUrl = ref('')
const reglistUrl = ref('')
const saveUrl = ref('')
const autoSaveUrl = ref('')
const deleteUrl = ref('')
const innertableHeight = ref('')
const headerUrl = ref('')
// const nationData = ref<Array<nationDataType>>([])
const delFlag = ref('N')
const substanceTable = ref<any>(null)
const prtr2rows = ref([])
const prtrColumns = ref([
  {
    name: 'no',
    field: 'no',
    label: '번호',
    align: 'center'
  },
  {
    name: 'casNo',
    field: 'casNo',
    label: 'CAS No.',
    align: 'center',
    style: 'width: 160px'
  },
  {
    name: 'krName',
    field: 'krName',
    label: '품명(국문명)',
    align: 'left'
  },
  {
    name: 'enName',
    field: 'enName',
    label: '품명(영문명)',
    align: 'left'
  },
  {
    name: 'rate',
    field: 'rate',
    label: '무게함유율(%)',
    align: 'center'
  }
])
const prtr1rows = ref([
  {
    no: '1',
    casNo: '000050-00-0',
    krName: '포름알데히드',
    enName: 'Formaldehyde',
    rate: '0.1 이상'
  },
  {
    no: '2',
    casNo: '000056-53-1',
    krName: '디에틸스틸베스테롤',
    enName: 'Diethylstilbesterol',
    rate: '0.1 이상'
  },
  {
    no: '3',
    casNo: '000071-43-2',
    krName: '벤젠',
    enName: 'Benzene',
    rate: '0.1 이상'
  },
  {
    no: '4',
    casNo: '000075-01-4',
    krName: '염화 비닐',
    enName: 'Vinyl chloride',
    rate: '0.1 이상'
  },
  {
    no: '5',
    casNo: '000075-21-8',
    krName: '산화 에틸렌',
    enName: 'Ethylene oxide',
    rate: '0.1 이상'
  },
  {
    no: '6',
    casNo: '000079-01-6',
    krName: '트리클로로에틸렌',
    enName: 'Trichloroethylene',
    rate: '0.1 이상'
  },
  {
    no: '7',
    casNo: '000095-53-4',
    krName: 'o-톨루이딘',
    enName: 'o-Toluidine',
    rate: '0.1 이상'
  },
  {
    no: '8',
    casNo: '000101-14-4',
    krName: `3,3'-디클로로-4,4'-디아미노디페닐 메탄`,
    enName: `3,3'-Dichloro-4,4'-diaminodiphenylmethane`,
    rate: '0.1 이상'
  },
  {
    no: '9',
    casNo: '000106-99-0',
    krName: `1,3-부타디엔`,
    enName: `1,3-Butadiene`,
    rate: '0.1 이상'
  },
  {
    no: '10',
    casNo: '000107-30-2',
    krName: `클로로메틸 메틸 에테르`,
    enName: `Chloromethyl methyl ether`,
    rate: '0.1 이상'
  },
  {
    no: '11',
    casNo: '000193-39-5',
    krName: `인데노[1,2,3-cd]피렌`,
    enName: `Indeno[1,2,3-cd]pyrene`,
    rate: '0.1 이상'
  },
  {
    no: '12',
    casNo: '000298-81-7',
    krName: `8-메톡시-6,7-푸라노쿠마린`,
    enName: `8-Methoxy-6,7-furanocoumarin`,
    rate: '0.1 이상'
  },
  {
    no: '13',
    casNo: '001332-21-4',
    krName: `석면`,
    enName: `Asbestos`,
    rate: '0.1 이상'
  },
  {
    no: '14',
    casNo: 'NA-(주1)',
    krName: `납 및 그 화합물`,
    enName: `Lead and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '15',
    casNo: 'NA-(주2)',
    krName: `수은 및 그 화합물`,
    enName: `Mercury and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '16',
    casNo: 'NA-(주3)',
    krName: `니켈 및 그 화합물`,
    enName: `Nickel and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '17',
    casNo: 'NA-(주4)',
    krName: `비소 및 그 화합물`,
    enName: `Arsenic and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '18',
    casNo: 'NA-(주5)',
    krName: `베릴륨 및 그 화합물`,
    enName: `Beryllium and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '19',
    casNo: 'NA-(주6)',
    krName: `카드뮴 및 그 화합물`,
    enName: `Cadmium and its compounds`,
    rate: '0.1 이상'
  },
  {
    no: '20',
    casNo: 'NA-(주7)',
    krName: `크롬 및 그 화합물`,
    enName: `Chromium and its compounds`,
    rate: '0.1 이상'
  }
])
/******************************
 * @Computed_선언
 *******************************/
const contentSum = computed(() =>
  gridSubstance.value.data?.reduce((sum, item) => sum + Number(item.limitRepval), 0)
)

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  headerUrl.value = selectConfig.mdm.mam.chem.header.url
  getHeader()
})
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
  listUrl.value = selectConfig.mdm.mam.chem.substance.url
  autoSaveUrl.value = transactionConfig.mdm.mam.chem.substance.autoSave.url
  saveUrl.value = transactionConfig.mdm.mam.chem.substance.save.url
  deleteUrl.value = transactionConfig.mdm.mam.chem.substance.delete.url
  reglistUrl.value = selectConfig.mdm.mam.chem.substance.regulate.url
  prtr2Url.value = selectConfig.chm.inout.emissions.prtr2.url
  // code setting
  innertableHeight.value = window.innerHeight - 600 + 'px'
  // list setting
  getPrtr2()
  getDetail()
}
/******************************
 * TODO (목적): PRTR2 조회
 *******************************/
function getPrtr2() {
  $http({
    url: prtr2Url.value,
    method: 'GET'
  }).then((_result: any) => {
    prtr2rows.value = _result.data
  })
}
/******************************
 * TODO (목적): 구성물질 규제 목록 헤더 셋팅
 *******************************/
function getHeader() {
  $http({
    url: headerUrl.value,
    method: 'GET',
    params: {
      headerType: 'check'
    }
  }).then((_result: any) => {
    const _items = {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '화학물질명(ENG)',
      align: 'left',
      style: 'width:220px',
      sortable: false,
      fix: true
    }
    gridSubstanceRegul.value.columns.push(_items)
    _.forEach(_result.data, (_item) => {
      gridSubstanceRegul.value.columns.push(_item)
    })
    getLaw()
  })
}
/******************************
 * TODO (목적): 법규 조회
 *******************************/
function getLaw() {
  $http({
    url: reglistUrl.value,
    method: 'GET',
    params: {
      mdmChemMaterialId: props.popupParam.mdmChemMaterialId
    }
  }).then((_result: any) => {
    gridSubstanceRegul.value.data = _result.data

    // _.forEach(_result.data, (_item) => {
    //   nationData.value.push({
    //     chemNmKr: _item.chemNmKr,
    //     chemNmEn: _item.chemNmKr,
    //     casNo: _item.casNo
    //   })
    // })
  })
}
/******************************
 * TODO (목적): 화학자재별 구성물질 조회
 *******************************/
function getDetail() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      mdmChemMaterialId: props.popupParam.mdmChemMaterialId,
      delFlag: delFlag.value
    }
  }).then((_result: any) => {
    gridSubstance.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 구성물질 추가를 위해 화학물질 팝업 표시
 *******************************/
function addRow() {
  popupOptions.value = getPopupOptions('chemBase', popupOptions.value, closeChemBasePopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 화학물질 팝업 닫기
 * @param (1): 선택한 화학물질 정보
 *******************************/
function closeChemBasePopup(_data: Array<chemBaseType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _.forEach(_data, (item) => {
      if (_.findIndex(gridSubstance.value.data, { mdmChemId: item.mdmChemId }) === -1) {
        gridSubstance.value.data.push({
          mdmChemMaterialId: props.popupParam.mdmChemMaterialId,
          mdmChemId: item.mdmChemId,
          casNo: item.casNo,
          chemNmKr: item.chemNmKr,
          chemNmEn: item.chemNmEn,
          limitHigh: 0,
          limitLow: 0,
          limitRepval: 0,
          regulD10: item.regulD10,
          regulD14: item.regulD14,
          twaPpm: item.twaPpm,
          twaMm: item.twaMm,
          stelPpm: item.stelPpm,
          stelMm: item.stelMm,
          businessSecFlag: 'N',
          delFlag: 'N',
          prtrGroupId: '',
          molecularFormula: item.molecularFormula,
          boilingPoint: item.boilingPoint,
          cmrFlag: item.cmrFlag,
          maleficenceForm: item.maleficenceForm,
          maleficenceValue: item.maleficenceValue,
          maleficenceType: item.maleficenceType,
          maleficenceGrade: item.maleficenceGrade,
          dangerousName: item.dangerousName,
          hrCodeGrade: item.hrCodeGrade,
          rcode: item.rcode, // 위험문구(R-code)
          hcode: item.hcode, // 유해위험문구(H-code)
          // mttrid: item.mttrid,
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
// /******************************
//  * TODO (목적):
//  * @param (1):
//  * @param (2):
//  * @return (반환):
//  *******************************/
// function msdslink(row) {
//   window.open(
//     'https://msds.kosha.or.kr/MSDSInfo/kcic/msdsdetail.do?chem_id=' + row.mttrid + '&viewType=msds',
//     'msdspop',
//     'width=1280, height=768, menubar=no, status=no, toolbar=no'
//   )
// }
// /******************************
//  * TODO (목적):
//  * @param (1):
//  * @param (2):
//  * @return (반환):
//  *******************************/
// function addApiRow() {
//   popupOptions.value.target = () => import(`${'@/pages/common/openapi/materialApiPop.vue'}`)
//   popupOptions.value.title = '환경부-화학물질정보 연동 검색'
//   popupOptions.value.width = '50%'
//   popupOptions.value.param = {
//     type: 'multiple'
//   }
//   popupOptions.value.visible = true
//   popupOptions.value.closeCallback = closePopup
// }
// /******************************
//  * TODO (목적):
//  * @param (1):
//  * @param (2):
//  * @return (반환):
//  *******************************/
// function closePopup(_data) {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   if (_data.length !== undefined) {
//     _.forEach(_data, (item) => {
//       if (_.findIndex(grid.value.data, { casNo: item.casno }) === -1) {
//         grid.value.data.splice(0, 0, {
//           editFlag: 'C',
//           mdmChemMaterialId: props.popupParam.mdmChemMaterialId,
//           mdmMaterialSubstancesId: uid(),
//           casNo: item.casno ? item.casno : '',
//           chemNmKr: item.mttrnmkor ? item.mttrnmkor : '',
//           chemNmEn: item.mttrnmeng ? item.mttrnmeng : '',
//           limitLabel: '',
//           limitHigh: '',
//           limitLow: '',
//           limitRepval: '',
//           businessSecFlag: 'N',
//           cmrFlag: 'N',
//           boilingPoint: null,
//           hrCodeGrade: null,
//           maleficenceForm: null,
//           maleficenceType: null,
//           maleficenceValue: '',
//           molecularFormula: item.molecform ? item.molecform : '',
//           mttrid: item.chemId ? item.chemId : '', // 환경부데이터 물질ID(CHEM ID)
//           regUserId: user.value.userId
//         })
//       }
//     })
//   }
// }
/******************************
 * TODO (목적): 구성물질 저장
 *******************************/
function saveSubstance() {
  if (validTable(gridSubstance.value.columns, gridSubstance.value.data!)) {
    _.forEach(gridSubstance.value.data, (_item) => {
      _item.regUserId = user.value.userId
    })
    message.multiConfirm({
      title: '확인',
      message: `<div>
                  저장하시겠습니까?<br>
                  <span style="color: #c0392b;"><strong>[예]를 클릭할 시, 구성성분별 규제사항에 따라<br> 화학자재 규제사항이 자동으로 업데이트됩니다.</strong></span>
                  <span style="color: #c0392b;"><strong>※주의하시기 바랍니다.</strong></span><br>
                    <strong style="color: #d35400;">[아니오]를 클릭할 시 구성성분 정보만 저장합니다.<br> ※화학자재 규제사항은 규제정보 탭에서 직접 체크하시기 바랍니다.</strong>
                </div>`,
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: autoSaveUrl.value,
          method: 'POST',
          data: gridSubstance.value.data
        }).then(() => {
          message.requestSuccess()
          getDetail()
          getLaw()
          emits('setRegul')
        })
      },
      denyCallback: () => {
        $http({
          url: saveUrl.value,
          method: 'POST',
          data: gridSubstance.value.data
        }).then(() => {
          message.requestSuccess()
          getDetail()
          getLaw()
          emits('setRegul')
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 구성물질 제거
 *******************************/
function removeRow() {
  const selectData = substanceTable.value.getSelected()
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
        _.forEach(selectData, (item) => {
          item.delFlag = 'Y'
          item.chgUserId = user.value.userId
        })
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          getLaw()
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            gridSubstance.value.data = _.reject(gridSubstance.value.data, item)
          })
          substanceTable.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 테이블 내 데이터변경시 (함유량 대표값 sum 이 100 이 안넘도록 유효성체크)
 *******************************/
function tableDataChange(_props: any, col: tableColumnType) {
  if (col.name === 'limitRepval' && contentSum.value > 100) {
    _props.row[col.name] -= contentSum.value - 100
  }
  if (col.name === 'prtrSwcsWtQuantity' || col.name === 'prtrSwcsTonQuantity') {
  }
}
/******************************
 * TODO (목적): 구성물질 링크 클릭 시 팝업 표시
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '화학물질 상세'
  popupOptions.value.param = {
    mdmChemId: row ? row.mdmChemId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@/views/mdm/mam/chem/chemBaseDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '95%'
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * TODO (목적): 규제항목 기준값 조회 검증 팝업 표시
 *******************************/
function openChemQuantity() {
  popupOptions.value.title = '규제항목 기준값 조회'
  popupOptions.value.param = {
    mdmChemMaterialId: props.popupParam.mdmChemMaterialId,
    plantCd: props.popupParam.plantCd
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./chemQuantity.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
  popupOptions.value.closeCallback = closePopup
}

function datachange(_props?: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // table.value.acceptData(_props.row, col.name, _props.row[col.name])
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
