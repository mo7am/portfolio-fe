<script setup lang="ts">
import LoadingIcon from "../../base-components/LoadingIcon";
import { Toast } from "../../plugins/swal";
import DatePicker from "@/base-components/DatePicker";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import Lucide from "@/base-components/Lucide/Lucide.vue";

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "getList"): void;
  (e: "updatePreview", customer: Object): void;
}

const emit = defineEmits<Emit>();
const api = inject<any>("api");
const isLoading = reactive({
  initial: false,
  submitting: false,
  fetching: false,
});

const props = defineProps<{
  preview: boolean;
  idToEdit: number;
}>();
const checkPhoneNumber = ref(false);
const phone_errors = ref("");
const countryCallingCode = ref("");
const formatted = ref("");
const isDisabledPhone = ref(false);
const uniquePhonePopup = ref(false);

const form = reactive<any>({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  birthday: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state_id: "",
  zip_code: "",
  notes: "",
});

const initialData = ref<any>({});
const existCustomerId = ref<any>(0);
const imageToEdit = ref<any[]>([]);

const getCreateCustomer = async () => {
  isLoading.initial = true;
  try {
    imageToEdit.value = [];
    const res = await api.customer.createCustomer();
    initialData.value = await res?.data;
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const getEditCustomer = async () => {
  isLoading.initial = true;
  try {
    let id =
      existCustomerId.value != 0 ? existCustomerId.value : props.idToEdit;
    const res = await api.customer.editCustomer(id);
    initialData.value = await res?.data;
    const customer = initialData.value?.customer;
    if (customer) {
      Object.keys(form).forEach((key) => {
        form[key] = customer[key];
      });
      form.state_id = customer.address
        ? customer.address.state
          ? customer.address.state.id
          : null
        : null;
      form.city = customer.address ? customer.address.city : null;
      form.zip_code = customer.address ? customer.address.zip_code : null;
      form.address_line_1 = customer.address
        ? customer.address.address_line_1
        : null;
      form.address_line_2 = customer.address
        ? customer.address.address_line_2
        : null;
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const onSubmit = async () => {
  isLoading.submitting = true;
  var customer = null;
  let id = existCustomerId.value != 0 ? existCustomerId.value : props.idToEdit;
  try {
    if (id != 0) {
      const res = await api.customer.updateCustomer(id, form);
      customer = res?.data?.data;
    } else {
      const res = await api.customer.storeCustomer(form);
      customer = res?.data?.data;
    }

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Customer ${
        id != 0 ? "Updated" : "Added"
      } Successfully!</span>`,
    });
    emit("updatePreview", customer);
    emit("getList");
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

if (props.preview && props.idToEdit != 0) {
  getEditCustomer();
} else {
  getCreateCustomer();
}

const checkPhone = (phoneObject: any) => {
  removeError("phone");
  countryCallingCode.value = "+" + phoneObject.countryCallingCode;
  formatted.value = phoneObject.formatted;
  checkPhoneNumber.value =
    !phoneObject.valid || phoneObject.valid == undefined ? false : true;
  if (form.phone != "" && checkPhoneNumber.value) {
    checkUniqueCustomerPhone(phoneObject.formatted);
  }
};

const checkUniqueCustomerPhone = async (phone = form.phone) => {
  try {
    let id =
      existCustomerId.value != 0 ? existCustomerId.value : props.idToEdit;
    const res = await api.customer.checkUniqueCustomerPhone(id, {
      phone: phone,
    });
  } catch (error: any) {
    console.log(error);
    if (error.response.status == 422) {
      isDisabledPhone.value = true;
      uniquePhonePopup.value = true;
    }
  }
};

const fn = () => {
  if (uniquePhonePopup.value) {
    closeUniquePhonePopup();
  }
};

document.body.addEventListener("click", fn, true);

const updateExisting = async () => {
  isLoading.fetching = true;
  try {
    if (form.phone != "") {
      const res = await api.customer.getExistingCustomerByPhone(form.phone);
      const customer = res.data.data;
      if (customer) {
        existCustomerId.value = customer.id;
        form.first_name =
          form.first_name == "" ? customer.first_name : form.first_name;
        form.last_name =
          form.last_name == "" ? customer.last_name : form.last_name;
        form.email = form.email == "" ? customer.email : form.email;
        form.phone = form.phone == "" ? customer.phone : form.phone;
        form.birthday = form.birthday == "" ? customer.birthday : form.birthday;
        form.notes = form.notes == "" ? customer.notes : form.notes;

        form.state_id =
          form.state_id == ""
            ? customer.address
              ? customer.address.state
                ? customer.address.state.id
                : null
              : null
            : form.state_id;
        form.city =
          form.city == ""
            ? customer.address
              ? customer.address.city
              : null
            : form.city;
        form.zip_code =
          form.zip_code == ""
            ? customer.address
              ? customer.address.zip_code
              : null
            : form.zip_code;
        form.address_line_1 =
          form.address_line_1 == ""
            ? customer.address
              ? customer.address.address_line_1
              : null
            : form.address_line_1;
        form.address_line_2 =
          form.address_line_2 == ""
            ? customer.address
              ? customer.address.address_line_2
              : null
            : form.address_line_2;
      }
    }
    isLoading.fetching = false;
  } catch (error: any) {
    console.log(error);
  }
};

const closeUniquePhonePopup = () => {
  isDisabledPhone.value = false;
  uniquePhonePopup.value = false;
};

const check = useDebounceFn((number: any) => {
  removeError("phone");
  if (checkPhoneNumber.value || number.length != 0) {
    phone_errors.value = "";
    if (
      checkPhoneNumber.value &&
      form.phone.toLowerCase().indexOf(countryCallingCode.value) === -1
    ) {
      form.phone = formatted.value;
    }
    checkUniqueCustomerPhone();
  } else if (!checkPhoneNumber.value) {
    phone_errors.value = "The phone field format is invalid.";
  }
}, 800);

watch(
  () => props.idToEdit,
  (value) => {
    if (value != 0) {
      existCustomerId.value = 0;
      getEditCustomer();
    }
  }
);

watch(checkPhoneNumber, (value) => {
  if (value) {
    phone_errors.value = "";
  } else {
    phone_errors.value = "The phone field format is invalid.";
  }
});
</script>

<template>
  <VCard height="515" class="d-flex flex-column">
    <PerfectScrollbar
      :options="{ wheelPropagation: false }"
      style="margin-right: -20px"
    >
      <div class="flex p-4" v-if="isLoading.initial">
        <LoadingIcon icon="tail-spin" class="w-4 h-4 m-auto" color="black" />
      </div>
      <template v-else style="padding: 20px">
        <VCardText>
          <div class="grid md:grid-cols-2 gap-4">
            <div id="first_name">
              <AppTextField
                @keyup="removeError('first_name')"
                v-model="form.first_name"
                label="First Name"
                placeholder="Type Here..."
              />
            </div>
            <div id="last_name">
              <AppTextField
                @keyup="removeError('last_name')"
                v-model="form.last_name"
                label="Last Name"
                placeholder="Type Here..."
              />
            </div>
            <div id="email">
              <AppTextField
                @keyup="removeError('email')"
                v-model="form.email"
                label="Email"
                placeholder="Type Here..."
              />
            </div>
            <div id="phone">
              <VLabel for="phone" class="mb-2" :text="'Phone'"> </VLabel>
              <vue-tel-input
                :disabled="isDisabledPhone"
                @validate="checkPhone($event)"
                @country-changed="checkPhone($event)"
                @keyup="check(form.phone)"
                v-model="form.phone"
                defaultCountry="US"
                mode="international"
                :autoDefaultCountry="true"
                invalidMsg="dasdsadsa"
                :validCharactersOnly="true"
                :autoFormat="true"
                :inputOptions="{
                  maxlength: 25,
                  required: true,
                  autocomplete: 'on',
                  placeholder: 'Enter Phone Number',
                }"
                :dropdownOptions="{
                  showSearchBox: true,
                  searchBoxPlaceholder: 'Search Country',
                  showFlags: true,
                  showDialCodeInList: true,
                  showDialCodeInSelection: false,
                }"
              ></vue-tel-input>
              <div
                class="v-input__details"
                :style="phone_errors != '' ? 'display:block' : 'display:none'"
              >
                <div class="text-sm text-danger mt-1">
                  {{ phone_errors }}
                </div>
              </div>
            </div>
            <div id="birthday">
              <DatePicker
                @update:model-value="removeError('birthday')"
                v-model="form.birthday"
                label="Birthday"
                placeholder="Select Date"
                :config="{ inline: true }"
              />
            </div>
          </div>
          <p style="margin-top: 17px; font-weight: bold">Address</p>
          <div class="grid md:grid-cols-2 gap-4">
            <div id="address_line_1">
              <AppTextField
                @keyup="removeError('address_line_1')"
                v-model="form.address_line_1"
                label="Address Line 1"
                placeholder="Type Here..."
              />
            </div>
            <div id="address_line_2">
              <AppTextField
                @keyup="removeError('address_line_2')"
                v-model="form.address_line_2"
                label="Address Line 2"
                placeholder="Type Here..."
              />
            </div>
            <div id="zip_code">
              <AppTextField
                @keyup="removeError('zip_code')"
                v-model="form.zip_code"
                label="Zip Code"
                placeholder="Type Here..."
              />
            </div>
            <div id="state_id">
              <AppSelect
                @update:model-value="removeError('state_id')"
                v-model="form.state_id"
                :items="initialData.states"
                label="State"
                item-title="name"
                item-value="id"
                form-id="state_id"
                placeholder="Select State"
              />
            </div>
            <div id="city">
              <AppTextField
                @keyup="removeError('city')"
                v-model="form.city"
                label="City"
                placeholder="Type Here..."
              />
            </div>
            <div class="col-span-full" id="notes">
              <AppTextarea
                @keyup="removeError('notes')"
                v-model="form.notes"
                label="Notes"
                placeholder="Notes"
              />
            </div>
          </div>
        </VCardText>
      </template>
    </PerfectScrollbar>
    <div>
      <VCol cols="12" class="d-flex gap-4">
        <VBtn class="text-white" v-if="phone_errors != ''">
          <span>Save</span>
        </VBtn>
        <VBtn type="submit" class="text-white" @click="onSubmit" v-else>
          <LoadingIcon
            icon="tail-spin"
            class="w-4 h-4 m-auto"
            color="white"
            v-if="isLoading.submitting"
          />
          <span v-else>Save</span>
        </VBtn>
      </VCol>
    </div>
  </VCard>
  <VDialog v-model="uniquePhonePopup" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeUniquePhonePopup()" />

    <VCard>
      <div class="py-8 px-4">
        <div class="mb-2 flex">
          <Lucide icon="AlertTriangle" class="m-auto w-16 h-16 text-danger" />
        </div>
        <div class="text-center text-xl text-danger">
          The user that belong to this phone number is exists ?
        </div>
        <div class="mt-4 flex justify-center">
          <VBtn :color="'warning'" @click="closeUniquePhonePopup()"
            >Cancel!</VBtn
          >
          &nbsp;&nbsp;&nbsp;
          <VBtn
            class="flex text-white"
            :color="'primary'"
            @click="updateExisting"
          >
            <LoadingIcon
              icon="tail-spin"
              color="white"
              class="w-4 h-4 m-auto"
              v-if="isLoading.fetching"
            />
            <span v-else>Update Existing?</span>
          </VBtn>
        </div>
      </div>
    </VCard>
  </VDialog>
</template>

<style>
.vue-tel-input {
  border-radius: 6px !important;
  display: flex !important;
  border: 1px solid #cfc3c3 !important;
  text-align: left !important;
  height: 40px !important;
}
</style>
