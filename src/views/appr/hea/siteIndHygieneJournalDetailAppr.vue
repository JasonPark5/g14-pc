<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="현장 산업위생 일지 기본정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-show="editable && !disabled"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="journal"
                  :mappingType="saveType"
                  label="저장"
                  icon="save"
                  @beforeAction="savePlan"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-plant
                  required
                  :editable="editable"
                  :disabled="disabled"
                  type="edit"
                  name="plantCd"
                  v-model:value="journal.plantCd"
                  @datachange="datachange"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-datepicker
                  required
                  :editable="editable"
                  :disabled="disabled"
                  label="점검일"
                  type="date"
                  name="hygieneJournalCheckDate"
                  v-model:value="journal.hygieneJournalCheckDate"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="점검명"
                  name="indHygieneJournalName"
                  v-model:value="journal.indHygieneJournalName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-text
                  :editable="editable"
                  :disabled="disabled"
                  label="현장"
                  name="indHygieneJournalLocation"
                  v-model:value="journal.indHygieneJournalLocation"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
                <c-field
                  :required="true"
                  :editable="editable"
                  :disabled="disabled"
                  :data="journal"
                  :plantCd="journal.plantCd"
                  type="dept_user"
                  label="점검자"
                  name="checkUserId"
                  v-model:value="journal.checkUserId"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-table
            ref="table"
            title="항목별 결과 목록"
            :columns="grid.columns"
            :gridHeight="gridHeight"
            :data="journal.results"
            :editable="editable && !disabled"
            :filtering="false"
            :columnSetting="false"
            :usePaging="false"
            :hideBottom="true"
            :isExcelDown="false"
            :noDataLabel="$language('항목별 결과 추가하세요.')"
            rowKey="hygieneJournalResultId"
            selection="multiple"
          >
            <template v-slot:table-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && !disabled"
                  :showLoading="false"
                  label="추가"
                  icon="add"
                  @btnClicked="addResult"
                />
                <c-btn
                  v-if="editable && journal.results.length > 0 && !disabled"
                  :showLoading="false"
                  label="제외"
                  icon="remove"
                  @btnClicked="removeResult"
                />
              </q-btn-group>
            </template>
          </c-table>
        </div>
      </div>
    </q-form>
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
import { siteIndHygieneJournalType } from '@/views/hea/sih/siteIndHygieneType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'siteIndHygieneJournalDetailAppr'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const message = useMessageStore()

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['setRegInfo', 'closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    indHygieneJournalId: stringNull
  }
  contentHeight?: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<siteIndHygieneJournalType>
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
      indHygieneJournalId: ''
    }
  },
  contentHeight: null
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  width: '90%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: null
})
const journal = ref<siteIndHygieneJournalType>({
  indHygieneJournalId: '',
  plantCd: '',
  indHygieneJournalName: '',
  indHygieneJournalLocation: '',
  hygieneJournalCheckDate: '',
  checkUserId: '',
  regUserId: '',
  chgUserId: '',
  results: [],
  deleteResults: [],
  sysApprovalRequestId: ''
})
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      name: 'siteHygieneTypeCd',
      field: 'siteHygieneTypeCd',
      label: '구분',
      align: 'center',
      style: 'width:100px',
      type: 'select',
      codeGroupCd: 'SITE_HYGIENE_TYPE_CD',
      setHeader: true,
      sortable: false
    },
    {
      required: true,
      name: 'hygieneItemName',
      field: 'hygieneItemName',
      label: '점검항목',
      align: 'left',
      type: 'textarea',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'checkContents',
      field: 'checkContents',
      label: '점검결과',
      align: 'left',
      type: 'textarea',
      style: 'width:300px',
      setHeader: true,
      sortable: false
    },
    {
      name: 'attach',
      field: 'attach',
      label: '관련 파일첨부',
      align: 'center',
      style: 'width:200px',
      type: 'attach',
      taskClassCd: 'SITE_IND_HYGIENE_JOURNAL',
      keyText: 'hygieneJournalResultId',
      sortable: false
    }
  ],
  data: []
})
const editForm = ref<HTMLFormElement | null>(null)
const table = ref<any>(null)
const isSave = ref(false)
const saveType = ref('POST')
const detailUrl = ref('')
const resultItemUrl = ref('')
const updateUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const gridHeight = computed(() => {
  let height =
    props.contentHeight && !Number.isNaN(props.contentHeight)
      ? Number(props.contentHeight) - 250
      : 600
  if (height < 600) {
    height = 600
  }
  return `${String(height)}px`
})
const isOld = computed(() => Boolean(props.popupParam.indHygieneJournalId))
const disabled = computed(() => Boolean(journal.value.sysApprovalRequestId))

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
  detailUrl.value = selectConfig.hea.sih.check.get.url
  resultItemUrl.value = selectConfig.hea.sih.item.list.url
  saveUrl.value = transactionConfig.hea.sih.check.insert.url
  updateUrl.value = transactionConfig.hea.sih.check.update.url
  deleteUrl.value = transactionConfig.hea.sih.check.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
const getDetail = () => {
  if (isOld.value) {
    $http({
      url: $format(detailUrl.value, props.popupParam.indHygieneJournalId),
      method: 'GET'
    }).then((_result: any) => {
      _.extend(journal.value, _result.data)
      emits('setRegInfo', _result.data)
    })
  } else {
    journal.value.hygieneJournalCheckDate = getToday()
    journal.value.indHygieneJournalName = `${journal.value.hygieneJournalCheckDate} 현장 산업위생 일지`

    $http({
      url: resultItemUrl.value,
      method: 'GET',
      params: {
        plantCd: user.value.plantCd,
        useFlag: 'Y'
      }
    }).then((_result: any) => {
      _.forEach(_result.data, (_item) => {
        journal.value.results.push({
          indHygieneJournalId: '',
          hygieneJournalResultId: uid(),
          siteHygieneTypeCd: _item.siteHygieneTypeCd,
          hygieneItemName: _item.hygieneItemName,
          checkContents: '',
          regUserId: user.value.userId,
          editFlag: 'C'
        })
      })
    })
  }
}
// /******************************
//  * TODO (목적): 사업장 콤보 박스 변경
//  *******************************/
// const datachange = (data: any) => {
//   message.confirm({
//     title: '확인',
//     message: '점검항목이 변경됩니다.\n진행하시겠습니까?',
//     type: 'info', // success / info / warning / error
//     // 확인 callback 함수
//     confirmCallback: () => {
//       journal.value.results = []

//       if (!data.value) return
//       $http({
//         url: resultItemUrl.value,
//         method: 'GET',
//         params: {
//           plantCd: data.value,
//           useFlag: 'Y'
//         }
//       }).then((_result: any) => {
//         grid.value.data = _result.data
//         _.forEach(_result.data, (_item) => {
//           journal.value.results.push({
//             indHygieneJournalId: props.popupParam.indHygieneJournalId,
//             hygieneJournalResultId: uid(),
//             hygieneItemName: _item.hygieneItemName,
//             siteHygieneTypeCd: 'SHTC000006',
//             checkContents: '',
//             regUserId: user.value.userId,
//             editFlag: 'C'
//           })
//         })
//       })
//     },
//     // 취소 callback 함수
//     cancelCallback: () => {}
//   })
// }
/******************************
 * TODO (목적): 그리드 행(항목별 결과 목록) 추가
 *******************************/
const addResult = () => {
  const addRowData = {
    indHygieneJournalId: props.popupParam.indHygieneJournalId,
    hygieneJournalResultId: uid(),
    siteHygieneTypeCd: 'SHTC000006',
    hygieneItemName: '',
    checkContents: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  }
  journal.value.results.unshift(addRowData)
  setGridData(journal.value, journal.value.results, 'results')
}
/******************************
 * TODO (목적): 그리드 행(항목별 결과 목록) 삭제
 *******************************/
const removeResult = () => {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item: any) => {
      if (!journal.value.deleteResults) journal.value.deleteResults = []
      if (
        _.findIndex(journal.value.deleteResults, {
          hygieneJournalResultId: item.hygieneJournalResultId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        journal.value.deleteResults.push(item)
      }
      journal.value.results = _.reject(journal.value.results, item)
    })
  }
}
const savePlan = () => {
  if (isOld.value) {
    saveUrl.value = transactionConfig.hea.sih.check.update.url
    saveType.value = 'PUT'
  } else {
    saveUrl.value = transactionConfig.hea.sih.check.insert.url
    saveType.value = 'POST'
  }
  editForm.value?.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          journal.value.regUserId = user.value.userId
          journal.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        // 취소 callback 함수
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
const saveCallback = (_result: any) => {
  message.requestSuccess()
  if (!isOld.value) {
    props.popupParam.indHygieneJournalId = _result.data
  }
  getDetail()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
