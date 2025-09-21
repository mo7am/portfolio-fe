<script setup lang="ts">
import LoadingIcon from "@/base-components/LoadingIcon";
import Lucide from "@/base-components/Lucide";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import type { Discount } from "@/types/inventory";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";

const props = defineProps<{
  preSelectedDiscounts: Discount[];
}>();
const emit = defineEmits(["setDiscounts"]);

const api = inject<any>("api");
const isLoading = ref(false);
const allDiscounts = ref<Discount[]>([]);
const meta = ref<any>({});
const params = reactive({
  search: "",
  page: 1,
  limit: 5,
  sorting: "asc",
});
const dialogsData = reactive({
  selectPreview: false,
  discountPreview: false,
  discountIdToEdit: 0,
});
const selectedDiscounts = ref<Record<number, Discount>>({});
const removedDiscounts = ref<Record<number, boolean>>({});
const unselectedDiscounts = ref<Record<number, boolean>>({});

const getAllDiscounts = async () => {
  isLoading.value = true;
  try {
    const res = await api.inventory.settings.getAllCartDiscounts(params);
    allDiscounts.value = await res?.data?.data;
    meta.value = await res?.data?.meta;
  } catch (error) {
    console.error(error);
  }
  isLoading.value = false;
};

const initializeSelectedDiscounts = () => {
  props.preSelectedDiscounts.forEach((discount) => {
    selectedDiscounts.value[discount.id] = {
      ...discount,
      pre_selected: true,
    };
  });

  unselectedDiscounts.value = {};
};

const onDiscountClick = (discount: Discount) => {
  if (selectedDiscounts.value[discount.id]) {
    delete selectedDiscounts.value[discount.id];
    removedDiscounts.value[discount.id] = true;
    if (discount?.pre_selected) {
      unselectedDiscounts.value[discount.id] = true;
    }
  } else {
    selectedDiscounts.value[discount.id] = discount;
    delete removedDiscounts.value[discount.id];
    delete unselectedDiscounts.value[discount.id];
  }
};

const onSave = (isOpenPopup: boolean) => {
  const selectedIDs = Object.keys(selectedDiscounts.value).map(Number);
  const removedIDs = Object.keys(removedDiscounts.value).map(Number);
  const unselectedIDs = Object.keys(unselectedDiscounts.value).map(Number);
  console.log(unselectedIDs);
  removedIDs.forEach((id) => {
    const index = props.preSelectedDiscounts.findIndex((d) => d.id === id);
    if (index > -1) props.preSelectedDiscounts.splice(index, 1);
  });

  selectedIDs.forEach((id) => {
    const discount = selectedDiscounts.value[id];
    const index = props.preSelectedDiscounts.findIndex((d) => d.id === id);
    if (index > -1) {
      props.preSelectedDiscounts[index] = discount;
    } else {
      props.preSelectedDiscounts.push(discount);
    }
  });
  emit("setDiscounts", selectedIDs, "discounts");
  emit("setDiscounts", unselectedIDs, "unselected_discounts");
  removedDiscounts.value = {};
  if (!isOpenPopup) {
    dialogsData.selectPreview = false;
  }
};

const deselectDiscount = (discount: Discount, isOpenPopup: boolean) => {
  onDiscountClick(discount);
  onSave(isOpenPopup);
};

const onDiscountsSearch = useDebounceFn(getAllDiscounts, 600);

const onSubmittedDiscountReq = (updated_discount: Discount) => {
  if (!dialogsData.discountIdToEdit) {
    getAllDiscounts();
  } else {
    const index = props.preSelectedDiscounts.findIndex(
      (d) => d.id === updated_discount.id
    );
    if (index > -1) {
      props.preSelectedDiscounts[index] = updated_discount;
    }
  }
  dialogsData.discountIdToEdit = 0;
  dialogsData.discountPreview = false;
};

const onDiscountEdit = (id: number) => {
  dialogsData.discountIdToEdit = id;
  dialogsData.discountPreview = true;
};

watch(() => props.preSelectedDiscounts, initializeSelectedDiscounts);

onMounted(() => {
  initializeSelectedDiscounts();
});
</script>

<template>
  <div class="flex flex-col">
    <div class="bg-[#fafafa] px-4 py-1">
      <h3 class="font-medium text-lg text-center">Apply Card Discounts</h3>
    </div>
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <div
        v-if="preSelectedDiscounts.length"
        class="flex flex-col gap-1 py-2 max-h-[250px]"
        style="padding-right: 0.8rem !important"
      >
        <DiscountSetting
          :discount="discount"
          :isSelected="true"
          @deselectDiscount="deselectDiscount"
          @editDiscountClick="onDiscountEdit"
          v-for="discount in preSelectedDiscounts"
          :key="discount.id"
        />
      </div>
      <div v-else class="py-2 text-slate-400">No Discounts Selected</div>
    </PerfectScrollbar>
    <VBtn
      type="button"
      variant="text"
      class="flex justify-start items-center px-0 py-2"
      @click="(dialogsData.selectPreview = true), getAllDiscounts()"
    >
      <Lucide icon="Plus" class="w-6 h-6 mr-1" /> Edit Selected Discounts
    </VBtn>

    <VDialog v-model="dialogsData.selectPreview" width="500">
      <DialogCloseBtn @click="dialogsData.selectPreview = false" />
      <VCard>
        <div class="p-4 mt-4">
          <div class="flex gap-2">
            <AppTextField
              type="text"
              v-model="params.search"
              placeholder="Search Discounts"
              @keyup="onDiscountsSearch"
            />
            <VBtn @click="dialogsData.discountPreview = true">
              <Lucide icon="Plus" class="w-6 h-6 text-white" />
            </VBtn>
          </div>
          <div class="mt-4">
            <div class="flex p-4" v-if="isLoading && !allDiscounts.length">
              <LoadingIcon
                icon="tail-spin"
                class="w-6 h-6 m-auto"
                color="orange"
              />
            </div>
            <div
              v-else-if="allDiscounts.length"
              class="flex flex-col gap-1 max-h-[400px] overflow-auto"
              :class="{
                'opacity-70 pointer-events-none':
                  isLoading && allDiscounts.length,
              }"
            >
              <DiscountSetting
                :discount="discount"
                :isInPopup="true"
                :isSelected="!!selectedDiscounts[discount.id]"
                @deselectDiscount="deselectDiscount"
                @editDiscountClick="onDiscountEdit"
                :key="discount.id"
                v-for="discount in allDiscounts"
              />
            </div>
            <div class="py-2 text-slate-400" v-else>No Discounts found</div>
            <div class="mt-4 flex m-auto" v-if="meta">
              <Pagination
                @pageChanged="
                  params.page = $event;
                  getAllDiscounts();
                "
                :meta="meta"
                class="w-full sm:w-auto sm:mr-auto"
              >
              </Pagination>
            </div>
            <div class="w-full flex">
              <VBtn
                type="button"
                class="mt-3 w-[60%] mx-auto"
                @click="onSave(false)"
                v-if="allDiscounts.length"
                >Save</VBtn
              >
            </div>
          </div>
        </div>
      </VCard>
    </VDialog>

    <VDialog v-model="dialogsData.discountPreview" width="500">
      <DialogCloseBtn @click="dialogsData.discountPreview = false" />
      <VCard>
        <div class="py-8 px-4">
          <h3 class="font-medium text-lg">
            {{ dialogsData.discountIdToEdit ? "Edit" : "Create" }}
            Discount
          </h3>
          <Discount
            :idToEdit="dialogsData.discountIdToEdit"
            :isInSettings="true"
            @submitted="onSubmittedDiscountReq"
          />
        </div>
      </VCard>
    </VDialog>
  </div>
</template>
