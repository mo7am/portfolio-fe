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
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.06641 3.5L6.29718 1.32051C6.78948 1.11538 7.34333 1.11538 7.83564 1.32051L10.0664 2.25L13.0664 3.5M1.06641 3.5L4.06641 4.75M1.06641 3.5V6.1M7.06641 6V13M7.06641 6L13.0664 3.5M7.06641 6L4.06641 4.75M7.06641 13L1.68179 10.7564C1.30914 10.6011 1.06641 10.237 1.06641 9.83333V7.9M7.06641 13L12.451 10.7564C12.8237 10.6011 13.0664 10.237 13.0664 9.83333V3.5M4.06641 4.75L7.96641 3.1"
      :stroke="color"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
