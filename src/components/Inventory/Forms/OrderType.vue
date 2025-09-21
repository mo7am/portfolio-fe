<script setup lang="ts">
import ColorPicker from "@/base-components/ColorPicker";
import type { VForm } from "vuetify/components/VForm";
import { Toast } from "../../../plugins/swal";
import { useInventoryMenu } from "@/stores/inventory-menu";

const refForm = ref<VForm>();
const staticColors = [
  "#584aff",
  "#ffba08",
  "#54defd",
  "#7b4b94",
  "#d00000",
  "#00bd9d",
];

const formData = reactive<any>({
  id: "",
  name: "",
  color: staticColors[Math.floor(Math.random() * staticColors.length)],
  status: false,
  online: false,
  takeaway: false,
  delivery: false,
  postpone: false,
  pre_authorization: false,
  table_app: false,
  tax_exemption: false,
  is_default: false,
});

const initialData = ref<any>({});
const isLoading = reactive({
  initial: false,
  submitting: false,
});
const api = inject<any>("api");
const menuStore = useInventoryMenu();
const submitType = ref("");

const setStatus = () => {
  formData.status = formData.status ? false : true;
  removeError("status");
};

const setOnline = () => {
  formData.online = !formData.online;
  removeError("online");
};

const setDelivery = () => {
  formData.delivery = !formData.delivery;
  removeError("delivery");
};

const setIsDefault = () => {
  formData.is_default = !formData.is_default;
  removeError("is_default");
};

const setTakeaway = () => {
  formData.takeaway = !formData.takeaway;
  removeError("takeaway");
};

const setPostpone = () => {
  formData.postpone = !formData.postpone;
  removeError("postpone");
};

const setPreAuthorization = () => {
  formData.pre_authorization = !formData.pre_authorization;
  removeError("pre_authorization");
};

const setTaxExemption = () => {
  formData.tax_exemption = !formData.tax_exemption;
  removeError("tax_exemption");
};

const setTableApp = () => {
  formData.table_app = !formData.table_app;
  removeError("table_app");
};

const editOrderType = async (id: number) => {
  isLoading.initial = true;
  try {
    const res = await api.inventory.ordertype.editOrderType(id);
    initialData.value = await res?.data;
    const orderType = initialData.value?.orderType;
    if (orderType) {
      Object.keys(formData).forEach((key) => {
        formData[key] = orderType[key];
      });
      formData.status = orderType?.status === "active";
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
      status: formData.status ? "active" : "inactive",
    };
    let response = undefined;
    if (menuStore.getIDToEdit) {
      response = await api.inventory.ordertype.updateOrderType(
        menuStore.getIDToEdit,
        formToSubmit
      );
      submitType.value = "Updated";
    } else {
      response = await api.inventory.ordertype.storeOrderType(formToSubmit);
      submitType.value = "Created";
    }
    if (response !== undefined) {
      menuStore.setIsPopupVisible(false);
      menuStore.setIsGetData();
      resetForm();
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span style="font-size:14px">${
          "Order type " + submitType.value + " successfully"
        }</span>`,
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

function setColor(color: string) {
  formData.color = color;
  removeError("color");
  return;
}

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    if (key == "id" || key == "name" || key == "color") {
      formData[key] = "";
    } else if (key == "status") {
      formData[key] = true;
    } else {
      formData[key] = false;
    }
  });
};

watch(
  () => formData.delivery,
  (value) => {
    if (value) {
      formData.takeaway = false;
    }
  }
);

watch(
  () => formData.takeaway,
  (value) => {
    if (value) {
      formData.delivery = false;
    }
  }
);

watch(
  () => menuStore.getIDToEdit,
  (value) => {
    if (value) {
      editOrderType(value);
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div class="">
    <div class="mt-4" v-if="isLoading.initial">Loading...</div>
    <VForm
      ref="refForm"
      @submit.prevent="onSubmit"
      class="flex flex-col gap-3 mt-4"
      v-else
    >
      <div class="grid md:grid-cols-1 gap-4">
        <div id="name">
          <AppTextField
            @keyup="removeError('name')"
            v-model="formData.name"
            label="Name"
            form-id="name"
            placeholder="Type Here..."
            :rules="[requiredValidator]"
            :isRequired="true"
          />
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex justify-between">
            <div class="flex flex-col" id="delivery">
              <label class="text-base" for="status">Enable Status</label>
              <span class="text-slate-300 text-xs">
                Allow to disable Type without Deleting
              </span>
            </div>
            <div id="status">
              <VSwitch
                @click="setStatus()"
                v-model="formData.status"
                id="status"
                color="success"
                class="cursor-pointer"
              />
            </div>
          </div>
          <div class="flex justify-between">
            <div class="flex flex-col" id="is_default">
              <label class="text-base" for="is_default">Is Default</label>
            </div>
            <div id="is_default">
              <VSwitch
                @click="setIsDefault()"
                v-model="formData.is_default"
                id="status"
                color="success"
                class="cursor-pointer"
              />
            </div>
          </div>
          <div class="form-group">
            <div class="flex justify-between">
              <div class="flex flex-col" id="delivery">
                <label class="text-base" for="delivery1">Delivery</label>
              </div>
              <div>
                <VSwitch
                  @click="setDelivery()"
                  class="cursor-pointer"
                  v-model="formData.delivery"
                  id="delivery1"
                  color="success"
                  :disabled="formData.takeaway"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="flex justify-between">
              <div class="flex flex-col" id="postpone">
                <label class="text-base" for="postpone1">Postpone Option</label>
              </div>
              <div>
                <VSwitch
                  @click="setPostpone()"
                  class="cursor-pointer"
                  v-model="formData.postpone"
                  id="postpone1"
                  color="success"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="flex justify-between">
              <div class="flex flex-col" id="pre_authorization">
                <label class="text-base" for="pre_authorization1"
                  >PreAuthorization</label
                >
              </div>
              <div>
                <VSwitch
                  @click="setPreAuthorization()"
                  class="cursor-pointer"
                  v-model="formData.pre_authorization"
                  id="pre_authorization1"
                  color="success"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="flex justify-between">
              <div class="flex flex-col" id="takeaway">
                <label class="text-base" for="takeaway1">Take Away</label>
              </div>
              <div>
                <VSwitch
                  @click="setTakeaway()"
                  class="cursor-pointer"
                  v-model="formData.takeaway"
                  id="takeaway1"
                  color="success"
                  :disabled="formData.delivery"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="flex justify-between">
              <div class="flex flex-col" id="online">
                <label class="text-base" for="online1">Online Order</label>
              </div>
              <div>
                <VSwitch
                  @click="setOnline()"
                  class="cursor-pointer"
                  v-model="formData.online"
                  id="online1"
                  color="success"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="flex justify-between">
              <div class="flex flex-col" id="table_app">
                <label class="text-base" for="table_app1"
                  >Show in Table App</label
                >
              </div>
              <div>
                <VSwitch
                  @click="setTableApp()"
                  class="cursor-pointer"
                  v-model="formData.table_app"
                  id="table_app1"
                  color="success"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="flex justify-between">
              <div class="flex flex-col" id="tax_exemption">
                <label class="text-base" for="tax_exemption1"
                  >Tax Exemption</label
                >
              </div>
              <div>
                <VSwitch
                  @click="setTaxExemption()"
                  class="cursor-pointer"
                  v-model="formData.tax_exemption"
                  id="tax_exemption1"
                  color="success"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between gap-4">
                <div class="flex flex-col">
                  <div class="flex justify-between gap-4">
                    <label class="text-base" for="color">Pick Color</label>
                    <div class="flex gap-2 items-center">
                      <span
                        class="w-8 h-4 rounded-sm border-slate-100 border"
                        :style="{
                          backgroundColor: formData.color,
                        }"
                      ></span>
                    </div>
                  </div>
                </div>
                <div id="color">
                  <ColorPicker @setColor="setColor" />
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  class="w-8 h-8 rounded-full cursor-pointer hover:scale-[1.1] transition"
                  v-for="color in staticColors"
                  :key="color"
                  :style="{
                    backgroundColor: color,
                  }"
                  type="button"
                  @click="setColor(color)"
                ></button>
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
  </div>
</template>
