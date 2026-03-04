<!--
목적 : 공지 팝업용 컴포넌트
-->
<template>
  <q-dialog v-model="noticedialog" position="top">
    <q-card class="mainpoplayerCard">
      <q-bar class="bg-orange-custom text-white mainpoplayerHead">
        <q-icon color="white" name="mail" />
        <q-toolbar-title
          ><span class="text-weight-bold">{{ $language('공지사항') }}</span></q-toolbar-title
        >
        <q-btn flat round dense icon="close" v-close-popup />
      </q-bar>
      <q-card-section class="row items-center no-wrap mainpoplayer">
        <q-list bordered style="width: 100%">
          <q-expansion-item
            v-for="tag in popNotices"
            :key="String(tag.sysNoticeId)"
            group="noticepops"
            header-class="bg-gray-custom text-gray"
            expand-icon-class="text-gray"
            v-model:modelValue="tag.expanded"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon color="gray" name="check" size="13px" />
              </q-item-section>
              <q-item-section>
                <b>{{ tag.noticeTitle }}</b>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section>
                <div v-html="tag.noticeContents" />
              </q-card-section>
              <q-card-section>
                <c-upload
                  :attachInfo="{ taskClassCd: 'NOTICE', taskKey: tag.sysNoticeId }"
                  :editable="false"
                />
              </q-card-section>
            </q-card>
            <q-card v-show="tag.dayViewDisable">
              <q-card-section>
                <q-toggle
                  size="sm"
                  class="anymoreNotice"
                  v-model="tag.dayView"
                  checked-icon="check"
                  color="red"
                  :label="$language('더이상 보지 않기')"
                  unchecked-icon="clear"
                  @update:model-value="updateTodayChk(String(tag.sysNoticeId))"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
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
import { ref } from 'vue'
import { forEach } from 'lodash-es'

import { $http } from '@utils/http'
import selectConfig from '@utils/selectConfig'

/******************************
 * @컴포넌트_옵션_선언
 * TODO 이름 정의 (파일 이름 그대로 지정)
 *******************************/
defineOptions({
  name: 'CNoticePopup'
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

/******************************
 * @Interface_선언
 *******************************/
// interface propType {
//   disabled?: boolean
// }

/******************************
 * @inject_선언
 *******************************/

/******************************
 * @Props_선언
 * TODO type & default 작성
 *******************************/
// const props = withDefaults(defineProps<propType>(), {
//   disabled: false
// })

/******************************
 * @VModel_선언
 *******************************/

/******************************
 * @Data_선언
 * TODO ref, reactive 사용, 불명확한 단어 사용 X (ex. data, date)
 *******************************/
const noticedialog = ref(false)
const noticePopUrl = ref('')
const popNotices = ref<any>([])

/******************************
 * @Computed_선언
 *******************************/

/******************************
 * @Watch_선언
 *******************************/

/******************************
 * @Life_cycle_선언
 *******************************/
onBeforeMount(() => {
  init()
})
/******************************
 * @Function_선언
 * TODO function 주석 작성 (asdffunctionannotation 사용)
 *  * arrow function 사용해도 무관
 *******************************/

function init() {
  noticePopUrl.value = selectConfig.sys.notice.main.url
  getNoticePop()
}

function updateTodayChk(_noticeId: string) {
  const mainPopNoticeId = window.localStorage.getItem('mainPopNoticeId')
  if (mainPopNoticeId === null) {
    window.localStorage.setItem('mainPopNoticeId', _noticeId + ',')
  } else {
    if (mainPopNoticeId.indexOf(_noticeId) < 0) {
      window.localStorage.setItem('mainPopNoticeId', mainPopNoticeId + _noticeId + ',')
    } else {
      window.localStorage.setItem('mainPopNoticeId', mainPopNoticeId.replace(_noticeId + ',', ''))
    }
  }
}

function getNoticePop() {
  popNotices.value = []
  $http({
    url: noticePopUrl.value,
    method: 'GET',
    params: {
      vendorFlag: 'N'
    }
  }).then((_result: any) => {
    if (_result.data) {
      const mainPopNoticeId = window.localStorage.getItem('mainPopNoticeId')
      if (mainPopNoticeId !== null) {
        let icnt = 0
        forEach(_result.data, (item: any) => {
          if (mainPopNoticeId.indexOf(item.sysNoticeId) < 0) {
            item.dayViewDisable = true
            if (icnt == 0) {
              item.expanded = true
            } else {
              item.expanded = false
            }
            popNotices.value.push(item)
            icnt++
          }
        })
        if (popNotices.value.length == _result.data.length) {
          window.localStorage.removeItem('mainPopNoticeId')
        }
      } else {
        popNotices.value = _result.data
        let icnt = 0
        forEach(popNotices.value, (item: any) => {
          item.dayViewDisable = true
          if (icnt == 0) {
            item.expanded = true
          } else {
            item.expanded = false
          }
          icnt++
        })
      }
      if (popNotices.value.length > 0) {
        noticedialog.value = true
      }
    }
  })
}
/******************************
 * @Provide_선언
 *  ! types 폴더에 type 명시
 *******************************/
</script>
