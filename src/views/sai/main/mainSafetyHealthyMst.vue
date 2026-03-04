<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            type="year"
            default="today"
            label="목표년도"
            name="year"
            v-model:value="searchParam.targetYear"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="MAIN_SAFETY_HEALTHY_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="safetyHealthyTypeCd"
            label="구분"
            v-model:value="searchParam.safetyHealthyTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            type="search"
            :isFirstValue="false"
            label="해당부서"
            name="deptCd"
            v-model:value="searchParam.deptCd"
          />
        </div>
      </template>
    </c-search-box>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="기준정보 목록"
        :columns="grid.columns"
        :data="grid.data"
        :columnSetting="false"
        :isExcelDown="false"
        :isFullScreen="false"
        :filtering="false"
        :usePaging="false"
        selection="multiple"
        rowKey="mainSafetyHealthyId"
      >
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="복사" icon="save_alt" @btnClicked="copyMaster" />
            <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addMaster" />
            <c-btn
              v-if="editable"
              :isSubmit="isSave"
              :url="saveUrl"
              :param="saveData"
              mappingType="PUT"
              label="저장"
              icon="save"
              @beforeAction="saveMaster"
              @btnCallback="saveMasterCallback"
            />
            <c-btn label="삭제" icon="remove" @btnClicked="removeRow" v-if="editable" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </template>
      </c-table>
      <c-dialog :param="popupOptions" />
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
  name: 'mainSafetyHealthyMst'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStore 호출 */
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
  columns: tableColumnType
  data: Array<any>
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
const table = ref<any>(null)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y',
  deptCd: '',
  targetYear: '',
  safetyHealthyTypeCd: null
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      align: 'center',
      style: 'width:90px',
      sortable: false,
      type: 'plant'
    },
    {
      required: true,
      name: 'targetYear',
      field: 'targetYear',
      label: '목표년도',
      align: 'center',
      setHeader: true,
      sortable: false,
      style: 'width:70px',
      type: 'date',
      dateType: 'year'
    },
    {
      setHeader: true,
      name: 'safetyHealthyTypeCd',
      field: 'safetyHealthyTypeCd',
      label: '구분',
      align: 'center',
      style: 'width:100px',
      sortable: false,
      type: 'select',
      codeGroupCd: 'MAIN_SAFETY_HEALTHY_TYPE_CD'
    },
    {
      required: true,
      name: 'targetName',
      field: 'targetName',
      label: '목표',
      align: 'left',
      style: 'width:290px',
      sortable: false,
      type: 'text'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '해당부서',
      align: 'center',
      style: 'width:200px',
      sortable: false,
      type: 'deptMulti',
      deptCd: 'deptCd',
      isFirstValue: false
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      sortable: false,
      style: 'width:70px',
      type: 'number'
    }
  ],
  data: []
})
const useFlagItems = ref<Array<codeMasterType>>([])
const saveData = ref<Array<any>>([])
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
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
  listUrl.value = selectConfig.sai.mainsafetyHealthy.base.list.url
  saveUrl.value = transactionConfig.sai.mainsafetyHealthy.base.save.url
  deleteUrl.value = transactionConfig.sai.mainsafetyHealthy.base.delete.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 조회
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getList() {
  grid.value.data = []
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 마스터 추가
 *******************************/
function addMaster() {
  grid.value.data.push({
    mainSaiSafetyHealthyId: uid(), // 안전보건목표 일련번호
    plantCd: null, // 사업장
    targetYear: getThisYear(),
    targetName: '', // 안전보건목표
    sortOrder: 0, // 안전보건목표
    deptCd: '', // 안전보건목표
    useFlag: 'Y', // 사용여부
    regUserId: user.value.userId, // 등록자
    editFlag: 'C',
    safetyHealthyTypeCd: null
  })
}
function copyMaster() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./mainSafetyHealthyMstCopy.vue`))
    )
    popupOptions.value.title = '관계법령 의무사항 이행 계획 복사대상 년도'
    popupOptions.value.width = '400px'
    popupOptions.value.isFull = false
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closePopup
  }
}
function closePopup(result: any) {
  if (result.year !== undefined) {
    popupOptions.value.target = null
    popupOptions.value.visible = false
    const selectData = table.value.getSelected()
    _.forEach(selectData, (_data) => {
      _data.editFlag = 'C'
      _data.targetYear = result.year
    })
    saveData.value = selectData
    if (saveData.value.length > 0) {
      message.confirm({
        title: '확인',
        message: '선택한 목표를 해당년도로 복사하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    }
  } else {
    popupOptions.value.target = null
    popupOptions.value.visible = false
  }
}
/******************************
 * TODO (목적): 저장
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveMaster() {
  if (validTable(grid.value.columns, grid.value.data)) {
    saveData.value = grid.value.data.filter((item) => {
      return item.editFlag === 'C' || item.editFlag === 'U'
    })
    if (saveData.value.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
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
 * TODO (목적): 저장 후 callback
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveMasterCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * TODO (목적): 행 삭제
 *******************************/
function removeRow() {
  const selectData = table.value.getSelected()
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
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          table.value.compoTable.clearSelection()
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
