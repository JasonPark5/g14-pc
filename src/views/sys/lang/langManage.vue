<template>
  <div>
    <c-table
      ref="mstTable"
      title="다국어 목록"
      tableId="mstTable"
      :columnSetting="false"
      :usePaging="true"
      :hideBottom="false"
      :columns="mstGrid.columns"
      :data="mstGrid.data"
      selection="multiple"
      rowKey="languageKr"
      :isExcelDown="true"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="추가" icon="add" @btnClicked="addRowMst" v-if="editable && isManager" />
          <c-btn label="삭제" icon="remove" @btnClicked="removeMst" v-if="editable && isManager" />
          <c-btn label="저장" icon="save" @btnClicked="saveMst" v-if="editable && isManager" />
        </q-btn-group>
      </template>
    </c-table>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">한국어 키</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="hiddenlanguageKey" autofocus @keyup.enter="setMst" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="취소" @click="cancelMst" />
          <q-btn flat label="추가" @click="setMst" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  name: 'langManage'
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
const prompt = ref(false)
const isManager = ref(false)
const hiddenlanguageKey = ref('')
const mstlistUrl = ref('')
const checkUrl = ref('')
const mstSaveUrl = ref('')
const mstDeleteUrl = ref('')
const mstTable = ref<any>(null)

const mstGrid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'languageKey',
      field: 'languageKey',
      label: '한국어 키',
      align: 'left',
      sortable: false
    },
    {
      required: true,
      name: 'languageKr',
      field: 'languageKr',
      label: '한국어',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'languageEn',
      field: 'languageEn',
      label: '영문',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'languageJa',
      field: 'languageJa',
      label: '일본어',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'languageZhCn',
      field: 'languageZhCn',
      label: '중국어간체',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'languageZhTw',
      field: 'languageZhTw',
      label: '중국어번체',
      align: 'left',
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
  editable.value = Boolean(route.meta.editable)
  isManager.value = user.value.userId === 'U000000001'
  // url setting
  mstlistUrl.value = selectConfig.sys.language.list.url
  mstSaveUrl.value = transactionConfig.sys.language.save.url
  mstDeleteUrl.value = transactionConfig.sys.language.delete.url
  checkUrl.value = selectConfig.sys.language.check.url
  // code setting
  // list setting
  getMsts()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getMsts() {
  $http({
    url: mstlistUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    mstGrid.value.data = _result.data
  })
}

/******************************
 * TODO (목적): 코드 추가
 *******************************/
function addRowMst() {
  prompt.value = true
}
/******************************
 * TODO (목적): 코드 취소
 *******************************/
function cancelMst() {
  hiddenlanguageKey.value = ''
  prompt.value = false
}
/******************************
 * TODO (목적): 코드 지정
 *******************************/
function setMst() {
  $http({
    url: checkUrl.value,
    method: 'GET',
    params: { languageKey: hiddenlanguageKey.value }
  }).then((_result: any) => {
    if (_result.data === 0) {
      prompt.value = false
      mstGrid.value.data.push({
        editFlag: 'C',
        languageKey: hiddenlanguageKey.value,
        languageKr: '',
        languageEn: '',
        languageJa: '',
        languageZhCn: '',
        languageZhTw: '',
        useFlag: 'Y'
      })
      hiddenlanguageKey.value = ''
    } else {
      message.alert({
        title: '안내',
        message: '동일한 한국어 키가 존재합니다.',
        type: 'warning' // success / info / warning / error
      })
      hiddenlanguageKey.value = ''
      return
    }
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveMst() {
  if (validTable(mstGrid.value.columns, mstGrid.value.data)) {
    const saveData: any = mstGrid.value.data.filter((x: any) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
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
            getMsts()
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
 * TODO (목적): 삭제
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

          _.forEach(selectData, (item) => {
            mstGrid.value.data = _.reject(mstGrid.value.data, item)
          })
          mstTable.value.compoTable.clearSelection()
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
