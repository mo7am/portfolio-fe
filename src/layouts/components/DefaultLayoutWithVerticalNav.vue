<script lang="ts" setup>
import navItems from "@/navigation/vertical";
import { themeConfig } from "@themeConfig";

// Components
import Footer from "@/layouts/components/Footer.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";
import logoPNG from "@/assets/images/logo.png";

import { VerticalNavLayout } from "@layouts";
import { VNodeRenderer } from "@/@layouts/components/VNodeRenderer";

import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

function removeByAttr(arr: any, attr: string, value: string, removed: boolean) {
  let i = arr.length;
  while (i--) {
    if (
      arr[i] &&
      arr[i].hasOwnProperty(attr) &&
      arguments.length > 2 &&
      arr[i][attr] === value
    ) {
      if (!removed) {
        arr.splice(i, 1);
      }
    }
  }
  return arr;
}

removeByAttr(
  navItems,
  "title",
  "Users",
  userStore.hasPermission("view-admins")
);

removeByAttr(
  navItems,
  "title",
  "Merchants",
  userStore.hasPermission("view-merchant")
);

removeByAttr(navItems, "title", "Roles", userStore.hasPermission("view-roles"));
</script>

<template>
  <VerticalNavLayout :nav-items="navItems as any">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 justify-between items-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n3 mr-2 xl:hidden"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon size="26" icon="tabler-menu-2" />
        </IconBtn>

        <!-- <VNodeRenderer
          class="w-[100px] h-[30px] mr-auto"
          :nodes="themeConfig.app.logo"
        /> -->
        <img :src="logoPNG" />

        <div class="flex justify-end gap-4">
          <!-- <NavbarThemeSwitcher /> -->

          <UserProfile />
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
  </VerticalNavLayout>
</template>
