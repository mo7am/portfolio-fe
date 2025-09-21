<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const { y } = useWindowScroll();

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const userStore = useUserStore();
const isAdmin = userStore.getIsAdmin;
const isEmulation = computed(() => {
  return userStore.getIsEmulation;
});
</script>

<template>
  <VScaleTransition
    style="transform-origin: center"
    class="scroll-to-top d-print-none"
  >
    <VBtn
      :color="isAdmin || userStore.getIsEmulation == 0 ? 'black' : 'primary'"
      class="text-white"
      v-show="y > 200"
      icon
      density="comfortable"
      @click="scrollToTop"
    >
      <VIcon size="22" icon="tabler-arrow-up" />
    </VBtn>
  </VScaleTransition>
</template>

<style lang="scss">
.scroll-to-top {
  position: fixed !important;

  // To keep button on top of v-layout. E.g. Email app
  z-index: 999;
  inset-block-end: 5%;
  inset-inline-end: 25px;
}
</style>
