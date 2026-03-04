<template>
  <div>
    <c-search-box @enter="getList">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept
            :editable="editable"
            label="관리부서"
            name="deptCd"
            v-model:value="searchParam.deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            label="관련공정"
            name="processCd"
            :customPopupParam="{ targetKey: 'process' }"
            v-model:value="searchParam.processCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-select
            codeGroupCd="SOP_FIRE_FIGHTING_TYPE_CD"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="sopFireFightingTypeCd"
            label="유형"
            v-model:value="searchParam.sopFireFightingTypeCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            :comboItems="disposeFlagItems"
            type="search"
            itemText="codeName"
            itemValue="code"
            name="disposeFlag"
            label="폐기여부"
            v-model:value="searchParam.disposeFlag"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="소방설비 목록"
      :columns="grid.columns"
      :data="grid.data"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <q-btn
            v-if="editable"
            :label="$language('QR코드 (이슈점검용)')"
            size="xs"
            icon="qr_code_scanner"
            color="black"
          >
            <q-popup-proxy>
              <span action="#" id="printJS-form">
                <div class="row" style="width: 800px">
                  <div v-for="(fireFighting, idx) in grid.data" :key="idx" class="col-3">
                    <q-card flat bordered style="height: 190px">
                      <q-card-section
                        class="bg-primary text-white"
                        style="
                          padding: 6px 0;
                          text-align: center;
                          font-weight: bolder;
                          font-size: 0.9em;
                        "
                      >
                        {{ fireFighting.fireFightingName }} /
                        {{ fireFighting.sopFireFightingTypeName }}
                      </q-card-section>
                      <q-separator />
                      <q-card-section horizontal>
                        <q-card-section style="padding: 0; margin: auto">
                          <vue-qrcode
                            :value="
                              serverUrl +
                              '/common/fireFighting/fireFightingQrSelect?sopFireFightingId=' +
                              fireFighting.sopFireFightingId
                            "
                            :options="{ width: 150, errorCorrectionLevel: 'L' }"
                            class="canvas"
                          />
                        </q-card-section>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </span>
              <q-btn size="xs" icon="print" color="grey" @click.prevent="print" />
            </q-popup-proxy>
          </q-btn>
          <c-btn v-if="editable" label="등록" icon="add" @btnClicked="linkClick" />
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
import printJs from 'print-js'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { storeToRefs } from 'pinia'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'fireFightingMaster'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
const serverHost = useServerHostStore()
const { serverUrl } = storeToRefs(serverHost)

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
  deptCd: null,
  processCd: null,
  sopFireFightingTypeCd: null,
  disposeFlag: 'N'
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'plantName',
      field: 'plantName',
      label: '사업장',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'manageNo',
      field: 'manageNo',
      label: '관리번호',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'fireFightingName',
      field: 'fireFightingName',
      label: '소방설비',
      align: 'left',
      sortable: true,
      style: 'width: 250px',
      type: 'link'
    },
    {
      name: 'sopFireFightingTypeName',
      field: 'sopFireFightingTypeName',
      label: '유형',
      align: 'center',
      sortable: true,
      style: 'width: 100px'
    },
    {
      name: 'processName',
      field: 'processName',
      label: '관련공정',
      align: 'left',
      sortable: true,
      style: 'width: 350px'
    },
    {
      name: 'deptName',
      field: 'deptName',
      label: '관리부서',
      align: 'left',
      sortable: true,
      style: 'width: 350px'
    },
    {
      name: 'disposeFlag',
      field: 'disposeFlag',
      label: '폐기여부',
      align: 'center',
      sortable: true,
      style: 'width: 70px'
    }
  ],
  data: []
})
const editable = ref(true)
const listUrl = ref('')
const disposeFlagItems = ref<Array<codeMasterType>>([])

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
  listUrl.value = selectConfig.fft.fireFighting.list.url
  // code setting
  disposeFlagItems.value = [
    { code: 'N', codeName: $language('미폐기') },
    { code: 'Y', codeName: $language('폐기') }
  ]
  // list setting
  getList()
}

/******************************
 * TODO (목적): 목록 조회
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
 * TODO (목적): 상세보기 팝업
 *******************************/
function linkClick(row: any) {
  popupOptions.value.title = '소방설비 상세'
  popupOptions.value.param = { sopFireFightingId: row ? row.sopFireFightingId : '' }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./fireFightingMasterDetail.vue`))
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
 * TODO (목적): 출력
 *******************************/
function print() {
  printJs({
    printable: 'printJS-form',
    type: 'html',
    font_size: '20px',
    targetStyles: ['*']
  })
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
