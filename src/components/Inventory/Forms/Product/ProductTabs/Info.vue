<script setup lang="ts">
import FileUploader from "@/base-components/FileUploader";
import { ProductProvider } from "../ProductProvider.vue";
import CustomDropdown from "@/base-components/CustomDropdown";

const productProvider = inject<ProductProvider>("product-provider");
const imageToEdit = ref<any[]>([]);

imageToEdit.value.push({
  url: productProvider?.value?.initialData?.product?.image,
});

if (productProvider?.value) {
  productProvider.value.form.image = null;
}

const setFiles = (file: any) => {
  if (productProvider?.value) {
    if (file === "") {
      productProvider.value.form.is_image_cleared = true;
      productProvider.value.form.image = null;
      return;
    } else {
      productProvider.value.form.image = file;
    }
  }
};

const setIsFavourite = () => {
  if (productProvider?.value) {
    productProvider.value.form.is_favorite =
      !productProvider.value.form.is_favorite;
  }
};

const setIsVariablePrice = () => {
  if (productProvider?.value) {
    productProvider.value.form.is_variable_price =
      !productProvider.value.form.is_variable_price;
  }
};

const clearValidation = (input_id: string) => {
  removeError(input_id);
};
</script>
<template>
  <div class="flex flex-col gap-4 py-2" v-if="productProvider">
    <div class="grid grid-cols-2 gap-4">
      <div id="name">
        <AppTextField
          @keyup="clearValidation('name')"
          type="text"
          v-model="productProvider.form.name"
          label="Name"
          placeholder="Type Here..."
          :isRequired="true"
        />
      </div>
      <div id="price">
        <AppTextField
          type="number"
          v-model="productProvider.form.price"
          label="Price"
          :min="0"
          placeholder="$ 0.00"
        />
      </div>
      <div class="flex justify-between col-span-full">
        <div class="flex flex-col">
          <label class="text-base" for="is_variable_price"
            >Variable Price</label
          >
        </div>
        <div>
          <VSwitch
            class="cursor-pointer"
            @click="setIsVariablePrice()"
            v-model="productProvider.form.is_variable_price"
            id="is_variable_price"
            color="success"
          />
        </div>
      </div>
      <div class="flex justify-between col-span-full">
        <div class="flex flex-col">
          <label class="text-base" for="is_favorite">Is Favourite</label>
        </div>
        <div>
          <VSwitch
            class="cursor-pointer"
            @click="setIsFavourite()"
            v-model="productProvider.form.is_favorite"
            id="is_favorite"
            color="success"
          />
        </div>
      </div>
      <div id="sku_code">
        <AppTextField
          type="text"
          v-model="productProvider.form.sku_code"
          label="SKU Code"
          placeholder="Type Here..."
        />
      </div>
      <div id="bar_code">
        <AppTextField
          type="text"
          v-model="productProvider.form.bar_code"
          label="Bar Code"
          placeholder="Type Here..."
        />
      </div>
      <div id="categories" class="relative">
        <CustomDropdown
          @update:model-value="clearValidation('categories')"
          :items="productProvider.initialData?.categories"
          v-model="productProvider.form.categories"
          :pre-selected-item="productProvider.initialData?.product?.categories"
          label="Category"
          placeholder="Select Category"
          item-title="name"
          item-value="id"
          disabled-key="disabled"
          isWithSubArray
          hasSearch
          custom
          multiple
          hasCheckboxes
          :isRequired="true"
        />
      </div>
      <div id="brands" class="relative">
        <AppSelect
          v-model="productProvider.form.brands"
          :items="productProvider.initialData?.brands"
          label="Brand"
          item-title="name"
          item-value="id"
          form-id="brands"
          multiple
          placeholder="Select Brand"
        />
      </div>
      <div class="col-span-full" id="image">
        <label
          >Image
          <span class="text-xs"
            >(Allowed PNG or JPEG. Max size of 2MB.)</span
          ></label
        >
        <div class="mt-2">
          <FileUploader
            :accepted-types="['png', 'jpg', 'jpeg', 'gif']"
            :setFiles="setFiles"
            :edit-form-files="imageToEdit"
            single
          />
        </div>
      </div>
    </div>
  </div>
</template>
