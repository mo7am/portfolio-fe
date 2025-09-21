<script setup lang="ts">
defineProps({
  color: {
    type: String,
    default: "#fff",
  },
});
</script>
<template>
  <svg
    width="10"
    height="9"
    viewBox="0 0 10 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 4.50009H9M5 0.5V8.5"
      :stroke="color"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
