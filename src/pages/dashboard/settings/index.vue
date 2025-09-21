<script setup lang="ts">
import LoadingIcon from "@/base-components/LoadingIcon";
import { Toast } from "@/plugins/swal";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { useUserStore } from "@/stores/user";

definePage({
  meta: {
    requiresAuth: true,
    permission: "manage-pos-settings",
    title: "POS",
    layout: "side-menu",
  },
});

setPageTitle("POS Settings");

const mainScreens = ref<any>([]);
const printingReceipts = ref<any>([]);
const initialData = ref<any>({});
const form = reactive<any>({
  name: "", //pos
  main_screen: "categories", //pos
  automatic_show_modifiers_modal: false, // pos
  ask_for_pin_after_sale: false, // pos
  enable_loading_item_for_catalog: false, //feature
  multiple_discounts: false, //feature
  pre_check: false, //feature
  tips: false, //feature
  delivery_fees: false, //feature
  tax_exempt: false, //feature
  item_price_with_tax: false, //feature
  printing_receipts: "both", // receipts
  order_prefix: "", // order
  order_number_max_value: 1, // order
  partial_payment: false, // checkout
  ideal_timeout: "", // timeouts
  ideal_timeout_unit: "minutes", // timeouts
  sale_finish_timeout: 1, // timeout
  cancel_timeout: 1, // timeout
  shifts_cash_drawer: false, // peripheral devices
});

const idealTimeouts = [
  {
    id: 2,
    name: "2 Minutes",
  },
  {
    id: 5,
    name: "5 Minutes",
  },
  {
    id: 15,
    name: "15 Minutes",
  },
  {
    id: 30,
    name: "30 Minutes",
  },
  {
    id: 1,
    name: "1 Hours",
  },
  {
    id: 24,
    name: "24 Hours",
  },
];

const resetSettings = () => {
  isLoading.reset = true;
  form.name = ""; //pos
  form.main_screen = "categories"; //pos
  form.automatic_show_modifiers_modal = false; // pos
  form.ask_for_pin_after_sale = false; // pos
  form.enable_loading_item_for_catalog = false; //feature
  form.multiple_discounts = false; //feature
  form.pre_check = false; //feature
  form.tips = false; //feature
  form.delivery_fees = false; //feature
  form.tax_exempt = false; //feature
  form.item_price_with_tax = false; //feature
  form.printing_receipts = "both"; // receipts
  form.order_prefix = ""; // order
  form.order_number_max_value = 1; // order
  form.partial_payment = false; // checkout
  form.ideal_timeout = ""; // timeouts
  form.ideal_timeout_unit = "minutes"; // timeouts
  form.sale_finish_timeout = 1; // timeout
  form.cancel_timeout = 1; // timeout
  form.shifts_cash_drawer = false; // peripheral devices
  isLoading.reset = false;
  Toast.fire({
    icon: "success",
    padding: "10px",
    background: "#fff",
    html: `<span style="font-size:14px">Settings Reset Successfully!</span>`,
  });
};

const api = inject<any>("api");
const isLoading = reactive({
  initialData: false,
  submitting: false,
  reset: false,
});

const userStore = useUserStore();

const getSettings = async () => {
  isLoading.initialData = true;
  try {
    const res = await api.settings.pos.getSettings();
    initialData.value = await res?.data;
    mainScreens.value = initialData.value.mainScreens.map(function (obj: any) {
      return { key: obj.value, title: obj.name };
    });
    printingReceipts.value = initialData.value.printingReceiptTypes.map(
      function (obj: any) {
        return { key: obj.value, title: obj.name };
      }
    );
    const setting = await initialData.value?.setting;
    userStore.setPosSettings(setting);
    if (setting) {
      form.name = setting?.name;
      form.main_screen = setting?.main_screen;
      form.printing_receipts = setting?.printing_receipts;
      form.order_prefix = setting?.order_prefix;
      form.order_number_max_value = setting?.order_number_max_value;
      form.ideal_timeout = setting?.ideal_timeout;
      form.sale_finish_timeout = setting?.sale_finish_timeout;
      form.cancel_timeout = setting?.cancel_timeout;
      form.ask_for_pin_after_sale = Boolean(setting?.ask_for_pin_after_sale);
      form.automatic_show_modifiers_modal = Boolean(
        setting?.automatic_show_modifiers_modal
      );
      form.enable_loading_item_for_catalog = Boolean(
        setting?.enable_loading_item_for_catalog
      );
      form.pre_check = Boolean(setting?.pre_check);
      form.tips = Boolean(setting?.tips);
      form.delivery_fees = Boolean(setting?.delivery_fees);
      form.tax_exempt = Boolean(setting?.tax_exempt);
      form.item_price_with_tax = Boolean(setting?.item_price_with_tax);
      form.partial_payment = Boolean(setting?.partial_payment);
      form.multiple_discounts = Boolean(setting?.multiple_discounts);
      form.shifts_cash_drawer = Boolean(setting?.shifts_cash_drawer);
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initialData = false;
};

const toggleChange = (attribute: string) => {
  if (attribute == "ask_for_pin_after_sale") {
    form.ask_for_pin_after_sale = !form.ask_for_pin_after_sale;
  } else if (attribute == "automatic_show_modifiers_modal") {
    form.automatic_show_modifiers_modal = !form.automatic_show_modifiers_modal;
  } else if (attribute == "enable_loading_item_for_catalog") {
    form.enable_loading_item_for_catalog =
      !form.enable_loading_item_for_catalog;
  } else if (attribute == "pre_check") {
    form.pre_check = !form.pre_check;
  } else if (attribute == "tips") {
    form.tips = !form.tips;
  } else if (attribute == "delivery_fees") {
    form.delivery_fees = !form.delivery_fees;
  } else if (attribute == "tax_exempt") {
    form.tax_exempt = !form.tax_exempt;
  } else if (attribute == "item_price_with_tax") {
    form.item_price_with_tax = !form.item_price_with_tax;
  } else if (attribute == "partial_payment") {
    form.partial_payment = !form.partial_payment;
  } else if (attribute == "multiple_discounts") {
    form.multiple_discounts = !form.multiple_discounts;
  } else if (attribute == "shifts_cash_drawer") {
    form.shifts_cash_drawer = !form.shifts_cash_drawer;
  }
  removeError(attribute);
};

const onSubmit = async () => {
  isLoading.submitting = true;
  try {
    if (form.ideal_timeout == 1 || form.ideal_timeout == 24) {
      form.ideal_timeout_unit = "hours";
    }
    await api.settings.pos.updateSettings(form);

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Settings Updated Successfully!</span>`,
    });

    getSettings();
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

getSettings();
</script>
<template>
  <VCard max-height="640" class="d-flex flex-column">
    <div class="bg-[#fafafa] px-4 py-1">
      <h3 class="font-medium text-lg text-center">Pos Settings</h3>
    </div>
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <div>
        <section class="p-4 bg-white pr-1">
          <div
            class="flex p-4"
            v-if="isLoading.initialData && !initialData?.setting"
          >
            <LoadingIcon
              icon="tail-spin"
              class="w-6 h-6 m-auto"
              color="orange"
            />
          </div>
          <div
            :class="{
              'opacity-70': isLoading.initialData && initialData,
            }"
            v-else
          >
            <div class="flex flex-col" style="height: 550px !important">
              <div class="flex flex-col gap-4 py-2">
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 7px;
                    font-weight: bold;
                    margin-left: -16px;
                    margin-right: -4px;
                  "
                >
                  Pos
                </div>
                <div id="name">
                  <AppTextField
                    type="text"
                    v-model="form.name"
                    label="Name"
                    placeholder="Name"
                    :isRequired="true"
                  />
                </div>
                <div id="main_screen" class="flex flex-col gap-1">
                  <label for="main_screen">Default Main Screen</label>
                  <div
                    class="grid grid-cols-2 p-1 bg-[#ffffff]"
                    id="main_screen"
                  >
                    <button
                      class="p-2 rounded text-black"
                      :class="
                        form.main_screen === screen.key
                          ? 'bg-primary text-white'
                          : 'bg-[#f5f5f5] text-black'
                      "
                      v-for="screen in mainScreens"
                      :key="screen.key"
                      @click="form.main_screen = screen.key"
                    >
                      {{ screen.title }}
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div class="flex flex-col" id="ask_for_pin_after_sale">
                      <label class="text-base" for="ask_for_pin_after_sale1"
                        >Ask For Pin After Sale</label
                      >
                      <span class="text-slate-300 text-xs">
                        Ask for operator authorization after sale is finished.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('ask_for_pin_after_sale')"
                        class="cursor-pointer"
                        v-model="form.ask_for_pin_after_sale"
                        id="ask_for_pin_after_sale1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div
                      class="flex flex-col"
                      id="automatic_show_modifiers_modal"
                    >
                      <label
                        class="text-base"
                        for="automatic_show_modifiers_modal1"
                        >Show Added Items Modifiers</label
                      >
                      <span class="text-slate-300 text-xs">
                        Automatically shows modifiers selections screen if added
                        to card item has ones.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('automatic_show_modifiers_modal')"
                        class="cursor-pointer"
                        v-model="form.automatic_show_modifiers_modal"
                        id="automatic_show_modifiers_modal1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 7px;
                    font-weight: bold;
                    margin-left: -16px;
                    margin-right: -4px;
                  "
                >
                  Features
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div
                      class="flex flex-col"
                      id="enable_loading_item_for_catalog"
                    >
                      <label
                        class="text-base"
                        for="enable_loading_item_for_catalog1"
                        >Catalog</label
                      >
                      <span class="text-slate-300 text-xs">
                        Enable loading item for catalog.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('enable_loading_item_for_catalog')"
                        class="cursor-pointer"
                        v-model="form.enable_loading_item_for_catalog"
                        id="enable_loading_item_for_catalog1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div class="flex flex-col" id="multiple_discounts">
                      <label class="text-base" for="multiple_discounts1"
                        >Multiple Discounts</label
                      >
                      <span class="text-slate-300 text-xs">
                        Allow to select several discount for Order/Item.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('multiple_discounts')"
                        class="cursor-pointer"
                        v-model="form.multiple_discounts"
                        id="multiple_discounts1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div class="flex flex-col" id="pre_check">
                      <label class="text-base" for="pre_check1"
                        >Pre Check</label
                      >
                      <span class="text-slate-300 text-xs">
                        Allow registers to print precheck.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('pre_check')"
                        class="cursor-pointer"
                        v-model="form.pre_check"
                        id="pre_check1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div class="flex flex-col" id="tips">
                      <label class="text-base" for="tips1">Tips</label>
                      <span class="text-slate-300 text-xs">
                        Allow to add tips during payment process.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('tips')"
                        class="cursor-pointer"
                        v-model="form.tips"
                        id="tips1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div class="flex flex-col" id="delivery_fees">
                      <label class="text-base" for="delivery_fees1"
                        >Delivery Fees</label
                      >
                      <span class="text-slate-300 text-xs">
                        Allow delivery fees.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('delivery_fees')"
                        class="cursor-pointer"
                        v-model="form.delivery_fees"
                        id="delivery_fees1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div class="flex flex-col" id="tax_exempt">
                      <label class="text-base" for="tax_exempt1"
                        >Tax Exempt</label
                      >
                      <span class="text-slate-300 text-xs">
                        If tax exemption operation available or not.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('tax_exempt')"
                        class="cursor-pointer"
                        v-model="form.tax_exempt"
                        id="tax_exempt1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div class="flex flex-col" id="item_price_with_tax">
                      <label class="text-base" for="item_price_with_tax1"
                        >Item Price With Tax</label
                      >
                      <span class="text-slate-300 text-xs">
                        Show item price in cart with tax or not.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('item_price_with_tax')"
                        class="cursor-pointer"
                        v-model="form.item_price_with_tax"
                        id="item_price_with_tax1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 7px;
                    font-weight: bold;
                    margin-left: -16px;
                    margin-right: -4px;
                  "
                >
                  Receipts
                </div>
                <div id="printing_receipts" class="flex flex-col gap-1">
                  <label for="printing_receipts">Printing Receipts</label>
                  <div
                    class="grid grid-cols-4 p-1 bg-[#fafafa]"
                    id="printing_receipts"
                  >
                    <button
                      class="p-2 rounded text-black"
                      :class="
                        form.printing_receipts === print.key
                          ? 'bg-primary text-white'
                          : 'bg-[#f5f5f5] text-black'
                      "
                      v-for="print in printingReceipts"
                      :key="print.key"
                      @click="form.printing_receipts = print.key"
                    >
                      {{ print.title }}
                    </button>
                  </div>
                </div>
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 7px;
                    font-weight: bold;
                    margin-left: -16px;
                    margin-right: -4px;
                  "
                >
                  Order
                </div>
                <div id="order_prefix">
                  <AppTextField
                    type="text"
                    v-model="form.order_prefix"
                    label="Order Prefix"
                    placeholder="Order Prefix"
                    :isRequired="true"
                  />
                </div>
                <div id="order_number_max_value">
                  <AppTextField
                    v-model="form.order_number_max_value"
                    label="Order Number Max Value"
                    placeholder="Order Number Max Value"
                    type="number"
                    :min="0"
                  />
                </div>
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 7px;
                    font-weight: bold;
                    margin-left: -16px;
                    margin-right: -4px;
                  "
                >
                  Checkout
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div class="flex flex-col" id="partial_payment">
                      <label class="text-base" for="partial_payment1"
                        >Partial Payment</label
                      >
                      <span class="text-slate-300 text-xs">
                        Enable partial payment option.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('partial_payment')"
                        class="cursor-pointer"
                        v-model="form.partial_payment"
                        id="partial_payment1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 7px;
                    font-weight: bold;
                    margin-left: -16px;
                    margin-right: -4px;
                  "
                >
                  Timeouts
                </div>
                <div id="ideal_timeout">
                  <AppSelect
                    @update:model-value="removeError('ideal_timeout')"
                    v-model="form.ideal_timeout"
                    :items="idealTimeouts"
                    label="Ideal Timeout"
                    item-title="name"
                    item-value="id"
                    form-id="ideal_timeout"
                    placeholder="Select Ideal Timeout"
                    :isRequired="true"
                  />
                </div>
                <div id="sale_finish_timeout">
                  <AppTextField
                    v-model="form.sale_finish_timeout"
                    label="Sale Finish Timeout"
                    placeholder="Sale Finish Timeout"
                    type="number"
                    :min="0"
                  />
                </div>
                <div id="cancel_timeout">
                  <AppTextField
                    v-model="form.cancel_timeout"
                    label="Timeout operation of Canceling transaction"
                    placeholder="Timeout operation of Canceling transaction"
                    type="number"
                    :min="0"
                  />
                </div>
                <div
                  style="
                    background-color: #e5e7eb;
                    padding: 7px;
                    font-weight: bold;
                    margin-left: -16px;
                    margin-right: -4px;
                  "
                >
                  Peripheral Devices
                </div>
                <div class="form-group">
                  <div class="flex justify-between">
                    <div class="flex flex-col" id="shifts_cash_drawer">
                      <label class="text-base" for="shifts_cash_drawer1"
                        >Shifts / Cash Drawer</label
                      >
                      <span class="text-slate-300 text-xs">
                        Allow to use cash drawer and shifts.
                      </span>
                    </div>
                    <div>
                      <VSwitch
                        @click="toggleChange('shifts_cash_drawer')"
                        class="cursor-pointer"
                        v-model="form.shifts_cash_drawer"
                        id="shifts_cash_drawer1"
                        color="success"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PerfectScrollbar>
    <div class="gap-4" style="float: left; padding: 4px 10px 7px 15px">
      <VBtn
        class="w-[25%] mx-auto"
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
        class="w-[25%] mx-auto bg-gray"
        @click="resetSettings"
        :disabled="isLoading.reset"
      >
        <LoadingIcon
          icon="tail-spin"
          class="w-4 h-4"
          color="white"
          v-if="isLoading.reset"
        />
        <span v-else>Reset</span>
      </VBtn>
    </div>
  </VCard>
</template>
<style>
.bg-gray {
  background-color: gray !important;
}
</style>
