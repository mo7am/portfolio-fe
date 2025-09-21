<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    permission: "",
    layout: "default-admin",
  },
});

setPageTitle("Dashboard");
</script>
<template>
  <AdminDashboard />
</template>
