<script setup lang="ts">
definePage({
  meta: {
    layout: "blank",
    requiresAuth: false,
    title: "",
    permission: "",
  },
});
</script>

<template>
  <LoginForm isAdmin />
</template>
