<script setup lang="ts">
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { useInventoryMenu } from "@/stores/inventory-menu";
import placeholder from "@/assets/images/placeholder.png";
import Lucide from "@/base-components/Lucide/Lucide.vue";
import { Toast } from "../../../../plugins/swal";
import LoadingIcon from "@/base-components/LoadingIcon";

definePage({
  meta: {
    requiresAuth: true,
    layout: "side-menu",
    title: "Categories",
    permission: "view-category",
  },
});

const menuStore = useInventoryMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const meta = ref<any>({});
const categories = ref<any[]>([]);
const page = ref(1);

setPageTitle("Inventory-Categories");

const getCategories = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      page.value = 1;
    }
    const res = await api.inventory.category.getCategories({
      search: search,
      page: page.value,
      limit: 20,
      parent_id: "",
      main_category: "",
    });
    categories.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const deleteCategory = async () => {
  menuStore.setIsDeleting(true);
  try {
    const res = await api.inventory.category.deleteCategory(
      menuStore.getIDToEdit
    );
    if (res?.data?.status) {
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span class="text-sm">Category Deleted Successfully!</span>`,
      });

      getCategories();
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

const openDeletePopup = (id: number, number_of_items: any) => {
  if (number_of_items > 0) {
    Toast.fire({
      icon: "error",
      padding: "10px",
      background: "#fff",
      html: `<span class="text-sm">Categories containing items cannot be deleted!</span>`,
    });
  } else {
    menuStore.setIDToEdit(id);
    menuStore.setIsDeletePopupVisible(true);
  }
};

getCategories();

watch(
  () => menuStore.getSearchValue,
  () => {
    getCategories();
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getCategories();
  }
);

watch(
  () => menuStore.getIsDeleteRecord,
  () => {
    deleteCategory();
  }
);
</script>

<template>
  <section>
    <div class="flex p-4" v-if="isLoading">
      <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
    </div>
    <div v-else class="grid categories-grid gap-4 max-h-[450px] overflow-auto">
      <template v-if="categories.length">
        <div
          class="relative p-2 shadow bg-white dark:bg-surface rounded gap-2 w-full grid category-grid"
          v-for="category in categories"
          :key="category.id"
        >
          <div class="absolute top-0 left-0">
            <CategoryFlag :color="category.color" v-if="category?.color" />
          </div>
          <div class="flex">
            <img
              :src="category?.image ? category.image : placeholder"
              class="w-[40px] h-[40px] rounded m-auto"
            />
          </div>
          <div class="flex flex-col">
            <h3 class="dark:text-white">{{ category?.name || "N/A" }}</h3>
            <div class="flex justify-between items-center gap-2 w-full">
              <!-- <span class="text-slate-300 text-sm"
                >{{ category?.number_of_items || 0 }} Items</span
              > -->
              <span
                class="text-slate-300 text-sm dots cursor-pointer"
                variant="outlined"
              >
                {{ category?.number_of_items || 0 }} Items
                <VTooltip
                  v-if="
                    category?.number_of_items > 0 &&
                    category.products.length > 5
                  "
                  open-delay="500"
                  location="top"
                  activator="parent"
                >
                  <span
                    v-for="(product, index) in category.products.slice(0, 5)"
                    ><span>{{ product.name }}</span>
                    <span
                      v-if="
                        index !=
                        Object.keys(category.products.slice(0, 5)).length - 1
                      "
                      >,
                    </span>
                    <span v-else>, ....</span>
                  </span>
                </VTooltip>
                <VTooltip
                  v-else-if="
                    category?.number_of_items > 0 &&
                    category.products.length <= 5
                  "
                  open-delay="500"
                  location="top"
                  activator="parent"
                >
                  <span v-for="(product, index) in category.products"
                    ><span>{{ product.name }}</span>
                    <span
                      v-if="index != Object.keys(category.products).length - 1"
                      >,
                    </span></span
                  >
                </VTooltip>
              </span>
              <div class="flex gap-2 items-center">
                <button
                  v-can="'edit-category'"
                  class="cursor-pointer"
                  type="button"
                  @click="openEditPopup(category.id)"
                >
                  <Lucide icon="Edit" class="w-4 h-4" />
                </button>
                <button
                  v-can="'delete-category'"
                  class="cursor-pointer"
                  type="button"
                  @click="
                    openDeletePopup(category.id, category?.number_of_items)
                  "
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
      v-if="meta && categories.length"
      :class="{
        'opacity-0': isLoading,
      }"
    >
      <Pagination
        @pageChanged="
          page = $event;
          getCategories();
        "
        :meta="meta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
  </section>
</template>
<style>
.categories-grid {
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.category-grid {
  grid-template-columns: 40px 1fr;
}
</style>
