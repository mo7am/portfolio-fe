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
    width="16"
    height="10"
    viewBox="0 0 16 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 5.0001H1M15 5.0001L11.8 1.6001M15 5.0001L11.8 8.4001"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
