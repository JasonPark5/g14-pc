<template>
  <div>
    <c-table
      ref="table"
      title="사용자매뉴얼 목록"
      :columns="gridColumns"
      :data="grid.data"
      rowKey="userManualId"
      :gridHeight="height"
      :columnSetting="false"
      :usePaging="false"
      :isExcelDown="false"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn
            v-if="editable && !popupParam.isPopup"
            label="등록"
            icon="add"
            @btnClicked="linkClick"
          />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props }">
        <q-icon
          v-if="props.row.pdfDownPath"
          class="cursor-pointer"
          name="description"
          size="sm"
          color="blue-6"
          @click="iconClick(props.row)"
        />
      </template>
    </c-table>
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
  name: 'userManual'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/

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
  data: Array<any>
  height?: stringNull
}
interface propType {
  popupParam?: {
    isPopup?: boolean
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
      isPopup: false
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      style: 'width:40px',
      sortable: true
    },
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: 'Rev.',
      align: 'center',
      style: 'width:50px',
      sortable: true
    },
    {
      name: 'taskName',
      field: 'taskName',
      label: '업무명',
      align: 'left',
      style: 'width:150px',
      type: 'link'
    },
    {
      name: 'custom',
      field: 'custom',
      label: '바로보기',
      align: 'center',
      sortable: false,
      style: 'width:50px',
      type: 'custom'
    },
    {
      name: 'revisionContent',
      field: 'revisionContent',
      label: '개정사유',
      align: 'left',
      style: 'width:200px'
    },
    {
      name: 'regUserName',
      field: 'regUserName',
      label: '개정자',
      align: 'center',
      style: 'width:80px'
    },
    {
      name: 'regDtStrTime',
      field: 'regDtStrTime',
      label: '개정일시',
      align: 'center',
      style: 'width:100px'
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const useFlagItems = ref<Array<codeMasterType>>([])

/******************************
 * @Computed_선언
 *******************************/
const height = computed(() => {
  return props.popupParam.isPopup ? '700px' : ''
})

const gridColumns = computed(() => {
  return grid.value.columns.map((col: any) => {
    if (col.name === 'taskName' && props.popupParam.isPopup) {
      const { type: _type, ...rest } = col
      return rest
    }
    return { ...col }
  })
})

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
  listUrl.value = selectConfig.um.userManual.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 사용자매뉴얼 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET'
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 링크 클릭 시 팝업 표시
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = $language('사용자매뉴얼 상세')
  popupOptions.value.param = {
    userManualId: row ? row.userManualId : null
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./userManualDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

function iconClick(row: any) {
  if (row.pdfDownPath === '' || row.pdfDownPath === null) {
    message.alert({
      title: '안내',
      message: '첨부된 파일이 없습니다.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    popupOptions.value.title = $language('사용자매뉴얼') + ' [' + row.taskName + ']'
    popupOptions.value.param = {
      userManualId: row ? row.userManualId : null
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./userManualPage.vue`))
    )
    popupOptions.value.visible = true
    popupOptions.value.isFull = false
    popupOptions.value.width = '80%'
    popupOptions.value.closeCallback = closePopup
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
