<template>
  <div>
    <c-card title="조직도" class="cardClassDetailForm firefighting-org-card">
      <!-- <template slot="card-button">
        <q-btn-group outline >
          <c-btn
            v-show="editable" 
            label="삭제"
            icon="delete_forever"
            @beforeAction="deleteInfo"
            @btnCallback="deleteInfoCallback" />
          <c-btn
            v-show="editable" 
            :isSubmit="isSave"
            :url="saveUrl"
            :param="document"
            :mappingType="mappingType"
            label="저장"
            icon="save"
            @beforeAction="saveInfo"
            @btnCallback="saveInfoCallback" />
        </q-btn-group>
      </template> -->
      <template v-slot:card-detail>
        <div
          ref="org"
          class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
          style="height: 714px"
        />
      </template>
    </c-card>
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
import { OrgChart } from 'd3-org-chart'
import { nodeType, nodeType2 } from '../fireFighting'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingDocumentOrg'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
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
  sopFireFightingDocumentClassCd?: stringNull
}
/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const props = withDefaults(defineProps<propType>(), {
  sopFireFightingDocumentClassCd: ''
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '80%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null as stringNull,
  sopFireFightingDocumentClassCd: '',
  sopFireFightingOrgFrameCd: ''
})
const editable = ref(true)
const listUrl = ref('')
const saveUrl = ref('')
const insertDeleteUrl = ref('')
const deleteUrl = ref('')
const org = ref<any>(null)
const chartReference = ref<any | null>(null)
const orgs = ref([])
const currentNode = ref<nodeType>({})

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  window.addEventListener('resize', setSize)
})
onMounted(() => {
  init()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setSize)
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
  listUrl.value = selectConfig.fft.oraganizaionUserDept.list.url
  saveUrl.value = transactionConfig.fft.oraganizaionUserDept.insert.url
  insertDeleteUrl.value = transactionConfig.fft.oraganizaionUserDept.insertDelete.url
  deleteUrl.value = transactionConfig.fft.oraganizaionUserDept.delete.url
  // code setting
  searchParam.value.plantCd = user.value.userId
  searchParam.value.sopFireFightingDocumentClassCd = props.sopFireFightingDocumentClassCd
  if (props.sopFireFightingDocumentClassCd !== 'FFDC000013')
    searchParam.value.sopFireFightingOrgFrameCd = 'FFOFC00001'
  else searchParam.value.sopFireFightingOrgFrameCd = 'FFOFC00002'
  // list setting
  getDetail()
  setSize()
}
/******************************
 * TODO (목적): 상세 조회
 *******************************/
function getDetail() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    orgs.value = _result.data
    setChart()
  })
}
/******************************
 * TODO (목적): 조직도 그리기
 *******************************/
function setChart() {
  if (!chartReference.value) chartReference.value = new OrgChart()
  chartReference.value
    .container(org.value)
    .data(orgs.value)
    .initialExpandLevel(4)
    .svgHeight(500)
    .nodeHeight(() => 110)
    .nodeWidth(() => 220)
    .childrenMargin(() => 70)
    // .compactMarginBetween(0)
    // .compactMarginPair(1000)
    // .neightbourMargin(25)
    .siblingsMargin(() => 100)
    .compact(false)
    .buttonContent(({ node }: nodeType2) => {
      if (!node) return ''
      return `<div style="color:#716E7B;border-radius:5px;padding:4px;font-size:10px;margin:auto auto;background-color:white;border: 1px solid #E4E2E9"> <span style="font-size:9px">${
        node.children ? `<i class="fas fa-angle-up"></i>` : `<i class="fas fa-angle-down"></i>`
      }</span> ${node.data._directSubordinates || 0}  </div>`
    })
    .nodeContent(function (d?: any) {
      if (!d || !d.data) return '<div>No Data Available</div>'
      let nodeContent = ''
      if (d.data.connectionFlag === 'Y') {
        nodeContent = `<div class="org-node node-connection"></div>`
      } else if (d.data.level === 1) {
        // 최상위
        nodeContent = `<div class="row org-node node-1">
          <div class="nodeName"> ${d.data.name} </div>
          <div class="subName"> ${d.data.subName} </div>`
        if (d.data.userDepts && d.data.userDepts.length > 0) {
          d.data.userDepts.forEach((userDept: any) => {
            nodeContent += `<div class="userDeptName">${userDept.userDeptName}</div>`
          })
        }
        nodeContent += `</div>`
      } else if (d.data.level === 2 || d.data.level === 3) {
        nodeContent = `<div class="row org-node node-2">
          <div class="col">
            <div class="nodeName"> ${d.data.name} </div>
            <div class="subName"> ${d.data.subName} </div>
          </div>`
        if (d.data.userDepts && d.data.userDepts.length > 0) {
          d.data.userDepts.forEach((userDept: any) => {
            nodeContent += `<div class="col-aotu userDeptName">
              <div class="userName"> ${userDept.userDeptName} </div>
              <div class="phone"> ( ${userDept.mobileNo} ) </div>
            </div>`
          })
        }
        nodeContent += `</div>`
      } else {
        nodeContent = `<div class="org-node node-3">
          <div class="nodeName"> ${d.data.name} </div>
          <div class="subName"> ${d.data.subName} </div>
          <div class="q-list q-list--separator">`
        if (d.data.userDepts && d.data.userDepts.length > 0) {
          d.data.userDepts.forEach((userDept: any) => {
            nodeContent += `<div role="listitem" class="q-item q-item-type row no-wrap">
              <div class="q-item__section column q-item__section--avatar q-item__section--side justify-center">
                <i aria-hidden="true" role="presentation" class="q-icon notranslate material-icons">info_outline</i>
              </div>
              <div class="q-item__section column q-item__section--main justify-center">
                <div class="q-item__label">${userDept.userDeptName}</div>
                <div class="q-item__label q-item__label--caption text-caption">${userDept.mobileNo}</div>
              </div>
              <div class="q-item__section column q-item__section--top q-item__section--side justify-start" >
                <button tabindex="0" type="button" class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--round text-red q-btn--actionable q-focusable q-hoverable q-btn--wrap fire-node-close" sopFireFightingOrganizaionUserDeptId="${userDept.sopFireFightingOrganizaionUserDeptId}">
                  <span class="q-focus-helper"></span>
                  <span class="q-btn__wrapper col row q-anchor--skip">
                    <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
                      <i aria-hidden="true" role="img" class="q-icon notranslate material-icons">close</i>
                    </span>
                  </span>
                </button>
              </div>
            </div>`
          })
        }
        // <i aria-hidden="true" role="presentation" class="q-icon text-red notranslate material-icons">close</i>
        nodeContent += `</div>
        </div>`
      }
      return nodeContent
    })
    .onNodeClick((d: any) => {
      if (d?.data) openUserPop(d.data)
    })
    .render()
    .fit()

  setTimeout(() => {
    const closeButton = document.getElementsByClassName('fire-node-close')
    if (closeButton) {
      _.forEach(closeButton, (htmlNode) => {
        htmlNode.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          $http({
            url: $format(
              deleteUrl.value,
              htmlNode.getAttribute('sopFireFightingOrganizaionUserDeptId')
            ),
            method: 'DELETE'
          }).then(() => {
            message.requestSuccess()
            getDetail()
          })
        })
      })
    }
  }, 200)
  setSize()
}
/******************************
 * TODO (목적): 사용자 팝업에서 선택
 *******************************/
function setSize() {
  if (chartReference.value) {
    chartReference.value
      .svgHeight(window.innerHeight - 150)
      .render()
      .fit()
  }
}
/******************************
 * TODO (목적): 사용자 팝업에서 선택
 *******************************/
function openUserPop(_data?: any) {
  if (_data.connectionag === 'Y') return
  currentNode.value = _data
  popupOptions.value = getPopupOptions('user', popupOptions.value, closePopup, {
    type: _data.level !== 5 ? 'single' : 'multiple',
    plantCd: user.value.plantCd,
    searchParam: { plantCd: user.value.plantCd }
  })
}
function closePopup(_data?: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_data && _data.length > 0) {
    // 사용자 또는 부서
    const insertData = [] as Array<any>
    _.forEach(_data, (item) => {
      if (currentNode.value.deptCd !== item.deptCd && currentNode.value.userId !== item.userId) {
        insertData.push({
          sopFireFightingOrganizaionUserDeptId: uid(), // 소방 조직도 부서/사용자 일련번호
          sopFireFightingOrganizaionFrameId: currentNode.value.sopFireFightingOrganizaionFrameId, // 소방 조직도 틀 일련번호
          sopFireFightingDocumentClassCd: props.sopFireFightingDocumentClassCd, // 문서 구분 코드
          userId: item.userId, // 사용자 id
          userName: item.userName, // 사용자명
          mobileNo: item.mobileNo, // 사용자명
          deptCd: item.deptCd, // 부서 코드
          deptName: item.deptName, // 부서명
          userDeptName: item.userName ? item.userName : item.deptName,
          regUserId: user.value.userId, // 등록자
          editFlag: 'C'
        })
      }
    })
    $http({
      url: currentNode.value.level !== 5 ? insertDeleteUrl.value : saveUrl.value,
      method: 'POST',
      data: insertData
    }).then(() => {
      message.requestSuccess()
      getDetail()
    })
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.firefighting-org-card
  .customCardbody
    margin: 0 !important
    padding: 0 !important
  path
    stroke-width: 2 !important
    stroke: #B4B4B8 !important

.org-node
  margin-top:-1px
  margin-left:-1px
  position: absolute !important

.node-1
  border-radius:50%
  border: 16px solid rgb(163, 151, 198)
  width:150px
  height:150px
  left: 30px
  top: -20px
  .nodeName
    font-size: 25px
    font-weight: 800
    color:#08011E
    margin-right: 20px
    padding-left: 15px
    margin-top: 22px
    border-bottom: 4px solid rgb(163, 151, 198)
  .subName
    color:#08011E
    margin-left:70px
    margin-top:-10px
    font-size:15px
    font-weight: 500
  .userDeptName
    text-align: center
    width: 100%
    font-size: 22px
    font-weight: 800
    padding-bottom: 20px

.node-2
  border-radius:10px
  // border: 1px solid #E4E2E9
  background-color:#0C85CA
  width:350px
  height:100px
  right: -70px
  padding: 5px
  .nodeName
    font-weight: 800
    font-size:25px
    color:#ffffff
    margin-left:20px
    margin-top:15px
  .subName
    color:#ffffff
    margin-left:30px
    margin-top:3px
    font-size:15px
    font-weight: 500
  .userDeptName
    text-align: center
    padding-right: 30px
    padding-left: 30px
    border-radius: 15px
    border: 4px solid #fff
    .userName
      font-weight: 800
      font-size:25px
      color:#ffffff
      margin-left:0px
      margin-top:15px
    .phone
      color:#ffffff
      margin-left:0px
      margin-top:3px
      font-size:15px
      font-weight: 500

.node-3
  border-radius:10px
  border: 1px solid #B4B4B8
  // background-color:#F2EFE5
  width:250px
  min-height:100px
  top: 20px
  right: -10px
  .nodeName
    font-weight: 800
    font-size: 16px
    color: #fff
    padding-bottom: 10px
    padding-top: 5px
    text-align: center
    background: #0D9276
    border-radius: 5px
  .subName
    color:#08011E
    margin-left:60px
    margin-top:3px
    font-size:15px
    font-weight: 500
  .q-item
    font-size: 17px
    font-weight: 600
    .q-icon
      font-size: 33px

.node-connection
  border: 1px solid #B4B4B8
  left:110px
  top:-20px
  width:0px
  height:130px
</style>
