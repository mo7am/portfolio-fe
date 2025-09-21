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
    title: "Taxes",
    permission: "view-tax",
  },
});

const menuStore = useInventoryMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const meta = ref<any>({});
const taxes = ref<any[]>([]);
const page = ref(1);
const limit = ref(6);

const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Inventory-Taxes";

const deleteTax = async () => {
  menuStore.setIsDeleting(true);
  try {
    const res = await api.inventory.tax.deleteTax(menuStore.getIDToEdit);
    if (res !== undefined) {
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span class="text-sm">Tax Deleted Successfully!</span>`,
      });
      menuStore.setIsDeletePopupVisible(false);
      if (taxes.value.length == 1) {
        page.value--;
      }
      getTaxes();
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

const getTaxes = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      page.value = 1;
    }
    const res = await api.inventory.tax.getTaxes({
      search: search,
      page: page.value,
      limit: limit.value,
    });
    taxes.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

getTaxes();

watch(
  () => menuStore.getSearchValue,
  () => {
    getTaxes();
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getTaxes();
  }
);

watch(
  () => menuStore.getIsDeleteRecord,
  () => {
    deleteTax();
  }
);
</script>

<template>
  <section>
    <div class="flex p-4" v-if="isLoading">
      <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
    </div>
    <div v-else class="grid">
      <template v-if="taxes.length">
        <div class="flex flex-col gap-4">
          <div
            class="px-4 py-2 flex justify-between items-center gap-4 bg-white border rounded"
            v-for="tax in taxes"
            :key="tax.id"
          >
            <div class="flex flex-col justify-between h-full">
              <h3 class="font-medium text-base">{{ tax.name }}</h3>
              <span class="text-slate-400 text-xs"
                >{{ tax.percentage }} % |
                <span class="dots cursor-pointer" variant="outlined">
                  {{ tax?.products_count || 0 }} Items
                  <VTooltip
                    v-if="tax?.products_count > 0 && tax.products.length > 5"
                    open-delay="500"
                    location="top"
                    activator="parent"
                  >
                    <span v-for="(product, index) in tax.products.slice(0, 5)"
                      ><span>{{ product.name }}</span>
                      <span
                        v-if="
                          index !=
                          Object.keys(tax.products.slice(0, 5)).length - 1
                        "
                        >,
                      </span>
                      <span v-else>, ... </span>
                    </span>
                  </VTooltip>
                  <VTooltip
                    v-else-if="
                      tax?.products_count > 0 && tax.products.length <= 5
                    "
                    open-delay="500"
                    location="top"
                    activator="parent"
                  >
                    <span v-for="(product, index) in tax.products"
                      ><span>{{ product.name }}</span>
                      <span v-if="index != Object.keys(tax.products).length - 1"
                        >,
                      </span></span
                    >
                  </VTooltip>
                </span>
              </span>
            </div>
            <div class="h-fit my-auto flex items-center gap-4">
              <div class="text-xs text-slate-400 flex items-center gap-1">
                <div
                  v-if="tax.status == 'active'"
                  class="status"
                  style="color: rgb(36 215 24)"
                >
                  {{ capitalize(tax.status) }}
                </div>
                <div v-else style="color: #ea5455">{{ tax.status }}</div>
              </div>
              <div class="flex gap-2">
                <button
                  v-can="'edit-tax'"
                  type="button"
                  class="bg-[#E9F5FE] rounded-sm"
                  @click="openEditPopup(tax.id)"
                >
                  <Pen />
                </button>
                <button
                  v-can="'delete-tax'"
                  type="button"
                  class="p-1 bg-danger rounded-sm"
                  @click="openDeletePopup(tax.id)"
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
      v-if="meta && taxes.length"
      :class="{
        'opacity-0': isLoading,
      }"
    >
      <Pagination
        @pageChanged="
          page = $event;
          getTaxes();
        "
        :meta="meta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
  </section>
</template>
