<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant
            type="none"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="getList"
          />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :required="true"
            type="year"
            default="today"
            label="기준년도"
            name="wasteYear"
            @datachange="getList"
            v-model:value="searchParam.wasteYear"
          />
        </div>
      </template>
    </c-search-box>
    <q-card flat bordered>
      <div class="col-12" style="background: #fff; padding: 20px">
        <apexchart
          ref="chartHTML1"
          type="line"
          height="315"
          :width="chart.chartWidth"
          :options="chart.options"
          :series="chart.series"
        />
      </div> </q-card
    ><br />
    <q-card flat bordered>
      <div class="col-12" style="background: #fff; padding: 20px">
        <apexchart
          ref="chartHTML2"
          type="line"
          height="315"
          :width="chart2.chartWidth"
          :options="chart2.options"
          :series="chart2.series"
        />
      </div>
    </q-card>
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
import { apexChartType } from '@/types/apexChart'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'wasteUCGraph'
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
  plantCd: '',
  wasteYear: ''
})
const chartHTML1 = ref<any>(null)
const chartHTML2 = ref<any>(null)
const chart = ref<apexChartType>({
  options: {
    title: { text: '폐기물 처리량 추이분석' },
    chart: {
      type: 'line',
      // dropShadow: {
      //   enabled: true,
      //   color: '#000',
      //   top: 18,
      //   left: 7,
      //   blur: 10,
      //   opacity: 0.2
      // },
      toolbar: { show: true },
      zoom: { enabled: false }
      // height: 430
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      categories: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월'
      ]
    },
    yaxis: {
      title: { text: '처리량(톤)' }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    fill: { opacity: 1 },
    markers: { size: 1 },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    }
  },
  series: [],
  chartWidth: '100%'
})
const chart2 = ref<apexChartType>({
  options: {
    title: { text: '폐기물 처리비용 추이분석' },
    chart: {
      type: 'line',
      // dropShadow: {
      //   enabled: true,
      //   color: '#000',
      //   top: 18,
      //   left: 7,
      //   blur: 10,
      //   opacity: 0.2
      // },
      toolbar: { show: true },
      zoom: { enabled: false }
      // height: 430
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      categories: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월'
      ]
    },
    yaxis: {
      title: { text: '처리비용(원)' }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    fill: { opacity: 1 },
    markers: { size: 1 },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    }
  },
  series: [],
  chartWidth: '100%'
})
const editable = ref(true)
const listUrl = ref('')

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
  listUrl.value = selectConfig.env.waste.volume.uc.url
  // code setting
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록조회
 *******************************/
function getList() {
  let isAllSearch = false
  if (searchParam.value.plantCd.split(',').length > 1) isAllSearch = true
  if (searchParam.value.wasteYear !== null) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: searchParam.value
    }).then((_result: any) => {
      if (!isAllSearch) {
        const sdata = _.filter(_result.data, { tvTypeCdTop: 'A', totalFlag: 'X' })
        chart.value.series = []
        _.forEach(sdata, (item) => {
          chart.value.series.push({
            name: item.envWasteName,
            data: [
              item.tv01,
              item.tv02,
              item.tv03,
              item.tv04,
              item.tv05,
              item.tv06,
              item.tv07,
              item.tv08,
              item.tv09,
              item.tv10,
              item.tv11,
              item.tv12
            ]
          })
        })
        chartHTML1.value.updateOptions({
          title: {
            text: $language('폐기물 처리량 추이분석')
          },
          yaxis: {
            title: { text: $language('처리량(톤)') }
          },
          xaxis: {
            categories: [
              $language('1월'),
              $language('2월'),
              $language('3월'),
              $language('4월'),
              $language('5월'),
              $language('6월'),
              $language('7월'),
              $language('8월'),
              $language('9월'),
              $language('10월'),
              $language('11월'),
              $language('12월')
            ]
          }
        })
        const sdata2 = _.filter(_result.data, { tvTypeCdTop: 'J', totalFlag: 'X' })
        chart2.value.series = []
        _.forEach(sdata2, (item) => {
          chart2.value.series.push({
            name: item.envWasteName,
            data: [
              item.tv01,
              item.tv02,
              item.tv03,
              item.tv04,
              item.tv05,
              item.tv06,
              item.tv07,
              item.tv08,
              item.tv09,
              item.tv10,
              item.tv11,
              item.tv12
            ]
          })
        })
        chartHTML2.value.updateOptions({
          title: {
            text: $language('폐기물 처리비용 추이분석')
          },
          yaxis: {
            title: { text: $language('처리비용(원)') }
          },
          xaxis: {
            categories: [
              $language('1월'),
              $language('2월'),
              $language('3월'),
              $language('4월'),
              $language('5월'),
              $language('6월'),
              $language('7월'),
              $language('8월'),
              $language('9월'),
              $language('10월'),
              $language('11월'),
              $language('12월')
            ]
          }
        })
      }
    })
  } else {
    message.alert({
      title: '안내',
      message: '기준년도를 선택하세요',
      type: 'warning' // success / info / warning / error
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
