<script setup lang="ts">
import LoadingIcon from "@/base-components/LoadingIcon";
import { usePOSSettingsMenu } from "@/stores/pos-settings-menu";

const props = defineProps<{
  itemToEdit: any;
  isLoading?: boolean;
  isRefund?: boolean;
  amount?: any;
}>();

const menuStore = usePOSSettingsMenu();

const emit = defineEmits(["save"]);
const inputValue = ref(props.amount);
const isDollar = ref(false);
const error = ref("");

const appendValue = (value: string) => {
  if (inputValue.value === "0.00") {
    inputValue.value = value;
  } else {
    inputValue.value += value;
  }
  if (props.isRefund) {
    let amount = inputValue.value;
    emit("save", {
      amount,
    });
  }
};

const deleteLast = () => {
  if (inputValue.value.length > 1) {
    inputValue.value = inputValue.value.slice(0, -1);
    if (props.isRefund) {
      let amount = inputValue.value;
      emit("save", {
        amount,
      });
    }
  } else {
    onClearClick();
  }
};

const onCancelClick = () => {
  menuStore.setIsPopupVisible(false);
  const timer = setTimeout(() => {
    inputValue.value = "0.00";
    isDollar.value = false;
  }, 400);

  if (props.isRefund) {
    let amount = 0;
    emit("save", {
      amount,
    });
  }

  return () => {
    clearTimeout(timer);
  };
};

const onClearClick = () => {
  inputValue.value = "";
  if (props.isRefund) {
    let amount = 0;
    emit("save", {
      amount,
    });
  }
};

function extractNumber(value: string): number {
  const numericValue = value.replace(/[^0-9.]/g, "");
  return parseFloat(numericValue);
}

const onEnterClick = () => {
  const amount = extractNumber(inputValue.value);
  const type = isDollar.value ? "amount" : "percentage";

  if (isNaN(amount)) {
    error.value = "Please Enter Valid Number";
    return;
  } else {
    if (!amount) {
      error.value = "Value is required";
      return;
    }
  }
  if (!isDollar.value) {
    if (amount > 100) {
      error.value = "Percentage can`t exceed 100%";
      return;
    }
  }

  emit("save", {
    amount,
    type,
  });
};

const toggleDollar = () => {
  isDollar.value = !isDollar.value;
};

const btnClass = "p-4 rounded transition hover:opacity-70";

const numBtnClass =
  btnClass +
  " font-medium text-lg flex justify-center items-center shadow text-black hover:bg-primary hover:text-white hover:opacity-100";

const keys = [
  {
    label: "1",
    value: "1",
    class: numBtnClass,
    action: () => appendValue("1"),
  },
  {
    label: "2",
    value: "2",
    class: numBtnClass,
    action: () => appendValue("2"),
  },
  {
    label: "3",
    value: "3",
    class: numBtnClass,
    action: () => appendValue("3"),
  },
  { label: "⌫", value: "delete", class: "text-lg", action: deleteLast },
  {
    label: "4",
    value: "4",
    class: numBtnClass,
    action: () => appendValue("4"),
  },
  {
    label: "5",
    value: "5",
    class: numBtnClass,
    action: () => appendValue("5"),
  },
  {
    label: "6",
    value: "6",
    class: numBtnClass,
    action: () => appendValue("6"),
  },
  {
    label: "Cancel",
    value: "onCancelClick",
    class: btnClass + " text-white bg-danger",
    action: onCancelClick,
  },
  {
    label: "7",
    value: "7",
    class: numBtnClass,
    action: () => appendValue("7"),
  },
  {
    label: "8",
    value: "8",
    class: numBtnClass,
    action: () => appendValue("8"),
  },
  {
    label: "9",
    value: "9",
    class: numBtnClass,
    action: () => appendValue("9"),
  },
  {
    label: "Clear",
    value: "onClearClick",
    class: btnClass + "  text-white bg-blue-500",
    action: onClearClick,
  },
  {
    label: "$",
    value: "toggleDollar",
    class: btnClass + "  text-white bg-slate-500 text-lg font-medium",
    action: props.isRefund ? "" : toggleDollar,
  },
  {
    label: "0",
    value: "0",
    class: numBtnClass,
    action: () => appendValue("0"),
  },
  {
    label: ".",
    value: "00",
    class: numBtnClass,
    action: () => appendValue("."),
  },
  {
    label: "Enter",
    value: "enter",
    class: btnClass + " text-white bg-green-600",
    action: onEnterClick,
  },
];

watch(inputValue, () => {
  error.value = "";
});

watch(
  () => props.itemToEdit,
  (value) => {
    if (value?.amount) {
      inputValue.value = String(value?.amount);
      isDollar.value = value?.type === "amount";
    }
  },
  {
    immediate: true,
  }
);
</script>
<template>
  <div
    :class="{
      'pointer-events-none': isLoading,
    }"
  >
    <div
      class="text-danger my-2 h-4 opacity-0"
      :class="{
        'opacity-100': error,
      }"
    >
      {{ error }}
    </div>
    <div class="mb-4 grid input-grid">
      <span class="text-lg font-medium">{{
        props.isRefund || isDollar ? "$" : "%"
      }}</span>

      <input
        type="text"
        v-model="inputValue"
        readonly
        class="w-full text-center text-xl border-b-2 border-gray-300 focus:outline-none mx-auto"
      />
    </div>
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="key in keys"
        :key="key.value"
        :class="key.class"
        @click="key.action"
      >
        <template v-if="key.value === 'toggleDollar'">
          {{ isDollar ? "%" : "$" }}
        </template>
        <template v-else-if="key.value === 'enter'">
          <div class="flex" v-if="isLoading">
            <LoadingIcon
              icon="tail-spin"
              color="white"
              class="w-6 h-6 mx-auto"
            />
          </div>
          <span v-else> {{ key.label }}</span>
        </template>
        <template v-else>
          {{ key.label }}
        </template>
      </button>
    </div>
  </div>
</template>
<style scoped>
.input-grid {
  grid-template-columns: 16px 1fr;
}
</style>
