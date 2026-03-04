<template>
  <div class="col-lg-12 col-md-12 col-sm-12">
    <c-table
      ref="table"
      title="취급일지 결과 목록"
      :columns="resultGrid.columns"
      gridHeight="500px"
      :data="journal.resultList"
      :merge="resultGrid.merge"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable && !disabled"
      rowKey="chmDangerJournalResultId"
      @table-data-change="tableDataChange"
    >
      <template v-if="prevList && prevList.length > 0" v-slot:suffixTitle>
        <span style="font-size: 0.86em; color: tomato; margin: 0 10px">
          {{
            $language(
              '※ 저장품목에 대한 전일 재고량입니다. 전일 재고량은 입고량 입력시 자동 계산됩니다.'
            )
          }}
        </span>
        <q-chip
          v-for="(prev, index) in prevList"
          :key="index"
          outline
          square
          color="primary"
          class="q-ma-none customchipdept"
        >
          {{ '[' + prev.chmDangerResultDate + '] ' }}
          {{ prev.chmDangerResultName }} : {{ toThousandFilter(Number(prev.chmDangerStock)) }}
        </q-chip>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'chmDangerQuanSum'">
          <span v-html="getchmDangerQuanSum(props.row.chmDangerQuanSum)" />
        </template>
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
import { dangerJournalType } from './dangerStorage'
import { toThousandFilter } from '@utils/common'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'dangerJournalResult'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
interface propType {
  journal?: dangerJournalType
  prevList?: Array<any>
  resultGrid?: gridType
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  prevData?: Array<any>
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  journal: () => {
    return {
      resultList: []
    }
  },
  resultGrid: () => {
    return {
      columns: [],
      merge: [],
      height: '520px'
    }
  },
  prevList: () => []
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
const disabled = computed(
  () =>
    props.journal.chmDangerCompleteFlag === 'Y' || props.journal.approvalStatusCd === 'ASC0000001'
)
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
 * TODO (목적): 셀 값에 따라 다른 표시 및 효과 추가
 *******************************/
function getchmDangerQuanSum(_val?: numberNull) {
  let addTxt = ''
  if (_val === null) {
    _val = ''
    addTxt = ''
  } else if (_val > props.journal.chmDangerCount) {
    addTxt = ` <div class="quansumcls quansumOver blinking"> ${$language('초과')}</div>`
  } else if (_val < props.journal.chmDangerCount) {
    addTxt = ` <div class="quansumcls quansumDown">${$language('미만')}</div>`
  } else if (_val === props.journal.chmDangerCount) {
    addTxt = ' <div class="quansumcls quansumEqual">FULL</div>'
  }
  return _val + addTxt
}
/******************************
 * TODO (목적): 테이블 내 입력값 변경에 따른 계산
 *******************************/
function tableDataChange(_props: any, col: any) {
  if (col.name === 'chmDangerIn' || col.name === 'chmDangerOut') {
    const filterData = _.sortBy(
      _.filter(props.journal.resultList, { chmDangerResultName: _props.row.chmDangerResultName }),
      'chmDangerResultDate'
    )
    const _idx = _.findIndex(filterData, { chmDangerResultDate: _props.row.chmDangerResultDate })
    const __idx = _.findIndex(props.prevList, {
      chmDangerResultName: _props.row.chmDangerResultName
    })
    if (_idx > 0) {
      // 인덱스값이 있을 경우 전일 재고량 + 입고량 - 사용량 계산 // 없을 경우 전일 재고량 없이 계산
      _props.row.chmDangerStock =
        (__idx >= 0 ? Number(filterData[_idx - 1].chmDangerStock) : 0) +
        Number(_props.row.chmDangerIn) -
        Number(_props.row.chmDangerOut)
      _props.row.chmDangerQuan = _props.row.chmDangerStock / Number(_props.row.calcuMethod)
    } else {
      // 전일 재고량 -> 날짜마다 구분이 여러개이기 때문에 필터링 시켜야함. // 인덱스값이 있을 경우 전일 재고량 + 입고량 - 사용량 계산
      _props.row.chmDangerStock =
        (__idx >= 0 ? Number(props.prevList[__idx].chmDangerStock) : 0) +
        Number(_props.row.chmDangerIn) -
        Number(_props.row.chmDangerOut)
      _props.row.chmDangerQuan = _props.row.chmDangerStock / Number(_props.row.calcuMethod)
    }
    if (_props.row.editFlag !== 'C') {
      _props.row.editFlag = 'U'
      _props.row.chgUserId = user.value.userId
    }
    // 날짜의 입고량을 입력시 그 날 이후 전부 계산시킴
    if (_idx + 1 < filterData.length) {
      for (let i = _idx + 1; i < filterData.length; i++) {
        filterData[i].chmDangerStock =
          Number(filterData[i - 1].chmDangerStock) +
          Number(filterData[i].chmDangerIn) -
          Number(filterData[i].chmDangerOut)
        filterData[i].chmDangerQuan =
          filterData[i].chmDangerStock / Number(filterData[i].calcuMethod)
        if (filterData[i].editFlag !== 'C') {
          filterData[i].editFlag = 'U'
          filterData[i].chgUserId = user.value.userId
        }
      }
    }
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
