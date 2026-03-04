<template>
  <div>
    <div class="row appr-line-pop-layer">
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <c-search-box ref="searchbox" @enter="getList">
          <template v-slot:search>
            <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-dept type="search" name="deptCd" v-model:value="searchParam.deptCd" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-text label="사용자" name="userName" v-model:value="searchParam.userName" />
            </div>
          </template>
        </c-search-box>
        <c-table
          ref="userTable"
          title="사용자 목록"
          :columns="grid.columns"
          :data="grid.data"
          :gridHeight="grid.height"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          selection="multiple"
          rowKey="userId"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
        </c-table>
      </div>
      <div
        class="col-xs-12 col-sm-12 col-md-1 col-lg-1 col-xl-1"
        style="margin: auto 0; line-height: 35px; text-align: center"
      >
        <c-btn
          label="확인"
          icon="arrow_forward_ios"
          color="blue-grey-4"
          @btnClicked="addApprLine('AKC0000004')"
        />
        <c-btn
          label="합의"
          icon="arrow_forward_ios"
          color="green-7"
          @btnClicked="addApprLine('AKC0000002')"
        />
        <c-btn
          label="결재"
          icon="arrow_forward_ios"
          color="blue-7"
          @btnClicked="addApprLine('AKC0000003')"
        />
        <c-btn
          label="회람"
          icon="arrow_forward_ios"
          color="blue-grey-4"
          @btnClicked="addApprLine('AKC0000009')"
        /><br /><br />
        <c-btn label="삭제" icon="arrow_back_ios" color="red" @btnClicked="delApprLine" />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-card title="결재선" class="cardClassDetailForm cardClassDetailFormLine" height="270px">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn label="결재선 저장" icon="save" @btnClicked="select" />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <div class="col-12" style="padding: 5px !important">
              <VueDraggableNext
                tag="ul"
                :list="linegrid.data"
                class="list-group"
                handle=".linehandle"
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
                @change="moveApprLine"
                :move="checkMove"
              >
                <transition-group type="transition" :name="!drag ? 'flip-list' : ''">
                  <li
                    class="list-group-item"
                    v-for="(element, idx) in linegrid.data"
                    :key="element.approvalUserId + element.approvalKindCd"
                    :class="{ linehandle: idx > 0 }"
                  >
                    <i class="material-icons linehandley" v-if="idx > 0">reorder</i>
                    <i class="material-icons linehandlex no-move" v-if="idx == 0">reorder</i>
                    <div
                      class="linetext linespan1"
                      :class="getLineKindColor(element.approvalKindCd)"
                    >
                      {{ element.approvalKindName }}
                    </div>
                    <div class="linetext linespan2">{{ element.deptName }}</div>
                    <div class="linetext linespan3">{{ element.approvalUserName }}</div>
                    <i class="material-icons lineclose" v-if="idx > 0" @click="removeAt(idx)"
                      >clear<q-tooltip>결재선 삭제</q-tooltip></i
                    >
                  </li>
                </transition-group>
              </VueDraggableNext>
            </div>
          </template>
        </c-card>
        <br />
        <c-table
          ref="lineTable2"
          title="회람"
          :columnSetting="false"
          :isFullScreen="false"
          :hideBottom="true"
          :usePaging="false"
          :filtering="false"
          :columns="linegrid2.columns"
          :data="linegrid2.data"
          :gridHeight="linegrid2.height"
          selection="multiple"
          rowKey="approvalUserId"
        />
      </div>
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
import selectConfig from '@/common/utils/selectConfig'
import { VueDraggableNext } from 'vue-draggable-next'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'apprLinePop'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  popupParam: commonParamType
  contentHeight?: string | number
}
type commonParamType = {
  plantCd: string
  apprlinedata: Array<any>
  apprlinedata2: Array<any>
  approvalLineGrp: number
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
      plantCd: '',
      apprlinedata: [],
      apprlinedata2: [],
      approvalLineGrp: 1
    }
  },
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const userTable = ref<any>(null)
const lineTable2 = ref<any>(null)
const searchbox = ref<any>(null)
const grid = ref({
  columns: [
    { name: 'plantName', field: 'plantName', label: '사업장', align: 'center', sortable: true },
    { name: 'deptName', field: 'deptName', label: '부서', align: 'center', sortable: true },
    { name: 'userName', field: 'userName', label: '이름', align: 'center', sortable: true },
    { name: 'jobName', field: 'jobName', label: '직책', align: 'center', sortable: true },
    { name: 'spotName', field: 'spotName', label: '직위', align: 'center', sortable: true }
  ],
  data: [],
  height: '500px'
})
const linegrid = ref({ data: [] as any[] })
const linegrid2 = ref({
  columns: [
    {
      name: 'deptName',
      field: 'deptName',
      label: '부서',
      align: 'center',
      style: 'width: 100px',
      sortable: false
    },
    {
      name: 'approvalUserName',
      field: 'approvalUserName',
      label: '이름',
      align: 'center',
      sortable: false
    }
  ],
  data: [] as any[],
  height: '272px'
})
const searchParam = ref({
  plantCd: null as string | null,
  deptCd: null as string | null,
  userName: ''
})
const drag = ref(false)
const editable = ref(true)
const listUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const dragOptions = computed(() => ({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost'
}))

/******************************
 * @Watch_선언
 *******************************/
watch(
  () => props.contentHeight,
  (newHeight) => {
    let height = (newHeight as number) - searchbox.value.$el.offsetHeight - 50
    if (height < 400) {
      height = 500
    }
    grid.value.height = `${height}px`
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
 * TODO (목적): 초기화 함수
 *******************************/
function init() {
  editable.value = Boolean(route.meta.editable)
  listUrl.value = selectConfig.mdm.user.list.url
  if (props.popupParam.plantCd) {
    searchParam.value.plantCd = props.popupParam.plantCd
  }
  getList()
  getApprLine()
}
/******************************
 * TODO (목적): 사용자 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 팝업파라미터에서 받은 결제선 복사
 *******************************/
function getApprLine() {
  _.extend(linegrid.value.data, props.popupParam.apprlinedata)
  _.extend(linegrid2.value.data, props.popupParam.apprlinedata2)
}
/******************************
 * TODO (목적): 드래그 여부
 * @param (1): 드레그 이벤트
 * @return (반환): 인덱스가 0이 아닐경우 boolean
 *******************************/
function checkMove(e: any) {
  return e.draggedContext.futureIndex !== 0
}
/******************************
 * TODO (목적): 결제선 저장
 *******************************/
function select() {
  const returnLineData = {
    apprlinedata: linegrid.value.data,
    apprlinedata2: linegrid2.value.data
  }
  emits('closePopup', returnLineData)
}
/******************************
 * TODO (목적): 결제선 추가
 * @param (1): 결제종류
 *******************************/
function addApprLine(_kindCd: string) {
  const selectData = userTable.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '사용자를 지정하세요.',
      type: 'warning'
    })
  } else {
    if (_kindCd == 'AKC0000009') {
      // 회람자 추가
      _.forEach(selectData, (item) => {
        if (
          linegrid2.value.data
            .map(function (e) {
              return e.approvalUserId
            })
            .indexOf(item.userId) < 0
        ) {
          linegrid2.value.data.push({
            approvalKindCd: _kindCd,
            approvalKindName: getApprKindName(_kindCd),
            approvalUserId: item.userId,
            approvalUserName: item.userName,
            deptName: item.deptName,
            approvalLineNo: linegrid2.value.data.length + 1001,
            sysApprovalRequestId: '',
            approvalStatusName: '',
            approvalDt: null,
            approvalStatusCd: '',
            approvalLineGrp: props.popupParam.approvalLineGrp
          })
        }
      })
    } else {
      _.forEach(selectData, (item) => {
        // 목록에 중복된 사용자 제외 (결재유형+사용자가 동일하지 않은 사용자만 추가 가능)
        if (
          linegrid.value.data
            .map(function (e) {
              return e.approvalUserId + e.approvalKindCd
            })
            .indexOf(item.userId + _kindCd) < 0
        ) {
          linegrid.value.data.push({
            approvalKindCd: _kindCd,
            approvalKindName: getApprKindName(_kindCd),
            approvalUserId: item.userId,
            approvalUserName: item.userName,
            deptName: item.deptName,
            approvalLineNo: linegrid.value.data.length + 1,
            draggable: true,
            sysApprovalRequestId: '',
            approvalStatusName: '',
            approvalDt: null,
            approvalStatusCd: '',
            approvalLineGrp: props.popupParam.approvalLineGrp
          })
        }
      })
    }
  }
  userTable.value.compoTable.clearSelection()
}
/******************************
 * TODO (목적): 결제선 삭제
 *******************************/
function delApprLine() {
  const selectedRows = lineTable2.value.getSelected()
  const selectData2 = selectedRows!.filter((x: any) => x.approvalKindCd !== 'AKC0000001')
  if (selectData2 && selectData2.length > 0) {
    _.forEach(selectData2, (item) => {
      linegrid2.value.data = _.reject(linegrid2.value.data, {
        approvalUserId: item.approvalUserId
      })
    })
  }
}
/******************************
 * TODO (목적): 결제선 순서변경 시 lineno 초기화
 *******************************/
function moveApprLine() {
  let _cnt = 1
  _.forEach(linegrid.value.data, (item) => {
    item.approvalLineNo = _cnt
    _cnt++
  })
}
/******************************
 * TODO (목적): 결제선 삭제이벤트
 * @param (1): 결제라인 Row Index
 *******************************/
function removeAt(idx: number) {
  linegrid.value.data.splice(idx, 1)
  moveApprLine()
}
/******************************
 * TODO (목적): 결제종류 명칭 반환
 * @param (1): 결재종류 코드
 * @return (반환): 결제종류 명
 *******************************/
function getApprKindName(_cd: string) {
  const kinds: Record<string, string> = {
    AKC0000010: '재상신',
    AKC0000001: '상신',
    AKC0000002: '합의',
    AKC0000003: '결재',
    AKC0000004: '확인',
    AKC0000009: '회람',
    AKC0000005: '기안'
  }
  return kinds[_cd] || ''
}
/******************************
 * TODO (목적): 결제종류 별 색상
 * @param (1): 결재종류 코드
 * @return (반환): 결제종류 색상 class
 *******************************/
function getLineKindColor(_cd: string) {
  const colors: Record<string, string> = {
    AKC0000010: 'text-gray-8',
    AKC0000001: 'text-gray-8',
    AKC0000002: 'text-green-7',
    AKC0000003: 'text-blue-7',
    AKC0000004: 'text-blue-grey-4',
    AKC0000009: 'text-blue-grey-4',
    AKC0000005: 'text-orange-9'
  }
  return colors[_cd] || ''
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
