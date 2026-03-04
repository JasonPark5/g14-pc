<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <c-table
          ref="typeTable"
          title="점검종류"
          :columns="kindgrid.columns"
          :data="kindgrid.data"
          :usePaging="false"
          :columnSetting="false"
          :isFullScreen="false"
          :filtering="false"
          :isExcelDown="false"
          @rowClick="
            (row: any, idx: number) => {
              isSelectGrp = true
              selectedGroup = row
              getItemList()
            }
          "
        />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
        <c-table
          ref="itemTable"
          title="점검항목"
          :columns="itemgrid.columns"
          :data="itemgrid.data"
          :usePaging="false"
          :columnSetting="false"
        >
          <template v-slot:table-chip>
            <q-chip
              dense
              outline
              square
              :label="selectedGroup.codeName"
              color="blue"
              style="float: left"
            />
            <c-radio
              style="display: inline; float: left; width: 200px"
              :comboItems="[
                { code: 'Y', codeName: $language('사용') },
                { code: 'N', codeName: $language('미사용') },
                { code: null, codeName: $language('전체') }
              ]"
              class="no-label-control q-ml-md"
              label=""
              dense
              name="useFlag"
              v-model:value="searchParam.useFlag"
              @input="getItemList"
            />
          </template>
          <template v-slot:table-button>
            <q-btn-group outline>
              <c-btn label="추가" icon="add" @btnClicked="addrow" v-if="editable && isSelectGrp" />
              <c-btn
                label="저장"
                icon="save"
                @btnClicked="saveMst"
                v-if="editable && isSelectGrp && itemgrid.data.length > 0"
              />
            </q-btn-group>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'hpgCheckItem'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */
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
  columns: Array<tableColumnType>
  data: Array<codeMasterType>
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
const searchParam = ref<any>({
  useFlag: 'Y'
})
const itemTable = ref<any>(null)
const editable = ref(true)
const isSelectGrp = ref(false)
const selectedGroup = ref<codeMasterType>({
  code: null,
  codeName: null
})
const listUrl = ref('')
const saveUrl = ref('')
const kindgrid = ref<gridType>({
  columns: [
    {
      name: 'codeName',
      field: 'codeName',
      label: '점검종류',
      align: 'left',
      sortable: false
    }
  ],
  data: []
})
const itemgrid = ref<gridType>({
  columns: [
    {
      name: 'divisionName',
      field: 'divisionName',
      label: '구분',
      align: 'left',
      type: 'text',
      style: 'width:240px',
      sortable: false,
      required: true
    },
    {
      name: 'itemName',
      field: 'itemName',
      label: '점검항목',
      align: 'left',
      type: 'text',
      // style: 'width:400px',
      sortable: false,
      required: true
    },
    {
      name: 'sortOrder',
      field: 'sortOrder',
      label: '순번',
      align: 'center',
      type: 'number',
      style: 'width:60px',
      sortable: false
    },
    {
      name: 'useFlag',
      field: 'useFlag',
      label: '사용여부',
      align: 'center',
      style: 'width:60px',
      sortable: false,
      type: 'check',
      true: 'Y',
      false: 'N'
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
  listUrl.value = selectConfig.sop.heq.hpg.item.list.url
  saveUrl.value = transactionConfig.sop.heq.hpg.item.save.url
  // code setting
  // list setting
  getComboItems('CHECK_CYCLE_CD').then((_result: any) => {
    kindgrid.value.data = _.filter(_result, (row: any) => row.attrVal3 === 'Y')
  })
}
function getItemList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: {
      useFlag: searchParam.value.useFlag,
      checkTypeCd: selectedGroup.value.code
    }
  }).then((_result: any) => {
    itemgrid.value.data = _result.data
  })
}
function addrow() {
  itemgrid.value.data.push({
    hpgCheckItemId: uid(),
    checkTypeCd: selectedGroup.value.code,
    divisionName: '',
    itemName: '',
    sortOrder: itemgrid.value.data.length + 1,
    useFlag: 'Y',
    editFlag: 'C',
    regUserId: user.value.userId
  })
}
function saveMst() {
  if (validTable(itemgrid.value.columns, itemgrid.value.data)) {
    const saveData = itemgrid.value.data.filter((x: any) => x.editFlag == 'C' || x.editFlag == 'U')
    if (saveData.length > 0) {
      message.confirm({
        title: '확인',
        message: '저장하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          $http({
            url: saveUrl.value,
            method: 'POST',
            data: saveData
          }).then((_result: any) => {
            message.requestSuccess()
            getItemList()
          })
        },
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
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
