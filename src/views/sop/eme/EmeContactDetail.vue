<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-card title="응급상황 대응 정보" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn
                  v-if="editable && popupParam.emeConcactId"
                  label="삭제"
                  icon="delete_forever"
                  @btnClicked="removeData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="emeData"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-3col-lg-3 col-xl-3">
                <c-plant
                  required
                  type="edit"
                  name="plantCd"
                  v-model:value="emeData.plantCd"
                  :editable="editable"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-table
                  ref="table"
                  title="연락망"
                  :columnSetting="false"
                  :isFullScreen="false"
                  :usePaging="false"
                  :filtering="false"
                  :isExcelDown="false"
                  :columns="grid.columns"
                  :data="emeData.networks"
                  gridHeight="260px"
                  selection="multiple"
                  rowKey="emeConcactNetworkId"
                  :editable="editable"
                >
                  <template v-slot:table-button>
                    <q-btn-group outline>
                      <c-btn label="추가" icon="add" @btnClicked="addrow" v-if="editable" />
                      <c-btn label="삭제" icon="remove" @btnClicked="removeRow" v-if="editable" />
                    </q-btn-group>
                  </template>
                </c-table>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-textarea
                  :editable="editable"
                  type="editor"
                  label="초기 대응법"
                  name="remark"
                  :editheight="20"
                  v-model:value="emeData.remark"
                />
              </div>
              <div
                class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                style="margin-top: 20px"
              >
                <c-upload :attachInfo="attachInfo" :editable="editable" label="첨부파일" />
              </div>
            </template>
          </c-card>
        </div>
      </div>
    </q-form>
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
  name: 'EmeContactDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

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
    emeConcactId: stringNull
  }
}

interface gridType {
  columns: tableColumnType
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
      emeConcactId: ''
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
const editable = ref(true)
const table = ref<any>(null)
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'EME_CONTACT',
  taskKey: ''
})
const emeData = ref<any>({
  plantCd: null,
  emeConcactId: '',
  remark: '',
  networks: []
})
const grid = ref<gridType>({
  columns: []
})
const saveUrl = ref('')
const mappingType = ref('POST')
const insertUrl = ref('')
const updateUrl = ref('')
const deleteUrl = ref('')
const qListUrl = ref('')
const qDeleteUrl = ref('')
const checkUrl = ref('')
const detailUrl = ref('')
const isSave = ref(false)
const updateMode = ref(false)
const editForm = ref<any>(null)

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
  detailUrl.value = selectConfig.sop.eme.contact.get.url
  checkUrl.value = selectConfig.sop.eme.contact.check.url
  saveUrl.value = transactionConfig.sop.eme.contact.insert.url
  insertUrl.value = transactionConfig.sop.eme.contact.insert.url
  updateUrl.value = transactionConfig.sop.eme.contact.update.url
  deleteUrl.value = transactionConfig.sop.eme.contact.delete.url
  qListUrl.value = selectConfig.sop.eme.contact.networks.url
  qDeleteUrl.value = transactionConfig.sop.eme.network.delete.url
  // code setting
  // list setting
  getDetail()
}
function getDetail() {
  getComboItems('EME_CONTACT_TYPE_CD').then((_result) => {
    grid.value.columns = []
    grid.value.columns.push(
      {
        required: true,
        name: 'emeConcactTypeCd',
        field: 'emeConcactTypeCd',
        label: '연락처 유형',
        align: 'center',
        type: 'select',
        comboItems: _result,
        style: 'width:25%',
        sortable: false
      },
      {
        required: true,
        name: 'contactNm',
        field: 'contactNm',
        label: '연락처 명',
        align: 'center',
        type: 'text',
        style: 'width:40%',
        sortable: false
      },
      {
        required: true,
        name: 'contactNo',
        field: 'contactNo',
        label: '연락처',
        align: 'center',
        type: 'text',
        sortable: false
      }
    )

    if (props.popupParam.emeConcactId) {
      $http({
        url: detailUrl.value,
        method: 'GET',
        params: { emeConcactId: props.popupParam.emeConcactId }
      }).then((_result: any) => {
        emeData.value = _result.data
        updateMode.value = true
        emits('setRegInfo', emeData.value)
        attachInfo.value.taskKey = props.popupParam.emeConcactId
      })
    }
  })
}
function saveData() {
  if (props.popupParam.emeConcactId) {
    saveUrl.value = updateUrl.value
    mappingType.value = 'PUT'
  } else {
    saveUrl.value = insertUrl.value
    mappingType.value = 'POST'
  }
  editForm.value.validate().then((_result1: boolean) => {
    if (_result1 && validTable(grid.value.columns, emeData.value.networks)) {
      $http({
        url: $format(checkUrl.value, emeData.value.plantCd),
        method: 'GET'
      }).then((_result: any) => {
        if (updateMode.value || _result.data == 0) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              emeData.value.regUserId = user.value.userId
              emeData.value.chgUserId = user.value.userId
              isSave.value = !isSave.value
            },
            // 취소 callback 함수
            cancelCallback: () => {}
          })
        } else {
          message.alert({
            title: '안내',
            message: '동일한 사업장에 데이터가 존재합니다.', // 동일한 사업장에 데이터가 존재합니다.
            type: 'warning' // success / info / warning / error
          })
          return
        }
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.emeConcactId = result.data
  getDetail()
}
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.emeConcactId),
        method: 'DELETE'
      }).then(() => {
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
function addrow() {
  emeData.value.networks.push({
    editFlag: 'C',
    emeConcactId: props.popupParam.emeConcactId,
    emeConcactNetworkId: uid(),
    emeConcactTypeCd: null,
    contactNm: '',
    contactNo: ''
  })
}
function removeRow() {
  const selectData = table.value.getSelected()
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
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: qDeleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            emeData.value.networks = _.reject(emeData.value.networks, item)
          })
          table.value.compoTable.clearSelection()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
