<template>
  <div>
    <c-search-box @enter="search">
      <template v-slot:search>
        <!-- <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-plant type="search" name="plantCd" v-model:value="searchParam.plantCd" />
        </div> -->
        <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <c-datepicker
            default="today"
            type="year"
            label="년도"
            name="year"
            v-model:value="searchParam.year"
          />
        </div>
      </template>
    </c-search-box>
    <c-table
      ref="table"
      title="시설 자체점검 목록"
      tableId="facilitySelfCheck"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :columnSetting="false"
      :usePaging="false"
      @linkClick="linkClick"
    >
      <template v-slot:suffixTitle>
        <span style="font-size: 0.8em; font-weight: 500; padding-left: 20px" class="iconWrapper">
          <q-icon name="done" color="positive" /> : {{ $language('점검완료') }} &nbsp;&nbsp;
          <q-icon name="build" color="orange" /> : {{ $language('점검중') }} &nbsp;&nbsp;
          <q-icon name="error" color="red" /> : {{ $language('금주 미진행') }} &nbsp;&nbsp;
          <q-icon name="close" color="red" /> : {{ $language('미진행') }} &nbsp;&nbsp;
        </span>
      </template>
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn label="검색" icon="search" @btnClicked="search" />
        </q-btn-group>
      </template>
      <template v-slot:customArea="{ props, col }">
        <template v-if="!isNaN(props.row[col.name])">
          <template v-if="Number(props.row[col.name]) === 1">
            <q-icon
              :name="props.row['complete' + col.label] === 'Y' ? 'done' : 'build'"
              :color="props.row['complete' + col.label] === 'Y' ? 'positive' : 'orange'"
              class="cursor-pointer"
              @click="openPop(props.row, col, 1)"
            />
          </template>
          <template v-else-if="Number(props.row[col.name]) > 1">
            <q-btn
              class="tableinnerBtn"
              flat
              :align="col.align"
              color="blue-6"
              :label="props.row[col.name]"
              @click.stop="openPop(props.row, col, 2)"
            />
          </template>
          <template v-else-if="Number(props.row[col.name]) === 0">
            <template v-if="col.name === 'weeks' + curWeeks">
              <q-icon
                name="error"
                class="text-red cursor-pointer"
                @click="openPop(props.row, col, 0)"
              />
            </template>
            <template v-else-if="Number(col.label) < curWeeks || curWeeks === 0">
              <q-icon
                name="close"
                class="text-red cursor-pointer"
                @click="openPop(props.row, col, 0)"
              />
            </template>
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
import moment from 'moment'

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
  name: 'hazardFacilitySelfCheckWeeks'
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
  year: getThisYear(),
  facilityCd: ''
})
const grid = ref({
  columns: [] as any,
  data: []
})
const year = ref('')
const weeksUrl = ref('')
const listUrl = ref('')
const table = ref<any>(null)

/******************************
 * @Computed_선언
 *******************************/
const curWeeks = computed(() => {
  if (year.value === getThisYear()) {
    return getCurWeek()
  } else {
    return 0
  }
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
  weeksUrl.value = selectConfig.com.weeks.list.url
  listUrl.value = selectConfig.env.facilitySelfCheck.weeks.url
  // code setting
  // list setting
  search()
}
function search() {
  setColumns()
  getList()
}
function setColumns() {
  $http({
    url: weeksUrl.value,
    method: 'GET',
    params: { year: searchParam.value.year }
  }).then((_result: any) => {
    const _columns = [
      // {
      //   fix: true,
      //   name: 'plantName',
      //   field: 'plantName',
      //   label: '사업장',
      //   align: 'center',
      //   style: 'width:100px',
      //   sortable: false
      // },
      {
        fix: true,
        name: 'facilityName',
        field: 'facilityName',
        label: '시설명',
        align: 'left',
        style: 'width:160px',
        type: 'link',
        sortable: false
      }
    ] as any
    if (_result.data && _result.data.length > 0) {
      const months = [] as any
      let i = 1
      _.forEach(_.uniq(_.map(_result.data, 'month')), (month) => {
        const weeks = [] as any
        let _width = 0
        _.forEach(_.filter(_result.data, { month: month }), (week) => {
          weeks.push({
            name: 'weeks' + week.weeks,
            field: 'weeks' + week.weeks,
            label: week.weeks,
            align: 'center',
            style: 'width:30px',
            type: 'custom',
            headerColor: week.weeks === String(curWeeks.value) ? '#FFCDD2' : '',
            sortable: false
          })
          _width += 50
        })
        months.push({
          name: 'month' + i,
          field: 'month' + i,
          label: i + '월',
          style: 'width:' + _width + 'px',
          child: weeks
        })
        i++
      })
      grid.value.columns = _.concat(_columns, {
        name: 'year',
        field: 'year',
        label: searchParam.value.year + '년',
        child: months
      })
    }
    // if (curWeeks.value > 0) {
    //   setTimeout(() => {
    //     const table = this.$refs['table'].$refs['compo-table'].$children[7].$el
    //     const tr = this.$refs['table'].$refs['ctr'][2]
    //     if (tr) {
    //       this.$set(table, 'scrollLeft', 300 + 50 * this.curWeeks - table.offsetWidth)
    //     }
    //   }, 100)
    // }
  })
}
/******************************
 * TODO (목적): 시설 조회
 *******************************/
function getList() {
  if (!searchParam.value.year) {
    message.alert({
      title: '안내',
      message: '점검년도를 선택하세요.',
      type: 'warning' // success / info / warning / error
    })
    return
  }
  year.value = _.clone<string>(searchParam.value.year)
  $http({
    url: listUrl.value,
    method: 'GET',
    params: searchParam.value
  }).then((_result: any) => {
    grid.value.data = _result.data
  })
}
/******************************
 * TODO (목적): 시설 팝업 표시
 * @param (1): 행 정보
 *******************************/
function linkClick(row?: any) {
  popupOptions.value.title = '시설 상세'
  popupOptions.value.param = {
    facilityCd: row ? row.facilityCd : ''
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`./hazardFacilityDetail.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = true
  popupOptions.value.closeCallback = closePopup
}
/******************************
 * TODO (목적): 시설 팝업 닫기
 *******************************/
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
function openPop(row: any, col: any, count: any) {
  /**
   * count가 0인 경우 자체점검 등록하는 팝업을
   *         1인 경우 자체점검 key값을 찾은 후 팝업을
   *         2인 경우 자체점검 key값들을 찾은 후 자체점검 목록을 보여주는 팝업을
   */
  if (count === 0) {
    popupOptions.value.title = '시설 자체점검 상세'
    popupOptions.value.param = {
      hcfHazardFacilitySelfCheckId: '',
      facilityCd: row.facilityCd,
      selfCheckDate:
        Number(col.label) - curWeeks.value !== 0
          ? moment()
              .weekday(7 * (Number(col.label) - curWeeks.value))
              .format('YYYY-MM-DD')
          : getToday()
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./hazardFacilitySelfCheckDetail.vue`))
    )
    popupOptions.value.isFull = true
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closeCheckPopup
  } else if (count === 1) {
    popupOptions.value.title = '시설 자체점검 상세'
    popupOptions.value.param = {
      hcfHazardFacilitySelfCheckId: row['id' + col.label]
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./hazardFacilitySelfCheckDetail.vue`))
    )
    popupOptions.value.isFull = true
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closeCheckPopup
  } else {
    popupOptions.value.title = '시설 자체점검'
    popupOptions.value.param = {
      hcfHazardFacilitySelfCheckIds: row['id' + col.label]
    }
    popupOptions.value.target = shallowRef(
      defineAsyncComponent(() => import(`./hazardFacilitySelfCheckWeeksPop.vue`))
    )
    popupOptions.value.isFull = false
    popupOptions.value.width = '70%'
    popupOptions.value.visible = true
    popupOptions.value.closeCallback = closeCheckPopup
  }
}
function closeCheckPopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  getList()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
