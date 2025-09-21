<script setup lang="ts">
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { useLocationMenu } from "@/stores/locations-menu";
import Lucide from "@/base-components/Lucide/Lucide.vue";
import { Toast } from "@/plugins/swal";
import LoadingIcon from "@/base-components/LoadingIcon";
import RolesList from "@/components/Role/List.vue";

definePage({
  meta: {
    requiresAuth: true,
    layout: "side-menu",
    title: "Roles",
    permission: "view-roles",
  },
});

setPageTitle("Roles");

const menuStore = useLocationMenu();
const api = inject<any>("api");
const isLoading = reactive({
  list: false,
  deleting: false,
});
const meta = ref<any>({});
const roles = ref<any[]>([]);
const page = ref(1);
const limit = ref(6);

const deleteRole = async () => {
  menuStore.setIsDeleting(true);
  try {
    const res = await api.roles.deleteRole(menuStore.getIDToEdit);
    if (res !== undefined) {
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span class="text-sm">Role Deleted Successfully!</span>`,
      });
      menuStore.setIsDeletePopupVisible(false);
      if (roles.value.length == 1) {
        page.value--;
      }
      getRoles();
    }
  } catch (error) {
    console.log(error);
    menuStore.setIDToEdit(0);
    menuStore.setIsDeletePopupVisible(false);
  }
  menuStore.setIsDeleting(false);
};

const openEditPopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIDToClone(0);
  menuStore.setIsPopupVisible(true);
};

const openClonePopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIDToClone(id);
  menuStore.setIsPopupVisible(true);
};

const openDeletePopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsDeletePopupVisible(true);
};

const getRoles = async () => {
  isLoading.list = true;
  try {
    const search = menuStore.getSearchValue;
    if (search != "") {
      page.value = 1;
    }
    const res = await api.roles.getRolesList({
      search: search,
      page: page.value,
      limit: limit.value,
    });
    roles.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.list = false;
};

getRoles();

watch(
  () => menuStore.getSearchValue,
  () => {
    getRoles();
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getRoles();
  }
);

watch(
  () => menuStore.getIsDeleteRecord,
  () => {
    deleteRole();
  }
);
</script>

<template>
  <section>
    <div class="grid">
      <div class="flex" v-if="isLoading.list">
        <LoadingIcon icon="tail-spin" color="orange" class="w-6 h-6 mx-auto" />
      </div>
      <template v-else-if="roles.length">
        <RolesList
          :isLoading="isLoading.list"
          :roles="roles"
          @callOnDeleteClick="openDeletePopup"
          @callOpenEditPopup="openEditPopup"
          @callOpenClonePopup="openClonePopup"
          :isMerchant="true"
        />
      </template>
      <div class="text-slate-400" v-else>No Records Found!</div>
    </div>
    <div
      class="mt-8 flex m-auto"
      v-if="meta && roles.length"
      :class="{
        'opacity-0': isLoading.list,
      }"
    >
      <Pagination
        @pageChanged="
          page = $event;
          getRoles();
        "
        :meta="meta"
        class="w-full sm:w-auto sm:mr-auto"
      >
      </Pagination>
    </div>
  </section>
</template>
