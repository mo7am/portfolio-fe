<script lang="ts" setup>
import { layoutConfig } from "@layouts";
import { can } from "@layouts/plugins/casl";
import { useLayoutConfigStore } from "@layouts/stores/config";
import type { NavLink } from "@layouts/types";
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
import Lucide from "@/base-components/Lucide";

defineProps<{
  item: NavLink;
}>();

const configStore = useLayoutConfigStore();
const hideTitleAndBadge = configStore.isVerticalNavMini();

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
    default:
      return Lucide;
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
      :is="item.to ? 'RouterLink' : 'a'"
      v-bind="getComputedNavLinkToProp(item)"
      :style="
        isNavLinkActive(item, $router)
          ? {
              color: 'white !important',
              background: '#000 !important',
              boxShadow: '0 2px 6px #837C7C !important',
            }
          : {}
      "
    >
      <Component
        :is="renderNavIcons(item.icon)"
        v-bind:color="isNavLinkActive(item, $router) ? '#fff' : '#000'"
        class="nav-item-icon w-4 h-4"
        v-bind:icon="item.icon"
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
