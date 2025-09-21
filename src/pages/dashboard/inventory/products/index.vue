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
    title: "Products",
    permission: "view-product",
  },
});

const menuStore = useInventoryMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const allProducts = ref<any[]>([]);
const favouriteProducts = ref<any[]>([]);
const allMeta = ref<any>({});
const favouriteMeta = ref<any>({});
const allPage = ref(1);
const favouritePage = ref(1);
const itemType = ref("all");

const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Inventory-Products";

const getProducts = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      allPage.value = 1;
    }
    const res = await api.inventory.product.getProducts({
      search: search,
      page: allPage.value,
      limit: 20,
    });
    allProducts.value = await res?.data?.data;
    allMeta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const getFavouriteProducts = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      favouritePage.value = 1;
    }
    const res = await api.inventory.product.getFavouriteProducts({
      search: search,
      page: favouritePage.value,
      limit: 20,
    });
    favouriteProducts.value = await res?.data?.data;
    favouriteMeta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const deleteProduct = async () => {
  menuStore.setIsDeleting(true);
  try {
    const res = await api.inventory.product.deleteProduct(
      menuStore.getIDToEdit
    );
    if (res !== undefined && res?.data?.status) {
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span class="text-sm">Product Deleted Successfully!</span>`,
      });
      menuStore.setIsDeletePopupVisible(false);
      if (itemType.value == "all") {
        if (allProducts.value.length == 1) {
          allPage.value--;
        }
        getProducts();
      }

      if (itemType.value == "favourite") {
        if (favouriteProducts.value.length == 1) {
          favouritePage.value--;
        }
        getFavouriteProducts();
      }
    }
  } catch (error) {
    console.log(error);
  }
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

getProducts();
getFavouriteProducts();

const getProductsPerType = () => {
  if (itemType.value == "all") {
    getProducts();
  } else if (itemType.value == "favourite") {
    getFavouriteProducts();
  }
};

watch(() => menuStore.getSearchValue, getProductsPerType);

watch(
  () => menuStore.getIsGetData,
  () => {
    getProducts();
    getFavouriteProducts();
  }
);

watch(
  () => menuStore.getIsDeleteRecord,
  () => {
    deleteProduct();
  }
);

const setType = (type: string) => {
  itemType.value = type;
  getProductsPerType();
};
</script>

<template>
  <section>
    <div class="grid" style="margin-top: -17px">
      <VCardText class="d-flex flex-column gap-2">
        <div>
          <VTabs class="v-tabs-pill px-6 py-4" fixed-tabs>
            <VTab
              class="rounded-lg shadow bg-[#f8f7fa] dark:bg-darkmode-bg"
              @click="setType('all')"
              >All</VTab
            >
            &nbsp;&nbsp;
            <VTab
              class="rounded-lg shadow bg-[#f8f7fa] dark:bg-darkmode-bg"
              @click="setType('favourite')"
              >Favourites</VTab
            >
          </VTabs>
        </div>
      </VCardText>
      <VCardText>
        <div class="flex p-4" v-if="isLoading">
          <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
        </div>
        <VWindow
          style="margin-top: -10px"
          class="ms-3"
          v-model="itemType"
          v-else
        >
          <VWindowItem value="all">
            <div class="grid products-grid gap-4 max-h-[450px] overflow-auto">
              <template v-if="allProducts.length">
                <div
                  class="relative grid product-grid p-2 shadow bg-white dark:bg-surface rounded gap-2 w-full"
                  v-for="product in allProducts"
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
                      <span
                        v-if="product?.categories.length > 1"
                        class="text-slate-300 text-sm"
                      >
                        {{ product?.categories[0].name }} ...
                        <VTooltip
                          open-delay="500"
                          location="top"
                          activator="parent"
                        >
                          <span>{{
                            product?.categories
                              .map((category: any) => category?.name)
                              .join(", ")
                          }}</span>
                        </VTooltip>
                      </span>
                      <span v-else class="text-slate-300 text-sm">{{
                        product?.categories[0]?.name
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
          </VWindowItem>
          <VWindowItem value="favourite">
            <div class="grid products-grid gap-4 max-h-[450px] overflow-auto">
              <template v-if="favouriteProducts.length">
                <div
                  class="relative grid product-grid p-2 shadow bg-white dark:bg-surface rounded gap-2 w-full"
                  v-for="product in favouriteProducts"
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
                      <span
                        v-if="product?.categories.length > 1"
                        class="text-slate-300 text-sm"
                      >
                        {{ product?.categories[0].name }} ...
                        <VTooltip
                          open-delay="500"
                          location="top"
                          activator="parent"
                        >
                          <span>{{
                            product?.categories
                              .map((category: any) => category?.name)
                              .join(", ")
                          }}</span>
                        </VTooltip>
                      </span>
                      <span v-else class="text-slate-300 text-sm">{{
                        product?.categories[0].name
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
          </VWindowItem>
        </VWindow>
      </VCardText>
    </div>
    <div
      class="mt-8 flex m-auto"
      v-if="itemType == 'all' && allMeta && allProducts.length"
      :class="{
        'opacity-0': isLoading,
      }"
      style="margin-left: 15px"
    >
      <Pagination
        @pageChanged="
          allPage = $event;
          getProducts();
        "
        :meta="allMeta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
    <div
      class="mt-8 flex m-auto"
      v-if="
        itemType == 'favourite' && favouriteMeta && favouriteProducts.length
      "
      :class="{
        'opacity-0': isLoading,
      }"
      style="margin-left: 15px"
    >
      <Pagination
        @pageChanged="
          favouritePage = $event;
          getFavouriteProducts();
        "
        :meta="favouriteMeta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
  </section>
</template>
<style>
.products-grid {
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.product-grid {
  grid-template-columns: 40px 1fr;
}
</style>
