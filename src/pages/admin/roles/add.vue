<script setup lang="ts">
import AdminRoleForm from "@/components/AdminRoles/AdminRoleForm.vue";

definePage({
  meta: {
    requiresAuth: true,
    permission: "",
    layout: "default-admin",
  },
});

setPageTitle("Add Role");
</script>
<template>
  <AdminRoleForm />
</template>
