<script setup lang="ts">
import DeletePopup from "@/base-components/DeletePopup";
import LoadingIcon from "@/base-components/LoadingIcon";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { Toast } from "../../plugins/swal";
import { Operator } from "@/components/Operator";
import { useUserStore } from "@/stores/user";
import Lucide from "@/base-components/Lucide/Lucide.vue";

const emit = defineEmits(["deleteMerchant"]);
const api = inject<any>("api");
const merchants = ref<any[]>([]);
const meta = ref<any>({});
const isLoading = reactive({
  list: false,
  deleting: false,
});
const params = reactive({
  search: "",
  page: 1,
  limit: 10,
});
const deletePopup = reactive({
  preview: false,
  id: 0,
});
const merchantPopup = reactive({
  preview: false,
  id: 0,
});

const operatorPopup = reactive({
  preview: false,
  id: 0,
});

const emulatePopup = reactive({
  preview: false,
  emulate: false,
  tenant: null,
});

const userStore = useUserStore();
const router = useRouter();

const headers = [
  { title: "Name/Email", key: "name", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "First Contact", key: "phone_number_1", sortable: true },
  { title: "Joining date", key: "created_at", sortable: true },
  { title: "Industry", key: "industry", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

const resolveMerchantStatusVariant = (stat: string) => {
  const statLowerCase = stat.toLowerCase();
  if (statLowerCase === "pending") return "warning";
  if (statLowerCase === "active") return "success";
  if (statLowerCase === "inactive") return "secondary";

  return "primary";
};

const getMerchants = async () => {
  isLoading.list = true;
  try {
    const res = await api.admin.merchants.getMerchantsList(params);
    merchants.value = await res?.data?.data;
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

const deleteMerchant = async () => {
  isLoading.deleting = true;
  try {
    await api.admin.merchants.deleteMerchant(deletePopup.id);

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Merchant Deleted Successfully!</span>`,
    });

    resetDeletePopup();
    getMerchants();
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
  merchantPopup.id = 0;
  merchantPopup.preview = true;
};

const onEditClick = (id: number) => {
  merchantPopup.id = id;
  merchantPopup.preview = true;
};

const addOperator = (id: number) => {
  operatorPopup.id = id;
  operatorPopup.preview = true;
};

const confirmEmulation = (tenant: any) => {
  emulatePopup.tenant = tenant;
  emulatePopup.preview = true;
};

const emulateMerchant = () => {
  emulatePopup.emulate = true;
  userStore.setIsEmulation(1);
  userStore.setTenant(emulatePopup.tenant);
  emulatePopup.emulate = false;
  emulatePopup.preview = false;
  router.push("/dashboard");
};

const closeOperatorPopup = () => {
  operatorPopup.id = 0;
  operatorPopup.preview = false;
};

const storeOperator = (id: number) => {
  merchantPopup.id = id;
  merchantPopup.preview = true;
};

const onSearch = useDebounceFn(() => {
  params.page = 1;
  getMerchants();
}, 600);

getMerchants();
</script>

<template>
  <section>
    <div class="p-4 flex" v-if="isLoading.list && !merchants.length">
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
          v-can="'create-merchant'"
          primary
          color="black"
          class="text-white mt-auto"
          @click="onAddClick"
        >
          <VIcon size="20" icon="tabler-plus" class="mr-1" />
          Add New Merchant
        </VBtn>
      </div>
      <div>
        <VDataTableServer
          :items="merchants"
          :itemsLength="merchants.length"
          :headers="headers"
          class="text-no-wrap"
          :class="{
            'opacity-70': isLoading.list && merchants.length,
          }"
        >
          <!-- Name -->
          <template #item.name="{ item }">
            <div class="d-flex align-center">
              <VAvatar
                size="38"
                :variant="!item.logo ? 'tonal' : undefined"
                class="me-3"
              >
                <VImg v-if="item?.logo" :src="item.logo" />
                <span v-else>{{ avatarText(item?.business_name) }}</span>
              </VAvatar>
              <div class="d-flex flex-column">
                <h6 class="text-body-1 font-medium">
                  {{ item?.business_name }}
                </h6>
                <span class="text-sm text-disabled">{{
                  item?.email || "N/A"
                }}</span>
              </div>
            </div>
          </template>

          <!-- Industry -->
          <template #item.industry="{ item }">
            <div>{{ item?.industry?.name || "N/A" }}</div>
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
                  ? resolveMerchantStatusVariant(item.status)
                  : undefined
              "
            >
              {{ item?.status }}
            </VChip>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <IconBtn v-can="'edit-merchant'" @click="onEditClick(item.id)">
              <VIcon icon="tabler-edit" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>Edit Merchant</span>
              </VTooltip>
            </IconBtn>
            <IconBtn v-can="'delete-merchant'" @click="onDeleteClick(item.id)">
              <VIcon icon="tabler-trash" class="text-danger" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>Delete Merchant</span>
              </VTooltip>
            </IconBtn>

            <IconBtn v-can="'create-user'" @click="addOperator(item.id)">
              <VIcon icon="tabler-square-rounded-plus" class="text-info" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>Add Operator</span>
              </VTooltip>
            </IconBtn>

            <IconBtn v-can="'emulate-merchant'" @click="confirmEmulation(item)">
              <VIcon icon="tabler-arrows-diff" class="text-primary" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span style="color: white">Emulate Merchant</span>
              </VTooltip>
            </IconBtn>
          </template>

          <template #bottom></template>
        </VDataTableServer>
        <div class="mt-4 flex" v-if="meta">
          <Pagination
            @pageChanged="
              params.page = $event;
              getMerchants();
            "
            :meta="meta"
            class="w-full sm:w-auto sm:mr-auto"
          >
          </Pagination>
        </div>
      </div>
    </div>
    <DeletePopup
      :preview="deletePopup.preview"
      :isAdmin="true"
      itemName="Merchant"
      :deleteFn="deleteMerchant"
      :isDeleting="isLoading.deleting"
      v-model:isDialogVisible="deletePopup.preview"
    />
    <MerchantFormPopup
      :preview="merchantPopup.preview"
      :idToEdit="merchantPopup.id"
      v-model:isDialogVisible="merchantPopup.preview"
      @getList="getMerchants"
    />
    <VDialog v-model="operatorPopup.preview" width="500">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="closeOperatorPopup()" />

      <VCard>
        <div class="py-8 px-4">
          <Operator
            @closePopup="closeOperatorPopup()"
            :merchant_id="operatorPopup.id"
          ></Operator>
        </div>
      </VCard>
    </VDialog>
    <VDialog v-model="emulatePopup.preview" width="500">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="emulatePopup.preview = false" />

      <VCard>
        <div class="py-8 px-4">
          <div class="mb-2 flex">
            <Lucide icon="AlertTriangle" class="text-black m-auto w-16 h-16" />
          </div>
          <div class="text-center text-xl text-black">
            Are you sure you want to emulate to this merchant?
          </div>
          <div class="mt-4 flex justify-center">
            <VBtn :color="'warning'" @click="emulatePopup.preview = false"
              >No!</VBtn
            >
            &nbsp;&nbsp;&nbsp;
            <VBtn
              @click="emulateMerchant"
              :color="'black'"
              class="text-white"
              >{{ emulatePopup.emulate ? "Loading..." : "Yes?" }}</VBtn
            >
          </div>
        </div>
      </VCard>
    </VDialog>
  </section>
</template>
<style>
.v-tooltip > .v-overlay__content {
  background: #000000 !important;
}
</style>
