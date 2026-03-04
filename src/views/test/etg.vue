<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text type="number" label="숫자" name="col12" v-model:value="testData.col12" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
          <c-map-marker
            :isSelected="true"
            :style="`transform: translate(30px, 30px);z-index: auto; user-select: auto; width: 30px; height: 30px;`"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
          <c-map-marker
            :isImg="true"
            :style="`transform: translate(30px, 30px);z-index: auto; user-select: auto; width: 30px; height: 30px;`"
            :isSelected="true"
            imgSrc="/src/assets/images/장비8.png"
          />
        </div>
      </template>
    </c-search-box>
  </div>
  <c-card title="테스트">
    <template v-slot:card-button>
      <q-btn-group outline>
        <c-btn label="버튼" icon="system_update_alt" @btnClicked="btnClicked" />
        <c-btn label="저장" icon="add" @btnClicked="btnClicked" />
        <c-btn label="검색" icon="search" @btnClicked="btnClicked" />
      </q-btn-group>
    </template>
    <template v-slot:card-detail>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          required
          :isChip="true"
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
        <c-text required label="텍스트" name="col13" v-model:value="testData.col13" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-text required label="텍스트" name="col13" v-model:value="testData.col13" prefix="설비" />
      </div>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-plant required type="edit" name="col103" v-model:value="testData.col103" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-multi-select
          required
          :comboItems="comboItems"
          itemText="codeName"
          type="search"
          itemValue="code"
          label="comboItems multi select"
          name="col14"
          v-model:value="testData.col14"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-multi-select
          codeGroupCd="PLANT_CD"
          type="search"
          itemText="codeName"
          itemValue="code"
          label="grp multi select"
          :isArray="false"
          name="col15"
          v-model:value="testData.col15"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-tag
          itemText="codeName"
          itemValue="code"
          label="교관"
          name="col16"
          v-model:value="testData.col16"
          icon="person"
          @removeTag="remove"
          @addTag="add"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-appr-btn
          ref="appr-btn"
          name="work-permit-appr-btn"
          :approvalInfo="approvalInfo"
          @beforeApprAction="beforeAppr"
          @callbackApprAction="callbackAppr"
          @requestAfterAction="afterAppr"
        />
      </div>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-multi-field
          :data="testData"
          label="안전관리자"
          type="user"
          name="col17"
          v-model:value="testData.col17"
        />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <video-player ref="videoPlayer" :options="playerOptions" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="equip"
          label="설비"
          :customPopupParam="customPopupParam"
          v-model:value="testData.col18"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="col20"
          label="상위 공정"
          :customPopupParam="customPopupParam3"
          v-model:value="testData.col20"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="col19"
          label="단위 공정"
          :customPopupParam="customPopupParam2"
          v-model:value="testData.col19"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="col21"
          label="사용자"
          :customPopupParam="customPopupParam4"
          v-model:value="testData.col21"
        />
      </div>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="col22"
          label="부서"
          :customPopupParam="customPopupParam5"
          v-model:value="testData.col22"
        />
      </div> -->
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
        <c-task-target
          :customPopupParam="{ targetKey: 'edu' }"
          label="교육"
          name="processCd"
          v-model:value="processCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-multi-field
          :data="testData"
          label="안전관리자"
          :isArray="true"
          type="user"
          name="col30"
          v-model:value="testData.col30"
        />
      </div>
    </template>
  </c-card>
  <div>multi-field 선택한 값 : {{ testData.col30 }}</div>
  <div>기본4 선택한 값 : {{ testData.col2 }}</div>
  <div>기본2 선택한 값 : {{ testData.col3 }}</div>
  <div>기본2 선택한 값 : {{ testData.col6 }}</div>
  <div>comboItems 선택한 값 : {{ testData.col4 }}</div>
  <div>숫자 입력한 값 : {{ testData.col12 }}</div>
  <div>텍스트 입력한 값 : {{ testData.col13 }}</div>
  <div>radio1 선택한 값 : {{ testData.col5 }}</div>
  <div>multiselect 선택한 값 : {{ testData.col14 }}</div>
  <div>multiselect 선택한 값 : {{ testData.col15 }}</div>
  <c-dialog :param="popupOptions" />
  <c-win-pop
    ref="winPopup"
    @onClose="(val: any) => evtCloseWinPopup(val)"
    @onRecvEvtFromWinPop="(val: any) => onRecvWinPop(val)"
  />
  <c-notice-popup />
</template>

<script setup lang="ts">
// import { ref, shallowRef, defineAsyncComponent } from 'vue'

import { apprInfoType } from '@/types/approval'

import { popupParamType } from '@/types/popupParam'

import AboutView from '@views/AboutView.vue'

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
  col11: null,
  col12: 0,
  col13: '',
  col14: ['1'],
  col15: '1000,2000',
  col16: [
    {
      code: '1',
      codeName: '홍길동'
    },
    {
      code: '2',
      codeName: '김길동'
    }
  ],
  col17: 'U000000001,U000000002',
  col18: '',
  col19: '',
  col20: '',
  col21: 'U000000007',
  col22: '',
  col23: '',
  col24: '',
  col30: ['U000000001', 'U000000002']
})
const comboItems = ref([
  { code: '1', codeName: '1', attrVal1: 'red' },
  { code: '2', codeName: '2' },
  { code: '3', codeName: '3' }
])
const deptCd = ref('D10001,D10002')
const processCd = ref('')
const approvalInfo = ref<apprInfoType>({
  sysApprovalRequestId: 'temp', // 결재요청번호
  /**
   * 결재상태코드
   * ASC0000001	결재중
   * ASC0000002	반려
   * ASC9999999	결재완료
   */
  approvalStatusCd: 'TEST',
  apprEditable: true, // 결재버튼 활성화 기준
  param: {
    key: 'TEST'
  }, // 결재 param
  approvalUrl: 'TEST', // 결재 url
  isApproval: true, // 결재 submit
  approvalTypeCd: 'TEST', // 결재유형코드
  approvalParamValue: {
    // 결재상세화면 파라미터
    isApprContent: true
  },
  approvalRequestName: 'TEST',
  approvalConnId: 'TEST'
})

const playerOptions = ref({
  autoplay: false,
  controls: true,
  playsinline: true,
  fluid: true, // 비디오 플레이어가 컨테이너에 맞게 크기 조정
  controlBar: {
    timeDivider: true,
    durationDisplay: true,
    playToggle: false,
    remainingTimeDisplay: true,
    progressControl: true,
    qualitySelector: true,
    volumePanel: {
      inline: false // 볼륨 패널이 컨트롤 바 내에 위치
    }
  }
  // height: (window.innerHeight - 120) + 'px',
})

const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '60%',
  param: {},
  closeCallback: () => {}
})

const customPopupParam = ref({
  // targetKey, selection type 부모에서 정의
  targetKey: 'equip',
  setSearchParam: {
    lawEquipmentFlag: 'Y'
  }
})

const customPopupParam2 = ref({
  // targetKey, selection type 부모에서 정의
  targetKey: 'process',
  setSearchParam: {
    processLevelCd: '20'
  }
})

const customPopupParam3 = ref({
  // targetKey, selection type 부모에서 정의
  targetKey: 'upProcess',
  setSearchParam: {
    processLevelCd: '10'
  }
})

const customPopupParam4 = ref({
  // targetKey, selection type 부모에서 정의
  targetKey: 'user'
})

const activeWinProps = ref({
  text: ''
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

async function getList() {}

function evtCloseWinPopup(val: any) {
  // Object.assign(this.$data.activeWinProps, this.$options.data().activeWinProps);
  console.log(val)
}

function onRecvWinPop(recvObj: any) {
  if (recvObj) {
    activeWinProps.value.text = recvObj.text
  }
}

function add() {}

function remove() {}

function beforeAppr() {}

function callbackAppr() {}

function afterAppr() {}
</script>
