<template>
  <div>
    <c-search-box @enter="getList" class="moc-dashboard-searchbox">
      <template v-slot:search>
        <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker type="year" label="년도" name="year" v-model:value="searchParam.year" />
        </div>
        <!-- <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3 col-xl-3">
          <c-task-target
            :customPopupParam="{ targetKey: 'equip' }"
            label="설비"
            name="equipmentCd"
            v-model:value="searchParam.equipmentCd"
          />
        </div>
      </template>
    </c-search-box>
    <div class="row bg-white">
      <div v-for="(step, idx) in stepItems" :key="idx" class="col moc-row">
        <q-table
          grid
          class="moc-dashboard-table"
          :class="idx !== 0 ? 'arrow-after' : ''"
          card-class="bg-primary text-white"
          :title="step.title + ' (' + (step.data ? step.data.length : 0) + ')'"
          :rows="step.data"
          :columns="columns"
          row-key="sopMocId"
          hide-header
          hide-bottom
        >
          <template v-slot:item="props">
            <div class="mb-1 widget-chart widget-chart2 text-left rounded-borders border">
              <div class="widget-chart-content">
                <div class="widget-chart-flex bg-light-blue-4 text-white">
                  <div class="widget-title q-pl-sm">
                    <span class="moc-title">{{ props.row.mocTitle }}</span
                    ><br />
                    <span class="text-caption">({{ props.row.mocNo }})</span>
                  </div>
                  <div class="widget-subtitle">
                    <q-btn
                      flat
                      round
                      color="grey-1"
                      icon="content_paste"
                      size="xs"
                      @click="detailPopup(props.row)"
                    /><br />
                    <span class="text-caption text-black q-pr-xs">
                      <q-badge color="orange">
                        {{ props.row.mocConfirmLevelName }}
                      </q-badge>
                    </span>
                  </div>
                </div>
                <q-list v-if="step.name === 'MS00000001'" dense>
                  <!-- 정상만 보여줌으로 표시할 필요 X
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <q-badge color="blue-grey">
                          변경구분
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ props.row.col3 }}</q-item-label>
                    </q-item-section>
                  </q-item> -->
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <q-badge color="blue-grey">
                          {{ $language('변경등급') }}
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ props.row.mocClass }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <q-badge color="blue-grey">
                          {{ $language('발의자') }}
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ props.row.initiative }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-list v-else-if="step.name === 'MS00000005'" dense>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <q-badge v-if="props.row.changeApprovalFlag === 'Y'" color="blue">
                          {{ $language('승인') }}
                        </q-badge>
                        <q-badge
                          v-if="props.row.changeApprovalFlag === 'N'"
                          color="red"
                          class="blinking"
                        >
                          {{ $language('미승인') }}
                        </q-badge>
                        <q-badge v-else color="grey">
                          {{ $language('처리중') }}
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ props.row.changeApprovalDate }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-list v-else-if="step.name === 'MS00000010'" dense>
                  <q-item v-for="(item, key) in props.row.relatedWorks" :key="key">
                    <q-item-section>
                      <q-item-label>
                        <q-badge color="blue-grey">
                          {{ item.mocRelatedTaskName }}
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>
                        <q-icon
                          v-for="(icon, iconIdx) in icons"
                          :key="iconIdx"
                          size="xs"
                          :name="icon"
                          :color="
                            Number(item.statusCheck) === iconIdx + 1 ? ratingColors[iconIdx] : ''
                          "
                        />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-list v-else-if="step.name === 'MS00000015'" dense>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <q-badge
                          v-if="props.row.prestartupCheckPunch === '미진행'"
                          color="red"
                          class="blinking"
                        >
                          {{ $language('가동전점검') }} {{ props.row.prestartupCheckPunch }}
                        </q-badge>
                        <q-badge
                          v-else-if="props.row.prestartupCheckPunch === '진행중'"
                          color="orange"
                        >
                          {{ $language('가동전점검') }} {{ props.row.prestartupCheckPunch }}
                        </q-badge>
                        <q-badge v-else color="light-green">
                          {{ $language('가동전점검') }} {{ props.row.prestartupCheckPunch }}
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- <q-item>
                    <q-item-section>
                      <q-item-label>
                        <q-badge color="blue-grey">
                          가동전점검 Punch list 건수
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label style="font-weight:800; font-size:16px">
                        <ICountUp :startVal="0" :endVal="props.row.prestartupCheckPunchCnt" :decimals="0"
                          :duration="4" :options="options" />
                      </q-item-label>
                    </q-item-section>
                  </q-item> -->
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <q-badge color="blue-grey">
                          {{ $language('MOC Punch list 건수') }}
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label style="font-weight: 800; font-size: 16px">
                        <ICountUp
                          :startVal="0"
                          :endVal="props.row.mocPunchCnt"
                          :decimals="0"
                          :duration="4"
                          :options="options"
                        />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <!-- <q-list v-else-if="step.name==='MS00000020'" dense>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        <q-badge color="blue-grey">
                          변경완료의견
                        </q-badge>
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label caption>{{ props.row.mocCompleteOpinion }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list> -->
              </div>
            </div>
          </template>
        </q-table>
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
import ICountUp from 'vue-countup-v3'

import { mocType } from '@/views/sop/moc/moc'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'mocDashboard'
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
interface stepItemType {
  name: string
  title: string
  icon: string
  data: Array<any>
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
  year: '2021',
  processCd: null,
  equipmentCd: null
})
const columns = ref([
  {
    name: 'mocNo',
    field: 'mocNo',
    label: '관리번호',
    align: 'center',
    sortable: false
  }
])
const ratingColors = ref(['red', 'orange', 'green'])
const icons = ref([
  'sentiment_very_dissatisfied',
  'sentiment_satisfied',
  'sentiment_very_satisfied'
])
const options = ref({
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
  prefix: '',
  suffix: '건'
})
const stepItems = ref<Array<stepItemType>>([])
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
  listUrl.value = selectConfig.sop.moc.change.status.url
  // code setting
  // list setting
  getList()
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function getList() {
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    stepItems.value = []
    getStepItems('MOC_NORMAL_STEP_CD').then((steps: any) => {
      _.forEach(steps, (item) => {
        stepItems.value.push({
          name: item.stepperMstCd,
          title: item.stepperMstCd !== 'MS00000015' ? item.stepperMstNm : $language('가동전점검'),
          icon: item.iconClass,
          data:
            item.stepperMstCd !== 'MS00000010'
              ? _.filter(_result.data, { mocStepCd: item.stepperMstCd })
              : _.filter(_result.data, { mocStepCd: 'MS00000015' })
        })
      })
    })
  })
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function detailPopup(row: mocType) {
  popupOptions.value.title = '변경관리 상세'
  popupOptions.value.param = {
    sopMocId: row.sopMocId,
    mocStepCd: row.mocStepCd,
    mocTypeCd: row.mocTypeCd
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./mocOnepageDashboard.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
<style lang="sass">
.dashStep
  border-top: 5px solid #1ab394
  border-radius: 0px
  .q-stepper__tab
    padding: 8px 0px 2px 0px
    border-right: 1px solid #607D8B
  .q-stepper__label
    margin-top: 0.2rem
    padding: 0px
    .q-stepper__title
      font-size: 0.82rem
  .q-stepper__dot
    font-size: 14px
    width: 22px
    min-width: 22px
    height: 22px
    .q-icon
      font-size: 13px
  .q-splitter__panel
    padding: 0 !important
  .q-stepper__header--border
    border-bottom: 0 !important
  .relative-position
    position: static
  .q-stepper--horizontal .q-stepper__line:after
    width: 0 !important
    height: 0 !important


.moc-row
  border-right: 1px solid #E0E0E0
  padding: 0 !important
.moc-dashboard-table
  border-top: 2px solid #1ab394
  border-radius: 0 !important
  // padding: 0 10px
  .q-table__grid-item
    min-width: 100%
  .q-table__top
    padding: 3px 5px !important
    justify-content: center
    background-color: #F5F5F5
    color: #009688

  .q-table__middle
    border-top: 1px solid #E0E0E0
  .row > .col-xs-12
    padding-left: 0.5rem !important
    padding-right: 0.5rem !important
    padding-bottom: 5px !important
  .widget-chart
    padding: 0px !important
    margin: 4px !important
    width:100%
  .q-list--dense>.q-item
    padding: 2px 3px !important
    min-height: 24px !important
.arrow-after:after
  content:""
  position: absolute
  height:0
  width:0
  left:0px
  top:0
  border:16px solid transparent
  // border-top: 10px solid #1ab394
  border-left: 16px solid #1ab394

.moc-dashboard-searchbox
  .q-field
    padding: 0px !important
</style>
