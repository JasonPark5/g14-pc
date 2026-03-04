<template>
  <div>
    <c-table
      ref="table1"
      title="화학물질 변경내역 목록"
      :gridHeight="gridChembase.height"
      :columns="gridChembase.columns"
      :data="history.chemBases"
      :columnSetting="false"
      :filtering="true"
    >
      <template v-slot:customArea="{ props, col }">
        <template v-if="col.name === 'materialNames' && props.row.jsonMaterials">
          <template v-for="(id, index) in props.row.jsonMaterials.arrayMaterialIds" :key="index">
            <q-btn
              class="tableinnerBtn"
              :class="{
                'tableinnerBtn-left': col.align === 'left' ? true : false,
                'tableinnerBtn-right': col.align === 'right' ? true : false,
                'tableinnerBtn-ellipsis': col.ellipsis == true ? true : false
              }"
              flat
              color="blue-6"
              :label="props.row.jsonMaterials.arrayMaterialNames[index]"
              @click.stop="linkClick(id)"
            />
          </template>
        </template>
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
  name: 'regulDbUploadHistory'
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
interface propType {
  popupParam: {
    chmRegulDbUploadId: string
  }
  contentHeight: stringNull
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
      chmRegulDbUploadId: ''
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
const editable = ref(true)
const history = ref({
  chmRegulDbUploadId: '',
  chemBases: [],
  chems: []
})
const gridChembase = ref({
  columns: [
    {
      name: 'chemName',
      field: 'chemName',
      label: '화학물질',
      align: 'left',
      style: 'width:250px',
      sortable: false
    },
    {
      name: 'chembase',
      field: 'chembase',
      label: '화학물질',
      child: [
        {
          name: 'flag',
          field: 'flag',
          label: '변경유형',
          align: 'center',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'changeContents',
          field: 'changeContents',
          label: '변경내용',
          align: 'left',
          style: 'width:200px',
          sortable: false,
          type: 'html'
        }
      ]
    },
    {
      name: 'regul',
      field: 'regul',
      label: '규제항목',
      child: [
        {
          name: 'billItemName',
          field: 'billItemName',
          label: '법규·규제',
          align: 'left',
          style: 'width:200px',
          sortable: false
        },
        {
          name: 'flagRegul',
          field: 'flagRegul',
          label: '변경유형',
          align: 'center',
          style: 'width:50px',
          sortable: false
        },
        {
          name: 'changeContentsRegul',
          field: 'changeContentsRegul',
          label: '변경내용',
          align: 'left',
          style: 'width:250px',
          sortable: false,
          type: 'html'
        }
      ]
    },
    {
      name: 'materialNames',
      field: 'materialNames',
      label: '영향화학자재',
      align: 'left',
      type: 'custom',
      style: 'width:150px',
      sortable: true
    }
  ],
  height: '760px'
})
const listUrl = ref('')
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

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
  listUrl.value = selectConfig.chm.db.regulDbUpload.hostory.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적): 규제DB업로드 변경내역 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      chmRegulDbUploadId: props.popupParam.chmRegulDbUploadId
    }
  }).then((_result: any) => {
    _.forEach(_result.data.chemBases, (_item) => {
      if (_item.materialIds) {
        const arrayMaterialNames = _item.materialNames.split(',')
        const arrayMaterialIds = _item.materialIds.split(',')

        _item.jsonMaterials = {
          arrayMaterialIds: arrayMaterialIds,
          arrayMaterialNames: arrayMaterialNames
        }
      }
    })

    _.extend(history.value, _result.data)
  })
}

function linkClick(id: string) {
  popupOptions.value.title = '화학자재 상세'
  popupOptions.value.param = {
    mdmChemMaterialId: id,
    tabName: 'chemEtc'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/mdm/mam/chemDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}

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
