export function gridColumns(ramTechniqueCd: any) {
  let cols = null
  // 공정 - 구분 - 유해위험요인 - 현상태 - 위험도(전) - 조치 - 위험도(후) - 개선
  if (ramTechniqueCd === 'RT00000001') {
    // HAZOP
    cols = [
      {
        fix: true,
        name: 'processName',
        field: 'processName',
        label: '공정',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        fix: true,
        name: 'diagramTitle',
        field: 'diagramTitle',
        description: 'diagramNo',
        label: '도면명',
        align: 'center',
        style: 'width:130px',
        sortable: false
      },
      {
        fix: true,
        name: 'nodeTitle',
        field: 'nodeTitle',
        description: 'nodeNo',
        label: '노드',
        align: 'center',
        style: 'width:130px',
        sortable: false
      },
      {
        fix: true,
        name: 'deviationName',
        field: 'deviationName',
        label: '이탈',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'riskOccurrenceCause',
        field: 'riskOccurrenceCause',
        label: '원인',
        align: 'left',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'currentSafetyMeasures',
        field: 'currentSafetyMeasures',
        label: '현재안전조치',
        align: 'left',
        style: 'width:170px',
        sortable: false
      },
      {
        name: 'improvementMeasures',
        field: 'improvementMeasures',
        label: '추가 리스크관리 계획',
        align: 'left',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'after',
        field: 'after',
        label: '개선후',
        align: 'center',
        child: [
          {
            name: 'afterFrequency',
            field: 'afterFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:45px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:45px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            align: 'center',
            color: 'red',
            style: 'width:50px',
            sortable: false
          }
        ]
      },
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선',
        align: 'center',
        style: 'width:130px',
        type: 'custom',
        sortable: false
      }
    ]
  } else if (ramTechniqueCd === 'RT00000015') {
    // JRA
    cols = [
      {
        fix: true,
        name: 'processName',
        field: 'processName',
        label: '공정',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        fix: true,
        name: 'jobName',
        field: 'jobName',
        label: '작업',
        align: 'center',
        style: 'width:150px',
        sortable: false
      },
      {
        fix: true,
        name: 'jobStepName',
        field: 'jobStepName',
        description: 'jobStepDesc',
        label: '작업단계',
        align: 'center',
        style: 'width:150px',
        sortable: false
      },
      {
        fix: true,
        name: 'riskHazardClassName',
        field: 'riskHazardClassName',
        label: '분류',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        fix: true,
        name: 'riskHazardName',
        field: 'riskHazardName',
        label: '유해위험요인',
        align: 'left',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'riskOccurrenceCause',
        field: 'riskOccurrenceCause',
        label: '원인',
        align: 'left',
        style: 'width:170px',
        sortable: false
      },
      {
        name: 'currentSafetyMeasures',
        field: 'currentSafetyMeasures',
        label: '현재안전조치',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'improvementMeasures',
        field: 'improvementMeasures',
        label: '추가 리스크관리 계획',
        align: 'left',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'after',
        field: 'after',
        label: '개선후',
        align: 'center',
        child: [
          {
            name: 'afterFrequency',
            field: 'afterFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:45px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:45px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            align: 'center',
            color: 'red',
            style: 'width:50px',
            sortable: false
          }
        ]
      },
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선',
        align: 'center',
        style: 'width:130px',
        type: 'custom',
        sortable: false
      }
    ]
  } else if (ramTechniqueCd === 'RT00000020') {
    // KRAS
    cols = [
      {
        fix: true,
        name: 'processName',
        field: 'processName',
        label: '공정',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        fix: true,
        name: 'jobName',
        field: 'jobName',
        label: '작업',
        align: 'left',
        style: 'width:120px',
        sortable: false
      },
      {
        fix: true,
        name: 'ramRiskHazardClassName',
        field: 'ramRiskHazardClassName',
        label: '분류',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        fix: true,
        name: 'riskHazardName',
        field: 'riskHazardName',
        label: '유해위험요인',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'riskOccurrenceCause',
        field: 'riskOccurrenceCause',
        label: '원인',
        align: 'left',
        style: 'width:170px',
        sortable: false
      },
      {
        name: 'currentSafetyMeasures',
        field: 'currentSafetyMeasures',
        label: '현재안전조치',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'improvementMeasures',
        field: 'improvementMeasures',
        label: '추가 리스크관리 계획',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'after',
        field: 'after',
        label: '개선후',
        align: 'center',
        child: [
          {
            name: 'afterFrequency',
            field: 'afterFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:45px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:45px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            align: 'center',
            color: 'red',
            style: 'width:50px',
            sortable: false
          }
        ]
      },
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선',
        align: 'center',
        style: 'width:150px',
        type: 'custom',
        sortable: false
      }
    ]
  } else if (ramTechniqueCd === 'RT00000025') {
    // 4M
    cols = [
      {
        fix: true,
        name: 'processName',
        field: 'processName',
        label: '공정',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        fix: true,
        name: 'jobName',
        field: 'jobName',
        label: '작업',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        fix: true,
        name: 'riskHazardName',
        field: 'riskHazardName',
        label: '유해위험요인',
        align: 'left',
        style: 'width:170px',
        sortable: false
      },
      {
        name: 'existingRiskManagementActivities',
        field: 'existingRiskManagementActivities',
        label: '현재안전조치',
        align: 'left',
        style: 'width:180px',
        sortable: false
      },
      {
        name: 'addingRiskManagementActivities',
        field: 'addingRiskManagementActivities',
        label: '추가 리스크관리 계획',
        align: 'left',
        style: 'width:180px',
        sortable: false
      },
      {
        name: 'after',
        field: 'after',
        label: '개선후',
        align: 'center',
        child: [
          {
            name: 'afterFrequency',
            field: 'afterFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:45px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:45px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            color: 'red',
            align: 'center',
            style: 'width:50px',
            sortable: false
          }
        ]
      },
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선',
        align: 'center',
        style: 'width:150px',
        type: 'custom',
        sortable: false
      }
    ]
  } else if (ramTechniqueCd === 'RT00000030') {
    // CHARM
    cols = [
      {
        fix: true,
        name: 'processName',
        field: 'processName',
        label: '공정',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        fix: true,
        name: 'materialName',
        field: 'materialName',
        label: '화학자재',
        align: 'left',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'existingRiskManagementActivities',
        field: 'existingRiskManagementActivities',
        label: '현재안전보건조치',
        align: 'left',
        style: 'width:300px',
        sortable: false
      },
      {
        name: 'addingRiskManagementActivies',
        field: 'addingRiskManagementActivies',
        label: '감소대책',
        align: 'left',
        style: 'width:300px',
        sortable: false
      },
      {
        name: 'after',
        field: 'after',
        label: '개선후',
        align: 'center',
        child: [
          {
            name: 'afterExposureLevelFinal',
            field: 'afterExposureLevelFinal',
            label: '노출수준',
            align: 'center',
            style: 'width:45px',
            sortable: false
          },
          {
            name: 'afterToxic',
            field: 'afterToxic',
            label: '유해성',
            align: 'center',
            style: 'width:50px',
            sortable: false
          },
          {
            name: 'afterRiskEstimation',
            field: 'afterRiskEstimation',
            label: '위험도',
            color: 'red',
            align: 'center',
            style: 'width:70px',
            sortable: false
          }
        ]
      },
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선',
        align: 'center',
        style: 'width:150px',
        type: 'custom',
        sortable: false
      }
    ]
  }
  return cols
}

export function gridMerge(ramTechniqueCd: any) {
  const _merge = ref([]) as any
  // 공정 - 구분 - 유해위험요인 - 현상태 - 위험도(전) - 조치 - 위험도(후) - 개선
  if (ramTechniqueCd === 'RT00000001') {
    // HAZOP
    _merge.value = [
      { index: 0, colName: 'processCd' }, // 공정
      { index: 1, colName: 'processDiagram' }, // 도면
      { index: 2, colName: 'processDiagramNode' }, // 노드
      { index: 0, colName: 'deviationName' } // 이탈
    ]
  } else if (ramTechniqueCd === 'RT00000015') {
    // JRA
    _merge.value = [
      { index: 0, colName: 'processCd' }, // 공정
      { index: 1, colName: 'jobGubun' }, // 작업
      { index: 2, colName: 'jobStepGubun' }, // 작업단계
      { index: 3, colName: 'riskHazardGubun' } // 유해위험요인
    ]
  } else if (ramTechniqueCd === 'RT00000020') {
    // KRAS
    _merge.value = [
      { index: 0, colName: 'processCd' }, // 공정
      { index: 1, colName: 'jobGubun' }, // 작업
      { index: 2, colName: 'riskHazardGubun' } // 유해위험요인
    ]
  } else if (ramTechniqueCd === 'RT00000025') {
    // 4M
    _merge.value = [
      { index: 0, colName: 'processCd' }, // 공정
      { index: 1, colName: 'jobName' }, // 작업
      { index: 2, colName: 'ram4mRiskHazardClassGroup' } // 유해위험요인 (구분과 같이)
    ]
  } else if (ramTechniqueCd === 'RT00000030') {
    // CHARM
    _merge.value = [
      { index: 0, colName: 'processCd' }, // 공정
      { index: 1, colName: 'materialName' } // 화학자재
    ]
  }
  return _merge.value
}

export function imprProps(ramTechniqueCd: any) {
  let props = {}
  // 공정 - 구분 - 유해위험요인 - 현상태 - 위험도(전) - 조치 - 위험도(후) - 개선
  if (ramTechniqueCd === 'RT00000001') {
    // HAZOP
    props = {
      tableKey: 'ramHazopAssessScenarioId',
      ibmTaskTypeCd: 'ITT0000001',
      ibmTaskUnderTypeCd: 'ITTU000001',
      requestContentsCols: ['deviationName', 'riskOccurrenceCause']
    }
  } else if (ramTechniqueCd === 'RT00000015') {
    // JRA
    props = {
      tableKey: 'ramJsaAssessScenarioId',
      ibmTaskTypeCd: 'ITT0000015',
      ibmTaskUnderTypeCd: 'ITTU000020',
      requestContentsCols: ['jobStepName', 'riskHazardNameClass', 'riskHazardName']
    }
  } else if (ramTechniqueCd === 'RT00000020') {
    // KRAS
    props = {
      tableKey: 'ramKrasAssessScenarioId',
      ibmTaskTypeCd: 'ITT0000020',
      ibmTaskUnderTypeCd: 'ITTU000025',
      requestContentsCols: ['jobName', 'ram4mRiskHazardClassName', 'riskOccurrenceCause']
    }
  } else if (ramTechniqueCd === 'RT00000025') {
    // 4M
    props = {
      tableKey: 'ram4mAssessScenarioId',
      ibmTaskTypeCd: 'ITT0000023',
      ibmTaskUnderTypeCd: 'ITTU000030',
      requestContentsCols: ['jobName', 'ram4mRiskHazardClassName', 'riskHazardName']
    }
  } else if (ramTechniqueCd === 'RT00000030') {
    // CHARM
    // 사용 X
    props = {
      tableKey: 'ramCharmResultAssessScenarioId',
      ibmTaskTypeCd: 'ITT0000024',
      ibmTaskUnderTypeCd: 'ITTU000035',
      requestContentsCols: ['materialName']
    }
  } else if (ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법
    props = {
      tableKey: 'ramThirdAssessScenarioId',
      ibmTaskTypeCd: 'ITT0000013',
      ibmTaskUnderTypeCd: 'ITTU000015',
      requestContentsCols: ['riskHazardQuestionName']
    }
  }
  return props as any
}
