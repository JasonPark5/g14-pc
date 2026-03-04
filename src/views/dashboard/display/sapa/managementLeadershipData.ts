function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

function random0_9(standard: number = 5) {
  return Math.floor(Math.random() * 10) > standard
}
function random0_100() {
  return Math.floor(Math.random() * 101)
}
function random30000_5000000() {
  return Math.floor(Math.random() * 4970001) + 30000
}

export function getLawChartData() {
  return {
    rate: random(12, 25),
    total: {
      name: '전체 실적',
      data: [random(12, 40), random(12, 40), random(12, 40), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    data1: {
      name: '안전보건조직 구성 및 운영',
      data: [random(2, 8), random(2, 8), random(2, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    data2: {
      name: '안전경영위원회',
      data: [random(2, 8), random(2, 8), random(2, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    data3: {
      name: '보건관리',
      data: [random(2, 8), random(2, 8), random(2, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    data4: {
      name: '노사협의회',
      data: [random(2, 8), random(2, 8), random(2, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    data5: {
      name: '리스크 및 기회 관리',
      data: [random(2, 8), random(2, 8), random(2, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    data6: {
      name: '법규관리',
      data: [random(2, 8), random(2, 8), random(2, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    data7: {
      name: '산업재해예방활동 및 안전문화확산',
      data: [random(2, 8), random(2, 8), random(2, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    data8: {
      name: '비상시대응절차수립',
      data: [random(2, 8), random(2, 8), random(2, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    data9: {
      name: '산업안전보건법적사항',
      data: [random(2, 8), random(2, 8), random(2, 8), 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  }
}

export function getLawData() {
  const returnRows: Array<any> = []
  _.forEach(lawData, (law) => {
    const achievementRate = random0_100()
    returnRows.push(
      _.extend(law, {
        month1: random0_9() ? true : false,
        month2: random0_9() ? true : false,
        month3: random0_9() ? true : false,
        month4: random0_9() ? true : false,
        month5: random0_9() ? true : false,
        month6: random0_9() ? true : false,
        month7: random0_9() ? true : false,
        month8: random0_9() ? true : false,
        month9: random0_9() ? true : false,
        month10: random0_9() ? true : false,
        month11: random0_9() ? true : false,
        month12: random0_9() ? true : false,
        achievementRate: achievementRate,
        status: achievementRate > 70 ? 'green' : achievementRate < 20 ? 'red' : 'yellow'
      })
    )
  })
  return returnRows
}
const lawData = [
  {
    targetName: '안전보건조직 구성 및 운영',
    detailName: '안전보건 조직구성'
  },
  {
    targetName: '안전보건조직 구성 및 운영',
    detailName: '안전관리 책임자, 관리감독자, 담당자 임명'
  },
  {
    targetName: '안전경영위원회',
    detailName: '운영규정 수립'
  },
  {
    targetName: '안전경영위원회',
    detailName: '위원회 실시'
  },
  {
    targetName: '보건관리',
    detailName: '위원회 실시'
  },
  {
    targetName: '보건관리',
    detailName: '미수검자 현황파악'
  },
  {
    targetName: '보건관리',
    detailName: '유소견자 사후관리'
  },
  {
    targetName: '보건관리',
    detailName: '채용시 건강검진'
  },
  {
    targetName: '노사협의회',
    detailName: '운영 및 협의 (산업안전보건위원회)'
  },
  {
    targetName: '리스크 및 기회 관리',
    detailName: '리스크 및 기회 평가 실시'
  },
  {
    targetName: '리스크 및 기회 관리',
    detailName: '조치계획 수립'
  },
  {
    targetName: '리스크 및 기회 관리',
    detailName: '조치계획 실행 후 재평가 및 사후관리'
  },
  {
    targetName: '법규관리',
    detailName: '법규등록부 및 준수평가표 작성/검토'
  },
  {
    targetName: '법규관리',
    detailName: '법규준수 이행 모니터링'
  },
  {
    targetName: '산업재해예방활동 및 안전문화확산',
    detailName: '사업장 순회점검'
  },
  {
    targetName: '산업재해예방활동 및 안전문화확산',
    detailName: '사업장 정기 안전점검'
  },
  {
    targetName: '산업재해예방활동 및 안전문화확산',
    detailName: '안전보건 개선 제안'
  },
  {
    targetName: '산업재해예방활동 및 안전문화확산',
    detailName: '아차사고 발굴'
  },
  {
    targetName: '산업재해예방활동 및 안전문화확산',
    detailName: '안전의 날 지정/운영 및 사고 감소활동'
  },
  {
    targetName: '비상시대응절차수립',
    detailName: '대응시나리오 작성'
  },
  {
    targetName: '비상시대응절차수립',
    detailName: '화재 및 정전 대비대응훈련'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '안전검사'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '작업환경측정'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '건강검진'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '위험성평가 정기'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '위험성평가 수시'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '위험성평가 개선대책'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '산업안전보건위원회'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '안전보건교육 정기 근로자'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '안전보건교육 관리감독자'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '안전보건교육 특별안전보건'
  },
  {
    targetName: '산업안전보건법적사항',
    detailName: '안전보건교육 MSDS 교육'
  }
]

export function getBudgetYearChartData() {
  return new Promise((resolve) => {
    getComboItems('SAI_BUDGET_TYPE_CD').then((result: any) => {
      resolve({
        xaxisCategories: _.map(result, 'codeName'),
        series: [
          {
            name: '안전·보건 전문인력 배치',
            data: [random30000_5000000(), 0, 0, 0, 0]
          },
          {
            name: '안전검사·점검',
            data: [0, random30000_5000000(), 0, 0, 0]
          },
          {
            name: '안전조치',
            data: [0, random30000_5000000(), 0, 0, 0]
          },
          {
            name: '안전장비·물품 구입',
            data: [0, random30000_5000000(), 0, 0, 0]
          },
          {
            name: '유해위험요인 확인 및 위험성평가 등',
            data: [0, random30000_5000000(), 0, 0, 0]
          },
          {
            name: '안전 조치 강화',
            data: [0, random30000_5000000(), 0, 0, 0]
          },
          {
            name: '근골격계 유해요인조사',
            data: [0, 0, random30000_5000000(), 0, 0]
          },
          {
            name: '건강진단',
            data: [0, 0, random30000_5000000(), 0, 0]
          },
          {
            name: '기타 건강장해 예방 보건조치',
            data: [0, 0, random30000_5000000(), 0, 0]
          },
          {
            name: '법정 의무교육, 기타교육 등',
            data: [0, 0, 0, random30000_5000000(), 0]
          },
          {
            name: '기타 개선조치',
            data: [0, 0, 0, 0, random30000_5000000()]
          }
        ]
      })
    })
  })
}
const budgetItems = [
  {
    budgetTypeName: '안전/보건 인력',
    budgetItemName: '안전·보건 전문인력 배치',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '안전조치',
    budgetItemName: '안전검사·점검',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '안전조치',
    budgetItemName: '안전조치',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '안전조치',
    budgetItemName: '안전장비·물품 구입',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '안전조치',
    budgetItemName: '유해위험요인 확인 및 위험성평가 등',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '안전조치',
    budgetItemName: '안전 조치 강화',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '보건조치',
    budgetItemName: '근골격계 유해요인조사',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '보건조치',
    budgetItemName: '건강진단',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '보건조치',
    budgetItemName: '기타 건강장해 예방 보건조치',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '교육',
    budgetItemName: '법정 의무교육, 기타교육 등',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  },
  {
    budgetTypeName: '기타',
    budgetItemName: '기타 개선조치',
    budgetPlanAmt: random(1500, 5000),
    budgetActionAmt: random(30, 2000),
    comparedToLastYear: random(-300, 300),
    isNew: false
  }
]
export function getBudgetYearData() {
  return new Promise((resolve) => {
    getComboItems('SAI_BUDGET_TYPE_CD').then((result: any) => {
      resolve(
        _.map(result, (item) => {
          return {
            budgetTypeName: item.codeName,
            budgetItems: _.filter(budgetItems, { budgetTypeName: item.codeName })
          }
        })
      )
    })
  })
}
