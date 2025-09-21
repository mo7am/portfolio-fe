<script setup lang="ts">
import DeletePopup from "@/base-components/DeletePopup";
import LoadingIcon from "@/base-components/LoadingIcon";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { Toast } from "../../plugins/swal";
import { useUserStore } from "@/stores/user";
import Lucide from "@/base-components/Lucide";

const isAdmin = useUserStore().getIsAdmin;

const props = defineProps<{
  isInRoles?: boolean;
}>();

const emit = defineEmits(["deleteUser"]);
const api = inject<any>("api");
const users = ref<any[]>([]);
const meta = ref<any>({});
const isLoading = reactive({
  list: false,
  deleting: false,
  changingStatus: false,
});
const params = reactive({
  search: "",
  page: 1,
  limit: props.isInRoles ? 5 : 10,
});
const deletePopup = reactive({
  preview: false,
  id: 0,
});
const statusPopup = reactive<any>({
  preview: false,
  item: null,
  status: "",
});
const userPopup = reactive({
  preview: false,
  id: 0,
});

const headers = [
  { title: "Name", key: "name", sortable: false },
  { title: "Role", key: "role", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Actions", key: "actions", sortable: false },
];

const resolveUserStatusVariant = (stat: string) => {
  const statLowerCase = stat.toLowerCase();
  if (statLowerCase === "pending") return "warning";
  if (statLowerCase === "active") return "success";
  if (statLowerCase === "inactive") return "secondary";

  return "primary";
};

const getUsers = async () => {
  isLoading.list = true;
  try {
    const res = await api.admin.users.getUsersList(params);
    users.value = await res?.data?.data;
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

const resetStatusPopup = () => {
  statusPopup.preview = false;
  statusPopup.status = "";

  const timer = setTimeout(() => {
    statusPopup.item = null;
  }, 400);

  return () => {
    clearTimeout(timer);
  };
};

const changeStatus = async () => {
  isLoading.changingStatus = true;
  try {
    const status = statusPopup.status === "active" ? "inactive" : "active";
    await api.admin.users.changeStatus(statusPopup.item.id, status);

    const notificationText =
      statusPopup.status === "active" ? "De-Activated" : "Activated";
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">User ${notificationText} Successfully!</span>`,
    });

    resetStatusPopup();
    getUsers();
  } catch (error) {
    console.log(error);
  }
  isLoading.changingStatus = false;
};

const deleteUser = async () => {
  isLoading.deleting = true;
  try {
    await api.admin.users.deleteUser(deletePopup.id);

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">User Deleted Successfully!</span>`,
    });

    resetDeletePopup();
    getUsers();
  } catch (error) {
    console.log(error);
  }
  isLoading.deleting = false;
};

const onDeleteClick = (id: number) => {
  deletePopup.id = id;
  deletePopup.preview = true;
};

const onAddClick = () => {
  userPopup.id = 0;
  userPopup.preview = true;
};

const onEditClick = (id: number) => {
  userPopup.id = id;
  userPopup.preview = true;
};

const onChangeStatusClick = (item: any) => {
  statusPopup.item = item;
  statusPopup.preview = true;
  statusPopup.status = item.status;
};

const onSearch = useDebounceFn(() => {
  params.page = 1;
  getUsers();
}, 600);

getUsers();
</script>

<template>
  <section>
    <div class="p-4 flex" v-if="isLoading.list && !users.length">
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
          v-can="'create-admins'"
          primary
          color="black"
          class="text-white mt-auto"
          @click="onAddClick"
        >
          <VIcon size="20" icon="tabler-plus" class="mr-1" />
          Add New User
        </VBtn>
      </div>
      <div>
        <VDataTableServer
          :items="users"
          :itemsLength="users.length"
          :headers="headers"
          class="text-no-wrap"
          :class="{
            'opacity-70': isLoading.list && users.length,
          }"
        >
          <!-- Name -->
          <template #item.name="{ item }">
            <div class="d-flex align-center">
              <VAvatar
                size="38"
                :variant="!item.avatar ? 'tonal' : undefined"
                class="me-3"
              >
                <VImg v-if="item?.avatar" :src="item.avatar" />
                <span v-else>{{ avatarText(item?.name) }}</span>
              </VAvatar>
              <div class="d-flex flex-column">
                <h6 class="text-body-1 font-medium">
                  {{ item?.name }}
                </h6>
                <span class="text-sm text-disabled">{{
                  item?.email || "N/A"
                }}</span>
              </div>
            </div>
          </template>

          <!-- Role -->
          <template #item.role="{ item }">
            <div>{{ item?.role?.name || "N/A" }}</div>
          </template>

          <!-- Status -->
          <template #item.status="{ item }">
            <VChip
              label
              size="small"
              class="text-capitalize"
              :class="{
                'bg-[#eaebed] text-[#8e929d]': item.status === 'inactive',
              }"
              :color="
                item.status !== 'inactive'
                  ? resolveUserStatusVariant(item.status)
                  : undefined
              "
            >
              {{ item?.status }}
            </VChip>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <div class="flex items-center gap-2">
              <button
                v-can="'edit-admins'"
                class="flex items-center gap-1"
                @click="onEditClick(item.id)"
              >
                <VIcon icon="tabler-edit" />
                Edit
              </button>
              <button
                v-can="'activate-admins'"
                class="flex items-center gap-1"
                @click="onChangeStatusClick(item)"
              >
                <Lucide
                  :icon="
                    item.status === 'active' ? 'ToggleLeft' : 'ToggleRight'
                  "
                />
                <span>{{
                  item.status === "active" ? "De-Activate" : "Activate"
                }}</span>
              </button>
              <button
                v-can="'delete-admins'"
                class="flex items-center gap-1"
                @click="onDeleteClick(item.id)"
              >
                <VIcon icon="tabler-trash" class="text-danger" />
                Delete
              </button>
            </div>
          </template>

          <template #bottom></template>
        </VDataTableServer>
        <div class="mt-4 flex" v-if="meta">
          <Pagination
            @pageChanged="
              params.page = $event;
              getUsers();
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
      itemName="User"
      :deleteFn="deleteUser"
      :isDeleting="isLoading.deleting"
      v-model:isDialogVisible="deletePopup.preview"
    />
    <UserFormPopup
      :preview="userPopup.preview"
      :idToEdit="userPopup.id"
      v-model:isDialogVisible="userPopup.preview"
      @getList="getUsers"
    />
    <VDialog v-model="statusPopup.preview" width="500">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="resetStatusPopup" />

      <VCard>
        <div class="py-8 px-4">
          <div class="mb-2 flex">
            <Lucide icon="Info" class="text-danger m-auto w-16 h-16" />
          </div>
          <div class="text-center text-xl">
            Are you sure you want to
            {{ statusPopup.status === "active" ? "De-Activate" : "Activate" }}
            this user ?
          </div>
          <div class="flex justify-center mx-auto my-2" v-if="statusPopup.item">
            <div class="flex items-center">
              <VAvatar
                size="38"
                :variant="!statusPopup.item?.avatar ? 'tonal' : undefined"
                class="me-3"
              >
                <VImg
                  v-if="statusPopup.item?.avatar"
                  :src="statusPopup.item?.avatar"
                />
                <span v-else>{{ avatarText(statusPopup.item?.name) }}</span>
              </VAvatar>
              <div class="d-flex flex-column">
                <h6 class="text-body-1 font-medium">
                  {{ statusPopup.item?.name }}
                </h6>
                <span class="text-sm text-disabled">{{
                  statusPopup.item?.email || "N/A"
                }}</span>
              </div>
            </div>
          </div>
          <div class="mt-4 flex justify-center">
            <VBtn color="#f1f1f2" @click="resetStatusPopup">No!</VBtn>
            &nbsp;&nbsp;&nbsp;
            <VBtn
              class="flex"
              :color="isAdmin ? 'black' : undefined"
              :class="{
                'text-white': isAdmin,
              }"
              @click="changeStatus"
            >
              <LoadingIcon
                icon="tail-spin"
                color="white"
                class="w-4 h-4 m-auto"
                v-if="isLoading.changingStatus"
              />
              <span v-else>Yes?</span>
            </VBtn>
          </div>
        </div>
      </VCard>
    </VDialog>
  </section>
</template>
