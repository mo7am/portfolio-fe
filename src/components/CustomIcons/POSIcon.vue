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
    width="12"
    height="15"
    viewBox="0 0 12 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 8.75V11.75C1 12.8546 1.89543 13.75 3 13.75H9C10.1046 13.75 11 12.8546 11 11.75V3.25C11 2.14543 10.1046 1.25 9 1.25H3C1.89543 1.25 1 2.14543 1 3.25V6.25"
      :stroke="color"
      stroke-width="1.2"
      stroke-linecap="round"
    />
    <path
      d="M4.75 3.74902H4.4375C3.91973 3.74902 3.5 4.16876 3.5 4.68652V4.68652C3.5 5.20429 3.91973 5.62402 4.4375 5.62402H7.5625C8.08027 5.62402 8.5 5.20429 8.5 4.68652V4.68652C8.5 4.16876 8.08027 3.74902 7.5625 3.74902H7.25"
      :stroke="color"
      stroke-width="1.2"
      stroke-linecap="round"
    />
    <path
      d="M4.125 11.249H3.5"
      :stroke="color"
      stroke-width="1.2"
      stroke-linecap="round"
    />
    <path
      d="M4.125 8.74902H3.5"
      :stroke="color"
      stroke-width="1.2"
      stroke-linecap="round"
    />
    <path
      d="M7.875 11.249H8.5"
      :stroke="color"
      stroke-width="1.2"
      stroke-linecap="round"
    />
    <path
      d="M7.875 8.74902L8.5 8.74902"
      :stroke="color"
      stroke-width="1.2"
      stroke-linecap="round"
    />
  </svg>
</template>
