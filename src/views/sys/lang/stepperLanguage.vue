<template>
  <div>
    <q-splitter v-model="splitterModel" :limits="[30, 70]" unit="%">
      <template v-slot:before>
        <c-table
          ref="grpTable"
          title="Stepper 그룹"
          tableId="grpTable"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="true"
          :columns="grpGrid.columns"
          :data="grpGrid.data"
          @rowClick="getMsts"
          :isExcelDown="false"
        />
      </template>
      <template v-slot:after>
        <c-table
          ref="mstTable"
          title="Stepper 마스터"
          tableId="mstTable"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :columns="mstGrid.columns"
          :data="mstGrid.data"
          selection="multiple"
          rowKey="stepperMstCd"
          :isExcelDown="false"
          :editable="editable"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <c-btn label="저장" icon="save" @btnClicked="saveMst" v-if="editable && isSelectGrp" />
          </template>
        </c-table>
      </template>
    </q-splitter>
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
  name: 'stepperLanguage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
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
interface gridType {
  columns: tableColumnType
  data: any
}
interface searchParamType {
  useFlag: stringNull
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
const splitterModel = ref(30)
const searchParam = ref<searchParamType>({
  useFlag: ''
})
const isSelectGrp = ref(false)
const selectedGrpCd = ref('')
const grplistUrl = ref('')
const mstlistUrl = ref('')
const mstSaveUrl = ref('')
const grpTable = ref<any>(null)
const mstTable = ref<any>(null)

const grpGrid = ref<gridType>({
  columns: [
    {
      name: 'stepperGrpCd',
      field: 'stepperGrpCd',
      label: '그룹코드',
      align: 'left',
      style: 'cursor:pointer;width:150px',
      sortable: false,
      required: true
    },
    {
      name: 'stepperGrpNm',
      field: 'stepperGrpNm',
      label: '그룹명',
      align: 'left',
      type: 'text',
      sortable: false,
      required: true
    }
  ],
  data: []
})
const mstGrid = ref<gridType>({
  columns: [
    {
      name: 'stepperMstCd',
      field: 'stepperMstCd',
      label: '코드',
      align: 'center',
      style: 'width:100px',
      required: true,
      sortable: false
    },
    {
      name: 'stepperMstNmKr',
      field: 'stepperMstNmKr',
      label: '타이틀',
      align: 'left',
      style: 'width:150px',
      type: 'text',
      required: true,
      sortable: false
    },
    {
      name: 'stepperMstNmEn',
      field: 'stepperMstNmEn',
      label: '타이틀-영어',
      align: 'left',
      style: 'width:150px',
      type: 'text',
      sortable: false
    },
    {
      name: 'stepperMstNmJa',
      field: 'stepperMstNmJa',
      label: '타이틀-일본어',
      align: 'left',
      style: 'width:150px',
      type: 'text',
      sortable: false
    },
    {
      name: 'stepperMstNmZhCn',
      field: 'stepperMstNmZhCn',
      label: '타이틀-중국어간체',
      align: 'left',
      style: 'width:150px',
      type: 'text',
      sortable: false
    },
    {
      name: 'stepperMstNmZhTw',
      field: 'stepperMstNmZhTw',
      label: '타이틀-중국어번체',
      align: 'left',
      style: 'width:150px',
      type: 'text',
      sortable: false
    }
  ],
  data: []
})

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
  editable.value = user.value.userId === 'U000000001' ? Boolean(route.meta.editable) : false
  // url setting
  grplistUrl.value = selectConfig.sys.stepper.grp.list.url
  mstlistUrl.value = selectConfig.sys.stepper.mst.list.url
  mstSaveUrl.value = transactionConfig.sys.stepper.mst.lang.url
  // code setting
  // list setting
  getGrps()
}
/******************************
 * TODO (목적): 마스터 목록 조회
 *******************************/
function getGrps() {
  $http({
    url: grplistUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grpGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getMsts(row: any) {
  if (row.editFlag != 'C') {
    isSelectGrp.value = true
    selectedGrpCd.value = row.stepperGrpCd

    mstGrid.value.data = []
    $http({
      url: $format(mstlistUrl.value, selectedGrpCd.value),
      method: 'GET'
    }).then((_result: any) => {
      mstGrid.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 스탭 저장
 *******************************/
function saveMst() {
  if (validTable(mstGrid.value.columns, mstGrid.value.data)) {
    const saveData: any = mstGrid.value.data.filter((x: any) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          $http({
            url: mstSaveUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            message.requestSuccess()
            getMsts({ stepperGrpCd: selectedGrpCd.value })
          })
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.', // 변경된 데이터가 없습니다.
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
