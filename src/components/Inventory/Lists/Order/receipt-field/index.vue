<script lang="ts" setup>
import Field from "@/components/Inventory/Lists/Order/receipt-field/field.vue";

const props = defineProps({
  receipts: {
    type: Object,
    default: {},
  },
  order: {
    type: Object,
    default: {},
  },
  transaction: {
    type: Object,
    default: {},
  },
  posSetting: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div
    v-if="
      props.receipts?.customer != undefined &&
      props.receipts?.customer?.fields?.length > 0
    "
  >
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
      :receipt="props.receipts?.customer"
      :order="props.order"
      :transaction="props.transaction"
      :posSetting="props.posSetting"
      class="md:w-[265px] mx-auto lg:w-auto"
    />
  </div>

  <div
    v-if="
      props.receipts?.['kitchen-bar'] != undefined &&
      props.receipts?.['kitchen-bar']?.fields?.length > 0
    "
  >
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
      :receipt="props.receipts?.['kitchen-bar']"
      :order="props.order"
      :transaction="props.transaction"
      :posSetting="props.posSetting"
      class="md:w-[265px] mx-auto lg:w-auto"
    />
  </div>

  <div
    v-if="
      props.receipts?.merchant != undefined &&
      props.receipts?.merchant?.fields?.length > 0
    "
  >
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
      :receipt="props.receipts?.merchant"
      :order="props.order"
      :transaction="props.transaction"
      :posSetting="props.posSetting"
      class="md:w-[265px] mx-auto lg:w-auto"
    />
  </div>

  <div
    v-if="
      props.receipts?.terminal != undefined &&
      props.receipts?.terminal?.fields?.length > 0
    "
  >
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
      :receipt="props.receipts?.terminal"
      :order="props.order"
      :transaction="props.transaction"
      :posSetting="props.posSetting"
      class="md:w-[265px] mx-auto lg:w-auto"
    />
  </div>
  <div
    v-if="
      props.receipts?.precheck != undefined &&
      props.receipts?.precheck?.fields?.length > 0
    "
  >
    <br />
    <div
      style="
        background-color: #e5e7eb;
        padding: 5px;
        font-weight: bold;
        margin-right: -4px;
      "
    >
      PreCheck Receipt
    </div>
    <br />
    <Field
      :type="'precheck'"
      :receipt="props.receipts?.precheck"
      :order="props.order"
      :transaction="props.transaction"
      :posSetting="props.posSetting"
      class="md:w-[265px] mx-auto lg:w-auto"
    />
  </div>
</template>
