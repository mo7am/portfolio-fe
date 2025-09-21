<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    permission: "",
  },
});

setPageTitle("Dashboard");
</script>
<template>
  <MerchantDashboard />
</template>
