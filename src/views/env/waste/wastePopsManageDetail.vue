<template>
  <div class="row">
    <div class="col-md-12 col-lg-12">
      <q-form ref="editForm">
        <c-card title="잔류성유기오염물질 관리대상기기 기본정보" class="cardClassDetailForm">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable"
                :url="saveUrl"
                :isSubmit="isSave"
                :param="wastePopsData"
                :mappingType="mappingType"
                label="저장"
                icon="save"
                @beforeAction="saveInfo"
                @btnCallback="saveCallback"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :required="true"
                :editable="editable"
                label="행정번호"
                name="administrationNo"
                v-model:value="wastePopsData.administrationNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :required="true"
                :editable="editable"
                label="제조번호"
                name="lotNo"
                v-model:value="wastePopsData.lotNo"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-select
                :required="true"
                :editable="editable"
                type="edit"
                codeGroupCd="ENV_POPS_TYPE_CD"
                itemText="codeName"
                itemValue="code"
                name="envPopsTypeCd"
                label="종류"
                v-model:value="wastePopsData.envPopsTypeCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-select
                :required="true"
                :editable="editable"
                type="edit"
                codeGroupCd="ENV_POPS_COMPANY_CD"
                itemText="codeName"
                itemValue="code"
                name="envPopsCopmpanyCd"
                label="제조사"
                v-model:value="wastePopsData.envPopsCopmpanyCd"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                :required="true"
                type="month"
                :editable="editable"
                label="제조년월일"
                name="lotDt"
                v-model:value="wastePopsData.lotDt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :required="true"
                :editable="editable"
                label="용량(kVA)"
                name="envPopsVolumne"
                v-model:value="wastePopsData.envPopsVolumne"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :required="true"
                :editable="editable"
                label="총중량(ton)"
                name="envPopsGrossWeight"
                v-model:value="wastePopsData.envPopsGrossWeight"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-text
                :required="true"
                :editable="editable"
                label="절연유량(kℓ)"
                name="envPopsInsulationFlow"
                v-model:value="wastePopsData.envPopsInsulationFlow"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                type="date"
                :editable="editable"
                label="절연유 교체 년월일(1차)"
                name="firstInsulationOilChangeDt"
                v-model:value="wastePopsData.firstInsulationOilChangeDt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                type="date"
                :editable="editable"
                label="절연유 교체 년월일(2차)"
                name="secondInsulationOilChangeDt"
                v-model:value="wastePopsData.secondInsulationOilChangeDt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                type="date"
                :editable="editable"
                label="절연유 교체 년월일(3차)"
                name="thirdInsulationOilChangeDt"
                v-model:value="wastePopsData.thirdInsulationOilChangeDt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
              <c-datepicker
                type="date"
                :editable="editable"
                label="폐기매매년월일"
                name="disposalSaleDt"
                v-model:value="wastePopsData.disposalSaleDt"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <c-text
                :editable="editable"
                label="비고"
                name="comment"
                v-model:value="wastePopsData.comment"
              />
            </div>
          </template>
        </c-card>

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-table
              ref="measTable"
              title="시험분석이력"
              :columns="grid.columns"
              :gridHeight="grid.height"
              :data="wastePopsData.wastePopsTestHistory"
              :filtering="false"
              :columnSetting="false"
              :isExcelDown="false"
              :usePaging="false"
              :editable="editable"
              selection="multiple"
              rowKey="envWastePopsTestId"
            >
              <template v-slot:table-button>
                <q-btn-group outline>
                  <c-btn
                    v-if="editable && !disabled"
                    :showLoading="false"
                    label="추가"
                    icon="add"
                    @btnClicked="add"
                  />
                  <c-btn
                    v-if="editable && !disabled"
                    :showLoading="false"
                    label="제외"
                    icon="remove"
                    @btnClicked="remove"
                  />
                </q-btn-group>
              </template>
            </c-table>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-upload :attachInfo="attachInfo" :editable="editable" label="시험성적서" />
          </div>
        </div>
      </q-form>
    </div>
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
  name: 'wastePopsManageDetail'
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
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    envWastePopsId: stringNull
  }
  contentHeight: stringNull
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
      envWastePopsId: ''
    }
  },
  contentHeight: ''
})
/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
// const wastePopsData = ref<wastePopsType>({
const wastePopsData = ref<any>({
  envWastePopsId: '', // POPs관리대상기기ID
  plantCd: '', // 사업장코드
  administrationNo: '', // 행정번호
  lotNo: '', // 제조번호
  envPopsTypeCd: '', // POPs 종류 코드
  envPopsCopmpanyCd: '', // POPs 제조사 코드
  lotDt: '', // 제조년월일
  envPopsVolumne: '', // 용량
  envPopsGrossWeight: '', // 총중량
  envPopsInsulationFlow: '', // 절연유량
  firstInsulationOilChangeDt: '', // 절연유교체년월일(1차)
  secondInsulationOilChangeDt: '', // 절연유교체년월일(2차)
  thirdInsulationOilChangeDt: '', // 절연유교체년월일(3차)
  disposalSaleDt: '', // 폐기매매년월일
  comment: '', // 비고
  wastePopsTestHistory: []
})

const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'WASTE_POPS_TEST',
  taskKey: ''
})

const grid = ref<any>({
  columns: [
    {
      name: 'popsTestDt',
      field: 'popsTestDt',
      label: '시험분석일자',
      align: 'left',
      type: 'date',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'popsTestMethod',
      field: 'popsTestMethod',
      label: '분석방법',
      align: 'left',
      type: 'text',
      style: 'width:30%',
      sortable: false
    },
    {
      name: 'popsTestResult',
      field: 'popsTestResult',
      label: 'PCBs 분석결과',
      align: 'left',
      type: 'text',
      style: 'width:40%',
      sortable: false
    }
  ],
  data: [],
  height: '220px'
})
const disabled = ref(false)
const detailUrl = ref('')
const saveUrl = ref(transactionConfig.env.waste.pops.insert.url)
const mappingType = ref('POST')
const isSave = ref(false)
const insertUrl = ref('')
const updateUrl = ref('')
const testRemoveUrl = ref('')
const editForm = ref<any>(null)
const measTable = ref<any>(null)

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
  insertUrl.value = transactionConfig.env.waste.pops.insert.url
  updateUrl.value = transactionConfig.env.waste.pops.update.url
  detailUrl.value = selectConfig.env.waste.pops.get.url

  testRemoveUrl.value = transactionConfig.env.waste.pops.test.delete.url
  // code setting

  // list setting
  getDetail()
}

/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  if (props.popupParam.envWastePopsId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.envWastePopsId),
      method: 'GET'
    }).then((_result: any) => {
      wastePopsData.value = _result.data
      attachInfo.value.taskKey = props.popupParam.envWastePopsId
    })
  } else {
    wastePopsData.value.regUserId = user.value.userId
  }
}

/******************************
 * TODO (목적): 잔류성유기오염물질 관리대상기기 저장
 *******************************/
function saveInfo() {
  mappingType.value = props.popupParam.envWastePopsId ? 'PUT' : 'POST'
  saveUrl.value = props.popupParam.envWastePopsId ? updateUrl.value : insertUrl.value
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          wastePopsData.value.regUserId = user.value.userId
          wastePopsData.value.chgUserId = user.value.userId
          isSave.value = !isSave.value
        },
        cancelCallback: () => {}
      })
    } else {
      message.validError()
    }
  })
}
function saveCallback(result: any) {
  props.popupParam.envWastePopsId = result.data.envWastePopsId
  message.requestSuccess()
  attachInfo.value.taskKey = props.popupParam.envWastePopsId
  attachInfo.value.isSubmit = uid()
  getDetail()
}
/******************************
 * TODO (목적): 안전대책 추가
 *******************************/
function add() {
  wastePopsData.value.wastePopsTestHistory?.push({
    envWastePopsId: wastePopsData.value.envWastePopsId,
    envWastePopsTestId: uid(),
    popsTestDt: '',
    popsTestMethod: '',
    popsTestResult: '',
    regUserId: user.value.userId,
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 안전대책 삭제
 *******************************/
function remove() {
  const selectData = measTable.value.getSelected()
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
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: testRemoveUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            wastePopsData.value.wastePopsTestHistory = _.reject(
              wastePopsData.value.wastePopsTestHistory,
              item
            )
          })
          measTable.value.compoTable.clearSelection()
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
