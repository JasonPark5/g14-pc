<template>
  <q-header class="layout-header">
    <q-toolbar>
      <!-- <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background-color: white;
          /* border-radius: 8px; */
        "
      >
        <q-toolbar-title @click="goPage('/')">
          <img
            src="@images/logo_v2_resized.png"
            style="width: 100%; height: 50px; background-color: transparent; object-fit: contain"
          />
        </q-toolbar-title>
        <q-btn flat dense :icon="props.menuIcon" aria-label="Menu" @click="toggleLeftDrawer" />
      </div> -->
      <q-toolbar-title @click="goPage('/')">
        <img src="@images/group14_ci_w.png" style="width: 70px; margin-top: 10px" />
        <span class="q-ml-sm" style="font-size: 1.2em; position: relative; top: -3px">EHS</span>
      </q-toolbar-title>
      <q-btn flat dense :icon="props.menuIcon" aria-label="Menu" @click="toggleLeftDrawer" />
      <tab-menus />
      <div class="header-right-menu">
        <div class="header-shotcut">
          <q-btn
            flat
            dense
            color="white"
            class="top-shortcut-round"
            icon="star"
            @click="toggleRightDrawer"
          >
            <q-tooltip>{{ $language('즐겨찾기') }}</q-tooltip>
          </q-btn>
        </div>
        <user-info />
        <allim />
        <plant-menu />
        <!-- <change-lanuage /> -->
        <menu-search />
        <site-map />
        <span class="q-mr-md">
          <template v-if="isWeatherLoading">
            <q-spinner-dots color="white" size="32px" class="q-ml-sm" />
            <span class="q-ml-sm">{{ $language('날씨 정보를 불러오는 중입니다...') }}</span>
          </template>
          <template v-else>
            <q-btn
              flat
              dense
              color="white"
              class="top-shortcut-round q-mr-sm"
              icon="autorenew"
              :loading="isWeatherLoading"
              @click="getGeo"
            />
            <span>{{ weatherInfo.location }}</span>
            <span class="bar">|</span>
            <q-img :src="weatherInfo.icon" style="width: 40px; margin-left: -5px" class="q-mr-xs" />
            <span>{{ weatherInfo.description }}</span>
            <span class="bar">|</span>
            <b>{{ weatherInfo.temp }}</b>
            <span class="bar">|</span>
            <span>{{ $language('체감 : ') + weatherInfo.feelsLike }}</span>
            <span class="bar">|</span>
            <span>{{ weatherInfo.windSpeed }}</span>
          </template>
        </span>
        <div class="header-shotcut">
          <q-btn
            flat
            dense
            color="white"
            class="top-shortcut-round"
            icon="menu_book"
            @click="userManual"
          >
            <q-tooltip>{{ $language('사용자매뉴얼') }}</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-toolbar>
  </q-header>
  <c-dialog :param="popupOptions" />
</template>
<script setup lang="ts">
import tabMenus from '@layouts/header/tabMenus.vue'
import allim from '@layouts/header/allim.vue'
import siteMap from '@layouts/header/siteMap.vue'
import menuSearch from '@layouts/header/menuSearch.vue'
// import changeLanuage from '@layouts/header/changeLanuage.vue'
import plantMenu from '@layouts/header/plantMenu.vue'
import userInfo from '@layouts/header/userInfo.vue'
const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
defineOptions({
  name: 'headerLayout'
})

interface propType {
  menuIcon: string
}
const emits = defineEmits(['updateLeftDrawerOpen', 'updateRightDrawerOpen'])

const props = withDefaults(defineProps<propType>(), {
  menuIcon: ''
})

const popupOptions = ref<popupParamType>({
  isFull: false,
  target: null,
  title: '',
  visible: false,
  param: {},
  closeCallback: () => {}
})

const isWeatherLoading = ref(false)

const weatherInfo = ref({
  description: '',
  icon: '',
  location: '',
  temp: '',
  feelsLike: '',
  windSpeed: '',
  loading: '/src/assets/images/weather/loading.png'
})
const weatherUrl = ref(selectConfig.openApi.weather.url)
onMounted(async () => {
  getGeo()
})
function getGeo() {
  if (!('geolocation' in navigator)) return
  isWeatherLoading.value = true
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const result: any = await $http({
          url: weatherUrl.value,
          method: 'GET',
          params: {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          }
        })
        // console.log('getGeo', result.data)
        const location = result.data.locs.split(' ')
        const weatherIcons = import.meta.glob('@/assets/images/weather/*.png', {
          eager: true,
          as: 'url'
        })
        if (location.length > 0) weatherInfo.value.location = location[location.length - 1]
        weatherInfo.value.icon =
          weatherIcons[`/src/assets/images/weather/${result.data.weather[0].icon}.png`]
        weatherInfo.value.description = result.data.weather[0].description
        weatherInfo.value.temp = (parseFloat(result.data.main.temp) - 273.15).toFixed(1) + ' ℃'
        weatherInfo.value.feelsLike =
          (parseFloat(result.data.main.feels_like) - 273.15).toFixed(1) + ' ℃'
        weatherInfo.value.windSpeed = `${result.data.wind.speed} m/s`
      } catch (e) {
        console.error('날씨 가져오기 실패:', e)
      } finally {
        isWeatherLoading.value = false
      }
    },
    (error) => {
      console.error('위치정보 가져오기 실패:', error)
      isWeatherLoading.value = false
    }
  )
}
function userManual() {
  popupOptions.value.title = '사용자매뉴얼'
  popupOptions.value.param = {
    isPopup: true
  }
  popupOptions.value.target = shallowRef(
    defineAsyncComponent(() => import(`@views/sys/um/userManual.vue`))
  )
  popupOptions.value.visible = true
  popupOptions.value.isFull = false
  popupOptions.value.width = '80%'
  popupOptions.value.closeCallback = closePopup
}
function closePopup() {
  popupOptions.value.target = null
  popupOptions.value.visible = false
  popupOptions.value.param.isPopup = false
}

function toggleLeftDrawer() {
  emits('updateLeftDrawerOpen')
}
function toggleRightDrawer() {
  emits('updateRightDrawerOpen')
}
function goPage(_path: string) {
  router.push(user.value.url ? user.value.url : '/main/index')
}
</script>
