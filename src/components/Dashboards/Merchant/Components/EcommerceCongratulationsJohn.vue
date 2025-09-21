<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const props = defineProps({
  revenueThisMonth: {
    type: Number,
    default: 0,
  },
});

const user = useUserStore().getUser;
</script>
<template>
  <VCard>
    <VRow no-gutters>
      <VCol cols="8">
        <VCardText>
          <h6 class="text-lg text-no-wrap font-weight-medium">
            Hello {{ user.name }}🎉
          </h6>
          <p class="mb-2">Sales of this month</p>
          <h4 class="text-h4 font-weight-medium text-primary mb-1">
            ${{ props.revenueThisMonth.toFixed(2) }}
          </h4>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
</template>
