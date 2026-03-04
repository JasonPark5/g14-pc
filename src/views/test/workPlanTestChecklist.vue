<template>
  <div>
    <c-table
      ref="table"
      title="유해 · 위험요인 Check List 목록"
      :columns="grid.columns"
      :data="grid.data"
      :filtering="false"
      :isExcelDown="false"
      :columnSetting="false"
      :usePaging="false"
      :editable="editable"
    >
      <template v-slot:table-button>
        <q-btn-group outline>
          <c-btn v-if="editable" label="저장" icon="save" />
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'ctoChecklist'
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
  popupParam: {
    sopCtoId: stringNull
  }
  isOld: boolean
  disabled: boolean
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
      sopCtoId: ''
    }
  },
  isOld: false,
  disabled: false
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
  target: null,
  title: '',
  visible: false,
  width: '90%',
  param: {},
  closeCallback: () => {}
})
const grid = ref<any>({
  columns: [
    {
      name: 'test0',
      field: 'test0',
      label: '번호',
      align: 'left',
      type: 'number',
      style: 'width:50px',
      sortable: false
    },
    {
      name: 'test1',
      field: 'test1',
      label: '유해 · 위험요인 파악용 점검표',
      align: 'left',
      type: 'text',
      style: 'width:500px',
      sortable: false
    },
    {
      name: 'test3',
      field: 'test3',
      label: '점검일자',
      type: 'date',
      style: 'width:120px',
      sortable: false
    },
    {
      name: 'test4',
      field: 'test4',
      label: '점검결과',
      style: 'width:80px',
      headType: 'select',
      align: 'center',
      type: 'select',
      setHeader: true,
      codeGroupCd: 'ENV_NOISE_COMPLIANCE_YN',
      sortable: false
    },
    {
      name: 'test5',
      field: 'test5',
      label: '점검자',
      align: 'center',
      type: 'text',
      style: 'width:80px',
      sortable: false
    }
  ],
  data: [
    {
      test0: 1,
      test1: '작업위치나 프로세스가 위험을 만드는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 2,
      test1: '작업지역에 접근할 적절한 통행로가 있는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 3,
      test1: '작업자가 고온에 노출되는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 4,
      test1: '작업환경(고온, 바람, 분진)이 위험을 만드는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 5,
      test1: '제한공간에 들어가는 작업인가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 6,
      test1: '작업이 적절한 안전난간대가 설치되지 않은 고소(사다리, 작업발판, 지붕 등)인가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 7,
      test1: '작업도구 및 장비가 위험을 만드는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 8,
      test1: '과도한 소음 및 진동이 있는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 9,
      test1: '의복이나 신체 일부가 설비에 끼이거나 감길 수 있는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 10,
      test1: '작업도구 및 장비가 해당 작업에 적절한가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 11,
      test1: '화학물질이 사용되는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 12,
      test1: '작업자가 화학물질 또는 독성가스에 접촉될 수 있는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 13,
      test1: '화학물질이 대기 중으로 누출되는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 14,
      test1: '작업자가 전기적 위험에 노출되는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 15,
      test1: '작업지역에 추락위험이 있는 부분이 있는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 16,
      test1: '작업자가 압력, 전기, 스팀 또는 낙하물과 같은 위험 에너지원에 노출되는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 17,
      test1: '기계 또는 프로세스가 자동으로 가동 및 정지되는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 18,
      test1: '작업자는 해당 작업을 수행하기에 적절한가? (지식, 경험, 훈련, 적합성, 피로 문제 등)',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 19,
      test1: '재료를 올리거나, 운반하거나, 밀거나 또는 당기는 작업에서 상해의 위험이 있는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 20,
      test1: '해당 작업에 적절한 개인보호구를 사용하는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 21,
      test1:
        '장치는 에너지가 제거되고, 내용물이 비워지고, 가스는 제거되고, 해당지역은 격리되고, 잠금장치가 설치되는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 22,
      test1: '비상조치계획이 있고 작업자는 그것을 잘 알고 있는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    },
    {
      test0: 23,
      test1: '작업 시 화재 위험성이 존재하는가?',
      test3: '2025-10-17',
      test4: 'ENC0000001',
      test5: '송지수'
    }
  ]
})
const saveUrl = ref('')
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
  saveUrl.value = transactionConfig.sop.cto.checklist.save.url
  // code setting
  console.log('props', props)
  // list setting
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
