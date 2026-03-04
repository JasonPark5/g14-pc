<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="HEQ_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="facilityTypeCd"
            label="중장비 분류"
            v-model:value="searchParam.facilityTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :editable="editable"
            label="공정"
            name="processCd"
            :customPopupParam="{ targetKey: 'process' }"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :editable="editable"
            label="업체"
            name="vendorCd"
            :customPopupParam="{
              targetKey: 'vendor',
              plantCd: searchParam.plantCd,
              processCd: searchParam.processCd
            }"
            v-model:value="searchParam.vendorCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker :range="true" label="안전검사기간" name="period" v-model:value="period" />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="중장비 목록"
      :columns="grid.columns"
      :data="grid.data"
      :checkClickFlag="false"
      rowKey="heqForkLiftId"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="onItemClick" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props }">
        <template v-if="props.row['validFlagName']">
          <q-chip
            :color="
              setTagColor(
                props.row.validFlagName === '유효기간 초과'
                  ? 'Y'
                  : props.row.validFlagName === '입력중'
                    ? 'NE'
                    : 'orange'
              )
            "
            :class="props.row.validFlagName === '유효기간 초과' ? 'blinking' : null"
            outline
            square
            text-color="white"
          >
            <q-avatar
              v-if="props.row.validFlagName === '유효기간 초과'"
              icon="alarm"
              color="red"
              text-color="white"
            />
            <q-avatar
              v-if="props.row.validFlagName === '입력중'"
              icon="create"
              color="grey-5"
              text-color="white"
            />
            {{
              setTagName(
                props.row.validFlagName === '유효기간 초과' ? 'Y' : props.row.validFlagName
              )
            }}
          </q-chip>
        </template>
      </template>
    </c-table>
    <c-dialog :param="popupOptions" />
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
import { forkLiftType } from './forkLift'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'forkLiftManage'
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
interface searchParamType {
  plantCd: stringNull
  startYmd: stringNull
  endYmd: stringNull
  facilityTypeCd: stringNull
  facilityTypeName: stringNull
  vendorCd: stringNull
  processCd: stringNull
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
const searchParam = ref<searchParamType>({
  plantCd: null,
  startYmd: '',
  endYmd: '',
  facilityTypeCd: '',
  facilityTypeName: '',
  vendorCd: '',
  processCd: ''
})
const grid = ref<any>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      style: 'width:150px',
      label: '사업장',
      align: 'center',
      sortable: true
    },
    {
      name: 'facilityTypeName',
      field: 'facilityTypeName',
      style: 'width:150px',
      label: '중장비 유형',
      align: 'center',
      sortable: true
    },
    {
      name: 'facilityName',
      field: 'facilityName',
      label: '중장비명',
      align: 'left',
      style: 'width:200px',
      type: 'link',
      sortable: true
    },
    {
      name: 'deviceNo',
      field: 'deviceNo',
      label: '기기번호',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'managerNo',
      field: 'managerNo',
      label: '관리번호',
      align: 'center',
      style: 'width:130px',
      sortable: true
    },
    {
      name: 'processName',
      field: 'processName',
      style: 'width:150px',
      label: '공정',
      align: 'center',
      sortable: true
    },
    {
      name: 'vendorName',
      field: 'vendorName',
      label: '업체',
      style: 'width:100px',
      align: 'center',
      sortable: true
    },
    {
      name: 'carryinDate',
      field: 'carryinDate',
      label: '반입일',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'useDate',
      field: 'useDate',
      label: '사용기간',
      style: 'width:180px',
      align: 'center',
      sortable: true
    },
    {
      name: 'safetyDate',
      field: 'safetyDate',
      style: 'width:100px',
      label: '안전검사일',
      align: 'center',
      sortable: true
    }
    // {
    //   name: 'validFlagName',
    //   field: 'validFlagName',
    //   style: 'width:130px',
    //   label: '안전검사잔여일수',
    //   type: 'custom',
    //   align: 'center',
    //   sortable: true
    // },
    // {
    //   name: 'inspectionDate',
    //   field: 'inspectionDate',
    //   style: 'width:100px',
    //   label: '최근점검일',
    //   align: 'center',
    //   sortable: true
    // }
  ],
  data: []
})
const colorItems = ref<any>([
  { colorCode: 'Y', colorName: '유효기간 초과', colorClass: 'red' },
  { colorCode: 'NE', colorName: '입력중', colorClass: 'grey-5' }
])
const period = ref([])
const listUrl = ref('')
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
  listUrl.value = selectConfig.sop.heq.forkLift.list.url
  // code setting
  // list setting
  getList()
}
function getList() {
  if (period.value) {
    searchParam.value.startYmd = period.value[0]
    searchParam.value.endYmd = period.value[1]
  } else {
    searchParam.value.startYmd = ''
    searchParam.value.endYmd = ''
  }
  // 전체조회

  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/* eslint-disable no-unused-vars */
function linkClick(row: forkLiftType | null) {
  popupOptions.value.title = '중장비 상세'
  popupOptions.value.param = {
    heqForkLiftId: row ? row.heqForkLiftId : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./forkLiftManageDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.height = '300px'
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
function onItemClick() {
  linkClick(null)
}
function setTagColor(data: stringNull) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { colorCode: data })
    return color ? color.colorClass : 'blue'
  }
}
function setTagName(data: stringNull) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { colorCode: data })
    return color ? color.colorName : data
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style>
.blinking {
  -webkit-animation: blink 3s ease-in-out infinite alternate;
  -moz-animation: blink 3s ease-in-out infinite alternate;
  animation: blink 3s ease-in-out infinite alternate;
}
@-webkit-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
