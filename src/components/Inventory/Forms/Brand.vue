<script setup lang="ts">
import FileUploader from "@/base-components/FileUploader";
import { useInventoryMenu } from "@/stores/inventory-menu";
import { Toast } from "../../../plugins/swal";
import { useDebounceFn } from "@vueuse/core";
import type { VForm } from "vuetify/components/VForm";

const refForm = ref<VForm>();
const emit = defineEmits(["getData"]);
const api = inject<any>("api");
const formData = reactive<any>({
  name: "",
  status: true,
  logo: "",
  is_image_cleared: false,
});
const isLoading = reactive({
  initial: false,
  submitting: false,
});
const submitType = ref("");
const initialData = ref<any>({});
const menuStore = useInventoryMenu();
const logoToEdit = ref<any[]>([]);

const setFiles = (file: any) => {
  if (file === "") {
    formData.is_image_cleared = true;
    return;
  } else {
    formData.logo = file;
  }
  removeError("image");
};

const getEditBrand = async (id: number) => {
  isLoading.initial = true;
  try {
    const res = await api.inventory.brand.editBrand(id);
    initialData.value = await res?.data;
    const brand = initialData.value?.brand;
    if (brand) {
      formData.name = brand?.name;
      if (brand?.logo) {
        formData.logo = brand.logo;
        logoToEdit.value.push({
          url: brand.logo,
        });
      }
      formData.status = brand?.status === "active";
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const resetForm = () => {
  formData.name = "";
  formData.status = true;
  formData.logo = "";
  formData.is_image_cleared = false;
};

const checkUniqueBrandName = async () => {
  try {
    await api.inventory.brand.checkUniqueBrandName(menuStore.getIDToEdit, {
      name: formData.name,
    });
  } catch (error) {
    console.log(error);
  }
};

const check = useDebounceFn(() => {
  checkUniqueBrandName();
}, 800);

function checkUniqueName() {
  check();
  removeError("name");
}

const setStatus = () => {
  formData.status = formData.status ? false : true;
  removeError("status");
};

const onSubmit = async () => {
  if (!(await refForm.value?.validate())?.valid) {
    return;
  }
  isLoading.submitting = true;
  try {
    let formToSubmit = {
      ...formData,
      status: formData.status ? "active" : "inactive",
      is_image_cleared: formData.is_image_cleared ? "1" : "0",
    };
    let response = undefined;
    if (menuStore.getIDToEdit) {
      if (formToSubmit.logo && typeof formToSubmit.logo === "string") {
        const { logo, ...withOutLogo } = formToSubmit;
        formToSubmit = withOutLogo;
      }
      response = await api.inventory.brand.updateBrand(
        menuStore.getIDToEdit,
        formToSubmit
      );
      submitType.value = "Updated";
    } else {
      response = await api.inventory.brand.storeBrand(formToSubmit);
      submitType.value = "Created";
    }
    if (response !== undefined) {
      menuStore.setIsPopupVisible(false);
      menuStore.setIsGetData();
      resetForm();
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span style="font-size:14px">${
          "Brand " + submitType.value + " successfully"
        }</span>`,
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

watch(
  () => menuStore.getIDToEdit,
  (value) => {
    if (value) {
      getEditBrand(value);
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="mt-4" v-if="isLoading.initial">Loading...</div>
  <VForm
    ref="refForm"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4 mt-4"
    v-else
  >
    <div class="grid md:grid-cols-2 gap-4">
      <div id="name">
        <AppTextField
          v-model="formData.name"
          label="Name"
          placeholder="Type Here..."
          @keyup="checkUniqueName"
          :rules="[requiredValidator]"
          :isRequired="true"
        />
      </div>
      <div class="flex justify-between" style="margin-top: 37px">
        <div class="flex flex-col">
          <label class="text-base" for="status">Active</label>
        </div>
        <div id="status">
          <VSwitch
            @click="setStatus()"
            v-model="formData.status"
            id="status"
            color="success"
            class="cursor-pointer"
          />
        </div>
      </div>
    </div>
    <div id="image">
      <label
        >Image
        <span class="text-xs"
          >(Allowed PNG or JPEG. Max size of 2MB.)</span
        ></label
      >
      <div class="mt-2">
        <FileUploader
          :accepted-types="['png', 'jpg', 'jpeg', 'gif']"
          :setFiles="setFiles"
          :edit-form-files="logoToEdit"
          single
        />
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <VBtn type="submit" class="w-fit px-8">{{
        isLoading.submitting ? "Loading..." : "Save"
      }}</VBtn>
    </div>
  </VForm>
</template>
