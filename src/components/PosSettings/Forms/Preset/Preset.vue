<script setup lang="ts">
import LoadingIcon from "@/base-components/LoadingIcon";
import { usePOSSettingsMenu } from "@/stores/pos-settings-menu";
import { Toast } from "@/plugins/swal";

const menuStore = usePOSSettingsMenu();

const api = inject<any>("api");
const isLoading = reactive({
  initial: false,
  submitting: false,
});
const itemToEdit = ref<any>({});
const route = useRoute();
const type = route.fullPath.includes("tips") ? "tips" : "delivery-presets";

const getEditPreset = async (id: number) => {
  isLoading.initial = true;

  try {
    const res = await api.settings.presets.getEditPreset(type, id);
    itemToEdit.value =
      type == "tips" ? res?.data?.tip : res?.data?.deliveryPresets;
  } catch (error) {
    console.log(error);
  }

  isLoading.initial = false;
};

const onSavePreset = async (tip: any) => {
  isLoading.submitting = true;

  try {
    const idToEdit = menuStore.getIDToEdit;
    if (idToEdit) {
      await api.settings.presets.editPreset(type, idToEdit, tip);
    } else {
      await api.settings.presets.createPreset(type, tip);
    }

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Preset ${
        idToEdit ? "Updated" : " Created"
      } Successfully!</span>`,
    });

    menuStore.setIsPopupVisible(false);
    menuStore.setIsGetData();
  } catch (error) {
    console.log(error);
  }

  isLoading.submitting = false;
};

watch(
  () => menuStore.getIDToEdit,
  (value) => {
    if (value) getEditPreset(value);
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="flex" v-if="isLoading.initial">
    <LoadingIcon icon="tail-spin" color="orange" class="w-6 h-6 mx-auto" />
  </div>
  <NumPad
    :amount="'0.00'"
    :item-to-edit="itemToEdit"
    :is-loading="isLoading.submitting"
    @save="onSavePreset"
    :is-refund="false"
    v-else
  />
</template>
