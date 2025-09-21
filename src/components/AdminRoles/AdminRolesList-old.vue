<script setup lang="ts">
import Lucide from "@/base-components/Lucide/Lucide.vue";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import DeletePopup from "@/base-components/DeletePopup";
import { Toast } from "../../plugins/swal";

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
    if (props.isMerchant) {
      await api.roles.deleteRole(deletePopup.id);
    } else {
      await api.admin.roles.deleteRole(deletePopup.id);
    }

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
  }
  isLoading.deleting = false;
};

const getUserChars = (name: string) => {
  const names = name.split(" ");

  return names.length > 1 ? names[0][0] + " " + names[1][0] : names[0][0];
};

const onSearch = useDebounceFn(() => {
  params.page = 1;
  getRoles();
}, 600);

getRoles();
</script>
<template>
  <div>
    <div class="flex flex-wrap px-4 justify-between gap-4">
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
    </div>
    <div class="flex p-4" v-if="isLoading.list && !roles.length">
      Loading...
    </div>
    <div v-else>
      <div
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
        :class="{
          'opacity-70': isLoading.list,
        }"
      >
        <div
          class="p-4 flex flex-col gap-4 rounded bg-white shadow-lg"
          v-for="role in roles"
          :key="role.id"
        >
          <div class="flex items-center gap-4" v-if="role?.users?.length">
            <p>Total {{ role.users.length }} Users</p>
            <div class="flex">
              <div class="v-avatar-group">
                <template v-for="(user, index) in role?.users" :key="user">
                  <VAvatar
                    color="primary"
                    size="36"
                    class="uppercase cursor-pointer mr-2"
                    :image="user?.avatar ? user?.avatar : undefined"
                    v-if="index <= 3"
                  >
                    {{ getUserChars(user?.name) }}
                  </VAvatar>
                </template>
                <VAvatar v-if="role.users.length > 4" color="#4A5072">
                  <span> +{{ role.users.length - 4 }} </span>
                </VAvatar>
              </div>
            </div>
          </div>
          <div v-else>No Users available!</div>
          <div>
            <h1 class="text-lg font-medium">{{ role.name }}</h1>
            <div class="flex gap-2">
              <RouterLink
                class="flex items-center gap-1 mt-1"
                :to="`/admin/roles/edit/${role.id}`"
              >
                <Lucide icon="Edit" class="w-4 h-4" />
                Edit
              </RouterLink>

              <button
                class="flex items-center gap-1 mt-1 text-danger"
                type="button"
                @click="onDeleteClick(role.id)"
              >
                <Lucide icon="Trash2" class="w-4 h-4 text-danger" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
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
