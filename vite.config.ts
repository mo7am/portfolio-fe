import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VueRouterAutoImports, getPascalCaseRouteName } from "unplugin-vue-router";
import VueRouter from "unplugin-vue-router/vite";
import { defineConfig } from "vite";
import VueDevTools from "vite-plugin-vue-devtools";
import Layouts from "vite-plugin-vue-layouts";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  // 🔹 Base path لتجنب مشاكل تحميل الـ assets بعد رفع dist
  base: "./",

  plugins: [
    // Vue Router يجب أن يكون قبل vue plugin
    VueRouter({
      getRouteName: (routeNode) => {
        return getPascalCaseRouteName(routeNode)
          .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
          .toLowerCase();
      },
    }),

    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            tag === "swiper-container" || tag === "swiper-slide",
        },
      },
    }),

    VueDevTools(),
    vueJsx(),

    // Vuetify plugin
    vuetify({
      styles: { configFile: "src/assets/styles/variables/_vuetify.scss" },
    }),

    Layouts({
      layoutsDirs: "./src/layouts/",
    }),

    Components({
      dirs: ["src/@core/components", "src/views/demos", "src/components"],
      dts: true,
      resolvers: [
        (componentName) => {
          if (componentName === "VueApexCharts")
            return { name: "default", from: "vue3-apexcharts", as: "VueApexCharts" };
        },
      ],
    }),

    AutoImport({
      imports: ["vue", VueRouterAutoImports, "@vueuse/core", "@vueuse/math", "vue-i18n", "pinia"],
      vueTemplate: true,
      ignore: ["useCookies", "useStorage", "h"],
    }),
  ],

  define: { "process.env": {} },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@themeConfig": fileURLToPath(new URL("./themeConfig.ts", import.meta.url)),
      "@core": fileURLToPath(new URL("./src/@core", import.meta.url)),
      "@layouts": fileURLToPath(new URL("./src/@layouts", import.meta.url)),
      "@images": fileURLToPath(new URL("./src/assets/images/", import.meta.url)),
      "@styles": fileURLToPath(new URL("./src/assets/styles/", import.meta.url)),
      "@configured-variables": fileURLToPath(
        new URL("./src/assets/styles/variables/_template.scss", import.meta.url)
      ),
      apexcharts: fileURLToPath(new URL("node_modules/apexcharts-clevision", import.meta.url)),
      "@db": fileURLToPath(new URL("./src/plugins/fake-api/handlers/", import.meta.url)),
      "@api-utils": fileURLToPath(new URL("./src/plugins/fake-api/utils/", import.meta.url)),
      "tailwind-config": fileURLToPath(new URL("./tailwind.config.js", import.meta.url)),
    },
  },

  build: {
    chunkSizeWarningLimit: 5000,
    commonjsOptions: {
      include: ["tailwind.config.js", "node_modules/**"],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined, // ترك Vite يقسم الشيفرة تلقائياً
      },
    },
  },

  optimizeDeps: {
    entries: ["./src/**/*.vue"],
    include: ["tailwind-config"],
    exclude: [], // إزالة exclude على vuetify لتجنب مشاكل runtime
  },
});

