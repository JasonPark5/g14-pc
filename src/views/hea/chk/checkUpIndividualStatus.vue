<template>
  <c-search-box @enter="getList">
    <template v-slot:search>
      <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
      </div> -->
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-dept
          type="search"
          :isFirstValue="false"
          label="부서"
          name="deptCd"
          v-model:value="searchParam.deptCd"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-field label="대상자" name="userId" v-model:value="searchParam.userId" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-select
          :comboItems="comboItems"
          type="edit"
          itemText="codeName"
          itemValue="code"
          name="hospitalId"
          label="병원"
          v-model:value="searchParam.hospitalId"
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <c-datepicker
          :range="true"
          label="검진 기간"
          defaultStart="-12M"
          defaultEnd="0M"
          name="checkupPeriod"
          v-model:value="searchParam.checkupPeriod"
        />
      </div>
    </template>
  </c-search-box>
  <c-table
    ref="table"
    title="개인별 검진결과 현황 목록"
    tableId="table"
    :merge="grid.merge"
    :columns="grid.columns"
    :data="grid.data"
    rowKey="heaCheckupResultId;"
    :columnSetting="false"
    @linkClick="linkClick"
  >
    <template v-slot:table-button>
      <q-btn-group outline>
        <c-btn label="검색" icon="search" @btnClicked="getList" />
      </q-btn-group>
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
import { indexOf, forEach } from 'lodash-es'

import { useUserStore } from '@stores/user'
import { storeToRefs } from 'pinia'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'checkUpIndividualStatus'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user, auths } = storeToRefs(userStore)

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

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

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
const searchParam = ref({
  plantCd: null,
  deptCd: null,
  userId: '',
  hospitalId: null,
  checkupPeriod: []
})
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref({
  merge: [
    { index: 0, colName: 'userId' },
    { index: 1, colName: 'userId' },
    { index: 2, colName: 'userId' }
  ],
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'empNo',
      field: 'empNo',
      label: '사번',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'userName',
      field: 'userName',
      label: '대상자',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'hospitalName',
      field: 'hospitalName',
      label: '병원',
      style: 'width:130px',
      align: 'center',
      sortable: true
    },
    {
      name: 'checkupName',
      field: 'checkupName',
      label: '제목',
      style: 'width:400px',
      align: 'left',
      sortable: true
    },
    {
      name: 'checkupDate',
      field: 'checkupDate',
      label: '검진일',
      align: 'center',
      style: 'width: 100px',
      sortable: false,
      type: 'link'
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const comboItems = ref<codeMasterType>([])

/******************************
 * @Computed_선언
 *******************************/
const isHeaDept = computed(() => indexOf(auths.value, 'SAGI001024') > -1) // 보건담당자 여부 판단

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
  listUrl.value = selectConfig.hea.checkup.individual.list.url
  // code setting
  if (!isHeaDept.value) searchParam.value.userId = user.value.userId
  // list setting
  getList()
  setHospital()
}

/******************************
 * TODO (목적): 개인별 검진결과 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}

/******************************
 * TODO (목적): 마스터에 등록된 병원 목록 조회
 *******************************/
function setHospital() {
  $http({
    url: selectConfig.hea.hospital.list.url,
    method: 'GET',
    params: { useFlag: 'Y' }
  }).then((_result: any) => {
    forEach(_result.data, (_item: any) => {
      comboItems.value.push({
        code: _item.hospitalId,
        codeName: _item.hospitalName,
        typeFlag: _item.typeFlag
      })
    })
  })
}
/******************************
 * TODO (목적): 검진결과 상세팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./checkUpResultDetail.vue`))
  )
  popupOptions.value.title = $language('건강검진 결과 상세') + ' : ' + row.userName
  popupOptions.value.width = '70%'
  popupOptions.value.isFull = true
  popupOptions.value.param = { heaCheckupResultId: row ? row.heaCheckupResultId : '' }
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
</script>
