<template>
  <q-form ref="editForm">
    <c-card title="테스트">
      <template v-slot:card-button>
        <q-btn-group outline>
          <c-btn label="test" icon="system_update_alt" @btnClicked="valid" />
        </q-btn-group>
      </template>
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-checkbox
            required
            :comboItems="comboItems"
            itemText="codeName"
            itemValue="code"
            label="기본"
            name="col1"
            v-model:value="testData.col1"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-checkbox
            required
            isFlag
            trueLabel="true"
            falseLabel="false"
            label="기본"
            name="col99"
            v-model:value="testData.col99"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept required type="edit" label="부서" name="col102" v-model:value="testData.col102" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-dept-multi
            required
            :parentCheckDepts="deptCd"
            plantCd="1000"
            label="관리부서"
            name="deptCd"
            v-model:value="deptCd"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-field
            :required="true"
            :data="testData"
            deptValue="deptCd"
            type="plant_dept_user"
            label="관리감독자"
            name="col20"
            :isWrite="true"
            userName="userName"
            v-model:value="testData.col20"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-multi-field
            :required="true"
            :data="testData"
            label="안전관리자"
            type="user"
            name="col21"
            v-model:value="testData.col21"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-multi-select
            required
            :comboItems="comboItems"
            :isObject="true"
            itemText="codeName"
            itemValue="code"
            valueText="value"
            valueKey="key"
            type="search"
            label="comboItems multi select"
            name="col14"
            v-model:value="testData.col14"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-radio
            required
            :comboItems="comboItems"
            label="radio1"
            name="radio1"
            v-model:value="testData.col5"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-tag
            required
            itemText="codeName"
            itemValue="code"
            label="교관"
            name="col16"
            v-model:value="testData.col16"
            icon="person"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target
            required
            plantCd="1000"
            name="equip"
            label="설비"
            :customPopupParam="{ targetKey: 'equip' }"
            v-model:value="testData.col17"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-task-target-tree
            :required="true"
            plantCd="1000"
            targetKey="equipClass"
            label="설비유형"
            name="equipmentTypeCd"
            v-model:value="testData.equipmentTypeCd"
          />
        </div>
        <!-- <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker
            required
            type="month"
            default="today"
            label="달력(월)"
            name="col2"
            v-model:value="testData.col2"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker label="달력(일)" name="col3" v-model:value="testData.col3" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker range label="기간" name="col6" v-model:value="testData.col6" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            required
            :comboItems="comboItems"
            itemText="codeName"
            type="search"
            itemValue="code"
            label="comboItems으로 들고오기"
            name="col4"
            v-model:value="testData.col4"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            codeGroupCd="PLANT_CD"
            itemText="codeName"
            type="search"
            itemValue="code"
            label="codeGrp으로 들고오기"
            name="col4"
            v-model:value="testData.col10"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-select
            stepperGrpCd="EDU_STEP_CD"
            type="search"
            itemText="stepperMstNm"
            itemValue="stepperMstCd"
            label="stepperGrp으로 들고오기"
            name="col4"
            v-model:value="testData.col11"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-plant required type="edit" name="col103" v-model:value="testData.col103" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            required
            type="number"
            label="숫자"
            name="col12"
            suffix="원"
            v-model:value="testData.col12"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text required label="텍스트" name="col13" v-model:value="testData.col13" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-text
            required
            label="텍스트"
            name="col13"
            v-model:value="testData.col13"
            prefix="설비"
          />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-datepicker range label="기간" name="col6" v-model:value="testData.col6" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-label-text title="저장시설" value="탱크1" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <c-qr-btn mobileUrl="/sai/tbm/tbm?tbmId=" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <c-upload :attachInfo="attachInfo" />
        </div> -->
      </template>
    </c-card>
  </q-form>
</template>

<script setup lang="ts">
defineOptions({
  name: 'IndexPage'
})
/** message 호출 */
const message = useMessageStore()

const testData = ref({
  col1: '1',
  col2: '',
  col3: '',
  col4: '1',
  col5: '2',
  col6: [],
  col30: 123,
  col98: [
    { a: '1', b: '1' },
    { a: '3', b: '3' }
  ],
  col99: 'N',
  col100: '1',
  col101: '1',
  col102: '',
  col103: null,
  col10: '',
  col11: '',
  col12: '',
  col13: '',
  col20: 'U000000001',
  col21: 'U000000001,U000000002',
  col14: [
    { key: '1', value: '1' },
    { key: '2', value: '2' }
  ],
  col17: '',
  col16: [
    {
      code: '1',
      codeName: '홍길동'
    },
    {
      code: '2',
      codeName: '김길동'
    }
  ],
  equipmentTypeCd: ''
})
const deptCd = ref('D10001,D10002')
const comboItems = ref([
  { code: '1', codeName: '1' },
  { code: '2', codeName: '2' },
  { code: '3', codeName: '3' }
])
const editForm = ref<any>(null)

function valid() {
  editForm.value.validate().then((_result: boolean) => {
    if (_result) {
      message.alert({
        title: '확인',
        message: '유효성 통과',
        type: 'info' // success / info / warning / error
      })
    } else {
      message.validError()
    }
  })
}
</script>
