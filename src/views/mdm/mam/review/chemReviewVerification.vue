<template>
  <div>
    <c-table
      title=""
      class="chemVertificationTable"
      :columns="checkGrid.columns"
      :data="checkGrid.data"
      customDataTr
      gridHeightAuto
      hideHeader
      hideBottom
      isDense
      :isTitle="false"
      :columnSetting="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :filtering="false"
    >
      <template v-slot:customDataTr="props">
        <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
          <q-td class="text-center th-td-style th1-style" :rowspan="1" :colspan="4">
            {{ $language('상태값 정보') }}
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
          <q-td class="text-center th-td-style td1-style" :rowspan="1" :colspan="1">
            <div class="text-light-blue">
              <q-chip color="light-blue" text-color="white">
                {{ $language('적용가능') }}
              </q-chip>
            </div>
          </q-td>
          <q-td class="text-left th-td-style td2-style" :rowspan="1" :colspan="1">
            <div class="text-light-blue">
              {{
                $language(
                  '구성물질이 가지는 규제정보를 기준에 만족하는 경우, 여러 구성물질 중 모든 기준에 만족하는 경우를 일컬음'
                )
              }}
            </div>
          </q-td>
          <q-td class="text-center th-td-style td1-style" :rowspan="1" :colspan="1">
            <div class="text-grey">
              <q-chip color="grey" text-color="white">
                {{ $language('대기') }}
              </q-chip>
            </div>
          </q-td>
          <q-td class="text-left th-td-style td2-style" :rowspan="1" :colspan="1">
            <div class="text-grey">
              {{
                $language(
                  '구성물질이 가지는 규제정보의 기준이 정해져 있지 않은 경우, summary해서 적용한다고 알려주되, 선택할 수 있게 처리, 모든 구성물질이 규제정보 기준이 정해지지 않은 경우'
                )
              }}
            </div>
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 2" no-hover>
          <q-td class="text-center th-td-style td1-style" :rowspan="1" :colspan="1">
            <div class="text-green">
              <q-chip color="green" text-color="white">
                {{ $language('적용가능') }}
              </q-chip>
            </div>
          </q-td>
          <q-td class="text-left th-td-style td2-style" :rowspan="1" :colspan="1">
            <div class="text-green">
              {{
                $language(
                  '구성물질이 가지는 규제정보를 기준에 만족하는 경우, 하지만 여러 구성물질 중 단 하나라도 기준에 만족하지 않는 경우가 포함된 것을 일컬음'
                )
              }}
            </div>
          </q-td>
          <q-td class="text-center th-td-style td1-style" :rowspan="1" :colspan="1">
            <div class="text-orange">
              <q-chip color="orange" text-color="white">
                {{ $language('대기') }}
              </q-chip>
            </div>
          </q-td>
          <q-td class="text-left th-td-style td2-style" :rowspan="1" :colspan="1">
            <div class="text-orange">
              {{
                $language(
                  '구성물질이 가지는 규제정보의 기준이 정해져 있지 않은 경우, summary해서 적용한다고 알려주되, 선택할 수 있게 처리, 여러 구성물질 중 하나 이상이 규제정보 기준이 정해지지 않았으며 그 외의 경우는 적용불가인 경우'
                )
              }}
            </div>
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 3" no-hover>
          <q-td class="text-center th-td-style td1-style" :rowspan="1" :colspan="1">
            <div class="text-red">
              <q-chip color="red" text-color="white">
                {{ $language('적용불가') }}
              </q-chip>
            </div>
          </q-td>
          <q-td class="text-left th-td-style td2-style" :rowspan="1" :colspan="1">
            <div class="text-red">
              {{ $language('구성물질이 가지는 규제정보를 기준에 만족하지 않는 경우') }}
            </div>
          </q-td>
          <q-td class="text-center th-td-style td1-style" :rowspan="1" :colspan="1" />
          <q-td class="text-left th-td-style td2-style" :rowspan="1" :colspan="1" />
        </q-tr>
      </template>
    </c-table>
    <c-table
      ref="table-result"
      title="검증결과"
      :columns="gridResult.columns"
      :data="gridResult.data"
      :merge="gridResult.merge"
      :gridHeight="gridHeight"
      :gridHeightAuto="true"
      :usePaging="false"
      :filtering="false"
      :isExcelDown="false"
      :isFullScreen="false"
      :columnSetting="false"
    >
      <!-- 
        해당 테이블에서 체크하여 처리하는 것이 아닌 TO-BE를 통해 체크하여 처리
        selection="multiple"
        rowKey="regulatedItemCd" 
      -->
      <!-- 
        검증에 대한 값을 그대로 받는게 아닌 수정해서 적용할 수 있게 처리
        checkDisableColumn="statusFlag" 
      -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="saveData"
            mappingType="PUT"
            label="적용"
            icon="save"
            @beforeAction="saveInfo"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'statusFin'">
          <template v-if="props.row.statusFin === 'Y1'">
            <q-chip color="light-blue" text-color="white">
              {{ $language('적용가능') }}
            </q-chip>
          </template>
          <template v-else-if="props.row.statusFin === 'Y2'">
            <q-chip color="green" text-color="white">
              {{ $language('적용가능') }}
            </q-chip>
          </template>
          <template v-else-if="props.row.statusFin === 'N'">
            <q-chip color="red" text-color="white">
              {{ $language('적용불가') }}
            </q-chip>
          </template>
          <template v-else-if="props.row.statusFin === 'W1'">
            <q-chip color="grey" text-color="white">
              {{ $language('대기') }}
            </q-chip>
          </template>
          <template v-else-if="props.row.statusFin === 'W2'">
            <q-chip color="orange" text-color="white">
              {{ $language('대기') }}
            </q-chip>
          </template>
        </template>
      </template>
    </c-table>
    <c-table
      title=""
      :columns="regulGrid.columns"
      :data="regulGrid.data"
      customDataTr
      gridHeightAuto
      hideHeader
      hideBottom
      isDense
      :isTitle="false"
      :columnSetting="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :filtering="false"
    >
      <template v-slot:customDataTr="props">
        <q-tr :props="props" v-if="props.rowIndex === 0" no-hover>
          <q-td class="text-center th-td-style th2-style" :rowspan="1" :colspan="1">
            {{ $language('AS-IS (화학자재 기존규제)') }}
          </q-td>
          <q-td class="text-center th-td-style th2-style" :rowspan="1" :colspan="1">
            {{ $language('TO-BE (규제 검증결과 추천)') }}
          </q-td>
        </q-tr>
        <q-tr :props="props" v-if="props.rowIndex === 1" no-hover>
          <q-td
            class="text-left th-td-style td1-style"
            style="padding: 20px !important"
            :rowspan="1"
            :colspan="1"
          >
            <div class="divchklaw" v-for="(item, idx) in asis.bills" :key="`asis-bill${idx}`">
              <div class="groupTitle">{{ item.regulationBillName }}</div>
              <q-checkbox
                v-for="(regul, _idx) in item.reguls"
                :key="`asis-regul${_idx}`"
                class="customqcbox"
                dense
                color="orange-custom"
                true-value="Y"
                false-value="N"
                :disable="true"
                :label="regul.regulatedItemName"
                v-model="regul.val"
              />
            </div>
          </q-td>
          <q-td
            class="text-left th-td-style td3-style"
            style="padding: 20px !important"
            :rowspan="1"
            :colspan="1"
          >
            <div class="divchklaw" v-for="(item, idx) in tobe.bills" :key="`tobe-bill${idx}`">
              <div class="groupTitle">{{ item.regulationBillName }}</div>
              <q-checkbox
                v-for="(regul, _idx) in item.reguls"
                :key="`tobe-regul${_idx}`"
                class="customqcbox"
                dense
                color="orange-custom"
                true-value="Y"
                false-value="N"
                :label="regul.regulatedItemName"
                v-model="regul.val"
              />
            </div>
          </q-td>
        </q-tr>
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
import {
  billType,
  chemReviewRegulationType,
  chemReviewRegulatorVertificationType
} from './chemReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemReviewVerification'
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
const emits = defineEmits(['closePopup'])

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
  contentHeight: string
}
interface gridType {
  merge: Array<tableMergeType>
  columns: Array<tableColumnType>
  data: Array<chemReviewRegulatorVertificationType>
}
interface billRegulType {
  reguls: Array<chemReviewRegulationType>
  bills: Array<billType>
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
const saveData = ref({
  mdmChemReviewId: '',
  prodReguls: [] as Array<chemReviewRegulationType>
})
const asis = ref<billRegulType>({
  reguls: [],
  bills: []
})
const tobe = ref<billRegulType>({
  reguls: [],
  bills: []
})
const checkGrid = ref({
  columns: [
    { name: '1', field: '1' },
    { name: '2', field: '2' },
    { name: '3', field: '3' },
    { name: '4', field: '4' }
  ],
  data: [{}, {}, {}, {}]
})
const regulGrid = ref({
  columns: [
    { name: '1', field: '1' },
    { name: '2', field: '2' }
  ],
  data: [{}, {}]
})
const gridResult = ref<gridType>({
  merge: [
    { index: 0, colName: 'billName' },
    { index: 1, colName: 'regulatedItemName' }
  ],
  columns: [
    {
      name: 'billName',
      field: 'billName',
      label: '법규',
      align: 'left',
      sortable: true,
      style: 'width: 15%'
    },
    {
      name: 'regulatedItemName',
      field: 'regulatedItemName',
      label: '규제',
      align: 'center',
      sortable: true,
      style: 'width: 10%'
    },
    {
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '화학물질',
      align: 'left',
      sortable: true,
      style: 'width: 25%'
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      sortable: true,
      style: 'width: 10%'
    },
    {
      name: 'limitRepval',
      field: 'limitRepval',
      label: '대표 함유량(%)',
      align: 'center',
      sortable: true,
      style: 'width: 10%'
    },
    {
      name: 'appliStandSign',
      field: 'appliStandSign',
      label: '부등호',
      align: 'center',
      sortable: true,
      style: 'width: 10%'
    },
    {
      name: 'quantity',
      field: 'quantity',
      label: '정량값',
      align: 'right',
      sortable: true,
      style: 'width: 10%',
      type: 'cost'
    },
    {
      name: 'statusFin',
      field: 'statusFin',
      label: '상태',
      align: 'center',
      sortable: true,
      style: 'width: 10%',
      type: 'custom'
    }
  ],
  data: []
})
const isSave = ref(false)
const verifiUrl = ref('')
const listUrl = ref('')
const saveUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 300
      : 500
  if (height < 500) {
    height = 500
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
  verifiUrl.value = selectConfig.mdm.mam.review.verification.url
  listUrl.value = selectConfig.mdm.mam.review.regul.list.url
  saveUrl.value = transactionConfig.mdm.mam.review.regul.save.url
  // code setting
  // list setting
  getVerifi()
}
/******************************
 * TODO (목적): 화학자재 구성물질 규제 검증
 *******************************/
function getVerifi() {
  $http({
    url: verifiUrl.value,
    method: 'GET',
    params: {
      mdmChemReviewId: props.popupParam.mdmChemReviewId
    }
  }).then((_result: any) => {
    gridResult.value.data = _result.data
    getReguls()
  })
}
/******************************
 * TODO (목적): 법규별 규제정보 조회 및 검증에 따른 값 셋팅
 *******************************/
function getReguls() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      mdmChemReviewId: props.popupParam.mdmChemReviewId
    }
  }).then((_result: any) => {
    asis.value.reguls = _result.data
    tobe.value.reguls = _.map(_.cloneDeep(_result.data), (item) => {
      return _.assign(item, {
        val:
          _.findIndex(
            gridResult.value.data,
            (regulResult) =>
              regulResult.regulatedItemCd === item.regulatedItemCd && regulResult.statusFin !== 'N'
          ) > -1
            ? 'Y'
            : 'N'
      })
    }) // gridResult.data에 해당 항목이 있고 statusFin !== 'N'(적용불가가 아닌) 인 경우 > 'Y'
    // ⬇ 조건에 따라 D10010006의 val 조정
    const hasPrtr12 = tobe.value.reguls.some(
      (r) =>
        (r.regulatedItemCd === 'D10010007' || r.regulatedItemCd === 'D10010008') && r.val === 'Y'
    )
    const d10010006 = tobe.value.reguls.find((r) => r.regulatedItemCd === 'D10010006')
    if (d10010006) d10010006.val = hasPrtr12 ? 'Y' : 'N'

    asis.value.bills = []
    tobe.value.bills = []
    if (asis.value.reguls && asis.value.reguls.length > 0) {
      asis.value.bills = _.map(asis.value.reguls, (value) => {
        return {
          regulationBillCd: value['regulationBillCd'],
          regulationBillName: value['regulationBillName'],
          reguls: []
        }
      })
      asis.value.bills = _.uniqBy(asis.value.bills, (item) => {
        return item.regulationBillCd
      })
      tobe.value.bills = _.sortBy(_.cloneDeep(asis.value.bills), ['sortOrder', 'regulatedItemCd'])
      _.forEach(asis.value.bills, (bill) => {
        bill.reguls = _.filter(asis.value.reguls, { regulationBillCd: bill.regulationBillCd })
      })
      _.forEach(tobe.value.bills, (bill) => {
        bill.reguls = _.filter(tobe.value.reguls, { regulationBillCd: bill.regulationBillCd })
      })
    }
  })
}
/******************************
 * TODO (목적): 규제검증 적용 전 처리
 *******************************/
function saveInfo() {
  message.confirm({
    title: '확인',
    message: '적용하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      saveData.value.mdmChemReviewId = props.popupParam.mdmChemReviewId
      saveData.value.prodReguls = _.filter(tobe.value.reguls, { val: 'Y' })

      isSave.value = !isSave.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 규제검증 적용 후 처리
 *******************************/
function saveCallback() {
  message.requestSuccess()
  saveData.value = {
    mdmChemReviewId: '',
    prodReguls: []
  }
  emits('closePopup')
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
