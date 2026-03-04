function random(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1)) // Math.floor(Math.random() * max) + min
}

function evalKeyRandomValue() {
  const randomNumber = random(10, 11)
  // return randomNumber > 3 ? 'success' : randomNumber > 2 ? 'warning' : 'error'
  return {
    icon: randomNumber === 11 ? 'success' : 'warning',
    value: randomNumber,
    count: randomNumber + random(0, 1)
  }
}
const keys = [
  '1. 경영자의 리더십',
  '2. 근로자의 참여',
  '3. 위험요인 파악',
  ['4. 위험요인 제거·대체', '및 통제'],
  '5. 비상조치계획 수립',
  ['6. 도급·용역·위탁 시', '안전보건 확보'],
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
    chart: [
      {
        name: '측정치',
        data: Array.from({ length: 7 }, (_, idx) => {
          return {
            x: keys[idx],
            y: cardData[idx].data.value,
            goals: [
              {
                name: '내부기준',
                value: cardData[idx].data.count,
                strokeHeight: 11,
                strokeWidth: 5,
                strokeColor: '#FFD94D'
              }
            ]
          }
        })
      }
      // {
      //   name: '측정치',
      //   data: _.map(cardData, 'data.value')
      // },
      // {
      //   name: '문항 갯수',
      //   data: _.map(cardData, 'data.count')
      // }
    ]
  }
}

export function getExcavationData() {
  const daily = [
    { name: '아차사고', count: random(20, 40) },
    { name: '안전작업허가서', count: random(50, 70) },
    { name: '안전제안', count: random(50, 70) },
    { name: '순회점검', count: random(50, 70) },
    { name: 'TBM', count: random(50, 70) },
    { name: '안전관리자점검', count: random(50, 70) }
  ]
  const weekly = [
    { name: '작업환경측정', count: random(1, 2) },
    { name: '특수건강검진', count: random(1, 2) },
    { name: '위험성평가(정기)', count: random(1, 2) },
    { name: '설비점검', count: random(50, 70) },
    { name: '내부심사', count: random(1, 2) },
    { name: '산업안전위원회', count: random(30, 60) },
    { name: '안전보건협의체', count: random(30, 60) },
    { name: '근로자교육', count: random(30, 60) },
    { name: '비상대응훈련', count: random(5, 8) },
    { name: '위험물시설점검', count: random(5, 8) }
  ]
  const yearly = [
    { name: '법규준수평가', count: random(0, 1) },
    { name: '자체감사', count: random(0, 1) },
    { name: '근골격계조사', count: random(0, 1) },
    { name: '직무스트레스조사', count: random(0, 1) }
  ]
  const happens = [
    { name: '변경관리', count: random(1, 2) },
    { name: '가동전점검', count: random(2, 5) },
    { name: '위험성평가(수시)', count: random(1, 2) },
    { name: '사고조사', count: random(0, 1) },
    { name: '업체평가', count: random(3, 7) }
  ]
  return {
    daily: daily,
    weekly: weekly,
    yearly: yearly,
    happens: happens
  }
}
