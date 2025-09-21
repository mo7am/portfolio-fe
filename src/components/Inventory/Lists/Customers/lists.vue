<script setup lang="ts">
import { staticPrimaryColor } from "@/plugins/vuetify/theme";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const props = defineProps({
  customers: {
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
  currentCustomer: {
    type: Object,
    default: null,
  },
});

const isDialogVisible = ref(false);
const windowSize = ref(window.innerWidth);
const activeItem = ref<any>({});
const searchQuery = ref("");
const setActive = async (customer: any) => {
  activeItem.value = customer;
};

const clearSearch = async () => {
  searchQuery.value = "";
};

window.addEventListener("resize", () => {
  windowSize.value = window.innerWidth;
});

watch(
  () => props.currentCustomer,
  (value) => {
    if (value) {
      activeItem.value = value;
    } else {
      activeItem.value = null;
    }
  }
);
</script>
<template>
  <VCard
    max-height="635"
    class="h-fit lg:min-h-[635px] lg:h-full d-flex flex-column"
    v-if="windowSize > 785"
  >
    <div class="ma-0 mt-n1">
      <div cols="12" class="border-t cursor-pointer pa-4 shortcut-icon">
        <div class="search-style">
          <div class="flex justify-between">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search..."
              id="text_search"
              @input="$emit('callSearchCustomers', searchQuery)"
              :isSearchBox="true"
            />
            &nbsp;&nbsp;

            <VBtn
              @click="
                $emit('callResetFilter', searchQuery);
                clearSearch();
              "
              type="button"
              class="w-20 p-4 rounded-lg shadow flex gap-4 text-center"
              >Reset</VBtn
            >
          </div>
        </div>
      </div>
    </div>
    <template v-if="props.isLoading && props.isShowMore == false">
      <span class="p-4 text-center">Loading... </span></template
    >
    <PerfectScrollbar
      v-else-if="customers.length"
      :options="{ wheelPropagation: false }"
    >
      <div
        style="margin-top: -14px"
        class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
      >
        <RouterLink
          style="height: 86px"
          class="p-2 rounded-lg shadow flex items-center justify-between gap-4"
          :class="{
            'bg-secondary dark:!bg-slate-600 text-primary':
              activeItem && activeItem.id === customer.id,
            'bg-[#f8f7fa] dark:bg-darkmode-bg':
              activeItem && activeItem.id !== customer.id,
          }"
          :to="''"
          @click="
            setActive(customer);
            $emit('callSelectCurrentCustomer', customer);
          "
          v-for="customer in customers"
        >
          <div class="flex flex-col justify-between h-full">
            <h6
              style="color: black; font-size: 17px; font-weight: bold"
              class="mb-0"
              v-if="customer.first_name || customer.last_name"
            >
              {{ customer.first_name }} {{ customer.last_name }}
            </h6>
            <h6
              style="color: black; font-size: 17px; font-weight: bold"
              class="mb-0"
              v-else
            >
              <span v-if="customer.email">{{ customer.email }}<br /></span>
              {{ customer.phone }}
            </h6>
            <small
              :style="
                customer.email ? 'margin-bottom: 7px' : 'margin-bottom: 25px'
              "
              class="text-muted d-block"
              v-if="customer.first_name || customer.last_name"
            >
              <span v-if="customer.email">{{ customer.email }}<br /></span>
              <span v-if="customer.phone">{{ customer.phone }}</span></small
            >
          </div>
          <div class="flex gap-2">
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
                  activeItem && activeItem.id === customer.id
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
    <div
      v-else
      class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
    >
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
                @input="$emit('callSearchCustomers', searchQuery)"
                :isSearchBox="true"
              />
            </div>
          </VCol>
        </VRow>
        <template v-if="props.isLoading && props.isShowMore == false">
          <span class="p-4 text-center">Loading... </span></template
        >
        <PerfectScrollbar
          v-else-if="customers.length"
          :options="{ wheelPropagation: false }"
        >
          <div
            class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
          >
            <RouterLink
              class="p-4 rounded-lg shadow flex items-center justify-between gap-4"
              :class="{
                'bg-secondary dark:!bg-slate-600 text-primary':
                  activeItem && activeItem.id === customer.id,
                'bg-[#f8f7fa] dark:bg-darkmode-bg':
                  activeItem && activeItem.id !== customer.id,
              }"
              :to="''"
              @click="
                setActive(customer);
                $emit('callSelectCurrentCustomer', customer);
              "
              v-for="customer in customers"
            >
              <div class="flex flex-col justify-between h-full">
                <h6
                  style="color: black; font-size: 17px; font-weight: bold"
                  class="mb-0"
                  v-if="customer.first_name || customer.last_name"
                >
                  {{ customer.first_name }} {{ customer.last_name }}
                </h6>
                <h6
                  style="color: black; font-size: 17px; font-weight: bold"
                  class="mb-0"
                  v-else
                >
                  {{ customer.phone }}
                </h6>
                <small
                  class="text-muted d-block"
                  v-if="customer.first_name || customer.last_name"
                >
                  <span class="mb-0">{{ customer.phone }}</span></small
                >
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
        <div
          v-else
          class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
        >
          <div class="text-slate-400 text-center">No Records Found!</div>
        </div>
      </VCard>
    </VDialog>
  </template>
</template>
