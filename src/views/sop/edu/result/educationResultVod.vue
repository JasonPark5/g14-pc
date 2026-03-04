<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :editable="false"
            :plantCd="searchParam.plantCd"
            :customPopupParam="{ targetKey: 'user' }"
            type="user"
            label="수강자"
            name="attendeesId"
            v-model:value="searchParam.attendeesId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            name="period"
            label="교육기간"
            v-model:value="searchParam.educationPeriod"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="동영상 교육 목록"
      tableId="table"
      :columns="grid.columns"
      :data="grid.data"
      checkDisableColumn="disable"
      :checkClickFlag="false"
      rowKey="eduEducationId"
      @linkClick="linkClick"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'vodPlayTime'">
          <q-chip
            :color="getPlayTimeColor(props.row.vodTotalTime)"
            outline
            square
            :clickable="false"
            text-color="white"
          >
            {{ getPlayTime(props.row) }}
          </q-chip>
        </template>
      </template>
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <div>
          <q-btn-group outline>
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </div>
      </template>
    </c-table>
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
  name: 'educationResultVod'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
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
interface searchParamType {
  plantCd: stringNull
  documentStatusCd: stringNull
  startYmd: stringNull
  endYmd: stringNull
  educationPeriod: arrayString | null
  eduCourseId: stringNull
  educationKindCdSmall: stringNull
  educationKindCdLarge: stringNull
  educationTypeCd: stringNull
  attendeesId: stringNull
}
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  documentStatusCd: null,
  startYmd: '',
  endYmd: '',
  educationPeriod: [],
  eduCourseId: '',
  educationKindCdSmall: null,
  educationKindCdLarge: null,
  educationTypeCd: null,
  attendeesId: ''
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationName',
      field: 'educationName',
      label: '교육명',
      align: 'left',
      sortable: true,
      type: 'link'
    },
    {
      name: 'educationCourseName',
      field: 'educationCourseName',
      label: '교육과정',
      align: 'left',
      sortable: true
    },
    {
      name: 'educationDate',
      field: 'educationDate',
      label: '교육일',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationKindCdLargeName',
      field: 'educationKindCdLargeName',
      label: '교육종류1',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationKindCdSmallName',
      field: 'educationKindCdSmallName',
      label: '교육종류2',
      align: 'center',
      sortable: true
    },
    {
      name: 'educationTypeName',
      field: 'educationTypeName',
      label: '교육구분',
      align: 'center',
      sortable: true
    },
    {
      name: 'vodPlayTime',
      field: 'vodPlayTime',
      label: '동영상 시청시간',
      align: 'center',
      style: 'width:140px',
      sortable: true,
      type: 'custom'
    },
    {
      name: 'checkCompleteFlagName',
      field: 'checkCompleteFlagName',
      label: '이수구분',
      align: 'center',
      sortable: true
    },
    {
      name: 'evaluationDate',
      field: 'evaluationDate',
      label: '이수일',
      align: 'center',
      style: 'width:120px',
      sortable: true
    },
    {
      name: 'eduQuestionFlag',
      field: 'eduQuestionFlag',
      label: '문제풀이',
      style: 'width:80px',
      align: 'center',
      sortable: true
    }
  ],
  data: []
})
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
  listUrl.value = selectConfig.sop.edu.result.vods.url
  // code setting
  searchParam.value.attendeesId = user.value.userId
  searchParam.value.educationPeriod = [getFirstDayThisYear(), getLastDayThisYear()]
  // list setting
  getList()
}
function getPlayTime(_row: any) {
  if (_row.vodTotalTime === null) {
    return $language('시청 전')
  } else {
    const m1 = _.padStart(String(Math.floor(_row.vodPlayTime / 60)), 2, '0')
    const s1 = _.padStart(String(Math.floor(_row.vodPlayTime % 60)), 2, '0')
    const m2 = _.padStart(String(Math.floor(_row.vodTotalTime / 60)), 2, '0')
    const s2 = _.padStart(String(Math.floor(_row.vodTotalTime % 60)), 2, '0')
    return m1 + ' : ' + s1 + ' / ' + m2 + ' : ' + s2
  }
}
function getPlayTimeColor(_min: stringNull) {
  if (_min === null) {
    return 'grey-6'
  } else {
    return 'blue'
  }
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/* eslint-disable no-unused-vars */
function linkClick(row: any) {
  window.open(
    `/sop/edu/result/educationResultVodDetail?eduEducationId=${row.eduEducationId}`,
    'vodstream',
    `width=1700, height=900, menubar=no, status=no, toolbar=no`
  )
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
