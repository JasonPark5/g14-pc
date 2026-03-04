<template>
  <div class="row bg-white">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <div class="row">
        <div v-show="!isFirstGraph" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <apexcharts
            ref="riskChartRef"
            height="300"
            :width="riskChart.chartWidth"
            :options="riskChart.options"
            :series="riskChart.series"
          />
        </div>
        <div v-show="!isSecondGraph" class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <apexcharts
            ref="riskStandardChartRef"
            height="300"
            :width="riskStandardChart.chartWidth"
            :options="riskStandardChart.options"
            :series="riskStandardChart.series"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <apexcharts
            ref="processImprChartRef"
            height="300"
            type="bar"
            :width="processImprChart.chartWidth"
            :options="processImprChart.options"
            :series="processImprChart.series"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <apexcharts
            ref="processRiskRegisterChartRef"
            height="300"
            type="bar"
            :width="processRiskRegisterChart.chartWidth"
            :options="processRiskRegisterChart.options"
            :series="processRiskRegisterChart.series"
          />
        </div>
      </div>
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
import { apexChartType } from '@/types/apexChart'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'riskStatus'
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
  param: {
    ramRiskAssessmentPlanId: stringNull
    ramStepCd: stringNull
    vendorFlag: boolean
    ramTechniqueCd: stringNull
  }
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  param: () => ({
    ramRiskAssessmentPlanId: '',
    ramStepCd: '',
    vendorFlag: false,
    ramTechniqueCd: ''
  }),
  height: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const status = ref<any>({
  riskChart: [],
  riskStandardChart: [],
  processImprChart: [],
  processRiskRegisterChart: []
})
const riskChart = ref<apexChartType>({
  options: {
    title: {
      text: '위험도별 발굴 현황(%)',
      style: {
        color: '#1976D2'
      }
    },
    chart: {
      type: 'donut'
    },
    labels: [],
    dataLabels: {
      style: {
        fontSize: '14px', // 글자 크기
        colors: ['#fff'] // 텍스트 색상
      },
      dropShadow: {
        enabled: false // 드롭섀도우 비활성화
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%' // 도넛 두께 설정
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          }
        }
      }
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 160,
      offsetY: -30
    },
    fill: {
      // type: 'gradient',
    }
  },
  series: [
    {
      data: []
    }
  ] as any[],
  chartWidth: '95%'
})
const riskStandardChart = ref<apexChartType>({
  options: {
    title: {
      text: '위험도 기준별 발굴 건 수',
      style: {
        color: '#1976D2'
      }
    },
    chart: {
      type: 'polarArea'
    },
    colors: [],
    labels: [],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 160,
      offsetY: -30
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    fill: {
      type: 'solid'
    }
  },
  series: [
    {
      data: []
    }
  ] as any[],
  chartWidth: '95%'
})
const processImprChart = ref<apexChartType>({
  options: {
    title: {
      text: '공정별 개선대책 수립 및 실시 건 수',
      style: {
        color: '#1976D2'
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        endingShape: 'rounded'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontSize: '12px'
        },
        formatter: function (val: any) {
          return '[공정] ' + val
        }
      }
    },
    yaxis: {
      title: {
        text: '',
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      }
    },
    fill: {
      opacity: 1
    }
  },
  series: [
    {
      name: '진행 건 수',
      data: []
    },
    {
      name: '지연 건 수',
      data: []
    },
    {
      name: '완료 건 수',
      data: []
    }
  ] as any[],
  chartWidth: '95%'
})
const processRiskRegisterChart = ref<apexChartType>({
  options: {
    title: {
      text: '',
      style: {
        color: '#1976D2'
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        endingShape: 'rounded'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontSize: '12px'
        },
        formatter: function (val: any) {
          return '[공정] ' + val
        }
      }
    },
    yaxis: {
      title: {
        // text: '위험등록부 건 수',
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val + ' 건'
        }
      }
    },
    fill: {
      opacity: 1
    }
  },
  series: [] as any[],
  chartWidth: '95%'
})
const riskChartRef = ref<any>(null)
const riskStandardChartRef = ref<any>(null)
const processImprChartRef = ref<any>(null)
const processRiskRegisterChartRef = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const isFirstGraph = computed(() => {
  return props.param.ramTechniqueCd === 'RT00000005'
})
const isSecondGraph = computed(() => {
  return props.param.ramTechniqueCd === 'RT00000005'
})
const listUrl = computed(() => {
  let url = null
  if (props.param.ramTechniqueCd === 'RT00000001') {
    // HAZOP (o)
    url = selectConfig.ram.hazop.status.url
  } else if (props.param.ramTechniqueCd === 'RT00000005') {
    // K-PSR (o)
    url = selectConfig.ram.kpsr.status.url
  } else if (props.param.ramTechniqueCd === 'RT00000010') {
    // Check-list (o)
    url = selectConfig.ram.checklist.status.url
  } else if (props.param.ramTechniqueCd === 'RT00000015') {
    // JRA (o)
    url = selectConfig.ram.jsa.status.url
  } else if (props.param.ramTechniqueCd === 'RT00000020') {
    // KRAS (o)
    url = selectConfig.ram.kras.status.url
  } else if (props.param.ramTechniqueCd === 'RT00000025') {
    // 4M (o)
    url = selectConfig.ram.fm.status.url
  } else if (props.param.ramTechniqueCd === 'RT00000030') {
    // CHARM (o)
    url = selectConfig.ram.charm.status.url
  } else if (props.param.ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법 (o)
    url = selectConfig.ram.third.status.url
  }
  return url
}) as any

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
  // code setting
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      ramRiskAssessmentPlanId: props.param.ramRiskAssessmentPlanId,
      vendorFlag: props.param.vendorFlag ? 1 : 0
    }
  }).then((_result: any) => {
    _.extend(status.value, _result.data)

    if (!isFirstGraph.value) {
      setRiskChart()
    }
    if (!isSecondGraph.value) {
      setRiskStandardChart()
    }
    setProcessImprChart()
    setProcessRiskRegisterChart()
  })
}
function setRiskChart() {
  // 위험도별 발굴
  // risk 	cnt color
  // 1		  2	#b0b0b0
  // 2		  4	#b0b0b0
  // 3		  4	#b0b0b0
  // 4		  9	#ababab
  // 5		  1	#ababab
  // 6		  6	#ababab
  // 8		  0	#ababab
  // 9		  3	#ff8282
  // 10		  1	#ff8282
  // 12		  0	#ff8282
  // 15		  0	#ff7a7a
  // 16		  0	#9c0000
  // 20		  0	#9c0000
  riskChartRef.value.updateOptions({
    colors: _.map(status.value.riskChart, 'color'),
    labels: _.map(status.value.riskChart, 'risk')
  })
  riskChart.value.series = _.map(status.value.riskChart, 'cnt')
}
function setRiskStandardChart() {
  // 위험도별 발굴
  // riskContents 	          cnt   color
  // 무시할 수 있는 위험(0 ~ 3)	10	  #b0b0b0
  // 미미한 위험(4 ~ 6)	        16	  #ababab
  // 경미한 위험(8 ~ 8)	        0	    #ababab
  // 상당한 위험(9 ~ 12)	      4	    #ff8282
  // 중대한 위험(15 ~ 15)	      0	    #ff7a7a
  // 매우 중대한 위험(16 ~ 20)	0	    #9c0000
  riskStandardChartRef.value.updateOptions({
    colors: _.map(status.value.riskStandardChart, 'color'),
    labels: _.map(status.value.riskStandardChart, (item) => {
      return _.split(item.riskContents, '\n')
    })
  })
  riskStandardChart.value.series = _.map(status.value.riskStandardChart, 'cnt')
}
function setProcessImprChart() {
  // 공정별 개선대책 수립 및 실시
  // processName	cntIng	cntInaction	cntComplete
  // RM-T3 공정	  0	      0	          0
  // 건조-탈수	  0	      0	          0
  processImprChartRef.value.updateOptions({
    xaxis: {
      categories: _.map(status.value.processImprChart, 'processName')
    }
  })

  const _series = [
    {
      name: $language('진행 건 수'),
      data: _.map(status.value.processImprChart, 'cntIng')
    },
    {
      name: $language('완료 건 수'),
      data: _.map(status.value.processImprChart, 'cntComplete')
    }
  ]
  if (!props.param.vendorFlag) {
    _series.splice(1, 0, {
      name: $language('지연 건 수'),
      data: _.map(status.value.processImprChart, 'cntInaction')
    })
  }

  processImprChart.value.series = _series
}
function setProcessRiskRegisterChart() {
  // 공정별 위험등록부
  // processName	cntMan	cntMachine	cntMedia	cntManagement
  // RM-T3 공정		 2		  0			      0			    0
  // 건조-탈수		 0		  1			      0			    0
  riskChartRef.value.updateOptions({
    title: {
      text: $language('위험도별 발굴 현황(%)')
    }
  })
  riskStandardChartRef.value.updateOptions({
    title: {
      text: $language('위험도 기준별 발굴 건 수')
    }
  })
  processImprChartRef.value.updateOptions({
    title: {
      text: $language('공정별 개선대책 수립 및 실시 건 수')
    }
  })
  processRiskRegisterChartRef.value.updateOptions({
    title: {
      text: $language('공정별 유해위험요인 분류에 따른 위험등록부 건 수')
    }
  })
  if (props.param.ramTechniqueCd === 'RT00000001') {
    // HAZOP (o)
    processRiskRegisterChart.value.series = [
      {
        name: $language('공정'),
        data: _.map(status.value.processRiskRegisterChart, 'cntProcess')
      }
    ]
    // _.forEach(status.value.processRiskRegisterChart, (_chart: any) => {
    //   processRiskRegisterChart.value.series.push({
    //     name: _chart.processName,
    //     data: [_chart.cntProcess]
    //   })
    // })
    processRiskRegisterChartRef.value.updateOptions({
      title: {
        text: $language('공정별 위험등록부 건 수')
      }
    })
  } else if (props.param.ramTechniqueCd === 'RT00000005') {
    // K-PSR (o)
    _.forEach(status.value.processRiskRegisterChart, (_chart: any) => {
      processRiskRegisterChartRef.value.series.push({
        name: _chart.processName,
        data: [_chart.cntProcess]
      })
    })
  } else if (props.param.ramTechniqueCd === 'RT00000010') {
    // Check-list (o)
    processRiskRegisterChart.value.series = [
      {
        name: $language('작업'),
        data: []
      },
      {
        name: $language('기계·기구'),
        data: []
      },
      {
        name: $language('유해인자'),
        data: []
      },
      {
        name: $language('기타'),
        data: []
      }
    ]
    riskChartRef.value.updateOptions({
      title: {
        text: $language('평가결과 발굴 현황(%)')
      }
    })
    riskStandardChartRef.value.updateOptions({
      title: {
        text: $language('평가결과별 발굴 건 수')
      }
    })
    processRiskRegisterChartRef.value.updateOptions({
      title: {
        text: $language('공정별 평가대상 분류에 따른 위험등록부 건 수')
      }
    })

    processRiskRegisterChart.value.series[0].data = _.map(
      status.value.processRiskRegisterChart,
      'cntJob'
    )
    processRiskRegisterChart.value.series[1].data = _.map(
      status.value.processRiskRegisterChart,
      'cntEquip'
    )
    processRiskRegisterChart.value.series[2].data = _.map(
      status.value.processRiskRegisterChart,
      'cntHarmful'
    )
    processRiskRegisterChart.value.series[3].data = _.map(
      status.value.processRiskRegisterChart,
      'cntEtc'
    )
  } else if (props.param.ramTechniqueCd === 'RT00000015') {
    // JRA (o)
    processRiskRegisterChart.value.series = [
      {
        name: $language('기계(설비)'),
        data: []
      },
      {
        name: $language('생물학'),
        data: []
      },
      {
        name: $language('전기적'),
        data: []
      },
      {
        name: $language('작업특성'),
        data: []
      },
      {
        name: $language('화학(물질)'),
        data: []
      },
      {
        name: $language('작업환경'),
        data: []
      },
      {
        name: $language('관리적'),
        data: []
      },
      {
        name: $language('기타'),
        data: []
      }
    ]
    processRiskRegisterChart.value.series[0].data = _.map(
      status.value.processRiskRegisterChart,
      'cntMachine'
    )
    processRiskRegisterChart.value.series[1].data = _.map(
      status.value.processRiskRegisterChart,
      'cntBio'
    )
    processRiskRegisterChart.value.series[2].data = _.map(
      status.value.processRiskRegisterChart,
      'cntElectronic'
    )
    processRiskRegisterChart.value.series[3].data = _.map(
      status.value.processRiskRegisterChart,
      'cntCharacter'
    )
    processRiskRegisterChart.value.series[4].data = _.map(
      status.value.processRiskRegisterChart,
      'cntMaterial'
    )
    processRiskRegisterChart.value.series[5].data = _.map(
      status.value.processRiskRegisterChart,
      'cntWorkEnv'
    )
    processRiskRegisterChart.value.series[6].data = _.map(
      status.value.processRiskRegisterChart,
      'cntManagement'
    )
    processRiskRegisterChart.value.series[7].data = _.map(
      status.value.processRiskRegisterChart,
      'cntEtc'
    )
  } else if (props.param.ramTechniqueCd === 'RT00000020') {
    // KRAS (o)
    processRiskRegisterChart.value.series = [
      {
        name: $language('기계(설비)'),
        data: []
      },
      {
        name: $language('생물학'),
        data: []
      },
      {
        name: $language('전기적'),
        data: []
      },
      {
        name: $language('작업특성'),
        data: []
      },
      {
        name: $language('화학(물질)'),
        data: []
      },
      {
        name: $language('작업환경'),
        data: []
      },
      {
        name: $language('관리적'),
        data: []
      },
      {
        name: $language('기타'),
        data: []
      }
    ]
    processRiskRegisterChart.value.series[0].data = _.map(
      status.value.processRiskRegisterChart,
      'cntMachine'
    )
    processRiskRegisterChart.value.series[1].data = _.map(
      status.value.processRiskRegisterChart,
      'cntBio'
    )
    processRiskRegisterChart.value.series[2].data = _.map(
      status.value.processRiskRegisterChart,
      'cntElectronic'
    )
    processRiskRegisterChart.value.series[3].data = _.map(
      status.value.processRiskRegisterChart,
      'cntCharacter'
    )
    processRiskRegisterChart.value.series[4].data = _.map(
      status.value.processRiskRegisterChart,
      'cntMaterial'
    )
    processRiskRegisterChart.value.series[5].data = _.map(
      status.value.processRiskRegisterChart,
      'cntWorkEnv'
    )
    processRiskRegisterChart.value.series[6].data = _.map(
      status.value.processRiskRegisterChart,
      'cntManagement'
    )
    processRiskRegisterChart.value.series[7].data = _.map(
      status.value.processRiskRegisterChart,
      'cntEtc'
    )
  } else if (props.param.ramTechniqueCd === 'RT00000025') {
    // 4M (o)
    processRiskRegisterChart.value.series = [
      {
        name: 'Man',
        data: []
      },
      {
        name: 'Machine',
        data: []
      },
      {
        name: 'Media',
        data: []
      },
      {
        name: 'Management',
        data: []
      }
    ]
    processRiskRegisterChart.value.series[0].data = _.map(
      status.value.processRiskRegisterChart,
      'cntMan'
    )
    processRiskRegisterChart.value.series[1].data = _.map(
      status.value.processRiskRegisterChart,
      'cntMachine'
    )
    processRiskRegisterChart.value.series[2].data = _.map(
      status.value.processRiskRegisterChart,
      'cntMedia'
    )
    processRiskRegisterChart.value.series[3].data = _.map(
      status.value.processRiskRegisterChart,
      'cntManagement'
    )
  } else if (props.param.ramTechniqueCd === 'RT00000030') {
    // CHARM (o)
    _.forEach(status.value.processRiskRegisterChart, (_chart: any) => {
      processRiskRegisterChart.value.series.push({
        name: _chart.processName,
        data: [_chart.cntProcess]
      })
    })

    riskStandardChartRef.value.updateOptions({
      title: {
        text: $language('공정별 위험등록부 건 수')
      }
    })
  } else if (props.param.ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법 (o)
    _.forEach(status.value.processRiskRegisterChart, (_chart: any) => {
      processRiskRegisterChart.value.series.push({
        name: _chart.processName,
        data: [_chart.cntProcess]
      })
    })
    riskChartRef.value.updateOptions({
      title: {
        text: $language('판단결과 발굴 현황(%)')
      }
    })
    riskStandardChartRef.value.updateOptions({
      title: {
        text: $language('판단결과별 발굴 건 수')
      }
    })
    processRiskRegisterChartRef.value.updateOptions({
      title: {
        text: $language('공정별 위험등록부 건 수')
      }
    })
  }

  processRiskRegisterChartRef.value.updateOptions({
    xaxis: {
      categories: _.map(status.value.processRiskRegisterChart, 'processName')
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
