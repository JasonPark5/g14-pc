<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <q-card flat bordered>
        <div class="bg-blue-1 q-pa-sm q-mb-md rounded-borders">
          <div class="row items-center">
            <div class="col-auto">
              <q-chip color="primary" text-color="white" icon="info" outline>
                {{ $language('안내') }}
              </q-chip>
            </div>
            <div class="col q-ml-md">
              <div class="text-primary">
                부담작업은
                <q-icon name="check_circle" color="positive" size="xs" /> 해당,
                <q-icon name="error" color="negative" size="xs" /> 비해당으로 표시됩니다.
              </div>
            </div>
          </div>
        </div>
        <c-table
          ref="table1"
          title="단위작업 목록"
          :columns="grid1.columns"
          :data="investigation.sops"
          :gridHeight="gridHeight"
          :gridHeightAuto="true"
          :editable="editable && !disabled"
          :isExcelDown="false"
          :filtering="false"
          :isFullScreen="false"
          :columnSetting="false"
          :usePaging="false"
          selection="multiple"
          rowKey="heaMuscleSopId"
          @linkClick="linkClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && !disabled && investigation.sops && investigation.sops.length > 0"
                label="삭제"
                icon="delete"
                @btnClicked="deleteJob"
              />
              <c-btn v-if="editable && !disabled" label="추가" icon="add" @btnClicked="addJob" />
              <c-btn
                v-show="
                  editable && !disabled && investigation.sops && investigation.sops.length > 0
                "
                :isSubmit="isSaveJob"
                :url="saveJobUrl"
                :param="investigation.sops"
                mappingType="PUT"
                label="저장"
                icon="save"
                @beforeAction="saveJob"
                @btnCallback="saveJobCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'workerIds'">
              <!-- isArray -->
              <c-multi-field
                :editable="editable"
                :disabled="disabled"
                :userInfo="userInfo(props)"
                type="user"
                label=""
                :name="`workers${props.rowIndex}`"
                v-model:value="props.row[col.name]"
                @dataChange="dataChange(props, col)"
                @removeData="
                  (userId: any) => {
                    removeChange(props, userId)
                  }
                "
              />
            </template>
            <template v-else-if="col.name === 'jobCount'">
              <div
                v-if="getHeavyWorkItems(props.row).length > 0"
                class="flex flex-wrap justify-center"
              >
                <q-chip
                  v-for="item in getHeavyWorkItems(props.row)"
                  :key="item.no"
                  dense
                  square
                  style="min-width: 54px; border-radius: 4px; font-weight: 500"
                  :color="
                    item.result === 'O' ? 'positive' : item.result === 'X' ? 'negative' : 'grey-7'
                  "
                  text-color="white"
                  :label="item.no + '항'"
                  class="q-ma-xs cursor-pointer"
                  :icon="
                    item.result === 'O' ? 'check_circle' : item.result === 'X' ? 'error' : 'help'
                  "
                >
                  <q-tooltip :offset="[0, 3]" style="font-size: 0.8em !important">
                    {{
                      item.result === 'O'
                        ? '평가결과: 해당'
                        : item.result === 'X'
                          ? '평가결과: 비해당'
                          : '평가결과 없음'
                    }}
                  </q-tooltip>
                </q-chip>
              </div>
              <span v-else class="text-grey">{{ $language('없음') }}</span>
            </template>
          </template>
        </c-table>
      </q-card>

      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <component
          :is="worksheetComponent"
          :popupParam="props.popupParam"
          :investigation="props.investigation"
          :disabled="props.disabled"
          :heavyWorks="props.heavyWorks"
          :isOld="props.isOld"
          :contentHeight="props.contentHeight"
        />
      </div>
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
import { heavyWorkType, investigationType } from './investigation'

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
const emits = defineEmits(['getDetail'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    heaInvestigationPlanId: stringNull
    searchProcess: any | null | undefined
  }
  investigation: investigationType
  heavyWorks: Array<heavyWorkType>
  disabled: boolean
  isOld: boolean
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
      heaInvestigationPlanId: '',
      searchProcess: {
        flag: '',
        isSearch: false
      }
    }
  },
  investigation: () => {
    return {
      heaInvestigationPlanId: '', // 근골격계 조사계획 일련번호
      plantCd: '', // 사업장코드
      investigationPlanName: '', // 조사계획명
      year: '', // 심사년도
      heaInvestigationStepCd: '', // 진행상태
      investigationStartDate: '', // 조사시작일
      investigationEndDate: '', // 조사종료일
      period: ['', ''],
      deptCd: '', // 담당자 부서
      userId: '', // 담당자 id
      investigationDeptCd: '', // 조사부서
      agency: '', // 조사기관
      remark: '', // 비고
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      sops: [], // 단위작업
      sopTable: [] // 작업분류표
    }
  },
  heavyWorks: () => [],
  disabled: false,
  isOld: false,
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Computed_선언
 *******************************/
const worksheetComponent = computed(() => {
  return markRaw(defineAsyncComponent(() => import(`@views/hea/mss/worksheet.vue`)))
})

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid1 = ref<gridType>({
  columns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'sopName',
      field: 'sopName',
      label: '단위작업',
      align: 'left',
      sortable: false,
      style: 'width:120px',
      type: 'link'
    },
    {
      name: 'workerIds',
      field: 'workerIds',
      label: '작업자',
      align: 'center',
      sortable: false,
      style: 'width:200px',
      type: 'custom'
    },
    {
      name: 'jobCount',
      field: 'jobCount',
      label: '부담작업',
      align: 'center',
      sortable: false,
      style: 'width:120px',
      type: 'custom'
    }
  ]
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
const selectedJob = ref({
  heaMuscleSopId: '',
  mdmSopId: '',
  sopName: '',
  processName: ''
})
const editable = ref(true)
const isSaveJob = ref(true)
const listJobUrl = ref('')
const saveJobUrl = ref('')
const deleteJobUrl = ref('')
const deleteWorkerUrl = ref('')
const table1 = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 1500 + 'px' : '300px'
)

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
  listJobUrl.value = selectConfig.hea.muscleSystem.muscleSop.list.url
  saveJobUrl.value = transactionConfig.hea.muscleSystem.muscleSop.save.url
  deleteJobUrl.value = transactionConfig.hea.muscleSystem.muscleSop.delete.url
  deleteWorkerUrl.value = transactionConfig.hea.muscleSystem.muscleHeavyWork.workerdelete.url
  // code setting
  // list setting
}
/******************************
 * TODO (목적): 사용자 정보 리턴
 *******************************/
function userInfo(_props: any) {
  return {
    userItems: _props.row.workers,
    userText: 'userName',
    userValue: 'userId'
  }
}
/******************************
 * TODO (목적): 근골격계 부담작업 목록 조회
 *******************************/
function getJobs() {
  $http({
    url: listJobUrl.value,
    method: 'GET',
    params: {
      heaInvestigationPlanId: props.popupParam.heaInvestigationPlanId
    }
  }).then((_result: any) => {
    props.investigation.sops = _result.data
  })
}
/******************************
 * TODO (목적): 근골격계 부담 단위작업에 해당하는 작업자 추가시 실행
 *******************************/
function dataChange(_props: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
}
function removeChange(_props: any, _userId: any) {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'info', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(
          deleteWorkerUrl.value,
          _props.row.heaMuscleSopId,
          _userId,
          props.popupParam.heaInvestigationPlanId
        ),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        props.popupParam.searchProcess.isSearch = true
        table1.value.compoTable.clearSelection()

        if (_props.row['workerIds']) {
          let workerArray = _props.row['workerIds'].split(',')
          workerArray = _.reject(workerArray, _userId)
          _props.row['workerIds'] = workerArray.join(',')
        }
        // getJobs()
      })
    },
    cancelCallback: () => {
      if (_props.row['workerIds']) {
        const workerArray = _props.row['workerIds'].split(',')
        workerArray.push(_userId)
        _props.row['workerIds'] = workerArray.join(',')
      }
      // getJobs()
    }
  })
}
/******************************
 * TODO (목적): 근골격계 단위작업 추가
 *******************************/
function addJob() {
  popupOptions.value = getPopupOptions('sop1', popupOptions.value, closeJobPopup, {
    type: 'multiple'
  })
}
function closeJobPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    const _data = [] as any
    _.forEach(data, (item) => {
      if (_.findIndex(props.investigation.sops, { mdmSopId: item.mdmSopId }) === -1) {
        _data.push({
          heaMuscleSopId: uid(),
          heaInvestigationPlanId: props.popupParam.heaInvestigationPlanId,
          heaMuscleSopStepCd: 'HMS000001', // 진행상태
          processCd: item.subProcessCd,
          processName: item.processName,
          mdmSopId: item.mdmSopId,
          sopName: item.sopName,
          heaInvestigationTypeCd: null, // 조사구분
          investigationStartDate: null, // 조사일시
          deptCd: null, // 조사자 부서
          userId: null, // 조사자 id
          remark: '', // 비고
          workers: [],
          heavyWorks: [],
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
    props.investigation.sops = _.concat(props.investigation.sops, _data)
    // $http.url = $format(saveJobUrl, popupParam.id);
    // $http.type = 'PUT';
    // $http.param = investigation.sops;
    // $http.request(() => {
    //   window.getApp.$emit('APP_REQUEST_SUCCESS');
    //   jobs();
    // },);
  }
}
/******************************
 * TODO (목적): 단위작업 저장
 *******************************/
function saveJob() {
  if (props.investigation.sops && validTable(grid1.value.columns, props.investigation.sops)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        isSaveJob.value = !isSaveJob.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else message.validError()
}
function saveJobCallback() {
  message.requestSuccess()
  props.popupParam.searchProcess.isSearch = true

  getJobs()
}
/******************************
 * TODO (목적): 단위작업 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./musculoskeletalSystemJobDetail.vue`))
  )
  popupOptions.value.title = `${row.processName}/${row.sopName}별 부담작업 상세`
  popupOptions.value.param = {
    selectedJob: row,
    heaMuscleSopId: row.heaMuscleSopId,
    plantCd: props.investigation.plantCd,
    heaInvestigationPlanId: props.popupParam.heaInvestigationPlanId,
    sops: props.investigation.sops,
    heavyWorks: props.heavyWorks,
    disabled: props.disabled
  }
  popupOptions.value.width = '70%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  props.popupParam.searchProcess.isSearch = true
  emits('getDetail')
}
/******************************
 * TODO (목적): 단위작업 삭제
 *******************************/
function deleteJob() {
  const selectData = table1.value.getSelected()
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
          url: deleteJobUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getJobs()
          table1.value.compoTable.clearSelection()
          props.popupParam.searchProcess.isSearch = true

          if (
            selectedJob.value &&
            selectData.some((item: any) => item.heaMuscleSopId === selectedJob.value.heaMuscleSopId)
          ) {
            selectedJob.value = {
              heaMuscleSopId: '',
              mdmSopId: '',
              sopName: '',
              processName: ''
            }
          }
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}

/******************************
 * TODO (목적): 부담작업 항목 번호 목록 가져오기 함수
 *******************************/
function getHeavyWorkItems(row: any) {
  if (row && row.heavyWorks && Array.isArray(row.heavyWorks)) {
    return row.heavyWorks
      .map((item: any) => ({
        no: item.heaHeavyWorkNo,
        result: item.assessResult || ''
      }))
      .sort((a: any, b: any) => a.no - b.no)
  }
  return []
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
