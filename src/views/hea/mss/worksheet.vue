<template>
  <c-table
    ref="table"
    title="부담작업 분류표"
    :merge="grid.merge"
    :columns="gridColumns"
    :data="investigation.sopTable"
    :gridHeightAuto="true"
    :gridHeight="gridHeight"
    :editable="editable && !disabled"
    :usePaging="false"
    :isExcelDown="false"
    :filtering="false"
    :isFullScreen="false"
    :columnSetting="false"
  >
    <template v-slot:customArea="{ props, col }">
      <!-- <template v-if="col.name !== 'f'"> -->
      <span :class="props.row[col.name] === 'O' ? 'text-primary' : 'text-red'">
        <b>{{ props.row[col.name] }}</b>
      </span>
      <!-- </template>
        <template v-else>
          {{setResult(props)}}
        </template> -->
    </template>
    <template v-slot:customHeader="{ col }">
      <q-img :src="`${col.src}`" />
    </template>
  </c-table>
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
import { heavyWorkType, investigationType } from './investigation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'worksheet'
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
  popupParam: {
    heaInvestigationPlanId: stringNull
  }
  investigation: investigationType
  heavyWorks: Array<heavyWorkType>
  disabled: boolean
  isOld: boolean
  contentHeight: stringNull
}
interface gridType {
  merge?: Array<tableMergeType>
  headerItems?: Array<any>
  defaultColumns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      heaInvestigationPlanId: ''
    }
  },
  investigation: () => {
    return {
      heaInvestigationPlanId: '', // 근골격계 조사계획 일련번호
      plantCd: '', // 사업장코드
      investigationPlanName: '', // 조사계획명
      year: '', // 심사년도
      heaInvestigationStepCd: '', // 진행상태
      investigationStartDate: '', // 조사시작일
      investigationEndDate: '', // 조사종료일
      period: ['', ''],
      deptCd: '', // 담당자 부서
      userId: '', // 담당자 id
      investigationDeptCd: '', // 조사부서
      agency: '', // 조사기관
      remark: '', // 비고
      regUserId: '', // 등록자 ID
      chgUserId: '', // 수정자 ID
      sops: [], // 단위작업
      sopTable: [] // 작업분류표
    }
  },
  heavyWorks: () => [],
  disabled: false,
  isOld: false,
  contentHeight: 'auto'
})

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  merge: [
    { index: 0, colName: 'processCd' },
    { index: 1, colName: 'mdmSopId' }
  ],
  headerItems: [],
  defaultColumns: [
    {
      name: 'processName',
      field: 'processName',
      label: '공정',
      align: 'center',
      sortable: false,
      style: 'width:100px'
    },
    {
      name: 'sopName',
      field: 'sopName',
      label: '단위작업',
      align: 'left',
      sortable: false,
      style: 'width:120px'
    },
    {
      name: 'detailJobContents',
      field: 'detailJobContents',
      label: '작업내용',
      align: 'left',
      sortable: false,
      style: 'width:180px'
    },
    {
      name: 'a',
      field: 'a',
      label: '구분',
      style: 'width:80px',
      child: [
        {
          name: 'b',
          field: 'b',
          label: '노출시간',
          style: 'width:80px',
          child: [
            {
              name: 'c',
              field: 'c',
              label: '노출빈도',
              style: 'width:80px',
              child: [
                {
                  name: 'd',
                  field: 'd',
                  label: '신체부위',
                  style: 'width:80px',
                  child: [
                    {
                      name: 'e',
                      field: 'e',
                      label: '작업자세<br/>및 내용',
                      style: 'width:80px',
                      child: [
                        {
                          name: 'overallRating',
                          field: 'overallRating',
                          label: '무게',
                          align: 'center',
                          sortable: false,
                          style: 'width:80px'
                          // type: 'custom',
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  data: []
})
const editable = ref(true)
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() =>
  !isNaN(props.contentHeight) ? props.contentHeight - 50 + 'px' : '900px'
)
const gridColumns = computed(() => {
  const _cols = _.cloneDeep(grid.value.defaultColumns)
  if (props.heavyWorks && props.heavyWorks.length > 0) {
    _.forEach(props.heavyWorks, (item) => {
      /**
       * 1. 구분
       * 2. 노출시간
       * 3. 노출빈도
       * 4. 신체부위
       * 5. 작업자세 및 내용
       * 6. 무게
       */
      const _col = {
        name: `heavyWorkName${item.heaHeavyWorkNo}`,
        field: `heavyWorkName${item.heaHeavyWorkNo}`,
        label: item.heavyWorkName,
        style: 'width:100px',
        headerCustom: true,
        src: item.src,
        child: [
          {
            name: `exposureTime${item.heaHeavyWorkNo}`,
            field: `exposureTime${item.heaHeavyWorkNo}`,
            label: item.exposureTime,
            style: 'width:100px',
            child: [
              {
                name: `exopsureCnt${item.heaHeavyWorkNo}`,
                field: `exopsureCnt${item.heaHeavyWorkNo}`,
                label: item.exopsureCnt,
                style: 'width:100px',
                child: [
                  {
                    name: `bodyDesc${item.heaHeavyWorkNo}`,
                    field: `bodyDesc${item.heaHeavyWorkNo}`,
                    label: item.bodyDesc,
                    style: 'width:100px',
                    child: [
                      {
                        name: `positionDesc${item.heaHeavyWorkNo}`,
                        field: `positionDesc${item.heaHeavyWorkNo}`,
                        label: item.positionDesc,
                        style: 'width:100px',
                        child: [
                          {
                            name: `heaHeavyWorkNo${item.heaHeavyWorkNo}`,
                            field: `heaHeavyWorkNo${item.heaHeavyWorkNo}`,
                            label: item.weightDesc,
                            align: 'center',
                            sortable: false,
                            style: 'width:100px',
                            type: 'custom'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
      _cols.push(_col)
    })
  }
  return _cols
})

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
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
