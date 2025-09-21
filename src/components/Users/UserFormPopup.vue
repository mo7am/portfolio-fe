<script setup lang="ts">
import LoadingIcon from "../../base-components/LoadingIcon";
import type { VForm } from "vuetify/components/VForm";
import FileUploader from "@/base-components/FileUploader";
import { Toast } from "../../plugins/swal";
import CustomDropdown from "@/base-components/CustomDropdown";

const props = defineProps<{
  preview: boolean;
  idToEdit: number;
}>();

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "getList"): void;
}

const emit = defineEmits<Emit>();
const api = inject<any>("api");
const isDeletePopupVisible = ref(false);
const isLoading = reactive({
  initial: false,
  submitting: false,
});
const form = reactive<{
  [key: string]: string | boolean;
}>({
  name: "",
  avatar: "",
  email: "",
  status: false,
  role_id: "",
});
const initialData = ref<any>({});
const imageToEdit = ref<any[]>([]);
const preSelectedItem = ref<any>({});

const triggerDeletePopup = (value: boolean) => {
  isDeletePopupVisible.value = value;
};

const setFiles = (file: any) => {
  form.avatar = file;
  removeError("avatar");
};

const resetPopup = () => {
  isDeletePopupVisible.value = false;

  const timer = setTimeout(() => {
    Object.keys(form).forEach((key) => {
      form[key] = key === "status" ? false : "";
    });
  }, 400);

  return () => {
    clearTimeout(timer);
  };
};

const getCreateUser = async () => {
  isLoading.initial = true;
  try {
    const res = await api.admin.users.getCreateUser();
    initialData.value = await res?.data;
    preSelectedItem.value = {};
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const getEditUser = async () => {
  isLoading.initial = true;
  try {
    const res = await api.admin.users.getEditUser(props.idToEdit);
    initialData.value = await res?.data;
    const user = await initialData.value?.user;
    if (user) {
      preSelectedItem.value = {
        id: user.role.id,
        name: user?.role?.name,
      };
      Object.keys(form).forEach((key) => {
        if (key === "status") {
          form.status = user[key] === "active";
        } else if (key === "role_id") {
          form[key] = user?.role?.id;
        } else if (key !== "avatar") {
          form[key] = user[key];
        } else {
          if (user?.avatar)
            imageToEdit.value.push({
              url: user.avatar,
            });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const onSubmit = async () => {
  isLoading.submitting = true;
  try {
    let formToSubmit: any = { ...form };
    if (typeof formToSubmit.avatar === "string") {
      const { avatar, ...withOutImage } = formToSubmit;
      formToSubmit = withOutImage;
    }
    if (props.idToEdit) {
      const res = await api.admin.users.editUser(props.idToEdit, formToSubmit);

      console.log(res);
    } else {
      const res = await api.admin.users.createUser(formToSubmit);
      console.log(res);
    }

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">User ${
        props.idToEdit ? "Updated" : "Added"
      } Successfully!</span>`,
    });
    resetPopup();
    emit("getList");
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

const setStatus = () => {
  form.status = !form.status;
  removeError("status");
};

watch(
  () => props.preview,
  (value) => {
    triggerDeletePopup(value);

    if (value) {
      if (props.idToEdit) {
        getEditUser();
      } else {
        getCreateUser();
      }
    }
  }
);

watch(isDeletePopupVisible, (value) => {
  emit("update:isDialogVisible", value);
  if (!value) {
    resetPopup();
  }
});
</script>

<template>
  <VDialog v-model="isDeletePopupVisible" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="triggerDeletePopup(false)" />

    <VCard>
      <VForm @submit.prevent="onSubmit" class="py-8 px-4 flex flex-col gap-4">
        <h3 class="font-medium text-lg">
          {{ idToEdit ? "Edit" : "Add" }} User
        </h3>
        <div class="flex p-4" v-if="isLoading.initial">
          <LoadingIcon icon="tail-spin" class="w-4 h-4 m-auto" color="black" />
        </div>
        <template v-else>
          <div id="avatar">
            <label
              >Avatar
              <span class="text-xs"
                >(Allowed PNG or JPEG. Max size of 2MB.)</span
              ></label
            >
            <div class="mt-2">
              <FileUploader
                :accepted-types="['png', 'jpg', 'jpeg', 'gif']"
                :setFiles="setFiles"
                :edit-form-files="imageToEdit"
                single
              />
            </div>
          </div>
          <div id="name">
            <AppTextField
              @keyup="removeError('name')"
              type="text"
              v-model="form.name"
              placeholder="Type here..."
              label="Full Name"
              :isRequired="true"
            />
          </div>

          <div id="email">
            <AppTextField
              @keyup="removeError('email')"
              type="email"
              v-model="form.email"
              placeholder="Type here..."
              label="Email"
              :isRequired="true"
            />
          </div>
          <!-- <div id="role_id">
            <AppSelect
              @update:model-value="removeError('role_id')"
              v-model="form.role_id"
              :items="initialData?.roles"
              label="Select Role"
              item-title="name"
              item-value="id"
              form-id="role_id"
              placeholder="Select Role"
              :isRequired="true"
            />
          </div> -->
          <div class="relative" id="role_id">
            <CustomDropdown
              @update:model-value="removeError('role_id')"
              :items="initialData?.roles"
              v-model="form.role_id"
              :preSelectedItem="preSelectedItem"
              label="Select Role"
              placeholder="Select Role"
              item-title="name"
              item-value="id"
              disabled-key="disabled"
              hasSearch
              hasClosed
              :key="preSelectedItem?.id"
              :isRequired="true"
            />
          </div>
          <div class="flex justify-between">
            <div class="flex flex-col" id="delivery">
              <label class="text-base" for="status-switch">{{
                form.status ? "Active" : "Inactive"
              }}</label>
              <span class="text-slate-300 text-xs">
                Allow to disable User without Deleting
              </span>
            </div>
            <div id="status">
              <VSwitch
                @click="setStatus"
                v-model="form.status"
                id="status-switch"
                color="success"
                class="cursor-pointer"
              />
            </div>
          </div>
          <div>
            <VBtn
              style="float: left"
              type="submit"
              block
              color="black"
              class="text-white min-w-[100px] w-fit m-auto"
            >
              <LoadingIcon
                icon="tail-spin"
                class="w-4 h-4 m-auto"
                color="white"
                v-if="isLoading.submitting"
              />
              <span v-else>Save</span>
            </VBtn>
            <div class="demo-space-x">
              <VBtn
                @click="triggerDeletePopup(false)"
                style="
                  float: left;
                  margin-left: 10px;
                  background-color: #efefef !important;
                  color: #999 !important;
                "
              >
                <span>Cancel</span>
              </VBtn>
            </div>
          </div>
        </template>
      </VForm>
    </VCard>
  </VDialog>
</template>
