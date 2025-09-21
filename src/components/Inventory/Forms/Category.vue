<script setup lang="ts">
import ColorPicker from "@/base-components/ColorPicker";
import FileUploader from "@/base-components/FileUploader";
import CustomDropdown from "@/base-components/CustomDropdown";
import { useInventoryMenu } from "@/stores/inventory-menu";
import { Toast } from "../../../plugins/swal";

const staticColors = [
  "#584aff",
  "#ffba08",
  "#54defd",
  "#7b4b94",
  "#d00000",
  "#00bd9d",
];

const api = inject<any>("api");
const formData = reactive<any>({
  name: "",
  color: "",
  image: "",
  is_image_cleared: false,
  parent_id: "",
});
const status = ref(false);
const isLoading = reactive({
  initial: false,
  submitting: false,
});
const initialData = ref<any>({});
const preSelectedParent = ref<any>({});
const menuStore = useInventoryMenu();
const imageToEdit = ref<any[]>([]);
const mainCategories = ref<any>([]);
const submitType = ref("");

const setColor = (color: string) => {
  formData.color = color;
  removeError("color");
};

const setFiles = (file: any) => {
  if (file === "") {
    formData.is_image_cleared = true;
    return;
  } else {
    formData.image = file;
  }
  removeError("image");
};

const getCreateCategory = async () => {
  isLoading.initial = true;
  try {
    formData.color =
      staticColors[Math.floor(Math.random() * staticColors.length)];
    const res = await api.inventory.category.getCreateCategory();
    initialData.value = await res?.data;
    mainCategories.value = res?.data?.mainCategories.map(function (obj: any) {
      return { ...obj, disabled: obj.is_disabled };
    });
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const getEditCategory = async (id: number) => {
  isLoading.initial = true;
  try {
    const res = await api.inventory.category.getEditCategory(id);
    initialData.value = await res?.data;
    mainCategories.value = res?.data?.mainCategories.map(function (obj: any) {
      return { ...obj, disabled: obj.is_disabled, preSelectedItem: { id } };
    });
    const category = res?.data.category;
    if (category) {
      imageToEdit.value = [];
      if (category?.parent?.id) {
        preSelectedParent.value = {
          id: category.parent_id,
          name: category?.parent?.name,
        };
      }
      formData.name = category?.name;
      formData.color = category?.color;
      if (category?.image) {
        formData.image = category.image;
        imageToEdit.value.push({
          url: category.image,
        });
      }
      formData.parent_id = category?.parent_id;
      status.value = category?.status === "active";
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const onSubmit = async () => {
  isLoading.submitting = true;
  try {
    let formToSubmit = {
      ...formData,
      status: status.value ? "active" : "inactive",
      is_image_cleared: formData.is_image_cleared ? "1" : "0",
    };
    let response = undefined;
    if (menuStore.getIDToEdit) {
      if (formToSubmit.image && typeof formToSubmit.image === "string") {
        const { image, ...withOutImage } = formToSubmit;
        formToSubmit = withOutImage;
      }
      response = await api.inventory.category.editCategory(
        menuStore.getIDToEdit,
        formToSubmit
      );
      submitType.value = "Updated";
    } else {
      response = await api.inventory.category.createCategory(formToSubmit);
      submitType.value = "Created";
    }
    if (response !== undefined) {
      menuStore.setIsPopupVisible(false);
      menuStore.setIsGetData();
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span style="font-size:14px">${
          "Category " + submitType.value + " successfully"
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
      getEditCategory(value);
    } else {
      getCreateCategory();
    }
  },
  {
    immediate: true,
  }
);

const onSwitchClick = () => {
  status.value = !status.value;
};
</script>

<template>
  <div class="mt-4" v-if="isLoading.initial">Loading...</div>
  <VForm @submit.prevent="onSubmit" class="flex flex-col gap-4 mt-4" v-else>
    <div class="flex justify-between">
      <div class="flex flex-col">
        <label class="text-base" for="status">Active</label>
        <span class="text-slate-300 text-xs">
          Active: Control whether the category is displayed or hidden on the
          catalog screen.
        </span>
      </div>
      <div>
        <VSwitch
          v-model="status"
          id="status"
          color="success"
          @click="onSwitchClick"
          class="cursor-pointer"
        />
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <div id="name">
        <AppTextField
          @keyup="removeError('name')"
          v-model="formData.name"
          label="Name"
          placeholder="Type Here..."
          :rules="[requiredValidator]"
          :isRequired="true"
        />
      </div>
      <div class="relative" id="parent_id">
        <CustomDropdown
          :items="mainCategories"
          v-model="formData.parent_id"
          :preSelectedItem="preSelectedParent"
          label="Parent Category"
          placeholder="Select Category"
          item-title="name"
          item-value="id"
          disabled-key="disabled"
          isWithSubArray
          hasSearch
          hasClosed
          :key="preSelectedParent?.id"
        />
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex justify-between gap-4">
          <div class="flex flex-col">
            <label class="text-base" for="color">Pick Color</label>
            <div class="flex gap-2 items-center">
              <span class="text-slate-300 text-xs">
                Color for display in UI
              </span>
              <span
                class="w-8 h-4 text-[10px] text-center rounded-sm border-slate-100 border"
                :style="{
                  backgroundColor: formData.color,
                }"
                >{{ !formData.color ? "N/A" : "" }}</span
              >
            </div>
          </div>
          <div id="color">
            <ColorPicker @setColor="setColor" />
          </div>
        </div>
        <div class="flex gap-2">
          <button
            class="w-8 h-8 rounded-full cursor-pointer hover:scale-[1.1] transition"
            v-for="color in staticColors"
            :key="color"
            :style="{
              backgroundColor: color,
            }"
            type="button"
            @click="setColor(color)"
          ></button>
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
            :editFormFiles="imageToEdit"
            single
          />
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <VBtn type="submit" class="w-fit px-10">{{
        isLoading.submitting ? "Loading..." : "Save"
      }}</VBtn>
    </div>
  </VForm>
</template>
