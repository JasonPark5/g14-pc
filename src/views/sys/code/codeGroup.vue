<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-table
        ref="domainTable"
        title="코드도메인"
        tableId="domainTable"
        :columnSetting="false"
        :isFullScreen="false"
        :usePaging="false"
        :filtering="false"
        :columns="domainGrid.columns"
        :data="domainGrid.data"
        selection="single"
        rowKey="domainCd"
        :isExcelDown="false"
        @rowClick="getGrps"
        :editable="editable"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn label="추가" icon="add" @btnClicked="addRowDomain" v-if="editable" />
            <c-btn label="삭제" icon="remove" @btnClicked="removeDomain" v-if="editable" />
            <c-btn label="저장" icon="save" @btnClicked="saveDomain" v-if="editable" />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-table
        ref="grpTable"
        title="코드그룹"
        tableId="grpTable"
        :columnSetting="false"
        :isFullScreen="false"
        :usePaging="false"
        :filtering="true"
        :columns="grpGrid.columns"
        :data="grpGrid.data"
        selection="multiple"
        :isExcelDown="false"
        rowKey="codeGrpCd"
        :editable="editable"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              label="추가"
              icon="add"
              @btnClicked="addRowGrp"
              v-if="editable && isSelectDomain"
            />
            <c-btn
              label="삭제"
              icon="remove"
              @btnClicked="removeGrp"
              v-if="editable && isSelectDomain"
            />
            <c-btn
              label="저장"
              icon="save"
              @btnClicked="saveGrp"
              v-if="editable && isSelectDomain"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
  </div>
  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">도메인 코드</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="hiddenGrpCd" autofocus @keyup.enter="setGrp" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="$language('취소')" @click="cancelGrp" />
        <q-btn flat :label="$language('추가')" @click="setGrp" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="promptMst" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">그룹코드</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="hiddenMstCd" autofocus @keyup.enter="setMst" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat :label="$language('취소')" @click="cancelMst" />
        <q-btn flat :label="$language('추가')" @click="setMst" />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
  name: 'codeGroup'
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
  srchDomainCd: stringNull
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
const promptMst = ref(false)
const hiddenGrpCd = ref('')
const hiddenMstCd = ref('')
const searchParam = ref<searchParamType>({
  srchDomainCd: null
})
const isSelectDomain = ref(false)
const selectedDomainCd = ref('')
const domainlistUrl = ref('')
const domainSaveUrl = ref('')
const domainDeleteUrl = ref('')
const grouplistUrl = ref('')
const groupSaveUrl = ref('')
const groupDeleteUrl = ref('')
const grpTable = ref<any>(null)
const domainTable = ref<any>(null)

const domainGrid = ref<gridType>({
  columns: [
    {
      name: 'domainCd',
      field: 'domainCd',
      label: '도메인 코드',
      align: 'left',
      style: 'width: 30%; cursor:pointer',
      sortable: false
    },
    {
      name: 'domainNm',
      field: 'domainNm',
      label: '도메인 명',
      required: true,
      align: 'left',
      type: 'text',
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

const grpGrid = ref<gridType>({
  columns: [
    {
      name: 'codeGrpCd',
      field: 'codeGrpCd',
      label: '그룹코드',
      align: 'left',
      style: 'width: 40%',
      sortable: false
    },
    {
      name: 'codeGrpNm',
      field: 'codeGrpNm',
      label: '코드 그룹명',
      required: true,
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      name: 'systemFlag',
      field: 'systemFlag',
      label: '시스템전용',
      align: 'center',
      style: 'width:80px',
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
  domainlistUrl.value = selectConfig.sys.code.domain.list.url
  domainSaveUrl.value = transactionConfig.sys.code.domain.save.url
  domainDeleteUrl.value = transactionConfig.sys.code.domain.delete.url
  grouplistUrl.value = selectConfig.sys.code.group.list.url
  groupSaveUrl.value = transactionConfig.sys.code.group.save.url
  groupDeleteUrl.value = transactionConfig.sys.code.group.delete.url
  // code setting
  // list setting
  getDomains()
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
 * TODO (목적): 코드 도메인 목록 조회
 *******************************/
function getDomains() {
  $http({
    url: domainlistUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    domainGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 코드 그룹 목록 조회
 *******************************/
function getGrps(row: any) {
  if (row.editFlag != 'C') {
    isSelectDomain.value = true
    selectedDomainCd.value = row.domainCd

    grpGrid.value.data = []
    $http({
      url: $format(grouplistUrl.value, selectedDomainCd.value),
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      grpGrid.value.data = _result.data
    })
  }
}
/******************************
 * TODO (목적): 도메인 저장
 *******************************/
function saveDomain() {
  if (validTable(domainGrid.value.columns, domainGrid.value.data)) {
    const saveData: any = domainGrid.value.data.filter((x: any) => {
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
            url: domainSaveUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            message.requestSuccess()
            getDomains()
            rowRemoveSelect()
            isSelectDomain.value = false
            grpGrid.value.data = []
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
 * TODO (목적): 도메인 추가 팝업오픈
 *******************************/
function addRowDomain() {
  rowRemoveSelect()
  isSelectDomain.value = false
  grpGrid.value.data = []
  prompt.value = true
}
/******************************
 * TODO (목적): 그룹 추가 취소
 *******************************/
function cancelGrp() {
  hiddenGrpCd.value = ''
  prompt.value = false
}
/******************************
 * TODO (목적): 도메인 추가
 *******************************/
function setGrp() {
  prompt.value = false
  domainGrid.value.data.push({
    editFlag: 'C',
    domainCd: hiddenGrpCd.value,
    domainNm: '',
    useFlag: 'Y'
  })
  hiddenGrpCd.value = ''
}
/******************************
 * TODO (목적): 도메인 삭제
 *******************************/
function removeDomain() {
  const selectData = domainTable.value.getSelected()
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
          url: domainDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()

          _.forEach(selectData, (item) => {
            domainGrid.value.data = _.reject(domainGrid.value.data, item)
          })
          domainTable.value.compoTable.clearSelection()
          isSelectDomain.value = false
          grpGrid.value.data = []
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 그룹 저장
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
            url: groupSaveUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            message.requestSuccess()
            getGrps({ domainCd: selectedDomainCd.value })
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
 * TODO (목적): 그룹 팝업
 *******************************/
function addRowGrp() {
  promptMst.value = true
}
/******************************
 * TODO (목적): 그룹 팝업 취소
 *******************************/
function cancelMst() {
  hiddenMstCd.value = ''
  promptMst.value = false
}
/******************************
 * TODO (목적): 그룹 추가
 *******************************/
function setMst() {
  promptMst.value = false
  grpGrid.value.data.push({
    editFlag: 'C',
    domainCd: selectedDomainCd.value,
    codeGrpCd: hiddenMstCd.value,
    codeGrpNm: '',
    systemFlag: 'N'
  })
  hiddenMstCd.value = ''
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
          url: groupDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()

          getGrps({ domainCd: selectedDomainCd.value })
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
