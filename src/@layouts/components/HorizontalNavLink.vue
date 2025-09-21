<script lang="ts" setup>
import { layoutConfig } from "@layouts";
import { can } from "@layouts/plugins/casl";
import { useLayoutConfigStore } from "@layouts/stores/config";
import type { NavLink, SubLink } from "@layouts/types";
import {
  getComputedNavLinkToProp,
  getDynamicI18nProps,
  isNavLinkActive,
} from "@layouts/utils";
import {
  POSIcon,
  BoxIcon,
  LayersIcon,
  VerticalDots,
} from "@/components/CustomIcons";
import { staticPrimaryColor } from "@/plugins/vuetify/theme";
import { isSubLinkActive } from "@/utils/helper";
import { useUserStore } from "@/stores/user";

const props = defineProps<{
  item: NavLink;
}>();

const userStore = useUserStore();
const configStore = useLayoutConfigStore();
const hideTitleAndBadge = configStore.isVerticalNavMini();
const isDialogVisible = ref(false);
const router = useRouter();
const api = inject<any>("api");

const renderNavIcons = (icon?: string) => {
  switch (icon) {
    case "POSIcon":
      return POSIcon;
    case "BoxIcon":
      return BoxIcon;
    case "LayersIcon":
      return LayersIcon;
    case "VerticalDots":
      return VerticalDots;
  }
};

const onNavLinkClick = () => {
  if (props.item.title === "More") {
    isDialogVisible.value = true;
  }
};

const onMoreNavLinksClick = (item: SubLink) => {
  isDialogVisible.value = false;
  if (item.to === "/login") {
    try {
      const response = api.auth.logout();

      userStore.logOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<template>
  <li
    v-if="can(item.action, item.subject)"
    class="nav-link"
    :class="{ disabled: item.disable }"
  >
    <Component
      :is="item?.to ? 'RouterLink' : 'button'"
      v-bind="getComputedNavLinkToProp(item)"
      class="flex gap-2 items-center py-4 text-base border-b-[2px] transition"
      :class="{
        'border-transparent': !isNavLinkActive(item, $router),
        'border-primary': isNavLinkActive(item, $router),
      }"
      @click.prevent="onNavLinkClick"
    >
      <Component
        :is="renderNavIcons(item.icon)"
        class="w-[20px] h-[20px]"
        v-bind:color="
          isNavLinkActive(item, $router) ? staticPrimaryColor : undefined
        "
      />
      <TransitionGroup name="transition-slide-x">
        <!-- 👉 Title -->
        <Component
          :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
          v-show="!hideTitleAndBadge"
          key="title"
          class="nav-item-title"
          v-bind="getDynamicI18nProps(item.title, 'span')"
        >
          {{ item.title }}
        </Component>

        <!-- 👉 Badge -->
        <Component
          :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
          v-if="item.badgeContent"
          v-show="!hideTitleAndBadge"
          key="badge"
          class="nav-item-badge"
          :class="item.badgeClass"
          v-bind="getDynamicI18nProps(item.badgeContent, 'span')"
        >
          {{ item.badgeContent }}
        </Component>
      </TransitionGroup>
    </Component>
    <VDialog
      v-model="isDialogVisible"
      width="500"
      v-if="props.item.title === 'More'"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <VCard>
        <div class="grid grid-cols-2 gap-4 p-8">
          <RouterLink
            class="p-2 flex gap-2 items-center rounded cursor-pointer"
            :class="{
              'bg-primary': isSubLinkActive(subLink.to, $router),
            }"
            :to="subLink.to"
            v-for="subLink in item.sub_links"
            :key="subLink.title"
            @click.prevent="onMoreNavLinksClick(subLink)"
          >
            <Component
              :is="renderNavIcons(subLink.icon)"
              class="w-[20px] h-[20px]"
              v-bind:color="
                isSubLinkActive(subLink.to, $router) ? '#fff' : undefined
              "
            />
            {{ subLink.title }}
          </RouterLink>
        </div>
      </VCard>
    </VDialog>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link a {
    display: flex;
    align-items: center;
  }
}
</style>
