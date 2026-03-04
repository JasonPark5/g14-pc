<template>
  <!-- <c-search-box @enter="getList">
    </c-search-box> -->
  <c-table
    ref="table"
    title="부담작업 목록"
    :columns="gridColumns"
    :data="grid.data"
    :isExcelDown="false"
    :isFullScreen="false"
    :columnSetting="false"
    :filtering="false"
    :hideBottom="true"
    gridHeightAuto
  >
    <!-- 버튼 영역 -->
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn v-if="editable" label="선택" icon="check" @btnClicked="select" />
      </q-btn-group>
    </template>
    <template v-slot:customHeader="{ col }">
      <q-img :src="`${col.src}`" />
    </template>
  </c-table>
  <c-dialog :param="popupOptions" />
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
import { heavyWorkType } from './investigation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'worksheetPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup', 'setRegInfo'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    detailJobs: Array<any>
    plantCd: stringNull
  }
  contentHeight: stringNull
  style: object | null
  returnData: object | null
}
interface gridType {
  merge?: Array<tableMergeType>
  headerItems?: Array<any>
  defaultColumns: Array<tableColumnType>
  data?: Array<heavyWorkType>
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
      detailJobs: [],
      plantCd: ''
    }
  },
  contentHeight: 'auto',
  style: null,
  returnData: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const grid = ref<gridType>({
  headerItems: [],
  defaultColumns: [
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
                          name: 'f',
                          field: 'f',
                          label: '무게',
                          align: 'center',
                          sortable: false,
                          style: 'width:80px'
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const editable = ref(true)
const headerUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const gridColumns = computed(() => {
  const _cols = _.cloneDeep(grid.value.defaultColumns)
  if (grid.value.headerItems && grid.value.headerItems.length > 0) {
    _.forEach(grid.value.headerItems, (item) => {
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
                            name: item.heaHeavyWorkNo,
                            field: item.heaHeavyWorkNo,
                            label: item.weightDesc,
                            align: 'center',
                            sortable: false,
                            style: 'width:100px',
                            type: 'check',
                            true: 'Y',
                            false: 'N'
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
watch(
  () => props.contentHeight,
  () => {
    let height = props.contentHeight - 50
    if (height < 400) height = 500
    grid.value.height = height + 'px'
  }
)

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
  headerUrl.value = selectConfig.hea.heavyWork.list.url
  // code setting
  // list setting
  setHeader()
  getList()
}
/******************************
 * TODO (목적): 컬럼헤더값 조회
 *******************************/
function setHeader() {
  $http({
    url: headerUrl.value,
    method: 'GET',
    params: {
      useFlag: 'Y',
      plantCd: props.popupParam.plantCd
    }
  }).then((_result: any) => {
    grid.value.headerItems = _result.data
  })
}
/******************************
 * TODO (목적): 테이블의 데이터 조회
 *******************************/
function getList() {
  grid.value.data = []
  const _detailJobs: { [key: string]: string } = {}
  if (props.popupParam.detailJobs && props.popupParam.detailJobs.length > 0) {
    for (let i = 1; i < 12; i++) {
      const _check = _.find(props.popupParam.detailJobs, { heaHeavyWorkNo: String(i) })
      _detailJobs[String(i)] = _check ? 'Y' : 'N'
    }
    grid.value.data.push(_detailJobs)
  } else {
    for (let i = 1; i < 12; i++) {
      _detailJobs[String(i)] = 'N'
    }
    grid.value.data.push(_detailJobs)
  }
}
/******************************
 * TODO (목적): 테이블에서 필요한 칸에 체크하고 선택 클릭시
 *******************************/
function select() {
  if (grid.value.data && grid.value.data.length > 0 && grid.value.data[0]) {
    delete grid.value.data[0].editFlag
    delete grid.value.data[0].chgUserId
  }
  emits('closePopup', _.cloneDeep(grid.value.data))
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
