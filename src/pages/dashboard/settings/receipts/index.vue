<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    permission: "view-receipt",
    title: "Receipts",
    layout: "side-menu",
  },
});

setPageTitle("Receipts Settings");
</script>
<template>
  <Receipts />
</template>
