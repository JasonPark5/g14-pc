<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-search-box>
          <template v-slot:search>
            <div class="col-12">
              <c-select
                :comboItems="domainItems"
                type="search"
                itemText="domainNm"
                itemValue="domainCd"
                name="domain"
                label="코드 도메인"
                v-model:value="searchParam.srchDomainCd"
                @update:value="getCodeGroup"
              />
            </div>
          </template>
        </c-search-box>
        <c-table
          ref="grpTable"
          title="코드그룹"
          tableId="grpTable"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :columns="grpGrid.columns"
          :isExcelDown="false"
          :data="grpGrid.data"
          @rowClick="getCodeMst"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <c-btn label="검색" icon="search" @btnClicked="getCodeGroup" />
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="mstTable"
          title="코드 다국어관리"
          tableId="mstTable"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          :filtering="false"
          :columns="mstGrid.columns"
          :isExcelDown="false"
          :data="mstGrid.data"
          :editable="editable"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                label="저장"
                icon="save"
                @btnClicked="saveMst"
                v-if="editable && isSelectGrp"
              />
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
  name: 'codeLanguage'
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
const searchParam = ref<searchParamType>({
  srchDomainCd: null
})
const isSelectGrp = ref(false)
const selectedGroupCd = ref('')
const domainItems = ref<any>([])
const domainlistUrl = ref('')
const grouplistUrl = ref('')
const mstSaveUrl = ref('')
const mstlistUrl = ref('')
const grpTable = ref<any>(null)
const mstTable = ref<any>(null)

const grpGrid = ref<gridType>({
  columns: [
    {
      name: 'codeGrpCd',
      field: 'codeGrpCd',
      label: '코드 그룹',
      align: 'center',
      style: 'width:50%',
      sortable: true
    },
    {
      name: 'codeGrpNm',
      field: 'codeGrpNm',
      label: '그룹명',
      style: 'width:50%',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
const mstGrid = ref<gridType>({
  columns: [
    {
      name: 'code',
      field: 'code',
      label: '코드',
      align: 'center',
      style: 'width:140px',
      sortable: false
    },
    {
      name: 'codeNameKr',
      field: 'codeNameKr',
      label: '코드명 국문',
      align: 'left',
      type: 'text',
      required: true,
      sortable: false,
      style: 'width:18%'
    },
    {
      name: 'codeNameEn',
      field: 'codeNameEn',
      label: '코드명 영문',
      align: 'left',
      type: 'text',
      sortable: false,
      style: 'width:18%'
    },
    {
      name: 'codeNameJa',
      field: 'codeNameJa',
      label: '코드명 일문',
      align: 'left',
      type: 'text',
      sortable: false,
      style: 'width:18%'
    },
    {
      name: 'codeNameZhCn',
      field: 'codeNameZhCn',
      label: '코드명 중국어간체',
      align: 'left',
      type: 'text',
      sortable: false,
      style: 'width:18%'
    },
    {
      name: 'codeNameZhTw',
      field: 'codeNameZhTw',
      label: '코드명 중국어번체',
      align: 'left',
      type: 'text',
      sortable: false,
      style: 'width:18%'
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
  grouplistUrl.value = selectConfig.sys.code.group.list.url
  mstlistUrl.value = selectConfig.sys.code.mst.langlist.url
  mstSaveUrl.value = transactionConfig.sys.code.lang.save.url
  // code setting
  // list setting
  getCodeDomain()
  getCodeGroup()
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
function getCodeDomain() {
  $http({
    url: domainlistUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    domainItems.value = _result.data
  })
}
/******************************
 * TODO (목적): 코드 그룹 목록 조회
 *******************************/
function getCodeGroup() {
  rowRemoveSelect()
  isSelectGrp.value = false
  mstGrid.value.data = []
  $http({
    url: $format(grouplistUrl.value, searchParam.value.srchDomainCd),
    method: 'GET'
  }).then((_result: any) => {
    grpGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getCodeMst(row: any) {
  // 상세조회
  isSelectGrp.value = true
  selectedGroupCd.value = row.codeGrpCd
  $http({
    url: $format(mstlistUrl.value, selectedGroupCd.value),
    method: 'GET'
  }).then((_result: any) => {
    mstGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 코드 저장
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
            getCodeMst({ codeGrpCd: saveData[0].codeGrpCd })
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
