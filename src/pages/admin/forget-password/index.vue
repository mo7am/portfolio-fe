<script setup lang="ts">
import ForgetPassword from "../../../components/ForgetPassword/ForgetPassword.vue";

definePage({
  meta: {
    layout: "blank",
    requiresAuth: false,
  },
});
</script>
<template>
  <ForgetPassword isAdmin />
</template>
