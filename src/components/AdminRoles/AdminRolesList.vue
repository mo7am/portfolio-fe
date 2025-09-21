<script setup lang="ts">
import Lucide from "@/base-components/Lucide/Lucide.vue";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import DeletePopup from "@/base-components/DeletePopup";
import { Toast } from "../../plugins/swal";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import LoadingIcon from "@/base-components/LoadingIcon";
import { useUserStore } from "@/stores/user";

const api = inject<any>("api");
const roles = ref<any[]>([]);
const meta = ref<any>({});
const isLoading = reactive({
  list: false,
  deleting: false,
});
const userStore = useUserStore();

const headers = [
  { title: "Name", key: "name", sortable: true },
  { title: "Users", key: "users", sortable: true },
  { title: "Total Users", key: "total_users", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

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

const openClone = (id: number) => {
  userStore.setIDToClone(id);
};

getRoles();
</script>
<template>
  <section>
    <div class="p-4 flex" v-if="isLoading.list && !roles.length">
      <LoadingIcon icon="tail-spin" class="w-6 h-6 m-auto" color="black" />
    </div>
    <div class="flex flex-col gap-4" v-else>
      <div class="flex flex-wrap gap-4 justify-between">
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
        <VBtn
          primary
          color="black "
          class="text-white mt-auto"
          v-can="'create-roles'"
        >
          <RouterLink
            class="flex items-center"
            :to="{ name: 'admin-roles-add' }"
          >
            <VIcon size="20" icon="tabler-plus" class="mr-1" />
            Add New Role
          </RouterLink>
        </VBtn>
      </div>
      <div>
        <VDataTableServer
          :items="roles"
          :itemsLength="roles.length"
          :headers="headers"
          class="text-no-wrap"
          :class="{
            'opacity-70': isLoading.list && roles.length,
          }"
        >
          <!-- Name -->
          <template #item.users="{ item }">
            <div class="flex" v-if="item?.users?.length">
              <div class="v-avatar-group">
                <template v-for="(user, index) in item?.users" :key="user">
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
                <VAvatar v-if="item.users.length > 4" color="#4A5072">
                  <span> +{{ item.users.length - 4 }} </span>
                </VAvatar>
              </div>
            </div>
            <div v-else>No Users available!</div>
          </template>

          <!-- Industry -->
          <template #item.name="{ item }">
            <div>{{ item?.name || "N/A" }}</div>
          </template>

          <!-- Status -->
          <template #item.total_users="{ item }">
            <div class="flex items-center gap-4" v-if="item?.users?.length">
              <p>{{ item.users.length }} Users</p>
            </div>
            <div v-else>0 Users</div>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <RouterLink
              v-can="'edit-roles'"
              @click="openClone(0)"
              :to="`/admin/roles/edit/${item.id}`"
            >
              <VIcon icon="tabler-edit" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>Edit Role</span>
              </VTooltip>
            </RouterLink>
            <IconBtn v-can="'delete-roles'" @click="onDeleteClick(item.id)">
              <VIcon icon="tabler-trash" class="text-danger" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>Delete Role</span>
              </VTooltip>
            </IconBtn>

            <RouterLink @click="openClone(item.id)" :to="`/admin/roles/add`">
              <VIcon icon="tabler-copy" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>Clone Role</span>
              </VTooltip>
            </RouterLink>
          </template>

          <template #bottom></template>
        </VDataTableServer>
        <div class="mt-4 flex" v-if="meta">
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
    </div>
    <DeletePopup
      :isAdmin="true"
      :preview="deletePopup.preview"
      itemName="Role"
      :deleteFn="deleteRole"
      :isDeleting="isLoading.deleting"
      v-model:isDialogVisible="deletePopup.preview"
    />
  </section>
</template>
