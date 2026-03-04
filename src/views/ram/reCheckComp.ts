export function gridColumns(ramTechniqueCd: any, charmTypeName?: any) {
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
        name: 'existingRiskManagementActivities',
        field: 'existingRiskManagementActivities',
        label: '현재안전조치',
        align: 'left',
        style: 'width:170px',
        sortable: false
      },
      {
        name: 'before',
        field: 'before',
        label: '개선전',
        align: 'center',
        child: [
          {
            name: 'beforeFrequency',
            field: 'beforeFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'beforeStrength',
            field: 'beforeStrength',
            label: '강도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'beforeRisk',
            field: 'beforeRisk',
            label: '위험도',
            align: 'center',
            style: 'width:50px',
            color: 'tomato',
            sortable: false
          }
        ]
      },
      {
        name: 'addingRiskManagementActivities',
        field: 'addingRiskManagementActivities',
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
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            align: 'center',
            style: 'width:50px',
            color: 'tomato',
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
  } else if (ramTechniqueCd === 'RT00000005') {
    // K-PSR
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
        name: 'riskTypName',
        field: 'riskTypName',
        label: '위험형태',
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
        name: 'customCol',
        field: 'customCol',
        label: '개선',
        align: 'center',
        style: 'width:130px',
        type: 'custom',
        sortable: false
      }
    ]
  } else if (ramTechniqueCd === 'RT00000010') {
    // Check-list
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
        name: 'ramCheckItemClassName',
        field: 'ramCheckItemClassName',
        label: '분류',
        align: 'center',
        style: 'width:80px',
        sortable: false
      },
      {
        fix: true,
        name: 'checkItemName',
        field: 'checkItemName',
        label: '평가대상',
        align: 'center',
        style: 'width:150px',
        sortable: false
      },
      {
        name: 'checklistQuestion',
        field: 'checklistQuestion',
        label: '체크리스트 문항',
        align: 'left',
        style: 'width:300px',
        sortable: false
      },
      {
        name: 'relationLaw',
        field: 'relationLaw',
        label: '관련법규',
        align: 'left',
        style: 'width:120px',
        sortable: false
      },
      {
        name: 'currentSafetyMeasures',
        field: 'currentSafetyMeasures',
        label: '현재안전조치',
        align: 'left',
        style: 'width:200px',
        sortable: false
      },
      {
        name: 'ramInspectResultName',
        field: 'ramInspectResultName',
        label: '결과',
        align: 'center',
        color: 'tomato',
        style: 'width:80px'
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
        name: 'assessDate',
        field: 'assessDate',
        label: '평가일',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'assessUserName',
        field: 'assessUserName',
        label: '평가자',
        align: 'center',
        style: 'width:100px',
        sortable: false
      },
      {
        name: 'customCol',
        field: 'customCol',
        label: '개선번호/개선진행상태',
        align: 'center',
        style: 'width:150px',
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
        name: 'riskHazardNameClass',
        field: 'riskHazardNameClass',
        label: '분류-유해위험요인',
        align: 'left',
        style: 'width:200px',
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
        name: 'before',
        field: 'before',
        label: '개선전',
        align: 'center',
        child: [
          {
            name: 'beforeFrequency',
            field: 'beforeFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'beforeStrength',
            field: 'beforeStrength',
            label: '강도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'beforeRisk',
            field: 'beforeRisk',
            label: '위험도',
            align: 'center',
            style: 'width:50px',
            color: 'tomato',
            sortable: false
          }
        ]
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
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            align: 'center',
            style: 'width:50px',
            color: 'tomato',
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
        name: 'riskHazardNameClass',
        field: 'riskHazardNameClass',
        label: '분류-유해위험요인',
        align: 'left',
        style: 'width:250px',
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
        name: 'before',
        field: 'before',
        label: '개선전',
        align: 'center',
        child: [
          {
            name: 'beforeFrequency',
            field: 'beforeFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'beforeStrength',
            field: 'beforeStrength',
            label: '강도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'beforeRisk',
            field: 'beforeRisk',
            label: '위험도',
            align: 'center',
            style: 'width:50px',
            color: 'tomato',
            sortable: false
          }
        ]
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
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            align: 'center',
            style: 'width:50px',
            color: 'tomato',
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
        name: 'before',
        field: 'before',
        label: '개선전',
        align: 'center',
        child: [
          {
            name: 'beforeFrequency',
            field: 'beforeFrequency',
            label: '빈도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'beforeStrength',
            field: 'beforeStrength',
            label: '강도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'beforeRisk',
            field: 'beforeRisk',
            label: '위험도',
            align: 'center',
            style: 'width:50px',
            color: 'tomato',
            sortable: false
          }
        ]
      },
      {
        name: 'addingRiskManagementActivities',
        field: 'addingRiskManagementActivities',
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
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'afterStrength',
            field: 'afterStrength',
            label: '강도',
            align: 'center',
            style: 'width:35px',
            sortable: false
          },
          {
            name: 'afterRisk',
            field: 'afterRisk',
            label: '위험도',
            align: 'center',
            style: 'width:50px',
            color: 'tomato',
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
    if (charmTypeName === 'estimation') {
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
          name: 'chemName',
          field: 'chemName',
          label: '구성물질',
          align: 'left',
          style: 'width:150px',
          sortable: false
        },
        {
          name: 'casNo',
          field: 'casNo',
          label: 'CAS No.',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'riskEstimation',
          field: 'riskEstimation',
          label: '위험도 추정',
          align: 'center',
          style: 'width:50px',
          color: 'tomato',
          sortable: false
        },
        {
          name: 'exposureLevelFinal',
          field: 'exposureLevelFinal',
          label: '최종노출수준',
          align: 'center',
          style: 'width:40px',
          color: 'tomato',
          sortable: false
        },
        {
          name: 'toxic',
          field: 'toxic',
          label: '유해성',
          align: 'center',
          style: 'width:60px',
          sortable: false,
          color: '#1976D2'
        },
        {
          name: 'f',
          field: 'f',
          label: '노출수준 측정',
          child: [
            {
              name: 'suspectUserFlag',
              field: 'suspectUserFlag',
              label: '유소견자 발생여부',
              align: 'center',
              style: 'width:70px',
              sortable: false,
              type: 'check',
              true: 'Y',
              false: 'N'
            },
            {
              name: 'workMeasure',
              field: 'workMeasure',
              label: '작업환경측정',
              child: [
                {
                  name: 'measValue',
                  field: 'measValue',
                  label: '측정치(A)',
                  align: 'right',
                  style: 'width:80px',
                  sortable: false
                },
                {
                  name: 'exposureStandard',
                  field: 'exposureStandard',
                  label: '노출기준(B)',
                  align: 'right',
                  style: 'width:80px',
                  sortable: false
                },
                {
                  name: 'exposureMeasValue',
                  field: 'exposureMeasValue',
                  label: 'A/B(%)',
                  align: 'right',
                  style: 'width:65px',
                  sortable: false
                }
              ]
            },
            {
              name: 'daily',
              field: 'daily',
              label: '하루 취급량, 비산성/휘발성, 밀폐·환기상태',
              child: [
                {
                  name: 'limitRepval',
                  field: 'limitRepval',
                  label: '함유량',
                  align: 'center',
                  style: 'width:60px',
                  sortable: false
                },
                {
                  name: 'dailyVolume',
                  field: 'dailyVolume',
                  label: '일취급량',
                  align: 'center',
                  style: 'width:70px',
                  sortable: false
                },
                {
                  name: 'volumeUnitName',
                  field: 'volumeUnitName',
                  label: '단위',
                  align: 'center',
                  style: 'width:50px',
                  sortable: false
                },
                {
                  name: 'dailyLevel',
                  field: 'dailyLevel',
                  label: '일취급 수준',
                  align: 'center',
                  style: 'width:50px',
                  sortable: false
                },
                {
                  name: 'maleficenceType',
                  field: 'maleficenceType',
                  label: '발생형태',
                  align: 'center',
                  style: 'width:80px',
                  sortable: false,
                  type: 'select',
                  codeGroupCd: 'MALEFICENCE_TYPE'
                },
                {
                  name: 'maleficenceGrade',
                  field: 'maleficenceGrade',
                  label: '비산성',
                  align: 'center',
                  style: 'width:80px',
                  sortable: false,
                  disableTarget: 'maleficenceType',
                  disableCon: 'MT00000001',
                  type: 'select',
                  codeGroupCd: 'MALEFICENCE_GRADE'
                },
                {
                  name: 'boilingPoint',
                  field: 'boilingPoint',
                  label: '끓는점(℃)',
                  align: 'right',
                  style: 'width:60px',
                  sortable: false,
                  disableTarget: 'maleficenceType',
                  disableCon: 'MT00000002'
                },
                {
                  name: 'volatilityGradeName',
                  field: 'volatilityGradeName',
                  label: '휘발성',
                  align: 'center',
                  style: 'width:60px',
                  sortable: false
                },
                {
                  name: 'exposureLevelCombination',
                  field: 'exposureLevelCombination',
                  label: '노출수준',
                  align: 'center',
                  style: 'width:40px',
                  sortable: false
                },
                {
                  name: 'closedVentilation',
                  field: 'closedVentilation',
                  label: '밀폐·환기상태',
                  align: 'center',
                  style: 'width:100px',
                  sortable: false,
                  type: 'select',
                  none: 'none',
                  codeGroupCd: 'CLOSED_VENTILATION'
                }
              ]
            }
          ]
        },
        {
          name: 's',
          field: 's',
          label: '유해성 측정',
          child: [
            {
              name: 'cmrFlag',
              field: 'cmrFlag',
              label: 'CMR여부',
              align: 'center',
              style: 'width:80px',
              sortable: false,
              type: 'check',
              true: 'Y',
              false: 'N'
            },
            {
              name: 'measureCheck',
              field: 'measureCheck',
              label: '노출기준확인',
              child: [
                {
                  name: 'maleficenceForm',
                  field: 'maleficenceForm',
                  label: '발생형태',
                  align: 'center',
                  style: 'width:110px',
                  sortable: false,
                  disableTarget: 'cmrFlag',
                  disableCon: 'N',
                  type: 'select',
                  codeGroupCd: 'MALEFICENCE_FORM'
                },
                {
                  name: 'maleficenceValue',
                  field: 'maleficenceValue',
                  label: '측정값',
                  align: 'right',
                  style: 'width:80px',
                  sortable: false,
                  disableTarget: 'cmrFlag',
                  disableCon: 'N'
                }
              ]
            },
            {
              name: 'hrCodeGrade',
              field: 'hrCodeGrade',
              label: '위험문구/유해·위험문구',
              align: 'center',
              style: 'width:80px',
              sortable: false,
              disableTarget: 'cmrFlag',
              disableCon: 'N',
              type: 'select',
              codeGroupCd: 'HR_CODE_GRADE'
            }
          ]
        }
      ]
    } else {
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
          name: 'before',
          field: 'before',
          label: '개선전',
          align: 'center',
          child: [
            {
              name: 'beforeExposureLevelFinal',
              field: 'beforeExposureLevelFinal',
              label: '노출수준',
              align: 'center',
              style: 'width:45px',
              sortable: false
            },
            {
              name: 'beforeToxic',
              field: 'beforeToxic',
              label: '유해성',
              align: 'center',
              style: 'width:50px',
              sortable: false
            },
            {
              name: 'beforeRiskEstimation',
              field: 'beforeRiskEstimation',
              label: '위험도',
              align: 'center',
              style: 'width:70px',
              color: 'tomato',
              sortable: false
            }
          ]
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
              align: 'center',
              style: 'width:70px',
              color: 'tomato',
              sortable: false
            }
          ]
        },
        {
          name: 'assessDate',
          field: 'assessDate',
          label: '평가일',
          align: 'center',
          style: 'width:120px',
          sortable: false
        },
        {
          name: 'assessUserName',
          field: 'assessUserName',
          label: '평가자',
          align: 'center',
          style: 'width:100px',
          sortable: false
        },
        {
          name: 'customCol',
          field: 'customCol',
          label: '개선번호/개선진행상태',
          align: 'center',
          style: 'width:300px',
          type: 'custom',
          sortable: false
        }
      ]
    }
  } else if (ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법
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
        name: 'riskHazardQuestionName',
        field: 'riskHazardQuestionName',
        label: '유해위험요인<br/>(위험한 상황과 사건)',
        align: 'left',
        style: 'width:250px',
        sortable: false
      },
      {
        name: 'relationLaw',
        field: 'relationLaw',
        label: '관련법규',
        align: 'left',
        style: 'width:130px',
        sortable: false
      },
      {
        name: 'currentSafetyMeasures',
        field: 'currentSafetyMeasures',
        label: '현재안전조치',
        align: 'left',
        style: 'width:180px',
        sortable: false
      },
      {
        name: 'ramRiskLevelName',
        field: 'ramRiskLevelName',
        label: '판단결과',
        align: 'center',
        style: 'width:100px',
        color: 'tomato',
        sortable: false,
        type: 'custom'
      },
      {
        name: 'improvementMeasures',
        field: 'improvementMeasures',
        label: '추가 리스크관리 계획',
        align: 'left',
        style: 'width:180px',
        sortable: false
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
export function gridMerge(ramTechniqueCd: any, charmTypeName?: any) {
  const _merge = ref([]) as any
  // 공정 - 구분 - 유해위험요인 - 현상태 - 위험도(전) - 조치 - 위험도(후) - 개선
  if (ramTechniqueCd === 'RT00000001') {
    // HAZOP
    _merge.value = [
      { index: 0, colName: 'processCd' }, // 공정
      { index: 1, colName: 'processDiagram' }, // 도면
      { index: 2, colName: 'processDiagramNode' }, // 노드
      { index: 3, colName: 'processDiagramNodeGuide' } // 이탈
    ]
  } else if (ramTechniqueCd === 'RT00000005') {
    // K-PSR
    _merge.value = [
      { index: 0, colName: 'processCd' }, // 공정
      { index: 1, colName: 'diagramGubun' }, // 도면
      { index: 2, colName: 'nodeGubun' }, // 노드
      { index: 3, colName: 'riskTypeGubun' } // 위험형태
    ]
  } else if (ramTechniqueCd === 'RT00000010') {
    // Check-list
    // 일단 보류, check-list 구성 후 다시 진행
    _merge.value = [
      { index: 0, colName: 'processCd' }, // 공정
      { index: 0, colName: 'checkClassGroup' }, // 분류
      { index: 0, colName: 'checkItemName' } // 유해위험요인
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
      { index: 1, colName: 'groupMdmSopId' }, // 작업
      { index: 2, colName: 'groupRiskHazard' } // 유해위험요인
    ]
  } else if (ramTechniqueCd === 'RT00000025') {
    // 4M
    _merge.value = [
      { index: 0, colName: 'processCd' }, // 공정
      { index: 1, colName: 'jobName' } // 작업
      // { index: 2, colName: 'riskHazardGubun' } // 유해위험요인 (구분과 같이)
    ]
  } else if (ramTechniqueCd === 'RT00000030') {
    // CHARM
    if (charmTypeName === 'estimation') {
      _merge.value = [
        { index: 0, colName: 'processCd' }, // 공정
        { index: 1, colName: 'materialName' } // 화학자재
      ]
    } else {
      _merge.value = [
        { index: 0, colName: 'processCd' } // 공정
      ]
    }
  } else if (ramTechniqueCd === 'RT00000035') {
    // 3단계 판단법
    _merge.value = [
      { index: 0, colName: 'processCd' } // 공정
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
      requestContentsCols: ['deviationName', 'nodeVariableDesignIntent']
    }
  } else if (ramTechniqueCd === 'RT00000005') {
    // K-PSR
    props = {
      tableKey: 'ramKpsrAssessScenarioId',
      ibmTaskTypeCd: 'ITT0000005',
      ibmTaskUnderTypeCd: 'ITTU000005',
      requestContentsCols: ['riskTypName', 'riskOccurrenceCause']
    }
  } else if (ramTechniqueCd === 'RT00000010') {
    // Check-list
    // 일단 보류, check-list 구성 후 다시 진행
    props = {
      tableKey: 'ramChecklistAssessScenarioId',
      ibmTaskTypeCd: 'ITT0000010',
      ibmTaskUnderTypeCd: 'ITTU000010',
      requestContentsCols: ['ramCheckItemClassName', 'checkItemName']
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
