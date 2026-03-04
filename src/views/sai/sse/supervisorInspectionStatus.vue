<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            type="year"
            label="평가년도"
            default="today"
            name="year"
            v-model:value="searchParam.year"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="HALF_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            label="상/하반기"
            name="checkSemiAnnualCd"
            v-model:value="searchParam.checkSemiAnnualCd"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
        <c-table
          ref="table"
          title="관리감독자 평가결과"
          :columns="grid2.columns"
          :data="grid2.data"
          :customTrClass="setTrClass"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
        <c-table
          ref="table"
          title="관리감독자 평가집계"
          :merge="grid.merge"
          :columns="grid.columns"
          :data="grid.data"
          :customTrClass="setTrClass"
          @linkClick="linkClick"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
        <c-dialog :param="popupOptions" />
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
  name: 'supervisorInspectionStatus'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
interface gridType {
  columns: tableColumnType[]
  data: any[]
  merge?: tableMergeType[]
}

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  year: '',
  checkSemiAnnualCd: null,
  exclude: 'C'
})
const grid = ref<gridType>({
  merge: [{ index: 0, colName: 'deptNm' }],
  columns: [
    {
      name: 'deptNm',
      field: 'deptNm',
      label: '부서',
      align: 'center',
      style: 'width:10%',
      sortable: true
    },
    {
      name: 'evaluateeNm',
      field: 'evaluateeNm',
      label: '평가대상자',
      align: 'center',
      style: 'width:10%',
      sortable: true
    },
    {
      name: 'type1',
      field: 'type1',
      label: '구분',
      align: 'center',
      style: 'width:5%',
      sortable: true
    },
    {
      name: 'checkDate',
      field: 'checkDate',
      label: '평가일',
      align: 'center',
      style: 'width:10%',
      sortable: true,
      type: 'link'
    },
    {
      name: 'sum1',
      field: 'sum1',
      label: '1차 평가',
      align: 'center',
      style: 'width:10%',
      sortable: true
    },
    {
      name: 'sum2',
      field: 'sum2',
      label: '2차 평가',
      align: 'center',
      style: 'width:10%',
      sortable: true
    },
    {
      name: 'sum3',
      field: 'sum3',
      label: '종합',
      align: 'center',
      style: 'width:10%',
      sortable: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
const grid2 = ref<gridType>({
  columns: [
    {
      name: 'deptNm',
      field: 'deptNm',
      label: '부서',
      align: 'center',
      style: 'width:20%',
      sortable: true
    },
    {
      name: 'sum1',
      field: 'sum1',
      label: '1차 평가',
      align: 'center',
      style: 'width:20%',
      sortable: true
    },
    {
      name: 'sum2',
      field: 'sum2',
      label: '2차 평가',
      align: 'center',
      style: 'width:20%',
      sortable: true
    },
    {
      name: 'sum3',
      field: 'sum3',
      label: '종합',
      align: 'center',
      style: 'width:20%',
      sortable: true
    },
    {
      name: 'remark',
      field: 'remark',
      label: '비고',
      align: 'left',
      sortable: true
    }
  ],
  data: []
})
const listUrl = ref('')
const listUrl2 = ref('')
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
/******************************
 * TODO (목적): 초기셋팅
 *******************************/
function init() {
  // role setting
  editable.value = Boolean(route.meta.editable)
  // url setting
  listUrl.value = selectConfig.sai.sse.superInspection.list.url
  listUrl2.value = selectConfig.sai.sse.superInspection.status.url
  // code setting
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    const rawData = _result.data
    let [totalSum1, totalSum2, totalSum3, totalCnt] = [0, 0, 0, 0]
    const groupData: any[] = []
    const groupMap = new Map<string, any[]>()
    // 1. 그룹핑
    _.forEach(rawData, (row: any) => {
      const key = row.deptCd
      if (!groupMap.has(key)) groupMap.set(key, [])
      groupMap.get(key)!.push(row)
    })
    // 2. 그룹별 처리
    groupMap.forEach((rows, deptCd) => {
      let [subtotal1, subtotal2, subtotal3] = [0, 0, 0]
      rows.forEach((r) => {
        groupData.push(r)
        subtotal1 += Number(r.sum1) || 0
        subtotal2 += Number(r.sum2) || 0
        subtotal3 += Number(r.sum3) || 0
      })
      groupData.push({
        _deptCd: deptCd,
        deptNm: '부서 평균',
        sum1: Math.round((subtotal1 / rows.length) * 10) / 10,
        sum2: Math.round((subtotal2 / rows.length) * 10) / 10,
        sum3: Math.round((subtotal3 / rows.length) * 10) / 10,
        isSubTotal: true,
        remark: ''
      })
      totalSum1 += subtotal1
      totalSum2 += subtotal2
      totalSum3 += subtotal3
      totalCnt += rows.length
    })
    // 3. 전체 평균 row 추가
    groupData.push({
      deptCd: uid(),
      deptNm: '전체 평균',
      sum1: Math.round((totalSum1 / totalCnt) * 10) / 10 || 0,
      sum2: Math.round((totalSum2 / totalCnt) * 10) / 10 || 0,
      sum3: Math.round((totalSum3 / totalCnt) * 10) / 10 || 0,
      isMainTotal: true
    })
    grid.value.data = groupData
  })

  $http({
    url: listUrl2.value,
    method: 'GET',
    params: searchParam.value
  }).then((result: any) => {
    grid2.value.data = result.data
    const cnt = grid2.value.data.length
    // 종합평균 계산
    const sums = grid2.value.data?.reduce(
      (acc: any, item: any) => {
        acc.sum1 += Number(item.sum1) || 0
        acc.sum2 += Number(item.sum2) || 0
        acc.sum3 += Number(item.sum3) || 0
        return acc
      },
      { sum1: 0, sum2: 0, sum3: 0 }
    )
    // 종합평균 행 push
    grid2.value.data?.push({
      sum1: Math.round((sums?.sum1 / cnt) * 10) / 10 || 0,
      sum2: Math.round((sums?.sum2 / cnt) * 10) / 10 || 0,
      sum3: Math.round((sums?.sum3 / cnt) * 10) / 10 || 0,
      deptNm: '종합평균',
      isMainTotal: true
    })
  })
}
/******************************
 * TODO (목적): 기본 정보 팝업 표시
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title =
    row.type === 'A' ? '관리감독자 평가 상세' : '관리감독자(팀장) 평가 상세'
  popupOptions.value.param = {
    saiSuperEvaluationId: row ? row.saiSuperEvaluationId : '',
    type: row ? row.type : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(
      () =>
        import(
          row.type === 'A'
            ? `./supervisorInspectionInfo.vue`
            : `./supervisorInspectionLeaderInfo.vue`
        )
    )
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
function setTrClass(_props: any) {
  return _props.row.isSubTotal
    ? 'bg-blue-1 text-bold'
    : _props.row.isMainTotal
      ? 'bg-orange-1 text-bold'
      : ''
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
