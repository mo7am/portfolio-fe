<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    permission: "manage-inventory-settings",
    layout: "side-menu",
  },
});

setPageTitle("Inventory Settings");
</script>
<template>
  <GeneralSettings />
</template>
