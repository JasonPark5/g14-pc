<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker type="year" label="년도" name="year" v-model:value="searchParam.year" />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="개인별 직무스트레스 평가 목록"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:suffixTitle>
        <q-icon name="sentiment_very_satisfied" color="green" style="margin-left: 20px" size="sm" />
        <span style="font-size: 0.9em; margin-right: 20px"> : {{ $language('정상군') }}</span>
        <q-icon name="sentiment_very_dissatisfied" color="red" size="sm" />
        <span style="font-size: 0.9em"> : {{ $language('관리대상군') }}</span>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="props.row[col.name] === 'Y'">
          <q-icon name="sentiment_very_dissatisfied" color="red" size="sm" />
        </template>
        <template v-else-if="props.row[col.name] === 'N'">
          <q-icon name="sentiment_very_satisfied" color="green" size="sm" />
        </template>
        <template v-else />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'jobStressAssessment'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
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
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: false,
      style: 'width: 80px'
    },
    {
      name: 'planYear',
      field: 'planYear',
      label: '년도',
      align: 'center',
      sortable: false,
      style: 'width: 80px'
    },
    {
      name: 'jobStressPlanName',
      field: 'jobStressPlanName',
      label: '평가계획명',
      align: 'left',
      sortable: false,
      style: 'width: 200px',
      type: 'link'
    },
    {
      name: 'userName',
      field: 'userName',
      label: '평가자',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: '0',
      field: '0',
      label: '물리적환경',
      child: [
        {
          name: 'physicalEnv',
          field: 'physicalEnv',
          label: '점수',
          style: 'width:50px',
          align: 'right',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'physicalEnvScope',
          field: 'resultScope',
          label: '대상군',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'custom'
        }
      ]
    },
    {
      name: '1',
      field: '1',
      label: '직무요구',
      child: [
        {
          name: 'jobDemand',
          field: 'jobDemand',
          label: '점수',
          style: 'width:50px',
          align: 'right',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'jobDemandScope',
          field: 'jobDemandScope',
          label: '대상군',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'custom'
        }
      ]
    },
    {
      name: '2',
      field: '2',
      label: '직무자율',
      child: [
        {
          name: 'jobAutonomy',
          field: 'jobAutonomy',
          label: '점수',
          style: 'width:50px',
          align: 'right',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'jobAutonomyScope',
          field: 'jobAutonomyScope',
          label: '대상군',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'custom'
        }
      ]
    },
    {
      name: '3',
      field: '3',
      label: '관계갈등',
      child: [
        {
          name: 'relationship',
          field: 'relationship',
          label: '점수',
          style: 'width:50px',
          align: 'right',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'relationshipScope',
          field: 'relationshipScope',
          label: '대상군',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'custom'
        }
      ]
    },
    {
      name: '4',
      field: '4',
      label: '직무불안정',
      child: [
        {
          name: 'jobInsecurity',
          field: 'jobInsecurity',
          label: '점수',
          style: 'width:50px',
          align: 'right',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'jobInsecurityScope',
          field: 'jobInsecurityScope',
          label: '대상군',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'custom'
        }
      ]
    },
    {
      name: '5',
      field: '5',
      label: '조직체계',
      child: [
        {
          name: 'organizational',
          field: 'organizational',
          label: '점수',
          style: 'width:50px',
          align: 'right',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'organizationalScope',
          field: 'organizationalScope',
          label: '대상군',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'custom'
        }
      ]
    },
    {
      name: '6',
      field: '6',
      label: '보상부적절',
      child: [
        {
          name: 'inadequate',
          field: 'inadequate',
          label: '점수',
          style: 'width:50px',
          align: 'right',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'inadequateScope',
          field: 'inadequateScope',
          label: '대상군',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'custom'
        }
      ]
    },
    {
      name: '7',
      field: '7',
      label: '직장문화',
      child: [
        {
          name: 'workplace',
          field: 'workplace',
          label: '점수',
          style: 'width:50px',
          align: 'right',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'workplaceScope',
          field: 'workplaceScope',
          label: '대상군',
          style: 'width:50px',
          align: 'center',
          sortable: false,
          type: 'custom'
        }
      ]
    }
  ],
  data: []
})
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
  year: null,
  userId: ''
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
  listUrl.value = selectConfig.hea.jobStress.user.list.url
  // code setting
  searchParam.value.userId = user.value.userId // 로그인자 본인것만 작성
  // list setting
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
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title =
    $language('개인별 직무스트레스 평가 상세') +
    ' | ' +
    row.jobStressPlanName +
    ' | ' +
    row.userName
  popupOptions.value.param = {
    heaJobStressAssessmentUserId: row ? row.heaJobStressAssessmentUserId : '',
    assessTypeCd: row ? row.assessTypeCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./jobStressAssessmentDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
