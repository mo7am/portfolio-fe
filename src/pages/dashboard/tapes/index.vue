<script setup lang="ts">
import { useTapeMenu } from "@/stores/tapes-menu";
import TapeList from "@/components/Tape/List.vue";
import DatePicker from "@/base-components/DatePicker";
import LoadingIcon from "@/base-components/LoadingIcon";
import Pagination from "@/base-components/Pagination/Pagination.vue";

definePage({
  meta: {
    requiresAuth: true,
    layout: "side-menu",
    title: "X/Z Tapes",
    permission: "view-xz-tape-history",
  },
});

const menuStore = useTapeMenu();
const api = inject<any>("api");
const isLoading = ref(false);
const isLoadingOperator = ref<any>(false);
const isOperatorPopup = ref<any>(false);

const meta = ref<any>({});
const tapes = ref<any[]>([]);
const operators = ref<any[]>([]);
const selectedOperator = ref<any>(null);

const types = [
  { id: "x tape", name: "X Tape" },
  { id: "z tape", name: "Z Tape" },
  { id: "x tape by operator", name: "X Tape By Operator" },
];

const params = ref<any>({
  type: "",
  user_name: "",
  user_id: "",
  created_at: "",
  number_of_transactions: "",
  limit: 5,
  page: 1,
});
const metaOperator = ref<any>(null);
const operatorParams = ref<any>({
  search: "",
  limit: 5,
  page: 1,
});

setPageTitle("X/Z Tapes");

const getTapes = async () => {
  isLoading.value = true;
  try {
    if (
      params.value.type != "" ||
      params.value.user_id != "" ||
      params.value.created_at != "" ||
      params.value.number_of_transactions != ""
    ) {
      params.value.page = 1;
    }
    const res = await api.tape.getXZTapesHistory(params.value);
    tapes.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const filter = async () => {
  getTapes();
  menuStore.setIsSearchPopupVisible(false);
};

const nextPage = (pageNum: any) => {
  params.value.page = pageNum;
  getTapes();
};

const getMerchantUsers = async () => {
  isLoadingOperator.value = true;
  try {
    const res = await api.tape.getMerchantUsers({
      search: operatorParams.value.search,
      page: operatorParams.value.page,
      limit: operatorParams.value.limit,
    });
    operators.value = await res?.data?.data;
    metaOperator.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoadingOperator.value = false;
};

getTapes();

const resetFilter = async () => {
  params.value.user_id = "";
  params.value.type = "";
  params.value.user_name = "";
  params.value.created_at = "";
  params.value.number_of_transactions = "";
  menuStore.setIsSearchPopupVisible(false);
  getTapes();
};

const openOperatorPopup = async () => {
  isOperatorPopup.value = true;
  getMerchantUsers();
};

const removeOption = async () => {
  selectedOperator.value = null;
  params.value.user_name = "";
  params.value.user_id = "";
};

const onOperatorClick = async (operator: any) => {
  selectedOperator.value = operator;
  isOperatorPopup.value = false;
  params.value.user_name = operator.name;
  params.value.user_id = operator.id;
};

const onOperatorsSearch = useDebounceFn(getMerchantUsers, 600);

watch(
  () => menuStore.getSearchValue,
  () => {
    getTapes();
  }
);

watch(
  () => menuStore.getIsGetData,
  () => {
    getTapes();
  }
);
</script>
<template>
  <TapeList
    :tapes="tapes"
    :isLoading="isLoading"
    :metaObj="meta"
    @callNextPage="nextPage"
  ></TapeList>

  <VDialog v-model="menuStore.isSearchPopupVisible" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="menuStore.setIsSearchPopupVisible(false)" />
    <VCard>
      <div class="py-8 px-4">
        <div id="number_of_transactions">
          <AppTextField
            type="number"
            v-model="params.number_of_transactions"
            label="Number Of Transactions"
            placeholder="Type Here..."
          />
        </div>
        <div id="user_id" class="relative">
          <AppTextField
            @click="openOperatorPopup()"
            v-model="params.user_name"
            label="Created By"
            placeholder="Type Here..."
            type="text"
            :readOnly="true"
            :isSelectedItem="selectedOperator ? true : false"
            :hasClosedBtn="true"
            @callRemoveOption="removeOption"
          />
        </div>
        <div id="type" class="relative">
          <AppSelect
            v-model="params.type"
            :items="types"
            label="Type"
            item-title="name"
            item-value="id"
            form-id="type"
            placeholder="Select Type"
            clearable
            clear-icon="tabler-x"
          />
        </div>
        <div id="created_at">
          <DatePicker
            v-model="params.created_at"
            label="Date"
            placeholder="Select Date"
            :config="{ inline: true }"
          />
        </div>

        <div class="mt-4 flex justify-center">
          <VBtn :color="'warning'" @click="resetFilter">Drop Filter</VBtn>
          &nbsp;&nbsp;&nbsp;
          <VBtn class="flex" @click="filter">
            <LoadingIcon
              icon="tail-spin"
              color="white"
              class="w-4 h-4 m-auto"
              v-if="isLoading"
            />
            <span v-else>Ok</span>
          </VBtn>
        </div>
      </div>
    </VCard>
  </VDialog>
  <VDialog v-model="isOperatorPopup" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isOperatorPopup = false" />

    <VCard>
      <div class="p-4 mt-4">
        <div class="flex gap-2">
          <AppTextField
            type="text"
            v-model="params.search"
            placeholder="Search Operators"
            @keyup="onOperatorsSearch"
          />
        </div>
        <div class="mt-4">
          <div class="flex p-4" v-if="isLoadingOperator && !operators.length">
            <LoadingIcon
              icon="tail-spin"
              class="w-6 h-6 m-auto"
              color="orange"
            />
          </div>
          <div
            v-else-if="operators.length"
            class="flex flex-col gap-1 max-h-[400px] overflow-auto"
            :class="{
              'opacity-70 pointer-events-none':
                isLoadingOperator && operators.length,
            }"
          >
            <div
              v-for="operator in operators"
              style="padding-top: 5px; padding-bottom: 10px"
              :class="
                selectedOperator && selectedOperator.id == operator.id
                  ? 'border-b-2 border-on-primary'
                  : 'border-b-1'
              "
              class="relative items-center cursor-pointer"
              @click="onOperatorClick(operator)"
            >
              <p class="font-medium">
                {{ operator.name }}
              </p>
              <p class="capitalize">{{ operator.email }}</p>
            </div>
          </div>
          <div class="py-2 text-slate-400" v-else>No operator found</div>
          <div class="mt-4 flex m-auto" v-if="metaOperator">
            <Pagination
              @pageChanged="
                operatorParams.page = $event;
                getMerchantUsers();
              "
              :meta="metaOperator"
              class="w-full sm:w-auto sm:mr-auto"
            >
            </Pagination>
          </div>
        </div>
      </div>
    </VCard>
  </VDialog>
</template>
