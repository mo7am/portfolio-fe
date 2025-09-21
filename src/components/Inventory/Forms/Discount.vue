<script setup lang="ts">
import type { VForm } from "vuetify/components/VForm";
import { Toast } from "../../../plugins/swal";
import { useInventoryMenu } from "@/stores/inventory-menu";
import DatePicker from "@/base-components/DatePicker";

const props = defineProps<{
  idToEdit?: number;
  isInSettings?: boolean;
}>();
const emit = defineEmits(["submitted"]);

const discountTypes = [
  {
    key: true,
    title: "Card",
  },
  {
    key: false,
    title: "Item",
  },
];

const refForm = ref<VForm>();
const formData = reactive<any>({
  id: "",
  name: "",
  amount: 0,
  use_mode: "manual", //auto
  type: "amount",
  start_date: "", //if use_mode =auto
  end_date: "", //if use_mode =auto
  start_time: "00:00", //if use_mode =auto
  end_time: "23:59", //if use_mode =auto
  days: [], //if use_mode =auto
  is_cart_discount: false,
});

const weekDays = ref<any>([]);
const initialData = ref<any>({});
const isLoading = reactive({
  initial: false,
  submitting: false,
});
const api = inject<any>("api");
const menuStore = useInventoryMenu();
const submitType = ref("");

const createDiscount = async () => {
  isLoading.initial = true;
  try {
    const res = await api.inventory.discount.createDiscount();
    initialData.value = await res?.data;
    formData.is_cart_discount =
      menuStore.getDiscountType == "cart" ? true : false;
    let weekDaysArr = res?.data?.weekDays.map(function (obj: any) {
      return {
        checked: false,
        value: obj.value,
        name: obj.name,
      };
    });

    weekDays.value = weekDaysArr;
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const editDiscount = async (id: number) => {
  isLoading.initial = true;
  try {
    const res = await api.inventory.discount.editDiscount(id);
    initialData.value = await res?.data;
    const discount = initialData.value?.discount;
    if (discount) {
      Object.keys(formData).forEach((key) => {
        formData[key] = discount[key];
      });

      formData.start_time = discount.start_time
        ? discount?.start_time?.substring(0, discount?.start_time.length - 3) +
          ""
        : "";
      formData.end_time = discount.end_time
        ? discount?.end_time?.substring(0, discount?.end_time.length - 3) + ""
        : "";
      let weekDaysArr = res?.data?.weekDays.map(function (obj: any) {
        return {
          checked: false,
          value: obj.value,
          name: obj.name,
        };
      });

      if (discount?.days && discount?.days.length > 0) {
        let arr: any = [];
        res?.data?.weekDays.map(function (obj: any) {
          if (discount?.days.includes(obj.value)) {
            arr.push({
              checked: true,
              value: obj.value,
              name: obj.name,
            });
          } else {
            arr.push({
              checked: false,
              value: obj.value,
              name: obj.name,
            });
          }
        });
        weekDaysArr = arr;
      } else {
        formData.days = [];
      }
      weekDays.value = weekDaysArr;
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const onSubmit = async () => {
  if (!(await refForm.value?.validate())?.valid) {
    return;
  }
  isLoading.submitting = true;
  try {
    let formToSubmit = {
      ...formData,
      is_cart_discount: formData.is_cart_discount ? 1 : 0,
    };
    let response = undefined;
    const id = props.idToEdit ? props.idToEdit : menuStore.getIDToEdit;
    if (id) {
      response = await api.inventory.discount.updateDiscount(id, formToSubmit);
      submitType.value = "Updated";
    } else {
      response = await api.inventory.discount.storeDiscount(formToSubmit);
      submitType.value = "Created";
    }
    if (response !== undefined) {
      if (!props.isInSettings) {
        menuStore.setIsPopupVisible(false);
        menuStore.setIsGetData();
      } else {
        emit("submitted", response?.data?.data);
      }
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span style="font-size:14px">${
          "Discount " + submitType.value + " successfully"
        }</span>`,
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

const changeType = (type: string) => {
  formData.type = type;
};

const changeUseMode = (use_mode: string) => {
  formData.use_mode = use_mode;
};

const clearValidation = (input_id: string) => {
  removeError(input_id);
};

const selectDay = (day: string, event: any) => {
  var element = document.getElementById("1" + day);
  removeError("days");
  if (event.target.checked != undefined) {
    if (!event.target.checked) {
      element?.classList.remove("checked");
      const index = formData.days.indexOf(day);
      formData.days.splice(index, 1);
    } else {
      element?.classList.add("checked");
      formData.days.push(day);
    }
  }
};

watch(
  () => menuStore.getIDToEdit,
  (value) => {
    if (value) {
      editDiscount(value);
    } else {
      createDiscount();
    }
  },
  {
    immediate: true,
  }
);

const setIsCartDiscount = (type: boolean) => {
  formData.is_cart_discount = type;
};

watch(
  () => props.idToEdit,
  (value) => {
    if (value) {
      editDiscount(value);
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="mt-4" v-if="isLoading.initial">Loading...</div>
  <VForm
    ref="refForm"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4 mt-4"
    v-else
  >
    <div class="grid md:grid-cols-1 gap-4">
      <VCardText class="d-flex flex-column gap-2">
        <div>
          <VTabs class="v-tabs-pill" v-model="formData.type" fixed-tabs>
            <VTab
              v-for="discountType in initialData.DiscountTypes"
              :key="discountType.value"
              :value="discountType.value"
              @click="changeType(discountType.value)"
              >{{ discountType.name }}</VTab
            >
          </VTabs>
        </div>
      </VCardText>
      <div class="grid md:grid-cols-2 gap-4">
        <div id="name">
          <AppTextField
            v-model="formData.name"
            label="Name"
            form-id="name"
            placeholder="Type Here..."
            :rules="[requiredValidator, maxAlphaValidator(formData.name, 255)]"
            :isRequired="true"
          />
        </div>
        <div id="amount">
          <AppTextField
            @keyup="clearValidation('amount')"
            v-model="formData.amount"
            :label="`Amount ${formData.type == 'amount' ? '$' : '%'}`"
            form-id="amount"
            placeholder="Type Here..."
            :isRequired="true"
            :rules="[
              requiredValidator,
              decimalValidator(formData.percentage, 2),
            ]"
          />
        </div>
        <div>
          <label class="form-label">Use Mode</label>
          <VRadioGroup
            inline
            v-model="formData.use_mode"
            style="margin-top: 10px"
          >
            <VRadio
              v-for="(useModes, index) in initialData.DiscountUseModes"
              :label="useModes.name"
              :value="useModes.value"
              :style="index == 1 ? 'margin-left: 80px;' : ''"
              @click="changeUseMode(useModes.value)"
              density="compact"
            />
          </VRadioGroup>
        </div>
        <div v-if="!formData.id">
          <label class="form-label">Discount Type</label>
          <VRadioGroup
            inline
            v-model="formData.is_cart_discount"
            style="margin-top: 10px"
          >
            <VRadio
              v-for="(type, index) in discountTypes"
              :label="type.title"
              :value="type.key"
              :style="index == 1 ? 'margin-left: 80px;' : ''"
              @click="setIsCartDiscount(type.key)"
              density="compact"
            />
          </VRadioGroup>
        </div>
        <!-- <div
          v-if="!formData.id"
          class="flex justify-between"
          style="margin-top: 35px"
        >
          <div class="flex flex-col">
            <label class="text-base" for="is_cart_discount1"
              >Is Cart Discount</label
            >
            <span class="text-slate-400 text-xs">
              Discount's category can't be <br />
              changed after the discount creation.
            </span>
          </div>
          <div id="is_cart_discount">
            <VSwitch
              class="cursor-pointer"
              @click="formData.id ? false : setIsCartDiscount()"
              v-model="formData.is_cart_discount"
              id="is_cart_discount1"
              color="success"
              :readonly="formData.id ? true : false"
            />
          </div>
        </div> -->
      </div>

      <div :class="formData.use_mode == 'auto' ? '' : 'd-none'">
        <div class="grid md:grid-cols-2 gap-4">
          <div id="start_date">
            <DatePicker
              @update:model-value="clearValidation('start_date')"
              v-model="formData.start_date"
              label="Start Date"
              placeholder="Select Date"
              :config="{ inline: true }"
            />
          </div>
          <div id="end_date">
            <DatePicker
              @update:model-value="clearValidation('end_date')"
              v-model="formData.end_date"
              label="End Date"
              placeholder="Select Date"
              :config="{ inline: true }"
            />
          </div>
          <div id="start_time">
            <DatePicker
              @update:model-value="clearValidation('start_time')"
              v-model="formData.start_time"
              label="Start Time"
              placeholder="Select Time"
              :isTime="true"
              :isRequired="true"
              :config="{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
              }"
            />
          </div>
          <div id="end_time">
            <DatePicker
              @update:model-value="clearValidation('end_time')"
              v-model="formData.end_time"
              label="End Time"
              placeholder="Select Time"
              :isRequired="true"
              :isTime="true"
              :config="{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
              }"
            />
          </div>
        </div>
        <br />
        <div id="days">
          <div class="grid md:grid-cols-4 gap-4">
            <div class="d-flex gap-4">
              <div class="input-group" style="display: flex; margin-left: -7px">
                <div
                  :id="'1' + weekDay.value"
                  :class="weekDay.checked ? 'checked' : ''"
                  class="form-check custom-option custom-option-icon"
                  v-for="weekDay in weekDays"
                  v-on:click="selectDay(weekDay.value, $event)"
                >
                  <label
                    class="form-check-label custom-option-content"
                    :for="weekDay.value"
                  >
                    <span class="custom-option-body">
                      <span class="custom-option-title">
                        {{ weekDay.name }}
                      </span>
                    </span>
                    <input
                      v-model="weekDay.checked"
                      class="form-check-input"
                      type="checkbox"
                      :id="weekDay.value"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <div class="flex justify-end mt-4">
        <VBtn type="submit" class="btn btn-primary w-fit px-8">
          {{ isLoading.submitting ? "Loading..." : "Save" }}</VBtn
        >
      </div>
    </div>
  </VForm>
</template>

<style>
input[type="checkbox"] {
  display: none;
}
.d-none {
  display: none;
}
.custom-option.checked {
  background-color: #ff6f61 !important;
}

.custom-option-icon.checked .custom-option-body .custom-option-title {
  color: #ffffff !important;
}

.custom-option-icon {
  height: 40px;
  background-color: rgb(238, 238, 238);
  padding-top: 8px;
}

.custom-option.checked {
  border: 1px solid #ffffff !important;
}
.custom-option-icon .custom-option-content {
  padding: 9px 6px 5px 5px;
}
.custom-option.checked {
  border: 1px solid #ff6f61;
}
</style>
