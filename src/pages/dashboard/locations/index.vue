<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    layout: "side-menu",
    title: "Locations",
    permission: "view-discount",
  },
});
setPageTitle("Locations");
</script>
<template>
  <div>Hello Locations!</div>
</template>
