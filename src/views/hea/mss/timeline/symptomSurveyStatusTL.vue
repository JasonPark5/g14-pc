<template>
  <div>
    <c-table
      class="table-inner-custom survey"
      :editable="editable && !disabled"
      :columns="gridLast.columns"
      :data="gridLast.data"
      gridHeightAuto
      hideBottom
      :isTitle="false"
      :columnSetting="false"
      :isFullScreen="false"
      :isExcelDown="false"
      :filtering="false"
      @headerCheckboxChange="headerCheckboxChange"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name != 'painArea'">
          <div v-for="(item, idx) in props.row.comboItems" :key="idx">
            <div v-if="props.row[`${col.name}Flag`] === 'Y'" class="item-container">
              <div class="item-content">
                <span class="item-name">{{ idx + 1 + '. ' + item.codeName }}</span>
                <span v-if="getSurveyValue(col.name, item.code)" class="item-value">
                  {{ getSurveyValue(col.name, item.code) }}
                </span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="pain-area-container">
            <span class="pain-area-text">{{ props.row['painArea'] }}</span>
          </div>
        </template>
      </template>
    </c-table>
    <br />
  </div>
</template>

<script setup lang="ts">
import { musculoskleltalSystemTargetLiteralType, surveyType } from '../investigation'

defineOptions({
  name: 'symptomSurveyDetail'
})

const route = useRoute()

interface propType {
  height: stringNull
  param: {
    heaInvestigationPlanId: stringNull
    stepCd: stringNull
  }
}
interface gridType {
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}

const _props = withDefaults(defineProps<propType>(), {
  height: '',
  param: () => {
    return {
      heaInvestigationPlanId: '',
      stepCd: ''
    }
  }
})

const survey = ref<surveyType>({})
const gridLast = ref<gridType>({
  columns: [],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const checklistUrl = ref('')
const painAreaUrl = ref('')
const codeToSuffixMap: Record<string, string> = {
  // 1번 행 (기본)
  MSP1000001: '1_1', // 1번 행 항목
  MSP1000002: '1_2', // 1번 행 항목
  MSP1000003: '1_3', // 1번 행 항목

  // 2번 행 (통증 부위)
  MSP2000001: '2_1', // 약한 통증
  MSP2000002: '2_2', // 중간 통증
  MSP2000003: '2_3', // 심한 통증
  MSP2000004: '2_4', // 매우 심한 통증
  MSP2000005: '2_5', // 기타

  // 3번 행 (통증 빈도)
  MSP3000001: '3_1', // 항상
  MSP3000002: '3_2', // 자주
  MSP3000003: '3_3', // 가끔
  MSP3000004: '3_4', // 드물게

  // 4번 행 (통증 지속시간)
  MSP4000001: '4_1', // 1일 이내
  MSP4000002: '4_2', // 1~2일
  MSP4000003: '4_3', // 3~4일
  MSP4000004: '4_4', // 5~6일
  MSP4000005: '4_5', // 1주 이상

  // 5번 행 (통증 강도)
  MSP5000001: '5_1', // 약함
  MSP5000002: '5_2', // 강함

  // 6번 행 (증상 관련)
  MSP6000001: '6_1', // 부종
  MSP6000002: '6_2', // 무감각
  MSP6000003: '6_3', // 화끈거림
  MSP6000004: '6_4', // 따끔거림
  MSP6000005: '6_5', // 뻣뻣함
  etc: '6_etc' // 기타
}

const disabled = computed(() => {
  return true
})

onMounted(() => {
  init()
})

function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  listUrl.value = selectConfig.hea.muscleSystem.muscleSurvey.countList.url
  checklistUrl.value = selectConfig.hea.muscleSystem.surveyChecklist.list.url
  painAreaUrl.value = selectConfig.hea.muscleSystem.painArea.list.url
  // list setting
  getDetail()
}

function getDetail() {
  $http({
    url: $format(listUrl.value, _props.param.heaInvestigationPlanId),
    method: 'GET'
  }).then((_result: any) => {
    _.extend(survey.value, _result.data)
    // 통증부위
    setGridLastColumns()
  })
}

function setGridLastColumns() {
  let _neck = 'N'
  let _shoulder = 'N'
  let _arm = 'N'
  let _hand = 'N'
  let _waist = 'N'
  let _leg = 'N'
  if (survey.value) {
    _neck = survey.value.neck === 'Y' ? 'Y' : 'N'
    _shoulder = survey.value.shoulder === 'Y' ? 'Y' : 'N'
    _arm = survey.value.arm === 'Y' ? 'Y' : 'N'
    _hand = survey.value.hand === 'Y' ? 'Y' : 'N'
    _waist = survey.value.waist === 'Y' ? 'Y' : 'N'
    _leg = survey.value.leg === 'Y' ? 'Y' : 'N'
  }
  gridLast.value.columns = [
    {
      name: 'painArea',
      field: 'painArea',
      label: '통증부위',
      align: 'left',
      sortable: false,
      style: 'width:10%',
      type: 'custom'
    },
    {
      name: 'neck',
      field: 'neck',
      label: '목',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _neck,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'shoulder',
      field: 'shoulder',
      label: '어깨',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _shoulder,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'arm',
      field: 'arm',
      label: '팔/팔꿈치',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _arm,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'hand',
      field: 'hand',
      label: '손/손목/손가락',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _hand,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'waist',
      field: 'waist',
      label: '허리',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _waist,
      setHeader: true,
      type: 'custom'
    },
    {
      name: 'leg',
      field: 'leg',
      label: '다리/발',
      align: 'center',
      sortable: false,
      style: 'width:15%',
      headerType: 'checkbox',
      value: _leg,
      setHeader: true,
      type: 'custom'
    }
  ]
  $http({
    url: painAreaUrl.value,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      let _idx = 1
      _.forEach(_result.data, (item: surveyType) => {
        item.neck = survey.value[`neck${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.shoulder = survey.value[`shoulder${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.arm = survey.value[`arm${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.hand = survey.value[`hand${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.waist = survey.value[`waist${_idx}` as musculoskleltalSystemTargetLiteralType]
        item.leg = survey.value[`leg${_idx}` as musculoskleltalSystemTargetLiteralType]

        if (_idx === 6) {
          item.necketc = survey.value[`neck${_idx}etc`]
          item.shoulderetc = survey.value[`shoulder${_idx}etc`]
          item.armetc = survey.value[`arm${_idx}etc`]
          item.handetc = survey.value[`hand${_idx}etc`]
          item.waistetc = survey.value[`waist${_idx}etc`]
          item.legetc = survey.value[`leg${_idx}etc`]
        }
        _idx++
      })
      gridLast.value.data = _result.data
    } else {
      gridLast.value.data = _result.data
    }
  })
}

function headerCheckboxChange(_props: any, col: tableColumnType, val: stringNull) {
  survey.value[col.name as musculoskleltalSystemTargetLiteralType] = val
}

/**
 * 특정 신체 부위, 코드에 맞는 survey 객체의 값을 가져옵니다
 * @param bodyPart 신체 부위 (neck, shoulder, arm, hand, waist, leg)
 * @param code 코드 값 (MSP1000001, MSP2000002 등)
 * @returns survey 객체의 해당 속성 값
 */
function getSurveyValue(bodyPart: string, code: string): string {
  if (!code) {
    return ''
  }

  if (code === 'BASE') {
    return (survey.value[bodyPart as keyof typeof survey.value] as string) || ''
  }

  const suffix = codeToSuffixMap[code]

  const propertyName = `${bodyPart}${suffix}` as keyof typeof survey.value

  const value = survey.value[propertyName] || ''

  return value ? `${value}` : ''
}
</script>

<style lang="sass">
// 색상 변수 정의
$primary-color: #3b82f6
$primary-light: #93c5fd
$primary-dark: #1d4ed8
$secondary-color: #4b5563
$background-light: #f8fafc
$background-gray: #f1f5f9
$border-color: #e2e8f0
$text-color: #1e293b
$text-light: #64748b
$success-color: #10b981
$warning-color: #f59e0b
$danger-color: #ef4444
$info-color: #06b6d4

// 통증 레벨 색상
$pain-level-1: #93c5fd
$pain-level-2: #fbbf24
$pain-level-3: #f87171
$pain-level-4: #ef4444

.survey
  .default-table
    padding: 0 10px 10px 10px !important
    border-radius: 8px
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05)
    background-color: white

  .q-table
    thead tr th
      background-color: $background-gray
      color: $secondary-color
      font-weight: 600
      padding: 12px 16px
      text-transform: none
      letter-spacing: 0
      font-size: 0.9em

    tbody tr td
      padding: 8px 12px
      border-bottom: 1px solid $border-color

    tbody tr:hover
      background-color: $background-light

  .q-td
    transition: all 0.2s ease

  .q-checkbox
    .q-checkbox__inner
      color: $primary-color

  .lastQue
    margin: -20px auto 30px 20px !important
    .q-field__control-container
      padding-top: 20px !important

  .q-td, .CoptionGroupRadio, .CoptionGroupCheck
    font-size: 0.9em !important

.item-container
  display: flex
  align-items: center
  transition: all 0.2s ease

  &:hover
    background-color: $background-light

  .item-content
    display: flex
    justify-content: space-between
    width: 100%
    align-items: center

    // 새로운 item-value 스타일
    .item-value
      font-size: 0.9em
      font-weight: 500
      color: tomato
      padding: 1px 8px
      border-radius: 4px
      margin-left: 8px
      letter-spacing: 0.5px
      position: relative

      &::before
        content: "["
        margin-right: 2px

      &::after
        content: "건]"
        margin-left: 2px

.pain-area-container
  display: flex
  align-items: center

  .pain-area-text
    font-weight: 500
    color: $text-color

  .info-icon
    margin-left: 8px
    font-size: 22px
    color: $info-color
    cursor: pointer
    transition: all 0.2s ease

    &:hover
      color: $primary-dark
      transform: scale(1.1)

.tooltip-custom
  background-color: rgba(30, 41, 59, 0.95)
  padding: 16px
  border-radius: 8px
  max-width: 360px

  .tooltip-title
    font-weight: 600
    font-size: 1.05rem
    color: white
    margin-bottom: 12px
    border-bottom: 1px solid rgba(255, 255, 255, 0.2)
    padding-bottom: 6px

  .tooltip-item
    display: flex
    align-items: center
    margin-bottom: 10px
    line-height: 1.5

    &:last-child
      margin-bottom: 0

    .pain-level
      width: 12px
      height: 12px
      border-radius: 50%
      margin-right: 10px
      flex-shrink: 0

      &.pain-level-1
        background-color: $pain-level-1

      &.pain-level-2
        background-color: $pain-level-2

      &.pain-level-3
        background-color: $pain-level-3

      &.pain-level-4
        background-color: $pain-level-4
</style>
