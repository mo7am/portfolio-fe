<script setup lang="ts">
const props = defineProps({
  sales: {
    type: Number,
    default: 0,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  productsCount: {
    type: Number,
    default: 0,
  },
  customersCount: {
    type: Number,
    default: 0,
  },
});

const statistics = [
  {
    title: "Sales",
    stats: "$" + props.sales.toFixed(2),
    icon: "tabler-chart-pie-2",
    color: "primary",
  },
  {
    title: "Customers",
    stats: props.customersCount,
    icon: "tabler-users",
    color: "info",
  },
  {
    title: "Products",
    stats: props.productsCount,
    icon: "tabler-shopping-cart",
    color: "error",
  },
  {
    title: "Revenue",
    stats: "$" + props.revenue.toFixed(2),
    icon: "tabler-currency-dollar",
    color: "success",
  },
];

const latestUpdate = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  let date = new Date(document.lastModified);
  const formattedTime = formatter.format(date);
  return "Last updated in " + date.toDateString() + " at " + formattedTime;
};
</script>

<template>
  <VCard title="Statistics">
    <template #append>
      <span class="text-sm text-disabled">{{ latestUpdate() }}</span>
    </template>

    <VCardText class="pt-6">
      <VRow>
        <VCol v-for="item in statistics" :key="item.title" cols="6" md="3">
          <div class="d-flex align-center gap-4">
            <VAvatar :color="item.color" variant="tonal" size="42">
              <VIcon :icon="item.icon" />
            </VAvatar>

            <div class="d-flex flex-column">
              <span class="text-h5 font-weight-medium">{{ item.stats }}</span>
              <span class="text-sm">
                {{ item.title }}
              </span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
