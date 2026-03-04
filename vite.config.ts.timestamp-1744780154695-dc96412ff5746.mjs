// vite.config.ts
import { loadEnv } from "file:///D:/PROJECT/VUE3-SHMS-DEMO/SHMSFrontend/.yarn/__virtual__/vite-virtual-624ba12687/0/cache/vite-npm-5.4.9-ed2668269d-e9c59f2c63.zip/node_modules/vite/dist/node/index.js";
import path from "path";
import { fileURLToPath, URL } from "url";
import vue from "file:///D:/PROJECT/VUE3-SHMS-DEMO/SHMSFrontend/.yarn/__virtual__/@vitejs-plugin-vue-virtual-2a81d8cf37/0/cache/@vitejs-plugin-vue-npm-5.1.4-63113ceaf9-e5294bfd6d.zip/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///D:/PROJECT/VUE3-SHMS-DEMO/SHMSFrontend/.yarn/__virtual__/vite-plugin-svg-icons-virtual-424c1c7e94/0/cache/vite-plugin-svg-icons-npm-2.0.1-aaab905766-9d315a234c.zip/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import svgLoader from "file:///D:/PROJECT/VUE3-SHMS-DEMO/SHMSFrontend/.yarn/__virtual__/vite-svg-loader-virtual-e783e911f9/0/cache/vite-svg-loader-npm-5.1.0-9aa2ae1712-39f218db63.zip/node_modules/vite-svg-loader/index.js";
import { quasar, transformAssetUrls } from "file:///D:/PROJECT/VUE3-SHMS-DEMO/SHMSFrontend/.yarn/__virtual__/@quasar-vite-plugin-virtual-a3fab8799c/0/cache/@quasar-vite-plugin-npm-1.7.0-d87a976185-d04da314b1.zip/node_modules/@quasar/vite-plugin/src/index.js";
import AutoImport from "file:///D:/PROJECT/VUE3-SHMS-DEMO/SHMSFrontend/.yarn/__virtual__/unplugin-auto-import-virtual-11e63bbf64/0/cache/unplugin-auto-import-npm-0.18.3-c7b160a1b0-3d4ebd3d1d.zip/node_modules/unplugin-auto-import/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///D:/PROJECT/VUE3-SHMS-DEMO/SHMSFrontend/vite.config.ts";
var vite_config_default = ({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());
  const { VITE_PUBLIC_PATH, VITE_API_URL } = viteEnv;
  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: [
        { find: "@", replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)) },
        { find: "@views", replacement: fileURLToPath(new URL("./src/views", __vite_injected_original_import_meta_url)) },
        { find: "@popups", replacement: fileURLToPath(new URL("./src/popups", __vite_injected_original_import_meta_url)) },
        { find: "@layouts", replacement: fileURLToPath(new URL("./src/layouts", __vite_injected_original_import_meta_url)) },
        {
          find: "@utils",
          replacement: fileURLToPath(new URL("./src/common/utils", __vite_injected_original_import_meta_url))
        },
        {
          find: "@images",
          replacement: fileURLToPath(new URL("./src/assets/images", __vite_injected_original_import_meta_url))
        },
        { find: "@stores", replacement: fileURLToPath(new URL("./src/stores", __vite_injected_original_import_meta_url)) },
        { find: "@assets", replacement: fileURLToPath(new URL("./src/assets", __vite_injected_original_import_meta_url)) },
        {
          find: "@components",
          replacement: fileURLToPath(new URL("./src/components", __vite_injected_original_import_meta_url))
        }
      ]
    },
    server: {
      /** IP로 프로젝트에 액세스하기 위해 네트워크 형식을 사용. */
      host: true,
      // host: "0.0.0.0"
      /** 포트 */
      port: 5e4,
      /** 브라우저를 자동으로 열지 여부 */
      open: true,
      /** 도메인 간 설정이 허용 */
      cors: true,
      /** 포트가 점유된 상태에서 바로 나갈지 여부 */
      strictPort: false,
      /** API 서버 프록시 */
      proxy: {
        "/api/": {
          target: VITE_API_URL,
          ws: true,
          /** 도메인 간 허용 여부 */
          changeOrigin: true
        }
      },
      /** 일반적으로 사용되는 파일을 예열(warmup)하여 초기 페이지 로딩 속도 향상 */
      warmup: {
        clientFiles: ["./src/layouts/**/*.vue"]
      }
    },
    // publicDir: path.resolve(__dirname, 'src/assets'),
    build: {
      /** 단일 청크 파일의 크기가 2048KB를 초과하면 경고 */
      chunkSizeWarningLimit: 2048,
      /** gzip 압축 크기 보고 비활성화 */
      reportCompressedSize: false,
      /** 패키징 후 정적 리소스 디렉터리 */
      assetsDir: "dist",
      rollupOptions: {
        output: {
          /***
           * 청킹 전략
           * 1. 패키지 이름이 없으면 패키징 중에 오류가 보고됨.
           * 2. 청크 분할 전략을 사용자 정의하고 싶지 않은 경우 이 구성을 직접 제거.
           * * 청크파일이 도움이 되지만, 너무 많을 시에는 로딩속도 문제가 발생함에 따라 자주 사용하는 패키지를 찢어서 관리
           */
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"]
          }
          // assetFileNames: ({ name }) => {
          //   if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
          //     return 'assets/images/[name]-[hash][extname]'
          //   }
          //   // if (/\.css$/.test(name ?? '')) {
          //   //   return 'assets/css/[name]-[hash][extname]'
          //   // }
          //   // if (/\.(ttf|otf|woff|woff2|eot)$/.test(name ?? '')) {
          //   //   return 'assets/fonts/[name]-[hash][extname]'
          //   // }
          //   return 'assets/[name]-[hash][extname]'
          // }
        }
      }
    },
    /** Vite esbuild시 처리 작업 */
    esbuild: mode === "production" ? {
      /** 패키징 시 console.log 제거 */
      pure: ["console.log"],
      /** 패키징 시 디버거 제거 */
      drop: ["debugger"],
      /** 패키징 시 모든 주석 제거 */
      legalComments: "none"
    } : void 0,
    /** Vite 플러그인 */
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      /** SVG 정적 이미지를 Vue 구성 요소로 변환 */
      svgLoader({ defaultImport: "url" }),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/assets/images/icon")],
        symbolId: "icon-[dir]-[name]"
      }),
      quasar({
        // sassVariables: 'src/assets/quasar-variables.scss'
      }),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue\??/],
        imports: [
          // presets
          "vue",
          "vue-router",
          "pinia",
          {
            vue: ["createVNode", "render"],
            "vue-router": ["useRouter", "useRoute"],
            quasar: ["uid", "useQuasar"],
            "lodash-es": [
              // default imports
              ["*", "_"]
              // import { * as _ } from 'lodash-es',
            ],
            "string-format": [["default", "$format"]]
          },
          // type import
          {
            from: "vue",
            imports: [
              "App",
              "VNode",
              "ComponentPublicInstance",
              "ComponentPublicInstanceCostom",
              "ComponentInternalInstance"
            ],
            type: true
          },
          {
            from: "vue-router",
            imports: [
              "RouteRecordRaw",
              "RouteLocationRaw",
              "LocationQuery",
              "RouteParams",
              "RouteLocationNormalizedLoaded",
              "RouteRecordName",
              "NavigationGuard"
            ],
            type: true
          },
          {
            from: "src/types",
            imports: [
              "GetTranLanguageFunction",
              "tabItemsType",
              "ErrorFunction",
              // 'dataBaseType',
              "tableMergeType",
              "tableColumnType",
              "tableColumnImageRestrictionType",
              "tableColumnInnerBtnType",
              "attachSettingType",
              "apprInfoType",
              "codeMasterType",
              "stepMasterType",
              "deptType",
              "favorite",
              "popupParamType",
              "closePopupType",
              "processDeptType",
              "processType",
              "userType",
              "vendorType",
              "vendorUserType",
              "objectStringNumber",
              "objectString",
              "arrayObject",
              "arrayString",
              "arrayNumber",
              "objectLodash",
              "stringNull",
              "numberNull"
            ],
            type: true
          }
        ],
        // resolvers: mode === 'development' ? [] : [NaiveUiResolver()],
        dirs: ["./src/stores/**", "./src/types/**", "./src/common/utils/**"],
        dts: "./types/auto-imports.d.ts",
        vueTemplate: false,
        viteOptimizeDeps: true,
        injectAtEnd: true,
        eslintrc: {
          enabled: true
        }
      })
    ],
    css: {
      preprocessorOptions: {
        sass: {
          api: "modern",
          silenceDeprecations: ["legacy-js-api"],
          quietDeps: true
        }
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQUk9KRUNUXFxcXFZVRTMtU0hNUy1ERU1PXFxcXFNITVNGcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUFJPSkVDVFxcXFxWVUUzLVNITVMtREVNT1xcXFxTSE1TRnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1BST0pFQ1QvVlVFMy1TSE1TLURFTU8vU0hNU0Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdHlwZSBDb25maWdFbnYsIHR5cGUgVXNlckNvbmZpZ0V4cG9ydCwgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ3VybCdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xyXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gJ3ZpdGUtc3ZnLWxvYWRlcidcclxuaW1wb3J0IHsgcXVhc2FyLCB0cmFuc2Zvcm1Bc3NldFVybHMgfSBmcm9tICdAcXVhc2FyL3ZpdGUtcGx1Z2luJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG4vLyBpbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5cclxuLyoqIGh0dHBzOi8vY24udml0ZWpzLmRldi9jb25maWcgKi9cclxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnRXhwb3J0ID0+IHtcclxuICBjb25zdCB2aXRlRW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKSBhcyBJbXBvcnRNZXRhRW52XHJcbiAgY29uc3QgeyBWSVRFX1BVQkxJQ19QQVRILCBWSVRFX0FQSV9VUkwgfSA9IHZpdGVFbnZcclxuICByZXR1cm4ge1xyXG4gICAgYmFzZTogVklURV9QVUJMSUNfUEFUSCxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IFtcclxuICAgICAgICB7IGZpbmQ6ICdAJywgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSB9LFxyXG4gICAgICAgIHsgZmluZDogJ0B2aWV3cycsIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL3ZpZXdzJywgaW1wb3J0Lm1ldGEudXJsKSkgfSxcclxuICAgICAgICB7IGZpbmQ6ICdAcG9wdXBzJywgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvcG9wdXBzJywgaW1wb3J0Lm1ldGEudXJsKSkgfSxcclxuICAgICAgICB7IGZpbmQ6ICdAbGF5b3V0cycsIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL2xheW91dHMnLCBpbXBvcnQubWV0YS51cmwpKSB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdAdXRpbHMnLFxyXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvY29tbW9uL3V0aWxzJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGZpbmQ6ICdAaW1hZ2VzJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL2Fzc2V0cy9pbWFnZXMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyBmaW5kOiAnQHN0b3JlcycsIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL3N0b3JlcycsIGltcG9ydC5tZXRhLnVybCkpIH0sXHJcbiAgICAgICAgeyBmaW5kOiAnQGFzc2V0cycsIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL2Fzc2V0cycsIGltcG9ydC5tZXRhLnVybCkpIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZmluZDogJ0Bjb21wb25lbnRzJyxcclxuICAgICAgICAgIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL2NvbXBvbmVudHMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAvKiogSVBcdUI4NUMgXHVENTA0XHVCODVDXHVDODFEXHVEMkI4XHVDNUQwIFx1QzU2MVx1QzEzOFx1QzJBNFx1RDU1OFx1QUUzMCBcdUM3MDRcdUQ1NzQgXHVCMTI0XHVEMkI4XHVDNkNDXHVEMDZDIFx1RDYxNVx1QzJERFx1Qzc0NCBcdUMwQUNcdUM2QTkuICovXHJcbiAgICAgIGhvc3Q6IHRydWUsIC8vIGhvc3Q6IFwiMC4wLjAuMFwiXHJcbiAgICAgIC8qKiBcdUQzRUNcdUQyQjggKi9cclxuICAgICAgcG9ydDogNTAwMDAsXHJcbiAgICAgIC8qKiBcdUJFMENcdUI3N0NcdUM2QjBcdUM4MDBcdUI5N0MgXHVDNzkwXHVCM0Q5XHVDNzNDXHVCODVDIFx1QzVGNFx1QzlDMCBcdUM1RUNcdUJEODAgKi9cclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgLyoqIFx1QjNDNFx1QkE1NFx1Qzc3OCBcdUFDMDQgXHVDMTI0XHVDODE1XHVDNzc0IFx1RDVDOFx1QzZBOSAqL1xyXG4gICAgICBjb3JzOiB0cnVlLFxyXG4gICAgICAvKiogXHVEM0VDXHVEMkI4XHVBQzAwIFx1QzgxMFx1QzcyMFx1QjQxQyBcdUMwQzFcdUQwRENcdUM1RDBcdUMxMUMgXHVCQzE0XHVCODVDIFx1QjA5OFx1QUMwOFx1QzlDMCBcdUM1RUNcdUJEODAgKi9cclxuICAgICAgc3RyaWN0UG9ydDogZmFsc2UsXHJcbiAgICAgIC8qKiBBUEkgXHVDMTFDXHVCQzg0IFx1RDUwNFx1Qjg1RFx1QzJEQyAqL1xyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgICcvYXBpLyc6IHtcclxuICAgICAgICAgIHRhcmdldDogVklURV9BUElfVVJMLFxyXG4gICAgICAgICAgd3M6IHRydWUsXHJcbiAgICAgICAgICAvKiogXHVCM0M0XHVCQTU0XHVDNzc4IFx1QUMwNCBcdUQ1QzhcdUM2QTkgXHVDNUVDXHVCRDgwICovXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIC8qKiBcdUM3N0NcdUJDMThcdUM4MDFcdUM3M0NcdUI4NUMgXHVDMEFDXHVDNkE5XHVCNDE4XHVCMjk0IFx1RDMwQ1x1Qzc3Q1x1Qzc0NCBcdUM2MDhcdUM1RjQod2FybXVwKVx1RDU1OFx1QzVFQyBcdUNEMDhcdUFFMzAgXHVEMzk4XHVDNzc0XHVDOUMwIFx1Qjg1Q1x1QjUyOSBcdUMxOERcdUIzQzQgXHVENUE1XHVDMEMxICovXHJcbiAgICAgIHdhcm11cDoge1xyXG4gICAgICAgIGNsaWVudEZpbGVzOiBbJy4vc3JjL2xheW91dHMvKiovKi52dWUnXVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gcHVibGljRGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2Fzc2V0cycpLFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgLyoqIFx1QjJFOFx1Qzc3QyBcdUNDQURcdUQwNkMgXHVEMzBDXHVDNzdDXHVDNzU4IFx1RDA2Q1x1QUUzMFx1QUMwMCAyMDQ4S0JcdUI5N0MgXHVDRDA4XHVBQ0ZDXHVENTU4XHVCQTc0IFx1QUNCRFx1QUNFMCAqL1xyXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwNDgsXHJcbiAgICAgIC8qKiBnemlwIFx1QzU1NVx1Q0Q5NSBcdUQwNkNcdUFFMzAgXHVCQ0Y0XHVBQ0UwIFx1QkU0NFx1RDY1Q1x1QzEzMVx1RDY1NCAqL1xyXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXHJcbiAgICAgIC8qKiBcdUQzMjhcdUQwQTRcdUM5RDUgXHVENkM0IFx1QzgxNVx1QzgwMSBcdUI5QUNcdUMxOENcdUMyQTQgXHVCNTE0XHVCODA5XHVEMTMwXHVCOUFDICovXHJcbiAgICAgIGFzc2V0c0RpcjogJ2Rpc3QnLFxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAvKioqXHJcbiAgICAgICAgICAgKiBcdUNDQURcdUQwQjkgXHVDODA0XHVCN0I1XHJcbiAgICAgICAgICAgKiAxLiBcdUQzMjhcdUQwQTRcdUM5QzAgXHVDNzc0XHVCOTg0XHVDNzc0IFx1QzVDNlx1QzczQ1x1QkE3NCBcdUQzMjhcdUQwQTRcdUM5RDUgXHVDOTExXHVDNUQwIFx1QzYyNFx1Qjk1OFx1QUMwMCBcdUJDRjRcdUFDRTBcdUI0MjguXHJcbiAgICAgICAgICAgKiAyLiBcdUNDQURcdUQwNkMgXHVCRDg0XHVENTYwIFx1QzgwNFx1QjdCNVx1Qzc0NCBcdUMwQUNcdUM2QTlcdUM3OTAgXHVDODE1XHVDNzU4XHVENTU4XHVBQ0UwIFx1QzJGNlx1QzlDMCBcdUM1NEFcdUM3NDAgXHVBQ0JEXHVDNkIwIFx1Qzc3NCBcdUFENkNcdUMxMzFcdUM3NDQgXHVDOUMxXHVDODExIFx1QzgxQ1x1QUM3MC5cclxuICAgICAgICAgICAqICogXHVDQ0FEXHVEMDZDXHVEMzBDXHVDNzdDXHVDNzc0IFx1QjNDNFx1QzZDMFx1Qzc3NCBcdUI0MThcdUM5QzBcdUI5Q0MsIFx1QjEwOFx1QkIzNCBcdUI5Q0VcdUM3NDQgXHVDMkRDXHVDNUQwXHVCMjk0IFx1Qjg1Q1x1QjUyOVx1QzE4RFx1QjNDNCBcdUJCMzhcdUM4MUNcdUFDMDAgXHVCQzFDXHVDMEREXHVENTY4XHVDNUQwIFx1QjUzMFx1Qjc3QyBcdUM3OTBcdUM4RkMgXHVDMEFDXHVDNkE5XHVENTU4XHVCMjk0IFx1RDMyOFx1RDBBNFx1QzlDMFx1Qjk3QyBcdUNDMjJcdUM1QjRcdUMxMUMgXHVBRDAwXHVCOUFDXHJcbiAgICAgICAgICAgKi9cclxuICAgICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgICB2dWU6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gYXNzZXRGaWxlTmFtZXM6ICh7IG5hbWUgfSkgPT4ge1xyXG4gICAgICAgICAgLy8gICBpZiAoL1xcLihnaWZ8anBlP2d8cG5nfHN2ZykkLy50ZXN0KG5hbWUgPz8gJycpKSB7XHJcbiAgICAgICAgICAvLyAgICAgcmV0dXJuICdhc3NldHMvaW1hZ2VzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nXHJcbiAgICAgICAgICAvLyAgIH1cclxuICAgICAgICAgIC8vICAgLy8gaWYgKC9cXC5jc3MkLy50ZXN0KG5hbWUgPz8gJycpKSB7XHJcbiAgICAgICAgICAvLyAgIC8vICAgcmV0dXJuICdhc3NldHMvY3NzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nXHJcbiAgICAgICAgICAvLyAgIC8vIH1cclxuICAgICAgICAgIC8vICAgLy8gaWYgKC9cXC4odHRmfG90Znx3b2ZmfHdvZmYyfGVvdCkkLy50ZXN0KG5hbWUgPz8gJycpKSB7XHJcbiAgICAgICAgICAvLyAgIC8vICAgcmV0dXJuICdhc3NldHMvZm9udHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXSdcclxuICAgICAgICAgIC8vICAgLy8gfVxyXG4gICAgICAgICAgLy8gICByZXR1cm4gJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJ1xyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8qKiBWaXRlIGVzYnVpbGRcdUMyREMgXHVDQzk4XHVCOUFDIFx1Qzc5MVx1QzVDNSAqL1xyXG4gICAgZXNidWlsZDpcclxuICAgICAgbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nIC8vIFx1QzZCNFx1QzYwMVx1RDY1OFx1QUNCRFx1Qzc3OCBcdUFDQkRcdUM2QjBcdUI5Q0MgXHVDNzkxXHVDNUM1XHJcbiAgICAgICAgPyB7XHJcbiAgICAgICAgICAgIC8qKiBcdUQzMjhcdUQwQTRcdUM5RDUgXHVDMkRDIGNvbnNvbGUubG9nIFx1QzgxQ1x1QUM3MCAqL1xyXG4gICAgICAgICAgICBwdXJlOiBbJ2NvbnNvbGUubG9nJ10sXHJcbiAgICAgICAgICAgIC8qKiBcdUQzMjhcdUQwQTRcdUM5RDUgXHVDMkRDIFx1QjUxNFx1QkM4NFx1QUM3MCBcdUM4MUNcdUFDNzAgKi9cclxuICAgICAgICAgICAgZHJvcDogWydkZWJ1Z2dlciddLFxyXG4gICAgICAgICAgICAvKiogXHVEMzI4XHVEMEE0XHVDOUQ1IFx1QzJEQyBcdUJBQThcdUI0RTAgXHVDOEZDXHVDMTFEIFx1QzgxQ1x1QUM3MCAqL1xyXG4gICAgICAgICAgICBsZWdhbENvbW1lbnRzOiAnbm9uZSdcclxuICAgICAgICAgIH1cclxuICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgIC8qKiBWaXRlIFx1RDUwQ1x1QjdFQ1x1QURGOFx1Qzc3OCAqL1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICB2dWUoe1xyXG4gICAgICAgIHRlbXBsYXRlOiB7IHRyYW5zZm9ybUFzc2V0VXJscyB9XHJcbiAgICAgIH0pLFxyXG4gICAgICAvKiogU1ZHIFx1QzgxNVx1QzgwMSBcdUM3NzRcdUJCRjhcdUM5QzBcdUI5N0MgVnVlIFx1QUQ2Q1x1QzEzMSBcdUM2OTRcdUMxOENcdUI4NUMgXHVCQ0MwXHVENjU4ICovXHJcbiAgICAgIHN2Z0xvYWRlcih7IGRlZmF1bHRJbXBvcnQ6ICd1cmwnIH0pLFxyXG4gICAgICAvKiogU1ZHICovXHJcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9pbWFnZXMvaWNvbicpXSxcclxuICAgICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJ1xyXG4gICAgICB9KSxcclxuICAgICAgcXVhc2FyKHtcclxuICAgICAgICAvLyBzYXNzVmFyaWFibGVzOiAnc3JjL2Fzc2V0cy9xdWFzYXItdmFyaWFibGVzLnNjc3MnXHJcbiAgICAgIH0pLFxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICBpbmNsdWRlOiBbL1xcLlt0al1zeD8kLywgL1xcLnZ1ZVxcPz8vXSxcclxuICAgICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgICAvLyBwcmVzZXRzXHJcbiAgICAgICAgICAndnVlJyxcclxuICAgICAgICAgICd2dWUtcm91dGVyJyxcclxuICAgICAgICAgICdwaW5pYScsXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHZ1ZTogWydjcmVhdGVWTm9kZScsICdyZW5kZXInXSxcclxuICAgICAgICAgICAgJ3Z1ZS1yb3V0ZXInOiBbJ3VzZVJvdXRlcicsICd1c2VSb3V0ZSddLFxyXG4gICAgICAgICAgICBxdWFzYXI6IFsndWlkJywgJ3VzZVF1YXNhciddLFxyXG4gICAgICAgICAgICAnbG9kYXNoLWVzJzogW1xyXG4gICAgICAgICAgICAgIC8vIGRlZmF1bHQgaW1wb3J0c1xyXG4gICAgICAgICAgICAgIFsnKicsICdfJ10gLy8gaW1wb3J0IHsgKiBhcyBfIH0gZnJvbSAnbG9kYXNoLWVzJyxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgJ3N0cmluZy1mb3JtYXQnOiBbWydkZWZhdWx0JywgJyRmb3JtYXQnXV1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICAvLyB0eXBlIGltcG9ydFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBmcm9tOiAndnVlJyxcclxuICAgICAgICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICAgICAgICdBcHAnLFxyXG4gICAgICAgICAgICAgICdWTm9kZScsXHJcbiAgICAgICAgICAgICAgJ0NvbXBvbmVudFB1YmxpY0luc3RhbmNlJyxcclxuICAgICAgICAgICAgICAnQ29tcG9uZW50UHVibGljSW5zdGFuY2VDb3N0b20nLFxyXG4gICAgICAgICAgICAgICdDb21wb25lbnRJbnRlcm5hbEluc3RhbmNlJ1xyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB0eXBlOiB0cnVlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBmcm9tOiAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICAgICAgICAnUm91dGVSZWNvcmRSYXcnLFxyXG4gICAgICAgICAgICAgICdSb3V0ZUxvY2F0aW9uUmF3JyxcclxuICAgICAgICAgICAgICAnTG9jYXRpb25RdWVyeScsXHJcbiAgICAgICAgICAgICAgJ1JvdXRlUGFyYW1zJyxcclxuICAgICAgICAgICAgICAnUm91dGVMb2NhdGlvbk5vcm1hbGl6ZWRMb2FkZWQnLFxyXG4gICAgICAgICAgICAgICdSb3V0ZVJlY29yZE5hbWUnLFxyXG4gICAgICAgICAgICAgICdOYXZpZ2F0aW9uR3VhcmQnXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHR5cGU6IHRydWVcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGZyb206ICdzcmMvdHlwZXMnLFxyXG4gICAgICAgICAgICBpbXBvcnRzOiBbXHJcbiAgICAgICAgICAgICAgJ0dldFRyYW5MYW5ndWFnZUZ1bmN0aW9uJyxcclxuICAgICAgICAgICAgICAndGFiSXRlbXNUeXBlJyxcclxuICAgICAgICAgICAgICAnRXJyb3JGdW5jdGlvbicsXHJcbiAgICAgICAgICAgICAgLy8gJ2RhdGFCYXNlVHlwZScsXHJcbiAgICAgICAgICAgICAgJ3RhYmxlTWVyZ2VUeXBlJyxcclxuICAgICAgICAgICAgICAndGFibGVDb2x1bW5UeXBlJyxcclxuICAgICAgICAgICAgICAndGFibGVDb2x1bW5JbWFnZVJlc3RyaWN0aW9uVHlwZScsXHJcbiAgICAgICAgICAgICAgJ3RhYmxlQ29sdW1uSW5uZXJCdG5UeXBlJyxcclxuICAgICAgICAgICAgICAnYXR0YWNoU2V0dGluZ1R5cGUnLFxyXG4gICAgICAgICAgICAgICdhcHBySW5mb1R5cGUnLFxyXG4gICAgICAgICAgICAgICdjb2RlTWFzdGVyVHlwZScsXHJcbiAgICAgICAgICAgICAgJ3N0ZXBNYXN0ZXJUeXBlJyxcclxuICAgICAgICAgICAgICAnZGVwdFR5cGUnLFxyXG4gICAgICAgICAgICAgICdmYXZvcml0ZScsXHJcbiAgICAgICAgICAgICAgJ3BvcHVwUGFyYW1UeXBlJyxcclxuICAgICAgICAgICAgICAnY2xvc2VQb3B1cFR5cGUnLFxyXG4gICAgICAgICAgICAgICdwcm9jZXNzRGVwdFR5cGUnLFxyXG4gICAgICAgICAgICAgICdwcm9jZXNzVHlwZScsXHJcbiAgICAgICAgICAgICAgJ3VzZXJUeXBlJyxcclxuICAgICAgICAgICAgICAndmVuZG9yVHlwZScsXHJcbiAgICAgICAgICAgICAgJ3ZlbmRvclVzZXJUeXBlJyxcclxuICAgICAgICAgICAgICAnb2JqZWN0U3RyaW5nTnVtYmVyJyxcclxuICAgICAgICAgICAgICAnb2JqZWN0U3RyaW5nJyxcclxuICAgICAgICAgICAgICAnYXJyYXlPYmplY3QnLFxyXG4gICAgICAgICAgICAgICdhcnJheVN0cmluZycsXHJcbiAgICAgICAgICAgICAgJ2FycmF5TnVtYmVyJyxcclxuICAgICAgICAgICAgICAnb2JqZWN0TG9kYXNoJyxcclxuICAgICAgICAgICAgICAnc3RyaW5nTnVsbCcsXHJcbiAgICAgICAgICAgICAgJ251bWJlck51bGwnXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHR5cGU6IHRydWVcclxuICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIC8vIHJlc29sdmVyczogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyA/IFtdIDogW05haXZlVWlSZXNvbHZlcigpXSxcclxuICAgICAgICBkaXJzOiBbJy4vc3JjL3N0b3Jlcy8qKicsICcuL3NyYy90eXBlcy8qKicsICcuL3NyYy9jb21tb24vdXRpbHMvKionXSxcclxuICAgICAgICBkdHM6ICcuL3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJyxcclxuICAgICAgICB2dWVUZW1wbGF0ZTogZmFsc2UsXHJcbiAgICAgICAgdml0ZU9wdGltaXplRGVwczogdHJ1ZSxcclxuICAgICAgICBpbmplY3RBdEVuZDogdHJ1ZSxcclxuICAgICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIF0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIHNhc3M6IHtcclxuICAgICAgICAgIGFwaTogJ21vZGVybicsXHJcbiAgICAgICAgICBzaWxlbmNlRGVwcmVjYXRpb25zOiBbJ2xlZ2FjeS1qcy1hcGknXSxcclxuICAgICAgICAgIHF1aWV0RGVwczogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRTLFNBQWdELGVBQWU7QUFDM1csT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLE9BQU8sU0FBUztBQUNoQixTQUFTLDRCQUE0QjtBQUNyQyxPQUFPLGVBQWU7QUFDdEIsU0FBUyxRQUFRLDBCQUEwQjtBQUMzQyxPQUFPLGdCQUFnQjtBQVBvSyxJQUFNLDJDQUEyQztBQVc1TyxJQUFPLHNCQUFRLENBQUMsRUFBRSxLQUFLLE1BQW1DO0FBQ3hELFFBQU0sVUFBVSxRQUFRLE1BQU0sUUFBUSxJQUFJLENB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
