<script setup lang="ts">
import LoadingIcon from "../../base-components/LoadingIcon";
import FileUploader from "@/base-components/FileUploader";
import { Toast } from "../../plugins/swal";
import Lucide from "@/base-components/Lucide/Lucide.vue";

const props = defineProps<{
  preview: boolean;
  idToEdit: number;
}>();

interface Emit {
  (e: "update:isDialogVisible", value: boolean): void;
  (e: "getList"): void;
}

const emit = defineEmits<Emit>();
const api = inject<any>("api");
const isDeletePopupVisible = ref(false);
const checkFirstPhoneNumber = ref(false);
const checkSecondPhoneNumber = ref(false);
const uniqueEmailPopup = ref(false);
const isLoading = reactive({
  initial: false,
  submitting: false,
  check: false,
});
const form = reactive<any>({
  email: "",
  logo: "",
  business_id: "",
  business_name: "",
  phone_number_1: "",
  phone_number_2: "",
  currency_id: "",
  industry_id: "",
  country_id: "",
  status: true,
  isOldUser: false,
  address: {},
  user: {},
  is_image_cleared: false,
  first_phone_country_code: "US",
  second_phone_country_code: "EG",
});
const initialData = ref<any>({});
const imageToEdit = ref<any[]>([]);
const currencies = ref<any[]>([]);
const states = ref<any[]>([]);
const timeZones = ref<any[]>([]);
const phone_number_1_errors = ref("");
const phone_number_2_errors = ref("");
const isDisabledName = ref(false);
const isAdminEmail = ref(false);
const countryCallingCode1 = ref("");
const formatted1 = ref("");
const countryCallingCode2 = ref("");
const formatted2 = ref("");

const triggerDeletePopup = (value: boolean) => {
  isDeletePopupVisible.value = value;
};

const setFiles = (file: any) => {
  if (file === "") {
    form.is_image_cleared = true;
    return;
  } else {
    form.logo = file;
  }
  removeError("avatar");
};

const getCurrencies = (country_id: any) => {
  let countryObj = initialData.value.countries?.filter(function (obj: any) {
    return obj.id === country_id;
  });
  if (countryObj && countryObj[0] != undefined) {
    currencies.value = countryObj[0].currencies;
    states.value = countryObj[0].states;
    if (currencies.value.length == 0) {
      form.currency_id = "";
    }

    if (states.value.length == 0) {
      form.address.state_id = "";
      form.address.time_zone_id = "";
    }
  }
};

const getTimeZone = (state_id: any) => {
  let stateObj = states?.value?.filter(function (obj: any) {
    return obj.id === state_id;
  });
  if (stateObj[0] != undefined) {
    form.address.time_zone_id = stateObj[0].timeZone.id;
    timeZones.value = [
      {
        id: stateObj[0].timeZone.id,
        full_name:
          stateObj[0].timeZone.name +
          " (" +
          stateObj[0].timeZone.abbreviation +
          ")",
      },
    ];
  }
};

const resetPopup = () => {
  isDeletePopupVisible.value = false;

  const timer = setTimeout(() => {
    Object.keys(form).forEach((key) => {
      form[key] = key === "status" ? false : "";
    });
  }, 400);

  return () => {
    clearTimeout(timer);
  };
};

const getCreateMerchant = async () => {
  isLoading.initial = true;
  try {
    imageToEdit.value = [];
    const res = await api.admin.merchants.getCreateMerchant();
    initialData.value = await res?.data;
    timeZones.value = [];
    states.value = [];
    form.status = true;
    form.address = {};
    form.user = {};
    form.address.state_id = null;
    form.address.city = null;
    form.address.zip_code = null;
    form.address.address_line_1 = null;
    form.address.time_zone_id = null;
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
  phone_number_1_errors.value = "";
  phone_number_2_errors.value = "";
};

const getEditMerchant = async () => {
  isLoading.initial = true;
  try {
    const res = await api.admin.merchants.getEditMerchant(props.idToEdit);
    initialData.value = await res?.data;
    const merchant = await initialData.value?.merchant;

    if (merchant) {
      imageToEdit.value = [];
      Object.keys(form).forEach((key) => {
        if (key === "status") {
          form.status = merchant[key] === "active";
        } else if (key == "logo") {
          if (merchant?.logo) {
            form.logo = merchant.logo;
            imageToEdit.value.push({
              url: merchant.logo,
            });
          }
        } else {
          form[key] = merchant[key];
        }
      });
      if (merchant.address) {
        form.address.state_id = merchant.address?.state?.id ?? null;
        if (form.address.state_id) {
          getTimeZone(form.address.state_id);
        }
        form.address.time_zone_id = merchant.address?.timeZone?.id ?? null;
        form.address.city = merchant?.address?.city ?? "";
        form.address.zip_code = merchant?.address?.zip_code ?? "";
        form.address.address_line_1 = merchant?.address?.address_line_1 ?? "";
        delete form.address.state;
        delete form.address.timeZone;
        delete form.address.country_id;
        delete form.address.id;
      } else {
        form.address = {};
      }
      getCurrencies(merchant.country_id);
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
  phone_number_1_errors.value = "";
  phone_number_2_errors.value = "";
};

const onSubmit = async () => {
  isLoading.submitting = true;
  phone_number_1_errors.value = "";
  phone_number_2_errors.value = "";

  try {
    let formToSubmit: any = {
      ...form,
      is_image_cleared: form.is_image_cleared ? "1" : "0",
      isOldUser: form.isOldUser ? "1" : "0",
    };
    if (typeof formToSubmit.logo === "string") {
      const { logo, ...withOutImage } = formToSubmit;
      formToSubmit = withOutImage;
    }
    if (props.idToEdit) {
      const res = await api.admin.merchants.editMerchant(
        props.idToEdit,
        formToSubmit
      );
    } else {
      const res = await api.admin.merchants.createMerchant(formToSubmit);
    }

    Toast.fire({
      icon: "success",
      padding: "10px",
      background: "#fff",
      html: `<span style="font-size:14px">Merchant ${
        props.idToEdit ? "Updated" : "Added"
      } Successfully!</span>`,
    });
    resetPopup();
    emit("getList");
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

const setStatus = () => {
  form.status = !form.status;
  removeError("status");
};

const changeCountry = (event: any) => {
  form.currency_id = "";
  getCurrencies(event);
  removeError("country_id");
};

const changeState = (event: any) => {
  getTimeZone(event);
  removeError("address.state_id");
};

const checkPhone1 = (number: any) => {
  removeError("phone_number_1");
  if (checkFirstPhoneNumber.value) {
    phone_number_1_errors.value = "";
    if (
      checkFirstPhoneNumber.value &&
      form.phone_number_1.toLowerCase().indexOf(countryCallingCode1.value) ===
        -1
    ) {
      form.phone_number_1 = formatted1.value;
    }
  } else if (!checkFirstPhoneNumber.value && number.length > 0) {
    phone_number_1_errors.value = "The phone number 1 field format is invalid.";
  } else if (number.length == 0) {
    phone_number_1_errors.value = "The phone number 1 field is required.";
  }
};

const checkPhone2 = (number: any) => {
  removeError("phone_number_2");
  if (checkSecondPhoneNumber.value || number.length == 0) {
    phone_number_2_errors.value = "";
    if (
      checkSecondPhoneNumber.value &&
      form.phone_number_2.toLowerCase().indexOf(countryCallingCode2.value) ===
        -1
    ) {
      form.phone_number_2 = formatted2.value;
    }
  } else if (!checkSecondPhoneNumber.value) {
    phone_number_2_errors.value = "The phone number 2 field format is invalid.";
  }
};

const checkFirstPhone = (phoneObject: any) => {
  countryCallingCode1.value = "+" + phoneObject.countryCallingCode;
  formatted1.value = phoneObject.formatted;
  checkFirstPhoneNumber.value =
    !phoneObject.valid || phoneObject.valid == undefined ? false : true;
};

const checkSecondPhone = (phoneObject: any) => {
  countryCallingCode2.value = "+" + phoneObject.countryCallingCode;
  formatted2.value = phoneObject.formatted;
  checkSecondPhoneNumber.value =
    !phoneObject.valid || phoneObject.valid == undefined ? false : true;
};

const checkPhoneNumber = useDebounceFn((event: any, phone_id: string) => {
  var charCode = event.which ? event.which : event.keyCode;
  if (charCode >= 65 && charCode <= 90) {
    if (phone_id == "phone_number_1") {
      form.phone_number_1 = "";
    } else if (phone_id == "phone_number_2") {
      form.phone_number_2 = "";
    }
  } else {
    removeError(phone_id);
    if (phone_id == "phone_number_1") {
      if (
        /^(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          form.phone_number_1
        ) ||
        form.phone_number_1 == ""
      ) {
        phone_number_1_errors.value = "";
      } else {
        phone_number_1_errors.value =
          "The phone number 1 field format is invalid.";
      }
    }
    if (phone_id == "phone_number_2") {
      if (
        /^(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          form.phone_number_2
        ) ||
        form.phone_number_2 == ""
      ) {
        phone_number_2_errors.value = "";
      } else {
        phone_number_2_errors.value =
          "The phone number 2 field format is invalid.";
      }
    }
  }
}, 600);

const checkUserExistance = async () => {
  isLoading.check = true;
  try {
    const res = await api.admin.merchants.checkUserExistance({
      email: form.user.email,
    });
    form.isOldUser = false;
    let user = res.data.user;
    if (user.id) {
      uniqueEmailPopup.value = true;
      if (user.type == "admin") {
        isAdminEmail.value = true;
      } else {
        isAdminEmail.value = false;
        form.user.name = user.name;
        isDisabledName.value = true;
      }
    } else {
      uniqueEmailPopup.value = false;
      isDisabledName.value = false;
    }
    isLoading.check = false;
  } catch (error: any) {
    isLoading.check = false;
  }
};

const closeUniqueEmailPopup = () => {
  uniqueEmailPopup.value = false;
  form.isOldUser = false;
  isDisabledName.value = false;
};

// document.body.addEventListener("click", fn, true);

const checkEmail = useDebounceFn(() => {
  removeError("user.email");
  checkUserExistance();
}, 800);

watch(
  () => props.preview,
  (value) => {
    triggerDeletePopup(value);

    if (value) {
      if (props.idToEdit) {
        getEditMerchant();
      } else {
        getCreateMerchant();
      }
    }
  }
);

watch(isDeletePopupVisible, (value) => {
  emit("update:isDialogVisible", value);
  if (!value) {
    resetPopup();
  }
});

watch(checkFirstPhoneNumber, (value) => {
  if (value) {
    phone_number_1_errors.value = "";
  } else {
    phone_number_1_errors.value = "The phone number 1 field format is invalid.";
  }
});

watch(checkSecondPhoneNumber, (value) => {
  if (value) {
    phone_number_2_errors.value = "";
  } else {
    phone_number_2_errors.value = "The phone number 2 field format is invalid.";
  }
});
</script>

<template>
  <VDialog v-model="isDeletePopupVisible" width="1000">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="triggerDeletePopup(false)" />

    <VCard>
      <VForm @submit.prevent="onSubmit" class="py-8 px-4 flex flex-col gap-4">
        <h3 class="font-medium text-lg">
          {{ idToEdit ? "Edit" : "Add" }} Merchant
        </h3>
        <div class="flex p-4" v-if="isLoading.initial">
          <LoadingIcon icon="tail-spin" class="w-4 h-4 m-auto" color="black" />
        </div>
        <template v-else>
          <div id="avatar">
            <label
              >Logo
              <span class="text-xs"
                >(Allowed PNG or JPEG. Max size of 2MB.)</span
              ></label
            >
            <div class="mt-2">
              <FileUploader
                :accepted-types="['png', 'jpg', 'jpeg']"
                :setFiles="setFiles"
                :edit-form-files="imageToEdit"
                single
              />
            </div>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <div id="business_name">
              <AppTextField
                @keyup="removeError('business_name')"
                v-model="form.business_name"
                label="Business Name"
                placeholder="Type Here..."
                :isRequired="true"
              />
            </div>
            <div id="business_id">
              <AppTextField
                @keyup="removeError('business_id')"
                v-model="form.business_id"
                label="Business ID"
                placeholder="Type Here..."
                :isRequired="true"
              />
            </div>
            <div id="email">
              <AppTextField
                @keyup="removeError('email')"
                v-model="form.email"
                label="Email"
                placeholder="Type Here..."
                :isRequired="true"
              />
            </div>
            <div id="industry_id">
              <AppSelect
                @update:model-value="removeError('industry_id')"
                v-model="form.industry_id"
                :items="initialData?.industries"
                label="Industry"
                item-title="name"
                item-value="id"
                form-id="industry_id"
                placeholder="Select Industry"
                :isRequired="true"
              />
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div id="phone_number_1">
                <VLabel
                  for="phone_number_1"
                  class="mb-2"
                  :text="'First Contact'"
                >
                </VLabel>
                <!-- @validate="checkFirstPhone($event)" -->
                <vue-tel-input
                  @validate="checkFirstPhone($event)"
                  @country-changed="checkFirstPhone($event)"
                  @keyup="checkPhone1(form.phone_number_1)"
                  v-model="form.phone_number_1"
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
                <!-- <AppTextField
                  @keyup="checkPhoneNumber($event, 'phone_number_1')"
                  v-model="form.phone_number_1"
                  label="First Contact"
                  placeholder="( +1-xxx-xxx-xxxx )"
                  :isRequired="true"
                /> -->
                <div
                  class="v-input__details"
                  :style="
                    phone_number_1_errors != ''
                      ? 'display:block'
                      : 'display:none'
                  "
                >
                  <div class="text-sm text-danger mt-1">
                    {{ phone_number_1_errors }}
                  </div>
                </div>
              </div>
              <div id="phone_number_2">
                <VLabel
                  for="phone_number_2"
                  class="mb-2"
                  :text="'Second Contact'"
                >
                </VLabel>
                <vue-tel-input
                  @validate="checkSecondPhone($event)"
                  @country-changed="checkSecondPhone($event)"
                  @keyup="checkPhone2(form.phone_number_2)"
                  v-model="form.phone_number_2"
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
                <!-- <AppTextField
                  @keyup="checkPhoneNumber($event, 'phone_number_2')"
                  v-model="form.phone_number_2"
                  label="Second Contact"
                  placeholder="( +1-xxx-xxx-xxxx )"
                /> -->
                <div
                  class="v-input__details"
                  :style="
                    phone_number_2_errors != ''
                      ? 'display:block'
                      : 'display:none'
                  "
                >
                  <div class="text-sm text-danger mt-1">
                    {{ phone_number_2_errors }}
                  </div>
                </div>
              </div>
            </div>
            <div id="country_id">
              <AppSelect
                @update:model-value="changeCountry($event)"
                v-model="form.country_id"
                :items="initialData?.countries"
                label="Country"
                item-title="name"
                item-value="id"
                form-id="country_id"
                placeholder="Select Country"
                :isRequired="true"
              />
            </div>
            <div id="currency_id">
              <AppSelect
                @update:model-value="removeError('currency_id')"
                v-model="form.currency_id"
                :items="currencies"
                label="Currency"
                item-title="code"
                item-value="id"
                form-id="currency_id"
                placeholder="Select Currency"
                :isRequired="true"
              />
            </div>
            <div class="flex justify-between">
              <div class="flex flex-col" id="delivery">
                <label class="text-base" for="status-switch"
                  >Enable Status</label
                >
                <span class="text-slate-300 text-xs">
                  The activation email will be sent only when the status is
                  active.
                </span>
              </div>
              <div id="status" style="margin-top: 30px">
                <VSwitch
                  @click="setStatus"
                  v-model="form.status"
                  id="status-switch"
                  color="success"
                  class="cursor-pointer"
                />
              </div>
            </div>
          </div>

          <b>Address</b>
          <div class="grid md:grid-cols-2 gap-4">
            <div id="address.address_line_1">
              <AppTextField
                @keyup="removeError('address.address_line_1')"
                v-model="form.address.address_line_1"
                label="Address Line 1"
                placeholder="Type Here..."
              />
            </div>
            <div id="address.zip_code">
              <AppTextField
                @keyup="removeError('address.zip_code')"
                v-model="form.address.zip_code"
                label="Zip Code"
                placeholder="Type Here..."
              />
            </div>
            <div id="address.state_id">
              <AppSelect
                @update:model-value="changeState($event)"
                v-model="form.address.state_id"
                :items="states"
                label="State"
                item-title="name"
                item-value="id"
                form-id="state_id"
                placeholder="Select State"
              />
            </div>
            <div id="address.time_zone_id">
              <AppSelect
                @update:model-value="removeError('address.time_zone_id')"
                v-model="form.address.time_zone_id"
                :items="timeZones"
                label="Time Zone"
                item-title="full_name"
                item-value="id"
                form-id="time_zone_id"
                placeholder="Select time zone"
              />
            </div>
            <div id="address.city">
              <AppTextField
                @keyup="removeError('address.city')"
                v-model="form.address.city"
                label="City"
                placeholder="Type Here..."
              />
            </div>
          </div>
          <template v-if="!props.idToEdit">
            <b>Invite Admin</b>
            <div class="grid md:grid-cols-2 gap-4">
              <div id="user.name">
                <AppTextField
                  :readOnly="isDisabledName"
                  @keyup="removeError('user.name')"
                  v-model="form.user.name"
                  label="Full Name"
                  placeholder="Type Here..."
                  :isRequired="true"
                />
              </div>
              <div id="user.username">
                <AppTextField
                  @keyup="removeError('user.username')"
                  v-model="form.user.username"
                  label="User Name"
                  placeholder="Type Here..."
                />
              </div>
              <div id="user.email">
                <AppTextField
                  v-model="form.user.email"
                  @keyup="checkEmail()"
                  label="Email"
                  placeholder="Type Here..."
                />
              </div>
            </div>
          </template>
          <div>
            <VBtn
              v-if="
                phone_number_1_errors != '' ||
                phone_number_2_errors != '' ||
                isLoading.check
              "
              block
              color="black"
              class="text-white min-w-[100px] w-fit m-auto"
            >
              <span>Save</span>
            </VBtn>
            <VBtn
              v-else
              type="submit"
              block
              color="black"
              class="text-white min-w-[100px] w-fit m-auto"
            >
              <LoadingIcon
                icon="tail-spin"
                class="w-4 h-4 m-auto"
                color="white"
                v-if="isLoading.submitting"
              />
              <span v-else>Save</span>
            </VBtn>
          </div>
        </template>
      </VForm>
    </VCard>
  </VDialog>

  <VDialog v-model="uniqueEmailPopup" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="closeUniqueEmailPopup" />

    <VCard>
      <div class="py-8 px-4">
        <div class="mb-2 flex">
          <Lucide icon="AlertTriangle" class="m-auto w-16 h-16 text-danger" />
        </div>
        <div v-if="!isAdminEmail" class="text-center text-xl text-danger">
          Email is already exists, are you sure you want to add this user to
          this merchant ?
        </div>
        <div v-else class="text-center text-xl text-danger">
          Email is already exists for pps admin, you are not be able to use it !
        </div>
        <div v-if="!isAdminEmail" class="mt-4 flex justify-center">
          <VBtn :color="'warning'" @click="closeUniqueEmailPopup">No!</VBtn>
          &nbsp;&nbsp;&nbsp;
          <VBtn
            class="flex text-white"
            :color="'primary'"
            @click="
              uniqueEmailPopup = false;
              form.isOldUser = true;
            "
          >
            <span>Yes?</span>
          </VBtn>
        </div>
        <div v-else class="mt-4 flex justify-center">
          <VBtn :color="'warning'" @click="closeUniqueEmailPopup">CLose!</VBtn>
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
