<template>
  <div>
    <q-form ref="editForm">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <c-card title="기본정보" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-plant
                :required="true"
                :editable="false"
                type="edit"
                name="plantCd"
                v-model:value="props.popupParam.dailyReportData.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :required="true"
                :editable="false"
                label="작업일자"
                name="dailyResultDt"
                v-model:value="props.popupParam.dailyReportData.dailyResultDt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :required="true"
                :editable="false"
                type="user"
                label="작성자"
                name="userId"
                v-model:value="props.popupParam.dailyReportData.userId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-select
                :editable="false"
                codeGroupCd="WEATHER_CD"
                type="edit"
                itemText="codeName"
                itemValue="code"
                name="weatherCd"
                label="날씨"
                v-model:value="props.popupParam.dailyReportData.weatherCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="false"
                label="온도"
                suffix="℃"
                name="temperature"
                v-model:value="props.popupParam.dailyReportData.temperature"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :editable="false"
                label="1근 근무자"
                name="worker1UserId"
                :isWrite="true"
                userName="worker1UserName"
                :data="props.popupParam.dailyReportData"
                v-model:value="props.popupParam.dailyReportData.worker1UserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :editable="false"
                label="2근 근무자"
                name="worker2UserId"
                :isWrite="true"
                userName="worker2UserName"
                :data="props.popupParam.dailyReportData"
                v-model:value="props.popupParam.dailyReportData.worker2UserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :editable="false"
                label="3근 근무자"
                name="worker3UserId"
                :isWrite="true"
                userName="worker3UserName"
                :data="props.popupParam.dailyReportData"
                v-model:value="props.popupParam.dailyReportData.worker3UserId"
              />
            </div>
          </template>
        </c-card>
      </div>

      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <component
          :is="component1"
          :param="popupParam"
          :dailyReportData="props.popupParam.dailyReportData"
        />
        <component
          :is="component2"
          :param="popupParam"
          :dailyReportData="props.popupParam.dailyReportData"
        />
        <component
          :is="component3"
          :param="popupParam"
          :dailyReportData="props.popupParam.dailyReportData"
        />
        <component
          :is="component4"
          :param="popupParam"
          :dailyReportData="props.popupParam.dailyReportData"
        />
        <!-- <component :is="component5" :param="popupParam" /> -->
        <component
          :is="component6"
          :param="popupParam"
          :dailyReportData="props.popupParam.dailyReportData"
        />
        <component
          :is="component7"
          :param="popupParam"
          :dailyReportData="props.popupParam.dailyReportData"
        />
        <!-- <component :is="component8" :param="popupParam" /> -->
        <component
          :is="component9"
          :param="popupParam"
          :dailyReportData="props.popupParam.dailyReportData"
        />
        <component
          :is="component10"
          :param="popupParam"
          :dailyReportData="props.popupParam.dailyReportData"
        />
        <!-- <component :is="component11" :param="popupParam" /> -->
        <component
          :is="component12"
          :param="popupParam"
          :dailyReportData="props.popupParam.dailyReportData"
        />
      </div>
    </q-form>
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
  name: 'dailyReportFullScreen'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
    plantCd?: stringNull
    envWaterDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
    dailyReportData?: any
  }
  contentHeight?: stringNull
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
      plantCd: null,
      envWaterDailyResultId: '',
      isFullScreen: false,
      dailyResultDt: '',
      dailyReportData: null
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
// const fullScreenData = ref<any>({
//   plantCd: null, // 사업장코드
//   envWaterDailyResultId: '', // 수질일지 일련번호
//   dailyResultDt: '', // 작성일
//   deptCd: '', // 작성부서
//   userId: '', // 작성자
//   checkerId: '',
//   processCd: '',
//   weatherCd: null, // 날씨
//   temperature: '', // 온도
//   worker1UserId: '', // 1근 근무자
//   worker2UserId: '', // 2근 근무자
//   worker3UserId: '', // 3근 근무자
//   dailyResultStatusCd: '',
//   dischargeModels: [],
//   preventiveModels: [],
//   powerUsageModels: [],
//   diswaterModels: [],
//   supwaterModels: [],
//   drugModels: [],
//   preventiveBreakdownModels: [],
//   deletePreventiveBreakdownModels: [],
//   guidanceModels: [],
//   deleteGuidanceModels: []
// })
const component1 = ref<any>(null)
const component2 = ref<any>(null)
const component3 = ref<any>(null)
const component4 = ref<any>(null)
// const component5 = ref<any>(null)
const component6 = ref<any>(null)
const component7 = ref<any>(null)
// const component8 = ref<any>(null)
const component9 = ref<any>(null)
const component10 = ref<any>(null)
// const component11 = ref<any>(null)
const component12 = ref<any>(null)
const detailUrl = ref('')
const editable = ref(true)
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
  detailUrl.value = selectConfig.env.water.daily.result.get.url
  // code setting
  component1.value = markRaw(
    defineAsyncComponent(() => import(`@views/env/water/dailyReport01.vue`))
  )
  component2.value = markRaw(
    defineAsyncComponent(() => import(`@views/env/water/dailyReport02.vue`))
  )
  component3.value = markRaw(
    defineAsyncComponent(() => import(`@views/env/water/dailyReport03.vue`))
  )
  component4.value = markRaw(
    defineAsyncComponent(() => import(`@views/env/water/dailyReport04.vue`))
  )
  component6.value = markRaw(
    defineAsyncComponent(() => import(`@views/env/water/dailyReport06.vue`))
  )
  component7.value = markRaw(
    defineAsyncComponent(() => import(`@views/env/water/dailyReport07.vue`))
  )
  component9.value = markRaw(
    defineAsyncComponent(() => import(`@views/env/water/dailyReport09.vue`))
  )
  component10.value = markRaw(
    defineAsyncComponent(() => import(`@views/env/water/dailyReportMeasure.vue`))
  )
  component12.value = markRaw(
    defineAsyncComponent(() => import(`@views/env/water/dailyReport12.vue`))
  )
  // list setting
  // getDetail()
}

// /******************************
//  * TODO (목적): 상세정보 조회
//  *******************************/
// function getDetail() {
//   if (props.popupParam.envWaterDailyResultId) {
//     $http({
//       url: detailUrl.value,
//       method: 'GET',
//       params: {
//         envWaterDailyResultId: props.popupParam.envWaterDailyResultId,
//         dailyResultDt: props.popupParam.dailyResultDt
//       }
//     }).then((_result: any) => {
//       fullScreenData.value = _result.data
//       props.popupParam.plantCd = fullScreenData.value.plantCd
//       props.popupParam.dailyResultDt = fullScreenData.value.dailyResultDt
//       component1.value = markRaw(
//         defineAsyncComponent(() => import(`@views/env/water/dailyReport01.vue`))
//       )
//       component2.value = markRaw(
//         defineAsyncComponent(() => import(`@views/env/water/dailyReport02.vue`))
//       )
//       component3.value = markRaw(
//         defineAsyncComponent(() => import(`@views/env/water/dailyReport03.vue`))
//       )
//       component4.value = markRaw(
//         defineAsyncComponent(() => import(`@views/env/water/dailyReport04.vue`))
//       )
//       // component5.value = markRaw(
//       //   defineAsyncComponent(() => import(`@views/env/water/dailyReport05.vue`))
//       // )
//       component6.value = markRaw(
//         defineAsyncComponent(() => import(`@views/env/water/dailyReport06.vue`))
//       )
//       component7.value = markRaw(
//         defineAsyncComponent(() => import(`@views/env/water/dailyReport07.vue`))
//       )
//       // component8.value = markRaw(
//       //   defineAsyncComponent(() => import(`@views/env/water/dailyReport08.vue`))
//       // )
//       component9.value = markRaw(
//         defineAsyncComponent(() => import(`@views/env/water/dailyReport09.vue`))
//       )
//       component10.value = markRaw(
//         defineAsyncComponent(() => import(`@views/env/water/dailyReport10.vue`))
//       )
//       // component11.value = markRaw(
//       //   defineAsyncComponent(() => import(`@views/env/water/dailyReport11.vue`))
//       // )
//       component12.value = markRaw(
//         defineAsyncComponent(() => import(`@views/env/water/dailyReport12.vue`))
//       )
//     })
//   }
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
