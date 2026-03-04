<template>
  <div>
    <c-table
      ref="table"
      title="구매 전 검토 > 구성물질 > 규제항목 정량값"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :gridHeight="gridHeight"
      :editable="editable"
      :columnSetting="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :customTrClass="setTrClass"
      :filtering="false"
    >
      <template v-slot:table-header-append>
        <span style="font-size: 1em; color: red">
          {{
            $language(
              '※ 정량값이 두 개 이상인 규제항목은 해당 행의 색상이 강조 표시됩니다. 적용기준 내용을 참고하여 정량값을 입력하세요.'
            )
          }}
        </span>
      </template>
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-show="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveQuantity"
            @btnCallback="saveQuantityCallback"
          />
        </q-btn-group>
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
// import { chemReviewSubRegulQuantityType } from './chemReview'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemReviewQuantity'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
// const userStroe = useUserStore()
// const { user } = storeToRefs(userStroe)

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
    mdmChemReviewId: stringNull
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
const grid = ref({
  merge: [
    { index: 0, colName: 'mdmChemId' },
    { index: 1, colName: 'mdmChemId' },
    { index: 2, colName: 'regulationBillCd' }
  ],
  columns: [
    {
      fix: true,
      name: 'chemNmEn',
      field: 'chemNmEn',
      label: '구성물질',
      align: 'left',
      style: 'width:100px',
      sortable: true
    },
    {
      fix: true,
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      align: 'center',
      style: 'width:100px',
      sortable: false
    },
    {
      fix: true,
      name: 'billRegulName',
      field: 'billRegulName',
      label: '법규 - 규제항목',
      align: 'left',
      style: 'width:200px',
      sortable: true
    },
    {
      fix: true,
      required: true,
      name: 'quantity',
      field: 'quantity',
      label: '정량값',
      align: 'left',
      style: 'width:70px',
      sortable: true,
      type: 'text'
    },
    {
      label: '배출량조사대상물질 (PRTR 정량값)',
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
          style: 'width:90px'
        },
        {
          name: 'prtrSwcsTonQuantity',
          field: 'prtrSwcsTonQuantity',
          label: '취급량(톤/년)',
          align: 'right',
          sortable: true,
          style: 'width:90px'
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
          style: 'width:80px'
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
      name: 'appliStandContents',
      field: 'appliStandContents',
      label: '적용기준 내용',
      align: 'left',
      style: 'width:700px',
      sortable: true
    }
  ],
  data: []
})
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) + 200
      : 700
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
  listUrl.value = selectConfig.mdm.mam.review.quantity.list.url
  saveUrl.value = transactionConfig.mdm.mam.review.quantity.save.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 법규별 규제항목 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      mdmChemReviewId: props.popupParam.mdmChemReviewId
    }
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
// /******************************
//  * TODO (목적): 법규별 규제항목들 셋팅
//  * @param (1): 행 정보
//  * @return (반환): 법규별 규제항목들
//  *******************************/
// function comboItems(row: chemReviewSubRegulQuantityType) {
//   // 화학물질의 정량값이 있다는 가정 (예) 1.2(xxx),2.6 => code=1.2, codeName=1.2(xxx) / code2.6, codeName=2.6
//   const _comboItems: Array<codeMasterType> = []
//   const _split = _.split(row.appliStandQuantity, ', ')
//   if (_split && _split.length > 0) {
//     _.forEach(_split, (item) => {
//       let _idx = item.indexOf('(')
//       _idx = _idx > -1 ? _idx : item.length
//       const _code = item.substr(0, _idx)
//       if (Number.isNaN(_code)) return
//       _comboItems.push({
//         code: _code,
//         codeName: item
//       })
//     })
//   }
//   return _comboItems
// }
// /******************************
//  * TODO (목적): 참고사항 변경
//  * @param (1): 변경 데이터 값
//  * @param (2): 행 정보
//  *******************************/
// function changeSelect(data: any, row: chemReviewSubRegulQuantityType) {
//   /** 선택한 값이 number text에 들어가게 처리 */
//   row.quantity = data.value
//   if (row['editFlag'] !== 'C') {
//     row['editFlag'] = 'U'
//     row['chgUserId'] = user.value.userId
//   }
// }
/******************************
 * TODO (목적): 정량값 저장 전 처리
 *******************************/
function saveQuantity() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 정량값 저장 후 처리
 *******************************/
function saveQuantityCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * TODO (목적): 데이터 변경에 따른 수정자 정보 셋팅
 * @param (1): 행 전체 정보
 *******************************/
// function datachange(_props: any) {
//   if (_props.row['editFlag'] !== 'C') {
//     _props.row['editFlag'] = 'U'
//     _props.row['chgUserId'] = user.value.userId
//   }
// }

function setTrClass(_props: any) {
  return _props.row.pluralFlag === 'Y' ? 'bg-blue-1' : ''
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
