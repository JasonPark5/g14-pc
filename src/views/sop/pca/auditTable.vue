<template>
  <div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-card class="cardClassDetailForm" title="평가 항목 개정이력">
        <template v-slot:card-button>
          <q-btn-group outline>
            <c-btn
              v-if="editable && revisionable"
              label="개정"
              icon="restart_alt"
              @btnClicked="openRevision"
            />
          </q-btn-group>
        </template>
        <template v-slot:card-detail>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              type="none"
              :comboItems="revisionItems"
              itemText="codeName"
              itemValue="code"
              label="제/개정 번호"
              name="sysRevision"
              v-model:value="searchParam.sysRevision"
              @update:value="getList"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-text label="제/개정 일자" :value="mstInfo.revisionDt" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <c-text label="제/개정 사유" :value="mstInfo.revisionContent" />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <c-select
              type="search"
              codeGroupCd="SELF_INSPECTION_METHOD_CD"
              itemText="codeName"
              itemValue="code"
              label="평가방법 구분"
              name="selfInspectionMethodCd"
              v-model:value="searchParam.selfInspectionMethodCd"
              @update:value="getList"
            />
          </div>
        </template>
      </c-card>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
      <c-table
        ref="table"
        title="평가항목 목록"
        tableId="table"
        :columns="grid.columns"
        :data="grid.data"
        :usePaging="false"
        :columnSetting="false"
        selection="multiple"
        rowKey="selfInspectionItemMstId"
      >
        <!-- 버튼 영역 -->
        <template v-slot:table-button>
          <div>
            <q-btn-group outline>
              <c-btn label="추가" v-if="editable && revisionable" icon="add" @btnClicked="addRow" />
              <c-btn
                label="삭제"
                v-if="editable && revisionable"
                icon="remove"
                @btnClicked="removeRow"
              />
              <c-btn
                label="저장"
                v-if="editable && revisionable"
                icon="save"
                @btnClicked="saveRow"
              />
            </q-btn-group>
          </div>
        </template>
      </c-table>
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $language('자체감사 평가항목 개정') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <c-text
            :required="true"
            label="개정번호"
            :editable="false"
            name="revisionNum"
            v-model:value="revisionInfo.revisionNum"
          />
          <c-datepicker
            :required="true"
            label="개정일자"
            name="revisionDt"
            style="margin: 20px 0"
            v-model:value="revisionInfo.revisionDt"
          />
          <c-text
            label="개정사유"
            name="revisionContent"
            v-model:value="revisionInfo.revisionContent"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$language('취소')" @click="cancelRevision" />
          <q-btn flat :label="$language('개정')" @click="saveRevision" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/

import { revisionType } from './audit'

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
  name: 'auditTable'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStroe = useUserStore()
const { user } = storeToRefs(userStroe)
const message = useMessageStore()

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
const grid = ref<gridType>({
  columns: [
    {
      required: true,
      setHeader: true,
      name: 'selfInspectionMethodCd',
      field: 'selfInspectionMethodCd',
      label: '평가방법',
      align: 'center',
      style: 'width:100px',
      type: 'select',
      codeGroupCd: 'SELF_INSPECTION_METHOD_CD',
      sortable: false
    },
    {
      required: true,
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'left',
      type: 'number',
      style: 'width:70px',
      sortable: false
    },
    {
      required: true,
      name: 'itemMstName',
      field: 'itemMstName',
      label: '항목',
      align: 'left',
      type: 'text',
      sortable: false
    },
    {
      required: true,
      name: 'maxRealScoring',
      field: 'maxRealScoring',
      label: '최고실배점',
      align: 'center',
      type: 'number',
      style: 'width:200px',
      sortable: false
    },
    {
      required: true,
      name: 'changeCalculation',
      field: 'changeCalculation',
      label: '환산계수',
      align: 'center',
      type: 'number',
      style: 'width:200px',
      sortable: false
    },
    {
      required: true,
      name: 'maxChangeScoring',
      field: 'maxChangeScoring',
      label: '최고환산점수',
      align: 'center',
      type: 'number',
      style: 'width:200px',
      sortable: false
    }
  ],
  data: []
})
const searchParam = ref({
  sysRevision: null,
  selfInspectionMethodCd: null
})
const mstInfo = ref({
  sysRevision: null,
  revisionNum: '',
  revisionContent: '',
  revisionDt: ''
})
const revisionInfo = ref<revisionType>({
  sysRevision: '',
  revisionNum: '',
  revisionDt: '',
  revisionContent: '',
  regUserId: ''
})
const editable = ref(true)
const revisionable = ref(true)
const prompt = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const revisionUrl = ref('')
const lastRevision = ref(null)
const revisionItems = ref<codeMasterType>([])
const table = ref<any>(null)

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
  revisionUrl.value = selectConfig.sop.pca.item.revs.item
  listUrl.value = selectConfig.sop.pca.item.revs.url
  saveUrl.value = transactionConfig.sop.pca.item.save.url
  deleteUrl.value = transactionConfig.sop.pca.item.delete.url
  // code setting
  // list setting
  getRevision()
}
/******************************
 * TODO (목적): 개정버전 / 목록 조회
 *******************************/
function getRevision() {
  $http({
    url: revisionUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    revisionItems.value = _result.data
    searchParam.value.sysRevision = revisionItems.value[0].code
    lastRevision.value = revisionItems.value[0].code
    getList()
  })
}
function getList() {
  revisionable.value = lastRevision.value === searchParam.value.sysRevision ? true : false
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
    if (_result.data.length > 0) mstInfo.value = _result.data[0]
  })
}
/******************************
 * TODO (목적): 행 추가
 *******************************/
function addRow() {
  grid.value.data?.push({
    editFlag: 'C',
    selfInspectionItemMstId: uid(), // 자체감사 평가항목 일련번호
    itemMstName: '', // 자체감사 평가항목명
    maxRealScoring: '', // 최고실배점
    changeCalculation: '', // 환산계수
    maxChangeScoring: '', // 최고환산점수
    sortOrder: grid.value.data.length + 1, // 순번
    sysRevision: mstInfo.value.sysRevision, // 시스템 개정번호
    revisionNum: mstInfo.value.revisionNum, // 개정번호
    revisionContent: mstInfo.value.revisionContent, // 개정사유
    revisionDt: mstInfo.value.revisionDt,
    delFlag: 'N' // 삭제여부
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveRow() {
  if (grid.value.data && validTable(grid.value.columns, grid.value.data)) {
    const saveData = grid.value.data.filter((x) => {
      return x.editFlag == 'C' || x.editFlag == 'U'
    })
    _.forEach(saveData, (item) => {
      item.regUserId = user.value.userId
      item.chgUserId = user.value.userId
    })
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          $http({
            url: saveUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            revisionItems.value = _result.data
            searchParam.value.sysRevision = revisionItems.value[0].code
            lastRevision.value = revisionItems.value[0].code
            getList()
          })
        },
        // 취소 callback 함수
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
/******************************
 * TODO (목적): 삭제
 *******************************/
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
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then(() => {
          message.requestSuccess()
          _.forEach(selectData, (item) => {
            grid.value.data = _.reject(grid.value.data, item)
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
 * TODO (목적): 개정 추가
 *******************************/
function openRevision() {
  $http({
    url: selectConfig.com.revision.getversion,
    method: 'GET',
    params: { revisionNum: revisionItems.value.length > 0 ? revisionItems.value[0].codeName : '' }
  }).then((_result: any) => {
    revisionInfo.value = {
      sysRevision:
        revisionItems.value.length > 0 ? String(Number(revisionItems.value[0].code) + 1) : '1',
      revisionNum: _result.data,
      revisionDt: getToday(),
      revisionContent: '',
      regUserId: user.value.userId
    }
  })
  prompt.value = true
}
/******************************
 * TODO (목적): 개정 취소
 *******************************/
function cancelRevision() {
  prompt.value = false
  revisionInfo.value = {
    sysRevision: '',
    revisionNum: '',
    revisionDt: '',
    revisionContent: ''
  }
}
/******************************
 * TODO (목적): 개정 저장
 *******************************/
function saveRevision() {
  if (revisionInfo.value.sysRevision !== '') {
    message.confirm({
      title: '확인',
      message: '현재 자체감사 평가항목을 개정하시겠습니까?',
      type: 'info',
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: transactionConfig.sop.pca.item.save.url + '/rev',
          method: 'POST',
          data: revisionInfo.value
        }).then(() => {
          message.alert({
            title: '안내',
            message: '개정번호가 추가되었습니다.',
            type: 'success' // success / info / warning / error
          })
          getRevision()
          prompt.value = false
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
