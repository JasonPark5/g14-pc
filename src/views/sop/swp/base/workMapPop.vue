<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5">
        <c-card title="지도 미리보기" class="cardClassDetailForm" :noMarginPadding="true">
          <template v-slot:card-detail>
            <div class="col-12">
              <q-img :src="mapSrc" fit="scale-down" :contain="true" :ratio="1">
                <template v-slot:loading>
                  <q-spinner-gears color="white" />
                </template>
              </q-img>
            </div>
          </template>
        </c-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7">
        <c-table
          ref="table"
          title="지도 목록"
          :columns="grid.columns"
          :data="grid.data"
          gridHeight="640px"
          :filtering="false"
          :columnSetting="false"
          selection="single"
          rowKey="sopMapId"
          @rowDblclick="rowDblclick"
        >
          <!-- 버튼 영역 -->
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="검색" icon="search" @btnClicked="getList" />
              <c-btn v-if="editable" label="선택" icon="check" @btnClicked="select" />
            </q-btn-group>
          </template>
          <template v-slot:customArea="{ props }">
            <q-btn
              round
              unelevated
              size="6px"
              color="amber"
              icon="search"
              @click="rowClick(props.row)"
            />
          </template>
        </c-table>
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
import { workMapType } from './workMap'
import noImage from '@/assets/images/no-image.png'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'workMapPop'
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
    type: string
    plantCd: stringNull
  }
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
      type: 'single',
      plantCd: ''
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
const searchParam = ref({
  plantCd: null,
  useFlag: 'Y',
  haveMap: 'show'
})
const mapSrc = ref(noImage)
const grid = ref({
  columns: [
    {
      name: 'src',
      field: 'src',
      label: '미리보기',
      align: 'center',
      style: 'width:50px',
      type: 'custom',
      sortable: false
    },
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width:100px'
    },
    {
      name: 'mapName',
      field: 'mapName',
      label: '지도명',
      align: 'left',
      sortable: true,
      style: 'width:300px'
    }
  ],
  data: []
})
const listUrl = ref('')
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
  listUrl.value = selectConfig.sop.swp.map.list.url
  // code setting
  if (props.popupParam.plantCd) {
    searchParam.value.plantCd = props.popupParam.plantCd
  }
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
  })
}
/******************************
 * TODO (목적): 행 클릭
 * @param (1): 행 정보
 *******************************/
function rowClick(row: workMapType) {
  if (row) {
    previewImage({
      sysAttachFileId: row.sysAttachFileId,
      contentType: row.contentType
    }).then((_result) => {
      mapSrc.value = String(_result)
    })
  } else mapSrc.value = noImage
}
/******************************
 * TODO (목적): 행 선택
 *******************************/
function select() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '지도를 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
  } else {
    emits('closePopup', selectData)
  }
}
/******************************
 * TODO (목적): 행 더블 클릭
 * @param (1): 행 정보
 *******************************/
function rowDblclick(row: workMapType) {
  if (props.popupParam.type === 'single') {
    emits('closePopup', [row])
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.work-map-chip
  .q-chip__content
    display: none
</style>
