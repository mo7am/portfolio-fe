<script lang="ts" setup>
import navItems from "@/navigation/horizontal";
import { themeConfig } from "@themeConfig";

// Components
import Footer from "@/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";

import { HorizontalNavLayout } from "@layouts";
import { VNodeRenderer } from "@/@layouts/components/VNodeRenderer";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const isAdmin = userStore.getIsAdmin;
const isEmulation = userStore.getIsEmulation;
const tenant = userStore.getTenant;
// !SECTION
</script>

<template>
  <HorizontalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleHorizontalOverlayNavActive }">
      <div
        :class="isAdmin && isEmulation == 1 ? 'navbar-content-container' : ''"
      >
        <div class="flex h-100 justify-between items-center">
          <RouterLink
            :to="`/admin/dashboard`"
            v-if="tenant && isAdmin && isEmulation == 1"
          >
            <VNodeRenderer
              class="w-[100px] h-[30px]"
              :nodes="themeConfig.app.logo"
            />
          </RouterLink>
          <VNodeRenderer
            v-else
            class="w-[100px] h-[30px]"
            :nodes="themeConfig.app.logo"
          />

          <RouterLink
            :to="`/admin/merchants`"
            v-if="tenant && isAdmin && isEmulation == 1"
          >
            <div class="flex justify-between">
              <VImg class="me-2" v-if="tenant?.logo" :src="tenant.logo" />
              <VIcon v-else class="me-2" icon="tabler-building" size="22" />
              <span>{{ tenant.business_name }}</span>
            </div>
          </RouterLink>

          <div class="flex justify-end gap-4">
            <!-- <NavbarThemeSwitcher /> -->

            <UserProfile v-if="(isAdmin || !isAdmin) && isEmulation == 0" />
          </div>
        </div>
      </div>
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
    <slot></slot>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>
  </HorizontalNavLayout>
</template>

<style>
img {
  position: inherit !important;
  width: 50px !important;
}
</style>
