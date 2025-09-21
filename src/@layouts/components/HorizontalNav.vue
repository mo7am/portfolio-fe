<script lang="ts" setup>
import type { Component } from "vue";
import {
  VerticalNavGroup,
  HorizontalNavLink,
  VerticalNavSectionTitle,
} from "@layouts/components";
import { injectionKeyIsVerticalNavHovered } from "@layouts/symbols";
import type {
  NavGroup,
  NavLink,
  NavSectionTitle,
  NavItems,
} from "@layouts/types";

interface Props {
  tag?: string | Component;
  navItems: NavItems;
  isOverlayNavActive: boolean;
  toggleIsOverlayNavActive: (value: boolean) => void;
}

const props = withDefaults(defineProps<Props>(), {
  tag: "aside",
});

const refNav = ref();

const isHovered = useElementHover(refNav);

provide(injectionKeyIsVerticalNavHovered, isHovered);

const resolveNavItemComponent = (
  item: NavLink | NavSectionTitle | NavGroup
): unknown => {
  if ("heading" in item) return VerticalNavSectionTitle;
  if ("children" in item) return VerticalNavGroup;

  return HorizontalNavLink;
};
const route = useRoute();

const isSideMenuPage = computed(() => {
  const routeFullPath = route.fullPath;

  return (
    routeFullPath.includes("dashboard/inventory") ||
    routeFullPath.includes("dashboard/settings") ||
    routeFullPath.includes("dashboard/locations") ||
    routeFullPath.includes("dashboard/roles") ||
    routeFullPath.includes("dashboard/operators") ||
    routeFullPath.includes("dashboard/sales-list") ||
    routeFullPath.includes("dashboard/customers") ||
    routeFullPath.includes("dashboard/tapes")
  );
});

watch(
  () => route.name,
  () => {
    props.toggleIsOverlayNavActive(false);
  }
);
</script>

<template>
  <Component
    :is="props.tag"
    ref="refNav"
    class="fixed mx-auto w-[100%] top-[80%] md:top-[85%] z-[1000]"
    :class="{
      'md:top-[88%]': !isSideMenuPage,
    }"
  >
    <div
      class="max-w-[650px] rounded px-11 mx-auto"
      :class="{
        'xl:max-w-[980px]': !isSideMenuPage,
      }"
    >
      <ul
        class="px-4 bg-white dark:bg-surface rounded shadow grid grid-cols-2 md:flex md:justify-between items-center gap-2"
        :class="{
          'xl:w-980': isSideMenuPage,
        }"
      >
        <Component
          :is="resolveNavItemComponent(item)"
          v-for="(item, index) in navItems"
          :key="index"
          :item="item"
        />
      </ul>
    </div>
  </Component>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .w-980 {
    width: 980px;
  }
}
</style>
