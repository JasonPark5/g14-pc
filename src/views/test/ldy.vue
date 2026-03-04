<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text type="number" label="숫자" name="col12" v-model:value="testData.col12" />
        </div>
      </template>
    </c-search-box>
  </div>
  <c-card title="테스트">
    <template v-slot:card-button>
      <q-btn-group outline>
        <c-qr-btn mobileUrl="/sai/tbm/tbm?tbmId=" />
        <c-btn label="결재선변경" icon="history" @btnClicked="openApprLinePop" />
        <c-btn label="결재이력" icon="history" @btnClicked="openApprHistoryPop" />
        <c-btn label="버튼" icon="system_update_alt" @btnClicked="btnClicked" />
        <c-btn label="저장" icon="save" @btnClicked="btnClicked" />
        <c-btn label="검색" icon="search" @btnClicked="btnClicked" />
      </q-btn-group>
    </template>
    <template v-slot:card-detail>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-checkbox
          required
          :comboItems="comboItems"
          itemText="codeName"
          itemValue="code"
          label="기본"
          name="col1"
          v-model:value="testData.col1"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-checkbox
          isFlag
          trueLabel="true"
          falseLabel="false"
          label="기본"
          name="col99"
          v-model:value="testData.col99"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-checkbox
          isObject
          :comboItems="comboItems"
          valueText="a"
          valueKey="b"
          label="기본"
          name="col99"
          v-model:value="testData.col98"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker label="달력(일)" name="col3" v-model:value="testData.col3" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker
          range
          label="달력(년)"
          type="year"
          name="col3"
          v-model:value="testData.col3"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker range label="기간" name="col6" v-model:value="testData.col6" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-radio
          required
          :comboItems="comboItems"
          label="radio1"
          name="radio1"
          v-model:value="testData.col5"
        />
        <c-task-target
          :customPopupParam="{ targetKey: 'process' }"
          label="단위공정"
          :multiple="true"
          name="col5"
          v-model:value="testData.col5"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker
          required
          type="month"
          default="today"
          label="달력(월)"
          name="col2"
          v-model:value="testData.col2"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target-tree
          :required="true"
          plantCd="1000"
          targetKey="equipClass"
          label="설비유형"
          name="equipmentTypeCd"
          v-model:value="testData.equipmentTypeCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          name="equip"
          label="설비"
          :customPopupParam="customPopupParam"
          :nameOption="nameOption"
          v-model:value="testData.col14"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          required
          :comboItems="comboItems"
          itemText="codeName"
          type="search"
          itemValue="code"
          label="comboItems으로 들고오기"
          name="col4"
          v-model:value="testData.col4"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          codeGroupCd="PLANT_CD"
          itemText="codeName"
          type="search"
          itemValue="code"
          label="codeGrp으로 들고오기"
          name="col4"
          v-model:value="testData.col10"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          stepperGrpCd="EDU_STEP_CD"
          type="search"
          itemText="stepperMstNm"
          itemValue="stepperMstCd"
          label="stepperGrp으로 들고오기"
          name="col4"
          v-model:value="testData.col11"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-dept required type="edit" label="부서" name="col102" v-model:value="testData.col102" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-plant required type="edit" name="col103" v-model:value="testData.col103" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-dept-multi
          required
          :parentCheckDepts="deptCd"
          plantCd="1000"
          label="관리부서"
          name="deptCd"
          v-model:value="deptCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-label-text title="저장시설" value="탱크1" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-text required type="number" label="숫자" name="col12" v-model:value="testData.col12" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-text
          required
          type="number"
          label="숫자"
          name="col12"
          suffix="원"
          v-model:value="testData.col12"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-text required label="텍스트" name="col13" v-model:value="testData.col13" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-text required label="텍스트" name="col13" v-model:value="testData.col13" prefix="설비" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-plant required type="edit" name="col103" v-model:value="testData.col103" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-datepicker range label="기간" name="col6" v-model:value="testData.col6" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-field
          :required="true"
          :data="testData"
          deptValue="deptCd"
          type="plant_dept_user"
          label="관리감독자"
          name="col20"
          :isWrite="true"
          userName="userName"
          v-model:value="testData.col20"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-multi-field
          :data="testData"
          label="안전관리자"
          type="user"
          name="col21"
          v-model:value="testData.col21"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-moc
          documentTitle="installLocation"
          mocRelatedTaskCd="RT00000001"
          label="MOC번호"
          name="sopMocId"
          v-model:value="testData.sopMocId"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-textarea
          :required="true"
          label="요청내용"
          name="col14"
          :rows="4"
          :counter="true"
          :isCheck="true"
          v-model:value="testData.col14"
          @checkboxClick="checkboxClick"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-textarea
          :required="true"
          type="editor"
          label="내용"
          name="col61"
          :editheight="20"
          v-model:value="testData.col61"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-upload :attachInfo="attachInfo" />
        <c-notice-popup />
      </div>
    </template>
  </c-card>
  <div>관리감독자 값 : {{ testData.col20 }} {{ testData.deptCd }}</div>
  <div>부서 값 : {{ testData.col102 }}</div>
  <div>기본4 선택한 값 : {{ testData.col2 }}</div>
  <div>기본2 선택한 값 : {{ testData.col3 }}</div>
  <div>기본2 선택한 값 : {{ testData.col6 }}</div>
  <div>comboItems 선택한 값 : {{ testData.col4 }}</div>
  <div>숫자 입력한 값 : {{ testData.col12 }}</div>
  <div>텍스트 입력한 값 : {{ testData.col13 }}</div>
  <div>pickfile 입력한 값 : {{ pickFile.value }}</div>
  <div>pickfile 입력한 src : {{ pickFile.src }}</div>
  <div>radio1 선택한 값 : {{ testData.col5 }}</div>
  <div>텍스트 입력한 값 : {{ testData.col14 }}</div>
  <div>에디터 입력한 값 : {{ testData.col61 }}</div>
  <c-dialog :param="popupOptions" />
</template>

<script setup lang="ts">
// import { ref, shallowRef, defineAsyncComponent } from 'vue'

import selectConfig from '@/common/utils/selectConfig'

import { popupParamType } from '@/types/popupParam'

import AboutView from '@views/AboutView.vue'
import apprHistoryPop from '@popups/appr/apprHistoryPop.vue'
import apprLinePop from '@popups/appr/apprLinePop.vue'

defineOptions({
  name: 'IndexPage'
})

const testData = ref({
  col1: '1',
  col2: '',
  col3: '',
  col4: '1',
  col5: '',
  col6: [],
  col98: [
    { a: '1', b: '1' },
    { a: '3', b: '3' }
  ],
  col99: 'N',
  col100: '1',
  col101: '1',
  col102: '',
  col103: null,
  col10: '',
  col11: '',
  col12: '',
  col13: '',
  col20: 'U000000001',
  userName: '',
  col14: '',
  col61: '',
  col21: 'U000000001,U000000002',
  equipmentTypeCd: '',
  deptCd: '',
  sopMocId: 'SM00000047'
})
const comboItems = ref([
  { code: '1', codeName: '1' },
  { code: '2', codeName: '2' },
  { code: '3', codeName: '3' }
])

const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '60%',
  param: {},
  closeCallback: () => {}
})

const customPopupParam = ref({
  targetKey: 'equip',
  title: '설비 검색',
  width: '80%',
  isFull: false,
  param: {
    type: 'single',
    plantCd: '1000'
  }
})
const nameOption = ref({
  url: selectConfig.mdm.equipment.list.url,
  params: {
    key: true
  },
  namekey: 'equipmentName',
  valueKey: 'equipmentCd'
})

const deptCd = ref('D10001,D10002')

const pickFile = ref({
  value: null,
  src: ''
})
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: '4M_PLAN',
  taskKey: '1'
})

function btnClicked() {
  popupOptions.value.title = '팝업 테스트'
  popupOptions.value.param = {
    type: 'single'
  }
  popupOptions.value.target = shallowRef(AboutView)
  popupOptions.value.width = '60%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

function checkboxClick(checkValue: any) {
  if (checkValue.value === 'O') {
    testData.value.col14 = '누가'
  } else {
    testData.value.col14 = ''
  }
}

async function getList() {}

function openApprHistoryPop() {
  popupOptions.value.title = '결재이력'
  popupOptions.value.param = {
    sysApprovalRequestId: 'A000000250' // 결재요청코드
  }
  popupOptions.value.target = shallowRef(apprHistoryPop)
  popupOptions.value.width = '80%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup2
}
function closePopup2() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
function openApprLinePop() {
  popupOptions.value.title = '결재선 변경'
  popupOptions.value.param = {
    apprlinedata: [
      {
        approvalKindCd: 'AKC0000001',
        approvalKindName: '상신',
        approvalUserId: 'U000000001',
        approvalUserName: '안다미컴퍼니',
        deptName: '생산팀 A',
        approvalLineNo: 1,
        sysApprovalRequestId: '',
        approvalStatusName: '',
        approvalDt: '',
        draggable: false,
        approvalStatusCd: 'ASC0000000',
        approvalLineGrp: 1
      },
      {
        approvalKindCd: 'AKC0000003',
        approvalKindName: '결재',
        approvalUserId: 'U000000001',
        approvalUserName: '안다미컴퍼니',
        deptName: '생산팀 A',
        approvalLineNo: 2,
        sysApprovalRequestId: '',
        approvalStatusName: '',
        approvalDt: '',
        draggable: true,
        approvalStatusCd: '',
        approvalLineGrp: 1
      }
    ] as any,
    apprlinedata2: [] as any,
    approvalLineGrp: 1 as any
  }
  popupOptions.value.target = shallowRef(apprLinePop)
  popupOptions.value.width = '60%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup2
}
</script>
