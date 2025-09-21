<script setup lang="ts">
import type { VForm } from "vuetify/components/VForm";
import Lucide from "../../base-components/Lucide";
import { computed } from "vue";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Toast } from "../../plugins/swal";
import { useLocationMenu } from "@/stores/locations-menu";
import { useUserStore } from "@/stores/user";
import Pagination from "@/base-components/Pagination/Pagination.vue";

const api = inject<any>("api");
const modules = ref<any[]>([]);
const roles = ref<any[]>([]);

const props = defineProps({
  isMerchant: {
    type: Boolean,
    default: true,
  },
});

const isLoading = reactive({
  initial: false,
  submitting: false,
  roleList: false,
});
const menuStore = useLocationMenu();
const userStore = useUserStore();
const selectedPermissions = ref<any>({});
const roleName = ref("");
const refForm = ref<VForm>();
const router = useRouter();
const isOpenRole = ref(false);
const meta = ref<any>({});
const selectedRole = ref<any>(null);
const params = reactive({
  search: "",
  page: 1,
  limit: 6,
});

let oldIdToEdit = 0;
let idToEdit = 0;
let idToClone = 0;
if (!props.isMerchant) {
  idToEdit = (useRoute().params as any)?.id;
  oldIdToEdit = (useRoute().params as any)?.id;
} else {
  idToEdit = menuStore.getIDToEdit;
  oldIdToEdit = menuStore.getIDToEdit;
}

if (!props.isMerchant) {
  idToClone = userStore.getIDToClone;
} else {
  idToClone = menuStore.getIDToClone;
}

if (idToClone != 0) {
  idToEdit = idToClone;
}

const nameValidError = ref(false);

const getCreateRole = async () => {
  isLoading.initial = true;
  try {
    let res = null;
    if (!props.isMerchant) {
      res = await api.admin.roles.getCreateRole();
    } else {
      res = await api.roles.getCreateRole();
    }
    modules.value = await res?.data?.data;
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const getEditRole = async () => {
  isLoading.initial = true;
  try {
    let res = null;
    if (!props.isMerchant) {
      res = await api.admin.roles.getEditRole(idToEdit);
    } else {
      res = await api.roles.getEditRole(idToEdit);
    }
    modules.value = await res?.data?.allPermissions;
    roleName.value = await res?.data?.role?.name;

    (await res?.data?.preSelectedPermissions)?.forEach((permission: any) => {
      selectedPermissions.value[permission] = true;
    });
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const onPermissionStatusChange = (id: number) => {
  if (!selectedPermissions.value[id]) {
    selectedPermissions.value[id] = true;
  } else {
    delete selectedPermissions.value[id];
  }
};

const modulesWhosepermissionsAllSelected = computed(() => {
  return modules.value.reduce((accumulator, module) => {
    if (isPermissionsAllSelected(module) && module.id) {
      accumulator.push(module.id);
    }
    return accumulator;
  }, []);
});

const isPermissionsAllSelected = (module: any) => {
  let numOfSelectedPermissions = 0;

  module.permissions.forEach((permission: any) => {
    if (selectedPermissions.value[permission.id]) {
      numOfSelectedPermissions++;
    }
  });

  return numOfSelectedPermissions === module.permissions.length;
};

const selectAllPermissions = (module: any) => {
  const isAllSelected = !modulesWhosepermissionsAllSelected.value.includes(
    module.id
  );
  module.permissions.forEach((permission: any) => {
    if (!isAllSelected) {
      delete selectedPermissions.value[permission.id];
    } else {
      selectedPermissions.value[permission.id] = true;
    }
  });
};

const onSubmit = async () => {
  if (!(await refForm.value?.validate())?.valid || nameValidError.value) {
    return;
  }
  isLoading.submitting = true;
  try {
    if (idToEdit != 0 && idToEdit != undefined && idToClone == 0) {
      if (!props.isMerchant) {
        await api.admin.roles.editRole(idToEdit, {
          name: roleName.value,
          permissions: Object.keys(selectedPermissions.value),
        });
      } else {
        await api.roles.editRole(idToEdit, {
          name: roleName.value,
          permissions: Object.keys(selectedPermissions.value),
        });
      }
    } else {
      if (!props.isMerchant) {
        await api.admin.roles.createRole({
          name: roleName.value,
          permissions: Object.keys(selectedPermissions.value),
        });
      } else {
        await api.roles.createRole({
          name: roleName.value,
          permissions: Object.keys(selectedPermissions.value),
        });
      }
    }
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Role ${
        idToEdit != 0 && idToEdit != undefined && idToClone == 0
          ? "Updated"
          : "Added"
      } Successfully!</span>`,
    });
    if (!props.isMerchant) {
      router.push({ name: "admin-roles" });
    } else {
      menuStore.setIsPopupVisible(false);
      menuStore.setIsGetData();
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

const checkIsNameValid = async () => {
  try {
    if (!props.isMerchant) {
      await api.admin.roles.checkIsNameValid(
        { name: roleName.value },
        idToEdit
      );
    } else {
      await api.roles.checkIsNameValid({ name: roleName.value }, idToEdit);
    }
    nameValidError.value = false;
  } catch (error) {
    nameValidError.value = true;
    console.log(error);
  }
};

const onRoleClick = async (role: any) => {
  isOpenRole.value = true;
  selectedRole.value = role;
};

const onSave = async () => {
  if (selectedRole.value) {
    modules.value = [];
    roleName.value = "";
    selectedPermissions.value = {};
    idToEdit = selectedRole.value.id;
    getEditRole();
    isOpenRole.value = false;
    selectedRole.value = null;
    if (idToClone == 0) {
      idToEdit = oldIdToEdit;
    }
  } else {
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Select role first!</span>`,
    });
  }
};

const openRoles = async () => {
  isOpenRole.value = true;
  getRoles();
};

const getRoles = async () => {
  isLoading.roleList = true;
  try {
    let res = null;
    if (props.isMerchant) {
      res = await api.roles.getRolesList(params);
    } else {
      res = await api.admin.roles.getRolesList(params);
    }
    roles.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.roleList = false;
};

const onNameChange = useDebounceFn(checkIsNameValid, 800);

if (idToEdit) {
  getEditRole();
} else {
  getCreateRole();
}

const onRolesSearch = useDebounceFn(getRoles, 600);
</script>

<template>
  <VCard class="md:py-8 md:px-5">
    <VCardItem class="text-center">
      <VCardTitle class="text-h3 mb-3" v-if="!props.isMerchant">
        {{
          idToEdit != 0 && idToEdit != undefined && idToClone == 0
            ? "Edit"
            : "Add New"
        }}
        Role
      </VCardTitle>
      <p class="text-base mb-0">Set Role Permissions</p>
    </VCardItem>

    <VCardText class="mt-6">
      <VForm ref="refForm" @submit.prevent="onSubmit">
        <div id="name">
          <AppTextField
            type="text"
            v-model="roleName"
            name="name"
            label="Role Name"
            placeholder="Enter Role Name"
            @keyup="onNameChange"
            :isRequired="true"
          />
        </div>
        <div class="flex justify-between flex-wrap gap-1 md:gap-4">
          <h6 class="text-h4 mt-8 mb-3">
            Role Permissions <span class="required-icon">*</span>
          </h6>
          <span @click="openRoles" class="text-h5 cursor-pointer mt-8 mb-3">
            <VBtn
              class="text-white"
              :color="!props.isMerchant ? 'black' : 'primary'"
            >
              <VIcon icon="tabler-copy" />
              <span>Clone Role</span>
            </VBtn>
          </span>
        </div>
        <div class="p-4" v-if="isLoading.initial">Loading...</div>
        <template v-else>
          <div id="permissions"></div>
          <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
            <VCard
              class="!p-4 shadow-lg"
              v-for="module in modules"
              :key="module.id"
            >
              <div class="flex justify-between flex-wrap gap-1 md:gap-4">
                <h3 class="font-medium">
                  {{ module.name }}
                </h3>

                <button
                  class="flex items-center"
                  type="button"
                  @click="selectAllPermissions(module)"
                >
                  <span
                    class="flex w-4 h-4 rounded-sm mr-2 border shadow-sm"
                    :class="
                      modulesWhosepermissionsAllSelected.includes(module.id)
                        ? !props.isMerchant
                          ? 'bg-black'
                          : 'bg-primary'
                        : 'bg-white'
                    "
                  >
                    <Lucide
                      icon="Check"
                      class="w-4 h-4 m-auto text-white"
                      v-if="
                        modulesWhosepermissionsAllSelected.includes(module.id)
                      "
                    />
                  </span>

                  <span>Select All</span>
                </button>
              </div>
              <div class="flex flex-col gap-1 mt-2">
                <button
                  v-for="permission in module.permissions"
                  :key="permission"
                  class="flex items-center"
                  type="button"
                  @click="onPermissionStatusChange(permission.id)"
                >
                  <span
                    class="flex w-4 h-4 rounded-sm mr-2 border shadow-sm"
                    :class="
                      selectedPermissions[permission.id]
                        ? !props.isMerchant
                          ? 'bg-black'
                          : 'bg-primary'
                        : 'bg-white'
                    "
                  >
                    <Lucide
                      icon="Check"
                      class="w-4 h-4 m-auto text-white"
                      v-if="selectedPermissions[permission.id]"
                    />
                  </span>

                  <span>{{ permission.display_name }}</span>
                </button>
              </div>
            </VCard>
          </div>
        </template>
      </VForm>
    </VCardText>
    <VCardItem class="py-2 mt-auto">
      <template #append>
        <div class="mt-4 flex justify-center">
          <VBtn
            :color="!props.isMerchant ? 'black' : 'primary'"
            class="text-white flex min-w-[92px]"
            @click="onSubmit"
          >
            <LoadingIcon
              icon="tail-spin"
              color="white"
              class="block m-auto w-4 h-4"
              v-if="isLoading.submitting"
            />
            <span v-else>Submit</span>
          </VBtn>
        </div>
      </template>
    </VCardItem>
  </VCard>

  <VDialog v-model="isOpenRole" width="500">
    <DialogCloseBtn
      @click="
        isOpenRole = false;
        selectedRole = null;
      "
    />
    <VCard>
      <div class="p-4 mt-4">
        <div class="flex gap-2">
          <AppTextField
            type="text"
            v-model="params.search"
            placeholder="Search Roles"
            @keyup="onRolesSearch"
          />
        </div>
        <div class="mt-4">
          <div class="flex p-4" v-if="isLoading.roleList && !roles.length">
            <LoadingIcon
              icon="tail-spin"
              class="w-6 h-6 m-auto"
              color="orange"
            />
          </div>
          <div
            v-else-if="roles.length"
            class="flex flex-col gap-1 max-h-[400px] overflow-auto"
            :class="{
              'opacity-70 pointer-events-none':
                isLoading.roleList && roles.length,
            }"
          >
            <div
              v-for="role in roles"
              style="padding-top: 5px; padding-bottom: 10px"
              :class="
                selectedRole && selectedRole.id == role.id
                  ? 'border-b-2'
                  : 'border-b-1'
              "
              class="relative flex justify-between items-center cursor-pointer"
              @click="onRoleClick(role)"
            >
              <p class="font-medium">
                {{ role.name }}
              </p>
              <p class="capitalize">Users: {{ role.users.length }}</p>
            </div>
          </div>
          <div class="py-2 text-slate-400" v-else>No roles found</div>
          <div class="mt-4 flex m-auto" v-if="meta">
            <Pagination
              @pageChanged="
                params.page = $event;
                getRoles();
              "
              :meta="meta"
              class="w-full sm:w-auto sm:mr-auto"
            >
            </Pagination>
          </div>
          <div class="w-full flex">
            <VBtn
              :color="!props.isMerchant ? 'black' : 'primary'"
              type="button"
              class="text-white mt-3 w-[60%] mx-auto"
              @click="onSave"
              v-if="roles.length"
              >Save</VBtn
            >
          </div>
        </div>
      </div>
    </VCard>
  </VDialog>
</template>
<style>
.my-swal {
  z-index: 10000000;
}

.border-b-2 {
  border-bottom: 3px solid black !important;
}
.border-b-1 {
  border-block-end-width: thin !important;
  border-block-end-style: solid !important;
  border-block-end-color: rgba(
    var(--v-border-color),
    var(--v-border-opacity)
  ) !important;
}
</style>
