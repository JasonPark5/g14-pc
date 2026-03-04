<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-search-box @enter="getList">
          <template v-slot:search>
            <!-- <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
            </div> -->
            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <c-select
                :comboItems="useFlagItems"
                type="search"
                itemText="codeName"
                itemValue="code"
                name="useFlag"
                label="사용여부"
                v-model:value="searchParam.useFlag"
              />
            </div>
          </template>
        </c-search-box>
        <c-table
          ref="table"
          title="지도 목록"
          tableId="riskHazrd01"
          :columns="grid.columns"
          :data="grid.data"
          :filtering="false"
          :columnSetting="false"
          :changeData="grid.changeData"
          :editable="editable"
          @linkClick="linkClick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn v-if="editable" label="등록" icon="add" @btnClicked="add" />
              <c-btn label="검색" icon="search" @btnClicked="getList" />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props, col }">
            <template v-if="col.name === 'src'">
              <q-btn
                round
                unelevated
                size="6px"
                color="amber"
                icon="search"
                @click="imageLoad(props.row)"
              />
            </template>
          </template>
        </c-table>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <c-card title="지도 미리보기" class="cardClassDetailForm" :noMarginPadding="true">
          <template v-slot:card-button>
            <q-btn-group outline>
              <c-btn
                v-if="haveMap"
                class="custom-btn"
                size="md"
                text-color="white"
                color="teal-6"
                :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                :label="$language('지도 크게 보기')"
                @btnClicked="toggle"
              />
            </q-btn-group>
          </template>
          <template v-slot:card-detail>
            <q-img :src="mapSrc" fit="contain" ref="image" style="height: 780px">
              <template v-slot:loading>
                <q-spinner-gears color="white" />
              </template>
            </q-img>
          </template>
        </c-card>
      </div>
    </div>
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
import { workMapType } from './workMap'
import noImage from '@/assets/images/no-image.png'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'workMap'
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
const editable = ref(true)
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y'
})
const mapSrc = ref(noImage)
const grid = ref({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:85px'
    },
    {
      name: 'mapName',
      field: 'mapName',
      label: '지도명',
      align: 'left',
      sortable: true,
      style: 'width:200px',
      type: 'link'
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      sortable: true,
      style: 'width:40px'
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      sortable: true,
      style: 'width:50px'
    },
    {
      name: 'src',
      field: 'src',
      label: '미리보기',
      align: 'center',
      style: 'width:50px',
      type: 'custom',
      sortable: false
    }
  ],
  data: [],
  changeData: false
})
const useFlagItems = ref<Array<codeMasterType>>([])
const listUrl = ref('')
const image = ref<any>(null)
const $q = useQuasar()

/******************************
 * @Computed_선언
 *******************************/
const haveMap = computed(() => mapSrc.value !== noImage)

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
  listUrl.value = selectConfig.sop.swp.map.list.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 지도 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
    grid.value.changeData = !grid.value.changeData
  })
}
/******************************
 * TODO (목적): 지도 이미지 미리보기 조회
 *******************************/
function imageLoad(row: workMapType) {
  if (row) {
    previewImage({
      sysAttachFileId: row.sysAttachFileId,
      contentType: row.contentType
    }).then((_result: any) => {
      mapSrc.value = new URL(_result, import.meta.url).href
    })
  } else mapSrc.value = noImage
}
/******************************
 * TODO (목적): 지도 full size로 보기
 *******************************/
function toggle() {
  const target = image.value.$el // e.target.parentNode.parentNode.parentNode
  $q.fullscreen.toggle(target)
}
/******************************
 * TODO (목적): 지도 추가 버튼 클릭
 *******************************/
function add() {
  linkClick()
}
/******************************
 * TODO (목적): 지도 상세 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row?: workMapType) {
  popupOptions.value.title = '지도 상세'
  popupOptions.value.param = {
    sopMapId: row ? row.sopMapId : ''
  }
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import(`./workMapDetail.vue`)))
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 지도 상세 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
