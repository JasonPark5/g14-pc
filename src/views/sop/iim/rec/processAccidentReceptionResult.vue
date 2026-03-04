<template>
  <q-form ref="editForm">
    <c-card title="기본정보" class="cardClassDetailForm">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn
            v-if="!disabled"
            :url="updateUrl"
            :isSubmit="isSave"
            :param="accidentInfo"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveAccident"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-4 col-sm-4 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            :editable="editable"
            :disabled="disabled"
            label="보고일"
            name="reportDate"
            v-model:value="accidentInfo.reportDate"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
          <c-text
            :editable="editable"
            :disabled="disabled"
            label="발생원인"
            name="occurrenceCause"
            v-model:value="accidentInfo.occurrenceCause"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            :rows="2"
            label="사고피해"
            name="accidentDamageHistory"
            v-model:value="accidentInfo.accidentDamageHistory"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <c-textarea
            :editable="editable"
            :disabled="disabled"
            label="비상조치사항"
            :rows="2"
            name="emergencyMeasures"
            v-model:value="accidentInfo.emergencyMeasures"
          />
        </div>
      </template>
    </c-card>
    <div class="col-lg-12 col-md-12 col-sm-12">
      <c-table
        ref="table"
        title="사고자 인적사항 목록"
        :columns="grid.columns"
        :gridHeight="grid.height"
        :data="accidentInfo.accidentVictimModelList"
        :filtering="false"
        :columnSetting="false"
        :checkClickFlag="false"
        :usePaging="false"
        :editable="editable && !disabled"
        selection="multiple"
        rowKey="victimId"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && !disabled"
              :showLoading="false"
              label="내부직원 추가"
              icon="add"
              @btnClicked="add"
            />
            <c-btn
              v-if="editable && !disabled"
              :showLoading="false"
              label="외부직원 추가"
              icon="add"
              @btnClicked="addRow"
            />
            <c-btn
              v-if="editable && !disabled && accidentInfo.accidentVictimModelList!.length > 0"
              :showLoading="false"
              label="제외"
              icon="remove"
              @btnClicked="remove"
            />
          </q-btn-group>
        </template>
        <template v-slot:customArea="{ props: bodyProps, col }">
          <template v-if="col.name === 'victimName'">
            <c-text-column
              v-if="bodyProps.row['insideOutsideTypeCd'] === 'N'"
              :editable="editable"
              :props="bodyProps"
              :col="col"
              :disabled="disabled"
              v-model:value="bodyProps.row['victimName']"
              @datachange="datachange(bodyProps)"
            />
            <span v-else>
              {{ bodyProps.row['victimName'] }}
            </span>
          </template>
          <template v-if="col.name === 'birthDate'">
            <c-datepicker
              v-if="bodyProps.row['insideOutsideTypeCd'] === 'N'"
              class="tableDatepicker"
              :editable="editable"
              :disabled="disabled"
              v-model:value="bodyProps.row['birthDate']"
              @datachange="datachange(bodyProps)"
            />
            <span v-else>
              {{ bodyProps.row['birthDate'] }}
            </span>
          </template>
          <template v-if="col.name === 'career'">
            <c-text-column
              v-if="bodyProps.row['insideOutsideTypeCd'] === 'N'"
              :editable="editable"
              :props="bodyProps"
              :col="col"
              :disabled="disabled"
              v-model:value="bodyProps.row['career']"
              @datachange="datachange(bodyProps)"
            />
            <span v-else>
              {{ bodyProps.row['career'] }}
            </span>
          </template>
        </template>
      </c-table>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="물적피해" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-text
                :editable="editable"
                :disabled="disabled"
                label="손실내역"
                name="materialLossHistory"
                v-model:value="accidentInfo.materialLossHistory"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-text
                :suffix="$language('원')"
                :editable="editable"
                :disabled="disabled"
                type="number"
                label="손실금액"
                name="materialLossAmount"
                v-model:value="accidentInfo.materialLossAmount"
              />
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="환경피해" class="cardClassDetailForm">
          <template v-slot:card-detail>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-text
                :editable="editable"
                :disabled="disabled"
                :range="true"
                label="누출정보"
                name="enviromentLeakInformation"
                v-model:value="accidentInfo.enviromentLeakInformation"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <c-text
                :editable="editable"
                :disabled="disabled"
                :range="true"
                label="영향내역"
                name="enviromentImpactHistory"
                v-model:value="accidentInfo.enviromentImpactHistory"
              />
            </div>
          </template>
        </c-card>
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </q-form>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { processAccidentInvestiationType, processAccidentPopupParamType } from '../processAccident'

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
  name: 'processAccidentReceptionResult'
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
  popupParam: processAccidentPopupParamType
  accidentInfo: processAccidentInvestiationType
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  popupParam: () => {
    return {
      iimAccidentId: '',
      stepCd: '',
      count: 0
    }
  },
  accidentInfo: () => {
    return {
      iimAccidentId: '',
      investigationFlag: '',
      investigationDate: '',
      investigationPlan: '',
      reportDate: '',
      occurrenceCause: '',
      accidentDamageHistory: '',
      emergencyMeasures: '',
      materialLossHistory: '',
      materialLossAmount: '',
      enviromentLeakInformation: '',
      enviromentImpactHistory: '',
      accidentStatusCd: '',

      accidentInvestigationTeamModelList: [],
      deleteInvestigationTeamModelList: [],
      accidentVictimModelList: [],
      deleteAccidentVictimModelList: []
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<any>({
  columns: [
    {
      name: 'victimName',
      field: 'victimName',
      label: '이름',
      style: 'width:10%',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      label: '생년월일',
      style: 'width:10%',
      align: 'center',
      type: 'custom',
      sortable: false
    },
    {
      name: 'career',
      field: 'career',
      label: '직급',
      style: 'width:10%',
      align: 'center',
      type: 'custom',
      sortable: false
    },
    // {
    //   name: 'insideOutsideTypeName',
    //   field: 'insideOutsideTypeName',
    //   label: '내/외부',
    //   align: 'center',
    //   style: 'width:50px',
    //   sortable: false,
    // },
    {
      name: 'degreeDamage',
      field: 'degreeDamage',
      label: '피해상해정도',
      style: 'width:20%',
      type: 'textarea',
      align: 'left',
      sortable: false
    },
    {
      name: 'expectTreatmentDate',
      field: 'expectTreatmentDate',
      label: '예상치료기간',
      type: 'date',
      range: true,
      style: 'width:15%',
      align: 'center',
      sortable: false
    },
    {
      name: 'actionMatters',
      field: 'actionMatters',
      label: '조치사항',
      style: 'width:20%',
      type: 'textarea',
      align: 'left',
      sortable: false
    }
  ],
  data: [],
  height: '300px'
})
const updateUrl = ref('')
const isSave = ref(false)
const getUrl = ref('')
const table = ref<any>(null)
const editForm = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    (editable.value &&
      Boolean(props.popupParam.stepCd) &&
      props.popupParam.stepCd === 'ISPC000005') ||
    props.accidentInfo.investigationFlag === 'N'
)
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
  updateUrl.value = transactionConfig.sop.iim.accident.process.investigation.update.url
  getUrl.value = selectConfig.sop.iim.accident.process.get.url
  // code setting
  // list setting
  grid.value.columns.splice(3, 0, {
    setHeader: true,
    name: 'interspersedFlag',
    field: 'interspersedFlag',
    label: '산재여부',
    align: 'center',
    style: 'width:12%',
    type: 'select',
    comboItems: [
      { code: 'Y', codeName: $language('산재') },
      { code: 'N', codeName: $language('해당없음') }
    ],
    sortable: false
  })
}
/******************************
 * TODO (목적): 조사결과 리스트 재조회
 *******************************/
function getDetail() {
  if (props.accidentInfo.iimAccidentId) {
    $http({
      url: $format(getUrl.value, props.accidentInfo.iimAccidentId),
      method: 'GET'
    }).then((_result: any) => {
      props.accidentInfo.accidentVictimModelList = _.clone(_result.data.accidentVictimModelList)
      _.forEach(props.accidentInfo.accidentVictimModelList, (_item) => {
        if (_item.expectTreatmentDate) {
          _item.expectTreatmentDate = _item.expectTreatmentDate.split(',')
        }
      })
    })
  }
}
/******************************
 * TODO (목적): 사고자 추가
 *******************************/
function add() {
  popupOptions.value = getPopupOptions('user', popupOptions.value, closeUserPopup, {
    /** 원하는 parameter 정의 */
    type: 'multiple'
  })
}
/******************************
 * TODO (목적): 사고자 팝업 닫기 콜백
 *******************************/
function closeUserPopup(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (_item) => {
      const index = _.findIndex(props.accidentInfo.accidentVictimModelList, {
        victimUserId: _item.userId
      })
      if (index === -1) {
        props.accidentInfo.accidentVictimModelList!.splice(0, 0, {
          iimAccidentId: props.accidentInfo.iimAccidentId,
          victimId: uid(),
          victimUserId: _item.userId,
          victimName: _item.userName,
          birthDate: _item.birthDate,
          insideOutsideTypeName: '내부',
          insideOutsideTypeCd: 'Y',
          interspersedFlag: null,
          age: '',
          career: _item.spotName,
          degreeDamage: '',
          expectTreatmentDate: [],
          actionMatters: '',
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 사고자(직접) 추가
 *******************************/
function addRow() {
  props.accidentInfo.accidentVictimModelList!.splice(0, 0, {
    iimAccidentId: props.accidentInfo.iimAccidentId,
    victimId: uid(),
    victimName: '',
    birthDate: '',
    insideOutsideTypeName: '내부',
    insideOutsideTypeCd: 'N',
    age: '',
    career: '',
    degreeDamage: '',
    expectTreatmentDate: [],
    interspersedFlag: null,
    actionMatters: '',
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 사고자 삭제
 *******************************/
function remove() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!props.accidentInfo.deleteAccidentVictimModelList) {
        props.accidentInfo.deleteAccidentVictimModelList = []
      }
      if (
        _.findIndex(props.accidentInfo.deleteAccidentVictimModelList, {
          victimId: item.victimId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        props.accidentInfo.deleteAccidentVictimModelList.push(item)
      }
      props.accidentInfo.accidentVictimModelList = _.reject(
        props.accidentInfo.accidentVictimModelList,
        { victimId: item.victimId }
      )
    })
  }
}
function saveAccident() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',

        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          if (props.accidentInfo.investigationDate) {
            props.accidentInfo.investigationDate = props.accidentInfo.investigationDate.join()
          }
          _.forEach(props.accidentInfo.accidentVictimModelList, (_item) => {
            if (_item.expectTreatmentDate)
              _item.expectTreatmentDate = _item.expectTreatmentDate.join()
          })
          _.forEach(props.accidentInfo.deleteAccidentVictimModelList, (_item) => {
            if (_item.expectTreatmentDate)
              _item.expectTreatmentDate = _item.expectTreatmentDate.join()
          })
          // if (props.accidentInfo.investigationFlag === 'Y') {
          //   props.accidentInfo.accidentStatusCd = 'ISPC000004'
          // } else {
          //   props.accidentInfo.accidentStatusCd = 'ISPC000002'
          // }
          props.accidentInfo.regUserId = user.value.userId
          props.accidentInfo.chgUserId = user.value.userId

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
function saveCallback() {
  message.requestSuccess()
  if (props.accidentInfo.investigationDate) {
    props.accidentInfo.investigationDate = props.accidentInfo.investigationDate.split(',')
  }
  getDetail()
}
function datachange(_props?: any) {
  if (_props.row['editFlag'] !== 'C') {
    _props.row['editFlag'] = 'U'
    _props.row['chgUserId'] = user.value.userId
  }
  // table.value.acceptData(_props.row, col.name, _props.row[col.name])
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
