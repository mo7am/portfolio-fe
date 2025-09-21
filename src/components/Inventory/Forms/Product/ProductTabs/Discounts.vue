<script setup lang="ts">
import type { ProductProvider } from "../ProductProvider.vue";
import CustomCheckbox from "@/base-components/CustomCheckbox";

const productProvider = inject<ProductProvider>("product-provider");

const selectDiscount = (discount: any) => {
  if (productProvider?.value) {
    if (productProvider.value.form?.discounts) {
      const isSelected = productProvider?.value.form?.discounts?.includes(
        discount.id
      );
      if (!isSelected) {
        productProvider.value.form.discounts.push(discount.id);
      } else {
        const index = productProvider?.value.form?.discounts?.findIndex(
          (discountID: number) => discountID === discount.id
        );

        if (index !== -1) {
          productProvider.value.form.discounts.splice(index, 1);
        }
      }
    } else {
      productProvider.value.form.discounts = [discount.id];
    }
  }
};

const isDiscountSelected = (id: number) => {
  return !!productProvider?.value.form?.discounts?.includes(id);
};
</script>
<template>
  <div
    class="flex flex-col gap-4 max-h-[450px] overflow-auto py-2 pr-1"
    id="discounts"
    v-if="productProvider"
  >
    <label
      class="border rounded flex justify-between items-center gap-4 p-3 cursor-pointer"
      v-for="discount in productProvider.initialData?.discounts"
      :key="discount.id"
      :for="`discount-${discount.id}`"
      @click="selectDiscount(discount)"
    >
      <div class="flex gap-2 items-center">
        <CustomCheckbox :checked="isDiscountSelected(discount.id)" />
        <span>{{ discount.name }}</span>
      </div>
      <span>
        {{ discount.type === "amount" ? "$" : "" }}
        {{ makeFLoat(discount.amount, discount.type) }}
        {{ discount.type === "percentage" ? "%" : "" }}</span
      >
    </label>
  </div>
</template>
