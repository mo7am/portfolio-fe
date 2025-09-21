<script lang="ts">
export default {
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: "a",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { useAttrs } from "vue";

const isAdmin = useUserStore().getIsAdmin;

const attrs = useAttrs();
</script>

<template>
  <li class="flex-1 sm:flex-initial flex">
    <button
      :as="as"
      :class="{
        ' rounded font-medium dark:bg-darkmode-400': active,
        'bg-primary text-white':
          (!isAdmin || useUserStore().getIsEmulation == 1) && active,
        'bg-black text-white':
          (isAdmin || useUserStore().getIsEmulation == 0) && active,
      }"
      class="p-2 min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center justify-center border-transparent text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3"
      v-bind="attrs"
    >
      <slot></slot>
    </button>
  </li>
</template>
