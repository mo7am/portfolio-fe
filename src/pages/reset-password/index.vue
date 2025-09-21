<script setup lang="ts">
import ResetPassword from "../../components/ResetPassword/ResetPassword.vue";

definePage({
  meta: {
    layout: "blank",
    requiresAuth: false,
  },
});
</script>
<template>
  <ResetPassword />
</template>
