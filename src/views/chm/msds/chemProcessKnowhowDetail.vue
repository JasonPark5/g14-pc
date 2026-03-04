<template>
  <div>
    <q-form ref="editForm">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-card title="1. 취급 화학자재 및 유해성・위험성" class="cardClassDetailForm">
            <template v-slot:card-button>
              <q-btn-group outline>
                <c-btn v-if="isOld && editable" label="출력" icon="print" @btnClicked="printChem" />
                <c-btn
                  v-if="isOld && editable"
                  label="삭제"
                  :editable="editable"
                  icon="delete_forever"
                  @btnClicked="removeData"
                />
                <c-btn
                  v-if="editable"
                  :url="saveUrl"
                  :isSubmit="isSave"
                  :param="processKnowhow"
                  :mappingType="mappingType"
                  label="저장"
                  icon="save"
                  @beforeAction="saveData"
                  @btnCallback="saveCallback"
                />
              </q-btn-group>
            </template>
            <template v-slot:card-detail>
              <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-plant
                  required
                  :disabled="isOld"
                  :editable="editable"
                  type="edit"
                  name="plantCd"
                  v-model:value="processKnowhow.plantCd"
                />
              </div> -->
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-task-target
                  :required="true"
                  :editable="editable"
                  :customPopupParam="{ targetKey: 'process' }"
                  :plantCd="processKnowhow.plantCd"
                  label="단위공정"
                  name="processCd"
                  v-model:value="processKnowhow.processCd"
                  @dataChange="dataChange"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <c-text
                  :required="true"
                  :editable="editable && sopEditing"
                  :disabled="processKnowhow.processCd === null"
                  :afterIcon="
                    editable
                      ? [
                          { name: 'mode_edit', click: true, callbackName: 'sopEdit', color: '' },
                          { name: 'search', click: true, callbackName: 'searchSop', color: 'teal' },
                          { name: 'close', click: true, callbackName: 'removeSop', color: 'red' }
                        ]
                      : null
                  "
                  label="단위작업"
                  name="sopName"
                  v-model:value="processKnowhow.sopName"
                  @sopEdit="removeSop(2)"
                  @searchSop="searchSop"
                  @removeSop="removeSop(1)"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <c-table
                  ref="chemTable"
                  title="취급 화학자재 목록"
                  tableId="chemTable"
                  :columns="grid.columns"
                  :data="processKnowhow.chemList"
                  :columnSetting="false"
                  :filtering="false"
                  :usePaging="false"
                  gridHeightAuto
                  selection="multiple"
                  rowKey="mdmChemMaterialId"
                  @linkClick="linkClick"
                >
                  <template v-slot:table-button>
                    <q-btn-group outline>
                      <c-btn
                        v-if="editable && isProcessSet"
                        label="추가"
                        icon="add"
                        @btnClicked="addChem"
                      />
                      <c-btn
                        v-if="editable && isProcessSet && processKnowhow.chemList.length > 0"
                        label="제외"
                        icon="remove"
                        @btnClicked="removeChem"
                      />
                    </q-btn-group>
                  </template>
                </c-table>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                <c-text
                  :editable="editable"
                  label="신호어"
                  name="signName"
                  v-model:value="processKnowhow.signName"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                <c-textarea
                  :editable="editable"
                  label="유해, 위험성 분류"
                  name="riskType"
                  :rows="3"
                  v-model:value="processKnowhow.riskType"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                <c-textarea
                  :editable="editable"
                  label="유해, 위험 문구"
                  name="riskWork"
                  :rows="3"
                  v-model:value="processKnowhow.riskWork"
                />
              </div>
            </template>
          </c-card>
          <c-card title="그림문자" class="cardClassDetailForm msdsc pmsds" :collapsed="true">
            <template v-slot:card-detail>
              <span
                v-for="(item, index) in imgList"
                :key="index"
                class="example-item"
                style="display: inline; text-align: center"
              >
                <img
                  :src="getSrc(item.imgname)"
                  :class="[!item.chk ? 'noselectImg' : '', 'cursor-pointer']"
                  style="width: 70px; margin: 10px 10px 0 10px"
                  @click="item.chk = !item.chk"
                />
                <q-checkbox
                  v-model="item.chk"
                  color="red"
                  class="q-mb-xs meaning"
                  :label="item.meaning"
                />
              </span>
            </template>
          </c-card>
          <c-card title="2. 취급 시 주의사항" class="cardClassDetailForm msdsc" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="가. 안전 취급 요령"
                  name="twoFirst"
                  :rows="5"
                  v-model:value="processKnowhow.twoFirst"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="나. 안전한 저장 방법"
                  name="twoSecond"
                  :rows="5"
                  v-model:value="processKnowhow.twoSecond"
                />
              </div>
            </template>
          </c-card>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
          <c-card title="3. 적정 보호구" class="cardClassDetailForm" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="가. 호흡기 보호"
                  name="threeFirst"
                  :rows="3"
                  v-model:value="processKnowhow.threeFirst"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="나. 눈 보호"
                  name="threeSecond"
                  :rows="3"
                  v-model:value="processKnowhow.threeSecond"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="다. 손 보호"
                  name="threeThird"
                  :rows="3"
                  v-model:value="processKnowhow.threeThird"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="라. 신체 보호"
                  name="threeFourth"
                  :rows="3"
                  v-model:value="processKnowhow.threeFourth"
                />
              </div>
            </template>
          </c-card>
          <c-card title="4. 응급조치요령" class="cardClassDetailForm msdsc" :collapsed="true">
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="가. 눈에 들어갔을 때"
                  name="fourFirst"
                  :rows="5"
                  v-model:value="processKnowhow.fourFirst"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="나. 피부에 접촉했을 때"
                  name="fourSecond"
                  :rows="5"
                  v-model:value="processKnowhow.fourSecond"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="다. 흡입했을 때"
                  name="fourThird"
                  :rows="5"
                  v-model:value="processKnowhow.fourThird"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="라. 먹었을 때"
                  name="fourFourth"
                  :rows="5"
                  v-model:value="processKnowhow.fourFourth"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  label="마. 기타"
                  name="fourFifth"
                  :rows="2"
                  v-model:value="processKnowhow.fourFifth"
                />
              </div>
            </template>
          </c-card>
          <c-card
            title="5. 누출 및 폭발·화재 사고시 대처방법"
            class="cardClassDetailForm msdsc"
            :collapsed="true"
          >
            <template v-slot:card-detail>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="가. 적절한 소화제"
                  name="fiveFirst"
                  :rows="5"
                  v-model:value="processKnowhow.fiveFirst"
                />
              </div>
              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <c-textarea
                  :editable="editable"
                  label="나. 화학물질로부터 생기는 특정 유해성"
                  name="fiveSecond"
                  :rows="5"
                  v-model:value="processKnowhow.fiveSecond"
                />
              </div>
              <div class="col-12">
                <c-textarea
                  :editable="editable"
                  label="다. 화재진압 시 착용할 보호구 및 예방조치"
                  name="fiveThird"
                  :rows="3"
                  v-model:value="processKnowhow.fiveThird"
                />
              </div>
            </template>
          </c-card>
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
import { chemMaterialType } from '@/views/mdm/mam/chemMaterial'
import { chemProcessKnowhowsType } from './chemProcessKnowhows'
import { sopType } from '@/views/hea/mss/investigation'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemProcessKnowhowDetail'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
const message = useMessageStore()
/** userStroe 호출 */
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)

/******************************
 * @Emit_선언
 *******************************/
const emits = defineEmits(['closePopup'])

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    materialKnowhowId: stringNull
  }
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
      materialKnowhowId: ''
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
  width: '60%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const processKnowhow = ref<chemProcessKnowhowsType>({
  materialKnowhowId: '', //
  mdmChemMaterialId: '', // 화학자재 일련코드
  materialName: '', //
  processName: '', //
  deptCd: '', // 부서코드
  substanceName: '', //
  signName: '', //
  riskType: '', //
  riskWork: '', //
  imageWord: '', //
  twoFirst: '', //
  twoSecond: '', //
  threeFirst: '', //
  threeSecond: '', //
  threeThird: '', //
  threeFourth: '', //
  fourFirst: '', //
  fourSecond: '', //
  fourThird: '', //
  fourFourth: '', //
  fourFifth: '', //
  fiveFirst: '', //
  fiveSecond: '', //
  fiveThird: '', //
  useFlag: 'Y', //
  regUserId: '', //
  chgUserId: '', //
  processCd: '', // 공종코드
  plantCd: null, // 사업장코드
  mdmSopId: '', // 작업표준일련번호
  chemList: [], // 화학자재 리스트
  delChemList: []
})
const grid = ref({
  columns: [
    {
      name: 'mdmChemMaterialName',
      field: 'mdmChemMaterialName',
      label: '화학자재명',
      align: 'left',
      style: 'width:25%',
      sortable: false,
      type: 'link'
    },
    {
      name: 'casNo',
      field: 'casNo',
      label: 'CAS No.',
      style: 'width:10%',
      align: 'center',
      sortable: false
    },
    {
      name: 'usageName',
      field: 'usageName',
      label: '용도',
      style: 'width:12%',
      align: 'center',
      sortable: false
    },
    {
      name: 'propertiesStateName',
      field: 'propertiesStateName',
      label: '성상',
      style: 'width:8%',
      align: 'center',
      sortable: false
    },
    {
      name: 'substanceNames',
      field: 'substanceNames',
      label: '구성물질',
      style: 'width:40%',
      align: 'left',
      type: 'html',
      sortable: false
    }
  ],
  height: '200px',
  data: []
})
const imgList = ref([
  {
    imgname: 'SYM01',
    chk: false,
    meaning: '폭발성'
  },
  {
    imgname: 'SYM02',
    chk: false,
    meaning: '인화성'
  },
  {
    imgname: 'SYM03',
    chk: false,
    meaning: '산화성'
  },
  {
    imgname: 'SYM04',
    chk: false,
    meaning: '고압가스'
  },
  {
    imgname: 'SYM05',
    chk: false,
    meaning: '(금속/피부)부식성'
  },
  {
    imgname: 'SYM06',
    chk: false,
    meaning: '급식독성'
  },
  {
    imgname: 'SYM07',
    chk: false,
    meaning: '경고, 피부자극'
  },
  {
    imgname: 'SYM08',
    chk: false,
    meaning: '건강 유해성'
  },
  {
    imgname: 'SYM09',
    chk: false,
    meaning: '환경 유해성'
  }
])
const sopEditing = ref(true)
const isSave = ref(false)
const isDelete = ref(false)
const mappingType = ref('PUT')
const detailUrl = ref('')
const processUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const printUrl = ref('')
const editForm = ref<any>(null)
const chemTable = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const isOld = computed(() => Boolean(props.popupParam.materialKnowhowId))
const isProcessSet = computed(() => Boolean(processKnowhow.value.processCd))

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
  detailUrl.value = selectConfig.chm.knowhow.get.url
  processUrl.value = selectConfig.mdm.mam.chem.process.url
  printUrl.value = selectConfig.chm.knowhow.print.url
  saveUrl.value = transactionConfig.chm.knowhow.update.url
  deleteUrl.value = transactionConfig.chm.knowhow.delete.url
  // code setting
  // list setting
  getDetail()
}
/******************************
 * TODO (목적): 작업공정별 관리요령 상세조회
 *******************************/
function getDetail() {
  if (props.popupParam.materialKnowhowId) {
    $http({
      url: $format(detailUrl.value, props.popupParam.materialKnowhowId),
      method: 'GET'
    }).then((_result: any) => {
      processKnowhow.value = _result.data
      const imagewords = _result.data.imageWord.split(',')
      if (imagewords.length > 0) {
        _.forEach(imgList.value, (item) => {
          _.forEach(imagewords, (_img) => {
            if (item.imgname == _img) {
              item.chk = true
            }
          })
        })
      }
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getSrc(imgname: string) {
  return new URL(`/src/assets/images/${imgname}.gif`, import.meta.url).href
}
/******************************
 * TODO (목적): 화학자재 추가를 위한 팝업 표시
 *******************************/
function addChem() {
  popupOptions.value = getPopupOptions('materialProcess', popupOptions.value, closeChem, {
    /** 원하는 parameter 정의 */
    type: 'multiple',
    searchParam: {
      plantCd: processKnowhow.value.plantCd,
      processCd: processKnowhow.value.processCd
    }
  })
}
/******************************
 * TODO (목적): 화학자재 팝업 닫기
 * @param (1): 선택한 화학자재
 *******************************/
function closeChem(data: Array<chemMaterialType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (
        _.findIndex(processKnowhow.value.chemList, {
          mdmChemMaterialId: item.mdmChemMaterialId
        }) === -1
      ) {
        processKnowhow.value.chemList.push({
          materialKnowhowId: processKnowhow.value.materialKnowhowId,
          mdmChemMaterialId: item.mdmChemMaterialId,
          mdmChemMaterialName: item.mdmChemMaterialName,
          casNo: item.casNo,
          usageCd: item.usageCd,
          usageName: item.usageName,
          propertiesStateCd: item.propertiesStateCd,
          propertiesStateName: item.propertiesStateName,
          substanceNames: item.substanceNames,
          processCd: processKnowhow.value.processCd,
          editFlag: 'C'
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 화학자재 제외
 *******************************/
function removeChem() {
  const selectData = chemTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    _.forEach(selectData, (item) => {
      if (!processKnowhow.value.delChemList) processKnowhow.value.delChemList = []
      if (
        _.findIndex(processKnowhow.value.delChemList, {
          mdmChemMaterialId: item.mdmChemMaterialId
        }) === -1 &&
        item.editFlag !== 'C'
      ) {
        processKnowhow.value.delChemList.push(item)
      }
      processKnowhow.value.chemList = _.reject(processKnowhow.value.chemList, item)
    })
    chemTable.value.compoTable.clearSelection()
  }
}
/******************************
 * TODO (목적): 화학자재 상세 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row: chemMaterialType) {
  popupOptions.value.title = '화학자재 상세'
  popupOptions.value.param = {
    mdmChemMaterialId: row ? row.mdmChemMaterialId : '',
    plantCd: row ? row.plantCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/mdm/mam/chemDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 화학자재 상세 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): 공정 정보 변경되었을 시 그에 해당하는 화학자재 조회
 * @param (1): 공정정보
 *******************************/
function dataChange(processCd: string) {
  if (!props.popupParam.materialKnowhowId) {
    $http({
      url: processUrl.value,
      method: 'GET',
      params: {
        processCd: processCd
      }
    }).then((_result: any) => {
      processKnowhow.value.chemList = _result.data
      removeSop(2)
    })
  }
}
/******************************
 * TODO (목적): SOP 조회 팝업 표시
 *******************************/
function searchSop() {
  if (processKnowhow.value.processCd) {
    popupOptions.value = getPopupOptions('sop1', popupOptions.value, closeSopPopup, {
      /** 원하는 parameter 정의 */
      type: 'single',
      searchParam: {
        subProcessCd: processKnowhow.value.processCd
      }
    })
  } else {
    message.alert({
      title: '안내',
      message: '공정을 지정하신 후 이용바랍니다.',
      type: 'warning' // success / info / warning / error
    })
  }
}
/******************************
 * TODO (목적): SOP 조회 팝업 닫기
 * @param (1): 선택한 SOP 정보
 *******************************/
function closeSopPopup(data: Array<sopType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    sopEditing.value = false
    processKnowhow.value.mdmSopId = data[0].mdmSopId
    processKnowhow.value.sopName = data[0].sopName
  }
}
/******************************
 * TODO (목적): SOP 정보 제거
 *******************************/
function removeSop(number: number) {
  sopEditing.value = number === 1 ? false : true
  processKnowhow.value.mdmSopId = null
  processKnowhow.value.sopName = null
}
/******************************
 * TODO (목적): 작업공정별 관리요령 저장 전 처리
 *******************************/
function saveData() {
  if (props.popupParam.materialKnowhowId) {
    saveUrl.value = transactionConfig.chm.knowhow.update.url
    mappingType.value = 'PUT'
    processKnowhow.value.chgUserId = user.value.userId
  } else {
    saveUrl.value = transactionConfig.chm.knowhow.insert.url
    mappingType.value = 'POST'
    processKnowhow.value.regUserId = user.value.userId
  }
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          const imagewords: Array<string> = []
          _.forEach(imgList.value, (item) => {
            if (item.chk) {
              imagewords.push(item.imgname)
            }
          })
          processKnowhow.value.imageWord = imagewords.join(',')
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
/******************************
 * TODO (목적): 작업공정별 관리요령 저장 후 처리
 * @param (1): API 서버 반환 값
 *******************************/
function saveCallback(result: any) {
  message.requestSuccess()
  props.popupParam.materialKnowhowId = result.data.materialKnowhowId
  getDetail()
}
/******************************
 * TODO (목적): 작업공정별 관리요령 삭제
 *******************************/
function removeData() {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, props.popupParam.materialKnowhowId),
        method: 'DELETE'
      }).then((_result: any) => {
        isDelete.value = !isDelete.value
        message.requestSuccess()
        emits('closePopup')
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 작업공정별 관리요령 출력
 *******************************/
function printChem() {
  $http({
    url: $format(printUrl.value, props.popupParam.materialKnowhowId),
    method: 'GET'
  }).then((_result: any) => {
    // sopName 추가
    const fileOrgNm =
      processKnowhow.value.processName +
      '_' +
      processKnowhow.value.sopName +
      '_' +
      $language('작업공정별 화학자재 관리요령') +
      '_' +
      getToday() +
      '.xlsx'
    const blob = base64ToBlob(_result.data)
    const nav = window.navigator as any
    if (nav && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, fileOrgNm)
    } else {
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = fileOrgNm
      link.click()
    }
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.msdsc
  margin-top: 10px
.pmsds > .cardheader
  padding-top: 0px !important
  padding-bottom: 10px !important
.example-item .q-checkbox
  margin: auto !important
.example-item .inline
    display: block !important
.noselectImg
  opacity: 0.2
.q-checkbox__label, .q-checkbox__inner
  display: inline !important
  float: left !important
.q-checkbox__inner
  font-size: 30px !important
.q-checkbox__label
  line-height: 28px
.meaning
  .q-checkbox__label
    font-size: 0.9em !important
</style>
