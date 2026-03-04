function random(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1)) // Math.floor(Math.random() * max) + min
}

export function getBudgetChartData() {
  return [
    {
      name: '예산',
      type: 'area',
      data: Array.from({ length: 5 }, () => random(20, 60))
    },
    {
      name: '실적',
      type: 'line',
      data: Array.from({ length: 5 }, () => random(5, 20))
    }
  ]
}

export function getLawData() {
  return [
    {
      name: '안전보건조직 구성 및 운영',
      value: Math.round(Math.random() * 10) / 10
    },
    {
      name: '안전경영위원회',
      value: Math.round(Math.random() * 10) / 10
    },
    {
      name: '보건관리',
      value: Math.round(Math.random() * 10) / 10
    },
    {
      name: '노사협의회',
      value: Math.round(Math.random() * 10) / 10
    },
    {
      name: '리스크 및 기회 관리',
      value: Math.round(Math.random() * 10) / 10
    },
    {
      name: '법규관리',
      value: Math.round(Math.random() * 10) / 10
    },
    {
      name: '산업재해예방활동 및 안전문화확산',
      value: Math.round(Math.random() * 10) / 10
    },
    {
      name: '비상시대응절차수립',
      value: Math.round(Math.random() * 10) / 10
    },
    {
      name: '산업안전보건법적사항',
      value: Math.round(Math.random() * 10) / 10
    }
  ]
}
