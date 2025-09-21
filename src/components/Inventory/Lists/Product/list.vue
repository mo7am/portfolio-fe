<script setup lang="ts">
import { useInventoryMenu } from "@/stores/inventory-menu";
import placeholder from "@/assets/images/placeholder.png";
import Lucide from "@/base-components/Lucide/Lucide.vue";

const props = defineProps({
  products: {
    type: Array<any>,
    default: [],
  },
});
const menuStore = useInventoryMenu();

const openEditPopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsPopupVisible(true);
};

const openDeletePopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsDeletePopupVisible(true);
};
</script>
<template>
  <div class="grid products-grid gap-4 max-h-[450px] overflow-auto">
    <template v-if="products.length">
      <div
        class="relative grid product-grid cursor-pointer p-2 shadow bg-white dark:bg-surface rounded gap-2 w-full"
        v-for="product in products"
        :key="product.id"
      >
        <div class="flex">
          <img
            :src="product?.image ? product.image : placeholder"
            class="w-[40px] h-[40px] rounded m-auto"
          />
        </div>
        <div class="flex flex-col">
          <div class="flex justify-between items-center gap-2">
            <h3 class="dark:text-white">
              {{ product?.name || "N/A" }}
            </h3>
            <svg
              v-if="product.is_favorite"
              class="h-4 w-4 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="#eab308"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M12 3l2.535 6.164h6.465l-5.25 4.75 1.982 6.097L12 15.25l-5.732 4.161 1.982-6.097-5.25-4.75h6.465z"
              />
            </svg>
          </div>
          <div class="flex justify-between items-center gap-2">
            <span class="text-slate-300 text-sm">{{
              product?.categories
                .map((category: any) => category?.name)
                .join(", ")
            }}</span>
            <div class="flex gap-2 items-center">
              <button
                v-can="'edit-product'"
                class="cursor-pointer"
                type="button"
                @click="openEditPopup(product.id)"
              >
                <Lucide icon="Edit" class="w-4 h-4" />
              </button>
              <button
                v-can="'delete-product'"
                class="cursor-pointer"
                type="button"
                @click="openDeletePopup(product.id)"
              >
                <Lucide icon="Trash2" class="w-4 h-4 text-danger" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="text-slate-400" v-else>No Records Found!</div>
  </div>
</template>
