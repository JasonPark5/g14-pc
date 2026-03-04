<template>
  <div>
    <c-table
      ref="substanceTable"
      :editable="editable && !disabled"
      title="구성성분 목록"
      :columns="grid.columns"
      :data="review.subs"
      :columnSetting="false"
      :filtering="false"
      :usePaging="false"
      :hideBottom="true"
      gridHeight="400px"
      selection="multiple"
      rowKey="mdmChemId"
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
      <template v-slot:table-button>
        <q-btn-group outline v-if="editable && !disabled">
          <c-btn label="추가" icon="add" @btnClicked="addRow" />
          <!-- <c-btn label="직접추가" icon="add" @btnClicked="addDirectRow" /> -->
          <c-btn
            v-if="review.subs!.length > 0"
            label="삭제"
            icon="remove"
            @btnClicked="removeRow"
          />
          <c-btn
            v-if="editable && review.subs!.length > 0"
            label="저장"
            icon="save"
            @btnClicked="saveSubstance"
          />
        </q-btn-group>
      </template>
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
        <template v-if="col.name === 'chemNmEn'">
          <b
            class="tableinnerBtn tableinnerBtn-left text-blue-6 cursor-pointer"
            @click="linkClick(bodyProps.row)"
            >{{ bodyProps.row[col.name] }}</b
          >
        </template>
        <template v-if="col.name === 'chemNmKr' || col.name === 'casNo'">
          <span>
            {{ bodyProps.row[col.name] }}
          </span>
        </template>
      </template>
    </c-table>
    <c-table
      ref="innertable"
      :editable="false"
      title="구성성분별 규제사항"
      class="topcolor-orange"
      :columns="gridSubstanceRegul.columns"
      :data="review.subsRegul"
      gridHeight="400px"
      :columnSetting="false"
      :filtering="false"
      :usePaging="false"
      :hideBottom="true"
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
import { chemBaseType } from '../chem/chemBase'
import { chemReviewType } from './chemReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemReviewComponents'
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
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    mdmChemReviewId: stringNull
  }
  review: chemReviewType
  disabled: boolean
  btnEditable: boolean
  contentHeight: string
}
interface gridSubstanceRegulType {
  columns: Array<tableColumnType>
  fullcolumns: Array<tableColumnType>
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
      mdmChemReviewId: ''
    }
  },
  review: () => {
    return {
      mdmChemReviewId: '', // 사전검토 일련번호
      reviewRequestDate: '', // 검토요청일
      plantCds: '', // 사업장코드
      materialCd: '', // 화학자재번호
      materialName: '', // 자재명(KOR)
      materialNameEn: '', // 자재명(ENG)
      deliveryVendorCd: null, // 납품업체 코드
      deliveryVendorName: '', // 납품업체명
      mfgVendorCd: null, // 제조업체 코드
      mfgVendorName: '', // 제조업체명
      mdmChemReviewStepCd: null, // 사전검토 진행상태
      propertiesStateCd: null, // 성상-공통코드
      fugacity: '', // 비산성(고체)
      boilPoint: '', // 끊는점(액체,기체)
      meltingPoint: '', // 녹는점
      moleWeight: '', // 분자량
      usageCd: null, // 용도-회사별 공통코드
      usageEtc: '', // 용도 기타
      hsNo: '', // HS번호
      specificGravity: '', // 비중
      casNo: '', // CAS No.
      serialNo: '', // 고유번호(유독물번호or고시번호)
      keNo: '', // KE 번호
      psmFlag: 'N', // PSM 대상 여부
      mixFlag: 'N', // 물질구성(단일 N/혼합 Y)
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
      returnRemark: '', // 반려사유
      returnFlag: '', // 반려여부
      chemSubsControlFlag: '', // 화평법 등록여부
      chemAuthFlag: '', // 화학물질확인증명 여부
      chemLicenseFlag: '', // 유해화학물질 인허가 여부
      chemReportFlag: '', // 유해화학물질 신고여부
      msdsFlag: '', // MSDS제출/비공개 승인여부
      msdsNo: '', // MSDS번호
      materialCount: '',
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      subs: [],
      subsRegul: [],
      prodReguls: [],
      bills: [],
      checks: []
    }
  },
  disabled: false,
  btnEditable: false,
  fileLength: () => {
    return {
      msds: 0,
      ingrdient: 0
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '70%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      required: true,
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '화학물질명(ENG)',
      type: 'custom',
      align: 'left',
      style: 'width:300px',
      sortable: false
    },
    // {
    //   name: 'chemNmKr',
    //   field: 'chemNmKr',
    //   label: '화학물질명(KOR)',
    //   type: 'custom',
    //   align: 'left',
    //   style: 'width:150px',
    //   sortable: false
    // },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      type: 'custom',
      align: 'center',
      style: 'width:100px',
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
        {
          name: 'prtrGroupId',
          field: 'prtrGroupId',
          label: '그룹',
          align: 'center',
          sortable: true,
          style: 'width:60px'
        },

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
    }
  ]
})
const gridSubstanceRegul = ref<gridSubstanceRegulType>({
  columns: [],
  fullcolumns: []
})
const headerUrl = ref('')
const prtr2Url = ref('')
const saveSubUrl = ref('')
const autoSaveSubUrl = ref('')
const deleteSubUrl = ref('')
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
// const gridHeight = computed(() => {
//   let margin = 360
//   if (props.btnEditable) {
//     margin += 10
//   }
//   let height =
//     props.contentHeight && !Number.isNaN(props.contentHeight)
//       ? Number(props.contentHeight) - margin
//       : 300
//   if (height < 300) {
//     height = 300
//   }
//   return `${String(height)}px`
// })

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
  headerUrl.value = selectConfig.mdm.mam.chem.header.url
  saveSubUrl.value = transactionConfig.mdm.mam.review.substance.save.url
  autoSaveSubUrl.value = transactionConfig.mdm.mam.review.substance.autoSave.url
  deleteSubUrl.value = transactionConfig.mdm.mam.review.substance.delete.url
  prtr2Url.value = selectConfig.chm.inout.emissions.prtr2.url
  // code setting
  // list setting
  getPrtr2()
  getHeader()
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
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getHeader() {
  $http({
    url: headerUrl.value,
    method: 'GET',
    params: {
      headerType: 'check'
    }
  }).then((_result: any) => {
    const items = [
      {
        name: 'chemNmEn',
        field: 'chemNmEn',
        label: '화학물질명(ENG)',
        align: 'left',
        style: 'width:350px',
        sortable: false,
        fix: true
      }
    ]
    let _fullcolumns: Array<tableColumnType> = []
    _.forEach(_result.data, (_item) => {
      items.push(_item)
      _fullcolumns = _.concat(_fullcolumns, _item.child)
    })
    gridSubstanceRegul.value.columns = _.cloneDeep(items)
    gridSubstanceRegul.value.fullcolumns = _fullcolumns
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function addRow() {
  popupOptions.value = getPopupOptions('chemBase', popupOptions.value, closeChemBasePopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closeChemBasePopup(data: Array<chemBaseType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (_.findIndex(props.review.subs, { mdmChemId: item.mdmChemId }) === -1) {
        props.review.subs!.push({
          mdmChemReviewId: props.popupParam.mdmChemReviewId,
          mdmChemId: item.mdmChemId,
          casNo: item.casNo,
          chemNmKr: item.chemNmKr,
          chemNmEn: item.chemNmEn,
          regulD10: item.regulD10,
          regulD14: item.regulD14,
          dangerousName: item.dangerousName,
          prtrGroupId: item.prtrGroupId,
          twaPpm: item.twaPpm,
          twaMm: item.twaMm,
          stelPpm: item.stelPpm,
          stelMm: item.stelMm,
          limitHigh: 0,
          limitLow: 0,
          limitRepval: 0,
          mttrid: '', // 환경부데이터 물질ID(CHEM ID)
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
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
      confirmCallback: () => {
        $http({
          url: deleteSubUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            props.review.subs = _.reject(props.review.subs, item)
          })
          substanceTable.value.compoTable.clearSelection()
          emits('getDetail')
        })
      },
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
function saveSubstance() {
  if (validTable(grid.value.columns, props.review.subs!)) {
    _.forEach(props.review.subs, (_item) => {
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
          url: autoSaveSubUrl.value,
          method: 'PUT',
          data: props.review.subs
        }).then(() => {
          message.requestSuccess()
          emits('getDetail')
        })
      },
      denyCallback: () => {
        $http({
          url: saveSubUrl.value,
          method: 'PUT',
          data: props.review.subs
        }).then(() => {
          message.requestSuccess()
          emits('getDetail')
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
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

function datachange(_props?: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // table.value.acceptData(_props.row, col.name, _props.row[col.name])
}
/******************************
 * TODO (목적): 구성물질 직접 추가
 *******************************/
// function addDirectRow() {
//   props.review.subs!.push({
//     mdmChemReviewId: props.popupParam.mdmChemReviewId,
//     mdmChemId: uid().slice(-10),
//     casNo: '',
//     chemNmEn: '',
//     chemNmKr: '',
//     limitHigh: 0,
//     limitLow: 0,
//     limitRepval: 0,
//     addType: '직접추가',
//     regUserId: user.value.userId,
//     editFlag: 'C'
//   })
// }
/******************************
 * TODO (목적): 규제항목 기준값 조회 검증 팝업 표시
 *******************************/
function openChemQuantity() {
  popupOptions.value.title = '규제항목 기준값 조회'
  popupOptions.value.param = {
    mdmChemReviewId: props.popupParam.mdmChemReviewId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./chemReviewQuantity.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
  popupOptions.value.closeCallback = closePopup
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
