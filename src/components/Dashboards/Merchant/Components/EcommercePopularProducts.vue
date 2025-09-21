<script setup lang="ts">
import placeholder from "@/assets/images/placeholder.png";
import { useRouter } from "vue-router";

const props = defineProps({
  products: {
    type: Array<any>,
    default: [],
  },
});

const router = useRouter();
const popularProducts = ref<any[]>([]);

props.products.forEach((popularProduct: any) => {
  if (popularProduct?.product?.id) {
    let obj = {
      avatarImg: popularProduct.product?.image
        ? popularProduct.product.image
        : placeholder,
      title: popularProduct.product?.name,
      subtitle: "Item: #" + popularProduct.product?.id,
      stats: "$" + popularProduct.product?.price,
    };
    popularProducts.value.push(obj);
  }
});

const showMore = () => {
  router.push("/dashboard/inventory/products");
};

const moreList = [{ title: "View All", value: "View All" }];
</script>

<template>
  <VCard
    title="Popular Products"
    subtitle="List of popular products sold in orders"
  >
    <template #append>
      <div class="mt-n4 me-n2" v-can="'view-product'">
        <MoreBtn @callShowMore="showMore" :menu-list="moreList" />
      </div>
    </template>

    <VCardText>
      <VList class="card-list" v-if="popularProducts.length > 0">
        <VListItem v-for="product in popularProducts" :key="product.title">
          <template #prepend>
            <VAvatar size="46" rounded :image="product.avatarImg" />
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ product.title }}
          </VListItemTitle>
          <VListItemSubtitle class="text-disabled">
            {{ product.subtitle }}
          </VListItemSubtitle>

          <template #append>
            <div class="d-flex align-center">
              <span class="font-weight-medium text-medium-emphasis me-2">{{
                product.stats
              }}</span>
            </div>
          </template>
        </VListItem>
      </VList>
      <VList class="card-list" v-else> No data available </VList>
    </VCardText>
  </VCard>
</template>
