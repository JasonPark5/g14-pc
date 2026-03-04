<template>
  <div>
    <!-- <c-search-box @enter="getList">
      <template v-slot:search>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div>
      </template>
    </c-search-box> -->
    <c-table
      ref="table"
      title="사업장별 수질 검사항목"
      :columns="plantGrid.columns"
      :data="plantGrid.data"
      :columnSetting="false"
      :isExcelDown="false"
      selection="multiple"
      rowKey="envWaterPlantInspectItemId"
      :filtering="false"
      gridHeight="830px"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="추가" v-if="editable" icon="add" @btnClicked="addRow" />
          <c-btn
            label="저장"
            v-if="editable"
            icon="save"
            :url="saveUrl"
            :isSubmit="isSave"
            :param="plantGrid.data"
            mappingType="PUT"
            @beforeAction="saveitem"
            @btnCallback="saveCallback"
          />
          <c-btn label="삭제" v-if="editable" icon="remove" @btnClicked="removeRow" />
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
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
import { plantMstType } from './waterMasterType'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'waterMaster0601'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
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
  columns: tableColumnType
  data: Array<plantMstType>
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
const editable = ref(true)
const listUrl = ref('')
const deleteUrl = ref('')
const saveUrl = ref('')
const isSave = ref(false)
const table = ref<any>(null)
const useFlagItems = ref<Array<codeMasterType>>([])
const popupOptions = ref<popupParamType>({
  width: '50%',
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
const plantGrid = ref<gridType>({
  columns: [
    {
      name: 'plantCd',
      field: 'plantCd',
      label: '사업장',
      style: 'width:50px',
      align: 'center',
      type: 'plant',
      sortable: true
    },
    {
      name: 'envWaterMstInspectItemName',
      field: 'envWaterMstInspectItemName',
      label: '검사항목',
      style: 'width: 250px',
      align: 'center',
      sortable: true
    },
    {
      name: 'legalStandard',
      field: 'legalStandard',
      label: '법적기준',
      align: 'center',
      type: 'cost',
      style: 'width: 100px',
      sortable: true
    },
    {
      name: 'innerStandard',
      field: 'innerStandard',
      label: '내부기준',
      align: 'center',
      type: 'number',
      style: 'width: 100px',
      sortable: true
    }
  ],
  data: []
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
  listUrl.value = selectConfig.env.water.mst.inspect.plant.url
  deleteUrl.value = transactionConfig.env.water.mst.inspect.plant.delete.url
  saveUrl.value = transactionConfig.env.water.mst.inspect.plant.save.url
  // code setting
  useFlagItems.value = [
    { code: 'Y', codeName: $language('사용') },
    { code: 'N', codeName: $language('미사용') }
  ]
  // list setting
  getList()
}
/******************************
 * TODO (목적): 사업장 목록
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    plantGrid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 팝업열기, 닫기
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function addRow() {
  popupOptions.value.title = '수질 검사항목 검색'
  popupOptions.value.param = {
    type: 'multiple'
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./waterInspectItemPop.vue`))
  )
  popupOptions.value.width = '50%'
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeitem
}
function closeitem(data: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (data && data.length > 0) {
    _.forEach(data, (item) => {
      if (
        _.findIndex(plantGrid.value.data, {
          envWaterMstInspectItemId: item.envWaterMstInspectItemId
        }) === -1
      ) {
        plantGrid.value.data.splice(0, 0, {
          envWaterPlantInspectItemId: uid(), // 사업장별 수질 검사항목 일련번호
          plantCd: searchParam.value.plantCd, // 사업장코드
          envWaterMstInspectItemId: item.envWaterMstInspectItemId, // 수질 검사항목 일련번호
          envWaterMstInspectItemName: item.envWaterMstInspectItemName,
          legalStandard: item.legalStandard,
          innerStandard: null, // 내부기준
          editFlag: 'C',
          regUserId: user.value.userId
        })
      }
    })
  }
}
/******************************
 * TODO (목적): 저장
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function saveitem() {
  if (validTable(plantGrid.value.columns, plantGrid.value.data)) {
    const saveData = _.filter(plantGrid.value.data, (x) => x.editFlag === 'U' || x.editFlag === 'C')
    if (saveData.length > 0) {
      $http({
        url: listUrl.value,
        method: 'GET'
      }).then((_result: any) => {
        let duplicateFlag = false
        _.forEach(saveData, (item) => {
          // 전체
          const allCheck = _.filter(_result.data, (data) => {
            return (
              data.plantCd === item.plantCd &&
              data.envWaterMstInspectItemId === item.envWaterMstInspectItemId &&
              (item.editFlag !== 'U' ||
                data.envWaterPlantInspectItemId !== item.envWaterPlantInspectItemId)
            )
          })
          // 현재 테이블
          const currentCheck = _.filter(plantGrid.value.data, {
            plantCd: item.plantCd,
            envWaterMstInspectItemId: item.envWaterMstInspectItemId
          })
          if (allCheck.length > 0 || currentCheck.length !== 1) {
            duplicateFlag = true
            return false
          }
        })
        if (!duplicateFlag) {
          message.confirm({
            title: '확인',
            message: '저장하시겠습니까?',
            type: 'info',
            confirmCallback: () => {
              isSave.value = !isSave.value
            },
            cancelCallback: () => {}
          })
        } else message.validError()
      })
    } else message.validError()
  }
}
/******************************
 * TODO (목적): 삭제 (제외)
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function removeRow() {
  const selectData = table.value.getSelected()
  if (!selectData || selectData.length === 0) {
    message.alert({
      title: '안내',
      message: '선택된 항목이 없습니다.',
      type: 'warning'
    })
  } else {
    message.confirm({
      title: '확인',
      message: '삭제하시겠습니까?',
      type: 'warning',
      confirmCallback: () => {
        $http({
          url: deleteUrl.value,
          method: 'DELETE',
          data: Object.values(selectData)
        }).then((_result: any) => {
          _.forEach(selectData, (item) => {
            plantGrid.value.data = _.reject(plantGrid.value.data, item)
          })
          message.requestSuccess()
        })
      }
    })
  }
}
function saveCallback() {
  message.requestSuccess()
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
