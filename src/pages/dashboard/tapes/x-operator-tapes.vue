<script setup lang="ts">
import Pagination from "@/base-components/Pagination/Pagination.vue";
import { useTapeMenu } from "@/stores/tapes-menu";
import { Toast } from "@/plugins/swal";
import LoadingIcon from "@/base-components/LoadingIcon";
import TapeList from "@/components/Tape/List.vue";

definePage({
  meta: {
    requiresAuth: true,
    layout: "side-menu",
    title: "X Tape Operator",
    permission: "view-x-tape_by_operator",
  },
});

const menuStore = useTapeMenu();
const api = inject<any>("api");
const isLoading = reactive({
  operators: false,
  tapes: false,
});
const selectedOperator = ref<any>(null);
const metaOperator = ref<any>(null);
const meta = ref<any>({});
const tapes = ref<any[]>([]);
const page = ref(1);
const limit = ref(5);
const operators = ref<any[]>([]);
const params = reactive({
  search: "",
  page: 1,
  limit: 6,
});

setPageTitle("X Tape Operator");

const openEditPopup = (id: number) => {
  menuStore.setIDToEdit(id);
  menuStore.setIsPopupVisible(true);
};

const onOperatorClick = async (operator: any) => {
  selectedOperator.value = operator;
};

const closePopup = () => {
  if (menuStore.getIsOperatorPopupVisible) {
    menuStore.setIsOperatorPopupVisible(false);
  } else {
    menuStore.setIsOperatorPopupVisible(true);
  }
};

const handleClickEvent = (e: MouseEvent) => {
  onOutsideClick(e, closePopup);
};

const getMerchantUsers = async () => {
  isLoading.operators = true;
  try {
    const res = await api.tape.getMerchantUsers({
      search: params.search,
      page: params.page,
      limit: params.limit,
    });
    operators.value = await res?.data?.data;
    metaOperator.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.operators = false;
};

getMerchantUsers();

const onOperatorsSearch = useDebounceFn(getMerchantUsers, 600);

const getTapes = async () => {
  isLoading.tapes = true;
  try {
    const search = menuStore.getSearchValue;
    const res = await api.tape.getXTapesByOperator(selectedOperator.value.id, {
      search: search,
      page: page.value,
      limit: limit.value,
    });
    tapes.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoading.tapes = false;
};

const nextPage = (pageNum: any) => {
  page.value = pageNum;
  getTapes();
};

const onSave = async () => {
  if (selectedOperator.value) {
    menuStore.setIsOperatorPopupVisible(false);
    getTapes();
  } else {
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Select operator first!</span>`,
    });
  }
};

watch(
  () => menuStore.getSearchValue,
  () => {
    if (selectedOperator.value) {
      getTapes();
    }
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
    :isLoading="isLoading.tapes"
    :metaObj="meta"
    @callNextPage="nextPage"
  ></TapeList>
  <VDialog v-model="menuStore.isOperatorPopupVisible" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="menuStore.setIsOperatorPopupVisible(false)" />

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
          <div class="flex p-4" v-if="isLoading.operators && !operators.length">
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
                isLoading.operators && operators.length,
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
                params.page = $event;
                getMerchantUsers();
              "
              :meta="metaOperator"
              class="w-full sm:w-auto sm:mr-auto"
            >
            </Pagination>
          </div>
          <div class="w-full flex">
            <VBtn
              :color="'primary'"
              type="button"
              class="text-white mt-3 w-[60%] mx-auto"
              @click="onSave"
              v-if="operators.length"
              >Save</VBtn
            >
          </div>
        </div>
      </div>
    </VCard>
  </VDialog>
</template>
