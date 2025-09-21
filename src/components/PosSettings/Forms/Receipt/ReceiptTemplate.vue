<script setup lang="ts">
import QRCodeVue3 from "qrcode-vue3";
import { useUserStore } from "@/stores/user";

import {
  TEMPLATE_CLASSES,
  OPTIONS_CLASS_NAMES,
  HIDDEN_FIELDS,
  SPACED_BETWEEN_FIELDS,
  ONLY_TEXT_FIELDS,
  GROUPED_FIELDS,
  FIELDS_WITH_NO_PARENT_CLASS,
  PAY_BY_FIELDS,
  SUGGESTED_TIPS_FIELDS,
} from "./data";

const props = defineProps<{
  fields: any[];
  order: any;
  transaction: any;
  posSetting: any;
}>();

const totalItemsAmounts = ref<any>(0);
const hasItemDetailsOptions = ref<any>(false);
const userStore = useUserStore();
const tenant = userStore.getTenant;

const getFieldClassName = (field: any) => {
  let className = TEMPLATE_CLASSES[field.name] || "";
  if (field?.selected_styles) {
    field.selected_styles.forEach((style: string) => {
      const fieldStyle =
        field.name === "Delimiter"
          ? OPTIONS_CLASS_NAMES["Delimiter"][style]
          : OPTIONS_CLASS_NAMES[style];
      className += ` ${fieldStyle}`;
    });
  }

  return className;
};

const calculateTotalItemsAmounts = () => {
  if (props.order?.orderItems) {
    props.order.orderItems.forEach((item: any) => {
      totalItemsAmounts.value += item.subtotal + item.order_discount_applied;
    });
  }
};

calculateTotalItemsAmounts();

const getGroupedOptions = (field: any) => {
  return Object.keys(field?.selected_options);
};

const getIsGroupOptionVisible = (field: any, option: string) => {
  if (
    field.name === "Taxes, Payment tool, fees and discounts" ||
    field.name === "Total and Partial"
  ) {
    if (option === "Tax") {
      return field.selected_options["Tax"] && !field.selected_options["Tax 1"];
    }
  }

  if (field.name == "Items & Details") {
    if (anyTrue(field.selected_options)) {
      hasItemDetailsOptions.value = true;
    } else {
      hasItemDetailsOptions.value = false;
    }
  }

  return field.selected_options[option] && option !== "split taxes";
};

function anyTrue(obj: any) {
  for (var o in obj) {
    if (obj[o]) {
      return true;
    } else {
      return false;
    }
  }
}

function calculateTwoNumbers(num1: number, num2: number) {
  return num1 + num2;
}
</script>
<template>
  <div class="flex flex-col bg-white font-mono">
    <div
      :class="
        !FIELDS_WITH_NO_PARENT_CLASS.includes(field.name)
          ? getFieldClassName(field)
          : ''
      "
      v-for="field in fields"
      :key="field.id"
    >
      <div v-if="!HIDDEN_FIELDS.includes(field.name)">
        <template v-if="SPACED_BETWEEN_FIELDS[field.name]">
          <div class="flex justify-between gap-2">
            <div
              v-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'OrderID'
              "
            >
              {{ "OrderID" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'ReferenceID'
              "
            >
              {{ "ReferenceID" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Server'
              "
            >
              {{ "Server" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Cashier'
              "
            >
              {{ "Cashier" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Delivery fees'
              "
            >
              {{ "Delivery fees" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Item Discount'
              "
            >
              {{ "Item Discount" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Item Modifiers'
              "
            >
              {{ "Item Modifiers" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Tip'
              "
            >
              {{ "Tip" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Cash'
              "
            >
              {{ "Payment Tool" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Cash Tendered'
              "
            >
              {{ "Cash Tendered" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Change'
              "
            >
              {{ "Change" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Invoice Email'
              "
            >
              {{ "Invoice Email" }}
            </div>
            <div
              v-else-if="
                props.order &&
                props.order.customer &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Consumer'
              "
            >
              {{ "Consumer" }}
            </div>

            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Guests'
              "
            >
              {{ "Guests" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'POS'
              "
            >
              {{ "POS" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Table'
              "
            >
              {{ "Table" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Comment'
              "
            >
              {{ "Comment" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Subtotal'
              "
            >
              {{ "Subtotal" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Cash discount'
              "
            >
              {{ "Cash discount" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Cash Fee'
              "
            >
              {{ "Cash Fee" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Tax'
              "
            >
              {{ "Tax" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Tax 1'
              "
            >
              {{ "Tax 1" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Tax 2'
              "
            >
              {{ "Tax 2" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Total AMT'
              "
            >
              {{ "Total AMT" }}
            </div>

            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'TPN'
              "
            >
              {{ "TPN" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Payment Total Fees'
              "
            >
              {{ "Payment Total Fees" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Payment Tool Disc'
              "
            >
              {{ "Payment Tool Disc" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.value == 'Date/Time'
              "
            >
              {{ props.transaction.created_at }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Type'
              "
            >
              {{ "Type" }}
            </div>
            <div
              v-else-if="
                props.order == null &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Cash'
              "
            >
              {{ "Payment Tool" }}
            </div>
            <div v-else-if="props.order == null">
              {{ SPACED_BETWEEN_FIELDS[field.name]?.first_value || "" }}
            </div>
            <!--  ----------------------------------------- -->
            <!--  ----------------------------------------- -->
            <!--  ----------------------------------------- -->
            <!--  ----------------------------------------- -->
            <!--  ----------------------------------------- -->
            <div
              v-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'OrderID'
              "
            >
              {{
                props.posSetting && props.posSetting.order_prefix
                  ? props.posSetting.order_prefix
                  : "#"
              }}{{ props.order.id || "" }}
            </div>

            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'ReferenceID'
              "
            >
              #{{ props.transaction.id }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.value == 'Date/Time'
              "
            >
              {{ props.transaction.created_time_at }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Server'
              "
            >
              {{ props.transaction?.user?.name }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Cashier'
              "
            >
              {{ props.order?.user?.name ?? "" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Delivery fees'
              "
            >
              $ {{ props.order?.delivery_fee_amount }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Item Discount'
              "
            >
              {{ "" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Item Modifiers'
              "
            >
              {{ "" }}
            </div>

            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Tip'
              "
            >
              $ {{ props.order?.tip_amount }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Cash'
              "
            >
              {{
                props.transaction.payment_method +
                " ($" +
                props.transaction.total_amount +
                ")"
              }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Cash Tendered'
              "
            >
              $ {{ props.transaction.deposit_amount }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Change'
              "
            >
              $ {{ props.transaction.changes }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Invoice Email'
              "
            >
              {{ tenant.email }}
            </div>
            <div
              v-else-if="
                props.order &&
                props.order.customer &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Consumer'
              "
            >
              {{ props.order.customer?.first_name }}
              {{ props.order.customer?.last_name }}
            </div>

            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Guests'
              "
            >
              {{ "-" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'POS'
              "
            >
              {{ "#000" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Table'
              "
            >
              {{ "-" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Comment'
              "
            >
              {{ "-" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Subtotal'
              "
            >
              $ {{ props.order.subtotal }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Cash discount'
              "
            >
              $
              {{
                props.order.total_order_discount +
                props.order.total_items_discount
              }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Cash Fee'
              "
            >
              $ {{ props.order?.delivery_fee_amount }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Tax'
              "
            >
              {{ props.order.total_items_taxes }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Tax 1'
              "
            >
              {{ "" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Tax 2'
              "
            >
              {{ "" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Total AMT'
              "
            >
              $ {{ props.transaction.total_amount }}
            </div>

            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'TPN'
              "
            >
              {{ "" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Payment Total Fees'
              "
            >
              {{ "" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value ==
                  'Payment Tool Disc'
              "
            >
              {{ "" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Finish Time'
              "
            >
              {{ "" }}
            </div>
            <div
              v-else-if="
                props.order &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Type'
              "
            >
              {{ "Kitchen-bar" }}
            </div>
            <div
              v-else-if="
                props.order == null &&
                SPACED_BETWEEN_FIELDS[field.name]?.first_value == 'Cash'
              "
            >
              {{ "Cash" + " ($ 9.41)" }}
            </div>
            <div v-else-if="props.order == null">
              {{ SPACED_BETWEEN_FIELDS[field.name]?.second_value || "" }}
            </div>
          </div>
        </template>
        <template v-if="ONLY_TEXT_FIELDS.includes(field.name)">
          <div>{{ field.name }}</div>
        </template>
        <div
          class="py-1 flex justify-center items-center"
          :class="{
            'bg-black': field.selected_styles.includes('Highlight'),
          }"
          v-if="field.name === 'Delimiter'"
        >
          <div class="w-full" :class="getFieldClassName(field)"></div>
        </div>
        <div
          class="flex flex-col gap-"
          v-if="GROUPED_FIELDS.includes(field.name)"
        >
          <div
            class="text-center text-black uppercase"
            :class="hasItemDetailsOptions ? 'border-b-[2px] border-dashed' : ''"
          >
            {{ field.name }}
          </div>

          <template v-for="option in getGroupedOptions(field)" :key="option">
            <div
              class="flex justify-between"
              v-if="getIsGroupOptionVisible(field, option)"
            >
              <div
                v-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Comment'
                "
              >
                {{ "Comment" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Subtotal'
                "
              >
                {{ "Subtotal" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Delivery fees'
                "
              >
                {{ "Delivery fees" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Item Discount'
                "
              >
                {{ "Item Discount" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Total'
                "
              >
                {{ "Total" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value ==
                    'Highlight Modifiers'
                "
              >
                {{ "Highlight Modifiers" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Tax 1'
                "
              >
                <div
                  class="flex flex-col gap-4"
                  v-for="(item, index) in props.order.orderItems"
                >
                  Tax {{ index + 1 }}
                </div>
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Tax'
                "
              >
                {{ "Tax" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value ==
                    'Payment Total Fees'
                "
              >
                {{ "Payment Total Fees" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value ==
                    'Payment Tool Disc'
                "
              >
                {{ "Payment Tool Disc" }}
              </div>
              <div v-else-if="props.order == null">
                {{ SPACED_BETWEEN_FIELDS[option]?.first_value || "" }}
              </div>

              <div
                v-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Comment'
                "
              >
                {{ "-" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Subtotal'
                "
              >
                $ {{ props.order.subtotal }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Delivery fees'
                "
              >
                $ {{ props.order?.delivery_fee_amount }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Item Discount'
                "
              >
                $ {{ props.order.total_items_discount }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Total'
                "
              >
                $ {{ props.order.total_price }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value ==
                    'Highlight Modifiers'
                "
              >
                $ {{ props.order.total_items_modifiers }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Tax 1'
                "
              >
                <div
                  class="flex flex-col gap-4"
                  v-for="(item, index) in props.order.orderItems"
                >
                  $ {{ item.total_taxes }}
                </div>
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value == 'Tax'
                "
              >
                {{ props.order.total_items_taxes }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value ==
                    'Payment Total Fees'
                "
              >
                $ {{ props.order?.delivery_fee_amount }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[option]?.first_value ==
                    'Payment Tool Disc'
                "
              >
                $
                {{
                  props.order.total_order_discount +
                  props.order.total_items_discount
                }}
              </div>
              <div v-else-if="props.order == null">
                {{ SPACED_BETWEEN_FIELDS[option]?.second_value || "" }}
              </div>
            </div>
          </template>
        </div>
        <div class="flex flex-col gap-" v-if="field.name === 'Delivery Data'">
          <div
            class="text-center text-black uppercase border-b-[2px] border-dashed"
            :class="{
              'text-white': field.selected_styles.includes('Highlight'),
            }"
          >
            {{ field.name }}
          </div>
          <div class="flex flex-col pt-1">
            <div
              class="flex justify-between"
              v-for="shippingValue in field.options.shippingData"
              :key="shippingValue"
            >
              <div
                v-if="
                  props.order &&
                  props.order.customer &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'Name'
                "
              >
                {{ "Name" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  props.order.customer &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'City'
                "
              >
                {{ "City" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  props.order.customer &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'Address'
                "
              >
                {{ "Address" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  props.order.customer &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'Phone'
                "
              >
                {{ "Phone" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'Notes'
                "
              >
                {{ "Notes" }}
              </div>
              <div v-else-if="props.order == null">
                {{ SPACED_BETWEEN_FIELDS[shippingValue]?.first_value || "" }}
              </div>

              <div
                v-if="
                  props.order &&
                  props.order.customer &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'Name'
                "
              >
                {{ props.order.customer?.first_name }}
                {{ props.order.customer?.last_name }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  props.order.customer &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'City'
                "
              >
                {{ props.order.customer?.address?.city ?? "" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  props.order.customer &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'Address'
                "
              >
                {{ props.order.customer?.address?.address_line_1 ?? "" }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  props.order.customer &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'Phone'
                "
              >
                {{ props.order.customer?.phone }}
              </div>
              <div
                v-else-if="
                  props.order &&
                  SPACED_BETWEEN_FIELDS[shippingValue]?.first_value == 'Notes'
                "
              >
                Payment Method ({{ props.transaction.payment_method }})
              </div>
              <div v-else-if="props.order == null">
                {{ SPACED_BETWEEN_FIELDS[shippingValue]?.second_value || "" }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col gap-"
          v-if="field.name === 'Cash Discount' && props.order"
        >
          <div
            :class="getFieldClassName(field)"
            v-if="props.transaction.payment_method == 'cash'"
          >
            {{
              field?.display_when_paying_cash
                ? field.display_when_paying_cash.replace(
                    "@value",
                    " $ " +
                      calculateTwoNumbers(
                        props.order.total_order_discount,
                        props.order.total_items_discount
                      )
                  )
                : ""
            }}
          </div>
          <div
            :class="getFieldClassName(field)"
            v-if="props.transaction.payment_method != 'cash'"
          >
            {{
              field?.display_when_paying_other_types
                ? field?.display_when_paying_other_types.replace(
                    " @value",
                    " $ " +
                      calculateTwoNumbers(
                        props.order.total_order_discount,
                        props.order.total_items_discount
                      )
                  )
                : ""
            }}
          </div>
        </div>
        <div
          class="flex flex-col gap-"
          v-else-if="field.name === 'Cash Discount' && !props.order"
        >
          <div :class="getFieldClassName(field)">
            {{
              field?.display_when_paying_cash
                ? field.display_when_paying_cash.replace("@value", " $ 45.6")
                : ""
            }}
          </div>
          <div :class="getFieldClassName(field)">
            {{
              field?.display_when_paying_other_types
                ? field?.display_when_paying_other_types.replace(
                    " @value",
                    " $ 45.6"
                  )
                : ""
            }}
          </div>
        </div>
        <div v-if="field.name === 'Logo'">
          <div v-if="field?.options?.Logo?.image?.dataURL">
            <img :src="field.options?.Logo?.image?.dataURL" alt="Logo" />
          </div>
        </div>

        <div v-if="field.name === 'Pay By' && props.order">
          <div class="text-center text-bold">Pay By</div>
          <div
            class="flex justify-between gap-2"
            v-for="payByField in PAY_BY_FIELDS"
            :key="payByField"
          >
            <div
              v-if="SPACED_BETWEEN_FIELDS[payByField]?.first_value == 'Pay by'"
            >
              {{ "Pay By" }}
            </div>
            <div
              v-else-if="
                SPACED_BETWEEN_FIELDS[payByField]?.first_value == 'Cash'
              "
            >
              {{ "Cash" }}
            </div>

            <div
              v-if="SPACED_BETWEEN_FIELDS[payByField]?.second_value == 'Cash'"
            >
              {{ props.transaction.payment_method }}
            </div>
            <div
              v-else-if="
                SPACED_BETWEEN_FIELDS[payByField]?.second_value == '$ 58.65'
              "
            >
              $ {{ props.transaction.total_amount }}
            </div>
          </div>
        </div>
        <div v-else-if="field.name === 'Pay By' && props.order == null">
          <div class="text-center">Pay By</div>
          <div
            class="flex justify-between gap-2"
            v-for="payByField in PAY_BY_FIELDS"
            :key="payByField"
          >
            <div>
              {{ SPACED_BETWEEN_FIELDS[payByField]?.first_value || "" }}
            </div>
            <div>
              {{ SPACED_BETWEEN_FIELDS[payByField]?.second_value || "" }}
            </div>
          </div>
        </div>
        <div v-if="field.name === 'Suggested Tips'">
          <div class="text-center">Suggested Tips</div>
          <div
            class="flex justify-between gap-2"
            v-for="suggestedTip in SUGGESTED_TIPS_FIELDS"
            :key="suggestedTip"
          >
            <div>
              {{ SPACED_BETWEEN_FIELDS[suggestedTip]?.first_value || "" }}
            </div>
            <div>
              $
              {{
                (
                  (totalItemsAmounts *
                    (SPACED_BETWEEN_FIELDS[suggestedTip]?.first_value
                      .split(":")[1]
                      .replace("%", "") || 0)) /
                  100
                ).toFixed(2)
              }}
            </div>
          </div>
        </div>
        <div class="flex justify-center" v-if="field.name === 'QR Code'">
          <QRCodeVue3
            v-if="props.transaction"
            :value="'RefrenceId #' + props.transaction.id"
          />
          <img v-else src="../../../../assets/images/qr-code.png" />
        </div>
      </div>
    </div>
  </div>
</template>
