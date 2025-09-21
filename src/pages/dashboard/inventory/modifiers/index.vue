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
    title: "Modifiers",
    permission: "view-modifier",
  },
});

const menuStore = useInventoryMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const meta = ref<any>({});
const modifiers = ref<any[]>([]);
const page = ref(1);

const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Inventory-Modifiers";

const getModifiers = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      page.value = 1;
    }
    const res = await api.inventory.modifier.getModifiers({
      search: search,
      page: page.value,
      limit: 6,
    });

    modifiers.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const deleteModifier = async () => {
  menuStore.setIsDeleting(true);
  try {
    const res = await api.inventory.modifier.deleteModifier(
      menuStore.getIDToEdit
    );
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span class="text-sm">Modifier Deleted Successfully!</span>`,
    });

    getModifiers();
  } catch (error) {
    console.log(error);
  }

  menuStore.setIsDeleting(false);
  menuStore.setIsDeletePopupVisible(false);
};

const openEditPopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsPopupVisible(true);
};

const openDeletePopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsDeletePopupVisible(true);
};

getModifiers();

watch(
  () => menuStore.getSearchValue,
  () => {
    getModifiers();
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getModifiers();
  }
);

watch(
  () => menuStore.getIsDeleteRecord,
  () => {
    deleteModifier();
  }
);
</script>

<template>
  <section>
    <div class="flex p-4" v-if="isLoading">
      <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
    </div>
    <div v-else class="grid gap-4 max-h-[450px] overflow-auto">
      <template v-if="modifiers.length">
        <div class="flex flex-col gap-4">
          <div
            class="px-4 py-2 flex justify-between items-center gap-4 bg-white border rounded"
            v-for="modifier in modifiers"
            :key="modifier.id"
          >
            <div class="flex flex-col justify-between h-full">
              <h3 class="font-medium text-base">{{ modifier.name }}</h3>
              <span class="text-slate-400 text-xs"
                >{{ modifier?.options?.length }} Options |
                <span class="dots cursor-pointer" variant="outlined">
                  {{ modifier?.products_count || 0 }} Items
                  <VTooltip
                    v-if="
                      modifier?.products_count > 0 &&
                      modifier.products.length > 5
                    "
                    open-delay="500"
                    location="top"
                    activator="parent"
                  >
                    <span
                      v-for="(product, index) in modifier.products.slice(0, 5)"
                      ><span>{{ product.name }}</span>
                      <span
                        v-if="
                          index !=
                          Object.keys(modifier.products.slice(0, 5)).length - 1
                        "
                        >,
                      </span>
                      <span v-else>, ... </span>
                    </span>
                  </VTooltip>
                  <VTooltip
                    v-else-if="
                      modifier?.products_count > 0 &&
                      modifier.products.length <= 5
                    "
                    open-delay="500"
                    location="top"
                    activator="parent"
                  >
                    <span v-for="(product, index) in modifier.products"
                      ><span>{{ product.name }}</span>
                      <span
                        v-if="
                          index != Object.keys(modifier.products).length - 1
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
                <span v-if="modifier?.forced">Forced</span>
                <span
                  v-if="
                    modifier?.forced &&
                    (modifier?.multiselect || modifier?.countable)
                  "
                  >-</span
                >
                <span v-if="modifier?.multiselect"> Multi-Select</span>
                <span v-if="modifier?.multiselect && modifier?.countable"
                  >-</span
                >
                <span v-if="modifier?.countable">Countable Options</span>

                <span class="text-primary bg-secondary p-1 rounded">{{
                  capitalize(modifier.group)
                }}</span>
              </div>
              <div class="flex gap-2">
                <button
                  v-can="'edit-modifier'"
                  type="button"
                  class="bg-[#E9F5FE] rounded-sm"
                  @click="openEditPopup(modifier.id)"
                >
                  <Pen />
                </button>
                <button
                  v-can="'delete-modifier'"
                  type="button"
                  class="p-1 bg-danger rounded-sm"
                  @click="openDeletePopup(modifier.id)"
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
      v-if="meta && modifiers.length"
      :class="{
        'opacity-0': isLoading,
      }"
    >
      <Pagination
        @pageChanged="
          page = $event;
          getModifiers();
        "
        :meta="meta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
  </section>
</template>
