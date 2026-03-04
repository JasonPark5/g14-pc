<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant
            type="search"
            name="plantCd"
            v-model:value="searchParam.plantCd"
            @datachange="getList"
          />
        </div>
      </template>
    </c-search-box> -->
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-card
          title="설치운영허가검토 결과서 폴더 (폴더명으로 정렬됩니다.)"
          class="cardClassDetailForm folder-tree"
          :height="treeHeight"
        >
          <template v-slot:card-button>
            <div class="row items-center">
              <q-chip
                outline
                square
                icon="info"
                color="primary"
                size="0.9em"
                style="cursor: pointer"
                >{{ $language('전체 파일 목록') }}
                <q-menu
                  style="padding: 10px; overflow-y: auto; max-height: 96vh; z-index: 2 !important"
                >
                  <c-table
                    dense
                    hideBottom
                    :usePaging="false"
                    :isExcelDown="false"
                    :columnSetting="false"
                    :isFullScreen="false"
                    gridHeightAuto
                    title="전체 파일 목록"
                    :columns="totalGrid.columns"
                    :data="totalGrid.data"
                    :merge="totalGrid.merge"
                    @linkClick="linkClick"
                  />
                </q-menu>
              </q-chip>
              <c-btn v-if="editable" label="ROOT 폴더 추가" icon="add" @btnClicked="addFolder" />
            </div>
          </template>
          <template v-slot:card-detail>
            <q-tree
              :nodes="dataTree"
              node-key="iepsFolderId"
              :no-nodes-label="$language('생성된 폴더가 없습니다.')"
              selected-color="primary"
              :default-expand-all="true"
            >
              <template v-slot:header-root="prop">
                <div class="row items-center">
                  <q-icon :name="'folder'" color="orange" size="24px" class="q-mr-sm" />
                  <div>
                    <div class="cursor-pointer" v-on:click="rowClick(prop.node)">
                      {{ prop.node.folderName }}
                    </div>
                    <q-menu
                      v-if="editable"
                      transition-show="scale"
                      transition-hide="scale"
                      touch-position
                      context-menu
                    >
                      <q-list dense class="topTabContext">
                        <q-item class="context-title">
                          <q-item-section
                            ><q-icon :name="'folder'" color="orange" size="20px" class="q-mr-sm" />
                            {{ prop.node.folderName }}</q-item-section
                          >
                        </q-item>
                        <q-item clickable v-close-popup v-on:click="addFolder(prop.node)">
                          <q-item-section
                            ><q-icon class="text-dark q-mr-sm" name="add" />{{
                              $language('하위 폴더 추가')
                            }}
                          </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup v-on:click="changeFolder(prop.node)">
                          <q-item-section
                            ><q-icon class="text-dark q-mr-sm" name="published_with_changes" />{{
                              $language('폴더명 변경')
                            }}
                          </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup v-on:click="removeFolder(prop.node)">
                          <q-item-section
                            ><q-icon class="text-dark q-mr-sm" name="delete" />{{
                              $language('폴더 삭제')
                            }}
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </div>
                </div>
              </template>
            </q-tree>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <c-table
          :title="`${folderName} 목록`"
          ref="table"
          rowKey="id"
          :columns="gridProcedure.columns"
          :data="gridProcedure.data"
          :columnSetting="false"
          :isFullScreen="false"
          :usePaging="false"
          @linkClick="linkClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn
                v-if="editable && folderName"
                label="등록"
                icon="add"
                @btnClicked="linkClick"
              />
            </q-btn-group>
          </template>
        </c-table>
      </div>
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ dTitle }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="hiddenFolderName" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$language('취소')" @click="cancelFolderName" />
          <q-btn flat :label="$language('저장')" @click="saveFolderName" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
/******************************
 * #Important 사용하지 않는 로직, 변수 등 선언 X
 *******************************/
import { folderType } from './guideBook'

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
  name: 'processSafetyReport'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const message = useMessageStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

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
  columns?: Array<tableColumnType>
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
const popupOptions = ref<popupParamType>({
  isFull: false,
  width: '40%',
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  // plantCd: null,
  useFlag: 'Y',
  folderType: 'B'
})
const gridProcedure = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      style: 'width:80px',
      sortable: false
    },
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: 'Rev.',
      align: 'center',
      style: 'width:70px',
      sortable: false
    },
    {
      name: 'folderDetailName',
      field: 'folderDetailName',
      label: '제목',
      type: 'link',
      align: 'left',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'standardDate',
      field: 'standardDate',
      label: '기준일',
      align: 'center',
      style: 'width:100px',
      sortable: false
    }
  ],
  data: []
})
const totalGrid = ref({
  merge: [{ index: 0, colName: 'iepsFolderId' }],
  columns: [
    {
      name: 'folderName',
      field: 'folderName',
      label: '폴더명',
      align: 'left',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'revisionNum',
      field: 'revisionNum',
      label: 'Rev.',
      align: 'center',
      style: 'width:70px',
      sortable: false
    },
    {
      name: 'folderDetailName',
      field: 'folderDetailName',
      label: '제목',
      type: 'link',
      align: 'left',
      style: 'width:300px',
      sortable: false
    },
    {
      name: 'standardDate',
      field: 'standardDate',
      label: '기준일',
      align: 'center',
      style: 'width:100px',
      sortable: false
    }
  ],
  data: []
})
const saveData = ref<folderType>({
  iepsFolderId: '',
  iepsParentFolderId: '',
  folderName: '',
  plantCd: '',
  regUserId: '',
  chgUserId: ''
})
const gridFolder = ref<gridType>({
  data: []
})
const editable = ref(true)
const prompt = ref(false)
const hiddenFolderName = ref('')
const saveType = ref('')
const dTitle = ref('폴더')
const listUrl = ref('')
const saveUrl = ref('')
const deleteUrl = ref('')
const listDetailUrl = ref('')
const listDefaultUrl = ref('')
const folderName = ref('')
const iepsFolderId = ref('')
const treeHeight = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const dataTree = computed(() =>
  gridFolder.value.data
    ? arrayToTree(gridFolder.value.data, {
        parentProperty: 'iepsParentFolderId',
        customID: 'iepsFolderId'
      })
    : []
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
  listUrl.value = selectConfig.env.ieps.folder.list.url
  saveUrl.value = transactionConfig.env.ieps.folder.insert.url
  deleteUrl.value = transactionConfig.env.ieps.folder.delete.url
  listDetailUrl.value = selectConfig.env.ieps.folderDetail.list.url
  listDefaultUrl.value = selectConfig.env.ieps.folderDetail.defaultList.url
  // code setting
  treeHeight.value = window.innerHeight - 140 + 'px'
  // list settin
  getDefaultFiles()
  getList()
}
/******************************
 * TODO (목적): gridFolder 목록 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridFolder.value.data = _result.data
    iepsFolderId.value = ''
    folderName.value = ''
    gridProcedure.value.data = []
  })
}
/******************************
 * TODO (목적): 좌측 폴더 (row) 추가
 *******************************/
function addFolder(row: any) {
  if (!row) {
    dTitle.value = $language('최상위 폴더 추가')
    saveData.value = {
      iepsParentFolderId: ''
      // plantCd: searchParam.value.plantCd
    }
  } else {
    dTitle.value = $language('하위 폴더 생성')
    saveData.value = {
      iepsParentFolderId: row.iepsFolderId
      // plantCd: searchParam.value.plantCd
    }
  }
  saveType.value = 'POST'
  prompt.value = true
  hiddenFolderName.value = ''
}
/******************************
 * TODO (목적): 폴더명 변경
 *******************************/
function changeFolder(row: any) {
  dTitle.value = $language('폴더명 변경')
  saveType.value = 'PUT'
  prompt.value = true
  hiddenFolderName.value = row.folderName
  saveData.value = {
    iepsFolderId: row.iepsFolderId
    // plantCd: searchParam.value.plantCd
  }
}
/******************************
 * TODO (목적): 폴더 삭제
 *******************************/
function removeFolder(row: any) {
  message.confirm({
    title: '확인',
    message: '하위폴더도 모두 삭제됩니다. 삭제하시겠습니까?',
    type: 'warning', // success / info / warning / error
    confirmCallback: () => {
      $http({
        url: $format(deleteUrl.value, row.iepsFolderId),
        method: 'DELETE'
      }).then(() => {
        getList()
        message.requestSuccess()
      })
    },
    cancelCallback: () => {}
  })
}
/******************************
 * TODO (목적): 폴더명 지정 취소
 *******************************/
function cancelFolderName() {
  hiddenFolderName.value = ''
  prompt.value = false
}
/******************************
 * TODO (목적): 생성한 폴더 저장
 *******************************/
function saveFolderName() {
  prompt.value = false
  $http({
    url: saveUrl.value,
    method: saveType.value,
    data: {
      iepsFolderId: saveData.value.iepsFolderId,
      iepsParentFolderId: saveData.value.iepsParentFolderId,
      plantCd: saveData.value.plantCd,
      folderName: hiddenFolderName.value,
      folderType: 'B',
      regUserId: user.value.userId,
      chgUserId: user.value.userId
    }
  }).then(() => {
    message.requestSuccess()
    getList()
    hiddenFolderName.value = ''
  })
}
/******************************
 * TODO (목적): 좌측 폴더명 클릭시
 *******************************/
function rowClick(row: any) {
  iepsFolderId.value = row.iepsFolderId
  folderName.value = row.folderName
  $http({
    url: $format(listDetailUrl.value, row.iepsFolderId),
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    gridProcedure.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 우측 테이블 row 클릭시
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = `${folderName.value} 상세`
  popupOptions.value.param = {
    iepsFolderDetailId: row ? row.iepsFolderDetailId : '',
    iepsFolderId: iepsFolderId.value ? iepsFolderId.value : '',
    folderType: 'B'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./iepsReportDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '60%'
  popupOptions.value.closeCallback = closeDetailPopup
}
function closeDetailPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  rowClick({ iepsFolderId: iepsFolderId.value, folderName: folderName.value })
}
/******************************
 * TODO (목적): 전체파일목록 조회
 *******************************/
function getDefaultFiles() {
  $http({
    url: listDefaultUrl.value,
    method: 'GET',
    params: {
      folderType: 'B',
      useFlag: 'Y'
    }
  }).then((_result: any) => {
    totalGrid.value.data = _result.data
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
