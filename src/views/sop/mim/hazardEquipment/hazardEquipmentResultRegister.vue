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
            codeGroupCd="HHM_TYPE_CD"
            itemText="codeName"
            itemValue="code"
            name="machineryClassification"
            label="기계분류"
            v-model:value="searchParam.machineryClassification"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            :editable="editable"
            :plantCd="searchParam.plantCd"
            :customPopupParam="{ targetKey: 'hazardequip' }"
            label="유해위험기계기구"
            name="hhmHazardousMachineryId"
            v-model:value="searchParam.hhmHazardousMachineryId"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :range="true"
            label="검사기간"
            name="period"
            v-model:value="searchParam.period"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="유해위험기계기구별 검사결과 목록"
      tableId="hazardEquipmentHis"
      :columns="grid.columns"
      :data="grid.data"
      :usePaging="false"
      :filtering="false"
      :checkClickFlag="false"
      :merge="grid.merge"
      @linkClick="linkClick"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <q-btn-group outline>
            <!-- <c-btn
              v-if="editable"
              label="결과 일괄 업로드"
              icon="upload"
              @btnClicked="openExcelUploader"
            /> -->
            <c-btn label="등록" v-if="editable" icon="add" @btnClicked="linkClick" />
            <c-btn label="검색" icon="search" @btnClicked="getList" />
          </q-btn-group>
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props }">
        <template v-if="props.row['inspectionSubjectFlag']">
          <q-chip
            v-if="props.row.inspectionSubjectFlag === 'A'"
            :color="setTagColor(props.row.inspectionSubjectFlag)"
            outline
            square
            class="full-size-chip inspectionSubjectFlag-blinking"
            text-color="white"
            icon="alarm"
          >
            {{ setTagName(props.row.inspectionSubjectFlag) }}
          </q-chip>
          <q-chip
            v-else
            :color="setTagColor(props.row.inspectionSubjectFlag)"
            outline
            square
            class="full-size-chip"
            text-color="white"
          >
            {{ setTagName(props.row.inspectionSubjectFlag) }}
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hazardEquipmentResultRegister'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
// const message = useMessageStore()
// const userStore = useUserStore()
// const { user } = storeToRefs(userStore)

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
  columns: tableColumnType
  data: Array<any>
  merge: tableMergeType
}

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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref<any>({
  plantCd: null,
  machineryClassification: null,
  period: []
})
const grid = ref<gridType>({
  merge: [
    // { index: 0, colName: 'hhmHazardousMachineryId' },
    // { index: 1, colName: 'hhmHazardousMachineryId' },
    // { index: 2, colName: 'hhmHazardousMachineryId' },
    // { index: 3, colName: 'hhmHazardousMachineryId' }
  ],
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      style: 'width:80px',
      align: 'center',
      sortable: true
    },
    {
      name: 'inspectionName',
      field: 'inspectionName',
      label: '점검명',
      style: 'width:200px',
      align: 'left',
      sortable: false,
      type: 'link'
    },
    {
      name: 'machineryName',
      field: 'machineryName',
      label: '기계명',
      style: 'width:200px',
      align: 'left',
      sortable: true
    },
    {
      name: 'inspectionDate',
      field: 'inspectionDate',
      label: '검사일',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'departmentDeptName',
      field: 'departmentDeptName',
      label: '주관부서',
      style: 'width:120px',
      align: 'center',
      sortable: false
    },
    {
      name: 'inspectionAgency',
      field: 'inspectionAgency',
      label: '기관(검사원명)',
      style: 'width:120px',
      align: 'left',
      sortable: false
    },
    {
      name: 'inspectionResultDetail',
      field: 'inspectionResultDetail',
      label: '검사결과 상세',
      style: 'width:350px',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const listUrl = ref('')
const colorItems = ref<Array<any>>([])

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
  listUrl.value = selectConfig.sop.hhm.hazard.history.list.url
  // code setting
  colorItems.value = [
    { stepperMstCd: 'Y', stepperMstNm: $language('대상'), colorClass: 'green' },
    { stepperMstCd: 'N', stepperMstNm: $language('비대상'), colorClass: 'orange' },
    { stepperMstCd: 'A', stepperMstNm: $language('지연'), colorClass: 'red' }
  ]
  // list setting
  getList()
}
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
function linkClick(row: any) {
  popupOptions.value.title = '유해위험기계기구 상세'
  popupOptions.value.param = {
    inspectionNo: row ? row.inspectionNo : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./hazardEquipmentResultRegisterDetail.vue`))
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
function setTagColor(data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { stepperMstCd: data })
    return color ? color.attrVal1 || color.colorClass : ''
  } else {
    return ''
  }
}
function setTagName(data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { stepperMstCd: data })
    return color ? color.codeName || color.stepperMstNm : ''
  } else {
    return ''
  }
}
// function openExcelUploader() {
//   popupOptions.value.title = '유해위험기계기구별 점검 업로드'
//   popupOptions.value.param = {}
//   popupOptions.value.target = shallowRef(
//     defineAsyncComponent(() => import(`./hazardResultExcelUpload.vue`))
//   )
//   popupOptions.value.isFull = true
//   popupOptions.value.width = '90%'
//   popupOptions.value.visible = true
//   popupOptions.value.closeCallback = closeExcelUploadPopup
// }
// function closeExcelUploadPopup(_result: any, plantCd: any) {
//   popupOptions.value.target = null
//   popupOptions.value.visible = false
//   if (_result && _result.length > 0) {
//     const s_data = _.filter(_result, (item) => {
//       return !item.error_message
//     })
//     _.forEach(s_data, (item) => {
//       item.regUserId = user.value.userId // 등록자 ID
//       item.chgUserId = user.value.userId // 수정자 ID
//       item.departmentUserId = user.value.userId
//       item.plantCd = plantCd
//       item.editFlag = 'C'
//     })
//     $http({
//       url: transactionConfig.sop.hhm.hazard.check.uploadSave.url,
//       method: 'POST',
//       data: s_data
//     }).then(() => {
//       message.requestSuccess()
//       getList()
//     })
//   }
// }

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
