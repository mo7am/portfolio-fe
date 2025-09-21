<script setup lang="ts">
import type { VForm } from "vuetify/components/VForm";
import { Toast } from "../../../plugins/swal";
import { useInventoryMenu } from "@/stores/inventory-menu";

const refForm = ref<VForm>();

const formData = reactive<any>({
  id: "",
  name: "",
  percentage: "",
  status: true,
  enabled_by_default: false,
});

const initialData = ref<any>({});
const isLoading = reactive({
  initial: false,
  submitting: false,
});
const api = inject<any>("api");
const menuStore = useInventoryMenu();
const submitType = ref("");

const setStatus = () => {
  formData.status = formData.status ? false : true;
  removeError("status");
};

const setEnabledByDefault = () => {
  formData.enabled_by_default = !formData.enabled_by_default;
  removeError("enabled_by_default");
};

const editTax = async (id: number) => {
  isLoading.initial = true;
  try {
    const res = await api.inventory.tax.editTax(id);
    initialData.value = await res?.data;
    const tax = initialData.value?.tax;
    if (tax) {
      formData.id = tax?.id;
      formData.name = tax?.name;
      formData.percentage = tax?.percentage;
      formData.status = tax?.status === "active";
      formData.enabled_by_default = tax?.enabled_by_default;
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
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
    };
    let response = undefined;
    if (menuStore.getIDToEdit) {
      response = await api.inventory.tax.updateTax(
        menuStore.getIDToEdit,
        formToSubmit
      );
      submitType.value = "Updated";
    } else {
      response = await api.inventory.tax.storeTax(formToSubmit);
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
          "Tax " + submitType.value + " successfully"
        }</span>`,
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (key == "id" || key == "name" || key == "percentage") {
      formData[key] = "";
    } else if (key == "status") {
      formData[key] = true;
    } else {
      formData[key] = false;
    }
  });
};

watch(
  () => menuStore.getIDToEdit,
  (value) => {
    if (value) {
      editTax(value);
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
    <div class="grid md:grid-cols-1 gap-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div id="name">
          <AppTextField
            @keyup="removeError('name')"
            v-model="formData.name"
            label="Name"
            form-id="name"
            placeholder="Type Here..."
            :rules="[requiredValidator]"
            :isRequired="true"
          />
        </div>
        <div id="percentage">
          <AppTextField
            @keyup="removeError('percentage')"
            v-model="formData.percentage"
            label="Percentage %"
            form-id="percentage"
            placeholder="00.00%"
            :rules="[
              requiredValidator,
              betweenValidator(formData.percentage, 0, 100),
              decimalValidator(formData.percentage, 2),
            ]"
            :isRequired="true"
          />
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="flex justify-between" style="margin-top: 37px">
          <div class="flex flex-col">
            <label class="text-base" for="status1">Active</label>
          </div>
          <div id="status">
            <VSwitch
              class="cursor-pointer"
              @click="setStatus()"
              v-model="formData.status"
              id="status1"
              color="success"
            />
          </div>
        </div>
        <div class="flex justify-between" style="margin-top: 37px">
          <div class="flex flex-col">
            <label class="text-base" for="enabled_by_default1"
              >Enabled By Default</label
            >
          </div>
          <div id="enabled_by_default">
            <VSwitch
              class="cursor-pointer"
              @click="setEnabledByDefault()"
              v-model="formData.enabled_by_default"
              id="enabled_by_default1"
              color="success"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <div class="flex justify-end mt-4">
        <VBtn type="submit" class="btn btn-primary w-fit px-8">
          {{ isLoading.submitting ? "Loading..." : "Save" }}</VBtn
        >
      </div>
    </div>
  </VForm>
</template>
