<template>
  <div>
    <c-table
      ref="table"
      title="직무스트레스 평가표"
      :merge="grid.merge"
      :columns="grid.columns"
      :data="estimator.results"
      :gridHeight="gridHeight"
      :editable="editable && isWriter"
      :usePaging="false"
      :filtering="false"
      :isExcelDown="false"
      :isFullScreen="false"
      :columnSetting="false"
      @table-data-change="tableDataChange"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && isWriter"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="estimator"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveInfo"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
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
import { estimatorType } from './jobStress'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'jobStressAssessmentDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
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
interface propType {
  popupParam: {
    heaJobStressAssessmentUserId?: stringNull
    assessTypeCd?: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      heaJobStressAssessmentUserId: '',
      assessTypeCd: ''
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'heaStressCheckClassCd' }],
  columns: [
    {
      name: 'heaStressCheckClassName',
      field: 'heaStressCheckClassName',
      label: '구분',
      align: 'center',
      sortable: false,
      style: 'width: 90px'
    },
    {
      name: 'jobStressItemName',
      field: 'jobStressItemName',
      label: '설문내용',
      align: 'left',
      sortable: false,
      style: 'width: 400px'
    },
    {
      name: 'val1',
      field: 'val1',
      label: '전혀 그렇지 않다',
      style: 'width:50px',
      align: 'center',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N',
      value: 'N'
      // setHeader: true
    },
    {
      name: 'val2',
      field: 'val2',
      label: '그렇지 않다',
      style: 'width:50px',
      align: 'center',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N',
      value: 'N'
      // setHeader: true
    },
    {
      name: 'val3',
      field: 'val3',
      label: '그렇다',
      style: 'width:50px',
      align: 'center',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N',
      value: 'N'
      // setHeader: true
    },
    {
      name: 'val4',
      field: 'val4',
      label: '매우 그렇다',
      style: 'width:50px',
      align: 'center',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N',
      value: 'N'
      // setHeader: true
    }
  ],
  data: []
})
const estimator = ref<estimatorType>({
  heaJobStressAssessmentUserId: '', // 직무스트레스 평가자 일련번호
  heaJobStressPlanId: '', // 직무스트레스 계획 일련번호
  userId: '', // 평가자id
  userName: '', // 평가자
  deptCd: '', // 평가자부서코드
  deptName: '', // 평가자부서
  sexCd: '', // 성별
  physicalEnv: '', // (점수)물리적환경
  jobDemand: '', // (점수)직무요구
  jobAutonomy: '', // (점수)직무자율
  relationship: '', // (점수)관계갈등
  jobInsecurity: '', // (점수)직무불안정
  organizational: '', // (점수)조직체계
  inadequate: '', // (점수)보상부적절
  workplace: '', // (점수)직장문화
  manageTargetGroupFlag: '', // 관리대상군 여부
  regUserId: '', // 등록자 ID
  chgUserId: '', // 등록자 ID
  results: [] // 결과표
})
const editable = ref(true)
const isSave = ref(false)
const detailUrl = ref('')
const saveUrl = ref('')
const listItemUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => (!isNaN(props.contentHeight) ? '850px' : '540px'))
const isWriter = computed(() => estimator.value.userId === user.value.userId)

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
  detailUrl.value = selectConfig.hea.jobStress.user.get.url
  listItemUrl.value = selectConfig.hea.jobStress.base.item.list.url
  saveUrl.value = transactionConfig.hea.jobStress.user.save.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세정보 조회
 *******************************/
function getDetail() {
  $http({
    url: $format(detailUrl.value, props.popupParam.heaJobStressAssessmentUserId),
    method: 'GET'
  }).then((_result: any) => {
    _.extend(estimator.value, _result.data)
    estimator.value.results?.forEach((item, index) => {
      item.jobStressItemName = `${index + 1}. ${item.jobStressItemName}`
    }) // 각 항목마다 번호를 붙이기
    if (!estimator.value.results || estimator.value.results.length === 0) {
      $http({
        url: listItemUrl.value,
        method: 'GET',
        params: {
          useFlag: 'Y',
          shortenFlag: props.popupParam.assessTypeCd === 'HST0000005' ? 'Y' : null // 평가유형(기본/단축)
        }
      }).then((_result: any) => {
        _.forEach(_result.data, (item) => {
          estimator.value.results!.push({
            heaJobStressAssessmentResultId: uid(), // 직무스트레스 평가결과표 일련번호
            heaJobStressAssessmentUserId: props.popupParam.heaJobStressAssessmentUserId, // 직무스트레스 평가자 일련번호
            heaJobStressPlanId: estimator.value.heaJobStressPlanId, // 직무스트레스 계획 일련번호
            heaJobStressItemId: item.heaJobStressItemId, // 직무스트레스 결과항목 일련번호
            heaStressCheckClassCd: item.heaStressCheckClassCd,
            heaStressCheckClassName: item.heaStressCheckClassName,
            jobStressItemName: estimator.value.results!.length + 1 + '. ' + item.jobStressItemName,
            val1Score: item.val1Score,
            val2Score: item.val2Score,
            val3Score: item.val3Score,
            val4Score: item.val4Score,
            val1: 'N', // 전혀 그렇지 않다
            val2: 'N', // 그렇지 않다
            val3: 'N', // 그렇다
            val4: 'N', // 매우 그렇다
            regUserId: user.value.userId, // 등록자 ID
            editFlag: 'C'
          })
        })
      })
    }
  })
}
/******************************
 * TODO (목적): 같은 행에 체크한 항목이 있을 시에 값을 체크한 항목을 제외한 나머지 항목은 체크 해제
 *******************************/
function tableDataChange(_props: any, col: any) {
  if (_props.row[col.name] === 'Y') {
    for (let i = 1; i <= 4; i++) {
      if (Number(col.name.replace('val', '')) !== i) _props.row[`val${i}`] = 'N' // 전체 해제
    }
  }
}
/******************************
 * TODO (목적): 저장. 모든 설문내용에 답변 필요
 *******************************/
function saveInfo() {
  if (validTable(grid.value.columns, estimator.value.results!)) {
    if (
      _.findIndex(estimator.value.results, (result) => {
        let _check = false
        for (let i = 1; i <= 4; i++) {
          // 전체 해제
          if (result[`val${i}`] === 'Y') {
            _check = true
            break
          }
        }
        return !_check
      }) > -1
    ) {
      message.alert({
        title: '안내',
        message: `답변하지 않은 항목이 존재합니다.`,
        type: 'warning' // success / info / warning / error
      })
      return
    }
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        getComboItems('HEA_STRESS_CHECK_CLASS_CD').then((_result: any) => {
          _.forEach(_result, (_item) => {
            const _filters = _.filter(estimator.value.results, {
              heaStressCheckClassCd: _item.code
            })
            let [class_sum_score, class_top_score, class_score] = [0, 0, 0]
            // const class_count = _filters && _filters.length > 0 ? _filters.length : 0
            _.forEach(_filters, (_filter) => {
              let _class_top_score = 0
              for (let i = 1; i <= 4; i++) {
                if (_filter[`val${i}`] === 'Y') class_sum_score += _filter[`val${i}Score`]
                if (_filter[`val${i}Score`] > _class_top_score)
                  _class_top_score = _filter[`val${i}Score`]
              }
              class_top_score += _class_top_score
            })
            class_score = (class_sum_score / class_top_score) * 100
            switch (_item.code) {
              case 'HCC0000001': // 물리적환경
                estimator.value.physicalEnv = class_score
                break
              case 'HCC0000005': // 직무요구
                estimator.value.jobDemand = class_score
                break
              case 'HCC0000010': // 직무자율
                estimator.value.jobAutonomy = class_score
                break
              case 'HCC0000015': // 관계갈등
                estimator.value.relationship = class_score
                break
              case 'HCC0000020': // 직무 불안정
                estimator.value.jobInsecurity = class_score
                break
              case 'HCC0000025': // 조직체계
                estimator.value.organizational = class_score
                break
              case 'HCC0000030': // 보상부적절
                estimator.value.inadequate = class_score
                break
              case 'HCC0000035': // 직장문화
                estimator.value.workplace = class_score
                break
              default:
                break
            }
          })
          estimator.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        })
      },
      cancelCallback: () => {}
    })
  }
}
function saveCallback(_result: any) {
  message.requestSuccess()
  props.popupParam.heaJobStressAssessmentUserId = _result.data
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
