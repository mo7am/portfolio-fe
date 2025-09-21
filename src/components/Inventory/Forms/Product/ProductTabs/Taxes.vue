<script setup lang="ts">
import type { ProductProvider } from "../ProductProvider.vue";
import CustomCheckbox from "@/base-components/CustomCheckbox";

const productProvider = inject<ProductProvider>("product-provider");

const selectTax = (tax: any) => {
  if (productProvider) {
    if (productProvider.value.form?.taxes) {
      const isSelected = productProvider.value.form.taxes?.includes(tax.id);
      if (!isSelected) {
        productProvider.value.form.taxes.push(tax.id);
      } else {
        const index = productProvider.value.form.taxes?.findIndex(
          (discountID: number) => discountID === tax.id
        );

        if (index !== -1) {
          productProvider.value.form.taxes.splice(index, 1);
        }
      }
    } else {
      productProvider.value.form.taxes = [tax.id];
    }
  }
};

const isTaxSelected = (id: number) => {
  return !!productProvider?.value.form.taxes?.includes(id);
};
</script>
<template>
  <div
    class="flex flex-col gap-4 max-h-[450px] overflow-auto py-2 pr-1"
    id="taxes"
    v-if="productProvider"
  >
    <label
      class="border rounded flex justify-between items-center gap-4 p-3 cursor-pointer"
      v-for="tax in productProvider.initialData?.taxes"
      :key="tax.id"
      :for="`tax-${tax.id}`"
      @click="selectTax(tax)"
    >
      <div class="flex gap-2 items-center">
        <CustomCheckbox :checked="isTaxSelected(tax.id)" />
        <span>{{ tax.name }}</span>
      </div>
      <span>{{ tax.percentage }}%</span>
    </label>
  </div>
</template>
