<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    permission: "view-reason",
    title: "Refund Reasons",
    layout: "side-menu",
  },
});

setPageTitle("Refund Reasons");
</script>
<template>
  <Reasons />
</template>
