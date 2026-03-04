<template>
  <div>
    <!-- c-card는 카드 형태의 UI 박스 컴포넌트 -->
    <c-card title="기본정보" class="cardClassDetailForm">
      <!-- card-detail 슬롯 안에 실제 내용 작성 -->
      <template v-slot:card-detail>
        <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <!-- 진행단계를 선택할 수 있는 드롭다운 박스 -->
          <!-- <c-select
            codeGroupCd="PATROL_STATUS_CD"
            itemText="codeName"
            itemValue="code"
            label="진행단계"
            type="edit"
          /> 
          사용자가 더 선택할 수 있음 -->

          <c-select
            :comboItems="statusItems"
            itemText="codeName"
            itemValue="code"
            label="진행단계"
            type="search"
            name="status"
            v-model:value="data.status"
          />
        </div>
      </template>
    </c-card>
    <!-- 메인 화면으로 가는 버튼 -->
    <div @click="router.push('/main/indexDirector')">클릭</div>

    <!-- 팝업 열기 버튼 -->
    <!-- linkClick()은 실제 사용할 값을 넣는 거  -->
    <div @click="linkClick">{{ text }}</div>

    <!-- 팝업창 컴포넌트 -->
    <!-- 자식에게 "param"이라는 이름으로 전달해주고
     script부분에서 popupOpions의 데이터를 정의한다 -->
    <c-dialog :param="popupOptions" />
  </div>
</template>

<script setup lang="ts">
// 라우터 객체 불러오기
const router = useRouter()

// 팝업을 만들 때 초기화를 시켜줘야함
// 팝업 관련 설정들을 담은 객체 (CDialog 컴포넌트에 전달됨)
// popupOptions의 구조가 popupParamType과 같다는 걸 타입스크립트에 알려줌
const popupOptions = ref<popupParamType>({
  isFull: true,
  target: null,
  title: 'ddddd',
  visible: false,
  param: {},
  closeCallback: () => {}
})

// 버튼에 표시될 텍스트
// 팝업을 닫으면 '닫음'으로 변경됨
const text = ref<stringNull>('클릭하고 팝업창 닫으면 이름 바뀜')

// 드롭다운 항목 목록
const statusItems = ref<Array<codeMasterType>>([])

// 드롭다운에서 선택된 값을 담는 객체
const data = ref({
  status: ''
})

// 드롭다운 값이 바뀔 때마다 콘솔에 출력
watch(
  () => data.value.status,
  () => {
    console.log(data.value.status)
  }
)

// 컴포넌트가 처음 마운트될 때 실행되는 초기화 함수
onMounted(() => {
  init()
})

// 드롭다운 항목 초기화
function init() {
  statusItems.value = [
    { code: 'start', codeName: '시작' },
    { code: 'middle', codeName: '중간' },
    { code: 'end', codeName: '끝' }
  ]
}

// 팝업 열기 함수
// 팝업을 열고나서 보여줄 데이터를 여기다가 작성
const linkClick = (row: object | any) => {
  popupOptions.value.title = 'test'
  popupOptions.value.param = {}
  // 동적으로 컴포넌트를 import하여 팝업에 넣음
  popupOptions.value.target = shallowRef(defineAsyncComponent(() => import('@views/test/nyj2.vue')))
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closePopup // 팝업 닫기 버튼 누르면 colsecallback실행
}

// 팝업 닫기 함수
const closePopup = () => {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  text.value = '닫음' // 텍스트를 '닫음'으로 변경
}
</script>
