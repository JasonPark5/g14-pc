<template>
  <div>
    <div class="row">
      <div class="col-12" style="text-align: right; padding: 0 !important">
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="ghsResult"
            mappingType="PUT"
            label="저장"
            icon="save"
            @beforeAction="saveInfo"
            @btnCallback="saveCallback"
          />
        </q-btn-group>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-table
          ref="table"
          title="유해위험성"
          :merge="grid.merge"
          :columns="grid.columns"
          :data="ghsResult.classes"
          gridHeight="750px"
          @innerBtnClicked="innerBtnClicked"
        >
          <template v-slot:table-button>
            <q-btn-group outline>
              <q-icon
                name="help"
                size="1.6em"
                color="primary"
                style="margin: 2px 10px"
                class="cursor-pointer"
              >
                <q-popup-proxy anchor="bottom middle" self="top middle">
                  <c-table
                    title="유해위험성 구분 범례"
                    :columns="gridClass.columns"
                    :data="gridClass.data"
                    :gridHeight="gridClass.height"
                    hideBottom
                  />
                </q-popup-proxy>
              </q-icon>
              <c-btn v-if="editable" label="추가" icon="add" @btnClicked="addHarmfulRiskClass" />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props: bodyProps, col: col }">
            <template v-if="col.name === 'harmfulRiskResultCd'">
              <c-select
                :editable="editable"
                :isSelect="true"
                :codeGroupCd="getResultGroupCd(bodyProps)"
                class="no-label-control"
                type="edit"
                itemText="codeName"
                itemValue="code"
                v-model:value="bodyProps.row[col.name]"
                @datachange="() => datachange(bodyProps)"
              />
            </template>
            <template v-else-if="col.name === 'delete'">
              <q-icon
                name="delete"
                color="red-7"
                size="1.6em"
                @click="deleteHarmRiskClass(bodyProps.row)"
              />
            </template>
          </template>
        </c-table>
        <!-- <c-card title="유해위험성" class="cardClassDetailForm" topClass="topcolor-orange">
        <template slot="card-detail">
          <div class="col-12 ghsinfodetail">
            <c-textarea
              :editable="editable"
              :rows="2"
              name="classficationResult"
              v-model:value="ghsResult.classficationResult">
            </c-textarea>
          </div>
        </template>
      </c-card> -->
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-card title="신호어" class="cardClassDetailForm" topClass="topcolor-orange">
          <template v-slot:card-detail>
            <div class="col-12 ghsinfodetail">
              <c-textarea :editable="editable" name="sign" v-model:value="ghsResult.sign" />
            </div>
          </template>
        </c-card>
        <c-card title="그림문자" class="cardClassDetailForm picCard" topClass="topcolor-orange">
          <template v-slot:card-detail>
            <span
              v-for="(item, index) in ghsResult.pics"
              :key="index"
              class="chemGhsResultPicContainer"
              style="display: inline-table; margin-right: 30px; text-align: center"
            >
              <template v-if="item.pic !== '해당없음'">
                <q-img
                  :src="getSrc(item.pic)"
                  style="width: 80px"
                  class="cursor-pointer"
                  @click="
                    () => {
                      item.chk = item.chk === 'Y' ? 'N' : 'Y'
                    }
                  "
                />
                <q-checkbox
                  class="chemGhsResultPicCheckbox"
                  color="red"
                  true-value="Y"
                  false-value="N"
                  :label="item.attrVal1"
                  v-model="item.chk"
                />
              </template>
            </span>
          </template>
        </c-card>
        <c-card title="예방조치문구" class="cardClassDetailForm" topClass="topcolor-orange">
          <template v-slot:card-detail>
            <div class="col-12 ghsinfodetail">
              <c-textarea
                :editable="editable"
                :rows="3"
                name="sign"
                maxlength="1000"
                v-model:value="ghsResult.pcodeResult"
              />
            </div>
          </template>
        </c-card>
        <c-card title="유해·위험문구" class="cardClassDetailForm" topClass="topcolor-orange">
          <template v-slot:card-detail>
            <div class="col-12 ghsinfodetail">
              <c-textarea
                :editable="editable"
                :rows="3"
                maxlength="1000"
                name="sign"
                v-model:value="ghsResult.hcodeResult"
              />
            </div>
          </template>
        </c-card>
      </div>
      <c-dialog :param="popupOptions" />
    </div>
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
import { chemGhsClassfiResultType, chemGhsResultType } from './chemMaterial'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'chemGhsResult'
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

/******************************
 * @Vue_관련_선언 (ex. vue-router)
 *******************************/
const route = useRoute()

/******************************
 * @Interface_선언
 *******************************/
interface propType {
  popupParam: {
    mdmChemMaterialId: string
    tabName: stringNull
    subtabName: stringNull
    plantCd: stringNull
  }
  tabHeight?: stringNull
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
      mdmChemMaterialId: '',
      tabName: '',
      subtabName: '',
      plantCd: null
    }
  },
  tabHeight: ''
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
  width: '40%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const ghsResult = ref<chemGhsResultType>({
  // classficationResult: '',
  mdmChemMaterialId: '',
  classes: [],
  deleteClasses: [],
  pics: [],
  sign: '',
  pcodeResult: '',
  hcodeResult: '',
  regUserId: '',
  chgUserId: ''
})
const grid = ref({
  merge: [
    { index: 0, colName: 'harmfulRiskClassCd' },
    { index: 1, colName: 'harmfulRiskClassCd' }
  ],
  columns: [
    {
      name: 'attrVal1',
      field: 'attrVal1',
      label: '대분류',
      align: 'center',
      style: 'width:150px',
      sortable: true
    },
    {
      name: 'harmfulRiskClassName',
      field: 'harmfulRiskClassName',
      label: '분류',
      align: 'center',
      style: 'width:150px',
      sortable: true,
      innerBtn: true,
      btns: [{ label: '', icon: 'add', color: 'light-blue', value: '1', tooltip: '적용 구분 추가' }]
    },
    {
      name: 'harmfulRiskResultCd',
      field: 'harmfulRiskResultCd',
      label: '적용 구분',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      required: true,
      type: 'custom'
    },
    {
      name: 'harmfulRiskDetails',
      field: 'harmfulRiskDetails',
      label: '구분 부가설명',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'text'
    },
    {
      name: 'delete',
      field: 'delete',
      label: '삭제',
      align: 'center',
      style: 'width:50px',
      sortable: true,
      type: 'custom'
    }
  ]
})
const gridClass = ref({
  columns: [
    {
      fix: true,
      name: 'harmfulRiskClassName',
      field: 'harmfulRiskClassName',
      label: '유해위험성구분',
      align: 'center',
      style: 'width:130px',
      sortable: true
    },
    {
      name: 'gubun1',
      field: 'gubun1',
      label: '구분1',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun1a',
      field: 'gubun1a',
      label: '구분1A',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun1b',
      field: 'gubun1b',
      label: '구분1B',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun1c',
      field: 'gubun1c',
      label: '구분1C',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun2',
      field: 'gubun2',
      label: '구분2',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun2a',
      field: 'gubun2a',
      label: '구분2A',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun2b',
      field: 'gubun2b',
      label: '구분2B',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun3',
      field: 'gubun3',
      label: '구분3',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun4',
      field: 'gubun4',
      label: '구분4',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    },
    {
      name: 'gubun5',
      field: 'gubun5',
      label: '구분5',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'html'
    }
  ],
  data: [],
  height: '720px'
})
const isSave = ref(false)
const listUrl = ref('')
const listLegendUrl = ref('')
const saveUrl = ref('')
const deleteClassUrl = ref('')

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
  listUrl.value = selectConfig.mdm.ghs.mix.list
  listLegendUrl.value = selectConfig.mdm.mam.chem.harmfulLegendList.url
  saveUrl.value = transactionConfig.mdm.ghs.mix.save
  deleteClassUrl.value = transactionConfig.mdm.ghs.class.delete
  // code setting
  // list setting
  getLegend()
  getList()
}
/******************************
 * TODO (목적): GHS 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      mdmChemMaterialId: props.popupParam.mdmChemMaterialId
    }
  }).then((_result: any) => {
    _.extend(ghsResult.value, _result.data)
  })
}
/******************************
 * TODO (목적): 유해성위해성 범례 데이터 조회
 *******************************/
function getLegend() {
  $http({
    url: listLegendUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    gridClass.value.data = _result.data
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getSrc(pic: string) {
  return new URL(`/src/assets/images/${pic}.gif`, import.meta.url).href
}
/******************************
 * TODO (목적): 유해성위해성 추가 버튼 클릭
 * @param (1): 컬럼 정보
 * @param (2): 행 전체 정보
 *******************************/
function innerBtnClicked(col: tableColumnType, bodyProps: any) {
  ghsResult.value.classes.splice(bodyProps.rowIndex, 0, {
    mdmChemMaterialId: props.popupParam.mdmChemMaterialId, // 화학자재 일련번호
    attrVal1: bodyProps.row.attrVal1,
    harmfulRiskClassCd: bodyProps.row.harmfulRiskClassCd, // 유해위험성 구분 코드
    harmfulRiskClassName: bodyProps.row.harmfulRiskClassName, // 유해위험성 구분 코드
    harmfulRiskResultCdSave: null, // 유해위험성 결과 코드
    harmfulRiskResultCd: null, // 유해위험성 결과 코드
    harmfulRiskDetails: '', // 유해위험성 상세 설명
    regUserId: user.value.userId, // 등록자 ID
    editFlag: 'C'
  })
}
/******************************
 * TODO (목적): 유해위험성 분류 팝업 표시
 *******************************/
function addHarmfulRiskClass() {
  popupOptions.value = getPopupOptions(
    'ghsHarmfulRiskClass',
    popupOptions.value,
    closeHarmfulRiskClassPopup,
    {
      /** 원하는 parameter 정의 */
      type: 'multiple'
    }
  )
}
/******************************
 * TODO (목적): 유해위험성 분류 팝업 닫기
 * @param (1): 선택한 유해위험성 분류 정보
 *******************************/
function closeHarmfulRiskClassPopup(data: Array<codeMasterType>) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item: any) => {
      // let idx = _.findIndex(ghsResult.value.classes, { harmfulRiskClassCd: item.code })
      // idx = idx > -1 ? idx : 0
      ghsResult.value.classes.push({
        mdmChemMaterialId: props.popupParam.mdmChemMaterialId, // 화학자재 일련번호
        attrVal1: item.attrVal1,
        harmfulRiskClassCd: item.code, // 유해위험성 구분 코드
        harmfulRiskClassName: item.codeName, // 유해위험성 구분 코드
        harmfulRiskResultCd: null, // 유해위험성 결과 코드
        harmfulRiskDetails: '', // 유해위험성 상세 설명
        regUserId: user.value.userId, // 등록자 ID
        editFlag: 'C'
      })
    })
  }
}
/******************************
 * TODO (목적): 유해성위해성 삭제
 * @param (1): 삭제할 행 정보
 *******************************/
function deleteHarmRiskClass(row: chemGhsClassfiResultType) {
  message.confirm({
    title: '확인',
    message: '삭제하시겠습니까?',

    type: 'info', // success / info / warning / error
    // 확인 callback 함수
    confirmCallback: () => {
      if (row.editFlag === 'C') {
        ghsResult.value.classes = _.reject(ghsResult.value.classes, row)
        return
      }
      $http({
        url: $format(
          deleteClassUrl.value,
          props.popupParam.mdmChemMaterialId,
          row.harmfulRiskClassCd,
          row.harmfulRiskResultCdSave
        ),
        method: 'DELETE'
      }).then((_result: any) => {
        ghsResult.value.classes = _.reject(ghsResult.value.classes, row)
        message.requestSuccess()
      })
    },
    // 취소 callback 함수
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 유해성위해성 분류 코드그룹 셋팅
 * @param (1): 행 전체 정보
 * @return (반환): 유해성위해성 분류 코드그룹
 *******************************/
function getResultGroupCd(bodyProps: any) {
  let codeGroupCd = ''
  switch (bodyProps.row['harmfulRiskClassCd']) {
    case 'HRC0000001': // 급성독성(경구)
    case 'HRC0000002': // 급성독성(경피)
    case 'HRC0000003': // 급성독성(흡입)
      codeGroupCd = 'ACUTE_TOXICITY_CD'
      break
    case 'HRC0000004': // 피부 부식성
    case 'HRC0000005': // 피부 자극성
      codeGroupCd = 'SKIN_CORROSION_IRRITATION_CD'
      break
    case 'HRC0000006': // 심한 눈 손상성 또는 자극성
      codeGroupCd = 'SERIOUS_EYE_DAMAGE_IRRITATION_CD'
      break
    case 'HRC0000007': // 호흡기 과민성
      codeGroupCd = 'RESPIRATORY_SENSITIZATION_CD'
      break
    case 'HRC0000008': // 피부 과민성
      codeGroupCd = 'SKIN_SENSITIZATION_CD'
      break
    case 'HRC0000009': // 발암성
      codeGroupCd = 'CARCINOGENICITY_CD'
      break
    case 'HRC0000010': // 생식세포 변이원성
      codeGroupCd = 'GERM_CELL_MUTAGENICITY_CD'
      break
    case 'HRC0000011': // 생식독성
      codeGroupCd = 'REPRODUCTIVE_TOXICITY_CD'
      break
    case 'HRC0000012': // 특정표적장기 독성(1회 노출)
      codeGroupCd = 'SPEC_TARGET_ORGAN_TOXICITY_SINGLE_EXPOSURE_CD'
      break
    case 'HRC0000013': // 특정표적장기 독성(반복 노출)
      codeGroupCd = 'SPEC_TARGET_ORGAN_TOXICITY_REPEATED_EXPOSURE_CD'
      break
    case 'HRC0000014': // 흡인유해성
      codeGroupCd = 'ASPIRATION_HAZARD_CD'
      break
    default:
      codeGroupCd = 'ACUTE_TOXICITY_CD'
      break
  }
  return codeGroupCd
}
/******************************
 * TODO (목적): 유해성 위해성 분류 정보 변경에 따른 데이터 삭제/등록 처리
 * @param (1): 행 전체 정보
 *******************************/
function datachange(bodyProps: any) {
  /**
   * 적용 구분값이 변경될 시 해당 값은 삭제 처리
   * 변경된 값은 신규등록으로 처리
   */
  if (bodyProps.row['editFlag'] !== 'C') {
    if (!ghsResult.value.deleteClasses) ghsResult.value.deleteClasses = []
    if (
      _.findIndex(ghsResult.value.deleteClasses, {
        harmfulRiskClassCd: bodyProps.row.harmfulRiskClassCd,
        harmfulRiskResultCd: bodyProps.row.harmfulRiskResultCdSave
      }) === -1
    ) {
      const deleteItem = _.clone(bodyProps.row)
      deleteItem.harmfulRiskResultCd = deleteItem.harmfulRiskResultCdSave
      ghsResult.value.deleteClasses.push(deleteItem)
    }
    bodyProps.row['harmfulRiskResultCdSave'] = bodyProps.row.harmfulRiskResultCd
    bodyProps.row['editFlag'] = 'C'
    bodyProps.row['regUserId'] = user.value.userId
  }
}
/******************************
 * TODO (목적): GHS 저장 전 처리
 *******************************/
function saveInfo() {
  if (validTable(grid.value.columns, ghsResult.value.classes)) {
    /**
     * 유해/위해성 중 동일한 정보가 들어있는지 검증
     */
    let isValid = true
    if (ghsResult.value.classes && ghsResult.value.classes.length > 0) {
      const uniqClasses = _.uniq(_.map(ghsResult.value.classes, 'harmfulRiskClassCd'))
      _.forEach(uniqClasses, (uniqClass) => {
        const filterData = _.filter(ghsResult.value.classes, {
          harmfulRiskClassCd: uniqClass
        })
        if (
          filterData.length > 1 &&
          _.findIndex(filterData, (filterItem) => {
            return (
              _.filter(filterData, {
                harmfulRiskResultCd: filterItem.harmfulRiskResultCd
              }).length > 1
            )
          }) > -1
        ) {
          isValid = false
          return false
        }
      })
    }
    if (!isValid) {
      message.alert({
        title: '안내',
        message:
          '[유해위해성] 분류, 적용 구분값이 동일한 데이터가 존재합니다.\n다시 입력하시기 바랍니다.',
        type: 'warning' // success / info / warning / error
      })
      return
    }
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',

      type: 'info', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        ghsResult.value.regUserId = user.value.userId
        ghsResult.value.chgUserId = user.value.userId

        isSave.value = !isSave.value
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  }
}
/******************************
 * TODO (목적): GHS 저장 후 처리
 *******************************/
function saveCallback() {
  message.requestSuccess()
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
