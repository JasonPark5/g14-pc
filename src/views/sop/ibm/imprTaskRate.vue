<template>
  <div>
    <c-table
      ref="table"
      title="개선 이행률 - 업무별"
      tableId="impr-rate-task"
      :columns="grid.columns"
      :data="grid.data"
      :showDescription="true"
      @linkClick="linkClick"
    >
      <!-- 버튼 영역 -->
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="getList" />
        </q-btn-group>
      </template>
      <template v-slot:description-td="props">
        <div class="row" style="align-items: center">
          <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 impr-item">
            <div class="pt-0 pb-0 card-body">
              <ul class="list-group list-group-flush">
                <li class="no-padding list-group-item">
                  <div class="widget-content p-0">
                    <div class="widget-content-outer">
                      <div class="widget-content-wrapper">
                        <div class="widget-content-left">
                          <div class="widget-heading">
                            {{ $language(props.row.ibmTaskTypeName) }} :
                            {{ $language('개선처리건 진행도') }}
                          </div>
                          <div class="widget-subheading">
                            <b>{{ $language('완료 건 수 / 요청 건 수') }}</b> :
                            <!-- {{ props.row.complete | toThousandFilter }} /
                            {{ props.row.requestTotal | toThousandFilter }} -->
                            {{ props.row.complete }} /
                            {{ props.row.requestTotal }}
                          </div>
                        </div>
                        <div class="widget-content-right">
                          <div class="widget-numbers text-focus">
                            {{ setPercent(props.row.requestTotal, props.row.complete) }}%
                          </div>
                        </div>
                      </div>
                      <div class="no-margin widget-progress-wrapper">
                        <div class="progress-bar-sm progress-bar-animated-alt progress">
                          <div
                            class="progress-bar bg-success"
                            role="progressbar"
                            aria-valuenow="43"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            :style="{
                              width: setPercent(props.row.requestTotal, props.row.complete) + '%'
                            }"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 impr-item">
            <div class="pt-0 pb-0 card-body">
              <ul class="list-group list-group-flush">
                <li class="no-padding list-group-item">
                  <div class="widget-content p-0">
                    <div class="widget-content-outer">
                      <div class="widget-content-wrapper">
                        <div class="widget-content-left">
                          <div class="widget-heading">
                            {{ $language(props.row.ibmTaskTypeName) }}
                          </div>
                          <div class="widget-subheading">
                            {{ $language('즉시처리건') }}
                          </div>
                        </div>
                        <div class="widget-content-right">
                          <div class="widget-numbers text-focus" style="text-align: end">
                            <span
                              class="count-up-wrapper-2 text-focus"
                              style="font-weight: 800; padding-right: 5px"
                            >
                              <ICountUp
                                :startVal="0"
                                :endVal="props.row.immTotal"
                                :decimals="0"
                                :duration="4"
                                :options="options"
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
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
import ICountUp from 'vue-countup-v3'
import { taskRateType } from './impr'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'imprTaskRate'
})

/******************************
 * @Pinia_store_선언
 * TODO 반응형 유지를 위해 storeToRefs 사용 (function은 사용 X)
 *******************************/
/** message 호출 */

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
  searchParam: searchParamType
}
interface searchParamType {
  plantCd: stringNull
  actionCompleteRequestDates: arrayString | null
  actionDeptCd: stringNull
  actionVendorCd: stringNull
  actionFlag: stringNull
  ibmTaskTypeCd: stringNull
}
interface gridType {
  columns: tableColumnType
  data: Array<taskRateType>
}
interface optionsType {
  useEasing: boolean
  useGrouping: boolean
  separator: stringNull
  decimal: stringNull
  prefix: stringNull
  suffix: stringNull
}

/******************************
 * @inject_선언
 *******************************/
const $language = inject('$language') as GetTranLanguageFunction

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
const imprProps = withDefaults(defineProps<propType>(), {
  searchParam: () => {
    return {
      plantCd: null,
      actionCompleteRequestDates: [],
      actionDeptCd: '',
      actionVendorCd: '',
      actionFlag: 'D',
      ibmTaskTypeCd: ''
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
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})
const grid = ref<gridType>({
  columns: [
    {
      name: 'ibmTaskTypeName',
      field: 'ibmTaskTypeName',
      label: '업무',
      align: 'center',
      style: 'width:120px',
      sortable: false,
      type: 'link'
    },
    {
      name: 'impr',
      field: 'impr',
      label: '개선처리건',
      align: 'center',
      child: [
        {
          name: 'requesting',
          field: 'requesting',
          label: '요청중',
          align: 'right',
          style: 'width:80px',
          sortable: false,
          type: 'cost'
        },
        {
          name: 'receipting',
          field: 'receipting',
          label: '조치부서 접수중',
          align: 'right',
          style: 'width:80px',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'actioning',
          field: 'actioning',
          label: '조치부서 조치중',
          align: 'right',
          style: 'width:80px',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'confirming',
          field: 'confirming',
          label: '요청부서 검토중',
          align: 'right',
          style: 'width:80px',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'complete',
          field: 'complete',
          label: '개선완료',
          align: 'right',
          style: 'width:80px',
          sortable: true,
          type: 'cost'
        },
        {
          name: 'overAction',
          field: 'overAction',
          label: '지연 건수',
          align: 'right',
          style: 'width:80px',
          sortable: true,
          type: 'cost'
        }
      ]
    },
    {
      name: 'immTotal',
      field: 'immTotal',
      label: '즉시처리건',
      align: 'center',
      style: 'width:100px',
      sortable: true,
      type: 'cost'
    }
  ],
  data: []
})
const options = ref<optionsType>({
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
  prefix: '',
  suffix: ''
})
const curSearchParam = ref<searchParamType>({
  plantCd: null,
  actionCompleteRequestDates: [],
  actionDeptCd: '',
  actionVendorCd: '',
  actionFlag: null,
  ibmTaskTypeCd: ''
})
const listUrl = ref('')

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
  listUrl.value = selectConfig.sop.ibm.improve.status.task.url
  // code setting
  options.value.suffix = ' ' + $language('건')
  // list setting
  getList()
}
/******************************
 * TODO (목적): 개선 이행율 조회
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: imprProps.searchParam
  }).then((_result: any) => {
    _.extend(curSearchParam.value, imprProps.searchParam)
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 개선 이행율 상세
 *******************************/
function linkClick(row: taskRateType) {
  popupOptions.value.title =
    $language('업무별 개선 이행률 상세') + ' [' + $language(row.ibmTaskTypeName) + ']'
  curSearchParam.value.ibmTaskTypeCd = row.ibmTaskTypeCd
  popupOptions.value.isFull = true
  popupOptions.value.param = {
    tab: 'task',
    clickInfo: row.ibmTaskTypeName,
    data: row,
    searchParam: curSearchParam.value
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./imprActionRateDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}

function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}
/******************************
 * TODO (목적): % 계산
 *******************************/
function setPercent(total: number, complete: number) {
  return total > 0 ? _.round((complete / total) * 100, 2) : 0
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style scoped>
.widget-numbers {
  font-size: 20px;
}
.impr-item {
  height: 100% !important;
}
</style>
