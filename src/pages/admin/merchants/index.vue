<script setup lang="ts">
definePage({
  meta: {
    requiresAuth: true,
    permission: "view-merchant",
    layout: "default-admin",
  },
});

setPageTitle("Merchants");
</script>
<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <h1 class="text-xl font-medium text-[#2F2B3DC7]">Merchants List</h1>
      <p class="max-w-[600px] text-[#2F2B3DC7]">
        A role provided access to predefined modules and features so that
        depending on assigned role an administrator can have access to what he
        need
      </p>
    </div>

    <div class="mt-4">
      <MerchantList />
    </div>
  </section>
</template>
