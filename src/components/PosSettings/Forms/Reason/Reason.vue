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
const initialData = ref<any>({});
const form = reactive<{
  reason: string;
}>({
  reason: "",
});

const getInitialData = async (idToEdit?: number) => {
  isLoading.initial = true;
  try {
    let res: any = {};
    if (idToEdit) {
      res = await api.settings.reasons.getEditReason(idToEdit);
    } else {
      res = await api.settings.reasons.getCreateReason();
    }
    initialData.value = res?.data;
    const reason = initialData.value?.reason;

    if (reason) {
      form.reason = reason?.reason || "";
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const onSubmit = async () => {
  isLoading.submitting = true;

  try {
    const idToEdit = menuStore.getIDToEdit;
    let res: any = {};

    if (idToEdit) {
      res = await api.settings.reasons.editReason(idToEdit, form);
    } else {
      res = await api.settings.reasons.createReason(form);
    }

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Reason ${
        idToEdit ? "Updated" : "Created"
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
    getInitialData(value);
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <VForm ref="formRef" @submit.prevent="onSubmit">
    <div class="p-4 flex justify-center items-center" v-if="isLoading.initial">
      <LoadingIcon icon="tail-spin" class="w-6 h-6" color="orange" />
    </div>
    <div class="flex flex-col gap-4 py-4" v-else>
      <div id="reason">
        <AppTextarea
          @keyup="removeError('reason')"
          v-model="form.reason"
          label="Reason"
          placeholder="Reason"
          :isRequired="true"
        />
      </div>
    </div>
    <div class="flex">
      <VBtn type="submit" class="w-[120px] ml-auto" v-if="!isLoading.initial">
        <LoadingIcon
          icon="tail-spin"
          class="w-4 h-4"
          color="white"
          v-if="isLoading.submitting"
        />
        <span v-else>Save</span>
      </VBtn>
    </div>
  </VForm>
</template>
