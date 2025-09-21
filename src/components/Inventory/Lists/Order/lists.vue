<script setup lang="ts">
import { staticPrimaryColor } from "@/plugins/vuetify/theme";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const props = defineProps({
  orders: {
    type: Array<any>,
    default: [],
  },
  metaObj: {
    type: Object,
    default: {},
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isShowMore: {
    type: Boolean,
    default: false,
  },
  posSetting: {
    type: Object,
    default: {},
  },
  parameters: {
    type: Object,
    default: {},
  },
  isEmptyParameters: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Object,
    default: {},
  },
});

const isDialogVisible = ref(false);
const windowSize = ref(window.innerWidth);
const activeItem = ref<any>({});
const searchQuery = ref("");
const setActive = async (order: any) => {
  activeItem.value = order;
};

window.addEventListener("resize", () => {
  windowSize.value = window.innerWidth;
});

const calcTotal = async (payments: any) => {
  let val = payments.reduce(
    (accumulator: any, current: any) => accumulator + current.total_amount,
    0
  );
  return val;
};
</script>
<template>
  <VCard
    max-height="635"
    class="h-fit lg:min-h-[635px] lg:h-full d-flex flex-column"
    v-if="windowSize > 785"
  >
    <div class="ma-0 mt-n1" v-if="!props.isEmptyParameters">
      <div cols="12" class="border-t cursor-pointer pa-4 shortcut-icon">
        <div class="search-style d-flex">
          <!-- @input="$emit('callSearchOrders', searchQuery)" -->
          <AppTextField
            v-model="searchQuery"
            placeholder="Search..."
            id="text_search"
            :isSearchBox="true"
            :readonly="true"
            @click="$emit('callOpenFilter')"
          />&nbsp;&nbsp;

          <!-- <VBtn
            @click="$emit('callOpenFilter')"
            type="button"
            class="w-20 p-4 rounded-lg shadow flex gap-4 text-center"
            >Filter</VBtn
          > -->
        </div>
      </div>
    </div>
    <div class="ma-0 mt-n1 rounded" v-else>
      <div cols="12" class="rounded border-t pa-4 shortcut-icon">
        <div class="p-2 flex items-center justify-between gap-4 bg-gray-100">
          <h4 class="cursor-pointer mb-0" @click="$emit('callOpenFilter')">
            <span
              style="
                color: black;
                font-size: 17px;
                font-weight: bold;
                text-decoration: underline;
              "
              >Search Parameter</span
            >
          </h4>
          <h6 class="mb-0" style="color: black">
            <IconBtn
              @click="$emit('callResetFilter')"
              variant="elevated"
              class="v-dialog-close-btn"
              style="background-color: white"
            >
              <VIcon :icon="'tabler-x'" :size="'20'" />
            </IconBtn>
          </h6>
        </div>
        <div
          v-if="props.parameters.total_price != ''"
          class="p-2 flex items-center justify-between gap-4 bg-gray-100"
        >
          <h6 class="mb-0">
            <span>Amount:</span>
          </h6>
          <h6 class="mb-0" style="color: black">
            {{ props.parameters.total_price }} $
          </h6>
        </div>
        <div
          v-if="props.parameters.customer_id != ''"
          class="p-2 flex items-center justify-between gap-4 bg-gray-100"
        >
          <h6 class="mb-0">
            <span>Consumer:</span>
          </h6>
          <h6 class="mb-0" style="color: black">
            {{ (props.parameters.customer_id, props.parameters.customer_name) }}
          </h6>
        </div>
        <div
          v-if="props.parameters.transaction_id != ''"
          class="p-2 flex items-center justify-between gap-4 bg-gray-100"
        >
          <h6 class="mb-0">
            <span>Reference Id:</span>
          </h6>
          <h6 class="mb-0" style="color: black">
            {{ props.parameters.transaction_id }}
          </h6>
        </div>
        <div
          v-if="props.parameters.exact_date != ''"
          class="p-2 flex items-center justify-between gap-4 bg-gray-100"
        >
          <h6 class="mb-0">
            <span>Date:</span>
          </h6>
          <h6 class="mb-0" style="color: black">
            {{ props.parameters.exact_date }}
          </h6>
        </div>
        <div
          v-if="props.parameters.tpn != ''"
          class="p-2 flex items-center justify-between gap-4 bg-gray-100"
        >
          <h6 class="mb-0">
            <span>TPN:</span>
          </h6>
          <h6 class="mb-0" style="color: black">
            {{ props.parameters.tpn }}
          </h6>
        </div>
        <div
          v-if="props.parameters.id != ''"
          class="p-2 flex items-center justify-between gap-4 bg-gray-100"
        >
          <h6 class="mb-0">
            <span>Order Id:</span>
          </h6>
          <h6 class="mb-0" style="color: black">
            {{
              posSetting && posSetting.order_prefix
                ? posSetting.order_prefix
                : "#"
            }}
            {{ props.parameters.id }}
          </h6>
        </div>
      </div>
    </div>
    <template
      class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
      v-if="props.isLoading && props.isShowMore == false"
    >
      <span class="p-4 text-center">Loading... </span></template
    >
    <PerfectScrollbar
      v-else-if="orders.length"
      :options="{ wheelPropagation: false }"
    >
      <div
        style="margin-top: -15px"
        class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
      >
        <div
          style="height: 86px"
          class="p-4 rounded-lg shadow flex items-center justify-between gap-4 cursor-pointer"
          :class="{
            'bg-secondary dark:!bg-slate-600 text-primary':
              activeItem.id === order.id || props.order.id === order.id,
            'bg-[#f8f7fa] dark:bg-darkmode-bg':
              activeItem.id !== order.id || props.order.id !== order.id,
          }"
          :to="''"
          @click="
            setActive(order);
            $emit('callSelectCurrentOrder', order);
          "
          v-for="order in orders"
        >
          <div class="flex flex-col justify-between h-full">
            <h6 class="mb-0">
              <span style="color: #0ebcf5">Sale</span> -
              {{ order.status == "cancel" ? "Canceled" : order.status }}
            </h6>
            <small class="text-muted d-block"
              ><span style="color: black; font-size: 15px; font-weight: bold"
                >Order:
              </span>
              <span class="mb-0" style="font-size: 15px">{{
                (props.posSetting && props.posSetting.order_prefix
                  ? props.posSetting.order_prefix
                  : "#") + order.id
              }}</span></small
            >
          </div>
          <div class="flex gap-2">
            <div class="flex flex-col justify-between h-full">
              <small class="text-muted d-block"
                ><i class="fas fa-clock"></i> {{ order.created_at }}
                {{ order.created_time_at }}
              </small>
              <h6 class="mb-0" style="color: black">
                ${{ makeFLoat(order.total_price, "") }}
              </h6>
            </div>

            <svg
              width="46"
              height="36"
              viewBox="0 0 46 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="46" height="35.1429" rx="4" fill="#E9F5FE" />
              <path
                d="M20 12L26 17.5714L20 23.1429"
                :stroke="
                  activeItem.id === order.id || props.order.id === order.id
                    ? staticPrimaryColor
                    : '#2196F3'
                "
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>

        <VBtn
          v-if="metaObj && metaObj.last_page > 1"
          :disabled="metaObj.current_page == metaObj.last_page"
          @click="$emit('callNextPage')"
          type="button"
          class="p-4 rounded-lg shadow flex gap-4 text-center"
          >{{ props.isShowMore ? "Loading..." : "Show More" }}</VBtn
        >
      </div>
    </PerfectScrollbar>
    <div v-else class="flex flex-col gap-4 p-4 bg-white dark:bg-surface">
      <div class="text-slate-400 text-center">No Records Found!</div>
    </div>
  </VCard>
  <template v-else>
    <div class="h-fit">
      <button class="cursor-pointer" @click="isDialogVisible = true">
        <MenuBarsIcon />
      </button>
    </div>
    <VDialog v-model="isDialogVisible" width="500">
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

      <VCard max-height="635" class="d-flex flex-column">
        <VRow class="ma-0 mt-n1">
          <VCol cols="12" class="border-t cursor-pointer pa-4 shortcut-icon">
            <div class="search-style">
              <AppTextField
                v-model="searchQuery"
                placeholder="Search..."
                id="text_search"
                @input="$emit('callSearchOrders', searchQuery)"
                :isSearchBox="true"
              />
            </div>
          </VCol>
        </VRow>
        <template
          class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
          v-if="isLoading && props.isShowMore == false"
        >
          <span class="p-4 text-center">Loading... </span></template
        >
        <PerfectScrollbar
          v-else-if="orders.length"
          :options="{ wheelPropagation: false }"
        >
          <div
            class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
          >
            <RouterLink
              class="p-4 rounded-lg shadow flex items-center justify-between gap-4"
              :class="{
                'bg-secondary dark:!bg-slate-600 text-primary':
                  activeItem.id === order.id || props.order.id === order.id,
                'bg-[#f8f7fa] dark:bg-darkmode-bg':
                  activeItem.id !== order.id || props.order.id !== order.id,
              }"
              :to="''"
              @click="
                setActive(order);
                $emit('callSelectCurrentOrder', order);
              "
              v-for="order in orders"
            >
              <div class="flex flex-col justify-between h-full">
                <h6 class="mb-0">
                  <span style="color: #0ebcf5">Sale</span> -
                  {{ order.status == "cancel" ? "Canceled" : order.status }}
                </h6>
                <small class="text-muted d-block"
                  >Order:
                  <span
                    class="mb-0"
                    style="color: black; font-size: 17px; font-weight: bold"
                    >#{{ order.id }}</span
                  ></small
                >
              </div>
              <div class="flex gap-2">
                <div class="flex flex-col justify-between h-full">
                  <small class="text-muted d-block"
                    ><i class="fas fa-clock"></i> {{ order.created_at }}
                  </small>
                  <h6 class="mb-0" style="color: black">
                    ${{ makeFLoat(order.total_price, "") }}
                  </h6>
                </div>

                <svg
                  width="46"
                  height="36"
                  viewBox="0 0 46 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="46" height="35.1429" rx="4" fill="#E9F5FE" />
                  <path
                    d="M20 12L26 17.5714L20 23.1429"
                    :stroke="
                      activeItem.id === order.id || props.order.id === order.id
                        ? staticPrimaryColor
                        : '#2196F3'
                    "
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </RouterLink>
            <VBtn
              v-if="metaObj && metaObj.last_page > 1"
              :disabled="metaObj.current_page == metaObj.last_page"
              @click="$emit('callNextPage')"
              type="button"
              class="p-4 rounded-lg shadow flex gap-4 text-center"
              >{{ props.isShowMore ? "Loading..." : "Show More" }}</VBtn
            >
          </div>
        </PerfectScrollbar>
        <div v-else class="flex flex-col gap-4 p-4 bg-white dark:bg-surface">
          <div class="text-slate-400 text-center">No Records Found!</div>
        </div>
      </VCard>
    </VDialog>
  </template>
</template>

<style>
.v-row {
  flex: 0 0 auto !important;
}
</style>
