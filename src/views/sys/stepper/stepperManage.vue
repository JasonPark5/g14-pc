<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
      <c-table
        ref="grpTable"
        title="Stepper 그룹"
        :columnSetting="false"
        :isFullScreen="false"
        :usePaging="false"
        :isExcelDown="false"
        :columns="grpGrid.columns"
        :data="grpGrid.data"
        selection="single"
        rowKey="stepperGrpCd"
        @rowClick="getMsts"
        :editable="editable"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button v-if="editable">
          <c-btn label="" icon="add" @btnClicked="addRowGrp" />
          <c-btn label="" icon="remove" @btnClicked="removeGrp" />
          <c-btn label="" icon="save" @btnClicked="saveGrp" />
        </template>
      </c-table>
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Stepper 그룹코드</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-input dense v-model="hiddenStepperGrpCd" autofocus @keyup.enter="setGrp" />
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$language('취소')" @click="cancelGrp" />
            <q-btn flat :label="$language('추가')" @click="setGrp" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
      <c-table
        ref="mstTable"
        title="Stepper 마스터"
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
          <c-btn label="추가" icon="add" @btnClicked="addRowMst" v-if="editable && isSelectGrp" />
          <c-btn
            label="삭제"
            icon="remove"
            @btnClicked="removeMst"
            v-if="editable && isSelectGrp"
          />
          <c-btn label="저장" icon="save" @btnClicked="saveMst" v-if="editable && isSelectGrp" />
        </template>
      </c-table>
      <q-dialog v-model="promptMst" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">코드</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="hiddenStepperMstCd" autofocus @keyup.enter="setMst" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="$language('취소')" @click="cancelMst" />
            <q-btn flat :label="$language('추가')" @click="setMst" />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
  name: 'stepperManage'
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
const $language = inject('$language') as GetTranLanguageFunction

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
const searchParam = ref<searchParamType>({
  useFlag: ''
})
const prompt = ref(false)
const promptMst = ref(false)
const isSelectGrp = ref(false)
const selectedGrpCd = ref('')
const grplistUrl = ref('')
const grpSaveUrl = ref('')
const grpDeleteUrl = ref('')
const mstlistUrl = ref('')
const mstSaveUrl = ref('')
const mstDeleteUrl = ref('')
const hiddenStepperGrpCd = ref('')
const hiddenStepperMstCd = ref('')
const grpTable = ref<any>(null)
const mstTable = ref<any>(null)

const grpGrid = ref<gridType>({
  columns: [
    {
      name: 'stepperGrpCd',
      field: 'stepperGrpCd',
      label: '그룹코드',
      align: 'left',
      style: 'cursor:pointer;width:100px',
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
      name: 'remark',
      field: 'remark',
      label: '설명',
      align: 'left',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'iconClass',
      field: 'iconClass',
      label: '아이콘',
      align: 'center',
      style: 'width:90px',
      type: 'text',
      sortable: false
    },
    {
      name: 'colorClass',
      field: 'colorClass',
      label: '색상',
      align: 'center',
      style: 'width:90px',
      type: 'text',
      sortable: true
    },
    {
      name: 'vuePath',
      field: 'vuePath',
      label: '뷰파일경로',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순서',
      style: 'width:40px',
      align: 'center',
      type: 'number',
      required: true,
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용',
      align: 'center',
      style: 'width:40px',
      type: 'check',
      true: 'Y',
      false: 'N',
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
  grpSaveUrl.value = transactionConfig.sys.stepper.grp.save.url
  grpDeleteUrl.value = transactionConfig.sys.stepper.grp.delete.url
  mstlistUrl.value = selectConfig.sys.stepper.mst.list.url
  mstSaveUrl.value = transactionConfig.sys.stepper.mst.save.url
  mstDeleteUrl.value = transactionConfig.sys.stepper.mst.delete.url
  // code setting
  // list setting
  getGrps()
}
/******************************
 * TODO (목적): 선택한 항목 제거
 *******************************/
function rowRemoveSelect() {
  const _table = document.getElementsByClassName('bg-light-blue-1')[0]
  if (_table) {
    _table.classList.remove('bg-light-blue-1')
  }
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
 * TODO (목적): 그룹마스터 저장
 *******************************/
function saveGrp() {
  if (validTable(grpGrid.value.columns, grpGrid.value.data)) {
    const saveData: any = grpGrid.value.data.filter((x: any) => {
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
            url: grpSaveUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            message.requestSuccess()
            getGrps()
            rowRemoveSelect()
            isSelectGrp.value = false
            mstGrid.value.data = []
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
 * TODO (목적): 그룹 코드 추가
 *******************************/
function addRowGrp() {
  rowRemoveSelect()
  isSelectGrp.value = false
  mstGrid.value.data = []
  prompt.value = true
}
/******************************
 * TODO (목적): 그룹 코드 취소
 *******************************/
function cancelGrp() {
  hiddenStepperGrpCd.value = ''
  prompt.value = false
}
/******************************
 * TODO (목적): 그룹 코드 팝업닫기
 *******************************/
function setGrp() {
  prompt.value = false
  grpGrid.value.data.push({
    editFlag: 'C',
    stepperGrpCd: hiddenStepperGrpCd.value,
    stepperGrpNm: ''
  })
  hiddenStepperGrpCd.value = ''
}
/******************************
 * TODO (목적): 그룹 삭제
 *******************************/
function removeGrp() {
  const selectData = grpTable.value.getSelected()
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
        $http({
          url: grpDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getGrps()
          rowRemoveSelect()
          isSelectGrp.value = false
          mstGrid.value.data = []
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}

/******************************
 * TODO (목적): 스탭 코드 추가
 *******************************/
function addRowMst() {
  promptMst.value = true
}
/******************************
 * TODO (목적): 스탭 코드 취소
 *******************************/
function cancelMst() {
  hiddenStepperMstCd.value = ''
  promptMst.value = false
}
/******************************
 * TODO (목적): 스탭 코드 팝업닫기
 *******************************/
function setMst() {
  promptMst.value = false
  mstGrid.value.data.push({
    editFlag: 'C',
    stepperGrpCd: selectedGrpCd.value,
    stepperMstCd: hiddenStepperMstCd.value,
    stepperMstNm: '',
    remark: '',
    iconClass: '',
    colorClass: '',
    vuePath: '',
    sortOrder: '',
    useFlag: 'Y'
  })
  hiddenStepperMstCd.value = ''
}
/******************************
 * TODO (목적): 스탭 삭제
 *******************************/
function removeMst() {
  const selectData = mstTable.value.getSelected()
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
        $http({
          url: mstDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getMsts({ stepperGrpCd: selectedGrpCd.value })
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
