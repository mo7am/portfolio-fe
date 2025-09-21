<script setup lang="ts">
import type { ProductProvider } from "../ProductProvider.vue";

const productProvider = inject<ProductProvider>("product-provider");

const setIsWeighingScale = () => {
  if (productProvider?.value) {
    productProvider.value.form.is_weighing_scale =
      !productProvider.value.form.is_weighing_scale;
  }
};

const clearValidation = (input_id: string) => {
  removeError(input_id);
};
</script>
<template>
  <div class="flex flex-col gap-4 py-2" v-if="productProvider">
    <div class="grid grid-cols-2 gap-4">
      <div class="flex justify-between col-span-full">
        <div class="flex flex-col">
          <label class="text-base" for="is_weighing_scale"
            >Weighing Scale</label
          >
          <span class="text-slate-300 text-xs">
            Lorem ipsum dolor sit amet consectetur. Aliquam consectetur.
          </span>
        </div>
        <div>
          <VSwitch
            class="cursor-pointer"
            @click="setIsWeighingScale()"
            v-model="productProvider.form.is_weighing_scale"
            id="is_weighing_scale"
            color="success"
          />
        </div>
      </div>
      <div
        v-if="productProvider.form.is_weighing_scale"
        id="unit"
        class="relative col-span-full"
      >
        <AppSelect
          @update:model-value="clearValidation('unit')"
          v-model="productProvider.form.unit"
          :items="productProvider.initialData?.units"
          label="Unit"
          item-title="name"
          item-value="value"
          form-id="units"
          placeholder="Select Unit"
          :isRequired="true"
        />
      </div>
      <div id="quantity">
        <AppTextField
          type="number"
          v-model="productProvider.form.quantity"
          label="Quantity"
          :min="0"
          placeholder="0"
        />
      </div>
      <div id="cost">
        <AppTextField
          type="number"
          v-model="productProvider.form.cost"
          label="Cost"
          :min="0"
          placeholder="$ 0.00"
        />
      </div>
      <div class="col-span-full" id="description">
        <AppTextarea
          v-model="productProvider.form.description"
          label="Description"
          placeholder="Description"
        />
      </div>
    </div>
  </div>
</template>
