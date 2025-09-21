<script lang="ts" setup>
import CustomerForm from "@/components/Customer/CustomerForm.vue";
import CustomerLists from "@/components/Inventory/Lists/Customers/lists.vue";
import { staticPrimaryColor } from "@/plugins/vuetify/theme";
import DeletePopup from "@/base-components/DeletePopup";
import { Toast } from "@/plugins/swal";

definePage({
  meta: {
    requiresAuth: true,
    permission: "view-customer",
  },
});

const props = defineProps({
  isCustomerSelection: {
    type: Boolean,
    default: false,
  },
});

const windowSize = ref(window.innerWidth);
window.addEventListener("resize", () => {
  windowSize.value = window.innerWidth;
});

setPageTitle("Cutomers");

const isFallbackStateActive = ref(false);
const refLoadingIndicator = ref<any>(null);

watch(
  [isFallbackStateActive, refLoadingIndicator],
  () => {
    if (isFallbackStateActive.value && refLoadingIndicator.value)
      refLoadingIndicator.value.fallbackHandle();

    if (!isFallbackStateActive.value && refLoadingIndicator.value)
      refLoadingIndicator.value.resolveHandle();
  },
  { immediate: true }
);

const api = inject<any>("api");
const existCustomerId = ref<any>(0);
const customers = ref<any[]>([]);
const currentCustomer = ref<any>();
const meta = ref<any>(null);
const isShowMore = ref<any>(false);
const params = ref<any>({
  search: "",
  limit: 5,
  page: 1,
});

const isLoading = reactive({
  list: false,
  deleting: false,
});

const formPreview = reactive({
  create: false,
  edit: false,
  delete: false,
});

const nextPage = async () => {
  if (meta.value.current_page < meta.value.last_page) {
    params.value.page++;
    isShowMore.value = true;
    getCustomers(true);
  }
};

const searchCustomers = useDebounceFn((searchQuery: string) => {
  params.value.search = searchQuery;
  params.value.page = 1;
  getCustomers(false);
  isShowMore.value = false;
}, 600);

const resetFilter = async (searchQuery: string) => {
  if (searchQuery != "") {
    params.value.search = "";
    params.value.page = 1;
    getCustomers(false);
    isShowMore.value = false;
  }
};

const getCustomers = async (isNext: boolean) => {
  try {
    if (!isShowMore.value) {
      isLoading.list = true;
    }

    const response = await api.customer.getCustomers(params.value);
    if ((params.value.search != "" || params.value.search == "") && isNext) {
      response.data?.data.forEach((order: any) => {
        customers.value.push(order);
      });
    } else {
      customers.value = response?.data?.data;
    }
    if (!currentCustomer.value) {
      selectCurrentCustomer(customers.value[0]);
    }
    meta.value = response?.data?.meta;
    if (!isShowMore.value) {
      isLoading.list = false;
    } else {
      isShowMore.value = false;
    }
  } catch (error) {
    console.log(error);
  }
};

const selectCurrentCustomer = async (customer: any) => {
  currentCustomer.value = customer;
  formPreview.create = false;
  if (props.isCustomerSelection) {
    formPreview.edit = false;
  } else {
    formPreview.edit = true;
  }
  formPreview.delete = false;
};

const showCreateForm = async () => {
  currentCustomer.value = null;
  formPreview.edit = false;
  formPreview.delete = false;
  formPreview.create = true;
};

const openDeletePopup = () => {
  formPreview.delete = true;
};

const updatePreview = async (customer: Object) => {
  currentCustomer.value = customer;
  formPreview.create = false;
  formPreview.edit = true;
  formPreview.delete = false;
};

const deleteCustomer = async () => {
  isLoading.deleting = true;
  try {
    await api.customer.deleteCustomer(currentCustomer.value.id);

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Customer Deleted Successfully!</span>`,
    });
    isLoading.deleting = false;
    formPreview.create = false;
    formPreview.delete = false;
    formPreview.edit = false;
    currentCustomer.value = null;
    params.value.page = 1;
    getCustomers(false);
  } catch (error) {
    console.log(error);
  }
};

getCustomers(false);
</script>

<template>
  <section>
    <div v-if="!isCustomerSelection" class="flex items-center gap-2">
      <div class="bg-secondary dark:!bg-surface p-2 shadow rounded flex">
        <BoxIcon :color="staticPrimaryColor" class="w-[20px] h-[20px] m-auto" />
      </div>
      <p class="text-xl">Customers</p>
    </div>
    <div class="grid ineventory-grid gap-4 mt-4">
      <CustomerLists
        :currentCustomer="formPreview.create ? null : currentCustomer"
        v-can="'view-customer'"
        :isLoading="isLoading.list"
        :isShowMore="isShowMore"
        :metaObj="meta"
        :customers="customers"
        @callSelectCurrentCustomer="selectCurrentCustomer"
        @callNextPage="nextPage"
        @callSearchCustomers="searchCustomers"
        @callResetFilter="resetFilter"
      />
      <div class="flex flex-col gap-4">
        <RouterView>
          <Suspense
            :timeout="0"
            @fallback="isFallbackStateActive = true"
            @resolve="isFallbackStateActive = false"
          >
            <VCard>
              <VCardItem class="py-2">
                <VCardTitle
                  style="margin-top: 28px"
                  v-if="currentCustomer && !isCustomerSelection"
                  >{{ formPreview.edit ? "Edit" : "" }} Customer</VCardTitle
                >
                <VCardTitle
                  style="margin-top: 28px"
                  v-else-if="!currentCustomer && !isCustomerSelection"
                  >{{ formPreview.create ? "Add" : "" }} Customer</VCardTitle
                >
                <VCardTitle
                  style="margin-top: 28px"
                  v-else-if="currentCustomer && isCustomerSelection"
                  >Details</VCardTitle
                >
                <template
                  #append
                  v-if="!isCustomerSelection && currentCustomer"
                >
                  <div class="mt-4 flex justify-center">
                    <VBtn
                      v-can="'delete-customer'"
                      v-if="currentCustomer"
                      @click="openDeletePopup()"
                      type="button"
                      color="danger"
                      class="text-white"
                    >
                      Delete
                    </VBtn>
                    &nbsp;&nbsp;&nbsp;
                    <VBtn v-can="'create-customer'" @click="showCreateForm()">
                      <span class="hidden md:block"> Create </span>
                    </VBtn>
                  </div>
                </template> </VCardItem
              ><br />
              <VRow
                class="ma-0 mt-n1"
                v-if="formPreview.edit && currentCustomer"
              >
                <VCol cols="12" class="border-t pa-4 shortcut-icon">
                  <CustomerForm
                    :idToEdit="currentCustomer.id"
                    :preview="formPreview.edit"
                    @updatePreview="updatePreview"
                    @getList="getCustomers(false)"
                  ></CustomerForm>
                </VCol>
              </VRow>
              <VRow
                style="height: 550px !important"
                class="ma-0 mt-n1"
                v-else-if="formPreview.create"
              >
                <VCol cols="12" class="border-t pa-4 shortcut-icon">
                  <CustomerForm
                    :idToEdit="0"
                    :preview="formPreview.create"
                    @updatePreview="updatePreview"
                    @getList="getCustomers(false)"
                  ></CustomerForm>
                </VCol>
              </VRow>
              <VRow
                class="ma-0 mt-n1"
                v-else-if="
                  currentCustomer &&
                  !formPreview.edit &&
                  !formPreview.create &&
                  isCustomerSelection
                "
              >
                <VCol cols="12" class="border-t pa-4 shortcut-icon">
                  <h6
                    style="text-decoration: underline"
                    class="text-base font-weight-medium mt-2 mb-0"
                  >
                    Basic Information
                  </h6>
                  <br />
                  <div class="grid md:grid-cols-2 gap-4">
                    <div id="first_name">
                      <label for="">First Name: </label>
                      <span>{{ currentCustomer.first_name ?? "N/A" }}</span>
                    </div>
                    <div id="last_name">
                      <label for="">Last Name: </label>
                      <span>{{ currentCustomer.last_name ?? "N/A" }}</span>
                    </div>
                    <div id="email">
                      <label for="">Email: </label>
                      <span>{{ currentCustomer.email ?? "N/A" }}</span>
                    </div>
                    <div id="phone">
                      <label for="">Phone: </label>
                      <span>{{ currentCustomer.phone ?? "N/A" }}</span>
                    </div>
                    <div id="birthday">
                      <label for="">Birthday: </label>
                      <span>{{ currentCustomer.birthday ?? "N/A" }}</span>
                    </div>
                  </div>
                  <br />
                  <VDivider />
                  <h6
                    style="text-decoration: underline"
                    class="text-base font-weight-medium mt-2 mb-0"
                  >
                    Address Information
                  </h6>
                  <br />
                  <div class="grid md:grid-cols-2 gap-4">
                    <div id="address_line_1">
                      <label for="">Address Line 1: </label>
                      <span>{{
                        currentCustomer?.address?.address_line_1 ?? "N/A"
                      }}</span>
                    </div>
                    <div id="address_line_2">
                      <label for="">Address Line 2: </label>
                      <span>{{
                        currentCustomer?.address?.address_line_2 ?? "N/A"
                      }}</span>
                    </div>
                    <div id="city">
                      <label for="">City: </label>
                      <span>{{ currentCustomer?.address?.city ?? "N/A" }}</span>
                    </div>
                    <div id="zip_code">
                      <label for="">Zipe Code: </label>
                      <span>{{
                        currentCustomer?.address?.zip_code ?? "N/A"
                      }}</span>
                    </div>
                    <div id="state">
                      <label for="">State: </label>
                      <span>{{
                        currentCustomer?.address?.state?.name ?? "N/A"
                      }}</span>
                    </div>
                  </div>
                </VCol>
                <VCol cols="12" class="d-flex gap-4" v-if="isCustomerSelection">
                  <VBtn
                    class="text-white"
                    @click="$emit('callSaveSelection', currentCustomer)"
                  >
                    <span>Save</span>
                  </VBtn>
                </VCol>
              </VRow>
            </VCard>
          </Suspense>
        </RouterView>
      </div>
    </div>
    <DeletePopup
      :isAdmin="false"
      :preview="formPreview.delete"
      itemName="Customer"
      :deleteFn="deleteCustomer"
      :isDeleting="isLoading.deleting"
      v-model:isDialogVisible="formPreview.delete"
    />
  </section>
</template>
<style>
.d-none {
  display: none;
}
.ineventory-grid {
  grid-template-columns: 400px 1fr;
}

@media screen and (max-width: 1000px) {
  .ineventory-grid {
    grid-template-columns: 275px 1fr;
  }
}

@media screen and (max-width: 785px) {
  .ineventory-grid {
    grid-template-columns: 60px 1fr;
  }
}

@media screen and (max-width: 450px) {
  .ineventory-grid {
    grid-template-columns: 1fr;
  }
}
</style>
