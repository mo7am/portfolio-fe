<script setup lang="ts">
import Lucide from "@/base-components/Lucide/Lucide.vue";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import DeletePopup from "@/base-components/DeletePopup";
import { Toast } from "../../plugins/swal";
import RolesList from "@/components/Role/List.vue";
import AdminRolesList from "@/components/AdminRoles/AdminRolesList.vue";

const api = inject<any>("api");
const roles = ref<any[]>([]);
const meta = ref<any>({});
const isLoading = reactive({
  list: false,
  deleting: false,
});

const props = defineProps({
  isMerchant: {
    type: Boolean,
    default: false,
  },
});

const params = reactive({
  search: "",
  page: 1,
  limit: 6,
});
const deletePopup = reactive({
  preview: false,
  id: 0,
});

const getRoles = async () => {
  isLoading.list = true;
  try {
    const res = await api.admin.roles.getRolesList(params);
    roles.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.list = false;
};

const resetDeletePopup = () => {
  deletePopup.id = 0;
  deletePopup.preview = false;
};

const onDeleteClick = (id: number) => {
  deletePopup.id = id;
  deletePopup.preview = true;
};

const deleteRole = async () => {
  isLoading.deleting = true;
  try {
    await api.admin.roles.deleteRole(deletePopup.id);
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Role Deleted Successfully!</span>`,
    });

    resetDeletePopup();
    getRoles();
  } catch (error) {
    console.log(error);
    resetDeletePopup();
  }
  isLoading.deleting = false;
};

const onSearch = useDebounceFn(() => {
  params.page = 1;
  getRoles();
}, 600);

getRoles();
</script>
<template>
  <div>
    <!-- <div
      class="flex flex-wrap px-4 justify-between gap-4"
      v-if="!props.isMerchant"
    >
      <div>
        <AppTextField
          type="text"
          v-model="params.search"
          label="Search"
          placeholder="Type here..."
          class="w-[200px] sm:w-[250px]"
          @keyup="onSearch"
        />
      </div>
      <VBtn primary color="black " class="text-white mt-auto">
        <RouterLink class="flex items-center" :to="{ name: 'admin-roles-add' }">
          <VIcon size="20" icon="tabler-plus" class="mr-1" />
          Add New Role
        </RouterLink>
      </VBtn>
    </div> -->
    <div class="flex p-4" v-if="isLoading.list && !roles.length">
      Loading...
    </div>
    <div v-else>
      <RolesList
        v-if="props.isMerchant"
        :isLoading="isLoading.list"
        :roles="roles"
        @callOnDeleteClick="onDeleteClick"
      />
      <AdminRolesList
        v-else
        :isLoading="isLoading.list"
        :roles="roles"
        @callOnDeleteClick="onDeleteClick"
      />
      <div class="mt-4 flex m-auto" v-if="meta && props.isMerchant">
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
    </div>
    <DeletePopup
      :isAdmin="true"
      :preview="deletePopup.preview"
      itemName="Role"
      :deleteFn="deleteRole"
      :isDeleting="isLoading.deleting"
      v-model:isDialogVisible="deletePopup.preview"
    />
  </div>
</template>
