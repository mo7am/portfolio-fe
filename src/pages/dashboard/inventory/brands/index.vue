<script setup lang="ts">
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { useInventoryMenu } from "@/stores/inventory-menu";
import Lucide from "@/base-components/Lucide/Lucide.vue";
import { Toast } from "../../../../plugins/swal";
import placeholder from "@/assets/images/placeholder.png";
import LoadingIcon from "@/base-components/LoadingIcon";

definePage({
  meta: {
    requiresAuth: true,
    layout: "side-menu",
    title: "Brands",
    permission: "view-brand",
  },
});

const menuStore = useInventoryMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const meta = ref<any>({});
const brands = ref<any[]>([]);
const page = ref(1);
const limit = ref(24);

const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Inventory-Brands";

const deleteBrand = async () => {
  menuStore.setIsDeleting(true);
  try {
    const res = await api.inventory.brand.deleteBrand(menuStore.getIDToEdit);
    if (res !== undefined) {
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span class="text-sm">Brand Deleted Successfully!</span>`,
      });
      if (brands.value.length == 1) {
        page.value--;
      }
      getBrands();
    }
  } catch (error) {
    console.log(error);
  }
  menuStore.setIsDeletePopupVisible(false);
  menuStore.setIsDeleting(false);
};

const openEditPopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsPopupVisible(true);
};

const openDeletePopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsDeletePopupVisible(true);
};

const getBrands = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      page.value = 1;
    }
    const res = await api.inventory.brand.getBrands({
      search: search,
      page: page.value,
      limit: limit.value,
    });
    brands.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

getBrands();

watch(
  () => menuStore.getSearchValue,
  () => {
    getBrands();
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getBrands();
  }
);

watch(
  () => menuStore.getIsDeleteRecord,
  () => {
    deleteBrand();
  }
);
</script>

<template>
  <section>
    <div class="flex p-8" v-if="isLoading">
      <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
    </div>
    <div v-else class="grid brands-grid gap-4 max-h-[450px] overflow-auto">
      <template v-if="brands.length">
        <div
          class="relative p-2 shadow bg-white dark:bg-surface rounded gap-2 w-full grid brand-grid"
          v-for="brand in brands"
          :key="brand.id"
        >
          <div class="absolute top-0 left-0"></div>
          <div class="flex">
            <img
              :src="brand?.logo ? brand.logo : placeholder"
              class="w-[40px] h-[40px] rounded m-auto"
            />
          </div>
          <div class="flex flex-col">
            <h3 class="dark:text-white">{{ brand?.name || "N/A" }}</h3>
            <div class="flex justify-between items-center gap-2 w-full">
              <span class="text-slate-300 text-sm"></span>
              <div class="flex gap-2 items-center">
                <button
                  v-can="'edit-brand'"
                  class="cursor-pointer"
                  type="button"
                  @click="openEditPopup(brand.id)"
                >
                  <Lucide icon="Edit" class="w-4 h-4" />
                </button>
                <button
                  v-can="'delete-brand'"
                  class="cursor-pointer"
                  type="button"
                  @click="openDeletePopup(brand.id)"
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
    <div
      class="mt-8 flex m-auto"
      v-if="meta && brands.length"
      :class="{
        'opacity-0': isLoading,
      }"
    >
      <Pagination
        @pageChanged="
          page = $event;
          getBrands();
        "
        :meta="meta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
  </section>
</template>

<style>
.brands-grid {
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.brand-grid {
  grid-template-columns: 40px 1fr;
}
</style>
