<script setup lang="ts">
import LoadingIcon from "@/base-components/LoadingIcon";
import Lucide from "@/base-components/Lucide";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { usePOSSettingsMenu } from "@/stores/pos-settings-menu";
import { Toast } from "@/plugins/swal";

const menuStore = usePOSSettingsMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const reasons = ref<any[]>([]);
const meta = ref({});
const params = reactive({
  limit: 6,
  page: 1,
});

const getReasonsList = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      params.page = 1;
    }
    const res = await api.settings.reasons.getReasonsList({
      ...params,
      search,
    });
    reasons.value = res?.data?.data;
    meta.value = res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const editReason = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsPopupVisible(true);
};

const openDeletePopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsDeletePopupVisible(true);
};

const deleteReason = async () => {
  menuStore.setIsDeleting(true);
  try {
    await api.settings.reasons.deleteReason(menuStore.getIDToEdit);
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span class="text-sm">Reason Deleted Successfully!</span>`,
    });
    if (reasons.value.length === 1) {
      params.page--;
    }
    getReasonsList();
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

getReasonsList();

watch(() => menuStore.getIsGetData, getReasonsList);

watch(() => menuStore.getSearchValue, getReasonsList);

watch(() => menuStore.getIsDeleteRecord, deleteReason);
</script>

<template>
  <section>
    <div class="flex p-4" v-if="isLoading && !reasons.length">
      <LoadingIcon icon="tail-spin" color="orange" class="w-8 h-8 m-auto" />
    </div>
    <div
      class="flex flex-col gap-4 p-4 bg-white shadow-sm rounded"
      :class="{
        'opacity-70': isLoading,
      }"
      v-else
    >
      <template v-if="reasons.length">
        <div
          class="rounded px-4 py-3 border-[.5px] border-[#ECECEC] receipt-shadow bg-white flex justify-between items-center"
          v-for="reason in reasons"
          :key="reason.id"
        >
          <div class="capitalize">
            <h4 class="font-medium text-base">{{ reason?.reason }}</h4>
          </div>

          <div class="flex gap-4 items-center">
            <IconBtn
              v-can="'edit-reason'"
              type="button"
              class="flex h-fit py-2 px-3 bg-[#E9F5FE] rounded"
              @click="editReason(reason.id)"
            >
              <Lucide icon="Edit" class="w-5 h-5 m-auto" />
            </IconBtn>
            <IconBtn
              v-can="'delete-reason'"
              type="button"
              class="flex h-fit py-2 px-3 bg-danger rounded"
              @click="openDeletePopup(reason.id)"
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
            getReasonsList();
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
