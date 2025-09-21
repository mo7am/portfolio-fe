<script setup lang="ts">
import LoadingIcon from "@/base-components/LoadingIcon";
import Lucide from "@/base-components/Lucide";
import { usePOSSettingsMenu } from "@/stores/pos-settings-menu";
import { Toast } from "@/plugins/swal";

const props = defineProps<{
  type: string;
}>();

const menuStore = usePOSSettingsMenu();

const api = inject<any>("api");
const isLoading = ref(false);
const presets = ref<any[]>([]);

const getPresetsList = async () => {
  isLoading.value = true;
  try {
    const search = menuStore.getSearchValue;
    const res = await api.settings.presets.getPresetsList(props.type, {
      search,
    });
    presets.value = res?.data?.data;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const deleteTip = async () => {
  menuStore.setIsDeleting(true);
  try {
    await api.settings.presets.deletePreset(props.type, menuStore.getIDToEdit);

    const presetType = props.type === "presets" ? "Tip" : "Delivery";
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span class="text-sm">${presetType} Preset Deleted Successfully!</span>`,
    });

    getPresetsList();
  } catch (error) {
    console.log(error);
  }
  menuStore.setIsDeletePopupVisible(false);
  menuStore.setIsDeleting(false);
};

const openDeletePopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsDeletePopupVisible(true);
};

const editPreset = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsPopupVisible(true);
};

getPresetsList();

watch(() => menuStore.getIsGetData, getPresetsList);

watch(() => menuStore.getSearchValue, getPresetsList);

watch(() => menuStore.getIsDeleteRecord, deleteTip);
</script>

<template>
  <div class="flex p-4" v-if="isLoading && !presets.length">
    <LoadingIcon icon="tail-spin" class="w-8 h-8 mx-auto" color="orange" />
  </div>
  <template v-else>
    <div
      class="flex flex-col gap-4"
      :class="{
        'opacity-70': isLoading,
      }"
      v-if="presets.length"
    >
      <div
        class="rounded px-4 py-3 border-[.5px] border-[#ECECEC] preset-shadow bg-white flex justify-between items-center"
        v-for="preset in presets"
        :key="preset.id"
      >
        <div class="font-medium text-lg">
          {{ preset.type === "amount" ? "$" : "" }}
          {{ makeFLoat(preset.amount, preset.type) }}
          {{ preset.type === "percentage" ? "%" : "" }}
        </div>

        <div class="flex items-center gap-4">
          <IconBtn
            type="button"
            class="flex h-fit py-2 px-3 bg-[#E9F5FE] rounded"
            @click="editPreset(preset.id)"
          >
            <Lucide icon="Edit" class="w-5 h-5 m-auto" />
          </IconBtn>
          <IconBtn
            type="button"
            class="flex h-fit py-2 px-3 bg-danger rounded"
            @click="openDeletePopup(preset.id)"
          >
            <Lucide icon="Trash2" class="w-5 h-5 m-auto text-white" />
          </IconBtn>
        </div>
      </div>
    </div>
    <div class="py-4" v-else>No Records found</div>
  </template>
</template>
<style scoped>
.preset-shadow {
  box-shadow: 4px 6px 10px 0px #00000005;
}
</style>
