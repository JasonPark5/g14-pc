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
                v-model:value="props.popupParam.dailyReport.plantCd"
              />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-datepicker
                :editable="false"
                label="작성일자"
                name="dailyResultDt"
                v-model:value="props.popupParam.dailyReport.dailyResultDt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :editable="false"
                type="user"
                label="작성자"
                name="userId"
                v-model:value="popupParam.dailyReport.userId"
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
                v-model:value="popupParam.dailyReport.weatherCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-text
                :editable="false"
                label="온도"
                suffix="℃"
                name="temperature"
                v-model:value="popupParam.dailyReport.temperature"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :editable="false"
                label="1근 근무자"
                name="worker1UserId"
                :isWrite="true"
                userName="worker1UserName"
                :data="props.popupParam.dailyReport"
                v-model:value="popupParam.dailyReport.worker1UserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :editable="false"
                label="2근 근무자"
                name="worker2UserId"
                :isWrite="true"
                userName="worker2UserName"
                :data="props.popupParam.dailyReport"
                v-model:value="popupParam.dailyReport.worker2UserId"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <c-field
                :editable="false"
                label="3근 근무자"
                name="worker3UserId"
                :isWrite="true"
                userName="worker3UserName"
                :data="props.popupParam.dailyReport"
                v-model:value="popupParam.dailyReport.worker3UserId"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 q-pb-md">
        <component :is="component1" :param="popupParam" :dailyReportData="popupParam.dailyReport" />
        <component :is="component2" :param="popupParam" :dailyReportData="popupParam.dailyReport" />
        <component :is="component3" :param="popupParam" :dailyReportData="popupParam.dailyReport" />
        <component :is="component4" :param="popupParam" :dailyReportData="popupParam.dailyReport" />
        <component :is="component5" :param="popupParam" :dailyReportData="popupParam.dailyReport" />
        <!-- <component :is="component5" :param="popupParam" /> -->
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
  name: 'dailyAirReportFullScreen'
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
    envAirDailyResultId?: stringNull
    isFullScreen?: boolean
    dailyResultDt?: stringNull
    approvalStatusCd?: stringNull
    approvalTarget?: boolean
    processCd?: stringNull
    dailyReport: any
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
      envAirDailyResultId: '',
      isFullScreen: false,
      approvalStatusCd: null,
      approvalTarget: false,
      dailyReport: null
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
// const dailyReport = ref<dailyReportType>({
//   plantCd: null, // 사업장코드
//   envAirDailyResultId: '', // 대기일지 일련번호
//   dailyResultDt: '', // 작성일
//   deptCd: '', // 작성부서
//   userId: '', // 작성자
//   weatherCd: null, // 날씨
//   temperature: '' // 온도
// })
const editable = ref(false)
const detailUrl = ref('')
const workplaceItems = ref<any>([])
const workplaceListUrl = ref('')
const component1 = ref<any>(null)
const component2 = ref<any>(null)
const component3 = ref<any>(null)
const component4 = ref<any>(null)
const component5 = ref<any>(null)

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
  detailUrl.value = selectConfig.env.air.daily.result.get.url
  workplaceListUrl.value = selectConfig.env.procWork.list.url
  // code setting
  component1.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport01.vue`)))
  component2.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport02.vue`)))
  component3.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport05.vue`)))
  component4.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport04.vue`)))
  component5.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport06.vue`)))
  // list setting
  getWorkplaceList()
  // getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
// function getDetail() {
//   $http({
//     url: detailUrl.value,
//     method: 'GET',
//     params: {
//       processCd: props.popupParam.processCd,
//       dailyResultDt: props.popupParam.dailyResultDt
//     }
//   }).then((_result: any) => {
//     dailyReport.value = _result.data
//     component1.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport01.vue`)))
//     component2.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport02.vue`)))
//     component3.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport05.vue`)))
//     component4.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport04.vue`)))
//     // component5.value = markRaw(defineAsyncComponent(() => import(`./dailyAirReport05.vue`)))
//   })
// }

/******************************
 * TODO (목적): 작업장 조회
 *******************************/
function getWorkplaceList() {
  $http({
    url: workplaceListUrl.value,
    method: 'GET',
    params: { workplaceFlag: 'Y', processTypeCd: 'EPT0000001' }
  }).then((_result: any) => {
    _.forEach(_result.data, (item) => {
      workplaceItems.value.push({
        code: item.processCd,
        codeName: item.workplaceName,
        processNo: item.processNo,
        processName: item.processName
      })
    })
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
