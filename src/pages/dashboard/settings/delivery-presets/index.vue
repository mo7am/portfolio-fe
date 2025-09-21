<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    permission: "view-delivery-presets",
    title: "Delivery Presets",
    layout: "side-menu",
  },
});

setPageTitle("Delivery Presets Management Settings");
</script>
<template>
  <PresetsManagement type="delivery-presets" />
</template>
