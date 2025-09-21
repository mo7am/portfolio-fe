<script setup lang="ts">
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { useInventoryMenu } from "@/stores/inventory-menu";
import Lucide from "@/base-components/Lucide/Lucide.vue";
import { Toast } from "../../../../plugins/swal";
import LoadingIcon from "@/base-components/LoadingIcon";

definePage({
  meta: {
    requiresAuth: true,
    layout: "side-menu",
    title: "Discounts",
    permission: "view-discount",
  },
});

const menuStore = useInventoryMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const cardMeta = ref<any>({});
const itemMeta = ref<any>({});
const cardDiscounts = ref<any[]>([]);
const itemDiscounts = ref<any[]>([]);
const cardPage = ref(1);
const cardLimit = ref(5);
const itemPage = ref(1);
const itemLimit = ref(5);
const itemSorting = ref("asc");
const cardSorting = ref("asc");
const discountType = ref("cart");

const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Inventory-Discounts";

const deleteDiscount = async () => {
  menuStore.setIsDeleting(true);
  try {
    const res = await api.inventory.discount.deleteDiscount(
      menuStore.getIDToEdit
    );
    if (res !== undefined) {
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span class="text-sm">Discoun Deleted Successfully!</span>`,
      });
      menuStore.setIsDeletePopupVisible(false);
      if (discountType.value == "cart") {
        if (cardDiscounts.value.length == 1) {
          cardPage.value--;
        }
        getCardDiscounts();
      }

      if (discountType.value == "item") {
        if (itemDiscounts.value.length == 1) {
          itemPage.value--;
        }
        getItemDiscounts();
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

const setType = (type: string) => {
  menuStore.setDiscountType(type);
  discountType.value = type;
};

const getCardDiscounts = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      cardPage.value = 1;
    }
    const res = await api.inventory.discount.getCardDiscounts({
      search: search,
      page: cardPage.value,
      limit: cardLimit.value,
      sorting: cardSorting.value,
    });
    cardDiscounts.value = await res?.data?.data;
    cardMeta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const getItemDiscounts = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      itemPage.value = 1;
    }
    const res = await api.inventory.discount.getItemDiscounts({
      search: search,
      page: itemPage.value,
      limit: itemLimit.value,
      sorting: itemSorting.value,
    });
    itemDiscounts.value = await res?.data?.data;
    itemMeta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

getCardDiscounts();
getItemDiscounts();
menuStore.setDiscountType("cart");

watch(
  () => menuStore.getSearchValue,
  () => {
    if (discountType.value == "cart") {
      getCardDiscounts();
      discountType.value = "cart";
    } else if (discountType.value == "item") {
      getItemDiscounts();
      discountType.value = "item";
    }
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getCardDiscounts();
    getItemDiscounts();
  }
);

watch(
  () => menuStore.getIsDeleteRecord,
  () => {
    deleteDiscount();
  }
);
</script>

<template>
  <section>
    <div class="grid" style="margin-top: -17px">
      <VCardText class="d-flex flex-column gap-2">
        <div>
          <VTabs class="v-tabs-pill px-6 py-4" fixed-tabs>
            <VTab
              class="rounded-lg shadow bg-[#f8f7fa] dark:bg-darkmode-bg"
              @click="setType('cart')"
              >Inventory</VTab
            >
            &nbsp;&nbsp;
            <VTab
              class="rounded-lg shadow bg-[#f8f7fa] dark:bg-darkmode-bg"
              @click="setType('item')"
              >Item</VTab
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
          v-model="discountType"
          v-else
        >
          <VWindowItem value="cart">
            <template v-if="cardDiscounts.length">
              <div class="flex flex-col gap-4">
                <div
                  class="px-4 py-2 flex justify-between items-center gap-4 bg-white border rounded"
                  v-for="cardDiscount in cardDiscounts"
                  :key="cardDiscount.id"
                >
                  <div class="flex flex-col justify-between h-full">
                    <h3 class="font-medium text-base">
                      {{ cardDiscount.name }}
                    </h3>
                    <span class="text-slate-400 text-xs">{{
                      cardDiscount.use_mode
                    }}</span>
                  </div>
                  <div class="h-fit my-auto flex items-center gap-4">
                    <div class="text-xs text-slate-400 flex items-center gap-1">
                      <span>
                        {{ cardDiscount.type === "amount" ? "$" : "" }}
                        {{ makeFLoat(cardDiscount.amount, cardDiscount.type) }}
                        {{ cardDiscount.type === "percentage" ? "%" : "" }}
                      </span>
                      <span class="text-primary bg-secondary p-1 rounded">{{
                        capitalize(cardDiscount.group)
                      }}</span>
                    </div>
                    <div class="flex gap-2">
                      <button
                        v-can="'edit-discount'"
                        type="button"
                        class="bg-[#E9F5FE] rounded-sm"
                        @click="openEditPopup(cardDiscount.id)"
                      >
                        <Pen />
                      </button>
                      <button
                        v-can="'delete-discount'"
                        type="button"
                        class="p-1 bg-danger rounded-sm"
                        @click="openDeletePopup(cardDiscount.id)"
                      >
                        <Lucide icon="Trash2" class="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="text-slate-400" v-else>No Records Found!</div>
          </VWindowItem>
          <VWindowItem value="item">
            <template v-if="itemDiscounts.length">
              <div class="flex flex-col gap-4">
                <div
                  class="px-4 py-2 flex justify-between items-center gap-4 bg-white border rounded"
                  v-for="itemDiscount in itemDiscounts"
                  :key="itemDiscount.id"
                >
                  <div class="flex flex-col justify-between h-full">
                    <h3 class="font-medium text-base">
                      {{ itemDiscount.name }}
                    </h3>
                    <span class="text-slate-400 text-xs"
                      >{{ itemDiscount.use_mode }} |
                      <span class="dots cursor-pointer" variant="outlined">
                        {{ itemDiscount?.products_count || 0 }}
                        Items
                        <VTooltip
                          v-if="
                            itemDiscount?.products_count > 0 &&
                            itemDiscount.products.length > 5
                          "
                          open-delay="500"
                          location="top"
                          activator="parent"
                        >
                          <span
                            v-for="(
                              product, index
                            ) in itemDiscount.products.slice(0, 5)"
                            ><span>{{ product.name }}</span>
                            <span
                              v-if="
                                index !=
                                Object.keys(itemDiscount.products.slice(0, 5))
                                  .length -
                                  1
                              "
                              >,
                            </span>
                            <span v-else>, ....</span>
                          </span>
                        </VTooltip>
                        <VTooltip
                          v-else-if="
                            itemDiscount?.products_count > 0 &&
                            itemDiscount.products.length <= 5
                          "
                          open-delay="500"
                          location="top"
                          activator="parent"
                        >
                          <span
                            v-for="(product, index) in itemDiscount.products"
                            ><span>{{ product.name }}</span>
                            <span
                              v-if="
                                index !=
                                Object.keys(itemDiscount.products).length - 1
                              "
                              >,
                            </span></span
                          >
                        </VTooltip>
                      </span>
                    </span>
                  </div>
                  <div class="h-fit my-auto flex items-center gap-4">
                    <div class="text-xs text-slate-400 flex items-center gap-1">
                      <span>
                        {{ itemDiscount.type === "amount" ? "$" : "" }}
                        {{ makeFLoat(itemDiscount.amount, itemDiscount.type) }}
                        {{
                          itemDiscount.type === "percentage" ? "%" : ""
                        }}</span
                      >
                      <span class="text-primary bg-secondary p-1 rounded">{{
                        capitalize(itemDiscount.group)
                      }}</span>
                    </div>
                    <div class="flex gap-2">
                      <button
                        v-can="'edit-discount'"
                        type="button"
                        class="bg-[#E9F5FE] rounded-sm"
                        @click="openEditPopup(itemDiscount.id)"
                      >
                        <Pen />
                      </button>
                      <button
                        v-can="'delete-discount'"
                        type="button"
                        class="p-1 bg-danger rounded-sm"
                        @click="openDeletePopup(itemDiscount.id)"
                      >
                        <Lucide icon="Trash2" class="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div class="text-slate-400" v-else>No Records Found!</div>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </div>
    <div
      class="mt-8 flex m-auto"
      v-if="discountType == 'cart' && cardMeta && cardDiscounts.length"
      :class="{
        'opacity-0': isLoading,
      }"
      style="margin-left: 15px"
    >
      <Pagination
        @pageChanged="
          cardPage = $event;
          getCardDiscounts();
        "
        :meta="cardMeta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
    <div
      class="mt-8 flex m-auto"
      v-if="discountType == 'item' && itemMeta && itemDiscounts.length"
      :class="{
        'opacity-0': isLoading,
      }"
      style="margin-left: 15px"
    >
      <Pagination
        @pageChanged="
          itemPage = $event;
          getItemDiscounts();
        "
        :meta="itemMeta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
  </section>
</template>
<style>
.v-card-text {
  padding: 10px 0px 10px 0px !important;
  margin-top: 15px !important;
}
</style>
