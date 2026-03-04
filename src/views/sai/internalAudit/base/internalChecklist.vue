<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-table
        ref="systemTable"
        title="시스템요소 목록"
        :columns="systemGrid.columns"
        :data="systemGrid.data"
        :columnSetting="false"
        :isFullScreen="false"
        :usePaging="false"
        :isExcelDown="false"
        :filtering="true"
        @innerBtnClicked="(col: any, props: any) => getChecklist(props.row)"
      >
        <template v-slot:table-chip>
          <c-radio
            :comboItems="[
              { code: 'Y', codeName: $language('사용') },
              { code: 'N', codeName: $language('미사용') },
              { code: null, codeName: $language('전체') }
            ]"
            class="no-label-control q-ml-sm"
            dense
            name="useFlag"
            v-model:value="searchParam.useFlag"
            @input="getSystems"
          />
        </template>
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable" label="엑셀업로드" icon="upload" @btnClicked="excelUploadData" />
            <c-btn v-if="editable" icon="add" @btnClicked="addRowSystem" />
            <c-btn
              v-if="editable"
              :isSubmit="isSaveSystem"
              :url="saveSystemUrl"
              :param="systemGrid.data"
              mappingType="PUT"
              icon="save"
              @beforeAction="saveSystem"
              @btnCallback="saveSystemCallback"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
      <c-table
        ref="checkTable"
        title="체크리스트 항목 목록"
        :columnSetting="false"
        :isFullScreen="false"
        :isExcelDown="false"
        :usePaging="false"
        :columns="checkGrid.columns"
        :data="checkGrid.data"
      >
        <!-- selection="multiple"
          rowKey="saiInternalAuditChecklistId" -->
        <template v-slot:table-chip>
          <q-chip v-if="selectedRow" size="md" outline square dense color="primary">
            {{ selectedRow.systemElementsName }}
          </q-chip>
        </template>
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn v-if="editable && selectedRow" label="추가" icon="add" @btnClicked="addCheck" />
            <!-- <c-btn v-if="editable && selectedRow" label="삭제" icon="remove" @btnClicked="deleteCheck" /> -->
            <c-btn
              v-if="editable && selectedRow"
              label="저장"
              icon="save"
              @btnClicked="saveCheck"
            />
          </q-btn-group>
        </template>
      </c-table>
    </div>
  </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'internalChecklist'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  merge?: Array<tableMergeType>
  columns: Array<tableColumnType>
  data?: Array<any>
  height?: stringNull
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '40%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  saiInternalAuditClassCd: null,
  useFlag: 'Y',
  targetDeptCd: ''
})
const systemGrid = ref<gridType>({
  columns: [
    // {
    //   name: 'plantCd',
    //   field: 'plantCd',
    //   label: '사업장',
    //   align: 'center',
    //   sortable: true,
    //   required: true,
    //   style: 'width:80px',
    //   type: 'plant'
    // },
    // {
    //   required: true,
    //   name: 'saiInternalAuditClassCd',
    //   field: 'saiInternalAuditClassCd',
    //   label: 'ISO 구분',
    //   align: 'center',
    //   style: 'width:80px',
    //   type: 'select',
    //   codeGroupCd: 'SAI_INTERNAL_AUDIT_CLASS_CD',
    //   sortable: false
    // },
    // {
    //   name: 'targetDeptName',
    //   field: 'targetDeptName',
    //   label: '피심사부서',
    //   align: 'left',
    //   style: 'width:200px',
    //   sortable: false,
    //   type: 'deptMulti',
    //   deptCd: 'targetDeptCd',
    //   isFirstValue: false
    // },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:40px',
      sortable: true,
      type: 'number'
    },
    {
      required: true,
      name: 'systemElementsName',
      field: 'systemElementsName',
      label: '시스템요소',
      align: 'left',
      style: 'width:20%',
      type: 'text',
      sortable: false
    },
    {
      name: 'requirement',
      field: 'requirement',
      label: '요구사항',
      align: 'left',
      style: 'width:60%',
      type: 'textarea',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:50px',
      type: 'check',
      true: 'Y',
      false: 'N',
      sortable: false
    },
    {
      name: 'customCol',
      field: 'customCol',
      label: '항목',
      align: 'center',
      style: 'width:40px',
      type: 'detail',
      sortable: false
    }
  ],
  data: []
})
const checkGrid = ref<gridType>({
  columns: [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      type: 'number',
      align: 'center',
      style: 'width:40px',
      sortable: true
    },
    {
      required: true,
      name: 'itemName',
      field: 'itemName',
      label: '점검항목',
      align: 'left',
      sortable: true,
      type: 'textarea'
    },
    {
      name: 'aimMatter',
      field: 'aimMatter',
      label: '관련절차',
      align: 'left',
      sortable: true,
      style: 'width:160px',
      type: 'text'
    },
    {
      name: 'evidence',
      field: 'evidence',
      label: '증빙자료',
      align: 'left',
      sortable: true,
      style: 'width:160px',
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      type: 'check',
      sortable: true,
      align: 'center',
      style: 'width:60px',
      true: 'Y',
      false: 'N'
    }
  ],
  data: []
})
const editable = ref(true)
const isSaveSystem = ref(false)
const listSystemUrl = ref('')
const saveSystemUrl = ref('')
const excelSystemUrl = ref('')
const listCheckUrl = ref('')
const detailCheckUrl = ref('')
const saveCheckUrl = ref('')
const selectedRow = ref({
  saiInternalAuditChecklistSystemId: null,
  systemElementsName: ''
})
const useFlagItems = ref<Array<codeMasterType>>([])
const systemTable = ref<any>(null)
const checkTable = ref<any>(null)

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
  listSystemUrl.value = selectConfig.sai.internal.base.systemChecklist.list.url
  saveSystemUrl.value = transactionConfig.sai.internal.base.systemChecklist.save.url
  excelSystemUrl.value = transactionConfig.sai.internal.base.systemChecklist.excel.url
  listCheckUrl.value = selectConfig.sai.internal.base.checklist.list.url
  detailCheckUrl.value = selectConfig.sai.internal.base.checklist.get.url
  saveCheckUrl.value = transactionConfig.sai.internal.base.checklist.update.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list settin
  getSystems()
  // console.log(checkTable.value?.$el?.offsetWidth)
}
/******************************
 * TODO (목적): 좌측 시스템요소 조회
 *******************************/
function getSystems() {
  checkGrid.value.data = []
  $http({
    url: listSystemUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    systemGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 우측 체크리스트 조회
 *******************************/
function getChecklist(row?: any) {
  selectedRow.value = row
  $http({
    url: listCheckUrl.value,
    method: 'GET',
    params: { saiInternalAuditChecklistSystemId: row.saiInternalAuditChecklistSystemId }
  }).then((_result: any) => {
    checkGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 좌측 시스템요소 행 추가
 *******************************/
function addRowSystem() {
  systemGrid.value.data?.splice(0, 0, {
    saiInternalAuditChecklistSystemId: uid(), // 내부감사 체크리스트 시스템 요소 일련번호
    // plantCd: null, // 사업장코드
    // saiInternalAuditClassCd: null, // ISO 구분
    systemElementsName: '', // 시스템 요소
    targetDeptCd: '',
    useFlag: 'Y', // 사용여부
    sortOrder: 0, // 순번
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
/******************************
 * TODO (목적): 우측 체크리스트 행 추가
 *******************************/
function addCheck() {
  checkGrid.value.data?.push({
    saiInternalAuditChecklistId: uid(), // 내부감사 체크리스트 항목 일련번호
    saiInternalAuditChecklistSystemId: selectedRow.value.saiInternalAuditChecklistSystemId, // 내부감사 체크리스트 시스템 요소 일련번호
    itemName: '', // 내부심사 항목
    aimMatter: '', // 내부심사 시 착안 사항
    useFlag: 'Y', // 사용여부
    sortOrder: checkGrid.value.data?.length + 1, // 순번
    regUserId: '', // 등록자 ID
    chgUserId: '', // 수정자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 좌측 시스템요소 저장
 *******************************/
function saveSystem() {
  if (systemGrid.value.data && validTable(systemGrid.value.columns, systemGrid.value.data)) {
    _.forEach(systemGrid.value.data, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId

      let splitTargetDept = []
      const targetDeptCdArray: any = []
      if (item.targetDeptCd && item.targetDeptCd.length > 0) {
        splitTargetDept = item.targetDeptCd.split(',')

        _.forEach(splitTargetDept, (_item) => {
          targetDeptCdArray.push({
            saiInternalAuditChecklistSystemId: '',
            deptCd: _item
          })
        })
      }
      item.targetDeptCdArray = targetDeptCdArray
    })

    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info',
      confirmCallback: () => {
        isSaveSystem.value = !isSaveSystem.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveSystemCallback() {
  message.requestSuccess()
  getSystems()
}
/******************************
 * TODO (목적): 우측 체크리스트 저장
 *******************************/
function saveCheck() {
  if (checkGrid.value.data && validTable(checkGrid.value.columns, checkGrid.value.data)) {
    const saveData = checkGrid.value.data.filter((x) => x.editFlag == 'C' || x.editFlag == 'U')
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: saveCheckUrl.value,
            method: 'POST',
            data: saveData
          }).then(() => {
            getChecklist(selectedRow.value)
            message.requestSuccess()
          })
        },
        cancelCallback: () => {}
      })
    } else {
      message.alert({
        title: '안내',
        message: '변경된 데이터가 없습니다.',
        type: 'info' // success / info / warning / error
      })
    }
  }
}
// /******************************
//  * TODO (목적): 우측 체크리스트 삭제
//  *******************************/
// function deleteCheck() {
//   const selectData = checkTable.value.getSelected()
//   if (!selectData || selectData.length === 0) {
//     message.alert({
//       title: '안내',
//       message: '선택된 항목이 없습니다.',
//       type: 'warning' // success / info / warning / error
//     })
//   } else {
//     message.confirm({
//       title: '확인',
//       message: '삭제하시겠습니까?',
//       type: 'warning', // success / info / warning / error
//       confirmCallback: () => {
//         $http({
//           url: saveCheckUrl.value,
//           method: 'DELETE',
//           data: Object.values(selectData)
//         }).then((_result: any) => {
//           message.requestSuccess()
//           _.forEach(selectData, (item) => {
//             checkGrid.value.data = _.reject(checkGrid.value.data, item)
//           })
//           checkTable.value.compoTable.clearSelection()
//         })
//       },
//       cancelCallback: () => {}
//     })
//   }
// }
/******************************
 * TODO (목적): 엑셀 업로드
 *******************************/
function excelUploadData() {
  popupOptions.value.title = '내부심사 체크리스트 업로드'
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./internalChecklistExcelUpload.vue`))
  )
  popupOptions.value.isFull = true
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeExcelUploadPopup
}
function closeExcelUploadPopup(_result: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_result && _result.length > 0) {
    const s_data = _.filter(_result, (item: any) => !item.error_message)
    const groupedMst: Record<string, any> = {}

    _.forEach(s_data, (item) => {
      const sysKey = item.systemElementsName?.replace(/\s+/g, '') // 공백 제거 키
      if (!groupedMst[sysKey]) {
        groupedMst[sysKey] = {
          saiInternalAuditChecklistSystemId: uid(),
          systemElementsName: item.systemElementsName,
          requirement: item.requirement,
          useFlag: 'Y',
          sortOrder: item.msortOrder,
          editFlag: 'C',
          regUserId: user.value.userId,
          items: []
        }
      }
      groupedMst[sysKey].items.push({
        saiInternalAuditChecklistId: uid(),
        saiInternalAuditChecklistSystemId: groupedMst[sysKey].saiInternalAuditChecklistSystemId,
        itemName: item.itemName,
        aimMatter: item.aimMatter,
        evidence: item.evidence,
        useFlag: 'Y',
        editFlag: 'C',
        sortOrder: item.sortOrder,
        regUserId: user.value.userId
      })
    })
    const finalData = _.values(groupedMst) // 객체를 배열로 변환하여 전송
    $http({
      url: excelSystemUrl.value,
      method: 'POST',
      data: finalData
    }).then(() => {
      message.requestSuccess()
      getSystems()
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
