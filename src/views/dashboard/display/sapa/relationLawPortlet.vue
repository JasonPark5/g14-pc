<template>
  <c-table
    ref="tableLaw"
    :columns="gridLaw.columns"
    :data="gridLaw.data"
    gridHeightAuto
    :isTitle="false"
    :isDashboard="true"
    :columnSetting="false"
    :usePaging="false"
    :filtering="false"
    :isFullScreen="false"
    :hideBottom="true"
  >
    <template v-slot:customArea="{ props, col }">
      <template v-if="col.stype === 'check'">
        <q-icon
          v-if="props.row[col.name] == 'Y'"
          size="16px"
          color="blue-8"
          name="event_available"
        />
      </template>
      <template v-if="col.name === 'status'">
        <div :class="getLawStatusIcon(props.row)" />
      </template>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'relationLawPortlet'
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

/******************************
 * @Interface_선언
 *******************************/

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
const gridLaw = ref({
  columns: [
    {
      name: 'targetName',
      field: 'targetName',
      label: '목표',
      align: 'left',
      sortable: false
    },
    {
      name: 'month1',
      field: 'month1',
      stype: 'check',
      label: '1월',
      align: 'center',
      style: 'width:36px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month2',
      field: 'month2',
      stype: 'check',
      label: '2월',
      align: 'center',
      style: 'width:36px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month3',
      field: 'month3',
      stype: 'check',
      label: '3월',
      align: 'center',
      style: 'width:36px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month4',
      field: 'month4',
      stype: 'check',
      label: '4월',
      align: 'center',
      style: 'width:36px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month5',
      field: 'month5',
      stype: 'check',
      label: '5월',
      align: 'center',
      style: 'width:36px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month6',
      field: 'month6',
      stype: 'check',
      label: '6월',
      align: 'center',
      style: 'width:36px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month7',
      field: 'month7',
      stype: 'check',
      label: '7월',
      align: 'center',
      style: 'width:36px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month8',
      field: 'month8',
      stype: 'check',
      label: '8월',
      align: 'center',
      style: 'width:36px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month9',
      field: 'month9',
      stype: 'check',
      label: '9월',
      align: 'center',
      style: 'width:36px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month10',
      field: 'month10',
      stype: 'check',
      label: '10월',
      align: 'center',
      style: 'width:42px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month11',
      field: 'month11',
      stype: 'check',
      label: '11월',
      align: 'center',
      style: 'width:42px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'month12',
      field: 'month12',
      stype: 'check',
      label: '12월',
      align: 'center',
      style: 'width:42px',
      sortable: false,
      type: 'custom'
    },
    {
      name: 'status',
      field: 'status',
      label: '여부',
      align: 'center',
      style: 'width: 60px',
      sortable: false,
      type: 'custom'
    }
  ],
  data: []
})
const lawCheckUrl = ref('')

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
  // url setting
  lawCheckUrl.value = selectConfig.main.lawcheck.url
  // code setting
  // list setting
  getLawCheck()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getLawCheck() {
  $http({
    url: lawCheckUrl.value,
    method: 'GET',
    params: {
      plantCd: '1000',
      year: '2025',
      safetyHealthyTypeCd: 'SHTC000002'
    }
  }).then((_result: any) => {
    gridLaw.value.data = _result.data
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getLawStatusIcon(_row: any) {
  let iconColor = ''
  switch (_row.status) {
    case 'SHS0000001':
      iconColor = 'bg-red lawcheckIcon'
      break
    case 'SHS0000005':
      iconColor = 'bg-yellow lawcheckIcon'
      break
    case 'SHS0000010':
      iconColor = 'bg-green lawcheckIcon'
      break
  }
  return iconColor
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
