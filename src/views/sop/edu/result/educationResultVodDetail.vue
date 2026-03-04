<template>
  <div class="video-detail">
    <div class="row">
      <div class="col-2">
        <c-label-text title="교육명" :value="educationInfo.educationName" />
      </div>
      <div class="col-2">
        <c-label-text title="교육과정" :value="educationInfo.educationCourseName" />
      </div>
      <div class="col-2">
        <c-label-text title="교육종류1" :value="educationInfo.educationKindCdLargeName" />
      </div>
      <div class="col-2">
        <c-label-text title="교육종류2" :value="educationInfo.educationKindCdSmallName" />
      </div>
      <div class="col-2">
        <c-label-text title="사업장" :value="educationInfo.plantName" />
      </div>
      <div class="col-2">
        <c-label-text title="주관부서" :value="educationInfo.departmentDeptName" />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xl-10 vod-label-layer-vod">
        <div class="player-center">
          <video
            ref="videoRef"
            :src="videoSrc"
            :controls="true"
            :autoplay="false"
            :loop="false"
            :muted="false"
            class="video-element"
            controlsList="nodownload"
            @contextmenu.prevent
            @loadedmetadata="updateDuration"
            @timeupdate="updateCurrentTime"
          />
        </div>
      </div>
      <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 vod-label-layer text-grey-7">
        <div class="vod-label-div" v-if="isEduEnd">
          {{ $language('이수완료') }} : {{ isEduEndDate }}
        </div>
        <div class="vod-label-div" v-else>
          {{ $language('재생시간') }} : {{ vodPlayDuration }} / {{ vodTotalDuration }}
        </div>
        <div class="vod-label-div">
          <c-btn
            btnclass="full-width"
            label="처음부터 재생"
            icon="skip_next"
            color="orange"
            @btnClicked="onPlayerPlayFirst"
            v-if="isFirstPlay && !isPlay && !isEduEnd && educationInfo.isQuestionFlag != 'Y'"
          />
        </div>
        <!-- 연속재생 -->
        <div class="vod-label-div">
          <c-btn
            btnclass="full-width"
            :label="playLabel"
            :icon="playIcon"
            :color="playColor"
            @btnClicked="onPlayerPlay"
            v-if="!isEduEnd && educationInfo.isQuestionFlag != 'Y'"
          />
        </div>
        <div
          class="vod-label-div"
          v-if="
            isEnd &&
            !isPlay &&
            !isEduEnd &&
            educationInfo.isQuestionFlag != 'Y' &&
            educationInfo.eduQuestionFlag == 'Y'
          "
        >
          <!-- && !isEduQuestionPass" 문제풀이후 서명시 풀이버튼 안보이게 하려면 이를 위 vif에 넣고 아래서 빼면됨 -->
          <div class="mt-4 mb-1" v-if="educationInfo.isQuestionFlag === 'N' && !isEduQuestionPass">
            {{ $language('서명/의견은 문제풀이 후 입력할 수 있습니다.') }}
          </div>
          <c-btn
            btnclass="full-width"
            label="문제풀이"
            icon="task_alt"
            color="teal-6"
            @btnClicked="openQuiz"
          />
        </div>
        <div class="vod-label-div my-3" v-if="educationInfo.isQuestionFlag === 'Y'">
          {{ $language('획득점수 / 통과기준점수 : ') }} {{ educationInfo.score }} /
          {{ educationInfo.eduQuestionPassScore }} {{ $language('점') }}<br />
          {{ $language('문제풀이 시간 : ') }}
          <span v-if="educationInfo.eqrRegDt"> {{ educationInfo.eqrRegDt.split('.')[0] }} </span>
        </div>
        <div
          v-show="
            (educationInfo.isQuestionFlag === 'Y' || educationInfo.eduQuestionFlag === 'N') &&
            !disabled &&
            !educationInfo.electronSignature
          "
        >
          <div class="container signature-border vod-label-div">
            <div class="row items-center all-pointer-events">
              <b
                ><span id="signatureTitle">&nbsp;&nbsp;{{ $language('서명') }}</span></b
              >
            </div>
            <VueSignaturePad
              id="signature"
              width="90%"
              height="200px"
              ref="signaturePad"
              :options="options"
            />
          </div>
          <div
            class="text-center my-1"
            v-show="
              (educationInfo.isQuestionFlag === 'Y' || educationInfo.eduQuestionFlag === 'N') &&
              !disabled &&
              !educationInfo.electronSignature
            "
          >
            <q-btn-group outline>
              <c-btn label="서명지우기" icon="remove" color="red-6" @btnClicked="onSighRemove" />
              <c-btn
                label="교육이수 완료"
                icon="task_alt"
                color="teal-6"
                @btnClicked="eduComplete"
              />
            </q-btn-group>
          </div>
          <div class="mt-2">
            <c-textarea
              :disabled="disabled"
              :rows="2"
              label="의견"
              name="opinionContent"
              v-model:value="educationInfo.opinionContent"
            />
          </div>
        </div>
        <div class="vod-label-div text-center my-3" v-if="disabled">
          {{ $language('교육완료 또는 이수완료 되었습니다.') }}
        </div>
        <div class="vod-label-div-text">
          {{
            $language(
              '※ 재생/중지/완료 버튼을 클릭하지 않고 창을 닫을 경우 동영상 재생이력이 저장되지 않습니다.'
            )
          }}
        </div>
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

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'educationResultVodDetail'
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
const videoRef = ref<any>(null)
const videoSrc = ref('')
const signaturePad = ref<any>(null)
const isEduEnd = ref(false)
const isEduEndDate = ref('')
const options = ref<any>({
  penColor: '#000000'
})
const isEduQuestionPass = ref(true)
const isEnd = ref(false)
const isFirstPlay = ref(true)
const isPost = ref(true)
const isInterval = ref<any>(null)
const playDuraionTime = ref(0)
const isPlay = ref(false)
const playLabel = ref('재생')
const playColor = ref('blue')
const playIcon = ref('play_arrow')
const vodTotalDuration = ref('')
const vodTotalDurationS = ref(0)
const vodPlayDuration = ref('')
const educationInfo = ref<any>({
  eduEducationId: '',
  educationName: '',
  eduCourseId: '',
  plantCd: '',
  educationCourseName: '',
  educationKindCdLarge: null,
  educationKindCdSmall: null,
  educationTypeCd: null,
  departmentDeptCd: '',
  departmentDeptName: '',
  executionBudget: '',
  estimatedEducationExpenses: '',
  educationMethodName: '',
  educationMethodCd: null,
  educationOverview: '',
  evaluationEvalCd: null,
  documentStatusCd: '',
  qrCodeRoute: '',
  vod: null,
  regUserId: '',
  chgUserId: '',
  eduSubjectList: [], // 과정별 교육과목
  eduAttendeeList: [],
  eduEvalUserList: [],
  deleteEduEvalUserList: [],
  eduQuestionFlag: 'N', // 교육에 문제풀이 포함 여부
  eduQuestionMstId: '',
  eduQuestionPassScore: 0,
  score: null,
  opinionContent: '',
  electronSignature: '',
  attendeesId: '',
  attendeesNo: '',
  attendanceTime: '',
  checkCompleteFlag: '',
  isQuestionFlag: 'N', // 문제풀이하여 통과 기록 보유 여부
  eqrRegDt: ''
})

const getUrl = ref('')
const insertUrl = ref('')
const updateUrl = ref('')
const updateSignatureUrl = ref('')
/******************************
 * @Computed_선언
 *******************************/
const disabled = computed(
  () =>
    educationInfo.value.documentStatusCd === 'ESC000010' ||
    educationInfo.value.checkCompleteFlag === 'Y'
)

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onMounted(() => {
  init()
})
onDeactivated(() => {
  clearInterval(isInterval.value)
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
  getUrl.value = selectConfig.sop.edu.vod.get.url
  insertUrl.value = transactionConfig.sop.edu.vod.insert.url
  updateUrl.value = transactionConfig.sop.edu.vod.update.url
  updateSignatureUrl.value = transactionConfig.sop.edu.plan.update.targetUser.signature.url
  // code setting
  // list setting
  getData()
  getDetail()
}
function setData() {
  getData()
}

function updateDuration() {
  if (videoRef.value) {
    vodTotalDurationS.value = videoRef.value.duration
  }
}

function updateCurrentTime() {
  if (videoRef.value) {
    vodPlayDuration.value = getPlayTime(videoRef.value.currentTime)
  }
}
function onSighRemove() {
  signaturePad.value.clearSignature()
  educationInfo.value.electronSignature = ''
}
function convertFloat(number: numberNull) {
  if (number) {
    return parseFloat(number)
  } else {
    return 0
  }
}
function getDetail() {
  // 해당 교육용 동영상정보 호출

  $http({
    url: selectConfig.sop.edu.result.get.pcvod.url,
    method: 'GET',
    params: {
      eduEducationId: route.query.eduEducationId,
      userId: user.value.userId
    }
  }).then((_result: any) => {
    _.extend(educationInfo.value, _result.data)
    if (educationInfo.value.eduQuestionFlag == 'Y') {
      isEduQuestionPass.value = false
    } else {
      isEduQuestionPass.value = true
    }
    if (educationInfo.value.electronSignature) {
      signaturePad.value.fromDataURL(educationInfo.value.electronSignature)
    }
    if (
      educationInfo.value.documentStatusCd === 'ESC000010' ||
      educationInfo.value.checkCompleteFlag === 'Y'
    ) {
      signaturePad.value.lockSignaturePad()
      isEduQuestionPass.value = true
    }
    if (educationInfo.value.educationMethodCd == 'EMC999999') {
      const _div = document.getElementsByClassName('mobilevod')[0]
      if (_div) {
        _div.classList.remove('mobilevod-hide')
      }
    }

    if (import.meta.env.VITE_UPLOAD_TYPE == 'AWS') {
      // AWS S3용
      $http({
        url: selectConfig.com.upload.vodDownS3.url,
        method: 'GET',
        params: {
          sysAttachFileId: _result.data.vod
        }
      }).then((_result2: any) => {
        const src = _result2.data
        playVideo(src)
        setData()
      })
    } else {
      // DISK 저장용
      const src =
        import.meta.env.VITE_API_URL + selectConfig.com.upload.vodDown.url + '/' + _result.data.vod
      playVideo(src)
      setData()
    }

    if (educationInfo.value.eduQuestionFlag == 'Y') {
      isEduQuestionPass.value = false
    } else {
      isEduQuestionPass.value = true
    }
  })
}
function getData() {
  if (route.query.eduEducationId) {
    $http({
      url: getUrl.value,
      method: 'GET',
      params: {
        eduEducationId: route.query.eduEducationId,
        attendeesId: user.value.userId
      }
    }).then((_result: any) => {
      if (_result.data) {
        playDuraionTime.value = convertFloat(_result.data.vodCurrentTime)
        vodPlayDuration.value = getPlayTime(_result.data.vodCurrentTime)
        vodTotalDurationS.value = convertFloat(_result.data.vodTotalTime)
        vodTotalDuration.value = getPlayTime(vodTotalDurationS.value)
        if (_result.data.vodCurrentTime) {
          videoRef.value.currentTime = convertFloat(_result.data.vodCurrentTime)
        }
        playLabel.value = '연속재생'
        isPost.value = false
        isFirstPlay.value = true

        if ((playDuraionTime.value / vodTotalDurationS.value) * 100 > 90) {
          isEnd.value = true
        }

        if (_result.data.checkCompleteFlag == 'Y') {
          isEduEndDate.value = _result.data.evaluationDate
          isEduEnd.value = true
        }
      } else {
        isPost.value = true
        isFirstPlay.value = false
      }
    })
  }
}
function eduComplete() {
  let data = ''
  if (signaturePad.value.saveSignature()) data = signaturePad.value.saveSignature().data
  educationInfo.value.electronSignature = data

  if (educationInfo.value.electronSignature) {
    message.confirm({
      title: '확인',
      message: '교육 이수를 완료하시겠습니까?',
      type: 'warning', // success / info / warning / error
      // 확인 callback 함수
      confirmCallback: () => {
        $http({
          url: updateSignatureUrl.value,
          method: 'PUT',
          data: {
            electronSignature: educationInfo.value.electronSignature,
            attendeesId: user.value.userId,
            eduEducationId: route.query.eduEducationId,
            regUserId: user.value.userId,
            chgUserId: user.value.userId,
            checkCompleteFlag: 'Y',
            opinionContent: educationInfo.value.opinionContent
          }
        }).then((_result: any) => {
          message.requestSuccess()

          isEduEnd.value = true
          getData()
        })
      },
      // 취소 callback 함수
      cancelCallback: () => {}
    })
  } else {
    message.alert({
      title: '안내',
      message: '서명하세요.',
      type: 'warning' // success / info / warning / error
    })
  }
}
function savePlayTime() {
  if (playDuraionTime.value > vodTotalDurationS.value) {
    playDuraionTime.value = vodTotalDurationS.value // 최대값 설정
  }
  let httpUrl = updateUrl.value
  let httpType = 'PUT'
  if (isPost.value) {
    httpUrl = insertUrl.value
    httpType = 'POST'
    isPost.value = false
  }
  $http({
    url: httpUrl,
    method: httpType,
    data: {
      eduEducationId: route.query.eduEducationId,
      attendeesId: user.value.userId,
      vodTotalTime: videoRef.value.duration,
      vodPlayTime: videoRef.value.currentTime,
      vodCurrentTime: videoRef.value.currentTime,
      regUserId: user.value.userId,
      chgUserId: user.value.userId
    }
  }).then((_result: any) => {})
}
function onPlayerPlayFirst() {
  // clearInterval(isInterval.value)
  videoRef.value?.pause()
  isPlay.value = false
  playLabel.value = '재생'
  playColor.value = 'blue'
  playIcon.value = 'play_arrow'
  isFirstPlay.value = false
  playDuraionTime.value = 0
  videoRef.value.currentTime = 0
  onPlayerPlay()
}
function onPlayerPlay() {
  if (!isPlay.value) {
    vodTotalDurationS.value = videoRef.value.duration
    vodTotalDuration.value = getPlayTime(videoRef.value.duration)
    videoRef.value?.play()
    isPlay.value = true
    playLabel.value = '중지'
    playColor.value = 'red'
    playIcon.value = 'pause'
  } else {
    videoRef.value?.pause()
    isPlay.value = false
    playLabel.value = '재생'
    playColor.value = 'blue'
    playIcon.value = 'play_arrow'

    // 전체 동영상시간 대비 90%이상 플레이시 교육완료 가능
    if ((videoRef.value.currentTime / videoRef.value.duration) * 100 > 90) {
      isEnd.value = true
    }
    // 중지 시 재생시간 저장
    savePlayTime()
  }
}
function playVideo(source: any) {
  videoSrc.value = source
}
function getPlayTime(_min: number) {
  const m = Math.floor(_min / 60)
  const s = Math.floor(_min % 60)
  return m + $language('분') + ' ' + s + $language('초')
}
function openQuiz() {
  popupOptions.value.title = '교육 문제풀이'
  popupOptions.value.width = '60%'
  popupOptions.value.param = {
    eduEducationId: route.query.eduEducationId,
    eduQuestionMstId: educationInfo.value.eduQuestionMstId
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import('@views/sop/edu/quiz/solvingQuiz.vue'))
  )
  popupOptions.value.visible = true
  popupOptions.value.closeCallback = closeQuizPopup
}
function closeQuizPopup(_type: any, score: any) {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  if (_type == 'SUCCESS') {
    isEduQuestionPass.value = true
    educationInfo.value.isQuestionFlag = 'Y'
    if (score) educationInfo.value.score = score
  } else {
    isEduQuestionPass.value = false
  }
  getDetail()
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
