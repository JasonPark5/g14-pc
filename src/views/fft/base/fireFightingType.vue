<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            :comboItems="useFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="srchUseFlag"
            label="사용여부"
            v-model:value="searchParam.srchUseFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="소방설비유형 목록"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable"
            :showLoading="false"
            label="추가"
            icon="add"
            @btnClicked="addInfo"
          />
          <c-btn
            v-if="editable"
            :isSubmit="isSave"
            :url="saveUrl"
            :param="grid.data"
            mappingType="POST"
            label="저장"
            icon="save"
            @beforeAction="saveInfo"
            @btnCallback="saveInfoCallback"
          />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
    </c-table>
    <q-dialog v-model="prompt.visible" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $language('코드') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="prompt.code" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$language('취소')" @click="cancelCode" />
          <q-btn flat :label="$language('추가')" @click="setCode" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  name: 'fireFightingType'
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
      name: 'code',
      field: 'code',
      label: '코드',
      align: 'center',
      style: 'width:100px',
      sortable: true
    },
    {
      name: 'codeName',
      field: 'codeName',
      label: '소방설비유형',
      align: 'left',
      style: 'width:400px',
      sortable: true,
      required: true,
      type: 'text'
    },
    {
      name: 'description',
      field: 'description',
      label: '비고',
      align: 'left',
      style: 'width:250px',
      sortable: true,
      type: 'text'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:90px',
      sortable: true,
      type: 'check',
      true: 'Y',
      false: 'N'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '정렬순서',
      align: 'center',
      style: 'width:90px',
      sortable: true,
      type: 'number'
    },
    {
      name: 'attach',
      field: 'attach',
      label: '유형별 이미지',
      align: 'center',
      style: 'width:150px',
      type: 'attach',
      taskClassCd: 'FIRE_FIGHTING_TYPE',
      keyText: 'code',
      sortable: false
    }
  ],
  data: []
})
const searchParam = ref({
  srchCodeGrpCd: 'SOP_FIRE_FIGHTING_TYPE_CD',
  srchUseFlag: 'Y'
})
const prompt = ref({
  visible: false,
  code: ''
})
const useFlagItems = ref<Array<codeMasterType>>([])
const editable = ref(true)
const isSave = ref(false)
const listUrl = ref('')
const saveUrl = ref('')
const validUrl = ref('')
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
  listUrl.value = selectConfig.sys.code.mst.list.url
  validUrl.value = selectConfig.sys.code.mst.valid.url
  saveUrl.value = transactionConfig.sys.code.mst.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 목록 조회
 *******************************/
function getList() {
  $http({
    url: $format(listUrl.value, searchParam.value.srchCodeGrpCd),
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 행 추가. 원래 코드에서 숫자1증가 후 문자열길이 맞춤
 *******************************/
function addInfo() {
  prompt.value.visible = true
  if (grid.value.data!.length > 0) {
    const _code = grid.value.data![grid.value.data!.length - 1].code
    if (_code.length === 10) {
      const _num = _code.replace(/[a-zA-Z]/g, '') // code 문자열에서 숫자만 추출
      const _eng = _code.replace(_num, '') // code 문자열에서 숫자 부분을 제거
      prompt.value.code = _eng + String(parseInt(_num) + 1).padStart(_num.length, '0')
    }
  }
}
/******************************
 * TODO (목적): 초기화
 *******************************/
function cancelCode() {
  prompt.value.visible = false
  prompt.value.code = ''
}
/******************************
 * TODO (목적): 소방설비유형코드 추가
 *******************************/
function setCode() {
  $http({
    url: validUrl.value,
    method: 'GET',
    params: {
      srchCodeGrpCd: searchParam.value.srchCodeGrpCd,
      srchCode: prompt.value.code
    }
  }).then((_result: any) => {
    if (_result.data === 0) {
      let _order = 0
      const cnt = grid.value.data!.length
      if (cnt == 0) _order = 1
      else if (cnt == 1) _order = 10
      else _order = grid.value.data![cnt - 1].sortOrder + 10
      if (!grid.value.data) grid.value.data = []
      grid.value.data.splice(0, 0, {
        codeGrpCd: searchParam.value.srchCodeGrpCd,
        code: prompt.value.code,
        langs: 'kr',
        codeName: '',
        attrVal1: '',
        attrVal2: '',
        attrVal3: '',
        attrVal4: '',
        description: '',
        sortOrder: _order,
        useFlag: 'Y',
        regUserId: user.value.userId, // 등록자 ID
        editFlag: 'C'
      })
      cancelCode()
    } else {
      message.alert({
        title: '안내',
        message: '해당 코드는 이미 존재합니다. 다른 코드를 작성해주세요.',
        type: 'error' // success / info / warning / error
      })
    }
  })
}
/******************************
 * TODO (목적): 저장
 *******************************/
function saveInfo() {
  if (validTable(grid.value.columns, grid.value.data!)) {
    message.confirm({
      title: '확인',
      message: '저장하시겠습니까?',
      type: 'info', // success / info / warning / error
      confirmCallback: () => {
        _.forEach(grid.value.data, (item) => {
          item.regUserId = user.value.userId
          item.chgUserId = user.value.userId
        })
        isSave.value = !isSave.value
      },
      cancelCallback: () => {}
    })
  }
}
function saveInfoCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
