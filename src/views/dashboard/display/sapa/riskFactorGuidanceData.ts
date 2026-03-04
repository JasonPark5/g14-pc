function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}
function ynx() {
  const randomNumber = random(1, 5)
  return randomNumber === 1 ? 'X' : randomNumber === 2 || randomNumber === 3 ? 'N' : 'Y'
}
function imprCnt() {
  const impr = {
    imprTotal: random(3, 8),
    imprIng: 0,
    imprDelay: 0,
    imprComplete: 0
  }
  impr.imprComplete = impr.imprTotal - random(1, 2)
  impr.imprDelay = random(1, 7)
  if (impr.imprTotal - impr.imprComplete < impr.imprDelay) {
    impr.imprDelay = impr.imprTotal - impr.imprComplete - 1
  }
  impr.imprIng = impr.imprTotal - impr.imprComplete - impr.imprDelay

  return impr
}

export function getCheckData() {
  return [
    {
      deptName: '생산팀',
      patrol: ynx(),
      safetyCheck: ynx(),
      impr: imprCnt()
    },
    {
      deptName: '생산팀 A',
      patrol: ynx(),
      safetyCheck: ynx(),
      impr: imprCnt()
    },
    {
      deptName: '생산팀 B',
      patrol: ynx(),
      safetyCheck: ynx(),
      impr: imprCnt()
    },
    {
      deptName: '생산팀 C',
      patrol: ynx(),
      safetyCheck: ynx(),
      impr: imprCnt()
    },
    {
      deptName: '기술공정팀',
      patrol: ynx(),
      safetyCheck: ynx(),
      impr: imprCnt()
    },
    {
      deptName: '기술팀 A',
      patrol: ynx(),
      safetyCheck: ynx(),
      impr: imprCnt()
    }
  ]
}

export function getAccidentData() {
  return {
    nearAccident: {
      post: Array.from({ length: 12 }, () => random(3, 10)),
      current: Array.from({ length: 12 }, () => random(3, 10))
    },
    accidentImprCost: {
      post: Array.from({ length: 12 }, () => random(3, 10)),
      current: Array.from({ length: 12 }, () => random(3, 10))
    },
    accidentImpr: {
      post: Array.from({ length: 12 }, () => random(3, 10)),
      current: Array.from({ length: 12 }, () => random(3, 10))
    },
    bar: {
      // weather: [
      //   {
      //     name: '아차사고',
      //     data: Array.from({ length: 4 }, () => random(12, 17))
      //   },
      //   {
      //     name: '공정사고',
      //     data: Array.from({ length: 4 }, () => random(0, 2))
      //   }
      // ],
      count: [
        {
          name: '발생 건 수',
          data: Array.from({ length: 4 }, () => random(0, 2))
        }
      ],
      grade: [
        {
          name: '아차사고',
          data: Array.from({ length: 3 }, () => random(15, 20))
        },
        {
          name: '공정사고',
          data: Array.from({ length: 3 }, () => random(0, 3))
        }
      ],
      cause: [
        {
          name: '아차사고',
          data: Array.from({ length: 10 }, () => random(5, 10))
        },
        {
          name: '공정사고',
          data: Array.from({ length: 10 }, () => random(0, 1))
        }
      ]
    }
  }
}

export function getHazardEquipData() {
  return [{ data: Array.from({ length: 20 }, () => random(15, 42)) }]
}

export function getHazardMeasureData() {
  const categories = [
    '석영(Quartz; 14808-60-7 등)',
    // '크리스토발라이트(Cristobalite; 14464-46-1)',
    // '트리디마이트(Trydimite; 15468-32-3)',
    '고열',
    '소음'
  ]
  return {
    measures: [
      {
        name: '측정치',
        data: Array.from({ length: 3 }, (_, idx) => {
          return {
            x: categories[idx],
            y: random(34, 42),
            goals: [
              {
                name: '노출기준',
                value: random(30, 33),
                strokeLineCap: 'round',
                strokeHeight: 11,
                strokeWidth: 4,
                strokeColor: '#FFD94D'
              }
            ]
          }
        })
      }
    ],
    measureDepts: [{ data: Array.from({ length: 3 }, () => random(3, 6)) }]
  }
}

export function getHazardCheckupData() {
  return {
    circle: _.concat(
      Array.from({ length: 2 }, () => random(35, 45)),
      Array.from({ length: 6 }, () => random(0, 2)),
      Array.from({ length: 2 }, () => random(0, 2))
    ),
    bar: [{ data: Array.from({ length: 3 }, () => random(3, 6)) }]
  }
}
