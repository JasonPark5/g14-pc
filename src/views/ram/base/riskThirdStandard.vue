<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <c-table
      ref="table"
      title="3단계 판단기준 목록"
      tableId="riskHazrd01"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
      @table-data-change="tableDataChange"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" :showLoading="false" label="추가" icon="add" @btnClicked="add" />
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveRiskThirdStandard"
            @btnCallback="saveRiskThirdStandardCallback"
          />
          <!-- <c-btn label="검색" icon="search" @btnClicked="getList" /> -->
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'riskColor'">
          <div :style="`background-color:${props.row.riskColor};height:100%;`" />
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
import { riskThirdStandardType } from './riskThirdStandard'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskThirdStandard'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
/** message 호출 */
const message = useMessageStore()

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
// interface searchParamType {
//   plantCd: stringNull
// }
interface gridType {
  columns: tableColumnType
  data: Array<riskThirdStandardType>
}

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
// const searchParam = ref<searchParamType>({
//   plantCd: null
// })
const grid = ref<gridType>({
  columns: [],
  data: []
})
const riskAcceptItems = ref<any>([])
const listUrl = ref('')
const checkUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const table = ref<any>(null)

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
  listUrl.value = selectConfig.ram.riskThirdStandard.list.url
  checkUrl.value = selectConfig.ram.riskThirdStandard.check.url
  saveUrl.value = transactionConfig.ram.riskThirdStandard.save.url
  // code setting
  getComboItems('RAM_RISK_ACCEPT_CD').then((_result) => {
    riskAcceptItems.value = _result
    grid.value.columns = [
      {
        name: 'plantCd',
        field: 'plantCd',
        label: '사업장',
        align: 'center',
        style: 'width:100px',
        sortable: true,
        required: true,
        type: 'plant'
      },
      {
        name: 'ramRiskLevelCd',
        field: 'ramRiskLevelCd',
        label: '위험수준',
        align: 'center',
        style: 'width:140px',
        sortable: true,
        required: true,
        type: 'select',
        itemText: 'codeName',
        itemValue: 'code',
        codeGroupCd: 'RAM_RISK_LEVEL_CD'
      },
      {
        name: 'ramRiskAcceptCd',
        field: 'ramRiskAcceptCd',
        label: '허용가능 수준',
        align: 'left',
        style: 'width:100px',
        sortable: true,
        required: true,
        type: 'select',
        itemText: 'codeName',
        itemValue: 'code',
        comboItems: riskAcceptItems.value
      },
      {
        name: 'riskColor',
        field: 'riskColor',
        label: '위험색상',
        align: 'center',
        style: 'width:90px',
        sortable: true,
        type: 'custom'
      },
      {
        name: 'judgmentCriteria',
        field: 'judgmentCriteria',
        label: '판단기준',
        style: 'width:300px',
        align: 'left',
        sortable: true,
        type: 'textarea'
      }
    ]
  })
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET'
    // params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

/******************************
 * TODO (목적): 테이블 데이터 변경시 이벤트
 *******************************/
function tableDataChange(_props: any, _col: any) {
  if (_col.name === 'ramRiskAcceptCd') {
    const accept = _.find(riskAcceptItems.value, { code: _props.row.ramRiskAcceptCd })
    if (accept) {
      _props.row.riskColor = accept.attrVal1
    } else {
      _props.row.riskColor = 'white'
    }
  }
}
/******************************
 * TODO (목적): 등록
 *******************************/
function add() {
  if (!grid.value.data) {
    grid.value.data = []
  }
  grid.value.data.splice(0, 0, {
    ramRiskThirdStandardId: uid(), // 3단계 판단기준 일련번호
    plantCd: null, // 사업장코드
    ramRiskLevelCd: null, // 위험수준 코드
    judgmentCriteria: '', // 판단기준
    ramRiskAcceptCd: null, // 허용가능 수준
    riskColor: 'white', // 위험색상
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveRiskThirdStandard() {
  if (validTable(grid.value.columns, grid.value.data)) {
    const plants = _.uniq(_.map(grid.value.data, 'plantCd'))
    if (plants && plants.length > 0) {
      const check = _.isEmpty(
        _.pickBy(
          _.countBy(grid.value.data, (_item) => {
            return [_item.plantCd, _item.ramRiskLevelCd]
          }),
          (count) => {
            return count > 1
          }
        )
      )

      if (check) {
        $http({
          url: checkUrl.value,
          method: 'POST',
          data: _.map(
            _.filter(grid.value.data, (item2) => {
              return item2.editFlag === 'C' || item2.editFlag === 'U'
            }),
            (item3) => {
              return {
                plantCd: item3.plantCd,
                ramRiskLevelCd: item3.ramRiskLevelCd,
                ramRiskThirdStandardId: item3.editFlag !== 'C' ? item3.ramRiskThirdStandardId : null
              }
            }
          )
        }).then((_result: any) => {
          if (_result.data > 0) {
            message.alert({
              title: '안내',
              message: '동일한 데이터가 존재합니다. \n[사업장, 위험수준]',
              type: 'warning' // success / info / warning / error
            })
            getList()
          } else {
            message.confirm({
              title: '안내',
              message: '저장하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                isSave.value = !isSave.value
              },
              cancelCallback: () => {}
            })
          }
        })
      } else {
        message.alert({
          title: '안내',
          message: '동일한 데이터가 존재합니다. \n[사업장, 위험수준]',
          type: 'warning' // success / info / warning / error
        })
      }
    } else {
      message.alert({
        title: '안내',
        message: '저장할 데이터가 없습니다.',
        type: 'warning' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 저장 후 callback
 *******************************/
function saveRiskThirdStandardCallback() {
  message.requestSuccess()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
