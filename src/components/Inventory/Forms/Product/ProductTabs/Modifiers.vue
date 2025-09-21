<script setup lang="ts">
import type { ProductProvider } from "../ProductProvider.vue";
import CustomCheckbox from "@/base-components/CustomCheckbox";

const productProvider = inject<ProductProvider>("product-provider");

const selectModifier = (modifier: any) => {
  if (productProvider?.value) {
    if (productProvider.value.form?.modifiers) {
      const isSelected = productProvider?.value.form?.modifiers?.includes(
        modifier.id
      );
      if (!isSelected) {
        productProvider.value.form.modifiers.push(modifier.id);
      } else {
        const index = productProvider?.value.form?.modifiers?.findIndex(
          (discountID: number) => discountID === modifier.id
        );

        if (index !== -1) {
          productProvider.value.form.modifiers.splice(index, 1);
        }
      }
    } else {
      productProvider.value.form.modifiers = [modifier.id];
    }
  }
};

const isModifierSelected = (id: number) => {
  return !!productProvider?.value.form?.modifiers?.includes(id);
};
</script>
<template>
  <div
    class="flex flex-col gap-4 max-h-[450px] overflow-auto py-2 pr-1"
    id="modifiers"
    v-if="productProvider"
  >
    <label
      class="border rounded flex justify-between items-center gap-4 p-3 cursor-pointer"
      v-for="modifier in productProvider.initialData?.modifiers"
      :key="modifier.id"
      :for="`modifier-${modifier.id}`"
      @click="selectModifier(modifier)"
    >
      <div class="flex gap-2 items-center">
        <CustomCheckbox :checked="isModifierSelected(modifier.id)" />
        <span>{{ modifier.name }}</span>
      </div>
      <span>{{ modifier.amount }}</span>
    </label>
  </div>
</template>
