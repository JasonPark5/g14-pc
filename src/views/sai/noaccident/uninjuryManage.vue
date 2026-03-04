<template>
  <div>
    <!-- <div class="row">
      <div class="col-12">
        <c-search-box @enter="getList">
          <template v-slot:search>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-plant type="none" v-model:value="searchParam.plantCd" @datachange="getList" />
            </div>
          </template>
        </c-search-box>
      </div>
    </div> -->
    <c-table
      ref="table"
      title="무재해 추진운동"
      :columns="grid.columns"
      :data="deptUninjurys"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      rowKey="deptCd"
      selection="multiple"
    >
      <!-- @linkClick="linkClick" -->
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <q-icon name="help" size="xs" style="margin: 4px 8px 0 0" class="text-primary">
            <q-tooltip
              anchor="bottom left"
              self="top right"
              :offset="[0, 0]"
              style="font-size: 0.9em; padding: 10px"
            >
              {{
                $language(
                  `① [무재해 1배수 목표] 란 업종·규모별로 사업장을 그룹화하고, 그룹 내 사업장들이 평균적으로 재해자 1명이 발생하는 기간 동안 당해 사업장에서 재해가
              발생하지 않는 것을 말합니다.`
                )
              }}<br /><br />
              {{ $language('② 다음은 사업장 그룹화 예시입니다.') }}
              <q-table
                :rows="[
                  {
                    type: '근로자수',
                    header: '1배 목표',
                    g1: '50인 미만 / 480일',
                    g2: '50~99인 / 420일',
                    g3: '100~199 / 400일',
                    g4: '200~299 / 320일',
                    g5: '300~499 / 135일',
                    g6: '500~699 / 120일'
                  },
                  {
                    type: '공사금액',
                    header: '1배 목표',
                    g1: '5억원 미만 / 480일',
                    g2: '5~50억원 미만 / 420일',
                    g3: '50~100억원 미만 / 400일',
                    g4: '100~500억원 미만 / 320일',
                    g5: '500억원 이상 / 120일',
                    g6: '-'
                  }
                ]"
                :columns="[
                  { field: 'type', name: 'type', align: 'center', label: '그룹기준' },
                  { field: 'header', name: 'header', align: 'center', label: '목표' },
                  { field: 'g1', name: 'g1', align: 'center', label: '그룹1' },
                  { field: 'g2', name: 'g2', align: 'center', label: '그룹2' },
                  { field: 'g3', name: 'g3', align: 'center', label: '그룹3' },
                  { field: 'g4', name: 'g4', align: 'center', label: '그룹4' },
                  { field: 'g5', name: 'g5', align: 'center', label: '그룹5' },
                  { field: 'g6', name: 'g6', align: 'center', label: '그룹6' }
                ]"
                dense
                dark
                hide-bottom
              /><br />
              {{ $language('③ 무재해 운동 적용 사업장') }}<br />
              {{ $language('- 안전관리자를 선임해야 하는 상시 근로자 50인 이상 사업장') }}<br />
              {{ $language('- 건설공사의 경우 도급금액 10억 이상 건설현장') }}<br /><br />
              {{
                $language(
                  `④ 치료기일이 3일 이내의 경미한 사항은 무재해로 계산. 무재해 개시 후 재해가 발생하면 [달성일수 : 0일, 배수 : 1] 로 카운팅 재시작`
                )
              }}<br />
            </q-tooltip>
          </q-icon>
          <c-btn v-if="editable" label="대상부서 추가" icon="add" @btnClicked="addDept" />
          <c-btn
            v-if="editable && deptUninjurys && deptUninjurys.length > 0"
            label="대상부서 삭제"
            icon="remove"
            @btnClicked="deleteDept"
          />
          <c-btn
            v-if="editable && deptUninjurys && deptUninjurys.length > 0"
            label="무재해 달성등록"
            color="green"
            icon="autorenew"
            @btnClicked="endUninjury"
          />
          <c-btn
            v-if="editable && deptUninjurys && deptUninjurys.length > 0"
            label="무재해 미달성등록"
            color="red"
            icon="gpp_bad"
            @btnClicked="endFailUninjury"
          />
          <c-btn
            label="저장"
            icon="save"
            @btnClicked="saveDept"
            v-if="editable && deptUninjurys && deptUninjurys.length > 0"
          />
          <!-- <c-btn label="검색" icon="search" @btnClicked="getList" /> -->
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'successFlag'" />
        <template v-if="col.name === 'passDate'">
          <q-chip v-if="chgTargetStatus(props.row)" outline square color="red">
            {{ $language('목표초과') }} +{{ targetStatusDay(props.row) }} 일
          </q-chip>
          <q-chip v-else outline square color="primary">
            {{ targetStatusDay(props.row) }} 일
          </q-chip>
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">무재해 미달성등록</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <c-datepicker
            required
            :editable="editable"
            label="종료(미달성) 일"
            name="hideEndDate"
            v-model:value="hideEndDate"
          />
          <br />
          <c-text
            required
            :editable="editable"
            label="종료(미달성) 사유"
            name="hideRemark"
            v-model:value="hideRemark"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$language('취소')" @click="cancelFail" />
          <q-btn flat :label="$language('저장')" @click="saveFail" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
import moment from 'moment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'uninjuryManage'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
const prompt = ref(false)
const hideEndDate = ref('')
const hideRemark = ref('')
// const searchParam = ref({
//   plantCd: null,
//   uninjuryYear: ''
// })
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const deptUninjurys = ref<any>([
  {
    plantCd: '', // 사업장코드
    saiDeptUninjuryId: '', // 무재해현황 일련번호
    deptCd: '', // 부서
    deptName: '',
    startDt: '', // 무재해 시작일
    targetDt: '', // 무재해 목표달성 예정일
    endFlag: '', // 종료여부
    endReasonCd: '', // 종료사유 코드
    endDt: '', // 종료일
    endFlagName: '',
    increaseFlag: '',
    standardDay: '', // 기준일
    multipleCnt: '', // 배수
    targetDay: '', // 목표일수
    targetExpectedDt: '', // 달성예정일
    recentAccidentDt: '', // 최근사고일
    attainDay: '', // 현재달성일수
    recentAccidentUserName: '', // 최근사고자
    remark: '',
    paymentFlag: ''
  }
])
const grid = ref({
  // merge: [{ index: 0, colName: 'upDeptCd' }],
  columns: [
    // {
    //   setHeader: true,
    //   name: 'upDeptName',
    //   field: 'upDeptName',
    //   label: '상위부서',
    //   style: 'width:100px',
    //   align: 'center',
    //   sortable: false
    // },
    {
      setHeader: true,
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      style: 'width:140px',
      align: 'center',
      sortable: false
    },
    {
      name: 'standardDay',
      field: 'standardDay',
      label: '기준일',
      style: 'width:100px',
      align: 'right',
      type: 'number',
      sortable: false
    },
    {
      required: true,
      name: 'multipleCnt',
      field: 'multipleCnt',
      label: '배수',
      align: 'right',
      type: 'number',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'targetDay',
      field: 'targetDay',
      label: '목표일수',
      align: 'right',
      type: 'cost',
      style: 'width:100px',
      sortable: false
    },
    {
      name: 'targetExpectedDt',
      field: 'targetExpectedDt',
      label: '달성예정일',
      align: 'center',
      style: 'width:140px',
      sortable: false
    },
    {
      required: true,
      name: 'startDt',
      field: 'startDt',
      label: '개시일',
      align: 'center',
      type: 'date',
      style: 'width:140px',
      sortable: false
    },
    {
      name: 'attainDay',
      field: 'attainDay',
      label: '현재달성일수',
      align: 'right',
      type: 'cost',
      style: 'width:140px',
      sortable: false
    },
    {
      name: 'passDate',
      field: 'passDate',
      label: '목표일기준',
      align: 'center',
      type: 'custom',
      style: 'width:160px',
      sortable: false
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      type: 'text',
      sortable: false
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const updateMstUrl = ref('')
const deleteMstUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => deptUninjurys.value,
  (newData: any) => {
    newData.forEach((row: any) => {
      setTargetDate(newData, row)
      setAttainDay(row)
    })
  },
  { deep: true }
)

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
  listUrl.value = selectConfig.sai.uninjury.list.url
  updateMstUrl.value = transactionConfig.sai.uninjury.update.url
  deleteMstUrl.value = transactionConfig.sai.uninjury.delete.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET'
    // params: searchParam.value
  }).then((_result: any) => {
    deptUninjurys.value = _result.data
    table.value.compoTable.clearSelection()
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveDept() {
  if (deptUninjurys.value && validTable(grid.value.columns, deptUninjurys.value)) {
    const saveData = deptUninjurys.value.filter((x: any) => x.editFlag == 'U' || x.editFlag == 'C')
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData && saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: updateMstUrl.value,
            method: 'PUT',
            data: saveData
          }).then(() => {
            getList()
            message.alert({
              title: '안내',
              message: '저장되었습니다.',
              type: 'success' // success / info / warning / error
            })
          })
        },
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
function deleteDept() {
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
      confirmCallback: () => {
        $http({
          url: deleteMstUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          getList()
          table.value.compoTable.clearSelection()
        })
      },
      cancelCallback: () => {}
    })
  }
}
function addDept() {
  popupOptions.value = getPopupOptions('dept', popupOptions.value, closeDept, {
    type: 'multiple'
  })
}
function closeDept(result: Array<any>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (result && result.length > 0) {
    _.forEach(result, (item) => {
      if (_.findIndex(deptUninjurys.value, { deptCd: item.deptCd }) === -1) {
        deptUninjurys.value.push({
          // plantCd: searchParam.value.plantCd, // 사업장코드
          saiDeptUninjuryId: uid(), // 무재해현황 일련번호
          deptCd: item.deptCd, // 부서
          deptName: item.deptName,
          startDt: getToday(), // 무재해 시작일
          targetDt: '', // 무재해 목표달성 예정일
          endFlag: 'N', // 종료여부
          endReasonCd: '', // 종료사유 코드
          endDt: '', // 종료일
          endFlagName: '',
          increaseFlag: '',
          standardDay: 365, // 기준일
          multipleCnt: 1, // 배수
          targetDay: '', // 목표일수
          targetExpectedDt: '', // 달성예정일
          recentAccidentDt: '', // 최근사고일
          attainDay: '', // 현재달성일수
          recentAccidentUserName: '', // 최근사고자
          remark: '',
          paymentFlag: '',
          editFlag: 'C'
        })
      }
    })
  }
}
function endFailUninjury() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else if (!selectData || selectData.length > 1) {
    message.alert({
      title: '안내',
      message: '무재해 실패등록은 한건씩 가능합니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    prompt.value = true
  }
}
/******************************
 * TODO (목적): 무재해 달성 추가
 *******************************/
function endUninjury() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    let isEndFlag = false
    _.forEach(selectData, (item) => {
      if (Number(getDatediff(moment(item.targetExpectedDt))) < 0) {
        isEndFlag = true
      }
    })
    if (isEndFlag) {
      message.alert({
        title: '안내',
        message: '달성되지 않은 부서가 있습니다.',
        type: 'warning' // success / info / warning / error
      })
    } else {
      message.confirm({
        title: '확인',
        message: '무재해 달성처리 후 개시일을 초기화 합니다. 진행하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          _.forEach(selectData, (item) => {
            item.history = {
              plantCd: item.plantCd, // 사업장코드
              deptCd: item.deptCd, // 부서코드
              startDt: item.startDt, // 개시일
              endDt: item.targetExpectedDt, // 종료일
              targetDay: item.targetDay, // 목표일수
              realEndDt: item.targetExpectedDt, // 실제
              realDay: item.targetDay, // 목표일수
              paymentFlag: 'N', // 지급여부
              remark: item.remark, // 비고
              uninjuryStateCd: 'USC0000001', // 성공실패코드 (성공)
              regUserId: user.value.userId, // 작성자
              chgUserId: user.value.userId // 수정자
            }
            item.editFlag = 'C'
            item.multipleCnt = Number(item.multipleCnt) + 1 // 배수증가
            item.startDt = getAddDay(item.targetExpectedDt, 1) // 달성예정일

            const _multipleday = Number(item.standardDay) // 1차 목표일수
            const _targetday = Number(_multipleday) * Number(item.multipleCnt)
            const _targetDate = _targetday
            item.targetDay = _targetDate // 목표일수 (1차 목표일수 x 배수)
            item.targetExpectedDt = getAddDay(item.startDt, Number(item.targetDay)) // 달성예정일
            item.attainDay = Number(getDatediff(moment(item.startDt)))
          })
          $http({
            url: transactionConfig.sai.uninjury.history.url,
            method: 'POST',
            data: selectData
          }).then(() => {
            getList()
            message.alert({
              title: '안내',
              message: '무재해 달성이력에서 확인 가능합니다.',
              type: 'success' // success / info / warning / error
            })
          })
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    }
  }
}
/******************************
 * TODO (목적): 목표일 설정
 *******************************/
function setTargetDate(_data: any, _row: any) {
  const _multipleday = Number(_row.standardDay) // 1차 목표일수
  const _targetday = Number(_multipleday) * Number(_row.multipleCnt)
  const _targetDate = _targetday
  _row.targetDay = _targetDate // 목표일수 (1차 목표일수 x 배수)
  _row.targetExpectedDt = getAddDay(_row.startDt, Number(_targetDate)) // 달성예정일
}
/******************************
 * TODO (목적): 현재달성일수 설정
 *******************************/
function setAttainDay(_row: any) {
  _row.attainDay = getDatediff(moment(_row.startDt))
}
/******************************
 * TODO (목적): 무재해 달성여부 설정_
 *******************************/
function chgTargetStatus(row: any) {
  let result = false
  if (Number(getDatediff(moment(row.targetExpectedDt))) >= 0) result = true
  return result
}
function targetStatusDay(row: any) {
  return Number(getDatediff(moment(row.targetExpectedDt)))
}

function cancelFail() {
  hideEndDate.value = ''
  hideRemark.value = ''
  prompt.value = false
}
function saveFail() {
  if (!hideEndDate.value || !hideRemark.value) {
    message.alert({
      title: '안내',
      message: '종요일과 사유를 입력하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message:
        '저장 시 기존내용은 미달성이력으로 저장이 되며\r\n종료일 다음날부터 새로운 목표가 생성됩니다.\r\n미달성 등록을 진행하시겠습니까?',
      type: 'info',
      confirmCallback: () => {
        const _selectData = table.value.getSelected()
        _.forEach(_selectData, (item) => {
          item.history = {
            plantCd: item.plantCd, // 사업장코드
            deptCd: item.deptCd, // 부서코드
            startDt: item.startDt, // 개시일
            endDt: item.targetExpectedDt, // 종료일
            targetDay: item.targetDay, // 목표일수
            realEndDt: hideEndDate.value, // 실제
            realDay: getDatediff(moment(item.startDt), moment(hideEndDate.value)), // 목표일수
            paymentFlag: 'N', // 지급여부
            remark: hideRemark.value, // 비고
            uninjuryStateCd: 'USC0000002', // 성공실패코드 (성공)
            regUserId: user.value.userId, // 작성자
            chgUserId: user.value.userId // 수정자
          }
          item.editFlag = 'C'
          item.multipleCnt = 1 // 배수초기화
          item.startDt = getAddDay(hideEndDate.value, 1) // 달성예정일

          const _multipleday = Number(item.standardDay) // 1차 목표일수
          const _targetday = Number(_multipleday) * Number(item.multipleCnt)
          const _targetDate = _targetday
          item.targetDay = _targetDate // 목표일수 (1차 목표일수 x 배수)
          item.targetExpectedDt = getAddDay(item.startDt, Number(item.targetDay)) // 달성예정일
          item.attainDay = Number(getDatediff(moment(item.startDt)))
        })
        $http({
          url: transactionConfig.sai.uninjury.history.url,
          method: 'POST',
          data: _selectData
        }).then(() => {
          getList()
          message.alert({
            title: '안내',
            message: '무재해 이력에서 확인 가능합니다.',
            type: 'success' // success / info / warning / error
          })
          hideEndDate.value = ''
          hideRemark.value = ''
          prompt.value = false
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
