<script setup lang="ts">
import AdminRolesList from "../../../components/Roles/RolesList.vue";

definePage({
  meta: {
    requiresAuth: true,
    permission: "view-roles",
    layout: "default-admin",
  },
});

setPageTitle("Roles");
</script>
<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <h1 class="text-xl font-medium text-[#2F2B3DC7]">Roles List</h1>
      <p class="max-w-[600px] text-[#2F2B3DC7]">
        A role provided access to predefined modules and features so that
        depending on assigned role an administrator can have access to what he
        need
      </p>
    </div>
    <div>
      <AdminRolesList />
    </div>
    <!-- <div class="mt-4">
      <UsersList is-in-roles />
    </div> -->
  </section>
</template>
