<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            label="설비"
            type="search"
            name="equipmentCd"
            :customPopupParam="{ targetKey: 'equip' }"
            v-model:value="searchParam.equipmentCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            label="점검년월(예정, 완료)"
            name="month"
            type="month"
            v-model:value="searchParam.month"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            codeGroupCd="MDM_CHECK_KIND_CD"
            itemText="codeName"
            itemValue="code"
            name="equipmentCheckKindCd"
            label="점검유형"
            v-model:value="searchParam.equipmentCheckKindCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            type="search"
            stepperGrpCd="MIM_CHECK_STATUS_CD"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            name="checkStatusCd"
            label="진행상태"
            v-model:value="searchParam.checkStatusCd"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="설비점검 목록"
      :columns="grid.columns"
      :data="grid.data"
      :merge="grid.merge"
      :checkClickFlag="false"
      selection="multiple"
      rowKey="minEquipmentCheckId"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="계획등록" v-if="editable" icon="add" @btnClicked="onItemClick('A')" />
          <c-btn label="결과등록" v-if="editable" icon="add" @btnClicked="onItemClick('B')" />
          <c-btn label="무계획결과등록" v-if="editable" icon="add" @btnClicked="onItemClick('C')" />
          <c-btn label="삭제" v-if="editable" icon="delete_forever" @btnClicked="remove" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props }">
        <template v-if="props.row['checkStatusCd']">
          <q-chip
            outline
            square
            :color="setTagColor(props.row.checkStatusCd)"
            :class="
              props.row.checkStatusCd === 'MCSC000020'
                ? 'full-size-chip checkStatusCd-blinking'
                : 'full-size-chip'
            "
          >
            <q-icon
              v-if="props.row.checkStatusCd === 'MCSC000020'"
              name="alarm"
              style="margin-right: 5px"
            />
            {{ setTagName(props.row.checkStatusCd) }}
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
  name: 'equipmentInspection'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()

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
// interface propType {
//   popupParam: mainPopupParamType
// }
// interface mainPopupParamType {
//   equipmentTypeCd: stringNull
//   grade: stringNull
//   inspectionCycleCd: stringNull
// }
interface searchParamType {
  plantCd: stringNull
  equipmentCheckKindCd: stringNull
  checkStatusCd: stringNull
  startYmd: stringNull
  endYmd: stringNull
  noPlanResultEnrollFlag: stringNull
  equipmentTypeCd: stringNull
  inspectionCycleCd: stringNull
  grade: stringNull
  equipmentCd: stringNull
  month: stringNull
}
/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
// const props = withDefaults(defineProps<propType>(), {
//   popupParam: () => {
//     return {
//       equipmentTypeCd: '',
//       grade: '',
//       inspectionCycleCd: ''
//     }
//   }
// })

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
  equipmentCheckKindCd: null,
  checkStatusCd: null,
  startYmd: '',
  endYmd: '',
  noPlanResultEnrollFlag: null,
  equipmentTypeCd: '',
  inspectionCycleCd: '',
  grade: '',
  equipmentCd: '',
  month: ''
})
const grid = ref<any>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      style: 'width:100px',
      label: '사업장',
      align: 'center',
      sortable: false
    },
    {
      name: 'equipmentCdName',
      field: 'equipmentCdName',
      style: 'width:180px',
      label: '설비명 (관리번호)',
      align: 'center',
      sortable: false,
      type: 'link'
    },
    {
      name: 'checkStatusCd',
      field: 'checkStatusCd',
      label: '진행상태',
      style: 'width:80px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkScheduleDate',
      field: 'checkScheduleDate',
      label: '점검예정일',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkScheduleUserName',
      field: 'checkScheduleUserName',
      style: 'width:100px',
      label: '점검예정자',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkDeptName',
      field: 'checkDeptName',
      style: 'width:100px',
      label: '점검부서',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkDate',
      field: 'checkDate',
      style: 'width:100px',
      label: '점검완료일',
      align: 'center',
      sortable: false
    },
    {
      name: 'checkResultName',
      field: 'checkResultName',
      style: 'width:80px',
      label: '점검결과',
      align: 'center',
      sortable: false
    },
    {
      name: 'equipmentCheckKindNm',
      field: 'equipmentCheckKindNm',
      label: '점검유형',
      style: 'width:100px',
      align: 'center',
      sortable: false
    },
    {
      name: 'inspectionCycleName',
      field: 'inspectionCycleName',
      label: '점검주기',
      style: 'width:80px',
      align: 'center',
      sortable: false
    },
    {
      name: 'relatedLawsName',
      field: 'relatedLawsName',
      label: '관련법규',
      style: 'width:250px',
      align: 'left',
      sortable: false
    },
    {
      name: 'noPlanName',
      field: 'noPlanName',
      label: '계획/무계획',
      style: 'width:80px',
      align: 'center',
      sortable: false
    }
  ],
  data: []
})
const period = ref(['', ''])
const colorItems = ref<stepMasterType>([])
const listUrl = ref('')
const deleteUrl = ref('')
const table = ref<any>(null)
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
  listUrl.value = selectConfig.sop.min.equipment.plan.list.url
  deleteUrl.value = transactionConfig.sop.min.equipment.result.delete.url
  // code setting
  colorItems.value = [
    { stepperMstCd: '', stepperMstNm: $language('작성중'), colorClass: 'gray-6' },
    { stepperMstCd: 'MCSC000005', stepperMstNm: $language('계획수립'), colorClass: 'blue' },
    { stepperMstCd: 'MCSC000010', stepperMstNm: $language('점검중'), colorClass: 'orange' },
    { stepperMstCd: 'MCSC000015', stepperMstNm: $language('점검완료'), colorClass: 'green' },
    { stepperMstCd: 'MCSC000020', stepperMstNm: $language('지연'), colorClass: 'red' }
  ]
  // if (props.popupParam.equipmentTypeCd) {
  //   searchParam.value.equipmentTypeCd = props.popupParam.equipmentTypeCd
  //   searchParam.value.inspectionCycleCd = props.popupParam.inspectionCycleCd
  //   searchParam.value.grade = props.popupParam.grade
  // }
  // list setting
  getList()
}
/******************************
 * TODO (목적): 설비계획 및 결과 조회
 *******************************/
function getList() {
  searchParam.value.startYmd = period.value[0]
  searchParam.value.endYmd = period.value[1]
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 설비계획 및 결과 상세 조회
 *******************************/
/* eslint-disable no-unused-vars */
function linkClick(row: any) {
  popupOptions.value.title = '설비점검결과 상세'
  popupOptions.value.param = {
    minEquipmentCheckId: row.minEquipmentCheckId ? row.minEquipmentCheckId : '',
    title: '설비점검결과',
    selectData: [],
    noPlan: 'N'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./equipmentResultDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 설비계획 및 결과 등록
 *******************************/
function onItemClick(data: any) {
  const selectData = table.value.getSelected()
  if (data === 'B' || data === 'E') {
    if (selectData && selectData.length === 0) {
      message.alert({
        title: '안내',
        message: '선택된 항목이 없습니다.',
        type: 'warning'
      })
      return
    }
  }
  let title = ''
  let param = null

  if (data === 'A') {
    param = {
      title: '설비점검계획',
      selectData: []
    }
    title = '설비점검계획 상세'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./equipmentPlan.vue`))
    )
    popupOptions.value.width = '95%'
    popupOptions.value.isFull = false
  }
  if (data === 'B') {
    param = {
      title: '설비점검결과',
      noPlan: 'N',
      multiple: true,
      selectData: selectData ? selectData : []
    }
    title = '설비점검결과 상세'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./equipmentResultDetail.vue`))
    )
    popupOptions.value.isFull = true
  }
  if (data === 'C') {
    param = {
      title: '무계획결과',
      noPlan: 'Y',
      minEquipmentCheckId: ''
    }
    title = '무계획 점검 결과 상세'
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./equipmentResult.vue`))
    )
    popupOptions.value.isFull = true
  }
  popupOptions.value.title = title
  popupOptions.value.param = param
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 설비계획 및 결과 삭제
 *******************************/
function remove() {
  let selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        selectData = _.reject(selectData, { checkStatusCd: 'MCSC000015' })
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, {
              minEquipmentCheckId: item.minEquipmentCheckId
            })
          })
          message.requestSuccess()
          getList()
        })
      },
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): 설비계획 및 결과 상세 닫기 콜백
 *******************************/
function closePopup(type: string) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  table.value.setSelected([])
  if (type === 'COMPLETE' || type === 'SAVE') {
    message.requestSuccess()
  }
  getList()
}
/******************************
 * TODO (목적): 진행상태 Tag 색 지정
 *******************************/
function setTagColor(data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { stepperMstCd: data })
    return color ? color.attrVal1 || color.colorClass : ''
  } else {
    return ''
  }
}
/******************************
 * TODO (목적): 진행상태 Tag 색 이름 지정
 *******************************/
function setTagName(data: any) {
  if (colorItems.value) {
    const color =
      _.find(colorItems.value, { code: data }) || _.find(colorItems.value, { stepperMstCd: data })
    return color ? color.codeName || color.stepperMstNm : ''
  } else {
    return ''
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style>
.checkStatusCd-blinking {
  -webkit-animation: checkStatusCd-blink 2s ease-in-out infinite alternate;
  -moz-animation: checkStatusCd-blink 2s ease-in-out infinite alternate;
  animation: checkStatusCd-blink 2s ease-in-out infinite alternate;
}
@-webkit-keyframes checkStatusCd-blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes checkStatusCd-blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes checkStatusCd-blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
