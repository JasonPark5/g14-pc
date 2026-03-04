<template>
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
    <c-card title="법규별 규제사항" class="cardClassDetailForm">
      <template v-slot:card-detail>
        <div class="col-12 chemLawRegulCheckbox" v-for="(item, idx) in bills" :key="idx">
          <div class="chemLawRegulBillDiv">{{ item.regulationBillName }}</div>
          <q-checkbox
            v-for="(regul, _idx) in item.reguls"
            :key="_idx"
            class="customqcbox"
            disable
            dense
            color="orange-custom"
            true-value="Y"
            false-value="N"
            :label="regul.regulatedItemName"
            v-model="regul.val"
          />
        </div>
      </template>
    </c-card>
    <c-dialog :param="popupOptions" />
  </div>
  <c-dialog :param="popupOptions" />
</template>
<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { billType, chemMaterialRegulatorType } from './chemMaterial'

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
  name: 'chemLawHistory'
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
    mdmHistoryId: string
    mdmChemMaterialId: string
  }
  contentHeight: stringNull
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
      mdmHistoryId: '',
      mdmChemMaterialId: ''
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
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const reguls = ref<Array<chemMaterialRegulatorType>>([])
const bills = ref<Array<billType>>([])
const listUrl = ref('')

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
  listUrl.value = selectConfig.mdm.mam.chem.materialRegul.historyDetail.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 화학자재 규제정보 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      mdmHistoryId: props.popupParam.mdmHistoryId,
      mdmChemMaterialId: props.popupParam.mdmChemMaterialId
    }
  }).then((_result: any) => {
    reguls.value = _result.data

    bills.value = []
    if (reguls.value && reguls.value.length > 0) {
      bills.value = _.map(reguls.value, (value) => {
        return {
          regulationBillCd: value['regulationBillCd'],
          regulationBillName: value['regulationBillName'],
          reguls: []
        }
      })
      bills.value = _.uniqBy(bills.value, (item: billType) => {
        return item.regulationBillCd
      })
      let i = 1
      _.forEach(bills.value, (bill) => {
        bill.regulationBillName = i + '. ' + bill.regulationBillName
        bill.reguls = _.filter(reguls.value, { regulationBillCd: bill.regulationBillCd })
        i++
      })
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
