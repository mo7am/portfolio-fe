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
    title: "Order Types",
    permission: "view-order-type",
  },
});

const menuStore = useInventoryMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const meta = ref<any>({});
const orderTypes = ref<any[]>([]);
const page = ref(1);
const limit = ref(7);

const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Inventory-Order Types";

const deleteOrderType = async () => {
  menuStore.setIsDeleting(true);
  try {
    const res = await api.inventory.ordertype.deleteOrderType(
      menuStore.getIDToEdit
    );
    if (res !== undefined) {
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span class="text-sm">Order Type Deleted Successfully!</span>`,
      });
      if (orderTypes.value.length == 1) {
        page.value--;
      }
      getOrderTypes();
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

const getOrderTypes = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      page.value = 1;
    }
    const res = await api.inventory.ordertype.getOrderTypes({
      search: search,
      page: page.value,
      limit: limit.value,
    });
    orderTypes.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

getOrderTypes();

watch(
  () => menuStore.getSearchValue,
  () => {
    getOrderTypes();
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getOrderTypes();
  }
);

watch(
  () => menuStore.getIsDeleteRecord,
  () => {
    deleteOrderType();
  }
);
</script>

<template>
  <section>
    <div class="flex p-4" v-if="isLoading">
      <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
    </div>
    <div v-else class="grid max-h-[450px] overflow-auto">
      <template v-if="orderTypes.length">
        <div class="flex flex-col gap-4">
          <div
            class="relative px-4 py-2 flex justify-between items-center gap-4 bg-white border rounded"
            v-for="orderType in orderTypes"
            :key="orderType.id"
          >
            <div class="absolute top-0 left-0">
              <CategoryFlag :color="orderType.color" v-if="orderType?.color" />
            </div>
            <div class="flex flex-col justify-between h-full">
              <!-- <div
                class="color"
                :style="{ 'background-color': orderType.color }"
              ></div> -->
              <h3 class="font-medium text-base">{{ orderType.name }}</h3>
            </div>
            <div class="h-fit my-auto flex items-center gap-4">
              <div class="text-xs text-slate-400 flex items-center gap-1">
                <div class="text-sm text-slate-800" style="margin-top: -1px">
                  {{ orderType.is_default ? "Default" : "" }}
                </div>
                <div
                  v-if="orderType.status == 'active'"
                  class="status"
                  style="color: rgb(36 215 24)"
                >
                  {{ capitalize(orderType.status) }}
                </div>
                <div v-else style="color: #ea5455">{{ orderType.status }}</div>
              </div>
              <div class="flex gap-2">
                <button
                  v-can="'edit-order-type'"
                  type="button"
                  class="bg-[#E9F5FE] rounded-sm"
                  @click="openEditPopup(orderType.id)"
                >
                  <Pen />
                </button>
                <button
                  v-can="'delete-order-type'"
                  type="button"
                  class="p-1 bg-danger rounded-sm"
                  @click="openDeletePopup(orderType.id)"
                >
                  <Lucide icon="Trash2" class="w-4 h-4 text-white" />
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
      v-if="meta && orderTypes.length"
      :class="{
        'opacity-0': isLoading,
      }"
    >
      <Pagination
        @pageChanged="
          page = $event;
          getOrderTypes();
        "
        :meta="meta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
  </section>
</template>
