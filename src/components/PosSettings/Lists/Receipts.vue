<script setup lang="ts">
import LoadingIcon from "@/base-components/LoadingIcon";
import Lucide from "@/base-components/Lucide";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { usePOSSettingsMenu } from "@/stores/pos-settings-menu";
import { Toast } from "@/plugins/swal";

const menuStore = usePOSSettingsMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const receipts = ref<any[]>([]);
const meta = ref({});
const params = reactive({
  limit: 5,
  page: 1,
});

const getReceiptsList = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      params.page = 1;
    }
    const res = await api.settings.receipts.getReceiptsList({
      ...params,
      search,
    });
    receipts.value = res?.data?.data;
    meta.value = res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const editReceipt = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsPopupVisible(true);
};

const openDeletePopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsDeletePopupVisible(true);
};

const deleteReceipt = async () => {
  menuStore.setIsDeleting(true);
  try {
    await api.settings.receipts.deleteReceipt(menuStore.getIDToEdit);
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span class="text-sm">Receipt Deleted Successfully!</span>`,
    });
    if (receipts.value.length === 1) {
      params.page--;
    }
    getReceiptsList();
  } catch (error: any) {
    if (error.response.status == 400) {
      Toast.fire({
        icon: "error",
        padding: "10px",
        background: "#fff",
        html: `<span class="text-sm">${error.response.data.message}!</span>`,
      });
    }
    console.log(error);
  }
  menuStore.setIsDeletePopupVisible(false);
  menuStore.setIsDeleting(false);
};

getReceiptsList();

watch(() => menuStore.getIsGetData, getReceiptsList);

watch(() => menuStore.getSearchValue, getReceiptsList);

watch(() => menuStore.getIsDeleteRecord, deleteReceipt);
</script>

<template>
  <section>
    <div class="flex p-4" v-if="isLoading && !receipts.length">
      <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
    </div>
    <div
      class="flex flex-col gap-4 p-4 bg-white shadow-sm rounded"
      :class="{
        'opacity-70': isLoading,
      }"
      v-else
    >
      <template v-if="receipts.length">
        <div
          class="rounded px-4 py-3 border-[.5px] border-[#ECECEC] receipt-shadow bg-white flex justify-between items-center"
          v-for="receipt in receipts"
          :key="receipt.id"
        >
          <div class="capitalize">
            <h4 class="font-medium text-base">{{ receipt?.name }}</h4>
            <p class="text-sm">{{ receipt?.type }}</p>
          </div>

          <div class="flex gap-4 items-center">
            <div
              class="font-medium capitalize"
              :class="
                receipt.status === 'active' ? 'text-green-500' : 'text-danger'
              "
            >
              {{ receipt.status }}
            </div>
            <IconBtn
              v-can="'edit-receipt'"
              type="button"
              class="flex h-fit py-2 px-3 bg-[#E9F5FE] rounded"
              @click="editReceipt(receipt.id)"
            >
              <Lucide icon="Edit" class="w-5 h-5 m-auto" />
            </IconBtn>
            <IconBtn
              v-can="'delete-receipt'"
              type="button"
              class="flex h-fit py-2 px-3 bg-danger rounded"
              @click="openDeletePopup(receipt.id)"
            >
              <Lucide icon="Trash2" class="w-5 h-5 m-auto text-white" />
            </IconBtn>
          </div>
        </div>
      </template>
      <div class="py-4" v-else>No Records found!</div>
      <div class="mt-4 flex" v-if="meta">
        <Pagination
          @pageChanged="
            params.page = $event;
            getReceiptsList();
          "
          :meta="meta"
          class="w-full sm:w-auto sm:mr-auto"
        >
        </Pagination>
      </div>
    </div>
  </section>
</template>
<style scoped>
.receipt-shadow {
  box-shadow: 4px 6px 10px 0px #00000005;
}
</style>
