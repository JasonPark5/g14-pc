<template>
  <div>
    <c-table
      ref="table"
      title="규제 DB 업로드 목록"
      tableId="impr01"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="openPop" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template
          v-if="
            col.name === 'btn1' &&
            (props.row['chmUploadStateCd'] === 'CUS0000015' ||
              props.row['chmUploadStateCd'] === 'CUS0000025')
          "
        >
          <!-- 적용대기, 적용오류인 경우 -->
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              label="적용"
              icon="inventory"
              @btnClicked="applyChem(props.row)"
              textColor="blue-custom"
              :flat="true"
            />
          </q-btn-group>
        </template>
        <template
          v-else-if="
            col.name === 'btn2' &&
            props.row['chmUploadStateCd'] !== 'CUS0000020' &&
            props.row['chmUploadStateCd'] !== 'CUS0000001'
          "
        >
          <!-- 업로드중, 적용완료를 제외하고 -->
          <q-btn-group outline>
            <c-btn
              v-if="editable"
              label="삭제"
              icon="delete"
              @btnClicked="deleteUpload(props.row)"
              textColor="red"
              :flat="true"
            />
          </q-btn-group>
        </template>
        <template v-else-if="col.name === 'chmUploadStateName'">
          <q-btn
            v-if="
              props.row['chmUploadStateCd'] === 'CUS0000015' ||
              props.row['chmUploadStateCd'] === 'CUS0000020'
            "
            class="tableinnerBtn"
            flat
            align="center"
            color="blue-6"
            :label="props.row[col.name]"
            @click.stop="linkClick(props.row)"
          />
          <template v-else>
            {{ props.row[col.name] }}
          </template>
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
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
import { regulDbUploadType } from './regulDbUpload'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'regulDbUpload'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
const popupOptions = ref<popupParamType>({
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'updateDt',
      field: 'updateDt',
      label: '업로드 일시',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'chmUploadStateName',
      field: 'chmUploadStateName',
      label: '상태',
      align: 'center',
      style: 'width:150px',
      sortable: true,
      type: 'custom'
    },
    // {
    //   name: 'cnt',
    //   field: 'cnt',
    //   label: '업로드 건 수',
    //   child: [
    //     {
    //       name: 'addCnt',
    //       field: 'addCnt',
    //       label: '추가',
    //       align: 'right',
    //       style: 'width:120px',
    //       sortable: true,
    //       type: 'cost',
    //     },
    //     {
    //       name: 'updateCnt',
    //       field: 'updateCnt',
    //       label: '수정',
    //       align: 'right',
    //       style: 'width:120px',
    //       sortable: true,
    //       type: 'cost',
    //     },
    //     {
    //       name: 'deleteCnt',
    //       field: 'deleteCnt',
    //       label: '삭제',
    //       align: 'right',
    //       style: 'width:120px',
    //       sortable: true,
    //       type: 'cost',
    //     },
    //     {
    //       name: 'noChangeCnt',
    //       field: 'noChangeCnt',
    //       label: '변동없음',
    //       align: 'right',
    //       style: 'width:120px',
    //       sortable: true,
    //       type: 'cost',
    //     },
    //     {
    //       name: 'totalCnt',
    //       field: 'totalCnt',
    //       label: 'TOTAL',
    //       align: 'right',
    //       style: 'width:120px',
    //       sortable: true,
    //       type: 'cost',
    //     },
    //   ]
    // },
    {
      name: 'failContents',
      field: 'failContents',
      label: '실패내용',
      align: 'left',
      style: 'width:450px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'btn1',
      field: 'btn1',
      label: '적용',
      align: 'center',
      style: 'width:80px',
      sortable: true,
      type: 'custom'
    },
    {
      name: 'btn2',
      field: 'btn2',
      label: '삭제',
      align: 'center',
      style: 'width:80px',
      sortable: true,
      type: 'custom'
    }
  ],
  data: []
})
const listUrl = ref('')
const acceptUrl = ref('')
const deleteUrl = ref('')

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
  listUrl.value = selectConfig.chm.db.regulDbUpload.list.url
  acceptUrl.value = transactionConfig.chm.db.regulDbUpload.accept.url
  deleteUrl.value = transactionConfig.chm.db.regulDbUpload.delete.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 규제DB업로드 결과 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 규제DB업로드 팝업 표시
 *******************************/
function openPop() {
  popupOptions.value.title = '규제DB업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./regulDbUploadDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeUploadPopup
}
/******************************
 * TODO (목적): 규제DB업로드 팝업 닫기
 *******************************/
function closeUploadPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 규제DB업로드 변경 이력 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: regulDbUploadType) {
  switch (row.chmUploadStateCd) {
    case 'CUS0000015': // 적용대기
    case 'CUS0000020': // 적용완료
      popupOptions.value.title = '변경 이력'
      popupOptions.value.target = shallowRef(
        defineAsyncComponent(() => import(`./regulDbUploadHistory.vue`))
      )
      popupOptions.value.param = {
        chmRegulDbUploadId: row.chmRegulDbUploadId
      }
      popupOptions.value.visible = true
      popupOptions.value.closeCallback = closeHistoryPopup
      break
    case 'CUS0000005': // 업로드실패
    case 'CUS0000010': // 적용불가
    case 'CUS0000025': // 적용오류
      break
    default:
      // nothing...
      break
  }
}
/******************************
 * TODO (목적): 규제DB업로드 변경 이력 팝업 닫기
 *******************************/
function closeHistoryPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 규제DB업로드 변경 사항 적용
 * @param (1): 행 정보
 *******************************/
function applyChem(row: regulDbUploadType) {
  $http({
    url: acceptUrl.value,
    method: 'PUT',
    data: {
      chmRegulDbUploadId: row.chmRegulDbUploadId
    },
    timeout: 180000
  }).then((_result: any) => {
    if (_result.data === 1) {
      message.requestSuccess()
    } else {
      message.alert({
        title: '안내',
        message: '적용하는 도중에 오류가 발생하였습니다.',
        type: 'warning' // success / info / warning / error
      })
    }
    getList()
  })
}
/******************************
 * TODO (목적): 규제DB업로드 변경 사항 삭제
 * @param (1): 행 정보
 *******************************/
function deleteUpload(row: regulDbUploadType) {
  $http({
    url: $format(deleteUrl.value, row.chmRegulDbUploadId),
    method: 'DELETE'
  }).then((_result: any) => {
    message.requestSuccess()
    getList()
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
