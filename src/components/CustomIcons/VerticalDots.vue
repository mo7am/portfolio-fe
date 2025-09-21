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
    width="4"
    height="22"
    viewBox="0 0 4 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 3.5C1.17157 3.5 0.500001 2.82843 0.500001 2C0.500001 1.17157 1.17157 0.5 2 0.5C2.82843 0.5 3.5 1.17157 3.5 2C3.5 2.82843 2.82843 3.5 2 3.5ZM2 12.5C1.17157 12.5 0.5 11.8284 0.5 11C0.5 10.1716 1.17157 9.5 2 9.5C2.82843 9.5 3.5 10.1716 3.5 11C3.5 11.8284 2.82843 12.5 2 12.5ZM2 21.5C1.17157 21.5 0.5 20.8284 0.5 20C0.5 19.1716 1.17157 18.5 2 18.5C2.82843 18.5 3.5 19.1716 3.5 20C3.5 20.8284 2.82843 21.5 2 21.5Z"
      :fill="color"
      :stroke="color"
      stroke-linejoin="round"
    />
  </svg>
</template>
