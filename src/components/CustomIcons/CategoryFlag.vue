<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: "#444444",
  },
});
</script>
<template>
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 21L1 7C1 3.68629 3.6863 1 7 1L21 1"
      :stroke="color"
      stroke-width="2"
    />
  </svg>
</template>
