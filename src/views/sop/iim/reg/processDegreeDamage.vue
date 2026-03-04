<template>
  <div class="row">
    <div class="col-12">
      <c-card title="피해내역" class="cardClassDetailForm">
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
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-textarea
              :disabled="disabled"
              :editable="editable"
              label="물적피해내역"
              name="materialDamageHistory"
              :rows="2"
              v-model:value="accidentInfo.materialDamageHistory"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-textarea
              :disabled="disabled"
              :editable="editable"
              label="인적피해내역"
              :rows="2"
              name="humanDamageHistory"
              v-model:value="accidentInfo.humanDamageHistory"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-select
              :editable="editable"
              :disabled="disabled"
              type="edit"
              codeGroupCd="IIM_DAMAGE_CLASS_CD"
              itemText="codeName"
              itemValue="code"
              name="damageClassCd"
              label="사고분류"
              v-model:value="accidentInfo.damageClassCd"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-select
              :editable="editable"
              :disabled="disabled"
              type="edit"
              codeGroupCd="IIM_WOUND_CD"
              itemText="codeName"
              itemValue="code"
              name="woundCd"
              label="상해정도"
              v-model:value="accidentInfo.woundCd"
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
          :noDataLabel="$language('인적피해일 시 사고자 정보를 입력하세요.')"
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
      <div class="col-12">
        <c-upload
          :attachInfo="attachInfo"
          label="피해정도 관련 사진"
          :editable="editable && !disabled"
        />
      </div>
    </div>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { processAccidentType } from '../processAccident'

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
  name: 'processDegreeDamage'
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
  accidentInfo: processAccidentType
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
  accidentInfo: () => {
    return {
      iimAccidentId: '',
      materialDamageHistory: '',
      humanDamageHistory: '',
      accidentStatusCd: '',
      accidentVictimModelList: [],
      deleteAccidentVictimModelList: [],
      damageClassCd: null,
      woundCd: null
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
const attachInfo = ref<attachSettingType>({
  isSubmit: '',
  taskClassCd: 'PROCESS_DEGREE_DAMAGE',
  taskKey: ''
})
const grid = ref({
  columns: [
    {
      name: 'victimName',
      field: 'victimName',
      label: '이름',
      style: 'width:80px',
      type: 'custom',
      align: 'center',
      sortable: false
    },
    {
      name: 'birthDate',
      field: 'birthDate',
      label: '생년월일',
      style: 'width:80px',
      align: 'center',
      type: 'custom',
      sortable: false
    },
    {
      name: 'career',
      field: 'career',
      label: '직급',
      style: 'width:60px',
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
      style: 'width:120px',
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
      style: 'width:150px',
      align: 'center',
      sortable: false
    },
    {
      name: 'actionMatters',
      field: 'actionMatters',
      label: '조치사항',
      style: 'width:250px',
      type: 'textarea',
      align: 'left',
      sortable: false
    }
  ],
  data: [],
  height: '270px'
})
const updateUrl = ref('')
const getUrl = ref('')
const isSave = ref(false)
const table = ref<any>(null)
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    editable.value &&
    Boolean(props.accidentInfo.accidentStatusCd) &&
    props.accidentInfo.accidentStatusCd === 'ISPC000005'
)
/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.accidentInfo.iimAccidentId,
  () => {
    setTaskKey()
  }
)
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
  updateUrl.value = transactionConfig.sop.iim.accident.process.update.damage.url
  getUrl.value = selectConfig.sop.iim.accident.process.get.url
  // code setting
  // list setting
  setTaskKey()
}
/******************************
 * TODO (목적): 파일 key 세팅
 *******************************/
function setTaskKey() {
  const taskKey =
    props.accidentInfo && props.accidentInfo.iimAccidentId ? props.accidentInfo.iimAccidentId : ''
  attachInfo.value.taskKey = taskKey
}
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
function closeUserPopup(data: userType) {
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
 * TODO (목적): 사고자(현업) 추가
 *******************************/
function addRow() {
  props.accidentInfo.accidentVictimModelList!.splice(0, 0, {
    iimAccidentId: props.accidentInfo.iimAccidentId,
    victimId: uid(),
    victimName: '',
    birthDate: '',
    insideOutsideTypeName: '외부',
    insideOutsideTypeCd: 'N',
    age: '',
    career: '',
    degreeDamage: '',
    expectTreatmentDate: [],
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
      props.accidentInfo.accidentVictimModelList = _.reject(
        props.accidentInfo.accidentVictimModelList,
        { victimId: item.victimId }
      )
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
/******************************
 * TODO (목적): 사고자 저장
 *******************************/
function saveAccident() {
  message.confirm({
    title: '확인',
    message: '저장하시겠습니까?',
    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      _.forEach(props.accidentInfo.accidentVictimModelList, (_item) => {
        if (_item.expectTreatmentDate) _item.expectTreatmentDate = _item.expectTreatmentDate.join()
      })
      _.forEach(props.accidentInfo.deleteAccidentVictimModelList, (_item) => {
        if (_item.expectTreatmentDate) _item.expectTreatmentDate = _item.expectTreatmentDate.join()
      })
      props.accidentInfo.regUserId = user.value.userId
      props.accidentInfo.chgUserId = user.value.userId

      isSave.value = !isSave.value
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 사고자 저장 콜백
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getDetail()
}
/******************************
 * TODO (목적): 사고자 목록 datachange (editFlag 바꾸기 위함)
 *******************************/
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
