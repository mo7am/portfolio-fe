<script setup lang="ts">
import { useLocationMenu } from "@/stores/locations-menu";
import type { VForm } from "vuetify/components/VForm";
import LoadingIcon from "@/base-components/LoadingIcon";
import { useUserStore } from "@/stores/user";
import { Toast } from "@/plugins/swal";
import Lucide from "@/base-components/Lucide/Lucide.vue";

const api = inject<any>("api");
const props = defineProps({
  merchant_id: {
    type: Number,
    default: null,
  },
});
// const props = defineProps<{
//   merchant_id: number;
// }>();

const emit = defineEmits(["closePopup"]);
const formData = reactive<any>({
  id: null,
  name: "",
  status: false,
  email: null,
  username: null,
  role_id: "",
  password: "",
  pin_code: "",
  phone: "",
  isOldUser: false,
});

const countryCallingCode = ref("");
const formatted = ref("");
const isAdminEmail = ref(false);
const isDisabledName = ref(false);
const uniqueEmailPopup = ref(false);
const submitType = ref("");
const message = ref("");
const isPasswordVisible = ref(false);
const isInvited = ref(false);
const checkPasswordRequire = ref(false);
const checkPhoneNumber = ref(false);
const phone_errors = ref("");
const isAdmin = ref(false);
const capsLockActive = ref(false);
const isLoading = reactive({
  initial: false,
  submitting: false,
  check: false,
});
const userStore = useUserStore();
const tenant_id = userStore.getTenant?.id;
const initialData = ref<any>({});
const menuStore = useLocationMenu();

const getCreateOperator = async () => {
  isLoading.initial = true;
  try {
    let params = {};
    if (props.merchant_id > 0) {
      let formToSubmitAdmin = {
        params: {
          merchant_id: props.merchant_id,
        },
      };
      const res = await api.admin.operator.createOperator(formToSubmitAdmin);
      initialData.value = await res?.data;
      formData.username = "";
      formData.password = "";
    } else {
      const res = await api.operator.createOperator();
      initialData.value = await res?.data;
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const checkPhone = (phoneObject: any) => {
  countryCallingCode.value = "+" + phoneObject.countryCallingCode;
  formatted.value = phoneObject.formatted;
  checkPhoneNumber.value =
    !phoneObject.valid || phoneObject.valid == undefined ? false : true;
};

const check = (number: any) => {
  removeError("phone");
  if (checkPhoneNumber.value || number.length == 0) {
    phone_errors.value = "";
    if (
      checkPhoneNumber.value &&
      formData.phone.toLowerCase().indexOf(countryCallingCode.value) === -1
    ) {
      formData.phone = formatted.value;
    }
  } else if (!checkPhoneNumber.value) {
    phone_errors.value = "The phone field format is invalid.";
  }
};

watch(checkPhoneNumber, (value) => {
  if (value) {
    phone_errors.value = "";
  } else {
    phone_errors.value = "The phone field format is invalid.";
  }
});

const getEditOperator = async (id: number) => {
  isLoading.initial = true;
  try {
    const res = await api.operator.editOperator(id);
    initialData.value = await res?.data;
    const operator = initialData.value?.operator;
    let merchant = null;
    if (operator.merchants.length > 0) {
      merchant = operator.merchants.find(
        (merchant: any) => merchant.id === tenant_id
      );
    }

    if (operator) {
      formData.id = operator?.id;
      formData.name = operator?.name;
      formData.email = operator?.email;
      formData.username = merchant?.merchant_user?.username;
      formData.role_id = operator?.role?.id;
      formData.pin_code = merchant?.merchant_user?.pin_code;
      formData.phone = operator?.phone;
      formData.password = "";
      formData.status = operator?.status === "active";
      isInvited.value = operator?.is_invited;
      checkPasswordRequire.value =
        (!formData.id &&
          !operator?.is_invited &&
          (formData.email || formData.username)) ||
        (formData.id && !operator?.is_invited && formData.email)
          ? true
          : false;
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.initial = false;
};

const onSubmit = async () => {
  isLoading.submitting = true;
  try {
    let formToSubmit = {
      ...formData,
      status: formData.status ? "active" : "inactive",
      merchant_id: tenant_id,
    };
    let response = undefined;
    if (menuStore.getIDToEdit) {
      response = await api.operator.updateOperator(
        menuStore.getIDToEdit,
        formToSubmit
      );
      submitType.value = "Updated";
    } else {
      if (props.merchant_id > 0) {
        let formToSubmitAdmin = {
          ...formToSubmit,
          merchant_id: props.merchant_id,
        };
        response = await api.admin.operator.storeOperator(formToSubmitAdmin);
        isAdmin.value = true;
      } else {
        response = await api.operator.storeOperator(formToSubmit);
      }
      submitType.value = "Created";
    }

    if (response !== undefined) {
      if (isAdmin.value) {
        emit("closePopup");
      } else {
        menuStore.setIsPopupVisible(false);
        menuStore.setIsGetData();
      }
      Toast.fire({
        icon: "success",
        padding: "10px",
        background: "#fff",
        html: `<span style="font-size:14px">${
          "Operator " + submitType.value + " successfully"
        }</span>`,
      });
    }
  } catch (error) {
    console.log(error);
  }
  isLoading.submitting = false;
};

watch(
  () => menuStore.getIDToEdit,
  (value) => {
    if (value) {
      getEditOperator(value);
    } else {
      getCreateOperator();
    }
  },
  {
    immediate: true,
  }
);

const checkValue = async () => {
  removeError("password");
  if (formData.password == "") {
    const element = document.getElementById("passwordId");
    if (element) {
      element.style.marginTop = "-10px";
    }
  } else {
    const element = document.getElementById("passwordId");
    if (element) {
      element.style.marginTop = "0px";
    }
  }
};

const onSwitchClick = () => {
  formData.status = !formData.status;
};

const checkCapsLock = async (event: any) => {
  if (capsLockActive) {
    capsLockActive.value = event?.getModifierState("CapsLock");
  }
};

const checkUserExistance = async () => {
  isLoading.check = true;
  try {
    const res = await api.admin.merchants.checkUserExistance({
      email: formData.email,
    });
    formData.isOldUser = false;
    let user = res.data.user;
    if (user != undefined && user.id) {
      if (user.type == "admin") {
        isAdminEmail.value = true;
        uniqueEmailPopup.value = true;
        message.value =
          "Email is already exists for pps admin, you are not be able to use it !";
      } else {
        let tenant = user.merchants.find(
          (merchant: any) => merchant.id === tenant_id
        );
        if (
          !user.merchants.some(function (el: any) {
            return el.id === tenant_id;
          })
        ) {
          formData.isOldUser = true;
          // uniqueEmailPopup.value = true;
          isAdminEmail.value = false;
          formData.name = user.name;
          formData.phone = user.phone;
          formData.status = user?.is_active;
          isDisabledName.value = true;
        } else if (
          tenant.merchant_user.user_id == user.id &&
          tenant.merchant_user.is_admin == 1
        ) {
          uniqueEmailPopup.value = true;
          isAdminEmail.value = true;
          message.value =
            "Email is already exists for this merchant admin, you are not be able to use it !";
        }
      }
    } else {
      uniqueEmailPopup.value = false;
      isDisabledName.value = false;
    }
    checkPasswordRequire.value =
      (!formData.id &&
        !isInvited.value &&
        (formData.email || formData.username)) ||
      (formData.id && !isInvited.value && formData.email)
        ? true
        : false;

    isLoading.check = false;
  } catch (error: any) {}
};

const checkEmail = useDebounceFn(() => {
  removeError("email");
  checkUserExistance();
}, 800);

const changeUserName = useDebounceFn(() => {
  removeError("username");
  if (formData.username || (formData.email && !isInvited.value)) {
    checkPasswordRequire.value = true;
  } else {
    checkPasswordRequire.value = false;
  }
}, 200);

const closeUniqueEmailPopup = () => {
  uniqueEmailPopup.value = false;
  formData.isOldUser = false;
  isDisabledName.value = false;
};
</script>

<template>
  <div class="flex" v-if="isLoading.initial">
    <LoadingIcon icon="tail-spin" color="orange" class="w-6 h-6 mx-auto" />
  </div>
  <VForm
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4 mt-4"
    v-show="!isLoading.initial"
  >
    <div class="flex justify-between">
      <div class="flex flex-col">
        <label class="text-base" for="status">Active</label>
        <span class="text-slate-300 text-xs">
          Active: Control whether the operator active to make functionality.
        </span>
      </div>
      <div>
        <VSwitch
          v-model="formData.status"
          id="status"
          color="success"
          @click="onSwitchClick"
          class="cursor-pointer"
        />
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <div id="name">
        <AppTextField
          @keyup="removeError('name')"
          :readOnly="isDisabledName"
          v-model="formData.name"
          label="Name"
          placeholder="Type Here..."
          :isRequired="true"
        />
      </div>
      <div class="relative" id="role_id">
        <AppSelect
          @update:model-value="removeError('role_id')"
          :readOnly="isDisabledName"
          v-model="formData.role_id"
          :items="initialData.roles"
          label="Role"
          item-title="name"
          item-value="id"
          form-id="role_id"
          placeholder="Select Role"
          :isRequired="true"
        />
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <div id="email">
        <AppTextField
          @keyup="checkEmail()"
          v-model="formData.email"
          label="Email"
          placeholder="Type Here..."
        />
      </div>
      <div id="username">
        <AppTextField
          @keyup="changeUserName()"
          v-model="formData.username"
          label="Username"
          placeholder="Type Here..."
        />
      </div>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <div id="pin_code">
        <AppTextField
          @keyup="removeError('pin_code')"
          v-model="formData.pin_code"
          label="Pin Code"
          placeholder="Type Here..."
          :isRequired="true"
        />
      </div>
      <!-- <div id="phone">
        <AppTextField
          @keyup="removeError('phone')"
          v-model="formData.phone"
          label="Phone"
          placeholder="( +1-xxx-xxx-xxxx )"
        />
      </div> -->
      <div id="phone">
        <VLabel for="phone" class="mb-2" :text="'Phone'"> </VLabel>
        <vue-tel-input
          :readOnly="isDisabledName"
          @validate="checkPhone($event)"
          @country-changed="checkPhone($event)"
          @keyup="check(formData.phone)"
          v-model="formData.phone"
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
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <div id="password">
        <AppTextField
          @keydown="checkCapsLock"
          @keyup="checkValue"
          v-model="formData.password"
          label="Password"
          placeholder="············"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="
            isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
          "
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :hasCapsLock="capsLockActive"
          currentId="passwordId"
          :isRequired="checkPasswordRequire"
        />
      </div>
    </div>

    <div class="flex justify-end mt-4">
      <VBtn
        v-if="phone_errors != ''"
        class="w-fit px-10 text-white"
        :color="props.merchant_id > 0 ? 'black' : 'primary'"
        >Save</VBtn
      >
      <VBtn
        v-else
        type="submit"
        class="w-fit px-10 text-white"
        :color="props.merchant_id > 0 ? 'black' : 'primary'"
        >{{ isLoading.submitting ? "Loading..." : "Save" }}</VBtn
      >
    </div>
  </VForm>
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
          {{ message }}
        </div>
        <div v-if="!isAdminEmail" class="mt-4 flex justify-center">
          <VBtn :color="'warning'" @click="closeUniqueEmailPopup">No!</VBtn>
          &nbsp;&nbsp;&nbsp;
          <VBtn
            class="flex text-white"
            :color="'primary'"
            @click="
              uniqueEmailPopup = false;
              formData.isOldUser = true;
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
