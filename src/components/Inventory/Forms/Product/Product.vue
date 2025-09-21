<script setup lang="ts">
import { useInventoryMenu } from "@/stores/inventory-menu";
import ProductProvider from "./ProductProvider.vue";
import { Info, Details, Taxes, Discounts, Modifiers } from "./ProductTabs";
import { staticPrimaryColor } from "@/plugins/vuetify/theme";
import Lucide from "@/base-components/Lucide/Lucide.vue";

const tabs = ["Info", "Details", "Taxes", "Discounts", "Modifiers"];

const menuStore = useInventoryMenu();
const api = inject<any>("api");
const activeTabNumber = ref(0);
const initialData = ref<any>({});
const form = reactive<{
  [key: string]: any;
}>({});
const isLoading = reactive({
  initial: false,
  submitting: false,
});
const isAddNewPopupVisible = ref(false);

const getCreateProduct = async () => {
  isLoading.initial = true;
  try {
    const res = await api.inventory.product.getCreateProduct();
    initialData.value = await res?.data;

    if (await initialData.value?.taxes?.length) {
      initialData.value?.taxes.forEach((tax: any) => {
        if (tax?.enabled_by_default) {
          if (form?.taxes) {
            form.taxes.push(tax.id);
          } else {
            form.taxes = [tax.id];
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const getEditProduct = async (id: number) => {
  isLoading.initial = true;
  try {
    const res = await api.inventory.product.getEditProduct(id);
    initialData.value = await res?.data;
    const product = initialData.value?.product;

    if (product) {
      Object.keys(product).forEach((key: string) => {
        const isArray = Array.isArray(product[key]);
        if (isArray) {
          form[key] = product[key].map((obj: any) => obj?.id);
        } else {
          form[key] = product[key];
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const getInitialData = () => {
  if (menuStore.getIDToEdit) {
    getEditProduct(menuStore.getIDToEdit);
  } else {
    getCreateProduct();
  }
};

const activateTab = (tabNumber: number) => {
  activeTabNumber.value = tabNumber;
};

function goToSlide(right: boolean) {
  const slideNum = right ? 1 : -1;
  activeTabNumber.value += slideNum;
}

const onSubmit = async () => {
  isLoading.submitting = true;

  try {
    if (menuStore.getIDToEdit) {
      await api.inventory.product.editProduct(menuStore.getIDToEdit, form);
    } else {
      await api.inventory.product.createProduct(form);
    }

    menuStore.setIsPopupVisible(false);
    menuStore.setIsGetData();
  } catch (error) {
    console.log(error);
  }

  isLoading.submitting = false;
};

watch(
  () => menuStore.getIDToEdit,
  () => {
    getInitialData();
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="flex flex-col gap-4 mt-4">
    <div class="flex gap-2">
      <button
        type="button"
        v-for="(tab, index) in tabs"
        :key="tab"
        :class="[
          'text-sm relative after:absolute after:bg-primary after:h-[2px] after:bottom-[-2px] after:left-0 after:right-0 after:transition',
          index === activeTabNumber
            ? 'font-medium after:w-[full]'
            : 'after:w-0',
        ]"
        @click="activateTab(index)"
        :disabled="isLoading.initial"
      >
        {{ tab }}
      </button>
      <VBtn
        type="button"
        class="ml-auto"
        @click="isAddNewPopupVisible = true"
        v-if="['Discounts', 'Modifiers'].includes(tabs[activeTabNumber])"
      >
        <Lucide icon="Plus" class="w-4 h-4 mr-2" /> Add New
      </VBtn>
    </div>
    <form class="overflow-hidden" @submit.prevent="onSubmit">
      <div v-if="isLoading.initial">Loading...</div>
      <div
        class="flex relative min-h-[300px] slider-transition"
        :style="{
          transform: `translateX(-${activeTabNumber * 100}%)`,
        }"
        v-else
      >
        <ProductProvider :form="form" :initial-data="initialData">
          <div class="w-full absoluted slide top-0 bottom-0 left-0">
            <Info />
          </div>
          <div class="w-full absoluted slide top-0 bottom-0 left-[100%]">
            <Details />
          </div>
          <div class="w-full absoluted slide top-0 bottom-0 left-[200%]">
            <Taxes />
          </div>
          <div class="w-full absoluted slide top-0 bottom-0 left-[300%]">
            <Discounts />
          </div>
          <div class="w-full absoluted slide top-0 bottom-0 left-[400%]">
            <Modifiers />
          </div>
        </ProductProvider>
      </div>
    </form>

    <div class="mt-4 flex justify-between gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <button
            type="button"
            class="px-3 py-[2px] cursor-pointer border rounded-sm"
            :class="{
              '!border-[#FF6F61]': activeTabNumber,
            }"
            :disabled="isLoading.initial || !activeTabNumber"
            @click="goToSlide(false)"
          >
            <Arrow
              :color="staticPrimaryColor"
              class="w-4 h-4 rotate-[180deg]"
            />
          </button>
          <button
            type="button"
            class="px-3 py-[2px] cursor-pointer border rounded-sm"
            :class="{
              '!border-[#FF6F61]': activeTabNumber !== tabs.length - 1,
            }"
            :disabled="isLoading.initial || activeTabNumber === tabs.length - 1"
            @click="goToSlide(true)"
          >
            <Arrow :color="staticPrimaryColor" class="w-4 h-4" />
          </button>
        </div>
        <div class="flex justify-center gap-2 mt-1">
          <button
            type="button"
            v-for="(tab, index) in tabs"
            :key="tab"
            :class="[
              'w-2 h-2 rounded-full',
              index === activeTabNumber ? 'bg-[#444444]' : 'bg-[#B4B4B4]',
            ]"
            @click="activateTab(index)"
          ></button>
        </div>
      </div>
      <div>
        <VBtn
          class="px-10"
          @click="onSubmit"
          :disabled="isLoading.initial || isLoading.submitting"
          >{{ isLoading.submitting ? "Loading..." : "Save" }}</VBtn
        >
      </div>
    </div>
  </div>
  <VDialog v-model="isAddNewPopupVisible" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isAddNewPopupVisible = false" />

    <VCard>
      <div class="py-8 px-4">
        <h3 class="font-medium text-lg">
          Create
          {{ tabs[activeTabNumber] === "Discounts" ? "Discount" : "Modifier" }}
        </h3>

        <Discount v-if="tabs[activeTabNumber] === 'Discounts'" />
        <Modifier
          isInProduct
          @closePopup="(isAddNewPopupVisible = false), getInitialData()"
          v-if="tabs[activeTabNumber] === 'Modifiers'"
        />
      </div>
    </VCard>
  </VDialog>
</template>
<style scoped>
.slide {
  flex: 0 0 auto;
}

.slider-transition {
  transition: transform ease-in-out 0.5s;
}
</style>
