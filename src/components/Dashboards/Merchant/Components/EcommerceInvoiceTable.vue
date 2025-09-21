<script setup lang="ts">
import { VDataTableServer } from "vuetify/labs/VDataTable";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import Field from "@/components/Inventory/Lists/Order/receipt-field/field.vue";

const searchQuery = ref("");

const props = defineProps({
  transactions: {
    type: Array<any>,
    default: [],
  },
  isLoadingTransactions: {
    type: Boolean,
    default: false,
  },
  metaObj: {
    type: Object,
    default: {},
  },
});
interface Emit {
  (e: "selectCurrentOrder", value: Object): void;
  (e: "callOnSearch", value: string): void;
  (e: "callNextPage", value: number): void;
}

const api = inject<any>("api");
const router = useRouter();
const emit = defineEmits<Emit>();
const currentTransaction = ref<any>(null);
const is_customer = ref(false);
const is_merchant = ref(false);
const is_terminal = ref(false);
const is_kitchen_bar = ref(false);
const isPrintReceiptsPopup = ref(false);
const isLoadingFields = ref<any>(false);
const receipts = ref<any>();
const currentOrder = ref<any>(null);
const userStore = useUserStore();
const posSetting = userStore.getPosSettings;
// Data table options
const itemsPerPage = ref(6);
const page = ref(1);
const sortBy = ref();
const orderBy = ref();

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page;
  sortBy.value = options.sortBy[0]?.key;
  orderBy.value = options.sortBy[0]?.order;
};

// 👉 headers
const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Payment Method", key: "payment_method", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Total", key: "total_amount", sortable: true },
  { title: "Date", key: "date", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

const computedMoreList = computed(() => {
  return () => [
    { title: "Download", value: "download", prependIcon: "tabler-download" },
    {
      title: "Edit",
      value: "edit",
      prependIcon: "tabler-pencil",
    },
    {
      title: "Duplicate",
      value: "duplicate",
      prependIcon: "tabler-layers-intersect",
    },
  ];
});

const resolveMerchantStatusVariant = (stat: string) => {
  const statLowerCase = stat.toLowerCase();
  if (statLowerCase === "pending") return "warning";
  if (statLowerCase === "confirmed") return "success";
  if (statLowerCase === "refunded") return "primary";
  if (statLowerCase === "canceled") return "danger";
};

const goToSales = () => {
  router.push("/dashboard/sales-list");
};

const seeDetails = (ID: any) => {
  router.push({ name: "dashboard-sales-list", query: { id: ID } });
};

const getReciptsByOrderStatus = async (status: string) => {
  try {
    isLoadingFields.value = true;
    const response = await api.order.getReciptsByOrderStatus(status);
    receipts.value = response?.data;
    isLoadingFields.value = false;
  } catch (error) {
    console.log(error);
  }
};

const openPrintReceipts = async (
  type: string,
  order: any,
  transaction: any
) => {
  is_customer.value = false;
  is_merchant.value = false;
  is_terminal.value = false;
  is_kitchen_bar.value = false;
  isPrintReceiptsPopup.value = true;
  currentTransaction.value = transaction;
  currentOrder.value = order;
  getReciptsByOrderStatus(type);
};
</script>

<template>
  <VCard v-if="transactions" id="invoice-list">
    <div class="flex flex-col gap-4" style="padding: 10px">
      <div class="flex flex-wrap gap-4 justify-between">
        <div class="search-style d-flex">
          <AppTextField
            type="text"
            v-model="searchQuery"
            :isSearchBox="true"
            placeholder="Type here..."
            class="w-[200px] sm:w-[250px]"
            @keyup="$emit('callOnSearch', searchQuery)"
          />
        </div>
        <VBtn primary class="text-white mt-auto" @click="goToSales">
          <VIcon size="20" icon="tabler-eye" class="mr-1" />
          View All Orders
        </VBtn>
      </div>

      <div>
        <VDataTableServer
          :items="props.transactions"
          :itemsLength="props.transactions.length"
          :headers="headers"
          class="text-no-wrap"
          :class="{
            'opacity-70':
              props.isLoadingTransactions && props.transactions.length,
          }"
        >
          <!-- Payment Method -->
          <template #item.payment_method="{ item }">
            <span class="capitalize">{{
              item.payment_method.replace("-", " ")
            }}</span>
          </template>
          <!-- Total -->
          <template #item.total_amount="{ item }">
            <span>${{ item.total_amount.toFixed(2) }}</span>
          </template>
          <!-- Status -->
          <template #item.status="{ item }">
            <VChip
              label
              size="small"
              class="text-capitalize"
              :color="resolveMerchantStatusVariant(item.status)"
            >
              {{ item?.status }}
            </VChip>
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <!-- <RouterLink
              :to="{
                path: '/dashboard/sales-list',
                query: {
                  item: item.order,
                },
              }"
            > -->
            <IconBtn @click="seeDetails(item.order.id)">
              <VIcon icon="tabler-eye" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>See Details</span>
              </VTooltip>
            </IconBtn>
            <!-- </RouterLink> -->
            <IconBtn
              @click="openPrintReceipts(item.order.status, item.order, item)"
            >
              <VIcon icon="tabler-download" class="text-danger" />
              <VTooltip open-delay="500" location="top" activator="parent">
                <span>Download Transaction</span>
              </VTooltip>
            </IconBtn>
          </template>

          <template #bottom></template>
        </VDataTableServer>
        <div
          class="mt-8 flex m-auto"
          v-if="metaObj && props.transactions.length"
          :class="{
            'opacity-0': props.isLoadingTransactions,
          }"
        >
          <Pagination
            @pageChanged="$emit('callNextPage', $event)"
            :meta="metaObj"
            class="w-full sm:w-auto sm:mr-auto"
          >
          </Pagination>
        </div>
      </div>
    </div>
  </VCard>
  <VDialog v-model="isPrintReceiptsPopup" width="550">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isPrintReceiptsPopup = false" />

    <VCard class="md:py-8 md:px-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3"> Choose Receipts To Print </VCardTitle>
      </VCardItem>
      <VCardText
        v-if="
          receipts?.customer ||
          receipts?.merchant ||
          receipts?.terminal ||
          receipts?.['kitchen-bar']
        "
      >
        <div class="demo-space-x">
          <div v-if="receipts['customer'] != undefined">
            <VCheckbox label="Customer" v-model="is_customer" />
          </div>
          <div v-if="receipts['merchant'] != undefined">
            <VCheckbox label="Merchant" v-model="is_merchant" />
          </div>
          <div v-if="receipts['kitchen-bar'] != undefined">
            <VCheckbox label="Kitchen-bar" v-model="is_kitchen_bar" />
          </div>
          <div v-if="receipts['terminal'] != undefined">
            <VCheckbox label="Terminal" v-model="is_terminal" />
          </div>
        </div>
        <br />
        <VBtn
          v-if="!is_customer && !is_merchant && !is_terminal && !is_kitchen_bar"
          :color="'warning'"
          :disabled="true"
          >Print</VBtn
        >
        <VBtn v-else v-print="'#section-to-print'" :color="'warning'"
          >Print</VBtn
        >
        <div id="section-to-print" style="height: 100%">
          <div>
            <br />
            <VCardText>
              <div v-if="is_customer">
                <br />
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 5px;
                    font-weight: bold;
                    margin-right: -4px;
                  "
                >
                  Customer Receipt
                </div>
                <br />
                <Field
                  :type="'customer'"
                  :receipt="receipts?.customer"
                  :order="currentOrder"
                  :transaction="currentTransaction"
                  :posSetting="posSetting"
                  class="md:w-[265px] mx-auto lg:w-auto"
                />
              </div>
              <div v-if="is_merchant">
                <br />
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 5px;
                    font-weight: bold;
                    margin-right: -4px;
                  "
                >
                  Merchant Receipt
                </div>
                <br />
                <Field
                  :type="'merchant'"
                  :receipt="receipts?.merchant"
                  :order="currentOrder"
                  :transaction="currentTransaction"
                  :posSetting="posSetting"
                  class="md:w-[265px] mx-auto lg:w-auto"
                />
              </div>
              <div v-if="is_kitchen_bar">
                <br />
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 5px;
                    font-weight: bold;
                    margin-right: -4px;
                  "
                >
                  Kitchen-bar Receipt
                </div>
                <br />
                <Field
                  :type="'kitchen-bar'"
                  :receipt="receipts?.['kitchen-bar']"
                  :order="currentOrder"
                  :transaction="currentTransaction"
                  :posSetting="posSetting"
                  class="md:w-[265px] mx-auto lg:w-auto"
                />
              </div>
              <div v-if="is_terminal">
                <br />
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 5px;
                    font-weight: bold;
                    margin-right: -4px;
                  "
                >
                  Terminal Receipt
                </div>
                <br />
                <Field
                  :type="'terminal'"
                  :receipt="receipts?.terminal"
                  :order="currentOrder"
                  :transaction="currentTransaction"
                  :posSetting="posSetting"
                  class="md:w-[265px] mx-auto lg:w-auto"
                />
              </div>
            </VCardText>
          </div>
        </div>
      </VCardText>
      <VCardText v-else>
        <div class="text-center">
          There Is No Active Receipts Found To Print!
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 12rem;
  }
}
</style>
