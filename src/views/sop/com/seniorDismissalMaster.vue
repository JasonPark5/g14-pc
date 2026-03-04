<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          codeGroupCd="SENIOR_CLASS_CD"
          type="search"
          itemText="codeName"
          itemValue="code"
          name="seniorClassCd"
          label="구분"
          v-model:value="searchParam.seniorClassCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-select
          codeGroupCd="LAW_ID"
          type="search"
          itemText="codeName"
          itemValue="code"
          label="관련법규"
          name="lawId"
          v-model:value="searchParam.lawId"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          codeGroupCd="SENIOR_REPORT_APPOINT_CD"
          type="search"
          itemText="codeName"
          itemValue="code"
          label="신고/선임"
          name="reportAppointCd"
          v-model:value="searchParam.reportAppointCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          :comboItems="useFlagItems"
          type="search"
          itemText="codeName"
          itemValue="code"
          name="useFlag"
          label="사용여부"
          v-model:value="searchParam.useFlag"
        />
      </div>
    </template>
  </c-search-box>
  <c-table
    ref="table"
    class="table_vt_top senior"
    title="선임명 목록"
    :columns="grid.columns"
    :data="grid.data"
    :editable="editable"
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="추가" :showLoading="true" icon="add" @btnClicked="add" />
        <c-btn
          v-if="editable"
          :url="saveUrl"
          :isSubmit="isSave"
          :param="grid.data"
          mappingType="POST"
          label="저장"
          icon="save"
          @beforeAction="saveSenior"
          @btnCallback="saveCallback"
        />
        <c-btn label="검색" icon="search" @btnClicked="getList" />
      </q-btn-group>
    </template>
    <template v-slot:customArea="{ props, col }">
      <template v-if="col.name === 'eduList'">
        <c-tag
          :editable="editable"
          icon="school"
          itemText="educationCourseName"
          itemValue="eduCourseId"
          name="eduList"
          v-model:value="props.row.eduList"
          @addTag="addEduMaster(props.row)"
          @removeTag="(item: any) => removeEduMaster(item, props.row)"
        />
      </template>
    </template>
  </c-table>
  <c-dialog :param="popupOptions" />
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
import { ref } from 'vue'

import { seniorInterface } from './senior'
import { eduCourseType } from '../edu/cc/eduCourse'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'seniorDismissalMaster'
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

/******************************
 * @Interface_선언
 *******************************/
interface searchParamType {
  seniorClassCd: stringNull
  useFlag: stringNull
  lawId?: stringNull
  reportAppointCd?: stringNull
}
interface gridType {
  columns: Array<tableColumnType>
  data: Array<seniorInterface>
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
const searchParam = ref<searchParamType>({
  seniorClassCd: null,
  useFlag: 'Y',
  lawId: null,
  reportAppointCd: null
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      style: 'width:40px',
      align: 'right',
      type: 'number',
      sortable: true
    },
    {
      required: true,
      name: 'seniorClassCd',
      field: 'seniorClassCd',
      label: '구분',
      style: 'width:80px',
      align: 'center',
      type: 'select',
      sortable: true,
      codeGroupCd: 'SENIOR_CLASS_CD'
    },
    {
      name: 'relatedLaws',
      field: 'relatedLaws',
      label: '관련법규',
      style: 'width:160px',
      align: 'center',
      itemText: 'codeName',
      itemValue: 'code',
      type: 'multiSelect',
      sortable: true,
      // codeGroupCd: 'RELATED_LAWS_CD',
      codeGroupCd: 'LAW_ID',
      isArray: false
    },
    {
      required: true,
      name: 'seniorName',
      field: 'seniorName',
      label: '선임명',
      style: 'width:150px',
      align: 'left',
      type: 'text',
      sortable: true
    },
    // {
    //   name: 'eduList',
    //   field: 'eduList',
    //   label: '교육과정',
    //   style: 'width:250px',
    //   align: 'center',
    //   type: 'custom',
    //   sortable: true
    // },
    {
      name: 'qualifiyRequire',
      field: 'qualifiyRequire',
      label: '세부법규',
      align: 'left',
      type: 'textarea',
      // style: 'width:350px',
      sortable: true
    },
    {
      name: 'reportAppointCd',
      field: 'reportAppointCd',
      label: '신고/선임',
      align: 'center',
      style: 'width: 100px',
      type: 'select',
      sortable: true,
      codeGroupCd: 'SENIOR_REPORT_APPOINT_CD'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:50px',
      type: 'check',
      sortable: true,
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const useFlagItems = ref<object[]>([])
const row = ref<seniorInterface>({
  seniorId: '',
  relatedLaws: '',
  qualifiyRequire: '',
  useFlag: '',
  seniorName: '',
  seniorStandard: '',
  seniorClassCd: '',
  reportAppointCd: '',
  seniorFieldCd: '',
  regUserId: '',
  editFlag: '',
  eduList: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const route = useRoute()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
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
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  editable.value = Boolean(route.meta.editable)
  listUrl.value = selectConfig.mdm.senior.list.url
  saveUrl.value = transactionConfig.mdm.senior.save.url
  deleteUrl.value = transactionConfig.mdm.senior.delete.url
  getList()
}

/******************************
 * TODO (목적): 목록 조회
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
 * TODO (목적): 빈 row 추가
 *******************************/
function add() {
  const newObj: seniorInterface = {
    seniorId: uid(),
    relatedLaws: '',
    qualifiyRequire: '',
    useFlag: 'Y',
    seniorName: '',
    seniorStandard: '',
    seniorClassCd: searchParam.value.seniorClassCd || null,
    reportAppointCd: null,
    seniorFieldCd: null,
    regUserId: user.value?.userId,
    eduList: [],
    editFlag: 'C'
  }
  grid.value.data.splice(0, 0, newObj)
}

/******************************
 * TODO (목적): 교육과정 검색 팝업 표시
 * @param (1): 행 정보
 *******************************/
function addEduMaster(_row: any) {
  row.value = _row
  popupOptions.value = getPopupOptions('eduCourse', popupOptions.value, closePopup, {
    type: 'multiple'
  })
}

/******************************
 * TODO (목적): 선정한 정보를 선임명에 따른 교육과정으로 저장
 * @param (1): 선정한 교육과정 정보들
 *******************************/
function closePopup(data: Array<eduCourseType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    if (!row.value.eduList) row.value.eduList = []
    _.forEach(data, (item) => {
      if (_.findIndex(row.value.eduList, { eduCourseId: item.eduCourseId }) === -1) {
        row.value.eduList!.push({
          eduCourseId: item.eduCourseId,
          educationCourseName: '(' + item.plantName + ') ' + item.educationCourseName,
          seniorId: row.value.seniorId
        })
      }
      if (row.value.editFlag !== 'C') {
        row.value.chgUserId = user.value.userId
        row.value.editFlag = 'U'
      }
    })
    const target = _.find(grid.value.data, { seniorId: row.value.seniorId })
    if (target) target.eduList = row.value.eduList
  }
}

/******************************
 * TODO (목적): 지정된 교육과정 삭제
 * @param (1): 선정한 교육과정 정보
 * @param (2): 선정한 row 정보
 *******************************/
function removeEduMaster(item: any, row: seniorInterface) {
  row.eduList = _.reject(row.eduList, { eduCourseId: item.eduCourseId })
  if (row.editFlag !== 'C') {
    row.chgUserId = user.value.userId
    row.editFlag = 'U'
  }
}

/******************************
 * TODO (목적): 작성한 마스터정보 저장 전처리과정
 *******************************/
function saveSenior() {
  if (validTable(grid.value.columns, grid.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}

/******************************
 * TODO (목적): 작성한 마스터정보 저장 후처리과정
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.senior
  .q-table
    tbody tr td.edittd-textarea
      font-size: 0.86em !important
</style>
