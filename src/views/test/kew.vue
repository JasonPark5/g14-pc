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
        <c-btn label="대기원료 추가" icon="add" @btnClicked="addRow" />
        <c-btn label="저장" icon="save" @btnClicked="btnClicked" />
        <c-btn label="검색" icon="search" @btnClicked="btnClicked" />
        <c-qr-btn mobileUrl="/sai/tbm/tbm?tbmId=" />
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
        <c-datepicker label="달력(일)" name="col3" v-model:value="testData.col3" />
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
        <c-label-text title="저장시설" value="탱크1" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="license"
          label="인허가 현황"
          :customPopupParam="{ targetKey: 'license' }"
          v-model:value="testData.limLicenseKindName3"
          @dataChange="dataChange"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="licenseKind"
          label="인허가 종류"
          :customPopupParam="{ targetKey: 'licenseKind' }"
          v-model:value="testData.limLicenseKindName4"
          @dataChange="dataChange"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="material"
          label="자재"
          :customPopupParam="{ targetKey: 'material' }"
          v-model:value="testData.limLicenseKindName5"
          @dataChange="dataChange"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="vendorUser"
          label="업체 직원"
          :customPopupParam="{ targetKey: 'vendorUser' }"
          v-model:value="testData.limLicenseKindName6"
          @dataChange="dataChange"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          name="senior"
          label="선임명"
          :customPopupParam="{ targetKey: 'senior' }"
          v-model:value="testData.limLicenseKindName7"
          @dataChange="dataChange"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-upload :attachInfo="attachInfo" />
      </div>
    </template>
  </c-card>
  <div>기본4 선택한 값 : {{ testData.col2 }}</div>
  <div>기본2 선택한 값 : {{ testData.col3 }}</div>
  <div>기본2 선택한 값 : {{ testData.col6 }}</div>
  <div>comboItems 선택한 값 : {{ testData.col4 }}</div>
  <div>숫자 입력한 값 : {{ testData.col12 }}</div>
  <div>텍스트 입력한 값 : {{ testData.col13 }}</div>
  <div>pickfile 입력한 값 : {{ pickFile.value }}</div>
  <div>pickfile 입력한 src : {{ pickFile.src }}</div>
  <div>radio1 선택한 값 : {{ testData.col5 }}</div>
  <div>limLicenseKindName : {{ testData.limLicenseKindName }}</div>
  <div>limLicenseKindName2 : {{ testData.limLicenseKindName2 }}</div>
  <div>limLicenseKindName3 : {{ testData.limLicenseKindName3 }}</div>
  <div>limLicenseKindName4 : {{ testData.limLicenseKindName4 }}</div>
  <div>limLicenseKindName5 : {{ testData.limLicenseKindName5 }}</div>
  <div>limLicenseKindName6 : {{ testData.limLicenseKindName6 }}</div>
  <div>limLicenseKindName7 : {{ testData.limLicenseKindName7 }}</div>
  <c-dialog :param="popupOptions" />
</template>

<script setup lang="ts">
// import { ref, shallowRef, defineAsyncComponent } from 'vue'

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
  col11: '',
  col12: '',
  col13: '',
  limLicenseKindName: '',
  limLicenseKindName2: '',
  limLicenseKindName3: '',
  limLicenseKindName4: '',
  limLicenseKindName5: '',
  limLicenseKindName6: '',
  limLicenseKindName7: ''
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

async function getList() {}

function dataChange() {}
function addRow() {
  popupOptions.value = getPopupOptions('airMaterial', popupOptions.value, closeMaterial, {
    type: 'multiple'
  })
}
function closeMaterial() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
</script>
