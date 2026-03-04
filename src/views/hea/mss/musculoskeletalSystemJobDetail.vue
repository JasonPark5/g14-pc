<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <q-card flat bordered>
        <c-table
          ref="table2"
          :title="`부담작업 목록`"
          :columns="grid2.columns"
          :data="grid2.data"
          :gridHeight="gridHeight"
          :editable="editable && !popupParam.disabled"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
          :usePaging="false"
          selection="multiple"
          rowKey="heaMuscleHeavyWorkId"
          @table-data-change="tableDataChange"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !popupParam.disabled && isSelect && grid2.data.length > 0"
                label="삭제"
                icon="delete"
                @btnClicked="deleteDetailJob"
              />
              <c-btn
                v-if="editable && !popupParam.disabled && isSelect"
                label="추가"
                icon="add"
                @btnClicked="addDetailJob"
              />
              <c-btn
                v-show="editable && !popupParam.disabled && isSelect && grid2.data.length > 0"
                :isSubmit="isSaveDetailJob"
                :url="saveDetailJobUrl"
                :param="grid2.data"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveDetailJob"
                @btnCallback="saveDetailJobCallback"
              />
            </q-btn-group>
          </template>
        </c-table>
      </q-card>
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
import { heavyWorkType } from './investigation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'musculoskeletalSystemJob'
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
    selectedJob: any
    heaInvestigationPlanId: stringNull
    heaMuscleSopId: stringNull
    heavyWorks: any
    plantCd: stringNull
    sops: any
    disabled: boolean
  }
  contentHeight: stringNull
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
      selectedJob: {
        heaMuscleSopId: '',
        mdmSopId: '',
        sopName: '',
        processName: ''
      },
      heaInvestigationPlanId: '',
      heaMuscleSopId: '',
      heavyWorks: () => [],
      plantCd: null,
      sops: [],
      disabled: false
    }
  },
  contentHeight: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Computed_선언
 *******************************/
/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'heavyWorkName',
      field: 'heavyWorkName',
      label: '부담작업No',
      align: 'center',
      sortable: false,
      style: 'width:60px'
    },
    {
      name: 'investigationDate',
      field: 'investigationDate',
      label: '조사일자',
      align: 'center',
      sortable: false,
      style: 'width:100px',
      type: 'date',
      setHeader: true
    },
    {
      name: 'userName',
      field: 'userName',
      label: '조사자',
      align: 'center',
      sortable: false,
      style: 'width:100px',
      type: 'user',
      userId: 'userId',
      setHeader: true
    },
    {
      required: true,
      name: 'detailJobContents',
      field: 'detailJobContents',
      label: '작업내용',
      align: 'left',
      sortable: false,
      style: 'width:180px',
      type: 'text'
    },
    {
      name: 'workTime',
      field: 'workTime',
      label: '작업시간',
      align: 'center',
      sortable: false,
      style: 'width:60px',
      type: 'number'
    },
    {
      name: 'workCnt',
      field: 'workCnt',
      label: '횟수',
      align: 'center',
      sortable: false,
      style: 'width:60px',
      type: 'number'
    },
    {
      name: 'result',
      field: 'result',
      label: '결과',
      child: [
        {
          name: 'workTotal',
          field: 'workTotal',
          label: '총점수',
          align: 'center',
          sortable: false,
          style: 'width:60px'
        },
        {
          name: 'assessResult',
          field: 'assessResult',
          label: '평가결과',
          align: 'center',
          sortable: false,
          style: 'width:60px'
        }
      ]
    }
  ],
  data: []
})
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '70%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const isSaveDetailJob = ref(true)
const listDetailJobUrl = ref('')
const saveDetailJobUrl = ref('')
const deleteDetailJobUrl = ref('')
const saveDeleteDetailJobUrl = ref('')
const deleteWorkerUrl = ref('')
const table2 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isSelect = computed(() => Boolean(props.popupParam.selectedJob.heaMuscleSopId))
const gridHeight = computed(() => '700px')
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
  listDetailJobUrl.value = selectConfig.hea.muscleSystem.muscleHeavyWork.list.url
  saveDetailJobUrl.value = transactionConfig.hea.muscleSystem.muscleHeavyWork.save.url
  deleteDetailJobUrl.value = transactionConfig.hea.muscleSystem.muscleHeavyWork.delete.url
  saveDeleteDetailJobUrl.value = transactionConfig.hea.muscleSystem.muscleHeavyWork.savedelete.url
  deleteWorkerUrl.value = transactionConfig.hea.muscleSystem.muscleHeavyWork.workerdelete.url
  // code setting

  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 단위작업별 부담작업 목록 조회
 *******************************/
function getDetail() {
  $http({
    url: listDetailJobUrl.value,
    method: 'GET',
    params: {
      heaMuscleSopId: props.popupParam.heaMuscleSopId
    }
  }).then((_result: any) => {
    grid2.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 테이블내 값 변경시 계산
 *******************************/
function tableDataChange(_props: any, col: any) {
  if (col.name === 'workTime' || col.name === 'workCnt') {
    const _workTime =
      _props.row.workTime && !isNaN(_props.row.workTime) ? Number(_props.row.workTime) : 0
    const _workCnt =
      _props.row.workCnt && !isNaN(_props.row.workCnt) ? Number(_props.row.workCnt) : 0
    _props.row.workTotal = _workTime * _workCnt

    if (props.popupParam.heavyWorks && props.popupParam.heavyWorks.length > 0) {
      const work = _.find(props.popupParam.heavyWorks, {
        heaHeavyWorkNo: _props.row.heaHeavyWorkNo
      })
      const preAssessResult = _props.row.assessResult // 과거시점
      _props.row.assessResult =
        _props.row.workTotal >= Number(work!.exopsureCnt) * Number(work!.exposureTime) ? 'O' : 'X'
      /**
       * assessResult의 기존값과 변경된 값을 비교한 뒤 변경된 row들만 editFlag = 'U'로 변경
       * 과거의 값에 대한 변수, 변경된 값에 대한 변수를 이용하여 비교
       * 둘의 값이 달라졌다면 editFlag를 'U'로 입력
       */
      // 바뀐시점
      const afterAssessResult = _props.row.assessResult
      if (preAssessResult !== afterAssessResult && _props.row.editFlag !== 'C') {
        _props.row.editFlag = 'U'
        _props.row.chgUserId = user.value.userId
      }
    }
  }
}
/******************************
 * TODO (목적): 단위작업에 상세 부담작업 추가
 *******************************/
function addDetailJob() {
  popupOptions.value.title = '부담작업'
  popupOptions.value.param = {
    detailJobs: grid2.value.data,
    plantCd: props.popupParam.plantCd
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./worksheetPop.vue`)))
  popupOptions.value.width = '96%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeDetailJobPopup
}
function closeDetailJobPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    // 실제 저장/삭제 후 유해요인 조사 요청 하기전에 작업내용 및 평가결과 입력되어 있는지 판단하게 처리
    const _addData = [] as Array<heavyWorkType>
    for (const key in _data[0]) {
      if (_data[0][key] === 'Y' && _.findIndex(grid2.value.data, { heaHeavyWorkNo: key }) === -1) {
        _addData.push({
          heaMuscleHeavyWorkId: uid(),
          heaMuscleSopId: props.popupParam.selectedJob.heaMuscleSopId,
          heaInvestigationPlanId: props.popupParam.heaInvestigationPlanId,
          mdmSopId: props.popupParam.selectedJob.mdmSopId,
          plantCd: props.popupParam.plantCd,
          heaHeavyWorkNo: key, // 부담작업No
          heavyWorkName: `${key}항`, // 부담작업No명
          regUserId: user.value.userId,
          userId: user.value.userId, // 조사자
          userName: user.value.userName, // 조사자
          deptCd: user.value.deptCd, // 조사자 부서
          investigationDate: getToday(), // 조사일자
          detailJobContents: '', // 작업내용
          workTime: null, // 작업시간
          workCnt: null, // 작업횟수
          workTotal: null, // 총 노출시간
          assessResult: '', // 평가결과
          workload: null, // 작업부하
          workFrequency: null, // 작업빈도
          totalScore: null, // 총 점수
          editFlag: 'C'
        })
      }
    }
    const _deleteData = [] as Array<heavyWorkType>
    _.forEach(grid2.value.data, (item) => {
      if (
        _.findIndex(Object.entries(_data[0]), (_item: any) => {
          return String(_item[0]) === String(item.heaHeavyWorkNo) && _item[1] === 'N'
        }) > -1
      ) {
        _deleteData.push(item)
        return
      }
    })
    const job = _.find(props.popupParam.sops, {
      heaMuscleSopId: props.popupParam.selectedJob.heaMuscleSopId
    })
    // $set(job, 'heavyWorks', $_.concat(job.heavyWorks, _addData))
    // 삭제 처리
    const _deleteDetailJobs = [] as Array<heavyWorkType>
    _.forEach(_deleteData, (item) => {
      if (item.editFlag !== 'C') {
        _deleteDetailJobs.push(item)
      }
    })
    $http({
      url: saveDeleteDetailJobUrl.value,
      method: 'PUT',
      data: {
        saveHeavyWorks: _.concat(job?.heavyWorks, _addData),
        deleteHeavyWorks: _deleteDetailJobs
      }
    }).then(() => {
      message.requestSuccess()
      getDetail()
    })
  }
}
/******************************
 * TODO (목적): 특정 단위작업의 상세 부담작업 저장
 *******************************/
function saveDetailJob() {
  if (validTable(grid2.value.columns, grid2.value.data)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSaveDetailJob.value = !isSaveDetailJob.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.validError()
  }
}
function saveDetailJobCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 특정 단위작업의 상세 부담작업 삭제
 *******************************/
function deleteDetailJob() {
  const selectData = table2.value.getSelected()
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
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: deleteDetailJobUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getDetail()
          table2.value.compoTable.clearSelection()
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
