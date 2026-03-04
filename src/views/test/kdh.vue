<template>
  <div>
    <c-search-box>
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
        <c-btn label="EXCEL UPLOAD" icon="system_update_alt" @btnClicked="exceluploadOpen" />
        <c-btn label="버튼" icon="system_update_alt" @btnClicked="btnClicked" />
        <c-btn label="저장" icon="add" @btnClicked="btnClicked" />
        <c-btn label="검색" icon="search" @btnClicked="btnClicked" />
      </q-btn-group>
    </template>
    <template v-slot:card-detail>
      <div
        :ref="
          (el: any) => {
            divs[0] = el! as Element
          }
        "
        class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
      >
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
      <div
        :ref="
          (el: any) => {
            divs[1] = el! as Element
          }
        "
        class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
      >
        <c-checkbox
          isFlag
          trueLabel="true"
          falseLabel="false"
          label="기본"
          name="col99"
          v-model:value="testData.col99"
        />
      </div>
      <div
        :ref="
          (el: any) => {
            divs[2] = el! as Element
          }
        "
        class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2"
      >
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
        <c-datepicker range label="기간" name="col6" v-model:value="testData.col6" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-label-text title="저장시설" value="탱크1" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-upload-picture height="300px" isMultiTask :attachInfo="attachInfoPicture" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-qr-btn mobileUrl="/sai/tbm/tbm?tbmId=" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-upload :attachInfo="attachInfo" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-task-target
          required
          plantCd="1000"
          name="equip"
          label="설비"
          :customPopupParam="customPopupParam"
          v-model:value="testData.col14"
        />
      </div>
    </template>
  </c-card>
  <!-- <c-card title="pick file 사진" height="300px">
    <template v-slot:card-button>
      <c-pick-file outlined dense v-model:value="pickFile.value" @getImageData="getImageData">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </c-pick-file>
    </template>
    <template v-slot:card-detail>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <q-img :src="pickFile.src" />
      </div>
    </template>
  </c-card> -->
  <div>부서 입력한 값 : {{ testData.col102 }}</div>
  <div>숫자(sample) 입력한 값 : {{ testData.col30 }}</div>
  <div>숫자 입력한 값 : {{ testData.col12 }}</div>
  <div>텍스트 입력한 값 : {{ testData.col13 }}</div>
  <!-- <c-tab
    type="horizon"
    :tabItems="tabItems"
    :inlineLabel="true"
    :dense="true"
    :height="tabHeight"
    v-model:value="tab"
  >
    <template v-slot:default="tab">
      <component :is="tab.component" />
    </template>
  </c-tab>
  <c-step stepperGrpCd="VUE3_TEST" currentStepCd="1" v-model:value="testData.col100" />
  <c-step :items="stepItems" currentStepCd="1" v-model:value="testData.col101" /> -->
  <c-dialog :param="popupOptions" />
</template>

<script setup lang="ts">
import { attachInfoPictureType } from '@/types/attachInfo'
import AboutView from '@views/AboutView.vue'
// import HomeView from '@views/HomeView.vue'

defineOptions({
  name: 'IndexPage'
})
const attachInfoPicture = ref<attachInfoPictureType>({
  isSubmit: '',
  task: []
})
const testData = ref({
  col1: '1',
  col2: '',
  col3: '',
  col4: '1',
  col5: '',
  col6: [],
  col30: 123,
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
  col14: ''
})
const divs = ref<Array<Element>>([])
const comboItems = ref([
  { code: '1', codeName: '1' },
  { code: '2', codeName: '2' },
  { code: '3', codeName: '3' }
])
// const stepItems = ref([
//   {
//     name: '1',
//     title: 'step 1',
//     component: shallowRef(defineAsyncComponent(() => import(`@views/test/TestView1.vue`)))
//   },
//   { name: '2', title: 'step 2', component: shallowRef(HomeView) }
// ])

const popupOptions = ref<popupParamType>({
  target: null,
  title: '',
  visible: false,
  width: '60%',
  param: {},
  closeCallback: () => {}
})
// const tabItems = ref([
//   {
//     name: '1',
//     icon: 'info',
//     label: 'Tab 1',
//     component: shallowRef(defineAsyncComponent(() => import(`@views/test/TestView1.vue`)))
//   },
//   {
//     name: '2',
//     icon: 'info',
//     label: 'Tab 2',
//     component: shallowRef(defineAsyncComponent(() => import(`@views/test/TestView2.vue`)))
//   }
// ])
// const tab = ref('1')
// const tabHeight = ref('300')

const deptCd = ref('D10001,D10002')

// const pickFile = ref({
//   value: null,
//   src: ''
// })
const attachInfo = ref({
  isSubmit: '',
  taskClassCd: '4M_PLAN',
  taskKey: '1'
})

const customPopupParam = ref({
  // targetKey, selection type 부모에서 정의
  targetKey: 'equip'
})

onMounted(() => {
  attachInfoPicture.value.task = [
    {
      taskClassCd: 'IBM_AFTER',
      taskKey: 'SI00000578'
    },
    {
      taskClassCd: 'IBM_AFTER',
      taskKey: 'SI00000614'
    }
  ]
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

// function getImageData(data: any) {
//   pickFile.value.src = data
// }

function exceluploadOpen() {
  popupOptions.value.title = '팝업 테스트'
  popupOptions.value.param = {
    type: 'single'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/test/exceluploadTest.vue`))
  )
  popupOptions.value.width = '100%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
</script>
