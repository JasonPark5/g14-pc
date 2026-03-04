<template>
  <div>
    <c-card class="cardClassDetailInfo" :noHeader="true">
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="사업장" :value="equipData.plantName" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="설비유형" :value="equipData.equipmentTypeName" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="설비관리번호" :value="equipData.equipmentNo" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <c-label-text title="설비명" :value="equipData.equipmentName" />
        </div>
      </template>
    </c-card>
    <c-tab
      type="tabcard"
      align="left"
      :tabItems="tabItems"
      :height="tabHeight"
      :inlineLabel="true"
      v-model:value="tab"
    >
      <template v-slot:default="tab">
        <component :is="tab.component" :popupParam="tab.param" />
      </template>
    </c-tab>
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
import { equipPopupParamType, equipType } from './equipment'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'equipmentPsm'
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
  popupParam: equipPopupParamType
  equipData: equipType
  isOld: boolean
  contentHeight: string
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
      equipmentCd: '',
      plantCd: '',
      psmFlag: ''
    }
  },
  equipData: () => {
    return {
      plantCd: null, // 사업장코드
      plantName: '', // 사업장
      equipmentTypeCd: null, // 설비유형 코드
      equipmentTypeName: '', // 설비유형명
      equipmentCd: '', // 설비코드
      equipmentNo: '', // 설비코드
      equipmentName: '', // 설비명
      mainProcessCd: '', // 주공정
      subProcessCd: '', // 부공정
      managementDepts: '', // 관리부서
      equipmentLocation: '', // 설비위치
      installDate: '', // 설치일자
      installVendor: '', // 설치업체
      opertationDate: '', // 가동일자
      checkPassNo: '', // 검사합격번호
      checkPassDate: '', // 합격일자
      discardFlag: 'N',
      discardDate: '', // 폐기일자
      psmFlag: 'N', // PSM 대상 여부
      psmTypeCd: null,
      amount: '', // 수량
      lawEquipmentFlag: 'N', // 법정설비 여부
      inspectionCycleCd: null, // 법정점검 주기
      selfCycleCd: null, // 자체점검 주기
      pmCycleCd: null, // 자체점검 주기
      pmFlag: 'N', // 예방정비 여부
      cmFlag: 'N', // 고장정비 여부
      predictiveFlag: 'N', // 예지정비 여부
      operFlag: 'N', // 운전정비 여부
      relatedLaws: '', // 관련법규
      recentInspectionDate: '', // 최근 점검일자
      outsourcingVendor: '', // 유지보수업체
      hazardousFlag: 'N',
      equipGradeCd: null,
      regUserId: '',
      chgUserId: ''
    }
  },
  isOld: false,
  contentHeight: 'auto'
})

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const editable = ref(false)
const tab = ref('psmtab1')
const tabItems = ref<Array<tabItemsType>>([])
const listUrl = ref('')

/******************************
 * @Computed_선언
 *******************************/
const tabHeight = computed(() => {
  let height = !Number.isNaN(props.contentHeight) ? Number(props.contentHeight) - 36 : 800
  if (height < 500) {
    height = 500
  }
  return String(height)
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
  listUrl.value = selectConfig.mdm.equipment.psm.list.url
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
  if (props.popupParam.equipmentCd) {
    $http({
      url: listUrl.value,
      method: 'GET',
      params: {
        equipmentCd: props.popupParam.equipmentCd
      }
    }).then((_result: any) => {
      if (_result.data) {
        if (_result.data.length == 1) {
          if (_result.data[0].pid == 'NOT') {
            tabSettingPid(_result.data[0])
          } else {
            tabSetting(_result.data)
          }
        } else {
          tabSetting(_result.data)
        }
      }
    })
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function tabSettingPid(_data: any) {
  if (props.popupParam.equipmentCd) {
    tabItems.value = []
    let pageurl = undefined
    let _param = {}
    if (_data.ptype == 'MPTC000001') {
      pageurl = import(`@views/psi/pfi/powerMachineDetail.vue`)
      _param = { popeditable: true, psiEquipmentCd: props.popupParam.equipmentCd }
    } else if (_data.ptype == 'MPTC000002') {
      pageurl = import(`@views/psi/pfi/deviceEquipmentDetail.vue`)
      _param = { popeditable: true, psiEquipmentCd: props.popupParam.equipmentCd }
    } else if (_data.ptype == 'MPTC000003') {
      pageurl = import(`@views/psi/pfi/safetyValveRuptureDiskDetail.vue`)
      _param = { popeditable: true, psiEquipmentCd: props.popupParam.equipmentCd }
    }
    if (pageurl) {
      tabItems.value.push({
        name: 'psmtab1',
        icon: 'info',
        label: _data.pname,
        param: _param,
        component: shallowRef(defineAsyncComponent(() => pageurl))
      })
      tab.value = 'psmtab1'
    }
  }
}
/******************************
 * TODO (목적):
 * @param (1):
 * @param (2):
 * @return (반환):
 *******************************/
function tabSetting(_data: any) {
  if (props.popupParam.equipmentCd) {
    tabItems.value = []
    let cnt = 1
    _.forEach(_data, (item) => {
      if (item.pid != 'NOT') {
        let pageurl = undefined
        let _param = {}
        if (item.ptype == 'power') {
          pageurl = import(`@views/psi/pfi/powerMachineDetail.vue`)
          _param = { popeditable: true, psiPowerEquipmentId: item.pid }
        } else if (item.ptype == 'device') {
          pageurl = import(`@views/psi/pfi/deviceEquipmentDetail.vue`)
          _param = { popeditable: true, psiDeviceEquipmentId: item.pid }
        } else if (item.ptype == 'valve') {
          pageurl = import(`@views/psi/pfi/safetyValveRuptureDiskDetail.vue`)
          _param = { popeditable: true, psiValveRuptureId: item.pid }
        }
        if (pageurl) {
          tabItems.value.push({
            name: 'psmtab' + cnt,
            icon: 'info',
            label: item.pname,
            param: _param,
            component: shallowRef(defineAsyncComponent(() => pageurl))
          })
        }
        cnt++
      }
    })
    if (_data.length > 0) {
      tab.value = 'psmtab1'
    }
  }
}

/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
