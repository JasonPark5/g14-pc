function random(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1)) // Math.floor(Math.random() * max) + min
}
function evalKeyRandomValue() {
  const randomNumber = random(10, 11)
  // return randomNumber > 3 ? 'success' : randomNumber > 2 ? 'warning' : 'error'
  return {
    icon: randomNumber === 11 ? 'success' : 'warning',
    value: randomNumber
  }
}
const keys = [
  '1. 경영자의 리더십',
  '2. 근로자의 참여',
  '3. 위험요인 파악',
  '4. 위험요인 제거·대체 및 통제',
  '5. 비상조치계획 수립',
  '6. 도급·용역·위탁 시 안전보건 확보',
  '7. 평가 및 개선'
]

export function getEvalKeyElementData() {
  const cardData = Array.from({ length: 7 }, (_, idx) => {
    return {
      key: keys[idx],
      data: evalKeyRandomValue()
    }
  })
  return {
    card: cardData,
    chart: [
      {
        name: '측정치',
        data: Array.from({ length: 7 }, (_, idx) => {
          return {
            x: keys[idx],
            y: cardData[idx].data.value,
            goals: [
              {
                name: '노출기준',
                value: 11,
                strokeHeight: 11,
                strokeWidth: 0,
                strokeColor: '#F48FB1'
              }
            ]
          }
        })
      }
    ]
  }
}

export function getImprDeptData() {
  const depts = ['생산팀', '생산팀 A', '생산팀 B', '생산팀 C', '기술공정팀', '기술팀 A', '기술팀 B']
  return Array.from({ length: 7 }, (_, idx) => {
    return {
      deptName: depts[idx],
      delay: random(1, 3),
      complement: random(1, 2),
      circle: [random(95, 98)]
    }
  })
}

export function getImprChartData() {
  return [
    {
      name: '완료',
      data: Array.from({ length: 12 }, () => random(60, 80))
    },
    {
      name: '진행중',
      data: Array.from({ length: 12 }, () => random(1, 5))
    },
    {
      name: '보완',
      data: Array.from({ length: 12 }, () => random(0, 2))
    }
  ]
}
