<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search">
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-radio
            :editable="editable"
            :comboItems="useFlagItems"
            label="사용여부"
            name="useFlag"
            v-model:value="searchParam.useFlag">
          </c-radio>
        </div>
      </template>
    </c-search-box> -->
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table1"
          title="유해인자 대분류"
          tableId="mstTable"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :isExcelDown="false"
          :columns="mstGrid.columns"
          :data="mstGrid.data"
          rowKey="code"
          @rowClick="rowClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <c-btn label="추가" icon="add" @btnClicked="addrowType" v-if="editable" />
            <c-btn label="저장" icon="save" @btnClicked="saveType" v-if="editable" />
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'customCol'">
              <q-icon
                v-if="props.row.editFlag !== 'C'"
                name="arrow_forward_ios"
                size="sm"
                color="blue"
                class="cursor-pointer"
                @click.stop="rowClick(props.row)"
              />
            </template>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table2"
          title="유해인자 중분류"
          tableId="table"
          :columnSetting="false"
          :isFullScreen="false"
          :isExcelDown="false"
          :columns="grid.columns"
          :data="grid.data"
          rowKey="code"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="추가" icon="add" @btnClicked="addrowIns" v-if="editable" />
              <c-btn label="저장" icon="save" @btnClicked="saveIns" v-if="editable" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
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
  name: 'harmFulTypeMaster'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
const mstGrid = ref<gridType>({
  columns: [
    {
      name: 'codeName',
      field: 'codeName',
      label: '대분류',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      style: 'width:70px',
      align: 'center',
      type: 'number',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:70px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '중분류',
      style: 'width:70px',
      align: 'center',
      type: 'custom',
      sortable: false
    }
  ],
  data: []
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'codeName',
      field: 'codeName',
      label: '중분류',
      align: 'left',
      style: 'width:250px',
      type: 'text',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      style: 'width:70px',
      align: 'center',
      type: 'number',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:70px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    }
  ],
  data: []
})
const popupData = ref({
  first: '',
  type: null,
  plantCd: ''
})
const editable = ref(true)
const table1 = ref<any>(null)
const table2 = ref<any>(null)

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
  getCodeMst()
}
/******************************
 * TODO (목적): 코드 내용 조회
 *******************************/
function getCodeMst() {
  grid.value.data = []
  getComboItems('HAZARD_CLASS_FST_CD').then((_result: any) => {
    mstGrid.value.data = _result
  })
}
/******************************
 * TODO (목적): 행클릭시 우측테이블에 세부항목 표시
 *******************************/
function rowClick(row: any) {
  getComboItems('HAZARD_CLASS_SEC_CD', row.code).then((_result: any) => {
    grid.value.data = _result
    popupData.value.first = row.code
  })
}
/******************************
 * TODO (목적): 좌측 대분류 테이블 행추가
 *******************************/
function addrowType() {
  const len = (mstGrid.value.data ? mstGrid.value.data.length : 0) + 1
  mstGrid.value.data?.push({
    codeGrpCd: 'HAZARD_CLASS_FST_CD', // 코드그룹
    code: uid(), // 코드
    codeName: '', // 코드명
    useFlag: 'Y', // 사용여부
    sortOrder: len, //
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 우측 중분류 테이블 행추가
 *******************************/
function addrowIns() {
  const len = (grid.value.data ? grid.value.data.length : 0) + 1
  grid.value.data?.push({
    codeGrpCd: 'HAZARD_CLASS_SEC_CD', // 코드그룹
    code: uid(), // 코드
    codeName: '', // 코드명
    useFlag: 'Y', // 사용여부
    sortOrder: len, //
    attrVal1: popupData.value.first,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 좌측 대분류 저장
 *******************************/
function saveType() {
  const checkItem = ['codeName', 'sortOrder']
  let isConti = true
  _.forEach(mstGrid.value.data, (item) => {
    _.forEach(checkItem, (check) => {
      if (!item[check]) {
        isConti = false
        return false
      }
    })
  })
  if (!isConti) {
    message.alert({
      title: '안내',
      message: '필수 입력값을 입력해 주세요. [대분류, 순번]',
      type: 'warning' // success / info / warning / error
    })
  } else {
    const saveData = mstGrid.value.data?.filter((x) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData && saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: transactionConfig.sai.hazard.master.insert.url,
            method: 'POST',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            getCodeMst()
          })
        },
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.',
        type: 'info' // success / info / warning / error
      })
    }
  }
}
/******************************
 * TODO (목적): 우측 중분류 저장
 *******************************/
function saveIns() {
  const checkItem = ['codeName', 'useFlag']
  let isConti = true
  _.forEach(grid.value.data, (item) => {
    _.forEach(checkItem, (check) => {
      if (!item[check]) {
        isConti = false
        return false
      }
    })
  })
  if (!isConti) {
    message.alert({
      title: '안내',
      message: '필수 입력값을 입력해 주세요. [중분류, 사용여부]',
      type: 'warning' // success / info / warning / error
    })
  } else {
    const saveData = grid.value.data?.filter((x) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData && saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: transactionConfig.sai.hazard.master.insert.url,
            method: 'POST',
            data: saveData
          }).then(() => {
            message.requestSuccess()
            rowClick({ code: popupData.value.first })
          })
        },
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.',
        type: 'info' // success / info / warning / error
      })
    }
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
