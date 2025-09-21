<script lang="ts" setup>
import OrderLists from "@/components/Inventory/Lists/Order/lists.vue";
import ReceiptFields from "@/components/Inventory/Lists/Order/receipt-field/index.vue";
import RefundReceiptFields from "@/components/PosSettings/Forms/Receipt/RefundReceiptFields.vue";
import { staticPrimaryColor } from "@/plugins/vuetify/theme";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import LoadingIcon from "@/base-components/LoadingIcon";
import DatePicker from "@/base-components/DatePicker";
import { useUserStore } from "@/stores/user";
import Customer from "@/components/Customer/index.vue";
import Field from "@/components/Inventory/Lists/Order/receipt-field/field.vue";
import NumPad from "@/components/PosSettings/Forms/Preset/NumPad.vue";
import CustomCheckbox from "@/base-components/CustomCheckbox";
import Pagination from "@/base-components/Pagination/Pagination.vue";
import type { CustomInputContent } from "@core/types";
import { Toast } from "@/plugins/swal";
import placeholder from "@/assets/images/placeholder.png";

definePage({
  meta: {
    requiresAuth: true,
    permission: "",
  },
});

const props = defineProps({
  order: {
    type: String,
    default: "view-order",
  },
});

const userStore = useUserStore();

const windowSize = ref(window.innerWidth);
window.addEventListener("resize", () => {
  windowSize.value = window.innerWidth;
});

const radioContent: CustomInputContent[] = [
  {
    title: "Credit",
    value: "credit",
  },
  {
    title: "Cash",
    value: "cash",
  },
  {
    title: "Debit",
    value: "debit",
  },
];

const apiName: string = import.meta.env.VITE_API_APP_NAME;
document.title = apiName + " | Order Transactions";

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false);
const refLoadingIndicator = ref<any>(null);
const isViewReceiptsPopup = ref(false);
const isPrintReceiptsPopup = ref(false);
const isRefundPopup = ref(false);
const isViewRefundReceiptPopup = ref(false);
const next = ref(1);

// watching if the fallback state is active and the refLoadingIndicator component is available
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
const orders = ref<any[]>([]);
const receipts = ref<any>();
const currentOrder = ref<any>(null);
const currentTransaction = ref<any>(null);
const meta = ref<any>(null);
const subtotalItems = ref<any>(0);
const totalItemsAmounts = ref<any>(0);
const posSetting = userStore.getPosSettings;
const is_customer = ref(false);
const is_merchant = ref(false);
const is_terminal = ref(false);
const is_kitchen_bar = ref(false);

const reasonMeta = ref<any>(null);
const selectedReason = ref<any>({});
const isLoadingReasons = ref<any>(false);
const isAddReasonPopup = ref<any>(false);
const reasonErrors = ref<any>("");
const itemsError = ref<any>("");
const amountError = ref<any>("");
const totalItemAmount = ref<any>(0);
const orderDiscountSum = ref<any>(0);
const currentSelectedItemDiscounts = ref<any>(0);
const currentOrderDiscountAmounts = ref<any>(0);
const totalRefundPaymentAmount = ref<any>(0);
const totalOrderAmount = ref<any>(0);
const reasons = ref<any[]>([]);
const reasonParams = ref<any>({
  search: "",
  limit: 3,
  page: 1,
});

const params = ref<any>({
  search: "",
  total_price: "",
  customer_id: "",
  tpn: "",
  transaction_id: "",
  exact_date: "",
  id: "", //order id
  customer_name: "",
  limit: 5,
  page: 1,
});

const refundTypes = [
  {
    key: "items",
    title: "Items",
  },
  {
    key: "amount",
    title: "Amount",
  },
];

const refundForm = reactive<any>({
  is_discounts: true,
  is_taxes: true,
  is_delivery_fees: false,
  refund_type: "items",
  amount: 0,
  items: [],
  is_save_reason_in_list: false,
  refund_reason: "",
  payment_method: "cash",
});

const resetRefundForm = () => {
  refundForm.is_discounts = true;
  refundForm.is_taxes = true;
  refundForm.is_delivery_fees = false;
  refundForm.refund_type = "items";
  refundForm.amount = 0;
  refundForm.items = [];
  refundForm.is_save_reason_in_list = false;
  refundForm.refund_reason = "";
  refundForm.payment_method = "cash";
  selectedItems.value = [];
  selectedReason.value = {};
  totalItemAmount.value = 0;
  totalItemsAmounts.value = 0;
};

const isLoading = ref<any>(false);
const isLoadingFields = ref<any>(false);
const isEmptyParameters = ref<any>(false);
const isShowMore = ref<any>(false);
const isOpenFilter = ref<any>(false);
const isLoadingFilter = ref<any>(false);
const isLoadingRefund = ref<any>(false);
const isOpenCustomerPopup = ref<any>(false);
const selectedItems = ref<any[]>([]);

const getReasons = async () => {
  isLoadingReasons.value = true;
  try {
    const res = await api.order.getReasons(reasonParams.value);
    reasons.value = await res?.data?.data;
    reasonMeta.value = await res?.data?.meta;
  } catch (error) {
    console.log(error);
  }
  isLoadingReasons.value = false;
};

const onSaveAmount = async (data: any) => {
  if (parseFloat(data.amount) <= totalOrderAmount.value) {
    amountError.value = "";
    refundForm.amount = data.amount;
  } else {
    amountError.value =
      "The Amount field should be less than or equal $" +
      totalOrderAmount.value.toFixed(2) +
      ".";
  }
};

const closeViewRefundReceiptPopup = async () => {
  isViewRefundReceiptPopup.value = false;
};

const refund = async () => {
  isLoadingRefund.value = true;
  try {
    if (refundForm.items.length > 0) {
      refundForm.amount = 0;
    }
    const res = await api.order.refund(currentOrder.value.id, refundForm);
    if (res) {
      getOrders(false, false);
      selectCurrentOrder(res.data.data);
      isRefundPopup.value = false;
      openViewRefundReceipt(res.data.data.payments.pop());
      resetRefundForm();
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span style="font-size:14px">${"Order refunded successfully"}</span>`,
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoadingRefund.value = false;
};

const onReasonsSearch = useDebounceFn(getReasons, 600);

const isItemSelected = (id: number) => {
  return !!refundForm?.items?.includes(id);
};

const isAllItemSelected = (orderItems: any) => {
  let numOfSelectedItems = 0;

  orderItems.forEach((orderItem: any) => {
    if (refundForm?.items.includes(orderItem.id)) {
      numOfSelectedItems++;
    }
  });
  return numOfSelectedItems === orderItems.length;
};

const addReasonPopup = () => {
  isAddReasonPopup.value = true;
  selectedReason.value = {};
  refundForm.refund_reason = "";
};

const saveReason = () => {
  if (refundForm.refund_reason == "") {
    reasonErrors.value = "Reason field is required.";
  } else {
    reasonErrors.value = "";
    isAddReasonPopup.value = false;
  }
};

const changeRefundType = (type: any) => {
  refundForm.refund_type = type;
  if (type == "items") {
    refundForm.items = [];
    selectedItems.value = [];
    selectedReason.value = {};
    totalItemAmount.value = 0;
    itemsError.value = "";
    amountError.value = "";

    totalOrderAmount.value = parseFloat(
      (
        currentOrder.value.total_price +
        currentOrderDiscountAmounts.value +
        currentSelectedItemDiscounts.value -
        currentOrder.value.tip_amount -
        totalRefundPaymentAmount.value
      ).toFixed(2)
    );
  } else {
    totalOrderAmount.value = parseFloat(
      (
        currentOrder.value.total_price -
        currentOrder.value.tip_amount -
        totalRefundPaymentAmount.value
      ).toFixed(2)
    );
  }
  refundForm.amount = totalOrderAmount.value;
};

const setDiscount = () => {
  refundForm.is_discounts = !refundForm.is_discounts;
  if (selectedItems.value.length > 0) {
    let itemDiscounts = 0;
    let selectedItemDiscounts = 0;
    let orderDiscountAmounts = 0;
    let allDiscount =
      currentOrder.value.total_order_discount +
      currentOrder.value.total_items_discount;
    currentOrder.value.orderItems.forEach((item: any) => {
      itemDiscounts +=
        item.total_discount_applied + item.order_discount_applied;
    });

    selectedItemDiscounts = selectedItems.value.reduce(
      (accumulator: any, item: any) =>
        accumulator +
        (item.total_discount_applied + item.order_discount_applied),
      0
    );

    let orderDiscount = allDiscount - itemDiscounts;
    if (orderDiscount > 0) {
      selectedItems.value.forEach((item: any) => {
        orderDiscountAmounts +=
          ((item.subtotal + item.order_discount_applied) /
            totalItemsAmounts.value) *
          orderDiscount;
      });
    }
    if (refundForm.is_discounts) {
      totalItemAmount.value -= parseFloat(
        (selectedItemDiscounts + orderDiscountAmounts).toFixed(2)
      );
    } else {
      totalItemAmount.value += parseFloat(
        (selectedItemDiscounts + orderDiscountAmounts).toFixed(2)
      );
    }
  }
  removeError("is_discounts");
};

const setTax = () => {
  refundForm.is_taxes = !refundForm.is_taxes;
  if (selectedItems.value.length > 0) {
    let taxes = 0;
    selectedItems.value.forEach((item: any) => {
      taxes += item.total_taxes;
    });
    if (refundForm.is_taxes) {
      totalItemAmount.value += taxes;
    } else {
      totalItemAmount.value -= taxes;
    }
  }
  removeError("is_taxes");
};

const setDeliveryFees = () => {
  refundForm.is_delivery_fees = !refundForm.is_delivery_fees;
  if (selectedItems.value.length > 0) {
    let orderDeliveryFeeAmounts = 0;

    if (currentOrder.value.delivery_fee_amount > 0) {
      selectedItems.value.forEach((item: any) => {
        orderDeliveryFeeAmounts +=
          ((item.subtotal + item.order_discount_applied) /
            totalItemsAmounts.value) *
          currentOrder.value.delivery_fee_amount;
      });
    }
    if (refundForm.is_delivery_fees) {
      totalItemAmount.value += orderDeliveryFeeAmounts;
    } else {
      totalItemAmount.value -= orderDeliveryFeeAmounts;
    }
  }
  removeError("is_delivery_fees");
};

const selectCurrentOrder = async (order: any) => {
  currentOrder.value = order;

  if (currentOrder.value && order.payments.length > 0) {
    totalRefundPaymentAmount.value = order.payments.reduce(
      (accumulator: any, payment: any) =>
        payment.status == "refunded" ? accumulator + payment.total_amount : 0,
      0
    );
  }
  if (currentOrder.value && order.orderItems.length > 0) {
    subtotalItems.value = order.orderItems.reduce(
      (accumulator: any, current: any) => accumulator + current.subtotal,
      0
    );

    let itemsDiscount = order.orderItems.reduce(
      (accumulator: any, current: any) =>
        accumulator +
        (current.total_discount_applied + current.order_discount_applied),
      0
    );

    orderDiscountSum.value =
      currentOrder.value.total_order_discount +
      currentOrder.value.total_items_discount -
      itemsDiscount;
  }
};

const openRefundPopup = async () => {
  resetRefundForm();
  isRefundPopup.value = true;
  next.value = 1;
  let itemDiscounts = 0;
  let orderDiscountAmounts = 0;
  let allDiscount =
    currentOrder.value.total_order_discount +
    currentOrder.value.total_items_discount;

  currentOrder.value.orderItems.forEach((item: any) => {
    totalItemsAmounts.value += item.subtotal + item.order_discount_applied;
    itemDiscounts += item.total_discount_applied + item.order_discount_applied;
  });

  let orderDiscount = allDiscount - itemDiscounts;

  currentOrderDiscountAmounts.value = orderDiscount;

  if (orderDiscount > 0) {
    currentOrder.value.orderItems
      .filter((item: any) => item.is_refunded === false)
      .forEach((item: any) => {
        orderDiscountAmounts +=
          ((item.subtotal + item.order_discount_applied) /
            totalItemsAmounts.value) *
          orderDiscount;
      });
  }

  let selectedItemDiscounts = currentOrder.value.orderItems
    .filter((item: any) => item.is_refunded === false)
    .reduce(
      (accumulator: any, item: any) =>
        accumulator +
        (item.total_discount_applied + item.order_discount_applied),
      0
    );

  currentSelectedItemDiscounts.value = selectedItemDiscounts;

  totalOrderAmount.value = parseFloat(
    (
      currentOrder.value.total_price +
      currentOrderDiscountAmounts.value +
      currentSelectedItemDiscounts.value -
      currentOrder.value.tip_amount -
      totalRefundPaymentAmount.value
    ).toFixed(2)
  );

  refundForm.amount = (
    currentOrder.value.total_price +
    orderDiscountAmounts +
    selectedItemDiscounts -
    currentOrder.value.tip_amount -
    totalRefundPaymentAmount.value
  ).toFixed(2);
};

const selectItem = (item: any) => {
  let total_amount = item.total_modifiers + item.amount * item.quantity;
  let totalItemDiscounts = 0;
  let orderDiscountAmounts = 0;

  if (refundForm.items) {
    currentOrder.value.orderItems.forEach((item: any) => {
      totalItemDiscounts +=
        item.total_discount_applied + item.order_discount_applied;
    });
    if (refundForm.is_discounts) {
      let itemDiscounts =
        item.total_discount_applied + item.order_discount_applied;

      let allDiscount =
        currentOrder.value.total_order_discount +
        currentOrder.value.total_items_discount;

      let orderDiscount = allDiscount - totalItemDiscounts;
      if (orderDiscount > 0) {
        orderDiscountAmounts =
          ((item.subtotal + item.order_discount_applied) /
            totalItemsAmounts.value) *
          orderDiscount;
      }

      total_amount -= itemDiscounts + orderDiscountAmounts;
    }

    if (refundForm.is_taxes) {
      total_amount += item.total_taxes;
    }

    if (
      refundForm.is_delivery_fees &&
      currentOrder.value.delivery_fee_amount > 0
    ) {
      let delivery_amount = 0;
      delivery_amount =
        ((item.subtotal + item.order_discount_applied) /
          totalItemsAmounts.value) *
        currentOrder.value.delivery_fee_amount;
      total_amount += delivery_amount;
    }

    const isSelected = refundForm.items?.includes(item.id);
    if (!isSelected) {
      totalItemAmount.value += total_amount;
      selectedItems.value.push(item);
      refundForm.items.push(item.id);
    } else {
      const index = refundForm.items?.findIndex(
        (itemID: number) => itemID === item.id
      );

      if (index !== -1) {
        refundForm.items.splice(index, 1);
        selectedItems.value.splice(index, 1);
        totalItemAmount.value -= total_amount;
      }
    }
  } else {
    refundForm.items = [item.id];
    selectedItems.value = [item];
    totalItemAmount.value = total_amount;
  }
};

const selectAllItem = (items: any) => {
  if (refundForm.items.length == items.length) {
    refundForm.items = [];
    selectedItems.value = [];
    totalItemAmount.value = 0;
  } else {
    refundForm.items = [];
    selectedItems.value = [];
    totalItemAmount.value = 0;
    items.forEach((item: any) => {
      selectedItems.value.push(item);
      refundForm.items.push(item.id);
    });
    let total_amount = selectedItems.value.reduce(
      (accumulator: any, item: any) =>
        accumulator + (item.total_modifiers + item.amount * item.quantity),
      0
    );

    let allDiscount =
      currentOrder.value.total_order_discount +
      currentOrder.value.total_items_discount;

    if (refundForm.is_discounts) {
      totalItemAmount.value -= parseFloat(allDiscount.toFixed(2));
    }
    let total_items_taxes = 0;
    let totalDeliveryFeeAmounts = 0;
    selectedItems.value.forEach((item: any) => {
      total_items_taxes += item.total_taxes;
      if (currentOrder.value.delivery_fee_amount > 0) {
        totalDeliveryFeeAmounts +=
          ((item.subtotal + item.order_discount_applied) /
            totalItemsAmounts.value) *
          currentOrder.value.delivery_fee_amount;
      }
    });

    if (refundForm.is_taxes) {
      total_amount += total_items_taxes;
    }

    if (refundForm.is_delivery_fees) {
      total_amount += totalDeliveryFeeAmounts;
    }
    totalItemAmount.value += total_amount;
  }
};

watch(
  () => totalItemAmount.value,
  (value) => {
    if (value != 0) {
      if (refundForm.refund_type == "items") {
        if (value.toFixed(2) <= totalOrderAmount.value) {
          itemsError.value = "";
        } else {
          itemsError.value =
            "The selection items amount should be less than or equal $" +
            refundForm.amount +
            ".";
        }
      }
    } else {
      itemsError.value = "";
    }
  },
  {
    immediate: true,
  }
);

const goNext = (val: any) => {
  if (val == 2) {
    if (refundForm.refund_type == "items") {
      if (refundForm.items.length == 0 || itemsError.value != "") {
        itemsError.value =
          itemsError.value != ""
            ? itemsError.value
            : "The items field is required when refund type is items.";
        val = 1;
      } else {
        getReasons();
        itemsError.value = "";
      }
    } else {
      if (refundForm.amount == 0 || amountError.value != "") {
        amountError.value =
          amountError.value != ""
            ? amountError.value
            : "The Amount field is required when refund type is amount.";
        val = 1;
      } else {
        getReasons();
        amountError.value = "";
      }
    }
  } else if (val == 3) {
    if (refundForm.refund_reason == "") {
      reasonErrors.value = "The reason field is required.";
      val = 2;
    } else {
      reasonErrors.value = "";
    }
  }
  next.value = val;
};

const setSaveInList = () => {
  refundForm.is_save_reason_in_list = !refundForm.is_save_reason_in_list;
  removeError("is_save_reason_in_list");
};

const nextPage = async () => {
  if (meta.value.current_page < meta.value.last_page) {
    params.value.page++;
    isShowMore.value = true;
    getOrders(true, false);
  }
};

const checkEmptyParameters = async () => {
  if (
    params.value.customer_id != "" ||
    params.value.total_price != "" ||
    params.value.tpn != "" ||
    params.value.transaction_id != "" ||
    params.value.exact_date != "" ||
    params.value.id != ""
  ) {
    isEmptyParameters.value = true;
  }
};

const saveSelection = async (customer: any) => {
  let name_phone =
    (customer.first_name ? customer.first_name + " " : "") +
    "" +
    (customer.last_name ? customer.last_name : "");
  if (!customer.first_name && !customer.last_name) {
    name_phone = customer.phone;
  }

  params.value.customer_name = name_phone;
  params.value.customer_id = customer.id;
  closeCustomerPopup();
};

const openFilter = async () => {
  isOpenFilter.value = true;
};

const closeFilter = async () => {
  isOpenFilter.value = false;
};

const resetFilter = async () => {
  params.value.search = "";
  params.value.total_price = "";
  params.value.customer_id = "";
  params.value.customer_name = "";
  params.value.tpn = "";
  params.value.exact_date = "";
  params.value.id = "";
  params.value.transaction_id = "";
  isOpenFilter.value = false;
  isEmptyParameters.value = false;
  params.value.page = 1;
  getOrders(false, true);
};

const filter = async () => {
  getOrders(false, true);
  checkEmptyParameters();
  isOpenFilter.value = false;
};

const searchOrders = useDebounceFn((searchQuery: string) => {
  params.value.search = searchQuery;
  params.value.page = 1;
  getOrders(false, true);
  isShowMore.value = false;
}, 600);

const getOrders = async (isNext: boolean, isSelectOrder: boolean) => {
  try {
    if (!isShowMore.value) {
      isLoading.value = true;
    }

    const response = await api.order.getOrders(params.value);
    if ((params.value.search != "" || params.value.search == "") && isNext) {
      response.data?.data.forEach((order: any) => {
        orders.value.push(order);
      });
    } else {
      orders.value = response?.data?.data;
    }
    if (isSelectOrder) {
      selectCurrentOrder(orders.value[0]);
    }

    meta.value = response?.data?.meta;
    if (!isShowMore.value) {
      isLoading.value = false;
    } else {
      isShowMore.value = false;
    }
  } catch (error) {
    console.log(error);
  }
};

const showOrder = async () => {
  let check = true;
  try {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    if (urlParams.has("id") && urlParams.get("id") != "") {
      isLoading.value = true;
      const response = await api.order.show(urlParams.get("id"));
      let order = response?.data?.data;
      if (order) {
        selectCurrentOrder(order);
        check = false;
      }
      isLoading.value = false;
    }
  } catch (error) {
    console.log(error);
  }
  getOrders(false, check);
};

const onReasonClick = async (reason: any) => {
  selectedReason.value = reason;
  refundForm.refund_reason = reason.reason;
};

const openCustomerPopup = async () => {
  isOpenCustomerPopup.value = true;
};

const closeCustomerPopup = async () => {
  isOpenCustomerPopup.value = false;
};

const openViewReceipts = async (type: string, transaction: any) => {
  isViewReceiptsPopup.value = true;
  currentTransaction.value = transaction;
  getReciptsByOrderStatus(type);
};

const openViewRefundReceipt = async (transaction: any) => {
  isViewRefundReceiptPopup.value = true;
  currentTransaction.value = transaction;
};

const openPrintReceipts = async (type: string, transaction: any) => {
  is_customer.value = false;
  is_merchant.value = false;
  is_terminal.value = false;
  is_kitchen_bar.value = false;
  isPrintReceiptsPopup.value = true;
  currentTransaction.value = transaction;
  getReciptsByOrderStatus(type);
};

const printRecipts = async (divId: string) => {
  isViewReceiptsPopup.value = true;
  var printContents = document?.getElementById(divId)?.innerHTML;
  var originalContents = document.body.innerHTML;

  if (printContents) document.body.innerHTML = printContents?.toString();

  window.print();

  document.body.innerHTML = originalContents;
  isPrintReceiptsPopup.value = false;
};

const closeViewReceipts = async () => {
  isViewReceiptsPopup.value = false;
};

const closePrintReceipts = async () => {
  isPrintReceiptsPopup.value = false;
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

showOrder();
</script>

<template>
  <section>
    <div class="flex items-center gap-2">
      <div class="bg-secondary dark:!bg-surface p-2 shadow rounded flex">
        <BoxIcon :color="staticPrimaryColor" class="w-[20px] h-[20px] m-auto" />
      </div>
      <p class="text-xl">Order Transactions</p>
    </div>
    <div class="grid ineventory-grid gap-4 mt-4">
      <OrderLists
        :isLoading="isLoading"
        :isShowMore="isShowMore"
        :metaObj="meta"
        :orders="orders"
        @callSelectCurrentOrder="selectCurrentOrder"
        @callNextPage="nextPage"
        @callSearchOrders="searchOrders"
        @callOpenFilter="openFilter"
        @callResetFilter="resetFilter"
        :posSetting="posSetting"
        :parameters="params"
        :isEmptyParameters="isEmptyParameters"
        :order="currentOrder"
      />
      <div v-if="currentOrder" class="flex flex-col gap-4">
        <RouterView>
          <Suspense
            :timeout="0"
            @fallback="isFallbackStateActive = true"
            @resolve="isFallbackStateActive = false"
          >
            <VCard height="635" class="d-flex flex-column">
              <PerfectScrollbar :options="{ wheelPropagation: false }">
                <VRow class="ma-0" v-if="currentOrder">
                  <VCol cols="12" class="border-t pa-4 shortcut-icon">
                    <h6
                      style="text-decoration: underline"
                      class="text-base font-weight-medium mt-2 mb-0"
                    >
                      Details
                    </h6>
                    <br />
                    <div class="flex items-center justify-between gap-4">
                      <div class="flex flex-col justify-between h-full">
                        <h6 class="mb-0">
                          <span style="color: #0ebcf5">Sale</span> -
                          {{
                            currentOrder.status == "cancel"
                              ? "Canceled"
                              : currentOrder.status
                          }}
                        </h6>
                        <small class="text-muted d-block"
                          ><span
                            class="mb-0"
                            style="
                              color: black;
                              font-size: 15px;
                              font-weight: bold;
                            "
                            >Order:
                          </span>
                          <span style="font-size: 15px" class="mb-0">{{
                            (posSetting && posSetting.order_prefix
                              ? posSetting.order_prefix
                              : "#") + currentOrder.id
                          }}</span></small
                        >
                      </div>
                      <div class="flex gap-2">
                        <div
                          class="p-4 flex items-center justify-between gap-4"
                        >
                          <div class="flex flex-col justify-between h-full">
                            <small class="text-muted d-block"
                              ><i class="fas fa-clock"></i>
                              {{ currentOrder.created_at }}
                              {{ currentOrder.created_time_at }}
                            </small>
                            <h6 class="mb-0" style="color: black">
                              ${{ makeFLoat(currentOrder.total_price, "") }}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </VCol>
                </VRow>
                <VDivider />
                <VRow
                  class="ma-0 mt-n1"
                  v-if="currentOrder.payments.length > 0"
                >
                  <VCol cols="12" class="border-t pa-4 shortcut-icon">
                    <h6
                      style="text-decoration: underline"
                      class="text-base font-weight-medium mt-2 mb-0"
                    >
                      Transactions
                    </h6>
                    <br />
                    <div
                      class="p-4 rounded-lg shadow flex items-center justify-between gap-4"
                      :to="''"
                      v-for="(transaction, index) in currentOrder.payments"
                    >
                      <div class="flex flex-col justify-between h-full">
                        <h6 class="mb-0">
                          <span
                            style="color: #0ebcf5"
                            v-if="transaction.status != 'refunded'"
                            >Sale</span
                          >
                          <span
                            style="color: #ff6f61"
                            v-else-if="transaction.status == 'refunded'"
                            >Refunded</span
                          >
                          -
                          {{ transaction.payment_method }}
                        </h6>
                        <small class="text-muted d-block"
                          ><span
                            class="mb-0"
                            style="
                              color: black;
                              font-size: 15px;
                              font-weight: bold;
                            "
                            >Transaction ID:
                          </span>
                          <span style="font-size: 15px" class="mb-0"
                            >#{{ transaction.id }}</span
                          ></small
                        >
                      </div>
                      <div class="flex gap-2">
                        <div
                          class="p-4 flex items-center justify-between gap-4"
                        >
                          <div class="flex flex-col justify-between h-full">
                            <small class="text-muted d-block"
                              ><i class="fas fa-clock"></i>
                              {{ transaction.created_at }}
                              {{ transaction.created_time_at }}
                            </small>
                            <h6 class="mb-0" style="color: black">
                              ${{ transaction.total_amount.toFixed(2) }}
                            </h6>
                          </div>

                          <div
                            class="flex gap-2"
                            v-if="transaction.status != 'refunded'"
                          >
                            <IconBtn
                              @click="
                                openViewReceipts(
                                  currentOrder.status,
                                  transaction
                                )
                              "
                              variant="elevated"
                              style="background-color: #e9f5fe; color: #2196f3"
                            >
                              <VIcon :icon="'tabler-receipt'" :size="'25'" />
                            </IconBtn>

                            <IconBtn
                              @click="
                                openPrintReceipts(
                                  currentOrder.status,
                                  transaction
                                )
                              "
                              variant="elevated"
                              style="background-color: #f8cfcb; color: #ea5455"
                            >
                              <VIcon :icon="'tabler-printer'" :size="'25'" />
                            </IconBtn>
                          </div>
                          <div
                            style="margin-right: 45px"
                            class="flex gap-2"
                            v-else
                          >
                            <IconBtn
                              @click="openViewRefundReceipt(transaction)"
                              variant="elevated"
                              style="background-color: #e9f5fe; color: #2196f3"
                            >
                              <VIcon :icon="'tabler-receipt'" :size="'25'" />
                            </IconBtn>
                          </div>
                        </div>
                      </div>
                    </div>
                  </VCol>
                </VRow>
                <VDivider />
                <VRow
                  class="ma-0 mt-n1"
                  v-if="currentOrder.orderItems.length > 0"
                >
                  <VCol cols="12" class="border-t pa-4 shortcut-icon">
                    <h6
                      style="text-decoration: underline"
                      class="text-base font-weight-medium mt-2 mb-0"
                    >
                      Items
                    </h6>
                    <br />
                    <div
                      class="p-4 rounded-lg shadow flex items-center justify-between"
                      :to="''"
                      v-for="(item, index) in currentOrder.orderItems"
                    >
                      <div
                        class="flex justify-between"
                        v-if="item.type == 'item'"
                      >
                        <img
                          :src="
                            item?.product?.image
                              ? item?.product?.image
                              : placeholder
                          "
                          class="w-[40px] h-[40px] rounded"
                        />
                        <div class="flex-col h-full pl-4">
                          <h6 class="mb-0">
                            <span>{{ item.name }} </span>
                          </h6>
                          <small class="text-muted d-block">
                            <span class="mb-0">
                              <span v-if="item.product.categories.length > 5">
                                <span
                                  v-for="(
                                    category, index
                                  ) in item.product.categories.slice(0, 5)"
                                  ><span style="color: #0ebcf5">{{
                                    category.name
                                  }}</span>
                                  <span
                                    v-if="
                                      index !=
                                      Object.keys(
                                        item.product.categories.slice(0, 5)
                                      ).length -
                                        1
                                    "
                                  >
                                    -
                                  </span>
                                  <span v-else>, ....</span>
                                  <VTooltip
                                    open-delay="500"
                                    location="top"
                                    activator="parent"
                                  >
                                    <span
                                      v-for="(
                                        category, index
                                      ) in item.product.categories.slice(0, 10)"
                                      ><span>{{ category.name }}</span>
                                      <span
                                        v-if="
                                          index !=
                                          Object.keys(
                                            item.product.categories.slice(0, 10)
                                          ).length -
                                            1
                                        "
                                      >
                                        ,
                                      </span></span
                                    >
                                  </VTooltip>
                                </span>
                              </span>
                              <span
                                class="mb-0"
                                v-else-if="item.product.categories.length <= 5"
                              >
                                <span
                                  v-for="(
                                    category, index
                                  ) in item.product.categories.slice(0, 5)"
                                  ><span style="color: #0ebcf5"
                                    >{{ category.name }}
                                    <span
                                      v-if="
                                        index !=
                                        Object.keys(
                                          item.product.categories.slice(0, 5)
                                        ).length -
                                          1
                                      "
                                    >
                                      -
                                    </span>
                                  </span>
                                </span>
                              </span>
                            </span>
                          </small>
                        </div>
                      </div>
                      <div class="flex justify-between" v-else>
                        <img
                          :src="placeholder"
                          class="w-[40px] h-[40px] rounded"
                        />
                        <div class="flex-col h-full pl-4">
                          <h6 class="mb-0">
                            <span>{{ item?.name ?? "Manual Entry" }} </span>
                          </h6>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <div class="flex flex-col justify-between h-full">
                          <small class="text-muted d-block"
                            ><i class="fas fa-clock"></i>
                            {{ item.created_time_at }}
                          </small>
                          <h6 class="mb-0" style="color: black">
                            ${{ makeFLoat(item.total_amount, "") }}
                          </h6>
                          <h6
                            class="mb-0 text-primary"
                            v-if="item.total_taxes > 0"
                          >
                            taxable: ${{ item.total_taxes }}
                          </h6>
                          <span
                            style="color: #ff6f61"
                            v-if="item.is_refunded"
                            class="mb-0"
                          >
                            Refunded
                          </span>
                        </div>
                      </div>
                    </div>
                  </VCol>
                </VRow>

                <VRow class="ma-0 mt-n1 rounded">
                  <VCol cols="12" class="rounded border-t pa-4 shortcut-icon">
                    <div
                      class="p-2 flex items-center justify-between gap-4 bg-gray-100"
                    >
                      <h6 class="mb-0">
                        <span>Items Subtotal:</span>
                      </h6>
                      <h6 class="mb-0" style="color: black">
                        ${{ subtotalItems.toFixed(2) }}
                      </h6>
                    </div>
                    <div
                      class="p-2 flex items-center justify-between gap-4 bg-gray-100"
                    >
                      <h6 class="mb-0">
                        <span>Discount</span>
                      </h6>
                      <h6 class="mb-0" style="color: black">
                        - ${{ orderDiscountSum.toFixed(2) }}
                      </h6>
                    </div>
                    <div
                      class="p-2 flex items-center justify-between gap-4 bg-gray-100"
                    >
                      <h6 class="mb-0">
                        <span>Subtotal</span>
                      </h6>
                      <h6 class="mb-0" style="color: black">
                        ${{ (subtotalItems - orderDiscountSum).toFixed(2) }}
                      </h6>
                    </div>
                    <div
                      class="p-2 flex items-center justify-between gap-4 bg-gray-100"
                    >
                      <h6 class="mb-0">
                        <span>Taxes</span>
                      </h6>
                      <h6 class="mb-0" style="color: black">
                        ${{ currentOrder.total_items_taxes }}
                      </h6>
                    </div>
                    <div
                      v-if="currentOrder.tip_amount > 0"
                      class="p-2 flex items-center justify-between gap-4 bg-gray-100"
                    >
                      <h6 class="mb-0">
                        <span>Tips</span>
                      </h6>
                      <h6 class="mb-0" style="color: black">
                        ${{ currentOrder.tip_amount }}
                      </h6>
                    </div>
                    <div
                      v-if="currentOrder.delivery_fee_amount > 0"
                      class="p-2 flex items-center justify-between gap-4 bg-gray-100"
                    >
                      <h6 class="mb-0">
                        <span>Delivery Fees</span>
                      </h6>
                      <h6 class="mb-0" style="color: black">
                        ${{ currentOrder.delivery_fee_amount }}
                      </h6>
                    </div>
                    <hr class="bg-black" />
                    <div
                      class="p-2 flex items-center justify-between gap-4 bg-gray-100"
                    >
                      <h3 style="color: black" class="mb-0 text-black">
                        Total
                      </h3>
                      <h6 class="mb-0" style="color: #0ebcf5">
                        ${{ currentOrder.total_price }}
                      </h6>
                    </div>
                  </VCol>
                </VRow>
                <VDivider />
              </PerfectScrollbar>
              <VCardItem
                class="py-2 mt-auto"
                v-if="currentOrder.status != 'refunded'"
              >
                <template #append>
                  <div class="mt-4 flex justify-center">
                    <VBtn :color="'primary'" @click="openRefundPopup"
                      >Refund</VBtn
                    >
                  </div>
                </template>
              </VCardItem>
            </VCard>
          </Suspense>
        </RouterView>
      </div>
    </div>
  </section>
  <VDialog v-model="isOpenFilter" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeFilter()" />

    <VCard>
      <div class="py-8 px-4">
        <div id="total_price">
          <AppTextField
            v-model="params.total_price"
            label="Amount"
            placeholder="Type Here..."
            type="number"
          />
        </div>
        <div id="customer_id" class="relative">
          <AppTextField
            @click="openCustomerPopup()"
            v-model="params.customer_name"
            label="Consumer"
            placeholder="Type Here..."
            type="text"
          />
        </div>

        <div id="tpn">
          <AppTextField
            v-model="params.tpn"
            label="TPN"
            placeholder="Type Here..."
          />
        </div>
        <div id="transaction_id">
          <AppTextField
            v-model="params.transaction_id"
            label="Reference Id"
            placeholder="Type Here..."
            type="number"
            :min="0"
          />
        </div>
        <div id="exact_date">
          <DatePicker
            v-model="params.exact_date"
            label="Date"
            placeholder="Select Date"
            :config="{ inline: true }"
          />
        </div>
        <div id="id">
          <AppTextField
            v-model="params.id"
            label="Order"
            placeholder="Type Here..."
            :hasInnerLabel="true"
            :innerLabelValue="
              posSetting && posSetting.order_prefix
                ? posSetting.order_prefix
                : '#'
            "
            type="number"
            :min="0"
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
              v-if="isLoadingFilter"
            />
            <span v-else>Ok</span>
          </VBtn>
        </div>
      </div>
    </VCard>
  </VDialog>
  <VDialog v-model="isOpenCustomerPopup" width="800">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeCustomerPopup()" />

    <VCard>
      <Customer
        :isCustomerSelection="true"
        @callSaveSelection="saveSelection"
      ></Customer>
    </VCard>
  </VDialog>
  <VDialog v-model="isViewReceiptsPopup" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeViewReceipts()" />

    <VCard class="md:py-8 md:px-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3"> All Receipts </VCardTitle>
      </VCardItem>
      <VCardText
        v-if="
          receipts?.customer ||
          receipts?.precheck ||
          receipts?.merchant ||
          receipts?.terminal ||
          receipts?.['kitchen-bar']
        "
      >
        <ReceiptFields
          :receipts="receipts"
          :order="currentOrder"
          :posSetting="posSetting"
          :transaction="currentTransaction"
        ></ReceiptFields>
      </VCardText>
      <VCardText v-else>
        <div class="text-center">There Is No Active Receipts Found!</div>
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog v-model="isPrintReceiptsPopup" width="550">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closePrintReceipts()" />

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
  <VDialog v-model="isRefundPopup" width="550">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isRefundPopup = false" />

    <VCard class="md:py-8 md:px-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3">
          Refund <span class="capitalize">{{ refundForm.refund_type }}</span>
        </VCardTitle>
      </VCardItem>
      <VCardText>
        <div v-if="next == 1">
          <div class="flex flex-col gap-4">
            <div class="form-group">
              <div class="flex justify-between">
                <div class="flex flex-col" id="is_discounts">
                  <label class="text-base" for="is_discounts1"
                    >Custom Fee/Discounts</label
                  >
                </div>
                <div>
                  <VSwitch
                    @click="setDiscount()"
                    class="cursor-pointer"
                    v-model="refundForm.is_discounts"
                    id="is_discounts1"
                    color="success"
                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="flex justify-between">
                <div class="flex flex-col" id="is_taxes">
                  <label class="text-base" for="is_taxes1">Taxes</label>
                </div>
                <div>
                  <VSwitch
                    @click="setTax()"
                    class="cursor-pointer"
                    v-model="refundForm.is_taxes"
                    id="is_taxes1"
                    color="success"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="flex justify-between">
                <div class="flex flex-col" id="is_delivery_fees">
                  <label class="text-base" for="is_delivery_fees1"
                    >Delivery Fees</label
                  >
                </div>
                <div>
                  <VSwitch
                    @click="setDeliveryFees()"
                    class="cursor-pointer"
                    v-model="refundForm.is_delivery_fees"
                    id="is_delivery_fees1"
                    color="success"
                  />
                </div>
              </div>
            </div>
          </div>
          <br />
          <div id="refund_type" class="flex flex-col gap-2">
            <div class="grid grid-cols-2 p-1 bg-[#fafafa]" id="refund_type">
              <button
                v-for="type in refundTypes"
                class="p-2 rounded text-black"
                :class="
                  refundForm.refund_type === type.key
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-primary'
                "
                :key="type.key"
                @click="changeRefundType(type.key)"
              >
                {{ type.title }}
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-4 py-2">
            <div id="amount" v-if="refundForm.refund_type == 'amount'">
              <NumPad
                :amount="refundForm.amount"
                :item-to-edit="{}"
                @save="onSaveAmount"
                :is-loading="false"
                :is-refund="true"
              />
              <div
                class="v-input__details"
                :style="amountError != '' ? 'display:block' : 'display:none'"
              >
                <div class="text-sm text-danger mt-1">
                  {{ amountError }}
                </div>
              </div>
            </div>
            <br />
            <div id="items" v-if="refundForm.refund_type == 'items'">
              <p
                class="text-center"
                style="color: black; font-size: 17px; font-weight: bold"
              >
                ${{ parseFloat(totalItemAmount.toFixed(2)) }}
              </p>
              <div
                class="flex gap-2 items-center"
                style="float: right; margin-top: -17px"
              >
                <label
                  class="flex justify-between items-center cursor-pointer"
                  :for="`item`"
                  @click="
                    selectAllItem(
                      currentOrder.orderItems.filter(
                        (item: any) => item.is_refunded === false
                      )
                    )
                  "
                >
                  All Items &nbsp;
                  <div class="flex gap-2 items-center">
                    <CustomCheckbox
                      :checked="isAllItemSelected(currentOrder.orderItems.filter((item: any) => item.is_refunded === false))"
                      style="
                        width: 32px;
                        height: 27px;
                        border-radius: 17px !important;
                      "
                    />
                  </div>
                </label>
              </div>
              <br />
              <div
                style="
                  background-color: #e5e7eb;
                  padding: 7px;
                  font-weight: bold;
                "
              >
                Available For Refund
              </div>
              <PerfectScrollbar :options="{ wheelPropagation: false }">
                <div
                  style="margin-top: -15px"
                  class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
                >
                  <div
                    style="height: 86px"
                    class="p-4 rounded-lg shadow flex items-center justify-between gap-4"
                    v-for="item in currentOrder.orderItems.filter((item: any) => item.is_refunded === false)"
                  >
                    <div
                      class="flex justify-between"
                      v-if="item.type == 'item'"
                    >
                      <img
                        :src="
                          item?.product?.image
                            ? item?.product?.image
                            : placeholder
                        "
                        class="w-[40px] h-[40px] rounded"
                      />
                      <div class="flex-col h-full pl-4">
                        <h6 class="mb-0">
                          <span>{{ item.name }} </span>
                        </h6>
                        <small class="text-muted d-block">
                          <span class="mb-0">
                            <span v-if="item.product.categories.length > 5">
                              <span
                                v-for="(
                                  category, index
                                ) in item.product.categories.slice(0, 5)"
                                ><span style="color: #0ebcf5">{{
                                  category.name
                                }}</span>
                                <span
                                  v-if="
                                    index !=
                                    Object.keys(
                                      item.product.categories.slice(0, 5)
                                    ).length -
                                      1
                                  "
                                >
                                  -
                                </span>
                                <span v-else> ....</span>
                                <VTooltip
                                  open-delay="500"
                                  location="top"
                                  activator="parent"
                                >
                                  <span
                                    v-for="(
                                      category, index
                                    ) in item.product.categories.slice(0, 10)"
                                    ><span>{{ category.name }}</span>
                                    <span
                                      v-if="
                                        index !=
                                        Object.keys(
                                          item.product.categories.slice(0, 10)
                                        ).length -
                                          1
                                      "
                                    >
                                      ,
                                    </span></span
                                  >
                                </VTooltip>
                              </span>
                            </span>
                            <span
                              class="mb-0"
                              v-else-if="item.product.categories.length <= 5"
                            >
                              <span
                                v-for="(
                                  category, index
                                ) in item.product.categories.slice(0, 5)"
                                ><span style="color: #0ebcf5"
                                  >{{ category.name }}
                                  <span
                                    v-if="
                                      index !=
                                      Object.keys(
                                        item.product.categories.slice(0, 5)
                                      ).length -
                                        1
                                    "
                                  >
                                    -
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </small>
                      </div>
                    </div>
                    <div class="flex justify-between" v-else>
                      <img
                        :src="placeholder"
                        class="w-[40px] h-[40px] rounded"
                      />
                      <div class="flex-col h-full pl-4">
                        <h6 class="mb-0">
                          <span>{{ item?.name ?? "Manual Entry" }} </span>
                        </h6>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <div
                        class="p-4 flex items-center justify-between gap-4"
                      ></div>
                      <div class="flex flex-col justify-between h-full">
                        <small class="text-muted d-block"
                          ><i class="fas fa-clock"></i>
                          {{ item.created_time_at }}
                        </small>
                        <h6 class="mb-0" style="color: black">
                          ${{
                            makeFLoat(
                              item.quantity * item.amount +
                                item.total_modifiers,
                              ""
                            )
                          }}
                        </h6>
                        <span
                          style="color: #ff6f61"
                          v-if="item.is_refunded"
                          class="mb-0"
                        >
                          Refunded
                        </span>
                      </div>
                      <div
                        class="flex gap-2 items-center"
                        v-if="!item.is_refunded"
                      >
                        <label
                          class="flex justify-between items-center cursor-pointer"
                          :key="item.id"
                          :for="`item-${item.id}`"
                          @click="selectItem(item)"
                        >
                          <div class="flex gap-2 items-center">
                            <CustomCheckbox
                              :checked="isItemSelected(item.id)"
                              style="
                                width: 32px;
                                height: 27px;
                                border-radius: 17px !important;
                              "
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </PerfectScrollbar>
              <div
                class="v-input__details"
                :style="itemsError != '' ? 'display:block' : 'display:none'"
              >
                <div class="text-sm text-danger mt-1">
                  {{ itemsError }}
                </div>
              </div>
              <br />
              <div
                v-if="currentOrder.orderItems.filter((item: any) => item.is_refunded === true).length > 0"
                style="
                  background-color: #e5e7eb;
                  padding: 7px;
                  font-weight: bold;
                "
              >
                Not Available For Refund
              </div>
              <PerfectScrollbar :options="{ wheelPropagation: false }">
                <div
                  style="margin-top: -15px"
                  class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
                >
                  <div
                    style="height: 86px"
                    class="p-4 rounded-lg shadow flex items-center justify-between gap-4"
                    v-for="item in currentOrder.orderItems.filter((item: any) => item.is_refunded === true)"
                  >
                    <div
                      class="flex justify-between"
                      v-if="item.type == 'item'"
                    >
                      <img
                        :src="
                          item?.product?.image
                            ? item?.product?.image
                            : placeholder
                        "
                        class="w-[40px] h-[40px] rounded"
                      />
                      <div class="flex-col h-full pl-4">
                        <h6 class="mb-0">
                          <span>{{ item.name }} </span>
                        </h6>
                        <small class="text-muted d-block">
                          <span class="mb-0">
                            <span v-if="item.product.categories.length > 5">
                              <span
                                v-for="(
                                  category, index
                                ) in item.product.categories.slice(0, 5)"
                                ><span style="color: #0ebcf5">{{
                                  category.name
                                }}</span>
                                <span
                                  v-if="
                                    index !=
                                    Object.keys(
                                      item.product.categories.slice(0, 5)
                                    ).length -
                                      1
                                  "
                                >
                                  -
                                </span>
                                <span v-else> ....</span>
                                <VTooltip
                                  open-delay="500"
                                  location="top"
                                  activator="parent"
                                >
                                  <span
                                    v-for="(
                                      category, index
                                    ) in item.product.categories.slice(0, 10)"
                                    ><span>{{ category.name }}</span>
                                    <span
                                      v-if="
                                        index !=
                                        Object.keys(
                                          item.product.categories.slice(0, 10)
                                        ).length -
                                          1
                                      "
                                    >
                                      ,
                                    </span></span
                                  >
                                </VTooltip>
                              </span>
                            </span>
                            <span
                              class="mb-0"
                              v-else-if="item.product.categories.length <= 5"
                            >
                              <span
                                v-for="(
                                  category, index
                                ) in item.product.categories.slice(0, 5)"
                                ><span style="color: #0ebcf5"
                                  >{{ category.name }}
                                  <span
                                    v-if="
                                      index !=
                                      Object.keys(
                                        item.product.categories.slice(0, 5)
                                      ).length -
                                        1
                                    "
                                  >
                                    -
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </small>
                      </div>
                    </div>
                    <div class="flex flex-col justify-between h-full" v-else>
                      <img
                        :src="placeholder"
                        class="w-[40px] h-[40px] rounded"
                      />
                      <div class="flex-col h-full pl-4">
                        <h6 class="mb-0">
                          <span>{{ item?.name ?? "Manual Entry" }} </span>
                        </h6>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <div
                        class="p-4 flex items-center justify-between gap-4"
                      ></div>
                      <div class="flex flex-col justify-between h-full">
                        <small class="text-muted d-block"
                          ><i class="fas fa-clock"></i>
                          {{ item.created_time_at }}
                        </small>
                        <h6 class="mb-0" style="color: black">
                          ${{
                            makeFLoat(
                              item.quantity * item.amount +
                                item.total_modifiers,
                              ""
                            )
                          }}
                        </h6>
                        <span
                          style="color: #ff6f61"
                          v-if="item.is_refunded"
                          class="mb-0"
                        >
                          Refunded
                        </span>
                      </div>
                      <div
                        class="flex gap-2 items-center"
                        v-if="!item.is_refunded"
                      >
                        <label
                          class="flex justify-between items-center cursor-pointer"
                          :key="item.id"
                          :for="`item-${item.id}`"
                          @click="selectItem(item)"
                        >
                          <div class="flex gap-2 items-center">
                            <CustomCheckbox
                              :checked="isItemSelected(item.id)"
                              style="
                                width: 32px;
                                height: 27px;
                                border-radius: 17px !important;
                              "
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </PerfectScrollbar>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <div class="flex justify-end mt-4">
              <VBtn class="btn btn-primary w-fit px-8" @click="goNext(2)">
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  class="w-4 h-4 m-auto"
                  v-if="isLoadingReasons"
                />
                <span v-else>Next</span>
              </VBtn>
            </div>
          </div>
        </div>
        <div v-if="next == 2">
          <div class="p-4 mt-4">
            <div class="search-style d-flex">
              <AppTextField
                :isSearchBox="true"
                type="text"
                v-model="params.search"
                placeholder="Search Operators"
                @keyup="onReasonsSearch"
              />&nbsp;&nbsp;

              <VBtn
                @click="addReasonPopup"
                type="button"
                class="w-20 p-4 rounded-lg shadow flex gap-4 text-center"
                >Add</VBtn
              >
            </div>
            <div class="mt-4">
              <div class="flex p-4" v-if="isLoadingReasons && !reasons.length">
                <LoadingIcon
                  icon="tail-spin"
                  class="w-6 h-6 m-auto"
                  color="orange"
                />
              </div>
              <div
                v-else-if="reasons.length"
                style="margin-top: -15px"
                class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
              >
                <div
                  style="height: 86px"
                  class="p-4 rounded-lg shadow flex items-center justify-between gap-4 cursor-pointer"
                  :class="{
                    'bg-secondary dark:!bg-slate-600 text-primary':
                      selectedReason.id === reason.id,
                    'bg-[#f8f7fa] dark:bg-darkmode-bg':
                      selectedReason.id !== reason.id,
                  }"
                  @click="onReasonClick(reason)"
                  v-for="reason in reasons"
                >
                  <div class="flex flex-col justify-between h-full">
                    <h6 class="mb-0">
                      <span>{{ reason.reason }}</span>
                    </h6>
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
                          selectedReason.id === reason.id
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

                <div class="mt-4 flex m-auto" v-if="reasonMeta">
                  <Pagination
                    @pageChanged="
                      reasonParams.page = $event;
                      getReasons();
                    "
                    :meta="reasonMeta"
                    class="w-full sm:w-auto sm:mr-auto"
                  >
                  </Pagination>
                </div>
              </div>
              <div class="py-2 text-slate-400" v-else>No Reasons found</div>
            </div>
            <div
              class="v-input__details"
              :style="reasonErrors != '' ? 'display:block' : 'display:none'"
            >
              <div class="text-sm text-danger mt-1">
                {{ reasonErrors }}
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-4">
            <div class="flex justify-start mt-4">
              <VBtn @click="goNext(1)" class="btn btn-secondary w-fit px-8">
                Previous</VBtn
              >
            </div>
            <div class="flex justify-end mt-4">
              <VBtn @click="goNext(3)" class="btn btn-primary w-fit px-8">
                Next</VBtn
              >
            </div>
          </div>
        </div>
        <div v-if="next == 3">
          <p
            v-if="refundForm.items.length == 0"
            class="text-center"
            style="color: black; font-size: 17px; font-weight: bold"
          >
            ${{ refundForm.amount }}
          </p>
          <p
            v-else
            class="text-center"
            style="color: black; font-size: 17px; font-weight: bold"
          >
            ${{ totalItemAmount.toFixed(2) }}
          </p>
          <div class="p-4 mt-4">
            <span style="color: black; font-size: 17px; font-weight: bold">
              Payment Type </span
            ><br />
            <CustomRadios
              v-model:selected-radio="refundForm.payment_method"
              :radio-content="radioContent"
              :grid-column="{ sm: '4', cols: '12' }"
            />
            <br />
            <span style="color: black; font-size: 17px; font-weight: bold">
              Reason
            </span>
            <p>{{ refundForm.refund_reason }}</p>
            <div v-if="selectedItems.length">
              <br />
              <span style="color: black; font-size: 17px; font-weight: bold">
                Items
              </span>
              <PerfectScrollbar :options="{ wheelPropagation: false }">
                <div
                  style="margin-top: -15px"
                  class="flex flex-col gap-4 p-4 bg-white dark:bg-surface shadow rounded"
                >
                  <div
                    style="height: 86px"
                    class="p-4 rounded-lg shadow flex items-center justify-between gap-4"
                    v-for="item in selectedItems"
                  >
                    <div
                      class="flex justify-between"
                      v-if="item.type == 'item'"
                    >
                      <img
                        :src="
                          item?.product?.image
                            ? item?.product?.image
                            : placeholder
                        "
                        class="w-[40px] h-[40px] rounded"
                      />
                      <div class="flex-col h-full pl-4">
                        <h6 class="mb-0">
                          <span>{{ item.name }} </span>
                        </h6>
                        <small class="text-muted d-block">
                          <span class="mb-0">
                            <span v-if="item.product.categories.length > 5">
                              <span
                                v-for="(
                                  category, index
                                ) in item.product.categories.slice(0, 5)"
                                ><span style="color: #0ebcf5">{{
                                  category.name
                                }}</span>
                                <span
                                  v-if="
                                    index !=
                                    Object.keys(
                                      item.product.categories.slice(0, 5)
                                    ).length -
                                      1
                                  "
                                >
                                  -
                                </span>
                                <span v-else> ....</span>
                                <VTooltip
                                  open-delay="500"
                                  location="top"
                                  activator="parent"
                                >
                                  <span
                                    v-for="(
                                      category, index
                                    ) in item.product.categories.slice(0, 10)"
                                    ><span>{{ category.name }}</span>
                                    <span
                                      v-if="
                                        index !=
                                        Object.keys(
                                          item.product.categories.slice(0, 10)
                                        ).length -
                                          1
                                      "
                                    >
                                      ,
                                    </span></span
                                  >
                                </VTooltip>
                              </span>
                            </span>
                            <span
                              class="mb-0"
                              v-else-if="item.product.categories.length <= 5"
                            >
                              <span
                                v-for="(
                                  category, index
                                ) in item.product.categories.slice(0, 5)"
                                ><span style="color: #0ebcf5"
                                  >{{ category.name }}
                                  <span
                                    v-if="
                                      index !=
                                      Object.keys(
                                        item.product.categories.slice(0, 5)
                                      ).length -
                                        1
                                    "
                                  >
                                    -
                                  </span>
                                </span>
                              </span>
                            </span>
                          </span>
                        </small>
                      </div>
                    </div>
                    <div class="flex justify-between" v-else>
                      <img
                        :src="placeholder"
                        class="w-[40px] h-[40px] rounded"
                      />
                      <div class="flex-col h-full pl-4">
                        <h6 class="mb-0">
                          <span>{{ item?.name ?? "Manual Entry" }} </span>
                        </h6>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <div
                        class="p-4 flex items-center justify-between gap-4"
                      ></div>
                      <div class="flex flex-col justify-between h-full">
                        <small class="text-muted d-block"
                          ><i class="fas fa-clock"></i>
                          {{ item.created_time_at }}
                        </small>
                        <h6 class="mb-0" style="color: black">
                          ${{ makeFLoat(item.total_amount, "") }}
                        </h6>
                        <span
                          style="color: #ff6f61"
                          v-if="item.is_refunded"
                          class="mb-0"
                        >
                          Refunded
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PerfectScrollbar>
            </div>
            <br />
            <div class="flex justify-between mt-4">
              <div class="flex justify-start mt-4">
                <VBtn @click="goNext(2)" class="btn btn-secondary w-fit px-8">
                  Previous</VBtn
                >
              </div>
              <div class="flex justify-end mt-4">
                <VBtn class="btn btn-primary w-fit px-8" @click="refund">
                  <LoadingIcon
                    icon="tail-spin"
                    color="white"
                    class="w-4 h-4 m-auto"
                    v-if="isLoadingRefund"
                  />
                  <span v-else>Refund</span>
                </VBtn>
              </div>
            </div>
          </div>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
  <VDialog v-model="isAddReasonPopup" width="550">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isAddReasonPopup = false" />

    <VCard class="md:py-8 md:px-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3"> Add Reason </VCardTitle>
      </VCardItem>
      <VCardText>
        <div class="col-span-full" id="refund_reason">
          <AppTextarea
            v-model="refundForm.refund_reason"
            label="Reason"
            placeholder="Reason"
          />
          <div
            class="v-input__details"
            :style="reasonErrors != '' ? 'display:block' : 'display:none'"
          >
            <div class="text-sm text-danger mt-1">
              {{ reasonErrors }}
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <div class="form-group">
              <div class="flex justify-between">
                <div class="flex flex-col" id="is_save_reason_in_list">
                  <label class="text-base" for="is_save_reason_in_list1"
                    >Save In List</label
                  >
                </div>
                <div>
                  <VSwitch
                    @click="setSaveInList()"
                    class="cursor-pointer"
                    v-model="refundForm.is_save_reason_in_list"
                    id="is_save_reason_in_list1"
                    color="success"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <VBtn class="btn btn-primary w-fit px-8" @click="saveReason">
              Save
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog v-model="isViewRefundReceiptPopup" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeViewRefundReceiptPopup" />

    <VCard class="md:py-8 md:px-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3"> Refund Receipt </VCardTitle>
      </VCardItem>
      <VCardText>
        <RefundReceiptFields
          :transaction="currentTransaction"
          :posSetting="posSetting"
          @closeViewRefundReceiptPopup="closeViewRefundReceiptPopup"
        ></RefundReceiptFields>
      </VCardText>
    </VCard>
  </VDialog>
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
.my-swal {
  z-index: 10000000;
}
</style>
