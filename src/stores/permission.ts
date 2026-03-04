/* @vite-ignore */
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'
import { filter, findIndex, forEach, fromPairs, indexOf, map, orderBy, split } from 'lodash-es'
import { defineStore } from 'pinia'
import { Component, defineAsyncComponent, ref, shallowRef } from 'vue'

import { getAccessToken } from '@/common/auth'
import { addAuthRouter, asyncRouterMap } from '@/router'
import { getLang } from '@utils/common'

interface urlData {
  url: string
  paramUrl: string
  params: Record<string, string>
}

interface menuApiData {
  sysMenuId?: string
  upMenuId: string
  sortOrder: number
}

interface responseMenuData extends menuApiData {
  title: string | undefined
  menuNm: string
  menuIcon: stringNull
  manualFlag: string
  userWriteFlag: string
  menuViewMethod: stringNull
  icon: string
  name: string
  href: string
  url: string
  header?: string
  menuLvl: string
  manual: boolean
  params?: Record<string, string>
  children?: Array<menuData>
}

interface menuData extends menuApiData {
  title: string | undefined
  icon: string
  name: string
  href: string
  url: string
  header?: string
  menuLvl: string
  manual: boolean
  params?: Record<string, string>
  children?: Array<menuData>
}

interface accessMenu extends menuApiData {
  title: string
  name: string
  href: string
  url: string
  menuLvl: string
  menuViewMethod: string
  manual: boolean
  editable: boolean
  params?: Record<string, string>
}

interface metaData {
  title: string | undefined
  manual: boolean
  editable: boolean
  params?: Record<string, string>
  layout?: stringNull
}

export interface accessRouterData {
  path: string
  name: string
  meta?: metaData
  component?: Component
  children?: accessRouterData[]
}

const fetchMenus = async (empNo: string): Promise<Array<responseMenuData>> => {
  // getAccessToken()은 이미 'Bearer ' 포함
  const response = await axios.get<userType>(selectConfig.sys.userMenu.get.url + empNo, {
    headers: {
      'Cache-Control': 'no-cache',
      'X-Authorization': getAccessToken()
    },
    baseURL: import.meta.env.VITE_API_URL,
    params: {
      lang: getLang(),
      deviceTypeCd: 'P'
    }
  })
  return response.data
}

export const usePermissionStore = defineStore('permission', () => {
  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const route = useRoute()
  const router = useRouter()

  const routers = ref<Array<menuData>>([])
  const addRouters = ref<Array<accessRouterData>>([])
  const allMenus = ref<Array<responseMenuData>>([])
  const openMenus = ref<Array<string>>([])

  const menuVueQuery = ref({
    isStale: true,
    isFetching: true,
    refetch: null as (() => void) | null
  })

  const menuQuery = useQuery({
    queryKey: ['authMenus'],
    queryFn: () => fetchMenus(user.value.empNo),
    staleTime: 3 * 60 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    enabled: !!getAccessToken() && !!user.value.empNo
  })

  watchEffect(() => {
    if (user.value.empNo && menuVueQuery.value.refetch) {
      menuVueQuery.value.refetch()
    }
  })

  watchEffect(() => {
    if (menuQuery.isSuccess.value) {
      allMenus.value = menuQuery.data.value!
      menuVueQuery.value.isStale = false

      const menus: menuData[] = map(menuQuery.data.value!, (item) => {
        const urlInfo = getUrlData(item.url)
        return {
          title: item.menuNm,
          icon: item.menuIcon,
          name: item.sysMenuId!,
          href: urlInfo.url ? `${urlInfo.url}${urlInfo.paramUrl}` : '',
          url: urlInfo.url,
          header: '',
          menuLvl: item.menuLvl,
          manual: item.manualFlag === 'Y',
          params: urlInfo.params,
          child: [],
          upMenuId: item.upMenuId,
          sortOrder: item.sortOrder
        }
      })
      const viewRouters = createLeftMenu(menus, menus, 0, '')
      routers.value = viewRouters

      const accessMenus: accessMenu[] = map(menuQuery.data.value!, (item) => {
        const urlInfo = getUrlData(item.url)
        return {
          title: item.menuNm,
          name: item.sysMenuId!,
          href: urlInfo.url ? `${urlInfo.url}${urlInfo.paramUrl}` : '',
          url: urlInfo.url,
          menuLvl: item.menuLvl,
          menuViewMethod: item.menuViewMethod,
          manual: item.manualFlag === 'Y',
          editable: item.userWriteFlag === 'Y',
          params: urlInfo.params,
          upMenuId: item.upMenuId,
          sortOrder: item.sortOrder
        }
      })
      const accessedRouters = getAccessRouters(accessMenus)
      addRouters.value = accessedRouters

      addAuthRouter(addRouters.value)
    }
  })

  let isInitialMenuLoad = true

  watch(
    () => menuQuery.isFetching.value,
    () => {
      if (!menuQuery.isFetching.value) {
        menuVueQuery.value.isFetching = false
        // 초기 메뉴 로드 시에만 라우터 갱신, 이후 refetch에서는 불필요한 네비게이션 방지
        if (isInitialMenuLoad && addRouters.value.length > 0) {
          isInitialMenuLoad = false
          // 새로고침 시: 동적 라우트 등록 후 현재 경로를 재resolve하여 컴포넌트 로드
          router.replace({ path: route.fullPath }).catch(() => {})
        }
      }
    }
  )

  menuVueQuery.value.isFetching = menuQuery.isFetching.value
  menuVueQuery.value.isStale = menuQuery.isStale.value
  menuVueQuery.value.refetch = menuQuery.refetch

  function findOpenMenus(name: string, selfOpen?: boolean) {
    openMenus.value = []
    if (name && allMenus.value && allMenus.value.length > 0) {
      const currentMenu = _.find(allMenus.value, { sysMenuId: name }) as responseMenuData | undefined
      if (currentMenu && currentMenu.upMenuId) {
        findUpMenu(currentMenu.upMenuId)
      }
      if (selfOpen && currentMenu?.sysMenuId) {
        openMenus.value.push(currentMenu.sysMenuId)
      }
    }
  }

  function findUpMenu(upMenuId: string) {
    const upMenu = _.find(allMenus.value, { sysMenuId: upMenuId }) as responseMenuData | undefined
    if (upMenu) {
      if (upMenu.sysMenuId) {
        openMenus.value.push(upMenu.sysMenuId)
      }
      findUpMenu(upMenu.upMenuId)
    }
  }

  function createLeftMenu(
    _Allmenus: Array<menuData>,
    _menus: Array<menuData>,
    menuLevel: number,
    navi: string
  ) {
    let menuLevel1 = filter(_menus, { menuLvl: menuLevel.toString() })
    forEach(menuLevel1, (menu) => {
      menu.sortOrder = menu.sortOrder ? (!isNaN(menu.sortOrder) ? Number(menu.sortOrder) : 0) : 0
    })
    menuLevel1 = orderBy(menuLevel1, ['sortOrder'], ['asc'])

    const returnMenu: Array<menuData> = []
    forEach(menuLevel1, (menu) => {
      const subLevel = filter(_Allmenus, {
        menuLvl: String(menuLevel + 1),
        upMenuId: menu.name
      })

      const menuInfo: menuData = {
        title: menu.title,
        icon: menu.icon,
        name: menu.name,
        menuLvl: menu.menuLvl,
        href: menu.href,
        url: menu.url,
        header: menu.url === null || menu.url === '' ? '' : 'generic',
        manual: menu.manual,
        params: menu.params,
        children: [],
        upMenuId: menu.upMenuId,
        sortOrder: menu.sortOrder
      }

      if (subLevel && subLevel.length > 0) {
        menuInfo.children = createLeftMenu(
          _Allmenus,
          subLevel,
          menuLevel + 1,
          navi ? navi + ' > ' + String(menu.title) : String(menu.title)
        )
      }
      returnMenu.push(menuInfo)
    })

    if (menuLevel === 0) {
      forEach(asyncRouterMap, (item) => {
        if (findIndex(returnMenu, { name: item.name }) === -1 && !item.hidden) {
          returnMenu.splice(0, 0, {
            title: item.title,
            icon: '',
            name: item.name,
            menuLvl: '0',
            href: item.path,
            url: '',
            manual: false,
            params: {},
            children: [],
            upMenuId: '',
            sortOrder: 0
          })
        }
      })
    }
    return returnMenu
  }

  function getAccessRouters(_menus: Array<accessMenu>) {
    const accessRouters: accessRouterData[] = []
    const haveUrlMenus = filter(_menus, (item) => Boolean(item.url))

    forEach(asyncRouterMap, (router) => {
      accessRouters.push({
        path: router.path,
        name: router.name,
        meta: {
          title: router.title,
          manual: false,
          editable: Boolean(router.meta.editable),
          params: {},
          layout: router?.meta?.layout || 'default'
        },
        component: router.component
      })
    })

    if (haveUrlMenus) {
      forEach(haveUrlMenus, (menu) => {
        const subLevel = filter(_menus, {
          menuLvl: String(parseInt(menu.menuLvl) + 1),
          upMenuId: menu.name
        })

        accessRouters.push({
          path: menu.href,
          name: `${menu.name}`,
          meta: {
            title: menu.title,
            manual: menu.manual,
            editable: menu.editable,
            params: menu.params,
            layout: 'default'
          },
          component: getComponet(subLevel, menu.url)
        })
      })
    }

    return accessRouters
  }

  function getComponet(subLevel: Array<accessMenu>, frontEndUrl: string) {
    if (!frontEndUrl) return undefined
    if (subLevel && subLevel.length > 0) return undefined

    const directoryPaths = split(frontEndUrl, '/')
    directoryPaths.shift()

    if (!directoryPaths || directoryPaths.length === 0) return undefined

    switch (directoryPaths.length) {
      case 1:
        return shallowRef(() => import(`../views/${directoryPaths[0]}.vue`))
      case 2:
        return shallowRef(() => import(`../views/${directoryPaths[0]}/${directoryPaths[1]}.vue`))
      case 3:
        return shallowRef(
          () =>
            import(`../views/${directoryPaths[0]}/${directoryPaths[1]}/${directoryPaths[2]}.vue`)
        )
      case 4:
        return shallowRef(
          () =>
            import(
              `../views/${directoryPaths[0]}/${directoryPaths[1]}/${directoryPaths[2]}/${directoryPaths[3]}.vue`
            )
        )
      case 5:
        return shallowRef(
          defineAsyncComponent(
            () =>
              import(
                `../views/${directoryPaths[0]}/${directoryPaths[1]}/${directoryPaths[2]}/${directoryPaths[3]}/${directoryPaths[4]}.vue`
              )
          )
        )
      default:
        return undefined
    }
  }

  function getUrlData(itemUrl: string) {
    const urlInfo: urlData = { url: itemUrl, paramUrl: '', params: {} }
    const paramIndex = indexOf(itemUrl, '?')
    if (paramIndex > -1) {
      const paramString = itemUrl.substring(paramIndex + 1, itemUrl.length)
      urlInfo.params = fromPairs(map(paramString.split('&'), (text) => text.split('=')))
      urlInfo.url = urlInfo.url.substring(0, paramIndex)
      for (const key in urlInfo.params) {
        urlInfo.paramUrl += `/${urlInfo.params[key]}`
      }
    }
    return urlInfo
  }

  return {
    routers,
    addRouters,
    openMenus,
    findOpenMenus
  }
})
