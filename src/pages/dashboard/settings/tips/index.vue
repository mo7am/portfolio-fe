<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    permission: "",
    title: "Tips Management",
    layout: "side-menu",
  },
});

setPageTitle("Tips Management Settings");
</script>
<template>
  <PresetsManagement type="tips" />
</template>
