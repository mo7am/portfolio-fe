<script setup lang="ts">
import LoadingIcon from "@/base-components/LoadingIcon";
import { Toast } from "../../plugins/swal";
import type { SettingsForm } from "@/types/inventory";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
const businessTypes = [
  {
    key: "retail",
    title: "Retail",
  },
  {
    key: "restaurant",
    title: "Restaurant",
  },
  {
    key: "schedule",
    title: "Schedule",
  },
];

const percentage = ref();

const api = inject<any>("api");
const isLoading = reactive({
  initialData: false,
  submitting: false,
  reset: false,
  adjust: false,
});
const data = ref<any>({});
const activeCartDiscounts = ref<any>([]);
const form = reactive<SettingsForm>({
  name: "",
  business_type: "retail",
  allow_double_discount: false,
  discounts: [],
  unselected_discounts: [],
});
const preSelectedDiscountsIds = ref<number[]>([]);
const reset_discounts = ref<number[]>([]);

const adjustPrices = async () => {
  isLoading.adjust = true;
  try {
    const res = await api.inventory.settings.adjustAllPrices(
      Number(percentage.value)
    );
    percentage.value = "";
    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Prices Adjusted Successfully!</span>`,
    });
  } catch (error) {
    console.log(error);
  }
  isLoading.adjust = false;
};

const getGeneralSettings = async () => {
  isLoading.initialData = true;
  try {
    const res = await api.inventory.settings.getGeneralSettings();
    data.value = await res?.data;
    const setting = await data.value?.setting;
    if (setting) {
      form.name = setting?.name;
      form.allow_double_discount = Boolean(setting?.allow_double_discount);
      form.business_type = setting.business_type;
      form.discounts = [];
      form.unselected_discounts = [];
      preSelectedDiscountsIds.value = [];
    }

    if (data.value?.activeCartDiscounts?.length) {
      activeCartDiscounts.value = data.value?.activeCartDiscounts;
      data.value?.activeCartDiscounts.forEach((discount: any) => {
        preSelectedDiscountsIds.value.push(discount.id);
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initialData = false;
};

const onSubmit = async () => {
  console.log(form);
  isLoading.submitting = true;
  try {
    const res = await api.inventory.settings.updateSettings(form);

    form.discounts = [];
    form.unselected_discounts = [];

    data.value = await res?.data;
    const setting = await data.value?.setting;
    if (setting) {
      form.name = setting?.name;
      form.allow_double_discount = Boolean(setting?.allow_double_discount);
      form.business_type = setting.business_type;
      form.discounts = [];
      form.unselected_discounts = [];
      preSelectedDiscountsIds.value = [];
    }

    if (data.value?.activeCartDiscounts?.length) {
      data.value?.activeCartDiscounts.forEach((discount: any) => {
        preSelectedDiscountsIds.value.push(discount.id);
      });
    }

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Settings Updated Successfully!</span>`,
    });
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

const onSwitchClick = () => {
  form.allow_double_discount = !form.allow_double_discount;
};

const setDiscounts = (
  arr: number[],
  arrKey: "discounts" | "unselected_discounts"
) => {
  if (arrKey === "discounts") {
    if (reset_discounts.value.length > 0) {
      reset_discounts.value = reset_discounts.value.filter(
        (id) => !arr.includes(id)
      );
    }
    arr = arr.filter((id) => !preSelectedDiscountsIds.value.includes(id));
  }

  if (arrKey === "unselected_discounts" && reset_discounts.value.length > 0) {
    reset_discounts.value = reset_discounts.value.filter((id) =>
      preSelectedDiscountsIds.value.includes(id)
    );
    arr = mergeAndRemoveDuplicates(reset_discounts.value, arr);
  }

  // console.log(arr);

  form[arrKey] = [];
  arr.forEach((id: number, index: number) => {
    form[arrKey][index] = id;
  });
};

function mergeAndRemoveDuplicates(arr1: number[], arr2: number[]) {
  const map = new Map();

  arr1.forEach((item) => map.set(item, true));
  arr2.forEach((item) => map.set(item, true));

  return Array.from(map.keys());
}

const delayReset = () => {
  isLoading.initialData = false;
  Toast.fire({
    icon: "success",
    padding: "10px",
    background: "#fff",
    html: `<span style="font-size:14px">Settings Reset Successfully!</span>`,
  });
};

const resetSettings = () => {
  reset_discounts.value = activeCartDiscounts.value.map(
    (discount: any) => discount.id
  );

  isLoading.initialData = true;

  data.value = {};
  data.value.activeCartDiscounts = [];
  // preSelectedDiscountsIds.value = [];
  form.name = "";
  form.business_type = "retail";
  form.allow_double_discount = false;
  form.discounts = [];
  percentage.value = "";
  setTimeout(delayReset, 900);
};

getGeneralSettings();
</script>

<template>
  <div>
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <section
        class="p-4 bg-white max-h-[530px] pr-1"
        style="padding-right: 0.8rem !important"
      >
        <div class="flex p-4" v-if="isLoading.initialData && !data?.setting">
          <LoadingIcon icon="tail-spin" class="w-6 h-6 m-auto" color="orange" />
        </div>
        <div
          :class="{
            'opacity-70': isLoading.initialData && data,
          }"
          v-else
        >
          <div class="flex flex-col">
            <div class="bg-[#fafafa] px-4 py-1">
              <h3 class="font-medium text-lg text-center">General</h3>
            </div>
            <div class="flex flex-col gap-4 py-2">
              <div id="name">
                <AppTextField
                  type="text"
                  v-model="form.name"
                  label="Name"
                  placeholder="Name"
                  :isRequired="true"
                />
              </div>
              <div id="business_type" class="flex flex-col gap-2">
                <label for="business_type">Business Type</label>
                <div
                  class="grid grid-cols-3 p-1 bg-[#fafafa]"
                  id="business_type"
                >
                  <button
                    v-for="type in businessTypes"
                    class="p-2 rounded text-black"
                    :class="
                      form.business_type === type.key
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-primary'
                    "
                    :key="type.key"
                    @click="form.business_type = type.key"
                  >
                    {{ type.title }}
                  </button>
                </div>
              </div>
              <div>
                <div class="flex justify-between">
                  <label class="text-base" for="allow_double_discount"
                    >Allow Double Discount</label
                  >
                  <div>
                    <VSwitch
                      v-model="form.allow_double_discount"
                      id="allow_double_discount"
                      color="success"
                      @click="onSwitchClick"
                      class="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <VForm
                v-can="'adjust-all-prices-setting'"
                @submit.prevent="adjustPrices"
                ref="formRef"
                class="grid sm:grid-cols-2 gap-4"
              >
                <div id="adjust_prices_percentage">
                  <AppTextField
                    type="number"
                    :min="-10"
                    :max="10"
                    v-model="percentage"
                    label="Percent"
                    placeholder="0.00"
                  />
                </div>

                <VBtn
                  type="button"
                  class="sm:mt-[30px] sm:!h-[40px]"
                  @click="adjustPrices"
                >
                  <LoadingIcon
                    icon="tail-spin"
                    class="w-4 h-4"
                    color="white"
                    v-if="isLoading.adjust"
                  />
                  <span v-else>Adjust All Prices</span>
                </VBtn>
              </VForm>
            </div>
          </div>
          <GeneralDiscountsSettings
            :preSelectedDiscounts="data?.activeCartDiscounts || {}"
            @setDiscounts="setDiscounts"
          />
        </div>
      </section>
    </PerfectScrollbar>
    <div
      v-if="!isLoading.initialData"
      class="gap-4"
      style="float: left; padding: 4px 10px 7px 15px"
    >
      <VBtn
        class="w-[50%] mx-auto mt-4"
        @click="onSubmit"
        :disabled="isLoading.initialData || isLoading.submitting"
      >
        <LoadingIcon
          icon="tail-spin"
          class="w-4 h-4"
          color="white"
          v-if="isLoading.submitting"
        />
        <span v-else>Save</span>
      </VBtn>
      &nbsp;&nbsp;
      <VBtn
        style="margin-top: 15px"
        class="w-[25%] mx-auto bg-gray"
        @click="resetSettings"
      >
        Reset
      </VBtn>
    </div>
  </div>
</template>
<style>
.bg-gray {
  background-color: gray !important;
}
</style>
