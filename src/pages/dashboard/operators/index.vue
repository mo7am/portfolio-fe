<script setup lang="ts">
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { useLocationMenu } from "@/stores/locations-menu";
import Lucide from "@/base-components/Lucide/Lucide.vue";
import { Toast } from "@/plugins/swal";
import LoadingIcon from "@/base-components/LoadingIcon";
import { useUserStore } from "@/stores/user";

definePage({
  meta: {
    requiresAuth: true,
    layout: "side-menu",
    title: "Operators",
    permission: "view-user",
  },
});

setPageTitle("Operators");

const userStore = useUserStore();
const menuStore = useLocationMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const meta = ref<any>({});
const operators = ref<any[]>([]);
const page = ref(1);
const limit = ref(6);

const deleteOperator = async () => {
  menuStore.setIsDeleting(true);
  try {
    const res = await api.operator.deleteOperator(menuStore.getIDToEdit);
    if (res !== undefined) {
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span class="text-sm">Operator Deleted Successfully!</span>`,
      });
      menuStore.setIsDeletePopupVisible(false);
      if (operators.value.length == 1) {
        page.value--;
      }
      getOperators();
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

const getOperators = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      page.value = 1;
    }
    const res = await api.operator.getOperators({
      search: search,
      page: page.value,
      limit: limit.value,
      merchant_id: userStore.getTenant?.id,
    });
    operators.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

getOperators();

watch(
  () => menuStore.getSearchValue,
  () => {
    getOperators();
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getOperators();
  }
);

watch(
  () => menuStore.getIsDeleteRecord,
  () => {
    deleteOperator();
  }
);
</script>

<template>
  <section>
    <div class="grid">
      <div class="flex" v-if="isLoading">
        <LoadingIcon icon="tail-spin" color="orange" class="w-6 h-6 mx-auto" />
      </div>
      <template v-else-if="operators.length">
        <div class="flex flex-col gap-4">
          <div
            class="px-4 py-2 flex justify-between items-center gap-4 bg-white border rounded"
            v-for="operator in operators"
            :key="operator.id"
          >
            <div class="flex flex-col justify-between h-full">
              <h3 class="font-medium text-base">
                <span style="color: black">{{ operator.name }}</span> |
                <span class="text-black">{{ operator.role?.name }}</span>
              </h3>
              <span class="text-slate-400 text-xs">{{ operator.email }} </span>
              <span class="text-slate-400 text-xs">{{ operator.phone }} </span>
            </div>
            <div class="h-fit my-auto flex items-center gap-4">
              <div class="text-xs text-slate-400 flex items-center gap-1">
                <div
                  v-if="operator.status == 'active'"
                  class="status"
                  style="color: rgb(36 215 24)"
                >
                  {{ operator.status }}
                </div>
                <div v-else style="color: #ea5455">{{ operator.status }}</div>
              </div>
              <div class="flex gap-2">
                <button
                  v-can="'edit-user'"
                  type="button"
                  class="bg-[#E9F5FE] rounded-sm"
                  @click="openEditPopup(operator.id)"
                >
                  <Pen />
                </button>
                <button
                  v-can="'delete-user'"
                  type="button"
                  class="p-1 bg-danger rounded-sm"
                  @click="openDeletePopup(operator.id)"
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
      v-if="meta && operators.length"
      :class="{
        'opacity-0': isLoading,
      }"
    >
      <Pagination
        @pageChanged="
          page = $event;
          getOperators();
        "
        :meta="meta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
  </section>
</template>
