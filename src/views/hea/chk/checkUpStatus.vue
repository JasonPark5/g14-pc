<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker
          :range="true"
          label="최근검진 기간"
          defaultStart="-12M"
          defaultEnd="0M"
          -
          name="checkupRecentPeriod"
          v-model:value="searchParam.checkupRecentPeriod"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker
          :range="true"
          label="검진예정 기간"
          name="checkupSchedulePeriod"
          v-model:value="searchParam.checkupSchedulePeriod"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-dept
          :isFirstValue="false"
          type="search"
          label="부서"
          name="deptCd"
          v-model:value="searchParam.deptCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-field label="대상자" name="userId" v-model:value="searchParam.userId" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-checkbox
          :isFlag="true"
          label="특수검진주기 미설정 조회"
          name="cycleFlag"
          v-model:value="searchParam.emptyFlag"
        />
      </div>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          type="search"
          itemText="codeName"
          itemValue="code"
          :comboItems="cycleItems"
          name="typeName"
          label="검진종류"
          v-model:value="searchParam.typeName"
        />
      </div> -->
    </template>
  </c-search-box>
  <c-table
    ref="userTable"
    title="특수검진 주기 및 도래 현황 목록"
    :columns="grid.columns"
    :data="grid.data"
    rowKey="userId"
    selection="multiple"
  >
    <template v-slot:customArea="{ props, col }">
      <template v-if="col.name === 'checkupComeDate'">
        <span>
          {{ props.row.nextDate }}
          <span v-if="props.row.checkupComeDate == -9999 || props.row.checkupComeDate === null"
            >-</span
          >
          <span
            v-else-if="props.row.checkupComeDate <= 0 && props.row.checkupComeDate >= -14"
            class="blinking text-red text-bold"
            >{{ Math.abs(props.row.checkupComeDate) + 1 + $language(' 일 전') }}</span
          >
          <span v-else-if="props.row.checkupComeDate < 0">{{
            Math.abs(props.row.checkupComeDate) + 1 + $language(' 일 전')
          }}</span>
          <span v-else-if="props.row.checkupComeDate > 0" class="blinking text-green">{{
            '검진예정일이 ' + Math.abs(props.row.checkupComeDate) + ' 일 지남'
          }}</span>
          <span v-else />
        </span>
      </template>
    </template>
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="엑셀 업로드" icon="upload" @btnClicked="openExcelUploader" />
        <c-btn v-if="editable" label="대상자 추가" icon="add" @btnClicked="addUser" />
        <c-btn v-if="editable" label="대상자 제외" icon="remove" @btnClicked="removeUser" />
        <c-btn
          v-if="editable && grid.data.length > 0"
          :url="saveUrl"
          :isSubmit="isSave"
          :param="grid.data"
          mappingType="PUT"
          label="저장"
          icon="save"
          @beforeAction="saveCycle"
          @btnCallback="saveCallback"
        />
        <c-btn label="검색" icon="search" @btnClicked="getList" />
      </q-btn-group>
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
import { filter, forEach, findIndex } from 'lodash-es'

import { useUserStore } from '@stores/user'
import { storeToRefs } from 'pinia'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'checkUpStatus'
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
const searchParam = ref({
  plantCd: null,
  deptCd: null,
  userId: '',
  typeName: '',
  emptyFlag: 'N',
  checkupRecentPeriod: [],
  checkupSchedulePeriod: []
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      style: 'width: 80px',
      label: '사업장',
      align: 'center',
      sortable: true
    },
    {
      name: 'deptName',
      field: 'deptName',
      style: 'width: 100px',
      label: '부서',
      align: 'center',
      sortable: true
    },
    {
      name: 'empNo',
      field: 'empNo',
      label: '사번',
      style: 'width: 80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'userName',
      field: 'userName',
      style: 'width: 100px',
      label: '대상자',
      align: 'center',
      sortable: true
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      style: 'width: 100px',
      label: '생년월일',
      align: 'center',
      sortable: true
    },
    // {
    //   name: 'cycleName',
    //   field: 'cycleName',
    //   style: 'width: 100px',
    //   label: '검진종류',
    //   align: 'center',
    //   sortable: true
    // },
    // {
    //   name: 'spotName',
    //   field: 'spotName',
    //   style: 'width: 80px',
    //   label: '직위',
    //   align: 'center',
    //   sortable: true,
    // },
    // {
    //   name: 'jobName',
    //   field: 'jobName',
    //   style: 'width: 80px',
    //   label: '직책',
    //   align: 'center',
    //   sortable: true,
    // },
    // {
    //   name: 'birthDate',
    //   field: 'birthDate',
    //   style: 'width: 100px',
    //   label: '생년월일',
    //   align: 'center',
    //   sortable: true,
    // },
    {
      required: true,
      name: 'cycleCd',
      field: 'cycleCd',
      label: '특수검진주기',
      align: 'center',
      style: 'width:120px',
      type: 'select',
      setHeader: true,
      codeGroupCd: 'CHECK_UP_CYCLE_CD',
      sortable: false
    },
    {
      name: 'checkupRecentDate',
      field: 'checkupRecentDate',
      label: '최근 검진일',
      style: 'width: 120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkupScheduleDate',
      field: 'checkupScheduleDate',
      label: '검진 예정일',
      style: 'width: 120px',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkupComeDate',
      field: 'checkupComeDate',
      label: '검진일 도래',
      align: 'center',
      type: 'custom',
      style: 'width: 140px',
      sortable: true
    },
    {
      name: 'checkupStatus',
      field: 'checkupStatus',
      label: '비고',
      align: 'left',
      type: 'textarea',
      style: 'width: 160px',
      sortable: true
    }
  ],
  data: []
})
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const cycleItems = ref<codeMasterType>([])
const cycleCdItems = ref<codeMasterType>([])
const userTable = ref<any>(null)

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
  listUrl.value = selectConfig.mdm.user.cycle.list.url
  saveUrl.value = transactionConfig.mdm.user.cycle.save.url
  // code setting
  cycleItems.value = [
    { code: 'spe', codeName: $language('특수') },
    { code: 'batch', codeName: $language('배치전') },
    { code: 'occ', codeName: $language('수시') }
  ]
  getComboItems('CHECK_UP_CYCLE_CD').then((_result: any) => {
    cycleCdItems.value = _result
  })
  // list setting
  getList()
}

/******************************
 * TODO (목적): 개인별 검진결과 목록 조회
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
 * TODO (목적): 주기 및 비고 입력하여 저장
 *******************************/
function saveCycle() {
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
function saveCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * TODO (목적): 엑셀업로드 팝업오픈
 *******************************/
function openExcelUploader() {
  popupOptions.value.title = '대상자별 특수검진 주기 업로드'
  popupOptions.value.param = {}
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./checkUpStatusExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    const s_data = filter(_data, (item) => !item.error_message)
    forEach(s_data, (item) => {
      item.regUserId = user.value.userId // 등록자 ID
      item.chgUserId = user.value.userId // 수정자 ID
      item.editFlag = 'C'
      const idx = findIndex(cycleCdItems.value, { codeName: item.cycleName })
      if (idx > -1) item.cycleCd = cycleCdItems.value[idx].code
      else item.cycleCd = null
    })
    $http({
      url: transactionConfig.mdm.user.cycle.uploadSave.url,
      method: 'POST',
      data: s_data
    }).then((_result: any) => {
      if (_result !== _data.length) {
        message.confirm({
          title: '안내',
          message:
            '업로드한 엑셀 파일에 사번과 대상자명이 소속직원과 일치하지 않은 행이 존재합니다. 해당 행을 제외하고 저장하시겠습니까?',
          type: 'info',
          confirmCallback: () => {
            message.requestSuccess()
            getList()
          },
          cancelCallback: () => {}
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 특수검진 대상자에 근무자 추가
 *******************************/
function addUser() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    type: 'multiple',
    searchParam: { cycleFlag: 'N', deptCd: '' }
  })
}
function closeUserPopup(_data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    _data.forEach((item: any) => {
      ;(item.editFlag = 'C'), (item.regUserId = user.value.userId)
    })
    $http({
      url: saveUrl.value,
      method: 'POST',
      data: _data
    }).then(() => {
      message.requestSuccess()
      getList()
    })
  }
}
/******************************
 * TODO (목적): 특수검진 대상자에서 근무자 제외
 *******************************/
function removeUser() {
  const selectData = userTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '제외할 근무자를 선택해주세요.',
      type: 'info' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '선택한 근무자를 특수검진 대상자에서 제외하시겠습니까?',
      type: 'warning', // success / info / warning / error
      confirmCallback: () => {
        $http({
          url: transactionConfig.mdm.user.cycle.delete.url,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
          })
          userTable.value.compoTable.clearSelection()
        })
      },
      cancelCallback: () => {}
    })
  }
}
</script>
