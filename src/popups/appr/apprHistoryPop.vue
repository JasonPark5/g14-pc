<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="apprline2"
          title="회람"
          tableId="apprline2"
          topBorderClass="topcolor-orange"
          :columnSetting="false"
          :isFullScreen="false"
          :hideBottom="true"
          :usePaging="false"
          :filtering="false"
          gridHeight="350px"
          :columns="gridline2.columns"
          :data="gridline2.data"
          :isExcelDown="false"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="apprline"
          title="결재이력"
          tableId="apprline"
          topBorderClass="topcolor-orange"
          :columnSetting="false"
          :isFullScreen="false"
          :hideBottom="true"
          :usePaging="false"
          :filtering="false"
          gridHeight="350px"
          :columns="gridline.columns"
          :data="gridline.data"
          :isExcelDown="false"
        >
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'approvalKindName'">
              <span class="text-weight-bold" :class="getLineKindColor(props.row.approvalKindCd)">{{
                props.row.approvalKindName
              }}</span>
            </template>
            <template v-if="col.name === 'approvalStatusName'">
              <span :class="getLineKindColor2(props.row.approvalStatusName)">{{
                props.row.approvalStatusName
              }}</span>
            </template>
            <template v-if="col.name === 'sign'">
              <q-btn round unelevated size="10px" color="amber" icon="search">
                <q-popup-proxy :id="'proxy_' + props.rowIndex" :breakpoint="400">
                  <component
                    :is="col.component"
                    :popupParam="props.row"
                    :rowIndex="props.rowIndex"
                    @callback="(data: any) => callbackProxy(data, props)"
                  />
                </q-popup-proxy>
              </q-btn>
            </template>
          </template>
        </c-table>
      </div>
    </div>
  </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'apprHistoryPop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** userStore 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['callbackProxy'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: commonParamType
}
type commonParamType = {
  sysApprovalRequestId: string
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
      sysApprovalRequestId: ''
    }
  }
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const gridline = ref({
  columns: [
    {
      name: 'approvalKindName',
      field: 'approvalKindName',
      label: '결재구분',
      align: 'center',
      style: 'width: 80px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'approvalUserName',
      field: 'approvalUserName',
      label: '이름',
      align: 'center',
      type: 'html',
      style: 'width: 120px',
      sortable: false
    },
    {
      name: 'approvalStatusName',
      field: 'approvalStatusName',
      label: '결재상태',
      align: 'center',
      style: 'width: 100px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'returnReason',
      field: 'returnReason',
      label: '반려사유',
      align: 'left',
      sortable: false
    },
    {
      name: 'approvalDt',
      field: 'approvalDt',
      label: '결재일시',
      align: 'center',
      style: 'width: 140px',
      sortable: false
    }
  ] as any,
  data: [] as any
})

const gridline2 = ref({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width: 40%',
      sortable: false
    },
    {
      name: 'approvalUserName',
      field: 'approvalUserName',
      label: '이름',
      align: 'center',
      style: 'width: 40%',
      sortable: false
    }
  ],
  data: []
})

/******************************
 * @Computed_선언
 *******************************/

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
function init() {
  if (user.value.approveSignature === 'Y') {
    gridline.value.columns.push({
      name: 'sign',
      field: 'sign',
      label: '서명보기',
      style: 'width:70px',
      type: 'custom',
      align: 'center',
      sortable: false,
      // component: shallowRef(() => import(`@popups/appr/apprSignaturePop.vue`))
      component: shallowRef(defineAsyncComponent(() => import(`@popups/appr/apprSignaturePop.vue`)))
    })
  }
  getApprLine()
}
/******************************
 * TODO (목적): 결재라인 구분별 색상
 * @param (1): 결재상태 코드
 * @return (반환): 색상class
 *******************************/
function getLineKindColor(code: string) {
  switch (code) {
    case 'AKC0000010':
    case 'AKC0000001':
      return 'text-blue-grey-4'
    case 'AKC0000002':
      return 'text-green-7'
    case 'AKC0000003':
      return 'text-blue-7'
    case 'AKC0000004':
      return 'text-blue-grey-4'
    default:
      return ''
  }
}
/******************************
 * TODO (목적): 반려일 경우 색상
 * @param (1): 반려
 * @return (반환): 색상class
 *******************************/
function getLineKindColor2(status: string) {
  return status === '반려' ? 'text-weight-bold text-red' : ''
}
/******************************
 * TODO (목적): 결재라인 가져오기
 * @return (반환): 결재라인 List
 *******************************/
async function getApprLine() {
  $http({
    url: selectConfig.sys.appr.line.list.url,
    method: 'GET',
    params: {
      sysApprovalRequestId: props.popupParam.sysApprovalRequestId
    }
  }).then((_result: any) => {
    if (_result.data && _result.data.length > 0) {
      const lineData1 = _result.data.filter((item: any) =>
        ['AKC0000001', 'AKC0000002', 'AKC0000003', 'AKC0000004', 'AKC0000010'].includes(
          item.approvalKindCd
        )
      )
      const lineData2 = _result.data.filter((item: any) => item.approvalKindCd === 'AKC0000009')

      lineData1.forEach((item: any) => {
        if (item.approvalDt) {
          item.approvalDt = item.approvalDt.slice(0, 19)
        }
      })
      gridline.value.data = lineData1
      gridline2.value.data = lineData2
    }
  })
}

function callbackProxy(_data: any, _props: any) {
  const refName = 'proxy_' + _props.rowIndex
  emits('callbackProxy', _data, _props)
  const elements = document.getElementById(refName) as any
  if (elements) elements.hide()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
