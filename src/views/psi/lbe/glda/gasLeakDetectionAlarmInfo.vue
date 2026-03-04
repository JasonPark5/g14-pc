<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            label="감지기NO"
            name="gasDetectorNo"
            v-model:value="searchParam.gasDetectorNo">
          </c-text>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            label="감지대상"
            name="sensingObject"
            v-model:value="searchParam.sensingObject">
          </c-text>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            label="설치장소"
            name="installLocation"
            v-model:value="searchParam.installLocation">
          </c-text>
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :customPopupParam="{ targetKey: 'process' }"
            :plantCd="searchParam.plantCd"
            label="관련공정"
            name="processCd"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept type="search" label="관리부서" name="deptCd" v-model:value="searchParam.deptCd" />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-table
          ref="gasleak"
          title="가스누출감지 경보기 설치계획 목록"
          :columns="grid.columns"
          :data="grid.data"
          rowKey="psiGasAlarmId"
          :columnSetting="false"
          :expandAll="true"
          @linkClick="linkClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                label="엑셀업로드"
                icon="upload"
                @btnClicked="excelUploadData"
              />
              <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'gasLeakDetectionAlarmInfo'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  data: Array<any>
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: '',
  gasDetectorNo: '',
  sensingObject: '',
  installLocation: '',
  processCd: '',
  deptCd: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      fix: true
    },
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: 'Rev.',
      align: 'center',
      style: 'width:50px',
      sortable: true,
      fix: true
    },
    {
      name: 'gasDetectorNo',
      field: 'gasDetectorNo',
      label: '가스감지기NO',
      align: 'center',
      style: 'width:120px',
      type: 'link',
      sortable: true,
      fix: true
    },
    {
      name: 'sensingObject',
      field: 'sensingObject',
      label: '감지대상',
      align: 'center',
      style: 'width:120px',
      sortable: true,
      fix: true
    },
    {
      name: 'installLocation',
      field: 'installLocation',
      label: '설치지역',
      align: 'center',
      style: 'width:130px',
      sortable: true,
      fix: true
    },
    {
      name: 'operationTime',
      field: 'operationTime',
      label: '작동시간',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'detectMethod',
      field: 'detectMethod',
      label: '측정방식',
      align: 'center',
      sortable: true
    },
    {
      label: '경보설정값',
      align: 'center',
      child: [
        {
          name: 'alarmHighValue',
          field: 'alarmHighValue',
          label: 'high',
          align: 'center',
          style: 'width:90px',
          sortable: true
        },
        {
          name: 'alarmHighhighValue',
          field: 'alarmHighhighValue',
          label: 'high high',
          align: 'center',
          style: 'width:90px',
          sortable: true
        }
      ]
    },
    {
      name: 'alarmSettingLocation',
      field: 'alarmSettingLocation',
      label: '경보기설치위치',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'precisionVal',
      field: 'precisionVal',
      label: '정밀도',
      align: 'center',
      style: 'width:80px',
      sortable: true
    },
    {
      name: 'measureInfo',
      field: 'measureInfo',
      label: '조치내용',
      align: 'center',
      style: 'width:200px',
      sortable: true
    },
    {
      name: 'management',
      field: 'management',
      label: '유지관리',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      style: 'width:120px',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')

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
  listUrl.value = selectConfig.psi.lbe.gasalarm.list.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 동력기계 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 링크 클릭 시 팝업 표시
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '가스누출감지 경보기 설치 상세'
  popupOptions.value.param = {
    psiGasAlarmId: row ? row.psiGasAlarmId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./gasLeakDetectionAlarmInfoDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * TODO (목적): 엑셀 업로드
 *******************************/
function excelUploadData() {
  popupOptions.value.title = '가스누출감지 경보기 설치계획 목록 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./gasLeakDetectionAlarmInfoExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
function closeExcelUploadPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item: any) => !item.error_message)
    _.forEach(s_data, (item) => {
      // item.plantCd = this.searchParam.plantCd
      item.sysRevision = 1
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    $http({
      url: transactionConfig.psi.lbe.gasalarm.insert.url + '/excel',
      method: 'POST',
      data: s_data
    }).then(() => {
      message.requestSuccess()
      getList()
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
